<template>
	<div class="materialboard nav_tab_wrap">
		<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
	      <el-tab-pane label="职业装滞销库存看板" name="businesstotal"> 
	        <businessUnsalable v-if="isBusinessUnsalable" @activeObj="getActiveData"></businessUnsalable>
	      </el-tab-pane>
	      <el-tab-pane label="零剪滞销库存看板" name="zerototal"> 
	        <zeroUnsalable v-if="isZeroUnsalable" :subName="subName"></zeroUnsalable>
	      </el-tab-pane>
	      
	    </el-tabs>
	</div>
</template>

<script>
import businessUnsalable from "./businessUnsalable/Index";
import zeroUnsalable from "./zeroUnsalable/Index";

export default {
  name: "unsalableboard",
  data() {
    return {
      activeName: 'businesstotal',
      subName: 'All',
      isBusinessUnsalable: true,
      isZeroUnsalable: false,
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
    businessUnsalable,
    zeroUnsalable
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
        case 'businesstotal':
          this.isBusinessUnsalable = true;
          this.isZeroUnsalable = false;
          break;
        case 'zerototal':
          this.isBusinessUnsalable = false;
          this.isZeroUnsalable = true;
          break;
      
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.isBusinessUnsalable=false;
      this.isZeroUnsalable=true;
    }
  }
};
</script>