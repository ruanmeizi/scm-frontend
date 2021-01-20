<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="物料库存查询" name="getMaterialInventory">
        <materialInventory v-if="isFabric"></materialInventory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import materialInventory from "./materialInventory/Index";
export default {
  name: "materialQuery",
  data() {
    return {
      activeName: 'getMaterialInventory',
      isFabric: true
    };
  },
  components: {
    materialInventory
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getMaterialInventory':
          this.isFabric = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>