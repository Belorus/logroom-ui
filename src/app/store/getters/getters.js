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
  getBufferedLogsLength: state => {
    return state.bufferedLogs.length;
  },
  getSessionDetailsGetter: state => {
    return state.sessions.find(session => session.id === state.activeSessionId);
  },
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  }
};

export {getters};