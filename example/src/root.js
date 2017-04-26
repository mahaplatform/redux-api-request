import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createApiRequest from 'redux-api-request'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducer from './fetcher/reducer'

class Root extends React.Component {

  constructor(props) {

    super(props)

    const loggerMiddleware = createLogger()

    const apiRequestMiddleware = createApiRequest()

    const createStoreWithMiddleware = applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      apiRequestMiddleware
    )(createStore)

    this.store = createStoreWithMiddleware(reducer)

  }

  render() {

    const { children } = this.props

    return (
      <Provider store={ this.store }>
        { children }
      </Provider>
    )

  }

}

export default Root
