<template>
	<div class="productboard nav_tab_wrap">
		<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
	      <el-tab-pane label="备货总量看板" name="stockuptotal"> 
	        <stockuptotalboard v-if="isStockuptotal" @activeObj="getActiveData"></stockuptotalboard>
	      </el-tab-pane>
	      <el-tab-pane label="职业装看板" name="businesswear"> 
	        <businesswearboard v-if="isBusinesswear" :subName="subName"></businesswearboard>
	      </el-tab-pane>
	      <el-tab-pane label="零剪看板" name="zeroshear"> 
	        <zeroshearboard v-if="isZeroshear"></zeroshearboard>
	      </el-tab-pane>
	      <!--<el-tab-pane label="非在库产品预售看板" name="notinthewarehouse"> 
	        <notinthewarehouseboard v-if="isNotinthewarehouse"></notinthewarehouseboard>
	      </el-tab-pane>-->
	      <!-- <el-tab-pane label="新品看板" name="newproduct">  
	        <newboard v-if="isNewproduct"></newboard>
	      </el-tab-pane> -->
	    </el-tabs>
	</div>
</template>

<script>
import stockuptotalboard from "./stockuptotalboard/Index";
import businesswearboard from "./businesswearboard/Index";
import zeroshearboard from "./zeroshearboard/Index";
import notinthewarehouseboard from "./notinthewarehouseboard/Index";
import newboard from "./newboard/Index";
export default {
  name: "productboard",
  data() {
    return {
      activeName: 'stockuptotal',
      subName: 'All',
      isStockuptotal: true,
      isBusinesswear: false,
      isZeroshear: false,
      isNotinthewarehouse: false,
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
    newboard
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
//        this.isNotinthewarehouse = false;
          this.isNewproduct=false;
          break;
        case 'businesswear':
          this.isStockuptotal = false;
          this.isBusinesswear = true;
          this.isZeroshear = false;
//        this.isNotinthewarehouse = false;
          this.isNewproduct=false;
          break;
        case 'zeroshear':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = true;
//        this.isNotinthewarehouse = false;
          this.isNewproduct=false;
          break;
//      case 'notinthewarehouse':
//        this.isStockuptotal = false;
//        this.isBusinesswear = false;
//        this.isZeroshear = false;
//        this.isNotinthewarehouse = true;
//        this.isNewproduct=false;
//        break;
        case 'newproduct':
          this.isStockuptotal = false;
          this.isBusinesswear = false;
          this.isZeroshear = false;
//        this.isNotinthewarehouse = false;
          this.isNewproduct=true;
          break;      
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
//    this.isNotinthewarehouse = false;
      this.isNewproduct=false;
    }
  }
};
</script>