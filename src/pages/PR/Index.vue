<template>
  <div class="purchaseRequisition nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="申请采购" name="purchaseRequisition">
        <purchaseRequisition v-if="isPurchaseRequisition"></purchaseRequisition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import purchaseRequisition from "./purchaseRequisition/Index";
export default {
  name: "PR",
  data() {
    return {
      activeName: 'purchaseRequisition',
      isPurchaseRequisition: true
    };
  },
  components: {
    purchaseRequisition
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'purchaseRequisition':
          this.isPurchaseRequisition = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>