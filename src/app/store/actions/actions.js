import {httpWrapper} from "../../http/http-wrapper";
import {
  ADD_SESSION,
  ERROR_GET_SESSION,
  SET_SESSION_LOGS,
  ADD_NEW_LOG_TO_SESSION,
  SET_ACTIVE_SESSION, SET_BUFFER_LOGS, ADD_PARTIAL_LOG_PL, BACKWARD_ADD_PARTIAL_LOG_PL
} from "../mutations/mutation-types";

import {LOGS_STEP_COUNT} from "../../shared/logs-count-util/logs-count-util";

const actions = {
  getActiveSessionsAction({commit}, sessions) {
    commit(ERROR_GET_SESSION, false);
    commit(ADD_SESSION, sessions);
  },
  setActiveSessionId({commit}, payload) {
    commit(SET_ACTIVE_SESSION, payload);
  },
  /**
   * TODO
   * properly handle fwd/bkw loading logs from buffer 2 render on the page
   * @param context - vuex context object
   * @param payload - {logsStep: Number}
   */
  getLazyLogsFromBuffer(context, payload) {
    let startIndex = payload.logsStep * LOGS_STEP_COUNT;
    let finalIndex = startIndex + LOGS_STEP_COUNT;
    let partialLogs = this.state.bufferedLogs.slice(startIndex, finalIndex);
    console.warn(payload.logsStep, 'LOG STEP FWD');
    context.commit(ADD_PARTIAL_LOG_PL, partialLogs);

    let sessionLogsLength = this.state.sessionLogs.length;

    if (sessionLogsLength > LOGS_STEP_COUNT * 2) {
      console.warn('Here is the CUT expected');
      let slisedSessionLogs = this.state.sessionLogs.slice(LOGS_STEP_COUNT, sessionLogsLength);
      context.commit(SET_SESSION_LOGS, slisedSessionLogs);
    }
  },
  getBackwardLogsFromBuffer(context, payload) {
    let startIndex = payload.logsStep * LOGS_STEP_COUNT;
    let finalIndex = startIndex + LOGS_STEP_COUNT;
    let partialLogs = this.state.bufferedLogs.slice(startIndex, finalIndex);
    context.commit(BACKWARD_ADD_PARTIAL_LOG_PL, partialLogs);
    console.warn(payload.logsStep, 'LOG STEP BACKW');
  },
  setNewLogAction({commit}, payload) {
    if (this.state.activeSessionId === payload.logData.session_related) {
      commit(ADD_NEW_LOG_TO_SESSION, payload);
    }
  }
};

export {actions};