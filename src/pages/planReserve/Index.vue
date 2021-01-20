<template>
  <div class="planReserve nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="计划预留" name="reserveName">
        <reserve v-if="isReserve"></reserve>
      </el-tab-pane>
      <!-- <el-tab-pane label="预售订单看板" name="presaleOrder">
        <presaleOrder v-if="isPresaleOrder"></presaleOrder>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import reserve from "./reserve/Index";
import presaleOrder from "./presaleOrder/Index";
export default {
  name: "planReserve",
  data() {
    return {
      activeName:'reserveName',
      isReserve: true,
      isPresaleOrder: false,
    };
  },
  components: {
    reserve,
    presaleOrder
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'reserveName':
          this.isReserve = true;
          break;
        case 'presaleOrder':
          this.isPresaleOrder = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>