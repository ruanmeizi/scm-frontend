<template>
	<div class="container isdictionary">
	    <div class="commoncontent" v-if="this.dictionarychild==false">
			<div class="actions_part clearfix">
				<div class="actions_wrap">
				<div class="display_ib mr10 mb10">
					<span class="tag">字典名称：</span>
					<el-input class="input_single w200 mr10" v-model.trim="dictionaryName" placeholder="请输入"></el-input>
				</div>
				<div class="display_ib mr10 mb10">
					<span class="tag">字典编码：</span>
					<el-input class="input_single w200 mr10" v-model.trim="dictionaryCode" placeholder="请输入"></el-input>
				</div>
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
				</div>
			</div>

            <div class="table_part clearfix">
				<el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">				
					<singleTable
					:tableList='tableData' 
					:tableLeaderFieldsList='leaderFieldsList'
					:tableTailFieldsList="tailFieldsList"
					:tableFieldsList="fieldsList"
					@dictionaryHandle='dictionaryentry'
					></singleTable>
				</el-tabs>

				<div class="pagination_wrap fr">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-sizes="[10, 50]"
						:page-size="pageSize"
						layout="sizes, total, prev, pager, next"
						:total="this.allpage"
					></el-pagination>
				</div>
			</div>
		</div>
        
		<!-- 字典项管理START -->
	    <div class="dicchild" v-else>
					<div class="childtitle">
						<ul class="childtitleul">
							<li>
								<i title="返回" class="el-icon-back" style="" @click="back()">返回</i>
								<span>字典名称：{{this.childlist.dictName}}</span>
							</li>
							<li>
								<span>字典编号：{{this.childlist.dictIndex}}</span>
							</li>
							<li>
								<el-button type="primary" @click="dicchildadd()">增加子项</el-button>
							</li>
						</ul>
					</div>
					

				    <div class="table_part clearfix">
						<el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">				
							<singleTable
							:tableList='pricList' 
							:tableLeaderFieldsList='leaderFieldsList'
							:tableTailFieldsList="tailFieldsChildList"
							:tableFieldsList="fieldsChildList"
							@deleteHandle='dictionarydel'
							></singleTable>
						</el-tabs>

						<div class="pagination_wrap fr">
							<el-pagination
								@size-change="handleSizeChangechild"
								@current-change="handleCurrentChangechild"
								:current-page.sync="currentPagechild"
								:page-sizes="[10, 50]"
								:page-size="pageSizechild"
								layout="sizes, total, prev, pager, next"
								:total="this.allpagechild"
							></el-pagination>
						</div>
					</div>	
					
					<!--新增子项-->
					<el-dialog title="新增字典项" v-dialogDrag :visible.sync="dialogcommitVisible" :close-on-click-modal="false" width="35%">
						<div class="childcontentadd">
							<el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
							  <el-form-item label="显示次序：" >
							    <el-input width="180" v-model="formLabelAlign.dictItemOrder"></el-input>
							    <span class="red ml">*</span>
							  </el-form-item>
							  <el-form-item label="字典项名称：" >
							    <el-input width="180" v-model="formLabelAlign.dictItemName"></el-input>
							    <span class="red ml">*</span>
							  </el-form-item>
							  <el-form-item label="字典编号：">
							    <el-input width="180" v-model="formLabelAlign.dictIndex" :disabled="true"></el-input>
							     <span class="ml" style="width: 10px;"></span>
							  </el-form-item>
							  <el-form-item label="字典子项值：">
							    <el-input width="180" v-model="formLabelAlign.dictItemValue"></el-input>
							    <span class="red ml">*</span>
							  </el-form-item>
							  <el-form-item label="语言版本：">
								 <el-select  v-model.trim="formLabelAlign.dictItemLanguage"  @change="subinventoryclick()" placeholder="请选择">
									<el-option  v-for="item in this.subLanguage" :key="item.id"
											:label="item.name"
											:value="item.id"></el-option>
								</el-select>
								 <span class="ml" style="width: 10px;"></span>
							  </el-form-item>
							</el-form>
						</div>
						<span slot="footer" class="dialog-footer">
					    <el-button @click="dialogcommitVisible = false">取 消</el-button>
					    <el-button type="primary" @click="draftsave()">确 定</el-button>
					  </span>
					</el-dialog>
					
					<!--删除-->
					<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
						<span>确定删除该条数据?</span>
						<span slot="footer" class="dialog-footer">
					    <el-button @click="dialogdelVisible = false">取 消</el-button>
					    <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
					  </span>
					</el-dialog>		
		 </div>
		 <!-- 字典项管理END -->
	</div>		
				
