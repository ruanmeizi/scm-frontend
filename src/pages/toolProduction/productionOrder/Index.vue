<template>
  <div class="container productionOrder">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">生产类型：</span>
            <el-select class="select_single w200 mr10"
              v-model="productionOrderType"
              @change="searchHandle"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in materialClassList"
                :key="item.index"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">生产订单编号：</span>
            <el-input class="input_single w200 mr10" v-model="productionOrderCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">生产物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="productionMaterialCode" placeholder="请输入"></el-input>
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
              @checkHandle="allCheckHandle"
              @deleteHandle="deleteHandle">
            </Table> -->

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
              <!-- <el-table-column type="selection" /> -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="actions_wrap mb20 clearfix">
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
                    :data="scope.row.sampleStoriList"
                    border
                    fit>
                    <!-- <el-table-column fixed type="selection" /> -->
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
                          <el-table-column fixed label="原材料产品编号">
                            <template slot-scope="{ row }">
                              {{ row.sourceProductCode }}
                            </template>
                          </el-table-column>
                          <el-table-column label="原材料物料编号">
                            <template slot-scope="{ row }">
                              {{ row.sourceMaterialCode }}
                            </template>
                          </el-table-column>
                          <el-table-column label="原材料类型">
                            <template slot-scope="{ row }">
                              {{ row.materialTypeName }}
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
                        {{ row.productionMaterialCode }}
                      </template>
                    </el-table-column>
                    <el-table-column label="生产数量">
                      <template slot-scope="{ row }">
                        {{ row.productionQuantity }}
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
                  {{ row.productionOrderCode }}
                </template>
              </el-table-column>
              <el-table-column label="生产类型">
                <template slot-scope="{ row }">
                  {{ row.productionType }}
                </template>
              </el-table-column>
              <el-table-column label="用途">
                <template slot-scope="{ row }">
                  {{ row.purpose }}
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
                    <el-tag slot="reference" class="pointer" :type="row.stStatus | statusFilter">{{ row.stStatusName }}</el-tag>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <div v-if="row.stStatus == 'Draft' || row.stStatus == 'Rejected'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                    <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                    <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                  </div>
                  <div v-if="row.stStatus == 'Terminated'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
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
          <span v-if="isShowVal" class="tag">{{productionType}}</span>
          <el-select v-else class="select_single w200 mr10 mb10"
            v-model="productionType"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in materialClassList"
              :key="item.index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="tag"><span class="red mr5">*</span>用途：</span>
          <span v-if="isShowVal" class="tag">{{purpose}}</span>
          <el-select v-else class="select_single w200 mr10 mb10"
            v-model="purpose"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in purposeTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10" v-if="purpose === '自用'">
          <span class="tag"><span class="red mr5">*</span>销售季：</span>
          <span v-if="isShowVal" class="tag">{{salesSeason}}</span>
          <el-select v-else class="select_single w200 mr10 mb10"
            v-model="salesSeason"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in salesSeasonList"
              :key="item.index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10" v-if="purpose === '客用'">
          <div v-if="isShowVal">
            <span class="tag"><span class="red mr5">*</span>销售订单编号：</span>
            <span class="tag">{{customerCode}}</span>
          </div>
          <el-input v-else class="input_single w200 mr10 mb10" v-model="customerCode" placeholder="销售订单编号"></el-input>
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
          @deleteChlidHandle="deleteEditItemHandle"
          @addHandle="addEditItemHandle">
        </editDoubleTable>

        <div class="mt20 fr">
          <el-button @click="cancelEditHandle">取消</el-button>
          <el-button type="primary" v-preventReClick @click="saveEditHandle">保存</el-button>
          <el-button type="primary" v-preventReClick @click="submitEditHandle">提交审批</el-button>
        </div>
        
      </div>
    </div>

    <!-- 子项详情弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <div
              class="list_group"
              v-for="(childItem, index) in checkProduceList.sampleStoriList"
              :key="index">
              <ul
                class="childcontentlist"
                v-for="(simpleItem, simpleIndex) in childItem.sampleList"
                :key="simpleIndex">
                <li class="w6p" :title="simpleItem.sourceProductCode">{{simpleItem.sourceProductCode ? simpleItem.sourceProductCode : ''}}</li>
                <li class="w6p" :title="simpleItem.sourceMaterialCode">{{simpleItem.sourceMaterialCode ? simpleItem.sourceMaterialCode : ''}}</li>
                <li class="w6p" :title="simpleItem.materialType">{{simpleItem.materialType ? simpleItem.materialType : ''}}</li>
                <li class="w6p" :title="simpleItem.sourceQuantity">{{simpleItem.sourceQuantity ? simpleItem.sourceQuantity : ''}}</li>
                <li class="w6p" :title="simpleItem.supplierName">{{simpleItem.supplierName ? simpleItem.supplierName : ''}}</li>
                <li v-if="simpleIndex === 0" class="w6p" :title="childItem.requiredDate">{{childItem.requiredDate ? childItem.requiredDate : ''}}</li>
                <li v-if="simpleIndex === 0" class="w6p" :title="childItem.productionMaterialCode">{{childItem.productionMaterialCode ? childItem.productionMaterialCode : ''}}</li>
                <li v-if="simpleIndex === 0" class="w6p" :title="childItem.productionQuantity">{{childItem.productionQuantity ? childItem.productionQuantity : ''}}</li>
                <li v-if="simpleIndex !== 0" class="w6p"></li>
                <li v-if="simpleIndex !== 0" class="w6p"></li>
                <li v-if="simpleIndex !== 0" class="w6p"></li>
                <li class="w6p" :title="simpleItem.outVirtualInventoryName">{{simpleItem.outVirtualInventoryName ? simpleItem.outVirtualInventoryName : ''}}</li>
                <li class="w6p" :title="simpleItem.outSubInventoryName">{{simpleItem.outSubInventoryName ? simpleItem.outSubInventoryName : ''}}</li>
                <li class="w6p" :title="simpleItem.inVirtualInventoryName">{{simpleItem.inVirtualInventoryName ? simpleItem.inVirtualInventoryName : ''}}</li>
                <li class="w6p" :title="simpleItem.inSubInventoryName">{{simpleItem.inSubInventoryName ? simpleItem.inSubInventoryName : ''}}</li>
                <li class="w6p" :title="simpleItem.inventoryInNum">{{simpleItem.inventoryInNum ? simpleItem.inventoryInNum : ''}}</li>
                <li class="w6p" :title="simpleItem.confirmNo">{{simpleItem.confirmNo ? simpleItem.confirmNo : ''}}</li>
                <li class="w6p" :title="simpleItem.remark">{{simpleItem.remark ? simpleItem.remark : ''}}</li>
                <li class="w6p" :title="simpleItem.auditOption">{{simpleItem.auditOption ? simpleItem.auditOption : ''}}</li>
              </ul>
            </div>
          </div>

        </el-tabs>
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
  approvalProcessInfo
} from "@/api/publicApi.js";
import {
  toolProduceList,
  toolProduceDraftList,
  materialClassList,
  deleteFabricProduce,
  editProduceList,
  submitProduceList,
  searchFabricProduce,
  inventoryTypeList,
  subInventoryTypeList,
  salesSeasonList,
  constDictList,
  getOriginCodeByMC
} from "@/api/module/toolProduceApi.js";
import {
  getUUID
} from "@/api/publicApi.js";
import { timeFormat, getTimeRange, excelDateFormatToDate } from "@/utils/index.js";
import { statusTypeHandle } from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
export default {
  name: "productionOrder",
  data() {
    return {
      tableLoading: true,
      productionOrderType: '', //搜索 生产类型
      productionOrderCode: '', //搜索 生产订单编号
      productionMaterialCode: '', //搜索 生产物料编号
      productionType: '',
      // purposeType: '',
      purpose: '',
      // salesSeasonType: '',
      salesSeason: '',
      customerCode: '',
      isShowVal: false,
      materialClassList: [],
      salesSeasonList: [],
      expands:[],
      dialogFormVisible: false,
      popupTitle: '',
      deleteId: '',
      productOrderCode: '',
      submitParamsData: {},
      deleteDialogVisible: false,
      submitDialogVisible: false,
      isHide: false,
      isShowEdit: false,
      isShowList: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      activeName: 'all',
      stStatus: '',
      dateVal: '',
      sourceProductCode: '',
      sourceMaterialCode: '',
      productionMaterialCode: '',
      productionOrderCode: '',
      supplierName: '',
      beginTime: '',
      endTime: '',
      uuid: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      produceList: [],
      checkProduceList: [],
      editList: [],
      outInventoryList: [], //出库仓位列表
      outSubInventoryList: [], //出库库位列表
      inInventoryList: [], //入库仓位列表
      inSubInventoryList: [], //入库库位列表

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      selectUuidList: [],
      editPartLoading: false,

      allFieldList: [
        {
          name: '原材料产品编号',
          class: 'w6p'
        },
        {
          name: '原材料物料编号',
          class: 'w6p'
        },
        {
          name: '原材料类型',
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
          name: '生产类型',
          class: 'w5p'
        },
        {
          name: '用途',
          class: 'w5p'
        },
        {
          name: '销售季',
          class: 'w5p'
        },
        {
          name: '审批',
          class: ''
        }
      ],
      editFieldList: [
        {
          name: '生产物料编号',
          class: 'w8p',
          isRules: true
        },
        {
          name: '生产数量',
          class: 'w8p',
          isRules: true
        },
        {
          name: '期望交期',
          class: 'w8p',
          isRules: true
        },
        {
          name: '原材料产品编号',
          class: 'w8p',
          isRules: true
        },
        {
          name: '原材料物料编号',
          class: 'w8p',
          isRules: true
        },
        {
          name: '原材料消耗数量',
          class: 'w8p',
          isRules: true
        },
        {
          name: '出库仓位',
          class: 'w8p',
          isRules: true
        },
        {
          name: '出库库位',
          class: 'w8p',
          isRules: true
        },
        {
          name: '入库仓位',
          class: 'w8p',
          isRules: true
        },
        {
          name: '入库库位',
          class: 'w8p',
          isRules: true
        },
        {
          name: '备注',
          class: 'w8p'
        },
        {
          name: '审批意见',
          class: 'w4p'
        },
        {
          name: '',
          class: 'w3p'
        }
      ],
      purposeTypeList: [
        {
          value: '客用',
          name: '客用'
        },
        {
          value: '自用',
          name: '自用'
        }
      ],
      addData: {
        requiredDate: '',
        productionMaterialCode: '',
        sampleUuid: '',
        productionQuantity: '',
        inInventoryList: [],
        inVirtualInventoryCode: '',
        inVirtualInventoryName: '',
        inSubInventoryCode: '',
        inSubInventoryName: '',
        remark: '',
        sampleList: [],
      },
      addItemData: {
        uuid: '',
        sourceProductCode: '',
        sourceMaterialCode: '',
        sourceQuantity: 0.00,
        outVirtualInventoryCode: 'B0',
        outSubInventory: '',
        outVirtualInventoryName: '零剪仓',
        outSubInventoryCode: '52',
        // inVirtualInventoryName: '',
        // inSubInventoryName: '',
        // inSubInventoryCode: '',
        // inVirtualInventory: '',
        // inVirtualInventoryCode: '',
        inSubInventory: '',
        outSubInventoryName: '零剪样本布仓库',
        confirmNumbers: '',
        auditOption: ''
      },
      submitData: {
        submitType: '',
        uuid: '',
        purpose: '',
        productionType: '',
        salesSeason: '',
        customerCode: '',
        storciList: []
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
            field: 'productionOrderCode',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '生产类型',
            field: 'productionType',
            class: 'w5p',
            isShowTit: true
          },
          {
            name: '用途',
            field: 'purpose',
            class: 'w5p',
            isShowTit: true
          },
          {
            name: '销售季',
            field: 'salesSeason',
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
        type: 'double',
        name: 'sampleStoriList',
        childName: 'sampleList',
        data: [
          {
            name: '',
            field: 'sourceProductCode',
            class: 'w6p'
          },
          {
            name: '',
            field: 'sourceMaterialCode',
            class: 'w6p'
          },
          {
            name: '',
            field: 'materialTypeName',
            class: 'w6p'
          },
          {
            name: '',
            field: 'sourceQuantity',
            class: 'w6p'
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
            field: 'productionMaterialCode',
            class: 'w6p',
            isChildField: true
          },
          {
            name: '',
            field: 'productionQuantity',
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
          field: 'productionQuantity',
          class: 'w8p',
          width: '150',
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
          // field: 'inVirtualInventoryCode',
          field: 'inVirtualInventoryName',
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
          name: '* 原材料产品编号',
          field: 'sourceProductCode',
          class: 'w8p',
          width: '150',
          isRules: true
        },
        {
          name: '* 原材料物料编号',
          field: 'sourceMaterialCode',
          class: 'w8p',
          width: '150',
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
          // field: 'outVirtualInventoryCode',
          field: 'outVirtualInventoryName',
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
        // {
        //   name: '审批意见',
        //   field: 'auditOption',
        //   class: 'w4p',
        //   width: '150'
        // }
      ],
      leaderFieldsList: [
        {
          name: '* 生产物料编号',
          field: 'productionMaterialCode',
          class: '',
          width: '150',
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
          isChlidAction: true,
          hasAdd: true,
          hasChildDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        auditOption: true
      },
      inputSet: {
        productionMaterialCode: true,
        productionQuantity: {
          type: 'number',
          minlength: 0
        },
        sourceProductCode: true,
        sourceMaterialCode: true,
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
        }
      },
      numberInputSet: {
        sourceQuantity: true
      },
      datePickerSet: {
        requiredDate: true
      },
      unitSet: {},

      childHeaderList: ['行号', '生产物料编号', '生产数量', '期望交期', '入库仓位', '入库库位', '已入库数', '备注', '原材料产品编号', '原材料物料编号', '原材料类型', '原材料消耗数量', '供应商', '出库仓位', '出库库位'],
      childFieldsList: ['sn', 'productionMaterialCode', 'productionQuantity', 'requiredDate', 'inVirtualInventoryName', 'inSubInventoryName', 'inventoryInNum', 'remark', 'sourceProductCode', 'sourceMaterialCode', 'materialTypeName', 'sourceQuantity', 'supplierShortName', 'outVirtualInventoryName', 'outSubInventoryName'],

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
    this.getMaterialClassList();
    this.getSalesSeasonList();
    this.getInventoryList();
    this.addData.sampleList.push(this.addItemData);
    this.fun_date();
    this.checkDefault();//检查出库库位是否存在默认值
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
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        let newList = [];
        const list = item.sampleStoriList;
        list.forEach(x => {
          x.sampleList.forEach(y => {
            newList.push(y);
          });
        });
        const data = this.formatJson(fieldList, newList);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.productionOrderCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
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
      if (!this.productionType) {
        this.editPartLoading = false;
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (!this.purpose) {
        this.editPartLoading = false;
        this.$message({
          type: 'error',
          message: '请选择用途！'
        });
        return false;
      }
      if (this.purpose === '自用' && !this.salesSeason) {
        this.editPartLoading = false;
        this.$message({
          type: 'error',
          message: '请选择销售季！'
        });
        return false;
      }
      if (this.purpose === '客用' && !this.customerCode) {
        this.editPartLoading = false;
        this.$message({
          type: 'error',
          message: '请输入销售订单编号！'
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
          getUUID().then(res => {
            if (res.code === '0') {
              // addDataCopy.uuid = res.data;
              addDataCopy.sampleUuid = res.data;
            }
          });
          addDataCopy.inInventoryList = this.inInventoryList;
          this.updateEditModeSet('add', addDataCopy);
          getUUID().then(res => {
            if (res.code === '0') {
              addItemDataCopy.uuid = res.data;
            }
          });
          addItemDataCopy.outInventoryList = this.outInventoryList;
          this.updateEditModeSet('add', addItemDataCopy);
          addDataCopy.sampleList = [];

          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '生产物料编号') {
              addDataCopy.productionMaterialCode = item[key];
              addItemDataCopy.productionMaterialCode = item[key];
              baseList.push(addDataCopy.productionMaterialCode);
            } else if (key === '生产数量') {
              addDataCopy.productionQuantity = item[key];
              addItemDataCopy.productionQuantity = item[key];
              baseList.push(addDataCopy.productionQuantity);
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
              addDataCopy.inVirtualInventoryCode = inInventoryData ? inInventoryData.index : '';
              addItemDataCopy.inVirtualInventoryCode = inInventoryData ? inInventoryData.index : '';
              baseList.push(addDataCopy.inVirtualInventoryName);
            } else if (key === '入库库位') {
              addDataCopy.inSubInventoryName = item[key];
              addItemDataCopy.inSubInventoryName = item[key];
              baseList.push(addDataCopy.inSubInventoryName);
            } else if (key === '备注') {
              addDataCopy.remark = item[key];
              addItemDataCopy.remark = item[key];
              baseList.push(addDataCopy.remark);
            } else if (key === '原材料产品编号') {
              addItemDataCopy.sourceProductCode = item[key];
            } else if (key === '原材料物料编号') {
              addItemDataCopy.sourceMaterialCode = item[key];
            } else if (key === '原材料消耗数量') {
              addItemDataCopy.sourceQuantity = item[key];
            } else if (key === '出库仓位') {
              let outInventoryData = this.outInventoryList.find(x => {
                return x.name === item[key];
              });
              addItemDataCopy.outVirtualInventoryName = item[key];
              addItemDataCopy.outVirtualInventoryCode = outInventoryData ? outInventoryData.index : '';
            } else if (key === '出库库位') {
              addItemDataCopy.outSubInventoryName = item[key];
            }
          });
          // addDataCopy.sampleList.push(addItemDataCopy);
          // importList.push(addDataCopy);

          baseKey = baseList.join('');
          if (baseObj[baseKey]) {
            baseObj[baseKey].sampleUuid = baseObj[baseKey].sampleUuid;
            importList.forEach(x => {
              if (x.sampleUuid === baseObj[baseKey].sampleUuid) {
                x.sampleList.push(addItemDataCopy);
              }
            });
          } else {
            baseObj[baseKey] = {};
            baseObj[baseKey].sampleUuid = addDataCopy.sampleUuid;
            addDataCopy.sampleList.push(addItemDataCopy);
            importList.push(addDataCopy);
          }
        }

        this.editList = importList;

        for (let i = 0; i < this.editList.length; i++) {
          let item = this.editList[i];
          await getOriginCodeByMC(item.productionMaterialCode).then(res => {
            console.log('生产物料编号请求数据：', res);
            if (res.code === '0' && res.data.length) {
              for (let j = 0; j < item.sampleList.length; j++) {
                let cItem = item.sampleList[j];
                cItem.sourceProductCode = res.data ? res.data[j].remarks : '';
                cItem.sourceMaterialCode = res.data ? res.data[j].combinedMaterialCode : '';
                this.$set(this.editList[i].sampleList, j, cItem);
              }
              this.$forceUpdate();
            }
          });
        }
        
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
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
    async checkDefault(){
      if(await this.getCheckoutSubInventory()!=true){ //检查出库库位是否存在默认值
        this.addItemData.outSubInventoryCode='';
        this.addItemData.outSubInventoryName='';
      }
    },
      //固定展示为两周前的时间范围
    fun_date(){
       console.log(getTimeRange(-14))//两周前的日期
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
          for (let j = 0; j < item.sampleStoriList.length; j++) {
            let cItem = item.sampleStoriList[j];
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
          for (let j = 0; j < item.sampleStoriList.length; j++) {
            let cItem = item.sampleStoriList[j];
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
        for (let i = 0; i < row.sampleStoriList.length; i++) {
          let cItem = row.sampleStoriList[i];
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
          for (let i = 0; i < _row.sampleStoriList.length; i++) {
            let cItem = _row.sampleStoriList[i];
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
          for (let i = 0; i < _row.sampleStoriList.length; i++) {
            let cItem = _row.sampleStoriList[i];
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
          console.log('阿斯蒂芬季还是都丑：', this.$refs.multipleTable);
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
          this.$set(this.produceList, index, item);
          this.$forceUpdate();
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
          if (this.stStatus === 'Draft') {
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
    getCheckoutSubInventory(){
      return subInventoryTypeList('B0').then(res => {
        if (res.code === '0') {
          // console.log(res.data)
          this.outSubInventoryList=res.data;
          if(this.outSubInventoryList.findIndex(target=>target.subInventory==="52")==-1){
              return false;
          }else {
             return true;
          }
        }
      });
    },
    async editHandle(index, item) {
      // 编辑
      console.log('编辑项：', item);
      this.isShowEdit = true;
      let ifdefault=await this.getCheckoutSubInventory();
      searchFabricProduce(item.id).then(res => {
        // console.log('当前操作项：', res);
        if (res.code === '0') {
          let list = res.data.sampleStoriList;
          for (var i = 0; i < list.length; i++) {
            list[i].inInventoryList = this.inInventoryList;
            this.updateEditModeSet('edit', list[i]);
            console.log(this.outSubInventoryList);
            for (var j = 0; j < list[i].sampleList.length; j++) {
              let data = list[i].sampleList[j];
              data.outInventoryList = this.outInventoryList;
              if(ifdefault!=true){
                data.outSubInventoryCode='';
                data.outSubInventoryName='';
              }
               this.updateEditModeSet('edit', data);
            }
          }
          console.log(list)
          this.editList = list;
          this.uuid = res.data.uuid;
          this.productionType = res.data.productionType;
          this.purpose = res.data.purpose;
          this.salesSeason = res.data.salesSeason;
          this.customerCode = res.data.customerCode;
          console.log(this.editList)
        }
      });
    },
    submitHandle(index, item) {
      // 提交审批
      // console.log('列表提交审批：', item);
      // this.productOrderCode = item.productionOrderCode;
      this.submitParamsData = {
        uuid: item.uuid,
        stStatus: 'Approving',
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      editProduceList(this.submitParamsData).then(res => {
        // console.log('提交数据：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.stStatus = 'Approving';
          this.activeName = 'Approving';
          this.getFabricProduceList();
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
      });
    },
    allCheckHandle(index, item) {
      this.dialogFormVisible = true;
      this.popupTitle = '销售工具生产';
      searchFabricProduce(item.id).then(res => {
        // console.log('当前操作项：', res);
        if (res.code === '0') {
          this.checkProduceList = res.data;
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
      if (this.stStatus === 'Draft') {
        this.getFabricProduceDraftList();
      } else {
        this.getFabricProduceList();
      }
    },
    async addHandle() {
      // 列表页添加
      console.log('当前新增订单状态：', this.stStatus);
      this.isShowEdit = true;
      this.uuid = '';
      this.productionType = '';
      this.purpose = '';
      this.salesSeason = '';
      this.customerCode = '';
      this.stStatus = 'Draft';
      let list = [];
      let addDataCopy = JSON.parse(JSON.stringify(this.addData));
      addDataCopy.inInventoryList = this.inInventoryList;
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      await getUUID().then(res => {
        if (res.code === '0') {
          // addDataCopy.uuid = res.data;
          addDataCopy.sampleUuid = res.data;
        }
      });
      this.updateEditModeSet('add', addDataCopy);
      addDataCopy.sampleList.push(addItemDataCopy);
      console.log(addDataCopy.sampleList)
      addDataCopy.sampleList.forEach(item => {
        item.outInventoryList = this.outInventoryList;
         console.log(this.outSubInventoryList)
        this.updateEditModeSet('add', item);
        getUUID().then(res => {
          if (res.code === '0') {
            item.uuid = res.data;
          }
        });
      });
      list.push(addDataCopy);
      this.editList = list;
    },
    switchTabHandle(tab) {
      // tab切换
      console.log('tab切换：', tab);
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
          this.stStatus = '';
          this.getFabricProduceList();
          break;
        case 'Draft':
          // 草稿
          this.stStatus = 'Draft';
          this.getFabricProduceDraftList();
          break;
        case 'Approving':
          // 审批中
          this.stStatus = 'Approving';
          this.getFabricProduceList();
          break;
        case 'Approved':
          // 已通过
          this.stStatus = 'Approved';
          this.getFabricProduceList();
          break;
        case 'Rejected':
          // 已驳回
          this.stStatus = 'Rejected';
          this.getFabricProduceList();
          break;
        case 'Terminated':
          // 已终止
          // this.activeName = 'Terminated';
          this.stStatus = 'Terminated';
          this.getFabricProduceList();
          break;
        default:
          // this.activeName = 'all';
          this.stStatus = '';
          this.getFabricProduceList();
          break;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.stStatus === 'Draft') {
        this.getFabricProduceDraftList();
      } else {
        this.getFabricProduceList();
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.stStatus === 'Draft') {
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
      // console.log('大号添加按钮：', this.editList);
      if (!this.productionType) {
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (!this.purpose) {
        this.$message({
          type: 'error',
          message: '请选择用途！'
        });
        return false;
      }
      if (this.purpose === '自用' && !this.salesSeason) {
        this.$message({
          type: 'error',
          message: '请选择销售季！'
        });
        return false;
      }
      if (this.purpose === '客用' && !this.customerCode) {
        this.$message({
          type: 'error',
          message: '请输入销售订单编号！'
        });
        return false;
      }
      this.isShowVal = true;
      if (this.editList.length >= 10) {
        this.$message({
          type: 'error',
          message: '最多添加10条数据！'
        });
        return false;
      }
      let addDataCopy = JSON.parse(JSON.stringify(this.addData));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      await getUUID().then(res => {
        if (res.code === '0') {
          // addDataCopy.uuid = res.data;
          addDataCopy.sampleUuid = res.data;
        }
      });
      addDataCopy.inInventoryList = this.inInventoryList;
      this.updateEditModeSet('add', addDataCopy);
      addDataCopy.sampleList.push(addItemDataCopy);
      addDataCopy.sampleList.forEach(item => {
        item.outInventoryList = this.outInventoryList;
        // item.inInventoryList = this.inInventoryList;
        this.updateEditModeSet('add', item);
        getUUID().then(res => {
          if (res.code === '0') {
            item.uuid = res.data;
          }
        });
      });
      this.editList.push(addDataCopy);

      console.log('新增生产数据：', this.editList);
    },
    async addEditItemHandle(index, data) {
      // 添加样本子数据
      // console.log('添加样本子数据');
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      addItemDataCopy.outInventoryList = this.outInventoryList;
      addItemDataCopy.inInventoryList = this.inInventoryList;
      this.updateEditModeSet('add', editListCopy[index]);
      this.updateEditModeSet('add', addItemDataCopy);
      await getUUID().then(res => {
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
      } else {
        let editListCopy = JSON.parse(JSON.stringify(this.editList));
        editListCopy[pi].sampleList.splice(ci, 1);
        this.editList = editListCopy;
      }
    },
    cancelEditHandle() {
      this.isShowEdit = false;
      this.isShowVal = false;
      this.productionType = '';
      this.purpose = '';
      this.salesSeason = '';
      this.customerCode = '';
    },
    async saveEditHandle() {
      // 保存编辑数据
      console.log('编辑保存列表：', this.editList);
      let time = null;
      if (!this.editList.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.productionType) {
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (!this.purpose) {
        this.$message({
          type: 'error',
          message: '请选择用途！'
        });
        return false;
      }
      if (this.purpose === '自用' && !this.salesSeason) {
        this.$message({
          type: 'error',
          message: '请选择销售季！'
        });
        return false;
      }
      if (this.purpose === '客用' && !this.customerCode) {
        this.salesSeason = '';
        this.$message({
          type: 'error',
          message: '请输入销售订单编号！'
        });
        return false;
      }
      // 校验
      for (var i = 0; i < this.editList.length; i++) {
        for (var j = 0; j < this.editList[i].sampleList.length; j++) {
          let data = this.editList[i].sampleList[j];
          if (!this.editList[i].productionMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入生产物料编号！'
            });
            return false;
          }
          if (!this.editList[i].productionQuantity) {
            this.$message({
              type: 'error',
              message: '请输入生产数量！'
            });
            return false;
          }
          if (this.editList[i].productionQuantity < 0) {
            this.$message({
              type: 'error',
              message: '生产数量不能为负！'
            });
            return false;
          }
           if (this.editList[i].productionQuantity >= 2147483647) {
            this.$message({
              type: 'error',
              message: '生产数量值过大！'
            });
            return false;
          }
          if (!this.editList[i].requiredDate) {
            this.$message({
              type: 'error',
              message: '请输入期望交期！'
            });
            return false;
          }
          if (!this.editList[i].inVirtualInventoryCode) {
            this.$message({
              type: 'error',
              message: '请输入入库仓位！'
            });
            return false;
          }
          if (!this.editList[i].inSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请输入入库库位！'
            });
            return false;
          }
          // if (!this.editList[i].packetNumber || !this.editList[i].packetRice) {
          //   this.$message({
          //     type: 'error',
          //     message: '请输入生产数量！'
          //   });
          //   return false;
          // }
          // this.editList[i].productionQuantity = parseFloat(this.editList[i].packetNumber)*parseFloat(this.editList[i].packetRice);
          // if (this.editList[i].productionQuantity.toString().indexOf('.') !== -1) {
          //   let arr = this.editList[i].productionQuantity.toString().split('.');
          //   if (arr[0].length > 8) {
          //     this.$message({
          //       message: '生产数量米数仅支持整数位8位，请重新输入！',
          //       type: 'error'
          //     });
          //     return false;
          //   }
          //   if (arr[1].length > 2) {
          //     this.$message({
          //       message: '生产数量米数仅支持小数位2位，请重新输入！',
          //       type: 'error'
          //     });
          //     return false;
          //   }
          // } else if (this.editList[i].productionQuantity.toString().length > 8) {
          //   this.$message({
          //     message: '生产数量米数仅支持整数位8位，请重新输入！',
          //     type: 'error'
          //   });
          //   return false;
          // }
          if (!data.sourceProductCode) {
            this.$message({
              type: 'error',
              message: '请输入原材料产品编号！'
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
          if (!data.outVirtualInventoryCode) {
            this.$message({
              type: 'error',
              message: '请输入出库仓位！'
            });
            return false;
          }
          if (!data.outSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请输入出库库位！'
            });
            return false;
          }
        }
      }
      if (!this.uuid) {
        await getUUID().then(res => {
          console.log(res);
          if (res.code === '0') {
            this.submitData.uuid = res.data;
          }
        });
      } else {
        this.submitData.uuid = this.uuid;
      }
      if (this.stStatus == 'Draft') {
        // 草稿保存
        this.submitData.submitType = '1';
      } else if (this.stStatus == 'Rejected') {
        // 驳回保存
        this.submitData.submitType = '3';
      } else {
        this.submitData.submitType = '1';
      }
      this.submitData.productionOrderType = 'saleTool';
      // this.submitData.submitType = '1';
      this.submitData.storciList = this.editList;
      this.submitData.productionType = this.productionType;
      this.submitData.purpose = this.purpose;
      this.submitData.salesSeason = this.salesSeason;
      this.submitData.customerCode = this.customerCode;
      this.submitData.applicant = this.$store.state.userName;
      this.submitData.applicantName = this.$store.state.realName;
      this.submitData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.submitData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSaveDisabled = true;
      // time = setTimeout(() => {
        submitProduceList(this.submitData).then(res => {
          console.log('保存数据：', res);
          if (res.code === '0') {
            if (this.stStatus === 'Draft') {
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
      // }, 100);
    },
    async submitEditHandle() {
      // 编辑数据提交审批
      let time = null;
      if (!this.editList.length) {
        this.$message({
          type: 'error',
          message: '请添加数据！'
        });
        return false;
      }
      if (!this.productionType) {
        this.$message({
          type: 'error',
          message: '请选择生产类型！'
        });
        return false;
      }
      if (!this.purpose) {
        this.$message({
          type: 'error',
          message: '请选择用途！'
        });
        return false;
      }
      if (this.purpose === '自用' && !this.salesSeason) {
        this.$message({
          type: 'error',
          message: '请选择销售季！'
        });
        return false;
      }
      if (this.purpose === '客用' && !this.customerCode) {
        this.salesSeason = '';
        this.$message({
          type: 'error',
          message: '请输入销售订单编号！'
        });
        return false;
      }
      // 校验
      for (var i = 0; i < this.editList.length; i++) {
        for (var j = 0; j < this.editList[i].sampleList.length; j++) {
          let data = this.editList[i].sampleList[j];
          if (!this.editList[i].productionMaterialCode) {
            this.$message({
              type: 'error',
              message: '请输入生产物料编号！'
            });
            return false;
          }
          if (!this.editList[i].productionQuantity) {
            this.$message({
              type: 'error',
              message: '请输入生产数量！'
            });
            return false;
          }
          if (this.editList[i].productionQuantity < 0) {
            this.$message({
              type: 'error',
              message: '生产数量不能为负！'
            });
            return false;
          }
           if (this.editList[i].productionQuantity >= 2147483647) {
            this.$message({
              type: 'error',
              message: '生产数量值过大！'
            });
            return false;
          }
          if (!this.editList[i].requiredDate) {
            this.$message({
              type: 'error',
              message: '请输入期望交期！'
            });
            return false;
          }
          if (!this.editList[i].inVirtualInventoryCode) {
            this.$message({
              type: 'error',
              message: '请输入入库仓位！'
            });
            return false;
          }
          if (!this.editList[i].inSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请输入入库库位！'
            });
            return false;
          }
          if (!data.sourceProductCode) {
            this.$message({
              type: 'error',
              message: '请输入原材料产品编号！'
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
          if (!data.outVirtualInventoryCode) {
            this.$message({
              type: 'error',
              message: '请输入出库仓位！'
            });
            return false;
          }
          if (!data.outSubInventoryName) {
            this.$message({
              type: 'error',
              message: '请输入出库库位！'
            });
            return false;
          }
        }
      }
      if (!this.uuid) {
        await getUUID().then(res => {
          console.log(res);
          if (res.code === '0') {
            this.submitData.uuid = res.data;
          }
        });
      } else {
        this.submitData.uuid = this.uuid;
      }
      if (this.stStatus == 'Draft') {
        // 草稿
        this.submitData.submitType = '2';
      } else if (this.stStatus == 'Rejected') {
        // 驳回
        this.submitData.submitType = '4';
      } else {
        this.submitData.submitType = '2';
      }
      this.submitData.productionOrderType = 'saleTool';
      this.submitData.storciList = this.editList;
      this.submitData.productionType = this.productionType;
      this.submitData.purpose = this.purpose;
      this.submitData.salesSeason = this.salesSeason;
      this.submitData.customerCode = this.customerCode;
      this.submitData.applicant = this.$store.state.userName;
      this.submitData.applicantName = this.$store.state.realName;
      this.submitData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.submitData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      // time = setTimeout(() => {
        submitProduceList(this.submitData).then(res => {
          console.log('提交数据：', res);
          if (res.code === '0') {
            // if (this.stStatus === 'Draft') {
            //   this.getFabricProduceDraftList();
            // } else {
            this.stStatus = 'Approving';
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
      // }, 100);
    },
    getFabricProduceList() {
      // 销售工具生产列表
      let data = {
        stStatus: this.stStatus,
        productionType: this.productionOrderType,
        productionOrderCode: this.productionOrderCode,
        productionMaterialCode: this.productionMaterialCode,
        beginTime: this.beginTime,
        endTime: this.endTime,
        productionOrderType:'saleTool'
      };
      toolProduceList(this.currentPage, this.pageSize, data).then(res => {
        console.log('销售工具生产列表：', res);
        if (res.code === '0') {
          this.produceList = res.data.records;
          this.total = res.data.total;
          let list = this.produceList;
          for (var i = 0; i < list.length; i++) {
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].status = list[i].stStatus;
            list[i].stStatusName = statusTypeHandle(list[i].stStatus);
            // switch (list[i].stStatus) {
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
            //       hasEdit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     list[i].actions = {};
            //     break;
            // }
            for (var j = 0; j < list[i].sampleStoriList.length; j++) {
              let data = list[i].sampleStoriList[j];
              this.updateEditModeSet('edit', data);
              for (var m = 0; m < data.sampleList.length; m++) {
                let cData = data.sampleList[m];
                cData.inventoryInNum = data.inventoryInNum;
                this.updateEditModeSet('edit', cData);
              }
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
    getFabricProduceDraftList() {
      // 面料生产申请草稿列表
      let data = {
        stStatus: 'Draft',
        productionType: this.productionOrderType,
        productionOrderCode: this.productionOrderCode,
        productionMaterialCode: this.productionMaterialCode,
        beginTime: this.beginTime,
        endTime: this.endTime,
        productionOrderType:'saleTool'
      };
      toolProduceDraftList(this.currentPage, this.pageSize, data).then(res => {
        console.log('销售工具生产草稿列表：', res);
        if (res.code === '0') {
          this.produceList = res.data.records;
          this.total = res.data.total;
          let list = this.produceList;
          for (var i = 0; i < list.length; i++) {
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].status = list[i].stStatus;
            list[i].stStatusName = statusTypeHandle(list[i].stStatus);
            // 列表组件操作按钮
            // switch (list[i].stStatus) {
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
            //       hasDelete: true
            //     };
            //     break;
            //   case 'Terminated':
            //     list[i].actions = {
            //       hasEdit: true,
            //       hasDelete: true
            //     };
            //     break;
            //   default:
            //     list[i].actions = {};
            //     break;
            // }
            for (var j = 0; j < list[i].sampleStoriList.length; j++) {
              let data = list[i].sampleStoriList[j];
              this.updateEditModeSet('edit', data);
              for (var m = 0; m < data.sampleList.length; m++) {
                let cData = data.sampleList[m];
                cData.inventoryInNum = data.inventoryInNum;
                this.updateEditModeSet('edit', cData);
              }
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
    getInventoryList() {
      // 仓位
      inventoryTypeList().then(res => {
        console.log('仓位列表数据：', res);
        if (res.code === '0') {
          this.outInventoryList = res.data;
          this.inInventoryList = res.data;
        }
      });
    },
    getSubInventoryList(id) {
      // 库位
      subInventoryTypeList(id).then(res => {
        console.log('库位列表数据：', res);
        if (res.code === '0') {
          return res.data;
          this.$forceUpdate();
        }
      });
    },
    // getMaterialClassList() {
    //   // 物料分类
  	// 	materialClassList().then(res => {
		// 		if(res.code === '0') {					
		// 			this.materialClassList = res.data;
		// 		}
		// 	});
    // },
    getMaterialClassList() {
      // 生产类型
  		constDictList('CombinedMaterialClass').then(res => {
        console.log('生产类型：', res);
				if(res.code === '0') {					
					this.materialClassList = res.data;
				}
			});
    },
    getSalesSeasonList() {
      salesSeasonList().then(res => {
        console.log('销售季：', res);
        if(res.code === '0') {					
					this.salesSeasonList = res.data;
				}
      });
    },

    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // console.log(type, data, status)
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
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      switch (fieldItem.field) {
        case 'productionMaterialCode':
          console.log('生产物料编号值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.sampleUuid == item.sampleUuid) {
              getOriginCodeByMC(data.productionMaterialCode).then(res => {
                // console.log('生产物料编号请求数据：', res);
                if (res.code === '0' && res.data) {
                  // let pcArr = [];
                  // let mcArr = [];
                  // for (var m = 0; m < res.data.length; m++) {
                  //   pcArr.push(res.data[m].remarks);
                  //   mcArr.push(res.data[m].combinedMaterialCode);
                  // }
                  for (var j = 0; j < data.sampleList.length; j++) {
                    let cData = data.sampleList[j];
                    if(res.data!=''){
                       cData.sourceProductCode = res.data[j].remarks;
                       cData.sourceMaterialCode = res.data[j].combinedMaterialCode;
                    }else{
                      cData.sourceProductCode = '';
                      cData.sourceMaterialCode='';
                    }
                    // cData.sourceProductCode = pcArr.join(',');
                    // cData.sourceMaterialCode = mcArr.join(',');
                    this.$forceUpdate();
                  }
                }
              });
            }
          }
          this.editList = editListCopy;
          this.$forceUpdate();
          break;
        case 'productionQuantity':
          console.log('生产数量值改变：', val, item, fieldItem);
          if (val < 0) {
            item.productionQuantity = 0;
          }
          break;
      
        default:
          break;
      }
    },
    async selectChange(val, item, fieldItem) {
      console.log(val, item, fieldItem);
      let editListCopy = JSON.parse(JSON.stringify(this.editList));
      switch (fieldItem.field) {
        case 'outVirtualInventoryName':
          // 出库仓位
          console.log('出库仓位值改变：', val, item, fieldItem);
          item.outSubInventoryList = [];
          let outSelected = this.outInventoryList.find(i => {
            return i.index === val;
          });
          // item.outVirtualInventoryCode = outSelected.index;
          // item.outVirtualInventoryName = outSelected.name;
          let outList = []; //库位列表数据
          await subInventoryTypeList(val).then(res => {
            if (res.code === '0') {
              outList = res.data;
            }
          });
          for (var i = 0; i < editListCopy.length; i++) {
            for (var j = 0; j < editListCopy[i].sampleList.length; j++) {
              let data = editListCopy[i].sampleList[j];
              if (data.uuid == item.uuid) {
                data.outVirtualInventoryCode = outSelected.index;
                data.outVirtualInventoryName = outSelected.name;
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
          let outSelectedName = item.outSubInventoryList.find(i => {
            return i.subInventory === val;
          });
          item.outSubInventoryName = outSelectedName.subInventoryName;
          item.outSubInventoryCode = val;
          break;
        case 'inVirtualInventoryName':
          // 入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          item.inSubInventoryList = [];
          let inSelected = this.inInventoryList.find(i => {
            return i.index === val;
          });
          // item.inVirtualInventoryName = inSelected.name;
          // item.inVirtualInventoryCode = inSelected.index;
          let inList = []; //库位列表数据
          await subInventoryTypeList(val).then(res => {
            if (res.code === '0') {
              inList = res.data;
            }
          });
          item.inVirtualInventoryName = inSelected.name;
          item.inVirtualInventoryCode = inSelected.index;
          item.inSubInventoryName = '';
          item.inSubInventoryList = inList;

          // for (var i = 0; i < editListCopy.length; i++) {
          //   for (var j = 0; j < editListCopy[i].sampleList.length; j++) {
          //     let data = editListCopy[i].sampleList[j];
          //     if (data.uuid == item.uuid) {
          //       data.inVirtualInventoryName = inSelected.name;
          //       data.inVirtualInventoryCode = inSelected.index;
          //       data.inSubInventoryName = '';
          //       data.inSubInventoryList = inList;
          //     }
          //   }
          // }
          // this.editList = editListCopy;
          this.$forceUpdate();
          break;
        case 'inSubInventoryName':
          // 入库库位
          console.log('入库库位值改变：', val, item, fieldItem);
          let inSelectedName = item.inSubInventoryList.find(i => {
            return i.subInventory === val;
          });
          item.inSubInventoryName = inSelectedName.subInventoryName;
          item.inSubInventoryCode = val;
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
          await subInventoryTypeList(item.outVirtualInventoryCode).then(res => {
            if (res.code === '0') {
              outList = res.data;
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

          // subInventoryTypeList(item.outVirtualInventoryCode).then(res => {
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
          await subInventoryTypeList(item.inVirtualInventoryCode).then(res => {
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

          // subInventoryTypeList(item.inVirtualInventoryCode).then(res => {
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
      switch (fieldItem.field) {
        case 'packetNumber':
          // 计划预留数量
          console.log('计划预留数量值改变：', val, item, fieldItem);
          break;
        case 'shippmentMeter':
          // 在途
          console.log('在途值改变：', val, item, fieldItem);
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          break;
        case 'producedMeter':
          // 成品
          console.log('成品值改变：', val, item, fieldItem);
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          break;
        case 'producingMeter':
          // 在产
          console.log('在产值改变：', val, item, fieldItem);
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
          break;
        case 'requestedMeter':
          // 询单
          console.log('询单值改变：', val, item, fieldItem);
          // if (this.editItemStatus == 'Draft' || item.isAdd) {
          //   item.planReserveMeter = item.shippmentMeter + item.producedMeter + item.producingMeter + item.requestedMeter;
          // }
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

.productionOrder {
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
        right: 2%;
      }
      ul {
        &.childcontentlist {
          border-bottom: none;
        }
      }
      // .edit_btn_wrap {
      //   margin-top: 20px;
      //   margin-bottom: 20px;
      // }
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
.table_part, .popup_part {
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
  .empty_wrap {
    padding: 20px 0;
    text-align: center;
  }
}

.subnav_wrap .el-checkbox {
  white-space: nowrap;
}

// i.el-icon-view {
//   font-size: 20px;
//   color: #409eff;
//   margin-left: 10px;
//   cursor: pointer;
// }

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
.productionOrder .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.productionOrder .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.productionOrder .subnav_wrap .el-tabs__content {
  overflow: visible;
}
.productionOrder .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.productionOrder .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.productionOrder .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
</style>