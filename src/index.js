import * as actionTypes from './action_types'
import axios from 'axios'
import _ from 'lodash'
import qs from 'qs'

export default (options = {}) => {

  const defaultHost = options.defaultHost || ''

  return store => next => action => {

    const [, namespace, type] = action.type.match(/([\a-z0-9_\.]*)?\/?([A-Z0-9_]*)/)

    if(type !== actionTypes.API_REQUEST) return next(action)

    const request_id = _.random(100000, 999999).toString(36)

    const headers = {
      'Content-Type': 'application/json',
      ...action.headers ? action.headers : {},
      ...action.token ? { 'Authorization': `Bearer ${action.token}` } : {}
    }

    const endpoint = action.endpoint.substr(0,4) !== 'http' ? `${defaultHost}${action.endpoint}` : action.endpoint

    const method = action.method ? action.method.toUpperCase() : 'GET'

    const query = action.query && method === 'GET' ? action.query : null

    const url = query ? `${endpoint}?${qs.stringify(action.query)}` : endpoint

    const data = action.body && method !== 'GET' ? action.body : {}

    const params = action.body || action.query

    const request = _.omitBy({ headers, url, method, params }, _.isNil)

    const cid = (action.cid) ? { cid: action.cid } : {}

    coerceArray(action.request).map(requestAction => {
      store.dispatch({
        type: withNamespace(namespace, requestAction),
        ...action.meta,
        ...cid,
        request_id,
        request
      })
    })


    const success = (response) => {

      const result = response.data

      coerceArray(action.success).map(successAction => {
        store.dispatch({
          type: withNamespace(namespace, successAction),
          ...action.meta,
          ...cid,
          request_id,
          result
        })
      })

      if(action.onSuccess) action.onSuccess(result)

    }

    const failure = (error) => {

      const result = error.response.data

      if(result.status === 401 && result.message === 'Expired Token') {
        store.dispatch({ type: 'API_EXPIRED_TOKEN' })
      } else if(result.status === 401) {
        store.dispatch({ type: 'API_UNAUTHENTICATED' })
      } else if(result.status === 403) {
        store.dispatch({ type: 'API_UNAUTHORIZED' })
      }

      coerceArray(action.failure).map(failureAction => {
        store.dispatch({
          type: withNamespace(namespace, failureAction),
          ...action.meta,
          ...cid,
          request_id,
          result
        })
      })

      if(action.onFailure) action.onFailure(result)

    }

    return axios({
      headers,
      url,
      method,
      data
    }).then(success).catch(failure)

  }

}

const coerceArray = (value) => {
  return value ? (!_.isArray(value) ? [value] : value) : []
}

const withNamespace = (namespace, type) => {
  return namespace ? `${namespace}/${type}` : type
}
