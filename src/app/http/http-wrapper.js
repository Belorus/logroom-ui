import axios from "axios/index";

const BASE_JSDB_URL = "http://localhost:3000/";
/**
 * TODO change dasic url later
 * @type {string}
 */
const EXPRESS_SERVER_URL = "http://10.61.20.48:4000/";
const DIVIDER = "/";
const ACTIVE_SESSIONS = "activeSessions";
const LOGS = "logs";
const SESSION_LOGS_FILE_LINK = "sessionLogsFileLink";

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
        callback(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  }

  getLogsFile(sessionId) {
    let sessionData = {
      sessionId: sessionId
    };

    axios
      .get(EXPRESS_SERVER_URL + SESSION_LOGS_FILE_LINK, {
        params: sessionData
      })
      .then((response) => {
        this.getLogFileByLink(response.data, sessionId);
      })
      .catch(err => {
        console.log('Could not get logs file link from server: ', err);
      });
  }

  getLogFileByLink(logFileLink, sessionId) {
    axios
      .get(logFileLink, {
        responseType: 'Blob'
      })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `log-file-${sessionId}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
