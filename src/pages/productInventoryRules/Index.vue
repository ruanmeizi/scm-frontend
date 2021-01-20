<template>
  <div class="inventory nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="产品库存规则维护" name="inventoryMaintain">
        <inventoryMaintain v-if="isInventory"></inventoryMaintain>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import inventoryMaintain from "./inventoryMaintain/Index";
export default {
  name: "inventory",
  data() {
    return {
      activeName: 'inventoryMaintain',
      isInventory: true
    };
  },
  components: {
    inventoryMaintain
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'inventoryMaintain':
          this.isInventory = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>