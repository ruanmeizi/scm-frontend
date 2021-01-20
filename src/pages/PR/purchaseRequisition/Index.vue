<template>
  <div class="purchaseRequisition container">
    <div v-show="!isExcelMode">
      <div class="part" v-if="!isShowEdit">
        <div class="actions_part clearfix">
          <div class="actions_wrap">
            <div class="display_ib mr10 mb10">
              <span class="tag">请求类型：</span>
              <el-select
                class="select_single w200 mr10"
                v-model="purchaseType"
                placeholder="请选择"
                @change="searchHandle">
                <el-option key="" label="全部" value=""></el-option>
                <el-option
                  v-for="item in requestTypeList"
                  :key="item.dictItemValue"
                  :label="item.dictItemName"
                  :value="item.dictItemValue"
                ></el-option>
              </el-select>
            </div>
            <div class="display_ib mr10 mb10">
              <span class="tag">产品编号：</span>
              <el-input class="input_single w200 mr10" v-model="productCode" placeholder="请输入"></el-input>
            </div>
            <div class="display_ib mr10 mb10">
              <span class="tag">物料编号：</span>
              <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
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
            <!-- <el-button type="primary" :loading="downloadExcelLoading" @click="downloadSelectExcelHandle">导出已选择项</el-button> -->
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
                :tableList="requestList"
                :parentData="parentData"
                :childData="childData"
                :tableFieldsList="fieldsList"
                :tableParentFieldsList="parentFieldsList"
                :tableLoading="tableLoading"
                @editHandle="editHandle"
                @submitHandle="submitHandle"
                @deleteHandle="deleteHandle">
              </Table> -->

              <!-- <el-table
                class="table_list"
                :ref="'multipleTable' + activeName"
                :data="requestList"
                border
                fit
                stripe
                @expand-change="expandChange"
                @select="selectHandle"
                @select-all="selectAllHandle"> -->
              <el-table
                class="table_list"
                :ref="'multipleTable' + activeName"
                :data="requestList"
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
                      :data="scope.row.priList"
                      border
                      fit
                      @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                      @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }"> -->
                    <div class="actions_wrap mb20 clearfix">
                      <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                      <el-button v-if="scope.row.prStatus === 'Draft' || scope.row.prStatus === 'Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                    </div>
                    <el-table
                      class="table_list"
                      :ref="'childMultipleTable_' + scope.row.id"
                      :data="scope.row.priList"
                      border
                      fit>
                      <!-- <el-table-column fixed type="selection" /> -->
                      <el-table-column fixed label="行号">
                        <template slot-scope="{ row }">
                          {{ row.sn }}
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
                      <el-table-column label="期望交期">
                        <template slot-scope="{ row }">
                          {{ row.requiredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column v-if="activeName == 0 || activeName == 'Approved'" label="工厂交期">
                        <template slot-scope="{ row }">
                          {{ row.offeredDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="最晚调拨时间">
                        <template slot-scope="{ row }">
                          {{ row.latestTransferDate }}
                        </template>
                      </el-table-column>
                      <el-table-column label="请求数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.requiredPackages ? row.requiredPackages : 0) + '包 ' + (row.requiredQuantityPerPackage ? row.requiredQuantityPerPackage : 0) + '米/包 ' + (row.requiredQuantity ? row.requiredQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.requiredQuantity ? row.requiredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="activeName == 0 || activeName == 'Approved'" label="采购数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.offeredPackages ? row.offeredPackages : 0) + '包 ' + (row.offeredQuantityPerPackage ? row.offeredQuantityPerPackage : 0) + '米/包 ' + (row.offeredQuantity ? row.offeredQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.offeredQuantity ? row.offeredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="库位">
                        <template slot-scope="{ row }">
                          {{ row.subInventoryName }}
                        </template>
                      </el-table-column>
                      <el-table-column label="销售订单编号">
                        <template slot-scope="{ row }">
                          {{ row.saleOrderId }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购订单编号">
                        <template slot-scope="{ row }">
                          {{ row.purchaseOrderId }}
                        </template>
                      </el-table-column>
                      <el-table-column label="确认书编号">
                        <template slot-scope="{ row }">
                          {{ row.confirmNumbers }}
                        </template>
                      </el-table-column>
                      <el-table-column label="特殊要求">
                        <template slot-scope="{ row }">
                          {{ row.specialRequire }}
                        </template>
                      </el-table-column>
                      <el-table-column label="货妥数量">
                        <template slot-scope="{ row }">
                          {{ row.cargoQuantity }}
                        </template>
                      </el-table-column>
                      <el-table-column label="状态" v-if="scope.row.prStatus === 'Approved'">
                        <template slot-scope="{ row }">
                          {{ row.cancelStatus === true ? '已取消' : '正常'}}
                        </template>
                      </el-table-column>
                      <el-table-column label="备注">
                        <template slot-scope="{ row }">
                          {{ row.remark }}
                        </template>
                      </el-table-column>
                      <el-table-column label="原确认书编号">
                        <template slot-scope="{ row }">
                          {{ row.originalConfirmNum }}
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" v-if="scope.row.prStatus === 'Approved'">
                        <template slot-scope="{ row, $index }">
                          <el-button class="el-icon-document-delete" type="danger" circle size="mini" title="撤销" :disabled="row.purchaseOrderId || row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button>
                          <!-- <el-button class="el-icon-document-delete" type="danger" circle size="mini" :title="row.purchaseOrderId ?  '不可取消' : (row.cancelStatus === true ? '已取消' : '取消')" :disabled="row.purchaseOrderId || row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button> -->
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" fixed="right"  v-if="scope.row.prStatus==='Draft'">
                        <template slot-scope="{ row, $index }">
                         <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="editDeleteHandle($index, row)"></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </el-table-column>
                <el-table-column label="请求编号">
                  <template slot-scope="{ row }">
                    {{ row.purchaseRequestCode }}
                  </template>
                </el-table-column>
                <el-table-column label="请求类型">
                  <template slot-scope="{ row }">
                    {{ row.purchaseTypeName }}
                  </template>
                </el-table-column>
                <el-table-column label="入库仓位">
                  <template slot-scope="{ row }">
                    {{ row.virtualInventoryName }}
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
                      <el-tag slot="reference" class="pointer" :type="row.prStatus | prStatusFilter">{{ row.prStatusName }}</el-tag>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row, $index }">
                    <div v-if="row.prStatus === 'Draft' || row.prStatus === 'Rejected'">
                      <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                      <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                      <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                    </div>
                    <div v-if="row.prStatus === 'Terminated'">
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
          <div class="display_ib mr10 mb10">
            <span class="tag"><span class="red mr5">*</span>请求类型：</span>
            <el-select class="select_single w200 mr10"
              :disabled="!isEmptyData"
              v-model="editData.purchaseType"
              @change="purchaseTypeSelect"
              placeholder="请选择">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option
                v-for="item in requestTypeList"
                :key="item.dictItemValue"
                :label="item.dictItemName"
                :value="item.dictItemValue">
              </el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag"><span class="red mr5">*</span>入库仓位：</span>
            <el-select class="select_single w200 mr10"
              :disabled="!isEmptyData"
              v-model="editData.virtualInventoryId"
              @change="virtualInventorySelect"
              placeholder="请选择">
              <el-option key="" label="请选择" value=""></el-option>
              <el-option
                v-for="item in virtualInventoryList"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10" v-if="isPurchaseBySale">
            <span class="tag">销售订单编号：</span>
            <el-input class="input_single w200 mr10" :disabled="!isEmptyData" v-model.trim="editData.saleOrderId" placeholder="请输入"></el-input>
          </div>
          <!-- <div class="display_ib mr10 mb10" v-if="isDifferenceOrder">
            <span class="tag">原PR编号：</span>
            <el-input class="input_single w200 mr10" :disabled="!isEmptyData" v-model.trim="editData.saleOrderId" placeholder="请输入"></el-input>
          </div> -->
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
          <!-- <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="editData.supplierId"
              filterable
              :disabled="isDisabledSupplier"
              @change="supplierNameChange"
              placeholder="不限">
              <el-option key="" label="不限" value=""></el-option>
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </div> -->
          <div class="display_ib mr10" v-if="isPurchaseBySale">
            <span class="tag">客户名称：</span>
            <span class="tag">{{editData.customerName}}</span>
          </div>

          <a class="link inline_block lh36 fr ml10" type="primary" @click="exportExcelTemplate">申请采购导入模板</a>
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

        <upload-excel-component class="mb20" :on-success="handleSuccess" :before-upload="beforeUpload" />
        <!-- <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table> -->

        <div class="hidden">
          <!-- 编辑组件 -->
          <editTable
            :tableList="editData.pricList"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="editFieldsList"
            :selectRemoteLoading="selectRemoteLoading"
            @deleteHandle="deleteEditItemHandle"
            @inputChange="inputChange"
            @inputBlur="inputBlur"
            @selectChange="selectChange"
            @selectVisibleChange="selectVisibleChange"
            @unitNumberInputChange="unitNumberInputChange"
            @selectRemoteMethod="selectRemoteMethod"
            @selectRemoteChange="selectRemoteChange"
            @selectRemoteClick="selectRemoteClick">
          </editTable>

          <div class="edit_btn_wrap mt20 fr">
            <el-button @click.stop="cancelEditHandle">取消</el-button>
            <el-button type="primary" v-preventReClick @click.stop="updateEditHandle('save')">保存</el-button>
            <el-button type="primary" v-preventReClick @click.stop="updateEditHandle('submit')">提交审批</el-button>
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

    <!-- 撤销弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="revokeDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定撤销？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="revokeDeleteHandle">确 定</el-button>
      </span>
    </el-dialog>

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
} from '@/api/publicApi.js';
import {
  purchaseRequestList,
  purchaseRequestDraftList,
  submitPurchaseRequest,
  deletePurchaseRequest,
  deletePurchaseRequestitems,
  searchPurchaseRequest,
  pullPurchaseRequest,
  pullPlanPurchaseRequest,
  updatePurchaseRequest,
  addPurchaseRequest,
  searchSuggestQuantity,
  batchQuery,
  confirmationNoQuery,
  revokePurchaseRequestItem
} from '@/api/module/purchaseRequestApi.js';
import { getNowDate, timeFormat, isCheckDate, oaDateToDateTime, excelDateFormatToDate, verificationQuantity, getTimeRange, exportExcel } from '@/utils/index.js';
import { statusTypeHandle } from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from '@/layouts/components/common/Table.vue';
import editTable from '@/layouts/components/common/EditTableList.vue';
export default {
  name: "purchaseRequisition",
  data() {
    return {
      // Tab列表
      subNavList: [
        {
          label: '全部采购请求',
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

      // 申请采购列表
      beginTime: '',
      endTime: '',
      productCode: '',
      materialCode:'',
      purchaseType: '',
      sort: 'desc',
      dateVal: '', // 创建时间
      total: 0,
      currentPage: 1,
      pageSize: 10,
      requestList: [],
      isEdit:false,
      tableSearch: '',  // Table关键字搜索

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      selectUuidList: [],

      activeName: '',

      requestTypeList: [], // 请求类型列表
      virtualInventoryList: [], // 入库仓位列表
      subInventoryList: [], // 库位列表
      supplierList: [], // 供应商列表
      expands: [],

      // 编辑
      editType: '',
      editPartLoading: false,
      isShowEdit: false, // 是否显示编辑页
      isEmptyData: false, // 是否可编辑
      isDisabledPull: false, // 是否支持拉取
      isDisabledSupplier: false, // 是否支持供应商选择
      isPurchaseBySale: false, // 是否是以销定采类型
      isDifferenceOrder: false, // 是否是差异单
      // isDisabledAddEdit: false, // 新增子项按钮是否可用
      selectRemoteLoading: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,

      // 弹窗
      deleteDialogVisible: false,
      submitDialogVisible: false,
      revokeDialogVisible: false,
      submitId: '',
      submitObj: {},
      deleteId: '',
      submitObj: {},
      revokeUuid: '',

      // Table组件
      tableLoading: true,
      fieldsList: [],  // Table子列表表头
      lessFieldsList: [
        {
          name: '物料编号',
          class: 'w8p'
        },
        {
          name: '产品编号',
          class: 'w8p'
        },
        {
          name: '期望交期',
          class: 'w8p'
        },
        {
          name: '请求数量',
          class: 'w9p'
        },
        {
          name: '库位',
          class: 'w8p'
        },
        {
          name: '采购订单编号',
          class: 'w8p'
        },
        {
          name: '确认书编号',
          class: 'w8p'
        },
        {
          name: '特殊要求',
          class: 'w5p'
        },
        {
          name: '备注',
          class: 'w5p'
        }
      ],
      moreFieldsList: [
        {
          name: '物料编号',
          class: 'w8p'
        },
        {
          name: '产品编号',
          class: 'w8p'
        },
        {
          name: '期望交期',
          class: 'w8p'
        },
        {
          name: '工厂交期',
          class: 'w8p'
        },
        {
          name:'最晚调拨时间',
          class:'w8p'
        },
        {
          name: '请求数量',
          class: 'w9p'
        },
        {
          name: '采购数量',
          class: 'w9p'
        },
        {
          name: '库位',
          class: 'w8p'
        },
        {
          name: '采购订单编号',
          class: 'w8p'
        },
        {
          name: '确认书编号',
          class: 'w8p'
        },
        {
          name:'货妥数量',
          class:'w8p'
        },
        {
          name: '特殊要求',
          class: 'w5p'
        },
        {
          name: '备注',
          class: 'w5p'
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '请求编号',
          field: 'purchaseRequestCode',
          class: 'w8p',
          width: '200'
        },
        {
          name: '请求类型',
          field: 'purchaseTypeName',
          class: 'w8p',
          width: '150'
        },
        {
          name: '入库仓位',
          field: 'virtualInventoryName',
          class: 'w8p',
          width: '100'
        },
        {
          name: '创建时间',
          field: 'createTime',
          class: 'w8p',
          width: '200'
        },
        {
          name: '申请人',
          field: 'applicantName',
          class: 'w8p',
          width: '100'
        },
        {
          name: '审批',
          field: 'virtualInventoryName',
          class: 'w8p',
          // width: '100'
        }
      ],
      // parentFieldsList: [  // Table父列表表头
      //   {
      //     name: '创建时间',
      //     class: 'w8p'
      //   },
      //   {
      //     name: '申请人',
      //     class: 'w4p'
      //   },
      //   {
      //     name: '请求编号',
      //     class: 'w12p'
      //   },
      //   {
      //     name: '请求类型',
      //     class: 'w8p'
      //   },
      //   {
      //     name: '入库仓位',
      //     class: 'w5p'
      //   },
      //   {
      //     name: '审批',
      //     class: ''
      //   }
      // ],
      // parentData: {
      //   status: '',
      //   fieldsList: [
      //     {
      //       name: '创建时间',
      //       field: 'createTime',
      //       class: 'w8p',
      //       width: '200',
      //       // isShowTit: true
      //     },
      //     {
      //       name: '申请人',
      //       field: 'applicantName',
      //       class: 'w4p',
      //       width: '100',
      //       // isShowTit: true
      //     },
      //     {
      //       name: '请求编号',
      //       field: 'purchaseRequestCode',
      //       class: 'w12p',
      //       width: '200',
      //       // isShowTit: true
      //     },
      //     {
      //       name: '请求类型',
      //       field: 'purchaseTypeName',
      //       class: 'w8p',
      //       width: '150',
      //       // isShowTit: true
      //     },
      //     {
      //       name: '入库仓位',
      //       field: 'virtualInventoryName',
      //       class: 'w5p',
      //       width: '100',
      //       // isShowTit: true
      //     },
      //     {
      //       name: '审批',
      //       field: '',
      //       class: '',
      //       width: '100',
      //       // isShowTit: false,
      //       // isPopover: true
      //     },
      //     {
      //       name: '操作',
      //       field: '',
      //       class: 'fr mr15',
      //       // isShowTit: false,
      //       // isUpDown: true
      //     },
      //     // {
      //     //   name: '',
      //     //   field: '',
      //     //   class: 'fr',
      //     //   isShowTit: false,
      //     //   isAction: true
      //     // }
      //   ]
      // },
      parentData: {
        status: '',
        data: [
          {
            name: '创建时间：',
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
            name: '请求编号',
            field: 'purchaseRequestCode',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '请求类型',
            field: 'purchaseTypeName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '入库仓位',
            field: 'virtualInventoryName',
            class: 'w5p',
            isShowTit: true
          },
          // {
          //   name: '客户名称',
          //   field: 'customerName',
          //   class: 'w8p',
          //   isShowTit: true,
          //   isFilterField: true
          // },
          // {
          //   name: '仓位',
          //   field: 'inventoryName',
          //   class: 'w6p',
          //   isShowTit: true
          // },
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
      childData: {},
      // lessChildData: {
      //   name: 'priList',
      //   fieldsList: [
      //     {
      //       name: '产品编号',
      //       field: 'productCode',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '物料编号',
      //       field: 'materialCode',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '期望交期',
      //       field: 'requiredDate',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '请求数量',
      //       field_1: 'requiredPackages',
      //       field_2: 'requiredQuantityPerPackage',
      //       field_3: 'requiredQuantity',
      //       field: 'requiredQuantity',
      //       field_unit: 'purchaseMeasurementUnit',
      //       class: 'w9p',
      //       isQuantityField: true
      //     },
      //     {
      //       name: '库位',
      //       field: 'subInventoryName',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '采购订单编号',
      //       field: 'purchaseOrderId',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '确认书编号',
      //       field: 'confirmNumbers',
      //       class: 'w8p'
      //     },
      //     {
      //       name: '特殊要求',
      //       field: 'specialRequire',
      //       class: 'w5p'
      //     },
      //     {
      //       name: '备注',
      //       field: 'remark',
      //       class: 'w5p'
      //     },
      //     // {
      //     //   name: '',
      //     //   field: '',
      //     //   class: 'w10p fr',
      //     //   isAction: true
      //     // }
      //   ]
      // },
      // moreChildData: {
      //   name: 'priList',
      //   fieldsList: [
      //     {
      //       name: '产品编号',
      //       field: 'productCode',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '物料编号',
      //       field: 'materialCode',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '期望交期',
      //       field: 'requiredDate',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '工厂交期',
      //       field: 'offeredDate',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '请求数量',
      //       field_1: 'requiredPackages',
      //       field_2: 'requiredQuantityPerPackage',
      //       field_3: 'requiredQuantity',
      //       field: 'requiredQuantity',
      //       field_unit: 'purchaseMeasurementUnit',
      //       class: 'w9p',
      //       width: '200',
      //       isQuantityField: true
      //     },
      //     {
      //       name: '采购数量',
      //       field_1: 'offeredPackages',
      //       field_2: 'offeredQuantityPerPackage',
      //       field_3: 'offeredQuantity',
      //       field: 'offeredQuantity',
      //       field_unit: 'purchaseMeasurementUnit',
      //       class: 'w9p',
      //       width: '200',
      //       isQuantityField: true
      //     },
      //     {
      //       name: '库位',
      //       field: 'subInventoryName',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '采购订单编号',
      //       field: 'purchaseOrderId',
      //       class: 'w8p',
      //       width: '150'
      //     },
      //     {
      //       name: '确认书编号',
      //       field: 'confirmNumbers',
      //       class: 'w8p',
      //       width: '100'
      //     },
      //     {
      //       name: '特殊要求',
      //       field: 'specialRequire',
      //       class: 'w5p',
      //       width: '100'
      //     },
      //     {
      //       name: '备注',
      //       field: 'remark',
      //       class: 'w5p',
      //       width: '100'
      //     },
      //     // {
      //     //   name: '',
      //     //   field: '',
      //     //   class: 'w10p fr',
      //     //   isAction: true
      //     // }
      //   ]
      // },
      lessChildData: {
        name: 'priList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'productCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w8p'
          },
          {
            name: '',
            field_1: 'requiredPackages',
            field_2: 'requiredQuantityPerPackage',
            field_3: 'requiredQuantity',
            field: 'requiredQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w9p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'subInventoryName',
            class: 'w8p'
          },
          {
            name: '',
            field: 'purchaseOrderId',
            class: 'w8p'
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w8p'
          },
          {
            name: '',
            field: 'specialRequire',
            class: 'w5p'
          },
          {
            name: '',
            field: 'remark',
            class: 'w5p'
          },
          // {
          //   name: '',
          //   field: '',
          //   class: 'w10p fr',
          //   isAction: true
          // }
        ]
      },
      moreChildData: {
        name: 'priList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'productCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w8p'
          },
          {
            name: '',
            field: 'offeredDate',
            class: 'w8p'
          },
          {
            name:'',
            field:'latestTransferDate',
            class: 'w8p'
          },
          {
            name: '',
            field_1: 'requiredPackages',
            field_2: 'requiredQuantityPerPackage',
            field_3: 'requiredQuantity',
            field: 'requiredQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w9p',
            isQuantityField: true
          },
          {
            name: '',
            field_1: 'offeredPackages',
            field_2: 'offeredQuantityPerPackage',
            field_3: 'offeredQuantity',
            field: 'offeredQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w9p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'subInventoryName',
            class: 'w8p'
          },
          {
            name: '',
            field: 'purchaseOrderId',
            class: 'w8p'
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w8p'
          },
          {
            name:'',
            field:'',
            class:'w8p'
          },
          {
            name: '',
            field: 'specialRequire',
            class: 'w5p'
          },
          {
            name: '',
            field: 'remark',
            class: 'w5p'
          },
          // {
          //   name: '',
          //   field: '',
          //   class: 'w10p fr',
          //   isAction: true
          // }
        ]
      },

      // 编辑数据
      editData: {},
      editItemData: {
        uuid: '',
        materialCode: '',
        productCode: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        requiredDate: '',
        requiredPackages: '',
        requiredQuantityPerPackage: '',
        requiredQuantity: '',
        purchaseMeasurementUnit: '米',
        suggestQuantity: '',
        subInventory: '',
        subInventoryName: '',
        specialRequire: '',
        saleOrderId:'',
        remark: '',
        originalSn: '',
        originalPurchaseRequestCode: '',
        originalConfirmNum:'',
      },

      // 编辑组件数据
      editFieldsList: [],
      standardEditFieldsList: [
        {
          name: '产品编号',
          field: 'productCode',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '供应商',
          // field: 'supplierName',
          field: 'supplierShortName',
          class: 'w16p',
          width: '150'
        },
        {
          name: '* 期望交期',
          field: 'requiredDate',
          class: 'w18p',
          width: '180',
          isRules: true
        },
        {
          name: '* 请求数量',
          field_1: 'requiredPackages',
          field_2: 'requiredQuantityPerPackage',
          field_3: 'requiredQuantity',
          field: 'requiredQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '400',
          isRules: true
        },
        {
          name: '建议采购数量（按周）',
          field: 'suggestQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '180',
          isQuantityField: true
        },
        {
          name: '* 库位',
          field: 'subInventory',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '销售订单编号',
          field: 'saleOrderId',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '特殊要求',
          field: 'specialRequire',
          class: 'w13p',
          width: '150'
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w16p',
          width: '150'
        }
      ],
      originalEditFieldsList: [
        {
          name: '产品编号',
          field: 'productCode',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '供应商',
          // field: 'supplierName',
          field: 'supplierShortName',
          class: 'w16p',
          width: '150'
        },
        {
          name: '* 期望交期',
          field: 'requiredDate',
          class: 'w18p',
          width: '180',
          isRules: true
        },
        {
          name: '* 请求数量',
          field_1: 'requiredPackages',
          field_2: 'requiredQuantityPerPackage',
          field_3: 'requiredQuantity',
          field: 'requiredQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '400',
          isRules: true
        },
        {
          name: '建议采购数量（按周）',
          field: 'suggestQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '180',
          isQuantityField: true
        },
        {
          name: '* 库位',
          field: 'subInventory',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '销售订单编号',
          field: 'saleOrderId',
          class: 'w16p',
          width: '150',
          isRules: true
        },
        {
          name: '特殊要求',
          field: 'specialRequire',
          class: 'w13p',
          width: '150'
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w16p',
          width: '150'
        },
        {
          name: '原PR行号',
          field: 'originalSn',
          class: 'w16p',
          width: '150'
        },
        {
          name: '原PR编号',
          field: 'originalPurchaseRequestCode',
          class: 'w16p',
          width: '150'
        },
        {
          name:'原确认书编号',
          field:'originalConfirmNum',
          class:'w16p',
          width: '150'
        }
      ],
      leaderFieldsList: [
        {
          name: '行号',
          field: 'sn',
          class: 'w10p',
          width: '50'
        },
        {
          name: '* 物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '200',
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
        productCode: true,
        supplierName: true,
        supplierShortName: true,
        suggestQuantity: true,
        originalSn: true,
        originalPurchaseRequestCode: true,
        originalConfirmNum:true
      },
      inputSet: {
        materialCode: {
          class: ''
        },
        // productCode: true,
        saleOrderId:true,
        specialRequire: true,
        remark: true,
        inputData: {
          maxlength: '',
          placeholder: ''
        }
      },
      selectSet: {
        subInventory: {
          selectListName: 'subInventoryList',
          value: 'subInventory',
          label: 'subInventoryName'
        }
      },
      selectRemoteSet: {
        // productCode: {
        //   selectListName: 'productCodeList',
        //   value: 'productCode',
        //   label: 'productCode'
        // }
      },
      numberInputSet: {},
      datePickerSet: {
        requiredDate: true,
      },
      unitSet: {
        requiredPackages: true,
        // requiredQuantityPerPackage: {
        //   disabled: true
        // }
      },
      latestTime:'',
      tableData: [],
      tableHeader: [],

      childHeaderList: ['请求编号', '行号', '物料编号', '产品编号', '期望交期', '工厂交期', '最晚调拨时间', '请求数量', '采购数量', '库位', '采购订单编号', '确认书编号','销售订单编号', '特殊要求', '货妥数量', '备注'],
      childFieldsList: ['purchaseRequestCode', 'sn', 'materialCode', 'productCode', 'requiredDate', 'offeredDate', 'latestTransferDate', 'requiredQuantity', 'offeredQuantity', 'subInventoryName', 'purchaseOrderId', 'confirmNumbers','saleOrderId', 'specialRequire', 'cargoQuantity', 'remark'],

    };
  },
  components: {
    UploadExcelComponent,
    Table,
    editTable
  },
  created() {},
  mounted() {
    this.fieldsList = this.moreFieldsList;
    this.childData = this.moreChildData;
    this.editFieldsList = this.standardEditFieldsList;
    this.getRequestTypeList();
    this.getVirtualInventory();
    this.getSupplierList();
    // this.getPurchaseRequestList();
    this.fun_date();
    // this.addDate();
    if (this.$store.state.PREditShow) {
      // 采购计划携带编辑数据
      // console.log('采购计划生成申请采购数据：', this.$store.state.planToPRList);
      this.editData = {};
      this.editType = 'add';
      this.isEmptyData = true;
      this.isDisabledPull = true;
      this.isDisabledSupplier = true;
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      getUUID().then(res => {
        if (res.code === '0') {
          editDataCopy.uuid = res.data;
        }
      });
      editDataCopy.pricList = this.$store.state.planToPRList;
      // 供应商转换
      let supplierData = this.supplierList.find(item => {
        return item.supplierName == editDataCopy.pricList[0].supplierName;
      });
      editDataCopy.supplierName = editDataCopy.pricList.length ? editDataCopy.pricList[0].supplierName : '';
      editDataCopy.supplierId = editDataCopy.pricList.length ? editDataCopy.pricList[0].supplierId : '';
      editDataCopy.supplierCode = supplierData ? supplierData.supplierCode : '';
      for (var i = 0; i < editDataCopy.pricList.length; i++) {
        let data = editDataCopy.pricList[i];
        getUUID().then(res => {
          if (res.code === '0') {
            data.uuid = res.data;
          }
        });
        data.subInventoryList = this.subInventoryList;
        data.suggestQuantity = data.adviceQuantity;
        data.supplierShortName=data.supplierName;
        this.updateEditModeSet('add', data);
      }
      this.editData = editDataCopy;
      this.isShowEdit = true;
      this.$store.commit('getPREditShow');
    }
  },
  filters: {
    prStatusFilter(status) {
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
    // 固定展示为两周前的时间范围
    fun_date(){
      this.dateVal=getTimeRange(-14);
      let planDate=getTimeRange(90);
      this.latestTime=planDate[1];
      this.searchHandle();
    },
    rowClick(row, event, column){
      //单击事件
      console.log(row,event,column);
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
      let headers = ['请求编号', '请求类型', '入库仓位', '创建时间', '申请人', '审批'];
      let fields = ['purchaseRequestCode', 'purchaseTypeName', 'virtualInventoryName', 'createTime', 'applicantName', 'prStatusName'];
      exportExcel(headers, fields, this.requestList, '申请采购', true, 'xlsx');

      // let headerList = [];
      // let fieldsList = ['purchaseRequestCode', 'purchaseTypeName', 'virtualInventoryName', 'createTime', 'applicantName', 'prStatusName'];
      // this.parentFieldsList.forEach(hItem => {
      //   headerList.push(hItem.name);
      // });
      // import('@/vendor/Export2Excel').then(excel => {
      //   const list = this.requestList;
      //   const data = this.formatJson(fieldsList, list);
      //   excel.export_json_to_excel({
      //     header: headerList,
      //     data,
      //     filename: '申请采购',
      //     autoWidth: true,
      //     bookType: 'xlsx'
      //   });
      // });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.priList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.purchaseRequestCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },

    // Upload Edit
    beforeUpload(file) {
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
    async handleSuccess({ results, header }) {
      console.log('导入数据：', results, header);
      if (!this.editData.purchaseType) {
        this.$message({
          type: 'error',
          message: '请选择请求类型！'
        });
        this.editPartLoading = false;
        return false;
      }
      if (!this.editData.virtualInventoryId) {
        this.$message({
          type: 'error',
          message: '请选择入库仓位！'
        });
        this.editPartLoading = false;
        return false;
      }
      // if (this.isDifferenceOrder) {
      //   // 请求类型 差异单
      //   if (!this.editData.saleOrderId) {
      //     this.$message({
      //       type: 'error',
      //       message: '请输入原PR编号！'
      //     });
      //     return false;
      //   }
      // }

      if (results && results.length) {
        let editData = {};
        if (this.isEmptyData) {
          // 空数据
          editData = {
            uuid: '',
            purchaseType: '',
            submitType: '',
            purchaseTypeName: '',
            virtualInventoryId: '',
            virtualInventoryName: '',
            saleOrderId: '',
            customerName: '',
            applicant: this.$store.getters.getUserName,
            applicantName: this.$store.state.realName,
            applicantDepartment: this.$store.getters.getdepartmentId,
            applicantDepartmentName: this.$store.state.currentDepartment.name,
            pricList: []
          };
          editData = Object.assign(editData, this.editData);
          await getUUID().then(res => {
            if (res.code === '0') {
              editData.uuid = res.data;
            }
          });
          this.updateEditModeSet('add', editData);
          // 备货采购-工装-纱线 + 入库仓位：零剪/职业装仓 库位显示 零剪/职业装工厂库
          // 入库仓位 B0 零剪仓 C0 职业装仓
          if (this.editData.purchaseType == 'B020203' && this.editData.virtualInventoryId == 'B0') {
            this.subInventoryList = this.subInventoryList.filter(siItem => {
              return siItem.subInventoryName == '零剪仓工厂库';
            });
          } else if (this.editData.purchaseType == 'B020203' && this.editData.virtualInventoryId == 'C0') {
            this.subInventoryList = this.subInventoryList.filter(siItem => {
              return siItem.subInventoryName == '职业装仓工厂库';
            });
          }

          this.isEmptyData = false;
        } else {
          editData = JSON.parse(JSON.stringify(this.editData));
          editData.pricList = [];
        }

        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
          await getUUID().then(res => {
            if (res.code === '0') {
              editItemCopy.uuid = res.data;
            }
          });
          editItemCopy.subInventoryList = this.subInventoryList;
          editItemCopy.supplierId = editData.supplierId;
          editItemCopy.supplierCode = editData.supplierCode;
          editItemCopy.supplierName = editData.supplierName;
          this.updateEditModeSet('add', editItemCopy);
          if (this.isDifferenceOrder) {
            // 差异单
            editItemCopy.editModeSet.unitSet.requiredPackages = {
              min: '-9999999999'
            };
            editItemCopy.editModeSet.unitSet.requiredQuantityPerPackage = {
              disabled: true
            };
          } else {
            editItemCopy.editModeSet.unitSet.requiredQuantityPerPackage = {};
          }
          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            console.log(this.isDifferenceOrder)
            if (key === '物料编号') {
              editItemCopy.materialCode = item[key];
            } else if (key === '产品编号') {
              editItemCopy.productCode = item[key];
            } else if (key === '供应商') {
              let supplierData = this.supplierList.find(sItem => {
                return sItem.supplierName == item[key];
              });
              editItemCopy.supplierName = item[key];
              editItemCopy.supplierId = supplierData ? supplierData.supplierCode : '';
              editItemCopy.supplierCode = supplierData ? supplierData.supplierId : '';
              editItemCopy.supplierShortName = supplierData ? supplierData.supplierCode : '';
            } else if (key === '期望交期') {
              editItemCopy.requiredDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key === '请求数量包数') {
              editItemCopy.requiredPackages = item[key];
            } else if (key === '请求数量规格') {
              if (this.isDifferenceOrder) {
                editItemCopy.requiredQuantityPerPackage =(-item[key]);
              }else{
                editItemCopy.requiredQuantityPerPackage =item[key];
              }
            }else if (key === '请求数量') {
              // console.log(editItemCopy.requiredPackages);
              // console.log(editItemCopy.requiredQuantityPerPackage)
              if (this.isDifferenceOrder) {
                editItemCopy.requiredQuantity = (-item[key]);
              }else{
                editItemCopy.requiredQuantity = item[key];
              }
              
            } else if (key === '建议采购数量（按周）') {
              editItemCopy.suggestQuantity = item[key];
            } else if (key === '库位') {
              let subInventoryData = this.subInventoryList.find(siItem => {
                return siItem.subInventoryName == item[key];
              });
              editItemCopy.subInventoryName = item[key];
              editItemCopy.subInventory = subInventoryData ? subInventoryData.subInventory : '';
            } else if (key === '特殊要求') {
              editItemCopy.specialRequire = item[key];
            } else if(key==='销售订单编号' || key==='SO编号'){
              editItemCopy.saleOrderId=item[key];
            } else if (key === '备注') {
              editItemCopy.remark = item[key];
            } else if (key === '原PR行号') {
              editItemCopy.originalSn = item[key];
            } else if (key === '原PR编号') {
              editItemCopy.originalPurchaseRequestCode = item[key];
            } else if (key === '原确认书编号'){
              editItemCopy.originalConfirmNum=item[key];
            }
          });
          editData.pricList.push(editItemCopy);
        }
        let specifications=[];//原确认书编号和PR编号,行号,uuid集合（调接口获取规格）
        for (let i = 0; i < editData.pricList.length; i++) {
          let prItem = editData.pricList[i];
          // console.error(prItem);
          let businessTypeList = [];
          let specificationsObj={
            originalConfirmNum:prItem.originalConfirmNum,
            originalPurchaseRequestCode:prItem.originalPurchaseRequestCode,
            originalSn:prItem.originalSn,
            meaterialCode:prItem.materialCode,
            uuid:prItem.uuid
          };
          specifications.push(specificationsObj);
          // console.log(specifications)
          let materialCodes = [prItem.materialCode];
          prItem.productCode = '';
          switch (this.editData.virtualInventoryId) {
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
            console.log('批量查询数据：', res);
            if (res.code === '0') {
              let batchData = [res.data];
              console.log(batchData)
              batchData.map((batchItem, batchIndex) => {
                for (let key in batchItem) {
                  if (key == prItem.materialCode) {
                    if (!batchItem[key]) {
                      prItem.productCode = '';
                      prItem.supplierId = '';
                      prItem.supplierCode = '';
                      prItem.supplierName = '';
                      this.$message({
                        type: 'error',
                        message: '该物料编号下无产品编号、供应商信息！'
                      });
                      return false;
                    }
                    let pcArr = [];
                    for (let i = 0; i < batchItem[key].productCode.length; i++) {
                      pcArr.push(batchItem[key].productCode[i].productCode);
                    }
                    prItem.productCode = pcArr.join(',');
                    prItem.productCodeList = batchItem[key].productCode;
                    prItem.supplierId = batchItem[key].supplierId;
                    prItem.supplierCode = batchItem[key].supplierCode;
                    prItem.supplierName = batchItem[key].supplierName;
                    prItem.supplierShortName = batchItem[key].supplierShortName;
                    prItem.purchaseMeasurementUnit = batchItem[key].purchaseMeasurementUnit;
                    this.$forceUpdate();
                  }
                }
              });
            }
          });
           if (this.isDifferenceOrder) {
             // 差异单
              await confirmationNoQuery(specifications).then(res => {
                console.log('批量查询数据：', res);
                let confirmationRes=res.data;
                console.log(Object.keys(confirmationRes).length!=0);
                if(Object.keys(confirmationRes).length!=0){
                    for (let i = 0; i < editData.pricList.length; i++) {
                    let prItem = editData.pricList[i];
                    for (var key in confirmationRes) {
                        console.log(key);     //获取key值
                        console.log(confirmationRes[key]); //获取对应的value值
                        if(prItem.uuid==key){
                          if(confirmationRes[key]>0){
                             prItem.requiredQuantityPerPackage=(-confirmationRes[key]);
                          }else{
                             prItem.requiredQuantityPerPackage=confirmationRes[key];
                          }                      
                          prItem.requiredQuantity=prItem.requiredPackages*prItem.requiredQuantityPerPackage;
                        }
                    }
                  }
                }else{
                   for (let i = 0; i < editData.pricList.length; i++) {
                    let prItem = editData.pricList[i];
                     prItem.requiredQuantityPerPackage=(-prItem.requiredQuantityPerPackage);
                     prItem.requiredQuantity=prItem.requiredPackages*prItem.requiredQuantityPerPackage;
                   }
                }
               
              });
           }
         
        }
        this.editData = editData;
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },
    extendsHandle(obj1, obj2) {
      for (var key in obj2) {
        obj1[key] = obj2[key];
      }
      return obj1;
    },

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
          for (let j = 0; j < item.priList.length; j++) {
            let cItem = item.priList[j];
            this.childMultipleSelection.push(cItem);
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && !Array.isArray(this.$refs['childMultipleTable_' + item.id])) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
        for (let i = 0; i < this.requestList.length; i++) {
          let item = this.requestList[i];
          for (let j = 0; j < item.priList.length; j++) {
            let cItem = item.priList[j];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && !Array.isArray(this.$refs['childMultipleTable_' + item.id])) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, false);
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
        for (let i = 0; i < row.priList.length; i++) {
          let cItem = row.priList[i];
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id] && !Array.isArray(this.$refs['childMultipleTable_' + row.id])) {
              this.$refs['childMultipleTable_' + row.id].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    selectHandle(selection, row) {
      console.log('当用户手动勾选数据行的 Checkbox 时触发事件：', selection, row);
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
          for (let i = 0; i < _row.priList.length; i++) {
            let cItem = _row.priList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && !Array.isArray(this.$refs['childMultipleTable_' + _row.id])) {
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.priList.length; i++) {
            let cItem = _row.priList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && !Array.isArray(this.$refs['childMultipleTable_' + _row.id])) {
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, false);
              }
            });
            this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
              return cmsItem.uuid !== cItem.uuid;
            });
          }
        }
      } else {
        // 未选中 需删除该父项下所有子项
        this.$refs['childMultipleTable_' + _row.id].clearSelection();
        for (let i = 0; i < row.priList.length; i++) {
          let item = row.priList[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
            let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
            this.childMultipleSelection.splice(index, 1);
          }
        }
      }
    },
    async childSelectHandle(selection, row, parentRow) {
      // 选择子项
      console.log('选择子项：', selection, row, parentRow);
      let uuidList = [];
      for (var i = 0; i < selection.length; i++) {
        let item = selection[i];
        uuidList.push(item.uuid);
      }
      if (uuidList.indexOf(row.uuid) > -1) {
        // 当前项选中状态
        if (this.arrContainObjHandle(this.childMultipleSelection, row) === -1) {
          this.childMultipleSelection.push(row);
        }
      } else {
        // 取消选中
        if (this.arrContainObjHandle(this.childMultipleSelection, row) != -1) {
          let index = this.childMultipleSelection.findIndex(x => x.uuid == row.uuid);
          this.childMultipleSelection.splice(index, 1);
        }
      }
      await this.$nextTick();
      if (selection.length === parentRow.priList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          if (this.$refs.multipleTable && !Array.isArray(this.$refs.multipleTable)) {
            this.$refs.multipleTable.toggleRowSelection(parentRow, true);
          }
        });
      }
      if (!Array.isArray(this.$refs.multipleTable)) {
        this.$refs.multipleTable.toggleRowSelection(parentRow, false);
      }
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
      console.log('子项全选操作：', selection, parentRow);
      await this.$nextTick();
      if (selection && selection.length) {
        this.$nextTick(() => {
          if (this.$refs.multipleTable && !Array.isArray(this.$refs.multipleTable)) {
            this.$refs.multipleTable.toggleRowSelection(parentRow, true);
          }
        });
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) === -1) {
            this.childMultipleSelection.push(item);
          }
        }
      } else {
        for (let i = 0; i < parentRow.priList.length; i++) {
          let item = parentRow.priList[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
            let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
            this.childMultipleSelection.splice(index, 1);
          }
        }
        if (!Array.isArray(this.$refs.multipleTable)) {
          this.$refs.multipleTable.toggleRowSelection(parentRow, false);
        }
      }
    },
    arrContainObjHandle(arr, obj) {
      var index = arr.findIndex(item => item.uuid == obj.uuid);
      return index;
    },

    downloadSelectExcelHandle() {
      // 导出已选择项
      let headerList = [];
      let fieldList = [];
      if (this.childMultipleSelection.length) {
        this.downloadExcelLoading = true;
        this.fieldsList.forEach(item => {
          headerList.push(item.name);
        });
        this.childData.data.forEach(item => {
          fieldList.push(item.field);
        });
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = headerList;
          const filterVal = fieldList;
          // const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date'];
          // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time'];
          const list = this.childMultipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename
          });
          // this.$refs.multipleTable[0].clearSelection();
          this.$refs['multipleTable' + this.activeName][0].clearSelection();
          this.downloadExcelLoading = false;
        });
      } else {
        this.$message({
          message: '请选择需要导出的数据！',
          type: 'warning'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
          this.$set(this.requestList, index, item);
          this.$forceUpdate();
        }
      });
    },
    exportExcelTemplate() {
      // 导出Excel模板
      const headerList = ['物料编号', '产品编号', '供应商', '期望交期', '请求数量包数', '请求数量规格', '请求数量', '建议采购数量（按周）', '库位','销售订单编号', '特殊要求', '备注', '原PR行号', '原PR编号', '原确认书编号'];
      const data = [['LK-WL1', 'LK-CP1', 'SVBC', '2020-10-12', '3', '30', '90', '0', 'B库(零剪库)','SO2020100900001', '无', '测试导入', '1', 'PR2020111000015', '202011111055']];
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headerList, //Header Required
          data, //Specific data Required
          filename: 'PR导入模板', //Optional
          autoWidth: true, //Optional
          bookType: 'xlsx' //Optional
        })
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
        if(date.month<10){
            date.date = '0'+ date.date;  //补齐
        }
        this.latestTime = date.year + '-' + date.month + '-'  + date.date;
    },
    purchaseTypeSelect(val) {
      // 请求类型改变
      console.log('请求类型值改变：', val);
      let isB0orC0 = (this.editData.virtualInventoryId == 'B0' || this.editData.virtualInventoryId == 'C0') ? true : false;
      // let isDifferenceType = (this.editData.purchaseTypeName && this.editData.purchaseTypeName.includes('差异单')) ? true : false;
      if (val) {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let purchaseTypeData = this.requestTypeList.find(item => {
          return item.dictItemValue == val;
        });
        editDataCopy.purchaseTypeName = purchaseTypeData.dictItemName;
        if (editDataCopy.purchaseTypeName.split('-')[0] == '以销定采') {
          this.isPurchaseBySale = true;
          this.isDisabledPull = false;
        } else {
          this.isPurchaseBySale = false;
          if (!isB0orC0) {
            this.isDisabledPull = true;
          } else {
            this.isDisabledPull = false;
          }
        }
        if (editDataCopy.purchaseTypeName.includes('差异单')) {
          // 差异单
          this.isDisabledPull = true;
          this.isDifferenceOrder = true;
          this.editFieldsList = this.originalEditFieldsList;
          this.$forceUpdate();
        } else {
          this.isDifferenceOrder = false;
          this.editFieldsList = this.standardEditFieldsList;
          this.$forceUpdate();
        }
        if (editDataCopy.purchaseTypeName == '备货采购-零剪-坯布/纱线') {
          this.isDisabledPull = true;
        }
        this.editData = editDataCopy;
      }
    },
    async virtualInventorySelect(val) {
      // 入库仓位改变
      // console.log('入库仓位值改变：', val);
      let isStockUpType = (this.editData.purchaseTypeName && this.editData.purchaseTypeName.split('-')[0] != '以销定采') ? true : false;
      let isDifferenceType = (this.editData.purchaseTypeName && this.editData.purchaseTypeName.includes('差异单')) ? true : false;
      if (this.editData.pricList && this.editData.pricList.length) {
        this.editData.pricList.forEach(item => {
          item.subInventory = '';
        });
      }
      if (val) {
        let isB0orC0 = val == 'B0' || val == 'C0' ? true : false;
        if (!isB0orC0 && isStockUpType) {
          this.isDisabledPull = true;
        } else if (isDifferenceType) {
          this.isDisabledPull = true;
        } else if (this.editData.purchaseTypeName == '备货采购-零剪-坯布/纱线') {
          this.isDisabledPull = true;
        } else {
          this.isDisabledPull = false;
        }
        await subInventoryTypeList(val).then(res => {
          console.log('库位列表：', res);
          if (res.code === '0') {
            this.subInventoryList = res.data;
          }
        });
        // this.getSubInventoryTypeList(val);
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let virtualInventoryData = this.virtualInventoryList.find(item => {
          return item.index == val;
        });
        // editDataCopy.virtualInventoryId = val;
        editDataCopy.virtualInventoryName = virtualInventoryData.name;
        if (editDataCopy.purchaseTypeName && editDataCopy.purchaseTypeName.includes('坯布/纱线')) {
          // 坯布/纱线 库位只能是工厂库
          this.subInventoryList = this.subInventoryList.filter(x => {
            return x.subInventoryName.includes('工厂库');
          });
        }
        if (editDataCopy.purchaseTypeName && editDataCopy.purchaseTypeName.includes('面料生产')) {
          // 面料生产 库位过滤掉工厂库
          this.subInventoryList = this.subInventoryList.filter(x => {
            return !x.subInventoryName.includes('工厂库');
          });
        }
        this.editData = editDataCopy;
        this.$forceUpdate();
      }
    },
    supplierNameChange(val) {
      // 供应商改变
      console.log('供应商值改变：', val);
      if (val) {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let supplierData = this.supplierList.find(item => {
          return item.supplierId == val;
        });
        editDataCopy.supplierId = val;
        editDataCopy.supplierCode = supplierData.supplierCode;
        editDataCopy.supplierShortName = supplierData.supplierCode;
        editDataCopy.supplierName = supplierData.supplierName;
        // if (editDataCopy.pricList && editDataCopy.pricList.length) {
        //   for (var i = 0; i < editDataCopy.pricList.length; i++) {
        //     let data = editDataCopy.pricList[i];
        //     if (data.supplierId != editDataCopy.supplierId) {
        //       this.inputSetClassHandle(data, 'materialCode', 'danger');
        //     } else {
        //       this.inputSetClassHandle(data, 'materialCode', '');
        //     }
        //   }
        // }
        this.editData = editDataCopy;
      }
    },
    inputSetClassHandle(item, field, classType) {
      let editModeSet = JSON.parse(JSON.stringify(item.editModeSet));
      let inputSet = JSON.parse(JSON.stringify(item.editModeSet.inputSet));
      switch (classType) {
        case 'danger':
          inputSet[field].class = 'input_single w80p danger';
          break;
      
        default:
          inputSet[field].class = 'input_single w80p';
          break;
      }
      editModeSet.inputSet = inputSet;
      item.editModeSet = editModeSet;
    },
    async pullDataHandle() {
      // 拉取数据
      if (!this.editData.purchaseType) {
        this.$message({
          type: 'error',
          message: '请选择请求类型！'
        });
        return false;
      }
      if (!this.editData.virtualInventoryId) {
        this.$message({
          type: 'error',
          message: '请选择入库仓位！'
        });
        return false;
      }
      // if (this.isDifferenceOrder) {
      //   // 请求类型 差异单
      //   if (!this.editData.saleOrderId) {
      //     this.$message({
      //       type: 'error',
      //       message: '请输入原PR编号！'
      //     });
      //     return false;
      //   }
      // }
      // if (!this.editData.supplierName) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择供应商！'
      //   });
      //   return false;
      // }
      let businessType = '';
      let data = {
        uuid: '',
        purchaseType: '',
        submitType: '',
        purchaseTypeName: '',
        virtualInventoryId: '',
        virtualInventoryName: '',
        saleOrderId: '',
        customerName: '',
        applicant: this.$store.getters.getUserName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.getters.getdepartmentId,
        applicantDepartmentName: this.$store.state.currentDepartment.name,
        pricList: []
      };
      data = Object.assign(data, this.editData);
      // 获取库位列表
      this.getSubInventoryTypeList(data.virtualInventoryId);
      getUUID().then(res => {
        if (res.code === '0') {
          data.uuid = res.data;
        }
      });
      if (this.editData.virtualInventoryId == 'C0') {
        businessType = '1';
      } else if (this.editData.virtualInventoryId == 'B0') {
        businessType = '2';
      }
      if (data.purchaseTypeName.split('-')[0] == '以销定采') {
        let params = {
          saleOrderId: data.saleOrderId,
          saleOrderType: ''
        };
        await pullPurchaseRequest(params).then(res => {
          console.log('拉取以销定采数据：', res);
          if (res.code === '0') {
            if (!res.data) {
              this.$message({
                type: 'error',
                message: '无数据可拉取！'
              });
              return false;
            }
            this.isEmptyData = false;
            data.customerName = res.data.customerName;
            if (res.data.saleOrderItemList.length) {
              for (var i = 0; i < res.data.saleOrderItemList.length; i++) {
                let pData = res.data.saleOrderItemList[i];
                getUUID().then(res => {
                  if (res.code === '0') {
                    pData.uuid = res.data;
                  }
                });
                this.updateEditModeSet('pull', pData);
                pData.suggestQuantity = pData.quantity;
                pData.requiredDate = pData.customerOfferedDate;
                pData.subInventoryList = this.subInventoryList;
                pData.remark = pData.remarksAndCompanyRemarks;
                pData.specialRequire = pData.companyRemarks;
                //this.getProductCodeHandle(pData)
              }
              this.getBatchQuery(res.data.saleOrderItemList);
            }
            setTimeout(() => {
              data.pricList = res.data.saleOrderItemList;
              this.editData = data;
              this.$forceUpdate();
            }, 1000);
            // this.$set(this.editData, 'pricList', res.data.saleOrderItemList);
          }
        });
      } else {
        let params = {
          businessType: businessType,
          unit: 'W',
          startTime: getNowDate()
        };
        await pullPlanPurchaseRequest(params).then(res => {
          console.log('拉取备货计划数据：', res);
          if (res.code === '0') {
            this.isDisabledPull = true;
            if (!res.data || !res.data.length) {
              this.$message({
                type: 'error',
                message: '无数据可拉取！'
              });
              return false;
            }
            this.isEmptyData = false;
            for (var i = 0; i < res.data.length; i++) {
              let pData = res.data[i];
              getUUID().then(res => {
                if (res.code === '0') {
                  pData.uuid = res.data;
                }
              });
              this.updateEditModeSet('pull', pData);
              if (this.isDifferenceOrder) {
                // 差异单
                pData.editModeSet.unitSet.requiredPackages = {
                  min: '-9999999999'
                };
              }
              // pData.suggestQuantity = pData.readyPlanQuantity;
              pData.suggestQuantity = pData.adviceQuantity;
              pData.subInventoryList = this.subInventoryList;
              // this.getProductCodeHandle(pData);
            }
            this.getBatchQuery(res.data);
            data.pricList = res.data;
            this.editData = data;
            this.$forceUpdate();
          }
        });
      }
    },

    async addEditHandle() {
      // 添加编辑项
      if (!this.editData.purchaseType) {
        this.$message({
          type: 'error',
          message: '请选择请求类型！'
        });
        return false;
      }
      if (!this.editData.virtualInventoryId) {
        this.$message({
          type: 'error',
          message: '请选择入库仓位！'
        });
        return false;
      }
      // if (this.isDifferenceOrder) {
      //   // 请求类型 差异单
      //   if (!this.editData.saleOrderId) {
      //     this.$message({
      //       type: 'error',
      //       message: '请输入原PR编号！'
      //     });
      //     return false;
      //   }
      // }
      // if (!this.editData.supplierName) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择供应商！'
      //   });
      //   return false;
      // }
      // this.isDisabledAddEdit = true;
      if (this.isEmptyData) {
        // 空数据
        let data = {
          uuid: '',
          purchaseType: '',
          submitType: '',
          purchaseTypeName: '',
          virtualInventoryId: '',
          virtualInventoryName: '',
          saleOrderId: '',
          customerName: '',
          applicant: this.$store.getters.getUserName,
          applicantName: this.$store.state.realName,
          applicantDepartment: this.$store.getters.getdepartmentId,
          applicantDepartmentName: this.$store.state.currentDepartment.name,
          pricList: []
        };
        let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
        data = Object.assign(data, this.editData);
        this.updateEditModeSet('add', editItemCopy);
        if (this.isDifferenceOrder) {
          // 差异单
          editItemCopy.editModeSet.unitSet.requiredPackages = {
            min: '-9999999999'
          };
        }

        // 获取库位列表
        // await this.getSubInventoryTypeList(this.editData.virtualInventoryId);

        // 备货采购-工装-纱线 + 入库仓位：零剪/职业装仓 库位显示 零剪/职业装工厂库
        // 入库仓位 B0 零剪仓 C0 职业装仓
        if (this.editData.purchaseType == 'B020203' && this.editData.virtualInventoryId == 'B0') {
          this.subInventoryList = this.subInventoryList.filter(siItem => {
            return siItem.subInventoryName == '零剪仓工厂库';
          });
        } else if (this.editData.purchaseType == 'B020203' && this.editData.virtualInventoryId == 'C0') {
          this.subInventoryList = this.subInventoryList.filter(siItem => {
            return siItem.subInventoryName == '职业装仓工厂库';
          });
        }
        
        editItemCopy.subInventoryList = this.subInventoryList;
        editItemCopy.supplierId = data.supplierId;
        editItemCopy.supplierCode = data.supplierCode;
        editItemCopy.supplierName = data.supplierName;
        getUUID().then(res => {
          if (res.code === '0') {
            data.uuid = res.data;
          }
        });
        getUUID().then(res => {
          if (res.code === '0') {
            editItemCopy.uuid = res.data;
            data.pricList.push(editItemCopy);
            this.isEmptyData = false;
          }
        });
        this.editData = data;
      } else {
        let editDataCopy = JSON.parse(JSON.stringify(this.editData));
        let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
        this.updateEditModeSet('add', editItemCopy);
        if (this.isDifferenceOrder) {
          // 差异单
          editItemCopy.editModeSet.unitSet.requiredPackages = {
            min: '-9999999999'
          };
        }
        editItemCopy.subInventoryList = this.subInventoryList;
        editItemCopy.supplierId = editDataCopy.supplierId;
        editItemCopy.supplierCode = editDataCopy.supplierCode;
        editItemCopy.supplierName = editDataCopy.supplierName;
        getUUID().then(res => {
          if (res.code === '0') {
            editItemCopy.uuid = res.data;
            editDataCopy.pricList.push(editItemCopy);
          }
        });
        this.editData = editDataCopy;
      }
    },
    deleteEditItemHandle(index, item) {
      // 删除编辑项
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      editDataCopy.pricList.splice(index, 1);
      this.editData = editDataCopy;
    },
    editHandle(index, item) {
      // 编辑
      console.log('编辑项：', item);
      this.editType = 'edit';
      this.prStatus = this.activeName;
      this.isEmptyData = false;  // 父项数据是否可编辑
      let editDataCopy = JSON.parse(JSON.stringify(this.editData));
      // 获取库位列表
      this.getSubInventoryTypeList(item.virtualInventoryId);
      searchPurchaseRequest(item.id).then(res => {
        // console.log('申请采购编辑项查询数据：', res);
        if (res.code === '0' && res.data) {
          editDataCopy = res.data;
          if (editDataCopy.purchaseTypeName && editDataCopy.purchaseTypeName.split('-')[0] == '以销定采') {
            this.isPurchaseBySale = true;
          } else {
            this.isPurchaseBySale = false;
          }
          if (editDataCopy.purchaseTypeName.includes('差异单')) {
            // 差异单
            this.editFieldsList = this.originalEditFieldsList;
            this.$forceUpdate();
          } else {
            this.editFieldsList = this.standardEditFieldsList;
            this.$forceUpdate();
          }
          editDataCopy.pricList = res.data.priList;
          for (var i = 0; i < editDataCopy.pricList.length; i++) {
            let data = editDataCopy.pricList[i];
            data.subInventoryList = this.subInventoryList;
            // this.getProductCodeHandle(data);
            this.updateEditModeSet('edit', data);
            if (editDataCopy.purchaseTypeName.includes('差异单')) {
              this.isDifferenceOrder = true;
              // 差异单
              data.editModeSet.unitSet.requiredPackages = {
                min: '-9999999999'
              };
            }else{
              this.isDifferenceOrder = false;
            }
          }
          this.editData = editDataCopy;
          this.isShowEdit = true;
        }
      });
    },
    submitHandle(index, item) {
      // 列表提交
      this.submitDialogVisible = true;
      if (item.prStatus == 'Draft') {
        this.editData.submitType = '2';
      }
      if (item.prStatus == 'Rejected') {
        this.editData.submitType = '4';
      }
      this.submitId = item.id;
      this.submitObj = {
        uuid: item.uuid,
        prStatus: 'Approving',
        submitType: this.editData.submitType,
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
    },
    confirmSubmitHandle() {
      // 列表提交审批
      submitPurchaseRequest(this.submitId, this.submitObj).then(res => {
        // console.log('提交审批项：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.$message({
            type: 'success',
            message: '提交审批成功！'
          });
          this.activeName = 'Approving';
          this.prStatus = 'Approving';
          if (this.prStatus == 'Draft') {
            this.getPurchaseRequestDraftList();
          } else {
            this.getPurchaseRequestList();
          }
        }
      });
    },
    deleteHandle(index, item) {
      // 列表删除
      this.deleteDialogVisible = true;
      this.deleteId = item.id;
      this.isEdit=false;
    },
    editDeleteHandle(index,item){
      this.deleteDialogVisible = true;
      this.deleteId = item.id;
      this.isEdit=true;
    },
    confirmDeleteHandle() {
      // 列表删除确认（子项删除）
      if(this.isEdit){
        deletePurchaseRequestitems(this.deleteId).then(res => {
          // console.log('删除项：', res);
          if (res.code === '0') {
            this.deleteDialogVisible = false;
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            if (this.prStatus == 'Draft') {
              this.getPurchaseRequestDraftList();
            } else {
              this.getPurchaseRequestList();
            }
          }
        });
      }else{
        deletePurchaseRequest(this.deleteId).then(res => {
          // console.log('删除项：', res);
          if (res.code === '0') {
            this.deleteDialogVisible = false;
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            if (this.prStatus == 'Draft') {
              this.getPurchaseRequestDraftList();
            } else {
              this.getPurchaseRequestList();
            }
          }
        });
      }
    },
    revokeHandle(index, item) {
      // 列表撤销（已通过）
      this.revokeDialogVisible = true;
      this.revokeUuid = item.uuid;
    },
    revokeDeleteHandle() {
      // 列表撤销确认
      revokePurchaseRequestItem(this.revokeUuid).then(res => {
        console.log('撤销项：', res);
        if (res.code === '0') {
          this.revokeDialogVisible = false;
          this.$message({
            type: 'success',
            message: '撤销成功！'
          });
          this.getPurchaseRequestList();
        }
        this.revokeDialogVisible = false;
      });
    },
    cancelEditHandle() {
      // 编辑取消
      this.isShowEdit = false;
    },
    updateEditHandle(type) {
      // 编辑保存/提交审批
      console.log('保存编辑值：', this.editData);
      // return false;
      let list = this.editData.pricList;
      // if (this.editData.supplierName) {
      //   let supplierData = this.supplierList.find(item => {
      //     return item.supplierName == this.editData.supplierName;
      //   });
      //   this.editData.supplierId = supplierData.supplierId;
      // }

      // if (!this.editData.supplierName || !this.editData.supplierId) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择供应商！'
      //   });
      //   return false;
      // }
      if (!list) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.editData.purchaseType) {
        this.$message({
          type: 'error',
          message: '请选择请求类型！'
        });
        return false;
      }
      if (!this.editData.virtualInventoryId) {
        this.$message({
          type: 'error',
          message: '请选择入库仓位！'
        });
        return false;
      }
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        if (!data.materialCode) {
          this.$message({
            type: 'error',
            message: '请输入物料编号！'
          });
          return false;
        }
        // if (!data.productCode) {
        //   this.$message({
        //     type: 'error',
        //     message: '请重新输入物料编号查询产品编号！'
        //   });
        //   return false;
        // }
        if (!data.supplierId) {
          this.$message({
            type: 'error',
            message: '请重新输入物料编号查询供应商！'
          });
          return false;
        }
        if (!data.requiredDate) {
          this.$message({
            type: 'error',
            message: '请选择期望交期！'
          });
          return false;
        }
        if (data.purchaseMeasurementUnit == '米') {
          if (!data.requiredPackages) {
            this.$message({
              type: 'error',
              message: '请输入请求数量！'
            });
            return false;
          }
          if (!verificationQuantity(this, data.requiredPackages, 8, 2, '请求数量')) {
            return false;
          }
          if (!data.requiredQuantityPerPackage) {
            this.$message({
              type: 'error',
              message: '请输入请求数量！'
            });
            return false;
          }
          if (!verificationQuantity(this, data.requiredQuantityPerPackage, 8, 2, '请求数量')) {
            return false;
          }
          // if (!data.requiredQuantity) {
          //   this.$message({
          //     type: 'error',
          //     message: '请输入请求数量！'
          //   });
          //   return false;
          // }
          // if (!verificationQuantity(this, data.requiredQuantity, 8, 2, '请求数量')) {
          //   return false;
          // }
        } 
        // else {
        //   if (!data.requiredQuantity) {
        //     this.$message({
        //       type: 'error',
        //       message: '请输入请求数量！'
        //     });
        //     return false;
        //   }
        //   if (!verificationQuantity(this, data.requiredQuantity, 8, 2, '请求数量')) {
        //     return false;
        //   }
        // }
        if (!data.subInventory) {
          this.$message({
            type: 'error',
            message: '请选择库位！'
          });
          return false;
        }
        if (this.isDifferenceOrder) {
             // 差异单
             if(data.requiredPackages<0){
                this.$message({
                  type: 'error',
                  message: '差异单下包数不能为负数！'
                });
                return false;
             }
        }
      }

      if (type == 'save') {
        this.isSaveDisabled = true;
        if (this.prStatus == 'Rejected') {
          // 驳回保存
          this.editData.submitType = '3';
        } else {
          this.editData.submitType = '1';
        }
      } else {
        this.isSubmitDisabled = true;
        if (this.prStatus == 'Rejected') {
          // 驳回提交审批
          this.editData.submitType = '4';
        } else {
          this.editData.submitType = '2';
        }
      }
      if (this.prStatus == '0') {
        this.prStatus = '';
      }
      this.editData.applicant ? '' : this.editData.applicant = this.$store.state.userName;
      this.editData.applicantName ? '' : this.editData.applicantName = this.$store.state.realName;
      this.editData.applicantDepartment ? '' : this.editData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editData.applicantDepartmentName ? '' : this.editData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      if (this.editType == 'add') {
        // 新增
        addPurchaseRequest(this.editData).then(res => {
          // console.log('保存新增接口：', res);
          if (res.code === '0') {
            if (type == 'save') {
              this.activeName = 'Draft';
              this.prStatus = 'Draft';
              this.getPurchaseRequestDraftList();
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
            } else {
              this.activeName = 'Approving';
              this.prStatus = 'Approving';
              this.getPurchaseRequestList();
              this.$message({
                type: 'success',
                message: '提交审批成功！'
              });
            }
            this.isShowEdit = false;
          }
          if (type == 'save') {
            this.isSaveDisabled = false;
          } else {
            this.isSubmitDisabled = false;
          }
        });
      } else {
        // 编辑修改
        updatePurchaseRequest(this.editData).then(res => {
          // console.log('编辑修改接口：', res);
          if (res.code === '0') {
            if (type == 'save') {
              if (this.prStatus == 'Draft') {
                this.getPurchaseRequestDraftList();
              } else {
                this.getPurchaseRequestList();
              }
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
            } else {
              this.activeName = 'Approving';
              this.prStatus = 'Approving';
              this.getPurchaseRequestList();
              this.$message({
                type: 'success',
                message: '提交审批成功！'
              });
            }
            this.isShowEdit = false;
          }
          if (type == 'save') {
            this.isSaveDisabled = false;
          } else {
            this.isSubmitDisabled = false;
          }
        });
      }
    },
    getPurchaseRequestList() {
      // 申请采购列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        productCode: this.productCode,
        purchaseType: this.purchaseType,
        prStatus: this.prStatus,
        sort: this.sort,
        planTransferDate:this.latestTime,
        materialCode:this.materialCode
      };
      purchaseRequestList(this.currentPage, this.pageSize, data).then(res => {
        console.log('申请采购列表：', res);
        if (res.code === '0') {
          this.total = res.data.total;
          this.requestList = res.data.records;
          for (let i = 0; i < this.requestList.length; i++) {
            let item = this.requestList[i];
            item.status = item.prStatus;
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            if (item.offeredDate && item.offeredDate != undefined) {
              item.offeredDate = timeFormat(item.offeredDate);
            } else {
              item.offeredDate = '';
            }
            item.prStatusName = statusTypeHandle(item.prStatus);

            // 列表组件编辑项
            // switch (item.prStatus) {
            //   case 'Draft':
            //     item.actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
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
            for (var j = 0; j < item.priList.length; j++) {
              this.updateEditModeSet('edit', item.priList[j]);
            }
            item.pricList = item.priList;
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
    getPurchaseRequestDraftList() {
      // 申请采购草稿列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        productCode: this.productCode,
        purchaseType: this.purchaseType,
        prStatus: this.prStatus,
        sort: this.sort
      };
      purchaseRequestDraftList(this.currentPage, this.pageSize, data).then(res => {
        console.log('申请采购草稿列表：', res);
        if (res.code === '0') {
          this.total = res.data.total;
          this.requestList = res.data.records;
          for (let i = 0; i < this.requestList.length; i++) {
            let item = this.requestList[i];
            item.status = item.prStatus;
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            if (item.offeredDate && item.offeredDate != undefined) {
              item.offeredDate = timeFormat(item.offeredDate);
            } else {
              item.offeredDate = '';
            }
            item.prStatusName = statusTypeHandle(item.prStatus);
            // 列表组件编辑项
            // switch (item.prStatus) {
            //   case 'Draft':
            //     item.actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
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
            for (var j = 0; j < item.priList.length; j++) {
              this.updateEditModeSet('edit', item.priList[j]);
            }
            item.pricList = item.priList;
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
    async getMeasurementUnit(item) {
      // 获取计量单位
      await getMeasurementUnitByMC(item.materialCode).then(res => {
        // console.log('计量单位：', res);
        if (res.code === '0') {
          item.purchaseMeasurementUnit = res.data;
          this.$forceUpdate();
        }
      });
    },
    getSupplierInfo(item) {
      // 根据物料编号获取供应商
      // getSupplierByMC(item.materialCode).then(res => {
      //   console.log('根据物料编号获取供应商：', res);
      //   if (res.code === '0') {
      //     let obj = res.data;
      //     let arr = Object.keys(obj);
      //     if (!arr.length) {
      //       item.supplierName = '';
      //       item.supplierId = '';
      //       this.$message({
      //         type: 'error',
      //         message: '该物料编号下无供应商！'
      //       });
      //       return false;
      //     }
      //     let value = Object.values(obj);
      //     let keys = Object.keys(obj);
      //     item.supplierName = value[0];
      //     item.supplierId = keys[0];
      //     this.$forceUpdate();
      //   }
      // });
      existMaterialCode(item.materialCode).then(res => {
        if (res.code === '0') {
          if (!res.data) {
            this.$message({
              type: 'error',
              message: '查无此物料编号！'
            });
            // item.materialCode = '';
            // item.productCode = '';
            return false;
          }
          if (!res.data.supplierName && !res.data.supplierId) {
            item.supplierName = '';
            item.supplierId = '';
            this.$message({
              type: 'error',
              message: '该物料编号下无供应商！'
            });
            return false;
          }
          item.supplierName = res.data.supplierName;
          item.supplierId = res.data.supplierId;
        }
      });
    },
    
    getRequestTypeList() {
      // 请求类型
      dictList('purchaseType').then(res => {
        console.log('请求类型：', res);
        if (res.code === '0') {
          this.requestTypeList = res.data;
        }
      });
    },
    getVirtualInventory() {
      // 入库仓位
      constDictList('VirtualInventory').then(res => {
        console.log('入库仓位：', res);
        if (res.code === '0') {
          this.virtualInventoryList = res.data;
        }
      });
    },
    async getSubInventoryTypeList(virtualInventoryId) {
      // 库位
      await subInventoryTypeList(virtualInventoryId).then(res => {
        console.log('库位列表：', res);
        if (res.code === '0') {
          this.subInventoryList = res.data;
        }
      });
    },
    getSupplierList() {
      // 供应商列表
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    async getProductCodeHandle(data) {
      // 通过物料编号获取产品编号
      data.productCode = '';
      await getProductCodeByMC(data.materialCode, '', data.productCode).then(res => {
        console.log('通过物料编号获取产品编号：', res);
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
    async getBatchQuery(data){
      var _data=data;
      data.productCode = '';
      // let materialCodes=[data.materialCode];
      let materialCodes=[];
      for (var i = 0; i < data.length; i++) {
        materialCodes.push(data[i].materialCode);
      }
      let businessTypeList=[];
      switch(this.editData.virtualInventoryId){
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
      await batchQuery(sumList).then(res=>{
        var data=[res.data];
        var isArr=true;
        for(var j=0;j<_data.length;j++){
          data.map((item,i)=>{
            for (let key in item) {
              if (key == _data[j].materialCode) {
                if(item[key]==null){
                  data[i].supplierName = '';
                  data[i].productCode = '';
                  // this.$message({
                  //   type: 'error',
                  //   message: '该物料编号下无供应商 产品编号！'
                  // });
                  return false;
                }
                _data[j].supplierName=item[key].supplierName;
                _data[j].supplierId=item[key].supplierId;
                _data[j].supplierShortName=item[key].supplierShortName;
                _data[j].purchaseMeasurementUnit=item[key].purchaseMeasurementUnit
               
                if(item[key].productCode.length==0){
                  isArr=false;
                  //只执行一次
              // 　　   this.$message({
              //         type: 'error',
              //         message: '该物料编号下无产品编号！'
              //       });
                  return ;
                }else{
                  let pcArr = [];
                  for (var i = 0; i < item[key].productCode.length; i++) {
                    pcArr.push(item[key].productCode[i].productCode);
                  }
                  _data[j].productCode = pcArr.join(',');
                  this.$forceUpdate();
                }
                
              }
            }
          })
        }
        // this.$set(this.editData, 'pricList', data);
        // if(isArr==false){
        //     this.$message({
        //       type: 'error',
        //       message: '该物料编号下无产品编号！'
        //     });
        // }
      })
    },
    switchTabHandle(tab) {
      // Tab切换
      console.log('Tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.multipleSelection = [];
      this.childMultipleSelection = [];
      this.selectUuidList = [];  // 勾选项清空
      this.requestList = [];
      switch (tab.name) {
        case '':
          // 全部
          this.prStatus = '';
          this.fieldsList = this.moreFieldsList;
          this.childData = this.moreChildData;
          this.getPurchaseRequestList();
          break;
        case 'Draft':
          // 草稿
          this.prStatus = 'Draft';
          this.fieldsList = this.lessFieldsList;
          this.childData = this.lessChildData;
          this.getPurchaseRequestDraftList();
          break;
        case 'Approving':
          // 审批中
          this.prStatus = 'Approving';
          this.fieldsList = this.lessFieldsList;
          this.childData = this.lessChildData;
          this.getPurchaseRequestList();
          break;
        case 'Approved':
          // 已通过
          this.prStatus = 'Approved';
          this.fieldsList = this.moreFieldsList;
          this.childData = this.moreChildData;
          this.getPurchaseRequestList();
          break;
        case 'Rejected':
          // 已驳回
          this.prStatus = 'Rejected';
          this.fieldsList = this.lessFieldsList;
          this.childData = this.lessChildData;
          this.getPurchaseRequestList();
          break;
        case 'Terminated':
          // 已终止
          this.prStatus = 'Terminated';
          this.fieldsList = this.lessFieldsList;
          this.childData = this.lessChildData;
          this.getPurchaseRequestList();
          break;
        default:
          this.prStatus = '';
          this.fieldsList = this.moreFieldsList;
          this.childData = this.moreChildData;
          break;
      }
    },
    dateValChange(val) {
      // 创建时间变化
      // this.beginTime = val[0];
      // this.endTime = val[1];
    },
    searchHandle() {
      // 搜索
      console.log(this.dateVal)  
      this.currentPage = 1;
      this.requestList = [];
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      if (this.prStatus == 'Draft') {
        this.getPurchaseRequestDraftList();
      } else {
        this.getPurchaseRequestList();
      }
    },
    async addHandle() {
      // 新增
      this.editFieldsList = this.standardEditFieldsList;
      this.editData = {};
      await getUUID().then(res => {
        if (res.code === '0') {
          this.editData.uuid = res.data;
        }
      });
      this.editData.supplierCode = '';
      this.editData.supplierId = '';
      this.editData.supplierName = '';
      this.editData.prStatus = 'Draft';
      this.editType = 'add';
      this.isShowEdit = true;
      this.isEmptyData = true;
      this.isDisabledPull = false;
      this.isDisabledSupplier = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.prStatus == 'Draft') {
        this.getPurchaseRequestDraftList();
      } else {
        this.getPurchaseRequestList();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.prStatus == 'Draft') {
        this.getPurchaseRequestDraftList();
      } else {
        this.getPurchaseRequestList();
      }
    },

    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));
      let unitSet = JSON.parse(JSON.stringify(this.unitSet));
      if (type == 'edit') {
        switch (status) {
          case 'Draft':

            break;
          case 'Approved':
            
            break;
          default:
            break;
        }
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.selectSet = selectSet;
      editModeSet.datePickerSet = datePickerSet;
      editModeSet.unitSet = unitSet;
      data.editModeSet = editModeSet;
    },
    async inputChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editData.pricList));
      // this.isDisabledAddEdit = true;
      switch (fieldItem.field) {
        case 'materialCode':
          // 物料编号
          console.log('物料编号改变：', val, item, fieldItem);
          let businessType = '';
          item.productCode = '';
          item.supplierName = '';
          item.supplierId = '';
          if (!item.materialCode) {
            this.$message({
              type: 'error',
              message: '请输入物料编号！'
            });
            return false;
          }
          // this.inputSetClassHandle(item, 'materialCode', '');
          if (this.editData.virtualInventoryId == 'C0') {
            businessType = '1';
          } else if (this.editData.virtualInventoryId == 'B0') {
            businessType = '2';
          }
          for (var i = 0; i < editListCopy.length; i++) {
            if (editListCopy[i].uuid == item.uuid) {
              let data = editListCopy[i];
              let sqParams = {
                businessType: businessType,
                unit: 'W',
                startTime: getNowDate(),
                materialCode: data.materialCode
              };
              await existMaterialCode(data.materialCode).then(eRes => {
                console.log('验证物料编号：', eRes);
                if (eRes.code === '0') {
                  data.productCode = '';
                  if (!eRes.data) {
                    this.$message({
                      type: 'error',
                      message: '查无此物料编号！'
                    });
                    data.materialCode = '';
                    data.productCode = '';
                    return false;
                  }

                  // 根据物料编号查询产品编号
                  //this.getProductCodeHandle(data);
                  this.getBatchQuery([data]);
                  // getProductCodeByMC(data.materialCode, '', data.productCode).then(res => {
                  //   console.log('根据物料编号查询产品编号：', res);
                  //   if (res.code === '0') {
                  //     if (!res.data || !res.data.length) {
                  //       this.$message({
                  //         type: 'error',
                  //         message: '该物料编号下未查询到产品编号！'
                  //       });
                  //       return false;
                  //     }
                  //     let pcArr = [];
                  //     for (var i = 0; i < res.data.length; i++) {
                  //       pcArr.push(res.data[i].productCode);
                  //     }
                  //     data.productCode = pcArr.join(',');
                  //     data.productCodeList = res.data;
                  //     this.$forceUpdate();
                  //   }
                  // });

                  // setTimeout(function() {
                    if (!eRes.data.supplierName && !eRes.data.supplierId) {
                      data.supplierName = '';
                      data.supplierId = '';
                      data.supplierShortName = '';
                      this.$message({
                        type: 'error',
                        message: '该物料编号下无供应商！'
                      });
                      return false;
                    }
                    data.supplierName = eRes.data.supplierName;
                    data.supplierId = eRes.data.supplierId;
                    data.supplierShortName = eRes.data.supplierShortName;
                    // data.supplierCode = eRes.data.supplierCode;

                    // if (data.supplierId !== this.editData.supplierId) {
                    //   this.inputSetClassHandle(data, 'materialCode', 'danger');
                    //   this.$message({
                    //     type: 'error',
                    //     message: `该物料编号不属于${this.editData.supplierName}供应商，请确认后再添加！`
                    //   });
                    // } else {
                    //   this.inputSetClassHandle(data, 'materialCode', '');
                    // }
                  // }, 1000);
                  
                  // 计量单位
                  this.getMeasurementUnit(data);

                  // 查询建议采购数量
                  searchSuggestQuantity(sqParams).then(res => {
                    // console.log('查询建议采购数量：', res);
                    if (res.code === '0' && res.data) {
                      data.suggestQuantity = res.data.readyPlanQuantity;
                    }
                  });

                }
              });

            }
          }
          this.editData.pricList = editListCopy;
          // this.isDisabledAddEdit = false;
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },
    inputBlur(val, item, fieldItem) {
      let time = null;
      let _this = this;
      let editListCopy = JSON.parse(JSON.stringify(this.editData.pricList));
      switch (fieldItem.field) {
        case 'materialCode':
          // 物料编号
          console.log('物料编号失焦：', val, item, fieldItem);
          time = setTimeout(function() {
            if (!item.productCode || !item.supplierId) {
              _this.inputChange(val, item, fieldItem);
            }
            clearTimeout(time);
          }, 1000);
          break;
      
        default:
          break;
      }
    },
    selectChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'subInventory':
          // 库位
          console.log('库位值改变：', val, item, fieldItem);
          if (val) {
            let subInventoryData = item.subInventoryList.find(sItem => {
              return sItem.subInventory == val;
            });
            item.subInventoryName = subInventoryData.subInventoryName;
          }
          break;
      
        default:
          break;
      }
    },
    selectVisibleChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'subInventory':
          // 库位
          console.log('库位值显隐：', val, item, fieldItem);
          item.subInventoryList = this.subInventoryList;
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
        case 'requiredPackages':
          // 请求数量包数
          console.log('请求数量包数值改变：', val, item, fieldItem, step);
          item.requiredQuantity = (Number(item.requiredPackages ? item.requiredPackages : 0) * Number(item.requiredQuantityPerPackage ? item.requiredQuantityPerPackage : 0)).toFixed(2);
          this.$forceUpdate();
          break;
        case 'requiredQuantityPerPackage':
          // 请求数量规格
          console.log('请求数量规格改变：', val, item, fieldItem, step);
          item.requiredQuantity = (Number(item.requiredPackages ? item.requiredPackages : 0) * Number(item.requiredQuantityPerPackage ? item.requiredQuantityPerPackage : 0)).toFixed(2);
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },
    // 产品编号远程搜索
    selectRemoteMethod(query, item, fieldItem) {
      switch (fieldItem.field) {
        case 'productCode':
          // 产品编号
          console.log('产品编号远程搜索：', query, item, fieldItem);
          if (query !== '' && query != undefined && item.materialCode) {
            this.selectRemoteLoading = true;
            setTimeout(() => {
              this.selectRemoteLoading = false;
              // 通过物料编号获取产品编号
              getProductCodeByMC(item.materialCode, '', query).then(res => {
                if (res.code === '0') {
                  item.productCodeList = res.data;
                  item.productCodeList = res.data.filter(pItem => {
                    return pItem.productCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
                  });
                  this.$forceUpdate();
                }
              });
            }, 500);
          } else {
            item.productCodeList = [];
          }
          break;
      
        default:
          break;
      }
    },
    selectRemoteChange(query, item, fieldItem) {
      switch (fieldItem.field) {
        case 'productCode':
          // 产品编号
          console.log('产品编号改变：', query, item, fieldItem);
          break;
      
        default:
          break;
      }
    },
    selectRemoteClick(event, item, fieldItem) {
      switch (fieldItem.field) {
        case 'productCode':
          // 产品编号
          console.log('产品编号点击：', event, item, fieldItem);
          if (!item.productCode && item.materialCode) {
            this.getProductCodeHandle(item);
          }
          break;
      
        default:
          break;
      }
    },

  }
}
</script>