<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="物料备注" name="getmaterialRemark">
        <materialRemark v-if="isFabric"></materialRemark>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import materialRemark from "./materialRemark/Index";
export default {
  name: "materialsRemark",
  data() {
    return {
      activeName: 'getmaterialRemark',
      isFabric: true
    };
  },
  components: {
    materialRemark
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getmaterialRemark':
          this.isFabric = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>