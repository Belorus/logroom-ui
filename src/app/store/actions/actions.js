import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  SET_ACTIVE_SESSION,
  RECORD_SESSION_LOGS_MUTATION,
  CLEAR_SESSION_LOGS,
  CLEAR_ACTIVE_SESSIONS,
  ADD_NEW_ACTIVE_SESSION,
  UPDATE_SESSION_DATA
} from "../mutations/mutation-types";

const actions = {
  getActiveSessionsAction({commit}, sessions) {
    commit(ERROR_GET_SESSION, false);
    commit(ADD_SESSION, sessions);
  },
  addNewActiveSession({commit}, sessionObj) {
    commit(ADD_NEW_ACTIVE_SESSION, sessionObj);
  },
  updateSessionData({commit}, sessionObj) {
    commit(UPDATE_SESSION_DATA, sessionObj);
  },
  setActiveSessionId({commit}, payload) {
    commit(SET_ACTIVE_SESSION, payload);
  },
  clearSessionLogs({commit}) {
    commit(CLEAR_SESSION_LOGS);
  },
  clearActiveSessions({commit}) {
    commit(CLEAR_ACTIVE_SESSIONS);
  },
  setNewLogAction({commit}, payload) {
    if (this.state.activeSessionId === payload.logData.session_related) {
      commit(ADD_NEW_LOG_TO_SESSION, payload);
    }
  },
  recordSessionLogsAction({commit}, payload) {
    commit(RECORD_SESSION_LOGS_MUTATION, payload);
  }
};

export {actions};