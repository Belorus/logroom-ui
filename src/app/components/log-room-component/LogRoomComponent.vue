<template>
  <div>
    <el-row>
      <el-button type="primary" size="medium" plain @click="postNewLog">Post New log</el-button>
    </el-row>
    <div>
      <p v-for="log in logsData" :key="log.id">{{log.content}} -- {{log.id}} -- {{log.session_related}}</p>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex";
  import {httpWrapper} from "../../http/http-wrapper";
  import {LOGS_STEP_COUNT} from "../../shared/logs-count-util/logs-count-util";

  export default {
    props: {
      logsData: Array
    },
    data() {
      return {
        step: 0,
        lazyLogsStep: 1
      }
    },
    methods: {
      ...mapActions([
        'setNewLogAction',
        'getLazyLogsFromBuffer'
      ]),
      postNewLog() {
        /**
         * TODO handle post log 4 test
         */
        // httpWrapper.postNewLog(newLogData => {
        //   this.setNewLogAction({logData: newLogData});
        // });
        httpWrapper.getDockerConnected();
      },
      postLogsRecursively() {
        if (this.step < 400) {
          this.step++;
          this.postNewLog();
          setTimeout(() => {
            this.postLogsRecursively();
          }, 50)
        } else {
          this.step = 0;
        }
      },
      getFewMoreLogsFromBuffer() {
        /**
         * TODO handle fwd/bkwd logs loading from store buffer
         */
        console.log('get from buffer', LOGS_STEP_COUNT);
        // this.getLazyLogsFromBuffer({logsStep: this.lazyLogsStep});
        // ++this.lazyLogsStep;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";
  @import "../../../assets/styles/mixins";

  .el-row {
    margin-bottom: 5px;
  }

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