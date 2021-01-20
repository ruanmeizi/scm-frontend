<template>
	<div class="container notinthewarehouseboard">
		<div class="commoncontent">
			<!--<p>非在库产品预售看板</p>-->			
			  <div class="actions_part clearfix">
		      	<div class="actions_wrap fl">
			      		<div class="display_ib mr10">
					        <span class="tag">产品编号：</span>
					        <el-autocomplete
				            placeholder="请输入产品编号"
				            class="input_single w200 mr10"
				            v-model.trim="materialCode"
				            :fetch-suggestions="querySearchAsync"
				            @select="handleSelect()"
				          ></el-autocomplete>
					      </div>
				        <div class="display_ib mr10">
					        <span class="tag">时间：</span>
					        <el-date-picker
					          v-model="value1"
					          type="date"
					          format="yyyy-MM-dd"
					          value-format="yyyy-MM-dd"
					          placeholder="选择日期"
					        ></el-date-picker>
					      </div>
			        
			        </div>
			        <div class="down fr">
			          <el-button
			            size="small"
			            type="primary"
			            icon="el-icon-search"
			            circle
			            title="搜索"
			            @click="searchclick"
			          ></el-button>
			          <el-button size="small" type="primary" icon="el-icon-download" circle title="下载"></el-button>
			        </div>
		      </div>		
			 <div class="container_table clearfix mt20" style="">		    
			    <table class="contenttab" cellpadding="0" cellspacing="0">
			    	<thead>
			    		<th>产品编号</th>
			    		<th>物料编号</th>
			    		<th>在库可用库存</th>
			    		<th>后续备货总量(非在库)</th>
			    		<th>可用备货总量(含询单)</th>
			    		<th>后续补货数量</th>
			    		<th>在途</th>
			    		<th>在厂</th>
			    		<th>确认书</th>
			    	</thead>
			    	<tbody>
			    		<tr v-for="(item,index) in notinthewareList">			    			
			    			
			    			<td>
			    				
								<el-popover
			    				  width="775"
								  placement="right"
								  height="300"
								  trigger="click">	
								  <div style="max-height:300px;overflow: auto;" >								  	
								  	<table border="0" class="tableclass prod" cellpadding="0" cellspacing="0" style="text-align: center;">
									  	<thead>
									  		<th>样本信息</th>
									  		<th>供应商</th>
									  		<th>业务渠道</th>
									  		<th>属性</th>
									  		<th>销售订单</th>
									  		<th>客户名称</th>
									  		<th>客户交期</th>
									  		<th>订单交期</th>
									  		<th>系统订单数量</th>
									  		<th>系统未清订单数量</th>
									  		<th>预留数量</th>
									  		<th>预留数量-订单数量</th>
									  		<th>销售助理</th>
									  		<th>交货状态</th>
									  	</thead>
									  	<tbody>
									  		<tr style="height: 40px;" v-if="item.productlist!=''" v-for="i in item.productlist">
									  			<td>{{i.sampleBook}}</td>
									  			<td>{{i.supplierName}}</td>
									  			<td>{{i.channel}}</td>
									  			<td>{{i.attribute}}</td>
									  			<td>{{i.saleOrderId}}</td>
									  			<td>{{i.customerName}}</td>
									  			<td>{{i.orderTime}}</td>
									  			<td>{{i.orderUpdateTime}}</td>
									  			<td>{{i.quantity}}</td>
									  			<td>{{i.availableInventory}}</td>
									  			<td>{{i.inStockSaledInventory}}</td>
									  			<td>{{i.shippedOutInventory}}</td>
									  			<td>{{i.ownedAgentId}}</td>
									  			<td>{{i.orderStatus}}</td>
									  		</tr>
									  		<tr style="height: 40px;" v-else>
									  			<td colspan="8">~~暂无数据~~</td>
									  		</tr>
									  	</tbody>
									  </table>
								  </div>
								   <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="productclick(item,index)">{{item.productCode}}</button>
								</el-popover>										
			    			</td>
			    			<td>
			    				<el-popover
			    				  width=""
								  placement="right"
								  trigger="click">
								 
								  <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="text-align: center;">
								  	<thead>
								  		<th style="width:75px;">物料名称</th>
								  		<th style="width:75px;">物料品牌</th>
								  		<th style="width:75px;">供应商名称</th>
								  		<th style="width:75px;">物料成分</th>
								  		<th style="width:75px;">延米克重</th>
								  		<th style="width: 82px;">幅宽</th>
								  		<th style="width: 82px;">品类</th>
								  		<th style="width: 82px;">产地</th>
								  		<th style="width: 82px;">纱支</th>
								  		<th style="width: 82px;">海关编号</th>
								  		<th style="width:75px;">最小起订量</th>
								  	</thead>
								  	<tbody>
								  		<tr style="height: 40px;" v-if="item.meteriallist.length!=0" v-for="i in item.meteriallist">
								  			<td>{{i.materialName}}</td>
								  			<td>{{i.brand}}</td>
								  			<td>{{i.supplierName}}</td>
								  			<td>{{i.materialComposition}}</td>
								  			<td>{{i.weightPerMeter}}</td>
								  			<td>{{i.width}}</td>
								  			<td>{{i.category}}</td>
								  			<td>{{i.placeOfMaterialion}}</td>
								  			<td>{{i.yarnCount}}</td>
								  			<td>{{i.hsCode}}</td>
								  			<td>{{i.minOrder}}</td>
								  		</tr>
								  		<tr style="height: 40px;" v-else>
								  			<p>~~暂无数据~~</p>
								  		</tr>
								  	</tbody>
								  </table>
								  
								  <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="meterialclick(item,index)">{{item.materialCode}}</button>
								</el-popover>
			    			</td>
			    			<td>
								<el-popover
								   width="300"
								   height="500"
								  placement="right"
								  trigger="click">			 
								  <table border="1" class="tableclass" cellpadding="0" cellspacing="0" style="text-align: center;border: 1px solid #CCCCCC;">
								  	<thead>
								  		<th style="width: 130px;" colspan="1" >职业装</th>
								  		<th style="width: 160px;" colspan="2" >零剪</th>
								  	</thead>
								  	<thead>
								  		<th>11库</th>
								  		<th>51库</th>
								  		<th>52库</th>
								  	</thead>
								  	<tbody>
								  		<tr style="height: 40px;" v-if="item.instocklist.length!=0" v-for="i in item.instocklist">
								  			<td>{{i.availQuantity1}}</td>
								  			<td>{{i.availQuantity2}}</td>
								  			<td>{{i.availQuantity3}}</td>
								  		</tr>
								  		<tr style="height: 40px;" v-else>
								  			<p>~~暂无数据~~</p>
								  		</tr>
								  	</tbody>
								  </table>			  
								  <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="availableclick(item,index)">
								  	{{item.inStockInventory?item.inStockInventory:"0"}}
								  </button>
								</el-popover>
			    			</td>
			    			<td>
			    				<el-popover
								  placement="right"
								  width="650"
								  trigger="click">
								 
								  <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="text-align: center;">
								  	<thead>
								  		<th style="width: 150px;">后续备货明细</th>
								  		<th style="width: 150px;">在途</th>
								  		<th style="width: 150px;">在厂(在产+成品)</th>
								  		<th style="width: 15
								  			0px;">询单</th>
								  		<th style="width: 150px;">非在库预售差异</th>
								  	</thead>
								  	<tbody>
								  		<tr style="height: 40px;" v-if="item.availablelist.length!=0" v-for="i in item.availablelist">
								  			<td>{{i.stockDetails}}</td>
								  			<td>{{i.shippmentInventory}}</td>
								  			<td>{{i.inProductionNumber+i.cargoQuantity}}({{i.inProductionNumber}}+{{i.cargoQuantity}})</td>
								  			<td>{{i.purchaseOrderItemDraft}}</td>
								  			<td>{{i.subsequentReady}}</td>		  			
								  		</tr>
								  		<tr style="height: 40px;" v-else>
								  			<p>~~暂无数据~~</p>
								  		</tr>
								  	</tbody>
								  </table>
								  
								 <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="subsequentclick(item,index)">{{item.subsequentReady}}</button>
								</el-popover>
			    			</td>
			    			<td>
			    				{{item.subsequentReadyAll}}
			    			</td>
			    			<td>
			    				<el-popover
								  placement="right"
								  width="600"
								  trigger="click">								  
								  
								<el-tabs v-model="activeName" @tab-click="handleClick">
								    <el-tab-pane label="询单" name="first" >
								    	 <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
										  	<thead>
										  		<th style="width: 150px;">数量</th>
										  		<th style="width: 150px;">日期</th>
										  	</thead>
										  	<tbody>
										  		<tr style="height: 40px;" v-if="item.isscheduledlist.length!=0" v-for="i in item.isscheduledlist">
										  			<td>{{i.number}}</td>
										  			<td>{{i.detailDate}}</td>										  			
										  		</tr>
										  		<tr style="height: 40px;" v-else>
										  			<p>~~暂无数据~~</p>
										  		</tr>
										  	</tbody>
										  </table>
								    
								    </el-tab-pane>
								    <el-tab-pane label="非询单" name="second">
								    	 <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
										  	<thead>
										  		<th style="width: 150px;">数量</th>
										  		<th style="width: 150px;">日期</th>
										  	</thead>
										  	<tbody>
										  		<tr style="height: 40px;" v-if="item.notscheduledlist.length!=0" v-for="i in item.notscheduledlist">
										  			<td>{{i.number}}</td>
										  			<td>{{i.orderDateTime}}</td>										  			
										  		</tr>
										  		<tr style="height: 40px;" v-else>
										  			<p>~~暂无数据~~</p>
										  		</tr>
										  	</tbody>
										  </table>
								    	
								    </el-tab-pane>
								 </el-tabs>
								  <p>总计：{{item.scheduledReceipt}}</p>
								  <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="scheduledclick(item,index)">{{item.scheduledReceipt}}</button>
								</el-popover>	    			  
			    			</td>
			    			<td>
			    				<el-popover
								  placement="right"
								  width="600"
								  trigger="click">
								  <div class="nottab">
								  	<table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
									  	<thead>
									  		<th style="width: 150px;">数量</th>
									  		<th style="width: 150px;">日期</th>
									  		<th style="width: 150px;">预计到库日期</th>
									  	</thead>
									  	<tbody>
									  		<tr style="height: 40px;" v-if="item.shippmentlist.length!=0" v-for="i in item.shippmentlist">
									  			<td>{{i.number}}</td>
									  			<td>{{i.detailDate}}</td>	
									  			<td>{{i.expectedDate}}</td>
									  		</tr>
									  		<tr style="height: 40px;" v-else>
									  			<p>~~暂无数据~~</p>
									  		</tr>
									  	</tbody>
									 </table>		
								  </div>
								 						 
								  <p>总计：{{item.shippmentInventory}}</p>
								  <button slot="reference" style="border-bottom: 1px solid #409eff;"  @click="shippmentclick(item,index)">{{item.shippmentInventory}}</button>
								</el-popover>
			    			</td>
			    			<td>
			    				<el-popover
								  placement="right"
								  width="600"
								  trigger="click">								  
								  <el-tabs v-model="activeNameagain" @tab-click="handleClick">
								  	 
									    <el-tab-pane label="货妥" name="first" >
									    	<table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
											  	<thead>
											  		<th style="width: 150px;">数量</th>
											  		<th style="width: 150px;">日期</th>
											  	</thead>
											  	<tbody>
											  		<tr style="height: 40px;" v-if="item.inFactoryDetailList.length!=0" v-for="i in item.inFactoryDetailList">
											  			<td>{{i.cargoQuantity}}</td>
											  			<td>{{i.detailDate}}</td>										  			
											  		</tr>
											  		<tr style="height: 40px;" v-else>
											  			<p>~~暂无数据~~</p>
											  		</tr>
											  	</tbody>
											  </table>
									    
									    </el-tab-pane>
									    <el-tab-pane label="在产" name="second">
									    	<table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
											  	<thead>
											  		<th style="width: 150px;">数量</th>
											  		<th style="width: 150px;">日期</th>
											  	</thead>
											  	<tbody>
											  		<tr style="height: 40px;" v-if="item.inProductionDetailList.length!=0" v-for="i in item.inProductionDetailList">
											  			<td>{{i.cargoQuantity}}</td>
											  			<td>{{i.detailDate}}</td>										  			
											  		</tr>
											  		<tr style="height: 40px;" v-else>
											  			<p>~~暂无数据~~</p>
											  		</tr>
											  	</tbody>
											  </table>									    	
									    </el-tab-pane>
								   </el-tabs>	
								   <p>总计：{{item.inFactoryInventory}}</p>
								  <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="inFactoryclick(item,index)">{{item.inFactoryInventory}}</button>
								</el-popover>
			    			</td>
			    			<td>
			    				
			    				<el-popover
								  placement="right"
								  width="600"
								  trigger="click">								  
								  
								<el-tabs v-model="activeName" @tab-click="handleClick">
								    <el-tab-pane label="货妥" name="first" >
								    	 <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
										  	<thead>
										  		<th style="width: 150px;">确认书号</th>
										  		<th style="width: 150px;">确认书数量</th>
										  	</thead>
										  	<tbody>
										  		<tr style="height: 40px;" v-if="item.inFactorylist.length!=0" v-for="i in item.inFactorylist">
										  			<td>{{i.confirmNumbers}}</td>
										  			<td>{{i.amount}}</td>										  			
										  		</tr>
										  		<tr style="height: 40px;" v-else>
										  			<p>~~暂无数据~~</p>
										  		</tr>
										  	</tbody>
										  </table>
								    
								    </el-tab-pane>
								    <el-tab-pane label="在产" name="second">
								    	 <table border="0" class="tableclass" cellpadding="0" cellspacing="0" style="width:100%;text-align: center;">
										  	<thead>
										  		<th style="width: 150px;">确认书号</th>
										  		<th style="width: 150px;">确认书数量</th>
										  	</thead>
										  	<tbody>
										  		<tr style="height: 40px;" v-if="item.inProductionlist.length!=0" v-for="i in item.inProductionlist">
										  			<td>{{i.confirmNumbers}}</td>
										  			<td>{{i.amount}}</td>										  			
										  		</tr>
										  		<tr style="height: 40px;" v-else>
										  			<p>~~暂无数据~~</p>
										  		</tr>
										  	</tbody>
										  </table>
								    	
								    </el-tab-pane>
								</el-tabs>
								  <button slot="reference" style="border-bottom: 1px solid #409eff;" @click="confirmclick(item,index)">{{item.confirmNumbers}}</button>
								</el-popover>	    			  
			    						    							    				
			    			</td>
			    		</tr>
			    	</tbody>
			    </table>
			    
			    <div class="paging" style="margin-top: 20px;float:right;height: 30px;">
					<div class="block">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10,50]" :page-size="pageSize" layout="sizes,total, prev, pager, next" :total="this.allpage">
						</el-pagination>
					</div>
			    </div>
			    
			 </div>
			
		</div>
		
	</div>
