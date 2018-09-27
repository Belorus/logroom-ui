<template>
  <div class="sessions_container">
    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <el-row :gutter="20" v-else style="margin: 0 20px;">
      <div class="filters_block">
        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="2">
        <el-select
          v-model="gamesNameModel"
          multiple
          collapse-tags
          placeholder="Select Games">
          <el-option
            v-for="name in gamesNames"
            :key="name"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
        </el-col>

        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="2">
        <el-select
          v-model="gamesVersionModel"
          multiple
          collapse-tags
          placeholder="Select Versions">
          <el-option
            v-for="name in gamesVersions"
            :key="name"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
        </el-col>

        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="2">
        <el-select
          v-model="gamesDeviceModel"
          multiple
          collapse-tags
          placeholder="Select Devices">
          <el-option
            v-for="name in gamesDevices"
            :key="name"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
        </el-col>

        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="2">
        <el-select
          v-model="gamesDeviceNameModel"
          multiple
          collapse-tags
          placeholder="Select Device Name">
          <el-option
            v-for="name in devicesNames"
            :key="name"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
        </el-col>

        <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="2">
        <el-select
          v-model="gamesBranchModel"
          multiple
          collapse-tags
          placeholder="Select Device Branch">
          <el-option
            v-for="name in devicesBranches"
            :key="name"
            :label="name"
            :value="name">
          </el-option>
        </el-select>
        </el-col>
      </div>
    </el-row>

    <el-row :gutter="20" v-if="!isGetSessionsError" style="margin: 0 20px;">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
              v-for="session in filteredSessionsReactive" :key="session.id">
        <el-card class="box-card">
          <session-details v-if="session.id" :sessionId="session.id"></session-details>
          <el-button type="primary" @click="navToLogRoom(session.id)">Connect To Session</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {LOG_ROOM_PAGE} from "../../router/pages";
  import NavigationComponent from "Components/navigation/NavigationComponent";
  import SessionDetailsComponent from "Components/session-details/SessionDetailsComponent";

  const APP_NAME_FIELD = 'app_name';
  const APP_VERSION_FIELD = 'app_version';
  const DEVICE_MODEL_FIELD = 'device_model';
  const DEVICE_NAME_FIELD = 'device_name';
  const DEVICE_BRANCH_FIELD = 'branch';

  export default {
    data() {
      return {
        gamesNameModel: [],
        gamesVersionModel: [],
        gamesDeviceModel: [],
        gamesDeviceNameModel: [],
        gamesBranchModel: [],
        filteredSessionsReactive: []
      }
    },
    components: {
      'navigation-component': NavigationComponent,
      'session-details': SessionDetailsComponent
    },
    watch: {
      activeSessions: function () {
        this.initFilteredSessions();
      },
      gamesNameModel: function () {
        this.calculateFilterSessions();
      },
      gamesVersionModel: function () {
        this.calculateFilterSessions();
      },
      gamesDeviceModel: function () {
        this.calculateFilterSessions();
      },
      gamesDeviceNameModel: function () {
        this.calculateFilterSessions();
      },
      gamesBranchModel: function () {
        this.calculateFilterSessions();
      }
    },
    mounted() {
      this.initFilteredSessions();
    },
    computed: {
      ...mapGetters({
        activeSessions: 'getActiveSessions',
        isGetSessionsError: 'sessionsGetError'
      }),
      gamesNames() {
        return this.getFilteringOptions(APP_NAME_FIELD);
      },
      gamesVersions() {
        return this.getFilteringOptions(APP_VERSION_FIELD);
      },
      gamesDevices() {
        return this.getFilteringOptions(DEVICE_MODEL_FIELD);
      },
      devicesNames() {
        return this.getFilteringOptions(DEVICE_NAME_FIELD);
      },
      devicesBranches() {
        return this.getFilteringOptions(DEVICE_BRANCH_FIELD);
      },
    },
    methods: {
      navToLogRoom(sessionId) {
        this.$router.push({name: LOG_ROOM_PAGE, params: {id: sessionId}});
      },
      initFilteredSessions() {
        this.filteredSessionsReactive = this.activeSessions.sort(this.compareByTimeCreated);
      },
      getFilteringOptions(optionFieldName) {
        let optionsToReturn = [];
        if(this.filteredSessionsReactive.length > 0) {
          this.filteredSessionsReactive.map(session => {
            let optionName = session.additional[optionFieldName];
            if (!optionsToReturn.includes(optionName)) {
              optionsToReturn.push(optionName)
            }
          });
        }
        return optionsToReturn;
      },
      calculateFilterSessions() {
        this.filteredSessionsReactive = this.activeSessions;

        this.filterByField(this.gamesNameModel, APP_NAME_FIELD);
        this.filterByField(this.gamesVersionModel, APP_VERSION_FIELD);
        this.filterByField(this.gamesDeviceModel, DEVICE_MODEL_FIELD);
        this.filterByField(this.gamesDeviceNameModel, DEVICE_NAME_FIELD);
        this.filterByField(this.gamesBranchModel, DEVICE_BRANCH_FIELD);
      },
      filterByField(filteringModel, optionFieldName) {
        if(filteringModel.length > 0) {
          this.filteredSessionsReactive = this.filteredSessionsReactive
            .filter(session => filteringModel.includes(session.additional[optionFieldName]));
        }
      },
      compareByTimeCreated(a, b) {
        const createdAtA = a.createdAt;
        const createdAtB = b.createdAt;

        let comparison = 0;
        if (createdAtA > createdAtB) {
          comparison = -1;
        } else if (createdAtA < createdAtB) {
          comparison = 1;
        }
        return comparison;
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .sessions_container {
    padding-bottom: $footer-height;
  }
  .filters_block {
    margin-bottom: 20px;
    .el-select {
      margin-right: 10px;
      &:first-child {
        margin-left: 10px;
      }
    }
  }
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