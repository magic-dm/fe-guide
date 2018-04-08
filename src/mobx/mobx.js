void function __mobx(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    return module.exports = factory(global);
  }

  if (typeof define === 'function' && define.amd) {
    return define(factory)
  }

  global.mobx = factory(global);
}(this || window, function __globalFactory(G) {
  'use strict';

  /*************const****************/
  var MSG = {
    '001': 'the object must be observable',
  };

  var CONST = {
  };

  var FUNC = function FUNC(value) {
    return value;
  };

  /*************common methods****************/
  function invariant(condition, format) {
    var args = arguments;
    var message;
    if (!condition) {
      if (format === void 0) {
        message = 'Internal mobx error';
      } else {
        if (isFunction(format)) {
          args = slice(toArray(args), 2);
          message = format.apply(null, args);
        } else {
          message = format;
        }
      }
      throw new Error(message);
    }
  };

  function slice(arraylike) {
    var result = arraylike;
    if (result.length) {
      if (!result.slice) {
        result = toArray(result);
      }
      result = result.slice(2);
    }
    return result;
  };

  function toArray(arrayLike) {
    var length = arrayLike.length;
    var result;
    if (length) {
      result = new Array(length);
      for (var i = 0; i < length; i += 1) {
        result[i] = arrayLike[i];
      }
    }
    return result;
  };

  var isArray = Array.isArray;
  var freeze = Object.freeze;
  var def = Object.defineProperty;

  function isObject(obj) {
    return typeof obj === 'object';
  };

  function isFunction(func) {
    return typeof func === 'function';
  };

  function isProxyable(obj) {
    return obj && isObject(obj) && isObject(obj.valueOf());
  };

  function keyEach(obj, callback) {
    callback = callback || FUNC;
    if (isProxyable(obj)) {
      Object.keys(obj).forEach(function __keyEach(key, index) {
        callback(key, obj[key], index);
      });
    }
    return obj;
  };

  function defValue(obj, key, value) {
    return def(obj, key, {
      value: value,
      enumerable: false,
      configurable: true,
    });
  };

  function defPojo(obj, key, getter, setter) {
    return def(obj, key, {
      get: getter,
      set: setter,
      enumerable: false,
      configurable: true,
    });
  };

  /*************inner methods****************/
  function listenTo(listener, state) {
    keyEach(state, function __keyEachC(key, value) {
      var result = value;
      if (isProxyable(value)) {
        listener.values = listener.values || (isArray(value) ? [] : {});
        result = isArray(value) ? [] : {};
        listener.values[key] = new Watcher(result, {
          parent: listener,
          $id: key,
        });
        listenTo(result, value);
      }

      defPojo(listener, key, function __getter() {
        return result;
      }, function __setter(newVal) {
        result = newVal;
      });
    });
  };

  function Watcher(state, options) {
    listenTo(this, state);
    this.init(options);
  };

  var watcherProto = Watcher.prototype;

  watcherProto.$id = '@Watcher';

  watcherProto.KEY_OPT = '__options';

  watcherProto.init = function init(options) {
    return this.extend$id(options)
      .done();
  };
  
  watcherProto.extend$id = function extend$id(options) {
    options = options || {};
    var parent = options.parent;
    var $id = options.$id;
    defValue(this, this.KEY_OPT, options);
    if (parent) {
      this.$id = parent.$id + '@' + $id;
    }
    return this;
  };

  watcherProto.done = function done() {
    return freeze(this[this.KEY_OPT]), this;
  };

  function getBasicWatcher(state) {

  };

  function getObjectWatcher(state) {
    return new Watcher(state);
  };

  /*************mobx core methods****************/
  function observable(obj) {
    invariant(obj, MSG['001']);
    if (isProxyable(obj)) {
      return getObjectWatcher(obj);
    }
    return getBasicWatcher(obj);
  };

  function autorun() {

  };

  return {
    observable: observable,
    autorun: autorun,
  };
});