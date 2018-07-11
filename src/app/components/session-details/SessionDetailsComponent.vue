<template>
  <div>
    <div class="details_wrapper" v-if="currentSessionDetailsData">
      <p class="session_title">
        <i class="el-icon-mobile-phone"></i>
        {{currentSessionDetailsData.name}}
      </p>
      <p class="session_data_text">
        <i><b>#</b></i>
        {{currentSessionDetailsData.id}}</p>
      <p class="session_data_text">
        <i class="el-icon-time"></i>
        Session Duration</p>
      <p class="session_data_text">
        <i class="el-icon-menu"></i>
        Device / OS</p>
      <p class="session_data_text">
        <i class="el-icon-mobile-phone"></i>
        Project / Version</p>
      <p class="session_data_text">
        <i class="el-icon-edit-outline"></i>
        TEST</p>
    </div>
    <div class="error_container" v-else>
      No session details avaliable!
    </div>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    props: {
      sessionId: Number
    },
    computed: {
      ...mapGetters({
        currentSessionDetailsData: 'getSessionDetailsGetter'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .session_title {
    font-size: 18px;
    i {
      margin-right: 10px;
    }
  }
  .session_data_text {
    font-size: 14px;
    padding-left: 20px;
    span {
      font-weight: bold;
      font-size: 16px;
    }
    i {
      width: 10px;
      margin-right: 10px;
    }
  }
</style>