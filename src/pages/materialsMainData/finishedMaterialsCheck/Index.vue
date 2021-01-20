<template>
	<div class="container">
    <div class="base_wrap clearfix finished">
      <h2 class="title">物料基本信息</h2>
      <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="200px" class="demo-form-inline">
        <el-form-item label="物料编号">
          <span>{{ruleForm.materialCode ? ruleForm.materialCode : ''}}</span>
        </el-form-item>
         <el-form-item label="系统编号">
          <span>{{ruleForm.materialId ? ruleForm.materialId : ''}}</span>
        </el-form-item>
        <el-form-item label="物料名称">
          <span>{{ruleForm.materialName ? ruleForm.materialName : ''}}</span>
        </el-form-item>
        <el-form-item label="供应商编号">
          <span>{{typeHandleSupplier(ruleForm.supplierId,this.supplierNameList)}}</span>
        </el-form-item>
        <el-form-item label="生产商名称">
          <span>{{ruleForm.manufacturerName ? ruleForm.manufacturerName : ''}}</span>
        </el-form-item>
        <el-form-item label="供应商名称">
          <span>{{ruleForm.supplierName ? ruleForm.supplierName : ''}}</span>
        </el-form-item>
        <el-form-item label="物料分类">
          <span class="w300">{{typeHandle(ruleForm.materialClassification, this.materialClassList)}}</span>
        </el-form-item>
        <el-form-item label="颜色">
          <span class="w300">{{typeHandle(ruleForm.color, this.colortypelist)}}</span>
        </el-form-item>
         <el-form-item label="产品特性">
          <span class="w300">{{typeHandle(ruleForm.productSeason, this.seasonList)}}</span>
        </el-form-item>
        <el-form-item label="长">
          <span>{{ruleForm.length ? ruleForm.length : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
         <el-form-item label="采购计量单位">
          <span class="w300">{{typeHandle(ruleForm.measurementUnit, this.unitList)}}</span>
        </el-form-item>
        <el-form-item label="宽">
          <span>{{ruleForm.width ? ruleForm.width : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
        <el-form-item label="单位重量">
          <span>{{ruleForm.unitGram ? ruleForm.unitGram : ''}}</span>&nbsp;&nbsp;克
        </el-form-item>
        <el-form-item label="高">
          <span>{{ruleForm.height ? ruleForm.height : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
        <el-form-item label="物料属性">
          <span class="w300">{{typeHandle(ruleForm.materialProperties, this.MaterialPropertiestypelist)}}</span>
        </el-form-item>
        <el-form-item label="上市时间">
          <span>{{ruleForm.listingDate ? ruleForm.listingDate : ''}}</span>
        </el-form-item> 
         <!-- <el-form-item label="是否可供">
          <span class="w300">{{typeHandle(ruleForm.whetherSupply, this.materialSupplyTypelist)}}</span>
        </el-form-item> -->
        <el-form-item label="生命周期">
          <span>{{ruleForm.lifeCycle ? ruleForm.lifeCycle : ''}}</span>
        </el-form-item>
         <el-form-item label="报关品类">
          <span class="w300">{{typeHandle(ruleForm.declarationCategory, this.materialDeclarationCategorylist)}}</span>
         </el-form-item>
         <el-form-item label="海关编号">
            <span>{{ruleForm.hsCode ? ruleForm.hsCode : ''}}</span>
         </el-form-item>
         <el-form-item label="杂费系数">
          <span>{{ruleForm.miscChargesCoefficient ? ruleForm.miscChargesCoefficient : ''}}</span>&nbsp;&nbsp;
         </el-form-item>
         <el-form-item label="海关关税系数">
          <span>{{ruleForm.customsTariffCoefficient ? ruleForm.customsTariffCoefficient : ''}}</span>
         </el-form-item>
         <el-form-item label="增值税系数">
          <span>{{ruleForm.valueAddedTaxCoefficient ? ruleForm.valueAddedTaxCoefficient : ''}}</span>
         </el-form-item>
        <el-form-item label="备注" prop="remarks" class="last">
          <span>{{ruleForm.remarks ? ruleForm.remarks : ''}}</span>
        </el-form-item>
      </el-form>
      <div class="mt20 t_right">
        <el-button class="mr10" @click="cancelHandle">取消</el-button>
      </div>
    </div>
	</div>
</template>

<script>
  import {
    supplierNameData
  } from "@/api/module/materialfinishedApi.js";
  import {
    fabrictypeMaterialClass,
    fabrictypeSaleUnit,
    fabrictypeProductSeason,
    materialStatusList,
    fabrictypeMaterialproperties,
    fabrictypeProductcolor,
    fabrictypedictionaries
  } from "@/api/module/dictionariesApi.js";
	export default {
	  name: "finishedMaterialsCheck",
	  props: ['list', 'uploadFileList'],
	  data() {
	    return {
        ruleForm: null,
        fileList: [],
        unitList: [],
        seasonList: [],
        materialClassList: [],
        materialStatusList: [],
        supplierNameList: [],
        MaterialPropertiestypelist:[],
        colortypelist:[],
        materialSupplyTypelist:[],
        materialDeclarationCategorylist:[]
	    };
	  },
	  components: {},
	  created() {
	    this.ruleForm = this.list;
	  },
	  mounted() {
      // this.ruleForm = this.list;
      this.fileList = this.uploadFileList;
      this.getMaterialStatusList();
      this.getSupplierNameList();
      this.getSaleUnitList();
      this.getProductSeasonList();
      this.getMaterialClassList();
      this.getMaterialSupplyType();//是否可供
      this.getMaterialDeclarationCategory();//报关品类
      this.getMaterialPropertiesStatusList();
      this.getProductcolor();
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
        if(status!=null){
          for(var i = 0; i < list.length; i++){
            let item = list[i];
            if (item.index == status){
              return item.name;
            }
          }
        }
      },
       //获取供应商状态code
      typeHandleSupplier(status, list){
        if(status!=null){
           for(var i = 0; i < list.length; i++){
            let item = list[i];
            if (item.supplierId == status){
              return item.supplierCode;
            }
          }
        } 
      },
      getSaleUnitList() {
        // 采购计量单位
        // fabrictypeSaleUnit().then(res => {
        //   if(res.code === '0') {
        //     this.unitList = res.data;	
        //   }
        // });
        fabrictypedictionaries('MaterialFinishedProductUnit').then(response => {
          if(response.code === "0") {					
            this.unitList = response.data;
          }
        });
      },
      getProductSeasonList() {
        // 产品季
        fabrictypeProductSeason().then(res => {
          if(res.code === '0') {					
            this.seasonList = res.data;
          }
        });
      },
      getMaterialClassList() {
        // 物料分类
        fabrictypedictionaries('MaterialFinishedClass').then(res => {
          if(res.code === '0') {					
            this.materialClassList = res.data;
          }
        });
      },
       //获取供应商列表
     getSupplierNameList() {
        supplierNameData('', '','').then(res => {
          console.log('供应商名称：', res);
          if (res.code === '0') {
            this.supplierNameList = res.data;
          }
        });
      },
      getMaterialStatusList() {
        // 物料状态
        materialStatusList().then(res => {
          if(res.code === '0') {					
            this.materialStatusList = res.data;
          }
        });
      },
      //是否可供
      getMaterialSupplyType(){
        fabrictypedictionaries('MaterialSupplyType').then(response => {
          if (response.code === "0") {
            this.materialSupplyTypelist = response.data;
          }
        });
      },
       //报关品类
      getMaterialDeclarationCategory(){
        fabrictypedictionaries('MaterialDeclarationCategory').then(response => {
          if(response.code === "0") {					
            this.materialDeclarationCategorylist = response.data;
          }
        });
      },
      //物料属性
      getMaterialPropertiesStatusList(){
        fabrictypeMaterialproperties().then(response => {
          if(response.code === "0") {
            this.MaterialPropertiestypelist = response.data;	
          }
        });
      },
      //颜色
      getProductcolor(){ 		
        fabrictypeProductcolor().then(response => {
          if(response.code === "0") {					
            this.colortypelist = response.data;
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