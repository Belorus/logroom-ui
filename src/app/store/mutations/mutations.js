import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_ACTIVE_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  RECORD_SESSION_LOGS_MUTATION,
  CLEAR_SESSION_LOGS,
  CLEAR_ACTIVE_SESSIONS,
  ADD_NEW_ACTIVE_SESSION,
  UPDATE_SESSION_DATA
} from "./mutation-types";

const mutations = {
  [ADD_SESSION](state, payload) {
    payload.map(session => state.sessions.push(session));
  },
  [ADD_NEW_ACTIVE_SESSION](state, payload) {
    state.sessions.push(payload);
  },
  [UPDATE_SESSION_DATA](state, payload){
    state.sessions = state.sessions
      .filter(session => session.id !== payload.id);
    state.sessions.push(payload);
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
  [CLEAR_SESSION_LOGS](state) {
    state.sessionLogs = [];
  },
  [CLEAR_ACTIVE_SESSIONS](state) {
    console.log('SESSSIONS CLEARED!!!');
    state.sessions = [];
  },
  [RECORD_SESSION_LOGS_MUTATION](state, payload) {
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