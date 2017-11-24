/**
 * Auth: enixlee
 * Date: 2017/5/19
 * Description: MobileAdapter
 */
export class MobileAdapter {
  constructor (win) {
    this.__window = win;
  }

  enable () {
    let dpr, rem, scale;
    let docEl = document.documentElement;
    let fontEl = document.createElement('style');
    let metaEl = document.querySelector('meta[name="viewport"]');

    dpr = this.__window.devicePixelRatio || 1;
    rem = docEl.clientWidth * dpr / 10;
    scale = 1 / dpr;

    // 设置viewport，进行缩放，达到高清效果
    metaEl.setAttribute('content', 'width=' + dpr * docEl.clientWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    // 设置data-dpr属性，留作的css hack之用
    docEl.setAttribute('data-dpr', dpr);

    // 动态写入样式
    docEl.firstElementChild.appendChild(fontEl);
    fontEl.innerHTML = 'html{font-size:' + rem + 'px!important;}';

    // 给js调用的，某一dpr下rem和px之间的转换函数
    this.__window.rem2px = function (v) {
      v = parseFloat(v);
      return v * rem;
    };
    this.__window.px2rem = function (v) {
      v = parseFloat(v);
      return v / rem;
    };

    this.__window.dpr = dpr;
    this.__window.rem = rem;
  }
}

export function createMobileAdapter (win) {
  return new MobileAdapter(win);
}