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

function formattedTimestampUtil(timestampData) {
  let date = new Date(timestampData);
  let hours = date.getHours();
  let minutes = "0" + date.getMinutes();
  let seconds = "0" + date.getSeconds();
  let miliseconds = "0" + date.getMilliseconds();
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ':' + miliseconds.substr(-3);
}

export {throttle, debounce, formattedTimestampUtil};