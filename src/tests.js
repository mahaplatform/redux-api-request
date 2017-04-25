
import { expect } from 'chai'
import apiMiddleware from './index'

describe('api middleware', () => {

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

  it('dispatches as single request', (done) =>  dispatchSingleAction('request', done))

  it('dispatches as mulitple request', (done) =>  dispatchMultipleActions('request', done))

  it('dispatches as single success', (done) =>  dispatchSingleAction('success', done))

  it('dispatches as mulitple success', (done) =>  dispatchMultipleActions('success', done))

  it('dispatches as single failure', (done) =>  dispatchSingleAction('failure', done))

  it('dispatches as mulitple failure', (done) =>  dispatchMultipleActions('failure', done))

})

const mockRest = (options) => {
  return ({
    then: (fn) => ({
      then: (success, failure) => {

        const response = {
          entity: {}
        }

        if(options.path == '/failure') return failure(response)

        success(response)

      }
    })
  })
}

const dispatchSingleAction = (type, done) => {

  const store = {
    dispatch: (action) => {
      if(action.type === `foo/FETCH_${type.toUpperCase()}`) {
        done()
      }
    }
  }

  const next = () => {}

  const action = {
    type: 'foo/API_REQUEST',
    endpoint: `/${type}`,
    [type]: `FETCH_${type.toUpperCase()}`
  }

  apiMiddleware(mockRest)(store)(next)(action)

}

const dispatchMultipleActions = (type, done) => {

  const store = {
    dispatch: (action) => {
      if(action.type === 'foo/FETCH_${type.toUpperCase()}2') {
        done()
      }
    }
  }

  const next = () => {}

  const action = {
    type: 'foo/API_REQUEST',
    endpoint: `/${type}`,
    request: ['FETCH_${type.toUpperCase()}1','FETCH_${type.toUpperCase()}2']
  }

  apiMiddleware(mockRest)(store)(next)(action)

}
