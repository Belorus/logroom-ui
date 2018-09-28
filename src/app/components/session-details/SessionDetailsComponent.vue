<template>
  <div>
    <div class="details_wrapper" v-if="sessionDetailsData">
      <h3>{{sessionDetailsData.additional.app_name}} - {{sessionDetailsData.additional.app_version}}</h3>
      <p class="session_id_title">
        <span>#ID</span>: {{sessionDetailsData.id}}
      </p>

      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        Branch: <span>{{sessionDetailsData.additional.branch}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        Device model: <span>{{sessionDetailsData.additional.device_model}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        Device name: <span>{{sessionDetailsData.additional.device_name}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        Environment: <span>{{sessionDetailsData.additional.environment}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        Login type: <span>{{sessionDetailsData.additional.login_type}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        OS: <span>{{sessionDetailsData.additional.os}}. {{sessionDetailsData.additional.os_version}}</span>
      </p>
      <p class="data_title"
         :class="{text_ellipsis: !isLogroomPage}">
        User: <span>#{{sessionDetailsData.additional.user_id}} - {{sessionDetailsData.additional.user_name}}</span>
      </p>
    </div>
    <div class="error_container" v-else>
      No session details avaliable!
    </div>
  </div>
</template>

<script>
  import {LOG_ROOM_PAGE} from "../../router/pages";
  import {httpWrapper} from "Http/http-wrapper";
  import {mapGetters} from "vuex";

  export default {
    props: {
      sessionId: null
    },
    data() {
      return {
        sessionDetailsData: null
      }
    },
    mounted() {
      if (!this.isLogroomPage) {
        this.sessionDetailsData = this.getSessionDetailsByIdGetter(this.sessionId);
      } else {
        this.getSessionDataDetails();
      }
    },
    watch: {
      sessionDetailsDataGetter: function (val) {
        this.sessionDetailsData = val;
      }
    },
    computed: {
      ...mapGetters({
        getSessionDetailsByIdGetter: 'getSessionDetailsByIdGetter'
      }),
      sessionDetailsDataGetter() {
        return this.getSessionDetailsByIdGetter(this.sessionId);
      },
      isLogroomPage() {
        return this.$route.name === LOG_ROOM_PAGE;
      }
    },
    methods: {
      getSessionDataDetails() {
        httpWrapper.getSessionDetailsHttp(this.sessionId, (sessionData) => {
          this.sessionDetailsData = sessionData;
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixins";

  .session_id_title {
    font-size: 12px;
    height: 20px;
    @include text-ellipsis;
    span {
      font-size: 14px;
      font-weight: bold;
    }
  }

  .text_ellipsis {
    @include text-ellipsis;
  }

  .data_title {
    font-size: 12px;
    span {
      font-size: 14px;
      font-weight: 600;
    }
  }
</style>