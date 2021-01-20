<template>
	<div class="container downPaymentApply">
		<div class="part">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">采购订单编号：</span>
            <el-input class="input_single w200 mr10" v-model="purchaseOrderId" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <el-select class="select_single w200 mr10"
              @change="searchHandle"
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
          <div class="display_ib mr10 mb10" v-if="activeName !== 'Init'">
            <span class="tag">付款状态：</span>
            <el-select class="select_single w200 mr10"  @change="searchHandle" v-model="paidStatus" placeholder="请选择">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in paidStatusList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
              <span class="tag">创建日期：</span>
              <el-date-picker
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
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
            v-loading="tableLoading">
            <div v-if="activeName == 'Init'">
              <el-table
                class="table_list"
                ref="multipleTable"
                :data="orderList"
                row-key="id"
                :expand-row-keys="expands"
                @row-click="rowClick"
                border
                fit
                stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table
                      class="table_list"
                      :ref="'childMultipleTable_' + scope.row.id"
                      :data="scope.row.poiList"
                      border
                      fit>
                      <el-table-column fixed label="PO行号">
                        <template slot-scope="{ row }">
                          {{ row.purchaseOrderSn }}
                        </template>
                      </el-table-column>
                      <el-table-column fixed label="物料编号">
                        <template slot-scope="{ row }">
                          {{ row.materialCode }}
                        </template>
                      </el-table-column>
                      <el-table-column label="供应商">
                        <template slot-scope="{ row }">
                          <!-- {{ row.supplierName }} -->
                          {{ row.supplierShortName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购价格">
                        <template slot-scope="{ row }">
                          {{ row.offeredPrice }}
                        </template>
                      </el-table-column>
                      <el-table-column label="币种">
                        <template slot-scope="{ row }">
                          {{ row.currencyName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.offeredPackages ? row.offeredPackages : 0) + '包 ' + (row.offeredQuantityPerPackage ? row.offeredQuantityPerPackage : 0) + '米/包 ' + (row.offeredQuantity ? row.offeredQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.offeredQuantity ? row.offeredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="确认书号">
                        <template slot-scope="{ row }">
                          {{ row.confirmNumbers }}
                        </template>
                      </el-table-column>
                      <el-table-column label="确认书数量">
                        <template slot-scope="{ row }">
                          {{ (row.confirmQuantityTotal ? row.confirmQuantityTotal : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                        </template>
                      </el-table-column>
                      <el-table-column label="期望交期">
                        <template slot-scope="{ row }">
                          {{ row.requiredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="工厂交期">
                        <template slot-scope="{ row }">
                          {{ row.offeredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="备注">
                        <template slot-scope="{ row }">
                          {{ row.remark }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="订单编号">
                  <template slot-scope="{ row }">
                    {{ row.purchaseOrderId }}
                  </template>
                </el-table-column>
                <el-table-column label="采购订单类型">
                  <template slot-scope="{ row }">
                    {{ row.purchaseOrderTypeName }}
                  </template>
                </el-table-column>
                <el-table-column label="发起状态">
                  <template slot-scope="{ row }">
                    {{ row.payStatus }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">
                    {{ row.createTime }}
                  </template> 
                </el-table-column>
                <el-table-column label="申请人">
                  <template slot-scope="{ row }">
                    {{ row.applicantName }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row, $index }">
                    <div v-if="row.payStatus == '未发起'">
                      <el-button class="el-icon-bank-card" type="primary" circle size="mini" title="发起付款" @click.stop="payHandle($index, row)"></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              <!-- 首付款申请 -->
              <el-table
                class="table_list"
                ref="multipleTable"
                :data="paymentApplyList"
                 row-key="id"
                :expand-row-keys="expands"
                @row-click="rowClick"
                border
                fit
                stripe>
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table
                      class="table_list"
                      :ref="'childMultipleTable_' + scope.row.id"
                      :data="scope.row.poiList"
                      border
                      fit>
                      <el-table-column fixed label="PO行号">
                        <template slot-scope="{ row }">
                          {{ row.purchaseOrderSn }}
                        </template>
                      </el-table-column>
                      <el-table-column fixed label="订单编号">
                        <template slot-scope="{ row }">
                          {{ row.purchaseOrderId }}
                        </template>
                      </el-table-column>
                      <el-table-column fixed label="物料编号">
                        <template slot-scope="{ row }">
                          {{ row.materialCode }}
                        </template>
                      </el-table-column>
                      <el-table-column label="供应商">
                        <template slot-scope="{ row }">
                          {{ row.supplierShortName }}
                          <!-- {{ row.supplierName }} -->
                        </template>
                      </el-table-column>
                      <el-table-column label="采购价格">
                        <template slot-scope="{ row }">
                          {{ row.offeredPrice }}
                        </template>
                      </el-table-column>
                      <el-table-column label="币种">
                        <template slot-scope="{ row }">
                          {{ row.currencyName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.offeredPackages ? row.offeredPackages : 0) + '包 ' + (row.offeredQuantityPerPackage ? row.offeredQuantityPerPackage : 0) + '米/包 ' + (row.offeredQuantity ? row.offeredQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.offeredQuantity ? row.offeredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="确认书号">
                        <template slot-scope="{ row }">
                          {{ row.confirmNumbers }}
                        </template>
                      </el-table-column>
                      <el-table-column label="确认书数量">
                        <template slot-scope="{ row }">
                          {{ (row.confirmQuantityTotal ? row.confirmQuantityTotal : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                        </template>
                      </el-table-column>
                      <el-table-column label="期望交期">
                        <template slot-scope="{ row }">
                          {{ row.requiredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="工厂交期">
                        <template slot-scope="{ row }">
                          {{ row.offeredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="备注">
                        <template slot-scope="{ row }">
                          {{ row.remark }}
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="首付款单号">
                  <template slot-scope="{ row }">
                    {{ row.downPaymentCode }}
                  </template>
                </el-table-column>
                <el-table-column label="采购订单类型">
                  <template slot-scope="{ row }">
                    {{ row.purchaseOrderType }}
                  </template>
                </el-table-column>
                <el-table-column label="首付款比例">
                  <template slot-scope="{ row }">
                    {{ row.paymentRatioPercent }}
                  </template>
                </el-table-column>
                <el-table-column label="付款状态">
                  <template slot-scope="{ row }">
                    {{ row.paidStatusName }}
                  </template>
                </el-table-column>
                <el-table-column label="创建时间">
                  <template slot-scope="{ row }">
                    {{ row.poCreateTime }}
                  </template>
                </el-table-column>
                <el-table-column label="申请人">
                  <template slot-scope="{ row }">
                    {{ row.applicantName }}
                  </template>
                </el-table-column>
                <el-table-column label="审批">
                  <template slot-scope="{ row, $index }">
                    <el-popover
                      placement="right"
                      width="300"
                      trigger="hover"
                      @show="checkApprovalProcess(row, $index)">
                      <div>
                        <i class="block">
                          审批人：
                          <em>{{ row.fullName }}</em>
                        </i>
                        <i class="block mt10 mb10">
                          审批时间：
                          <em>{{ row.approvalTime }}</em>
                        </i>
                        <i class="block">
                          审批意见：
                          <em>{{ row.content }}</em>
                        </i>
                      </div>
                      <el-tag slot="reference" class="pointer" :type="row.auditStatus | statusFilter">{{ row.auditStatusName }}</el-tag>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row, $index }">
                    <div v-if="row.auditStatus == 'Draft' || row.auditStatus == 'Rejected'">
                      <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                      <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                      <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                    </div>
                    <div v-if="row.auditStatus == 'Terminated'">
                      <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="pagination_wrap fr">
          <el-pagination
            v-if="activeName == 'Init'"
            @size-change="iHandleSizeChange"
            @current-change="iHandleCurrentChange"
            :current-page.sync="iCurrentPage"
            :page-sizes="[10, 50]"
            :page-size="iPageSize"
            layout="sizes, total, prev, pager, next"
            :total="iTotal"
          ></el-pagination>
          <el-pagination
            v-else
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>

    </div>

    <!-- 弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <div class="edit_wrap">
          <div class="upload_wrap display_ib mr20">
            <p class="upload_tit display_ib v_top">上传形式发票</p>
            <el-upload
              class="upload-demo ml10 display_ib"
              :headers="headers"
              :action="uploadUrl + '/infrastructure/v1/attachments/upload'"
              multiple
              :before-upload="beforeUploadInvoiceList"
              :on-exceed="handleExceedInvoiceList"
              :on-success="handleSuccessInvoiceList"
              :on-remove="handleRemoveInvoiceList"
              :file-list="uploadInvoiceList"
              :data="{uuid: editData.uuid, type: '3'}"
              :show-file-list="true">
              <el-button size="small" type="primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">支持扩展名：doc、docx、pdf、jpg</div>
            </el-upload>
          </div>
          <div class="mt20">
            <div class="display_ib mr20 mb20">
              <span class="parameter">采购订单号：{{editData.purchaseOrderId}}</span>
            </div>
            <div class="display_ib mr20 mb20">
              <span class="parameter">供应商：{{editData.supplierShortName}}</span>
              <!-- <span class="parameter">供应商：{{editData.supplierName}}</span> -->
            </div>
            <div class="display_ib mr20 mb20">
              <span class="parameter"><span class="red mr5">*</span>首付款付款比例：</span>
              <el-input class="input_single w150 mr10" v-model.trim="editData.downPaymentOrPeriod" @blur="downPaymentOrPeriodBlur" @input.native="downPaymentOrPeriodInput" placeholder=""></el-input>%
            </div>
            <div class="display_ib mr20 mb20">
              <span class="parameter">形式发票号：</span>
              <el-input class="input_single w200" v-model.trim="editData.proformaInvoiceNumber" placeholder=""></el-input>
            </div>
            <div class="display_ib mr20 mb20">
              <el-checkbox class="parameter mr10" v-model="editData.whetherBalancePeriod">尾款账期</el-checkbox>
              <el-autocomplete
                v-if="editData.whetherBalancePeriod"
                class="input_single w200"
                v-model="editData.balancePeriod"
                :fetch-suggestions="periodQuerySearchAsync"
                placeholder="请输入内容"
                @select="balancePeriodSelect"
              ></el-autocomplete>
            </div>
            <div class="display_b">
              <span class="parameter v_top">备注：</span>
              <el-input
                class="remark"
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 8 }"
                placeholder=""
                v-model.trim="editData.remark"
                maxlength="64"
                show-word-limit>
              </el-input>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" v-preventReClick @click="dialogConfirmHandle">保存</el-button>
          <el-button type="primary" v-preventReClick @click="dialogSubmitHandle">提交审批</el-button>
        </div>
      </el-dialog>
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
import {
  purchaseOrderConfirmList,
  downPaymentList,
  addDownPayment,
  deleteDownPayment,
  submitDownPayment,
  initDownPayment,
  searchUploadFiles,
  deleteUploadFile,
  searchDownPayment
} from "@/api/module/purchaseApi.js";
import { getUUID, dictList, constDictList, supplierDictList ,approvalProcessInfo} from '@/api/publicApi.js';
import { timeFormat,getTimeRange} from "@/utils/index.js";
import { currencyTypeHandle ,statusTypeHandle} from '@/utils/public.js';
import Table from "@/layouts/components/common/Table.vue";
export default {
  name: "downPaymentApply",
  components: {
    Table
  },
  data() {
    return {
    	 // Tabble组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      
        // NEW TBALE
      selectUuidList: [],
      selectUuidOrderList: [],
      
      tableLoading: true,
      // New
      activeName: 'Init',
      iTotal: 0,
      iPageSize: 10, //每页显示条数
      iCurrentPage: 1, //页数
      total: 0,
      pageSize: 10, //首付款每页显示条数
      currentPage: 1, //首付款页数
      beginTime: '',
      endTime: '',
      cargoReadyBeginTime: '',
      cargoReadyEndTime: '',
      customerId: '',
      orderStatus: '3',
      auditStatus: '',
      purchaseOrderId: '',
      supplierName: '',
      supplierCode: '',
      paidStatus: '',
      createTime: '',
      dateVal:'',
      dateValGoodsDuly:'',
      purchaseOrderType: '',
      uuid: '',
      proformaInvoice: [],
      orderList: [],
      paymentApplyList: [],
      popupTitle: '',
      dialogFormVisible: false,
      headers: '',
      uploadUrl: process.env.VUE_APP_INFRASTRUCTURE_URL,
      uploadInvoiceList: [],
      editData: {},
      editDataCopy: {},
      editType: '',
      orderTypeList: [],
      supplierList: [],
      paidStatusList: [],
      periodList: [], //账期列表
      currencyList: [],
      expands: [],
      periodState: '',
      timeout: null,
      deleteId: '',
      submitId: '',
      deleteDialogVisible: false,
      submitDialogVisible: false,
      isSubmitDisabled: false,
      uploadFilePath: '',
      subNavList: [
        {
          label: '首付款发起',
          value: 'Init'
        },
        {
          label: '全部首付款申请',
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
      orderFieldsList: [
        {
          name: '物料编号',
          class: 'w8p'
        },
        {
          name: '供应商',
          class: 'w8p'
        },
        {
          name: '采购价格',
          class: 'w8p'
        },
        {
          name: '币种',
          class: 'w8p'
        },
        {
          name: '采购数量',
          class: 'w15p'
        },
        {
          name: '确认书号',
          class: 'w8p'
        },
        {
          name: '确认书数量',
          class: 'w15p'
        },
        {
          name: '期望交期',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '备注',
          class: 'w8p'
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '创建时间',
          class: 'w10p'
        },
        {
          name: '申请人',
          class: 'w6p'
        },
        {
          name: '订单编号',
          class: 'w15p'
        },
        {
          name: '订单类型',
          class: 'w10p'
        },
        {
          name: '发起状态',
          class: 'w8p'
        }
      ],
      parentOrderFieldsList: [  // Table父列表表头
        {
          name: '创建时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        },
        {
          name: '订单编号',
          class: 'w12p'
        },
        {
          name: '订单类型',
          class: 'w8p'
        },
        {
          name: '首付款比例',
          class: 'w4p'
        },
        {
          name: '付款状态',
          class: 'w4p'
        },
        {
          name: '审批',
          class: ''
        }
      ],
      orderParentData: {
        status: '',
        data: [
          {
            name: '',
            field: 'createTime',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '订单编号',
            field: 'purchaseOrderId',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '订单类型',
            field: 'purchaseOrderTypeName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '发起状态',
            field: 'payStatus',
            class: 'w8p',
            isShowTit: true
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
      orderChildData: {
        name: 'poiList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w8p'
          },
          {
            name: '',
            field: 'offeredPrice',
            class: 'w5p'
          },
          {
            name: '',
            field: 'currencyName',
            class: 'w8p'
          },
          {
            name: '',
            field_1: 'offeredPackages',
            field_2: 'offeredQuantityPerPackage',
            field_3: 'offeredQuantity',
            field: 'offeredQuantity',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w8p'
          },
          {
            name: '',
            field_1: 'confirmPackagesTotal',
            field_2: 'confirmQuantityPerPackage',
            field_3: 'confirmQuantityTotal',
            field: 'confirmQuantityTotal',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'offeredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'remarks',
            class: 'w8p'
          }
        ]
      },
      parentData: {
        status: '',
        data: [
          {
            name: '',
            field: 'poCreateTime',
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
            name: '订单编号',
            field: 'purchaseOrderId',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '订单类型',
            field: 'purchaseOrderType',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '首付款比例',
            field: 'paymentRatioPercent',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '付款状态',
            field: 'paidStatusName',
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
        name: 'poiList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w8p'
          },
          {
            name: '',
            field: 'offeredPrice',
            class: 'w8p'
          },
          {
            name: '',
            field: 'currencyName',
            class: 'w8p'
          },
          {
            name: '',
            field_1: 'offeredPackages',
            field_2: 'offeredQuantityPerPackage',
            field_3: 'offeredQuantity',
            field: 'offeredQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w8p'
          },
          {
            name: '确认书数量',
            // field_1: 'confirmPackagesTotal',
            // field_2: 'confirmQuantityPerPackage',
            // field_3: 'confirmQuantityTotal',
            field: 'confirmQuantityTotal',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'offeredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'remarks',
            class: 'w8p'
          }
        ]
      },
      
    }
  },
  created() {
    this.getCurrencyList();
    this.getSupplierDictList();
    this.getOrderTypeList();
    this.getPaidStatusList();
    this.getPeriodList();
    // this.getPurchaseOrderList();
    this.fun_date();
    // this.getDownPaymentList();
  },
  mounted() {
    this.headers = { Authorization: `Bearer ${this.$keycloak.token}` };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Draft: '',
        Approving: 'warning',
        Approved: 'success',
        Rejected: 'danger',
        Terminated: 'info',
      };
      return statusMap[status];
    }
  },
  watch: {
    orderList(list) {
      this.orderList = list;
    }
  },
  methods: {
    dateValChange(){
      console.log(this.dateVal)
    },
    rowClick(row, event, column){
      //单击事件
      console.log(row.id,event, column);
      Array.prototype.remove = function (val) {
        console.log(val)
          let index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      if (this.expands.indexOf(row.id) < 0) {
          this.expands.push(row.id);
      }else {
          this.expands.remove(row.id);
      }
    },
     //固定展示为两周前的时间范围
    fun_date(){
      this.dateVal=getTimeRange(-14);
      this.searchHandle();
    },
  	checkApprovalProcess(item, index) {
      approvalProcessInfo(item.uuid).then(res => {
        console.log('审批流程：', res);
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
          this.$set(this.paymentApplyList, index, item);
          this.$forceUpdate();
        }
      });
    },
    downPaymentOrPeriodInput({ target }) {
      target.value = target.value.replace(/[^0-9]/g, '');
    },
    // 尾款账期筛选
    periodQuerySearchAsync(queryString, cb) {
      var period = this.periodList;
      var results = queryString ? period.filter(this.createStateFilter(queryString)) : period;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (periodState) => {
        return (periodState.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    downPaymentOrPeriodBlur(val) {
      // console.log('首付款付款比例更改：', val);
      if (Number(val) > 100) {
        this.$message({
          type: 'error',
          message: '首付款付款比例不能大于100%！'
        });
      }
    },
    balancePeriodSelect(item) {
      console.log(item);
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    // 上传
    beforeUploadInvoiceList(file) {
      // console.log('上传发票文件：', file);
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      this.invoiceFileType = fileType;
      const isJPG = file.type === 'image/jpeg';
      const isDOC = fileType === 'doc';
      const isDOCX = fileType === 'docx';
      const isPDF = fileType === 'pdf';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isDOC && !isDOCX && !isPDF) {
        this.$message.error('上传发票文件只能是 DOC/DOCX/PDF/JPG/ 格式！');
      }
      if (isJPG || isDOC || isDOCX || isPDF) {
        isType = true;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传发票文件大小不能超过 2MB!');
      // }
      return isType;
    },
    handleExceedInvoiceList() {
      this.$message({
        message: '最大允许上传1个文件！',
        type: 'error'
      });
    },
    handleSuccessInvoiceList(response, file, fileList) {
      // console.log(response, file, fileList);
      if (response.code === '0') {
        this.proformaInvoice.push(response.data.id);
      }
    },
    handleRemoveInvoiceList(file, fileList) {
      // console.log('删除上传文件：', file, fileList);
      if (file.status == 'ready') {
        return false;
      }
      if (file.response) {
        deleteUploadFile(file.response.data.id).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '上传形式发票文件删除成功！'
            });
          }
        });
      } else {
        deleteUploadFile(file.id).then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: '上传形式发票文件删除成功！'
            });
          }
        });
      }
    },
    async dialogConfirmHandle() {
      // 保存
      let filePathList = [];
      let data = null;
      if (this.editType == 'create') {
        data = {
          applicant: this.$store.state.userName,
          applicantDepartment: this.$store.state.currentDepartment.id,
          applicantDepartmentName: this.$store.state.currentDepartment.name,
          applicantName: this.$store.state.realName,
          auditOption: this.editData.auditOption,
          auditPerson: this.editData.auditPerson,
          auditStatus: '',
          auditTime: '',
          deleteStatus: this.editData.poDeleteStatus,
          downPaymentCode: '',
          paidStatus: '',
          downPaymentOrPeriod: this.editData.downPaymentOrPeriod,
          proformaInvoiceNumber: this.editData.proformaInvoiceNumber,
          purchaseOrderId: this.editData.purchaseOrderId,
          remark: this.editData.remark,
          supplierCode: this.editData.supplierCode,
          supplierName: this.editData.supplierName,
          filePath: '',
          whetherBalancePeriod: this.editData.whetherBalancePeriod,
          balancePeriod: this.editData.balancePeriod,
          uuid: this.editData.uuid,
          submitType: ''
        };
        data.submitType = '1';
        await searchUploadFiles(data.uuid, '3').then(res => {
          console.log('上传文件列表：', res);
          if (res.code === '0' && res.data.length) {
            for (var i = 0; i < res.data.length; i++) {
              // filePathList.push(res.data[i].filepath);
              filePathList.push(res.data[i].id);
              this.uploadFilePath = filePathList.join('&');
            }
          }
        });
      } else {
        data = this.editData;
        await searchUploadFiles(data.uuid, '3').then(res => {
          console.log('上传文件列表：', res);
          if (res.code === '0' && res.data.length) {
            for (var i = 0; i < res.data.length; i++) {
              // filePathList.push(res.data[i].filepath);
              filePathList.push(res.data[i].id);
              this.uploadFilePath = filePathList.join('&');
            }
          }
        });
      }
      if (data.auditStatus == 'Draft') {
        data.submitType = '1';
      }
      if (data.auditStatus == 'Rejected') {
        data.submitType = '3';
      }
      data.filePath = this.uploadFilePath;
      // if (!data.filePath) {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传形式发票！'
      //   });
      //   return false;
      // }
      // return false;
      if (!data.downPaymentOrPeriod) {
        this.$message({
          type: 'error',
          message: '请输入首付款付款比例！'
        });
        return false;
      }
      if (!this.verificationHandle(data.downPaymentOrPeriod, '首付款付款比例', 64)) {
        return false;
      }
      if (Number(data.downPaymentOrPeriod) > 100) {
        this.$message({
          type: 'error',
          message: '首付款付款比例不能大于100%！'
        });
        return false;
      }
      // if (!data.proformaInvoiceNumber) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入形式发票号！'
      //   });
      //   return false;
      // }
      if (!this.verificationHandle(data.proformaInvoiceNumber, '形式发票号', 64)) {
        return false;
      }
      if (!this.verificationHandle(data.remark, '备注', 64)) {
        return false;
      }
      console.log(data)
      addDownPayment(data).then(res => {
        // console.log('新增首付款申请：', res);
        if (res.code === '0') {
          this.dialogFormVisible = false;
          if (this.editType == 'create') {
            this.getPurchaseOrderList();
          } else {
            this.getDownPaymentList();
          }
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
        }
      });
    },
    async dialogSubmitHandle() {
      // 提交审批
      let filePathList = [];
      let data = null;
      if (this.editType == 'create') {
        data = {
          applicant: this.$store.state.userName,
          applicantDepartment: this.$store.state.currentDepartment.id,
          applicantDepartmentName: this.$store.state.currentDepartment.name,
          applicantName: this.$store.state.realName,
          auditOption: this.editData.auditOption,
          auditPerson: this.editData.auditPerson,
          auditStatus: '',
          auditTime: '',
          deleteStatus: this.editData.poDeleteStatus,
          downPaymentCode: '',
          paidStatus: '',
          downPaymentOrPeriod: this.editData.downPaymentOrPeriod,
          proformaInvoiceNumber: this.editData.proformaInvoiceNumber,
          purchaseOrderId: this.editData.purchaseOrderId,
          remark: this.editData.remark,
          supplierCode: this.editData.supplierCode,
          supplierName: this.editData.supplierName,
          filePath: '',
          whetherBalancePeriod: this.editData.whetherBalancePeriod,
          balancePeriod: this.editData.balancePeriod,
          uuid: this.editData.uuid,
          submitType: ''
        };
        data.submitType = '2';
        await searchUploadFiles(data.uuid, '3').then(res => {
          console.log('上传文件列表：', res);
          if (res.code === '0' && res.data.length) {
            for (var i = 0; i < res.data.length; i++) {
              filePathList.push(res.data[i].filepath);
              this.uploadFilePath = filePathList.join('&');
            }
          }
        });
      } else {
        data = this.editData;
        if (data.auditStatus == 'Draft') {
          data.submitType = '2';
        }
        if (data.auditStatus == 'Rejected') {
          data.submitType = '4';
        }
        data.auditStatus = 'Approving';
        await searchUploadFiles(data.uuid, '3').then(res => {
          console.log('上传文件列表：', res);
          if (res.code === '0' && res.data.length) {
            for (var i = 0; i < res.data.length; i++) {
              filePathList.push(res.data[i].filepath);
              this.uploadFilePath = filePathList.join('&');
            }
          }
        });
      }
      
      // await searchUploadFiles(this.editData.uuid, '3').then(res => {
      //   // console.log('上传文件列表：', res);
      //   if (res.code === '0' && res.data.length) {
      //     for (var i = 0; i < res.data.length; i++) {
      //       filePathList.push(res.data[i].filepath);
      //       data.filePath = filePathList.join('&');
      //     }
      //   }
      // });
      data.filePath = this.uploadFilePath;
      // if (!data.filePath) {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传形式发票！'
      //   });
      //   return false;
      // }
      if (!data.downPaymentOrPeriod) {
        this.$message({
          type: 'error',
          message: '请输入首付款付款比例！'
        });
        return false;
      }
      if (!this.verificationHandle(data.downPaymentOrPeriod, '首付款付款比例', 64)) {
        return false;
      }
      if (Number(data.downPaymentOrPeriod) > 100) {
        this.$message({
          type: 'error',
          message: '首付款付款比例不能大于100%！'
        });
        return false;
      }
      // if (!data.proformaInvoiceNumber) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入形式发票号！'
      //   });
      //   return false;
      // }
      if (!this.verificationHandle(data.proformaInvoiceNumber, '形式发票号', 64)) {
        return false;
      }
      if (!this.verificationHandle(data.remark, '备注', 64)) {
        return false;
      }
      this.isSubmitDisabled = true;
      addDownPayment(data).then(res => {
        if (res.code === '0') {
          this.dialogFormVisible = false;
          this.auditStatus = 'Approving';
          this.activeName = 'Approving';
          this.getDownPaymentList();
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
        this.isSubmitDisabled = false;
      });
    },
    verificationHandle(val, name, intCount) {
      // 数量值校验
      if ((val + '').indexOf('.') !== -1) {
        let arr = (val + '').split('.');
        if (arr[0].length > intCount) {
          this.$message({
            message: `${name}仅支持整数位${intCount}位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
        if (arr[1].length > 2) {
          this.$message({
            message: `${name}仅支持小数位2位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
      } else if ((val + '').length > intCount) {
        this.$message({
          message: `${name}仅支持整数位${intCount}位，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    deleteHandle(index, item) {
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteDownPayment(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getDownPaymentList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    submitHandle(index, item) {
      this.submitId = item.id;
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      submitDownPayment(this.submitId).then(res => {
        // console.log('提交数据：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.auditStatus = 'Approving';
          this.getDownPaymentList();
          this.activeName = 'Approving';
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
      });
    },
    async payHandle(index, item) {
      this.uploadInvoiceList = [];
      this.popupTitle = '付款申请';
      this.dialogFormVisible = true;
      this.editType = 'create';
      await getUUID().then(res => {
        if (res.code === '0') {
          item.uuid = res.data;
        }
      });
      if (item.downPaymentOrPeriod && item.downPaymentOrPeriod.indexOf('%') != -1) {
        item.downPaymentOrPeriod = item.downPaymentOrPeriod.substring(0, item.downPaymentOrPeriod.length - 1);
      }
      this.editData = JSON.parse(JSON.stringify(item));
      // this.editDataCopy = item;
      this.getUploadFiles(this.editData.uuid, '3');
    },
    async editHandle(index, item) {
      await this.getDownPaymentById(item.id);
      this.uploadInvoiceList = [];
      this.popupTitle = '付款申请';
      this.dialogFormVisible = true;
      this.editType = 'edit';
      // this.editData = JSON.parse(JSON.stringify(item));
      // this.editDataCopy = JSON.parse(JSON.stringify(item));
      this.getUploadFiles(this.editData.uuid, '3');
    },
    getDownPaymentById(id) {
      searchDownPayment(id).then(res => {
        if (res.code === '0') {
          this.editData = res.data;
        }
      });
    },
    getUploadFiles(uuid, type) {
      searchUploadFiles(uuid, type).then(res => {
        console.log('上传文件列表：', res);
        if (res.code === '0' && res.data.length) {
          let invoiceData = {};
          for (var i = 0; i < res.data.length; i++) {
            invoiceData.id = res.data[i].id;
            invoiceData.name = res.data[i].realname;
            invoiceData.url = process.env.VUE_APP_SCM_IMG_URL + res.data[i].filepath;
            this.uploadInvoiceList.push(invoiceData);
            invoiceData = {};
          }
          this.uploadFilePath = this.uploadInvoiceList.join('&');
        }
      });
    },
    prStarusHandle(item){
    	// console.log(item)
//  	item.purchaseOrderId
    	initDownPayment(item).then(payRes => {
              if (payRes.code === '0') {
//            	let msg=payRes.data;
//            	return msg;
                // console.log(payRes.data)
                return payRes.data;
//            	 this.$nextTick(() => {
//	                item.payStatus = payRes.data;
//	                this.$forceUpdate();
//	             });
	          }
          });
    },
    searchHandle() {
      // 搜索
      console.log('--工厂交期--',this.dateVal,'--货妥时间--',this.dateValGoodsDuly);
      this.currentPage = 1;
      this.orderList = [];
      this.paymentApplyList = [];
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      switch (this.activeName) {
        case 'Init':
          this.orderStatus = 3;
          this.getPurchaseOrderList();
          break;
        default:
          this.getDownPaymentList();
          break;
      }
    },
    switchTabHandle(tab) {
      // tab切换
      this.tableLoading = true;
      this.iCurrentPage = 1;
      this.iTotal = 0;
      this.currentPage = 1;
      this.total = 0;
      this.orderList = [];
      this.paymentApplyList = [];
      switch (tab.name) {
        case 'Init':
          // 首付款发起
          this.orderStatus = 3;
          this.getPurchaseOrderList();
          break;
        case '':
          // 全部
          this.auditStatus = '';
          this.getDownPaymentList();
          break;
        case 'Draft':
          // 草稿
          this.auditStatus = 'Draft';
          this.getDownPaymentList();
          break;
        case 'Approving':
          // 审批中
          this.auditStatus = 'Approving';
          this.getDownPaymentList();
          break;
        case 'Approved':
          // 已通过
          this.auditStatus = 'Approved';
          this.getDownPaymentList();
          break;
        case 'Rejected':
          // 已驳回
          this.auditStatus = 'Rejected';
          this.getDownPaymentList();
          break;
        case 'Terminated':
          // 已终止
          this.auditStatus = 'Terminated';
          this.getDownPaymentList();
          break;
        default:
          this.auditStatus = '';
          break;
      }
    },
    iHandleSizeChange(val) {
      this.iPageSize = val;
      this.getPurchaseOrderList();
    },
    iHandleCurrentChange(val) {
      console.log('首付款发起当前页：', val);
      this.iCurrentPage = val;
      this.getPurchaseOrderList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDownPaymentList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDownPaymentList();
    },
    getPurchaseOrderList() {
      // 采购请求列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        customerId: this.customerId,
        orderStatus: this.orderStatus,
        purchaseOrderId: this.purchaseOrderId,
        uuid: this.uuid,
        sort: 'desc',
        purchaseOrderType: this.purchaseOrderType,
        // supplierName: this.supplierName,
        supplierCode: this.supplierCode,
        paymentMethod: 'downPayment'
      };
      purchaseOrderConfirmList(this.iCurrentPage, this.iPageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code === '0') {
          this.orderList = res.data.records;
          this.iTotal = res.data.total;
          this.orderList.forEach((item, index) => {
            // item.actions = {
            //   hasPayment: true
            // };
            initDownPayment(item.purchaseOrderId).then(payRes => {
              console.log('是否发起信息：', payRes);
              if (payRes.code === '0') {
                this.$nextTick(() => {
                  item.payStatus = payRes.data;
                  this.$set(this.orderList, index, item);
                });
              }
            });
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            let orderTypeData = this.orderTypeList.find(otItem => {
              return otItem.index == item.purchaseOrderType;
            });
            if (orderTypeData) {
              item.purchaseOrderTypeName = orderTypeData.name;
            }
          });
          this.$forceUpdate();
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    getDownPaymentList() {
      // 首付款申请列表
      let data = {
        beginTime:this.beginTime,
        endTime: this.endTime,
        paidStatus: this.paidStatus,
        purchaseOrderId: this.purchaseOrderId,
        // supplierName: this.supplierName,
        supplierCode: this.supplierCode,
        auditStatus: this.auditStatus
      };
      downPaymentList(this.currentPage, this.pageSize, data).then(res => {
        console.log('首付款申请列表：', res);
        if (res.code === '0') {
          this.paymentApplyList = res.data.records;
          this.total = res.data.total;
          for (var i = 0; i < this.paymentApplyList.length; i++) {
            let paymentData = this.paymentApplyList[i];
            paymentData.status = paymentData.auditStatus;
            paymentData.statusName= statusTypeHandle(paymentData.status);
            paymentData.auditStatusName = statusTypeHandle(paymentData.auditStatus);
            switch (paymentData.auditStatus) {
              case 'Draft':
                paymentData.actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Rejected':
                paymentData.actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Terminated':
                paymentData.actions = {
                  hasDelete: true
                };
                break;
              default:
                paymentData.actions = {};
                break;
            }
            if (paymentData.poCreateTime) {
              paymentData.poCreateTime = timeFormat(paymentData.poCreateTime);
            } else {
              paymentData.poCreateTime = '空';
            }
            // paymentData.currencyName = paymentData.currency ? currencyTypeHandle(paymentData.currency) : '';
            if (paymentData.downPaymentOrPeriod && paymentData.downPaymentOrPeriod.indexOf('%') == -1) {
              paymentData.paymentRatioPercent = paymentData.downPaymentOrPeriod + '%';
            }
            // 币种类型转换
            let currencyData = this.currencyList.find(item => {
              return paymentData.currency == item.index;
            });
            if (currencyData) {
              paymentData.currencyName = currencyData.name;
            } else {
              paymentData.currencyName = '';
            }
            // 订单类型转换
            let orderTypeData = this.orderTypeList.find(item => {
              return paymentData.purchaseOrderType == item.index;
            });
            if (orderTypeData) {
              paymentData.purchaseOrderType = orderTypeData.name;
            }
            // 付款状态转换
            let paidStatusData = this.paidStatusList.find(item => {
              return paymentData.paidStatus == item.index;
            });
            if (paidStatusData) {
              paymentData.paidStatusName = paidStatusData.name;
            } else {
              paymentData.paidStatusName = '';
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
    getOrderTypeList() {
      // 订单类型列表
      constDictList('PurchaseOrderType').then(res => {
        // console.log('订单类型列表：', res);
        if (res.code === '0') {
          this.orderTypeList = res.data;
        }
      });
    },
    getPaidStatusList() {
      // 付款状态列表
      constDictList('PaidStatus').then(res => {
        // console.log('付款状态列表：', res);
        if (res.code === '0') {
          this.paidStatusList = res.data;
        }
      });
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    getPeriodList() {
      dictList('period').then(res => {
        // console.log('账期列表：', res);
        if (res.code === '0') {
          this.periodList = res.data;
          for (var i = 0; i< this.periodList.length; i++) {
            this.periodList[i].value = this.periodList[i].dictItemName;
          }
        }
      });
    },
    getCurrencyList() {
      constDictList('Currency').then(res => {
        // console.log('币种列表：', res);
        if (res.code === '0') {
          this.currencyList = res.data;
        }
      });
    },

  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.edit_wrap {
  .parameter {
    font-size: 14px;
    color: #303133;
    font-weight: bold;
  }
  .remark {
    max-width: 800px;
  }
  .upload_wrap {
    width: 100%;
    &>div {
      min-width: 60%;
    }
  }
}

.table_part {
  .allparentlist {
    .childlist {
      width: 98%;
      margin-left: 2%;
    }
    .childcontentlist {
      width: 98%;
      margin-left: 2%;
    }
  }

  .parent_header_wrap {
    li {
      padding: 12px 10px;
    }
  }
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
}

.img_pay {
  height: 20px;
}

</style>
<style>
.downPaymentApply .table_part .el-tabs .el-tab-pane {
  min-height: 536px;
}

</style>