import _ from 'lodash'
import qs from 'qs'
import rest from 'rest'
import params from 'rest/interceptor/params'
import mime from 'rest/interceptor/mime'
import defaultRequest from 'rest/interceptor/defaultRequest'
import errorCode from 'rest/interceptor/errorCode'
import * as actionTypes from './action_types'

const defaultClient = rest.wrap(params).wrap(mime).wrap(defaultRequest).wrap(errorCode)

export default (client = defaultClient) => store => next => action => {

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
      ...action.meta,
      request
    })
  })


  const success = (json) => {

    coerceArray(action.success).map(successAction => {
      store.dispatch({
        type: withNamespace(namespace, successAction),
        ...action.meta,
        result: json
      })
    })

  }

  const failure = (response) => {

    coerceArray(action.failure).map(failureAction => {
      store.dispatch({
        type: withNamespace(namespace, failureAction),
        ...action.meta,
        result: response.entity
      })
    })

  }

  return client({ headers, method, path, entity }).then(response => response.entity).then(success, failure)

}

const coerceArray = (value) => {
  return value ? (!_.isArray(value) ? [value] : value) : []
}

const withNamespace = (namespace, type) => {
  return namespace ? `${namespace}/${type}` : type
}
