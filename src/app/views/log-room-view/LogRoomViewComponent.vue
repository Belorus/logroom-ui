<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component :sessionId="currentSessionId"></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <!--<log-room :logsData="logsData"></log-room>-->
          <transition-group name="list">
            <p v-for="(log, index) in revercedLogs" :key="index" class="list-item">{{index}}: {{log.message}}</p>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {throttle} from "../../shared/utils/utils";
  import HeaderComponent from "../../components/header-component/HeaderComponent";
  import SidebarMainComponent from "../../components/sidebar-component/SidebarMainComponent";
  import LogRoomComponent from "../../components/log-room-component/LogRoomComponent";

  const STOP_LISTEN_SESSION = 'stop_listen_session';

  export default {
    sockets: {
      sessionLogsObserver: function (data) {
        console.warn('Logs Observer Data: ', data.data);
        if(data.data.result) {
          data.data.result.map(log => {
            this.logsArray.push(log);
          })
        }
      },
      stopLogsObserver: function (data) {
        console.log('Stop listening session: ', data);
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
      this.getLogsBySession(sessionIdData);

      this.startObserveSessionLogs();
    },
    destroyed() {
      console.warn('COMPONENT DESTOYED!!!');
      this.stopObserveSessionLogs();
    },
    mounted() {
      this.scrollableInner = this.$refs['scrollableInner'];
      this.scrollableInner.addEventListener('scroll', throttle(this.handleLogsLoadOnScroll, 0));
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
      startObserveSessionLogs() {
        console.log({sessionId: this.currentSessionId});
        this.$socket.emit('get_session_logs', {sessionId: this.currentSessionId});
      },
      stopObserveSessionLogs() {
        console.log('Observer Stopped', {sessionId: this.currentSessionId});
        this.$socket.emit(STOP_LISTEN_SESSION, {sessionId: this.currentSessionId});
      },
      scrollDiv() {
        this.scrollableInner.scrollTop = 196;
        console.warn(this.scrollableInner.scrollTop, 'scrollTop');
      },
      handleLogsLoadOnScroll() {
        let scrollTop = this.scrollableInner.scrollTop;
        let clientHeight = this.scrollableInner.clientHeight;
        let scrollHeight = this.scrollableInner.scrollHeight;

        if(this.scrollTopDirectionMarker < scrollTop) {
          this.scrollTopDirectionMarker = scrollTop;
        }

        let isDirectionDown = this.scrollTopDirectionMarker <= scrollTop;

        if(!isDirectionDown && scrollTop < 10) {
          console.warn('You are scrolling UP!', this.scrollDownStep);
          // if(this.scrollDownStep > 2) {
          //   this.scrollDownStep = this.scrollDownStep - 3;
          //   this.getBackwardLogsFromBuffer({logsStep: this.scrollDownStep});
          //   this.scrollableInner.scrollTop = 100;
          //   // this.scrollableInner.scrollTop = scrollHeight - 200;
          // }
        }

        if(isDirectionDown && scrollTop + clientHeight + 50 >= scrollHeight && this.logsData.length < this.bufferedLogsLength) {
          console.log('Load More!', this.logsData.length);
          this.getLazyLogsFromBuffer({logsStep: this.scrollDownStep});
          this.scrollDownStep++;
          this.scrollDiv();
        }
        // console.log('Throttle Worked! ', scrollTop, clientHeight, scrollHeight);
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