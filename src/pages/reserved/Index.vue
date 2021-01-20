<template>
  <div class="reserved nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="预留" name="decisionReserved">
      	<decisionReserved v-if="isReserved"></decisionReserved>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import decisionReserved from "./decisionReserved/Index";
export default {
  name: "reserved",
  data() {
    return {
      activeName: 'decisionReserved',
      isReserved: true,
    };
  },
  components: {
    decisionReserved
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'decisionReserved':
          this.isReserved = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>