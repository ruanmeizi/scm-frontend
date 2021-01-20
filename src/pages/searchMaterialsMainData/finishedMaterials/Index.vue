<template>
  <div class="container finishedMaterials formPart">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
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

        <!-- <el-input class="input_single w200 mr10 mb10" v-model="brand" placeholder="物料品牌"></el-input> -->
        <!-- <el-input class="input_single w200 mr10 mb10" v-model="supplierName" placeholder="供应商名称"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="materialCode" placeholder="物料编号"></el-input> -->
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
              v-for="(item, index) in materialsList"
              :key="index">
              <li class="w10p">{{item.id}}</li>
              <li class="w13p" :title="item.materialId">{{item.materialId ? item.materialId : ''}}</li>
              <li class="w13p" :title="item.materialCode">
              	<span class="underline" @click="editHandle(item)">
              	{{item.materialCode ? item.materialCode : ''}}
              	</span>
              </li>
              <li class="w13p" :title="item.materialName">{{item.materialName ? item.materialName : ''}}</li>
              <li class="w18p" :title="item.supplierName">{{item.supplierName ? item.supplierName : ''}}</li>
              <li class="w13p" :title="materialTypeHandle(item.materialStatus)">{{materialTypeHandle(item.materialStatus)?materialTypeHandle(item.materialStatus):''}}</li>
              <li class="w10p">
                <el-button type="text" @click="editHandle(item)">查看</el-button>
              </li>
            </ul>
          </div> -->
           <singleTable
          :tableList='materialsList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @checkHandle='editHandle'
          ></singleTable>
        </el-tabs>
        
        <!-- <p v-if="!this.materialsList.length&&!tableLoading" class="empty_tip">暂无数据</p> -->
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
      <div class="base_wrap clearfix">
        <h2 class="title">物料基本信息</h2>
        <el-form :model="ruleForm" ref="ruleForm" :inline="true" label-width="200px" class="demo-ruleForm">
          <el-form-item label="物料编号">
            <span class="w300">{{ruleForm.materialCode}}</span>
          </el-form-item>
          <el-form-item label="系统编号">
            <span class="w300">{{ruleForm.materialId}}</span>
          </el-form-item>
          <el-form-item label="物料名称">
            <span class="w300">{{ruleForm.materialName}}</span>
          </el-form-item>
          <el-form-item label="供应商编号">
            <span class="w300">{{typeHandleSupplier(ruleForm.supplierId,this.supplierNameList)}}</span>
          </el-form-item>
          <el-form-item label="生产商名称">
            <span class="w300">{{ruleForm.manufacturerName}}</span>
          </el-form-item>
           <el-form-item label="供应商名称">
            <span class="w300" >{{ruleForm.supplierName}}</span>
          </el-form-item>
           <el-form-item label="物料分类">
						<span class="w300">{{typeHandle(ruleForm.materialClassification,this.materialClassList)}}</span>
          </el-form-item>
          <el-form-item label="颜色">
						<span class="w300">{{typeHandle(ruleForm.color,this.colortypelist)}}</span>
          </el-form-item>
          <el-form-item label="产品特性">
            <span class="w300">{{typeHandle(ruleForm.productSeason,this.seasonList)}}</span>
          </el-form-item>
          <el-form-item label="长">
            <span class="w300">{{ruleForm.length}}&nbsp;&nbsp;米</span>
          </el-form-item>
           <el-form-item label= "采购计量单位">
             <span class="w300">{{typeHandle(ruleForm.measurementUnit,this.unitList)}}</span>
          </el-form-item>
           <el-form-item label="宽">
            <span class="w300">{{ruleForm.width}}&nbsp;&nbsp;米</span>
           </el-form-item>
           <el-form-item label="单位重量">
            <span>{{ruleForm.unitGram ? ruleForm.unitGram : ''}}</span>&nbsp;&nbsp;克
          </el-form-item>
           <el-form-item label="高">
            <span class="w300" >{{ruleForm.height}}&nbsp;&nbsp;米</span>
          </el-form-item>
           <el-form-item label="物料属性">
            <span class="w300">{{typeHandle(ruleForm.materialProperties,this.MaterialPropertiestypelist)}}</span>
          </el-form-item>
          <el-form-item label="上市时间">
             <span class="w300">{{ruleForm.listingDate}}</span>
          </el-form-item>
          <!-- <el-form-item label="是否可供">
             <span class="w300">{{typeHandle(ruleForm.whetherSupply,this.materialSupplyTypelist)}}</span>
          </el-form-item>         -->
          <el-form-item label="生命周期">
              <span class="w300">{{ruleForm.lifeCycle}}</span>
          </el-form-item> 
          <el-form-item label="报关品类">
              <span class="w300">{{typeHandle(ruleForm.declarationCategory,this.materialDeclarationCategorylist)}}</span>
          </el-form-item> 
          <el-form-item label="海关编号">
              <span class="w300">{{ruleForm.hsCode}}</span>
          </el-form-item> 
          <el-form-item label="杂费系数">
            <span class="w300">{{ruleForm.miscChargesCoefficient}}&nbsp;&nbsp;</span>
          </el-form-item>
          <el-form-item label="海关关税系数">
            <span class="w300">{{ruleForm.customsTariffCoefficient}}</span>
          </el-form-item>
           <el-form-item label="增值税系数">
            <span class="w300">{{ruleForm.valueAddedTaxCoefficient}}</span>
          </el-form-item>
           <el-form-item class="whole" label="备注">
            <span>{{ruleForm.remarks}}</span>             
          </el-form-item>
         
          
         
          <!-- <el-form-item label="产品季">
            <span class="w300">{{typeHandle(ruleForm.productSeason,this.seasonList)}}</span>
          </el-form-item>
          <el-form-item label="物料状态">
             <span class="w300">{{typeHandle(ruleForm.materialStatus,this.materialStatusList)}}</span>
          </el-form-item>
         
          <el-form-item label="是否快货">
            <el-checkbox label="" disabled name="type" v-model.trim="ruleForm.mobileGoods"></el-checkbox>
          </el-form-item>         
          <el-form-item label="海运运费系数">
           <span class="w300">{{ruleForm.oceanFreightCoefficient}}&nbsp;&nbsp;元/千克</span>
          </el-form-item>
          <el-form-item label="空运运费系数">
            <span class="w300">{{ruleForm.airFreightCoefficient}}&nbsp;&nbsp;元/千克</span>
          </el-form-item>
          <el-form-item label="代理费系数">
           <span class="w300">{{ruleForm.agentChargeCoefficient}}&nbsp;&nbsp;%</span>
          </el-form-item> -->
         
        </el-form>
        <div class="mt20 t_right">
          <el-button type="primary" class="mr10" @click="baseCancelHandle">取消</el-button>
        </div>
      </div>
      
    </div>
    
  </div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import {
  getUUID,
  productMaterialsList,
  deleteProductMaterials,
  searchProductMaterials,
  editProductMaterials,
  addProductMaterials,
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
import { timeFormat } from '@/utils/index.js';
export default {
  name: "finishedMaterials",
  props: [],
  data() {
    return {
      isEdit: false,
      loading: false,
      tableLoading: true,
      editType: '',
      curId: '',
      materialCode: '',
      supplierName: '',
      supplierId:'',
      brand: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      materialsList: [],
      unitList: [],
      seasonList: [],
      materialClassList: [],
      materialStatusList: [],
      supplierNameList: [],
      MaterialPropertiestypelist:[],
      colortypelist:[],
      deleteId: '',
      deleteDialogVisible: false,
      materialDeclarationCategorylist:[],
      materialSupplyTypelist:[],
      fieldList: [
        {
          name: '序号',
          class: 'w10p'
        },
        {
          name: '成品物料系统编号',
          class: 'w13p'
        },
        {
          name: '成品物料编号',
          class: 'w13p'
        },
        {
          name: '物料名称',
          class: 'w13p'
        },
        {
          name: '供应商名称',
          class: 'w18p'
        },
        {
          name: '物料状态',
          class: 'w13p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ],
      ruleForm: {
        materialCode: '',
        color: '',
        materialName: '',
        length: '',
        materialClassification: '',
        width: '',
        measurementUnit: '',
        height: '',
        supplierName: [],
        appearDate: '',
        manufacturerName: '',
        listingDate: '',
        lifeCycle:'',
        productSeason: '',
        materialStatus: '',
        remarks: '',
        mobileGoods:false,
        materialProperties:'',
        oceanFreightCoefficient:'',
	      airFreightCoefficient:'',
	      agentChargeCoefficient:'',
	      miscChargesCoefficient:'',
	      valueAddedTaxCoefficient:'',
	      customsTariffCoefficient:''
      },
      options: [],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex'
          // width:'80'
        },
        // {
        //   name: '成品物料系统编号',
        //   field: 'materialId',
        //   //class: 'w50p',
        //   width: '140',
        //   //minWidth: '20%'
        // },
        {
          name:'成品物料编号',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'成品物料名称',
          field:'materialName',
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
          name:'物料分类',
          field:'',
          materialClass:'materialClass'
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
  	this.getMaterialStatusList();
    this.getSupplierNameList();
    this.getSaleUnitList();
    this.getProductSeasonList();
    this.getMaterialClassList();
    this.getMaterialPropertiesStatusList();
    this.getProductcolor();
    this.getProductMaterialsList();
    this.getMaterialDeclarationCategory();
    this.getMaterialSupplyType()
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
  	materialTypeHandle(status) {
  		console.log(status)
  		for(var i=0;i<this.materialStatusList.length;i++){
      	let item=this.materialStatusList[i];
      	if(item.index==status){
      		return item.name
      	}
      }
  	},
  	InputNumber (property) {
       this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
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
  	//颜色
  	getProductcolor(){ 		
  		fabrictypeProductcolor().then(response => {
				if(response.code === "0") {					
					this.colortypelist = response.data;
				}
			});
  	},
    supplierNameRemote(query) {
      console.log('query: ', query);
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          supplierNameData('', query).then(res => {
            if (res.code === '0') {
              this.supplierNameList = res.data.filter(item => {
                return item.supplierName.toLowerCase().indexOf(query.toLowerCase()) > -1;
              });
            }
          });
        }, 500);
      } else {
        this.supplierNameList = [];
      }
    },
    supplierNameChange(val) {
      console.log('史蒂夫后市', val);
    },
    appearDateChange(val) {
      console.log(val);
    },
    listingDateChange(val) {
      console.log(val);
    },
    editHandle(index,item) {
      // 编辑项
      console.log('打开项：', item);
      this.isEdit = true;
      this.editType = 'edit';
      this.curId = item.id;
      this.uuid = item.uuid;
      searchProductMaterials(item.id).then(res => {
        console.log('搜索项数据：', res);
        if (res.code === '0') {
          this.ruleForm.materialCode = res.data.materialCode;
          this.ruleForm.color = res.data.color;
          this.ruleForm.materialName = res.data.materialName;
          this.ruleForm.length = res.data.length;
          this.ruleForm.materialClassification = res.data.materialClassification;
          this.ruleForm.width = res.data.width;
          this.ruleForm.measurementUnit = res.data.measurementUnit;
          this.ruleForm.height = res.data.height;
          this.ruleForm.supplierName = res.data.supplierName;
          this.ruleForm.appearDate = res.data.appearDate;
          this.ruleForm.manufacturerName = res.data.manufacturerName;
//        this.ruleForm.listingDate = res.data.listingDate;
          if(res.data.listingDate!=null&&res.data.listingDate!=''){
						this.ruleForm.listingDate=timeFormat(res.data.listingDate);
						this.ruleForm.listingDate=this.ruleForm.listingDate.substring(0, 10);
					}
					if(res.data.lifeCycle!=null&&res.data.lifeCycle!=''){
						this.ruleForm.lifeCycle=timeFormat(res.data.lifeCycle);
						this.ruleForm.lifeCycle=this.ruleForm.lifeCycle.substring(0, 10);
					}		
          this.ruleForm.productSeason = res.data.productSeason;
          this.ruleForm.materialStatus = res.data.materialStatus;
          this.ruleForm.remarks = res.data.remarks;
          this.ruleForm.mobileGoods= res.data.mobileGoods;
          this.ruleForm.materialProperties=res.data.materialProperties;
          this.ruleForm.customsTariffCoefficient=res.data.customsTariffCoefficient;
          this.ruleForm.hsCode=res.data.hsCode;
          this.ruleForm.materialId=res.data.materialId;
          this.ruleForm.supplierId=res.data.supplierId;
          this.ruleForm.whetherSupply=res.data.whetherSupply;
          this.ruleForm.declarationCategory=res.data.declarationCategory;
          this.ruleForm.miscChargesCoefficient=res.data.miscChargesCoefficient;
          this.ruleForm.valueAddedTaxCoefficient=res.data.valueAddedTaxCoefficient;
          this.ruleForm.unitGram=res.data.unitGram;
          // let selectData = this.supplierNameList.find(item => {
          //   return item.subInventory === res.data.supplierName;
          // });
          // this.ruleForm.supplierName = selectData.supplierName;
        }
      });
    },
    baseCancelHandle() {
      // 基本信息取消
      this.isEdit = false;
    },
    baseSaveHandle(formName) {
      // 基本信息保存
      console.log(this.editType);
      this.$refs[formName].validate((valid) => {
        if (valid) {
        	console.log(this.ruleForm)
          let data = {
            uuid: this.uuid,
            materialCode: this.ruleForm.materialCode,
            color: this.ruleForm.color,
            materialName: this.ruleForm.materialName,
            length: this.ruleForm.length,
            materialClassification: this.ruleForm.materialClassification,
            width: this.ruleForm.width,
            measurementUnit: this.ruleForm.measurementUnit,
            height: this.ruleForm.height,
            supplierName: this.ruleForm.supplierName,
            appearDate: this.ruleForm.appearDate,
            manufacturerName: this.ruleForm.manufacturerName,
            listingDate: this.ruleForm.listingDate,
            productSeason: this.ruleForm.productSeason,
            materialStatus: this.ruleForm.materialStatus,
            remarks: this.ruleForm.remarks,
            mobileGoods:this.ruleForm.mobileGoods,
            materialProperties:this.ruleForm.materialProperties
          };
          if (this.editType === 'add') {
            addProductMaterials(data).then(res => {
              console.log('新增：', res);
              if (res.code === '0') {
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.isEdit = false;
                this.getProductMaterialsList();
              }
            });
          } else if (this.editType === 'edit') {
            editProductMaterials(this.curId, data).then(res => {
              console.log('保存：', res);
              if (res.code === '0') {
                this.$message({
                  message: '保存成功！',
                  type: 'success'
                });
                this.isEdit = false;
                this.getProductMaterialsList();
              }
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

      // if (!this.materialCode || !this.materialName || !this.materialClassification) {
      //   this.$message({
			// 		message: '必填项不能为空！',
			// 		type: 'error'
			// 	});
      //   return false;
      // }
    },
    searchHandle() {
      // 搜索
      this.getProductMaterialsList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getProductMaterialsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getProductMaterialsList();
    },
    getProductMaterialsList() {
    	this.tableLoading = true;
      // 成品物料主数据列表
      let data = {
        // brand: this.brand,
        supplierId: this.supplierId,
        materialCode: this.materialCode
      };
      productMaterialsList(this.currentPage, this.pageSize, data).then(res => {
        console.log('成品物料主数据列表：', res);
        if (res.code === '0') {
        	this.tableLoading = false;
          this.materialsList = res.data.records;
          this.total = res.data.total;
          this.materialsList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }
            if(this.currentPage!=1){
            item.idIndex=(this.currentPage-1)*this.pageSize+(index+1)
            }else{
            item.idIndex=index+1;
            }
          });
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
  	getSaleUnitList() {
      // 采购计量单位
  		fabrictypeSaleUnit().then(res => {
				if(res.code === '0') {
					this.unitList = res.data;	
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
      //获取供应商列表
     getSupplierNameList() {
        supplierNameData('', '','').then(res => {
          console.log('供应商名称：', res);
          if (res.code === '0') {
            this.supplierNameList = res.data;
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
  	getMaterialStatusList() {
      // 物料状态
  		materialStatusList().then(res => {
				if(res.code === '0') {					
					this.materialStatusList = res.data;
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
    //报关品类
    getMaterialDeclarationCategory(){
      fabrictypedictionaries('MaterialDeclarationCategory').then(response => {
				if(response.code === "0") {					
					this.materialDeclarationCategorylist = response.data;
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
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.red{
	color: #F56C6C;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.finishedMaterials {
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
</style>
<style>
/* .subnav_wrap .el-tabs__item {
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
} */

.finishedMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.finishedMaterials .el-form-item__content {
  width: auto;
}
.finishedMaterials .el-input {
  width: auto;
}
.finishedMaterials .whole_long .el-input {
  width: 100%;
}
.finishedMaterials .whole_long .el-form-item__content {
  width: 65%!important;
}
.finishedMaterials .whole_long .el-input {
  width: 100%;
}
.finishedMaterials .el-form-item:last-child{
    width:97%!important;
}
.finishedMaterials .formPart .base_wrap form.el-form.demo-ruleForm.el-form--inline .el-form-item.whole .el-form-item__content{
	width: 66%!important;
}
.formPart .base_wrap form.el-form.demo-ruleForm.el-form--inline .el-form-item.whole .el-form-item__content{
		width: 66%!important;
}
</style>