<template>
  <div>
    <navigation-component></navigation-component>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavigationComponent from "../navigation/NavigationComponent"

  export default {
    components: {
      'navigation-component': NavigationComponent
    }
  }
</script>