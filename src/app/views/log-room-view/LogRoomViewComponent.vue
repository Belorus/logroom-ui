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
            <!--<img src="http://theinspirationgrid.com/app/uploads/2017/03/art-arinze-stanley-10.jpg" alt="">-->
            <img src="https://cdn-images-1.medium.com/max/1600/0*AnVCpSvrAeldg3Rn." alt="">
            <p>Can't find any logs!</p>
          </div>
        </div>
        <el-button
          class="back_to_top"
          @click="backToTop"
          size="small"
          :class="{btn_show: !isRuntimeConcatLogsFlag}"
          icon="el-icon-arrow-up"
        ></el-button>
        <el-input
          class="search_input"
          placeholder="Search logs... (start with $ to use regular exp.)"
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
        if(data.logs.length >= OLD_LOGS_LIMIT) {
          this.getAllSessionLogs(data);
        }
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
      }, 400),
      markerSelected: function (markerQuery) {

        if(this.isEmpty(markerQuery)) {
          return;
        } else {
          let fullMarkerData = this.getMarkerDataGetter(markerQuery.markerId, this.currentSessionId);

          if(!fullMarkerData) return;

          this.loadSelectedMarker(fullMarkerData);
          this.frameStartIndex = fullMarkerData.firstLogIndex - 2;
          this.isRuntimeConcatLogsFlag = false;
          this.logsArray = this.getSessionLogsByFrameIndexes(this.frameStartIndex, this.frameStartIndex + DISPLAYED_LOGS_LIMIT);
          this.scrollableInner.scrollTop = 50;
        }
      }
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
        getLastFilteredLogInStore: 'getLastFilteredLogInStore',
        getMarkerDataGetter: 'getMarkerDataGetter'
      }),
      searchChanged() {
        return this.instantSearchModel;
      },
      markerSelected() {
        return this.$route.query;
      }
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'recordSessionLogsAction',
        'clearSessionLogs',
        'setFilteredLogsAction',
        'getLogsBySearchAction',
        'loadSelectedMarker',
        'resetSelectedMarker'
      ]),
      isEmpty(obj) {
        for (let key in obj) {
          if (obj.hasOwnProperty(key))
            return false;
        }
        return true;
      },
      startObserveSessionLogs() {
        let listenSessionData = {
          sessionId: this.currentSessionId,
          sendOld: IS_OLD_LOGS_REQUIRED,
          limit: OLD_LOGS_LIMIT
        };
        this.$socket.emit('SOCKET_F_START_LISTEN_SESSION', listenSessionData);
      },
      stopObserveSessionLogs() {
        this.resetSelectedMarker();
        this.$socket.emit('SOCKET_F_STOP_LISTEN_SESSION', {sessionId: this.currentSessionId});
      },
      backToTop(){
        this.logsArray = [];
        this.frameStartIndex = 0;
        this.logsArray = this.getSessionLogsByFrameIndexes(0, DISPLAYED_LOGS_LIMIT);
        this.scrollableInner.scrollTop = 0;
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
          this.topCalculateDisplayedLogs();
        }

        if (isContainerBottomReached && this.logsArray.length >= DISPLAYED_LOGS_LIMIT) {
          this.bottomCalculateDisplayedLogs();
        }
      },
      topCalculateDisplayedLogs() {
        if (this.frameStartIndex > 0) {
          let startIndex = this.topCalculateStartIndex();
          let endIndex = this.topCalculateEndIndex();

          this.logsArray = this.getSessionLogsByFrameIndexes(startIndex, endIndex);
          this.frameStartIndex = startIndex;
          setTimeout(()=> {
            this.scrollableInner.scrollTop = this.scrollableInner.scrollHeight / 2;
          }, 0)
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
        this.instantSearchModel = '';
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
    bottom: $footer-height;
    left: 0;
  }

  .content_wrapper {
    position: relative;
    width: calc(100vw - 300px);
    margin-bottom: 80px;
    .content_inner {
      @include scrollable-inner;
      @include inner-shadow;
      border-bottom: 1px solid #e6e6e6;
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
      margin: 0 20px;
    }
    .back_to_top {
      z-index: -1;
      position: absolute;
      bottom: 10px;
      right: 10px;
      transition: all .3s;
      border-radius: 5px;
      background: white;
      opacity: 0;
      -webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);
      -moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.3);
    }
    .btn_show {
      z-index: 1;
      opacity: .8;
      &:hover {
        opacity: 1;
      }
    }
  }

</style>