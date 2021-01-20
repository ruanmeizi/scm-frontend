<template>
	<div class="supplierrecord container">
		<div class="commoncontent">			
			<div id="" v-if="this.ifaddsure==1">
        <div class="actions_part clearfix">
          <div class="actions_wrap">
            <div class="display_ib mr10 mb10">
              <span class="tag">供应商状态：</span>
              <el-select class="select_single w200 mr10"
                v-model="customerStatus"
				filterable
				@change="supplierSearch"
                placeholder="请选择">
                <el-option key="" label="全部" value=""></el-option>
                <el-option
                  v-for="item in supplierstatuslist"
                  :key="item.index"
                  :label="item.name"
                  :value="item.index">
                </el-option>
              </el-select>
            </div>
            <div class="display_ib mr10 mb10">
              <span class="tag">供应商分类：</span>
              <el-select class="select_single w200 mr10"
                v-model="customerCategory"
				filterable
				@change="supplierSearch"
                placeholder="请选择">
                <el-option key="" label="全部" value=""></el-option>
                <el-option
                  v-for="item in suppliertypelist"
                  :key="item.index"
                  :label="item.name"
                  :value="item.index">
                </el-option>
              </el-select>
            </div>
			<div class="display_ib mr10 mb10">
				<span class="tag">供应商：</span>
				<el-select class="select_single w200 mr10" filterable @change="searchclick" v-model="customerId" placeholder="请选择">
					<el-option key label="全部" value></el-option>
					<el-option
					v-for="item in supplierCodeList"
					:key="item.supplierId"
					:label="item.supplierCode"
					:value="item.supplierId"
					></el-option>
				</el-select>
			</div>
            <!-- <div class="display_ib mr10 mb10">
              <span class="tag">供应商名称：</span>
              <el-input class="input_single w200 mr10" v-model.trim="customerNameCh" placeholder="请输入"></el-input>
            </div>
            <div class="display_ib mr10 mb10">
              <span class="tag">供应商编号：</span>
              <el-input class="input_single w200 mr10" v-model.trim="customerCode" placeholder="请输入"></el-input>
            </div> -->
          </div>
          <div class="actions_btn_wrap down t_right">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              circle
              title="搜索"
              @click="searchclick"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              circle
              title="新增供应商"
              @click="requisitionadd"
            ></el-button>
          </div>
        </div>

					<!-- <div class="commoncon_title" style="">	
						<div class="type" style="width:150px;">
							<el-select v-model="customerStatus" placeholder="全部合作状态">
								<el-option key="" label="全部合作状态" value=""></el-option>
								<el-option v-for="item in supplierstatuslist" :key="item.index" :label="item.name" :value="item.index">
								</el-option>
							</el-select>
						</div>
						<div class="type" style="width:150px;margin-left: 10px;">
							<el-select v-model="customerCategory" placeholder="供应商分类">
								<el-option key="" label="供应商分类" value=""></el-option>
								<el-option v-for="item in suppliertypelist" :key="item.index" :label="item.name" :value="item.index">
								</el-option>
							</el-select>
						</div>
						<div class="input" style="width:150px;">
							<el-input v-model="customerNameCh" placeholder="请输入供应商名称"></el-input>
						</div>
						<div class="input" style="width:200px;">
							<el-input v-model="customerId" placeholder="请输入供应商系统编码"></el-input>
						</div>
					    <div class="input" style="width:200px;">
							<el-input v-model="customerCode" placeholder="请输入业务编号"></el-input>
						</div>
					    <div class="down" style="">
					    	 <el-button size="small" type="primary" icon="el-icon-search" circle title="搜索" @click="searchclick"></el-button>
					         <el-button size="small" type="primary" icon="el-icon-plus" circle title="新增供应商" @click="requisitionadd"></el-button>				
					    </div> 
				</div> -->
				<div class="container_table clearfix mt20 table_part" v-loading="tableLoading">	
					<!-- <div style="min-height: 536px;">
					  <table class="contenttab" cellpadding="0" style="" cellspacing="0">
					    	<thead>
					    		<th>序号</th>
					    		<th>供应商系统编码</th>
					    		<th>供应商系统编码</th>
					    		<th>供应商名称</th>
					    		<th>供应商分类</th>
					    		<th>供应商分类</th>
					    		<th>操作</th>
					    	</thead>
					    	<tbody>
					    		<tr v-for="(item,index) in supplierList">			    			
					    			<td>
										{{index+1}}
					    			</td>
					    			<td>
										{{item.customerId}}
	                               </td>
					    			<td :title="item.customerCode">
										{{item.customerCode}}
					    			</td>
					    			<td :title="item.customerNameCh">
										{{item.customerNameCh}}
					    			</td>
					    			<td>
					    				{{item.customerCategoryname}}
					    			</td>
					    			
					    			<td>
					    				{{item.customerStatusname}}
					    			</td>
					    			<td>
										 <i type="primary" class="el-icon-edit"  title="修改" @click="supplierview(index,item,'upd')"></i>
									     <i type="primary" class="el-icon-delete"  title="删除" @click="supplierdel(index,item)"></i>
									     <i type="primary" class="el-icon-document"  title="查看" @click="supplierview(index,item,'view')"></i>
					    			</td>
					    		</tr>
					    	</tbody>
					    </table>			
					    <p v-if="!this.supplierList.length&&!tableLoading" class="empty_tip">~~暂无数据~~</p>
				    </div> -->
					<singleTable
					:tableList='supplierList' 
					:tableLeaderFieldsList='leaderFieldsList'
					:tableTailFieldsList="tailFieldsList"
					:tableFieldsList="fieldsList"
					@deleteHandle='supplierdel'
					@editHandle='supplierview'
					@checkHandle='supplierview'
					></singleTable>
				 	<div class="paging" style="margin-top:30px;float: right;">
						<div class="block">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10,50]" :page-size="pageSize" layout="sizes,total, prev, pager, next" :total="this.allpage">
							</el-pagination>
						</div>
					</div>
				</div>	
				
			</div>
			
			<div class="addsupplier" v-if="this.ifaddsure==2">
				<addsuppliercontent ref="mychild" :formInlinesupplier="formInlinesupplier" :updatag="updatag"  :tableDatalinkman="tableDatalinkman" :addressmsgtypelist="addressmsgtypelist"  v-on:close="close"></addsuppliercontent>
			</div>
			
			<div class="showsupplier" v-if="this.ifaddsure==3">
				<showsuppliercontent :formInlinesupplierlist="formInlinesupplierlist" :tableDatalinkman="tableDatalinkman" :addressmsgtypelist="addressmsgtypelist" v-on:close="close"></showsuppliercontent>
			</div>
			
				<!--删除-->
			<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
				<span>确定删除该条供应商数据?</span>
				<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogdelVisible = false">取 消</el-button>
			    <el-button type="primary" @click="delVisibleclick()" v-preventReClick :disabled="isDisable">确 定</el-button>
			  </span>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
