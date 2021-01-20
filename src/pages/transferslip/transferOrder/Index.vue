<template>
  <div class="transferOrder container">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="inline_block mr10 mb10">
            <span class="tag">调拨类型：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="allocationType"
              placeholder="请选择"
              @change="searchHandle">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in transferTypeList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">调拨单编号：</span>
            <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="请输入"></el-input>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">供应商：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="supplierCode"
              filterable
              placeholder="请选择"
              @change="searchHandle">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">出库仓位：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="virtualInventoryId"
              placeholder="请选择"
              @change="virtualInventoryChange">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in warehouseList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">出库库位：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="subInventory"
              placeholder="请选择"
              @change="searchHandle">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in outSubInventoryList"
                :key="item.subInventory"
                :label="item.subInventoryName"
                :value="item.subInventory"
              ></el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">入库仓位：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="inputInventoryId"
              placeholder="请选择"
              @change="inputInventoryChange">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in warehouseList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">入库库位：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="inputSubInventory"
              placeholder="请选择"
              @change="searchHandle">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in inSubInventoryList"
                :key="item.subInventory"
                :label="item.subInventoryName"
                :value="item.subInventory"
              ></el-option>
            </el-select>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">期望交期：</span>
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
          <el-button type="primary" @click="excelDownload">导出Excel</el-button>
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
        <el-tabs class="subnav_wrap hidden" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
            v-loading="tableLoading">
            <!-- <Table
              :tableList="transferList"
              :parentData="parentData"
              :childData="childData"
              :tableFieldsList="fieldsList"
              :tableParentFieldsList="parentFieldsList"
              :tableLoading="tableLoading"
              @editHandle="editHandle"
              @submitHandle="submitHandle"
              @deleteHandle="deleteHandle"
              @revokeHandle="revokeHandle">
            </Table> -->

            <!-- <el-table
              class="table_list"
              ref="multipleTable"
              :data="transferList"
              border
              fit
              stripe
              @expand-change="expandChange"
              @select="selectHandle"
              @select-all="selectAllHandle"> -->
            <el-table
              class="table_list"
              ref="multipleTable"
              :data="transferList"
              row-key="id"
              :expand-row-keys="expands"
              @row-click="rowClick"
              border
              fit
              stripe>
              <!-- <el-table-column type="selection" /> -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    :data="scope.row.faItemList"
                    border
                    fit
                    @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                    @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }"> -->
                  <div class="actions_wrap mb20 clearfix">
                    <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                    <el-button v-if="scope.row.allocationStatus == 'Draft' || scope.row.allocationStatus == 'Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                  </div>
                  <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    :data="scope.row.faItemList"
                    border
                    fit>
                    <!-- <el-table-column fixed type="selection" /> -->
                    <el-table-column fixed label="行号">
                      <template slot-scope="{ row }">
                        {{ row.lineNum }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed label="物料编号">
                      <template slot-scope="{ row }">
                        {{ row.materialCode }}
                      </template>
                    </el-table-column>
                    <el-table-column label="产品编号">
                      <template slot-scope="{ row }">
                        {{ row.productCode }}
                      </template>
                    </el-table-column>
                     <el-table-column label="销售订单编号">
                      <template slot-scope="{ row }">
                        {{ row.saleOrderId }}
                      </template>
                    </el-table-column>
                    <el-table-column label="确认书号">
                      <template slot-scope="{ row }">
                        {{ row.confirmNumbers }}
                      </template>
                    </el-table-column>
                    <el-table-column label="调拨数量">
                      <template slot-scope="{ row }">
                        <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.allocationPackages ? row.allocationPackages : 0) + '包 ' + (row.allocationQuantityPerPackage ? row.allocationQuantityPerPackage : 0) + '米/包 ' + (row.allocationQuantity ? row.allocationQuantity : 0) + '米' }}</span>
                        <span v-else>{{ (row.allocationQuantity ? row.allocationQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="出库仓位">
                      <template slot-scope="{ row }">
                        {{ row.virtualInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="出库库位">
                      <template slot-scope="{ row }">
                        {{ row.subInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="入库仓位">
                      <template slot-scope="{ row }">
                        {{ row.inputInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="入库库位">
                      <template slot-scope="{ row }">
                        {{ row.inputSubInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="已入库数">
                      <template slot-scope="{ row }">
                        {{ row.receivedQuantity }}
                      </template>
                    </el-table-column>
                    <el-table-column label="期望交期">
                      <template slot-scope="{ row }">
                        {{ row.validDate }}
                      </template>
                    </el-table-column>
                    <el-table-column label="付款方式">
                      <template slot-scope="{ row }">
                        {{ row.paymentMethodName }}
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
              <el-table-column label="调拨单编号">
                <template slot-scope="{ row }">
                  {{ row.factoryAllocationCode }}
                </template>
              </el-table-column>
              <el-table-column label="调拨类型">
                <template slot-scope="{ row }">
                  {{ row.allocationTypeName }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="销售订单编号">
                <template slot-scope="{ row }">
                  <span v-if="row.isCustomerOrderType">{{ row.saleOrderId }}</span>
                  <span v-else></span>
                </template>
              </el-table-column> -->
              <el-table-column label="客户名称">
                <template slot-scope="{ row }">
                  <span v-if="row.isCustomerOrderType">{{ row.customerName }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="供应商">
                <template slot-scope="{ row }">
                  {{ row.supplierShortName }}
                </template>
              </el-table-column>
              <el-table-column label="预计到货日期">
                <template slot-scope="{ row }">
                  {{ row.expectedArrivalDate }}
                </template>
              </el-table-column>
              <el-table-column label="发运方式">
                <template slot-scope="{ row }">
                  <span v-if="row.isFactoryTransferType">{{ row.deliveryTypeName }}</span>
                  <span v-else></span>
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
                    <el-tag slot="reference" class="pointer" :type="row.allocationStatus | statusFilter">{{ row.allocationStatusName }}</el-tag>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <div v-if="row.allocationStatus == 'Draft' || row.allocationStatus == 'Rejected'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row,'edit')"></el-button>
                    <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                    <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                  </div>
                  <div v-if="row.allocationStatus == 'Approved'">
                    <el-button class="el-icon-document-delete" type="danger" circle size="mini" title="撤销" :disabled="row.cancelled" @click.stop="revokeHandle($index, row)"></el-button>
                    <el-button class="el-icon-connection" type="warning" circle size="mini" title="裂变"  :disabled="row.cancelled" @click.stop="editHandle($index, row,'fission')"></el-button>
                  </div>
                  <div v-if="row.allocationStatus == 'Terminated'">
                    <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>

          </el-tab-pane>
        </el-tabs>

        <div class="pagination_wrap fr">
          <el-pagination
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

    <!-- 编辑 -->
    <div class="edit_part" v-loading="editPartLoading" v-else>
      <div class="clearfix mb10">
        <div class="inline_block mr10 mb10">
          <span class="tag"><span class="red mr5">*</span>调拨类型：</span>
          <el-select class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model="editData.allocationType"
            @change="allocationTypeChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in transferTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="inline_block mr10 mb10" v-if="isCustomerOrder">
          <span class="tag"><span class="red mr5">*</span>销售订单编号：</span>
          <el-input class="input_single w200 mr10 mb10" :disabled="!isEmptyData" v-model.trim="editData.saleOrderId" placeholder="请输入"></el-input>
        </div>
        <el-button
          class="mr10 mb10"
          size="small"
          type="primary"
          icon="el-icon-refresh-right"
          circle
          title="拉取数据"
          :disabled="!isEmptyData || isDisabledPull"
          @click="pullDataHandle"
        ></el-button>
        <div class="inline_block mr10" v-if="isCustomerOrder">
          <span class="tag">客户名称：</span>
          <span class="tag">{{editData.customerName}}</span>
        </div>
        <div class="inline_block mr10 mb10">
          <span class="tag"><span class="red mr5">*</span>供应商：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="editData.supplierId"
            filterable
            :disabled="isDisabledSupplier"
            @change="supplierChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierCode"
              :value="item.supplierId">
            </el-option>
          </el-select>
        </div>
        <div class="inline_block mr10 mb10">
          <span class="tag"><span class="red mr5">*</span>预计到货日期：</span>
          <el-date-picker
            v-model.trim="editData.expectedArrivalDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          ></el-date-picker>
        </div>
        <div class="inline_block mr10 mb10" v-if="isFactoryAllocation">
          <span class="tag">发运方式：</span>
          <el-select class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model="editData.deliveryType"
            @change="deliveryTypeChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in deliveryTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <a class="link inline_block lh36 fr ml10" type="primary" @click="exportExcelTemplate">调拨导入模板</a>
        <el-button
          :disabled="fissionstatus"
          class="fr"
          size="small"
          type="primary"
          icon="el-icon-plus"
          circle
          title="添加"
          @click="addEditHandle"
        ></el-button>
      </div>
     <div v-if="!fissionstatus">
      <upload-excel-component  class="mb20" :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />
    </div>
      <div class="hidden">
        <!-- 编辑组件 -->
        <editDoubleTable
          :tableList="editData.faItemList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          :disabledbo="fissionstatus"
          @inputChange="inputChange"
          @inputBlur="inputBlur"
          @selectChange="selectChange"
          @selectVisibleChange="selectVisibleChange"
          @unitNumberInputChange="unitNumberInputChange"
          @deleteChlidHandle="deleteEditItemHandle"
          @addHandle="addEditItemHandle">
        </editDoubleTable>

        <div class="edit_btn_wrap mt20 fr">
          <el-button @click.stop="cancelEditHandle">取消</el-button>
          <el-button type="primary" v-preventReClick @click.stop="updateEditHandle('save')">保存</el-button>
          <el-button v-if="!fissionstatus" type="primary" v-preventReClick @click.stop="updateEditHandle('submit')">提交审批</el-button>
        </div>

      </div>
      
    </div>

    <!-- 对话框 -->
    <Dialog v-if="dialogVisible" :dialogDesc="dialogDesc" :dialogVisible="dialogVisible" @dialogConfirmHandle="dialogConfirmHandle" @dialogCancelHandle="dialogCancelHandle"></Dialog>

  </div>
</template>

<script>
import {
  getUUID,
  dictList,
  constDictList,
  supplierDictList,
  subInventoryTypeList,
  getProductCodeByMC,
  getSupplierByMC,
  getMeasurementUnitByMC,
  existMaterialCode,
  approvalProcessInfo
} from "@/api/publicApi.js";
import {
  transferOrderList,
  deleteTransferOrder,
  submitTransferOrder,
  revokeTransferOrder,
  searchTransferOrder,
  getConfirmNumbersByMC,
  getAllocationQuantityByCN,
  pullCustomerOrder,
  pullCustomerOrderRequest,
  getTPQuantityByInventory,
  updateTransferOrder,
  subInventoryRollsList,
  factoryAvailableInventory,
  cuneAvailableInventory,
  searchTransferPlanQuantity,
  batchQuery,
  getPaidMeterByCN,
  getPaymentMethodByCN
} from "@/api/module/transferOrderApi.js";
import { deliveryTypeHandle, statusTypeHandle } from '@/utils/public.js';
import { getNowDate, timeFormat, excelDateFormatToDate, getTimeRange} from "@/utils/index.js";
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
import Dialog from "@/layouts/components/common/Dialog.vue";
export default {
  name: "transferOrder",
  data() {
    return {
      tableLoading: true,
      isShowEdit: false,  // 是否显示编辑页
      activeName: 'All',
      pageSize: 10,  //每页显示条数
      currentPage: 1,  //页数
      total: 0,
      transferList: [],
      supplierList: [],
      expands:[],
      fissionstatus:false,
      deliveryTypeList: [
        {
          index: '1',
          name: '空运'
        },
        {
          index: '5',
          name: '海运'
        }
      ],

      // 搜索字段
      transferType: '',
      materialCode: '',
      allocationStatus: '',
      factoryAllocationCode: '',
      supplierCode: '',
      allocationType: '',
      startTime: '',
      endTime: '',
      virtualInventoryId: '',
      subInventory: '',
      inputInventoryId: '',
      inputSubInventory: '',
      dateVal: '',  // 期望交期
      transferTypeList: [],  // 调拨类型列表
      warehouseList: [],  // 仓位列表
      outSubInventoryList: [],  // 出库库位列表
      inSubInventoryList: [],  // 入库库位列表

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      selectUuidList: [],

      // 对话框
      dialogVisible: false,  // 对话框是否可见
      dialogDesc: '',
      submitId: '',
      deleteId: '',
      revokeId: '',
      revokeCode: '',

      // 编辑数据
      editData: {},
      editPartLoading: false,
      isEmptyData: true,
      isDisabledPull: false,
      isCustomerOrder: false,
      isDisabledSupplier: false,
      isFactoryAllocation: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,

      // Tab列表
      subNavList: [
        {
          label: '全部调拨单',
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
        // {
        //   label: '已终止',
        //   value: 'Terminated'
        // }
      ],
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
            name: '调拨单编号',
            field: 'factoryAllocationCode',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '调拨类型',
            field: 'allocationTypeName',
            class: 'w6p',
            isShowTit: true
          },
          {
            name: '销售订单编号',
            field: 'saleOrderId',
            class: 'w12p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '客户名称',
            field: 'customerName',
            class: 'w6p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '预计到货日期',
            field: 'expectedArrivalDate',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '发运方式',
            field: 'deliveryTypeName',
            class: 'w5p',
            isShowTit: true,
            isFilterField: true
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
        name: 'faItemList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w13p'
          },
          {
            name: '',
            field: 'productCode',
            class: 'w13p'
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w13p'
          },
          {
            name: '调拨数量',
            field_1: 'allocationPackages',
            field_2: 'allocationQuantityPerPackage',
            field_3: 'allocationQuantity',
            field: 'allocationQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'virtualInventoryName',
            class: 'w13p'
          },
          {
            name: '',
            field: 'subInventoryName',
            class: 'w13p'
          },
          {
            name: '',
            field: 'inputInventoryName',
            class: 'w13p'
          },
          {
            name: '',
            field: 'inputSubInventoryName',
            class: 'w13p'
          },
          {
            name: '',
            field: 'receivedQuantity',
            class: 'w13p'
          },
          {
            name: '',
            field: 'validDate',
            class: 'w13p'
          },
          {
            name: '',
            field: 'remark',
            class: 'w13p'
          },
          {
            name: '',
            field: '',
            class: 'w10p pr',
            isAction: true
          }
        ]
      },
      fieldsList: [
        {
          name: '物料编号',
          class: 'w13p'
        },
        {
          name: '产品编号',
          class: 'w13p'
        },
        {
          name: '确认书号',
          class: 'w13p'
        },
        {
          name: '调拨数量',
          class: 'w15p'
        },
        {
          name: '出库仓位',
          class: 'w13p'
        },
        {
          name: '出库库位',
          class: 'w13p'
        },
        {
          name: '入库仓位',
          class: 'w13p'
        },
        {
          name: '入库库位',
          class: 'w13p'
        },
        {
          name: '已入库数',
          class: 'w13p'
        },
        {
          name: '期望交期',
          class: 'w13p'
        },
        {
          name: '备注',
          class: 'w13p'
        },
        {
          name: '',
          class: 'w10p'
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '调拨单编号',
          class: 'w12p'
        },
        {
          name: '调拨类型',
          class: 'w6p'
        },
        {
          name: '销售订单编号',
          class: 'w12p'
        },
        {
          name: '客户名称',
          class: 'w6p'
        },
        {
          name: '预计到货日期',
          class: 'w8p'
        },
        {
          name: '发运方式',
          class: 'w5p'
        },
        {
          name: '创建时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        },
        {
          name: '审批',
          class: ''
        }
      ],

      // 编辑组件数据
      editFieldsList: [
        {
          name: '产品编号',
          field: 'productCode',
          class: 'w16p',
          width: '150',
          isRules: true,
          isSingleField: true,
          chlidListName: 'allocationList'
        },
        {
          name: '供应商',
          // field: 'supplierName',
          field: 'supplierShortName',
          class: 'w16p',
          width: '150',
          isSingleField: true
        },
        {
          name: '销售订单编号',
          field: 'saleOrderId',
          class: 'w16p',
          width: '150',
          isSingleField: true
        },
        {
          name: '* 出库仓位',
          field: 'virtualInventoryId',
          class: 'w18p',
          width: '150',
          isRules: true,
          isSingleField: true
        },
        {
          name: '* 出库库位',
          field: 'subInventoryName',
          class: 'w18p',
          width: '150',
          isRules: true,
          isSingleField: true
        },
        {
          name: '* 入库仓位',
          field: 'inputInventoryId',
          class: 'w18p',
          width: '150',
          isRules: true,
          isSingleField: true
        },
        {
          name: '* 入库库位',
          field: 'inputSubInventoryName',
          class: 'w18p',
          width: '150',
          isRules: true,
          isSingleField: true
        },
        {
          name: '* 期望交期',
          field: 'validDate',
          class: 'w16p',
          width: '180',
          isRules: true,
          isSingleField: true
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w16p',
          width: '150',
          isSingleField: true
        },
        {
          name: '建议调拨数量（周）',
          field: 'transferPlanQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '180',
          isSingleField: true,
          isQuantityField: true
        },
        {
          name: '* 调出库可用库存',
          field: 'availableInventory',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150',
          isRules: true,
          isSingleField: true,
          isQuantityField: true
        },
        {
          name: '* 确认书号',
          field: 'confirmNumbers',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '确认书可用数量',
          field: 'confirmAvailableQuantity',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '* 调拨数量',
          field_1: 'allocationPackages',
          field_2: 'allocationQuantityPerPackage',
          field_3: 'allocationQuantity',
          field: 'allocationQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '400',
          isRules: true
        },
        {
          name: '付款方式',
          field: 'paymentMethodName',
          class: 'w16p',
          width: '150'
        }
      ],
      leaderFieldsList: [
        {
          name: '行号',
          field: 'lineNum',
          class: 'w10p',
          width: '50'
        },
        {
          name: '* 物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '180',
          isRules: true,
          isSingleField: true
        }
      ],
      tailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          isAction: true,
          isChlidAction: true,
          hasAdd: true,
          // hasChildAdd: true,
          hasChildDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        lineNum: true,
        productCode: true,
        supplierName: true,
        supplierShortName: true,
        transferPlanQuantity: true,
        availableInventory: true,
        confirmAvailableQuantity: true,
        paymentMethodName: true
      },
      inputSet: {
        materialCode: {
          maxlength: '',
          placeholder: ''
        },
        saleOrderId: {
          maxlength: '',
          placeholder: ''
        },
        remark: {
          maxlength: '',
          placeholder: ''
        },
        saleOrderId: {
          maxlength: '',
          placeholder: ''
        }
      },
      selectSet: {
        virtualInventoryId: {
          selectListName: 'warehouseList',
          value: 'index',
          label: 'name'
        },
        subInventoryName: {
          selectListName: 'subInventoryList',
          value: 'subInventory',
          label: 'subInventoryName'
        },
        inputInventoryId: {
          selectListName: 'warehouseList',
          value: 'index',
          label: 'name'
        },
        inputSubInventoryName: {
          selectListName: 'inputSubInventoryList',
          value: 'subInventory',
          label: 'subInventoryName'
        },
        confirmNumbers: {
          selectListName: 'confirmNumberList',
          value: '',
          label: ''
        },
        allocationQuantityPerPackage: {
          selectListName: 'packSpecificationList',
          value: '',
          label: ''
        }
      },
      numberInputSet: {},
      datePickerSet: {
        validDate: true
      },
      unitSet: {
        allocationPackages: {
          type: 'select'
        }
      },
      // editData: {
      //   uuid: '',
      //   allocationType: '',
      //   allocationTypeName: '',
      //   supplierName: '',
      //   supplierCode: '',
      //   supplierId: '',
      //   saleOrderId: '',
      //   customerName: '',
      //   expectedArrivalDate: '',
      //   deliveryType: '',
      //   submitType: '',
      //   applicant: this.$store.state.userName,
      //   applicantName: this.$store.state.realName,
      //   applicantDepartment: this.$store.state.currentDepartment.id,
      //   applicantDepartmentName: this.$store.state.currentDepartment.name,
      //   faItemList: [],
      // },
      addItemData: {
        uuid: '',
        productCode: '',
        supplierName: '',
        supplierCode: '',
        supplierId: '',
        saleOrderId:'',
        allocationPackages: 0,
        allocationQuantityPerPackage: 0,
        allocationQuantity: 0,
        transferPlanQuantity: '',  // 建议调拨数量
        availableInventory: '',  // 调出库可用库存
        confirmNumbers: '',
        virtualInventoryId: 'B0',
        virtualInventoryName: '零剪仓',
        subInventory: 'B001',
        subInventoryName: '零剪仓工厂库',
        inputInventoryId: '',
        inputInventoryName: '',
        inputSubInventory: '',
        inputSubInventoryName: '',
        validDate: '',
        remark: '',
        purchaseMeasurementUnit: '米',
        warehouseList: this.warehouseList,
        subInventoryList: [],
        allocationList: [],

        // subInventoryList: [],
        // stockupCodeList: [],
        // inputSubInventoryList: [],
        // purchasetagtype: this.purchasetagtype,
      },
      addChildData: {
        allocationPackages: 0,
        allocationQuantity: 0,
        allocationQuantityPerPackage: 0,
        confirmNumbers: '',
        confirmNumberList: [],
        confirmAvailableQuantity: '0',
        materialCode: '',
        purchaseMeasurementUnit: '米',
        paymentMethod: '',
        paymentMethodName: '',
        uuid: ''
      },

      childHeaderList: ['调拨单编号', '行号', '物料编号', '产品编号', '确认书号', '调拨数量', '出库仓位', '出库库位', '入库仓位', '入库库位', '已入库数', '期望交期', '备注'],
      childFieldsList: ['factoryAllocationCode', 'lineNum', 'materialCode', 'productCode', 'confirmNumbers', 'allocationQuantity', 'virtualInventoryName', 'subInventoryName', 'inputInventoryName', 'inputSubInventoryName', 'receivedQuantity', 'validDate', 'remark'],

    };
  },
  components: {
    Table,
    editDoubleTable,
    Dialog,
    UploadExcelComponent
  },
  created() {
    this.supplierListHandle();
  },
  mounted() {
    // this.getTransferOrderList();
    this.transferTypeListHandle();
    this.warehouseListHandle();
    this.fun_date();
    if (this.$store.state.TOEditShow) {
      // 调拨计划携带编辑数据
      this.editData = {};
      this.editType = 'add';
      this.isEmptyData = true;
      this.isDisabledPull = true;
      this.isDisabledSupplier = true;
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let list = this.$store.state.planToTOList;
      getUUID().then(res => {
        if (res.code === '0') {
          editDataCopy.uuid = res.data;
        }
      });
      // this.getUUIDHandle(editDataCopy);
      editDataCopy.faItemList = list;
      editDataCopy.supplierName = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierName : '';
      editDataCopy.supplierId = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierId : '';
      editDataCopy.supplierCode = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierId : '';
      for (var i = 0; i < editDataCopy.faItemList.length; i++) {
        let data = editDataCopy.faItemList[i];
        getUUID().then(res => {
          if (res.code === '0') {
            data.uuid = res.data;
          }
        });
        // this.getUUIDHandle(data);
        data.supplierCode = data.supplierId;
        data.transferPlanQuantity = data.adviceQuantity;
        data.warehouseList = this.warehouseList;
        this.updateEditModeSet('add', data);
        this.allocationInfoHandle(data);
      }
      this.editData = editDataCopy;
      this.isShowEdit = true;
      this.$store.commit('getTOEditShow');
      this.$forceUpdate();
    }
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
  computed: {},
  watch: {},
  methods: {
    rowClick(row, event, column){
      //单击事件
      console.log(row,event, column);
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
    excelDownload() {
      let headerList = [];
      let fieldsList = ['factoryAllocationCode', 'allocationTypeName', 'saleOrderId', 'customerName', 'expectedArrivalDate', 'deliveryTypeName', 'createTime', 'applicantName', 'allocationStatusName'];
      this.parentFieldsList.forEach(hItem => {
        headerList.push(hItem.name);
      });
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.transferList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '调拨',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.faItemList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.factoryAllocationCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // 固定展示为两周后的时间范围
    fun_date(){
      this.dateVal=getTimeRange(14);
      this.searchHandle();
    },
    exportExcelTemplate() {
      // 导出Excel模板
      const headerList = ['物料编号', '产品编号', '供应商', '销售订单编号', '出库仓位', '出库库位', '入库仓位', '入库库位', '期望交期', '备注', '建议调拨数量（周）', '调出库可用库存', '确认书号', '调拨数量包数', '调拨数量规格', '调拨数量'];
      const data = [['VME4-586.801/2', 'VME4-586.801/2', 'SVBC', 'SO2020102700004', '零剪仓', '零剪仓工厂库', '零剪仓', 'B库(零剪库)', '2020-10-15', '测试导入', '200', '300', '111', '1', '100', '100']];
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headerList, //Header Required
          data, //Specific data Required
          filename: '调拨单导入模板', //Optional
          autoWidth: true, //Optional
          bookType: 'xlsx' //Optional
        })
      });
    },
    // Upload Excel Edit
    importExcelBeforeUpload(file) {
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      const isXLSX = fileType === 'xlsx';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message({
          message: '请不要上传大于1M的文件！',
          type: 'error'
        });
        return false;
      };
      if (!isXLSX) {
        this.$message.error('仅支持上传.xlsx后缀文件！');
      }
      if (isXLSX) {
        this.editPartLoading = true;
        isType = true;
      }
      return isType;
    },
    async importExcelSuccess({ results, header }) {
      console.log('导入数据：', results, header);
      if (!this.editData.allocationType) {
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        this.editPartLoading = false;
        return false;
      }
      if (this.isCustomerOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售订单编号！'
          });
          this.editPartLoading = false;
          return false;
        }
      }
      if (!this.editData.supplierId) {
        this.$message({
          type: 'error',
          message: '请选择供应商！'
        });
        this.editPartLoading = false;
        return false;
      }
      
      if (results && results.length) {
        this.editPartLoading = true;
        let editData = {};
        if (this.isEmptyData) {
          // 新增
          editData = {
            allocationType: '',
            allocationTypeName: '',
            supplierName: '',
            supplierCode: '',
            supplierId: '',
            saleOrderId: '',
            customerName: '',
            expectedArrivalDate: '',
            deliveryType: '',
            submitType: '',
            applicant: this.$store.state.userName,
            applicantName: this.$store.state.realName,
            applicantDepartment: this.$store.state.currentDepartment.id,
            applicantDepartmentName: this.$store.state.currentDepartment.name,
            faItemList: []
          };
          editData = Object.assign(editData, this.editData);
          await getUUID().then(res => {
            if (res.code === '0') {
              editData.uuid = res.data;
            }
          });
          this.updateEditModeSet('add', editData);
          this.isEmptyData = false;
        } else {
          editData = JSON.parse(JSON.stringify(this.editData));  // 父项数据
          editData.faItemList = [];
        }

        let allocationTypeArr = editData.allocationTypeName.split('-');  // 调拨类型
        
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));  // 子项数据
          let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));  // 三层数据
          await getUUID().then(res => {
            if (res.code === '0') {
              addItemDataCopy.uuid = res.data;
            }
          });
          await getUUID().then(res => {
            if (res.code === '0') {
              addChildDataCopy.uuid = res.data;
            }
          });
          addItemDataCopy.warehouseList = this.warehouseList;
          this.updateEditModeSet('add', addItemDataCopy);
          this.updateEditModeSet('add', addChildDataCopy);
          
          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '物料编号') {
              addItemDataCopy.materialCode = item[key];
              addChildDataCopy.materialCode = item[key];
            } else if (key === '产品编号') {
              addItemDataCopy.productCode = item[key];
            } else if (key === '供应商') {
              let supplierData = this.supplierList.find(sItem => {
                return sItem.supplierName === item[key];
              });
              addItemDataCopy.supplierName = item[key];
              addItemDataCopy.supplierId = supplierData ? supplierData.supplierId : '';
              addItemDataCopy.supplierCode = supplierData ? supplierData.supplierId : '';
            } else if (key === '销售订单编号') {
              addItemDataCopy.saleOrderId = item[key];
            } else if (key === '出库仓位') {
              let warehouseData = this.warehouseList.find(wItem => {
                return wItem.name === item[key];
              });
              addItemDataCopy.virtualInventoryName = item[key];
              addItemDataCopy.virtualInventoryId = warehouseData ? warehouseData.index : '';
            } else if (key === '出库库位') {
              addItemDataCopy.subInventoryName = item[key];
            } else if (key === '入库仓位') {
              let warehouseData = this.warehouseList.find(wItem => {
                return wItem.name === item[key];
              });
              addItemDataCopy.inputInventoryName = item[key];
              addItemDataCopy.inputInventoryId = warehouseData ? warehouseData.index : '';
            } else if (key === '入库库位') {
              addItemDataCopy.inputSubInventoryName = item[key];
            } else if (key === '期望交期') {
              addItemDataCopy.validDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key === '备注') {
              addItemDataCopy.remark = item[key];
            } else if (key === '建议调拨数量（周）') {
              addItemDataCopy.transferPlanQuantity = item[key];
            } else if (key === '调出库可用库存') {
              addItemDataCopy.availableInventory = item[key];
            } else if (key === '确认书号') {
              addChildDataCopy.confirmNumbers = item[key];
            } else if (key === '调拨数量包数') {
              addChildDataCopy.allocationPackages = item[key];
            } else if (key === '调拨数量规格') {
              addChildDataCopy.allocationQuantityPerPackage = item[key];
            } else if (key === '调拨数量') {
              addChildDataCopy.allocationQuantity = item[key];
            }
          });
          this.confirmNumbersByMCHandle(addChildDataCopy, addItemDataCopy.virtualInventoryId);
          addItemDataCopy.allocationList.push(addChildDataCopy);
          editData.faItemList.push(addItemDataCopy);
        }

        for (let m = 0; m < editData.faItemList.length; m++) {
          let item = editData.faItemList[m];
          if (!item.materialCode || !item.virtualInventoryName || !item.subInventoryName || !item.inputInventoryName || !item.inputSubInventoryName || !item.validDate) {
            this.$message({
              message: '请完善Excel数据后导入！',
              type: 'error'
            });
            editData.faItemList = [];
            this.editPartLoading = false;
            return false;
          }

          // 批量查询
          let businessTypeList = [];
          let materialCodes = [item.materialCode];
          switch(item.inputInventoryId) {
            case 'A0':
              businessTypeList.push('Group');
              break;
            case 'B0':
              businessTypeList.push('Retail');
              break;
            case 'C0':
              businessTypeList.push('Suits');
              break;
            case 'D0':
              businessTypeList.push('Agency');
              break;
            default:
              break;
          }
          let batchParams = {
            businessTypeList: businessTypeList,
            materialCodes: materialCodes
          };
          await batchQuery(batchParams).then(res => {
            console.log('批量更改信息：', res);
            if (res.code === '0') {
              let batchData = [res.data];
              batchData.map((batchItem, batchIndex) => {
                for (let key in batchItem) {
                  if (key == item.materialCode) {
                    if (!batchItem[key]) {
                      item.productCode = '';
                      item.supplierId = '';
                      item.supplierCode = '';
                      item.supplierName = '';
                      item.supplierShortName = '';
                      this.$message({
                        type: 'error',
                        message: '该物料编号下无产品编号！'
                      });
                      return false;
                    }
                    if (batchItem[key].supplierId !== this.editData.supplierId) {
                      this.$message({
                        message: '供应商不一致，请重新导入！',
                        type: 'error'
                      });
                      editData.faItemList = [];
                      this.editPartLoading = false;
                      return false;
                    }
                    let pcArr = [];
                    for (let i = 0; i < batchItem[key].productCode.length; i++) {
                      pcArr.push(batchItem[key].productCode[i].productCode);
                    }
                    item.productCode = pcArr.join(',');
                    item.productCodeList = batchItem[key].productCode;
                    item.supplierId = batchItem[key].supplierId;
                    item.supplierCode = batchItem[key].supplierId;
                    item.supplierName = batchItem[key].supplierName;
                    item.supplierShortName = batchItem[key].supplierShortName;
                    item.purchaseMeasurementUnit = batchItem[key].purchaseMeasurementUnit;
                    this.$forceUpdate();
                  }
                }
              });

            }
          });

          item.subInventoryList = [];
          if (allocationTypeArr[1] == '工厂调拨') {
            // 出库库位列表
            await subInventoryTypeList(item.virtualInventoryId).then(res => {
              if (res.code === '0' && res.data) {
                for (var i = 0; i < res.data.length; i++) {
                  let data = res.data[i];
                  if (data.subInventoryName.indexOf('工厂库') != -1) {
                    item.subInventoryList.push(data);
                  }
                }
                let subInventoryData = item.subInventoryList.find(siItem => {
                  return siItem.subInventoryName == item.subInventoryName;
                });
                item.subInventory = subInventoryData ? subInventoryData.subInventory : '';
                this.$forceUpdate();
              }
            });
            
            // 入库库位列表
            await subInventoryTypeList(item.inputInventoryId).then(res => {
              if (res.code === '0') {
                item.inputSubInventoryList = res.data;
                let inputSubInventoryData = item.inputSubInventoryList.find(isiItem => {
                  return isiItem.subInventoryName == item.inputSubInventoryName;
                });
                item.inputSubInventory = inputSubInventoryData ? inputSubInventoryData.subInventory : '';
                this.$forceUpdate();
              }
            });

            // 调出库可用库存
            let params = {
              materialCode: item.materialCode,
              inventory: item.virtualInventoryId,
              subInventory: item.subInventory,
              allocationType: editData.allocationType
            };
            await factoryAvailableInventory(params).then(res => {
              if (res.code === '0') {
                item.availableInventory = res.data;
              }
            });
          } else {
            // 出库库位列表
            await subInventoryRollsList(item.virtualInventoryId).then(res => {
              if (res.code === '0') {
                item.subInventoryList = res.data;
                let subInventoryData = item.subInventoryList.find(siItem => {
                  return siItem.subInventoryName == item.subInventoryName;
                });
                item.subInventory = subInventoryData ? subInventoryData.subInventory : '';
                this.$forceUpdate();
              }
            });

            // 入库库位列表
            await subInventoryRollsList(item.inputInventoryId).then(res => {
              console.log('入库库位列表：', res);
              if (res.code === '0') {
                item.inputSubInventoryList = res.data;
                let inputSubInventoryData = item.inputSubInventoryList.find(isiItem => {
                  return isiItem.subInventoryName == item.inputSubInventoryName;
                });
                item.inputSubInventory = inputSubInventoryData ? inputSubInventoryData.subInventory : '';
              }
            });
            
            if (allocationTypeArr[1] == '集团调拨') {
              // 调出库可用库存
              let params = {
                materialCode: item.materialCode,
                inventory: item.virtualInventoryId,
                subInventory: item.subInventory,
                allocationType: editData.allocationType
              };
              await factoryAvailableInventory(params).then(res => {
                if (res.code === '0') {
                  item.availableInventory = res.data;
                }
              });
            } else if (allocationTypeArr[1] == '库内调拨') {
              // 调出库可用库存
              let params = {
                materialCode: item.materialCode,
                inventory: item.virtualInventoryId,
                subInventory: item.subInventory
              };
              await cuneAvailableInventory(params).then(res => {
                // 调出库可用库存
                if (res.code === '0') {
                  item.availableInventory = res.data;
                  this.$forceUpdate();
                }
              });
            }
          }
          
          if (item.allocationList || item.allocationList.length) {
            for (let n = 0; n < item.allocationList.length; n++) {
              let cItem = item.allocationList[n];
              this.getPaidMeterHandle(cItem, item, n, m);
              // 计量单位
              this.getMeasurementUnit(cItem);
              // this.getAllocationQuantityHandle(cItem, item, n, m);
              // 根据确认书号查询调拨数量
              getAllocationQuantityByCN(cItem.materialCode, cItem.confirmNumbers, cItem.allocationQuantityPerPackage).then(res => {
                console.log('根据确认书号查询调拨数量：', res);
                if (res.code === '0') {
                  // item.allocationPackages = res.data.allocationPackages;
                  // cItem.allocationQuantity = res.data.allocationQuantity;
                  item.allocationQuantityPerPackage = res.data.allocationQuantityPerPackage;
                  this.$set(this.editData.faItemList[m].allocationList, n, cItem);
                }
              });
              this.getPaymentMethodHandle(cItem, item, n, m);
            }
          }
          
        }
        this.editData = editData;
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },
    // 物料编号批量查询产品编号、供应商和计量单位
    // async getBatchOrderDataByMC(item){
    //   let _item = item;
    //   let businessTypeList = [];
    //   let materialCodes = [_item.materialCode];
    //   switch(_item.inputInventoryId) {
    //     case 'A0':
    //       businessTypeList.push('Group');
    //       break;
    //     case 'B0':
    //       businessTypeList.push('Retail');
    //       break;
    //     case 'C0':
    //       businessTypeList.push('Suits');
    //       break;
    //     case 'D0':
    //       businessTypeList.push('Agency');
    //       break;
    //     default:
    //       break;
    //   }
    //   let params = {
    //     businessTypeList: businessTypeList,
    //     materialCodes: materialCodes
    //   };
    //   await batchQuery(params).then(res => {
    //     console.log('批量更改信息：', res);
    //     if (res.code === '0') {
    //       let data = [res.data];
    //       data.map((bItem, bIndex) => {
    //         for (let key in bItem) {
    //           if (key == _item.materialCode) {
    //             if (!bItem[key]) {
    //               _item.supplierId = '';
    //               _item.productCode = '';
    //               _item.supplierName = '';
    //               this.$message({
    //                 type: 'error',
    //                 message: '该物料编号下无产品编号、供应商信息！'
    //               });
    //               return false;
    //             }
    //             let pcArr = [];
    //             for (let i = 0; i < bItem[key].productCode.length; i++) {
    //               pcArr.push(bItem[key].productCode[i].productCode);
    //             }
    //             _item.productCode = pcArr.join(',');
    //             _item.productCodeList = bItem[key].productCode;
    //             this.$forceUpdate();
    //           }
    //         }
    //       });
    //     }
    //   });
    // },
    selectAllHandle(selection) {
      // 父项全选事件
      console.log('触发全选事件：', selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      this.multipleSelection = selection;
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
          for (let j = 0; j < item.faItemList.length; j++) {
            let cItem = item.faItemList[j];
            this.childMultipleSelection.push(cItem);
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
        for (let i = 0; i < this.transferList.length; i++) {
          let item = this.transferList[i];
          for (let j = 0; j < item.faItemList.length; j++) {
            let cItem = item.faItemList[j];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, false);
              }
            });
          }
        }
      }
    },
    expandChange(row, rowList) {
      console.log('树形展开项：', row, rowList);
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.faItemList.length; i++) {
          let cItem = row.faItemList[i];
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id].length) {
              this.$refs['childMultipleTable_' + row.id][0].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    selectHandle(selection, row) {
      // console.log('当用户手动勾选数据行的 Checkbox 时触发事件：', selection, row);
      let _this = this;
      let _row = row;
      this.selectUuidList = [];
      this.multipleSelection = selection;
      if (selection && selection.length) {
        // await this.$nextTick();
        for (var i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
        }
        if (this.selectUuidList.indexOf(_row.uuid) > -1) {
          // 当前项选中状态
          for (let i = 0; i < _row.faItemList.length; i++) {
            let cItem = _row.faItemList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.faItemList.length; i++) {
            let cItem = _row.faItemList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, false);
              }
            });
            this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
              return cmsItem.uuid !== cItem.uuid;
            });
          }
        }
      } else {
        if (this.childMultipleSelection) {
          this.childMultipleSelection = [];
          this.$refs['childMultipleTable_' + _row.id][0].clearSelection();
        }
      }
    },
    async childSelectHandle(selection, row, parentRow) {
      // 选择子项
      // console.log('选择子项：', selection, row, parentRow);
      await this.$nextTick();
      // this.childMultipleSelection = selection;
      if (selection.length === parentRow.faItemList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
        });
      }
      this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
      // console.log('子项全选操作：', selection, parentRow);
      await this.$nextTick();
      if (selection && selection.length) {
        this.$nextTick(() => {
          this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
        });
      }
      this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);
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
          this.$set(this.transferList, index, item);
          this.$forceUpdate();
        }
      });
    },
    
    pullDataHandle() {
      // 拉取
      if (!this.editData.allocationType) {
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        return false;
      }
      if (this.isCustomerOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售订单编号！'
          });
          return false;
        }
      }
      if (this.editData.allocationTypeName.split('-')[0] == '客订') {
        // 客订
        this.pullCustomerOrderHandle();
      } else {
        // 非客订
        this.pullStockUpHandle();
      }
    },
    pullCustomerOrderHandle() {
      // 客订拉取
      let params = {
        saleOrderId: this.editData.saleOrderId,
        saleOrderType: ''
      };
      pullCustomerOrder(params).then(res => {
        console.log('拉取客订数据：', res);
        if (res.code === '0') {
          if (!res.data) {
            this.$message({
              type: 'error',
              message: '无数据可拉取！'
            });
            return false;
          }
          this.isEmptyData = false;
          let editDataCopy = JSON.parse(JSON.stringify(this.editData));
          editDataCopy.customerName = res.data.customerName;
          editDataCopy.saleOrderId = res.data.saleOrderId;
          getUUID().then(res => {
            if (res.code === '0') {
              editDataCopy.uuid = res.data;
            }
          });
          // this.getUUIDHandle(editDataCopy);
          for (var i = 0; i < res.data.saleOrderItemList.length; i++) {
            let item = res.data.saleOrderItemList[i];
            let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));  // 三级数据
            this.updateEditModeSet('pull', item);
            getUUID().then(res => {
              if (res.code === '0') {
                item.uuid = res.data;
              }
            });
            // this.getUUIDHandle(item);
            getUUID().then(res => {
              if (res.code === '0') {
                addChildDataCopy.uuid = res.data;
              }
            });
              // 销售订单编号
              item.editModeSet.inputSet.saleOrderId=true;
            // this.getUUIDHandle(addChildDataCopy);
            addChildDataCopy.materialCode = item.materialCode;
            item.warehouseList = this.warehouseList;
            item.suggestQuantity = item.quantity;
            item.validDate = item.customerOfferedDate ? timeFormat(item.customerOfferedDate) : '';  // 期望交期
            item.expectedArrivalDate = timeFormat(res.data.lastDeliveryDate);
            item.allocationList = [];
            item.allocationList.push(addChildDataCopy);
            // 计量单位
            this.getMeasurementUnit(item);
            // 计量单位
            this.getMeasurementUnit(addChildDataCopy);
            // 获取确认书列表
            this.confirmNumbersByMCHandle(addChildDataCopy, item.virtualInventoryId);
            this.getBatchQuery(item);
            this.updateEditModeSet('pull', addChildDataCopy);
          }
          editDataCopy.faItemList = res.data.saleOrderItemList;
          this.editData = editDataCopy;
          console.log( this.editData);
          this.$forceUpdate();
        }
      });
    },
    pullStockUpHandle() {
      // 非客订拉取
      let params = {
        businessType: '',
        unit: 'W',
        startTime: getNowDate()
      };
      pullCustomerOrderRequest(params).then(res => {
        // console.log('拉取非客订数据：', res);
        if (res.code === '0') {
          if (!res.data.length) {
            this.$message({
              type: 'error',
              message: '无数据可拉取！'
            });
            return false;
          }
          this.isEmptyData = false;
          let editDataCopy = JSON.parse(JSON.stringify(this.editData));
          for (var i = 0; i < res.data.length; i++) {
            let item = res.data[i];
            getUUID().then(res => {
              if (res.code === '0') {
                item.uuid = res.data;
              }
            });
            // this.getUUIDHandle(item);
            item.warehouseList = this.warehouseList;
            item.transferPlanQuantity = item.adviceQuantity;
            this.updateEditModeSet('pull', item);
            // 销售订单编号
            item.editModeSet.inputSet.saleOrderId=false;
            this.allocationInfoHandle(item);
          }
          editDataCopy.faItemList = res.data;
          this.editData = editDataCopy;
          this.$forceUpdate();
        }
      });
    },
    allocationInfoHandle(data) {
      let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));  // 三级数据
      data.allocationList = [];
      addChildDataCopy.materialCode = data.materialCode;
      // 计量单位
      this.getMeasurementUnit(addChildDataCopy);
      // 确认书列表
      this.confirmNumbersByMCHandle(addChildDataCopy, data.virtualInventoryId);
      getUUID().then(res => {
        if (res.code === '0') {
          addChildDataCopy.uuid = res.data;
        }
      });
      // this.getUUIDHandle(addChildDataCopy);
      this.updateEditModeSet('pull', addChildDataCopy);
      data.allocationList.push(addChildDataCopy);
      this.$forceUpdate();
    },
    getTransferPlanQuantityHandle(item, index) {
      // 查询建议调拨数量
      // let editListCopy = JSON.parse(JSON.stringify(this.editData.faItemList));
      let _item = JSON.parse(JSON.stringify(item));
      let businessType = '';
      if (_item.virtualInventoryId == 'C0') {
        businessType = '1';
      } else if (_item.virtualInventoryId == 'B0') {
        businessType = '2';
      }
      let tpqParams = {
        businessType: businessType,
        unit: 'W',
        startTime: getNowDate(),
        materialCode: _item.materialCode
      };
      searchTransferPlanQuantity(tpqParams).then(res => {
        console.log('查询建议调拨数量：', res);
        if (res.code === '0' && res.data) {
          _item.transferPlanQuantity = 200;
          this.$set(this.editData.faItemList, index, _item);
          this.$forceUpdate();
        }
      });
    },
    // async getAvailableInventoryHandle(item, allocationTypeArr) {
    //   let params = {
    //     materialCode: item.materialCode,
    //     inventory: item.virtualInventoryId,
    //     subInventory: val
    //   };
    //   if (allocationTypeArr[1] == '工厂调拨') {
    //     await factoryAvailableInventory(params).then(res => {
    //       // 调出库可用库存
    //       if (res.code === '0') {
    //         for (var i = 0; i < editListCopy.length; i++) {
    //           let data = editListCopy[i];
    //           if (data.uuid == item.uuid) {
    //             data.subInventory = val;
    //             data.availableInventory = res.data;
    //             for (var j = 0; j < data.subInventoryList.length; j++) {
    //               let cData = data.subInventoryList[j];
    //               if (cData.subInventory == val) {
    //                 data.subInventoryName = cData.subInventoryName;
    //               }
    //             }
    //           }
    //         }
    //         this.editData.faItemList = editListCopy;
    //         this.$forceUpdate();
    //       }
    //     });
    //   } else if (allocationTypeArr[1] == '库内调拨') {
    //     await cuneAvailableInventory(params).then(res => {
    //       // 调出库可用库存
    //       if (res.code === '0') {
    //         for (var i = 0; i < editListCopy.length; i++) {
    //           let data = editListCopy[i];
    //           if (data.uuid == item.uuid) {
    //             data.subInventory = val;
    //             data.availableInventory = res.data;
    //             for (var j = 0; j < data.subInventoryList.length; j++) {
    //               let cData = data.subInventoryList[j];
    //               if (cData.subInventory == val) {
    //                 data.subInventoryName = cData.subInventoryName;
    //               }
    //             }
    //           }
    //         }
    //         this.editData.faItemList = editListCopy;
    //         this.$forceUpdate();
    //       }
    //     });
    //   }
    // },
    async addHandle() {
      // 新增
      this.editData = {};
      this.editData.deliveryType = '1';
      this.editData.allocationStatus = 'Draft';
      await getUUID().then(res => {
        if (res.code === '0') {
          this.editData.uuid = res.data;
        }
      });
      this.editType = 'add';
      this.isShowEdit = true;
      this.isEmptyData = true;  // 父项数据可编辑
      this.isDisabledPull = false;  // 可拉取
      this.isDisabledSupplier = false;  // 供应商可编辑
    },
    async addEditHandle() {
      // 添加子项
      if (!this.editData.allocationType) {
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        return false;
      }
      if (this.isCustomerOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售订单编号！'
          });
          return false;
        }
      }
      if (!this.editData.supplierId) {
        this.$message({
          type: 'error',
          message: '请选择供应商！'
        });
        return false;
      }
      if (this.isEmptyData) {
        let data = {
          allocationType: '',
          allocationTypeName: '',
          supplierName: '',
          supplierCode: '',
          supplierId: '',
          saleOrderId: '',
          customerName: '',
          expectedArrivalDate: '',
          deliveryType: '',
          submitType: '',
          applicant: this.$store.state.userName,
          applicantName: this.$store.state.realName,
          applicantDepartment: this.$store.state.currentDepartment.id,
          applicantDepartmentName: this.$store.state.currentDepartment.name,
          faItemList: []
        };
        data = Object.assign(data, this.editData);
        let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
        let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));
        let allocationTypeArr = data.allocationTypeName.split('-');  // 调拨类型
        if (!data.uuid) {
          await getUUID().then(res => {
            if (res.code === '0') {
              data.uuid = res.data;
            }
          });
        }
        // this.getUUIDHandle(data);
        await getUUID().then(res => {
          if (res.code === '0') {
            addItemDataCopy.uuid = res.data;
          }
        });
        // this.getUUIDHandle(item);
        addItemDataCopy.warehouseList = this.warehouseList;
        // addItemDataCopy.virtualInventoryId = 'B0';
        // addItemDataCopy.virtualInventoryName = '零剪仓';
        // addItemDataCopy.subInventory = 'B001';
        // addItemDataCopy.subInventoryName = '零剪仓工厂库';

        if (allocationTypeArr[1] == '工厂调拨') {
          // 库位列表
          await subInventoryTypeList(addItemDataCopy.virtualInventoryId).then(res => {
            if (res.code === '0') {
              for (var i = 0; i < res.data.length; i++) {
                let data = res.data[i];
                if (data.subInventoryName.indexOf('工厂库') != -1) {
                  addItemDataCopy.subInventoryList.push(data);
                }
              }
              this.$forceUpdate();
            }
          });
        } else {
          await subInventoryRollsList(addItemDataCopy.virtualInventoryId).then(res => {
            if (res.code === '0') {
              addItemDataCopy.subInventoryList = res.data;
              this.$forceUpdate();
            }
          });
        }

        this.updateEditModeSet('add', data);
        addItemDataCopy.allocationList.push(addChildDataCopy);
        data.faItemList.push(addItemDataCopy);
        data.faItemList.forEach(item => {
          this.updateEditModeSet('add', item);
          if (this.isCustomerOrder) {
            // 销售订单编号
            addItemDataCopy.editModeSet.inputSet.saleOrderId=true;
          }else{
            addItemDataCopy.editModeSet.inputSet.saleOrderId=false;
          }
          item.allocationList.forEach(cItem => {
            this.updateEditModeSet('add', cItem);
          });
        });
        this.isEmptyData = false;
        this.editData = data;
      } else {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
        let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));
        addItemDataCopy.warehouseList = this.warehouseList;
        addItemDataCopy.allocationList.push(addChildDataCopy);
        this.updateEditModeSet('add', addItemDataCopy);
        addItemDataCopy.allocationList.forEach(item => {
           if (this.isCustomerOrder) {
              // 销售订单编号
              addItemDataCopy.editModeSet.inputSet.saleOrderId=true;
            }else{
              addItemDataCopy.editModeSet.inputSet.saleOrderId=false;
            }
          this.updateEditModeSet('add', item);
        });
        await getUUID().then(res => {
          if (res.code === '0') {
            addItemDataCopy.uuid = res.data;
            editDataCopy.faItemList.push(addItemDataCopy);
          }
        });
        // editDataCopy.faItemList.push(addItemDataCopy);
        // for (let i = 0; i < editDataCopy.faItemList.length; i++) {
        //   if (!editDataCopy.faItemList[i].uuid) {
        //     this.getUUIDHandle(editDataCopy.faItemList[i]);
        //   }
        // }
        this.editData = editDataCopy;
      }
    },
    editHandle(index, item, statusjob) {
      // 编辑
      console.log('编辑项：', item);
      this.editType = 'edit';
      this.allocationStatus = this.activeName;
      this.isEmptyData = false;  // 父项数据是否可编辑
     
      searchTransferOrder(item.id,statusjob).then(res => {
        if (res.code === '0' && res.data  ) {
          if(statusjob=="fission" ){
            if(res.data.faItemList.length==0){
              this.$message({
          type: 'error',
          message: '无剩余调拨数量,无法裂变'
           });
           return false;
            }
            
            this.fissionstatus=true;
          }
          let supplierData = this.supplierList.find(sItem => {
            return sItem.supplierId == res.data.supplierCode;
          });
          res.data.supplierName = supplierData ? supplierData.supplierName : '';
          res.data.supplierId = supplierData ? supplierData.supplierId : '';
          // res.data.supplierCode = supplierData ? supplierData.supplierId : '';
          this.isCustomerOrder = res.data.allocationTypeName ? (res.data.allocationTypeName.split('-')[0] == '客订' ? true : false) : this.isCustomerOrder;  // 客订
          this.isFactoryAllocation = res.data.allocationTypeName ? (res.data.allocationTypeName.split('-')[1] == '工厂调拨' ? true : false) : this.isFactoryAllocation;  // 工厂调拨
          for (var i = 0; i < res.data.faItemList.length; i++) {
            let data = res.data.faItemList[i];
            res.data.faItemList[i]._allocationPackages=data.allocationPackages;
            res.data.faItemList[i]._allocationQuantity=data.allocationQuantity;
            data.warehouseList = this.warehouseList;
            this.updateEditModeSet('edit', data);
             if (this.isCustomerOrder) {
                // 销售订单编号
                data.editModeSet.inputSet.saleOrderId=true;
              }else{
                data.editModeSet.inputSet.saleOrderId=false;
              }
            if (data.allocationList && data.allocationList.length) {
              for (var j = 0; j < data.allocationList.length; j++) {
                let cData = data.allocationList[j];
                data.allocationList[j]._allocationPackages=cData.allocationPackages;
                data.allocationList[j]._allocationQuantity=cData.allocationQuantity;
                // 获取可用数量及调拨数量规格
                this.getPaidMeterHandle(cData, data, j, i);
                // 获取确认书列表
                // this.confirmNumbersByMCHandle(cData);
                this.updateEditModeSet('edit', cData);
              }
            }
          }
          this.editData = JSON.parse(JSON.stringify(res.data));
          this.$forceUpdate();
          this.isShowEdit = true;
          this.isEmptyData = false;  // 父项数据不可编辑
          this.isDisabledSupplier = true;  // 供应商不可编辑
         
        }
      });
    },
    submitHandle(index, item) {
      // 列表提交审批
      this.dialogVisible = true;
      this.dialogType = 'submit';
      this.submitId = item.id;
      this.dialogDesc = '确定提交审批？';
    },
    deleteHandle(index, item) {
      // 列表删除
      this.dialogVisible = true;
      this.dialogType = 'delete';
      this.deleteId = item.id;
      this.dialogDesc = '确定删除？';
    },
    revokeHandle(index, item) {
      // 列表撤销
      this.dialogVisible = true;
      this.dialogType = 'revoke';
      this.revokeId = item.id;
      this.revokeCode = item.factoryAllocationCode;
      this.dialogDesc = '确定撤销？';
    },
    dialogCancelHandle() {
      this.dialogVisible = false;
    },
    dialogConfirmHandle() {
      // 对话框确认
      switch (this.dialogType) {
        case 'submit':
          submitTransferOrder(this.submitId).then(res => {
            // console.log('列表提交审批：', res);
            if (res.code === '0') {
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: '提交审批成功！'
              });
              this.activeName = 'Approving';
              this.allocationStatus = 'Approving';
              this.getTransferOrderList();
            }
            this.dialogVisible = false;
          });
          break;
        case 'delete':
          deleteTransferOrder(this.deleteId).then(res => {
            // console.log('列表删除确认：', res);
            if (res.code === '0') {
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: '删除成功！'
              });
              this.getTransferOrderList();
            }
            this.dialogVisible = false;
          });
          break;
        case 'revoke':
          revokeTransferOrder(this.revokeCode).then(res => {
            // console.log('列表撤销确认：', res);
            if (res.code === '0') {
              this.dialogVisible = false;
              this.$message({
                type: 'success',
                message: '撤销成功！'
              });
              this.getTransferOrderList();
            }
            this.dialogVisible = false;
          });
          break;
      
        default:
          break;
      }
    },
    cancelEditHandle() {
      // 编辑取消
      this.isCustomerOrder = false;
      this.isFactoryAllocation = false;
      this.isShowEdit = false;
      this.fissionstatus=false;
    },
    async updateEditHandle(type) {
      let  statusjob
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      if(this.fissionstatus){
        statusjob="fission"
        this.editData.originalFaUuid= editDataCopy.uuid;
      // setTimeout(function() 
      }
       console.log('调拨更新保存：', this.editData);
       if(this.fissionstatus){
       await getUUID().then(res => {
        if (res.code === '0') {
          this.editData.uuid = res.data;
        }
      });
    }
      for (var m = 0; m < this.editData.faItemList.length; m++) {
        let item = this.editData.faItemList[m];
        if(this.fissionstatus){
          this.editData.faItemList[m].originalFaItemUuid=item.uuid;
          await getUUID().then(res => {
        if (res.code === '0') {
          this.editData.faItemList[m].uuid = res.data;
        }
      })
        }
        
        let cnTemp = {};  // 存在确认书列表
        for (var n = 0; n < item.allocationList.length; n++) {
          let cItem = item.allocationList[n];
          if(this.fissionstatus){
            item.allocationList[n].originalFaItemUuid = cItem.uuid;
            await getUUID().then(res => {
        if (res.code === '0') {
          item.allocationList[n].uuid = res.data;
        }
      })
            
        }
          let cnKey = cItem.confirmNumbers;
          if (cnTemp[cnKey]) {
            cnTemp[cnKey].confirmNumbers = cnTemp[cnKey].confirmNumbers;
            cnTemp[cnKey].allocationQuantity = cnTemp[cnKey].allocationQuantity;
            cnTemp[cnKey].allocationQuantityTotal = cnTemp[cnKey].allocationQuantity + cItem.allocationQuantity;
          } else {
            cnTemp[cnKey] = {};
            cnTemp[cnKey].confirmNumbers = cItem.confirmNumbers;
            cnTemp[cnKey].allocationQuantity = cItem.allocationQuantity;
            cnTemp[cnKey].allocationQuantityTotal = cItem.allocationQuantity;
          }
          cItem.confirmNumbersTemp = cnTemp;
          // if (cnTemp[item.confirmNumbers].allocationQuantityTotal > item.confirmAvailableQuantity) {
          //   this.$message({
          //     type: 'error',
          //     message: '相同确认书号下调拨数量不能大于可用数量！'
          //   });
          //   return false;
          // }
        }
        // for (let k in cnTemp) {
        //   cnList.push(cnTemp[k]);
        // }
      }
      console.log('调拨更新保存111：', this.editData);
      
      // if (!this.editData.uuid) {
      //   await getUUID().then(res => {
      //     if (res.code === '0') {
      //       this.editData.uuid = res.data;
      //     }
      //   });
      // }
      if (!this.editData.faItemList.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
     
      if (!this.editData.allocationType) {
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        return false;
      }
      if (this.isCustomerOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售订单编号！'
          });
          return false;
        }
      }
      if (!this.editData.supplierId) {
        this.$message({
          type: 'error',
          message: '请选择供应商！'
        });
        return false;
      }
      if (!this.editData.expectedArrivalDate) {
        this.$message({
          type: 'error',
          message: '请选择预计到货日期！'
        });
        return false;
      }
      for (var i = 0; i < this.editData.faItemList.length; i++) {
        let item = this.editData.faItemList[i];
        let allocationQuantityTotal = 0;
        // if (!item.uuid) {
        //   await getUUID().then(res => {
        //     if (res.code === '0') {
        //       item.uuid = res.data;
        //     }
        //   });
        // }
        if (!item.materialCode) {
          this.$message({
            type: 'error',
            message: '请输入物料编号！'
          });
          return false;
        }
        // if (!item.productCode) {
        //   this.$message({
        //     type: 'error',
        //     message: '请重新输入物料编号查询产品编号！'
        //   });
        //   return false;
        // }
        if (!item.supplierCode) {
          this.$message({
            type: 'error',
            message: '请重新输入物料编号查询供应商！'
          });
          return false;
        }
        if (!item.virtualInventoryId) {
          this.$message({
            type: 'error',
            message: '请选择出库仓位！'
          });
          return false;
        }
        if (!item.subInventoryName) {
          this.$message({
            type: 'error',
            message: '请选择出库库位！'
          });
          return false;
        }
        if (!item.inputInventoryId) {
          this.$message({
            type: 'error',
            message: '请选择入库仓位！'
          });
          return false;
        }
        if (!item.inputSubInventoryName) {
          this.$message({
            type: 'error',
            message: '请选择入库库位！'
          });
          return false;
        }
        if (item.virtualInventoryId == item.inputInventoryId && item.subInventory == item.inputSubInventory) {
          this.$message({
            type: 'error',
            message: '出库仓位+出库库位 与 入库仓位+入库库位 相同时不能进行调拨！'
          });
          return false;
        }
        if (!item.validDate) {
          this.$message({
            type: 'error',
            message: '请选择期望交期！'
          });
          return false;
        }
        if (!item.availableInventory) {
          this.$message({
            type: 'error',
            message: '调出库可用库存不能为空！'
          });
          return false;
        }
        for (var j = 0; j < item.allocationList.length; j++) {
          let cItem = item.allocationList[j];
          allocationQuantityTotal += cItem.allocationQuantity;
          if (!cItem.confirmNumbers) {
            this.$message({
              type: 'error',
              message: '请选择确认书号！'
            });
            return false;
          }
          if (cItem.purchaseMeasurementUnit == '米') {
            if (!cItem.allocationPackages || !cItem.allocationQuantityPerPackage || !cItem.allocationQuantity) {
              this.$message({
                type: 'error',
                message: '请输入调拨数量！'
              });
              return false;
            }
          } else {
            if (!cItem.allocationQuantity) {
              this.$message({
                type: 'error',
                message: '请输入调拨数量！'
              });
              return false;
            }
          }
          // if (cItem.confirmNumbersTemp[cItem.confirmNumbers].allocationQuantityTotal > cItem.confirmAvailableQuantity) {
          //   this.$message({
          //     type: 'error',
          //     message: '相同确认书号下调拨数量不能大于可用数量！'
          //   });
          //   return false;
          // }
          // delete cItem.confirmNumbersTemp;
          if (cItem.allocationQuantity > item.availableInventory) {
            this.$message({
              type: 'error',
              message: '调拨数量不能大于调出库可用库存！'
            });
            return false;
          }
          if (allocationQuantityTotal > item.availableInventory) {
            this.$message({
              type: 'error',
              message: '调拨数量不能大于调出库可用库存！'
            });
            return false;
          }
        }
      }
      this.editData.applicant ? '' : this.editData.applicant = this.$store.state.userName;
      this.editData.applicantName ? '' : this.editData.applicantName = this.$store.state.realName;
      this.editData.applicantDepartment ? '' : this.editData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editData.applicantDepartmentName ? '' : this.editData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      switch (type) {
        case 'save':
          this.editData.submitType = '1';
          if (this.editType == 'add' && !this.editData.allocationStatus) {
            this.editData.allocationStatus = 'Draft';
          }
          break;
        case 'submit':
          this.editData.submitType = '2';
          if (this.editType == 'add' && !this.editData.allocationStatus) {
            this.editData.allocationStatus = 'Approving';
          }
          break;
      
        default:
          break;
      }
     
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
      // setTimeout(function() {
        updateTransferOrder(this.editData ,statusjob).then(res => {
          if (res.code === '0') {
            switch (type) {
              case 'save':
                // this.allocationStatus = 'Draft';
                this.getTransferOrderList();
                if (this.editType == 'add' && !this.fissionstatus) {
                  this.activeName = 'Draft';
                }else{
                  this.activeName = 'All';
                  this.fissionstatus=false;
                }
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                });
                this.isShowEdit = false;
                break;
              case 'submit':
                this.allocationStatus = 'Approving';
                this.getTransferOrderList();
                this.activeName = 'Approving';
                this.$message({
                  type: 'success',
                  message: '提交审批成功！'
                });
                this.isShowEdit = false;
                break;
            
              default:
                break;
            }
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        });
      // }, 100);
    },
    allocationTypeChange(val) {
      // 调拨类型更改
      console.log('调拨类型更改：', val);
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let allocationTypeData = this.transferTypeList.find(item => {
        return item.index === val;
      });
      editDataCopy.allocationTypeName = allocationTypeData.name;
      this.isCustomerOrder = editDataCopy.allocationTypeName ? (editDataCopy.allocationTypeName.split('-')[0] === '客订' ? true : false) : this.isCustomerOrder;  // 客订
      this.isFactoryAllocation = editDataCopy.allocationTypeName ? (editDataCopy.allocationTypeName.split('-')[1] === '工厂调拨' ? true : false) : this.isFactoryAllocation;  // 工厂调拨
      this.editData = editDataCopy;
      console.log(this.editData)
      //  if (this.isDifferenceOrder) {
      //   // 差异单
      //   editItemCopy.editModeSet.unitSet.requiredPackages = {
      //     min: '-9999999999'
      //   };
      // }
    },
    supplierChange(val) {
      // 供应商更改
      // console.log('供应商更改：', val);
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let supplierData = this.supplierList.find(item => {
        return item.supplierId == val;
      });
      editDataCopy.supplierCode = supplierData ? supplierData.supplierId : '';
      editDataCopy.supplierName = supplierData ? supplierData.supplierName : '';
      editDataCopy.supplierShortName = supplierData ? supplierData.supplierCode : '';
      this.editData = editDataCopy;
    },
    deliveryTypeChange(val) {
      // 发运方式更改
      // console.log('发运方式更改：', val);
    },
    async virtualInventoryChange(val) {
      // 出库仓位更改
      console.log('出库仓位更改：', val);
      this.subInventory = '';
      await subInventoryTypeList(val).then(res => {
        console.log('库位列表：', res);
        if (res.code === '0') {
          this.outSubInventoryList = res.data;
          this.$forceUpdate();
        }
      });
    },
    async inputInventoryChange(val) {
      // 入库仓位更改
      console.log('入库仓位更改：', val);
      this.inputSubInventory = '';
      await subInventoryTypeList(val).then(res => {
        console.log('库位列表：', res);
        if (res.code === '0') {
          this.inSubInventoryList = res.data;
          this.$forceUpdate();
        }
      });
    },
    dateValChange(val) {
      // 期望交期更改
    },
    searchHandle() {
      // 搜索
      this.currentPage = 1;
      this.transferList = [];
      if (this.dateVal) {
        this.startTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      this.getTransferOrderList();
    },
    switchTabHandle(tab) {
      // tab切换
      this.tableLoading = true;
      this.currentPage = 1;
      this.multipleSelection = [];
      this.childMultipleSelection = [];
      this.selectUuidList = [];  // 勾选项清空
      this.transferList = [];
      switch (tab.name) {
        case 'All':
          this.allocationStatus = '';
          this.getTransferOrderList();
          break;
        case 'Draft':
          this.allocationStatus = 'Draft';
          this.getTransferOrderList();
          break;
        case 'Approving':
          this.allocationStatus = 'Approving';
          this.getTransferOrderList();
          break;
        case 'Approved':
          this.allocationStatus = 'Approved';
          this.getTransferOrderList();
          break;
        case 'Rejected':
          this.allocationStatus = 'Rejected';
          this.getTransferOrderList();
          break;
        case 'Terminated':
          this.allocationStatus = 'Terminated';
          this.getTransferOrderList();
          break;
        default:
          break;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTransferOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTransferOrderList();
    },
    getTransferOrderList() {
      // 调拨单列表
      let data = {
        materialCode: this.materialCode,
        allocationStatus: this.allocationStatus,
        factoryAllocationCode: this.factoryAllocationCode,
        supplierCode: this.supplierCode,
        allocationType: this.allocationType,
        startTime: this.startTime,
        endTime: this.endTime,
        virtualInventoryId: this.virtualInventoryId,
        subInventory: this.subInventory,
        inputInventoryId: this.inputInventoryId,
        inputSubInventory: this.inputSubInventory
      };
      transferOrderList(this.currentPage, this.pageSize, data).then(res => {
        console.log('调拨单列表：', res);
        if (res.code === '0') {
          this.total = res.data.total;
          this.transferList = res.data.records;
          for (let i = 0; i < this.transferList.length; i++) {
            let item = this.transferList[i];
            item.status = item.allocationStatus;
            item.allocationStatusName = statusTypeHandle(item.allocationStatus);
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            item.updateTime = item.updateTime ? timeFormat(item.updateTime) : '';
            item.expectedArrivalDate = item.expectedArrivalDate ? timeFormat(item.expectedArrivalDate) : '';
            item.deliveryTypeName = item.deliveryType ? deliveryTypeHandle(item.deliveryType) : '';  // 发运方式
            // if (item.allocationTypeName.split('-')[1] == '工厂调拨') {
            //   // 工厂调拨显示发运方式
            //   item.hide_deliveryTypeName = false;
            // } else {
            //   item.hide_deliveryTypeName = true;
            //   // item.isHideFew = true;
            // }
            // if (item.allocationTypeName.split('-')[0] == '客订') {
            //   // 客订显示销售订单编号和客户名称
            //   item.hide_saleOrderId = false;
            //   item.hide_customerName = false;
            // } else {
            //   item.hide_saleOrderId = true;
            //   item.hide_customerName = true;
            //   // item.isHideFew = true;
            // }

            if (item.allocationTypeName.split('-')[1] == '工厂调拨') {
              // 工厂调拨显示发运方式
              item.isFactoryTransferType = true;
            } else {
              item.isFactoryTransferType = false;
            }
            if (item.allocationTypeName.split('-')[0] == '客订') {
              // 客订显示销售订单编号和客户名称
              item.isCustomerOrderType = true;
            } else {
              item.isCustomerOrderType = false;
            }

            // 列表组件编辑项
            // switch (item.allocationStatus) {
            //   case 'Draft':
            //     item.actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Approved':
            //     if (!item.cancelled) {
            //       item.actions = {
            //         hasRevoke: true
            //       };
            //     }
            //     break;
            //   case 'Rejected':
            //     item.actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Terminated':
            //     item.actions = {
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     item.actions = {};
            //     break;
            // }

            for (var j = 0; j < item.faItemList.length; j++) {
              this.updateEditModeSet('edit', item.faItemList[j]);
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
    
    async getBatchQuery(data,type,editListCopy){
      var _data=data;
      data.productCode = '';
      let materialCodes=[data.materialCode];
      let businessTypeList=[];
      switch(type){
        case 'A0':
          businessTypeList.push('Group');
          break;
        case 'B0':
          businessTypeList.push('Retail');
          break;
        case 'C0':
          businessTypeList.push('Suits');
          break;
        case 'D0':
          businessTypeList.push('Agency');
          break;
        default:
          break;
      }
      let sumList={
        businessTypeList:businessTypeList,
        materialCodes:materialCodes
      }
      if(editListCopy){
        _data=editListCopy
      }
      await batchQuery(sumList).then(res=>{
        var data=[res.data];
        data.map((item,i)=>{
          for (let key in item) {
            if (key == _data.materialCode) {
              if(item[key]==null){
                data.supplierName = '';
                data.productCode = '';
                // this.$message({
                //   type: 'error',
                //   message: '该物料编号下无供应商 产品编号！'
                // });
                return false;
              }
              _data.supplierName = item[key].supplierName;
              _data.supplierCode = item[key].supplierId;
              _data.supplierId = item[key].supplierId;
              _data.supplierShortName = item[key].supplierShortName;
              let pcArr = [];
              for (var i = 0; i < item[key].productCode.length; i++) {
                pcArr.push(item[key].productCode[i].productCode);
              }
              _data.productCode = pcArr.join(',');
              _data.productCodeList = item[key].productCode;
              this.$forceUpdate();
            }
          }
        })
      })
    },
    
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let numberInputSet = JSON.parse(JSON.stringify(this.numberInputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      let unitSet = JSON.parse(JSON.stringify(this.unitSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));

      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.selectSet = selectSet;
      editModeSet.unitSet = unitSet;
      editModeSet.datePickerSet = datePickerSet;
      data.editModeSet = editModeSet;
    },
    inputChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editData.faItemList));
      switch (fieldItem.field) {
        case 'materialCode':
          console.log('物料编号值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            if (editListCopy[i].uuid == item.uuid) {
              let data = editListCopy[i];
              existMaterialCode(data.materialCode).then(eRes => {
                if (eRes.code === '0') {
                  let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));
                  // data.virtualInventoryId = '';
                  // data.subInventoryName = '';
                  // data.inputInventoryId = '';
                  // data.inputSubInventoryName = '';
                  data.validDate = '';
                  data.remark = '';
                  data.transferPlanQuantity = '';
                  data.availableInventory = '';
                  data.confirmNumbers = '';
                  data.allocationPackages = '';
                  data.allocationQuantityPerPackage = '';
                  data.allocationQuantity = '';
                  // data.subInventoryList = [];
                  // data.inputSubInventoryList = [];
                  data.allocationList = [];
                  getUUID().then(res => {
                    if (res.code === '0') {
                      addChildDataCopy.uuid = res.data;
                    }
                  });
                  // this.getUUIDHandle(addChildDataCopy);
                  this.updateEditModeSet('add', addChildDataCopy);
                  data.allocationList.push(addChildDataCopy);

                  if (!eRes.data) {
                    this.$message({
                      type: 'error',
                      message: '查无此物料编号！'
                    });
                    data.materialCode = '';
                    data.productCode = '';
                    data.supplierName = '';
                    data.supplierId = '';
                    data.supplierCode = '';
                    data.supplierShortName = '';
                    return false;
                  }
                  data.supplierName = eRes.data.supplierName;
                  data.supplierId = eRes.data.supplierId;
                  data.supplierCode = eRes.data.supplierId;
                  data.supplierShortName = eRes.data.supplierShortName;
                  // 计量单位
                  this.getMeasurementUnit(data);
                  // 调出库可用库存
                  if (this.editData.allocationType && data.materialCode && data.virtualInventoryId && data.subInventory) {
                    this.getAvailableInventoryHandle(data, i);
                  }
                  // 通过物料编号获取产品编号
                  //this.getProductCodeHandle(data);
                  this.getBatchQuery(data);

                  for (var j = 0; j < data.allocationList.length; j++) {
                    let aData = data.allocationList[j];
                    aData.materialCode = data.materialCode;
                    // 计量单位
                    this.getMeasurementUnit(aData);
                    // 确认书列表
                    this.confirmNumbersByMCHandle(aData, data.virtualInventoryId);
                  }
                  this.$forceUpdate();
                }
              });
            }
          }
          this.editData.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        default:
          break;
      }
    },
    inputBlur(val, item, fieldItem) {
      let time = null;
      let disabledTime = null;
      let _this = this;
      let editListCopy = JSON.parse(JSON.stringify(_this.editData.faItemList));
      switch (fieldItem.field) {
        case 'materialCode':
          console.log('物料编号值失焦：', val, item, fieldItem);
          time = setTimeout(function() {
            if (!item.productCode) {
              for (var i = 0; i < editListCopy.length; i++) {
                if (editListCopy[i].uuid == item.uuid) {
                  let data = editListCopy[i];
                  existMaterialCode(data.materialCode).then(eRes => {
                    if (eRes.code === '0') {
                      let addChildDataCopy = JSON.parse(JSON.stringify(_this.addChildData));
                      // data.virtualInventoryId = '';
                      // data.subInventoryName = '';
                      // data.inputInventoryId = '';
                      // data.inputSubInventoryName = '';
                      data.validDate = '';
                      data.remark = '';
                      data.transferPlanQuantity = '';
                      data.availableInventory = '';
                      data.confirmNumbers = '';
                      data.allocationPackages = '';
                      data.allocationQuantityPerPackage = '';
                      data.allocationQuantity = '';
                      // data.subInventoryList = [];
                      // data.inputSubInventoryList = [];
                      data.allocationList = [];
                      getUUID().then(res => {
                        if (res.code === '0') {
                          addChildDataCopy.uuid = res.data;
                        }
                      });
                      // _this.getUUIDHandle(addChildDataCopy);
                      _this.updateEditModeSet('add', addChildDataCopy);
                      data.allocationList.push(addChildDataCopy);

                      if (!eRes.data) {
                        _this.$message({
                          type: 'error',
                          message: '查无此物料编号！'
                        });
                        data.materialCode = '';
                        data.productCode = '';
                        data.supplierName = '';
                        data.supplierId = '';
                        data.supplierCode = '';
                        data.supplierShortName = '';
                        return false;
                      }
                      data.supplierName = eRes.data.supplierName;
                      data.supplierId = eRes.data.supplierId;
                      data.supplierCode = eRes.data.supplierId;
                      data.supplierShortName = eRes.data.supplierShortName;
                      // 计量单位
                      _this.getMeasurementUnit(data);
                      // 调出库可用库存
                      if (_this.editData.allocationType && data.materialCode && data.virtualInventoryId && data.subInventory) {
                        _this.getAvailableInventoryHandle(data, i);
                      }
                      // 通过物料编号获取产品编号
                      //_this.getProductCodeHandle(data);
                      _this.getBatchQuery(data);
                      
                      for (var j = 0; j < data.allocationList.length; j++) {
                        let aData = data.allocationList[j];
                        aData.materialCode = data.materialCode;
                        // 计量单位
                        _this.getMeasurementUnit(aData);
                        // 确认书列表
                        _this.confirmNumbersByMCHandle(aData, data.virtualInventoryId);
                      }
                      _this.$forceUpdate();
                    }
                  });
                }
              }
              _this.editData.faItemList = editListCopy;
              _this.$forceUpdate();
            }
            clearTimeout(time);
          }, 1000);
          
          break;
        default:
          break;
      }
    },
    async selectChange(val, item, fieldItem) {
      console.log('selectChange改变：', val, item, fieldItem);
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let editListCopy = JSON.parse(JSON.stringify(this.editData.faItemList));
      // let index = editListCopy.findIndex(iItem => iItem.uuid === item.uuid);
      if (!editDataCopy.allocationTypeName) {
        item.virtualInventoryId = '';
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        return false;
      }
      let allocationTypeArr = editDataCopy.allocationTypeName.split('-');  // 调拨类型
      switch (fieldItem.field) {
        case 'virtualInventoryId':
          // 出库仓位
          console.log('出库仓位值改变：', val, item, fieldItem);
          let siList = [];
          let businessType = '';
          // item.subInventory = '';  // 出库库位
          // item.subInventoryName = '';  // 出库库位名称
          item.subInventoryList = [];  // 出库库位列表
          // this.getTransferPlanQuantityHandle(item, index);
          if (allocationTypeArr[1] == '工厂调拨') {
            // 库位列表
            await subInventoryTypeList(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < res.data.length; i++) {
                  let data = res.data[i];
                  if (data.subInventoryName.indexOf('工厂库') != -1) {
                    siList.push(data);
                  }
                }
                this.$forceUpdate();
              }
            });
          } else {
            await subInventoryRollsList(val).then(res => {
              if (res.code === '0') {
                siList = res.data;
                this.$forceUpdate();
              }
            });
          }
          
          if (item.virtualInventoryId == 'C0') {
            businessType = '1';
          } else if (item.virtualInventoryId == 'B0') {
            businessType = '2';
          }
          let tpqParams = {
            businessType: businessType,
            unit: 'W',
            startTime: getNowDate(),
            materialCode: item.materialCode
          };
          // 查询建议调拨数量
          searchTransferPlanQuantity(tpqParams).then(res => {
            // console.log('查询建议调拨数量：', res);
            if (res.code === '0' && res.data) {
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                if (data.uuid == item.uuid) {
                  data.transferPlanQuantity = res.data.readyPlanQuantity;
                }
              }
              this.editData.faItemList = editListCopy;
              this.$forceUpdate();
            }
          });

          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid === item.uuid) {
              for (var j = 0; j < data.allocationList.length; j++) {
                let aData = data.allocationList[j];
                // 确认书列表
                this.confirmNumbersByMCHandle(aData, data.virtualInventoryId);
              }
              let viData = this.warehouseList.find(viItem => {
                return viItem.index == val;
              });
              data.virtualInventoryName = viData.name;  // 出库仓位名称
              data.subInventoryList = siList;
              data.subInventory = '';  // 出库库位
              data.subInventoryName = '';  // 出库库位名称
            }
          }
          this.editData.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        case 'subInventoryName':
          // 出库库位
          console.log('出库库位值改变：', val, item, fieldItem);
          if (!item.materialCode) {
            this.$message({
              type: 'error',
              message: '请先填写物料编号！'
            });
            return false;
          }

          // this.getAvailableInventoryHandle(item, allocationTypeArr);  // 调出库可用库存

          let params = {
            materialCode: item.materialCode,
            inventory: item.virtualInventoryId,
            subInventory: val,
            allocationType: editDataCopy.allocationType
          };
          if (allocationTypeArr[1] == '工厂调拨' || allocationTypeArr[1] == '集团调拨') {
            await factoryAvailableInventory(params).then(res => {
              // 调出库可用库存
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    data.subInventory = val;
                    data.availableInventory = res.data;
                    for (var j = 0; j < data.subInventoryList.length; j++) {
                      let cData = data.subInventoryList[j];
                      if (cData.subInventory == val) {
                        data.subInventoryName = cData.subInventoryName;
                      }
                    }
                  }
                }
                this.editData.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          } else if (allocationTypeArr[1] == '库内调拨') {
            await cuneAvailableInventory(params).then(res => {
              // 调出库可用库存
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    data.subInventory = val;
                    data.availableInventory = res.data;
                    for (var j = 0; j < data.subInventoryList.length; j++) {
                      let cData = data.subInventoryList[j];
                      if (cData.subInventory == val) {
                        data.subInventoryName = cData.subInventoryName;
                      }
                    }
                  }
                }
                this.editData.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          }
          break;
        case 'inputInventoryId':
          //入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          let isiList = [];
          // item.inputSubInventory = '';  // 入库库位
          // item.inputSubInventoryName = '';  // 入库库位名称
          item.inputSubInventoryList = [];  // 入库库位列表
          // 查询建议调拨数量
          if(!item.materialCode){
            this.$message({
              type: 'error',
              message: '请填写物料编号！'
            });
            return false;
          }
          getTPQuantityByInventory(item.materialCode, val).then(res => {
            // console.log('查询建议调拨数量：', res);
            if (res.code === '0') {
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                if (data.uuid == item.uuid) {
                  data.transferPlanQuantity = res.data ? res.data.transferPlanQuantity : 0;
                  this.getBatchQuery(item,val,data);
                }
              }
              this.editData.faItemList = editListCopy;
              this.$forceUpdate();
            }
          });

          if (allocationTypeArr[1] == '工厂调拨') {
            await subInventoryTypeList(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    isiList = res.data;
                  }
                }
              }
            });
          } else {
            await subInventoryRollsList(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    isiList = res.data;
                  }
                }
              }
            });
          }
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid == item.uuid) {
              let viData = this.warehouseList.find(viItem => {
                return viItem.index == val;
              });
              data.inputInventoryName = viData.name;  // 出库仓位名称
              data.inputSubInventoryList = isiList;
              data.inputSubInventory = '';  // 入库库位
              data.inputSubInventoryName = '';  // 入库库位名称
            }
          }
          this.editData.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        case 'inputSubInventoryName':
          console.log('入库库位值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid == item.uuid) {
              data.inputSubInventory = val;
              for (var j = 0; j < data.inputSubInventoryList.length; j++) {
                let cData = data.inputSubInventoryList[j];
                if (cData.subInventory == val) {
                  data.inputSubInventoryName = cData.subInventoryName;
                }
              }
            }
          }
          this.editData.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        case 'confirmNumbers':
          console.log('确认书号值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            for (var j = 0; j < data.allocationList.length; j++) {
              if (data.allocationList[j].uuid === item.uuid) {
                // 获取可用数量及调拨数量规格
                this.getPaidMeterHandle(data.allocationList[j], data, j, i);
                if (data.allocationList[j].materialCode && data.allocationList[j].confirmNumbers && data.allocationList[j].allocationQuantityPerPackage) {
                  this.getAllocationQuantityHandle(data.allocationList[j], data, j, i);
                }
                this.getPaymentMethodHandle(data.allocationList[j], data, j, i);
              }
            }
          }
          break;
        // case 'allocationQuantityPerPackage':
        case 'allocationQuantity':
          console.log('调拨数量规格值改变：', val, item, fieldItem);
          // item.allocationQuantity = parseFloat(item.allocationPackages * (item.allocationQuantityPerPackage ? item.allocationQuantityPerPackage : 0)).toFixed(2);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            for (var j = 0; j < data.allocationList.length; j++) {
              if (data.allocationList[j].uuid === item.uuid) {
                // 获取可用数量及调拨数量规格
                // this.getPaidMeterHandle(data.allocationList[j], data, j, i);
                if (data.allocationList[j].materialCode && data.allocationList[j].confirmNumbers && data.allocationList[j].allocationQuantityPerPackage) {
                  this.getAllocationQuantityHandle(data.allocationList[j], data, j, i);
                }
              }
            }
          }
          this.$forceUpdate();
          break;
        default:
          break;
      }
    },
    async selectVisibleChange(val, item, fieldItem) {
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let editListCopy = JSON.parse(JSON.stringify(this.editData.faItemList));
      // let allocationTypeArr = editDataCopy.allocationTypeName.split('-');  // 调拨类型
      if (!editDataCopy.allocationTypeName) {
        item.virtualInventoryId = '';
        this.$message({
          type: 'error',
          message: '请选择调拨类型！'
        });
        return false;
      }
      let allocationTypeArr = editDataCopy.allocationTypeName.split('-');  // 调拨类型
      switch (fieldItem.field) {
        case 'virtualInventoryId':
          // 出库仓位
          console.log('出库仓位值改变：', val, item, fieldItem);
            if(this.editData.allocationTypeName=='备货-集团调拨'){
              item.warehouseList=item.warehouseList.filter(item => item.name === '集团仓')
            }
            console.log(item)
            // console.log(this.editData.allocationTypeName.split('-')[0] == '客订')
            // this.materials.filter(item => item.categoryId === this.curTab.categoryId)
          if (!item.warehouseList.length) {
            for (var i = 0; i < editListCopy.length; i++) {
              let data = editListCopy[i];
              if (data.uuid == item.uuid) {
                if(this.isCustomerOrder==false||this.isFactoryAllocation==false){
                  console.log('进入集团调拨')
                }
                data.warehouseList = this.warehouseList;
              }
            }
            this.editData.faItemList = editListCopy;
            this.$forceUpdate();
          }
          break;
        case 'subInventoryName':
          // 出库库位
          console.log('出库库位值改变：', val, item, fieldItem);
          if (!item.subInventoryList || !item.subInventoryList.length) {
            if (item.virtualInventoryId) {
              let siList = [];
              if (allocationTypeArr[1] === '工厂调拨') {
                // 库位列表
                await subInventoryTypeList(item.virtualInventoryId).then(res => {
                  if (res.code === '0') {
                    for (var i = 0; i < res.data.length; i++) {
                      let data = res.data[i];
                      if (data.subInventoryName.indexOf('工厂库') !== -1) {
                        siList.push(data);
                      }
                    }
                    this.$forceUpdate();
                  }
                });
              } else {
                await subInventoryRollsList(item.virtualInventoryId).then(res => {
                  if (res.code === '0') {
                    siList = res.data;
                    this.$forceUpdate();
                  }
                });
              }
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                if (data.uuid === item.uuid) {
                  data.subInventoryList = siList;
                }
              }
              this.editData.faItemList = editListCopy;
              this.$forceUpdate();
            }
          }
          break;
        case 'inputInventoryId':
          // 入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          if(this.editData.allocationTypeName=='备货-集团调拨'){
            item.warehouseList=this.warehouseList;
          }
          if (!item.warehouseList.length) {
            for (var i = 0; i < editListCopy.length; i++) {
              let data = editListCopy[i];
              if (data.uuid == item.uuid) {
                data.warehouseList = this.warehouseList;
              }
            }
            this.editData.faItemList = editListCopy;
            this.$forceUpdate();
          }
          break;
        case 'inputSubInventoryName':
          console.log('入库库位值改变：', val, item, fieldItem);
          
          break;
        case 'confirmNumbers':
          console.log('确认书号值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            for (var j = 0; j < data.allocationList.length; j++) {
              if (data.allocationList[j].uuid == item.uuid) {
                let aData = data.allocationList[j];
                // 确认书列表
                this.confirmNumbersByMCHandle(aData, data.virtualInventoryId);
              }
            }
          }
          this.editData.faItemList = editListCopy;
          break;
        default:
          break;
      }
    },
    unitNumberInputChange(val, item, fieldItem, step) {
      console.log('unitNumberInput值改变：', val, item, fieldItem, step);
      let field = '';
      if (step == 'first') {
        field = fieldItem.field_1;
      } else if (step == 'second') {
        field = fieldItem.field_2;
      }
      switch (field) {
        case 'allocationPackages':
          // 调拨数量包数
          console.log('调拨数量包数值改变：', val, item, fieldItem, step);
          item.allocationQuantity = Number(item.allocationPackages) * Number(item.allocationQuantityPerPackage);
          this.$forceUpdate();
          break;
        case 'allocationQuantityPerPackage':
          // 调拨数量规格
          console.log('调拨数量规格改变：', val, item, fieldItem, step);
          // item.allocationQuantity = Number(item.allocationPackages) * Number(item.allocationQuantityPerPackage);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            for (var j = 0; j < data.allocationList.length; j++) {
              if (data.allocationList[j].uuid === item.uuid) {
                // 获取可用数量及调拨数量规格
                // this.getPaidMeterHandle(data.allocationList[j], data, j, i);
                if (data.allocationList[j].materialCode && data.allocationList[j].confirmNumbers && data.allocationList[j].allocationQuantityPerPackage) {
                  this.getAllocationQuantityHandle(data.allocationList[j], data, j, i);
                }
              }
            }
          }
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },
    addEditItemHandle(index, item) {
      // 添加子数据
      // console.log('添加子数据：', index, item);
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let addChildDataCopy = JSON.parse(JSON.stringify(this.addChildData));
      this.getUUIDHandle(addChildDataCopy);
      addChildDataCopy.materialCode = editDataCopy.faItemList[index].materialCode;
      this.updateEditModeSet('add', addChildDataCopy);
      editDataCopy.faItemList[index].allocationList.push(addChildDataCopy);
      // for (let i = 0; i < editDataCopy.faItemList[index].allocationList.length; i++) {
      //   let aData = editDataCopy.faItemList[index].allocationList[i];
      //   if (!aData.uuid) {
      //     this.getUUIDHandle(aData);
      //   }
      // }
      this.editData = editDataCopy;
    },
    deleteEditItemHandle(pi, ci, data) {
      // 删除子数据
      // console.log('删除子项：', pi, ci, data);
      if (ci === 0 && this.editData.faItemList[pi].allocationList.length <= 1) {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        editDataCopy.faItemList.splice(pi, 1);
        this.editData = editDataCopy;
        this.$forceUpdate();
      } else {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        editDataCopy.faItemList[pi].allocationList.splice(ci, 1);
        this.editData = editDataCopy;
        this.$forceUpdate();
      }
    },

    async getProductCodeHandle(data) {
      // 通过物料编号获取产品编号
      data.productCode = '';
      await getProductCodeByMC(data.materialCode, '', data.productCode).then(res => {
        // console.log('通过物料编号获取产品编号：', res);
        if (res.code === '0') {
          if (!res.data || !res.data.length) {
            this.$message({
              type: 'error',
              message: '该物料编号下未查询到产品编号！'
            });
            return false;
          }
          let pcArr = [];
          for (var i = 0; i < res.data.length; i++) {
            pcArr.push(res.data[i].productCode);
          }
          data.productCode = pcArr.join(',');
          data.productCodeList = res.data;
          this.$forceUpdate();
        }
      });
    },
    async getAvailableInventoryHandle(item, index) {
      // 调出库可用库存
      let params = {
        materialCode: item.materialCode,
        inventory: item.virtualInventoryId,
        subInventory: item.subInventory,
        allocationType: this.editData.allocationType
      };
      await factoryAvailableInventory(params).then(res => {
        if (res.code === '0') {
          item.availableInventory = res.data;
          // this.$set(this.editData.faItemList, index, item);
        }
      });
    },
    async getPaymentMethodHandle(item, fItem, index, fIndex) {
      // 付款方式
      let params = {
        materialCode: item.materialCode,
        inventory: item.virtualInventoryId,
        confirmingCode: item.confirmNumbers
      };
      await getPaymentMethodByCN(params).then(res => {
        // console.log('根据确认书和物料编码带出货妥记录的付款方式：', res);
        if (res.code === '0') {
          for (let i in res.data) {
            item.paymentMethod = i;
            item.paymentMethodName = res.data[i];
          }
          this.$set(this.editData.faItemList[fIndex].allocationList, index, item);
        }
      });
    },
    async getAllocationQuantityHandle(item, fItem, index, fIndex) {
      // 调拨数量
      await getAllocationQuantityByCN(item.materialCode, item.confirmNumbers, item.allocationQuantityPerPackage).then(res => {
        // console.log('根据确认书号查询调拨数量：', res);
        if (res.code === '0') {
          item.allocationPackages = res.data.allocationPackages;
          item.allocationQuantity = res.data.allocationQuantity;
          item.allocationQuantityPerPackage = res.data.allocationQuantityPerPackage;
          this.$set(this.editData.faItemList[fIndex].allocationList, index, item);
        }
      });
    },
    async getPaidMeterHandle(item, fItem, index, fIndex) {

      
      // 可用数量、货妥规格集合
      let params = {
        materialCode: item.materialCode,
        inventory: fItem.virtualInventoryId,
        confirmingCode: item.confirmNumbers
      };
      await getPaidMeterByCN(params).then(res => {
        // console.log('根据确认书和物料编码查出货妥规格集合及可用数量：', res);
        if (res.code === '0' && res.data) {
          item.confirmAvailableQuantity = res.data.paidMeter ? res.data.paidMeter : '0';
          item.packSpecificationList = res.data.packSpecification;
          this.$set(this.editData.faItemList[fIndex].allocationList, index, item);
        }
      });
    },
    async confirmNumbersByMCHandle(item, inventory) {
      // 确认书列表
      await getConfirmNumbersByMC(item.materialCode ? item.materialCode : '', inventory ? inventory : '').then(res => {
        // console.log('根据物料编码获取确认书列表：', res);
        if (res.code === '0') {
          item.confirmNumberList = res.data;
          this.$forceUpdate();
        }
      });
    },
    async getMeasurementUnit(item) {
      // 计量单位查询
      await getMeasurementUnitByMC(item.materialCode).then(res => {
        if (res.code === '0') {
          item.purchaseMeasurementUnit = res.data;
          this.$forceUpdate();
        }
      });
    },
    transferTypeListHandle() {
      // 调拨类型列表
      constDictList('TransferType').then(res => {
        // console.log('调拨类型列表：', res);
        if (res.code === '0') {
          this.transferTypeList = res.data;
        }
      });
    },
    async warehouseListHandle() {
      // 仓位列表
      await constDictList('VirtualInventory').then(res => {
        // console.log('仓位列表：', res);
        if (res.code === '0') {
          this.warehouseList = res.data;
        }
      });
    },
    async supplierListHandle() {
      // 供应商列表
      await supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    async getUUIDHandle(data) {
      await getUUID().then(res => {
        if (res.code === '0') {
          data.uuid = res.data;
        }
      });
    }

  }

}
</script>