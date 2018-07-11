<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item :index="ACTIVE_SESSIONS_PAGE"><i class="el-icon-view"></i>Active Sessions</el-menu-item>
      <el-menu-item :index="ARCHIVE_SESSIONS_PAGE"><i class="el-icon-tickets"></i>All Sessions</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  import {ACTIVE_SESSIONS_PAGE, ARCHIVE_SESSIONS_PAGE} from "../../router/pages";

  export default {
    data() {
      return {
        activeIndex: '',
        ACTIVE_SESSIONS_PAGE: ACTIVE_SESSIONS_PAGE,
        ARCHIVE_SESSIONS_PAGE: ARCHIVE_SESSIONS_PAGE
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({name: key});
      }
    },
    created() {
      this.activeIndex = this.$route.name;
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixins";

  .el-menu-demo {
    position: relative;
    z-index: 900;
    margin-bottom: 20px;
    @include header-shadow;
  }
</style>