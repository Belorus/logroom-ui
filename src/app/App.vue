<template>
  <div class="main_container">
    <el-row class="btns_socket_container">
      <el-button type="info" @click="pingServer">Socket</el-button>
      <el-button type="info" @click="disconnectSocket">Disconnect Socket</el-button>
    </el-row>
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
        console.log('sessionsData: ', sessionsData);
        let sessionIds = sessionsData.result;
        let sessionTemplateObj = {
          archived:0,
          id:1,
          name:"Alex Session"
        };
        let activeSessions = [];
        sessionIds.map(sessionId => {
          console.log('Active sessions IDS: ', sessionId);
          let sessionObj = Object.assign({}, sessionTemplateObj, {id: sessionId});
          activeSessions.push(sessionObj);
        });
        this.getActiveSessionsAction(activeSessions);
      },
      stopLogsObserver: function (data) {
        console.log('Stop listening session: ', data);
      }
    },
    methods: {
      ...mapActions({
        getAllSessionsAction: 'getAllSessionsAction',
        getActiveSessionsAction: 'getActiveSessionsAction'
      }),
      pingServer() {
        console.warn('PUSHED! Socket connection flag: ', this.$socket.connected);
        this.$socket.emit('сlientTestEvent', {client:'PING!'});
        this.$socket.connect();
      },
      disconnectSocket() {
        this.$socket.emit('disconnect');
        this.$socket.close();
      },
      getActiveSessions() {
        this.$socket.emit(SRV_GET_ACTIVE_SESSIONS);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btns_socket_container {
    position: absolute;
    top: 0;
    right: 0;
    left: 50%;
    z-index: 999999999;
    .el-button {
      float: right;
      margin: 10px 20px;
    }
  }

</style>