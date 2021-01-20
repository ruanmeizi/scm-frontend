<template>
  <div class="advanceReceiptManage nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="预收货清单管理" name="advanceReceipt">
        <advanceReceipt v-if="isAdvanceReceipt"></advanceReceipt>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import advanceReceipt from "./advanceReceipt/Index";
export default {
  name: "advanceReceiptManage",
  data() {
    return {
      activeName: 'advanceReceipt',
      isAdvanceReceipt: true
    };
  },
  components: {
    advanceReceipt
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      // console.log(tab);
      switch (tab.name) {
        case 'advanceReceipt':
          this.isAdvanceReceipt = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>