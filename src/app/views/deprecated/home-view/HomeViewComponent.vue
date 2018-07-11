<template>
  <div>
    <h3>Home Page Component!</h3>
    <h2>{{getIncrementValue}}</h2>
    <el-button
      type="success"
      icon="el-icon-check"
      @click="getDocker">
      get count
    </el-button>
  </div>
</template>

<script>
  import {httpWrapper} from "../../../http/http-wrapper";

  export default {
    data() {
      return {

      }
    },
    methods: {
      getDocker() {
        console.log('DOCKER');
        httpWrapper.getDockerConnected();
      }
    },
    computed: {
      getIncrementValue() {
        return this.$store.state.count;
      }
    }
  }
</script>