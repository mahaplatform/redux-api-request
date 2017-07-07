<img src="https://raw.githubusercontent.com/mahaplatform/redux-api-request/master/docs/logo.png" title="Redux API Request" alt="Redux API Request" />

<a href="https://circleci.com/gh/mahaplatform/redux-api-request">
  <img src="https://img.shields.io/circleci/project/mahaplatform/redux-api-request.svg?maxAge=600" alt="Build Status" >
</a>
<a href="https://codeclimate.com/github/mahaplatform/redux-api-request">
  <img src="https://img.shields.io/codeclimate/github/mahaplatform/redux-api-request.svg?maxAge=600" alt="Code Climate" />
</a>
<a href="https://codeclimate.com/github/mahaplatform/redux-api-request/coverage">
  <img src="https://img.shields.io/codeclimate/coverage/github/mahaplatform/redux-api-request.svg?maxAge=600" alt="Code Coverage" />
</a>

Redux middleware for making api requests

## Installation
Install with [npm](http://npmjs.com) or [yarn](https://yarnpkg.com):

```sh
npm install --save redux-api-request
```

## Usage
Using redux-api-request in your application is easy:

```javascript
# install middleware
import createApiRequest from 'redux-api-request'
import thunkMiddleware from 'redux-thunk'
import reducer from './reducer'

const apiRequestMiddleware = createApiRequest()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  apiRequestMiddleware
)(createStore)

const store = createStoreWithMiddleware(reducer)

# action creator
import { API_REQUEST } from 'redux-api-request/action_types'

export const signin = (email, password) => ({
  type: API_REQUEST,
  method: 'POST',
  endpoint: '/admin/signin',
  body: { email, password },
  request: SIGNIN_REQUEST,
  success: SIGNIN_SUCCESS,
  failure: SIGNIN_FAILURE
})
```

[View example app](https://github.com/mahaplatform/redux-api-request/tree/master/example)

## Author & Credits

redux-api-request was originally written by [Greg Kops](https://github.com/mochini) and
is based upon his work with [Think Topography](http://thinktopography.com) and
[The Cornell Cooperative Extension of Tompkins County](http://ccetompkins.org)
