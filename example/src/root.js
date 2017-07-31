import React from 'react'
import PropTypes from 'prop-types'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createApiRequest from 'redux-api-request'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

import reducer from './reducer'

class Root extends React.Component {

  static propTypes = {
    children: PropTypes.any
  }

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
    return (
      <Provider store={ this.store }>
        { this.props.children }
      </Provider>
    )
  }

}

export default Root
