import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_ACTIVE_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  STORE_RUNTIME_LOGS_MUTATION,
  RESET_RUNTIME_LOGS_MUTATION
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
  [STORE_RUNTIME_LOGS_MUTATION](state, payload) {
    let storedLogs = state.runtimeStoredLogs;
    state.runtimeStoredLogs = payload.concat(storedLogs);
  },
  [RESET_RUNTIME_LOGS_MUTATION](state) {
    state.runtimeStoredLogs = [];
  }
};

export {mutations};