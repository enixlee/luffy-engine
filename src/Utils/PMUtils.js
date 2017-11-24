/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/13
 * Time: 下午2:28
 */
import * as print from 'sprintf-js';
import Assert from './PMAssert';

/**
 * 格式化输出
 * format('%s%02d%02f','aaa',1,1.1)
 * @param formatStr
 * @param args
 */
export function format (formatStr, ...args) {
  return print.sprintf(formatStr, ...args);
}

/**
 * 日期：今天
 * xxxx-xx-xx
 * @returns {string}
 */
export function today () {
  let date = new Date();
  return date.getFullYear() +
    '-' + (format('%02d', date.getMonth() + 1)) +
    '-' + format('%02d', date.getDate() + 1);
}

/**
 * 当前时间的毫秒时间戳
 * @returns {number}
 */
export function now () {
  return (new Date()).getTime();
}

const SCRIPTS_CACHE = {};

/**
 * 加载远程js文件
 * @param src
 * @returns {*}
 */
export function loadScript (src) {
  Assert.isStringNotEmpty(src, `script source error,got ${src}`);
  if (SCRIPTS_CACHE[src]) {
    return SCRIPTS_CACHE[src];
  }
  let loadPromise = SCRIPTS_CACHE[src] = new Promise(resolve => {
    let el = document.createElement('script');
    let loaded = false;
    el.onload = el.onreadystatechange = () => {
      if ((el.readyState && el.readyState !== 'complete' && el.readyState !== 'loaded') || loaded) {
        return false;
      }
      el.onload = el.onreadystatechange = null;
      loaded = true;
      resolve();
    };

    el.async = true;
    el.src = src;
    let head = document.getElementsByTagName('head')[0];
    head.insertBefore(el, head.firstChild);
  });

  return loadPromise;
}

export default {
  format,
  today,
  now,
  loadScript
};
