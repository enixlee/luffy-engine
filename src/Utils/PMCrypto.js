/**
 * Created by enixlee on 2017/3/22.
 */
import md5 from 'crypto-js/md5';
import base64 from 'crypto-js/enc-base64';
import Hex from 'crypto-js/enc-hex';
import sha1 from 'crypto-js/sha1';
import Assert from './PMAssert';

/**
 * 16进制字符串转字符串
 * @param strInput
 * @returns {string}
 */
function hex2String (strInput) {
  let nInputLength = strInput.length;
  Assert.isTrue(nInputLength % 4 === 0, `input hex string not valid, got ${strInput}`);
  // 考虑中文，固定占位4位
  let StrHex = '';
  for (let i = 0; i < nInputLength; i = i + 4) {
    let str = strInput.substr(i, 4);
    let n = parseInt(str, 16);
    StrHex += String.fromCharCode(n);
  }
  return StrHex;
}

/**
 * 字符串转成16进制串（每个字符占4位，不足4位前面补0）
 * @param inputStr
 * @returns {string}
 */
function stringToHex (inputStr) {
  let val = '';
  for (let i = 0; i < inputStr.length; i++) {
    let char = inputStr.charCodeAt(i).toString(16);
    while (char.length < 4) {
      char = '0' + char;
    }
    if (val === '') {
      val = char;
    } else {
      val += char;
    }
  }
  return val;
}

/**
 * md5加密
 * @param message
 * @returns {string}
 * @constructor
 */
export function MD5 (message) {
  Assert.isStringNotEmpty(message);
  let md5Msg = md5(message);
  return md5Msg + '';
}

/**
 * base64解密
 * @param base64String
 * @returns {string}
 */
export function parseBase64 (base64String) {
  Assert.isStringNotEmpty(base64String);
  let base64Decode = base64.parse(base64String);
  let hexDecode = Hex.stringify(base64Decode);
  return hex2String(hexDecode);
}

/**
 * base64加密
 * @param message
 */
export function stringifyBase64 (message) {
  Assert.isStringNotEmpty(message);
  let hexStr = stringToHex(message);
  let hexEncode = Hex.parse(hexStr);
  return base64.stringify(hexEncode);
}

/**
 * sha1
 * @param message
 * @constructor
 */
export function SHA1 (message) {
  Assert.isStringNotEmpty(message);
  return sha1(message);
}