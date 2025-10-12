/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.10.0 - Fri Aug 12 2022 19:42:44 */

  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */

  /* vim: set sts=2 sw=2 et tw=80: */

  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!globalThis.chrome?.runtime?.id) {
    throw new Error("This script should only be loaded in a browser extension.");
  }

  if (typeof globalThis.browser === "undefined" || Object.getPrototypeOf(globalThis.browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received."; // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.

    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };

      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */


      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }

        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }

          return super.get(key);
        }

      }
      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */


      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */


      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };

      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */


      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }

          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }

          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args); // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.

                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */


      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }

        });
      };

      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */

      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },

          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }

            if (!(prop in target)) {
              return undefined;
            }

            let value = target[prop];

            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,

                get() {
                  return target[prop];
                },

                set(value) {
                  target[prop] = value;
                }

              });
              return value;
            }

            cache[prop] = value;
            return value;
          },

          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }

            return true;
          },

          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },

          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }

        }; // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.

        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */


      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },

        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },

        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }

      });

      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */


        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {}
          /* wrappers */
          , {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */


        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;

          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }

          const isResultThenable = result !== true && isThenable(result); // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.

          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          } // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).


          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;

              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }

              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          }; // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.


          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          } // Let Chrome know that the listener is replying.


          return true;
        };
      });

      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };

      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }

        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }

        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };

      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    }; // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.


    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ }),

/***/ "./src/common/appUtils.jsx":
/*!*********************************!*\
  !*** ./src/common/appUtils.jsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectContext: () => (/* binding */ collectContext),
/* harmony export */   deleteDataById: () => (/* binding */ deleteDataById),
/* harmony export */   getCalendarData: () => (/* binding */ getCalendarData),
/* harmony export */   getSettings: () => (/* binding */ getSettings),
/* harmony export */   getTodayData: () => (/* binding */ getTodayData),
/* harmony export */   getUserOnboardedStatus: () => (/* binding */ getUserOnboardedStatus),
/* harmony export */   saveManualData: () => (/* binding */ saveManualData),
/* harmony export */   saveSettings: () => (/* binding */ saveSettings),
/* harmony export */   storeSignInInfo: () => (/* binding */ storeSignInInfo),
/* harmony export */   sumDayData: () => (/* binding */ sumDayData),
/* harmony export */   textClean: () => (/* binding */ textClean),
/* harmony export */   textNum: () => (/* binding */ textNum),
/* harmony export */   todayDateString: () => (/* binding */ todayDateString)
/* harmony export */ });
/* harmony import */ var _const__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./const */ "./src/common/const.ts");
/* harmony import */ var _browserMethods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browserMethods */ "./src/common/browserMethods.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/common/utils.ts");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



