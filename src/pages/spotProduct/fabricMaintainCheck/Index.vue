<template>
	<div class="container">
    <div class="base_wrap clearfix">
      <h2 class="title">产品基本信息</h2>
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-form-inline">
        <el-form-item label="产品编号">
          <span>{{ruleForm.productCode ? ruleForm.productCode : ''}}</span>
        </el-form-item>
        <el-form-item label="系统编号">
          <span>{{ruleForm.interiorCode ? ruleForm.interiorCode : ''}}</span>
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
        <el-form-item label="产品描述">
          <span>{{ruleForm.specification ? ruleForm.specification : ''}}</span>
        </el-form-item>
         <el-form-item label="业务分类">
          <span>{{typeHandle(ruleForm.businessType, this.busiCategorytypelist)}}</span>
        </el-form-item>
         <el-form-item label="产品品牌">
          <span>{{ruleForm.brand ? ruleForm.brand : ''}}</span>
        </el-form-item>
         <el-form-item label="产品成分">
          <span>{{ruleForm.productComposition ? ruleForm.productComposition : ''}}</span>
        </el-form-item>
         <el-form-item label="产品分类">
          <span>{{typeHandle(ruleForm.productClass, this.ProductClasstypelist)}}</span>
        </el-form-item>   
        <el-form-item label="产品系列">
           <span>{{ruleForm.productSeries ? ruleForm.productSeries : ''}}</span>
        </el-form-item>  
        <el-form-item label="品类">
          <span>{{typeHandle(ruleForm.category, this.categorytypelist)}}</span>
        </el-form-item>
         <el-form-item label="产品特性">
          <span>{{typeHandle(ruleForm.season, this.seasontypelist)}}</span>
        </el-form-item>
        <el-form-item label="产品区分">
          <span>{{typeHandle(ruleForm.productDistinguish, this.distinguishtypelist)}}</span>
        </el-form-item>
        <el-form-item label="销售计量单位">
          <span>{{typeHandle(ruleForm.saleMeasurementUnit, this.SaleUnittypelist)}}</span>
        </el-form-item>
         <el-form-item label="时尚度">
          <span>{{typeHandle(ruleForm.fashion, this.ProductFashionDegreetypelist)}}</span>
        </el-form-item>  
         <el-form-item label="延米克重">
          <span>{{ruleForm.weightPerMeterShow ? ruleForm.weightPerMeterShow : ''}}</span>&nbsp;&nbsp;克
        </el-form-item>
        <el-form-item label="销售季">
          <span>{{ruleForm.saleSeasou}}</span>
          <!-- <span>{{typeHandle(ruleForm.saleSeasou, this.SaleSeasoutypelist)}}</span> -->
        </el-form-item> 
        <el-form-item label="每平米克重">
          <span>{{ruleForm.weightPerSquareMeter ? ruleForm.weightPerSquareMeter : ''}}</span>&nbsp;&nbsp;克
        </el-form-item>
        <el-form-item label="颜色">
          <span>{{typeHandle(ruleForm.color, this.colortypelist)}}</span>
        </el-form-item>       
        <el-form-item label="每个销售单位的物料数量">
          <span>{{ruleForm.numbersPerMeasurementUnit ? ruleForm.numbersPerMeasurementUnit : ''}}</span>&nbsp;&nbsp;
        </el-form-item>
         <el-form-item label="花型">
          <span>{{typeHandle(ruleForm.pattern, this.patterntypelist)}}</span>
        </el-form-item>
        <el-form-item label="幅宽">
          <span>{{ruleForm.width ? ruleForm.width : ''}}</span>&nbsp;&nbsp;
        </el-form-item>
        <el-form-item label="产地">
          <span>{{typeHandle(ruleForm.placeOfProduction, this.placeProductiontypelist)}}</span>
        </el-form-item>
        <el-form-item label="纱支">
          <span>{{ruleForm.yarnCount ? ruleForm.yarnCount : ''}}</span>
        </el-form-item>
        <el-form-item label="上市日期">
          <span>{{ruleForm.validDate ? ruleForm.validDate : ''}}</span>
        </el-form-item>
         <el-form-item label="最小起订量">
          <span>{{ruleForm.minOrder ? ruleForm.minOrder : ''}}</span>
        </el-form-item>
         <el-form-item label="生命周期">
          <span>{{ruleForm.invalidDate ? ruleForm.invalidDate : ''}}</span>
        </el-form-item>
        <el-form-item label="替代品">
          <span>{{ruleForm.substitute ? ruleForm.substitute : ''}}</span>
        </el-form-item>
        <!-- <el-form-item label="推荐品">
          <span>{{ruleForm.suggestion==true?"是":"否"}}</span>
        </el-form-item> -->
        <el-form-item label="坯布编号">
          <span>{{ruleForm.rawFabricId ? ruleForm.rawFabricId : ''}}</span>
        </el-form-item>
        <el-form-item label="团购推荐指数">
           <span>{{typeHandle(ruleForm.suggestIndex, this.suggestIndexTypelist)}}</span>
        </el-form-item>
        <el-form-item label="产品状态">
          <span>{{typeHandle(ruleForm.productStatus, this.statustypelist)}}</span>
        </el-form-item>
  
        <h2 class="title">面料产品图文信息</h2>
        <el-form-item label="缩略图" class="photo">
          <div class="img_wrap inline_block mr10" v-for="(item, index) in fileList" :key="index">
            <img class="img_upload" :src="item.url ? item.url : ''" alt="">
          </div>
        </el-form-item>
        <el-form-item label="面料产品详细信息" prop="remarks" class="last">
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
  import {
    fabrictypeProductCategory,
    materialStatusList,
    fabrictypeProductSeason,
    fabrictypeSaleSeasou,
    fabrictypeProductType,
    fabrictypeSaleUnit,
    fabrictypeProductClass,
    fabrictypeProductFashionDegree,
    fabrictypebusiCategory,
    fabrictypeProductcolor,
    fabrictypeProductpattern,
    fabrictypeProductDistinguish,
    fabrictypedictionaries
  } from "@/api/module/dictionariesApi.js";
	export default {
	  name: "fabricMaintainCheck",
	  props: ['list', 'uploadFileList'],
	  data() {
	    return {
        ruleForm: null,
        suggestIndexTypelist:[
          {
            index:1,
            name:1
          },
          {
            index:2,
            name:2
          },
          {
            index:3,
            name:3
          }
        ],
        fileList: [],
        busiCategorytypelist:[],
        categorytypelist:[],
        statustypelist:[],
        seasontypelist:[],
        SaleSeasoutypelist:[],
        Producttypelist:[],
        SaleUnittypelist:[],
        ProductClasstypelist:[],
        ProductFashionDegreetypelist:[],
        colortypelist:[],
        patterntypelist:[],
        distinguishtypelist:[],
        placeProductiontypelist:[],
	    };
	  },
	  components: {},
	  created() {
      this.ruleForm = this.list;
      this.getProductCategory();
      this.getProductStatus();
      this.getProductSeason();
      this.getSaleSeasou();
      this.getProductType();
      this.getSaleUnit();
      this.getProductClass();
      this.getProductFashionDegree();	  
      this.getbusiCategory();
      this.getProductcolor();
      this.getPlaceOfProduction();
      this.getProductpattern();
      this.getProductDistinguish();
	  },
	  mounted() {
      // this.ruleForm = this.list;
      this.fileList = this.uploadFileList;
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
        console.log(status,list)
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
      //花型
      getProductpattern(){
        fabrictypeProductpattern().then(response => {
          if(response.code === "0") {					
            this.patterntypelist = response.data;
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
       //产地
      getPlaceOfProduction(){
        fabrictypedictionaries('PlaceOfProduction').then(response => {
          if(response.code === "0") {					
            this.placeProductiontypelist = response.data;
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
      //产品品类
      getProductCategory(){
        fabrictypeProductCategory().then(response => {
          if(response.code === "0") {
            this.categorytypelist = response.data;
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
      //产品季
      getProductSeason(){
        fabrictypeProductSeason().then(response => {
          if(response.code === "0") {
            
            this.seasontypelist = response.data;
          }
        });
      },
      //销售季
      getSaleSeasou(){
        // fabrictypeSaleSeasou().then(response => {
        //   if(response.code === "0") {
        //     this.SaleSeasoutypelist = response.data;
        //   }
        // });
        fabrictypedictionaries('FactorySeason').then(response => {
          if(response.code === "0") {					
            this.SaleSeasoutypelist = response.data;
          }
        });
      },
      //产品类型
      getProductType(){
        fabrictypeProductType().then(response => {
          if(response.code === "0") {
            this.Producttypelist = response.data;
          }
        });
      },
      //销售计量单位
      getSaleUnit(){
        let data=[
          {name: "米", index: "Meter"}
        ]
        this.SaleUnittypelist=data;
      },
      //产品分类
      getProductClass(){
        fabrictypeProductClass().then(response => {
          if(response.code === "0") {
            this.ProductClasstypelist = response.data;
          }
        });
      },
      //时尚度
      getProductFashionDegree(){
        fabrictypeProductFashionDegree().then(response => {
          if(response.code === "0") {
            this.ProductFashionDegreetypelist = response.data;
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