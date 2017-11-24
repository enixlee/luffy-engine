/**
 * Auth: enixlee
 * Date: 2017/3/29
 * Description: PMVueEngine
 */
import {default as PMVueEngineConfig} from './PMVueEngineConfig';
import {default as Log} from './Plugins/Log';

import store from './Vuex/store';

window.PMApp['DataModule'] = window.PMApp['DataModule'] || store;

let Vue = window.PMApp.Vue;
let lodash = Vue.prototype.getPlugin('lodash');

const PMVueEngine = {
  run: (fn) => {
    PMVueEngineConfig.description();
    Vue.use(Log);
    if (lodash.isFunction(fn)) {
      fn();
    }
  }
};

export default PMVueEngine;
