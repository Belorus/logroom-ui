const getters = {
  getActiveSessions: state => {
    return state.sessions.filter(session => !session.archived);
  },
  getAllSessionsGetter: state => {
    return state.sessions;
  },
  sessionsGetError: state => {
    return state.isSessionsGetErrorOccured;
  },
  getSessionLogs: state => {
    return state.sessionLogs;
  },
  getSessionLogsByFrameIndexes: state => (startIndex, endIndex) => {
    return state.sessionLogs.slice(startIndex, endIndex);
  },
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  },
  getLogsFilterGetter: state => {
    return state.logsDisplayFilters;
  }
};

export {getters};