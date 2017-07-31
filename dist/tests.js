'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _chai = require('chai');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mockRest = function mockRest(options) {
  return {

    then: function then(success, failure) {

      if (options.path == '/failure') {

        return failure({
          status: {
            code: 500
          }
        });
      }

      success({
        entity: {}
      });
    }

  };
};

var middleware = (0, _index2.default)(mockRest);

describe('api middleware', function () {

  var successAction = {
    type: 'foo/API_REQUEST',
    method: 'GET',
    endpoint: '/success'
  };

  var failureAction = {
    type: 'foo/API_REQUEST',
    method: 'GET',
    endpoint: '/failure'
  };

  it('allows non-api actions to pass through', function (done) {

    var store = {};

    var next = function next() {
      done();
    };

    var action = {
      type: 'foo/BAR'
    };

    (0, _index2.default)(mockRest)(store)(next)(action);
  });

  it('dispatches as single request', function (done) {
    return dispatchesSingleAction(successAction, 'request', done);
  });

  it('dispatches as mulitple request', function (done) {
    return dispatchesMultipleActions(successAction, 'request', done);
  });

  it('dispatches as single success', function (done) {
    return dispatchesSingleAction(successAction, 'success', done);
  });

  it('dispatches as mulitple success', function (done) {
    return dispatchesMultipleActions(successAction, 'success', done);
  });

  it('dispatches as single failure', function (done) {
    return dispatchesSingleAction(failureAction, 'failure', done);
  });

  it('dispatches as mulitple failure', function (done) {
    return dispatchesMultipleActions(failureAction, 'failure', done);
  });

  // it('request returns appropriate value', (done) => returnsAppropriateValue(successAction, 'request', { }, done))
  //
  // it('success returns appropriate value', (done) => returnsAppropriateValue(successAction, 'success', { }, done))
  //
  // it('response returns appropriate value', (done) => returnsAppropriateValue(failureAction, 'failure', { }, done))
});

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

var dispatchesSingleAction = function dispatchesSingleAction(action, actionType, done) {

  var store = {
    dispatch: function dispatch(action) {
      if (action.type === 'foo/' + actionType.toUpperCase()) {
        done();
      }
    }
  };

  var next = function next() {};

  var actionWithCallback = _extends({}, action, _defineProperty({}, actionType, actionType.toUpperCase()));

  middleware(store)(next)(actionWithCallback);
};

var dispatchesMultipleActions = function dispatchesMultipleActions(action, actionType, done) {

  var store = {
    dispatch: function dispatch(action) {
      if (action.type === 'foo/${actionType.toUpperCase()}2') {
        done();
      }
    }
  };

  var next = function next() {};

  var actionWithCallback = _extends({}, action, {
    request: ['${actionType.toUpperCase()}1', '${actionType.toUpperCase()}2']
  });

  middleware(store)(next)(actionWithCallback);
};