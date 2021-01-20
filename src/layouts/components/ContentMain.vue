<template>
	<div class="ContentMain">
		<div class="search">
		    <el-date-picker
		      v-model="value1"
		      type="daterange"
		      format="yyyy-MM-dd"
		      value-format="yyyy-MM-dd"
		      range-separator="至"
		      start-placeholder="开始日期"
		      end-placeholder="结束日期">
		    </el-date-picker>
			<div class="input" style="margin-left: 10px;">
				<el-input v-model="companycode" placeholder="请输入公司编号"></el-input>
			</div>
			<div class="input">
				<el-input v-model="companyname" placeholder="请输入公司名称"></el-input>
			</div>
			<div class="type">
				<el-select v-model="typeid" placeholder="请选择状态">
				    <el-option
				      v-for="item in typeList"
				      :key="item.value"
				      :label="item.typename"
				      :value="item.typeid">
				    </el-option>
				</el-select>
			</div>
			
		</div>
		<div class="search_two">
			<div class="input">
				<el-input v-model="productcode" placeholder="请输入产品码"></el-input>
			</div>
			<!--<div class="input">
				<el-input v-model="ordernumber" placeholder="请输入订单编号"></el-input>
			</div>-->
			<el-button type="primary" @click="searchclick()">查询</el-button>
			<div class="down">
				<el-button type="primary" icon="el-icon-download" @click="exportdataexl">导出</el-button>
			</div>
			
		</div>
			       
        <el-table
        	v-loading="loading"
		    element-loading-text="拼命加载中"
		    element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(88, 85, 85, 0.8)"
		    :data="tableData"
		    style="width: 100%">
		    <el-table-column type="expand">
		      <template slot-scope="props">
		        <el-form label-position="left" inline class="demo-table-expand">
		          <el-form-item label="公司名称：">
		            <span>{{ props.row.cardName }}</span>
		          </el-form-item>
		          <el-form-item label="公司编号：">
		            <span>{{ props.row.cardCode }}</span>
		          </el-form-item>
		          <el-form-item label="规格：">
		            <span>{{ props.row.itemName }}</span>
		          </el-form-item>
		          <el-form-item label="产品码：">
		            <span>{{ props.row.codebars }}</span>
		          </el-form-item>
		          <el-form-item label="数量:">
		            <span>{{ props.row.quantity }}</span>
		          </el-form-item>
		          <el-form-item label="下单日期：">
		            <span>{{ props.row.docdate }}</span>
		          </el-form-item>
		          <el-form-item label="地址：">
		            <span>{{ props.row.deliveryAddress }}</span>
		          </el-form-item>
		        </el-form>
		      </template>
		    </el-table-column>
		    <el-table-column
		      label="公司名称"
		      prop="cardName">
		    </el-table-column>
		    <el-table-column
		      label="公司编号"
		      prop="cardCode">
		    </el-table-column>
		    <el-table-column
		      label="规格"
		      prop="itemName">
		    </el-table-column>
		     <el-table-column
			      prop="codebars"
			      label="产品码"
			      width="150">
			  </el-table-column>
			  <el-table-column
			      prop="quantity"
			      label="数量"
			      width="150">
			  </el-table-column>
		  </el-table>

		<div class="paging">
			<div class="block">
			    <el-pagination
			      @size-change="handleSizeChange"
			      @current-change="handleCurrentChange"
			      :current-page.sync="currentPage"
			      :page-sizes="[10,50]"
			      :page-size="pageSize"
			      layout="sizes,total, prev, pager, next"
			      :total="this.allpage">
			    </el-pagination>
			  </div>
		</div>
		
	</div>
</template>

<script>
import {
  ordermanagement,exportorders
} from "@/api/module/ordermessage.js";
export default {
  name: "ContentMain",
  data() {
    return {
        tableData: [],
	    currentPage4: 4,
	    pageSize:10,  //每页显示多少条
	    size:'',
        allpage:0,
        currentPage:1, //页数
        productcode:'',
        value1:"",
        ordernumber:'',
        companycode:'',
        companyname:'',
        starttime:'2019-07-16',
        endtime:'2019-08-04',
        typeid:0,
        loading: true,
        typeList:[
	        {
	        	typename:'全部',
	        	typeid:0
	        },
	        {
	           	typename:'自采',
	           	typeid:1
	        },
	        {
	        	typename:'代采',
	        	typeid:2
	           
	        },
	        {
	        	typename:'被采',
	        	typeid:3
	        }
        ],
        tableData: [],
    };
  },

  computed: {
    
  },

  mounted() {
    this.orderlist();
  },
  methods: {
  	//订单查询
  	orderlist(){
  	  this.loading=true;
  	  let obj={
  	  	cardCode:this.companycode,
	    cardName:this.companyname,
	    codebars:this.productcode,
	    docEntry:this.ordernumber,
	    endDate:this.endtime,
	    startDate:this.starttime,
	    type:this.typeid
  	  }
  	  ordermanagement(this.currentPage,this.pageSize,obj).then(response => {
        if (response.code === "0") {
          this.loading=false;
//        console.log(response)
          this.allpage=response.data.total;         
          this.tableData=response.data.records;
        }
      });
  	},
  	//订单导出
  	exportdataexl(){
//		console.log('aaaaaaaaaaaaaaaaaaaaaaa')
//	    console.log(this.starttime,this.endtime,this.productcode,this.typeid)
  	    var pathurl=process.env.VUE_APP_API_URL+'order/getOrderExcel/?'+'startDate='+this.starttime+'&'+'endDate='+this.endtime+'&'+'codebars='+this.productcode+'&'+'type='+this.typeid+'&'+'cardCode='+this.companycode+'&'+'cardName='+this.companyname;
	    window.open(pathurl,'_blank')
  	},
  	 handleSizeChange(val) {
//	 	console.log(val);
	    this.pageSize =val;
        this.orderlist();
	 },
	  handleCurrentChange(val) {
	     this.currentPage = val
         this.orderlist(); 
	  },
	  searchclick(){
//	  	console.log(this.value1)
	  	if(this.value1!=null&&this.value1!=''){
	  		this.starttime=this.value1[0];
	  	    this.endtime=this.value1[1];
	  	}
//	  	console.log(this.starttime,this.endtime)
	  	this.orderlist();
	  }
  }
};
</script>

<style lang="scss" scoped>
.ContentMain{
	padding: 20px 20px;
}
.paging{
	margin-top:20px;
	height: 50px;
	float: right;
	margin-right: 30px;
}
.search {
	display: flex;
    margin: 10px 0;
    .input{
    	width:150px;
    	margin-right: 10px;
    }
    .type{
    	margin-right: 10px;
    }
}
.search_two{
	display: flex;
	margin-bottom: 10px;
	position: relative;
	.input{
    	width:200px;
    	margin-right: 10px;
    }
    .down{
    	 button.el-button.el-button--primary {
		    position: absolute;
		    right:5px;
		}
    }
   
}
.demo-table-expand {
    font-size: 0;
  }
 
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width:100%;
    text-align: left;
    margin-left:33px;
  }
</style>
