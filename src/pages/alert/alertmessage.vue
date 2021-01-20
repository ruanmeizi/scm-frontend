<template>
	<div class="alertmessage" v-show="ifbool">
		<div class="w100p">
	      <div id="dialog" style>
	         <div class="header_title">
	         	<p>提示：</p>
	         </div>
	         <div class="body_content">
	         	<p>确定删除该代采关系?</p>
	         </div>
	         <div class="footerbutton">
	         	<el-button @click="close()">取消</el-button>
                <el-button type="primary" @click="sure(delid)">确定</el-button>
	         </div>
	      </div>
	    </div>
	</div>
</template>

<script>
export default {
  name: "alertmessage",
  props: ["ifbool",'delid'],
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {
    sure(id){
//		console.log(id)
  		this.$emit('delsure',id)	
  	},
    close() {
      this.$emit('delclosed')	
    }
  }
};
</script>

<style lang="scss" scoped>
 .alertmessage {
  width: 100%;
  height: 100%;
}
#dialog {
  text-align: center;
  width:455px;
  height:150px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-color:#FFFFFF;
  border-radius: 6px;
}
.box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
#dialog span {
  color: #ffffff;
  float: left;
  font-size: 30px;
}
i.el-icon-close {
  color: #ffffff;
  float: right;
  font-size: 30px;
}
i.el-icon-check{
	color: #FFFFFF;
	font-size: 30px;
}
.header_title{
	height:45px;
	width: 100%;
	text-align: left;
	border-top-left-radius:6px;
	border-top-right-radius:6px;
	background: #303133;
	p{
		margin-left: 20px;
		font-size:16px;
		display: inline-block;
		font-weight:600;
		/*color:#59595b;*/
		color: #FFFFFF;
	}
}
.body_content{
	height: 40px;
	padding:6px;
	p{
		font-size: 16px;
		color: #59595b;
	}
}
.footerbutton{
	padding:5px 0;
	/*height: 40px;*/
	float: right;
	margin-right:40px;
}
</style>