async function getDataByDay(dateString) {
  const res = await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA);
  return Array.isArray(res === null || res === void 0 ? void 0 : res[dateString]) ? res[dateString] : [];
}
function todayDateString() {
  return new Date().toISOString().split('T')[0];
}
const getSettings = async () => {
  const res = await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_SETTINGS);
  const maintanance = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(res.maintanance) || 2000;
  const desiredIntake = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(res.desiredIntake) || maintanance;
  const startDate = res.startDate || todayDateString(new Date(new Date().getFullYear(), 0, 1));
  const startWeight = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(res.startWeight) || 180;
  const unit = res.unit;
  return {
    maintanance,
    desiredIntake,
    startDate,
    startWeight,
    unit
  };
};
const saveSettings = async data => {
  const settings = await getSettings();
  settings.maintanance = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(data.maintanance) || settings.maintanance;
  const desiredIntake = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(data.desiredIntake);
  settings.desiredIntake = desiredIntake > 0 ? desiredIntake : settings.maintanance;
  settings.startDate = data.startDate || settings.startDate;
  settings.startWeight = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(data.startWeight) || settings.startWeight;
  settings.unit = data.unit;
  await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_SETTINGS, settings);
};
const sumDay = data => {
  return data.reduce((acc, currentDayData) => {
    acc.calories += (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(currentDayData.calories);
    acc.protein += (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(currentDayData.protein);
    acc.carbs += (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(currentDayData.carbs);
    acc.fats += (0,_utils__WEBPACK_IMPORTED_MODULE_2__.stringToNumber)(currentDayData.fats);
    return acc;
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
};
async function sumDayData() {
  const currentDayData = await getTodayData();
  return sumDay(currentDayData);
}
async function getTodayData() {
  const dateString = todayDateString();
  return await getDataByDay(dateString);
}
async function saveManualData(itemData) {
  const dateString = todayDateString();
  const currentDayData = await getDataByDay(dateString);
  currentDayData.push(itemData);
  const appData = await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA);
  appData[dateString] = currentDayData;
  await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA, appData);
}
async function deleteDataById(id) {
  const dateString = todayDateString();
  const currentDayData = await getDataByDay(dateString);
  const updatedData = currentDayData.filter(item => item.id !== id);
  const appData = await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA);
  appData[dateString] = updatedData;
  await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA, appData);
}
async function getCalendarData() {
  const appData = await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.APP_DATA);
  if (!appData) return [];
  const days = Object.keys(appData).filter(dateString => appData[dateString].length > 0).sort().map(dateString => {
    const entries = Array.isArray(appData[dateString]) ? appData[dateString] : [];
    const totals = sumDay(entries);
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = date.toLocaleDateString('en-US', {
      weekday: 'short'
    });
    const dayNumber = date.getDate();
    return _objectSpread({
      dateString,
      dayName,
      dayNumber
    }, totals);
  });
  return days;
}
const storeSignInInfo = async token => {
  await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.USER_TOKEN, token);
  await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.IS_USER_ONBOARDED, true);
};
const getUserOnboardedStatus = async () => {
  return await (0,_browserMethods__WEBPACK_IMPORTED_MODULE_1__.getLocalStorage)(_const__WEBPACK_IMPORTED_MODULE_0__.IS_USER_ONBOARDED);
};
function scrapeNutritionTable() {
  const CANDIDATE_SELECTORS = ['table', 'section', 'article', 'div', 'ul'];
  const KEYWORDS = ['nutrition', 'nutritional', 'calorie', 'calories', 'protein', 'carb', 'carbohydrate', 'fat', 'total fat'];
  const norm = s => String(s || '').replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim();
  let best = null;
  for (const sel of CANDIDATE_SELECTORS) {
    for (const node of document.querySelectorAll(sel)) {
      const t = norm(node.textContent || '');
      if (!t) continue;
      if (KEYWORDS.some(k => t.toLowerCase().includes(k))) {
        if (!best || t.length < best.text.length) best = {
          el: node,
          text: t
        };
      }
    }
  }
  if (!best) return {};
  const text = best.text;
  const mCalKcal = /calories[^0-9]{0,10}(\d{2,4})(?:\s*k?cal)?\b/i.exec(text);
  const mCalKJ = /(\d{3,5})\s*kJ\b/i.exec(text);
  const mProtein = /(protein|prot)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text);
  const mCarbs = /(carb|carbohydrate)s?[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text);
  const mFat = /(total\s+fat|fat)[^0-9]{0,10}(\d{1,3}(?:\.\d+)?)\s*g\b/i.exec(text);
  const out = {};
  if (mCalKcal) out.calories = Number(mCalKcal[1]);else if (mCalKJ) {
    const kj = Number(mCalKJ[1]);
    if (Number.isFinite(kj)) out.calories = Math.round(kj / 4.184);
  }
  if (mProtein) out.protein_g = Number(mProtein[2]);
  if (mCarbs) out.carbs_g = Number(mCarbs[2]);
  if (mFat) out.fat_g = Number(mFat[2]);
  const kcal = out.calories;
  const saneGrams = g => Number.isFinite(g) && g >= 0 && g <= 250;
  if (out.protein_g === kcal || !saneGrams(out.protein_g)) delete out.protein_g;
  if (out.carbs_g === kcal || !saneGrams(out.carbs_g)) delete out.carbs_g;
  if (out.fat_g === kcal || !saneGrams(out.fat_g)) delete out.fat_g;
  const vals = [out.protein_g, out.carbs_g, out.fat_g].filter(v => typeof v === 'number');
  if (vals.length && kcal != null && vals.every(v => v === kcal)) {
    delete out.protein_g;
    delete out.carbs_g;
    delete out.fat_g;
  }
  if (out.calories != null) {
    const c = out.calories;
    if (!Number.isFinite(c) || c < 20 || c > 3000) delete out.calories;
  }
  return out;
}
function collectContext() {
  const meta = {};
  document.querySelectorAll('meta[name],meta[property]').forEach(m => {
    const k = m.getAttribute('name') || m.getAttribute('property');
    const v = m.getAttribute('content');
    if (k && v) meta[k] = v;
  });
  const recipe_meta = {
    servings: textNum(document.querySelector('[itemprop="recipeYield"], .servings, .recipe-servings')),
    servingSize: textClean(document.querySelector('[itemprop="servingSize"], .serving-size'))
  };
  const ingredients = Array.from(document.querySelectorAll('[itemprop="recipeIngredient"], .ingredient, .ingredients li')).slice(0, 40).map(el => textClean(el)).filter(Boolean);
  const instructions_excerpt = Array.from(document.querySelectorAll('[itemprop="recipeInstructions"], .instructions, .method, .steps')).map(el => el.innerText || el.textContent || '').join('\n').slice(0, 1800);
  const nutrition_table_scrape = scrapeNutritionTable();
  const visible_text_excerpt = (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 5000);
  return {
    url: location.href,
    meta,
    recipe_meta,
    ingredients,
    instructions_excerpt,
    nutrition_table_scrape,
    visible_text_excerpt
  };
}
function textClean(el) {
  return (el && (el.innerText || el.textContent || '') || '').trim();
}
function textNum(el) {
  const t = textClean(el);
  const n = Number(String(t).replace(/[^\d.]/g, ''));
  return isFinite(n) ? n : null;
}

