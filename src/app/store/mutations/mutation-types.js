const ADD_SESSION = 'addSession';
const ADD_NEW_ACTIVE_SESSION = 'addNewActiveSession';
const UPDATE_SESSION_DATA = 'updateSessionData';
const ERROR_GET_SESSION = 'errorGetSessions';
const ADD_NEW_LOG_TO_SESSION = 'addNewLogToSession';
const SET_ACTIVE_SESSION = 'setActiveSession';
const CLEAR_SESSION_LOGS = 'clearSessionLogs';
const CLEAR_ACTIVE_SESSIONS = 'clearActiveSessions';
const SET_LOGS_FILTERS = 'setLogsFilters';
const SET_FILTERED_LOGS = 'setFilteredLogs';
const RESET_FILTERED_LOGS = 'resetFilteredLogs';
const GET_LOGS_BY_TEXT_SEARCH = 'getLogsByTextSearch';
const SET_SEARCH_FILTER_STATE = 'setSearchFilterState';
const SET_SEARCH_STRING = 'setSearchString';
const SET_MARKER_START = 'setMarkerStartPosition';
const SET_MARKER_END = 'setMarkerEndPosition';
const SET_MARKING_PROGRESS = 'setMarkingProgress';
const ADD_NEW_MARKER = 'addNewMarker';
const REMOVE_SESSION_MARKER = 'removeSessionMarker';

const RECORD_SESSION_LOGS_MUTATION = 'recordSessionLogsMutation';

export {
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
};