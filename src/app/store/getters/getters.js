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
    let sessionByFrame = state.sessionLogs.slice(startIndex, endIndex);
    console.log(`startIndex: ${startIndex} | endIndex: ${endIndex} `);
    let returnArray = [];
    sessionByFrame.map(s => returnArray.push(s.seqNumber));
    console.log(`${returnArray[0]}...${returnArray[returnArray.length - 1]}, logs length: ${state.sessionLogs.length}`);

    return state.sessionLogs.slice(startIndex, endIndex);
  },
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  }
};

export {getters};