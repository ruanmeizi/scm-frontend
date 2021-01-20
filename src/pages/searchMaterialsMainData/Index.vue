<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="面料物料主数据维护" name="getfabricMaterials">
        <fabricMaterials v-if="isFabric"></fabricMaterials>
      </el-tab-pane>
      <el-tab-pane label="成品物料主数据维护" name="getfinishedMaterials">
        <finishedMaterials v-if="isFinished"></finishedMaterials>
      </el-tab-pane>
      <el-tab-pane label="组合物料主数据维护" name="getcompositeMaterials">
        <compositeMaterials v-if="isComposite"></compositeMaterials>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import fabricMaterials from "./fabricMaterials/Index";
import finishedMaterials from "./finishedMaterials/Index";
import compositeMaterials from "./compositeMaterials/Index";
export default {
  name: "searchMaterialsMainData",
  data() {
    return {
      activeName: 'getfabricMaterials',
      isFabric: true,
      isFinished: false,
      isComposite:false
    };
  },
  components: {
    fabricMaterials,
    finishedMaterials,
    compositeMaterials
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getfabricMaterials':
          this.isFabric = true;
          this.isFinished = false;
          this.isComposite = false;
          break;
        case 'getfinishedMaterials':
          this.isFabric = false;
          this.isFinished = true;
          this.isComposite = false;
          break;
        case 'getcompositeMaterials':
          this.isFabric = false;
          this.isFinished = false;
          this.isComposite = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>