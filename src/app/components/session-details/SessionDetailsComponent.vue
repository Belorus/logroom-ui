<template>
  <div>
    <div class="details_wrapper" v-if="currentSessionDetailsData">
      <h3>{{currentSessionDetailsData.additional.app_name}}</h3>
      <p>ID: {{currentSessionDetailsData.id}}</p>

      <p>App Version: {{currentSessionDetailsData.additional.app_version}}</p>
      <p>Branch: {{currentSessionDetailsData.additional.branch}}</p>
      <p>Device model: {{currentSessionDetailsData.additional.device_model}}</p>
      <p>Device name: {{currentSessionDetailsData.additional.device_name}}</p>
      <p>Environment: {{currentSessionDetailsData.additional.environment}}</p>
      <p>Login type: {{currentSessionDetailsData.additional.login_type}}</p>
      <p>OS: {{currentSessionDetailsData.additional.os}}</p>
      <p>OS version: {{currentSessionDetailsData.additional.os_version}}</p>
      <p>User Id: {{currentSessionDetailsData.additional.user_id}}</p>
      <p>User Name: {{currentSessionDetailsData.additional.user_name}}</p>
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