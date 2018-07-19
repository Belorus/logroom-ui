<template>
  <div>
    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <el-row :gutter="20"
            v-else>
      <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
              v-for="session in activeSessions"
              :key="session.id">
        <el-card
          class="box-card">
          <h3>{{session.additional.app_name}}</h3>
          <p>ID: {{session.id}}</p>

          <p>App Version: {{session.additional.app_version}}</p>
          <p>Branch: {{session.additional.branch}}</p>
          <p>Device model: {{session.additional.device_model}}</p>
          <p>Device name: {{session.additional.device_name}}</p>
          <p>Environment: {{session.additional.environment}}</p>
          <p>Login type: {{session.additional.login_type}}</p>
          <p>OS: {{session.additional.os}}</p>
          <p>OS version: {{session.additional.os_version}}</p>
          <p>User Id: {{session.additional.user_id}}</p>
          <p>User Name: {{session.additional.user_name}}</p>
          <el-button type="primary" @click="navToLogRoom(session.id)">Connect To Session</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {LOG_ROOM_PAGE} from "../../router/pages";
  import NavigationComponent from "../../components/navigation/NavigationComponent";

  export default {
    components: {
      'navigation-component': NavigationComponent
    },
    computed: {
      ...mapGetters({
        activeSessions: 'getActiveSessions',
        isGetSessionsError: 'sessionsGetError'
      })
    },
    methods: {
      navToLogRoom(sessionId) {
        this.$router.push({name: LOG_ROOM_PAGE, params: {id: sessionId}});
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-col {
    margin-bottom: 20px;
  }
  .box-card {
    h3 {
      margin-top: 0;
    }
    p {
      margin: 10px 0;
    }
  }
</style>