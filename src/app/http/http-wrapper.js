import axios from "axios/index";

const BASE_URL = 'http://10.61.20.89:8080/push_log';

const BASE_JSDB_URL = "http://localhost:3000/";
/**
 * TODO change dasic url later
 * @type {string}
 */
const EXPRESS_SERVER_URL = "http://10.61.40.181:4000/";
const DIVIDER = "/";
const SESSIONS = "sessions";
const ACTIVE_SESSIONS = "activeSessions";
const LOGS = "logs";

class HttpWrapperClass {
  getActiveSessions(callback, errHandler) {
    axios
      .get(EXPRESS_SERVER_URL + ACTIVE_SESSIONS)
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        errHandler(err);
      })
  }
  getPackOfOldLogs(logsData, callback) {
    axios
      .get(EXPRESS_SERVER_URL + 'sessionLogs', {
        params: logsData
      })
      .then(res => {
        callback(res.data[0])
      })
      .catch(err => {
        console.log(err);
      })
  }
  postNewLog(callback) {
    let logData = {
      content: "Log for device Xiaomi Mi2, QA session",
      session_related: 1
    };
    axios
      .post(EXPRESS_SERVER_URL + LOGS, logData)
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        console.log(err, ' : Error');
      })
  }
}

const httpWrapper = new HttpWrapperClass();
export {httpWrapper}
