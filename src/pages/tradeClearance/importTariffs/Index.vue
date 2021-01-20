<template>
  <div class="container importTariffs">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
      	<div class="actions_wrap">
      		<div class="display_ib mr10 mb10">
		        <span class="tag">发票号：</span>
		        <el-input class="input_single w200 mr10" v-model="invoiceCode" placeholder="请输入"></el-input>
		      </div>
		      <div class="display_ib mr10 mb10">
		        <span class="tag">合同号：</span>
		        <el-input class="input_single w200 mr10" v-model="contractCode" placeholder="请输入"></el-input>
		      </div>
		      <div class="display_ib mr10 mb10">
		        <span class="tag">供应商名称：</span>
		        <el-input class="input_single w200 mr10" v-model="supplierName" placeholder="请输入"></el-input>
		      </div>
		      <div class="display_ib mr10 mb10">
		        <span class="tag">创建时间：</span>
            <el-date-picker class="mr10"
              v-model="dateVal"
              unlink-panels
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateValChange"
            ></el-date-picker>
		      </div>
		    </div>
        <div class="actions_btn_wrap down t_right">
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
        <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value">
            <Table :tableList="tariffList" :parentData="parentData" :childData="childData" :tableFieldsList="fieldList" :tableLoading="tableLoading" @editHandle="editHandle" @submitHandle="submitHandle" @deleteHandle="deleteHandle"></Table>
          </el-tab-pane>
        </el-tabs>
        <p v-if="!tariffList.length && !tableLoading" class="empty_tip">暂无数据</p>
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
    <div class="edit_part" v-else>
      <div class="clearfix mb10">
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>合同号：</span>
          <el-input class="input_single w200 mr10 mb10" v-model="editList.contractCode" placeholder="请输入合同号"></el-input>
        </div>
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>供应商名称：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.supplierName"
            filterable
            placeholder="请选择"
            @change="supplierNameChange($event, editList)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierName"
              :value="item.supplierName">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>收款方：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.receiver"
            placeholder="请选择"
            @change="receiverChange($event, editList)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in receiverList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemName">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>贸易条款：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.paymentCondition"
            @change="paymentConditionSelect($event, editList)"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in paymentConditionList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="label">合同预估关税总金额：</span>
          <span class="label">{{editList.totalEstimateCustomsAdjustment ? editList.totalEstimateCustomsAdjustment : '0'}}</span>
        </div>
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>承运商：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.carrierName"
            @change="carrierNameSelect($event, editList)"
            placeholder="请选择承运商">
            <el-option key="" label="请选择承运商" value=""></el-option>
            <el-option
              v-for="item in carrierNameList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemName">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="label"><span class="red mr5">*</span>货物类型：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.goodsTypeName"
            @change="goodsTypeNameSelect($event, editList)"
            placeholder="请选择货物类型">
            <el-option key="" label="请选择货物类型" value=""></el-option>
            <el-option
              v-for="item in goodsTypeList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemName">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label">币种：原币种—&nbsp;</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editList.currency"
            @change="currencyChange($event, editList)"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in currencyList"
              :key="item.index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <span class="label">&nbsp;&nbsp;本位币—人民币</span>
          <!-- <span class="label">{{editList.currency}}</span> -->
        </div>
        <el-button
          class="fr"
          size="small"
          type="primary"
          icon="el-icon-plus"
          circle
          title="添加"
          @click="addEditHandle"
        ></el-button>
      </div>
      <div class="edit_wrap">
        <ul class="childlist">
          <li :class="item.class" v-for="(item, index) in editFieldList" :key="index">
            <span class="red mr5" v-if="item.isRules">*</span>
            {{item.name}}
          </li>
        </ul>
        <div class="allparentlist edit_parent_list clearfix">
          <ul
            class="childcontentlist"
            v-for="(item, index) in editList.tradeTariffItems"
            :key="index">
            <!-- 报关品类 -->
            <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.goodsClass"
                placeholder="">
              </el-input>
            </li>
            <!-- 工厂发票号 -->
            <li class="w10p">
              <!-- <el-input
                class="w100p"
                size="small"
                v-model.trim="item.invoiceCode"
                placeholder="">
              </el-input> -->
              <el-select
                class="w100p"
                size="small"
                v-model.trim="item.invoiceCode"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="invoiceCodeRemote"
                @change="invoiceCodeChange($event, index, item)"
                :loading="loading">
                <el-option
                  v-for="(item, index) in invoiceCodeList"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </li>
            <!-- 发货数量 -->
            <li class="w5p">
              <span class="label" :title="item.goodsNum">{{item.goodsNum}}</span>
              <!-- <el-input
                class="w100p"
                size="small"
                v-model="item.goodsNum"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input> -->
            </li>
            <!-- 预估货款 -->
            <li class="w10p">
              <span class="label" :title="item.estimatedPayment">{{item.estimatedPayment}}</span>
            </li>
            <!-- 预估杂费 -->
            <li class="w10p">
              <span class="label" :title="item.estimatedOtherPayment">{{item.estimatedOtherPayment}}</span>
            </li>
            <!-- 币种 -->
            <!-- <li class="w10p">
              <el-select
                class="select_single w100p"
                size="small"
                v-model="item.currency"
                placeholder="请选择"
                @change="currencyChange($event, item)">
                <el-option key="" label="请选择" value=""></el-option>
                <el-option
                  v-for="item in currencyList"
                  :key="item.dictItemValue"
                  :label="item.dictItemName"
                  :value="item.dictItemName">
                </el-option>
              </el-select>
            </li> -->
            <!-- 发票金额 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.invoiceMoney"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input>
            </li> -->
            <!-- 人民币汇率 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.rmbRate"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input>
            </li> -->
            <!-- 海关关税系数 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.customsCoefficient"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input>
            </li> -->
            <!-- 关税增值税 -->
            <!-- <li class="w5p">
              <span class="label">{{item.customsTax}}</span> -->
              <!-- <el-input
                class="w100p"
                size="small"
                v-model="item.customsTax"
                maxlength="8"
                placeholder="">
              </el-input> -->
            <!-- </li> -->
            <!-- 固定保险系数 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.insuranceCoefficient"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input>
            </li> -->
            <!-- 运费系数 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.freightCoefficient"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input>
            </li> -->
            <!-- 预估运费 -->
            <li class="w10p">
              <span class="label" :title="item.estimateFreight">{{item.estimateFreight}}</span>
              <!-- <el-input
                class="w100p"
                size="small"
                v-model="item.estimateFreight"
                maxlength="8"
                placeholder="">
              </el-input> -->
            </li>
            <!-- 预估关税 -->
            <li class="w10p">
              <span class="label" :title="item.estimateCustoms">{{item.estimateCustoms}}</span>
              <!-- <el-input
                class="w100p"
                size="small"
                v-model="item.estimateCustoms"
                maxlength="8"
                placeholder="">
              </el-input> -->
            </li>
            <!-- 增值税系数 -->
            <li class="w10p">
              <span class="label" :title="item.taxCoefficient">{{item.taxCoefficient}}</span>
              <!-- <el-input
                class="w100p"
                size="small"
                v-model="item.taxCoefficient"
                placeholder=""
                @change="inputValChange($event, item)">
              </el-input> -->
            </li>
            <!-- 预估增值税 -->
            <li class="w10p">
              <span class="label" :title="item.estimateTax">{{item.estimateTax}}</span>
            </li>
            <!-- 预估总金额 -->
            <li class="w10p">
              <span class="label" :title="item.estimateTotalAmount">{{item.estimateTotalAmount}}</span>
            </li>
            <!-- 预估关税调整 -->
            <!-- <li class="w10p">
              <el-input
                class="w100p"
                size="small"
                v-model="item.estimateCustomsAdjustment"
                placeholder=""
                @change="tariffAdjustmentChange($event, item)">
              </el-input>
            </li> -->
            <li class="w5p fr" >
              <i type="primary" class="el-icon-remove" title="删除" @click="deleteEditItemHandle(index, item)"></i>
            </li>
          </ul>
          <div class="edit_btn_wrap fr">
            <el-button type="primary" @click="cancelEditHandle">取消</el-button>
            <el-button type="primary" :disabled="isSaveDisabled" @click="saveEditHandle">保存</el-button>
            <el-button type="primary" :disabled="isSubmitDisabled" @click="submitEditHandle">提交审批</el-button>
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
        <el-button type="primary" @click="confirmDeleteHandle">确 定</el-button>
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
        <el-button type="primary" @click="confirmSubmitHandle">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { tradeTariffList, deleteTradeTariff, submitTradeTariff, editTradeTariff, searchTradeTariff, dictList, approvalProcessInfo, queryTradeTariff, duplicateInvoiceCode, supplierDictList, constDictList, invoiceNumberInfo, getCostInfo } from '@/api/module/tradeClearanceApi.js';
