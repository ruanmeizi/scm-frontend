<template>
  <div class="container finishedMaterials formPart">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
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
        <!-- <el-input class="input_single w200 mr10 mb10" v-model="brand" placeholder="物料品牌"></el-input> -->
        <!-- <el-input class="input_single w200 mr10 mb10" v-model="supplierName" placeholder="供应商名称"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="materialCode" placeholder="物料编号"></el-input> -->
        <div class="actions_btn_wrap down t_right">
          <el-button type="primary" class="mr10" @click="exportHandle" v-preventReClick :disabled="this.isLoadingExport">导出</el-button>
          <el-upload :headers="myHeaders" class="upload-demo inline_block mr10" :action="this.uploadurl"  accept=".xlsx" 
            :before-upload="beforeupload" :show-file-list="showfilelist" :on-success="UploadSuccess">
            <el-button type="primary" @click="importHandle" :disabled="this.isLoadingImport">导入</el-button>
          </el-upload>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            @click="addHandle"
          ></el-button>
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 566px;">
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in materialsList"
              :key="index">
              <li class="w10p">{{item.id}}</li>
              <li class="w10p" :title="item.insideCode">{{item.insideCode ? item.insideCode : ''}}</li>
              <li class="w10p" :title="item.materialCode">{{item.materialCode ? item.materialCode : ''}}</li>
              <li class="w10p" :title="item.materialName">{{item.materialName ? item.materialName : ''}}</li>
              <li class="w10p" :title="item.supplierName">{{item.supplierName ? item.supplierName : ''}}</li>
              <li class="w10p" :title="materialTypeHandle(item.materialStatus)">{{materialTypeHandle(item.materialStatus)?materialTypeHandle(item.materialStatus):''}}</li>
              <li class="w10p">
                <i type="primary" class="el-icon-edit" title="修改" @click="editHandle(item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(item)"></i>
                <i type="primary" class="el-icon-document" title="查看" @click="checkHandle(item)"></i>
              </li>
            </ul>
          </div> -->
          <singleTable
          :tableList='materialsList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteHandle'
          @editHandle='editHandle'
           @cloneHandle='cloneHandle'
          @checkHandle='checkHandle'
          ></singleTable>
        </el-tabs>
        
        <!-- <p v-if="!this.materialsList.length&&!tableLoading" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
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
      <div v-if="actionsType == 'check'">
        <finishedMaterialsCheck :list="ruleForm" :uploadFileList="uploadFileList" @cancelHandle="baseCancelHandle"></finishedMaterialsCheck>
      </div>
      <div v-else>
        <div class="base_wrap clearfix finished">
          <h2 class="title">物料基本信息</h2>
          <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="200px" class="demo-form-inline">
          <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="200px" class="demo-ruleForm"> -->
            <el-form-item label="物料编号" prop="materialCode">
              <el-input class="w200" :disabled="isEditor" @change="hasRepeatMeterialClick(ruleForm)" @keyup.native="onkeyupMaterialCode($event)" v-model="ruleForm.materialCode"></el-input>
              <!-- <span class="red ml10">*</span> -->
            </el-form-item>
             <el-form-item label="系统编号">
               <span>{{ruleForm.materialId}}</span>
              <!-- <el-input :disabled="true" class="w200" v-model="ruleForm.materialId"></el-input> -->
            </el-form-item>
            <el-form-item label="物料名称">
              <el-input class="w200" v-model="ruleForm.materialName"></el-input>
              <!-- <span class="red ml10">*</span> -->
            </el-form-item>
            <el-form-item label="供应商编号"  prop="supplierId">
              <!-- <el-input class="w300" v-model="supplierName"></el-input> -->
              <!-- <el-select
                class="w200"
                v-model.trim="ruleForm.supplierId"
                ref="select"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="supplierNameRemote"
                @change="selectSupplierclick(ruleForm)"
                @click.native="selectSupplierCondition(ruleForm)"
                :loading="loading">
                <el-option
                  v-for="item in supplierNameList"
                  :key="item.supplierId"
                  :label="item.supplierCode"
                  :value="item.supplierId">
                </el-option>
              </el-select> -->

               <el-select class="select_single w200 mr10"
                v-model="ruleForm.supplierId"
                @change="selectSupplierclick(ruleForm)"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="item in supplierNameList"
                  :key="item.supplierId"
                  :label="item.supplierCode"
                  :value="item.supplierId">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="生产商名称" prop="manufacturerName">
              <el-input class="w200" v-model="ruleForm.manufacturerName"></el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
              <div :title="ruleForm.supplierName" class="ellipsis w200">{{ruleForm.supplierName?ruleForm.supplierName:''}}</div>
              <!-- <span :title="ruleForm.supplierName" class="ellipsis w200 inline_block">{{ruleForm.supplierName?ruleForm.supplierName:''}}</span> -->
            </el-form-item>
            <el-form-item label="物料分类" prop="materialClassification">
              <el-select class="w200" v-model.trim="ruleForm.materialClassification" @change="onChangeGramWeight(ruleForm.materialClassification,ruleForm)" placeholder="请选择">
                <el-option v-for="item in materialClassList" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颜色" prop="color">
               <el-select class="w200" v-model.trim="ruleForm.color" placeholder="请选择">
                <el-option v-for="item in colortypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品特性" prop="productSeason">
              <el-select class="w200" v-model.trim="ruleForm.productSeason" placeholder="请选择">
                <el-option v-for="item in seasonList" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="长">
              <el-input class="w200" maxlength="6" @keyup.native="InputNumber('length')" @change="InputNumber('length')" v-model="ruleForm.length"></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="采购计量单位" prop="measurementUnit">
              <el-select class="w200" v-model.trim="ruleForm.measurementUnit"  placeholder="请选择">
                <el-option v-for="item in unitList" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="宽">
              <el-input class="w200" v-model="ruleForm.width" maxlength="6" @keyup.native="InputNumber('width')" @change="InputNumber('width')" ></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="单位重量">
              <el-input class="w200"  :disabled="true" v-model="ruleForm.unitGram" maxlength="6" @keyup.native="InputNumber('unitGram')" @change="InputNumber('unitGram')" ></el-input>&nbsp;&nbsp;克
            </el-form-item>
            <el-form-item label="高">
              <el-input class="w200" v-model="ruleForm.height" maxlength="6" @keyup.native="InputNumber('height')" @change="InputNumber('height')" ></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="物料属性">
              <el-select class="w200" v-model.trim="ruleForm.materialProperties" placeholder="请选择">
                <el-option key="" label="请选择" value=""></el-option>
                <el-option v-for="item in MaterialPropertiestypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上市时间">
              <el-date-picker
               class="w200"
                v-model.trim="ruleForm.listingDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsStart"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item> 
            <!-- <el-form-item label="是否可供">
              <el-select class="w200" v-model.trim="ruleForm.whetherSupply" placeholder="请选择">
                <el-option v-for="item in materialSupplyTypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="生命周期">
                 <el-date-picker
                  class="w200"
                    v-model.trim="ruleForm.lifeCycle"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="报关品类" prop="declarationCategory">
              <el-select class="w200" v-model.trim="ruleForm.declarationCategory" @change="selectdeclarationCategory(ruleForm)" placeholder="请选择">
                <el-option v-for="item in materialDeclarationCategorylist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="海关编号">
              <span>{{ruleForm.hsCode}}</span>
            </el-form-item>
             <el-form-item label="杂费系数" prop="miscChargesCoefficient">
              <el-input class="w200" v-model.trim="ruleForm.miscChargesCoefficient" maxlength="10" @keyup.native="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)" @change="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)"></el-input>
              &nbsp;&nbsp;
              <!-- <span class="red" style="display:block;">注:采购货物价值的百分比</span> -->
            </el-form-item>
            <el-form-item label="海关关税系数">
                <span>{{ruleForm.customsTariffCoefficient}}</span>
            </el-form-item>
             <el-form-item label="增值税系数" prop="valueAddedTaxCoefficient">
              <el-input class="w200" v-model.trim="ruleForm.valueAddedTaxCoefficient" maxlength="10" @keyup.native="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)" @change="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks" class="last">
              <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 4}"
                placeholder="多行输入"
                v-model="ruleForm.remarks"
                maxlength="1000"
                show-word-limit>
              </el-input>
            </el-form-item>
            <!-- <el-form-item class="whole" label="备注" prop="remarks">
              <el-input :title="ruleForm.remarks" v-model="ruleForm.remarks"></el-input>
            </el-form-item> -->
          </el-form>
          <div class="mt20 t_right">
            <el-button class="mr10" @click="baseCancelHandle">取消</el-button>
            <el-button type="primary"  @click="baseSaveHandle('ruleForm')" :loading="this.loadingcommit" v-preventReClick>保存</el-button>
          </div>
        </div>
      </div>
      
    </div>

    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="deleteDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteHandle" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import {postpermission,exportFileFinishedMaterials} from "@/api/accessPermission.js";
