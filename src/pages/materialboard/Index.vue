<template>
	<div class="materialboard nav_tab_wrap">
		<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
	      <el-tab-pane label="备货总量看板" name="stockuptotal"> 
	        <stockuptotalboard v-if="isStockuptotal" @activeObj="getActiveData"></stockuptotalboard>
	      </el-tab-pane>
	      <el-tab-pane label="职业装常规备货看板" name="businesswear"> 
	        <businesswearboard v-if="isBusinesswear" :subName="subName"></businesswearboard>
	      </el-tab-pane>
	      <el-tab-pane label="零剪常规备货看板" name="zeroshear"> 
	        <zeroshearboard v-if="isZeroshear"></zeroshearboard>
	      </el-tab-pane>
	      <!-- <el-tab-pane label="职业装非常规看板" name="notinthewarehouse"> 
	        <notinthewarehouseboard v-if="isNotinthewarehouse"></notinthewarehouseboard>
	      </el-tab-pane>
	      <el-tab-pane label="零剪非常规看板" name="zeronotinthewarehouse"> 
	        <zeronotinthewarehouseboard v-if="iszeroNotinthewarehouse"></zeronotinthewarehouseboard>
	      </el-tab-pane> -->
	      <el-tab-pane label="坯布和纱线看板" name="greyclothandyarn">  
	        <greyclothandyarnboard v-if="isGreyclothandyarn"></greyclothandyarnboard>
	      </el-tab-pane>
	      <!-- <el-tab-pane label="新品看板" name="newproduct">  
	        <newboard v-if="isNewproduct"></newboard>
	      </el-tab-pane> -->
        <el-tab-pane label="非常规看板" name="presaleOrder">
          <presaleOrder v-if="isPresaleOrder"></presaleOrder>
        </el-tab-pane>
	    </el-tabs>
	</div>
</template>

<script>
import stockuptotalboard from "./stockuptotalboard/Index";
import businesswearboard from "./businesswearboard/Index";
import zeroshearboard from "./zeroshearboard/Index";
import notinthewarehouseboard from "./notinthewarehouseboard/Index";
import zeronotinthewarehouseboard from "./zeronotinthewarehouseboard/Index";
import greyclothandyarnboard from "./greyclothandyarnboard/Index";
import newboard from "./newboard/Index";
import presaleOrder from "./presaleOrder/Index";
export default {
  name: "materialboard",
  data() {
    return {
      activeName: 'stockuptotal',
      subName: 'All',
      isStockuptotal: true,
      isBusinesswear: false,
      isZeroshear: false,
      isNotinthewarehouse: false,
      iszeroNotinthewarehouse:false,
      isGreyclothandyarn:false,
      isNewproduct:false,
      navList: [
        {
          value: "stockuptotal",
          name: "工厂调拨单"
        },
        {
          value: "businesswear",
          name: "库内调拨"
        },
        {
          value: "zeroshear",
          name: "工厂本地调拨"
        },
        {
          value: "notinthewarehouse",
          name: "铺货调拨"
        },
        {
          value: "greyclothandyarn",
          name: "工厂本地调拨"
        },
        {
          value: "newproduct",
          name: "铺货调拨"
        }
      ]
    };
  },
  components: {
    stockuptotalboard,
    businesswearboard,
    zeroshearboard,
    notinthewarehouseboard,
    zeronotinthewarehouseboard,
    greyclothandyarnboard,
    newboard,
    presaleOrder
  },
  created() {
    
  },
  mounted() {
    
  },
  watch: {
    
  },
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'stockuptotal':
          this.isStockuptotal = true;
          this.isBusinesswear = false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.iszeroNotinthewarehouse=false;
          this.isGreyclothandyarn=false;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'businesswear':
          this.isStockuptotal = false;
          this.isBusinesswear = true;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.isGreyclothandyarn=false;
          this.iszeroNotinthewarehouse=false;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'zeroshear':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = true;
          this.isNotinthewarehouse = false;
          this.isGreyclothandyarn=false;
          this.iszeroNotinthewarehouse=false;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'notinthewarehouse':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = true;
          this.iszeroNotinthewarehouse=false;
          this.isGreyclothandyarn=false;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'zeronotinthewarehouse':
          this.iszeroNotinthewarehouse=true;
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.isGreyclothandyarn=false;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'greyclothandyarn':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.iszeroNotinthewarehouse=false;
          this.isGreyclothandyarn=true;
          this.isNewproduct=false;
          this.isPresaleOrder = false;
          break;
        case 'newproduct':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.iszeroNotinthewarehouse=false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.isGreyclothandyarn=false;
          this.isNewproduct=true;
          this.isPresaleOrder = false;
          break;
        case 'presaleOrder':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.iszeroNotinthewarehouse=false;
          this.isZeroshear = false;
          this.isNotinthewarehouse = false;
          this.isGreyclothandyarn=false;
          this.isNewproduct=false;
          this.isPresaleOrder = true;
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.isStockuptotal = false;
      this.isBusinesswear = true;
      this.isZeroshear = false;
      this.isNotinthewarehouse = false;
      this.iszeroNotinthewarehouse=false;
      this.isGreyclothandyarn=false;
      this.isNewproduct=false;
      this.isPresaleOrder = false;
    }
  }
};
</script>
<style scoped>
  /deep/ .el-tabs__nav-wrap.is-scrollable{
    padding :0;
  }
</style>