/***/ }),

/***/ "./src/common/browserMethods.ts":
/*!**************************************!*\
  !*** ./src/common/browserMethods.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activeTabData: () => (/* binding */ activeTabData),
/* harmony export */   createATab: () => (/* binding */ createATab),
/* harmony export */   getLocalStorage: () => (/* binding */ getLocalStorage),
/* harmony export */   getSyncStorage: () => (/* binding */ getSyncStorage),
/* harmony export */   reloadATab: () => (/* binding */ reloadATab),
/* harmony export */   runTimeMessage: () => (/* binding */ runTimeMessage),
/* harmony export */   sendActiveTabMesage: () => (/* binding */ sendActiveTabMesage),
/* harmony export */   sendTabMesageWithId: () => (/* binding */ sendTabMesageWithId),
/* harmony export */   setLocalStorage: () => (/* binding */ setLocalStorage),
/* harmony export */   setSyncStorage: () => (/* binding */ setSyncStorage),
/* harmony export */   updateATabUrl: () => (/* binding */ updateATabUrl),
/* harmony export */   updateActiveTabUrl: () => (/* binding */ updateActiveTabUrl),
/* harmony export */   waitTillActiveTabLoads: () => (/* binding */ waitTillActiveTabLoads),
/* harmony export */   waitTillTabLoads: () => (/* binding */ waitTillTabLoads)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/common/utils.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var syncRef = (webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage).sync;
var localRef = (webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().storage).local;
function setSyncStorage(KEY, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, syncRef.set((_a = {}, _a[KEY] = data, _a))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setLocalStorage(KEY, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, localRef.set((_a = {}, _a[KEY] = data, _a))];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getSyncStorage(KEY) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, syncRef.get()];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data[KEY]];
            }
        });
    });
}
function getLocalStorage(KEY) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, localRef.get()];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data[KEY]];
            }
        });
    });
}
function sendActiveTabMesage(data) {
    return __awaiter(this, void 0, void 0, function () {
        var activeTab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, activeTabData()];
                case 1:
                    activeTab = _a.sent();
                    return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(activeTab.id, __assign({}, data))];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function sendTabMesageWithId(tabId, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.sendMessage(tabId, __assign({}, data))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function runTimeMessage(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.sendMessage(data)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function reloadATab(tabId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.reload(tabId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createATab(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.create({ url: url })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function updateATabUrl(tabId, url, wait) {
    if (wait === void 0) { wait = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.update(tabId, { url: url })];
                case 1:
                    _b.sent();
                    if (!wait) return [3 /*break*/, 3];
                    return [4 /*yield*/, waitTillTabLoads(tabId)];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = null;
                    _b.label = 4;
                case 4:
                    _a;
                    return [2 /*return*/];
            }
        });
    });
}
function updateActiveTabUrl(url, wait) {
    if (wait === void 0) { wait = false; }
    return __awaiter(this, void 0, void 0, function () {
        var activeTab, activeTabId, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, activeTabData()];
                case 1:
                    activeTab = _b.sent();
                    activeTabId = activeTab.id;
                    return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.update(activeTabId, { url: url })];
                case 2:
                    _b.sent();
                    if (!wait) return [3 /*break*/, 4];
                    return [4 /*yield*/, waitTillTabLoads(activeTabId)];
                case 3:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _a = null;
                    _b.label = 5;
                case 5:
                    _a;
                    return [2 /*return*/];
            }
        });
    });
}
function waitTillActiveTabLoads() {
    return __awaiter(this, void 0, void 0, function () {
        var activeTab, activeTabId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, activeTabData()];
                case 1:
                    activeTab = _a.sent();
                    activeTabId = activeTab.id;
                    return [4 /*yield*/, waitTillTabLoads(activeTabId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function waitTillTabLoads(tabId) {
    return __awaiter(this, void 0, void 0, function () {
        var tab;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0,_utils__WEBPACK_IMPORTED_MODULE_1__.asyncSleep)(0.5)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.get(tabId)];
                case 2:
                    tab = _a.sent();
                    if (!(tab.status == 'loading')) return [3 /*break*/, 4];
                    return [4 /*yield*/, waitTillTabLoads(tabId)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function activeTabData() {
    return __awaiter(this, void 0, void 0, function () {
        var tabsData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().tabs.query({
                        active: true,
                    })];
                case 1:
                    tabsData = _a.sent();
                    return [2 /*return*/, tabsData[0]];
            }
        });
    });
}



/***/ }),

