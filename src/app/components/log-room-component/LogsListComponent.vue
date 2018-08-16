<template>
  <div>
    <p v-for="(log, index) in logsData" :key="index" class="list-item">
      <b style="font-size: 22px;">{{log.seqNumber}}</b>
      <!--{{formattedTimestamp(log.timestamp)}} | {{log.level}} | {{log.thread}} | {{log.tag}}: {{log.message}}-->
    </p>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
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
        'setNewLogAction'
      ]),
      formattedTimestamp(timestampData) {
        return formattedTimestampUtil(timestampData);
      }
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