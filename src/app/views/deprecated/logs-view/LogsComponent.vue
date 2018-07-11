<template>
  <div class="content_wrapper">
    <el-row>
      <el-button
        type="info"
        icon="el-icon-loading"
        round
        @click="generateNewLines">
        generate lines
      </el-button>
      <el-button
        type="success"
        icon="el-icon-check"
        @click="getCount">
        get count
      </el-button>
    </el-row>

    <el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="data.length"
      :page-size="pageSize">
    </el-pagination>
    <div class="data_wrapper">
      <div style="width: 200px;float: left;">
        <p v-for="(line, index) in dislayedData" :key="line.num" @click="clLineData(line, line.num - 1)">{{line.num}} -- {{line.val}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  const PAGE_ITEMS_COUNT = 100;

  export default {
    data() {
      return {
        linesCount: 1,
        data: [{
          num:1,
          val:'first string'
        }],
        pageSize: PAGE_ITEMS_COUNT,
        dislayedData: [],
        selectedPage: 1
      }
    },
    created() {
      this.dislayedData = this.data;
    },
    methods: {
      generateNewLines() {
        let obj = {
          num: ++this.linesCount,
          val: 'another string'
        };
        this.data.push(obj);
        this.calculateDislayedData();
        if(this.linesCount < 1000) {
          this.generateNewLines();
        }
      },
      handleCurrentChange(val) {
        this.selectedPage = val;
        console.log(`current page: ${val}`);
        this.calculateDislayedData();
      },
      calculateDislayedData() {
        let reversedData = this.data.slice().reverse();
        let startIndex = (this.selectedPage-1)*PAGE_ITEMS_COUNT;
        let finalindex = (this.selectedPage-1)*PAGE_ITEMS_COUNT + PAGE_ITEMS_COUNT;
        this.dislayedData = reversedData.slice(startIndex, finalindex);
      },
      getCount() {
        console.warn(this.data.length, 'Length');
      },
      clLineData(line, index) {
        console.warn(`Line: ${index + 1}, `, line.val);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content_wrapper {
    padding: 20px 20px 0 20px;
  }
  .el-row {
    margin-bottom: 10px;
  }
</style>