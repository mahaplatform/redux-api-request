import _ from 'lodash'
import qs from 'qs'
import * as actionTypes from './action_types'

export default rest => store => next => action => {

  const [string, namespace, type] = action.type.match(/([\a-z0-9_\.]*)?\/?([A-Z0-9_]*)/)

  if(type !== actionTypes.API_REQUEST) {
    return next(action)
  }

  const headers = {
    'Content-Type': 'application/json',
    ...action.headers ? action.headers : {}
  }

  const method = action.method

  const path = (action.query && method === 'GET') ? `${action.endpoint}?${qs.stringify(action.query)}` : action.endpoint

  const entity = (action.body && method !== 'GET') ? action.body : null

  const request = _.omitBy({ headers, method, path, entity }, _.isNil)

  coerceArray(action.request).map(requestAction => {
    store.dispatch({
      type: withNamespace(namespace, requestAction),
      cid: action.cid,
      request
    })
  })


  const success = (json) => {

    coerceArray(action.success).map(successAction => {
      store.dispatch({
        type: withNamespace(namespace, successAction),
        cid: action.cid,
        ...action.meta,
        result: json
      })
    })

  }

  const failure = (response) => {

    coerceArray(action.failure).map(failureAction => {
      store.dispatch({
        type: withNamespace(namespace, failureAction),
        cid: action.cid,
        ...action.meta,
        result: response.entity
      })
    })

  }

  return rest({ headers, method, path, entity }).then(response => response.entity).then(success, failure)

}

const coerceArray = (value) => {
  return value ? (!_.isArray(value) ? [value] : value) : []
}

const withNamespace = (namespace, type) => {
  return namespace ? `${namespace}/${type}` : type
}
