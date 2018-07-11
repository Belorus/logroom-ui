<template>
  <div>
    <h3>Logs Sync Component</h3>
    <el-button type="primary" icon="el-icon-printer" plain @click="generateMoreCats">Generate More Cats</el-button>
    <el-button type="primary" icon="el-icon-printer" plain @click="generateMoreCats">Add 10 More Cats</el-button>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="catsData.length"
      :page-size="pageSize">
    </el-pagination>
    <div class="card_wrapper" v-for="cat in catsToDisplay">
      <el-card :body-style="{ padding: '0px' }">
        <img :src="cat.pic" class="image">
        <span>Cat is looking - {{cat.num}}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';

  const PIC_URL = 'https://www.bluecross.org.uk/sites/default/files/assets/images/124044lpr.jpg';
  const PAGE_ITEMS_COUNT = 1000;
  const LOAD_STEP_SIZE = 10;

  export default {
    data() {
      return {
        pageSize: PAGE_ITEMS_COUNT,
        catsData: [{
          name: 'Cat Name',
          pic: PIC_URL,
          num: 1
        }],
        selectedPage: 1,
        loadStepIteration:0,
        catsToDisplay: [],
        catsToBuffer: [],
        currentDate: new Date()
      }
    },
    mounted() {
      this.catsToDisplay = this.catsData;
      this.throttleScroll();
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val);
        this.selectedPage = val;
        this.calculateDislayedData();
      },
      generateMoreCats() {
        let catsCount = this.catsData.length;
        let newCat = {
          name: 'new Cat',
          pic: PIC_URL,
          num: ++catsCount
        };
        this.catsData.push(newCat);
        this.calculateDislayedData();
        if(catsCount < 5000) {
          this.generateMoreCats();
        }
      },
      calculateDislayedData() {
        let reversedData = this.catsData;
        let startIndex = (this.selectedPage-1)*PAGE_ITEMS_COUNT;
        let finalindex = (this.selectedPage-1)*PAGE_ITEMS_COUNT + PAGE_ITEMS_COUNT;
        this.catsToDisplay = reversedData.slice(startIndex, finalindex);
      },
      handleThrottle() {
        let iter = this.loadStepIteration;
        return _.debounce(() => {
          iter++;
          console.log(iter, ' - ScrollS Throttled');
        }, 200)
      }
      ,
      throttleScroll() {
        window.addEventListener('scroll', this.handleThrottle());
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card_wrapper {
    width: 150px;
    height: 130px;
    float: left;
    margin-right: 15px;
    margin-bottom: 20px;
    .image {
      width: 150px;
    }
  }
  .el-button {
    margin-bottom: 20px;
  }
</style>