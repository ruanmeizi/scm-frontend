<template>
  <div class="purchasePlan nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="职业装采购计划" name="BAStockPlan">
        <BAStockPlan v-if="isBA"></BAStockPlan>
      </el-tab-pane>
      <el-tab-pane label="零剪采购计划" name="ZCStockPlan">
        <ZCStockPlan v-if="isZC"></ZCStockPlan>
      </el-tab-pane>
      <!-- <el-tab-pane label="新品采购计划" name="NewStockPlan">
        <NewStockPlan v-if="isNew"></NewStockPlan>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import BAStockPlan from "./BAStockPlan/Index";
import ZCStockPlan from "./ZCStockPlan/Index";
// import NewStockPlan from "./NewStockPlan/Index";
export default {
  name: "purchasePlan",
  data() {
    return {
      activeName: 'BAStockPlan',
      isBA: true,
      isZC: false,
      // isNew: false
    };
  },
  components: {
    BAStockPlan,
    ZCStockPlan
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      // console.log(tab);
      switch (tab.name) {
        case 'BAStockPlan':
          this.isBA = true;
          break;
        case 'ZCStockPlan':
          this.isZC = true;
          break;
        // case 'NewStockPlan':
        //   this.isNew = true;
        //   break;
        default:
          break;
      }
    }
  }
};
</script>