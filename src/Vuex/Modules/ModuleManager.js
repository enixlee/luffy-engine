/**
 * Created by enixlee.
 * Author: enixlee
 * Date: 2017/3/29
 * Time: 上午11:06
 */
import {STORE_CACHE_KEY_PREFIX} from '../../Constants/PMConstants';
import * as PMSubjects from '../PMSubjects';

let Vue = window.PMApp.Vue;
let Assert = Vue.prototype.getPlugin('Assert');
let lodash = Vue.prototype.getPlugin('lodash');
let Storage = Vue.prototype.getPlugin('Storage');
let env = window['LUFFY_ENGINE_ENV'] || {};
let cacheKey = env['LUFFY_ENGINE_STORE_CACHE_KEY'] || STORE_CACHE_KEY_PREFIX;

const ModuleManager = {
  state: {
    doNotCache: true,
    moduleStates: {}
  },

  actions: {},

  getters: {},

  mutations: {
    [PMSubjects.MODULE_INIT_VIA_REGISTER_DYNAMIC] (state, payload) {
      let store = payload.store;
      let moduleName = payload.name;
      let module = payload.module;
      let cacheName = `${cacheKey}_${moduleName}`;

      let moduleState = Storage.getItem(cacheName);
      if (!moduleState) {
        moduleState = store.state[moduleName];
      }

      if (!lodash.isEmpty(moduleState)) {
        let eventKey = `${PMSubjects.DATA_MODULE_REGISTERED_PREFIX}_${moduleName}`;
        store.commit(eventKey, moduleState);
      }

      if (lodash.isFunction(module.afterLoadFromCache)) {
        module.afterLoadFromCache(store, moduleState);
      }
    },
    [PMSubjects.LOAD_CACHE_MODULE_STATES] (state, moduleStates) {
      Assert.isObject(moduleStates, `module states error,got ${moduleStates}`);
      state.moduleStates = moduleStates;
    }
  }
};

export default ModuleManager;
