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

  const path = (action.params && method === 'GET') ? `${action.endpoint}?${qs.stringify(action.params)}` : action.endpoint

  const entity = (action.params && method !== 'GET') ? action.params : null

  const request = _.omitBy({ headers, method, path, entity }, _.isNil)

  coerceArray(action.request).map(requestAction => {
    store.dispatch({
      type: `${namespace}/${requestAction}`,
      cid: action.cid,
      request
    })
  })


  const success = (json) => {

    coerceArray(action.success).map(successAction => {
      store.dispatch({
        type: `${namespace}/${successAction}`,
        cid: action.cid,
        ...action.meta,
        ...json
      })
    })

  }

  const failure = (response) => {

    coerceArray(action.failure).map(failureAction => {
      store.dispatch({
        type: `${namespace}/${failureAction}`,
        cid: action.cid,
        ...action.meta,
        ...response.entity
      })
    })

  }

  return rest({ headers, method, path, entity }).then(response => response.entity).then(success, failure)

}

const coerceArray = (value) => {
  return value ? (!_.isArray(value) ? [value] : value) : []
}
