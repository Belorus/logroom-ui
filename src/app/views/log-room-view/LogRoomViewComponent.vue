<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <logs-list v-if="revercedLogs.length > 0" :logsData="revercedLogs"></logs-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import HeaderComponent from "../../components/header-component/HeaderComponent";
  import SidebarMainComponent from "../../components/sidebar-component/SidebarMainComponent";
  import LogsListComponent from "../../components/log-room-component/LogsListComponent";
  import {throttle} from "../../shared/utils/utils";

  export default {
    sockets: {
      SOCKET_B_PUSH_LOGS: function (data) {
        console.log(data.logs);

        this.logsArray = data.isOld
          ? [...this.logsArray, ...data.logs]
          : [...data.logs, ...this.logsArray];
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
      'logs-list': LogsListComponent
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
      this.setActiveSessionId(null);
    },
    mounted() {
      this.scrollableInner = this.$refs['scrollableInner'];
      this.scrollableInner.addEventListener('scroll', throttle(this.handleLogsLoadOnScroll, 15));
    },
    computed: {
      ...mapGetters({
        isGetSessionsError: 'sessionsGetError',
        logsData: 'getSessionLogs',
        bufferedLogsLength: 'getBufferedLogsLength'
      }),
      revercedLogs() {
        return this.logsArray;
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
      ]),
      startObserveSessionLogs() {
        let listenSessionData = {
          sessionId: this.currentSessionId,
          sendOld: true,
          limit: 1000
        };
        this.$socket.emit('SOCKET_F_START_LISTEN_SESSION', listenSessionData);
      },
      stopObserveSessionLogs() {
        this.$socket.emit('SOCKET_F_STOP_LISTEN_SESSION', {sessionId: this.currentSessionId});
      },
      handleLogsLoadOnScroll() {
        // console.log('Throttling logic event fired on scroll!');
        // console.warn(
        //   this.scrollableInner.scrollTop,
        //   this.scrollableInner.clientHeight,
        //   this.scrollableInner.scrollHeight,
        //   this.scrollableInner.offsetHeight
        // );

        if(this.scrollableInner.scrollTop > 0 && this.scrollableInner.scrollTop < 30) {
          console.warn('SCROLL DOWN STARTED');
        }

        if(this.scrollableInner.scrollTop <= 0) {
          console.warn('TOP REACHED!');
        }

        if(this.scrollableInner.scrollTop >= (this.scrollableInner.scrollHeight - this.scrollableInner.offsetHeight)) {
          console.warn('BOTTOM REACHED!');
        }
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

</style>