import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_SESSION_LOGS,
  SET_BUFFER_LOGS,
  SET_ACTIVE_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  ADD_PARTIAL_LOG_PL
} from "./mutation-types";

const mutations = {
  [ADD_SESSION](state, payload) {
    payload.map(session => state.sessions.push(session))
  },
  [ERROR_GET_SESSION](state, payload) {
    state.isSessionsGetErrorOccured = payload;
  },
  [SET_SESSION_LOGS](state, payload) {
    state.sessionLogs = payload;
  },
  [SET_BUFFER_LOGS](state, payload) {
    state.bufferedLogs = payload;
  },
  [ADD_NEW_LOG_TO_SESSION](state, payload) {
    state.sessionLogs.push(payload.logData);
  },
  [ADD_PARTIAL_LOG_PL](state, payload) {
    payload.map(log => state.sessionLogs.push(log));
  },
  [SET_ACTIVE_SESSION](state, payload) {
    state.activeSessionId = payload.sessionId;
  }
};

export {mutations};