/**
 * Auth: lijiang
 * Date: 2017/11/15
 * Description: Log
 */
import * as LogUtil from './Logic/Log';

let logMap = {};

const Log = {
  install (Vue) {
    let lodash = Vue.prototype.getPlugin('lodash');
    lodash.map(LogUtil, function (v, k) {
      logMap[k] = v;
      Vue.prototype[k] = v;
    });
    Vue.prototype.$logger = logMap;
  },
  $logger: logMap
};

export default Log;
export const install = Log.install;