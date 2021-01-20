<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="节假日设置" name="getfabricMaterials">
        <holidayManagement v-if="isFabric"></holidayManagement>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import holidayManagement from "./holidayManagement/Index";
export default {
  name: "holidaySetting",
  data() {
    return {
      activeName: 'getfabricMaterials',
      isFabric: true,
      isFinished: false,
      isComposite:false
    };
  },
  components: {
    holidayManagement
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
        default:
          break;
      }
    }
  }
};
</script>