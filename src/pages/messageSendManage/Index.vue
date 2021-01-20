<template>
  <div class="materials nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="消息发送管理" name="getmessageSendManage">
        <messageSendManage v-if="isFabric"></messageSendManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import messageSendManage from "./messageSendManage/Index";
export default {
  name: "messageSendManages",
  data() {
    return {
      activeName: 'getmessageSendManage',
      isFabric: true
    };
  },
  components: {
    messageSendManage
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getmessageSendManage':
          this.isFabric = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>