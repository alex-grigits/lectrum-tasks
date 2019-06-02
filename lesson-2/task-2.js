class Log {
  constructor(timer) {
    this.name = timer.name;
    this.in = timer.jobArgs;
    this.out = timer.job(...timer.jobArgs);
    this.created = new Date();
  }
}

class TimersManager {
  constructor() {
    this.timers = [];
    this.registeredTimers = {};
    this.logs = [];
  }

  _log(timer) {
    this.logs.push(new Log(timer));
  }

  print() {
    console.log(this.logs);
  }

  add(timer, ...rest) {
    if (this.timers.find(item => item.name === timer.name)) {
      throw new Error(
        `Name must be unique! Timer with name: "${timer.name}" already exist.`
      );
    }
    if (timer.name === '' || typeof timer.name !== 'string') {
      throw new Error(`Invalid timer name: "${timer.name}"`);
    }
    if (timer.delay === undefined || typeof timer.delay !== 'number') {
      throw new Error(
        `Invalid timer delay type for timer name: "${timer.name}"`
      );
    } else if (timer.delay < 0 || timer.delay > 5000) {
      throw new Error(
        `Invalid timer delay value for timer name: "${timer.name}"`
      );
    }
    if (timer.interval === undefined || typeof timer.interval !== 'boolean') {
      throw new Error(
        `Invalid timer interval value for timer name: "${timer.name}"`
      );
    }
    if (timer.job === undefined || typeof timer.job !== 'function') {
      throw new Error(
        `Invalid timer job value for timer name: "${timer.name}"`
      );
    }
    timer.jobArgs = rest;
    this.timers.push(timer);

    return this;
  }

  remove(timerName) {
    this.pause(timerName);
    this.timers = this.timers.filter(timer => timerName !== timer.name);
    delete this.registeredTimers[timerName];
  }

  start() {
    if (this.timers.length > 0) {
      this.timers.forEach(timer => {
        // First implementation
        // setTimeout(() => timer.job(...timer.args), timer.delay);
        if (timer.interval) {
          this.registeredTimers[timer.name] = setInterval(() => {
            this._log(timer);
            timer.job(...timer.jobArgs);
          }, timer.delay);
        } else {
          this.registeredTimers[timer.name] = setTimeout(() => {
            this._log(timer);
            timer.job(...timer.jobArgs);
          }, timer.delay);
        }
      });
    } else {
      throw new Error('Please, add the timers first!');
    }
  }

  stop() {
    for (const timer in this.registeredTimers) {
      this.remove(timer);
    }
  }

  pause(timerName) {
    const pausedTimer = this.timers.find(timer => timer.name === timerName);
    if (pausedTimer.interval) {
      clearInterval(this.registeredTimers[timerName]);
    } else {
      clearTimeout(this.registeredTimers[timerName]);
    }
  }

  resume(timerName) {
    const resumedTimer = this.timers.find(timer => timer.name === timerName);
    if (resumedTimer.interval) {
      setInterval(
        resumedTimer.job,
        resumedTimer.delay,
        ...resumedTimer.jobArgs
      );
    } else {
      setTimeout(resumedTimer.job, resumedTimer.delay, ...resumedTimer.jobArgs);
    }
  }
}

const manager = new TimersManager();

const t1 = {
  name: 't1',
  delay: 1000,
  interval: false,
  job: (a, b) => a + b
};

const t2 = {
  name: 't2',
  delay: 2000,
  interval: false,
  job: name => `Hello ${name}`
};

manager.add(t1, 2, 3).add(t2, 'John');

manager.start();

setTimeout(() => manager.print(), 3000);
