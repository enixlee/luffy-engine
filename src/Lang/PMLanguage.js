/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/17
 * Time: 下午3:44
 */
const LangEngine = {
  use: function (locale, languages, fallbackLocale) {
    let Vue = window.getVue();
    let VueI18n = Vue.prototype.getPlugin('VueI18n');
    Vue.use(VueI18n);
    let langConfig = {
      locale: locale,
      messages: languages
    };
    if (Vue.prototype.getPlugin('lodash').isString(fallbackLocale)) {
      langConfig['fallbackLocale'] = fallbackLocale;
    }
    return new VueI18n(langConfig);
  }
};

export default LangEngine;
