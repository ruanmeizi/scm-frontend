<template>
	<div class="suppliermanage nav_tab_wrap">
		<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
	      <el-tab-pane label="供应商档案" name="tagsupplierrecord"> 
	      	<supplierrecord v-if="isSupplierrecord" @activeObj="getActiveData"></supplierrecord>
	      </el-tab-pane>
	      <!-- <el-tab-pane label="供应商评分" name="tagsuppliergrade"> 
	      	<suppliergrade v-if="isSuppliergrade" :subName="subName"></suppliergrade>
	      </el-tab-pane> -->
	    </el-tabs>
	</div>
</template>

<script>
import supplierrecord from "./supplierrecord/Index";
import suppliergrade from "./suppliergrade/Index";
export default {
  name: "suppliermanage",
  data() {
    return {
      activeName: 'tagsupplierrecord',
      subName: 'All',
      isSupplierrecord: true,
      isSuppliergrade: false
    };
  },
  components: {
    supplierrecord,
    suppliergrade
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
        case 'tagsupplierrecord':
          this.isSupplierrecord = true;
          this.isSuppliergrade = false;
          break;
        case 'tagsuppliergrade':
          this.isSupplierrecord = false;
          this.isSuppliergrade = true;
          break;
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.isSupplierrecord = false;
      this.isSuppliergrade = true;
    }
  }
};
</script>