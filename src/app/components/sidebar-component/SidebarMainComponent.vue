<template>
  <div class="main_sidebar">
    <div class="sidebar_inner">
      <el-row class="sidebar_section">
        <session-details :sessionId="currentSessionId"></session-details>
        <el-button
          icon="el-icon-share"
          @click="copyToClipboard">
          Copy Session Link
        </el-button>
      </el-row>
      <el-row class="sidebar_section">
        <el-button icon="el-icon-download" type="success" @click="downloadLogFile">Download Log File</el-button>
      </el-row>
      <el-row class="sidebar_section">
        <div class="filters_options_wrapper">
          <el-checkbox-group v-model="checkedFilters" @change="handleCheckedFiltersChange">
            <el-checkbox v-for="filter in filters" :label="filter" :key="filter">{{filter}}</el-checkbox>
          </el-checkbox-group>
          <el-button size="small"
                     class="uncheck_btn"
                     @click="uncheckAllFilters"
                     v-if="checkedFilters.length > 0">
            Uncheck All
          </el-button>
        </div>
      </el-row>
      <el-row class="sidebar_section">
        <h4>Saved Markers</h4>
        <marker-list></marker-list>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {mapActions} from "vuex"
  import {Message} from "element-ui";
  import SessionDetailsComponent from "Components/session-details/SessionDetailsComponent";
  import MarkerListComponent from "Components/marker-list-component/MarkerListComponent";
  import {httpWrapper} from "Http/http-wrapper";
  import {
    TRACE_LOG_TYPE,
    DEBUG_LOG_TYPE,
    WARN_LOG_TYPE,
    INFO_LOG_TYPE,
    ERROR_LOG_TYPE
  } from "../../shared/config-util/config-util";

  const filterLogsOptions = [TRACE_LOG_TYPE, DEBUG_LOG_TYPE, WARN_LOG_TYPE, INFO_LOG_TYPE, ERROR_LOG_TYPE];

  export default {
    data() {
      return {
        checkAll: false,
        currentSessionId: null,
        checkedFilters: [],
        filters: filterLogsOptions
      }
    },
    components: {
      'session-details': SessionDetailsComponent,
      'marker-list': MarkerListComponent
    },
    created() {
      this.currentSessionId = this.$route.params.id;
    },
    methods: {
      ...mapActions({
        setLogsFilters: 'setLogsFilters'
      }),
      downloadLogFile() {
        httpWrapper.getLogsFile(this.currentSessionId);
      },
      handleCheckedFiltersChange(checkedFilters) {
        let selectedFilters = [];
        let checkedCount = checkedFilters.length;
        this.checkAll = checkedCount === this.filters.length;

        if (this.checkAll) {
          this.setLogsFilters([]);
        } else {
          selectedFilters = [];
          checkedFilters.map(filterValue => selectedFilters.push(filterValue));
          this.setLogsFilters(selectedFilters);
        }
      },
      uncheckAllFilters() {
        this.checkedFilters = [];
        this.setLogsFilters([]);
      },
      copyToClipboard: function () {
        const el = document.createElement('textarea');
        el.value = location.href;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.showCopyNotification();
      },
      showCopyNotification() {
        Message({
          showClose: true,
          center: true,
          message: 'Session link copied to clipboard.',
          type: 'success'
        });
      }
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
    .el-button {
      margin: 20px 0 10px;
    }
  }

  .filters_options_wrapper {
    display: inline-block;
    padding: 20px;
    .uncheck_btn {
      margin-top: 10px;
    }
  }

  .el-checkbox {
    width: 100%;
    display: inline-block;
    margin-bottom: 10px;
    margin-left: 0;
  }
</style>