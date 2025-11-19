// Context Engine Bundle - Auto-generated
// DO NOT EDIT MANUALLY

var ContextEngineBridge = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

  // node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
      return typeof o2;
    } : function(o2) {
      return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
    }, _typeof(o);
  }
  var init_typeof = __esm({
    "node_modules/@babel/runtime/helpers/esm/typeof.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/toPrimitive.js
  function toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  var init_toPrimitive = __esm({
    "node_modules/@babel/runtime/helpers/esm/toPrimitive.js"() {
      init_typeof();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
  function toPropertyKey(t) {
    var i = toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }
  var init_toPropertyKey = __esm({
    "node_modules/@babel/runtime/helpers/esm/toPropertyKey.js"() {
      init_typeof();
      init_toPrimitive();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/createClass.js
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  var init_createClass = __esm({
    "node_modules/@babel/runtime/helpers/esm/createClass.js"() {
      init_toPropertyKey();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-array.js
  function lastOfArray(ar) {
    return ar[ar.length - 1];
  }
  function toArray(input) {
    return Array.isArray(input) ? input.slice(0) : [input];
  }
  function batchArray(array, batchSize) {
    array = array.slice(0);
    var ret = [];
    while (array.length) {
      var batch = array.splice(0, batchSize);
      ret.push(batch);
    }
    return ret;
  }
  function isMaybeReadonlyArray(x) {
    return Array.isArray(x);
  }
  function countUntilNotMatching(ar, matchingFn) {
    var count = 0;
    var idx = -1;
    for (var item of ar) {
      idx = idx + 1;
      var matching = matchingFn(item, idx);
      if (matching) {
        count = count + 1;
      } else {
        break;
      }
    }
    return count;
  }
  function appendToArray(ar, add3) {
    var addSize = add3.length;
    if (addSize === 0) {
      return;
    }
    var baseSize = ar.length;
    ar.length = baseSize + add3.length;
    for (var i = 0; i < addSize; ++i) {
      ar[baseSize + i] = add3[i];
    }
  }
  function uniqueArray(arrArg) {
    return arrArg.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) === pos;
    });
  }
  var init_utils_array = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-array.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-base64.js
  var init_utils_base64 = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-base64.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-blob.js
  var init_utils_blob = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-blob.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-revision.js
  function getHeightOfRevision(revision) {
    var useChars = "";
    for (var index = 0; index < revision.length; index++) {
      var char = revision[index];
      if (char === "-") {
        return parseInt(useChars, 10);
      }
      useChars += char;
    }
    throw new Error("malformatted revision: " + revision);
  }
  function createRevision(databaseInstanceToken, previousDocData) {
    var newRevisionHeight = !previousDocData ? 1 : getHeightOfRevision(previousDocData._rev) + 1;
    return newRevisionHeight + "-" + databaseInstanceToken;
  }
  var init_utils_revision = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-revision.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-object.js
  function objectPathMonad(objectPath) {
    var split = objectPath.split(".");
    var splitLength = split.length;
    if (splitLength === 1) {
      return (obj) => obj[objectPath];
    }
    return (obj) => {
      var currentVal = obj;
      for (var i = 0; i < splitLength; ++i) {
        var subPath = split[i];
        currentVal = currentVal[subPath];
        if (typeof currentVal === "undefined") {
          return currentVal;
        }
      }
      return currentVal;
    };
  }
  function flatClone(obj) {
    return Object.assign({}, obj);
  }
  function firstPropertyNameOfObject(obj) {
    return Object.keys(obj)[0];
  }
  function sortObject(obj, noArraySort = false) {
    if (!obj) return obj;
    if (!noArraySort && Array.isArray(obj)) {
      return obj.sort((a, b) => {
        if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
        if (typeof a === "object") return 1;
        else return -1;
      }).map((i) => sortObject(i, noArraySort));
    }
    if (typeof obj === "object" && !Array.isArray(obj)) {
      var out = {};
      Object.keys(obj).sort((a, b) => a.localeCompare(b)).forEach((key) => {
        out[key] = sortObject(obj[key], noArraySort);
      });
      return out;
    }
    return obj;
  }
  function deepClone(src) {
    if (!src) {
      return src;
    }
    if (src === null || typeof src !== "object") {
      return src;
    }
    if (Array.isArray(src)) {
      var ret = new Array(src.length);
      var i = ret.length;
      while (i--) {
        ret[i] = deepClone(src[i]);
      }
      return ret;
    }
    var dest = {};
    for (var key in src) {
      dest[key] = deepClone(src[key]);
    }
    return dest;
  }
  function overwriteGetterForCaching(obj, getterName, value) {
    Object.defineProperty(obj, getterName, {
      get: function() {
        return value;
      }
    });
    return value;
  }
  var clone;
  var init_utils_object = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-object.js"() {
      clone = deepClone;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-document.js
  function getDefaultRxDocumentMeta() {
    return {
      /**
       * Set this to 1 to not waste performance
       * while calling new Date()..
       * The storage wrappers will anyway update
       * the lastWrite time while calling transformDocumentDataFromRxDBToRxStorage()
       */
      lwt: RX_META_LWT_MINIMUM
    };
  }
  function getDefaultRevision() {
    return "";
  }
  function stripMetaDataFromDocument(docData) {
    return Object.assign({}, docData, {
      _meta: void 0,
      _deleted: void 0,
      _rev: void 0
    });
  }
  function areRxDocumentArraysEqual(primaryPath, ar1, ar2) {
    if (ar1.length !== ar2.length) {
      return false;
    }
    var i = 0;
    var len = ar1.length;
    while (i < len) {
      var row1 = ar1[i];
      var row2 = ar2[i];
      i++;
      if (row1[primaryPath] !== row2[primaryPath] || row1._rev !== row2._rev || row1._meta.lwt !== row2._meta.lwt) {
        return false;
      }
    }
    return true;
  }
  var RX_META_LWT_MINIMUM;
  var init_utils_document = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-document.js"() {
      RX_META_LWT_MINIMUM = 1;
    }
  });

  // node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
      return t2.__proto__ = e2, t2;
    }, _setPrototypeOf(t, e);
  }
  var init_setPrototypeOf = __esm({
    "node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/inheritsLoose.js
  function _inheritsLoose(t, o) {
    t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
  }
  var init_inheritsLoose = __esm({
    "node_modules/@babel/runtime/helpers/esm/inheritsLoose.js"() {
      init_setPrototypeOf();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
      return t2.__proto__ || Object.getPrototypeOf(t2);
    }, _getPrototypeOf(t);
  }
  var init_getPrototypeOf = __esm({
    "node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
  function _isNativeFunction(t) {
    try {
      return -1 !== Function.toString.call(t).indexOf("[native code]");
    } catch (n) {
      return "function" == typeof t;
    }
  }
  var init_isNativeFunction = __esm({
    "node_modules/@babel/runtime/helpers/esm/isNativeFunction.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t2) {
    }
    return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
      return !!t;
    })();
  }
  var init_isNativeReflectConstruct = __esm({
    "node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/construct.js
  function _construct(t, e, r) {
    if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
    var o = [null];
    o.push.apply(o, e);
    var p = new (t.bind.apply(t, o))();
    return r && _setPrototypeOf(p, r.prototype), p;
  }
  var init_construct = __esm({
    "node_modules/@babel/runtime/helpers/esm/construct.js"() {
      init_isNativeReflectConstruct();
      init_setPrototypeOf();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
  function _wrapNativeSuper(t) {
    var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
    return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
      if (null === t2 || !_isNativeFunction(t2)) return t2;
      if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
      if (void 0 !== r) {
        if (r.has(t2)) return r.get(t2);
        r.set(t2, Wrapper);
      }
      function Wrapper() {
        return _construct(t2, arguments, _getPrototypeOf(this).constructor);
      }
      return Wrapper.prototype = Object.create(t2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      }), _setPrototypeOf(Wrapper, t2);
    }, _wrapNativeSuper(t);
  }
  var init_wrapNativeSuper = __esm({
    "node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js"() {
      init_getPrototypeOf();
      init_setPrototypeOf();
      init_isNativeFunction();
      init_construct();
    }
  });

  // node_modules/rxdb/dist/esm/overwritable.js
  var overwritable;
  var init_overwritable = __esm({
    "node_modules/rxdb/dist/esm/overwritable.js"() {
      overwritable = {
        /**
         * if this method is overwritten with one
         * that returns true, we do additional checks
         * which help the developer but have bad performance
         */
        isDevMode() {
          return false;
        },
        /**
         * Deep freezes and object when in dev-mode.
         * Deep-Freezing has the same performance as deep-cloning, so we only do that in dev-mode.
         * Also, we can ensure the readonly state via typescript
         * @link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
         */
        deepFreezeWhenDevMode(obj) {
          return obj;
        },
        /**
         * overwritten to map error-codes to text-messages
         */
        tunnelErrorMessage(message) {
          return "\n        RxDB Error-Code: " + message + ".\n        Hint: Error messages are not included in RxDB core to reduce build size.\n        To show the full error messages and to ensure that you do not make any mistakes when using RxDB,\n        use the dev-mode plugin when you are in development mode: https://rxdb.info/dev-mode.html?console=error\n        ";
        }
      };
    }
  });

  // node_modules/rxdb/dist/esm/rx-error.js
  function parametersToString(parameters) {
    var ret = "";
    if (Object.keys(parameters).length === 0) return ret;
    ret += "-".repeat(20) + "\n";
    ret += "Parameters:\n";
    ret += Object.keys(parameters).map((k) => {
      var paramStr = "[object Object]";
      try {
        if (k === "errors") {
          paramStr = parameters[k].map((err) => JSON.stringify(err, Object.getOwnPropertyNames(err)));
        } else {
          paramStr = JSON.stringify(parameters[k], function(_k, v) {
            return v === void 0 ? null : v;
          }, 2);
        }
      } catch (e) {
      }
      return k + ": " + paramStr;
    }).join("\n");
    ret += "\n";
    return ret;
  }
  function messageForError(message, code, parameters) {
    return "\n" + message + "\n" + parametersToString(parameters);
  }
  function getErrorUrl(code) {
    return "https://rxdb.info/errors.html?console=errors#" + code;
  }
  function errorUrlHint(code) {
    return "\nFind out more about this error here: " + getErrorUrl(code) + " \n";
  }
  function newRxError(code, parameters) {
    return new RxError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
  }
  function newRxTypeError(code, parameters) {
    return new RxTypeError(code, overwritable.tunnelErrorMessage(code) + errorUrlHint(code), parameters);
  }
  function isBulkWriteConflictError(err) {
    if (err && err.status === 409) {
      return err;
    } else {
      return false;
    }
  }
  function rxStorageWriteErrorToRxError(err) {
    return newRxError("COL20", {
      name: STORAGE_WRITE_ERROR_CODE_TO_MESSAGE[err.status],
      document: err.documentId,
      writeError: err
    });
  }
  var RxError, RxTypeError, STORAGE_WRITE_ERROR_CODE_TO_MESSAGE;
  var init_rx_error = __esm({
    "node_modules/rxdb/dist/esm/rx-error.js"() {
      init_createClass();
      init_inheritsLoose();
      init_wrapNativeSuper();
      init_overwritable();
      RxError = /* @__PURE__ */ (function(_Error) {
        function RxError2(code, message, parameters = {}) {
          var _this;
          var mes = messageForError(message, code, parameters);
          _this = _Error.call(this, mes) || this;
          _this.code = code;
          _this.message = mes;
          _this.url = getErrorUrl(code);
          _this.parameters = parameters;
          _this.rxdb = true;
          return _this;
        }
        _inheritsLoose(RxError2, _Error);
        var _proto = RxError2.prototype;
        _proto.toString = function toString() {
          return this.message;
        };
        return _createClass(RxError2, [{
          key: "name",
          get: function() {
            return "RxError (" + this.code + ")";
          }
        }, {
          key: "typeError",
          get: function() {
            return false;
          }
        }]);
      })(/* @__PURE__ */ _wrapNativeSuper(Error));
      RxTypeError = /* @__PURE__ */ (function(_TypeError) {
        function RxTypeError2(code, message, parameters = {}) {
          var _this2;
          var mes = messageForError(message, code, parameters);
          _this2 = _TypeError.call(this, mes) || this;
          _this2.code = code;
          _this2.message = mes;
          _this2.url = getErrorUrl(code);
          _this2.parameters = parameters;
          _this2.rxdb = true;
          return _this2;
        }
        _inheritsLoose(RxTypeError2, _TypeError);
        var _proto2 = RxTypeError2.prototype;
        _proto2.toString = function toString() {
          return this.message;
        };
        return _createClass(RxTypeError2, [{
          key: "name",
          get: function() {
            return "RxTypeError (" + this.code + ")";
          }
        }, {
          key: "typeError",
          get: function() {
            return true;
          }
        }]);
      })(/* @__PURE__ */ _wrapNativeSuper(TypeError));
      STORAGE_WRITE_ERROR_CODE_TO_MESSAGE = {
        409: "document write conflict",
        422: "schema validation error",
        510: "attachment data missing"
      };
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-hash.js
  function getHashFn() {
    if (hashFn) {
      return hashFn;
    }
    if (typeof crypto === "undefined" || typeof crypto.subtle === "undefined" || typeof crypto.subtle.digest !== "function") {
      throw newRxError("UT8", {
        args: {
          typeof_crypto: typeof crypto,
          typeof_crypto_subtle: typeof crypto?.subtle,
          typeof_crypto_subtle_digest: typeof crypto?.subtle?.digest
        }
      });
    }
    hashFn = crypto.subtle.digest.bind(crypto.subtle);
    return hashFn;
  }
  async function nativeSha256(input) {
    var data = new TextEncoder().encode(input);
    var hashBuffer = await getHashFn()("SHA-256", data);
    var hash = Array.prototype.map.call(new Uint8Array(hashBuffer), (x) => ("00" + x.toString(16)).slice(-2)).join("");
    return hash;
  }
  var hashFn, defaultHashSha256;
  var init_utils_hash = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-hash.js"() {
      init_rx_error();
      defaultHashSha256 = nativeSha256;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-promise.js
  function nextTick() {
    return new Promise((res) => setTimeout(res, 0));
  }
  function promiseWait(ms = 0) {
    return new Promise((res) => setTimeout(res, ms));
  }
  function toPromise(maybePromise) {
    if (maybePromise && typeof maybePromise.then === "function") {
      return maybePromise;
    } else {
      return Promise.resolve(maybePromise);
    }
  }
  function requestIdlePromiseNoQueue(timeout = 1e4) {
    if (typeof requestIdleCallback === "function") {
      return new Promise((res) => {
        requestIdleCallback(() => res(), {
          timeout
        });
      });
    } else {
      return promiseWait(0);
    }
  }
  function requestIdlePromise(timeout = void 0) {
    idlePromiseQueue = idlePromiseQueue.then(() => {
      return requestIdlePromiseNoQueue(timeout);
    });
    return idlePromiseQueue;
  }
  function promiseSeries(tasks, initial) {
    return tasks.reduce((current, next) => current.then(next), Promise.resolve(initial));
  }
  var PROMISE_RESOLVE_TRUE, PROMISE_RESOLVE_FALSE, PROMISE_RESOLVE_NULL, PROMISE_RESOLVE_VOID, idlePromiseQueue;
  var init_utils_promise = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-promise.js"() {
      PROMISE_RESOLVE_TRUE = Promise.resolve(true);
      PROMISE_RESOLVE_FALSE = Promise.resolve(false);
      PROMISE_RESOLVE_NULL = Promise.resolve(null);
      PROMISE_RESOLVE_VOID = Promise.resolve();
      idlePromiseQueue = PROMISE_RESOLVE_VOID;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-regex.js
  var REGEX_ALL_DOTS;
  var init_utils_regex = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-regex.js"() {
      REGEX_ALL_DOTS = /\./g;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-string.js
  function randomToken(length = 10) {
    var text = "";
    for (var i = 0; i < length; i++) {
      text += COUCH_NAME_CHARS.charAt(Math.floor(Math.random() * COUCH_NAME_CHARS.length));
    }
    return text;
  }
  function ucfirst(str) {
    str += "";
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
  }
  function trimDots(str) {
    while (str.charAt(0) === ".") {
      str = str.substr(1);
    }
    while (str.slice(-1) === ".") {
      str = str.slice(0, -1);
    }
    return str;
  }
  var COUCH_NAME_CHARS;
  var init_utils_string = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-string.js"() {
      COUCH_NAME_CHARS = "abcdefghijklmnopqrstuvwxyz";
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-number.js
  var init_utils_number = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-number.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-object-deep-equal.js
  function deepEqual(a, b) {
    if (a === b) return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor) return false;
      var length;
      var i;
      if (Array.isArray(a)) {
        length = a.length;
        if (length !== b.length) return false;
        for (i = length; i-- !== 0; ) if (!deepEqual(a[i], b[i])) return false;
        return true;
      }
      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
      var keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;
      for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    return a !== a && b !== b;
  }
  var init_utils_object_deep_equal = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-object-deep-equal.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-object-dot-prop.js
  function getPathSegments(path) {
    var parts = [];
    var currentSegment = "";
    var currentPart = "start";
    var isIgnoring = false;
    for (var character of path) {
      switch (character) {
        case "\\": {
          if (currentPart === "index") {
            throw new Error("Invalid character in an index");
          }
          if (currentPart === "indexEnd") {
            throw new Error("Invalid character after an index");
          }
          if (isIgnoring) {
            currentSegment += character;
          }
          currentPart = "property";
          isIgnoring = !isIgnoring;
          break;
        }
        case ".": {
          if (currentPart === "index") {
            throw new Error("Invalid character in an index");
          }
          if (currentPart === "indexEnd") {
            currentPart = "property";
            break;
          }
          if (isIgnoring) {
            isIgnoring = false;
            currentSegment += character;
            break;
          }
          if (disallowedKeys.has(currentSegment)) {
            return [];
          }
          parts.push(currentSegment);
          currentSegment = "";
          currentPart = "property";
          break;
        }
        case "[": {
          if (currentPart === "index") {
            throw new Error("Invalid character in an index");
          }
          if (currentPart === "indexEnd") {
            currentPart = "index";
            break;
          }
          if (isIgnoring) {
            isIgnoring = false;
            currentSegment += character;
            break;
          }
          if (currentPart === "property") {
            if (disallowedKeys.has(currentSegment)) {
              return [];
            }
            parts.push(currentSegment);
            currentSegment = "";
          }
          currentPart = "index";
          break;
        }
        case "]": {
          if (currentPart === "index") {
            parts.push(Number.parseInt(currentSegment, 10));
            currentSegment = "";
            currentPart = "indexEnd";
            break;
          }
          if (currentPart === "indexEnd") {
            throw new Error("Invalid character after an index");
          }
        }
        default: {
          if (currentPart === "index" && !digits.has(character)) {
            throw new Error("Invalid character in an index");
          }
          if (currentPart === "indexEnd") {
            throw new Error("Invalid character after an index");
          }
          if (currentPart === "start") {
            currentPart = "property";
          }
          if (isIgnoring) {
            isIgnoring = false;
            currentSegment += "\\";
          }
          currentSegment += character;
        }
      }
    }
    if (isIgnoring) {
      currentSegment += "\\";
    }
    switch (currentPart) {
      case "property": {
        if (disallowedKeys.has(currentSegment)) {
          return [];
        }
        parts.push(currentSegment);
        break;
      }
      case "index": {
        throw new Error("Index was not closed");
      }
      case "start": {
        parts.push("");
        break;
      }
    }
    return parts;
  }
  function isStringIndex(object, key) {
    if (typeof key !== "number" && Array.isArray(object)) {
      var index = Number.parseInt(key, 10);
      return Number.isInteger(index) && object[index] === object[key];
    }
    return false;
  }
  function assertNotStringIndex(object, key) {
    if (isStringIndex(object, key)) {
      throw new Error("Cannot use string index");
    }
  }
  function getProperty(object, path, value) {
    if (Array.isArray(path)) {
      path = path.join(".");
    }
    if (!path.includes(".") && !path.includes("[")) {
      return object[path];
    }
    if (!isObject(object) || typeof path !== "string") {
      return value === void 0 ? object : value;
    }
    var pathArray = getPathSegments(path);
    if (pathArray.length === 0) {
      return value;
    }
    for (var index = 0; index < pathArray.length; index++) {
      var key = pathArray[index];
      if (isStringIndex(object, key)) {
        object = index === pathArray.length - 1 ? void 0 : null;
      } else {
        object = object[key];
      }
      if (object === void 0 || object === null) {
        if (index !== pathArray.length - 1) {
          return value;
        }
        break;
      }
    }
    return object === void 0 ? value : object;
  }
  function setProperty(object, path, value) {
    if (Array.isArray(path)) {
      path = path.join(".");
    }
    if (!isObject(object) || typeof path !== "string") {
      return object;
    }
    var root = object;
    var pathArray = getPathSegments(path);
    for (var index = 0; index < pathArray.length; index++) {
      var key = pathArray[index];
      assertNotStringIndex(object, key);
      if (index === pathArray.length - 1) {
        object[key] = value;
      } else if (!isObject(object[key])) {
        object[key] = typeof pathArray[index + 1] === "number" ? [] : {};
      }
      object = object[key];
    }
    return root;
  }
  var isObject, disallowedKeys, digits;
  var init_utils_object_dot_prop = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-object-dot-prop.js"() {
      isObject = (value) => {
        var type5 = typeof value;
        return value !== null && (type5 === "object" || type5 === "function");
      };
      disallowedKeys = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
      digits = new Set("0123456789");
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-map.js
  function getFromMapOrThrow(map2, key) {
    var val = map2.get(key);
    if (typeof val === "undefined") {
      throw new Error("missing value from map " + key);
    }
    return val;
  }
  function getFromMapOrCreate(map2, index, creator, ifWasThere) {
    var value = map2.get(index);
    if (typeof value === "undefined") {
      value = creator();
      map2.set(index, value);
    } else if (ifWasThere) {
      ifWasThere(value);
    }
    return value;
  }
  var init_utils_map = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-map.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-error.js
  function pluginMissing(pluginKey) {
    var keyParts = pluginKey.split("-");
    var pluginName = "RxDB";
    keyParts.forEach((part) => {
      pluginName += ucfirst(part);
    });
    pluginName += "Plugin";
    return new Error("You are using a function which must be overwritten by a plugin.\n        You should either prevent the usage of this function or add the plugin via:\n            import { " + pluginName + " } from 'rxdb/plugins/" + pluginKey + "';\n            addRxPlugin(" + pluginName + ");\n        ");
  }
  function errorToPlainJson(err) {
    var ret = {
      name: err.name,
      message: err.message,
      rxdb: err.rxdb,
      parameters: err.parameters,
      extensions: err.extensions,
      code: err.code,
      url: err.url,
      /**
       * stack must be last to make it easier to read the json in a console.
       * Also we ensure that each linebreak is spaced so that the chrome devtools
       * shows urls to the source code that can be clicked to inspect
       * the correct place in the code.
       */
      stack: !err.stack ? void 0 : err.stack.replace(/\n/g, " \n ")
    };
    return ret;
  }
  var init_utils_error = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-error.js"() {
      init_utils_string();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-time.js
  function now() {
    var ret = Date.now();
    ret = ret + 0.01;
    if (ret <= _lastNow) {
      ret = _lastNow + 0.01;
    }
    var twoDecimals = parseFloat(ret.toFixed(2));
    _lastNow = twoDecimals;
    return twoDecimals;
  }
  var _lastNow;
  var init_utils_time = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-time.js"() {
      _lastNow = 0;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-other.js
  function ensureNotFalsy(obj, message) {
    if (!obj) {
      if (!message) {
        message = "";
      }
      throw new Error("ensureNotFalsy() is falsy: " + message);
    }
    return obj;
  }
  var RXJS_SHARE_REPLAY_DEFAULTS;
  var init_utils_other = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-other.js"() {
      RXJS_SHARE_REPLAY_DEFAULTS = {
        bufferSize: 1,
        refCount: true
      };
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-rxdb-version.js
  var RXDB_VERSION;
  var init_utils_rxdb_version = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-rxdb-version.js"() {
      RXDB_VERSION = "16.20.0";
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-global.js
  var RXDB_UTILS_GLOBAL;
  var init_utils_global = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-global.js"() {
      RXDB_UTILS_GLOBAL = {};
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/utils-premium.js
  async function hasPremiumFlag() {
    if (premiumChecked) {
      return hasPremiumPromise;
    }
    premiumChecked = true;
    hasPremiumPromise = (async () => {
      if (RXDB_UTILS_GLOBAL.premium && typeof RXDB_UTILS_GLOBAL.premium === "string" && await defaultHashSha256(RXDB_UTILS_GLOBAL.premium) === PREMIUM_FLAG_HASH) {
        return true;
      } else {
        return false;
      }
    })();
    return hasPremiumPromise;
  }
  var PREMIUM_FLAG_HASH, NON_PREMIUM_COLLECTION_LIMIT, hasPremiumPromise, premiumChecked;
  var init_utils_premium = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/utils-premium.js"() {
      init_utils_global();
      init_utils_hash();
      init_utils_promise();
      PREMIUM_FLAG_HASH = "6da4936d1425ff3a5c44c02342c6daf791d266be3ae8479b8ec59e261df41b93";
      NON_PREMIUM_COLLECTION_LIMIT = 16;
      hasPremiumPromise = PROMISE_RESOLVE_FALSE;
      premiumChecked = false;
    }
  });

  // node_modules/rxdb/dist/esm/plugins/utils/index.js
  var init_utils = __esm({
    "node_modules/rxdb/dist/esm/plugins/utils/index.js"() {
      init_utils_array();
      init_utils_blob();
      init_utils_base64();
      init_utils_revision();
      init_utils_document();
      init_utils_hash();
      init_utils_promise();
      init_utils_regex();
      init_utils_string();
      init_utils_number();
      init_utils_object_deep_equal();
      init_utils_object_dot_prop();
      init_utils_object();
      init_utils_map();
      init_utils_error();
      init_utils_time();
      init_utils_other();
      init_utils_rxdb_version();
      init_utils_global();
      init_utils_premium();
    }
  });

  // node_modules/rxdb/dist/esm/hooks.js
  function runPluginHooks(hookKey, obj) {
    if (HOOKS[hookKey].length > 0) {
      HOOKS[hookKey].forEach((fun) => fun(obj));
    }
  }
  async function runAsyncPluginHooks(hookKey, obj) {
    for (var fn of HOOKS[hookKey]) {
      await fn(obj);
    }
  }
  var HOOKS;
  var init_hooks = __esm({
    "node_modules/rxdb/dist/esm/hooks.js"() {
      HOOKS = {
        /**
         * Runs before a plugin is added.
         * Use this to block the usage of non-compatible plugins.
         */
        preAddRxPlugin: [],
        /**
         * functions that run before the database is created
         */
        preCreateRxDatabase: [],
        /**
         * runs after the database is created and prepared
         * but before the instance is returned to the user
         * @async
         */
        createRxDatabase: [],
        preCreateRxCollection: [],
        createRxCollection: [],
        createRxState: [],
        /**
        * runs at the end of the close-process of a collection
        * @async
        */
        postCloseRxCollection: [],
        /**
         * Runs after a collection is removed.
         * @async
         */
        postRemoveRxCollection: [],
        /**
          * functions that get the json-schema as input
          * to do additionally checks/manipulation
          */
        preCreateRxSchema: [],
        /**
         * functions that run after the RxSchema is created
         * gets RxSchema as attribute
         */
        createRxSchema: [],
        prePrepareRxQuery: [],
        preCreateRxQuery: [],
        /**
         * Runs before a query is send to the
         * prepareQuery function of the storage engine.
         */
        prePrepareQuery: [],
        createRxDocument: [],
        /**
         * runs after a RxDocument is created,
         * cannot be async
         */
        postCreateRxDocument: [],
        /**
         * Runs before a RxStorageInstance is created
         * gets the params of createStorageInstance()
         * as attribute so you can manipulate them.
         * Notice that you have to clone stuff before mutating the inputs.
         */
        preCreateRxStorageInstance: [],
        preStorageWrite: [],
        /**
         * runs on the document-data before the document is migrated
         * {
         *   doc: Object, // original doc-data
         *   migrated: // migrated doc-data after run through migration-strategies
         * }
         */
        preMigrateDocument: [],
        /**
         * runs after the migration of a document has been done
         */
        postMigrateDocument: [],
        /**
         * runs at the beginning of the close-process of a database
         */
        preCloseRxDatabase: [],
        /**
         * runs after a database has been removed
         * @async
         */
        postRemoveRxDatabase: [],
        postCleanup: [],
        /**
         * runs before the replication writes the rows to master
         * but before the rows have been modified
         * @async
         */
        preReplicationMasterWrite: [],
        /**
         * runs after the replication has been sent to the server
         * but before the new documents have been handled
         * @async
         */
        preReplicationMasterWriteDocumentsHandle: []
      };
    }
  });

  // node_modules/rxdb/dist/esm/rx-schema-helper.js
  function getSchemaByObjectPath(rxJsonSchema, path) {
    var usePath = path;
    usePath = usePath.replace(REGEX_ALL_DOTS, ".properties.");
    usePath = "properties." + usePath;
    usePath = trimDots(usePath);
    var ret = getProperty(rxJsonSchema, usePath);
    return ret;
  }
  function fillPrimaryKey(primaryPath, jsonSchema, documentData) {
    if (typeof jsonSchema.primaryKey === "string") {
      return documentData;
    }
    var newPrimary = getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData);
    var existingPrimary = documentData[primaryPath];
    if (existingPrimary && existingPrimary !== newPrimary) {
      throw newRxError("DOC19", {
        args: {
          documentData,
          existingPrimary,
          newPrimary
        },
        schema: jsonSchema
      });
    }
    documentData[primaryPath] = newPrimary;
    return documentData;
  }
  function getPrimaryFieldOfPrimaryKey(primaryKey) {
    if (typeof primaryKey === "string") {
      return primaryKey;
    } else {
      return primaryKey.key;
    }
  }
  function getLengthOfPrimaryKey(schema) {
    var primaryPath = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
    var schemaPart = getSchemaByObjectPath(schema, primaryPath);
    return ensureNotFalsy(schemaPart.maxLength);
  }
  function getComposedPrimaryKeyOfDocumentData(jsonSchema, documentData) {
    if (typeof jsonSchema.primaryKey === "string") {
      return documentData[jsonSchema.primaryKey];
    }
    var compositePrimary = jsonSchema.primaryKey;
    return compositePrimary.fields.map((field) => {
      var value = getProperty(documentData, field);
      if (typeof value === "undefined") {
        throw newRxError("DOC18", {
          args: {
            field,
            documentData
          }
        });
      }
      return value;
    }).join(compositePrimary.separator);
  }
  function normalizeRxJsonSchema(jsonSchema) {
    var normalizedSchema = sortObject(jsonSchema, true);
    return normalizedSchema;
  }
  function getDefaultIndex(primaryPath) {
    return ["_deleted", primaryPath];
  }
  function fillWithDefaultSettings(schemaObj) {
    schemaObj = flatClone(schemaObj);
    var primaryPath = getPrimaryFieldOfPrimaryKey(schemaObj.primaryKey);
    schemaObj.properties = flatClone(schemaObj.properties);
    schemaObj.additionalProperties = false;
    if (!Object.prototype.hasOwnProperty.call(schemaObj, "keyCompression")) {
      schemaObj.keyCompression = false;
    }
    schemaObj.indexes = schemaObj.indexes ? schemaObj.indexes.slice(0) : [];
    schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
    schemaObj.encrypted = schemaObj.encrypted ? schemaObj.encrypted.slice(0) : [];
    schemaObj.properties._rev = {
      type: "string",
      minLength: 1
    };
    schemaObj.properties._attachments = {
      type: "object"
    };
    schemaObj.properties._deleted = {
      type: "boolean"
    };
    schemaObj.properties._meta = RX_META_SCHEMA;
    schemaObj.required = schemaObj.required ? schemaObj.required.slice(0) : [];
    schemaObj.required.push("_deleted");
    schemaObj.required.push("_rev");
    schemaObj.required.push("_meta");
    schemaObj.required.push("_attachments");
    var finalFields = getFinalFields(schemaObj);
    appendToArray(schemaObj.required, finalFields);
    schemaObj.required = schemaObj.required.filter((field) => !field.includes(".")).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
    schemaObj.version = schemaObj.version || 0;
    var useIndexes = schemaObj.indexes.map((index) => {
      var arIndex = isMaybeReadonlyArray(index) ? index.slice(0) : [index];
      if (!arIndex.includes(primaryPath)) {
        arIndex.push(primaryPath);
      }
      if (arIndex[0] !== "_deleted") {
        arIndex.unshift("_deleted");
      }
      return arIndex;
    });
    if (useIndexes.length === 0) {
      useIndexes.push(getDefaultIndex(primaryPath));
    }
    useIndexes.push(["_meta.lwt", primaryPath]);
    if (schemaObj.internalIndexes) {
      schemaObj.internalIndexes.map((idx) => {
        useIndexes.push(idx);
      });
    }
    var hasIndex = /* @__PURE__ */ new Set();
    useIndexes.filter((index) => {
      var indexStr = index.join(",");
      if (hasIndex.has(indexStr)) {
        return false;
      } else {
        hasIndex.add(indexStr);
        return true;
      }
    });
    schemaObj.indexes = useIndexes;
    return schemaObj;
  }
  function getFinalFields(jsonSchema) {
    var ret = Object.keys(jsonSchema.properties).filter((key) => jsonSchema.properties[key].final);
    var primaryPath = getPrimaryFieldOfPrimaryKey(jsonSchema.primaryKey);
    ret.push(primaryPath);
    if (typeof jsonSchema.primaryKey !== "string") {
      jsonSchema.primaryKey.fields.forEach((field) => ret.push(field));
    }
    return ret;
  }
  function fillObjectWithDefaults(rxSchema, obj) {
    var defaultKeys = Object.keys(rxSchema.defaultValues);
    for (var i = 0; i < defaultKeys.length; ++i) {
      var key = defaultKeys[i];
      if (!Object.prototype.hasOwnProperty.call(obj, key) || typeof obj[key] === "undefined") {
        obj[key] = rxSchema.defaultValues[key];
      }
    }
    return obj;
  }
  var META_LWT_UNIX_TIME_MAX, RX_META_SCHEMA;
  var init_rx_schema_helper = __esm({
    "node_modules/rxdb/dist/esm/rx-schema-helper.js"() {
      init_rx_error();
      init_utils();
      META_LWT_UNIX_TIME_MAX = 1e15;
      RX_META_SCHEMA = {
        type: "object",
        properties: {
          /**
           * The last-write time.
           * Unix time in milliseconds.
           */
          lwt: {
            type: "number",
            /**
             * We use 1 as minimum so that the value is never falsy.
             */
            minimum: RX_META_LWT_MINIMUM,
            maximum: META_LWT_UNIX_TIME_MAX,
            multipleOf: 0.01
          }
        },
        /**
         * Additional properties are allowed
         * and can be used by plugins to set various flags.
         */
        additionalProperties: true,
        required: ["lwt"]
      };
    }
  });

  // node_modules/rxdb/dist/esm/rx-schema.js
  function getIndexes(jsonSchema) {
    return (jsonSchema.indexes || []).map((index) => isMaybeReadonlyArray(index) ? index : [index]);
  }
  function getPreviousVersions(schema) {
    var version = schema.version ? schema.version : 0;
    var c = 0;
    return new Array(version).fill(0).map(() => c++);
  }
  function createRxSchema(jsonSchema, hashFunction, runPreCreateHooks = true) {
    if (runPreCreateHooks) {
      runPluginHooks("preCreateRxSchema", jsonSchema);
    }
    var useJsonSchema = fillWithDefaultSettings(jsonSchema);
    useJsonSchema = normalizeRxJsonSchema(useJsonSchema);
    overwritable.deepFreezeWhenDevMode(useJsonSchema);
    var schema = new RxSchema(useJsonSchema, hashFunction);
    runPluginHooks("createRxSchema", schema);
    return schema;
  }
  var RxSchema;
  var init_rx_schema = __esm({
    "node_modules/rxdb/dist/esm/rx-schema.js"() {
      init_createClass();
      init_utils();
      init_rx_error();
      init_hooks();
      init_rx_schema_helper();
      init_overwritable();
      RxSchema = /* @__PURE__ */ (function() {
        function RxSchema2(jsonSchema, hashFunction) {
          this.jsonSchema = jsonSchema;
          this.hashFunction = hashFunction;
          this.indexes = getIndexes(this.jsonSchema);
          this.primaryPath = getPrimaryFieldOfPrimaryKey(this.jsonSchema.primaryKey);
          if (!jsonSchema.properties[this.primaryPath].maxLength) {
            throw newRxError("SC39", {
              schema: jsonSchema
            });
          }
          this.finalFields = getFinalFields(this.jsonSchema);
        }
        var _proto = RxSchema2.prototype;
        _proto.validateChange = function validateChange(dataBefore, dataAfter) {
          this.finalFields.forEach((fieldName) => {
            if (!deepEqual(dataBefore[fieldName], dataAfter[fieldName])) {
              throw newRxError("DOC9", {
                dataBefore,
                dataAfter,
                fieldName,
                schema: this.jsonSchema
              });
            }
          });
        };
        _proto.getDocumentPrototype = function getDocumentPrototype2() {
          var proto = {};
          var pathProperties = getSchemaByObjectPath(this.jsonSchema, "");
          Object.keys(pathProperties).forEach((key) => {
            var fullPath = key;
            proto.__defineGetter__(key, function() {
              if (!this.get || typeof this.get !== "function") {
                return void 0;
              }
              var ret = this.get(fullPath);
              return ret;
            });
            Object.defineProperty(proto, key + "$", {
              get: function() {
                return this.get$(fullPath);
              },
              enumerable: false,
              configurable: false
            });
            Object.defineProperty(proto, key + "$$", {
              get: function() {
                return this.get$$(fullPath);
              },
              enumerable: false,
              configurable: false
            });
            Object.defineProperty(proto, key + "_", {
              get: function() {
                return this.populate(fullPath);
              },
              enumerable: false,
              configurable: false
            });
          });
          overwriteGetterForCaching(this, "getDocumentPrototype", () => proto);
          return proto;
        };
        _proto.getPrimaryOfDocumentData = function getPrimaryOfDocumentData(documentData) {
          return getComposedPrimaryKeyOfDocumentData(this.jsonSchema, documentData);
        };
        return _createClass(RxSchema2, [{
          key: "version",
          get: function() {
            return this.jsonSchema.version;
          }
        }, {
          key: "defaultValues",
          get: function() {
            var values = {};
            Object.entries(this.jsonSchema.properties).filter(([, v]) => Object.prototype.hasOwnProperty.call(v, "default")).forEach(([k, v]) => values[k] = v.default);
            return overwriteGetterForCaching(this, "defaultValues", values);
          }
          /**
           * @overrides itself on the first call
           */
        }, {
          key: "hash",
          get: function() {
            return overwriteGetterForCaching(this, "hash", this.hashFunction(JSON.stringify(this.jsonSchema)));
          }
        }]);
      })();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isFunction.js
  function isFunction(value) {
    return typeof value === "function";
  }
  var init_isFunction = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isFunction.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/lift.js
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  var init_lift = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/lift.js"() {
      init_isFunction();
    }
  });

  // node_modules/tslib/tslib.es6.mjs
  function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve2) {
        resolve2(value);
      });
    }
    return new (P || (P = Promise))(function(resolve2, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
      if (ar || !(i in from2)) {
        if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function awaitReturn(f) {
      return function(v) {
        return Promise.resolve(v).then(f, reject);
      };
    }
    function verb(n, f) {
      if (g[n]) {
        i[n] = function(v) {
          return new Promise(function(a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
        if (f) i[n] = f(i[n]);
      }
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve2, reject) {
          v = o[n](v), settle(resolve2, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve2, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve2({ value: v2, done: d });
      }, reject);
    }
  }
  var extendStatics;
  var init_tslib_es6 = __esm({
    "node_modules/tslib/tslib.es6.mjs"() {
      extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
  var isArrayLike;
  var init_isArrayLike = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js"() {
      isArrayLike = (function(x) {
        return x && typeof x.length === "number" && typeof x !== "function";
      });
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isPromise.js
  function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }
  var init_isPromise = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isPromise.js"() {
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }
  var init_createErrorClass = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
  var UnsubscriptionError;
  var init_UnsubscriptionError = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js"() {
      init_createErrorClass();
      UnsubscriptionError = createErrorClass(function(_super) {
        return function UnsubscriptionErrorImpl(errors) {
          _super(this);
          this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
            return i + 1 + ") " + err.toString();
          }).join("\n  ") : "";
          this.name = "UnsubscriptionError";
          this.errors = errors;
        };
      });
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }
  var init_arrRemove = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/arrRemove.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/Subscription.js
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }
  var Subscription, EMPTY_SUBSCRIPTION;
  var init_Subscription = __esm({
    "node_modules/rxjs/dist/esm5/internal/Subscription.js"() {
      init_tslib_es6();
      init_isFunction();
      init_UnsubscriptionError();
      init_arrRemove();
      Subscription = (function() {
        function Subscription2(initialTeardown) {
          this.initialTeardown = initialTeardown;
          this.closed = false;
          this._parentage = null;
          this._finalizers = null;
        }
        Subscription2.prototype.unsubscribe = function() {
          var e_1, _a, e_2, _b;
          var errors;
          if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
              this._parentage = null;
              if (Array.isArray(_parentage)) {
                try {
                  for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                    var parent_1 = _parentage_1_1.value;
                    parent_1.remove(this);
                  }
                } catch (e_1_1) {
                  e_1 = { error: e_1_1 };
                } finally {
                  try {
                    if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                }
              } else {
                _parentage.remove(this);
              }
            }
            var initialFinalizer = this.initialTeardown;
            if (isFunction(initialFinalizer)) {
              try {
                initialFinalizer();
              } catch (e) {
                errors = e instanceof UnsubscriptionError ? e.errors : [e];
              }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
              this._finalizers = null;
              try {
                for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                  var finalizer = _finalizers_1_1.value;
                  try {
                    execFinalizer(finalizer);
                  } catch (err) {
                    errors = errors !== null && errors !== void 0 ? errors : [];
                    if (err instanceof UnsubscriptionError) {
                      errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                    } else {
                      errors.push(err);
                    }
                  }
                }
              } catch (e_2_1) {
                e_2 = { error: e_2_1 };
              } finally {
                try {
                  if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                } finally {
                  if (e_2) throw e_2.error;
                }
              }
            }
            if (errors) {
              throw new UnsubscriptionError(errors);
            }
          }
        };
        Subscription2.prototype.add = function(teardown) {
          var _a;
          if (teardown && teardown !== this) {
            if (this.closed) {
              execFinalizer(teardown);
            } else {
              if (teardown instanceof Subscription2) {
                if (teardown.closed || teardown._hasParent(this)) {
                  return;
                }
                teardown._addParent(this);
              }
              (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
          }
        };
        Subscription2.prototype._hasParent = function(parent) {
          var _parentage = this._parentage;
          return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
        };
        Subscription2.prototype._addParent = function(parent) {
          var _parentage = this._parentage;
          this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
        };
        Subscription2.prototype._removeParent = function(parent) {
          var _parentage = this._parentage;
          if (_parentage === parent) {
            this._parentage = null;
          } else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
          }
        };
        Subscription2.prototype.remove = function(teardown) {
          var _finalizers = this._finalizers;
          _finalizers && arrRemove(_finalizers, teardown);
          if (teardown instanceof Subscription2) {
            teardown._removeParent(this);
          }
        };
        Subscription2.EMPTY = (function() {
          var empty = new Subscription2();
          empty.closed = true;
          return empty;
        })();
        return Subscription2;
      })();
      EMPTY_SUBSCRIPTION = Subscription.EMPTY;
    }
  });

  // node_modules/rxjs/dist/esm5/internal/config.js
  var config;
  var init_config = __esm({
    "node_modules/rxjs/dist/esm5/internal/config.js"() {
      config = {
        onUnhandledError: null,
        onStoppedNotification: null,
        Promise: void 0,
        useDeprecatedSynchronousErrorHandling: false,
        useDeprecatedNextContext: false
      };
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
  var timeoutProvider;
  var init_timeoutProvider = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js"() {
      init_tslib_es6();
      timeoutProvider = {
        setTimeout: function(handler, timeout) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var delegate = timeoutProvider.delegate;
          if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
          }
          return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
        },
        clearTimeout: function(handle) {
          var delegate = timeoutProvider.delegate;
          return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
        },
        delegate: void 0
      };
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      var onUnhandledError = config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }
  var init_reportUnhandledError = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js"() {
      init_config();
      init_timeoutProvider();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/noop.js
  function noop() {
  }
  var init_noop = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/noop.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
  function errorNotification(error) {
    return createNotification("E", void 0, error);
  }
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  function createNotification(kind, value, error) {
    return {
      kind,
      value,
      error
    };
  }
  var COMPLETE_NOTIFICATION;
  var init_NotificationFactories = __esm({
    "node_modules/rxjs/dist/esm5/internal/NotificationFactories.js"() {
      COMPLETE_NOTIFICATION = (function() {
        return createNotification("C", void 0, void 0);
      })();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/errorContext.js
  function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a = context, errorThrown = _a.errorThrown, error = _a.error;
        context = null;
        if (errorThrown) {
          throw error;
        }
      }
    } else {
      cb();
    }
  }
  function captureError(err) {
    if (config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }
  var context;
  var init_errorContext = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/errorContext.js"() {
      init_config();
      context = null;
    }
  });

  // node_modules/rxjs/dist/esm5/internal/Subscriber.js
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  function handleUnhandledError(error) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      captureError(error);
    } else {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = config.onStoppedNotification;
    onStoppedNotification && timeoutProvider.setTimeout(function() {
      return onStoppedNotification(notification, subscriber);
    });
  }
  var Subscriber, _bind, ConsumerObserver, SafeSubscriber, EMPTY_OBSERVER;
  var init_Subscriber = __esm({
    "node_modules/rxjs/dist/esm5/internal/Subscriber.js"() {
      init_tslib_es6();
      init_isFunction();
      init_Subscription();
      init_config();
      init_reportUnhandledError();
      init_noop();
      init_NotificationFactories();
      init_timeoutProvider();
      init_errorContext();
      Subscriber = (function(_super) {
        __extends(Subscriber2, _super);
        function Subscriber2(destination) {
          var _this = _super.call(this) || this;
          _this.isStopped = false;
          if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
              destination.add(_this);
            }
          } else {
            _this.destination = EMPTY_OBSERVER;
          }
          return _this;
        }
        Subscriber2.create = function(next, error, complete) {
          return new SafeSubscriber(next, error, complete);
        };
        Subscriber2.prototype.next = function(value) {
          if (this.isStopped) {
            handleStoppedNotification(nextNotification(value), this);
          } else {
            this._next(value);
          }
        };
        Subscriber2.prototype.error = function(err) {
          if (this.isStopped) {
            handleStoppedNotification(errorNotification(err), this);
          } else {
            this.isStopped = true;
            this._error(err);
          }
        };
        Subscriber2.prototype.complete = function() {
          if (this.isStopped) {
            handleStoppedNotification(COMPLETE_NOTIFICATION, this);
          } else {
            this.isStopped = true;
            this._complete();
          }
        };
        Subscriber2.prototype.unsubscribe = function() {
          if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
          }
        };
        Subscriber2.prototype._next = function(value) {
          this.destination.next(value);
        };
        Subscriber2.prototype._error = function(err) {
          try {
            this.destination.error(err);
          } finally {
            this.unsubscribe();
          }
        };
        Subscriber2.prototype._complete = function() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        };
        return Subscriber2;
      })(Subscription);
      _bind = Function.prototype.bind;
      ConsumerObserver = (function() {
        function ConsumerObserver2(partialObserver) {
          this.partialObserver = partialObserver;
        }
        ConsumerObserver2.prototype.next = function(value) {
          var partialObserver = this.partialObserver;
          if (partialObserver.next) {
            try {
              partialObserver.next(value);
            } catch (error) {
              handleUnhandledError(error);
            }
          }
        };
        ConsumerObserver2.prototype.error = function(err) {
          var partialObserver = this.partialObserver;
          if (partialObserver.error) {
            try {
              partialObserver.error(err);
            } catch (error) {
              handleUnhandledError(error);
            }
          } else {
            handleUnhandledError(err);
          }
        };
        ConsumerObserver2.prototype.complete = function() {
          var partialObserver = this.partialObserver;
          if (partialObserver.complete) {
            try {
              partialObserver.complete();
            } catch (error) {
              handleUnhandledError(error);
            }
          }
        };
        return ConsumerObserver2;
      })();
      SafeSubscriber = (function(_super) {
        __extends(SafeSubscriber2, _super);
        function SafeSubscriber2(observerOrNext, error, complete) {
          var _this = _super.call(this) || this;
          var partialObserver;
          if (isFunction(observerOrNext) || !observerOrNext) {
            partialObserver = {
              next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
              error: error !== null && error !== void 0 ? error : void 0,
              complete: complete !== null && complete !== void 0 ? complete : void 0
            };
          } else {
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
              context_1 = Object.create(observerOrNext);
              context_1.unsubscribe = function() {
                return _this.unsubscribe();
              };
              partialObserver = {
                next: observerOrNext.next && bind(observerOrNext.next, context_1),
                error: observerOrNext.error && bind(observerOrNext.error, context_1),
                complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
              };
            } else {
              partialObserver = observerOrNext;
            }
          }
          _this.destination = new ConsumerObserver(partialObserver);
          return _this;
        }
        return SafeSubscriber2;
      })(Subscriber);
      EMPTY_OBSERVER = {
        closed: true,
        next: noop,
        error: defaultErrorHandler,
        complete: noop
      };
    }
  });

  // node_modules/rxjs/dist/esm5/internal/symbol/observable.js
  var observable;
  var init_observable = __esm({
    "node_modules/rxjs/dist/esm5/internal/symbol/observable.js"() {
      observable = (function() {
        return typeof Symbol === "function" && Symbol.observable || "@@observable";
      })();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/identity.js
  function identity(x) {
    return x;
  }
  var init_identity = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/identity.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/pipe.js
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }
  var init_pipe = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/pipe.js"() {
      init_identity();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/Observable.js
  function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }
  var Observable;
  var init_Observable = __esm({
    "node_modules/rxjs/dist/esm5/internal/Observable.js"() {
      init_Subscriber();
      init_Subscription();
      init_observable();
      init_pipe();
      init_config();
      init_isFunction();
      init_errorContext();
      Observable = (function() {
        function Observable2(subscribe) {
          if (subscribe) {
            this._subscribe = subscribe;
          }
        }
        Observable2.prototype.lift = function(operator) {
          var observable2 = new Observable2();
          observable2.source = this;
          observable2.operator = operator;
          return observable2;
        };
        Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
          var _this = this;
          var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
          errorContext(function() {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
          });
          return subscriber;
        };
        Observable2.prototype._trySubscribe = function(sink) {
          try {
            return this._subscribe(sink);
          } catch (err) {
            sink.error(err);
          }
        };
        Observable2.prototype.forEach = function(next, promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function(resolve2, reject) {
            var subscriber = new SafeSubscriber({
              next: function(value) {
                try {
                  next(value);
                } catch (err) {
                  reject(err);
                  subscriber.unsubscribe();
                }
              },
              error: reject,
              complete: resolve2
            });
            _this.subscribe(subscriber);
          });
        };
        Observable2.prototype._subscribe = function(subscriber) {
          var _a;
          return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
        };
        Observable2.prototype[observable] = function() {
          return this;
        };
        Observable2.prototype.pipe = function() {
          var operations = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
          }
          return pipeFromArray(operations)(this);
        };
        Observable2.prototype.toPromise = function(promiseCtor) {
          var _this = this;
          promiseCtor = getPromiseCtor(promiseCtor);
          return new promiseCtor(function(resolve2, reject) {
            var value;
            _this.subscribe(function(x) {
              return value = x;
            }, function(err) {
              return reject(err);
            }, function() {
              return resolve2(value);
            });
          });
        };
        Observable2.create = function(subscribe) {
          return new Observable2(subscribe);
        };
        return Observable2;
      })();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
  function isInteropObservable(input) {
    return isFunction(input[observable]);
  }
  var init_isInteropObservable = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js"() {
      init_observable();
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
  function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }
  var init_isAsyncIterable = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js"() {
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
  function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }
  var init_throwUnobservableError = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  var iterator;
  var init_iterator = __esm({
    "node_modules/rxjs/dist/esm5/internal/symbol/iterator.js"() {
      iterator = getSymbolIterator();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isIterable.js
  function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }
  var init_isIterable = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isIterable.js"() {
      init_iterator();
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            if (false) return [3, 8];
            return [4, __await(reader.read())];
          case 3:
            _a = _b.sent(), value = _a.value, done = _a.done;
            if (!done) return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }
  var init_isReadableStreamLike = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js"() {
      init_tslib_es6();
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
  function innerFrom(input) {
    if (input instanceof Observable) {
      return input;
    }
    if (input != null) {
      if (isInteropObservable(input)) {
        return fromInteropObservable(input);
      }
      if (isArrayLike(input)) {
        return fromArrayLike(input);
      }
      if (isPromise(input)) {
        return fromPromise(input);
      }
      if (isAsyncIterable(input)) {
        return fromAsyncIterable(input);
      }
      if (isIterable(input)) {
        return fromIterable(input);
      }
      if (isReadableStreamLike(input)) {
        return fromReadableStreamLike(input);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
    return new Observable(function(subscriber) {
      var obs = obj[observable]();
      if (isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function fromArrayLike(array) {
    return new Observable(function(subscriber) {
      for (var i = 0; i < array.length && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }
      subscriber.complete();
    });
  }
  function fromPromise(promise) {
    return new Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError);
    });
  }
  function fromIterable(iterable) {
    return new Observable(function(subscriber) {
      var e_1, _a;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  function fromAsyncIterable(asyncIterable) {
    return new Observable(function(subscriber) {
      process2(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process2(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
            return [4, _a.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2) throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }
  var init_innerFrom = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js"() {
      init_tslib_es6();
      init_isArrayLike();
      init_isPromise();
      init_Observable();
      init_isInteropObservable();
      init_isAsyncIterable();
      init_throwUnobservableError();
      init_isIterable();
      init_isReadableStreamLike();
      init_isFunction();
      init_reportUnhandledError();
      init_observable();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber;
  var init_OperatorSubscriber = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js"() {
      init_tslib_es6();
      init_Subscriber();
      OperatorSubscriber = (function(_super) {
        __extends(OperatorSubscriber2, _super);
        function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
          var _this = _super.call(this, destination) || this;
          _this.onFinalize = onFinalize;
          _this.shouldUnsubscribe = shouldUnsubscribe;
          _this._next = onNext ? function(value) {
            try {
              onNext(value);
            } catch (err) {
              destination.error(err);
            }
          } : _super.prototype._next;
          _this._error = onError ? function(err) {
            try {
              onError(err);
            } catch (err2) {
              destination.error(err2);
            } finally {
              this.unsubscribe();
            }
          } : _super.prototype._error;
          _this._complete = onComplete ? function() {
            try {
              onComplete();
            } catch (err) {
              destination.error(err);
            } finally {
              this.unsubscribe();
            }
          } : _super.prototype._complete;
          return _this;
        }
        OperatorSubscriber2.prototype.unsubscribe = function() {
          var _a;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            var closed_1 = this.closed;
            _super.prototype.unsubscribe.call(this);
            !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
          }
        };
        return OperatorSubscriber2;
      })(Subscriber);
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js
  var dateTimestampProvider;
  var init_dateTimestampProvider = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduler/dateTimestampProvider.js"() {
      dateTimestampProvider = {
        now: function() {
          return (dateTimestampProvider.delegate || Date).now();
        },
        delegate: void 0
      };
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/isScheduler.js
  function isScheduler(value) {
    return value && isFunction(value.schedule);
  }
  var init_isScheduler = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/isScheduler.js"() {
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/args.js
  function last(arr) {
    return arr[arr.length - 1];
  }
  function popResultSelector(args) {
    return isFunction(last(args)) ? args.pop() : void 0;
  }
  function popScheduler(args) {
    return isScheduler(last(args)) ? args.pop() : void 0;
  }
  function popNumber(args, defaultValue) {
    return typeof last(args) === "number" ? args.pop() : defaultValue;
  }
  var init_args = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/args.js"() {
      init_isFunction();
      init_isScheduler();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js
  function executeSchedule(parentSubscription, scheduler, work, delay, repeat) {
    if (delay === void 0) {
      delay = 0;
    }
    if (repeat === void 0) {
      repeat = false;
    }
    var scheduleSubscription = scheduler.schedule(function() {
      work();
      if (repeat) {
        parentSubscription.add(this.schedule(null, delay));
      } else {
        this.unsubscribe();
      }
    }, delay);
    parentSubscription.add(scheduleSubscription);
    if (!repeat) {
      return scheduleSubscription;
    }
  }
  var init_executeSchedule = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/executeSchedule.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js
  function argsArgArrayOrObject(args) {
    if (args.length === 1) {
      var first_1 = args[0];
      if (isArray(first_1)) {
        return { args: first_1, keys: null };
      }
      if (isPOJO(first_1)) {
        var keys = getKeys(first_1);
        return {
          args: keys.map(function(key) {
            return first_1[key];
          }),
          keys
        };
      }
    }
    return { args, keys: null };
  }
  function isPOJO(obj) {
    return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
  }
  var isArray, getPrototypeOf, objectProto, getKeys;
  var init_argsArgArrayOrObject = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/argsArgArrayOrObject.js"() {
      isArray = Array.isArray;
      getPrototypeOf = Object.getPrototypeOf;
      objectProto = Object.prototype;
      getKeys = Object.keys;
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/observeOn.js
  function observeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return operate(function(source, subscriber) {
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.next(value);
        }, delay);
      }, function() {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.complete();
        }, delay);
      }, function(err) {
        return executeSchedule(subscriber, scheduler, function() {
          return subscriber.error(err);
        }, delay);
      }));
    });
  }
  var init_observeOn = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/observeOn.js"() {
      init_executeSchedule();
      init_lift();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js
  function subscribeOn(scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }
    return operate(function(source, subscriber) {
      subscriber.add(scheduler.schedule(function() {
        return source.subscribe(subscriber);
      }, delay));
    });
  }
  var init_subscribeOn = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/subscribeOn.js"() {
      init_lift();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js
  function scheduleObservable(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }
  var init_scheduleObservable = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduleObservable.js"() {
      init_innerFrom();
      init_observeOn();
      init_subscribeOn();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js
  function schedulePromise(input, scheduler) {
    return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
  }
  var init_schedulePromise = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/schedulePromise.js"() {
      init_innerFrom();
      init_observeOn();
      init_subscribeOn();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js
  function scheduleArray(input, scheduler) {
    return new Observable(function(subscriber) {
      var i = 0;
      return scheduler.schedule(function() {
        if (i === input.length) {
          subscriber.complete();
        } else {
          subscriber.next(input[i++]);
          if (!subscriber.closed) {
            this.schedule();
          }
        }
      });
    });
  }
  var init_scheduleArray = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduleArray.js"() {
      init_Observable();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js
  function scheduleIterable(input, scheduler) {
    return new Observable(function(subscriber) {
      var iterator2;
      executeSchedule(subscriber, scheduler, function() {
        iterator2 = input[iterator]();
        executeSchedule(subscriber, scheduler, function() {
          var _a;
          var value;
          var done;
          try {
            _a = iterator2.next(), value = _a.value, done = _a.done;
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        }, 0, true);
      });
      return function() {
        return isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
      };
    });
  }
  var init_scheduleIterable = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduleIterable.js"() {
      init_Observable();
      init_iterator();
      init_isFunction();
      init_executeSchedule();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js
  function scheduleAsyncIterable(input, scheduler) {
    if (!input) {
      throw new Error("Iterable cannot be null");
    }
    return new Observable(function(subscriber) {
      executeSchedule(subscriber, scheduler, function() {
        var iterator2 = input[Symbol.asyncIterator]();
        executeSchedule(subscriber, scheduler, function() {
          iterator2.next().then(function(result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        }, 0, true);
      });
    });
  }
  var init_scheduleAsyncIterable = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduleAsyncIterable.js"() {
      init_Observable();
      init_executeSchedule();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js
  function scheduleReadableStreamLike(input, scheduler) {
    return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
  }
  var init_scheduleReadableStreamLike = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduleReadableStreamLike.js"() {
      init_scheduleAsyncIterable();
      init_isReadableStreamLike();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js
  function scheduled(input, scheduler) {
    if (input != null) {
      if (isInteropObservable(input)) {
        return scheduleObservable(input, scheduler);
      }
      if (isArrayLike(input)) {
        return scheduleArray(input, scheduler);
      }
      if (isPromise(input)) {
        return schedulePromise(input, scheduler);
      }
      if (isAsyncIterable(input)) {
        return scheduleAsyncIterable(input, scheduler);
      }
      if (isIterable(input)) {
        return scheduleIterable(input, scheduler);
      }
      if (isReadableStreamLike(input)) {
        return scheduleReadableStreamLike(input, scheduler);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  var init_scheduled = __esm({
    "node_modules/rxjs/dist/esm5/internal/scheduled/scheduled.js"() {
      init_scheduleObservable();
      init_schedulePromise();
      init_scheduleArray();
      init_scheduleIterable();
      init_scheduleAsyncIterable();
      init_isInteropObservable();
      init_isPromise();
      init_isArrayLike();
      init_isIterable();
      init_isAsyncIterable();
      init_throwUnobservableError();
      init_isReadableStreamLike();
      init_scheduleReadableStreamLike();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/from.js
  function from(input, scheduler) {
    return scheduler ? scheduled(input, scheduler) : innerFrom(input);
  }
  var init_from = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/from.js"() {
      init_scheduled();
      init_innerFrom();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/map.js
  function map(project, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }
  var init_map = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/map.js"() {
      init_lift();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js
  function callOrApply(fn, args) {
    return isArray2(args) ? fn.apply(void 0, __spreadArray([], __read(args))) : fn(args);
  }
  function mapOneOrManyArgs(fn) {
    return map(function(args) {
      return callOrApply(fn, args);
    });
  }
  var isArray2;
  var init_mapOneOrManyArgs = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/mapOneOrManyArgs.js"() {
      init_tslib_es6();
      init_map();
      isArray2 = Array.isArray;
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/createObject.js
  function createObject(keys, values) {
    return keys.reduce(function(result, key, i) {
      return result[key] = values[i], result;
    }, {});
  }
  var init_createObject = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/createObject.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js
  function combineLatest() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var resultSelector = popResultSelector(args);
    var _a = argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
    if (observables.length === 0) {
      return from([], scheduler);
    }
    var result = new Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
      return createObject(keys, values);
    } : identity));
    return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
  }
  function combineLatestInit(observables, scheduler, valueTransform) {
    if (valueTransform === void 0) {
      valueTransform = identity;
    }
    return function(subscriber) {
      maybeSchedule(scheduler, function() {
        var length = observables.length;
        var values = new Array(length);
        var active = length;
        var remainingFirstValues = length;
        var _loop_1 = function(i2) {
          maybeSchedule(scheduler, function() {
            var source = from(observables[i2], scheduler);
            var hasFirstValue = false;
            source.subscribe(createOperatorSubscriber(subscriber, function(value) {
              values[i2] = value;
              if (!hasFirstValue) {
                hasFirstValue = true;
                remainingFirstValues--;
              }
              if (!remainingFirstValues) {
                subscriber.next(valueTransform(values.slice()));
              }
            }, function() {
              if (!--active) {
                subscriber.complete();
              }
            }));
          }, subscriber);
        };
        for (var i = 0; i < length; i++) {
          _loop_1(i);
        }
      }, subscriber);
    };
  }
  function maybeSchedule(scheduler, execute, subscription) {
    if (scheduler) {
      executeSchedule(subscription, scheduler, execute);
    } else {
      execute();
    }
  }
  var init_combineLatest = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/combineLatest.js"() {
      init_Observable();
      init_argsArgArrayOrObject();
      init_from();
      init_identity();
      init_mapOneOrManyArgs();
      init_args();
      init_createObject();
      init_OperatorSubscriber();
      init_executeSchedule();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js
  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer.push(value);
    };
    var doInnerSub = function(value) {
      expand && subscriber.next(value);
      active++;
      var innerComplete = false;
      innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
        if (expand) {
          outerNext(innerValue);
        } else {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer.shift();
              if (innerSubScheduler) {
                executeSchedule(subscriber, innerSubScheduler, function() {
                  return doInnerSub(bufferedValue);
                });
              } else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
      additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
  }
  var init_mergeInternals = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/mergeInternals.js"() {
      init_innerFrom();
      init_executeSchedule();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction(resultSelector)) {
      return mergeMap(function(a, i) {
        return map(function(b, ii) {
          return resultSelector(a, b, i, ii);
        })(innerFrom(project(a, i)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return operate(function(source, subscriber) {
      return mergeInternals(source, subscriber, project, concurrent);
    });
  }
  var init_mergeMap = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/mergeMap.js"() {
      init_map();
      init_innerFrom();
      init_lift();
      init_mergeInternals();
      init_isFunction();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js
  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return mergeMap(identity, concurrent);
  }
  var init_mergeAll = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/mergeAll.js"() {
      init_mergeMap();
      init_identity();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/concatAll.js
  function concatAll() {
    return mergeAll(1);
  }
  var init_concatAll = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/concatAll.js"() {
      init_mergeAll();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
  var ObjectUnsubscribedError;
  var init_ObjectUnsubscribedError = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js"() {
      init_createErrorClass();
      ObjectUnsubscribedError = createErrorClass(function(_super) {
        return function ObjectUnsubscribedErrorImpl() {
          _super(this);
          this.name = "ObjectUnsubscribedError";
          this.message = "object unsubscribed";
        };
      });
    }
  });

  // node_modules/rxjs/dist/esm5/internal/Subject.js
  var Subject, AnonymousSubject;
  var init_Subject = __esm({
    "node_modules/rxjs/dist/esm5/internal/Subject.js"() {
      init_tslib_es6();
      init_Observable();
      init_Subscription();
      init_ObjectUnsubscribedError();
      init_arrRemove();
      init_errorContext();
      Subject = (function(_super) {
        __extends(Subject2, _super);
        function Subject2() {
          var _this = _super.call(this) || this;
          _this.closed = false;
          _this.currentObservers = null;
          _this.observers = [];
          _this.isStopped = false;
          _this.hasError = false;
          _this.thrownError = null;
          return _this;
        }
        Subject2.prototype.lift = function(operator) {
          var subject = new AnonymousSubject(this, this);
          subject.operator = operator;
          return subject;
        };
        Subject2.prototype._throwIfClosed = function() {
          if (this.closed) {
            throw new ObjectUnsubscribedError();
          }
        };
        Subject2.prototype.next = function(value) {
          var _this = this;
          errorContext(function() {
            var e_1, _a;
            _this._throwIfClosed();
            if (!_this.isStopped) {
              if (!_this.currentObservers) {
                _this.currentObservers = Array.from(_this.observers);
              }
              try {
                for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var observer = _c.value;
                  observer.next(value);
                }
              } catch (e_1_1) {
                e_1 = { error: e_1_1 };
              } finally {
                try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                } finally {
                  if (e_1) throw e_1.error;
                }
              }
            }
          });
        };
        Subject2.prototype.error = function(err) {
          var _this = this;
          errorContext(function() {
            _this._throwIfClosed();
            if (!_this.isStopped) {
              _this.hasError = _this.isStopped = true;
              _this.thrownError = err;
              var observers = _this.observers;
              while (observers.length) {
                observers.shift().error(err);
              }
            }
          });
        };
        Subject2.prototype.complete = function() {
          var _this = this;
          errorContext(function() {
            _this._throwIfClosed();
            if (!_this.isStopped) {
              _this.isStopped = true;
              var observers = _this.observers;
              while (observers.length) {
                observers.shift().complete();
              }
            }
          });
        };
        Subject2.prototype.unsubscribe = function() {
          this.isStopped = this.closed = true;
          this.observers = this.currentObservers = null;
        };
        Object.defineProperty(Subject2.prototype, "observed", {
          get: function() {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
          },
          enumerable: false,
          configurable: true
        });
        Subject2.prototype._trySubscribe = function(subscriber) {
          this._throwIfClosed();
          return _super.prototype._trySubscribe.call(this, subscriber);
        };
        Subject2.prototype._subscribe = function(subscriber) {
          this._throwIfClosed();
          this._checkFinalizedStatuses(subscriber);
          return this._innerSubscribe(subscriber);
        };
        Subject2.prototype._innerSubscribe = function(subscriber) {
          var _this = this;
          var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
          if (hasError || isStopped) {
            return EMPTY_SUBSCRIPTION;
          }
          this.currentObservers = null;
          observers.push(subscriber);
          return new Subscription(function() {
            _this.currentObservers = null;
            arrRemove(observers, subscriber);
          });
        };
        Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
          var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
          if (hasError) {
            subscriber.error(thrownError);
          } else if (isStopped) {
            subscriber.complete();
          }
        };
        Subject2.prototype.asObservable = function() {
          var observable2 = new Observable();
          observable2.source = this;
          return observable2;
        };
        Subject2.create = function(destination, source) {
          return new AnonymousSubject(destination, source);
        };
        return Subject2;
      })(Observable);
      AnonymousSubject = (function(_super) {
        __extends(AnonymousSubject2, _super);
        function AnonymousSubject2(destination, source) {
          var _this = _super.call(this) || this;
          _this.destination = destination;
          _this.source = source;
          return _this;
        }
        AnonymousSubject2.prototype.next = function(value) {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        };
        AnonymousSubject2.prototype.error = function(err) {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
        };
        AnonymousSubject2.prototype.complete = function() {
          var _a, _b;
          (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        AnonymousSubject2.prototype._subscribe = function(subscriber) {
          var _a, _b;
          return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
        };
        return AnonymousSubject2;
      })(Subject);
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/concat.js
  function concat() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return concatAll()(from(args, popScheduler(args)));
  }
  var init_concat = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/concat.js"() {
      init_concatAll();
      init_args();
      init_from();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/empty.js
  var EMPTY;
  var init_empty = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/empty.js"() {
      init_Observable();
      EMPTY = new Observable(function(subscriber) {
        return subscriber.complete();
      });
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js
  function distinctUntilChanged(comparator, keySelector) {
    if (keySelector === void 0) {
      keySelector = identity;
    }
    comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
    return operate(function(source, subscriber) {
      var previousKey;
      var first = true;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        var currentKey = keySelector(value);
        if (first || !comparator(previousKey, currentKey)) {
          first = false;
          previousKey = currentKey;
          subscriber.next(value);
        }
      }));
    });
  }
  function defaultCompare(a, b) {
    return a === b;
  }
  var init_distinctUntilChanged = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/distinctUntilChanged.js"() {
      init_identity();
      init_lift();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/filter.js
  function filter(predicate, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }
  var init_filter = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/filter.js"() {
      init_lift();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
  var EmptyError;
  var init_EmptyError = __esm({
    "node_modules/rxjs/dist/esm5/internal/util/EmptyError.js"() {
      init_createErrorClass();
      EmptyError = createErrorClass(function(_super) {
        return function EmptyErrorImpl() {
          _super(this);
          this.name = "EmptyError";
          this.message = "no elements in sequence";
        };
      });
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/merge.js
  function merge() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    return operate(function(source, subscriber) {
      mergeAll(concurrent)(from(__spreadArray([source], __read(args)), scheduler)).subscribe(subscriber);
    });
  }
  var init_merge = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/merge.js"() {
      init_tslib_es6();
      init_lift();
      init_mergeAll();
      init_args();
      init_from();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js
  function mergeWith() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return merge.apply(void 0, __spreadArray([], __read(otherSources)));
  }
  var init_mergeWith = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/mergeWith.js"() {
      init_tslib_es6();
      init_merge();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
  var BehaviorSubject;
  var init_BehaviorSubject = __esm({
    "node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js"() {
      init_tslib_es6();
      init_Subject();
      BehaviorSubject = (function(_super) {
        __extends(BehaviorSubject2, _super);
        function BehaviorSubject2(_value) {
          var _this = _super.call(this) || this;
          _this._value = _value;
          return _this;
        }
        Object.defineProperty(BehaviorSubject2.prototype, "value", {
          get: function() {
            return this.getValue();
          },
          enumerable: false,
          configurable: true
        });
        BehaviorSubject2.prototype._subscribe = function(subscriber) {
          var subscription = _super.prototype._subscribe.call(this, subscriber);
          !subscription.closed && subscriber.next(this._value);
          return subscription;
        };
        BehaviorSubject2.prototype.getValue = function() {
          var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
          if (hasError) {
            throw thrownError;
          }
          this._throwIfClosed();
          return _value;
        };
        BehaviorSubject2.prototype.next = function(value) {
          _super.prototype.next.call(this, this._value = value);
        };
        return BehaviorSubject2;
      })(Subject);
    }
  });

  // node_modules/rxjs/dist/esm5/internal/ReplaySubject.js
  var ReplaySubject;
  var init_ReplaySubject = __esm({
    "node_modules/rxjs/dist/esm5/internal/ReplaySubject.js"() {
      init_tslib_es6();
      init_Subject();
      init_dateTimestampProvider();
      ReplaySubject = (function(_super) {
        __extends(ReplaySubject2, _super);
        function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
          if (_bufferSize === void 0) {
            _bufferSize = Infinity;
          }
          if (_windowTime === void 0) {
            _windowTime = Infinity;
          }
          if (_timestampProvider === void 0) {
            _timestampProvider = dateTimestampProvider;
          }
          var _this = _super.call(this) || this;
          _this._bufferSize = _bufferSize;
          _this._windowTime = _windowTime;
          _this._timestampProvider = _timestampProvider;
          _this._buffer = [];
          _this._infiniteTimeWindow = true;
          _this._infiniteTimeWindow = _windowTime === Infinity;
          _this._bufferSize = Math.max(1, _bufferSize);
          _this._windowTime = Math.max(1, _windowTime);
          return _this;
        }
        ReplaySubject2.prototype.next = function(value) {
          var _a = this, isStopped = _a.isStopped, _buffer2 = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
          if (!isStopped) {
            _buffer2.push(value);
            !_infiniteTimeWindow && _buffer2.push(_timestampProvider.now() + _windowTime);
          }
          this._trimBuffer();
          _super.prototype.next.call(this, value);
        };
        ReplaySubject2.prototype._subscribe = function(subscriber) {
          this._throwIfClosed();
          this._trimBuffer();
          var subscription = this._innerSubscribe(subscriber);
          var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer2 = _a._buffer;
          var copy = _buffer2.slice();
          for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
            subscriber.next(copy[i]);
          }
          this._checkFinalizedStatuses(subscriber);
          return subscription;
        };
        ReplaySubject2.prototype._trimBuffer = function() {
          var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer2 = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
          var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
          _bufferSize < Infinity && adjustedBufferSize < _buffer2.length && _buffer2.splice(0, _buffer2.length - adjustedBufferSize);
          if (!_infiniteTimeWindow) {
            var now3 = _timestampProvider.now();
            var last2 = 0;
            for (var i = 1; i < _buffer2.length && _buffer2[i] <= now3; i += 2) {
              last2 = i;
            }
            last2 && _buffer2.splice(0, last2 + 1);
          }
        };
        return ReplaySubject2;
      })(Subject);
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/share.js
  function share(options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.connector, connector = _a === void 0 ? function() {
      return new Subject();
    } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
    return function(wrapperSource) {
      var connection;
      var resetConnection;
      var subject;
      var refCount = 0;
      var hasCompleted = false;
      var hasErrored = false;
      var cancelReset = function() {
        resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
        resetConnection = void 0;
      };
      var reset = function() {
        cancelReset();
        connection = subject = void 0;
        hasCompleted = hasErrored = false;
      };
      var resetAndUnsubscribe = function() {
        var conn = connection;
        reset();
        conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
      };
      return operate(function(source, subscriber) {
        refCount++;
        if (!hasErrored && !hasCompleted) {
          cancelReset();
        }
        var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
        subscriber.add(function() {
          refCount--;
          if (refCount === 0 && !hasErrored && !hasCompleted) {
            resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
          }
        });
        dest.subscribe(subscriber);
        if (!connection && refCount > 0) {
          connection = new SafeSubscriber({
            next: function(value) {
              return dest.next(value);
            },
            error: function(err) {
              hasErrored = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnError, err);
              dest.error(err);
            },
            complete: function() {
              hasCompleted = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnComplete);
              dest.complete();
            }
          });
          innerFrom(source).subscribe(connection);
        }
      })(wrapperSource);
    };
  }
  function handleReset(reset, on) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    if (on === true) {
      reset();
      return;
    }
    if (on === false) {
      return;
    }
    var onSubscriber = new SafeSubscriber({
      next: function() {
        onSubscriber.unsubscribe();
        reset();
      }
    });
    return innerFrom(on.apply(void 0, __spreadArray([], __read(args)))).subscribe(onSubscriber);
  }
  var init_share = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/share.js"() {
      init_tslib_es6();
      init_innerFrom();
      init_Subject();
      init_Subscriber();
      init_lift();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js
  function shareReplay(configOrBufferSize, windowTime, scheduler) {
    var _a, _b, _c;
    var bufferSize;
    var refCount = false;
    if (configOrBufferSize && typeof configOrBufferSize === "object") {
      _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
    } else {
      bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
    }
    return share({
      connector: function() {
        return new ReplaySubject(bufferSize, windowTime, scheduler);
      },
      resetOnError: true,
      resetOnComplete: false,
      resetOnRefCountZero: refCount
    });
  }
  var init_shareReplay = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/shareReplay.js"() {
      init_ReplaySubject();
      init_share();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/startWith.js
  function startWith() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    var scheduler = popScheduler(values);
    return operate(function(source, subscriber) {
      (scheduler ? concat(values, source, scheduler) : concat(values, source)).subscribe(subscriber);
    });
  }
  var init_startWith = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/startWith.js"() {
      init_concat();
      init_args();
      init_lift();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/operators/switchMap.js
  function switchMap(project, resultSelector) {
    return operate(function(source, subscriber) {
      var innerSubscriber = null;
      var index = 0;
      var isComplete = false;
      var checkComplete = function() {
        return isComplete && !innerSubscriber && subscriber.complete();
      };
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
        var innerIndex = 0;
        var outerIndex = index++;
        innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = createOperatorSubscriber(subscriber, function(innerValue) {
          return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
        }, function() {
          innerSubscriber = null;
          checkComplete();
        }));
      }, function() {
        isComplete = true;
        checkComplete();
      }));
    });
  }
  var init_switchMap = __esm({
    "node_modules/rxjs/dist/esm5/internal/operators/switchMap.js"() {
      init_innerFrom();
      init_lift();
      init_OperatorSubscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/operators/index.js
  var init_operators = __esm({
    "node_modules/rxjs/dist/esm5/operators/index.js"() {
      init_distinctUntilChanged();
      init_filter();
      init_map();
      init_mergeMap();
      init_mergeWith();
      init_shareReplay();
      init_startWith();
    }
  });

  // node_modules/rxdb/dist/esm/rx-change-event.js
  function getDocumentDataOfRxChangeEvent(rxChangeEvent) {
    if (rxChangeEvent.documentData) {
      return rxChangeEvent.documentData;
    } else {
      return rxChangeEvent.previousDocumentData;
    }
  }
  function rxChangeEventToEventReduceChangeEvent(rxChangeEvent) {
    switch (rxChangeEvent.operation) {
      case "INSERT":
        return {
          operation: rxChangeEvent.operation,
          id: rxChangeEvent.documentId,
          doc: rxChangeEvent.documentData,
          previous: null
        };
      case "UPDATE":
        return {
          operation: rxChangeEvent.operation,
          id: rxChangeEvent.documentId,
          doc: overwritable.deepFreezeWhenDevMode(rxChangeEvent.documentData),
          previous: rxChangeEvent.previousDocumentData ? rxChangeEvent.previousDocumentData : "UNKNOWN"
        };
      case "DELETE":
        return {
          operation: rxChangeEvent.operation,
          id: rxChangeEvent.documentId,
          doc: null,
          previous: rxChangeEvent.previousDocumentData
        };
    }
  }
  function rxChangeEventBulkToRxChangeEvents(eventBulk) {
    return getFromMapOrCreate(EVENT_BULK_CACHE, eventBulk, () => {
      var events = new Array(eventBulk.events.length);
      var rawEvents = eventBulk.events;
      var collectionName = eventBulk.collectionName;
      var isLocal = eventBulk.isLocal;
      var deepFreezeWhenDevMode = overwritable.deepFreezeWhenDevMode;
      for (var index = 0; index < rawEvents.length; index++) {
        var event = rawEvents[index];
        events[index] = {
          documentId: event.documentId,
          collectionName,
          isLocal,
          operation: event.operation,
          documentData: deepFreezeWhenDevMode(event.documentData),
          previousDocumentData: deepFreezeWhenDevMode(event.previousDocumentData)
        };
      }
      return events;
    });
  }
  var EVENT_BULK_CACHE;
  var init_rx_change_event = __esm({
    "node_modules/rxdb/dist/esm/rx-change-event.js"() {
      init_overwritable();
      init_utils();
      EVENT_BULK_CACHE = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
  function firstValueFrom(source, config2) {
    var hasConfig = typeof config2 === "object";
    return new Promise(function(resolve2, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          resolve2(value);
          subscriber.unsubscribe();
        },
        error: reject,
        complete: function() {
          if (hasConfig) {
            resolve2(config2.defaultValue);
          } else {
            reject(new EmptyError());
          }
        }
      });
      source.subscribe(subscriber);
    });
  }
  var init_firstValueFrom = __esm({
    "node_modules/rxjs/dist/esm5/internal/firstValueFrom.js"() {
      init_EmptyError();
      init_Subscriber();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/observable/merge.js
  function merge2() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    var scheduler = popScheduler(args);
    var concurrent = popNumber(args, Infinity);
    var sources = args;
    return !sources.length ? EMPTY : sources.length === 1 ? innerFrom(sources[0]) : mergeAll(concurrent)(from(sources, scheduler));
  }
  var init_merge2 = __esm({
    "node_modules/rxjs/dist/esm5/internal/observable/merge.js"() {
      init_mergeAll();
      init_innerFrom();
      init_empty();
      init_args();
      init_from();
    }
  });

  // node_modules/rxjs/dist/esm5/internal/types.js
  var init_types = __esm({
    "node_modules/rxjs/dist/esm5/internal/types.js"() {
    }
  });

  // node_modules/rxjs/dist/esm5/index.js
  var init_esm5 = __esm({
    "node_modules/rxjs/dist/esm5/index.js"() {
      init_Subject();
      init_BehaviorSubject();
      init_firstValueFrom();
      init_combineLatest();
      init_merge2();
      init_types();
      init_distinctUntilChanged();
      init_filter();
      init_map();
      init_mergeMap();
      init_shareReplay();
      init_startWith();
      init_switchMap();
    }
  });

  // node_modules/rxdb/dist/esm/query-planner.js
  function getQueryPlan(schema, query) {
    var selector = query.selector;
    var indexes = schema.indexes ? schema.indexes.slice(0) : [];
    if (query.index) {
      indexes = [query.index];
    }
    var hasDescSorting = !!query.sort.find((sortField) => Object.values(sortField)[0] === "desc");
    var sortIrrelevevantFields = /* @__PURE__ */ new Set();
    Object.keys(selector).forEach((fieldName) => {
      var schemaPart = getSchemaByObjectPath(schema, fieldName);
      if (schemaPart && schemaPart.type === "boolean" && Object.prototype.hasOwnProperty.call(selector[fieldName], "$eq")) {
        sortIrrelevevantFields.add(fieldName);
      }
    });
    var optimalSortIndex = query.sort.map((sortField) => Object.keys(sortField)[0]);
    var optimalSortIndexCompareString = optimalSortIndex.filter((f) => !sortIrrelevevantFields.has(f)).join(",");
    var currentBestQuality = -1;
    var currentBestQueryPlan;
    indexes.forEach((index) => {
      var inclusiveEnd = true;
      var inclusiveStart = true;
      var opts = index.map((indexField) => {
        var matcher = selector[indexField];
        var operators = matcher ? Object.keys(matcher) : [];
        var matcherOpts = {};
        if (!matcher || !operators.length) {
          var startKey = inclusiveStart ? INDEX_MIN : INDEX_MAX;
          matcherOpts = {
            startKey,
            endKey: inclusiveEnd ? INDEX_MAX : INDEX_MIN,
            inclusiveStart: true,
            inclusiveEnd: true
          };
        } else {
          operators.forEach((operator) => {
            if (LOGICAL_OPERATORS.has(operator)) {
              var operatorValue = matcher[operator];
              var partialOpts = getMatcherQueryOpts(operator, operatorValue);
              matcherOpts = Object.assign(matcherOpts, partialOpts);
            }
          });
        }
        if (typeof matcherOpts.startKey === "undefined") {
          matcherOpts.startKey = INDEX_MIN;
        }
        if (typeof matcherOpts.endKey === "undefined") {
          matcherOpts.endKey = INDEX_MAX;
        }
        if (typeof matcherOpts.inclusiveStart === "undefined") {
          matcherOpts.inclusiveStart = true;
        }
        if (typeof matcherOpts.inclusiveEnd === "undefined") {
          matcherOpts.inclusiveEnd = true;
        }
        if (inclusiveStart && !matcherOpts.inclusiveStart) {
          inclusiveStart = false;
        }
        if (inclusiveEnd && !matcherOpts.inclusiveEnd) {
          inclusiveEnd = false;
        }
        return matcherOpts;
      });
      var startKeys = opts.map((opt) => opt.startKey);
      var endKeys = opts.map((opt) => opt.endKey);
      var queryPlan = {
        index,
        startKeys,
        endKeys,
        inclusiveEnd,
        inclusiveStart,
        sortSatisfiedByIndex: !hasDescSorting && optimalSortIndexCompareString === index.filter((f) => !sortIrrelevevantFields.has(f)).join(","),
        selectorSatisfiedByIndex: isSelectorSatisfiedByIndex(index, query.selector, startKeys, endKeys)
      };
      var quality = rateQueryPlan(schema, query, queryPlan);
      if (quality >= currentBestQuality || query.index) {
        currentBestQuality = quality;
        currentBestQueryPlan = queryPlan;
      }
    });
    if (!currentBestQueryPlan) {
      throw newRxError("SNH", {
        query
      });
    }
    return currentBestQueryPlan;
  }
  function isSelectorSatisfiedByIndex(index, selector, startKeys, endKeys) {
    var selectorEntries = Object.entries(selector);
    var hasNonMatchingOperator = selectorEntries.find(([fieldName2, operation2]) => {
      if (!index.includes(fieldName2)) {
        return true;
      }
      var hasNonLogicOperator = Object.entries(operation2).find(([op, _value]) => !LOGICAL_OPERATORS.has(op));
      return hasNonLogicOperator;
    });
    if (hasNonMatchingOperator) {
      return false;
    }
    if (selector.$and || selector.$or) {
      return false;
    }
    var satisfieldLowerBound = [];
    var lowerOperatorFieldNames = /* @__PURE__ */ new Set();
    for (var [fieldName, operation] of Object.entries(selector)) {
      if (!index.includes(fieldName)) {
        return false;
      }
      var lowerLogicOps = Object.keys(operation).filter((key) => LOWER_BOUND_LOGICAL_OPERATORS.has(key));
      if (lowerLogicOps.length > 1) {
        return false;
      }
      var hasLowerLogicOp = lowerLogicOps[0];
      if (hasLowerLogicOp) {
        lowerOperatorFieldNames.add(fieldName);
      }
      if (hasLowerLogicOp !== "$eq") {
        if (satisfieldLowerBound.length > 0) {
          return false;
        } else {
          satisfieldLowerBound.push(hasLowerLogicOp);
        }
      }
    }
    var satisfieldUpperBound = [];
    var upperOperatorFieldNames = /* @__PURE__ */ new Set();
    for (var [_fieldName, _operation] of Object.entries(selector)) {
      if (!index.includes(_fieldName)) {
        return false;
      }
      var upperLogicOps = Object.keys(_operation).filter((key) => UPPER_BOUND_LOGICAL_OPERATORS.has(key));
      if (upperLogicOps.length > 1) {
        return false;
      }
      var hasUperLogicOp = upperLogicOps[0];
      if (hasUperLogicOp) {
        upperOperatorFieldNames.add(_fieldName);
      }
      if (hasUperLogicOp !== "$eq") {
        if (satisfieldUpperBound.length > 0) {
          return false;
        } else {
          satisfieldUpperBound.push(hasUperLogicOp);
        }
      }
    }
    var i = 0;
    for (var _fieldName2 of index) {
      for (var set of [lowerOperatorFieldNames, upperOperatorFieldNames]) {
        if (!set.has(_fieldName2) && set.size > 0) {
          return false;
        }
        set.delete(_fieldName2);
      }
      var startKey = startKeys[i];
      var endKey = endKeys[i];
      if (startKey !== endKey && lowerOperatorFieldNames.size > 0 && upperOperatorFieldNames.size > 0) {
        return false;
      }
      i++;
    }
    return true;
  }
  function getMatcherQueryOpts(operator, operatorValue) {
    switch (operator) {
      case "$eq":
        return {
          startKey: operatorValue,
          endKey: operatorValue,
          inclusiveEnd: true,
          inclusiveStart: true
        };
      case "$lte":
        return {
          endKey: operatorValue,
          inclusiveEnd: true
        };
      case "$gte":
        return {
          startKey: operatorValue,
          inclusiveStart: true
        };
      case "$lt":
        return {
          endKey: operatorValue,
          inclusiveEnd: false
        };
      case "$gt":
        return {
          startKey: operatorValue,
          inclusiveStart: false
        };
      default:
        throw new Error("SNH");
    }
  }
  function rateQueryPlan(schema, query, queryPlan) {
    var quality = 0;
    var addQuality = (value) => {
      if (value > 0) {
        quality = quality + value;
      }
    };
    var pointsPerMatchingKey = 10;
    var nonMinKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MIN && keyValue !== INDEX_MAX);
    addQuality(nonMinKeyCount * pointsPerMatchingKey);
    var nonMaxKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue) => keyValue !== INDEX_MAX && keyValue !== INDEX_MIN);
    addQuality(nonMaxKeyCount * pointsPerMatchingKey);
    var equalKeyCount = countUntilNotMatching(queryPlan.startKeys, (keyValue, idx) => {
      if (keyValue === queryPlan.endKeys[idx]) {
        return true;
      } else {
        return false;
      }
    });
    addQuality(equalKeyCount * pointsPerMatchingKey * 1.5);
    var pointsIfNoReSortMustBeDone = queryPlan.sortSatisfiedByIndex ? 5 : 0;
    addQuality(pointsIfNoReSortMustBeDone);
    return quality;
  }
  var INDEX_MAX, INDEX_MIN, LOGICAL_OPERATORS, LOWER_BOUND_LOGICAL_OPERATORS, UPPER_BOUND_LOGICAL_OPERATORS;
  var init_query_planner = __esm({
    "node_modules/rxdb/dist/esm/query-planner.js"() {
      init_utils();
      init_rx_error();
      init_rx_schema_helper();
      INDEX_MAX = String.fromCharCode(65535);
      INDEX_MIN = Number.MIN_SAFE_INTEGER;
      LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte", "$lt", "$lte"]);
      LOWER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$gt", "$gte"]);
      UPPER_BOUND_LOGICAL_OPERATORS = /* @__PURE__ */ new Set(["$eq", "$lt", "$lte"]);
    }
  });

  // node_modules/mingo/dist/esm/util.js
  function assert(condition, message) {
    if (!condition) throw new MingoError(message);
  }
  function typeOf(v) {
    const s = Object.prototype.toString.call(v);
    return s === "[object Object]" ? v?.constructor?.name?.toLowerCase() || "object" : STRING_REP[s] || s.substring(8, s.length - 1).toLowerCase();
  }
  function isObject2(v) {
    if (!v) return false;
    const p = Object.getPrototypeOf(v);
    return (p === Object.prototype || p === null) && typeOf(v) === "object";
  }
  function merge3(target, input) {
    if (isMissing(target) || isNil(target)) return input;
    if (isMissing(input) || isNil(input)) return target;
    if (isPrimitive(target) || isPrimitive(input)) return input;
    if (isArray3(target) && isArray3(input)) {
      assert(
        target.length === input.length,
        "arrays must be of equal length to merge."
      );
    }
    for (const k of Object.keys(input)) {
      target[k] = merge3(target[k], input[k]);
    }
    return target;
  }
  function intersection(input, hashFunction = DEFAULT_HASH_FUNCTION) {
    const vmaps = [ValueMap.init(hashFunction), ValueMap.init(hashFunction)];
    if (input.length === 0) return [];
    if (input.some((arr) => arr.length === 0)) return [];
    if (input.length === 1) return [...input];
    input[input.length - 1].forEach((v) => vmaps[0].set(v, true));
    for (let i = input.length - 2; i > -1; i--) {
      input[i].forEach((v) => {
        if (vmaps[0].has(v)) vmaps[1].set(v, true);
      });
      if (vmaps[1].size === 0) return [];
      vmaps.reverse();
      vmaps[1].clear();
    }
    return Array.from(vmaps[0].keys());
  }
  function flatten(xs, depth = 1) {
    const arr = new Array();
    function flatten2(ys, n) {
      for (let i = 0, len = ys.length; i < len; i++) {
        if (isArray3(ys[i]) && (n > 0 || n < 0)) {
          flatten2(ys[i], Math.max(-1, n - 1));
        } else {
          arr.push(ys[i]);
        }
      }
    }
    flatten2(xs, depth);
    return arr;
  }
  function getMembersOf(o) {
    const props = {};
    while (o) {
      for (const k of Object.getOwnPropertyNames(o))
        if (!(k in props)) props[k] = o[k];
      o = Object.getPrototypeOf(o);
    }
    return props;
  }
  function hasCustomString(o) {
    while (o) {
      if (Object.getOwnPropertyNames(o).includes("toString"))
        return o["toString"] !== Object.prototype.toString;
      o = Object.getPrototypeOf(o);
    }
    return false;
  }
  function isEqual(a, b) {
    if (a === b || Object.is(a, b)) return true;
    if (a === null || b === null) return false;
    if (typeof a !== typeof b) return false;
    if (typeof a !== "object") return false;
    if (a.constructor !== b.constructor) return false;
    if (a instanceof Date) return +a === +b;
    if (a instanceof RegExp) return a.toString() === b.toString();
    const ctor = a.constructor;
    if (ctor === Array || ctor === Object) {
      const aKeys = Object.keys(a).sort();
      const bKeys = Object.keys(b).sort();
      if (aKeys.length !== bKeys.length) return false;
      for (let i = 0, k = aKeys[i]; i < aKeys.length; k = aKeys[++i]) {
        if (k !== bKeys[i] || !isEqual(a[k], b[k])) return false;
      }
      return true;
    }
    return hasCustomString(a) && a.toString() === b.toString();
  }
  function unique(input, hashFunction = DEFAULT_HASH_FUNCTION) {
    const m = ValueMap.init(hashFunction);
    input.forEach((v) => m.set(v, true));
    return Array.from(m.keys());
  }
  function hashCode(value, hashFunction) {
    if (isNil(value)) return null;
    hashFunction = hashFunction || DEFAULT_HASH_FUNCTION;
    return hashFunction(value);
  }
  function groupBy(collection, keyFn, hashFunction = DEFAULT_HASH_FUNCTION) {
    if (collection.length < 1) return /* @__PURE__ */ new Map();
    const lookup = /* @__PURE__ */ new Map();
    const result = /* @__PURE__ */ new Map();
    for (let i = 0; i < collection.length; i++) {
      const obj = collection[i];
      const key = keyFn(obj, i);
      const hash = hashCode(key, hashFunction);
      if (hash === null) {
        if (result.has(null)) {
          result.get(null).push(obj);
        } else {
          result.set(null, [obj]);
        }
      } else {
        const existingKey = lookup.has(hash) ? lookup.get(hash).find((k) => isEqual(k, key)) : null;
        if (isNil(existingKey)) {
          result.set(key, [obj]);
          if (lookup.has(hash)) {
            lookup.get(hash).push(key);
          } else {
            lookup.set(hash, [key]);
          }
        } else {
          result.get(existingKey).push(obj);
        }
      }
    }
    return result;
  }
  function getValue(obj, key) {
    return isObjectLike(obj) ? obj[key] : void 0;
  }
  function unwrap(arr, depth) {
    if (depth < 1) return arr;
    while (depth-- && arr.length === 1) arr = arr[0];
    return arr;
  }
  function resolve(obj, selector, options) {
    let depth = 0;
    function resolve2(o, path) {
      let value = o;
      for (let i = 0; i < path.length; i++) {
        const field = path[i];
        const isText = /^\d+$/.exec(field) === null;
        if (isText && isArray3(value)) {
          if (i === 0 && depth > 0) break;
          depth += 1;
          const subpath = path.slice(i);
          value = value.reduce((acc, item) => {
            const v = resolve2(item, subpath);
            if (v !== void 0) acc.push(v);
            return acc;
          }, []);
          break;
        } else {
          value = getValue(value, field);
        }
        if (value === void 0) break;
      }
      return value;
    }
    const res = isScalar(obj) ? obj : resolve2(obj, selector.split("."));
    return isArray3(res) && options?.unwrapArray ? unwrap(res, depth) : res;
  }
  function resolveGraph(obj, selector, options) {
    const sep = selector.indexOf(".");
    const key = sep == -1 ? selector : selector.substring(0, sep);
    const next = selector.substring(sep + 1);
    const hasNext = sep != -1;
    if (isArray3(obj)) {
      const isIndex = /^\d+$/.test(key);
      const arr = isIndex && options?.preserveIndex ? [...obj] : [];
      if (isIndex) {
        const index = parseInt(key);
        let value2 = getValue(obj, index);
        if (hasNext) {
          value2 = resolveGraph(value2, next, options);
        }
        if (options?.preserveIndex) {
          arr[index] = value2;
        } else {
          arr.push(value2);
        }
      } else {
        for (const item of obj) {
          const value2 = resolveGraph(item, selector, options);
          if (options?.preserveMissing) {
            arr.push(value2 == void 0 ? MISSING : value2);
          } else if (value2 != void 0 || options?.preserveIndex) {
            arr.push(value2);
          }
        }
      }
      return arr;
    }
    const res = options?.preserveKeys ? { ...obj } : {};
    let value = getValue(obj, key);
    if (hasNext) {
      value = resolveGraph(value, next, options);
    }
    if (value === void 0) return void 0;
    res[key] = value;
    return res;
  }
  function filterMissing(obj) {
    if (isArray3(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        if (obj[i] === MISSING) {
          obj.splice(i, 1);
        } else {
          filterMissing(obj[i]);
        }
      }
    } else if (isObject2(obj)) {
      for (const k in obj) {
        if (has(obj, k)) {
          filterMissing(obj[k]);
        }
      }
    }
  }
  function walk(obj, selector, fn, options) {
    const names = selector.split(".");
    const key = names[0];
    const next = names.slice(1).join(".");
    if (names.length === 1) {
      if (isObject2(obj) || isArray3(obj) && NUMBER_RE.test(key)) {
        fn(obj, key);
      }
    } else {
      if (options?.buildGraph && isNil(obj[key])) {
        obj[key] = {};
      }
      const item = obj[key];
      if (!item) return;
      const isNextArrayIndex = !!(names.length > 1 && NUMBER_RE.test(names[1]));
      if (isArray3(item) && options?.descendArray && !isNextArrayIndex) {
        item.forEach((e) => walk(e, next, fn, options));
      } else {
        walk(item, next, fn, options);
      }
    }
  }
  function setValue(obj, selector, value) {
    walk(
      obj,
      selector,
      (item, key) => {
        item[key] = isFunction2(value) ? value(item[key]) : value;
      },
      { buildGraph: true }
    );
  }
  function removeValue(obj, selector, options) {
    walk(
      obj,
      selector,
      (item, key) => {
        if (isArray3(item)) {
          if (/^\d+$/.test(key)) {
            item.splice(parseInt(key), 1);
          } else if (options && options.descendArray) {
            for (const elem of item) {
              if (isObject2(elem)) {
                delete elem[key];
              }
            }
          }
        } else if (isObject2(item)) {
          delete item[key];
        }
      },
      options
    );
  }
  function isOperator(name) {
    return OPERATOR_NAME_PATTERN.test(name);
  }
  function normalize(expr) {
    if (isScalar(expr)) {
      return isRegExp(expr) ? { $regex: expr } : { $eq: expr };
    }
    if (isObjectLike(expr)) {
      if (!Object.keys(expr).some(isOperator)) return { $eq: expr };
      if (has(expr, "$regex")) {
        const newExpr = { ...expr };
        newExpr["$regex"] = new RegExp(
          expr["$regex"],
          expr["$options"]
        );
        delete newExpr["$options"];
        return newExpr;
      }
    }
    return expr;
  }
  var MingoError, MISSING, CYCLE_FOUND_ERROR, DEFAULT_HASH_FUNCTION, isPrimitive, isScalar, SORT_ORDER, compare, _hashFn, _keyMap, _unpack, _ValueMap, ValueMap, STRING_REP, isBoolean, isString, isSymbol, isNumber, isArray3, isObjectLike, isDate, isRegExp, isFunction2, isNil, truthy, isEmpty, ensureArray, has, isTypedArray, cloneDeep, isMissing, stringify, NUMBER_RE, OPERATOR_NAME_PATTERN;
  var init_util = __esm({
    "node_modules/mingo/dist/esm/util.js"() {
      MingoError = class extends Error {
      };
      MISSING = Symbol("missing");
      CYCLE_FOUND_ERROR = Object.freeze(
        new Error("mingo: cycle detected while processing object/array")
      );
      DEFAULT_HASH_FUNCTION = (value) => {
        const s = stringify(value);
        let hash = 0;
        let i = s.length;
        while (i) hash = (hash << 5) - hash ^ s.charCodeAt(--i);
        return hash >>> 0;
      };
      isPrimitive = (v) => typeof v !== "object" && typeof v !== "function" || v === null;
      isScalar = (v) => isPrimitive(v) || isDate(v) || isRegExp(v);
      SORT_ORDER = {
        undefined: 1,
        null: 2,
        number: 3,
        string: 4,
        symbol: 5,
        object: 6,
        array: 7,
        arraybuffer: 8,
        boolean: 9,
        date: 10,
        regexp: 11,
        function: 12
      };
      compare = (a, b) => {
        if (a === MISSING) a = void 0;
        if (b === MISSING) b = void 0;
        const [u, v] = [a, b].map((n) => SORT_ORDER[typeOf(n)] || 0);
        if (u !== v) return u - v;
        if (isEqual(a, b)) return 0;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
      _ValueMap = class _ValueMap extends Map {
        constructor() {
          super();
          // The hash function
          __privateAdd(this, _hashFn, DEFAULT_HASH_FUNCTION);
          // maps the hashcode to key set
          __privateAdd(this, _keyMap, /* @__PURE__ */ new Map());
          // returns a tuple of [<masterKey>, <hash>]. Expects an object key.
          __privateAdd(this, _unpack, (key) => {
            const hash = __privateGet(this, _hashFn).call(this, key);
            return [(__privateGet(this, _keyMap).get(hash) || []).find((k) => isEqual(k, key)), hash];
          });
        }
        /**
         * Returns a new {@link ValueMap} object.
         * @param fn An optional custom hash function
         */
        static init(fn) {
          const m = new _ValueMap();
          if (fn) __privateSet(m, _hashFn, fn);
          return m;
        }
        clear() {
          super.clear();
          __privateGet(this, _keyMap).clear();
        }
        /**
         * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
         */
        delete(key) {
          if (isPrimitive(key)) return super.delete(key);
          const [masterKey, hash] = __privateGet(this, _unpack).call(this, key);
          if (!super.delete(masterKey)) return false;
          __privateGet(this, _keyMap).set(
            hash,
            __privateGet(this, _keyMap).get(hash).filter((k) => !isEqual(k, masterKey))
          );
          return true;
        }
        /**
         * Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
         * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
         */
        get(key) {
          if (isPrimitive(key)) return super.get(key);
          const [masterKey, _] = __privateGet(this, _unpack).call(this, key);
          return super.get(masterKey);
        }
        /**
         * @returns boolean indicating whether an element with the specified key exists or not.
         */
        has(key) {
          if (isPrimitive(key)) return super.has(key);
          const [masterKey, _] = __privateGet(this, _unpack).call(this, key);
          return super.has(masterKey);
        }
        /**
         * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
         */
        set(key, value) {
          if (isPrimitive(key)) return super.set(key, value);
          const [masterKey, hash] = __privateGet(this, _unpack).call(this, key);
          if (super.has(masterKey)) {
            super.set(masterKey, value);
          } else {
            super.set(key, value);
            const keys = __privateGet(this, _keyMap).get(hash) || [];
            keys.push(key);
            __privateGet(this, _keyMap).set(hash, keys);
          }
          return this;
        }
        /**
         * @returns the number of elements in the Map.
         */
        get size() {
          return super.size;
        }
      };
      _hashFn = new WeakMap();
      _keyMap = new WeakMap();
      _unpack = new WeakMap();
      ValueMap = _ValueMap;
      STRING_REP = Object.keys(SORT_ORDER).reduce(
        (memo, k) => {
          memo["[object " + k[0].toUpperCase() + k.substring(1) + "]"] = k;
          return memo;
        },
        {}
      );
      isBoolean = (v) => typeof v === "boolean";
      isString = (v) => typeof v === "string";
      isSymbol = (v) => typeof v === "symbol";
      isNumber = (v) => !isNaN(v) && typeof v === "number";
      isArray3 = Array.isArray;
      isObjectLike = (v) => !isPrimitive(v);
      isDate = (v) => v instanceof Date;
      isRegExp = (v) => v instanceof RegExp;
      isFunction2 = (v) => typeof v === "function";
      isNil = (v) => v === null || v === void 0;
      truthy = (arg, strict = true) => !!arg || strict && arg === "";
      isEmpty = (x) => isNil(x) || isString(x) && !x || isArray3(x) && x.length === 0 || isObject2(x) && Object.keys(x).length === 0;
      ensureArray = (x) => isArray3(x) ? x : [x];
      has = (obj, prop) => !!obj && Object.prototype.hasOwnProperty.call(obj, prop);
      isTypedArray = (v) => typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(v);
      cloneDeep = (v, refs) => {
        if (isNil(v) || isBoolean(v) || isNumber(v) || isString(v)) return v;
        if (isDate(v)) return new Date(v);
        if (isRegExp(v)) return new RegExp(v);
        if (isTypedArray(v)) {
          const ctor = v.constructor;
          return new ctor(v);
        }
        if (!(refs instanceof Set)) refs = /* @__PURE__ */ new Set();
        if (refs.has(v)) throw CYCLE_FOUND_ERROR;
        refs.add(v);
        try {
          if (isArray3(v)) {
            const arr = new Array(v.length);
            for (let i = 0; i < v.length; i++) arr[i] = cloneDeep(v[i], refs);
            return arr;
          }
          if (isObject2(v)) {
            const obj = {};
            for (const k of Object.keys(v)) obj[k] = cloneDeep(v[k], refs);
            return obj;
          }
        } finally {
          refs.delete(v);
        }
        return v;
      };
      isMissing = (v) => v === MISSING;
      stringify = (v, refs) => {
        if (v === null) return "null";
        if (v === void 0) return "undefined";
        if (isString(v) || isNumber(v) || isBoolean(v)) return JSON.stringify(v);
        if (isDate(v)) return v.toISOString();
        if (isRegExp(v) || isSymbol(v) || isFunction2(v))
          return v.toString();
        if (!(refs instanceof Set)) refs = /* @__PURE__ */ new Set();
        if (refs.has(v)) throw CYCLE_FOUND_ERROR;
        try {
          refs.add(v);
          if (isArray3(v)) return "[" + v.map((s2) => stringify(s2, refs)).join(",") + "]";
          if (isObject2(v)) {
            const keys = Object.keys(v).sort();
            return "{" + keys.map((k) => `${k}:${stringify(v[k], refs)}`).join() + "}";
          }
          const s = hasCustomString(v) ? v.toString() : stringify(getMembersOf(v), refs);
          return typeOf(v) + "(" + s + ")";
        } finally {
          refs.delete(v);
        }
      };
      NUMBER_RE = /^\d+$/;
      OPERATOR_NAME_PATTERN = /^\$[a-zA-Z0-9_]+$/;
    }
  });

  // node_modules/mingo/dist/esm/core.js
  function initOptions(options) {
    return options instanceof ComputeOptions ? options.getOptions() : Object.freeze({
      idKey: "_id",
      scriptEnabled: true,
      useStrictMode: true,
      useGlobalContext: true,
      processingMode: 0,
      ...options,
      context: options?.context ? Context.from(options?.context) : Context.init()
    });
  }
  function useOperators(type5, operators) {
    for (const [name, fn] of Object.entries(operators)) {
      assert(
        isFunction2(fn) && isOperator(name),
        `'${name}' is not a valid operator`
      );
      const currentFn = getOperator(type5, name, null);
      assert(
        !currentFn || fn === currentFn,
        `${name} already exists for '${type5}' operators. Cannot change operator function once registered.`
      );
    }
    switch (type5) {
      case "accumulator":
        GLOBAL_CONTEXT.addAccumulatorOps(operators);
        break;
      case "expression":
        GLOBAL_CONTEXT.addExpressionOps(operators);
        break;
      case "pipeline":
        GLOBAL_CONTEXT.addPipelineOps(operators);
        break;
      case "projection":
        GLOBAL_CONTEXT.addProjectionOps(operators);
        break;
      case "query":
        GLOBAL_CONTEXT.addQueryOps(operators);
        break;
      case "window":
        GLOBAL_CONTEXT.addWindowOps(operators);
        break;
    }
  }
  function getOperator(type5, name, options) {
    const { context: ctx, useGlobalContext: fallback } = options || {};
    const fn = ctx ? ctx.getOperator(type5, name) : null;
    return !fn && fallback ? GLOBAL_CONTEXT.getOperator(type5, name) : fn;
  }
  function computeValue(obj, expr, operator, options) {
    const copts = ComputeOptions.init(options, obj);
    return !!operator && isOperator(operator) ? computeOperator(obj, expr, operator, copts) : computeExpression(obj, expr, copts);
  }
  function computeExpression(obj, expr, options) {
    if (isString(expr) && expr.length > 0 && expr[0] === "$") {
      if (REDACT_ACTIONS.includes(expr)) return expr;
      let ctx = options.root;
      const arr = expr.split(".");
      if (SYSTEM_VARS.includes(arr[0])) {
        switch (arr[0]) {
          case "$$ROOT":
            break;
          case "$$CURRENT":
            ctx = obj;
            break;
          case "$$REMOVE":
            ctx = void 0;
            break;
          case "$$NOW":
            ctx = /* @__PURE__ */ new Date();
            break;
        }
        expr = expr.slice(arr[0].length + 1);
      } else if (arr[0].slice(0, 2) === "$$") {
        ctx = Object.assign(
          {},
          // global vars
          options.variables,
          // current item is added before local variables because the binding may be changed.
          { this: obj },
          // local vars
          options?.local?.variables
        );
        const name = arr[0].slice(2);
        assert(has(ctx, name), `Use of undefined variable: ${name}`);
        expr = expr.slice(2);
      } else {
        expr = expr.slice(1);
      }
      return expr === "" ? ctx : resolve(ctx, expr);
    }
    if (isArray3(expr)) {
      return expr.map((item) => computeExpression(obj, item, options));
    }
    if (isObject2(expr)) {
      const result = {};
      const elems = Object.entries(expr);
      for (const [key, val] of elems) {
        if (isOperator(key)) {
          assert(elems.length == 1, "expression must have single operator.");
          return computeOperator(obj, val, key, options);
        }
        result[key] = computeExpression(obj, val, options);
      }
      return result;
    }
    return expr;
  }
  function computeOperator(obj, expr, operator, options) {
    const callExpression = getOperator(
      "expression",
      operator,
      options
    );
    if (callExpression) return callExpression(obj, expr, options);
    const callAccumulator = getOperator(
      "accumulator",
      operator,
      options
    );
    assert(!!callAccumulator, `accumulator '${operator}' is not registered.`);
    if (!isArray3(obj)) {
      obj = computeExpression(obj, expr, options);
      expr = null;
    }
    assert(isArray3(obj), `arguments must resolve to array for ${operator}.`);
    return callAccumulator(obj, expr, options);
  }
  var ProcessingMode, _options, _root, _local, _ComputeOptions, ComputeOptions, _operators, _Context, Context, GLOBAL_CONTEXT, SYSTEM_VARS, REDACT_ACTIONS;
  var init_core = __esm({
    "node_modules/mingo/dist/esm/core.js"() {
      init_util();
      ProcessingMode = /* @__PURE__ */ ((ProcessingMode2) => {
        ProcessingMode2[ProcessingMode2["CLONE_OFF"] = 0] = "CLONE_OFF";
        ProcessingMode2[ProcessingMode2["CLONE_INPUT"] = 1] = "CLONE_INPUT";
        ProcessingMode2[ProcessingMode2["CLONE_OUTPUT"] = 2] = "CLONE_OUTPUT";
        ProcessingMode2[ProcessingMode2["CLONE_ALL"] = 3] = "CLONE_ALL";
        return ProcessingMode2;
      })(ProcessingMode || {});
      _ComputeOptions = class _ComputeOptions {
        constructor(options, root, local) {
          __privateAdd(this, _options);
          /** Reference to the root object when processing subgraphs of the object. */
          __privateAdd(this, _root);
          __privateAdd(this, _local);
          __privateSet(this, _options, options);
          this.update(root, local);
        }
        /**
         * Initialize new ComputeOptions.
         * @returns {ComputeOptions}
         */
        static init(options, root, local) {
          return !(options instanceof _ComputeOptions) ? new _ComputeOptions(options, root, local) : new _ComputeOptions(__privateGet(options, _options), options.root ?? root, {
            ...__privateGet(options, _local),
            ...local,
            variables: Object.assign(
              {},
              __privateGet(options, _local)?.variables,
              local?.variables
            )
          });
        }
        /**
         * Updates the internal state.
         *
         * @param root The new root context for this object.
         * @param local The new local state to merge into current if it exists.
         * @returns
         */
        update(root, local) {
          __privateSet(this, _root, root);
          const variables = Object.assign(
            {},
            __privateGet(this, _local)?.variables,
            local?.variables
          );
          if (Object.keys(variables).length) {
            __privateSet(this, _local, { ...local, variables });
          } else {
            __privateSet(this, _local, local ?? {});
          }
          return this;
        }
        getOptions() {
          return Object.freeze({
            ...__privateGet(this, _options),
            context: Context.from(__privateGet(this, _options).context)
          });
        }
        get root() {
          return __privateGet(this, _root);
        }
        get local() {
          return __privateGet(this, _local);
        }
        get idKey() {
          return __privateGet(this, _options).idKey;
        }
        get collation() {
          return __privateGet(this, _options)?.collation;
        }
        get processingMode() {
          return __privateGet(this, _options)?.processingMode || 0;
        }
        get useStrictMode() {
          return __privateGet(this, _options)?.useStrictMode;
        }
        get scriptEnabled() {
          return __privateGet(this, _options)?.scriptEnabled;
        }
        get useGlobalContext() {
          return __privateGet(this, _options)?.useGlobalContext;
        }
        get hashFunction() {
          return __privateGet(this, _options)?.hashFunction;
        }
        get collectionResolver() {
          return __privateGet(this, _options)?.collectionResolver;
        }
        get jsonSchemaValidator() {
          return __privateGet(this, _options)?.jsonSchemaValidator;
        }
        get variables() {
          return __privateGet(this, _options)?.variables;
        }
        get context() {
          return __privateGet(this, _options)?.context;
        }
      };
      _options = new WeakMap();
      _root = new WeakMap();
      _local = new WeakMap();
      ComputeOptions = _ComputeOptions;
      _Context = class _Context {
        constructor() {
          __privateAdd(this, _operators, /* @__PURE__ */ new Map());
        }
        static init() {
          return new _Context();
        }
        static from(ctx) {
          const instance = _Context.init();
          if (isNil(ctx)) return instance;
          __privateGet(ctx, _operators).forEach((v, k) => instance.addOperators(k, v));
          return instance;
        }
        addOperators(type5, operators) {
          if (!__privateGet(this, _operators).has(type5)) __privateGet(this, _operators).set(type5, {});
          for (const [name, fn] of Object.entries(operators)) {
            if (!this.getOperator(type5, name)) {
              __privateGet(this, _operators).get(type5)[name] = fn;
            }
          }
          return this;
        }
        getOperator(type5, name) {
          const ops = __privateGet(this, _operators).get(type5) ?? {};
          return ops[name] ?? null;
        }
        addAccumulatorOps(ops) {
          return this.addOperators("accumulator", ops);
        }
        addExpressionOps(ops) {
          return this.addOperators("expression", ops);
        }
        addQueryOps(ops) {
          return this.addOperators("query", ops);
        }
        addPipelineOps(ops) {
          return this.addOperators("pipeline", ops);
        }
        addProjectionOps(ops) {
          return this.addOperators("projection", ops);
        }
        addWindowOps(ops) {
          return this.addOperators("window", ops);
        }
      };
      _operators = new WeakMap();
      Context = _Context;
      GLOBAL_CONTEXT = Context.init();
      SYSTEM_VARS = ["$$ROOT", "$$CURRENT", "$$REMOVE", "$$NOW"];
      REDACT_ACTIONS = ["$$KEEP", "$$PRUNE", "$$DESCEND"];
    }
  });

  // node_modules/mingo/dist/esm/lazy.js
  function Lazy(source) {
    return source instanceof Iterator2 ? source : new Iterator2(source);
  }
  function concat2(...iterators) {
    let index = 0;
    return Lazy(() => {
      while (index < iterators.length) {
        const o = iterators[index].next();
        if (!o.done) return o;
        index++;
      }
      return { done: true };
    });
  }
  function isGenerator(o) {
    return !!o && typeof o === "object" && o?.next instanceof Function;
  }
  function dropItem(array, i) {
    const rest = array.slice(i + 1);
    array.splice(i);
    Array.prototype.push.apply(array, rest);
  }
  function createCallback(nextFn, iteratees, buffer) {
    let done = false;
    let index = -1;
    let bufferIndex = 0;
    return function(storeResult) {
      try {
        outer: while (!done) {
          let o = nextFn();
          index++;
          let i = -1;
          const size = iteratees.length;
          let innerDone = false;
          while (++i < size) {
            const r = iteratees[i];
            switch (r.action) {
              case 0:
                o = r.func(o, index);
                break;
              case 1:
                if (!r.func(o, index)) continue outer;
                break;
              case 2:
                --r.count;
                if (!r.count) innerDone = true;
                break;
              case 3:
                --r.count;
                if (!r.count) dropItem(iteratees, i);
                continue outer;
              default:
                break outer;
            }
          }
          done = innerDone;
          if (storeResult) {
            buffer[bufferIndex++] = o;
          } else {
            return { value: o, done: false };
          }
        }
      } catch (e) {
        if (e !== DONE) throw e;
      }
      done = true;
      return { done };
    };
  }
  var DONE, _iteratees, _yieldedValues, _getNext, Iterator2;
  var init_lazy = __esm({
    "node_modules/mingo/dist/esm/lazy.js"() {
      init_util();
      DONE = new Error();
      Iterator2 = class {
        /**
         * @param {*} source An iterable object or function.
         *    Array - return one element per cycle
         *    Object{next:Function} - call next() for the next value (this also handles generator functions)
         *    Function - call to return the next value
         * @param {Function} fn An optional transformation function
         */
        constructor(source) {
          __privateAdd(this, _iteratees);
          __privateAdd(this, _yieldedValues);
          __privateAdd(this, _getNext);
          __privateSet(this, _iteratees, []);
          __privateSet(this, _yieldedValues, []);
          this.isDone = false;
          let nextVal;
          if (source instanceof Function) {
            source = { next: source };
          }
          if (isGenerator(source)) {
            const src = source;
            nextVal = () => {
              const o = src.next();
              if (o.done) throw DONE;
              return o.value;
            };
          } else if (isArray3(source)) {
            const data = source;
            const size = data.length;
            let index = 0;
            nextVal = () => {
              if (index < size) return data[index++];
              throw DONE;
            };
          } else if (!(source instanceof Function)) {
            throw new MingoError(
              `Lazy must be initialized with an array, generator, or function.`
            );
          }
          __privateSet(this, _getNext, createCallback(
            nextVal,
            __privateGet(this, _iteratees),
            __privateGet(this, _yieldedValues)
          ));
        }
        /**
         * Add an iteratee to this lazy sequence
         */
        push(action, value) {
          if (typeof value === "function") {
            __privateGet(this, _iteratees).push({ action, func: value });
          } else if (typeof value === "number") {
            __privateGet(this, _iteratees).push({ action, count: value });
          }
          return this;
        }
        next() {
          return __privateGet(this, _getNext).call(this);
        }
        // Iteratees methods
        /**
         * Transform each item in the sequence to a new value
         * @param {Function} f
         */
        map(f) {
          return this.push(0, f);
        }
        /**
         * Select only items matching the given predicate
         * @param {Function} pred
         */
        filter(predicate) {
          return this.push(1, predicate);
        }
        /**
         * Take given numbe for values from sequence
         * @param {Number} n A number greater than 0
         */
        take(n) {
          return n > 0 ? this.push(2, n) : this;
        }
        /**
         * Drop a number of values from the sequence
         * @param {Number} n Number of items to drop greater than 0
         */
        drop(n) {
          return n > 0 ? this.push(3, n) : this;
        }
        // Transformations
        /**
         * Returns a new lazy object with results of the transformation
         * The entire sequence is realized.
         *
         * @param {Callback<Source, Any[]>} fn Tranform function of type (Array) => (Any)
         */
        transform(fn) {
          const self2 = this;
          let iter;
          return Lazy(() => {
            if (!iter) {
              iter = Lazy(fn(self2.value()));
            }
            return iter.next();
          });
        }
        // Terminal methods
        /**
         * Returns the fully realized values of the iterators.
         * The return value will be an array unless `lazy.first()` was used.
         * The realized values are cached for subsequent calls.
         */
        value() {
          if (!this.isDone) {
            this.isDone = __privateGet(this, _getNext).call(this, true).done;
          }
          return __privateGet(this, _yieldedValues);
        }
        /**
         * Execute the funcion for each value. Will stop when an execution returns false.
         * @param {Function} f
         * @returns {Boolean} false iff `f` return false for AnyVal execution, otherwise true
         */
        each(f) {
          for (; ; ) {
            const o = this.next();
            if (o.done) break;
            if (f(o.value) === false) return false;
          }
          return true;
        }
        /**
         * Returns the reduction of sequence according the reducing function
         *
         * @param {*} f a reducing function
         * @param {*} initialValue
         */
        reduce(f, initialValue) {
          let o = this.next();
          if (initialValue === void 0 && !o.done) {
            initialValue = o.value;
            o = this.next();
          }
          while (!o.done) {
            initialValue = f(initialValue, o.value);
            o = this.next();
          }
          return initialValue;
        }
        /**
         * Returns the number of matched items in the sequence
         */
        size() {
          return this.reduce(
            (acc, _) => ++acc,
            0
          );
        }
        [Symbol.iterator]() {
          return this;
        }
      };
      _iteratees = new WeakMap();
      _yieldedValues = new WeakMap();
      _getNext = new WeakMap();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/limit.js
  var $limit;
  var init_limit = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/limit.js"() {
      $limit = (collection, expr, _options4) => collection.take(expr);
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/project.js
  function createHandler(expr, options, isRoot = true) {
    const idKey = options.idKey;
    const expressionKeys = Object.keys(expr);
    const excludedKeys = new Array();
    const includedKeys = new Array();
    const handlers = {};
    for (const key of expressionKeys) {
      const subExpr = expr[key];
      if (isNumber(subExpr) || isBoolean(subExpr)) {
        if (subExpr) {
          includedKeys.push(key);
        } else {
          excludedKeys.push(key);
        }
      } else if (isArray3(subExpr)) {
        handlers[key] = (o) => subExpr.map((v) => computeValue(o, v, null, options.update(o)) ?? null);
      } else if (isObject2(subExpr)) {
        const subExprKeys = Object.keys(subExpr);
        const operator = subExprKeys.length == 1 ? subExprKeys[0] : "";
        const projectFn = getOperator(
          "projection",
          operator,
          options
        );
        if (projectFn) {
          const foundSlice = operator === "$slice";
          if (foundSlice && !ensureArray(subExpr[operator]).every(isNumber)) {
            handlers[key] = (o) => computeValue(o, subExpr, key, options.update(o));
          } else {
            handlers[key] = (o) => projectFn(o, subExpr[operator], key, options.update(o));
          }
        } else if (isOperator(operator)) {
          handlers[key] = (o) => computeValue(o, subExpr[operator], operator, options);
        } else {
          validateExpression(subExpr, options);
          handlers[key] = (o) => {
            if (!has(o, key)) return computeValue(o, subExpr, null, options);
            if (isRoot) options.update(o);
            const target = resolve(o, key);
            const fn = createHandler(subExpr, options, false);
            if (isArray3(target)) return target.map(fn);
            if (isObject2(target)) return fn(target);
            return fn(o);
          };
        }
      } else {
        handlers[key] = isString(subExpr) && subExpr[0] === "$" ? (o) => computeValue(o, subExpr, key, options) : (_) => subExpr;
      }
    }
    const handlerKeys = Object.keys(handlers);
    const idKeyExcluded = excludedKeys.includes(idKey);
    const idKeyOnlyExcluded = isRoot && idKeyExcluded && excludedKeys.length === 1 && !includedKeys.length && !handlerKeys.length;
    if (idKeyOnlyExcluded) {
      return (o) => {
        const newObj = { ...o };
        delete newObj[idKey];
        return newObj;
      };
    }
    const idKeyImplicit = isRoot && !idKeyExcluded && !includedKeys.includes(idKey);
    const opts = {
      preserveMissing: true
    };
    return (o) => {
      const newObj = {};
      if (excludedKeys.length && !includedKeys.length) {
        merge3(newObj, o);
        for (const k of excludedKeys) {
          removeValue(newObj, k, { descendArray: true });
        }
      }
      for (const k of includedKeys) {
        const pathObj = resolveGraph(o, k, opts) ?? {};
        merge3(newObj, pathObj);
      }
      if (includedKeys.length) filterMissing(newObj);
      for (const k of handlerKeys) {
        const value = handlers[k](o);
        if (value === void 0) {
          removeValue(newObj, k, { descendArray: true });
        } else {
          setValue(newObj, k, value);
        }
      }
      if (idKeyImplicit && has(o, idKey)) {
        newObj[idKey] = resolve(o, idKey);
      }
      return newObj;
    };
  }
  function validateExpression(expr, options) {
    let exclusions = false;
    let inclusions = false;
    for (const [k, v] of Object.entries(expr)) {
      assert(!k.startsWith("$"), "Field names may not start with '$'.");
      assert(
        !k.endsWith(".$"),
        "Positional projection operator '$' is not supported."
      );
      if (k === options?.idKey) continue;
      if (v === 0 || v === false) {
        exclusions = true;
      } else if (v === 1 || v === true) {
        inclusions = true;
      }
      assert(
        !(exclusions && inclusions),
        "Projection cannot have a mix of inclusion and exclusion."
      );
    }
  }
  var $project;
  var init_project = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/project.js"() {
      init_core();
      init_util();
      $project = (collection, expr, options) => {
        if (isEmpty(expr)) return collection;
        validateExpression(expr, options);
        return collection.map(createHandler(expr, ComputeOptions.init(options)));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/skip.js
  var $skip;
  var init_skip = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/skip.js"() {
      $skip = (collection, expr, _options4) => {
        return collection.drop(expr);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/sort.js
  function collationComparator(spec) {
    const localeOpt = {
      sensitivity: COLLATION_STRENGTH[spec.strength || 3],
      caseFirst: spec.caseFirst === "off" ? "false" : spec.caseFirst || "false",
      numeric: spec.numericOrdering || false,
      ignorePunctuation: spec.alternate === "shifted"
    };
    if ((spec.caseLevel || false) === true) {
      if (localeOpt.sensitivity === "base") localeOpt.sensitivity = "case";
      if (localeOpt.sensitivity === "accent") localeOpt.sensitivity = "variant";
    }
    const collator = new Intl.Collator(spec.locale, localeOpt);
    return (a, b) => {
      if (!isString(a) || !isString(b)) return compare(a, b);
      const i = collator.compare(a, b);
      if (i < 0) return -1;
      if (i > 0) return 1;
      return 0;
    };
  }
  var $sort, COLLATION_STRENGTH;
  var init_sort = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/sort.js"() {
      init_util();
      $sort = (collection, sortKeys, options) => {
        if (isEmpty(sortKeys) || !isObject2(sortKeys)) return collection;
        let cmp2 = compare;
        const collationSpec = options.collation;
        if (isObject2(collationSpec) && isString(collationSpec.locale)) {
          cmp2 = collationComparator(collationSpec);
        }
        return collection.transform((coll) => {
          const modifiers = Object.keys(sortKeys);
          for (const key of modifiers.reverse()) {
            const groups = groupBy(
              coll,
              (obj) => resolve(obj, key),
              options.hashFunction
            );
            const sortedKeys = Array.from(groups.keys()).sort(cmp2);
            if (sortKeys[key] === -1) sortedKeys.reverse();
            let i = 0;
            for (const k of sortedKeys) for (const v of groups.get(k)) coll[i++] = v;
            assert(i == coll.length, "bug: counter must match collection size.");
          }
          return coll;
        });
      };
      COLLATION_STRENGTH = {
        // Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A.
        1: "base",
        //  Only strings that differ in base letters or accents and other diacritic marks compare as unequal.
        // Examples: a ≠ b, a ≠ á, a = A.
        2: "accent",
        // Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal.
        // Other differences may also be taken into consideration. Examples: a ≠ b, a ≠ á, a ≠ A
        3: "variant"
        // case - Only strings that differ in base letters or case compare as unequal. Examples: a ≠ b, a = á, a ≠ A.
      };
    }
  });

  // node_modules/mingo/dist/esm/cursor.js
  var OPERATORS, _source, _predicate, _projection, _options2, _operators2, _result, _buffer, Cursor;
  var init_cursor = __esm({
    "node_modules/mingo/dist/esm/cursor.js"() {
      init_core();
      init_lazy();
      init_limit();
      init_project();
      init_skip();
      init_sort();
      init_util();
      OPERATORS = { $sort, $skip, $limit };
      Cursor = class {
        constructor(source, predicate, projection, options) {
          __privateAdd(this, _source);
          __privateAdd(this, _predicate);
          __privateAdd(this, _projection);
          __privateAdd(this, _options2);
          __privateAdd(this, _operators2, {});
          __privateAdd(this, _result, null);
          __privateAdd(this, _buffer, []);
          __privateSet(this, _source, source);
          __privateSet(this, _predicate, predicate);
          __privateSet(this, _projection, projection);
          __privateSet(this, _options2, options);
        }
        /** Returns the iterator from running the query */
        fetch() {
          if (__privateGet(this, _result)) return __privateGet(this, _result);
          __privateSet(this, _result, Lazy(__privateGet(this, _source)).filter(__privateGet(this, _predicate)));
          const mode = __privateGet(this, _options2).processingMode;
          if (mode & ProcessingMode.CLONE_INPUT) __privateGet(this, _result).map(cloneDeep);
          for (const op of ["$sort", "$skip", "$limit"]) {
            if (has(__privateGet(this, _operators2), op)) {
              __privateSet(this, _result, OPERATORS[op](
                __privateGet(this, _result),
                __privateGet(this, _operators2)[op],
                __privateGet(this, _options2)
              ));
            }
          }
          if (Object.keys(__privateGet(this, _projection)).length) {
            __privateSet(this, _result, $project(__privateGet(this, _result), __privateGet(this, _projection), __privateGet(this, _options2)));
          }
          if (mode & ProcessingMode.CLONE_OUTPUT) __privateGet(this, _result).map(cloneDeep);
          return __privateGet(this, _result);
        }
        /** Returns an iterator with the buffered data included */
        fetchAll() {
          const buffered = Lazy([...__privateGet(this, _buffer)]);
          __privateSet(this, _buffer, []);
          return concat2(buffered, this.fetch());
        }
        /**
         * Return remaining objects in the cursor as an array. This method exhausts the cursor
         * @returns {Array}
         */
        all() {
          return this.fetchAll().value();
        }
        /**
         * Returns the number of objects return in the cursor. This method exhausts the cursor
         * @returns {Number}
         */
        count() {
          return this.all().length;
        }
        /**
         * Returns a cursor that begins returning results only after passing or skipping a number of documents.
         * @param {Number} n the number of results to skip.
         * @return {Cursor} Returns the cursor, so you can chain this call.
         */
        skip(n) {
          __privateGet(this, _operators2)["$skip"] = n;
          return this;
        }
        /**
         * Constrains the size of a cursor's result set.
         * @param {Number} n the number of results to limit to.
         * @return {Cursor} Returns the cursor, so you can chain this call.
         */
        limit(n) {
          __privateGet(this, _operators2)["$limit"] = n;
          return this;
        }
        /**
         * Returns results ordered according to a sort specification.
         * @param {AnyObject} modifier an object of key and values specifying the sort order. 1 for ascending and -1 for descending
         * @return {Cursor} Returns the cursor, so you can chain this call.
         */
        sort(modifier) {
          __privateGet(this, _operators2)["$sort"] = modifier;
          return this;
        }
        /**
         * Specifies the collation for the cursor returned by the `mingo.Query.find`
         * @param {*} spec
         */
        collation(spec) {
          __privateSet(this, _options2, { ...__privateGet(this, _options2), collation: spec });
          return this;
        }
        /**
         * Returns the next document in a cursor.
         * @returns {AnyObject | Boolean}
         */
        next() {
          if (__privateGet(this, _buffer).length > 0) {
            return __privateGet(this, _buffer).pop();
          }
          const o = this.fetch().next();
          if (o.done) return;
          return o.value;
        }
        /**
         * Returns true if the cursor has documents and can be iterated.
         * @returns {boolean}
         */
        hasNext() {
          if (__privateGet(this, _buffer).length > 0) return true;
          const o = this.fetch().next();
          if (o.done) return false;
          __privateGet(this, _buffer).push(o.value);
          return true;
        }
        /**
         * Applies a function to each document in a cursor and collects the return values in an array.
         * @param fn
         * @returns {Array}
         */
        map(fn) {
          return this.all().map(fn);
        }
        /**
         * Applies a JavaScript function for every document in a cursor.
         * @param fn
         */
        forEach(fn) {
          this.all().forEach(fn);
        }
        [Symbol.iterator]() {
          return this.fetchAll();
        }
      };
      _source = new WeakMap();
      _predicate = new WeakMap();
      _projection = new WeakMap();
      _options2 = new WeakMap();
      _operators2 = new WeakMap();
      _result = new WeakMap();
      _buffer = new WeakMap();
    }
  });

  // node_modules/mingo/dist/esm/query.js
  var TOP_LEVEL_OPS, _compiled, _options3, _condition, Query;
  var init_query = __esm({
    "node_modules/mingo/dist/esm/query.js"() {
      init_core();
      init_cursor();
      init_util();
      TOP_LEVEL_OPS = new Set(
        Array.from(["$and", "$or", "$nor", "$expr", "$jsonSchema"])
      );
      Query = class {
        constructor(condition, options) {
          __privateAdd(this, _compiled);
          __privateAdd(this, _options3);
          __privateAdd(this, _condition);
          __privateSet(this, _condition, cloneDeep(condition));
          __privateSet(this, _options3, initOptions(options));
          __privateSet(this, _compiled, []);
          this.compile();
        }
        compile() {
          assert(
            isObject2(__privateGet(this, _condition)),
            `query criteria must be an object: ${JSON.stringify(__privateGet(this, _condition))}`
          );
          const whereOperator = {};
          for (const [field, expr] of Object.entries(__privateGet(this, _condition))) {
            if ("$where" === field) {
              assert(
                __privateGet(this, _options3).scriptEnabled,
                "$where operator requires 'scriptEnabled' option to be true."
              );
              Object.assign(whereOperator, { field, expr });
            } else if (TOP_LEVEL_OPS.has(field)) {
              this.processOperator(field, field, expr);
            } else {
              assert(!isOperator(field), `unknown top level operator: ${field}`);
              for (const [operator, val] of Object.entries(
                normalize(expr)
              )) {
                this.processOperator(field, operator, val);
              }
            }
            if (whereOperator.field) {
              this.processOperator(
                whereOperator.field,
                whereOperator.field,
                whereOperator.expr
              );
            }
          }
        }
        processOperator(field, operator, value) {
          const call = getOperator("query", operator, __privateGet(this, _options3));
          assert(!!call, `unknown query operator ${operator}`);
          __privateGet(this, _compiled).push(call(field, value, __privateGet(this, _options3)));
        }
        /**
         * Checks if the object passes the query criteria. Returns true if so, false otherwise.
         *
         * @param obj The object to test
         * @returns {boolean}
         */
        test(obj) {
          return __privateGet(this, _compiled).every((p) => p(obj));
        }
        /**
         * Returns a cursor to select matching documents from the input source.
         *
         * @param source A source providing a sequence of documents
         * @param projection An optional projection criteria
         * @returns {Cursor} A Cursor for iterating over the results
         */
        find(collection, projection) {
          return new Cursor(
            collection,
            (o) => this.test(o),
            projection || {},
            __privateGet(this, _options3)
          );
        }
        /**
         * Remove matched documents from the collection returning the remainder
         *
         * @param collection An array of documents
         * @returns {Array} A new array with matching elements removed
         */
        remove(collection) {
          return collection.reduce((acc, obj) => {
            if (!this.test(obj)) acc.push(obj);
            return acc;
          }, []);
        }
      };
      _compiled = new WeakMap();
      _options3 = new WeakMap();
      _condition = new WeakMap();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/addFields.js
  var init_addFields = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/addFields.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/bucket.js
  var init_bucket = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/bucket.js"() {
      init_core();
      init_lazy();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/bucketAuto.js
  var PREFERRED_NUMBERS;
  var init_bucketAuto = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/bucketAuto.js"() {
      init_core();
      init_lazy();
      init_util();
      PREFERRED_NUMBERS = Object.freeze({
        // "Least rounded" Renard number series, taken from Wikipedia page on preferred
        // numbers: https://en.wikipedia.org/wiki/Preferred_number#Renard_numbers
        R5: [10, 16, 25, 40, 63],
        R10: [100, 125, 160, 200, 250, 315, 400, 500, 630, 800],
        R20: [
          100,
          112,
          125,
          140,
          160,
          180,
          200,
          224,
          250,
          280,
          315,
          355,
          400,
          450,
          500,
          560,
          630,
          710,
          800,
          900
        ],
        R40: [
          100,
          106,
          112,
          118,
          125,
          132,
          140,
          150,
          160,
          170,
          180,
          190,
          200,
          212,
          224,
          236,
          250,
          265,
          280,
          300,
          315,
          355,
          375,
          400,
          425,
          450,
          475,
          500,
          530,
          560,
          600,
          630,
          670,
          710,
          750,
          800,
          850,
          900,
          950
        ],
        R80: [
          103,
          109,
          115,
          122,
          128,
          136,
          145,
          155,
          165,
          175,
          185,
          195,
          206,
          218,
          230,
          243,
          258,
          272,
          290,
          307,
          325,
          345,
          365,
          387,
          412,
          437,
          462,
          487,
          515,
          545,
          575,
          615,
          650,
          690,
          730,
          775,
          825,
          875,
          925,
          975
        ],
        // https://en.wikipedia.org/wiki/Preferred_number#1-2-5_series
        "1-2-5": [10, 20, 50],
        // E series, taken from Wikipedia page on preferred numbers:
        // https://en.wikipedia.org/wiki/Preferred_number#E_series
        E6: [10, 15, 22, 33, 47, 68],
        E12: [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82],
        E24: [
          10,
          11,
          12,
          13,
          15,
          16,
          18,
          20,
          22,
          24,
          27,
          30,
          33,
          36,
          39,
          43,
          47,
          51,
          56,
          62,
          68,
          75,
          82,
          91
        ],
        E48: [
          100,
          105,
          110,
          115,
          121,
          127,
          133,
          140,
          147,
          154,
          162,
          169,
          178,
          187,
          196,
          205,
          215,
          226,
          237,
          249,
          261,
          274,
          287,
          301,
          316,
          332,
          348,
          365,
          383,
          402,
          422,
          442,
          464,
          487,
          511,
          536,
          562,
          590,
          619,
          649,
          681,
          715,
          750,
          787,
          825,
          866,
          909,
          953
        ],
        E96: [
          100,
          102,
          105,
          107,
          110,
          113,
          115,
          118,
          121,
          124,
          127,
          130,
          133,
          137,
          140,
          143,
          147,
          150,
          154,
          158,
          162,
          165,
          169,
          174,
          178,
          182,
          187,
          191,
          196,
          200,
          205,
          210,
          215,
          221,
          226,
          232,
          237,
          243,
          249,
          255,
          261,
          267,
          274,
          280,
          287,
          294,
          301,
          309,
          316,
          324,
          332,
          340,
          348,
          357,
          365,
          374,
          383,
          392,
          402,
          412,
          422,
          432,
          442,
          453,
          464,
          475,
          487,
          499,
          511,
          523,
          536,
          549,
          562,
          576,
          590,
          604,
          619,
          634,
          649,
          665,
          681,
          698,
          715,
          732,
          750,
          768,
          787,
          806,
          825,
          845,
          866,
          887,
          909,
          931,
          953,
          976
        ],
        E192: [
          100,
          101,
          102,
          104,
          105,
          106,
          107,
          109,
          110,
          111,
          113,
          114,
          115,
          117,
          118,
          120,
          121,
          123,
          124,
          126,
          127,
          129,
          130,
          132,
          133,
          135,
          137,
          138,
          140,
          142,
          143,
          145,
          147,
          149,
          150,
          152,
          154,
          156,
          158,
          160,
          162,
          164,
          165,
          167,
          169,
          172,
          174,
          176,
          178,
          180,
          182,
          184,
          187,
          189,
          191,
          193,
          196,
          198,
          200,
          203,
          205,
          208,
          210,
          213,
          215,
          218,
          221,
          223,
          226,
          229,
          232,
          234,
          237,
          240,
          243,
          246,
          249,
          252,
          255,
          258,
          261,
          264,
          267,
          271,
          274,
          277,
          280,
          284,
          287,
          291,
          294,
          298,
          301,
          305,
          309,
          312,
          316,
          320,
          324,
          328,
          332,
          336,
          340,
          344,
          348,
          352,
          357,
          361,
          365,
          370,
          374,
          379,
          383,
          388,
          392,
          397,
          402,
          407,
          412,
          417,
          422,
          427,
          432,
          437,
          442,
          448,
          453,
          459,
          464,
          470,
          475,
          481,
          487,
          493,
          499,
          505,
          511,
          517,
          523,
          530,
          536,
          542,
          549,
          556,
          562,
          569,
          576,
          583,
          590,
          597,
          604,
          612,
          619,
          626,
          634,
          642,
          649,
          657,
          665,
          673,
          681,
          690,
          698,
          706,
          715,
          723,
          732,
          741,
          750,
          759,
          768,
          777,
          787,
          796,
          806,
          816,
          825,
          835,
          845,
          856,
          866,
          876,
          887,
          898,
          909,
          920,
          931,
          942,
          953,
          965,
          976,
          988
        ]
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/count.js
  var init_count = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/count.js"() {
      init_lazy();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/types.js
  var init_types2 = __esm({
    "node_modules/mingo/dist/esm/types.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/_internal.js
  var DAYS_PER_WEEK, MILLIS_PER_DAY, TIMEUNIT_IN_MILLIS, DAYS_OF_WEEK, DAYS_OF_WEEK_SET, ISO_WEEKDAY_MAP, DATE_SYM_TABLE;
  var init_internal = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/_internal.js"() {
      init_core();
      init_util();
      DAYS_PER_WEEK = 7;
      MILLIS_PER_DAY = 1e3 * 60 * 60 * 24;
      TIMEUNIT_IN_MILLIS = {
        week: MILLIS_PER_DAY * DAYS_PER_WEEK,
        day: MILLIS_PER_DAY,
        hour: 1e3 * 60 * 60,
        minute: 1e3 * 60,
        second: 1e3,
        millisecond: 1
      };
      DAYS_OF_WEEK = [
        "monday",
        "mon",
        "tuesday",
        "tue",
        "wednesday",
        "wed",
        "thursday",
        "thu",
        "friday",
        "fri",
        "saturday",
        "sat",
        "sunday",
        "sun"
      ];
      DAYS_OF_WEEK_SET = new Set(DAYS_OF_WEEK);
      ISO_WEEKDAY_MAP = Object.freeze({
        mon: 1,
        tue: 2,
        wed: 3,
        thu: 4,
        fri: 5,
        sat: 6,
        sun: 7
      });
      DATE_SYM_TABLE = Object.freeze({
        "%Y": { name: "year", padding: 4, re: /([0-9]{4})/ },
        "%G": { name: "year", padding: 4, re: /([0-9]{4})/ },
        "%m": { name: "month", padding: 2, re: /(0[1-9]|1[012])/ },
        "%d": { name: "day", padding: 2, re: /(0[1-9]|[12][0-9]|3[01])/ },
        "%H": { name: "hour", padding: 2, re: /([01][0-9]|2[0-3])/ },
        "%M": { name: "minute", padding: 2, re: /([0-5][0-9])/ },
        "%S": { name: "second", padding: 2, re: /([0-5][0-9]|60)/ },
        "%L": { name: "millisecond", padding: 3, re: /([0-9]{3})/ },
        "%u": { name: "weekday", padding: 1, re: /([1-7])/ },
        "%U": { name: "week", padding: 2, re: /([1-4][0-9]?|5[0-3]?)/ },
        "%V": { name: "isoWeek", padding: 2, re: /([1-4][0-9]?|5[0-3]?)/ },
        "%z": {
          name: "timezone",
          padding: 2,
          re: /(([+-][01][0-9]|2[0-3]):?([0-5][0-9])?)/
        },
        "%Z": { name: "minuteOffset", padding: 3, re: /([+-][0-9]{3})/ }
        // "%%": "%",
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateAdd.js
  var init_dateAdd = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateAdd.js"() {
      init_core();
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/densify.js
  var EMPTY_OBJECT;
  var init_densify = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/densify.js"() {
      init_core();
      init_lazy();
      init_types2();
      init_util();
      init_dateAdd();
      init_sort();
      EMPTY_OBJECT = Object.freeze({});
    }
  });

  // node_modules/mingo/dist/esm/aggregator.js
  var init_aggregator = __esm({
    "node_modules/mingo/dist/esm/aggregator.js"() {
      init_core();
      init_lazy();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/facet.js
  var init_facet = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/facet.js"() {
      init_aggregator();
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/conditional/ifNull.js
  var init_ifNull = __esm({
    "node_modules/mingo/dist/esm/operators/expression/conditional/ifNull.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/accumulator.js
  var init_accumulator = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/accumulator.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/push.js
  var init_push = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/push.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/addToSet.js
  var init_addToSet = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/addToSet.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/avg.js
  var init_avg = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/avg.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/bottomN.js
  var init_bottomN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/bottomN.js"() {
      init_core();
      init_lazy();
      init_sort();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/bottom.js
  var init_bottom = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/bottom.js"() {
      init_bottomN();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/count.js
  var init_count2 = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/count.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/_internal.js
  var init_internal2 = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/_internal.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/covariancePop.js
  var init_covariancePop = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/covariancePop.js"() {
      init_internal2();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/covarianceSamp.js
  var init_covarianceSamp = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/covarianceSamp.js"() {
      init_internal2();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/first.js
  var init_first = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/first.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/firstN.js
  var init_firstN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/firstN.js"() {
      init_core();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/last.js
  var init_last = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/last.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/lastN.js
  var init_lastN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/lastN.js"() {
      init_core();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/max.js
  var init_max = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/max.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/maxN.js
  var init_maxN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/maxN.js"() {
      init_core();
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/percentile.js
  var init_percentile = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/percentile.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/median.js
  var init_median = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/median.js"() {
      init_percentile();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/object/mergeObjects.js
  var init_mergeObjects = __esm({
    "node_modules/mingo/dist/esm/operators/expression/object/mergeObjects.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/mergeObjects.js
  var init_mergeObjects2 = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/mergeObjects.js"() {
      init_core();
      init_mergeObjects();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/min.js
  var init_min = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/min.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/minN.js
  var init_minN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/minN.js"() {
      init_core();
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/stdDevPop.js
  var init_stdDevPop = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/stdDevPop.js"() {
      init_util();
      init_internal2();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/stdDevSamp.js
  var init_stdDevSamp = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/stdDevSamp.js"() {
      init_util();
      init_internal2();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/sum.js
  var init_sum = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/sum.js"() {
      init_util();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/topN.js
  var init_topN = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/topN.js"() {
      init_core();
      init_lazy();
      init_sort();
      init_push();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/top.js
  var init_top = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/top.js"() {
      init_topN();
    }
  });

  // node_modules/mingo/dist/esm/operators/accumulator/index.js
  var init_accumulator2 = __esm({
    "node_modules/mingo/dist/esm/operators/accumulator/index.js"() {
      init_accumulator();
      init_addToSet();
      init_avg();
      init_bottom();
      init_bottomN();
      init_count2();
      init_covariancePop();
      init_covarianceSamp();
      init_first();
      init_firstN();
      init_last();
      init_lastN();
      init_max();
      init_maxN();
      init_median();
      init_mergeObjects2();
      init_min();
      init_minN();
      init_percentile();
      init_push();
      init_stdDevPop();
      init_stdDevSamp();
      init_sum();
      init_top();
      init_topN();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/_internal.js
  var init_internal3 = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/_internal.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/window/_internal.js
  var MILLIS_PER_UNIT;
  var init_internal4 = __esm({
    "node_modules/mingo/dist/esm/operators/window/_internal.js"() {
      init_util();
      init_accumulator2();
      init_internal();
      init_internal3();
      MILLIS_PER_UNIT = {
        week: MILLIS_PER_DAY * 7,
        day: MILLIS_PER_DAY,
        hour: MILLIS_PER_DAY / 24,
        minute: 6e4,
        second: 1e3,
        millisecond: 1
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/window/linearFill.js
  var init_linearFill = __esm({
    "node_modules/mingo/dist/esm/operators/window/linearFill.js"() {
      init_util();
      init_accumulator2();
      init_internal4();
    }
  });

  // node_modules/mingo/dist/esm/operators/window/locf.js
  var init_locf = __esm({
    "node_modules/mingo/dist/esm/operators/window/locf.js"() {
      init_util();
      init_push();
      init_internal4();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/custom/function.js
  var init_function = __esm({
    "node_modules/mingo/dist/esm/operators/expression/custom/function.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/group.js
  var init_group = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/group.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/setWindowFields.js
  var init_setWindowFields = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/setWindowFields.js"() {
      init_core();
      init_lazy();
      init_util();
      init_function();
      init_dateAdd();
      init_internal3();
      init_addFields();
      init_group();
      init_sort();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/fill.js
  var init_fill = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/fill.js"() {
      init_core();
      init_util();
      init_ifNull();
      init_linearFill();
      init_locf();
      init_addFields();
      init_setWindowFields();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/lookup.js
  var init_lookup = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/lookup.js"() {
      init_aggregator();
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/graphLookup.js
  var init_graphLookup = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/graphLookup.js"() {
      init_core();
      init_lazy();
      init_util();
      init_lookup();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/match.js
  var init_match = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/match.js"() {
      init_query();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/abs.js
  var init_abs = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/abs.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/add.js
  var init_add = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/add.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/ceil.js
  var init_ceil = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/ceil.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/divide.js
  var init_divide = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/divide.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/exp.js
  var init_exp = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/exp.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/floor.js
  var init_floor = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/floor.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/ln.js
  var init_ln = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/ln.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/log.js
  var init_log = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/log.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/log10.js
  var init_log10 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/log10.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/mod.js
  var init_mod = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/mod.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/multiply.js
  var init_multiply = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/multiply.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/pow.js
  var init_pow = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/pow.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/_internal.js
  var init_internal5 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/_internal.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/round.js
  var init_round = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/round.js"() {
      init_core();
      init_util();
      init_internal5();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/sqrt.js
  var init_sqrt = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/sqrt.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/subtract.js
  var init_subtract = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/subtract.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/trunc.js
  var init_trunc = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/trunc.js"() {
      init_core();
      init_util();
      init_internal5();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/arithmetic/index.js
  var init_arithmetic = __esm({
    "node_modules/mingo/dist/esm/operators/expression/arithmetic/index.js"() {
      init_abs();
      init_add();
      init_ceil();
      init_divide();
      init_exp();
      init_floor();
      init_ln();
      init_log();
      init_log10();
      init_mod();
      init_multiply();
      init_pow();
      init_round();
      init_sqrt();
      init_subtract();
      init_trunc();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/arrayElemAt.js
  var init_arrayElemAt = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/arrayElemAt.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/arrayToObject.js
  var init_arrayToObject = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/arrayToObject.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/concatArrays.js
  var init_concatArrays = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/concatArrays.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/filter.js
  var init_filter2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/filter.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/first.js
  var init_first2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/first.js"() {
      init_core();
      init_util();
      init_first();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/firstN.js
  var init_firstN2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/firstN.js"() {
      init_core();
      init_util();
      init_firstN();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/in.js
  var init_in = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/in.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/indexOfArray.js
  var init_indexOfArray = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/indexOfArray.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/isArray.js
  var init_isArray = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/isArray.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/last.js
  var init_last2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/last.js"() {
      init_core();
      init_util();
      init_last();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/lastN.js
  var init_lastN2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/lastN.js"() {
      init_core();
      init_util();
      init_lastN();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/map.js
  var init_map2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/map.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/maxN.js
  var init_maxN2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/maxN.js"() {
      init_core();
      init_util();
      init_maxN();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/minN.js
  var init_minN2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/minN.js"() {
      init_core();
      init_util();
      init_minN();
    }
  });

  // node_modules/mingo/dist/esm/operators/_predicates.js
  function createQueryOperator(predicate) {
    const f = (selector, value, options) => {
      const opts = { unwrapArray: true };
      const depth = Math.max(1, selector.split(".").length - 1);
      return (obj) => {
        const lhs = resolve(obj, selector, opts);
        return predicate(lhs, value, { ...options, depth });
      };
    };
    return f;
  }
  function createExpressionOperator(predicate) {
    return (obj, expr, options) => {
      const args = computeValue(obj, expr, null, options);
      return predicate(...args);
    };
  }
  function $eq(a, b, options) {
    if (isEqual(a, b)) return true;
    if (isNil(a) && isNil(b)) return true;
    if (isArray3(a)) {
      return a.some((v) => isEqual(v, b)) || flatten(a, options?.depth).some((v) => isEqual(v, b));
    }
    return false;
  }
  function $ne(a, b, options) {
    return !$eq(a, b, options);
  }
  function $in(a, b, options) {
    if (isNil(a)) return b.some((v) => v === null);
    return intersection([ensureArray(a), b], options?.hashFunction).length > 0;
  }
  function $nin(a, b, options) {
    return !$in(a, b, options);
  }
  function $lt(a, b, _options4) {
    return compare2(a, b, (x, y) => compare(x, y) < 0);
  }
  function $lte(a, b, _options4) {
    return compare2(a, b, (x, y) => compare(x, y) <= 0);
  }
  function $gt(a, b, _options4) {
    return compare2(a, b, (x, y) => compare(x, y) > 0);
  }
  function $gte(a, b, _options4) {
    return compare2(a, b, (x, y) => compare(x, y) >= 0);
  }
  function $mod(a, b, _options4) {
    return ensureArray(a).some(
      (x) => b.length === 2 && x % b[0] === b[1]
    );
  }
  function $regex(a, b, options) {
    const lhs = ensureArray(a);
    const match = (x) => isString(x) && truthy(b.exec(x), options?.useStrictMode);
    return lhs.some(match) || flatten(lhs, 1).some(match);
  }
  function $all(values, queries, options) {
    if (!isArray3(values) || !isArray3(queries) || !values.length || !queries.length) {
      return false;
    }
    let matched = true;
    for (const query of queries) {
      if (!matched) break;
      if (isObject2(query) && Object.keys(query).includes("$elemMatch")) {
        matched = $elemMatch(values, query["$elemMatch"], options);
      } else if (isRegExp(query)) {
        matched = values.some((s) => typeof s === "string" && query.test(s));
      } else {
        matched = values.some((v) => isEqual(query, v));
      }
    }
    return matched;
  }
  function $size(a, b, _options4) {
    return Array.isArray(a) && a.length === b;
  }
  function isNonBooleanOperator(name) {
    return isOperator(name) && ["$and", "$or", "$nor"].indexOf(name) === -1;
  }
  function $elemMatch(a, b, options) {
    if (isArray3(a) && !isEmpty(a)) {
      let format = (x) => x;
      let criteria = b;
      if (Object.keys(b).every(isNonBooleanOperator)) {
        criteria = { temp: b };
        format = (x) => ({ temp: x });
      }
      const query = new Query(criteria, options);
      for (let i = 0, len = a.length; i < len; i++) {
        if (query.test(format(a[i]))) {
          return true;
        }
      }
    }
    return false;
  }
  function compareType(a, b, _) {
    const f = compareFuncs[b];
    return f ? f(a) : false;
  }
  function $type(a, b, options) {
    return isArray3(b) ? b.findIndex((t) => compareType(a, t, options)) >= 0 : compareType(a, b, options);
  }
  function compare2(a, b, f) {
    return ensureArray(a).some((x) => typeOf(x) === typeOf(b) && f(x, b));
  }
  var isNull, compareFuncs;
  var init_predicates = __esm({
    "node_modules/mingo/dist/esm/operators/_predicates.js"() {
      init_core();
      init_query();
      init_util();
      isNull = (a) => a === null;
      compareFuncs = {
        array: isArray3,
        boolean: isBoolean,
        bool: isBoolean,
        date: isDate,
        number: isNumber,
        int: isNumber,
        long: isNumber,
        double: isNumber,
        decimal: isNumber,
        null: isNull,
        object: isObject2,
        regexp: isRegExp,
        regex: isRegExp,
        string: isString,
        // added for completeness
        undefined: isNil,
        // deprecated
        function: (_) => {
          throw new MingoError("unsupported type key `function`.");
        },
        // Mongo identifiers
        1: isNumber,
        //double
        2: isString,
        3: isObject2,
        4: isArray3,
        6: isNil,
        // deprecated
        8: isBoolean,
        9: isDate,
        10: isNull,
        11: isRegExp,
        16: isNumber,
        //int
        18: isNumber,
        //long
        19: isNumber
        //decimal
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/nin.js
  var $nin2;
  var init_nin = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/nin.js"() {
      init_predicates();
      $nin2 = createExpressionOperator($nin);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/range.js
  var init_range = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/range.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/reduce.js
  var init_reduce = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/reduce.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/reverseArray.js
  var init_reverseArray = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/reverseArray.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/size.js
  var init_size = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/size.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/slice.js
  var init_slice = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/slice.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/sortArray.js
  var init_sortArray = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/sortArray.js"() {
      init_core();
      init_lazy();
      init_util();
      init_sort();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/zip.js
  var init_zip = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/zip.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/array/index.js
  var init_array = __esm({
    "node_modules/mingo/dist/esm/operators/expression/array/index.js"() {
      init_arrayElemAt();
      init_arrayToObject();
      init_concatArrays();
      init_filter2();
      init_first2();
      init_firstN2();
      init_in();
      init_indexOfArray();
      init_isArray();
      init_last2();
      init_lastN2();
      init_map2();
      init_maxN2();
      init_minN2();
      init_nin();
      init_range();
      init_reduce();
      init_reverseArray();
      init_size();
      init_slice();
      init_sortArray();
      init_zip();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/_internal.js
  var bitwise;
  var init_internal6 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/_internal.js"() {
      init_core();
      init_util();
      bitwise = (op, compute) => (obj, expr, options) => {
        assert(isArray3(expr), `${op}: expression must be an array.`);
        const nums = computeValue(obj, expr, null, options);
        if (nums.some(isNil)) return null;
        assert(
          nums.every(isNumber),
          `${op}: expression must evalue to array of numbers.`
        );
        return compute(nums);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/bitAnd.js
  var $bitAnd;
  var init_bitAnd = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/bitAnd.js"() {
      init_internal6();
      $bitAnd = bitwise(
        "$bitAnd",
        (nums) => nums.reduce((a, b) => a & b, -1)
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/bitNot.js
  var init_bitNot = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/bitNot.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/bitOr.js
  var $bitOr;
  var init_bitOr = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/bitOr.js"() {
      init_internal6();
      $bitOr = bitwise(
        "$bitOr",
        (nums) => nums.reduce((a, b) => a | b, 0)
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/bitXor.js
  var $bitXor;
  var init_bitXor = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/bitXor.js"() {
      init_internal6();
      $bitXor = bitwise(
        "$bitXor",
        (nums) => nums.reduce((a, b) => a ^ b, 0)
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/bitwise/index.js
  var init_bitwise = __esm({
    "node_modules/mingo/dist/esm/operators/expression/bitwise/index.js"() {
      init_bitAnd();
      init_bitNot();
      init_bitOr();
      init_bitXor();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/boolean/and.js
  var $and;
  var init_and = __esm({
    "node_modules/mingo/dist/esm/operators/expression/boolean/and.js"() {
      init_core();
      init_util();
      $and = (obj, expr, options) => {
        const value = computeValue(obj, expr, null, options);
        return truthy(value, options.useStrictMode) && value.every((v) => truthy(v, options.useStrictMode));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/boolean/not.js
  var $not;
  var init_not = __esm({
    "node_modules/mingo/dist/esm/operators/expression/boolean/not.js"() {
      init_core();
      init_util();
      $not = (obj, expr, options) => {
        const booleanExpr = ensureArray(expr);
        if (booleanExpr.length == 0) return false;
        assert(booleanExpr.length == 1, "Expression $not takes exactly 1 argument");
        return !computeValue(obj, booleanExpr[0], null, options);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/boolean/or.js
  var $or;
  var init_or = __esm({
    "node_modules/mingo/dist/esm/operators/expression/boolean/or.js"() {
      init_core();
      init_util();
      $or = (obj, expr, options) => {
        const value = computeValue(obj, expr, null, options);
        const strict = options.useStrictMode;
        return truthy(value, strict) && value.some((v) => truthy(v, strict));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/boolean/index.js
  var boolean_exports = {};
  __export(boolean_exports, {
    $and: () => $and,
    $not: () => $not,
    $or: () => $or
  });
  var init_boolean = __esm({
    "node_modules/mingo/dist/esm/operators/expression/boolean/index.js"() {
      init_and();
      init_not();
      init_or();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/cmp.js
  var $cmp;
  var init_cmp = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/cmp.js"() {
      init_core();
      init_util();
      $cmp = (obj, expr, options) => {
        const args = computeValue(obj, expr, null, options);
        assert(
          isArray3(args) && args.length == 2,
          "$cmp: expression must resolve to array of size 2."
        );
        return compare(args[0], args[1]);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/eq.js
  var $eq2;
  var init_eq = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/eq.js"() {
      init_predicates();
      $eq2 = createExpressionOperator($eq);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/gt.js
  var $gt2;
  var init_gt = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/gt.js"() {
      init_predicates();
      $gt2 = createExpressionOperator($gt);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/gte.js
  var $gte2;
  var init_gte = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/gte.js"() {
      init_predicates();
      $gte2 = createExpressionOperator($gte);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/lt.js
  var $lt2;
  var init_lt = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/lt.js"() {
      init_predicates();
      $lt2 = createExpressionOperator($lt);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/lte.js
  var $lte2;
  var init_lte = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/lte.js"() {
      init_predicates();
      $lte2 = createExpressionOperator($lte);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/ne.js
  var $ne2;
  var init_ne = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/ne.js"() {
      init_predicates();
      $ne2 = createExpressionOperator($ne);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/comparison/index.js
  var comparison_exports = {};
  __export(comparison_exports, {
    $cmp: () => $cmp,
    $eq: () => $eq2,
    $gt: () => $gt2,
    $gte: () => $gte2,
    $lt: () => $lt2,
    $lte: () => $lte2,
    $ne: () => $ne2
  });
  var init_comparison = __esm({
    "node_modules/mingo/dist/esm/operators/expression/comparison/index.js"() {
      init_cmp();
      init_eq();
      init_gt();
      init_gte();
      init_lt();
      init_lte();
      init_ne();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/conditional/cond.js
  var init_cond = __esm({
    "node_modules/mingo/dist/esm/operators/expression/conditional/cond.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/conditional/switch.js
  var init_switch = __esm({
    "node_modules/mingo/dist/esm/operators/expression/conditional/switch.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/conditional/index.js
  var init_conditional = __esm({
    "node_modules/mingo/dist/esm/operators/expression/conditional/index.js"() {
      init_cond();
      init_ifNull();
      init_switch();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/custom/index.js
  var init_custom = __esm({
    "node_modules/mingo/dist/esm/operators/expression/custom/index.js"() {
      init_function();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateDiff.js
  var init_dateDiff = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateDiff.js"() {
      init_core();
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateFromParts.js
  var init_dateFromParts = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateFromParts.js"() {
      init_core();
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateFromString.js
  var buildMap, TZ_LETTER_OFFSETS;
  var init_dateFromString = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateFromString.js"() {
      init_core();
      init_util();
      init_internal();
      buildMap = (letters, sign) => {
        const h = {};
        letters.split("").forEach((v, i) => h[v] = sign * (i + 1));
        return h;
      };
      TZ_LETTER_OFFSETS = {
        ...buildMap("ABCDEFGHIKLM", 1),
        ...buildMap("NOPQRSTUVWXY", -1),
        Z: 0
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateSubtract.js
  var init_dateSubtract = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateSubtract.js"() {
      init_core();
      init_dateAdd();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateToParts.js
  var init_dateToParts = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateToParts.js"() {
      init_core();
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dayOfMonth.js
  var init_dayOfMonth = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dayOfMonth.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/hour.js
  var init_hour = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/hour.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/isoDayOfWeek.js
  var init_isoDayOfWeek = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/isoDayOfWeek.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/isoWeek.js
  var init_isoWeek = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/isoWeek.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/millisecond.js
  var init_millisecond = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/millisecond.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/minute.js
  var init_minute = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/minute.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/month.js
  var init_month = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/month.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/second.js
  var init_second = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/second.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/week.js
  var init_week = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/week.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/year.js
  var init_year = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/year.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateToString.js
  var init_dateToString = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateToString.js"() {
      init_core();
      init_util();
      init_internal();
      init_dayOfMonth();
      init_hour();
      init_isoDayOfWeek();
      init_isoWeek();
      init_millisecond();
      init_minute();
      init_month();
      init_second();
      init_week();
      init_year();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dateTrunc.js
  var init_dateTrunc = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dateTrunc.js"() {
      init_core();
      init_types2();
      init_util();
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dayOfWeek.js
  var init_dayOfWeek = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dayOfWeek.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/dayOfYear.js
  var init_dayOfYear = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/dayOfYear.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/isoWeekYear.js
  var init_isoWeekYear = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/isoWeekYear.js"() {
      init_internal();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/date/index.js
  var init_date = __esm({
    "node_modules/mingo/dist/esm/operators/expression/date/index.js"() {
      init_dateAdd();
      init_dateDiff();
      init_dateFromParts();
      init_dateFromString();
      init_dateSubtract();
      init_dateToParts();
      init_dateToString();
      init_dateTrunc();
      init_dayOfMonth();
      init_dayOfWeek();
      init_dayOfYear();
      init_hour();
      init_isoDayOfWeek();
      init_isoWeek();
      init_isoWeekYear();
      init_millisecond();
      init_minute();
      init_month();
      init_second();
      init_week();
      init_year();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/literal.js
  var init_literal = __esm({
    "node_modules/mingo/dist/esm/operators/expression/literal.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/median.js
  var init_median2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/median.js"() {
      init_core();
      init_median();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/misc/getField.js
  var init_getField = __esm({
    "node_modules/mingo/dist/esm/operators/expression/misc/getField.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/misc/rand.js
  var init_rand = __esm({
    "node_modules/mingo/dist/esm/operators/expression/misc/rand.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/misc/sampleRate.js
  var init_sampleRate = __esm({
    "node_modules/mingo/dist/esm/operators/expression/misc/sampleRate.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/misc/index.js
  var init_misc = __esm({
    "node_modules/mingo/dist/esm/operators/expression/misc/index.js"() {
      init_getField();
      init_rand();
      init_sampleRate();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/object/objectToArray.js
  var init_objectToArray = __esm({
    "node_modules/mingo/dist/esm/operators/expression/object/objectToArray.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/object/setField.js
  var init_setField = __esm({
    "node_modules/mingo/dist/esm/operators/expression/object/setField.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/object/unsetField.js
  var init_unsetField = __esm({
    "node_modules/mingo/dist/esm/operators/expression/object/unsetField.js"() {
      init_setField();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/object/index.js
  var init_object = __esm({
    "node_modules/mingo/dist/esm/operators/expression/object/index.js"() {
      init_mergeObjects();
      init_objectToArray();
      init_setField();
      init_unsetField();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/percentile.js
  var init_percentile2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/percentile.js"() {
      init_core();
      init_percentile();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/allElementsTrue.js
  var init_allElementsTrue = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/allElementsTrue.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/anyElementTrue.js
  var init_anyElementTrue = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/anyElementTrue.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/setDifference.js
  var init_setDifference = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/setDifference.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/setEquals.js
  var init_setEquals = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/setEquals.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/setIntersection.js
  var init_setIntersection = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/setIntersection.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/setIsSubset.js
  var init_setIsSubset = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/setIsSubset.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/setUnion.js
  var init_setUnion = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/setUnion.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/set/index.js
  var init_set = __esm({
    "node_modules/mingo/dist/esm/operators/expression/set/index.js"() {
      init_allElementsTrue();
      init_anyElementTrue();
      init_setDifference();
      init_setEquals();
      init_setIntersection();
      init_setIsSubset();
      init_setUnion();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/concat.js
  var init_concat2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/concat.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/indexOfBytes.js
  var init_indexOfBytes = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/indexOfBytes.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/_internal.js
  var init_internal7 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/_internal.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/ltrim.js
  var init_ltrim = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/ltrim.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/regexFind.js
  var init_regexFind = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/regexFind.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/regexFindAll.js
  var init_regexFindAll = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/regexFindAll.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/regexMatch.js
  var init_regexMatch = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/regexMatch.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/replaceAll.js
  var init_replaceAll = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/replaceAll.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/replaceOne.js
  var init_replaceOne = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/replaceOne.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/rtrim.js
  var init_rtrim = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/rtrim.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/split.js
  var init_split = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/split.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/strcasecmp.js
  var init_strcasecmp = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/strcasecmp.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/strLenBytes.js
  var init_strLenBytes = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/strLenBytes.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/strLenCP.js
  var init_strLenCP = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/strLenCP.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/substr.js
  var init_substr = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/substr.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/substrBytes.js
  var init_substrBytes = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/substrBytes.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/substrCP.js
  var init_substrCP = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/substrCP.js"() {
      init_substr();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/toLower.js
  var init_toLower = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/toLower.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/toUpper.js
  var init_toUpper = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/toUpper.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/trim.js
  var init_trim = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/trim.js"() {
      init_internal7();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/string/index.js
  var init_string = __esm({
    "node_modules/mingo/dist/esm/operators/expression/string/index.js"() {
      init_concat2();
      init_indexOfBytes();
      init_ltrim();
      init_regexFind();
      init_regexFindAll();
      init_regexMatch();
      init_replaceAll();
      init_replaceOne();
      init_rtrim();
      init_split();
      init_strcasecmp();
      init_strLenBytes();
      init_strLenCP();
      init_substr();
      init_substrBytes();
      init_substrCP();
      init_toLower();
      init_toUpper();
      init_trim();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/_internal.js
  function createTrignometryOperator(f, fixedPoints = FIXED_POINTS) {
    const fp = Object.assign({}, FIXED_POINTS, fixedPoints);
    const keySet = new Set(Object.keys(fp));
    return (obj, expr, options) => {
      const n = computeValue(obj, expr, null, options);
      if (keySet.has(`${n}`)) {
        const res = fp[`${n}`];
        if (res instanceof Error) {
          throw new MingoError(
            `cannot apply $${f.name} to -inf, value must in (-inf,inf)`
          );
        }
        return res;
      }
      return f(n);
    };
  }
  var FIXED_POINTS;
  var init_internal8 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/_internal.js"() {
      init_core();
      init_util();
      FIXED_POINTS = {
        undefined: null,
        null: null,
        NaN: NaN,
        Infinity: new Error(),
        "-Infinity": new Error()
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/acos.js
  var $acos;
  var init_acos = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/acos.js"() {
      init_internal8();
      $acos = createTrignometryOperator(Math.acos, {
        Infinity: Infinity,
        0: new Error()
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/acosh.js
  var $acosh;
  var init_acosh = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/acosh.js"() {
      init_internal8();
      $acosh = createTrignometryOperator(Math.acosh, {
        Infinity: Infinity,
        0: new Error()
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/asin.js
  var $asin;
  var init_asin = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/asin.js"() {
      init_internal8();
      $asin = createTrignometryOperator(Math.asin);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/asinh.js
  var $asinh;
  var init_asinh = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/asinh.js"() {
      init_internal8();
      $asinh = createTrignometryOperator(Math.asinh, {
        Infinity: Infinity,
        "-Infinity": -Infinity
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/atan.js
  var $atan;
  var init_atan = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/atan.js"() {
      init_internal8();
      $atan = createTrignometryOperator(Math.atan);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/atan2.js
  var init_atan2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/atan2.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/atanh.js
  var $atanh;
  var init_atanh = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/atanh.js"() {
      init_internal8();
      $atanh = createTrignometryOperator(Math.atanh, {
        1: Infinity,
        "-1": -Infinity
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/cos.js
  var $cos;
  var init_cos = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/cos.js"() {
      init_internal8();
      $cos = createTrignometryOperator(Math.cos);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/cosh.js
  var $cosh;
  var init_cosh = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/cosh.js"() {
      init_internal8();
      $cosh = createTrignometryOperator(Math.cosh, {
        "-Infinity": Infinity,
        Infinity: Infinity
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/degreesToRadians.js
  var RADIANS_FACTOR, $degreesToRadians;
  var init_degreesToRadians = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/degreesToRadians.js"() {
      init_internal8();
      RADIANS_FACTOR = Math.PI / 180;
      $degreesToRadians = createTrignometryOperator(
        (n) => n * RADIANS_FACTOR,
        {
          Infinity: Infinity,
          "-Infinity": Infinity
        }
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/radiansToDegrees.js
  var DEGREES_FACTOR, $radiansToDegrees;
  var init_radiansToDegrees = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/radiansToDegrees.js"() {
      init_internal8();
      DEGREES_FACTOR = 180 / Math.PI;
      $radiansToDegrees = createTrignometryOperator(
        (n) => n * DEGREES_FACTOR,
        {
          Infinity: Infinity,
          "-Infinity": -Infinity
        }
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/sin.js
  var $sin;
  var init_sin = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/sin.js"() {
      init_internal8();
      $sin = createTrignometryOperator(Math.sin);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/sinh.js
  var $sinh;
  var init_sinh = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/sinh.js"() {
      init_internal8();
      $sinh = createTrignometryOperator(Math.sinh, {
        "-Infinity": -Infinity,
        Infinity: Infinity
      });
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/tan.js
  var $tan;
  var init_tan = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/tan.js"() {
      init_internal8();
      $tan = createTrignometryOperator(Math.tan);
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/trignometry/index.js
  var init_trignometry = __esm({
    "node_modules/mingo/dist/esm/operators/expression/trignometry/index.js"() {
      init_acos();
      init_acosh();
      init_asin();
      init_asinh();
      init_atan();
      init_atan2();
      init_atanh();
      init_cos();
      init_cosh();
      init_degreesToRadians();
      init_radiansToDegrees();
      init_sin();
      init_sinh();
      init_tan();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/_internal.js
  var MAX_LONG, MIN_LONG;
  var init_internal9 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/_internal.js"() {
      init_core();
      init_util();
      MAX_LONG = Number.MAX_SAFE_INTEGER;
      MIN_LONG = Number.MIN_SAFE_INTEGER;
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toBool.js
  var init_toBool = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toBool.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toDate.js
  var init_toDate = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toDate.js"() {
      init_core();
      init_util();
      init_internal9();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toDouble.js
  var init_toDouble = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toDouble.js"() {
      init_core();
      init_util();
      init_internal9();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toInt.js
  var init_toInt = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toInt.js"() {
      init_internal9();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toLong.js
  var init_toLong = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toLong.js"() {
      init_internal9();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toString.js
  var init_toString = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toString.js"() {
      init_core();
      init_util();
      init_dateToString();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/convert.js
  var init_convert = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/convert.js"() {
      init_core();
      init_util();
      init_internal9();
      init_toBool();
      init_toDate();
      init_toDouble();
      init_toInt();
      init_toLong();
      init_toString();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/isNumber.js
  var init_isNumber = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/isNumber.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/toDecimal.js
  var init_toDecimal = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/toDecimal.js"() {
      init_toDouble();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/type.js
  var init_type = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/type.js"() {
      init_core();
      init_util();
      init_internal9();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/type/index.js
  var init_type2 = __esm({
    "node_modules/mingo/dist/esm/operators/expression/type/index.js"() {
      init_convert();
      init_isNumber();
      init_toBool();
      init_toDate();
      init_toDecimal();
      init_toDouble();
      init_toInt();
      init_toLong();
      init_toString();
      init_type();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/variable/let.js
  var init_let = __esm({
    "node_modules/mingo/dist/esm/operators/expression/variable/let.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/variable/index.js
  var init_variable = __esm({
    "node_modules/mingo/dist/esm/operators/expression/variable/index.js"() {
      init_let();
    }
  });

  // node_modules/mingo/dist/esm/operators/expression/index.js
  var init_expression = __esm({
    "node_modules/mingo/dist/esm/operators/expression/index.js"() {
      init_arithmetic();
      init_array();
      init_bitwise();
      init_boolean();
      init_comparison();
      init_conditional();
      init_custom();
      init_date();
      init_literal();
      init_median2();
      init_misc();
      init_object();
      init_percentile2();
      init_set();
      init_string();
      init_trignometry();
      init_type2();
      init_variable();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/merge.js
  var init_merge3 = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/merge.js"() {
      init_aggregator();
      init_core();
      init_util();
      init_expression();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/out.js
  var init_out = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/out.js"() {
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/redact.js
  var init_redact = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/redact.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/replaceRoot.js
  var init_replaceRoot = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/replaceRoot.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/replaceWith.js
  var init_replaceWith = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/replaceWith.js"() {
      init_core();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/sample.js
  var init_sample = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/sample.js"() {
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/set.js
  var init_set2 = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/set.js"() {
      init_addFields();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/sortByCount.js
  var init_sortByCount = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/sortByCount.js"() {
      init_group();
      init_sort();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/unionWith.js
  var init_unionWith = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/unionWith.js"() {
      init_aggregator();
      init_lazy();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/unset.js
  var init_unset = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/unset.js"() {
      init_util();
      init_project();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/unwind.js
  var init_unwind = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/unwind.js"() {
      init_lazy();
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/pipeline/index.js
  var init_pipeline = __esm({
    "node_modules/mingo/dist/esm/operators/pipeline/index.js"() {
      init_addFields();
      init_bucket();
      init_bucketAuto();
      init_count();
      init_densify();
      init_facet();
      init_fill();
      init_graphLookup();
      init_group();
      init_limit();
      init_lookup();
      init_match();
      init_merge3();
      init_out();
      init_project();
      init_redact();
      init_replaceRoot();
      init_replaceWith();
      init_sample();
      init_set2();
      init_setWindowFields();
      init_skip();
      init_sort();
      init_sortByCount();
      init_unionWith();
      init_unset();
      init_unwind();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/logical/and.js
  var $and2;
  var init_and2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/logical/and.js"() {
      init_query();
      init_util();
      $and2 = (_, rhs, options) => {
        assert(
          isArray3(rhs),
          "Invalid expression: $and expects value to be an Array."
        );
        const queries = rhs.map((expr) => new Query(expr, options));
        return (obj) => queries.every((q) => q.test(obj));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/logical/or.js
  var $or2;
  var init_or2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/logical/or.js"() {
      init_query();
      init_util();
      $or2 = (_, rhs, options) => {
        assert(isArray3(rhs), "Invalid expression. $or expects value to be an Array");
        const queries = rhs.map((expr) => new Query(expr, options));
        return (obj) => queries.some((q) => q.test(obj));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/logical/nor.js
  var $nor;
  var init_nor = __esm({
    "node_modules/mingo/dist/esm/operators/query/logical/nor.js"() {
      init_util();
      init_or2();
      $nor = (_, rhs, options) => {
        assert(
          isArray3(rhs),
          "Invalid expression. $nor expects value to be an array."
        );
        const f = $or2("$or", rhs, options);
        return (obj) => !f(obj);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/logical/not.js
  var $not2;
  var init_not2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/logical/not.js"() {
      init_query();
      init_util();
      $not2 = (selector, rhs, options) => {
        const criteria = {};
        criteria[selector] = normalize(rhs);
        const query = new Query(criteria, options);
        return (obj) => !query.test(obj);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/logical/index.js
  var init_logical = __esm({
    "node_modules/mingo/dist/esm/operators/query/logical/index.js"() {
      init_and2();
      init_nor();
      init_not2();
      init_or2();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/eq.js
  var $eq3;
  var init_eq2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/eq.js"() {
      init_predicates();
      $eq3 = createQueryOperator($eq);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/gt.js
  var $gt3;
  var init_gt2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/gt.js"() {
      init_predicates();
      $gt3 = createQueryOperator($gt);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/gte.js
  var $gte3;
  var init_gte2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/gte.js"() {
      init_predicates();
      $gte3 = createQueryOperator($gte);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/in.js
  var $in2;
  var init_in2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/in.js"() {
      init_predicates();
      $in2 = createQueryOperator($in);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/lt.js
  var $lt3;
  var init_lt2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/lt.js"() {
      init_predicates();
      $lt3 = createQueryOperator($lt);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/lte.js
  var $lte3;
  var init_lte2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/lte.js"() {
      init_predicates();
      $lte3 = createQueryOperator($lte);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/ne.js
  var $ne3;
  var init_ne2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/ne.js"() {
      init_predicates();
      $ne3 = createQueryOperator($ne);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/nin.js
  var $nin3;
  var init_nin2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/nin.js"() {
      init_predicates();
      $nin3 = createQueryOperator($nin);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/comparison/index.js
  var init_comparison2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/comparison/index.js"() {
      init_eq2();
      init_gt2();
      init_gte2();
      init_in2();
      init_lt2();
      init_lte2();
      init_ne2();
      init_nin2();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/expr.js
  function $expr(_, rhs, options) {
    return (obj) => computeValue(obj, rhs, null, options);
  }
  var init_expr = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/expr.js"() {
      init_core();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/jsonSchema.js
  function $jsonSchema(_, schema, options) {
    if (!options?.jsonSchemaValidator) {
      throw new MingoError(
        "Missing option 'jsonSchemaValidator'. Configure to use '$jsonSchema' operator."
      );
    }
    const validate = options?.jsonSchemaValidator(schema);
    return (obj) => validate(obj);
  }
  var init_jsonSchema = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/jsonSchema.js"() {
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/mod.js
  var $mod2;
  var init_mod2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/mod.js"() {
      init_predicates();
      $mod2 = createQueryOperator($mod);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/regex.js
  var $regex2;
  var init_regex = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/regex.js"() {
      init_predicates();
      $regex2 = createQueryOperator($regex);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/where.js
  function $where(_, rhs, options) {
    assert(
      options.scriptEnabled,
      "$where operator requires 'scriptEnabled' option to be true"
    );
    const f = rhs;
    assert(isFunction2(f), "$where only accepts a Function object");
    return (obj) => truthy(f.call(obj), options?.useStrictMode);
  }
  var init_where = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/where.js"() {
      init_util();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/evaluation/index.js
  var init_evaluation = __esm({
    "node_modules/mingo/dist/esm/operators/query/evaluation/index.js"() {
      init_expr();
      init_jsonSchema();
      init_mod2();
      init_regex();
      init_where();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/array/all.js
  var $all2;
  var init_all = __esm({
    "node_modules/mingo/dist/esm/operators/query/array/all.js"() {
      init_predicates();
      $all2 = createQueryOperator($all);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/array/elemMatch.js
  var $elemMatch2;
  var init_elemMatch = __esm({
    "node_modules/mingo/dist/esm/operators/query/array/elemMatch.js"() {
      init_predicates();
      $elemMatch2 = createQueryOperator($elemMatch);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/array/size.js
  var $size2;
  var init_size2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/array/size.js"() {
      init_predicates();
      $size2 = createQueryOperator($size);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/array/index.js
  var init_array2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/array/index.js"() {
      init_all();
      init_elemMatch();
      init_size2();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/element/exists.js
  var $exists;
  var init_exists = __esm({
    "node_modules/mingo/dist/esm/operators/query/element/exists.js"() {
      init_util();
      $exists = (selector, value, _options4) => {
        const nested = selector.includes(".");
        const b = !!value;
        if (!nested || selector.match(/\.\d+$/)) {
          return (o) => resolve(o, selector) !== void 0 === b;
        }
        return (o) => {
          const path = resolveGraph(o, selector, { preserveIndex: true });
          const val = resolve(path, selector.substring(0, selector.lastIndexOf(".")));
          return isArray3(val) ? val.some((v) => v !== void 0) === b : val !== void 0 === b;
        };
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/element/type.js
  var $type2;
  var init_type3 = __esm({
    "node_modules/mingo/dist/esm/operators/query/element/type.js"() {
      init_predicates();
      $type2 = createQueryOperator($type);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/element/index.js
  var init_element = __esm({
    "node_modules/mingo/dist/esm/operators/query/element/index.js"() {
      init_exists();
      init_type3();
    }
  });

  // node_modules/rxdb/dist/esm/rx-query-mingo.js
  function getMingoQuery(selector) {
    if (!mingoInitDone) {
      useOperators("pipeline", {
        $sort,
        $project
      });
      useOperators("query", {
        $and: $and2,
        $eq: $eq3,
        $elemMatch: $elemMatch2,
        $exists,
        $gt: $gt3,
        $gte: $gte3,
        $in: $in2,
        $lt: $lt3,
        $lte: $lte3,
        $ne: $ne3,
        $nin: $nin3,
        $mod: $mod2,
        $nor,
        $not: $not2,
        $or: $or2,
        $regex: $regex2,
        $size: $size2,
        $type: $type2
      });
      mingoInitDone = true;
    }
    return new Query(selector);
  }
  var mingoInitDone;
  var init_rx_query_mingo = __esm({
    "node_modules/rxdb/dist/esm/rx-query-mingo.js"() {
      init_core();
      init_query();
      init_pipeline();
      init_logical();
      init_comparison2();
      init_evaluation();
      init_array2();
      init_element();
      mingoInitDone = false;
    }
  });

  // node_modules/rxdb/dist/esm/rx-query-helper.js
  function normalizeMangoQuery(schema, mangoQuery) {
    var primaryKey = getPrimaryFieldOfPrimaryKey(schema.primaryKey);
    mangoQuery = flatClone(mangoQuery);
    var normalizedMangoQuery = clone(mangoQuery);
    if (typeof normalizedMangoQuery.skip !== "number") {
      normalizedMangoQuery.skip = 0;
    }
    if (!normalizedMangoQuery.selector) {
      normalizedMangoQuery.selector = {};
    } else {
      normalizedMangoQuery.selector = normalizedMangoQuery.selector;
      Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
        if (typeof matcher !== "object" || matcher === null) {
          normalizedMangoQuery.selector[field] = {
            $eq: matcher
          };
        }
      });
    }
    if (normalizedMangoQuery.index) {
      var indexAr = toArray(normalizedMangoQuery.index);
      if (!indexAr.includes(primaryKey)) {
        indexAr.push(primaryKey);
      }
      normalizedMangoQuery.index = indexAr;
    }
    if (!normalizedMangoQuery.sort) {
      if (normalizedMangoQuery.index) {
        normalizedMangoQuery.sort = normalizedMangoQuery.index.map((field) => {
          return {
            [field]: "asc"
          };
        });
      } else {
        if (schema.indexes) {
          var fieldsWithLogicalOperator = /* @__PURE__ */ new Set();
          Object.entries(normalizedMangoQuery.selector).forEach(([field, matcher]) => {
            var hasLogical = false;
            if (typeof matcher === "object" && matcher !== null) {
              hasLogical = !!Object.keys(matcher).find((operator) => LOGICAL_OPERATORS.has(operator));
            } else {
              hasLogical = true;
            }
            if (hasLogical) {
              fieldsWithLogicalOperator.add(field);
            }
          });
          var currentFieldsAmount = -1;
          var currentBestIndexForSort;
          schema.indexes.forEach((index) => {
            var useIndex2 = isMaybeReadonlyArray(index) ? index : [index];
            var firstWrongIndex = useIndex2.findIndex((indexField) => !fieldsWithLogicalOperator.has(indexField));
            if (firstWrongIndex > 0 && firstWrongIndex > currentFieldsAmount) {
              currentFieldsAmount = firstWrongIndex;
              currentBestIndexForSort = useIndex2;
            }
          });
          if (currentBestIndexForSort) {
            normalizedMangoQuery.sort = currentBestIndexForSort.map((field) => {
              return {
                [field]: "asc"
              };
            });
          }
        }
        if (!normalizedMangoQuery.sort) {
          if (schema.indexes && schema.indexes.length > 0) {
            var firstIndex = schema.indexes[0];
            var useIndex = isMaybeReadonlyArray(firstIndex) ? firstIndex : [firstIndex];
            normalizedMangoQuery.sort = useIndex.map((field) => ({
              [field]: "asc"
            }));
          } else {
            normalizedMangoQuery.sort = [{
              [primaryKey]: "asc"
            }];
          }
        }
      }
    } else {
      var isPrimaryInSort = normalizedMangoQuery.sort.find((p) => firstPropertyNameOfObject(p) === primaryKey);
      if (!isPrimaryInSort) {
        normalizedMangoQuery.sort = normalizedMangoQuery.sort.slice(0);
        normalizedMangoQuery.sort.push({
          [primaryKey]: "asc"
        });
      }
    }
    return normalizedMangoQuery;
  }
  function getSortComparator(schema, query) {
    if (!query.sort) {
      throw newRxError("SNH", {
        query
      });
    }
    var sortParts = [];
    query.sort.forEach((sortBlock) => {
      var key = Object.keys(sortBlock)[0];
      var direction = Object.values(sortBlock)[0];
      sortParts.push({
        key,
        direction,
        getValueFn: objectPathMonad(key)
      });
    });
    var fun = (a, b) => {
      for (var i = 0; i < sortParts.length; ++i) {
        var sortPart = sortParts[i];
        var valueA = sortPart.getValueFn(a);
        var valueB = sortPart.getValueFn(b);
        if (valueA !== valueB) {
          var ret = sortPart.direction === "asc" ? compare(valueA, valueB) : compare(valueB, valueA);
          return ret;
        }
      }
    };
    return fun;
  }
  function getQueryMatcher(_schema, query) {
    if (!query.sort) {
      throw newRxError("SNH", {
        query
      });
    }
    var mingoQuery = getMingoQuery(query.selector);
    var fun = (doc) => {
      return mingoQuery.test(doc);
    };
    return fun;
  }
  async function runQueryUpdateFunction(rxQuery, fn) {
    var docs = await rxQuery.exec();
    if (!docs) {
      return null;
    }
    if (Array.isArray(docs)) {
      return Promise.all(docs.map((doc) => fn(doc)));
    } else if (docs instanceof Map) {
      return Promise.all([...docs.values()].map((doc) => fn(doc)));
    } else {
      var result = await fn(docs);
      return result;
    }
  }
  function prepareQuery(schema, mutateableQuery) {
    if (!mutateableQuery.sort) {
      throw newRxError("SNH", {
        query: mutateableQuery
      });
    }
    var queryPlan = getQueryPlan(schema, mutateableQuery);
    return {
      query: mutateableQuery,
      queryPlan
    };
  }
  var init_rx_query_helper = __esm({
    "node_modules/rxdb/dist/esm/rx-query-helper.js"() {
      init_query_planner();
      init_rx_schema_helper();
      init_utils();
      init_util();
      init_rx_error();
      init_rx_query_mingo();
    }
  });

  // node_modules/rxdb/dist/esm/rx-storage-helper.js
  async function getSingleDocument(storageInstance, documentId) {
    var results = await storageInstance.findDocumentsById([documentId], false);
    var doc = results[0];
    if (doc) {
      return doc;
    } else {
      return void 0;
    }
  }
  async function writeSingle(instance, writeRow, context2) {
    var writeResult = await instance.bulkWrite([writeRow], context2);
    if (writeResult.error.length > 0) {
      var error = writeResult.error[0];
      throw error;
    } else {
      var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
      var success = getWrittenDocumentsFromBulkWriteResponse(primaryPath, [writeRow], writeResult);
      var ret = success[0];
      return ret;
    }
  }
  function observeSingle(storageInstance, documentId) {
    var firstFindPromise = getSingleDocument(storageInstance, documentId);
    var ret = storageInstance.changeStream().pipe(map((evBulk) => evBulk.events.find((ev) => ev.documentId === documentId)), filter((ev) => !!ev), map((ev) => Promise.resolve(ensureNotFalsy(ev).documentData)), startWith(firstFindPromise), switchMap((v) => v), filter((v) => !!v));
    return ret;
  }
  function stackCheckpoints(checkpoints) {
    return Object.assign({}, ...checkpoints.filter((x) => !!x));
  }
  function throwIfIsStorageWriteError(collection, documentId, writeData, error) {
    if (error) {
      if (error.status === 409) {
        throw newRxError("CONFLICT", {
          collection: collection.name,
          id: documentId,
          writeError: error,
          data: writeData
        });
      } else if (error.status === 422) {
        throw newRxError("VD2", {
          collection: collection.name,
          id: documentId,
          writeError: error,
          data: writeData
        });
      } else {
        throw error;
      }
    }
  }
  function categorizeBulkWriteRows(storageInstance, primaryPath, docsInDb, bulkWriteRows, context2, onInsert, onUpdate) {
    var hasAttachments = !!storageInstance.schema.attachments;
    var bulkInsertDocs = [];
    var bulkUpdateDocs = [];
    var errors = [];
    var eventBulkId = randomToken(10);
    var eventBulk = {
      id: eventBulkId,
      events: [],
      checkpoint: null,
      context: context2
    };
    var eventBulkEvents = eventBulk.events;
    var attachmentsAdd = [];
    var attachmentsRemove = [];
    var attachmentsUpdate = [];
    var hasDocsInDb = docsInDb.size > 0;
    var newestRow;
    var rowAmount = bulkWriteRows.length;
    var _loop = function() {
      var writeRow = bulkWriteRows[rowId];
      var document2 = writeRow.document;
      var previous = writeRow.previous;
      var docId = document2[primaryPath];
      var documentDeleted = document2._deleted;
      var previousDeleted = previous && previous._deleted;
      var documentInDb = void 0;
      if (hasDocsInDb) {
        documentInDb = docsInDb.get(docId);
      }
      var attachmentError;
      if (!documentInDb) {
        var insertedIsDeleted = documentDeleted ? true : false;
        if (hasAttachments) {
          Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
            if (!attachmentData.data) {
              attachmentError = {
                documentId: docId,
                isError: true,
                status: 510,
                writeRow,
                attachmentId
              };
              errors.push(attachmentError);
            } else {
              attachmentsAdd.push({
                documentId: docId,
                attachmentId,
                attachmentData,
                digest: attachmentData.digest
              });
            }
          });
        }
        if (!attachmentError) {
          if (hasAttachments) {
            bulkInsertDocs.push(stripAttachmentsDataFromRow(writeRow));
            if (onInsert) {
              onInsert(document2);
            }
          } else {
            bulkInsertDocs.push(writeRow);
            if (onInsert) {
              onInsert(document2);
            }
          }
          newestRow = writeRow;
        }
        if (!insertedIsDeleted) {
          var event = {
            documentId: docId,
            operation: "INSERT",
            documentData: hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2,
            previousDocumentData: hasAttachments && previous ? stripAttachmentsDataFromDocument(previous) : previous
          };
          eventBulkEvents.push(event);
        }
      } else {
        var revInDb = documentInDb._rev;
        if (!previous || !!previous && revInDb !== previous._rev) {
          var err = {
            isError: true,
            status: 409,
            documentId: docId,
            writeRow,
            documentInDb
          };
          errors.push(err);
          return 1;
        }
        var updatedRow = hasAttachments ? stripAttachmentsDataFromRow(writeRow) : writeRow;
        if (hasAttachments) {
          if (documentDeleted) {
            if (previous) {
              Object.keys(previous._attachments).forEach((attachmentId) => {
                attachmentsRemove.push({
                  documentId: docId,
                  attachmentId,
                  digest: ensureNotFalsy(previous)._attachments[attachmentId].digest
                });
              });
            }
          } else {
            Object.entries(document2._attachments).find(([attachmentId, attachmentData]) => {
              var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
              if (!previousAttachmentData && !attachmentData.data) {
                attachmentError = {
                  documentId: docId,
                  documentInDb,
                  isError: true,
                  status: 510,
                  writeRow,
                  attachmentId
                };
              }
              return true;
            });
            if (!attachmentError) {
              Object.entries(document2._attachments).forEach(([attachmentId, attachmentData]) => {
                var previousAttachmentData = previous ? previous._attachments[attachmentId] : void 0;
                if (!previousAttachmentData) {
                  attachmentsAdd.push({
                    documentId: docId,
                    attachmentId,
                    attachmentData,
                    digest: attachmentData.digest
                  });
                } else {
                  var newDigest = updatedRow.document._attachments[attachmentId].digest;
                  if (attachmentData.data && /**
                   * Performance shortcut,
                   * do not update the attachment data if it did not change.
                   */
                  previousAttachmentData.digest !== newDigest) {
                    attachmentsUpdate.push({
                      documentId: docId,
                      attachmentId,
                      attachmentData,
                      digest: attachmentData.digest
                    });
                  }
                }
              });
            }
          }
        }
        if (attachmentError) {
          errors.push(attachmentError);
        } else {
          if (hasAttachments) {
            bulkUpdateDocs.push(stripAttachmentsDataFromRow(updatedRow));
            if (onUpdate) {
              onUpdate(document2);
            }
          } else {
            bulkUpdateDocs.push(updatedRow);
            if (onUpdate) {
              onUpdate(document2);
            }
          }
          newestRow = updatedRow;
        }
        var eventDocumentData = null;
        var previousEventDocumentData = null;
        var operation = null;
        if (previousDeleted && !documentDeleted) {
          operation = "INSERT";
          eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
        } else if (previous && !previousDeleted && !documentDeleted) {
          operation = "UPDATE";
          eventDocumentData = hasAttachments ? stripAttachmentsDataFromDocument(document2) : document2;
          previousEventDocumentData = previous;
        } else if (documentDeleted) {
          operation = "DELETE";
          eventDocumentData = ensureNotFalsy(document2);
          previousEventDocumentData = previous;
        } else {
          throw newRxError("SNH", {
            args: {
              writeRow
            }
          });
        }
        var _event = {
          documentId: docId,
          documentData: eventDocumentData,
          previousDocumentData: previousEventDocumentData,
          operation
        };
        eventBulkEvents.push(_event);
      }
    };
    for (var rowId = 0; rowId < rowAmount; rowId++) {
      if (_loop()) continue;
    }
    return {
      bulkInsertDocs,
      bulkUpdateDocs,
      newestRow,
      errors,
      eventBulk,
      attachmentsAdd,
      attachmentsRemove,
      attachmentsUpdate
    };
  }
  function stripAttachmentsDataFromRow(writeRow) {
    return {
      previous: writeRow.previous,
      document: stripAttachmentsDataFromDocument(writeRow.document)
    };
  }
  function getAttachmentSize(attachmentBase64String) {
    return atob(attachmentBase64String).length;
  }
  function attachmentWriteDataToNormalData(writeData) {
    var data = writeData.data;
    if (!data) {
      return writeData;
    }
    var ret = {
      length: getAttachmentSize(data),
      digest: writeData.digest,
      type: writeData.type
    };
    return ret;
  }
  function stripAttachmentsDataFromDocument(doc) {
    if (!doc._attachments || Object.keys(doc._attachments).length === 0) {
      return doc;
    }
    var useDoc = flatClone(doc);
    useDoc._attachments = {};
    Object.entries(doc._attachments).forEach(([attachmentId, attachmentData]) => {
      useDoc._attachments[attachmentId] = attachmentWriteDataToNormalData(attachmentData);
    });
    return useDoc;
  }
  function flatCloneDocWithMeta(doc) {
    return Object.assign({}, doc, {
      _meta: flatClone(doc._meta)
    });
  }
  function getWrappedStorageInstance(database, storageInstance, rxJsonSchema) {
    overwritable.deepFreezeWhenDevMode(rxJsonSchema);
    var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
    var ret = {
      originalStorageInstance: storageInstance,
      schema: storageInstance.schema,
      internals: storageInstance.internals,
      collectionName: storageInstance.collectionName,
      databaseName: storageInstance.databaseName,
      options: storageInstance.options,
      async bulkWrite(rows, context2) {
        var databaseToken = database.token;
        var toStorageWriteRows = new Array(rows.length);
        var time = now();
        for (var index = 0; index < rows.length; index++) {
          var writeRow = rows[index];
          var document2 = flatCloneDocWithMeta(writeRow.document);
          document2._meta.lwt = time;
          var previous = writeRow.previous;
          document2._rev = createRevision(databaseToken, previous);
          toStorageWriteRows[index] = {
            document: document2,
            previous
          };
        }
        runPluginHooks("preStorageWrite", {
          storageInstance: this.originalStorageInstance,
          rows: toStorageWriteRows
        });
        var writeResult = await database.lockedRun(() => storageInstance.bulkWrite(toStorageWriteRows, context2));
        var useWriteResult = {
          error: []
        };
        BULK_WRITE_ROWS_BY_RESPONSE.set(useWriteResult, toStorageWriteRows);
        var reInsertErrors = writeResult.error.length === 0 ? [] : writeResult.error.filter((error) => {
          if (error.status === 409 && !error.writeRow.previous && !error.writeRow.document._deleted && ensureNotFalsy(error.documentInDb)._deleted) {
            return true;
          }
          useWriteResult.error.push(error);
          return false;
        });
        if (reInsertErrors.length > 0) {
          var reInsertIds = /* @__PURE__ */ new Set();
          var reInserts = reInsertErrors.map((error) => {
            reInsertIds.add(error.documentId);
            return {
              previous: error.documentInDb,
              document: Object.assign({}, error.writeRow.document, {
                _rev: createRevision(database.token, error.documentInDb)
              })
            };
          });
          var subResult = await database.lockedRun(() => storageInstance.bulkWrite(reInserts, context2));
          appendToArray(useWriteResult.error, subResult.error);
          var successArray = getWrittenDocumentsFromBulkWriteResponse(primaryPath, toStorageWriteRows, useWriteResult, reInsertIds);
          var subSuccess = getWrittenDocumentsFromBulkWriteResponse(primaryPath, reInserts, subResult);
          appendToArray(successArray, subSuccess);
          return useWriteResult;
        }
        return useWriteResult;
      },
      query(preparedQuery) {
        return database.lockedRun(() => storageInstance.query(preparedQuery));
      },
      count(preparedQuery) {
        return database.lockedRun(() => storageInstance.count(preparedQuery));
      },
      findDocumentsById(ids, deleted) {
        return database.lockedRun(() => storageInstance.findDocumentsById(ids, deleted));
      },
      getAttachmentData(documentId, attachmentId, digest) {
        return database.lockedRun(() => storageInstance.getAttachmentData(documentId, attachmentId, digest));
      },
      getChangedDocumentsSince: !storageInstance.getChangedDocumentsSince ? void 0 : (limit, checkpoint) => {
        return database.lockedRun(() => storageInstance.getChangedDocumentsSince(ensureNotFalsy(limit), checkpoint));
      },
      cleanup(minDeletedTime) {
        return database.lockedRun(() => storageInstance.cleanup(minDeletedTime));
      },
      remove() {
        database.storageInstances.delete(ret);
        return database.lockedRun(() => storageInstance.remove());
      },
      close() {
        database.storageInstances.delete(ret);
        return database.lockedRun(() => storageInstance.close());
      },
      changeStream() {
        return storageInstance.changeStream();
      }
    };
    database.storageInstances.add(ret);
    return ret;
  }
  function ensureRxStorageInstanceParamsAreCorrect(params) {
    if (params.schema.keyCompression) {
      throw newRxError("UT5", {
        args: {
          params
        }
      });
    }
    if (hasEncryption(params.schema)) {
      throw newRxError("UT6", {
        args: {
          params
        }
      });
    }
    if (params.schema.attachments && params.schema.attachments.compression) {
      throw newRxError("UT7", {
        args: {
          params
        }
      });
    }
  }
  function hasEncryption(jsonSchema) {
    if (!!jsonSchema.encrypted && jsonSchema.encrypted.length > 0 || jsonSchema.attachments && jsonSchema.attachments.encrypted) {
      return true;
    } else {
      return false;
    }
  }
  function getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint) {
    var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
    var sinceLwt = checkpoint ? checkpoint.lwt : RX_META_LWT_MINIMUM;
    var sinceId = checkpoint ? checkpoint.id : "";
    return normalizeMangoQuery(storageInstance.schema, {
      selector: {
        $or: [{
          "_meta.lwt": {
            $gt: sinceLwt
          }
        }, {
          "_meta.lwt": {
            $eq: sinceLwt
          },
          [primaryPath]: {
            $gt: checkpoint ? sinceId : ""
          }
        }],
        // add this hint for better index usage
        "_meta.lwt": {
          $gte: sinceLwt
        }
      },
      sort: [{
        "_meta.lwt": "asc"
      }, {
        [primaryPath]: "asc"
      }],
      skip: 0,
      limit
      /**
       * DO NOT SET A SPECIFIC INDEX HERE!
       * The query might be modified by some plugin
       * before sending it to the storage.
       * We can be sure that in the end the query planner
       * will find the best index.
       */
      // index: ['_meta.lwt', primaryPath]
    });
  }
  async function getChangedDocumentsSince(storageInstance, limit, checkpoint) {
    if (storageInstance.getChangedDocumentsSince) {
      return storageInstance.getChangedDocumentsSince(limit, checkpoint);
    }
    var primaryPath = getPrimaryFieldOfPrimaryKey(storageInstance.schema.primaryKey);
    var query = prepareQuery(storageInstance.schema, getChangedDocumentsSinceQuery(storageInstance, limit, checkpoint));
    var result = await storageInstance.query(query);
    var documents = result.documents;
    var lastDoc = lastOfArray(documents);
    return {
      documents,
      checkpoint: lastDoc ? {
        id: lastDoc[primaryPath],
        lwt: lastDoc._meta.lwt
      } : checkpoint ? checkpoint : {
        id: "",
        lwt: 0
      }
    };
  }
  function getWrittenDocumentsFromBulkWriteResponse(primaryPath, writeRows, response, reInsertIds) {
    return getFromMapOrCreate(BULK_WRITE_SUCCESS_MAP, response, () => {
      var ret = [];
      var realWriteRows = BULK_WRITE_ROWS_BY_RESPONSE.get(response);
      if (!realWriteRows) {
        realWriteRows = writeRows;
      }
      if (response.error.length > 0 || reInsertIds) {
        var errorIds = reInsertIds ? reInsertIds : /* @__PURE__ */ new Set();
        for (var index = 0; index < response.error.length; index++) {
          var error = response.error[index];
          errorIds.add(error.documentId);
        }
        for (var _index = 0; _index < realWriteRows.length; _index++) {
          var doc = realWriteRows[_index].document;
          if (!errorIds.has(doc[primaryPath])) {
            ret.push(stripAttachmentsDataFromDocument(doc));
          }
        }
      } else {
        ret.length = writeRows.length - response.error.length;
        for (var _index2 = 0; _index2 < realWriteRows.length; _index2++) {
          var _doc = realWriteRows[_index2].document;
          ret[_index2] = stripAttachmentsDataFromDocument(_doc);
        }
      }
      return ret;
    });
  }
  var INTERNAL_STORAGE_NAME, BULK_WRITE_ROWS_BY_RESPONSE, BULK_WRITE_SUCCESS_MAP;
  var init_rx_storage_helper = __esm({
    "node_modules/rxdb/dist/esm/rx-storage-helper.js"() {
      init_overwritable();
      init_rx_error();
      init_rx_schema_helper();
      init_utils();
      init_esm5();
      init_rx_query_helper();
      init_hooks();
      INTERNAL_STORAGE_NAME = "_rxdb_internal";
      BULK_WRITE_ROWS_BY_RESPONSE = /* @__PURE__ */ new WeakMap();
      BULK_WRITE_SUCCESS_MAP = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/rxdb/dist/esm/incremental-write.js
  function modifierFromPublicToInternal(publicModifier) {
    var ret = async (docData) => {
      var withoutMeta = stripMetaDataFromDocument(docData);
      withoutMeta._deleted = docData._deleted;
      var modified = await publicModifier(withoutMeta);
      var reattachedMeta = Object.assign({}, modified, {
        _meta: docData._meta,
        _attachments: docData._attachments,
        _rev: docData._rev,
        _deleted: typeof modified._deleted !== "undefined" ? modified._deleted : docData._deleted
      });
      if (typeof reattachedMeta._deleted === "undefined") {
        reattachedMeta._deleted = false;
      }
      return reattachedMeta;
    };
    return ret;
  }
  function findNewestOfDocumentStates(docs) {
    var newest = docs[0];
    var newestRevisionHeight = getHeightOfRevision(newest._rev);
    docs.forEach((doc) => {
      var height = getHeightOfRevision(doc._rev);
      if (height > newestRevisionHeight) {
        newest = doc;
        newestRevisionHeight = height;
      }
    });
    return newest;
  }
  var IncrementalWriteQueue;
  var init_incremental_write = __esm({
    "node_modules/rxdb/dist/esm/incremental-write.js"() {
      init_rx_error();
      init_utils();
      init_rx_storage_helper();
      IncrementalWriteQueue = /* @__PURE__ */ (function() {
        function IncrementalWriteQueue2(storageInstance, primaryPath, preWrite, postWrite) {
          this.queueByDocId = /* @__PURE__ */ new Map();
          this.isRunning = false;
          this.storageInstance = storageInstance;
          this.primaryPath = primaryPath;
          this.preWrite = preWrite;
          this.postWrite = postWrite;
        }
        var _proto = IncrementalWriteQueue2.prototype;
        _proto.addWrite = function addWrite(lastKnownDocumentState, modifier) {
          var docId = lastKnownDocumentState[this.primaryPath];
          var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
          var ret = new Promise((resolve2, reject) => {
            var item = {
              lastKnownDocumentState,
              modifier,
              resolve: resolve2,
              reject
            };
            ensureNotFalsy(ar).push(item);
            this.triggerRun();
          });
          return ret;
        };
        _proto.triggerRun = async function triggerRun() {
          if (this.isRunning === true || this.queueByDocId.size === 0) {
            return;
          }
          this.isRunning = true;
          var writeRows = [];
          var itemsById = this.queueByDocId;
          this.queueByDocId = /* @__PURE__ */ new Map();
          await Promise.all(Array.from(itemsById.entries()).map(async ([_docId, items]) => {
            var oldData = findNewestOfDocumentStates(items.map((i) => i.lastKnownDocumentState));
            var newData = oldData;
            for (var item of items) {
              try {
                newData = await item.modifier(
                  /**
                   * We have to clone() each time because the modifier
                   * might throw while it already changed some properties
                   * of the document.
                   */
                  clone(newData)
                );
              } catch (err) {
                item.reject(err);
                item.reject = () => {
                };
                item.resolve = () => {
                };
              }
            }
            try {
              await this.preWrite(newData, oldData);
            } catch (err) {
              items.forEach((item2) => item2.reject(err));
              return;
            }
            writeRows.push({
              previous: oldData,
              document: newData
            });
          }));
          var writeResult = writeRows.length > 0 ? await this.storageInstance.bulkWrite(writeRows, "incremental-write") : {
            error: []
          };
          await Promise.all(getWrittenDocumentsFromBulkWriteResponse(this.primaryPath, writeRows, writeResult).map((result) => {
            var docId = result[this.primaryPath];
            this.postWrite(result);
            var items = getFromMapOrThrow(itemsById, docId);
            items.forEach((item) => item.resolve(result));
          }));
          writeResult.error.forEach((error) => {
            var docId = error.documentId;
            var items = getFromMapOrThrow(itemsById, docId);
            var isConflict = isBulkWriteConflictError(error);
            if (isConflict) {
              var ar = getFromMapOrCreate(this.queueByDocId, docId, () => []);
              items.reverse().forEach((item) => {
                item.lastKnownDocumentState = ensureNotFalsy(isConflict.documentInDb);
                ensureNotFalsy(ar).unshift(item);
              });
            } else {
              var rxError = rxStorageWriteErrorToRxError(error);
              items.forEach((item) => item.reject(rxError));
            }
          });
          this.isRunning = false;
          return this.triggerRun();
        };
        return IncrementalWriteQueue2;
      })();
    }
  });

  // node_modules/rxdb/dist/esm/rx-document.js
  function createRxDocumentConstructor(proto = basePrototype) {
    var constructor = function RxDocumentConstructor(collection, docData) {
      this.collection = collection;
      this._data = docData;
      this._propertyCache = /* @__PURE__ */ new Map();
      this.isInstanceOfRxDocument = true;
    };
    constructor.prototype = proto;
    return constructor;
  }
  function createWithConstructor(constructor, collection, jsonData) {
    var doc = new constructor(collection, jsonData);
    runPluginHooks("createRxDocument", doc);
    return doc;
  }
  function beforeDocumentUpdateWrite(collection, newData, oldData) {
    newData._meta = Object.assign({}, oldData._meta, newData._meta);
    if (overwritable.isDevMode()) {
      collection.schema.validateChange(oldData, newData);
    }
    return collection._runHooks("pre", "save", newData, oldData);
  }
  function getDocumentProperty(doc, objPath) {
    return getFromMapOrCreate(doc._propertyCache, objPath, () => {
      var valueObj = getProperty(doc._data, objPath);
      if (typeof valueObj !== "object" || valueObj === null || Array.isArray(valueObj)) {
        return overwritable.deepFreezeWhenDevMode(valueObj);
      }
      var proxy = new Proxy(
        /**
         * In dev-mode, the _data is deep-frozen
         * so we have to flat clone here so that
         * the proxy can work.
         */
        flatClone(valueObj),
        {
          /**
           * @performance is really important here
           * because people access nested properties very often
           * and might not be aware that this is internally using a Proxy
           */
          get(target, property) {
            if (typeof property !== "string") {
              return target[property];
            }
            var lastChar = property.charAt(property.length - 1);
            if (lastChar === "$") {
              if (property.endsWith("$$")) {
                var key = property.slice(0, -2);
                return doc.get$$(trimDots(objPath + "." + key));
              } else {
                var _key = property.slice(0, -1);
                return doc.get$(trimDots(objPath + "." + _key));
              }
            } else if (lastChar === "_") {
              var _key2 = property.slice(0, -1);
              return doc.populate(trimDots(objPath + "." + _key2));
            } else {
              var plainValue = target[property];
              if (typeof plainValue === "number" || typeof plainValue === "string" || typeof plainValue === "boolean") {
                return plainValue;
              }
              return getDocumentProperty(doc, trimDots(objPath + "." + property));
            }
          }
        }
      );
      return proxy;
    });
  }
  var basePrototype;
  var init_rx_document = __esm({
    "node_modules/rxdb/dist/esm/rx-document.js"() {
      init_operators();
      init_utils();
      init_rx_error();
      init_hooks();
      init_rx_change_event();
      init_overwritable();
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_incremental_write();
      basePrototype = {
        get primaryPath() {
          var _this = this;
          if (!_this.isInstanceOfRxDocument) {
            return void 0;
          }
          return _this.collection.schema.primaryPath;
        },
        get primary() {
          var _this = this;
          if (!_this.isInstanceOfRxDocument) {
            return void 0;
          }
          return _this._data[_this.primaryPath];
        },
        get revision() {
          var _this = this;
          if (!_this.isInstanceOfRxDocument) {
            return void 0;
          }
          return _this._data._rev;
        },
        get deleted$() {
          var _this = this;
          if (!_this.isInstanceOfRxDocument) {
            return void 0;
          }
          return _this.$.pipe(map((d) => d._data._deleted));
        },
        get deleted$$() {
          var _this = this;
          var reactivity = _this.collection.database.getReactivityFactory();
          return reactivity.fromObservable(_this.deleted$, _this.getLatest().deleted, _this.collection.database);
        },
        get deleted() {
          var _this = this;
          if (!_this.isInstanceOfRxDocument) {
            return void 0;
          }
          return _this._data._deleted;
        },
        getLatest() {
          var latestDocData = this.collection._docCache.getLatestDocumentData(this.primary);
          return this.collection._docCache.getCachedRxDocument(latestDocData);
        },
        /**
         * returns the observable which emits the plain-data of this document
         */
        get $() {
          var _this = this;
          var id = this.primary;
          return _this.collection.eventBulks$.pipe(filter((bulk) => !bulk.isLocal), map((bulk) => bulk.events.find((ev) => ev.documentId === id)), filter((event) => !!event), map((changeEvent) => getDocumentDataOfRxChangeEvent(ensureNotFalsy(changeEvent))), startWith(_this.collection._docCache.getLatestDocumentData(id)), distinctUntilChanged((prev, curr) => prev._rev === curr._rev), map((docData) => this.collection._docCache.getCachedRxDocument(docData)), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
        },
        get $$() {
          var _this = this;
          var reactivity = _this.collection.database.getReactivityFactory();
          return reactivity.fromObservable(_this.$, _this.getLatest()._data, _this.collection.database);
        },
        /**
         * returns observable of the value of the given path
         */
        get$(path) {
          if (overwritable.isDevMode()) {
            if (path.includes(".item.")) {
              throw newRxError("DOC1", {
                path
              });
            }
            if (path === this.primaryPath) {
              throw newRxError("DOC2");
            }
            if (this.collection.schema.finalFields.includes(path)) {
              throw newRxError("DOC3", {
                path
              });
            }
            var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
            if (!schemaObj) {
              throw newRxError("DOC4", {
                path
              });
            }
          }
          return this.$.pipe(map((data) => getProperty(data, path)), distinctUntilChanged());
        },
        get$$(path) {
          var obs = this.get$(path);
          var reactivity = this.collection.database.getReactivityFactory();
          return reactivity.fromObservable(obs, this.getLatest().get(path), this.collection.database);
        },
        /**
         * populate the given path
         */
        populate(path) {
          var schemaObj = getSchemaByObjectPath(this.collection.schema.jsonSchema, path);
          var value = this.get(path);
          if (!value) {
            return PROMISE_RESOLVE_NULL;
          }
          if (!schemaObj) {
            throw newRxError("DOC5", {
              path
            });
          }
          if (!schemaObj.ref) {
            throw newRxError("DOC6", {
              path,
              schemaObj
            });
          }
          var refCollection = this.collection.database.collections[schemaObj.ref];
          if (!refCollection) {
            throw newRxError("DOC7", {
              ref: schemaObj.ref,
              path,
              schemaObj
            });
          }
          if (schemaObj.type === "array") {
            return refCollection.findByIds(value).exec().then((res) => {
              var valuesIterator = res.values();
              return Array.from(valuesIterator);
            });
          } else {
            return refCollection.findOne(value).exec();
          }
        },
        /**
         * get data by objectPath
         * @hotPath Performance here is really important,
         * run some tests before changing anything.
         */
        get(objPath) {
          return getDocumentProperty(this, objPath);
        },
        toJSON(withMetaFields = false) {
          if (!withMetaFields) {
            var data = flatClone(this._data);
            delete data._rev;
            delete data._attachments;
            delete data._deleted;
            delete data._meta;
            return overwritable.deepFreezeWhenDevMode(data);
          } else {
            return overwritable.deepFreezeWhenDevMode(this._data);
          }
        },
        toMutableJSON(withMetaFields = false) {
          return clone(this.toJSON(withMetaFields));
        },
        /**
         * updates document
         * @overwritten by plugin (optional)
         * @param updateObj mongodb-like syntax
         */
        update(_updateObj) {
          throw pluginMissing("update");
        },
        incrementalUpdate(_updateObj) {
          throw pluginMissing("update");
        },
        updateCRDT(_updateObj) {
          throw pluginMissing("crdt");
        },
        putAttachment() {
          throw pluginMissing("attachments");
        },
        putAttachmentBase64() {
          throw pluginMissing("attachments");
        },
        getAttachment() {
          throw pluginMissing("attachments");
        },
        allAttachments() {
          throw pluginMissing("attachments");
        },
        get allAttachments$() {
          throw pluginMissing("attachments");
        },
        async modify(mutationFunction, _context) {
          var oldData = this._data;
          var newData = await modifierFromPublicToInternal(mutationFunction)(oldData);
          return this._saveData(newData, oldData);
        },
        /**
         * runs an incremental update over the document
         * @param function that takes the document-data and returns a new data-object
         */
        incrementalModify(mutationFunction, _context) {
          return this.collection.incrementalWriteQueue.addWrite(this._data, modifierFromPublicToInternal(mutationFunction)).then((result) => this.collection._docCache.getCachedRxDocument(result));
        },
        patch(patch) {
          var oldData = this._data;
          var newData = clone(oldData);
          Object.entries(patch).forEach(([k, v]) => {
            newData[k] = v;
          });
          return this._saveData(newData, oldData);
        },
        /**
         * patches the given properties
         */
        incrementalPatch(patch) {
          return this.incrementalModify((docData) => {
            Object.entries(patch).forEach(([k, v]) => {
              docData[k] = v;
            });
            return docData;
          });
        },
        /**
         * saves the new document-data
         * and handles the events
         */
        async _saveData(newData, oldData) {
          newData = flatClone(newData);
          if (this._data._deleted) {
            throw newRxError("DOC11", {
              id: this.primary,
              document: this
            });
          }
          await beforeDocumentUpdateWrite(this.collection, newData, oldData);
          var writeRows = [{
            previous: oldData,
            document: newData
          }];
          var writeResult = await this.collection.storageInstance.bulkWrite(writeRows, "rx-document-save-data");
          var isError = writeResult.error[0];
          throwIfIsStorageWriteError(this.collection, this.primary, newData, isError);
          await this.collection._runHooks("post", "save", newData, this);
          return this.collection._docCache.getCachedRxDocument(getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, writeResult)[0]);
        },
        /**
         * Remove the document.
         * Notice that there is no hard delete,
         * instead deleted documents get flagged with _deleted=true.
         */
        async remove() {
          if (this.deleted) {
            return Promise.reject(newRxError("DOC13", {
              document: this,
              id: this.primary
            }));
          }
          var removeResult = await this.collection.bulkRemove([this]);
          if (removeResult.error.length > 0) {
            var error = removeResult.error[0];
            throwIfIsStorageWriteError(this.collection, this.primary, this._data, error);
          }
          return removeResult.success[0];
        },
        incrementalRemove() {
          return this.incrementalModify(async (docData) => {
            await this.collection._runHooks("pre", "remove", docData, this);
            docData._deleted = true;
            return docData;
          }).then(async (newDoc) => {
            await this.collection._runHooks("post", "remove", newDoc._data, newDoc);
            return newDoc;
          });
        },
        close() {
          throw newRxError("DOC14");
        }
      };
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/util.js
  function lastOfArray2(ar) {
    return ar[ar.length - 1];
  }
  function isObject3(value) {
    const type5 = typeof value;
    return value !== null && (type5 === "object" || type5 === "function");
  }
  function getProperty2(object, path, value) {
    if (Array.isArray(path)) {
      path = path.join(".");
    }
    if (!isObject3(object) || typeof path !== "string") {
      return value === void 0 ? object : value;
    }
    const pathArray = path.split(".");
    if (pathArray.length === 0) {
      return value;
    }
    for (let index = 0; index < pathArray.length; index++) {
      const key = pathArray[index];
      if (isStringIndex2(object, key)) {
        object = index === pathArray.length - 1 ? void 0 : null;
      } else {
        object = object[key];
      }
      if (object === void 0 || object === null) {
        if (index !== pathArray.length - 1) {
          return value;
        }
        break;
      }
    }
    return object === void 0 ? value : object;
  }
  function isStringIndex2(object, key) {
    if (typeof key !== "number" && Array.isArray(object)) {
      const index = Number.parseInt(key, 10);
      return Number.isInteger(index) && object[index] === object[key];
    }
    return false;
  }
  var init_util2 = __esm({
    "node_modules/event-reduce-js/dist/esm/src/util.js"() {
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/states/state-resolver.js
  var hasLimit, isFindOne, hasSkip, isDelete, isInsert, isUpdate, wasLimitReached, sortParamsChanged, wasInResult, wasFirst, wasLast, wasSortedBeforeFirst, wasSortedAfterLast, isSortedBeforeFirst, isSortedAfterLast, wasMatching, doesMatchNow, wasResultsEmpty;
  var init_state_resolver = __esm({
    "node_modules/event-reduce-js/dist/esm/src/states/state-resolver.js"() {
      init_util2();
      hasLimit = (input) => {
        return !!input.queryParams.limit;
      };
      isFindOne = (input) => {
        return input.queryParams.limit === 1;
      };
      hasSkip = (input) => {
        if (input.queryParams.skip && input.queryParams.skip > 0) {
          return true;
        } else {
          return false;
        }
      };
      isDelete = (input) => {
        return input.changeEvent.operation === "DELETE";
      };
      isInsert = (input) => {
        return input.changeEvent.operation === "INSERT";
      };
      isUpdate = (input) => {
        return input.changeEvent.operation === "UPDATE";
      };
      wasLimitReached = (input) => {
        return hasLimit(input) && input.previousResults.length >= input.queryParams.limit;
      };
      sortParamsChanged = (input) => {
        const sortFields = input.queryParams.sortFields;
        const prev = input.changeEvent.previous;
        const doc = input.changeEvent.doc;
        if (!doc) {
          return false;
        }
        if (!prev) {
          return true;
        }
        for (let i = 0; i < sortFields.length; i++) {
          const field = sortFields[i];
          const beforeData = getProperty2(prev, field);
          const afterData = getProperty2(doc, field);
          if (beforeData !== afterData) {
            return true;
          }
        }
        return false;
      };
      wasInResult = (input) => {
        const id = input.changeEvent.id;
        if (input.keyDocumentMap) {
          const has2 = input.keyDocumentMap.has(id);
          return has2;
        } else {
          const primary = input.queryParams.primaryKey;
          const results = input.previousResults;
          for (let i = 0; i < results.length; i++) {
            const item = results[i];
            if (item[primary] === id) {
              return true;
            }
          }
          return false;
        }
      };
      wasFirst = (input) => {
        const first = input.previousResults[0];
        if (first && first[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        } else {
          return false;
        }
      };
      wasLast = (input) => {
        const last2 = lastOfArray2(input.previousResults);
        if (last2 && last2[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        } else {
          return false;
        }
      };
      wasSortedBeforeFirst = (input) => {
        const prev = input.changeEvent.previous;
        if (!prev) {
          return false;
        }
        const first = input.previousResults[0];
        if (!first) {
          return false;
        }
        if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        }
        const comp = input.queryParams.sortComparator(prev, first);
        return comp < 0;
      };
      wasSortedAfterLast = (input) => {
        const prev = input.changeEvent.previous;
        if (!prev) {
          return false;
        }
        const last2 = lastOfArray2(input.previousResults);
        if (!last2) {
          return false;
        }
        if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        }
        const comp = input.queryParams.sortComparator(prev, last2);
        return comp > 0;
      };
      isSortedBeforeFirst = (input) => {
        const doc = input.changeEvent.doc;
        if (!doc) {
          return false;
        }
        const first = input.previousResults[0];
        if (!first) {
          return false;
        }
        if (first[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        }
        const comp = input.queryParams.sortComparator(doc, first);
        return comp < 0;
      };
      isSortedAfterLast = (input) => {
        const doc = input.changeEvent.doc;
        if (!doc) {
          return false;
        }
        const last2 = lastOfArray2(input.previousResults);
        if (!last2) {
          return false;
        }
        if (last2[input.queryParams.primaryKey] === input.changeEvent.id) {
          return true;
        }
        const comp = input.queryParams.sortComparator(doc, last2);
        return comp > 0;
      };
      wasMatching = (input) => {
        const prev = input.changeEvent.previous;
        if (!prev) {
          return false;
        }
        return input.queryParams.queryMatcher(prev);
      };
      doesMatchNow = (input) => {
        const doc = input.changeEvent.doc;
        if (!doc) {
          return false;
        }
        const ret = input.queryParams.queryMatcher(doc);
        return ret;
      };
      wasResultsEmpty = (input) => {
        return input.previousResults.length === 0;
      };
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/states/index.js
  var stateResolveFunctionByIndex;
  var init_states = __esm({
    "node_modules/event-reduce-js/dist/esm/src/states/index.js"() {
      init_state_resolver();
      init_state_resolver();
      stateResolveFunctionByIndex = {
        0: isInsert,
        1: isUpdate,
        2: isDelete,
        3: hasLimit,
        4: isFindOne,
        5: hasSkip,
        6: wasResultsEmpty,
        7: wasLimitReached,
        8: wasFirst,
        9: wasLast,
        10: sortParamsChanged,
        11: wasInResult,
        12: wasSortedBeforeFirst,
        13: wasSortedAfterLast,
        14: isSortedBeforeFirst,
        15: isSortedAfterLast,
        16: wasMatching,
        17: doesMatchNow
      };
    }
  });

  // node_modules/array-push-at-sort-position/dist/esm/index.js
  function pushAtSortPosition(array, item, compareFunction, low) {
    var length = array.length;
    var high = length - 1;
    var mid = 0;
    if (length === 0) {
      array.push(item);
      return 0;
    }
    var lastMidDoc;
    while (low <= high) {
      mid = low + (high - low >> 1);
      lastMidDoc = array[mid];
      if (compareFunction(lastMidDoc, item) <= 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (compareFunction(lastMidDoc, item) <= 0) {
      mid++;
    }
    array.splice(mid, 0, item);
    return mid;
  }
  var init_esm = __esm({
    "node_modules/array-push-at-sort-position/dist/esm/index.js"() {
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/actions/action-functions.js
  var doNothing, insertFirst, insertLast, removeFirstItem, removeLastItem, removeFirstInsertLast, removeLastInsertFirst, removeFirstInsertFirst, removeLastInsertLast, removeExisting, replaceExisting, alwaysWrong, insertAtSortPosition, removeExistingAndInsertAtSortPosition, runFullQueryAgain, unknownAction;
  var init_action_functions = __esm({
    "node_modules/event-reduce-js/dist/esm/src/actions/action-functions.js"() {
      init_esm();
      doNothing = (_input) => {
      };
      insertFirst = (input) => {
        input.previousResults.unshift(input.changeEvent.doc);
        if (input.keyDocumentMap) {
          input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
        }
      };
      insertLast = (input) => {
        input.previousResults.push(input.changeEvent.doc);
        if (input.keyDocumentMap) {
          input.keyDocumentMap.set(input.changeEvent.id, input.changeEvent.doc);
        }
      };
      removeFirstItem = (input) => {
        const first = input.previousResults.shift();
        if (input.keyDocumentMap && first) {
          input.keyDocumentMap.delete(first[input.queryParams.primaryKey]);
        }
      };
      removeLastItem = (input) => {
        const last2 = input.previousResults.pop();
        if (input.keyDocumentMap && last2) {
          input.keyDocumentMap.delete(last2[input.queryParams.primaryKey]);
        }
      };
      removeFirstInsertLast = (input) => {
        removeFirstItem(input);
        insertLast(input);
      };
      removeLastInsertFirst = (input) => {
        removeLastItem(input);
        insertFirst(input);
      };
      removeFirstInsertFirst = (input) => {
        removeFirstItem(input);
        insertFirst(input);
      };
      removeLastInsertLast = (input) => {
        removeLastItem(input);
        insertLast(input);
      };
      removeExisting = (input) => {
        if (input.keyDocumentMap) {
          input.keyDocumentMap.delete(input.changeEvent.id);
        }
        const primary = input.queryParams.primaryKey;
        const results = input.previousResults;
        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          if (item[primary] === input.changeEvent.id) {
            results.splice(i, 1);
            break;
          }
        }
      };
      replaceExisting = (input) => {
        const doc = input.changeEvent.doc;
        const primary = input.queryParams.primaryKey;
        const results = input.previousResults;
        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          if (item[primary] === input.changeEvent.id) {
            results[i] = doc;
            if (input.keyDocumentMap) {
              input.keyDocumentMap.set(input.changeEvent.id, doc);
            }
            break;
          }
        }
      };
      alwaysWrong = (input) => {
        const wrongHuman = {
          _id: "wrongHuman" + (/* @__PURE__ */ new Date()).getTime()
        };
        input.previousResults.length = 0;
        input.previousResults.push(wrongHuman);
        if (input.keyDocumentMap) {
          input.keyDocumentMap.clear();
          input.keyDocumentMap.set(wrongHuman._id, wrongHuman);
        }
      };
      insertAtSortPosition = (input) => {
        const docId = input.changeEvent.id;
        const doc = input.changeEvent.doc;
        if (input.keyDocumentMap) {
          if (input.keyDocumentMap.has(docId)) {
            return;
          }
          input.keyDocumentMap.set(docId, doc);
        } else {
          const isDocInResults = input.previousResults.find((d) => d[input.queryParams.primaryKey] === docId);
          if (isDocInResults) {
            return;
          }
        }
        pushAtSortPosition(input.previousResults, doc, input.queryParams.sortComparator, 0);
      };
      removeExistingAndInsertAtSortPosition = (input) => {
        removeExisting(input);
        insertAtSortPosition(input);
      };
      runFullQueryAgain = (_input) => {
        throw new Error("Action runFullQueryAgain must be implemented by yourself");
      };
      unknownAction = (_input) => {
        throw new Error("Action unknownAction should never be called");
      };
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/actions/index.js
  var orderedActionList, actionFunctions;
  var init_actions = __esm({
    "node_modules/event-reduce-js/dist/esm/src/actions/index.js"() {
      init_action_functions();
      init_action_functions();
      orderedActionList = [
        "doNothing",
        "insertFirst",
        "insertLast",
        "removeFirstItem",
        "removeLastItem",
        "removeFirstInsertLast",
        "removeLastInsertFirst",
        "removeFirstInsertFirst",
        "removeLastInsertLast",
        "removeExisting",
        "replaceExisting",
        "alwaysWrong",
        "insertAtSortPosition",
        "removeExistingAndInsertAtSortPosition",
        "runFullQueryAgain",
        "unknownAction"
      ];
      actionFunctions = {
        doNothing,
        insertFirst,
        insertLast,
        removeFirstItem,
        removeLastItem,
        removeFirstInsertLast,
        removeLastInsertFirst,
        removeFirstInsertFirst,
        removeLastInsertLast,
        removeExisting,
        replaceExisting,
        alwaysWrong,
        insertAtSortPosition,
        removeExistingAndInsertAtSortPosition,
        runFullQueryAgain,
        unknownAction
      };
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/string-format.js
  function getNumberOfChar(char) {
    const charCode = char.charCodeAt(0);
    return charCode - CHAR_CODE_OFFSET;
  }
  var CHAR_CODE_OFFSET;
  var init_string_format = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/string-format.js"() {
      CHAR_CODE_OFFSET = 40;
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/bdd-to-minimal-string.js
  var init_bdd_to_minimal_string = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/bdd-to-minimal-string.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/util.js
  function booleanToBooleanString(b) {
    if (b) {
      return "1";
    } else {
      return "0";
    }
  }
  function makeid(length = 6) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function splitStringToChunks(str, chunkSize) {
    const chunks = [];
    for (let i = 0, charsLength = str.length; i < charsLength; i += chunkSize) {
      chunks.push(str.substring(i, i + chunkSize));
    }
    return chunks;
  }
  var nodeIdPrefix;
  var init_util3 = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/util.js"() {
      nodeIdPrefix = makeid(4);
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/minimal-string-to-simple-bdd.js
  function minimalStringToSimpleBdd(str) {
    const nodesById = /* @__PURE__ */ new Map();
    const leafNodeAmount = parseInt(str.charAt(0) + str.charAt(1), 10);
    const lastLeafNodeChar = 2 + leafNodeAmount * 2;
    const leafNodeChars = str.substring(2, lastLeafNodeChar);
    const leafNodeChunks = splitStringToChunks(leafNodeChars, 2);
    for (let i = 0; i < leafNodeChunks.length; i++) {
      const chunk = leafNodeChunks[i];
      const id = chunk.charAt(0);
      const value = getNumberOfChar(chunk.charAt(1));
      nodesById.set(id, value);
    }
    const internalNodeChars = str.substring(lastLeafNodeChar, str.length - 3);
    const internalNodeChunks = splitStringToChunks(internalNodeChars, 4);
    for (let i = 0; i < internalNodeChunks.length; i++) {
      const chunk = internalNodeChunks[i];
      const id = chunk.charAt(0);
      const idOf0Branch = chunk.charAt(1);
      const idOf1Branch = chunk.charAt(2);
      const level = getNumberOfChar(chunk.charAt(3));
      if (!nodesById.has(idOf0Branch)) {
        throw new Error("missing node with id " + idOf0Branch);
      }
      if (!nodesById.has(idOf1Branch)) {
        throw new Error("missing node with id " + idOf1Branch);
      }
      const node0 = nodesById.get(idOf0Branch);
      const node1 = nodesById.get(idOf1Branch);
      const node = {
        l: level,
        // level is first for prettier json output
        0: node0,
        1: node1
      };
      nodesById.set(id, node);
    }
    const last3 = str.slice(-3);
    const idOf0 = last3.charAt(0);
    const idOf1 = last3.charAt(1);
    const levelOfRoot = getNumberOfChar(last3.charAt(2));
    const nodeOf0 = nodesById.get(idOf0);
    const nodeOf1 = nodesById.get(idOf1);
    const rootNode = {
      l: levelOfRoot,
      0: nodeOf0,
      1: nodeOf1
    };
    return rootNode;
  }
  var init_minimal_string_to_simple_bdd = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/minimal-string-to-simple-bdd.js"() {
      init_util3();
      init_string_format();
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/resolve-with-simple-bdd.js
  function resolveWithSimpleBdd(simpleBdd2, fns, input) {
    let currentNode = simpleBdd2;
    let currentLevel = simpleBdd2.l;
    while (true) {
      const booleanResult = fns[currentLevel](input);
      const branchKey = booleanToBooleanString(booleanResult);
      currentNode = currentNode[branchKey];
      if (typeof currentNode === "number" || typeof currentNode === "string") {
        return currentNode;
      } else {
        currentLevel = currentNode.l;
      }
    }
  }
  var init_resolve_with_simple_bdd = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/resolve-with-simple-bdd.js"() {
      init_util3();
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/bdd-to-simple-bdd.js
  var init_bdd_to_simple_bdd = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/bdd-to-simple-bdd.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/minimal-string/index.js
  var init_minimal_string = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/minimal-string/index.js"() {
      init_bdd_to_minimal_string();
      init_minimal_string_to_simple_bdd();
      init_resolve_with_simple_bdd();
      init_string_format();
      init_bdd_to_simple_bdd();
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/find-similar-node.js
  var init_find_similar_node = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/find-similar-node.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/abstract-node.js
  var init_abstract_node = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/abstract-node.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/branches.js
  var init_branches = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/branches.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/root-node.js
  var init_root_node = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/root-node.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/parents.js
  var init_parents = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/parents.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/internal-node.js
  var init_internal_node = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/internal-node.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/leaf-node.js
  var init_leaf_node = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/leaf-node.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/create-bdd-from-truth-table.js
  var init_create_bdd_from_truth_table = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/create-bdd-from-truth-table.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/ensure-correct-bdd.js
  var init_ensure_correct_bdd = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/ensure-correct-bdd.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/fill-truth-table.js
  var init_fill_truth_table = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/fill-truth-table.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/optimize-brute-force.js
  var init_optimize_brute_force = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/optimize-brute-force.js"() {
    }
  });

  // node_modules/binary-decision-diagram/dist/esm/src/index.js
  var init_src = __esm({
    "node_modules/binary-decision-diagram/dist/esm/src/index.js"() {
      init_minimal_string();
      init_abstract_node();
      init_branches();
      init_create_bdd_from_truth_table();
      init_ensure_correct_bdd();
      init_fill_truth_table();
      init_find_similar_node();
      init_internal_node();
      init_leaf_node();
      init_optimize_brute_force();
      init_parents();
      init_root_node();
      init_util3();
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/bdd/bdd.generated.js
  function getSimpleBdd() {
    if (!simpleBdd) {
      simpleBdd = minimalStringToSimpleBdd(minimalBddString);
    }
    return simpleBdd;
  }
  var minimalBddString, simpleBdd, resolveInput;
  var init_bdd_generated = __esm({
    "node_modules/event-reduce-js/dist/esm/src/bdd/bdd.generated.js"() {
      init_src();
      init_states();
      minimalBddString = "14a1b,c+d2e5f0g/h.i4j*k-l)m(n6oeh6pnm6qen6ril6snh6tin6ubo9vce9wmh9xns9yne9zmi9{cm9|ad9}cp9~aq9\x7Fae9\xA1bf9\xA2bq9\xA3cg9\xA4ck9\xA5cn9\xA6nd9\xA7np9\xA8nq9\xA9nf9\xAAng9\xABnm9\xACnk9\xADmr9\xAEms9\xAFmt9\xB0mj9\xB1mk9\xB2ml9\xB3mn9\xB4mc8\xB5\xB3{8\xB6\xAF}8\xB7\xB0\xA48\xB8\xB3\xA78\xB9mn8\xBA\xB3\xAB8\xBB\xB3m8\xBCm\xB44\xBDz\xB24\xBE\xB3w4\xBFz\xB54\xC0\xAF\xB64\xC1\xB0\xB74\xC2\xB3\xBA4\xC3\xB3\xB84\xC4m\xB94\xC5v\xA47\xC6yn7\xC7\xC0\xC17\xC8~\x7F7\xC9\xA5\xA47\xCA\xC3\xC47\xCB\xA8n7\xCC\xBA\xB97\xCD\xAD\xB07\xCE\xAEm7\xCF\xAF\xB07\xD0\xB1m7\xD1\xB3m7\xD2\xBCm5\xD3\xC4m5\xD4\xB9m5\xD5\xBD\xB05\xD6\xBEm5\xD7\xBF\xB05\xD8\xC7\xCF5\xD9\xC2m5\xDA\xCA\xD15\xDB\xB1m5\xDC\xBAm5\xDD\xCC\xD15\xDE\xD5\xCD2\xDF|\x7F2\xE0\xA1u2\xE1\xA3\xC52\xE2\xD6\xCE2\xE3\xA6\xC62\xE4\xA9x2\xE5\xAA\xC62\xE6\xD7\xD82\xE7|\xC82\xE8\xA1\xA22\xE9\xA3\xC92\xEA\xA4\xA52\xEB\xD9\xDA2\xEC\xA6\xCB2\xED\xA9n2\xEE\xAAn2\xEF\xDB\xD02\xF0\xDC\xDD2\xF1\xACn2\xF2\xD2\xD3/\xF3an/\xF4bn/\xF5cn/\xF6\xDE\xE2/\xF7\xDF\xE3/\xF8\xE0\xE4/\xF9\xE1\xE5/\xFA\xE6\xEB/\xFB\xE7\xEC/\xFC\xE8\xED/\xFD\xE9\xEE/\xFE\xCD\xCE/\xFF\xCF\xD1/\u0100\xF2\xD4,\u0101cn,\u0102\xF6\xEF,\u0103\xA4\xF1,\u0104\xFA\xF0,\u0105\xEA\xF1,\u0106\xFE\xD0,\u0107\xFF\xD1,\u0108ac0\u0109bc0\u010A\xF3\xF50\u010B\xF4\u01010\u010C\xDF\xE10\u010D\xE0\xA40\u010E\xE7\xE90\u010F\xE8\xEA0\u0110\xF7\xF90\u0111\xF8\u01030\u0112\xFB\xFD0\u0113\xFC\u01050\u0114m\xD2-\u0115m\u0100-\u0116\xDE\xE6-\u0117\u010C\u010E-\u0118\u010D\u010F-\u0119\u0102\u0104-\u011A\u0110\u0112-\u011B\u0111\u0113-\u011C\xB2\xBB-\u011D\xCD\xCF-\u011E\u0106\u0107-\u011F\xB2\xB3-\u0120\u0114\u01083\u0121\u0115\u010A3\u0122\u0116\u01173\u0123\u0119\u011A3\u0124\u0122\u011D(\u0125\u011C\u011F(\u0126\u0123\u011E(\u0127\u0120\u0121+\u0128\u0109\u010B+\u0129\u0124\u0126+\u012A\u0118\u011B+\u012B\u0127\u01281\u012C\u0129\u012A1\u012D\u012C\u012B*\u012E\u0125m*\u012D\u012E.";
      resolveInput = (input) => {
        return resolveWithSimpleBdd(getSimpleBdd(), stateResolveFunctionByIndex, input);
      };
    }
  });

  // node_modules/event-reduce-js/dist/esm/src/index.js
  function calculateActionName(input) {
    const resolvedActionId = resolveInput(input);
    return orderedActionList[resolvedActionId];
  }
  function runAction(action, queryParams, changeEvent, previousResults, keyDocumentMap) {
    const fn = actionFunctions[action];
    fn({
      queryParams,
      changeEvent,
      previousResults,
      keyDocumentMap
    });
    return previousResults;
  }
  var init_src2 = __esm({
    "node_modules/event-reduce-js/dist/esm/src/index.js"() {
      init_actions();
      init_bdd_generated();
      init_states();
      init_util2();
      init_actions();
    }
  });

  // node_modules/rxdb/dist/esm/event-reduce.js
  function getSortFieldsOfQuery(primaryKey, query) {
    if (!query.sort || query.sort.length === 0) {
      return [primaryKey];
    } else {
      return query.sort.map((part) => Object.keys(part)[0]);
    }
  }
  function getQueryParams(rxQuery) {
    return getFromMapOrCreate(RXQUERY_QUERY_PARAMS_CACHE, rxQuery, () => {
      var collection = rxQuery.collection;
      var normalizedMangoQuery = normalizeMangoQuery(collection.storageInstance.schema, clone(rxQuery.mangoQuery));
      var primaryKey = collection.schema.primaryPath;
      var sortComparator = getSortComparator(collection.schema.jsonSchema, normalizedMangoQuery);
      var useSortComparator = (docA, docB) => {
        var sortComparatorData = {
          docA,
          docB,
          rxQuery
        };
        return sortComparator(sortComparatorData.docA, sortComparatorData.docB);
      };
      var queryMatcher = getQueryMatcher(collection.schema.jsonSchema, normalizedMangoQuery);
      var useQueryMatcher = (doc) => {
        var queryMatcherData = {
          doc,
          rxQuery
        };
        return queryMatcher(queryMatcherData.doc);
      };
      var ret = {
        primaryKey: rxQuery.collection.schema.primaryPath,
        skip: normalizedMangoQuery.skip,
        limit: normalizedMangoQuery.limit,
        sortFields: getSortFieldsOfQuery(primaryKey, normalizedMangoQuery),
        sortComparator: useSortComparator,
        queryMatcher: useQueryMatcher
      };
      return ret;
    });
  }
  function calculateNewResults(rxQuery, rxChangeEvents) {
    if (!rxQuery.collection.database.eventReduce) {
      return {
        runFullQueryAgain: true
      };
    }
    var queryParams = getQueryParams(rxQuery);
    var previousResults = ensureNotFalsy(rxQuery._result).docsData.slice(0);
    var previousResultsMap = ensureNotFalsy(rxQuery._result).docsDataMap;
    var changed = false;
    var eventReduceEvents = [];
    for (var index = 0; index < rxChangeEvents.length; index++) {
      var cE = rxChangeEvents[index];
      var eventReduceEvent = rxChangeEventToEventReduceChangeEvent(cE);
      if (eventReduceEvent) {
        eventReduceEvents.push(eventReduceEvent);
      }
    }
    var foundNonOptimizeable = eventReduceEvents.find((eventReduceEvent2) => {
      var stateResolveFunctionInput = {
        queryParams,
        changeEvent: eventReduceEvent2,
        previousResults,
        keyDocumentMap: previousResultsMap
      };
      var actionName = calculateActionName(stateResolveFunctionInput);
      if (actionName === "runFullQueryAgain") {
        return true;
      } else if (actionName !== "doNothing") {
        changed = true;
        runAction(actionName, queryParams, eventReduceEvent2, previousResults, previousResultsMap);
        return false;
      }
    });
    if (foundNonOptimizeable) {
      return {
        runFullQueryAgain: true
      };
    } else {
      return {
        runFullQueryAgain: false,
        changed,
        newResults: previousResults
      };
    }
  }
  var RXQUERY_QUERY_PARAMS_CACHE;
  var init_event_reduce = __esm({
    "node_modules/rxdb/dist/esm/event-reduce.js"() {
      init_src2();
      init_rx_change_event();
      init_utils();
      init_rx_query_helper();
      RXQUERY_QUERY_PARAMS_CACHE = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/rxdb/dist/esm/query-cache.js
  function createQueryCache() {
    return new QueryCache();
  }
  function uncacheRxQuery(queryCache, rxQuery) {
    rxQuery.uncached = true;
    var stringRep = rxQuery.toString();
    queryCache._map.delete(stringRep);
  }
  function countRxQuerySubscribers(rxQuery) {
    return rxQuery.refCount$.observers.length;
  }
  function triggerCacheReplacement(rxCollection) {
    if (COLLECTIONS_WITH_RUNNING_CLEANUP.has(rxCollection)) {
      return;
    }
    COLLECTIONS_WITH_RUNNING_CLEANUP.add(rxCollection);
    nextTick().then(() => requestIdlePromise(200)).then(() => {
      if (!rxCollection.closed) {
        rxCollection.cacheReplacementPolicy(rxCollection, rxCollection._queryCache);
      }
      COLLECTIONS_WITH_RUNNING_CLEANUP.delete(rxCollection);
    });
  }
  var QueryCache, DEFAULT_TRY_TO_KEEP_MAX, DEFAULT_UNEXECUTED_LIFETIME, defaultCacheReplacementPolicyMonad, defaultCacheReplacementPolicy, COLLECTIONS_WITH_RUNNING_CLEANUP;
  var init_query_cache = __esm({
    "node_modules/rxdb/dist/esm/query-cache.js"() {
      init_utils();
      QueryCache = /* @__PURE__ */ (function() {
        function QueryCache2() {
          this._map = /* @__PURE__ */ new Map();
        }
        var _proto = QueryCache2.prototype;
        _proto.getByQuery = function getByQuery(rxQuery) {
          var stringRep = rxQuery.toString();
          var ret = getFromMapOrCreate(this._map, stringRep, () => rxQuery);
          return ret;
        };
        return QueryCache2;
      })();
      DEFAULT_TRY_TO_KEEP_MAX = 100;
      DEFAULT_UNEXECUTED_LIFETIME = 30 * 1e3;
      defaultCacheReplacementPolicyMonad = (tryToKeepMax, unExecutedLifetime) => (_collection, queryCache) => {
        if (queryCache._map.size < tryToKeepMax) {
          return;
        }
        var minUnExecutedLifetime = now() - unExecutedLifetime;
        var maybeUncache = [];
        var queriesInCache = Array.from(queryCache._map.values());
        for (var rxQuery of queriesInCache) {
          if (countRxQuerySubscribers(rxQuery) > 0) {
            continue;
          }
          if (rxQuery._lastEnsureEqual === 0 && rxQuery._creationTime < minUnExecutedLifetime) {
            uncacheRxQuery(queryCache, rxQuery);
            continue;
          }
          maybeUncache.push(rxQuery);
        }
        var mustUncache = maybeUncache.length - tryToKeepMax;
        if (mustUncache <= 0) {
          return;
        }
        var sortedByLastUsage = maybeUncache.sort((a, b) => a._lastEnsureEqual - b._lastEnsureEqual);
        var toRemove = sortedByLastUsage.slice(0, mustUncache);
        toRemove.forEach((rxQuery2) => uncacheRxQuery(queryCache, rxQuery2));
      };
      defaultCacheReplacementPolicy = defaultCacheReplacementPolicyMonad(DEFAULT_TRY_TO_KEEP_MAX, DEFAULT_UNEXECUTED_LIFETIME);
      COLLECTIONS_WITH_RUNNING_CLEANUP = /* @__PURE__ */ new WeakSet();
    }
  });

  // node_modules/rxdb/dist/esm/doc-cache.js
  function getCachedRxDocumentMonad(docCache) {
    var primaryPath = docCache.primaryPath;
    var cacheItemByDocId = docCache.cacheItemByDocId;
    var registry = docCache.registry;
    var deepFreezeWhenDevMode = overwritable.deepFreezeWhenDevMode;
    var documentCreator = docCache.documentCreator;
    var fn = (docsData) => {
      var ret = new Array(docsData.length);
      var registryTasks = [];
      for (var index = 0; index < docsData.length; index++) {
        var docData = docsData[index];
        var docId = docData[primaryPath];
        var revisionHeight = getHeightOfRevision(docData._rev);
        var byRev = void 0;
        var cachedRxDocumentWeakRef = void 0;
        var cacheItem = cacheItemByDocId.get(docId);
        if (!cacheItem) {
          byRev = /* @__PURE__ */ new Map();
          cacheItem = [byRev, docData];
          cacheItemByDocId.set(docId, cacheItem);
        } else {
          byRev = cacheItem[0];
          cachedRxDocumentWeakRef = byRev.get(revisionHeight + docData._meta.lwt + "");
        }
        var cachedRxDocument = cachedRxDocumentWeakRef ? cachedRxDocumentWeakRef.deref() : void 0;
        if (!cachedRxDocument) {
          docData = deepFreezeWhenDevMode(docData);
          cachedRxDocument = documentCreator(docData);
          byRev.set(revisionHeight + docData._meta.lwt + "", createWeakRefWithFallback(cachedRxDocument));
          if (registry) {
            registryTasks.push(cachedRxDocument);
          }
        }
        ret[index] = cachedRxDocument;
      }
      if (registryTasks.length > 0 && registry) {
        docCache.tasks.add(() => {
          for (var _index = 0; _index < registryTasks.length; _index++) {
            var doc = registryTasks[_index];
            registry.register(doc, {
              docId: doc.primary,
              revisionHeight: getHeightOfRevision(doc.revision),
              lwt: doc._data._meta.lwt
            });
          }
        });
        if (docCache.tasks.size <= 1) {
          requestIdlePromiseNoQueue().then(() => {
            docCache.processTasks();
          });
        }
      }
      return ret;
    };
    return fn;
  }
  function mapDocumentsDataToCacheDocs(docCache, docsData) {
    var getCachedRxDocuments = docCache.getCachedRxDocuments;
    return getCachedRxDocuments(docsData);
  }
  function createWeakRef(obj) {
    return new WeakRef(obj);
  }
  function createWeakRefFallback(obj) {
    return {
      deref() {
        return obj;
      }
    };
  }
  var DocumentCache, HAS_WEAK_REF, createWeakRefWithFallback;
  var init_doc_cache = __esm({
    "node_modules/rxdb/dist/esm/doc-cache.js"() {
      init_createClass();
      init_utils();
      init_overwritable();
      DocumentCache = /* @__PURE__ */ (function() {
        function DocumentCache2(primaryPath, changes$, documentCreator) {
          this.cacheItemByDocId = /* @__PURE__ */ new Map();
          this.tasks = /* @__PURE__ */ new Set();
          this.registry = typeof FinalizationRegistry === "function" ? new FinalizationRegistry((docMeta) => {
            var docId = docMeta.docId;
            var cacheItem = this.cacheItemByDocId.get(docId);
            if (cacheItem) {
              cacheItem[0].delete(docMeta.revisionHeight + docMeta.lwt + "");
              if (cacheItem[0].size === 0) {
                this.cacheItemByDocId.delete(docId);
              }
            }
          }) : void 0;
          this.primaryPath = primaryPath;
          this.changes$ = changes$;
          this.documentCreator = documentCreator;
          changes$.subscribe((events) => {
            this.tasks.add(() => {
              var cacheItemByDocId = this.cacheItemByDocId;
              for (var index = 0; index < events.length; index++) {
                var event = events[index];
                var cacheItem = cacheItemByDocId.get(event.documentId);
                if (cacheItem) {
                  var documentData = event.documentData;
                  if (!documentData) {
                    documentData = event.previousDocumentData;
                  }
                  cacheItem[1] = documentData;
                }
              }
            });
            if (this.tasks.size <= 1) {
              requestIdlePromiseNoQueue().then(() => {
                this.processTasks();
              });
            }
          });
        }
        var _proto = DocumentCache2.prototype;
        _proto.processTasks = function processTasks() {
          if (this.tasks.size === 0) {
            return;
          }
          var tasks = Array.from(this.tasks);
          tasks.forEach((task) => task());
          this.tasks.clear();
        };
        _proto.getLatestDocumentData = function getLatestDocumentData(docId) {
          this.processTasks();
          var cacheItem = getFromMapOrThrow(this.cacheItemByDocId, docId);
          return cacheItem[1];
        };
        _proto.getLatestDocumentDataIfExists = function getLatestDocumentDataIfExists(docId) {
          this.processTasks();
          var cacheItem = this.cacheItemByDocId.get(docId);
          if (cacheItem) {
            return cacheItem[1];
          }
        };
        return _createClass(DocumentCache2, [{
          key: "getCachedRxDocuments",
          get: function() {
            var fn = getCachedRxDocumentMonad(this);
            return overwriteGetterForCaching(this, "getCachedRxDocuments", fn);
          }
        }, {
          key: "getCachedRxDocument",
          get: function() {
            var fn = getCachedRxDocumentMonad(this);
            return overwriteGetterForCaching(this, "getCachedRxDocument", (doc) => fn([doc])[0]);
          }
        }]);
      })();
      HAS_WEAK_REF = typeof WeakRef === "function";
      createWeakRefWithFallback = HAS_WEAK_REF ? createWeakRef : createWeakRefFallback;
    }
  });

  // node_modules/rxdb/dist/esm/rx-query-single-result.js
  var RxQuerySingleResult;
  var init_rx_query_single_result = __esm({
    "node_modules/rxdb/dist/esm/rx-query-single-result.js"() {
      init_createClass();
      init_doc_cache();
      init_utils();
      init_rx_error();
      RxQuerySingleResult = /* @__PURE__ */ (function() {
        function RxQuerySingleResult2(query, docsDataFromStorageInstance, count) {
          this.time = now();
          this.query = query;
          this.count = count;
          this.documents = mapDocumentsDataToCacheDocs(this.query.collection._docCache, docsDataFromStorageInstance);
        }
        var _proto = RxQuerySingleResult2.prototype;
        _proto.getValue = function getValue2(throwIfMissing) {
          var op = this.query.op;
          if (op === "count") {
            return this.count;
          } else if (op === "findOne") {
            var doc = this.documents.length === 0 ? null : this.documents[0];
            if (!doc && throwIfMissing) {
              throw newRxError("QU10", {
                collection: this.query.collection.name,
                query: this.query.mangoQuery,
                op
              });
            } else {
              return doc;
            }
          } else if (op === "findByIds") {
            return this.docsMap;
          } else {
            return this.documents.slice(0);
          }
        };
        return _createClass(RxQuerySingleResult2, [{
          key: "docsData",
          get: function() {
            return overwriteGetterForCaching(this, "docsData", this.documents.map((d) => d._data));
          }
          // A key->document map, used in the event reduce optimization.
        }, {
          key: "docsDataMap",
          get: function() {
            var map2 = /* @__PURE__ */ new Map();
            this.documents.forEach((d) => {
              map2.set(d.primary, d._data);
            });
            return overwriteGetterForCaching(this, "docsDataMap", map2);
          }
        }, {
          key: "docsMap",
          get: function() {
            var map2 = /* @__PURE__ */ new Map();
            var documents = this.documents;
            for (var i = 0; i < documents.length; i++) {
              var doc = documents[i];
              map2.set(doc.primary, doc);
            }
            return overwriteGetterForCaching(this, "docsMap", map2);
          }
        }]);
      })();
    }
  });

  // node_modules/rxdb/dist/esm/rx-query.js
  function _getDefaultQuery() {
    return {
      selector: {}
    };
  }
  function tunnelQueryCache(rxQuery) {
    return rxQuery.collection._queryCache.getByQuery(rxQuery);
  }
  function createRxQuery(op, queryObj, collection, other) {
    runPluginHooks("preCreateRxQuery", {
      op,
      queryObj,
      collection,
      other
    });
    var ret = new RxQueryBase(op, queryObj, collection, other);
    ret = tunnelQueryCache(ret);
    triggerCacheReplacement(collection);
    return ret;
  }
  function _isResultsInSync(rxQuery) {
    var currentLatestEventNumber = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
    if (rxQuery._latestChangeEvent >= currentLatestEventNumber) {
      return true;
    } else {
      return false;
    }
  }
  async function _ensureEqual(rxQuery) {
    if (rxQuery.collection.awaitBeforeReads.size > 0) {
      await Promise.all(Array.from(rxQuery.collection.awaitBeforeReads).map((fn) => fn()));
    }
    if (rxQuery.collection.database.closed || _isResultsInSync(rxQuery)) {
      return false;
    }
    rxQuery._ensureEqualQueue = rxQuery._ensureEqualQueue.then(() => __ensureEqual(rxQuery));
    return rxQuery._ensureEqualQueue;
  }
  function __ensureEqual(rxQuery) {
    rxQuery._lastEnsureEqual = now();
    if (
      // db is closed
      rxQuery.collection.database.closed || // nothing happened since last run
      _isResultsInSync(rxQuery)
    ) {
      return PROMISE_RESOLVE_FALSE;
    }
    var ret = false;
    var mustReExec = false;
    if (rxQuery._latestChangeEvent === -1) {
      mustReExec = true;
    }
    if (!mustReExec) {
      var missedChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.getFrom(rxQuery._latestChangeEvent + 1);
      if (missedChangeEvents === null) {
        mustReExec = true;
      } else {
        rxQuery._latestChangeEvent = rxQuery.asRxQuery.collection._changeEventBuffer.getCounter();
        var runChangeEvents = rxQuery.asRxQuery.collection._changeEventBuffer.reduceByLastOfDoc(missedChangeEvents);
        if (rxQuery.op === "count") {
          var previousCount = ensureNotFalsy(rxQuery._result).count;
          var newCount = previousCount;
          runChangeEvents.forEach((cE) => {
            var didMatchBefore = cE.previousDocumentData && rxQuery.doesDocumentDataMatch(cE.previousDocumentData);
            var doesMatchNow2 = rxQuery.doesDocumentDataMatch(cE.documentData);
            if (!didMatchBefore && doesMatchNow2) {
              newCount++;
            }
            if (didMatchBefore && !doesMatchNow2) {
              newCount--;
            }
          });
          if (newCount !== previousCount) {
            ret = true;
            rxQuery._setResultData(newCount);
          }
        } else {
          var eventReduceResult = calculateNewResults(rxQuery, runChangeEvents);
          if (eventReduceResult.runFullQueryAgain) {
            mustReExec = true;
          } else if (eventReduceResult.changed) {
            ret = true;
            rxQuery._setResultData(eventReduceResult.newResults);
          }
        }
      }
    }
    if (mustReExec) {
      return rxQuery._execOverDatabase().then((newResultData) => {
        rxQuery._latestChangeEvent = rxQuery.collection._changeEventBuffer.getCounter();
        if (typeof newResultData === "number") {
          if (!rxQuery._result || newResultData !== rxQuery._result.count) {
            ret = true;
            rxQuery._setResultData(newResultData);
          }
          return ret;
        }
        if (!rxQuery._result || !areRxDocumentArraysEqual(rxQuery.collection.schema.primaryPath, newResultData, rxQuery._result.docsData)) {
          ret = true;
          rxQuery._setResultData(newResultData);
        }
        return ret;
      });
    }
    return Promise.resolve(ret);
  }
  async function queryCollection(rxQuery) {
    var docs = [];
    var collection = rxQuery.collection;
    if (rxQuery.isFindOneByIdQuery) {
      if (Array.isArray(rxQuery.isFindOneByIdQuery)) {
        var docIds = rxQuery.isFindOneByIdQuery;
        docIds = docIds.filter((docId2) => {
          var docData2 = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId2);
          if (docData2) {
            if (!docData2._deleted) {
              docs.push(docData2);
            }
            return false;
          } else {
            return true;
          }
        });
        if (docIds.length > 0) {
          var docsFromStorage = await collection.storageInstance.findDocumentsById(docIds, false);
          appendToArray(docs, docsFromStorage);
        }
      } else {
        var docId = rxQuery.isFindOneByIdQuery;
        var docData = rxQuery.collection._docCache.getLatestDocumentDataIfExists(docId);
        if (!docData) {
          var fromStorageList = await collection.storageInstance.findDocumentsById([docId], false);
          if (fromStorageList[0]) {
            docData = fromStorageList[0];
          }
        }
        if (docData && !docData._deleted) {
          docs.push(docData);
        }
      }
    } else {
      var preparedQuery = rxQuery.getPreparedQuery();
      var queryResult = await collection.storageInstance.query(preparedQuery);
      docs = queryResult.documents;
    }
    return docs;
  }
  function isFindOneByIdQuery(primaryPath, query) {
    if (!query.skip && query.selector && Object.keys(query.selector).length === 1 && query.selector[primaryPath]) {
      var value = query.selector[primaryPath];
      if (typeof value === "string") {
        return value;
      } else if (Object.keys(value).length === 1 && typeof value.$eq === "string") {
        return value.$eq;
      }
      if (Object.keys(value).length === 1 && Array.isArray(value.$eq) && // must only contain strings
      !value.$eq.find((r) => typeof r !== "string")) {
        return value.$eq;
      }
    }
    return false;
  }
  var _queryCount, newQueryID, RxQueryBase;
  var init_rx_query = __esm({
    "node_modules/rxdb/dist/esm/rx-query.js"() {
      init_createClass();
      init_esm5();
      init_operators();
      init_utils();
      init_rx_error();
      init_hooks();
      init_event_reduce();
      init_query_cache();
      init_rx_query_helper();
      init_rx_query_single_result();
      _queryCount = 0;
      newQueryID = function() {
        return ++_queryCount;
      };
      RxQueryBase = /* @__PURE__ */ (function() {
        function RxQueryBase2(op, mangoQuery, collection, other = {}) {
          this.id = newQueryID();
          this._execOverDatabaseCount = 0;
          this._creationTime = now();
          this._lastEnsureEqual = 0;
          this.uncached = false;
          this.refCount$ = new BehaviorSubject(null);
          this._result = null;
          this._latestChangeEvent = -1;
          this._ensureEqualQueue = PROMISE_RESOLVE_FALSE;
          this.op = op;
          this.mangoQuery = mangoQuery;
          this.collection = collection;
          this.other = other;
          if (!mangoQuery) {
            this.mangoQuery = _getDefaultQuery();
          }
          this.isFindOneByIdQuery = isFindOneByIdQuery(this.collection.schema.primaryPath, mangoQuery);
        }
        var _proto = RxQueryBase2.prototype;
        _proto._setResultData = function _setResultData(newResultData) {
          if (typeof newResultData === "undefined") {
            throw newRxError("QU18", {
              database: this.collection.database.name,
              collection: this.collection.name
            });
          }
          if (typeof newResultData === "number") {
            this._result = new RxQuerySingleResult(this, [], newResultData);
            return;
          } else if (newResultData instanceof Map) {
            newResultData = Array.from(newResultData.values());
          }
          var newQueryResult = new RxQuerySingleResult(this, newResultData, newResultData.length);
          this._result = newQueryResult;
        };
        _proto._execOverDatabase = async function _execOverDatabase() {
          this._execOverDatabaseCount = this._execOverDatabaseCount + 1;
          if (this.op === "count") {
            var preparedQuery = this.getPreparedQuery();
            var result = await this.collection.storageInstance.count(preparedQuery);
            if (result.mode === "slow" && !this.collection.database.allowSlowCount) {
              throw newRxError("QU14", {
                collection: this.collection,
                queryObj: this.mangoQuery
              });
            } else {
              return result.count;
            }
          }
          if (this.op === "findByIds") {
            var ids = ensureNotFalsy(this.mangoQuery.selector)[this.collection.schema.primaryPath].$in;
            var ret = /* @__PURE__ */ new Map();
            var mustBeQueried = [];
            ids.forEach((id) => {
              var docData = this.collection._docCache.getLatestDocumentDataIfExists(id);
              if (docData) {
                if (!docData._deleted) {
                  var doc = this.collection._docCache.getCachedRxDocument(docData);
                  ret.set(id, doc);
                }
              } else {
                mustBeQueried.push(id);
              }
            });
            if (mustBeQueried.length > 0) {
              var docs = await this.collection.storageInstance.findDocumentsById(mustBeQueried, false);
              docs.forEach((docData) => {
                var doc = this.collection._docCache.getCachedRxDocument(docData);
                ret.set(doc.primary, doc);
              });
            }
            return ret;
          }
          var docsPromise = queryCollection(this);
          return docsPromise.then((docs2) => {
            return docs2;
          });
        };
        _proto.exec = async function exec(throwIfMissing) {
          if (throwIfMissing && this.op !== "findOne") {
            throw newRxError("QU9", {
              collection: this.collection.name,
              query: this.mangoQuery,
              op: this.op
            });
          }
          await _ensureEqual(this);
          var useResult = ensureNotFalsy(this._result);
          return useResult.getValue(throwIfMissing);
        };
        _proto.toString = function toString() {
          var stringObj = sortObject({
            op: this.op,
            query: normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery),
            other: this.other
          }, true);
          var value = JSON.stringify(stringObj);
          this.toString = () => value;
          return value;
        };
        _proto.getPreparedQuery = function getPreparedQuery() {
          var hookInput = {
            rxQuery: this,
            // can be mutated by the hooks so we have to deep clone first.
            mangoQuery: normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery)
          };
          hookInput.mangoQuery.selector._deleted = {
            $eq: false
          };
          if (hookInput.mangoQuery.index) {
            hookInput.mangoQuery.index.unshift("_deleted");
          }
          runPluginHooks("prePrepareQuery", hookInput);
          var value = prepareQuery(this.collection.schema.jsonSchema, hookInput.mangoQuery);
          this.getPreparedQuery = () => value;
          return value;
        };
        _proto.doesDocumentDataMatch = function doesDocumentDataMatch(docData) {
          if (docData._deleted) {
            return false;
          }
          return this.queryMatcher(docData);
        };
        _proto.remove = async function remove2() {
          var docs = await this.exec();
          if (Array.isArray(docs)) {
            var result = await this.collection.bulkRemove(docs);
            if (result.error.length > 0) {
              throw rxStorageWriteErrorToRxError(result.error[0]);
            } else {
              return result.success;
            }
          } else {
            return docs.remove();
          }
        };
        _proto.incrementalRemove = function incrementalRemove() {
          return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalRemove());
        };
        _proto.update = function update3(_updateObj) {
          throw pluginMissing("update");
        };
        _proto.patch = function patch(_patch) {
          return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.patch(_patch));
        };
        _proto.incrementalPatch = function incrementalPatch(patch) {
          return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalPatch(patch));
        };
        _proto.modify = function modify(mutationFunction) {
          return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.modify(mutationFunction));
        };
        _proto.incrementalModify = function incrementalModify(mutationFunction) {
          return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.incrementalModify(mutationFunction));
        };
        _proto.where = function where(_queryObj) {
          throw pluginMissing("query-builder");
        };
        _proto.sort = function sort(_params) {
          throw pluginMissing("query-builder");
        };
        _proto.skip = function skip(_amount) {
          throw pluginMissing("query-builder");
        };
        _proto.limit = function limit(_amount) {
          throw pluginMissing("query-builder");
        };
        return _createClass(RxQueryBase2, [{
          key: "$",
          get: function() {
            if (!this._$) {
              var results$ = this.collection.eventBulks$.pipe(
                /**
                 * Performance shortcut.
                 * Changes to local documents are not relevant for the query.
                 */
                filter((bulk) => !bulk.isLocal),
                /**
                 * Start once to ensure the querying also starts
                 * when there where no changes.
                 */
                startWith(null),
                // ensure query results are up to date.
                mergeMap(() => _ensureEqual(this)),
                // use the current result set, written by _ensureEqual().
                map(() => this._result),
                // do not run stuff above for each new subscriber, only once.
                shareReplay(RXJS_SHARE_REPLAY_DEFAULTS),
                // do not proceed if result set has not changed.
                distinctUntilChanged((prev, curr) => {
                  if (prev && prev.time === ensureNotFalsy(curr).time) {
                    return true;
                  } else {
                    return false;
                  }
                }),
                filter((result) => !!result),
                /**
                 * Map the result set to a single RxDocument or an array,
                 * depending on query type
                 */
                map((result) => {
                  return ensureNotFalsy(result).getValue();
                })
              );
              this._$ = merge2(
                results$,
                /**
                 * Also add the refCount$ to the query observable
                 * to allow us to count the amount of subscribers.
                 */
                this.refCount$.pipe(filter(() => false))
              );
            }
            return this._$;
          }
        }, {
          key: "$$",
          get: function() {
            var reactivity = this.collection.database.getReactivityFactory();
            return reactivity.fromObservable(this.$, void 0, this.collection.database);
          }
          // stores the changeEvent-number of the last handled change-event
          /**
           * ensures that the exec-runs
           * are not run in parallel
           */
        }, {
          key: "queryMatcher",
          get: function() {
            var schema = this.collection.schema.jsonSchema;
            var normalizedQuery = normalizeMangoQuery(this.collection.schema.jsonSchema, this.mangoQuery);
            return overwriteGetterForCaching(this, "queryMatcher", getQueryMatcher(schema, normalizedQuery));
          }
        }, {
          key: "asRxQuery",
          get: function() {
            return this;
          }
        }]);
      })();
    }
  });

  // node_modules/rxdb/dist/esm/rx-database-internal-store.js
  function getPrimaryKeyOfInternalDocument(key, context2) {
    return getComposedPrimaryKeyOfDocumentData(INTERNAL_STORE_SCHEMA, {
      key,
      context: context2
    });
  }
  async function getAllCollectionDocuments(storageInstance) {
    var getAllQueryPrepared = prepareQuery(storageInstance.schema, {
      selector: {
        context: INTERNAL_CONTEXT_COLLECTION,
        _deleted: {
          $eq: false
        }
      },
      sort: [{
        id: "asc"
      }],
      skip: 0
    });
    var queryResult = await storageInstance.query(getAllQueryPrepared);
    var allDocs = queryResult.documents;
    return allDocs;
  }
  async function ensureStorageTokenDocumentExists(rxDatabase) {
    var storageToken = randomToken(10);
    var passwordHash = rxDatabase.password ? await rxDatabase.hashFunction(JSON.stringify(rxDatabase.password)) : void 0;
    var docData = {
      id: STORAGE_TOKEN_DOCUMENT_ID,
      context: INTERNAL_CONTEXT_STORAGE_TOKEN,
      key: STORAGE_TOKEN_DOCUMENT_KEY,
      data: {
        rxdbVersion: rxDatabase.rxdbVersion,
        token: storageToken,
        /**
         * We add the instance token here
         * to be able to detect if a given RxDatabase instance
         * is the first instance that was ever created
         * or if databases have existed earlier on that storage
         * with the same database name.
         */
        instanceToken: rxDatabase.token,
        passwordHash
      },
      _deleted: false,
      _meta: getDefaultRxDocumentMeta(),
      _rev: getDefaultRevision(),
      _attachments: {}
    };
    var writeRows = [{
      document: docData
    }];
    var writeResult = await rxDatabase.internalStore.bulkWrite(writeRows, "internal-add-storage-token");
    if (!writeResult.error[0]) {
      return getWrittenDocumentsFromBulkWriteResponse("id", writeRows, writeResult)[0];
    }
    var error = ensureNotFalsy(writeResult.error[0]);
    if (error.isError && isBulkWriteConflictError(error)) {
      var conflictError = error;
      if (!isDatabaseStateVersionCompatibleWithDatabaseCode(conflictError.documentInDb.data.rxdbVersion, rxDatabase.rxdbVersion)) {
        throw newRxError("DM5", {
          args: {
            database: rxDatabase.name,
            databaseStateVersion: conflictError.documentInDb.data.rxdbVersion,
            codeVersion: rxDatabase.rxdbVersion
          }
        });
      }
      if (passwordHash && passwordHash !== conflictError.documentInDb.data.passwordHash) {
        throw newRxError("DB1", {
          passwordHash,
          existingPasswordHash: conflictError.documentInDb.data.passwordHash
        });
      }
      var storageTokenDocInDb = conflictError.documentInDb;
      return ensureNotFalsy(storageTokenDocInDb);
    }
    throw error;
  }
  function isDatabaseStateVersionCompatibleWithDatabaseCode(databaseStateVersion, codeVersion) {
    if (!databaseStateVersion) {
      return false;
    }
    var stateMajor = databaseStateVersion.split(".")[0];
    var codeMajor = codeVersion.split(".")[0];
    if (stateMajor === "15" && codeMajor === "16") {
      return true;
    }
    if (stateMajor !== codeMajor) {
      return false;
    }
    return true;
  }
  async function addConnectedStorageToCollection(collection, storageCollectionName, schema) {
    if (collection.schema.version !== schema.version) {
      throw newRxError("SNH", {
        schema,
        version: collection.schema.version,
        name: collection.name,
        collection,
        args: {
          storageCollectionName
        }
      });
    }
    var collectionNameWithVersion = _collectionNamePrimary(collection.name, collection.schema.jsonSchema);
    var collectionDocId = getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION);
    while (true) {
      var collectionDoc = await getSingleDocument(collection.database.internalStore, collectionDocId);
      var saveData = clone(ensureNotFalsy(collectionDoc));
      var alreadyThere = saveData.data.connectedStorages.find((row) => row.collectionName === storageCollectionName && row.schema.version === schema.version);
      if (alreadyThere) {
        return;
      }
      saveData.data.connectedStorages.push({
        collectionName: storageCollectionName,
        schema
      });
      try {
        await writeSingle(collection.database.internalStore, {
          previous: ensureNotFalsy(collectionDoc),
          document: saveData
        }, "add-connected-storage-to-collection");
      } catch (err) {
        if (!isBulkWriteConflictError(err)) {
          throw err;
        }
      }
    }
  }
  function _collectionNamePrimary(name, schema) {
    return name + "-" + schema.version;
  }
  var INTERNAL_CONTEXT_COLLECTION, INTERNAL_CONTEXT_STORAGE_TOKEN, INTERNAL_CONTEXT_MIGRATION_STATUS, INTERNAL_CONTEXT_PIPELINE_CHECKPOINT, INTERNAL_STORE_SCHEMA_TITLE, INTERNAL_STORE_SCHEMA, STORAGE_TOKEN_DOCUMENT_KEY, STORAGE_TOKEN_DOCUMENT_ID;
  var init_rx_database_internal_store = __esm({
    "node_modules/rxdb/dist/esm/rx-database-internal-store.js"() {
      init_rx_error();
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_utils();
      init_rx_query_helper();
      INTERNAL_CONTEXT_COLLECTION = "collection";
      INTERNAL_CONTEXT_STORAGE_TOKEN = "storage-token";
      INTERNAL_CONTEXT_MIGRATION_STATUS = "rx-migration-status";
      INTERNAL_CONTEXT_PIPELINE_CHECKPOINT = "rx-pipeline-checkpoint";
      INTERNAL_STORE_SCHEMA_TITLE = "RxInternalDocument";
      INTERNAL_STORE_SCHEMA = fillWithDefaultSettings({
        version: 0,
        title: INTERNAL_STORE_SCHEMA_TITLE,
        primaryKey: {
          key: "id",
          fields: ["context", "key"],
          separator: "|"
        },
        type: "object",
        properties: {
          id: {
            type: "string",
            maxLength: 200
          },
          key: {
            type: "string"
          },
          context: {
            type: "string",
            enum: [INTERNAL_CONTEXT_COLLECTION, INTERNAL_CONTEXT_STORAGE_TOKEN, INTERNAL_CONTEXT_MIGRATION_STATUS, INTERNAL_CONTEXT_PIPELINE_CHECKPOINT, "OTHER"]
          },
          data: {
            type: "object",
            additionalProperties: true
          }
        },
        indexes: [],
        required: ["key", "context", "data"],
        additionalProperties: false,
        /**
         * If the sharding plugin is used,
         * it must not shard on the internal RxStorageInstance
         * because that one anyway has only a small amount of documents
         * and also its creation is in the hot path of the initial page load,
         * so we should spend less time creating multiple RxStorageInstances.
         */
        sharding: {
          shards: 1,
          mode: "collection"
        }
      });
      STORAGE_TOKEN_DOCUMENT_KEY = "storageToken";
      STORAGE_TOKEN_DOCUMENT_ID = getPrimaryKeyOfInternalDocument(STORAGE_TOKEN_DOCUMENT_KEY, INTERNAL_CONTEXT_STORAGE_TOKEN);
    }
  });

  // node_modules/rxdb/dist/esm/rx-collection-helper.js
  function fillObjectDataBeforeInsert(schema, data) {
    data = flatClone(data);
    data = fillObjectWithDefaults(schema, data);
    if (typeof schema.jsonSchema.primaryKey !== "string") {
      data = fillPrimaryKey(schema.primaryPath, schema.jsonSchema, data);
    }
    data._meta = getDefaultRxDocumentMeta();
    if (!Object.prototype.hasOwnProperty.call(data, "_deleted")) {
      data._deleted = false;
    }
    if (!Object.prototype.hasOwnProperty.call(data, "_attachments")) {
      data._attachments = {};
    }
    if (!Object.prototype.hasOwnProperty.call(data, "_rev")) {
      data._rev = getDefaultRevision();
    }
    return data;
  }
  async function createRxCollectionStorageInstance(rxDatabase, storageInstanceCreationParams) {
    storageInstanceCreationParams.multiInstance = rxDatabase.multiInstance;
    var storageInstance = await rxDatabase.storage.createStorageInstance(storageInstanceCreationParams);
    return storageInstance;
  }
  async function removeCollectionStorages(storage, databaseInternalStorage, databaseInstanceToken, databaseName, collectionName, multiInstance, password, hashFunction) {
    var allCollectionMetaDocs = await getAllCollectionDocuments(databaseInternalStorage);
    var relevantCollectionMetaDocs = allCollectionMetaDocs.filter((metaDoc) => metaDoc.data.name === collectionName);
    var removeStorages = [];
    relevantCollectionMetaDocs.forEach((metaDoc) => {
      removeStorages.push({
        collectionName: metaDoc.data.name,
        schema: metaDoc.data.schema,
        isCollection: true
      });
      metaDoc.data.connectedStorages.forEach((row) => removeStorages.push({
        collectionName: row.collectionName,
        isCollection: false,
        schema: row.schema
      }));
    });
    var alreadyAdded = /* @__PURE__ */ new Set();
    removeStorages = removeStorages.filter((row) => {
      var key = row.collectionName + "||" + row.schema.version;
      if (alreadyAdded.has(key)) {
        return false;
      } else {
        alreadyAdded.add(key);
        return true;
      }
    });
    await Promise.all(removeStorages.map(async (row) => {
      var storageInstance = await storage.createStorageInstance({
        collectionName: row.collectionName,
        databaseInstanceToken,
        databaseName,
        /**
         * multiInstance must be set to true if multiInstance
         * was true on the database
         * so that the storageInstance can inform other
         * instances about being removed.
         */
        multiInstance,
        options: {},
        schema: row.schema,
        password,
        devMode: overwritable.isDevMode()
      });
      await storageInstance.remove();
      if (row.isCollection) {
        await runAsyncPluginHooks("postRemoveRxCollection", {
          storage,
          databaseName,
          collectionName
        });
      }
    }));
    if (hashFunction) {
      var writeRows = relevantCollectionMetaDocs.map((doc) => {
        var writeDoc = flatCloneDocWithMeta(doc);
        writeDoc._deleted = true;
        writeDoc._meta.lwt = now();
        writeDoc._rev = createRevision(databaseInstanceToken, doc);
        return {
          previous: doc,
          document: writeDoc
        };
      });
      await databaseInternalStorage.bulkWrite(writeRows, "rx-database-remove-collection-all");
    }
  }
  function ensureRxCollectionIsNotClosed(collection) {
    if (collection.closed) {
      throw newRxError("COL21", {
        collection: collection.name,
        version: collection.schema.version
      });
    }
  }
  var init_rx_collection_helper = __esm({
    "node_modules/rxdb/dist/esm/rx-collection-helper.js"() {
      init_utils();
      init_rx_schema_helper();
      init_hooks();
      init_rx_database_internal_store();
      init_rx_storage_helper();
      init_overwritable();
      init_rx_error();
    }
  });

  // node_modules/rxdb/dist/esm/change-event-buffer.js
  function createChangeEventBuffer(collection) {
    return new ChangeEventBuffer(collection);
  }
  var ChangeEventBuffer;
  var init_change_event_buffer = __esm({
    "node_modules/rxdb/dist/esm/change-event-buffer.js"() {
      init_operators();
      init_utils();
      ChangeEventBuffer = /* @__PURE__ */ (function() {
        function ChangeEventBuffer2(collection) {
          this.subs = [];
          this.counter = 0;
          this.eventCounterMap = /* @__PURE__ */ new WeakMap();
          this.buffer = [];
          this.limit = 100;
          this.tasks = /* @__PURE__ */ new Set();
          this.collection = collection;
          this.subs.push(this.collection.eventBulks$.pipe(filter((bulk) => !bulk.isLocal)).subscribe((eventBulk) => {
            this.tasks.add(() => this._handleChangeEvents(eventBulk.events));
            if (this.tasks.size <= 1) {
              requestIdlePromiseNoQueue().then(() => {
                this.processTasks();
              });
            }
          }));
        }
        var _proto = ChangeEventBuffer2.prototype;
        _proto.processTasks = function processTasks() {
          if (this.tasks.size === 0) {
            return;
          }
          var tasks = Array.from(this.tasks);
          tasks.forEach((task) => task());
          this.tasks.clear();
        };
        _proto._handleChangeEvents = function _handleChangeEvents(events) {
          var counterBefore = this.counter;
          this.counter = this.counter + events.length;
          if (events.length > this.limit) {
            this.buffer = events.slice(events.length * -1);
          } else {
            appendToArray(this.buffer, events);
            this.buffer = this.buffer.slice(this.limit * -1);
          }
          var counterBase = counterBefore + 1;
          var eventCounterMap = this.eventCounterMap;
          for (var index = 0; index < events.length; index++) {
            var event = events[index];
            eventCounterMap.set(event, counterBase + index);
          }
        };
        _proto.getCounter = function getCounter() {
          this.processTasks();
          return this.counter;
        };
        _proto.getBuffer = function getBuffer() {
          this.processTasks();
          return this.buffer;
        };
        _proto.getArrayIndexByPointer = function getArrayIndexByPointer(pointer) {
          this.processTasks();
          var oldestEvent = this.buffer[0];
          var oldestCounter = this.eventCounterMap.get(oldestEvent);
          if (pointer < oldestCounter) return null;
          var rest = pointer - oldestCounter;
          return rest;
        };
        _proto.getFrom = function getFrom(pointer) {
          this.processTasks();
          var ret = [];
          var currentIndex = this.getArrayIndexByPointer(pointer);
          if (currentIndex === null)
            return null;
          while (true) {
            var nextEvent = this.buffer[currentIndex];
            currentIndex++;
            if (!nextEvent) {
              return ret;
            } else {
              ret.push(nextEvent);
            }
          }
        };
        _proto.runFrom = function runFrom(pointer, fn) {
          this.processTasks();
          var ret = this.getFrom(pointer);
          if (ret === null) {
            throw new Error("out of bounds");
          } else {
            ret.forEach((cE) => fn(cE));
          }
        };
        _proto.reduceByLastOfDoc = function reduceByLastOfDoc(changeEvents) {
          this.processTasks();
          return changeEvents.slice(0);
        };
        _proto.close = function close6() {
          this.tasks.clear();
          this.subs.forEach((sub) => sub.unsubscribe());
        };
        return ChangeEventBuffer2;
      })();
    }
  });

  // node_modules/rxdb/dist/esm/rx-document-prototype-merge.js
  function getDocumentPrototype(rxCollection) {
    var schemaProto = rxCollection.schema.getDocumentPrototype();
    var ormProto = getDocumentOrmPrototype(rxCollection);
    var baseProto = basePrototype;
    var proto = {};
    [schemaProto, ormProto, baseProto].forEach((obj) => {
      var props = Object.getOwnPropertyNames(obj);
      props.forEach((key) => {
        var desc = Object.getOwnPropertyDescriptor(obj, key);
        var enumerable = true;
        if (key.startsWith("_") || key.endsWith("_") || key.startsWith("$") || key.endsWith("$")) enumerable = false;
        if (typeof desc.value === "function") {
          Object.defineProperty(proto, key, {
            get() {
              return desc.value.bind(this);
            },
            enumerable,
            configurable: false
          });
        } else {
          desc.enumerable = enumerable;
          desc.configurable = false;
          if (desc.writable) desc.writable = false;
          Object.defineProperty(proto, key, desc);
        }
      });
    });
    return proto;
  }
  function getRxDocumentConstructor(rxCollection) {
    return getFromMapOrCreate(constructorForCollection, rxCollection, () => createRxDocumentConstructor(getDocumentPrototype(rxCollection)));
  }
  function createNewRxDocument(rxCollection, documentConstructor, docData) {
    var doc = createWithConstructor(documentConstructor, rxCollection, overwritable.deepFreezeWhenDevMode(docData));
    rxCollection._runHooksSync("post", "create", docData, doc);
    runPluginHooks("postCreateRxDocument", doc);
    return doc;
  }
  function getDocumentOrmPrototype(rxCollection) {
    var proto = {};
    Object.entries(rxCollection.methods).forEach(([k, v]) => {
      proto[k] = v;
    });
    return proto;
  }
  var constructorForCollection;
  var init_rx_document_prototype_merge = __esm({
    "node_modules/rxdb/dist/esm/rx-document-prototype-merge.js"() {
      init_rx_document();
      init_hooks();
      init_overwritable();
      init_utils();
      constructorForCollection = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/default-conflict-handler.js
  function addAttachmentsIfNotExists(d) {
    if (!d._attachments) {
      d = flatClone(d);
      d._attachments = {};
    }
    return d;
  }
  var defaultConflictHandler;
  var init_default_conflict_handler = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/default-conflict-handler.js"() {
      init_utils();
      init_rx_storage_helper();
      defaultConflictHandler = {
        isEqual(a, b, _ctx) {
          a = addAttachmentsIfNotExists(a);
          b = addAttachmentsIfNotExists(b);
          var ret = deepEqual(stripAttachmentsDataFromDocument(a), stripAttachmentsDataFromDocument(b));
          return ret;
        },
        resolve(i) {
          return i.realMasterState;
        }
      };
    }
  });

  // node_modules/rxdb/dist/esm/rx-collection.js
  function _applyHookFunctions(collection) {
    if (hooksApplied) return;
    hooksApplied = true;
    var colProto = Object.getPrototypeOf(collection);
    HOOKS_KEYS.forEach((key) => {
      HOOKS_WHEN.map((when) => {
        var fnName = when + ucfirst(key);
        colProto[fnName] = function(fun, parallel) {
          return this.addHook(when, key, fun, parallel);
        };
      });
    });
  }
  function _incrementalUpsertUpdate(doc, json) {
    return doc.incrementalModify((_innerDoc) => {
      return json;
    });
  }
  function _incrementalUpsertEnsureRxDocumentExists(rxCollection, primary, json) {
    var docDataFromCache = rxCollection._docCache.getLatestDocumentDataIfExists(primary);
    if (docDataFromCache) {
      return Promise.resolve({
        doc: rxCollection._docCache.getCachedRxDocuments([docDataFromCache])[0],
        inserted: false
      });
    }
    return rxCollection.findOne(primary).exec().then((doc) => {
      if (!doc) {
        return rxCollection.insert(json).then((newDoc) => ({
          doc: newDoc,
          inserted: true
        }));
      } else {
        return {
          doc,
          inserted: false
        };
      }
    });
  }
  async function createRxCollection({
    database,
    name,
    schema,
    instanceCreationOptions = {},
    migrationStrategies = {},
    autoMigrate = true,
    statics = {},
    methods = {},
    attachments = {},
    options = {},
    localDocuments = false,
    cacheReplacementPolicy = defaultCacheReplacementPolicy,
    conflictHandler = defaultConflictHandler
  }) {
    var storageInstanceCreationParams = {
      databaseInstanceToken: database.token,
      databaseName: database.name,
      collectionName: name,
      schema: schema.jsonSchema,
      options: instanceCreationOptions,
      multiInstance: database.multiInstance,
      password: database.password,
      devMode: overwritable.isDevMode()
    };
    runPluginHooks("preCreateRxStorageInstance", storageInstanceCreationParams);
    var storageInstance = await createRxCollectionStorageInstance(database, storageInstanceCreationParams);
    var collection = new RxCollectionBase(database, name, schema, storageInstance, instanceCreationOptions, migrationStrategies, methods, attachments, options, cacheReplacementPolicy, statics, conflictHandler);
    try {
      await collection.prepare();
      Object.entries(statics).forEach(([funName, fun]) => {
        Object.defineProperty(collection, funName, {
          get: () => fun.bind(collection)
        });
      });
      runPluginHooks("createRxCollection", {
        collection,
        creator: {
          name,
          schema,
          storageInstance,
          instanceCreationOptions,
          migrationStrategies,
          methods,
          attachments,
          options,
          cacheReplacementPolicy,
          localDocuments,
          statics
        }
      });
      if (autoMigrate && collection.schema.version !== 0) {
        await collection.migratePromise();
      }
    } catch (err) {
      OPEN_COLLECTIONS.delete(collection);
      await storageInstance.close();
      throw err;
    }
    return collection;
  }
  var HOOKS_WHEN, HOOKS_KEYS, hooksApplied, OPEN_COLLECTIONS, RxCollectionBase;
  var init_rx_collection = __esm({
    "node_modules/rxdb/dist/esm/rx-collection.js"() {
      init_createClass();
      init_esm5();
      init_utils();
      init_rx_collection_helper();
      init_rx_query();
      init_rx_error();
      init_doc_cache();
      init_query_cache();
      init_change_event_buffer();
      init_hooks();
      init_rx_document_prototype_merge();
      init_rx_storage_helper();
      init_incremental_write();
      init_rx_document();
      init_overwritable();
      init_default_conflict_handler();
      init_rx_change_event();
      HOOKS_WHEN = ["pre", "post"];
      HOOKS_KEYS = ["insert", "save", "remove", "create"];
      hooksApplied = false;
      OPEN_COLLECTIONS = /* @__PURE__ */ new Set();
      RxCollectionBase = /* @__PURE__ */ (function() {
        function RxCollectionBase2(database, name, schema, internalStorageInstance, instanceCreationOptions = {}, migrationStrategies = {}, methods = {}, attachments = {}, options = {}, cacheReplacementPolicy = defaultCacheReplacementPolicy, statics = {}, conflictHandler = defaultConflictHandler) {
          this.storageInstance = {};
          this.timeouts = /* @__PURE__ */ new Set();
          this.incrementalWriteQueue = {};
          this.awaitBeforeReads = /* @__PURE__ */ new Set();
          this._incrementalUpsertQueues = /* @__PURE__ */ new Map();
          this.synced = false;
          this.hooks = {};
          this._subs = [];
          this._docCache = {};
          this._queryCache = createQueryCache();
          this.$ = {};
          this.checkpoint$ = {};
          this._changeEventBuffer = {};
          this.eventBulks$ = {};
          this.onClose = [];
          this.closed = false;
          this.onRemove = [];
          this.database = database;
          this.name = name;
          this.schema = schema;
          this.internalStorageInstance = internalStorageInstance;
          this.instanceCreationOptions = instanceCreationOptions;
          this.migrationStrategies = migrationStrategies;
          this.methods = methods;
          this.attachments = attachments;
          this.options = options;
          this.cacheReplacementPolicy = cacheReplacementPolicy;
          this.statics = statics;
          this.conflictHandler = conflictHandler;
          _applyHookFunctions(this.asRxCollection);
          if (database) {
            this.eventBulks$ = database.eventBulks$.pipe(filter((changeEventBulk) => changeEventBulk.collectionName === this.name));
          } else {
          }
          if (this.database) {
            OPEN_COLLECTIONS.add(this);
          }
        }
        var _proto = RxCollectionBase2.prototype;
        _proto.prepare = async function prepare() {
          if (!await hasPremiumFlag()) {
            var count = 0;
            while (count < 10 && OPEN_COLLECTIONS.size > NON_PREMIUM_COLLECTION_LIMIT) {
              count++;
              await this.promiseWait(30);
            }
            if (OPEN_COLLECTIONS.size > NON_PREMIUM_COLLECTION_LIMIT) {
              throw newRxError("COL23", {
                database: this.database.name,
                collection: this.name,
                args: {
                  existing: Array.from(OPEN_COLLECTIONS.values()).map((c) => ({
                    db: c.database ? c.database.name : "",
                    c: c.name
                  }))
                }
              });
            }
          }
          this.storageInstance = getWrappedStorageInstance(this.database, this.internalStorageInstance, this.schema.jsonSchema);
          this.incrementalWriteQueue = new IncrementalWriteQueue(this.storageInstance, this.schema.primaryPath, (newData, oldData) => beforeDocumentUpdateWrite(this, newData, oldData), (result) => this._runHooks("post", "save", result));
          this.$ = this.eventBulks$.pipe(mergeMap((changeEventBulk) => rxChangeEventBulkToRxChangeEvents(changeEventBulk)));
          this.checkpoint$ = this.eventBulks$.pipe(map((changeEventBulk) => changeEventBulk.checkpoint));
          this._changeEventBuffer = createChangeEventBuffer(this.asRxCollection);
          var documentConstructor;
          this._docCache = new DocumentCache(this.schema.primaryPath, this.eventBulks$.pipe(filter((bulk) => !bulk.isLocal), map((bulk) => bulk.events)), (docData) => {
            if (!documentConstructor) {
              documentConstructor = getRxDocumentConstructor(this.asRxCollection);
            }
            return createNewRxDocument(this.asRxCollection, documentConstructor, docData);
          });
          var listenToRemoveSub = this.database.internalStore.changeStream().pipe(filter((bulk) => {
            var key = this.name + "-" + this.schema.version;
            var found = bulk.events.find((event) => {
              return event.documentData.context === "collection" && event.documentData.key === key && event.operation === "DELETE";
            });
            return !!found;
          })).subscribe(async () => {
            await this.close();
            await Promise.all(this.onRemove.map((fn) => fn()));
          });
          this._subs.push(listenToRemoveSub);
          var databaseStorageToken = await this.database.storageToken;
          var subDocs = this.storageInstance.changeStream().subscribe((eventBulk) => {
            var changeEventBulk = {
              id: eventBulk.id,
              isLocal: false,
              internal: false,
              collectionName: this.name,
              storageToken: databaseStorageToken,
              events: eventBulk.events,
              databaseToken: this.database.token,
              checkpoint: eventBulk.checkpoint,
              context: eventBulk.context
            };
            this.database.$emit(changeEventBulk);
          });
          this._subs.push(subDocs);
          return PROMISE_RESOLVE_VOID;
        };
        _proto.cleanup = function cleanup(_minimumDeletedTime) {
          ensureRxCollectionIsNotClosed(this);
          throw pluginMissing("cleanup");
        };
        _proto.migrationNeeded = function migrationNeeded() {
          throw pluginMissing("migration-schema");
        };
        _proto.getMigrationState = function getMigrationState() {
          throw pluginMissing("migration-schema");
        };
        _proto.startMigration = function startMigration(batchSize = 10) {
          ensureRxCollectionIsNotClosed(this);
          return this.getMigrationState().startMigration(batchSize);
        };
        _proto.migratePromise = function migratePromise(batchSize = 10) {
          return this.getMigrationState().migratePromise(batchSize);
        };
        _proto.insert = async function insert(json) {
          ensureRxCollectionIsNotClosed(this);
          var writeResult = await this.bulkInsert([json]);
          var isError = writeResult.error[0];
          throwIfIsStorageWriteError(this, json[this.schema.primaryPath], json, isError);
          var insertResult = ensureNotFalsy(writeResult.success[0]);
          return insertResult;
        };
        _proto.insertIfNotExists = async function insertIfNotExists(json) {
          var writeResult = await this.bulkInsert([json]);
          if (writeResult.error.length > 0) {
            var error = writeResult.error[0];
            if (error.status === 409) {
              var conflictDocData = error.documentInDb;
              return mapDocumentsDataToCacheDocs(this._docCache, [conflictDocData])[0];
            } else {
              throw error;
            }
          }
          return writeResult.success[0];
        };
        _proto.bulkInsert = async function bulkInsert(docsData) {
          ensureRxCollectionIsNotClosed(this);
          if (docsData.length === 0) {
            return {
              success: [],
              error: []
            };
          }
          var primaryPath = this.schema.primaryPath;
          var ids = /* @__PURE__ */ new Set();
          var insertRows;
          if (this.hasHooks("pre", "insert")) {
            insertRows = await Promise.all(docsData.map((docData2) => {
              var useDocData2 = fillObjectDataBeforeInsert(this.schema, docData2);
              return this._runHooks("pre", "insert", useDocData2).then(() => {
                ids.add(useDocData2[primaryPath]);
                return {
                  document: useDocData2
                };
              });
            }));
          } else {
            insertRows = new Array(docsData.length);
            var _schema = this.schema;
            for (var index = 0; index < docsData.length; index++) {
              var docData = docsData[index];
              var useDocData = fillObjectDataBeforeInsert(_schema, docData);
              ids.add(useDocData[primaryPath]);
              insertRows[index] = {
                document: useDocData
              };
            }
          }
          if (ids.size !== docsData.length) {
            throw newRxError("COL22", {
              collection: this.name,
              args: {
                documents: docsData
              }
            });
          }
          var results = await this.storageInstance.bulkWrite(insertRows, "rx-collection-bulk-insert");
          var rxDocuments;
          var collection = this;
          var ret = {
            get success() {
              if (!rxDocuments) {
                var success = getWrittenDocumentsFromBulkWriteResponse(collection.schema.primaryPath, insertRows, results);
                rxDocuments = mapDocumentsDataToCacheDocs(collection._docCache, success);
              }
              return rxDocuments;
            },
            error: results.error
          };
          if (this.hasHooks("post", "insert")) {
            var docsMap = /* @__PURE__ */ new Map();
            insertRows.forEach((row) => {
              var doc = row.document;
              docsMap.set(doc[primaryPath], doc);
            });
            await Promise.all(ret.success.map((doc) => {
              return this._runHooks("post", "insert", docsMap.get(doc.primary), doc);
            }));
          }
          return ret;
        };
        _proto.bulkRemove = async function bulkRemove(idsOrDocs) {
          ensureRxCollectionIsNotClosed(this);
          var primaryPath = this.schema.primaryPath;
          if (idsOrDocs.length === 0) {
            return {
              success: [],
              error: []
            };
          }
          var rxDocumentMap;
          if (typeof idsOrDocs[0] === "string") {
            rxDocumentMap = await this.findByIds(idsOrDocs).exec();
          } else {
            rxDocumentMap = /* @__PURE__ */ new Map();
            idsOrDocs.forEach((d) => rxDocumentMap.set(d.primary, d));
          }
          var docsData = [];
          var docsMap = /* @__PURE__ */ new Map();
          Array.from(rxDocumentMap.values()).forEach((rxDocument) => {
            var data = rxDocument.toMutableJSON(true);
            docsData.push(data);
            docsMap.set(rxDocument.primary, data);
          });
          await Promise.all(docsData.map((doc) => {
            var primary = doc[this.schema.primaryPath];
            return this._runHooks("pre", "remove", doc, rxDocumentMap.get(primary));
          }));
          var removeDocs = docsData.map((doc) => {
            var writeDoc = flatClone(doc);
            writeDoc._deleted = true;
            return {
              previous: doc,
              document: writeDoc
            };
          });
          var results = await this.storageInstance.bulkWrite(removeDocs, "rx-collection-bulk-remove");
          var success = getWrittenDocumentsFromBulkWriteResponse(this.schema.primaryPath, removeDocs, results);
          var deletedRxDocuments = [];
          var successIds = success.map((d) => {
            var id = d[primaryPath];
            var doc = this._docCache.getCachedRxDocument(d);
            deletedRxDocuments.push(doc);
            return id;
          });
          await Promise.all(successIds.map((id) => {
            return this._runHooks("post", "remove", docsMap.get(id), rxDocumentMap.get(id));
          }));
          return {
            success: deletedRxDocuments,
            error: results.error
          };
        };
        _proto.bulkUpsert = async function bulkUpsert(docsData) {
          ensureRxCollectionIsNotClosed(this);
          var insertData = [];
          var useJsonByDocId = /* @__PURE__ */ new Map();
          docsData.forEach((docData) => {
            var useJson = fillObjectDataBeforeInsert(this.schema, docData);
            var primary = useJson[this.schema.primaryPath];
            if (!primary) {
              throw newRxError("COL3", {
                primaryPath: this.schema.primaryPath,
                data: useJson,
                schema: this.schema.jsonSchema
              });
            }
            useJsonByDocId.set(primary, useJson);
            insertData.push(useJson);
          });
          var insertResult = await this.bulkInsert(insertData);
          var success = insertResult.success.slice(0);
          var error = [];
          await Promise.all(insertResult.error.map(async (err) => {
            if (err.status !== 409) {
              error.push(err);
            } else {
              var id = err.documentId;
              var writeData = getFromMapOrThrow(useJsonByDocId, id);
              var docDataInDb = ensureNotFalsy(err.documentInDb);
              var doc = this._docCache.getCachedRxDocuments([docDataInDb])[0];
              var newDoc = await doc.incrementalModify(() => writeData);
              success.push(newDoc);
            }
          }));
          return {
            error,
            success
          };
        };
        _proto.upsert = async function upsert(json) {
          ensureRxCollectionIsNotClosed(this);
          var bulkResult = await this.bulkUpsert([json]);
          throwIfIsStorageWriteError(this.asRxCollection, json[this.schema.primaryPath], json, bulkResult.error[0]);
          return bulkResult.success[0];
        };
        _proto.incrementalUpsert = function incrementalUpsert(json) {
          ensureRxCollectionIsNotClosed(this);
          var useJson = fillObjectDataBeforeInsert(this.schema, json);
          var primary = useJson[this.schema.primaryPath];
          if (!primary) {
            throw newRxError("COL4", {
              data: json
            });
          }
          var queue = this._incrementalUpsertQueues.get(primary);
          if (!queue) {
            queue = PROMISE_RESOLVE_VOID;
          }
          queue = queue.then(() => _incrementalUpsertEnsureRxDocumentExists(this, primary, useJson)).then((wasInserted) => {
            if (!wasInserted.inserted) {
              return _incrementalUpsertUpdate(wasInserted.doc, useJson);
            } else {
              return wasInserted.doc;
            }
          });
          this._incrementalUpsertQueues.set(primary, queue);
          return queue;
        };
        _proto.find = function find(queryObj) {
          ensureRxCollectionIsNotClosed(this);
          runPluginHooks("prePrepareRxQuery", {
            op: "find",
            queryObj,
            collection: this
          });
          if (!queryObj) {
            queryObj = _getDefaultQuery();
          }
          var query = createRxQuery("find", queryObj, this);
          return query;
        };
        _proto.findOne = function findOne(queryObj) {
          ensureRxCollectionIsNotClosed(this);
          runPluginHooks("prePrepareRxQuery", {
            op: "findOne",
            queryObj,
            collection: this
          });
          var query;
          if (typeof queryObj === "string") {
            query = createRxQuery("findOne", {
              selector: {
                [this.schema.primaryPath]: queryObj
              },
              limit: 1
            }, this);
          } else {
            if (!queryObj) {
              queryObj = _getDefaultQuery();
            }
            if (queryObj.limit) {
              throw newRxError("QU6");
            }
            queryObj = flatClone(queryObj);
            queryObj.limit = 1;
            query = createRxQuery("findOne", queryObj, this);
          }
          return query;
        };
        _proto.count = function count(queryObj) {
          ensureRxCollectionIsNotClosed(this);
          if (!queryObj) {
            queryObj = _getDefaultQuery();
          }
          var query = createRxQuery("count", queryObj, this);
          return query;
        };
        _proto.findByIds = function findByIds(ids) {
          ensureRxCollectionIsNotClosed(this);
          var mangoQuery = {
            selector: {
              [this.schema.primaryPath]: {
                $in: ids.slice(0)
              }
            }
          };
          var query = createRxQuery("findByIds", mangoQuery, this);
          return query;
        };
        _proto.exportJSON = function exportJSON() {
          throw pluginMissing("json-dump");
        };
        _proto.importJSON = function importJSON(_exportedJSON) {
          throw pluginMissing("json-dump");
        };
        _proto.insertCRDT = function insertCRDT(_updateObj) {
          throw pluginMissing("crdt");
        };
        _proto.addPipeline = function addPipeline(_options4) {
          throw pluginMissing("pipeline");
        };
        _proto.addHook = function addHook(when, key, fun, parallel = false) {
          if (typeof fun !== "function") {
            throw newRxTypeError("COL7", {
              key,
              when
            });
          }
          if (!HOOKS_WHEN.includes(when)) {
            throw newRxTypeError("COL8", {
              key,
              when
            });
          }
          if (!HOOKS_KEYS.includes(key)) {
            throw newRxError("COL9", {
              key
            });
          }
          if (when === "post" && key === "create" && parallel === true) {
            throw newRxError("COL10", {
              when,
              key,
              parallel
            });
          }
          var boundFun = fun.bind(this);
          var runName = parallel ? "parallel" : "series";
          this.hooks[key] = this.hooks[key] || {};
          this.hooks[key][when] = this.hooks[key][when] || {
            series: [],
            parallel: []
          };
          this.hooks[key][when][runName].push(boundFun);
        };
        _proto.getHooks = function getHooks(when, key) {
          if (!this.hooks[key] || !this.hooks[key][when]) {
            return {
              series: [],
              parallel: []
            };
          }
          return this.hooks[key][when];
        };
        _proto.hasHooks = function hasHooks(when, key) {
          if (!this.hooks[key] || !this.hooks[key][when]) {
            return false;
          }
          var hooks = this.getHooks(when, key);
          if (!hooks) {
            return false;
          }
          return hooks.series.length > 0 || hooks.parallel.length > 0;
        };
        _proto._runHooks = function _runHooks(when, key, data, instance) {
          var hooks = this.getHooks(when, key);
          if (!hooks) {
            return PROMISE_RESOLVE_VOID;
          }
          var tasks = hooks.series.map((hook) => () => hook(data, instance));
          return promiseSeries(tasks).then(() => Promise.all(hooks.parallel.map((hook) => hook(data, instance))));
        };
        _proto._runHooksSync = function _runHooksSync(when, key, data, instance) {
          if (!this.hasHooks(when, key)) {
            return;
          }
          var hooks = this.getHooks(when, key);
          if (!hooks) return;
          hooks.series.forEach((hook) => hook(data, instance));
        };
        _proto.promiseWait = function promiseWait2(time) {
          var ret = new Promise((res) => {
            var timeout = setTimeout(() => {
              this.timeouts.delete(timeout);
              res();
            }, time);
            this.timeouts.add(timeout);
          });
          return ret;
        };
        _proto.close = async function close6() {
          if (this.closed) {
            return PROMISE_RESOLVE_FALSE;
          }
          OPEN_COLLECTIONS.delete(this);
          await Promise.all(this.onClose.map((fn) => fn()));
          this.closed = true;
          Array.from(this.timeouts).forEach((timeout) => clearTimeout(timeout));
          if (this._changeEventBuffer) {
            this._changeEventBuffer.close();
          }
          return this.database.requestIdlePromise().then(() => this.storageInstance.close()).then(() => {
            this._subs.forEach((sub) => sub.unsubscribe());
            delete this.database.collections[this.name];
            return runAsyncPluginHooks("postCloseRxCollection", this).then(() => true);
          });
        };
        _proto.remove = async function remove2() {
          await this.close();
          await Promise.all(this.onRemove.map((fn) => fn()));
          await removeCollectionStorages(this.database.storage, this.database.internalStore, this.database.token, this.database.name, this.name, this.database.multiInstance, this.database.password, this.database.hashFunction);
        };
        return _createClass(RxCollectionBase2, [{
          key: "insert$",
          get: function() {
            return this.$.pipe(filter((cE) => cE.operation === "INSERT"));
          }
        }, {
          key: "update$",
          get: function() {
            return this.$.pipe(filter((cE) => cE.operation === "UPDATE"));
          }
        }, {
          key: "remove$",
          get: function() {
            return this.$.pipe(filter((cE) => cE.operation === "DELETE"));
          }
          // defaults
          /**
           * Internally only use eventBulks$
           * Do not use .$ or .observable$ because that has to transform
           * the events which decreases performance.
           */
          /**
           * When the collection is closed,
           * these functions will be called an awaited.
           * Used to automatically clean up stuff that
           * belongs to this collection.
          */
        }, {
          key: "asRxCollection",
          get: function() {
            return this;
          }
        }]);
      })();
    }
  });

  // node_modules/custom-idle-queue/dist/es/index.js
  function _resolveOneIdleCall(idleQueue) {
    if (idleQueue._iC.size === 0) return;
    var iterator2 = idleQueue._iC.values();
    var oldestPromise = iterator2.next().value;
    oldestPromise._manRes();
    setTimeout(function() {
      return _tryIdleCall(idleQueue);
    }, 0);
  }
  function _removeIdlePromise(idleQueue, promise) {
    if (!promise) return;
    if (promise._timeoutObj) clearTimeout(promise._timeoutObj);
    if (idleQueue._pHM.has(promise)) {
      var handle = idleQueue._pHM.get(promise);
      idleQueue._hPM["delete"](handle);
      idleQueue._pHM["delete"](promise);
    }
    idleQueue._iC["delete"](promise);
  }
  function _tryIdleCall(idleQueue) {
    if (idleQueue._tryIR || idleQueue._iC.size === 0) return;
    idleQueue._tryIR = true;
    setTimeout(function() {
      if (!idleQueue.isIdle()) {
        idleQueue._tryIR = false;
        return;
      }
      setTimeout(function() {
        if (!idleQueue.isIdle()) {
          idleQueue._tryIR = false;
          return;
        }
        _resolveOneIdleCall(idleQueue);
        idleQueue._tryIR = false;
      }, 0);
    }, 0);
  }
  var IdleQueue;
  var init_es = __esm({
    "node_modules/custom-idle-queue/dist/es/index.js"() {
      IdleQueue = function IdleQueue2() {
        var parallels = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1;
        this._parallels = parallels || 1;
        this._qC = 0;
        this._iC = /* @__PURE__ */ new Set();
        this._lHN = 0;
        this._hPM = /* @__PURE__ */ new Map();
        this._pHM = /* @__PURE__ */ new Map();
      };
      IdleQueue.prototype = {
        isIdle: function isIdle() {
          return this._qC < this._parallels;
        },
        /**
         * creates a lock in the queue
         * and returns an unlock-function to remove the lock from the queue
         * @return {function} unlock function than must be called afterwards
         */
        lock: function lock() {
          this._qC++;
        },
        unlock: function unlock() {
          this._qC--;
          _tryIdleCall(this);
        },
        /**
         * wraps a function with lock/unlock and runs it
         * @performance is really important here because
         * it is often used in hot paths.
         * @param  {function}  fun
         * @return {Promise<any>}
         */
        wrapCall: function wrapCall(fun) {
          var _this = this;
          this._qC++;
          var maybePromise;
          try {
            maybePromise = fun();
          } catch (err) {
            this.unlock();
            throw err;
          }
          if (!maybePromise.then || typeof maybePromise.then !== "function") {
            this.unlock();
            return maybePromise;
          } else {
            return maybePromise.then(function(ret) {
              _this.unlock();
              return ret;
            })["catch"](function(err) {
              _this.unlock();
              throw err;
            });
          }
        },
        /**
         * does the same as requestIdleCallback() but uses promises instead of the callback
         * @param {{timeout?: number}} options like timeout
         * @return {Promise<void>} promise that resolves when the database is in idle-mode
         */
        requestIdlePromise: function requestIdlePromise2(options) {
          var _this2 = this;
          options = options || {};
          var resolve2;
          var prom = new Promise(function(res) {
            return resolve2 = res;
          });
          var resolveFromOutside = function resolveFromOutside2() {
            _removeIdlePromise(_this2, prom);
            resolve2();
          };
          prom._manRes = resolveFromOutside;
          if (options.timeout) {
            var timeoutObj = setTimeout(function() {
              prom._manRes();
            }, options.timeout);
            prom._timeoutObj = timeoutObj;
          }
          this._iC.add(prom);
          _tryIdleCall(this);
          return prom;
        },
        /**
         * remove the promise so it will never be resolved
         * @param  {Promise} promise from requestIdlePromise()
         * @return {void}
         */
        cancelIdlePromise: function cancelIdlePromise(promise) {
          _removeIdlePromise(this, promise);
        },
        /**
         * api equal to
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
         * @param  {Function} callback
         * @param  {options}   options  [description]
         * @return {number} handle which can be used with cancelIdleCallback()
         */
        requestIdleCallback: function requestIdleCallback2(callback, options) {
          var handle = this._lHN++;
          var promise = this.requestIdlePromise(options);
          this._hPM.set(handle, promise);
          this._pHM.set(promise, handle);
          promise.then(function() {
            return callback();
          });
          return handle;
        },
        /**
         * API equal to
         * @link https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelIdleCallback
         * @param  {number} handle returned from requestIdleCallback()
         * @return {void}
         */
        cancelIdleCallback: function cancelIdleCallback(handle) {
          var promise = this._hPM.get(handle);
          this.cancelIdlePromise(promise);
        },
        /**
         * clears and resets everything
         * @return {void}
         */
        clear: function clear() {
          var _this3 = this;
          this._iC.forEach(function(promise) {
            return _removeIdlePromise(_this3, promise);
          });
          this._qC = 0;
          this._iC.clear();
          this._hPM = /* @__PURE__ */ new Map();
          this._pHM = /* @__PURE__ */ new Map();
        }
      };
    }
  });

  // node_modules/oblivious-set/dist/esm/src/index.js
  function removeTooOldValues(obliviousSet) {
    const olderThen = now2() - obliviousSet.ttl;
    const iterator2 = obliviousSet.map[Symbol.iterator]();
    while (true) {
      const next = iterator2.next().value;
      if (!next) {
        return;
      }
      const value = next[0];
      const time = next[1];
      if (time < olderThen) {
        obliviousSet.map.delete(value);
      } else {
        return;
      }
    }
  }
  function now2() {
    return Date.now();
  }
  var ObliviousSet;
  var init_src3 = __esm({
    "node_modules/oblivious-set/dist/esm/src/index.js"() {
      ObliviousSet = class {
        constructor(ttl) {
          __publicField(this, "ttl");
          __publicField(this, "map", /* @__PURE__ */ new Map());
          /**
           * Creating calls to setTimeout() is expensive,
           * so we only do that if there is not timeout already open.
           */
          __publicField(this, "_to", false);
          this.ttl = ttl;
        }
        has(value) {
          return this.map.has(value);
        }
        add(value) {
          this.map.set(value, now2());
          if (!this._to) {
            this._to = true;
            setTimeout(() => {
              this._to = false;
              removeTooOldValues(this);
            }, 0);
          }
        }
        clear() {
          this.map.clear();
        }
      };
    }
  });

  // node_modules/rxdb/dist/esm/rx-database.js
  function throwIfDatabaseNameUsed(name, storage) {
    if (USED_DATABASE_NAMES.has(getDatabaseNameKey(name, storage))) {
      throw newRxError("DB8", {
        name,
        storage: storage.name,
        link: "https://rxdb.info/rx-database.html#ignoreduplicate"
      });
    }
  }
  function createPromiseWithResolvers() {
    var resolve2;
    var reject;
    var promise = new Promise((res, rej) => {
      resolve2 = res;
      reject = rej;
    });
    return {
      promise,
      resolve: resolve2,
      reject
    };
  }
  function getDatabaseNameKey(name, storage) {
    return storage.name + "|" + name;
  }
  async function createRxDatabaseStorageInstance(databaseInstanceToken, storage, databaseName, options, multiInstance, password) {
    var internalStore = await storage.createStorageInstance({
      databaseInstanceToken,
      databaseName,
      collectionName: INTERNAL_STORAGE_NAME,
      schema: INTERNAL_STORE_SCHEMA,
      options,
      multiInstance,
      password,
      devMode: overwritable.isDevMode()
    });
    return internalStore;
  }
  function createRxDatabase({
    storage,
    instanceCreationOptions,
    name,
    password,
    multiInstance = true,
    eventReduce = true,
    ignoreDuplicate = false,
    options = {},
    cleanupPolicy,
    closeDuplicates = false,
    allowSlowCount = false,
    localDocuments = false,
    hashFunction = defaultHashSha256,
    reactivity
  }) {
    runPluginHooks("preCreateRxDatabase", {
      storage,
      instanceCreationOptions,
      name,
      password,
      multiInstance,
      eventReduce,
      ignoreDuplicate,
      options,
      localDocuments
    });
    var databaseNameKey = getDatabaseNameKey(name, storage);
    var databaseNameKeyUnclosedInstancesSet = DATABASE_UNCLOSED_INSTANCE_PROMISE_MAP.get(databaseNameKey) || /* @__PURE__ */ new Set();
    var instancePromiseWithResolvers = createPromiseWithResolvers();
    var closeDuplicatesPromises = Array.from(databaseNameKeyUnclosedInstancesSet);
    var onInstanceClosed = () => {
      databaseNameKeyUnclosedInstancesSet.delete(instancePromiseWithResolvers.promise);
      USED_DATABASE_NAMES.delete(databaseNameKey);
    };
    databaseNameKeyUnclosedInstancesSet.add(instancePromiseWithResolvers.promise);
    DATABASE_UNCLOSED_INSTANCE_PROMISE_MAP.set(databaseNameKey, databaseNameKeyUnclosedInstancesSet);
    (async () => {
      if (closeDuplicates) {
        await Promise.all(closeDuplicatesPromises.map((unclosedInstancePromise) => unclosedInstancePromise.catch(() => null).then((instance) => instance && instance.close())));
      }
      if (ignoreDuplicate) {
        if (!overwritable.isDevMode()) {
          throw newRxError("DB9", {
            database: name
          });
        }
      } else {
        throwIfDatabaseNameUsed(name, storage);
      }
      USED_DATABASE_NAMES.add(databaseNameKey);
      var databaseInstanceToken = randomToken(10);
      var storageInstance = await createRxDatabaseStorageInstance(databaseInstanceToken, storage, name, instanceCreationOptions, multiInstance, password);
      var rxDatabase = new RxDatabaseBase(name, databaseInstanceToken, storage, instanceCreationOptions, password, multiInstance, eventReduce, options, storageInstance, hashFunction, cleanupPolicy, allowSlowCount, reactivity, onInstanceClosed);
      await runAsyncPluginHooks("createRxDatabase", {
        database: rxDatabase,
        creator: {
          storage,
          instanceCreationOptions,
          name,
          password,
          multiInstance,
          eventReduce,
          ignoreDuplicate,
          options,
          localDocuments
        }
      });
      return rxDatabase;
    })().then((rxDatabase) => {
      instancePromiseWithResolvers.resolve(rxDatabase);
    }).catch((err) => {
      instancePromiseWithResolvers.reject(err);
      onInstanceClosed();
    });
    return instancePromiseWithResolvers.promise;
  }
  async function removeRxDatabase(databaseName, storage, multiInstance = true, password) {
    var databaseInstanceToken = randomToken(10);
    var dbInternalsStorageInstance = await createRxDatabaseStorageInstance(databaseInstanceToken, storage, databaseName, {}, multiInstance, password);
    var collectionDocs = await getAllCollectionDocuments(dbInternalsStorageInstance);
    var collectionNames = /* @__PURE__ */ new Set();
    collectionDocs.forEach((doc) => collectionNames.add(doc.data.name));
    var removedCollectionNames = Array.from(collectionNames);
    await Promise.all(removedCollectionNames.map((collectionName) => removeCollectionStorages(storage, dbInternalsStorageInstance, databaseInstanceToken, databaseName, collectionName, multiInstance, password)));
    await runAsyncPluginHooks("postRemoveRxDatabase", {
      databaseName,
      storage
    });
    await dbInternalsStorageInstance.remove();
    return removedCollectionNames;
  }
  function isRxDatabase(obj) {
    return obj instanceof RxDatabaseBase;
  }
  async function ensureNoStartupErrors(rxDatabase) {
    await rxDatabase.storageToken;
    if (rxDatabase.startupErrors[0]) {
      throw rxDatabase.startupErrors[0];
    }
  }
  var USED_DATABASE_NAMES, DATABASE_UNCLOSED_INSTANCE_PROMISE_MAP, DB_COUNT, RxDatabaseBase;
  var init_rx_database = __esm({
    "node_modules/rxdb/dist/esm/rx-database.js"() {
      init_createClass();
      init_es();
      init_src3();
      init_utils();
      init_rx_error();
      init_rx_schema();
      init_hooks();
      init_esm5();
      init_operators();
      init_rx_collection();
      init_rx_storage_helper();
      init_rx_database_internal_store();
      init_rx_collection_helper();
      init_overwritable();
      init_rx_change_event();
      USED_DATABASE_NAMES = /* @__PURE__ */ new Set();
      DATABASE_UNCLOSED_INSTANCE_PROMISE_MAP = /* @__PURE__ */ new Map();
      DB_COUNT = 0;
      RxDatabaseBase = /* @__PURE__ */ (function() {
        function RxDatabaseBase2(name, token, storage, instanceCreationOptions, password, multiInstance, eventReduce = false, options = {}, internalStore, hashFunction, cleanupPolicy, allowSlowCount, reactivity, onClosed) {
          this.idleQueue = new IdleQueue();
          this.rxdbVersion = RXDB_VERSION;
          this.storageInstances = /* @__PURE__ */ new Set();
          this._subs = [];
          this.startupErrors = [];
          this.onClose = [];
          this.closed = false;
          this.collections = {};
          this.states = {};
          this.eventBulks$ = new Subject();
          this.closePromise = null;
          this.observable$ = this.eventBulks$.pipe(mergeMap((changeEventBulk) => rxChangeEventBulkToRxChangeEvents(changeEventBulk)));
          this.storageToken = PROMISE_RESOLVE_FALSE;
          this.storageTokenDocument = PROMISE_RESOLVE_FALSE;
          this.emittedEventBulkIds = new ObliviousSet(60 * 1e3);
          this.name = name;
          this.token = token;
          this.storage = storage;
          this.instanceCreationOptions = instanceCreationOptions;
          this.password = password;
          this.multiInstance = multiInstance;
          this.eventReduce = eventReduce;
          this.options = options;
          this.internalStore = internalStore;
          this.hashFunction = hashFunction;
          this.cleanupPolicy = cleanupPolicy;
          this.allowSlowCount = allowSlowCount;
          this.reactivity = reactivity;
          this.onClosed = onClosed;
          DB_COUNT++;
          if (this.name !== "pseudoInstance") {
            this.internalStore = getWrappedStorageInstance(this.asRxDatabase, internalStore, INTERNAL_STORE_SCHEMA);
            this.storageTokenDocument = ensureStorageTokenDocumentExists(this.asRxDatabase).catch((err) => this.startupErrors.push(err));
            this.storageToken = this.storageTokenDocument.then((doc) => doc.data.token).catch((err) => this.startupErrors.push(err));
          }
        }
        var _proto = RxDatabaseBase2.prototype;
        _proto.getReactivityFactory = function getReactivityFactory() {
          if (!this.reactivity) {
            throw newRxError("DB14", {
              database: this.name
            });
          }
          return this.reactivity;
        };
        _proto.$emit = function $emit(changeEventBulk) {
          if (this.emittedEventBulkIds.has(changeEventBulk.id)) {
            return;
          }
          this.emittedEventBulkIds.add(changeEventBulk.id);
          this.eventBulks$.next(changeEventBulk);
        };
        _proto.removeCollectionDoc = async function removeCollectionDoc(name, schema) {
          var doc = await getSingleDocument(this.internalStore, getPrimaryKeyOfInternalDocument(_collectionNamePrimary(name, schema), INTERNAL_CONTEXT_COLLECTION));
          if (!doc) {
            throw newRxError("SNH", {
              name,
              schema
            });
          }
          var writeDoc = flatCloneDocWithMeta(doc);
          writeDoc._deleted = true;
          await this.internalStore.bulkWrite([{
            document: writeDoc,
            previous: doc
          }], "rx-database-remove-collection");
        };
        _proto.addCollections = async function addCollections(collectionCreators) {
          var jsonSchemas = {};
          var schemas = {};
          var bulkPutDocs = [];
          var useArgsByCollectionName = {};
          await Promise.all(Object.entries(collectionCreators).map(async ([name, args]) => {
            var collectionName = name;
            var rxJsonSchema = args.schema;
            jsonSchemas[collectionName] = rxJsonSchema;
            var schema = createRxSchema(rxJsonSchema, this.hashFunction);
            schemas[collectionName] = schema;
            if (this.collections[name]) {
              throw newRxError("DB3", {
                name
              });
            }
            var collectionNameWithVersion = _collectionNamePrimary(name, rxJsonSchema);
            var collectionDocData = {
              id: getPrimaryKeyOfInternalDocument(collectionNameWithVersion, INTERNAL_CONTEXT_COLLECTION),
              key: collectionNameWithVersion,
              context: INTERNAL_CONTEXT_COLLECTION,
              data: {
                name: collectionName,
                schemaHash: await schema.hash,
                schema: schema.jsonSchema,
                version: schema.version,
                connectedStorages: []
              },
              _deleted: false,
              _meta: getDefaultRxDocumentMeta(),
              _rev: getDefaultRevision(),
              _attachments: {}
            };
            bulkPutDocs.push({
              document: collectionDocData
            });
            var useArgs = Object.assign({}, args, {
              name: collectionName,
              schema,
              database: this
            });
            var hookData = flatClone(args);
            hookData.database = this;
            hookData.name = name;
            runPluginHooks("preCreateRxCollection", hookData);
            useArgs.conflictHandler = hookData.conflictHandler;
            useArgsByCollectionName[collectionName] = useArgs;
          }));
          var putDocsResult = await this.internalStore.bulkWrite(bulkPutDocs, "rx-database-add-collection");
          await ensureNoStartupErrors(this);
          await Promise.all(putDocsResult.error.map(async (error) => {
            if (error.status !== 409) {
              throw newRxError("DB12", {
                database: this.name,
                writeError: error
              });
            }
            var docInDb = ensureNotFalsy(error.documentInDb);
            var collectionName = docInDb.data.name;
            var schema = schemas[collectionName];
            if (docInDb.data.schemaHash !== await schema.hash) {
              throw newRxError("DB6", {
                database: this.name,
                collection: collectionName,
                previousSchemaHash: docInDb.data.schemaHash,
                schemaHash: await schema.hash,
                previousSchema: docInDb.data.schema,
                schema: ensureNotFalsy(jsonSchemas[collectionName])
              });
            }
          }));
          var ret = {};
          await Promise.all(Object.keys(collectionCreators).map(async (collectionName) => {
            var useArgs = useArgsByCollectionName[collectionName];
            var collection = await createRxCollection(useArgs);
            ret[collectionName] = collection;
            this.collections[collectionName] = collection;
            if (!this[collectionName]) {
              Object.defineProperty(this, collectionName, {
                get: () => this.collections[collectionName]
              });
            }
          }));
          return ret;
        };
        _proto.lockedRun = function lockedRun(fn) {
          return this.idleQueue.wrapCall(fn);
        };
        _proto.requestIdlePromise = function requestIdlePromise3() {
          return this.idleQueue.requestIdlePromise();
        };
        _proto.exportJSON = function exportJSON(_collections) {
          throw pluginMissing("json-dump");
        };
        _proto.addState = function addState(_name) {
          throw pluginMissing("state");
        };
        _proto.importJSON = function importJSON(_exportedJSON) {
          throw pluginMissing("json-dump");
        };
        _proto.backup = function backup(_options4) {
          throw pluginMissing("backup");
        };
        _proto.leaderElector = function leaderElector() {
          throw pluginMissing("leader-election");
        };
        _proto.isLeader = function isLeader() {
          throw pluginMissing("leader-election");
        };
        _proto.waitForLeadership = function waitForLeadership() {
          throw pluginMissing("leader-election");
        };
        _proto.migrationStates = function migrationStates() {
          throw pluginMissing("migration-schema");
        };
        _proto.close = function close6() {
          if (this.closePromise) {
            return this.closePromise;
          }
          var {
            promise,
            resolve: resolve2
          } = createPromiseWithResolvers();
          var resolveClosePromise = (result) => {
            if (this.onClosed) {
              this.onClosed();
            }
            this.closed = true;
            resolve2(result);
          };
          this.closePromise = promise;
          (async () => {
            await runAsyncPluginHooks("preCloseRxDatabase", this);
            this.eventBulks$.complete();
            DB_COUNT--;
            this._subs.map((sub) => sub.unsubscribe());
            if (this.name === "pseudoInstance") {
              resolveClosePromise(false);
              return;
            }
            return this.requestIdlePromise().then(() => Promise.all(this.onClose.map((fn) => fn()))).then(() => Promise.all(Object.keys(this.collections).map((key) => this.collections[key]).map((col) => col.close()))).then(() => this.internalStore.close()).then(() => resolveClosePromise(true));
          })();
          return promise;
        };
        _proto.remove = function remove2() {
          return this.close().then(() => removeRxDatabase(this.name, this.storage, this.multiInstance, this.password));
        };
        return _createClass(RxDatabaseBase2, [{
          key: "$",
          get: function() {
            return this.observable$;
          }
        }, {
          key: "asRxDatabase",
          get: function() {
            return this;
          }
        }]);
      })();
    }
  });

  // node_modules/rxdb/dist/esm/plugin.js
  function addRxPlugin(plugin) {
    runPluginHooks("preAddRxPlugin", {
      plugin,
      plugins: ADDED_PLUGINS
    });
    if (ADDED_PLUGINS.has(plugin)) {
      return;
    } else {
      if (ADDED_PLUGIN_NAMES.has(plugin.name)) {
        throw newRxError("PL3", {
          name: plugin.name,
          plugin
        });
      }
      ADDED_PLUGINS.add(plugin);
      ADDED_PLUGIN_NAMES.add(plugin.name);
    }
    if (!plugin.rxdb) {
      throw newRxTypeError("PL1", {
        plugin
      });
    }
    if (plugin.init) {
      plugin.init();
    }
    if (plugin.prototypes) {
      Object.entries(plugin.prototypes).forEach(([name, fun]) => {
        return fun(PROTOTYPES[name]);
      });
    }
    if (plugin.overwritable) {
      Object.assign(overwritable, plugin.overwritable);
    }
    if (plugin.hooks) {
      Object.entries(plugin.hooks).forEach(([name, hooksObj]) => {
        if (hooksObj.after) {
          HOOKS[name].push(hooksObj.after);
        }
        if (hooksObj.before) {
          HOOKS[name].unshift(hooksObj.before);
        }
      });
    }
  }
  var PROTOTYPES, ADDED_PLUGINS, ADDED_PLUGIN_NAMES;
  var init_plugin = __esm({
    "node_modules/rxdb/dist/esm/plugin.js"() {
      init_rx_schema();
      init_rx_document();
      init_rx_query();
      init_rx_collection();
      init_rx_database();
      init_overwritable();
      init_hooks();
      init_rx_error();
      PROTOTYPES = {
        RxSchema: RxSchema.prototype,
        RxDocument: basePrototype,
        RxQuery: RxQueryBase.prototype,
        RxCollection: RxCollectionBase.prototype,
        RxDatabase: RxDatabaseBase.prototype
      };
      ADDED_PLUGINS = /* @__PURE__ */ new Set();
      ADDED_PLUGIN_NAMES = /* @__PURE__ */ new Set();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/checkpoint.js
  async function getLastCheckpointDoc(state, direction) {
    var checkpointDocId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
      isCheckpoint: "1",
      itemId: direction
    });
    var checkpointResult = await state.input.metaInstance.findDocumentsById([checkpointDocId], false);
    var checkpointDoc = checkpointResult[0];
    state.lastCheckpointDoc[direction] = checkpointDoc;
    if (checkpointDoc) {
      return checkpointDoc.checkpointData;
    } else {
      return void 0;
    }
  }
  async function setCheckpoint(state, direction, checkpoint) {
    state.checkpointQueue = state.checkpointQueue.then(async () => {
      var previousCheckpointDoc = state.lastCheckpointDoc[direction];
      if (checkpoint && /**
       * If the replication is already canceled,
       * we do not write a checkpoint
       * because that could mean we write a checkpoint
       * for data that has been fetched from the master
       * but not been written to the child.
       */
      !state.events.canceled.getValue() && /**
       * Only write checkpoint if it is different from before
       * to have less writes to the storage.
       */
      (!previousCheckpointDoc || JSON.stringify(previousCheckpointDoc.checkpointData) !== JSON.stringify(checkpoint))) {
        var newDoc = {
          id: "",
          isCheckpoint: "1",
          itemId: direction,
          _deleted: false,
          _attachments: {},
          checkpointData: checkpoint,
          _meta: getDefaultRxDocumentMeta(),
          _rev: getDefaultRevision()
        };
        newDoc.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newDoc);
        while (!state.events.canceled.getValue()) {
          if (previousCheckpointDoc) {
            newDoc.checkpointData = stackCheckpoints([previousCheckpointDoc.checkpointData, newDoc.checkpointData]);
          }
          newDoc._meta.lwt = now();
          newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
          if (state.events.canceled.getValue()) {
            return;
          }
          var writeRows = [{
            previous: previousCheckpointDoc,
            document: newDoc
          }];
          var result = await state.input.metaInstance.bulkWrite(writeRows, "replication-set-checkpoint");
          var successDoc = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRows, result)[0];
          if (successDoc) {
            state.lastCheckpointDoc[direction] = successDoc;
            return;
          } else {
            var error = result.error[0];
            if (error.status !== 409) {
              throw error;
            } else {
              previousCheckpointDoc = ensureNotFalsy(error.documentInDb);
              newDoc._rev = createRevision(await state.checkpointKey, previousCheckpointDoc);
            }
          }
        }
      }
    });
    await state.checkpointQueue;
  }
  async function getCheckpointKey(input) {
    var hash = await input.hashFunction([input.identifier, input.forkInstance.databaseName, input.forkInstance.collectionName].join("||"));
    return "rx_storage_replication_" + hash;
  }
  var init_checkpoint = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/checkpoint.js"() {
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_utils();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/helper.js
  function docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, docState, previous) {
    var docData = Object.assign({}, docState, {
      _attachments: hasAttachments && docState._attachments ? docState._attachments : {},
      _meta: keepMeta ? docState._meta : Object.assign({}, previous ? previous._meta : {}, {
        lwt: now()
      }),
      _rev: keepMeta ? docState._rev : getDefaultRevision()
    });
    if (!docData._rev) {
      docData._rev = createRevision(databaseInstanceToken, previous);
    }
    return docData;
  }
  function writeDocToDocState(writeDoc, keepAttachments, keepMeta) {
    var ret = flatClone(writeDoc);
    if (!keepAttachments) {
      delete ret._attachments;
    }
    if (!keepMeta) {
      delete ret._meta;
      delete ret._rev;
    }
    return ret;
  }
  function stripAttachmentsDataFromMetaWriteRows(state, rows) {
    if (!state.hasAttachments) {
      return rows;
    }
    return rows.map((row) => {
      var document2 = clone(row.document);
      document2.docData = stripAttachmentsDataFromDocument(document2.docData);
      return {
        document: document2,
        previous: row.previous
      };
    });
  }
  function getUnderlyingPersistentStorage(instance) {
    while (true) {
      if (instance.underlyingPersistentStorage) {
        instance = instance.underlyingPersistentStorage;
      } else {
        return instance;
      }
    }
  }
  var init_helper = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/helper.js"() {
      init_utils();
      init_rx_storage_helper();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/meta-instance.js
  function getRxReplicationMetaInstanceSchema(replicatedDocumentsSchema, encrypted) {
    var parentPrimaryKeyLength = getLengthOfPrimaryKey(replicatedDocumentsSchema);
    var baseSchema = {
      title: META_INSTANCE_SCHEMA_TITLE,
      primaryKey: {
        key: "id",
        fields: ["itemId", "isCheckpoint"],
        separator: "|"
      },
      type: "object",
      version: replicatedDocumentsSchema.version,
      additionalProperties: false,
      properties: {
        id: {
          type: "string",
          minLength: 1,
          // add +1 for the '|' and +1 for the 'isCheckpoint' flag
          maxLength: parentPrimaryKeyLength + 2
        },
        isCheckpoint: {
          type: "string",
          enum: ["0", "1"],
          minLength: 1,
          maxLength: 1
        },
        itemId: {
          type: "string",
          /**
           * ensure that all values of RxStorageReplicationDirection ('DOWN' has 4 chars) fit into it
           * because checkpoints use the itemId field for that.
           */
          maxLength: parentPrimaryKeyLength > 4 ? parentPrimaryKeyLength : 4
        },
        checkpointData: {
          type: "object",
          additionalProperties: true
        },
        docData: {
          type: "object",
          properties: replicatedDocumentsSchema.properties
        },
        isResolvedConflict: {
          type: "string"
        }
      },
      keyCompression: replicatedDocumentsSchema.keyCompression,
      required: ["id", "isCheckpoint", "itemId"]
    };
    if (encrypted) {
      baseSchema.encrypted = ["docData"];
    }
    var metaInstanceSchema = fillWithDefaultSettings(baseSchema);
    return metaInstanceSchema;
  }
  function getAssumedMasterState(state, docIds) {
    return state.input.metaInstance.findDocumentsById(docIds.map((docId) => {
      var useId = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, {
        itemId: docId,
        isCheckpoint: "0"
      });
      return useId;
    }), true).then((metaDocs) => {
      var ret = {};
      Object.values(metaDocs).forEach((metaDoc) => {
        ret[metaDoc.itemId] = {
          docData: metaDoc.docData,
          metaDocument: metaDoc
        };
      });
      return ret;
    });
  }
  async function getMetaWriteRow(state, newMasterDocState, previous, isResolvedConflict) {
    var docId = newMasterDocState[state.primaryPath];
    var newMeta = previous ? flatCloneDocWithMeta(previous) : {
      id: "",
      isCheckpoint: "0",
      itemId: docId,
      docData: newMasterDocState,
      _attachments: {},
      _deleted: false,
      _rev: getDefaultRevision(),
      _meta: {
        lwt: 0
      }
    };
    newMeta.docData = newMasterDocState;
    if (isResolvedConflict) {
      newMeta.isResolvedConflict = isResolvedConflict;
    }
    newMeta._meta.lwt = now();
    newMeta.id = getComposedPrimaryKeyOfDocumentData(state.input.metaInstance.schema, newMeta);
    newMeta._rev = createRevision(await state.checkpointKey, previous);
    var ret = {
      previous,
      document: newMeta
    };
    return ret;
  }
  var META_INSTANCE_SCHEMA_TITLE;
  var init_meta_instance = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/meta-instance.js"() {
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_utils();
      META_INSTANCE_SCHEMA_TITLE = "RxReplicationProtocolMetaData";
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/downstream.js
  async function startReplicationDownstream(state) {
    if (state.input.initialCheckpoint && state.input.initialCheckpoint.downstream) {
      var checkpointDoc = await getLastCheckpointDoc(state, "down");
      if (!checkpointDoc) {
        await setCheckpoint(state, "down", state.input.initialCheckpoint.downstream);
      }
    }
    var identifierHash = await state.input.hashFunction(state.input.identifier);
    var replicationHandler = state.input.replicationHandler;
    var timer = 0;
    var openTasks = [];
    function addNewTask(task) {
      state.stats.down.addNewTask = state.stats.down.addNewTask + 1;
      var taskWithTime = {
        time: timer++,
        task
      };
      openTasks.push(taskWithTime);
      state.streamQueue.down = state.streamQueue.down.then(() => {
        var useTasks = [];
        while (openTasks.length > 0) {
          state.events.active.down.next(true);
          var innerTaskWithTime = ensureNotFalsy(openTasks.shift());
          if (innerTaskWithTime.time < lastTimeMasterChangesRequested) {
            continue;
          }
          if (innerTaskWithTime.task === "RESYNC") {
            if (useTasks.length === 0) {
              useTasks.push(innerTaskWithTime.task);
              break;
            } else {
              break;
            }
          }
          useTasks.push(innerTaskWithTime.task);
        }
        if (useTasks.length === 0) {
          return;
        }
        if (useTasks[0] === "RESYNC") {
          return downstreamResyncOnce();
        } else {
          return downstreamProcessChanges(useTasks);
        }
      }).then(() => {
        state.events.active.down.next(false);
        if (!state.firstSyncDone.down.getValue() && !state.events.canceled.getValue()) {
          state.firstSyncDone.down.next(true);
        }
      });
    }
    addNewTask("RESYNC");
    if (!state.events.canceled.getValue()) {
      var sub = replicationHandler.masterChangeStream$.pipe(mergeMap(async (ev) => {
        await firstValueFrom(state.events.active.up.pipe(filter((s) => !s)));
        return ev;
      })).subscribe((task) => {
        state.stats.down.masterChangeStreamEmit = state.stats.down.masterChangeStreamEmit + 1;
        addNewTask(task);
      });
      firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => sub.unsubscribe());
    }
    var lastTimeMasterChangesRequested = -1;
    async function downstreamResyncOnce() {
      state.stats.down.downstreamResyncOnce = state.stats.down.downstreamResyncOnce + 1;
      if (state.events.canceled.getValue()) {
        return;
      }
      state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "down"));
      var lastCheckpoint = await state.checkpointQueue;
      var promises = [];
      while (!state.events.canceled.getValue()) {
        lastTimeMasterChangesRequested = timer++;
        var downResult = await replicationHandler.masterChangesSince(lastCheckpoint, state.input.pullBatchSize);
        if (downResult.documents.length === 0) {
          break;
        }
        lastCheckpoint = stackCheckpoints([lastCheckpoint, downResult.checkpoint]);
        promises.push(persistFromMaster(downResult.documents, lastCheckpoint));
        if (downResult.documents.length < state.input.pullBatchSize) {
          break;
        }
      }
      await Promise.all(promises);
    }
    function downstreamProcessChanges(tasks) {
      state.stats.down.downstreamProcessChanges = state.stats.down.downstreamProcessChanges + 1;
      var docsOfAllTasks = [];
      var lastCheckpoint = null;
      tasks.forEach((task) => {
        if (task === "RESYNC") {
          throw new Error("SNH");
        }
        appendToArray(docsOfAllTasks, task.documents);
        lastCheckpoint = stackCheckpoints([lastCheckpoint, task.checkpoint]);
      });
      return persistFromMaster(docsOfAllTasks, ensureNotFalsy(lastCheckpoint));
    }
    var persistenceQueue = PROMISE_RESOLVE_VOID;
    var nonPersistedFromMaster = {
      docs: {}
    };
    function persistFromMaster(docs, checkpoint) {
      var primaryPath = state.primaryPath;
      state.stats.down.persistFromMaster = state.stats.down.persistFromMaster + 1;
      docs.forEach((docData) => {
        var docId = docData[primaryPath];
        nonPersistedFromMaster.docs[docId] = docData;
      });
      nonPersistedFromMaster.checkpoint = checkpoint;
      persistenceQueue = persistenceQueue.then(() => {
        var downDocsById = nonPersistedFromMaster.docs;
        nonPersistedFromMaster.docs = {};
        var useCheckpoint = nonPersistedFromMaster.checkpoint;
        var docIds = Object.keys(downDocsById);
        if (state.events.canceled.getValue() || docIds.length === 0) {
          return PROMISE_RESOLVE_VOID;
        }
        var writeRowsToFork = [];
        var writeRowsToForkById = {};
        var writeRowsToMeta = {};
        var useMetaWriteRows = [];
        return Promise.all([state.input.forkInstance.findDocumentsById(docIds, true), getAssumedMasterState(state, docIds)]).then(([currentForkStateList, assumedMasterState]) => {
          var currentForkState = /* @__PURE__ */ new Map();
          currentForkStateList.forEach((doc) => currentForkState.set(doc[primaryPath], doc));
          return Promise.all(docIds.map(async (docId) => {
            var forkStateFullDoc = currentForkState.get(docId);
            var forkStateDocData = forkStateFullDoc ? writeDocToDocState(forkStateFullDoc, state.hasAttachments, false) : void 0;
            var masterState = downDocsById[docId];
            var assumedMaster = assumedMasterState[docId];
            if (assumedMaster && forkStateFullDoc && assumedMaster.metaDocument.isResolvedConflict === forkStateFullDoc._rev) {
              await state.streamQueue.up;
            }
            var isAssumedMasterEqualToForkState = !assumedMaster || !forkStateDocData ? false : state.input.conflictHandler.isEqual(assumedMaster.docData, forkStateDocData, "downstream-check-if-equal-0");
            if (!isAssumedMasterEqualToForkState && assumedMaster && assumedMaster.docData._rev && forkStateFullDoc && forkStateFullDoc._meta[state.input.identifier] && getHeightOfRevision(forkStateFullDoc._rev) === forkStateFullDoc._meta[state.input.identifier]) {
              isAssumedMasterEqualToForkState = true;
            }
            if (forkStateFullDoc && assumedMaster && isAssumedMasterEqualToForkState === false || forkStateFullDoc && !assumedMaster) {
              return PROMISE_RESOLVE_VOID;
            }
            var areStatesExactlyEqual = !forkStateDocData ? false : state.input.conflictHandler.isEqual(masterState, forkStateDocData, "downstream-check-if-equal-1");
            if (forkStateDocData && areStatesExactlyEqual) {
              if (!assumedMaster || isAssumedMasterEqualToForkState === false) {
                useMetaWriteRows.push(await getMetaWriteRow(state, forkStateDocData, assumedMaster ? assumedMaster.metaDocument : void 0));
              }
              return PROMISE_RESOLVE_VOID;
            }
            var newForkState = Object.assign({}, masterState, forkStateFullDoc ? {
              _meta: flatClone(forkStateFullDoc._meta),
              _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {},
              _rev: getDefaultRevision()
            } : {
              _meta: {
                lwt: now()
              },
              _rev: getDefaultRevision(),
              _attachments: state.hasAttachments && masterState._attachments ? masterState._attachments : {}
            });
            if (masterState._rev) {
              var nextRevisionHeight = !forkStateFullDoc ? 1 : getHeightOfRevision(forkStateFullDoc._rev) + 1;
              newForkState._meta[state.input.identifier] = nextRevisionHeight;
              if (state.input.keepMeta) {
                newForkState._rev = masterState._rev;
              }
            }
            if (state.input.keepMeta && masterState._meta) {
              newForkState._meta = masterState._meta;
            }
            var forkWriteRow = {
              previous: forkStateFullDoc,
              document: newForkState
            };
            forkWriteRow.document._rev = forkWriteRow.document._rev ? forkWriteRow.document._rev : createRevision(identifierHash, forkWriteRow.previous);
            writeRowsToFork.push(forkWriteRow);
            writeRowsToForkById[docId] = forkWriteRow;
            writeRowsToMeta[docId] = await getMetaWriteRow(state, masterState, assumedMaster ? assumedMaster.metaDocument : void 0);
          }));
        }).then(async () => {
          if (writeRowsToFork.length > 0) {
            return state.input.forkInstance.bulkWrite(writeRowsToFork, await state.downstreamBulkWriteFlag).then((forkWriteResult) => {
              var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, writeRowsToFork, forkWriteResult);
              success.forEach((doc) => {
                var docId = doc[primaryPath];
                state.events.processed.down.next(writeRowsToForkById[docId]);
                useMetaWriteRows.push(writeRowsToMeta[docId]);
              });
              var mustThrow;
              forkWriteResult.error.forEach((error) => {
                if (error.status === 409) {
                  return;
                }
                var throwMe = newRxError("RC_PULL", {
                  writeError: error
                });
                state.events.error.next(throwMe);
                mustThrow = throwMe;
              });
              if (mustThrow) {
                throw mustThrow;
              }
            });
          }
        }).then(() => {
          if (useMetaWriteRows.length > 0) {
            return state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWriteRows), "replication-down-write-meta").then((metaWriteResult) => {
              metaWriteResult.error.forEach((writeError) => {
                state.events.error.next(newRxError("RC_PULL", {
                  id: writeError.documentId,
                  writeError
                }));
              });
            });
          }
        }).then(() => {
          setCheckpoint(state, "down", useCheckpoint);
        });
      }).catch((unhandledError) => state.events.error.next(unhandledError));
      return persistenceQueue;
    }
  }
  var init_downstream = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/downstream.js"() {
      init_esm5();
      init_rx_error();
      init_rx_storage_helper();
      init_utils();
      init_checkpoint();
      init_helper();
      init_meta_instance();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/conflicts.js
  async function resolveConflictError(state, input, forkState) {
    var conflictHandler = state.input.conflictHandler;
    var isEqual2 = conflictHandler.isEqual(input.realMasterState, input.newDocumentState, "replication-resolve-conflict");
    if (isEqual2) {
      return void 0;
    } else {
      var resolved = await conflictHandler.resolve(input, "replication-resolve-conflict");
      var resolvedDoc = Object.assign({}, resolved, {
        /**
         * Because the resolved conflict is written to the fork,
         * we have to keep/update the forks _meta data, not the masters.
         */
        _meta: flatClone(forkState._meta),
        _rev: getDefaultRevision(),
        _attachments: flatClone(forkState._attachments)
      });
      resolvedDoc._meta.lwt = now();
      resolvedDoc._rev = createRevision(await state.checkpointKey, forkState);
      return resolvedDoc;
    }
  }
  var init_conflicts = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/conflicts.js"() {
      init_utils();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/attachments/attachments-utils.js
  async function fillWriteDataForAttachmentsChange(primaryPath, storageInstance, newDocument, originalDocument) {
    if (!newDocument._attachments || originalDocument && !originalDocument._attachments) {
      throw new Error("_attachments missing");
    }
    var docId = newDocument[primaryPath];
    var originalAttachmentsIds = new Set(originalDocument && originalDocument._attachments ? Object.keys(originalDocument._attachments) : []);
    await Promise.all(Object.entries(newDocument._attachments).map(async ([key, value]) => {
      if ((!originalAttachmentsIds.has(key) || originalDocument && ensureNotFalsy(originalDocument._attachments)[key].digest !== value.digest) && !value.data) {
        var attachmentDataString = await storageInstance.getAttachmentData(docId, key, value.digest);
        value.data = attachmentDataString;
      }
    }));
    return newDocument;
  }
  var init_attachments_utils = __esm({
    "node_modules/rxdb/dist/esm/plugins/attachments/attachments-utils.js"() {
      init_utils();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/attachments/index.js
  var init_attachments = __esm({
    "node_modules/rxdb/dist/esm/plugins/attachments/index.js"() {
      init_attachments_utils();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/upstream.js
  async function startReplicationUpstream(state) {
    if (state.input.initialCheckpoint && state.input.initialCheckpoint.upstream) {
      var checkpointDoc = await getLastCheckpointDoc(state, "up");
      if (!checkpointDoc) {
        await setCheckpoint(state, "up", state.input.initialCheckpoint.upstream);
      }
    }
    var replicationHandler = state.input.replicationHandler;
    state.streamQueue.up = state.streamQueue.up.then(() => {
      return upstreamInitialSync().then(() => {
        return processTasks();
      });
    });
    var timer = 0;
    var initialSyncStartTime = -1;
    var openTasks = [];
    var persistenceQueue = PROMISE_RESOLVE_FALSE;
    var nonPersistedFromMaster = {
      docs: {}
    };
    var sub = state.input.forkInstance.changeStream().subscribe((eventBulk) => {
      if (state.events.paused.getValue()) {
        return;
      }
      state.stats.up.forkChangeStreamEmit = state.stats.up.forkChangeStreamEmit + 1;
      openTasks.push({
        task: eventBulk,
        time: timer++
      });
      if (!state.events.active.up.getValue()) {
        state.events.active.up.next(true);
      }
      if (state.input.waitBeforePersist) {
        return state.input.waitBeforePersist().then(() => processTasks());
      } else {
        return processTasks();
      }
    });
    var subResync = replicationHandler.masterChangeStream$.pipe(filter((ev) => ev === "RESYNC")).subscribe(() => {
      openTasks.push({
        task: "RESYNC",
        time: timer++
      });
      processTasks();
    });
    firstValueFrom(state.events.canceled.pipe(filter((canceled) => !!canceled))).then(() => {
      sub.unsubscribe();
      subResync.unsubscribe();
    });
    async function upstreamInitialSync() {
      state.stats.up.upstreamInitialSync = state.stats.up.upstreamInitialSync + 1;
      if (state.events.canceled.getValue()) {
        return;
      }
      state.checkpointQueue = state.checkpointQueue.then(() => getLastCheckpointDoc(state, "up"));
      var lastCheckpoint = await state.checkpointQueue;
      var promises = /* @__PURE__ */ new Set();
      var _loop = async function() {
        initialSyncStartTime = timer++;
        if (promises.size > 3) {
          await Promise.race(Array.from(promises));
        }
        var upResult = await getChangedDocumentsSince(state.input.forkInstance, state.input.pushBatchSize, lastCheckpoint);
        if (upResult.documents.length === 0) {
          return 1;
        }
        lastCheckpoint = stackCheckpoints([lastCheckpoint, upResult.checkpoint]);
        var promise = persistToMaster(upResult.documents, ensureNotFalsy(lastCheckpoint));
        promises.add(promise);
        promise.catch().then(() => promises.delete(promise));
      };
      while (!state.events.canceled.getValue()) {
        if (await _loop()) break;
      }
      var resolvedPromises = await Promise.all(promises);
      var hadConflicts = resolvedPromises.find((r) => !!r);
      if (hadConflicts) {
        await upstreamInitialSync();
      } else if (!state.firstSyncDone.up.getValue() && !state.events.canceled.getValue()) {
        state.firstSyncDone.up.next(true);
      }
    }
    function processTasks() {
      if (state.events.canceled.getValue() || openTasks.length === 0) {
        state.events.active.up.next(false);
        return;
      }
      state.stats.up.processTasks = state.stats.up.processTasks + 1;
      state.events.active.up.next(true);
      state.streamQueue.up = state.streamQueue.up.then(async () => {
        var docs = [];
        var checkpoint;
        while (openTasks.length > 0) {
          var taskWithTime = ensureNotFalsy(openTasks.shift());
          if (taskWithTime.time < initialSyncStartTime) {
            continue;
          }
          if (taskWithTime.task === "RESYNC") {
            state.events.active.up.next(false);
            await upstreamInitialSync();
            return;
          }
          if (taskWithTime.task.context !== await state.downstreamBulkWriteFlag) {
            appendToArray(docs, taskWithTime.task.events.map((r) => {
              return r.documentData;
            }));
          }
          checkpoint = stackCheckpoints([checkpoint, taskWithTime.task.checkpoint]);
        }
        await persistToMaster(docs, checkpoint);
        if (openTasks.length === 0) {
          state.events.active.up.next(false);
        } else {
          return processTasks();
        }
      });
    }
    function persistToMaster(docs, checkpoint) {
      state.stats.up.persistToMaster = state.stats.up.persistToMaster + 1;
      docs.forEach((docData) => {
        var docId = docData[state.primaryPath];
        nonPersistedFromMaster.docs[docId] = docData;
      });
      nonPersistedFromMaster.checkpoint = checkpoint;
      persistenceQueue = persistenceQueue.then(async () => {
        if (state.events.canceled.getValue()) {
          return false;
        }
        var upDocsById = nonPersistedFromMaster.docs;
        nonPersistedFromMaster.docs = {};
        var useCheckpoint = nonPersistedFromMaster.checkpoint;
        var docIds = Object.keys(upDocsById);
        function rememberCheckpointBeforeReturn() {
          return setCheckpoint(state, "up", useCheckpoint);
        }
        ;
        if (docIds.length === 0) {
          rememberCheckpointBeforeReturn();
          return false;
        }
        var assumedMasterState = await getAssumedMasterState(state, docIds);
        var writeRowsToMaster = {};
        var writeRowsToMasterIds = [];
        var writeRowsToMeta = {};
        var forkStateById = {};
        await Promise.all(docIds.map(async (docId) => {
          var fullDocData = upDocsById[docId];
          forkStateById[docId] = fullDocData;
          var docData = writeDocToDocState(fullDocData, state.hasAttachments, !!state.input.keepMeta);
          var assumedMasterDoc = assumedMasterState[docId];
          if (assumedMasterDoc && // if the isResolvedConflict is correct, we do not have to compare the documents.
          assumedMasterDoc.metaDocument.isResolvedConflict !== fullDocData._rev && state.input.conflictHandler.isEqual(assumedMasterDoc.docData, docData, "upstream-check-if-equal") || /**
           * If the master works with _rev fields,
           * we use that to check if our current doc state
           * is different from the assumedMasterDoc.
           */
          assumedMasterDoc && assumedMasterDoc.docData._rev && getHeightOfRevision(fullDocData._rev) === fullDocData._meta[state.input.identifier]) {
            return;
          }
          writeRowsToMasterIds.push(docId);
          writeRowsToMaster[docId] = {
            assumedMasterState: assumedMasterDoc ? assumedMasterDoc.docData : void 0,
            newDocumentState: docData
          };
          writeRowsToMeta[docId] = await getMetaWriteRow(state, docData, assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0);
        }));
        if (writeRowsToMasterIds.length === 0) {
          rememberCheckpointBeforeReturn();
          return false;
        }
        var writeRowsArray = Object.values(writeRowsToMaster);
        var conflictIds = /* @__PURE__ */ new Set();
        var conflictsById = {};
        var writeBatches = batchArray(writeRowsArray, state.input.pushBatchSize);
        await Promise.all(writeBatches.map(async (writeBatch) => {
          if (state.hasAttachments) {
            await Promise.all(writeBatch.map(async (row) => {
              row.newDocumentState = await fillWriteDataForAttachmentsChange(state.primaryPath, state.input.forkInstance, clone(row.newDocumentState), row.assumedMasterState);
            }));
          }
          var masterWriteResult = await replicationHandler.masterWrite(writeBatch);
          masterWriteResult.forEach((conflictDoc) => {
            var id = conflictDoc[state.primaryPath];
            conflictIds.add(id);
            conflictsById[id] = conflictDoc;
          });
        }));
        var useWriteRowsToMeta = [];
        writeRowsToMasterIds.forEach((docId) => {
          if (!conflictIds.has(docId)) {
            state.events.processed.up.next(writeRowsToMaster[docId]);
            useWriteRowsToMeta.push(writeRowsToMeta[docId]);
          }
        });
        if (state.events.canceled.getValue()) {
          return false;
        }
        if (useWriteRowsToMeta.length > 0) {
          await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useWriteRowsToMeta), "replication-up-write-meta");
        }
        var hadConflictWrites = false;
        if (conflictIds.size > 0) {
          state.stats.up.persistToMasterHadConflicts = state.stats.up.persistToMasterHadConflicts + 1;
          var conflictWriteFork = [];
          var conflictWriteMeta = {};
          await Promise.all(Object.entries(conflictsById).map(([docId, realMasterState]) => {
            var writeToMasterRow = writeRowsToMaster[docId];
            var input = {
              newDocumentState: writeToMasterRow.newDocumentState,
              assumedMasterState: writeToMasterRow.assumedMasterState,
              realMasterState
            };
            return resolveConflictError(state, input, forkStateById[docId]).then(async (resolved) => {
              if (resolved) {
                state.events.resolvedConflicts.next({
                  input,
                  output: resolved
                });
                conflictWriteFork.push({
                  previous: forkStateById[docId],
                  document: resolved
                });
                var assumedMasterDoc = assumedMasterState[docId];
                conflictWriteMeta[docId] = await getMetaWriteRow(state, ensureNotFalsy(realMasterState), assumedMasterDoc ? assumedMasterDoc.metaDocument : void 0, resolved._rev);
              }
            });
          }));
          if (conflictWriteFork.length > 0) {
            hadConflictWrites = true;
            state.stats.up.persistToMasterConflictWrites = state.stats.up.persistToMasterConflictWrites + 1;
            var forkWriteResult = await state.input.forkInstance.bulkWrite(conflictWriteFork, "replication-up-write-conflict");
            var mustThrow;
            forkWriteResult.error.forEach((error) => {
              if (error.status === 409) {
                return;
              }
              var throwMe = newRxError("RC_PUSH", {
                writeError: error
              });
              state.events.error.next(throwMe);
              mustThrow = throwMe;
            });
            if (mustThrow) {
              throw mustThrow;
            }
            var useMetaWrites = [];
            var success = getWrittenDocumentsFromBulkWriteResponse(state.primaryPath, conflictWriteFork, forkWriteResult);
            success.forEach((docData) => {
              var docId = docData[state.primaryPath];
              useMetaWrites.push(conflictWriteMeta[docId]);
            });
            if (useMetaWrites.length > 0) {
              await state.input.metaInstance.bulkWrite(stripAttachmentsDataFromMetaWriteRows(state, useMetaWrites), "replication-up-write-conflict-meta");
            }
          }
        }
        rememberCheckpointBeforeReturn();
        return hadConflictWrites;
      }).catch((unhandledError) => {
        state.events.error.next(unhandledError);
        return false;
      });
      return persistenceQueue;
    }
  }
  var init_upstream = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/upstream.js"() {
      init_esm5();
      init_rx_storage_helper();
      init_utils();
      init_checkpoint();
      init_conflicts();
      init_helper();
      init_meta_instance();
      init_attachments();
      init_rx_error();
    }
  });

  // node_modules/rxdb/dist/esm/replication-protocol/index.js
  function replicateRxStorageInstance(input) {
    input = flatClone(input);
    input.forkInstance = getUnderlyingPersistentStorage(input.forkInstance);
    input.metaInstance = getUnderlyingPersistentStorage(input.metaInstance);
    var checkpointKeyPromise = getCheckpointKey(input);
    var state = {
      primaryPath: getPrimaryFieldOfPrimaryKey(input.forkInstance.schema.primaryKey),
      hasAttachments: !!input.forkInstance.schema.attachments,
      input,
      checkpointKey: checkpointKeyPromise,
      downstreamBulkWriteFlag: checkpointKeyPromise.then((checkpointKey) => "replication-downstream-" + checkpointKey),
      events: {
        canceled: new BehaviorSubject(false),
        paused: new BehaviorSubject(false),
        active: {
          down: new BehaviorSubject(true),
          up: new BehaviorSubject(true)
        },
        processed: {
          down: new Subject(),
          up: new Subject()
        },
        resolvedConflicts: new Subject(),
        error: new Subject()
      },
      stats: {
        down: {
          addNewTask: 0,
          downstreamProcessChanges: 0,
          downstreamResyncOnce: 0,
          masterChangeStreamEmit: 0,
          persistFromMaster: 0
        },
        up: {
          forkChangeStreamEmit: 0,
          persistToMaster: 0,
          persistToMasterConflictWrites: 0,
          persistToMasterHadConflicts: 0,
          processTasks: 0,
          upstreamInitialSync: 0
        }
      },
      firstSyncDone: {
        down: new BehaviorSubject(false),
        up: new BehaviorSubject(false)
      },
      streamQueue: {
        down: PROMISE_RESOLVE_VOID,
        up: PROMISE_RESOLVE_VOID
      },
      checkpointQueue: PROMISE_RESOLVE_VOID,
      lastCheckpointDoc: {}
    };
    startReplicationDownstream(state);
    startReplicationUpstream(state);
    return state;
  }
  function awaitRxStorageReplicationFirstInSync(state) {
    return firstValueFrom(combineLatest([state.firstSyncDone.down.pipe(filter((v) => !!v)), state.firstSyncDone.up.pipe(filter((v) => !!v))])).then(() => {
    });
  }
  function awaitRxStorageReplicationInSync(replicationState) {
    return Promise.all([replicationState.streamQueue.up, replicationState.streamQueue.down, replicationState.checkpointQueue]);
  }
  function rxStorageInstanceToReplicationHandler(instance, conflictHandler, databaseInstanceToken, keepMeta = false) {
    instance = getUnderlyingPersistentStorage(instance);
    var hasAttachments = !!instance.schema.attachments;
    var primaryPath = getPrimaryFieldOfPrimaryKey(instance.schema.primaryKey);
    var replicationHandler = {
      masterChangeStream$: instance.changeStream().pipe(mergeMap(async (eventBulk) => {
        var ret = {
          checkpoint: eventBulk.checkpoint,
          documents: await Promise.all(eventBulk.events.map(async (event) => {
            var docData = writeDocToDocState(event.documentData, hasAttachments, keepMeta);
            if (hasAttachments) {
              docData = await fillWriteDataForAttachmentsChange(
                primaryPath,
                instance,
                clone(docData),
                /**
                 * Notice that the master never knows
                 * the client state of the document.
                 * Therefore we always send all attachments data.
                 */
                void 0
              );
            }
            return docData;
          }))
        };
        return ret;
      })),
      masterChangesSince(checkpoint, batchSize) {
        return getChangedDocumentsSince(instance, batchSize, checkpoint).then(async (result) => {
          return {
            checkpoint: result.documents.length > 0 ? result.checkpoint : checkpoint,
            documents: await Promise.all(result.documents.map(async (plainDocumentData) => {
              var docData = writeDocToDocState(plainDocumentData, hasAttachments, keepMeta);
              if (hasAttachments) {
                docData = await fillWriteDataForAttachmentsChange(
                  primaryPath,
                  instance,
                  clone(docData),
                  /**
                   * Notice the the master never knows
                   * the client state of the document.
                   * Therefore we always send all attachments data.
                   */
                  void 0
                );
              }
              return docData;
            }))
          };
        });
      },
      async masterWrite(rows) {
        var rowById = {};
        rows.forEach((row) => {
          var docId = row.newDocumentState[primaryPath];
          rowById[docId] = row;
        });
        var ids = Object.keys(rowById);
        var masterDocsStateList = await instance.findDocumentsById(ids, true);
        var masterDocsState = /* @__PURE__ */ new Map();
        masterDocsStateList.forEach((doc) => masterDocsState.set(doc[primaryPath], doc));
        var conflicts = [];
        var writeRows = [];
        await Promise.all(Object.entries(rowById).map(([id, row]) => {
          var masterState = masterDocsState.get(id);
          if (!masterState) {
            writeRows.push({
              document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState)
            });
          } else if (masterState && !row.assumedMasterState) {
            conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
          } else if (conflictHandler.isEqual(writeDocToDocState(masterState, hasAttachments, keepMeta), ensureNotFalsy(row.assumedMasterState), "rxStorageInstanceToReplicationHandler-masterWrite") === true) {
            writeRows.push({
              previous: masterState,
              document: docStateToWriteDoc(databaseInstanceToken, hasAttachments, keepMeta, row.newDocumentState, masterState)
            });
          } else {
            conflicts.push(writeDocToDocState(masterState, hasAttachments, keepMeta));
          }
        }));
        if (writeRows.length > 0) {
          var result = await instance.bulkWrite(writeRows, "replication-master-write");
          result.error.forEach((err) => {
            if (err.status !== 409) {
              throw newRxError("SNH", {
                name: "non conflict error",
                error: err
              });
            } else {
              conflicts.push(writeDocToDocState(ensureNotFalsy(err.documentInDb), hasAttachments, keepMeta));
            }
          });
        }
        return conflicts;
      }
    };
    return replicationHandler;
  }
  async function cancelRxStorageReplication(replicationState) {
    replicationState.events.canceled.next(true);
    replicationState.events.active.up.complete();
    replicationState.events.active.down.complete();
    replicationState.events.processed.up.complete();
    replicationState.events.processed.down.complete();
    replicationState.events.resolvedConflicts.complete();
    replicationState.events.canceled.complete();
    await replicationState.checkpointQueue;
  }
  var init_replication_protocol = __esm({
    "node_modules/rxdb/dist/esm/replication-protocol/index.js"() {
      init_esm5();
      init_rx_schema_helper();
      init_utils();
      init_checkpoint();
      init_downstream();
      init_helper();
      init_upstream();
      init_attachments();
      init_rx_storage_helper();
      init_rx_error();
      init_checkpoint();
      init_downstream();
      init_upstream();
      init_meta_instance();
      init_conflicts();
      init_helper();
      init_default_conflict_handler();
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/util.js
  function isPromise2(obj) {
    return obj && typeof obj.then === "function";
  }
  function sleep(time, resolveWith) {
    if (!time) time = 0;
    return new Promise(function(res) {
      return setTimeout(function() {
        return res(resolveWith);
      }, time);
    });
  }
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function randomToken2() {
    return Math.random().toString(36).substring(2);
  }
  function microSeconds() {
    var ret = Date.now() * 1e3;
    if (ret <= lastMs) {
      ret = lastMs + 1;
    }
    lastMs = ret;
    return ret;
  }
  function supportsWebLockAPI() {
    if (typeof navigator !== "undefined" && typeof navigator.locks !== "undefined" && typeof navigator.locks.request === "function") {
      return true;
    } else {
      return false;
    }
  }
  var PROMISE_RESOLVED_FALSE, PROMISE_RESOLVED_TRUE, PROMISE_RESOLVED_VOID, lastMs;
  var init_util4 = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/util.js"() {
      PROMISE_RESOLVED_FALSE = Promise.resolve(false);
      PROMISE_RESOLVED_TRUE = Promise.resolve(true);
      PROMISE_RESOLVED_VOID = Promise.resolve();
      lastMs = 0;
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/methods/native.js
  function create(channelName) {
    var state = {
      time: microSeconds(),
      messagesCallback: null,
      bc: new BroadcastChannel(channelName),
      subFns: []
      // subscriberFunctions
    };
    state.bc.onmessage = function(msgEvent) {
      if (state.messagesCallback) {
        state.messagesCallback(msgEvent.data);
      }
    };
    return state;
  }
  function close(channelState) {
    channelState.bc.close();
    channelState.subFns = [];
  }
  function postMessage(channelState, messageJson) {
    try {
      channelState.bc.postMessage(messageJson, false);
      return PROMISE_RESOLVED_VOID;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  function onMessage(channelState, fn) {
    channelState.messagesCallback = fn;
  }
  function canBeUsed() {
    if (typeof globalThis !== "undefined" && globalThis.Deno && globalThis.Deno.args) {
      return true;
    }
    if ((typeof window !== "undefined" || typeof self !== "undefined") && typeof BroadcastChannel === "function") {
      if (BroadcastChannel._pubkey) {
        throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
      }
      return true;
    } else {
      return false;
    }
  }
  function averageResponseTime() {
    return 150;
  }
  var microSeconds2, type, NativeMethod;
  var init_native = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/methods/native.js"() {
      init_util4();
      microSeconds2 = microSeconds;
      type = "native";
      NativeMethod = {
        create,
        close,
        onMessage,
        postMessage,
        canBeUsed,
        type,
        averageResponseTime,
        microSeconds: microSeconds2
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/options.js
  function fillOptionsWithDefaults() {
    var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var options = JSON.parse(JSON.stringify(originalOptions));
    if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
    if (!options.idb) options.idb = {};
    if (!options.idb.ttl) options.idb.ttl = 1e3 * 45;
    if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
    if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
    if (!options.localstorage) options.localstorage = {};
    if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1e3 * 60;
    if (originalOptions.methods) options.methods = originalOptions.methods;
    if (!options.node) options.node = {};
    if (!options.node.ttl) options.node.ttl = 1e3 * 60 * 2;
    if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
    if (typeof options.node.useFastPath === "undefined") options.node.useFastPath = true;
    return options;
  }
  var init_options = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/options.js"() {
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js
  function getIdb() {
    if (typeof indexedDB !== "undefined") return indexedDB;
    if (typeof window !== "undefined") {
      if (typeof window.mozIndexedDB !== "undefined") return window.mozIndexedDB;
      if (typeof window.webkitIndexedDB !== "undefined") return window.webkitIndexedDB;
      if (typeof window.msIndexedDB !== "undefined") return window.msIndexedDB;
    }
    return false;
  }
  function commitIndexedDBTransaction(tx) {
    if (tx.commit) {
      tx.commit();
    }
  }
  function createDatabase(channelName) {
    var IndexedDB = getIdb();
    var dbName = DB_PREFIX + channelName;
    var openRequest = IndexedDB.open(dbName);
    openRequest.onupgradeneeded = function(ev) {
      var db = ev.target.result;
      db.createObjectStore(OBJECT_STORE_ID, {
        keyPath: "id",
        autoIncrement: true
      });
    };
    return new Promise(function(res, rej) {
      openRequest.onerror = function(ev) {
        return rej(ev);
      };
      openRequest.onsuccess = function() {
        res(openRequest.result);
      };
    });
  }
  function writeMessage(db, readerUuid, messageJson) {
    var time = Date.now();
    var writeObject = {
      uuid: readerUuid,
      time,
      data: messageJson
    };
    var tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
    return new Promise(function(res, rej) {
      tx.oncomplete = function() {
        return res();
      };
      tx.onerror = function(ev) {
        return rej(ev);
      };
      var objectStore = tx.objectStore(OBJECT_STORE_ID);
      objectStore.add(writeObject);
      commitIndexedDBTransaction(tx);
    });
  }
  function getMessagesHigherThan(db, lastCursorId) {
    var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    var ret = [];
    var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
    if (objectStore.getAll) {
      var getAllRequest = objectStore.getAll(keyRangeValue);
      return new Promise(function(res, rej) {
        getAllRequest.onerror = function(err) {
          return rej(err);
        };
        getAllRequest.onsuccess = function(e) {
          res(e.target.result);
        };
      });
    }
    function openCursor() {
      try {
        keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
        return objectStore.openCursor(keyRangeValue);
      } catch (e) {
        return objectStore.openCursor();
      }
    }
    return new Promise(function(res, rej) {
      var openCursorRequest = openCursor();
      openCursorRequest.onerror = function(err) {
        return rej(err);
      };
      openCursorRequest.onsuccess = function(ev) {
        var cursor = ev.target.result;
        if (cursor) {
          if (cursor.value.id < lastCursorId + 1) {
            cursor["continue"](lastCursorId + 1);
          } else {
            ret.push(cursor.value);
            cursor["continue"]();
          }
        } else {
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      };
    });
  }
  function removeMessagesById(channelState, ids) {
    if (channelState.closed) {
      return Promise.resolve([]);
    }
    var tx = channelState.db.transaction(OBJECT_STORE_ID, "readwrite", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    return Promise.all(ids.map(function(id) {
      var deleteRequest = objectStore["delete"](id);
      return new Promise(function(res) {
        deleteRequest.onsuccess = function() {
          return res();
        };
      });
    }));
  }
  function getOldMessages(db, ttl) {
    var olderThen = Date.now() - ttl;
    var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    var ret = [];
    return new Promise(function(res) {
      objectStore.openCursor().onsuccess = function(ev) {
        var cursor = ev.target.result;
        if (cursor) {
          var msgObk = cursor.value;
          if (msgObk.time < olderThen) {
            ret.push(msgObk);
            cursor["continue"]();
          } else {
            commitIndexedDBTransaction(tx);
            res(ret);
          }
        } else {
          res(ret);
        }
      };
    });
  }
  function cleanOldMessages(channelState) {
    return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function(tooOld) {
      return removeMessagesById(channelState, tooOld.map(function(msg) {
        return msg.id;
      }));
    });
  }
  function create2(channelName, options) {
    options = fillOptionsWithDefaults(options);
    return createDatabase(channelName).then(function(db) {
      var state = {
        closed: false,
        lastCursorId: 0,
        channelName,
        options,
        uuid: randomToken2(),
        /**
         * emittedMessagesIds
         * contains all messages that have been emitted before
         * @type {ObliviousSet}
         */
        eMIs: new ObliviousSet(options.idb.ttl * 2),
        // ensures we do not read messages in parallel
        writeBlockPromise: PROMISE_RESOLVED_VOID,
        messagesCallback: null,
        readQueuePromises: [],
        db
      };
      db.onclose = function() {
        state.closed = true;
        if (options.idb.onclose) options.idb.onclose();
      };
      _readLoop(state);
      return state;
    });
  }
  function _readLoop(state) {
    if (state.closed) return;
    readNewMessages(state).then(function() {
      return sleep(state.options.idb.fallbackInterval);
    }).then(function() {
      return _readLoop(state);
    });
  }
  function _filterMessage(msgObj, state) {
    if (msgObj.uuid === state.uuid) return false;
    if (state.eMIs.has(msgObj.id)) return false;
    if (msgObj.data.time < state.messagesCallbackTime) return false;
    return true;
  }
  function readNewMessages(state) {
    if (state.closed) return PROMISE_RESOLVED_VOID;
    if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;
    return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
      var useMessages = newerMessages.filter(function(msgObj) {
        return !!msgObj;
      }).map(function(msgObj) {
        if (msgObj.id > state.lastCursorId) {
          state.lastCursorId = msgObj.id;
        }
        return msgObj;
      }).filter(function(msgObj) {
        return _filterMessage(msgObj, state);
      }).sort(function(msgObjA, msgObjB) {
        return msgObjA.time - msgObjB.time;
      });
      useMessages.forEach(function(msgObj) {
        if (state.messagesCallback) {
          state.eMIs.add(msgObj.id);
          state.messagesCallback(msgObj.data);
        }
      });
      return PROMISE_RESOLVED_VOID;
    });
  }
  function close2(channelState) {
    channelState.closed = true;
    channelState.db.close();
  }
  function postMessage2(channelState, messageJson) {
    channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
      return writeMessage(channelState.db, channelState.uuid, messageJson);
    }).then(function() {
      if (randomInt(0, 10) === 0) {
        cleanOldMessages(channelState);
      }
    });
    return channelState.writeBlockPromise;
  }
  function onMessage2(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
    readNewMessages(channelState);
  }
  function canBeUsed2() {
    return !!getIdb();
  }
  function averageResponseTime2(options) {
    return options.idb.fallbackInterval * 2;
  }
  var microSeconds3, DB_PREFIX, OBJECT_STORE_ID, TRANSACTION_SETTINGS, type2, IndexedDBMethod;
  var init_indexed_db = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js"() {
      init_util4();
      init_src3();
      init_options();
      microSeconds3 = microSeconds;
      DB_PREFIX = "pubkey.broadcast-channel-0-";
      OBJECT_STORE_ID = "messages";
      TRANSACTION_SETTINGS = {
        durability: "relaxed"
      };
      type2 = "idb";
      IndexedDBMethod = {
        create: create2,
        close: close2,
        onMessage: onMessage2,
        postMessage: postMessage2,
        canBeUsed: canBeUsed2,
        type: type2,
        averageResponseTime: averageResponseTime2,
        microSeconds: microSeconds3
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js
  function getLocalStorage() {
    var localStorage;
    if (typeof window === "undefined") return null;
    try {
      localStorage = window.localStorage;
      localStorage = window["ie8-eventlistener/storage"] || window.localStorage;
    } catch (e) {
    }
    return localStorage;
  }
  function storageKey(channelName) {
    return KEY_PREFIX + channelName;
  }
  function postMessage3(channelState, messageJson) {
    return new Promise(function(res) {
      sleep().then(function() {
        var key = storageKey(channelState.channelName);
        var writeObj = {
          token: randomToken2(),
          time: Date.now(),
          data: messageJson,
          uuid: channelState.uuid
        };
        var value = JSON.stringify(writeObj);
        getLocalStorage().setItem(key, value);
        var ev = document.createEvent("Event");
        ev.initEvent("storage", true, true);
        ev.key = key;
        ev.newValue = value;
        window.dispatchEvent(ev);
        res();
      });
    });
  }
  function addStorageEventListener(channelName, fn) {
    var key = storageKey(channelName);
    var listener = function listener2(ev) {
      if (ev.key === key) {
        fn(JSON.parse(ev.newValue));
      }
    };
    window.addEventListener("storage", listener);
    return listener;
  }
  function removeStorageEventListener(listener) {
    window.removeEventListener("storage", listener);
  }
  function create3(channelName, options) {
    options = fillOptionsWithDefaults(options);
    if (!canBeUsed3()) {
      throw new Error("BroadcastChannel: localstorage cannot be used");
    }
    var uuid = randomToken2();
    var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
    var state = {
      channelName,
      uuid,
      eMIs
      // emittedMessagesIds
    };
    state.listener = addStorageEventListener(channelName, function(msgObj) {
      if (!state.messagesCallback) return;
      if (msgObj.uuid === uuid) return;
      if (!msgObj.token || eMIs.has(msgObj.token)) return;
      if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return;
      eMIs.add(msgObj.token);
      state.messagesCallback(msgObj.data);
    });
    return state;
  }
  function close3(channelState) {
    removeStorageEventListener(channelState.listener);
  }
  function onMessage3(channelState, fn, time) {
    channelState.messagesCallbackTime = time;
    channelState.messagesCallback = fn;
  }
  function canBeUsed3() {
    var ls = getLocalStorage();
    if (!ls) return false;
    try {
      var key = "__broadcastchannel_check";
      ls.setItem(key, "works");
      ls.removeItem(key);
    } catch (e) {
      return false;
    }
    return true;
  }
  function averageResponseTime3() {
    var defaultTime = 120;
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return defaultTime * 2;
    }
    return defaultTime;
  }
  var microSeconds4, KEY_PREFIX, type3, LocalstorageMethod;
  var init_localstorage = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js"() {
      init_src3();
      init_options();
      init_util4();
      microSeconds4 = microSeconds;
      KEY_PREFIX = "pubkey.broadcastChannel-";
      type3 = "localstorage";
      LocalstorageMethod = {
        create: create3,
        close: close3,
        onMessage: onMessage3,
        postMessage: postMessage3,
        canBeUsed: canBeUsed3,
        type: type3,
        averageResponseTime: averageResponseTime3,
        microSeconds: microSeconds4
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js
  function create4(channelName) {
    var state = {
      time: microSeconds5(),
      name: channelName,
      messagesCallback: null
    };
    SIMULATE_CHANNELS.add(state);
    return state;
  }
  function close4(channelState) {
    SIMULATE_CHANNELS["delete"](channelState);
  }
  function postMessage4(channelState, messageJson) {
    return new Promise(function(res) {
      return setTimeout(function() {
        var channelArray = Array.from(SIMULATE_CHANNELS);
        channelArray.forEach(function(channel) {
          if (channel.name === channelState.name && // has same name
          channel !== channelState && // not own channel
          !!channel.messagesCallback && // has subscribers
          channel.time < messageJson.time) {
            channel.messagesCallback(messageJson);
          }
        });
        res();
      }, SIMULATE_DELAY_TIME);
    });
  }
  function onMessage4(channelState, fn) {
    channelState.messagesCallback = fn;
  }
  function canBeUsed4() {
    return true;
  }
  function averageResponseTime4() {
    return SIMULATE_DELAY_TIME;
  }
  var microSeconds5, type4, SIMULATE_CHANNELS, SIMULATE_DELAY_TIME, SimulateMethod;
  var init_simulate = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js"() {
      init_util4();
      microSeconds5 = microSeconds;
      type4 = "simulate";
      SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
      SIMULATE_DELAY_TIME = 5;
      SimulateMethod = {
        create: create4,
        close: close4,
        onMessage: onMessage4,
        postMessage: postMessage4,
        canBeUsed: canBeUsed4,
        type: type4,
        averageResponseTime: averageResponseTime4,
        microSeconds: microSeconds5
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/method-chooser.js
  function chooseMethod(options) {
    var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
    if (options.type) {
      if (options.type === "simulate") {
        return SimulateMethod;
      }
      var ret = chooseMethods.find(function(m) {
        return m.type === options.type;
      });
      if (!ret) throw new Error("method-type " + options.type + " not found");
      else return ret;
    }
    if (!options.webWorkerSupport) {
      chooseMethods = chooseMethods.filter(function(m) {
        return m.type !== "idb";
      });
    }
    var useMethod = chooseMethods.find(function(method) {
      return method.canBeUsed();
    });
    if (!useMethod) {
      throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m) {
        return m.type;
      })));
    } else {
      return useMethod;
    }
  }
  var METHODS;
  var init_method_chooser = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/method-chooser.js"() {
      init_native();
      init_indexed_db();
      init_localstorage();
      init_simulate();
      METHODS = [
        NativeMethod,
        // fastest
        IndexedDBMethod,
        LocalstorageMethod
      ];
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js
  function _post(broadcastChannel, type5, msg) {
    var time = broadcastChannel.method.microSeconds();
    var msgObj = {
      time,
      type: type5,
      data: msg
    };
    var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID;
    return awaitPrepare.then(function() {
      var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
      broadcastChannel._uMP.add(sendPromise);
      sendPromise["catch"]().then(function() {
        return broadcastChannel._uMP["delete"](sendPromise);
      });
      return sendPromise;
    });
  }
  function _prepareChannel(channel) {
    var maybePromise = channel.method.create(channel.name, channel.options);
    if (isPromise2(maybePromise)) {
      channel._prepP = maybePromise;
      maybePromise.then(function(s) {
        channel._state = s;
      });
    } else {
      channel._state = maybePromise;
    }
  }
  function _hasMessageListeners(channel) {
    if (channel._addEL.message.length > 0) return true;
    if (channel._addEL.internal.length > 0) return true;
    return false;
  }
  function _addListenerObject(channel, type5, obj) {
    channel._addEL[type5].push(obj);
    _startListening(channel);
  }
  function _removeListenerObject(channel, type5, obj) {
    channel._addEL[type5] = channel._addEL[type5].filter(function(o) {
      return o !== obj;
    });
    _stopListening(channel);
  }
  function _startListening(channel) {
    if (!channel._iL && _hasMessageListeners(channel)) {
      var listenerFn = function listenerFn2(msgObj) {
        channel._addEL[msgObj.type].forEach(function(listenerObject) {
          if (msgObj.time >= listenerObject.time) {
            listenerObject.fn(msgObj.data);
          }
        });
      };
      var time = channel.method.microSeconds();
      if (channel._prepP) {
        channel._prepP.then(function() {
          channel._iL = true;
          channel.method.onMessage(channel._state, listenerFn, time);
        });
      } else {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      }
    }
  }
  function _stopListening(channel) {
    if (channel._iL && !_hasMessageListeners(channel)) {
      channel._iL = false;
      var time = channel.method.microSeconds();
      channel.method.onMessage(channel._state, null, time);
    }
  }
  var OPEN_BROADCAST_CHANNELS, lastId, BroadcastChannel2, ENFORCED_OPTIONS;
  var init_broadcast_channel = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js"() {
      init_util4();
      init_method_chooser();
      init_options();
      OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
      lastId = 0;
      BroadcastChannel2 = function BroadcastChannel3(name, options) {
        this.id = lastId++;
        OPEN_BROADCAST_CHANNELS.add(this);
        this.name = name;
        if (ENFORCED_OPTIONS) {
          options = ENFORCED_OPTIONS;
        }
        this.options = fillOptionsWithDefaults(options);
        this.method = chooseMethod(this.options);
        this._iL = false;
        this._onML = null;
        this._addEL = {
          message: [],
          internal: []
        };
        this._uMP = /* @__PURE__ */ new Set();
        this._befC = [];
        this._prepP = null;
        _prepareChannel(this);
      };
      BroadcastChannel2._pubkey = true;
      BroadcastChannel2.prototype = {
        postMessage: function postMessage5(msg) {
          if (this.closed) {
            throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
             * In the past when this error appeared, it was really hard to debug.
             * So now we log the msg together with the error so it at least
             * gives some clue about where in your application this happens.
             */
            JSON.stringify(msg));
          }
          return _post(this, "message", msg);
        },
        postInternal: function postInternal(msg) {
          return _post(this, "internal", msg);
        },
        set onmessage(fn) {
          var time = this.method.microSeconds();
          var listenObj = {
            time,
            fn
          };
          _removeListenerObject(this, "message", this._onML);
          if (fn && typeof fn === "function") {
            this._onML = listenObj;
            _addListenerObject(this, "message", listenObj);
          } else {
            this._onML = null;
          }
        },
        addEventListener: function addEventListener2(type5, fn) {
          var time = this.method.microSeconds();
          var listenObj = {
            time,
            fn
          };
          _addListenerObject(this, type5, listenObj);
        },
        removeEventListener: function removeEventListener(type5, fn) {
          var obj = this._addEL[type5].find(function(obj2) {
            return obj2.fn === fn;
          });
          _removeListenerObject(this, type5, obj);
        },
        close: function close5() {
          var _this = this;
          if (this.closed) {
            return;
          }
          OPEN_BROADCAST_CHANNELS["delete"](this);
          this.closed = true;
          var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
          this._onML = null;
          this._addEL.message = [];
          return awaitPrepare.then(function() {
            return Promise.all(Array.from(_this._uMP));
          }).then(function() {
            return Promise.all(_this._befC.map(function(fn) {
              return fn();
            }));
          }).then(function() {
            return _this.method.close(_this._state);
          });
        },
        get type() {
          return this.method.type;
        },
        get isClosed() {
          return this.closed;
        }
      };
    }
  });

  // node_modules/unload/dist/es/browser.js
  function addBrowser(fn) {
    if (typeof WorkerGlobalScope === "function" && self instanceof WorkerGlobalScope) {
      var oldClose = self.close.bind(self);
      self.close = function() {
        fn();
        return oldClose();
      };
    } else {
      if (typeof window.addEventListener !== "function") {
        return;
      }
      window.addEventListener("beforeunload", function() {
        fn();
      }, true);
      window.addEventListener("unload", function() {
        fn();
      }, true);
    }
  }
  var init_browser = __esm({
    "node_modules/unload/dist/es/browser.js"() {
    }
  });

  // node_modules/unload/dist/es/node.js
  function addNode(fn) {
    process.on("exit", function() {
      return fn();
    });
    process.on("beforeExit", function() {
      return fn().then(function() {
        return process.exit();
      });
    });
    process.on("SIGINT", function() {
      return fn().then(function() {
        return process.exit();
      });
    });
    process.on("uncaughtException", function(err) {
      return fn().then(function() {
        console.trace(err);
        process.exit(101);
      });
    });
  }
  var init_node = __esm({
    "node_modules/unload/dist/es/node.js"() {
    }
  });

  // node_modules/unload/dist/es/index.js
  function startListening() {
    if (startedListening) {
      return;
    }
    startedListening = true;
    USE_METHOD(runAll);
  }
  function add(fn) {
    startListening();
    if (typeof fn !== "function") {
      throw new Error("Listener is no function");
    }
    LISTENERS.add(fn);
    var addReturn = {
      remove: function remove2() {
        return LISTENERS["delete"](fn);
      },
      run: function run() {
        LISTENERS["delete"](fn);
        return fn();
      }
    };
    return addReturn;
  }
  function runAll() {
    var promises = [];
    LISTENERS.forEach(function(fn) {
      promises.push(fn());
      LISTENERS["delete"](fn);
    });
    return Promise.all(promises);
  }
  var isNode, USE_METHOD, LISTENERS, startedListening;
  var init_es2 = __esm({
    "node_modules/unload/dist/es/index.js"() {
      init_browser();
      init_node();
      isNode = Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
      USE_METHOD = isNode ? addNode : addBrowser;
      LISTENERS = /* @__PURE__ */ new Set();
      startedListening = false;
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/leader-election-util.js
  function sendLeaderMessage(leaderElector, action) {
    var msgJson = {
      context: "leader",
      action,
      token: leaderElector.token
    };
    return leaderElector.broadcastChannel.postInternal(msgJson);
  }
  function beLeader(leaderElector) {
    leaderElector.isLeader = true;
    leaderElector._hasLeader = true;
    var unloadFn = add(function() {
      return leaderElector.die();
    });
    leaderElector._unl.push(unloadFn);
    var isLeaderListener = function isLeaderListener2(msg) {
      if (msg.context === "leader" && msg.action === "apply") {
        sendLeaderMessage(leaderElector, "tell");
      }
      if (msg.context === "leader" && msg.action === "tell" && !leaderElector._dpLC) {
        leaderElector._dpLC = true;
        leaderElector._dpL();
        sendLeaderMessage(leaderElector, "tell");
      }
    };
    leaderElector.broadcastChannel.addEventListener("internal", isLeaderListener);
    leaderElector._lstns.push(isLeaderListener);
    return sendLeaderMessage(leaderElector, "tell");
  }
  var init_leader_election_util = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/leader-election-util.js"() {
      init_es2();
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/leader-election-web-lock.js
  var LeaderElectionWebLock;
  var init_leader_election_web_lock = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/leader-election-web-lock.js"() {
      init_util4();
      init_leader_election_util();
      LeaderElectionWebLock = function LeaderElectionWebLock2(broadcastChannel, options) {
        var _this = this;
        this.broadcastChannel = broadcastChannel;
        broadcastChannel._befC.push(function() {
          return _this.die();
        });
        this._options = options;
        this.isLeader = false;
        this.isDead = false;
        this.token = randomToken2();
        this._lstns = [];
        this._unl = [];
        this._dpL = function() {
        };
        this._dpLC = false;
        this._wKMC = {};
        this.lN = "pubkey-bc||" + broadcastChannel.method.type + "||" + broadcastChannel.name;
      };
      LeaderElectionWebLock.prototype = {
        hasLeader: function hasLeader() {
          var _this2 = this;
          return navigator.locks.query().then(function(locks) {
            var relevantLocks = locks.held ? locks.held.filter(function(lock2) {
              return lock2.name === _this2.lN;
            }) : [];
            if (relevantLocks && relevantLocks.length > 0) {
              return true;
            } else {
              return false;
            }
          });
        },
        awaitLeadership: function awaitLeadership() {
          var _this3 = this;
          if (!this._wLMP) {
            this._wKMC.c = new AbortController();
            var returnPromise = new Promise(function(res, rej) {
              _this3._wKMC.res = res;
              _this3._wKMC.rej = rej;
            });
            this._wLMP = new Promise(function(res) {
              navigator.locks.request(_this3.lN, {
                signal: _this3._wKMC.c.signal
              }, function() {
                _this3._wKMC.c = void 0;
                beLeader(_this3);
                res();
                return returnPromise;
              })["catch"](function() {
              });
            });
          }
          return this._wLMP;
        },
        set onduplicate(_fn) {
        },
        die: function die() {
          var _this4 = this;
          this._lstns.forEach(function(listener) {
            return _this4.broadcastChannel.removeEventListener("internal", listener);
          });
          this._lstns = [];
          this._unl.forEach(function(uFn) {
            return uFn.remove();
          });
          this._unl = [];
          if (this.isLeader) {
            this.isLeader = false;
          }
          this.isDead = true;
          if (this._wKMC.res) {
            this._wKMC.res();
          }
          if (this._wKMC.c) {
            this._wKMC.c.abort("LeaderElectionWebLock.die() called");
          }
          return sendLeaderMessage(this, "death");
        }
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/leader-election.js
  function _awaitLeadershipOnce(leaderElector) {
    if (leaderElector.isLeader) {
      return PROMISE_RESOLVED_VOID;
    }
    return new Promise(function(res) {
      var resolved = false;
      function finish() {
        if (resolved) {
          return;
        }
        resolved = true;
        leaderElector.broadcastChannel.removeEventListener("internal", whenDeathListener);
        res(true);
      }
      leaderElector.applyOnce().then(function() {
        if (leaderElector.isLeader) {
          finish();
        }
      });
      var _tryOnFallBack = function tryOnFallBack() {
        return sleep(leaderElector._options.fallbackInterval).then(function() {
          if (leaderElector.isDead || resolved) {
            return;
          }
          if (leaderElector.isLeader) {
            finish();
          } else {
            return leaderElector.applyOnce(true).then(function() {
              if (leaderElector.isLeader) {
                finish();
              } else {
                _tryOnFallBack();
              }
            });
          }
        });
      };
      _tryOnFallBack();
      var whenDeathListener = function whenDeathListener2(msg) {
        if (msg.context === "leader" && msg.action === "death") {
          leaderElector._hasLeader = false;
          leaderElector.applyOnce().then(function() {
            if (leaderElector.isLeader) {
              finish();
            }
          });
        }
      };
      leaderElector.broadcastChannel.addEventListener("internal", whenDeathListener);
      leaderElector._lstns.push(whenDeathListener);
    });
  }
  function fillOptionsWithDefaults2(options, channel) {
    if (!options) options = {};
    options = JSON.parse(JSON.stringify(options));
    if (!options.fallbackInterval) {
      options.fallbackInterval = 3e3;
    }
    if (!options.responseTime) {
      options.responseTime = channel.method.averageResponseTime(channel.options);
    }
    return options;
  }
  function createLeaderElection(channel, options) {
    if (channel._leaderElector) {
      throw new Error("BroadcastChannel already has a leader-elector");
    }
    options = fillOptionsWithDefaults2(options, channel);
    var elector = supportsWebLockAPI() ? new LeaderElectionWebLock(channel, options) : new LeaderElection(channel, options);
    channel._befC.push(function() {
      return elector.die();
    });
    channel._leaderElector = elector;
    return elector;
  }
  var LeaderElection;
  var init_leader_election = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/leader-election.js"() {
      init_util4();
      init_leader_election_util();
      init_leader_election_web_lock();
      LeaderElection = function LeaderElection2(broadcastChannel, options) {
        var _this = this;
        this.broadcastChannel = broadcastChannel;
        this._options = options;
        this.isLeader = false;
        this._hasLeader = false;
        this.isDead = false;
        this.token = randomToken2();
        this._aplQ = PROMISE_RESOLVED_VOID;
        this._aplQC = 0;
        this._unl = [];
        this._lstns = [];
        this._dpL = function() {
        };
        this._dpLC = false;
        var hasLeaderListener = function hasLeaderListener2(msg) {
          if (msg.context === "leader") {
            if (msg.action === "death") {
              _this._hasLeader = false;
            }
            if (msg.action === "tell") {
              _this._hasLeader = true;
            }
          }
        };
        this.broadcastChannel.addEventListener("internal", hasLeaderListener);
        this._lstns.push(hasLeaderListener);
      };
      LeaderElection.prototype = {
        hasLeader: function hasLeader2() {
          return Promise.resolve(this._hasLeader);
        },
        /**
         * Returns true if the instance is leader,
         * false if not.
         * @async
         */
        applyOnce: function applyOnce(isFromFallbackInterval) {
          var _this2 = this;
          if (this.isLeader) {
            return sleep(0, true);
          }
          if (this.isDead) {
            return sleep(0, false);
          }
          if (this._aplQC > 1) {
            return this._aplQ;
          }
          var applyRun = function applyRun2() {
            if (_this2.isLeader) {
              return PROMISE_RESOLVED_TRUE;
            }
            var stopCriteria = false;
            var stopCriteriaPromiseResolve;
            var stopCriteriaPromise = new Promise(function(res) {
              stopCriteriaPromiseResolve = function stopCriteriaPromiseResolve2() {
                stopCriteria = true;
                res();
              };
            });
            var handleMessage = function handleMessage2(msg) {
              if (msg.context === "leader" && msg.token != _this2.token) {
                if (msg.action === "apply") {
                  if (msg.token > _this2.token) {
                    stopCriteriaPromiseResolve();
                  }
                }
                if (msg.action === "tell") {
                  stopCriteriaPromiseResolve();
                  _this2._hasLeader = true;
                }
              }
            };
            _this2.broadcastChannel.addEventListener("internal", handleMessage);
            var waitForAnswerTime = isFromFallbackInterval ? _this2._options.responseTime * 4 : _this2._options.responseTime;
            return sendLeaderMessage(_this2, "apply").then(function() {
              return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
                return Promise.reject(new Error());
              })]);
            }).then(function() {
              return sendLeaderMessage(_this2, "apply");
            }).then(function() {
              return Promise.race([sleep(waitForAnswerTime), stopCriteriaPromise.then(function() {
                return Promise.reject(new Error());
              })]);
            })["catch"](function() {
            }).then(function() {
              _this2.broadcastChannel.removeEventListener("internal", handleMessage);
              if (!stopCriteria) {
                return beLeader(_this2).then(function() {
                  return true;
                });
              } else {
                return false;
              }
            });
          };
          this._aplQC = this._aplQC + 1;
          this._aplQ = this._aplQ.then(function() {
            return applyRun();
          }).then(function() {
            _this2._aplQC = _this2._aplQC - 1;
          });
          return this._aplQ.then(function() {
            return _this2.isLeader;
          });
        },
        awaitLeadership: function awaitLeadership2() {
          if (
            /* _awaitLeadershipPromise */
            !this._aLP
          ) {
            this._aLP = _awaitLeadershipOnce(this);
          }
          return this._aLP;
        },
        set onduplicate(fn) {
          this._dpL = fn;
        },
        die: function die2() {
          var _this3 = this;
          this._lstns.forEach(function(listener) {
            return _this3.broadcastChannel.removeEventListener("internal", listener);
          });
          this._lstns = [];
          this._unl.forEach(function(uFn) {
            return uFn.remove();
          });
          this._unl = [];
          if (this.isLeader) {
            this._hasLeader = false;
            this.isLeader = false;
          }
          this.isDead = true;
          return sendLeaderMessage(this, "death");
        }
      };
    }
  });

  // node_modules/broadcast-channel/dist/esbrowser/index.js
  var init_esbrowser = __esm({
    "node_modules/broadcast-channel/dist/esbrowser/index.js"() {
      init_broadcast_channel();
      init_leader_election();
    }
  });

  // node_modules/rxdb/dist/esm/rx-storage-multiinstance.js
  function getBroadcastChannelReference(storageName, databaseInstanceToken, databaseName, refObject) {
    var state = BROADCAST_CHANNEL_BY_TOKEN.get(databaseInstanceToken);
    if (!state) {
      state = {
        /**
         * We have to use the databaseName instead of the databaseInstanceToken
         * in the BroadcastChannel name because different instances must end with the same
         * channel name to be able to broadcast messages between each other.
         */
        bc: new BroadcastChannel2(["RxDB:", storageName, databaseName].join("|")),
        refs: /* @__PURE__ */ new Set()
      };
      BROADCAST_CHANNEL_BY_TOKEN.set(databaseInstanceToken, state);
    }
    state.refs.add(refObject);
    return state.bc;
  }
  function removeBroadcastChannelReference(databaseInstanceToken, refObject) {
    var state = BROADCAST_CHANNEL_BY_TOKEN.get(databaseInstanceToken);
    if (!state) {
      return;
    }
    state.refs.delete(refObject);
    if (state.refs.size === 0) {
      BROADCAST_CHANNEL_BY_TOKEN.delete(databaseInstanceToken);
      return state.bc.close();
    }
  }
  function addRxStorageMultiInstanceSupport(storageName, instanceCreationParams, instance, providedBroadcastChannel) {
    if (!instanceCreationParams.multiInstance) {
      return;
    }
    var broadcastChannel = providedBroadcastChannel ? providedBroadcastChannel : getBroadcastChannelReference(storageName, instanceCreationParams.databaseInstanceToken, instance.databaseName, instance);
    var changesFromOtherInstances$ = new Subject();
    var eventListener = (msg) => {
      if (msg.storageName === storageName && msg.databaseName === instanceCreationParams.databaseName && msg.collectionName === instanceCreationParams.collectionName && msg.version === instanceCreationParams.schema.version) {
        changesFromOtherInstances$.next(msg.eventBulk);
      }
    };
    broadcastChannel.addEventListener("message", eventListener);
    var oldChangestream$ = instance.changeStream();
    var closed = false;
    var sub = oldChangestream$.subscribe((eventBulk) => {
      if (closed) {
        return;
      }
      broadcastChannel.postMessage({
        storageName,
        databaseName: instanceCreationParams.databaseName,
        collectionName: instanceCreationParams.collectionName,
        version: instanceCreationParams.schema.version,
        eventBulk
      });
    });
    instance.changeStream = function() {
      return changesFromOtherInstances$.asObservable().pipe(mergeWith(oldChangestream$));
    };
    var oldClose = instance.close.bind(instance);
    instance.close = async function() {
      closed = true;
      sub.unsubscribe();
      broadcastChannel.removeEventListener("message", eventListener);
      if (!providedBroadcastChannel) {
        await removeBroadcastChannelReference(instanceCreationParams.databaseInstanceToken, instance);
      }
      return oldClose();
    };
    var oldRemove = instance.remove.bind(instance);
    instance.remove = async function() {
      closed = true;
      sub.unsubscribe();
      broadcastChannel.removeEventListener("message", eventListener);
      if (!providedBroadcastChannel) {
        await removeBroadcastChannelReference(instanceCreationParams.databaseInstanceToken, instance);
      }
      return oldRemove();
    };
  }
  var BROADCAST_CHANNEL_BY_TOKEN;
  var init_rx_storage_multiinstance = __esm({
    "node_modules/rxdb/dist/esm/rx-storage-multiinstance.js"() {
      init_esm5();
      init_operators();
      init_esbrowser();
      BROADCAST_CHANNEL_BY_TOKEN = /* @__PURE__ */ new Map();
    }
  });

  // node_modules/rxdb/dist/esm/custom-index.js
  var init_custom_index = __esm({
    "node_modules/rxdb/dist/esm/custom-index.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugin-helpers.js
  var init_plugin_helpers = __esm({
    "node_modules/rxdb/dist/esm/plugin-helpers.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/index.js
  var init_esm2 = __esm({
    "node_modules/rxdb/dist/esm/index.js"() {
      init_plugin();
      init_rx_database();
      init_rx_error();
      init_rx_database_internal_store();
      init_overwritable();
      init_rx_collection();
      init_rx_collection_helper();
      init_rx_document();
      init_rx_change_event();
      init_rx_document_prototype_merge();
      init_rx_query();
      init_rx_query_single_result();
      init_rx_query_helper();
      init_rx_schema();
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_replication_protocol();
      init_rx_storage_multiinstance();
      init_custom_index();
      init_query_planner();
      init_plugin_helpers();
      init_utils();
      init_hooks();
      init_query_cache();
    }
  });

  // node_modules/rxdb/node_modules/dexie/dist/dexie.js
  var require_dexie = __commonJS({
    "node_modules/rxdb/node_modules/dexie/dist/dexie.js"(exports, module) {
      (function(global2, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, global2.Dexie = factory());
      })(exports, (function() {
        "use strict";
        var extendStatics2 = function(d, b) {
          extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
            d2.__proto__ = b2;
          } || function(d2, b2) {
            for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
          };
          return extendStatics2(d, b);
        };
        function __extends2(d, b) {
          if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
          extendStatics2(d, b);
          function __() {
            this.constructor = d;
          }
          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        }
        var __assign = function() {
          __assign = Object.assign || function __assign2(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
          };
          return __assign.apply(this, arguments);
        };
        function __spreadArray2(to, from2, pack) {
          if (pack || arguments.length === 2) for (var i = 0, l = from2.length, ar; i < l; i++) {
            if (ar || !(i in from2)) {
              if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
              ar[i] = from2[i];
            }
          }
          return to.concat(ar || Array.prototype.slice.call(from2));
        }
        var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
        var keys = Object.keys;
        var isArray4 = Array.isArray;
        if (typeof Promise !== "undefined" && !_global.Promise) {
          _global.Promise = Promise;
        }
        function extend(obj, extension) {
          if (typeof extension !== "object")
            return obj;
          keys(extension).forEach(function(key) {
            obj[key] = extension[key];
          });
          return obj;
        }
        var getProto = Object.getPrototypeOf;
        var _hasOwn = {}.hasOwnProperty;
        function hasOwn(obj, prop) {
          return _hasOwn.call(obj, prop);
        }
        function props(proto, extension) {
          if (typeof extension === "function")
            extension = extension(getProto(proto));
          (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
            setProp(proto, key, extension[key]);
          });
        }
        var defineProperty = Object.defineProperty;
        function setProp(obj, prop, functionOrGetSet, options) {
          defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
        }
        function derive(Child) {
          return {
            from: function(Parent) {
              Child.prototype = Object.create(Parent.prototype);
              setProp(Child.prototype, "constructor", Child);
              return {
                extend: props.bind(null, Child.prototype)
              };
            }
          };
        }
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        function getPropertyDescriptor(obj, prop) {
          var pd = getOwnPropertyDescriptor(obj, prop);
          var proto;
          return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
        }
        var _slice = [].slice;
        function slice(args, start, end) {
          return _slice.call(args, start, end);
        }
        function override(origFunc, overridedFactory) {
          return overridedFactory(origFunc);
        }
        function assert2(b) {
          if (!b)
            throw new Error("Assertion Failed");
        }
        function asap$1(fn) {
          if (_global.setImmediate)
            setImmediate(fn);
          else
            setTimeout(fn, 0);
        }
        function arrayToObject(array, extractor) {
          return array.reduce(function(result, item, i) {
            var nameAndValue = extractor(item, i);
            if (nameAndValue)
              result[nameAndValue[0]] = nameAndValue[1];
            return result;
          }, {});
        }
        function getByKeyPath(obj, keyPath) {
          if (typeof keyPath === "string" && hasOwn(obj, keyPath))
            return obj[keyPath];
          if (!keyPath)
            return obj;
          if (typeof keyPath !== "string") {
            var rv = [];
            for (var i = 0, l = keyPath.length; i < l; ++i) {
              var val = getByKeyPath(obj, keyPath[i]);
              rv.push(val);
            }
            return rv;
          }
          var period = keyPath.indexOf(".");
          if (period !== -1) {
            var innerObj = obj[keyPath.substr(0, period)];
            return innerObj == null ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
          }
          return void 0;
        }
        function setByKeyPath(obj, keyPath, value) {
          if (!obj || keyPath === void 0)
            return;
          if ("isFrozen" in Object && Object.isFrozen(obj))
            return;
          if (typeof keyPath !== "string" && "length" in keyPath) {
            assert2(typeof value !== "string" && "length" in value);
            for (var i = 0, l = keyPath.length; i < l; ++i) {
              setByKeyPath(obj, keyPath[i], value[i]);
            }
          } else {
            var period = keyPath.indexOf(".");
            if (period !== -1) {
              var currentKeyPath = keyPath.substr(0, period);
              var remainingKeyPath = keyPath.substr(period + 1);
              if (remainingKeyPath === "")
                if (value === void 0) {
                  if (isArray4(obj) && !isNaN(parseInt(currentKeyPath)))
                    obj.splice(currentKeyPath, 1);
                  else
                    delete obj[currentKeyPath];
                } else
                  obj[currentKeyPath] = value;
              else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj || !hasOwn(obj, currentKeyPath))
                  innerObj = obj[currentKeyPath] = {};
                setByKeyPath(innerObj, remainingKeyPath, value);
              }
            } else {
              if (value === void 0) {
                if (isArray4(obj) && !isNaN(parseInt(keyPath)))
                  obj.splice(keyPath, 1);
                else
                  delete obj[keyPath];
              } else
                obj[keyPath] = value;
            }
          }
        }
        function delByKeyPath(obj, keyPath) {
          if (typeof keyPath === "string")
            setByKeyPath(obj, keyPath, void 0);
          else if ("length" in keyPath)
            [].map.call(keyPath, function(kp) {
              setByKeyPath(obj, kp, void 0);
            });
        }
        function shallowClone(obj) {
          var rv = {};
          for (var m in obj) {
            if (hasOwn(obj, m))
              rv[m] = obj[m];
          }
          return rv;
        }
        var concat3 = [].concat;
        function flatten2(a) {
          return concat3.apply([], a);
        }
        var intrinsicTypeNames = "BigUint64Array,BigInt64Array,Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten2([8, 16, 32, 64].map(function(num) {
          return ["Int", "Uint", "Float"].map(function(t) {
            return t + num + "Array";
          });
        }))).filter(function(t) {
          return _global[t];
        });
        var intrinsicTypes = new Set(intrinsicTypeNames.map(function(t) {
          return _global[t];
        }));
        function cloneSimpleObjectTree(o) {
          var rv = {};
          for (var k in o)
            if (hasOwn(o, k)) {
              var v = o[k];
              rv[k] = !v || typeof v !== "object" || intrinsicTypes.has(v.constructor) ? v : cloneSimpleObjectTree(v);
            }
          return rv;
        }
        function objectIsEmpty(o) {
          for (var k in o)
            if (hasOwn(o, k))
              return false;
          return true;
        }
        var circularRefs = null;
        function deepClone2(any) {
          circularRefs = /* @__PURE__ */ new WeakMap();
          var rv = innerDeepClone(any);
          circularRefs = null;
          return rv;
        }
        function innerDeepClone(x) {
          if (!x || typeof x !== "object")
            return x;
          var rv = circularRefs.get(x);
          if (rv)
            return rv;
          if (isArray4(x)) {
            rv = [];
            circularRefs.set(x, rv);
            for (var i = 0, l = x.length; i < l; ++i) {
              rv.push(innerDeepClone(x[i]));
            }
          } else if (intrinsicTypes.has(x.constructor)) {
            rv = x;
          } else {
            var proto = getProto(x);
            rv = proto === Object.prototype ? {} : Object.create(proto);
            circularRefs.set(x, rv);
            for (var prop in x) {
              if (hasOwn(x, prop)) {
                rv[prop] = innerDeepClone(x[prop]);
              }
            }
          }
          return rv;
        }
        var toString = {}.toString;
        function toStringTag(o) {
          return toString.call(o).slice(8, -1);
        }
        var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
        var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
          var i;
          return x != null && (i = x[iteratorSymbol]) && i.apply(x);
        } : function() {
          return null;
        };
        function delArrayItem(a, x) {
          var i = a.indexOf(x);
          if (i >= 0)
            a.splice(i, 1);
          return i >= 0;
        }
        var NO_CHAR_ARRAY = {};
        function getArrayOf(arrayLike) {
          var i, a, x, it;
          if (arguments.length === 1) {
            if (isArray4(arrayLike))
              return arrayLike.slice();
            if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
              return [arrayLike];
            if (it = getIteratorOf(arrayLike)) {
              a = [];
              while (x = it.next(), !x.done)
                a.push(x.value);
              return a;
            }
            if (arrayLike == null)
              return [arrayLike];
            i = arrayLike.length;
            if (typeof i === "number") {
              a = new Array(i);
              while (i--)
                a[i] = arrayLike[i];
              return a;
            }
            return [arrayLike];
          }
          i = arguments.length;
          a = new Array(i);
          while (i--)
            a[i] = arguments[i];
          return a;
        }
        var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
          return fn[Symbol.toStringTag] === "AsyncFunction";
        } : function() {
          return false;
        };
        var dexieErrorNames = [
          "Modify",
          "Bulk",
          "OpenFailed",
          "VersionChange",
          "Schema",
          "Upgrade",
          "InvalidTable",
          "MissingAPI",
          "NoSuchDatabase",
          "InvalidArgument",
          "SubTransaction",
          "Unsupported",
          "Internal",
          "DatabaseClosed",
          "PrematureCommit",
          "ForeignAwait"
        ];
        var idbDomErrorNames = [
          "Unknown",
          "Constraint",
          "Data",
          "TransactionInactive",
          "ReadOnly",
          "Version",
          "NotFound",
          "InvalidState",
          "InvalidAccess",
          "Abort",
          "Timeout",
          "QuotaExceeded",
          "Syntax",
          "DataClone"
        ];
        var errorList = dexieErrorNames.concat(idbDomErrorNames);
        var defaultTexts = {
          VersionChanged: "Database version changed by other database connection",
          DatabaseClosed: "Database has been closed",
          Abort: "Transaction aborted",
          TransactionInactive: "Transaction has already completed or failed",
          MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
        };
        function DexieError(name, msg) {
          this.name = name;
          this.message = msg;
        }
        derive(DexieError).from(Error).extend({
          toString: function() {
            return this.name + ": " + this.message;
          }
        });
        function getMultiErrorMessage(msg, failures) {
          return msg + ". Errors: " + Object.keys(failures).map(function(key) {
            return failures[key].toString();
          }).filter(function(v, i, s) {
            return s.indexOf(v) === i;
          }).join("\n");
        }
        function ModifyError(msg, failures, successCount, failedKeys) {
          this.failures = failures;
          this.failedKeys = failedKeys;
          this.successCount = successCount;
          this.message = getMultiErrorMessage(msg, failures);
        }
        derive(ModifyError).from(DexieError);
        function BulkError(msg, failures) {
          this.name = "BulkError";
          this.failures = Object.keys(failures).map(function(pos) {
            return failures[pos];
          });
          this.failuresByPos = failures;
          this.message = getMultiErrorMessage(msg, this.failures);
        }
        derive(BulkError).from(DexieError);
        var errnames = errorList.reduce(function(obj, name) {
          return obj[name] = name + "Error", obj;
        }, {});
        var BaseException = DexieError;
        var exceptions = errorList.reduce(function(obj, name) {
          var fullName = name + "Error";
          function DexieError2(msgOrInner, inner) {
            this.name = fullName;
            if (!msgOrInner) {
              this.message = defaultTexts[name] || fullName;
              this.inner = null;
            } else if (typeof msgOrInner === "string") {
              this.message = "".concat(msgOrInner).concat(!inner ? "" : "\n " + inner);
              this.inner = inner || null;
            } else if (typeof msgOrInner === "object") {
              this.message = "".concat(msgOrInner.name, " ").concat(msgOrInner.message);
              this.inner = msgOrInner;
            }
          }
          derive(DexieError2).from(BaseException);
          obj[name] = DexieError2;
          return obj;
        }, {});
        exceptions.Syntax = SyntaxError;
        exceptions.Type = TypeError;
        exceptions.Range = RangeError;
        var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
          obj[name + "Error"] = exceptions[name];
          return obj;
        }, {});
        function mapError(domError, message) {
          if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
            return domError;
          var rv = new exceptionMap[domError.name](message || domError.message, domError);
          if ("stack" in domError) {
            setProp(rv, "stack", { get: function() {
              return this.inner.stack;
            } });
          }
          return rv;
        }
        var fullNameExceptions = errorList.reduce(function(obj, name) {
          if (["Syntax", "Type", "Range"].indexOf(name) === -1)
            obj[name + "Error"] = exceptions[name];
          return obj;
        }, {});
        fullNameExceptions.ModifyError = ModifyError;
        fullNameExceptions.DexieError = DexieError;
        fullNameExceptions.BulkError = BulkError;
        function nop() {
        }
        function mirror(val) {
          return val;
        }
        function pureFunctionChain(f1, f2) {
          if (f1 == null || f1 === mirror)
            return f2;
          return function(val) {
            return f2(f1(val));
          };
        }
        function callBoth(on1, on2) {
          return function() {
            on1.apply(this, arguments);
            on2.apply(this, arguments);
          };
        }
        function hookCreatingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            var res = f1.apply(this, arguments);
            if (res !== void 0)
              arguments[0] = res;
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res2 !== void 0 ? res2 : res;
          };
        }
        function hookDeletingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            f1.apply(this, arguments);
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = this.onerror = null;
            f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
          };
        }
        function hookUpdatingChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function(modifications) {
            var res = f1.apply(this, arguments);
            extend(modifications, res);
            var onsuccess = this.onsuccess, onerror = this.onerror;
            this.onsuccess = null;
            this.onerror = null;
            var res2 = f2.apply(this, arguments);
            if (onsuccess)
              this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
            if (onerror)
              this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
            return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
          };
        }
        function reverseStoppableEventChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            if (f2.apply(this, arguments) === false)
              return false;
            return f1.apply(this, arguments);
          };
        }
        function promisableChain(f1, f2) {
          if (f1 === nop)
            return f2;
          return function() {
            var res = f1.apply(this, arguments);
            if (res && typeof res.then === "function") {
              var thiz = this, i = arguments.length, args = new Array(i);
              while (i--)
                args[i] = arguments[i];
              return res.then(function() {
                return f2.apply(thiz, args);
              });
            }
            return f2.apply(this, arguments);
          };
        }
        var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
        function setDebug(value, filter2) {
          debug = value;
        }
        var INTERNAL = {};
        var ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : (function() {
          var globalP = Promise.resolve();
          if (typeof crypto === "undefined" || !crypto.subtle)
            return [globalP, getProto(globalP), globalP];
          var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
          return [
            nativeP,
            getProto(nativeP),
            globalP
          ];
        })(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
        var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
        var patchGlobalPromise = !!resolvedGlobalPromise;
        function schedulePhysicalTick() {
          queueMicrotask(physicalTick);
        }
        var asap = function(callback, args) {
          microtickQueue.push([callback, args]);
          if (needsNewPhysicalTick) {
            schedulePhysicalTick();
            needsNewPhysicalTick = false;
          }
        };
        var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], rejectionMapper = mirror;
        var globalPSD = {
          id: "global",
          global: true,
          ref: 0,
          unhandleds: [],
          onunhandled: nop,
          pgp: false,
          env: {},
          finalize: nop
        };
        var PSD = globalPSD;
        var microtickQueue = [];
        var numScheduledCalls = 0;
        var tickFinalizers = [];
        function DexiePromise(fn) {
          if (typeof this !== "object")
            throw new TypeError("Promises must be constructed via new");
          this._listeners = [];
          this._lib = false;
          var psd = this._PSD = PSD;
          if (typeof fn !== "function") {
            if (fn !== INTERNAL)
              throw new TypeError("Not a function");
            this._state = arguments[1];
            this._value = arguments[2];
            if (this._state === false)
              handleRejection(this, this._value);
            return;
          }
          this._state = null;
          this._value = null;
          ++psd.ref;
          executePromiseTask(this, fn);
        }
        var thenProp = {
          get: function() {
            var psd = PSD, microTaskId = totalEchoes;
            function then(onFulfilled, onRejected) {
              var _this = this;
              var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
              var cleanup = possibleAwait && !decrementExpectedAwaits();
              var rv = new DexiePromise(function(resolve2, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve2, reject, psd));
              });
              if (this._consoleTask)
                rv._consoleTask = this._consoleTask;
              return rv;
            }
            then.prototype = INTERNAL;
            return then;
          },
          set: function(value) {
            setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
              get: function() {
                return value;
              },
              set: thenProp.set
            });
          }
        };
        props(DexiePromise.prototype, {
          then: thenProp,
          _then: function(onFulfilled, onRejected) {
            propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
          },
          catch: function(onRejected) {
            if (arguments.length === 1)
              return this.then(null, onRejected);
            var type6 = arguments[0], handler = arguments[1];
            return typeof type6 === "function" ? this.then(null, function(err) {
              return err instanceof type6 ? handler(err) : PromiseReject(err);
            }) : this.then(null, function(err) {
              return err && err.name === type6 ? handler(err) : PromiseReject(err);
            });
          },
          finally: function(onFinally) {
            return this.then(function(value) {
              return DexiePromise.resolve(onFinally()).then(function() {
                return value;
              });
            }, function(err) {
              return DexiePromise.resolve(onFinally()).then(function() {
                return PromiseReject(err);
              });
            });
          },
          timeout: function(ms, msg) {
            var _this = this;
            return ms < Infinity ? new DexiePromise(function(resolve2, reject) {
              var handle = setTimeout(function() {
                return reject(new exceptions.Timeout(msg));
              }, ms);
              _this.then(resolve2, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
          }
        });
        if (typeof Symbol !== "undefined" && Symbol.toStringTag)
          setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
        globalPSD.env = snapShot();
        function Listener(onFulfilled, onRejected, resolve2, reject, zone) {
          this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
          this.onRejected = typeof onRejected === "function" ? onRejected : null;
          this.resolve = resolve2;
          this.reject = reject;
          this.psd = zone;
        }
        props(DexiePromise, {
          all: function() {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve2, reject) {
              if (values.length === 0)
                resolve2([]);
              var remaining = values.length;
              values.forEach(function(a, i) {
                return DexiePromise.resolve(a).then(function(x) {
                  values[i] = x;
                  if (!--remaining)
                    resolve2(values);
                }, reject);
              });
            });
          },
          resolve: function(value) {
            if (value instanceof DexiePromise)
              return value;
            if (value && typeof value.then === "function")
              return new DexiePromise(function(resolve2, reject) {
                value.then(resolve2, reject);
              });
            var rv = new DexiePromise(INTERNAL, true, value);
            return rv;
          },
          reject: PromiseReject,
          race: function() {
            var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
            return new DexiePromise(function(resolve2, reject) {
              values.map(function(value) {
                return DexiePromise.resolve(value).then(resolve2, reject);
              });
            });
          },
          PSD: {
            get: function() {
              return PSD;
            },
            set: function(value) {
              return PSD = value;
            }
          },
          totalEchoes: { get: function() {
            return totalEchoes;
          } },
          newPSD: newScope,
          usePSD,
          scheduler: {
            get: function() {
              return asap;
            },
            set: function(value) {
              asap = value;
            }
          },
          rejectionMapper: {
            get: function() {
              return rejectionMapper;
            },
            set: function(value) {
              rejectionMapper = value;
            }
          },
          follow: function(fn, zoneProps) {
            return new DexiePromise(function(resolve2, reject) {
              return newScope(function(resolve3, reject2) {
                var psd = PSD;
                psd.unhandleds = [];
                psd.onunhandled = reject2;
                psd.finalize = callBoth(function() {
                  var _this = this;
                  run_at_end_of_this_or_next_physical_tick(function() {
                    _this.unhandleds.length === 0 ? resolve3() : reject2(_this.unhandleds[0]);
                  });
                }, psd.finalize);
                fn();
              }, zoneProps, resolve2, reject);
            });
          }
        });
        if (NativePromise) {
          if (NativePromise.allSettled)
            setProp(DexiePromise, "allSettled", function() {
              var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
              return new DexiePromise(function(resolve2) {
                if (possiblePromises.length === 0)
                  resolve2([]);
                var remaining = possiblePromises.length;
                var results = new Array(remaining);
                possiblePromises.forEach(function(p, i) {
                  return DexiePromise.resolve(p).then(function(value) {
                    return results[i] = { status: "fulfilled", value };
                  }, function(reason) {
                    return results[i] = { status: "rejected", reason };
                  }).then(function() {
                    return --remaining || resolve2(results);
                  });
                });
              });
            });
          if (NativePromise.any && typeof AggregateError !== "undefined")
            setProp(DexiePromise, "any", function() {
              var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
              return new DexiePromise(function(resolve2, reject) {
                if (possiblePromises.length === 0)
                  reject(new AggregateError([]));
                var remaining = possiblePromises.length;
                var failures = new Array(remaining);
                possiblePromises.forEach(function(p, i) {
                  return DexiePromise.resolve(p).then(function(value) {
                    return resolve2(value);
                  }, function(failure) {
                    failures[i] = failure;
                    if (!--remaining)
                      reject(new AggregateError(failures));
                  });
                });
              });
            });
          if (NativePromise.withResolvers)
            DexiePromise.withResolvers = NativePromise.withResolvers;
        }
        function executePromiseTask(promise, fn) {
          try {
            fn(function(value) {
              if (promise._state !== null)
                return;
              if (value === promise)
                throw new TypeError("A promise cannot be resolved with itself.");
              var shouldExecuteTick = promise._lib && beginMicroTickScope();
              if (value && typeof value.then === "function") {
                executePromiseTask(promise, function(resolve2, reject) {
                  value instanceof DexiePromise ? value._then(resolve2, reject) : value.then(resolve2, reject);
                });
              } else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
              }
              if (shouldExecuteTick)
                endMicroTickScope();
            }, handleRejection.bind(null, promise));
          } catch (ex) {
            handleRejection(promise, ex);
          }
        }
        function handleRejection(promise, reason) {
          rejectingErrors.push(reason);
          if (promise._state !== null)
            return;
          var shouldExecuteTick = promise._lib && beginMicroTickScope();
          reason = rejectionMapper(reason);
          promise._state = false;
          promise._value = reason;
          addPossiblyUnhandledError(promise);
          propagateAllListeners(promise);
          if (shouldExecuteTick)
            endMicroTickScope();
        }
        function propagateAllListeners(promise) {
          var listeners = promise._listeners;
          promise._listeners = [];
          for (var i = 0, len = listeners.length; i < len; ++i) {
            propagateToListener(promise, listeners[i]);
          }
          var psd = promise._PSD;
          --psd.ref || psd.finalize();
          if (numScheduledCalls === 0) {
            ++numScheduledCalls;
            asap(function() {
              if (--numScheduledCalls === 0)
                finalizePhysicalTick();
            }, []);
          }
        }
        function propagateToListener(promise, listener) {
          if (promise._state === null) {
            promise._listeners.push(listener);
            return;
          }
          var cb = promise._state ? listener.onFulfilled : listener.onRejected;
          if (cb === null) {
            return (promise._state ? listener.resolve : listener.reject)(promise._value);
          }
          ++listener.psd.ref;
          ++numScheduledCalls;
          asap(callListener, [cb, promise, listener]);
        }
        function callListener(cb, promise, listener) {
          try {
            var ret, value = promise._value;
            if (!promise._state && rejectingErrors.length)
              rejectingErrors = [];
            ret = debug && promise._consoleTask ? promise._consoleTask.run(function() {
              return cb(value);
            }) : cb(value);
            if (!promise._state && rejectingErrors.indexOf(value) === -1) {
              markErrorAsHandled(promise);
            }
            listener.resolve(ret);
          } catch (e) {
            listener.reject(e);
          } finally {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
            --listener.psd.ref || listener.psd.finalize();
          }
        }
        function physicalTick() {
          usePSD(globalPSD, function() {
            beginMicroTickScope() && endMicroTickScope();
          });
        }
        function beginMicroTickScope() {
          var wasRootExec = isOutsideMicroTick;
          isOutsideMicroTick = false;
          needsNewPhysicalTick = false;
          return wasRootExec;
        }
        function endMicroTickScope() {
          var callbacks, i, l;
          do {
            while (microtickQueue.length > 0) {
              callbacks = microtickQueue;
              microtickQueue = [];
              l = callbacks.length;
              for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
              }
            }
          } while (microtickQueue.length > 0);
          isOutsideMicroTick = true;
          needsNewPhysicalTick = true;
        }
        function finalizePhysicalTick() {
          var unhandledErrs = unhandledErrors;
          unhandledErrors = [];
          unhandledErrs.forEach(function(p) {
            p._PSD.onunhandled.call(null, p._value, p);
          });
          var finalizers = tickFinalizers.slice(0);
          var i = finalizers.length;
          while (i)
            finalizers[--i]();
        }
        function run_at_end_of_this_or_next_physical_tick(fn) {
          function finalizer() {
            fn();
            tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
          }
          tickFinalizers.push(finalizer);
          ++numScheduledCalls;
          asap(function() {
            if (--numScheduledCalls === 0)
              finalizePhysicalTick();
          }, []);
        }
        function addPossiblyUnhandledError(promise) {
          if (!unhandledErrors.some(function(p) {
            return p._value === promise._value;
          }))
            unhandledErrors.push(promise);
        }
        function markErrorAsHandled(promise) {
          var i = unhandledErrors.length;
          while (i)
            if (unhandledErrors[--i]._value === promise._value) {
              unhandledErrors.splice(i, 1);
              return;
            }
        }
        function PromiseReject(reason) {
          return new DexiePromise(INTERNAL, false, reason);
        }
        function wrap(fn, errorCatcher) {
          var psd = PSD;
          return function() {
            var wasRootExec = beginMicroTickScope(), outerScope = PSD;
            try {
              switchToZone(psd, true);
              return fn.apply(this, arguments);
            } catch (e) {
              errorCatcher && errorCatcher(e);
            } finally {
              switchToZone(outerScope, false);
              if (wasRootExec)
                endMicroTickScope();
            }
          };
        }
        var task = { awaits: 0, echoes: 0, id: 0 };
        var taskCounter = 0;
        var zoneStack = [];
        var zoneEchoes = 0;
        var totalEchoes = 0;
        var zone_id_counter = 0;
        function newScope(fn, props2, a1, a2) {
          var parent = PSD, psd = Object.create(parent);
          psd.parent = parent;
          psd.ref = 0;
          psd.global = false;
          psd.id = ++zone_id_counter;
          globalPSD.env;
          psd.env = patchGlobalPromise ? {
            Promise: DexiePromise,
            PromiseProp: { value: DexiePromise, configurable: true, writable: true },
            all: DexiePromise.all,
            race: DexiePromise.race,
            allSettled: DexiePromise.allSettled,
            any: DexiePromise.any,
            resolve: DexiePromise.resolve,
            reject: DexiePromise.reject
          } : {};
          if (props2)
            extend(psd, props2);
          ++parent.ref;
          psd.finalize = function() {
            --this.parent.ref || this.parent.finalize();
          };
          var rv = usePSD(psd, fn, a1, a2);
          if (psd.ref === 0)
            psd.finalize();
          return rv;
        }
        function incrementExpectedAwaits() {
          if (!task.id)
            task.id = ++taskCounter;
          ++task.awaits;
          task.echoes += ZONE_ECHO_LIMIT;
          return task.id;
        }
        function decrementExpectedAwaits() {
          if (!task.awaits)
            return false;
          if (--task.awaits === 0)
            task.id = 0;
          task.echoes = task.awaits * ZONE_ECHO_LIMIT;
          return true;
        }
        if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
          incrementExpectedAwaits = decrementExpectedAwaits = nop;
        }
        function onPossibleParallellAsync(possiblePromise) {
          if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
            incrementExpectedAwaits();
            return possiblePromise.then(function(x) {
              decrementExpectedAwaits();
              return x;
            }, function(e) {
              decrementExpectedAwaits();
              return rejection(e);
            });
          }
          return possiblePromise;
        }
        function zoneEnterEcho(targetZone) {
          ++totalEchoes;
          if (!task.echoes || --task.echoes === 0) {
            task.echoes = task.awaits = task.id = 0;
          }
          zoneStack.push(PSD);
          switchToZone(targetZone, true);
        }
        function zoneLeaveEcho() {
          var zone = zoneStack[zoneStack.length - 1];
          zoneStack.pop();
          switchToZone(zone, false);
        }
        function switchToZone(targetZone, bEnteringZone) {
          var currentZone = PSD;
          if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
            queueMicrotask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
          }
          if (targetZone === PSD)
            return;
          PSD = targetZone;
          if (currentZone === globalPSD)
            globalPSD.env = snapShot();
          if (patchGlobalPromise) {
            var GlobalPromise = globalPSD.env.Promise;
            var targetEnv = targetZone.env;
            if (currentZone.global || targetZone.global) {
              Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
              GlobalPromise.all = targetEnv.all;
              GlobalPromise.race = targetEnv.race;
              GlobalPromise.resolve = targetEnv.resolve;
              GlobalPromise.reject = targetEnv.reject;
              if (targetEnv.allSettled)
                GlobalPromise.allSettled = targetEnv.allSettled;
              if (targetEnv.any)
                GlobalPromise.any = targetEnv.any;
            }
          }
        }
        function snapShot() {
          var GlobalPromise = _global.Promise;
          return patchGlobalPromise ? {
            Promise: GlobalPromise,
            PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
            all: GlobalPromise.all,
            race: GlobalPromise.race,
            allSettled: GlobalPromise.allSettled,
            any: GlobalPromise.any,
            resolve: GlobalPromise.resolve,
            reject: GlobalPromise.reject
          } : {};
        }
        function usePSD(psd, fn, a1, a2, a3) {
          var outerScope = PSD;
          try {
            switchToZone(psd, true);
            return fn(a1, a2, a3);
          } finally {
            switchToZone(outerScope, false);
          }
        }
        function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
          return typeof fn !== "function" ? fn : function() {
            var outerZone = PSD;
            if (possibleAwait)
              incrementExpectedAwaits();
            switchToZone(zone, true);
            try {
              return fn.apply(this, arguments);
            } finally {
              switchToZone(outerZone, false);
              if (cleanup)
                queueMicrotask(decrementExpectedAwaits);
            }
          };
        }
        function execInGlobalContext(cb) {
          if (Promise === NativePromise && task.echoes === 0) {
            if (zoneEchoes === 0) {
              cb();
            } else {
              enqueueNativeMicroTask(cb);
            }
          } else {
            setTimeout(cb, 0);
          }
        }
        var rejection = DexiePromise.reject;
        function tempTransaction(db, mode, storeNames, fn) {
          if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
            if (db._state.openComplete) {
              return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
            }
            if (!db._state.isBeingOpened) {
              if (!db._state.autoOpen)
                return rejection(new exceptions.DatabaseClosed());
              db.open().catch(nop);
            }
            return db._state.dbReadyPromise.then(function() {
              return tempTransaction(db, mode, storeNames, fn);
            });
          } else {
            var trans = db._createTransaction(mode, storeNames, db._dbSchema);
            try {
              trans.create();
              db._state.PR1398_maxLoop = 3;
            } catch (ex) {
              if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                console.warn("Dexie: Need to reopen db");
                db.close({ disableAutoOpen: false });
                return db.open().then(function() {
                  return tempTransaction(db, mode, storeNames, fn);
                });
              }
              return rejection(ex);
            }
            return trans._promise(mode, function(resolve2, reject) {
              return newScope(function() {
                PSD.trans = trans;
                return fn(resolve2, reject, trans);
              });
            }).then(function(result) {
              if (mode === "readwrite")
                try {
                  trans.idbtrans.commit();
                } catch (_a2) {
                }
              return mode === "readonly" ? result : trans._completion.then(function() {
                return result;
              });
            });
          }
        }
        var DEXIE_VERSION = "4.0.10";
        var maxString = String.fromCharCode(65535);
        var minKey = -Infinity;
        var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
        var STRING_EXPECTED = "String expected.";
        var connections = [];
        var DBNAMES_DB = "__dbnames";
        var READONLY = "readonly";
        var READWRITE = "readwrite";
        function combine(filter1, filter2) {
          return filter1 ? filter2 ? function() {
            return filter1.apply(this, arguments) && filter2.apply(this, arguments);
          } : filter1 : filter2;
        }
        var AnyRange = {
          type: 3,
          lower: -Infinity,
          lowerOpen: false,
          upper: [[]],
          upperOpen: false
        };
        function workaroundForUndefinedPrimKey(keyPath) {
          return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
            if (obj[keyPath] === void 0 && keyPath in obj) {
              obj = deepClone2(obj);
              delete obj[keyPath];
            }
            return obj;
          } : function(obj) {
            return obj;
          };
        }
        function Entity2() {
          throw exceptions.Type();
        }
        function cmp2(a, b) {
          try {
            var ta = type5(a);
            var tb = type5(b);
            if (ta !== tb) {
              if (ta === "Array")
                return 1;
              if (tb === "Array")
                return -1;
              if (ta === "binary")
                return 1;
              if (tb === "binary")
                return -1;
              if (ta === "string")
                return 1;
              if (tb === "string")
                return -1;
              if (ta === "Date")
                return 1;
              if (tb !== "Date")
                return NaN;
              return -1;
            }
            switch (ta) {
              case "number":
              case "Date":
              case "string":
                return a > b ? 1 : a < b ? -1 : 0;
              case "binary": {
                return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
              }
              case "Array":
                return compareArrays(a, b);
            }
          } catch (_a2) {
          }
          return NaN;
        }
        function compareArrays(a, b) {
          var al = a.length;
          var bl = b.length;
          var l = al < bl ? al : bl;
          for (var i = 0; i < l; ++i) {
            var res = cmp2(a[i], b[i]);
            if (res !== 0)
              return res;
          }
          return al === bl ? 0 : al < bl ? -1 : 1;
        }
        function compareUint8Arrays(a, b) {
          var al = a.length;
          var bl = b.length;
          var l = al < bl ? al : bl;
          for (var i = 0; i < l; ++i) {
            if (a[i] !== b[i])
              return a[i] < b[i] ? -1 : 1;
          }
          return al === bl ? 0 : al < bl ? -1 : 1;
        }
        function type5(x) {
          var t = typeof x;
          if (t !== "object")
            return t;
          if (ArrayBuffer.isView(x))
            return "binary";
          var tsTag = toStringTag(x);
          return tsTag === "ArrayBuffer" ? "binary" : tsTag;
        }
        function getUint8Array(a) {
          if (a instanceof Uint8Array)
            return a;
          if (ArrayBuffer.isView(a))
            return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
          return new Uint8Array(a);
        }
        var Table = (function() {
          function Table2() {
          }
          Table2.prototype._trans = function(mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            var tableName = this.name;
            var task2 = debug && typeof console !== "undefined" && console.createTask && console.createTask("Dexie: ".concat(mode === "readonly" ? "read" : "write", " ").concat(this.name));
            function checkTableInTransaction(resolve2, reject, trans2) {
              if (!trans2.schema[tableName])
                throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
              return fn(trans2.idbtrans, trans2);
            }
            var wasRootExec = beginMicroTickScope();
            try {
              var p = trans && trans.db._novip === this.db._novip ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
                return trans._promise(mode, checkTableInTransaction, writeLocked);
              }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
              if (task2) {
                p._consoleTask = task2;
                p = p.catch(function(err) {
                  console.trace(err);
                  return rejection(err);
                });
              }
              return p;
            } finally {
              if (wasRootExec)
                endMicroTickScope();
            }
          };
          Table2.prototype.get = function(keyOrCrit, cb) {
            var _this = this;
            if (keyOrCrit && keyOrCrit.constructor === Object)
              return this.where(keyOrCrit).first(cb);
            if (keyOrCrit == null)
              return rejection(new exceptions.Type("Invalid argument to Table.get()"));
            return this._trans("readonly", function(trans) {
              return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
                return _this.hook.reading.fire(res);
              });
            }).then(cb);
          };
          Table2.prototype.where = function(indexOrCrit) {
            if (typeof indexOrCrit === "string")
              return new this.db.WhereClause(this, indexOrCrit);
            if (isArray4(indexOrCrit))
              return new this.db.WhereClause(this, "[".concat(indexOrCrit.join("+"), "]"));
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
              return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
              if (ix.compound && keyPaths.every(function(keyPath) {
                return ix.keyPath.indexOf(keyPath) >= 0;
              })) {
                for (var i = 0; i < keyPaths.length; ++i) {
                  if (keyPaths.indexOf(ix.keyPath[i]) === -1)
                    return false;
                }
                return true;
              }
              return false;
            }).sort(function(a, b) {
              return a.keyPath.length - b.keyPath.length;
            })[0];
            if (compoundIndex && this.db._maxKey !== maxString) {
              var keyPathsInValidOrder = compoundIndex.keyPath.slice(0, keyPaths.length);
              return this.where(keyPathsInValidOrder).equals(keyPathsInValidOrder.map(function(kp) {
                return indexOrCrit[kp];
              }));
            }
            if (!compoundIndex && debug)
              console.warn("The query ".concat(JSON.stringify(indexOrCrit), " on ").concat(this.name, " would benefit from a ") + "compound index [".concat(keyPaths.join("+"), "]"));
            var idxByName = this.schema.idxByName;
            function equals(a, b) {
              return cmp2(a, b) === 0;
            }
            var _a2 = keyPaths.reduce(function(_a3, keyPath) {
              var prevIndex = _a3[0], prevFilterFn = _a3[1];
              var index = idxByName[keyPath];
              var value = indexOrCrit[keyPath];
              return [
                prevIndex || index,
                prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
                  var prop = getByKeyPath(x, keyPath);
                  return isArray4(prop) && prop.some(function(item) {
                    return equals(value, item);
                  });
                } : function(x) {
                  return equals(value, getByKeyPath(x, keyPath));
                }) : prevFilterFn
              ];
            }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
            return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
          };
          Table2.prototype.filter = function(filterFunction) {
            return this.toCollection().and(filterFunction);
          };
          Table2.prototype.count = function(thenShortcut) {
            return this.toCollection().count(thenShortcut);
          };
          Table2.prototype.offset = function(offset) {
            return this.toCollection().offset(offset);
          };
          Table2.prototype.limit = function(numRows) {
            return this.toCollection().limit(numRows);
          };
          Table2.prototype.each = function(callback) {
            return this.toCollection().each(callback);
          };
          Table2.prototype.toArray = function(thenShortcut) {
            return this.toCollection().toArray(thenShortcut);
          };
          Table2.prototype.toCollection = function() {
            return new this.db.Collection(new this.db.WhereClause(this));
          };
          Table2.prototype.orderBy = function(index) {
            return new this.db.Collection(new this.db.WhereClause(this, isArray4(index) ? "[".concat(index.join("+"), "]") : index));
          };
          Table2.prototype.reverse = function() {
            return this.toCollection().reverse();
          };
          Table2.prototype.mapToClass = function(constructor) {
            var _a2 = this, db = _a2.db, tableName = _a2.name;
            this.schema.mappedClass = constructor;
            if (constructor.prototype instanceof Entity2) {
              constructor = (function(_super) {
                __extends2(class_1, _super);
                function class_1() {
                  return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(class_1.prototype, "db", {
                  get: function() {
                    return db;
                  },
                  enumerable: false,
                  configurable: true
                });
                class_1.prototype.table = function() {
                  return tableName;
                };
                return class_1;
              })(constructor);
            }
            var inheritedProps = /* @__PURE__ */ new Set();
            for (var proto = constructor.prototype; proto; proto = getProto(proto)) {
              Object.getOwnPropertyNames(proto).forEach(function(propName) {
                return inheritedProps.add(propName);
              });
            }
            var readHook = function(obj) {
              if (!obj)
                return obj;
              var res = Object.create(constructor.prototype);
              for (var m in obj)
                if (!inheritedProps.has(m))
                  try {
                    res[m] = obj[m];
                  } catch (_) {
                  }
              return res;
            };
            if (this.schema.readHook) {
              this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
          };
          Table2.prototype.defineClass = function() {
            function Class(content) {
              extend(this, content);
            }
            return this.mapToClass(Class);
          };
          Table2.prototype.add = function(obj, key) {
            var _this = this;
            var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
              objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
            }).then(function(lastResult) {
              if (keyPath) {
                try {
                  setByKeyPath(obj, keyPath, lastResult);
                } catch (_) {
                }
              }
              return lastResult;
            });
          };
          Table2.prototype.update = function(keyOrObject, modifications) {
            if (typeof keyOrObject === "object" && !isArray4(keyOrObject)) {
              var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
              if (key === void 0)
                return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
              return this.where(":id").equals(key).modify(modifications);
            } else {
              return this.where(":id").equals(keyOrObject).modify(modifications);
            }
          };
          Table2.prototype.put = function(obj, key) {
            var _this = this;
            var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
            var objToAdd = obj;
            if (keyPath && auto) {
              objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
            }
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
            }).then(function(lastResult) {
              if (keyPath) {
                try {
                  setByKeyPath(obj, keyPath, lastResult);
                } catch (_) {
                }
              }
              return lastResult;
            });
          };
          Table2.prototype.delete = function(key) {
            var _this = this;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "delete", keys: [key] });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
            });
          };
          Table2.prototype.clear = function() {
            var _this = this;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange });
            }).then(function(res) {
              return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
            });
          };
          Table2.prototype.bulkGet = function(keys2) {
            var _this = this;
            return this._trans("readonly", function(trans) {
              return _this.core.getMany({
                keys: keys2,
                trans
              }).then(function(result) {
                return result.map(function(res) {
                  return _this.hook.reading.fire(res);
                });
              });
            });
          };
          Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
            var _this = this;
            var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
            options = options || (keys2 ? void 0 : keysOrOptions);
            var wantResults = options ? options.allKeys : void 0;
            return this._trans("readwrite", function(trans) {
              var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
              if (keyPath && keys2)
                throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
              if (keys2 && keys2.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
              var numObjects = objects.length;
              var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
              return _this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(function(_a3) {
                var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                  return result;
                throw new BulkError("".concat(_this.name, ".bulkAdd(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
              });
            });
          };
          Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
            var _this = this;
            var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
            options = options || (keys2 ? void 0 : keysOrOptions);
            var wantResults = options ? options.allKeys : void 0;
            return this._trans("readwrite", function(trans) {
              var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
              if (keyPath && keys2)
                throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
              if (keys2 && keys2.length !== objects.length)
                throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
              var numObjects = objects.length;
              var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
              return _this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(function(_a3) {
                var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
                var result = wantResults ? results : lastResult;
                if (numFailures === 0)
                  return result;
                throw new BulkError("".concat(_this.name, ".bulkPut(): ").concat(numFailures, " of ").concat(numObjects, " operations failed"), failures);
              });
            });
          };
          Table2.prototype.bulkUpdate = function(keysAndChanges) {
            var _this = this;
            var coreTable = this.core;
            var keys2 = keysAndChanges.map(function(entry) {
              return entry.key;
            });
            var changeSpecs = keysAndChanges.map(function(entry) {
              return entry.changes;
            });
            var offsetMap = [];
            return this._trans("readwrite", function(trans) {
              return coreTable.getMany({ trans, keys: keys2, cache: "clone" }).then(function(objs) {
                var resultKeys = [];
                var resultObjs = [];
                keysAndChanges.forEach(function(_a2, idx) {
                  var key = _a2.key, changes = _a2.changes;
                  var obj = objs[idx];
                  if (obj) {
                    for (var _i = 0, _b = Object.keys(changes); _i < _b.length; _i++) {
                      var keyPath = _b[_i];
                      var value = changes[keyPath];
                      if (keyPath === _this.schema.primKey.keyPath) {
                        if (cmp2(value, key) !== 0) {
                          throw new exceptions.Constraint("Cannot update primary key in bulkUpdate()");
                        }
                      } else {
                        setByKeyPath(obj, keyPath, value);
                      }
                    }
                    offsetMap.push(idx);
                    resultKeys.push(key);
                    resultObjs.push(obj);
                  }
                });
                var numEntries = resultKeys.length;
                return coreTable.mutate({
                  trans,
                  type: "put",
                  keys: resultKeys,
                  values: resultObjs,
                  updates: {
                    keys: keys2,
                    changeSpecs
                  }
                }).then(function(_a2) {
                  var numFailures = _a2.numFailures, failures = _a2.failures;
                  if (numFailures === 0)
                    return numEntries;
                  for (var _i = 0, _b = Object.keys(failures); _i < _b.length; _i++) {
                    var offset = _b[_i];
                    var mappedOffset = offsetMap[Number(offset)];
                    if (mappedOffset != null) {
                      var failure = failures[offset];
                      delete failures[offset];
                      failures[mappedOffset] = failure;
                    }
                  }
                  throw new BulkError("".concat(_this.name, ".bulkUpdate(): ").concat(numFailures, " of ").concat(numEntries, " operations failed"), failures);
                });
              });
            });
          };
          Table2.prototype.bulkDelete = function(keys2) {
            var _this = this;
            var numKeys = keys2.length;
            return this._trans("readwrite", function(trans) {
              return _this.core.mutate({ trans, type: "delete", keys: keys2 });
            }).then(function(_a2) {
              var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
              if (numFailures === 0)
                return lastResult;
              throw new BulkError("".concat(_this.name, ".bulkDelete(): ").concat(numFailures, " of ").concat(numKeys, " operations failed"), failures);
            });
          };
          return Table2;
        })();
        function Events(ctx) {
          var evs = {};
          var rv = function(eventName, subscriber) {
            if (subscriber) {
              var i2 = arguments.length, args = new Array(i2 - 1);
              while (--i2)
                args[i2 - 1] = arguments[i2];
              evs[eventName].subscribe.apply(null, args);
              return ctx;
            } else if (typeof eventName === "string") {
              return evs[eventName];
            }
          };
          rv.addEventType = add4;
          for (var i = 1, l = arguments.length; i < l; ++i) {
            add4(arguments[i]);
          }
          return rv;
          function add4(eventName, chainFunction, defaultFunction) {
            if (typeof eventName === "object")
              return addConfiguredEvents(eventName);
            if (!chainFunction)
              chainFunction = reverseStoppableEventChain;
            if (!defaultFunction)
              defaultFunction = nop;
            var context2 = {
              subscribers: [],
              fire: defaultFunction,
              subscribe: function(cb) {
                if (context2.subscribers.indexOf(cb) === -1) {
                  context2.subscribers.push(cb);
                  context2.fire = chainFunction(context2.fire, cb);
                }
              },
              unsubscribe: function(cb) {
                context2.subscribers = context2.subscribers.filter(function(fn) {
                  return fn !== cb;
                });
                context2.fire = context2.subscribers.reduce(chainFunction, defaultFunction);
              }
            };
            evs[eventName] = rv[eventName] = context2;
            return context2;
          }
          function addConfiguredEvents(cfg) {
            keys(cfg).forEach(function(eventName) {
              var args = cfg[eventName];
              if (isArray4(args)) {
                add4(eventName, cfg[eventName][0], cfg[eventName][1]);
              } else if (args === "asap") {
                var context2 = add4(eventName, mirror, function fire() {
                  var i2 = arguments.length, args2 = new Array(i2);
                  while (i2--)
                    args2[i2] = arguments[i2];
                  context2.subscribers.forEach(function(fn) {
                    asap$1(function fireEvent() {
                      fn.apply(null, args2);
                    });
                  });
                });
              } else
                throw new exceptions.InvalidArgument("Invalid event config");
            });
          }
        }
        function makeClassConstructor(prototype, constructor) {
          derive(constructor).from({ prototype });
          return constructor;
        }
        function createTableConstructor(db) {
          return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
            this.db = db;
            this._tx = trans;
            this.name = name;
            this.schema = tableSchema;
            this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
              "creating": [hookCreatingChain, nop],
              "reading": [pureFunctionChain, mirror],
              "updating": [hookUpdatingChain, nop],
              "deleting": [hookDeletingChain, nop]
            });
          });
        }
        function isPlainKeyRange(ctx, ignoreLimitFilter) {
          return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
        }
        function addFilter(ctx, fn) {
          ctx.filter = combine(ctx.filter, fn);
        }
        function addReplayFilter(ctx, factory, isLimitFilter) {
          var curr = ctx.replayFilter;
          ctx.replayFilter = curr ? function() {
            return combine(curr(), factory());
          } : factory;
          ctx.justLimit = isLimitFilter && !curr;
        }
        function addMatchFilter(ctx, fn) {
          ctx.isMatch = combine(ctx.isMatch, fn);
        }
        function getIndexOrStore(ctx, coreSchema) {
          if (ctx.isPrimKey)
            return coreSchema.primaryKey;
          var index = coreSchema.getIndexByKeyPath(ctx.index);
          if (!index)
            throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
          return index;
        }
        function openCursor(ctx, coreTable, trans) {
          var index = getIndexOrStore(ctx, coreTable.schema);
          return coreTable.openCursor({
            trans,
            values: !ctx.keysOnly,
            reverse: ctx.dir === "prev",
            unique: !!ctx.unique,
            query: {
              index,
              range: ctx.range
            }
          });
        }
        function iter(ctx, fn, coreTrans, coreTable) {
          var filter2 = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
          if (!ctx.or) {
            return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter2), fn, !ctx.keysOnly && ctx.valueMapper);
          } else {
            var set_1 = {};
            var union = function(item, cursor, advance) {
              if (!filter2 || filter2(cursor, advance, function(result) {
                return cursor.stop(result);
              }, function(err) {
                return cursor.fail(err);
              })) {
                var primaryKey = cursor.primaryKey;
                var key = "" + primaryKey;
                if (key === "[object ArrayBuffer]")
                  key = "" + new Uint8Array(primaryKey);
                if (!hasOwn(set_1, key)) {
                  set_1[key] = true;
                  fn(item, cursor, advance);
                }
              }
            };
            return Promise.all([
              ctx.or._iterate(union, coreTrans),
              iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
            ]);
          }
        }
        function iterate(cursorPromise, filter2, fn, valueMapper) {
          var mappedFn = valueMapper ? function(x, c, a) {
            return fn(valueMapper(x), c, a);
          } : fn;
          var wrappedFn = wrap(mappedFn);
          return cursorPromise.then(function(cursor) {
            if (cursor) {
              return cursor.start(function() {
                var c = function() {
                  return cursor.continue();
                };
                if (!filter2 || filter2(cursor, function(advancer) {
                  return c = advancer;
                }, function(val) {
                  cursor.stop(val);
                  c = nop;
                }, function(e) {
                  cursor.fail(e);
                  c = nop;
                }))
                  wrappedFn(cursor.value, cursor, function(advancer) {
                    return c = advancer;
                  });
                c();
              });
            }
          });
        }
        var PropModSymbol2 = Symbol();
        var PropModification2 = (function() {
          function PropModification3(spec) {
            Object.assign(this, spec);
          }
          PropModification3.prototype.execute = function(value) {
            var _a2;
            if (this.add !== void 0) {
              var term = this.add;
              if (isArray4(term)) {
                return __spreadArray2(__spreadArray2([], isArray4(value) ? value : [], true), term, true).sort();
              }
              if (typeof term === "number")
                return (Number(value) || 0) + term;
              if (typeof term === "bigint") {
                try {
                  return BigInt(value) + term;
                } catch (_b) {
                  return BigInt(0) + term;
                }
              }
              throw new TypeError("Invalid term ".concat(term));
            }
            if (this.remove !== void 0) {
              var subtrahend_1 = this.remove;
              if (isArray4(subtrahend_1)) {
                return isArray4(value) ? value.filter(function(item) {
                  return !subtrahend_1.includes(item);
                }).sort() : [];
              }
              if (typeof subtrahend_1 === "number")
                return Number(value) - subtrahend_1;
              if (typeof subtrahend_1 === "bigint") {
                try {
                  return BigInt(value) - subtrahend_1;
                } catch (_c) {
                  return BigInt(0) - subtrahend_1;
                }
              }
              throw new TypeError("Invalid subtrahend ".concat(subtrahend_1));
            }
            var prefixToReplace = (_a2 = this.replacePrefix) === null || _a2 === void 0 ? void 0 : _a2[0];
            if (prefixToReplace && typeof value === "string" && value.startsWith(prefixToReplace)) {
              return this.replacePrefix[1] + value.substring(prefixToReplace.length);
            }
            return value;
          };
          return PropModification3;
        })();
        var Collection = (function() {
          function Collection2() {
          }
          Collection2.prototype._read = function(fn, cb) {
            var ctx = this._ctx;
            return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
          };
          Collection2.prototype._write = function(fn) {
            var ctx = this._ctx;
            return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
          };
          Collection2.prototype._addAlgorithm = function(fn) {
            var ctx = this._ctx;
            ctx.algorithm = combine(ctx.algorithm, fn);
          };
          Collection2.prototype._iterate = function(fn, coreTrans) {
            return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
          };
          Collection2.prototype.clone = function(props2) {
            var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
            if (props2)
              extend(ctx, props2);
            rv._ctx = ctx;
            return rv;
          };
          Collection2.prototype.raw = function() {
            this._ctx.valueMapper = null;
            return this;
          };
          Collection2.prototype.each = function(fn) {
            var ctx = this._ctx;
            return this._read(function(trans) {
              return iter(ctx, fn, trans, ctx.table.core);
            });
          };
          Collection2.prototype.count = function(cb) {
            var _this = this;
            return this._read(function(trans) {
              var ctx = _this._ctx;
              var coreTable = ctx.table.core;
              if (isPlainKeyRange(ctx, true)) {
                return coreTable.count({
                  trans,
                  query: {
                    index: getIndexOrStore(ctx, coreTable.schema),
                    range: ctx.range
                  }
                }).then(function(count2) {
                  return Math.min(count2, ctx.limit);
                });
              } else {
                var count = 0;
                return iter(ctx, function() {
                  ++count;
                  return false;
                }, trans, coreTable).then(function() {
                  return count;
                });
              }
            }).then(cb);
          };
          Collection2.prototype.sortBy = function(keyPath, cb) {
            var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
            function getval(obj, i) {
              if (i)
                return getval(obj[parts[i]], i - 1);
              return obj[lastPart];
            }
            var order = this._ctx.dir === "next" ? 1 : -1;
            function sorter(a, b) {
              var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
              return cmp2(aVal, bVal) * order;
            }
            return this.toArray(function(a) {
              return a.sort(sorter);
            }).then(cb);
          };
          Collection2.prototype.toArray = function(cb) {
            var _this = this;
            return this._read(function(trans) {
              var ctx = _this._ctx;
              if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                var valueMapper_1 = ctx.valueMapper;
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                  trans,
                  limit: ctx.limit,
                  values: true,
                  query: {
                    index,
                    range: ctx.range
                  }
                }).then(function(_a2) {
                  var result = _a2.result;
                  return valueMapper_1 ? result.map(valueMapper_1) : result;
                });
              } else {
                var a_1 = [];
                return iter(ctx, function(item) {
                  return a_1.push(item);
                }, trans, ctx.table.core).then(function() {
                  return a_1;
                });
              }
            }, cb);
          };
          Collection2.prototype.offset = function(offset) {
            var ctx = this._ctx;
            if (offset <= 0)
              return this;
            ctx.offset += offset;
            if (isPlainKeyRange(ctx)) {
              addReplayFilter(ctx, function() {
                var offsetLeft = offset;
                return function(cursor, advance) {
                  if (offsetLeft === 0)
                    return true;
                  if (offsetLeft === 1) {
                    --offsetLeft;
                    return false;
                  }
                  advance(function() {
                    cursor.advance(offsetLeft);
                    offsetLeft = 0;
                  });
                  return false;
                };
              });
            } else {
              addReplayFilter(ctx, function() {
                var offsetLeft = offset;
                return function() {
                  return --offsetLeft < 0;
                };
              });
            }
            return this;
          };
          Collection2.prototype.limit = function(numRows) {
            this._ctx.limit = Math.min(this._ctx.limit, numRows);
            addReplayFilter(this._ctx, function() {
              var rowsLeft = numRows;
              return function(cursor, advance, resolve2) {
                if (--rowsLeft <= 0)
                  advance(resolve2);
                return rowsLeft >= 0;
              };
            }, true);
            return this;
          };
          Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
            addFilter(this._ctx, function(cursor, advance, resolve2) {
              if (filterFunction(cursor.value)) {
                advance(resolve2);
                return bIncludeStopEntry;
              } else {
                return true;
              }
            });
            return this;
          };
          Collection2.prototype.first = function(cb) {
            return this.limit(1).toArray(function(a) {
              return a[0];
            }).then(cb);
          };
          Collection2.prototype.last = function(cb) {
            return this.reverse().first(cb);
          };
          Collection2.prototype.filter = function(filterFunction) {
            addFilter(this._ctx, function(cursor) {
              return filterFunction(cursor.value);
            });
            addMatchFilter(this._ctx, filterFunction);
            return this;
          };
          Collection2.prototype.and = function(filter2) {
            return this.filter(filter2);
          };
          Collection2.prototype.or = function(indexName) {
            return new this.db.WhereClause(this._ctx.table, indexName, this);
          };
          Collection2.prototype.reverse = function() {
            this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
            if (this._ondirectionchange)
              this._ondirectionchange(this._ctx.dir);
            return this;
          };
          Collection2.prototype.desc = function() {
            return this.reverse();
          };
          Collection2.prototype.eachKey = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function(val, cursor) {
              cb(cursor.key, cursor);
            });
          };
          Collection2.prototype.eachUniqueKey = function(cb) {
            this._ctx.unique = "unique";
            return this.eachKey(cb);
          };
          Collection2.prototype.eachPrimaryKey = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            return this.each(function(val, cursor) {
              cb(cursor.primaryKey, cursor);
            });
          };
          Collection2.prototype.keys = function(cb) {
            var ctx = this._ctx;
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function(item, cursor) {
              a.push(cursor.key);
            }).then(function() {
              return a;
            }).then(cb);
          };
          Collection2.prototype.primaryKeys = function(cb) {
            var ctx = this._ctx;
            if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
              return this._read(function(trans) {
                var index = getIndexOrStore(ctx, ctx.table.core.schema);
                return ctx.table.core.query({
                  trans,
                  values: false,
                  limit: ctx.limit,
                  query: {
                    index,
                    range: ctx.range
                  }
                });
              }).then(function(_a2) {
                var result = _a2.result;
                return result;
              }).then(cb);
            }
            ctx.keysOnly = !ctx.isMatch;
            var a = [];
            return this.each(function(item, cursor) {
              a.push(cursor.primaryKey);
            }).then(function() {
              return a;
            }).then(cb);
          };
          Collection2.prototype.uniqueKeys = function(cb) {
            this._ctx.unique = "unique";
            return this.keys(cb);
          };
          Collection2.prototype.firstKey = function(cb) {
            return this.limit(1).keys(function(a) {
              return a[0];
            }).then(cb);
          };
          Collection2.prototype.lastKey = function(cb) {
            return this.reverse().firstKey(cb);
          };
          Collection2.prototype.distinct = function() {
            var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
            if (!idx || !idx.multi)
              return this;
            var set = {};
            addFilter(this._ctx, function(cursor) {
              var strKey = cursor.primaryKey.toString();
              var found = hasOwn(set, strKey);
              set[strKey] = true;
              return !found;
            });
            return this;
          };
          Collection2.prototype.modify = function(changes) {
            var _this = this;
            var ctx = this._ctx;
            return this._write(function(trans) {
              var modifyer;
              if (typeof changes === "function") {
                modifyer = changes;
              } else {
                var keyPaths = keys(changes);
                var numKeys = keyPaths.length;
                modifyer = function(item) {
                  var anythingModified = false;
                  for (var i = 0; i < numKeys; ++i) {
                    var keyPath = keyPaths[i];
                    var val = changes[keyPath];
                    var origVal = getByKeyPath(item, keyPath);
                    if (val instanceof PropModification2) {
                      setByKeyPath(item, keyPath, val.execute(origVal));
                      anythingModified = true;
                    } else if (origVal !== val) {
                      setByKeyPath(item, keyPath, val);
                      anythingModified = true;
                    }
                  }
                  return anythingModified;
                };
              }
              var coreTable = ctx.table.core;
              var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
              var limit = 200;
              var modifyChunkSize = _this.db._options.modifyChunkSize;
              if (modifyChunkSize) {
                if (typeof modifyChunkSize == "object") {
                  limit = modifyChunkSize[coreTable.name] || modifyChunkSize["*"] || 200;
                } else {
                  limit = modifyChunkSize;
                }
              }
              var totalFailures = [];
              var successCount = 0;
              var failedKeys = [];
              var applyMutateResult = function(expectedCount, res) {
                var failures = res.failures, numFailures = res.numFailures;
                successCount += expectedCount - numFailures;
                for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
                  var pos = _a3[_i];
                  totalFailures.push(failures[pos]);
                }
              };
              return _this.clone().primaryKeys().then(function(keys2) {
                var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
                  index: ctx.index,
                  range: ctx.range
                };
                var nextChunk = function(offset) {
                  var count = Math.min(limit, keys2.length - offset);
                  return coreTable.getMany({
                    trans,
                    keys: keys2.slice(offset, offset + count),
                    cache: "immutable"
                  }).then(function(values) {
                    var addValues = [];
                    var putValues = [];
                    var putKeys = outbound ? [] : null;
                    var deleteKeys = [];
                    for (var i = 0; i < count; ++i) {
                      var origValue = values[i];
                      var ctx_1 = {
                        value: deepClone2(origValue),
                        primKey: keys2[offset + i]
                      };
                      if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                        if (ctx_1.value == null) {
                          deleteKeys.push(keys2[offset + i]);
                        } else if (!outbound && cmp2(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                          deleteKeys.push(keys2[offset + i]);
                          addValues.push(ctx_1.value);
                        } else {
                          putValues.push(ctx_1.value);
                          if (outbound)
                            putKeys.push(keys2[offset + i]);
                        }
                      }
                    }
                    return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
                      for (var pos in res.failures) {
                        deleteKeys.splice(parseInt(pos), 1);
                      }
                      applyMutateResult(addValues.length, res);
                    })).then(function() {
                      return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                        trans,
                        type: "put",
                        keys: putKeys,
                        values: putValues,
                        criteria,
                        changeSpec: typeof changes !== "function" && changes,
                        isAdditionalChunk: offset > 0
                      }).then(function(res) {
                        return applyMutateResult(putValues.length, res);
                      });
                    }).then(function() {
                      return (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
                        trans,
                        type: "delete",
                        keys: deleteKeys,
                        criteria,
                        isAdditionalChunk: offset > 0
                      }).then(function(res) {
                        return applyMutateResult(deleteKeys.length, res);
                      });
                    }).then(function() {
                      return keys2.length > offset + count && nextChunk(offset + limit);
                    });
                  });
                };
                return nextChunk(0).then(function() {
                  if (totalFailures.length > 0)
                    throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
                  return keys2.length;
                });
              });
            });
          };
          Collection2.prototype.delete = function() {
            var ctx = this._ctx, range = ctx.range;
            if (isPlainKeyRange(ctx) && (ctx.isPrimKey || range.type === 3)) {
              return this._write(function(trans) {
                var primaryKey = ctx.table.core.schema.primaryKey;
                var coreRange = range;
                return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
                  return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a2) {
                    var failures = _a2.failures;
                    _a2.lastResult;
                    _a2.results;
                    var numFailures = _a2.numFailures;
                    if (numFailures)
                      throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                        return failures[pos];
                      }), count - numFailures);
                    return count - numFailures;
                  });
                });
              });
            }
            return this.modify(deleteCallback);
          };
          return Collection2;
        })();
        var deleteCallback = function(value, ctx) {
          return ctx.value = null;
        };
        function createCollectionConstructor(db) {
          return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
            this.db = db;
            var keyRange = AnyRange, error = null;
            if (keyRangeGenerator)
              try {
                keyRange = keyRangeGenerator();
              } catch (ex) {
                error = ex;
              }
            var whereCtx = whereClause._ctx;
            var table = whereCtx.table;
            var readingHook = table.hook.reading.fire;
            this._ctx = {
              table,
              index: whereCtx.index,
              isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
              range: keyRange,
              keysOnly: false,
              dir: "next",
              unique: "",
              algorithm: null,
              filter: null,
              replayFilter: null,
              justLimit: true,
              isMatch: null,
              offset: 0,
              limit: Infinity,
              error,
              or: whereCtx.or,
              valueMapper: readingHook !== mirror ? readingHook : null
            };
          });
        }
        function simpleCompare(a, b) {
          return a < b ? -1 : a === b ? 0 : 1;
        }
        function simpleCompareReverse(a, b) {
          return a > b ? -1 : a === b ? 0 : 1;
        }
        function fail(collectionOrWhereClause, err, T) {
          var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
          collection._ctx.error = T ? new T(err) : new TypeError(err);
          return collection;
        }
        function emptyCollection(whereClause) {
          return new whereClause.Collection(whereClause, function() {
            return rangeEqual("");
          }).limit(0);
        }
        function upperFactory(dir) {
          return dir === "next" ? function(s) {
            return s.toUpperCase();
          } : function(s) {
            return s.toLowerCase();
          };
        }
        function lowerFactory(dir) {
          return dir === "next" ? function(s) {
            return s.toLowerCase();
          } : function(s) {
            return s.toUpperCase();
          };
        }
        function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp3, dir) {
          var length = Math.min(key.length, lowerNeedle.length);
          var llp = -1;
          for (var i = 0; i < length; ++i) {
            var lwrKeyChar = lowerKey[i];
            if (lwrKeyChar !== lowerNeedle[i]) {
              if (cmp3(key[i], upperNeedle[i]) < 0)
                return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
              if (cmp3(key[i], lowerNeedle[i]) < 0)
                return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
              if (llp >= 0)
                return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
              return null;
            }
            if (cmp3(key[i], lwrKeyChar) < 0)
              llp = i;
          }
          if (length < lowerNeedle.length && dir === "next")
            return key + upperNeedle.substr(key.length);
          if (length < key.length && dir === "prev")
            return key.substr(0, upperNeedle.length);
          return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
        }
        function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
          var upper, lower, compare3, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
          if (!needles.every(function(s) {
            return typeof s === "string";
          })) {
            return fail(whereClause, STRING_EXPECTED);
          }
          function initDirection(dir) {
            upper = upperFactory(dir);
            lower = lowerFactory(dir);
            compare3 = dir === "next" ? simpleCompare : simpleCompareReverse;
            var needleBounds = needles.map(function(needle) {
              return { lower: lower(needle), upper: upper(needle) };
            }).sort(function(a, b) {
              return compare3(a.lower, b.lower);
            });
            upperNeedles = needleBounds.map(function(nb) {
              return nb.upper;
            });
            lowerNeedles = needleBounds.map(function(nb) {
              return nb.lower;
            });
            direction = dir;
            nextKeySuffix = dir === "next" ? "" : suffix;
          }
          initDirection("next");
          var c = new whereClause.Collection(whereClause, function() {
            return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
          });
          c._ondirectionchange = function(direction2) {
            initDirection(direction2);
          };
          var firstPossibleNeedle = 0;
          c._addAlgorithm(function(cursor, advance, resolve2) {
            var key = cursor.key;
            if (typeof key !== "string")
              return false;
            var lowerKey = lower(key);
            if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
              return true;
            } else {
              var lowestPossibleCasing = null;
              for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare3, direction);
                if (casing === null && lowestPossibleCasing === null)
                  firstPossibleNeedle = i + 1;
                else if (lowestPossibleCasing === null || compare3(lowestPossibleCasing, casing) > 0) {
                  lowestPossibleCasing = casing;
                }
              }
              if (lowestPossibleCasing !== null) {
                advance(function() {
                  cursor.continue(lowestPossibleCasing + nextKeySuffix);
                });
              } else {
                advance(resolve2);
              }
              return false;
            }
          });
          return c;
        }
        function createRange(lower, upper, lowerOpen, upperOpen) {
          return {
            type: 2,
            lower,
            upper,
            lowerOpen,
            upperOpen
          };
        }
        function rangeEqual(value) {
          return {
            type: 1,
            lower: value,
            upper: value
          };
        }
        var WhereClause = (function() {
          function WhereClause2() {
          }
          Object.defineProperty(WhereClause2.prototype, "Collection", {
            get: function() {
              return this._ctx.table.db.Collection;
            },
            enumerable: false,
            configurable: true
          });
          WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
            includeLower = includeLower !== false;
            includeUpper = includeUpper === true;
            try {
              if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
                return emptyCollection(this);
              return new this.Collection(this, function() {
                return createRange(lower, upper, !includeLower, !includeUpper);
              });
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
          };
          WhereClause2.prototype.equals = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return rangeEqual(value);
            });
          };
          WhereClause2.prototype.above = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(value, void 0, true);
            });
          };
          WhereClause2.prototype.aboveOrEqual = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(value, void 0, false);
            });
          };
          WhereClause2.prototype.below = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(void 0, value, false, true);
            });
          };
          WhereClause2.prototype.belowOrEqual = function(value) {
            if (value == null)
              return fail(this, INVALID_KEY_ARGUMENT);
            return new this.Collection(this, function() {
              return createRange(void 0, value);
            });
          };
          WhereClause2.prototype.startsWith = function(str) {
            if (typeof str !== "string")
              return fail(this, STRING_EXPECTED);
            return this.between(str, str + maxString, true, true);
          };
          WhereClause2.prototype.startsWithIgnoreCase = function(str) {
            if (str === "")
              return this.startsWith(str);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return x.indexOf(a[0]) === 0;
            }, [str], maxString);
          };
          WhereClause2.prototype.equalsIgnoreCase = function(str) {
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return x === a[0];
            }, [str], "");
          };
          WhereClause2.prototype.anyOfIgnoreCase = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return a.indexOf(x) !== -1;
            }, set, "");
          };
          WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return emptyCollection(this);
            return addIgnoreCaseAlgorithm(this, function(x, a) {
              return a.some(function(n) {
                return x.indexOf(n) === 0;
              });
            }, set, maxString);
          };
          WhereClause2.prototype.anyOf = function() {
            var _this = this;
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            var compare3 = this._cmp;
            try {
              set.sort(compare3);
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            if (set.length === 0)
              return emptyCollection(this);
            var c = new this.Collection(this, function() {
              return createRange(set[0], set[set.length - 1]);
            });
            c._ondirectionchange = function(direction) {
              compare3 = direction === "next" ? _this._ascending : _this._descending;
              set.sort(compare3);
            };
            var i = 0;
            c._addAlgorithm(function(cursor, advance, resolve2) {
              var key = cursor.key;
              while (compare3(key, set[i]) > 0) {
                ++i;
                if (i === set.length) {
                  advance(resolve2);
                  return false;
                }
              }
              if (compare3(key, set[i]) === 0) {
                return true;
              } else {
                advance(function() {
                  cursor.continue(set[i]);
                });
                return false;
              }
            });
            return c;
          };
          WhereClause2.prototype.notEqual = function(value) {
            return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
          };
          WhereClause2.prototype.noneOf = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (set.length === 0)
              return new this.Collection(this);
            try {
              set.sort(this._ascending);
            } catch (e) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            var ranges = set.reduce(function(res, val) {
              return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
            }, null);
            ranges.push([set[set.length - 1], this.db._maxKey]);
            return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
          };
          WhereClause2.prototype.inAnyRange = function(ranges, options) {
            var _this = this;
            var cmp3 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
            if (ranges.length === 0)
              return emptyCollection(this);
            if (!ranges.every(function(range) {
              return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
            })) {
              return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
            }
            var includeLowers = !options || options.includeLowers !== false;
            var includeUppers = options && options.includeUppers === true;
            function addRange2(ranges2, newRange) {
              var i = 0, l = ranges2.length;
              for (; i < l; ++i) {
                var range = ranges2[i];
                if (cmp3(newRange[0], range[1]) < 0 && cmp3(newRange[1], range[0]) > 0) {
                  range[0] = min(range[0], newRange[0]);
                  range[1] = max(range[1], newRange[1]);
                  break;
                }
              }
              if (i === l)
                ranges2.push(newRange);
              return ranges2;
            }
            var sortDirection = ascending;
            function rangeSorter(a, b) {
              return sortDirection(a[0], b[0]);
            }
            var set;
            try {
              set = ranges.reduce(addRange2, []);
              set.sort(rangeSorter);
            } catch (ex) {
              return fail(this, INVALID_KEY_ARGUMENT);
            }
            var rangePos = 0;
            var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
              return ascending(key, set[rangePos][1]) > 0;
            } : function(key) {
              return ascending(key, set[rangePos][1]) >= 0;
            };
            var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
              return descending(key, set[rangePos][0]) > 0;
            } : function(key) {
              return descending(key, set[rangePos][0]) >= 0;
            };
            function keyWithinCurrentRange(key) {
              return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
            }
            var checkKey = keyIsBeyondCurrentEntry;
            var c = new this.Collection(this, function() {
              return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
            });
            c._ondirectionchange = function(direction) {
              if (direction === "next") {
                checkKey = keyIsBeyondCurrentEntry;
                sortDirection = ascending;
              } else {
                checkKey = keyIsBeforeCurrentEntry;
                sortDirection = descending;
              }
              set.sort(rangeSorter);
            };
            c._addAlgorithm(function(cursor, advance, resolve2) {
              var key = cursor.key;
              while (checkKey(key)) {
                ++rangePos;
                if (rangePos === set.length) {
                  advance(resolve2);
                  return false;
                }
              }
              if (keyWithinCurrentRange(key)) {
                return true;
              } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
                return false;
              } else {
                advance(function() {
                  if (sortDirection === ascending)
                    cursor.continue(set[rangePos][0]);
                  else
                    cursor.continue(set[rangePos][1]);
                });
                return false;
              }
            });
            return c;
          };
          WhereClause2.prototype.startsWithAnyOf = function() {
            var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
            if (!set.every(function(s) {
              return typeof s === "string";
            })) {
              return fail(this, "startsWithAnyOf() only works with strings");
            }
            if (set.length === 0)
              return emptyCollection(this);
            return this.inAnyRange(set.map(function(str) {
              return [str, str + maxString];
            }));
          };
          return WhereClause2;
        })();
        function createWhereClauseConstructor(db) {
          return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
            this.db = db;
            this._ctx = {
              table,
              index: index === ":id" ? null : index,
              or: orCollection
            };
            this._cmp = this._ascending = cmp2;
            this._descending = function(a, b) {
              return cmp2(b, a);
            };
            this._max = function(a, b) {
              return cmp2(a, b) > 0 ? a : b;
            };
            this._min = function(a, b) {
              return cmp2(a, b) < 0 ? a : b;
            };
            this._IDBKeyRange = db._deps.IDBKeyRange;
            if (!this._IDBKeyRange)
              throw new exceptions.MissingAPI();
          });
        }
        function eventRejectHandler(reject) {
          return wrap(function(event) {
            preventDefault(event);
            reject(event.target.error);
            return false;
          });
        }
        function preventDefault(event) {
          if (event.stopPropagation)
            event.stopPropagation();
          if (event.preventDefault)
            event.preventDefault();
        }
        var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
        var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
        var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
        var Transaction = (function() {
          function Transaction2() {
          }
          Transaction2.prototype._lock = function() {
            assert2(!PSD.global);
            ++this._reculock;
            if (this._reculock === 1 && !PSD.global)
              PSD.lockOwnerFor = this;
            return this;
          };
          Transaction2.prototype._unlock = function() {
            assert2(!PSD.global);
            if (--this._reculock === 0) {
              if (!PSD.global)
                PSD.lockOwnerFor = null;
              while (this._blockedFuncs.length > 0 && !this._locked()) {
                var fnAndPSD = this._blockedFuncs.shift();
                try {
                  usePSD(fnAndPSD[1], fnAndPSD[0]);
                } catch (e) {
                }
              }
            }
            return this;
          };
          Transaction2.prototype._locked = function() {
            return this._reculock && PSD.lockOwnerFor !== this;
          };
          Transaction2.prototype.create = function(idbtrans) {
            var _this = this;
            if (!this.mode)
              return this;
            var idbdb = this.db.idbdb;
            var dbOpenError = this.db._state.dbOpenError;
            assert2(!this.idbtrans);
            if (!idbtrans && !idbdb) {
              switch (dbOpenError && dbOpenError.name) {
                case "DatabaseClosedError":
                  throw new exceptions.DatabaseClosed(dbOpenError);
                case "MissingAPIError":
                  throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                default:
                  throw new exceptions.OpenFailed(dbOpenError);
              }
            }
            if (!this.active)
              throw new exceptions.TransactionInactive();
            assert2(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
            idbtrans.onerror = wrap(function(ev) {
              preventDefault(ev);
              _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function(ev) {
              preventDefault(ev);
              _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
              _this.active = false;
              _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function() {
              _this.active = false;
              _this._resolve();
              if ("mutatedParts" in idbtrans) {
                globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
              }
            });
            return this;
          };
          Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
            var _this = this;
            if (mode === "readwrite" && this.mode !== "readwrite")
              return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
              return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
              return new DexiePromise(function(resolve2, reject) {
                _this._blockedFuncs.push([function() {
                  _this._promise(mode, fn, bWriteLock).then(resolve2, reject);
                }, PSD]);
              });
            } else if (bWriteLock) {
              return newScope(function() {
                var p2 = new DexiePromise(function(resolve2, reject) {
                  _this._lock();
                  var rv = fn(resolve2, reject, _this);
                  if (rv && rv.then)
                    rv.then(resolve2, reject);
                });
                p2.finally(function() {
                  return _this._unlock();
                });
                p2._lib = true;
                return p2;
              });
            } else {
              var p = new DexiePromise(function(resolve2, reject) {
                var rv = fn(resolve2, reject, _this);
                if (rv && rv.then)
                  rv.then(resolve2, reject);
              });
              p._lib = true;
              return p;
            }
          };
          Transaction2.prototype._root = function() {
            return this.parent ? this.parent._root() : this;
          };
          Transaction2.prototype.waitFor = function(promiseLike) {
            var root = this._root();
            var promise = DexiePromise.resolve(promiseLike);
            if (root._waitingFor) {
              root._waitingFor = root._waitingFor.then(function() {
                return promise;
              });
            } else {
              root._waitingFor = promise;
              root._waitingQueue = [];
              var store = root.idbtrans.objectStore(root.storeNames[0]);
              (function spin() {
                ++root._spinCount;
                while (root._waitingQueue.length)
                  root._waitingQueue.shift()();
                if (root._waitingFor)
                  store.get(-Infinity).onsuccess = spin;
              })();
            }
            var currentWaitPromise = root._waitingFor;
            return new DexiePromise(function(resolve2, reject) {
              promise.then(function(res) {
                return root._waitingQueue.push(wrap(resolve2.bind(null, res)));
              }, function(err) {
                return root._waitingQueue.push(wrap(reject.bind(null, err)));
              }).finally(function() {
                if (root._waitingFor === currentWaitPromise) {
                  root._waitingFor = null;
                }
              });
            });
          };
          Transaction2.prototype.abort = function() {
            if (this.active) {
              this.active = false;
              if (this.idbtrans)
                this.idbtrans.abort();
              this._reject(new exceptions.Abort());
            }
          };
          Transaction2.prototype.table = function(tableName) {
            var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
            if (hasOwn(memoizedTables, tableName))
              return memoizedTables[tableName];
            var tableSchema = this.schema[tableName];
            if (!tableSchema) {
              throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
            }
            var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
            transactionBoundTable.core = this.db.core.table(tableName);
            memoizedTables[tableName] = transactionBoundTable;
            return transactionBoundTable;
          };
          return Transaction2;
        })();
        function createTransactionConstructor(db) {
          return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
            var _this = this;
            this.db = db;
            this.mode = mode;
            this.storeNames = storeNames;
            this.schema = dbschema;
            this.chromeTransactionDurability = chromeTransactionDurability;
            this.idbtrans = null;
            this.on = Events(this, "complete", "error", "abort");
            this.parent = parent || null;
            this.active = true;
            this._reculock = 0;
            this._blockedFuncs = [];
            this._resolve = null;
            this._reject = null;
            this._waitingFor = null;
            this._waitingQueue = null;
            this._spinCount = 0;
            this._completion = new DexiePromise(function(resolve2, reject) {
              _this._resolve = resolve2;
              _this._reject = reject;
            });
            this._completion.then(function() {
              _this.active = false;
              _this.on.complete.fire();
            }, function(e) {
              var wasActive = _this.active;
              _this.active = false;
              _this.on.error.fire(e);
              _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
              return rejection(e);
            });
          });
        }
        function createIndexSpec(name, keyPath, unique2, multi, auto, compound, isPrimKey) {
          return {
            name,
            keyPath,
            unique: unique2,
            multi,
            auto,
            compound,
            src: (unique2 && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
          };
        }
        function nameFromKeyPath(keyPath) {
          return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
        }
        function createTableSchema(name, primKey, indexes) {
          return {
            name,
            primKey,
            indexes,
            mappedClass: null,
            idxByName: arrayToObject(indexes, function(index) {
              return [index.name, index];
            })
          };
        }
        function safariMultiStoreFix(storeNames) {
          return storeNames.length === 1 ? storeNames[0] : storeNames;
        }
        var getMaxKey = function(IdbKeyRange) {
          try {
            IdbKeyRange.only([[]]);
            getMaxKey = function() {
              return [[]];
            };
            return [[]];
          } catch (e) {
            getMaxKey = function() {
              return maxString;
            };
            return maxString;
          }
        };
        function getKeyExtractor(keyPath) {
          if (keyPath == null) {
            return function() {
              return void 0;
            };
          } else if (typeof keyPath === "string") {
            return getSinglePathKeyExtractor(keyPath);
          } else {
            return function(obj) {
              return getByKeyPath(obj, keyPath);
            };
          }
        }
        function getSinglePathKeyExtractor(keyPath) {
          var split = keyPath.split(".");
          if (split.length === 1) {
            return function(obj) {
              return obj[keyPath];
            };
          } else {
            return function(obj) {
              return getByKeyPath(obj, keyPath);
            };
          }
        }
        function arrayify(arrayLike) {
          return [].slice.call(arrayLike);
        }
        var _id_counter = 0;
        function getKeyPathAlias(keyPath) {
          return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[".concat(keyPath.join("+"), "]");
        }
        function createDBCore(db, IdbKeyRange, tmpTrans) {
          function extractSchema(db2, trans) {
            var tables2 = arrayify(db2.objectStoreNames);
            return {
              schema: {
                name: db2.name,
                tables: tables2.map(function(table) {
                  return trans.objectStore(table);
                }).map(function(store) {
                  var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
                  var compound = isArray4(keyPath);
                  var outbound = keyPath == null;
                  var indexByKeyPath = {};
                  var result = {
                    name: store.name,
                    primaryKey: {
                      name: null,
                      isPrimaryKey: true,
                      outbound,
                      compound,
                      keyPath,
                      autoIncrement,
                      unique: true,
                      extractKey: getKeyExtractor(keyPath)
                    },
                    indexes: arrayify(store.indexNames).map(function(indexName) {
                      return store.index(indexName);
                    }).map(function(index) {
                      var name = index.name, unique2 = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
                      var compound2 = isArray4(keyPath2);
                      var result2 = {
                        name,
                        compound: compound2,
                        keyPath: keyPath2,
                        unique: unique2,
                        multiEntry,
                        extractKey: getKeyExtractor(keyPath2)
                      };
                      indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
                      return result2;
                    }),
                    getIndexByKeyPath: function(keyPath2) {
                      return indexByKeyPath[getKeyPathAlias(keyPath2)];
                    }
                  };
                  indexByKeyPath[":id"] = result.primaryKey;
                  if (keyPath != null) {
                    indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
                  }
                  return result;
                })
              },
              hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
            };
          }
          function makeIDBKeyRange(range) {
            if (range.type === 3)
              return null;
            if (range.type === 4)
              throw new Error("Cannot convert never type to IDBKeyRange");
            var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
            var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
            return idbRange;
          }
          function createDbCoreTable(tableSchema) {
            var tableName = tableSchema.name;
            function mutate(_a3) {
              var trans = _a3.trans, type6 = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
              return new Promise(function(resolve2, reject) {
                resolve2 = wrap(resolve2);
                var store = trans.objectStore(tableName);
                var outbound = store.keyPath == null;
                var isAddOrPut = type6 === "put" || type6 === "add";
                if (!isAddOrPut && type6 !== "delete" && type6 !== "deleteRange")
                  throw new Error("Invalid operation type: " + type6);
                var length = (keys2 || values || { length: 1 }).length;
                if (keys2 && values && keys2.length !== values.length) {
                  throw new Error("Given keys array must have same length as given values array.");
                }
                if (length === 0)
                  return resolve2({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
                var req;
                var reqs = [];
                var failures = [];
                var numFailures = 0;
                var errorHandler = function(event) {
                  ++numFailures;
                  preventDefault(event);
                };
                if (type6 === "deleteRange") {
                  if (range.type === 4)
                    return resolve2({ numFailures, failures, results: [], lastResult: void 0 });
                  if (range.type === 3)
                    reqs.push(req = store.clear());
                  else
                    reqs.push(req = store.delete(makeIDBKeyRange(range)));
                } else {
                  var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
                  if (isAddOrPut) {
                    for (var i = 0; i < length; ++i) {
                      reqs.push(req = args2 && args2[i] !== void 0 ? store[type6](args1[i], args2[i]) : store[type6](args1[i]));
                      req.onerror = errorHandler;
                    }
                  } else {
                    for (var i = 0; i < length; ++i) {
                      reqs.push(req = store[type6](args1[i]));
                      req.onerror = errorHandler;
                    }
                  }
                }
                var done = function(event) {
                  var lastResult = event.target.result;
                  reqs.forEach(function(req2, i2) {
                    return req2.error != null && (failures[i2] = req2.error);
                  });
                  resolve2({
                    numFailures,
                    failures,
                    results: type6 === "delete" ? keys2 : reqs.map(function(req2) {
                      return req2.result;
                    }),
                    lastResult
                  });
                };
                req.onerror = function(event) {
                  errorHandler(event);
                  done(event);
                };
                req.onsuccess = done;
              });
            }
            function openCursor2(_a3) {
              var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique2 = _a3.unique;
              return new Promise(function(resolve2, reject) {
                resolve2 = wrap(resolve2);
                var index = query2.index, range = query2.range;
                var store = trans.objectStore(tableName);
                var source = index.isPrimaryKey ? store : store.index(index.name);
                var direction = reverse ? unique2 ? "prevunique" : "prev" : unique2 ? "nextunique" : "next";
                var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function(ev) {
                  var cursor = req.result;
                  if (!cursor) {
                    resolve2(null);
                    return;
                  }
                  cursor.___id = ++_id_counter;
                  cursor.done = false;
                  var _cursorContinue = cursor.continue.bind(cursor);
                  var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
                  if (_cursorContinuePrimaryKey)
                    _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
                  var _cursorAdvance = cursor.advance.bind(cursor);
                  var doThrowCursorIsNotStarted = function() {
                    throw new Error("Cursor not started");
                  };
                  var doThrowCursorIsStopped = function() {
                    throw new Error("Cursor not stopped");
                  };
                  cursor.trans = trans;
                  cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
                  cursor.fail = wrap(reject);
                  cursor.next = function() {
                    var _this = this;
                    var gotOne = 1;
                    return this.start(function() {
                      return gotOne-- ? _this.continue() : _this.stop();
                    }).then(function() {
                      return _this;
                    });
                  };
                  cursor.start = function(callback) {
                    var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
                      resolveIteration = wrap(resolveIteration);
                      req.onerror = eventRejectHandler(rejectIteration);
                      cursor.fail = rejectIteration;
                      cursor.stop = function(value) {
                        cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                        resolveIteration(value);
                      };
                    });
                    var guardedCallback = function() {
                      if (req.result) {
                        try {
                          callback();
                        } catch (err) {
                          cursor.fail(err);
                        }
                      } else {
                        cursor.done = true;
                        cursor.start = function() {
                          throw new Error("Cursor behind last entry");
                        };
                        cursor.stop();
                      }
                    };
                    req.onsuccess = wrap(function(ev2) {
                      req.onsuccess = guardedCallback;
                      guardedCallback();
                    });
                    cursor.continue = _cursorContinue;
                    cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
                    cursor.advance = _cursorAdvance;
                    guardedCallback();
                    return iterationPromise;
                  };
                  resolve2(cursor);
                }, reject);
              });
            }
            function query(hasGetAll2) {
              return function(request) {
                return new Promise(function(resolve2, reject) {
                  resolve2 = wrap(resolve2);
                  var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
                  var nonInfinitLimit = limit === Infinity ? void 0 : limit;
                  var index = query2.index, range = query2.range;
                  var store = trans.objectStore(tableName);
                  var source = index.isPrimaryKey ? store : store.index(index.name);
                  var idbKeyRange = makeIDBKeyRange(range);
                  if (limit === 0)
                    return resolve2({ result: [] });
                  if (hasGetAll2) {
                    var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
                    req.onsuccess = function(event) {
                      return resolve2({ result: event.target.result });
                    };
                    req.onerror = eventRejectHandler(reject);
                  } else {
                    var count_1 = 0;
                    var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
                    var result_1 = [];
                    req_1.onsuccess = function(event) {
                      var cursor = req_1.result;
                      if (!cursor)
                        return resolve2({ result: result_1 });
                      result_1.push(values ? cursor.value : cursor.primaryKey);
                      if (++count_1 === limit)
                        return resolve2({ result: result_1 });
                      cursor.continue();
                    };
                    req_1.onerror = eventRejectHandler(reject);
                  }
                });
              };
            }
            return {
              name: tableName,
              schema: tableSchema,
              mutate,
              getMany: function(_a3) {
                var trans = _a3.trans, keys2 = _a3.keys;
                return new Promise(function(resolve2, reject) {
                  resolve2 = wrap(resolve2);
                  var store = trans.objectStore(tableName);
                  var length = keys2.length;
                  var result = new Array(length);
                  var keyCount = 0;
                  var callbackCount = 0;
                  var req;
                  var successHandler = function(event) {
                    var req2 = event.target;
                    if ((result[req2._pos] = req2.result) != null)
                      ;
                    if (++callbackCount === keyCount)
                      resolve2(result);
                  };
                  var errorHandler = eventRejectHandler(reject);
                  for (var i = 0; i < length; ++i) {
                    var key = keys2[i];
                    if (key != null) {
                      req = store.get(keys2[i]);
                      req._pos = i;
                      req.onsuccess = successHandler;
                      req.onerror = errorHandler;
                      ++keyCount;
                    }
                  }
                  if (keyCount === 0)
                    resolve2(result);
                });
              },
              get: function(_a3) {
                var trans = _a3.trans, key = _a3.key;
                return new Promise(function(resolve2, reject) {
                  resolve2 = wrap(resolve2);
                  var store = trans.objectStore(tableName);
                  var req = store.get(key);
                  req.onsuccess = function(event) {
                    return resolve2(event.target.result);
                  };
                  req.onerror = eventRejectHandler(reject);
                });
              },
              query: query(hasGetAll),
              openCursor: openCursor2,
              count: function(_a3) {
                var query2 = _a3.query, trans = _a3.trans;
                var index = query2.index, range = query2.range;
                return new Promise(function(resolve2, reject) {
                  var store = trans.objectStore(tableName);
                  var source = index.isPrimaryKey ? store : store.index(index.name);
                  var idbKeyRange = makeIDBKeyRange(range);
                  var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
                  req.onsuccess = wrap(function(ev) {
                    return resolve2(ev.target.result);
                  });
                  req.onerror = eventRejectHandler(reject);
                });
              }
            };
          }
          var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
          var tables = schema.tables.map(function(tableSchema) {
            return createDbCoreTable(tableSchema);
          });
          var tableMap = {};
          tables.forEach(function(table) {
            return tableMap[table.name] = table;
          });
          return {
            stack: "dbcore",
            transaction: db.transaction.bind(db),
            table: function(name) {
              var result = tableMap[name];
              if (!result)
                throw new Error("Table '".concat(name, "' not found"));
              return tableMap[name];
            },
            MIN_KEY: -Infinity,
            MAX_KEY: getMaxKey(IdbKeyRange),
            schema
          };
        }
        function createMiddlewareStack(stackImpl, middlewares) {
          return middlewares.reduce(function(down, _a2) {
            var create5 = _a2.create;
            return __assign(__assign({}, down), create5(down));
          }, stackImpl);
        }
        function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
          var IDBKeyRange2 = _a2.IDBKeyRange;
          _a2.indexedDB;
          var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange2, tmpTrans), middlewares.dbcore);
          return {
            dbcore
          };
        }
        function generateMiddlewareStacks(db, tmpTrans) {
          var idbdb = tmpTrans.db;
          var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
          db.core = stacks.dbcore;
          db.tables.forEach(function(table) {
            var tableName = table.name;
            if (db.core.schema.tables.some(function(tbl) {
              return tbl.name === tableName;
            })) {
              table.core = db.core.table(tableName);
              if (db[tableName] instanceof db.Table) {
                db[tableName].core = table.core;
              }
            }
          });
        }
        function setApiOnPlace(db, objs, tableNames, dbschema) {
          tableNames.forEach(function(tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function(obj) {
              var propDesc = getPropertyDescriptor(obj, tableName);
              if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
                if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
                  setProp(obj, tableName, {
                    get: function() {
                      return this.table(tableName);
                    },
                    set: function(value) {
                      defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
                    }
                  });
                } else {
                  obj[tableName] = new db.Table(tableName, schema);
                }
              }
            });
          });
        }
        function removeTablesApi(db, objs) {
          objs.forEach(function(obj) {
            for (var key in obj) {
              if (obj[key] instanceof db.Table)
                delete obj[key];
            }
          });
        }
        function lowerVersionFirst(a, b) {
          return a._cfg.version - b._cfg.version;
        }
        function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
          var globalSchema = db._dbSchema;
          if (idbUpgradeTrans.objectStoreNames.contains("$meta") && !globalSchema.$meta) {
            globalSchema.$meta = createTableSchema("$meta", parseIndexSyntax("")[0], []);
            db._storeNames.push("$meta");
          }
          var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
          trans.create(idbUpgradeTrans);
          trans._completion.catch(reject);
          var rejectTransaction = trans._reject.bind(trans);
          var transless = PSD.transless || PSD;
          newScope(function() {
            PSD.trans = trans;
            PSD.transless = transless;
            if (oldVersion === 0) {
              keys(globalSchema).forEach(function(tableName) {
                createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
              });
              generateMiddlewareStacks(db, idbUpgradeTrans);
              DexiePromise.follow(function() {
                return db.on.populate.fire(trans);
              }).catch(rejectTransaction);
            } else {
              generateMiddlewareStacks(db, idbUpgradeTrans);
              return getExistingVersion(db, trans, oldVersion).then(function(oldVersion2) {
                return updateTablesAndIndexes(db, oldVersion2, trans, idbUpgradeTrans);
              }).catch(rejectTransaction);
            }
          });
        }
        function patchCurrentVersion(db, idbUpgradeTrans) {
          createMissingTables(db._dbSchema, idbUpgradeTrans);
          if (idbUpgradeTrans.db.version % 10 === 0 && !idbUpgradeTrans.objectStoreNames.contains("$meta")) {
            idbUpgradeTrans.db.createObjectStore("$meta").add(Math.ceil(idbUpgradeTrans.db.version / 10 - 1), "version");
          }
          var globalSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
          adjustToExistingIndexNames(db, db._dbSchema, idbUpgradeTrans);
          var diff = getSchemaDiff(globalSchema, db._dbSchema);
          var _loop_1 = function(tableChange2) {
            if (tableChange2.change.length || tableChange2.recreate) {
              console.warn("Unable to patch indexes of table ".concat(tableChange2.name, " because it has changes on the type of index or primary key."));
              return { value: void 0 };
            }
            var store = idbUpgradeTrans.objectStore(tableChange2.name);
            tableChange2.add.forEach(function(idx) {
              if (debug)
                console.debug("Dexie upgrade patch: Creating missing index ".concat(tableChange2.name, ".").concat(idx.src));
              addIndex(store, idx);
            });
          };
          for (var _i = 0, _a2 = diff.change; _i < _a2.length; _i++) {
            var tableChange = _a2[_i];
            var state_1 = _loop_1(tableChange);
            if (typeof state_1 === "object")
              return state_1.value;
          }
        }
        function getExistingVersion(db, trans, oldVersion) {
          if (trans.storeNames.includes("$meta")) {
            return trans.table("$meta").get("version").then(function(metaVersion) {
              return metaVersion != null ? metaVersion : oldVersion;
            });
          } else {
            return DexiePromise.resolve(oldVersion);
          }
        }
        function updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans) {
          var queue = [];
          var versions = db._versions;
          var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
          var versToRun = versions.filter(function(v) {
            return v._cfg.version >= oldVersion;
          });
          if (versToRun.length === 0) {
            return DexiePromise.resolve();
          }
          versToRun.forEach(function(version) {
            queue.push(function() {
              var oldSchema = globalSchema;
              var newSchema = version._cfg.dbschema;
              adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
              adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
              globalSchema = db._dbSchema = newSchema;
              var diff = getSchemaDiff(oldSchema, newSchema);
              diff.add.forEach(function(tuple) {
                createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
              });
              diff.change.forEach(function(change) {
                if (change.recreate) {
                  throw new exceptions.Upgrade("Not yet support for changing primary key");
                } else {
                  var store_1 = idbUpgradeTrans.objectStore(change.name);
                  change.add.forEach(function(idx) {
                    return addIndex(store_1, idx);
                  });
                  change.change.forEach(function(idx) {
                    store_1.deleteIndex(idx.name);
                    addIndex(store_1, idx);
                  });
                  change.del.forEach(function(idxName) {
                    return store_1.deleteIndex(idxName);
                  });
                }
              });
              var contentUpgrade = version._cfg.contentUpgrade;
              if (contentUpgrade && version._cfg.version > oldVersion) {
                generateMiddlewareStacks(db, idbUpgradeTrans);
                trans._memoizedTables = {};
                var upgradeSchema_1 = shallowClone(newSchema);
                diff.del.forEach(function(table) {
                  upgradeSchema_1[table] = oldSchema[table];
                });
                removeTablesApi(db, [db.Transaction.prototype]);
                setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
                trans.schema = upgradeSchema_1;
                var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
                if (contentUpgradeIsAsync_1) {
                  incrementExpectedAwaits();
                }
                var returnValue_1;
                var promiseFollowed = DexiePromise.follow(function() {
                  returnValue_1 = contentUpgrade(trans);
                  if (returnValue_1) {
                    if (contentUpgradeIsAsync_1) {
                      var decrementor = decrementExpectedAwaits.bind(null, null);
                      returnValue_1.then(decrementor, decrementor);
                    }
                  }
                });
                return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
                  return returnValue_1;
                });
              }
            });
            queue.push(function(idbtrans) {
              var newSchema = version._cfg.dbschema;
              deleteRemovedTables(newSchema, idbtrans);
              removeTablesApi(db, [db.Transaction.prototype]);
              setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
              trans.schema = db._dbSchema;
            });
            queue.push(function(idbtrans) {
              if (db.idbdb.objectStoreNames.contains("$meta")) {
                if (Math.ceil(db.idbdb.version / 10) === version._cfg.version) {
                  db.idbdb.deleteObjectStore("$meta");
                  delete db._dbSchema.$meta;
                  db._storeNames = db._storeNames.filter(function(name) {
                    return name !== "$meta";
                  });
                } else {
                  idbtrans.objectStore("$meta").put(version._cfg.version, "version");
                }
              }
            });
          });
          function runQueue() {
            return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
          }
          return runQueue().then(function() {
            createMissingTables(globalSchema, idbUpgradeTrans);
          });
        }
        function getSchemaDiff(oldSchema, newSchema) {
          var diff = {
            del: [],
            add: [],
            change: []
          };
          var table;
          for (table in oldSchema) {
            if (!newSchema[table])
              diff.del.push(table);
          }
          for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
              diff.add.push([table, newDef]);
            } else {
              var change = {
                name: table,
                def: newDef,
                recreate: false,
                del: [],
                add: [],
                change: []
              };
              if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto) {
                change.recreate = true;
                diff.change.push(change);
              } else {
                var oldIndexes = oldDef.idxByName;
                var newIndexes = newDef.idxByName;
                var idxName = void 0;
                for (idxName in oldIndexes) {
                  if (!newIndexes[idxName])
                    change.del.push(idxName);
                }
                for (idxName in newIndexes) {
                  var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                  if (!oldIdx)
                    change.add.push(newIdx);
                  else if (oldIdx.src !== newIdx.src)
                    change.change.push(newIdx);
                }
                if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                  diff.change.push(change);
                }
              }
            }
          }
          return diff;
        }
        function createTable(idbtrans, tableName, primKey, indexes) {
          var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
          indexes.forEach(function(idx) {
            return addIndex(store, idx);
          });
          return store;
        }
        function createMissingTables(newSchema, idbtrans) {
          keys(newSchema).forEach(function(tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
              if (debug)
                console.debug("Dexie: Creating missing table", tableName);
              createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
          });
        }
        function deleteRemovedTables(newSchema, idbtrans) {
          [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
            return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
          });
        }
        function addIndex(store, idx) {
          store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
        }
        function buildGlobalSchema(db, idbdb, tmpTrans) {
          var globalSchema = {};
          var dbStoreNames = slice(idbdb.objectStoreNames, 0);
          dbStoreNames.forEach(function(storeName) {
            var store = tmpTrans.objectStore(storeName);
            var keyPath = store.keyPath;
            var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", true, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
              var idbindex = store.index(store.indexNames[j]);
              keyPath = idbindex.keyPath;
              var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
              indexes.push(index);
            }
            globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
          });
          return globalSchema;
        }
        function readGlobalSchema(db, idbdb, tmpTrans) {
          db.verno = idbdb.version / 10;
          var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
          db._storeNames = slice(idbdb.objectStoreNames, 0);
          setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
        }
        function verifyInstalledSchema(db, tmpTrans) {
          var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
          var diff = getSchemaDiff(installedSchema, db._dbSchema);
          return !(diff.add.length || diff.change.some(function(ch) {
            return ch.add.length || ch.change.length;
          }));
        }
        function adjustToExistingIndexNames(db, schema, idbtrans) {
          var storeNames = idbtrans.db.objectStoreNames;
          for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            db._hasGetAll = "getAll" in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
              var indexName = store.indexNames[j];
              var keyPath = store.index(indexName).keyPath;
              var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
              if (schema[storeName]) {
                var indexSpec = schema[storeName].idxByName[dexieName];
                if (indexSpec) {
                  indexSpec.name = indexName;
                  delete schema[storeName].idxByName[dexieName];
                  schema[storeName].idxByName[indexName] = indexSpec;
                }
              }
            }
          }
          if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            db._hasGetAll = false;
          }
        }
        function parseIndexSyntax(primKeyAndIndexes) {
          return primKeyAndIndexes.split(",").map(function(index, indexNum) {
            index = index.trim();
            var name = index.replace(/([&*]|\+\+)/g, "");
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
            return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray4(keyPath), indexNum === 0);
          });
        }
        var Version = (function() {
          function Version2() {
          }
          Version2.prototype._parseStoresSpec = function(stores, outSchema) {
            keys(stores).forEach(function(tableName) {
              if (stores[tableName] !== null) {
                var indexes = parseIndexSyntax(stores[tableName]);
                var primKey = indexes.shift();
                primKey.unique = true;
                if (primKey.multi)
                  throw new exceptions.Schema("Primary key cannot be multi-valued");
                indexes.forEach(function(idx) {
                  if (idx.auto)
                    throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                  if (!idx.keyPath)
                    throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                });
                outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
              }
            });
          };
          Version2.prototype.stores = function(stores) {
            var db = this.db;
            this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
            var versions = db._versions;
            var storesSpec = {};
            var dbschema = {};
            versions.forEach(function(version) {
              extend(storesSpec, version._cfg.storesSource);
              dbschema = version._cfg.dbschema = {};
              version._parseStoresSpec(storesSpec, dbschema);
            });
            db._dbSchema = dbschema;
            removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
            setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            db._storeNames = keys(dbschema);
            return this;
          };
          Version2.prototype.upgrade = function(upgradeFunction) {
            this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
            return this;
          };
          return Version2;
        })();
        function createVersionConstructor(db) {
          return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
            this.db = db;
            this._cfg = {
              version: versionNumber,
              storesSource: null,
              dbschema: {},
              tables: {},
              contentUpgrade: null
            };
          });
        }
        function getDbNamesTable(indexedDB2, IDBKeyRange2) {
          var dbNamesDB = indexedDB2["_dbNamesDB"];
          if (!dbNamesDB) {
            dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
              addons: [],
              indexedDB: indexedDB2,
              IDBKeyRange: IDBKeyRange2
            });
            dbNamesDB.version(1).stores({ dbnames: "name" });
          }
          return dbNamesDB.table("dbnames");
        }
        function hasDatabasesNative(indexedDB2) {
          return indexedDB2 && typeof indexedDB2.databases === "function";
        }
        function getDatabaseNames(_a2) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
          return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
            return infos.map(function(info) {
              return info.name;
            }).filter(function(name) {
              return name !== DBNAMES_DB;
            });
          }) : getDbNamesTable(indexedDB2, IDBKeyRange2).toCollection().primaryKeys();
        }
        function _onDatabaseCreated(_a2, name) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
          !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).put({ name }).catch(nop);
        }
        function _onDatabaseDeleted(_a2, name) {
          var indexedDB2 = _a2.indexedDB, IDBKeyRange2 = _a2.IDBKeyRange;
          !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).delete(name).catch(nop);
        }
        function vip(fn) {
          return newScope(function() {
            PSD.letThrough = true;
            return fn();
          });
        }
        function idbReady() {
          var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
          if (!isSafari || !indexedDB.databases)
            return Promise.resolve();
          var intervalId;
          return new Promise(function(resolve2) {
            var tryIdb = function() {
              return indexedDB.databases().finally(resolve2);
            };
            intervalId = setInterval(tryIdb, 100);
            tryIdb();
          }).finally(function() {
            return clearInterval(intervalId);
          });
        }
        var _a;
        function isEmptyRange(node) {
          return !("from" in node);
        }
        var RangeSet2 = function(fromOrTree, to) {
          if (this) {
            extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
          } else {
            var rv = new RangeSet2();
            if (fromOrTree && "d" in fromOrTree) {
              extend(rv, fromOrTree);
            }
            return rv;
          }
        };
        props(RangeSet2.prototype, (_a = {
          add: function(rangeSet) {
            mergeRanges2(this, rangeSet);
            return this;
          },
          addKey: function(key) {
            addRange(this, key, key);
            return this;
          },
          addKeys: function(keys2) {
            var _this = this;
            keys2.forEach(function(key) {
              return addRange(_this, key, key);
            });
            return this;
          },
          hasKey: function(key) {
            var node = getRangeSetIterator(this).next(key).value;
            return node && cmp2(node.from, key) <= 0 && cmp2(node.to, key) >= 0;
          }
        }, _a[iteratorSymbol] = function() {
          return getRangeSetIterator(this);
        }, _a));
        function addRange(target, from2, to) {
          var diff = cmp2(from2, to);
          if (isNaN(diff))
            return;
          if (diff > 0)
            throw RangeError();
          if (isEmptyRange(target))
            return extend(target, { from: from2, to, d: 1 });
          var left = target.l;
          var right = target.r;
          if (cmp2(to, target.from) < 0) {
            left ? addRange(left, from2, to) : target.l = { from: from2, to, d: 1, l: null, r: null };
            return rebalance(target);
          }
          if (cmp2(from2, target.to) > 0) {
            right ? addRange(right, from2, to) : target.r = { from: from2, to, d: 1, l: null, r: null };
            return rebalance(target);
          }
          if (cmp2(from2, target.from) < 0) {
            target.from = from2;
            target.l = null;
            target.d = right ? right.d + 1 : 1;
          }
          if (cmp2(to, target.to) > 0) {
            target.to = to;
            target.r = null;
            target.d = target.l ? target.l.d + 1 : 1;
          }
          var rightWasCutOff = !target.r;
          if (left && !target.l) {
            mergeRanges2(target, left);
          }
          if (right && rightWasCutOff) {
            mergeRanges2(target, right);
          }
        }
        function mergeRanges2(target, newSet) {
          function _addRangeSet(target2, _a2) {
            var from2 = _a2.from, to = _a2.to, l = _a2.l, r = _a2.r;
            addRange(target2, from2, to);
            if (l)
              _addRangeSet(target2, l);
            if (r)
              _addRangeSet(target2, r);
          }
          if (!isEmptyRange(newSet))
            _addRangeSet(target, newSet);
        }
        function rangesOverlap2(rangeSet1, rangeSet2) {
          var i1 = getRangeSetIterator(rangeSet2);
          var nextResult1 = i1.next();
          if (nextResult1.done)
            return false;
          var a = nextResult1.value;
          var i2 = getRangeSetIterator(rangeSet1);
          var nextResult2 = i2.next(a.from);
          var b = nextResult2.value;
          while (!nextResult1.done && !nextResult2.done) {
            if (cmp2(b.from, a.to) <= 0 && cmp2(b.to, a.from) >= 0)
              return true;
            cmp2(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
          }
          return false;
        }
        function getRangeSetIterator(node) {
          var state = isEmptyRange(node) ? null : { s: 0, n: node };
          return {
            next: function(key) {
              var keyProvided = arguments.length > 0;
              while (state) {
                switch (state.s) {
                  case 0:
                    state.s = 1;
                    if (keyProvided) {
                      while (state.n.l && cmp2(key, state.n.from) < 0)
                        state = { up: state, n: state.n.l, s: 1 };
                    } else {
                      while (state.n.l)
                        state = { up: state, n: state.n.l, s: 1 };
                    }
                  case 1:
                    state.s = 2;
                    if (!keyProvided || cmp2(key, state.n.to) <= 0)
                      return { value: state.n, done: false };
                  case 2:
                    if (state.n.r) {
                      state.s = 3;
                      state = { up: state, n: state.n.r, s: 0 };
                      continue;
                    }
                  case 3:
                    state = state.up;
                }
              }
              return { done: true };
            }
          };
        }
        function rebalance(target) {
          var _a2, _b;
          var diff = (((_a2 = target.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
          var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
          if (r) {
            var l = r === "r" ? "l" : "r";
            var rootClone = __assign({}, target);
            var oldRootRight = target[r];
            target.from = oldRootRight.from;
            target.to = oldRootRight.to;
            target[r] = oldRootRight[r];
            rootClone[r] = oldRootRight[l];
            target[l] = rootClone;
            rootClone.d = computeDepth(rootClone);
          }
          target.d = computeDepth(target);
        }
        function computeDepth(_a2) {
          var r = _a2.r, l = _a2.l;
          return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
        }
        function extendObservabilitySet(target, newSet) {
          keys(newSet).forEach(function(part) {
            if (target[part])
              mergeRanges2(target[part], newSet[part]);
            else
              target[part] = cloneSimpleObjectTree(newSet[part]);
          });
          return target;
        }
        function obsSetsOverlap(os1, os2) {
          return os1.all || os2.all || Object.keys(os1).some(function(key) {
            return os2[key] && rangesOverlap2(os2[key], os1[key]);
          });
        }
        var cache = {};
        var unsignaledParts = {};
        var isTaskEnqueued = false;
        function signalSubscribersLazily(part, optimistic) {
          extendObservabilitySet(unsignaledParts, part);
          if (!isTaskEnqueued) {
            isTaskEnqueued = true;
            setTimeout(function() {
              isTaskEnqueued = false;
              var parts = unsignaledParts;
              unsignaledParts = {};
              signalSubscribersNow(parts, false);
            }, 0);
          }
        }
        function signalSubscribersNow(updatedParts, deleteAffectedCacheEntries) {
          if (deleteAffectedCacheEntries === void 0) {
            deleteAffectedCacheEntries = false;
          }
          var queriesToSignal = /* @__PURE__ */ new Set();
          if (updatedParts.all) {
            for (var _i = 0, _a2 = Object.values(cache); _i < _a2.length; _i++) {
              var tblCache = _a2[_i];
              collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
            }
          } else {
            for (var key in updatedParts) {
              var parts = /^idb\:\/\/(.*)\/(.*)\//.exec(key);
              if (parts) {
                var dbName = parts[1], tableName = parts[2];
                var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
                if (tblCache)
                  collectTableSubscribers(tblCache, updatedParts, queriesToSignal, deleteAffectedCacheEntries);
              }
            }
          }
          queriesToSignal.forEach(function(requery) {
            return requery();
          });
        }
        function collectTableSubscribers(tblCache, updatedParts, outQueriesToSignal, deleteAffectedCacheEntries) {
          var updatedEntryLists = [];
          for (var _i = 0, _a2 = Object.entries(tblCache.queries.query); _i < _a2.length; _i++) {
            var _b = _a2[_i], indexName = _b[0], entries = _b[1];
            var filteredEntries = [];
            for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
              var entry = entries_1[_c];
              if (obsSetsOverlap(updatedParts, entry.obsSet)) {
                entry.subscribers.forEach(function(requery) {
                  return outQueriesToSignal.add(requery);
                });
              } else if (deleteAffectedCacheEntries) {
                filteredEntries.push(entry);
              }
            }
            if (deleteAffectedCacheEntries)
              updatedEntryLists.push([indexName, filteredEntries]);
          }
          if (deleteAffectedCacheEntries) {
            for (var _d = 0, updatedEntryLists_1 = updatedEntryLists; _d < updatedEntryLists_1.length; _d++) {
              var _e = updatedEntryLists_1[_d], indexName = _e[0], filteredEntries = _e[1];
              tblCache.queries.query[indexName] = filteredEntries;
            }
          }
        }
        function dexieOpen(db) {
          var state = db._state;
          var indexedDB2 = db._deps.indexedDB;
          if (state.isBeingOpened || db.idbdb)
            return state.dbReadyPromise.then(function() {
              return state.dbOpenError ? rejection(state.dbOpenError) : db;
            });
          state.isBeingOpened = true;
          state.dbOpenError = null;
          state.openComplete = false;
          var openCanceller = state.openCanceller;
          var nativeVerToOpen = Math.round(db.verno * 10);
          var schemaPatchMode = false;
          function throwIfCancelled() {
            if (state.openCanceller !== openCanceller)
              throw new exceptions.DatabaseClosed("db.open() was cancelled");
          }
          var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
          var tryOpenDB = function() {
            return new DexiePromise(function(resolve2, reject) {
              throwIfCancelled();
              if (!indexedDB2)
                throw new exceptions.MissingAPI();
              var dbName = db.name;
              var req = state.autoSchema || !nativeVerToOpen ? indexedDB2.open(dbName) : indexedDB2.open(dbName, nativeVerToOpen);
              if (!req)
                throw new exceptions.MissingAPI();
              req.onerror = eventRejectHandler(reject);
              req.onblocked = wrap(db._fireOnBlocked);
              req.onupgradeneeded = wrap(function(e) {
                upgradeTransaction = req.transaction;
                if (state.autoSchema && !db._options.allowEmptyDB) {
                  req.onerror = preventDefault;
                  upgradeTransaction.abort();
                  req.result.close();
                  var delreq = indexedDB2.deleteDatabase(dbName);
                  delreq.onsuccess = delreq.onerror = wrap(function() {
                    reject(new exceptions.NoSuchDatabase("Database ".concat(dbName, " doesnt exist")));
                  });
                } else {
                  upgradeTransaction.onerror = eventRejectHandler(reject);
                  var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
                  wasCreated = oldVer < 1;
                  db.idbdb = req.result;
                  if (schemaPatchMode) {
                    patchCurrentVersion(db, upgradeTransaction);
                  }
                  runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
                }
              }, reject);
              req.onsuccess = wrap(function() {
                upgradeTransaction = null;
                var idbdb = db.idbdb = req.result;
                var objectStoreNames = slice(idbdb.objectStoreNames);
                if (objectStoreNames.length > 0)
                  try {
                    var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
                    if (state.autoSchema)
                      readGlobalSchema(db, idbdb, tmpTrans);
                    else {
                      adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
                      if (!verifyInstalledSchema(db, tmpTrans) && !schemaPatchMode) {
                        console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Dexie will add missing parts and increment native version number to workaround this.");
                        idbdb.close();
                        nativeVerToOpen = idbdb.version + 1;
                        schemaPatchMode = true;
                        return resolve2(tryOpenDB());
                      }
                    }
                    generateMiddlewareStacks(db, tmpTrans);
                  } catch (e) {
                  }
                connections.push(db);
                idbdb.onversionchange = wrap(function(ev) {
                  state.vcFired = true;
                  db.on("versionchange").fire(ev);
                });
                idbdb.onclose = wrap(function(ev) {
                  db.on("close").fire(ev);
                });
                if (wasCreated)
                  _onDatabaseCreated(db._deps, dbName);
                resolve2();
              }, reject);
            }).catch(function(err) {
              switch (err === null || err === void 0 ? void 0 : err.name) {
                case "UnknownError":
                  if (state.PR1398_maxLoop > 0) {
                    state.PR1398_maxLoop--;
                    console.warn("Dexie: Workaround for Chrome UnknownError on open()");
                    return tryOpenDB();
                  }
                  break;
                case "VersionError":
                  if (nativeVerToOpen > 0) {
                    nativeVerToOpen = 0;
                    return tryOpenDB();
                  }
                  break;
              }
              return DexiePromise.reject(err);
            });
          };
          return DexiePromise.race([
            openCanceller,
            (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(tryOpenDB)
          ]).then(function() {
            throwIfCancelled();
            state.onReadyBeingFired = [];
            return DexiePromise.resolve(vip(function() {
              return db.on.ready.fire(db.vip);
            })).then(function fireRemainders() {
              if (state.onReadyBeingFired.length > 0) {
                var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
                state.onReadyBeingFired = [];
                return DexiePromise.resolve(vip(function() {
                  return remainders_1(db.vip);
                })).then(fireRemainders);
              }
            });
          }).finally(function() {
            if (state.openCanceller === openCanceller) {
              state.onReadyBeingFired = null;
              state.isBeingOpened = false;
            }
          }).catch(function(err) {
            state.dbOpenError = err;
            try {
              upgradeTransaction && upgradeTransaction.abort();
            } catch (_a2) {
            }
            if (openCanceller === state.openCanceller) {
              db._close();
            }
            return rejection(err);
          }).finally(function() {
            state.openComplete = true;
            resolveDbReady();
          }).then(function() {
            if (wasCreated) {
              var everything_1 = {};
              db.tables.forEach(function(table) {
                table.schema.indexes.forEach(function(idx) {
                  if (idx.name)
                    everything_1["idb://".concat(db.name, "/").concat(table.name, "/").concat(idx.name)] = new RangeSet2(-Infinity, [[[]]]);
                });
                everything_1["idb://".concat(db.name, "/").concat(table.name, "/")] = everything_1["idb://".concat(db.name, "/").concat(table.name, "/:dels")] = new RangeSet2(-Infinity, [[[]]]);
              });
              globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME).fire(everything_1);
              signalSubscribersNow(everything_1, true);
            }
            return db;
          });
        }
        function awaitIterator(iterator2) {
          var callNext = function(result) {
            return iterator2.next(result);
          }, doThrow = function(error) {
            return iterator2.throw(error);
          }, onSuccess = step(callNext), onError = step(doThrow);
          function step(getNext) {
            return function(val) {
              var next = getNext(val), value = next.value;
              return next.done ? value : !value || typeof value.then !== "function" ? isArray4(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
            };
          }
          return step(callNext)();
        }
        function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
          var i = arguments.length;
          if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
          var args = new Array(i - 1);
          while (--i)
            args[i - 1] = arguments[i];
          scopeFunc = args.pop();
          var tables = flatten2(args);
          return [mode, tables, scopeFunc];
        }
        function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
          return DexiePromise.resolve().then(function() {
            var transless = PSD.transless || PSD;
            var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
            trans.explicit = true;
            var zoneProps = {
              trans,
              transless
            };
            if (parentTransaction) {
              trans.idbtrans = parentTransaction.idbtrans;
            } else {
              try {
                trans.create();
                trans.idbtrans._explicit = true;
                db._state.PR1398_maxLoop = 3;
              } catch (ex) {
                if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
                  console.warn("Dexie: Need to reopen db");
                  db.close({ disableAutoOpen: false });
                  return db.open().then(function() {
                    return enterTransactionScope(db, mode, storeNames, null, scopeFunc);
                  });
                }
                return rejection(ex);
              }
            }
            var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
            if (scopeFuncIsAsync) {
              incrementExpectedAwaits();
            }
            var returnValue;
            var promiseFollowed = DexiePromise.follow(function() {
              returnValue = scopeFunc.call(trans, trans);
              if (returnValue) {
                if (scopeFuncIsAsync) {
                  var decrementor = decrementExpectedAwaits.bind(null, null);
                  returnValue.then(decrementor, decrementor);
                } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
                  returnValue = awaitIterator(returnValue);
                }
              }
            }, zoneProps);
            return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
              return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
            }) : promiseFollowed.then(function() {
              return returnValue;
            })).then(function(x) {
              if (parentTransaction)
                trans._resolve();
              return trans._completion.then(function() {
                return x;
              });
            }).catch(function(e) {
              trans._reject(e);
              return rejection(e);
            });
          });
        }
        function pad(a, value, count) {
          var result = isArray4(a) ? a.slice() : [a];
          for (var i = 0; i < count; ++i)
            result.push(value);
          return result;
        }
        function createVirtualIndexMiddleware(down) {
          return __assign(__assign({}, down), { table: function(tableName) {
            var table = down.table(tableName);
            var schema = table.schema;
            var indexLookup = {};
            var allVirtualIndexes = [];
            function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
              var keyPathAlias = getKeyPathAlias(keyPath);
              var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
              var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
              var isVirtual = keyTail > 0;
              var virtualIndex = __assign(__assign({}, lowLevelIndex), { name: isVirtual ? "".concat(keyPathAlias, "(virtual-from:").concat(lowLevelIndex.name, ")") : lowLevelIndex.name, lowLevelIndex, isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
              indexList.push(virtualIndex);
              if (!virtualIndex.isPrimaryKey) {
                allVirtualIndexes.push(virtualIndex);
              }
              if (keyLength > 1) {
                var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
                addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
              }
              indexList.sort(function(a, b) {
                return a.keyTail - b.keyTail;
              });
              return virtualIndex;
            }
            var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
            indexLookup[":id"] = [primaryKey];
            for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
              var index = _a2[_i];
              addVirtualIndexes(index.keyPath, 0, index);
            }
            function findBestIndex(keyPath) {
              var result2 = indexLookup[getKeyPathAlias(keyPath)];
              return result2 && result2[0];
            }
            function translateRange(range, keyTail) {
              return {
                type: range.type === 1 ? 2 : range.type,
                lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
                lowerOpen: true,
                upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
                upperOpen: true
              };
            }
            function translateRequest(req) {
              var index2 = req.query.index;
              return index2.isVirtual ? __assign(__assign({}, req), { query: {
                index: index2.lowLevelIndex,
                range: translateRange(req.query.range, index2.keyTail)
              } }) : req;
            }
            var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
              return table.count(translateRequest(req));
            }, query: function(req) {
              return table.query(translateRequest(req));
            }, openCursor: function(req) {
              var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
              if (!isVirtual)
                return table.openCursor(req);
              function createVirtualCursor(cursor) {
                function _continue(key) {
                  key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
                }
                var virtualCursor = Object.create(cursor, {
                  continue: { value: _continue },
                  continuePrimaryKey: {
                    value: function(key, primaryKey2) {
                      cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                    }
                  },
                  primaryKey: {
                    get: function() {
                      return cursor.primaryKey;
                    }
                  },
                  key: {
                    get: function() {
                      var key = cursor.key;
                      return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                    }
                  },
                  value: {
                    get: function() {
                      return cursor.value;
                    }
                  }
                });
                return virtualCursor;
              }
              return table.openCursor(translateRequest(req)).then(function(cursor) {
                return cursor && createVirtualCursor(cursor);
              });
            } });
            return result;
          } });
        }
        var virtualIndexMiddleware = {
          stack: "dbcore",
          name: "VirtualIndexMiddleware",
          level: 1,
          create: createVirtualIndexMiddleware
        };
        function getObjectDiff(a, b, rv, prfx) {
          rv = rv || {};
          prfx = prfx || "";
          keys(a).forEach(function(prop) {
            if (!hasOwn(b, prop)) {
              rv[prfx + prop] = void 0;
            } else {
              var ap = a[prop], bp = b[prop];
              if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
                var apTypeName = toStringTag(ap);
                var bpTypeName = toStringTag(bp);
                if (apTypeName !== bpTypeName) {
                  rv[prfx + prop] = b[prop];
                } else if (apTypeName === "Object") {
                  getObjectDiff(ap, bp, rv, prfx + prop + ".");
                } else if (ap !== bp) {
                  rv[prfx + prop] = b[prop];
                }
              } else if (ap !== bp)
                rv[prfx + prop] = b[prop];
            }
          });
          keys(b).forEach(function(prop) {
            if (!hasOwn(a, prop)) {
              rv[prfx + prop] = b[prop];
            }
          });
          return rv;
        }
        function getEffectiveKeys(primaryKey, req) {
          if (req.type === "delete")
            return req.keys;
          return req.keys || req.values.map(primaryKey.extractKey);
        }
        var hooksMiddleware = {
          stack: "dbcore",
          name: "HooksMiddleware",
          level: 2,
          create: function(downCore) {
            return __assign(__assign({}, downCore), { table: function(tableName) {
              var downTable = downCore.table(tableName);
              var primaryKey = downTable.schema.primaryKey;
              var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
                var dxTrans = PSD.trans;
                var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
                switch (req.type) {
                  case "add":
                    if (creating.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "put":
                    if (creating.fire === nop && updating.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "delete":
                    if (deleting.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return addPutOrDelete(req);
                    }, true);
                  case "deleteRange":
                    if (deleting.fire === nop)
                      break;
                    return dxTrans._promise("readwrite", function() {
                      return deleteRange(req);
                    }, true);
                }
                return downTable.mutate(req);
                function addPutOrDelete(req2) {
                  var dxTrans2 = PSD.trans;
                  var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
                  if (!keys2)
                    throw new Error("Keys missing");
                  req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
                  if (req2.type !== "delete")
                    req2.values = __spreadArray2([], req2.values, true);
                  if (req2.keys)
                    req2.keys = __spreadArray2([], req2.keys, true);
                  return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
                    var contexts = keys2.map(function(key, i) {
                      var existingValue = existingValues[i];
                      var ctx = { onerror: null, onsuccess: null };
                      if (req2.type === "delete") {
                        deleting.fire.call(ctx, key, existingValue, dxTrans2);
                      } else if (req2.type === "add" || existingValue === void 0) {
                        var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                        if (key == null && generatedPrimaryKey != null) {
                          key = generatedPrimaryKey;
                          req2.keys[i] = key;
                          if (!primaryKey.outbound) {
                            setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                          }
                        }
                      } else {
                        var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                        var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                        if (additionalChanges_1) {
                          var requestedValue_1 = req2.values[i];
                          Object.keys(additionalChanges_1).forEach(function(keyPath) {
                            if (hasOwn(requestedValue_1, keyPath)) {
                              requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                            } else {
                              setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                            }
                          });
                        }
                      }
                      return ctx;
                    });
                    return downTable.mutate(req2).then(function(_a3) {
                      var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
                      for (var i = 0; i < keys2.length; ++i) {
                        var primKey = results ? results[i] : keys2[i];
                        var ctx = contexts[i];
                        if (primKey == null) {
                          ctx.onerror && ctx.onerror(failures[i]);
                        } else {
                          ctx.onsuccess && ctx.onsuccess(
                            req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                          );
                        }
                      }
                      return { failures, results, numFailures, lastResult };
                    }).catch(function(error) {
                      contexts.forEach(function(ctx) {
                        return ctx.onerror && ctx.onerror(error);
                      });
                      return Promise.reject(error);
                    });
                  });
                }
                function deleteRange(req2) {
                  return deleteNextChunk(req2.trans, req2.range, 1e4);
                }
                function deleteNextChunk(trans, range, limit) {
                  return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(function(_a3) {
                    var result = _a3.result;
                    return addPutOrDelete({ type: "delete", keys: result, trans }).then(function(res) {
                      if (res.numFailures > 0)
                        return Promise.reject(res.failures[0]);
                      if (result.length < limit) {
                        return { failures: [], numFailures: 0, lastResult: void 0 };
                      } else {
                        return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
                      }
                    });
                  });
                }
              } });
              return tableMiddleware;
            } });
          }
        };
        function getExistingValues(table, req, effectiveKeys) {
          return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
        }
        function getFromTransactionCache(keys2, cache2, clone3) {
          try {
            if (!cache2)
              return null;
            if (cache2.keys.length < keys2.length)
              return null;
            var result = [];
            for (var i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
              if (cmp2(cache2.keys[i], keys2[j]) !== 0)
                continue;
              result.push(clone3 ? deepClone2(cache2.values[i]) : cache2.values[i]);
              ++j;
            }
            return result.length === keys2.length ? result : null;
          } catch (_a2) {
            return null;
          }
        }
        var cacheExistingValuesMiddleware = {
          stack: "dbcore",
          level: -1,
          create: function(core) {
            return {
              table: function(tableName) {
                var table = core.table(tableName);
                return __assign(__assign({}, table), { getMany: function(req) {
                  if (!req.cache) {
                    return table.getMany(req);
                  }
                  var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
                  if (cachedResult) {
                    return DexiePromise.resolve(cachedResult);
                  }
                  return table.getMany(req).then(function(res) {
                    req.trans["_cache"] = {
                      keys: req.keys,
                      values: req.cache === "clone" ? deepClone2(res) : res
                    };
                    return res;
                  });
                }, mutate: function(req) {
                  if (req.type !== "add")
                    req.trans["_cache"] = null;
                  return table.mutate(req);
                } });
              }
            };
          }
        };
        function isCachableContext(ctx, table) {
          return ctx.trans.mode === "readonly" && !!ctx.subscr && !ctx.trans.explicit && ctx.trans.db._options.cache !== "disabled" && !table.schema.primaryKey.outbound;
        }
        function isCachableRequest(type6, req) {
          switch (type6) {
            case "query":
              return req.values && !req.unique;
            case "get":
              return false;
            case "getMany":
              return false;
            case "count":
              return false;
            case "openCursor":
              return false;
          }
        }
        var observabilityMiddleware = {
          stack: "dbcore",
          level: 0,
          name: "Observability",
          create: function(core) {
            var dbName = core.schema.name;
            var FULL_RANGE = new RangeSet2(core.MIN_KEY, core.MAX_KEY);
            return __assign(__assign({}, core), { transaction: function(stores, mode, options) {
              if (PSD.subscr && mode !== "readonly") {
                throw new exceptions.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(PSD.querier));
              }
              return core.transaction(stores, mode, options);
            }, table: function(tableName) {
              var table = core.table(tableName);
              var schema = table.schema;
              var primaryKey = schema.primaryKey, indexes = schema.indexes;
              var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
              var indexesWithAutoIncPK = primaryKey.autoIncrement && indexes.filter(function(index) {
                return index.compound && index.keyPath.includes(primaryKey.keyPath);
              });
              var tableClone = __assign(__assign({}, table), { mutate: function(req) {
                var _a2, _b;
                var trans = req.trans;
                var mutatedParts = req.mutatedParts || (req.mutatedParts = {});
                var getRangeSet = function(indexName) {
                  var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                  return mutatedParts[part] || (mutatedParts[part] = new RangeSet2());
                };
                var pkRangeSet = getRangeSet("");
                var delsRangeSet = getRangeSet(":dels");
                var type6 = req.type;
                var _c = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [getEffectiveKeys(primaryKey, req).filter(function(id) {
                  return id;
                }), req.values] : [], keys2 = _c[0], newObjs = _c[1];
                var oldCache = req.trans["_cache"];
                if (isArray4(keys2)) {
                  pkRangeSet.addKeys(keys2);
                  var oldObjs = type6 === "delete" || keys2.length === newObjs.length ? getFromTransactionCache(keys2, oldCache) : null;
                  if (!oldObjs) {
                    delsRangeSet.addKeys(keys2);
                  }
                  if (oldObjs || newObjs) {
                    trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                  }
                } else if (keys2) {
                  var range = {
                    from: (_a2 = keys2.lower) !== null && _a2 !== void 0 ? _a2 : core.MIN_KEY,
                    to: (_b = keys2.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY
                  };
                  delsRangeSet.add(range);
                  pkRangeSet.add(range);
                } else {
                  pkRangeSet.add(FULL_RANGE);
                  delsRangeSet.add(FULL_RANGE);
                  schema.indexes.forEach(function(idx) {
                    return getRangeSet(idx.name).add(FULL_RANGE);
                  });
                }
                return table.mutate(req).then(function(res) {
                  if (keys2 && (req.type === "add" || req.type === "put")) {
                    pkRangeSet.addKeys(res.results);
                    if (indexesWithAutoIncPK) {
                      indexesWithAutoIncPK.forEach(function(idx) {
                        var idxVals = req.values.map(function(v) {
                          return idx.extractKey(v);
                        });
                        var pkPos = idx.keyPath.findIndex(function(prop) {
                          return prop === primaryKey.keyPath;
                        });
                        for (var i = 0, len = res.results.length; i < len; ++i) {
                          idxVals[i][pkPos] = res.results[i];
                        }
                        getRangeSet(idx.name).addKeys(idxVals);
                      });
                    }
                  }
                  trans.mutatedParts = extendObservabilitySet(trans.mutatedParts || {}, mutatedParts);
                  return res;
                });
              } });
              var getRange = function(_a2) {
                var _b, _c;
                var _d = _a2.query, index = _d.index, range = _d.range;
                return [
                  index,
                  new RangeSet2((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
                ];
              };
              var readSubscribers = {
                get: function(req) {
                  return [primaryKey, new RangeSet2(req.key)];
                },
                getMany: function(req) {
                  return [primaryKey, new RangeSet2().addKeys(req.keys)];
                },
                count: getRange,
                query: getRange,
                openCursor: getRange
              };
              keys(readSubscribers).forEach(function(method) {
                tableClone[method] = function(req) {
                  var subscr = PSD.subscr;
                  var isLiveQuery = !!subscr;
                  var cachable = isCachableContext(PSD, table) && isCachableRequest(method, req);
                  var obsSet = cachable ? req.obsSet = {} : subscr;
                  if (isLiveQuery) {
                    var getRangeSet = function(indexName) {
                      var part = "idb://".concat(dbName, "/").concat(tableName, "/").concat(indexName);
                      return obsSet[part] || (obsSet[part] = new RangeSet2());
                    };
                    var pkRangeSet_1 = getRangeSet("");
                    var delsRangeSet_1 = getRangeSet(":dels");
                    var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
                    if (method === "query" && queriedIndex.isPrimaryKey && !req.values) {
                      delsRangeSet_1.add(queriedRanges);
                    } else {
                      getRangeSet(queriedIndex.name || "").add(queriedRanges);
                    }
                    if (!queriedIndex.isPrimaryKey) {
                      if (method === "count") {
                        delsRangeSet_1.add(FULL_RANGE);
                      } else {
                        var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                        return table[method].apply(this, arguments).then(function(res) {
                          if (method === "query") {
                            if (outbound && req.values) {
                              return keysPromise_1.then(function(_a3) {
                                var resultingKeys = _a3.result;
                                pkRangeSet_1.addKeys(resultingKeys);
                                return res;
                              });
                            }
                            var pKeys = req.values ? res.result.map(extractKey) : res.result;
                            if (req.values) {
                              pkRangeSet_1.addKeys(pKeys);
                            } else {
                              delsRangeSet_1.addKeys(pKeys);
                            }
                          } else if (method === "openCursor") {
                            var cursor_1 = res;
                            var wantValues_1 = req.values;
                            return cursor_1 && Object.create(cursor_1, {
                              key: {
                                get: function() {
                                  delsRangeSet_1.addKey(cursor_1.primaryKey);
                                  return cursor_1.key;
                                }
                              },
                              primaryKey: {
                                get: function() {
                                  var pkey = cursor_1.primaryKey;
                                  delsRangeSet_1.addKey(pkey);
                                  return pkey;
                                }
                              },
                              value: {
                                get: function() {
                                  wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                                  return cursor_1.value;
                                }
                              }
                            });
                          }
                          return res;
                        });
                      }
                    }
                  }
                  return table[method].apply(this, arguments);
                };
              });
              return tableClone;
            } });
          }
        };
        function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
          function addAffectedIndex(ix) {
            var rangeSet = getRangeSet(ix.name || "");
            function extractKey(obj) {
              return obj != null ? ix.extractKey(obj) : null;
            }
            var addKeyOrKeys = function(key) {
              return ix.multiEntry && isArray4(key) ? key.forEach(function(key2) {
                return rangeSet.addKey(key2);
              }) : rangeSet.addKey(key);
            };
            (oldObjs || newObjs).forEach(function(_, i) {
              var oldKey = oldObjs && extractKey(oldObjs[i]);
              var newKey = newObjs && extractKey(newObjs[i]);
              if (cmp2(oldKey, newKey) !== 0) {
                if (oldKey != null)
                  addKeyOrKeys(oldKey);
                if (newKey != null)
                  addKeyOrKeys(newKey);
              }
            });
          }
          schema.indexes.forEach(addAffectedIndex);
        }
        function adjustOptimisticFromFailures(tblCache, req, res) {
          if (res.numFailures === 0)
            return req;
          if (req.type === "deleteRange") {
            return null;
          }
          var numBulkOps = req.keys ? req.keys.length : "values" in req && req.values ? req.values.length : 1;
          if (res.numFailures === numBulkOps) {
            return null;
          }
          var clone3 = __assign({}, req);
          if (isArray4(clone3.keys)) {
            clone3.keys = clone3.keys.filter(function(_, i) {
              return !(i in res.failures);
            });
          }
          if ("values" in clone3 && isArray4(clone3.values)) {
            clone3.values = clone3.values.filter(function(_, i) {
              return !(i in res.failures);
            });
          }
          return clone3;
        }
        function isAboveLower(key, range) {
          return range.lower === void 0 ? true : range.lowerOpen ? cmp2(key, range.lower) > 0 : cmp2(key, range.lower) >= 0;
        }
        function isBelowUpper(key, range) {
          return range.upper === void 0 ? true : range.upperOpen ? cmp2(key, range.upper) < 0 : cmp2(key, range.upper) <= 0;
        }
        function isWithinRange(key, range) {
          return isAboveLower(key, range) && isBelowUpper(key, range);
        }
        function applyOptimisticOps(result, req, ops, table, cacheEntry, immutable) {
          if (!ops || ops.length === 0)
            return result;
          var index = req.query.index;
          var multiEntry = index.multiEntry;
          var queryRange = req.query.range;
          var primaryKey = table.schema.primaryKey;
          var extractPrimKey = primaryKey.extractKey;
          var extractIndex = index.extractKey;
          var extractLowLevelIndex = (index.lowLevelIndex || index).extractKey;
          var finalResult = ops.reduce(function(result2, op) {
            var modifedResult = result2;
            var includedValues = [];
            if (op.type === "add" || op.type === "put") {
              var includedPKs = new RangeSet2();
              for (var i = op.values.length - 1; i >= 0; --i) {
                var value = op.values[i];
                var pk = extractPrimKey(value);
                if (includedPKs.hasKey(pk))
                  continue;
                var key = extractIndex(value);
                if (multiEntry && isArray4(key) ? key.some(function(k) {
                  return isWithinRange(k, queryRange);
                }) : isWithinRange(key, queryRange)) {
                  includedPKs.addKey(pk);
                  includedValues.push(value);
                }
              }
            }
            switch (op.type) {
              case "add": {
                var existingKeys_1 = new RangeSet2().addKeys(req.values ? result2.map(function(v) {
                  return extractPrimKey(v);
                }) : result2);
                modifedResult = result2.concat(req.values ? includedValues.filter(function(v) {
                  var key2 = extractPrimKey(v);
                  if (existingKeys_1.hasKey(key2))
                    return false;
                  existingKeys_1.addKey(key2);
                  return true;
                }) : includedValues.map(function(v) {
                  return extractPrimKey(v);
                }).filter(function(k) {
                  if (existingKeys_1.hasKey(k))
                    return false;
                  existingKeys_1.addKey(k);
                  return true;
                }));
                break;
              }
              case "put": {
                var keySet_1 = new RangeSet2().addKeys(op.values.map(function(v) {
                  return extractPrimKey(v);
                }));
                modifedResult = result2.filter(
                  function(item) {
                    return !keySet_1.hasKey(req.values ? extractPrimKey(item) : item);
                  }
                ).concat(
                  req.values ? includedValues : includedValues.map(function(v) {
                    return extractPrimKey(v);
                  })
                );
                break;
              }
              case "delete":
                var keysToDelete_1 = new RangeSet2().addKeys(op.keys);
                modifedResult = result2.filter(function(item) {
                  return !keysToDelete_1.hasKey(req.values ? extractPrimKey(item) : item);
                });
                break;
              case "deleteRange":
                var range_1 = op.range;
                modifedResult = result2.filter(function(item) {
                  return !isWithinRange(extractPrimKey(item), range_1);
                });
                break;
            }
            return modifedResult;
          }, result);
          if (finalResult === result)
            return result;
          finalResult.sort(function(a, b) {
            return cmp2(extractLowLevelIndex(a), extractLowLevelIndex(b)) || cmp2(extractPrimKey(a), extractPrimKey(b));
          });
          if (req.limit && req.limit < Infinity) {
            if (finalResult.length > req.limit) {
              finalResult.length = req.limit;
            } else if (result.length === req.limit && finalResult.length < req.limit) {
              cacheEntry.dirty = true;
            }
          }
          return immutable ? Object.freeze(finalResult) : finalResult;
        }
        function areRangesEqual(r1, r2) {
          return cmp2(r1.lower, r2.lower) === 0 && cmp2(r1.upper, r2.upper) === 0 && !!r1.lowerOpen === !!r2.lowerOpen && !!r1.upperOpen === !!r2.upperOpen;
        }
        function compareLowers(lower1, lower2, lowerOpen1, lowerOpen2) {
          if (lower1 === void 0)
            return lower2 !== void 0 ? -1 : 0;
          if (lower2 === void 0)
            return 1;
          var c = cmp2(lower1, lower2);
          if (c === 0) {
            if (lowerOpen1 && lowerOpen2)
              return 0;
            if (lowerOpen1)
              return 1;
            if (lowerOpen2)
              return -1;
          }
          return c;
        }
        function compareUppers(upper1, upper2, upperOpen1, upperOpen2) {
          if (upper1 === void 0)
            return upper2 !== void 0 ? 1 : 0;
          if (upper2 === void 0)
            return -1;
          var c = cmp2(upper1, upper2);
          if (c === 0) {
            if (upperOpen1 && upperOpen2)
              return 0;
            if (upperOpen1)
              return -1;
            if (upperOpen2)
              return 1;
          }
          return c;
        }
        function isSuperRange(r1, r2) {
          return compareLowers(r1.lower, r2.lower, r1.lowerOpen, r2.lowerOpen) <= 0 && compareUppers(r1.upper, r2.upper, r1.upperOpen, r2.upperOpen) >= 0;
        }
        function findCompatibleQuery(dbName, tableName, type6, req) {
          var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
          if (!tblCache)
            return [];
          var queries = tblCache.queries[type6];
          if (!queries)
            return [null, false, tblCache, null];
          var indexName = req.query ? req.query.index.name : null;
          var entries = queries[indexName || ""];
          if (!entries)
            return [null, false, tblCache, null];
          switch (type6) {
            case "query":
              var equalEntry = entries.find(function(entry) {
                return entry.req.limit === req.limit && entry.req.values === req.values && areRangesEqual(entry.req.query.range, req.query.range);
              });
              if (equalEntry)
                return [
                  equalEntry,
                  true,
                  tblCache,
                  entries
                ];
              var superEntry = entries.find(function(entry) {
                var limit = "limit" in entry.req ? entry.req.limit : Infinity;
                return limit >= req.limit && (req.values ? entry.req.values : true) && isSuperRange(entry.req.query.range, req.query.range);
              });
              return [superEntry, false, tblCache, entries];
            case "count":
              var countQuery = entries.find(function(entry) {
                return areRangesEqual(entry.req.query.range, req.query.range);
              });
              return [countQuery, !!countQuery, tblCache, entries];
          }
        }
        function subscribeToCacheEntry(cacheEntry, container, requery, signal) {
          cacheEntry.subscribers.add(requery);
          signal.addEventListener("abort", function() {
            cacheEntry.subscribers.delete(requery);
            if (cacheEntry.subscribers.size === 0) {
              enqueForDeletion(cacheEntry, container);
            }
          });
        }
        function enqueForDeletion(cacheEntry, container) {
          setTimeout(function() {
            if (cacheEntry.subscribers.size === 0) {
              delArrayItem(container, cacheEntry);
            }
          }, 3e3);
        }
        var cacheMiddleware = {
          stack: "dbcore",
          level: 0,
          name: "Cache",
          create: function(core) {
            var dbName = core.schema.name;
            var coreMW = __assign(__assign({}, core), { transaction: function(stores, mode, options) {
              var idbtrans = core.transaction(stores, mode, options);
              if (mode === "readwrite") {
                var ac_1 = new AbortController();
                var signal = ac_1.signal;
                var endTransaction = function(wasCommitted) {
                  return function() {
                    ac_1.abort();
                    if (mode === "readwrite") {
                      var affectedSubscribers_1 = /* @__PURE__ */ new Set();
                      for (var _i = 0, stores_1 = stores; _i < stores_1.length; _i++) {
                        var storeName = stores_1[_i];
                        var tblCache = cache["idb://".concat(dbName, "/").concat(storeName)];
                        if (tblCache) {
                          var table = core.table(storeName);
                          var ops = tblCache.optimisticOps.filter(function(op) {
                            return op.trans === idbtrans;
                          });
                          if (idbtrans._explicit && wasCommitted && idbtrans.mutatedParts) {
                            for (var _a2 = 0, _b = Object.values(tblCache.queries.query); _a2 < _b.length; _a2++) {
                              var entries = _b[_a2];
                              for (var _c = 0, _d = entries.slice(); _c < _d.length; _c++) {
                                var entry = _d[_c];
                                if (obsSetsOverlap(entry.obsSet, idbtrans.mutatedParts)) {
                                  delArrayItem(entries, entry);
                                  entry.subscribers.forEach(function(requery) {
                                    return affectedSubscribers_1.add(requery);
                                  });
                                }
                              }
                            }
                          } else if (ops.length > 0) {
                            tblCache.optimisticOps = tblCache.optimisticOps.filter(function(op) {
                              return op.trans !== idbtrans;
                            });
                            for (var _e = 0, _f = Object.values(tblCache.queries.query); _e < _f.length; _e++) {
                              var entries = _f[_e];
                              for (var _g = 0, _h = entries.slice(); _g < _h.length; _g++) {
                                var entry = _h[_g];
                                if (entry.res != null && idbtrans.mutatedParts) {
                                  if (wasCommitted && !entry.dirty) {
                                    var freezeResults = Object.isFrozen(entry.res);
                                    var modRes = applyOptimisticOps(entry.res, entry.req, ops, table, entry, freezeResults);
                                    if (entry.dirty) {
                                      delArrayItem(entries, entry);
                                      entry.subscribers.forEach(function(requery) {
                                        return affectedSubscribers_1.add(requery);
                                      });
                                    } else if (modRes !== entry.res) {
                                      entry.res = modRes;
                                      entry.promise = DexiePromise.resolve({ result: modRes });
                                    }
                                  } else {
                                    if (entry.dirty) {
                                      delArrayItem(entries, entry);
                                    }
                                    entry.subscribers.forEach(function(requery) {
                                      return affectedSubscribers_1.add(requery);
                                    });
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                      affectedSubscribers_1.forEach(function(requery) {
                        return requery();
                      });
                    }
                  };
                };
                idbtrans.addEventListener("abort", endTransaction(false), {
                  signal
                });
                idbtrans.addEventListener("error", endTransaction(false), {
                  signal
                });
                idbtrans.addEventListener("complete", endTransaction(true), {
                  signal
                });
              }
              return idbtrans;
            }, table: function(tableName) {
              var downTable = core.table(tableName);
              var primKey = downTable.schema.primaryKey;
              var tableMW = __assign(__assign({}, downTable), { mutate: function(req) {
                var trans = PSD.trans;
                if (primKey.outbound || trans.db._options.cache === "disabled" || trans.explicit || trans.idbtrans.mode !== "readwrite") {
                  return downTable.mutate(req);
                }
                var tblCache = cache["idb://".concat(dbName, "/").concat(tableName)];
                if (!tblCache)
                  return downTable.mutate(req);
                var promise = downTable.mutate(req);
                if ((req.type === "add" || req.type === "put") && (req.values.length >= 50 || getEffectiveKeys(primKey, req).some(function(key) {
                  return key == null;
                }))) {
                  promise.then(function(res) {
                    var reqWithResolvedKeys = __assign(__assign({}, req), { values: req.values.map(function(value, i) {
                      var _a2;
                      if (res.failures[i])
                        return value;
                      var valueWithKey = ((_a2 = primKey.keyPath) === null || _a2 === void 0 ? void 0 : _a2.includes(".")) ? deepClone2(value) : __assign({}, value);
                      setByKeyPath(valueWithKey, primKey.keyPath, res.results[i]);
                      return valueWithKey;
                    }) });
                    var adjustedReq = adjustOptimisticFromFailures(tblCache, reqWithResolvedKeys, res);
                    tblCache.optimisticOps.push(adjustedReq);
                    queueMicrotask(function() {
                      return req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                    });
                  });
                } else {
                  tblCache.optimisticOps.push(req);
                  req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  promise.then(function(res) {
                    if (res.numFailures > 0) {
                      delArrayItem(tblCache.optimisticOps, req);
                      var adjustedReq = adjustOptimisticFromFailures(tblCache, req, res);
                      if (adjustedReq) {
                        tblCache.optimisticOps.push(adjustedReq);
                      }
                      req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                    }
                  });
                  promise.catch(function() {
                    delArrayItem(tblCache.optimisticOps, req);
                    req.mutatedParts && signalSubscribersLazily(req.mutatedParts);
                  });
                }
                return promise;
              }, query: function(req) {
                var _a2;
                if (!isCachableContext(PSD, downTable) || !isCachableRequest("query", req))
                  return downTable.query(req);
                var freezeResults = ((_a2 = PSD.trans) === null || _a2 === void 0 ? void 0 : _a2.db._options.cache) === "immutable";
                var _b = PSD, requery = _b.requery, signal = _b.signal;
                var _c = findCompatibleQuery(dbName, tableName, "query", req), cacheEntry = _c[0], exactMatch = _c[1], tblCache = _c[2], container = _c[3];
                if (cacheEntry && exactMatch) {
                  cacheEntry.obsSet = req.obsSet;
                } else {
                  var promise = downTable.query(req).then(function(res) {
                    var result = res.result;
                    if (cacheEntry)
                      cacheEntry.res = result;
                    if (freezeResults) {
                      for (var i = 0, l = result.length; i < l; ++i) {
                        Object.freeze(result[i]);
                      }
                      Object.freeze(result);
                    } else {
                      res.result = deepClone2(result);
                    }
                    return res;
                  }).catch(function(error) {
                    if (container && cacheEntry)
                      delArrayItem(container, cacheEntry);
                    return Promise.reject(error);
                  });
                  cacheEntry = {
                    obsSet: req.obsSet,
                    promise,
                    subscribers: /* @__PURE__ */ new Set(),
                    type: "query",
                    req,
                    dirty: false
                  };
                  if (container) {
                    container.push(cacheEntry);
                  } else {
                    container = [cacheEntry];
                    if (!tblCache) {
                      tblCache = cache["idb://".concat(dbName, "/").concat(tableName)] = {
                        queries: {
                          query: {},
                          count: {}
                        },
                        objs: /* @__PURE__ */ new Map(),
                        optimisticOps: [],
                        unsignaledParts: {}
                      };
                    }
                    tblCache.queries.query[req.query.index.name || ""] = container;
                  }
                }
                subscribeToCacheEntry(cacheEntry, container, requery, signal);
                return cacheEntry.promise.then(function(res) {
                  return {
                    result: applyOptimisticOps(res.result, req, tblCache === null || tblCache === void 0 ? void 0 : tblCache.optimisticOps, downTable, cacheEntry, freezeResults)
                  };
                });
              } });
              return tableMW;
            } });
            return coreMW;
          }
        };
        function vipify(target, vipDb) {
          return new Proxy(target, {
            get: function(target2, prop, receiver) {
              if (prop === "db")
                return vipDb;
              return Reflect.get(target2, prop, receiver);
            }
          });
        }
        var Dexie$1 = (function() {
          function Dexie3(name, options) {
            var _this = this;
            this._middlewares = {};
            this.verno = 0;
            var deps = Dexie3.dependencies;
            this._options = options = __assign({
              addons: Dexie3.addons,
              autoOpen: true,
              indexedDB: deps.indexedDB,
              IDBKeyRange: deps.IDBKeyRange,
              cache: "cloned"
            }, options);
            this._deps = {
              indexedDB: options.indexedDB,
              IDBKeyRange: options.IDBKeyRange
            };
            var addons = options.addons;
            this._dbSchema = {};
            this._versions = [];
            this._storeNames = [];
            this._allTables = {};
            this.idbdb = null;
            this._novip = this;
            var state = {
              dbOpenError: null,
              isBeingOpened: false,
              onReadyBeingFired: null,
              openComplete: false,
              dbReadyResolve: nop,
              dbReadyPromise: null,
              cancelOpen: nop,
              openCanceller: null,
              autoSchema: true,
              PR1398_maxLoop: 3,
              autoOpen: options.autoOpen
            };
            state.dbReadyPromise = new DexiePromise(function(resolve2) {
              state.dbReadyResolve = resolve2;
            });
            state.openCanceller = new DexiePromise(function(_, reject) {
              state.cancelOpen = reject;
            });
            this._state = state;
            this.name = name;
            this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
            this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
              return function(subscriber, bSticky) {
                Dexie3.vip(function() {
                  var state2 = _this._state;
                  if (state2.openComplete) {
                    if (!state2.dbOpenError)
                      DexiePromise.resolve().then(subscriber);
                    if (bSticky)
                      subscribe(subscriber);
                  } else if (state2.onReadyBeingFired) {
                    state2.onReadyBeingFired.push(subscriber);
                    if (bSticky)
                      subscribe(subscriber);
                  } else {
                    subscribe(subscriber);
                    var db_1 = _this;
                    if (!bSticky)
                      subscribe(function unsubscribe() {
                        db_1.on.ready.unsubscribe(subscriber);
                        db_1.on.ready.unsubscribe(unsubscribe);
                      });
                  }
                });
              };
            });
            this.Collection = createCollectionConstructor(this);
            this.Table = createTableConstructor(this);
            this.Transaction = createTransactionConstructor(this);
            this.Version = createVersionConstructor(this);
            this.WhereClause = createWhereClauseConstructor(this);
            this.on("versionchange", function(ev) {
              if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '".concat(_this.name, "'. Closing db now to resume the upgrade."));
              else
                console.warn("Another connection wants to delete database '".concat(_this.name, "'. Closing db now to resume the delete request."));
              _this.close({ disableAutoOpen: false });
            });
            this.on("blocked", function(ev) {
              if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('".concat(_this.name, "') was blocked"));
              else
                console.warn("Upgrade '".concat(_this.name, "' blocked by other connection holding version ").concat(ev.oldVersion / 10));
            });
            this._maxKey = getMaxKey(options.IDBKeyRange);
            this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
              return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
            };
            this._fireOnBlocked = function(ev) {
              _this.on("blocked").fire(ev);
              connections.filter(function(c) {
                return c.name === _this.name && c !== _this && !c._state.vcFired;
              }).map(function(c) {
                return c.on("versionchange").fire(ev);
              });
            };
            this.use(cacheExistingValuesMiddleware);
            this.use(cacheMiddleware);
            this.use(observabilityMiddleware);
            this.use(virtualIndexMiddleware);
            this.use(hooksMiddleware);
            var vipDB = new Proxy(this, {
              get: function(_, prop, receiver) {
                if (prop === "_vip")
                  return true;
                if (prop === "table")
                  return function(tableName) {
                    return vipify(_this.table(tableName), vipDB);
                  };
                var rv = Reflect.get(_, prop, receiver);
                if (rv instanceof Table)
                  return vipify(rv, vipDB);
                if (prop === "tables")
                  return rv.map(function(t) {
                    return vipify(t, vipDB);
                  });
                if (prop === "_createTransaction")
                  return function() {
                    var tx = rv.apply(this, arguments);
                    return vipify(tx, vipDB);
                  };
                return rv;
              }
            });
            this.vip = vipDB;
            addons.forEach(function(addon) {
              return addon(_this);
            });
          }
          Dexie3.prototype.version = function(versionNumber) {
            if (isNaN(versionNumber) || versionNumber < 0.1)
              throw new exceptions.Type("Given version is not a positive number");
            versionNumber = Math.round(versionNumber * 10) / 10;
            if (this.idbdb || this._state.isBeingOpened)
              throw new exceptions.Schema("Cannot add version when database is open");
            this.verno = Math.max(this.verno, versionNumber);
            var versions = this._versions;
            var versionInstance = versions.filter(function(v) {
              return v._cfg.version === versionNumber;
            })[0];
            if (versionInstance)
              return versionInstance;
            versionInstance = new this.Version(versionNumber);
            versions.push(versionInstance);
            versions.sort(lowerVersionFirst);
            versionInstance.stores({});
            this._state.autoSchema = false;
            return versionInstance;
          };
          Dexie3.prototype._whenReady = function(fn) {
            var _this = this;
            return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve2, reject) {
              if (_this._state.openComplete) {
                return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
              }
              if (!_this._state.isBeingOpened) {
                if (!_this._state.autoOpen) {
                  reject(new exceptions.DatabaseClosed());
                  return;
                }
                _this.open().catch(nop);
              }
              _this._state.dbReadyPromise.then(resolve2, reject);
            }).then(fn);
          };
          Dexie3.prototype.use = function(_a2) {
            var stack = _a2.stack, create5 = _a2.create, level = _a2.level, name = _a2.name;
            if (name)
              this.unuse({ stack, name });
            var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
            middlewares.push({ stack, create: create5, level: level == null ? 10 : level, name });
            middlewares.sort(function(a, b) {
              return a.level - b.level;
            });
            return this;
          };
          Dexie3.prototype.unuse = function(_a2) {
            var stack = _a2.stack, name = _a2.name, create5 = _a2.create;
            if (stack && this._middlewares[stack]) {
              this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
                return create5 ? mw.create !== create5 : name ? mw.name !== name : false;
              });
            }
            return this;
          };
          Dexie3.prototype.open = function() {
            var _this = this;
            return usePSD(
              globalPSD,
              function() {
                return dexieOpen(_this);
              }
            );
          };
          Dexie3.prototype._close = function() {
            var state = this._state;
            var idx = connections.indexOf(this);
            if (idx >= 0)
              connections.splice(idx, 1);
            if (this.idbdb) {
              try {
                this.idbdb.close();
              } catch (e) {
              }
              this.idbdb = null;
            }
            if (!state.isBeingOpened) {
              state.dbReadyPromise = new DexiePromise(function(resolve2) {
                state.dbReadyResolve = resolve2;
              });
              state.openCanceller = new DexiePromise(function(_, reject) {
                state.cancelOpen = reject;
              });
            }
          };
          Dexie3.prototype.close = function(_a2) {
            var _b = _a2 === void 0 ? { disableAutoOpen: true } : _a2, disableAutoOpen = _b.disableAutoOpen;
            var state = this._state;
            if (disableAutoOpen) {
              if (state.isBeingOpened) {
                state.cancelOpen(new exceptions.DatabaseClosed());
              }
              this._close();
              state.autoOpen = false;
              state.dbOpenError = new exceptions.DatabaseClosed();
            } else {
              this._close();
              state.autoOpen = this._options.autoOpen || state.isBeingOpened;
              state.openComplete = false;
              state.dbOpenError = null;
            }
          };
          Dexie3.prototype.delete = function(closeOptions) {
            var _this = this;
            if (closeOptions === void 0) {
              closeOptions = { disableAutoOpen: true };
            }
            var hasInvalidArguments = arguments.length > 0 && typeof arguments[0] !== "object";
            var state = this._state;
            return new DexiePromise(function(resolve2, reject) {
              var doDelete = function() {
                _this.close(closeOptions);
                var req = _this._deps.indexedDB.deleteDatabase(_this.name);
                req.onsuccess = wrap(function() {
                  _onDatabaseDeleted(_this._deps, _this.name);
                  resolve2();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = _this._fireOnBlocked;
              };
              if (hasInvalidArguments)
                throw new exceptions.InvalidArgument("Invalid closeOptions argument to db.delete()");
              if (state.isBeingOpened) {
                state.dbReadyPromise.then(doDelete);
              } else {
                doDelete();
              }
            });
          };
          Dexie3.prototype.backendDB = function() {
            return this.idbdb;
          };
          Dexie3.prototype.isOpen = function() {
            return this.idbdb !== null;
          };
          Dexie3.prototype.hasBeenClosed = function() {
            var dbOpenError = this._state.dbOpenError;
            return dbOpenError && dbOpenError.name === "DatabaseClosed";
          };
          Dexie3.prototype.hasFailed = function() {
            return this._state.dbOpenError !== null;
          };
          Dexie3.prototype.dynamicallyOpened = function() {
            return this._state.autoSchema;
          };
          Object.defineProperty(Dexie3.prototype, "tables", {
            get: function() {
              var _this = this;
              return keys(this._allTables).map(function(name) {
                return _this._allTables[name];
              });
            },
            enumerable: false,
            configurable: true
          });
          Dexie3.prototype.transaction = function() {
            var args = extractTransactionArgs.apply(this, arguments);
            return this._transaction.apply(this, args);
          };
          Dexie3.prototype._transaction = function(mode, tables, scopeFunc) {
            var _this = this;
            var parentTransaction = PSD.trans;
            if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
              parentTransaction = null;
            var onlyIfCompatible = mode.indexOf("?") !== -1;
            mode = mode.replace("!", "").replace("?", "");
            var idbMode, storeNames;
            try {
              storeNames = tables.map(function(table) {
                var storeName = table instanceof _this.Table ? table.name : table;
                if (typeof storeName !== "string")
                  throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
              });
              if (mode == "r" || mode === READONLY)
                idbMode = READONLY;
              else if (mode == "rw" || mode == READWRITE)
                idbMode = READWRITE;
              else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
              if (parentTransaction) {
                if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
                  if (onlyIfCompatible) {
                    parentTransaction = null;
                  } else
                    throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                  storeNames.forEach(function(storeName) {
                    if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                      if (onlyIfCompatible) {
                        parentTransaction = null;
                      } else
                        throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
                    }
                  });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                  parentTransaction = null;
                }
              }
            } catch (e) {
              return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
                reject(e);
              }) : rejection(e);
            }
            var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
            return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
              return _this._whenReady(enterTransaction);
            }) : this._whenReady(enterTransaction);
          };
          Dexie3.prototype.table = function(tableName) {
            if (!hasOwn(this._allTables, tableName)) {
              throw new exceptions.InvalidTable("Table ".concat(tableName, " does not exist"));
            }
            return this._allTables[tableName];
          };
          return Dexie3;
        })();
        var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
        var Observable2 = (function() {
          function Observable3(subscribe) {
            this._subscribe = subscribe;
          }
          Observable3.prototype.subscribe = function(x, error, complete) {
            return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
          };
          Observable3.prototype[symbolObservable] = function() {
            return this;
          };
          return Observable3;
        })();
        var domDeps;
        try {
          domDeps = {
            indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
            IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
          };
        } catch (e) {
          domDeps = { indexedDB: null, IDBKeyRange: null };
        }
        function liveQuery2(querier) {
          var hasValue = false;
          var currentValue;
          var observable2 = new Observable2(function(observer) {
            var scopeFuncIsAsync = isAsyncFunction(querier);
            function execute(ctx) {
              var wasRootExec = beginMicroTickScope();
              try {
                if (scopeFuncIsAsync) {
                  incrementExpectedAwaits();
                }
                var rv = newScope(querier, ctx);
                if (scopeFuncIsAsync) {
                  rv = rv.finally(decrementExpectedAwaits);
                }
                return rv;
              } finally {
                wasRootExec && endMicroTickScope();
              }
            }
            var closed = false;
            var abortController;
            var accumMuts = {};
            var currentObs = {};
            var subscription = {
              get closed() {
                return closed;
              },
              unsubscribe: function() {
                if (closed)
                  return;
                closed = true;
                if (abortController)
                  abortController.abort();
                if (startedListening2)
                  globalEvents.storagemutated.unsubscribe(mutationListener);
              }
            };
            observer.start && observer.start(subscription);
            var startedListening2 = false;
            var doQuery = function() {
              return execInGlobalContext(_doQuery);
            };
            function shouldNotify() {
              return obsSetsOverlap(currentObs, accumMuts);
            }
            var mutationListener = function(parts) {
              extendObservabilitySet(accumMuts, parts);
              if (shouldNotify()) {
                doQuery();
              }
            };
            var _doQuery = function() {
              if (closed || !domDeps.indexedDB) {
                return;
              }
              accumMuts = {};
              var subscr = {};
              if (abortController)
                abortController.abort();
              abortController = new AbortController();
              var ctx = {
                subscr,
                signal: abortController.signal,
                requery: doQuery,
                querier,
                trans: null
              };
              var ret = execute(ctx);
              Promise.resolve(ret).then(function(result) {
                hasValue = true;
                currentValue = result;
                if (closed || ctx.signal.aborted) {
                  return;
                }
                accumMuts = {};
                currentObs = subscr;
                if (!objectIsEmpty(currentObs) && !startedListening2) {
                  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
                  startedListening2 = true;
                }
                execInGlobalContext(function() {
                  return !closed && observer.next && observer.next(result);
                });
              }, function(err) {
                hasValue = false;
                if (!["DatabaseClosedError", "AbortError"].includes(err === null || err === void 0 ? void 0 : err.name)) {
                  if (!closed)
                    execInGlobalContext(function() {
                      if (closed)
                        return;
                      observer.error && observer.error(err);
                    });
                }
              });
            };
            setTimeout(doQuery, 0);
            return subscription;
          });
          observable2.hasValue = function() {
            return hasValue;
          };
          observable2.getValue = function() {
            return currentValue;
          };
          return observable2;
        }
        var Dexie2 = Dexie$1;
        props(Dexie2, __assign(__assign({}, fullNameExceptions), {
          delete: function(databaseName) {
            var db = new Dexie2(databaseName, { addons: [] });
            return db.delete();
          },
          exists: function(name) {
            return new Dexie2(name, { addons: [] }).open().then(function(db) {
              db.close();
              return true;
            }).catch("NoSuchDatabaseError", function() {
              return false;
            });
          },
          getDatabaseNames: function(cb) {
            try {
              return getDatabaseNames(Dexie2.dependencies).then(cb);
            } catch (_a2) {
              return rejection(new exceptions.MissingAPI());
            }
          },
          defineClass: function() {
            function Class(content) {
              extend(this, content);
            }
            return Class;
          },
          ignoreTransaction: function(scopeFunc) {
            return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
          },
          vip,
          async: function(generatorFn) {
            return function() {
              try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== "function")
                  return DexiePromise.resolve(rv);
                return rv;
              } catch (e) {
                return rejection(e);
              }
            };
          },
          spawn: function(generatorFn, args, thiz) {
            try {
              var rv = awaitIterator(generatorFn.apply(thiz, args || []));
              if (!rv || typeof rv.then !== "function")
                return DexiePromise.resolve(rv);
              return rv;
            } catch (e) {
              return rejection(e);
            }
          },
          currentTransaction: {
            get: function() {
              return PSD.trans || null;
            }
          },
          waitFor: function(promiseOrFunction, optionalTimeout) {
            var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie2.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
            return PSD.trans ? PSD.trans.waitFor(promise) : promise;
          },
          Promise: DexiePromise,
          debug: {
            get: function() {
              return debug;
            },
            set: function(value) {
              setDebug(value);
            }
          },
          derive,
          extend,
          props,
          override,
          Events,
          on: globalEvents,
          liveQuery: liveQuery2,
          extendObservabilitySet,
          getByKeyPath,
          setByKeyPath,
          delByKeyPath,
          shallowClone,
          deepClone: deepClone2,
          getObjectDiff,
          cmp: cmp2,
          asap: asap$1,
          minKey,
          addons: [],
          connections,
          errnames,
          dependencies: domDeps,
          cache,
          semVer: DEXIE_VERSION,
          version: DEXIE_VERSION.split(".").map(function(n) {
            return parseInt(n);
          }).reduce(function(p, c, i) {
            return p + c / Math.pow(10, i * 2);
          })
        }));
        Dexie2.maxKey = getMaxKey(Dexie2.dependencies.IDBKeyRange);
        if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
          globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
            if (!propagatingLocally) {
              var event_1;
              event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
                detail: updatedParts
              });
              propagatingLocally = true;
              dispatchEvent(event_1);
              propagatingLocally = false;
            }
          });
          addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a2) {
            var detail = _a2.detail;
            if (!propagatingLocally) {
              propagateLocally(detail);
            }
          });
        }
        function propagateLocally(updateParts) {
          var wasMe = propagatingLocally;
          try {
            propagatingLocally = true;
            globalEvents.storagemutated.fire(updateParts);
            signalSubscribersNow(updateParts, true);
          } finally {
            propagatingLocally = wasMe;
          }
        }
        var propagatingLocally = false;
        var bc;
        var createBC = function() {
        };
        if (typeof BroadcastChannel !== "undefined") {
          createBC = function() {
            bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
            bc.onmessage = function(ev) {
              return ev.data && propagateLocally(ev.data);
            };
          };
          createBC();
          if (typeof bc.unref === "function") {
            bc.unref();
          }
          globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
            if (!propagatingLocally) {
              bc.postMessage(changedParts);
            }
          });
        }
        if (typeof addEventListener !== "undefined") {
          addEventListener("pagehide", function(event) {
            if (!Dexie$1.disableBfCache && event.persisted) {
              if (debug)
                console.debug("Dexie: handling persisted pagehide");
              bc === null || bc === void 0 ? void 0 : bc.close();
              for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
                var db = connections_1[_i];
                db.close({ disableAutoOpen: false });
              }
            }
          });
          addEventListener("pageshow", function(event) {
            if (!Dexie$1.disableBfCache && event.persisted) {
              if (debug)
                console.debug("Dexie: handling persisted pageshow");
              createBC();
              propagateLocally({ all: new RangeSet2(-Infinity, [[]]) });
            }
          });
        }
        function add3(value) {
          return new PropModification2({ add: value });
        }
        function remove2(value) {
          return new PropModification2({ remove: value });
        }
        function replacePrefix2(a, b) {
          return new PropModification2({ replacePrefix: [a, b] });
        }
        DexiePromise.rejectionMapper = mapError;
        setDebug(debug);
        var namedExports = /* @__PURE__ */ Object.freeze({
          __proto__: null,
          Dexie: Dexie$1,
          liveQuery: liveQuery2,
          Entity: Entity2,
          cmp: cmp2,
          PropModSymbol: PropModSymbol2,
          PropModification: PropModification2,
          replacePrefix: replacePrefix2,
          add: add3,
          remove: remove2,
          "default": Dexie$1,
          RangeSet: RangeSet2,
          mergeRanges: mergeRanges2,
          rangesOverlap: rangesOverlap2
        });
        __assign(Dexie$1, namedExports, { default: Dexie$1 });
        return Dexie$1;
      }));
    }
  });

  // node_modules/rxdb/node_modules/dexie/import-wrapper.mjs
  var import_dexie, DexieSymbol, Dexie, liveQuery, mergeRanges, rangesOverlap, RangeSet, cmp, Entity, PropModSymbol, PropModification, replacePrefix, add2, remove;
  var init_import_wrapper = __esm({
    "node_modules/rxdb/node_modules/dexie/import-wrapper.mjs"() {
      import_dexie = __toESM(require_dexie(), 1);
      DexieSymbol = Symbol.for("Dexie");
      Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = import_dexie.default);
      if (import_dexie.default.semVer !== Dexie.semVer) {
        throw new Error(`Two different versions of Dexie loaded in the same app: ${import_dexie.default.semVer} and ${Dexie.semVer}`);
      }
      ({
        liveQuery,
        mergeRanges,
        rangesOverlap,
        RangeSet,
        cmp,
        Entity,
        PropModSymbol,
        PropModification,
        replacePrefix,
        add: add2,
        remove
      } = Dexie);
    }
  });

  // node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-helper.js
  function getDexieDbWithTables(databaseName, collectionName, settings, schema) {
    var dexieDbName = "rxdb-dexie-" + databaseName + "--" + schema.version + "--" + collectionName;
    var state = getFromMapOrCreate(DEXIE_STATE_DB_BY_NAME, dexieDbName, () => {
      var value = (async () => {
        var useSettings = flatClone(settings);
        useSettings.autoOpen = false;
        var dexieDb = new Dexie(dexieDbName, useSettings);
        if (settings.onCreate) {
          await settings.onCreate(dexieDb, dexieDbName);
        }
        var dexieStoresSettings = {
          [DEXIE_DOCS_TABLE_NAME]: getDexieStoreSchema(schema),
          [DEXIE_CHANGES_TABLE_NAME]: "++sequence, id",
          [DEXIE_ATTACHMENTS_TABLE_NAME]: "id"
        };
        dexieDb.version(1).stores(dexieStoresSettings);
        await dexieDb.open();
        return {
          dexieDb,
          dexieTable: dexieDb[DEXIE_DOCS_TABLE_NAME],
          dexieAttachmentsTable: dexieDb[DEXIE_ATTACHMENTS_TABLE_NAME],
          booleanIndexes: getBooleanIndexes(schema)
        };
      })();
      DEXIE_STATE_DB_BY_NAME.set(dexieDbName, state);
      REF_COUNT_PER_DEXIE_DB.set(state, 0);
      return value;
    });
    return state;
  }
  async function closeDexieDb(statePromise) {
    var state = await statePromise;
    var prevCount = REF_COUNT_PER_DEXIE_DB.get(statePromise);
    var newCount = prevCount - 1;
    if (newCount === 0) {
      state.dexieDb.close();
      REF_COUNT_PER_DEXIE_DB.delete(statePromise);
    } else {
      REF_COUNT_PER_DEXIE_DB.set(statePromise, newCount);
    }
  }
  function dexieReplaceIfStartsWithPipe(str) {
    var split = str.split(".");
    if (split.length > 1) {
      return split.map((part) => dexieReplaceIfStartsWithPipe(part)).join(".");
    }
    if (str.startsWith("|")) {
      var withoutFirst = str.substring(1);
      return DEXIE_PIPE_SUBSTITUTE + withoutFirst;
    } else {
      return str;
    }
  }
  function dexieReplaceIfStartsWithPipeRevert(str) {
    var split = str.split(".");
    if (split.length > 1) {
      return split.map((part) => dexieReplaceIfStartsWithPipeRevert(part)).join(".");
    }
    if (str.startsWith(DEXIE_PIPE_SUBSTITUTE)) {
      var withoutFirst = str.substring(DEXIE_PIPE_SUBSTITUTE.length);
      return "|" + withoutFirst;
    } else {
      return str;
    }
  }
  function fromStorageToDexie(booleanIndexes, inputDoc) {
    if (!inputDoc) {
      return inputDoc;
    }
    var d = flatClone(inputDoc);
    d = fromStorageToDexieField(d);
    booleanIndexes.forEach((idx) => {
      var val = getProperty(inputDoc, idx);
      var newVal = val ? "1" : "0";
      var useIndex = dexieReplaceIfStartsWithPipe(idx);
      setProperty(d, useIndex, newVal);
    });
    return d;
  }
  function fromDexieToStorage(booleanIndexes, d) {
    if (!d) {
      return d;
    }
    d = flatClone(d);
    d = fromDexieToStorageField(d);
    booleanIndexes.forEach((idx) => {
      var val = getProperty(d, idx);
      var newVal = val === "1" ? true : false;
      setProperty(d, idx, newVal);
    });
    return d;
  }
  function fromStorageToDexieField(documentData) {
    if (!documentData || typeof documentData === "string" || typeof documentData === "number" || typeof documentData === "boolean") {
      return documentData;
    } else if (Array.isArray(documentData)) {
      return documentData.map((row) => fromStorageToDexieField(row));
    } else if (typeof documentData === "object") {
      var ret = {};
      Object.entries(documentData).forEach(([key, value]) => {
        if (typeof value === "object") {
          value = fromStorageToDexieField(value);
        }
        ret[dexieReplaceIfStartsWithPipe(key)] = value;
      });
      return ret;
    }
  }
  function fromDexieToStorageField(documentData) {
    if (!documentData || typeof documentData === "string" || typeof documentData === "number" || typeof documentData === "boolean") {
      return documentData;
    } else if (Array.isArray(documentData)) {
      return documentData.map((row) => fromDexieToStorageField(row));
    } else if (typeof documentData === "object") {
      var ret = {};
      Object.entries(documentData).forEach(([key, value]) => {
        if (typeof value === "object" || Array.isArray(documentData)) {
          value = fromDexieToStorageField(value);
        }
        ret[dexieReplaceIfStartsWithPipeRevert(key)] = value;
      });
      return ret;
    }
  }
  function getDexieStoreSchema(rxJsonSchema) {
    var parts = [];
    var primaryKey = getPrimaryFieldOfPrimaryKey(rxJsonSchema.primaryKey);
    parts.push([primaryKey]);
    parts.push(["_deleted", primaryKey]);
    if (rxJsonSchema.indexes) {
      rxJsonSchema.indexes.forEach((index) => {
        var arIndex = toArray(index);
        parts.push(arIndex);
      });
    }
    parts.push(["_meta.lwt", primaryKey]);
    parts.push(["_meta.lwt"]);
    parts = parts.map((part) => {
      return part.map((str) => dexieReplaceIfStartsWithPipe(str));
    });
    var dexieSchemaRows = parts.map((part) => {
      if (part.length === 1) {
        return part[0];
      } else {
        return "[" + part.join("+") + "]";
      }
    });
    dexieSchemaRows = dexieSchemaRows.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
    var dexieSchema = dexieSchemaRows.join(", ");
    return dexieSchema;
  }
  async function getDocsInDb(internals, docIds) {
    var state = await internals;
    var docsInDb = await state.dexieTable.bulkGet(docIds);
    return docsInDb.map((d) => fromDexieToStorage(state.booleanIndexes, d));
  }
  function attachmentObjectId(documentId, attachmentId) {
    return documentId + "||" + attachmentId;
  }
  function getBooleanIndexes(schema) {
    var checkedFields = /* @__PURE__ */ new Set();
    var ret = [];
    if (!schema.indexes) {
      return ret;
    }
    schema.indexes.forEach((index) => {
      var fields = toArray(index);
      fields.forEach((field) => {
        if (checkedFields.has(field)) {
          return;
        }
        checkedFields.add(field);
        var schemaObj = getSchemaByObjectPath(schema, field);
        if (schemaObj.type === "boolean") {
          ret.push(field);
        }
      });
    });
    ret.push("_deleted");
    return uniqueArray(ret);
  }
  var DEXIE_DOCS_TABLE_NAME, DEXIE_CHANGES_TABLE_NAME, DEXIE_ATTACHMENTS_TABLE_NAME, RX_STORAGE_NAME_DEXIE, DEXIE_STATE_DB_BY_NAME, REF_COUNT_PER_DEXIE_DB, DEXIE_PIPE_SUBSTITUTE;
  var init_dexie_helper = __esm({
    "node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-helper.js"() {
      init_import_wrapper();
      init_utils();
      init_rx_schema_helper();
      DEXIE_DOCS_TABLE_NAME = "docs";
      DEXIE_CHANGES_TABLE_NAME = "changes";
      DEXIE_ATTACHMENTS_TABLE_NAME = "attachments";
      RX_STORAGE_NAME_DEXIE = "dexie";
      DEXIE_STATE_DB_BY_NAME = /* @__PURE__ */ new Map();
      REF_COUNT_PER_DEXIE_DB = /* @__PURE__ */ new Map();
      DEXIE_PIPE_SUBSTITUTE = "__";
    }
  });

  // node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-query.js
  function mapKeyForKeyRange(k) {
    if (k === INDEX_MIN) {
      return -Infinity;
    } else {
      return k;
    }
  }
  function rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, value) {
    if (booleanIndexes.includes(fieldName)) {
      var newValue = value === INDEX_MAX || value === true ? "1" : "0";
      return newValue;
    } else {
      return value;
    }
  }
  function getKeyRangeByQueryPlan(booleanIndexes, queryPlan, IDBKeyRange2) {
    if (!IDBKeyRange2) {
      if (typeof window === "undefined") {
        throw new Error("IDBKeyRange missing");
      } else {
        IDBKeyRange2 = window.IDBKeyRange;
      }
    }
    var startKeys = queryPlan.startKeys.map((v, i) => {
      var fieldName = queryPlan.index[i];
      return rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, v);
    }).map(mapKeyForKeyRange);
    var endKeys = queryPlan.endKeys.map((v, i) => {
      var fieldName = queryPlan.index[i];
      return rangeFieldToBooleanSubstitute(booleanIndexes, fieldName, v);
    }).map(mapKeyForKeyRange);
    var keyRange = IDBKeyRange2.bound(startKeys, endKeys, !queryPlan.inclusiveStart, !queryPlan.inclusiveEnd);
    return keyRange;
  }
  async function dexieQuery(instance, preparedQuery) {
    var state = await instance.internals;
    var query = preparedQuery.query;
    var skip = query.skip ? query.skip : 0;
    var limit = query.limit ? query.limit : Infinity;
    var skipPlusLimit = skip + limit;
    var queryPlan = preparedQuery.queryPlan;
    var queryMatcher = false;
    if (!queryPlan.selectorSatisfiedByIndex) {
      queryMatcher = getQueryMatcher(instance.schema, preparedQuery.query);
    }
    var keyRange = getKeyRangeByQueryPlan(state.booleanIndexes, queryPlan, state.dexieDb._options.IDBKeyRange);
    var queryPlanFields = queryPlan.index;
    var rows = [];
    await state.dexieDb.transaction("r", state.dexieTable, async (dexieTx) => {
      var tx = dexieTx.idbtrans;
      var store = tx.objectStore(DEXIE_DOCS_TABLE_NAME);
      var index;
      var indexName;
      indexName = "[" + queryPlanFields.map((field) => dexieReplaceIfStartsWithPipe(field)).join("+") + "]";
      index = store.index(indexName);
      var cursorReq = index.openCursor(keyRange);
      await new Promise((res) => {
        cursorReq.onsuccess = function(e) {
          var cursor = e.target.result;
          if (cursor) {
            var docData = fromDexieToStorage(state.booleanIndexes, cursor.value);
            if (!queryMatcher || queryMatcher(docData)) {
              rows.push(docData);
            }
            if (queryPlan.sortSatisfiedByIndex && rows.length === skipPlusLimit) {
              res();
            } else {
              cursor.continue();
            }
          } else {
            res();
          }
        };
      });
    });
    if (!queryPlan.sortSatisfiedByIndex) {
      var sortComparator = getSortComparator(instance.schema, preparedQuery.query);
      rows = rows.sort(sortComparator);
    }
    rows = rows.slice(skip, skipPlusLimit);
    return {
      documents: rows
    };
  }
  async function dexieCount(instance, preparedQuery) {
    var state = await instance.internals;
    var queryPlan = preparedQuery.queryPlan;
    var queryPlanFields = queryPlan.index;
    var keyRange = getKeyRangeByQueryPlan(state.booleanIndexes, queryPlan, state.dexieDb._options.IDBKeyRange);
    var count = -1;
    await state.dexieDb.transaction("r", state.dexieTable, async (dexieTx) => {
      var tx = dexieTx.idbtrans;
      var store = tx.objectStore(DEXIE_DOCS_TABLE_NAME);
      var index;
      var indexName;
      indexName = "[" + queryPlanFields.map((field) => dexieReplaceIfStartsWithPipe(field)).join("+") + "]";
      index = store.index(indexName);
      var request = index.count(keyRange);
      count = await new Promise((res, rej) => {
        request.onsuccess = function() {
          res(request.result);
        };
        request.onerror = (err) => rej(err);
      });
    });
    return count;
  }
  var init_dexie_query = __esm({
    "node_modules/rxdb/dist/esm/plugins/storage-dexie/dexie-query.js"() {
      init_query_planner();
      init_rx_query_helper();
      init_dexie_helper();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-instance-dexie.js
  async function createDexieStorageInstance(storage, params, settings) {
    var internals = getDexieDbWithTables(params.databaseName, params.collectionName, settings, params.schema);
    var instance = new RxStorageInstanceDexie(storage, params.databaseName, params.collectionName, params.schema, internals, params.options, settings, params.devMode);
    await addRxStorageMultiInstanceSupport(RX_STORAGE_NAME_DEXIE, params, instance);
    return Promise.resolve(instance);
  }
  function ensureNotClosed(instance) {
    if (instance.closed) {
      throw new Error("RxStorageInstanceDexie is closed " + instance.databaseName + "-" + instance.collectionName);
    }
  }
  var instanceId, shownNonPremiumLog, RxStorageInstanceDexie;
  var init_rx_storage_instance_dexie = __esm({
    "node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-instance-dexie.js"() {
      init_esm5();
      init_utils();
      init_dexie_helper();
      init_dexie_query();
      init_rx_schema_helper();
      init_rx_storage_helper();
      init_rx_storage_multiinstance();
      init_rx_error();
      instanceId = now();
      shownNonPremiumLog = false;
      RxStorageInstanceDexie = /* @__PURE__ */ (function() {
        function RxStorageInstanceDexie2(storage, databaseName, collectionName, schema, internals, options, settings, devMode) {
          this.changes$ = new Subject();
          this.instanceId = instanceId++;
          this.storage = storage;
          this.databaseName = databaseName;
          this.collectionName = collectionName;
          this.schema = schema;
          this.internals = internals;
          this.options = options;
          this.settings = settings;
          this.devMode = devMode;
          this.primaryPath = getPrimaryFieldOfPrimaryKey(this.schema.primaryKey);
        }
        var _proto = RxStorageInstanceDexie2.prototype;
        _proto.bulkWrite = async function bulkWrite(documentWrites, context2) {
          ensureNotClosed(this);
          if (!shownNonPremiumLog && !await hasPremiumFlag()) {
            console.warn(["-------------- RxDB Open Core RxStorage -------------------------------", "You are using the free Dexie.js based RxStorage implementation from RxDB https://rxdb.info/rx-storage-dexie.html?console=dexie ", "While this is a great option, we want to let you know that there are faster storage solutions available in our premium plugins.", "For professional users and production environments, we highly recommend considering these premium options to enhance performance and reliability.", " https://rxdb.info/premium/?console=dexie ", "If you already purchased premium access you can disable this log by calling the setPremiumFlag() function from rxdb-premium/plugins/shared.", "---------------------------------------------------------------------"].join("\n"));
            shownNonPremiumLog = true;
          } else {
            shownNonPremiumLog = true;
          }
          documentWrites.forEach((row) => {
            if (!row.document._rev || row.previous && !row.previous._rev) {
              throw newRxError("SNH", {
                args: {
                  row
                }
              });
            }
          });
          var state = await this.internals;
          var ret = {
            error: []
          };
          if (this.devMode) {
            documentWrites = documentWrites.map((row) => {
              var doc = flatCloneDocWithMeta(row.document);
              return {
                previous: row.previous,
                document: doc
              };
            });
          }
          var documentKeys = documentWrites.map((writeRow) => writeRow.document[this.primaryPath]);
          var categorized;
          await state.dexieDb.transaction("rw", state.dexieTable, state.dexieAttachmentsTable, async () => {
            var docsInDbMap = /* @__PURE__ */ new Map();
            var docsInDbWithInternals = await getDocsInDb(this.internals, documentKeys);
            docsInDbWithInternals.forEach((docWithDexieInternals) => {
              var doc = docWithDexieInternals;
              if (doc) {
                docsInDbMap.set(doc[this.primaryPath], doc);
              }
              return doc;
            });
            categorized = categorizeBulkWriteRows(this, this.primaryPath, docsInDbMap, documentWrites, context2);
            ret.error = categorized.errors;
            var bulkPutDocs = [];
            categorized.bulkInsertDocs.forEach((row) => {
              bulkPutDocs.push(row.document);
            });
            categorized.bulkUpdateDocs.forEach((row) => {
              bulkPutDocs.push(row.document);
            });
            bulkPutDocs = bulkPutDocs.map((d) => fromStorageToDexie(state.booleanIndexes, d));
            if (bulkPutDocs.length > 0) {
              await state.dexieTable.bulkPut(bulkPutDocs);
            }
            var putAttachments = [];
            categorized.attachmentsAdd.forEach((attachment) => {
              putAttachments.push({
                id: attachmentObjectId(attachment.documentId, attachment.attachmentId),
                data: attachment.attachmentData.data
              });
            });
            categorized.attachmentsUpdate.forEach((attachment) => {
              putAttachments.push({
                id: attachmentObjectId(attachment.documentId, attachment.attachmentId),
                data: attachment.attachmentData.data
              });
            });
            await state.dexieAttachmentsTable.bulkPut(putAttachments);
            await state.dexieAttachmentsTable.bulkDelete(categorized.attachmentsRemove.map((attachment) => attachmentObjectId(attachment.documentId, attachment.attachmentId)));
          });
          categorized = ensureNotFalsy(categorized);
          if (categorized.eventBulk.events.length > 0) {
            var lastState = ensureNotFalsy(categorized.newestRow).document;
            categorized.eventBulk.checkpoint = {
              id: lastState[this.primaryPath],
              lwt: lastState._meta.lwt
            };
            this.changes$.next(categorized.eventBulk);
          }
          return ret;
        };
        _proto.findDocumentsById = async function findDocumentsById(ids, deleted) {
          ensureNotClosed(this);
          var state = await this.internals;
          var ret = [];
          await state.dexieDb.transaction("r", state.dexieTable, async () => {
            var docsInDb = await getDocsInDb(this.internals, ids);
            docsInDb.forEach((documentInDb) => {
              if (documentInDb && (!documentInDb._deleted || deleted)) {
                ret.push(documentInDb);
              }
            });
          });
          return ret;
        };
        _proto.query = function query(preparedQuery) {
          ensureNotClosed(this);
          return dexieQuery(this, preparedQuery);
        };
        _proto.count = async function count(preparedQuery) {
          if (preparedQuery.queryPlan.selectorSatisfiedByIndex) {
            var result = await dexieCount(this, preparedQuery);
            return {
              count: result,
              mode: "fast"
            };
          } else {
            var _result2 = await dexieQuery(this, preparedQuery);
            return {
              count: _result2.documents.length,
              mode: "slow"
            };
          }
        };
        _proto.changeStream = function changeStream() {
          ensureNotClosed(this);
          return this.changes$.asObservable();
        };
        _proto.cleanup = async function cleanup(minimumDeletedTime) {
          ensureNotClosed(this);
          var state = await this.internals;
          await state.dexieDb.transaction("rw", state.dexieTable, async () => {
            var maxDeletionTime = now() - minimumDeletedTime;
            var toRemove = await state.dexieTable.where("_meta.lwt").below(maxDeletionTime).toArray();
            var removeIds = [];
            toRemove.forEach((doc) => {
              if (doc._deleted === "1") {
                removeIds.push(doc[this.primaryPath]);
              }
            });
            await state.dexieTable.bulkDelete(removeIds);
          });
          return true;
        };
        _proto.getAttachmentData = async function getAttachmentData(documentId, attachmentId, _digest) {
          ensureNotClosed(this);
          var state = await this.internals;
          var id = attachmentObjectId(documentId, attachmentId);
          return await state.dexieDb.transaction("r", state.dexieAttachmentsTable, async () => {
            var attachment = await state.dexieAttachmentsTable.get(id);
            if (attachment) {
              return attachment.data;
            } else {
              throw new Error("attachment missing documentId: " + documentId + " attachmentId: " + attachmentId);
            }
          });
        };
        _proto.remove = async function remove2() {
          ensureNotClosed(this);
          var state = await this.internals;
          await state.dexieTable.clear();
          return this.close();
        };
        _proto.close = function close6() {
          if (this.closed) {
            return this.closed;
          }
          this.closed = (async () => {
            this.changes$.complete();
            await closeDexieDb(this.internals);
          })();
          return this.closed;
        };
        return RxStorageInstanceDexie2;
      })();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-dexie.js
  function getRxStorageDexie(settings = {}) {
    var storage = new RxStorageDexie(settings);
    return storage;
  }
  var RxStorageDexie;
  var init_rx_storage_dexie = __esm({
    "node_modules/rxdb/dist/esm/plugins/storage-dexie/rx-storage-dexie.js"() {
      init_dexie_helper();
      init_rx_storage_instance_dexie();
      init_rx_storage_helper();
      init_utils_rxdb_version();
      init_rx_error();
      RxStorageDexie = /* @__PURE__ */ (function() {
        function RxStorageDexie2(settings) {
          this.name = RX_STORAGE_NAME_DEXIE;
          this.rxdbVersion = RXDB_VERSION;
          this.settings = settings;
        }
        var _proto = RxStorageDexie2.prototype;
        _proto.createStorageInstance = function createStorageInstance(params) {
          ensureRxStorageInstanceParamsAreCorrect(params);
          if (params.schema.indexes) {
            var indexFields = params.schema.indexes.flat();
            indexFields.filter((indexField) => !indexField.includes(".")).forEach((indexField) => {
              if (!params.schema.required || !params.schema.required.includes(indexField)) {
                throw newRxError("DXE1", {
                  field: indexField,
                  schema: params.schema
                });
              }
            });
          }
          return createDexieStorageInstance(this, params, this.settings);
        };
        return RxStorageDexie2;
      })();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/storage-dexie/index.js
  var init_storage_dexie = __esm({
    "node_modules/rxdb/dist/esm/plugins/storage-dexie/index.js"() {
      init_rx_storage_dexie();
      init_rx_storage_instance_dexie();
      init_dexie_helper();
      init_dexie_query();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/readOnlyError.js
  var init_readOnlyError = __esm({
    "node_modules/@babel/runtime/helpers/esm/readOnlyError.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/query-builder/mquery/mquery-utils.js
  function merge4(to, from2) {
    Object.keys(from2).forEach((key) => {
      if (SPECIAL_PROPERTIES.includes(key)) {
        return;
      }
      if (typeof to[key] === "undefined") {
        to[key] = from2[key];
      } else {
        if (isObject4(from2[key])) merge4(to[key], from2[key]);
        else to[key] = from2[key];
      }
    });
  }
  function isObject4(arg) {
    return "[object Object]" === arg.toString();
  }
  var SPECIAL_PROPERTIES;
  var init_mquery_utils = __esm({
    "node_modules/rxdb/dist/esm/plugins/query-builder/mquery/mquery-utils.js"() {
      SPECIAL_PROPERTIES = ["__proto__", "constructor", "prototype"];
    }
  });

  // node_modules/rxdb/dist/esm/plugins/query-builder/mquery/nosql-query-builder.js
  function mQuerySortToRxDBSort(sort) {
    return Object.entries(sort).map(([k, v]) => {
      var direction = v === 1 ? "asc" : "desc";
      var part = {
        [k]: direction
      };
      return part;
    });
  }
  function push(opts, field, value) {
    if (Array.isArray(opts.sort)) {
      throw newRxTypeError("MQ6", {
        opts,
        field,
        value
      });
    }
    if (value && value.$meta) {
      var sort = opts.sort || (opts.sort = {});
      sort[field] = {
        $meta: value.$meta
      };
      return;
    }
    var val = String(value || 1).toLowerCase();
    if (!/^(?:ascending|asc|descending|desc|1|-1)$/.test(val)) {
      if (Array.isArray(value)) value = "[" + value + "]";
      throw newRxTypeError("MQ7", {
        field,
        value
      });
    }
    var s = opts.sort || (opts.sort = {});
    var valueStr = value.toString().replace("asc", "1").replace("ascending", "1").replace("desc", "-1").replace("descending", "-1");
    s[field] = parseInt(valueStr, 10);
  }
  function _pushArr(opts, field, value) {
    opts.sort = opts.sort || [];
    if (!Array.isArray(opts.sort)) {
      throw newRxTypeError("MQ8", {
        opts,
        field,
        value
      });
    }
    opts.sort.push([field, value]);
  }
  function canMerge(conds) {
    return conds instanceof NoSqlQueryBuilderClass || isObject4(conds);
  }
  function createQueryBuilder(query, path) {
    return new NoSqlQueryBuilderClass(query, path);
  }
  var NoSqlQueryBuilderClass, OTHER_MANGO_ATTRIBUTES, OTHER_MANGO_OPERATORS;
  var init_nosql_query_builder = __esm({
    "node_modules/rxdb/dist/esm/plugins/query-builder/mquery/nosql-query-builder.js"() {
      init_readOnlyError();
      init_mquery_utils();
      init_rx_error();
      NoSqlQueryBuilderClass = /* @__PURE__ */ (function() {
        function NoSqlQueryBuilderClass2(mangoQuery, _path) {
          this.options = {};
          this._conditions = {};
          this._fields = {};
          this._path = _path;
          if (mangoQuery) {
            var queryBuilder = this;
            if (mangoQuery.selector) {
              queryBuilder.find(mangoQuery.selector);
            }
            if (mangoQuery.limit) {
              queryBuilder.limit(mangoQuery.limit);
            }
            if (mangoQuery.skip) {
              queryBuilder.skip(mangoQuery.skip);
            }
            if (mangoQuery.sort) {
              mangoQuery.sort.forEach((s) => queryBuilder.sort(s));
            }
          }
        }
        var _proto = NoSqlQueryBuilderClass2.prototype;
        _proto.where = function where(_path, _val) {
          if (!arguments.length) return this;
          var type5 = typeof arguments[0];
          if ("string" === type5) {
            this._path = arguments[0];
            if (2 === arguments.length) {
              this._conditions[this._path] = arguments[1];
            }
            return this;
          }
          if ("object" === type5 && !Array.isArray(arguments[0])) {
            return this.merge(arguments[0]);
          }
          throw newRxTypeError("MQ1", {
            path: arguments[0]
          });
        };
        _proto.equals = function equals(val) {
          this._ensurePath("equals");
          var path = this._path;
          this._conditions[path] = val;
          return this;
        };
        _proto.eq = function eq(val) {
          this._ensurePath("eq");
          var path = this._path;
          this._conditions[path] = val;
          return this;
        };
        _proto.or = function or(array) {
          var or2 = this._conditions.$or || (this._conditions.$or = []);
          if (!Array.isArray(array)) array = [array];
          or2.push.apply(or2, array);
          return this;
        };
        _proto.nor = function nor(array) {
          var nor2 = this._conditions.$nor || (this._conditions.$nor = []);
          if (!Array.isArray(array)) array = [array];
          nor2.push.apply(nor2, array);
          return this;
        };
        _proto.and = function and(array) {
          var and2 = this._conditions.$and || (this._conditions.$and = []);
          if (!Array.isArray(array)) array = [array];
          and2.push.apply(and2, array);
          return this;
        };
        _proto.mod = function mod(_path, _val) {
          var val;
          var path;
          if (1 === arguments.length) {
            this._ensurePath("mod");
            val = arguments[0];
            path = this._path;
          } else if (2 === arguments.length && !Array.isArray(arguments[1])) {
            this._ensurePath("mod");
            val = arguments.slice();
            path = this._path;
          } else if (3 === arguments.length) {
            val = arguments.slice(1);
            path = arguments[0];
          } else {
            val = arguments[1];
            path = arguments[0];
          }
          var conds = this._conditions[path] || (this._conditions[path] = {});
          conds.$mod = val;
          return this;
        };
        _proto.exists = function exists(_path, _val) {
          var path;
          var val;
          if (0 === arguments.length) {
            this._ensurePath("exists");
            path = this._path;
            val = true;
          } else if (1 === arguments.length) {
            if ("boolean" === typeof arguments[0]) {
              this._ensurePath("exists");
              path = this._path;
              val = arguments[0];
            } else {
              path = arguments[0];
              val = true;
            }
          } else if (2 === arguments.length) {
            path = arguments[0];
            val = arguments[1];
          }
          var conds = this._conditions[path] || (this._conditions[path] = {});
          conds.$exists = val;
          return this;
        };
        _proto.elemMatch = function elemMatch(_path, _criteria) {
          if (null === arguments[0]) throw newRxTypeError("MQ2");
          var fn;
          var path;
          var criteria;
          if ("function" === typeof arguments[0]) {
            this._ensurePath("elemMatch");
            path = this._path;
            fn = arguments[0];
          } else if (isObject4(arguments[0])) {
            this._ensurePath("elemMatch");
            path = this._path;
            criteria = arguments[0];
          } else if ("function" === typeof arguments[1]) {
            path = arguments[0];
            fn = arguments[1];
          } else if (arguments[1] && isObject4(arguments[1])) {
            path = arguments[0];
            criteria = arguments[1];
          } else throw newRxTypeError("MQ2");
          if (fn) {
            criteria = new NoSqlQueryBuilderClass2();
            fn(criteria);
            criteria = criteria._conditions;
          }
          var conds = this._conditions[path] || (this._conditions[path] = {});
          conds.$elemMatch = criteria;
          return this;
        };
        _proto.sort = function sort(arg) {
          if (!arg) return this;
          var len;
          var type5 = typeof arg;
          if (Array.isArray(arg)) {
            len = arg.length;
            for (var i = 0; i < arg.length; ++i) {
              _pushArr(this.options, arg[i][0], arg[i][1]);
            }
            return this;
          }
          if (1 === arguments.length && "string" === type5) {
            arg = arg.split(/\s+/);
            len = arg.length;
            for (var _i = 0; _i < len; ++_i) {
              var field = arg[_i];
              if (!field) continue;
              var ascend = "-" === field[0] ? -1 : 1;
              if (ascend === -1) field = field.substring(1);
              push(this.options, field, ascend);
            }
            return this;
          }
          if (isObject4(arg)) {
            var keys = Object.keys(arg);
            keys.forEach((field2) => push(this.options, field2, arg[field2]));
            return this;
          }
          throw newRxTypeError("MQ3", {
            args: arguments
          });
        };
        _proto.merge = function merge5(source) {
          if (!source) {
            return this;
          }
          if (!canMerge(source)) {
            throw newRxTypeError("MQ4", {
              source
            });
          }
          if (source instanceof NoSqlQueryBuilderClass2) {
            if (source._conditions) merge4(this._conditions, source._conditions);
            if (source._fields) {
              if (!this._fields) this._fields = {};
              merge4(this._fields, source._fields);
            }
            if (source.options) {
              if (!this.options) this.options = {};
              merge4(this.options, source.options);
            }
            if (source._distinct) this._distinct = source._distinct;
            return this;
          }
          merge4(this._conditions, source);
          return this;
        };
        _proto.find = function find(criteria) {
          if (canMerge(criteria)) {
            this.merge(criteria);
          }
          return this;
        };
        _proto._ensurePath = function _ensurePath(method) {
          if (!this._path) {
            throw newRxError("MQ5", {
              method
            });
          }
        };
        _proto.toJSON = function toJSON() {
          var query = {
            selector: this._conditions
          };
          if (this.options.skip) {
            query.skip = this.options.skip;
          }
          if (this.options.limit) {
            query.limit = this.options.limit;
          }
          if (this.options.sort) {
            query.sort = mQuerySortToRxDBSort(this.options.sort);
          }
          return {
            query,
            path: this._path
          };
        };
        return NoSqlQueryBuilderClass2;
      })();
      OTHER_MANGO_ATTRIBUTES = ["limit", "skip", "maxScan", "batchSize", "comment"];
      OTHER_MANGO_ATTRIBUTES.forEach(function(method) {
        NoSqlQueryBuilderClass.prototype[method] = function(v) {
          this.options[method] = v;
          return this;
        };
      });
      OTHER_MANGO_OPERATORS = ["gt", "gte", "lt", "lte", "ne", "in", "nin", "all", "regex", "size"];
      OTHER_MANGO_OPERATORS.forEach(function($conditional) {
        NoSqlQueryBuilderClass.prototype[$conditional] = function() {
          var path;
          var val;
          if (1 === arguments.length) {
            this._ensurePath($conditional);
            val = arguments[0];
            path = this._path;
          } else {
            val = arguments[1];
            path = arguments[0];
          }
          var conds = this._conditions[path] === null || typeof this._conditions[path] === "object" ? this._conditions[path] : this._conditions[path] = {};
          if ($conditional === "regex") {
            if (val instanceof RegExp) {
              throw newRxError("QU16", {
                field: path,
                query: this._conditions
              });
            }
            if (typeof val === "string") {
              conds["$" + $conditional] = val;
            } else {
              conds["$" + $conditional] = val.$regex;
              if (val.$options) {
                conds.$options = val.$options;
              }
            }
          } else {
            conds["$" + $conditional] = val;
          }
          return this;
        };
      });
    }
  });

  // node_modules/rxdb/dist/esm/plugins/query-builder/index.js
  function runBuildingStep(rxQuery, functionName, value) {
    var queryBuilder = createQueryBuilder(clone(rxQuery.mangoQuery), rxQuery.other[RXQUERY_OTHER_FLAG]);
    queryBuilder[functionName](value);
    var queryBuilderJson = queryBuilder.toJSON();
    return createRxQuery(rxQuery.op, queryBuilderJson.query, rxQuery.collection, {
      ...rxQuery.other,
      [RXQUERY_OTHER_FLAG]: queryBuilderJson.path
    });
  }
  function applyBuildingStep(proto, functionName) {
    proto[functionName] = function(value) {
      if (overwritable.isDevMode() && this.op === "findByIds") {
        throw newRxError("QU17", {
          collection: this.collection.name,
          query: this.mangoQuery
        });
      }
      return runBuildingStep(this, functionName, value);
    };
  }
  var RXQUERY_OTHER_FLAG, RxDBQueryBuilderPlugin;
  var init_query_builder = __esm({
    "node_modules/rxdb/dist/esm/plugins/query-builder/index.js"() {
      init_nosql_query_builder();
      init_rx_query();
      init_utils();
      init_overwritable();
      init_rx_error();
      init_nosql_query_builder();
      RXQUERY_OTHER_FLAG = "queryBuilderPath";
      RxDBQueryBuilderPlugin = {
        name: "query-builder",
        rxdb: true,
        prototypes: {
          RxQuery(proto) {
            ["where", "equals", "eq", "or", "nor", "and", "mod", "exists", "elemMatch", "sort"].forEach((attribute) => {
              applyBuildingStep(proto, attribute);
            });
            OTHER_MANGO_ATTRIBUTES.forEach((attribute) => {
              applyBuildingStep(proto, attribute);
            });
            OTHER_MANGO_OPERATORS.forEach((operator) => {
              applyBuildingStep(proto, operator);
            });
          }
        }
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/_internal.js
  var createBitwiseOperator;
  var init_internal10 = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/_internal.js"() {
      init_util();
      init_predicates();
      createBitwiseOperator = (predicate) => {
        return createQueryOperator(
          (value, mask, _options4) => {
            let b = 0;
            if (isArray3(mask)) {
              for (const n of mask) b = b | 1 << n;
            } else {
              b = mask;
            }
            return predicate(value & b, b);
          }
        );
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/bitsAllClear.js
  var $bitsAllClear;
  var init_bitsAllClear = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/bitsAllClear.js"() {
      init_internal10();
      $bitsAllClear = createBitwiseOperator((result, _) => result == 0);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/bitsAllSet.js
  var $bitsAllSet;
  var init_bitsAllSet = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/bitsAllSet.js"() {
      init_internal10();
      $bitsAllSet = createBitwiseOperator(
        (result, mask) => result == mask
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/bitsAnyClear.js
  var $bitsAnyClear;
  var init_bitsAnyClear = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/bitsAnyClear.js"() {
      init_internal10();
      $bitsAnyClear = createBitwiseOperator(
        (result, mask) => result < mask
      );
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/bitsAnySet.js
  var $bitsAnySet;
  var init_bitsAnySet = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/bitsAnySet.js"() {
      init_internal10();
      $bitsAnySet = createBitwiseOperator((result, _) => result > 0);
    }
  });

  // node_modules/mingo/dist/esm/operators/query/bitwise/index.js
  var init_bitwise2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/bitwise/index.js"() {
      init_bitsAllClear();
      init_bitsAllSet();
      init_bitsAnyClear();
      init_bitsAnySet();
    }
  });

  // node_modules/mingo/dist/esm/operators/query/index.js
  var query_exports = {};
  __export(query_exports, {
    $all: () => $all2,
    $and: () => $and2,
    $bitsAllClear: () => $bitsAllClear,
    $bitsAllSet: () => $bitsAllSet,
    $bitsAnyClear: () => $bitsAnyClear,
    $bitsAnySet: () => $bitsAnySet,
    $elemMatch: () => $elemMatch2,
    $eq: () => $eq3,
    $exists: () => $exists,
    $expr: () => $expr,
    $gt: () => $gt3,
    $gte: () => $gte3,
    $in: () => $in2,
    $jsonSchema: () => $jsonSchema,
    $lt: () => $lt3,
    $lte: () => $lte3,
    $mod: () => $mod2,
    $ne: () => $ne3,
    $nin: () => $nin3,
    $nor: () => $nor,
    $not: () => $not2,
    $or: () => $or2,
    $regex: () => $regex2,
    $size: () => $size2,
    $type: () => $type2,
    $where: () => $where
  });
  var init_query2 = __esm({
    "node_modules/mingo/dist/esm/operators/query/index.js"() {
      init_array2();
      init_bitwise2();
      init_comparison2();
      init_element();
      init_evaluation();
      init_logical();
    }
  });

  // node_modules/mingo/dist/esm/operators/update/_internal.js
  function tokenizePath(selector) {
    if (!selector.includes(".$")) {
      return [{ parent: selector, selector }, []];
    }
    const begin = selector.indexOf(".$");
    const end = selector.indexOf("]");
    const parent = selector.substring(0, begin);
    const child = selector.substring(begin + 3, end);
    assert(
      child === "" || FILTER_IDENT_RE.test(child),
      "The filter <identifier> must begin with a lowercase letter and contain only alphanumeric characters."
    );
    const rest = selector.substring(end + 2);
    const [next, elems] = rest ? tokenizePath(rest) : [];
    return [
      { selector, parent, child: child || "$", next },
      [child, ...elems || []].filter(Boolean)
    ];
  }
  function walkExpression(expr, arrayFilter, options, callback) {
    const res = [];
    for (const [selector, val] of Object.entries(expr)) {
      const [node, vars] = tokenizePath(selector);
      if (!vars.length) {
        if (callback(val, node, {})) res.push(node.parent);
      } else {
        const conditions = {};
        arrayFilter.forEach((o) => {
          Object.keys(o).forEach((k) => {
            vars.forEach((w) => {
              if (k === w || k.startsWith(w + ".")) {
                conditions[w] = conditions[w] || {};
                Object.assign(conditions[w], { [k]: o[k] });
              }
            });
          });
        });
        const queries = {};
        for (const [k, condition] of Object.entries(conditions)) {
          queries[k] = new Query(condition, options.queryOptions);
        }
        if (callback(val, node, queries)) res.push(node.parent);
      }
    }
    return res;
  }
  var UPDATE_OPTIONS, clone2, FILTER_IDENT_RE, applyUpdate;
  var init_internal11 = __esm({
    "node_modules/mingo/dist/esm/operators/update/_internal.js"() {
      init_core();
      init_boolean();
      init_comparison();
      init_query2();
      init_query();
      init_util();
      UPDATE_OPTIONS = {
        cloneMode: "copy",
        queryOptions: initOptions({
          context: Context.init().addQueryOps(query_exports).addExpressionOps(boolean_exports).addExpressionOps(comparison_exports)
        })
      };
      clone2 = (mode, val) => {
        switch (mode) {
          case "deep":
            return cloneDeep(val);
          case "copy": {
            if (isDate(val)) return new Date(val);
            if (isArray3(val)) return [...val];
            if (isObject2(val)) return { ...val };
            if (isRegExp(val)) return new RegExp(val);
            return val;
          }
          default:
            return val;
        }
      };
      FILTER_IDENT_RE = /^[a-z]+[a-zA-Z0-9]*$/;
      applyUpdate = (o, n, q, f, opts) => {
        const { parent, child: c, next } = n;
        if (!c) {
          let b = false;
          const g = (u, k) => b = Boolean(f(u, k)) || b;
          walk(o, parent, g, opts);
          return b;
        }
        const t = resolve(o, parent);
        if (!isArray3(t)) return false;
        return t.map((e, i) => {
          if (q[c] && !q[c].test({ [c]: e })) return false;
          return next ? applyUpdate(e, next, q, f, opts) : f(t, i);
        }).some(Boolean);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/addToSet.js
  var $addToSet;
  var init_addToSet2 = __esm({
    "node_modules/mingo/dist/esm/operators/update/addToSet.js"() {
      init_util();
      init_internal11();
      $addToSet = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          const args = { $each: [val] };
          if (isObject2(val) && has(val, "$each")) {
            Object.assign(args, val);
          }
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              const prev = o[k] || (o[k] = []);
              const common = intersection([prev, args.$each]);
              if (common.length === args.$each.length) return false;
              o[k] = clone2(options.cloneMode, unique(prev.concat(args.$each)));
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/bit.js
  var BIT_OPS, $bit;
  var init_bit = __esm({
    "node_modules/mingo/dist/esm/operators/update/bit.js"() {
      init_util();
      init_internal11();
      BIT_OPS = /* @__PURE__ */ new Set(["and", "or", "xor"]);
      $bit = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          const op = Object.keys(val);
          assert(
            op.length === 1 && BIT_OPS.has(op[0]),
            `Invalid bit operator '${op[0]}'. Must be one of 'and', 'or', or 'xor'.`
          );
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              let n = o[k];
              const v = val[op[0]];
              if (n !== void 0 && !(isNumber(n) && isNumber(v))) return false;
              n = n || 0;
              switch (op[0]) {
                case "and":
                  o[k] = n & v;
                  break;
                case "or":
                  o[k] = n | v;
                  break;
                case "xor":
                  o[k] = n ^ v;
                  break;
              }
              return o[k] !== n;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/currentDate.js
  var $currentDate;
  var init_currentDate = __esm({
    "node_modules/mingo/dist/esm/operators/update/currentDate.js"() {
      init_internal11();
      $currentDate = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        const now3 = Date.now();
        return walkExpression(expr, arrayFilters, options, (_, node, queries) => {
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              o[k] = now3;
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/inc.js
  var $inc;
  var init_inc = __esm({
    "node_modules/mingo/dist/esm/operators/update/inc.js"() {
      init_util();
      init_internal11();
      $inc = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          if (!node.child) {
            const n = resolve(obj, node.parent);
            assert(
              n === void 0 || isNumber(n),
              `cannot apply $inc to a value of non-numeric type`
            );
          }
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              o[k] = (o[k] || (o[k] = 0)) + val;
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/max.js
  var $max;
  var init_max2 = __esm({
    "node_modules/mingo/dist/esm/operators/update/max.js"() {
      init_util();
      init_internal11();
      $max = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              if (o[k] !== void 0 && compare(o[k], val) > -1) return false;
              o[k] = val;
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/min.js
  var $min;
  var init_min2 = __esm({
    "node_modules/mingo/dist/esm/operators/update/min.js"() {
      init_util();
      init_internal11();
      $min = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              if (o[k] !== void 0 && compare(o[k], val) < 1) return false;
              o[k] = val;
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/mul.js
  var $mul;
  var init_mul = __esm({
    "node_modules/mingo/dist/esm/operators/update/mul.js"() {
      init_internal11();
      $mul = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              const prev = o[k];
              o[k] = o[k] === void 0 ? 0 : o[k] * val;
              return o[k] !== prev;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/pop.js
  var $pop;
  var init_pop = __esm({
    "node_modules/mingo/dist/esm/operators/update/pop.js"() {
      init_util();
      init_internal11();
      $pop = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(obj, node, queries, (o, k) => {
            const arr = o[k];
            assert(
              isArray3(arr),
              `path '${node.selector}' contains an element of non-array type.`
            );
            if (!arr.length) return false;
            if (val === -1) {
              arr.splice(0, 1);
            } else {
              arr.pop();
            }
            return true;
          });
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/pull.js
  var $pull;
  var init_pull = __esm({
    "node_modules/mingo/dist/esm/operators/update/pull.js"() {
      init_query();
      init_util();
      init_internal11();
      $pull = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          const wrap = !isObject2(val) || Object.keys(val).some(isOperator);
          const query = new Query(
            wrap ? { k: val } : val,
            options.queryOptions
          );
          const pred = wrap ? (v) => query.test({ k: v }) : (v) => query.test(v);
          return applyUpdate(obj, node, queries, (o, k) => {
            const prev = o[k];
            const curr = new Array();
            const found = prev.map((v) => {
              const b = pred(v);
              if (!b) curr.push(v);
              return b;
            }).some(Boolean);
            if (!found) return false;
            o[k] = curr;
            return true;
          });
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/pullAll.js
  var $pullAll;
  var init_pullAll = __esm({
    "node_modules/mingo/dist/esm/operators/update/pullAll.js"() {
      init_internal11();
      init_pull();
      $pullAll = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        const pullExpr = {};
        Object.entries(expr).forEach(([k, v]) => {
          pullExpr[k] = { $in: v };
        });
        return $pull(obj, pullExpr, arrayFilters, options);
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/push.js
  var OPERATOR_MODIFIERS, $push2;
  var init_push2 = __esm({
    "node_modules/mingo/dist/esm/operators/update/push.js"() {
      init_util();
      init_internal11();
      OPERATOR_MODIFIERS = Object.freeze([
        "$each",
        "$slice",
        "$sort",
        "$position"
      ]);
      $push2 = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          const args = {
            $each: [val]
          };
          if (isObject2(val) && OPERATOR_MODIFIERS.some((m) => has(val, m))) {
            Object.assign(args, val);
          }
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              const arr = o[k] || (o[k] = []);
              const prev = arr.slice(0, args.$slice || arr.length);
              const oldsize = arr.length;
              const pos = isNumber(args.$position) ? args.$position : arr.length;
              arr.splice(pos, 0, ...clone2(options.cloneMode, args.$each));
              if (args.$sort) {
                const sortKey = isObject2(args.$sort) ? Object.keys(args.$sort || {}).pop() : "";
                const order = !sortKey ? args.$sort : args.$sort[sortKey];
                const f = !sortKey ? (a) => a : (a) => resolve(a, sortKey);
                arr.sort((a, b) => order * compare(f(a), f(b)));
              }
              if (isNumber(args.$slice)) {
                if (args.$slice < 0) arr.splice(0, arr.length + args.$slice);
                else arr.splice(args.$slice);
              }
              return oldsize != arr.length || !isEqual(prev, arr);
            },
            { descendArray: true, buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/set.js
  var $set;
  var init_set3 = __esm({
    "node_modules/mingo/dist/esm/operators/update/set.js"() {
      init_util();
      init_internal11();
      $set = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(
            obj,
            node,
            queries,
            (o, k) => {
              if (isEqual(o[k], val)) return false;
              o[k] = clone2(options.cloneMode, val);
              return true;
            },
            { buildGraph: true }
          );
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/rename.js
  var $rename;
  var init_rename = __esm({
    "node_modules/mingo/dist/esm/operators/update/rename.js"() {
      init_util();
      init_internal11();
      init_set3();
      $rename = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        const res = [];
        const changed = walkExpression(expr, arrayFilters, options, (val, node, queries) => {
          return applyUpdate(obj, node, queries, (o, k) => {
            if (!has(o, k)) return false;
            res.push(...$set(obj, { [val]: o[k] }, arrayFilters, options));
            delete o[k];
            return true;
          });
        });
        return Array.from(new Set(changed.concat(res)));
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/unset.js
  var $unset;
  var init_unset2 = __esm({
    "node_modules/mingo/dist/esm/operators/update/unset.js"() {
      init_util();
      init_internal11();
      $unset = (obj, expr, arrayFilters = [], options = UPDATE_OPTIONS) => {
        return walkExpression(expr, arrayFilters, options, (_, node, queries) => {
          return applyUpdate(obj, node, queries, (o, k) => {
            if (!has(o, k)) return false;
            if (isArray3(o)) {
              o[k] = null;
            } else {
              delete o[k];
            }
            return true;
          });
        });
      };
    }
  });

  // node_modules/mingo/dist/esm/operators/update/index.js
  var update_exports = {};
  __export(update_exports, {
    $addToSet: () => $addToSet,
    $bit: () => $bit,
    $currentDate: () => $currentDate,
    $inc: () => $inc,
    $max: () => $max,
    $min: () => $min,
    $mul: () => $mul,
    $pop: () => $pop,
    $pull: () => $pull,
    $pullAll: () => $pullAll,
    $push: () => $push2,
    $rename: () => $rename,
    $set: () => $set,
    $unset: () => $unset
  });
  var init_update = __esm({
    "node_modules/mingo/dist/esm/operators/update/index.js"() {
      init_addToSet2();
      init_bit();
      init_currentDate();
      init_inc();
      init_max2();
      init_min2();
      init_mul();
      init_pop();
      init_pull();
      init_pullAll();
      init_push2();
      init_rename();
      init_set3();
      init_unset2();
    }
  });

  // node_modules/mingo/dist/esm/updater.js
  function createUpdater(defaultOptions) {
    defaultOptions = defaultOptions ?? UPDATE_OPTIONS;
    return (obj, expr, arrayFilters = [], condition = {}, options = defaultOptions) => {
      const entry = Object.entries(expr);
      assert(
        entry.length === 1,
        "Update expression must contain only one operator."
      );
      const [op, args] = entry[0];
      assert(
        has(update_exports, op),
        `Update operator '${op}' is not supported.`
      );
      const mutate = update_exports[op];
      if (Object.keys(condition).length) {
        const q = new Query(condition, options.queryOptions);
        if (!q.test(obj)) return [];
      }
      return mutate(obj, args, arrayFilters, options);
    };
  }
  var update;
  var init_updater = __esm({
    "node_modules/mingo/dist/esm/updater.js"() {
      init_update();
      init_internal11();
      init_query();
      init_util();
      update = createUpdater();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/update/mingo-updater.js
  function mingoUpdater(d, op) {
    if (!updater) {
      var updateObject = createUpdater({
        cloneMode: "none"
      });
      updater = (d2, op2) => {
        var cloned = clone(d2);
        updateObject(cloned, op2);
        return cloned;
      };
    }
    return updater(d, op);
  }
  var updater;
  var init_mingo_updater = __esm({
    "node_modules/rxdb/dist/esm/plugins/update/mingo-updater.js"() {
      init_updater();
      init_utils();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/update/index.js
  function incrementalUpdate(updateObj) {
    return this.incrementalModify((docData) => {
      var newDocData = mingoUpdater(docData, updateObj);
      return newDocData;
    });
  }
  function update2(updateObj) {
    var oldDocData = this._data;
    var newDocData = mingoUpdater(oldDocData, updateObj);
    return this._saveData(newDocData, oldDocData);
  }
  async function RxQueryUpdate(updateObj) {
    return runQueryUpdateFunction(this.asRxQuery, (doc) => doc.update(updateObj));
  }
  var RxDBUpdatePlugin;
  var init_update2 = __esm({
    "node_modules/rxdb/dist/esm/plugins/update/index.js"() {
      init_rx_query_helper();
      init_mingo_updater();
      RxDBUpdatePlugin = {
        name: "update",
        rxdb: true,
        prototypes: {
          RxDocument: (proto) => {
            proto.update = update2;
            proto.incrementalUpdate = incrementalUpdate;
          },
          RxQuery: (proto) => {
            proto.update = RxQueryUpdate;
          }
        }
      };
    }
  });

  // node_modules/rxdb/dist/esm/plugins/migration-schema/migration-helpers.js
  async function getOldCollectionMeta(migrationState) {
    var collectionDocKeys = getPreviousVersions(migrationState.collection.schema.jsonSchema).map((version) => migrationState.collection.name + "-" + version);
    var found = await migrationState.database.internalStore.findDocumentsById(collectionDocKeys.map((key) => getPrimaryKeyOfInternalDocument(key, INTERNAL_CONTEXT_COLLECTION)), false);
    var foundById = {};
    found.forEach((f) => foundById[f.key] = f);
    var oldest = collectionDocKeys.find((key) => foundById[key]);
    return oldest ? foundById[oldest] : void 0;
  }
  function migrateDocumentData(collection, docSchemaVersion, docData) {
    var attachmentsBefore = flatClone(docData._attachments);
    var mutateableDocData = clone(docData);
    var meta = mutateableDocData._meta;
    delete mutateableDocData._meta;
    mutateableDocData._attachments = attachmentsBefore;
    var nextVersion = docSchemaVersion + 1;
    var currentPromise = Promise.resolve(mutateableDocData);
    var _loop = function() {
      var version = nextVersion;
      currentPromise = currentPromise.then((docOrNull) => runStrategyIfNotNull(collection, version, docOrNull));
      nextVersion++;
    };
    while (nextVersion <= collection.schema.version) {
      _loop();
    }
    return currentPromise.then((doc) => {
      if (doc === null) {
        return PROMISE_RESOLVE_NULL;
      }
      if (meta) {
        doc._meta = meta;
      }
      return doc;
    });
  }
  function runStrategyIfNotNull(collection, version, docOrNull) {
    if (docOrNull === null) {
      return PROMISE_RESOLVE_NULL;
    } else {
      var ret = collection.migrationStrategies[version](docOrNull, collection);
      var retPromise = toPromise(ret);
      return retPromise;
    }
  }
  async function mustMigrate(migrationState) {
    if (migrationState.collection.schema.version === 0) {
      return PROMISE_RESOLVE_FALSE;
    }
    var oldColDoc = await getOldCollectionMeta(migrationState);
    return !!oldColDoc;
  }
  function addMigrationStateToDatabase(migrationState) {
    var allSubject = getMigrationStateByDatabase(migrationState.database);
    var allList = allSubject.getValue().slice(0);
    allList.push(migrationState);
    allSubject.next(allList);
  }
  function getMigrationStateByDatabase(database) {
    return getFromMapOrCreate(DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE, database, () => new BehaviorSubject([]));
  }
  function onDatabaseClose(database) {
    var subject = DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE.get(database);
    if (subject) {
      subject.complete();
    }
  }
  var MIGRATION_DEFAULT_BATCH_SIZE, DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE;
  var init_migration_helpers = __esm({
    "node_modules/rxdb/dist/esm/plugins/migration-schema/migration-helpers.js"() {
      init_esm5();
      init_rx_database_internal_store();
      init_rx_schema();
      init_utils();
      MIGRATION_DEFAULT_BATCH_SIZE = 200;
      DATA_MIGRATION_STATE_SUBJECT_BY_DATABASE = /* @__PURE__ */ new WeakMap();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/migration-schema/rx-migration-state.js
  var RxMigrationState;
  var init_rx_migration_state = __esm({
    "node_modules/rxdb/dist/esm/plugins/migration-schema/rx-migration-state.js"() {
      init_esm5();
      init_rx_error();
      init_migration_helpers();
      init_utils();
      init_rx_storage_helper();
      init_esbrowser();
      init_replication_protocol();
      init_overwritable();
      init_rx_database_internal_store();
      init_rx_query_helper();
      RxMigrationState = /* @__PURE__ */ (function() {
        function RxMigrationState2(collection, migrationStrategies, statusDocKey = [collection.name, "v", collection.schema.version].join("-")) {
          this.started = false;
          this.canceled = false;
          this.updateStatusHandlers = [];
          this.updateStatusQueue = PROMISE_RESOLVE_TRUE;
          this.collection = collection;
          this.migrationStrategies = migrationStrategies;
          this.statusDocKey = statusDocKey;
          this.database = collection.database;
          this.oldCollectionMeta = getOldCollectionMeta(this);
          this.mustMigrate = mustMigrate(this);
          this.statusDocId = getPrimaryKeyOfInternalDocument(this.statusDocKey, INTERNAL_CONTEXT_MIGRATION_STATUS);
          addMigrationStateToDatabase(this);
          this.$ = observeSingle(this.database.internalStore, this.statusDocId).pipe(filter((d) => !!d), map((d) => ensureNotFalsy(d).data), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
        }
        var _proto = RxMigrationState2.prototype;
        _proto.getStatus = function getStatus() {
          return firstValueFrom(this.$);
        };
        _proto.startMigration = async function startMigration(batchSize = MIGRATION_DEFAULT_BATCH_SIZE) {
          var must = await this.mustMigrate;
          if (!must) {
            return;
          }
          if (this.started) {
            throw newRxError("DM1");
          }
          this.started = true;
          if (this.database.multiInstance) {
            this.broadcastChannel = new BroadcastChannel2(["rx-migration-state", this.database.name, this.collection.name, this.collection.schema.version].join("|"));
            var leaderElector = createLeaderElection(this.broadcastChannel);
            await leaderElector.awaitLeadership();
          }
          var oldCollectionMeta = await this.oldCollectionMeta;
          var oldStorageInstance = await this.database.storage.createStorageInstance({
            databaseName: this.database.name,
            collectionName: this.collection.name,
            databaseInstanceToken: this.database.token,
            multiInstance: this.database.multiInstance,
            options: {},
            schema: ensureNotFalsy(oldCollectionMeta).data.schema,
            password: this.database.password,
            devMode: overwritable.isDevMode()
          });
          var connectedInstances = await this.getConnectedStorageInstances();
          var totalCount = await this.countAllDocuments([oldStorageInstance].concat(connectedInstances.map((r) => r.oldStorage)));
          await this.updateStatus((s) => {
            s.count.total = totalCount;
            return s;
          });
          try {
            await Promise.all(connectedInstances.map(async (connectedInstance) => {
              await addConnectedStorageToCollection(this.collection, connectedInstance.newStorage.collectionName, connectedInstance.newStorage.schema);
              await this.migrateStorage(connectedInstance.oldStorage, connectedInstance.newStorage, batchSize);
              await connectedInstance.newStorage.close();
            }));
            await this.migrateStorage(
              oldStorageInstance,
              /**
               * Use the originalStorageInstance here
               * so that the _meta.lwt time keeps the same
               * and our replication checkpoints still point to the
               * correct checkpoint.
              */
              this.collection.storageInstance.originalStorageInstance,
              batchSize
            );
          } catch (err) {
            await oldStorageInstance.close();
            await this.updateStatus((s) => {
              s.status = "ERROR";
              s.error = errorToPlainJson(err);
              return s;
            });
            return;
          }
          try {
            await writeSingle(this.database.internalStore, {
              previous: oldCollectionMeta,
              document: Object.assign({}, oldCollectionMeta, {
                _deleted: true
              })
            }, "rx-migration-remove-collection-meta");
          } catch (error) {
            var isConflict = isBulkWriteConflictError(error);
            if (isConflict && !!isConflict.documentInDb._deleted) {
            } else {
              throw error;
            }
          }
          await this.updateStatus((s) => {
            s.status = "DONE";
            return s;
          });
          if (this.broadcastChannel) {
            await this.broadcastChannel.close();
          }
        };
        _proto.updateStatus = function updateStatus(handler) {
          this.updateStatusHandlers.push(handler);
          this.updateStatusQueue = this.updateStatusQueue.then(async () => {
            if (this.updateStatusHandlers.length === 0) {
              return;
            }
            var useHandlers = this.updateStatusHandlers;
            this.updateStatusHandlers = [];
            while (true) {
              var previous = await getSingleDocument(this.database.internalStore, this.statusDocId);
              var newDoc = clone(previous);
              if (!previous) {
                newDoc = {
                  id: this.statusDocId,
                  key: this.statusDocKey,
                  context: INTERNAL_CONTEXT_MIGRATION_STATUS,
                  data: {
                    collectionName: this.collection.name,
                    status: "RUNNING",
                    count: {
                      total: 0,
                      handled: 0,
                      percent: 0
                    }
                  },
                  _deleted: false,
                  _meta: getDefaultRxDocumentMeta(),
                  _rev: getDefaultRevision(),
                  _attachments: {}
                };
              }
              var status = ensureNotFalsy(newDoc).data;
              for (var oneHandler of useHandlers) {
                status = oneHandler(status);
              }
              status.count.percent = Math.round(status.count.handled / status.count.total * 100);
              if (newDoc && previous && deepEqual(newDoc.data, previous.data)) {
                break;
              }
              try {
                await writeSingle(this.database.internalStore, {
                  previous,
                  document: ensureNotFalsy(newDoc)
                }, INTERNAL_CONTEXT_MIGRATION_STATUS);
                break;
              } catch (err) {
                if (!isBulkWriteConflictError(err)) {
                  throw err;
                }
              }
            }
          });
          return this.updateStatusQueue;
        };
        _proto.migrateStorage = async function migrateStorage(oldStorage, newStorage, batchSize) {
          this.collection.onClose.push(() => this.cancel());
          this.database.onClose.push(() => this.cancel());
          var replicationMetaStorageInstance = await this.database.storage.createStorageInstance({
            databaseName: this.database.name,
            collectionName: "rx-migration-state-meta-" + oldStorage.collectionName + "-" + oldStorage.schema.version,
            databaseInstanceToken: this.database.token,
            multiInstance: this.database.multiInstance,
            options: {},
            schema: getRxReplicationMetaInstanceSchema(oldStorage.schema, hasEncryption(oldStorage.schema)),
            password: this.database.password,
            devMode: overwritable.isDevMode()
          });
          var replicationHandlerBase = rxStorageInstanceToReplicationHandler(
            newStorage,
            /**
             * Ignore push-conflicts.
             * If this happens we drop the 'old' document state.
             */
            defaultConflictHandler,
            this.database.token,
            true
          );
          var replicationState = replicateRxStorageInstance({
            keepMeta: true,
            identifier: ["rx-migration-state", oldStorage.collectionName, oldStorage.schema.version, this.collection.schema.version].join("-"),
            replicationHandler: {
              masterChangesSince() {
                return Promise.resolve({
                  checkpoint: null,
                  documents: []
                });
              },
              masterWrite: async (rows) => {
                var migratedRows = await Promise.all(rows.map(async (row) => {
                  var newDocData = row.newDocumentState;
                  if (newStorage.schema.title === META_INSTANCE_SCHEMA_TITLE) {
                    newDocData = row.newDocumentState.docData;
                    if (row.newDocumentState.isCheckpoint === "1") {
                      return {
                        assumedMasterState: void 0,
                        newDocumentState: row.newDocumentState
                      };
                    }
                  }
                  var migratedDocData = await migrateDocumentData(this.collection, oldStorage.schema.version, newDocData);
                  if (migratedDocData === null) {
                    return null;
                  }
                  var newRow = {
                    // drop the assumed master state, we do not have to care about conflicts here.
                    assumedMasterState: void 0,
                    newDocumentState: newStorage.schema.title === META_INSTANCE_SCHEMA_TITLE ? Object.assign({}, row.newDocumentState, {
                      docData: migratedDocData
                    }) : migratedDocData
                  };
                  return newRow;
                }));
                migratedRows = migratedRows.filter((row) => !!row && !!row.newDocumentState);
                var result = await replicationHandlerBase.masterWrite(migratedRows);
                return result;
              },
              masterChangeStream$: new Subject().asObservable()
            },
            forkInstance: oldStorage,
            metaInstance: replicationMetaStorageInstance,
            pushBatchSize: batchSize,
            pullBatchSize: 0,
            conflictHandler: defaultConflictHandler,
            hashFunction: this.database.hashFunction
          });
          var hasError = false;
          replicationState.events.error.subscribe((err) => hasError = err);
          replicationState.events.processed.up.subscribe(() => {
            this.updateStatus((status) => {
              status.count.handled = status.count.handled + 1;
              return status;
            });
          });
          await awaitRxStorageReplicationFirstInSync(replicationState);
          await awaitRxStorageReplicationInSync(replicationState);
          await this.updateStatusQueue;
          if (hasError) {
            await replicationMetaStorageInstance.close();
            throw hasError;
          }
          await Promise.all([oldStorage.remove(), replicationMetaStorageInstance.remove()]);
          await this.cancel();
        };
        _proto.cancel = async function cancel() {
          this.canceled = true;
          if (this.replicationState) {
            await cancelRxStorageReplication(this.replicationState);
          }
          if (this.broadcastChannel) {
            await this.broadcastChannel.close();
          }
        };
        _proto.countAllDocuments = async function countAllDocuments(storageInstances) {
          var ret = 0;
          await Promise.all(storageInstances.map(async (instance) => {
            var preparedQuery = prepareQuery(instance.schema, normalizeMangoQuery(instance.schema, {
              selector: {}
            }));
            var countResult = await instance.count(preparedQuery);
            ret += countResult.count;
          }));
          return ret;
        };
        _proto.getConnectedStorageInstances = async function getConnectedStorageInstances() {
          var oldCollectionMeta = ensureNotFalsy(await this.oldCollectionMeta);
          var ret = [];
          await Promise.all(await Promise.all(oldCollectionMeta.data.connectedStorages.map(async (connectedStorage) => {
            if (connectedStorage.schema.title !== META_INSTANCE_SCHEMA_TITLE) {
              throw new Error("unknown migration handling for schema");
            }
            var newSchema = getRxReplicationMetaInstanceSchema(clone(this.collection.schema.jsonSchema), hasEncryption(connectedStorage.schema));
            newSchema.version = this.collection.schema.version;
            var [oldStorage, newStorage] = await Promise.all([this.database.storage.createStorageInstance({
              databaseInstanceToken: this.database.token,
              databaseName: this.database.name,
              devMode: overwritable.isDevMode(),
              multiInstance: this.database.multiInstance,
              options: {},
              schema: connectedStorage.schema,
              password: this.database.password,
              collectionName: connectedStorage.collectionName
            }), this.database.storage.createStorageInstance({
              databaseInstanceToken: this.database.token,
              databaseName: this.database.name,
              devMode: overwritable.isDevMode(),
              multiInstance: this.database.multiInstance,
              options: {},
              schema: newSchema,
              password: this.database.password,
              collectionName: connectedStorage.collectionName
            })]);
            ret.push({
              oldStorage,
              newStorage
            });
          })));
          return ret;
        };
        _proto.migratePromise = async function migratePromise(batchSize) {
          this.startMigration(batchSize);
          var must = await this.mustMigrate;
          if (!must) {
            return {
              status: "DONE",
              collectionName: this.collection.name,
              count: {
                handled: 0,
                percent: 0,
                total: 0
              }
            };
          }
          var result = await Promise.race([firstValueFrom(this.$.pipe(filter((d) => d.status === "DONE"))), firstValueFrom(this.$.pipe(filter((d) => d.status === "ERROR")))]);
          if (result.status === "ERROR") {
            throw newRxError("DM4", {
              collection: this.collection.name,
              error: result.error
            });
          } else {
            return result;
          }
        };
        return RxMigrationState2;
      })();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/local-documents/local-documents-helper.js
  function getLocalDocStateByParent(parent) {
    var statePromise = LOCAL_DOC_STATE_BY_PARENT.get(parent);
    if (!statePromise) {
      var database = parent.database ? parent.database : parent;
      var collectionName = parent.database ? parent.name : "";
      throw newRxError("LD8", {
        database: database.name,
        collection: collectionName
      });
    }
    return statePromise;
  }
  function createLocalDocumentStorageInstance(databaseInstanceToken, storage, databaseName, collectionName, instanceCreationOptions, multiInstance) {
    return storage.createStorageInstance({
      databaseInstanceToken,
      databaseName,
      /**
       * Use a different collection name for the local documents instance
       * so that the local docs can be kept while deleting the normal instance
       * after migration.
       */
      collectionName: getCollectionLocalInstanceName(collectionName),
      schema: RX_LOCAL_DOCUMENT_SCHEMA,
      options: instanceCreationOptions,
      multiInstance,
      devMode: overwritable.isDevMode()
    });
  }
  function closeStateByParent(parent) {
    var statePromise = LOCAL_DOC_STATE_BY_PARENT.get(parent);
    if (statePromise) {
      LOCAL_DOC_STATE_BY_PARENT.delete(parent);
      return statePromise.then((state) => state.storageInstance.close());
    }
  }
  async function removeLocalDocumentsStorageInstance(storage, databaseName, collectionName) {
    var databaseInstanceToken = randomToken(10);
    var storageInstance = await createLocalDocumentStorageInstance(databaseInstanceToken, storage, databaseName, collectionName, {}, false);
    await storageInstance.remove();
  }
  function getCollectionLocalInstanceName(collectionName) {
    return "plugin-local-documents-" + collectionName;
  }
  var LOCAL_DOC_STATE_BY_PARENT, LOCAL_DOC_STATE_BY_PARENT_RESOLVED, RX_LOCAL_DOCUMENT_SCHEMA;
  var init_local_documents_helper = __esm({
    "node_modules/rxdb/dist/esm/plugins/local-documents/local-documents-helper.js"() {
      init_rx_error();
      init_rx_schema_helper();
      init_utils();
      init_overwritable();
      LOCAL_DOC_STATE_BY_PARENT = /* @__PURE__ */ new WeakMap();
      LOCAL_DOC_STATE_BY_PARENT_RESOLVED = /* @__PURE__ */ new WeakMap();
      RX_LOCAL_DOCUMENT_SCHEMA = fillWithDefaultSettings({
        title: "RxLocalDocument",
        version: 0,
        primaryKey: "id",
        type: "object",
        properties: {
          id: {
            type: "string",
            maxLength: 128
          },
          data: {
            type: "object",
            additionalProperties: true
          }
        },
        required: ["id", "data"]
      });
    }
  });

  // node_modules/rxdb/dist/esm/plugins/local-documents/local-documents.js
  async function insertLocal(id, data) {
    var state = await getLocalDocStateByParent(this);
    var docData = {
      id,
      data,
      _deleted: false,
      _meta: getDefaultRxDocumentMeta(),
      _rev: getDefaultRevision(),
      _attachments: {}
    };
    return writeSingle(state.storageInstance, {
      document: docData
    }, "local-document-insert").then((newDocData) => state.docCache.getCachedRxDocument(newDocData));
  }
  function upsertLocal(id, data) {
    return this.getLocal(id).then((existing) => {
      if (!existing) {
        var docPromise = this.insertLocal(id, data);
        return docPromise;
      } else {
        return existing.incrementalModify(() => {
          return data;
        });
      }
    });
  }
  async function getLocal(id) {
    var state = await getLocalDocStateByParent(this);
    var docCache = state.docCache;
    var found = docCache.getLatestDocumentDataIfExists(id);
    if (found) {
      return Promise.resolve(docCache.getCachedRxDocument(found));
    }
    return getSingleDocument(state.storageInstance, id).then((docData) => {
      if (!docData) {
        return null;
      }
      return state.docCache.getCachedRxDocument(docData);
    });
  }
  function getLocal$(id) {
    return this.$.pipe(startWith(null), mergeMap(async (cE) => {
      if (cE) {
        return {
          changeEvent: cE
        };
      } else {
        var doc = await this.getLocal(id);
        return {
          doc
        };
      }
    }), mergeMap(async (changeEventOrDoc) => {
      if (changeEventOrDoc.changeEvent) {
        var cE = changeEventOrDoc.changeEvent;
        if (!cE.isLocal || cE.documentId !== id) {
          return {
            use: false
          };
        } else {
          var doc = await this.getLocal(id);
          return {
            use: true,
            doc
          };
        }
      } else {
        return {
          use: true,
          doc: changeEventOrDoc.doc
        };
      }
    }), filter((filterFlagged) => filterFlagged.use), map((filterFlagged) => {
      return filterFlagged.doc;
    }));
  }
  var init_local_documents = __esm({
    "node_modules/rxdb/dist/esm/plugins/local-documents/local-documents.js"() {
      init_utils();
      init_esm5();
      init_local_documents_helper();
      init_rx_storage_helper();
    }
  });

  // node_modules/rxdb/dist/esm/plugins/local-documents/rx-local-document.js
  function createRxLocalDocument(data, parent) {
    _init();
    var newDoc = new RxLocalDocumentClass(data.id, data, parent);
    Object.setPrototypeOf(newDoc, RxLocalDocumentPrototype);
    newDoc.prototype = RxLocalDocumentPrototype;
    return newDoc;
  }
  function getRxDatabaseFromLocalDocument(doc) {
    var parent = doc.parent;
    if (isRxDatabase(parent)) {
      return parent;
    } else {
      return parent.database;
    }
  }
  function createLocalDocStateByParent(parent) {
    var database = parent.database ? parent.database : parent;
    var collectionName = parent.database ? parent.name : "";
    var statePromise = (async () => {
      var storageInstance = await createLocalDocumentStorageInstance(database.token, database.storage, database.name, collectionName, database.instanceCreationOptions, database.multiInstance);
      storageInstance = getWrappedStorageInstance(database, storageInstance, RX_LOCAL_DOCUMENT_SCHEMA);
      var docCache = new DocumentCache("id", database.eventBulks$.pipe(filter((changeEventBulk) => {
        var ret = false;
        if (
          // parent is database
          collectionName === "" && !changeEventBulk.collectionName || // parent is collection
          collectionName !== "" && changeEventBulk.collectionName === collectionName
        ) {
          ret = true;
        }
        return ret && changeEventBulk.isLocal;
      }), map((b) => b.events)), (docData) => createRxLocalDocument(docData, parent));
      var incrementalWriteQueue = new IncrementalWriteQueue(storageInstance, "id", () => {
      }, () => {
      });
      var databaseStorageToken = await database.storageToken;
      var subLocalDocs = storageInstance.changeStream().subscribe((eventBulk) => {
        var events = new Array(eventBulk.events.length);
        var rawEvents = eventBulk.events;
        var collectionName2 = parent.database ? parent.name : void 0;
        for (var index = 0; index < rawEvents.length; index++) {
          var event = rawEvents[index];
          events[index] = {
            documentId: event.documentId,
            collectionName: collectionName2,
            isLocal: true,
            operation: event.operation,
            documentData: overwritable.deepFreezeWhenDevMode(event.documentData),
            previousDocumentData: overwritable.deepFreezeWhenDevMode(event.previousDocumentData)
          };
        }
        var changeEventBulk = {
          id: eventBulk.id,
          isLocal: true,
          internal: false,
          collectionName: parent.database ? parent.name : void 0,
          storageToken: databaseStorageToken,
          events,
          databaseToken: database.token,
          checkpoint: eventBulk.checkpoint,
          context: eventBulk.context
        };
        database.$emit(changeEventBulk);
      });
      parent._subs.push(subLocalDocs);
      var state = {
        database,
        parent,
        storageInstance,
        docCache,
        incrementalWriteQueue
      };
      LOCAL_DOC_STATE_BY_PARENT_RESOLVED.set(parent, state);
      return state;
    })();
    LOCAL_DOC_STATE_BY_PARENT.set(parent, statePromise);
  }
  var RxDocumentParent, RxLocalDocumentClass, RxLocalDocumentPrototype, INIT_DONE, _init;
  var init_rx_local_document = __esm({
    "node_modules/rxdb/dist/esm/plugins/local-documents/rx-local-document.js"() {
      init_inheritsLoose();
      init_esm5();
      init_overwritable();
      init_rx_change_event();
      init_rx_document();
      init_rx_error();
      init_rx_storage_helper();
      init_utils();
      init_local_documents_helper();
      init_rx_database();
      init_doc_cache();
      init_incremental_write();
      RxDocumentParent = createRxDocumentConstructor();
      RxLocalDocumentClass = /* @__PURE__ */ (function(_RxDocumentParent) {
        function RxLocalDocumentClass2(id, jsonData, parent) {
          var _this2;
          _this2 = _RxDocumentParent.call(this, null, jsonData) || this;
          _this2.id = id;
          _this2.parent = parent;
          return _this2;
        }
        _inheritsLoose(RxLocalDocumentClass2, _RxDocumentParent);
        return RxLocalDocumentClass2;
      })(RxDocumentParent);
      RxLocalDocumentPrototype = {
        get isLocal() {
          return true;
        },
        //
        // overwrites
        //
        get allAttachments$() {
          throw newRxError("LD1", {
            document: this
          });
        },
        get primaryPath() {
          return "id";
        },
        get primary() {
          return this.id;
        },
        get $() {
          var _this = this;
          var state = getFromMapOrThrow(LOCAL_DOC_STATE_BY_PARENT_RESOLVED, this.parent);
          var id = this.primary;
          return _this.parent.eventBulks$.pipe(filter((bulk) => !!bulk.isLocal), map((bulk) => bulk.events.find((ev) => ev.documentId === id)), filter((event) => !!event), map((changeEvent) => getDocumentDataOfRxChangeEvent(ensureNotFalsy(changeEvent))), startWith(state.docCache.getLatestDocumentData(this.primary)), distinctUntilChanged((prev, curr) => prev._rev === curr._rev), map((docData) => state.docCache.getCachedRxDocument(docData)), shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
          ;
        },
        get $$() {
          var _this = this;
          var db = getRxDatabaseFromLocalDocument(_this);
          var reactivity = db.getReactivityFactory();
          return reactivity.fromObservable(_this.$, _this.getLatest()._data, db);
        },
        get deleted$$() {
          var _this = this;
          var db = getRxDatabaseFromLocalDocument(_this);
          var reactivity = db.getReactivityFactory();
          return reactivity.fromObservable(_this.deleted$, _this.getLatest().deleted, db);
        },
        getLatest() {
          var state = getFromMapOrThrow(LOCAL_DOC_STATE_BY_PARENT_RESOLVED, this.parent);
          var latestDocData = state.docCache.getLatestDocumentData(this.primary);
          return state.docCache.getCachedRxDocument(latestDocData);
        },
        get(objPath) {
          objPath = "data." + objPath;
          if (!this._data) {
            return void 0;
          }
          if (typeof objPath !== "string") {
            throw newRxTypeError("LD2", {
              objPath
            });
          }
          var valueObj = getProperty(this._data, objPath);
          valueObj = overwritable.deepFreezeWhenDevMode(valueObj);
          return valueObj;
        },
        get$(objPath) {
          objPath = "data." + objPath;
          if (overwritable.isDevMode()) {
            if (objPath.includes(".item.")) {
              throw newRxError("LD3", {
                objPath
              });
            }
            if (objPath === this.primaryPath) {
              throw newRxError("LD4");
            }
          }
          return this.$.pipe(map((localDocument) => localDocument._data), map((data) => getProperty(data, objPath)), distinctUntilChanged());
        },
        get$$(objPath) {
          var db = getRxDatabaseFromLocalDocument(this);
          var reactivity = db.getReactivityFactory();
          return reactivity.fromObservable(this.get$(objPath), this.getLatest().get(objPath), db);
        },
        async incrementalModify(mutationFunction) {
          var state = await getLocalDocStateByParent(this.parent);
          return state.incrementalWriteQueue.addWrite(this._data, async (docData) => {
            docData.data = await mutationFunction(docData.data, this);
            return docData;
          }).then((result) => state.docCache.getCachedRxDocument(result));
        },
        incrementalPatch(patch) {
          return this.incrementalModify((docData) => {
            Object.entries(patch).forEach(([k, v]) => {
              docData[k] = v;
            });
            return docData;
          });
        },
        async _saveData(newData) {
          var state = await getLocalDocStateByParent(this.parent);
          var oldData = this._data;
          newData.id = this.id;
          var writeRows = [{
            previous: oldData,
            document: newData
          }];
          return state.storageInstance.bulkWrite(writeRows, "local-document-save-data").then((res) => {
            if (res.error[0]) {
              throw res.error[0];
            }
            var success = getWrittenDocumentsFromBulkWriteResponse(this.collection.schema.primaryPath, writeRows, res)[0];
            newData = flatClone(newData);
            newData._rev = success._rev;
          });
        },
        async remove() {
          var state = await getLocalDocStateByParent(this.parent);
          var writeData = flatClone(this._data);
          writeData._deleted = true;
          return writeSingle(state.storageInstance, {
            previous: this._data,
            document: writeData
          }, "local-document-remove").then((writeResult) => state.docCache.getCachedRxDocument(writeResult));
        }
      };
      INIT_DONE = false;
      _init = () => {
        if (INIT_DONE) return;
        else INIT_DONE = true;
        var docBaseProto = basePrototype;
        var props = Object.getOwnPropertyNames(docBaseProto);
        props.forEach((key) => {
          var exists = Object.getOwnPropertyDescriptor(RxLocalDocumentPrototype, key);
          if (exists) return;
          var desc = Object.getOwnPropertyDescriptor(docBaseProto, key);
          Object.defineProperty(RxLocalDocumentPrototype, key, desc);
        });
        var getThrowingFun = (k) => () => {
          throw newRxError("LD6", {
            functionName: k
          });
        };
        ["populate", "update", "putAttachment", "putAttachmentBase64", "getAttachment", "allAttachments"].forEach((k) => RxLocalDocumentPrototype[k] = getThrowingFun(k));
      };
    }
  });

  // node_modules/rxdb/dist/esm/plugins/local-documents/index.js
  var RxDBLocalDocumentsPlugin;
  var init_local_documents2 = __esm({
    "node_modules/rxdb/dist/esm/plugins/local-documents/index.js"() {
      init_local_documents();
      init_local_documents_helper();
      init_rx_local_document();
      init_local_documents_helper();
      init_local_documents();
      init_rx_local_document();
      RxDBLocalDocumentsPlugin = {
        name: "local-documents",
        rxdb: true,
        prototypes: {
          RxCollection: (proto) => {
            proto.insertLocal = insertLocal;
            proto.upsertLocal = upsertLocal;
            proto.getLocal = getLocal;
            proto.getLocal$ = getLocal$;
          },
          RxDatabase: (proto) => {
            proto.insertLocal = insertLocal;
            proto.upsertLocal = upsertLocal;
            proto.getLocal = getLocal;
            proto.getLocal$ = getLocal$;
          }
        },
        hooks: {
          createRxDatabase: {
            before: (args) => {
              if (args.creator.localDocuments) {
                createLocalDocStateByParent(args.database);
              }
            }
          },
          createRxCollection: {
            before: (args) => {
              if (args.creator.localDocuments) {
                createLocalDocStateByParent(args.collection);
              }
            }
          },
          preCloseRxDatabase: {
            after: (db) => {
              return closeStateByParent(db);
            }
          },
          postCloseRxCollection: {
            after: (collection) => closeStateByParent(collection)
          },
          postRemoveRxDatabase: {
            after: (args) => {
              return removeLocalDocumentsStorageInstance(args.storage, args.databaseName, "");
            }
          },
          postRemoveRxCollection: {
            after: (args) => {
              return removeLocalDocumentsStorageInstance(args.storage, args.databaseName, args.collectionName);
            }
          }
        },
        overwritable: {}
      };
    }
  });

  // node_modules/rxdb/dist/esm/plugins/migration-schema/migration-types.js
  var init_migration_types = __esm({
    "node_modules/rxdb/dist/esm/plugins/migration-schema/migration-types.js"() {
    }
  });

  // node_modules/rxdb/dist/esm/plugins/migration-schema/index.js
  var DATA_MIGRATOR_BY_COLLECTION, RxDBMigrationPlugin, RxDBMigrationSchemaPlugin;
  var init_migration_schema = __esm({
    "node_modules/rxdb/dist/esm/plugins/migration-schema/index.js"() {
      init_esm5();
      init_utils();
      init_rx_migration_state();
      init_migration_helpers();
      init_plugin();
      init_local_documents2();
      init_rx_migration_state();
      init_migration_helpers();
      init_migration_types();
      DATA_MIGRATOR_BY_COLLECTION = /* @__PURE__ */ new WeakMap();
      RxDBMigrationPlugin = {
        name: "migration-schema",
        rxdb: true,
        init() {
          addRxPlugin(RxDBLocalDocumentsPlugin);
        },
        hooks: {
          preCloseRxDatabase: {
            after: onDatabaseClose
          }
        },
        prototypes: {
          RxDatabase: (proto) => {
            proto.migrationStates = function() {
              return getMigrationStateByDatabase(this).pipe(shareReplay(RXJS_SHARE_REPLAY_DEFAULTS));
            };
          },
          RxCollection: (proto) => {
            proto.getMigrationState = function() {
              return getFromMapOrCreate(DATA_MIGRATOR_BY_COLLECTION, this, () => new RxMigrationState(this.asRxCollection, this.migrationStrategies));
            };
            proto.migrationNeeded = function() {
              if (this.schema.version === 0) {
                return PROMISE_RESOLVE_FALSE;
              }
              return mustMigrate(this.getMigrationState());
            };
          }
        }
      };
      RxDBMigrationSchemaPlugin = RxDBMigrationPlugin;
    }
  });

  // engine/database.js
  var database_exports = {};
  __export(database_exports, {
    closeDatabase: () => closeDatabase,
    getDatabase: () => getDatabase,
    getDatabaseStats: () => getDatabaseStats,
    getGemsCollection: () => getGemsCollection,
    initDatabase: () => initDatabase,
    migrateSchema: () => migrateSchema
  });
  async function initDatabase() {
    if (dbInstance) {
      console.log("[Database] Using existing database instance");
      return dbInstance;
    }
    if (initPromise) {
      console.log("[Database] Initialization already in progress, waiting...");
      return initPromise;
    }
    console.log("[Database] Initializing RxDB with IndexedDB backend...");
    initPromise = (async () => {
      try {
        const db = await createRxDatabase({
          name: "rxdb-datagems-context",
          storage: getRxStorageDexie(),
          multiInstance: true,
          // Allow multiple instances (Popup reopens each time)
          eventReduce: true
          // Share events between instances
        });
        console.log("[Database] RxDB created successfully");
        await db.addCollections({
          gems: {
            schema: gemSchema,
            migrationStrategies: {
              // Migration from v0 to v1: Add new required fields with defaults
              1: function(oldDoc) {
                console.log("[Database] Migrating gem from v0 to v1:", oldDoc.id);
                return {
                  ...oldDoc,
                  // Set defaults for new required fields
                  isPrimary: oldDoc.isPrimary !== void 0 ? oldDoc.isPrimary : false,
                  parentGem: oldDoc.parentGem || "",
                  // Set defaults for new optional fields
                  topic: oldDoc.topic || "",
                  subTopic: oldDoc.subTopic || "",
                  childGems: oldDoc.childGems || [],
                  isVirtual: oldDoc.isVirtual !== void 0 ? oldDoc.isVirtual : false
                };
              },
              // Migration from v1 to v2: Add HSP protocol fields
              2: function(oldDoc) {
                console.log("[Database] Migrating gem from v1 to v2 (adding HSP fields):", oldDoc.id);
                const now3 = (/* @__PURE__ */ new Date()).toISOString();
                return {
                  ...oldDoc,
                  // HSP required fields with defaults
                  state: oldDoc.state || "default",
                  assurance: oldDoc.assurance || "self_declared",
                  reliability: oldDoc.reliability || "authoritative",
                  created_at: oldDoc.created_at || oldDoc.timestamp ? new Date(oldDoc.timestamp).toISOString() : now3,
                  updated_at: oldDoc.updated_at || now3,
                  // Optional HSP fields
                  source_url: oldDoc.source_url || void 0,
                  mergedFrom: oldDoc.mergedFrom || void 0
                };
              },
              // Migration from v2 to v3: Update vector dimensions (384 -> 768) and remove invalid vectors
              3: function(oldDoc) {
                console.log("[Database] Migrating gem from v2 to v3 (768-dim vectors):", oldDoc.id);
                const newDoc = { ...oldDoc };
                if (oldDoc.vector) {
                  if (oldDoc.vector.length === 384) {
                    console.log(`  \u2192 Removing 384-dim vector for ${oldDoc.id} (needs re-enrichment)`);
                    delete newDoc.vector;
                  } else if (oldDoc.vector.length === 768) {
                    console.log(`  \u2192 Keeping existing 768-dim vector for ${oldDoc.id}`);
                  } else {
                    console.warn(`  \u2192 Invalid vector dimension ${oldDoc.vector.length} for ${oldDoc.id}, removing`);
                    delete newDoc.vector;
                  }
                }
                return newDoc;
              }
            }
            // Note: Vector search plugin will be added separately
            // to avoid circular dependency issues
          }
        });
        console.log("[Database] Gems collection created");
        console.log("[Database] Schema version:", gemSchema.version);
        dbInstance = db;
        console.log("[Database] Database ready:", {
          name: db.name,
          collections: Object.keys(db.collections),
          storage: "Dexie (IndexedDB)"
        });
        return db;
      } catch (error) {
        console.error("[Database] Failed to initialize:", error);
        initPromise = null;
        throw error;
      } finally {
        initPromise = null;
      }
    })();
    return initPromise;
  }
  function getDatabase() {
    return dbInstance;
  }
  async function closeDatabase() {
    if (dbInstance) {
      console.log("[Database] Closing database...");
      await dbInstance.destroy();
      dbInstance = null;
      initPromise = null;
      console.log("[Database] Database closed and reset");
    }
  }
  function getGemsCollection() {
    if (!dbInstance) {
      console.warn("[Database] Database not initialized");
      return null;
    }
    return dbInstance.gems;
  }
  async function getDatabaseStats() {
    const collection = getGemsCollection();
    if (!collection) {
      return null;
    }
    const allGems = await collection.find().exec();
    const count = allGems.length;
    const withVectors = allGems.filter((gem) => gem.vector && gem.vector.length > 0).length;
    const withSemantics = allGems.filter((gem) => gem.semanticType).length;
    return {
      totalGems: count,
      gemsWithVectors: withVectors,
      gemsWithSemantics: withSemantics,
      enrichmentRate: count > 0 ? (withSemantics / count * 100).toFixed(1) : 0
    };
  }
  async function migrateSchema(toVersion) {
    console.log(`[Database] Migration to v${toVersion} requested`);
  }
  var gemSchema, dbInstance, initPromise;
  var init_database = __esm({
    "engine/database.js"() {
      init_esm2();
      init_storage_dexie();
      init_query_builder();
      init_update2();
      init_migration_schema();
      addRxPlugin(RxDBQueryBuilderPlugin);
      addRxPlugin(RxDBUpdatePlugin);
      addRxPlugin(RxDBMigrationSchemaPlugin);
      gemSchema = {
        version: 3,
        // UPDATED: v2 -> v3 for 768-dim vector support (BGE-base-en-v1.5)
        primaryKey: "id",
        type: "object",
        properties: {
          // CORE FIELDS
          id: {
            type: "string",
            maxLength: 100
          },
          value: {
            type: "string",
            maxLength: 1e4
          },
          collections: {
            type: "array",
            items: {
              type: "string"
            }
          },
          subCollections: {
            type: "array",
            items: {
              type: "string"
            }
          },
          timestamp: {
            type: "number",
            minimum: 0,
            multipleOf: 1
            // Required for indexed number fields
          },
          // HSP PROTOCOL FIELDS
          state: {
            type: "string",
            enum: ["default", "favorited", "hidden"],
            default: "default"
          },
          assurance: {
            type: "string",
            enum: ["self_declared", "third_party", "derived"],
            default: "self_declared"
          },
          reliability: {
            type: "string",
            enum: ["authoritative", "high", "medium", "low"],
            default: "authoritative"
          },
          source_url: {
            type: "string",
            maxLength: 2e3
          },
          mergedFrom: {
            type: "array",
            items: {
              type: "object"
            }
          },
          created_at: {
            type: "string",
            format: "date-time"
          },
          updated_at: {
            type: "string",
            format: "date-time"
          },
          // Topic/Sub-Topic Hierarchy
          topic: {
            type: "string",
            maxLength: 500
          },
          subTopic: {
            type: "string",
            maxLength: 500
          },
          // Semantic Metadata (AI Enrichment)
          semanticType: {
            type: "string",
            enum: ["constraint", "preference", "activity", "characteristic", "goal"]
          },
          attribute: {
            type: "string",
            maxLength: 200
          },
          attributeValue: {
            type: "string",
            maxLength: 500
          },
          attributeUnit: {
            type: "string",
            maxLength: 50
          },
          // Vector Embeddings (768-dim from BGE-base-en-v1.5)
          vector: {
            type: "array",
            items: {
              type: "number"
            },
            minItems: 768,
            maxItems: 768
          },
          // Keywords for BM25 sparse search
          keywords: {
            type: "object",
            additionalProperties: {
              type: "number"
              // word: frequency
            }
          },
          // Quality Metadata
          enrichmentVersion: {
            type: "string",
            maxLength: 20
          },
          enrichmentTimestamp: {
            type: "number",
            minimum: 0,
            multipleOf: 1
            // Required for indexed number fields
          },
          userVerified: {
            type: "boolean"
          },
          // Primary/Child Gem Relationship
          isPrimary: {
            type: "boolean"
          },
          parentGem: {
            type: "string",
            maxLength: 100
          },
          childGems: {
            type: "array",
            items: {
              type: "string"
            }
          },
          isVirtual: {
            type: "boolean"
          }
        },
        required: [
          "id",
          "value",
          "timestamp",
          "collections",
          "subCollections",
          "state",
          "assurance",
          "reliability",
          "created_at",
          "updated_at",
          "isPrimary",
          "parentGem"
        ],
        indexes: [
          "timestamp",
          "state",
          // NEW: Index for filtering by state
          ["collections"],
          // Multi-entry index for array
          ["subCollections"],
          "isPrimary",
          // Index for filtering primary vs child gems
          "parentGem",
          // Index for finding children of a parent
          "created_at"
          // NEW: Index for sorting by creation date
        ]
      };
      dbInstance = null;
      initPromise = null;
    }
  });

  // engine/context-engine.js
  init_database();

  // engine/vector-store.js
  init_database();

  // engine/hnsw-index.js
  function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return -1;
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) {
      return -1;
    }
    return dotProduct / magnitude;
  }
  function distance(vecA, vecB) {
    return 1 - cosineSimilarity(vecA, vecB);
  }
  var MaxHeap = class {
    constructor() {
      this.heap = [];
    }
    push(distance2, id) {
      this.heap.push({ distance: distance2, id });
      this._bubbleUp(this.heap.length - 1);
    }
    pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();
      const top = this.heap[0];
      this.heap[0] = this.heap.pop();
      this._bubbleDown(0);
      return top;
    }
    peek() {
      return this.heap[0] || null;
    }
    size() {
      return this.heap.length;
    }
    toArray() {
      return [...this.heap].sort((a, b) => a.distance - b.distance);
    }
    _bubbleUp(index) {
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].distance <= this.heap[parentIndex].distance) break;
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      }
    }
    _bubbleDown(index) {
      while (true) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let largest = index;
        if (leftChild < this.heap.length && this.heap[leftChild].distance > this.heap[largest].distance) {
          largest = leftChild;
        }
        if (rightChild < this.heap.length && this.heap[rightChild].distance > this.heap[largest].distance) {
          largest = rightChild;
        }
        if (largest === index) break;
        [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
        index = largest;
      }
    }
  };
  var HNSWIndex = class _HNSWIndex {
    constructor(options = {}) {
      this.M = options.M || 16;
      this.efConstruction = options.efConstruction || 200;
      this.efSearch = options.efSearch || 50;
      this.ml = 1 / Math.log(2);
      this.vectors = /* @__PURE__ */ new Map();
      this.layers = /* @__PURE__ */ new Map();
      this.graph = /* @__PURE__ */ new Map();
      this.entryPoint = null;
      this.dimension = null;
      this.size = 0;
      console.log("[HNSW] Index created with params:", {
        M: this.M,
        efConstruction: this.efConstruction,
        efSearch: this.efSearch
      });
    }
    /**
     * Get random layer using exponential distribution
     * @returns {number}
     */
    _getRandomLayer() {
      return Math.floor(-Math.log(Math.random()) * this.ml);
    }
    /**
     * Add a vector to the index
     * @param {string} id - Unique identifier
     * @param {number[]} vector - Embedding vector
     */
    add(id, vector) {
      if (!vector || !Array.isArray(vector)) {
        throw new Error("[HNSW] Vector must be a non-empty array");
      }
      if (this.dimension === null) {
        this.dimension = vector.length;
        console.log("[HNSW] Dimension auto-detected:", this.dimension);
      } else if (vector.length !== this.dimension) {
        throw new Error(`[HNSW] Vector dimension mismatch: expected ${this.dimension}, got ${vector.length}`);
      }
      this.vectors.set(id, vector);
      if (this.size === 0) {
        const layer2 = this._getRandomLayer();
        this.layers.set(id, layer2);
        this.entryPoint = id;
        this.graph.set(id, /* @__PURE__ */ new Map());
        for (let lc = 0; lc <= layer2; lc++) {
          this.graph.get(id).set(lc, /* @__PURE__ */ new Set());
        }
        this.size++;
        console.log("[HNSW] First node added as entry point:", id, "layer:", layer2);
        return;
      }
      const layer = this._getRandomLayer();
      this.layers.set(id, layer);
      this.graph.set(id, /* @__PURE__ */ new Map());
      for (let lc = 0; lc <= layer; lc++) {
        this.graph.get(id).set(lc, /* @__PURE__ */ new Set());
      }
      let currentNearest = this.entryPoint;
      const entryPointLayer = this.layers.get(this.entryPoint);
      for (let lc = entryPointLayer; lc > layer; lc--) {
        currentNearest = this._searchLayer(vector, [currentNearest], 1, lc)[0].id;
      }
      for (let lc = layer; lc >= 0; lc--) {
        const candidates = this._searchLayer(vector, [currentNearest], this.efConstruction, lc);
        const M = lc === 0 ? this.M * 2 : this.M;
        const neighbors = this._selectNeighbors(candidates, M);
        for (const neighbor of neighbors) {
          this.graph.get(id).get(lc).add(neighbor.id);
          const neighborLayers = this.graph.get(neighbor.id);
          if (neighborLayers && neighborLayers.has(lc)) {
            neighborLayers.get(lc).add(id);
            const neighborConnections = neighborLayers.get(lc);
            if (neighborConnections.size > M) {
              this._pruneConnections(neighbor.id, lc, M);
            }
          }
        }
        currentNearest = neighbors[0].id;
      }
      if (layer > entryPointLayer) {
        this.entryPoint = id;
      }
      this.size++;
    }
    /**
     * Search layer for nearest neighbors
     * @param {number[]} queryVector
     * @param {string[]} entryPoints - Array of node IDs to start search
     * @param {number} ef - Size of dynamic candidate list
     * @param {number} layer
     * @returns {Array<{distance, id}>}
     */
    _searchLayer(queryVector, entryPoints, ef, layer) {
      const visited = /* @__PURE__ */ new Set();
      const candidates = new MaxHeap();
      const nearest = new MaxHeap();
      for (const id of entryPoints) {
        const dist = distance(queryVector, this.vectors.get(id));
        candidates.push(dist, id);
        nearest.push(dist, id);
        visited.add(id);
      }
      while (candidates.size() > 0) {
        const current = candidates.pop();
        const farthest = nearest.peek();
        if (current.distance > farthest.distance && nearest.size() >= ef) {
          break;
        }
        const neighbors = this.graph.get(current.id).get(layer) || /* @__PURE__ */ new Set();
        for (const neighborId of neighbors) {
          if (visited.has(neighborId)) continue;
          visited.add(neighborId);
          const dist = distance(queryVector, this.vectors.get(neighborId));
          const farthest2 = nearest.peek();
          if (dist < farthest2.distance || nearest.size() < ef) {
            candidates.push(dist, neighborId);
            nearest.push(dist, neighborId);
            if (nearest.size() > ef) {
              nearest.pop();
            }
          }
        }
      }
      return nearest.toArray();
    }
    /**
     * Select M neighbors using heuristic (prefer diverse neighbors)
     * @param {Array<{distance, id}>} candidates
     * @param {number} M
     * @returns {Array<{distance, id}>}
     */
    _selectNeighbors(candidates, M) {
      if (candidates.length <= M) {
        return candidates;
      }
      return candidates.slice(0, M);
    }
    /**
     * Prune connections for a node to keep only M best
     * @param {string} id
     * @param {number} layer
     * @param {number} M
     */
    _pruneConnections(id, layer, M) {
      const connections = this.graph.get(id).get(layer);
      if (connections.size <= M) return;
      const vector = this.vectors.get(id);
      const neighbors = Array.from(connections).map((neighborId) => ({
        id: neighborId,
        distance: distance(vector, this.vectors.get(neighborId))
      }));
      neighbors.sort((a, b) => a.distance - b.distance);
      const toKeep = new Set(neighbors.slice(0, M).map((n) => n.id));
      const toRemove = Array.from(connections).filter((nId) => !toKeep.has(nId));
      for (const neighborId of toRemove) {
        connections.delete(neighborId);
        const neighborLayers = this.graph.get(neighborId);
        if (neighborLayers && neighborLayers.has(layer)) {
          neighborLayers.get(layer).delete(id);
        }
      }
    }
    /**
     * Search for K nearest neighbors
     * @param {number[]} queryVector
     * @param {number} k - Number of neighbors to return
     * @param {number} ef - Search quality (higher = better accuracy, slower)
     * @returns {Array<{id, distance, similarity}>}
     */
    search(queryVector, k = 10, ef = null) {
      if (this.size === 0) {
        return [];
      }
      if (queryVector.length !== this.dimension) {
        throw new Error(`[HNSW] Query vector dimension mismatch: expected ${this.dimension}, got ${queryVector.length}`);
      }
      const searchEf = ef || Math.max(this.efSearch, k);
      let currentNearest = this.entryPoint;
      const entryPointLayer = this.layers.get(this.entryPoint);
      for (let lc = entryPointLayer; lc > 0; lc--) {
        currentNearest = this._searchLayer(queryVector, [currentNearest], 1, lc)[0].id;
      }
      const candidates = this._searchLayer(queryVector, [currentNearest], searchEf, 0);
      return candidates.slice(0, k).map((item) => ({
        id: item.id,
        distance: item.distance,
        similarity: 1 - item.distance
        // Convert distance back to similarity
      }));
    }
    /**
     * Remove a vector from the index
     * @param {string} id
     */
    remove(id) {
      if (!this.vectors.has(id)) {
        return;
      }
      const layer = this.layers.get(id);
      for (let lc = 0; lc <= layer; lc++) {
        const neighbors = this.graph.get(id).get(lc);
        for (const neighborId of neighbors) {
          this.graph.get(neighborId).get(lc).delete(id);
        }
      }
      this.vectors.delete(id);
      this.layers.delete(id);
      this.graph.delete(id);
      this.size--;
      if (this.entryPoint === id && this.size > 0) {
        let maxLayer = -1;
        let newEntryPoint = null;
        for (const [nodeId, nodeLayer] of this.layers) {
          if (nodeLayer > maxLayer) {
            maxLayer = nodeLayer;
            newEntryPoint = nodeId;
          }
        }
        this.entryPoint = newEntryPoint;
      }
    }
    /**
     * Serialize index to JSON
     * @returns {Object}
     */
    toJSON() {
      return {
        M: this.M,
        efConstruction: this.efConstruction,
        efSearch: this.efSearch,
        dimension: this.dimension,
        size: this.size,
        entryPoint: this.entryPoint,
        vectors: Array.from(this.vectors.entries()),
        layers: Array.from(this.layers.entries()),
        graph: Array.from(this.graph.entries()).map(([id, layerMap]) => [
          id,
          Array.from(layerMap.entries()).map(([layer, neighbors]) => [
            layer,
            Array.from(neighbors)
          ])
        ])
      };
    }
    /**
     * Deserialize index from JSON
     * @param {Object} data
     * @returns {HNSWIndex}
     */
    static fromJSON(data) {
      const index = new _HNSWIndex({
        M: data.M,
        efConstruction: data.efConstruction,
        efSearch: data.efSearch
      });
      index.dimension = data.dimension;
      index.size = data.size;
      index.entryPoint = data.entryPoint;
      index.vectors = new Map(data.vectors);
      index.layers = new Map(data.layers);
      for (const [id, layerArray] of data.graph) {
        const layerMap = /* @__PURE__ */ new Map();
        for (const [layer, neighbors] of layerArray) {
          layerMap.set(layer, new Set(neighbors));
        }
        index.graph.set(id, layerMap);
      }
      console.log("[HNSW] Index loaded from JSON:", {
        dimension: index.dimension,
        size: index.size,
        M: index.M
      });
      return index;
    }
    /**
     * Get index statistics
     * @returns {Object}
     */
    getStats() {
      const layerDistribution = /* @__PURE__ */ new Map();
      for (const layer of this.layers.values()) {
        layerDistribution.set(layer, (layerDistribution.get(layer) || 0) + 1);
      }
      return {
        size: this.size,
        dimension: this.dimension,
        M: this.M,
        efConstruction: this.efConstruction,
        efSearch: this.efSearch,
        entryPoint: this.entryPoint,
        entryPointLayer: this.entryPoint ? this.layers.get(this.entryPoint) : null,
        layerDistribution: Object.fromEntries(layerDistribution)
      };
    }
  };

  // engine/vector-store.js
  function cosineSimilarity2(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
      return 0;
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    if (magnitude === 0) {
      return 0;
    }
    return (dotProduct / magnitude + 1) / 2;
  }
  var VectorStore = class {
    constructor() {
      this.collection = null;
      this.hnswIndex = null;
      this.indexReady = false;
      this.useANN = true;
    }
    /**
     * Initialize vector store
     */
    async init() {
      this.collection = getGemsCollection();
      if (!this.collection) {
        throw new Error("[VectorStore] Database not initialized");
      }
      await this._initHNSW();
      return this;
    }
    /**
     * Initialize or load HNSW index
     */
    async _initHNSW() {
      try {
        const storage = await chrome.storage.local.get(["hnsw_index"]);
        const serialized = storage.hnsw_index;
        if (serialized) {
          const data = JSON.parse(serialized);
          this.hnswIndex = HNSWIndex.fromJSON(data);
          this.indexReady = true;
        } else {
          await this._buildHNSW();
        }
      } catch (error) {
        console.error("[VectorStore] Failed to load HNSW index, rebuilding:", error);
        await this._buildHNSW();
      }
    }
    /**
     * Build HNSW index from all gems with vectors
     */
    async _buildHNSW() {
      this.hnswIndex = new HNSWIndex({
        M: 16,
        // Connections per node (balance between accuracy and memory)
        efConstruction: 200,
        // Construction quality (higher = better but slower build)
        efSearch: 50
        // Search quality (can be adjusted per query)
      });
      const docs = await this.collection.find({
        selector: {
          vector: { $exists: true }
        }
      }).exec();
      let added = 0;
      for (const doc of docs) {
        const gem = doc.toJSON();
        if (gem.vector && Array.isArray(gem.vector) && gem.vector.length > 0) {
          try {
            this.hnswIndex.add(gem.id, gem.vector);
            added++;
            if (added % 100 === 0) {
            }
          } catch (error) {
            console.warn(`[VectorStore] Failed to add gem ${gem.id} to HNSW:`, error.message);
          }
        }
      }
      this.indexReady = true;
      await this._saveHNSW();
    }
    /**
     * Save HNSW index to chrome.storage.local
     */
    async _saveHNSW() {
      try {
        const serialized = JSON.stringify(this.hnswIndex.toJSON());
        await chrome.storage.local.set({ hnsw_index: serialized });
        const sizeKB = Math.round(serialized.length / 1024);
      } catch (error) {
        console.error("[VectorStore] Failed to save HNSW index:", error);
        if (error.message && error.message.includes("QUOTA_BYTES")) {
          console.warn("[VectorStore] chrome.storage.local quota exceeded, index will rebuild on next init");
        }
      }
    }
    /**
     * Insert a gem (vector field is optional)
     * @param {Object} gem - Gem object (vector field optional)
     */
    async insert(gem) {
      if (gem.vector) {
        const validDimensions = [384, 768];
        if (!validDimensions.includes(gem.vector.length)) {
          console.warn(`[VectorStore] Gem ${gem.id} has invalid vector (length: ${gem.vector.length}), removing it`);
          delete gem.vector;
        }
      }
      if (!gem.vector) {
      }
      try {
        await this.collection.insert(gem);
        if (gem.vector && this.indexReady) {
          try {
            this.hnswIndex.add(gem.id, gem.vector);
            if (this.hnswIndex.size % 10 === 0) {
              await this._saveHNSW();
            }
          } catch (error) {
            console.warn(`[VectorStore] Failed to add gem to HNSW: ${gem.id}`, error.message);
          }
        }
      } catch (error) {
        if (error.code === "CONFLICT") {
          console.warn(`[VectorStore] Gem ${gem.id} already exists, updating...`);
          await this.update(gem.id, gem);
        } else {
          throw error;
        }
      }
    }
    /**
     * Update a gem
     * @param {string} id - Gem ID
     * @param {Object} updates - Fields to update
     */
    async update(id, updates) {
      const doc = await this.collection.findOne(id).exec();
      if (!doc) {
        throw new Error(`[VectorStore] Gem ${id} not found`);
      }
      const hasChanged = this._hasGemChanged(doc, updates);
      if (!hasChanged) {
        return;
      }
      await doc.update({
        $set: updates
      });
      if (updates.vector && this.indexReady) {
        try {
          if (this.hnswIndex.vectors.has(id)) {
            this.hnswIndex.vectors.delete(id);
            this.hnswIndex.layers.delete(id);
            this.hnswIndex.graph.delete(id);
          }
          this.hnswIndex.add(id, updates.vector);
          await this._saveHNSW();
        } catch (error) {
          console.warn(`[VectorStore] Failed to update HNSW index for ${id}:`, error.message);
        }
      }
    }
    /**
     * Check if gem data has changed
     * @param {Object} existingDoc - Existing RxDB document
     * @param {Object} updates - New data
     * @returns {boolean} True if data has changed
     */
    _hasGemChanged(existingDoc, updates) {
      const fieldsToCompare = ["value", "collections", "state", "topic", "isPrimary", "parentGem", "vector"];
      for (const field of fieldsToCompare) {
        const existingValue = existingDoc[field];
        const newValue = updates[field];
        if (!(field in updates)) continue;
        if (Array.isArray(existingValue) && Array.isArray(newValue)) {
          if (field === "vector") {
            if (!existingValue || existingValue.length === 0) {
              if (newValue && newValue.length > 0) return true;
            } else if (!newValue || newValue.length === 0) {
              return true;
            } else if (existingValue.length !== newValue.length) {
              return true;
            } else {
              for (let i = 0; i < existingValue.length; i++) {
                if (Math.abs(existingValue[i] - newValue[i]) > 1e-4) {
                  return true;
                }
              }
            }
            continue;
          }
          if (existingValue.length !== newValue.length) return true;
          const sortedExisting = [...existingValue].sort();
          const sortedNew = [...newValue].sort();
          if (JSON.stringify(sortedExisting) !== JSON.stringify(sortedNew)) return true;
          continue;
        }
        if (existingValue !== newValue) {
          return true;
        }
      }
      return false;
    }
    /**
     * Delete a gem
     * @param {string} id - Gem ID
     */
    async delete(id) {
      const doc = await this.collection.findOne(id).exec();
      if (!doc) {
        console.warn(`[VectorStore] Gem ${id} not found for deletion`);
        return;
      }
      await doc.remove();
      if (this.indexReady) {
        try {
          if (this.hnswIndex.vectors.has(id)) {
            this.hnswIndex.vectors.delete(id);
            this.hnswIndex.layers.delete(id);
            this.hnswIndex.graph.delete(id);
            if (this.hnswIndex.entryPoint === id) {
              this.hnswIndex.entryPoint = null;
            }
          }
          await this._saveHNSW();
        } catch (error) {
          console.warn(`[VectorStore] Failed to remove from HNSW index: ${id}`, error.message);
        }
      }
    }
    /**
     * Bulk insert gems
     * @param {Array<Object>} gems - Array of gem objects
     */
    async bulkInsert(gems) {
      const results = await this.collection.bulkInsert(gems);
      return results;
    }
    /**
     * Dense vector search with HNSW ANN (fast approximate search)
     * Falls back to brute-force if HNSW unavailable or filters require it
     * @param {number[]} queryVector - Query embedding
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Max results
     * @returns {Promise<Array>} Sorted search results
     */
    async denseSearch(queryVector, filters = {}, limit = 20) {
      const startTime = performance.now();
      const hasFilters = filters.collections?.length > 0 || filters.dateRange;
      const useHNSW = this.useANN && this.indexReady && !hasFilters;
      if (useHNSW) {
        return await this._denseSearchHNSW(queryVector, filters, limit, startTime);
      } else {
        return await this._denseSearchBruteForce(queryVector, filters, limit, startTime);
      }
    }
    /**
     * Fast HNSW-based search (no filters)
     */
    async _denseSearchHNSW(queryVector, filters, limit, startTime) {
      const searchK = Math.max(limit * 3, 100);
      const hnswResults = this.hnswIndex.search(queryVector, searchK);
      const gemPromises = hnswResults.map(async (result) => {
        const doc = await this.collection.findOne(result.id).exec();
        if (!doc) return null;
        const gem = doc.toJSON();
        return {
          id: gem.id,
          score: result.similarity,
          gem,
          isPrimary: gem.isPrimary || false,
          isVirtual: gem.isVirtual || false,
          parentGem: gem.parentGem || null,
          source: "dense-hnsw"
        };
      });
      const results = (await Promise.all(gemPromises)).filter((r) => r !== null);
      const MIN_SIMILARITY_THRESHOLD = 0.5;
      const filteredResults = results.filter((r) => r.score >= MIN_SIMILARITY_THRESHOLD);
      if (filteredResults.length === 0 && results.length > 0) {
        console.warn("[VectorStore] All HNSW results below similarity threshold:", {
          totalResults: results.length,
          threshold: MIN_SIMILARITY_THRESHOLD,
          topScore: results[0]?.score.toFixed(3)
        });
      }
      filteredResults.slice(0, 5).forEach((r, i) => {
        const type5 = r.isPrimary ? "PRIMARY" : r.isVirtual ? "CHILD" : "SINGLE";
        console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)}, ${type5})`);
      });
      const deduplicated = await this.deduplicateGemResults(filteredResults);
      return deduplicated.slice(0, limit);
    }
    /**
     * Brute-force search (used when filters applied or HNSW unavailable)
     */
    async _denseSearchBruteForce(queryVector, filters, limit, startTime) {
      let query = this.collection.find({
        selector: {
          vector: { $exists: true }
        }
      });
      if (filters.collections && filters.collections.length > 0) {
        query = query.where("collections").in(filters.collections);
      }
      if (filters.dateRange) {
        query = query.where("timestamp").gte(filters.dateRange.from);
        if (filters.dateRange.to) {
          query = query.where("timestamp").lte(filters.dateRange.to);
        }
      }
      const docs = await query.exec();
      const results = docs.map((doc) => {
        const gem = doc.toJSON();
        const score = cosineSimilarity2(queryVector, gem.vector);
        return {
          id: gem.id,
          score,
          gem,
          isPrimary: gem.isPrimary || false,
          isVirtual: gem.isVirtual || false,
          parentGem: gem.parentGem || null,
          source: "dense-bruteforce"
        };
      });
      const sorted = results.sort((a, b) => b.score - a.score);
      sorted.slice(0, 5).forEach((r, i) => {
        const type5 = r.isPrimary ? "PRIMARY" : r.isVirtual ? "CHILD" : "SINGLE";
        console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)}, ${type5})`);
      });
      const deduplicated = await this.deduplicateGemResults(sorted);
      return deduplicated.slice(0, limit);
    }
    /**
     * Deduplicate search results: Merge primary and child gems
     * Returns only primary gems, using child's score if better
     * @param {Array} results - Search results with score, gem, isPrimary, isVirtual, parentGem
     * @returns {Promise<Array>} Deduplicated results
     */
    async deduplicateGemResults(results) {
      const gemMap = /* @__PURE__ */ new Map();
      for (const result of results) {
        if (result.isPrimary) {
          const primaryId = result.id;
          if (!gemMap.has(primaryId)) {
            gemMap.set(primaryId, {
              gem: result.gem,
              score: result.score,
              matchSource: "primary",
              // Matched via primary gem
              matchedAttribute: null,
              matchedSubTopic: null,
              source: result.source
            });
          } else {
            const existing = gemMap.get(primaryId);
            if (result.score > existing.score) {
              existing.score = result.score;
              existing.matchSource = "primary";
              existing.matchedAttribute = null;
              existing.matchedSubTopic = null;
            }
          }
        } else if (result.isVirtual) {
          const parentId = result.parentGem;
          if (!parentId) {
            console.warn("[VectorStore] Child gem has no parentGem:", result.id);
            continue;
          }
          if (!gemMap.has(parentId)) {
            const parentGem = await this.getGem(parentId);
            if (!parentGem) {
              console.warn("[VectorStore] Parent gem not found:", parentId);
              continue;
            }
            gemMap.set(parentId, {
              gem: parentGem,
              score: result.score,
              // ✅ Use Child's Score!
              matchSource: "child",
              matchedAttribute: result.gem.attribute || null,
              matchedSubTopic: result.gem.subTopic || null,
              source: result.source
            });
          } else {
            const existing = gemMap.get(parentId);
            if (result.score > existing.score) {
              existing.score = result.score;
              existing.matchSource = "child";
              existing.matchedAttribute = result.gem.attribute || null;
              existing.matchedSubTopic = result.gem.subTopic || null;
            }
          }
        } else {
          const gemId = result.id;
          if (!gemMap.has(gemId)) {
            gemMap.set(gemId, {
              gem: result.gem,
              score: result.score,
              matchSource: "single",
              matchedAttribute: null,
              matchedSubTopic: null,
              source: result.source
            });
          }
        }
      }
      const deduplicated = Array.from(gemMap.values()).sort((a, b) => b.score - a.score).map((item) => ({
        id: item.gem.id,
        score: item.score,
        gem: item.gem,
        source: item.source,
        matchSource: item.matchSource,
        // 'primary', 'child', or 'single'
        matchedAttribute: item.matchedAttribute,
        matchedSubTopic: item.matchedSubTopic
      }));
      deduplicated.slice(0, 3).forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.gem.value.substring(0, 40)}... (${r.score.toFixed(3)})`);
      });
      return deduplicated;
    }
    /**
     * Get all gems
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>}
     */
    async getAllGems(filters = {}) {
      const selector = {};
      if (filters.isPrimary !== void 0) {
        selector.isPrimary = filters.isPrimary;
      }
      if (filters.collections && filters.collections.length > 0) {
        selector.collections = { $in: filters.collections };
      }
      let query = this.collection.find({
        selector: Object.keys(selector).length > 0 ? selector : {}
      });
      const docs = await query.exec();
      return docs.map((doc) => doc.toJSON());
    }
    /**
     * Count gems
     * @param {Object} filters - Optional filters
     * @returns {Promise<number>}
     */
    async countGems(filters = {}) {
      let query = this.collection.count();
      if (filters.collections && filters.collections.length > 0) {
        query = query.where("collections").in(filters.collections);
      }
      return await query.exec();
    }
    /**
     * Get a single gem by ID
     * @param {string} id - Gem ID
     * @returns {Promise<Object|null>}
     */
    async getGem(id) {
      const doc = await this.collection.findOne(id).exec();
      return doc ? doc.toJSON() : null;
    }
    /**
     * Rebuild HNSW index from all vectors in database
     */
    async rebuildIndex() {
      await this._buildHNSW();
    }
    /**
     * Get HNSW index statistics
     */
    getIndexStats() {
      if (!this.indexReady || !this.hnswIndex) {
        return { ready: false };
      }
      return {
        ready: true,
        ...this.hnswIndex.getStats()
      };
    }
  };
  var vectorStoreInstance = null;
  async function getVectorStore() {
    if (!vectorStoreInstance) {
      vectorStoreInstance = new VectorStore();
      await vectorStoreInstance.init();
    }
    return vectorStoreInstance;
  }

  // engine/bm25.js
  init_database();
  var BM25_K1 = 1.5;
  var BM25_B = 0.75;
  var STOPWORDS = /* @__PURE__ */ new Set([
    // German
    "der",
    "die",
    "das",
    "den",
    "dem",
    "des",
    "ein",
    "eine",
    "einer",
    "eines",
    "einem",
    "und",
    "oder",
    "aber",
    "doch",
    "sondern",
    "denn",
    "wenn",
    "als",
    "wie",
    "bei",
    "von",
    "zu",
    "aus",
    "mit",
    "nach",
    "vor",
    "\xFCber",
    "unter",
    "zwischen",
    "ich",
    "du",
    "er",
    "sie",
    "es",
    "wir",
    "ihr",
    "mein",
    "dein",
    "sein",
    "ist",
    "sind",
    "war",
    "waren",
    "hat",
    "haben",
    "wird",
    "werden",
    // English
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "if",
    "then",
    "else",
    "when",
    "at",
    "by",
    "for",
    "with",
    "about",
    "as",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "my",
    "your",
    "his",
    "her",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did"
  ]);
  function tokenize(text) {
    if (!text || typeof text !== "string") {
      return [];
    }
    return text.toLowerCase().replace(/[^\w\säöüß]/g, " ").split(/\s+/).filter((token) => token.length > 2 && !STOPWORDS.has(token));
  }
  function calculateTermFrequency(tokens) {
    const tf = {};
    for (const token of tokens) {
      tf[token] = (tf[token] || 0) + 1;
    }
    return tf;
  }
  var BM25 = class {
    constructor() {
      this.collection = null;
      this.stats = {
        totalDocs: 0,
        avgDocLength: 0,
        docFrequencies: {},
        // { term: number of docs containing term }
        lastUpdate: null
      };
    }
    /**
     * Initialize BM25 engine
     */
    async init() {
      this.collection = getGemsCollection();
      if (!this.collection) {
        throw new Error("[BM25] Database not initialized");
      }
      await this.buildIndex();
      return this;
    }
    /**
     * Build index statistics from existing gems
     * Calculates document frequencies and average document length
     */
    async buildIndex() {
      const docs = await this.collection.find().exec();
      const docLengths = [];
      const termDocCounts = {};
      for (const doc of docs) {
        const gem = doc.toJSON();
        const tokens = tokenize(gem.value);
        docLengths.push(tokens.length);
        const uniqueTerms = new Set(tokens);
        for (const term of uniqueTerms) {
          if (!termDocCounts[term]) {
            termDocCounts[term] = /* @__PURE__ */ new Set();
          }
          termDocCounts[term].add(gem.id);
        }
      }
      this.stats.totalDocs = docs.length;
      this.stats.avgDocLength = docLengths.length > 0 ? docLengths.reduce((sum, len) => sum + len, 0) / docLengths.length : 0;
      this.stats.docFrequencies = {};
      for (const [term, docSet] of Object.entries(termDocCounts)) {
        this.stats.docFrequencies[term] = docSet.size;
      }
      this.stats.lastUpdate = Date.now();
    }
    /**
     * Calculate IDF (Inverse Document Frequency) for a term
     * @param {string} term - Search term
     * @returns {number} IDF score
     */
    calculateIDF(term) {
      const df = this.stats.docFrequencies[term] || 0;
      const N = this.stats.totalDocs;
      return Math.log((N - df + 0.5) / (df + 0.5) + 1);
    }
    /**
     * Calculate BM25 score for a document
     * @param {string[]} queryTokens - Tokenized query
     * @param {Object} gem - Gem document
     * @returns {number} BM25 score
     */
    calculateScore(queryTokens, gem) {
      const docTokens = tokenize(gem.value);
      const docLength = docTokens.length;
      const termFreq = calculateTermFrequency(docTokens);
      let score = 0;
      for (const term of queryTokens) {
        const tf = termFreq[term] || 0;
        if (tf === 0) {
          continue;
        }
        const idf = this.calculateIDF(term);
        const numerator = tf * (BM25_K1 + 1);
        const denominator = tf + BM25_K1 * (1 - BM25_B + BM25_B * (docLength / this.stats.avgDocLength));
        score += idf * (numerator / denominator);
      }
      return score;
    }
    /**
     * Sparse keyword search using BM25
     * @param {string} query - Search query
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Max results
     * @returns {Promise<Array>} Sorted search results
     */
    async sparseSearch(query, filters = {}, limit = 20) {
      if (!this.stats.lastUpdate || Date.now() - this.stats.lastUpdate > 5 * 60 * 1e3) {
        await this.buildIndex();
      }
      const queryTokens = tokenize(query);
      if (queryTokens.length === 0) {
        console.warn("[BM25] No valid query tokens");
        return [];
      }
      let rxQuery = this.collection.find();
      if (filters.collections && filters.collections.length > 0) {
        rxQuery = rxQuery.where("collections").in(filters.collections);
      }
      if (filters.dateRange) {
        rxQuery = rxQuery.where("timestamp").gte(filters.dateRange.from);
        if (filters.dateRange.to) {
          rxQuery = rxQuery.where("timestamp").lte(filters.dateRange.to);
        }
      }
      const docs = await rxQuery.exec();
      const results = docs.map((doc) => {
        const gem = doc.toJSON();
        const score = this.calculateScore(queryTokens, gem);
        return {
          id: gem.id,
          score,
          gem,
          source: "sparse"
        };
      }).filter((result) => result.score > 0);
      const sorted = results.sort((a, b) => b.score - a.score).slice(0, limit);
      return sorted;
    }
    /**
     * Update index incrementally (when a gem is added/updated)
     * @param {Object} gem - Gem that was added/updated
     */
    async updateIndex(gem) {
      const tokens = tokenize(gem.value);
      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        this.stats.docFrequencies[term] = (this.stats.docFrequencies[term] || 0) + 1;
      }
      const oldTotal = this.stats.totalDocs * this.stats.avgDocLength;
      this.stats.totalDocs += 1;
      this.stats.avgDocLength = (oldTotal + tokens.length) / this.stats.totalDocs;
    }
    /**
     * Remove gem from index
     * @param {Object} gem - Gem that was removed
     */
    async removeFromIndex(gem) {
      const tokens = tokenize(gem.value);
      const uniqueTerms = new Set(tokens);
      for (const term of uniqueTerms) {
        if (this.stats.docFrequencies[term]) {
          this.stats.docFrequencies[term] -= 1;
          if (this.stats.docFrequencies[term] <= 0) {
            delete this.stats.docFrequencies[term];
          }
        }
      }
      if (this.stats.totalDocs > 1) {
        const oldTotal = this.stats.totalDocs * this.stats.avgDocLength;
        this.stats.totalDocs -= 1;
        this.stats.avgDocLength = (oldTotal - tokens.length) / this.stats.totalDocs;
      } else {
        this.stats.totalDocs = 0;
        this.stats.avgDocLength = 0;
      }
    }
    /**
     * Get index statistics
     * @returns {Object} Index stats
     */
    getStats() {
      return {
        totalDocs: this.stats.totalDocs,
        avgDocLength: this.stats.avgDocLength,
        uniqueTerms: Object.keys(this.stats.docFrequencies).length,
        lastUpdate: this.stats.lastUpdate
      };
    }
  };
  var bm25Instance = null;
  async function getBM25() {
    if (!bm25Instance) {
      bm25Instance = new BM25();
      await bm25Instance.init();
    }
    return bm25Instance;
  }

  // engine/hybrid-search.js
  var RRF_K = 60;
  var MMR_LAMBDA = 0.7;
  function reciprocalRankFusion(rankedLists, k = RRF_K) {
    const rrfScores = {};
    const gemData = {};
    for (const results of rankedLists) {
      results.forEach((result, rank) => {
        const { id, gem } = result;
        const rrfScore = 1 / (k + rank + 1);
        rrfScores[id] = (rrfScores[id] || 0) + rrfScore;
        if (!gemData[id]) {
          gemData[id] = gem;
        }
      });
    }
    return Object.entries(rrfScores).map(([id, score]) => ({
      id,
      score,
      gem: gemData[id]
    })).sort((a, b) => b.score - a.score);
  }
  function maximalMarginalRelevance(results, queryVector, limit, lambda = MMR_LAMBDA) {
    if (!queryVector || results.length === 0) {
      return results.slice(0, limit);
    }
    const selected = [];
    const remaining = [...results];
    selected.push(remaining.shift());
    while (selected.length < limit && remaining.length > 0) {
      let maxScore = -Infinity;
      let maxIndex = -1;
      for (let i = 0; i < remaining.length; i++) {
        const candidate = remaining[i];
        if (!candidate.gem.vector) {
          continue;
        }
        const relevance = cosineSimilarity2(candidate.gem.vector, queryVector);
        let maxSimilarity = 0;
        for (const selectedDoc of selected) {
          if (selectedDoc.gem.vector) {
            const similarity = cosineSimilarity2(candidate.gem.vector, selectedDoc.gem.vector);
            maxSimilarity = Math.max(maxSimilarity, similarity);
          }
        }
        const mmrScore = lambda * relevance - (1 - lambda) * maxSimilarity;
        if (mmrScore > maxScore) {
          maxScore = mmrScore;
          maxIndex = i;
        }
      }
      if (maxIndex >= 0) {
        selected.push(remaining.splice(maxIndex, 1)[0]);
      } else {
        selected.push(...remaining.splice(0, limit - selected.length));
        break;
      }
    }
    return selected;
  }
  var HybridSearch = class {
    constructor() {
      this.vectorStore = null;
      this.bm25 = null;
    }
    /**
     * Initialize hybrid search engine
     */
    async init() {
      this.vectorStore = await getVectorStore();
      this.bm25 = await getBM25();
      return this;
    }
    /**
     * Hybrid search combining dense + sparse
     *
     * @param {Object} params - Search parameters
     * @param {string} params.query - Search query text
     * @param {number[]} params.queryVector - Query embedding (384-dim)
     * @param {Object} params.filters - Filter criteria (collections, semanticTypes, dateRange)
     * @param {number} params.limit - Max results to return
     * @param {boolean} params.useDiversity - Apply MMR diversity filter
     * @param {Object} params.weights - Search weights { dense: 0.7, sparse: 0.3 }
     * @returns {Promise<Array>} Hybrid search results
     */
    async search({
      query,
      queryVector,
      filters = {},
      limit = 10,
      useDiversity = true,
      weights = { dense: 0.7, sparse: 0.3 }
    }) {
      console.log("[HybridSearch] Starting hybrid search:", {
        query,
        hasVector: !!queryVector,
        filters,
        limit,
        useDiversity
      });
      const rankedLists = [];
      if (queryVector && queryVector.length === 768) {
        console.log("[HybridSearch] Running dense search...");
        const denseResults = await this.vectorStore.denseSearch(
          queryVector,
          filters,
          limit * 2
          // Fetch more for RRF
        );
        rankedLists.push(denseResults);
      } else {
        console.warn(
          "[HybridSearch] No query vector, skipping dense search",
          queryVector ? `(got ${queryVector.length}-dim)` : "(no vector)"
        );
      }
      console.log("[HybridSearch] Running sparse search...");
      const sparseResults = await this.bm25.sparseSearch(
        query,
        filters,
        limit * 2
        // Fetch more for RRF
      );
      rankedLists.push(sparseResults);
      if (rankedLists.every((list) => list.length === 0)) {
        console.warn("[HybridSearch] No results from any search method");
        return [];
      }
      let fusedResults = reciprocalRankFusion(rankedLists);
      if (useDiversity && queryVector) {
        fusedResults = maximalMarginalRelevance(fusedResults, queryVector, limit);
      } else {
        fusedResults = fusedResults.slice(0, limit);
      }
      return fusedResults;
    }
    /**
     * Dense-only search (faster, no keyword matching)
     * @param {number[]} queryVector - Query embedding
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Max results
     * @returns {Promise<Array>}
     */
    async denseSearch(queryVector, filters = {}, limit = 10) {
      console.log("[HybridSearch] Dense-only search");
      return this.vectorStore.denseSearch(queryVector, filters, limit);
    }
    /**
     * Sparse-only search (faster, no embeddings needed)
     * @param {string} query - Search query
     * @param {Object} filters - Filter criteria
     * @param {number} limit - Max results
     * @returns {Promise<Array>}
     */
    async sparseSearch(query, filters = {}, limit = 10) {
      console.log("[HybridSearch] Sparse-only search");
      return this.bm25.sparseSearch(query, filters, limit);
    }
    /**
     * Get search engine statistics
     * @returns {Object}
     */
    getStats() {
      return {
        vectorStore: this.vectorStore ? "ready" : "not initialized",
        bm25: this.bm25 ? this.bm25.getStats() : null
      };
    }
  };
  var hybridSearchInstance = null;
  async function getHybridSearch() {
    if (!hybridSearchInstance) {
      hybridSearchInstance = new HybridSearch();
      await hybridSearchInstance.init();
    }
    return hybridSearchInstance;
  }

  // engine/enrichment.js
  var Enrichment = class {
    constructor() {
      this.languageSession = null;
      this.embedderSession = null;
      this.categoryEmbeddings = null;
      this.categoryEmbeddingsReady = false;
      this.categoryEmbeddingsInitializing = false;
      this.isAvailable = {
        languageModel: false,
        embedder: false
      };
    }
    /**
     * Initialize enrichment engine
     */
    async init() {
      await this.initLanguageModel();
      await this.initEmbedder();
      await this.loadCategoryEmbeddings();
      return this;
    }
    /**
     * Initialize Language Model for topic extraction
     */
    async initLanguageModel() {
      try {
        if (typeof LanguageModel === "undefined") {
          console.warn("[Enrichment] LanguageModel API not available");
          return false;
        }
        const availability = await LanguageModel.availability();
        if (availability === "readily" || availability === "available") {
          this.languageSession = await LanguageModel.create({
            language: "en"
            // No system prompt - will be provided per-request
          });
          this.isAvailable.languageModel = true;
          return true;
        } else {
          console.warn("[Enrichment] LanguageModel not readily available:", availability);
          return false;
        }
      } catch (error) {
        console.error("[Enrichment] Error initializing LanguageModel:", error);
        return false;
      }
    }
    /**
     * Initialize Embedder
     * In Service Worker: Uses offscreen document for WASM
     * In other contexts: Would use Transformers.js directly (not needed for now)
     */
    async initEmbedder() {
      try {
        if (typeof chrome !== "undefined" && chrome.runtime) {
          this.embedderSession = "offscreen";
          this.isAvailable.embedder = true;
          return true;
        } else {
          console.warn("[Enrichment] No embedding method available");
          return false;
        }
      } catch (error) {
        console.error("[Enrichment] Error initializing embedder:", error);
        this.isAvailable.embedder = false;
        return false;
      }
    }
    /**
     * Generate 768-dim embedding for text
     * Uses global generateEmbeddingOffscreen function from background.js
     * @param {string} text - Text to embed
     * @returns {Promise<number[]|null>} 768-dim vector or null
     */
    async generateEmbedding(text) {
      if (!this.embedderSession) {
        console.warn("[Enrichment] Embedder not available, skipping embedding");
        return null;
      }
      try {
        if (this.embedderSession === "offscreen") {
          return new Promise((resolve2, reject) => {
            chrome.runtime.sendMessage(
              {
                target: "offscreen",
                type: "generateEmbedding",
                text
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  console.error("[Enrichment] Chrome runtime error:", chrome.runtime.lastError);
                  reject(chrome.runtime.lastError);
                  return;
                }
                if (response?.success === false) {
                  console.error("[Enrichment] Embedding generation failed:", response.error);
                  resolve2(null);
                  return;
                }
                resolve2(response?.embedding || null);
              }
            );
          });
        }
        console.warn("[Enrichment] Unknown embedder session type:", this.embedderSession);
        return null;
      } catch (error) {
        console.error("[Enrichment] Error generating embedding:", error);
        return null;
      }
    }
    /**
     * Extract keywords for BM25 search
     * @param {string} text - Text to extract keywords from
     * @returns {Object} Term frequency map { word: count }
     */
    extractKeywords(text) {
      const tokens = tokenize(text);
      const keywords = {};
      for (const token of tokens) {
        keywords[token] = (keywords[token] || 0) + 1;
      }
      return keywords;
    }
    /**
     * Extract topic and attributes from text using AI
     * @param {string} text - Text to analyze
     * @param {Array<string>} existingCategories - List of existing categories to choose from
     * @returns {Promise<Object>} { topic: string|null, attributes: Array }
     */
    async extractTopicAndAttributes(text, existingCategories = []) {
      if (!this.languageSession) {
        console.warn("[Enrichment] LanguageModel not available, using fallback extraction");
        return this.fallbackExtraction(text, existingCategories);
      }
      try {
        const categoriesHint = existingCategories.length > 0 ? `
Available categories: ${existingCategories.join(", ")}` : "";
        const prompt = `Analyze this text and extract structured information:

Text: "${text}"${categoriesHint}

IMPORTANT: Return ONLY valid JSON, without markdown code blocks or backticks.

Return JSON with:
1. "topic": Main topic/question (e.g., "Wie ist deine Morning-Routine?") or null if not a question-based preference
2. "attributes": Array of extracted attributes

Each attribute should have:
- "subTopic": Human-readable sub-topic (e.g., "Kaffeeart, die ich gerne trinke")
- "attribute": Machine-readable key (e.g., "coffee_type")
- "value": Extracted value (e.g., "Espresso")
- "unit": Unit if applicable (e.g., "cm", "kg") or null
- "category": Category from available list or suggest new one

Example output:
{
  "topic": "Morning Routine",
  "attributes": [
    {
      "subTopic": "Kaffeeart, die ich trinke",
      "attribute": "coffee_type",
      "value": "Espresso",
      "unit": null,
      "category": "Nutrition"
    }
  ]
}

IMPORTANT:
- If text contains only ONE simple fact, return attributes array with ONE item
- If text is complex with multiple facts, extract ALL attributes
- Return ONLY valid JSON, no explanation`;
        const response = await this.languageSession.prompt(prompt);
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith("```")) {
          cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
        }
        const parsed = JSON.parse(cleanedResponse);
        return parsed;
      } catch (error) {
        console.error("[Enrichment] AI extraction failed:", error);
        return this.fallbackExtraction(text, existingCategories);
      }
    }
    /**
     * Fallback extraction using pattern matching
     * @param {string} text - Text to analyze
     * @param {Array<string>} existingCategories - Existing categories
     * @returns {Object} { topic: null, attributes: Array }
     */
    fallbackExtraction(text, existingCategories = []) {
      const attributes = [];
      const heightMatch = text.match(/(\d+)\s*(cm|m|ft|'|")/i);
      if (heightMatch) {
        attributes.push({
          subTopic: "Body height",
          attribute: "height",
          value: heightMatch[1],
          unit: heightMatch[2],
          category: existingCategories.includes("Health") ? "Health" : "Physical Attributes"
        });
      }
      const ageMatch = text.match(/(\d+)\s*years?\s*old|age\s*[:=]\s*(\d+)/i);
      if (ageMatch) {
        attributes.push({
          subTopic: "Age",
          attribute: "age",
          value: ageMatch[1] || ageMatch[2],
          unit: "years",
          category: existingCategories.includes("Identity") ? "Identity" : "Personal Info"
        });
      }
      if (attributes.length === 0) {
        attributes.push({
          subTopic: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
          attribute: "general",
          value: text,
          unit: null,
          category: existingCategories[0] || "General"
        });
      }
      return {
        topic: null,
        // No topic detection in fallback
        attributes
      };
    }
    /**
     * Enrich a gem with all metadata (including child gem creation)
     * @param {Object} gem - Gem object (must have 'value' field)
     * @param {Object} options - Enrichment options
     * @returns {Promise<Object>} Enriched gem with metadata
     */
    async enrichGem(gem, options = {}) {
      const enriched = { ...gem };
      const { value } = gem;
      if (enriched.isPrimary === void 0) {
        enriched.isPrimary = false;
      }
      if (!enriched.parentGem) {
        enriched.parentGem = "";
      }
      if (!enriched.childGems) {
        enriched.childGems = [];
      }
      if (enriched.isVirtual === void 0) {
        enriched.isVirtual = false;
      }
      if (!value || typeof value !== "string") {
        console.warn("[Enrichment] Gem has no valid text value, skipping enrichment");
        return enriched;
      }
      const existingCategories = Array.isArray(gem.collections) ? gem.collections : [];
      let extraction = null;
      if (options.createChildGems !== false) {
        extraction = await this.extractTopicAndAttributes(value, existingCategories);
        if (gem.topic) {
          enriched.topic = gem.topic;
        } else if (extraction.topic) {
          enriched.topic = extraction.topic;
        }
      }
      if (this.isAvailable.embedder && options.generateEmbedding !== false) {
        const vector = await this.generateEmbedding(value);
        if (vector) {
          enriched.vector = vector;
        }
      }
      if (options.extractKeywords !== false) {
        enriched.keywords = this.extractKeywords(value);
      }
      if (extraction && extraction.attributes && extraction.attributes.length > 1 && options.createChildGems !== false) {
        enriched.isPrimary = true;
        enriched.childGems = [];
        for (const attr of extraction.attributes) {
          const childValue = attr.unit ? `${attr.value} ${attr.unit}` : attr.value;
          const childGem = {
            id: `${gem.id}_${attr.attribute}`,
            value: childValue,
            // Collections (can differ from parent!)
            collections: attr.category ? [attr.category] : enriched.collections || [],
            subCollections: enriched.subCollections || [],
            // Topic hierarchy
            topic: enriched.topic || null,
            // Inherit from parent
            subTopic: attr.subTopic,
            // Specific sub-topic
            // Attribute details
            attribute: attr.attribute,
            attributeValue: attr.value,
            attributeUnit: attr.unit,
            // Relationship
            parentGem: gem.id,
            isVirtual: true,
            // Don't show in UI
            isPrimary: false,
            // Timestamp
            timestamp: gem.timestamp || Date.now(),
            // Generate precise vector for child (specific attribute)
            vector: null,
            // Will be generated below
            keywords: {}
          };
          if (this.isAvailable.embedder) {
            const childEmbeddingText = attr.subTopic ? `${attr.subTopic}: ${childValue}` : childValue;
            childGem.vector = await this.generateEmbedding(childEmbeddingText);
          }
          childGem.keywords = this.extractKeywords(`${attr.subTopic || ""} ${childValue}`);
          enriched.childGems.push(childGem.id);
          if (!enriched._childGemsToInsert) {
            enriched._childGemsToInsert = [];
          }
          enriched._childGemsToInsert.push(childGem);
        }
      }
      enriched.enrichmentVersion = "v2.1";
      enriched.enrichmentTimestamp = Date.now();
      return enriched;
    }
    /**
     * Batch enrich multiple gems
     * @param {Array<Object>} gems - Array of gems to enrich
     * @param {Object} options - Enrichment options
     * @param {Function} onProgress - Progress callback (current, total)
     * @returns {Promise<Array<Object>>} Enriched gems
     */
    async enrichBatch(gems, options = {}, onProgress = null) {
      const enriched = [];
      for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        try {
          const enrichedGem = await this.enrichGem(gem, options);
          enriched.push(enrichedGem);
          if (onProgress) {
            onProgress(i + 1, gems.length);
          }
        } catch (error) {
          console.error(`[Enrichment] Error enriching gem ${gem.id}:`, error);
          enriched.push(gem);
        }
      }
      return enriched;
    }
    /**
     * Get enrichment status
     * @returns {Object}
     */
    getStatus() {
      return {
        languageModel: {
          available: this.isAvailable.languageModel,
          hasSession: !!this.languageSession
        },
        embedder: {
          available: this.isAvailable.embedder,
          hasSession: !!this.embedderSession
        }
      };
    }
    /**
     * Destroy sessions to free resources
     */
    /**
     * Load pre-computed category embeddings from storage
     */
    async loadCategoryEmbeddings() {
      try {
        const storage = await chrome.storage.local.get(["category_embeddings"]);
        if (storage.category_embeddings) {
          this.categoryEmbeddings = JSON.parse(storage.category_embeddings);
          this.categoryEmbeddingsReady = true;
        } else {
          this.categoryEmbeddings = {};
          this.categoryEmbeddingsReady = false;
        }
      } catch (error) {
        console.error("[Enrichment] Error loading category embeddings:", error);
        this.categoryEmbeddings = {};
        this.categoryEmbeddingsReady = false;
      }
    }
    /**
     * Save category embeddings to storage
     */
    async saveCategoryEmbeddings() {
      try {
        const serialized = JSON.stringify(this.categoryEmbeddings);
        await chrome.storage.local.set({ category_embeddings: serialized });
        const sizeKB = Math.round(serialized.length / 1024);
      } catch (error) {
        console.error("[Enrichment] Error saving category embeddings:", error);
      }
    }
    /**
     * Initialize or update category embeddings
     * @param {Array<string>} categories - List of category names
     * @param {boolean} background - Run in background (non-blocking)
     */
    async initializeCategoryEmbeddings(categories, background = false) {
      if (this.categoryEmbeddingsInitializing) {
        return;
      }
      if (!this.isAvailable.embedder) {
        console.warn("[Enrichment] Embedder not available, cannot initialize category embeddings");
        return;
      }
      const newCategories = categories.filter((cat) => !this.categoryEmbeddings[cat]);
      if (newCategories.length === 0) {
        this.categoryEmbeddingsReady = true;
        return;
      }
      this.categoryEmbeddingsInitializing = true;
      if (background) {
      } else {
      }
      for (const category of newCategories) {
        try {
          const embedding = await this.generateEmbedding(category);
          if (embedding) {
            this.categoryEmbeddings[category] = embedding;
          }
        } catch (error) {
          console.error(`[Enrichment] Failed to embed category ${category}:`, error);
        }
      }
      await this.saveCategoryEmbeddings();
      this.categoryEmbeddingsReady = true;
      this.categoryEmbeddingsInitializing = false;
    }
    /**
     * Get category embeddings
     * @returns {Object} Map of category name to embedding vector
     */
    getCategoryEmbeddings() {
      return this.categoryEmbeddings || {};
    }
    /**
     * Check if category embeddings are ready
     * @returns {boolean} True if ready
     */
    areCategoryEmbeddingsReady() {
      return this.categoryEmbeddingsReady;
    }
    async destroy() {
      if (this.languageSession) {
        try {
          await this.languageSession.destroy();
        } catch (error) {
          console.error("[Enrichment] Error destroying LanguageModel:", error);
        }
        this.languageSession = null;
      }
      if (this.embedderSession) {
        try {
          await this.embedderSession.destroy();
        } catch (error) {
          console.error("[Enrichment] Error destroying Embedder:", error);
        }
        this.embedderSession = null;
      }
      this.isAvailable = {
        languageModel: false,
        embedder: false
      };
    }
  };
  var enrichmentInstance = null;
  async function getEnrichment() {
    if (!enrichmentInstance) {
      enrichmentInstance = new Enrichment();
      await enrichmentInstance.init();
    }
    return enrichmentInstance;
  }

  // engine/context-engine.js
  var ContextEngine = class {
    constructor() {
      this.db = null;
      this.collection = null;
      this.vectorStore = null;
      this.bm25 = null;
      this.hybridSearch = null;
      this.enrichment = null;
      this.isReady = false;
    }
    /**
     * Initialize Context Engine
     * Sets up all components: database, vector store, BM25, hybrid search, enrichment
     */
    async init() {
      try {
        this.db = await initDatabase();
        this.collection = getGemsCollection();
        this.vectorStore = await getVectorStore();
        this.bm25 = await getBM25();
        this.hybridSearch = await getHybridSearch();
        this.enrichment = await getEnrichment();
        this.isReady = true;
        const stats = await getDatabaseStats();
        console.log("[ContextEngine] Context Engine v2 ready!", stats);
        this._initializeCategoryEmbeddingsBackground().catch((error) => {
          console.error("[ContextEngine] Background category embedding failed:", error);
        });
        return this;
      } catch (error) {
        console.error("[ContextEngine] Failed to initialize:", error);
        throw error;
      }
    }
    /**
     * Background task: Initialize category embeddings
     * Runs async after Context Engine is ready
     * @private
     */
    async _initializeCategoryEmbeddingsBackground() {
      try {
        const allGems = await this.vectorStore.getAllGems();
        const categories = [...new Set(
          allGems.flatMap((gem) => {
            const gemData = gem.toJSON ? gem.toJSON() : gem;
            return gemData.collections || gemData._data?.collections || [];
          }).filter(Boolean)
        )];
        if (categories.length === 0) {
          return;
        }
        await this.enrichment.initializeCategoryEmbeddings(categories, true);
        console.log("[ContextEngine] \u2705 Background category embedding complete");
      } catch (error) {
        console.error("[ContextEngine] Background category embedding error:", error);
        throw error;
      }
    }
    /**
     * Add a new gem with auto-enrichment
     * @param {Object} gem - Gem object (must have id and value)
     * @param {boolean} autoEnrich - Auto-enrich with embeddings and semantic type
     * @returns {Promise<Object>} Enriched gem
     */
    async addGem(gem, autoEnrich = true) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      let enrichedGem = gem;
      if (autoEnrich) {
        enrichedGem = await this.enrichment.enrichGem(gem);
      }
      const childGems = enrichedGem._childGemsToInsert || [];
      delete enrichedGem._childGemsToInsert;
      await this.vectorStore.insert(enrichedGem);
      if (childGems.length > 0) {
        for (const childGem of childGems) {
          await this.vectorStore.insert(childGem);
          if (childGem.keywords) {
            await this.bm25.updateIndex(childGem);
          }
        }
      }
      if (enrichedGem.keywords) {
        await this.bm25.updateIndex(enrichedGem);
      }
      if (enrichedGem.collections && enrichedGem.collections.length > 0) {
        const existingEmbeddings = this.enrichment.getCategoryEmbeddings();
        const newCategories = enrichedGem.collections.filter((cat) => !existingEmbeddings[cat]);
        if (newCategories.length > 0) {
          await this.enrichment.initializeCategoryEmbeddings(newCategories);
        }
      }
      return enrichedGem;
    }
    /**
     * Update an existing gem
     * @param {string} id - Gem ID
     * @param {Object} updates - Fields to update
     * @param {boolean} reEnrich - Re-enrich if value changed
     * @returns {Promise<void>}
     */
    async updateGem(id, updates, reEnrich = true) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      const currentGem = await this.vectorStore.getGem(id);
      if (!currentGem) {
        throw new Error(`[ContextEngine] Gem not found: ${id}`);
      }
      let finalUpdates = updates;
      const shouldEnrich = reEnrich && (updates.value && updates.value !== currentGem.value || // Value changed
      (!currentGem.vector || currentGem.vector.length === 0));
      if (shouldEnrich) {
        console.log(`[ContextEngine] Re-enriching gem: ${id}`);
        const tempGem = { ...currentGem, ...updates };
        finalUpdates = await this.enrichment.enrichGem(tempGem);
      }
      await this.vectorStore.update(id, finalUpdates);
      await this.bm25.buildIndex();
    }
    /**
     * Delete a gem
     * @param {string} id - Gem ID
     * @returns {Promise<void>}
     */
    async deleteGem(id) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      const gem = await this.vectorStore.getGem(id);
      await this.vectorStore.delete(id);
      if (gem && gem.keywords) {
        await this.bm25.removeFromIndex(gem);
      }
      console.log(`[ContextEngine] Gem deleted successfully: ${id}`);
    }
    /**
     * Bulk import gems with optional auto-enrichment
     * @param {Array<Object>} gems - Array of gems to import
     * @param {boolean} autoEnrich - Auto-enrich all gems
     * @param {Function} onProgress - Progress callback (current, total)
     * @returns {Promise<Object>} Import results
     */
    async bulkImport(gems, autoEnrich = true, onProgress = null) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      let enrichedGems = gems;
      if (autoEnrich) {
        enrichedGems = await this.enrichment.enrichBatch(gems, {}, onProgress);
      }
      const results = await this.vectorStore.bulkInsert(enrichedGems);
      await this.bm25.buildIndex();
      return results;
    }
    /**
     * Search for relevant context
     * @param {Object} params - Search parameters
     * @param {string} params.query - Search query text
     * @param {Object} params.filters - Filters (collections, semanticTypes, dateRange)
     * @param {number} params.limit - Max results
     * @param {boolean} params.useDiversity - Apply MMR diversity filter
     * @returns {Promise<Array>} Ranked context results
     */
    async search({
      query,
      filters = {},
      limit = 10,
      useDiversity = true
    }) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      let queryVector = null;
      if (this.enrichment.isAvailable.embedder) {
        queryVector = await this.enrichment.generateEmbedding(query);
      }
      const results = await this.hybridSearch.search({
        query,
        queryVector,
        filters,
        limit,
        useDiversity
      });
      const plainResults = results.map((result) => ({
        ...result.gem,
        score: result.score
      }));
      return plainResults;
    }
    /**
     * Get all gems (with optional filters)
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>}
     */
    async getAllGems(filters = {}) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      return this.vectorStore.getAllGems(filters);
    }
    /**
     * Get a single gem by ID
     * @param {string} id - Gem ID
     * @returns {Promise<Object|null>}
     */
    async getGem(id) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      return this.vectorStore.getGem(id);
    }
    /**
     * Generate embedding for text
     * @param {string} text - Text to embed
     * @returns {Promise<Array<number>|null>} Embedding vector or null
     */
    async generateEmbedding(text) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      if (!this.enrichment.isAvailable.embedder) {
        console.warn("[ContextEngine] Embedder not available");
        return null;
      }
      return this.enrichment.generateEmbedding(text);
    }
    /**
     * Get pre-computed category embeddings
     * @returns {Object} Map of category name to embedding vector
     */
    getCategoryEmbeddings() {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      return this.enrichment.getCategoryEmbeddings();
    }
    /**
     * Check if category embeddings are ready
     * @returns {boolean} True if ready
     */
    areCategoryEmbeddingsReady() {
      if (!this.isReady) {
        return false;
      }
      return this.enrichment.areCategoryEmbeddingsReady();
    }
    /**
     * Get database statistics
     * @returns {Promise<Object>}
     */
    async getStats() {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      const dbStats = await getDatabaseStats();
      const bm25Stats = this.bm25.getStats();
      const enrichmentStatus = this.enrichment.getStatus();
      return {
        database: dbStats,
        bm25: bm25Stats,
        enrichment: enrichmentStatus,
        isReady: this.isReady
      };
    }
    /**
     * Batch re-enrich existing gems
     * Useful for migration from old data format
     * @param {Object} filters - Optional filters for which gems to re-enrich
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>} Re-enrichment results
     */
    async batchReEnrich(filters = {}, onProgress = null) {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      console.log("[ContextEngine] Starting batch re-enrichment...");
      const gems = await this.getAllGems(filters);
      console.log(`[ContextEngine] Found ${gems.length} gems to re-enrich`);
      let successCount = 0;
      let errorCount = 0;
      for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        try {
          const enriched = await this.enrichment.enrichGem(gem);
          await this.vectorStore.update(gem.id, enriched);
          successCount++;
          if (onProgress) {
            onProgress(i + 1, gems.length, successCount, errorCount);
          }
        } catch (error) {
          console.error(`[ContextEngine] Error re-enriching gem ${gem.id}:`, error);
          errorCount++;
        }
      }
      await this.bm25.buildIndex();
      const results = {
        total: gems.length,
        success: successCount,
        errors: errorCount
      };
      console.log("[ContextEngine] Batch re-enrichment complete:", results);
      return results;
    }
    /**
     * Rebuild all indexes
     * @returns {Promise<void>}
     */
    async rebuildIndexes() {
      if (!this.isReady) {
        throw new Error("[ContextEngine] Engine not initialized");
      }
      await this.vectorStore.rebuildIndex();
      await this.bm25.buildIndex();
    }
    /**
     * Destroy engine and clean up resources
     */
    async destroy() {
      if (this.enrichment) {
        await this.enrichment.destroy();
      }
      if (this.vectorStore) {
        this.vectorStore.hnswIndex = null;
        this.vectorStore.indexReady = false;
      }
      try {
        const { closeDatabase: closeDatabase2 } = await Promise.resolve().then(() => (init_database(), database_exports));
        await closeDatabase2();
      } catch (error) {
        console.warn("[ContextEngine] Error closing database:", error);
      }
      contextEngineInstance = null;
      this.isReady = false;
    }
  };
  var contextEngineInstance = null;
  async function getContextEngine() {
    if (!contextEngineInstance) {
      contextEngineInstance = new ContextEngine();
      await contextEngineInstance.init();
    }
    return contextEngineInstance;
  }

  // engine/migration.js
  function convertHSPItemToGem(item) {
    const gem = {
      id: item.id,
      value: item.value,
      collections: item.collections || [],
      subCollections: item.subCollections || [],
      timestamp: new Date(item.created_at || Date.now()).getTime()
    };
    if (item.semanticType) {
      gem.semanticType = item.semanticType;
    }
    if (item.attribute) {
      gem.attribute = item.attribute;
    }
    if (item.attributeValue) {
      gem.attributeValue = item.attributeValue;
    }
    if (item.attributeUnit) {
      gem.attributeUnit = item.attributeUnit;
    }
    if (item.userVerified) {
      gem.userVerified = item.userVerified;
    }
    return gem;
  }
  async function migrateToContextEngine({
    autoEnrich = true,
    clearOldData = false,
    onProgress = null
  } = {}) {
    console.log("[Migration] Starting migration to Context Engine v2...");
    try {
      console.log("[Migration] Loading data from chrome.storage...");
      const result = await chrome.storage.local.get(["hspProfile"]);
      if (!result.hspProfile) {
        console.warn("[Migration] No hspProfile found in chrome.storage");
        return {
          success: false,
          error: "No data to migrate",
          migrated: 0
        };
      }
      const hspProfile = result.hspProfile;
      const items = hspProfile?.content?.preferences?.items || [];
      if (items.length === 0) {
        console.warn("[Migration] No preference items found");
        return {
          success: false,
          error: "No preference items to migrate",
          migrated: 0
        };
      }
      console.log(`[Migration] Found ${items.length} items to migrate`);
      console.log("[Migration] Converting to Context Engine v2 format...");
      const gems = items.map((item) => convertHSPItemToGem(item));
      console.log(`[Migration] Converted ${gems.length} gems`);
      const engine = await getContextEngine();
      console.log(`[Migration] Importing ${gems.length} gems (autoEnrich: ${autoEnrich})...`);
      const importResults = await engine.bulkImport(
        gems,
        autoEnrich,
        (current, total) => {
          console.log(`[Migration] Progress: ${current}/${total} gems enriched`);
          if (onProgress) {
            onProgress(current, total);
          }
        }
      );
      console.log("[Migration] Import results:", importResults);
      if (clearOldData) {
        console.log("[Migration] Clearing old chrome.storage data...");
        await chrome.storage.local.remove(["hspProfile", "preferences", "userData"]);
        console.log("[Migration] Old data cleared");
      }
      const stats = await engine.getStats();
      const results = {
        success: true,
        migrated: importResults.success.length,
        errors: importResults.error.length,
        stats: stats.database,
        clearedOldData: clearOldData
      };
      return results;
    } catch (error) {
      console.error("[Migration] Migration failed:", error);
      return {
        success: false,
        error: error.message,
        migrated: 0
      };
    }
  }
  async function checkMigrationStatus() {
    try {
      const oldData = await chrome.storage.local.get(["hspProfile", "preferences"]);
      const hasOldData = !!(oldData.hspProfile || oldData.preferences);
      const engine = await getContextEngine();
      const stats = await engine.getStats();
      const hasNewData = stats.database.totalGems > 0;
      return {
        needsMigration: hasOldData && !hasNewData,
        hasOldData,
        hasNewData,
        oldItemCount: oldData.hspProfile?.content?.preferences?.items?.length || 0,
        newItemCount: stats.database.totalGems
      };
    } catch (error) {
      console.error("[Migration] Failed to check migration status:", error);
      return {
        needsMigration: false,
        hasOldData: false,
        hasNewData: false,
        error: error.message
      };
    }
  }

  // engine/bridge.js
  window.ContextEngineAPI = {
    engine: null,
    isReady: false,
    isInitializing: false,
    /**
     * Initialize Context Engine and run migration if needed
     */
    async initialize() {
      if (this.isReady || this.isInitializing) {
        return this.engine;
      }
      this.isInitializing = true;
      try {
        const migrationStatus = await checkMigrationStatus();
        if (migrationStatus.needsMigration) {
          const migrationResult = await migrateToContextEngine({
            autoEnrich: true,
            // Auto-enrich all gems with embeddings
            clearOldData: false,
            // Keep old data as backup
            onProgress: (current, total) => {
            }
          });
        } else {
        }
        this.engine = await getContextEngine();
        this.isReady = true;
        console.log("[Engine Bridge] Context Engine v2 ready!");
        const stats = await this.engine.getStats();
        return this.engine;
      } catch (error) {
        console.error("[Engine Bridge] Initialization failed:", error);
        this.isReady = false;
        throw error;
      } finally {
        this.isInitializing = false;
      }
    },
    /**
     * Search for relevant context
     * @param {string} query - Search query
     * @param {Object} filters - Optional filters
     * @param {number} limit - Max results
     * @returns {Promise<Array>} Search results
     */
    async search(query, filters = {}, limit = 10) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.search({ query, filters, limit });
    },
    /**
     * Add a new gem
     * @param {Object} gem - Gem data
     * @param {boolean} autoEnrich - Auto-enrich with embeddings
     * @returns {Promise<Object>} Added gem
     */
    async addGem(gem, autoEnrich = true) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.addGem(gem, autoEnrich);
    },
    /**
     * Update an existing gem
     * @param {string} id - Gem ID
     * @param {Object} updates - Updates
     * @param {boolean} reEnrich - Re-enrich if value changed
     * @returns {Promise<void>}
     */
    async updateGem(id, updates, reEnrich = true) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.updateGem(id, updates, reEnrich);
    },
    /**
     * Delete a gem
     * @param {string} id - Gem ID
     * @returns {Promise<void>}
     */
    async deleteGem(id) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.deleteGem(id);
    },
    /**
     * Get all gems
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>}
     */
    async getAllGems(filters = {}) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.getAllGems(filters);
    },
    /**
     * Get single gem by ID
     * @param {string} id - Gem ID
     * @returns {Promise<Object|null>}
     */
    async getGem(id) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.getGem(id);
    },
    /**
     * Get engine statistics
     * @returns {Promise<Object>}
     */
    async getStats() {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.getStats();
    },
    /**
     * Batch re-enrich existing gems
     * @param {Object} filters - Optional filters
     * @param {Function} onProgress - Progress callback
     * @returns {Promise<Object>}
     */
    async batchReEnrich(filters = {}, onProgress = null) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.batchReEnrich(filters, onProgress);
    },
    /**
     * Generate embedding for text
     * @param {string} text - Text to embed
     * @returns {Promise<Array<number>|null>}
     */
    async generateEmbedding(text) {
      if (!this.isReady) {
        await this.initialize();
      }
      return this.engine.generateEmbedding(text);
    },
    /**
     * Get pre-computed category embeddings
     * @returns {Object} Map of category name to embedding vector
     */
    getCategoryEmbeddings() {
      if (!this.isReady) {
        console.warn("[Engine Bridge] Engine not ready, returning empty embeddings");
        return {};
      }
      return this.engine.getCategoryEmbeddings();
    },
    /**
     * Check if category embeddings are ready
     * @returns {boolean}
     */
    areCategoryEmbeddingsReady() {
      if (!this.isReady) {
        return false;
      }
      return this.engine.areCategoryEmbeddingsReady();
    }
  };
})();
/*! Bundled license information:

dexie/dist/dexie.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