/***/ "./src/common/const.ts":
/*!*****************************!*\
  !*** ./src/common/const.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   APP_DATA: () => (/* binding */ APP_DATA),
/* harmony export */   APP_SETTINGS: () => (/* binding */ APP_SETTINGS),
/* harmony export */   CHAT_PATH: () => (/* binding */ CHAT_PATH),
/* harmony export */   CHECK_USAGE_LIMIT: () => (/* binding */ CHECK_USAGE_LIMIT),
/* harmony export */   EXTENSION_ID: () => (/* binding */ EXTENSION_ID),
/* harmony export */   IS_USER_ONBOARDED: () => (/* binding */ IS_USER_ONBOARDED),
/* harmony export */   MACTRAC_API_BASE_URL: () => (/* binding */ MACTRAC_API_BASE_URL),
/* harmony export */   MAX_Z_INDEX: () => (/* binding */ MAX_Z_INDEX),
/* harmony export */   SCAN_MESSAGE: () => (/* binding */ SCAN_MESSAGE),
/* harmony export */   USER_IDENTIFIER: () => (/* binding */ USER_IDENTIFIER),
/* harmony export */   USER_STATUS: () => (/* binding */ USER_STATUS),
/* harmony export */   USER_TOKEN: () => (/* binding */ USER_TOKEN),
/* harmony export */   logoUrl: () => (/* binding */ logoUrl),
/* harmony export */   logoUrlDark: () => (/* binding */ logoUrlDark)
/* harmony export */ });
var logoUrl = 'mactrac.png';
var logoUrlDark = 'mactrac_dark.png';
var MACTRAC_API_BASE_URL = 'https://mactrac.onrender.com/api/';
var CHAT_PATH = 'chat-completions';
var EXTENSION_ID = 'mactrac124';
var MAX_Z_INDEX = 200000000;
// Local storage keys
var IS_USER_ONBOARDED = 'IS_USER_ONBOARDED';
var USER_TOKEN = 'USER_TOKEN';
var APP_DATA = 'APP_DATA';
var APP_SETTINGS = 'APP_SETTINGS';
var USER_STATUS = 'USER_STATUS';
var USER_IDENTIFIER = 'USER_IDENTIFIER';
var CHECK_USAGE_LIMIT = 'CHECK_USAGE_LIMIT';
var SCAN_MESSAGE = 'SCAN_MESSAGE';


