/**
 * Auth: enixlee
 * Date: 2017/6/26
 * Description: PMDevice
 */
const DEVICE_MIN_WIDTH = 640;

/**
 * android设备
 * @return {Array|{index: number, input: string}}
 */
export function isAndroid () {
  return window.navigator.appVersion.match(/android/gi);
}

/**
 * ios设备
 * @return {Array|{index: number, input: string}}
 */
export function isIOS () {
  return window.navigator.appVersion.match(/iphone/gi);
}

/**
 * 浏览器版本
 * @type {{versions: {trident, presto, webKit, gecko, mobile, ios, android, iPhone, iPad, webApp, weixin, qq}, language: string}}
 */
export const Browser = {
  versions: function () {
    let u = navigator.userAgent, app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      mac: u.indexOf('Mac OS X') > 0,// mac系统
      qq: u.match(/\sQQ/i) === " qq" //是否QQ
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

/**
 * 最小适配宽,需要适配
 * @return {boolean}
 */
export function isShorterThanMinWidth () {
  let width = window['LUFFY_ENGINE_ENV']['DEVICE_MIN_WIDTH'] || DEVICE_MIN_WIDTH;

  return screenWidth() <= parseInt(width);
}

/**
 * 视口宽
 * @return {Number}
 */
export function screenWidth () {
  return parseInt(document.documentElement.getBoundingClientRect().width);
}

export default {
  isAndroid,
  isIOS,
  isShorterThanMinWidth,
  screenWidth,
  Browser
}