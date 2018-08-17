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

    if(state.sessionLogs.length > 0) {
      console.log(state.sessionLogs[0].seqNumber, state.sessionLogs[state.sessionLogs.length - 1].seqNumber);
    }
    return state.sessionLogs;
  },
  getSessionLogsByFrameIndexes: state => (startIndex, endIndex) => {
    let sessionByFrame = state.sessionLogs.slice(startIndex, endIndex);
    console.log(`startIndex: ${startIndex} | endIndex: ${endIndex} `);
    let returnArray = [];
    sessionByFrame.map(s => returnArray.push(s.seqNumber));
    console.log(returnArray);

    return state.sessionLogs.slice(startIndex, endIndex);
  },
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  },
  getRuntimeStoredLogsGetter: state => {
    return state.runtimeStoredLogs;
  }
};

export {getters};