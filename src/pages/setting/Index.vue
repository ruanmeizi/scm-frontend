<template>
  <div class="setting nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="库位设置" name="subInventory" :style="{height: fullHeight + 'px'}"> -->
      <el-tab-pane label="库位设置" name="subInventory">
        <subInventory v-if="isSubInventory"></subInventory>
      </el-tab-pane>
      <el-tab-pane label="销售订单库位设置" name="salesOrder">
        <salesOrder v-if="isSalesOrder"></salesOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import subInventory from "./subInventorySetting/Index";
import salesOrder from './salesOrder/Index';
export default {
  name: "setting",
  data() {
    return {
      activeName: 'subInventory',
      isSubInventory: true,
      isSalesOrder: true,
      fullHeight: document.documentElement.clientHeight - 154, //内容区域高度 = 当前屏幕高度 - 头部高度 - 底部高度
    };
  },
  components: {
    subInventory,
    salesOrder
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'subInventory':
          this.isSubInventory = true;
          this.isSalesOrder = false;
          break;
        case 'salesOrder':
          this.isSubInventory = false;
          this.isSalesOrder = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>