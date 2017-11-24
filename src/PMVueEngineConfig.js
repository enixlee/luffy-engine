/**
 * Auth: enixlee
 * Date: 2017/3/29
 * Description: PMVueEngineConfig
 */
import {default as VueImports} from './PMVueEngineVueImports';
import LangEngine from './Lang/PMLanguage';
import {default as Juggler} from './Schedule/ScheduleWorker';
import {default as HttpRequest} from './Utils/HttpRequest';
import * as TypeCheck from './Utils/TypeCheck';
import VueI18n from 'vue-i18n';
import StorageUtils from './Storage/StorageUtils';
import {default as Storage} from './Storage/PMStorageLocal';
import {default as KVStore} from './Storage/PMStorageCookie';
import * as EngineConfig from './Config/PMEngineConfig';
import {default as Logger} from './Utils/PMLog';
import {default as PMDevice} from './Utils/PMDevice';
import {default as ScheduleWorker} from './Schedule/ScheduleWorker';

let Vue = VueImports.getVue();
let Router = VueImports.getVueRouter();
let Assert = VueImports.getAssert();
let Debug = VueImports.getDebug();
let Utils = VueImports.getUtils();

class PMVueEngineConfig {
  constructor () {
    window.PMApp = window.PMApp || {};
    window.PMVueComponents = window.PMVueComponents || {};

    window.PMApp['HttpRequest'] = window.PMApp['HttpRequest'] || HttpRequest;
    window.PMApp['TypeCheck'] = window.PMApp['TypeCheck'] || TypeCheck;
    window.PMApp['VueI18n'] = window.PMApp['VueI18n'] || VueI18n;
    window.PMApp['Storage'] = window.PMApp['Storage'] || Storage;
    window.PMApp['KVStore'] = window.PMApp['KVStore'] || KVStore;
    window.PMApp['EngineConfig'] = window.PMApp['EngineConfig'] || EngineConfig;
    window.PMApp['StorageUtils'] = window.PMApp['StorageUtils'] || StorageUtils;
    window.PMApp['PMDevice'] = window.PMApp['PMDevice'] || PMDevice;
    window.PMApp['ScheduleWorker'] = window.PMApp['ScheduleWorker'] || new ScheduleWorker();

    this.init();
  }

  description () {
    if (!Debug.isProduction()) {
      console.info('PMVueEngine started!');
    }
  }

  init () {
    Vue.use(Router);
    Vue.use(Logger, {
      prefix: Utils.today(),
      isDebug: !Debug.isProduction()
    });

    let juggler = new Juggler();
    Vue.prototype.registerPlugin('Juggler', juggler);
    juggler.registerWorker(HttpRequest.HTTP_REQUEST_QUEUE_DEALER_FRAME, HttpRequest.requestQueueDealer);

    /**
     * 多语言配置
     * @param locale 'cn','en', ...
     * @param languages
     * @param fallbackLocale
     */
    Vue.prototype.enableMultiLanguage = (locale, languages, fallbackLocale) => {
      Assert.isStringNotEmpty(locale, `language locale error,got ${locale}`);
      Assert.isObject(languages, `languages error,got ${languages}`);
      fallbackLocale = fallbackLocale || null;
      let i18n = LangEngine.use(locale, languages, fallbackLocale);

      Vue.prototype.registerPlugin('LangEngine', i18n);
    };
  }
}

export default new PMVueEngineConfig();
