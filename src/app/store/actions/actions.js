import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  SET_ACTIVE_SESSION,
  STORE_RUNTIME_LOGS_MUTATION,
  RESET_RUNTIME_LOGS_MUTATION,
  RECORD_SESSION_LOGS_MUTATION
} from "../mutations/mutation-types";

const actions = {
  getActiveSessionsAction({commit}, sessions) {
    commit(ERROR_GET_SESSION, false);
    commit(ADD_SESSION, sessions);
  },
  setActiveSessionId({commit}, payload) {
    commit(SET_ACTIVE_SESSION, payload);
  },
  storeRuntimeLogs({commit}, payload) {
    commit(STORE_RUNTIME_LOGS_MUTATION, payload);
  },
  resetRuntimeLogs({commit}) {
    commit(RESET_RUNTIME_LOGS_MUTATION);
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