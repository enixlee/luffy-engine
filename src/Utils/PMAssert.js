/**
 * Created by enixlee on 2017/3/22.
 */
import _ from 'lodash';
let lodash = _;

/**
 * 断言
 * @param condition
 * @param msg
 */
export function assert (condition, msg) {
  if (!condition) {
    throw new Error(`[paymini assert] ${msg}`);
  }
}

/**
 * 是否为数字
 * @param value
 * @param msg
 */
export function isNumber (value, msg) {
  assert(lodash.isNumber(value), msg || `number is expected, but got ${value}`);
}

/**
 * 是否为字符串
 * @param value
 * @param msg
 */
export function isString (value, msg) {
  assert(lodash.isString(value), msg || `string is expected, but got ${value}`);
}

/**
 * 是否是非空字符串
 * @param value
 * @param msg
 */
export function isStringNotEmpty (value, msg) {
  assert(lodash.isString(value) && value !== '', msg || `string is expected, but got ${value}`);
}

/**
 * 是否是布尔值
 * @param value
 * @param msg
 */
export function isBoolean (value, msg) {
  assert(lodash.isBoolean(value), msg || `boolean is expected, but got ${value}`);
}

/**
 * 不为null且不为undefined
 * @param value
 * @param msg
 */
export function isNotNil (value, msg) {
  assert(!lodash.isNull(value) && !lodash.isUndefined(value), msg || `value should not be null or undefined, but got ${value}`);
}

/**
 * 空值判断null or undefined
 * @param value
 * @param msg
 */
export function isNil (value, msg) {
  assert(lodash.isNull(value) || lodash.isUndefined(value), msg || `value should not be null or undefined, but got ${value}`);
}

/**
 * 是否是数组
 * @param value
 * @param msg
 */
export function isArray (value, msg) {
  assert(lodash.isArray(value), msg || `array is expected, but got ${value}`);
}

/**
 * 是否是对象
 * @param value
 * @param msg
 */
export function isObject (value, msg) {
  assert(lodash.isObject(value), msg || `object is expected, but got ${value}`);
}

/**
 * date对象
 * @param value
 * @param msg
 */
export function isDate (value, msg) {
  assert(lodash.isDate(value), msg || `date object is expected, but got ${value}`);
}

/**
 * 是否是function
 * @param value
 * @param msg
 */
export function isFunction (value, msg) {
  assert(lodash.isFunction(value), msg || `Function is expected, but got ${value}`);
}

/**
 * 是否相等
 * @param value
 * @param other
 * @param msg
 */
export function isEqual (value, other, msg) {
  assert(lodash.isEqual(value, other), msg || `two params must be equal, , but got ${value} and ${other}`);
}

/**
 * 不相等
 * @param value
 * @param other
 * @param msg
 */
export function notEqual (value, other, msg) {
  assert(!lodash.isEqual(value, other), msg || `two params can not be equal, but got two ${value}`);
}

/**
 * 不为空
 * @param value
 * @param msg
 */
export function notEmpty (value, msg) {
  assert(!lodash.isEmpty(value), msg || `params must be not empty, but got ${value}`);
}

/**
 * 空值
 * @param value
 * @param msg
 */
export function isEmpty (value, msg) {
  assert(lodash.isEmpty(value), msg || `params must be empty, but got ${value}`);
}

/**
 * 在选项中，如'a'在['a','b',1]中
 * @param value
 * @param choiceArray
 * @param msg
 */
export function inChoice (value, choiceArray, msg) {
  isArray(choiceArray, `choice range must be an array,, but got ${choiceArray}`);

  assert(lodash.includes(choiceArray, value), msg || `${value} not choice item, choices are [${choiceArray}]`);
}

/**
 * 在范围内，如55在[1，100]之间
 * @param number
 * @param range
 * @param msg
 */
export function inRange (number, range, msg) {
  assert(lodash.isArray(range) && range.length === 2 && lodash.isNumber(range[0]) && lodash.isNumber(range[1]),
    `range must be an array which has two number elements, but got ${range}`);

  assert(lodash.inRange(number, range[0], range[1]), msg || `number ${number} not in range [${range}]`);
}

/**
 * 字典包含key
 * @param key
 * @param object
 * @param msg
 */
export function hasKey (key, object, msg) {
  isString(key, `key must be an string, but got [${typeof key}] ${key}`);
  assert(lodash.has(object, key), msg || `object ${object} does not has key: ${key}`);
}

/**
 * 是json串
 * @param value
 * @param msg
 */
export function isJsonString (value, msg) {
  isString(value, `param ${value} is not json string!`);

  let jsonValue = JSON.parse(value);
  isObject(jsonValue, msg || `params ${jsonValue} is not json string!`);
}

/**
 * 大于
 * @param value
 * @param min
 * @param msg
 */
export function gt (value, min, msg) {
  isNumber(value, `compare number is not type of number, ${value}`);
  isNumber(min, `compare base number is not type of number, ${min}`);

  assert(lodash.gt(value, min), msg || `${value} is not greater than ${min}`);
}

/**
 * 大于等于
 * @param value
 * @param min
 * @param msg
 */
export function gte (value, min, msg) {
  isNumber(value, `compare number is not type of number, ${value}`);
  isNumber(min, `compare base number is not type of number, ${min}`);

  assert(lodash.gte(value, min), msg || `${value} is not greater or equal than ${min}`);
}

/**
 * 小于
 * @param value
 * @param max
 * @param msg
 */
export function lt (value, max, msg) {
  isNumber(value, `compare number is not type of number, ${value}`);
  isNumber(max, `compare base number is not type of number, ${max}`);

  assert(lodash.lt(value, max), msg || `${value} is not less than ${max}`);
}

/**
 * 小于等于
 * @param value
 * @param max
 * @param msg
 */
export function lte (value, max, msg) {
  isNumber(value, `compare number is not type of number, ${value}`);
  isNumber(max, `compare base number is not type of number, ${max}`);

  assert(lodash.lte(value, max), msg || `${value} is not less or equal than ${max}`);
}

/**
 * 是true
 * @param value
 * @param msg
 */
export function isTrue (value, msg) {
  assert(value === true, msg || `value is not true, ${value}`);
}

/**
 * 是false
 * @param value
 * @param msg
 */
export function isNotTrue (value, msg) {
  assert(value === false, msg || `value is boolean false, ${value}`);
}

const Assert = {
  assert,
  isNumber,
  isString,
  isStringNotEmpty,
  isBoolean,
  isNotNil,
  isNil,
  isArray,
  isObject,
  isDate,
  isFunction,
  isEqual,
  notEqual,
  notEmpty,
  isEmpty,
  inChoice,
  inRange,
  hasKey,
  isJsonString,
  gt,
  gte,
  lt,
  lte,
  isTrue,
  isNotTrue
};

export default Assert;
