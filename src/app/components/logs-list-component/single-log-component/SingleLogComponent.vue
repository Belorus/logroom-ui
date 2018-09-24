<template>
  <div :class="{is_odd: isOdd}"
       class="list_item">
    <span class="timestamp">
      {{formattedTimestamp(log.timestamp)}}
    </span>
    <span class="log_level"
          :class="{
            trace_color: isTrace,
            debug_color: isDebug,
            warn_color: isWarn,
            info_color: isInfo,
            error_color: isError
          }">
      {{log.level}}
    </span>
    <span class="log_thread"> - {{log.thread}}</span>
    |
    <p class="log_message"><span class="log_tag">{{log.tag}}:</span> {{log.message}}</p>
  </div>
</template>

<script>
  import {formattedTimestampUtil} from "Utils/utils";
  import {
    TRACE_LOG_TYPE,
    DEBUG_LOG_TYPE,
    WARN_LOG_TYPE,
    INFO_LOG_TYPE,
    ERROR_LOG_TYPE
  } from "../../../shared/config-util/config-util";

  export default {
    name: 'single-log',
    data() {
      return {
        currentLog: null
      }
    },
    props: {
      log: Object
    },
    computed: {
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
      }
    },
    methods: {
      formattedTimestamp(timestampData) {
        return formattedTimestampUtil(timestampData);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/variables";

  .list_item {
    display: inline-block;
    width: 100%;
    word-break: break-all;
    -webkit-margin-before: 0.2em;
    -webkit-margin-after: 0.2em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-family: monospace;
    font-size: 14px;
    line-height: 22px;
    border-radius: 3px;
  }

  .is_odd {
    background: #f9f9f9;
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
</style>