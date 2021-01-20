<template>
  <el-table
    class="singleTableList"
    v-loading="loading"
    :data="list"
    border
    stripe
    style="width: 100%;"
    :style="loading ? 'min-height: 598px;' : ''"
    :height="height"
    ref="table"
    @row-dblclick="dbSelected"
    @selection-change="handleSelectionChange"
    max-height="700px">
    <!-- ifCheckbox 是否展示多选框 -->
    <el-table-column
      type="selection"
      v-if="ifCheckbox"
      width="55">
    </el-table-column>
    <el-table-column
      v-for="(item, index) in leaderFieldsList"
      :key="index"
      fixed
      :prop="item.field"
      :label="item.name"
      :title="item.field"
      :width="item.width ? item.width : ''"
      :min-width="item.minWidth ? item.minWidth : ''">
      <template slot-scope="scope">
        <!-- popover -->
        <div v-if="item.hasPopover">
          <Popover v-if="item.hasPopover" :popSet="item.popovers" :popData="scope.row" :curIndex="scope.$index" @popoverHandle="popoverHandle"></Popover>
          <span v-else></span>
        </div>
        <span v-else :title="scope.row[item.field]">{{scope.row[item.field]}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column
      v-show="simpleFieldsList.length && !fieldsList"
      v-for="(item, index) in simpleFieldsList"
      :key="index"
      :prop="item.field"
      :label="item.name"
      :title="item.field"
      :width="item.width ? item.width : ''"
      :min-width="item.minWidth ? item.minWidth : ''">
    </el-table-column> -->
    <el-table-column
      v-for="(item, index) in fieldsList"
      :key="index"
      :prop="item.field"
      :label="item.name"
      :title="item.field"
      :width="item.width ? item.width : ''"
      :min-width="item.minWidth ? item.minWidth : ''">
      <template slot-scope="scope">
        <span v-if="item.isOffered">
            <span v-if="scope.row.purchaseMeasurementUnit == '米'" :title="(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 ' + (scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 ' + (scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'">{{(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 '}}{{(scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 '}}{{(scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'}}</span>
            <span v-else :title="scope.row[item.field_1] + scope.row.purchaseMeasurementUnit">{{scope.row[item.field_1] + scope.row.purchaseMeasurementUnit}}</span>
        </span>
        <span v-if="item.isOffereds">
            <span v-if="scope.row.purchaseMeasurementUnit == '米'" :title="(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 ' + (scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 ' + (scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'">{{(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 '}}{{(scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 '}}{{(scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'}}</span>
            <span v-else :title="scope.row[item.field_3] + scope.row.purchaseMeasurementUnit">
            	<span v-if="scope.row.purchaseMeasurementUnit!=null&&scope.row.purchaseMeasurementUnit!=''">{{(scope.row[item.field_3]?scope.row[item.field_3]:'0') + scope.row.purchaseMeasurementUnit}}</span>
            	<span v-else>{{(scope.row[item.field_3]?scope.row[item.field_3]:'0') + '条'}}</span>
            </span>
        </span>
        <div v-if="item.isId"><span>{{scope.$index+1}}</span></div>
        <div v-if="item.proHandle"><span>{{productTypeHandle(scope.row.productClassification)}}</span></div>
        <div v-if="item.sellSeasonHandle"><span>{{productSellSeasonHandle(scope.row.sellSeason)}}</span></div>
        <div v-if="item.fabricMaterial"><span>{{fabricMaterialTypeHandle(scope.row.materialType)}}</span></div>
        <div v-if="item.fabricHolidayType"><span>{{fabricHolidayTypeHandle(scope.row.holidayType)}}</span></div>
        <div v-if="item.fabricfactorySeason"><span>{{fabricfactorySeasonTypeHandle(scope.row.factorySeason)}}</span></div>
        <div v-if="item.fabricSupplier"><span>{{fabricSuppliertypeHandle(scope.row.supplierId,'supplierId')}}</span></div>
        <div v-if="item.fabricSupplierName"><span>{{fabricSuppliertypeHandle(scope.row.supplierName,'supplierName')}}</span></div>
        <div v-if="item.fabricSupplierType"><span>{{supplierTypeHandle(scope.row.customerCategory)}}</span></div>
        <div v-if="item.spotPriceCurreny"><span>{{spotPriceCurrenyHandle(scope.row.currency)}}</span></div>
        <div v-if="item.fabricSupplierStatus"><span>{{supplierStatusHandle(scope.row.customerStatus)}}</span></div>
        <div v-if="item.proStatus"><span>{{productStatusHandle(scope.row.productStatus)}}</span></div>
        <div v-if="item.materStatus"><span>{{productStatusHandle(scope.row.materialStatus)}}</span></div>
        <div v-if="item.materialPop"><span>{{materialTypeHandle(scope.row.materialProperties)}}</span></div>
        <div v-if="item.materialHandle"><span>{{typeHandle(scope.row.materialClassification,MaterialClasstypelist)}}</span></div>
        <div v-if="item.materialClass"><span>{{typeHandle(scope.row.materialClassification,materialClassList)}}</span></div>
        <div v-if="item.fabrictype"><span>{{typeHandle(scope.row.materialType,fabrictypeList)}}</span></div>
        <div v-if="item.isSale"><span>{{scope.row.sale==true?'可售':'停售'}}</span></div>
        <!-- 查询面料物料主数据维护 -->
         <div v-if="item.isDevelop"><span>{{!scope.row.developCode?'否':'是'}}</span></div>
         <div v-if="item.isMobileGoods">{{!scope.row.MobileGoods?'否':'是'}}</div>
         <div v-if="item.isQuickGoods">{{!scope.row.isQuickGoods?'否':'是'}}</div>
         <!-- 复选框 -->
        <div v-if="item.isCheckbox" style="float:left;padding-left:8px">
          <el-checkbox
            v-model="checkAllList"
            :label="scope.row.materialCode"
            :key="scope.row.materialCode"
            @change="checkAllChange(scope.row)">
          </el-checkbox>
        </div>
        <!-- popover -->
        <div v-if="item.hasPopover">
          <Popover v-if="item.hasPopover" :popSet="item.popovers" :popData="scope.row" :curIndex="scope.$index" @popoverHandle="popoverHandle"></Popover>
          <span v-else></span>
        </div>
        <!-- 销售预测 -->
        <span v-if="item.isSalesPlan" :title="scope.row['list'][item.index].predictQuantity">{{scope.row['list'][item.index].predictQuantity}}</span>

        <span v-else :title="scope.row[item.field]">{{scope.row[item.field]}}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-for="(item, index) in tailFieldsList"
      :key="index"
      fixed="right"
      :label="item.name"
      :width="item.width ? item.width : ''"
      :min-width="item.minWidth ? item.minWidth : ''">
      <!-- 操作 -->
      <template v-if="item.isAction" slot-scope="scope">
        <el-button v-if="item.hasEdit" class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasSubmit" class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasDelete" class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasCheck" class="el-icon-document" type="primary" circle size="mini" title="查看" @click.stop="checkHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasRemove" class="el-icon-close" type="danger" circle size="mini" title="整单解除" @click.stop="removeHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasPay" class="el-icon-thumb" type="primary" circle size="mini" title="确认调拨" @click.stop="payHandle(scope.$index, scope.row)"></el-button>
        <el-button v-if="item.hasCopy" class="el-icon-copy-document" type="primary" circle size="mini" title="克隆" @click.stop="cloneHandle(scope.row)"></el-button>
        <el-button v-if="item.hasDictionary" class="el-icon-collection" type="primary" circle size="mini" title="字典项管理" @click.stop="dictionaryHandle(scope.row)"></el-button>
        
        <!-- <el-button v-if="item.hasCheck" @click.stop="checkHandle(scope.$index, scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="item.hasEdit" @click.stop="editHandle(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
        <el-button v-if="item.hasSubmit" @click.stop="submitHandle(scope.$index, scope.row)" type="text" size="small">提交审批</el-button>
        <el-button v-if="item.hasRemove" @click.stop="removeHandle(scope.$index, scope.row)" type="text" size="small">整单解除</el-button>
        <el-button v-if="item.hasPay" @click.stop="payHandle(scope.$index, scope.row)" type="text" size="small">确认调拨</el-button>
        <el-button v-if="item.hasDelete" @click.stop="deleteHandle(scope.$index, scope.row)" type="text" size="small">删除</el-button>
        <el-button v-if="item.hasCopy" @click.stop="cloneHandle(scope.row)" type="text" size="small">克隆</el-button>
        <el-button v-if="item.hasDictionary" @click.stop="dictionaryHandle(scope.row)" type="text" size="small">字典项管理</el-button>
        <i v-if="item.hasEditImg" type="primary" class="el-icon-edit" title="编辑" @click.stop="editHandleImg(scope.$index, scope.row)"></i>
        <i v-if="item.hasDeleteImg" type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandleImg(scope.$index, scope.row)"></i>
        <i v-if="item.hasCheckImg" type="primary" class="el-icon-document" title="查看" @click.stop="checkHandleImg(scope.$index, scope.row)"></i> -->
        <template v-if="scope.row.actions">
          <el-button v-if="scope.row.actions.hasEdit" class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.actions.hasSubmit" class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.actions.hasDelete" class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.actions.hasCheck" class="el-icon-document" type="primary" circle size="mini" title="查看" @click.stop="checkHandle(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.actions.hasPay" class="el-icon-thumb" type="primary" circle size="mini" title="确认调拨" @click.stop="payHandle(scope.$index, scope.row)"></el-button>
          <el-button v-if="scope.row.actions.hasResend" class="el-icon-position" type="primary" circle size="mini" title="重新发送" @click.stop="resendHandle(scope.$index, scope.row)"></el-button>

          <!-- <el-button v-if="scope.row.actions.hasCheck" @click.stop="checkHandle(scope.$index, scope.row)" type="text" size="small">查看</el-button>
          <el-button v-if="scope.row.actions.hasEdit" @click.stop="editHandle(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.actions.hasSubmit" @click.stop="submitHandle(scope.$index, scope.row)" type="text" size="small">提交审批</el-button>
          <el-button v-if="scope.row.actions.hasPay" @click.stop="payHandle(scope.$index, scope.row)" type="text" size="small">确认调拨</el-button>
          <el-button v-if="scope.row.actions.hasDelete" @click.stop="deleteHandle(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          <el-button v-if="scope.row.actions.hasResend" @click.stop="resendHandle(scope.$index, scope.row)" type="text" size="small">重新发送</el-button> -->
        </template>        
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {
  fabricPaymentMethod,
  fabrictypeMaterialproperties,
  fabricCompositeMaterial,
  fabrictypedictionaries,
  fabrictypeHoliday
} from "@/api/module/dictionariesApi.js";
import {supplierNameData} from "@/api/module/materialfinishedApi.js";
import { getsupplierstatus, getsuppliertype} from "@/api/module/supplierApi.js";
import {constDictList,subInventoryTypeList} from "@/api/publicApi.js";
import Popover from "@/layouts/components/common/Popover.vue";
import{
	materialStatusList,
  fabrictypeProductClass,
  fabrictypeMaterialClass,
  fabrictypeMaterialType
} from "@/api/module/dictionariesApi.js";
  export default {
    name: 'SingleTable',
    props: ['tableList', 'tableFieldsList', 'tableSimpleFieldsList', 'tableLeaderFieldsList', 'tableTailFieldsList', 'tableLoading','tableHeight','ifCheckbox'],
    data() {
      return {
        list: [], // 数据列表
        fieldsList: [], // 字段列表
        simpleFieldsList: [], // 字段列表
        leaderFieldsList: [], // 首部固定字段列表
        tailFieldsList: [], // 尾部固定字段列表
        loading: true,
        ProductClasstypelist:[],
        statustypelist:[],
        MaterialPropertiestypelist:[],
        MaterialClasstypelist:[],
        materialClassList:[],
        fabrictypeList:[],
        SaleSeasoutypelist:[],
        Materialtypelist:[],
        factorySeasontypelist:[],
        supplierNameList:[],
        fabrictypeHolidaylist:[],
        suppliertypelist:[],
        currencyList:[],
        inventoryList:[],
        supplierstatuslist:[],
      }
    },
    components: {
      Popover
    },
    mounted() {
      this.loading = this.tableLoading;
      this.height=this.tableHeight;
      this.list = this.tableList;
      this.fieldsList = this.tableFieldsList;
      this.simpleFieldsList = this.tableSimpleFieldsList;
      this.leaderFieldsList = this.tableLeaderFieldsList;
      this.tailFieldsList = this.tableTailFieldsList;
      this.getPaymentMethod()
      this.getProductClass()
      this.getSaleSeasou()
      this.getProductStatus()
      this.getProductmaterialproperties()
      this.getMaterialClass()
      this.getMaterialClassList();
      this.getMaterialType();
      this.getFactorySeason();
      this.getFabrictypeHoliday();
      this.getSupplierNameList();
      this.getCurrencyList();
      this.suppliertype();
      this.supplierstatus();
      this.getFabrictypeMaterialType();
    },
    watch: {
      tableLoading(val) {
        this.loading = val;
      },
      tableHeight(val) {
        this.height = val;
      },
      tableList(list) {
        this.list = list;
        console.log(list);
        this.$forceUpdate();
      },
      tableFieldsList(list) {
        this.fieldsList = list;
        this.$forceUpdate();
      },
      tableSimpleFieldsList(list) {
        this.simpleFieldsList = list;
        this.$forceUpdate();
      },
      tableLeaderFieldsList(list) {
        this.leaderFieldsList = list;
        this.$forceUpdate();
      },
      tableTailFieldsList(list) {
        this.tailFieldsList = list;
        this.$forceUpdate();
      }
    },
    methods: {
      dbSelected(row){
        // 双击事件
        // console.log('双击事件',row);
      },
       handleSelectionChange(val) {
        this.table = val;
        this.$emit('checkBoxHandle', val);
        console.log('选中值val',this.table)
      },
      checkHandle(index, item,tag) {
        console.log('查看：', index, item,tag);
        this.$emit('checkHandle', index, item,'view');
      },
      editHandle(index, item,tag) {
        console.log('编辑：', index, item ,tag);
        this.$emit('editHandle', index, item ,'upd');
      },
      submitHandle(index, item) {
        console.log('提交：', index, item);
        this.$emit('submitHandle', index, item);
      },
      removeHandle(index, item) {
        console.log('解除：', index, item);
        this.$emit('removeHandle', index, item);
      },
      payHandle(index, item) {
        console.log('申请付款：', index, item);
        this.$emit('payHandle', index, item);
      },
      resendHandle(index,item){
        console.log('重新发送', index, item);
        this.$emit('resendHandle', index, item);
      },
      deleteHandle(index, item) {
        console.log('删除：', index, item);
        this.$emit('deleteHandle', index, item);
      },
      editHandleImg(index,item){
        this.$emit('editHandleImg',index,item)
      },
      deleteHandleImg(index,item){
        this.$emit('deleteHandleImg',index,item)
      },
      popoverHandle(index, item, name, field) {
        console.log('弹层：', index, item, name, field);
        this.$emit('popoverHandle', index, item, name, field);
      },
      checkHandleImg(index,item){
        this.$emit('checkHandleImg',index,item)
      },
      cloneHandle(item){
        this.$emit('cloneHandle',item)
      },
      dictionaryHandle(item){
        this.$emit('dictionaryHandle',item)
      },
      checkAllChange(item){
        this.$emit('checkAllChange',item)
      },
      //获取产品分类名称
      productTypeHandle(status) {
        for(var i=0;i<this.ProductClasstypelist.length;i++){
          let item=this.ProductClasstypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      }, 
      //获取销售季名称
      productSellSeasonHandle(status){
        console.log(status)
        for(var i=0;i<this.SaleSeasoutypelist.length;i++){
          let item=this.SaleSeasoutypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
      //获取产品状态名称
      productStatusHandle(status) {
        // console.log(status)
        for(var i=0;i<this.statustypelist.length;i++){
          let item=this.statustypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
      //获取面料物料类型
      fabricMaterialTypeHandle(status){
        // console.log(status)
        for(var i=0;i<this.Materialtypelist.length;i++){
          let item=this.Materialtypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
      //获取节假日类型名称
      fabricHolidayTypeHandle(status){
        for(var i=0;i<this.fabrictypeHolidaylist.length;i++){
          let item=this.fabrictypeHolidaylist[i];
          if(item.dictItemValue==status){
            return item.dictItemName
          }
        }
      },
      //获取面料物料工厂季名称
      fabricfactorySeasonTypeHandle(status){
        console.log(status)
        for(var i=0;i<this.factorySeasontypelist.length;i++){
          let item=this.factorySeasontypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
       //获取供应商状态code
      fabricSuppliertypeHandle(status,tag){
        for(var i=0;i<this.supplierNameList.length;i++){
          let item=this.supplierNameList[i];
          for(var key in item){
              // console.log(key+":"+item[key]);
               if(key==tag&&item[key]==status){
                //  console.log('通过',item.supplierCode)
                  return item.supplierCode
               }
          }
          // if(tag=='supplierName'){
          //   if(item.supplierName==status){
          //     return item.supplierCode
          //   }
          // }else if(tag=='supplierId'){
          //   if(item.supplierId==status){
          //     return item.supplierCode
          //   }
          // }
        }
      },
       //获取供应商主数据类型
      supplierTypeHandle(status){
         for(var i=0;i<this.suppliertypelist.length;i++){
          let item=this.suppliertypelist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
      //获取现货/期货采购价单币种
      spotPriceCurrenyHandle(status){
        // console.log(status)
        for(var i=0;i<this.currencyList.length;i++){
          let item=this.currencyList[i];
          if(item.index==status){
            return item.name
          }
        }
      },
       //获取供应商主数据状态
      supplierStatusHandle(status){
         for(var i=0;i<this.supplierstatuslist.length;i++){
          let item=this.supplierstatuslist[i];
          if(item.index==status){
            return item.name
          }
        }
      },
        //获取供应商列表
     getSupplierNameList() {
        supplierNameData('', '','').then(res => {
          console.log('供应商名称：', res);
          if (res.code === '0') {
            this.supplierNameList = res.data;
            // console.log(this.supplierNameList)
          }
        });
      },
      getCurrencyList() {
        // 币种列表
        constDictList('Currency').then(res => {
          console.log('币种列表：', res);
          if (res.code === '0') {
            this.currencyList = res.data;
          }
        });
      },
      //供应商状态
			supplierstatus() {
				getsupplierstatus().then(response => {
					if(response.code === "0") {
						this.supplierstatuslist = response.data;
					}
				});
			},
			//供应商分类
			suppliertype() {
				getsuppliertype().then(response => {
					if(response.code === "0") {
            this.suppliertypelist = response.data;
            // console.log(this.suppliertypelist)
					}
				});
			},
      //面料物料工厂季
      getFactorySeason(){
        fabrictypedictionaries('FactorySeason').then(response => {
          if(response.code === "0") {					
            this.factorySeasontypelist = response.data;
          }
        });
      },
      //产品分类
      getProductClass(){
        fabrictypeProductClass().then(response => {
          if(response.code === "0") {
            this.ProductClasstypelist = response.data;
          }
        });
      },
      //销售季
      getSaleSeasou(){ 		
        fabrictypedictionaries('FactorySeason').then(response => {
          if(response.code === "0") {					
            this.SaleSeasoutypelist = response.data;
          }
        });
      },
      //产品状态
      getProductStatus(){       
        materialStatusList().then(response => {
          if(response.code === "0") {	
            this.statustypelist = response.data;
          }
        });
      },
      //付款方式
      getPaymentMethod(){
        fabricPaymentMethod().then(response => {
          if(response.code === "0") {					
            this.paymentMethodList = response.data;
          }
        });
      },
     //节假日名称
  	 getFabrictypeHoliday(){
  		fabrictypeHoliday().then(response => {
        if(response.code === "0") {
          this.fabrictypeHolidaylist =response.data;	
        }
      }); 
  	},
      //获取付款方式名称
      paymentTypeHandle(status) {
        for(var i=0;i<this.paymentMethodList.length;i++){
          let item=this.paymentMethodList[i];
          if(item.dictItemValue==status){
            return item.dictItemName
          }
        }
      },
      //物料属性
      getProductmaterialproperties() {
        fabrictypeMaterialproperties().then(response => {
          if (response.code === "0") {
            this.MaterialPropertiestypelist = response.data;
          }
        });
      },
      //获取物料属性名称
      materialTypeHandle(status) {
        for (var i = 0; i < this.MaterialPropertiestypelist.length; i++) {
          let item = this.MaterialPropertiestypelist[i];
          if (item.index == status) {
            return item.name;
          }
        }
      },
      //面料物料类型
      getMaterialType() {
        fabrictypeMaterialType().then(response => {
          if (response.code === "0") {
            this.Materialtypelist = response.data;
            console.log(this.Materialtypelist)
          }
        });
      },
      //组合物料分类
      getMaterialClass(){
        fabricCompositeMaterial().then(response => {
          if(response.code === "0") {
            this.MaterialClasstypelist = response.data;	
          }
        });
      },
      //物料分类
      getMaterialClassList() {
         fabrictypedictionaries('MaterialFinishedClass').then(res => {
          if(res.code === '0') {					
            this.materialClassList = res.data;
          }
        });
      },
      //物料类型
      getFabrictypeMaterialType() {
        fabrictypeMaterialType().then(res => {
          if(res.code === '0') {
            this.fabrictypeList = res.data;
          }
        });
      },   
      // 获取状态名称
      typeHandle(status, list) {
        for(var i = 0; i < list.length; i++){
          let item = list[i];
          if (item.index == status){
            return item.name;
          }
        }
      },
    }
  }
</script>