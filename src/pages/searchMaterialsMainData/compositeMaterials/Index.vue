<template>
  <div class="container compositeMaterials">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">组合物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">组合物料分类：</span>
            <el-select class="select_single w200 mr10"
              v-model="materialClassification"
              @change="searchHandle"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in this.MaterialClasstypelist"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- <el-select v-model.trim="materialClassification" placeholder="" class="selectfabc">
        	<el-option key="" label="请选择组合物料分类" value=""></el-option>
				    <el-option
				      v-for="item in this.MaterialClasstypelist"
				      :key="item.index"
				      :label="item.name"
				      :value="item.index">
				    </el-option>
			</el-select>     
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="组合物料编号"></el-input> -->
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
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in fabricList"
              :key="index">
              <li class="w10p">{{item.id}}</li>
              <li class="w20p" :title="item.materialId">{{item.materialId}}</li>
              <li class="w15p" :title="item.materialCode">
              	<span class="underline" @click="editHandle(item)">
              	{{item.materialCode}}
              	</span>
              </li>
              <li class="w15p" :title="item.materialName">{{item.materialName}}</li>
              <li class="w12p" :title="materialTypeHandle(item.materialClassification)">{{materialTypeHandle(item.materialClassification)}}</li>
              <li class="w12p" :title="item.sale">{{item.sale==true?'可售':'停售'}}</li>             
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
          
          <el-form-item label="物料名称">
            <span>{{ruleForm.materialName}}</span>
          </el-form-item>
          <el-form-item label="生产商名称">
            <span>{{ruleForm.materialCode}}</span>
          </el-form-item>
          <el-form-item label="物料分类">
            <span>{{typeHandle(ruleForm.materialClassification,this.MaterialClasstypelist)}}</span>
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
            <span>{{typeHandle(ruleForm.productSeason,this.seasontypelist)}}</span>          
          </el-form-item>
          <el-form-item label="总页数">
            <span>{{ruleForm.pageCount}}&nbsp;&nbsp;页</span>
          </el-form-item>
          <el-form-item label="销售季">
		            <span>{{typeHandle(ruleForm.saleSeason,this.SaleSeasoutypelist)}}</span>
	         </el-form-item> 
           <el-form-item label="品牌">         	
             <span>{{typeHandle(ruleForm.brand,this.MaterialCodetypelist)}}</span>
          </el-form-item>
          <el-form-item label="计量单位">
             <span>{{typeHandle(ruleForm.calculationUnit,this.SaleUnittypelist)}}</span>
          </el-form-item>
          <el-form-item label="上市时间">
            <span>{{ruleForm.validDate}}</span>
          </el-form-item>  
          <el-form-item label="单位重量">
            <span>{{ruleForm.unitGram ? ruleForm.unitGram : '450'}}</span>&nbsp;&nbsp;克
          </el-form-item>
          <!-- <el-form-item label="是否可供">
            <el-checkbox disabled label="" name="type" v-model.trim="ruleForm.whetherSupply"></el-checkbox>
          </el-form-item> -->
           <el-form-item label="报关品类">
             <span>{{typeHandle(ruleForm.declarationCategory,this.materialDeclarationCategorylist)}}</span>
          </el-form-item>  
           <el-form-item label="生命周期">
             <span>{{ruleForm.invalidDate}}</span>
          </el-form-item>  
          
          <el-form-item label="海关编号">
             <span>{{ruleForm.hsCode}}</span>
          </el-form-item>
           <el-form-item label="杂费系数">
             <span>{{ruleForm.miscChargesCoefficient}}&nbsp;&nbsp;</span>
          </el-form-item>
           <el-form-item label="海关关税系数">
            <span>{{ruleForm.customsTariffCoefficient}}</span>
          </el-form-item>

           <el-form-item label="增值税系数">
            <span>{{ruleForm.valueAddedTaxCoefficient}}</span>
          </el-form-item>
          
         <el-form-item class="whole" label="备注">
            <span>{{ruleForm.remarks}}</span>
          </el-form-item>

          <!-- <el-form-item label="产品季" >
            <span>{{typeHandle(ruleForm.productSeason,this.seasontypelist)}}</span>
          </el-form-item> 
           <el-form-item label="是否可售">
            <el-checkbox disabled label="" name="type" v-model.trim="ruleForm.sale"></el-checkbox>
          </el-form-item>
          
          <el-form-item label="海运运费系数" >
            <span>{{ruleForm.oceanFreightCoefficient}}&nbsp;&nbsp;元/千克</span>
          </el-form-item>
          <el-form-item label="空运运费系数" >
            <span>{{ruleForm.airFreightCoefficient}}&nbsp;&nbsp;元/千克</span>
          </el-form-item>
          <el-form-item label="代理费系数" >
             <span>{{ruleForm.agentChargeCoefficient}}&nbsp;&nbsp;%</span>
          </el-form-item> -->
          
          <hr style="border: 0.5px solid #DCDFE6;" />
          <div class="childtit">
          	<h2 class="title">组合物料组成信息</h2>
          </div>         
          <div class="addcontent_content">
          	<ul class="content_form" v-if="ifchildshow==true"  v-for="(item,index) in this.ruleForm.combinedMaterialMessagesList"
              :key="index">
          		<li class="w20p">
          			<div class="form_item">
          			  <span>组成物料编号:</span>
									<span>{{item.combinedMaterialCode}}</span>
          			</div>
          		</li>
          		<li class="w10p">
          			<div class="form_item">
          				<span>数量:</span>
          			  <span>{{item.quantity}}</span>
          			</div>
          		</li>        		
          		<li class="w3p">
          			<div class="form_item">
          				<span>单位</span>
          			</div>
          		</li>	
          		<li class="w8p">
          			<div class="form_item">
          				<span>页码:</span>
          			  <span>{{item.pageNumber}}</span>
          			</div>
          		</li>  
          		<li class="w9p">
          			<div class="form_item">
          				<span>位置:</span>
          				<span>{{item.position}}</span>
          			</div>
          		</li>         		
          		<li class="w10p">
          			<div class="form_item">
          				<span>长:</span>
          				<span>{{item.length}}</span>
          				<span>&nbsp;厘米</span>
          			</div>
          		</li>
          		<li class="w10p">
          			<div class="form_item">
          				<span>宽:</span>
          				<span>{{item.width}}</span>
          				<span>&nbsp;厘米</span>
          			</div>
          		</li>    
          		<li class="w7p">
          			<div class="form_item">
          				<span>拍照款:</span>
          				 <el-checkbox disabled label="" name="type" v-model.trim="item.photoStyle"></el-checkbox>
          			</div>
          		</li>
          		<li class="w10p">
          			<div class="form_item">
          				<span>备注:</span>
          				<span :title="item.remarks" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{item.remarks}}</span>
          			</div>
          		</li>
          		<li class="w3p">
                
              </li>
          	</ul>
          	<div class="formtable_null" style="text-align: center;margin-top: 15px;" v-if="ifchildshow==false">
	            <img src="../../../assets/image/add.png" style="width:200px;height:100px;" />
	            <p>信息空空如也</p>
	          </div>
          </div>
          
         
        </el-form>
      </div>
     
      <div class="mt20 fr">
        <el-button type="primary" class="mr10" @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </div>
    
    
  
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
  fabrictypeview,
  purchasegetmaterialCode
} from "@/api/module/compositeMaterialsApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
import {
  fabrictypeProductSeason,
  fabrictypeSaleUnit,
  fabrictypeMaterialCode,
  fabrictypeMaterialproperties,
  fabricCompositeMaterial,
  fabrictypeMaterialUnit,
  fabrictypeSaleSeasou,
  fabrictypePosition,
  fabrictypeProductCategory,
  materialSupplyType,
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "compositeMaterials",
  props: [],
  data() {
    return {
    	surecommittitle:'',
      inputData: '',
      fabricList: [],
      isEdit: false,
      loadingcommit:false,
      dialogdelVisible:false,
      ifchildshow: false,
      nullboolean: true,
      sameboolean:true,
      surecommit:true,
      tableLoading: true,
      delid:'',
      updid:'',
      edittag:'',
      brand:'',
      supplierName:'',
      materialCode:'',
      materialClassification:'',
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
      // form
      ruleForm:{
        	materialCode:'',
          insideCode:'',
          materialName:'',
          materialProperties:'',
          materialClassification:'',
          pageCount:'',
          calculationUnit:'',
          brand:'',
          manufacturerName:'',
          validDate:'',
          productSeason:'',
          invalidDate:'',
          saleSeason:'',
          sale:false,
          oceanFreightCoefficient:'',
		      airFreightCoefficient:'',
		      agentChargeCoefficient:'',
		      miscChargesCoefficient:'',
		      valueAddedTaxCoefficient:'',
		      customsTariffCoefficient:'',
          remarks:'',
          uuid:'',
		      combinedMaterialMessagesList:[],
      },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      positionlist:[],
      timeout:  null,
      restaurants: [],
      list:[
       {
       	value:'1112'
       },
       {
       	value:'1122'
       },
       {
       	value:'1123'
       }
      ],
      fieldList: [
        {
          name: '序号',
          class: 'w10p'
        },
        // {
        //   name: '组合物料系统编号',
        //   class: 'w20p'
        // },
        {
          name: '组合物料编号',
          class: 'w15p'
        },
        {
          name: '组合物料名称',
          class: 'w15p'
        },
        {
          name: '组合物料分类',
          class: 'w12p'
        },
        {
          name: '是否可售',
          class: 'w12p'
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
          name: '序号',
          field: 'idIndex',
          // width:'80'
        },
        // {
        //   name: '组合物料系统编号',
        //   field: 'materialId',
        //   //class: 'w50p',
        //   width: '140',
        //   //minWidth: '20%'
        // },
        {
          name:'组合物料编号',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'组合物料名称',
          field:'materialName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'组合物料分类',
          field:'materialName',
          materialHandle:'materialHandle'
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'品牌',
          field:'brand',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        }
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
      ],
      ProductCategorytypelist:[]
    };
  },
  components: {singleTable},
  beforeCreate() {

  },
  created() {
  },
  mounted() {
  	this.getMaterialClass();
    this.getMaterialsFabricList();
    this.getSaleUnit();
    this.getProductSeason();
    this.getMaterialCode();
    this.getProductmaterialproperties();
    this.getMaterialUnit();
    this.getSaleSeasou();
    this.getSalePosition(); 
    this.getMaterialSupplyTypey();
    this.getSupplierNameList();
    this.getMaterialDeclarationCategory()
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: { 
  	//获取状态名称
  	typeHandle(status,list) {
  		console.log(status,list)
  		for(var i=0;i<list.length;i++){
      	let item=list[i];
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
  	//获取状态名称
  	materialTypeHandle(status) {
		  for(var i=0;i<this.MaterialClasstypelist.length;i++){
      	let item=this.MaterialClasstypelist[i];
      	if(item.index==status){
      		return item.name
      	}
      }
  	},
  	 // 过滤输入的数字
    InputNumber(property) {
    	console.log(property)
       this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
     },
      // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
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
  		fabrictypeSaleUnit().then(response => {
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
     //产品品类
    getProductCategory() {
      fabrictypeProductCategory().then(response => {
        if (response.code === "0") {
          this.ProductCategorytypelist = response.data;
        }
      });
    },
    //是否可供
    getMaterialSupplyTypey() {
      materialSupplyType().then(response => {
        if (response.code === "0") {
          this.materialSupplylist = response.data;
        }
      });
    },
    //报关品类
    getMaterialDeclarationCategory(){
      console.log('1212')
      fabrictypedictionaries('MaterialDeclarationCategory').then(response => {
				if(response.code === "0") {					
          console.log(response.data);
					this.materialDeclarationCategorylist = response.data;
				}
			});
    },
  	changeCode() {
  		console.log(this.ruleForm)
		},
		// 过滤输入的数字
    InputNumber (property) {
      this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
    },
    InputpageNumber(item){
    	  let val= item.pageNumber;
    	  console.log(val)
    	  item.pageNumber = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.pageNumber = item.pageNumber.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.pageNumber = item.pageNumber.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputlength(item){
    	  let val= item.length;
    	  console.log(val)
    	  item.length = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.length = item.length.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.length = item.length.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputwidth(item){
    	 let val= item.width;
    	  console.log(val)
    	  item.width = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.width = item.width.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.width = item.width.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputquantity(item){
    	 let val= item.quantity;
    	  console.log(val)
    	  item.quantity = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.quantity = item.quantity.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.quantity = item.quantity.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
      if (val === 0 || val === '0' || val === '') {
        return ''
      } else {
        let value = null
        value = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        return Number(value)
      }
    },
    resetForm() {
       this.isEdit = false;
       this.ruleForm= {
					combinedMaterialMessagesList:[]
			 };
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getMaterialsFabricList();
    },   
    querySearchAsync(queryString, cb) {
    	console.log(queryString)
    	purchasegetmaterialCode(queryString).then(response => {
        if (response.code === "0") {
          var restaurants = response.data;
//        var restaurants =this.list;
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
        };
    },
	  handleSelect(item) {
        console.log(item);
    },
    
    editHandle(index,item) {
      // 编辑项
      this.isEdit = true;
      this.ifchildshow = true;
      this.edittag='修改';
      this.updid=item.id;
      this.surecommittitle=''
      this.surecommit=false;
      fabrictypeview(item.id).then(response => {
			if(response.code === "0") {
				this.ruleForm=response.data;
				for(var i=0;i<this.ruleForm.combinedMaterialMessagesList.length;i++){
					let item=this.ruleForm.combinedMaterialMessagesList[i];
					item.positionlist=this.positionlist;
				}
				if(this.ruleForm.validDate!=null&&this.ruleForm.validDate!=''){
					this.ruleForm.validDate=timeFormat(response.data.validDate);
					this.ruleForm.validDate=this.ruleForm.validDate.substring(0, 10);
				}
				if(this.ruleForm.invalidDate!=null&&this.ruleForm.invalidDate!=''){
					this.ruleForm.invalidDate=timeFormat(response.data.invalidDate);
					this.ruleForm.invalidDate=this.ruleForm.invalidDate.substring(0, 10);
				}		
				console.log(this.ruleForm)
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
        materialClassification: this.materialClassification,
        materialCode:this.materialCode
      };
      materialsFabricList(this.currentPage, this.pageSize, data).then(res => {
	       console.log('面料物料主数据列表：', res);
	       if (res.code === '0') {
	       	  this.tableLoading = false;
	          this.fabricList = res.data.records;
            this.total = res.data.total;
            for(var i=0;i<this.fabricList.length;i++){
              let item=this.fabricList[i];
              if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
              }else{
              item.idIndex=i+1;
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
.mt{
	margin-top: 12px;
}
.w21p {
    width: 21% !important;
}
.w9p {
    width:9% !important;
}
.w2p {
    width:2% !important;
}
.ml {
	margin-left: 10px;
}
.red{
	color: #F56C6C;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.compositeMaterials {
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
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
    display: inline-block;
  }
  // button.el-button.el-button--primary.el-button--small.is-circle{
  // 	margin:5px 0;
  // 	float: right;
  // }
  .demo-ruleForm {
    width: 45%;
  }
}
.addcontent_content{
	margin: 10px 0;
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
</style>
<style>
.compositeMaterials label.el-checkbox{
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

.compositeMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.compositeMaterials .el-form-item__content {
  width: auto;
}
.compositeMaterials .el-input {
  width: auto;
}
.compositeMaterials .whole_long .el-form-item__content {
  width: 68%;
}
.compositeMaterials .whole_long .el-input {
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
/* button.el-button.el-button--danger.is-circle {
  padding: 3px;
  margin-top: 10px;
} */
.el-autocomplete-suggestion li{
	padding:0 0px;
	text-align: center;
}
</style>