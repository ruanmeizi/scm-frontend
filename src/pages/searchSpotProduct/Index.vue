<template>
  <div class="product nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="面料产品主数据" name="fabricMaintain">
        <fabricMaintain v-if="isFabric"></fabricMaintain>
      </el-tab-pane>
      <el-tab-pane label="成品产品主数据" name="finishedMaintain">
        <finishedMaintain v-if="isFinished"></finishedMaintain>
      </el-tab-pane>
      <!-- <el-tab-pane label="虚拟产品主数据维护" name="virtualMaintain">
        <virtualMaintain v-if="isVirtual"></virtualMaintain>
      </el-tab-pane>
      <el-tab-pane label="组合产品主数据维护" name="groupMaintain">
        <groupMaintain v-if="isGroup"></groupMaintain>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import fabricMaintain from "./fabricMaintain/Index";
import finishedMaintain from "./finishedMaintain/Index";
import virtualMaintain from "./virtualMaintain/Index";
import groupMaintain from "./groupMaintain/Index";
export default {
  name: "searchSpotProduct",
  data() {
    return {
      activeName: 'fabricMaintain',
      isFabric: true,
      isFinished: false,
      isVirtual: false,
      isGroup: false
    };
  },
  components: {
    fabricMaintain,
    finishedMaintain,
    virtualMaintain,
    groupMaintain
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'fabricMaintain':
          this.isFabric = true;
          break;
        case 'finishedMaintain':
          this.isFinished = true;
          break;
        case 'virtualMaintain':
          this.isVirtual = true;
          break;
        case 'groupMaintain':
          this.isGroup = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>