<template>
  <div class="goDown nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="入库差异" name="goDownDifference">
        <goDownDifference v-if="isGoDownDifference"></goDownDifference>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import goDownDifference from "./goDownDifference/Index";
export default {
  name: "goDown",
  data() {
    return {
      activeName: 'goDownDifference',
      isGoDownDifference: true
    };
  },
  components: {
    goDownDifference
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'goDownDifference':
          this.isGoDownDifference = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>