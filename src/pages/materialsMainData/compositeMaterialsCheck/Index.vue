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
        <el-form-item label="生产商名称">
          <span>{{ruleForm.manufacturerName ? ruleForm.manufacturerName : ''}}</span>
        </el-form-item>
         <el-form-item label="物料分类">
          <span>{{typeHandle(ruleForm.materialClassification, this.MaterialClasstypelist)}}</span>
        </el-form-item>
         <el-form-item label="供应商编号">
           <span>
            {{typeHandleSupplier(ruleForm.supplierId,this.supplierNameList)}}
          </span>
        </el-form-item>
        <el-form-item label="物料属性">
          <span>{{typeHandle(ruleForm.materialProperties, this.MaterialPropertiestypelist)}}</span>
        </el-form-item>
        <el-form-item label="供应商名称">
          <span>{{ruleForm.supplierName ? ruleForm.supplierName : ''}}</span>
        </el-form-item>
         <el-form-item label="产品特性">
          <span>{{typeHandle(ruleForm.productSeason, this.seasontypelist)}}</span>
        </el-form-item>
        <el-form-item label="总页数">
          <span>{{ruleForm.pageCount ? ruleForm.pageCount : ''}}</span>&nbsp;&nbsp;页
        </el-form-item>
         <el-form-item label="销售季">
          <span>{{typeHandle(ruleForm.saleSeason, this.SaleSeasoutypelist)}}</span>
        </el-form-item> 
         <el-form-item label="品牌">
          <span>{{typeHandle(ruleForm.brand, this.MaterialCodetypelist)}}</span>
        </el-form-item>
        <el-form-item label="计量单位">
          <span>{{typeHandle(ruleForm.calculationUnit, this.SaleUnittypelist)}}</span>
        </el-form-item>      
        <el-form-item label="上市时间">
          <span>{{ruleForm.validDate ? ruleForm.validDate : ''}}</span>
        </el-form-item>
        <el-form-item label="单位重量">
          <span>{{ruleForm.unitGram ? ruleForm.unitGram : '450'}}</span>&nbsp;&nbsp;克
        </el-form-item>
        <el-form-item label="报关品类">
          <span class="w300">{{typeHandle(ruleForm.declarationCategory, this.materialDeclarationCategorylist)}}</span>
         </el-form-item>
        <el-form-item label="生命周期">
          <span>{{ruleForm.invalidDate ? ruleForm.invalidDate : ''}}</span>
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
        <el-form-item class="whole" label="备注">
          <span>{{ruleForm.remarks ? ruleForm.remarks : ''}}</span>
        </el-form-item>
        <hr style="border: 0.5px solid #DCDFE6;" />
        <div class="childtit">
          <h2 class="title">组合物料组成信息</h2>
        </div>
        <div class="addcontent_content">
          <ul class="content_form"  v-for="(item, index) in this.ruleForm.combinedMaterialMessagesList"
            :key="index">
            <li class="w20p">
              <div class="form_item">
                <span>组成物料编号：<span>{{item.combinedMaterialCode ? item.combinedMaterialCode : ''}}</span></span>
              </div>
            </li>
            <li class="w10p">
              <div class="form_item">
                <span>数量：<span>{{item.quantity ? item.quantity : ''}}</span></span>
              </div>
            </li>        		
            <li class="w3p">
              <div class="form_item">
                <span>单位</span>
              </div>
            </li>	
            <li class="w8p">
              <div class="form_item">
                <span>页码：<span>{{item.pageNumber ? item.pageNumber : ''}}</span></span>
              </div>
            </li>  
            <li class="w9p">
              <div class="form_item">
                <span>位置：<span>{{item.position ? item.position : ''}}</span></span>
              </div>
            </li>         		
            <li class="w10p">
              <div class="form_item">
                <span>长：<span>{{item.length ? item.length : ''}}厘米</span></span>
              </div>
            </li>
            <li class="w10p">
              <div class="form_item">
                <span>宽：<span>{{item.width ? item.width : ''}}厘米</span></span>
              </div>
            </li>    
            <li class="w7p">
              <div class="form_item">
                <span>拍照款：</span>
                <span>{{item.photoStyle==true?"是":"否"}}</span>
              </div>
            </li>
            <li class="w10p">
              <div class="form_item">
                <span>备注：</span>
                <span>{{item.remarks ? item.remarks : ''}}</span>
              </div>
            </li>
          </ul>
        </div>
      </el-form>
    </div>
    <div class="mt20 fr">
      <el-button class="mr10" @click="cancelHandle">取消</el-button>
    </div>
    
	</div>
