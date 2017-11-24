/**
 * Auth: enixlee
 * Date: 2017/3/23
 * Description: StorageUtils
 */
let Vue = window.PMApp.Vue;
let Crypto = Vue.prototype.getPlugin('Crypto');
let Assert = Vue.prototype.getPlugin('Assert');
let lodash = Vue.prototype.getPlugin('lodash');

export function enableStorageEncrypeo () {
  window.PMStorageEncrypto = true;
}

export function disableStorageEncrypeo () {
  window.PMStorageEncrypto = false;
}

export function isStorageEncryptoEnable () {
  return window.PMStorageEncrypto;
}

/**
 * 加密key
 * @param key
 * @returns {*}
 */
export function encodeStorageKey (key) {
  Assert.isStringNotEmpty(key);
  return isStorageEncryptoEnable() ? Crypto.MD5(key) : key;
}

/**
 * 加密存储的value
 * @param value
 * @returns {*}
 */
export function encodeStorageValue (value) {
  Assert.isNotNil(value);
  let jsonData = JSON.stringify(value);
  return isStorageEncryptoEnable() ? Crypto.stringifyBase64(jsonData) : jsonData;
}

/**
 * 解密 存储的value
 * @param storageValue
 * @returns {*}
 */
export function decodeStorageValue (storageValue) {
  if (!lodash.isString(storageValue)) {
    return storageValue;
  }

  return isStorageEncryptoEnable() ? JSON.parse(Crypto.parseBase64(storageValue)) : JSON.parse(storageValue);
}

/**
 * 设置
 * @param storage
 * @param key
 * @param value
 * @param expireTime
 */
export function set (storage, key, value, expireTime) {
  let cacheKey = encodeStorageKey(key);
  let cacheValue = value;
  if (!lodash.isNull(value) && !lodash.isUndefined(value)) {
    cacheValue = encodeStorageValue(value);
  }
  return storage.set(cacheKey, cacheValue, expireTime);
}

/**
 * 获取
 * @param storage
 * @param key
 * @param D
 */
export function get (storage, key, D) {
  let cacheKey = encodeStorageKey(key);
  let cacheValue = storage.get(cacheKey);
  if (!lodash.isString(cacheValue)) {
    return D;
  }

  return decodeStorageValue(cacheValue);
}

/**
 * 删除
 * @param storage
 * @param key
 */
export function remove (storage, key) {
  let cacheKey = encodeStorageKey(key);
  storage.remove(cacheKey);
}

/**
 * 遍历存储
 * @param storage
 * @param fn
 * @param filter
 */
export function each (storage, fn, filter) {
  let lodash = Vue.prototype.getPlugin('lodash');
  storage.each(function (v, k) {
    let shouldFilter = lodash.isFunction(filter) && filter(k);
    if (!shouldFilter) {
      let value = decodeStorageValue(storage.get(k));
      fn(value, k);
    }
  });
}

export default {
  encodeStorageKey,
  encodeStorageValue,
  decodeStorageValue,
  enableStorageEncrypeo,
  disableStorageEncrypeo,
  isStorageEncryptoEnable,
  set,
  get,
  remove,
  each
};
