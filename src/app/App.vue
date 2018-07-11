<template>
  <div class="main_container">
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapActions} from "vuex";

  export default {
    created() {
      this.getAllSessionsAction();
    },
    methods: {
      ...mapActions({
        getAllSessionsAction: 'getAllSessionsAction'
      })
    }
  }
</script>

<style lang="scss" scoped>

</style>