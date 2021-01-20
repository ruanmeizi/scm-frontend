<template>
  <div class="container reserve">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">预留类型：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="reserveType"
              placeholder="请选择"
              @change="searchHandle">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in reserveTypeList"
                :key="item.dictItemValue"
                :label="item.dictItemName"
                :value="item.dictItemValue"
              ></el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">业务编号：</span>
            <el-input class="input_single w200 mr10" v-model="saleOrderId" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">预留单号：</span>
            <el-input class="input_single w200 mr10" v-model="reserveId" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">期望交期：</span>
            <el-date-picker
              class="mr10"
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
          <div class="display_ib mr10 mb10">
            <span class="tag">计划调拨时间：</span>
            <el-date-picker
              v-model="latestTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
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
        <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
            v-loading="tableLoading">
            <!-- <Table
              :tableList="reserveList"
              :parentData="parentData"
              :childData="childData"
              :tableFieldsList="allFieldList"
              :tableParentFieldsList="parentFieldsList"
              :tableLoading="tableLoading"
              @editHandle="editHandle"
              @submitHandle="submitHandle"
              @removeHandle="removeHandle"
              @deleteHandle="deleteHandle"
              @removeItemHandle="removeItemHandle">
            </Table> -->

            <el-table
              class="table_list"
              ref="multipleTable"
              v-loading="listLoading"
              :data="reserveList"
              row-key="id"
              :expand-row-keys="expands"
              @row-click="rowClick"
              border
              fit
              stripe>
              <!-- <el-table-column type="selection" /> -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="actions_wrap mb20 clearfix">
                    <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                    <el-button v-if="scope.row.auditStatus == 'Draft' || scope.row.auditStatus == 'Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                  </div>
                  <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    v-loading="childListLoading"
                    :data="scope.row.planReserveItemList"
                    border
                    fit>
                    <!-- <el-table-column fixed type="selection" /> -->
                    <el-table-column fixed label="行号">
                      <template slot-scope="{ row }">
                        {{ row.sn }}
                      </template>
                    </el-table-column>
                    <el-table-column fixed label="产品编号">
                      <template slot-scope="{ row }">
                        {{ row.productCode }}
                      </template>
                    </el-table-column>
                    <el-table-column label="物料编号">
                      <template slot-scope="{ row }">
                        {{ row.materialCode }}
                      </template>
                    </el-table-column>
                    <el-table-column label="计划预留数量">
                      <template slot-scope="{ row }">
                        {{ row.planReserveMeter + row.purchaseMeasurementUnit }}
                      </template>
                    </el-table-column>
                    <el-table-column label="预留库位">
                      <template slot-scope="{ row }">
                        {{ row.subInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="期望交期">
                      <template slot-scope="{ row }">
                        {{ row.reserveExpectDate }}
                      </template>
                    </el-table-column>
                    <el-table-column label="预计实际交期">
                      <template slot-scope="{ row }">
                        {{ row.reserveRealDate }}
                      </template>
                    </el-table-column>
                    <el-table-column label="在途确认书号">
                      <template slot-scope="{ row }">
                        {{ row.shippmentConfirmNo }}
                      </template>
                    </el-table-column>
                    <el-table-column label="在途">
                      <template slot-scope="{ row }">
                        {{ row.shippmentMeter + row.purchaseMeasurementUnit }}
                      </template>
                    </el-table-column>
                    <el-table-column label="货妥确认书号">
                      <template slot-scope="{ row }">
                        {{ row.producedConfirmNo }}
                      </template>
                    </el-table-column>
                    <el-table-column label="货妥">
                      <template slot-scope="{ row }">
                        {{ row.producedMeter + row.purchaseMeasurementUnit }}
                      </template>
                    </el-table-column>
                    <el-table-column label="在产确认书号">
                      <template slot-scope="{ row }">
                        {{ row.producingConfirmNo }}
                      </template>
                    </el-table-column>
                    <el-table-column label="在产">
                      <template slot-scope="{ row }">
                        {{ row.producingMeter + row.purchaseMeasurementUnit }}
                      </template>
                    </el-table-column>
                    <el-table-column label="询单">
                      <template slot-scope="{ row }">
                        {{ row.requestedMeter + row.purchaseMeasurementUnit }}
                      </template>
                    </el-table-column>
                    <el-table-column label="预留状态">
                      <template slot-scope="{ row }">
                        {{ row.reserveStatusName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="备注">
                      <template slot-scope="{ row }">
                        {{ row.remark }}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right">
                      <template slot-scope="{ row, $index }">
                        <el-button v-if="row.reserveStatus == 'Reserve'" class="el-icon-close" type="primary" circle size="mini" title="解除" @click.stop="removeItemHandle($index, row)"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="预留单号">
                <template slot-scope="{ row }">
                  {{ row.reserveId }}
                </template>
              </el-table-column>
              <el-table-column label="预留类型">
                <template slot-scope="{ row }">
                  {{ row.reserveTypeName }}
                </template>
              </el-table-column>
              <el-table-column label="业务编号">
                <template slot-scope="{ row }">
                  <span v-if="row.isCustomerOrderType || row.isNotCustomerOrderType">{{ row.saleOrderId }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="客户名称">
                <template slot-scope="{ row }">
                  <span v-if="row.isCustomerOrderType">{{ row.customerName }}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="仓位">
                <template slot-scope="{ row }">
                  {{ row.inventoryName }}
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
                  <div v-if="row.auditStatus == 'Approved'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                    <el-button v-if="row.reserveStatus == 'Reserve'" class="el-icon-close" type="primary" circle size="mini" title="整单解除" @click.stop="removeHandle($index, row)"></el-button>
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
        <div class="display_ib mr10">
          <span class="tag"><span class="red mr5">*</span>预留类型：</span>
          <el-select class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model="editData.reserveType"
            @change="reserveTypeChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in reserveTypeList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemValue">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="tag"><span class="red mr5">*</span>预留仓位：</span>
          <el-select class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model="editData.inventory"
            @change="inventoryChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in inventoryTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10" v-if="isCustomOrder">
          <span class="tag"><span class="red mr5">*</span>业务编号：</span>
          <el-input class="input_single w200 mr10 mb10" :disabled="!isEmptyData" v-model="editData.saleOrderId" placeholder="请输入"></el-input>
        </div>
        <el-button
          v-if="isCustomOrder"
          class="mr10"
          size="small"
          type="primary"
          icon="el-icon-refresh-right"
          circle
          title="拉取数据"
          :disabled="!isEmptyData"
          @click="pullDataHandle"
        ></el-button>
        <div class="display_ib mr10" v-if="isCustomOrder && editData.customerName">
          <span class="tag">客户名称：</span>
          <span class="tag">{{editData.customerName}}</span>
          <!-- <el-input class="input_single w200 mr10 mb10" v-model="editData.customerId" type="hidden" placeholder=""></el-input> -->
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
      <upload-excel-component class="mb20" :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />
      <div class="hidden">
        <!-- 编辑组件 -->
        <editTable
          :tableList="editData.planReserveItemList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          @deleteHandle="deleteEditItemHandle"
          @inputChange="inputChange"
          @selectChange="selectChange"
          @selectVisibleChange="selectVisibleChange"
          @datePickerChange="datePickerChange"
          @numberInputChange="numberInputChange">
        </editTable>

        <div class="edit_btn_wrap mt20 fr" v-if="!isEmptyData">
          <el-button @click="cancelEditHandle">取消</el-button>
          <el-button type="primary" :disabled="isSaveDisabled" @click="saveEditHandle">保存</el-button>
          <el-button v-if="editItemStatus == 'Draft' || editItemStatus == 'Approved' || isAddEnter" type="primary" :disabled="isSubmitDisabled" @click="submitEditHandle">提交审批</el-button>
        </div>

        <div class="t_right mt20" v-if="isEmptyData">
          <el-button @click="cancelEditHandle">取消</el-button>
          <el-button type="primary" :disabled="isEmptyData">保存</el-button>
          <el-button type="primary" :disabled="isEmptyData">提交审批</el-button>
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

    <!-- 解除预留弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="removeDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定解除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRemoveHandle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 解除预留子项弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="removeItemDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定解除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeItemDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRemoveItemHandle">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  getUUID,
  getMeasurementUnitByMC,
  approvalProcessInfo
} from "@/api/publicApi.js";
import {
  planReserveList,
  reserveTypeList,
  inventoryTypeList,
  subInventoryTypeList,
  editPlanReserve,
  deletePlanReserve, 
  removePlanReserve,
  removePlanReserveItem,
  submitPlanReserve,
  searchUsername,
  searchMaterialCode,
  reserveQuantitysList,
  pullToolProduction,
  pullClothProduction
} from "@/api/module/planReserveApi.js";
import { timeFormat, excelDateFormatToDate, getTimeRange} from "@/utils/index.js";
import { statusTypeHandle } from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editTable from "@/layouts/components/common/EditTableList.vue";
import Excel from "@/layouts/components/Excel.vue";
export default {
  name: "reserve",
  props: [],
  data() {
    return {
      // Table组件
      tableLoading: true,
      parentData: {
        status: '',
        data: [
          {
            name: '创建时间',
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
            name: '预留单号',
            field: 'reserveId',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '预留类型',
            field: 'reserveTypeName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '业务编号',
            field: 'saleOrderId',
            class: 'w12p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '客户名称',
            field: 'customerName',
            class: 'w8p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '仓位',
            field: 'inventoryName',
            class: 'w5p',
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
        name: 'planReserveItemList',
        data: [
          {
            name: '',
            field: 'productCode',
            class: 'w13p'
          },
          {
            name: '',
            field: 'materialCode',
            class: 'w13p'
          },
          {
            name: '',
            field: 'planReserveMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w13p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'reserveExpectDate',
            class: 'w13p'
          },
          {
            name: '',
            field: 'latestTransferDate',
            class: 'w13p'
          },
          {
            name: '',
            field: 'reserveRealDate',
            class: 'w13p'
          },
          {
            name: '',
            field: 'shippmentMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w13p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'producedMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w13p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'producingMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w13p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'requestedMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w13p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'reserveStatusName',
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
            class: 'w10p fr',
            isAction: true
          }
        ]
      },

      isShowEdit: false,
      isAddEnter: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      isShowList: false,
      isCustomOrder: false,
      isEmptyData: false,
      editType: '',
      dateVal: '',
      activeName: 'All',
      editItemStatus: '',
      reserveOrRemove: '',
      auditStatus: '',
      materialCode: '',
      reserveId: '',
      reserveType: '',
      saleOrderId: '',
      startReserveDate: '',
      endReserveDate: '',
      reserveList: [],
      reserveTypeList: [],
      inventoryTypeList: [],
      subInventoryTypeList: [],
      expands:[],
      editData: {},
      editDataClone: {},
      deleteId: '',
      submitId: '',
      removeId: '',
      removeItemId: '',
      submitParamsData: {},
      planReserveMeterCopy: '',
      reserveStatusInfo: '',
      deleteDialogVisible: false,
      submitDialogVisible: false,
      removeDialogVisible: false,
      removeItemDialogVisible: false,
      editItemData:  {
        isAdd: true,
        inventory: '',
        subInventory: '',
        subInventoryTypeList: [],
        materialCode: '',
        materialName: '',
        planAvailableMeter: 0,
        planReserveMeter: 0,
        producedMeter: 0,
        producingMeter: 0,
        productCode: '',
        productName: '',
        remark: '',
        requestedMeter: 0,
        reserveExpectDate: '',
        reserveId: '',
        reserveRealDate: '',
        reserveStatus: '',
        reserveType: '',
        saleOrderId: '',
        shippmentMeter: 0,
        uuid: '',
        purchaseMeasurementUnit: ''
      },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: false,
      childListLoading: false,
      selectUuidList: [],
      editPartLoading: false,

      subNavList: [
        {
          label: '全部计划预留请求',
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
      allFieldList: [
        {
          name: '产品编号',
          class: 'w13p'
        },
        {
          name: '物料编号',
          class: 'w13p'
        },
        {
          name: '计划预留数量',
          class: 'w13p'
        },
        {
          name: '期望交期',
          class: 'w13p'
        },
        {
          name: '最晚调拨时间',
          class: 'w13p'
        },
        {
          name: '预计实际交期',
          class: 'w13p'
        },
        {
          name: '在途',
          class: 'w13p'
        },
        {
          name: '货妥',
          class: 'w13p'
        },
        {
          name: '在产',
          class: 'w13p'
        },
        {
          name: '询单',
          class: 'w13p'
        },
        {
          name: '预留状态',
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
          name: '预留单号',
          class: 'w12p'
        },
        {
          name: '预留类型',
          class: 'w8p'
        },
        {
          name: '业务编号',
          class: 'w12p'
        },
        {
          name: '客户名称',
          class: 'w8p'
        },
        {
          name: '仓位',
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
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '150',
          isRules: true
        },
        {
          name: '* 计划预留数量',
          field: 'planReserveMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150',
          isRules: true,
          isQuantityField: true
        },
        {
          name: '可计划数量',
          field: 'planAvailableMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '预留库位',
          field: 'subInventoryName',
          class: 'w16p',
          width: '150'
        },
        {
          name: '* 期望交期',
          field: 'reserveExpectDate',
          class: 'w18p',
          width: '180',
          isRules: true
        },
        {
          name: '预计实际交期',
          field: 'reserveRealDate',
          class: 'w16p',
          width: '180'
        },
        {
          name: '在途确认书号',
          field: 'shippmentConfirmNo',
          class: 'w13p',
          width: '180'
        },
        {
          name: '在途',
          field: 'shippmentMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150'
        },
        {
          name: '货妥确认书号',  // 货妥确认书号
          field: 'producedConfirmNo',
          class: 'w13p',
          width: '180'
        },
        {
          name: '货妥',
          field: 'producedMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150'
        },
        {
          name: '在产确认书号',
          field: 'producingConfirmNo',
          class: 'w13p',
          width: '180'
        },
        {
          name: '在产',
          field: 'producingMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150'
        },
        {
          name: '询单',
          field: 'requestedMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '150'
        },
        {
          name: '已预留数量',
          field: 'reservedQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w16p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w16p',
          width: '150'
        }
      ],
      leaderFieldsList: [
        {
          name: '行号',
          field: 'sn',
          class: 'w16p',
          width: '50'
        },
        {
          name: '* 产品编号',
          field: 'productCode',
          class: 'w16p',
          width: '180',
          isRules: true
        }
      ],
      tailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          isAction: true,
          hasDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        sn: true,
        materialCode: true,
        planAvailableMeter: true,
        reservedQuantity: true
      },
      inputSet: {
        productCode: true,
        shippmentConfirmNo: true,
        producedConfirmNo: true,
        producingConfirmNo: true,
        remark: true,
        inputData: {
          maxlength: '',
          placeholder: ''
        }
      },
      selectSet: {
        subInventoryName: {
          selectListName: 'subInventoryTypeList',
          value: 'subInventory',
          label: 'subInventoryName'
        },
        selectData: {
          selectListName: '',
          value: '',
          label: ''
        }
      },
      numberInputSet: {
        planReserveMeter: true,
        shippmentMeter: true,
        producedMeter: true,
        producingMeter: true,
        requestedMeter: true
      },
      datePickerSet: {
        reserveExpectDate: true,
        reserveRealDate: true
      },
      
      latestTime:'',
      childHeaderList: ['行号', '预留单号', '产品编号', '物料编号', '计划预留数量', '预留库位', '期望交期', '预计实际交期', '在途确认书号', '在途', '货妥确认书号', '货妥', '在产确认书号', '在产', '询单', '预留状态', '备注'],
      childFieldsList: ['sn', 'reserveId', 'productCode', 'materialCode', 'planReserveMeter', 'subInventoryName', 'reserveExpectDate', 'reserveRealDate', 'shippmentConfirmNo', 'shippmentMeter', 'producedConfirmNo', 'producedMeter', 'producingConfirmNo', 'producingMeter', 'requestedMeter', 'reserveStatusName', 'remark'],
      
    };
  },
  components: {
    Table,
    editTable,
    Excel,
    UploadExcelComponent
  },
  beforeCreate() {},
  created() {},
  mounted() {
    // this.getPlanReserveList();
    this.fun_date();
    this.getReserveTypeList();
    this.getInventoryTypeList();
    // this.addDate();
  },
  activated() {},
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
  watch: {},
  computed: {},
  methods: {
    rowClick(row, event, column) {
      // 单击项
      Array.prototype.remove = function (val) {
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
      if (!this.editData.reserveType) {
        this.$message({
          type: 'error',
          message: '请选择预留类型！'
        });
        this.editPartLoading = false;
        return false;
      }
      if (!this.editData.inventory) {
        this.$message({
          type: 'error',
          message: '请选择预留仓位！'
        });
        this.editPartLoading = false;
        return false;
      }
      if (this.isCustomOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入业务编号！'
          });
          this.editPartLoading = false;
          return false;
        }
      }
      if (results && results.length) {
        let editData = {};
        if (this.isEmptyData) {
          // 空数据
          editData = {
            uditOption: '',
            auditPerson: '',
            auditStatus: '',
            auditTime: '',
            customerName: '',
            inventory: '',
            planReserveItemList: [],
            proposer: '',
            reserveId: '',
            reserveType: '',
            saleOrderId: '',
            subInventory: '',
            submitType: '',
            uuid: ''
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
          editData = JSON.parse(JSON.stringify(this.editData));
          editData.planReserveItemList = [];
        }

        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
          await getUUID().then(res => {
            if (res.code === '0') {
              editItemCopy.uuid = res.data;
            }
          });
          editItemCopy.planReserveMeter = editItemCopy.shippmentMeter + editItemCopy.producedMeter + editItemCopy.producingMeter + editItemCopy.requestedMeter;
          editItemCopy.subInventoryTypeList = this.subInventoryTypeList;
          this.updateEditModeSet('add', editItemCopy);
          Object.keys(item).map((key) => {
            // console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '预留单号') {
              editItemCopy.reserveId = item[key];
            } else if (key === '行号') {
              editItemCopy.sn = item[key];
            } else if (key === '产品编号') {
              editItemCopy.productCode = item[key];
            } else if (key === '物料编号') {
              editItemCopy.materialCode = item[key];
            } else if (key === '计划预留数量') {
              editItemCopy.planReserveMeter = item[key];
            } else if (key === '预留库位') {
              editItemCopy.subInventoryName = item[key];
              let subInventoryData = this.subInventoryTypeList.find(x => {
                return x.subInventoryName === item[key];
              });
              editItemCopy.subInventory = subInventoryData ? subInventoryData.subInventory : '';
            } else if (key === '期望交期') {
              editItemCopy.reserveExpectDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key === '预计实际交期') {
              editItemCopy.reserveRealDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key === '在途确认书号') {
              editItemCopy.shippmentConfirmNo = item[key];
            } else if (key === '在途') {
              editItemCopy.shippmentMeter = item[key];
            } else if (key === '货妥确认书号') {
              editItemCopy.producedConfirmNo = item[key];
            } else if (key === '货妥') {
              editItemCopy.producedMeter = item[key];
            } else if (key === '在产确认书号') {
              editItemCopy.producingConfirmNo = item[key];
            } else if (key === '在产') {
              editItemCopy.producingMeter = item[key];
            } else if (key === '询单') {
              editItemCopy.requestedMeter = item[key];
            } else if (key === '预留状态') {
              editItemCopy.reserveStatusName = item[key];
            } else if (key === '备注') {
              editItemCopy.remark = item[key];
            }
          });
          editData.planReserveItemList.push(editItemCopy);
        }

        for (let i = 0; i < editData.planReserveItemList.length; i++) {
          let item = editData.planReserveItemList[i];
          // 获取物料编号和计量单位
          this.getMaterialCodeHandle(item);
          // 拉取数量数据
          // this.pullQuantitysDataHandle(item);
          // 拉取数量数据
          let quantitysData = {
            inventory: this.editData.inventory,
            materialCode: item.materialCode,
            subInventory: ''
            // subInventory: data.subInventory
          };
          reserveQuantitysList(quantitysData).then(res =>{
            // console.log('拉取数据：', res);
            if (res.code === '0') {
              item.planAvailableMeter = res.data.subsequentStockRuantity ? (res.data.subsequentStockRuantity < 0 ? 0 : res.data.subsequentStockRuantity) : 0;  // 可计划数量
            }
          });
        }
        this.editData = editData;
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },
    
    excelDownload() {
      let headerList = [];
      let fieldsList = ['reserveId', 'reserveTypeName', 'saleOrderId', 'customerName', 'inventoryName', 'createTime', 'applicantName', 'auditStatusName'];
      this.parentFieldsList.forEach(hItem => {
        headerList.push(hItem.name);
      });
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.reserveList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '计划预留',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.planReserveItemList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.reserveId,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // 固定展示为两周前的时间范围
    fun_date() {
       console.log(getTimeRange(14))//两周前的日期
      this.dateVal=getTimeRange(14);
      this.latestTime=this.dateVal[1];
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
          this.$set(this.reserveList, index, item);
          this.$forceUpdate();
        }
      });
    },
    addDate() {
        var nowDate = new Date();
        let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate(),
        }
        if(date.date<10){
            date.date = '0'+ date.date;  //补齐
        }
        this.latestTime = date.year + '-' + 0 + date.month + '-'  + date.date;
    },

    async pullDataHandle() {
      // 拉取数据
      let data = {
        auditOption: '',
        auditPerson: '',
        auditStatus: '',
        auditTime: '',
        customerName: '',
        inventory: '',
        planReserveItemList: [],
        proposer: '',
        reserveId: '',
        reserveType: '',
        reserveTypeName: '',
        saleOrderId: '',
        subInventory: '',
        submitType: '',
        uuid: ''
      };
      data.reserveType = this.editData.reserveType;
      data.reserveTypeName = this.editData.reserveTypeName;
      data.inventory = this.editData.inventory;
      data.saleOrderId = this.editData.saleOrderId;
      data.subInventory=this.editData.subInventory;
      if (!data.inventory) {
        this.$message({
          type: 'error',
          message: '请选择预留仓位！'
        });
        return false;
      }
      if (!data.saleOrderId) {
        this.$message({
          type: 'error',
          message: '请输入业务编号！'
        });
        return false;
      }
      await getUUID().then(res => {
        if (res.code === '0') {
          data.uuid = res.data;
        }
      });

      if (data.reserveType.substr(0, 1) == 'A') {
        // 客订
        searchUsername({saleOrderId: this.editData.saleOrderId}).then(res => {
          // console.log('销售单号：', res);
          if (res.code === '0') {
            if (!res.data) {
              this.$message({
                type: 'error',
                message: '此销售订单下无数据!'
              });
              return false;
            }
            data.customerName = res.data.customerName;
            this.editData.customerName = res.data.customerName;
            // this.editData.customerId = res.data.customerId;
            if (res.data.saleOrderItemList.length) {
              this.isEmptyData = false;
              for (var i = 0; i < res.data.saleOrderItemList.length; i++) {
                let orderData = res.data.saleOrderItemList[i];
                this.updateEditModeSet('edit', orderData);
                getUUID().then(res => {
                  if (res.code === '0') {
                    orderData.uuid = res.data;
                  }
                });
                orderData.isAdd = true;
                orderData.planReserveMeter = orderData.shippmentMeter + orderData.producedMeter + orderData.producingMeter + orderData.requestedMeter;
                orderData.subInventoryTypeList = this.subInventoryTypeList;
                orderData.reserveExpectDate = res.data.orderUpdateTime;
                //orderData.productCode = orderData.productId;
                orderData.planReserveMeter = orderData.quantity;
                // 拉取数量数据
                // this.pullQuantitysDataHandle(orderData);
              }
            }
            data.planReserveItemList = res.data.saleOrderItemList;
            this.editData = data;
          } else {
            data.customerName = '';
            this.editData.customerName = '';
            // this.editData.customerId = '';
          }
        });
      } else if (data.reserveType.substr(0, 1) == 'B') {
        // 非客订
        if (!data.reserveTypeName.includes('面料')) {
          pullToolProduction(this.editData.saleOrderId).then(res => {
            // console.log('根据MO拉取销售工具生产单：', res);
            if (res.code === '0') {
              if (!res.data.length) {
                this.$message({
                  type: 'error',
                  message: '此销售订单下无数据!'
                });
                return false;
              }
              this.isEmptyData = false;
              for (var i = 0; i < res.data.length; i++) {
                let orderData = res.data[i];
                this.updateEditModeSet('edit', orderData);
                orderData.productCode = orderData.sourceProductCode;
                orderData.materialCode = orderData.sourceMaterialCode;
                orderData.planReserveMeter = orderData.sourceQuantity;
                orderData.reserveExpectDate = orderData.requiredDate;
                orderData.subInventoryTypeList = this.subInventoryTypeList;
                
                // 拉取数量数据
                // this.pullQuantitysDataHandle(orderData);

              }
              data.planReserveItemList = res.data;
              this.editData = data;
            }
          });
        }
      }
    },
    async getMaterialCodeHandle(item) {
      await searchMaterialCode(item.productCode).then(res => {
        if (res.code === '0' && res.data) {
          item.materialCode = res.data;
          // 计量单位
          this.getMeasurementUnitHandle(item);
        } else {
          item.materialCode = '';
        }
      });
    },
    async pullQuantitysDataHandle(data) {
      // 拉取数量数据
      let quantitysData = {
        inventory: this.editData.inventory,
        materialCode: data.materialCode,
        subInventory: ''
        // subInventory: data.subInventory
      };
      await reserveQuantitysList(quantitysData).then(res =>{
        // console.log('拉取数据：', res);
        if (res.code === '0') {
          data.producingMeter = res.data.inProductionNumber ? res.data.inProductionNumber : 0; //在产
          data.producedMeter = res.data.cargoQuantity ? res.data.cargoQuantity : 0; //货妥
          data.shippmentMeter = res.data.shippmentInventory ? res.data.shippmentInventory : 0; //在途
          data.requestedMeter = res.data.purchaseOrderItemDraft ? res.data.purchaseOrderItemDraft : 0; //询单
          data.planAvailableMeter = res.data.subsequentStockRuantity ? (res.data.subsequentStockRuantity < 0 ? 0 : res.data.subsequentStockRuantity) : 0;  // 可计划数量
        }
      });
    },
    
    reserveTypeChange(val) {
      // 预留类型更新
      // 客订：A... 非客订：B... 其他：C...
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      let reserveTypeData = this.reserveTypeList.find(item => {
        return item.dictItemValue == val;
      });
      editDataCopy.reserveTypeName = reserveTypeData.dictItemName;
      this.editData = editDataCopy;

      // this.isCustomOrder = (val.indexOf('A') != -1 ? true : false);  // 客订
      if (val.substr(0, 1) == 'A') {
        // 客订
        this.isCustomOrder = true;
      }
      if (val.substr(0, 1) == 'B') {
        // 非客订
        if (this.editData.reserveTypeName.includes('面料')) {
          this.isCustomOrder = false;
        } else {
          this.isCustomOrder = true;
        }
      }
      if (val.substr(0, 1) == 'C') {
        // 其他
        this.isCustomOrder = false;
      }
    },
    inventoryChange(val) {
      // 预留仓位更改
      if (this.editData.planReserveItemList && this.editData.planReserveItemList.length) {
        this.editData.planReserveItemList.forEach(item => {
          item.subInventory = '';
        });
      }
      this.getSubInventoryTypeList(val);
    },
    fieldsByReserveType(reserveTypeName) {
      // 根据不同预留类型显示父项字段
      if (reserveTypeName.slice(0, 2) == '客订') {
        this.isShowSaleOrderId = true;
        this.isShowCustomerName = true;
      } else if (reserveTypeName.includes('非客订')) {
        if (reserveTypeName.includes('面料')) {
          // 非客订-面料
          this.isNotRequiredSOI = true;
          this.isDisabledPull = true;
        } else {
          this.isNotRequiredSOI = false;
          this.isDisabledPull = false;
        }
        this.isShowSaleOrderId = true;
        this.isShowCustomerName = false;
      } else {
        // 其他
        this.isNotRequiredSOI = true;
        this.isDisabledPull = true;
        this.isShowSaleOrderId = true;
        this.isShowCustomerName = false;
      }
    },
    addHandle() {
      this.editData = {};
      this.editType = 'add';
      this.isShowEdit = true;
      this.isEmptyData = true;
      this.isCustomOrder = false;
      this.isAddEnter = true;
    },
    deleteHandle(index, item) {
      // 删除
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deletePlanReserve(this.deleteId).then(res => {
        // console.log('删除项：', res);
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getPlanReserveList();
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
      this.editType = 'edit';
      this.isEmptyData = false;
      this.isShowEdit = true;
      this.isCustomOrder = (item.reserveType.indexOf('A') != -1 ? true : false);
      item.inventory ? this.getSubInventoryTypeList(item.inventory) : '';
      for (var i = 0; i < item.planReserveItemList.length; i++) {
        let cItem = item.planReserveItemList[i];
        // // 查询库位名称
        // if (cItem.subInventory) {
        //   let subInventoryData = this.subInventoryTypeList.find(siItem => {
        //     return siItem.subInventory == cItem.subInventory;
        //   });
        //   cItem.subInventoryName = subInventoryData ? subInventoryData.subInventoryName : '';
        // }
        this.updateEditModeSet('edit', cItem);
        // cItem.planReserveMeter = parseInt(cItem.shippmentMeter) + parseInt(cItem.producedMeter) + parseInt(cItem.producingMeter) + parseInt(cItem.requestedMeter);
        cItem.planReserveMeterCopy = JSON.parse(JSON.stringify(cItem.planReserveMeter));
      }
      this.editData = JSON.parse(JSON.stringify(item));
      this.editDataClone = JSON.parse(JSON.stringify(item));
      this.editItemStatus = item.auditStatus;
      this.$forceUpdate();
    },
    submitHandle(index, item) {
      // 提交
      // this.submitParamsData = {
      //   auditStatus: 'Approving',
      //   auditTime: item.auditTime,
      //   uuid: item.uuid,
      //   reserveId: item.reserveId,
      //   applicant: this.$store.state.userName,
      //   applicantName: this.$store.state.realName,
      //   applicantDepartment: this.$store.state.currentDepartment.id,
      //   applicantDepartmentName: this.$store.state.currentDepartment.name
      // };
      this.submitId = item.id;
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      submitPlanReserve(this.submitId).then(res => {
        // console.log('提交审批项：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.auditStatus = 'Approving';
          this.getPlanReserveList();
          this.$message({
            type: 'success',
            message: '提交审批成功!'
          });
          this.activeName = 'Approving';
        }
      });
    },
    removeHandle(index, item) {
      // 解除/预留
      // this.$confirm('确认解除此条信息?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   let data = {
      //     applicant: this.$store.state.userName,
      //     applicantName: this.$store.state.realName,
      //     applicantDepartment: this.$store.state.currentDepartment.id,
      //     applicantDepartmentName: this.$store.state.currentDepartment.name
      //   };
      //   removePlanReserve(item.id, data).then(res => {
      //     // console.log('解除项：', res);
      //     if (res.code === '0') {
      //       this.getPlanReserveList();
      //       this.$message({
      //         type: 'success',
      //         message: '解除成功!'
      //       });
      //     }
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消解除'
      //   });
      // });

      this.removeId = item.id;
      this.removeDialogVisible = true;
    },
    confirmRemoveHandle() {
      // 解除
      let data = {
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      removePlanReserve(this.removeId, data).then(res => {
        // console.log('解除项：', res);
        if (res.code === '0') {
          this.removeDialogVisible = false;
          this.getPlanReserveList();
          this.$message({
            type: 'success',
            message: '解除成功!'
          });
        }
      });
    },
    removeItemHandle(index, item) {
      // 解除/预留子项
      // console.log('解除子项详情：', index, item);
      // this.$confirm('确认解除此条信息?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   removePlanReserveItem(item.id).then(res => {
      //     // console.log('解除子项：', res);
      //     if (res.code === '0') {
      //       this.getPlanReserveList();
      //       this.$message({
      //         type: 'success',
      //         message: '解除成功!'
      //       });
      //     }
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消解除'
      //   });
      // });

      this.removeItemId = item.id;
      this.removeItemDialogVisible = true;
    },
    confirmRemoveItemHandle() {
      // 解除
      removePlanReserveItem(this.removeItemId).then(res => {
        // console.log('解除子项：', res);
        if (res.code === '0') {
          this.removeItemDialogVisible = false;
          this.getPlanReserveList();
          this.$message({
            type: 'success',
            message: '解除成功!'
          });
        }
      });
    },
    async addEditHandle() {
      // 添加编辑项
      console.log('添加编辑项：', this.editData);
      if (!this.editData.reserveType) {
        this.$message({
          type: 'error',
          message: '请选择预留类型！'
        });
        return false;
      }
      if (!this.editData.inventory) {
        this.$message({
          type: 'error',
          message: '请选择预留仓位！'
        });
        return false;
      }
      if (this.isCustomOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入业务编号！'
          });
          return false;
        }
      }
      if (this.isEmptyData) {
        let data = {
          auditOption: '',
          auditPerson: '',
          auditStatus: '',
          auditTime: '',
          customerName: '',
          inventory: '',
          planReserveItemList: [],
          proposer: '',
          reserveId: '',
          reserveType: '',
          saleOrderId: '',
          subInventory: '',
          submitType: '',
          uuid: ''
        };
        let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
        data.reserveType = this.editData.reserveType;
        data.inventory = this.editData.inventory;
        this.editData.saleOrderId ? data.saleOrderId = this.editData.saleOrderId : data.saleOrderId = '';
        editItemCopy.planReserveMeter = editItemCopy.shippmentMeter + editItemCopy.producedMeter + editItemCopy.producingMeter + editItemCopy.requestedMeter;
        editItemCopy.subInventoryTypeList = this.subInventoryTypeList;
        this.updateEditModeSet('add', editItemCopy);
        await getUUID().then(res => {
          if (res.code === '0') {
            data.uuid = res.data;
          }
        });
        await getUUID().then(res => {
          if (res.code === '0') {
            editItemCopy.uuid = res.data;
            data.planReserveItemList.push(editItemCopy);
            this.isEmptyData = false;
          }
        });
        this.editData = data;
      } else {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
        editItemCopy.planReserveMeter = editItemCopy.shippmentMeter + editItemCopy.producedMeter + editItemCopy.producingMeter + editItemCopy.requestedMeter;
        editItemCopy.subInventoryTypeList = this.subInventoryTypeList;
        this.updateEditModeSet('add', editItemCopy);
        await getUUID().then(res => {
          if (res.code === '0') {
            editItemCopy.uuid = res.data;
            editDataCopy.planReserveItemList.push(editItemCopy);
          }
        });
        this.editData = editDataCopy;
      }
    },
    deleteEditItemHandle(index, item) {
      // 删除项
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      editDataCopy.planReserveItemList.splice(index, 1);
      this.editData = editDataCopy;
    },
    cancelEditHandle() {
      // 取消
      this.isShowEdit = false;
      this.isAddEnter = false;
    },
    async wholeQueryHandle(list) {
      let temp = {};
      for (let i = 0; i < list.length; i++) {
        let key = list[i].materialCode;
        if (temp[key]) {
          temp[key].materialCode = temp[key].materialCode;
          temp[key].planReserveMeterTotal += parseFloat(list[i].planReserveMeter);
        } else {
          temp[key] = {};
          temp[key].materialCode = key;
          temp[key].planReserveMeterTotal = list[i].planReserveMeter;
        }
      }
      list.forEach(item => {
        for (let i in temp) {
          if (item.materialCode == i) {
            item.planReserveMeterTotal = temp[i].planReserveMeterTotal;
          }
        }
      });
    },
    saveEditHandle() {
      // 保存
      // console.log('保存数据：', this.editData);
      let list = this.editData.planReserveItemList;
      let planReserveMeterTotal = 0;
      if (this.editData.actions) {
        delete this.editData.actions;
      }
      if (this.editData.isHideFew) {
        delete this.editData.isHideFew;
      }
      if (!list.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.editData.reserveType) {
        this.$message({
          type: 'error',
          message: '请选择预留类型！'
        });
        return false;
      }
      if (!this.editData.inventory) {
        this.$message({
          type: 'error',
          message: '请选择预留仓位！'
        });
        return false;
      }
      if (this.isCustomOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入业务编号！'
          });
          return false;
        }
      }
      this.wholeQueryHandle(list);
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        if (!data.productCode) {
          this.$message({
            type: 'error',
            message: '请输入产品编号！'
          });
          return false;
        }
        if (!data.materialCode) {
          this.$message({
            type: 'error',
            message: '查无此产品编号！'
          });
          return false;
        }
        if (!data.planReserveMeter) {
          this.$message({
            type: 'error',
            message: '请输入计划预留数量！'
          });
          return false;
        }
        if (!this.verificationHandle(data.planReserveMeter, '计划预留数量')) {
          data.planReserveMeter = 0;
          return false;
        }
        if (!data.reserveExpectDate) {
          this.$message({
            type: 'error',
            message: '请输入期望交期！'
          });
          return false;
        }
        if (!this.verificationHandle(data.planAvailableMeter, '可计划数量')) {
          data.planAvailableMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.shippmentMeter, '在途数量')) {
          data.shippmentMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.producedMeter, '货妥数量')) {
          data.producedMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.producingMeter, '在产数量')) {
          data.producingMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.requestedMeter, '询单数量')) {
          data.requestedMeter = 0;
          return false;
        }
        if (data.planReserveMeter !== data.shippmentMeter + data.producedMeter + data.producingMeter + data.requestedMeter) {
          this.$message({
            type: 'error',
            message: '计划预留数量应等于在途、货妥、在产、询单数量之和！'
          });
          return false;
        }
        if (data.planReserveMeter > data.planAvailableMeter) {
          this.$message({
            type: 'error',
            message: '计划预留数量不能大于可计划数量！'
          });
          return false;
        }
        if (data.planReserveMeterTotal > data.planAvailableMeter) {
          this.$message({
            type: 'error',
            message: '相同物料编号下计划预留数量总和不能大于可计划数量！'
          });
          return false;
        }
        if (this.editData.auditStatus === 'Approved' && data.planReserveMeter != data.planReserveMeterCopy) {
          this.$message({
            type: 'error',
            message: '计划预留数量已改变，请提交审批！'
          });
          return false;
        }
        // 删除编辑字段呈现方式集合
        if (data.editModeSet) {
          delete data.editModeSet;
        }
      }
      this.editData.submitType = '1';
      this.editData.applicant = this.$store.state.userName;
      this.editData.applicantName = this.$store.state.realName;
      this.editData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSaveDisabled = true;
      editPlanReserve(this.editData).then(res => {
        // console.log('保存计划预留：', res);
        if (res.code === '0') {
          this.getPlanReserveList();
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.isShowEdit = false;
        }
        this.isSaveDisabled = false;
      });
    },
    submitEditHandle() {
      // 提交审批
      // console.log('提交审批：', this.editData);
      let list = this.editData.planReserveItemList;
      if (this.editData.actions) {
        delete this.editData.actions;
      }
      if (this.editData.isHideFew) {
        delete this.editData.isHideFew;
      }
      if (!list.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.editData.reserveType) {
        this.$message({
          type: 'error',
          message: '请选择预留类型！'
        });
        return false;
      }
      if (!this.editData.inventory) {
        this.$message({
          type: 'error',
          message: '请选择预留仓位！'
        });
        return false;
      }
      if (this.isCustomOrder) {
        if (!this.editData.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入业务编号！'
          });
          return false;
        }
      }
      this.wholeQueryHandle(list);
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        if (!data.productCode) {
          this.$message({
            type: 'error',
            message: '请输入产品编号！'
          });
          return false;
        }
        if (!data.materialCode) {
          this.$message({
            type: 'error',
            message: '查无此产品编号！'
          });
          return false;
        }
        if (!data.planReserveMeter) {
          this.$message({
            type: 'error',
            message: '请输入计划预留数量！'
          });
          return false;
        }
        if (!this.verificationHandle(data.planReserveMeter, '计划预留数量')) {
          data.planReserveMeter = 0;
          return false;
        }
        if (!data.reserveExpectDate) {
          this.$message({
            type: 'error',
            message: '请输入期望交期！'
          });
          return false;
        }
        if (!this.verificationHandle(data.planAvailableMeter, '可计划数量')) {
          data.planAvailableMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.shippmentMeter, '在途数量')) {
          data.shippmentMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.producedMeter, '货妥数量')) {
          data.producedMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.producingMeter, '在产数量')) {
          data.producingMeter = 0;
          return false;
        }
        if (!this.verificationHandle(data.requestedMeter, '询单数量')) {
          data.requestedMeter = 0;
          return false;
        }
        if (data.planReserveMeter !== data.shippmentMeter + data.producedMeter + data.producingMeter + data.requestedMeter) {
          this.$message({
            type: 'error',
            message: '计划预留数量应等于在途、货妥、在产、询单数量之和！'
          });
          return false;
        }
        if (data.planReserveMeter > data.planAvailableMeter) {
          this.$message({
            type: 'error',
            message: '计划预留数量不能大于可计划数量！'
          });
          return false;
        }
        if (data.planReserveMeterTotal > data.planAvailableMeter) {
          this.$message({
            type: 'error',
            message: '相同物料编号下计划预留数量总和不能大于可计划数量！'
          });
          return false;
        }
        // 删除编辑字段呈现方式集合
        if (data.editModeSet) {
          delete data.editModeSet;
        }
      }
      this.editData.submitType = '2';
      this.editData.auditStatus = 'Approving';
      this.editData.applicant = this.$store.state.userName;
      this.editData.applicantName = this.$store.state.realName;
      this.editData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      editPlanReserve(this.editData).then(res => {
        // console.log('提交计划预留：', res);
        if (res.code === '0') {
          this.auditStatus = 'Approving';
          this.getPlanReserveList();
          this.$message({
            type: 'success',
            message: '提交审批成功！'
          });
          this.isShowEdit = false;
          this.activeName = 'Approving';
        }
        this.isSubmitDisabled = false;
      });
    },
    verificationHandle(val, name) {
      // 数量值校验
      if (val && val.toString().indexOf('.') !== -1) {
        let arr = val.toString().split('.');
        if (arr[0].length > 8) {
          this.$message({
            message: `${name}仅支持整数位8位，请重新输入！`,
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
      } else if (val && val.toString().length > 8) {
        this.$message({
          message: `${name}仅支持整数位8位，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    switchTabHandle(tab) {
      // tab切换
      // console.log('tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.reserveList = [];
      switch (tab.name) {
        case 'All':
          // 全部
          this.auditStatus = '';
          break;
        case 'Draft':
          // 草稿
          this.auditStatus = 'Draft';
          break;
        case 'Approving':
          // 审批中
          this.auditStatus = 'Approving';
          break;
        case 'Approved':
          // 已通过
          this.auditStatus = 'Approved';
          break;
        case 'Rejected':
          // 已驳回
          this.auditStatus = 'Rejected';
          break;
        case 'Terminated':
          // 已终止
          this.auditStatus = 'Terminated';
          break;
        default:
          this.auditStatus = '';
          break;
      }
      this.getPlanReserveList();
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    dateValChange(val) {
      
    },
    searchHandle() {
      // 搜索
      this.reserveList = [];
      this.currentPage = 1;
      if (this.dateVal) {
        this.startReserveDate = this.dateVal[0];
        this.endReserveDate = this.dateVal[1];
      } else {
        this.startReserveDate = '';
        this.endReserveDate = '';
      }
      this.currentPage=1;
      this.getPlanReserveList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPlanReserveList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPlanReserveList();
    },
    getPlanReserveList() {
      // 计划预留列表
      let data = {
        auditStatus: this.auditStatus,
        materialCode: this.materialCode,
        reserveId: this.reserveId,
        reserveType: this.reserveType,
        saleOrderId: this.saleOrderId,
        startReserveDate: this.startReserveDate,
        endReserveDate: this.endReserveDate,
        planTransferDate:this.latestTime,
      };
      planReserveList(this.currentPage, this.pageSize, data).then(res => {
        console.log('计划预留列表：', res);
        if (res.code === '0' && res.data.records.length) {
          this.reserveList = res.data.records;
          this.total = res.data.total;
          let list = this.reserveList;
          let childData = null;
          for (var i = 0; i < list.length; i++){
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].status = list[i].auditStatus;
            list[i].auditStatusName = statusTypeHandle(list[i].auditStatus);

            for(var j=0;j<list[i].planReserveItemList.length;j++){
              if(list[i].planReserveItemList[j].reserveStatus=='Release'){
                this.reserveStatusInfo=false;
              }else{
                this.reserveStatusInfo=true;
              }
            }

            // switch (list[i].auditStatus) {
            //   case 'Draft':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Approved':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasRemove: this.reserveStatusInfo
            //     };
            //     break;
            //   case 'Rejected':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     list[i].actions = {};
            //     break;
            // }

            // 查询仓位名称
            this.inventoryTypeList.forEach(item => {
              if (list[i].inventory == item.index) {
                list[i].inventoryName = item.name;
              }
            });
            this.reserveTypeList.forEach(item => {
              if (list[i].reserveType == item.dictItemValue) {
                list[i].reserveTypeName = item.dictItemName;
              }
            });
            // list[i].isReserveNoCustom = (list[i].reserveType.indexOf('B') != -1 ? true : false);
            // if (list[i].isReserveNoCustom) {
            //   list[i].isHideFew = true;
            // }

            // if (list[i].reserveTypeName && list[i].reserveTypeName.split('-')[0] == '客订') {
            //   // 客订显示客户名称
            //   list[i].hide_customerName = false;
            //   // list[i].isHideFew = true;
            // } else {
            //   list[i].hide_customerName = true;
            // }
            // if (list[i].reserveTypeName && list[i].reserveTypeName.split('-')[0] == '客订' || list[i].reserveTypeName.split('-')[0] == '非客订') {
            //   // 客订、非客订显示业务编号
            //   list[i].hide_saleOrderId = false;
            //   // list[i].isHideFew = true;
            // } else {
            //   list[i].hide_saleOrderId = true;
            // }

            if (list[i].reserveTypeName && list[i].reserveTypeName.split('-')[0] == '客订') {
              // 客订显示客户名称
              list[i].isCustomerOrderType = true;
            } else {
              list[i].isCustomerOrderType = false;
            }
            if (list[i].reserveTypeName && list[i].reserveTypeName.split('-')[0] == '非客订') {
              // 客订、非客订显示业务编号
              list[i].isNotCustomerOrderType = true;
            } else {
              list[i].isNotCustomerOrderType = false;
            }

            for (var j = 0; j < list[i].planReserveItemList.length; j++) {
              childData = list[i].planReserveItemList[j];
              childData.reserveExpectDate ? (childData.reserveExpectDate = timeFormat(childData.reserveExpectDate)) : '';
              childData.reserveRealDate ? (childData.reserveRealDate = timeFormat(childData.reserveRealDate)) : '';
              if (list[i].auditStatus == 'Approved') {
                childData.reserveStatus === 'Release' ? childData.reserveStatusName = '解除' : childData.reserveStatusName = '预留';
              } else {
                childData.reserveStatusName = '';
              }

              // if (childData.reserveStatus == 'Release') {
              //   list[i].reserveStatusInfo = false;
              // } else {
              //   list[i].reserveStatusInfo = true;
              // }

              this.updateEditModeSet('edit', childData, list[i].auditStatus);
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
    getReserveTypeList() {
      // 预留类型
      reserveTypeList().then(res => {
        console.log('请求类型：', res);
        if (res.code === '0') {
          this.reserveTypeList = res.data;
        }
      });
    },
    getInventoryTypeList() {
      // 仓位类型
      inventoryTypeList().then(res => {
        console.log('仓位：', res);
        if (res.code === '0') {
          this.inventoryTypeList = res.data;
        }
      });
    },
    async getSubInventoryTypeList(virtualInventoryId) {
      // 库位列表
      await subInventoryTypeList(virtualInventoryId).then(res => {
        console.log('预留库位列表：', res);
        if (res.code === '0') {
          this.subInventoryTypeList = res.data;
          this.$forceUpdate();
        }
      });
    },
    getMeasurementUnitHandle(item) {
      // 计量单位查询
      getMeasurementUnitByMC(item.materialCode).then(res => {
        if (res.code === '0') {
          item.purchaseMeasurementUnit = res.data;
          this.$forceUpdate();
        }
      });
    },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      let numberInputSet = JSON.parse(JSON.stringify(this.numberInputSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));
      if (type == 'edit') {
        switch (status) {
          case 'Draft':
            // 产品编号
            inputSet.productCode = true;
            textSet.productCode = false;
            // 计划预留数量
            numberInputSet.planReserveMeter = true;
            textSet.planReserveMeter = false;
            // 期望交期
            datePickerSet.reserveExpectDate = true;
            textSet.reserveExpectDate = false;
            break;
          case 'Approved':
            // 产品编号
            inputSet.productCode = false;
            textSet.productCode = true;
            // 计划预留数量
            numberInputSet.planReserveMeter = false;
            textSet.planReserveMeter = true;
            // 期望交期
            datePickerSet.reserveExpectDate = false;
            textSet.reserveExpectDate = true;
            break;
          default:
            break;
        }
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.selectSet = selectSet;
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.datePickerSet = datePickerSet;
      data.editModeSet = editModeSet;
    },
    inputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'productCode':
          // 产品编号
          // console.log('产品编号值改变：', val, item, fieldItem);
          // 获取物料编号
          this.getMaterialCodeHandle(item);
          // searchMaterialCode(val).then(res => {
          //   if (res.code === '0' && res.data) {
          //     item.materialCode = res.data;
          //     // 计量单位
          //     this.getMeasurementUnitHandle(item);
          //   } else {
          //     item.materialCode = '';
          //   }
          // });
          break;
      
        default:
          break;
      }
    },
    async selectChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editData.planReserveItemList));
      switch (fieldItem.field) {
        case 'subInventoryName':
          // 预留库位
          console.log('预留库位值改变：', val, item, fieldItem);
          let subInventoryData = this.subInventoryTypeList.find(siItem => {
            return siItem.subInventory === val;
          });
          item.subInventory = subInventoryData ? subInventoryData.subInventory : '';
          item.subInventoryName = subInventoryData ? subInventoryData.subInventoryName : '';
          // 拉取数量数据
          this.pullQuantitysDataHandle(item);
          break;
        
        default:
          break;
      }
    },
    selectVisibleChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editData.planReserveItemList));
      switch (fieldItem.field) {
        case 'subInventoryName':
          // 预留库位
          console.log('预留库位值改变：', val, item, fieldItem);
          if (!item.subInventoryTypeList || !item.subInventoryTypeList.length) {
            for (var i = 0; i < editListCopy.length; i++) {
              let data = editListCopy[i];
              if (data.uuid === item.uuid) {
                data.subInventoryTypeList = this.subInventoryTypeList;
              }
            }
            this.editData.planReserveItemList = editListCopy;
            this.$forceUpdate();
          }
          break;

        default:
          break;
      }
    },
    numberInputChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editData.planReserveItemList));
      let list = this.editDataClone.planReserveItemList;
      switch (fieldItem.field) {
        case 'planReserveMeter':
          // 计划预留数量
          console.log('计划预留数量值改变：', val, item, fieldItem);
          if (!val) {
            item.planReserveMeter = 0;
          }
          if (this.editDataClone.auditStatus == 'Approved') {
            this.isSubmitDisabled = true;
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == item.uuid) {
                if (list[i].planReserveMeter == item.planReserveMeter) {
                  this.isSubmitDisabled = false;
                }
              }
            }
          }
          break;
        case 'shippmentMeter':
          // 在途
          console.log('在途值改变：', val, item, fieldItem);
          if (!val) {
            item.shippmentMeter = 0;
          }
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          if (this.editDataClone.auditStatus == 'Approved') {
            this.isSubmitDisabled = true;
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == item.uuid) {
                if (list[i].shippmentMeter == item.shippmentMeter) {
                  this.isSubmitDisabled = false;
                }
              }
            }
          }
          break;
        case 'producedMeter':
          // 货妥
          console.log('货妥值改变：', val, item, fieldItem);
          if (!val) {
            item.producedMeter = 0;
          }
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          if (this.editDataClone.auditStatus == 'Approved') {
            this.isSubmitDisabled = true;
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == item.uuid) {
                if (list[i].producedMeter == item.producedMeter) {
                  this.isSubmitDisabled = false;
                }
              }
            }
          }
          break;
        case 'producingMeter':
          // 在产
          console.log('在产值改变：', val, item, fieldItem);
          if (!val) {
            item.producingMeter = 0;
          }
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          if (this.editDataClone.auditStatus == 'Approved') {
            this.isSubmitDisabled = true;
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == item.uuid) {
                if (list[i].producingMeter == item.producingMeter) {
                  this.isSubmitDisabled = false;
                }
              }
            }
          }
          break;
        case 'requestedMeter':
          // 询单
          console.log('询单值改变：', val, item, fieldItem);
          if (!val) {
            item.requestedMeter = 0;
          }
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          if (this.editDataClone.auditStatus == 'Approved') {
            this.isSubmitDisabled = true;
            for (var i = 0; i < list.length; i++) {
              if (list[i].uuid == item.uuid) {
                if (list[i].requestedMeter == item.requestedMeter) {
                  this.isSubmitDisabled = false;
                }
              }
            }
          }
          break;
      
        default:
          break;
      }
    },
    datePickerChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'reserveExpectDate':
          console.log('期望交期值改变：', val, item, fieldItem);
          break;
        case 'reserveRealDate':
          console.log('预计实际交期值改变：', val, item, fieldItem);
          // let editDataCopy = JSON.parse(JSON.stringify(this.editData));
          // for (var i = 0; i < editDataCopy.planReserveItemList.length; i++) {
          //   let data = editDataCopy.planReserveItemList[i];
          //   if (data.uuid == item.uuid) {
          //     data.reserveRealDate = val;
          //   }
          // }
          // this.editData = editDataCopy;
          item.reserveRealDate = val;
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}

.reserve {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
  .edit_wrap {
    overflow: auto;
    .childlist {
      width: 100%;
    }
    .edit_parent_list {
      width: 100%;
      .edit_item {
        // height: 120px;
        width: 100%;
        height: 100%;
        position: relative;
        border-bottom: 1px solid #EEEEEE;
        li {
          line-height: 32px;
          span {
            vertical-align: middle;
          }
        }
      }
      .add_btn {
        position: absolute;
        bottom: 14px;
        right: 60px;
      }
      ul {
        &.childcontentlist {
          border-bottom: none;
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
</style>
<style>
/* popover弹出框 */
.popover_table.el-table .el-table__header th,
.popover_table.el-table .el-table__header tr {
  height: 40px;
  background-color: #f5f7fa;
}
.el-date-editor.el-range-editor.el-input__inner.mr10.mb10.el-date-editor--daterange {
  width: 320px;
}
</style>