</template>

<script>
import { 
	dictionarySerch,
	dictionarychildSerch,
	purchasegetuuid,
	dictionarychildadd,
	dictionarychilddel,
} from "@/api/module/isdictionaryApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
	  name: "isdictionary",
	  data() {
	    return {
	       activeName:'dictionary',
		   isdictionary:true,
		   dictionaryName:'',
	       dictionaryCode:'',
	       value1:'',
	       pageSize: 10, //每页显示多少条
	       size: "",
	       allpage: 0,
	       allpagechild:0,
	       currentPage: 1, //页数
	       pageSizechild: 10, //每页显示多少条
	       currentPagechild: 1, //页数
	       activeNameagain:'first',
	       dictionarychild:false,
	       dialogdelVisible:false,
	       dialogcommitVisible:false,
	       tableLoading: true,
	       labelPosition: 'right',
	       delid:'',
	       subLanguage:[
	        {
	        	name:'CH',
	        	id:'CH'
	        },
	        {
	        	name:'EN',
	        	id:'EN'
	        }
	       ],
	       formLabelAlign: {
	          dictItemName: '',
	          dictIndex:'',
	          dictItemLanguage:1,
	          dictItemValue:'',
	          dictItemOrder:1
	       },
	       childlist:'',
	       pricList:[
	         {
	         	name:'张三',
	         	code:'12003'
	         },
	         {
	         	name:'李四',
	         	code:'10003'
	         }
	       ],
		   tableData:[],
		   leaderFieldsList: [],
		   tailFieldsList:[
				{
				name: '操作',
				field: '',
				class: '',
				width: '350',
				minWidth: '30%',
				isAction: true,
				hasDictionary: true
				},
			],
			tailFieldsChildList:[
			 {
				name: '操作',
				field: '',
				class: '',
				width: '150',
				minWidth: '10%',
				isAction: true,
				hasDelete: true
			   },
			],
			fieldsList:[
				{
				   name:'序号',
				   field:'idIndex',
				   class:'w30p'
				},
				{
					name: '字典名称',
					field: 'dictName',
					class: 'w30p',
				},
				{
					name:'字典编号',
					field:'dictIndex',
					class: 'w30p'
				}
			],
			fieldsChildList:[
				{
					name: '显示次序',
					field: 'dictItemOrder'
				},
				{
					name:'字典项名称',
					field:'dictItemName'
				},
				{
					name:'字典子项值',
					field:'dictItemValue'
				},
				{
					name:'语言选项',
					field:'dictItemLanguage'
				}
			],
	       pickerOptions0: {
		      disabledDate(time) {
		        return time.getTime() < Date.now() - 8.64e7;
		      }
		    }
	    };
	  },
	  components: {
		  singleTable
	  },
	  created() {
	    
	  },
	  mounted() {
		// const retryableFn=this.useRetryablr(fn,3);
		// retryableFn();
	    this.dictionarylist();
	  },
	  watch: {

	  },
	  methods: {
		// useRetryablr(fn,time){
        //  console.log('调用')
		// },
	  	//搜索接口
	  	searchclick(){
			  this.dictionarylist(); 
	  	},
	  	//
	  	dictionarylist(){
	  		this.tableLoading = true;
	  		let obj={
	  		  dictIndex:this.dictionaryCode,
			  dictName:this.dictionaryName,
			  remark:'',
			  rev:''
	  		}
	  		dictionarySerch(this.currentPage, this.pageSize,obj).then(response => {
				if(response.code === "0") {
					this.tableLoading = false;
					this.allpage = response.data.total;
					this.tableData = response.data.records;	
					for(var i=0;i<this.tableData.length;i++){
						let item=this.tableData[i];
						if(this.currentPage!=1){
						item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
						}else{
						item.idIndex=i+1;
						}
					}
					this.$forceUpdate()
					console.log(this.tableData);				
				}else{
					this.tableLoading = false;
				}
			});
			setTimeout(() => {
				this.tableLoading = false;
			}, 10000);
	  	},
	  	//返回
	  	back(){
	  		this.dictionarychild=false;
	  		this.dictionarylist();
	  	},
	  	//字典项管理
	  	dictionaryentry(item){
	  		console.log(item);
	  		this.childlist=item;
	  		this.dictionarychild=true;		
	  		this.dictionaryentrylist();
	  	},
	  	dictionaryentrylist(){
	  		this.tableLoading = true;
	  		let obj={
	  		  dictIndex:this.childlist.dictIndex
	  		}
	  		dictionarychildSerch(this.currentPagechild, this.pageSizechild,obj).then(response => {
				if(response.code === "0") {
					this.tableLoading = false;
					this.allpagechild = response.data.total;
					this.pricList = response.data.records;	
				}	
			});
	  	},
	  	//增加字典子项
	  	dicchildadd(){
	  	   this.dialogcommitVisible = true;
	  	   
	  	   this.formLabelAlign.dictIndex=this.childlist.dictIndex;
	  	   purchasegetuuid().then(response => {
				if(response.code === "0") {
//				  addobj.uuid=response.data;
				}
		   });
	  	},
	  	//确认添加后
	  	draftsave(){
	  		console.log(this.formLabelAlign)
	       if(this.formLabelAlign.dictItemName==''||this.formLabelAlign.dictItemValue==''||this.formLabelAlign.dictItemOrder==''){
		       	this.$message({
							message: '必填项不能为空!!',
							type: 'error'
						});
	       }else{
		       	dictionarychildadd(this.formLabelAlign).then(response => {
					if(response.code === "0") {
						this.dialogcommitVisible=false;
						this.$message({
							message: '添加成功',
							type: 'success'
						});
              this.formLabelAlign={};
						this.dictionaryentrylist();
					}
			    });
	       }
	  		
	  	},
	  	//删除确认后
	  	delVisibleclick(){
	  		dictionarychilddel(this.delid).then(response => {
				if(response.code === "0") {
					this.dialogdelVisible = false;
					this.$message({
						message: '删除成功',
						type: 'success'
					});
					this.dictionaryentrylist();
				}
		    });
	  	},
	  	//子项删除
	  	dictionarydel(index,item){
			console.log(index,item)
	  		this.dialogdelVisible = true;
	  		this.delid=item.id;
	  	},
	  	//下拉语言选择
	  	subinventoryclick(){
	  		
	  	},
	  	handleClick(tab, event) {
	       console.log(tab, event);
	    },
	    handleSizeChange(val) {
	      this.pageSize = val;
	      this.dictionarylist();
	    },
	    handleCurrentChange(val) {
	      this.currentPage = val;
	      this.dictionarylist();
	    },  
	    handleSizeChangechild(val) {
		  this.pageSizechild=val;
	      this.dictionaryentrylist();
	    },
	    handleCurrentChangechild(val) {
		  this.currentPagechild=val;
	      this.dictionaryentrylist();
	    }  
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.ml{
	margin-left: 10px;
}

.isdictionary{
	.commoncontent{
		  border-radius: 6px;
		  padding: 10px 15px;
		  background: #ffffff;
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

</style>
<style>
.isdictionary .el-form-item{
  width: 100%!important;
}
</style>