<template>
  <div>
    <h3>Store Data View Component</h3>
    <el-button type="success" @click="storeIncrementCount">Increment</el-button>
    <el-button type="success" @click="storeIncrementBy10Count">Increment by 10</el-button>
    <h2>{{getIncrementValue}}</h2>

    <p v-for="todo in doneTodosData">{{todo}}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      storeIncrementCount() {
        this.$store.commit('increment');
      },
      storeIncrementBy10Count() {
        this.$store.dispatch('incrementAsync', {
          amount: 10
        });
      }
    },
    computed: {
      getIncrementValue() {
        return this.$store.state.count * 2;
      },
      todosData() {
        return this.$store.state.todos;
      },
      doneTodosData() {
        return this.$store.getters.doneTodos;
      }
    }
  }
</script>