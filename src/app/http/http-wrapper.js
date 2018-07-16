import axios from "axios/index";

const BASE_URL = 'http://10.61.20.89:8080/push_log';

const BASE_JSDB_URL = "http://localhost:3000/";
const DIVIDER = "/";
const SESSIONS = "sessions";
const LOGS = "logs";

class HttpWrapperClass {
  getDockerConnected() {
    let dataObj = {
      session_id: "4b7b047a-2f30-46e1-8e21-989a32cb5038",
      seq_number: 19,
      log: {
        categories: [],
        level: "INFO ",
        message: ">>> LogManager initialized successfully. UTC time: Right Now!",
        tag: "XLog.LogManager",
        thread: 4,
        timestamp: Date.now()
      }
    };
    axios
      .post(BASE_URL, dataObj)
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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

  getLogsBySessionHttp(sessionId, callback, errHandler) {
    let sessionData = {
      session_related: sessionId
    };
    axios
      .get(BASE_JSDB_URL + LOGS, {params: sessionData})
      .then(res => {
        callback(res.data);
      })
      .catch(err => {
        errHandler(err)
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
