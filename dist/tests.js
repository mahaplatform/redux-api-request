'use strict';

var _chai = require('chai');

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe('api middleware', function () {

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
    return dispatchSingleAction('request', done);
  });

  it('dispatches as mulitple request', function (done) {
    return dispatchMultipleActions('request', done);
  });

  it('dispatches as single success', function (done) {
    return dispatchSingleAction('success', done);
  });

  it('dispatches as mulitple success', function (done) {
    return dispatchMultipleActions('success', done);
  });

  it('dispatches as single failure', function (done) {
    return dispatchSingleAction('failure', done);
  });

  it('dispatches as mulitple failure', function (done) {
    return dispatchMultipleActions('failure', done);
  });
});

var mockRest = function mockRest(options) {
  return {
    then: function then(fn) {
      return {
        then: function then(success, failure) {

          var response = {
            entity: {}
          };

          if (options.path == '/failure') return failure(response);

          success(response);
        }
      };
    }
  };
};

var dispatchSingleAction = function dispatchSingleAction(type, done) {

  var store = {
    dispatch: function dispatch(action) {
      if (action.type === 'foo/FETCH_' + type.toUpperCase()) {
        done();
      }
    }
  };

  var next = function next() {};

  var action = _defineProperty({
    type: 'foo/API_REQUEST',
    endpoint: '/' + type
  }, type, 'FETCH_' + type.toUpperCase());

  (0, _index2.default)(mockRest)(store)(next)(action);
};

var dispatchMultipleActions = function dispatchMultipleActions(type, done) {

  var store = {
    dispatch: function dispatch(action) {
      if (action.type === 'foo/FETCH_${type.toUpperCase()}2') {
        done();
      }
    }
  };

  var next = function next() {};

  var action = {
    type: 'foo/API_REQUEST',
    endpoint: '/' + type,
    request: ['FETCH_${type.toUpperCase()}1', 'FETCH_${type.toUpperCase()}2']
  };

  (0, _index2.default)(mockRest)(store)(next)(action);
};