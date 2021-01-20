<template>
  <div class="container futuresPriceList formPart">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <!-- <div class="display_ib mr10 mb10">
            <span class="tag">业务类型：</span>
            <el-select class="select_single w200 mr10"
             @change="getPurchasePriceList"
              v-model="businessType"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in businessTypeList"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
          </div> -->
          <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <el-select class="select_single w200 mr10"
             @change="getPurchasePriceList"
              v-model="supplierCode"
              filterable
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- <el-select class="select_single w200 mr10"
          v-model="businessType"
          placeholder="请选择业务类型">
          <el-option key="" label="全部业务类型" value=""></el-option>
          <el-option
            v-for="item in businessTypeList"
            :key="item.index"
            :label="item.name"
            :value="item.index">
          </el-option>
        </el-select>
        <el-select class="select_single w200 mr10"
          v-model="supplierCode"
          filterable
          placeholder="请选择供应商">
          <el-option key="" label="全部供应商" value=""></el-option>
          <el-option
            v-for="item in supplierList"
            :key="item.supplierId"
            :label="item.supplierCode"
            :value="item.supplierId">
          </el-option>
        </el-select> -->

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
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value">
            <!-- <ul class="childlist" v-if="auditStatus == 'Draft' || auditStatus == 'Rejected' || auditStatus == 'Terminated' || auditStatus == 'Approved' || auditStatus == ''">
              <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
            </ul>
            <ul class="childlist" v-else>
              <li :class="item.class" v-for="(item, index) in operateFieldList" :key="index">{{item.name}}</li>
            </ul>
            <div class="allparentlist">
              <ul
                class="childcontentlist"
                v-for="(item, index) in priceList"
                :key="index">
                <li class="w5p">{{index+1}}</li>
                <li class="w15p" :title="item.priceListId">{{item.priceListId}}</li>
                <li class="w20p" :title="item.priceListName">{{item.priceListName}}</li>
                <li class="w10p" :title="item.businessTypeName">{{item.businessTypeName}}</li>
                <li class="w10p" :title="item.orderTypeName">{{item.orderTypeName}}</li>
                <li class="w10p" :title="item.supplierName">{{item.supplierName}}</li>
                <li class="w10p" :title="item.factorySeason">{{item.factorySeason}}</li>
                <li class="w5p" :title="item.currency">{{item.currency}}</li>
                <li class="w5p" :title="item.auditStatusName">{{item.auditStatusName}}</li>
                <li class="w10p" v-if="item.auditStatus == 'Draft' || item.auditStatus == 'Rejected'">
                  <i type="primary" class="el-icon-edit" title="编辑" @click.stop="editHandle(item)"></i>
                  <i type="primary" class="el-icon-thumb" title="提交审批" @click.stop="submitHandle(item)"></i>
                  <i type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandle(item)"></i>
                </li>
                <li class="w10p" v-if="item.auditStatus == 'Approving'">
                  <i type="primary" class="el-icon-document" title="查看" @click.stop="checkHandle(item)"></i>
                </li>
                <li class="w10p" v-if="item.auditStatus == 'Approved'">
                  <i type="primary" class="el-icon-edit" title="编辑" @click.stop="editHandle(item)"></i>
                  <i type="primary" class="el-icon-thumb" title="提交审批" @click.stop="submitHandle(item)"></i>
                </li>
                <li class="w10p" v-if="item.auditStatus == 'Terminated'">
                  <i type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandle(item)"></i>
                </li>
              </ul>
            </div> -->
            <singleTable
            :tableList='priceList' 
            :tableLeaderFieldsList='leaderFieldsList'
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="fieldsList"
            :ifCheckbox="ifCheckbox"
            @checkBoxHandle='checkBoxHandle'
            @deleteHandle='deleteHandle'
            @editHandle='editHandle'
            @checkHandle='checkHandle'
            @submitHandle='submitHandle'
          ></singleTable>
          </el-tab-pane>
        </el-tabs>
        
        <!-- <p v-if="!this.priceList.length&&!tableLoading" style="text-align: center; margin: 20px 0;">~~暂无数据~~</p> -->
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
      <div class="base_wrap clearfix mt50">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" label-width="150px" class="demo-ruleForm">
          <!-- <el-form-item label="业务类型" prop="businessType">
            <el-select class="w230" v-model.trim="ruleForm.businessType" placeholder="请选择" :disabled="ruleForm.auditStatus == 'Rejected' || ruleForm.auditStatus == 'Approved' || editType == 'check'" @change="businessTypeChange">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option v-for="item in businessTypeList" :key="item.index" :value="item.index" :label="item.name"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="供应商" prop="supplierCode">
            <el-select class="w230" v-model.trim="ruleForm.supplierCode" filterable placeholder="请选择" :disabled="ruleForm.auditStatus == 'Rejected' ||ruleForm.auditStatus == 'Draft'|| ruleForm.auditStatus == 'Approved' || editType == 'check'" @change="supplierNameChange">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option v-for="item in supplierList" :key="item.supplierId" :value="item.supplierId" :label="item.supplierCode"></el-option>
            </el-select>
            <el-button
              class="ml10"
              size="small"
              type="primary"
              icon="el-icon-refresh-right"
              circle
              title="拉取数据"
              :disabled="ruleForm.auditStatus == 'Rejected'||ruleForm.auditStatus == 'Draft' || ruleForm.auditStatus == 'Approved' || editType == 'check'"
              @click="pullSupplierNameHandle(ruleForm.supplierCode)"
            ></el-button>
          </el-form-item>
          <el-form-item label="工厂季" prop="factorySeason">
            <el-select class="w230" v-model.trim="ruleForm.factorySeason" placeholder="请选择" :disabled="ruleForm.auditStatus == 'Rejected' || ruleForm.auditStatus == 'Approved' || editType == 'check'" @change="factorySeasonChange">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option v-for="item in saleSeasonList" :key="item.index" :value="item.name" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="币种" prop="currency">
            <el-select class="w230" v-model.trim="ruleForm.currency" placeholder="请选择" :disabled="ruleForm.auditStatus == 'Rejected' || ruleForm.auditStatus == 'Approved' || editType == 'check'" @change="currencyChange">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option v-for="item in currencyList" :key="item.name" :value="item.index" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订货类型" prop="orderTypeName">
            <el-select class="w230" v-model.trim="ruleForm.orderTypeName" placeholder="请选择" :disabled="ruleForm.auditStatus == 'Rejected' || ruleForm.auditStatus == 'Approved' || editType == 'check'" @change="orderTypeChange">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option v-for="item in priceTypeList" :key="item.index" :value="item.name" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
          </el-form-item> -->
          <el-form-item label="冻结">
            <el-checkbox label="" name="type" :disabled="editType == 'check'" v-model.trim="ruleForm.freezeStatus"></el-checkbox>
          </el-form-item>
          <!-- <el-form-item label="价单编码">
            <el-input class="w230" v-model="ruleForm.priceListId"></el-input>
          </el-form-item> -->
          <el-form-item label="价单名称">
            <el-input class="w230" :title="ruleForm.priceListName" :disabled="ruleForm.auditStatus == 'Rejected' || ruleForm.auditStatus == 'Approved' || editType == 'check'" maxlength="200" v-model.trim="ruleForm.priceListName"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div class="series_wrap mt50 clearfix">
        <div class="fr clearfix mb10">
          <!-- <div class="display_ib mr10"> -->
          <el-input class="input_single w200 mr10 mb10" v-model="materialSeries" placeholder="物料系列/特殊物料"></el-input>
          <el-button type="primary" :disabled="editType == 'check'" @click="searchSeriesHandle">搜索</el-button>
          <!-- </div> -->
          <el-button
            class="display_ib ml20 mr10"
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            :disabled="editType == 'check'"
            @click="addSeriesHandle"
          ></el-button>
          <span class="display_ib" style="font-size: 14px; color: #303133;">添加系列</span>
        </div>
        <div class="edit_wrap">
          <!-- 编辑组件 -->
          <editDoubleTable
            :tableList="editList"
            :tableLeaderFieldsList="editLeaderFieldsList"
            :tableTailFieldsList="editTailFieldsList"
            :tableFieldsList="editFieldsList"
            @addHandle="addSeriesItemHandle"
            @deleteChlidHandle="deleteSeriesItemHandle">
          </editDoubleTable>

        </div>
        
      </div>

      <div class="mt20 t_right">
        <el-button class="mr10" @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="saveHandle('ruleForm')"  v-preventReClick :disabled="isSaveDisabled || editType == 'check'">保存</el-button>
        <el-button type="primary" :disabled="isSubmitDisabled || editType == 'check'" v-if="ruleForm.auditStatus != 'Approved'" v-preventReClick @click="submitEditHandle('ruleForm')">提交审批</el-button>
      </div>

       <div class="pagination_wrap fr mt20 mb10">
          <el-pagination
            @size-change="handleSizeChangeUpd"
            @current-change="handleCurrentChangeUpd"
            :current-page.sync="currentPageUpd"
            :page-sizes="[10, 50]"
            :page-size="pageSizeUpd"
            layout="sizes, total, prev, pager, next"
            :total="this.totalUpd"
          ></el-pagination>
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

    <!-- 提交审批弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="submitDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定提交审批？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmitHandle" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>

     <!-- 编辑分页提醒 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="submitPageDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>跳转下页之前请记得提交该页数据 !</span>
      <div class="fr">
        <el-checkbox v-model="checked">忽略此提示</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPageDialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import {postpermission,exportFile} from "@/api/accessPermission.js"
