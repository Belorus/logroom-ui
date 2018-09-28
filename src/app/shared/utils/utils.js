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

function debounce(fn, interval) {
  let timer;
  return function debounced() {
    clearTimeout(timer);
    let args = arguments;
    let that = this;
    timer = setTimeout(function callOriginalFn() {
      fn.apply(that, args);
    }, interval);
  };
}

export {throttle, debounce};