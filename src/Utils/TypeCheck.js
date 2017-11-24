/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/3
 * Time: 下午2:41
 */
let Vue = window.PMApp.Vue;
let Assert = Vue.prototype.getPlugin('Assert');
let lodash = Vue.prototype.getPlugin('lodash');

/**
 * 是否是空
 * @param value
 * @returns {*|boolean}
 */
export function isNil (value) {
  return lodash.isNull(value) || lodash.isUndefined(value)
}

/**
 * 数字类型检测
 * @param value
 * @param min
 * @param max
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckNumber (value, min = null, max = null, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }
  Assert.isNumber(value);

  if (!lodash.isNull(min) && !lodash.isUndefined(min)) {
    Assert.gte(value, min);
  }

  if (!lodash.isNull(max) && !lodash.isUndefined(max)) {
    Assert.lte(value, max);
  }
}

/**
 * 字符串类型检测
 * @param value
 * @param min
 * @param max
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckString (value, min = null, max = null, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }
  Assert.isString(value);

  if (!lodash.isNull(min) && !lodash.isUndefined(min)) {
    Assert.gte(value.length, min);
  }

  if (!lodash.isNull(max) && !lodash.isUndefined(max)) {
    Assert.lte(value.length, max);
  }
}

/**
 * json类型检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckJsonString (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isJsonString(value);
}

/**
 * 数组json串检测
 * @param value
 * @param choice
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckJsonArrayChoice (value, choice, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isJsonString(value);

  let jsonObj = JSON.parse(value);
  lodash.forEach(jsonObj, (n) => {
    Assert.inChoice(n, choice);
  });
}

/**
 * 选项检测
 * @param value
 * @param choice
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckChoice (value, choice, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.inChoice(value, choice);
}

/**
 * 数组检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckArray (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isArray(value);
}

/**
 * uid检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckUserId (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  typeCheckString(value, null, 64, nullEnable);
}

/**
 * guid检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckGuid (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  typeCheckString(value, 32, 64, nullEnable);
}

/**
 * 时间格式化检测，只接受时间格式为：yyyy-mm-dd h:i:s
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckDateString (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isString(value, `date string is invalid, got ${value}`);

  let dateParts = lodash.words(value);

  Assert.isArray(dateParts, `date string is invalid, got ${value}`);
  Assert.isTrue(dateParts.length === 6, `date string is invalid, got ${value}`);

  typeCheckNumber(parseInt(dateParts[0]), 1970, 9999);
  typeCheckNumber(parseInt(dateParts[1]), 1, 12);
  typeCheckNumber(parseInt(dateParts[2]), 1, 31);
  typeCheckNumber(parseInt(dateParts[3]), 0, 23);
  typeCheckNumber(parseInt(dateParts[4]), 0, 59);
  typeCheckNumber(parseInt(dateParts[5]), 0, 59);
}

/**
 * 是否是手机号
 * @param value
 * @returns {boolean}
 */
export function isCellphone (value) {
  let reg = new RegExp('^13[\\d]{9}$|^14[5,7]{1}\\d{8}$|^15[^4]{1}\\d{8}$|^17[0,1,6,7,8]{1}\\d{8}$|^18[\\d]{9}$');
  return reg.test(value);
}


/**
 * 手机号检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckCellphone (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isString(value, `cellphone number is invalid, got ${value}`);

  Assert.isTrue(isCellphone(value), `cellphone number is invalid, got ${value}`);
}

/**
 * 是否是md5
 * @param value
 * @returns {boolean}
 */
export function isMD5 (value) {
  let reg = new RegExp('[0-9a-fA-F]{32}');
  return reg.test(value);
}

/**
 * MD5检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckMd5 (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isTrue(lodash.isString(value) && isMD5(value), `md5 string invalid, got ${value}`);
}

/**
 * 16位md5
 * @param value
 * @returns {boolean}
 */
export function isMD5OfLength16 (value) {
  let reg = new RegExp('[a-fA-F0-9]{16}');
  return reg.test(value);
}

/**
 * 16位MD5检测
 * @param value
 * @param nullEnable
 * @returns {null}
 */
export function typeCheckMd5OfLength16 (value, nullEnable = false) {
  if (nullEnable && isNil(value)) {
    return null;
  }

  Assert.isTrue(lodash.isString(value) && isMD5OfLength16(value), `md5_16 string invalid, got ${value}`);
}

export default {
  typeCheckNumber,
  typeCheckString,
  typeCheckJsonString,
  typeCheckJsonArrayChoice,
  typeCheckChoice,
  typeCheckArray,
  typeCheckUserId,
  typeCheckGuid,
  typeCheckDateString,
  typeCheckCellphone,
  typeCheckMd5,
  typeCheckMd5OfLength16,
  isCellphone,
  isNil
};
