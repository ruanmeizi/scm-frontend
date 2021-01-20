<template>
  <div class="SCMStrategy box nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="职业装销售预测参数" name="business">
        <BAPrediction v-if="isBusiness"></BAPrediction>
      </el-tab-pane>
      <el-tab-pane label="零剪销售预测参数" name="zerocut">
        <ZCPrediction v-if="isZerocut"></ZCPrediction>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import BAPrediction from "./BAPrediction/Index";
import ZCPrediction from "./ZCPrediction/Index";
export default {
  name: "SCMStrategy",
  data() {
    return {
      activeName: 'business',
      subName: 'Draft',
      isBusiness: true,
      isZerocut: true,
      navList: [
        {
          value: "business",
          name: "职业装销售预测参数"
        },
        {
          value: "ZCPrediction",
          name: "零剪销售预测参数"
        }
      ]
    };
  },
  components: {
    BAPrediction,
    ZCPrediction
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      // console.log(tab);
      switch (tab.name) {
        case 'business':
          this.isBusiness = true;
          this.isZerocut = false;
          break;
        case 'zerocut':
          this.isBusiness = false;
          this.isZerocut = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>