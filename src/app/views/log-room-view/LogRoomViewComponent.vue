<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <logs-list v-if="logsArray.length > 0" :logsData="logsArray"></logs-list>
          <div v-if="isLogsFound && logsArray.length === 0" class="not_found_block">
            <img src="http://theinspirationgrid.com/app/uploads/2017/03/art-arinze-stanley-10.jpg" alt="">
            <!--<img src="https://cdn-images-1.medium.com/max/1600/0*AnVCpSvrAeldg3Rn." style="width: 100%;" alt="">-->
            <p>Can't find any logs!</p>
          </div>
        </div>
        <el-input
          class="search_input"
          placeholder="Search logs..."
          prefix-icon="el-icon-search"
          v-model="instantSearchModel">
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import HeaderComponent from "Components/header-component/HeaderComponent";
  import SidebarMainComponent from "Components/sidebar-component/SidebarMainComponent";
  import LogsListComponent from "Components/logs-list-component/LogsListComponent";
  import {throttle, debounce} from "../../shared/utils/utils";
  import {httpWrapper} from "Http/http-wrapper";
  import {IS_OLD_LOGS_REQUIRED, OLD_LOGS_LIMIT, DISPLAYED_LOGS_LIMIT} from "../../shared/config-util/config-util";

  export default {
    sockets: {
      SOCKET_B_PUSH_LOGS: function (data) {
        this.getAllSessionLogs(data);
        this.receiveLogsHandler(data);
        this.isLogsFound = true;
      }
    },
    data() {
      return {
        currentSessionId: null,
        scrollableInner: HTMLElement,
        logsArray: [],
        isRuntimeConcatLogsFlag: true,
        frameStartIndex: 0,
        instantSearchModel: '',
        isLogsFound: false
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
      this.clearSessionLogs();
    },
    watch: {
      getLogsFilterGetter: function (filters) {
        filters.length > 0
          ? this.getLogsByFilter()
          : this.reinitLogsReceiving();
      },
      searchChanged: debounce(function (val) {
        let searchData = {
          searchString: val.length > 3 ? val : null,
          isSearchActive: val.length > 3
        };
        this.getLogsBySearchAction(searchData);
        this.logsArray = this.getSessionLogsByFrameIndexes(0, DISPLAYED_LOGS_LIMIT);
      }, 400)
    },
    mounted() {
      this.scrollableInner = this.$refs['scrollableInner'];
      this.scrollableInner.addEventListener('scroll', throttle(this.handleLogsLoadOnScroll, 15));
    },
    computed: {
      ...mapGetters({
        isGetSessionsError: 'sessionsGetError',
        storedSessionLogs: 'getSessionLogs',
        getSessionLogsByFrameIndexes: 'getSessionLogsByFrameIndexes',
        getLogsFilterGetter: 'getLogsFilterGetter',
        getLastFilteredLogInStore: 'getLastFilteredLogInStore'
      }),
      searchChanged() {
        return this.instantSearchModel;
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'recordSessionLogsAction',
        'clearSessionLogs',
        'setFilteredLogsAction',
        'getLogsBySearchAction'
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
      reinitLogsReceiving() {
        this.logsArray = [];
        this.frameStartIndex = 0;
        this.instantSearchModel = '';
        this.logsArray = this.getSessionLogsByFrameIndexes(0, DISPLAYED_LOGS_LIMIT);
      },
      receiveLogsHandler(logsData) {
        let logsToSave = {
          logs: logsData.logs,
          isOld: !!logsData.isOld
        };
        this.recordSessionLogsAction(logsToSave);

        let newLogsCount = 0;
        if (this.getLogsFilterGetter.length > 0) {
          newLogsCount = logsData.logs.filter(log => this.getLogsFilterGetter.includes(log.level)).length;
          this.setFilteredLogsAction();
        } else {
          newLogsCount = logsData.logs.length;
        }

        this.startIndexShiftsOnReceivingLogs(newLogsCount);
        this.logsArray = this.getSessionLogsByFrameIndexes(this.frameStartIndex, this.frameStartIndex + DISPLAYED_LOGS_LIMIT);
      },
      startIndexShiftsOnReceivingLogs(shiftStep) {
        if (!this.isRuntimeConcatLogsFlag) {
          this.frameStartIndex = this.frameStartIndex + shiftStep;
        }
      },
      handleLogsLoadOnScroll() {
        let scrollDistance = this.scrollableInner.scrollTop;
        let scrollHeight = this.scrollableInner.scrollHeight;
        let offsetHeight = this.scrollableInner.offsetHeight;

        let isContainerScrolledDown = scrollDistance > 0 && scrollDistance < 30;
        let isContainerTopReached = scrollDistance <= 0;
        let isContainerBottomReached = scrollDistance >= scrollHeight - offsetHeight;

        if (isContainerScrolledDown) {
          this.isRuntimeConcatLogsFlag = false;
        }

        if (isContainerTopReached) {
          this.topCalculateDisplayedLogs(scrollHeight);
        }

        if (isContainerBottomReached && this.logsArray.length >= DISPLAYED_LOGS_LIMIT) {
          this.bottomCalculateDisplayedLogs();
        }
      },
      topCalculateDisplayedLogs(scrollHeight) {
        if (this.frameStartIndex > 0) {
          let startIndex = this.topCalculateStartIndex();
          let endIndex = this.topCalculateEndIndex();

          this.scrollableInner.scrollTop = scrollHeight / 2;
          this.logsArray = this.getSessionLogsByFrameIndexes(startIndex, endIndex);

          this.frameStartIndex = startIndex;
        } else {
          this.isRuntimeConcatLogsFlag = true;
        }
      },
      topCalculateStartIndex() {
        return this.frameStartIndex < DISPLAYED_LOGS_LIMIT / 2
          ? 0
          : this.frameStartIndex - DISPLAYED_LOGS_LIMIT / 2;
      },
      topCalculateEndIndex() {
        return this.frameStartIndex > 0
          ? this.frameStartIndex + DISPLAYED_LOGS_LIMIT / 2
          : this.frameStartIndex + DISPLAYED_LOGS_LIMIT;
      },
      bottomCalculateDisplayedLogs() {
        let scrollHeight = this.scrollableInner.scrollHeight;
        let offsetHeight = this.scrollableInner.offsetHeight;

        let isLogsShouldBeAddedBottomCase = this.getLastFilteredLogInStore
          ? this.logsArray[this.logsArray.length - 1].seqNumber !== this.getLastFilteredLogInStore.seqNumber
          : this.logsArray[this.logsArray.length - 1].seqNumber > 1;

        if (isLogsShouldBeAddedBottomCase) {
          this.bottomAddMoreLogs();
          this.scrollableInner.scrollTop = scrollHeight / 2 - offsetHeight;
        }
      },
      bottomAddMoreLogs() {
        let startIndex = this.frameStartIndex + DISPLAYED_LOGS_LIMIT / 2;
        let endIndex = this.frameStartIndex + DISPLAYED_LOGS_LIMIT + DISPLAYED_LOGS_LIMIT / 2;

        this.logsArray = this.getSessionLogsByFrameIndexes(startIndex, endIndex);
        this.frameStartIndex = startIndex;
      },
      getLogsByFilter() {
        this.logsArray = [];
        this.frameStartIndex = 0;
        this.logsArray = this.getSessionLogsByFrameIndexes(0, DISPLAYED_LOGS_LIMIT);
      },
      getAllSessionLogs(logsReceived) {
        if (this.storedSessionLogs.length === 0) {
          let lastLoadedLog = logsReceived.logs[logsReceived.logs.length - 1].seqNumber;
          let logsData = {
            sessionId: this.currentSessionId,
            startFrom: lastLoadedLog - 1
          };

          httpWrapper.getPackOfOldLogs(logsData, logsResponse => {
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
    margin-bottom: 80px;
    .content_inner {
      @include scrollable-inner;
      padding: 20px 20px 20px 30px;
      .not_found_block {
        text-align: center;
        font-size: 22px;
        font-weight: bold;
        img {
          width: 100%;
        }
      }
    }
    .search_input {
      position: absolute;
      bottom: -60px;
      width: calc(100% - 40px);
      max-width: 1260px;
      margin: 0 20px;
    }
  }

</style>