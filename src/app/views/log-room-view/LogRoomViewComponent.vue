<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component :sessionId="currentSessionId"></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <transition-group name="list" v-if="revercedLogs.length > 0">
            <p v-for="(log, index) in revercedLogs" :key="index"
               class="list-item">
              {{formattedTimestamp(log.timestamp)}} | {{log.level}} | {{log.thread}} | {{log.tag}}: {{log.message}}
            </p>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import HeaderComponent from "../../components/header-component/HeaderComponent";
  import SidebarMainComponent from "../../components/sidebar-component/SidebarMainComponent";
  import LogRoomComponent from "../../components/log-room-component/LogRoomComponent";

  const STOP_LISTEN_SESSION = 'stop_listen_session';

  export default {
    sockets: {
      get_logs_by_session: function (data) {
        if(data.result) {
          data.result.list.map(log => {
            this.logsArray.push(log);
          })
        }
      },
      sessionLogsObserver: function (data) {
        if(data.result) {
          data.result.map(log => {
            this.logsArray.push(log);
          })
        }
      }
    },
    data() {
      return {
        currentSessionId: null,
        scrollableInner: '',
        scrollDownStep: 1,
        scrollUpStep: 1,
        scrollTopDirectionMarker: 0,
        logsArray: []
      }
    },
    components: {
      'header-component': HeaderComponent,
      'sidebar-component': SidebarMainComponent,
      'log-room': LogRoomComponent
    },
    created() {
      this.currentSessionId = this.$route.params.id;
      let sessionIdData = {
        sessionId: this.currentSessionId
      };
      this.setActiveSessionId(sessionIdData);
      this.startObserveSessionLogs();
    },
    destroyed() {
      this.stopObserveSessionLogs();
    },
    computed: {
      ...mapGetters({
        isGetSessionsError: 'sessionsGetError',
        logsData: 'getSessionLogs',
        bufferedLogsLength: 'getBufferedLogsLength'
      }),
      revercedLogs() {
        return this.logsArray.slice().reverse();
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'getLogsBySession',
        'getLazyLogsFromBuffer',
        'getBackwardLogsFromBuffer'
      ]),
      formattedTimestamp(timestampData) {
        let date = new Date(timestampData);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        let miliseconds = "0" + date.getMilliseconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ':' + miliseconds.substr(-3);
      },
      startObserveSessionLogs() {
        this.$socket.emit('get_logs_by_session', {session_id: this.currentSessionId});
        this.$socket.emit('listen_session', {session_id: this.currentSessionId});
      },
      stopObserveSessionLogs() {
        this.$socket.emit(STOP_LISTEN_SESSION, {sessionId: this.currentSessionId});
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixins";
  @import "../../../assets/styles/variables";


  .content_container {
    position: absolute;
    @include display-flex;
    top: $header-height;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .content_wrapper {
    position: relative;
    width: calc(100vw - 300px);
    .content_inner {
      @include scrollable-inner;
      padding: 20px 20px 20px 30px;
    }
  }
  .list-item {
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.4em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-family: monospace;
    font-size: 11pt;
  }

</style>