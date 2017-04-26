import React from 'react'
import PropTypes from 'prop-types'
import * as actions from './actions'
import { connect } from 'react-redux'

class Fetcher extends React.Component {

  static propTypes = {
    status: PropTypes.string,
    result: PropTypes.object,
    onFetch: PropTypes.func
  }

  render() {
    const { result, status } = this.props
    return (
      <div>
        <button className='btn-success' onClick={ this._handleSuccess.bind(this) }>Success</button>
        <button className='btn-danger' onClick={ this._handleFailure.bind(this) }>Failure</button>
        <p>
          <strong>STATUS:</strong><br />
          { status }
        </p>
        <p>
          <strong>RESULT:</strong><br />
          { JSON.stringify(result) }
        </p>
      </div>
    )
  }

  _handleSuccess() {
    this.props.onFetch('GET', '/success')
  }

  _handleFailure() {
    this.props.onFetch('GET', '/failure')
  }

}

const mapStateToProps = state => ({
  status: state.status,
  result: state.result
})

const mapDispatchToProps = {
  onFetch: actions.fetch
}

export default connect(mapStateToProps, mapDispatchToProps)(Fetcher)