</template>

<script>
  import {
    fabrictypeProductSeason,
    fabrictypeSaleUnit,
    fabrictypeMaterialCode,
    fabrictypeMaterialproperties,
    fabricCompositeMaterial,
    fabrictypeMaterialUnit,
    fabrictypeSaleSeasou,
    fabrictypePosition,
    fabrictypedictionaries 
  } from "@/api/module/dictionariesApi.js";
  import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
	export default {
	  name: "compositeMaterialsCheck",
	  props: ['list', 'uploadFileList'],
	  data() {
	    return {
        ruleForm: null,
        fileList: [],
        SaleUnittypelist:[],
        ProductTypetypelist:[],
        seasontypelist:[],
        MaterialCodetypelist:[],
        MaterialPropertiestypelist:[],
        MaterialClasstypelist:[],
        MaterialUnittypelist:[],	 
        SaleSeasoutypelist:[],
        supplierNameList:[],
        materialDeclarationCategorylist:[],
	    };
	  },
	  components: {},
	  created() {
	    this.ruleForm = this.list;
	  },
	  mounted() {
      // this.ruleForm = this.list;
      this.fileList = this.uploadFileList;
      this.getMaterialClass();
      this.getSaleUnit();
      this.getProductSeason();
      this.getMaterialCode();
      this.getProductmaterialproperties();
      this.getMaterialUnit();
      this.getSaleSeasou();
      this.getSupplierNameList();
      this.getMaterialDeclarationCategory();//报关品类
      this.getSalePosition(); 
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
          if (item.index == status){
            return item.name;
          }
        }
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
      //位置
      getSalePosition(){
        fabrictypePosition().then(response => {
          if(response.code === "0") {
            this.positionlist = response.data;	
          }
        });
      },
      //销售季
      getSaleSeasou(){
        fabrictypedictionaries('CombinedMaterialSaleSeason').then(response => {
          if (response.code === "0") {
            this.SaleSeasoutypelist = response.data;
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
      //计量单位
      getMaterialUnit(){
        fabrictypeMaterialUnit().then(response => {
          if(response.code === "0") {
            this.MaterialUnittypelist = response.data;	
          }
        });
      },
      //物料分类
      getMaterialClass(){
        fabricCompositeMaterial().then(response => {
          if(response.code === "0") {
            this.MaterialClasstypelist = response.data;	
          }
        });
      },
      //物料属性
      getProductmaterialproperties(){
        fabrictypedictionaries('CombinedMaterialProperties').then(response => {
          if (response.code === "0") {
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
         fabrictypedictionaries('CombinedMaterialUnit').then(response => {
            if(response.code === "0") {					
              this.SaleUnittypelist = response.data;
            }
         });
      },
      //产品季
      getProductSeason(){ 		
        fabrictypeProductSeason().then(response => {
          if(response.code === "0") {					
            this.seasontypelist = response.data;
            for(var i=0;i<this.ruleForm.combinedMaterialMessagesList;i++){
              let item=this.ruleForm.combinedMaterialMessagesList[i];
              item.seasontypelist=response.data;
            }
            
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
  ul.content_form{
    width: 100%;
    height: 55px;
    li{
      float: left;
      
      /*width: 13%;*/
      font-size: 14px;
      color: #606266;
      margin: 0 0.5%;
      display: flex;
      .form_item{
        display: flex;
        width:100%;
        span{
          margin-top: 12px;
        }
        select.selectstatus{
          width:100%;
        }
        /*span{
          width: 50px;
          word-wrap:break-word; word-break:break-all;overflow: hidden;
        }*/
      }    
      .el-input{
        /*width: 100px;*/
      }
      select.selectstatus{
        /*width:70px;*/
      }
      label.el-checkbox{
        margin-top: 12px;
      }
    }
    li:first-child{
        .el-input{
            /*width: 120px;*/
          }
    }
    li:nth-child(8){
      .el-input{
          /*width:90px;*/
      }
    }
    li:nth-child(2),li:nth-child(4),li:nth-child(5),li:nth-child(6),li:nth-child(7){
      .el-input{
          /*width:60px;*/
          /*margin-right: 5px;*/
      }
    }
  }

}

</style>