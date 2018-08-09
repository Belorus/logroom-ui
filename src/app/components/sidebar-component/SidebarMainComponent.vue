<template>
  <div class="main_sidebar">
    <div class="sidebar_inner">
      <el-row class="sidebar_section">
        <session-details :sessionId="currentSessionId"></session-details>
      </el-row>
    </div>
  </div>
</template>

<script>
  import SessionDetailsComponent from "../../components/session-details/SessionDetailsComponent";

  export default {
    data() {
      return {
        currentSessionId: null,
      }
    },
    components: {
      'session-details':SessionDetailsComponent
    },
    created() {
      this.currentSessionId = this.$route.params.id;
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
  }
</style>