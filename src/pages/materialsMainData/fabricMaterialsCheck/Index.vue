<template>
	<div class="container">
    <div class="base_wrap clearfix finished">
      <h2 class="title">物料基本信息</h2>

      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="200px"
        class="demo-form-inline">
        <el-form-item label="物料编号">
          <span>{{ruleForm.materialCode ? ruleForm.materialCode : ''}}</span>
        </el-form-item>
        <el-form-item label="物料系统编号">
          <span>{{ruleForm.materialId ? ruleForm.materialId : ''}}</span>
        </el-form-item>
         <el-form-item label='开发号'>
          <span>{{ruleForm.developCode ? ruleForm.developCode : ''}}</span>
        </el-form-item>
        <el-form-item label="物料名称">
          <span>{{ruleForm.materialName ? ruleForm.materialName : ''}}</span>
        </el-form-item>
        <el-form-item label="供应商编号">
          <span>
            {{typeHandleSupplier(ruleForm.supplierId,this.supplierNameList)}}
          </span>
        </el-form-item>
        <el-form-item label="供应商名称">
          <span>{{ruleForm.supplierName ? ruleForm.supplierName : ''}}</span>
        </el-form-item>
        <el-form-item label="技术规格描述">
           <span>{{ruleForm.combination ? ruleForm.combination : ''}}</span>
        </el-form-item>
        <el-form-item label="系列"> 
          <span>{{ruleForm.materialSeries ? ruleForm.materialSeries : ''}}</span>
        </el-form-item>
        <el-form-item label="物料成分">
          <span>{{ruleForm.materialComposition ? ruleForm.materialComposition : ''}}</span>
        </el-form-item>
        <el-form-item label="工厂季">
          <span>{{typeHandle(ruleForm.factorySeason, this.factorySeasontypelist)}}</span>
        </el-form-item>
         <el-form-item label="品类">
          <span>{{typeHandle(ruleForm.category, this.ProductCategorytypelist,'category')}}</span>
        </el-form-item>
         <el-form-item label="产品特性">
          <span>{{typeHandle(ruleForm.productSeason, this.seasontypelist)}}</span>
        </el-form-item>
        <el-form-item label="颜色">
          <span>{{typeHandle(ruleForm.color,this.colortypelist)}}</span>
        </el-form-item>
        <el-form-item label="采购计量单位">
          <span>{{typeHandle(ruleForm.purchaseMeasurementUnit,this.SaleUnittypelist)}}</span>
        </el-form-item>
        <el-form-item label="花型">
          <span>{{typeHandle(ruleForm.pattern, this.patterntypelist)}}</span>
        </el-form-item>
         <el-form-item label="延米克重">
          <span>{{ruleForm.weightPerMeterShow ? ruleForm.weightPerMeterShow : ''}}</span>&nbsp;&nbsp;克
        </el-form-item>
        <el-form-item label="产地">
          <span>{{typeHandle(ruleForm.placeOfMaterialion, this.placeProductiontypelist)}}</span>
        </el-form-item>
        <el-form-item label="幅宽">
          <span>{{ruleForm.widthShow ? ruleForm.widthShow : ''}}</span>&nbsp;&nbsp;
        </el-form-item>
        <el-form-item label="物料类型">
          <span>{{typeHandle(ruleForm.materialType, this.Materialtypelist)}}</span>
        </el-form-item>
        <el-form-item label="纱支">
          <span>{{ruleForm.yarnCount ? ruleForm.yarnCount : ''}}</span>
        </el-form-item>
         <el-form-item label="物料属性">
          <span>{{typeHandle(ruleForm.materialProperties, this.MaterialPropertiestypelist)}}</span>
        </el-form-item>
         <el-form-item label="最小起订量">
          <span>{{ruleForm.minOrder ? ruleForm.minOrder : ''}}</span>&nbsp;&nbsp;米
        </el-form-item>
        <el-form-item label="零剪物料属性">
          <span>{{typeHandle(ruleForm.retailMaterialProperties,this.materialPropertiesTypelist)}}</span>
        </el-form-item>
         <el-form-item label='经济批量'>
          <span>{{ruleForm.economicBatch ? ruleForm.economicBatch : ''}}</span>
        </el-form-item>
        <el-form-item label="职业装物料属性">
						<span>{{typeHandle(ruleForm.suitsMaterialProperties,this.suitsMaterialPropertiesTypelist)}}</span>
        </el-form-item>
         <el-form-item label="规格">
          <span>{{ruleForm.specifications ? ruleForm.specifications : ''}}</span>&nbsp;&nbsp;米/包
        </el-form-item>
        <el-form-item label="上市日期">
          <span>{{ruleForm.appearDate ? ruleForm.appearDate : ''}}</span>
        </el-form-item>
        <el-form-item label="批次管理">
           <span>{{ruleForm.isBatchManagement==true?"是":"否"}}</span>
        </el-form-item>     
        <el-form-item label="生命周期">
          <span>{{ruleForm.disappearDate ? ruleForm.disappearDate : ''}}</span>
        </el-form-item>
         <el-form-item label="EV产品">
          <span>{{ruleForm.belongToEv==true?"是":"否"}}</span>
        </el-form-item>
        <el-form-item label="报关品类">
          <span>{{typeHandle(ruleForm.declarationCategory,this.materialDeclarationCategorylist)}}</span>
        </el-form-item>
        <el-form-item label="快货">
          <span>{{ruleForm.mobileGoods==true?"是":"否"}}</span>
        </el-form-item>
        <el-form-item label="海关编号">
          <span>{{ruleForm.hsCode ? ruleForm.hsCode : ''}}</span>
        </el-form-item>
        <el-form-item label="是否可供">
          <span>{{typeHandle(ruleForm.whetherSupply,this.materialSupplyTypelist)}}</span>
        </el-form-item>
        <el-form-item label="海关关税系数">
          <span>{{ruleForm.customsTariffCoefficient ? ruleForm.customsTariffCoefficient : ''}}</span>
        </el-form-item>
        <el-form-item label="替代品">
          <span>{{ruleForm.substitute ? ruleForm.substitute : ''}}</span>
        </el-form-item>
        <el-form-item label="增值税系数">
          <span>{{ruleForm.valueAddedTaxCoefficient}}</span>
        </el-form-item>
        <el-form-item label="坯布编号">
          <span>{{ruleForm.rawFabricId ? ruleForm.rawFabricId : ''}}</span>
        </el-form-item>
         <el-form-item label="杂费系数">
          <span>{{ruleForm.miscChargesCoefficient}}</span>&nbsp;&nbsp;
        </el-form-item>
         <!-- <el-form-item label="在库安全库存">
          <span>{{ruleForm.safetyLocalStock}}</span>&nbsp;&nbsp;
        </el-form-item>
         <el-form-item label="在厂安全库存">
          <span>{{ruleForm.safetyFactoryStock}}</span>&nbsp;&nbsp;
        </el-form-item> -->
        <el-form-item class="whole" label="备注">
          <span>{{ruleForm.remarks ? ruleForm.remarks : ''}}</span>
        </el-form-item>
        <hr style="border: 0.5px solid #DCDFE6;" />
        <h2 class="title">交期信息（交期时间单位：天）</h2>
        <el-form-item
          label="工厂生产交期"
          class="message">
          <span>{{ruleForm.materialDeliveryDate.factoryDeliveryDate ? ruleForm.materialDeliveryDate.factoryDeliveryDate : ''}}</span>
        </el-form-item>
        <el-form-item
          class="message"
          label="发货（空运+清关+入库操作）交期">
          <span>{{ruleForm.materialDeliveryDate.shippmentDate ? ruleForm.materialDeliveryDate.shippmentDate : ''}}</span>
        </el-form-item>
        <el-form-item
          class="message"
          label="预付款交期">
          <span>{{ruleForm.materialDeliveryDate.advancePaymentDate ? ruleForm.materialDeliveryDate.advancePaymentDate : ''}}</span>
        </el-form-item>
        <el-form-item
          class="message"
          label="新首工厂生产交期">
          <span>{{ruleForm.materialDeliveryDate.firstFactoryDeliveryDate ? ruleForm.materialDeliveryDate.firstFactoryDeliveryDate : ''}}</span>
        </el-form-item>
        <el-form-item
          class="message"
          label="新首发货（空运+清关+入库操作）交期">
          <span>{{ruleForm.materialDeliveryDate.firstShippmentDate ? ruleForm.materialDeliveryDate.firstShippmentDate : ''}}</span>
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
    fabrictypeProductSeason,
    fabrictypeSaleUnit,
    fabrictypeMaterialType,
    fabrictypeProductcolor,
    fabrictypeProductpattern,
    fabrictypeProductmaterialGroup,
    fabrictypeMaterialABCClass,
    fabrictypeMaterialCode,
    fabrictypeMaterialSeries,
    fabrictypeMaterialproperties,
    fabrictypedictionaries
  } from "@/api/module/dictionariesApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
	export default {
	  name: "fabricMaterialsCheck",
	  props: ['list', 'uploadFileList'],
	  data() {
	    return {
        ruleForm: null,
        fileList: [],
        SaleUnittypelist:[],
        ProductCategorytypelist:[],
        ProductTypetypelist:[],
        seasontypelist:[],
        Materialtypelist:[],
        MaterialABCClasstypelist:[],
        MaterialCodetypelist:[],
        MaterialSeriestypelist:[],
        colortypelist:[],
        patterntypelist:[],
        materialGrouptypelist:[],
        MaterialPropertiestypelist:[],
        placeProductiontypelist:[],
        materialSupplyTypelist:[],
        factorySeasontypelist:[],
        materialDeclarationCategorylist:[],
        materialPropertiesTypelist:[],
        suitsMaterialPropertiesTypelist:[],
        supplierNameList:[],
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
      this.getProductCategory();
      this.getProductSeason();
      this.getMaterialType();
      this.getSupplierNameList();
      this.getMaterialABCClass();
      this.getMaterialCode();
      this.getProductcolor();
      this.getProductpattern();
      this.getProductmaterialGroup();
      this.getPlaceOfProduction();//产地
      this.getMaterialSupplyType();//是否可供
      this.getFactorySeason();//工厂季
      this.getMaterialDeclarationCategory();//报关品类
      this.getRetailAndSuitsMaterialProperties();//获取零剪物料属性
      this.getRetailSuitsMaterialProperties();//职业装物料属性
      this.getProductmaterialproperties();
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
      typeHandle(status, list,tagName) {
        console.log(status, list,tagName)
        if(status!=null){
          if(tagName=='category'){
            status=status.toString();
          }
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
      //物料属性
      getProductmaterialproperties(){
        fabrictypeMaterialproperties().then(response => {
          if(response.code === "0") {
            this.MaterialPropertiestypelist = response.data;	
          }
        });
      },
      //物料品牌
      getMaterialCode(){
        fabrictypeMaterialCode().then(response => {
          if(response.code === "0") {
            this.MaterialCodetypelist = response.data;	
          }
        });
      },
      //采购计量单位
      getSaleUnit(){
        fabrictypedictionaries('MaterialUnit').then(response => {
          if(response.code === "0") {					
            this.SaleUnittypelist = response.data;
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
      //产品品类
      getProductCategory(){
        // fabrictypeProductCategory().then(response => {
        //   if(response.code === "0") {
        //     this.ProductCategorytypelist = response.data;
        //   }
        // });
        fabrictypedictionaries('MaterialClass').then(response => {
          if(response.code === "0") {					
            this.ProductCategorytypelist = response.data;
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
      //物料组
      getProductmaterialGroup(){
        fabrictypeProductmaterialGroup().then(response => {
          if(response.code === "0") {					
            this.materialGrouptypelist = response.data;
          }
        });
      },
      //物料ABC分类
      getMaterialABCClass(){ 		
        fabrictypeMaterialABCClass().then(response => {
          if(response.code === "0") {					
            this.MaterialABCClasstypelist = response.data;
          }
        });
      },
      //获取零剪和职业装物料属性
    getRetailAndSuitsMaterialProperties(){
       fabrictypedictionaries('RetailMaterialProperties').then(response => {
        if (response.code === "0") {
          this.materialPropertiesTypelist = response.data;
        }
      });
    },
    //获取职业装物料属性
    getRetailSuitsMaterialProperties(){
       fabrictypedictionaries('SuitsMaterialProperties').then(response => {
        if (response.code === "0") {
          this.suitsMaterialPropertiesTypelist = response.data;
        }
      });
    },
      //物料类型
      getMaterialType(){ 		
        fabrictypeMaterialType().then(response => {
          if(response.code === "0") {					
            this.Materialtypelist = response.data;
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
      //产地
      getPlaceOfProduction(){
        fabrictypedictionaries('PlaceOfProduction').then(response => {
          if(response.code === "0") {					
            this.placeProductiontypelist = response.data;
          }
        });
      },
      //工厂季
      getFactorySeason(){
        fabrictypedictionaries('FactorySeason').then(response => {
          if(response.code === "0") {					
            this.factorySeasontypelist = response.data;
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