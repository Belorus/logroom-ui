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
          <h3>{{session.name}}</h3>
          <p>Archived: {{session.archived}}</p>
          <p>ID: {{session.id}}</p>
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
  .box-card h3 {
    margin-top: 0;
  }
</style>