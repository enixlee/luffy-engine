/**
 * Auth: lijiang
 * Date: 2017/11/15
 * Description: Log
 */
import {PLATFORM_ENV_PRODUCT} from '../../Config/PMEngineConfig';

export const dumpLine = () => {
  if (window['LUFFY_ENGINE_ENV']['PLATFORM_ENV'] === PLATFORM_ENV_PRODUCT) {
    return;
  }
  let args = Array.prototype.slice.call(arguments);
  args.unshift(`[Paymini] `);
  console.log.apply(console, args);
};

export const dumpStack = (message) => {
  if (window['LUFFY_ENGINE_ENV']['PLATFORM_ENV'] === PLATFORM_ENV_PRODUCT) {
    return;
  }
  console.trace(`[Paymini] ${message}`);
};