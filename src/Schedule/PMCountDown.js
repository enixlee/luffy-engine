/**
 * Auth: enixlee
 * Date: 2017/7/3
 * Description: PMCountDown
 */
class PMCountdown {
  constructor (delay, intervalCallback, handler, options) {
    if (!delay) throw new Error('No delay provided');

    if (typeof handler === 'object' && typeof options === 'undefined') {
      options = handler;
      handler = function () {
      };
    }

    this.handler = handler || function () {
    };

    this.options = options || {};

    if (typeof this.options.restart === 'undefined') this.options.restart = false;
    if (typeof this.options.frame === 'undefined') this.options.frame = 1000;

    this.delay = delay;
    this.countdown = delay;
    this.intervalCallback = intervalCallback;

    this.timeout = {};
    this.interval = {};
  }

  getRemainingTime () {
    return this.countdown;
  }

  getPastTime () {
    return this.delay - this.countdown;
  }

  reduceDelay () {
    this.countdown -= this.options.frame;

    if (this.countdown <= 0) this.options.restart ? this.restart() : this.stop();

    if (this.countdown > 0 && (typeof this.intervalCallback === 'function')) {
      this.intervalCallback(this.countdown, this.getPastTime());
    }
  }

  start () {
    this.timeout = setTimeout(this.handler.bind(this), this.countdown);
    this.interval = setInterval(this.reduceDelay.bind(this), this.options.frame);
  }

  stop () {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  }

  reset () {
    this.stop();
    this.countdown = this.delay;
  }

  restart () {
    this.reset();
    this.start();
  }
};

export default PMCountdown;