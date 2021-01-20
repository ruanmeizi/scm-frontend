<template>
  <div class="toolProduction nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="销售工具生产" name="productionOrder"> -->
      <el-tab-pane label="样本画册" name="productionOrder">
        <productionOrder v-if="isPO"></productionOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import productionOrder from "./productionOrder/Index";
export default {
  name: "toolProduction",
  data() {
    return {
      activeName: 'productionOrder',
      isPO: true
    };
  },
  components: {
    productionOrder
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'productionOrder':
          this.isPO = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>