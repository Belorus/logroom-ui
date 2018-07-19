<template>
  <div class="main_container">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  const SRV_GET_ACTIVE_SESSIONS = 'get_active_sessions';

  export default {
    created() {
      this.getAllSessionsAction();
    },
    sockets:{
      connect: function(){
        console.log('socket connected');
        this.getActiveSessions();
      },
      disconnect: function () {
        console.log('socket to notification channel disconnected')
      },
      sendActiveSessions: function (sessionsData) {
        let sessionTemplateObj = {
          archived:0,
          id:1,
          name:"Alex Session"
        };
        let sessionIds = [];
        let activeSessions = [];

        sessionsData.result.map(sessionDataObj => {
          let sessionObj = Object.assign({}, sessionDataObj, {id: sessionDataObj.uuid});
          sessionIds.push(sessionObj);
        });
        this.getActiveSessionsAction(sessionIds);
      }
    },
    methods: {
      ...mapActions({
        getAllSessionsAction: 'getAllSessionsAction',
        getActiveSessionsAction: 'getActiveSessionsAction'
      }),
      getActiveSessions() {
        this.$socket.emit(SRV_GET_ACTIVE_SESSIONS);
      }
    }
  }
</script>