import { expect } from 'chai'
import apiMiddleware from './index'

const mockRest = (options) => ({

  then: (success, failure) => {

    if(options.path == '/failure') {

      return failure({
        status: {
          code: 500
        }
      })

    }

    success({
      entity: {}
    })

  }

})

const middleware = apiMiddleware(mockRest)

describe('api middleware', () => {

  const successAction = {
    type: 'foo/API_REQUEST',
    method: 'GET',
    endpoint: '/success'
  }

  const failureAction = {
    type: 'foo/API_REQUEST',
    method: 'GET',
    endpoint: '/failure'
  }

  it('allows non-api actions to pass through', (done) => {

    const store = {}

    const next = () => {
      done()
    }

    const action = {
      type: 'foo/BAR'
    }

    apiMiddleware(mockRest)(store)(next)(action)

  })

  it('dispatches as single request', (done) =>  dispatchesSingleAction(successAction, 'request', done))

  it('dispatches as mulitple request', (done) =>  dispatchesMultipleActions(successAction, 'request', done))

  it('dispatches as single success', (done) =>  dispatchesSingleAction(successAction, 'success', done))

  it('dispatches as mulitple success', (done) =>  dispatchesMultipleActions(successAction, 'success', done))

  it('dispatches as single failure', (done) =>  dispatchesSingleAction(failureAction, 'failure', done))

  it('dispatches as mulitple failure', (done) =>  dispatchesMultipleActions(failureAction, 'failure', done))

  // it('request returns appropriate value', (done) => returnsAppropriateValue(successAction, 'request', { }, done))
  //
  // it('success returns appropriate value', (done) => returnsAppropriateValue(successAction, 'success', { }, done))
  //
  // it('response returns appropriate value', (done) => returnsAppropriateValue(failureAction, 'failure', { }, done))

})

// const returnsAppropriateValue = (action, type, value, done) => {
//
//   const store = {
//
//     dispatch: (action) => {
//
//       if(action.type === `foo/${type.toUpperCase()}`) {
//
//         expect(action).to.eql({
//           type: `foo/${type.toUpperCase()}`,
//           ...value
//         })
//
//         done()
//
//       }
//
//     }
//
//   }
//
//   const next = () => {}
//
//   const actionWithCallback = {
//     ...action,
//     [type]: `${type.toUpperCase()}`
//   }
//
//   middleware(store)(next)(actionWithCallback)
//
// }

const dispatchesSingleAction = (action, actionType, done) => {

  const store = {
    dispatch: (action) => {
      if(action.type === `foo/${actionType.toUpperCase()}`) {
        done()
      }
    }
  }

  const next = () => {}

  const actionWithCallback = {
    ...action,
    [actionType]: actionType.toUpperCase()
  }

  middleware(store)(next)(actionWithCallback)

}

const dispatchesMultipleActions = (action, actionType, done) => {

  const store = {
    dispatch: (action) => {
      if(action.type === 'foo/${actionType.toUpperCase()}2') {
        done()
      }
    }
  }

  const next = () => {}

  const actionWithCallback = {
    ...action,
    request: ['${actionType.toUpperCase()}1','${actionType.toUpperCase()}2']
  }

  middleware(store)(next)(actionWithCallback)

}
