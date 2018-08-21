import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_ACTIVE_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  RECORD_SESSION_LOGS_MUTATION
} from "./mutation-types";

const mutations = {
  [ADD_SESSION](state, payload) {
    payload.map(session => state.sessions.push(session))
  },
  [ERROR_GET_SESSION](state, payload) {
    state.isSessionsGetErrorOccured = payload;
  },
  [ADD_NEW_LOG_TO_SESSION](state, payload) {
    state.sessionLogs.push(payload.logData);
  },
  [SET_ACTIVE_SESSION](state, payload) {
    state.activeSessionId = payload ? payload.sessionId : null;
  },
  [RECORD_SESSION_LOGS_MUTATION](state, payload) {
    console.log(RECORD_SESSION_LOGS_MUTATION, payload);
    function concatOldLogs() {
      return state.sessionLogs.concat(payload.logs);
    }
    function concatNewLogs() {
      return payload.logs.concat(state.sessionLogs);
    }

    state.sessionLogs = payload.isOld ? concatOldLogs() : concatNewLogs();
  }
};

export {mutations};