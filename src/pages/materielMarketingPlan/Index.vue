<template>
  <div class="marketingplan nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="职业装物料销售预测" name="business">
        <businessattire v-if="isBusiness"></businessattire>
      </el-tab-pane>
      <el-tab-pane label="零剪物料销售预测" name="zerocut">
        <zerocut v-if="isZerocut"></zerocut>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import businessattire from "./businessattire/Index";
import zerocut from "./zerocut/Index";
export default {
  name: "marketingplan",
  data() {
    return {
      activeName: 'business',
      subName: 'Draft',
      isBusiness: true,
      isZerocut: false
    };
  },
  components: {
    businessattire,
    zerocut
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      // console.log(tab);
      switch (tab.name) {
        case 'business':
          this.isBusiness = true;
          this.isZerocut = false;
          break;
        case 'zerocut':
          this.isBusiness = false;
          this.isZerocut = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>