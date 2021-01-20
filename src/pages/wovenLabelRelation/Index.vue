<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="产品织标关系" name="getwovenLable">
        <wovenLable v-if="isFabric"></wovenLable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import wovenLable from "./wovenLable/Index";
export default {
  name: "wovenLabelRelation",
  data() {
    return {
      activeName: 'getwovenLable',
      isFabric: true
    };
  },
  components: {
    wovenLable
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getwovenLable':
          this.isFabric = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>