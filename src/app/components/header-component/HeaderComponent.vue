<template>
  <div class="header">
    <div class="nav_btn_container">
      <el-button plain
                 size="mini"
                 icon="el-icon-d-arrow-left"
                 @click="navToActiveSessions">
        Back to active sessions
      </el-button>
    </div>
    <div class="logo">Log Room</div>
    <contacts-component></contacts-component>
  </div>
</template>

<script>
  import {ACTIVE_SESSIONS_PAGE} from "../../router/pages";
  import ContactsComponent from "Components/contacts-component/ContactsComponent";

  export default {
    components: {
      'contacts-component': ContactsComponent
    },
    methods: {
      navToActiveSessions() {
        this.$router.push({name: ACTIVE_SESSIONS_PAGE});
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";
  @import "../../../assets/styles/mixins";

  .header {
    position: relative;
    z-index: 900;
    @include display-flex;
    justify-content: center;
    height: $header-height;
    border-bottom: 1px solid #e6e6e6;
    @include header-shadow;
    .logo {
      font-size: 24px;
      font-weight: 500;
      line-height: $header-height;
    }
  }

  .nav_btn_container {
    position: absolute;
    left: 20px;
    height: $header-height;
    @include display-flex;
    align-items: center;
  }
</style>