'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _rest = require('rest');

var _rest2 = _interopRequireDefault(_rest);

var _params = require('rest/interceptor/params');

var _params2 = _interopRequireDefault(_params);

var _mime = require('rest/interceptor/mime');

var _mime2 = _interopRequireDefault(_mime);

var _defaultRequest = require('rest/interceptor/defaultRequest');

var _defaultRequest2 = _interopRequireDefault(_defaultRequest);

var _errorCode = require('rest/interceptor/errorCode');

var _errorCode2 = _interopRequireDefault(_errorCode);

var _action_types = require('./action_types');

var actionTypes = _interopRequireWildcard(_action_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultClient = _rest2.default.wrap(_params2.default).wrap(_mime2.default).wrap(_defaultRequest2.default).wrap(_errorCode2.default);

exports.default = function () {
  var client = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultClient;


  return function (store) {
    return function (next) {
      return function (action) {
        var _action$type$match = action.type.match(/([\a-z0-9_\.]*)?\/?([A-Z0-9_]*)/),
            _action$type$match2 = _slicedToArray(_action$type$match, 3),
            namespace = _action$type$match2[1],
            type = _action$type$match2[2];

        if (type !== actionTypes.API_REQUEST) return next(action);

        var headers = _extends({
          'Content-Type': 'application/json'
        }, action.headers ? action.headers : {}, action.token ? { 'Authorization': 'Bearer ' + action.token } : {});

        var method = action.method ? action.method.toUpperCase() : 'GET';

        var path = action.query && method === 'GET' ? action.endpoint + '?' + _qs2.default.stringify(action.query) : action.endpoint;

        var entity = action.body && method !== 'GET' ? action.body : {};

        var params = action.body || action.query;

        var request = _lodash2.default.omitBy({ headers: headers, method: method, path: path, params: params }, _lodash2.default.isNil);

        var cid = action.cid ? { cid: action.cid } : {};

        coerceArray(action.request).map(function (requestAction) {
          store.dispatch(_extends({
            type: withNamespace(namespace, requestAction)
          }, action.meta, cid, {
            request: request
          }));
        });

        var success = function success(response) {

          var result = response.entity;

          coerceArray(action.success).map(function (successAction) {
            store.dispatch(_extends({
              type: withNamespace(namespace, successAction)
            }, action.meta, cid, {
              result: result
            }));
          });

          if (action.onSuccess) action.onSuccess(result);
        };

        var failure = function failure(response) {

          var result = response.entity;

          if (response.status.code === 401) store.dispatch({ type: 'API_UNAUTHENTICATED' });

          if (response.status.code === 403) store.dispatch({ type: 'API_UNAUTHORIZED' });

          coerceArray(action.failure).map(function (failureAction) {
            store.dispatch(_extends({
              type: withNamespace(namespace, failureAction)
            }, action.meta, cid, {
              result: result
            }));
          });

          if (action.onFailure) action.onFailure(result);
        };

        return client({ headers: headers, method: method, path: path, entity: entity }).then(success, failure);
      };
    };
  };
};

var coerceArray = function coerceArray(value) {
  return value ? !_lodash2.default.isArray(value) ? [value] : value : [];
};

var withNamespace = function withNamespace(namespace, type) {
  return namespace ? namespace + '/' + type : type;
};