/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/10
 * Time: 下午3:47
 */
let PMLogger = {
  version: '1.0.0',
  install: function (Vue, options) {
    if (PMLogger.installed) {
      return;
    }

    let logger = {
      isDebug: true,
      prefix: '',
      levels: ['log', 'warn', 'debug', 'trace', 'info']
    };

    if (options) {
      for (const key of Object.keys(options)) {
        if (key === 'levels') {
          logger[key] = logger[key].concat(options[key]);
        } else {
          logger[key] = options[key];
        }
      }
    }

    for (const level of logger.levels) {
      logger[level] = function () {
        if (!this.isDebug || typeof console === 'undefined') {
          return;
        }
        let args = Array.from(arguments);
        args.unshift(`[${this.prefix} :: ${level}]`.toUpperCase());
        console[level].apply(console, args);
      };
    }
    Vue.prototype.$log = logger;
  }
};
export default PMLogger;
