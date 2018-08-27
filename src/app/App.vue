<template>
  <div class="main_container">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  import {httpWrapper} from "./http/http-wrapper";

  export default {
    sockets:{
      connect: function(){
        console.log('socket connected');
        this.getAllActiveSessionsByHttp();
      },
      disconnect: function () {
        this.clearActiveSessions();
        console.log('socket to notification channel disconnected')
      },
      SOCKET_B_STOP_LISTEN_SESSION_SUCCESS: function () {
        console.log('Session listenning stopped');
      }
    },
    methods: {
      ...mapActions({
        getActiveSessionsAction: 'getActiveSessionsAction',
        clearActiveSessions: 'clearActiveSessions'
      }),
      getAllActiveSessionsByHttp() {
        httpWrapper.getActiveSessions(
          sessionsData => {
            let sessionIds = [];
            sessionsData.map(sessionDataObj => {
              let sessionObj = Object.assign({}, sessionDataObj, {id: sessionDataObj.id});
              sessionIds.push(sessionObj);
            });
            this.getActiveSessionsAction(sessionIds);
          },
          err => {
            console.log(err, 'GET ACTIVE SESSIONS OVER HTTP MODULE ERROR OCCURED');
          }
        )
      }
    }
  }
</script>