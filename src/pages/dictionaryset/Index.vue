<template>
   <div class="dictionary nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="字典设置" name="dictionary">
        <isdictionary v-if="isdictionary" @activeObj="getActiveData"></isdictionary>
      </el-tab-pane>
    </el-tabs>
  </div>


</template>
<script>
import isdictionary from "./isdictionary/Index";
export default {
  name: "dictionary",
  data() {
    return {
      activeName:'dictionary',
      isdictionary:true
    };
  },
  components: {
    isdictionary
  },
  created() {},
  mounted() {
  	
  },
  watch: {},
  methods: {
	    handleClick(tab) {
	      switch (tab.name) {
	        case 'dictionary':
	          this.isdictionary = true;
	          break;
	        default:
	          break;
	      }
	    },
	    getActiveData(obj) {
	    	console.log(obj)
	      this.activeName = obj.name;
	      this.isdictionary = false;
	    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/index.scss";

</style>