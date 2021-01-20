<template>
  <div class="marketingplan nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="职业装产品销售预测" name="business">
        <businessattire v-if="isBusiness"></businessattire>
      </el-tab-pane>
      <el-tab-pane label="零剪产品销售预测" name="zerocut">
        <zerocut v-if="isZerocut"></zerocut>
      </el-tab-pane>
      <el-tab-pane label="新品职业装产品销售预测" name="newbusiness">
        <newBusinessattire v-if="isNewBusiness"></newBusinessattire>
      </el-tab-pane>
      <el-tab-pane label="新品零剪产品销售预测" name="newzerocut">
        <newZerocut v-if="isNewZerocut"></newZerocut>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import businessattire from "./businessattire/Index";
import zerocut from "./zerocut/Index";
import newBusinessattire from "./newBusinessattire/Index";
import newZerocut from "./newZerocut/Index";
export default {
  name: "marketingplan",
  data() {
    return {
      activeName: 'business',
      subName: 'Draft',
      isBusiness: true,
      isZerocut: false,
      isNewBusiness:false,
      isNewZerocut:false
    };
  },
  components: {
    businessattire,
    zerocut,
    newBusinessattire,
    newZerocut
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      console.log(tab);
      switch (tab.name) {
        case 'test':
          this.isBusiness = false;
          this.isZerocut = false;
          this.isNewBusiness=false;
          this.isNewZerocut=false;
          break;
        case 'business':
          this.isBusiness = true;
          this.isZerocut = false;
          this.isNewBusiness=false;
          this.isNewZerocut=false;
          break;
        case 'zerocut':
          this.isBusiness = false;
          this.isZerocut = true;
          this.isNewBusiness=false;
          this.isNewZerocut=false;
          break;
        case 'newbusiness':
          this.isBusiness = false;
          this.isZerocut = false;
          this.isNewBusiness=true;
          this.isNewZerocut=false;
          break;
        case 'newzerocut':
          this.isBusiness = false;
          this.isZerocut = false;
          this.isNewBusiness=false;
          this.isNewZerocut=true;
          break;
        default:
          break;
      }
    }
  }
};
</script>