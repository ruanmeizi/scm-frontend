<template>
  <div class="priceList nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="现货采购价单" name="spotPriceList">
        <spotPriceList v-if="isSpot"></spotPriceList>
      </el-tab-pane>
      <el-tab-pane label="期货采购价单" name="futuresPriceList">
        <futuresPriceList v-if="isFutures"></futuresPriceList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import spotPriceList from "./spotPriceList/Index";
import futuresPriceList from "./futuresPriceList/Index";
export default {
  name: "priceList",
  data() {
    return {
      activeName: 'spotPriceList',
      isSpot: true,
      isFutures: false
    };
  },
  components: {
    spotPriceList,
    futuresPriceList
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'spotPriceList':
          this.isSpot = true;
          this.isFutures = false;
          break;
        case 'futuresPriceList':
          this.isSpot = false;
          this.isFutures = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>