/**
 * Auth: enixlee
 * Date: 2017/3/29
 * Description: PMVueEngineVueImports
 */
import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
import _ from 'lodash';
import * as Assert from './Utils/PMAssert';
import * as Crypto from './Utils/PMCrypto';
import {default as Debug} from './Utils/PMDebug';
import {default as Utils} from './Utils/PMUtils';
import * as RouteTypes from './Route/RouteTypes';

let lodash = _;

class PMVueEngineVueImports {
  constructor () {
    window.PMApp = window.PMApp || {};
    window.PMVueComponents = window.PMVueComponents || {};
    lodash.isObject(window.PMVueRoutes) ? null : this.initPMVueRoutes();
    window.PMApp['Vue'] = window.PMApp['Vue'] || Vue;
    window.PMApp['Vuex'] = window.PMApp['Vuex'] || Vuex;
    window.PMApp['Router'] = window.PMApp['Router'] || Router;
    window.PMApp['lodash'] = window.PMApp['lodash'] || lodash;
    window.PMApp['Assert'] = window.PMApp['Assert'] || Assert;
    window.PMApp['Crypto'] = window.PMApp['Crypto'] || Crypto;
    window.PMApp['Debug'] = window.PMApp['Debug'] || Debug;
    window.PMApp['Utils'] = window.PMApp['Utils'] || Utils;

    this.vueExtends();

    this.windowExtends();
  }

  initPMVueRoutes () {
    window.PMVueRoutes = {};
    window.PMVueRoutes[`type_${RouteTypes.ROUTE_TYPE_NORMAL}`] = [];
    window.PMVueRoutes[`type_${RouteTypes.ROUTE_TYPE_DYNAMIC}`] = [];
    window.PMVueRoutes[`type_${RouteTypes.ROUTE_TYPE_ASYNC}`] = [];
  };

  windowExtends () {
    window.registerComponent = (routerName, componentName, component) => {
      Assert.isStringNotEmpty(routerName, `registerComponent routerName error, got ${routerName}`);
      Assert.isStringNotEmpty(componentName, `registerComponent componentName error, got ${componentName}`);
      window.PMVueComponents[routerName] = window.PMVueComponents[routerName] || {};
      window.PMVueComponents[routerName][componentName] = component;
    };

    window.getRegisterComponent = (routerName, componentName) => {
      Assert.isStringNotEmpty(routerName, `registerComponent routerName error, got ${routerName}`);
      Assert.isStringNotEmpty(componentName, `getRegisterComponent component name error, got ${componentName}`);
      let routerComponents = window.PMVueComponents[routerName] || {};
      return routerComponents[componentName];
    };

    window.getVue = () => {
      return window.PMApp.Vue;
    };

    /**
     * 默认存储加密
     * @type {boolean}
     */
    window.PMStorageEncrypto = true;
  }

  vueExtends () {
    Vue.prototype.hasPlugin = (pluginName) => {
      Assert.isStringNotEmpty(pluginName);
      let plugin = window.PMApp[pluginName];
      return plugin !== null && (typeof plugin) !== 'undefined';
    };

    Vue.prototype.getPlugin = (pluginName) => {
      Assert.isStringNotEmpty(pluginName);
      let plugin = window.PMApp[pluginName];
      Assert.isNotNil(plugin, `global plugin [${pluginName}] not exist!`);

      return plugin;
    };

    // no arrow function
    Vue.prototype.getStoreState = function (stateName) {
      Assert.isStringNotEmpty(stateName, `state ${stateName} not exist!`);
      let store = Vue.prototype.getPlugin('DataModule');
      Assert.isTrue(lodash.isObject(store), `state store error,got ${store}`);
      return store.state[stateName];
    };

    Vue.prototype.executeStoreGetter = function (getterName) {
      Assert.isStringNotEmpty(getterName, `getter name ${getterName} not exist!`);
      let store = Vue.prototype.getPlugin('DataModule');
      Assert.isTrue(lodash.isObject(store), `getter store error,got ${store}`);

      return store.getters[getterName];
    };

    Vue.prototype.registerPlugin = (name, plugin) => {
      Assert.isStringNotEmpty(name, `register plugin name must be string, but got ${name}`);
      let oldPlugin = window.PMApp[name];
      Assert.isNil(oldPlugin, `register plugin [${name}] has exist!`);
      window.PMApp[name] = plugin;
    };

    Vue.prototype.registerDataModule = (name, dataModule) => {
      Assert.isStringNotEmpty(name, `data module name is string which not empty, got ${name}`);
      Assert.isObject(dataModule, `data module type error,got ${dataModule}`);

      let store = Vue.prototype.getPlugin('DataModule');
      Assert.isObject(store, `data module manage has not been init!`);

      // register module
      store.registerModule(name, dataModule);
    };

    Vue.prototype.unRegisterDataModule = (name) => {
      Assert.isStringNotEmpty(name, `data module name is string which not empty, got ${name}`);

      let store = Vue.prototype.getPlugin('DataModule');
      Assert.isObject(store, `data module manage has not been init!`);

      // register module
      store.unregisterModule(name);
    };

    Vue.prototype.registerPMRoutes = (routeComponent, routeType = RouteTypes.ROUTE_TYPE_NORMAL) => {
      Assert.isObject(routeComponent, `register pm route component error, got ${routeComponent}`);
      routeType = `type_${routeType}`;
      Assert.isArray(window.PMVueRoutes[routeType], `pm route type error, got ${routeType}, it should be type in ${RouteTypes}`);
      window.PMVueRoutes[routeType].push(routeComponent);
    };

    Vue.prototype.getPMRoutesByType = (routeType) => {
      Assert.isNumber(routeType, `get pm routes by type error, got type ${routeType}`);
      routeType = `type_${routeType}`;
      Assert.isArray(window.PMVueRoutes[routeType], `get pm route by type error, got ${routeType}, it should be type in ${RouteTypes}`);
      return window.PMVueRoutes[routeType];
    };

    Vue.prototype.getModuleGetterByName = function (name) {
      Assert.isStringNotEmpty(name, `module getter name can not be empty!`);
      let store = Vue.prototype.getPlugin('DataModule');
      Assert.isObject(store, `data module manage has not been init!`);
      return store.getters[name];
    };
  }

  getVue () {
    return window.PMApp['Vue'] || Vue;
  }

  getVueRouter () {
    return window.PMApp['Router'] || Router;
  }

  getAssert () {
    return window.PMApp['Assert'] || Assert;
  }

  getDebug () {
    return window.PMApp['Debug'] || Debug;
  }

  getUtils () {
    return window.PMApp['Utils'] || Utils;
  }
}

export default new PMVueEngineVueImports();