/***/ }),

/***/ "./src/common/utils.ts":
/*!*****************************!*\
  !*** ./src/common/utils.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asyncSleep: () => (/* binding */ asyncSleep),
/* harmony export */   caloriesIcon: () => (/* binding */ caloriesIcon),
/* harmony export */   cheeseIcon: () => (/* binding */ cheeseIcon),
/* harmony export */   convertInThousands: () => (/* binding */ convertInThousands),
/* harmony export */   leafIcon: () => (/* binding */ leafIcon),
/* harmony export */   mactracDarkLogo: () => (/* binding */ mactracDarkLogo),
/* harmony export */   mactracLogo: () => (/* binding */ mactracLogo),
/* harmony export */   muscleIcon: () => (/* binding */ muscleIcon),
/* harmony export */   stringToNumber: () => (/* binding */ stringToNumber),
/* harmony export */   trashIcon: () => (/* binding */ trashIcon)
/* harmony export */ });
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

function asyncSleep(sec) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, sec * 1000); })];
        });
    });
}
var mactracLogo = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/mactrac.png'); };
var mactracDarkLogo = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/mactrac_dark.png'); };
var trashIcon = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/trash.png'); };
var caloriesIcon = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/calories.svg'); };
var cheeseIcon = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/cheese.svg'); };
var leafIcon = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/leaf.svg'); };
var muscleIcon = function () { return webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default().runtime.getURL('assets/muscle.svg'); };
var convertInThousands = function (number) { return (number / 1000).toFixed(2).replace(/\.00$/, ''); };
var stringToNumber = function (string) {
    return string == null || string === '' ? 0 : Number(string) || 0;
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**************************************!*\
  !*** ./src/background/background.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_appUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/appUtils */ "./src/common/appUtils.jsx");
/* harmony import */ var _common_browserMethods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/browserMethods */ "./src/common/browserMethods.ts");
/* harmony import */ var _common_const__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/const */ "./src/common/const.ts");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
importScripts('ExtPay.js');



