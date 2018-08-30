<template>
  <div class="table_wrapper">
    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <el-table
      v-else
      :data="allSessions"
      stripe
      height="100%"
      style="width: 100%">
      <el-table-column
        label="Name"
        width="180">
        <template  slot-scope="scope">
          <p style="padding-left: 20px;color: green;">{{scope.row.name}}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="archived"
        label="Active"
        width="180">
        <template slot-scope="scope">
          <p :class="{inactive_text: scope.row.archived}" class="active_text">{{scope.row.archived ? 'Inactive' : 'Active'}}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions">
        <template slot-scope="scope">
          <el-button @click="navToLogRoom(scope.row.id)" plain size="mini">Get Session Logs</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {LOG_ROOM_PAGE} from "../../router/pages";
  import NavigationComponent from "Components/navigation/NavigationComponent";

  export default {
    components: {
      'navigation-component': NavigationComponent
    },
    computed: {
      ...mapGetters({
        allSessions: 'getAllSessionsGetter',
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
  @import "../../../assets/styles/variables";

  .table_wrapper {
    position: absolute;
    top: $header-height;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .active_text {
    color: limegreen;
  }
  .inactive_text {
    color: indianred;
  }
</style>