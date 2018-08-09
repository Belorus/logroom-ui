<template>
  <div>
    <div class="details_wrapper" v-if="sessionDetailsData">
      <h3>{{sessionDetailsData.additional.app_name}} - {{sessionDetailsData.additional.app_version}}</h3>
      <p class="session_id_title">ID: {{sessionDetailsData.id}}</p>

      <p>Branch: {{sessionDetailsData.additional.branch}}</p>
      <p>Device model: {{sessionDetailsData.additional.device_model}}</p>
      <p>Device name: {{sessionDetailsData.additional.device_name}}</p>
      <p>Environment: {{sessionDetailsData.additional.environment}}</p>
      <p>Login type: {{sessionDetailsData.additional.login_type}}</p>
      <p>OS: {{sessionDetailsData.additional.os}}. {{sessionDetailsData.additional.os_version}}</p>
      <p>User: #{{sessionDetailsData.additional.user_id}} - {{sessionDetailsData.additional.user_name}}</p>
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
      sessionId: String
    },
    computed: {
      ...mapGetters({
        getSessionDetailsByIdGetter: 'getSessionDetailsByIdGetter'
      }),
      sessionDetailsData() {
        return this.getSessionDetailsByIdGetter(this.sessionId);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .session_id_title {
    font-size: 12px;
  }
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