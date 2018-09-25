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
    let logsToReturn;

    if(state.logsDisplayFilters.length > 0 || state.isSearchFilterActive) {
      logsToReturn = state.filteredLogs.slice(startIndex, endIndex);
    } else {
      logsToReturn = state.sessionLogs.slice(startIndex, endIndex);
    }

    return logsToReturn;
  },
  getSessionDetailsByIdGetter: state => sessionId => {
    return state.sessions.find(session => session.id === sessionId);
  },
  getLogsFilterGetter: state => {
    return state.logsDisplayFilters;
  },
  getSearchQueryString: state => {
    return state.searchString;
  },
  getLastFilteredLogInStore: state => {
    return state.filteredLogs.length > 0 ? state.filteredLogs[state.filteredLogs.length - 1] : false;
  },
  getMarkerProgressFlagGetter: state => {
    return state.isMarkingInProgress;
  },
  getStartMarkingPosition: state => {
    return state.markerStartPosition;
  },
  getEndMarkingPosition: state => {
    return state.markerEndPosition;
  },
  getSessionMarkers: state => sessionId => {
    const sessionFound = state.sessions.find(session => session.id === sessionId);
    if(sessionFound) {
      return sessionFound.markers;
    }
    return []
  },
  getMarkerDataGetter: state => (markerId, sessionId) => {
    let markerData;
    let dataToReturn;
    const sessionFound = state.sessions.find(session => session.id === sessionId);

    if(sessionFound) {
      markerData = sessionFound.markers.find(marker => marker.id === markerId);

      let firstLogToDisplay = markerData.startPosition > markerData.endPosition
        ? markerData.startPosition
        : markerData.endPosition;
      let firstLogIndex = state.sessionLogs.map(log => log.seqNumber).indexOf(firstLogToDisplay);

      dataToReturn = Object.assign({}, markerData, {firstLogIndex: firstLogIndex});
    }
    return dataToReturn;
  }
};

export {getters};