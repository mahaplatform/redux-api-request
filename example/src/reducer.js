import * as actionTypes from './action_types'

const INITIAL_STATE = {
  status: 'pending',
  result: null
}

export default (state = INITIAL_STATE, action) => {

  switch (action.type) {

  case actionTypes.FETCH_REQUEST:
    return {
      ...state,
      status: 'loading'
    }

  case actionTypes.FETCH_SUCCESS:
    return {
      ...state,
      status: 'success',
      result: action.result
    }

  case actionTypes.FETCH_FAILURE:
    return {
      ...state,
      status: 'failure',
      result: action.result
    }

  default:
    return state
  }

}
