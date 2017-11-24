/**
 * Auth: enixlee
 * Date: 2017/3/23
 * Description: PMStorageLocal
 */
import * as StoreEngine from 'store/src/store-engine';
import * as LocalStorage from 'store/storages/localStorage';
import {default as StorageUtils} from './StorageUtils';

let plugins = [];

let Storage = StoreEngine.createStore([LocalStorage], plugins);

/**
 * 存储
 * @param key
 * @param value
 */
export function setItem (key, value) {
  return StorageUtils.set(Storage, key, value);
}

/**
 * 获取缓存的key值
 * @param key
 * @param D 未找到结果的默认返回值
 * @returns {*}
 */
export function getItem (key, D) {
  return StorageUtils.get(Storage, key, D);
}

/**
 * 移除缓存的key值
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
