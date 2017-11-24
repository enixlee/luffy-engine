/**
 * Auth: enixlee
 * Date: 2017/3/23
 * Description: PMStorageCookie
 */
import * as StoreEngine from 'store/src/store-engine';
import * as CookieStorage from 'store/storages/cookieStorage';
import * as ExpirePlugin from 'store/plugins/expire';
import {default as StorageUtils} from './StorageUtils';

let Vue = window.PMApp.Vue;
let Utils = Vue.prototype.getPlugin('Utils');
let Assert = Vue.prototype.getPlugin('Assert');

let plugins = [
  ExpirePlugin
];

let Storage = StoreEngine.createStore([CookieStorage], plugins);

const COOKIE_DEFAULT_EXPIRE_TIME = 24 * 3600 * 1000; // 1 day

/**
 * 获取
 * @param key
 * @param D
 */
export function getItem (key, D) {
  return StorageUtils.get(Storage, key, D);
}

/**
 * 设置
 * @param key
 * @param value
 * @param expireTime
 */
export function setItem (key, value, expireTime = COOKIE_DEFAULT_EXPIRE_TIME) {
  Assert.isNumber(expireTime, `storage item expire time must be a number, but got ${expireTime}`);

  let expire = Utils.now() + expireTime;

  return StorageUtils.set(Storage, key, value, expire);
}

/**
 * 删除
 * @param key
 */
export function removeItem (key) {
  StorageUtils.remove(Storage, key);
}

/**
 * 遍历存储
 * @param fn
 * @param filter
 */
export function each (fn, filter) {
  StorageUtils.each(Storage, fn, filter);
}

export function getInstance () {
  return Storage;
}

export default {
  setItem,
  getItem,
  removeItem,
  each,
  getInstance
};