import {
  purchasePriceList,
  createPurchasePrice,
  supplierToMaterialSeries,
  editPurchasePrice,
  searchPurchasePriceList,
  editPurchasePriceView,
  deletePurchasePrice,
  supplierDictList,
  constDictList,
  getUUID,
  submitPurchasePrice
} from "@/api/module/purchasePriceListApi.js";
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
export default {
  name: "futuresPriceList",
  props: [],
  data() {
    return {
      myHeaders: {
        Authorization:'bearer '+this.$keycloak.token
      },
      uploadurl:'',
      showfilelist:false,
      isEdit: false,
      tableLoading: true,
      isLoadingExport:false,
      isLoadingImport:false,
      editType: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      totalUpd:0,
      pageSizeUpd: 10, //每页显示条数
      currentPageUpd: 1, //页数
      updIndex:'',
      idItems:[],
      updItem:{},
      checked:false,
      editType: '',
      removedIds:[],
      updItem:{},
      supplierList: [],
      businessTypeList: [],
      saleSeasonList: [],
      currencyList: [],
      priceTypeList: [],
      auditStatus: '',
      businessType: '',
      priceListId: '',
      currencyName:'',
      purchasePriceListType: 'FuturesPurchasing', //现货
      supplierCode: '',
      materialCode: '',
      materialSeries: '',
      priceList: [],
      editList: [],
      editListClone: [],
      reductionData:[],
      activeName: '',
      deleteId: '',
      ifCheckbox:true,
      submitPageDialogVisible:false,
      deleteDialogVisible: false,
      submitDialogVisible: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      editChildData: {
        endMeter: '',
        price: '',
        startMeter: '',
        purchaseMeasurementUnit: '米',
        uuid: ''
      },
      editData: {
        isAdd: true,
        deleteStatus: '',
        itemLadderPriceList: [],
        materialCode: '',
        materialCodeEnd:'',
        materialSeries: '',
        priceListId: '',
        priceListName: ''
      },
      subNavList: [
        {
          label: '全部采购价单',
          value: ''
        },
        {
          label: '草稿',
          value: 'Draft'
        },
        {
          label: '审批中',
          value: 'Approving'
        },
        {
          label: '已通过',
          value: 'Approved'
        },
        {
          label: '已驳回',
          value: 'Rejected'
        },
        // {
        //   label: '已终止',
        //   value: 'Terminated'
        // }
      ],
      fieldList: [
        {
          name: '序号',
          class: 'w5p'
        },
        {
          name: '价单编号',
          class: 'w15p'
        },
        {
          name: '价单名称',
          class: 'w20p'
        },
        {
          name: '业务类型',
          class: 'w10p'
        },
        {
          name: '订货类型',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '工厂季',
          class: 'w10p'
        },
        {
          name: '币种',
          class: 'w5p'
        },
        {
          name: '审批状态',
          class: 'w5p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ],
      operateFieldList: [
        {
          name: '序号',
          class: 'w5p'
        },
        {
          name: '价单编号',
          class: 'w15p'
        },
        {
          name: '价单名称',
          class: 'w20p'
        },
        {
          name: '业务类型',
          class: 'w10p'
        },
        {
          name: '订货类型',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '工厂季',
          class: 'w10p'
        },
        {
          name: '币种',
          class: 'w10p'
        },
        {
          name: '',
          class: 'w10p'
        }
      ],
      editFieldList: [
        {
          name: '物料系列',
          class: 'w15p',
          isRules: true
        },
        {
          name: '特殊物料',
          class: 'w15p'
        },
        {
          name: '价格',
          class: 'w15p',
          isRules: true
        },
        {
          name: '阶梯价使用条件',
          class: 'w35p',
          isRules: true
        },
        {
          name: '操作',
          class: 'w15p'
        },
        {
          name: '',
          class: 'w5p'
        }
      ],
      
      ruleForm: {
        // businessType: '',
        supplierName: '',
        supplierCode: '',
        factorySeason: '',
        currency: '',
        freezeStatus: '',
        priceListId: '',
        priceListName: '',
        orderType: '',
        orderTypeName: ''
      },
      rules: {
        // businessType: [
        //   { required: true, message: '请选择业务类型', trigger: 'change' },
        // ],
        supplierCode: [
          { required: true, message: '请选择供应商', trigger: 'change' },
        ],
        factorySeason: [
          { required: true, message: '请选择工厂季', trigger: 'change' },
        ],
        currency: [
          { required: true, message: '请选择币种', trigger: 'change' },
        ],

      },
       leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex'
          // class: 'w50p',
//        isId:true
          // width: '150',
          //minWidth: '20%'
        },
        {
          name: '价单编号',
          field: 'priceListId',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'价单名称',
          field:'priceListName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        // {
        //   name:'业务类型',
        //   field:'businessTypeName',
        // },
        {
          name:'订货类型',
          field:'orderTypeName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'供应商',
          field:'supplierName',
          fabricSupplierName:'fabricSupplierName'
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'工厂季',
          field:'factorySeason',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'币种',
          field:'currency',
          spotPriceCurreny:'spotPriceCurreny'
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'审批状态',
          field:'auditStatusName'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '200',
          minWidth: '10%',
          isAction: true
        },
      ],

      // 编辑组件数据
      editFieldsList: [
        {
          name: '* 物料系列',
          field: 'materialSeries',
          class: '',
          width: '150',
          isRules: true,
          isSingleField: true,
          chlidListName: 'itemLadderPriceList'
        },
        {
          name: '特殊物料',
          field: 'materialCode',
          class: 'w23p',
          width: '150',
          isSingleField: true
        },
        {         
          name: '物料结束范围',
          field: 'materialCodeEnd',
          class: 'w23p',
          width: '150',
          isSingleField: true
        },
        {
          name: '* 价格',
          field: 'price',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        {
          name: '* 阶梯价使用条件',
          field_1: 'startMeter',
          field_2: 'endMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w8p',
          width: '400',
          isRules: true
        }
      ],
      editLeaderFieldsList: [],
      // editLeaderFieldsList: [
      //   {
      //     name: '* 物料系列',
      //     field: 'materialSeries',
      //     class: '',
      //     width: '150',
      //     isRules: true,
      //     isSingleField: true
      //   }
      // ],
      editTailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          isAction: true,
          isChlidAction: true,
          hasAdd: true,
          hasChildDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {},
      inputSet: {
        materialSeries: {
          maxlength: '32',
          placeholder: '',
          disabled: false
        },
        materialCode: {
          maxlength: '32',
          placeholder: '',
          disabled: false
        },
        materialCodeEnd: {
          maxlength: '32',
          placeholder: '',
          disabled: false
        },
        price: {
          maxlength: '',
          placeholder: '',
          disabled: false
        },
        startMeter: {
          maxlength: '9',
          placeholder: '',
          disabled: false
        },
        endMeter: {
          maxlength: '9',
          placeholder: '',
          disabled: false
        },
      },
      selectSet: {
        selectData: {
          selectListName: '',
          value: '',
          label: ''
        }
      },
      numberInputSet: {},
      datePickerSet: {},
      inputDoubleSet: {
        startMeter: true
      },

    };
  },
  components: {
    singleTable,
    editDoubleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getBusinessTypeList();
    this.getPurchasePriceList();
    this.getSupplierDictList();
    this.getSaleSeasonList();
    this.getCurrencyList();
    this.getPriceTypeList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: {
     //多选
    checkBoxHandle(val){
    console.log(val)
     let idList=[];
     this.idItems=[];
     for(var i=0;i<val.length;i++){
       let item=val[i];
       console.log(item)
       idList.push(item.id)
     }
     this.idItems=idList;
     console.log(idList)
    },
    //导入
    importHandle(){
       this.uploadurl = process.env.VUE_APP_SCM_URL + 'purchaseDownload/v1/importExcel'
    },
    //导出
    exportHandle(){
      console.log(this.idItems)
      this.tableLoading = true;
       this.isLoadingExport=true;
      if(this.idItems!=''){
            let obj={
            auditStatus:this.auditStatus,
            priceIdList:this.idItems,
            purchasePriceListType:this.purchasePriceListType,
            supplierCode:this.supplierCode
          }
           exportFile(JSON.stringify(obj)).then(res => {
             console.log(res);
              this.tableLoading = false;
               this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '期货采购价单'+'.xlsx'; //下载后文件名
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
           });
      }else{
         this.$message({
            type: 'error',
            message: '请选择勾选项!'
         });
         this.tableLoading = false;
          this.isLoadingExport=false;
      }
     
    },
    beforeupload(file) {
//				 console.log(file)
         this.tableLoading = true;
         this.isLoadingImport=true;
				 var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
				 const isLt2M = file.size / 1024 / 1024 < 10     //这里做文件大小限制
					if(!isLt2M) {
						this.$message({
							message: '上传文件大小不能超过2MB!',
							type: 'error'
						});
					}
					return isLt2M
			},
     //订单导入成功之后
		UploadSuccess(response, file) {
				if(response.code == 0) {
					this.$message({
						message: '导入成功',
						type: 'success'
          });
           this.tableLoading = false;
          this.isLoadingImport=false;
					this.getPurchasePriceList();
				}else{
					this.$message({
						message:response.message,
						type: 'error'
          });
           this.tableLoading = false;
          this.isLoadingImport=false;
				}
			},
    addHandle() {
      // 添加
      this.isEdit = true;
      this.editType = 'add';
      this.materialSeries = '';
      let ruleFormCopy = {
        // businessType: '',
        supplierName: '',
        factorySeason: '',
        currency: '',
        freezeStatus: '',
        priceListId: '',
        priceListName: '',
      };
      let editDataCopy = {
        isAdd: true,
        deleteStatus: '',
        itemLadderPriceList: [],
        materialCode: '',
        materialCodeEnd:'',
        materialSeries: '',
        priceListId: '',
        priceListName: ''
      };
      let editChildDataCopy = {
        endMeter: '',
        price: '',
        startMeter: '',
        uuid: '',
        purchaseMeasurementUnit: '米',
      };
      getUUID().then(res => {
        console.log(res);
        if (res.code === '0') {
          ruleFormCopy.uuid = res.data;
        }
      });
      getUUID().then(res => {
        if (res.code === '0') {
          editChildDataCopy.uuid = res.data;
        }
      });
      let editListCopy = [];
      // let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      // let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
      this.updateEditModeSet('add', editDataCopy);
      this.updateEditModeSet('add', editChildDataCopy);
      editDataCopy.itemLadderPriceList.push(editChildDataCopy);
      editListCopy.push(editDataCopy);
      this.ruleForm = ruleFormCopy;
      this.editList = editListCopy;
      this.editListClone = editListCopy;
      this.$forceUpdate();
    },
    editHandle(index, item) {
      // 编辑项
      // console.log('打开项：', item,index);
      // this.index=index;
      // let editListCopy = JSON.parse(JSON.stringify(this.editList));
      // this.isEdit = true;
      // this.editType = 'edit';
      // this.materialSeries = '';
      // this.reductionData=JSON.parse(JSON.stringify(item));//copy一份最初的数据防止数据修改
      // this.ruleForm = item;
      // console.log(this.ruleForm)
      // editListCopy = item.purchasePriceListItems;
      // for (var i = 0; i < editListCopy.length; i++) {
      //   this.updateEditModeSet('edit', editListCopy[i]);
      //   for (var j = 0; j < editListCopy[i].itemLadderPriceList.length; j++) {
      //     let data = editListCopy[i].itemLadderPriceList[j];
      //     data.purchaseMeasurementUnit = '米';
      //     this.updateEditModeSet('edit', data);
      //   }
      // }
      // this.editList = editListCopy;
      // this.editListClone = editListCopy;
       // 编辑项
      console.log('打开项：', item,index);
      console.log(this.editList)
      this.editType = 'edit';
      this.index=index;
      this.isEdit = true;
      this.updIndex=index;
      this.updItem=item;
      this.removedIds=[];
      editPurchasePriceView(item.id,this.materialSeries,this.currentPageUpd, this.pageSizeUpd).then(res => {
        if (res.code === '0') {
          console.log(res.data)
          this.totalUpd=res.data.purchasePriceListPageItems.total;
          let editListCopy = JSON.parse(JSON.stringify(this.editList));
          // this.materialSeries = '';
          this.reductionData=JSON.parse(JSON.stringify(res.data));//copy一份最初的数据防止数据修改
          this.ruleForm = res.data;
          console.log(this.ruleForm)
          editListCopy = res.data.purchasePriceListPageItems.records;
          for (var i = 0; i < editListCopy.length; i++) {
            this.updateEditModeSet('edit', editListCopy[i]);
            for (var j = 0; j < editListCopy[i].itemLadderPriceList.length; j++) {
              let data = editListCopy[i].itemLadderPriceList[j];
              data.purchaseMeasurementUnit = '米';
              this.updateEditModeSet('edit', data);
            }
          }
          this.editList = editListCopy;
          this.editListClone = editListCopy;
        }
      });

    },
    checkHandle(index,item) {
      // 查看项
      // console.log('打开项：', item);
      // let editListCopy = JSON.parse(JSON.stringify(this.editList));
      // this.isEdit = true;
      // this.editType = 'check';
      // this.materialSeries = '';
      // this.ruleForm = item;
      // editListCopy = item.purchasePriceListItems;
      // for (var i = 0; i < editListCopy.length; i++) {
      //   this.updateEditModeSet('check', editListCopy[i]);
      //   for (var j = 0; j < editListCopy[i].itemLadderPriceList.length; j++) {
      //     let data = editListCopy[i].itemLadderPriceList[j];
      //     data.purchaseMeasurementUnit = '米';
      //     this.updateEditModeSet('check', data);
      //   }
      // }
      // this.editList = editListCopy;
      // this.editListClone = editListCopy;

       // 查看项
      console.log('打开项：', item);
     
      this.updIndex=index;
      this.updItem=item;
      this.editType = 'check';
      this.removedIds=[];
      this.isEdit = true;
      editPurchasePriceView(item.id,this.materialSeries,this.currentPageUpd, this.pageSizeUpd).then(res => {
        if (res.code === '0') {
          console.log(res.data)
          this.totalUpd=res.data.purchasePriceListPageItems.total;
           let editListCopy = JSON.parse(JSON.stringify(this.editList));
          this.materialSeries = '';
          this.ruleForm = res.data;
          editListCopy = res.data.purchasePriceListPageItems.records;
          for (var i = 0; i < editListCopy.length; i++) {
            this.updateEditModeSet('check', editListCopy[i]);
            for (var j = 0; j < editListCopy[i].itemLadderPriceList.length; j++) {
              let data = editListCopy[i].itemLadderPriceList[j];
              data.purchaseMeasurementUnit = '米';
              this.updateEditModeSet('check', data);
            }
          }
          this.editList = editListCopy;
          this.editListClone = editListCopy;
        }
      });

    },
    submitHandle(index,item) {
      // 提交审批
      this.submitId = item.id;
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      submitPurchasePrice(this.submitId).then(res => {
        console.log('提交审批：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.auditStatus = 'Approving';
          this.getPurchasePriceList();
          this.$message({
            type: 'success',
            message: '提交审批成功!'
          });
          this.activeName = 'Approving';
        }
      });
    },
    cancelHandle() {
       // 取消
      this.isEdit = false;
      this.removedIds=[];
      this.checked=false;
      this.currentPageUpd=1,
      this.pageSizeUpd=10;
      
      this.ruleForm={
        supplierName: '',
        supplierCode: '',
        factorySeason: '',
        currency: '',
        freezeStatus: '',
        priceListId: '',
        priceListName: '',
      };
      console.log(this.editList)
      // let data=JSON.parse(JSON.stringify(this.reductionData));
      // console.log(data);
      // this.editList=JSON.parse(JSON.stringify(data));
      // this.priceList[this.index]=this.editList;
      // this.priceList[this.index].purchasePriceListItems=this.editList.purchasePriceListItems;
      // this.$forceUpdate();
      // console.log(this.priceList)
    },
    saveHandle(formName) {
      // 保存
      console.log(this.editType);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let time = null;
          // 校验
          for (var i = 0; i < this.editList.length; i++) {
            if (!this.editList[i].materialSeries) {
              this.$message({
                type: 'error',
                message: '请输入物料系列！'
              });
              return false;
            }
            if(this.editList[i].materialCodeEnd<this.editList[i].materialCode&&this.editList[i].materialCodeEnd!=''&&this.editList[i].materialCodeEnd!=null){
               this.$message({
                type: 'error',
                message: '物料结束范围不能小于特殊物料！'
              });
              return false;
            }
            for (var j = 0; j < this.editList[i].itemLadderPriceList.length; j++) {
              let data = this.editList[i].itemLadderPriceList[j];
              if (!data.price) {
                this.$message({
                  type: 'error',
                  message: '请输入价格！'
                });
                return false;
              }
               if(data.price){
                var numVal=data.price;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '价格中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              if (parseFloat(data.price) < 1) {
                this.$message({
                  type: 'error',
                  message: '价格不能小于1！'
                });
                return false;
              }
              if (data.price.toString().indexOf('.') !== -1) {
                let arr = data.price.toString().split('.');
                if (arr[0].length > 8) {
                  this.$message({
                    message: '价格仅支持整数位8位，请重新输入！',
                    type: 'error'
                  });
                  return false;
                }
                if (arr[1].length > 2) {
                  this.$message({
                    message: '价格仅支持小数位2位，请重新输入！',
                    type: 'error'
                  });
                  return false;
                }
              } else if (data.price.toString().length > 8) {
                this.$message({
                  message: '价格仅支持整数位8位，请重新输入！',
                  type: 'error'
                });
                return false;
              }
              if(data.startMeter){
                var numVal=data.startMeter;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '阶梯价中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              if(data.endMeter){
                var numVal=data.endMeter;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '阶梯价中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              // if (!data.startMeter) {
              //   this.$message({
              //     type: 'error',
              //     message: '请输入阶梯价使用条件！'
              //   });
              //   return false;
              // }
              // if (!data.endMeter) {
              //   this.$message({
              //     type: 'error',
              //     message: '请输入阶梯价使用条件！'
              //   });
              //   return false;
              // }
              if (data.startMeter < 0 || data.endMeter < 0) {
                this.$message({
                  type: 'error',
                  message: '阶梯价使用条件不能小于0！'
                });
                return false;
              }
            }
          }
          // if (this.editType == 'add') {
            // searchPurchasePriceList(this.ruleForm.priceListName).then(res => {
            //   console.log('价单名称搜索列表：', res);
            //   if (res.code === '0' && res.data.length) {
            //     this.$message({
            //       type: 'error',
            //       message: '价单名称已存在!'
            //     });
            //     return false;
            //   }
            // });
          // }
          if (this.editType == 'add') {
            this.ruleForm.submitType = '1';
          }else{
            this.ruleForm.submitType = '1';
          }
          if (this.ruleForm.auditStatus == 'Draft' || this.auditStatus == 'Approved') {
            this.ruleForm.submitType = '1';
          }
          if (this.ruleForm.auditStatus == 'Rejected') {
            this.ruleForm.submitType = '3';
          }
          this.ruleForm.applicant = this.$store.state.userName;
          this.ruleForm.applicantName = this.$store.state.realName;
          this.ruleForm.applicantDepartment = this.$store.state.currentDepartment.id;
          this.ruleForm.applicantDepartmentName = this.$store.state.currentDepartment.name;
          this.ruleForm.purchasePriceListType = this.purchasePriceListType;
          this.ruleForm.removedIds=this.removedIds;
          this.ruleForm.purchasePriceListItems = this.editList;
          this.isSaveDisabled = true;
          time = setTimeout(() => {
            editPurchasePrice(this.ruleForm).then(res => {
              console.log('保存数据：', res);
              if (res.code === '0') {
                this.getPurchasePriceList();
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });
                this.isEdit = false;
                if(this.editType=='edit'){
                  this.checked=false;
                }
              }
              this.isSaveDisabled = false;
            });
          }, 100);
        } else {
          console.log('error submit!');
          this.isSaveDisabled = false;
          return false;
        }
      });
    },
    submitEditHandle(formName) {
      // 提交
      console.log(this.editType);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let time = null;
          // 校验
          for (var i = 0; i < this.editList.length; i++) {
            if (!this.editList[i].materialSeries) {
              this.$message({
                type: 'error',
                message: '请输入物料系列！'
              });
              return false;
            }
            if(this.editList[i].materialCodeEnd<this.editList[i].materialCode&&this.editList[i].materialCodeEnd!=''&&this.editList[i].materialCodeEnd!=null){
               this.$message({
                type: 'error',
                message: '物料结束范围不能小于特殊物料！'
              });
              return false;
            }
            for (var j = 0; j < this.editList[i].itemLadderPriceList.length; j++) {
              let data = this.editList[i].itemLadderPriceList[j];
              if (!data.price) {
                this.$message({
                  type: 'error',
                  message: '请输入价格！'
                });
                return false;
              }
               if(data.price){
                var numVal=data.price;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '价格中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              if (parseFloat(data.price) < 1) {
                this.$message({
                  type: 'error',
                  message: '价格不能小于1！'
                });
                return false;
              }
              if (data.price.toString().indexOf('.') !== -1) {
                let arr = data.price.toString().split('.');
                if (arr[0].length > 8) {
                  this.$message({
                    message: '价格仅支持整数位8位，请重新输入！',
                    type: 'error'
                  });
                  return false;
                }
                if (arr[1].length > 2) {
                  this.$message({
                    message: '价格仅支持小数位2位，请重新输入！',
                    type: 'error'
                  });
                  return false;
                }
              } else if (data.price.toString().length > 8) {
                this.$message({
                  message: '价格仅支持整数位8位，请重新输入！',
                  type: 'error'
                });
                return false;
              }
              if(data.startMeter){
                var numVal=data.startMeter;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '阶梯价中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              if(data.endMeter){
                var numVal=data.endMeter;
		            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
                if (numVal != "") { 
                  if (!reg.test(numVal)) { 
                     this.$message({
                        type: 'error',
                        message: '阶梯价中请输入正确的数字!'
                      });
                    // 返回，不往下执行
                    return false;
                  } 
                }
              }
              // if (!data.startMeter) {
              //   this.$message({
              //     type: 'error',
              //     message: '请输入阶梯价使用条件！'
              //   });
              //   return false;
              // }
              // if (!data.endMeter) {
              //   this.$message({
              //     type: 'error',
              //     message: '请输入阶梯价使用条件！'
              //   });
              //   return false;
              // }
              if (data.startMeter < 0 || data.endMeter < 0) {
                this.$message({
                  type: 'error',
                  message: '阶梯价使用条件不能小于0！'
                });
                return false;
              }
            }
          }
          // if (this.editType == 'add') {
            // searchPurchasePriceList(this.ruleForm.priceListName).then(res => {
            //   console.log('价单名称搜索列表：', res);
            //   if (res.code === '0' && res.data.length) {
            //     this.$message({
            //       type: 'error',
            //       message: '价单名称已存在!'
            //     });
            //     return false;
            //   }
            // });
          // }
          if (this.editType == 'add') {
            this.ruleForm.submitType = '2';
          }else{
            this.ruleForm.submitType = '2';
          }
          if (this.ruleForm.auditStatus == 'Draft' || this.auditStatus == 'Approved') {
            this.ruleForm.submitType = '2';
          }
          if (this.ruleForm.auditStatus == 'Rejected') {
            this.ruleForm.submitType = '4';
          }

          this.ruleForm.applicant = this.$store.state.userName;
          this.ruleForm.applicantName = this.$store.state.realName;
          this.ruleForm.applicantDepartment = this.$store.state.currentDepartment.id;
          this.ruleForm.applicantDepartmentName = this.$store.state.currentDepartment.name;
          this.ruleForm.purchasePriceListType = this.purchasePriceListType;
          this.ruleForm.removedIds=this.removedIds;
          this.ruleForm.purchasePriceListItems = this.editList;
          this.isSubmitDisabled = true;
          time = setTimeout(() => {
            editPurchasePrice(this.ruleForm).then(res => {
              console.log('保存数据：', res);
              if (res.code === '0') {
                this.activeName = 'Approving';
                this.auditStatus = 'Approving';
                this.getPurchasePriceList();
                this.$message({
                  type: 'success',
                  message: '提交审批成功！'
                });
                this.isEdit = false;
                if(this.editType=='edit'){
                  this.checked=false;
                }
              }
              this.isSubmitDisabled = false;
            });
          }, 100);
        } else {
          console.log('error submit!');
          this.isSubmitDisabled = false;
          return false;
        }
      });
    },
    priceListNameBlur(event) {
      searchPurchasePriceList(event.target.value).then(res => {
        console.log('价单名称搜索列表：', res);
        if (res.code === '0' && res.data.length) {
          this.$message({
            type: 'error',
            message: '价单名称已存在！'
          });
        }
      });
    },
     filterTagFun(i,editListCopy){
     console.log(i,editListCopy)
     this.editList = editListCopy.filter(item => {
          console.log(item[i])
          return item[i].indexOf(this.materialSeries) != -1;
      });
    },
    searchSeriesHandle() {
     console.log(this.materialSeries)
      var _this = this;
      this.currentPageUpd = 1;
      if(this.editType=='edit'){
        this.editHandle(this.updIndex,this.updItem);
      }else if(this.editType=='add'){
        let editListCopy = JSON.parse(JSON.stringify(this.editListClone));
        console.log(editListCopy)
        editListCopy.forEach(function(item) {
           for(var i in item){
             if(_this.materialSeries==item[i]){
              //  console.log('符合')
              //  console.log(i)
               _this.filterTagFun(i,editListCopy);
             }
            }
        });
      }
    },
    async addSeriesHandle() {
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
      this.updateEditModeSet('add', editDataCopy);
      this.updateEditModeSet('add', editChildDataCopy);
      await getUUID().then(res => {
        if (res.code === '0') {
          editChildDataCopy.uuid = res.data;
        }
      });
      editDataCopy.itemLadderPriceList.push(editChildDataCopy);
      editListCopy.push(editDataCopy);
      this.editList = editListCopy;
      this.editListClone = editListCopy;
      console.log('新增数据', this.editList);
      this.$forceUpdate();
    },
    addSeriesItemHandle(index, item) {
      if (this.editType == 'check') {
        return false;
      }
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
      this.updateEditModeSet('add', editListCopy[index]);
      this.updateEditModeSet('add', editChildDataCopy);
      getUUID().then(res => {
        if (res.code === '0') {
          editChildDataCopy.uuid = res.data;
        }
      });
      editListCopy[index].itemLadderPriceList.push(editChildDataCopy);
      this.editList = editListCopy;
      this.$forceUpdate();
    },
    deleteSeriesItemHandle(pi, ci, item) {
      if (this.editType == 'check') {
        return false;
      }
      if(item.id!=undefined){
        this.removedIds.push(item.id);
      }   
      console.log(this.removedIds)
      if (ci === 0) {
        let editListCopy = JSON.parse(JSON.stringify(this.editList));
        editListCopy.splice(pi, 1);
        this.editList = editListCopy;
        this.editListClone = editListCopy;
        this.$forceUpdate();
      } else {
        let editListCopy = JSON.parse(JSON.stringify(this.editList));
        editListCopy[pi].itemLadderPriceList.splice(ci, 1);
        this.editList = editListCopy;
        this.editListClone = editListCopy;
        this.$forceUpdate();
      }
    },
    pullSupplierNameHandle(supplierName) {
      supplierToMaterialSeries(supplierName).then(res => {
        if (res.code === '0') {
          if (res.data.length) {
            let editListCopy = [];
            for (var i = 0; i < res.data.length; i++) {
              let editDataCopy = JSON.parse(JSON.stringify(this.editData));
              let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
              this.updateEditModeSet('add', editDataCopy);
              this.updateEditModeSet('add', editChildDataCopy);
              getUUID().then(res => {
                console.log(res);
                if (res.code === '0') {
                  editChildDataCopy.uuid = res.data;
                }
              });
              editDataCopy.itemLadderPriceList.push(editChildDataCopy);
              editDataCopy.materialSeries = res.data[i];
              editListCopy.push(editDataCopy);
            }
            this.editList = editListCopy;
            this.editListClone = editListCopy;
            this.$forceUpdate();
          } else {
            this.$message({
              type: 'error',
              message: '没有供应商信息!'
            });
          }
        }
      });
    },
    deleteHandle(index,item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deletePurchasePrice(this.deleteId).then(res => {
        console.log('删除项：', res);
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getPurchasePriceList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    businessTypeChange(val) {
      let businessTypeData = this.businessTypeList.find(item => {
        return item.index === val;
      });
      this.ruleForm.businessTypeName = businessTypeData ? businessTypeData.name : '';
      this.ruleForm.priceListName = ('期货') + (this.ruleForm.supplierName ? '-' + this.ruleForm.supplierName : '') + (this.ruleForm.factorySeason ? '-' + this.ruleForm.factorySeason : '') + (this.currencyName? '-' + this.currencyName: '');
    },
    supplierNameChange(val) {
      let supplierNameData = this.supplierList.find(item => {
        return item.supplierId === val;
      });
      this.ruleForm.supplierCode = val;
      this.ruleForm.supplierName = supplierNameData.supplierName;
      this.ruleForm.priceListName = ('期货') + (this.ruleForm.supplierName ? '-' + this.ruleForm.supplierName : '') + (this.ruleForm.factorySeason ? '-' + this.ruleForm.factorySeason : '') + (this.currencyName? '-' + this.currencyName: '');
    },
    factorySeasonChange(val) {
      this.ruleForm.priceListName = ('期货') + (this.ruleForm.supplierName ? '-' + this.ruleForm.supplierName : '') + (this.ruleForm.factorySeason ? '-' + this.ruleForm.factorySeason : '') + (this.currencyName? '-' + this.currencyName: '');
    },
    currencyChange(val) {
      for(var i=0;i<this.currencyList.length;i++){
        let item=this.currencyList[i];
        if(this.ruleForm.currency==item.index){
          this.currencyName=item.name;
        }
      }
      this.ruleForm.priceListName = ('期货') + (this.ruleForm.supplierName ? '-' + this.ruleForm.supplierName : '') + (this.ruleForm.factorySeason ? '-' + this.ruleForm.factorySeason : '') + (this.currencyName ? '-' + this.currencyName: '');
    },
    orderTypeChange(val) {
      console.log('订货类型切换值：', val);
      let priceTypeData = this.priceTypeList.find(item => {
        return item.name === val;
      });
      this.ruleForm.orderType = priceTypeData.index;
    },
    switchTabHandle(tab) {
      // tab切换
      console.log('tab切换：', tab);
      this.currentPage = 1;
      this.priceList = [];
      switch (tab.name) {
        case '':
          // 全部
          this.auditStatus = '';
          this.getPurchasePriceList();
          break;
        case 'Draft':
          // 草稿
          this.auditStatus = 'Draft';
          this.getPurchasePriceList();
          break;
        case 'Approving':
          // 审批中
          this.auditStatus = 'Approving';
          this.getPurchasePriceList();
          break;
        case 'Approved':
          // 已通过
          this.auditStatus = 'Approved';
          this.getPurchasePriceList();
          break;
        case 'Rejected':
          // 已驳回
          this.auditStatus = 'Rejected';
          this.getPurchasePriceList();
          break;
        case 'Terminated':
          // 已终止
          this.auditStatus = 'Terminated';
          this.getPurchasePriceList();
          break;
        default:
          this.auditStatus = '';
          this.getPurchasePriceList();
          break;
      }
    },
    searchHandle() {
      // 搜索
      this.getPurchasePriceList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchasePriceList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchasePriceList();
    },
    handleSizeChangeUpd(val) {
      this.pageSizeUpd = val;
     console.log(this.checked)
      if(this.editType=='edit'){
        if(this.checked==true){
            this.submitPageDialogVisible=false;
        }else{
            this.submitPageDialogVisible=true;
        }
        this.editHandle(this.updIndex,this.updItem);
      }else if(this.editType=='check'){
         this.checkHandle(this.updIndex,this.updItem);
      }
    },
    handleCurrentChangeUpd(val) {
      this.currentPageUpd = val;
       console.log(this.checked)
      if(this.editType=='edit'){
         if(this.checked==true){
            this.submitPageDialogVisible=false;
        }else{
            this.submitPageDialogVisible=true;
        }
        this.editHandle(this.updIndex,this.updItem);
      }else if(this.editType=='check'){
         this.checkHandle(this.updIndex,this.updItem);
      }
    },
    getPurchasePriceList() {
    	this.tableLoading = true;
      // 采购价单列表
      let data = {
        auditStatus: this.auditStatus,
        // businessType: this.businessType,
        priceListId: this.priceListId,
        purchasePriceListType: this.purchasePriceListType,
        supplierCode: this.supplierCode
      };
      purchasePriceList(this.currentPage, this.pageSize, data).then(res => {
        console.log('期货采购价单列表：', res);
        if (res.code === '0') {
        	this.tableLoading = false;
          this.priceList = res.data.records;
          this.total = res.data.total;
          this.priceList.forEach((item, index) => {
            // if (item.createTime) {
            //   item.createTime = timeFormat(item.createTime);
            // } else {
            //   item.createTime = "空";
            // }
            item.auditStatusName = this.actionsTypeHandle(item.auditStatus);
          });
          for (var i = 0; i < this.priceList.length; i++) {
             let item=this.priceList[i];
            if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
            }else{
              item.idIndex=i+1;
            }
            switch (this.priceList[i].auditStatus) {
              case 'Draft':
                this.priceList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Approving':
                this.priceList[i].actions = {
                  hasCheck: true
                };
                break;
              case 'Approved':
                this.priceList[i].actions = {
                  hasEdit: true,
                  hasDelete: true
                };
                break;
              case 'Rejected':
                this.priceList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Terminated':
                this.priceList[i].actions = {
                  hasDelete: true
                };
                break;
              default:
                this.priceList[i].actions = {};
                break;
            }
          }
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    actionsTypeHandle(status) {
      // 审批状态
      switch (status) {
        case 'Draft':
          return '草稿';
          break;
        case 'Approving':
          return '审批中';
          break;
        case 'Approved':
          return '已通过';
          break;
        case 'Rejected':
          return '已驳回';
          break;
        case 'Terminated':
          return '已终止';
          break;
        default:
          break;
      }
    },
    getSupplierDictList() {
      // 供应商列表
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    getBusinessTypeList() {
      // 业务类型列表
      constDictList('BusinessTypeFuturesPurchasing').then(res => {
        console.log('业务类型列表：', res);
        if (res.code === '0') {
          this.businessTypeList = res.data;
        }
      });
    },
    getSaleSeasonList() {
      // 工厂季列表
      constDictList('SaleSeasou').then(res => {
        console.log('工厂季列表：', res);
        if (res.code === '0') {
          this.saleSeasonList = res.data;
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
    getPriceTypeList() {
      // 订货类型列表
      constDictList('PriceListOrderType').then(res => {
        console.log('订货类型列表：', res);
        if (res.code === '0') {
          this.priceTypeList = res.data;
        }
      });
    },

    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let inputDoubleSet = JSON.parse(JSON.stringify(this.inputDoubleSet));
      if (type == 'edit') {
        // 物料系列
        inputSet.materialSeries = false;
        textSet.materialSeries = true;
        switch (status) {
          case 'Draft':
            
            break;
          case 'Approved':
            
            break;
          default:
            break;
        }
      }
      if (type == 'check') {
        inputSet.materialSeries.disabled = true;
        inputSet.materialCode.disabled = true;
        inputSet.materialCodeEnd.disabled=true;
        inputSet.price.disabled = true;
        inputSet.startMeter.disabled = true;
        inputSet.endMeter.disabled = true;
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.inputDoubleSet = inputDoubleSet;
      data.editModeSet = editModeSet;
    },
    

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.futuresPriceList {
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

.edit_wrap {
  ul {
    &.childcontentlist {
      li {
        // white-space: normal;
        line-height: 32px;
      }
    }
  }
  .edit_parent_list {
    .edit_item {
      position: relative;
      border-bottom: 1px solid #EEEEEE;
      .delete_btn {
        position: absolute;
        top: 0;
        right: 20px;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

i.el-icon-document {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
i.el-icon-remove, i.el-icon-circle-plus {
  font-size: 28px;
  color: red;
  cursor: pointer;
}
i.el-icon-circle-plus {
  color: #409eff;
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

.futuresPriceList .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.futuresPriceList .el-form-item__content {
  width: auto;
}
.futuresPriceList .el-input {
  width: auto;
}
.futuresPriceList .whole_long .el-input {
  width: 100%;
}
.futuresPriceList .whole_long .el-form-item__content {
  width: 65%;
}
.futuresPriceList .whole_long .el-input {
  width: 100%;
}


.futuresPriceList .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.futuresPriceList .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.futuresPriceList .subnav_wrap .el-tabs__content {
  overflow: visible;
}
.futuresPriceList .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.futuresPriceList .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.futuresPriceList .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
</style>