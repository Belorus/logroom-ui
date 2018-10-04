import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  ADD_NEW_LOG_TO_SESSION,
  SET_ACTIVE_SESSION,
  RECORD_SESSION_LOGS_MUTATION,
  CLEAR_SESSION_LOGS,
  CLEAR_ACTIVE_SESSIONS,
  ADD_NEW_ACTIVE_SESSION,
  UPDATE_SESSION_DATA,
  SET_LOGS_FILTERS,
  SET_FILTERED_LOGS,
  RESET_FILTERED_LOGS,
  GET_LOGS_BY_TEXT_SEARCH,
  SET_SEARCH_FILTER_STATE,
  SET_SEARCH_STRING,
  SET_MARKER_END,
  SET_MARKER_START,
  SET_MARKING_PROGRESS,
  ADD_NEW_MARKER,
  REMOVE_SESSION_MARKER
} from "../mutations/mutation-types";

const actions = {
  getActiveSessionsAction({commit}, sessions) {
    commit(ERROR_GET_SESSION, false);
    commit(ADD_SESSION, sessions);
  },
  addNewActiveSession({commit}, sessionObj) {
    commit(ADD_NEW_ACTIVE_SESSION, sessionObj);
  },
  setLogsFilters({commit}, payload) {
    commit(SET_LOGS_FILTERS, payload);

    if(payload.length > 0) {
      commit(SET_FILTERED_LOGS);
    } else {
      commit(RESET_FILTERED_LOGS)
    }
  },
  setFilteredLogsAction({commit}) {
    commit(SET_FILTERED_LOGS);
  },
  resetFilteredLogsAction({commit}) {
    commit(RESET_FILTERED_LOGS)
  },
  getLogsBySearchAction({commit}, payload) {
    commit(SET_SEARCH_FILTER_STATE, payload.isSearchActive);
    if(payload.searchString) {
      commit(GET_LOGS_BY_TEXT_SEARCH, payload.searchString);
    }
    if(!payload.isSearchActive) {
      commit(SET_FILTERED_LOGS);
    }
    commit(SET_SEARCH_STRING, payload.searchString);
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
  },
  changeMarkerProgressState({commit}) {
    commit(SET_MARKING_PROGRESS);
  },
  setMarkerStartPosition({commit}, payload) {
    commit(SET_MARKER_START, payload);
  },
  setMarkerEndPosition({commit}, payload) {
    commit(SET_MARKER_END, payload);
  },
  addNewMarkerAction({commit}, payload) {
    commit(ADD_NEW_MARKER, payload);
  },
  loadSelectedMarker({commit}, payload) {
    commit(SET_MARKER_START, payload.startPosition);
    commit(SET_MARKER_END, payload.endPosition);
  },
  resetSelectedMarker({commit}) {
    commit(SET_MARKER_START, null);
    commit(SET_MARKER_END, null);
  },
  removeSessionMarker({commit}, payload) {
    commit(REMOVE_SESSION_MARKER, payload)
  }
};

export {actions};