<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="消息处理管理" name="getmessageProcessManage">
        <messageProcessManage v-if="isFabric"></messageProcessManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import messageProcessManage from "./messageProcessManage/Index";
export default {
  name: "messageProcessManages",
  data() {
    return {
      activeName: 'getmessageProcessManage',
      isFabric: true
    };
  },
  components: {
    messageProcessManage
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getmessageProcessManage':
          this.isFabric = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>