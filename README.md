# redux-api-request

<a href="https://circleci.com/gh/thinktopography/redux-api-request">
  <img src="https://img.shields.io/circleci/project/thinktopography/redux-api-request.svg?maxAge=600" alt="Build Status" >
</a>
<a href="https://codeclimate.com/github/thinktopography/redux-api-request">
  <img src="https://img.shields.io/codeclimate/github/thinktopography/redux-api-request.svg?maxAge=600" alt="Code Climate" />
</a>
<a href="https://codeclimate.com/github/thinktopography/redux-api-request/coverage">
  <img src="https://img.shields.io/codeclimate/coverage/github/thinktopography/redux-api-request.svg?maxAge=600" alt="Code Coverage" />
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
import { API_REQUEST } from 'redux-api-request/action_types'

# action creator
export const signin = (email, password) => ({
  type: API_REQUEST,
  method: 'POST',
  endpoint: '/admin/signin',
  params: { email, password },
  request: actionTypes.SIGNIN_REQUEST,
  success: actionTypes.SIGNIN_SUCCESS,
  failure: actionTypes.SIGNIN_FAILURE
})
```
