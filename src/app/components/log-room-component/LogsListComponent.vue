<template>
  <div>
    <p v-for="(log, index) in logsData" :key="index" class="list-item">
      {{formattedTimestamp(log.timestamp)}} | {{log.level}} | {{log.thread}} | {{log.tag}}: {{log.message}}
    </p>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  import {LOGS_STEP_COUNT} from "../../shared/logs-count-util/logs-count-util";
  import {formattedTimestampUtil} from "../../shared/utils/utils";

  export default {
    props: {
      logsData: Array
    },
    data() {
      return {
        lazyLogsStep: 1
      }
    },
    methods: {
      ...mapActions([
        'setNewLogAction',
        'getLazyLogsFromBuffer'
      ]),
      formattedTimestamp(timestampData) {
        return formattedTimestampUtil(timestampData);
      },
      /**
       * TODO handle fwd/bkwd logs loading from store buffer
       */
      // getFewMoreLogsFromBuffer() {
      //
      //   console.log('get from buffer', LOGS_STEP_COUNT);
      //   this.getLazyLogsFromBuffer({logsStep: this.lazyLogsStep});
      //   ++this.lazyLogsStep;
      // }
    }
  }
</script>

<style lang="scss" scoped>

  .list-item {
    -webkit-margin-before: 0.4em;
    -webkit-margin-after: 0.4em;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
    font-family: monospace;
    font-size: 11pt;
  }
</style>