const DAILY_LIMIT = 5;
const initExtPay = () => {
  const extpay = ExtPay(_common_const__WEBPACK_IMPORTED_MODULE_2__.EXTENSION_ID);
  extpay.startBackground();
  extpay.onPaid.addListener(user => {
    checkSubscriptionStatus();
  });
};
initExtPay();
function initStorage() {
  const initSettings = {
    maintanance: 2000,
    desiredIntake: 2000,
    startDate: (0,_common_appUtils__WEBPACK_IMPORTED_MODULE_0__.todayDateString)(),
    startWeight: 180,
    unit: 0
  };
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.IS_USER_ONBOARDED, false);
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_TOKEN, '');
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.APP_DATA, {});
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.APP_SETTINGS, initSettings);
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_STATUS, {});
  (0,_common_browserMethods__WEBPACK_IMPORTED_MODULE_1__.setLocalStorage)(_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_IDENTIFIER, '');
}
chrome.runtime.onInstalled.addListener(() => {
  checkSubscriptionStatus();
  initStorage();
});
chrome.runtime.onStartup.addListener(() => {
  checkSubscriptionStatus();
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true;
});
async function checkSubscriptionStatus() {
  try {
    const extpay = ExtPay(_common_const__WEBPACK_IMPORTED_MODULE_2__.EXTENSION_ID);
    const user = await extpay.getUser();
    const userStatus = {
      paid: user.paid,
      subscriptionStatus: user.subscriptionStatus || null,
      plan: user.plan || null,
      email: user.email || null,
      subscriptionCancelAt: user.subscriptionCancelAt || null,
      trialStartedAt: user.trialStartedAt || null,
      installedAt: user.installedAt || null,
      lastChecked: new Date().toISOString()
    };
    await chrome.storage.local.set({
      [_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_STATUS]: userStatus
    });
  } catch (error) {
    await chrome.storage.local.set({
      [_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_STATUS]: {
        paid: false,
        error: true,
        errorMessage: error.message,
        lastChecked: new Date().toISOString()
      }
    });
  }
}
async function checkUsageLimit() {
  try {
    const extpay = ExtPay(_common_const__WEBPACK_IMPORTED_MODULE_2__.EXTENSION_ID);
    const user = await extpay.getUser();
    const isPaid = user.paid;
    if (isPaid) {
      return {
        success: true,
        canUse: true,
        unlimited: true
      };
    }
    const userIdentifier = await getUserIdentifier(user);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const usageKey = "usage_".concat(userIdentifier, "_").concat(today);
    const usageResult = await chrome.storage.local.get([usageKey]);
    const currentUsage = usageResult[usageKey] || 0;
    return {
      success: true,
      canUse: currentUsage < DAILY_LIMIT,
      count: currentUsage,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - currentUsage,
      unlimited: false
    };
  } catch (error) {
    return {
      success: false,
      canUse: false,
      message: error.message
    };
  }
}
async function incrementUsage() {
  try {
    const extpay = ExtPay(_common_const__WEBPACK_IMPORTED_MODULE_2__.EXTENSION_ID);
    const user = await extpay.getUser();
    if (user.paid) {
      return {
        success: true,
        unlimited: true
      };
    }
    const userIdentifier = await getUserIdentifier(user);
    const today = new Date().toISOString().split('T')[0];
    const usageKey = "usage_".concat(userIdentifier, "_").concat(today);
    const usageResult = await chrome.storage.local.get([usageKey]);
    const currentUsage = usageResult[usageKey] || 0;
    if (currentUsage >= DAILY_LIMIT) {
      return {
        success: false,
        error: 'Daily limit reached',
        count: currentUsage,
        limit: DAILY_LIMIT,
        remaining: 0
      };
    }
    const newCount = currentUsage + 1;
    await chrome.storage.local.set({
      [usageKey]: newCount
    });
    return {
      success: true,
      count: newCount,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - newCount
    };
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
async function getUserIdentifier(user) {
  try {
    let identifier = 'anonymous';
    if (user.email) {
      identifier = btoa(user.email).substring(0, 16);
    } else if (user.installedAt) {
      // Use installation date + browser info as fallback
      const browserInfo = navigator.userAgent.substring(0, 50);
      identifier = btoa(user.installedAt.toString() + browserInfo).substring(0, 16);
    } else {
      // Fallback: create and store a pseudo-random ID
      const stored = await chrome.storage.local.get([_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_IDENTIFIER]);
      if (stored[_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_IDENTIFIER]) {
        identifier = stored[_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_IDENTIFIER];
      } else {
        identifier = btoa(Math.random().toString() + Date.now().toString()).substring(0, 16);
        await chrome.storage.local.set({
          [_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_IDENTIFIER]: identifier
        });
      }
    }
    return identifier;
  } catch (error) {
    console.error('Error creating user identifier:', error);
    return 'fallback_' + Math.random().toString(36).substring(2, 10);
  }
}
async function getUserStatus() {
  const result = await chrome.storage.local.get([_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_STATUS]);
  return result[_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_STATUS] || null;
}
async function openPaymentPage() {
  const extpay = ExtPay(_common_const__WEBPACK_IMPORTED_MODULE_2__.EXTENSION_ID);
  await extpay.openPaymentPage();
}
function unwrapOpenAI(data) {
  var _data$choices, _ref, _choice$message$conte, _choice$message, _choice$delta;
  const choice = data === null || data === void 0 || (_data$choices = data.choices) === null || _data$choices === void 0 ? void 0 : _data$choices[0];
  let text = (_ref = (_choice$message$conte = choice === null || choice === void 0 || (_choice$message = choice.message) === null || _choice$message === void 0 ? void 0 : _choice$message.content) !== null && _choice$message$conte !== void 0 ? _choice$message$conte : choice === null || choice === void 0 || (_choice$delta = choice.delta) === null || _choice$delta === void 0 ? void 0 : _choice$delta.content) !== null && _ref !== void 0 ? _ref : null;
  if (typeof text !== 'string') return data;
  text = text.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```[a-zA-Z]*\s*/, '').replace(/```$/, '').trim();
  }
  try {
    return JSON.parse(text);
  } catch (_unused) {}
  const cleaned = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/,\s*([}\]])/g, '$1');
  try {
    console.log(JSON.parse(cleaned));
    return JSON.parse(cleaned);
  } catch (_unused2) {}
  const m = cleaned.match(/\{[\s\S]*\}/m);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (_unused3) {}
  }
  return data;
}
async function handleMessage(request, sender, sendResponse) {
  try {
    switch (request.type) {
      case _common_const__WEBPACK_IMPORTED_MODULE_2__.CHECK_USAGE_LIMIT:
        const usageData = await checkUsageLimit();
        sendResponse(usageData);
        break;
      case 'INCREMENT_USAGE':
        const result = await incrementUsage();
        sendResponse(result);
        break;
      case 'GET_USER_STATUS':
        const status = await getUserStatus();
        sendResponse({
          success: true,
          status
        });
        break;
      case 'OPEN_PAYMENT_PAGE':
        await openPaymentPage();
        sendResponse({
          success: true
        });
        break;
      case 'CHECK_SUBSCRIPTION_STATUS':
        await checkSubscriptionStatus();
        const newStatus = await getUserStatus();
        sendResponse({
          success: true,
          status: newStatus
        });
        break;
      case _common_const__WEBPACK_IMPORTED_MODULE_2__.SCAN_MESSAGE:
        try {
          var _sender$tab;
          const {
            [_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_TOKEN]: token
          } = await chrome.storage.local.get([_common_const__WEBPACK_IMPORTED_MODULE_2__.USER_TOKEN]);

          // Include tab URL if not provided (helps your server logs)
          const payload = _objectSpread({}, request.payload);
          if (!payload.url && sender !== null && sender !== void 0 && (_sender$tab = sender.tab) !== null && _sender$tab !== void 0 && _sender$tab.url) payload.url = sender.tab.url;
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort('timeout'), 45000);
          const r = await fetch("".concat(_common_const__WEBPACK_IMPORTED_MODULE_2__.MACTRAC_API_BASE_URL).concat(_common_const__WEBPACK_IMPORTED_MODULE_2__.CHAT_PATH), {
            method: 'POST',
            headers: _objectSpread({
              'Content-Type': 'application/json'
            }, token ? {
              Authorization: "Bearer ".concat(token)
            } : {}),
            body: JSON.stringify(payload),
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (r.status === 401) {
            try {
              var _sender$tab2;
              chrome.tabs.sendMessage((sender === null || sender === void 0 || (_sender$tab2 = sender.tab) === null || _sender$tab2 === void 0 ? void 0 : _sender$tab2.id) || 0, {
                type: 'REAUTH_REQUIRED'
              });
            } catch (_unused4) {}
            return sendResponse({
              success: false,
              error: 'auth_required'
            });
          }
          const data = await r.json().catch(() => ({}));
          const result = unwrapOpenAI(data);
          return sendResponse({
            result
          });
        } catch (e) {
          return sendResponse({
            success: false,
            error: String((e === null || e === void 0 ? void 0 : e.message) || e)
          });
        }
      default:
        sendResponse({
          success: false,
          error: 'Unknown message type'
        });
    }
  } catch (error) {
    console.error('Error handling message:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}
})();

/******/ })()
;
//# sourceMappingURL=background.js.map