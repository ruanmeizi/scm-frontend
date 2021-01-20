<template>
	<div class="isdictionary">
		<p>字典设置</p>
	</div>
</template>

<script>
import { 
	
} from "@/api/module/isdictionaryApi.js";
	export default {
	  name: "isdictionary",
	  data() {
	    return {
	       materialCode:'',
	       value1:'',
	       pageSize: 10, //每页显示多少条
	       size: "",
	       allpage: 0,
	       currentPage: 1, //页数
	       activeName:'first',
	       activeNameagain:'first',
	       newboardList:[],
	       pickerOptions0: {
		      disabledDate(time) {
		        return time.getTime() < Date.now() - 8.64e7;
		      }
		    }
	    };
	  },
	  components: {},
	  created() {
	    
	  },
	  mounted() {
	    
	  },
	  watch: {
	    
	    
	  },
	  methods: {
	  	
	  	handleClick(tab, event) {
	       console.log(tab, event);
	    },
	    handleSizeChange(val) {
	      this.pageSize = val;
//	      this.factoryorderlist();
	    },
	    handleCurrentChange(val) {
	      this.currentPage = val;
//	      this.factoryorderlist();
	    }
	    
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";


</style>