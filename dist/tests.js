"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _chai = require("chai");
var _index = /*#__PURE__*/ _interopRequireDefault(require("./index"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpreadProps(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var mockRest = function(options) {
    return {
        then: function(success, failure) {
            if (options.path == "/failure") {
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
var middleware = (0, _index.default)(mockRest);
describe("api middleware", function() {
    var successAction = {
        type: "foo/API_REQUEST",
        method: "GET",
        endpoint: "/success"
    };
    var failureAction = {
        type: "foo/API_REQUEST",
        method: "GET",
        endpoint: "/failure"
    };
    it("allows non-api actions to pass through", function(done) {
        var store = {};
        var next = function() {
            done();
        };
        var action = {
            type: "foo/BAR"
        };
        (0, _index.default)(mockRest)(store)(next)(action);
    });
    it("dispatches as single request", function(done) {
        return dispatchesSingleAction(successAction, "request", done);
    });
    it("dispatches as mulitple request", function(done) {
        return dispatchesMultipleActions(successAction, "request", done);
    });
    it("dispatches as single success", function(done) {
        return dispatchesSingleAction(successAction, "success", done);
    });
    it("dispatches as mulitple success", function(done) {
        return dispatchesMultipleActions(successAction, "success", done);
    });
    it("dispatches as single failure", function(done) {
        return dispatchesSingleAction(failureAction, "failure", done);
    });
    it("dispatches as mulitple failure", function(done) {
        return dispatchesMultipleActions(failureAction, "failure", done);
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
var dispatchesSingleAction = function(action, actionType, done) {
    var store = {
        dispatch: function(action) {
            if (action.type === "foo/".concat(actionType.toUpperCase())) {
                done();
            }
        }
    };
    var next = function() {};
    var actionWithCallback = _objectSpreadProps(_objectSpread({}, action), _defineProperty({}, actionType, actionType.toUpperCase()));
    middleware(store)(next)(actionWithCallback);
};
var dispatchesMultipleActions = function(action, actionType, done) {
    var store = {
        dispatch: function(action) {
            if (action.type === "foo/${actionType.toUpperCase()}2") {
                done();
            }
        }
    };
    var next = function() {};
    var actionWithCallback = _objectSpreadProps(_objectSpread({}, action), {
        request: [
            "${actionType.toUpperCase()}1",
            "${actionType.toUpperCase()}2"
        ]
    });
    middleware(store)(next)(actionWithCallback);
};
