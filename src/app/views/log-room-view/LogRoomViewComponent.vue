<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <logs-list v-if="logsArray.length > 0" :logsData="logsArray"></logs-list>
          <!--<logs-list v-if="storedSessionLogs.length > 0" :logsData="storedSessionLogs"></logs-list>-->
          <!--<logs-list v-if="revercedLogs.length > 0" :logsData="revercedLogs"></logs-list>-->
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
  import {IS_OLD_LOGS_REQUIRED, OLD_LOGS_LIMIT, DISPLAYED_LOGS_LIMIT} from "../../shared/config-util/config-util";

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
        frameStartIndex: 0
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
        storedSessionLogs: 'getSessionLogs',
        runtimeStoredLogs: 'getRuntimeStoredLogsGetter',
        getSessionLogsByFrameIndexes: 'getSessionLogsByFrameIndexes'
      }),
      revercedLogs() {
        return this.logsArray;
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'storeRuntimeLogs',
        'resetRuntimeLogs',
        'recordSessionLogsAction'
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
        console.log(logsData.logs.length, 'NEW LOGS LENGTH');

        if (!this.isRuntimeConcatLogsFlag) {
          this.frameStartIndex = this.frameStartIndex + logsData.logs.length;
          console.log(this.frameStartIndex, 'this.frameStartIndex');
        }

        this.recordSessionLogsAction({
          logs: logsData.logs,
          isOld: !!logsData.isOld
        });

        this.logsArray = this.getSessionLogsByFrameIndexes(this.frameStartIndex, this.frameStartIndex + DISPLAYED_LOGS_LIMIT);

      },
      handleLogsLoadOnScroll() {
        let scrollDistance = this.scrollableInner.scrollTop;
        let scrollHeight = this.scrollableInner.scrollHeight;
        let offsetHeight = this.scrollableInner.offsetHeight;

        if (scrollDistance > 0 && scrollDistance < 30) {
          console.warn('SCROLL DOWN STARTED');
          this.isRuntimeConcatLogsFlag = false;
        }

        if (scrollDistance <= 0) {
          console.warn('TOP REACHED!', this.runtimeStoredLogs.length);
          this.isRuntimeConcatLogsFlag = true;

          if(this.frameStartIndex > 0) {
            this.scrollableInner.scrollTop = scrollHeight/2;

            let startIndex = this.frameStartIndex < DISPLAYED_LOGS_LIMIT / 2
              ? 0
              : this.frameStartIndex - DISPLAYED_LOGS_LIMIT / 2;

            let endIndex = this.frameStartIndex > 0
              ? this.frameStartIndex + DISPLAYED_LOGS_LIMIT / 2
              : this.frameStartIndex + DISPLAYED_LOGS_LIMIT;
            this.logsArray = this.getSessionLogsByFrameIndexes(startIndex, endIndex);

            this.frameStartIndex = startIndex;
          }
        }

        if (scrollDistance >= (scrollHeight - offsetHeight)) {

          console.log('BOTTOM REACHED!', offsetHeight);

          if(this.logsArray[this.logsArray.length - 1].seqNumber > 1) {
            this.getOldLogsPackHandler();

            this.scrollableInner.scrollTop = scrollHeight/2 - offsetHeight;

            setTimeout(()=>{
              let startIndex = this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2 > this.storedSessionLogs.length - DISPLAYED_LOGS_LIMIT
                ? this.storedSessionLogs.length - DISPLAYED_LOGS_LIMIT - 2
                : this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2;

              let endIndex = this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2 > this.storedSessionLogs.length - DISPLAYED_LOGS_LIMIT
                ? this.storedSessionLogs.length - 1
                : this.frameStartIndex + DISPLAYED_LOGS_LIMIT + DISPLAYED_LOGS_LIMIT/2;

              this.logsArray = this.getSessionLogsByFrameIndexes(
                this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2, this.frameStartIndex + DISPLAYED_LOGS_LIMIT + DISPLAYED_LOGS_LIMIT/2
              );
              this.frameStartIndex = startIndex;

            }, 100);
          }


          // this.scrollableInner.scrollTop = scrollHeight/2 - offsetHeight;
          // setTimeout(()=>{
          //   this.logsArray = this.getSessionLogsByFrameIndexes(
          //     this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2, this.frameStartIndex + DISPLAYED_LOGS_LIMIT + DISPLAYED_LOGS_LIMIT/2
          //   );
          //   this.frameStartIndex = this.frameStartIndex + DISPLAYED_LOGS_LIMIT/2;
          // },100)




        }
      },
      getOldLogsPackHandler() {
        let lastSeqNumber = this.storedSessionLogs[this.storedSessionLogs.length - 1].seqNumber - 1;

        if (lastSeqNumber > 0) {
          let logsData = {
            sessionId: this.currentSessionId,
            startFrom: lastSeqNumber,
            limit: OLD_LOGS_LIMIT
          };

          httpWrapper.getPackOfOldLogs(logsData, logsResponse => {
            console.warn(logsResponse, ' - logsResponse');
            this.recordSessionLogsAction({
              logs: logsResponse,
              isOld: true
            });
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