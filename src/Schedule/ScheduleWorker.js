/**
 * Auth: enixlee
 * Date: 2017/7/3
 * Description: ScheduleWorker
 */
import {default as PMCountdown} from './PMCountDown';

const SCHEDULE_FOREVER_INTERVAL = 100000000000; // 当前最大值
const SCHEDULE_FRAME = 100;
let lodash = window.getVue().prototype.getPlugin('lodash');
let Assert = window.getVue().prototype.getPlugin('Assert');

let defaultFrameKey = 1;

class ScheduleWorker {
  constructor () {
    this.__worker = {};
    this.__timer = null;
    this.createTimer();
  }

  runFrame (leftTime, pastTime) {
    lodash.map(this.__worker, function (worker, k) {
      let frame = worker.frame;
      if (pastTime % frame === 0) {
        worker.do();
      }
    });
  }

  unRegisterWorker (frameKey) {
    if (this.__worker[frameKey]) {
      delete this.__worker[frameKey];
      if (!lodash.isObject(this.__worker)) {
        this.__worker = {};
      }
    }
  }

  // 不提供remove方法
  registerWorker (frameTime, dealer, frameKey = null) {
    Assert.isNumber(frameTime, `schedule worker register frame time is not number, got ${frameTime}`);
    Assert.isFunction(dealer, `schedule worker register dealer is not function, got ${dealer}`);

    frameKey = frameKey || `default_scheduleKey_${defaultFrameKey++}`;
    this.__worker[frameKey] = {frameKey: frameKey, frame: frameTime, do: dealer};
  }

  createTimer () {
    let that = this;
    if (this.__timer === null) {
      this.__timer = new PMCountdown(SCHEDULE_FOREVER_INTERVAL, function (leftTime, pastTime) {
        that.runFrame(leftTime, pastTime);
      }, function () {
        that.kill();
      }, {
        frame: SCHEDULE_FRAME
      });
      this.__timer.start();
    }
  }

  reStart () {
    this.createTimer();
  }

  kill () {
    if (this.__timer) {
      this.__timer.stop();
    }
    this.__timer = null;
    // 不清除队列 ,不允许外部调用
  }
}

export default ScheduleWorker;