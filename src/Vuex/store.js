/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/3
 * Time: 下午5:51
 */
import createLogger from 'vuex/dist/logger';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import {modules} from './Modules/ModuleImports';
import PersistedState from './Plugins/Persistence';
import {STORE_CACHE_KEY_PREFIX} from '../Constants/PMConstants';

let Vue = window.getVue();
let lodash = Vue.prototype.getPlugin('lodash');
let Vuex = Vue.prototype.getPlugin('Vuex');
let Debug = Vue.prototype.getPlugin('Debug');
let Storage = Vue.prototype.getPlugin('Storage');
let env = window['LUFFY_ENGINE_ENV'] || {};

Vue.use(Vuex);

let STORE_CACHE_ENABLE = (lodash.isBoolean(env['LUFFY_ENGINE_STORE_CACHE_ENABLE'])) ? env['LUFFY_ENGINE_STORE_CACHE_ENABLE'] : true;

let plugins = !Debug.isProduction() ? [createLogger()] : [];

if (STORE_CACHE_ENABLE) {
  plugins.push(PersistedState({
    key: env['LUFFY_ENGINE_STORE_CACHE_KEY'] || STORE_CACHE_KEY_PREFIX,
    storage: Storage
  }));
}

const store = new Vuex.Store({
  actions: actions,
  getters: getters,
  mutations: mutations,
  modules: modules,
  plugins: plugins,
  strict: !Debug.isProduction()
});

export default store;
