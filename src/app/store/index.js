import {getters} from "./getters/getters";
import {mutations} from "./mutations/mutations";
import {actions} from "./actions/actions";

const storage = {
  state: {
    sessions: [],
    isSessionsGetErrorOccured: false,
    sessionLogs: [],
    filteredLogs: [],
    activeSessionId: null,
    logsDisplayFilters: []
  },
  mutations: mutations,
  getters: getters,
  actions: actions
};

export {storage};