import { supplierDictList } from '@/api/publicApi.js';
import { 
	purchasegetuuid,
	supplierSearch,
	getsupplierstatus,
	getsuppliertype,
	getsupplierview,
	getaddressmessagetype,
	getaddresstype, 
	linkmanapishow,
	getsupplierdel,
	getlinkmantype,
	getaccountstatetype,
} from "@/api/module/supplierApi.js";
import addsuppliercontent from "../addsuppliercontent/Index.vue"
import showsuppliercontent from "../showsuppliercontent/Index.vue"
import singleTable from "@/layouts/components/common/SingleTable.vue";
	export default {
	  name: "supplierrecord",
	  components:{
	  	addsuppliercontent,
		showsuppliercontent,
		singleTable
	  },
	  data() {
	    return {
	       dialogdelVisible:false,
		   tableLoading: true,
	       delid:'',
	       supplierName:'',
	       supplierinnerCode:'',
	       value1:'',
	       pageSize: 10, //每页显示多少条
	       size: "",
	       allpage: 0,
	       currentPage: 1, //页数
	       zaichanglist:[],
	       updatag:'',
	       ifaddsure:1,
	       customerStatus:'',
	       customerCategory:'',
	       customerNameCh:'',
		   customerCode:'',
		   customerId:'',
	       supplierstatuslist:[],
	  	   suppliertypelist:[],
		   supplierList:[],
		   supplierCodeList:[],
	       formInlinesupplier:{},
	       addressmsgtypelist:[],
	       addresstypelist:[],
	       tableDatalinkman:[],
	       formInlinesupplierlist:[],
	       linkmantypelist:[],
	       accounttypelist:[],
	       typestatusid:'',
	       supplierstatusid:'',
	       typeList:[
	          {
			  	typeid:'1',
			  	typename:'正常'
			  },{
			  	typeid:'2',
			  	typename:'暂停'
			  }
	       ],
	       suppliertypeList:[
	          {
			  	typeid:'1',
			  	typename:'原料商'
			  },{
			  	typeid:'2',
			  	typename:'面料商'
			  },{
			  	typeid:'3',
			  	typename:'加工商'
			  }
		   ],
		   leaderFieldsList: [
			],
			fieldsList:[
			{
				name: '序号',
				field: 'idIndex',
				// width:'80'
			},
			// {
			// 	name: '供应商系统编号',
			// 	field: 'customerId',
			// },
			{
				name:'供应商编号',
				field:'customerCode',
			},
			{
				name:'供应商名称',
				field:'customerNameCh',
			},
			{
				name:'供应商分类',
				field:'customerCategory',
				fabricSupplierType:'fabricSupplierType'
			},
			{
				name:'供应商状态',
				field:'customerStatus',
				fabricSupplierStatus:'fabricSupplierStatus'
			}
			],
			tailFieldsList:[
				{
					name: '操作',
					field: '',
					class: '',
					width: '150',
					minWidth: '10%',
					isAction: true,
					hasEdit:true,
					hasDelete:true,
					hasCheck:true,
				},
			],
	       pickerOptions0: {
		      disabledDate(time) {
		        return time.getTime() < Date.now() - 8.64e7;
		      }
			},
			isDisable:false,
	    };
	  },
	  created() {
	    
	  },
	  mounted() {
		 this.getSupplierDictList();
	     this.supplierstatus();
	  	 this.suppliertype();
	  	 this.addresstype();
	  	 this.supplierSearch();
	  	 this.linkmantype();
		 this.accounttype();
	  },
	  watch: {
	    
	    
	  },
	  
	  methods: {
		getSupplierDictList() {
			// 供应商列表
			console.log("供应商");
			supplierDictList().then(response => {
				if(response.code === "0") {
					console.log('供应商列表：', response);
					this.supplierCodeList = response.data;
				}
			});
		},
	  	//币种分类
		accounttype(){
			console.log('币种币种')
			getaccountstatetype().then(response => {
				if(response.code === "0") {
					this.accounttypelist = response.data;
				}
			});
		},
	  	//地址类型
	  	addresstype(){
	  		getaddresstype().then(response => {
				if(response.code === "0") {
					this.addresstypelist = response.data;
				}
			});
	  	},
	  	//供应商状态
	  	supplierstatus(){
	  		getsupplierstatus().then(response => {
				if(response.code === "0") {
					this.supplierstatuslist = response.data;
				}
			});
	  	},
	  	//供应商分类
	  	suppliertype(){
	  		getsuppliertype().then(response => {
				if(response.code === "0") {
					this.suppliertypelist = response.data;
				}
			});
	  	},
	  	//联系人类型
		linkmantype() {
			getlinkmantype().then(response => {
				if(response.code === "0") {
					this.linkmantypelist = response.data;
					console.log(this.linkmantypelist)
				}
			});
		},
	  	supplierSearch(){
	  		this.tableLoading = true;
	  		let obj={
            	  customerCategory:this.customerCategory,
				  customerCode:this.customerCode,
				  customerId:this.customerId,
				  customerNameCh:this.customerNameCh,
				  customerStatus:this.customerStatus,
           }
            supplierSearch(this.currentPage, this.pageSize, obj).then(response => {
				if(response.code === "0") {
					this.tableLoading = false;
					this.allpage = response.data.total;
					this.supplierList = response.data.records;
					for(var i=0;i<this.supplierList.length;i++){
						let item=this.supplierList[i];
						if(this.currentPage!=1){
						item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
						}else{
						item.idIndex=i+1;
						}
					}
				} else {
					this.tableLoading = false;
				}
			});
			setTimeout(() => {
				this.tableLoading = false;
			}, 10000);
	  	},
	  	//新增
	  	requisitionadd(){
	    	this.ifaddsure=2;
	    	this.updatag='新增';	    	
	  	},
	  	//搜索
	  	searchclick(){
	  		this.currentPage=1;
	  		this.supplierSearch();
	  	},
	  	//删除
	  	supplierdel(index,item){
	  		this.dialogdelVisible = true;
  		    this.delid=item.uuid;	  		
	  	},
	  	//删除确定
	  	delVisibleclick(){
			this.isDisable = true
			setTimeout(() => {
				this.isDisable = false
			  }, 1000)
	  		getsupplierdel(this.delid).then(response => {
				if(response.code === "0") {
					this.dialogdelVisible = false;
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.supplierSearch();
				}
			});
	  	},
	  	//修改/查看
	  	supplierview(index,item,tag){
	  		console.log(item);
	  		if(tag=='view'){
	  			this.ifaddsure=3;
	  		}else{
	  			this.ifaddsure=2;
	  			this.updatag='修改';
	  		}
	  		getsupplierview(item.uuid).then(response => {
				if(response.code === "0") {
					
					if(tag=='view'){
			  			this.formInlinesupplierlist= response.data;
				    	for(var j=0;j<this.suppliertypelist.length;j++){
				    		let data=this.suppliertypelist[j];
				    		if(this.formInlinesupplierlist.customerCategory==data.index){
				    			this.formInlinesupplierlist.customerCategoryname=data.name;
				    		}
				    	}
				    	for(var a=0;a<this.supplierstatuslist.length;a++){
				    		let itema=this.supplierstatuslist[a];
				    		if(this.formInlinesupplierlist.customerStatus==itema.index){
				    			this.formInlinesupplierlist.customerStatusname=itema.name;
				    		}
				    	}
				    	for(var b=0;b<this.accounttypelist.length;b++){
				    		let itemb=this.accounttypelist[b];
				    		if(this.formInlinesupplierlist.currency==itemb.index){
				    			this.formInlinesupplierlist.currencyname=itemb.name;
				    		}
				    	}
			  			
			  	   }else{ 	  
						  this.formInlinesupplier = response.data;
						  if(response.data.customerStatus!=null){
                            this.formInlinesupplier.customerStatus=response.data.customerStatus.toString();
						  }
			  		}
					console.log(this.formInlinesupplier)
				}
			});
			linkmanapishow(item.uuid).then(response => {
				if(response.code === "0") {
					this.tableDatalinkman=response.data;
					console.log(this.linkmantypelist)
					for(var i=0;i<this.tableDatalinkman.length;i++){
						var item=this.tableDatalinkman[i];
						for(var j=0;j<this.linkmantypelist.length;j++){
							var data=this.linkmantypelist[j];
							if(item.contactType==data.index){
								item.contactTypename=data.name;
							}
						}
					}
					console.log(this.tableDatalinkman)
				}
			});
			getaddressmessagetype(item.uuid).then(response => {
				if(response.code === "0") {
					this.addressmsgtypelist = response.data;
					for(var i=0;i<this.addressmsgtypelist.length;i++){
						let item=this.addressmsgtypelist[i];
						for(var j=0;j<this.addresstypelist.length;j++){
							let data=this.addresstypelist[j];
							if(item.addressType==data.index){
								item.adddresname=data.name;
							}
						}
					}
					console.log(this.addressmsgtypelist);
					this.$forceUpdate()
				}
			});
	  	},
	  	//关闭
	  	close(message){
	  		console.log(message)
	  		this.ifaddsure=1;
	  		this.updatag='';
	  		localStorage.removeItem('formInlinesupplieruuid');
	  		this.supplierSearch();
	  		this.$forceUpdate();
	  	},
	    handleSizeChange(val) {
	      this.pageSize = val;
	      this.supplierSearch();
	    },
	    handleCurrentChange(val) {
	      this.currentPage = val;
	      this.supplierSearch();
	    },  
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.ml{
	margin-left: 10px;
}

.supplierrecord{
	.commoncontent{
		  border-radius: 6px;
		  padding: 10px 15px;
		  background: #ffffff;
	}
}
.commoncon_title{
	width: 100%;
    display: inline-block;
    /*text-align: right;*/
    height:30px;
    background: #FFFFFF;
    border-radius: 6px;
    padding: 20px 0px;
    .type{
    	display: inline-block;
    }
    .input{
    	display: inline-block;
    	margin-left: 10px;
    }
    .down{
    	display: inline-block;
    	margin:0 10px;
    	float: right;
    }
}
.dicchild{
	.childtitle{
		border-radius: 6px;
	    padding: 10px 10px;
	    margin-bottom: 10px;
	    background: #ffffff;
	}
	.childcontent{
		border-radius: 6px;
	    padding: 10px 15px;
	    background: #ffffff;
	}
}
.childtitle{
	ul{
		display:flex;
		li{
			flex: 1;
			i.el-icon-back{
				cursor: pointer;
				margin-right: 10px;
				color:#409EFF;
			}
			span{
				display: inline-block;
                margin-top: 10px;
			}
		}
	}
}
select.selectstatus {
	width: 230px;
	height:40px;
	border-radius: 5px;
	border: 1px solid #DCDFE6;
	text-indent: 1em;
	color: #606266;
	line-height: 20px;
	/*cursor: pointer;*/
	font-size: 14px;
}

select.selectstatus>option {
	/*cursor: pointer;*/
	font-size: 14px;
}
select.selectstatus{
background: #FFFFFF;   
}
i.el-icon-view{
	font-size: 20px;
    color: #409eff;
    margin-left: 10px;
    cursor: pointer;
}
table.tableclass{
	thead{
		background: #f5f7fa;
		color: #909399;
		height: 40px;
		th{
			padding: 10px 0;
		}		
	}
	tbody{
		tr{
			td{
				padding: 10px 0;
				font-size: 14px;
                color: #606266;
			}
		}
	}
}
table.contenttab{	
	tbody{
		tr{
			td{
				font-size: 14px!important;
                color: #606266!important;
				max-width: 150px;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		}
	}
}
table.contenttab td button{
	background: #409eff;
}
table.contenttab td button:hover{
	color: #FFFFFF;
}
.supplierbasic_table{
	table.contenttab{
		td{
			span{
				font-size: 14px!important;
                    color: #606266!important;
			}
		}
	}
}
</style>