<template>
  <div class="toolProduction nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="成品生产" name="finishedOrder"> -->
      <el-tab-pane label="面料转成衣" name="finishedOrder">
        <finishedOrder v-if="isPO"></finishedOrder>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import finishedOrder from "./finishedOrder/Index";
export default {
  name: "finishedProduction",
  data() {
    return {
      activeName: 'finishedOrder',
      isPO: true
    };
  },
  components: {
    finishedOrder
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'finishedOrder':
          this.isPO = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>