</template>

<script>
import { 
	notinthewareserch,
	instockdetails,
	meterialdetails,
	productdetails,
	subsequentdetails,
	scheduleddetails,
	onthewaydetails,
	inFactorydetails,
	confirmnumbersdetails,
	productboardCode
} from "@/api/module/materialboardApi.js";
	export default {
	  name: "notinthewarehouseboard",
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
	       notinthewareList:[],
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
	     this.notintheWareHouseSearch();
	     var day=new Date();
	     day.setTime(day.getTime());
	     var s2 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
	     this.value1=s2;
	  },
	  watch: {
	    
	    
	  },
	  methods: {  	
	  	querySearchAsync(queryString, cb) {
	    	console.log(queryString)
	    	productboardCode(queryString.replace("/","")).then(response => {
	        if (response.code === "0") {
	          var restaurants = response.data;
				    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;				
				    clearTimeout(this.timeout);
				    this.timeout = setTimeout(() => {
				      cb(results);
				    },500 * Math.random());	         
	        }
	      });
	  },
	  createStateFilter(queryString) {
		  	console.log(queryString)
	        return (combinedMaterialCode) => {
	        	console.log(combinedMaterialCode)
	        	return combinedMaterialCode;
	//        return (combinedMaterialCode.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
	        };
        },
	    handleSelect(item) {
	        console.log(item);
	    },
	  	//列表分页
	  	notintheWareHouseSearch(){
            let obj={
            	materialCode:this.materialCode.replace("/",""),
            	dvanceSale:"isDvanceSale",
            	detailType:"product",
            	validDate:this.value1
            }
          
            const loading = this.$loading({
		        lock: true,
		        text: 'Loading',
		        spinner: 'el-icon-loading',
		        background: 'rgba(0, 0, 0, 0.7)'
		    });
           notinthewareserch(this.currentPage, this.pageSize, obj).then(response => {
				if(response.code === "0") {
					this.allpage = response.data.totalElements;
					this.notinthewareList = response.data.content;
					loading.close();
				} else {
					loading.close();
				}
			});
			setTimeout(() => {
				loading.close();
			}, 10000);
	  	},
	  	//物料编号详情
	  	meterialclick(item,index){
	  		meterialdetails(item.materialCode,"product",this.value1,item.productCode).then(response => {
				if(response.code === "0") {
			  		var meterial= [response.data.data];
					item.meteriallist=meterial;
					this.$forceUpdate();
					console.log(item)
				}
			});
	  	},
	  	//产品编号
	  	productclick(item,index){
	  		productdetails(item.productCode,"product",this.value1).then(response => {
				if(response.code === "0") {
			  		var meterial= response.data;
					item.productlist=meterial;
					this.$forceUpdate();
					console.log(item)
				}
			});
	  	},
	  	//再库可用库存详情
	  	availableclick(item,index){
	  		let obj={
	  			materialCode:item.materialCode,
	  			productCode:item.productCode,
	  			detailType:"product",
            	validDate:this.value1
	  		}
	  		instockdetails(obj).then(response => {
				if(response.code === "0") {
			  		var available= [response.data];
					item.instocklist=available;
					this.$forceUpdate();
					console.log(item)
				}
			});
	  	},
	  	//后续备货总量（非在库）
	  	subsequentclick(item,index){
	  		let obj={
	  			materialCode:item.materialCode,
	  			productCode:item.productCode,
	  			shippmentInventory:item.shippmentInventory,
	  			shippmentInventory2:item.shippmentInventory2,
	  			inProduceInventory:item.inProduceInventory,
	  			inFactoryInventory:item.inStockMaterialInventory,
	  			purchaseOrderItemDraft:item.purchaseOrderItemDraft,
	  			dvanceSale:"isDvanceSale",
	  			detailType:"product",
            	validDate:this.value1
	  		}
	  		subsequentdetails(obj).then(response => {
				if(response.code === "0") {
			  		var available= [response.data];
					item.availablelist=available;
					this.$forceUpdate();
					console.log(item)
				}
			});
	  	},
	  	//预计入库量
	  	scheduledclick(item,index){
	  		console.log(item)
	  		console.log(item.materialCode)
	  		let obj={
	  			materialCode:item.materialCode,
	  			productCode:item.productCode,
	  			dvanceSale:"isDvanceSale",
	  			detailType:"product",
            	validDate:this.value1
	  		}
	  		scheduleddetails(obj).then(response => {
				if(response.code === "0") {
					for(var i=0;i<response.data.isOrder.length;i++){
			  			let data=response.data.isOrder[i];
			  			if(data.detailDate!=null&&data.detailDate!=''){
			  				data.detailDate=data.detailDate.substring(0, 10);
			  			}		
			  		}
			  		for(var j=0;j<response.data.notOrder.length;j++){
			  			let data=response.data.notOrder[j];
			  			if(data.orderDateTime!=null&&data.orderDateTime!=''){
			  				data.orderDateTime=data.orderDateTime.substring(0, 10);
			  			}
			  		}
					var value=response.data;
			  		var keyname="isscheduledlist";
			  		var keynameorder='notscheduledlist';
			  		item[keynameorder]=value.notOrder;
			  		this.messageappend(item,value.isOrder,keyname)
			  		console.log(item)
			  		console.log(item.isscheduledlist.length)
				}
			});
	  	},
	  	//在途
	  	shippmentclick(item,index){
	  		let obj={
            	materialCode:item.materialCode,
            	productCode:item.productCode,
            	dvanceSale:"isDvanceSale",
            	detailType:"product",
            	validDate:this.value1
            }
	  		onthewaydetails(obj).then(response => {
				if(response.code === "0") {
					console.log(response.data)
					for(var i=0;i<response.data.length;i++){
			  			let data=response.data[i];
			  			if(data.detailDate!=null&&data.detailDate!=''){
			  				data.detailDate=data.detailDate.substring(0, 10);
			  			}		
			  			if(data.expectedDate!=null&&data.expectedDate!=''){
			  				data.expectedDate=data.expectedDate.substring(0, 10);
			  			}
			  		}
					var value=response.data;
			  		var keyname="shippmentlist";
			  		this.messageappend(item,value,keyname)
				}
			});
	  	},
	  	//在厂
	  	inFactoryclick(item,index){
	  		let obj={
            	materialCode:item.materialCode,
            	productCode:item.productCode,
            	dvanceSale:"isDvanceSale",
            	detailType:"product",
            	validDate:this.value1
            }
	  		inFactorydetails(obj).then(response => {
				if(response.code === "0") {
					for(var i=0;i<response.data.inFactoryDetailList.length;i++){
			  			let data=response.data.inFactoryDetailList[i];
			  			if(data.detailDate!=null&&data.detailDate!=''){
			  				data.detailDate=data.detailDate.substring(0, 10);
			  			}		
			  		}
			  		for(var j=0;j<response.data.inProductionDetailList.length;j++){
			  			let data=response.data.inProductionDetailList[j];
			  			if(data.detailDate!=null&&data.detailDate!=''){
			  				data.detailDate=data.detailDate.substring(0, 10);
			  			}
			  		}
					var value=response.data;
			  		var keyname="inFactoryDetailList";
			  		var keynameorder='inProductionDetailList';
			  		item[keynameorder]=value.inProductionDetailList;
			  		this.messageappend(item,value.inFactoryDetailList,keyname)
				}
			});
	  	},
	  	confirmclick(item,index){
	  		console.log(item)
	  		console.log(item.materialCode)
	  		let obj={
	  			materialCode:item.materialCode,
	  			productCode:item.productCode,
	  			dvanceSale:"isDvanceSale",
	  			detailType:"product",
            	validDate:this.value1
	  		}
	  		confirmnumbersdetails(obj).then(response => {
				if(response.code === "0") {
					console.log(response.data.inFactory)
					var value=response.data;
					var keynameorder='inFactorylist';
					var keyname="inProductionlist";
			  		item[keynameorder]=[value.inFactory];
			  		item[keyname]=[value.inProduction];
			  		console.log(item)
			  		this.$forceUpdate()
//					for(var i=0;i<response.data.isOrder.length;i++){
//			  			let data=response.data.isOrder[i];
//			  			if(data.detailDate!=null&&data.detailDate!=''){
//			  				data.detailDate=data.detailDate.substring(0, 10);
//			  			}		
//			  		}
//			  		for(var j=0;j<response.data.notOrder.length;j++){
//			  			let data=response.data.notOrder[j];
//			  			if(data.orderDateTime!=null&&data.orderDateTime!=''){
//			  				data.orderDateTime=data.orderDateTime.substring(0, 10);
//			  			}
//			  		}
//					var value=response.data;
//			  		var keyname="isscheduledlist";
//			  		var keynameorder='notscheduledlist';
//			  		item[keynameorder]=value.notOrder;
//			  		this.messageappend(item,value.isOrder,keyname)
//			  		console.log(item)
//			  		console.log(item.isscheduledlist.length)
				}
			});
	  	},
	  	handleClick(tab, event) {
	       console.log(tab, event);
	    },
	  	messageappend(item,value,keyname){
	  		item[keyname]=value;
		  	this.$forceUpdate()
	  	},
	  	//搜索
	  	searchclick(){
	  		this.notintheWareHouseSearch();
	  	},
	    handleSizeChange(val) {
	      this.pageSize = val;
	      this.notintheWareHouseSearch();
	    },
	    handleCurrentChange(val) {
	      this.currentPage = val;
	      this.notintheWareHouseSearch();
	    }
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.notinthewarehouseboard{
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}
.calendar-day{
    text-align: center;
    color: #202535;
    line-height:20px;
    font-size: 12px;
}
.is-selected{
    color: #F8A535;
    font-size: 10px;
    margin-top: 5px;
}
#calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
    content: '当月';
}
ul.formlist{
	width: 100%;
	height: 40px;
	display: flex;
	/*border-bottom: 1px solid #EBEEF5;*/
	li{
		/*border-bottom: 1px solid #C0C0C0;*/
	}
	li:last-child{
		/*border-bottom: none;*/
	}
}
table.prod{
	thead{
		position:absolute;
		th:nth-child(9){
			width:70px;
		}
		th:nth-child(10){
			width:70px;
		}
		th:nth-child(12){
			width:70px;
		}
		th{
			width:50px;
		}	
	}
	tbody{
		tr{
			clear:both;
			td{
				width:50px;
			}
			td:nth-child(9){
				width:70px;
			}
			td:nth-child(10){
				width:70px;
			}	
			td:nth-child(12){
				width:70px;
			}
		}
		tr:first-child{
			td{
				padding-top:65px;
			}
		}
	}
}
table.tableclass{
	thead{
		background: #f5f7fa;
		color: #909399;
		th{
			padding: 10px 0;
		}		
	}
	tbody{
		tr{
			td{
				padding: 10px 0;
			}
		}
	}
}
table.contenttab{
	tbody{
		tr{
			td{
				font-size: 14px;
				color: #606266;
			}
		}
	}
}
</style>
<style>
	button.el-popover__reference {
	    font-size: 14px;
	    color: #606266;
	}
</style>