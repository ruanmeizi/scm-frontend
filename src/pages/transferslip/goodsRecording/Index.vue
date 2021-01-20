<template>
  <div class="container goodsRecording">
    <div class="actions_part clearfix">
    	<div class="actions_wrap">
    		<div class="display_ib mr10 mb10">
          <span class="tag">付款状态：</span>
          <el-select class="select_single w200 mr10"
            v-model="paidStatus"
            @change="searchHandle"
            placeholder="请选择付款状态">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in payStatusList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
	      <div class="display_ib mr10 mb10">
          <span class="tag">货妥时间：</span>
          <el-date-picker class="mr10"
            v-model="dateVal"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
		    </div>
	      <div class="display_ib mr10 mb10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
		    </div>
         <div class="display_ib mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select class="select_single w200 mr10"
            v-model="supplierCode"
            filterable
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierCode"
              :value="item.supplierId">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">可发运：</span>
          <el-select class="select_single w200 mr10"
            v-model="despatch"
            @change="searchHandle"
            placeholder="请选择可发运状态">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in canBeShippedList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="actions_btn_wrap down t_right">
        <el-button type="primary" @click="excelDownload">导出Excel</el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          circle
          title="搜索"
          @click="searchHandle"
        ></el-button>
        <!-- <el-button
          size="small"
          type="primary"
          icon="el-icon-download"
          circle
          title="下载"
          @click="downloadHandle"
        ></el-button> -->
      </div>
    </div>

    <div class="table_part clearfix">
      <singleTable
        :tableList="cargoList"
        :tableLeaderFieldsList="leaderFieldsList"
        :tableTailFieldsList="tailFieldsList"
        :tableFieldsList="fieldsList"
        :tableParentFieldsList="parentFieldsList"
        :tableLoading="tableLoading"
        @payHandle="payHandle"
      ></singleTable>
      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50, 500]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total">
        </el-pagination>
			</div>
    </div>
     
    <!--发起付款-->
    <el-dialog
      title="付款计划单"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogSponsorVisible"
      width="80%">
      <table class="contenttab" cellpadding="0" cellspacing="0">
			    	<thead>
			    		  <th v-for="(item, index) in goodFieldNameChildList" :key="index">{{item.name}}</th>
			    	</thead>
			    	<tbody>
			    		<tr>
			    			<td :title="Sponsorlist.materialCode">{{Sponsorlist.materialCode ? Sponsorlist.materialCode : ''}}</td>
			    			<td :title="Sponsorlist.supplierShortName">{{Sponsorlist.supplierShortName ? Sponsorlist.supplierShortName : ''}}</td>
			    			<!-- <td :title="Sponsorlist.supplierName">{{Sponsorlist.supplierName ? Sponsorlist.supplierName : ''}}</td> -->
			    			<td :title="Sponsorlist.confirmingCode">{{Sponsorlist.confirmingCode ? Sponsorlist.confirmingCode : ''}}</td>
			    			<td>
			    				<div v-if="Sponsorlist.purchaseMeasurementUnit=='米'" :title="Sponsorlist.confirmPackages+'包'+Sponsorlist.packSpecification+'米/包'+Sponsorlist.confirmQuantity+Sponsorlist.purchaseMeasurementUnit">
			    					  {{(Sponsorlist.confirmPackages ? Sponsorlist.confirmPackages : '0') + '包 '}}
					    				{{(Sponsorlist.packSpecification ? Sponsorlist.packSpecification : '0') + '米/包 '}}
					    				{{(Sponsorlist.confirmQuantity ? Sponsorlist.confirmQuantity : '0') + Sponsorlist.purchaseMeasurementUnit}}
			    				</div>
			    				<div v-else :title="Sponsorlist.confirmQuantity+Sponsorlist.purchaseMeasurementUnit">
			    						<span v-if="Sponsorlist.purchaseMeasurementUnit!=null&&Sponsorlist.purchaseMeasurementUnit!=''">
			    							{{(Sponsorlist.confirmQuantity ? Sponsorlist.confirmQuantity : '0') +Sponsorlist.purchaseMeasurementUnit}}
			    						</span>
			    						<span v-else>{{(Sponsorlist.confirmQuantity ? Sponsorlist.confirmQuantity : '0') +'条'}}</span>
			    				</div>
			    			</td>
			    			<td>
			    				<div v-if="Sponsorlist.purchaseMeasurementUnit=='米'" :title="Sponsorlist.readyBagQuantity+'包'+Sponsorlist.packSpecification+'米/包'+Sponsorlist.readyMeter+Sponsorlist.purchaseMeasurementUnit">
			    					  {{(Sponsorlist.readyBagQuantity ? Sponsorlist.readyBagQuantity : '0') + '包 '}}
					    				{{(Sponsorlist.packSpecification ? Sponsorlist.packSpecification : '0') + '米/包 '}}
					    				{{(Sponsorlist.readyMeter ? Sponsorlist.readyMeter : '0') + Sponsorlist.purchaseMeasurementUnit}}
			    				</div>
			    				<div v-else :title="Sponsorlist.readyMeter+Sponsorlist.purchaseMeasurementUnit">
			    					<span v-if="Sponsorlist.purchaseMeasurementUnit!=null&&Sponsorlist.purchaseMeasurementUnit!=''">
			    						{{(Sponsorlist.readyMeter ? Sponsorlist.readyMeter : '0') + Sponsorlist.purchaseMeasurementUnit}}
			    					</span>
			    					<span v-else>{{(Sponsorlist.readyMeter ? Sponsorlist.readyMeter : '0') + '条'}}</span>
			    				</div>
			    			</td>
			    			<td>
			    				<div v-if="Sponsorlist.purchaseMeasurementUnit=='米'" :title="Sponsorlist.applyPaidBagQuantity+'包'+Sponsorlist.applyPaidBagMeter+'米/包'+Sponsorlist.applyPaidMeter+Sponsorlist.purchaseMeasurementUnit">
			    					{{(Sponsorlist.applyPaidBagQuantity ? Sponsorlist.applyPaidBagQuantity : '0') + '包 '}}
				    				{{(Sponsorlist.applyPaidBagMeter ? Sponsorlist.applyPaidBagMeter : '0') + '米/包 '}}
				    				{{(Sponsorlist.applyPaidMeter ? Sponsorlist.applyPaidMeter : '0') + Sponsorlist.purchaseMeasurementUnit}}
			    				</div>
			    				<div v-else :title="Sponsorlist.applyPaidMeter+Sponsorlist.purchaseMeasurementUnit">
			    					<span v-if="Sponsorlist.purchaseMeasurementUnit!=null&&Sponsorlist.purchaseMeasurementUnit!=''">
			    						{{(Sponsorlist.applyPaidMeter ? Sponsorlist.applyPaidMeter : '0') + Sponsorlist.purchaseMeasurementUnit}}
			    					</span>
			    					<span v-else>{{(Sponsorlist.applyPaidMeter ? Sponsorlist.applyPaidMeter : '0') + '条'}}</span>
			    				</div>
			    			</td>
			    			<td :title="Sponsorlist.offeredDate">{{Sponsorlist.offeredDate ? Sponsorlist.offeredDate : ''}}</td>
			    			<td :title="Sponsorlist.readyDate">{{Sponsorlist.readyDate ? Sponsorlist.readyDate : ''}}</td>
			    		</tr>
			    	</tbody>
			</table>
			<div id="" class="pt">
				<span>申请付款数量</span>
				
				<div v-if="Sponsorlist.purchaseMeasurementUnit=='米'" style="display: inline-block;">
					  <div class="display_ib ml2">
	            <el-input-number size="small" :title="applyPaidBagQuantity" v-model="applyPaidBagQuantity" controls-position="right" @change="handleChange" :min="1"></el-input-number>
	            <span class="display_ib" title="包">包</span>
	          </div>
	          <div class="display_ib ml">
	            <el-input-number
	              size="small"
	              :disabled="true"
	              :precision="2"
	              :title="Sponsorlist.packSpecification"
	              v-model.trim="applyPaidBagMeter=Sponsorlist.packSpecification"
	              controls-position="right"
	              @change="handleChange"
	              :min="1"
	            ></el-input-number>
	            <span class="display_ib" title="米/包">米/包</span>
	          </div>
	          <div class="display_ib ml2">
	          	<em  v-model.trim="this.applyPaidMeter=applyPaidBagQuantity*Sponsorlist.packSpecification">{{floatfilters(applyPaidBagQuantity*Sponsorlist.packSpecification)}}</em>
	            <span class="display_ib ml" title="米">米</span>
	          </div>
				</div>
				<div v-else style="display: inline-block;">
					  <div class="display_ib ml2">
	            <el-input-number size="small"  v-model="applyPaidMeter" controls-position="right" @change="handleChangeUnit" :min="1"></el-input-number>
	            <span class="display_ib" v-if="Sponsorlist.purchaseMeasurementUnit!=null" title="Sponsorlist.purchaseMeasurementUnit">{{Sponsorlist.purchaseMeasurementUnit}}</span>
	            <span class="display_ib" v-else>条</span>
	          </div>
				</div>
          
			</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSponsorVisible = false">取 消</el-button>
        <el-button type="primary" @click="SponsorVisibleclick()" v-preventReClick>确认调拨</el-button>
      </span>
    </el-dialog>    
    
  </div>
