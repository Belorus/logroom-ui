<template>
  <div class="main_container">
    <router-view></router-view>
    <footer-component></footer-component>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  import FooterComponent from "Components/footer-component/FooterComponent"

  export default {
    components: {
      'footer-component': FooterComponent
    },
    sockets: {
      connect: function () {
        console.log('socket connected');
      },
      disconnect: function () {
        this.clearActiveSessions();
        console.log('socket to notification channel disconnected')
      },
      SOCKET_B_STOP_LISTEN_SESSION_SUCCESS: function () {
        console.log('Session listenning stopped');
      },
      SOCKET_B_NEW_ACTIVE_SESSION: function (sessionData) {
        this.addNewActiveSession(sessionData);
      },
      SOCKET_B_ACTIVE_SESSION_UPDATED: function (sessionData) {
        this.updateSessionData(sessionData);
      }
    },
    methods: {
      ...mapActions({
        clearActiveSessions: 'clearActiveSessions',
        addNewActiveSession: 'addNewActiveSession',
        updateSessionData: 'updateSessionData'
      })
    }
  }
</script>