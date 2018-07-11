<template>
  <div class="main_sidebar">
    <div class="sidebar_inner">
      <el-row class="sidebar_section">
        <session-details :sessionId="sessionId"></session-details>
      </el-row>
      <el-row class="sidebar_section">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid consequuntur cum, est hic ipsam quia ratione. Aliquam aspernatur at autem dolore dolorum ea esse excepturi ipsum, libero magni odit praesentium, quo saepe veniam voluptatum.</p>
      </el-row>
      <el-row class="sidebar_section">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid consequuntur cum, est hic ipsam quia ratione. Aliquam aspernatur at autem dolore dolorum ea esse excepturi ipsum, libero magni odit praesentium, quo saepe veniam voluptatum.</p>
      </el-row>
    </div>
  </div>
</template>

<script>
  import SessionDetailsComponent from "../../components/session-details/SessionDetailsComponent";
  export default {
    components: {
      'session-details':SessionDetailsComponent
    },
    props: {
      sessionId: Number
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