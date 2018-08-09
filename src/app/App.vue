<template>
  <div class="main_container">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  const SOCKET_FWD_GET_ACTIVE_SESSIONS = 'get_active_sessions';

  export default {
    sockets:{
      connect: function(){
        console.log('socket connected');
        this.getActiveSessions();
      },
      disconnect: function () {
        console.log('socket to notification channel disconnected')
      },
      sendActiveSessions: function (sessionsData) {
        let sessionIds = [];

        sessionsData.result.map(sessionDataObj => {
          let sessionObj = Object.assign({}, sessionDataObj, {id: sessionDataObj.uuid});
          sessionIds.push(sessionObj);
        });
        this.getActiveSessionsAction(sessionIds);
      }
    },
    methods: {
      ...mapActions({
        getActiveSessionsAction: 'getActiveSessionsAction'
      }),
      getActiveSessions() {
        this.$socket.emit(SOCKET_FWD_GET_ACTIVE_SESSIONS);
      }
    }
  }
</script>