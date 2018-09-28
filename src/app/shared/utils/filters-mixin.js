const filtersMixin = {
  filters: {
    timistampFilter: function (timestampData) {
      let date = new Date(timestampData);
      let hours = date.getHours();
      let minutes = "0" + date.getMinutes();
      let seconds = "0" + date.getSeconds();
      let miliseconds = "0" + date.getMilliseconds();
      return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ':' + miliseconds.substr(-3);
    }
  }
};

export {filtersMixin};