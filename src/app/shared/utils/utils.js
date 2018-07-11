function throttle(fn, interval) {
  let lastTime;
  return function throttled() {
    let timeSinceLastExecution = Date.now() - lastTime;
    if(!lastTime || (timeSinceLastExecution >= interval)) {
      fn.apply(this, arguments);
      lastTime = Date.now();
    }
  };
}

export {throttle};