/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/15
 * Time: 下午5:13
 */
let Vue = window.PMApp.Vue;
let lodash = Vue.prototype.getPlugin('lodash');

const getModule = (store, moduleName) => {
  let module = store._modules.root._children[moduleName];
  return module._rawModule;
};

const getModuleKeys = (store) => {
  let modules = store._modules.root._children; // todo
  return lodash.keys(modules);
};

export default function PersistedState ({
                                          key = 'vuex',
                                          getState = (key, storage) => {
                                            const value = storage.getItem(key);
                                            return value && value !== 'undefined' ? value : undefined;
                                          },
                                          setState = (key, state, storage) => storage.setItem(key, state),
                                          storage = {
                                            getItem: (key) => {
                                            },
                                            setItem: (key, value) => {
                                            }
                                          },
                                          filter = () => true,
                                          subscriber = store => handler => store.subscribe(handler)
                                        } = {}) {
  return store => {
    let states = {};
    let moduleKeys = getModuleKeys(store);
    lodash.forEach(moduleKeys, function (n) {
      let stateKey = key + `_${n}`;
      let savedState = getState(stateKey, storage);
      if (typeof savedState === 'object' && !savedState.doNotCache) {
        states[n] = savedState;
      }
    });
    if (!lodash.isEmpty(states)) {
      store.replaceState(
        lodash.merge({}, store.state, states)
      );
    }

    lodash.forEach(moduleKeys, function (n) {
      let rawModule = getModule(store, n);
      if (lodash.isFunction(rawModule.afterLoadFromCache)) {
        let moduleState = states[n];
        rawModule.afterLoadFromCache(store, moduleState);
      }
    });

    subscriber(store)((mutation, states) => {
      let moduleKeys = lodash.keys(states);
      if (filter(mutation)) {
        lodash.forEach(moduleKeys, function (n) {
          let moduleState = store.state[n];
          if (!moduleState.doNotCache && moduleState.is_initiated) {
            // 需要缓存并且已经初始化完成
            setState(key + `_${n}`, moduleState, storage);
          }
        });
      }
    });
  };
};
