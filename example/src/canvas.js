import React from 'react'
import Fetcher from './fetcher'

class Canvas extends React.Component {

  render() {
    return (
      <div className="row">
        <div className="container">
          <div className="col-md-12 text-center">
            <Fetcher />
          </div>
        </div>
      </div>
    )
  }

}

export default Canvas
