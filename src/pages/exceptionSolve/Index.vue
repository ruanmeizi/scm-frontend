<template>
  <div class="exception nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="到货差异" name="arrivalDifference">
        <arrivalDifference v-if="isArrivalDifference"></arrivalDifference>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import arrivalDifference from "./arrivalDifference/Index";
export default {
  name: "exception",
  data() {
    return {
      activeName: 'arrivalDifference',
      isArrivalDifference: true
    };
  },
  components: {
    arrivalDifference
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'arrivalDifference':
          this.isArrivalDifference = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>