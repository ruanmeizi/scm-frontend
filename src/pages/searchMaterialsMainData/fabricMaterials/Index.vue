<template>
  <div class="container fabricMaterials">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <!-- <div class="display_ib mr10 mb10">
            <span class="tag">物料品牌：</span>
            <el-select class="select_single w200 mr10"
              v-model="brand"
              placeholder="请选择">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option
                v-for="item in this.MaterialCodetypelist"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
          </div> -->
          <!-- <div class="display_ib mr10 mb10">
            <span class="tag">供应商名称：</span>
            <el-input class="input_single w200 mr10" v-model.trim="supplierName" placeholder="请输入"></el-input>
          </div> -->
          <div class="display_ib mr10 mb10">
		        <span class="tag">供应商：</span>
            <el-select class="select_single w200 mr10"
              v-model="supplierId"
               @change="searchHandle"
              filterable
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierNameList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
		      </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
        </div>

        <!-- <el-select v-model.trim="brand" placeholder="物料品牌" class="selectfabc">
        	<el-option key="" label="请选择物料品牌" value=""></el-option>
				    <el-option
				      v-for="item in this.MaterialCodetypelist"
				      :key="item.index"
				      :label="item.name"
				      :value="item.index">
				    </el-option>
				</el-select>     
        <el-input class="input_single w200 mr10 mb10" v-model.trim="supplierName" placeholder="供应商名称"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="物料编号"></el-input> -->
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul> -->
          <!-- <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in fabricList"
              :key="index">
              <li class="w10p">{{item.id}}</li>
              <li class="w10p" :title="item.materialId">{{item.materialId}}</li>
              <li class="w10p" :title="item.materialCode">
              	<span class="underline" @click="editHandle(item)">{{item.materialCode}}</span>
              </li>
              <li class="w10p" :title="item.materialName">{{item.materialName}}</li>
              <li class="w10p" :title="item.brand">{{item.brand}}</li>
              <li class="w10p" :title="item.supplierName">{{item.supplierName}}</li>
              <li class="w10p" :title="item.materialClassificationname">{{item.materialClassificationname}}</li>
              <li class="w10p" :title="materialTypeHandle(item.materialProperties)">
              	{{materialTypeHandle(item.materialProperties)}}          	
              </li>
              <li class="w10p">
                <el-button type="text" @click="editHandle(item)">查看</el-button>
              </li>
            </ul>
          </div> -->
          <singleTable
          :tableList='fabricList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @checkHandle='editHandle'
          ></singleTable>
        </el-tabs>
        <!-- <p v-if="!this.fabricList.length&&!tableLoading" class="empty_tip">暂无数据</p> -->
        <div class="pagination_wrap fr">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="this.total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑页 -->
    <div class="form_part clearfix" v-else>
      <div class="base_wrap clearfix finished">
        <h2 class="title">物料基本信息</h2>        
        <el-form :inline="true" :model="ruleForm" ref="ruleForm"  label-width="200px" class="demo-form-inline">
          <el-form-item label="物料编号">
            <span>{{ruleForm.materialCode}}</span>
          </el-form-item>
          <el-form-item label="系统编号">
            <span>{{ruleForm.materialId}}</span>
          </el-form-item>
          <el-form-item label='开发号'>
              <span :title="ruleForm.developCode" class="overflow w60p inline_block">{{ruleForm.developCode}}</span>
          </el-form-item>
          <el-form-item  label="物料名称">
            <span :title="ruleForm.materialName" class="overflow w60p inline_block">{{ruleForm.materialName}}</span>
          </el-form-item>          
          <el-form-item label="供应商编号">
            <span>{{typeHandleSupplier(ruleForm.supplierId,this.supplierNameList)}}</span>
          </el-form-item>        
          <el-form-item label="供应商名称">
            <span :title="ruleForm.supplierName" class="overflow w60p inline_block">{{ruleForm.supplierName}}</span>
          </el-form-item>
          <el-form-item label="技术规格描述">
            <span>{{ruleForm.combination ? ruleForm.combination : ''}}</span>
          </el-form-item>
          <el-form-item label="系列">
						<span>{{ruleForm.materialSeries}}</span>
          </el-form-item>
          <el-form-item label="物料成分">
            <span>{{ruleForm.materialComposition}}</span>
          </el-form-item>
          <el-form-item label="工厂季">
            <span>{{ruleForm.factorySeason}}</span>
          </el-form-item>
          <el-form-item label="品类">
						<span>{{typeHandle(ruleForm.category,this.ProductCategorytypelist)}}</span>
          </el-form-item>
          <el-form-item label="产品特性">
						<span>{{typeHandle(ruleForm.productSeason,this.seasontypelist)}}</span>
          </el-form-item>
           <el-form-item label="颜色">
						<span>{{typeHandle(ruleForm.color,this.colortypelist)}}</span>
          </el-form-item>
          <el-form-item label="采购计量单位">
						<span>{{typeHandle(ruleForm.purchaseMeasurementUnit,this.SaleUnittypelist)}}</span>
          </el-form-item>
          <el-form-item label="花型">
							<span>{{typeHandle(ruleForm.pattern,this.patterntypelist)}}</span>
          </el-form-item>  
          <el-form-item label="延米克重">
            <span>{{ruleForm.weightPerMeterShow}}&nbsp;&nbsp;克</span>
          </el-form-item>
          <el-form-item label="产地">
            <span>{{typeHandle(ruleForm.placeOfMaterialion,this.placeProductiontypelist)}}</span>
          </el-form-item>
          <el-form-item label="幅宽">
            <span>{{ruleForm.widthShow}}&nbsp;&nbsp;</span>
          </el-form-item> 
          <el-form-item label="物料类型">
						<span>{{typeHandle(ruleForm.materialType,this.Materialtypelist)}}</span>
          </el-form-item>
          <el-form-item label="纱支">
            <span :title="ruleForm.yarnCount" class="overflow w60p inline_block">{{ruleForm.yarnCount}}</span>
          </el-form-item>    
          <el-form-item label="物料属性">
						<span>{{typeHandle(ruleForm.materialProperties,this.MaterialPropertiestypelist)}}</span>
          </el-form-item>
           <el-form-item label="最小起订量">
            <span>{{ruleForm.minOrder}}&nbsp;&nbsp;米</span>
          </el-form-item>
          <el-form-item label="零剪物料属性">
						<span>{{typeHandle(ruleForm.retailMaterialProperties,this.materialPropertiesTypelist)}}</span>
          </el-form-item>
          <el-form-item label='经济批量'>
              <span :title="ruleForm.economicBatch" class="overflow w60p inline_block">{{ruleForm.economicBatch}}</span>
          </el-form-item>
           <el-form-item label="职业装物料属性">
						<span>{{typeHandle(ruleForm.suitsMaterialProperties,this.suitsMaterialPropertiesTypelist)}}</span>
          </el-form-item>
           <el-form-item label="规格">
            <span>{{ruleForm.specifications}}</span>
          </el-form-item>
          <el-form-item label="上市日期">
            <span>{{ruleForm.appearDate}}</span>
          </el-form-item>
          <el-form-item label="批次管理">
            <span>{{ruleForm.isBatchManagement==true?"是":"否"}}</span>
          </el-form-item>
          <el-form-item label="生命周期">
            <span>{{ruleForm.disappearDate}}</span>
          </el-form-item>     
           <el-form-item label="EV产品">
              <!-- <el-checkbox label="" disabled v-model.trim="ruleForm.belongToEv"></el-checkbox> -->
              <span>{{ruleForm.belongToEv==true?"是":"否"}}</span>
          </el-form-item>   
           <el-form-item label="报关品类">
             <span>{{typeHandle(ruleForm.declarationCategory,this.materialDeclarationCategorylist)}}</span>
          </el-form-item>  
           <el-form-item label="快货">
             <span>{{ruleForm.mobileGoods==true?"是":"否"}}</span>
            <!-- <el-checkbox label="" disabled name="type" v-model.trim="ruleForm.mobileGoods"></el-checkbox> -->
          </el-form-item> 
          <el-form-item label="海关编号">
            <span>{{ruleForm.hsCode}}</span>
          </el-form-item> 
          <el-form-item label="是否可供">
            <span>{{typeHandle(ruleForm.whetherSupply,this.materialSupplyTypelist)}}</span>
          </el-form-item>
           <el-form-item label="海关关税系数">
            <span>{{ruleForm.customsTariffCoefficient}}</span>
          </el-form-item> 
          <el-form-item label="替代品">
            <span>{{ruleForm.substitute}}</span>
          </el-form-item>
           <el-form-item label="增值税系数">
            <span>{{ruleForm.valueAddedTaxCoefficient}}</span>
          </el-form-item>
          <el-form-item label="坯布编号">
            <span>{{ruleForm.rawFabricId}}</span>
          </el-form-item>
           <el-form-item label="杂费系数" >
            <span>{{ruleForm.miscChargesCoefficient}}&nbsp;&nbsp;</span>
          </el-form-item>
           <!-- <el-form-item label="在库安全库存">
            <span>{{ruleForm.safetyLocalStock}}</span>&nbsp;&nbsp;
          </el-form-item>
          <el-form-item label="在厂安全库存">
            <span>{{ruleForm.safetyFactoryStock}}</span>&nbsp;&nbsp;
          </el-form-item> -->
          <el-form-item class="whole" label="备注">
            <span>{{ruleForm.remarks}}</span>
          </el-form-item>

          <hr style="border: 0.5px solid #DCDFE6;" />
          <h2 class="title">交期信息（交期时间单位：天）</h2>
          <el-form-item label="工厂生产交期" class="message">                       
            <span>{{ruleForm.materialDeliveryDate.factoryDeliveryDate}}</span>
          </el-form-item>
          <el-form-item class="message" label="发货（空运+清关+入库操作）交期">
            <span>{{ruleForm.materialDeliveryDate.shippmentDate}}</span>
          </el-form-item>
          <el-form-item class="message" label="预付款交期">
            <span>{{ruleForm.materialDeliveryDate.advancePaymentDate}}</span>
          </el-form-item>
          <el-form-item class="message" label="新首工厂生产交期">
            <span>{{ruleForm.materialDeliveryDate.firstFactoryDeliveryDate}}</span>
          </el-form-item>
          <el-form-item class="message" label="新首发货（空运+清关+入库操作）交期">
            <span>{{ruleForm.materialDeliveryDate.firstShippmentDate}}</span>
          </el-form-item>
        </el-form>
      </div>
     
      <div class="mt20 fr">
        <el-button type="primary" class="mr10" @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </div>
    
    
    <!--删除-->
	<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
		<span>确定删除该条面料物料主数据?</span>
		<span slot="footer" class="dialog-footer">
	    <el-button @click="dialogdelVisible = false">取 消</el-button>
	    <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
	  </span>
	</el-dialog>
    
   
    
  </div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { 
	purchasegetuuid,
	materialsFabricList,
	fabrictypeadd,
  fabrictypeupd,
  fabrictypedel,
  fabrictypeview
} from "@/api/module/materialsApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
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
import { timeFormat } from '@/utils/index.js';
export default {
  name: "fabricMaterials",
  props: [],
  data() {
    return {
      inputData: '',
      fabricList: [],
      isEdit: false,
      loadingcommit:false,
      dialogdelVisible:false,
      tableLoading: true,
      delid:'',
      supplierId:'',
      updid:'',
      edittag:'',
      brand:'',
      supplierName:'',
      materialCode:'',
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
      materialPropertiesTypelist:[],
      suitsMaterialPropertiesTypelist:[],
      materialDeclarationCategorylist:[],
      supplierNameList:[],
      // form
      ruleForm:{
        	materialCode:'',
        	materialBarcode:'',
        	materialName:'',
        	materialSeries:'',
        	brand:'',
        	category:'',
        	producerCode:'',
        	productSeason:'',
        	supplierId:'',
        	width:'',
        	supplierName:'',
        	color:'',
        	minOrder:'',
        	pattern:'',
        	weightPerMeter:'',
        	weightPerSquareMeter:'',
        	yarnCount:'',
        	placeOfMaterialion:'',
        	purchaseMeasurementUnit:'',
        	hsCode:'',
        	numbersPerMeasurementUnit:'',
        	materialProperties:'',
        	mobileGoods:false,
        	materialGroup:'',
        	isBatchManagement:false,
        	materialType:'',
        	appearDate:'',
        	rawFabricId:'',
        	disappearDate:'',
        	materialClassification:'',
        	substitute:'',
        	materialComposition:'',
        	oceanFreightCoefficient:'',
          airFreightCoefficient:'',
          agentChargeCoefficient:'',
          miscChargesCoefficient:'',
          valueAddedTaxCoefficient:'',
          customsTariffCoefficient:'',
        	remarks:'',
        	uuid:'',
        	materialDeliveryDate:{
		      	factoryDeliveryDate:'',
		      	shippmentDate:'',
		      	advancePaymentDate:'',
		      	firstFactoryDeliveryDate:'',
		      	firstShippmentDate:'',
		      	uuid:''
		    }
      },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      fieldList: [
        {
          name: '序号',
          class: 'w10p'
        },
        {
          name: '面料物料系统编号',
          class: 'w10p'
        },
        {
          name: '面料物料编号',
          class: 'w10p'
        },
        {
          name: '物料名称',
          class: 'w10p'
        },
        {
          name: '物料品牌',
          class: 'w10p'
        },
        {
          name: '供应商名称',
          class: 'w10p'
        },
        {
          name: '物料ABC分类',
          class: 'w10p'
        },
        {
          name: '物料属性',
          class: 'w10p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name:'序号',
          field:'idIndex'
        },
        {
          name:'物料编号',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'技术规格描述',
          field:'combination',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'供应商编号',
          field:'supplierId',
          fabricSupplier:'fabricSupplier'
        },
        {
          name:'物料类型',
          field:'materialType',
          fabrictype:'fabrictype'
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'工厂季',
          field:'factorySeason',
          width: '120',
        },
        // {
        //   name:'是否新品',
        //   field:'developCode',
        //   isDevelop:true
        // }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '150',
          minWidth: '10%',
          isAction: true,
          hasCheck:true,
        },
      ]

    };
  },
  components: {
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getSaleUnit();
    this.getProductCategory();
    this.getProductSeason();
    this.getMaterialType();
    this.getMaterialABCClass();
    this.getMaterialCode();
    this.getMaterialSeries();
    this.getProductcolor();
    this.getProductpattern();
    this.getProductmaterialGroup();
    this.getProductmaterialproperties();
    this.getPlaceOfProduction();
    this.getMaterialDeclarationCategory();//报关品类
    this.getSupplierNameList();//获取供应商列表
    this.getMaterialSupplyType();//是否可供
    this.getRetailAndSuitsMaterialProperties();//获取零剪物料属性
    this.getRetailSuitsMaterialProperties();//获取职业装物料属性
    this.getMaterialsFabricList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: { 	
  	//获取状态名称
  	typeHandle(status,list,tag) {
  		for(var i=0;i<list.length;i++){
      	let item=list[i];
      	if(item.index==status){
      		return item.name
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
  	//获取状态名称
  	materialTypeHandle(status) {
		  for(var i=0;i<this.MaterialPropertiestypelist.length;i++){
      	let item=this.MaterialPropertiestypelist[i];
      	if(item.index==status){
      		return item.name
      	}
      }
  	},
  	  // 过滤输入的数字
    InputNumber (property) {
       this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
     },
      // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
    	console.log(val)
      if (val === 0 || val === '0' || val === '') {
        return ''
      }else {
        let value = null
        value = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        console.log(value)
        return Number(value)
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
  	//物料系列
  	getMaterialSeries(){
  		fabrictypeMaterialSeries().then(response => {
				if(response.code === "0") {
					this.MaterialSeriestypelist = response.data;	
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
  	//物料品牌
  	getMaterialCode(){
  		fabrictypeMaterialCode().then(response => {
				if(response.code === "0") {
					this.MaterialCodetypelist = response.data;	
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
     //获取零剪物料属性
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
     //获取是否可供
    getMaterialSupplyType(){
       fabrictypedictionaries('MaterialSupplyType').then(response => {
        if (response.code === "0") {
          this.materialSupplyTypelist = response.data;
        }
      });
    },
  	//采购计量单位
  	getSaleUnit(){
  		fabrictypeSaleUnit().then(response => {
				if(response.code === "0") {
					this.SaleUnittypelist = response.data;	
				}
			});
  	},
  	//产品品类
  	getProductCategory(){
  		// fabrictypeProductCategory().then(response => {
			// 	if(response.code === "0") {
			// 		this.ProductCategorytypelist = response.data;
			// 	}
      // });
       fabrictypedictionaries('MaterialClass').then(response => {
          if(response.code === "0") {					
            this.ProductCategorytypelist = response.data;
          }
        });
  	},
  	//产品季/产品特性
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
    //物料类型
  	getMaterialType(){ 		
  		fabrictypeMaterialType().then(response => {
				if(response.code === "0") {					
					this.Materialtypelist = response.data;
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
  	changeCode() {
  		console.log(this.ruleForm)
		},
    resetForm() {
       this.isEdit = false;
       this.ruleForm={
       	materialDeliveryDate:{
       		
       	}
       };
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getMaterialsFabricList();
    },
    editHandle(index,item) {
      // 编辑项
      this.isEdit = true;
      this.edittag='updated';
      this.updid=item.id;
      fabrictypeview(item.id).then(response => {
			if(response.code === "0") {
				this.ruleForm=response.data;
				if(this.ruleForm.appearDate!=null&&this.ruleForm.appearDate!=''){
					this.ruleForm.appearDate=timeFormat(response.data.appearDate);
					this.ruleForm.appearDate=this.ruleForm.appearDate.substring(0, 10);
				}
				if(this.ruleForm.disappearDate!=null&&this.ruleForm.disappearDate!=''){
					this.ruleForm.disappearDate=timeFormat(response.data.disappearDate);
					this.ruleForm.disappearDate=this.ruleForm.disappearDate.substring(0, 10);
				}		
			}
	  });
    },
    getuuid(){
    	purchasegetuuid().then(response => {
				if(response.code === "0") {
					this.ruleForm.uuid = response.data;
				}
			});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMaterialsFabricList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMaterialsFabricList();
    },
    getMaterialsFabricList() {
    	this.tableLoading = true;
      let data = {
        brand: this.brand,
        materialCode:this.materialCode,
        supplierId: this.supplierId
      };
      materialsFabricList(this.currentPage, this.pageSize, data).then(res => {
	       console.log('面料物料主数据列表：', res);
	       if (res.code === '0') {
	       	 this.tableLoading = false;
	          this.fabricList = res.data.records;
	          this.total = res.data.total;
	          for(var i=0;i<this.fabricList.length;i++){
	          	var item=this.fabricList[i];
              if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
              }else{
              item.idIndex=i+1;
              }
	          	for(var a=0;a<this.MaterialABCClasstypelist.length;a++){
	          		var aitem=this.MaterialABCClasstypelist[a];
	          		if(item.materialClassification==aitem.index){
	          			item.materialClassificationname=aitem.name;
	          			this.$forceUpdate();
	          		}
	          	}

	          }
	       }
      });
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.overflow{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.red{
	color: #F56C6C;
}
.ml {
	margin-left: 10px;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.fabricMaterials {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
    li {
      outline: none;
    }
    &.childcontentlist {
      height: 60px;
      line-height: 40px;
    }
    &.childlist {
      li {
        cursor: pointer;
      }
    }
  }
  .submit_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
}
.edit_parent_list {
  ul {
    &.childcontentlist {
      height: 120px;
    }
  }
  .edit_btn_wrap{
    margin-top: 20px;
  }
}

.pagination_wrap {
  margin-top: 20px;
}

.check_popup_part {
  ul {
    &.childcontentlist {
      height: 80px;
    }
  }
}

ul {
  &.childcontentlist {
    li {
      /*white-space: normal;*/
     overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.form_part {
  .title {
    margin-bottom: 30px;
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
  }
  .demo-ruleForm {
    width: 45%;
  }
}
select.selectstatus {
	width: 200px;
	height: 40px;
	border-radius: 5px;
	border: 1px solid #DCDFE6;
	text-indent: 1em;
	color: #606266;
	line-height: 20px;
	font-size: 14px;
}

select.selectstatus>option {
	font-size: 14px;
}

select.selectstatus {
	background: #FFFFFF;
}
.el-select.selectfabc {
    margin-right: 10px;
}
</style>
<style>
.fabricMaterials label.el-checkbox{
	width: 200px;
}
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.subnav_wrap .el-tabs__content {
  overflow: visible;
}
.subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
.subnav_wrap ul.el-dropdown-menu li.el-dropdown-menu__item {
  padding: 0 10px;
}

.fabricMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.fabricMaterials .el-form-item__content {
 width: 60%!important;
}
.fabricMaterials .el-input {
  width: auto;
}
.fabricMaterials .whole_long .el-form-item__content {
  width: 65%;
}
.fabricMaterials .whole_long .el-input {
  width: 100%;
}
form.el-form.demo-ruleForm.fl.tag{
	width: 80%;
	.el-form-item {
	    width: 63%!important;
	}
}
.form_part .demo-ruleForm{
    width: 80%;
}


</style>