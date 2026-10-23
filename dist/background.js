(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/@firebase/util/dist/postinstall.mjs
  var getDefaultsFromPostinstall;
  var init_postinstall = __esm({
    "node_modules/@firebase/util/dist/postinstall.mjs"() {
      getDefaultsFromPostinstall = () => void 0;
    }
  });

  // node_modules/@firebase/util/dist/index.esm.js
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  function createMockUserToken(token, projectId) {
    if (token.uid) {
      throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    }
    const header = {
      alg: "none",
      type: "JWT"
    };
    const project = projectId || "demo-project";
    const iat = token.iat || 0;
    const sub = token.sub || token.user_id;
    if (!sub) {
      throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    }
    const payload = {
      // Set all required fields to decent defaults
      iss: `https://securetoken.google.com/${project}`,
      aud: project,
      iat,
      exp: iat + 3600,
      auth_time: iat,
      sub,
      user_id: sub,
      firebase: {
        sign_in_provider: "custom",
        identities: {}
      },
      // Override with user options
      ...token
    };
    const signature = "";
    return [
      base64urlEncodeWithoutPadding(JSON.stringify(header)),
      base64urlEncodeWithoutPadding(JSON.stringify(payload)),
      signature
    ].join(".");
  }
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && // @ts-ignore Setting up an broadly applicable index signature for Window
    // just to deal with this case would probably be a bad idea.
    !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isCloudflareWorker() {
    return typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers";
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          reject(request.error?.message || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function replaceTemplate(template, data) {
    try {
      let ptr = 0;
      let result = "";
      while (ptr < template.length) {
        const start = template.indexOf("{$", ptr);
        if (start === -1) {
          result += template.substring(ptr);
          break;
        }
        const end = template.indexOf("}", start + 2);
        if (end === -1) {
          result += template.substring(ptr);
          break;
        }
        const key = template.substring(start + 2, end);
        const value = data[key];
        result += template.substring(ptr, start) + (value != null ? String(value) : `<${key}?>`);
        ptr = end + 1;
      }
      return result;
    } catch (e) {
      return template;
    }
  }
  function deepEqual(a2, b2) {
    if (a2 === b2) {
      return true;
    }
    const aKeys = Object.keys(a2);
    const bKeys = Object.keys(b2);
    for (const k2 of aKeys) {
      if (!bKeys.includes(k2)) {
        return false;
      }
      const aProp = a2[k2];
      const bProp = b2[k2];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k2 of bKeys) {
      if (!aKeys.includes(k2)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
      if (Array.isArray(value)) {
        value.forEach((arrayVal) => {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
        });
      } else {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return params.length ? "&" + params.join("&") : "";
  }
  function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token) => {
      if (token) {
        const [key, value] = token.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return obj;
  }
  function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
      return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
  }
  function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
  }
  function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    for (const method of methods) {
      if (method in obj && typeof obj[method] === "function") {
        return true;
      }
    }
    return false;
  }
  function noop() {
  }
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }
  function isCloudWorkstation(url) {
    try {
      const host = url.startsWith("http://") || url.startsWith("https://") ? new URL(url).hostname : url;
      return host.endsWith(".cloudworkstations.dev");
    } catch {
      return false;
    }
  }
  async function pingServer(endpoint) {
    const result = await fetch(endpoint, {
      credentials: "include"
    });
    return result.ok;
  }
  var stringToByteArray$1, byteArrayToString, base64, DecodeBase64StringError, base64Encode, base64urlEncodeWithoutPadding, base64Decode, getDefaultsFromGlobal, getDefaultsFromEnvVariable, getDefaultsFromCookie, getDefaults, getDefaultEmulatorHost, getDefaultEmulatorHostnameAndPort, getDefaultAppConfig, Deferred, ERROR_NAME, FirebaseError, ErrorFactory, ObserverProxy, MAX_VALUE_MILLIS;
  var init_index_esm = __esm({
    "node_modules/@firebase/util/dist/index.esm.js"() {
      init_postinstall();
      stringToByteArray$1 = function(str) {
        const out = [];
        let p2 = 0;
        for (let i = 0; i < str.length; i++) {
          let c2 = str.charCodeAt(i);
          if (c2 < 128) {
            out[p2++] = c2;
          } else if (c2 < 2048) {
            out[p2++] = c2 >> 6 | 192;
            out[p2++] = c2 & 63 | 128;
          } else if ((c2 & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c2 = 65536 + ((c2 & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p2++] = c2 >> 18 | 240;
            out[p2++] = c2 >> 12 & 63 | 128;
            out[p2++] = c2 >> 6 & 63 | 128;
            out[p2++] = c2 & 63 | 128;
          } else {
            out[p2++] = c2 >> 12 | 224;
            out[p2++] = c2 >> 6 & 63 | 128;
            out[p2++] = c2 & 63 | 128;
          }
        }
        return out;
      };
      byteArrayToString = function(bytes) {
        const out = [];
        let pos = 0, c2 = 0;
        while (pos < bytes.length) {
          const c1 = bytes[pos++];
          if (c1 < 128) {
            out[c2++] = String.fromCharCode(c1);
          } else if (c1 > 191 && c1 < 224) {
            const c22 = bytes[pos++];
            out[c2++] = String.fromCharCode((c1 & 31) << 6 | c22 & 63);
          } else if (c1 > 239 && c1 < 365) {
            const c22 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u2 = ((c1 & 7) << 18 | (c22 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c2++] = String.fromCharCode(55296 + (u2 >> 10));
            out[c2++] = String.fromCharCode(56320 + (u2 & 1023));
          } else {
            const c22 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c2++] = String.fromCharCode((c1 & 15) << 12 | (c22 & 63) << 6 | c3 & 63);
          }
        }
        return out.join("");
      };
      base64 = {
        /**
         * Maps bytes to characters.
         */
        byteToCharMap_: null,
        /**
         * Maps characters to bytes.
         */
        charToByteMap_: null,
        /**
         * Maps bytes to websafe characters.
         * @private
         */
        byteToCharMapWebSafe_: null,
        /**
         * Maps websafe characters to bytes.
         * @private
         */
        charToByteMapWebSafe_: null,
        /**
         * Our default alphabet, shared between
         * ENCODED_VALS and ENCODED_VALS_WEBSAFE
         */
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        /**
         * Our default alphabet. Value 64 (=) is special; it means "nothing."
         */
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/=";
        },
        /**
         * Our websafe alphabet.
         */
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_.";
        },
        /**
         * Whether this browser supports the atob and btoa functions. This extension
         * started at Mozilla but is now implemented by many browsers. We use the
         * ASSUME_* variables to avoid pulling in the full useragent detection library
         * but still allowing the standard per-browser compilations.
         *
         */
        HAS_NATIVE_SUPPORT: typeof atob === "function",
        /**
         * Base64-encode an array of bytes.
         *
         * @param input An array of bytes (numbers with
         *     value in [0, 255]) to encode.
         * @param webSafe Boolean indicating we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeByteArray(input, webSafe) {
          if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
          }
          this.init_();
          const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
          const output = [];
          for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
              outByte4 = 64;
              if (!haveByte2) {
                outByte3 = 64;
              }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
          }
          return output.join("");
        },
        /**
         * Base64-encode a string.
         *
         * @param input A string to encode.
         * @param webSafe If true, we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
          }
          return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        /**
         * Base64-decode a string.
         *
         * @param input to decode.
         * @param webSafe True if we should use the
         *     alternative alphabet.
         * @return string representing the decoded value.
         */
        decodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
          }
          return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        /**
         * Base64-decode a string.
         *
         * In base-64 decoding, groups of four characters are converted into three
         * bytes.  If the encoder did not apply padding, the input length may not
         * be a multiple of 4.
         *
         * In this case, the last group will have fewer than 4 characters, and
         * padding will be inferred.  If the group has one or two characters, it decodes
         * to one byte.  If the group has three characters, it decodes to two bytes.
         *
         * @param input Input to decode.
         * @param webSafe True if we should use the web-safe alphabet.
         * @return bytes representing the decoded value.
         */
        decodeStringToByteArray(input, webSafe) {
          this.init_();
          const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
          const output = [];
          for (let i = 0; i < input.length; ) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
              throw new DecodeBase64StringError();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
              const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
              output.push(outByte2);
              if (byte4 !== 64) {
                const outByte3 = byte3 << 6 & 192 | byte4;
                output.push(outByte3);
              }
            }
          }
          return output;
        },
        /**
         * Lazy static initialization function. Called before
         * accessing any of the static map variables.
         * @private
         */
        init_() {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
              this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
              this.charToByteMap_[this.byteToCharMap_[i]] = i;
              this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
              this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
              if (i >= this.ENCODED_VALS_BASE.length) {
                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
              }
            }
          }
        }
      };
      DecodeBase64StringError = class extends Error {
        constructor() {
          super(...arguments);
          this.name = "DecodeBase64StringError";
        }
      };
      base64Encode = function(str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
      };
      base64urlEncodeWithoutPadding = function(str) {
        return base64Encode(str).replace(/\./g, "");
      };
      base64Decode = function(str) {
        try {
          return base64.decodeString(str, true);
        } catch (e) {
          console.error("base64Decode failed: ", e);
        }
        return null;
      };
      getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
      getDefaultsFromEnvVariable = () => {
        if (typeof process === "undefined" || typeof process.env === "undefined") {
          return;
        }
        const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
        if (defaultsJsonString) {
          return JSON.parse(defaultsJsonString);
        }
      };
      getDefaultsFromCookie = () => {
        if (typeof document === "undefined") {
          return;
        }
        let match;
        try {
          match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        } catch (e) {
          return;
        }
        const decoded = match && base64Decode(match[1]);
        return decoded && JSON.parse(decoded);
      };
      getDefaults = () => {
        try {
          return getDefaultsFromPostinstall() || getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
        } catch (e) {
          console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
          return;
        }
      };
      getDefaultEmulatorHost = (productName) => getDefaults()?.emulatorHosts?.[productName];
      getDefaultEmulatorHostnameAndPort = (productName) => {
        const host = getDefaultEmulatorHost(productName);
        if (!host) {
          return void 0;
        }
        const separatorIndex = host.lastIndexOf(":");
        if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
          throw new Error(`Invalid host ${host} with no separate hostname and port!`);
        }
        const port = parseInt(host.substring(separatorIndex + 1), 10);
        if (host[0] === "[") {
          return [host.substring(1, separatorIndex - 1), port];
        } else {
          return [host.substring(0, separatorIndex), port];
        }
      };
      getDefaultAppConfig = () => getDefaults()?.config;
      Deferred = class {
        constructor() {
          this.reject = () => {
          };
          this.resolve = () => {
          };
          this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
          });
        }
        /**
         * Our API internals are not promisified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        wrapCallback(callback) {
          return (error, value) => {
            if (error) {
              this.reject(error);
            } else {
              this.resolve(value);
            }
            if (typeof callback === "function") {
              this.promise.catch(() => {
              });
              if (callback.length === 1) {
                callback(error);
              } else {
                callback(error, value);
              }
            }
          };
        }
      };
      ERROR_NAME = "FirebaseError";
      FirebaseError = class _FirebaseError extends Error {
        constructor(code, message, customData) {
          super(message);
          this.code = code;
          this.customData = customData;
          this.name = ERROR_NAME;
          Object.setPrototypeOf(this, _FirebaseError.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
          }
        }
      };
      ErrorFactory = class {
        constructor(service, serviceName, errors) {
          this.service = service;
          this.serviceName = serviceName;
          this.errors = errors;
        }
        create(code, ...data) {
          const customData = data[0] || {};
          const fullCode = `${this.service}/${code}`;
          const template = this.errors[code];
          const message = template ? replaceTemplate(template, customData) : "Error";
          const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
          const error = new FirebaseError(fullCode, fullMessage, customData);
          return error;
        }
      };
      ObserverProxy = class {
        /**
         * @param executor Function which can make calls to a single Observer
         *     as a proxy.
         * @param onNoObservers Callback when count of Observers goes to zero.
         */
        constructor(executor, onNoObservers) {
          this.observers = [];
          this.unsubscribes = [];
          this.observerCount = 0;
          this.task = Promise.resolve();
          this.finalized = false;
          this.onNoObservers = onNoObservers;
          this.task.then(() => {
            executor(this);
          }).catch((e) => {
            this.error(e);
          });
        }
        next(value) {
          this.forEachObserver((observer) => {
            observer.next(value);
          });
        }
        error(error) {
          this.forEachObserver((observer) => {
            observer.error(error);
          });
          this.close(error);
        }
        complete() {
          this.forEachObserver((observer) => {
            observer.complete();
          });
          this.close();
        }
        /**
         * Subscribe function that can be used to add an Observer to the fan-out list.
         *
         * - We require that no event is sent to a subscriber synchronously to their
         *   call to subscribe().
         */
        subscribe(nextOrObserver, error, complete) {
          let observer;
          if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
            throw new Error("Missing Observer.");
          }
          if (implementsAnyMethods(nextOrObserver, [
            "next",
            "error",
            "complete"
          ])) {
            observer = nextOrObserver;
          } else {
            observer = {
              next: nextOrObserver,
              error,
              complete
            };
          }
          if (observer.next === void 0) {
            observer.next = noop;
          }
          if (observer.error === void 0) {
            observer.error = noop;
          }
          if (observer.complete === void 0) {
            observer.complete = noop;
          }
          const unsub = this.unsubscribeOne.bind(this, this.observers.length);
          if (this.finalized) {
            this.task.then(() => {
              try {
                if (this.finalError) {
                  observer.error(this.finalError);
                } else {
                  observer.complete();
                }
              } catch (e) {
              }
              return;
            });
          }
          this.observers.push(observer);
          return unsub;
        }
        // Unsubscribe is synchronous - we guarantee that no events are sent to
        // any unsubscribed Observer.
        unsubscribeOne(i) {
          if (this.observers === void 0 || this.observers[i] === void 0) {
            return;
          }
          delete this.observers[i];
          this.observerCount -= 1;
          if (this.observerCount === 0 && this.onNoObservers !== void 0) {
            this.onNoObservers(this);
          }
        }
        forEachObserver(fn) {
          if (this.finalized) {
            return;
          }
          for (let i = 0; i < this.observers.length; i++) {
            this.sendOne(i, fn);
          }
        }
        // Call the Observer via one of it's callback function. We are careful to
        // confirm that the observe has not been unsubscribed since this asynchronous
        // function had been queued.
        sendOne(i, fn) {
          this.task.then(() => {
            if (this.observers !== void 0 && this.observers[i] !== void 0) {
              try {
                fn(this.observers[i]);
              } catch (e) {
                if (typeof console !== "undefined" && console.error) {
                  console.error(e);
                }
              }
            }
          });
        }
        close(err) {
          if (this.finalized) {
            return;
          }
          this.finalized = true;
          if (err !== void 0) {
            this.finalError = err;
          }
          this.task.then(() => {
            this.observers = void 0;
            this.onNoObservers = void 0;
          });
        }
      };
      MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
    }
  });

  // node_modules/@firebase/component/dist/esm/index.esm.js
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var Component, DEFAULT_ENTRY_NAME, Provider, ComponentContainer;
  var init_index_esm2 = __esm({
    "node_modules/@firebase/component/dist/esm/index.esm.js"() {
      init_index_esm();
      Component = class {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name4, instanceFactory, type) {
          this.name = name4;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          this.serviceProps = {};
          this.instantiationMode = "LAZY";
          this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }
        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }
        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }
        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }
      };
      DEFAULT_ENTRY_NAME = "[DEFAULT]";
      Provider = class {
        constructor(name4, container) {
          this.name = name4;
          this.container = container;
          this.component = null;
          this.instances = /* @__PURE__ */ new Map();
          this.instancesDeferred = /* @__PURE__ */ new Map();
          this.instancesOptions = /* @__PURE__ */ new Map();
          this.onInitCallbacks = /* @__PURE__ */ new Map();
        }
        /**
         * @param identifier A provider can provide multiple instances of a service
         * if this.component.multipleInstances is true.
         */
        get(identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
              try {
                const instance = this.getOrInitializeService({
                  instanceIdentifier: normalizedIdentifier
                });
                if (instance) {
                  deferred.resolve(instance);
                }
              } catch (e) {
              }
            }
          }
          return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(options?.identifier);
          const optional = options?.optional ?? false;
          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              return this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
            } catch (e) {
              if (optional) {
                return null;
              } else {
                throw e;
              }
            }
          } else {
            if (optional) {
              return null;
            } else {
              throw Error(`Service ${this.name} is not available`);
            }
          }
        }
        getComponent() {
          return this.component;
        }
        setComponent(component) {
          if (component.name !== this.name) {
            throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
          }
          if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
          }
          this.component = component;
          if (!this.shouldAutoInitialize()) {
            return;
          }
          if (isComponentEager(component)) {
            try {
              this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
            } catch (e) {
            }
          }
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
              const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              instanceDeferred.resolve(instance);
            } catch (e) {
            }
          }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME) {
          this.instancesDeferred.delete(identifier);
          this.instancesOptions.delete(identifier);
          this.instances.delete(identifier);
        }
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        async delete() {
          const services = Array.from(this.instances.values());
          await Promise.all([
            ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
            ...services.filter((service) => "_delete" in service).map((service) => service._delete())
          ]);
        }
        isComponentSet() {
          return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME) {
          return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME) {
          return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
          const { options = {} } = opts;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
          if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
          }
          if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
          }
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
          });
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
              instanceDeferred.resolve(instance);
            }
          }
          return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */
        onInit(callback, identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          const existingCallbacks = this.onInitCallbacks.get(normalizedIdentifier) ?? /* @__PURE__ */ new Set();
          existingCallbacks.add(callback);
          this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
          const existingInstance = this.instances.get(normalizedIdentifier);
          if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
          }
          return () => {
            existingCallbacks.delete(callback);
          };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */
        invokeOnInitCallbacks(instance, identifier) {
          const callbacks = this.onInitCallbacks.get(identifier);
          if (!callbacks) {
            return;
          }
          for (const callback of callbacks) {
            try {
              callback(instance, identifier);
            } catch {
            }
          }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
          let instance = this.instances.get(instanceIdentifier);
          if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
              instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
              options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            if (this.component.onInstanceCreated) {
              try {
                this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
              } catch {
              }
            }
          }
          return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
          if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
          } else {
            return identifier;
          }
        }
        shouldAutoInitialize() {
          return !!this.component && this.component.instantiationMode !== "EXPLICIT";
        }
      };
      ComponentContainer = class {
        constructor(name4) {
          this.name = name4;
          this.providers = /* @__PURE__ */ new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        addComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
          }
          provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            this.providers.delete(component.name);
          }
          this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        getProvider(name4) {
          if (this.providers.has(name4)) {
            return this.providers.get(name4);
          }
          const provider = new Provider(name4, this);
          this.providers.set(name4, provider);
          return provider;
        }
        getProviders() {
          return Array.from(this.providers.values());
        }
      };
    }
  });

  // node_modules/@firebase/logger/dist/esm/index.esm.js
  var instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler, Logger;
  var init_index_esm3 = __esm({
    "node_modules/@firebase/logger/dist/esm/index.esm.js"() {
      instances = [];
      (function(LogLevel2) {
        LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
        LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
        LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
        LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
        LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
        LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
      })(LogLevel || (LogLevel = {}));
      levelStringToEnum = {
        "debug": LogLevel.DEBUG,
        "verbose": LogLevel.VERBOSE,
        "info": LogLevel.INFO,
        "warn": LogLevel.WARN,
        "error": LogLevel.ERROR,
        "silent": LogLevel.SILENT
      };
      defaultLogLevel = LogLevel.INFO;
      ConsoleMethod = {
        [LogLevel.DEBUG]: "log",
        [LogLevel.VERBOSE]: "log",
        [LogLevel.INFO]: "info",
        [LogLevel.WARN]: "warn",
        [LogLevel.ERROR]: "error"
      };
      defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
          return;
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
          console[method](`[${now}]  ${instance.name}:`, ...args);
        } else {
          throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
      };
      Logger = class {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name4) {
          this.name = name4;
          this._logLevel = defaultLogLevel;
          this._logHandler = defaultLogHandler;
          this._userLogHandler = null;
          instances.push(this);
        }
        get logLevel() {
          return this._logLevel;
        }
        set logLevel(val) {
          if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
          }
          this._logLevel = val;
        }
        // Workaround for setter/getter having to be the same type.
        setLogLevel(val) {
          this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
        }
        get logHandler() {
          return this._logHandler;
        }
        set logHandler(val) {
          if (typeof val !== "function") {
            throw new TypeError("Value assigned to `logHandler` must be a function");
          }
          this._logHandler = val;
        }
        get userLogHandler() {
          return this._userLogHandler;
        }
        set userLogHandler(val) {
          this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */
        debug(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
          this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
          this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
          this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
          this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
          this._logHandler(this, LogLevel.ERROR, ...args);
        }
      };
    }
  });

  // node_modules/idb/build/wrap-idb-value.js
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var instanceOfAny, idbProxyableTypes, cursorAdvanceMethods, cursorRequestMap, transactionDoneMap, transactionStoreNamesMap, transformCache, reverseTransformCache, idbProxyTraps, unwrap;
  var init_wrap_idb_value = __esm({
    "node_modules/idb/build/wrap-idb-value.js"() {
      instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
      cursorRequestMap = /* @__PURE__ */ new WeakMap();
      transactionDoneMap = /* @__PURE__ */ new WeakMap();
      transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
      transformCache = /* @__PURE__ */ new WeakMap();
      reverseTransformCache = /* @__PURE__ */ new WeakMap();
      idbProxyTraps = {
        get(target, prop, receiver) {
          if (target instanceof IDBTransaction) {
            if (prop === "done")
              return transactionDoneMap.get(target);
            if (prop === "objectStoreNames") {
              return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            if (prop === "store") {
              return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
            }
          }
          return wrap(target[prop]);
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        },
        has(target, prop) {
          if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
            return true;
          }
          return prop in target;
        }
      };
      unwrap = (value) => reverseTransformCache.get(value);
    }
  });

  // node_modules/idb/build/index.js
  function openDB(name4, version4, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name4, version4);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  var readMethods, writeMethods, cachedMethods;
  var init_build = __esm({
    "node_modules/idb/build/index.js"() {
      init_wrap_idb_value();
      init_wrap_idb_value();
      readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
      writeMethods = ["put", "add", "delete", "clear"];
      cachedMethods = /* @__PURE__ */ new Map();
      replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
      }));
    }
  });

  // node_modules/@firebase/app/dist/esm/index.esm.js
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return component?.type === "VERSION";
  }
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app2, name4) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name4);
  }
  function _isFirebaseServerApp(obj) {
    if (obj === null || obj === void 0) {
      return false;
    }
    return obj.settings !== void 0;
  }
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name5 = rawConfig;
      rawConfig = { name: name5 };
    }
    const config = {
      name: DEFAULT_ENTRY_NAME2,
      automaticDataCollectionEnabled: true,
      ...rawConfig
    };
    const name4 = config.name;
    if (typeof name4 !== "string" || !name4) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name4)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name4);
    if (existingApp) {
      if (!deepEqual(options, existingApp.options)) {
        throw ERROR_FACTORY.create("duplicate-app", {
          appName: name4,
          mismatchedParam: "options",
          oldValue: JSON.stringify(existingApp.options),
          newValue: JSON.stringify(options)
        });
      } else if (!deepEqual(config, existingApp.config)) {
        throw ERROR_FACTORY.create("duplicate-app", {
          appName: name4,
          mismatchedParam: "config",
          oldValue: JSON.stringify(existingApp.config),
          newValue: JSON.stringify(config)
        });
      } else {
        return existingApp;
      }
    }
    const container = new ComponentContainer(name4);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name4, newApp);
    return newApp;
  }
  function getApp(name4 = DEFAULT_ENTRY_NAME2) {
    const app2 = _apps.get(name4);
    if (!app2 && name4 === DEFAULT_ENTRY_NAME2 && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app2) {
      throw ERROR_FACTORY.create("no-app", { appName: name4 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version4, variant) {
    let library = PLATFORM_LOG_STRING[libraryKeyOrName] ?? libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version4.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version4}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version4}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version4 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db.createObjectStore(STORE_NAME);
              } catch (e) {
                console.warn(e);
              }
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
      await tx.done;
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db = await getDbPromise();
      const tx = db.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      await tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e?.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function getEarliestHeartbeatIdx(heartbeats) {
    if (heartbeats.length === 0) {
      return -1;
    }
    let earliestHeartbeatIdx = 0;
    let earliestHeartbeatDate = heartbeats[0].date;
    for (let i = 1; i < heartbeats.length; i++) {
      if (heartbeats[i].date < earliestHeartbeatDate) {
        earliestHeartbeatDate = heartbeats[i].date;
        earliestHeartbeatIdx = i;
      }
    }
    return earliestHeartbeatIdx;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$q, version$1, variant);
    registerVersion(name$q, version$1, "esm2020");
    registerVersion("fire-js", "");
  }
  var PlatformLoggerServiceImpl, name$q, version$1, logger, name$p, name$o, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, version, DEFAULT_ENTRY_NAME2, PLATFORM_LOG_STRING, _apps, _serverApps, _components, ERRORS, ERROR_FACTORY, FirebaseAppImpl, SDK_VERSION, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, MAX_NUM_STORED_HEARTBEATS, HeartbeatServiceImpl, HeartbeatStorageImpl;
  var init_index_esm4 = __esm({
    "node_modules/@firebase/app/dist/esm/index.esm.js"() {
      init_index_esm2();
      init_index_esm3();
      init_index_esm();
      init_index_esm();
      init_build();
      PlatformLoggerServiceImpl = class {
        constructor(container) {
          this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        getPlatformInfoString() {
          const providers = this.container.getProviders();
          return providers.map((provider) => {
            if (isVersionServiceProvider(provider)) {
              const service = provider.getImmediate();
              return `${service.library}/${service.version}`;
            } else {
              return null;
            }
          }).filter((logString) => logString).join(" ");
        }
      };
      name$q = "@firebase/app";
      version$1 = "0.16.4";
      logger = new Logger("@firebase/app");
      name$p = "@firebase/app-compat";
      name$o = "@firebase/analytics-compat";
      name$n = "@firebase/analytics";
      name$m = "@firebase/app-check-compat";
      name$l = "@firebase/app-check";
      name$k = "@firebase/auth";
      name$j = "@firebase/auth-compat";
      name$i = "@firebase/database";
      name$h = "@firebase/data-connect";
      name$g = "@firebase/database-compat";
      name$f = "@firebase/functions";
      name$e = "@firebase/functions-compat";
      name$d = "@firebase/installations";
      name$c = "@firebase/installations-compat";
      name$b = "@firebase/messaging";
      name$a = "@firebase/messaging-compat";
      name$9 = "@firebase/performance";
      name$8 = "@firebase/performance-compat";
      name$7 = "@firebase/remote-config";
      name$6 = "@firebase/remote-config-compat";
      name$5 = "@firebase/storage";
      name$4 = "@firebase/storage-compat";
      name$3 = "@firebase/firestore";
      name$2 = "@firebase/ai";
      name$1 = "@firebase/firestore-compat";
      name = "firebase";
      version = "13.1.0";
      DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
      PLATFORM_LOG_STRING = {
        [name$q]: "fire-core",
        [name$p]: "fire-core-compat",
        [name$n]: "fire-analytics",
        [name$o]: "fire-analytics-compat",
        [name$l]: "fire-app-check",
        [name$m]: "fire-app-check-compat",
        [name$k]: "fire-auth",
        [name$j]: "fire-auth-compat",
        [name$i]: "fire-rtdb",
        [name$h]: "fire-data-connect",
        [name$g]: "fire-rtdb-compat",
        [name$f]: "fire-fn",
        [name$e]: "fire-fn-compat",
        [name$d]: "fire-iid",
        [name$c]: "fire-iid-compat",
        [name$b]: "fire-fcm",
        [name$a]: "fire-fcm-compat",
        [name$9]: "fire-perf",
        [name$8]: "fire-perf-compat",
        [name$7]: "fire-rc",
        [name$6]: "fire-rc-compat",
        [name$5]: "fire-gcs",
        [name$4]: "fire-gcs-compat",
        [name$3]: "fire-fst",
        [name$1]: "fire-fst-compat",
        [name$2]: "fire-vertex",
        "fire-js": "fire-js",
        // Platform identifier for JS SDK.
        [name]: "fire-js-all"
      };
      _apps = /* @__PURE__ */ new Map();
      _serverApps = /* @__PURE__ */ new Map();
      _components = /* @__PURE__ */ new Map();
      ERRORS = {
        [
          "no-app"
          /* AppError.NO_APP */
        ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
        [
          "bad-app-name"
          /* AppError.BAD_APP_NAME */
        ]: "Illegal App name: '{$appName}'",
        [
          "duplicate-app"
          /* AppError.DUPLICATE_APP */
        ]: "Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.",
        [
          "app-deleted"
          /* AppError.APP_DELETED */
        ]: "Firebase App named '{$appName}' already deleted",
        [
          "server-app-deleted"
          /* AppError.SERVER_APP_DELETED */
        ]: "Firebase Server App has been deleted",
        [
          "no-options"
          /* AppError.NO_OPTIONS */
        ]: "Need to provide options, when not being deployed to hosting via source.",
        [
          "invalid-app-argument"
          /* AppError.INVALID_APP_ARGUMENT */
        ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        [
          "invalid-log-argument"
          /* AppError.INVALID_LOG_ARGUMENT */
        ]: "First argument to `onLog` must be null or a function.",
        [
          "idb-open"
          /* AppError.IDB_OPEN */
        ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-get"
          /* AppError.IDB_GET */
        ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-set"
          /* AppError.IDB_WRITE */
        ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-delete"
          /* AppError.IDB_DELETE */
        ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "finalization-registry-not-supported"
          /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
        ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
        [
          "invalid-server-app-environment"
          /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
        ]: "FirebaseServerApp is not for use in browser environments."
      };
      ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
      FirebaseAppImpl = class {
        constructor(options, config, container) {
          this._isDeleted = false;
          this._options = { ...options };
          this._config = { ...config };
          this._name = config.name;
          this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
          this._container = container;
          this.container.addComponent(new Component(
            "app",
            () => this,
            "PUBLIC"
            /* ComponentType.PUBLIC */
          ));
        }
        get automaticDataCollectionEnabled() {
          this.checkDestroyed();
          return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
          this.checkDestroyed();
          this._automaticDataCollectionEnabled = val;
        }
        get name() {
          this.checkDestroyed();
          return this._name;
        }
        get options() {
          this.checkDestroyed();
          return this._options;
        }
        get config() {
          this.checkDestroyed();
          return this._config;
        }
        get container() {
          return this._container;
        }
        get isDeleted() {
          return this._isDeleted;
        }
        set isDeleted(val) {
          this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
          }
        }
      };
      SDK_VERSION = version;
      DB_NAME = "firebase-heartbeat-database";
      DB_VERSION = 1;
      STORE_NAME = "firebase-heartbeat-store";
      dbPromise = null;
      MAX_HEADER_BYTES = 1024;
      MAX_NUM_STORED_HEARTBEATS = 30;
      HeartbeatServiceImpl = class {
        constructor(container) {
          this.container = container;
          this._heartbeatsCache = null;
          const app2 = this.container.getProvider("app").getImmediate();
          this._storage = new HeartbeatStorageImpl(app2);
          this._heartbeatsCachePromise = this._storage.read().then((result) => {
            this._heartbeatsCache = result;
            return result;
          });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */
        async triggerHeartbeat() {
          try {
            const platformLogger = this.container.getProvider("platform-logger").getImmediate();
            const agent = platformLogger.getPlatformInfoString();
            const date = getUTCDateString();
            if (this._heartbeatsCache?.heartbeats == null) {
              this._heartbeatsCache = await this._heartbeatsCachePromise;
              if (this._heartbeatsCache?.heartbeats == null) {
                return;
              }
            }
            if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
              return;
            } else {
              this._heartbeatsCache.heartbeats.push({ date, agent });
              if (this._heartbeatsCache.heartbeats.length > MAX_NUM_STORED_HEARTBEATS) {
                const earliestHeartbeatIdx = getEarliestHeartbeatIdx(this._heartbeatsCache.heartbeats);
                this._heartbeatsCache.heartbeats.splice(earliestHeartbeatIdx, 1);
              }
            }
            return this._storage.overwrite(this._heartbeatsCache);
          } catch (e) {
            logger.warn(e);
          }
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */
        async getHeartbeatsHeader() {
          try {
            if (this._heartbeatsCache === null) {
              await this._heartbeatsCachePromise;
            }
            if (this._heartbeatsCache?.heartbeats == null || this._heartbeatsCache.heartbeats.length === 0) {
              return "";
            }
            const date = getUTCDateString();
            const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
            const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
            this._heartbeatsCache.lastSentHeartbeatDate = date;
            if (unsentEntries.length > 0) {
              this._heartbeatsCache.heartbeats = unsentEntries;
              await this._storage.overwrite(this._heartbeatsCache);
            } else {
              this._heartbeatsCache.heartbeats = [];
              void this._storage.overwrite(this._heartbeatsCache);
            }
            return headerString;
          } catch (e) {
            logger.warn(e);
            return "";
          }
        }
      };
      HeartbeatStorageImpl = class {
        constructor(app2) {
          this.app = app2;
          this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
          if (!isIndexedDBAvailable()) {
            return false;
          } else {
            return validateIndexedDBOpenable().then(() => true).catch(() => false);
          }
        }
        /**
         * Read all heartbeats.
         */
        async read() {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return { heartbeats: [] };
          } else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            if (idbHeartbeatObject?.heartbeats) {
              return idbHeartbeatObject;
            } else {
              return { heartbeats: [] };
            }
          }
        }
        // overwrite the storage with the provided heartbeats
        async overwrite(heartbeatsObject) {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: heartbeatsObject.heartbeats
            });
          }
        }
        // add heartbeats
        async add(heartbeatsObject) {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: heartbeatsObject.lastSentHeartbeatDate ?? existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: [
                ...existingHeartbeatsObject.heartbeats,
                ...heartbeatsObject.heartbeats
              ]
            });
          }
        }
      };
      registerCoreComponents("");
    }
  });

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2, version2;
  var init_index_esm5 = __esm({
    "node_modules/firebase/app/dist/esm/index.esm.js"() {
      init_index_esm4();
      init_index_esm4();
      name2 = "firebase";
      version2 = "13.1.0";
      registerVersion(name2, version2, "app");
    }
  });

  // node_modules/@firebase/auth/dist/web-extension-esm/register-1dTRtNx2.js
  function _prodErrorMap() {
    return {
      [
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
  }
  function _logWarn(msg, ...args) {
    if (logClient.logLevel <= LogLevel.WARN) {
      logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
      logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
  }
  function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
  }
  function _errorWithCustomMessage(auth2, code, message) {
    const errorMap = {
      ...prodErrorMap(),
      [code]: message
    };
    const factory = new ErrorFactory("auth", "Firebase", errorMap);
    return factory.create(code, {
      appName: auth2.name
    });
  }
  function _serverAppCurrentUserOperationNotSupportedError(auth2) {
    return _errorWithCustomMessage(auth2, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
  }
  function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
      const code = rest[0];
      const fullParams = [...rest.slice(1)];
      if (fullParams[0]) {
        fullParams[0].appName = authOrCode.name;
      }
      return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
  }
  function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
      throw createErrorInternal(authOrCode, ...rest);
    }
  }
  function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
  }
  function debugAssert(assertion, message) {
    if (!assertion) {
      debugFail(message);
    }
  }
  function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
  }
  function _getCurrentScheme() {
    return typeof self !== "undefined" && self.location?.protocol || null;
  }
  function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
    // This is especially true for Cordova apps which have unreliable
    // navigator.onLine behavior unless cordova-plugin-network-information is
    // installed which overwrites the native navigator.onLine value and
    // defines navigator.connection.
    (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
      return navigator.onLine;
    }
    return true;
  }
  function _getUserLanguage() {
    if (typeof navigator === "undefined") {
      return null;
    }
    const navigatorLanguage = navigator;
    return (
      // Most reliable, but only supported in Chrome/Firefox.
      navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
      // UI, not the language set in browser settings.
      navigatorLanguage.language || // Couldn't determine language.
      null
    );
  }
  function _emulatorUrl(config, path) {
    debugAssert(config.emulator, "Emulator should always be set here");
    const { url } = config.emulator;
    if (!path) {
      return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
  }
  function _addTidIfNecessary(auth2, request) {
    if (auth2.tenantId && !request.tenantId) {
      return {
        ...request,
        tenantId: auth2.tenantId
      };
    }
    return request;
  }
  async function _performApiRequest(auth2, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth2, customErrorMap, async () => {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query2 = querystring({
        ...params,
        key: auth2.config.apiKey
      }).slice(1);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth2.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth2.languageCode;
      }
      const fetchArgs = {
        method,
        headers,
        ...body
      };
      if (!isCloudflareWorker()) {
        fetchArgs.referrerPolicy = "strict-origin-when-cross-origin";
      }
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        fetchArgs.credentials = "include";
      }
      return FetchProvider.fetch()(await _getFinalTarget(auth2, auth2.config.apiHost, path, query2), fetchArgs);
    });
  }
  async function _performFetchWithErrorHandling(auth2, customErrorMap, fetchFn) {
    auth2._canInitEmulator = false;
    const errorMap = { ...SERVER_ERROR_MAP, ...customErrorMap };
    try {
      const networkTimeout = new NetworkTimeout(auth2);
      const response = await Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = await response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth2, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth2, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth2, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth2, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth2, authError, serverErrorMessage);
        } else {
          _fail(auth2, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw e;
      }
      _fail(auth2, "network-request-failed", { "message": String(e) });
    }
  }
  async function _performSignInRequest(auth2, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth2, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth2, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  }
  async function _getFinalTarget(auth2, host, path, query2) {
    const base = `${host}${path}?${query2}`;
    const authInternal = auth2;
    const finalTarget = authInternal.config.emulator ? _emulatorUrl(auth2.config, base) : `${auth2.config.apiScheme}://${base}`;
    if (CookieAuthProxiedEndpoints.includes(path)) {
      await authInternal._persistenceManagerAvailable;
      if (authInternal._getPersistenceType() === "COOKIE") {
        const cookiePersistence = authInternal._getPersistence();
        return cookiePersistence._getFinalTarget(finalTarget).toString();
      }
    }
    return finalTarget;
  }
  function _parseEnforcementState(enforcementStateStr) {
    switch (enforcementStateStr) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  function _makeTaggedError(auth2, code, response) {
    const errorParams = {
      appName: auth2.name
    };
    if (response.email) {
      errorParams.email = response.email;
    }
    if (response.phoneNumber) {
      errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth2, code, errorParams);
    error.customData._tokenResponse = response;
    return error;
  }
  function isEnterprise(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
  }
  async function getRecaptchaConfig(auth2, request) {
    return _performApiRequest(auth2, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth2, request));
  }
  async function deleteAccount(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:delete", request);
  }
  async function getAccountInfo(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:lookup", request);
  }
  function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
      return void 0;
    }
    try {
      const date = new Date(Number(utcTimestamp));
      if (!isNaN(date.getTime())) {
        return date.toUTCString();
      }
    } catch (e) {
    }
    return void 0;
  }
  async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase?.["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: firebase?.["sign_in_second_factor"] || null
    };
  }
  function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1e3;
  }
  function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
      _logError("JWT malformed, contained fewer than 3 sections");
      return null;
    }
    try {
      const decoded = base64Decode(payload);
      if (!decoded) {
        _logError("Failed to decode base64 JWT payload");
        return null;
      }
      return JSON.parse(decoded);
    } catch (e) {
      _logError("Caught error parsing JWT payload as JSON", e?.toString());
      return null;
    }
  }
  function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(
      parsedToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.exp !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.iat !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return Number(parsedToken.exp) - Number(parsedToken.iat);
  }
  async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return await promise;
    } catch (e) {
      if (_isUserInvalidated(e)) {
        if (user.auth.currentUser === user) {
          await user.auth.signOut();
        }
      }
      throw e;
    }
  }
  function _isUserInvalidated(error) {
    if (error instanceof FirebaseError) {
      return error.code === `auth/${"user-disabled"}` || error.code === `auth/${"user-token-expired"}`;
    }
    return false;
  }
  async function _reloadWithoutSaving(user) {
    const auth2 = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth2, { idToken }));
    _assert(
      response?.users.length,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = coreAccount.providerUserInfo?.length ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !providerData?.length;
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  }
  async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  }
  function mergeProviderData(original, newData) {
    const deduped = original.filter((o2) => !newData.some((n2) => n2.providerId === o2.providerId));
    return [...deduped, ...newData];
  }
  function extractProviderData(providers) {
    return providers.map(({ providerId, ...provider }) => {
      return {
        providerId,
        uid: provider.rawId || "",
        displayName: provider.displayName || null,
        email: provider.email || null,
        phoneNumber: provider.phoneNumber || null,
        photoURL: provider.photoUrl || null
      };
    });
  }
  async function requestStsToken(auth2, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth2, {}, async () => {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth2.config;
      const url = await _getFinalTarget(auth2, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      const options = {
        method: "POST",
        headers,
        body
      };
      if (auth2.emulatorConfig && isCloudWorkstation(auth2.emulatorConfig.host)) {
        options.credentials = "include";
      }
      return FetchProvider.fetch()(url, options);
    });
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  }
  async function revokeToken(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth2, request));
  }
  function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
  }
  function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
      debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
      return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
  }
  function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase"}:${key}:${apiKey}:${appName}`;
  }
  function _getBrowserName(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes("opera/") || ua.includes("opr/") || ua.includes("opios/")) {
      return "Opera";
    } else if (_isIEMobile(ua)) {
      return "IEMobile";
    } else if (ua.includes("msie") || ua.includes("trident/")) {
      return "IE";
    } else if (ua.includes("edge/")) {
      return "Edge";
    } else if (_isFirefox(ua)) {
      return "Firefox";
    } else if (ua.includes("silk/")) {
      return "Silk";
    } else if (_isBlackBerry(ua)) {
      return "Blackberry";
    } else if (_isWebOS(ua)) {
      return "Webos";
    } else if (_isSafari(ua)) {
      return "Safari";
    } else if ((ua.includes("chrome/") || _isChromeIOS(ua)) && !ua.includes("edge/")) {
      return "Chrome";
    } else if (_isAndroid(ua)) {
      return "Android";
    } else {
      const re2 = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
      const matches = userAgent.match(re2);
      if (matches?.length === 2) {
        return matches[1];
      }
    }
    return "Other";
  }
  function _isFirefox(ua = getUA()) {
    return /firefox\//i.test(ua);
  }
  function _isSafari(userAgent = getUA()) {
    const ua = userAgent.toLowerCase();
    return ua.includes("safari/") && !ua.includes("chrome/") && !ua.includes("crios/") && !ua.includes("android");
  }
  function _isChromeIOS(ua = getUA()) {
    return /crios\//i.test(ua);
  }
  function _isIEMobile(ua = getUA()) {
    return /iemobile/i.test(ua);
  }
  function _isAndroid(ua = getUA()) {
    return /android/i.test(ua);
  }
  function _isBlackBerry(ua = getUA()) {
    return /blackberry/i.test(ua);
  }
  function _isWebOS(ua = getUA()) {
    return /webos/i.test(ua);
  }
  function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
      case "Browser":
        reportedPlatform = _getBrowserName(getUA());
        break;
      case "Worker":
        reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
        break;
      default:
        reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
  }
  async function _getPasswordPolicy(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth2, request));
  }
  function _castAuth(auth2) {
    return getModularInstance(auth2);
  }
  function _loadJS(url) {
    return externalJSProvider.loadJS(url);
  }
  function _recaptchaEnterpriseScriptUrl() {
    return externalJSProvider.recaptchaEnterpriseScript;
  }
  async function injectRecaptchaFields(auth2, request, action, isCaptchaResp = false, isFakeToken = false) {
    const verifier = new RecaptchaEnterpriseVerifier(auth2);
    let captchaResponse;
    if (isFakeToken) {
      captchaResponse = FAKE_TOKEN;
    } else {
      try {
        captchaResponse = await verifier.verify(action);
      } catch (error) {
        captchaResponse = await verifier.verify(action, true);
      }
    }
    const newRequest = { ...request };
    if (action === "mfaSmsEnrollment" || action === "mfaSmsSignIn") {
      if ("phoneEnrollmentInfo" in newRequest) {
        const phoneNumber = newRequest.phoneEnrollmentInfo.phoneNumber;
        const recaptchaToken = newRequest.phoneEnrollmentInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneEnrollmentInfo": {
            phoneNumber,
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      } else if ("phoneSignInInfo" in newRequest) {
        const recaptchaToken = newRequest.phoneSignInInfo.recaptchaToken;
        Object.assign(newRequest, {
          "phoneSignInInfo": {
            recaptchaToken,
            captchaResponse,
            "clientType": "CLIENT_TYPE_WEB",
            "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }
        });
      }
      return newRequest;
    }
    if (!isCaptchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  }
  async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod, recaptchaAuthProvider) {
    if (recaptchaAuthProvider === "EMAIL_PASSWORD_PROVIDER") {
      if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
        "EMAIL_PASSWORD_PROVIDER"
        /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          actionName === "getOobCode"
          /* RecaptchaActionName.GET_OOB_CODE */
        );
        return actionMethod(authInstance, requestWithRecaptcha);
      } else {
        return actionMethod(authInstance, request).catch(async (error) => {
          if (error.code === `auth/${"missing-recaptcha-token"}`) {
            console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
            const requestWithRecaptcha = await injectRecaptchaFields(
              authInstance,
              request,
              actionName,
              actionName === "getOobCode"
              /* RecaptchaActionName.GET_OOB_CODE */
            );
            return actionMethod(authInstance, requestWithRecaptcha);
          } else {
            return Promise.reject(error);
          }
        });
      }
    } else if (recaptchaAuthProvider === "PHONE_PROVIDER") {
      if (authInstance._getRecaptchaConfig()?.isProviderEnabled(
        "PHONE_PROVIDER"
        /* RecaptchaAuthProvider.PHONE_PROVIDER */
      )) {
        const requestWithRecaptcha = await injectRecaptchaFields(authInstance, request, actionName);
        return actionMethod(authInstance, requestWithRecaptcha).catch(async (error) => {
          if (authInstance._getRecaptchaConfig()?.getProviderEnforcementState(
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          ) === "AUDIT") {
            if (error.code === `auth/${"missing-recaptcha-token"}` || error.code === `auth/${"invalid-app-credential"}`) {
              console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${actionName} flow.`);
              const requestWithRecaptchaFields = await injectRecaptchaFields(
                authInstance,
                request,
                actionName,
                false,
                // isCaptchaResp
                true
                // isFakeToken
              );
              return actionMethod(authInstance, requestWithRecaptchaFields);
            }
          }
          return Promise.reject(error);
        });
      } else {
        const requestWithRecaptchaFields = await injectRecaptchaFields(
          authInstance,
          request,
          actionName,
          false,
          // isCaptchaResp
          true
          // isFakeToken
        );
        return actionMethod(authInstance, requestWithRecaptchaFields);
      }
    } else {
      return Promise.reject(recaptchaAuthProvider + " provider is not supported.");
    }
  }
  function initializeAuth(app2, deps) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      const auth3 = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (deepEqual(initialOptions, deps ?? {})) {
        return auth3;
      } else {
        _fail(
          auth3,
          "already-initialized"
          /* AuthErrorCode.ALREADY_INITIALIZED */
        );
      }
    }
    const auth2 = provider.initialize({ options: deps });
    return auth2;
  }
  function _initializeAuthInstance(auth2, deps) {
    const persistence = deps?.persistence || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps?.errorMap) {
      auth2._updateErrorMap(deps.errorMap);
    }
    auth2._initializeWithPersistence(hierarchy, deps?.popupRedirectResolver);
  }
  function connectAuthEmulator(auth2, url, options) {
    const authInternal = _castAuth(auth2);
    _assert(
      /^https?:\/\//.test(url),
      authInternal,
      "invalid-emulator-scheme"
      /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
    );
    const disableWarnings = !!options?.disableWarnings;
    const protocol = extractProtocol(url);
    const { host, port } = extractHostAndPort(url);
    const portStr = port === null ? "" : `:${port}`;
    const emulator = { url: `${protocol}//${host}${portStr}/` };
    const emulatorConfig = Object.freeze({
      host,
      port,
      protocol: protocol.replace(":", ""),
      options: Object.freeze({ disableWarnings })
    });
    if (!authInternal._canInitEmulator) {
      _assert(
        authInternal.config.emulator && authInternal.emulatorConfig,
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      _assert(
        deepEqual(emulator, authInternal.config.emulator) && deepEqual(emulatorConfig, authInternal.emulatorConfig),
        authInternal,
        "emulator-config-failed"
        /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
      );
      return;
    }
    authInternal.config.emulator = emulator;
    authInternal.emulatorConfig = emulatorConfig;
    authInternal.settings.appVerificationDisabledForTesting = true;
    if (isCloudWorkstation(host)) {
      void pingServer(`${protocol}//${host}${portStr}`);
    } else if (!disableWarnings) {
      emitEmulatorWarning();
    }
  }
  function extractProtocol(url) {
    const protocolEnd = url.indexOf(":");
    return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
  }
  function extractHostAndPort(url) {
    const protocol = extractProtocol(url);
    const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
    if (!authority) {
      return { host: "", port: null };
    }
    const hostAndPort = authority[2].split("@").pop() || "";
    const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
      const host = bracketedIPv6[1];
      return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    } else {
      const [host, port] = hostAndPort.split(":");
      return { host, port: parsePort(port) };
    }
  }
  function parsePort(portStr) {
    if (!portStr) {
      return null;
    }
    const port = Number(portStr);
    if (isNaN(port)) {
      return null;
    }
    return port;
  }
  function emitEmulatorWarning() {
    function attachBanner() {
      const el = document.createElement("p");
      const sty = el.style;
      el.innerText = "Running in emulator mode. Do not use with production credentials.";
      sty.position = "fixed";
      sty.width = "100%";
      sty.backgroundColor = "#ffffff";
      sty.border = ".1em solid #000000";
      sty.color = "#b50000";
      sty.bottom = "0px";
      sty.left = "0px";
      sty.margin = "0px";
      sty.zIndex = "10000";
      sty.textAlign = "center";
      el.classList.add("firebase-emulator-warning");
      document.body.appendChild(el);
    }
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", attachBanner);
      } else {
        attachBanner();
      }
    }
  }
  async function linkEmailPassword(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:signUp", request);
  }
  async function signInWithPassword(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLink$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLinkForLinking(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  async function signInWithIdp(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth2, request));
  }
  function parseMode(mode) {
    switch (mode) {
      case "recoverEmail":
        return "RECOVER_EMAIL";
      case "resetPassword":
        return "PASSWORD_RESET";
      case "signIn":
        return "EMAIL_SIGNIN";
      case "verifyEmail":
        return "VERIFY_EMAIL";
      case "verifyAndChangeEmail":
        return "VERIFY_AND_CHANGE_EMAIL";
      case "revertSecondFactorAddition":
        return "REVERT_SECOND_FACTOR_ADDITION";
      default:
        return null;
    }
  }
  function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
  }
  function providerIdForResponse(response) {
    if (response.providerId) {
      return response.providerId;
    }
    if ("phoneNumber" in response) {
      return "phone";
    }
    return null;
  }
  function _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth2) : credential._getIdTokenResponse(auth2);
    return idTokenProvider.catch((error) => {
      if (error.code === `auth/${"multi-factor-auth-required"}`) {
        throw MultiFactorError._fromErrorAndOperation(auth2, error, operationType, user);
      }
      throw error;
    });
  }
  async function _signInWithCredential(auth2, credential, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth2, operationType, response);
    if (!bypassAuthState) {
      await auth2._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  }
  async function signInWithCredential(auth2, credential) {
    return _signInWithCredential(_castAuth(auth2), credential);
  }
  function signOut(auth2) {
    return getModularInstance(auth2).signOut();
  }
  function startEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth2, request));
  }
  function finalizeEnrollTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth2, request));
  }
  function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
      try {
        const value = await promise;
        return {
          fulfilled: true,
          value
        };
      } catch (reason) {
        return {
          fulfilled: false,
          reason
        };
      }
    }));
  }
  function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for (let i = 0; i < digits; i++) {
      random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
  }
  function _window() {
    return window;
  }
  function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
  }
  async function _getActiveServiceWorker() {
    if (!navigator?.serviceWorker) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch {
      return null;
    }
  }
  function _getServiceWorkerController() {
    return navigator?.serviceWorker?.controller || null;
  }
  function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
  }
  function getObjectStore(db, isReadWrite) {
    return db.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
  }
  function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME2);
    return new DBPromise(request).toPromise();
  }
  function _openDatabase() {
    const request = indexedDB.open(DB_NAME2, DB_VERSION2);
    return new Promise((resolve, reject) => {
      request.addEventListener("error", () => {
        reject(request.error);
      });
      request.addEventListener("upgradeneeded", () => {
        const db = request.result;
        try {
          db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
        } catch (e) {
          reject(e);
        }
      });
      request.addEventListener("success", async () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
          db.close();
          await _deleteDatabase();
          resolve(await _openDatabase());
        } else {
          resolve(db);
        }
      });
    });
  }
  async function _putObject(db, key, value) {
    const request = getObjectStore(db, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  }
  async function getObject(db, key) {
    const request = getObjectStore(db, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  }
  function _deleteObject(db, key) {
    const request = getObjectStore(db, true).delete(key);
    return new DBPromise(request).toPromise();
  }
  function finalizeSignInTotpMfa(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth2, request));
  }
  function _isEmptyString(input) {
    return typeof input === "undefined" || input?.length === 0;
  }
  function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
      case "Node":
        return "node";
      case "ReactNative":
        return "rn";
      case "Worker":
        return "webworker";
      case "Cordova":
        return "cordova";
      case "WebExtension":
        return "web-extension";
      default:
        return void 0;
    }
  }
  function registerAuth(clientPlatform) {
    _registerComponent(new Component(
      "auth",
      (container, { options: deps }) => {
        const app2 = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        const appCheckServiceProvider = container.getProvider("app-check-internal");
        const { apiKey, authDomain } = app2.options;
        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
        const config = {
          apiKey,
          authDomain,
          clientPlatform,
          apiHost: "identitytoolkit.googleapis.com",
          tokenApiHost: "securetoken.googleapis.com",
          apiScheme: "https",
          sdkClientVersion: _getClientVersion(clientPlatform)
        };
        const authInstance = new AuthImpl(app2, heartbeatServiceProvider, appCheckServiceProvider, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
      const authInternalProvider = container.getProvider(
        "auth-internal"
        /* _ComponentName.AUTH_INTERNAL */
      );
      authInternalProvider.initialize();
    }));
    _registerComponent(new Component(
      "auth-internal",
      (container) => {
        const auth2 = _castAuth(container.getProvider(
          "auth"
          /* _ComponentName.AUTH */
        ).getImmediate());
        return ((auth3) => new AuthInterop(auth3))(auth2);
      },
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ));
    registerVersion(name3, version3, getVersionForPlatform(clientPlatform));
    registerVersion(name3, version3, "esm2020");
  }
  var prodErrorMap, _DEFAULT_AUTH_ERROR_FACTORY, logClient, Delay, FetchProvider, SERVER_ERROR_MAP, CookieAuthProxiedEndpoints, DEFAULT_API_TIMEOUT_MS, NetworkTimeout, RecaptchaConfig, ProactiveRefresh, UserMetadata, StsTokenManager, UserImpl, instanceCache, InMemoryPersistence, inMemoryPersistence, PersistenceUserManager, AuthMiddlewareQueue, MINIMUM_MIN_PASSWORD_LENGTH, PasswordPolicyImpl, AuthImpl, Subscription, externalJSProvider, MockGreCAPTCHATopLevel, MockGreCAPTCHA, RECAPTCHA_ENTERPRISE_VERIFIER_TYPE, FAKE_TOKEN, RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME, RecaptchaEnterpriseVerifier, AuthCredential, EmailAuthCredential, IDP_REQUEST_URI$1, OAuthCredential, ActionCodeURL, EmailAuthProvider, FederatedAuthProvider, BaseOAuthProvider, FacebookAuthProvider, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider, UserCredentialImpl, MultiFactorError, STORAGE_AVAILABLE_KEY, Receiver, Sender, DB_NAME2, DB_VERSION2, DB_OBJECTSTORE_NAME, DB_DATA_KEYPATH, DBPromise, _POLLING_INTERVAL_MS, _TRANSACTION_RETRY_COUNT, IndexedDBLocalPersistence, indexedDBLocalPersistence, MultiFactorAssertionImpl, TotpMultiFactorGenerator, TotpMultiFactorAssertionImpl, TotpSecret, name3, version3, AuthInterop;
  var init_register_1dTRtNx2 = __esm({
    "node_modules/@firebase/auth/dist/web-extension-esm/register-1dTRtNx2.js"() {
      init_index_esm();
      init_index_esm4();
      init_index_esm2();
      init_index_esm3();
      prodErrorMap = _prodErrorMap;
      _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
      logClient = new Logger("@firebase/auth");
      Delay = class {
        constructor(shortDelay, longDelay) {
          this.shortDelay = shortDelay;
          this.longDelay = longDelay;
          debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
          this.isMobile = isMobileCordova() || isReactNative();
        }
        get() {
          if (!_isOnline()) {
            return Math.min(5e3, this.shortDelay);
          }
          return this.isMobile ? this.longDelay : this.shortDelay;
        }
      };
      FetchProvider = class {
        static initialize(fetchImpl, headersImpl, responseImpl) {
          this.fetchImpl = fetchImpl;
          if (headersImpl) {
            this.headersImpl = headersImpl;
          }
          if (responseImpl) {
            this.responseImpl = responseImpl;
          }
        }
        static fetch() {
          if (this.fetchImpl) {
            return this.fetchImpl;
          }
          if (typeof self !== "undefined" && "fetch" in self) {
            return self.fetch;
          }
          if (typeof globalThis !== "undefined" && globalThis.fetch) {
            return globalThis.fetch;
          }
          if (typeof fetch !== "undefined") {
            return fetch;
          }
          debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
        static headers() {
          if (this.headersImpl) {
            return this.headersImpl;
          }
          if (typeof self !== "undefined" && "Headers" in self) {
            return self.Headers;
          }
          if (typeof globalThis !== "undefined" && globalThis.Headers) {
            return globalThis.Headers;
          }
          if (typeof Headers !== "undefined") {
            return Headers;
          }
          debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
        static response() {
          if (this.responseImpl) {
            return this.responseImpl;
          }
          if (typeof self !== "undefined" && "Response" in self) {
            return self.Response;
          }
          if (typeof globalThis !== "undefined" && globalThis.Response) {
            return globalThis.Response;
          }
          if (typeof Response !== "undefined") {
            return Response;
          }
          debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
        }
      };
      SERVER_ERROR_MAP = {
        // Custom token errors.
        [
          "CREDENTIAL_MISMATCH"
          /* ServerError.CREDENTIAL_MISMATCH */
        ]: "custom-token-mismatch",
        // This can only happen if the SDK sends a bad request.
        [
          "MISSING_CUSTOM_TOKEN"
          /* ServerError.MISSING_CUSTOM_TOKEN */
        ]: "internal-error",
        // Create Auth URI errors.
        [
          "INVALID_IDENTIFIER"
          /* ServerError.INVALID_IDENTIFIER */
        ]: "invalid-email",
        // This can only happen if the SDK sends a bad request.
        [
          "MISSING_CONTINUE_URI"
          /* ServerError.MISSING_CONTINUE_URI */
        ]: "internal-error",
        // Sign in with email and password errors (some apply to sign up too).
        [
          "INVALID_PASSWORD"
          /* ServerError.INVALID_PASSWORD */
        ]: "wrong-password",
        // This can only happen if the SDK sends a bad request.
        [
          "MISSING_PASSWORD"
          /* ServerError.MISSING_PASSWORD */
        ]: "missing-password",
        // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
        // invalid.
        [
          "INVALID_LOGIN_CREDENTIALS"
          /* ServerError.INVALID_LOGIN_CREDENTIALS */
        ]: "invalid-credential",
        // Sign up with email and password errors.
        [
          "EMAIL_EXISTS"
          /* ServerError.EMAIL_EXISTS */
        ]: "email-already-in-use",
        [
          "PASSWORD_LOGIN_DISABLED"
          /* ServerError.PASSWORD_LOGIN_DISABLED */
        ]: "operation-not-allowed",
        // Verify assertion for sign in with credential errors:
        [
          "INVALID_IDP_RESPONSE"
          /* ServerError.INVALID_IDP_RESPONSE */
        ]: "invalid-credential",
        [
          "INVALID_PENDING_TOKEN"
          /* ServerError.INVALID_PENDING_TOKEN */
        ]: "invalid-credential",
        [
          "FEDERATED_USER_ID_ALREADY_LINKED"
          /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
        ]: "credential-already-in-use",
        // This can only happen if the SDK sends a bad request.
        [
          "MISSING_REQ_TYPE"
          /* ServerError.MISSING_REQ_TYPE */
        ]: "internal-error",
        // Send Password reset email errors:
        [
          "EMAIL_NOT_FOUND"
          /* ServerError.EMAIL_NOT_FOUND */
        ]: "user-not-found",
        [
          "RESET_PASSWORD_EXCEED_LIMIT"
          /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
        ]: "too-many-requests",
        [
          "EXPIRED_OOB_CODE"
          /* ServerError.EXPIRED_OOB_CODE */
        ]: "expired-action-code",
        [
          "INVALID_OOB_CODE"
          /* ServerError.INVALID_OOB_CODE */
        ]: "invalid-action-code",
        // This can only happen if the SDK sends a bad request.
        [
          "MISSING_OOB_CODE"
          /* ServerError.MISSING_OOB_CODE */
        ]: "internal-error",
        // Operations that require ID token in request:
        [
          "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
          /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
        ]: "requires-recent-login",
        [
          "INVALID_ID_TOKEN"
          /* ServerError.INVALID_ID_TOKEN */
        ]: "invalid-user-token",
        [
          "TOKEN_EXPIRED"
          /* ServerError.TOKEN_EXPIRED */
        ]: "user-token-expired",
        [
          "USER_NOT_FOUND"
          /* ServerError.USER_NOT_FOUND */
        ]: "user-token-expired",
        // Other errors.
        [
          "TOO_MANY_ATTEMPTS_TRY_LATER"
          /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
        ]: "too-many-requests",
        [
          "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
          /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
        ]: "password-does-not-meet-requirements",
        // Phone Auth related errors.
        [
          "INVALID_CODE"
          /* ServerError.INVALID_CODE */
        ]: "invalid-verification-code",
        [
          "INVALID_SESSION_INFO"
          /* ServerError.INVALID_SESSION_INFO */
        ]: "invalid-verification-id",
        [
          "INVALID_TEMPORARY_PROOF"
          /* ServerError.INVALID_TEMPORARY_PROOF */
        ]: "invalid-credential",
        [
          "MISSING_SESSION_INFO"
          /* ServerError.MISSING_SESSION_INFO */
        ]: "missing-verification-id",
        [
          "SESSION_EXPIRED"
          /* ServerError.SESSION_EXPIRED */
        ]: "code-expired",
        // Other action code errors when additional settings passed.
        // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
        // This is OK as this error will be caught by client side validation.
        [
          "MISSING_ANDROID_PACKAGE_NAME"
          /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
        ]: "missing-android-pkg-name",
        [
          "UNAUTHORIZED_DOMAIN"
          /* ServerError.UNAUTHORIZED_DOMAIN */
        ]: "unauthorized-continue-uri",
        // getProjectConfig errors when clientId is passed.
        [
          "INVALID_OAUTH_CLIENT_ID"
          /* ServerError.INVALID_OAUTH_CLIENT_ID */
        ]: "invalid-oauth-client-id",
        // User actions (sign-up or deletion) disabled errors.
        [
          "ADMIN_ONLY_OPERATION"
          /* ServerError.ADMIN_ONLY_OPERATION */
        ]: "admin-restricted-operation",
        // Multi factor related errors.
        [
          "INVALID_MFA_PENDING_CREDENTIAL"
          /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
        ]: "invalid-multi-factor-session",
        [
          "MFA_ENROLLMENT_NOT_FOUND"
          /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
        ]: "multi-factor-info-not-found",
        [
          "MISSING_MFA_ENROLLMENT_ID"
          /* ServerError.MISSING_MFA_ENROLLMENT_ID */
        ]: "missing-multi-factor-info",
        [
          "MISSING_MFA_PENDING_CREDENTIAL"
          /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
        ]: "missing-multi-factor-session",
        [
          "SECOND_FACTOR_EXISTS"
          /* ServerError.SECOND_FACTOR_EXISTS */
        ]: "second-factor-already-in-use",
        [
          "SECOND_FACTOR_LIMIT_EXCEEDED"
          /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
        ]: "maximum-second-factor-count-exceeded",
        // Blocking functions related errors.
        [
          "BLOCKING_FUNCTION_ERROR_RESPONSE"
          /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
        ]: "internal-error",
        // Recaptcha related errors.
        [
          "RECAPTCHA_NOT_ENABLED"
          /* ServerError.RECAPTCHA_NOT_ENABLED */
        ]: "recaptcha-not-enabled",
        [
          "MISSING_RECAPTCHA_TOKEN"
          /* ServerError.MISSING_RECAPTCHA_TOKEN */
        ]: "missing-recaptcha-token",
        [
          "INVALID_RECAPTCHA_TOKEN"
          /* ServerError.INVALID_RECAPTCHA_TOKEN */
        ]: "invalid-recaptcha-token",
        [
          "INVALID_RECAPTCHA_ACTION"
          /* ServerError.INVALID_RECAPTCHA_ACTION */
        ]: "invalid-recaptcha-action",
        [
          "MISSING_CLIENT_TYPE"
          /* ServerError.MISSING_CLIENT_TYPE */
        ]: "missing-client-type",
        [
          "MISSING_RECAPTCHA_VERSION"
          /* ServerError.MISSING_RECAPTCHA_VERSION */
        ]: "missing-recaptcha-version",
        [
          "INVALID_RECAPTCHA_VERSION"
          /* ServerError.INVALID_RECAPTCHA_VERSION */
        ]: "invalid-recaptcha-version",
        [
          "INVALID_REQ_TYPE"
          /* ServerError.INVALID_REQ_TYPE */
        ]: "invalid-req-type"
        /* AuthErrorCode.INVALID_REQ_TYPE */
      };
      CookieAuthProxiedEndpoints = [
        "/v1/accounts:signInWithCustomToken",
        "/v1/accounts:signInWithEmailLink",
        "/v1/accounts:signInWithIdp",
        "/v1/accounts:signInWithPassword",
        "/v1/accounts:signInWithPhoneNumber",
        "/v1/token"
        /* Endpoint.TOKEN */
      ];
      DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
      NetworkTimeout = class {
        clearNetworkTimeout() {
          clearTimeout(this.timer);
        }
        constructor(auth2) {
          this.auth = auth2;
          this.timer = null;
          this.promise = new Promise((_2, reject) => {
            this.timer = setTimeout(() => {
              return reject(_createError(
                this.auth,
                "network-request-failed"
                /* AuthErrorCode.NETWORK_REQUEST_FAILED */
              ));
            }, DEFAULT_API_TIMEOUT_MS.get());
          });
        }
      };
      RecaptchaConfig = class {
        constructor(response) {
          this.siteKey = "";
          this.recaptchaEnforcementState = [];
          if (response.recaptchaKey === void 0) {
            throw new Error("recaptchaKey undefined");
          }
          this.siteKey = response.recaptchaKey.split("/")[3];
          this.recaptchaEnforcementState = response.recaptchaEnforcementState;
        }
        /**
         * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
         *
         * @param providerStr - The provider whose enforcement state is to be returned.
         * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
         */
        getProviderEnforcementState(providerStr) {
          if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
            return null;
          }
          for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
            if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
              return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
            }
          }
          return null;
        }
        /**
         * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
         *
         * @param providerStr - The provider whose enablement state is to be returned.
         * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
         */
        isProviderEnabled(providerStr) {
          return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
        }
        /**
         * Returns true if reCAPTCHA Enterprise protection is enabled in at least one provider, otherwise
         * returns false.
         *
         * @returns Whether or not reCAPTCHA Enterprise protection is enabled for at least one provider.
         */
        isAnyProviderEnabled() {
          return this.isProviderEnabled(
            "EMAIL_PASSWORD_PROVIDER"
            /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
          ) || this.isProviderEnabled(
            "PHONE_PROVIDER"
            /* RecaptchaAuthProvider.PHONE_PROVIDER */
          );
        }
      };
      ProactiveRefresh = class {
        constructor(user) {
          this.user = user;
          this.isRunning = false;
          this.timerId = null;
          this.errorBackoff = 3e4;
        }
        _start() {
          if (this.isRunning) {
            return;
          }
          this.isRunning = true;
          this.schedule();
        }
        _stop() {
          if (!this.isRunning) {
            return;
          }
          this.isRunning = false;
          if (this.timerId !== null) {
            clearTimeout(this.timerId);
          }
        }
        getInterval(wasError) {
          if (wasError) {
            const interval = this.errorBackoff;
            this.errorBackoff = Math.min(
              this.errorBackoff * 2,
              96e4
              /* Duration.RETRY_BACKOFF_MAX */
            );
            return interval;
          } else {
            this.errorBackoff = 3e4;
            const expTime = this.user.stsTokenManager.expirationTime ?? 0;
            const interval = expTime - Date.now() - 3e5;
            return Math.max(0, interval);
          }
        }
        schedule(wasError = false) {
          if (!this.isRunning) {
            return;
          }
          const interval = this.getInterval(wasError);
          this.timerId = setTimeout(async () => {
            await this.iteration();
          }, interval);
        }
        async iteration() {
          try {
            await this.user.getIdToken(true);
          } catch (e) {
            if (e?.code === `auth/${"network-request-failed"}`) {
              this.schedule(
                /* wasError */
                true
              );
            }
            return;
          }
          this.schedule();
        }
      };
      UserMetadata = class {
        constructor(createdAt, lastLoginAt) {
          this.createdAt = createdAt;
          this.lastLoginAt = lastLoginAt;
          this._initializeTime();
        }
        _initializeTime() {
          this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
          this.creationTime = utcTimestampToDateString(this.createdAt);
        }
        _copy(metadata) {
          this.createdAt = metadata.createdAt;
          this.lastLoginAt = metadata.lastLoginAt;
          this._initializeTime();
        }
        toJSON() {
          return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
          };
        }
      };
      StsTokenManager = class _StsTokenManager {
        constructor() {
          this.refreshToken = null;
          this.accessToken = null;
          this.expirationTime = null;
        }
        get isExpired() {
          return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
        }
        updateFromServerResponse(response) {
          _assert(
            response.idToken,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          _assert(
            typeof response.idToken !== "undefined",
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          _assert(
            typeof response.refreshToken !== "undefined",
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
          this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
        }
        updateFromIdToken(idToken) {
          _assert(
            idToken.length !== 0,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const expiresIn = _tokenExpiresIn(idToken);
          this.updateTokensAndExpiration(idToken, null, expiresIn);
        }
        async getToken(auth2, forceRefresh = false) {
          if (!forceRefresh && this.accessToken && !this.isExpired) {
            return this.accessToken;
          }
          _assert(
            this.refreshToken,
            auth2,
            "user-token-expired"
            /* AuthErrorCode.TOKEN_EXPIRED */
          );
          if (this.refreshToken) {
            await this.refresh(auth2, this.refreshToken);
            return this.accessToken;
          }
          return null;
        }
        clearRefreshToken() {
          this.refreshToken = null;
        }
        async refresh(auth2, oldToken) {
          const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth2, oldToken);
          this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
        }
        updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
          this.refreshToken = refreshToken || null;
          this.accessToken = accessToken || null;
          this.expirationTime = Date.now() + expiresInSec * 1e3;
        }
        static fromJSON(appName, object) {
          const { refreshToken, accessToken, expirationTime } = object;
          const manager = new _StsTokenManager();
          if (refreshToken) {
            _assert(typeof refreshToken === "string", "internal-error", {
              appName
            });
            manager.refreshToken = refreshToken;
          }
          if (accessToken) {
            _assert(typeof accessToken === "string", "internal-error", {
              appName
            });
            manager.accessToken = accessToken;
          }
          if (expirationTime) {
            _assert(typeof expirationTime === "number", "internal-error", {
              appName
            });
            manager.expirationTime = expirationTime;
          }
          return manager;
        }
        toJSON() {
          return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
          };
        }
        _assign(stsTokenManager) {
          this.accessToken = stsTokenManager.accessToken;
          this.refreshToken = stsTokenManager.refreshToken;
          this.expirationTime = stsTokenManager.expirationTime;
        }
        _clone() {
          return Object.assign(new _StsTokenManager(), this.toJSON());
        }
        _performRefresh() {
          return debugFail("not implemented");
        }
      };
      UserImpl = class _UserImpl {
        constructor({ uid, auth: auth2, stsTokenManager, ...opt }) {
          this.providerId = "firebase";
          this.proactiveRefresh = new ProactiveRefresh(this);
          this.reloadUserInfo = null;
          this.reloadListener = null;
          this.uid = uid;
          this.auth = auth2;
          this.stsTokenManager = stsTokenManager;
          this.accessToken = stsTokenManager.accessToken;
          this.displayName = opt.displayName || null;
          this.email = opt.email || null;
          this.emailVerified = opt.emailVerified || false;
          this.phoneNumber = opt.phoneNumber || null;
          this.photoURL = opt.photoURL || null;
          this.isAnonymous = opt.isAnonymous || false;
          this.tenantId = opt.tenantId || null;
          this.providerData = opt.providerData ? [...opt.providerData] : [];
          this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
        }
        async getIdToken(forceRefresh) {
          const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
          _assert(
            accessToken,
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          if (this.accessToken !== accessToken) {
            this.accessToken = accessToken;
            await this.auth._persistUserIfCurrent(this);
            this.auth._notifyListenersIfCurrent(this);
          }
          return accessToken;
        }
        getIdTokenResult(forceRefresh) {
          return getIdTokenResult(this, forceRefresh);
        }
        reload() {
          return reload(this);
        }
        _assign(user) {
          if (this === user) {
            return;
          }
          _assert(
            this.uid === user.uid,
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          this.displayName = user.displayName;
          this.photoURL = user.photoURL;
          this.email = user.email;
          this.emailVerified = user.emailVerified;
          this.phoneNumber = user.phoneNumber;
          this.isAnonymous = user.isAnonymous;
          this.tenantId = user.tenantId;
          this.providerData = user.providerData.map((userInfo) => ({ ...userInfo }));
          this.metadata._copy(user.metadata);
          this.stsTokenManager._assign(user.stsTokenManager);
        }
        _clone(auth2) {
          const newUser = new _UserImpl({
            ...this,
            auth: auth2,
            stsTokenManager: this.stsTokenManager._clone()
          });
          newUser.metadata._copy(this.metadata);
          return newUser;
        }
        _onReload(callback) {
          _assert(
            !this.reloadListener,
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          this.reloadListener = callback;
          if (this.reloadUserInfo) {
            this._notifyReloadListener(this.reloadUserInfo);
            this.reloadUserInfo = null;
          }
        }
        _notifyReloadListener(userInfo) {
          if (this.reloadListener) {
            this.reloadListener(userInfo);
          } else {
            this.reloadUserInfo = userInfo;
          }
        }
        _startProactiveRefresh() {
          this.proactiveRefresh._start();
        }
        _stopProactiveRefresh() {
          this.proactiveRefresh._stop();
        }
        async _updateTokensIfNecessary(response, reload2 = false) {
          let tokensRefreshed = false;
          if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
            this.stsTokenManager.updateFromServerResponse(response);
            tokensRefreshed = true;
          }
          if (reload2) {
            await _reloadWithoutSaving(this);
          }
          await this.auth._persistUserIfCurrent(this);
          if (tokensRefreshed) {
            this.auth._notifyListenersIfCurrent(this);
          }
        }
        async delete() {
          if (_isFirebaseServerApp(this.auth.app)) {
            return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
          }
          const idToken = await this.getIdToken();
          await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
          this.stsTokenManager.clearRefreshToken();
          return this.auth.signOut();
        }
        toJSON() {
          return {
            uid: this.uid,
            email: this.email || void 0,
            emailVerified: this.emailVerified,
            displayName: this.displayName || void 0,
            isAnonymous: this.isAnonymous,
            photoURL: this.photoURL || void 0,
            phoneNumber: this.phoneNumber || void 0,
            tenantId: this.tenantId || void 0,
            providerData: this.providerData.map((userInfo) => ({ ...userInfo })),
            stsTokenManager: this.stsTokenManager.toJSON(),
            // Redirect event ID must be maintained in case there is a pending
            // redirect event.
            _redirectEventId: this._redirectEventId,
            ...this.metadata.toJSON(),
            // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
            apiKey: this.auth.config.apiKey,
            appName: this.auth.name
            // Missing authDomain will be tolerated by the legacy SDK.
            // stsTokenManager.apiKey isn't actually required (despite the legacy SDK persisting it).
          };
        }
        get refreshToken() {
          return this.stsTokenManager.refreshToken || "";
        }
        static _fromJSON(auth2, object) {
          const displayName = object.displayName ?? void 0;
          const email = object.email ?? void 0;
          const phoneNumber = object.phoneNumber ?? void 0;
          const photoURL = object.photoURL ?? void 0;
          const tenantId = object.tenantId ?? void 0;
          const _redirectEventId = object._redirectEventId ?? void 0;
          const createdAt = object.createdAt ?? void 0;
          const lastLoginAt = object.lastLoginAt ?? void 0;
          const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
          _assert(
            uid && plainObjectTokenManager,
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
          _assert(
            typeof uid === "string",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          assertStringOrUndefined(displayName, auth2.name);
          assertStringOrUndefined(email, auth2.name);
          _assert(
            typeof emailVerified === "boolean",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          _assert(
            typeof isAnonymous === "boolean",
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          assertStringOrUndefined(phoneNumber, auth2.name);
          assertStringOrUndefined(photoURL, auth2.name);
          assertStringOrUndefined(tenantId, auth2.name);
          assertStringOrUndefined(_redirectEventId, auth2.name);
          assertStringOrUndefined(createdAt, auth2.name);
          assertStringOrUndefined(lastLoginAt, auth2.name);
          const user = new _UserImpl({
            uid,
            auth: auth2,
            email,
            emailVerified,
            displayName,
            isAnonymous,
            photoURL,
            phoneNumber,
            tenantId,
            stsTokenManager,
            createdAt,
            lastLoginAt
          });
          if (providerData && Array.isArray(providerData)) {
            user.providerData = providerData.map((userInfo) => ({ ...userInfo }));
          }
          if (_redirectEventId) {
            user._redirectEventId = _redirectEventId;
          }
          return user;
        }
        /**
         * Initialize a User from an idToken server response
         * @param auth
         * @param idTokenResponse
         */
        static async _fromIdTokenResponse(auth2, idTokenResponse, isAnonymous = false) {
          const stsTokenManager = new StsTokenManager();
          stsTokenManager.updateFromServerResponse(idTokenResponse);
          const user = new _UserImpl({
            uid: idTokenResponse.localId,
            auth: auth2,
            stsTokenManager,
            isAnonymous
          });
          await _reloadWithoutSaving(user);
          return user;
        }
        /**
         * Initialize a User from an idToken server response
         * @param auth
         * @param idTokenResponse
         */
        static async _fromGetAccountInfoResponse(auth2, response, idToken) {
          const coreAccount = response.users[0];
          _assert(
            coreAccount.localId !== void 0,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
          const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length;
          const stsTokenManager = new StsTokenManager();
          stsTokenManager.updateFromIdToken(idToken);
          const user = new _UserImpl({
            uid: coreAccount.localId,
            auth: auth2,
            stsTokenManager,
            isAnonymous
          });
          const updates = {
            uid: coreAccount.localId,
            displayName: coreAccount.displayName || null,
            photoURL: coreAccount.photoUrl || null,
            email: coreAccount.email || null,
            emailVerified: coreAccount.emailVerified || false,
            phoneNumber: coreAccount.phoneNumber || null,
            tenantId: coreAccount.tenantId || null,
            providerData,
            metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
            isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !providerData?.length
          };
          Object.assign(user, updates);
          return user;
        }
      };
      instanceCache = /* @__PURE__ */ new Map();
      InMemoryPersistence = class {
        constructor() {
          this.type = "NONE";
          this.storage = {};
        }
        async _isAvailable() {
          return true;
        }
        async _set(key, value) {
          this.storage[key] = value;
        }
        async _get(key) {
          const value = this.storage[key];
          return value === void 0 ? null : value;
        }
        async _remove(key) {
          delete this.storage[key];
        }
        _addListener(_key, _listener) {
          return;
        }
        _removeListener(_key, _listener) {
          return;
        }
      };
      InMemoryPersistence.type = "NONE";
      inMemoryPersistence = InMemoryPersistence;
      PersistenceUserManager = class _PersistenceUserManager {
        constructor(persistence, auth2, userKey) {
          this.persistence = persistence;
          this.auth = auth2;
          this.userKey = userKey;
          const { config, name: name4 } = this.auth;
          this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name4);
          this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name4);
          this.boundEventHandler = auth2._onStorageEvent.bind(auth2);
          try {
            this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
          } catch {
          }
        }
        setCurrentUser(user) {
          return this.persistence._set(this.fullUserKey, user.toJSON());
        }
        async getCurrentUser() {
          const blob = await this.persistence._get(this.fullUserKey);
          if (!blob) {
            return null;
          }
          if (typeof blob === "string") {
            const response = await getAccountInfo(this.auth, { idToken: blob }).catch(() => void 0);
            if (!response) {
              return null;
            }
            return UserImpl._fromGetAccountInfoResponse(this.auth, response, blob);
          }
          return UserImpl._fromJSON(this.auth, blob);
        }
        removeCurrentUser() {
          return this.persistence._remove(this.fullUserKey);
        }
        savePersistenceForRedirect() {
          return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
        }
        async setPersistence(newPersistence) {
          if (this.persistence === newPersistence) {
            return;
          }
          const currentUser = await this.getCurrentUser();
          await this.removeCurrentUser();
          this.persistence = newPersistence;
          if (currentUser) {
            return this.setCurrentUser(currentUser);
          }
        }
        delete() {
          try {
            this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
          } catch {
          }
        }
        static async create(auth2, persistenceHierarchy, userKey = "authUser") {
          if (!persistenceHierarchy.length) {
            return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth2, userKey);
          }
          const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
            try {
              if (await persistence._isAvailable()) {
                return persistence;
              }
            } catch {
              return void 0;
            }
            return void 0;
          }))).filter((persistence) => persistence);
          let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
          const key = _persistenceKeyName(userKey, auth2.config.apiKey, auth2.name);
          let userToMigrate = null;
          for (const persistence of persistenceHierarchy) {
            try {
              const blob = await persistence._get(key);
              if (blob) {
                let user;
                if (typeof blob === "string") {
                  const response = await getAccountInfo(auth2, {
                    idToken: blob
                  }).catch(() => void 0);
                  if (!response) {
                    break;
                  }
                  user = await UserImpl._fromGetAccountInfoResponse(auth2, response, blob);
                } else {
                  user = UserImpl._fromJSON(auth2, blob);
                }
                if (persistence !== selectedPersistence) {
                  userToMigrate = user;
                }
                selectedPersistence = persistence;
                break;
              }
            } catch {
            }
          }
          const migrationHierarchy = availablePersistences.filter((p2) => p2._shouldAllowMigration);
          if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
            return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
          }
          selectedPersistence = migrationHierarchy[0];
          if (userToMigrate) {
            await selectedPersistence._set(key, userToMigrate.toJSON());
          }
          await Promise.all(persistenceHierarchy.map(async (persistence) => {
            if (persistence !== selectedPersistence) {
              try {
                await persistence._remove(key);
              } catch {
              }
            }
          }));
          return new _PersistenceUserManager(selectedPersistence, auth2, userKey);
        }
      };
      AuthMiddlewareQueue = class {
        constructor(auth2) {
          this.auth = auth2;
          this.queue = [];
        }
        pushCallback(callback, onAbort) {
          const wrappedCallback = (user) => new Promise((resolve, reject) => {
            try {
              const result = callback(user);
              resolve(result);
            } catch (e) {
              reject(e);
            }
          });
          wrappedCallback.onAbort = onAbort;
          this.queue.push(wrappedCallback);
          const index = this.queue.length - 1;
          return () => {
            this.queue[index] = () => Promise.resolve();
          };
        }
        async runMiddleware(nextUser) {
          if (this.auth.currentUser === nextUser) {
            return;
          }
          const onAbortStack = [];
          try {
            for (const beforeStateCallback of this.queue) {
              await beforeStateCallback(nextUser);
              if (beforeStateCallback.onAbort) {
                onAbortStack.push(beforeStateCallback.onAbort);
              }
            }
          } catch (e) {
            onAbortStack.reverse();
            for (const onAbort of onAbortStack) {
              try {
                onAbort();
              } catch (_2) {
              }
            }
            throw this.auth._errorFactory.create("login-blocked", {
              originalMessage: e?.message
            });
          }
        }
      };
      MINIMUM_MIN_PASSWORD_LENGTH = 6;
      PasswordPolicyImpl = class {
        constructor(response) {
          const responseOptions = response.customStrengthOptions;
          this.customStrengthOptions = {};
          this.customStrengthOptions.minPasswordLength = responseOptions.minPasswordLength ?? MINIMUM_MIN_PASSWORD_LENGTH;
          if (responseOptions.maxPasswordLength) {
            this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
          }
          if (responseOptions.containsLowercaseCharacter !== void 0) {
            this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
          }
          if (responseOptions.containsUppercaseCharacter !== void 0) {
            this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
          }
          if (responseOptions.containsNumericCharacter !== void 0) {
            this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
          }
          if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
            this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
          }
          this.enforcementState = response.enforcementState;
          if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
            this.enforcementState = "OFF";
          }
          this.allowedNonAlphanumericCharacters = response.allowedNonAlphanumericCharacters?.join("") ?? "";
          this.forceUpgradeOnSignin = response.forceUpgradeOnSignin ?? false;
          this.schemaVersion = response.schemaVersion;
        }
        validatePassword(password) {
          const status = {
            isValid: true,
            passwordPolicy: this
          };
          this.validatePasswordLengthOptions(password, status);
          this.validatePasswordCharacterOptions(password, status);
          status.isValid && (status.isValid = status.meetsMinPasswordLength ?? true);
          status.isValid && (status.isValid = status.meetsMaxPasswordLength ?? true);
          status.isValid && (status.isValid = status.containsLowercaseLetter ?? true);
          status.isValid && (status.isValid = status.containsUppercaseLetter ?? true);
          status.isValid && (status.isValid = status.containsNumericCharacter ?? true);
          status.isValid && (status.isValid = status.containsNonAlphanumericCharacter ?? true);
          return status;
        }
        /**
         * Validates that the password meets the length options for the policy.
         *
         * @param password Password to validate.
         * @param status Validation status.
         */
        validatePasswordLengthOptions(password, status) {
          const minPasswordLength = this.customStrengthOptions.minPasswordLength;
          const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
          if (minPasswordLength) {
            status.meetsMinPasswordLength = password.length >= minPasswordLength;
          }
          if (maxPasswordLength) {
            status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
          }
        }
        /**
         * Validates that the password meets the character options for the policy.
         *
         * @param password Password to validate.
         * @param status Validation status.
         */
        validatePasswordCharacterOptions(password, status) {
          this.updatePasswordCharacterOptionsStatuses(
            status,
            /* containsLowercaseCharacter= */
            false,
            /* containsUppercaseCharacter= */
            false,
            /* containsNumericCharacter= */
            false,
            /* containsNonAlphanumericCharacter= */
            false
          );
          let passwordChar;
          for (let i = 0; i < password.length; i++) {
            passwordChar = password.charAt(i);
            this.updatePasswordCharacterOptionsStatuses(
              status,
              /* containsLowercaseCharacter= */
              passwordChar >= "a" && passwordChar <= "z",
              /* containsUppercaseCharacter= */
              passwordChar >= "A" && passwordChar <= "Z",
              /* containsNumericCharacter= */
              passwordChar >= "0" && passwordChar <= "9",
              /* containsNonAlphanumericCharacter= */
              this.allowedNonAlphanumericCharacters.includes(passwordChar)
            );
          }
        }
        /**
         * Updates the running validation status with the statuses for the character options.
         * Expected to be called each time a character is processed to update each option status
         * based on the current character.
         *
         * @param status Validation status.
         * @param containsLowercaseCharacter Whether the character is a lowercase letter.
         * @param containsUppercaseCharacter Whether the character is an uppercase letter.
         * @param containsNumericCharacter Whether the character is a numeric character.
         * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
         */
        updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
          if (this.customStrengthOptions.containsLowercaseLetter) {
            status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
          }
          if (this.customStrengthOptions.containsUppercaseLetter) {
            status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
          }
          if (this.customStrengthOptions.containsNumericCharacter) {
            status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
          }
          if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
            status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
          }
        }
      };
      AuthImpl = class {
        constructor(app2, heartbeatServiceProvider, appCheckServiceProvider, config) {
          this.app = app2;
          this.heartbeatServiceProvider = heartbeatServiceProvider;
          this.appCheckServiceProvider = appCheckServiceProvider;
          this.config = config;
          this.currentUser = null;
          this.emulatorConfig = null;
          this.operations = Promise.resolve();
          this.authStateSubscription = new Subscription(this);
          this.idTokenSubscription = new Subscription(this);
          this.beforeStateQueue = new AuthMiddlewareQueue(this);
          this.redirectUser = null;
          this.isProactiveRefreshEnabled = false;
          this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
          this._canInitEmulator = true;
          this._isInitialized = false;
          this._deleted = false;
          this._initializationPromise = null;
          this._popupRedirectResolver = null;
          this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
          this._agentRecaptchaConfig = null;
          this._tenantRecaptchaConfigs = {};
          this._projectPasswordPolicy = null;
          this._tenantPasswordPolicies = {};
          this._resolvePersistenceManagerAvailable = void 0;
          this.lastNotifiedUid = void 0;
          this.languageCode = null;
          this.tenantId = null;
          this.settings = { appVerificationDisabledForTesting: false };
          this.frameworks = [];
          this.name = app2.name;
          this.clientVersion = config.sdkClientVersion;
          this._persistenceManagerAvailable = new Promise((resolve) => this._resolvePersistenceManagerAvailable = resolve);
        }
        _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
          if (popupRedirectResolver) {
            this._popupRedirectResolver = _getInstance(popupRedirectResolver);
          }
          this._initializationPromise = this.queue(async () => {
            if (this._deleted) {
              return;
            }
            try {
              this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
            } catch (e) {
              _logWarn(`Failed to initialize persistence: ${e}`);
              this.persistenceManager = await PersistenceUserManager.create(this, []);
            } finally {
              this._resolvePersistenceManagerAvailable?.();
            }
            if (this._deleted) {
              return;
            }
            if (this._popupRedirectResolver?._shouldInitProactively) {
              try {
                await this._popupRedirectResolver._initialize(this);
              } catch (e) {
              }
            }
            try {
              await this.initializeCurrentUser(popupRedirectResolver);
            } catch (e) {
              _logWarn(`Failed to initialize current user: ${e}`);
              await this.directlySetCurrentUser(null).catch(() => {
              });
            }
            this.lastNotifiedUid = this.currentUser?.uid || null;
            if (this._deleted) {
              return;
            }
            this._isInitialized = true;
          });
          return this._initializationPromise;
        }
        /**
         * If the persistence is changed in another window, the user manager will let us know
         */
        async _onStorageEvent() {
          if (this._deleted) {
            return;
          }
          const user = await this.assertedPersistence.getCurrentUser();
          if (!this.currentUser && !user) {
            return;
          }
          if (this.currentUser && user && this.currentUser.uid === user.uid) {
            this._currentUser._assign(user);
            await this.currentUser.getIdToken();
            return;
          }
          await this._updateCurrentUser(
            user,
            /* skipBeforeStateCallbacks */
            true
          );
        }
        async initializeCurrentUserFromIdToken(idToken) {
          try {
            const response = await getAccountInfo(this, { idToken });
            const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
            await this.directlySetCurrentUser(user);
          } catch (err) {
            console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
            await this.directlySetCurrentUser(null);
          }
        }
        async initializeCurrentUser(popupRedirectResolver) {
          if (_isFirebaseServerApp(this.app)) {
            const idToken = this.app.settings.authIdToken;
            if (idToken) {
              return new Promise((resolve) => {
                setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
              });
            } else {
              return this.directlySetCurrentUser(null);
            }
          }
          const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
          let futureCurrentUser = previouslyStoredUser;
          let needsTocheckMiddleware = false;
          if (popupRedirectResolver && this.config.authDomain) {
            await this.getOrInitRedirectPersistenceManager();
            const redirectUserEventId = this.redirectUser?._redirectEventId;
            const storedUserEventId = futureCurrentUser?._redirectEventId;
            const result = await this.tryRedirectSignIn(popupRedirectResolver);
            if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && result?.user) {
              futureCurrentUser = result.user;
              needsTocheckMiddleware = true;
            }
          }
          if (!futureCurrentUser) {
            return this.directlySetCurrentUser(null);
          }
          if (!futureCurrentUser._redirectEventId) {
            if (needsTocheckMiddleware) {
              try {
                await this.beforeStateQueue.runMiddleware(futureCurrentUser);
              } catch (e) {
                futureCurrentUser = previouslyStoredUser;
                this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
              }
            }
            if (futureCurrentUser) {
              return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
            } else {
              return this.directlySetCurrentUser(null);
            }
          }
          _assert(
            this._popupRedirectResolver,
            this,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          await this.getOrInitRedirectPersistenceManager();
          if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
            return this.directlySetCurrentUser(futureCurrentUser);
          }
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        }
        async tryRedirectSignIn(redirectResolver) {
          let result = null;
          try {
            result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
          } catch (e) {
            await this._setRedirectUser(null);
          }
          return result;
        }
        async reloadAndSetCurrentUserOrClear(user) {
          try {
            await _reloadWithoutSaving(user);
          } catch (e) {
            if (_isUserInvalidated(e)) {
              return this.directlySetCurrentUser(null);
            }
          }
          return this.directlySetCurrentUser(user);
        }
        useDeviceLanguage() {
          this.languageCode = _getUserLanguage();
        }
        async _delete() {
          this._deleted = true;
        }
        async updateCurrentUser(userExtern) {
          if (_isFirebaseServerApp(this.app)) {
            return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
          }
          const user = userExtern ? getModularInstance(userExtern) : null;
          if (user) {
            _assert(
              user.auth.config.apiKey === this.config.apiKey,
              this,
              "invalid-user-token"
              /* AuthErrorCode.INVALID_AUTH */
            );
          }
          return this._updateCurrentUser(user && user._clone(this));
        }
        async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
          if (this._deleted) {
            return;
          }
          if (user) {
            _assert(
              this.tenantId === user.tenantId,
              this,
              "tenant-id-mismatch"
              /* AuthErrorCode.TENANT_ID_MISMATCH */
            );
          }
          if (!skipBeforeStateCallbacks) {
            await this.beforeStateQueue.runMiddleware(user);
          }
          return this.queue(async () => {
            await this.directlySetCurrentUser(user);
            this.notifyAuthListeners();
          });
        }
        async signOut() {
          if (_isFirebaseServerApp(this.app)) {
            return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
          }
          await this.beforeStateQueue.runMiddleware(null);
          if (this.redirectPersistenceManager || this._popupRedirectResolver) {
            await this._setRedirectUser(null);
          }
          return this._updateCurrentUser(
            null,
            /* skipBeforeStateCallbacks */
            true
          );
        }
        setPersistence(persistence) {
          if (_isFirebaseServerApp(this.app)) {
            return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
          }
          return this.queue(async () => {
            await this.assertedPersistence.setPersistence(_getInstance(persistence));
          });
        }
        _getRecaptchaConfig() {
          if (this.tenantId == null) {
            return this._agentRecaptchaConfig;
          } else {
            return this._tenantRecaptchaConfigs[this.tenantId];
          }
        }
        async validatePassword(password) {
          if (!this._getPasswordPolicyInternal()) {
            await this._updatePasswordPolicy();
          }
          const passwordPolicy = this._getPasswordPolicyInternal();
          if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
            return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
          }
          return passwordPolicy.validatePassword(password);
        }
        _getPasswordPolicyInternal() {
          if (this.tenantId === null) {
            return this._projectPasswordPolicy;
          } else {
            return this._tenantPasswordPolicies[this.tenantId];
          }
        }
        async _updatePasswordPolicy() {
          const response = await _getPasswordPolicy(this);
          const passwordPolicy = new PasswordPolicyImpl(response);
          if (this.tenantId === null) {
            this._projectPasswordPolicy = passwordPolicy;
          } else {
            this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
          }
        }
        _getPersistenceType() {
          return this.assertedPersistence.persistence.type;
        }
        _getPersistence() {
          return this.assertedPersistence.persistence;
        }
        _updateErrorMap(errorMap) {
          this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
        }
        onAuthStateChanged(nextOrObserver, error, completed) {
          return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
        }
        beforeAuthStateChanged(callback, onAbort) {
          return this.beforeStateQueue.pushCallback(callback, onAbort);
        }
        onIdTokenChanged(nextOrObserver, error, completed) {
          return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
        }
        authStateReady() {
          return new Promise((resolve, reject) => {
            if (this.currentUser) {
              resolve();
            } else {
              const unsubscribe = this.onAuthStateChanged(() => {
                unsubscribe();
                resolve();
              }, reject);
            }
          });
        }
        /**
         * Revokes the given access token. Currently only supports Apple OAuth access tokens.
         */
        async revokeAccessToken(token) {
          if (this.currentUser) {
            const idToken = await this.currentUser.getIdToken();
            const request = {
              providerId: "apple.com",
              tokenType: "ACCESS_TOKEN",
              token,
              idToken
            };
            if (this.tenantId != null) {
              request.tenantId = this.tenantId;
            }
            await revokeToken(this, request);
          }
        }
        toJSON() {
          return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: this._currentUser?.toJSON()
          };
        }
        async _setRedirectUser(user, popupRedirectResolver) {
          const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
          return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
        }
        async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
          if (!this.redirectPersistenceManager) {
            const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
            _assert(
              resolver,
              this,
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
            this.redirectPersistenceManager = await PersistenceUserManager.create(
              this,
              [_getInstance(resolver._redirectPersistence)],
              "redirectUser"
              /* KeyName.REDIRECT_USER */
            );
            this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
          }
          return this.redirectPersistenceManager;
        }
        async _redirectUserForId(id) {
          if (this._isInitialized) {
            await this.queue(async () => {
            });
          }
          if (this._currentUser?._redirectEventId === id) {
            return this._currentUser;
          }
          if (this.redirectUser?._redirectEventId === id) {
            return this.redirectUser;
          }
          return null;
        }
        async _persistUserIfCurrent(user) {
          if (user === this.currentUser) {
            return this.queue(async () => this.directlySetCurrentUser(user));
          }
        }
        /** Notifies listeners only if the user is current */
        _notifyListenersIfCurrent(user) {
          if (user === this.currentUser) {
            this.notifyAuthListeners();
          }
        }
        _key() {
          return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
        }
        _startProactiveRefresh() {
          this.isProactiveRefreshEnabled = true;
          if (this.currentUser) {
            this._currentUser._startProactiveRefresh();
          }
        }
        _stopProactiveRefresh() {
          this.isProactiveRefreshEnabled = false;
          if (this.currentUser) {
            this._currentUser._stopProactiveRefresh();
          }
        }
        /** Returns the current user cast as the internal type */
        get _currentUser() {
          return this.currentUser;
        }
        notifyAuthListeners() {
          if (!this._isInitialized) {
            return;
          }
          this.idTokenSubscription.next(this.currentUser);
          const currentUid = this.currentUser?.uid ?? null;
          if (this.lastNotifiedUid !== currentUid) {
            this.lastNotifiedUid = currentUid;
            this.authStateSubscription.next(this.currentUser);
          }
        }
        registerStateListener(subscription, nextOrObserver, error, completed) {
          if (this._deleted) {
            return () => {
            };
          }
          const cb = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
          let isUnsubscribed = false;
          const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
          _assert(
            promise,
            this,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          promise.then(() => {
            if (isUnsubscribed) {
              return;
            }
            cb(this.currentUser);
          }).catch((err) => {
            if (isUnsubscribed) {
              return;
            }
            if (typeof nextOrObserver !== "function" && nextOrObserver.error) {
              nextOrObserver.error(err);
            } else if (error) {
              error(err);
            } else {
              throw err;
            }
          });
          if (typeof nextOrObserver === "function") {
            const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
            return () => {
              isUnsubscribed = true;
              unsubscribe();
            };
          } else {
            const unsubscribe = subscription.addObserver(nextOrObserver);
            return () => {
              isUnsubscribed = true;
              unsubscribe();
            };
          }
        }
        /**
         * Unprotected (from race conditions) method to set the current user. This
         * should only be called from within a queued callback. This is necessary
         * because the queue shouldn't rely on another queued callback.
         */
        async directlySetCurrentUser(user) {
          if (this.currentUser && this.currentUser !== user) {
            this._currentUser._stopProactiveRefresh();
          }
          if (user && this.isProactiveRefreshEnabled) {
            user._startProactiveRefresh();
          }
          this.currentUser = user;
          if (this.persistenceManager) {
            try {
              if (user) {
                await this.persistenceManager.setCurrentUser(user);
              } else {
                await this.persistenceManager.removeCurrentUser();
              }
            } catch (e) {
              const originalMessage = e?.message || String(e);
              const error = _errorWithCustomMessage(this, "internal-error", `An internal AuthError has occurred: ${originalMessage}`);
              error.customData = { originalError: e };
              throw error;
            }
          }
        }
        queue(action) {
          this.operations = this.operations.then(action, action);
          return this.operations;
        }
        get assertedPersistence() {
          _assert(
            this.persistenceManager,
            this,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          return this.persistenceManager;
        }
        _logFramework(framework) {
          if (!framework || this.frameworks.includes(framework)) {
            return;
          }
          this.frameworks.push(framework);
          this.frameworks.sort();
          this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
        }
        _getFrameworks() {
          return this.frameworks;
        }
        async _getAdditionalHeaders() {
          const headers = {
            [
              "X-Client-Version"
              /* HttpHeader.X_CLIENT_VERSION */
            ]: this.clientVersion
          };
          if (this.app.options.appId) {
            headers[
              "X-Firebase-gmpid"
              /* HttpHeader.X_FIREBASE_GMPID */
            ] = this.app.options.appId;
          }
          const heartbeatsHeader = await this.heartbeatServiceProvider.getImmediate({
            optional: true
          })?.getHeartbeatsHeader();
          if (heartbeatsHeader) {
            headers[
              "X-Firebase-Client"
              /* HttpHeader.X_FIREBASE_CLIENT */
            ] = heartbeatsHeader;
          }
          const appCheckToken = await this._getAppCheckToken();
          if (appCheckToken) {
            headers[
              "X-Firebase-AppCheck"
              /* HttpHeader.X_FIREBASE_APP_CHECK */
            ] = appCheckToken;
          }
          return headers;
        }
        async _getAppCheckToken() {
          if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
            return this.app.settings.appCheckToken;
          }
          const appCheckTokenResult = await this.appCheckServiceProvider.getImmediate({ optional: true })?.getToken();
          if (appCheckTokenResult?.error) {
            _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
          }
          return appCheckTokenResult?.token;
        }
      };
      Subscription = class {
        constructor(auth2) {
          this.auth = auth2;
          this.observer = null;
          this.addObserver = createSubscribe((observer) => this.observer = observer);
        }
        get next() {
          _assert(
            this.observer,
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          return this.observer.next.bind(this.observer);
        }
      };
      externalJSProvider = {
        async loadJS() {
          throw new Error("Unable to load external scripts");
        },
        recaptchaV2Script: "",
        recaptchaEnterpriseScript: "",
        gapiScript: ""
      };
      MockGreCAPTCHATopLevel = class {
        constructor() {
          this.enterprise = new MockGreCAPTCHA();
        }
        ready(callback) {
          callback();
        }
        execute(_siteKey, _options) {
          return Promise.resolve("token");
        }
        render(_container, _parameters) {
          return "";
        }
      };
      MockGreCAPTCHA = class {
        ready(callback) {
          callback();
        }
        execute(_siteKey, _options) {
          return Promise.resolve("token");
        }
        render(_container, _parameters) {
          return "";
        }
      };
      RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
      FAKE_TOKEN = "NO_RECAPTCHA";
      RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME = "onFirebaseAuthREInstanceReady";
      RecaptchaEnterpriseVerifier = class _RecaptchaEnterpriseVerifier {
        /**
         *
         * @param authExtern - The corresponding Firebase {@link Auth} instance.
         *
         */
        constructor(authExtern) {
          this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
          this.auth = _castAuth(authExtern);
        }
        /**
         * Executes the verification process.
         *
         * @returns A Promise for a token that can be used to assert the validity of a request.
         */
        async verify(action = "verify", forceRefresh = false) {
          async function retrieveSiteKey(auth2) {
            if (!forceRefresh) {
              if (auth2.tenantId == null && auth2._agentRecaptchaConfig != null) {
                return auth2._agentRecaptchaConfig.siteKey;
              }
              if (auth2.tenantId != null && auth2._tenantRecaptchaConfigs[auth2.tenantId] !== void 0) {
                return auth2._tenantRecaptchaConfigs[auth2.tenantId].siteKey;
              }
            }
            return new Promise(async (resolve, reject) => {
              getRecaptchaConfig(auth2, {
                clientType: "CLIENT_TYPE_WEB",
                version: "RECAPTCHA_ENTERPRISE"
                /* RecaptchaVersion.ENTERPRISE */
              }).then((response) => {
                if (response.recaptchaKey === void 0) {
                  reject(new Error("recaptcha Enterprise site key undefined"));
                } else {
                  const config = new RecaptchaConfig(response);
                  if (auth2.tenantId == null) {
                    auth2._agentRecaptchaConfig = config;
                  } else {
                    auth2._tenantRecaptchaConfigs[auth2.tenantId] = config;
                  }
                  return resolve(config.siteKey);
                }
              }).catch((error) => {
                reject(error);
              });
            });
          }
          function retrieveRecaptchaToken(siteKey, resolve, reject) {
            const grecaptcha = window.grecaptcha;
            if (isEnterprise(grecaptcha)) {
              grecaptcha.enterprise.ready(() => {
                grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
                  resolve(token);
                }).catch(() => {
                  resolve(FAKE_TOKEN);
                });
              });
            } else {
              reject(Error("No reCAPTCHA enterprise script loaded."));
            }
          }
          if (this.auth.settings.appVerificationDisabledForTesting) {
            const mockRecaptcha = new MockGreCAPTCHATopLevel();
            return mockRecaptcha.execute("siteKey", { action: "verify" });
          }
          return new Promise((resolve, reject) => {
            retrieveSiteKey(this.auth).then(async (siteKey) => {
              if (!forceRefresh && isEnterprise(window.grecaptcha) && // If download has already been initiated, do not trigger another
              // download, await the promise here.
              _RecaptchaEnterpriseVerifier.scriptInjectionDeferred) {
                await _RecaptchaEnterpriseVerifier.scriptInjectionDeferred.promise;
                retrieveRecaptchaToken(siteKey, resolve, reject);
              } else {
                if (typeof window === "undefined") {
                  reject(new Error("RecaptchaVerifier is only supported in browser"));
                  return;
                }
                let url = _recaptchaEnterpriseScriptUrl();
                if (url.length !== 0) {
                  url += siteKey + `&onload=${RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME}`;
                }
                _RecaptchaEnterpriseVerifier.scriptInjectionDeferred = new Deferred();
                window[RECAPTCHA_ENTERPRISE_ONLOAD_CALLBACK_NAME] = () => {
                  _RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.resolve();
                };
                _loadJS(url).then(() => _RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.promise).then(() => {
                  retrieveRecaptchaToken(siteKey, resolve, reject);
                }).catch((error) => {
                  reject(error);
                });
              }
            }).catch((error) => {
              reject(error);
            });
          });
        }
      };
      RecaptchaEnterpriseVerifier.scriptInjectionDeferred = null;
      AuthCredential = class {
        /** @internal */
        constructor(providerId, signInMethod) {
          this.providerId = providerId;
          this.signInMethod = signInMethod;
        }
        /**
         * Returns a JSON-serializable representation of this object.
         *
         * @returns a JSON-serializable representation of this object.
         */
        toJSON() {
          return debugFail("not implemented");
        }
        /** @internal */
        _getIdTokenResponse(_auth) {
          return debugFail("not implemented");
        }
        /** @internal */
        _linkToIdToken(_auth, _idToken) {
          return debugFail("not implemented");
        }
        /** @internal */
        _getReauthenticationResolver(_auth) {
          return debugFail("not implemented");
        }
      };
      EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
        /** @internal */
        constructor(_email, _password, signInMethod, _tenantId = null) {
          super("password", signInMethod);
          this._email = _email;
          this._password = _password;
          this._tenantId = _tenantId;
        }
        /** @internal */
        static _fromEmailAndPassword(email, password) {
          return new _EmailAuthCredential(
            email,
            password,
            "password"
            /* SignInMethod.EMAIL_PASSWORD */
          );
        }
        /** @internal */
        static _fromEmailAndCode(email, oobCode, tenantId = null) {
          return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
        }
        /** {@inheritdoc AuthCredential.toJSON} */
        toJSON() {
          return {
            email: this._email,
            password: this._password,
            signInMethod: this.signInMethod,
            tenantId: this._tenantId
          };
        }
        /**
         * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
         *
         * @param json - Either `object` or the stringified representation of the object. When string is
         * provided, `JSON.parse` would be called first.
         *
         * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
         */
        static fromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          if (obj?.email && obj?.password) {
            if (obj.signInMethod === "password") {
              return this._fromEmailAndPassword(obj.email, obj.password);
            } else if (obj.signInMethod === "emailLink") {
              return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
            }
          }
          return null;
        }
        /** @internal */
        async _getIdTokenResponse(auth2) {
          switch (this.signInMethod) {
            case "password":
              const request = {
                returnSecureToken: true,
                email: this._email,
                password: this._password,
                clientType: "CLIENT_TYPE_WEB"
                /* RecaptchaClientType.WEB */
              };
              return handleRecaptchaFlow(
                auth2,
                request,
                "signInWithPassword",
                signInWithPassword,
                "EMAIL_PASSWORD_PROVIDER"
                /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
              );
            case "emailLink":
              return signInWithEmailLink$1(auth2, {
                email: this._email,
                oobCode: this._password
              });
            default:
              _fail(
                auth2,
                "internal-error"
                /* AuthErrorCode.INTERNAL_ERROR */
              );
          }
        }
        /** @internal */
        async _linkToIdToken(auth2, idToken) {
          switch (this.signInMethod) {
            case "password":
              const request = {
                idToken,
                returnSecureToken: true,
                email: this._email,
                password: this._password,
                clientType: "CLIENT_TYPE_WEB"
                /* RecaptchaClientType.WEB */
              };
              return handleRecaptchaFlow(
                auth2,
                request,
                "signUpPassword",
                linkEmailPassword,
                "EMAIL_PASSWORD_PROVIDER"
                /* RecaptchaAuthProvider.EMAIL_PASSWORD_PROVIDER */
              );
            case "emailLink":
              return signInWithEmailLinkForLinking(auth2, {
                idToken,
                email: this._email,
                oobCode: this._password
              });
            default:
              _fail(
                auth2,
                "internal-error"
                /* AuthErrorCode.INTERNAL_ERROR */
              );
          }
        }
        /** @internal */
        _getReauthenticationResolver(auth2) {
          return this._getIdTokenResponse(auth2);
        }
      };
      IDP_REQUEST_URI$1 = "http://localhost";
      OAuthCredential = class _OAuthCredential extends AuthCredential {
        constructor() {
          super(...arguments);
          this.pendingToken = null;
        }
        /** @internal */
        static _fromParams(params) {
          const cred = new _OAuthCredential(params.providerId, params.signInMethod);
          if (params.idToken || params.accessToken) {
            if (params.idToken) {
              cred.idToken = params.idToken;
            }
            if (params.accessToken) {
              cred.accessToken = params.accessToken;
            }
            if (params.nonce && !params.pendingToken) {
              cred.nonce = params.nonce;
            }
            if (params.pendingToken) {
              cred.pendingToken = params.pendingToken;
            }
          } else if (params.oauthToken && params.oauthTokenSecret) {
            cred.accessToken = params.oauthToken;
            cred.secret = params.oauthTokenSecret;
          } else {
            _fail(
              "argument-error"
              /* AuthErrorCode.ARGUMENT_ERROR */
            );
          }
          return cred;
        }
        /** {@inheritdoc AuthCredential.toJSON}  */
        toJSON() {
          return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
          };
        }
        /**
         * Static method to deserialize a JSON representation of an object into an
         * {@link  AuthCredential}.
         *
         * @param json - Input can be either Object or the stringified representation of the object.
         * When string is provided, JSON.parse would be called first.
         *
         * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
         */
        static fromJSON(json) {
          const obj = typeof json === "string" ? JSON.parse(json) : json;
          const { providerId, signInMethod, ...rest } = obj;
          if (!providerId || !signInMethod) {
            return null;
          }
          const cred = new _OAuthCredential(providerId, signInMethod);
          cred.idToken = rest.idToken || void 0;
          cred.accessToken = rest.accessToken || void 0;
          cred.secret = rest.secret;
          cred.nonce = rest.nonce;
          cred.pendingToken = rest.pendingToken || null;
          return cred;
        }
        /** @internal */
        _getIdTokenResponse(auth2) {
          const request = this.buildRequest();
          return signInWithIdp(auth2, request);
        }
        /** @internal */
        _linkToIdToken(auth2, idToken) {
          const request = this.buildRequest();
          request.idToken = idToken;
          return signInWithIdp(auth2, request);
        }
        /** @internal */
        _getReauthenticationResolver(auth2) {
          const request = this.buildRequest();
          request.autoCreate = false;
          return signInWithIdp(auth2, request);
        }
        buildRequest() {
          const request = {
            requestUri: IDP_REQUEST_URI$1,
            returnSecureToken: true
          };
          if (this.pendingToken) {
            request.pendingToken = this.pendingToken;
          } else {
            const postBody = {};
            if (this.idToken) {
              postBody["id_token"] = this.idToken;
            }
            if (this.accessToken) {
              postBody["access_token"] = this.accessToken;
            }
            if (this.secret) {
              postBody["oauth_token_secret"] = this.secret;
            }
            postBody["providerId"] = this.providerId;
            if (this.nonce && !this.pendingToken) {
              postBody["nonce"] = this.nonce;
            }
            request.postBody = querystring(postBody);
          }
          return request;
        }
      };
      ActionCodeURL = class _ActionCodeURL {
        /**
         * @param actionLink - The link from which to extract the URL.
         * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
         *
         * @internal
         */
        constructor(actionLink) {
          const searchParams = querystringDecode(extractQuerystring(actionLink));
          const apiKey = searchParams[
            "apiKey"
            /* QueryField.API_KEY */
          ] ?? null;
          const code = searchParams[
            "oobCode"
            /* QueryField.CODE */
          ] ?? null;
          const operation = parseMode(searchParams[
            "mode"
            /* QueryField.MODE */
          ] ?? null);
          _assert(
            apiKey && code && operation,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          this.apiKey = apiKey;
          this.operation = operation;
          this.code = code;
          this.continueUrl = searchParams[
            "continueUrl"
            /* QueryField.CONTINUE_URL */
          ] ?? null;
          this.languageCode = searchParams[
            "lang"
            /* QueryField.LANGUAGE_CODE */
          ] ?? null;
          this.tenantId = searchParams[
            "tenantId"
            /* QueryField.TENANT_ID */
          ] ?? null;
        }
        /**
         * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
         * otherwise returns null.
         *
         * @param link  - The email action link string.
         * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
         *
         * @public
         */
        static parseLink(link) {
          const actionLink = parseDeepLink(link);
          try {
            return new _ActionCodeURL(actionLink);
          } catch {
            return null;
          }
        }
      };
      EmailAuthProvider = class _EmailAuthProvider {
        constructor() {
          this.providerId = _EmailAuthProvider.PROVIDER_ID;
        }
        /**
         * Initialize an {@link AuthCredential} using an email and password.
         *
         * @example
         * ```javascript
         * const authCredential = EmailAuthProvider.credential(email, password);
         * const userCredential = await signInWithCredential(auth, authCredential);
         * ```
         *
         * @example
         * ```javascript
         * const userCredential = await signInWithEmailAndPassword(auth, email, password);
         * ```
         *
         * @param email - Email address.
         * @param password - User account password.
         * @returns The auth provider credential.
         */
        static credential(email, password) {
          return EmailAuthCredential._fromEmailAndPassword(email, password);
        }
        /**
         * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
         * email link operation.
         *
         * @example
         * ```javascript
         * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
         * const userCredential = await signInWithCredential(auth, authCredential);
         * ```
         *
         * @example
         * ```javascript
         * await sendSignInLinkToEmail(auth, email);
         * // Obtain emailLink from user.
         * const userCredential = await signInWithEmailLink(auth, email, emailLink);
         * ```
         *
         * @param auth - The {@link Auth} instance used to verify the link.
         * @param email - Email address.
         * @param emailLink - Sign-in email link.
         * @returns - The auth provider credential.
         */
        static credentialWithLink(email, emailLink) {
          const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
          _assert(
            actionCodeUrl,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
        }
      };
      EmailAuthProvider.PROVIDER_ID = "password";
      EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
      EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
      FederatedAuthProvider = class {
        /**
         * Constructor for generic OAuth providers.
         *
         * @param providerId - Provider for which credentials should be generated.
         */
        constructor(providerId) {
          this.providerId = providerId;
          this.defaultLanguageCode = null;
          this.customParameters = {};
        }
        /**
         * Set the language gode.
         *
         * @param languageCode - language code
         */
        setDefaultLanguage(languageCode) {
          this.defaultLanguageCode = languageCode;
        }
        /**
         * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
         * operations.
         *
         * @remarks
         * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
         * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
         *
         * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
         */
        setCustomParameters(customOAuthParameters) {
          this.customParameters = customOAuthParameters;
          return this;
        }
        /**
         * Retrieve the current list of {@link CustomParameters}.
         */
        getCustomParameters() {
          return this.customParameters;
        }
      };
      BaseOAuthProvider = class extends FederatedAuthProvider {
        constructor() {
          super(...arguments);
          this.scopes = [];
        }
        /**
         * Add an OAuth scope to the credential.
         *
         * @param scope - Provider OAuth scope to add.
         */
        addScope(scope) {
          if (!this.scopes.includes(scope)) {
            this.scopes.push(scope);
          }
          return this;
        }
        /**
         * Retrieve the current list of OAuth scopes.
         */
        getScopes() {
          return [...this.scopes];
        }
      };
      FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
        constructor() {
          super(
            "facebook.com"
            /* ProviderId.FACEBOOK */
          );
        }
        /**
         * Creates a credential for Facebook.
         *
         * @example
         * ```javascript
         * // `event` from the Facebook auth.authResponseChange callback.
         * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
         * const result = await signInWithCredential(credential);
         * ```
         *
         * @param accessToken - Facebook access token.
         */
        static credential(accessToken) {
          return OAuthCredential._fromParams({
            providerId: _FacebookAuthProvider.PROVIDER_ID,
            signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
            accessToken
          });
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromResult(userCredential) {
          return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
         * thrown during a sign-in, link, or reauthenticate operation.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromError(error) {
          return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
          }
          if (!tokenResponse.oauthAccessToken) {
            return null;
          }
          try {
            return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
          } catch {
            return null;
          }
        }
      };
      FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
      FacebookAuthProvider.PROVIDER_ID = "facebook.com";
      GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
        constructor() {
          super(
            "google.com"
            /* ProviderId.GOOGLE */
          );
          this.addScope("profile");
        }
        /**
         * Creates a credential for Google. At least one of ID token and access token is required.
         *
         * @example
         * ```javascript
         * // \`googleUser\` from the onsuccess Google Sign In callback.
         * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
         * const result = await signInWithCredential(credential);
         * ```
         *
         * @param idToken - Google ID token.
         * @param accessToken - Google access token.
         */
        static credential(idToken, accessToken) {
          return OAuthCredential._fromParams({
            providerId: _GoogleAuthProvider.PROVIDER_ID,
            signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
            idToken,
            accessToken
          });
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromResult(userCredential) {
          return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
         * thrown during a sign-in, link, or reauthenticate operation.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromError(error) {
          return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { oauthIdToken, oauthAccessToken } = tokenResponse;
          if (!oauthIdToken && !oauthAccessToken) {
            return null;
          }
          try {
            return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
          } catch {
            return null;
          }
        }
      };
      GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
      GoogleAuthProvider.PROVIDER_ID = "google.com";
      GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
        constructor() {
          super(
            "github.com"
            /* ProviderId.GITHUB */
          );
        }
        /**
         * Creates a credential for GitHub.
         *
         * @param accessToken - GitHub access token.
         */
        static credential(accessToken) {
          return OAuthCredential._fromParams({
            providerId: _GithubAuthProvider.PROVIDER_ID,
            signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
            accessToken
          });
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromResult(userCredential) {
          return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
         * thrown during a sign-in, link, or reauthenticate operation.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromError(error) {
          return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
            return null;
          }
          if (!tokenResponse.oauthAccessToken) {
            return null;
          }
          try {
            return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
          } catch {
            return null;
          }
        }
      };
      GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
      GithubAuthProvider.PROVIDER_ID = "github.com";
      TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
        constructor() {
          super(
            "twitter.com"
            /* ProviderId.TWITTER */
          );
        }
        /**
         * Creates a credential for Twitter.
         *
         * @param token - Twitter access token.
         * @param secret - Twitter secret.
         */
        static credential(token, secret) {
          return OAuthCredential._fromParams({
            providerId: _TwitterAuthProvider.PROVIDER_ID,
            signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
            oauthToken: token,
            oauthTokenSecret: secret
          });
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromResult(userCredential) {
          return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
        }
        /**
         * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
         * thrown during a sign-in, link, or reauthenticate operation.
         *
         * @param userCredential - The user credential.
         */
        static credentialFromError(error) {
          return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
        }
        static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
          if (!tokenResponse) {
            return null;
          }
          const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
          if (!oauthAccessToken || !oauthTokenSecret) {
            return null;
          }
          try {
            return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
          } catch {
            return null;
          }
        }
      };
      TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
      TwitterAuthProvider.PROVIDER_ID = "twitter.com";
      UserCredentialImpl = class _UserCredentialImpl {
        constructor(params) {
          this.user = params.user;
          this.providerId = params.providerId;
          this._tokenResponse = params._tokenResponse;
          this.operationType = params.operationType;
        }
        static async _fromIdTokenResponse(auth2, operationType, idTokenResponse, isAnonymous = false) {
          const user = await UserImpl._fromIdTokenResponse(auth2, idTokenResponse, isAnonymous);
          const providerId = providerIdForResponse(idTokenResponse);
          const userCred = new _UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: idTokenResponse,
            operationType
          });
          return userCred;
        }
        static async _forOperation(user, operationType, response) {
          await user._updateTokensIfNecessary(
            response,
            /* reload */
            true
          );
          const providerId = providerIdForResponse(response);
          return new _UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: response,
            operationType
          });
        }
      };
      MultiFactorError = class _MultiFactorError extends FirebaseError {
        constructor(auth2, error, operationType, user) {
          super(error.code, error.message);
          this.operationType = operationType;
          this.user = user;
          Object.setPrototypeOf(this, _MultiFactorError.prototype);
          this.customData = {
            appName: auth2.name,
            tenantId: auth2.tenantId ?? void 0,
            _serverResponse: error.customData._serverResponse,
            operationType
          };
        }
        static _fromErrorAndOperation(auth2, error, operationType, user) {
          return new _MultiFactorError(auth2, error, operationType, user);
        }
      };
      STORAGE_AVAILABLE_KEY = "__sak";
      Receiver = class _Receiver {
        constructor(eventTarget) {
          this.eventTarget = eventTarget;
          this.handlersMap = {};
          this.boundEventHandler = this.handleEvent.bind(this);
        }
        /**
         * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
         *
         * @param eventTarget - An event target (such as window or self) through which the underlying
         * messages will be received.
         */
        static _getInstance(eventTarget) {
          const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
          if (existingInstance) {
            return existingInstance;
          }
          const newInstance = new _Receiver(eventTarget);
          this.receivers.push(newInstance);
          return newInstance;
        }
        isListeningto(eventTarget) {
          return this.eventTarget === eventTarget;
        }
        /**
         * Fans out a MessageEvent to the appropriate listeners.
         *
         * @remarks
         * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
         * finished processing.
         *
         * @param event - The MessageEvent.
         *
         */
        async handleEvent(event) {
          const messageEvent = event;
          const { eventId, eventType, data } = messageEvent.data;
          const handlers = this.handlersMap[eventType];
          if (!handlers?.size) {
            return;
          }
          messageEvent.ports[0].postMessage({
            status: "ack",
            eventId,
            eventType
          });
          const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
          const response = await _allSettled(promises);
          messageEvent.ports[0].postMessage({
            status: "done",
            eventId,
            eventType,
            response
          });
        }
        /**
         * Subscribe an event handler for a particular event.
         *
         * @param eventType - Event name to subscribe to.
         * @param eventHandler - The event handler which should receive the events.
         *
         */
        _subscribe(eventType, eventHandler) {
          if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.addEventListener("message", this.boundEventHandler);
          }
          if (!this.handlersMap[eventType]) {
            this.handlersMap[eventType] = /* @__PURE__ */ new Set();
          }
          this.handlersMap[eventType].add(eventHandler);
        }
        /**
         * Unsubscribe an event handler from a particular event.
         *
         * @param eventType - Event name to unsubscribe from.
         * @param eventHandler - Optional event handler, if none provided, unsubscribe all handlers on this event.
         *
         */
        _unsubscribe(eventType, eventHandler) {
          if (this.handlersMap[eventType] && eventHandler) {
            this.handlersMap[eventType].delete(eventHandler);
          }
          if (!eventHandler || this.handlersMap[eventType].size === 0) {
            delete this.handlersMap[eventType];
          }
          if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.removeEventListener("message", this.boundEventHandler);
          }
        }
      };
      Receiver.receivers = [];
      Sender = class {
        constructor(target) {
          this.target = target;
          this.handlers = /* @__PURE__ */ new Set();
        }
        /**
         * Unsubscribe the handler and remove it from our tracking Set.
         *
         * @param handler - The handler to unsubscribe.
         */
        removeMessageHandler(handler) {
          if (handler.messageChannel) {
            handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
            handler.messageChannel.port1.close();
          }
          this.handlers.delete(handler);
        }
        /**
         * Send a message to the Receiver located at {@link target}.
         *
         * @remarks
         * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
         * receiver has had a chance to fully process the event.
         *
         * @param eventType - Type of event to send.
         * @param data - The payload of the event.
         * @param timeout - Timeout for waiting on an ACK from the receiver.
         *
         * @returns An array of settled promises from all the handlers that were listening on the receiver.
         */
        async _send(eventType, data, timeout = 50) {
          const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
          if (!messageChannel) {
            throw new Error(
              "connection_unavailable"
              /* _MessageError.CONNECTION_UNAVAILABLE */
            );
          }
          let completionTimer;
          let handler;
          return new Promise((resolve, reject) => {
            const eventId = _generateEventId("", 20);
            messageChannel.port1.start();
            const ackTimer = setTimeout(() => {
              reject(new Error(
                "unsupported_event"
                /* _MessageError.UNSUPPORTED_EVENT */
              ));
            }, timeout);
            handler = {
              messageChannel,
              onMessage(event) {
                const messageEvent = event;
                if (messageEvent.data.eventId !== eventId) {
                  return;
                }
                switch (messageEvent.data.status) {
                  case "ack":
                    clearTimeout(ackTimer);
                    completionTimer = setTimeout(
                      () => {
                        reject(new Error(
                          "timeout"
                          /* _MessageError.TIMEOUT */
                        ));
                      },
                      3e3
                      /* _TimeoutDuration.COMPLETION */
                    );
                    break;
                  case "done":
                    clearTimeout(completionTimer);
                    resolve(messageEvent.data.response);
                    break;
                  default:
                    clearTimeout(ackTimer);
                    clearTimeout(completionTimer);
                    reject(new Error(
                      "invalid_response"
                      /* _MessageError.INVALID_RESPONSE */
                    ));
                    break;
                }
              }
            };
            this.handlers.add(handler);
            messageChannel.port1.addEventListener("message", handler.onMessage);
            this.target.postMessage({
              eventType,
              eventId,
              data
            }, [messageChannel.port2]);
          }).finally(() => {
            if (handler) {
              this.removeMessageHandler(handler);
            }
          });
        }
      };
      DB_NAME2 = "firebaseLocalStorageDb";
      DB_VERSION2 = 1;
      DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
      DB_DATA_KEYPATH = "fbase_key";
      DBPromise = class {
        constructor(request) {
          this.request = request;
        }
        toPromise() {
          return new Promise((resolve, reject) => {
            this.request.addEventListener("success", () => {
              resolve(this.request.result);
            });
            this.request.addEventListener("error", () => {
              reject(this.request.error);
            });
          });
        }
      };
      _POLLING_INTERVAL_MS = 800;
      _TRANSACTION_RETRY_COUNT = 3;
      IndexedDBLocalPersistence = class {
        registerLifecycleListeners() {
          if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
            window.addEventListener("pagehide", this.onPageHide);
            window.addEventListener("pageshow", this.onPageShow);
          }
        }
        unregisterLifecycleListeners() {
          if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
            window.removeEventListener("pagehide", this.onPageHide);
            window.removeEventListener("pageshow", this.onPageShow);
          }
        }
        constructor() {
          this.type = "LOCAL";
          this.dbPromise = null;
          this._shouldAllowMigration = true;
          this.listeners = {};
          this.localCache = {};
          this.pollTimer = null;
          this.isClosing = false;
          this.pendingWrites = 0;
          this.receiver = null;
          this.sender = null;
          this.serviceWorkerReceiverAvailable = false;
          this.activeServiceWorker = null;
          this.onPageHide = () => {
            this.isClosing = true;
            this.stopPolling();
            if (this.dbPromise) {
              this.dbPromise.then((db) => db.close()).catch(() => {
              });
              this.dbPromise = null;
            }
          };
          this.onPageShow = () => {
            if (this.isClosing) {
              this.isClosing = false;
              if (Object.keys(this.listeners).length > 0) {
                this.startPolling();
              }
            }
          };
          this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
          }, () => {
          });
        }
        async _openDb() {
          if (this.dbPromise) {
            return this.dbPromise;
          }
          this.dbPromise = _openDatabase();
          this.dbPromise.catch(() => {
            this.dbPromise = null;
          });
          return this.dbPromise;
        }
        async _withRetries(op) {
          let numAttempts = 0;
          while (true) {
            try {
              const db = await this._openDb();
              return await op(db);
            } catch (e) {
              if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
                throw e;
              }
              if (this.dbPromise) {
                const dbPromise2 = this.dbPromise;
                this.dbPromise = null;
                try {
                  const db = await dbPromise2;
                  db.close();
                } catch {
                }
              }
            }
          }
        }
        /**
         * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
         * postMessage interface to send these events to the worker ourselves.
         */
        async initializeServiceWorkerMessaging() {
          return _isWorker() ? this.initializeReceiver() : this.initializeSender();
        }
        /**
         * As the worker we should listen to events from the main window.
         */
        async initializeReceiver() {
          this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
          this.receiver._subscribe("keyChanged", async (_origin, data) => {
            const keys = await this._poll();
            return {
              keyProcessed: keys.includes(data.key)
            };
          });
          this.receiver._subscribe("ping", async (_origin, _data) => {
            return [
              "keyChanged"
              /* _EventType.KEY_CHANGED */
            ];
          });
        }
        /**
         * As the main window, we should let the worker know when keys change (set and remove).
         *
         * @remarks
         * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
         * may not resolve.
         */
        async initializeSender() {
          this.activeServiceWorker = await _getActiveServiceWorker();
          if (!this.activeServiceWorker) {
            return;
          }
          this.sender = new Sender(this.activeServiceWorker);
          const results = await this.sender._send(
            "ping",
            {},
            800
            /* _TimeoutDuration.LONG_ACK */
          );
          if (!results) {
            return;
          }
          if (results[0]?.fulfilled && results[0]?.value.includes(
            "keyChanged"
            /* _EventType.KEY_CHANGED */
          )) {
            this.serviceWorkerReceiverAvailable = true;
          }
        }
        /**
         * Let the worker know about a changed key, the exact key doesn't technically matter since the
         * worker will just trigger a full sync anyway.
         *
         * @remarks
         * For now, we only support one service worker per page.
         *
         * @param key - Storage key which changed.
         */
        async notifyServiceWorker(key) {
          if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
            return;
          }
          try {
            await this.sender._send(
              "keyChanged",
              { key },
              // Use long timeout if receiver has previously responded to a ping from us.
              this.serviceWorkerReceiverAvailable ? 800 : 50
              /* _TimeoutDuration.ACK */
            );
          } catch {
          }
        }
        async _isAvailable() {
          try {
            if (!indexedDB) {
              return false;
            }
            await this._withRetries(async (db) => {
              await _putObject(db, STORAGE_AVAILABLE_KEY, "1");
              await _deleteObject(db, STORAGE_AVAILABLE_KEY);
            });
            return true;
          } catch {
          }
          return false;
        }
        async _withPendingWrite(write) {
          this.pendingWrites++;
          try {
            await write();
          } finally {
            this.pendingWrites--;
          }
        }
        async _set(key, value) {
          return this._withPendingWrite(async () => {
            await this._withRetries((db) => _putObject(db, key, value));
            this.localCache[key] = value;
            return this.notifyServiceWorker(key);
          });
        }
        async _get(key) {
          const obj = await this._withRetries((db) => getObject(db, key));
          this.localCache[key] = obj;
          return obj;
        }
        async _remove(key) {
          return this._withPendingWrite(async () => {
            await this._withRetries((db) => _deleteObject(db, key));
            delete this.localCache[key];
            return this.notifyServiceWorker(key);
          });
        }
        async _poll() {
          if (this.isClosing) {
            return [];
          }
          try {
            const result = await this._withRetries((db) => {
              const getAllRequest = getObjectStore(db, false).getAll();
              return new DBPromise(getAllRequest).toPromise();
            });
            if (this.isClosing) {
              return [];
            }
            if (!result) {
              return [];
            }
            if (this.pendingWrites !== 0) {
              return [];
            }
            const keys = [];
            const keysInResult = /* @__PURE__ */ new Set();
            if (result.length !== 0) {
              for (const { fbase_key: key, value } of result) {
                keysInResult.add(key);
                if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
                  this.notifyListeners(key, value);
                  keys.push(key);
                }
              }
            }
            for (const localKey of Object.keys(this.localCache)) {
              if (this.localCache[localKey] && !keysInResult.has(localKey)) {
                this.notifyListeners(localKey, null);
                keys.push(localKey);
              }
            }
            return keys;
          } catch (e) {
            if (!this.isClosing) {
              _logWarn(`Firebase Auth cross-tab polling failed with error: ${e}`);
            }
            return [];
          }
        }
        notifyListeners(key, newValue) {
          this.localCache[key] = newValue;
          const listeners = this.listeners[key];
          if (listeners) {
            for (const listener of Array.from(listeners)) {
              listener(newValue);
            }
          }
        }
        startPolling() {
          this.stopPolling();
          this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
        }
        stopPolling() {
          if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
          }
        }
        _addListener(key, listener) {
          if (Object.keys(this.listeners).length === 0) {
            this.startPolling();
            this.registerLifecycleListeners();
          }
          if (!this.listeners[key]) {
            this.listeners[key] = /* @__PURE__ */ new Set();
            void this._get(key);
          }
          this.listeners[key].add(listener);
        }
        _removeListener(key, listener) {
          if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
              delete this.listeners[key];
            }
          }
          if (Object.keys(this.listeners).length === 0) {
            this.stopPolling();
            this.unregisterLifecycleListeners();
          }
        }
      };
      IndexedDBLocalPersistence.type = "LOCAL";
      indexedDBLocalPersistence = IndexedDBLocalPersistence;
      MultiFactorAssertionImpl = class {
        constructor(factorId) {
          this.factorId = factorId;
        }
        _process(auth2, session, displayName) {
          switch (session.type) {
            case "enroll":
              return this._finalizeEnroll(auth2, session.credential, displayName);
            case "signin":
              return this._finalizeSignIn(auth2, session.credential);
            default:
              return debugFail("unexpected MultiFactorSessionType");
          }
        }
      };
      TotpMultiFactorGenerator = class {
        /**
         * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
         * the TOTP (time-based one-time password) second factor.
         * This assertion is used to complete enrollment in TOTP second factor.
         *
         * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
         * @param oneTimePassword One-time password from TOTP App.
         * @returns A {@link TotpMultiFactorAssertion} which can be used with
         * {@link MultiFactorUser.enroll}.
         */
        static assertionForEnrollment(secret, oneTimePassword) {
          return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
        }
        /**
         * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
         * This assertion is used to complete signIn with TOTP as the second factor.
         *
         * @param enrollmentId identifies the enrolled TOTP second factor.
         * @param oneTimePassword One-time password from TOTP App.
         * @returns A {@link TotpMultiFactorAssertion} which can be used with
         * {@link MultiFactorResolver.resolveSignIn}.
         */
        static assertionForSignIn(enrollmentId, oneTimePassword) {
          return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
        }
        /**
         * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
         * Creates a TOTP secret as part of enrolling a TOTP second factor.
         * Used for generating a QR code URL or inputting into a TOTP app.
         * This method uses the auth instance corresponding to the user in the multiFactorSession.
         *
         * @param session The {@link MultiFactorSession} that the user is part of.
         * @returns A promise to {@link TotpSecret}.
         */
        static async generateSecret(session) {
          const mfaSession = session;
          _assert(
            typeof mfaSession.user?.auth !== "undefined",
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const response = await startEnrollTotpMfa(mfaSession.user.auth, {
            idToken: mfaSession.credential,
            totpEnrollmentInfo: {}
          });
          return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
        }
      };
      TotpMultiFactorGenerator.FACTOR_ID = "totp";
      TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
        constructor(otp, enrollmentId, secret) {
          super(
            "totp"
            /* FactorId.TOTP */
          );
          this.otp = otp;
          this.enrollmentId = enrollmentId;
          this.secret = secret;
        }
        /** @internal */
        static _fromSecret(secret, otp) {
          return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
        }
        /** @internal */
        static _fromEnrollmentId(enrollmentId, otp) {
          return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
        }
        /** @internal */
        async _finalizeEnroll(auth2, idToken, displayName) {
          _assert(
            typeof this.secret !== "undefined",
            auth2,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          return finalizeEnrollTotpMfa(auth2, {
            idToken,
            displayName,
            totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
          });
        }
        /** @internal */
        async _finalizeSignIn(auth2, mfaPendingCredential) {
          _assert(
            this.enrollmentId !== void 0 && this.otp !== void 0,
            auth2,
            "argument-error"
            /* AuthErrorCode.ARGUMENT_ERROR */
          );
          const totpVerificationInfo = { verificationCode: this.otp };
          return finalizeSignInTotpMfa(auth2, {
            mfaPendingCredential,
            mfaEnrollmentId: this.enrollmentId,
            totpVerificationInfo
          });
        }
      };
      TotpSecret = class _TotpSecret {
        // The public members are declared outside the constructor so the docs can be generated.
        constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth2) {
          this.sessionInfo = sessionInfo;
          this.auth = auth2;
          this.secretKey = secretKey;
          this.hashingAlgorithm = hashingAlgorithm;
          this.codeLength = codeLength;
          this.codeIntervalSeconds = codeIntervalSeconds;
          this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
        }
        /** @internal */
        static _fromStartTotpMfaEnrollmentResponse(response, auth2) {
          return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth2);
        }
        /** @internal */
        _makeTotpVerificationInfo(otp) {
          return { sessionInfo: this.sessionInfo, verificationCode: otp };
        }
        /**
         * Returns a QR code URL as described in
         * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
         * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
         * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
         *
         * @param accountName the name of the account/app along with a user identifier.
         * @param issuer issuer of the TOTP (likely the app name).
         * @returns A QR code URL string.
         */
        generateQrCodeUrl(accountName, issuer) {
          let useDefaults = false;
          if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
            useDefaults = true;
          }
          if (useDefaults) {
            if (_isEmptyString(accountName)) {
              accountName = this.auth.currentUser?.email || "unknownuser";
            }
            if (_isEmptyString(issuer)) {
              issuer = this.auth.name;
            }
          }
          return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
        }
      };
      name3 = "@firebase/auth";
      version3 = "1.13.8";
      AuthInterop = class {
        constructor(auth2) {
          this.auth = auth2;
          this.internalListeners = /* @__PURE__ */ new Map();
        }
        getUid() {
          this.assertAuthConfigured();
          return this.auth.currentUser?.uid || null;
        }
        async getToken(forceRefresh) {
          this.assertAuthConfigured();
          await this.auth._initializationPromise;
          if (!this.auth.currentUser) {
            return null;
          }
          const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
          return { accessToken };
        }
        addAuthTokenListener(listener) {
          this.assertAuthConfigured();
          if (this.internalListeners.has(listener)) {
            return;
          }
          const unsubscribe = this.auth.onIdTokenChanged((user) => {
            listener(user?.stsTokenManager.accessToken || null);
          });
          this.internalListeners.set(listener, unsubscribe);
          this.updateProactiveRefresh();
        }
        removeAuthTokenListener(listener) {
          this.assertAuthConfigured();
          const unsubscribe = this.internalListeners.get(listener);
          if (!unsubscribe) {
            return;
          }
          this.internalListeners.delete(listener);
          unsubscribe();
          this.updateProactiveRefresh();
        }
        assertAuthConfigured() {
          _assert(
            this.auth._initializationPromise,
            "dependent-sdk-initialized-before-auth"
            /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
          );
        }
        updateProactiveRefresh() {
          if (this.internalListeners.size > 0) {
            this.auth._startProactiveRefresh();
          } else {
            this.auth._stopProactiveRefresh();
          }
        }
      };
    }
  });

  // node_modules/@firebase/auth/dist/web-extension-esm/index.js
  function getAuth(app2 = getApp()) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      return provider.getImmediate();
    }
    const auth2 = initializeAuth(app2, {
      persistence: [indexedDBLocalPersistence]
    });
    const authEmulatorHost = getDefaultEmulatorHost("auth");
    if (authEmulatorHost) {
      connectAuthEmulator(auth2, `http://${authEmulatorHost}`);
    }
    return auth2;
  }
  var init_web_extension_esm = __esm({
    "node_modules/@firebase/auth/dist/web-extension-esm/index.js"() {
      init_register_1dTRtNx2();
      init_register_1dTRtNx2();
      init_index_esm4();
      init_index_esm();
      init_index_esm2();
      init_index_esm3();
      registerAuth(
        "WebExtension"
        /* ClientPlatform.WEB_EXTENSION */
      );
    }
  });

  // node_modules/firebase/auth/web-extension/dist/esm/index.esm.js
  var init_index_esm6 = __esm({
    "node_modules/firebase/auth/web-extension/dist/esm/index.esm.js"() {
      init_web_extension_esm();
    }
  });

  // src/firebase.js
  var firebaseConfig, app, auth;
  var init_firebase = __esm({
    "src/firebase.js"() {
      init_index_esm5();
      init_index_esm6();
      firebaseConfig = {
        apiKey: "AIzaSyAcwNhDFq8JKy_Gsb0L87MqhjpXFBRlm0w",
        authDomain: "seege-82ab8.firebaseapp.com",
        projectId: "seege-82ab8",
        storageBucket: "seege-82ab8.firebasestorage.app",
        messagingSenderId: "529964064972",
        appId: "1:529964064972:web:59d1028d844538923b2269"
      };
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
    }
  });

  // node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js
  var commonjsGlobal, bloom_blob_es2018, Integer, Md5;
  var init_bloom_blob_es2018 = __esm({
    "node_modules/@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js"() {
      commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      bloom_blob_es2018 = {};
      (function() {
        var h2;
        function k2(d2, a2) {
          function c2() {
          }
          c2.prototype = a2.prototype;
          d2.F = a2.prototype;
          d2.prototype = new c2();
          d2.prototype.constructor = d2;
          d2.D = function(f2, e, g2) {
            for (var b2 = Array(arguments.length - 2), r2 = 2; r2 < arguments.length; r2++) b2[r2 - 2] = arguments[r2];
            return a2.prototype[e].apply(f2, b2);
          };
        }
        function l2() {
          this.blockSize = -1;
        }
        function m2() {
          this.blockSize = -1;
          this.blockSize = 64;
          this.g = Array(4);
          this.C = Array(this.blockSize);
          this.o = this.h = 0;
          this.u();
        }
        k2(m2, l2);
        m2.prototype.u = function() {
          this.g[0] = 1732584193;
          this.g[1] = 4023233417;
          this.g[2] = 2562383102;
          this.g[3] = 271733878;
          this.o = this.h = 0;
        };
        function n2(d2, a2, c2) {
          c2 || (c2 = 0);
          const f2 = Array(16);
          if (typeof a2 === "string") for (var e = 0; e < 16; ++e) f2[e] = a2.charCodeAt(c2++) | a2.charCodeAt(c2++) << 8 | a2.charCodeAt(c2++) << 16 | a2.charCodeAt(c2++) << 24;
          else for (e = 0; e < 16; ++e) f2[e] = a2[c2++] | a2[c2++] << 8 | a2[c2++] << 16 | a2[c2++] << 24;
          a2 = d2.g[0];
          c2 = d2.g[1];
          e = d2.g[2];
          let g2 = d2.g[3], b2;
          b2 = a2 + (g2 ^ c2 & (e ^ g2)) + f2[0] + 3614090360 & 4294967295;
          a2 = c2 + (b2 << 7 & 4294967295 | b2 >>> 25);
          b2 = g2 + (e ^ a2 & (c2 ^ e)) + f2[1] + 3905402710 & 4294967295;
          g2 = a2 + (b2 << 12 & 4294967295 | b2 >>> 20);
          b2 = e + (c2 ^ g2 & (a2 ^ c2)) + f2[2] + 606105819 & 4294967295;
          e = g2 + (b2 << 17 & 4294967295 | b2 >>> 15);
          b2 = c2 + (a2 ^ e & (g2 ^ a2)) + f2[3] + 3250441966 & 4294967295;
          c2 = e + (b2 << 22 & 4294967295 | b2 >>> 10);
          b2 = a2 + (g2 ^ c2 & (e ^ g2)) + f2[4] + 4118548399 & 4294967295;
          a2 = c2 + (b2 << 7 & 4294967295 | b2 >>> 25);
          b2 = g2 + (e ^ a2 & (c2 ^ e)) + f2[5] + 1200080426 & 4294967295;
          g2 = a2 + (b2 << 12 & 4294967295 | b2 >>> 20);
          b2 = e + (c2 ^ g2 & (a2 ^ c2)) + f2[6] + 2821735955 & 4294967295;
          e = g2 + (b2 << 17 & 4294967295 | b2 >>> 15);
          b2 = c2 + (a2 ^ e & (g2 ^ a2)) + f2[7] + 4249261313 & 4294967295;
          c2 = e + (b2 << 22 & 4294967295 | b2 >>> 10);
          b2 = a2 + (g2 ^ c2 & (e ^ g2)) + f2[8] + 1770035416 & 4294967295;
          a2 = c2 + (b2 << 7 & 4294967295 | b2 >>> 25);
          b2 = g2 + (e ^ a2 & (c2 ^ e)) + f2[9] + 2336552879 & 4294967295;
          g2 = a2 + (b2 << 12 & 4294967295 | b2 >>> 20);
          b2 = e + (c2 ^ g2 & (a2 ^ c2)) + f2[10] + 4294925233 & 4294967295;
          e = g2 + (b2 << 17 & 4294967295 | b2 >>> 15);
          b2 = c2 + (a2 ^ e & (g2 ^ a2)) + f2[11] + 2304563134 & 4294967295;
          c2 = e + (b2 << 22 & 4294967295 | b2 >>> 10);
          b2 = a2 + (g2 ^ c2 & (e ^ g2)) + f2[12] + 1804603682 & 4294967295;
          a2 = c2 + (b2 << 7 & 4294967295 | b2 >>> 25);
          b2 = g2 + (e ^ a2 & (c2 ^ e)) + f2[13] + 4254626195 & 4294967295;
          g2 = a2 + (b2 << 12 & 4294967295 | b2 >>> 20);
          b2 = e + (c2 ^ g2 & (a2 ^ c2)) + f2[14] + 2792965006 & 4294967295;
          e = g2 + (b2 << 17 & 4294967295 | b2 >>> 15);
          b2 = c2 + (a2 ^ e & (g2 ^ a2)) + f2[15] + 1236535329 & 4294967295;
          c2 = e + (b2 << 22 & 4294967295 | b2 >>> 10);
          b2 = a2 + (e ^ g2 & (c2 ^ e)) + f2[1] + 4129170786 & 4294967295;
          a2 = c2 + (b2 << 5 & 4294967295 | b2 >>> 27);
          b2 = g2 + (c2 ^ e & (a2 ^ c2)) + f2[6] + 3225465664 & 4294967295;
          g2 = a2 + (b2 << 9 & 4294967295 | b2 >>> 23);
          b2 = e + (a2 ^ c2 & (g2 ^ a2)) + f2[11] + 643717713 & 4294967295;
          e = g2 + (b2 << 14 & 4294967295 | b2 >>> 18);
          b2 = c2 + (g2 ^ a2 & (e ^ g2)) + f2[0] + 3921069994 & 4294967295;
          c2 = e + (b2 << 20 & 4294967295 | b2 >>> 12);
          b2 = a2 + (e ^ g2 & (c2 ^ e)) + f2[5] + 3593408605 & 4294967295;
          a2 = c2 + (b2 << 5 & 4294967295 | b2 >>> 27);
          b2 = g2 + (c2 ^ e & (a2 ^ c2)) + f2[10] + 38016083 & 4294967295;
          g2 = a2 + (b2 << 9 & 4294967295 | b2 >>> 23);
          b2 = e + (a2 ^ c2 & (g2 ^ a2)) + f2[15] + 3634488961 & 4294967295;
          e = g2 + (b2 << 14 & 4294967295 | b2 >>> 18);
          b2 = c2 + (g2 ^ a2 & (e ^ g2)) + f2[4] + 3889429448 & 4294967295;
          c2 = e + (b2 << 20 & 4294967295 | b2 >>> 12);
          b2 = a2 + (e ^ g2 & (c2 ^ e)) + f2[9] + 568446438 & 4294967295;
          a2 = c2 + (b2 << 5 & 4294967295 | b2 >>> 27);
          b2 = g2 + (c2 ^ e & (a2 ^ c2)) + f2[14] + 3275163606 & 4294967295;
          g2 = a2 + (b2 << 9 & 4294967295 | b2 >>> 23);
          b2 = e + (a2 ^ c2 & (g2 ^ a2)) + f2[3] + 4107603335 & 4294967295;
          e = g2 + (b2 << 14 & 4294967295 | b2 >>> 18);
          b2 = c2 + (g2 ^ a2 & (e ^ g2)) + f2[8] + 1163531501 & 4294967295;
          c2 = e + (b2 << 20 & 4294967295 | b2 >>> 12);
          b2 = a2 + (e ^ g2 & (c2 ^ e)) + f2[13] + 2850285829 & 4294967295;
          a2 = c2 + (b2 << 5 & 4294967295 | b2 >>> 27);
          b2 = g2 + (c2 ^ e & (a2 ^ c2)) + f2[2] + 4243563512 & 4294967295;
          g2 = a2 + (b2 << 9 & 4294967295 | b2 >>> 23);
          b2 = e + (a2 ^ c2 & (g2 ^ a2)) + f2[7] + 1735328473 & 4294967295;
          e = g2 + (b2 << 14 & 4294967295 | b2 >>> 18);
          b2 = c2 + (g2 ^ a2 & (e ^ g2)) + f2[12] + 2368359562 & 4294967295;
          c2 = e + (b2 << 20 & 4294967295 | b2 >>> 12);
          b2 = a2 + (c2 ^ e ^ g2) + f2[5] + 4294588738 & 4294967295;
          a2 = c2 + (b2 << 4 & 4294967295 | b2 >>> 28);
          b2 = g2 + (a2 ^ c2 ^ e) + f2[8] + 2272392833 & 4294967295;
          g2 = a2 + (b2 << 11 & 4294967295 | b2 >>> 21);
          b2 = e + (g2 ^ a2 ^ c2) + f2[11] + 1839030562 & 4294967295;
          e = g2 + (b2 << 16 & 4294967295 | b2 >>> 16);
          b2 = c2 + (e ^ g2 ^ a2) + f2[14] + 4259657740 & 4294967295;
          c2 = e + (b2 << 23 & 4294967295 | b2 >>> 9);
          b2 = a2 + (c2 ^ e ^ g2) + f2[1] + 2763975236 & 4294967295;
          a2 = c2 + (b2 << 4 & 4294967295 | b2 >>> 28);
          b2 = g2 + (a2 ^ c2 ^ e) + f2[4] + 1272893353 & 4294967295;
          g2 = a2 + (b2 << 11 & 4294967295 | b2 >>> 21);
          b2 = e + (g2 ^ a2 ^ c2) + f2[7] + 4139469664 & 4294967295;
          e = g2 + (b2 << 16 & 4294967295 | b2 >>> 16);
          b2 = c2 + (e ^ g2 ^ a2) + f2[10] + 3200236656 & 4294967295;
          c2 = e + (b2 << 23 & 4294967295 | b2 >>> 9);
          b2 = a2 + (c2 ^ e ^ g2) + f2[13] + 681279174 & 4294967295;
          a2 = c2 + (b2 << 4 & 4294967295 | b2 >>> 28);
          b2 = g2 + (a2 ^ c2 ^ e) + f2[0] + 3936430074 & 4294967295;
          g2 = a2 + (b2 << 11 & 4294967295 | b2 >>> 21);
          b2 = e + (g2 ^ a2 ^ c2) + f2[3] + 3572445317 & 4294967295;
          e = g2 + (b2 << 16 & 4294967295 | b2 >>> 16);
          b2 = c2 + (e ^ g2 ^ a2) + f2[6] + 76029189 & 4294967295;
          c2 = e + (b2 << 23 & 4294967295 | b2 >>> 9);
          b2 = a2 + (c2 ^ e ^ g2) + f2[9] + 3654602809 & 4294967295;
          a2 = c2 + (b2 << 4 & 4294967295 | b2 >>> 28);
          b2 = g2 + (a2 ^ c2 ^ e) + f2[12] + 3873151461 & 4294967295;
          g2 = a2 + (b2 << 11 & 4294967295 | b2 >>> 21);
          b2 = e + (g2 ^ a2 ^ c2) + f2[15] + 530742520 & 4294967295;
          e = g2 + (b2 << 16 & 4294967295 | b2 >>> 16);
          b2 = c2 + (e ^ g2 ^ a2) + f2[2] + 3299628645 & 4294967295;
          c2 = e + (b2 << 23 & 4294967295 | b2 >>> 9);
          b2 = a2 + (e ^ (c2 | ~g2)) + f2[0] + 4096336452 & 4294967295;
          a2 = c2 + (b2 << 6 & 4294967295 | b2 >>> 26);
          b2 = g2 + (c2 ^ (a2 | ~e)) + f2[7] + 1126891415 & 4294967295;
          g2 = a2 + (b2 << 10 & 4294967295 | b2 >>> 22);
          b2 = e + (a2 ^ (g2 | ~c2)) + f2[14] + 2878612391 & 4294967295;
          e = g2 + (b2 << 15 & 4294967295 | b2 >>> 17);
          b2 = c2 + (g2 ^ (e | ~a2)) + f2[5] + 4237533241 & 4294967295;
          c2 = e + (b2 << 21 & 4294967295 | b2 >>> 11);
          b2 = a2 + (e ^ (c2 | ~g2)) + f2[12] + 1700485571 & 4294967295;
          a2 = c2 + (b2 << 6 & 4294967295 | b2 >>> 26);
          b2 = g2 + (c2 ^ (a2 | ~e)) + f2[3] + 2399980690 & 4294967295;
          g2 = a2 + (b2 << 10 & 4294967295 | b2 >>> 22);
          b2 = e + (a2 ^ (g2 | ~c2)) + f2[10] + 4293915773 & 4294967295;
          e = g2 + (b2 << 15 & 4294967295 | b2 >>> 17);
          b2 = c2 + (g2 ^ (e | ~a2)) + f2[1] + 2240044497 & 4294967295;
          c2 = e + (b2 << 21 & 4294967295 | b2 >>> 11);
          b2 = a2 + (e ^ (c2 | ~g2)) + f2[8] + 1873313359 & 4294967295;
          a2 = c2 + (b2 << 6 & 4294967295 | b2 >>> 26);
          b2 = g2 + (c2 ^ (a2 | ~e)) + f2[15] + 4264355552 & 4294967295;
          g2 = a2 + (b2 << 10 & 4294967295 | b2 >>> 22);
          b2 = e + (a2 ^ (g2 | ~c2)) + f2[6] + 2734768916 & 4294967295;
          e = g2 + (b2 << 15 & 4294967295 | b2 >>> 17);
          b2 = c2 + (g2 ^ (e | ~a2)) + f2[13] + 1309151649 & 4294967295;
          c2 = e + (b2 << 21 & 4294967295 | b2 >>> 11);
          b2 = a2 + (e ^ (c2 | ~g2)) + f2[4] + 4149444226 & 4294967295;
          a2 = c2 + (b2 << 6 & 4294967295 | b2 >>> 26);
          b2 = g2 + (c2 ^ (a2 | ~e)) + f2[11] + 3174756917 & 4294967295;
          g2 = a2 + (b2 << 10 & 4294967295 | b2 >>> 22);
          b2 = e + (a2 ^ (g2 | ~c2)) + f2[2] + 718787259 & 4294967295;
          e = g2 + (b2 << 15 & 4294967295 | b2 >>> 17);
          b2 = c2 + (g2 ^ (e | ~a2)) + f2[9] + 3951481745 & 4294967295;
          d2.g[0] = d2.g[0] + a2 & 4294967295;
          d2.g[1] = d2.g[1] + (e + (b2 << 21 & 4294967295 | b2 >>> 11)) & 4294967295;
          d2.g[2] = d2.g[2] + e & 4294967295;
          d2.g[3] = d2.g[3] + g2 & 4294967295;
        }
        m2.prototype.v = function(d2, a2) {
          a2 === void 0 && (a2 = d2.length);
          const c2 = a2 - this.blockSize, f2 = this.C;
          let e = this.h, g2 = 0;
          for (; g2 < a2; ) {
            if (e == 0) for (; g2 <= c2; ) n2(this, d2, g2), g2 += this.blockSize;
            if (typeof d2 === "string") for (; g2 < a2; ) {
              if (f2[e++] = d2.charCodeAt(g2++), e == this.blockSize) {
                n2(this, f2);
                e = 0;
                break;
              }
            }
            else for (; g2 < a2; ) if (f2[e++] = d2[g2++], e == this.blockSize) {
              n2(this, f2);
              e = 0;
              break;
            }
          }
          this.h = e;
          this.o += a2;
        };
        m2.prototype.A = function() {
          var d2 = Array((this.h < 56 ? this.blockSize : this.blockSize * 2) - this.h);
          d2[0] = 128;
          for (var a2 = 1; a2 < d2.length - 8; ++a2) d2[a2] = 0;
          a2 = this.o * 8;
          for (var c2 = d2.length - 8; c2 < d2.length; ++c2) d2[c2] = a2 & 255, a2 /= 256;
          this.v(d2);
          d2 = Array(16);
          a2 = 0;
          for (c2 = 0; c2 < 4; ++c2) for (let f2 = 0; f2 < 32; f2 += 8) d2[a2++] = this.g[c2] >>> f2 & 255;
          return d2;
        };
        function p2(d2, a2) {
          var c2 = q2;
          return Object.prototype.hasOwnProperty.call(c2, d2) ? c2[d2] : c2[d2] = a2(d2);
        }
        function t(d2, a2) {
          this.h = a2;
          const c2 = [];
          let f2 = true;
          for (let e = d2.length - 1; e >= 0; e--) {
            const g2 = d2[e] | 0;
            f2 && g2 == a2 || (c2[e] = g2, f2 = false);
          }
          this.g = c2;
        }
        var q2 = {};
        function u2(d2) {
          return -128 <= d2 && d2 < 128 ? p2(d2, function(a2) {
            return new t([a2 | 0], a2 < 0 ? -1 : 0);
          }) : new t([d2 | 0], d2 < 0 ? -1 : 0);
        }
        function v2(d2) {
          if (isNaN(d2) || !isFinite(d2)) return w2;
          if (d2 < 0) return x2(v2(-d2));
          const a2 = [];
          let c2 = 1;
          for (let f2 = 0; d2 >= c2; f2++) a2[f2] = d2 / c2 | 0, c2 *= 4294967296;
          return new t(a2, 0);
        }
        function y2(d2, a2) {
          if (d2.length == 0) throw Error("number format error: empty string");
          a2 = a2 || 10;
          if (a2 < 2 || 36 < a2) throw Error("radix out of range: " + a2);
          if (d2.charAt(0) == "-") return x2(y2(d2.substring(1), a2));
          if (d2.indexOf("-") >= 0) throw Error('number format error: interior "-" character');
          const c2 = v2(Math.pow(a2, 8));
          let f2 = w2;
          for (let g2 = 0; g2 < d2.length; g2 += 8) {
            var e = Math.min(8, d2.length - g2);
            const b2 = parseInt(d2.substring(g2, g2 + e), a2);
            e < 8 ? (e = v2(Math.pow(a2, e)), f2 = f2.j(e).add(v2(b2))) : (f2 = f2.j(c2), f2 = f2.add(v2(b2)));
          }
          return f2;
        }
        var w2 = u2(0), z2 = u2(1), A2 = u2(16777216);
        h2 = t.prototype;
        h2.m = function() {
          if (B(this)) return -x2(this).m();
          let d2 = 0, a2 = 1;
          for (let c2 = 0; c2 < this.g.length; c2++) {
            const f2 = this.i(c2);
            d2 += (f2 >= 0 ? f2 : 4294967296 + f2) * a2;
            a2 *= 4294967296;
          }
          return d2;
        };
        h2.toString = function(d2) {
          d2 = d2 || 10;
          if (d2 < 2 || 36 < d2) throw Error("radix out of range: " + d2);
          if (C2(this)) return "0";
          if (B(this)) return "-" + x2(this).toString(d2);
          const a2 = v2(Math.pow(d2, 6));
          var c2 = this;
          let f2 = "";
          for (; ; ) {
            const e = D2(c2, a2).g;
            c2 = F2(c2, e.j(a2));
            let g2 = ((c2.g.length > 0 ? c2.g[0] : c2.h) >>> 0).toString(d2);
            c2 = e;
            if (C2(c2)) return g2 + f2;
            for (; g2.length < 6; ) g2 = "0" + g2;
            f2 = g2 + f2;
          }
        };
        h2.i = function(d2) {
          return d2 < 0 ? 0 : d2 < this.g.length ? this.g[d2] : this.h;
        };
        function C2(d2) {
          if (d2.h != 0) return false;
          for (let a2 = 0; a2 < d2.g.length; a2++) if (d2.g[a2] != 0) return false;
          return true;
        }
        function B(d2) {
          return d2.h == -1;
        }
        h2.l = function(d2) {
          d2 = F2(this, d2);
          return B(d2) ? -1 : C2(d2) ? 0 : 1;
        };
        function x2(d2) {
          const a2 = d2.g.length, c2 = [];
          for (let f2 = 0; f2 < a2; f2++) c2[f2] = ~d2.g[f2];
          return new t(c2, ~d2.h).add(z2);
        }
        h2.abs = function() {
          return B(this) ? x2(this) : this;
        };
        h2.add = function(d2) {
          const a2 = Math.max(this.g.length, d2.g.length), c2 = [];
          let f2 = 0;
          for (let e = 0; e <= a2; e++) {
            let g2 = f2 + (this.i(e) & 65535) + (d2.i(e) & 65535), b2 = (g2 >>> 16) + (this.i(e) >>> 16) + (d2.i(e) >>> 16);
            f2 = b2 >>> 16;
            g2 &= 65535;
            b2 &= 65535;
            c2[e] = b2 << 16 | g2;
          }
          return new t(c2, c2[c2.length - 1] & -2147483648 ? -1 : 0);
        };
        function F2(d2, a2) {
          return d2.add(x2(a2));
        }
        h2.j = function(d2) {
          if (C2(this) || C2(d2)) return w2;
          if (B(this)) return B(d2) ? x2(this).j(x2(d2)) : x2(x2(this).j(d2));
          if (B(d2)) return x2(this.j(x2(d2)));
          if (this.l(A2) < 0 && d2.l(A2) < 0) return v2(this.m() * d2.m());
          const a2 = this.g.length + d2.g.length, c2 = [];
          for (var f2 = 0; f2 < 2 * a2; f2++) c2[f2] = 0;
          for (f2 = 0; f2 < this.g.length; f2++) for (let e = 0; e < d2.g.length; e++) {
            const g2 = this.i(f2) >>> 16, b2 = this.i(f2) & 65535, r2 = d2.i(e) >>> 16, E = d2.i(e) & 65535;
            c2[2 * f2 + 2 * e] += b2 * E;
            G2(c2, 2 * f2 + 2 * e);
            c2[2 * f2 + 2 * e + 1] += g2 * E;
            G2(c2, 2 * f2 + 2 * e + 1);
            c2[2 * f2 + 2 * e + 1] += b2 * r2;
            G2(c2, 2 * f2 + 2 * e + 1);
            c2[2 * f2 + 2 * e + 2] += g2 * r2;
            G2(c2, 2 * f2 + 2 * e + 2);
          }
          for (d2 = 0; d2 < a2; d2++) c2[d2] = c2[2 * d2 + 1] << 16 | c2[2 * d2];
          for (d2 = a2; d2 < 2 * a2; d2++) c2[d2] = 0;
          return new t(c2, 0);
        };
        function G2(d2, a2) {
          for (; (d2[a2] & 65535) != d2[a2]; ) d2[a2 + 1] += d2[a2] >>> 16, d2[a2] &= 65535, a2++;
        }
        function H2(d2, a2) {
          this.g = d2;
          this.h = a2;
        }
        function D2(d2, a2) {
          if (C2(a2)) throw Error("division by zero");
          if (C2(d2)) return new H2(w2, w2);
          if (B(d2)) return a2 = D2(x2(d2), a2), new H2(x2(a2.g), x2(a2.h));
          if (B(a2)) return a2 = D2(d2, x2(a2)), new H2(x2(a2.g), a2.h);
          if (d2.g.length > 30) {
            if (B(d2) || B(a2)) throw Error("slowDivide_ only works with positive integers.");
            for (var c2 = z2, f2 = a2; f2.l(d2) <= 0; ) c2 = I(c2), f2 = I(f2);
            var e = J2(c2, 1), g2 = J2(f2, 1);
            f2 = J2(f2, 2);
            for (c2 = J2(c2, 2); !C2(f2); ) {
              var b2 = g2.add(f2);
              b2.l(d2) <= 0 && (e = e.add(c2), g2 = b2);
              f2 = J2(f2, 1);
              c2 = J2(c2, 1);
            }
            a2 = F2(d2, e.j(a2));
            return new H2(e, a2);
          }
          for (e = w2; d2.l(a2) >= 0; ) {
            c2 = Math.max(1, Math.floor(d2.m() / a2.m()));
            f2 = Math.ceil(Math.log(c2) / Math.LN2);
            f2 = f2 <= 48 ? 1 : Math.pow(2, f2 - 48);
            g2 = v2(c2);
            for (b2 = g2.j(a2); B(b2) || b2.l(d2) > 0; ) c2 -= f2, g2 = v2(c2), b2 = g2.j(a2);
            C2(g2) && (g2 = z2);
            e = e.add(g2);
            d2 = F2(d2, b2);
          }
          return new H2(e, d2);
        }
        h2.B = function(d2) {
          return D2(this, d2).h;
        };
        h2.and = function(d2) {
          const a2 = Math.max(this.g.length, d2.g.length), c2 = [];
          for (let f2 = 0; f2 < a2; f2++) c2[f2] = this.i(f2) & d2.i(f2);
          return new t(c2, this.h & d2.h);
        };
        h2.or = function(d2) {
          const a2 = Math.max(this.g.length, d2.g.length), c2 = [];
          for (let f2 = 0; f2 < a2; f2++) c2[f2] = this.i(f2) | d2.i(f2);
          return new t(c2, this.h | d2.h);
        };
        h2.xor = function(d2) {
          const a2 = Math.max(this.g.length, d2.g.length), c2 = [];
          for (let f2 = 0; f2 < a2; f2++) c2[f2] = this.i(f2) ^ d2.i(f2);
          return new t(c2, this.h ^ d2.h);
        };
        function I(d2) {
          const a2 = d2.g.length + 1, c2 = [];
          for (let f2 = 0; f2 < a2; f2++) c2[f2] = d2.i(f2) << 1 | d2.i(f2 - 1) >>> 31;
          return new t(c2, d2.h);
        }
        function J2(d2, a2) {
          const c2 = a2 >> 5;
          a2 %= 32;
          const f2 = d2.g.length - c2, e = [];
          for (let g2 = 0; g2 < f2; g2++) e[g2] = a2 > 0 ? d2.i(g2 + c2) >>> a2 | d2.i(g2 + c2 + 1) << 32 - a2 : d2.i(g2 + c2);
          return new t(e, d2.h);
        }
        m2.prototype.digest = m2.prototype.A;
        m2.prototype.reset = m2.prototype.u;
        m2.prototype.update = m2.prototype.v;
        Md5 = bloom_blob_es2018.Md5 = m2;
        t.prototype.add = t.prototype.add;
        t.prototype.multiply = t.prototype.j;
        t.prototype.modulo = t.prototype.B;
        t.prototype.compare = t.prototype.l;
        t.prototype.toNumber = t.prototype.m;
        t.prototype.toString = t.prototype.toString;
        t.prototype.getBits = t.prototype.i;
        t.fromNumber = v2;
        t.fromString = y2;
        Integer = bloom_blob_es2018.Integer = t;
      }).apply(typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }
  });

  // node_modules/tslib/tslib.es6.mjs
  function __classPrivateFieldGet(receiver, state, kind, f2) {
    if (kind === "a" && !f2) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f2 : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f2 : kind === "a" ? f2.call(receiver) : f2 ? f2.value : state.get(receiver);
  }
  var init_tslib_es6 = __esm({
    "node_modules/tslib/tslib.es6.mjs"() {
    }
  });

  // node_modules/@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js
  function c(e) {
    s = e;
  }
  function a(e, ...t) {
    if (K.logLevel <= LogLevel.DEBUG) {
      const r2 = t.map(__PRIVATE_argToString);
      K.debug(`Firestore (${s}): ${e}`, ...r2);
    }
  }
  function st(e, ...t) {
    if (K.logLevel <= LogLevel.ERROR) {
      const r2 = t.map(__PRIVATE_argToString);
      K.error(`Firestore (${s}): ${e}`, ...r2);
    }
  }
  function __PRIVATE_logWarn(e, ...t) {
    if (K.logLevel <= LogLevel.WARN) {
      const r2 = t.map(__PRIVATE_argToString);
      K.warn(`Firestore (${s}): ${e}`, ...r2);
    }
  }
  function __PRIVATE_argToString(e) {
    if ("string" == typeof e) return e;
    try {
      return (function __PRIVATE_formatJSON(e2) {
        return JSON.stringify(e2);
      })(e);
    } catch (t) {
      return e;
    }
  }
  function z(e, t, r2) {
    let n2 = "Unexpected state";
    "string" == typeof t ? n2 = t : r2 = t, __PRIVATE__fail(e, n2, r2);
  }
  function __PRIVATE__fail(e, t, r2) {
    let n2 = `FIRESTORE (${s}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;
    if (void 0 !== r2) try {
      n2 += " CONTEXT: " + JSON.stringify(r2);
    } catch (e2) {
      n2 += " CONTEXT: " + r2;
    }
    throw st(n2), new Error(n2);
  }
  function __PRIVATE_hardAssert(e, t, r2, n2) {
    let i = "Unexpected state";
    "string" == typeof r2 ? i = r2 : n2 = r2, e || __PRIVATE__fail(t, i, n2);
  }
  function __PRIVATE_debugCast(e, t) {
    return e;
  }
  function h(e, t) {
    if (!Object.prototype.hasOwnProperty.apply(e.options, ["projectId"])) throw new k(x.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
    return new DatabaseId(e.options.projectId, t);
  }
  function __PRIVATE_randomBytes(e) {
    const t = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "undefined" != typeof self && (self.crypto || self.msCrypto)
    ), r2 = new Uint8Array(e);
    if (t && "function" == typeof t.getRandomValues) t.getRandomValues(r2);
    else
      for (let t2 = 0; t2 < e; t2++) r2[t2] = Math.floor(256 * Math.random());
    return r2;
  }
  function __PRIVATE_primitiveComparator(e, t) {
    return e < t ? -1 : e > t ? 1 : 0;
  }
  function __PRIVATE_compareUtf8Strings(e, t) {
    const r2 = Math.min(e.length, t.length);
    for (let n2 = 0; n2 < r2; n2++) {
      const r3 = e.charAt(n2), i = t.charAt(n2);
      if (r3 !== i) return __PRIVATE_isSurrogate(r3) === __PRIVATE_isSurrogate(i) ? __PRIVATE_primitiveComparator(r3, i) : __PRIVATE_isSurrogate(r3) ? 1 : -1;
    }
    return __PRIVATE_primitiveComparator(e.length, t.length);
  }
  function __PRIVATE_isSurrogate(e) {
    const t = e.charCodeAt(0);
    return t >= G && t <= J;
  }
  function __PRIVATE_arrayEquals(e, t, r2) {
    return e.length === t.length && e.every(((e2, n2) => r2(e2, t[n2])));
  }
  function __PRIVATE_validateNonEmptyArgument(e, t, r2) {
    if (!r2) throw new k(x.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
  }
  function __PRIVATE_validateDocumentPath(e) {
    if (!S.isDocumentKey(e)) throw new k(x.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
  }
  function __PRIVATE_validateCollectionPath(e) {
    if (S.isDocumentKey(e)) throw new k(x.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
  }
  function __PRIVATE_isPlainObject(e) {
    return "object" == typeof e && null !== e && (Object.getPrototypeOf(e) === Object.prototype || null === Object.getPrototypeOf(e));
  }
  function __PRIVATE_valueDescription(e) {
    if (void 0 === e) return "undefined";
    if (null === e) return "null";
    if ("string" == typeof e) return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
    if ("number" == typeof e || "boolean" == typeof e) return "" + e;
    if ("object" == typeof e) {
      if (e instanceof Array) return "an array";
      {
        const t = (
          /** try to get the constructor name for an object. */
          (function __PRIVATE_tryGetCustomObjectType(e2) {
            if (e2.constructor) return e2.constructor.name;
            return null;
          })(e)
        );
        return t ? `a custom ${t} object` : "an object";
      }
    }
    return "function" == typeof e ? "a function" : z(12329, {
      type: typeof e
    });
  }
  function f(e, t) {
    if ("_delegate" in e && // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e = e._delegate), !(e instanceof t)) {
      if (t.name === e.constructor.name) throw new k(x.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
      {
        const r2 = __PRIVATE_valueDescription(e);
        throw new k(x.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${r2}`);
      }
    }
    return e;
  }
  function __PRIVATE_cloneLongPollingOptions(e) {
    const t = {};
    return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
  }
  function __PRIVATE_generateUniqueDebugId() {
    return null === Z ? Z = (function __PRIVATE_generateInitialUniqueDebugId() {
      return 268435456 + Math.round(2147483648 * Math.random());
    })() : Z++, "0x" + Z.toString(16);
  }
  function tt(e) {
    return null == e;
  }
  function __PRIVATE_isNegativeZero(e) {
    return 0 === e && 1 / e == -1 / 0;
  }
  function __PRIVATE_mapCodeFromHttpStatus(e) {
    if (void 0 === e) return st("RPC_ERROR", "HTTP error has no status"), x.UNKNOWN;
    switch (e) {
      case 200:
        return x.OK;
      case 400:
        return x.FAILED_PRECONDITION;
      // Other possibilities based on the forward mapping
      // return Code.INVALID_ARGUMENT;
      // return Code.OUT_OF_RANGE;
      case 401:
        return x.UNAUTHENTICATED;
      case 403:
        return x.PERMISSION_DENIED;
      case 404:
        return x.NOT_FOUND;
      case 409:
        return x.ABORTED;
      // Other possibilities:
      // return Code.ALREADY_EXISTS;
      case 416:
        return x.OUT_OF_RANGE;
      case 429:
        return x.RESOURCE_EXHAUSTED;
      case 499:
        return x.CANCELLED;
      case 500:
        return x.UNKNOWN;
      // Other possibilities:
      // return Code.INTERNAL;
      // return Code.DATA_LOSS;
      case 501:
        return x.UNIMPLEMENTED;
      case 503:
        return x.UNAVAILABLE;
      case 504:
        return x.DEADLINE_EXCEEDED;
      default:
        return e >= 200 && e < 300 ? x.OK : e >= 400 && e < 500 ? x.FAILED_PRECONDITION : e >= 500 && e < 600 ? x.INTERNAL : x.UNKNOWN;
    }
  }
  function __PRIVATE_objectSize(e) {
    let t = 0;
    for (const r2 in e) Object.prototype.hasOwnProperty.call(e, r2) && t++;
    return t;
  }
  function forEach(e, t) {
    for (const r2 in e) Object.prototype.hasOwnProperty.call(e, r2) && t(r2, e[r2]);
  }
  function __PRIVATE_normalizeTimestamp(e) {
    if (__PRIVATE_hardAssert(!!e, 39018), "string" == typeof e) {
      let t = 0;
      const r2 = ce.exec(e);
      if (__PRIVATE_hardAssert(!!r2, 46558, {
        timestamp: e
      }), r2[1]) {
        let e2 = r2[1];
        e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
      }
      const n2 = new Date(e);
      return {
        seconds: Math.floor(n2.getTime() / 1e3),
        nanos: t
      };
    }
    return {
      seconds: __PRIVATE_normalizeNumber(e.seconds),
      nanos: __PRIVATE_normalizeNumber(e.nanos)
    };
  }
  function __PRIVATE_normalizeNumber(e) {
    return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
  }
  function __PRIVATE_normalizeByteString(e) {
    return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
  }
  function property(e, t) {
    const r2 = {
      typeString: e
    };
    return t && (r2.value = t), r2;
  }
  function __PRIVATE_validateJSON(e, t) {
    if (!__PRIVATE_isPlainObject(e)) throw new k(x.INVALID_ARGUMENT, "JSON must be an object");
    let r2;
    for (const n2 in t) if (t[n2]) {
      const i = t[n2].typeString, s2 = "value" in t[n2] ? {
        value: t[n2].value
      } : void 0, o2 = t[n2].optional;
      if (!(n2 in e)) {
        if (o2) continue;
        r2 = `JSON missing required field: '${n2}'`;
        break;
      }
      const a2 = e[n2];
      if (i && typeof a2 !== i) {
        r2 = `JSON field '${n2}' must be a ${i}.`;
        break;
      }
      if (void 0 !== s2 && a2 !== s2.value) {
        r2 = `Expected '${n2}' field to equal '${s2.value}'`;
        break;
      }
    }
    if (r2) throw new k(x.INVALID_ARGUMENT, r2);
    return true;
  }
  function __PRIVATE_isServerTimestamp(e) {
    const t = (e?.mapValue?.fields || {}).__type__?.stringValue;
    return "server_timestamp" === t;
  }
  function __PRIVATE_getPreviousValue(e) {
    const t = e.mapValue.fields.__previous_value__;
    return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
  }
  function __PRIVATE_getLocalWriteTime(e) {
    const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
    return new Timestamp(t.seconds, t.nanos);
  }
  function __PRIVATE_typeOrder(e) {
    if ("nullValue" in e) return 0;
    if ("booleanValue" in e) return 2;
    if ("integerValue" in e || "doubleValue" in e) return 3;
    if ("timestampValue" in e) return 4;
    if ("stringValue" in e) return 7;
    if ("bytesValue" in e) return 8;
    if ("referenceValue" in e) return 9;
    if ("geoPointValue" in e) return 11;
    if ("arrayValue" in e) return 13;
    if (!("mapValue" in e)) return z(28295, {
      value: e
    });
    {
      const t = (function __PRIVATE_detectMapRepresentation(e2) {
        if (!e2.mapValue?.fields) return xe.gt;
        const t2 = e2.mapValue.fields, r2 = t2[he]?.stringValue;
        if (r2 && Ne[r2]) return Ne[r2];
        if (1 === __PRIVATE_objectSize(t2)) {
          const e3 = Object.keys(t2);
          return Se[e3[0]] ?? xe.gt;
        }
        return xe.gt;
      })(e);
      switch (t) {
        case xe.wt:
          return 6;
        case xe.yt:
          return 9007199254740991;
        case xe.bt:
          return 14;
        case xe.dt:
          return 12;
        case xe.Et:
          return 10;
        case xe.Vt:
        case xe.Tt:
          return 3;
        case xe.It:
          return 5;
        case xe.At:
          return 8;
        case xe.Rt:
          return 1;
        case xe.Pt:
          return 16;
        default:
          return 15;
      }
    }
  }
  function __PRIVATE_valueEquals(e, t, r2) {
    if (e === t) return true;
    const n2 = __PRIVATE_typeOrder(e);
    if (n2 !== __PRIVATE_typeOrder(t)) return false;
    switch (n2) {
      case 0:
      case 9007199254740991:
      // MaxKeys are all equal.
      case 16:
      // MinKeys are all equal.
      case 1:
        return true;
      case 2:
        return e.booleanValue === t.booleanValue;
      case 6:
        return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
      case 4:
        return (function __PRIVATE_timestampEquals(e2, t2) {
          if ("string" == typeof e2.timestampValue && "string" == typeof t2.timestampValue && e2.timestampValue.length === t2.timestampValue.length)
            return e2.timestampValue === t2.timestampValue;
          const r3 = __PRIVATE_normalizeTimestamp(e2.timestampValue), n3 = __PRIVATE_normalizeTimestamp(t2.timestampValue);
          return r3.seconds === n3.seconds && r3.nanos === n3.nanos;
        })(e, t);
      case 7:
        return e.stringValue === t.stringValue;
      case 8:
        return (function __PRIVATE_blobEquals(e2, t2) {
          return 0 === __PRIVATE_compareBlobsAndSubtype(e2, t2);
        })(e, t);
      case 9:
        return e.referenceValue === t.referenceValue;
      case 11:
        return (function __PRIVATE_geoPointEquals(e2, t2) {
          return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
        })(e, t);
      case 3:
        return (function __PRIVATE_numberEquals(e2, t2, r3) {
          if (__PRIVATE_isDecimal128Value(e2) && __PRIVATE_isDecimal128Value(t2)) return 0 === __PRIVATE_compareQuadruples(e2, t2);
          if ("integerValue" in e2 && "integerValue" in t2 || __PRIVATE_isInt32Value(e2) && __PRIVATE_isInt32Value(t2)) return __PRIVATE_extractNumber(e2) === __PRIVATE_extractNumber(t2);
          let n3, i;
          if (!("doubleValue" in e2) || !("doubleValue" in t2)) return false;
          n3 = __PRIVATE_normalizeNumber(e2.doubleValue), i = __PRIVATE_normalizeNumber(t2.doubleValue);
          if (n3 === i) return __PRIVATE_isNegativeZero(n3) === __PRIVATE_isNegativeZero(i);
          return !!(void 0 === r3 || r3.vt) && (isNaN(n3) && isNaN(i));
        })(e, t, r2);
      case 13:
        return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], ((e2, t2) => __PRIVATE_valueEquals(e2, t2, r2)));
      case 14:
      case 15:
        return (function __PRIVATE_objectEquals(e2, t2, r3) {
          const n3 = e2.mapValue.fields || {}, i = t2.mapValue.fields || {};
          if (__PRIVATE_objectSize(n3) !== __PRIVATE_objectSize(i)) return false;
          for (const e3 in n3) if (n3.hasOwnProperty(e3) && (void 0 === i[e3] || !__PRIVATE_valueEquals(n3[e3], i[e3], r3))) return false;
          return true;
        })(e, t, r2);
      case 5:
        return 0 === __PRIVATE_compareBsonTimestamps(e, t);
      case 12:
        return 0 === __PRIVATE_compareRegex(e, t);
      case 10:
        return 0 === __PRIVATE_compareBsonObjectIds(e, t);
      default:
        return z(52216, {
          left: e
        });
    }
  }
  function __PRIVATE_arrayValueContains(e, t) {
    return void 0 !== (e.values || []).find(((e2) => __PRIVATE_valueEquals(e2, t)));
  }
  function __PRIVATE_valueCompare(e, t) {
    if (e === t) return 0;
    const r2 = __PRIVATE_typeOrder(e), n2 = __PRIVATE_typeOrder(t);
    if (r2 !== n2) return __PRIVATE_primitiveComparator(r2, n2);
    switch (r2) {
      case 0:
      case 1:
      case 16:
      case 9007199254740991:
        return 0;
      case 2:
        return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
      case 3:
        return __PRIVATE_compareNumbers(e, t);
      case 4:
        return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
      case 6:
        return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
      case 7:
        return __PRIVATE_compareUtf8Strings(e.stringValue, t.stringValue);
      case 8:
        return __PRIVATE_compareBlobsAndSubtype(e, t);
      case 9:
        return (function __PRIVATE_compareReferences(e2, t2) {
          const r3 = e2.split("/"), n3 = t2.split("/");
          for (let e3 = 0; e3 < r3.length && e3 < n3.length; e3++) {
            const t3 = __PRIVATE_primitiveComparator(r3[e3], n3[e3]);
            if (0 !== t3) return t3;
          }
          return __PRIVATE_primitiveComparator(r3.length, n3.length);
        })(e.referenceValue, t.referenceValue);
      case 11:
        return (function __PRIVATE_compareGeoPoints(e2, t2) {
          const r3 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
          if (0 !== r3) return r3;
          return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
        })(e.geoPointValue, t.geoPointValue);
      case 13:
        return __PRIVATE_compareArrays(e.arrayValue, t.arrayValue);
      case 14:
        return (function __PRIVATE_compareVectors(e2, t2) {
          const r3 = e2.fields || {}, n3 = t2.fields || {}, i = r3[me]?.arrayValue, s2 = n3[me]?.arrayValue, o2 = __PRIVATE_primitiveComparator(i?.values?.length || 0, s2?.values?.length || 0);
          if (0 !== o2) return o2;
          return __PRIVATE_compareArrays(i, s2);
        })(e.mapValue, t.mapValue);
      case 15:
        return (function __PRIVATE_compareMaps(e2, t2) {
          if (e2 === ve && t2 === ve) return 0;
          if (e2 === ve) return 1;
          if (t2 === ve) return -1;
          const r3 = e2.fields || {}, n3 = Object.keys(r3), i = t2.fields || {}, s2 = Object.keys(i);
          n3.sort(), s2.sort();
          for (let e3 = 0; e3 < n3.length && e3 < s2.length; ++e3) {
            const t3 = __PRIVATE_compareUtf8Strings(n3[e3], s2[e3]);
            if (0 !== t3) return t3;
            const o2 = __PRIVATE_valueCompare(r3[n3[e3]], i[s2[e3]]);
            if (0 !== o2) return o2;
          }
          return __PRIVATE_primitiveComparator(n3.length, s2.length);
        })(e.mapValue, t.mapValue);
      case 5:
        return __PRIVATE_compareBsonTimestamps(e, t);
      case 12:
        return __PRIVATE_compareRegex(e, t);
      case 10:
        return __PRIVATE_compareBsonObjectIds(e, t);
      default:
        throw z(23264, {
          xt: r2
        });
    }
  }
  function __PRIVATE_extractNumber(e) {
    let t;
    return t = __PRIVATE_isInt32Value(e) ? e.mapValue.fields[pe].integerValue : e.integerValue || e.doubleValue, __PRIVATE_normalizeNumber(t);
  }
  function __PRIVATE_getDecimal128StringValue(e) {
    return e.mapValue.fields[ye].stringValue;
  }
  function __PRIVATE_compareNumbers(e, t) {
    if (__PRIVATE_isDecimal128Value(e) || __PRIVATE_isDecimal128Value(t)) return __PRIVATE_compareQuadruples(e, t);
    const r2 = __PRIVATE_extractNumber(e), n2 = __PRIVATE_extractNumber(t);
    return isNaN(r2) ? isNaN(n2) ? 0 : -1 : isNaN(n2) ? 1 : __PRIVATE_primitiveComparator(r2, n2);
  }
  function __PRIVATE_compareQuadruples(e, t) {
    const r2 = __PRIVATE_convertNumberToQuadruple(e), n2 = __PRIVATE_convertNumberToQuadruple(t);
    return r2.ot() && n2.ot() ? 0 : (
      // NaN sorts equal to itself and before any other number.
      r2.isNaN() ? n2.isNaN() ? 0 : -1 : n2.isNaN() ? 1 : r2.compareTo(n2)
    );
  }
  function __PRIVATE_convertNumberToQuadruple(e) {
    return __PRIVATE_isDecimal128Value(e) ? __PRIVATE_Quadruple.fromString(__PRIVATE_getDecimal128StringValue(e)) : __PRIVATE_Quadruple.fromNumber(__PRIVATE_extractNumber(e));
  }
  function __PRIVATE_compareTimestamps(e, t) {
    if ("string" == typeof e && "string" == typeof t && e.length === t.length) return __PRIVATE_primitiveComparator(e, t);
    const r2 = __PRIVATE_normalizeTimestamp(e), n2 = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(r2.seconds, n2.seconds);
    return 0 !== i ? i : __PRIVATE_primitiveComparator(r2.nanos, n2.nanos);
  }
  function __PRIVATE_compareArrays(e, t) {
    const r2 = e.values || [], n2 = t.values || [];
    for (let e2 = 0; e2 < r2.length && e2 < n2.length; ++e2) {
      const t2 = __PRIVATE_valueCompare(r2[e2], n2[e2]);
      if (void 0 !== t2 && 0 !== t2) return t2;
    }
    return __PRIVATE_primitiveComparator(r2.length, n2.length);
  }
  function __PRIVATE_compareBsonTimestamps(e, t) {
    const r2 = e.mapValue.fields?.[be].mapValue?.fields?.[we], n2 = t.mapValue.fields?.[be].mapValue?.fields?.[we], i = e.mapValue.fields?.[be].mapValue?.fields?.[ge], s2 = t.mapValue.fields?.[be].mapValue?.fields?.[ge], o2 = __PRIVATE_compareNumbers(r2, n2);
    return 0 !== o2 ? o2 : __PRIVATE_compareNumbers(i, s2);
  }
  function __PRIVATE_getBytesAndSubtype(e) {
    if ("bytesValue" in e) return {
      subtype: 0,
      bytes: __PRIVATE_normalizeByteString(e.bytesValue)
    };
    const t = e.mapValue?.fields, r2 = t?.[Fe], n2 = r2?.bytesValue;
    if (!n2) throw new Error("Received incorrect value for BsonBinaryData");
    const i = __PRIVATE_normalizeByteString(n2).toUint8Array();
    if (0 === i.length) throw new Error("Received empty bytesValue for BsonBinaryData");
    const s2 = i[0], o2 = i.slice(1);
    return {
      subtype: s2,
      bytes: ByteString.fromUint8Array(o2)
    };
  }
  function __PRIVATE_compareBlobsAndSubtype(e, t) {
    const r2 = __PRIVATE_getBytesAndSubtype(e), n2 = __PRIVATE_getBytesAndSubtype(t);
    return r2.subtype !== n2.subtype ? r2.subtype < n2.subtype ? -1 : 1 : r2.bytes.compareTo(n2.bytes);
  }
  function __PRIVATE_compareRegex(e, t) {
    const r2 = e.mapValue.fields, n2 = r2?.[Ie]?.mapValue?.fields?.[Ae]?.stringValue ?? "", i = r2?.[Ie]?.mapValue?.fields?.[Re]?.stringValue ?? "", s2 = t.mapValue.fields, o2 = s2?.[Ie]?.mapValue?.fields?.[Ae]?.stringValue ?? "", a2 = s2?.[Ie]?.mapValue?.fields?.[Re]?.stringValue ?? "", u2 = __PRIVATE_compareUtf8Strings(n2, o2);
    return 0 !== u2 ? u2 : __PRIVATE_primitiveComparator(i, a2);
  }
  function __PRIVATE_compareBsonObjectIds(e, t) {
    return __PRIVATE_compareUtf8Strings(e.mapValue.fields?.[Pe]?.stringValue ?? "", t.mapValue.fields?.[Pe]?.stringValue ?? "");
  }
  function __PRIVATE_refValue(e, t) {
    return {
      referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
    };
  }
  function __PRIVATE_isDecimal128Value(e) {
    if (!e.mapValue?.fields) return false;
    const t = e.mapValue.fields;
    return 1 === __PRIVATE_objectSize(t) && t[ye] && !!t[ye].stringValue;
  }
  function __PRIVATE_isInt32Value(e) {
    if (!e.mapValue?.fields) return false;
    const t = e.mapValue.fields;
    return 1 === __PRIVATE_objectSize(t) && void 0 !== t[pe]?.integerValue;
  }
  function isArray(e) {
    return !!e && "arrayValue" in e;
  }
  function __PRIVATE_isNullValue(e) {
    return !!e && "nullValue" in e;
  }
  function __PRIVATE_isNanValue(e) {
    return !(!(function __PRIVATE_isDoubleValue(e2) {
      return !!e2 && "doubleValue" in e2;
    })(e) || !isNaN(Number(e.doubleValue))) || !(!__PRIVATE_isDecimal128Value(e) || "NaN" !== __PRIVATE_getDecimal128StringValue(e));
  }
  function __PRIVATE_isMapValue(e) {
    return !!e && "mapValue" in e;
  }
  function __PRIVATE_deepClone(e) {
    if (e.geoPointValue) return {
      geoPointValue: {
        ...e.geoPointValue
      }
    };
    if (e.timestampValue && "object" == typeof e.timestampValue) return {
      timestampValue: {
        ...e.timestampValue
      }
    };
    if (e.mapValue) {
      const t = {
        mapValue: {
          fields: {}
        }
      };
      return forEach(e.mapValue.fields, ((e2, r2) => t.mapValue.fields[e2] = __PRIVATE_deepClone(r2))), t;
    }
    if (e.arrayValue) {
      const t = {
        arrayValue: {
          values: []
        }
      };
      for (let r2 = 0; r2 < (e.arrayValue.values || []).length; ++r2) t.arrayValue.values[r2] = __PRIVATE_deepClone(e.arrayValue.values[r2]);
      return t;
    }
    return {
      ...e
    };
  }
  function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
    return (t.arrayValue?.values || []).map(((e2) => S.fromName(e2.referenceValue)));
  }
  function __PRIVATE_newTarget(e, t = null, r2 = [], n2 = [], i = null, s2 = null, o2 = null) {
    return new __PRIVATE_TargetImpl(e, t, r2, n2, i, s2, o2);
  }
  function __PRIVATE_isCollectionGroupQuery(e) {
    return null !== e.collectionGroup;
  }
  function __PRIVATE_queryNormalizedOrderBy(e) {
    const t = __PRIVATE_debugCast(e);
    if (null === t.St) {
      t.St = [];
      const e2 = /* @__PURE__ */ new Set();
      for (const r3 of t.explicitOrderBy) t.St.push(r3), e2.add(r3.field.canonicalString());
      const r2 = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", n2 = (
        // Returns the sorted set of inequality filter fields used in this query.
        (function __PRIVATE_getInequalityFilterFields(e3) {
          let t2 = new SortedSet(X.comparator);
          return e3.filters.forEach(((e4) => {
            e4.getFlattenedFilters().forEach(((e5) => {
              e5.isInequality() && (t2 = t2.add(e5.field));
            }));
          })), t2;
        })(t)
      );
      n2.forEach(((n3) => {
        e2.has(n3.canonicalString()) || n3.isKeyField() || t.St.push(new OrderBy(n3, r2));
      })), // Add the document key field to the last if it is not explicitly ordered.
      e2.has(X.keyField().canonicalString()) || t.St.push(new OrderBy(X.keyField(), r2));
    }
    return t.St;
  }
  function __PRIVATE_queryToTarget(e) {
    const t = __PRIVATE_debugCast(e);
    return t.Ct || (t.Ct = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.Ct;
  }
  function __PRIVATE__queryToTarget(e, t) {
    if ("F" === e.limitType) return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
    {
      t = t.map(((e2) => {
        const t2 = "desc" === e2.dir ? "asc" : "desc";
        return new OrderBy(e2.field, t2);
      }));
      const r2 = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, n2 = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
      return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, r2, n2);
    }
  }
  function __PRIVATE_queryWithAddedFilter(e, t) {
    const r2 = e.filters.concat([t]);
    return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), r2, e.limit, e.limitType, e.startAt, e.endAt);
  }
  function __PRIVATE_toDouble(e, t) {
    if (e.useProto3Json) {
      if (isNaN(t)) return {
        doubleValue: "NaN"
      };
      if (t === 1 / 0) return {
        doubleValue: "Infinity"
      };
      if (t === -1 / 0) return {
        doubleValue: "-Infinity"
      };
    }
    return {
      doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
    };
  }
  function __PRIVATE_toInteger(e) {
    return {
      integerValue: "" + e
    };
  }
  function toNumber(e, t, r2) {
    return (function isSafeInteger(e2) {
      return "number" == typeof e2 && Number.isInteger(e2) && !__PRIVATE_isNegativeZero(e2) && e2 <= Number.MAX_SAFE_INTEGER && e2 >= Number.MIN_SAFE_INTEGER;
    })(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
  }
  function toTimestamp(e, t) {
    if (e.useProto3Json) {
      return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
    }
    return {
      seconds: "" + t.seconds,
      nanos: t.nanoseconds
    };
  }
  function __PRIVATE_toBytes(e, t) {
    return e.useProto3Json ? t.toBase64() : t.toUint8Array();
  }
  function __PRIVATE_toVersion(e, t) {
    return toTimestamp(e, t.toTimestamp());
  }
  function __PRIVATE_fromVersion(e) {
    return __PRIVATE_hardAssert(!!e, 49232), j.fromTimestamp((function fromTimestamp(e2) {
      const t = __PRIVATE_normalizeTimestamp(e2);
      return new Timestamp(t.seconds, t.nanos);
    })(e));
  }
  function __PRIVATE_toResourceName(e, t) {
    return __PRIVATE_toResourcePath(e, t).canonicalString();
  }
  function __PRIVATE_toResourcePath(e, t) {
    const r2 = (function __PRIVATE_fullyQualifiedPrefixPath(e2) {
      return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
    })(e).child("documents");
    return void 0 === t ? r2 : r2.child(t);
  }
  function __PRIVATE_toName(e, t) {
    return __PRIVATE_toResourceName(e.databaseId, t.path);
  }
  function fromName(e, t) {
    const r2 = (function __PRIVATE_fromResourceName(e2) {
      const t2 = ResourcePath.fromString(e2);
      return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t2), 10190, {
        key: t2.toString()
      }), t2;
    })(t);
    if (r2.get(1) !== e.databaseId.projectId) throw new k(x.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + r2.get(1) + " vs " + e.databaseId.projectId);
    if (r2.get(3) !== e.databaseId.database) throw new k(x.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + r2.get(3) + " vs " + e.databaseId.database);
    return new S((function __PRIVATE_extractLocalPathFromResourceName(e2) {
      return __PRIVATE_hardAssert(e2.length > 4 && "documents" === e2.get(4), 29091, {
        key: e2.toString()
      }), e2.popFirst(5);
    })(r2));
  }
  function __PRIVATE_toMutationDocument(e, t, r2) {
    return {
      name: __PRIVATE_toName(e, t),
      fields: r2.value.mapValue.fields
    };
  }
  function __PRIVATE_fromBatchGetDocumentsResponse(e, t) {
    return "found" in t ? (function __PRIVATE_fromFound(e2, t2) {
      __PRIVATE_hardAssert(!!t2.found, 43571), t2.found.name, t2.found.updateTime;
      const r2 = fromName(e2, t2.found.name), n2 = __PRIVATE_fromVersion(t2.found.updateTime), i = t2.found.createTime ? __PRIVATE_fromVersion(t2.found.createTime) : j.min(), s2 = new u({
        mapValue: {
          fields: t2.found.fields
        }
      });
      return MutableDocument.newFoundDocument(r2, n2, i, s2);
    })(e, t) : "missing" in t ? (function __PRIVATE_fromMissing(e2, t2) {
      __PRIVATE_hardAssert(!!t2.missing, 3894), __PRIVATE_hardAssert(!!t2.readTime, 22933);
      const r2 = fromName(e2, t2.missing), n2 = __PRIVATE_fromVersion(t2.readTime);
      return MutableDocument.newNoDocument(r2, n2);
    })(e, t) : z(7234, {
      result: t
    });
  }
  function toMutation(e, t) {
    let r2;
    if (t instanceof __PRIVATE_SetMutation) r2 = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    };
    else if (t instanceof F) r2 = {
      delete: __PRIVATE_toName(e, t.key)
    };
    else if (t instanceof __PRIVATE_PatchMutation) r2 = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.data),
      updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    };
    else {
      if (!(t instanceof q)) return z(16599, {
        Ot: t.type
      });
      r2 = {
        verify: __PRIVATE_toName(e, t.key)
      };
    }
    return t.fieldTransforms.length > 0 && (r2.updateTransforms = t.fieldTransforms.map(((e2) => (function __PRIVATE_toFieldTransform(e3, t2) {
      const r3 = t2.transform;
      if (r3 instanceof __PRIVATE_ServerTimestampTransform) return {
        fieldPath: t2.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
      if (r3 instanceof __PRIVATE_ArrayUnionTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        appendMissingElements: {
          values: r3.elements
        }
      };
      if (r3 instanceof __PRIVATE_ArrayRemoveTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        removeAllFromArray: {
          values: r3.elements
        }
      };
      if (r3 instanceof __PRIVATE_NumericIncrementTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        increment: r3.Qt
      };
      if (r3 instanceof __PRIVATE_NumericMinimumTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        minimum: r3.Qt
      };
      if (r3 instanceof __PRIVATE_NumericMaximumTransformOperation) return {
        fieldPath: t2.field.canonicalString(),
        maximum: r3.Qt
      };
      throw z(20930, {
        transform: t2.transform
      });
    })(0, e2)))), t.precondition.isNone || (r2.currentDocument = (function __PRIVATE_toPrecondition(e2, t2) {
      return void 0 !== t2.updateTime ? {
        updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
      } : void 0 !== t2.exists ? {
        exists: t2.exists
      } : z(27497);
    })(e, t.precondition)), r2;
  }
  function __PRIVATE_toQueryTarget(e, t) {
    const r2 = {
      structuredQuery: {}
    }, n2 = t.path;
    let i;
    null !== t.collectionGroup ? (i = n2, r2.structuredQuery.from = [{
      collectionId: t.collectionGroup,
      allDescendants: true
    }]) : (i = n2.popLast(), r2.structuredQuery.from = [{
      collectionId: n2.lastSegment()
    }]), r2.parent = (function __PRIVATE_toQueryPath(e2, t2) {
      return __PRIVATE_toResourceName(e2.databaseId, t2);
    })(e, i);
    const s2 = (function __PRIVATE_toFilters(e2) {
      if (0 === e2.length) return;
      return __PRIVATE_toFilter(CompositeFilter.create(
        e2,
        "and"
        /* CompositeOperator.AND */
      ));
    })(t.filters);
    s2 && (r2.structuredQuery.where = s2);
    const o2 = (function __PRIVATE_toOrder(e2) {
      if (0 === e2.length) return;
      return e2.map(((e3) => (
        // visible for testing
        (function __PRIVATE_toPropertyOrder(e4) {
          return {
            field: __PRIVATE_toFieldPathReference(e4.field),
            direction: __PRIVATE_toDirection(e4.dir)
          };
        })(e3)
      )));
    })(t.orderBy);
    o2 && (r2.structuredQuery.orderBy = o2);
    const a2 = (function __PRIVATE_toInt32Proto(e2, t2) {
      return e2.useProto3Json || tt(t2) ? t2 : {
        value: t2
      };
    })(e, t.limit);
    return null !== a2 && (r2.structuredQuery.limit = a2), t.startAt && (r2.structuredQuery.startAt = (function __PRIVATE_toStartAtCursor(e2) {
      return {
        before: e2.inclusive,
        values: e2.position
      };
    })(t.startAt)), t.endAt && (r2.structuredQuery.endAt = (function __PRIVATE_toEndAtCursor(e2) {
      return {
        before: !e2.inclusive,
        values: e2.position
      };
    })(t.endAt)), {
      Mt: r2,
      parent: i
    };
  }
  function __PRIVATE_toDirection(e) {
    return Ce[e];
  }
  function __PRIVATE_toOperatorName(e) {
    return Be[e];
  }
  function __PRIVATE_toCompositeOperatorName(e) {
    return Qe[e];
  }
  function __PRIVATE_toFieldPathReference(e) {
    return {
      fieldPath: e.canonicalString()
    };
  }
  function __PRIVATE_toFilter(e) {
    return e instanceof FieldFilter ? (function __PRIVATE_toUnaryOrFieldFilter(e2) {
      if ("==" === e2.op) {
        if (__PRIVATE_isNanValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NULL"
          }
        };
      } else if ("!=" === e2.op) {
        if (__PRIVATE_isNanValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NAN"
          }
        };
        if (__PRIVATE_isNullValue(e2.value)) return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NULL"
          }
        };
      }
      return {
        fieldFilter: {
          field: __PRIVATE_toFieldPathReference(e2.field),
          op: __PRIVATE_toOperatorName(e2.op),
          value: e2.value
        }
      };
    })(e) : e instanceof CompositeFilter ? (function __PRIVATE_toCompositeFilter(e2) {
      const t = e2.getFilters().map(((e3) => __PRIVATE_toFilter(e3)));
      if (1 === t.length) return t[0];
      return {
        compositeFilter: {
          op: __PRIVATE_toCompositeOperatorName(e2.op),
          filters: t
        }
      };
    })(e) : z(54877, {
      filter: e
    });
  }
  function __PRIVATE_toDocumentMask(e) {
    const t = [];
    return e.fields.forEach(((e2) => t.push(e2.canonicalString()))), {
      fieldPaths: t
    };
  }
  function __PRIVATE_isValidResourceName(e) {
    return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
  }
  function __PRIVATE_isProtoValueSerializable(e) {
    return !!e && "function" == typeof e._toProto && "ProtoValue" === e._protoValueType;
  }
  function __PRIVATE_newSerializer(e) {
    return new JsonProtoSerializer(
      e,
      /* useProto3Json= */
      true
    );
  }
  async function O(e, t) {
    const r2 = __PRIVATE_debugCast(e), n2 = {
      writes: t.map(((e2) => toMutation(r2.serializer, e2)))
    };
    await r2.le("Commit", r2.serializer.databaseId, ResourcePath.emptyPath(), n2);
  }
  async function C(e, t) {
    const r2 = __PRIVATE_debugCast(e), n2 = {
      documents: t.map(((e2) => __PRIVATE_toName(r2.serializer, e2)))
    }, i = await r2.me("BatchGetDocuments", r2.serializer.databaseId, ResourcePath.emptyPath(), n2, t.length), s2 = /* @__PURE__ */ new Map();
    i.forEach(((e2) => {
      const t2 = __PRIVATE_fromBatchGetDocumentsResponse(r2.serializer, e2);
      s2.set(t2.key.toString(), t2);
    }));
    const o2 = [];
    return t.forEach(((e2) => {
      const t2 = s2.get(e2.toString());
      __PRIVATE_hardAssert(!!t2, 55234, {
        key: e2
      }), o2.push(t2);
    })), o2;
  }
  async function __PRIVATE_invokeRunQueryRpc(e, t) {
    const r2 = __PRIVATE_debugCast(e), { Mt: n2, parent: i } = __PRIVATE_toQueryTarget(r2.serializer, __PRIVATE_queryToTarget(t));
    return (await r2.me("RunQuery", r2.serializer.databaseId, i, {
      structuredQuery: n2.structuredQuery
    })).filter(((e2) => !!e2.document)).map(((e2) => (function fromDocument(e3, t2, r3) {
      const n3 = fromName(e3, t2.name), i2 = __PRIVATE_fromVersion(t2.updateTime), s2 = t2.createTime ? __PRIVATE_fromVersion(t2.createTime) : j.min(), o2 = new u({
        mapValue: {
          fields: t2.fields
        }
      }), a2 = MutableDocument.newFoundDocument(n3, i2, s2, o2);
      return r3 ? a2.setHasCommittedMutations() : a2;
    })(r2.serializer, e2.document, void 0)));
  }
  function d(e) {
    if (e._terminated) throw new k(x.FAILED_PRECONDITION, "The client has already been terminated.");
    if (!Oe.has(e)) {
      a(ut, "Initializing Datastore");
      const t = (function __PRIVATE_newConnection(e2) {
        return new __PRIVATE_FetchConnection(e2);
      })((function __PRIVATE_makeDatabaseInfo(e2, t2, r3, n3, i) {
        return new DatabaseInfo(e2, t2, r3, i.host, i.ssl, i.experimentalForceLongPolling, i.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(i.experimentalLongPollingOptions), i.useFetchStreams, i.isUsingEmulator, n3, i._customHeaders, i.grpcFlowControlWindow);
      })(e._databaseId, e.app.options.appId || "", e._persistenceKey, e.app.options.apiKey, e._freezeSettings())), r2 = __PRIVATE_newSerializer(e._databaseId), n2 = (function __PRIVATE_newDatastore(e2, t2, r3, n3) {
        return new __PRIVATE_DatastoreImpl(e2, t2, r3, n3);
      })(e._authCredentials, e._appCheckCredentials, t, r2);
      Oe.set(e, n2);
    }
    return Oe.get(e);
  }
  function getFirestore(e, t) {
    const r2 = "object" == typeof e ? e : getApp(), n2 = "string" == typeof e ? e : t || "(default)", i = _getProvider(r2, "firestore/lite").getImmediate({
      identifier: n2
    });
    if (!i._initialized) {
      const e2 = getDefaultEmulatorHostnameAndPort("firestore");
      e2 && connectFirestoreEmulator(i, ...e2);
    }
    return i;
  }
  function connectFirestoreEmulator(e, t, r2, i = {}) {
    e = f(e, n);
    const s2 = isCloudWorkstation(t), o2 = e._getSettings(), a2 = {
      ...o2,
      emulatorOptions: e._getEmulatorOptions()
    }, u2 = `${t}:${r2}`;
    s2 && pingServer(`https://${u2}`), o2.host !== qe && o2.host !== u2 && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");
    const _2 = {
      ...o2,
      host: u2,
      ssl: s2,
      emulatorOptions: i
    };
    if (!deepEqual(_2, a2) && (e._setSettings(_2), i.mockUserToken)) {
      let t2, r3;
      if ("string" == typeof i.mockUserToken) t2 = i.mockUserToken, r3 = User.MOCK_USER;
      else {
        t2 = createMockUserToken(i.mockUserToken, e._app?.options.projectId);
        const n2 = i.mockUserToken.sub || i.mockUserToken.user_id;
        if (!n2) throw new k(x.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
        r3 = new User(n2);
      }
      e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, r3));
    }
  }
  function collection(e, t, ...r2) {
    if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof n) {
      const n2 = ResourcePath.fromString(t, ...r2);
      return __PRIVATE_validateCollectionPath(n2), new CollectionReference(
        e,
        /* converter= */
        null,
        n2
      );
    }
    {
      if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new k(x.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const n2 = e._path.child(ResourcePath.fromString(t, ...r2));
      return __PRIVATE_validateCollectionPath(n2), new CollectionReference(
        e.firestore,
        /* converter= */
        null,
        n2
      );
    }
  }
  function doc(e, t, ...r2) {
    if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof n) {
      const n2 = ResourcePath.fromString(t, ...r2);
      return __PRIVATE_validateDocumentPath(n2), new DocumentReference(
        e,
        /* converter= */
        null,
        new S(n2)
      );
    }
    {
      if (!(e instanceof DocumentReference || e instanceof CollectionReference)) throw new k(x.INVALID_ARGUMENT, "Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const n2 = e._path.child(ResourcePath.fromString(t, ...r2));
      return __PRIVATE_validateDocumentPath(n2), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new S(n2));
    }
  }
  function __PRIVATE_isWrite(e) {
    switch (e) {
      case 0:
      // fall through
      case 2:
      // fall through
      case 1:
        return true;
      case 3:
      case 4:
        return false;
      default:
        throw z(40011, {
          dataSource: e
        });
    }
  }
  function p(e) {
    const t = e._freezeSettings(), r2 = __PRIVATE_newSerializer(e._databaseId);
    return new UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, r2);
  }
  function y(e, t, r2, n2, i, s2 = {}) {
    const o2 = e.createContext(s2.merge || s2.mergeFields ? 2 : 0, t, r2, i);
    __PRIVATE_validatePlainObject("Data must be an object, but it was:", o2, n2);
    const a2 = __PRIVATE_parseObject(n2, o2);
    let c2, l2;
    if (s2.merge) c2 = new FieldMask(o2.fieldMask), l2 = o2.fieldTransforms;
    else if (s2.mergeFields) {
      const e2 = [];
      for (const n3 of s2.mergeFields) {
        const i2 = _(t, n3, r2);
        if (!o2.contains(i2)) throw new k(x.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
        __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
      }
      c2 = new FieldMask(e2), l2 = o2.fieldTransforms.filter(((e3) => c2.covers(e3.field)));
    } else c2 = null, l2 = o2.fieldTransforms;
    return new ParsedSetData(new u(a2), c2, l2);
  }
  function __PRIVATE_parseQueryValue(e, t, r2, n2 = false) {
    return __PRIVATE_parseData(r2, e.createContext(n2 ? 4 : 3, t));
  }
  function __PRIVATE_parseData(e, t, r2) {
    if (__PRIVATE_looksLikeJsonObject(
      // Unwrap the API type from the Compat SDK. This will return the API type
      // from firestore-exp.
      e = getModularInstance(e)
    )) return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
    if (e instanceof FieldValue)
      return (function __PRIVATE_parseSentinelFieldValue(e2, t2) {
        if (!__PRIVATE_isWrite(t2.dataSource)) throw t2.createError(`${e2._methodName}() can only be used with update() and set()`);
        if (!t2.path) throw t2.createError(`${e2._methodName}() is not currently supported inside arrays`);
        const r3 = e2._toFieldTransform(t2);
        r3 && t2.fieldTransforms.push(r3);
      })(e, t), null;
    if (void 0 === e && t.ignoreUndefinedProperties)
      return null;
    if (
      // If context.path is null we are inside an array and we don't support
      // field mask paths more granular than the top-level array.
      t.path && t.fieldMask.push(t.path), e instanceof Array
    ) {
      if (t.settings.arrayElement && 4 !== t.dataSource) throw t.createError("Nested arrays are not supported");
      return (function __PRIVATE_parseArray(e2, t2) {
        const r3 = [];
        let n2 = 0;
        for (const i of e2) {
          let e3 = __PRIVATE_parseData(i, t2.childContextForArray(n2));
          null == e3 && // Just include nulls in the array for fields being replaced with a
          // sentinel.
          (e3 = {
            nullValue: "NULL_VALUE"
          }), r3.push(e3), n2++;
        }
        return {
          arrayValue: {
            values: r3
          }
        };
      })(e, t);
    }
    return (function __PRIVATE_parseScalarValue(e2, t2, r3) {
      if (null === (e2 = getModularInstance(e2))) return {
        nullValue: "NULL_VALUE"
      };
      if ("number" == typeof e2) return toNumber(t2.serializer, e2);
      if ("boolean" == typeof e2) return {
        booleanValue: e2
      };
      if ("string" == typeof e2) return {
        stringValue: e2
      };
      if (e2 instanceof Date) {
        const r4 = Timestamp.fromDate(e2);
        return {
          timestampValue: toTimestamp(t2.serializer, r4)
        };
      }
      if (e2 instanceof Timestamp) {
        const r4 = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
        return {
          timestampValue: toTimestamp(t2.serializer, r4)
        };
      }
      if (__PRIVATE_isTemporalInstant(e2)) {
        const r4 = Timestamp.fromInstant(e2), n2 = new Timestamp(r4.seconds, 1e3 * Math.floor(r4.nanoseconds / 1e3));
        return {
          timestampValue: toTimestamp(t2.serializer, n2)
        };
      }
      if (e2 instanceof GeoPoint) return {
        geoPointValue: {
          latitude: e2.latitude,
          longitude: e2.longitude
        }
      };
      if (e2 instanceof Bytes) return 0 === e2.subtype ? {
        bytesValue: __PRIVATE_toBytes(t2.serializer, e2._byteString)
      } : (
        /**
        * Parses Bytes with a non-zero subtype.
        */
        (function __PRIVATE_parseBytesWithSubtype(e3, t3) {
          const r4 = t3.toUint8Array(), n2 = new Uint8Array(r4.length + 1);
          n2[0] = t3.subtype, // Concatenate the rest of the data starting at index 1.
          n2.set(
            r4,
            /* offset */
            1
          );
          return {
            mapValue: {
              fields: {
                [Fe]: {
                  bytesValue: __PRIVATE_toBytes(e3, ByteString.fromUint8Array(n2))
                }
              }
            }
          };
        })(t2.serializer, e2)
      );
      if (e2 instanceof DocumentReference) {
        const r4 = t2.databaseId, n2 = e2.firestore._databaseId;
        if (!n2.isEqual(r4)) throw t2.createError(`Document reference is for database ${n2.projectId}/${n2.database} but should be for database ${r4.projectId}/${r4.database}`);
        return {
          referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t2.databaseId, e2._key.path)
        };
      }
      if (e2 instanceof VectorValue)
        return (function __PRIVATE_parseVectorValue(e3, t3) {
          const r4 = e3 instanceof VectorValue ? e3.toArray() : e3, n2 = {
            fields: {
              [he]: {
                stringValue: de
              },
              [me]: {
                arrayValue: {
                  values: r4.map(((e4) => {
                    if ("number" != typeof e4) throw t3.createError("VectorValues must only contain numeric values.");
                    return __PRIVATE_toDouble(t3.serializer, e4);
                  }))
                }
              }
            }
          };
          return {
            mapValue: n2
          };
        })(e2, t2);
      if (e2 instanceof RegexValue) return (function __PRIVATE_parseRegexValue(e3) {
        const t3 = {
          fields: {
            [Ie]: {
              mapValue: {
                fields: {
                  [Ae]: {
                    stringValue: e3.pattern
                  },
                  [Re]: {
                    stringValue: e3.options
                  }
                }
              }
            }
          }
        };
        return {
          mapValue: t3
        };
      })(e2);
      if (e2 instanceof BsonObjectId) return (function __PRIVATE_parseBsonObjectId(e3) {
        const t3 = {
          fields: {
            [Pe]: {
              stringValue: e3.value
            }
          }
        };
        return {
          mapValue: t3
        };
      })(e2);
      if (e2 instanceof Int32Value) return (function __PRIVATE_parseInt32Value(e3) {
        const t3 = {
          fields: {
            [pe]: __PRIVATE_toInteger(e3.value)
          }
        };
        return {
          mapValue: t3
        };
      })(e2);
      if (e2 instanceof Decimal128Value) return (function __PRIVATE_parseDecimal128Value(e3) {
        const t3 = {
          fields: {
            [ye]: {
              stringValue: e3.stringValue
            }
          }
        };
        return {
          mapValue: t3
        };
      })(e2);
      if (e2 instanceof BsonTimestamp) return (function __PRIVATE_parseBsonTimestamp(e3) {
        const t3 = {
          fields: {
            [be]: {
              mapValue: {
                fields: {
                  [we]: __PRIVATE_toInteger(e3.seconds),
                  [ge]: __PRIVATE_toInteger(e3.increment)
                }
              }
            }
          }
        };
        return {
          mapValue: t3
        };
      })(e2);
      if (e2 instanceof MinKey) return (function __PRIVATE_parseMinKey() {
        return {
          mapValue: {
            fields: {
              [Ve]: {
                nullValue: "NULL_VALUE"
              }
            }
          }
        };
      })();
      if (e2 instanceof MaxKey) return (function __PRIVATE_parseMaxKey() {
        return {
          mapValue: {
            fields: {
              [Te]: {
                nullValue: "NULL_VALUE"
              }
            }
          }
        };
      })();
      if (__PRIVATE_isProtoValueSerializable(e2)) return e2._toProto(t2.serializer);
      throw t2.createError(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
    })(e, t);
  }
  function __PRIVATE_parseObject(e, t) {
    const r2 = {};
    return !(function isEmpty(e2) {
      for (const t2 in e2) if (Object.prototype.hasOwnProperty.call(e2, t2)) return false;
      return true;
    })(e) ? forEach(e, ((e2, n2) => {
      const i = __PRIVATE_parseData(n2, t.childContextForField(e2));
      null != i && (r2[e2] = i);
    })) : (
      // If we encounter an empty object, we explicitly add it to the update
      // mask to ensure that the server creates a map entry.
      t.path && t.path.length > 0 && t.fieldMask.push(t.path)
    ), {
      mapValue: {
        fields: r2
      }
    };
  }
  function __PRIVATE_isTemporalInstant(e) {
    if ("object" != typeof e || null === e) return false;
    if ("undefined" != typeof Temporal && "function" == typeof Temporal.Instant) {
      if (e instanceof Temporal.Instant) return true;
    }
    const t = e;
    return "Temporal.Instant" === t[Symbol.toStringTag] && "bigint" == typeof t.ht;
  }
  function __PRIVATE_looksLikeJsonObject(e) {
    return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue || e instanceof VectorValue || e instanceof MinKey || e instanceof MaxKey || e instanceof Int32Value || e instanceof Decimal128Value || e instanceof RegexValue || e instanceof BsonObjectId || e instanceof BsonTimestamp || __PRIVATE_isTemporalInstant(e) || __PRIVATE_isProtoValueSerializable(e));
  }
  function __PRIVATE_validatePlainObject(e, t, r2) {
    if (!__PRIVATE_looksLikeJsonObject(r2) || !__PRIVATE_isPlainObject(r2)) {
      const n2 = __PRIVATE_valueDescription(r2);
      throw "an object" === n2 ? t.createError(e + " a custom object") : t.createError(e + " " + n2);
    }
  }
  function _(e, t, r2) {
    if (
      // If required, replace the FieldPath Compat class with the firestore-exp
      // FieldPath.
      (t = getModularInstance(t)) instanceof D
    ) return t._internalPath;
    if ("string" == typeof t) return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
    throw createError(
      "Field path arguments must be of type string or ",
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      r2
    );
  }
  function __PRIVATE_fieldPathFromDotSeparatedString(e, t, r2) {
    if (t.search($e) >= 0) throw createError(
      `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      r2
    );
    try {
      return new D(...t.split("."))._internalPath;
    } catch (n2) {
      throw createError(
        `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
        e,
        /* hasConverter= */
        false,
        /* path= */
        void 0,
        r2
      );
    }
  }
  function createError(e, t, r2, n2, i) {
    const s2 = n2 && !n2.isEmpty(), o2 = void 0 !== i;
    let a2 = `Function ${t}() called with invalid data`;
    r2 && (a2 += " (via `toFirestore()`)"), a2 += ". ";
    let u2 = "";
    return (s2 || o2) && (u2 += " (found", s2 && (u2 += ` in field ${n2}`), o2 && (u2 += ` in document ${i}`), u2 += ")"), new k(x.INVALID_ARGUMENT, a2 + e + u2);
  }
  function __PRIVATE_fieldMaskContains(e, t) {
    return e.some(((e2) => e2.isEqual(t)));
  }
  function query(e, t, ...r2) {
    let n2 = [];
    t instanceof AppliableConstraint && n2.push(t), n2 = n2.concat(r2), (function __PRIVATE_validateQueryConstraintArray(e2) {
      const t2 = e2.filter(((e3) => e3 instanceof QueryCompositeFilterConstraint)).length, r3 = e2.filter(((e3) => e3 instanceof QueryFieldFilterConstraint)).length;
      if (t2 > 1 || t2 > 0 && r3 > 0) throw new k(x.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
    })(n2);
    for (const t2 of n2) e = t2._apply(e);
    return e;
  }
  function where(e, t, r2) {
    const n2 = t, i = _("where", e);
    return QueryFieldFilterConstraint._create(i, n2, r2);
  }
  function __PRIVATE_parseDocumentIdValue(e, t, r2) {
    if ("string" == typeof (r2 = getModularInstance(r2))) {
      if ("" === r2) throw new k(x.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
      if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== r2.indexOf("/")) throw new k(x.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r2}' contains a '/' character.`);
      const n2 = t.path.child(ResourcePath.fromString(r2));
      if (!S.isDocumentKey(n2)) throw new k(x.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n2}' is not because it has an odd number of segments (${n2.length}).`);
      return __PRIVATE_refValue(e, new S(n2));
    }
    if (r2 instanceof DocumentReference) return __PRIVATE_refValue(e, r2._key);
    throw new k(x.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(r2)}.`);
  }
  function __PRIVATE_validateDisjunctiveFilterElements(e, t) {
    if (!Array.isArray(e) || 0 === e.length) throw new k(x.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
  }
  function __PRIVATE_validateNewFieldFilter(e, t) {
    const r2 = (function __PRIVATE_findOpInsideFilters(e2, t2) {
      for (const r3 of e2) for (const e3 of r3.getFlattenedFilters()) if (t2.indexOf(e3.op) >= 0) return e3.op;
      return null;
    })(e.filters, (function __PRIVATE_conflictingOps(e2) {
      switch (e2) {
        case "!=":
          return [
            "!=",
            "not-in"
            /* Operator.NOT_IN */
          ];
        case "array-contains-any":
        case "in":
          return [
            "not-in"
            /* Operator.NOT_IN */
          ];
        case "not-in":
          return [
            "array-contains-any",
            "in",
            "not-in",
            "!="
            /* Operator.NOT_EQUAL */
          ];
        default:
          return [];
      }
    })(t.op));
    if (null !== r2)
      throw r2 === t.op ? new k(x.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new k(x.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${r2.toString()}' filters.`);
  }
  function w(e, t, r2) {
    let n2;
    return n2 = e ? r2 && (r2.merge || r2.mergeFields) ? e.toFirestore(t, r2) : e.toFirestore(t) : t, n2;
  }
  function getDoc(e) {
    const t = d((e = f(e, DocumentReference)).firestore), r2 = new A(e.firestore);
    return C(t, [e._key]).then(((t2) => {
      __PRIVATE_hardAssert(1 === t2.length, 15618);
      const n2 = t2[0];
      return new it(e.firestore, r2, e._key, n2.isFoundDocument() ? n2 : null, e.converter);
    }));
  }
  function getDocs(e) {
    (function __PRIVATE_validateHasExplicitOrderByForLimitToLast(e2) {
      if ("L" === e2.limitType && 0 === e2.explicitOrderBy.length) throw new k(x.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
    })((e = f(e, Query))._query);
    const t = d(e.firestore), r2 = new A(e.firestore);
    return __PRIVATE_invokeRunQueryRpc(t, e._query).then(((t2) => {
      const n2 = t2.map(((t3) => new QueryDocumentSnapshot(e.firestore, r2, t3.key, t3, e.converter)));
      return "L" === e._query.limitType && // Limit to last queries reverse the orderBy constraint that was
      // specified by the user. As such, we need to reverse the order of the
      // results to return the documents in the expected order.
      n2.reverse(), new QuerySnapshot(e, n2);
    }));
  }
  function setDoc(e, t, r2) {
    const n2 = w((e = f(e, DocumentReference)).converter, t, r2), i = y(p(e.firestore), "setDoc", e._key, n2, null !== e.converter, r2);
    return O(d(e.firestore), [i.toMutation(e._key, P.none())]);
  }
  function serverTimestamp() {
    return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
  }
  var User, s, K, x, k, __PRIVATE_OAuthToken, __PRIVATE_EmptyAuthCredentialsProvider, __PRIVATE_EmulatorAuthCredentialsProvider, r, __PRIVATE_FirstPartyToken, __PRIVATE_FirstPartyAuthCredentialsProvider, AppCheckToken, o, DatabaseInfo, W, DatabaseId, __PRIVATE_AutoId, G, J, H, BasePath, ResourcePath, Y, X, S, Z, ee, te, __PRIVATE_RestConnection, re, ne, ie, se, oe, ae, ue, _e, __PRIVATE_FetchConnection, __PRIVATE_Base64DecodeError, ByteString, __PRIVATE_QuadrupleBuilder, __PRIVATE_Quadruple, ce, le, fe, Timestamp, he, de, me, Ee, Ve, Te, Ie, Ae, Re, Pe, pe, ye, be, we, ge, Fe, ve, xe, De, Ne, Se, Bound, Filter, FieldFilter, CompositeFilter, __PRIVATE_KeyFieldFilter, __PRIVATE_KeyFieldInFilter, __PRIVATE_KeyFieldNotInFilter, __PRIVATE_ArrayContainsFilter, __PRIVATE_InFilter, __PRIVATE_NotInFilter, __PRIVATE_ArrayContainsAnyFilter, OrderBy, j, SortedMap, SortedMapIterator, LLRBNode, SortedSet, SortedSetIterator, FieldMask, u, MutableDocument, __PRIVATE_TargetImpl, __PRIVATE_QueryImpl, TransformOperation, __PRIVATE_ServerTimestampTransform, __PRIVATE_ArrayUnionTransformOperation, __PRIVATE_ArrayRemoveTransformOperation, __PRIVATE_NumericTransformOperation, __PRIVATE_NumericIncrementTransformOperation, __PRIVATE_NumericMinimumTransformOperation, __PRIVATE_NumericMaximumTransformOperation, FieldTransform, P, Mutation, __PRIVATE_SetMutation, __PRIVATE_PatchMutation, F, q, Ce, Be, Qe, JsonProtoSerializer, Datastore, __PRIVATE_DatastoreImpl, ut, Oe, Me, qe, Le, FirestoreSettingsImpl, n, Query, DocumentReference, CollectionReference, Bytes, D, BsonObjectId, BsonTimestamp, Decimal128Value, FieldValue, GeoPoint, Int32Value, MaxKey, MinKey, RegexValue, VectorValue, Ue, ParsedSetData, ParseContextImpl, UserDataReader, __PRIVATE_ServerTimestampFieldValueImpl, $e, it, QueryDocumentSnapshot, QuerySnapshot, AppliableConstraint, QueryConstraint, QueryFieldFilterConstraint, QueryCompositeFilterConstraint, AbstractUserDataWriter, A;
  var init_common_Cl98i9kc_esm = __esm({
    "node_modules/@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js"() {
      init_index_esm();
      init_index_esm3();
      init_bloom_blob_es2018();
      init_tslib_es6();
      init_index_esm4();
      User = class {
        constructor(e) {
          this.uid = e;
        }
        isAuthenticated() {
          return null != this.uid;
        }
        /**
         * Returns a key representing this user, suitable for inclusion in a
         * dictionary.
         */
        toKey() {
          return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
        }
        isEqual(e) {
          return e.uid === this.uid;
        }
      };
      User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
      // non-FirebaseAuth providers.
      User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
      s = "13.1.0";
      K = new Logger("@firebase/firestore");
      x = {
        // Causes are copied from:
        // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
        /** Not an error; returned on success. */
        OK: "ok",
        /** The operation was cancelled (typically by the caller). */
        CANCELLED: "cancelled",
        /** Unknown error or an error from a different error domain. */
        UNKNOWN: "unknown",
        /**
         * Client specified an invalid argument. Note that this differs from
         * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
         * problematic regardless of the state of the system (e.g., a malformed file
         * name).
         */
        INVALID_ARGUMENT: "invalid-argument",
        /**
         * Deadline expired before operation could complete. For operations that
         * change the state of the system, this error may be returned even if the
         * operation has completed successfully. For example, a successful response
         * from a server could have been delayed long enough for the deadline to
         * expire.
         */
        DEADLINE_EXCEEDED: "deadline-exceeded",
        /** Some requested entity (e.g., file or directory) was not found. */
        NOT_FOUND: "not-found",
        /**
         * Some entity that we attempted to create (e.g., file or directory) already
         * exists.
         */
        ALREADY_EXISTS: "already-exists",
        /**
         * The caller does not have permission to execute the specified operation.
         * PERMISSION_DENIED must not be used for rejections caused by exhausting
         * some resource (use RESOURCE_EXHAUSTED instead for those errors).
         * PERMISSION_DENIED must not be used if the caller cannot be identified
         * (use UNAUTHENTICATED instead for those errors).
         */
        PERMISSION_DENIED: "permission-denied",
        /**
         * The request does not have valid authentication credentials for the
         * operation.
         */
        UNAUTHENTICATED: "unauthenticated",
        /**
         * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
         * entire file system is out of space.
         */
        RESOURCE_EXHAUSTED: "resource-exhausted",
        /**
         * Operation was rejected because the system is not in a state required for
         * the operation's execution. For example, directory to be deleted may be
         * non-empty, an rmdir operation is applied to a non-directory, etc.
         *
         * A litmus test that may help a service implementor in deciding
         * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
         *  (a) Use UNAVAILABLE if the client can retry just the failing call.
         *  (b) Use ABORTED if the client should retry at a higher-level
         *      (e.g., restarting a read-modify-write sequence).
         *  (c) Use FAILED_PRECONDITION if the client should not retry until
         *      the system state has been explicitly fixed. E.g., if an "rmdir"
         *      fails because the directory is non-empty, FAILED_PRECONDITION
         *      should be returned since the client should not retry unless
         *      they have first fixed up the directory by deleting files from it.
         *  (d) Use FAILED_PRECONDITION if the client performs conditional
         *      REST Get/Update/Delete on a resource and the resource on the
         *      server does not match the condition. E.g., conflicting
         *      read-modify-write on the same resource.
         */
        FAILED_PRECONDITION: "failed-precondition",
        /**
         * The operation was aborted, typically due to a concurrency issue like
         * sequencer check failures, transaction aborts, etc.
         *
         * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
         * and UNAVAILABLE.
         */
        ABORTED: "aborted",
        /**
         * Operation was attempted past the valid range. E.g., seeking or reading
         * past end of file.
         *
         * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
         * if the system state changes. For example, a 32-bit file system will
         * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
         * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
         * an offset past the current file size.
         *
         * There is a fair bit of overlap between FAILED_PRECONDITION and
         * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
         * when it applies so that callers who are iterating through a space can
         * easily look for an OUT_OF_RANGE error to detect when they are done.
         */
        OUT_OF_RANGE: "out-of-range",
        /** Operation is not implemented or not supported/enabled in this service. */
        UNIMPLEMENTED: "unimplemented",
        /**
         * Internal errors. Means some invariants expected by underlying System has
         * been broken. If you see one of these errors, Something is very broken.
         */
        INTERNAL: "internal",
        /**
         * The service is currently unavailable. This is a most likely a transient
         * condition and may be corrected by retrying with a backoff.
         *
         * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
         * and UNAVAILABLE.
         */
        UNAVAILABLE: "unavailable",
        /** Unrecoverable data loss or corruption. */
        DATA_LOSS: "data-loss"
      };
      k = class extends FirebaseError {
        /** @hideconstructor */
        constructor(e, t) {
          super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
          // class and so inheritance does not work correctly. We could alternatively
          // do the same "back-door inheritance" trick that FirebaseError does.
          this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
        }
      };
      __PRIVATE_OAuthToken = class {
        constructor(e, t) {
          this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
        }
      };
      __PRIVATE_EmptyAuthCredentialsProvider = class {
        getToken() {
          return Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(e, t) {
          e.enqueueRetryable((() => t(User.UNAUTHENTICATED)));
        }
        shutdown() {
        }
      };
      __PRIVATE_EmulatorAuthCredentialsProvider = class {
        constructor(e) {
          this.token = e, /**
           * Stores the listener registered with setChangeListener()
           * This isn't actually necessary since the UID never changes, but we use this
           * to verify the listen contract is adhered to in tests.
           */
          this.changeListener = null;
        }
        getToken() {
          return Promise.resolve(this.token);
        }
        invalidateToken() {
        }
        start(e, t) {
          this.changeListener = t, // Fire with initial user.
          e.enqueueRetryable((() => t(this.token.user)));
        }
        shutdown() {
          this.changeListener = null;
        }
      };
      r = class {
        constructor(e) {
          this.auth = null, e.onInit(((e2) => {
            this.auth = e2;
          }));
        }
        getToken() {
          return this.auth ? this.auth.getToken().then(((e) => e ? (__PRIVATE_hardAssert("string" == typeof e.accessToken, 42297, {
            Z: e
          }), new __PRIVATE_OAuthToken(e.accessToken, new User(this.auth.getUid()))) : null)) : Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(e, t) {
        }
        shutdown() {
        }
      };
      __PRIVATE_FirstPartyToken = class {
        constructor(e, t, r2) {
          this.ee = e, this.te = t, this.re = r2, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.ne = /* @__PURE__ */ new Map();
        }
        /**
         * Gets an authorization token, using a provided factory function, or return
         * null.
         */
        ie() {
          return this.re ? this.re() : null;
        }
        get headers() {
          this.ne.set("X-Goog-AuthUser", this.ee);
          const e = this.ie();
          return e && this.ne.set("Authorization", e), this.te && this.ne.set("X-Goog-Iam-Authorization-Token", this.te), this.ne;
        }
      };
      __PRIVATE_FirstPartyAuthCredentialsProvider = class {
        constructor(e, t, r2) {
          this.ee = e, this.te = t, this.re = r2;
        }
        getToken() {
          return Promise.resolve(new __PRIVATE_FirstPartyToken(this.ee, this.te, this.re));
        }
        start(e, t) {
          e.enqueueRetryable((() => t(User.FIRST_PARTY)));
        }
        shutdown() {
        }
        invalidateToken() {
        }
      };
      AppCheckToken = class {
        constructor(e) {
          this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
        }
      };
      o = class {
        constructor(e, t) {
          this.se = t, this.appCheck = null, this.oe = null, _isFirebaseServerApp(e) && e.settings.appCheckToken && (this.oe = e.settings.appCheckToken), t.onInit(((e2) => {
            this.appCheck = e2;
          }));
        }
        getToken() {
          return this.oe ? Promise.resolve(new AppCheckToken(this.oe)) : this.appCheck ? this.appCheck.getToken().then(((e) => e ? (__PRIVATE_hardAssert("string" == typeof e.token, 3470, {
            tokenResult: e
          }), new AppCheckToken(e.token)) : null)) : Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(e, t) {
        }
        shutdown() {
        }
      };
      DatabaseInfo = class {
        /**
         * Constructs a DatabaseInfo using the provided host, databaseId and
         * persistenceKey.
         *
         * @param databaseId - The database to use.
         * @param appId - The Firebase App Id.
         * @param persistenceKey - A unique identifier for this Firestore's local
         * storage (used in conjunction with the databaseId).
         * @param host - The Firestore backend host to connect to.
         * @param ssl - Whether to use SSL when connecting.
         * @param forceLongPolling - Whether to use the forceLongPolling option
         * when using WebChannel as the network transport.
         * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
         * option when using WebChannel as the network transport.
         * @param longPollingOptions - Options that configure long-polling.
         * @param useFetchStreams - Whether to use the Fetch API instead of
         * XMLHTTPRequest
         */
        constructor(e, t, r2, n2, i, s2, o2, a2, u2, _2, c2, l2, f2) {
          this.databaseId = e, this.appId = t, this.persistenceKey = r2, this.host = n2, this.ssl = i, this.forceLongPolling = s2, this.autoDetectLongPolling = o2, this.longPollingOptions = a2, this.useFetchStreams = u2, this.isUsingEmulator = _2, this.apiKey = c2, this._customHeaders = l2, this.grpcFlowControlWindow = f2;
        }
      };
      W = "(default)";
      DatabaseId = class _DatabaseId {
        constructor(e, t) {
          this.projectId = e, this.database = t || W;
        }
        static empty() {
          return new _DatabaseId("", "");
        }
        get isDefaultDatabase() {
          return this.database === W;
        }
        isEqual(e) {
          return e instanceof _DatabaseId && e.projectId === this.projectId && e.database === this.database;
        }
      };
      __PRIVATE_AutoId = class {
        static newId() {
          const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = 62 * Math.floor(256 / 62);
          let r2 = "";
          for (; r2.length < 20; ) {
            const n2 = __PRIVATE_randomBytes(40);
            for (let i = 0; i < n2.length; ++i)
              r2.length < 20 && n2[i] < t && (r2 += e.charAt(n2[i] % 62));
          }
          return r2;
        }
      };
      G = 55296;
      J = 57343;
      H = "__name__";
      BasePath = class _BasePath {
        constructor(e, t, r2) {
          void 0 === t ? t = 0 : t > e.length && z(637, {
            offset: t,
            range: e.length
          }), void 0 === r2 ? r2 = e.length - t : r2 > e.length - t && z(1746, {
            length: r2,
            range: e.length - t
          }), this.segments = e, this.offset = t, this.len = r2;
        }
        get length() {
          return this.len;
        }
        isEqual(e) {
          return 0 === _BasePath.comparator(this, e);
        }
        child(e) {
          const t = this.segments.slice(this.offset, this.limit());
          return e instanceof _BasePath ? e.forEach(((e2) => {
            t.push(e2);
          })) : t.push(e), this.construct(t);
        }
        /** The index of one past the last segment of the path. */
        limit() {
          return this.offset + this.length;
        }
        popFirst(e) {
          return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
        }
        popLast() {
          return this.construct(this.segments, this.offset, this.length - 1);
        }
        firstSegment() {
          return this.segments[this.offset];
        }
        lastSegment() {
          return this.get(this.length - 1);
        }
        get(e) {
          return this.segments[this.offset + e];
        }
        isEmpty() {
          return 0 === this.length;
        }
        isPrefixOf(e) {
          if (e.length < this.length) return false;
          for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
          return true;
        }
        isImmediateParentOf(e) {
          if (this.length + 1 !== e.length) return false;
          for (let t = 0; t < this.length; t++) if (this.get(t) !== e.get(t)) return false;
          return true;
        }
        forEach(e) {
          for (let t = this.offset, r2 = this.limit(); t < r2; t++) e(this.segments[t]);
        }
        toArray() {
          return this.segments.slice(this.offset, this.limit());
        }
        /**
         * Compare 2 paths segment by segment, prioritizing numeric IDs
         * (e.g., "__id123__") in numeric ascending order, followed by string
         * segments in lexicographical order.
         */
        static comparator(e, t) {
          const r2 = Math.min(e.length, t.length);
          for (let n2 = 0; n2 < r2; n2++) {
            const r3 = _BasePath.compareSegments(e.get(n2), t.get(n2));
            if (0 !== r3) return r3;
          }
          return __PRIVATE_primitiveComparator(e.length, t.length);
        }
        static compareSegments(e, t) {
          const r2 = _BasePath.isNumericId(e), n2 = _BasePath.isNumericId(t);
          return r2 && !n2 ? -1 : !r2 && n2 ? 1 : r2 && n2 ? _BasePath.extractNumericId(e).compare(_BasePath.extractNumericId(t)) : __PRIVATE_compareUtf8Strings(e, t);
        }
        // Checks if a segment is a numeric ID (starts with "__id" and ends with "__").
        static isNumericId(e) {
          return e.startsWith("__id") && e.endsWith("__");
        }
        static extractNumericId(e) {
          return Integer.fromString(e.substring(4, e.length - 2));
        }
      };
      ResourcePath = class _ResourcePath extends BasePath {
        construct(e, t, r2) {
          return new _ResourcePath(e, t, r2);
        }
        canonicalString() {
          return this.toArray().join("/");
        }
        toString() {
          return this.canonicalString();
        }
        toStringWithLeadingSlash() {
          return `/${this.canonicalString()}`;
        }
        /**
         * Returns a string representation of this path
         * where each path segment has been encoded with
         * `encodeURIComponent`.
         */
        toUriEncodedString() {
          return this.toArray().map(encodeURIComponent).join("/");
        }
        /**
         * Creates a resource path from the given slash-delimited string. If multiple
         * arguments are provided, all components are combined. Leading and trailing
         * slashes from all components are ignored.
         */
        static fromString(...e) {
          const t = [];
          for (const r2 of e) {
            if (r2.indexOf("//") >= 0) throw new k(x.INVALID_ARGUMENT, `Invalid segment (${r2}). Paths must not contain // in them.`);
            t.push(...r2.split("/").filter(((e2) => e2.length > 0)));
          }
          return new _ResourcePath(t);
        }
        static emptyPath() {
          return new _ResourcePath([]);
        }
      };
      Y = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
      X = class FieldPath extends BasePath {
        construct(e, t, r2) {
          return new FieldPath(e, t, r2);
        }
        /**
         * Returns true if the string could be used as a segment in a field path
         * without escaping.
         */
        static isValidIdentifier(e) {
          return Y.test(e);
        }
        canonicalString() {
          return this.toArray().map(((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), FieldPath.isValidIdentifier(e) || (e = "`" + e + "`"), e))).join(".");
        }
        toString() {
          return this.canonicalString();
        }
        /**
         * Returns true if this field references the key of a document.
         */
        isKeyField() {
          return 1 === this.length && this.get(0) === H;
        }
        /**
         * The field designating the key of a document.
         */
        static keyField() {
          return new FieldPath([H]);
        }
        /**
         * Parses a field string from the given server-formatted string.
         *
         * - Splitting the empty string is not allowed (for now at least).
         * - Empty segments within the string (e.g. if there are two consecutive
         *   separators) are not allowed.
         *
         * TODO(b/37244157): we should make this more strict. Right now, it allows
         * non-identifier path components, even if they aren't escaped.
         */
        static fromServerFormat(e) {
          const t = [];
          let r2 = "", n2 = 0;
          const __PRIVATE_addCurrentSegment = () => {
            if (0 === r2.length) throw new k(x.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            t.push(r2), r2 = "";
          };
          let i = false;
          for (; n2 < e.length; ) {
            const t2 = e[n2];
            if ("\\" === t2) {
              if (n2 + 1 === e.length) throw new k(x.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
              const t3 = e[n2 + 1];
              if ("\\" !== t3 && "." !== t3 && "`" !== t3) throw new k(x.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
              r2 += t3, n2 += 2;
            } else "`" === t2 ? (i = !i, n2++) : "." !== t2 || i ? (r2 += t2, n2++) : (__PRIVATE_addCurrentSegment(), n2++);
          }
          if (__PRIVATE_addCurrentSegment(), i) throw new k(x.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
          return new FieldPath(t);
        }
        static emptyPath() {
          return new FieldPath([]);
        }
      };
      S = class _S {
        constructor(e) {
          this.path = e;
        }
        static fromPath(e) {
          return new _S(ResourcePath.fromString(e));
        }
        static fromName(e) {
          return new _S(ResourcePath.fromString(e).popFirst(5));
        }
        static empty() {
          return new _S(ResourcePath.emptyPath());
        }
        get collectionGroup() {
          return this.path.popLast().lastSegment();
        }
        /** Returns true if the document is in the specified collectionId. */
        hasCollectionId(e) {
          return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
        }
        /** Returns the collection group (i.e. the name of the parent collection) for this key. */
        getCollectionGroup() {
          return this.path.get(this.path.length - 2);
        }
        /** Returns the fully qualified path to the parent collection. */
        getCollectionPath() {
          return this.path.popLast();
        }
        isEqual(e) {
          return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
        }
        toString() {
          return this.path.toString();
        }
        static comparator(e, t) {
          return ResourcePath.comparator(e.path, t.path);
        }
        static isDocumentKey(e) {
          return e.length % 2 == 0;
        }
        /**
         * Creates and returns a new document key with the given segments.
         *
         * @param segments - The segments of the path to the document
         * @returns A new instance of DocumentKey
         */
        static fromSegments(e) {
          return new _S(new ResourcePath(e.slice()));
        }
      };
      Z = null;
      ee = "RestConnection";
      te = {
        BatchGetDocuments: "batchGet",
        Commit: "commit",
        RunQuery: "runQuery",
        RunAggregationQuery: "runAggregationQuery",
        ExecutePipeline: "executePipeline"
      };
      __PRIVATE_RestConnection = class {
        get ae() {
          return false;
        }
        constructor(e) {
          this.databaseInfo = e, this.databaseId = e.databaseId;
          const t = e.ssl ? "https" : "http", r2 = encodeURIComponent(this.databaseId.projectId), n2 = encodeURIComponent(this.databaseId.database);
          this.ue = t + "://" + e.host, this._e = `projects/${r2}/databases/${n2}`, this.ce = this.databaseId.database === W ? `project_id=${r2}` : `project_id=${r2}&database_id=${n2}`;
        }
        le(e, t, r2, n2, i) {
          const s2 = __PRIVATE_generateUniqueDebugId(), o2 = this.fe(e, t.toUriEncodedString());
          a(ee, `Sending RPC '${e}' ${s2}:`, o2, r2);
          const u2 = {
            "google-cloud-resource-prefix": this._e,
            "x-goog-request-params": this.ce
          };
          this.he(u2, n2, i);
          const { host: _2 } = new URL(o2), c2 = isCloudWorkstation(_2);
          return this.de(e, o2, u2, r2, c2).then(((t2) => (a(ee, `Received RPC '${e}' ${s2}: `, t2), t2)), ((t2) => {
            throw __PRIVATE_logWarn(ee, `RPC '${e}' ${s2} failed with error: `, t2, "url: ", o2, "request:", r2), t2;
          }));
        }
        me(e, t, r2, n2, i, s2) {
          return this.le(e, t, r2, n2, i);
        }
        /**
         * Modifies the headers for a request, adding any authorization token if
         * present and any additional headers for the request.
         */
        he(e, t, r2) {
          if (e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
          // so we need to get its value when we need it in a function.
          (function __PRIVATE_getGoogApiClientValue() {
            return "gl-js/ fire/" + s;
          })(), // Content-Type: text/plain will avoid preflight requests which might
          // mess with CORS and redirects by proxies. If we add custom headers
          // we will need to change this code to potentially use the $httpOverwrite
          // parameter supported by ESF to avoid triggering preflight requests.
          e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach(((t2, r3) => e[r3] = t2)), r2 && r2.headers.forEach(((t2, r3) => e[r3] = t2)), this.databaseInfo._customHeaders) for (const t2 of Object.keys(this.databaseInfo._customHeaders)) e[t2] = this.databaseInfo._customHeaders[t2];
        }
        fe(e, t) {
          const r2 = te[e];
          let n2 = `${this.ue}/v1/${t}:${r2}`;
          return this.databaseInfo.apiKey && (n2 = `${n2}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`), n2;
        }
        /**
         * Closes and cleans up any resources associated with the connection. This
         * implementation is a no-op because there are no resources associated
         * with the RestConnection that need to be cleaned up.
         */
        terminate() {
        }
      };
      (ne = re || (re = {}))[ne.OK = 0] = "OK", ne[ne.CANCELLED = 1] = "CANCELLED", ne[ne.UNKNOWN = 2] = "UNKNOWN", ne[ne.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ne[ne.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ne[ne.NOT_FOUND = 5] = "NOT_FOUND", ne[ne.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ne[ne.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ne[ne.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ne[ne.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ne[ne.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ne[ne.ABORTED = 10] = "ABORTED", ne[ne.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ne[ne.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ne[ne.INTERNAL = 13] = "INTERNAL", ne[ne.UNAVAILABLE = 14] = "UNAVAILABLE", ne[ne.DATA_LOSS = 15] = "DATA_LOSS";
      __PRIVATE_FetchConnection = class extends __PRIVATE_RestConnection {
        Ee(e, t) {
          throw new Error("Not supported by FetchConnection");
        }
        async de(e, t, r2, n2, i) {
          const s2 = JSON.stringify(n2);
          let o2;
          try {
            const e2 = {
              method: "POST",
              headers: r2,
              body: s2
            };
            i && (e2.credentials = "include"), o2 = await fetch(t, e2);
          } catch (e2) {
            const t2 = e2, r3 = t2?.message, n3 = t2?.cause ? String(t2.cause) : void 0, i2 = (r3 && n3 ? `${r3} (${n3})` : r3 ?? n3) ?? t2?.statusText ?? String(e2);
            throw new k(__PRIVATE_mapCodeFromHttpStatus(t2?.status), `Request failed with error: ${i2}`);
          }
          if (!o2.ok) {
            let e2 = await o2.json();
            Array.isArray(e2) && (e2 = e2[0]);
            const t2 = e2?.error?.message;
            throw new k(__PRIVATE_mapCodeFromHttpStatus(o2.status), `Request failed with error: ${t2 ?? o2.statusText}`);
          }
          return o2.json();
        }
      };
      __PRIVATE_Base64DecodeError = class extends Error {
        constructor() {
          super(...arguments), this.name = "Base64DecodeError";
        }
      };
      ByteString = class _ByteString {
        constructor(e) {
          this.binaryString = e;
        }
        static fromBase64String(e) {
          const t = (function __PRIVATE_decodeBase64(e2) {
            try {
              return atob(e2);
            } catch (e3) {
              throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
            }
          })(e);
          return new _ByteString(t);
        }
        static fromUint8Array(e) {
          const t = (
            /**
            * Helper function to convert an Uint8array to a binary string.
            */
            (function __PRIVATE_binaryStringFromUint8Array(e2) {
              let t2 = "";
              for (let r2 = 0; r2 < e2.length; ++r2) t2 += String.fromCharCode(e2[r2]);
              return t2;
            })(e)
          );
          return new _ByteString(t);
        }
        [Symbol.iterator]() {
          let e = 0;
          return {
            next: () => e < this.binaryString.length ? {
              value: this.binaryString.charCodeAt(e++),
              done: false
            } : {
              value: void 0,
              done: true
            }
          };
        }
        toBase64() {
          return (function __PRIVATE_encodeBase64(e) {
            return btoa(e);
          })(this.binaryString);
        }
        toUint8Array() {
          return (function __PRIVATE_uint8ArrayFromBinaryString(e) {
            const t = new Uint8Array(e.length);
            for (let r2 = 0; r2 < e.length; r2++) t[r2] = e.charCodeAt(r2);
            return t;
          })(this.binaryString);
        }
        approximateByteSize() {
          return 2 * this.binaryString.length;
        }
        compareTo(e) {
          return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
        }
        isEqual(e) {
          return this.binaryString === e.binaryString;
        }
      };
      ByteString.EMPTY_BYTE_STRING = new ByteString("");
      __PRIVATE_QuadrupleBuilder = class ___PRIVATE_QuadrupleBuilder {
        constructor() {
          this.exponent = 0, this.Ve = 0n, this.Te = 0n, // Buffers used internally
          // The order of words in the arrays is big-endian: the highest part is in buff[0] (in buff[1] for
          // buffers of 10 words)
          this.Ie = new Array(4).fill(0n), this.Ae = new Array(6).fill(0n), this.Re = new Array(6).fill(0n), this.Pe = new Array(6).fill(0n), this.pe = new Array(12).fill(0n);
        }
        static ye(e, t) {
          let r2 = new ___PRIVATE_QuadrupleBuilder();
          return r2.parse(e, t), r2;
        }
        parse(e, t) {
          t += e.length - 1, // digits is viewed as x.yyy below.
          this.exponent = 0, this.Ve = 0n, this.Te = 0n;
          let r2 = this.Pe, n2 = this.be(e, r2);
          if (0 == n2 && this.isEmpty(r2))
            return;
          if ((t += n2) < ___PRIVATE_QuadrupleBuilder.we) return;
          if (t > ___PRIVATE_QuadrupleBuilder.ge) return void (this.exponent = Number(___PRIVATE_QuadrupleBuilder.Fe));
          let i = this.ve(t, r2);
          this.xe(t, i, r2);
        }
        be(e, t) {
          for (let e2 = 0; e2 < 6; e2++) t[e2] = 0n;
          let r2 = 0;
          for (; r2 < e.length && 0 == e[r2]; ) r2 += 1;
          if (r2 == e.length) return 0;
          let n2 = -r2;
          if (e.length - r2 > ___PRIVATE_QuadrupleBuilder.De) {
            let t2 = e[___PRIVATE_QuadrupleBuilder.De] >= 5, i = new Array(___PRIVATE_QuadrupleBuilder.De).fill(0);
            for (let t3 = 0; t3 < ___PRIVATE_QuadrupleBuilder.De; t3++) i[t3] = e[t3 + r2];
            t2 && // Round-up: add carry
            (n2 += this.Ne(i)), e = i, r2 = 0;
          }
          for (let n3 = e.length - 1; n3 >= r2; n3--)
            t[0] |= BigInt(e[n3]) << 32n, this.Se(t);
          return n2;
        }
        // Divides the unpacked value stored in the given buffer by 10
        // @param buffer contains the unpacked value to divide (32 least significant bits are used)
        Se(e) {
          let t = e.length;
          for (let r2 = 0; r2 < t; r2++) {
            let n2 = e[r2] % 10n;
            e[r2] = e[r2] / 10n, r2 + 1 < t && (e[r2 + 1] += n2 << 32n);
          }
        }
        // Checks if the buffer is empty (contains nothing but zeros)
        // @param buffer the buffer to check
        // @return {@code true} if the buffer is empty, {@code false} otherwise
        isEmpty(e) {
          for (let t = 0; t < e.length; t++) if (0n != e[t]) return false;
          return true;
        }
        // Adds one to a decimal number represented as a sequence of decimal digits. propagates carry as
        // needed, so that {@code addCarryTo("6789") = "6790", addCarryTo("9999") = "10000"} etc.
        // @return 1 if an additional higher "1" was added in front of the number as a result of
        //     rounding-up, 0 otherwise
        Ne(e) {
          for (let t = e.length - 1; t >= 0; t--) {
            if (9 != e[t]) return e[t] = e[t] + 1, 0;
            e[t] = 0;
          }
          return e[0] = 1, 1;
        }
        // Finds binary exponent, using decimal exponent and mantissa.<br>
        // exp2 = exp10 * log<sub>2</sub>(10) + log<sub>2</sub>(mant)<br>
        // @param exp10 decimal exponent
        // @param mantissa array of longs containing decimal mantissa (divided by 10)
        // @return found value of binary exponent
        ve(e, t) {
          let r2 = t[0] << 31n | t[1] >> 1n, n2 = Number(r2) / ___PRIVATE_QuadrupleBuilder.Ce;
          return Math.floor(Number(e) * ___PRIVATE_QuadrupleBuilder.Be + this.log2(n2));
        }
        // Calculates log<sub>2</sub> of the given x
        // @param x argument that can't be 0
        // @return the value of log<sub>2</sub>(x)
        log2(e) {
          return ___PRIVATE_QuadrupleBuilder.Qe * Math.log(e);
        }
        xe(e, t, r2) {
          let n2 = this.Ie;
          this.Oe(-t, n2);
          let i = this.pe;
          this.Me(r2, n2, i), // product in buff_12x32
          this.qe(i), // "Quasidecimals" are numbers divided by 10
          // The powerOf2[0] is stored as an unsigned value
          BigInt(n2[0]) != BigInt(-e) && // For some combinations of exp2 and exp10, additional multiplication needed
          // (see mant2_from_M_E_e.xls)
          this.qe(i), // compensate possible inaccuracy of logarithms used to compute exp2
          t += this.Le(i), // add bias
          // For subnormal values, exp2 <= 0. We just return 0 for them, as they are
          // far from any range we are interested in.
          (t += ___PRIVATE_QuadrupleBuilder.Ue) <= 0 || (t += this.$e(i), // round up, may require exponent correction
          BigInt(t) >= ___PRIVATE_QuadrupleBuilder.Fe ? this.exponent = Number(___PRIVATE_QuadrupleBuilder.Fe) : (this.exponent = Number(t), this.Ve = (i[0] << 32n) + i[1] & 0xffffffffffffffffn, this.Te = (i[2] << 32n) + i[3] & 0xffffffffffffffffn));
        }
        // Calculates the required power and returns the result in the quasidecimal format (an array of
        // longs, where result[0] is the decimal exponent of the resulting value, and result[1] --
        // result[3] contain 192 bits of the mantissa divided by ten (so that 8 looks like
        // <pre>{@code {1, 0xCCCC_.._CCCCL, 0xCCCC_.._CCCCL, 0xCCCC_.._CCCDL}}}</pre>
        // uses arrays <b><i>buffer4x64B</b>, buffer6x32A, buffer6x32B, buffer12x32</i></b>,
        // @param exp the power to raise 2 to
        // @param power (result) the value of {@code2^exp}
        Oe(e, t) {
          if (0 == e) return void this.ke(___PRIVATE_QuadrupleBuilder.je[0], t);
          let r2 = ___PRIVATE_QuadrupleBuilder.je;
          e < 0 && (e = -e, r2 = ___PRIVATE_QuadrupleBuilder.Ke);
          let n2 = ___PRIVATE_QuadrupleBuilder.ze, i = 32, s2 = true;
          for (; e > 0; ) e >= n2 && // the current bit in the exponent is 1
          (s2 ? (
            // 4 longs, power[0] -- decimal (?) exponent, power[1..3] -- 192 bits of mantissa
            (this.ke(r2[i], t), s2 = false)
          ) : (
            // Multiply by the corresponding power of 2
            this.We(t, r2[i], t)
          ), e -= n2), i -= 1, n2 *= 0.5;
        }
        // Copies from into to.
        ke(e, t) {
          for (let r2 = 0; r2 < t.length; r2++) t[r2] = e[r2];
        }
        // Multiplies two quasidecimal numbers contained in buffers of 3 x 64 bits with exponents, puts
        // the product to <b><i>buffer4x64B</i></b><br>
        // and returns it. Both each of the buffers and the product contain 4 longs - exponent and 3 x 64
        // bits of mantissa. If the higher word of mantissa of the product is less than
        // 0x1999_9999_9999_9999L (i.e. mantissa is less than 0.1) multiplies mantissa by 10 and adjusts
        // the exponent respectively.
        We(e, t, r2) {
          this.Ge(e, t, this.pe);
          let n2 = this.Je(this.pe);
          this.He(this.pe, r2), // result[0] is a signed int64 value stored in an uint64
          r2[0] = e[0] + t[0] + BigInt(n2);
        }
        // Multiplies mantissas of two packed quasidecimal values (each is an array of 4 longs, exponent +
        // 3 x 64 bits of mantissa) Returns the product as unpacked buffer of 12 x 32 (12 x 32 bits of
        // product)
        // uses arrays <b><i>buffer6x32A, buffer6x32B</b></i>
        // @param factor1 an array of longs containing factor 1 as packed quasidecimal
        // @param factor2 an array of longs containing factor 2 as packed quasidecimal
        // @param result an array of 12 longs filled with the product of mantissas
        Ge(e, t, r2) {
          for (let e2 = 0; e2 < r2.length; e2++) r2[e2] = 0n;
          this.Ye(e, this.Ae), this.Ye(t, this.Re);
          for (let e2 = 5; e2 >= 0; e2--)
            for (let t2 = 5; t2 >= 0; t2--) {
              let n2 = this.Ae[e2] * this.Re[t2];
              r2[t2 + e2 + 1] = r2[t2 + e2 + 1] + (n2 & ___PRIVATE_QuadrupleBuilder.Xe) & 0xffffffffffffffffn, r2[t2 + e2] = r2[t2 + e2] + (n2 >> 32n) & 0xffffffffffffffffn;
            }
          for (let e2 = 11; e2 >= 1; e2--) r2[e2 - 1] = r2[e2 - 1] + (r2[e2] >> 32n) & 0xffffffffffffffffn, r2[e2] &= ___PRIVATE_QuadrupleBuilder.Xe;
        }
        // Corrects possible underflow of the decimal mantissa, passed in in the {@code mantissa}, by
        // multiplying it by a power of ten. The corresponding value to adjust the decimal exponent is
        // returned as the result
        // @param mantissa a buffer containing the mantissa to be corrected
        // @return a corrective (addition) that is needed to adjust the decimal exponent of the number
        Je(e) {
          let t = 0;
          for (; this.Ze(e); )
            this.qe(e), t -= 1;
          return t;
        }
        // Checks if the unpacked quasidecimal value held in the given buffer is less than one (in this
        // format, one is represented as { 0x1999_9999L, 0x9999_9999L, 0x9999_9999L,...}
        // @param buffer a buffer containing the value to check
        // @return {@code true}, if the value is less than one
        Ze(e) {
          if (e[0] < 0x19999999n) return true;
          if (e[0] > 0x19999999n) return false;
          for (let t = 1; t < e.length; t++) {
            if (e[t] < 0x99999999n) return true;
            if (e[t] > 0x99999999n) return false;
          }
          return false;
        }
        // Multiplies unpacked 192-bit value by a packed 192-bit factor <br>
        // uses static arrays <b><i>buffer6x32B</i></b>
        // @param factor1 a buffer containing unpacked quasidecimal mantissa (6 x 32 bits)
        // @param factor2 an array of 4 longs containing packed quasidecimal power of two
        // @param product a buffer of at least 12 longs to hold the product
        Me(e, t, r2) {
          for (let e2 = 0; e2 < r2.length; e2++) r2[e2] = 0n;
          let n2 = this.Re;
          this.Ye(t, n2);
          let i = e.length;
          for (let t2 = i - 1; t2 >= 0; t2--)
            for (let s2 = i - 1; s2 >= 0; s2--) {
              let i2 = e[t2] * n2[s2];
              r2[s2 + t2 + 1] = r2[s2 + t2 + 1] + (i2 & ___PRIVATE_QuadrupleBuilder.Xe) & 0xffffffffffffffffn, r2[s2 + t2] = r2[s2 + t2] + (i2 >> 32n) & 0xffffffffffffffffn;
            }
          for (let e2 = 11; e2 >= 1; e2--) r2[e2 - 1] = r2[e2 - 1] + (r2[e2] >> 32n) & 0xffffffffffffffffn, r2[e2] &= ___PRIVATE_QuadrupleBuilder.Xe;
        }
        // Multiplies the unpacked value stored in the given buffer by 10
        // @param buffer contains the unpacked value to multiply (32 least significant bits are used)
        qe(e) {
          let t = e.length - 1;
          e[0] &= ___PRIVATE_QuadrupleBuilder.Xe, e[t] *= 10n;
          for (let r2 = t - 1; r2 >= 0; r2--) e[r2] = 10n * e[r2] + (e[r2 + 1] >> 32n) & 0xffffffffffffffffn, e[r2 + 1] &= ___PRIVATE_QuadrupleBuilder.Xe;
        }
        // Makes sure that the (unpacked) mantissa is normalized,
        // i.e. buff[0] contains 1 in bit 32 (the implied integer part) and higher 32 of mantissa in bits 31..0,
        // and buff[1]..buff[4] contain other 96 bits of mantissa in their lower halves:
        // <pre>0x0000_0001_XXXX_XXXXL, 0x0000_0000_XXXX_XXXXL...</pre>
        // If necessary, divides the mantissa by appropriate power of 2 to make it normal.
        // @param mantissa a buffer containing unpacked mantissa
        // @return if the mantissa was not normal initially, a correction that should be added to the result's exponent, or 0 otherwise
        Le(e) {
          let t = 31 - ___PRIVATE_QuadrupleBuilder.et(e[0]);
          return 0 != t && this.tt(e, t), t;
        }
        // Rounds up the contents of the unpacked buffer to 128 bits by adding unity one bit lower than
        // the lowest of these 128 bits. If carry propagates up to bit 33 of buff[0], shifts the buffer
        // rightwards to keep it normalized.
        // @param mantissa the buffer to get rounded
        // @return 1 if the buffer was shifted, 0 otherwise
        $e(e) {
          return this.rt(e, 5, 100n), // to compensate possible inaccuracy
          this.rt(e, 4, 0x80000000n), 0n != (e[0] & ___PRIVATE_QuadrupleBuilder.nt << 1n) ? (
            // carry's got propagated beyond the highest bit
            (this.tt(e, 1), 1)
          ) : 0;
        }
        // converts 192 most significant bits of the mantissa of a number from an unpacked quasidecimal
        // form (where 32 least significant bits only used) to a packed quasidecimal form (where buff[0]
        // contains the exponent and buff[1]..buff[3] contain 3 x 64 = 192 bits of mantissa)
        // @param unpackedMant a buffer of at least 6 longs containing an unpacked value
        // @param result a buffer of at least 4 long to hold the packed value
        // @return packedQD192 with words 1..3 filled with the packed mantissa. packedQD192[0] is not
        //     affected.
        He(e, t) {
          t[1] = (e[0] << 32n) + e[1], t[2] = (e[2] << 32n) + e[3], t[3] = (e[4] << 32n) + e[5];
        }
        // Unpacks the mantissa of a 192-bit quasidecimal (4 longs: exp10, mantHi, mantMid, mantLo) to a
        // buffer of 6 longs, where the least significant 32 bits of each long contains respective 32 bits
        // of the mantissa
        // @param qd192 array of 4 longs containing the number to unpack
        // @param buff_6x32 buffer of 6 long to hold the unpacked mantissa
        Ye(e, t) {
          t[0] = e[1] >> 32n, t[1] = e[1] & ___PRIVATE_QuadrupleBuilder.Xe, t[2] = e[2] >> 32n, t[3] = e[2] & ___PRIVATE_QuadrupleBuilder.Xe, t[4] = e[3] >> 32n, t[5] = e[3] & ___PRIVATE_QuadrupleBuilder.Xe;
        }
        // Divides the contents of the buffer by 2^exp2<br>
        // (shifts the buffer rightwards by exp2 if the exp2 is positive, and leftwards if it's negative),
        // keeping it unpacked (only lower 32 bits of each element are used, except the buff[0] whose
        // higher half is intended to contain integer part)
        // @param buffer the buffer to divide
        // @param exp2 the exponent of the power of two to divide by, expected to be
        tt(e, t) {
          let r2 = e.length - 1, n2 = BigInt(32 - Math.abs(t));
          if (t > 0) {
            let i = BigInt(t);
            for (let t2 = r2 + 1 - 1; t2 >= 1; t2--) e[t2] = e[t2] >> i | e[t2 - 1] << n2 & ___PRIVATE_QuadrupleBuilder.Xe;
            e[0] = e[0] >> i;
          } else if (t < 0) {
            let i = BigInt(-t);
            e[0] = 0xffffffffffffffffn & (e[0] << i | e[1] >> n2);
            for (let t2 = 1; t2 < r2; t2++) e[t2] = 0xffffffffffffffffn & (e[t2] << i & ___PRIVATE_QuadrupleBuilder.Xe | e[t2 + 1] >> n2);
            e[r2] = e[r2] << i & ___PRIVATE_QuadrupleBuilder.Xe;
          }
        }
        // Adds the summand to the idx'th word of the unpacked value stored in the buffer
        // and propagates carry as necessary
        // @param buff the buffer to add the summand to
        // @param idx  the index of the element to which the summand is to be added
        // @param summand the summand to add to the idx'th element of the buffer
        rt(e, t, r2) {
          let n2 = t;
          e[n2] = e[n2] + r2 & 0xffffffffffffffffn;
          for (let t2 = n2 + 1 - 1; t2 >= 1 && 0n != (e[t2] & ___PRIVATE_QuadrupleBuilder.nt); t2--) e[t2] &= ___PRIVATE_QuadrupleBuilder.Xe, e[t2 - 1] += 1n;
        }
        static et(e) {
          let t = Number(e >> 32n);
          return 0 == t ? 32 + Math.clz32(Number(BigInt.asUintN(32, e))) : Math.clz32(t);
        }
      };
      __PRIVATE_QuadrupleBuilder.De = 59, // Max value of the decimal exponent, corresponds to EXPONENT_OF_MAX_VALUE
      __PRIVATE_QuadrupleBuilder.ge = 646456993, // Min value of the decimal exponent, corresponds to EXPONENT_OF_MIN_NORMAL
      __PRIVATE_QuadrupleBuilder.we = -646457032, // (2^63) / 10 =~ 9.223372e17
      __PRIVATE_QuadrupleBuilder.Ce = 922337203685477600, // Just for convenience: 0x8000_0000_0000_0000L
      __PRIVATE_QuadrupleBuilder.it = 0x8000000000000000n, // Just for convenience: 0x8000_0000L, 2^31
      __PRIVATE_QuadrupleBuilder.ze = 2147483648, // Just for convenience: 0x0000_0000_FFFF_FFFFL
      __PRIVATE_QuadrupleBuilder.Xe = 0x00000000ffffffffn, // Just for convenience: 0xFFFF_FFFF_0000_0000L;
      __PRIVATE_QuadrupleBuilder.nt = 0xffffffff00000000n, // Approximate value of log<sub>2</sub>(10)
      __PRIVATE_QuadrupleBuilder.Be = Math.log(10) / Math.log(2), // Approximate value of log<sub>2</sub>(e)
      __PRIVATE_QuadrupleBuilder.Qe = 1 / Math.log(2), // The value of the exponent (biased) corresponding to {@code 1.0 == 2^0}; equals to 2_147_483_647
      // ({@code 0x7FFF_FFFF}).
      __PRIVATE_QuadrupleBuilder.Ue = 2147483647, // The value of the exponent (biased), corresponding to {@code Infinity}, {@code _Infinty}, and
      // {@code NaN}
      __PRIVATE_QuadrupleBuilder.Fe = 0xffffffffn, // An array of positive powers of two, each value consists of 4 longs: decimal exponent and 3 x 64
      // bits of mantissa, divided by ten Used to find an arbitrary power of 2 (by powerOfTwo(long exp))
      __PRIVATE_QuadrupleBuilder.je = [
        // 0: 2^0 =   1 = 0.1e1
        [1n, 0x1999999999999999n, 0x9999999999999999n, 0x999999999999999an],
        // 1: 2^(2^0) =   2^1 =   2 = 0.2e1
        [1n, 0x3333333333333333n, 0x3333333333333333n, 0x3333333333333334n],
        // ***
        // 2: 2^(2^1) =   2^2 =   4 = 0.4e1
        [1n, 0x6666666666666666n, 0x6666666666666666n, 0x6666666666666667n],
        // ***
        // 3: 2^(2^2) =   2^4 =   16 = 0.16e2
        [2n, 0x28f5c28f5c28f5c2n, 0x8f5c28f5c28f5c28n, 0xf5c28f5c28f5c290n],
        // ***
        // 4: 2^(2^3) =   2^8 =   256 = 0.256e3
        [3n, 0x4189374bc6a7ef9dn, 0xb22d0e5604189374n, 0xbc6a7ef9db22d0e6n],
        // ***
        // 5: 2^(2^4) =   2^16 =   65536 = 0.65536e5
        [5n, 0xa7c5ac471b478423n, 0x0fcf80dc33721d53n, 0xcddd6e04c0592104n],
        // 6: 2^(2^5) =   2^32 =   4294967296 = 0.4294967296e10
        [10n, 0x6df37f675ef6eadfn, 0x5ab9a2072d44268dn, 0x97df837e6748956en],
        // 7: 2^(2^6) =   2^64 =   18446744073709551616 = 0.18446744073709551616e20
        [20n, 0x2f394219248446ban, 0xa23d2ec729af3d61n, 0x0607aa0167dd94cbn],
        // 8: 2^(2^7) =   2^128 =   340282366920938463463374607431768211456 =
        // 0.340282366920938463463374607431768211456e39
        [39n, 0x571cbec554b60dbbn, 0xd5f64baf0506840dn, 0x451db70d5904029bn],
        // 9: 2^(2^8) =   2^256 =
        // 1.1579208923731619542357098500868790785326998466564056403945758401E+77 =
        // 0.11579208923731619542357098500868790785326998466564056403945758401e78
        [78n, 0x1da48ce468e7c702n, 0x6520247d3556476dn, 0x1469caf6db224cfan],
        // ***
        // 10: 2^(2^9) =   2^512 =
        // 1.3407807929942597099574024998205846127479365820592393377723561444E+154 =
        // 0.13407807929942597099574024998205846127479365820592393377723561444e155
        [155n, 0x2252f0e5b39769dcn, 0x9ae2eea30ca3ade0n, 0xeeaa3c08dfe84e30n],
        // 11: 2^(2^10) =   2^1024 =
        // 1.7976931348623159077293051907890247336179769789423065727343008116E+308 =
        // 0.17976931348623159077293051907890247336179769789423065727343008116e309
        [309n, 0x2e055c9a3f6ba793n, 0x16583a816eb60a59n, 0x22c4b0826cf1ebf7n],
        // 12: 2^(2^11) =   2^2048 =
        // 3.2317006071311007300714876688669951960444102669715484032130345428E+616 =
        // 0.32317006071311007300714876688669951960444102669715484032130345428e617
        [617n, 0x52bb45e9cf23f17fn, 0x7688c07606e50364n, 0xb34479aa9d449a57n],
        // 13: 2^(2^12) =   2^4096 =
        // 1.0443888814131525066917527107166243825799642490473837803842334833E+1233 =
        // 0.10443888814131525066917527107166243825799642490473837803842334833e1234
        [1234n, 0x1abc81c8ff5f846cn, 0x8f5e3c9853e38c97n, 0x45060097f3bf9296n],
        // 14: 2^(2^13) =   2^8192 =
        // 1.0907481356194159294629842447337828624482641619962326924318327862E+2466 =
        // 0.10907481356194159294629842447337828624482641619962326924318327862e2467
        [2467n, 0x1bec53b510daa7b4n, 0x48369ed77dbb0eb1n, 0x3b05587b2187b41en],
        // 15: 2^(2^14) =   2^16384 =
        // 1.1897314953572317650857593266280071307634446870965102374726748212E+4932 =
        // 0.11897314953572317650857593266280071307634446870965102374726748212e4933
        [4933n, 0x1e75063a5ba91326n, 0x8abfb8e460016ae3n, 0x28008702d29e8a3cn],
        // 16: 2^(2^15) =   2^32768 =
        // 1.4154610310449547890015530277449516013481307114723881672343857483E+9864 =
        // 0.14154610310449547890015530277449516013481307114723881672343857483e9865
        [9865n, 0x243c5d8bb5c5fa55n, 0x40c6d248c5881915n, 0x4c0fd99fd5befc22n],
        // 17: 2^(2^16) =   2^65536 =
        // 2.0035299304068464649790723515602557504478254755697514192650169737E+19728 =
        // 0.20035299304068464649790723515602557504478254755697514192650169737e19729
        [19729n, 0x334a5570c3f4ef3cn, 0xa13c36c43f979c90n, 0xda7ac473555fb7a8n],
        // 18: 2^(2^17) =   2^131072 =
        // 4.0141321820360630391660606060388767343771510270414189955825538065E+39456 =
        // 0.40141321820360630391660606060388767343771510270414189955825538065e39457
        [39457n, 0x66c304445dd98f3bn, 0xa8c293a20e47a41bn, 0x4c5b03dc12604964n],
        // 19: 2^(2^18) =   2^262144 =
        // 1.6113257174857604736195721184520050106440238745496695174763712505E+78913 =
        // 0.16113257174857604736195721184520050106440238745496695174763712505e78914
        [78914n, 0x293ffbf5fb028cc4n, 0x89d3e5ff44238406n, 0x369a339e1bfe8c9bn],
        // 20: 2^(2^19) =   2^524288 =
        // 2.5963705678310007761265964957268828277447343763484560463573654868E+157826 =
        // 0.25963705678310007761265964957268828277447343763484560463573654868e157827
        [157827n, 0x427792fbb68e5d20n, 0x7b297cd9fc154b62n, 0xf09142114aa9a20cn],
        // 21: 2^(2^20) =   2^1048576 =
        // 6.7411401254990734022690651047042454376201859485326882846944915676E+315652 =
        // 0.67411401254990734022690651047042454376201859485326882846944915676e315653
        [315653n, 0xac92bc65ad5c08fcn, 0x00beeb115a566c19n, 0x4ba882d8a4622437n],
        // 22: 2^(2^21) =   2^2097152 =
        // 4.5442970191613663099961595907970650433180103994591456270882095573E+631305 =
        // 0.45442970191613663099961595907970650433180103994591456270882095573e631306
        [631306n, 0x745581440f92e80en, 0x4da822cf7f896f41n, 0x509d598678164ecdn],
        // 23: 2^(2^22) =   2^4194304 =
        // 2.0650635398358879243991194945816501695274360493029670347841664177E+1262611 =
        // 0.20650635398358879243991194945816501695274360493029670347841664177e1262612
        [1262612n, 0x34dd99b4c69523a5n, 0x64bc2e8f0d8b1044n, 0xb03b1c96da5dd349n],
        // 24: 2^(2^23) =   2^8388608 =
        // 4.2644874235595278724327289260856157547554200794957122157246170406E+2525222 =
        // 0.42644874235595278724327289260856157547554200794957122157246170406e2525223
        [2525223n, 0x6d2bbea9d6d25a08n, 0xa0a4606a88e96b70n, 0x182063bbc2fe8520n],
        // 25: 2^(2^24) =   2^16777216 =
        // 1.8185852985697380078927713277749906189248596809789408311078112486E+5050445 =
        // 0.18185852985697380078927713277749906189248596809789408311078112486e5050446
        [5050446n, 0x2e8e47d63bfdd6e3n, 0x2b55fa8976eaa3e9n, 0x1a6b9d3086412a73n],
        // 26: 2^(2^25) =   2^33554432 =
        // 3.3072524881739831340558051919726975471129152081195558970611353362E+10100890 =
        // 0.33072524881739831340558051919726975471129152081195558970611353362e10100891
        [10100891n, 0x54aa68efa1d719dfn, 0xd8505806612c5c8fn, 0xad068837fee8b43an],
        // 27: 2^(2^26) =   2^67108864 =
        // 1.0937919020533002449982468634925923461910249420785622990340704603E+20201781 =
        // 0.10937919020533002449982468634925923461910249420785622990340704603e20201782
        [20201782n, 0x1c00464ccb7bae77n, 0x9e3877784c77982cn, 0xd94af3b61717404fn],
        // 28: 2^(2^27) =   2^134217728 =
        // 1.1963807249973763567102377630870670302911237824129274789063323723E+40403562 =
        // 0.11963807249973763567102377630870670302911237824129274789063323723e40403563
        [40403563n, 0x1ea099c8be2b6cd0n, 0x8bfb6d539fa50466n, 0x6d3bc37e69a84218n],
        // 29: 2^(2^28) =   2^268435456 =
        // 1.4313268391452478724777126233530788980596273340675193575004129517E+80807124 =
        // 0.14313268391452478724777126233530788980596273340675193575004129517e80807125
        [80807125n, 0x24a457f466ce8d18n, 0xf2c8f3b81bc6bb59n, 0xa78c757692e02d49n],
        // 30: 2^(2^29) =   2^536870912 =
        // 2.0486965204575262773910959587280218683219330308711312100181276813E+161614248 =
        // 0.20486965204575262773910959587280218683219330308711312100181276813e161614249
        [161614249n, 0x347256677aba6b53n, 0x3fbf90d30611a67cn, 0x1e039d87e0bdb32bn],
        // 31: 2^(2^30) =   2^1073741824 =
        // 4.1971574329347753848087162337676781412761959309467052555732924370E+323228496 =
        // 0.41971574329347753848087162337676781412761959309467052555732924370e323228497
        [323228497n, 0x6b727daf0fd3432an, 0x71f71121f9e4200fn, 0x8fcd9942d486c10cn],
        // 32: 2^(2^31) =   2^2147483648 =
        // 1.7616130516839633532074931497918402856671115581881347960233679023E+646456993 =
        // 0.17616130516839633532074931497918402856671115581881347960233679023e646456994
        [646456994n, 0x2d18e84484d91f78n, 0x4079bfe7829dec6fn, 0x21551643e365abc6n]
      ], // An array of negative powers of two, each value consists of 4 longs: decimal exponent and 3 x 64
      // bits of mantissa, divided by ten. Used to find an arbitrary power of 2 (by powerOfTwo(long exp))
      __PRIVATE_QuadrupleBuilder.Ke = [
        // v18
        // 0: 2^0 =   1 = 0.1e1
        [1n, 0x1999999999999999n, 0x9999999999999999n, 0x999999999999999an],
        // 1: 2^-(2^0) =   2^-1 =   0.5 = 0.5e0
        [0n, 0x8000000000000000n, 0x0000000000000000n, 0x0000000000000000n],
        // 2: 2^-(2^1) =   2^-2 =   0.25 = 0.25e0
        //      {0, 0x4000_0000_0000_0000L, 0x0000_0000_0000_0000L, 0x0000_0000_0000_0000L},
        [0n, 0x4000000000000000n, 0x0000000000000000n, 0x0000000000000001n],
        // ***
        // 3: 2^-(2^2) =   2^-4 =   0.0625 = 0.625e-1
        [-1n, 0xa000000000000000n, 0x0000000000000000n, 0x0000000000000000n],
        // 4: 2^-(2^3) =   2^-8 =   0.00390625 = 0.390625e-2
        [-2n, 0x6400000000000000n, 0x0000000000000000n, 0x0000000000000000n],
        // 5: 2^-(2^4) =   2^-16 =   0.0000152587890625 = 0.152587890625e-4
        [-4n, 0x2710000000000000n, 0x0000000000000000n, 0x0000000000000001n],
        // ***
        // 6: 2^-(2^5) =   2^-32 =   2.3283064365386962890625E-10 = 0.23283064365386962890625e-9
        [-9n, 0x3b9aca0000000000n, 0x0000000000000000n, 0x0000000000000001n],
        // ***
        // 7: 2^-(2^6) =   2^-64 =   5.42101086242752217003726400434970855712890625E-20 =
        // 0.542101086242752217003726400434970855712890625e-19
        [-19n, 0x8ac7230489e80000n, 0x0000000000000000n, 0x0000000000000000n],
        // 8: 2^-(2^7) =   2^-128 =
        // 2.9387358770557187699218413430556141945466638919302188037718792657E-39 =
        // 0.29387358770557187699218413430556141945466638919302188037718792657e-38
        [-38n, 0x4b3b4ca85a86c47an, 0x098a224000000000n, 0x0000000000000001n],
        // ***
        // 9: 2^-(2^8) =   2^-256 =
        // 8.6361685550944446253863518628003995711160003644362813850237034700E-78 =
        // 0.86361685550944446253863518628003995711160003644362813850237034700e-77
        [-77n, 0xdd15fe86affad912n, 0x49ef0eb713f39eben, 0xaa987b6e6fd2a002n],
        // 10: 2^-(2^9) =   2^-512 =
        // 7.4583407312002067432909653154629338373764715346004068942715183331E-155 =
        // 0.74583407312002067432909653154629338373764715346004068942715183331e-154
        [-154n, 0xbeeefb584aff8603n, 0xaafb550ffacfd8fan, 0x5ca47e4f88d45371n],
        // 11: 2^-(2^10) =   2^-1024 =
        // 5.5626846462680034577255817933310101605480399511558295763833185421E-309 =
        // 0.55626846462680034577255817933310101605480399511558295763833185421e-308
        [-308n, 0x8e679c2f5e44ff8fn, 0x570f09eaa7ea7648n, 0x5961db50c6d2b888n],
        // ***
        // 12: 2^-(2^11) =   2^-2048 =
        // 3.0943460473825782754801833699711978538925563038849690459540984582E-617 =
        // 0.30943460473825782754801833699711978538925563038849690459540984582e-616
        [-616n, 0x4f371b3399fc2ab0n, 0x8170041c9feb05aan, 0xc7c343447c75bcf6n],
        // 13: 2^-(2^12) =   2^-4096 =
        // 9.5749774609521853579467310122804202420597417413514981491308464986E-1234 =
        // 0.95749774609521853579467310122804202420597417413514981491308464986e-1233
        [-1233n, 0xf51e928179013fd3n, 0xde4bd12cde4d985cn, 0x4a573ca6f94bff14n],
        // 14: 2^-(2^13) =   2^-8192 =
        // 9.1680193377742358281070619602424158297818248567928361864131947526E-2467 =
        // 0.91680193377742358281070619602424158297818248567928361864131947526e-2466
        [-2466n, 0xeab388127bccaff7n, 0x1667639142b9fbaen, 0x775ec9995e1039fbn],
        // 15: 2^-(2^14) =   2^-16384 =
        // 8.4052578577802337656566945433043815064951983621161781002720680748E-4933 =
        // 0.84052578577802337656566945433043815064951983621161781002720680748e-4932
        [-4932n, 0xd72cb2a95c7ef6ccn, 0xe81bf1e825ba7515n, 0xc2feb521d6cb5dcdn],
        // 16: 2^-(2^15) =   2^-32768 =
        // 7.0648359655776364427774021878587184537374439102725065590941425796E-9865 =
        // 0.70648359655776364427774021878587184537374439102725065590941425796e-9864
        [-9864n, 0xb4dc1be6604502dcn, 0xd491079b8eef6535n, 0x578d3965d24de84dn],
        // ***
        // 17: 2^-(2^16) =   2^-65536 =
        // 4.9911907220519294656590574792132451973746770423207674161425040336E-19729 =
        // 0.49911907220519294656590574792132451973746770423207674161425040336e-19728
        [-19728n, 0x7fc6447bee60ea43n, 0x2548da5c8b125b27n, 0x5f42d1142f41d349n],
        // ***
        // 18: 2^-(2^17) =   2^-131072 =
        // 2.4911984823897261018394507280431349807329035271689521242878455599E-39457 =
        // 0.24911984823897261018394507280431349807329035271689521242878455599e-39456
        [-39456n, 0x3fc65180f88af8fbn, 0x6a6915f383349413n, 0x063c3708b6ceb291n],
        // ***
        // 19: 2^-(2^18) =   2^-262144 =
        // 6.2060698786608744707483205572846793091942192651991171731773832448E-78914 =
        // 0.62060698786608744707483205572846793091942192651991171731773832448e-78913
        [-78913n, 0x9ee0197c8dcd55bfn, 0x2b2b9b942c38f4a2n, 0x0f8ba634e9c706aen],
        // 20: 2^-(2^19) =   2^-524288 =
        // 3.8515303338821801176537443725392116267291403078581314096728076497E-157827 =
        // 0.38515303338821801176537443725392116267291403078581314096728076497e-157826
        [-157826n, 0x629963a25b8b2d79n, 0xd00b9d2286f70876n, 0xe97004700c3644fcn],
        // ***
        // 21: 2^-(2^20) =   2^-1048576 =
        // 1.4834285912814577854404052243709225888043963245995136935174170977E-315653 =
        // 0.14834285912814577854404052243709225888043963245995136935174170977e-315652
        [-315652n, 0x25f9cc308ceef4f3n, 0x40f19543911a4546n, 0xa2cd389452cfc366n],
        // 22: 2^-(2^21) =   2^-2097152 =
        // 2.2005603854312903332428997579002102976620485709683755186430397089E-631306 =
        // 0.22005603854312903332428997579002102976620485709683755186430397089e-631305
        [-631305n, 0x385597b0d47e76b8n, 0x1b9f67e103bf2329n, 0xc3119848595985f7n],
        // 23: 2^-(2^22) =   2^-4194304 =
        // 4.8424660099295090687215589310713586524081268589231053824420510106E-1262612 =
        // 0.48424660099295090687215589310713586524081268589231053824420510106e-1262611
        [-1262611n, 0x7bf795d276c12f66n, 0x66a61d62a446659an, 0xa1a4d73bebf093d5n],
        // ***
        // 24: 2^-(2^23) =   2^-8388608 =
        // 2.3449477057322620222546775527242476219043877555386221929831430440E-2525223 =
        // 0.23449477057322620222546775527242476219043877555386221929831430440e-2525222
        [-2525222n, 0x3c07d96ab1ed7799n, 0xcb7355c22cc05ac0n, 0x4ffc0ab73b1f6a49n],
        // ***
        // 25: 2^-(2^24) =   2^-16777216 =
        // 5.4987797426189993226257377747879918011694025935111951649826798628E-5050446 =
        // 0.54987797426189993226257377747879918011694025935111951649826798628e-5050445
        [-5050445n, 0x8cc4cd8c3edefb9an, 0x6c8ff86a90a97e0cn, 0x166cfddbf98b71bfn],
        // ***
        // 26: 2^-(2^25) =   2^-33554432 =
        // 3.0236578657837068435515418409027857523343464783010706819696074665E-10100891 =
        // 0.30236578657837068435515418409027857523343464783010706819696074665e-10100890
        [-10100890n, 0x4d67d81cc88e1228n, 0x1d7cfb06666b79b3n, 0x7b916728aaa4e70dn],
        // ***
        // 27: 2^-(2^26) =   2^-67108864 =
        // 9.1425068893156809483320844568740945600482370635012633596231964471E-20201782 =
        // 0.91425068893156809483320844568740945600482370635012633596231964471e-20201781
        [-20201781n, 0xea0c55494e7a552dn, 0xb88cb9484bb86c61n, 0x8d44893c610bb7dfn],
        // ***
        // 28: 2^-(2^27) =   2^-134217728 =
        // 8.3585432221184688810803924874542310018191301711943564624682743545E-40403563 =
        // 0.83585432221184688810803924874542310018191301711943564624682743545e-40403562
        [-40403562n, 0xd5fa8c821ec0c24an, 0xa80e46e764e0f8b0n, 0xa7276bfa432fac7en],
        // 29: 2^-(2^28) =   2^-268435456 =
        // 6.9865244796022595809958912202005005328020601847785697028605460277E-80807125 =
        // 0.69865244796022595809958912202005005328020601847785697028605460277e-80807124
        [-80807124n, 0xb2dae307426f6791n, 0xc970b82f58b12918n, 0x0472592f7f39190en],
        // 30: 2^-(2^29) =   2^-536870912 =
        // 4.8811524304081624052042871019605298977947353140996212667810837790E-161614249 =
        // 0.48811524304081624052042871019605298977947353140996212667810837790e-161614248
        //      {-161614248, 0x7cf5_1edd_8a15_f1c9L, 0x656d_ab34_98f8_e697L, 0x12da_a2a8_0e53_c809L},
        [-161614248n, 0x7cf51edd8a15f1c9n, 0x656dab3498f8e697n, 0x12daa2a80e53c807n],
        // 31: 2^-(2^30) =   2^-1073741824 =
        // 2.3825649048879510732161697817326745204151961255592397879550237608E-323228497 =
        // 0.23825649048879510732161697817326745204151961255592397879550237608e-323228496
        [-323228496n, 0x3cfe609ab5883c50n, 0xbec8b5d22b198871n, 0xe18477703b4622b4n],
        // 32: 2^-(2^31) =   2^-2147483648 =
        // 5.6766155260037313438164181629489689531186932477276639365773003794E-646456994 =
        // 0.56766155260037313438164181629489689531186932477276639365773003794e-646456993
        [-646456993n, 0x9152447b9d7cda9an, 0x3b4d3f6110d77aadn, 0xfa81bad1c394adb4n]
      ];
      __PRIVATE_Quadruple = class ___PRIVATE_Quadruple {
        constructor(e, t, r2, n2) {
          this.negative = e, this.st = t, this.Ve = r2, this.Te = n2;
        }
        /** Return the (unbiased) exponent of this {@link Quadruple}. */
        exponent() {
          return this.st - __PRIVATE_QuadrupleBuilder.Ue;
        }
        /** Return true if this {@link Quadruple} is -0 or +0 */
        ot() {
          return 0 === this.st && 0n === this.Ve && 0n === this.Te;
        }
        /** Return true if this {@link Quadruple} is -infinity or +infinity */
        ut() {
          return this.st === __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "f", se) && 0n === this.Ve && 0n === this.Te;
        }
        /** Return true if this {@link Quadruple} is a NaN. */
        isNaN() {
          return this.st === __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "f", se) && !(0n === this.Ve && 0n === this.Te);
        }
        /** Compare two quadruples, with -0 < 0, and all NaNs equal and larger than all numbers. */
        compareTo(e) {
          if (this.isNaN()) return e.isNaN() ? 0 : 1;
          if (e.isNaN()) return -1;
          let t, r2;
          if (this.negative) {
            if (!e.negative) return -1;
            t = 1, r2 = -1;
          } else {
            if (e.negative) return 1;
            t = -1, r2 = 1;
          }
          return this.st < e.st ? t : this.st > e.st ? r2 : this.Ve < e.Ve ? t : this.Ve > e.Ve ? r2 : this.Te < e.Te ? t : this.Te > e.Te ? r2 : 0;
        }
        debug() {
          return (this.negative ? "+" : "-") + __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", oe).call(___PRIVATE_Quadruple, this.Ve) + __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", oe).call(___PRIVATE_Quadruple, this.Te) + "*2^" + this.exponent();
        }
        static fromNumber(e) {
          if (isNaN(e)) return ___PRIVATE_Quadruple.NaN;
          if (!isFinite(e)) return e < 0 ? ___PRIVATE_Quadruple._t : ___PRIVATE_Quadruple.ct;
          if (0 === e)
            return Math.sign(1 / e) > 0 ? ___PRIVATE_Quadruple.lt : ___PRIVATE_Quadruple.ft;
          const t = new DataView(new ArrayBuffer(8));
          t.setFloat64(0, e);
          const r2 = t.getBigUint64(0);
          let n2 = BigInt.asUintN(64, r2 << 12n), i = 2047 & Number(r2 >> 52n);
          if (0 === i) {
            const e2 = __PRIVATE_QuadrupleBuilder.et(n2);
            n2 = e2 < 63 ? n2 << BigInt(e2 + 1) : 0n, i = -e2;
          }
          return new ___PRIVATE_Quadruple(e < 0, __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", _e).call(___PRIVATE_Quadruple, i - 1023), n2, 0n);
        }
        /**
         * Converts a decimal number to a {@link Quadruple}. The supported format (no whitespace allowed)
         * is:
         *
         * <ul>
         *   <li><code>NaN</code> for Quadruple.NaN
         *   <li><code>Infinity</code> or <code>+Infinity</code> for Quadruple.POSITIVE_INFINITY
         *   <li><code>-Infinity</code> for Quadruple.NEGATIVE_INFINITY
         *   <li>String matching the regular expression: <code>[+-]?[0-9]*(\.[0-9]*)?([eE][+-]?[0-9]+)?</code> - the exponent cannot be more
         *       than 9 digits, and the whole string cannot be empty
         * </ul>
         */
        static fromString(e) {
          if ("NaN" === e) return ___PRIVATE_Quadruple.NaN;
          if ("-Infinity" === e) return ___PRIVATE_Quadruple._t;
          if ("Infinity" === e || "+Infinity" === e) return ___PRIVATE_Quadruple.ct;
          const t = new Array(e.length).fill(0);
          let r2 = 0, n2 = 0, i = 0, s2 = false;
          for ("-" === e[r2] ? (s2 = true, r2++) : "+" === e[r2] && r2++; __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ae).call(___PRIVATE_Quadruple, e, r2); ) t[n2++] = __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ue).call(___PRIVATE_Quadruple, e, r2++);
          if ("." === e[r2]) {
            const s3 = ++r2;
            for (; __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ae).call(___PRIVATE_Quadruple, e, r2); ) t[n2++] = __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ue).call(___PRIVATE_Quadruple, e, r2++);
            i = s3 - r2;
          }
          if ("e" === e[r2] || "E" === e[r2]) {
            let t2 = 0;
            r2++;
            let n3 = 1;
            "-" === e[r2] ? (n3 = -1, r2++) : "+" === e[r2] && r2++;
            const s3 = r2;
            for (; __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ae).call(___PRIVATE_Quadruple, e, r2); ) if (t2 = 10 * t2 + __classPrivateFieldGet(___PRIVATE_Quadruple, ie, "m", ue).call(___PRIVATE_Quadruple, e, r2++), r2 - s3 > 9) throw new Error("Exponent too large " + e);
            if (r2 === s3) throw new Error("Invalid number " + e);
            i += t2 * n3;
          }
          if (0 === n2 || r2 !== e.length) throw new Error("Invalid number " + e);
          const o2 = __PRIVATE_QuadrupleBuilder.ye(t.slice(0, n2), i);
          return new ___PRIVATE_Quadruple(s2, o2.exponent, o2.Ve, o2.Te);
        }
      };
      ie = __PRIVATE_Quadruple, oe = function ___PRIVATE_Quadruple_hex(e) {
        return e.toString(16).padStart(16, "0");
      }, ae = function ___PRIVATE_Quadruple_isDigit(e, t) {
        const r2 = e.codePointAt(t);
        return void 0 !== r2 && r2 >= 48 && r2 <= 57;
      }, ue = function ___PRIVATE_Quadruple_digit(e, t) {
        return e.codePointAt(t) - 48;
      }, _e = function ___PRIVATE_Quadruple_bias(e) {
        return e + __PRIVATE_QuadrupleBuilder.Ue;
      }, se = {
        value: Number(__PRIVATE_QuadrupleBuilder.Fe)
      }, __PRIVATE_Quadruple.lt = new __PRIVATE_Quadruple(false, 0, 0n, 0n), __PRIVATE_Quadruple.ft = new __PRIVATE_Quadruple(true, 0, 0n, 0n), __PRIVATE_Quadruple.NaN = new __PRIVATE_Quadruple(false, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "f", se), 1n << 63n, 0n), __PRIVATE_Quadruple._t = new __PRIVATE_Quadruple(true, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "f", se), 0n, 0n), __PRIVATE_Quadruple.ct = new __PRIVATE_Quadruple(false, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "f", se), 0n, 0n), new __PRIVATE_Quadruple(true, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "m", _e).call(__PRIVATE_Quadruple, 63), 0n, 0n), new __PRIVATE_Quadruple(false, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "m", _e).call(__PRIVATE_Quadruple, 0), 0n, 0n), new __PRIVATE_Quadruple(true, __classPrivateFieldGet(__PRIVATE_Quadruple, ie, "m", _e).call(__PRIVATE_Quadruple, 0), 0n, 0n);
      ce = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
      le = -62135596800;
      fe = 1e6;
      Timestamp = class _Timestamp {
        /**
         * Creates a new timestamp with the current date, with millisecond precision.
         *
         * @returns a new timestamp representing the current date.
         */
        static now() {
          return _Timestamp.fromMillis(Date.now());
        }
        /**
         * Creates a new timestamp from the given date.
         *
         * @param date - The date to initialize the `Timestamp` from.
         * @returns A new `Timestamp` representing the same point in time as the given
         *     date.
         */
        static fromDate(e) {
          return _Timestamp.fromMillis(e.getTime());
        }
        /**
         * Creates a new timestamp from the given number of milliseconds.
         *
         * @param milliseconds - Number of milliseconds since Unix epoch
         *     1970-01-01T00:00:00Z.
         * @returns A new `Timestamp` representing the same point in time as the given
         *     number of milliseconds.
         */
        static fromMillis(e) {
          const t = Math.floor(e / 1e3), r2 = Math.floor((e - 1e3 * t) * fe);
          return new _Timestamp(t, r2);
        }
        /**
         * Creates a new timestamp from the given `Temporal.Instant`.
         *
         * @param instant - The `Temporal.Instant` to initialize the `Timestamp` from.
         * @returns A new `Timestamp` representing the same point in time as the given
         *     instant.
         */
        static fromInstant(e) {
          if (!e || "bigint" != typeof e.ht) throw new k(x.INVALID_ARGUMENT, "Invalid Temporal.Instant object provided.");
          return _Timestamp._fromEpochNanoseconds(e.ht);
        }
        static _fromEpochNanoseconds(e) {
          let t, r2;
          if (e >= 0n) t = Number(e / 1000000000n), r2 = Number(e % 1000000000n);
          else {
            const n2 = e % 1000000000n;
            0n === n2 ? (t = Number(e / 1000000000n), r2 = 0) : (t = Number(e / 1000000000n - 1n), r2 = Number(n2 + 1000000000n));
          }
          return new _Timestamp(t, r2);
        }
        /**
         * Creates a new timestamp.
         *
         * @param seconds - The number of seconds of UTC time since Unix epoch
         *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
         *     9999-12-31T23:59:59Z inclusive.
         * @param nanoseconds - The non-negative fractions of a second at nanosecond
         *     resolution. Negative second values with fractions must still have
         *     non-negative nanoseconds values that count forward in time. Must be
         *     from 0 to 999,999,999 inclusive.
         */
        constructor(e, t) {
          if (this.seconds = e, this.nanoseconds = t, t < 0) throw new k(x.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
          if (t >= 1e9) throw new k(x.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
          if (e < le) throw new k(x.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
          if (e >= 253402300800) throw new k(x.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
        }
        /**
         * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
         * causes a loss of precision since `Date` objects only support millisecond
         * precision.
         *
         * @returns JavaScript `Date` object representing the same point in time as
         *     this `Timestamp`, with millisecond precision.
         */
        toDate() {
          return new Date(this.toMillis());
        }
        /**
         * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
         * epoch). This operation causes a loss of precision.
         *
         * @returns The point in time corresponding to this timestamp, represented as
         *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
         */
        toMillis() {
          return 1e3 * this.seconds + this.nanoseconds / fe;
        }
        /**
         * Converts a `Timestamp` to a `Temporal.Instant` object.
         *
         * @returns `Temporal.Instant` object representing the same point in time as
         *     this `Timestamp`.
         */
        toInstant() {
          if ("undefined" == typeof Temporal || !Temporal.Instant) throw new k(x.FAILED_PRECONDITION, "The Temporal object is not available in the current environment.");
          const e = 1000000000n * BigInt(this.seconds) + BigInt(this.nanoseconds);
          return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e);
        }
        _compareTo(e) {
          return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
        }
        /**
         * Returns true if this `Timestamp` is equal to the provided one.
         *
         * @param other - The `Timestamp` to compare against.
         * @returns true if this `Timestamp` is equal to the provided one.
         */
        isEqual(e) {
          return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
        }
        /** Returns a textual representation of this `Timestamp`. */
        toString() {
          return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
        }
        /**
         * Returns a JSON-serializable representation of this `Timestamp`.
         */
        toJSON() {
          return {
            type: _Timestamp._jsonSchemaVersion,
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
          };
        }
        /**
         * Builds a `Timestamp` instance from a JSON object created by {@link Timestamp.toJSON}.
         */
        static fromJSON(e) {
          if (__PRIVATE_validateJSON(e, _Timestamp._jsonSchema)) return new _Timestamp(e.seconds, e.nanoseconds);
        }
        /**
         * Converts this object to a primitive string, which allows `Timestamp` objects
         * to be compared using the `>`, `<=`, `>=` and `>` operators.
         */
        valueOf() {
          const e = this.seconds - le;
          return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
        }
      };
      Timestamp._jsonSchemaVersion = "firestore/timestamp/1.0", Timestamp._jsonSchema = {
        type: property("string", Timestamp._jsonSchemaVersion),
        seconds: property("number"),
        nanoseconds: property("number")
      };
      he = "__type__";
      de = "__vector__";
      me = "value";
      Ee = "server_timestamp";
      Ve = "__min__";
      Te = "__max__";
      Ie = "__regex__";
      Ae = "pattern";
      Re = "options";
      Pe = "__oid__";
      pe = "__int__";
      ye = "__decimal128__";
      be = "__request_timestamp__";
      we = "seconds";
      ge = "increment";
      Fe = "__binary__";
      ve = {};
      (De = xe || (xe = {})).dt = "regexValue", De.Et = "bsonObjectIdValue", De.Vt = "int32Value", De.Tt = "decimal128Value", De.It = "bsonTimestampValue", De.At = "bsonBinaryValue", De.Rt = "minKeyValue", De.Pt = "maxKeyValue", De.yt = "maxValue", De.bt = "vectorValue", De.wt = "serverTimestampValue", De.gt = "regularMapValue";
      Ne = {
        [de]: xe.bt,
        [Te]: xe.yt,
        [Ee]: xe.wt
      };
      Se = {
        [Ie]: xe.dt,
        [Pe]: xe.Et,
        [pe]: xe.Vt,
        [ye]: xe.Tt,
        [be]: xe.It,
        [Fe]: xe.At,
        [Ve]: xe.Rt,
        [Te]: xe.Pt
      };
      new Set(Object.values(Se));
      Bound = class {
        constructor(e, t) {
          this.position = e, this.inclusive = t;
        }
      };
      Filter = class {
      };
      FieldFilter = class _FieldFilter extends Filter {
        constructor(e, t, r2) {
          super(), this.field = e, this.op = t, this.value = r2;
        }
        /**
         * Creates a filter based on the provided arguments.
         */
        static create(e, t, r2) {
          return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, r2) : new __PRIVATE_KeyFieldFilter(e, t, r2) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, r2) : "in" === t ? new __PRIVATE_InFilter(e, r2) : "not-in" === t ? new __PRIVATE_NotInFilter(e, r2) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, r2) : new _FieldFilter(e, t, r2);
        }
        static createKeyFieldInFilter(e, t, r2) {
          return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, r2) : new __PRIVATE_KeyFieldNotInFilter(e, r2);
        }
        matches(e) {
          const t = e.data.field(this.field);
          return "!=" === this.op ? null !== t && void 0 === t.nullValue && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
        }
        matchesComparison(e) {
          switch (this.op) {
            case "<":
              return e < 0;
            case "<=":
              return e <= 0;
            case "==":
              return 0 === e;
            case "!=":
              return 0 !== e;
            case ">":
              return e > 0;
            case ">=":
              return e >= 0;
            default:
              return z(47266, {
                operator: this.op
              });
          }
        }
        isInequality() {
          return [
            "<",
            "<=",
            ">",
            ">=",
            "!=",
            "not-in"
            /* Operator.NOT_IN */
          ].indexOf(this.op) >= 0;
        }
        getFlattenedFilters() {
          return [this];
        }
        getFilters() {
          return [this];
        }
      };
      CompositeFilter = class _CompositeFilter extends Filter {
        constructor(e, t) {
          super(), this.filters = e, this.op = t, this.Dt = null;
        }
        /**
         * Creates a filter based on the provided arguments.
         */
        static create(e, t) {
          return new _CompositeFilter(e, t);
        }
        matches(e) {
          return (function __PRIVATE_compositeFilterIsConjunction(e2) {
            return "and" === e2.op;
          })(this) ? void 0 === this.filters.find(((t) => !t.matches(e))) : void 0 !== this.filters.find(((t) => t.matches(e)));
        }
        getFlattenedFilters() {
          return null !== this.Dt || (this.Dt = this.filters.reduce(((e, t) => e.concat(t.getFlattenedFilters())), [])), this.Dt;
        }
        // Returns a mutable copy of `this.filters`
        getFilters() {
          return Object.assign([], this.filters);
        }
      };
      __PRIVATE_KeyFieldFilter = class extends FieldFilter {
        constructor(e, t, r2) {
          super(e, t, r2), this.key = S.fromName(r2.referenceValue);
        }
        matches(e) {
          const t = S.comparator(e.key, this.key);
          return this.matchesComparison(t);
        }
      };
      __PRIVATE_KeyFieldInFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
        }
        matches(e) {
          return this.keys.some(((t) => t.isEqual(e.key)));
        }
      };
      __PRIVATE_KeyFieldNotInFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
        }
        matches(e) {
          return !this.keys.some(((t) => t.isEqual(e.key)));
        }
      };
      __PRIVATE_ArrayContainsFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "array-contains", t);
        }
        matches(e) {
          const t = e.data.field(this.field);
          return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
        }
      };
      __PRIVATE_InFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "in", t);
        }
        matches(e) {
          const t = e.data.field(this.field);
          return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
        }
      };
      __PRIVATE_NotInFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "not-in", t);
        }
        matches(e) {
          if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
          })) return false;
          const t = e.data.field(this.field);
          return null !== t && void 0 === t.nullValue && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
        }
      };
      __PRIVATE_ArrayContainsAnyFilter = class extends FieldFilter {
        constructor(e, t) {
          super(e, "array-contains-any", t);
        }
        matches(e) {
          const t = e.data.field(this.field);
          return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some(((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2)));
        }
      };
      OrderBy = class {
        constructor(e, t = "asc") {
          this.field = e, this.dir = t;
        }
      };
      j = class _j {
        static fromTimestamp(e) {
          return new _j(e);
        }
        static min() {
          return new _j(new Timestamp(0, 0));
        }
        static max() {
          return new _j(new Timestamp(253402300799, 999999999));
        }
        constructor(e) {
          this.timestamp = e;
        }
        compareTo(e) {
          return this.timestamp._compareTo(e.timestamp);
        }
        isEqual(e) {
          return this.timestamp.isEqual(e.timestamp);
        }
        /** Returns a number representation of the version for use in spec tests. */
        toMicroseconds() {
          return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
        }
        toString() {
          return "SnapshotVersion(" + this.timestamp.toString() + ")";
        }
        toTimestamp() {
          return this.timestamp;
        }
      };
      SortedMap = class _SortedMap {
        constructor(e, t) {
          this.comparator = e, this.root = t || LLRBNode.EMPTY;
        }
        // Returns a copy of the map, with the specified key/value added or replaced.
        insert(e, t) {
          return new _SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
        }
        // Returns a copy of the map, with the specified key removed.
        remove(e) {
          return new _SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
        }
        // Returns the value of the node with the given key, or null.
        get(e) {
          let t = this.root;
          for (; !t.isEmpty(); ) {
            const r2 = this.comparator(e, t.key);
            if (0 === r2) return t.value;
            r2 < 0 ? t = t.left : r2 > 0 && (t = t.right);
          }
          return null;
        }
        // Returns the index of the element in this sorted map, or -1 if it doesn't
        // exist.
        indexOf(e) {
          let t = 0, r2 = this.root;
          for (; !r2.isEmpty(); ) {
            const n2 = this.comparator(e, r2.key);
            if (0 === n2) return t + r2.left.size;
            n2 < 0 ? r2 = r2.left : (
              // Count all nodes left of the node plus the node itself
              (t += r2.left.size + 1, r2 = r2.right)
            );
          }
          return -1;
        }
        isEmpty() {
          return this.root.isEmpty();
        }
        // Returns the total number of nodes in the map.
        get size() {
          return this.root.size;
        }
        // Returns the minimum key in the map.
        minKey() {
          return this.root.minKey();
        }
        // Returns the maximum key in the map.
        maxKey() {
          return this.root.maxKey();
        }
        // Traverses the map in key order and calls the specified action function
        // for each key/value pair. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        inorderTraversal(e) {
          return this.root.inorderTraversal(e);
        }
        forEach(e) {
          this.inorderTraversal(((t, r2) => (e(t, r2), false)));
        }
        toString() {
          const e = [];
          return this.inorderTraversal(((t, r2) => (e.push(`${t}:${r2}`), false))), `{${e.join(", ")}}`;
        }
        // Traverses the map in reverse key order and calls the specified action
        // function for each key/value pair. If action returns true, traversal is
        // aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        reverseTraversal(e) {
          return this.root.reverseTraversal(e);
        }
        // Returns an iterator over the SortedMap.
        getIterator() {
          return new SortedMapIterator(this.root, null, this.comparator, false);
        }
        getIteratorFrom(e) {
          return new SortedMapIterator(this.root, e, this.comparator, false);
        }
        getReverseIterator() {
          return new SortedMapIterator(this.root, null, this.comparator, true);
        }
        getReverseIteratorFrom(e) {
          return new SortedMapIterator(this.root, e, this.comparator, true);
        }
      };
      SortedMapIterator = class {
        constructor(e, t, r2, n2) {
          this.isReverse = n2, this.nodeStack = [];
          let i = 1;
          for (; !e.isEmpty(); ) if (i = t ? r2(e.key, t) : 1, // flip the comparison if we're going in reverse
          t && n2 && (i *= -1), i < 0)
            e = this.isReverse ? e.left : e.right;
          else {
            if (0 === i) {
              this.nodeStack.push(e);
              break;
            }
            this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
          }
        }
        getNext() {
          let e = this.nodeStack.pop();
          const t = {
            key: e.key,
            value: e.value
          };
          if (this.isReverse) for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), e = e.right;
          else for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), e = e.left;
          return t;
        }
        hasNext() {
          return this.nodeStack.length > 0;
        }
        peek() {
          if (0 === this.nodeStack.length) return null;
          const e = this.nodeStack[this.nodeStack.length - 1];
          return {
            key: e.key,
            value: e.value
          };
        }
      };
      LLRBNode = class _LLRBNode {
        constructor(e, t, r2, n2, i) {
          this.key = e, this.value = t, this.color = null != r2 ? r2 : _LLRBNode.RED, this.left = null != n2 ? n2 : _LLRBNode.EMPTY, this.right = null != i ? i : _LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
        }
        // Returns a copy of the current node, optionally replacing pieces of it.
        copy(e, t, r2, n2, i) {
          return new _LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != r2 ? r2 : this.color, null != n2 ? n2 : this.left, null != i ? i : this.right);
        }
        isEmpty() {
          return false;
        }
        // Traverses the tree in key order and calls the specified action function
        // for each node. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        inorderTraversal(e) {
          return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
        }
        // Traverses the tree in reverse key order and calls the specified action
        // function for each node. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        reverseTraversal(e) {
          return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
        }
        // Returns the minimum node in the tree.
        min() {
          return this.left.isEmpty() ? this : this.left.min();
        }
        // Returns the maximum key in the tree.
        minKey() {
          return this.min().key;
        }
        // Returns the maximum key in the tree.
        maxKey() {
          return this.right.isEmpty() ? this.key : this.right.maxKey();
        }
        // Returns new tree, with the key/value added.
        insert(e, t, r2) {
          let n2 = this;
          const i = r2(e, n2.key);
          return n2 = i < 0 ? n2.copy(null, null, null, n2.left.insert(e, t, r2), null) : 0 === i ? n2.copy(null, t, null, null, null) : n2.copy(null, null, null, null, n2.right.insert(e, t, r2)), n2.fixUp();
        }
        removeMin() {
          if (this.left.isEmpty()) return _LLRBNode.EMPTY;
          let e = this;
          return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
        }
        // Returns new tree, with the specified item removed.
        remove(e, t) {
          let r2, n2 = this;
          if (t(e, n2.key) < 0) n2.left.isEmpty() || n2.left.isRed() || n2.left.left.isRed() || (n2 = n2.moveRedLeft()), n2 = n2.copy(null, null, null, n2.left.remove(e, t), null);
          else {
            if (n2.left.isRed() && (n2 = n2.rotateRight()), n2.right.isEmpty() || n2.right.isRed() || n2.right.left.isRed() || (n2 = n2.moveRedRight()), 0 === t(e, n2.key)) {
              if (n2.right.isEmpty()) return _LLRBNode.EMPTY;
              r2 = n2.right.min(), n2 = n2.copy(r2.key, r2.value, null, null, n2.right.removeMin());
            }
            n2 = n2.copy(null, null, null, null, n2.right.remove(e, t));
          }
          return n2.fixUp();
        }
        isRed() {
          return this.color;
        }
        // Returns new tree after performing any needed rotations.
        fixUp() {
          let e = this;
          return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
        }
        moveRedLeft() {
          let e = this.colorFlip();
          return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
        }
        moveRedRight() {
          let e = this.colorFlip();
          return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
        }
        rotateLeft() {
          const e = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
          return this.right.copy(null, null, this.color, e, null);
        }
        rotateRight() {
          const e = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
          return this.left.copy(null, null, this.color, null, e);
        }
        colorFlip() {
          const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
          return this.copy(null, null, !this.color, e, t);
        }
        // For testing.
        checkMaxDepth() {
          const e = this.check();
          return Math.pow(2, e) <= this.size + 1;
        }
        // In a balanced RB tree, the black-depth (number of black nodes) from root to
        // leaves is equal on both sides.  This function verifies that or asserts.
        check() {
          if (this.isRed() && this.left.isRed()) throw z(43730, {
            key: this.key,
            value: this.value
          });
          if (this.right.isRed()) throw z(14113, {
            key: this.key,
            value: this.value
          });
          const e = this.left.check();
          if (e !== this.right.check()) throw z(27949);
          return e + (this.isRed() ? 0 : 1);
        }
      };
      LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
      LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
      class LLRBEmptyNode {
        constructor() {
          this.size = 0;
        }
        get key() {
          throw z(57766);
        }
        get value() {
          throw z(16141);
        }
        get color() {
          throw z(16727);
        }
        get left() {
          throw z(29726);
        }
        get right() {
          throw z(36894);
        }
        // Returns a copy of the current node.
        copy(e, t, r2, n2, i) {
          return this;
        }
        // Returns a copy of the tree, with the specified key/value added.
        insert(e, t, r2) {
          return new LLRBNode(e, t);
        }
        // Returns a copy of the tree, with the specified key removed.
        remove(e, t) {
          return this;
        }
        isEmpty() {
          return true;
        }
        inorderTraversal(e) {
          return false;
        }
        reverseTraversal(e) {
          return false;
        }
        minKey() {
          return null;
        }
        maxKey() {
          return null;
        }
        isRed() {
          return false;
        }
        // For testing.
        checkMaxDepth() {
          return true;
        }
        check() {
          return 0;
        }
      }();
      SortedSet = class _SortedSet {
        constructor(e) {
          this.comparator = e, this.data = new SortedMap(this.comparator);
        }
        has(e) {
          return null !== this.data.get(e);
        }
        first() {
          return this.data.minKey();
        }
        last() {
          return this.data.maxKey();
        }
        get size() {
          return this.data.size;
        }
        indexOf(e) {
          return this.data.indexOf(e);
        }
        /** Iterates elements in order defined by "comparator" */
        forEach(e) {
          this.data.inorderTraversal(((t, r2) => (e(t), false)));
        }
        /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
        forEachInRange(e, t) {
          const r2 = this.data.getIteratorFrom(e[0]);
          for (; r2.hasNext(); ) {
            const n2 = r2.getNext();
            if (this.comparator(n2.key, e[1]) >= 0) return;
            t(n2.key);
          }
        }
        /**
         * Iterates over `elem`s such that: start &lt;= elem until false is returned.
         */
        forEachWhile(e, t) {
          let r2;
          for (r2 = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); r2.hasNext(); ) {
            if (!e(r2.getNext().key)) return;
          }
        }
        /** Finds the least element greater than or equal to `elem`. */
        firstAfterOrEqual(e) {
          const t = this.data.getIteratorFrom(e);
          return t.hasNext() ? t.getNext().key : null;
        }
        getIterator() {
          return new SortedSetIterator(this.data.getIterator());
        }
        getIteratorFrom(e) {
          return new SortedSetIterator(this.data.getIteratorFrom(e));
        }
        /** Inserts or updates an element */
        add(e) {
          return this.copy(this.data.remove(e).insert(e, true));
        }
        /** Deletes an element */
        delete(e) {
          return this.has(e) ? this.copy(this.data.remove(e)) : this;
        }
        isEmpty() {
          return this.data.isEmpty();
        }
        unionWith(e) {
          let t = this;
          return t.size < e.size && (t = e, e = this), e.forEach(((e2) => {
            t = t.add(e2);
          })), t;
        }
        isEqual(e) {
          if (!(e instanceof _SortedSet)) return false;
          if (this.size !== e.size) return false;
          const t = this.data.getIterator(), r2 = e.data.getIterator();
          for (; t.hasNext(); ) {
            const e2 = t.getNext().key, n2 = r2.getNext().key;
            if (0 !== this.comparator(e2, n2)) return false;
          }
          return true;
        }
        toArray() {
          const e = [];
          return this.forEach(((t) => {
            e.push(t);
          })), e;
        }
        toString() {
          const e = [];
          return this.forEach(((t) => e.push(t))), "SortedSet(" + e.toString() + ")";
        }
        copy(e) {
          const t = new _SortedSet(this.comparator);
          return t.data = e, t;
        }
      };
      SortedSetIterator = class {
        constructor(e) {
          this.iter = e;
        }
        getNext() {
          return this.iter.getNext().key;
        }
        hasNext() {
          return this.iter.hasNext();
        }
      };
      FieldMask = class _FieldMask {
        constructor(e) {
          this.fields = e, // TODO(dimond): validation of FieldMask
          // Sort the field mask to support `FieldMask.isEqual()` and assert below.
          e.sort(X.comparator);
        }
        static empty() {
          return new _FieldMask([]);
        }
        /**
         * Returns a new FieldMask object that is the result of adding all the given
         * fields paths to this field mask.
         */
        unionWith(e) {
          let t = new SortedSet(X.comparator);
          for (const e2 of this.fields) t = t.add(e2);
          for (const r2 of e) t = t.add(r2);
          return new _FieldMask(t.toArray());
        }
        /**
         * Verifies that `fieldPath` is included by at least one field in this field
         * mask.
         *
         * This is an O(n) operation, where `n` is the size of the field mask.
         */
        covers(e) {
          for (const t of this.fields) if (t.isPrefixOf(e)) return true;
          return false;
        }
        isEqual(e) {
          return __PRIVATE_arrayEquals(this.fields, e.fields, ((e2, t) => e2.isEqual(t)));
        }
      };
      u = class _u {
        constructor(e) {
          this.value = e;
        }
        static empty() {
          return new _u({
            mapValue: {}
          });
        }
        /**
         * Returns the value at the given path or null.
         *
         * @param path - the path to search
         * @returns The value at the path or null if the path is not set.
         */
        field(e) {
          if (e.isEmpty()) return this.value;
          {
            let t = this.value;
            for (let r2 = 0; r2 < e.length - 1; ++r2) if (t = (t.mapValue.fields || {})[e.get(r2)], !__PRIVATE_isMapValue(t)) return null;
            return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
          }
        }
        /**
         * Sets the field to the provided value.
         *
         * @param path - The field path to set.
         * @param value - The value to set.
         */
        set(e, t) {
          this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
        }
        /**
         * Sets the provided fields to the provided values.
         *
         * @param data - A map of fields to values (or null for deletes).
         */
        setAll(e) {
          let t = X.emptyPath(), r2 = {}, n2 = [];
          e.forEach(((e2, i2) => {
            if (!t.isImmediateParentOf(i2)) {
              const e3 = this.getFieldsMap(t);
              this.applyChanges(e3, r2, n2), r2 = {}, n2 = [], t = i2.popLast();
            }
            e2 ? r2[i2.lastSegment()] = __PRIVATE_deepClone(e2) : n2.push(i2.lastSegment());
          }));
          const i = this.getFieldsMap(t);
          this.applyChanges(i, r2, n2);
        }
        /**
         * Removes the field at the specified path. If there is no field at the
         * specified path, nothing is changed.
         *
         * @param path - The field path to remove.
         */
        delete(e) {
          const t = this.field(e.popLast());
          __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
        }
        isEqual(e) {
          return __PRIVATE_valueEquals(this.value, e.value);
        }
        /**
         * Returns the map that contains the leaf element of `path`. If the parent
         * entry does not yet exist, or if it is not a map, a new map will be created.
         */
        getFieldsMap(e) {
          let t = this.value;
          t.mapValue.fields || (t.mapValue = {
            fields: {}
          });
          for (let r2 = 0; r2 < e.length; ++r2) {
            let n2 = t.mapValue.fields[e.get(r2)];
            __PRIVATE_isMapValue(n2) && n2.mapValue.fields || (n2 = {
              mapValue: {
                fields: {}
              }
            }, t.mapValue.fields[e.get(r2)] = n2), t = n2;
          }
          return t.mapValue.fields;
        }
        /**
         * Modifies `fieldsMap` by adding, replacing or deleting the specified
         * entries.
         */
        applyChanges(e, t, r2) {
          forEach(t, ((t2, r3) => e[t2] = r3));
          for (const t2 of r2) delete e[t2];
        }
        clone() {
          return new _u(__PRIVATE_deepClone(this.value));
        }
      };
      MutableDocument = class _MutableDocument {
        constructor(e, t, r2, n2, i, s2, o2) {
          this.key = e, this.documentType = t, this.version = r2, this.readTime = n2, this.createTime = i, this.data = s2, this.documentState = o2;
        }
        /**
         * Creates a document with no known version or data, but which can serve as
         * base document for mutations.
         */
        static newInvalidDocument(e) {
          return new _MutableDocument(
            e,
            0,
            /* version */
            j.min(),
            /* readTime */
            j.min(),
            /* createTime */
            j.min(),
            u.empty(),
            0
            /* DocumentState.SYNCED */
          );
        }
        /**
         * Creates a new document that is known to exist with the given data at the
         * given version.
         */
        static newFoundDocument(e, t, r2, n2) {
          return new _MutableDocument(
            e,
            1,
            /* version */
            t,
            /* readTime */
            j.min(),
            /* createTime */
            r2,
            n2,
            0
            /* DocumentState.SYNCED */
          );
        }
        /** Creates a new document that is known to not exist at the given version. */
        static newNoDocument(e, t) {
          return new _MutableDocument(
            e,
            2,
            /* version */
            t,
            /* readTime */
            j.min(),
            /* createTime */
            j.min(),
            u.empty(),
            0
            /* DocumentState.SYNCED */
          );
        }
        /**
         * Creates a new document that is known to exist at the given version but
         * whose data is not known (e.g. a document that was updated without a known
         * base document).
         */
        static newUnknownDocument(e, t) {
          return new _MutableDocument(
            e,
            3,
            /* version */
            t,
            /* readTime */
            j.min(),
            /* createTime */
            j.min(),
            u.empty(),
            2
            /* DocumentState.HAS_COMMITTED_MUTATIONS */
          );
        }
        /**
         * Changes the document type to indicate that it exists and that its version
         * and data are known.
         */
        convertToFoundDocument(e, t) {
          return !this.createTime.isEqual(j.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
        }
        /**
         * Changes the document type to indicate that it doesn't exist at the given
         * version.
         */
        convertToNoDocument(e) {
          return this.version = e, this.documentType = 2, this.data = u.empty(), this.documentState = 0, this;
        }
        /**
         * Changes the document type to indicate that it exists at a given version but
         * that its data is not known (e.g. a document that was updated without a known
         * base document).
         */
        convertToUnknownDocument(e) {
          return this.version = e, this.documentType = 3, this.data = u.empty(), this.documentState = 2, this;
        }
        setHasCommittedMutations() {
          return this.documentState = 2, this;
        }
        setHasLocalMutations() {
          return this.documentState = 1, this.version = j.min(), this;
        }
        setReadTime(e) {
          return this.readTime = e, this;
        }
        get hasLocalMutations() {
          return 1 === this.documentState;
        }
        get hasCommittedMutations() {
          return 2 === this.documentState;
        }
        get hasPendingWrites() {
          return this.hasLocalMutations || this.hasCommittedMutations;
        }
        isValidDocument() {
          return 0 !== this.documentType;
        }
        isFoundDocument() {
          return 1 === this.documentType;
        }
        isNoDocument() {
          return 2 === this.documentType;
        }
        isUnknownDocument() {
          return 3 === this.documentType;
        }
        isEqual(e) {
          return e instanceof _MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
        }
        mutableCopy() {
          return new _MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
        }
        toString() {
          return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
        }
      };
      __PRIVATE_TargetImpl = class {
        constructor(e, t = null, r2 = [], n2 = [], i = null, s2 = null, o2 = null) {
          this.path = e, this.collectionGroup = t, this.orderBy = r2, this.filters = n2, this.limit = i, this.startAt = s2, this.endAt = o2, this.Nt = null;
        }
      };
      __PRIVATE_QueryImpl = class {
        /**
         * Initializes a Query with a path and optional additional query constraints.
         * Path must currently be empty if this is a collection group query.
         */
        constructor(e, t = null, r2 = [], n2 = [], i = null, s2 = "F", o2 = null, a2 = null) {
          this.path = e, this.collectionGroup = t, this.explicitOrderBy = r2, this.filters = n2, this.limit = i, this.limitType = s2, this.startAt = o2, this.endAt = a2, this.St = null, // The corresponding `Target` of this `Query` instance, for use with
          // non-aggregate queries.
          this.Ct = null, // The corresponding `Target` of this `Query` instance, for use with
          // aggregate queries. Unlike targets for non-aggregate queries,
          // aggregate query targets do not contain normalized order-bys, they only
          // contain explicit order-bys.
          this.Bt = null, this.startAt, this.endAt;
        }
      };
      TransformOperation = class {
        constructor() {
          this._ = void 0;
        }
      };
      __PRIVATE_ServerTimestampTransform = class extends TransformOperation {
      };
      __PRIVATE_ArrayUnionTransformOperation = class extends TransformOperation {
        constructor(e) {
          super(), this.elements = e;
        }
      };
      __PRIVATE_ArrayRemoveTransformOperation = class extends TransformOperation {
        constructor(e) {
          super(), this.elements = e;
        }
      };
      __PRIVATE_NumericTransformOperation = class extends TransformOperation {
        constructor(e, t) {
          super(), this.serializer = e, this.Qt = t;
        }
      };
      __PRIVATE_NumericIncrementTransformOperation = class extends __PRIVATE_NumericTransformOperation {
      };
      __PRIVATE_NumericMinimumTransformOperation = class extends __PRIVATE_NumericTransformOperation {
      };
      __PRIVATE_NumericMaximumTransformOperation = class extends __PRIVATE_NumericTransformOperation {
      };
      FieldTransform = class {
        constructor(e, t) {
          this.field = e, this.transform = t;
        }
      };
      P = class _P {
        constructor(e, t) {
          this.updateTime = e, this.exists = t;
        }
        /** Creates a new empty Precondition. */
        static none() {
          return new _P();
        }
        /** Creates a new Precondition with an exists flag. */
        static exists(e) {
          return new _P(void 0, e);
        }
        /** Creates a new Precondition based on a version a document exists at. */
        static updateTime(e) {
          return new _P(e);
        }
        /** Returns whether this Precondition is empty. */
        get isNone() {
          return void 0 === this.updateTime && void 0 === this.exists;
        }
        isEqual(e) {
          return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
        }
      };
      Mutation = class {
      };
      __PRIVATE_SetMutation = class extends Mutation {
        constructor(e, t, r2, n2 = []) {
          super(), this.key = e, this.value = t, this.precondition = r2, this.fieldTransforms = n2, this.type = 0;
        }
        getFieldMask() {
          return null;
        }
      };
      __PRIVATE_PatchMutation = class extends Mutation {
        constructor(e, t, r2, n2, i = []) {
          super(), this.key = e, this.data = t, this.fieldMask = r2, this.precondition = n2, this.fieldTransforms = i, this.type = 1;
        }
        getFieldMask() {
          return this.fieldMask;
        }
      };
      F = class extends Mutation {
        constructor(e, t) {
          super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
        }
        getFieldMask() {
          return null;
        }
      };
      q = class extends Mutation {
        constructor(e, t) {
          super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
        }
        getFieldMask() {
          return null;
        }
      };
      Ce = /* @__PURE__ */ (() => {
        const e = {
          asc: "ASCENDING",
          desc: "DESCENDING"
        };
        return e;
      })();
      Be = /* @__PURE__ */ (() => {
        const e = {
          "<": "LESS_THAN",
          "<=": "LESS_THAN_OR_EQUAL",
          ">": "GREATER_THAN",
          ">=": "GREATER_THAN_OR_EQUAL",
          "==": "EQUAL",
          "!=": "NOT_EQUAL",
          "array-contains": "ARRAY_CONTAINS",
          in: "IN",
          "not-in": "NOT_IN",
          "array-contains-any": "ARRAY_CONTAINS_ANY"
        };
        return e;
      })();
      Qe = /* @__PURE__ */ (() => {
        const e = {
          and: "AND",
          or: "OR"
        };
        return e;
      })();
      JsonProtoSerializer = class {
        constructor(e, t) {
          this.databaseId = e, this.useProto3Json = t;
        }
      };
      Datastore = class {
      };
      __PRIVATE_DatastoreImpl = class extends Datastore {
        constructor(e, t, r2, n2) {
          super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = r2, this.serializer = n2, this.qt = false;
        }
        Lt() {
          if (this.qt) throw new k(x.FAILED_PRECONDITION, "The client has already been terminated.");
        }
        /** Invokes the provided RPC with auth and AppCheck tokens. */
        le(e, t, r2, n2) {
          return this.Lt(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([i, s2]) => this.connection.le(e, __PRIVATE_toResourcePath(t, r2), n2, i, s2))).catch(((e2) => {
            throw "FirebaseError" === e2.name ? (e2.code === x.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new k(x.UNKNOWN, e2.toString());
          }));
        }
        /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
        me(e, t, r2, n2, i) {
          return this.Lt(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then((([s2, o2]) => this.connection.me(e, __PRIVATE_toResourcePath(t, r2), n2, s2, o2, i))).catch(((e2) => {
            throw "FirebaseError" === e2.name ? (e2.code === x.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new k(x.UNKNOWN, e2.toString());
          }));
        }
        terminate() {
          this.qt = true, this.connection.terminate();
        }
      };
      ut = "ComponentProvider";
      Oe = /* @__PURE__ */ new Map();
      Me = 1048576;
      qe = "firestore.googleapis.com";
      Le = true;
      FirestoreSettingsImpl = class {
        constructor(e) {
          if (void 0 === e.host) {
            if (void 0 !== e.ssl) throw new k(x.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
            this.host = qe, this.ssl = Le;
          } else this.host = e.host, this.ssl = e.ssl ?? Le;
          if (this.isUsingEmulator = void 0 !== e.emulatorOptions, this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, e._customHeaders && (this._customHeaders = {
            ...e._customHeaders
          }), void 0 === e.cacheSizeBytes) this.cacheSizeBytes = 41943040;
          else {
            if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < Me) throw new k(x.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = e.cacheSizeBytes;
          }
          if ((function __PRIVATE_validateIsNotUsedTogether(e2, t, r2, n2) {
            if (true === t && true === n2) throw new k(x.INVALID_ARGUMENT, `${e2} and ${r2} cannot be used together.`);
          })("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
            // For backwards compatibility, coerce the value to boolean even though
            // the TypeScript compiler has narrowed the type to boolean already.
            // noinspection PointlessBooleanExpressionJS
            this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
          ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(e.experimentalLongPollingOptions ?? {}), (function __PRIVATE_validateLongPollingOptions(e2) {
            if (void 0 !== e2.timeoutSeconds) {
              if (isNaN(e2.timeoutSeconds)) throw new k(x.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
              if (e2.timeoutSeconds < 5) throw new k(x.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
              if (e2.timeoutSeconds > 30) throw new k(x.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
            }
          })(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams, void 0 !== e.grpcFlowControlWindow) {
            if ("number" != typeof e.grpcFlowControlWindow || e.grpcFlowControlWindow <= 0 || e.grpcFlowControlWindow > 2147483647 || !Number.isInteger(e.grpcFlowControlWindow)) throw new k(x.INVALID_ARGUMENT, "grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");
            this.grpcFlowControlWindow = e.grpcFlowControlWindow;
          }
        }
        isEqual(e) {
          return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && (function __PRIVATE_longPollingOptionsEqual(e2, t) {
            return e2.timeoutSeconds === t.timeoutSeconds;
          })(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams && this.grpcFlowControlWindow === e.grpcFlowControlWindow && (function __PRIVATE_customHeadersEqual(e2, t) {
            if (e2 === t) return true;
            if (!e2 || !t) return false;
            const r2 = Object.keys(e2), n2 = Object.keys(t);
            if (r2.length !== n2.length) return false;
            for (const n3 of r2) if (e2[n3] !== t[n3]) return false;
            return true;
          })(this._customHeaders, e._customHeaders);
        }
      };
      n = class {
        /** @hideconstructor */
        constructor(e, t, r2, n2) {
          this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = r2, this._app = n2, /**
           * Whether it's a Firestore or Firestore Lite instance.
           */
          this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false, this._emulatorOptions = {}, // A task that is assigned when the terminate() is invoked and resolved when
          // all components have shut down. Otherwise, Firestore is not terminated,
          // which can mean either the FirestoreClient is in the process of starting,
          // or restarting.
          this._terminateTask = "notTerminated";
        }
        /**
         * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
         * instance.
         */
        get app() {
          if (!this._app) throw new k(x.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
          return this._app;
        }
        get _initialized() {
          return this._settingsFrozen;
        }
        get _terminated() {
          return "notTerminated" !== this._terminateTask;
        }
        _setSettings(e) {
          if (this._settingsFrozen) throw new k(x.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
          this._settings = new FirestoreSettingsImpl(e), this._emulatorOptions = e.emulatorOptions || {}, void 0 !== e.credentials && (this._authCredentials = (function __PRIVATE_makeAuthCredentialsProvider(e2) {
            if (!e2) return new __PRIVATE_EmptyAuthCredentialsProvider();
            switch (e2.type) {
              case "firstParty":
                return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
              case "provider":
                return e2.client;
              default:
                throw new k(x.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
          })(e.credentials));
        }
        _getSettings() {
          return this._settings;
        }
        _getEmulatorOptions() {
          return this._emulatorOptions;
        }
        _freezeSettings() {
          return this._settingsFrozen = true, this._settings;
        }
        _delete() {
          return "notTerminated" === this._terminateTask && (this._terminateTask = this._terminate()), this._terminateTask;
        }
        async _restart() {
          "notTerminated" === this._terminateTask ? await this._terminate() : this._terminateTask = "notTerminated";
        }
        /** Returns a JSON-serializable representation of this `Firestore` instance. */
        toJSON() {
          return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
          };
        }
        /**
         * Terminates all components used by this client. Subclasses can override
         * this method to clean up their own dependencies, but must also call this
         * method.
         *
         * Only ever called once.
         */
        _terminate() {
          return (function __PRIVATE_removeComponents(e) {
            const t = Oe.get(e);
            t && (a(ut, "Removing Datastore"), Oe.delete(e), t.terminate());
          })(this), Promise.resolve();
        }
      };
      Query = class _Query {
        // This is the lite version of the Query class in the main SDK.
        /** @hideconstructor protected */
        constructor(e, t, r2) {
          this.converter = t, this._query = r2, /** The type of this Firestore reference. */
          this.type = "query", this.firestore = e;
        }
        withConverter(e) {
          return new _Query(this.firestore, e, this._query);
        }
      };
      DocumentReference = class _DocumentReference {
        /** @hideconstructor */
        constructor(e, t, r2) {
          this.converter = t, this._key = r2, /** The type of this Firestore reference. */
          this.type = "document", this.firestore = e;
        }
        get _path() {
          return this._key.path;
        }
        /**
         * The document's identifier within its collection.
         */
        get id() {
          return this._key.path.lastSegment();
        }
        /**
         * A string representing the path of the referenced document (relative
         * to the root of the database).
         */
        get path() {
          return this._key.path.canonicalString();
        }
        /**
         * The collection this `DocumentReference` belongs to.
         */
        get parent() {
          return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
        }
        withConverter(e) {
          return new _DocumentReference(this.firestore, e, this._key);
        }
        /**
         * Returns a JSON-serializable representation of this `DocumentReference` instance.
         *
         * @returns a JSON representation of this object.
         */
        toJSON() {
          return {
            type: _DocumentReference._jsonSchemaVersion,
            referencePath: this._key.toString()
          };
        }
        static fromJSON(e, t, r2) {
          if (__PRIVATE_validateJSON(t, _DocumentReference._jsonSchema)) return new _DocumentReference(e, r2 || null, new S(ResourcePath.fromString(t.referencePath)));
        }
      };
      DocumentReference._jsonSchemaVersion = "firestore/documentReference/1.0", DocumentReference._jsonSchema = {
        type: property("string", DocumentReference._jsonSchemaVersion),
        referencePath: property("string")
      };
      CollectionReference = class _CollectionReference extends Query {
        /** @hideconstructor */
        constructor(e, t, r2) {
          super(e, t, (function __PRIVATE_newQueryForPath(e2) {
            return new __PRIVATE_QueryImpl(e2);
          })(r2)), this._path = r2, /** The type of this Firestore reference. */
          this.type = "collection";
        }
        /** The collection's identifier. */
        get id() {
          return this._query.path.lastSegment();
        }
        /**
         * A string representing the path of the referenced collection (relative
         * to the root of the database).
         */
        get path() {
          return this._query.path.canonicalString();
        }
        /**
         * A reference to the containing `DocumentReference` if this is a
         * subcollection. If this isn't a subcollection, the reference is null.
         */
        get parent() {
          const e = this._path.popLast();
          return e.isEmpty() ? null : new DocumentReference(
            this.firestore,
            /* converter= */
            null,
            new S(e)
          );
        }
        withConverter(e) {
          return new _CollectionReference(this.firestore, e, this._path);
        }
      };
      Bytes = class _Bytes {
        /** @hideconstructor */
        constructor(e, t = 0) {
          if (this.subtype = t, !Number.isInteger(t) || t < 0 || t > 255) throw new k(x.INVALID_ARGUMENT, "The subtype for Bytes must be a value in the inclusive [0, 255] range.");
          this._byteString = e;
        }
        /**
         * Creates a new `Bytes` object from the given Base64 string, converting it to
         * bytes.
         *
         * @param base64 - The Base64 string used to create the `Bytes` object.
         * @param subtype - Optional subtype value.
         */
        static fromBase64String(e, t = 0) {
          try {
            return new _Bytes(ByteString.fromBase64String(e), t);
          } catch (e2) {
            throw new k(x.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
          }
        }
        /**
         * Creates a new `Bytes` object from the given Uint8Array.
         *
         * @param array - The Uint8Array used to create the `Bytes` object.
         * @param subtype - Optional subtype value.
         */
        static fromUint8Array(e, t = 0) {
          return new _Bytes(ByteString.fromUint8Array(e), t);
        }
        /**
         * Returns the underlying bytes as a Base64-encoded string.
         *
         * @returns The Base64-encoded string created from the `Bytes` object.
         */
        toBase64() {
          return this._byteString.toBase64();
        }
        /**
         * Returns the underlying bytes in a new `Uint8Array`.
         *
         * @returns The Uint8Array created from the `Bytes` object.
         */
        toUint8Array() {
          return this._byteString.toUint8Array();
        }
        /**
         * Returns the underlying bytes as a `Uint8Array`.
         *
         * @returns The Uint8Array created from the `Bytes` object.
         */
        get data() {
          return this.toUint8Array();
        }
        /**
         * Returns a string representation of the `Bytes` object.
         *
         * @returns A string representation of the `Bytes` object.
         */
        toString() {
          return "Bytes(base64: " + this.toBase64() + ", subtype: " + this.subtype + ")";
        }
        /**
         * Returns true if this `Bytes` object is equal to the provided one.
         *
         * @param other - The `Bytes` object to compare against.
         * @returns true if this `Bytes` object is equal to the provided one.
         */
        isEqual(e) {
          return this.subtype === e.subtype && this._byteString.isEqual(e._byteString);
        }
        /**
         * Returns a JSON-serializable representation of this `Bytes` instance.
         *
         * @returns a JSON representation of this object.
         */
        toJSON() {
          const e = {
            type: _Bytes._jsonSchemaVersion,
            bytes: this.toBase64()
          };
          return 0 !== this.subtype && (e.subtype = this.subtype), e;
        }
        /**
         * Builds a `Bytes` instance from a JSON object created by {@link Bytes.toJSON}.
         *
         * @param json - a JSON object represention of a `Bytes` instance
         * @returns an instance of {@link Bytes} if the JSON object could be parsed. Throws a
         * {@link FirestoreError} if an error occurs.
         */
        static fromJSON(e) {
          if (__PRIVATE_validateJSON(e, _Bytes._jsonSchema)) {
            const t = e.subtype ?? 0;
            return _Bytes.fromBase64String(e.bytes, t);
          }
        }
      };
      Bytes._jsonSchemaVersion = "firestore/bytes/1.0", Bytes._jsonSchema = {
        type: property("string", Bytes._jsonSchemaVersion),
        bytes: property("string"),
        subtype: {
          ...property("number"),
          optional: true
        }
      };
      D = class {
        /**
         * Creates a `FieldPath` from the provided field names. If more than one field
         * name is provided, the path will point to a nested field in a document.
         *
         * @param fieldNames - A list of field names.
         */
        constructor(...e) {
          for (let t = 0; t < e.length; ++t) if (0 === e[t].length) throw new k(x.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
          this._internalPath = new X(e);
        }
        /**
         * Returns true if this `FieldPath` is equal to the provided one.
         *
         * @param other - The `FieldPath` to compare against.
         * @returns true if this `FieldPath` is equal to the provided one.
         */
        isEqual(e) {
          return this._internalPath.isEqual(e._internalPath);
        }
      };
      BsonObjectId = class {
        constructor(e) {
          this.value = e;
        }
        /**
         * Returns true if this `BsonObjectId` is equal to the provided one.
         *
         * @param other - The `BsonObjectId` to compare against.
         * @return 'true' if this `BsonObjectId` is equal to the provided one.
         */
        isEqual(e) {
          return this.value === e.value;
        }
      };
      BsonTimestamp = class {
        constructor(e, t) {
          if (this.seconds = e, this.increment = t, !Number.isInteger(e) || e < 0 || e > 4294967295) throw new Error("BsonTimestamp 'seconds' must be in the range of a 32-bit unsigned integer (0-4294967295).");
          if (!Number.isInteger(t) || t < 0 || t > 4294967295) throw new Error("BsonTimestamp 'increment' must be in the range of a 32-bit unsigned integer (0-4294967295).");
        }
        /**
         * Returns true if this `BsonTimestamp` is equal to the provided one.
         *
         * @param other -  The `BsonTimestamp` to compare against.
         * @return 'true' if this `BsonTimestamp` is equal to the provided one.
         */
        isEqual(e) {
          return this.seconds === e.seconds && this.increment === e.increment;
        }
      };
      Decimal128Value = class {
        constructor(e) {
          this.stringValue = e, this.value = __PRIVATE_Quadruple.fromString(e);
        }
        /**
         * Returns true if this `Decimal128Value` is equal to the provided one.
         *
         * @param other - The `Decimal128Value` to compare against.
         * @return 'true' if this `Decimal128Value` is equal to the provided one.
         */
        isEqual(e) {
          return !(!this.value.ot() || !e.value.ot()) || 0 === this.value.compareTo(e.value);
        }
        /**
         * Returns a JSON-serializable representation of this `Decimal128Value` instance.
         *
         * @returns a JSON representation of this object.
         */
        toJSON() {
          return {
            $t: {
              stringValue: this.stringValue
            }
          };
        }
      };
      FieldValue = class {
        /**
         * @param _methodName - The public API endpoint that returns this class.
         * @hideconstructor
         */
        constructor(e) {
          this._methodName = e;
        }
      };
      GeoPoint = class _GeoPoint {
        /**
         * Creates a new immutable `GeoPoint` object with the provided latitude and
         * longitude values.
         * @param latitude - The latitude as number between -90 and 90.
         * @param longitude - The longitude as number between -180 and 180.
         */
        constructor(e, t) {
          if (!isFinite(e) || e < -90 || e > 90) throw new k(x.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
          if (!isFinite(t) || t < -180 || t > 180) throw new k(x.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
          this._lat = e, this._long = t;
        }
        /**
         * The latitude of this `GeoPoint` instance.
         */
        get latitude() {
          return this._lat;
        }
        /**
         * The longitude of this `GeoPoint` instance.
         */
        get longitude() {
          return this._long;
        }
        /**
         * Returns true if this `GeoPoint` is equal to the provided one.
         *
         * @param other - The `GeoPoint` to compare against.
         * @returns true if this `GeoPoint` is equal to the provided one.
         */
        isEqual(e) {
          return this._lat === e._lat && this._long === e._long;
        }
        /**
         * Actually private to JS consumers of our API, so this function is prefixed
         * with an underscore.
         */
        _compareTo(e) {
          return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
        }
        /**
         * Returns a JSON-serializable representation of this `GeoPoint` instance.
         *
         * @returns a JSON representation of this object.
         */
        toJSON() {
          return {
            latitude: this._lat,
            longitude: this._long,
            type: _GeoPoint._jsonSchemaVersion
          };
        }
        /**
         * Builds a `GeoPoint` instance from a JSON object created by {@link GeoPoint.toJSON}.
         *
         * @param json - a JSON object represention of a `GeoPoint` instance
         * @returns an instance of {@link GeoPoint} if the JSON object could be parsed. Throws a
         * {@link FirestoreError} if an error occurs.
         */
        static fromJSON(e) {
          if (__PRIVATE_validateJSON(e, _GeoPoint._jsonSchema)) return new _GeoPoint(e.latitude, e.longitude);
        }
      };
      GeoPoint._jsonSchemaVersion = "firestore/geoPoint/1.0", GeoPoint._jsonSchema = {
        type: property("string", GeoPoint._jsonSchemaVersion),
        latitude: property("number"),
        longitude: property("number")
      };
      Int32Value = class {
        constructor(e) {
          this.value = e;
        }
        /**
         * Returns true if this `Int32Value` is equal to the provided one.
         *
         * @param other - The `Int32Value` to compare against.
         * @return 'true' if this `Int32Value` is equal to the provided one.
         */
        isEqual(e) {
          return this.value === e.value;
        }
      };
      MaxKey = class _MaxKey {
        constructor() {
          this.type = "MaxKey";
        }
        static instance() {
          return _MaxKey.MAX_KEY_VALUE_INSTANCE || (_MaxKey.MAX_KEY_VALUE_INSTANCE = new _MaxKey()), _MaxKey.MAX_KEY_VALUE_INSTANCE;
        }
      };
      MaxKey.MAX_KEY_VALUE_INSTANCE = null;
      MinKey = class _MinKey {
        constructor() {
          this.type = "MinKey";
        }
        static instance() {
          return _MinKey.MIN_KEY_VALUE_INSTANCE || (_MinKey.MIN_KEY_VALUE_INSTANCE = new _MinKey()), _MinKey.MIN_KEY_VALUE_INSTANCE;
        }
      };
      MinKey.MIN_KEY_VALUE_INSTANCE = null;
      RegexValue = class {
        constructor(e, t) {
          this.pattern = e, this.options = t;
        }
        /**
         * Returns true if this `RegexValue` is equal to the provided one.
         *
         * @param other - The `RegexValue` to compare against.
         * @return 'true' if this `RegexValue` is equal to the provided one.
         */
        isEqual(e) {
          return this.pattern === e.pattern && this.options === e.options;
        }
      };
      VectorValue = class _VectorValue {
        /**
         * @private
         * @internal
         */
        constructor(e) {
          this._values = (e || []).map(((e2) => e2));
        }
        /**
         * Returns a copy of the raw number array form of the vector.
         */
        toArray() {
          return this._values.map(((e) => e));
        }
        /**
         * Returns `true` if the two `VectorValue` values have the same raw number arrays, returns `false` otherwise.
         */
        isEqual(e) {
          return (function __PRIVATE_isPrimitiveArrayEqual(e2, t) {
            if (e2.length !== t.length) return false;
            for (let r2 = 0; r2 < e2.length; ++r2) if (e2[r2] !== t[r2]) return false;
            return true;
          })(this._values, e._values);
        }
        /**
         * Returns a JSON-serializable representation of this `VectorValue` instance.
         *
         * @returns a JSON representation of this object.
         */
        toJSON() {
          return {
            type: _VectorValue._jsonSchemaVersion,
            vectorValues: this._values
          };
        }
        /**
         * Builds a `VectorValue` instance from a JSON object created by {@link VectorValue.toJSON}.
         *
         * @param json - a JSON object represention of a `VectorValue` instance.
         * @returns an instance of {@link VectorValue} if the JSON object could be parsed. Throws a
         * {@link FirestoreError} if an error occurs.
         */
        static fromJSON(e) {
          if (__PRIVATE_validateJSON(e, _VectorValue._jsonSchema)) {
            if (Array.isArray(e.vectorValues) && e.vectorValues.every(((e2) => "number" == typeof e2))) return new _VectorValue(e.vectorValues);
            throw new k(x.INVALID_ARGUMENT, "Expected 'vectorValues' field to be a number array");
          }
        }
      };
      VectorValue._jsonSchemaVersion = "firestore/vectorValue/1.0", VectorValue._jsonSchema = {
        type: property("string", VectorValue._jsonSchemaVersion),
        vectorValues: property("object")
      };
      Ue = /^__.*__$/;
      ParsedSetData = class {
        constructor(e, t, r2) {
          this.data = e, this.fieldMask = t, this.fieldTransforms = r2;
        }
        toMutation(e, t) {
          return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
        }
      };
      ParseContextImpl = class _ParseContextImpl {
        /**
         * Initializes a ParseContext with the given source and path.
         *
         * @param settings - The settings for the parser.
         * @param databaseId - The database ID of the Firestore instance.
         * @param serializer - The serializer to use to generate the Value proto.
         * @param ignoreUndefinedProperties - Whether to ignore undefined properties
         * rather than throw.
         * @param fieldTransforms - A mutable list of field transforms encountered
         * while parsing the data.
         * @param fieldMask - A mutable list of field paths encountered while parsing
         * the data.
         *
         * TODO(b/34871131): We don't support array paths right now, so path can be
         * null to indicate the context represents any location within an array (in
         * which case certain features will not work and errors will be somewhat
         * compromised).
         */
        constructor(e, t, r2, n2, i, s2) {
          this.settings = e, this.databaseId = t, this.serializer = r2, this.ignoreUndefinedProperties = n2, // Minor hack: If fieldTransforms is undefined, we assume this is an
          // external call and we need to validate the entire path.
          void 0 === i && this.validatePath(), this.fieldTransforms = i || [], this.fieldMask = s2 || [];
        }
        get path() {
          return this.settings.path;
        }
        get dataSource() {
          return this.settings.dataSource;
        }
        /** Returns a new context with the specified settings overwritten. */
        contextWith(e) {
          return new _ParseContextImpl({
            ...this.settings,
            ...e
          }, this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
        }
        childContextForField(e) {
          const t = this.path?.child(e), r2 = this.contextWith({
            path: t,
            arrayElement: false
          });
          return r2.validatePathSegment(e), r2;
        }
        childContextForFieldPath(e) {
          const t = this.path?.child(e), r2 = this.contextWith({
            path: t,
            arrayElement: false
          });
          return r2.validatePath(), r2;
        }
        childContextForArray(e) {
          return this.contextWith({
            path: void 0,
            arrayElement: true
          });
        }
        createError(e) {
          return createError(e, this.settings.methodName, this.settings.hasConverter || false, this.path, this.settings.targetDoc);
        }
        /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
        contains(e) {
          return void 0 !== this.fieldMask.find(((t) => e.isPrefixOf(t))) || void 0 !== this.fieldTransforms.find(((t) => e.isPrefixOf(t.field)));
        }
        validatePath() {
          if (this.path) for (let e = 0; e < this.path.length; e++) this.validatePathSegment(this.path.get(e));
        }
        validatePathSegment(e) {
          if (0 === e.length) throw this.createError("Document fields must not be empty");
          if (__PRIVATE_isWrite(this.dataSource) && Ue.test(e)) throw this.createError('Document fields cannot begin and end with "__"');
        }
      };
      UserDataReader = class {
        constructor(e, t, r2) {
          this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = r2 || __PRIVATE_newSerializer(e);
        }
        /** Creates a new top-level parse context. */
        createContext(e, t, r2, n2 = false) {
          return new ParseContextImpl({
            dataSource: e,
            methodName: t,
            targetDoc: r2,
            path: X.emptyPath(),
            arrayElement: false,
            hasConverter: n2
          }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
        }
      };
      __PRIVATE_ServerTimestampFieldValueImpl = class ___PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
        _toFieldTransform(e) {
          return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform());
        }
        isEqual(e) {
          return e instanceof ___PRIVATE_ServerTimestampFieldValueImpl;
        }
      };
      $e = new RegExp("[~\\*/\\[\\]]");
      it = class {
        // Note: This class is stripped down version of the DocumentSnapshot in
        // the legacy SDK. The changes are:
        // - No support for SnapshotMetadata.
        // - No support for SnapshotOptions.
        /** @hideconstructor protected */
        constructor(e, t, r2, n2, i) {
          this._firestore = e, this._userDataWriter = t, this._key = r2, this._document = n2, this._converter = i;
        }
        /** Property of the `DocumentSnapshot` that provides the document's ID. */
        get id() {
          return this._key.path.lastSegment();
        }
        /**
         * The `DocumentReference` for the document included in the `DocumentSnapshot`.
         */
        get ref() {
          return new DocumentReference(this._firestore, this._converter, this._key);
        }
        /**
         * Signals whether or not the document at the snapshot's location exists.
         *
         * @returns true if the document exists.
         */
        exists() {
          return null !== this._document;
        }
        /**
         * Retrieves all fields in the document as an `Object`. Returns `undefined` if
         * the document doesn't exist.
         *
         * @returns An `Object` containing all fields in the document or `undefined`
         * if the document doesn't exist.
         */
        data() {
          if (this._document) {
            if (this._converter) {
              const e = new QueryDocumentSnapshot(
                this._firestore,
                this._userDataWriter,
                this._key,
                this._document,
                /* converter= */
                null
              );
              return this._converter.fromFirestore(e);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
          }
        }
        /**
         * @internal
         * @private
         *
         * Retrieves all fields in the document as a proto Value. Returns `undefined` if
         * the document doesn't exist.
         *
         * @returns An `Object` containing all fields in the document or `undefined`
         * if the document doesn't exist.
         */
        _fieldsProto() {
          return this._document?.data.clone().value.mapValue.fields ?? void 0;
        }
        /**
         * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
         * document or field doesn't exist.
         *
         * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
         * field.
         * @returns The data at the specified field location or undefined if no such
         * field exists in the document.
         */
        // We are using `any` here to avoid an explicit cast by our users.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get(e) {
          if (this._document) {
            const t = this._document.data.field(_("DocumentSnapshot.get", e));
            if (null !== t) return this._userDataWriter.convertValue(t);
          }
        }
      };
      QueryDocumentSnapshot = class extends it {
        /**
         * Retrieves all fields in the document as an `Object`.
         *
         * @override
         * @returns An `Object` containing all fields in the document.
         */
        data() {
          return super.data();
        }
      };
      QuerySnapshot = class {
        /** @hideconstructor */
        constructor(e, t) {
          this._docs = t, this.query = e;
        }
        /** An array of all the documents in the `QuerySnapshot`. */
        get docs() {
          return [...this._docs];
        }
        /** The number of documents in the `QuerySnapshot`. */
        get size() {
          return this.docs.length;
        }
        /** True if there are no documents in the `QuerySnapshot`. */
        get empty() {
          return 0 === this.docs.length;
        }
        /**
         * Enumerates all of the documents in the `QuerySnapshot`.
         *
         * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
         * each document in the snapshot.
         * @param thisArg - The `this` binding for the callback.
         */
        forEach(e, t) {
          this._docs.forEach(e, t);
        }
      };
      AppliableConstraint = class {
      };
      QueryConstraint = class extends AppliableConstraint {
      };
      QueryFieldFilterConstraint = class _QueryFieldFilterConstraint extends QueryConstraint {
        /**
         * @internal
         */
        constructor(e, t, r2) {
          super(), this._field = e, this._op = t, this._value = r2, /** The type of this query constraint */
          this.type = "where";
        }
        static _create(e, t, r2) {
          return new _QueryFieldFilterConstraint(e, t, r2);
        }
        _apply(e) {
          const t = this._parse(e);
          return __PRIVATE_validateNewFieldFilter(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t));
        }
        _parse(e) {
          const t = p(e.firestore), r2 = (function __PRIVATE_newQueryFilter(e2, t2, r3, n2, i, s2, o2) {
            let a2;
            if (
              /**
              * Validates the input string as a field comparison operator.
              */
              (function __PRIVATE_validateQueryOperator(e3, t3) {
                if ("number" == typeof e3 && isNaN(e3) && "==" !== t3 && "!=" !== t3 && "array-contains" !== t3) throw new Error("Invalid query. You can only perform '==' and '!=' comparisons on NaN.");
                if (null === e3 && "==" !== t3 && "!=" !== t3 && "array-contains" !== t3) throw new Error("Invalid query. You can only perform '==' and '!=' comparisons on Null.");
              })(o2, s2), i.isKeyField()
            ) {
              if ("array-contains" === s2 || "array-contains-any" === s2) throw new k(x.INVALID_ARGUMENT, `Invalid Query. You can't perform '${s2}' queries on documentId().`);
              if ("in" === s2 || "not-in" === s2) {
                __PRIVATE_validateDisjunctiveFilterElements(o2, s2);
                const t3 = [];
                for (const r4 of o2) t3.push(__PRIVATE_parseDocumentIdValue(n2, e2, r4));
                a2 = {
                  arrayValue: {
                    values: t3
                  }
                };
              } else a2 = __PRIVATE_parseDocumentIdValue(n2, e2, o2);
            } else "in" !== s2 && "not-in" !== s2 && "array-contains-any" !== s2 || __PRIVATE_validateDisjunctiveFilterElements(o2, s2), a2 = __PRIVATE_parseQueryValue(
              r3,
              t2,
              o2,
              /* allowArrays= */
              "in" === s2 || "not-in" === s2
            );
            const u2 = FieldFilter.create(i, s2, a2);
            return u2;
          })(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
          return r2;
        }
      };
      QueryCompositeFilterConstraint = class _QueryCompositeFilterConstraint extends AppliableConstraint {
        /**
         * @internal
         */
        constructor(e, t) {
          super(), this.type = e, this._queryConstraints = t;
        }
        static _create(e, t) {
          return new _QueryCompositeFilterConstraint(e, t);
        }
        _parse(e) {
          const t = this._queryConstraints.map(((t2) => t2._parse(e))).filter(((e2) => e2.getFilters().length > 0));
          return 1 === t.length ? t[0] : CompositeFilter.create(t, this._getOperator());
        }
        _apply(e) {
          const t = this._parse(e);
          return 0 === t.getFilters().length ? e : ((function __PRIVATE_validateNewFilter(e2, t2) {
            let r2 = e2;
            const n2 = t2.getFlattenedFilters();
            for (const e3 of n2) __PRIVATE_validateNewFieldFilter(r2, e3), r2 = __PRIVATE_queryWithAddedFilter(r2, e3);
          })(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t)));
        }
        _getQueryConstraints() {
          return this._queryConstraints;
        }
        _getOperator() {
          return "and" === this.type ? "and" : "or";
        }
      };
      AbstractUserDataWriter = class {
        convertValue(e, t = "none") {
          switch (__PRIVATE_typeOrder(e)) {
            case 0:
              return null;
            case 2:
              return e.booleanValue;
            case 3:
              if ("mapValue" in e) {
                if (__PRIVATE_isInt32Value(e)) return this.convertToInt32Value(e.mapValue);
                if (__PRIVATE_isDecimal128Value(e)) return this.convertToDecimal128Value(e.mapValue);
              }
              return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
            case 4:
              return this.convertTimestamp(e.timestampValue);
            case 6:
              return this.convertServerTimestamp(e, t);
            case 7:
              return e.stringValue;
            case 8:
              return "bytesValue" in e ? this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue)) : this.convertToBytesWithSubtype(e.mapValue);
            case 9:
              return this.convertReference(e.referenceValue);
            case 11:
              return this.convertGeoPoint(e.geoPointValue);
            case 13:
              return this.convertArray(e.arrayValue, t);
            case 15:
              return this.convertObject(e.mapValue, t);
            case 14:
              return this.convertVectorValue(e.mapValue);
            case 12:
              return this.convertToRegexValue(e.mapValue);
            case 10:
              return this.convertToBsonObjectId(e.mapValue);
            case 5:
              return this.convertToBsonTimestamp(e.mapValue);
            case 16:
              return MaxKey.instance();
            case 1:
              return MinKey.instance();
            default:
              throw z(62114, {
                value: e
              });
          }
        }
        convertObject(e, t) {
          return this.convertObjectMap(e.fields, t);
        }
        /**
         * @internal
         */
        convertObjectMap(e, t = "none") {
          const r2 = {};
          return forEach(e, ((e2, n2) => {
            r2[e2] = this.convertValue(n2, t);
          })), r2;
        }
        /**
         * @internal
         */
        convertVectorValue(e) {
          const t = e.fields?.[me].arrayValue?.values?.map(((e2) => __PRIVATE_normalizeNumber(e2.doubleValue)));
          return new VectorValue(t);
        }
        convertToBsonObjectId(e) {
          const t = e.fields?.[Pe]?.stringValue ?? "";
          return new BsonObjectId(t);
        }
        convertToBytesWithSubtype(e) {
          const t = e.fields?.[Fe], r2 = t?.bytesValue;
          if (!r2) throw new Error("Received incorrect bytesValue for Bytes with subtype");
          const n2 = __PRIVATE_normalizeByteString(r2).toUint8Array();
          if (0 === n2.length) throw new Error("Received empty bytesValue for Bytes with subtype");
          const i = n2[0], s2 = n2.slice(1);
          return new Bytes(ByteString.fromUint8Array(s2), i);
        }
        convertToBsonTimestamp(e) {
          const t = e.fields?.[be], r2 = Number(t?.mapValue?.fields?.[we]?.integerValue), n2 = Number(t?.mapValue?.fields?.[ge]?.integerValue);
          return new BsonTimestamp(r2, n2);
        }
        convertToRegexValue(e) {
          const t = e.fields?.[Ie]?.mapValue?.fields?.[Ae]?.stringValue ?? "", r2 = e.fields?.[Ie]?.mapValue?.fields?.[Re]?.stringValue ?? "";
          return new RegexValue(t, r2);
        }
        convertToInt32Value(e) {
          const t = Number(e.fields?.[pe]?.integerValue);
          return new Int32Value(t);
        }
        convertToDecimal128Value(e) {
          const t = e.fields?.[ye]?.stringValue ?? "";
          return new Decimal128Value(t);
        }
        convertGeoPoint(e) {
          return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
        }
        convertArray(e, t) {
          return (e.values || []).map(((e2) => this.convertValue(e2, t)));
        }
        convertServerTimestamp(e, t) {
          switch (t) {
            case "previous":
              const r2 = __PRIVATE_getPreviousValue(e);
              return null == r2 ? null : this.convertValue(r2, t);
            case "estimate":
              return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
            default:
              return null;
          }
        }
        convertTimestamp(e) {
          const t = __PRIVATE_normalizeTimestamp(e);
          return new Timestamp(t.seconds, t.nanos);
        }
        convertDocumentKey(e, t) {
          const r2 = ResourcePath.fromString(e);
          __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(r2), 9688, {
            name: e
          });
          const n2 = new DatabaseId(r2.get(1), r2.get(3)), i = new S(r2.popFirst(5));
          return n2.isEqual(t) || // TODO(b/64130202): Somehow support foreign references.
          st(`A document reference to ${i} refers to a different database (${n2.projectId}/${n2.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
        }
      };
      A = class extends AbstractUserDataWriter {
        constructor(e) {
          super(), this.firestore = e;
        }
        convertBytes(e) {
          return new Bytes(e);
        }
        convertReference(e) {
          const t = this.convertDocumentKey(e, this.firestore._databaseId);
          return new DocumentReference(
            this.firestore,
            /* converter= */
            null,
            t
          );
        }
      };
    }
  });

  // node_modules/@firebase/firestore/dist/lite/index.browser.esm.js
  var ot;
  var init_index_browser_esm = __esm({
    "node_modules/@firebase/firestore/dist/lite/index.browser.esm.js"() {
      init_index_esm4();
      init_index_esm2();
      init_common_Cl98i9kc_esm();
      init_common_Cl98i9kc_esm();
      init_index_esm();
      init_index_esm3();
      init_bloom_blob_es2018();
      ot = "4.19.0";
      !(function __PRIVATE_registerFirestore() {
        c(`${SDK_VERSION}_lite`), _registerComponent(new Component("firestore/lite", ((t, { instanceIdentifier: e, options: s2 }) => {
          const i = t.getProvider("app").getImmediate(), a2 = new n(new r(t.getProvider("auth-internal")), new o(i, t.getProvider("app-check-internal")), h(i, e), i);
          return s2 && a2._setSettings(s2), a2;
        }), "PUBLIC").setMultipleInstances(true)), // RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
        registerVersion("firestore-lite", ot, ""), registerVersion("firestore-lite", ot, "esm2020");
      })();
    }
  });

  // node_modules/firebase/firestore/lite/dist/esm/index.esm.js
  var init_index_esm7 = __esm({
    "node_modules/firebase/firestore/lite/dist/esm/index.esm.js"() {
      init_index_browser_esm();
    }
  });

  // src/background.js
  var require_background = __commonJS({
    "src/background.js"() {
      init_firebase();
      init_index_esm6();
      init_index_esm7();
      var db = getFirestore(app);
      function getToken(interactive) {
        return new Promise((resolve, reject) => {
          chrome.identity.getAuthToken({ interactive }, (token) => {
            if (chrome.runtime.lastError || !token) {
              reject(
                new Error(chrome.runtime.lastError?.message || "No token")
              );
            } else {
              resolve(token);
            }
          });
        });
      }
      async function signIn() {
        const token = await getToken(true);
        const cred = GoogleAuthProvider.credential(null, token);
        const result = await signInWithCredential(auth, cred);
        return result.user;
      }
      async function doSignOut() {
        try {
          const token = await getToken(false);
          await chrome.identity.removeCachedToken({ token });
        } catch (e) {
        }
        await signOut(auth);
      }
      async function checkSession(meetCode) {
        const user = auth.currentUser;
        if (!user) return { status: "signed_out" };
        const email = user.email.toLowerCase();
        console.log("[SEEge bg] signed in as", email, "uid:", user.uid);
        let teacherDoc;
        try {
          teacherDoc = await getDoc(doc(db, "teachers", email));
        } catch (error) {
          throw new Error("TEACHERS READ failed: " + error.message);
        }
        if (teacherDoc.exists()) {
          return { status: "teacher", email };
        }
        let snapshot;
        try {
          const sessionsQuery = query(
            collection(db, "sessions"),
            where("meetCodes", "array-contains", meetCode),
            where("status", "==", "live")
          );
          snapshot = await getDocs(sessionsQuery);
        } catch (error) {
          throw new Error("SESSIONS QUERY failed: " + error.message);
        }
        const liveSessions = snapshot.docs.filter((item) => item.data().status === "live").sort(
          (a2, b2) => b2.data().scheduledStart.toMillis() - a2.data().scheduledStart.toMillis()
        );
        if (liveSessions.length === 0) {
          return { status: "no_session", email };
        }
        const sessionDoc = liveSessions[0];
        const session = sessionDoc.data();
        return {
          status: "active",
          email,
          sessionId: sessionDoc.id,
          className: session.className,
          scheduledStart: session.scheduledStart.toMillis(),
          scheduledEnd: session.scheduledEnd.toMillis()
        };
      }
      async function saveStudent(sessionId, state) {
        const user = auth.currentUser;
        if (!user) throw new Error("Not signed in");
        const email = user.email.toLowerCase();
        await setDoc(
          doc(db, "sessions", sessionId, "students", email),
          {
            name: user.displayName || email,
            visits: state.visits,
            awayCount: state.awayCount,
            awaySeconds: state.awaySeconds,
            lastHeartbeat: serverTimestamp(),
            extensionVersion: chrome.runtime.getManifest().version
          },
          { merge: true }
        );
      }
      chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        (async () => {
          try {
            await auth.authStateReady();
            if (msg.type === "signin") {
              const user = await signIn();
              sendResponse({
                user: { email: user.email, uid: user.uid }
              });
            } else if (msg.type === "signout") {
              await doSignOut();
              sendResponse({ ok: true });
            } else if (msg.type === "whoami") {
              const user = auth.currentUser;
              sendResponse({
                user: user ? { email: user.email, uid: user.uid } : null
              });
            } else if (msg.type === "checkSession") {
              sendResponse(await checkSession(msg.meetCode));
            } else if (msg.type === "saveStudent") {
              await saveStudent(msg.sessionId, msg.state);
              sendResponse({ ok: true });
            }
          } catch (error) {
            sendResponse({ error: error.message });
          }
        })();
        return true;
      });
    }
  });
  require_background();
})();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/web-extension-esm/register-1dTRtNx2.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/web-extension-esm/index.js:
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/webchannel-wrapper/dist/bloom-blob/esm/bloom_blob_es2018.js:
  (** @license
  Copyright The Closure Library Authors.
  SPDX-License-Identifier: Apache-2.0
  *)
  (** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  *)

@firebase/firestore/dist/lite/common-Cl98i9kc.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * Copyright 2021 M.Vokhmentsev
   *
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
