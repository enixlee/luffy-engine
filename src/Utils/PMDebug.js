/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/2/28
 * Time: 下午5:33
 */

/**
 * 开发模式
 * @returns {boolean}
 */
export function isDebug () {
  return process.env.NODE_ENV === 'development';
}

/**
 * 测试环境
 * @returns {boolean}
 */
export function isTest () {
  return process.env.NODE_ENV === 'test';
}

/**
 * 生产环境
 * @returns {boolean}
 */
export function isProduction () {
  return process.env.NODE_ENV === 'production';
}

export default {
  isDebug,
  isTest,
  isProduction
};