import { purchasegetuuid } from "@/api/module/purchaseApi.js";
import { timeFormat } from '@/utils/index.js';
import Table from "@/layouts/components/common/Table.vue";
export default {
  name: "importTariffs",
  data() {
    return {
      tableLoading: true,
      dateVal: '',
      contractCode: '',
      supplierName: '',
      applicationStatus: '',
      invoiceCode: '',
      beginTime: '',
      endTime: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: 'All',
      isShowEdit: false,
      isShowList: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      tariffList: [],
      currencyList: [],
      receiverList: [],
      carrierNameList: [],
      goodsTypeList: [],
      paymentConditionList: [],
      editList: [],
      deleteId: '',
      submitId: '',
      deleteDialogVisible: false,
      submitDialogVisible: false,
      supplierList: [],
      invoiceCodeList: [],
      loading: false,
      state: '',
      timeout:  null,
      editData: {
        uuid: '',
        contractCode: '',
        supplierName: '',
        receiver: '中商六通',
        receiverCode: 'China Merchants six links',
        paymentCondition: '',
        totalEstimateCustomsAdjustment: '',
        submitType: '',
        applicant: '',
        applicantDepartment: '',
        tradeTariffItems: [],
      },
      editChildData: {
        uuid: '',
        goodsClass: '面料',
        invoiceCode: '',
        // currency: '欧元',
        invoiceMoney: '',
        rmbRate: '',
        // customsCoefficient: '0.08',
        customsCoefficient: '',
        // taxCoefficient: '0.13',
        customsTax: '',
        // insuranceCoefficient: '1.003',
        insuranceCoefficient: '',
        // freightCoefficient: '0.2204',
        freightCoefficient: '',
        estimateCustomsAdjustment: '',
        goodsNum: '',
        estimatedPayment: '',
        estimatedOtherPayment: '',
        estimateFreight: '',
        estimateCustoms: '',
        taxCoefficient: '',
        estimateTax: '',
        estimateTotalAmount: ''
      },
      // fieldList: [
      //   {
      //     name: '报关品类',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '工厂发票号',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '发货数量',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '币种',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '发票金额',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '人民币汇率',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '关税增值税',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '固定保险系数',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '预估运费',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '预估关税',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '预估关税调整',
      //     class: 'w10p'
      //   },
      //   {
      //     name: '预收货清单编号',
      //     class: 'w10p'
      //   }
      // ],
      fieldList: [
        {
          name: '报关品类',
          class: 'w5p'
        },
        {
          name: '工厂发票号',
          class: 'w10p'
        },
        {
          name: '发货数量',
          class: 'w10p'
        },
        {
          name: '预估货款',
          class: 'w10p'
        },
        {
          name: '预估杂费',
          class: 'w10p'
        },
        {
          name: '预估运费',
          class: 'w10p'
        },
        {
          name: '预估关税',
          class: 'w10p'
        },
        {
          name: '增值税系数',
          class: 'w10p'
        },
        {
          name: '预估增值税',
          class: 'w10p'
        },
        {
          name: '预估总金额',
          class: 'w10p'
        }
      ],
      editFieldList: [
        {
          name: '报关品类',
          class: 'w10p',
          isRules: true
        },
        {
          name: '工厂发票号',
          class: 'w10p',
          isRules: true
        },
        {
          name: '发货数量',
          class: 'w5p',
          // isRules: true
        },
        {
          name: '预估货款（￥）',
          class: 'w10p',
          // isRules: true
        },
        {
          name: '预估杂费（￥）',
          class: 'w10p',
          // isRules: true
        },
        // {
        //   name: '币种',
        //   class: 'w10p',
        //   isRules: true
        // },
        // {
        //   name: '发票金额',
        //   class: 'w10p',
        //   isRules: true
        // },
        // {
        //   name: '人民币汇率',
        //   class: 'w10p',
        //   isRules: true
        // },
        // {
        //   name: '海关关税系数',
        //   class: 'w10p',
        //   isRules: true
        // },
        // {
        //   name: '关税增值税',
        //   class: 'w5p',
        //   isRules: true
        // },
        // {
        //   name: '固定保险系数',
        //   class: 'w10p',
        //   isRules: true
        // },
        // {
        //   name: '运费系数',
        //   class: 'w10p',
        //   isRules: true
        // },
        {
          name: '预估运费（￥）',
          class: 'w10p'
        },
        {
          name: '预估关税（￥）',
          class: 'w10p'
        },
        {
          name: '增值税系数',
          class: 'w10p',
          // isRules: true
        },
        {
          name: '预估增值税（￥）',
          class: 'w10p',
          // isRules: true
        },
        {
          name: '预估总金额（￥）',
          class: 'w10p'
        },
        // {
        //   name: '预估关税调整',
        //   class: 'w10p'
        // },
        {
          name: '',
          class: 'w5p'
        }
      ],
      subNavList: [
        {
          label: '全部请求',
          value: 'All'
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
        {
          label: '已终止',
          value: 'Terminated'
        }
      ],

      // New
      parentData: {
        status: '',
        data: [
          {
            name: '',
            field: 'createTime',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '申请人',
            field: 'applicantName',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '进口合同编号',
            field: 'contractCode',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '币种',
            field: 'currency',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '承运商',
            field: 'carrierName',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '货物类型',
            field: 'goodsTypeName',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '供应商名称',
            field: 'supplierName',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '收款方',
            field: 'receiver',
            class: 'w4p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '贸易条款',
            field: 'paymentCondition',
            class: 'w4p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '总金额',
            field: 'totalEstimateCustomsAdjustment',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '是否付款',
            field: 'isPayment',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '审批',
            field: '',
            class: '',
            isShowTit: false,
            isPopover: true
          },
          {
            name: '',
            field: '',
            class: 'fr mr15',
            isShowTit: false,
            isUpDown: true
          },
          {
            name: '',
            field: '',
            class: 'fr',
            isShowTit: false,
            isAction: true
          }
        ]
      },
      childData: {
        isDoubleList: false,
        name: 'tradeTariffItems',
        data: [
          {
            name: '',
            field: 'goodsClass',
            class: 'w5p'
          },
          {
            name: '',
            field: 'invoiceCode',
            class: 'w10p'
          },
          {
            name: '',
            field: 'goodsNum',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimatedPayment',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimatedOtherPayment',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimateFreight',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimateCustoms',
            class: 'w10p'
          },
          {
            name: '',
            field: 'taxCoefficient',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimateTax',
            class: 'w10p'
          },
          {
            name: '',
            field: 'estimateTotalAmount',
            class: 'w10p'
          },
          // {
          //   name: '',
          //   field: '',
          //   class: 'w10p'
          // }
        ]
      },

    };
  },
  components: {
    Table
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getReceiverList();
    this.getCarrierNameList();
    this.getGoodsTypeList();
    this.getPaymentConditionList();
    this.getCurrencyList();
    this.getTradeTariffList();
    this.getSupplierDictList();
  },
  activated() {

  },
  watch: {

  },
  computed: {
    
  },
  methods: {
    supplierNameChange(val, item) {
      // 供应商名称转换
      if (val) {
        let supplierData = this.supplierList.find(item => {
          return item.supplierName == val;
        });
        item.supplierSystemCode = supplierData.supplierId;
        invoiceNumberInfo(item.supplierSystemCode).then(res => {
        // invoiceNumberInfo('S0000164').then(res => {
          console.log('进口关税字段信息：', res);
          if (res.code === '0') {
            this.invoiceCodeList = res.data;
          }
        });
      }
    },
    receiverChange(val, item) {
      // 收款方转换
      if (val) {
        let receiverData = this.receiverList.find(item => {
          return item.dictItemName == val;
        });
        item.receiverCode = receiverData.dictItemValue;
      }
    },
    currencyChange(val, item) {
      // 币种转换
      if (val) {
        let currencyData = this.currencyList.find(item => {
          return item.name == val;
        });
        item.currencyCode = currencyData.index;
      }
    },
    paymentConditionSelect(val, item) {
      // 贸易条款转换
      if (val) {
        let paymentData = this.paymentConditionList.find(item => {
          return item.index == val;
        });
        item.paymentConditionCode = paymentData.index;
      }
    },
    carrierNameSelect(val, item) {
      // 承运商转换
      if (val) {
        let carrierNameData = this.carrierNameList.find(item => {
          return item.dictItemName == val;
        });
        item.carrierCode = carrierNameData.dictItemValue;
      }
    },
    goodsTypeNameSelect(val, item) {
      // 货物类型转换
      if (val) {
        let paymentConditionData = this.goodsTypeList.find(item => {
          return item.dictItemName == val;
        });
        item.goodsTypeCode = paymentConditionData.dictItemValue;
      }
    },
    invoiceCodeRemote(query) {
      console.log('query: ', query);
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          invoiceNumberInfo(this.editList.supplierSystemCode).then(res => {
          // invoiceNumberInfo('S0000164').then(res => {
            console.log('进口关税字段信息：', res);
            if (res.code === '0') {
              this.invoiceCodeList = res.data.filter(item => {
                return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
              });
            }
          });
        }, 500);
      } else {
        this.invoiceCodeList = [];
      }
    },
    invoiceCodeChange(val, index, item) {
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      if (val) {
        let data = editListCopy.tradeTariffItems[index];
        getCostInfo(val, editListCopy.supplierSystemCode).then(res => {
          console.log('查询金额值：', res);
          if (res.code === '0') {
            data.estimateFreight = res.data.freightPayment;
            data.estimatedPayment = res.data.goodsPayment;
            data.estimatedOtherPayment = res.data.incidentalPayment;
            data.estimateCustoms = res.data.tariffPayment;
            data.goodsNum = res.data.transferMeters;
            data.taxCoefficient = res.data.valueAddedTaxPayment;
            data.estimateTax = res.data.estimateTax;
            data.estimateTotalAmount = res.data.estimateTotalAmount;
            this.editList = editListCopy;
            this.$forceUpdate();
          }
        });
        this.totalEstimateChange(data.estimateTotalAmount);
      }

      // let itemCopy = JSON.parse(JSON.stringify(item));
      // if (val) {
      //   getCostInfo(val, this.editList.supplierSystemCode).then(res => {
      //     console.log('查询金额值：', res);
      //     if (res.code === '0') {
      //       itemCopy.estimateFreight = res.data.freightPayment;
      //       itemCopy.estimatedPayment = res.data.goodsPayment;
      //       itemCopy.estimatedOtherPayment = res.data.incidentalPayment;
      //       itemCopy.estimateCustoms = res.data.tariffPayment;
      //       itemCopy.goodsNum = res.data.transferMeters;
      //       itemCopy.taxCoefficient = res.data.valueAddedTaxPayment;
      //       itemCopy.estimateTax = res.data.estimateTax;
      //       itemCopy.estimateTotalAmount = res.data.estimateTotalAmount;
      //       item = itemCopy;
      //       this.$forceUpdate();
      //     }
      //   });
      //   this.totalEstimateChange(item.estimateTotalAmount);
      // }
    },
    totalEstimateChange(val) {
      // 合同预估关税总金额调整封装
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let result = null;
      if (editListCopy.tradeTariffItems.length > 1) {
        for (var i = 0; i < editListCopy.tradeTariffItems.length; i++) {
          let data = editListCopy.tradeTariffItems[i];
          let resData = parseInt(data.estimateTotalAmount);
          if (!data.estimateTotalAmount) {
            data.estimateTotalAmount = 0;
          }
          result += resData;
          editListCopy.totalEstimateCustomsAdjustment = result;
        }
      } else {
        editListCopy.totalEstimateCustomsAdjustment = val;
      }
      this.editList = editListCopy;
    },
    checkApprovalProcess(item) {
      approvalProcessInfo(item.uuid).then(res => {
        // console.log('审批流程：', res);
        if (res.code === '0') {
          let data = res.data[res.data.length - 1];
          if (data == undefined) {
            item.fullName = '';
            item.approvalTime = '';
            item.content = '';
          } else {
            item.fullName = data.fullName;
            item.approvalTime = data.approvalTime;
            item.content = data.content;
          }
          this.$forceUpdate();
        }
      });
    },
    // invoiceCodeBlur(e, item) {
    //   duplicateInvoiceCode(e.target.value).then(res => {
    //     if (res.code === '0') {
    //       if (!res.data) {
    //         item.invoiceCode = '';
    //         this.$message({
    //           type: 'error',
    //           message: '工厂发票号已存在，请重新输入!'
    //         });
    //       }
    //     }
    //   });
    // },
    inputValChange(val, item) {
      // 文本数据改变
      this.valUpdateHandle(item);
    },
    valUpdateHandle(item) {
      item.goodsNum = item.goodsNum ? parseFloat(item.goodsNum) : 0; //发货数量
      item.invoiceMoney = item.invoiceMoney ? parseFloat(item.invoiceMoney) : 0; //发票金额
      item.rmbRate = item.rmbRate ? parseFloat(item.rmbRate) : 0; //人民币汇率
      item.customsCoefficient = item.customsCoefficient ? parseFloat(item.customsCoefficient) : 0; //海关关税系数
      item.taxCoefficient = item.taxCoefficient ? parseFloat(item.taxCoefficient) : 0; //增值税系数
      item.customsTax = item.customsTax ? parseFloat(item.customsTax) : 0;  //关税增值税
      item.insuranceCoefficient = item.insuranceCoefficient ? parseFloat(item.insuranceCoefficient) : 0; //固定保险系数
      item.freightCoefficient = item.freightCoefficient ? parseFloat(item.freightCoefficient) : 0; //运费系数
      item.estimateFreight = item.estimateFreight ? parseFloat(item.estimateFreight) : 0; //预估运费
      item.estimateCustoms = item.estimateCustoms ? parseFloat(item.estimateCustoms) : 0; //预估关税
      item.estimateCustomsAdjustment = item.estimateCustomsAdjustment ? parseInt(item.estimateCustomsAdjustment) : 0;  //预估关税调整

      item.customsTax = parseFloat(((1 + item.customsCoefficient) * (1 + item.taxCoefficient) - 1).toFixed(5));  //关税增值税
      item.estimateFreight = parseFloat((item.goodsNum * item.freightCoefficient).toFixed(5)); //预估运费
      item.estimateCustoms = item.invoiceMoney * item.rmbRate * item.customsTax * item.insuranceCoefficient + item.estimateFreight; //预估关税
      item.estimateCustomsAdjustment = this.cTariffValTrans(item.estimateCustoms); //预估关税调整

      this.tariffAdjustmentHandle(item.estimateCustomsAdjustment);
    },
    tariffAdjustmentChange(val, item) {
      // 预估关税调整改变
      this.tariffAdjustmentHandle(val);
    },
    tariffAdjustmentHandle(val) {
      // 预估关税调整封装
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let result = null;
      if (editListCopy.tradeTariffItems.length > 1) {
        for (var i = 0; i < editListCopy.tradeTariffItems.length; i++) {
          let data = editListCopy.tradeTariffItems[i];
          let resData = parseInt(data.estimateCustomsAdjustment);
          if (!data.estimateCustomsAdjustment) {
            data.estimateCustomsAdjustment = 0;
          }
          result += resData;
          editListCopy.totalEstimateCustomsAdjustment = result;
        }
      } else {
        editListCopy.totalEstimateCustomsAdjustment = val;
      }
      this.editList = editListCopy;
    },
    cTariffValTrans(tariffVal) {
      // 预估关税调整值转换
      console.log('预估关税调整值转换：', tariffVal);
      let cTariffVal = JSON.parse(JSON.stringify(tariffVal));
      if ((cTariffVal + '').indexOf('.') !== -1) {
        let arr = cTariffVal.toString().split('.');
        if (arr[0].length >= 3) {
          let num = arr[0].substring(arr[0].length - 2);
          let cNum = arr[0].substring(arr[0].length - 2, arr[0].length - 3);
          if (num >= 50) {
            cNum = parseInt(cNum) + 1;
          }
          cTariffVal = parseInt(arr[0].substring(0, arr[0].length - 3) + cNum + '00');
        } else {
          cTariffVal = parseInt(tariffVal);
        }
      } else {
        cTariffVal = cTariffVal + '';
        if (cTariffVal.length >= 3) {
          let num = cTariffVal.substring(cTariffVal.length - 2);
          let cNum = cTariffVal.substring(cTariffVal.length - 2, cTariffVal.length - 3);
          if (num >= 50) {
            cNum = parseInt(cNum) + 1;
          }
          cTariffVal = parseInt(cTariffVal.substring(0, cTariffVal.length - 3) + cNum + '00');
        } else {
          cTariffVal = parseInt(tariffVal);
        }
      }
      return cTariffVal;
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
          return '审批通过';
          break;
        case 'Rejected':
          return '审批驳回';
          break;
        case 'Terminated':
          return '审批终止';
          break;
        default:
          break;
      }
    },
    deleteHandle(index, item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteTradeTariff(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getTradeTariffList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    editHandle(index, item) {
      // 编辑
      console.log('编辑项：', item);
      let result = null;
      let tariffVal = null;
      this.isShowEdit = true;
      this.editList = item;
      this.editList.receiver = '中商六通';
      this.editList.receiverCode = 'China Merchants six links';
      invoiceNumberInfo(item.supplierSystemCode).then(res => {
      // invoiceNumberInfo('S0000164').then(res => {
        console.log('进口关税字段信息：', res);
        if (res.code === '0') {
          this.invoiceCodeList = res.data;
        }
      });
    },
    submitHandle(index, item) {
      // 提交审批
      console.log(item);
      this.submitId = item.id;
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      submitTradeTariff(this.submitId).then(res => {
        // console.log('提交数据：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.applicationStatus = 'Approving';
          this.getTradeTariffList();
          this.activeName = 'Approving';
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
      });
    },
    async addHandle() {
      // 列表页添加
      this.isShowEdit = true;
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
      this.valAssignHandle(editDataCopy, editChildDataCopy);
      await purchasegetuuid().then(res => {
        console.log(res);
        if (res.code === '0') {
          editDataCopy.uuid = res.data;
        }
      });
      await purchasegetuuid().then(res => {
        console.log(res);
        if (res.code === '0') {
          editChildDataCopy.uuid = res.data;
          editChildDataCopy.customsCoefficient = 0.08; //海关关税系数
          editChildDataCopy.taxCoefficient = 0.13; //增值税系数
          editChildDataCopy.insuranceCoefficient = 1.003; //固定保险系数
          editChildDataCopy.freightCoefficient = 0.220; //运费系数
          editDataCopy.tradeTariffItems.push(editChildDataCopy);
        }
      });
      this.editList = editDataCopy;
      console.log('editList: ', this.editList);
    },
    addEditHandle() {
      // 原材料添加
      console.log('编辑页添加按钮：', this.editList);
      if (!this.editList.contractCode) {
        this.$message({
          type: 'error',
          message: '请输入合同号！'
        });
        return false;
      }
      if (!this.editList.supplierName) {
        this.$message({
          type: 'error',
          message: '请输入供应商名称！'
        });
        return false;
      }
      if (!this.editList.receiver) {
        this.$message({
          type: 'error',
          message: '请选择收款方！'
        });
        return false;
      }
      if (!this.editList.paymentCondition) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editList.carrierName) {
        this.$message({
          type: 'error',
          message: '请选择承运商！'
        });
        return false;
      }
      if (!this.editList.goodsTypeName) {
        this.$message({
          type: 'error',
          message: '请选择货物类型！'
        });
        return false;
      }
      if (this.editList.tradeTariffItems.length >= 10) {
        this.$message({
          type: 'error',
          message: '最多添加10条数据！'
        });
        return false;
      }
      this.totalEstimateChange(this.editList.tradeTariffItems[0].estimateTotalAmount);
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let editChildDataCopy = JSON.parse(JSON.stringify(this.editChildData));
      // this.valAssignHandle(editListCopy, editChildDataCopy);
      purchasegetuuid().then(res => {
        console.log(res);
        if (res.code === '0') {
          editChildDataCopy.uuid = res.data;
          editListCopy.tradeTariffItems.push(editChildDataCopy);
        }
      });
      this.editList = editListCopy;
      // this.totalEstimateChange(this.editList.tradeTariffItems[0].estimateTotalAmount);
      console.log('editList: ', this.editList);
    },
    async valAssignHandle(editListCopy, editChildDataCopy) {
      // 默认值赋值
      let result = null;
      let tariffVal = null;
      await queryTradeTariff('面料').then(res => {
        console.log('查询数据：', res);
        if (res.code === '0') {
          editChildDataCopy.goodsClass = res.data.goodsClass ? res.data.goodsClass : '面料';
          editChildDataCopy.rmbRate = res.data.rmbRate ? parseFloat(res.data.rmbRate) : 0; //人民币汇率
          editChildDataCopy.customsCoefficient = res.data.customsCoefficient ? parseFloat(res.data.customsCoefficient) : 0; //海关关税系数
          editChildDataCopy.taxCoefficient = res.data.taxCoefficient ? parseFloat(res.data.taxCoefficient) : 0; //增值税系数
          editChildDataCopy.insuranceCoefficient = res.data.insuranceCoefficient ? parseFloat(res.data.insuranceCoefficient) : 0; //固定保险系数
          editChildDataCopy.freightCoefficient = res.data.freightCoefficient ? parseFloat(res.data.freightCoefficient) : 0; //运费系数
          editChildDataCopy.goodsNum = editChildDataCopy.goodsNum ? parseFloat(editChildDataCopy.goodsNum) : 0; //发货数量
          editChildDataCopy.invoiceMoney = editChildDataCopy.invoiceMoney ? parseFloat(editChildDataCopy.invoiceMoney) : 0; //发票金额
          editChildDataCopy.customsTax = editChildDataCopy.customsTax ? parseFloat(editChildDataCopy.customsTax) : 0;  //关税增值税
          editChildDataCopy.estimateFreight = editChildDataCopy.estimateFreight ? parseFloat(editChildDataCopy.estimateFreight) : 0; //预估运费
          editChildDataCopy.estimateCustoms = editChildDataCopy.estimateCustoms ? parseFloat(editChildDataCopy.estimateCustoms) : 0; //预估关税
          editChildDataCopy.estimateCustomsAdjustment = editChildDataCopy.estimateCustomsAdjustment ? parseInt(editChildDataCopy.estimateCustomsAdjustment) : 0;  //预估关税调整

          editChildDataCopy.customsTax = parseFloat(((1 + editChildDataCopy.customsCoefficient) * (1 + editChildDataCopy.taxCoefficient) - 1).toFixed(5)); //关税增值税
          editChildDataCopy.estimateFreight = parseFloat((editChildDataCopy.goodsNum * editChildDataCopy.freightCoefficient).toFixed(5)); //预估运费
          editChildDataCopy.estimateCustoms = editChildDataCopy.invoiceMoney * editChildDataCopy.rmbRate * editChildDataCopy.customsTax * editChildDataCopy.insuranceCoefficient + editChildDataCopy.estimateFreight; //预估关税
          editChildDataCopy.estimateCustomsAdjustment = this.cTariffValTrans(editChildDataCopy.estimateCustoms); //预估关税调整
        }
      });
    },
    deleteEditItemHandle(index, item) {
      // console.log('删除子项：', index, item);
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      editListCopy.tradeTariffItems.splice(index, 1);
      this.editList = editListCopy;
      // this.tariffAdjustmentHandle(editListCopy.tradeTariffItems[0].estimateCustomsAdjustment);
      this.totalEstimateChange(editListCopy.tradeTariffItems[0].estimateTotalAmount);
    },
    cancelEditHandle() {
      this.isShowEdit = false;
    },
    async saveEditHandle() {
      // 保存编辑数据
      console.log('保存列表数据', this.editList);
      if (this.editList.actions) {
        delete this.editList.actions;
      }
      if (this.editList.isHideFew) {
        delete this.editList.isHideFew;
      }
      if (!this.editList.contractCode) {
        this.$message({
          type: 'error',
          message: '请输入合同号！'
        });
        return false;
      }
      if (!this.verificationHandle(this.editList.contractCode, '合同号', 255)) {
        return false;
      }
      if (!this.editList.supplierName) {
        this.$message({
          type: 'error',
          message: '请输入供应商名称！'
        });
        return false;
      }
      if (!this.verificationHandle(this.editList.supplierName, '供应商名称', 30)) {
        return false;
      }
      if (!this.editList.receiver) {
        this.$message({
          type: 'error',
          message: '请选择收款方！'
        });
        return false;
      }
      if (!this.editList.paymentCondition) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editList.carrierName) {
        this.$message({
          type: 'error',
          message: '请选择承运商！'
        });
        return false;
      }
      if (!this.editList.goodsTypeName) {
        this.$message({
          type: 'error',
          message: '请选择货物类型！'
        });
        return false;
      }
      // 校验
      for (var i = 0; i < this.editList.tradeTariffItems.length; i++) {
        let data = this.editList.tradeTariffItems[i];
        if (!data.goodsClass) {
          this.$message({
            type: 'error',
            message: '请输入报关品类！'
          });
          return false;
        }
        if (!this.verificationHandle(data.goodsClass, '报关品类', 10)) {
          return false;
        }
        if (!data.invoiceCode) {
          this.$message({
            type: 'error',
            message: '请输入工厂发票号！'
          });
          return false;
        }
        if (!this.verificationHandle(data.invoiceCode, '工厂发票号', 30)) {
          return false;
        }
      }
      this.editList.submitType = '1';
      this.editList.applicant = this.$store.state.userName;
      this.editList.applicantName = this.$store.state.realName;
      this.editList.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSaveDisabled = true;
      editTradeTariff(this.editList).then(res => {
        console.log('编辑保存：', res);
        if (res.code === '0') {
          this.getTradeTariffList();
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.isShowEdit = false;
        }
        this.isSaveDisabled = false;
      });
    },
    async submitEditHandle() {
      // 编辑数据提交审批
      if (this.editList.actions) {
        delete this.editList.actions;
      }
      if (this.editList.isHideFew) {
        delete this.editList.isHideFew;
      }
      if (!this.editList.contractCode) {
        this.$message({
          type: 'error',
          message: '请输入合同号！'
        });
        return false;
      }
      if (!this.verificationHandle(this.editList.contractCode, '合同号', 255)) {
        return false;
      }
      if (!this.editList.supplierName) {
        this.$message({
          type: 'error',
          message: '请输入供应商名称！'
        });
        return false;
      }
      if (!this.verificationHandle(this.editList.supplierName, '供应商名称', 30)) {
        return false;
      }
      if (!this.editList.receiver) {
        this.$message({
          type: 'error',
          message: '请选择收款方！'
        });
        return false;
      }
      if (!this.editList.paymentCondition) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editList.carrierName) {
        this.$message({
          type: 'error',
          message: '请选择承运商！'
        });
        return false;
      }
      if (!this.editList.goodsTypeName) {
        this.$message({
          type: 'error',
          message: '请选择货物类型！'
        });
        return false;
      }
      // 校验
      for (var i = 0; i < this.editList.tradeTariffItems.length; i++) {
        let data = this.editList.tradeTariffItems[i];
        if (!data.goodsClass) {
          this.$message({
            type: 'error',
            message: '请输入报关品类！'
          });
          return false;
        }
        if (!this.verificationHandle(data.goodsClass, '报关品类', 10)) {
          return false;
        }
        if (!data.invoiceCode) {
          this.$message({
            type: 'error',
            message: '请输入工厂发票号！'
          });
          return false;
        }
        if (!this.verificationHandle(data.invoiceCode, '工厂发票号', 30)) {
          return false;
        }
      }
      this.editList.submitType = '2';
      this.editList.applicant = this.$store.state.userName;
      this.editList.applicantName = this.$store.state.realName;
      this.editList.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      editTradeTariff(this.editList).then(res => {
        console.log('编辑保存：', res);
        if (res.code === '0') {
          this.applicationStatus = 'Approving';
          this.activeName = 'Approving';
          this.getTradeTariffList();
          this.$message({
            type: 'success',
            message: '提交成功！'
          });
          this.isShowEdit = false;
        }
        this.isSubmitDisabled = false;
      });
    },
    verificationHandle(val, name, intCount) {
      // 数量值校验
      if (val.toString().indexOf('+') !== -1) {
        this.$message({
          message: `${name}类型错误，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      if (val.toString().indexOf('e') !== -1) {
        this.$message({
          message: `${name}类型错误，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      if (val.toString().indexOf('.') !== -1) {
        let arr = val.toString().split('.');
        if (arr[0].length > intCount) {
          this.$message({
            message: `${name}仅支持整数位${intCount}位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
        if (arr[1].length > 5) {
          this.$message({
            message: `${name}仅支持小数位5位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
      } else if (val.toString().length > intCount) {
        this.$message({
          message: `${name}仅支持整数位${intCount}位，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    toNumberStr(num, digits) {
      // 正则匹配小数科学记数法
      if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(num)) {
          // 正则匹配小数点最末尾的0
          var temp=/^(\d{1,}(?:,\d{3})*\.(?:0*[1-9]+)?)(0*)?$/.exec(num.toFixed(digits)) ;
          if(temp){
              return temp[1];
          }else{
              return num.toFixed(digits)
          }
      }else{
          return ""+num
      }
    },
    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    },
    getFullNum(num) {
      //处理非数字
      if(isNaN(num)){return num};
      //处理不需要转换的数字
      var str = '' + num;
      if(!/e/i.test(str)){return num;};
      return (num).toFixed(18).replace(/.?0+$/, '');
    },

    dateValChange() {

    },
    searchHandle() {
      // 搜索
      this.tariffList = [];
      this.currentPage = 1;
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.getTradeTariffList();
    },
    switchTabHandle(tab) {
      // tab切换
      console.log('tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.tariffList = [];
      switch (tab.name) {
        case 'All':
          // 全部
          this.applicationStatus = '';
          this.getTradeTariffList();
          break;
        case 'Draft':
          // 草稿
          this.applicationStatus = 'Draft';
          this.getTradeTariffList();
          break;
        case 'Approving':
          // 审批中
          this.applicationStatus = 'Approving';
          this.getTradeTariffList();
          break;
        case 'Approved':
          // 已通过
          this.applicationStatus = 'Approved';
          this.getTradeTariffList();
          break;
        case 'Rejected':
          // 已驳回
          this.applicationStatus = 'Rejected';
          this.getTradeTariffList();
          break;
        case 'Terminated':
          // 已终止
          this.applicationStatus = 'Terminated';
          this.getTradeTariffList();
          break;
        default:
          this.applicationStatus = '';
          this.getTradeTariffList();
          break;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTradeTariffList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTradeTariffList();
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    getTradeTariffList() {
      // 进口关税列表
      let data = {
        contractCode: this.contractCode,
        supplierName: this.supplierName,
        applicationStatus: this.applicationStatus,
        invoiceCode: this.invoiceCode,
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      tradeTariffList(this.currentPage, this.pageSize, data).then(res => {
        console.log('进口关税列表：', res);
        if (res.code === '0') {
          this.tariffList = res.data.records;
          this.total = res.data.total;
          this.tariffList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = '空';
            }
          });
          for (var i = 0; i < this.tariffList.length; i++) {
            this.tariffList[i].status = this.tariffList[i].applicationStatus;
            switch (this.tariffList[i].applicationStatus) {
              case 'Draft':
                this.tariffList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Rejected':
                this.tariffList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              default:
                this.tariffList[i].actions = {};
                break;
            }
            for (var j = 0; j < this.tariffList[i].tradeTariffItems.length; j++) {
              let data = this.tariffList[i].tradeTariffItems[j];
              data.invoiceMoneyComdify = this.comdify(data.invoiceMoney);
            }
          }
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    comdify(val) {
      let inputVal = val ? (val + '') : '';
      let result = '';
      let index = 0;
      if (inputVal && inputVal.indexOf('.') !== -1) {
        let arr = inputVal.toString().split('.');
        let length = arr[0].length - 1;
        while(length >= 0) {
          index % 3 === 0 && index !== 0 ? result += ',' + arr[0][length] : result += arr[0][length]; 
          length--;
          index++;
        };
        result = result.split('').reverse().join('') + '.' + arr[1];
      } else {
        let length = inputVal.length - 1;
        while(length >= 0) {
          index % 3 === 0 && index !== 0 ? result += ',' + inputVal[length] : result += inputVal[length]; 
          length--; 
          index++;
        };
        result = result.split('').reverse().join('');
      }
      return result;
    },
    deleteComdify(val) {

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
    getReceiverList() {
      dictList('receiver').then(res => {
        console.log('收款方列表：', res);
        if (res.code === '0') {
          this.receiverList = res.data;
        }
      });
    },
    getCarrierNameList() {
      dictList('carrier').then(res => {
        console.log('承运商列表：', res);
        if (res.code === '0') {
          this.carrierNameList = res.data;
        }
      });
    },
    getGoodsTypeList() {
      dictList('goodsType').then(res => {
        console.log('货物类型列表：', res);
        if (res.code === '0') {
          this.goodsTypeList = res.data;
        }
      });
    },
    getPaymentConditionList() {
      constDictList('TradeTerms').then(res => {
        console.log('贸易条款列表数据：', res);
        if (res.code === '0') {
          this.paymentConditionList = res.data;
        }
      });


      // dictList('payment_condition').then(res => {
      //   console.log('贸易条款列表：', res);
      //   if (res.code === '0') {
      //     this.paymentConditionList = res.data;
      //   }
      // });
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

.importTariffs {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
  .subnav_wrap {
    overflow: auto;
    .childlist {
      width: 100%;
    }
    .allparentlist {
      width: 100%;
    }
    ul {
      &.childcontentlist {
        li {
          line-height: 40px;
        }
      }
    }
    .el-checkbox {
      white-space: nowrap;
    }
  }
  .edit_wrap {
    overflow: auto;
    .childlist {
      width: 100%;
    }
    .edit_parent_list {
      width: 100%;
      .edit_item {
        position: relative;
        border-bottom: 1px solid #EEEEEE;
      }
      .add_btn {
        position: absolute;
        bottom: 14px;
        right: 80px;
      }
      ul {
        &.childcontentlist {
          border-bottom: none;
        }
        li {
          line-height: 30px;
        }
      }
      .edit_btn_wrap {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
    .meters {
      width: 150px;
      height: 32px;
      line-height: 32px;
      text-align: left;
      vertical-align: top;
      .count {
        max-width: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .pagination_wrap {
    margin-top: 20px;
  }
}
.table_part {
  position: relative;
  ul {
    &.childcontentlist {
      height: 60px;
    }
  }
  .list_group {
    border-bottom: 1px solid #EEEEEE;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .empty_wrap {
    padding: 20px 0;
    text-align: center;
  }
}

.edit_part {
  .label {
    font-size: 14px;
    color: #303133;
  }
}

i.el-icon-view {
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


</style>
<style>
.importTariffs .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.importTariffs .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.importTariffs .subnav_wrap .el-tabs__content {
  overflow: visible;
}
.importTariffs .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.importTariffs .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.importTariffs .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
.edit_parent_list .el-input__inner {
  padding: 0 5px;
}
.edit_parent_list .el-date-editor .el-input__inner {
  padding: 0 15px;
}
</style>