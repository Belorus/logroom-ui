<template>
  <div>
    <div v-for="log in logsData" :key="log.seqNumber">
      <single-log :log="log"></single-log>
    </div>
  </div>
</template>

<script>
  import SingleLogComponent from "./single-log-component/SingleLogComponent";

  export default {
    props: {
      logsData: Array
    },
    components: {
      'single-log': SingleLogComponent
    }
  }
</script>