</template>

<script>
import { goodsRecordingList, dictList, createPayProcess,sponsorPayment,purchasegetuuid} from "@/api/module/goodsRecordingApi.js";
import {
  supplierDictList,
  constDictList,
  subInventoryTypeList
} from "@/api/publicApi.js";
import {
  fabricPaymentMethod
} from "@/api/module/dictionariesApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { timeFormat, timeFormatGMT,cutOutNum,getTimeRange,excelDateFormatToDate} from '@/utils/index.js';
import Excel from '@/layouts/components/Excel.vue';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
export default {
  name: "goodsRecording",
  data() {
    return {
      tableLoading: true,
      materialCode: '',
      readyDateEnd: '',
      readyDateStart: '',
      paidStatus: '',
      despatch:'',
      cargoList: [],
      payStatusList: [],
      Sponsorlist:[],
      supplierList:[],
      inventoryList:[],
      subInventoryList:[],
      dateVal: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      dialogSponsorVisible:false,
      applyPaidBagQuantity:'',
      applyPaidMeter:'',
      applyPaidBagMeter:'',
      supplierCode:'',
      paymentMethodList:[],
      expands:[],
      canBeShippedList:[
       {
         name:'是',
         index:1
       },
       {
         name:'否',
         index:2
       }
      ],
      goodFieldNameList: [
        {
        	
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '供应商',
          class: 'w9p'
        },
        {
          name: '确认书号',
          class: 'w8p'
        },
        {
          name: '确认书数量',
          class: 'w9p'
        },
        {
          name: '货妥数量',
          class: 'w9p'
        },
        {
          name: '已申请付款数量',
          class: 'w9p'
        },
        {
          name: '付款方式',
          class: 'w8p'
        },
        {
          name: '工厂交期',
          class: 'w8p'
        },
        {
          name: '货妥时间',
          class: 'w8p'
        },
        {
          name: '付款状态',
          class: 'w8p'
        },
        {
          name: '',
          class: 'w6p'
        }
      ],
      goodFieldNameChildList:[
        {
        	
          name: '物料编号',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '确认书号',
          class: 'w10p'
        },
        {
          name: '确认书数量',
          class: 'w10p'
        },
        {
          name: '货妥数量',
          class: 'w10p'
        },
        {
          name: '已申请付款数量',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '货妥时间',
          class: 'w10p'
        }
        
      ],
      // 列表组件数据
      leaderFieldsList: [
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w50p',
          width: '150'
        }
      ],
      tailFieldsList: [
        // {
        //   name: '操作',
        //   field: '',
        //   class: '',
        //   width: '80',
        //   isAction: true
        // }
      ],
      fieldsList: [
        {
          name: '供应商',
          // field: 'supplierName',
          field: 'supplierShortName',
          class: 'w10p',
          width: '150'
        },
        {
          name: '确认书号',
          field: 'confirmingCode',
          class: 'w7p',
          width: '150'
        },
        {
          name: '计划预留米数',
          field: 'producedMeter',
          class: 'w7p',
          width: '150'
        },
        {
          name: '确认书数量',
          field_1: 'confirmPackages',
          field_2:'packSpecification',
          field_3:'confirmQuantity',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {
          name: '货妥数量',
          field_1: 'readyBagQuantity',
          field_2:'packSpecification',
          field_3:'readyMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {          
          name: '已申请付款数量',
          field_1: 'applyPaidBagQuantity',
          field_2:'applyPaidBagMeter',
          field_3:'applyPaidMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {          
          name: '剩余未调拨数量',
          field_1: 'restOfPaidBagQuantity',
          field_2:'restOfPaidBagMeter',
          field_3:'restOfPaidMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
         {
          name: '仓位',
          field: 'inventoryName',
          class: 'w8p',
          width: '150'
        },
         {
          name: '库位',
          field: 'subInventoryName',
          class: 'w8p',
          width: '150'
        },
        {
          name: '付款方式',
          field: 'paymentMethodName',
          class: 'w8p',
          width: '150'
        },
        {
          name: '工厂交期',
          field: 'offeredDate',
          class: 'w6p',
          width: '150'
        },
        {
          name: '货妥时间',
          field: 'readyDate',
          class: 'w6p',
          width: '150'
        },
        {
          name: '船样确认',
          field: 'ableShipmentsName',
          class: 'w2p',
          width: '100'
        },
        {
          name: '可发运',
          field: 'despatch',
          class: 'w2p',
          width: '100'
        },
        {
          name: '付款状态',
          field: 'paidStatusName',
          class: 'w5p',
          width: '100'
        }
      ],
      parentFieldsList:[
         {
          name: '物料编号',
          field: 'materialCode',
          class: 'w50p',
          width: '150'
        },
        {
          name: '供应商',
          // field: 'supplierName',
          field: 'supplierShortName',
          class: 'w10p',
          width: '150'
        },
        {
          name: '确认书号',
          field: 'confirmingCode',
          class: 'w7p',
          width: '150'
        },
        {
          name: '确认书数量',
          field_1: 'confirmPackages',
          field_2:'packSpecification',
          field_3:'confirmQuantity',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {
          name: '货妥数量',
          field_1: 'readyBagQuantity',
          field_2:'packSpecification',
          field_3:'readyMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {          
          name: '已申请付款数量',
          field_1: 'applyPaidBagQuantity',
          field_2:'applyPaidBagMeter',
          field_3:'applyPaidMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
        {          
          name: '剩余未调拨数量',
          field_1: 'restOfPaidBagQuantity',
          field_2:'restOfPaidBagMeter',
          field_3:'restOfPaidMeter',
          class: 'w7p',
          width: '150',
          isOffereds:true
        },
         {
          name: '仓位',
          field: 'inventoryName',
          class: 'w8p',
          width: '150'
        },
         {
          name: '库位',
          field: 'subInventoryName',
          class: 'w8p',
          width: '150'
        },
        {
          name: '付款方式',
          field: 'paymentMethodName',
          class: 'w8p',
          width: '150'
        },
        {
          name: '工厂交期',
          field: 'offeredDate',
          class: 'w6p',
          width: '150'
        },
        {
          name: '货妥时间',
          field: 'readyDate',
          class: 'w6p',
          width: '150'
        },
        {
          name: '船样确认',
          field: 'ableShipmentsName',
          class: 'w2p',
          width: '100'
        },
        {
          name: '可发运',
          field: 'despatch',
          class: 'w2p',
          width: '100'
        },
        {
          name: '付款状态',
          field: 'paidStatusName',
          class: 'w5p',
          width: '100'
        }
      ]
    };
  },
  components: {
    singleTable
  },
  created() {},
  mounted() {
    // this.getInventoryList();
    this.getDictList();
    // this.getGoodsRecordingList();
    this.getPaymentMethod();
    this.getSupplierDictList();
    this.fun_date();
  },
  watch: {},
  methods: {
    getInventoryList() {
      // 仓位
      constDictList('VirtualInventory').then(res => {
        // console.log('仓位列表数据：', res);
        if (res.code === '0') {
          this.inventoryList = res.data;
        }
      });
    },
     getSupplierDictList() {
      supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    // 固定展示为两周后的时间范围
    fun_date() {
      this.dateVal=getTimeRange(-90);
      this.searchHandle();
    },
    // 导出
    excelDownload() {
      let headerList = ['物料编号','供应商','确认书号','确认书包数','确认书米/包','确认书米数','货妥包数','货妥米/包','货妥米数','已申请付款包数','已申请付款米/包','已申请付款米数','剩余未调拨包数','剩余未调拨米/包','剩余未调拨米数','仓位','库位','付款方式','工厂交期','货妥时间','船样确认','可发运','付款状态'];
      let fieldsList = ['materialCode', 'supplierShortName', 'confirmingCode', 'confirmPackages', 'packSpecification', 'confirmQuantity','readyBagQuantity','packSpecification','readyMeter','applyPaidBagQuantity','applyPaidBagMeter','applyPaidMeter','restOfPaidBagQuantity','restOfPaidBagMeter','restOfPaidMeter','inventoryName','subInventoryName','paymentMethodName','offeredDate','readyDate','ableShipmentsName','despatch','paidStatusName'];
      // this.parentFieldsList.forEach(hItem => {
      //   headerList.push(hItem.name);
      // });
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.cargoList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '货妥记录',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      console.log(filterVal, jsonData)
      return jsonData.map(v => filterVal.map(j => v[j]));
      console.log(jsonData.map(v => filterVal.map(j => v[j])));
    },
  	// 付款方式
  	getPaymentMethod(){
  		fabricPaymentMethod().then(res => {
				if(res.code === '0') {					
					this.paymentMethodList = res.data;
				}
			});
  	},
  	// 获取付款方式名称
  	paymentMethodNameHandle(code) {
      this.paymentMethodList.filter(item => {
        if (item.dictItemValue == code) return item.dictItemName;
      });
  		// for(var i=0;i<this.paymentMethodList.length;i++){
      // 	let item=this.paymentMethodList[i];
      // 	if(item.dictItemValue == code){
      // 		return item.dictItemName
      // 	}
      // }
  	},
  	//加减输入框触发
    handleChange(value) {
      if(value==undefined){
    		this.$message({
	          message: '数值不能为空,请重新输入！！！',
	          type: 'error'
	        });
    	}else{
        console.log(this.applyPaidBagQuantity.toString().length)
	        if (this.applyPaidBagQuantity.toString().length > 9) {
	          this.$message({
	            message: "超长字符,请重新输入！",
	            type: "error"
	          });
	          this.applyPaidBagQuantity=1;
	          this.$forceUpdate();
	        }
	    }
    },
    handleChangeUnit(value){
       if(value==undefined){
    		this.$message({
	          message: '数值不能为空,请重新输入！！！',
	          type: 'error'
	        });
    	}else{
        console.log(this.applyPaidBagQuantity.toString().length)
	       if (this.applyPaidMeter.toString().length >9) {
	          this.$message({
	            message: "超长字符,请重新输入！",
	            type: "error"
	          });
	          this.applyPaidMeter='';
	          this.$forceUpdate();
	        } 
	    }
    },
    async payHandle(index, item) {
      console.log('列表发起付款：', item);
      this.dialogSponsorVisible = true;
      this.applyPaidBagQuantity = '';
      this.applyPaidBagMeter = '';
      this.applyPaidMeter = '';
      await purchasegetuuid().then(res => {
        if (res.code === '0') {
          item.newUuid = res.data;
        }
      });
      this.Sponsorlist = item;
    },
    //确定发起付款
    SponsorVisibleclick(){
      console.log(this.applyPaidMeter);
      console.log(this.Sponsorlist.readyMeter)
    	if(this.applyPaidMeter>this.Sponsorlist.readyMeter){
    		   this.$message({
	            type: 'error',
	            message: '申请付款数量不能大于货妥数量!'
	          });
    	}else{
        this.dialogSponsorVisible=false;
        // console.log(typeof(this.applyPaidBagMeter));
        if(typeof(this.applyPaidBagMeter)=='object'){
          // console.log(this.Sponsorlist);
          this.applyPaidBagMeter=this.Sponsorlist.packSpecification;
        }else if(typeof(this.applyPaidBagMeter)=='number'){
          //  console.log(this.applyPaidBagMeter);
        }
    		let data = {
	        applicant: this.$store.state.userName,
	        applicantName: this.$store.state.realName,
	        applicantDepartment: this.$store.state.currentDepartment.id,
	        applicantDepartmentName: this.$store.state.currentDepartment.name,
          applyPaidBagQuantity: this.applyPaidBagQuantity,
          applyPaidBagMeter:this.applyPaidBagMeter,
	        applyPaidMeter:this.floatfilters(this.applyPaidMeter),
	        cargoReadyUuid: this.Sponsorlist.uuid,
	        poiUuid: this.Sponsorlist.poiUuid,
	        uuid: this.Sponsorlist.newUuid
	      };
	      console.log(data)
	    	sponsorPayment(data).then(res => {
	        console.log('付款发起：', res);
	        if (res.code === '0') {
	          this.getGoodsRecordingList();
	          this.$message({
	            type: 'success',
	            message: '确认调拨成功!'
	          });
	        }
	      });
    		
    	}
    	
    },
    searchHandle() {
      // 搜索
      console.log(this.dateVal);
      if (this.dateVal) {
        this.readyDateStart = this.dateVal[0];
        this.readyDateEnd = this.dateVal[1];
      } else {
        this.readyDateStart = '';
        this.readyDateEnd = '';
      }
      this.currentPage = 1;
      this.getGoodsRecordingList();
    },
    downloadHandle() {
      // 下载
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsRecordingList();
    },
    handleCurrentChange(val) {
      this.tableLoading = true;
      this.currentPage = val;
      this.getGoodsRecordingList();
    },
    getGoodsRecordingList() {
      // 货妥记录列表
      let data = {
        materialCode: this.materialCode, 
        readyDateEnd: this.readyDateEnd,
        readyDateStart: this.readyDateStart,
        paidStatus: this.paidStatus,
        supplierCode: this.supplierCode,
        despatch:this.despatch
      };
      goodsRecordingList(this.currentPage, this.pageSize, data).then(res => {
        console.log('货妥记录列表：', res);
        if (res.code === '0') {
          this.cargoList = res.data.records;
          this.total = res.data.total;
          let list = JSON.parse(JSON.stringify(this.cargoList));
          for (var i = 0; i < list.length; i++) {
            let data = list[i];
            if (data.paymentMethod == '无') {
              data.paymentMethodName = data.paymentMethod;
            } else {
              for (var m = 0; m < this.paymentMethodList.length; m++) {
                if (data.paymentMethod == this.paymentMethodList[m].dictItemValue) {
                  data.paymentMethodName = this.paymentMethodList[m].dictItemName;
                }
              }
            }
            if(data.ableShipments==true){
              data.ableShipmentsName='是'
            }else{
               data.ableShipmentsName='否'
            }
            for (var k = 0; k < this.payStatusList.length; k++) {
              if (data.paidStatus == this.payStatusList[k].index) {
                data.paidStatusName = this.payStatusList[k].name;
              }
            }
            if (data.readyMeter == data.applyPaidMeter || !data.paidStatus) {
              // 当货妥数量等于已申请付款数量时不能发起付款
              data.isHide = false;
            } else {
              data.isHide = true;
            }
            if (data.paidStatusName != '已付' && data.isHide) {
              data.actions = {
                hasPay: true
              };
            }
          
            // 当预付有尾款账期时，付款方式展示为：预付+尾款账期，不能发起付款，付款状态显示为空
            if (!data.whetherBalancePeriod && data.paymentMethod == 'downPayment') {
              data.paymentMethodName = '预付';
            }
            if (data.whetherBalancePeriod && data.paymentMethod == 'downPayment' && data.downPaymentOrPeriod) {
              data.paymentMethodName = '预付+尾款账期';
              // data.paidStatus = '';
              data.paidStatusName = '已付';
              data.isHide = false;
              data.actions = {
                hasPay: false
              };
            }

            // if(data.inventory!=''){
            //   for(var z=0;z<this.inventoryList.length;z++){
            //     let z_item=this.inventoryList[z];
            //     if(data.inventory==z_item.index){
            //       data.inventoryName=z_item.name;
            //       this.$forceUpdate();
            //     }
            //   }
            // }
            // if(data.subInventory!=''){
            //   console.log('jinrujinru')
            //    subInventoryTypeList(data.inventory).then(res => {
            //       if (res.code === '0') {
            //         for(var v=0;v<res.data.length;v++){
            //           let v_item=res.data[v];
            //           if(data.subInventory==v_item.subInventory){
            //             this.$set(data,'subInventoryName',v_item.subInventoryName);
            //           }
            //         }
            //       }
            //     });
            //     console.log(data)
            // }
          }
          this.cargoList=list;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    async getDictList() {
      await dictList('PaidStatus').then(res => {
        console.log('付款状态：', res);
        if (res.code === '0') {
          this.payStatusList = res.data;
        }
      });
    },
    floatfilters(val){
      console.log(val)
      return cutOutNum(val, 2)
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.ml{
	margin-left: 10px;
}
.ml2{
	margin-left: 10px;
}
.pt{
	padding-top: 15px;
}
table.contenttab td{
	max-width: 120px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.goodsRecording {
  .actions_part {
    margin: 10px 0;
  }

  .table_part {
    .pagination_wrap {
      margin-top: 20px;
    }
    .img_pay {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  
}

.add_popup_part {
  .childcontentlist {
    // height: 60px;
    border-bottom: 1px solid #EEEEEE;
    &:last-child {
      border-bottom: 1px solid #EEEEEE;
    }
    // li {
    //   white-space: normal;
    // }
  }
  .add_goods_warp {
    ul {
      &.childcontentlist {
        height: 60px;
      }
    }
    .meters {
      vertical-align: middle;
      max-width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .add_goods_btn {
    padding: 0 20px;
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .empty_wrap {
    text-align: center;
    margin-top: 15px;
    color: #909399;
    .empty_img {
      width: 200px;
      height: 100px;
    }
  }
}
</style>