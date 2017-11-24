/**
 * Created by WebStorm.
 * Author: enixlee
 * Date: 2017/3/14
 * Time: 下午2:26
 */

import ModuleManager from './ModuleManager';

let Vue = window.PMApp.Vue;
let Assert = Vue.prototype.getPlugin('Assert');

export const modules = {
  ModuleManager
};

export const MODULE_PART_ACTION = 'actions';
export const MODULE_PART_GETTERS = 'getters';
export const MODULE_PART_MUTATIONS = 'mutations';

export function defineModuleParts (partName) {
  if (partName === MODULE_PART_ACTION) {
    return ModuleManager.actions;
  }

  if (partName === MODULE_PART_GETTERS) {
    return ModuleManager.getters;
  }

  if (partName === MODULE_PART_MUTATIONS) {
    return ModuleManager.mutations;
  }

  Assert.isTrue(false, `module parts [${partName}] undefined`);
}
