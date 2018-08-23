<template>
  <div class="main_sidebar">
    <div class="sidebar_inner">
      <el-row class="sidebar_section">
        <session-details :sessionId="currentSessionId"></session-details>
      </el-row>
      <el-row class="sidebar_section">
        <el-button type="success" @click="downloadLogFile">Download Log File</el-button>
      </el-row>
      {{downloadUrl}}
      <a href="" target="_blank" ref="downloadLinkElement" class="download_link"></a>
    </div>
  </div>
</template>

<script>
  import SessionDetailsComponent from "../../components/session-details/SessionDetailsComponent";
  import {httpWrapper} from "../../http/http-wrapper";

  export default {
    data() {
      return {
        currentSessionId: null,
        downloadUrl: null,
        downloadLinkElement: HTMLElement
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
        httpWrapper.getLogsFile(this.currentSessionId, (url)=> {
            this.$refs.downloadLinkElement.href = url;
            this.$refs.downloadLinkElement.click();
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
  .download_link {
    opacity: 0;
    width: 0;
    height: 0;
  }
</style>