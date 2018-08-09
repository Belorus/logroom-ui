import axios from "axios/index";

const BASE_URL = 'http://10.61.20.89:8080/push_log';

const BASE_JSDB_URL = "http://localhost:3000/";
const DIVIDER = "/";
const SESSIONS = "sessions";
const LOGS = "logs";

class HttpWrapperClass {
  getAllSessions(callback, errHandler) {
    axios
      .get(BASE_JSDB_URL + SESSIONS)
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        errHandler(err);
      })
  }

  getAllActiveSessions(callback) {
    let activeSessionsParam = {
      archived: 0
    };
    axios
      .get(BASE_JSDB_URL + SESSIONS, {params: activeSessionsParam})
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        console.warn('Error: ', err);
      })
  }

  postNewLog(callback) {
    let logData = {
      content: "Log for device Xiaomi Mi2, QA session",
      session_related: 1
    };
    axios
      .post(BASE_JSDB_URL + LOGS, logData)
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
