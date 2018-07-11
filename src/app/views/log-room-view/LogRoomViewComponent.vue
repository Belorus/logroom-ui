<template>
  <div>
    <header-component></header-component>

    <h2 v-if="isGetSessionsError">ERROR 2 GET SESSIONS</h2>
    <div v-else class="content_container">
      <sidebar-component :sessionId="currentSessionId"></sidebar-component>
      <div class="content_wrapper">
        <div class="content_inner" ref="scrollableInner">
          <log-room :logsData="logsData"></log-room>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {throttle} from "../../shared/utils/utils";
  import HeaderComponent from "../../components/header-component/HeaderComponent";
  import SidebarMainComponent from "../../components/sidebar-component/SidebarMainComponent";
  import LogRoomComponent from "../../components/log-room-component/LogRoomComponent";

  export default {
    data() {
      return {
        currentSessionId: null,
        scrollableInner: '',
        stepFromParent: 1,
        scrollTopDirectionMarker: 0
      }
    },
    components: {
      'header-component': HeaderComponent,
      'sidebar-component': SidebarMainComponent,
      'log-room': LogRoomComponent
    },
    created() {
      this.currentSessionId = +this.$route.params.id;
      let sessionIdData = {
        sessionId: this.currentSessionId
      };
      this.setActiveSessionId(sessionIdData);
      this.getLogsBySession(sessionIdData);
    },
    mounted() {
      this.scrollableInner = this.$refs['scrollableInner'];
      this.scrollableInner.addEventListener('scroll', throttle(this.handleLogsLoadOnScroll, 50));
    },
    computed: {
      ...mapGetters({
        isGetSessionsError: 'sessionsGetError',
        logsData: 'getSessionLogs',
        bufferedLogsLength: 'getBufferedLogsLength'
      })
    },
    methods: {
      ...mapActions([
        'setActiveSessionId',
        'getLogsBySession',
        'getLazyLogsFromBuffer'
      ]),
      handleLogsLoadOnScroll() {
        let scrollTop = this.scrollableInner.scrollTop;
        let clientHeight = this.scrollableInner.clientHeight;
        let scrollHeight = this.scrollableInner.scrollHeight;

        if(this.scrollTopDirectionMarker < scrollTop) {
          this.scrollTopDirectionMarker = scrollTop;
        }

        let isDirectionDown = this.scrollTopDirectionMarker <= scrollTop;

        if(isDirectionDown && scrollTop + clientHeight + 100 >= scrollHeight && this.logsData.length < this.bufferedLogsLength) {
          console.log('Load More!', this.logsData.length);
          this.getLazyLogsFromBuffer({logsStep: this.stepFromParent});
          this.stepFromParent++;
        }
        // console.log('Throttle Worked! ', scrollTop, clientTop, clientHeight, scrollHeight);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixins";
  @import "../../../assets/styles/variables";


  .content_container {
    position: absolute;
    @include display-flex;
    top: $header-height;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .content_wrapper {
    position: relative;
    width: calc(100vw - 300px);
    .content_inner {
      @include scrollable-inner;
      padding: 20px 20px 20px 30px;
    }
  }

</style>