class TimersManager {
  constructor() {
    this.timers = [];
    this.registeredTimers = {};
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
          this.registeredTimers[timer.name] = setInterval(
            timer.job,
            timer.delay,
            ...timer.jobArgs
          );
        } else {
          this.registeredTimers[timer.name] = setTimeout(
            timer.job,
            timer.delay,
            ...timer.jobArgs
          );
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
  delay: 2000,
  interval: false,
  job: () => console.log('t1')
};

const t2 = {
  name: 't2',
  delay: 3000,
  interval: false,
  job: (a, b) => {
    console.log(a + b);
  }
};

const t3 = {
  name: 't3',
  delay: 4000,
  interval: true,
  job: x => console.log(x * x)
};

const t4 = {
  name: 't6',
  delay: 5000,
  interval: true,
  job: x => console.log(x * x)
};

manager
  .add(t1)
  .add(t2, 4, 10)
  .add(t3, 5)
  .add(t4, 10);

manager.start();

// manager.remove('t3');

// manager.stop();
// console.log(1);
// manager.pause('t1');

// manager.remove('t2');

manager.pause('t3');
// setTimeout(() => manager.resume('t3'), 6000);
setTimeout(() => manager.resume('t3'), 10000);
