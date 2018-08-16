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
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  },
  getRuntimeStoredLogsGetter: state => {
    return state.runtimeStoredLogs;
  }
};

export {getters};