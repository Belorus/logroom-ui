import {getters} from "./getters/getters";
import {mutations} from "./mutations/mutations";
import {actions} from "./actions/actions";

const storage = {
  state: {
    sessions: [],
    isSessionsGetErrorOccured: false,
    sessionLogs: [],
    activeSessionId: null
  },
  mutations: mutations,
  getters: getters,
  actions: actions
};

export {storage};