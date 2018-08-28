<template>
  <div class="main_sidebar">
    <div class="sidebar_inner">
      <el-row class="sidebar_section">
        <session-details :sessionId="currentSessionId"></session-details>
        <el-button
          icon="el-icon-share"
          @click="copyToClipboard">
          Copy Session Link
        </el-button>
      </el-row>
      <el-row class="sidebar_section">
        <el-button icon="el-icon-download" type="success" @click="downloadLogFile">Download Log File</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {Message} from 'element-ui';
  import SessionDetailsComponent from "../../components/session-details/SessionDetailsComponent";
  import {httpWrapper} from "../../http/http-wrapper";

  export default {
    data() {
      return {
        currentSessionId: null
      }
    },
    components: {
      'session-details':SessionDetailsComponent
    },
    created() {
      this.currentSessionId = this.$route.params.id;
    },
    methods: {
      downloadLogFile() {
        httpWrapper.getLogsFile(this.currentSessionId);
      },
      copyToClipboard: function() {
        const el = document.createElement('textarea');
        el.value = location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.showCopyNotification();
      },
      showCopyNotification() {
        Message({
          showClose: true,
          center: true,
          message: 'Session link copied to clipboard.',
          type: 'success'
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";
  @import "../../../assets/styles/mixins";

  .main_sidebar {
    position: relative;
    width: $main-sidebar-width;
    border-right: 1px solid #e6e6e6;
    @include sidebar-shadow;
    .sidebar_inner {
      @include scrollable-inner;
      padding: 20px;
    }
  }
  .sidebar_section {
    margin: 10px 0 0 0;
    border-top: 1px solid #e6e6e6;
    &:first-child {
      border-top: none;
    }
    .el-button {
      margin-top: 20px;
    }
  }
</style>