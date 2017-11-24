/**
 * Auth: enixlee
 * Date: 2017/5/19
 * Description: FlexibleAdapter
 * 按设计稿750*xxx的比例变换，android不处理
 */
import {isAndroid, isIOS} from '../Utils/PMDevice'

export class FlexibleAdapter {
  constructor (win, lib) {
    this.doc = win.document;
    this.docEl = this.doc.documentElement;
    this.metaEl = this.doc.querySelector('meta[name="viewport"]');
    this.flexibleEl = this.doc.querySelector('meta[name="flexible"]');
    this.dpr = 0;
    this.scale = 0;
    this.tid = null;
    this.flexible = lib.flexible || (lib.flexible = {});

    this.window = win;
    this.lib = lib;
    this.window.AdapterLib = lib;
  }

  refreshRem () {
    let docEl = window.document.documentElement;
    let dpr = this.dpr || window.dpr;
    let width = docEl.getBoundingClientRect().width;
    if (width / dpr > 540) {
      width = 540 * dpr;
    }
    let rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    window.AdapterLib.flexible.rem = window.rem = rem;
  }

  enable () {
    if (this.metaEl) {
      // console.warn('将根据已有的meta标签来设置缩放比例');
      let match = this.metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
      if (match) {
        this.scale = parseFloat(match[1]);
        this.dpr = parseInt(1 / this.scale);
      }
    } else if (this.flexibleEl) {
      let content = this.flexibleEl.getAttribute('content');
      if (content) {
        let initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
        let maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
        if (initialDpr) {
          this.dpr = parseFloat(initialDpr[1]);
          this.scale = parseFloat((1 / this.dpr).toFixed(2));
        }
        if (maximumDpr) {
          this.dpr = parseFloat(maximumDpr[1]);
          this.scale = parseFloat((1 / this.dpr).toFixed(2));
        }
      }
    }

    if (!this.dpr && !this.scale) {
      let android = isAndroid();
      let isIPhone = isIOS();
      let devicePixelRatio = this.window.devicePixelRatio;
      if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!this.dpr || this.dpr >= 3)) {
          this.dpr = 3;
        } else if (devicePixelRatio >= 2 && (!this.dpr || this.dpr >= 2)) {
          this.dpr = 2;
        } else {
          this.dpr = 1;
        }
      } else {
        // 其他设备下，仍旧使用1倍的方案
        this.dpr = 1;
      }
      this.scale = 1 / this.dpr;
    }

    this.docEl.setAttribute('data-dpr', this.dpr);
    if (!this.metaEl) {
      this.metaEl = this.doc.createElement('meta');
      this.metaEl.setAttribute('name', 'viewport');
      this.metaEl.setAttribute('content', 'initial-scale=' + this.scale + ', maximum-scale=' + this.scale + ', minimum-scale=' + this.scale + ', user-scalable=no');
      if (this.docEl.firstElementChild) {
        this.docEl.firstElementChild.appendChild(this.metaEl);
      } else {
        let wrap = this.doc.createElement('div');
        wrap.appendChild(this.metaEl);
        this.doc.write(wrap.innerHTML);
      }
    }

    let that = this;
    this.window.addEventListener('resize', function () {
      clearTimeout(that.tid);
      that.tid = setTimeout(that.refreshRem, 300);
    }, false);
    this.window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        clearTimeout(that.tid);
        that.tid = setTimeout(that.refreshRem, 300);
      }
    }, false);

    if (this.doc.readyState === 'complete') {
      this.doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
      let document = this.doc;
      this.doc.addEventListener('DOMContentLoaded', function (e) {
        document.body.style.fontSize = 12 * dpr + 'px';
      }, false);
    }


    this.refreshRem();

    this.flexible.dpr = this.window.dpr = this.dpr;
    this.flexible.refreshRem = this.refreshRem;
    this.flexible.rem2px = function (d) {
      let val = parseFloat(d) * window.rem;
      if (typeof d === 'string' && d.match(/rem$/)) {
        val += 'px';
      }
      return val;
    };

    this.flexible.px2rem = function (d) {
      let val = parseFloat(d) / window.rem;
      if (typeof d === 'string' && d.match(/px$/)) {
        val += 'rem';
      }
      return val;
    };
    this.flexible.fontSizeFormat = function (f) {
      f = parseFloat(f);
      let dpr = window.dpr;
      if (dpr <= 1.0) {
        return Math.round(f / 2) * 1 + 'px';
      } else if (dpr > 1.0 && dpr <= 2.5) {
        return parseInt(f) * 1 + 'px';
      } else if (dpr >= 2.5 && dpr < 2.75) {
        return Math.round(f * 2.5 / 2) * 1 + 'px';
      } else if (dpr >= 2.75 && dpr < 3) {
        return Math.round(f * 2.75 / 2) * 1 + 'px';
      } else if (dpr >= 3.0 && dpr < 4.0) {
        return Math.round(f * 3 / 2) * 1 + 'px';
      } else {
        return parseInt(f) * 2 + 'px';
      }
    }
  }
}

export function createAdapter (win, lib) {
  return new FlexibleAdapter(win, lib);
}