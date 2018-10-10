import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_ACTIVE_SESSION,
  ADD_NEW_LOG_TO_SESSION,
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
  SET_MARKING_PROGRESS,
  SET_MARKER_START,
  SET_MARKER_END,
  ADD_NEW_MARKER,
  REMOVE_SESSION_MARKER
} from "./mutation-types";

const mutations = {
  [ADD_SESSION](state, payload) {
    state.sessions = payload;
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
  },
  [SET_LOGS_FILTERS](state, payload) {
    if(Array.isArray(payload)) {
      state.logsDisplayFilters = payload;
    }
  },
  [SET_FILTERED_LOGS](state) {
    if(state.logsDisplayFilters.length > 0) {
      state.filteredLogs = state.sessionLogs.filter(log => state.logsDisplayFilters.includes(log.level));
    } else {
      state.filteredLogs = [];
    }
  },
  [RESET_FILTERED_LOGS](state) {
    state.filteredLogs = [];
  },
  [GET_LOGS_BY_TEXT_SEARCH](state, payload) {
    let isFilteredLogsPresent = state.filteredLogs.length === 0;

    let isTypingBackWithFiltersOff = state.searchString
      && payload.length < state.searchString.length
      && state.logsDisplayFilters.length === 0;

    let isTypingBackWithFiltersOn = state.searchString
      && payload.length < state.searchString.length
      && state.logsDisplayFilters.length > 0;

    if(isFilteredLogsPresent || isTypingBackWithFiltersOff) {
      state.filteredLogs = filterLogs(state.sessionLogs,payload);
    } else if(isTypingBackWithFiltersOn) {
      state.filteredLogs = filterLogs(state.sessionLogs, payload, true);
    } else {
      state.filteredLogs = filterLogs(state.filteredLogs, payload);
    }

    function filterLogs(logs, queryString, backwardTyping) {
      let isRegularExpression = queryString.startsWith('$');
      let lowerCaseQueryString = queryString.toLowerCase();
      let regExp = null;

      try {
        regExp = new RegExp(queryString.substring(1), 'i');
      }
      catch (e) {
        isRegularExpression = false;
      }
      
      return logs.filter(log => {
        if (backwardTyping && !state.logsDisplayFilters.includes(log.level)) {
          return false;
        }

        if (isRegularExpression) {
          return log.message.match(regExp) || log.tag.match(regExp); 
        }

        return log.message.toLowerCase().includes(lowerCaseQueryString)
          || log.tag.toLowerCase().includes(lowerCaseQueryString);
      });
    }
  },
  [SET_SEARCH_FILTER_STATE](state, payload) {
    state.isSearchFilterActive = payload;
  },
  [SET_SEARCH_STRING](state, payload) {
    state.searchString = payload;
  },
  [SET_MARKING_PROGRESS](state) {
    state.isMarkingInProgress = !state.isMarkingInProgress;
  },
  [SET_MARKER_START](state, payload) {
    state.markerStartPosition = payload ? payload : null;
  },
  [SET_MARKER_END](state, payload) {
    state.markerEndPosition = payload ? payload : null;
  },
  [ADD_NEW_MARKER](state, payload) {
    state.sessions.find(session => {
      if(session.id === payload.sessionId) {
        session.markers.push(payload.markerData);
      }
    });
  },
  [REMOVE_SESSION_MARKER](state, payload) {
    let sessionToDeleteMarker = state.sessions.find(session => session.id === payload.sessionId);
    sessionToDeleteMarker.markers = sessionToDeleteMarker.markers.filter(marker => marker.id !== payload.markerId);
    console.log();
  }
};

export {mutations};