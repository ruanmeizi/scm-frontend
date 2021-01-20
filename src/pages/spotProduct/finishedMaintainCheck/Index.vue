<template>
	<div class="container">
    <div class="base_wrap clearfix finished">
      <h2 class="title">产品基本信息</h2>       
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="200px" class="demo-form-inline">
        <el-form-item label="产品编号">
          <span>{{ruleForm.productCode ? ruleForm.productCode : ''}}</span>
        </el-form-item>
        <el-form-item label="系统编号">
          <span>{{ruleForm.insideCode ? ruleForm.insideCode : ''}}</span>
        </el-form-item>
         <el-form-item label="产品条形码">
          <span>{{ruleForm.productBarcode ? ruleForm.productBarcode : ''}}</span>
        </el-form-item>
        <el-form-item label="产品名称">
          <span>{{ruleForm.productName ? ruleForm.productName : ''}}</span>
        </el-form-item>
        <el-form-item label="物料编号">
          <span>{{ruleForm.materialCode ? ruleForm.materialCode : ''}}</span>
        </el-form-item>  
        <el-form-item label="供应商名称">
          <span>{{ruleForm.supplierName ? ruleForm.supplierName : ''}}</span>
        </el-form-item>
        <el-form-item label="业务分类">
          <span>{{typeHandle(ruleForm.businessType, this.busiCategorytypelist)}}</span>
        </el-form-item>
         <el-form-item label="产品分类">
          <span>{{typeHandle(ruleForm.productClassification, this.ProductClasstypelist)}}</span>
        </el-form-item>
        <el-form-item label="产品系列">
           <span>{{ruleForm.productSeries ? ruleForm.productSeries : ''}}</span>
        </el-form-item>  
         <el-form-item label="产品特性">
          <span>{{typeHandle(ruleForm.productSeason, this.seasontypelist)}}</span>
        </el-form-item>
         <el-form-item label="销售季">
          <span>{{typeHandle(ruleForm.sellSeason,this.SaleSeasoutypelist)}}</span>
        </el-form-item>
        <el-form-item label="产品区分">
          <span>{{typeHandle(ruleForm.productDistinguish, this.distinguishtypelist)}}</span>
        </el-form-item>
         <el-form-item label="销售计量单位">
          <span>{{typeHandle(ruleForm.measurementUnit, this.SaleUnittypelist)}}</span>
        </el-form-item>
         <el-form-item label="颜色">
          <span>{{typeHandle(ruleForm.color, this.colortypelist)}}</span>
        </el-form-item>
         <el-form-item label="上市日期">
          <span>{{ruleForm.listingDate ? ruleForm.listingDate : ''}}</span>
        </el-form-item>
        <el-form-item label="长" prop="length">
          <span>{{ruleForm.length ? ruleForm.length : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
        <el-form-item label="生命周期">
          <span>{{ruleForm.lifeCycle ? ruleForm.lifeCycle : ''}}</span>
        </el-form-item>
        <el-form-item label="宽">
          <span>{{ruleForm.width ? ruleForm.width : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
         <el-form-item label="产品状态" >
          <span>{{typeHandle(ruleForm.productStatus, this.statustypelist)}}</span>
        </el-form-item>
        <el-form-item label="高">
          <span>{{ruleForm.height ? ruleForm.height : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
        <!-- <el-form-item class="whole" label="备注">
          <span>{{ruleForm.remarks ? ruleForm.remarks : ''}}</span>
        </el-form-item> -->
        <h2 class="title">成品产品图文信息</h2>
        <el-form-item label="缩略图" class="photo">
          <div class="img_wrap inline_block mr10" v-for="(item, index) in fileList" :key="index">
            <img class="img_upload" :src="item.url ? item.url : ''" alt="">
          </div>
        </el-form-item>
        <el-form-item label="成品产品详细信息" prop="remarks" class="last">
          <span>{{ruleForm.remarks ? ruleForm.remarks : ''}}</span>
        </el-form-item>
      </el-form>

    </div>
    <div class="mt20 fr">
      <el-button class="mr10" @click="cancelHandle">取消</el-button>
    </div>

	</div>
</template>

<script>
  import{
    materialStatusList,
    fabrictypeProductSeason,
    fabrictypeSaleSeasou,
    fabrictypeProductDistinguish,
    fabrictypeSaleUnit,
    fabrictypeProductClass,
    fabrictypeProductcolor,
    fabrictypedictionaries
  } from "@/api/module/dictionariesApi.js";
	export default {
	  name: "finishedMaintainCheck",
	  props: ['list', 'uploadFileList'],
	  data() {
	    return {
        ruleForm: null,
        fileList: [],
        SaleUnittypelist:[],
        ProductClasstypelist:[],
        statustypelist:[],
        seasontypelist:[],
        SaleSeasoutypelist:[],
        orderList: [],
        colortypelist:[],
        distinguishtypelist:[],
        busiCategorytypelist:[]
	    };
	  },
	  components: {},
	  created() {
	    this.ruleForm = this.list;
	  },
	  mounted() {
      // this.ruleForm = this.list;
      this.fileList = this.uploadFileList;
      this.getSaleUnit();
      this.getProductClass();
      this.getProductStatus();
      this.getProductSeason();
      this.getSaleSeasou();
      this.getProductcolor();
      this.getbusiCategory();
      this.getProductDistinguish();
	  },
	  watch: {
	    list(list) {
        this.ruleForm = list;
      },
	    uploadFileList(list) {
        this.fileList = list;
      }
	  },
	  methods: {
      // 获取状态名称
      typeHandle(status, list) {
        for(var i = 0; i < list.length; i++){
          let item = list[i];
          if(item.index == status){
            return item.name;
          }
        }
      },
      //颜色
      getProductcolor(){ 		
        fabrictypeProductcolor().then(response => {
          if(response.code === "0") {					
            this.colortypelist = response.data;
          }
        });
      },
      //销售计量单位
      getSaleUnit(){
        fabrictypedictionaries('MaterialFinishedProductUnit').then(response => {
          if(response.code === "0") {					
            this.SaleUnittypelist = response.data;
          }
        });
      },
      //产品区分
      getProductDistinguish(){
        fabrictypeProductDistinguish().then(response => {
          if(response.code === "0") {					
            this.distinguishtypelist = response.data;
          }
        });
      },
      //产品分类
      getProductClass(){
        fabrictypedictionaries('ProductFinishedClass').then(response => {
          if(response.code === "0") {					
            this.ProductClasstypelist = response.data;
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
      //产品特性
      getProductSeason(){
        fabrictypeProductSeason().then(response => {
          if(response.code === "0") {
            this.seasontypelist = response.data;
          }
        });
      },
       //业务分类
      getbusiCategory(){
        fabrictypedictionaries('ProductBusinessType').then(response => {
          if(response.code === "0") {					
            this.busiCategorytypelist = response.data;
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
	  	cancelHandle() {
        this.$emit('cancelHandle');
      }
	  }
	};
</script>

<style lang="scss" scoped>
.base_wrap {
  .img_wrap {
    width: 150px;
    height: 150px;
    overflow: hidden;
    .img_upload {
      height: 100%;
    }
  }
}
</style>