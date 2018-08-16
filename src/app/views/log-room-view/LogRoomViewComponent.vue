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
  import {httpWrapper} from "../../http/http-wrapper";
  import {IS_OLD_LOGS_REQUIRED, OLD_LOGS_LIMIT} from "../../shared/config-util/config-util";

  export default {
    sockets: {
      SOCKET_B_PUSH_LOGS: function (data) {
        this.receiveLogsHandler(data);
      }
    },
    data() {
      return {
        currentSessionId: null,
        scrollableInner: HTMLElement,
        logsArray: [],
        isRuntimeConcatLogsFlag: true,
        slicedLogsBuffer: [],
        slicedOldLogsBuffer: []
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
        runtimeStoredLogs: 'getRuntimeStoredLogsGetter'
      }),
      revercedLogs() {
        return this.logsArray;
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'storeRuntimeLogs',
        'resetRuntimeLogs'
      ]),
      startObserveSessionLogs() {
        let listenSessionData = {
          sessionId: this.currentSessionId,
          sendOld: IS_OLD_LOGS_REQUIRED,
          limit: OLD_LOGS_LIMIT
        };
        this.$socket.emit('SOCKET_F_START_LISTEN_SESSION', listenSessionData);
      },
      stopObserveSessionLogs() {
        this.$socket.emit('SOCKET_F_STOP_LISTEN_SESSION', {sessionId: this.currentSessionId});
      },
      receiveLogsHandler(logsData) {
        this.isRuntimeConcatLogsFlag
          ? this.runtimeLogsHandler(logsData)
          : this.storeRuntimeLogs(logsData.logs);
      },
      runtimeLogsHandler(logsData) {
        this.logsArray = logsData.isOld
          ? this.oldLogsProcessHandler(logsData.logs)
          : this.newLogsOnlyProcessHandler(logsData.logs);
      },
      oldLogsProcessHandler(logsArray) {
        return [...this.logsArray, ...logsArray]
      },
      newLogsOnlyProcessHandler(logsArray) {
        return [...logsArray, ...this.logsArray]
      },
      handleLogsLoadOnScroll() {
        let scrollDistance = this.scrollableInner.scrollTop;
        let scrollHeight = this.scrollableInner.scrollHeight;
        let offsetHeight = this.scrollableInner.offsetHeight;

        if(scrollDistance > 0 && scrollDistance < 30) {
          console.warn('SCROLL DOWN STARTED');
          this.isRuntimeConcatLogsFlag = false;
        }

        if(scrollDistance <= 0) {
          console.warn('TOP REACHED!', this.runtimeStoredLogs.length);
          if(this.slicedLogsBuffer.length > 0) {
            this.logsArray = this.slicedLogsBuffer.concat(this.logsArray);
            this.slicedLogsBuffer = [];
          }

          if(this.runtimeStoredLogs.length > 0) {
            this.logsArray = this.runtimeStoredLogs.concat(this.logsArray);
            this.resetRuntimeLogs();
          }
          this.isRuntimeConcatLogsFlag = true;
        }

        if(scrollDistance >= (scrollHeight - offsetHeight)) {
          this.getOldLogsPackHandler();
        }
      },
      getOldLogsPackHandler() {
        let lastSeqNumber = this.logsArray[this.logsArray.length - 1].seqNumber - 1;

        if(lastSeqNumber > 0) {
          let logsData = {
            sessionId: this.currentSessionId,
            startFrom: lastSeqNumber,
            limit: OLD_LOGS_LIMIT
          };

          httpWrapper.getPackOfOldLogs(logsData, logsResponse => {
            console.warn(this.logsArray.length, ' - Displayed Logs Length');

            let limit = 60;
            let arrayLength = this.logsArray.length;

            let slicedArray = this.logsArray.slice(arrayLength - limit, arrayLength);

            let partSlicedLogs = this.logsArray.slice(0, arrayLength - limit);

            if(partSlicedLogs.length > 0) {
              this.slicedLogsBuffer = [...this.slicedLogsBuffer, ...partSlicedLogs];
            }

            if(arrayLength > limit) {
              console.log(slicedArray, partSlicedLogs, this.slicedLogsBuffer);
              this.scrollableInner.scrollTop = this.scrollableInner.offsetHeight - 100;
            }
            this.logsArray = [...slicedArray, ...logsResponse]
          });
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