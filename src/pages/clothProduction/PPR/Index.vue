<template>
  <div class="container PPR">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">生产订单编号：</span>
            <el-input class="input_single w200 mr10" v-model="productOrderCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">生产物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="productMaterialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">创建日期：</span>
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
            :name="item.value"
            v-loading="tableLoading">
            <!-- <Table
              :tableList="produceList"
              :parentData="parentData"
              :childData="childData"
              :tableFieldsList="allFieldList"
              :tableParentFieldsList="parentFieldsList"
              :tableLoading="tableLoading"
              @editHandle="editHandle"
              @submitHandle="submitHandle"
              @deleteHandle="deleteHandle">
            </Table> -->

            <el-table
              class="table_list"
              ref="multipleTable"
              :data="produceList"
              row-key="id"
              :expand-row-keys="expands"
              @row-click="rowClick"
              border
              fit
              stripe>
            <!-- <el-table
              class="table_list"
              ref="multipleTable"
              v-loading="listLoading"
              :data="produceList"
              element-loading-text="拼命加载中"
              border
              fit
              @expand-change="expandChange"
              @select="selectHandle"
              @select-all="selectAllHandle"> -->
              <!-- <el-table-column type="selection" /> -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="actions_wrap mb20 clearfix">
                    <el-button class="fr" type="primary" @click="childExcelToPRDownload(scope.row)">导出成PR Excel</el-button>
                    <el-button class="fr mr10" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                  </div>
                  <!-- <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    v-loading="childListLoading"
                    :data="cItem.sampleList"
                    element-loading-text="拼命加载中"
                    border
                    fit
                    @select="(selection, row) => { childSelectHandle(selection, row, scope.row, cItem) }"
                    @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }"> -->
                  <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    :data="scope.row.samplePoriList"
                    border
                    fit>
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <el-table
                          class="table_list"
                          :data="scope.row.sampleList"
                          border
                          fit>
                          <el-table-column fixed label="行号">
                            <template slot-scope="{ row }">
                              {{ row.sn }}
                            </template>
                          </el-table-column>
                          <el-table-column fixed label="原材料物料编号">
                            <template slot-scope="{ row }">
                              {{ row.sourceMaterialCode }}
                            </template>
                          </el-table-column>
                          <el-table-column label="原材料类型">
                            <template slot-scope="{ row }">
                              {{ row.confirmType }}
                            </template>
                          </el-table-column>
                          <el-table-column label="原材料确认书编号">
                            <template slot-scope="{ row }">
                              {{ row.confirmNumbers }}
                            </template>
                          </el-table-column>
                          <el-table-column label="原材料消耗数量">
                            <template slot-scope="{ row }">
                              {{ row.sourceQuantity }}
                            </template>
                          </el-table-column>
                          <el-table-column label="供应商">
                            <template slot-scope="{ row }">
                              {{ row.supplierShortName }}
                              <!-- {{ row.supplierName }} -->
                            </template>
                          </el-table-column>
                          <el-table-column label="出库仓位">
                            <template slot-scope="{ row }">
                              {{ row.outVirtualInventoryName }}
                            </template>
                          </el-table-column>
                          <el-table-column label="出库库位">
                            <template slot-scope="{ row }">
                              {{ row.outSubInventoryName }}
                            </template>
                          </el-table-column>
                        </el-table>
                      </template>
                    </el-table-column>
                    <el-table-column label="行号">
                      <template slot-scope="{ row }">
                        {{ row.productionSn }}
                      </template>
                    </el-table-column>
                    <el-table-column label="生产物料编号">
                      <template slot-scope="{ row }">
                        {{ row.productMaterialCode }}
                      </template>
                    </el-table-column>
                    <el-table-column label="生产数量">
                      <template slot-scope="{ row }">
                        {{ row.productPackages }}
                      </template>
                    </el-table-column>
                    <el-table-column label="期望交期">
                      <template slot-scope="{ row }">
                        {{ row.requiredDate }}
                      </template>
                    </el-table-column>
                    <el-table-column label="入库仓位">
                      <template slot-scope="{ row }">
                        {{ row.inVirtualInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="入库库位">
                      <template slot-scope="{ row }">
                        {{ row.inSubInventoryName }}
                      </template>
                    </el-table-column>
                    <el-table-column label="已入库数">
                      <template slot-scope="{ row }">
                        {{ row.inventoryInNum }}
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
              <el-table-column label="生产订单编号">
                <template slot-scope="{ row }">
                  {{ row.productOrderCode }}
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
                    <el-tag slot="reference" class="pointer" :type="row.ppStatus | statusFilter">{{ row.ppStatusName }}</el-tag>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <div v-if="row.ppStatus == 'Draft' || row.ppStatus == 'Rejected'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                    <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                    <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                  </div>
                  <div v-if="row.ppStatus == 'Terminated'">
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑页 -->
    <div class="edit_part" v-loading="editPartLoading" v-else>
      <div class="clearfix mb10">
        <div class="display_ib mr10">
          <span class="tag"><span class="red mr5">*</span>生产类型：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="productProductionType"
            placeholder="请选择"
            @change="productionTypeChange">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in productionTypeList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemValue">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10" v-if="productProductionType === '001' || productProductionType === '003'">
          <span class="tag"><span class="red mr5">*</span>销售单号：</span>
          <el-input class="input_single w200 mr10 mb10" v-model="saleOrderId" placeholder="请输入" @change="saleOrderIdChange"></el-input>
        </div>
        <div class="display_ib mr10" v-if="productProductionType === '001' || productProductionType === '003' && customerName">
          <span class="tag">客户名称：</span>
          <span class="tag">{{customerName}}</span>
          <el-input class="input_single w200 mr10 mb10" v-model="customerId" type="hidden" placeholder="请输入"></el-input>
        </div>
        <a class="link inline_block lh36 fr ml10" type="primary" @click="exportExcelTemplate">坯布纱线转面料导入模板</a>
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
      <div class="edit_wrap">
        <editDoubleTable
          :tableList="editList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          @inputChange="inputChange"
          @selectChange="selectChange"
          @selectVisibleChange="selectVisibleChange"
          @datePickerChange="datePickerChange"
          @numberInputChange="numberInputChange"
          @unitNumberInputChange="unitNumberInputChange"
          @deleteChlidHandle="deleteEditItemHandle"
          @addHandle="addEditItemHandle">
        </editDoubleTable>

        <div class="mt20 fr">
          <el-button @click="cancelEditHandle">取消</el-button>
          <!-- <el-button type="primary" v-preventReClick @click="saveEditHandle">保存</el-button>
          <el-button type="primary" v-preventReClick @click="submitEditHandle">提交审批</el-button> -->
          <el-button type="primary" :disabled="isSaveDisabled" @click="saveEditHandle">保存</el-button>
          <el-button type="primary" :disabled="isSubmitDisabled" @click="submitEditHandle">提交审批</el-button>
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
import {
  approvalProcessInfo
} from "@/api/publicApi.js";
import {
  fabricProduceList,
  fabricProduceDraftList,
  deleteFabricProduce,
  editProduceList,
  submitProduceList,
  deleteProduceRequest,
  deleteProduceRequestItem,
  searchFabricProduce,
  inventoryTypeList,
  subInventoryTypeList,
  productionTypeList,
  searchUsername,
  availableStockData,
  getmaterialCodeUnit
} from '@/api/module/produceApi.js';
import { purchasegetuuid } from "@/api/module/purchaseApi.js";
import { timeFormat, getTimeRange, excelDateFormatToDate } from '@/utils/index.js';
import { statusTypeHandle } from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
export default {
  name: "PPR",
  data() {
    return {
      tableLoading: true,
      isHide: false,
      isShowEdit: false,
      isShowList: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      activeName: 'all',
      ppStatus: '',
      dateVal: '',
      sourceMaterialCode: '',
      productMaterialCode: '',
      productOrderCode: '',
      supplierName: '',
      beginTime: '',
      endTime: '',
      uuid: '',
      saleOrderId: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      produceList: [],
      editList: [],
      outInventoryList: [], //出库仓位列表
      outSubInventoryList: [], //出库库位列表
      inInventoryList: [], //入库仓位列表
      inSubInventoryList: [], //入库库位列表
      productProductionType: '', //生产类型
      productionTypeList: [], //生产类型列表
      customerId: '',
      customerName: '', //客户名
      applicant: '',
      applicantDepartment: '',
      deleteId: '',
      submitParamsData: {},
      deleteDialogVisible: false,
      submitDialogVisible: false,
      expands: [],

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      selectUuidList: [],
      editPartLoading: false,

      allFieldList: [
        {
          name: '原材料物料编号',
          class: 'w6p'
        },
        {
          name: '原材料类型',
          class: 'w6p'
        },
        {
          name: '原材料确认书编号',
          class: 'w6p'
        },
        {
          name: '原材料消耗数量',
          class: 'w6p'
        },
        {
          name: '供应商',
          class: 'w6p'
        },
        {
          name: '期望交期',
          class: 'w6p'
        },
        {
          name: '生产物料编号',
          class: 'w6p'
        },
        {
          name: '生产数量',
          class: 'w6p'
        },
        {
          name: '出库仓位',
          class: 'w6p'
        },
        {
          name: '出库库位',
          class: 'w6p'
        },
        {
          name: '入库仓位',
          class: 'w6p'
        },
        {
          name: '入库库位',
          class: 'w6p'
        },
        {
          name: '已入库数',
          class: 'w6p'
        },
        {
          name: '确认书号',
          class: 'w6p'
        },
        {
          name: '备注',
          class: 'w6p'
        },
        // {
        //   name: '审批意见',
        //   class: 'w6p'
        // }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '创建时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        },
        {
          name: '生产订单编号',
          class: 'w12p'
        },
        {
          name: '审批',
          class: ''
        }
      ],
      addData: {
        requiredDate: '',
        productMaterialCode: '',
        packetNumber: null,
        packetRice: null,
        sampleUuid: '',
        productPackages: null,
        inInventoryList: [],
        inSubInventory: '',
        inSubInventoryName: '',
        inVirtualInventory: '',
        inVirtualInventoryName: '',
        remark: '',
        sampleList: []
      },
      addItemData: {
        uuid: '',
        availableQuantity: 0,
        sourceMaterialCode: '',
        sourceQuantity: 0.00,
        outVirtualInventory: 'B0',
        outSubInventory: 'B001',
        outVirtualInventoryName: '零剪仓',
        outSubInventoryName: '零剪仓工厂库',
        // inVirtualInventoryName: '',
        // inSubInventoryName: '',
        // inVirtualInventory: '',
        // inSubInventory: '',
        confirmNumbers: '',
        auditOption: '',
        purchaseMeasurementUnit: '',
        editModeSet: {}
      },
      submitData: {
        submitType: '',
        uuid: '',
        porciList: []
      },
      subNavList: [
        {
          label: '全部生产订单',
          value: 'all'
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

      // Table组件
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
            name: '生产订单编号',
            field: 'productOrderCode',
            class: 'w12p',
            isShowTit: true
          },
          // {
          //   name: '审批时间',
          //   field: 'createTime',
          //   class: 'w8p',
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
      childData: {
        type: 'double',
        name: 'samplePoriList',
        childName: 'sampleList',
        data: [
          {
            name: '',
            field: 'sourceMaterialCode',
            class: 'w6p'
          },
          {
            name: '',
            field: 'confirmType',
            class: 'w6p'
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w6p'
          },
          {
            name: '',
            field: 'sourceQuantity',
            class: 'w6p',
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w6p',
            isChildField: true
          },
          {
            name: '',
            field: 'productMaterialCode',
            class: 'w6p',
            isChildField: true
          },
          {
            name: '',
            field: 'productPackages',
            class: 'w6p',
            isChildField: true
          },
          {
            name: '',
            field: 'outVirtualInventoryName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'outSubInventoryName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'inVirtualInventoryName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'inSubInventoryName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'inventoryInNum',
            class: 'w6p'
          },
          {
            name: '',
            field: 'confirmNo',
            class: 'w6p'
          },
          {
            name: '',
            field: 'remark',
            class: 'w6p'
          },
          // {
          //   name: '',
          //   field: 'auditOption',
          //   class: 'w6p'
          // }

        ]
      },

      // 编辑组件数据
      editFieldsList: [
        {
          name: '* 生产数量',
          field: 'productPackages',
          field_1: 'packetNumber',
          field_2: 'packetRice',
          field_3: 'productPackages',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w23p',
          width: '400',
          isSingleField: true,
          isRules: true,
          chlidListName: 'sampleList'
        },
        {
          name: '* 期望交期',
          field: 'requiredDate',
          class: 'w8p',
          width: '180',
          isSingleField: true,
          isRules: true
        },
        {
          name: '* 入库仓位',
          field: 'inVirtualInventoryName',
          // field: 'inVirtualInventory',
          class: 'w8p',
          width: '150',
          isSingleField: true,
          isRules: true
        },
        {
          name: '* 入库库位',
          field: 'inSubInventoryName',
          class: 'w8p',
          width: '150',
          isSingleField: true,
          isRules: true
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w8p',
          width: '150',
          isSingleField: true
        },
        {
          name: '* 原材料物料编号',
          field: 'sourceMaterialCode',
          class: 'w8p',
          width: '180',
          isRules: true
        },
        {
          name: '* 原材料消耗数量',
          field: 'sourceQuantity',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        {
          name: '* 出库仓位',
          field: 'outVirtualInventoryName',
          // field: 'outVirtualInventory',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        {
          name: '* 出库库位',
          field: 'outSubInventoryName',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        {
          name: '可用数量',
          field: 'availableQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w5p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '* 原材料确认书编号',
          field: 'confirmNumbers',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        
        // {
        //   name: '审批意见',
        //   field: 'auditOption',
        //   class: 'w4p',
        //   width: '150'
        // }
      ],
      leaderFieldsList: [
        // {
        //   name: '行号',
        //   field: 'sn',
        //   class: '',
        //   width: '50',
        //   isSingleField: true
        // },
        {
          name: '* 生产物料编号',
          field: 'productMaterialCode',
          class: '',
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
          hasChildDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        // sn: true,
        availableQuantity: true,
        auditOption: true
      },
      inputSet: {
        productMaterialCode: true,
        sourceMaterialCode: true,
        confirmNumbers: true,
        remark: true,
        inputData: {
          maxlength: '',
          placeholder: ''
        }
      },
      selectSet: {
        outVirtualInventoryName: {
          selectListName: 'outInventoryList',
          value: 'index',
          label: 'name'
        },
        outSubInventoryName: {
          selectListName: 'outSubInventoryList',
          value: 'subInventory',
          label: 'subInventoryName'
        },
        inVirtualInventoryName: {
          selectListName: 'inInventoryList',
          value: 'index',
          label: 'name'
        },
        inSubInventoryName: {
          selectListName: 'inSubInventoryList',
          value: 'subInventory',
          label: 'subInventoryName'
        },
        // selectData: {
        //   selectListName: '',
        //   value: '',
        //   label: ''
        // }
      },
      numberInputSet: {
        sourceQuantity: true
      },
      datePickerSet: {
        requiredDate: true
      },
      unitSet: {
        packetNumber: true
      },

      childHeaderList: ['行号', '生产物料编号', '生产数量包数', '生产数量规格', '生产数量', '期望交期', '入库仓位', '入库库位', '已入库数', '备注', '原材料物料编号', '原材料类型', '原材料确认书编号', '原材料消耗数量', '供应商', '出库仓位', '出库库位'],
      childFieldsList: ['sn', 'productMaterialCode', 'packetNumber', 'packetRice', 'productPackages', 'requiredDate', 'inVirtualInventoryName', 'inSubInventoryName', 'inventoryInNum', 'remark', 'sourceMaterialCode', 'confirmType', 'confirmNumbers', 'sourceQuantity', 'supplierShortName', 'outVirtualInventoryName', 'outSubInventoryName'],

      prChildHeaderList: ['行号', 'SO编号', '物料编号', '产品编号', '供应商', '期望交期', '请求数量包数', '请求数量规格', '请求数量', '建议采购数量（按周）', '库位', '特殊要求', '备注'],
      prChildFieldsList: ['productionSn', 'saleOrderId', 'productMaterialCode', 'placeholder', 'supplierShortName', 'requiredDate', 'packetNumber', 'packetRice', 'productPackages', 'placeholder', 'inSubInventoryName', 'confirmNumbersSet', 'remark'],
      
    };
  },
  components: {
    UploadExcelComponent,
    Table,
    editDoubleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    // this.getFabricProduceList();
    this.getInventoryList();
    this.addData.sampleList.push(this.addItemData);
    this.getProductionTypeList();
    this.fun_date();
    this.checkDefault();//检查出库库位是否存在默认值
  },
  activated() {

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
  watch: {},
  computed: {},
  methods: {
    exportExcelTemplate() {
      // 导入Excel模板
      const headerList = ['生产物料编号', '生产数量包数', '生产数量规格', '生产数量', '期望交期', '入库仓位', '入库库位', '备注', '原材料物料编号', '原材料消耗数量', '出库仓位', '出库库位', '原材料确认书编号'];
      const data = [['VBCTEST', '2', '80', '160', '2020-12-04', '职业装仓', 'A库(批发库)', 'TEST', 'pbpb', '10', '零剪仓', '零剪仓工厂库', '123']];
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headerList, //Header Required
          data, //Specific data Required
          filename: '坯布纱线转面料导入模板', //Optional
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
      if (!this.productProductionType) {
        this.editPartLoading = false;
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (results && results.length) {
        this.editPartLoading = true;
        this.editList = [];
        let importList = [];
        let baseObj = {};
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let baseList = [];
          let baseKey = '';
          let addDataCopy = JSON.parse(JSON.stringify(this.addData));
          let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
          await purchasegetuuid().then(res => {
            if (res.code === '0') {
              // addDataCopy.uuid = res.data;
              addDataCopy.sampleUuid = res.data;
            }
          });
          addDataCopy.inInventoryList = this.inInventoryList;
          this.updateEditModeSet('add', addDataCopy);
          addItemDataCopy.outInventoryList = this.outInventoryList;
          await purchasegetuuid().then(res => {
            if (res.code === '0') {
              addItemDataCopy.uuid = res.data;
            }
          });
          this.updateEditModeSet('add', addItemDataCopy);
          addDataCopy.sampleList = [];

          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '生产物料编号') {
              addDataCopy.productMaterialCode = item[key];
              addItemDataCopy.productMaterialCode = item[key];
              baseList.push(addDataCopy.productMaterialCode);
            } else if (key === '生产数量包数') {
              addDataCopy.packetNumber = item[key];
              addItemDataCopy.packetNumber = item[key];
              baseList.push(addDataCopy.packetNumber);
            } else if (key === '生产数量规格') {
              addDataCopy.packetRice = item[key];
              addItemDataCopy.packetRice = item[key];
              baseList.push(addDataCopy.packetRice);
            } else if (key === '生产数量') {
              addDataCopy.productPackages = item[key];
              addItemDataCopy.productPackages = item[key];
              baseList.push(addDataCopy.productPackages);
            } else if (key === '期望交期') {
              addDataCopy.requiredDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
              addItemDataCopy.requiredDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
              baseList.push(addDataCopy.requiredDate);
            } else if (key === '入库仓位') {
              let inInventoryData = this.inInventoryList.find(x => {
                return x.name === item[key];
              });
              addDataCopy.inVirtualInventoryName = item[key];
              addItemDataCopy.inVirtualInventoryName = item[key];
              addDataCopy.inVirtualInventory = inInventoryData ? inInventoryData.index : '';
              addItemDataCopy.inVirtualInventory = inInventoryData ? inInventoryData.index : '';
              baseList.push(addDataCopy.inVirtualInventoryName);
            } else if (key === '入库库位') {
              addDataCopy.inSubInventoryName = item[key];
              addItemDataCopy.inSubInventoryName = item[key];
              baseList.push(addDataCopy.inSubInventoryName);
            } else if (key === '备注') {
              addDataCopy.remark = item[key];
              addItemDataCopy.remark = item[key];
              baseList.push(addDataCopy.remark);
            } else if (key === '原材料物料编号') {
              addItemDataCopy.sourceMaterialCode = item[key];
            } else if (key === '原材料消耗数量') {
              addItemDataCopy.sourceQuantity = item[key];
            } else if (key === '出库仓位') {
              let outSubInventoryList = [];
              let outInventoryData = this.outInventoryList.find(x => {
                return x.name === item[key];
              });
              addItemDataCopy.outVirtualInventoryName = item[key];
              addItemDataCopy.outVirtualInventory = outInventoryData ? outInventoryData.index : '';
            } else if (key === '出库库位') {
              addItemDataCopy.outSubInventoryName = item[key];
            } else if (key === '原材料确认书编号') {
              addItemDataCopy.confirmNumbers = item[key];
            }
          });

          baseKey = baseList.join('');
          if (baseObj[baseKey]) {
            baseObj[baseKey].sampleUuid = baseObj[baseKey].sampleUuid;
            importList.forEach(x => {
              if (x.sampleUuid === baseObj[baseKey].sampleUuid) {
                x.sampleList.push(addItemDataCopy);
              }
            });
            // addDataCopy.sampleList.push(addItemDataCopy);
          } else {
            baseObj[baseKey] = {};
            baseObj[baseKey].sampleUuid = addDataCopy.sampleUuid;
            addDataCopy.sampleList.push(addItemDataCopy);
            importList.push(addDataCopy);
          }

          // addDataCopy.sampleList.push(addItemDataCopy);
          // importList.push(addDataCopy);
        }
        
        for (let i = 0; i < importList.length; i++) {
          let item = importList[i];
          for (let j = 0; j < item.sampleList.length; j++) {
            let cItem = item.sampleList[j];
            let outList = [];  // 库位列表数据
            await subInventoryTypeList(cItem.outVirtualInventory).then(res => {
              console.log('导入库位列表数据：', res);
              if (res.code === '0') {
                cItem.outSubInventoryList = res.data;
                if (cItem.outVirtualInventory == 'C0') {
                  // 职业装仓
                  for (var m = 0; m < res.data.length; m++) {
                    let osiData = res.data[m];
                    if (osiData.subInventoryName.includes('职业装') && osiData.subInventoryName.includes('工厂库')) {
                      outList.push(osiData);
                    }
                  }
                } else if (cItem.outVirtualInventory == 'B0') {
                  // 零剪仓
                  for (var n = 0; n < res.data.length; n++) {
                    let osiData = res.data[n];
                    if (osiData.subInventoryName.includes('工厂库')) {
                      outList.push(osiData);
                    }
                  }
                } else {
                  outList = res.data;
                }
              }
            });
            cItem.outSubInventoryList = outList;
            let outSubInventoryData = cItem.outSubInventoryList.find(x => {
              return x.subInventoryName === cItem.outSubInventoryName;
            });
            cItem.outSubInventory = outSubInventoryData ? outSubInventoryData.subInventory : '';
            // this.availableStockDataHandle(cItem);
            // 可用库存
            if (!cItem.outVirtualInventory || !cItem.outSubInventory || !cItem.sourceMaterialCode) {
              cItem.availableQuantity = 0;
              return false;
            }
            let params = {
              inventory: cItem.outVirtualInventory,
              subInventory: cItem.outSubInventory,
              materialCode: cItem.sourceMaterialCode
            };
            await availableStockData(params).then(res => {
              console.log('导入可用库存：', res);
              if (res.code === '0') {
                cItem.availableQuantity = Number(res.data) < 0 ? '' : res.data;
                // this.$set(importList[i].sampleList, j, cItem);
              }
            });
            this.$forceUpdate();
          }
        }

        this.editList = importList;
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },

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
    async checkDefault(){
      if(await this.getCheckoutSubInventory()!=true){ //检查出库库位是否存在默认值
        this.addItemData.outSubInventory='';
        this.addItemData.outSubInventoryName='';
      }
    },
    getCheckoutSubInventory(){
      return subInventoryTypeList('B0').then(res => {
        if (res.code === '0') {
          // console.log(res.data)
          this.outSubInventoryList=res.data;
          if(this.outSubInventoryList.findIndex(target=>target.subInventory==="B001")==-1){
              return false;
          }else {
             return true;
          }
        }
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        let newList = [];
        const list = item.samplePoriList;
        list.forEach(x => {
          x.sampleList.forEach(y => {
            newList.push(y);
          });
        });
        const data = this.formatJson(fieldList, newList);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.productOrderCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelToPRDownload(item) {
      let headerList = this.prChildHeaderList;
      let fieldList = this.prChildFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        let newList = [];
        const list = item.samplePoriList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: 'PR.' + item.productOrderCode,
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
      this.dateVal=getTimeRange(-14);
      this.searchHandle();
    },
    selectAllHandle(selection) {
      // 父项全选事件
      console.log('触发全选事件：', selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
          for (let j = 0; j < item.samplePoriList.length; j++) {
            let cItem = item.samplePoriList[j];
            for (let m = 0; m < cItem.sampleList.length; m++) {
              let tItem = cItem.sampleList[m];
              this.childMultipleSelection.push(tItem);
              this.$nextTick(() => {
                if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                  this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(tItem, true);
                }
              });
            }
          }
        }
      } else {
        for (let i = 0; i < this.produceList.length; i++) {
          let item = this.produceList[i];
          for (let j = 0; j < item.samplePoriList.length; j++) {
            let cItem = item.samplePoriList[j];
            for (let m = 0; m < cItem.sampleList.length; m++) {
              let tItem = cItem.sampleList[m];
              this.$nextTick(() => {
                if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                  this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(tItem, false);
                }
              });
            }
          }
        }
      }
    },
    expandChange(row, rowList) {
      console.log('树形展开项：', row, rowList);
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.samplePoriList.length; i++) {
          let cItem = row.samplePoriList[i];
          for (let j = 0; j < cItem.sampleList.length; j++) {
            let tItem = cItem.sampleList[j];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + row.id] && this.$refs['childMultipleTable_' + row.id].length) {
                this.$refs['childMultipleTable_' + row.id][0].toggleRowSelection(tItem, true);
              }
            });
          }
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
          for (let i = 0; i < _row.samplePoriList.length; i++) {
            let cItem = _row.samplePoriList[i];
            for (let j = 0; j < cItem.sampleList.length; j++) {
              let tItem = cItem.sampleList[j];
              this.$nextTick(() => {
                if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                  this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(tItem, true);
                }
              });
              this.childMultipleSelection.push(tItem);
            }
          }
        } else {
          for (let i = 0; i < _row.samplePoriList.length; i++) {
            let cItem = _row.samplePoriList[i];
            for (let j = 0; j < cItem.sampleList.length; j++) {
              let tItem = cItem.sampleList[j];
              this.$nextTick(() => {
                if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                  this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(tItem, false);
                }
              });
              this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
                return cmsItem.uuid !== tItem.uuid;
              });
            }
          }
        }
      } else {
        if (this.childMultipleSelection) {
          this.childMultipleSelection = [];
          this.$refs['childMultipleTable_' + _row.id][0].clearSelection();
        }
      }
    },
    async childSelectHandle(selection, row, parentRow, cItem) {
      // 选择子项
      console.log('选择子项：', selection, row, parentRow);
      await this.$nextTick();
      if (selection.length === cItem.sampleList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
        });
      }
      this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
      console.log('子项全选操作：', selection, parentRow);
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
          this.$set(this.produceList, index, item);
          this.$forceUpdate();
        }
      });
    },
    saleOrderIdChange(val) {
      // 销售单号改变
      console.log('销售单号改变：', val);
      let data = {
        saleOrderId: val
      };
      searchUsername(data).then(res => {
        console.log('销售单号：', res);
        if (res.code === '0' && res.data) {
          this.customerName = res.data.customerName;
          this.customerId = res.data.customerId;
        } else {
          this.customerName = '';
          this.customerId = '';
        }
      });
    },
    deleteHandle(index, item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteFabricProduce(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          if (this.ppStatus === 'Draft') {
            this.getFabricProduceDraftList();
          } else {
            this.getFabricProduceList();
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    async editHandle(index, item) {
      // 编辑
      console.log('编辑项：', item);
      this.isShowEdit = true;
      let ifdefault=await this.getCheckoutSubInventory();
      this.productProductionType = item.productProductionType;
      this.saleOrderId = item.saleOrderId;
      this.customerName = item.customerName;
      this.customerId = item.customerId;
      this.uuid = item.uuid;
      item.samplePoriList.forEach(spItem => {
        spItem.inInventoryList = this.inInventoryList;
        spItem.sampleList.forEach(sItem => {
          this.availableStockDataHandle(sItem);
          sItem.outInventoryList = this.outInventoryList;
          if(ifdefault!=true){
            sItem.outSubInventory='';
            sItem.outSubInventoryName='';
          }
        });
      });
      this.editList = item.samplePoriList;
      this.$forceUpdate();
      // await searchFabricProduce(item.id).then(res => {
      //   if (res.code === '0' && res.data) {
      //     let list = res.data.samplePoriList;
      //     this.uuid = res.data.uuid;
      //     for (var i = 0; i < list.length; i++) {
      //       this.updateEditModeSet('edit', list[i]);
      //       for (var j = 0; j < list[i].sampleList.length; j++) {
      //         let data = list[i].sampleList[j];
      //         // let stockData = {
      //         //   inventory: data.outVirtualInventory,
      //         //   subInventory: data.outSubInventory,
      //         //   materialCode: data.sourceMaterialCode
      //         // };
      //         data.outInventoryList = this.outInventoryList;
      //         data.inInventoryList = this.inInventoryList;
      //         this.availableStockDataHandle(data);
      //         // availableStockData(stockData).then(res => {
      //         //   // console.log('查询可用库存接口更换：', res);
      //         //   if (res.code === '0') {
      //         //     data.availableQuantity = Number(res.data) < 0 ? '' : res.data;
      //         //   }
      //         // });
      //         this.updateEditModeSet('edit', data);
      //       }
      //     }
      //     console.log('编辑项数据：', list);
      //     this.editList = list;
      //     this.$forceUpdate();
      //   }
      // });
    },
    submitHandle(index, item) {
      // 提交审批
      console.log(item);
      this.submitParamsData = {
        uuid: item.uuid,
        ppStatus: 'Approving',
        submitType: '',
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      if (this.ppStatus == 'Rejected') {
        // 驳回提交
        this.submitParamsData.submitType = '4';
      } else {
        this.submitParamsData.submitType = '2';
      }
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      editProduceList(this.submitParamsData).then(res => {
        console.log('提交数据：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.ppStatus = 'Approving';
          this.activeName = 'Approving';
          this.getFabricProduceList();
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
      });
    },
    dateValChange() {

    },
    searchHandle() {
      // 搜索
      this.produceList = [];
      this.currentPage = 1;
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      if (this.ppStatus === 'Draft') {
        this.getFabricProduceDraftList();
      } else {
        this.getFabricProduceList();
      }
    },
    async addHandle() {
      // 列表页添加
      this.isShowEdit = true;
      this.uuid = '';
      this.ppStatus = 'Draft';
      this.productProductionType = '';
      this.saleOrderId = '';
      this.customerName = '';
      this.customerId = '';
      let list = [];
      let addDataCopy = JSON.parse(JSON.stringify(this.addData));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      await purchasegetuuid().then(res => {
        if (res.code === '0') {
          // addDataCopy.uuid = res.data;
          addDataCopy.sampleUuid = res.data;
        }
      });
      addDataCopy.inInventoryList = this.inInventoryList;
      this.updateEditModeSet('add', addDataCopy);
      addDataCopy.sampleList.push(addItemDataCopy);
      addDataCopy.sampleList.forEach(item => {
        this.updateEditModeSet('add', item);
        item.outInventoryList = this.outInventoryList;
        // item.inInventoryList = this.inInventoryList;
        purchasegetuuid().then(res => {
          if (res.code === '0') {
            item.uuid = res.data;
          }
        });
      });
      list.push(addDataCopy);
      this.editList = list;
      // this.$forceUpdate();
    },
    switchTabHandle(tab) {
      // tab切换
      this.tableLoading = true;
      this.currentPage = 1;
      // NEW TABLE
      this.multipleSelection = [];
      this.childMultipleSelection = [];
      this.selectUuidList = [];  // 勾选项清空
      this.$refs.multipleTable[0].clearSelection();
      this.produceList = [];
      switch (tab.name) {
        case 'all':
          // 全部
          this.ppStatus = '';
          this.getFabricProduceList();
          break;
        case 'Draft':
          // 草稿
          this.ppStatus = 'Draft';
          this.getFabricProduceDraftList();
          break;
        case 'Approving':
          // 审批中
          this.ppStatus = 'Approving';
          this.getFabricProduceList();
          break;
        case 'Approved':
          // 已通过
          this.ppStatus = 'Approved';
          this.getFabricProduceList();
          break;
        case 'Rejected':
          // 已驳回
          this.ppStatus = 'Rejected';
          this.getFabricProduceList();
          break;
        case 'Terminated':
          // 已终止
          this.ppStatus = 'Terminated';
          this.getFabricProduceList();
          break;
        default:
          this.ppStatus = '';
          this.getFabricProduceList();
          break;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.ppStatus === 'Draft') {
        this.getFabricProduceDraftList();
      } else {
        this.getFabricProduceList();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.ppStatus === 'Draft') {
        this.getFabricProduceDraftList();
      } else {
        this.getFabricProduceList();
      }
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    async addEditHandle() {
      // 原材料添加
      console.log('大号添加按钮：', this.editList);
      if (this.editList.length >= 10) {
        this.$message({
          type: 'error',
          message: '最多添加10条数据！'
        });
        return false;
      }
      let addDataCopy = JSON.parse(JSON.stringify(this.addData));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      await purchasegetuuid().then(res => {
        if (res.code === '0') {
          // addDataCopy.uuid = res.data;
          addDataCopy.sampleUuid = res.data;
        }
      });
      addDataCopy.inInventoryList = this.inInventoryList;
      this.updateEditModeSet('add', addDataCopy);
      // await purchasegetuuid().then(res => {
      //   if (res.code === '0') {
      //     addItemDataCopy.uuid = res.data;
      //   }
      // });
      // addItemDataCopy.outInventoryList = this.outInventoryList;
      // this.updateEditModeSet('add', addItemDataCopy);
      addDataCopy.sampleList.push(addItemDataCopy);
      addDataCopy.sampleList.forEach(item => {
        item.outInventoryList = this.outInventoryList;
        // item.inInventoryList = this.inInventoryList;
        this.updateEditModeSet('add', item);
        if (!item.uuid) {
          purchasegetuuid().then(res => {
            if (res.code === '0') {
              item.uuid = res.data;
            }
          });
        }
      });
      this.editList.push(addDataCopy);
    },
    deleteAddHandle(index, item) {
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      console.log(editListCopy);
      deleteProduceRequest(item.sampleUuid).then(res => {
        if (res.code === '0') {
          editListCopy.splice(index, 1);
          this.editList = editListCopy;
          this.$message({
            type: 'success',
            message: '删除成功！'
          });
        }
      });
    },
    async addEditItemHandle(index, data) {
      // 添加样本子数据
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      addItemDataCopy.outInventoryList = this.outInventoryList;
      addItemDataCopy.inInventoryList = this.inInventoryList;
      this.updateEditModeSet('add', editListCopy[index]);
      this.updateEditModeSet('add', addItemDataCopy);
      await purchasegetuuid().then(res => {
        if (res.code === '0') {
          addItemDataCopy.uuid = res.data;
        }
      });
      editListCopy[index].sampleList.push(addItemDataCopy);
      this.editList = editListCopy;
    },
    deleteEditItemHandle(pi, ci, data) {
      // console.log('删除子项：', pi, ci, data);
      if (ci === 0 && this.editList[pi].sampleList.length <= 1) {
        let editListCopy = JSON.parse(JSON.stringify(this.editList));
        editListCopy.splice(pi, 1);
        this.editList = editListCopy;
        this.$forceUpdate();
        // this.$message({
        //   type: 'success',
        //   message: '删除成功！'
        // });
      } else {
        let editListCopy = JSON.parse(JSON.stringify(this.editList));
        editListCopy[pi].sampleList.splice(ci, 1);
        this.editList = editListCopy;
        this.$forceUpdate();
        // this.$message({
        //   type: 'success',
        //   message: '删除成功！'
        // });
      }
    },
    cancelEditHandle() {
      this.isShowEdit = false;
    },
    productionTypeChange(val) {
      // console.log('生产类型切换：', val);
      if (val === '002') {
        // 备货类型
        this.saleOrderId = '';
        this.customerName = '';
        this.customerId = '';
      }
    },
    async saveEditHandle() {
      // 保存编辑数据
      if (!this.editList.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.productProductionType) {
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (this.productProductionType === '001' || this.productProductionType === '003') {
        if (!this.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售单号！'
          });
          return false;
        }
      }
      // 校验
      for (var i = 0; i < this.editList.length; i++) {
        for (var j = 0; j < this.editList[i].sampleList.length; j++) {
          let data = this.editList[i].sampleList[j];
          if (!this.editList[i].productMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入生产物料编号！'
            });
            return false;
          }
          if (!this.editList[i].packetNumber || !this.editList[i].packetRice) {
            this.$message({
              type: 'error',
              message: '请输入生产数量！'
            });
            return false;
          }
          this.editList[i].productPackages = parseFloat(this.editList[i].packetNumber)*parseFloat(this.editList[i].packetRice);
          if (this.editList[i].productPackages.toString().indexOf('.') !== -1) {
            let arr = this.editList[i].productPackages.toString().split('.');
            if (arr[0].length > 8) {
              this.$message({
                message: '生产数量米数仅支持整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (arr[1].length > 2) {
              this.$message({
                message: '生产数量米数仅支持小数位2位，请重新输入！',
                type: 'error'
              });
              return false;
            }
          } else if (this.editList[i].productPackages.toString().length > 8) {
            this.$message({
              message: '生产数量米数仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (!this.editList[i].requiredDate) {
            this.$message({
              type: 'error',
              message: '请选择期望交期！'
            });
            return false;
          }
          if (!this.editList[i].inVirtualInventory) {
            this.$message({
              type: 'error',
              message: '请选择入库仓位！'
            });
            return false;
          }
          if (!this.editList[i].inSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请选择入库库位！'
            });
            return false;
          }
          if (!data.sourceMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入原材料物料编号！'
            });
            return false;
          }
          if (!data.sourceQuantity) {
            this.$message({
              type: 'error',
              message: '请输入原材料消耗数量！'
            });
            return false;
          }
          if (data.sourceQuantity.toString().indexOf('.') !== -1) {
            let arr = data.sourceQuantity.toString().split('.');
            if (arr[0].length > 8) {
              this.$message({
                message: '原材料消耗数量仅支持整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (arr[1].length > 2) {
              this.$message({
                message: '原材料消耗数量仅支持小数位2位，请重新输入！',
                type: 'error'
              });
              return false;
            }
          } else if (data.sourceQuantity.toString().length > 8) {
            this.$message({
              message: '原材料消耗数量仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (!data.outVirtualInventory) {
            this.$message({
              type: 'error',
              message: '请选择出库仓位！'
            });
            return false;
          }
          if (!data.outSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请选择出库库位！'
            });
            return false;
          }
          if (parseFloat(data.sourceQuantity) > parseFloat(data.availableQuantity)) {
            this.$message({
              type: 'error',
              message: '原材料消耗数量不能大于可用数量！'
            });
            return false;
          }
          if (!data.confirmNumbers) {
            this.$message({
              type: 'error',
              message: '请输入原材料确认书编号！'
            });
            return false;
          }
        }
      }
      if (!this.uuid) {
        await purchasegetuuid().then(res => {
          console.log(res);
          if (res.code === '0') {
            this.submitData.uuid = res.data;
          }
        });
      } else {
        this.submitData.uuid = this.uuid;
      }
      if (this.ppStatus == 'Rejected') {
        // 驳回保存
        this.submitData.submitType = '3';
      } else {
        this.submitData.submitType = '1';
      }
      this.submitData.porciList = this.editList;
      this.submitData.productProductionType = this.productProductionType;
      this.submitData.saleOrderId = this.saleOrderId;
      this.submitData.customerName = this.customerName;
      this.submitData.customerId = this.customerId;
      this.submitData.applicant = this.$store.state.userName;
      this.submitData.applicantName = this.$store.state.realName;
      this.submitData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.submitData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSaveDisabled = true;
      submitProduceList(this.submitData).then(res => {
        console.log('保存数据：', res);
        if (res.code === '0') {
          if (this.ppStatus === 'Draft') {
            this.activeName = 'Draft';
            this.getFabricProduceDraftList();
          } else {
            this.getFabricProduceList();
          }
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
      if (!this.editList.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.productProductionType) {
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (this.productProductionType === '001' || this.productProductionType === '003') {
        if (!this.saleOrderId) {
          this.$message({
            type: 'error',
            message: '请输入销售单号！'
          });
          return false;
        }
      }
      // 校验
      for (var i = 0; i < this.editList.length; i++) {
        for (var j = 0; j < this.editList[i].sampleList.length; j++) {
          let data = this.editList[i].sampleList[j];
          if (!this.editList[i].productMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入生产物料编号！'
            });
            return false;
          }
          if (!this.editList[i].packetNumber || !this.editList[i].packetRice) {
            this.$message({
              type: 'error',
              message: '请输入生产数量！'
            });
            return false;
          }
          this.editList[i].productPackages = parseFloat(this.editList[i].packetNumber)*parseFloat(this.editList[i].packetRice);
          if (this.editList[i].productPackages.toString().indexOf('.') !== -1) {
            let arr = this.editList[i].productPackages.toString().split('.');
            if (arr[0].length > 8) {
              this.$message({
                message: '生产数量米数仅支持整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (arr[1].length > 2) {
              this.$message({
                message: '生产数量米数仅支持小数位2位，请重新输入！',
                type: 'error'
              });
              return false;
            }
          } else if (this.editList[i].productPackages.toString().length > 8) {
            this.$message({
              message: '生产数量米数仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (!this.editList[i].requiredDate) {
            this.$message({
              type: 'error',
              message: '请选择期望交期！'
            });
            return false;
          }
          if (!this.editList[i].inVirtualInventory) {
            this.$message({
              type: 'error',
              message: '请选择入库仓位！'
            });
            return false;
          }
          if (!this.editList[i].inSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请选择入库库位！'
            });
            return false;
          }
          if (!data.sourceMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入原材料物料编号！'
            });
            return false;
          }
          if (!data.sourceQuantity) {
            this.$message({
              type: 'error',
              message: '请输入原材料消耗数量！'
            });
            return false;
          }
          if (data.sourceQuantity.toString().indexOf('.') !== -1) {
            let arr = data.sourceQuantity.toString().split('.');
            if (arr[0].length > 8) {
              this.$message({
                message: '原材料消耗数量仅支持整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (arr[1].length > 2) {
              this.$message({
                message: '原材料消耗数量仅支持小数位2位，请重新输入！',
                type: 'error'
              });
              return false;
            }
          } else if (data.sourceQuantity.toString().length > 8) {
            this.$message({
              message: '原材料消耗数量仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (!data.outVirtualInventory) {
            this.$message({
              type: 'error',
              message: '请选择出库仓位！'
            });
            return false;
          }
          if (!data.outSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请选择出库库位！'
            });
            return false;
          }
          if (parseFloat(data.sourceQuantity) > parseFloat(data.availableQuantity)) {
            this.$message({
              type: 'error',
              message: '原材料消耗数量不能大于可用数量！'
            });
            return false;
          }
          if (!data.confirmNumbers) {
            this.$message({
              type: 'error',
              message: '请输入原材料确认书编号！'
            });
            return false;
          }
        }
      }
      if (!this.uuid) {
        await purchasegetuuid().then(res => {
          console.log(res);
          if (res.code === '0') {
            this.submitData.uuid = res.data;
          }
        });
      } else {
        this.submitData.uuid = this.uuid;
      }
      if (this.ppStatus == 'Rejected') {
        // 驳回提交
        this.submitData.submitType = '4';
      } else {
        this.submitData.submitType = '2';
      }
      this.submitData.porciList = this.editList;
      this.submitData.productProductionType = this.productProductionType;
      this.submitData.saleOrderId = this.saleOrderId;
      this.submitData.customerName = this.customerName;
      this.submitData.customerId = this.customerId;
      this.submitData.applicant = this.$store.state.userName;
      this.submitData.applicantName = this.$store.state.realName;
      this.submitData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.submitData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      submitProduceList(this.submitData).then(res => {
        console.log('提交数据：', res);
        if (res.code === '0') {
          // if (this.ppStatus === 'Draft') {
          //   this.getFabricProduceDraftList();
          // } else {
          this.ppStatus = 'Approving';
          this.getFabricProduceList();
          // }
          this.$message({
            type: 'success',
            message: '提交成功！'
          });
          this.isShowEdit = false;
          this.activeName = 'Approving';
        }
        this.isSubmitDisabled = false;
      });
    },
    getFabricProduceList() {
      // 面料生产申请列表
      let data = {
        ppStatus: this.ppStatus,
        productMaterialCode: this.productMaterialCode,
        productOrderCode: this.productOrderCode,
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      fabricProduceList(this.currentPage, this.pageSize, data).then(res => {
        console.log('成品生产列表：', res);
        if (res.code === '0') {
          this.produceList = res.data.records;
          this.total = res.data.total;
          let list = this.produceList;
          for (var i = 0; i < list.length; i++) {
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].status = list[i].ppStatus;
            list[i].ppStatusName = statusTypeHandle(list[i].ppStatus);
            for (var j = 0; j < list[i].samplePoriList.length; j++) {
              let data = list[i].samplePoriList[j];
              let confirmNumbersList = [];
              // data.availableQuantity = 0;
              data.productOrderCode = list[i].productOrderCode;
              data.saleOrderId = list[i].saleOrderId;
              data.supplierShortName = data.sampleList[0].supplierShortName;
              this.updateEditModeSet('edit', data);
              for (var m = 0; m < data.sampleList.length; m++) {
                let cData = data.sampleList[m];
                confirmNumbersList.push(cData.confirmNumbers);
                cData.outInventoryList = this.outInventoryList;
                cData.inInventoryList = this.inInventoryList;
                cData.placeholder = '';
                cData.saleOrderId = list[i].saleOrderId;
                this.availableStockDataHandle(cData);
                this.updateEditModeSet('edit', cData);
              }
              data.confirmNumbersSet = confirmNumbersList.join(',');
            }
            // switch (list[i].ppStatus) {
            //   case 'Draft':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Rejected':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Terminated':
            //     list[i].actions = {
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     list[i].actions = {};
            //     break;
            // }
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
    getFabricProduceDraftList() {
      // 面料生产申请草稿列表
      let data = {
        ppStatus: this.ppStatus,
        productMaterialCode: this.productMaterialCode,
        productOrderCode: this.productOrderCode,
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      fabricProduceDraftList(this.currentPage, this.pageSize, data).then(res => {
        console.log('成品生产草稿列表：', res);
        if (res.code === '0') {
          this.produceList = res.data.records;
          this.total = res.data.total;
          let list = this.produceList;
          for (var i = 0; i < list.length; i++) {
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].status = list[i].ppStatus;
            list[i].ppStatusName = statusTypeHandle(list[i].ppStatus);
            // switch (list[i].ppStatus) {
            //   case 'Draft':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Rejected':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasSubmit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Terminated':
            //     list[i].actions = {
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     list[i].actions = {};
            //     break;
            // }
            for (var j = 0; j < list[i].samplePoriList.length; j++) {
              let data = list[i].samplePoriList[j];
              let confirmNumbersList = [];
              // data.availableQuantity = 0;
              data.productOrderCode = list[i].productOrderCode;
              data.saleOrderId = list[i].saleOrderId;
              data.supplierShortName = data.sampleList[0].supplierShortName;
              this.updateEditModeSet('edit', data);
              for (var m = 0; m < data.sampleList.length; m++) {
                let cData = data.sampleList[m];
                confirmNumbersList.push(cData.confirmNumbers);
                cData.outInventoryList = this.outInventoryList;
                cData.inInventoryList = this.inInventoryList;
                cData.placeholder = '';
                cData.saleOrderId = list[i].saleOrderId;
                this.availableStockDataHandle(cData);
                this.updateEditModeSet('edit', cData);
              }
              data.confirmNumbersSet = confirmNumbersList.join(',');
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
    async availableStockDataHandle(item) {
      // 可用库存
      if (!item.outVirtualInventory || !item.outSubInventory || !item.sourceMaterialCode) {
        item.availableQuantity = '0';
        return false;
      }
      let params = {
        inventory: item.outVirtualInventory,
        subInventory: item.outSubInventory,
        materialCode: item.sourceMaterialCode
      };
      await availableStockData(params).then(res => {
        if (res.code === '0') {
          item.availableQuantity = Number(res.data) < 0 ? '' : res.data;
          this.$forceUpdate();
        }
      });
    },
    getInventoryList() {
      // 仓位
      inventoryTypeList().then(res => {
        console.log('仓位列表：', res);
        if (res.code === '0') {
          this.outInventoryList = res.data;
          this.inInventoryList = res.data;
        }
      });
    },
    getSubInventoryList(id) {
      // 库位
      subInventoryTypeList(id).then(res => {
        // console.log('库位列表：', res);
        if (res.code === '0') {
          return res.data;
          this.$forceUpdate();
        }
      });
    },
    getProductionTypeList() {
      let data = {
        dictIndex: 'ProductionType'
      };
      productionTypeList('', '', data).then(res => {
        // console.log('生产类型：', res);
        if (res.code === '0') {
          this.productionTypeList = res.data.records;
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
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.datePickerSet = datePickerSet;
      editModeSet.unitSet = unitSet;
      data.editModeSet = editModeSet;
    },
    inputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'sourceMaterialCode':
          console.log('原材料物料编号值改变：', val, item, fieldItem);
          this.availableStockDataHandle(item);
          break;
      
        default:
          break;
      }
    },
    async selectChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      switch (fieldItem.field) {
        case 'outVirtualInventoryName':
          // 出库仓位
          console.log('出库仓位值改变：', val, item, fieldItem);
          if (!val) {
            item.outVirtualInventoryName = '';
            item.outVirtualInventory = '';
            item.outSubInventoryName = '';
            item.outSubInventory = '';
            return false;
          }
          item.outSubInventoryList = [];
          
          let outList = [];  // 库位列表数据
          await subInventoryTypeList(val).then(res => {
            if (res.code === '0') {
              if (val == 'C0') {
                // 职业装仓
                for (var i = 0; i < res.data.length; i++) {
                  let osiData = res.data[i];
                  if (osiData.subInventoryName.includes('职业装') && osiData.subInventoryName.includes('工厂库')) {
                    outList.push(osiData);
                  }
                }
              } else if (val == 'B0') {
                // 零剪仓
                for (var i = 0; i < res.data.length; i++) {
                  let osiData = res.data[i];
                  if (osiData.subInventoryName.includes('工厂库')) {
                    outList.push(osiData);
                  }
                }
              } else {
                outList = res.data;
              }
            }
          });
          for (var i = 0; i < editListCopy.length; i++) {
            for (var j = 0; j < editListCopy[i].sampleList.length; j++) {
              let data = editListCopy[i].sampleList[j];
              if (data.uuid == item.uuid) {
                let outSelected = this.outInventoryList.find(i => {
                  return i.index == val;
                });
                data.outVirtualInventory = outSelected ? outSelected.index : '';
                data.outVirtualInventoryName = outSelected ? outSelected.name : '';
                data.outSubInventoryName = '';
                data.outSubInventoryList = outList;
              }
            }
          }
          this.editList = editListCopy;
          this.$forceUpdate();
          break;
        case 'outSubInventoryName':
          // 出库库位
          console.log('出库库位值改变：', val, item, fieldItem);
          if (!val) {
            item.outSubInventoryName = '';
            item.outSubInventory = '';
            return false;
          }

          let data = {
            inventory: item.outVirtualInventory,
            subInventory: val,
            materialCode: item.sourceMaterialCode
          };
          await availableStockData(data).then(res => {
            // console.log('查询可用数量：', res);
            if (res.code === '0') {
              // item.availableQuantity = Number(res.data) < 0 ? '' : res.data;
              for (var i = 0; i < editListCopy.length; i++) {
                for (var j = 0; j < editListCopy[i].sampleList.length; j++) {
                  let data = editListCopy[i].sampleList[j];
                  if (data.uuid === item.uuid) {
                    let outSelectedName = item.outSubInventoryList.find(i => {
                      return i.subInventory === val;
                    });
                    data.outSubInventoryName = outSelectedName ? outSelectedName.subInventoryName : '';
                    data.outSubInventory = outSelectedName ? outSelectedName.subInventory : '';
                    data.availableQuantity = Number(res.data) < 0 ? '' : res.data;
                  }
                }
              }
              this.editList = editListCopy;
              this.$forceUpdate();
            }
          });
          break;
        case 'inVirtualInventoryName':
          // 入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          if (!val) {
            item.inVirtualInventoryName = '';
            item.inVirtualInventory = '';
            item.inSubInventoryName = '';
            item.inSubInventory = '';
            return false;
          }
          item.inSubInventoryList = [];
          let inSelected = this.inInventoryList.find(i => {
            return i.index === val;
          });
          let inList = [];  // 库位列表数据
          await subInventoryTypeList(val).then(res => {
            if (res.code === '0') {
              inList = res.data;
            }
          });
          
          item.inVirtualInventoryName = inSelected ? inSelected.name : '';
          item.inVirtualInventory = inSelected ? inSelected.index : '';
          item.inSubInventoryName = '';
          item.inSubInventoryList = inList;
          
          // for (var i = 0; i < editListCopy.length; i++) {
          //   let data = editListCopy[i];
          //   if (data.sampleUuid === item.sampleUuid) {
          //     data.inVirtualInventoryName = inSelected.name;
          //     data.inVirtualInventory = inSelected.index;
          //     data.inSubInventoryName = '';
          //     data.inSubInventoryList = inList;
          //   }
          // }
          // this.editList = editListCopy;
          this.$forceUpdate();
          break;
        case 'inSubInventoryName':
          // 入库库位
          console.log('入库库位值改变：', val, item, fieldItem);
          if (!val) {
            item.inSubInventoryName = '';
            item.inSubInventory = '';
            return false;
          }
          let inSelectedName = item.inSubInventoryList.find(i => {
            return i.subInventory === val;
          });
          item.inSubInventoryName = inSelectedName ? inSelectedName.subInventoryName : '';
          item.inSubInventory = inSelectedName ? inSelectedName.subInventory : '';
          break;
      
        default:
          break;
      }
      
    },
    async selectVisibleChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      switch (fieldItem.field) {
        case 'outSubInventoryName':
          console.log('出库库位值显隐：', val, item, fieldItem);
          let outList = [];  // 库位列表数据
          await subInventoryTypeList(item.outVirtualInventory).then(res => {
            if (res.code === '0') {
              if (item.outVirtualInventory == 'C0') {
                // 职业装仓
                for (var i = 0; i < res.data.length; i++) {
                  let osiData = res.data[i];
                  if (osiData.subInventoryName.includes('职业装') && osiData.subInventoryName.includes('工厂库')) {
                    outList.push(osiData);
                  }
                }
              } else if (item.outVirtualInventory == 'B0') {
                // 零剪仓
                for (var i = 0; i < res.data.length; i++) {
                  let osiData = res.data[i];
                  if (osiData.subInventoryName.includes('工厂库')) {
                    outList.push(osiData);
                  }
                }
              } else {
                outList = res.data;
              }
            }
          });
          for (var i = 0; i < editListCopy.length; i++) {
            for (var j = 0; j < editListCopy[i].sampleList.length; j++) {
              let data = editListCopy[i].sampleList[j];
              if (data.uuid === item.uuid) {
                data.outSubInventoryList = outList;
              }
            }
          }
          this.editList = editListCopy;
          this.$forceUpdate();

          // subInventoryTypeList(item.outVirtualInventory).then(res => {
          //   console.log('出库库位显隐：', res);
          //   if (res.code === '0') {
          //     item.outSubInventoryList = res.data;
          //     this.$forceUpdate();
          //   }
          // });
          break;
        case 'inSubInventoryName':
          console.log('入库库位值显隐：', val, item, fieldItem);
          let inList = [];  // 库位列表数据
          await subInventoryTypeList(item.inVirtualInventory).then(res => {
            if (res.code === '0') {
              inList = res.data;
            }
          });
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.sampleUuid === item.sampleUuid) {
              data.inSubInventoryList = inList;
            }
          }
          this.editList = editListCopy;
          this.$forceUpdate();


          // subInventoryTypeList(item.inVirtualInventory).then(res => {
          //   if (res.code === '0') {
          //     item.inSubInventoryList = res.data;
          //     this.$forceUpdate();
          //   }
          // });
          break;
      
        default:
          break;
      }
    },
    numberInputChange(val, item, fieldItem) {
      console.log('numberInput值改变：', val, item, fieldItem);
      switch (fieldItem.field) {
        case '':

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
        case 'packetNumber':
          // 生产数量包数
          console.log('生产数量包数值改变：', val, item, fieldItem, step);
          item.productPackages = parseFloat(item.packetNumber) * parseFloat(item.packetRice);
          this.$forceUpdate();
          break;
        case 'packetRice':
          // 生产数量规格
          console.log('生产数量规格改变：', val, item, fieldItem, step);
          item.productPackages = parseFloat(item.packetNumber) * parseFloat(item.packetRice);
          this.$forceUpdate();
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
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.PPR {
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
        position: relative;
        border-bottom: 1px solid #EEEEEE;
      }
      .add_btn {
        position: absolute;
        bottom: 14px;
        right: 40px;
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
      max-width: 150px;
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
      li {
        line-height: 40px;
      }
    }
  }
  .list_group {
    border-bottom: 1px solid #EEEEEE;
    &:last-of-type {
      border-bottom: none;
    }
  }
}

.subnav_wrap .el-checkbox {
  white-space: nowrap;
}


</style>
<style>
.PPR .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.PPR .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.PPR .subnav_wrap .el-tabs__content {
  overflow: visible;
}
.PPR .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.PPR .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.PPR .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
</style>