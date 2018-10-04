<template>
  <div :class="{is_odd: isOdd, highlighted_log: isHighlighted}"
       class="list_item" v-on:mouseover="onMouseoverHandler">
    <el-button
      @click="markerHandler"
      type="primary"
      plain
      size="mini"
      :icon="getMarkerProgressFlagGetter ? 'el-icon-edit': 'el-icon-plus'"
    ></el-button>
    <span class="timestamp">
      {{log.timestamp | timistampFilter}}
    </span>
    <span class="log_level"
          :class="{
            trace_color: isTrace,
            debug_color: isDebug,
            warn_color: isWarn,
            info_color: isInfo,
            error_color: isError,
            fatal_color: isFatal
          }">
      {{log.level}}
    </span>
    <span class="log_thread"> - {{log.thread}}</span>
    |
    <p class="log_message"><span class="log_tag">{{log.tag}}:</span> {{log.message}}</p>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from "vuex";
  import {httpWrapper} from "Http/http-wrapper";
  import {
    TRACE_LOG_TYPE,
    DEBUG_LOG_TYPE,
    WARN_LOG_TYPE,
    INFO_LOG_TYPE,
    ERROR_LOG_TYPE,
    FATAL_LOG_TYPE
  } from "../../../shared/config-util/config-util";
  import {filtersMixin} from "Utils/filters-mixin";

  export default {
    name: 'single-log',
    data() {
      return {
        currentLog: null,
        highlightLogFlag: false,
        currentSessionId: null
      }
    },
    props: {
      log: Object
    },
    mixins: [filtersMixin],
    created() {
      this.currentSessionId = this.$route.params.id;
    },
    computed: {
      ...mapGetters({
        getMarkerProgressFlagGetter: 'getMarkerProgressFlagGetter',
        getStartMarkingPosition: 'getStartMarkingPosition',
        getEndMarkingPosition: 'getEndMarkingPosition',
        getLogsFilterGetter: 'getLogsFilterGetter',
        getSearchQueryString: 'getSearchQueryString'
      }),
      isHighlighted() {
        const markerDraggedDown = this.getEndMarkingPosition <= this.getStartMarkingPosition
          && this.log.seqNumber >= this.getEndMarkingPosition
          && this.log.seqNumber <= this.getStartMarkingPosition;

        const markerDraggedUp = this.getStartMarkingPosition <= this.getEndMarkingPosition
          && this.log.seqNumber >= this.getStartMarkingPosition
          && this.log.seqNumber <= this.getEndMarkingPosition;

        return (markerDraggedDown || markerDraggedUp);
      },
      isOdd() {
        return this.log.seqNumber % 2 === 0;
      },
      isTrace() {
        return this.log.level === TRACE_LOG_TYPE;
      },
      isDebug() {
        return this.log.level === DEBUG_LOG_TYPE;
      },
      isWarn() {
        return this.log.level === WARN_LOG_TYPE;
      },
      isInfo() {
        return this.log.level === INFO_LOG_TYPE;
      },
      isError() {
        return this.log.level === ERROR_LOG_TYPE;
      },
      isFatal() {
        return this.log.level === FATAL_LOG_TYPE;
      }
    },
    methods: {
      ...mapActions({
        changeMarkerProgressState: 'changeMarkerProgressState',
        setMarkerStartPosition: 'setMarkerStartPosition',
        setMarkerEndPosition: 'setMarkerEndPosition',
        addNewMarkerAction: 'addNewMarkerAction'
      }),
      formattedTimestamp(timestampData) {
        return formattedTimestampUtil(timestampData);
      },
      onMouseoverHandler() {
        if(!this.getMarkerProgressFlagGetter) return;
        this.setMarkerEndPosition(this.log.seqNumber);
      },
      markerHandler() {
        this.changeMarkerProgressState();

        if(this.getMarkerProgressFlagGetter) {
          this.setMarkerStartPosition(this.log.seqNumber);
          this.setMarkerEndPosition(this.log.seqNumber);
        } else {
          this.openConfirm();
        }
      },
      resetMarking() {
        this.setMarkerStartPosition();
        this.setMarkerEndPosition();
      },
      openConfirm() {
        const confirmMessage = `This will save logs marker. Marker ${this.getStartMarkingPosition} - ${this.getEndMarkingPosition}`;
        const confirmTitle = 'Save Logs Marker';
        const confirmMessageConfig = {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'success'
        };

        this.$confirm(confirmMessage, confirmTitle, confirmMessageConfig).then(() => {
          this.saveNewMarker();
        }).catch(() => {
          this.fireDeclineMessage();
        });
      },
      saveNewMarker() {
        let markerData = this.buildMarkerData();

        httpWrapper.postNewSessionMarker(markerData, this.currentSessionId, (savedMarkerData) => {
          let saveMarkerActionData = {
            sessionId: this.currentSessionId,
            markerData: savedMarkerData
          };
          this.addNewMarkerAction(saveMarkerActionData);

          this.fireSuccessMessage();
          this.resetMarking();
        });
      },
      buildMarkerData() {
        let filtersData = [];

        if(this.getLogsFilterGetter.length > 0) {
          this.getLogsFilterGetter.map(filter => filtersData.push(filter));
        }

        return {
          startPosition: this.getStartMarkingPosition,
          endPosition: this.getEndMarkingPosition,
          clientFilters: {
            levels: filtersData,
            searchQuery:this.getSearchQueryString
          }
        };
      },
      fireSuccessMessage() {
        this.$message({
          type: 'success',
          showClose: true,
          message: `Marker ${this.getStartMarkingPosition} - ${this.getEndMarkingPosition} saved`
        });
      },
      fireDeclineMessage() {
        this.$message({
          type: 'info',
          showClose: true,
          message: `Saving marker ${this.getStartMarkingPosition} - ${this.getEndMarkingPosition} canceled`
        });
        this.resetMarking();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/variables";

  .list_item {
    display: inline-block;
    position: relative;
    width: 100%;
    word-break: break-all;
    padding: 5px 0;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-family: monospace;
    font-size: 14px;
    line-height: 22px;
    &:hover .el-button {
      opacity: 1;
    }
    .el-button {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }

  .is_odd {
    background: #f9f9f9;
  }
  .highlighted_log {
    background: lighten(#42A5F5, 30%);
  }

  .timestamp {
    display: inline-block;
    width: 90px;
    color: #68767b;
    font-style: italic;
    font-size: 12px;
  }

  .log_thread {
    display: inline-block;
    width: 45px;
  }

  .log_message {
    margin: 0;
    width: calc(100% - 260px);
    float: right;
    .log_tag {
      font-weight: bold;
    }
  }

  .log_level {
    display: inline-block;
    border: 1px solid #b5b3b3;
    border-radius: 3px;
    width: 60px;
    font-size: 12px;
    line-height: 16px;
    margin-top: 3px;
    text-align: center;
  }

  .log_thread {
    font-weight: 600;
  }

  .trace_color {
    background: lighten($trace-color, 20);
  }

  .debug_color {
    background: lighten($debug-color, 10);
  }

  .warn_color {
    background: lighten($warn-color, 10);
  }

  .info_color {
    background: lighten($info-color, 10);
  }

  .error_color {
    background: lighten($error-color, 10);
  }

  .fatal_color {
    background: red;
  }
</style>