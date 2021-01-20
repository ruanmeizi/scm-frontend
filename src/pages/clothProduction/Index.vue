<template>
  <div class="clothProduction nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="面料生产" name="PPR"> -->
      <el-tab-pane label="坯布纱线转面料" name="PPR">
        <PPR v-if="isPPR"></PPR>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PPR from "./PPR/Index";
export default {
  name: "clothProduction",
  data() {
    return {
      activeName: 'PPR',
      isPPR: true
    };
  },
  components: {
    PPR
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'PPR':
          this.isPPR = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>