import {
  getUUID,
  productMaterialsList,
  deleteProductMaterials,
  searchProductMaterials,
  editProductMaterials,
  addProductMaterials,
  supplierNameData,
  fabricGramWeight
} from "@/api/module/materialfinishedApi.js";
import {getCheckMaterialCode,getHsCode} from "@/api/module/materialsApi.js";
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
import finishedMaterialsCheck from '../finishedMaterialsCheck/Index.vue';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "finishedMaterials",
  props: [],
  data() {
    return {
      myHeaders: {
                Authorization:'bearer '+this.$keycloak.token
      },
      uploadurl:'',
      showfilelist:false,
      actionsType: '',
      isEdit: false,
      loading: false,
      tableLoading: true,
      loadingcommit:false,
      removeloading:false,
      isEditor:false,
      errorMaterial:true,
      isLoadingExport:false,
      isLoadingImport:false,
      editType: '',
      supplierId:'',
      curId: '',
      materialCode: '',
      supplierName: '',
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
      materialSupplyTypelist:[],
      materialDeclarationCategorylist:[],
      fabrictypeviewList:{},
      deleteId: '',
      deleteDialogVisible: false,
      fieldList: [
        {
          name: '序号',
          class: 'w10p'
        },
        {
          name: '成品物料系统编号',
          class: 'w10p'
        },
        {
          name: '物料编号',
          class: 'w10p'
        },
        {
          name: '物料名称',
          class: 'w10p'
        },
        {
          name: '供应商编号',
          class: 'w10p'
        },
        {
          name: '物料分类',
          class: 'w10p'
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
        materialId:'',
        height: '',
        supplierName:'',
        supplierId:'',
        appearDate: '',
        manufacturerName: '',
        listingDate: '',
        lifeCycle:'',
        productSeason:'C',
        materialStatus: '',
        remarks: '',
        materialProperties:'',
        oceanFreightCoefficient:'',
	      airFreightCoefficient:'',
	      agentChargeCoefficient:'',
        miscChargesCoefficient: "0.0012",
        valueAddedTaxCoefficient: "0.13",
        whetherSupply:'',
        declarationCategory:'1',
        customsTariffCoefficient: "0.086",
        hsCode: "51121100",
        unitGram: ''
      },
      rules: {
        materialCode: [
          { required: true, message: '请填写物料编号', trigger: 'blur' },
          { min: 1, max: 20, message: '超长字符', trigger: 'blur' }
        ],
        supplierId:[
          { required: true, message: '请选择供应商编号', trigger: 'change' }
        ],
        materialName: [
          { required: true, message: '请填写物料名称', trigger: 'blur' },
          { min: 1, max: 128, message: '超长字符', trigger: 'blur' }
        ],
        materialClassification: [
          { required: true, message: '请选择物料分类', trigger: 'change' }
        ],
        productSeason:[
          { required: true, message: '请选择产品特性', trigger: 'change' }
        ],
        measurementUnit:[
          { required: true, message: '请选择采购计量单位', trigger: 'change' }
        ],
        declarationCategory:[
          { required: true, message: '请选择报关品类', trigger: 'change' }
        ],
        listingDate: [
          { type: 'string',required: true, message: '请输入上市时间', trigger: 'change' }
        ],
        lifeCycle: [
          { type: 'string',required: true, message: '请输入生命周期', trigger: 'change' }
        ],
        miscChargesCoefficient: [
          { required: true, message: '请输入杂费系数', trigger: 'blur' }
        ],
        valueAddedTaxCoefficient: [
          { required: true, message: '请输入增值税系数', trigger: 'blur' }
        ],
        manufacturerName: [
          { min: 1, max: 128, message: '超长字符', trigger: 'blur' }
        ],
        length: [
          { min: 1, max: 24, message: '超长字符', trigger: 'blur' }
        ],
        width: [
          { min: 1, max: 64, message: '超长字符', trigger: 'blur' }
        ],
        height: [
          { min: 1, max: 24, message: '超长字符', trigger: 'blur' }
        ],
        remarks: [
          { min: 1, max:50240, message: '超长字符', trigger: 'blur' }
        ]
      },

      options: [],
      leaderFieldsList: [
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '180',
          minWidth: '10%',
          isAction: true,
          hasEdit: true,
          hasDelete: true,
          hasCopy:true,
          hasCheck:true,
        }
      ],
      fieldsList:[
        {
          name:'序号',
          field:'idIndex'
        },
        {
          name:'物料编号',
          field:'materialCode'
        },
        {
          name:'物料名称',
          field:'materialName'
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
        }
      ],
      pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.ruleForm.lifeCycle;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
      },
      pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.ruleForm.listingDate;
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              );
            }
          }
      },

    };
  },
  components: {
    finishedMaterialsCheck,
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getSupplierNameList();
    this.getSaleUnitList();
    this.getProductSeasonList();
    this.getMaterialClassList();
    this.getMaterialStatusList();
    this.getMaterialPropertiesStatusList();
    this.getProductcolor();
    this.getMaterialSupplyType();
    this.getMaterialSupplyType();
    this.getMaterialDeclarationCategory();
    this.getProductMaterialsList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: {
     //导入
    importHandle(){
      this.uploadurl=process.env.VUE_APP_SCMREPORT_URL + 'reportservice/v1/importExcelMaterialFinishedProduct';
      console.log(this.uploadurl)
    },
    //导出
    exportHandle(){
         this.tableLoading = true;
         this.isLoadingExport=true;
           let obj={
            materialCode:this.materialCode,
            supplierId:this.supplierId
          }
           exportFileFinishedMaterials(JSON.stringify(obj)).then(res => {
              console.log(res);
              this.tableLoading = false;
              this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '成品物料主数据'+'.xlsx'; //下载后文件名
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
           });
      
    },
     beforeupload(file) {
//				 console.log(file)
         this.tableLoading = true;
         this.isLoadingImport=true;
				 var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
				 const isLt2M = file.size / 1024 / 1024 < 5     //这里做文件大小限制
					if(!isLt2M) {
						this.$message({
							message: '上传文件大小不能超过5MB!',
							type: 'error'
            });
            this.tableLoading = false;
            this.isLoadingImport=false;
					}
					return isLt2M
			},
    //订单导入成功之后
		UploadSuccess(response, file) {
				if(response.code == 0) {
          this.tableLoading = false;
          this.isLoadingImport=false;
					this.$message({
						message: '导入成功',
						type: 'success'
          });
          this.getProductMaterialsList();
				}else{
					this.$message({
						message:response.message,
						type: 'error'
          });
          this.tableLoading = false;
          this.isLoadingImport=false;
				}
			},
     //检验是否存在有重复的物料编码
     onkeyupMaterialCode(event){
      console.log(event)
      if(event.keyCode != 13){//除回车键外
            //标记当前事件函数的时间戳
            this.lastTimeStamp = event.timeStamp;
            setTimeout(() => {
                //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                if(this.lastTimeStamp == event.timeStamp){
                    var str=encodeURIComponent(this.ruleForm.materialCode);
                     getCheckMaterialCode(str).then(res => {
                      if (res.code === '0') {
                        console.log(res.data);
                        if(res.data!=null){
                          this.errorMaterial=false;
                        }else{
                            this.errorMaterial=true;
                        }
                      }
                    });
                }
            },800);
      }
    },
     //物料编号重复校验
    hasRepeatMeterialClick(item){
      var str=encodeURIComponent(this.ruleForm.materialCode);
      getCheckMaterialCode(str).then(res => {
        if (res.code === '0') {
          if(res.data!=null){        
              this.errorMaterial=false;
             item.materialCode='';
             this.$message({
                message: '该物料编号在成品物料数据中已存在',
                type: 'error'
             }); 
          }else{
            this.errorMaterial=true;
          }
        }else{
          item.materialCode='';
        }
      });
    },
  	//物料分类
  	onChangeGramWeight(e,item){
      //获取默认克重
      console.log(e)
  		fabricGramWeight(e).then(response => {
				if(response.code === "0") {		
					if(response.data!=null){
            console.log('aaa')
            item.unitGram=response.data;
            this.$forceUpdate();
					}else{
						item.unitGram='';
					}
				}
			});
  	},
  	//获取物料状态名称
  	materialTypeHandle(status) {
  		for(var i=0;i<this.materialStatusList.length;i++){
      	let item=this.materialStatusList[i];
      	if(item.index==status){
      		return item.name
      	}
      }
    },
   
    //报关品类带出海关系数和编号
    selectdeclarationCategory(item){
      console.log(item)
      let obj={
        index:item.declarationCategory
      }
      getHsCode(item.declarationCategory).then(res => {
        if (res.code === '0') {
          item.hsCode=res.data.hsCode;
          item.customsTariffCoefficient=res.data.customsTariffCoefficient;
        }
      });
    },
  	oninput(num) {
  		console.log(num)
			var str = num
			var len1 = str.substr(0, 1)
			var len2 = str.substr(1, 1)
			var lenLast=str.substr(str.length-1)
			//如果第一位是0，第二位不是点，就用数字把点替换掉
			if (str.length > 1 && len1 == 0 && len2 != ".") {
				str = str.substr(1, 1)
			}
			//第一位不能是.
			if (len1 == ".") {
				str = ""
			}
			//最后一位不能是.
			if (str.length==8&&lenLast == ".") {
				str = ""
			}
			//限制只能输入一个小数点
			if (str.indexOf(".") != -1) {
				var str_ = str.substr(str.indexOf(".") + 1)
				if (str_.indexOf(".") != -1) {
					str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1)
				}
			}
			//正则替换
			str = str.replace(/[^\d^\.]+/g, '') // 保留数字和小数点
			str = str.replace(/\.\d\d\d\d\d\d$/,'') // 小数点后只能输两位
			return str
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
      console.log(this.ruleForm.supplierName)
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          supplierNameData('','',query).then(res => {
            if (res.code === '0') {
              this.supplierNameList = res.data.filter(item => {
                return item.supplierCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
              });
            }
          });
        }, 500);
      } else {
        this.supplierNameList = [];
      }
     
    },
    selectSupplierCondition(val){
      if(val.supplierName==''){
        this.getSupplierNameList();
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
    addHandle() {
      // 添加
      this.isEdit = true;
      this.actionsType = 'add';
      this.editType = 'add';
      // this.isEditor=false;
      getUUID().then(res => {
				if(res.code === "0") {
          this.uuid = res.data;
          this.ruleForm={
            miscChargesCoefficient:'0.0012',
            valueAddedTaxCoefficient:'0.13',
            productSeason:'C',
            declarationCategory:'1',
            customsTariffCoefficient: "0.086",
            hsCode: "51121100",
          }
				}
			});
    },
    editHandle(index,item) {
      // 编辑项
      console.log('打开项：', item);
      this.actionsType = "edit";
      this.isEdit = true;
      this.editType = 'edit';
      // this.isEditor=true;
      this.curId = item.id;
      this.uuid = item.uuid;
      this.getProductMaterials(item,"edit");
    },
    getProductMaterials(item,tag) {
      searchProductMaterials(item.id).then(res => {
        console.log('搜索项数据：', res);
        if (res.code === '0') {
          console.log(this.ruleForm)
          this.ruleForm=res.data;
          this.ruleForm.listingDate = res.data.listingDate ? timeFormat(res.data.listingDate).split(' ')[0] : '';
          this.ruleForm.lifeCycle= res.data.lifeCycle ? timeFormat(res.data.lifeCycle).split(' ')[0] : '';
          if(tag=='clone'){
               getUUID().then(res => {
                  if(res.code === "0") {
                    this.uuid = res.data;
                    this.ruleForm.uuid = res.data;
                  }
                });
          }
        }
      });
    },
    cloneHandle(item) {
       console.log('打开项：', item);
      this.isEdit = true;
      this.actionsType = 'add';
      this.editType = 'add';
      // this.isEditor=true;
      // this.curId = item.id;
      // this.uuid = item.uuid;
      this.getProductMaterials(item,"clone");
    },
    baseCancelHandle() {
      // 基本信息取消
      this.isEdit = false;
    },
    //供应商下拉选项触发
    selectSupplierclick(item){
      // console.log(this.ruleForm.supplierName)
      console.log(item)
      for(var i=0;i<this.supplierNameList.length;i++){
        let data=this.supplierNameList[i];
        if(item.supplierId==data.supplierId){
          item.supplierName=data.supplierName;
        }
      }
    },
    baseSaveHandle(formName) {
      // 基本信息保存
      console.log(this.editType);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loadingcommit=true;
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
            supplierId:this.ruleForm.supplierId,
            appearDate: this.ruleForm.appearDate,
            manufacturerName: this.ruleForm.manufacturerName,
            listingDate: this.ruleForm.listingDate,
            productSeason: this.ruleForm.productSeason,
            materialStatus: this.ruleForm.materialStatus,
            remarks: this.ruleForm.remarks,
            materialProperties: this.ruleForm.materialProperties,
            unitGram: this.ruleForm.unitGram,
            oceanFreightCoefficient:this.ruleForm.oceanFreightCoefficient,
            airFreightCoefficient:this.ruleForm.airFreightCoefficient,
            agentChargeCoefficient:this.ruleForm.agentChargeCoefficient,
            miscChargesCoefficient:this.ruleForm.miscChargesCoefficient,
            valueAddedTaxCoefficient:this.ruleForm.valueAddedTaxCoefficient,
            customsTariffCoefficient:this.ruleForm.customsTariffCoefficient,
            declarationCategory:this.ruleForm.declarationCategory,
            hsCode:this.ruleForm.hsCode,
            whetherSupply:this.ruleForm.whetherSupply,
            lifeCycle:this.ruleForm.lifeCycle
          };
           if(this.errorMaterial!=false){
              if (this.editType === 'add') {
                addProductMaterials(data).then(res => {
                  console.log('新增：', res);
                  if (res.code === '0') {
                    this.$message({
                      message: '保存成功！',
                      type: 'success'
                    });
                    this.loadingcommit=false;
                    this.isEdit = false;
                    this.getProductMaterialsList();
                  }else{
                    this.loadingcommit=false;
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
                    this.loadingcommit=false;
                    this.isEdit = false;
                    this.getProductMaterialsList();
                  }else{
                    this.loadingcommit=false;
                  }
                });
              }
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
    deleteHandle(index,item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    checkHandle(index,item) {
      // 查看详情
      console.log('查看详情模板：', item);
      this.actionsType = 'check';
      this.edittag = 'updated';
      this.isEdit = true;
      this.getProductMaterials(item,"check");
    },
    confirmDeleteHandle() {
      this.removeloading=true;
      deleteProductMaterials(this.deleteId).then(res => {
        console.log('删除项：', res);
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.removeloading=false;
          this.getProductMaterialsList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
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
      // 成品物料主数据列表
      this.tableLoading = true;
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
      //获取是否可供
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
  	getSaleUnitList() {
      // 采购计量单位
      fabrictypedictionaries('MaterialFinishedProductUnit').then(response => {
				if(response.code === "0") {					
					this.unitList = response.data;
				}
			});
  	},
  	getProductSeasonList() {
      // 产品特性
  		fabrictypeProductSeason().then(res => {
				if(res.code === '0') {					
					this.seasonList = res.data;
				}
			});
  	},
  	getMaterialClassList() {
      // 物料分类
        fabrictypedictionaries('MaterialFinishedClass').then(response => {
          if (response.code === "0") {
            this.materialClassList = response.data;
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
    getSupplierNameList() {
      supplierNameData('', '','').then(res => {
        console.log('供应商名称：', res);
        if (res.code === '0') {
          this.supplierNameList = res.data;
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
.ellipsis{
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
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
/* .finishedMaterials .whole_long .el-input {
  width: 100%;
}
.finishedMaterials .whole_long .el-form-item__content {
  width: 65%!important;
} */
/* .finishedMaterials .whole_long .el-input {
  width: 100%;
} */
/* .finishedMaterials .el-form-item:last-child{
    width:97%!important;
}
.finishedMaterials .formPart .base_wrap form.el-form.demo-ruleForm.el-form--inline .el-form-item.whole .el-form-item__content{
	width: 66%!important;
} */
.finishedMaterials .el-form-item.last {
    width: 94%!important;
}
.finishedMaterials .el-form-item.last .el-form-item__content{
	width:66%;
}
</style>