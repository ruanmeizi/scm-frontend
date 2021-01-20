<template>
	<div class="supplychainAnalysis nav_tab_wrap">
		<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
	      <el-tab-pane label="库销比" name="librarypin"> 
	        <librarypinthan v-if="islibrarypin" @activeObj="getActiveData"></librarypinthan>
	      </el-tab-pane>
	      <el-tab-pane label="断货率" name="rateofout"> 
	        <rateofoutof stock v-if="israteofout" :subName="subName"></rateofoutof>
	      </el-tab-pane>
        <el-tab-pane label="滞销库存" name="unsalable"> 
	        <unsalable stock v-if="isunsalable"></unsalable>
	      </el-tab-pane>
	      <!--<el-tab-pane label="清货率" name="clearcerate"> 
	        <clearancerate v-if="isclearcerate"></clearancerate>
	      </el-tab-pane>-->
	    </el-tabs>
		
	</div>
</template>

<script>
import librarypinthan from "./librarypinthan/Index";
import rateofoutof from "./rateofoutof/Index";
import clearancerate from "./clearancerate/Index";
import unsalable from './unsalable/Index';
export default {
  name: "supplychainAnalysis",
  data() {
    return {
      activeName: 'librarypin',
      subName: 'All',
      islibrarypin: true,
      israteofout: false,
      isclearcerate: false,
      isunsalable:false,
    };
  },
  components: {
    librarypinthan,
    rateofoutof,
    clearancerate,
    unsalable
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
        case 'librarypin':
          this.islibrarypin = true;
          this.israteofout = false;
          this.isclearcerate = false;
          this.isunsalable=false;
          break;
        case 'rateofout':
          this.islibrarypin = false;
          this.israteofout = true;
          this.isclearcerate = false;
          this.isunsalable=false
          break;
        case 'clearcerate':
          this.islibrarypin = false;
          this.israteofout = false;
          this.isclearcerate = true;
          this.isunsalable=false;
          break;
        case 'unsalable':
          this.isunsalable=true;
          this.islibrarypin = false;
          this.israteofout = false;
          this.isclearcerate = false;
          break;
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.islibrarypin = false;
      this.israteofout = true;
      this.isclearcerate = false;
    }
  }
};
</script>