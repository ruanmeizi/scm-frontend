<template>
  <div class="container decisionReserved">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">预留类型：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="reserveType"
              placeholder="请选择"
              @change="searchHandle"
            >
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
            <span class="tag">创建日期：</span>
            <el-date-picker
              class="mr10"
              :title="valuedata"
              v-model="valuedata"
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateValChange"
            ></el-date-picker>
          </div>
          <div class="display_ib mr10">
            <span class="tag">客户名称：</span>
            <el-select
              class="select_single w200 mr10 mb10"
              v-model="customerValue"
              filterable
              placeholder="请选择"
              @change="searchHandle"
            >
              <el-option key label="请选择" value></el-option>
              <el-option
                v-for="item in customerList"
                :key="item.customerId"
                :label="item.customerNameCh"
                :value="item.customerId"
              ></el-option>
            </el-select>
          </div>
          <div class="display_ib mr10">
            <span class="tag">预留状态：</span>
            <el-select
              class="select_single w200 mr10 mb10"
              v-model="reserveStatusName"
              placeholder="请选择"
              @change="searchHandle"
            >
              <el-option key label="请选择" value></el-option>
              <el-option
                v-for="item in ReserveReleaselist"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
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

      <!-- <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-model.trim="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.index"
            :label="item.name"
            :name="item.index">
            <Table
              :tableList="requestList"
              :parentData="parentData"
              :childData="childData"
              :tableFieldsList="allFieldList"
              :tableParentFieldsList="parentFieldsList"
              :tableLoading="tableLoading"
              @editHandle="editHandle"
              @submitHandle="draftoutsave"
              @removeHandle="draftoutdel"
              @deleteHandle="factorydel"
              @factorychildupd="factorychildupd"
            ></Table>
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
      </div>-->

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap hidden" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          >
            <el-table
              class="table_list"
              ref="multipleTable"
              v-loading="listLoading"
              :data="requestList"
              row-key="id"
              :expand-row-keys="expands"
              @row-click="rowClick"
              border
              fit
              stripe
              @select="selectHandle"
              @expand-change="expandChange"
              @select-all="selectAllHandle"
            >
              <!-- <el-table-column type="selection" /> -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="actions_wrap mb20 clearfix">
                    <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                    <el-button v-if="scope.row.auditStatus == 'Draft' || scope.row.auditStatus =='Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                  </div>
                  <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    :data="scope.row.reserveItemList"
                    border
                    fit
                    @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                    @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }"
                  >
                    <!-- <el-table-column fixed type="selection" /> -->
                    <!-- <el-table-column fixed label="行号">
                        <template slot-scope="{ row }">
                          {{ row.sn }}
                        </template>
                    </el-table-column> -->
                    <el-table-column fixed label="行号">
                      <template slot-scope="{ row }">{{ row.sn }}</template>
                    </el-table-column>
                    <el-table-column fixed label="产品编号">
                      <template slot-scope="{ row }">{{ row.productCode }}</template>
                    </el-table-column>
                    <el-table-column label="物料编号">
                      <template slot-scope="{ row }">{{ row.materialCode }}</template>
                    </el-table-column>
                    <el-table-column label="预留库位">
                      <template slot-scope="{ row }">{{ row.subInventoryName }}</template>
                    </el-table-column>
                    <el-table-column label="预留时间">
                      <template
                        slot-scope="{ row }"
                      >{{ row.reserveBeginTime }}—{{row.reserveEndTime}}</template>
                    </el-table-column>
                    <el-table-column label="预留状态">
                      <template slot-scope="{ row }">
                        <div id v-if="scope.row.auditStatus=='Approved'">
                          <em title="预留" v-if="row.reserveStatus=='Reserve'">预留</em>
                          <em title="解除" v-if="row.reserveStatus=='Release'">解除</em>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="内部批次号">
                      <template slot-scope="{ row }">{{ row.batchNo}}</template>
                    </el-table-column>
                    <el-table-column label="预留总量">
                      <template slot-scope="{ row }">{{ row.reserveInitQuantity}}</template>
                    </el-table-column>
                    <el-table-column label="剩余预留数量">
                      <template slot-scope="{ row }">
                        <span
                          v-if="row.purchaseMeasurementUnit!=null&&row.purchaseMeasurementUnit!=''"
                        >{{ (row.reserveQuantity ? row.reserveQuantity : 0)}}{{row.purchaseMeasurementUnit}}</span>
                        <span
                          v-else
                        >{{ (row.reserveQuantity ? row.reserveQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注">
                      <template slot-scope="{ row }">{{ row.remark}}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{ row }">
                        <div id v-if="scope.row.auditStatus=='Approved'">
                          <el-button
                            class="el-icon-close"
                            type="primary"
                            circle
                            size="mini"
                            title="解除"
                            v-if="row.reserveStatus == 'Reserve'"
                            @click="factorychildupd(row,scope.row)"
                          ></el-button>
                          <!-- <el-button v-if="row.reserveStatus == 'Reserve'" class="el-icon-close" type="primary" circle size="mini" title="整单解除" @click.stop="removeHandle($index, row)"></el-button> -->
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="预留单号">
                <template slot-scope="{ row }">{{ row.reserveId }}</template>
              </el-table-column>
              <el-table-column label="预留类型">
                <template slot-scope="{ row }">{{ row.reserveTypeName}}</template>
              </el-table-column>
              <el-table-column label="业务编号">
                <template slot-scope="{ row }">{{ row.saleOrderId}}</template>
              </el-table-column>
              <el-table-column label="客户名称">
                <template slot-scope="{ row }">{{ row.customerName}}</template>
              </el-table-column>
              <el-table-column label="仓位">
                <template slot-scope="{ row }">{{ row.reserveInventoryName}}</template>
              </el-table-column>
              <el-table-column label="创建时间">
                <template slot-scope="{ row }">{{ row.createTime }}</template>
              </el-table-column>
              <el-table-column label="申请人">
                <template slot-scope="{ row }">{{ row.applicantName }}</template>
              </el-table-column>
              <el-table-column label="审批">
                <template slot-scope="{ row, $index }">
                  <el-popover
                    placement="right"
                    width="300"
                    trigger="hover"
                    @show="checkApprovalProcess(row, $index)"
                  >
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
                    <el-tag
                      slot="reference"
                      class="pointer"
                      :type="row.auditStatus | statusFilter"
                    >{{ actionsTypeHandle(row.auditStatus) }}</el-tag>
                  </el-popover>
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <div v-if="row.auditStatus == 'Draft' || row.auditStatus =='Rejected'">
                    <el-button
                      class="el-icon-edit"
                      type="primary"
                      circle
                      size="mini"
                      title="编辑"
                      @click.stop="editHandle($index, row)"
                    ></el-button>
                    <el-button
                      class="el-icon-check"
                      type="success"
                      circle
                      size="mini"
                      title="提交审批"
                      @click.stop="draftoutsave($index, row)"
                    ></el-button>
                    <el-button
                      class="el-icon-delete"
                      type="danger"
                      circle
                      size="mini"
                      title="删除"
                      @click.stop="factorydel($index, row)"
                    ></el-button>
                  </div>
                  <div v-if="row.auditStatus =='Approved'" class="ending">
                    <!-- <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button> -->
                    <el-button
                      class="el-icon-close"
                      v-if="row.reservetag==true"
                      type="primary"
                      circle
                      size="mini"
                      title="整单解除1"
                      :disabled="isDisabled"
                      @click.stop="draftoutdel($index, row)"
                    ></el-button>
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
    <div class="edit_part" v-if="isShowEdit">
      <div class="clearfix mb10">
        <div class="display_ib mr10">
          <span class="tag">
            <span class="red mr5">*</span>预留类型：
          </span>
          <el-select
            class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model.trim="purchaseobj.reserveType"
            placeholder="请选择"
            @change="reserveTypeChange"
          >
            <el-option key label="请选择" value></el-option>
            <el-option
              v-for="item in reserveTypeList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemValue"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="tag">
            <span class="red mr5">*</span>预留仓位：
          </span>
          <el-select
            class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model.trim="purchaseobj.reserveInventory"
            placeholder="请选择"
            @change="selectwearclick"
          >
            <el-option key label="请选择" value></el-option>
            <el-option
              v-for="item in warehouseList"
              :key="item.index"
              :label="item.name"
              :value="item.index"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10" v-if="isShowSaleOrderId">
          <span class="tag">
            <span v-if="!isNotRequiredSOI" class="red mr5">*</span>业务编号：
          </span>
          <el-input
            class="input_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model.trim="purchaseobj.saleOrderId"
            placeholder="请输入"
          ></el-input>
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
        <div v-if="isShowCustomerName" class="display_ib mr10">
          <span class="tag">客户名称：</span>
          <el-select
            class="select_single w200 mr10 mb10"
            :disabled="!isEmptyData"
            v-model.trim="purchaseobj.customerName"
            placeholder="请选择"
            @change="customerNameSelect"
          >
            <el-option key label="请选择" value></el-option>
            <el-option
              v-for="item in customerList"
              :key="item.customerId"
              :label="item.customerNameCh"
              :value="item.customerId"
            ></el-option>
          </el-select>
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
          :tableList="purchaseobj.reserveItemList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          :startPickerOptions="startPickerOptions"
          :endPickerOptions="endPickerOptions"
          @deleteHandle="deleteEditItemHandle"
          @inputChange="inputChange"
          @selectChange="selectChange"
        ></editTable>

        <div class="edit_btn_wrap mt20 fr">
          <el-button @click="cancelEditHandle">取消</el-button>
          <el-button
            type="primary"
            v-preventReClick
            :disabled="ifchildshow!=true"
            @click="draftsave('sv')"
          >保存</el-button>
          <el-button
            type="primary"
            v-preventReClick
            :disabled="ifchildshow!=true"
            @click="draftsave('com')"
          >提交审批</el-button>
        </div>
      </div>
    </div>

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="dialogdelVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>确定删除该条申请数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible=false">取 消</el-button>
        <el-button type="primary" :disabled="isPopDeleteDisabled" @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>

    <!--外侧提交审批-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="dialogcommitVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>是否确认提交审批?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogcommitVisible=false">取 消</el-button>
        <el-button type="primary" :disabled="isPopSubmitDisabled" @click="delVisibcmtclick()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  purchasegetuuid,
  purchaseOrderList,
  subinventoryquesttype,
  purchasegetdata,
  purchasegetInventory,
  purchasechildadd,
  purchasechildupd,
  purchasegetview,
  purchasegetdel,
  purchasechildoutadd,
  purchasegetalldel,
  purchasegetallchilddel,
  getmaterialCode,
  getapprovalOpinions,
  getmaterialCodeUnit,
  pullToolProductionList,
  pullClothProductionList
} from "@/api/module/decisionReservedApi.js";
import { getUUID, dictList, getCustomerList, approvalProcessInfo } from "@/api/publicApi.js";
import { warehousequesttype ,fabrictypedictionaries} from "@/api/module/dictionariesApi.js";
import { timeFormat, timeFormatGMT, getTimeRange } from "@/utils/index.js";
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "decisionReserved",
  props: [],
  data() {
    return {
      // Tabble组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: false,
      expands:[],

      // NEW TBALE
      selectUuidList: [],

      // New
      editType: '',
      isShowEdit: false,
      isEmptyData: false,
      isShowSaleOrderId: false, // 是否显示业务编号
      isShowCustomerName: false, // 是否显示客户名称
      isNotRequiredSOI: false, // 是否显示客户名称
      isSaveDisabled: false,
      isSubmitDisabled: false,

      tableLoading: true,
      ifshowlist: false,
      loadingsave: false,
      loadingcommit: false,
      ifpulldate: false,
      dialogdelVisible: false,
      dialogcommitVisible: false,
      ifchildshow: false,
      purchasetagtype: false, //判断是否是客订来展示销售编号
      notpulldata: true, //是否可以拉取数据
      dialogdelVisible: false,
      dialogcommitVisible: false,
      ifshowview: false,
      iftagupd: false, //是否是修改
      nullboolean: true,
      greaterthan: true,
      showdata: false,
      approvallist: [],
      committag: "",
      delid: "",
      updid: "",
      activeName: "",
      prStatus: "",
      orderCode: "",
      materialCode: "",
      reserveType: "",
      reserveInventory: "",
      reserveId: "",
      saleOrderId: "",
      valuedata: "",
      startTime: "",
      endTime: "",
      customerId: "",
      orderStatus: "",
      purchaseOrderId: "",
      purchasetypeidname: "",
      customerName: "",
      lastTimeStamp: "",
      uuid: "",
      submittag: "",
      reserveInventoryName: "",
      isPopDeleteDisabled: false,
      isPopSubmitDisabled: false,
      customerValue:'',
      reserveStatusName:'',
      ReserveReleaselist:[],
      isDisable:false,
      purchaseobj: {
        uuid: "",
        reserveType: "",
        reserveTypeName: "",
        submitType: "",
        purchaseTypeName: "",
        reserveInventory: "",
        saleOrderId: "",
        customerName: "",
        applicant: this.$store.getters.getUserName,
        applicantDepartment: this.$store.getters.getdepartmentId,
        applicantName: this.$store.state.realName,
        applicantDepartmentName: "",
        reserveItemList: []
      },
      orderList: [],
      requestList: [],
      reserveTypeList: [],
      customerList: [],
      warehouseList: [],
      subinventoryList: [],
      outtype: {},
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      // subNavList: [
      //   {
      //     index: "1",
      //     name: "全部预留请求"
      //   },
      //   {
      //     index: "2",
      //     name: "草稿"
      //   },
      //   {
      //     index: "3",
      //     name: "审批中"
      //   },
      //   {
      //     index: "4",
      //     name: "已通过"
      //   },
      //   {
      //     index: "5",
      //     name: "已驳回"
      //   },
      //   {
      //     index: "6",
      //     name: "已终止"
      //   }
      // ],
      subNavList: [
        {
          label: "全部预留请求",
          value: ""
        },
        {
          label: "草稿",
          value: "Draft"
        },
        {
          label: "审批中",
          value: "Approving"
        },
        {
          label: "已通过",
          value: "Approved"
        },
        {
          label: "已驳回",
          value: "Rejected"
        },
        // {
        //   label: "已终止",
        //   value: "Terminated"
        // }
      ],
      parentData: {
        status: "",
        data: [
          {
            name: "创建时间",
            field: "createTime",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "申请人",
            field: "applicantName",
            class: "w4p",
            isShowTit: true
          },
          {
            name: "预留单号",
            field: "reserveId",
            class: "w12p",
            isShowTit: true
          },
          {
            name: "预留类型",
            field: "reserveTypeName",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "业务编号",
            field: "saleOrderId",
            class: "w12p",
            isShowTit: true,
            isFilterField: true
          },
          {
            name: "客户名称",
            field: "customerName",
            class: "w8p",
            isShowTit: true,
            isFilterField: true
          },
          {
            name: "仓位",
            field: "reserveInventoryName",
            class: "w5p",
            isShowTit: true
          },
          {
            name: "审批",
            field: "",
            class: "",
            isShowTit: false,
            isPopover: true
          },
          {
            name: "",
            field: "",
            class: "fr mr15",
            isShowTit: false,
            isUpDown: true
          },
          {
            name: "",
            field: "",
            class: "fr",
            isShowTit: false,
            isAction: true
          }
        ]
      },
      childData: {
        name: "reserveItemList",
        data: [
          {
            name: "",
            field: "productCode",
            class: "w13p"
          },
          // {
          //   name: "",
          //   field: "productId",
          //   class: "w13p"
          // },
          {
            name: "",
            field: "materialCode",
            class: "w13p"
          },
          // {
          //   name: "",
          //   field: "materialId",
          //   class: "w13p"
          // },
          {
            name: "",
            field: "reserveQuantity",
            field_unit: "purchaseMeasurementUnit",
            class: "w13p",
            isQuantityField: true
          },
          {
            name: "",
            field_1: "reserveBeginTime",
            field_2: "reserveEndTime",
            class: "w18p",
            isTime: true
          },
          {
            name: "",
            field: "subInventoryName",
            class: "w18p"
          },
          {
            name: "",
            field: "",
            class: "w13p",
            isReserve: true
          },
          {
            name: "",
            field: "remark",
            class: "w13p"
          },
          {
            name: "",
            field: "",
            class: "w13p",
            isReserveBtn: true
          }
        ]
      },
      allFieldList: [
        {
          name: "产品编号",
          class: "w13p"
        },
        // {
        //   name: "产品系统编号",
        //   class: "w13p"
        // },
        {
          name: "物料编号",
          class: "w13p"
        },
        // {
        //   name: "物料系统编号",
        //   class: "w13p"
        // },
        {
          name: "预留数量",
          class: "w13p"
        },
        {
          name: "预留时间",
          class: "w18p"
        },
        {
          name: "库位",
          class: "w13p"
        },
        {
          name: "预留状态",
          class: "w13p"
        },
        {
          name: "备注",
          class: "w13p"
        },
        {
          name: "",
          class: "w13p"
        }
      ],
      parentFieldsList: [
        // Table父列表表头
        {
          name: "预留单号",
          class: "w12p"
        },
        {
          name: "预留类型",
          class: "w8p"
        },
        {
          name: "业务编号",
          class: "w12p"
        },
        {
          name: "客户名称",
          class: "w8p"
        },
        {
          name: "仓位",
          class: "w5p"
        },
        {
          name: "创建时间",
          class: "w8p"
        },
        {
          name: "申请人",
          class: "w4p"
        },
        {
          name: "审批",
          class: ""
        }
      ],
      // 编辑组件数据
      editFieldsList: [
        {
          name: "* 物料编号",
          field: "materialCode",
          class: "w10p",
          width: "150",
          isRules: true
        },
        // {
        //   name: '* 产品编号',
        //   field: 'productCode',
        //   class: 'w16p',
        //   width: '150',
        //   isRules: true
        // },
        {
          name: "* 剩余预留数量",
          field: "reserveQuantity",
          field_unit: "purchaseMeasurementUnit",
          class: "w13p",
          width: "150",
          isRules: true
        },
        {
          name: "* 在库可用库存",
          field: "availableInventory",
          field_unit: "purchaseMeasurementUnit",
          class: "w13p",
          width: "150",
          isRules: true,
          isQuantityField: true
        },
        {
          name: "* 预留库位",
          field: "reserveSubInventory",
          class: "w18p",
          width: "150",
          isRules: true
        },
        {
          name: "* 预留时间",
          field_1: "reserveBeginTime",
          field_2: "reserveEndTime",
          startPickerOptions: "startPickerOptions",
          endPickerOptions: "endPickerOptions",
          field_1_disabled: true,
          field_2_disabled: false,
          class: "w16p",
          width: "400"
        },
        {
          name: "内部批次号",
          field: "batchNo",
          class: "w18p",
          width: "200"
        },
        {
          name: "备注",
          field: "remark",
          class: "w16p",
          width: "150"
        }
      ],
      leaderFieldsList: [
        // {
        //   name: '物料编号',
        //   field: 'materialCode',
        //   class: 'w10p',
        //   width: '150',
        //   isRules: true
        // }

        {
          name: "行号",
          field: "sn",
          class: "w16p",
          width: "50"
        },
        {
          name: "* 产品编号",
          field: "productCode",
          class: "w16p",
          width: "150",
          isRules: true
        }
      ],
      tailFieldsList: [
        {
          name: "操作",
          field: "",
          class: "",
          width: "100",
          isAction: true,
          hasDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        sn: true,
        materialCode: true,
        availableInventory: true
      },
      inputSet: {
        productCode: {
          maxlength: "10",
          placeholder: ""
        },
        batchNo: {
          maxlength: "255",
          placeholder: ""
        },
        remark: {
          maxlength: "127",
          placeholder: ""
        }
      },
      selectSet: {
        reserveSubInventory: {
          selectListName: "subinventoryList",
          value: "subInventory",
          label: "subInventoryName"
        }
      },
      numberInputSet: {
        reserveQuantity: true
      },
      datePickerSet: {},
      datePickerDoubleSet: {
        reserveBeginTime: true
      },
      
      childHeaderList: ['预留单号', '行号', '产品编号', '物料编号', '预留数量', '预留库位', '预留时间', '预留状态', '内部批次号', '备注'],
      childFieldsList: ['reserveId', 'sn', 'productCode', 'materialCode', 'reserveQuantity', 'subInventoryName', 'reserveTime', 'reserveStatusName', 'batchNo', 'remark'],

    };
  },
  components: {
    Table,
    editTable,
    UploadExcelComponent
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.orderStatus = "1";
    // this.getPurchaseOrderList();
    this.fun_date();
    this.getReserveTypeListHandle();
    this.getVirtualInventory();
    this.getCustomerListHandle();
    this.getReserveReleaseStatus();
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
      if (!this.purchaseobj.reserveType) {
        this.$message({
          type: "error",
          message: "请选择请求类型！"
        });
        return false;
      }
      if (!this.purchaseobj.reserveInventory) {
        this.$message({
          type: "error",
          message: "请选择预留仓位！"
        });
        return false;
      }
      if (!this.isNotRequiredSOI) {
        if (!this.purchaseobj.saleOrderId) {
          this.$message({
            type: "error",
            message: "请输入业务编号！"
          });
          return false;
        }
      }
      if (this.purchaseobj.reserveTypeName.slice(0, 2) == "客订") {
        if (!this.purchaseobj.saleOrderId && !this.purchaseobj.customerName) {
          this.$message({
            type: "error",
            message: "业务编号和客户名称须至少一个不能为空！"
          });
          return false;
        }
      }
      this.ifchildshow = true;
      if (results && results.length) {
        let editData = {};
        if (this.isEmptyData) {
          // 空数据
          editData = JSON.parse(JSON.stringify(this.purchaseobj));
          await getUUID().then(res => {
            if (res.code === '0') {
              editData.uuid = res.data;
            }
          });
          this.updateEditModeSet('add', editData);
          this.isEmptyData = false;
        } else {
          editData = JSON.parse(JSON.stringify(this.purchaseobj));
          editData.reserveItemList = [];
        }

        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let date = new Date();
          let beginTime = timeFormatGMT(date, 'yyyy-MM-dd HH:mm:ss');
          let editItemData = {
            uuid: '',
            reserveQuantity: '',
            availableInventory: '',
            reserveSubInventory: '',
            productCode: '',
            remark: '',
            reserveBeginTime: beginTime,
            reserveEndTime: '',
            subinventoryList: [],
            subInventoryName: '',
            purchaseMeasurementUnit: '',
            endPickerOptions: {},
            valuedata: ''
          };
          editData.endPickerOptions = {
            disabledDate(time) {
              return time.getTime() < new Date(editData.reserveBeginTime).getTime();
            }
          };
          editItemData.subinventoryList = this.subinventoryList;
          await getUUID().then(res => {
            if (res.code === '0') {
              editItemData.uuid = res.data;
            }
          });
          this.updateEditModeSet('add', editItemData);
          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '预留单号') {
              editItemData.reserveId = item[key];
            } else if (key === '行号') {
              editItemData.sn = item[key];
            } else if (key === '产品编号') {
              editItemData.productCode = item[key];
            } else if (key === '物料编号') {
              editItemData.materialCode = item[key];
            } else if (key === '预留数量') {
              editItemData.reserveQuantity = item[key];
            } else if (key === '预留库位') {
              let subInventoryData = this.subinventoryList.find(x => {
                return x.subInventoryName === item[key];
              });
              editItemData.reserveSubInventory = subInventoryData ? subInventoryData.subInventory : '';
              editItemData.subInventoryName = item[key];  // 预留库位
            } else if (key === '预留时间') {
              editItemData.reserveBeginTime = item[key].split('——')[0];
              editItemData.reserveEndTime = item[key].split('——')[1];
            } else if (key === '预留状态') {
              editItemData.reserveStatusName = item[key];
            } else if (key === '内部批次号') {
              editItemData.batchNo = item[key];
            } else if (key === '备注') {
              editItemData.remark = item[key];
            }
          });
          editData.reserveItemList.push(editItemData);
        }

        for (let i = 0; i < editData.reserveItemList.length; i++) {
          let item = editData.reserveItemList[i];
          this.getAvailableInventoryHandle(item, i);
        }
        this.purchaseobj = editData;
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },
    async getAvailableInventoryHandle(item, index) {
      let params = {
        materialCode: item.materialCode,
        inventory: this.purchaseobj.reserveInventory,
        subInventory: item.reserveSubInventory
      };
      await purchasegetInventory(params).then(res => {
        if (res.code === '0') {
          console.log(res.data);
          item.availableInventory = Number(res.data) < 0 ? 0 : res.data;
          this.$set(this.purchaseobj.reserveItemList, index, item);
          this.$forceUpdate();
        }
      });
    },

    excelDownload() {
      let headerList = [];
      let fieldsList = [
        "reserveId",
        "reserveTypeName",
        "saleOrderId",
        "customerName",
        "reserveInventoryName",
        "createTime",
        "applicantName",
        "auditStatusName"
      ];
      this.parentFieldsList.forEach(hItem => {
        headerList.push(hItem.name);
      });
      import("@/vendor/Export2Excel").then(excel => {
        const list = this.requestList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: "预留",
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import("@/vendor/Export2Excel").then(excel => {
        const list = item.reserveItemList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.reserveId,
          autoWidth: true,
          bookType: "xlsx"
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // 固定展示为两周前的时间范围
    fun_date() {
      console.log(getTimeRange(-14)); //两周前的日期
      this.valuedata = getTimeRange(-14);
      this.searchHandle();
    },
    checkApprovalProcess(item, index) {
      approvalProcessInfo(item.uuid).then(res => {
        console.log("审批流程：", res);
        if (res.code === "0") {
          let data = res.data[res.data.length - 1];
          if (data == undefined) {
            item.fullName = "";
            item.approvalTime = "";
            item.content = "";
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
    selectAllHandle(selection) {
      // 父项全选事件
      console.log("触发全选事件：", selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
          for (let j = 0; j < item.reserveItemList.length; j++) {
            let cItem = item.reserveItemList[j];
            this.childMultipleSelection.push(cItem);
            this.$nextTick(() => {
              if (this.$refs["childMultipleTable_" + item.id] && this.$refs["childMultipleTable_" + item.id].length) {
                this.$refs["childMultipleTable_" + item.id][0].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
        for (let i = 0; i < this.requestList.length; i++) {
          let item = this.requestList[i];
          for (let j = 0; j < item.reserveItemList.length; j++) {
            let cItem = item.reserveItemList[j];
            this.$nextTick(() => {
              if (this.$refs["childMultipleTable_" + item.id] && this.$refs["childMultipleTable_" + item.id].length) {
                this.$refs["childMultipleTable_" + item.id][0].toggleRowSelection(cItem, false);
              }
            });
          }
        }
      }
    },
    async selectHandle(selection, row) {
      /**
       * selection 选中数据组
       * row 当前选中数据
       */

      console.log("当用户手动勾选数据行的 Checkbox 时触发事件：", selection, row);
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
        console.log(_row.id);
        console.log(this.$refs["childMultipleTable_" + _row.id]);
        if (this.selectUuidList.indexOf(_row.uuid) > -1) {
          //           当前项选中状态
          for (let i = 0; i < _row.reserveItemList.length; i++) {
            let cItem = _row.reserveItemList[i];
            console.log(this.$refs["childMultipleTable_" + _row.id]);
            console.log(this.$refs["childMultipleTable_" + _row.id].length);
            this.$nextTick(() => {
              if (this.$refs["childMultipleTable_" + _row.id] && this.$refs["childMultipleTable_" + _row.id].length) {
                console.log("Jinru");
                this.$refs["childMultipleTable_" + _row.id][0].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.reserveItemList.length; i++) {
            let cItem = _row.reserveItemList[i];
            this.$nextTick(() => {
              if (this.$refs["childMultipleTable_" + _row.id] && this.$refs["childMultipleTable_" + _row.id].length) {
                this.$refs["childMultipleTable_" + _row.id][0].toggleRowSelection(cItem, false);
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
          this.$refs["childMultipleTable_" + _row.id][0].clearSelection();
        }
      }
    },
    expandChange(row, rowList) {
      console.log("树形展开项：", row, rowList);
      console.log(this.selectUuidList.indexOf(row.uuid));
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.reserveItemList.length; i++) {
          let cItem = row.reserveItemList[i];
          console.log(this.$refs["childMultipleTable_" + row.id]);
          this.$nextTick(() => {
            if (this.$refs["childMultipleTable_" + row.id].length) {
              this.$refs["childMultipleTable_" + row.id][0].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    async childSelectHandle(selection, row, parentRow) {
      // 选择子项
      // console.log('选择子项：', selection, row, parentRow);
      await this.$nextTick();
      // this.childMultipleSelection = selection;
      if (selection.length === parentRow.reserveItemList.length) {
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
    getmaterialunit(item) {
      console.log(item);
      getmaterialCodeUnit(item.materialCode).then(response => {
        if (response.code === "0") {
          item.purchaseMeasurementUnit = response.data;
          this.$forceUpdate();
        }
      });
    },
    onkeyup(e, item) {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
      item.productCode = e.target.value;
    },
    cancelEditHandle() {
      this.isShowEdit = false;

      this.notpulldata = true;
      this.savetype = "";
      this.saleOrderId = "";
      this.customerName = "";
      this.committype = "";
      this.ifchildshow = false;
      this.purchaseobj = {
        uuid: "",
        reserveType: "",
        reserveTypeName: "",
        submitType: "",
        purchaseTypeName: "",
        reserveInventory: "",
        saleOrderId: "",
        customerName: "",
        reserveItemList: []
      };
    },
    //预留仓位
    getVirtualInventory() {
      warehousequesttype().then(response => {
        console.log("请求类型：", response);
        if (response.code === "0") {
          this.warehouseList = response.data;
        }
      });
    },
    // 预留类型
    getReserveTypeListHandle() {
      dictList("ReservedType").then(res => {
        console.log("预留类型列表：", res);
        if (res.code === "0") {
          this.reserveTypeList = res.data;
        }
      });
    },
    // 客户名称
    getCustomerListHandle() {
      getCustomerList().then(res => {
        console.log("客户名称列表", res);
        if (res.code === "0") {
          this.customerList = res.data;
        }
      });
    },
    //分页列表展开
    showlist(index, item, list) {
      console.log(index, item);
      //		if(list!=undefined){
      //			this.requistionlist=[];
      item.ifshowlist = !item.ifshowlist;
      //		    this.requistionlist=list;
      this.$forceUpdate();
      //		}else{
      //			item.ifshowlist=!item.ifshowlist;
      //		}
      this.$forceUpdate();
    },
    //外侧删除
    factorydel(index, item) {
      this.ifshow = true;
      this.ifshowview = false;
      this.dialogdelVisible = true;
      this.isPopDeleteDisabled = false;
      this.delid = item.id;
    },
    //删除确定
    delVisibleclick() {
      this.isPopDeleteDisabled = true;
      purchasegetdel(this.delid).then(response => {
        if (response.code === "0") {
          this.dialogdelVisible = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.saleOrderId = "";
          this.getPurchaseOrderList();
        }
        this.isPopDeleteDisabled = false;
      });
    },
    // 外侧编辑
    editHandle(index, item) {
      console.log("编辑项：", item);
      this.editType = 'edit';
      this.isShowEdit = true;
      this.isEmptyData = false;
      if (item.reserveTypeName) {
        this.fieldsByReserveType(item.reserveTypeName);
      }

      this.ifchildshow = true;
      this.iftagupd = true;
      this.ifpulldate = false;
      this.purchasetagtype = false;
      this.updid = item.id;
      purchasegetview(item.id).then(response => {
        if (response.code === "0") {
          this.purchaseobj.reserveInventory = response.data.reserveInventory;
          this.purchaseobj.reserveType = response.data.reserveType;
          this.purchaseobj.customerName = response.data.customerName;
          this.purchaseobj.reserveType = response.data.reserveType;
          this.purchaseobj.customerName = response.data.customerName;
          this.purchaseobj.saleOrderId = response.data.saleOrderId;
          this.purchaseobj.uuid = response.data.uuid;
          this.purchaseobj.applicant = this.$store.getters.getUserName;
          this.purchaseobj.applicantDepartment = this.$store.getters.getdepartmentId;
          this.purchaseobj.applicantName = this.$store.state.realName;
          this.purchaseobj.applicantDepartmentName = this.$store.state.departments[0].name;
          this.saleOrderId = response.data.saleOrderId;
          for (var j = 0; j < this.reserveTypeList.length; j++) {
            let data = this.reserveTypeList[j];
            if (this.purchaseobj.reserveType == data.dictItemValue) {
              var tagName = data.dictItemName;
              this.purchasetypeidname = tagName.slice(0, 2);
            }
          }
          for (var i = 0; i < response.data.reserveItemList.length; i++) {
            let item = response.data.reserveItemList[i];
            item.reserveBeginTime = timeFormat(item.reserveBeginTime);
            item.reserveEndTime = timeFormat(item.reserveEndTime);
            item.valuedata = [item.reserveBeginTime, item.reserveEndTime];
            item.subinventoryList = this.subinventoryList;
            item.endPickerOptions = {
              disabledDate(time) {
                return time.getTime() < new Date(item.reserveBeginTime).getTime();
              }
            };
            this.updateEditModeSet("edit", item);
          }
          this.purchaseobj.reserveItemList = response.data.reserveItemList;
          console.log("编辑数据：", this.purchaseobj);
          if (this.purchasetypeidname == "客订") {
            this.purchasetagtype = true;
            this.notpulldata = false;
            this.$forceUpdate();
          }
          console.log(this.purchaseobj.reserveItemList);
          this.selectwearclick();
        }
      });
    },
    // 外侧提交审批
    draftoutsave(index, item) {
      console.log(item);
      this.dialogcommitVisible = true;
      this.isPopSubmitDisabled = false;
      if (item.auditStatus == "Draft") {
        this.submittag = 2;
      } else if (item.auditStatus == "Rejected") {
        this.submittag = 4;
      }
      let obj = {
        uuid: item.uuid,
        auditStatus: "Approving",
        reserveId: item.reserveId,
        applicant: this.$store.getters.getUserName,
        applicantDepartment: this.$store.getters.getdepartmentId,
        submitType: this.submittag
      };
      this.outtype = obj;
      console.log(this.outtype);
    },
    // 提交审批确定
    delVisibcmtclick() {
      console.log(this.outtype);
      this.isPopSubmitDisabled = true;
      purchasechildoutadd(this.outtype).then(response => {
        if (response.code === "0") {
          this.dialogcommitVisible = false;
          this.isShowEdit = false;
          this.$message({
            message: "提交成功！！",
            type: "success"
          });
          this.saleOrderId = "";
          this.prStatus = "Approving";
          this.activeName = "Approving";
          this.getPurchaseOrderList();
        }
        this.isPopSubmitDisabled = false;
      });
    },
    // 外侧整单解除
    draftoutdel(index, item) {
      this.isDisable=true
      setTimeout(()=>{
           this.isDisable=false   //点击一次时隔两秒后才能再次点击
      },2000)
      let obj = {
        uuid: item.uuid
      };
      purchasegetalldel(obj).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "整单解除成功！！",
            type: "success"
          });
          this.getPurchaseOrderList();
        }
      });
    },
    // 子项解除
    factorychildupd(childitem, item) {
      let obj = {
        customerName: item.customerName,
        uuid: childitem.uuid,
        reserveId: item.reserveId,
        reserveInventory: item.reserveInventory
      };
      purchasegetallchilddel(obj).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "子项解除成功！",
            type: "success"
          });
          this.getPurchaseOrderList();
        }
      });
    },
    //审批流程
    lookauditPerson(item) {
      getapprovalOpinions(item.uuid).then(response => {
        if (response.code === "0") {
          this.approvallist = response.data[response.data.length - 1];
          console.log(this.approvallist);
          if (this.approvallist == undefined) {
            item.fullName = "";
            item.approvalTime = "";
            item.content = "";
          } else {
            item.fullName = this.approvallist.fullName;
            item.approvalTime = this.approvallist.approvalTime;
            item.content = this.approvallist.content;
          }
          this.$forceUpdate();
        }
      });
    },
    // 新增
    addHandle() {
      this.editType = 'add';
      this.isShowEdit = true;
      this.isEmptyData = true;
      this.isDisabledPull = false;
      this.isShowSaleOrderId = false;
      this.isShowCustomerName = false;
      this.isNotRequiredSOI = true;

      this.ifpulldate = true;
      this.iftagupd = false;
      this.ifchildshow = false;
      this.purchasetagtype = false;
      this.reserveType = "";
      this.reserveInventory = "";
      (this.purchaseobj = {
        uuid: "",
        reserveType: "",
        reserveTypeName: "",
        submitType: "",
        purchaseTypeName: "",
        reserveInventory: "",
        saleOrderId: "",
        customerName: "",
        reserveItemList: []
      }),
        purchasegetuuid().then(response => {
          if (response.code === "0") {
            this.purchaseobj.uuid = response.data;
          }
        });
    },
    // 拉取数据
    pullDataHandle() {
      if (!this.purchaseobj.reserveType) {
        this.$message({
          type: "error",
          message: "请选择请求类型！"
        });
        return false;
      }
      if (!this.purchaseobj.reserveInventory) {
        this.$message({
          type: "error",
          message: "请选择预留仓位！"
        });
        return false;
      }
      if (!this.isNotRequiredSOI) {
        if (!this.purchaseobj.saleOrderId) {
          this.$message({
            type: "error",
            message: "请输入业务编号！"
          });
          return false;
        }
      }
      if (this.purchaseobj.reserveTypeName.slice(0, 2) == "客订") {
        if (!this.purchaseobj.saleOrderId && !this.purchaseobj.customerName) {
          this.$message({
            type: "error",
            message: "业务编号和客户名称须至少一个不能为空！"
          });
          return false;
        }
      }

      let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
      let reserveTypeData = this.reserveTypeList.find(item => {
        return item.dictItemValue == editDataCopy.reserveType;
      });
      editDataCopy.reserveTypeName = reserveTypeData.dictItemName;
      if (editDataCopy.reserveTypeName.slice(0, 2) == "客订") {
        var params = {
          saleOrderId: editDataCopy.saleOrderId,
          saleOrderType: ""
        };
        purchasegetdata(params).then(
          res => {
            if (res.code === "0") {
              this.tableLoading = false;
              if (!res.data) {
                this.$message({
                  type: "error",
                  message: "无数据可拉取！"
                });
                return false;
              }
              this.isDisabledPull = true; // 置灰拉取按钮
              this.isEmptyData = false;
              editDataCopy.customerName = res.data.customerName;
              editDataCopy.reserveItemList = res.data.saleOrderItemList;
              if (editDataCopy.reserveItemList && editDataCopy.reserveItemList.length) {
                this.ifchildshow = true; //判断有无数据的时候展示提示添加图
                for (var i = 0; i < editDataCopy.reserveItemList.length; i++) {
                  let item = editDataCopy.reserveItemList[i];
                  getUUID().then(uRes => {
                    if (uRes.code === "0") {
                      item.uuid = uRes.data;
                    }
                  });
                  var day = new Date();
                  day.setTime(day.getTime());
                  var s2 = timeFormatGMT(day, "yyyy-MM-dd HH:mm:ss");
                  item.reserveBeginTime = s2;
                  item.reserveEndTime = timeFormat(res.data.lastDeliveryDate);
                  item.endPickerOptions = {
                    disabledDate(time) {
                      return time.getTime() < new Date(item.reserveBeginTime).getTime();
                    }
                  };
                  //item.productCode = item.productId;
                  item.iftext = true; //判断拉取数据显示是否可以填写
                  item.subinventoryList = this.subinventoryList;
                  this.updateEditModeSet("edit", item);
                }
              }
              this.purchaseobj = editDataCopy;
              this.$forceUpdate();
            } else if (res.message == "业务编号不能为空") {
              this.notpulldata = true; //取消点击拉取后不能在拉取
              // this.ifpulldate = true; //请求类型和仓位不能再选
              this.isEmptyData = false; // 请求类型和预留仓位不能再选
              this.tableLoading = false;
            }
          },
          error => {
            setTimeout(() => {
              this.tableLoading = false;
            }, 10000);
          }
        );
      } else {
        // 非客订
        if (editDataCopy.reserveTypeName.includes("面料")) {
          pullClothProductionList(editDataCopy.saleOrderId).then(res => {
            if (res.code === "0") {
              if (!res.data.length) {
                this.$message({
                  type: "error",
                  message: "无数据可拉取！"
                });
                return false;
              }
              this.isDisabledPull = true; // 置灰拉取按钮
              this.isEmptyData = false;
              this.ifchildshow = true;
              for (var i = 0; i < res.data.length; i++) {
                let data = res.data[i];
                data.productCode = data.sourceProductCode;
                data.materialCode = data.sourceMaterialCode;

                var day = new Date();
                day.setTime(day.getTime());
                var s2 = timeFormatGMT(day, "yyyy-MM-dd HH:mm:ss");
                data.reserveBeginTime = s2;
                data.endPickerOptions = {
                  disabledDate(time) {
                    return time.getTime() < new Date(data.reserveBeginTime).getTime();
                  }
                };
                data.iftext = true; //判断拉取数据显示是否可以填写
                data.subinventoryList = this.subinventoryList;

                //根据物料编号查询计量单位
                this.getmaterialunit(data);
                if (data.reserveSubInventory) {
                  let obj = {
                    materialCode: data.materialCode,
                    inventory: this.purchaseobj.reserveInventory,
                    subInventory: data.reserveSubInventory
                  };
                  purchasegetInventory(obj).then(response => {
                    if (response.code === "0") {
                      console.log(response.data);
                      data.availableInventory = Number(response.data) < 0 ? 0 : response.data;
                      this.$forceUpdate();
                    }
                  });
                }
                this.updateEditModeSet("edit", data);
              }
              editDataCopy.reserveItemList = res.data;
              this.purchaseobj = editDataCopy;
              this.$forceUpdate();
            }
          });
        } else {
          console.log("进入非客订非面料");
          pullToolProductionList(editDataCopy.saleOrderId).then(res => {
            if (res.code === "0") {
              if (!res.data.length) {
                this.$message({
                  type: "error",
                  message: "无数据可拉取！"
                });
                return false;
              }
              this.isDisabledPull = true; // 置灰拉取按钮
              this.isEmptyData = false;
              this.ifchildshow = true;
              for (var i = 0; i < res.data.length; i++) {
                let data = res.data[i];
                data.productCode = data.sourceProductCode;
                data.materialCode = data.sourceMaterialCode;

                getUUID().then(uRes => {
                  if (uRes.code === "0") {
                    data.uuid = uRes.data;
                    this.$forceUpdate();
                  }
                });

                var day = new Date();
                day.setTime(day.getTime());
                var s2 = timeFormatGMT(day, "yyyy-MM-dd HH:mm:ss");
                data.reserveBeginTime = s2;
                data.endPickerOptions = {
                  disabledDate(time) {
                    return time.getTime() < new Date(data.reserveBeginTime).getTime();
                  }
                };
                data.iftext = true; //判断拉取数据显示是否可以填写
                data.subinventoryList = this.subinventoryList;

                //根据物料编号查询计量单位
                this.getmaterialunit(data);
                if (data.reserveSubInventory) {
                  let obj = {
                    materialCode: data.materialCode,
                    inventory: this.purchaseobj.reserveInventory,
                    subInventory: data.reserveSubInventory
                  };
                  purchasegetInventory(obj).then(response => {
                    if (response.code === "0") {
                      console.log(response.data);
                      data.availableInventory = Number(response.data) < 0 ? 0 : response.data;
                      this.$forceUpdate();
                    }
                  });
                }
                this.updateEditModeSet("edit", data);
              }
              editDataCopy.reserveItemList = res.data;
              this.purchaseobj = editDataCopy;
              this.$forceUpdate();
            }
          });
        }
      }
    },
    reserveTypeChange(val) {
      // 预留类型选择
      console.log("预留类型当前选择值：", val);
      let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
      let reserveTypeData = this.reserveTypeList.find(item => {
        return item.dictItemValue == val;
      });
      editDataCopy.reserveTypeName = reserveTypeData.dictItemName;
      this.purchasetypeidname = editDataCopy.reserveTypeName.slice(0, 2);

      this.fieldsByReserveType(editDataCopy.reserveTypeName);

      // if (editDataCopy.reserveTypeName.slice(0, 2) == '客订') {
      //   this.isShowSaleOrderId = true;
      //   this.isShowCustomerName = true;
      // } else {
      //   if (editDataCopy.reserveTypeName.includes('面料') || editDataCopy.reserveTypeName.includes('其他')) {
      //     // 非客订-面料
      //     this.isNotRequiredSOI = true;
      //     this.isDisabledPull = true;
      //   } else {
      //     this.isNotRequiredSOI = false;
      //     this.isDisabledPull = false;
      //   }
      //   this.isShowSaleOrderId = true;
      //   this.isShowCustomerName = false;
      // }
      this.purchaseobj = editDataCopy;

      // for (var j = 0; j < this.reserveTypeList.length; j++) {
      //   var data = this.reserveTypeList[j];
      //   if (this.reserveType == data.dictItemValue) {
      //     //				for(var i=0;i<this.purchaseobj.reserveItemList.length;i++){
      //     //					var item=this.purchaseobj.reserveItemList[i];
      //     //					item.purchaseTypeName=data.dictItemName;
      //     //				}
      //     var tagName = data.dictItemName;
      //     this.purchasetypeidname = tagName.slice(0, 2);
      //     console.log(this.purchasetypeidname);
      //     if (this.purchasetypeidname == "客订") {
      //       this.purchasetagtype = true; //是否展示客订
      //     } else {
      //       this.purchasetagtype = false;
      //     }
      //   }
      // }
    },
    customerNameSelect(val) {
      // 客户名称选择
      console.log("客户名称当前选择值：", val);
      if (!val) {
        this.isDisabledPull = false;
      } else {
        this.isDisabledPull = true;
        let customerData = this.customerList.find(item => {
          return item.customerId == val;
        });
        this.purchaseobj.customerId = val;
        this.purchaseobj.customerName = customerData ? customerData.customerNameCh : "";
      }
    },
    fieldsByReserveType(reserveTypeName) {
      console.log(reserveTypeName);
      // 根据不同预留类型显示父项字段
      if (reserveTypeName.slice(0, 2) == "客订") {
        this.isShowSaleOrderId = true;
        this.isShowCustomerName = true;
        this.isDisabledPull = false;
        this.isNotRequiredSOI = true;
      } else if (reserveTypeName.includes("非客订")) {
        if (reserveTypeName.includes("面料")) {
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

    selectwearclick() {
      for (var j = 0; j < this.warehouseList.length; j++) {
        var data = this.warehouseList[j];
        if (this.purchaseobj.reserveInventory == data.index) {
          this.purchaseobj.reserveInventoryName = data.name;
        }
      }

      subinventoryquesttype(this.purchaseobj.reserveInventory).then(response => {
        if (response.code === "0") {
          console.log(response);
          this.$forceUpdate();
          this.subinventoryList = response.data;
          if (this.purchaseobj.reserveItemList != "") {
            for (var i = 0; i < this.purchaseobj.reserveItemList.length; i++) {
              var idata = this.purchaseobj.reserveItemList[i];
              console.log(this.subinventoryList);
              idata.subinventoryList = this.subinventoryList;
              this.$forceUpdate();
            }
          }
          this.$forceUpdate();
        }
      });
    },
    // 新增子项信息
    async addEditHandle() {
      this.ifchildshow = true;
      console.log("编辑项信息：", this.purchaseobj);
      if (this.purchaseobj.reserveTypeName.slice(0, 2) == "客订") {
        if (!this.purchaseobj.saleOrderId && !this.purchaseobj.customerName) {
          this.$message({
            type: "error",
            message: "业务编号和客户名称须至少一个不能为空！"
          });
          return false;
        }
      }
      let day = new Date();
      let s2 = timeFormatGMT(day, "yyyy-MM-dd HH:mm:ss");
      let data = {
        uuid: "",
        reserveQuantity: "",
        availableInventory: "",
        reserveSubInventory: "",
        productCode: "",
        remark: "",
        reserveBeginTime: s2,
        reserveEndTime: "",
        subinventoryList: this.subinventoryList,
        subInventoryName: "",
        purchaseMeasurementUnit: "",
        endPickerOptions: {},
        valuedata: "",
        iftext: false,
        ifsubInventory: false
      };
      data.endPickerOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(data.reserveBeginTime).getTime();
        }
      };

      if (this.isEmptyData) {
        if (!this.purchaseobj.reserveType) {
          this.$message({
            type: "error",
            message: "请选择请求类型！"
          });
          return false;
        }
        if (!this.purchaseobj.reserveInventory) {
          this.$message({
            type: "error",
            message: "请选择预留仓位！"
          });
          return false;
        }
        if (!this.isNotRequiredSOI) {
          if (!this.purchaseobj.saleOrderId) {
            this.$message({
              type: "error",
              message: "请输入业务编号！"
            });
            return false;
          }
        }

        let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
        this.updateEditModeSet("add", data);
        await getUUID().then(res => {
          if (res.code === "0") {
            editDataCopy.uuid = res.data;
          }
        });
        await getUUID().then(res => {
          if (res.code === "0") {
            data.uuid = res.data;
            editDataCopy.reserveItemList.push(data);
            this.isEmptyData = false;
          }
        });
        this.purchaseobj = editDataCopy;
      } else {
        let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
        for (var i = 0; i < editDataCopy.reserveItemList.length; i++) {
          let item = editDataCopy.reserveItemList[i];
          if (item.reserveQuantity > item.availableInventory) {
            this.$message({
              type: "error",
              message: "预留数量不能大于在库可用库存！"
            });
          }
        }
        this.updateEditModeSet("add", data);
        await getUUID().then(res => {
          if (res.code === "0") {
            data.uuid = res.data;
            editDataCopy.reserveItemList.push(data);
          }
        });
        this.purchaseobj = editDataCopy;
      }
    },
    // 删除编辑项
    deleteEditItemHandle(index, item) {
      if (this.purchaseobj.reserveItemList.length > 1) {
        this.purchaseobj.reserveItemList.splice(index, 1);
      } else {
        this.ifchildshow = false;
        this.purchaseobj.reserveItemList = [];
      }
    },
    dateValChange(val) {
      console.log("选择日期：", val);
      console.log("dateVal: ", this.dateVal);
    },
    dateValChangetime(val) {
      console.log(val);
      if (val.valuedata != null && val.valuedata != "") {
        val.reserveBeginTime = val.valuedata[0];
        val.reserveEndTime = val.valuedata[1];
      } else {
        val.reserveBeginTime = "";
        val.reserveEndTime = "";
      }
    },
    searchHandle() {
      if (this.valuedata != null && this.valuedata != "") {
        this.startTime = this.valuedata[0];
        this.endTime = this.valuedata[1];
      } else {
        this.startTime = "";
        this.endTime = "";
      }
      this.currentPage = 1;
      // 搜索
      this.getPurchaseOrderList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchaseOrderList();
    },
    getPurchaseOrderList() {
      // 预留列表
      let data = {
        startTime: this.startTime,
        endTime: this.endTime,
        saleOrderId: this.saleOrderId,
        reserveType: this.reserveType,
        reserveId: this.reserveId,
        materialCode: this.materialCode,
        auditStatus: this.prStatus,
        customerId:this.customerValue,
        reserveStatus:this.reserveStatusName,
      };
      purchaseOrderList(this.currentPage, this.pageSize, data).then(res => {
          console.log("预留列表：", res);
          if (res.code == "0") {
            this.requestList = res.data.records;
            this.total = res.data.total;
            this.requestList.forEach((item, index) => {
              console.log(item);
              if (item.createTime) {
                item.createTime = timeFormat(item.createTime);
              } else {
                item.createTime = "空";
              }
              item.status = item.auditStatus;
              item.auditStatusName = this.actionsTypeHandle(item.auditStatus);
              this.reserveTypeList.forEach((b, index) => {
                if (item.reserveType == b.dictItemValue) {
                  item.reserveTypeName = b.dictItemName;
                  if (item.reserveTypeName.slice(0, 2) == "客订") {
                    item.reserveTypeNametag = "客订";
                  } else if (item.reserveTypeName.slice(0, 2) == "非客") {
                    item.reserveTypeNametag = "非客";
                  }
                  if (item.reserveTypeName.split("-")[0] == "客订") {
                    item.hide_customerName = false;
                  } else {
                    item.hide_customerName = true;
                  }
                  if (item.reserveTypeName.split("-")[0] == "客订" || item.reserveTypeName.split("-")[0] == "非客订") {
                    item.hide_saleOrderId = false;
                  } else {
                    item.hide_saleOrderId = true;
                  }
                }
              });
              this.warehouseList.forEach((a, index) => {
                if (item.reserveInventory == a.index) {
                  item.reserveInventoryName = a.name;
                }
              });
              // item.isReserveNoCustom = item.reserveTypeNametag != "客订" ? true : false;
              // if (item.isReserveNoCustom) {
              //   item.isHideFew = true;
              // }
              item.reserveItemList.forEach((i, index) => {
                if (i.reserveBeginTime != null) {
                  i.reserveBeginTime = timeFormat(i.reserveBeginTime);
                  i.reserveBeginTime = i.reserveBeginTime.substring(0, 10);
                } else {
                  i.reserveBeginTime = "空";
                }
                if (i.reserveEndTime != null) {
                  i.reserveEndTime = timeFormat(i.reserveEndTime);
                  i.reserveEndTime = i.reserveEndTime.substring(0, 10);
                } else {
                  i.reserveEndTime = "空";
                }
                if (i.reserveStatus == "Release") {
                  item.reservetag = false;
                } else {
                  item.reservetag = true;
                }
                // 预留库位
                let subInventoryData = this.subinventoryList.find(x => {
                  return x.subInventory == i.reserveSubInventory;
                });
                i.reserveSubInventoryName = subInventoryData ? subInventoryData.subInventoryName : '';
                i.reserveTime = (i.reserveBeginTime ? i.reserveBeginTime : '') + '——' + (i.reserveEndTime ? i.reserveEndTime : '');
                i.reserveStatusName = i.reserveStatus ? (i.reserveStatus == 'Reserve' ? '预留' : '解除') : i.reserveStatus;
                i.subinventoryList = this.subinventoryList;
                this.updateEditModeSet("edit", i);
                this.$forceUpdate();
              });
              switch (item.auditStatus) {
                case "Draft":
                  item.actions = {
                    hasEdit: true,
                    hasSubmit: true,
                    hasDelete: true
                  };
                  break;
                case "Approved":
                  item.actions = {
                    hasEdit: true,
                    hasRemove: item.reservetag
                  };
                  break;
                case "Rejected":
                  item.actions = {
                    hasEdit: true,
                    hasSubmit: true,
                    hasDelete: true
                  };
                  break;
                default:
                  item.actions = {};
                  break;
              }
              //          getapprovalOpinions(item.uuid).then(response => {
              //							if(response.code === "0") {
              //								this.approvallist=response.data[response.data.length-1];
              //								console.log(this.approvallist)
              //								if(this.approvallist==undefined){
              //									item.fullName='';
              //									item.approvalTime='';
              //									item.content='';
              //								}else{
              //									item.fullName=this.approvallist.fullName;
              //									item.approvalTime=this.approvallist.approvalTime;
              //									item.content=this.approvallist.content;
              //								}
              //								this.$forceUpdate();
              //							}
              //						});
            });
            console.log(this.requestList);
            this.tableLoading = false;
          }
        },
        error => {
          setTimeout(() => {
            this.tableLoading = false;
          }, 10000);
        }
      );
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    getReserveReleaseStatus(){
      fabrictypedictionaries('ReserveReleaseStatus').then(response => {
        if(response.code === "0") {					
          this.ReserveReleaselist = response.data;
        }
      });
    },
    //修改保存（生成草稿）
    draftsave(tag) {
      console.log(this.purchaseobj);
      // this.purchaseobj.reserveType = this.reserveType;
      // this.purchaseobj.reserveInventory = this.reserveInventory;
      // this.purchaseobj.saleOrderId = this.saleOrderId;
      // this.purchaseobj.customerName = this.customerName;
      this.purchaseobj.applicant = this.$store.getters.getUserName;
      this.purchaseobj.applicantDepartment = this.$store.getters.getdepartmentId;
      this.purchaseobj.applicantName = this.$store.state.realName;
      this.purchaseobj.applicantDepartmentName = this.$store.state.departments[0].name;
      for (var i = 0; i < this.purchaseobj.reserveItemList.length; i++) {
        var item = this.purchaseobj.reserveItemList[i];
        for (var h = 0; h < item.subinventoryList.length; h++) {
          var hdata = item.subinventoryList[h];
          if (item.reserveSubInventory == hdata.subInventory) {
            item.subInventoryName = hdata.subInventoryName;
          }
        }
        if (
          item.productCode == "" ||
          item.materialCode == "" ||
          item.reserveBeginTime == "" ||
          item.reserveBeginTime == null ||
          item.reserveEndTime == "" ||
          item.reserveEndTime == undefined ||
          item.reserveQuantity == "" ||
          item.reserveQuantity == undefined ||
          item.reserveSubInventory == "" ||
          item.reserveSubInventory == undefined
        ) {
          this.nullboolean = false;
        } else {
          this.nullboolean = true;
        }
        if (item.reserveQuantity > item.availableInventory) {
          this.greaterthan = false;
          break;
        } else {
          this.greaterthan = true;
        }
        item.reserveInitQuantity=item.reserveQuantity;
      }
      for (var j = 0; j < this.reserveTypeList.length; j++) {
        var data = this.reserveTypeList[j];
        if (this.purchaseobj.reserveType == data.dictItemValue) {
          this.purchaseobj.reserveTypeName = data.dictItemName;
        }
      }
      if (this.nullboolean == false || this.purchaseobj.reserveType == "" || this.purchaseobj.reserveInventory == "") {
        this.$message({
          message: "必填项不能为空！",
          // message: "必填项,预留类型和预留仓位不能为空!!",
          type: "error"
        });
      } else if (this.greaterthan == false) {
        this.$message({
          message: "预留数量不能大于在库可用库存！",
          type: "error"
        });
      } else {
        //新增接口
        if (tag == "sv") {
          this.purchaseobj.submitType = 1;
          this.committag = "保存";
          this.loadingsave = true;
        } else {
          this.purchaseobj.submitType = 2;
          this.committag = "提交";
          this.loadingcommit = true;
        }
        this.isSaveDisabled = true;
        this.isSubmitDisabled = true;
        // console.log(this.purchaseobj)
        purchasechildadd(this.purchaseobj).then(response => {
          if (response.code === "0") {
            this.$message({
              message: this.committag + "成功",
              type: "success"
            });
            this.saleOrderId = "";
            this.isShowEdit = false;
            if (tag == "sv") {
              this.loadingsave = false;
              this.prStatus = "Draft";
              this.activeName = "Draft";
              this.getPurchaseOrderList();
            } else {
              this.loadingcommit = false;
              this.prStatus = "Approving";
              this.activeName = "Approving";
              this.getPurchaseOrderList();
            }
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
          setTimeout(() => {
            this.loadingsave = false;
            this.loadingcommit = false;
          }, 10000);
        });
      }
    },
    actionsTypeHandle(status) {
      // 审批
      switch (status) {
        case "Draft":
          return "草稿";
          break;
        case "Approving":
          return "审批中";
          break;
        case "Approved":
          return "已通过";
          break;
        case "Rejected":
          return "已驳回";
          break;
        case "Terminated":
          return "已终止";
          break;
        default:
          break;
      }
    },
    switchTabHandle(tab) {
      // Tab切换
      console.log("Tab切换：", tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.multipleSelection = [];
      this.childMultipleSelection = [];
      this.selectUuidList = []; // 勾选项清空
      this.requestList = [];
      switch (tab.name) {
        case "":
          // 全部
          this.prStatus = "";
          this.getPurchaseOrderList();
          break;
        case "Draft":
          // 草稿
          this.prStatus = "Draft";
          this.getPurchaseOrderList();
          break;
        case "Approving":
          // 审批中
          this.prStatus = "Approving";
          this.getPurchaseOrderList();
          break;
        case "Approved":
          // 已通过
          this.prStatus = "Approved";
          this.getPurchaseOrderList();
          break;
        case "Rejected":
          // 已驳回
          this.prStatus = "Rejected";
          this.getPurchaseOrderList();
          break;
        case "Terminated":
          // 已终止
          this.prStatus = "Terminated";
          this.getPurchaseOrderList();
          break;
        default:
          this.prStatus = "";
          break;
      }
    },
    // handleClick(tab, event) {
    //   this.tableLoading = true;
    //   if (tab.label == "全部预留请求") {
    //     this.prStatus = "";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   } else if (tab.label == "草稿") {
    //     this.prStatus = "Draft";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   } else if (tab.label == "审批中") {
    //     this.prStatus = "Approving";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   } else if (tab.label == "已通过") {
    //     this.prStatus = "Approved";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   } else if (tab.label == "已驳回") {
    //     this.prStatus = "Rejected";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   } else {
    //     this.prStatus = "Terminated";
    //     this.currentPage = 1;
    //     this.getPurchaseOrderList();
    //   }
    // },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      let numberInputSet = JSON.parse(JSON.stringify(this.numberInputSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));
      let datePickerDoubleSet = JSON.parse(JSON.stringify(this.datePickerDoubleSet));
      if (type == "edit") {
        // 产品编号
        inputSet.productCode = false;
        textSet.productCode = true;

        // switch (status) {
        //   case 'Draft':

        //     break;
        //   case 'Approved':

        //     break;
        //   default:
        //     break;
        // }
      } else {
        // 产品编号
        inputSet.productCode = true;
        textSet.productCode = false;
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.selectSet = selectSet;
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.datePickerSet = datePickerSet;
      editModeSet.datePickerDoubleSet = datePickerDoubleSet;
      data.editModeSet = editModeSet;
    },
    inputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case "productCode":
          // 产品编号
          console.log("产品编号值改变：", val, item, fieldItem);
          getmaterialCode(item.productCode).then(res => {
            if (res.code === "0") {
              if (res.data == null) {
                this.$message({
                  message: "查无此产品编号",
                  type: "error"
                });
                item.materialCode = "";
              } else {
                item.materialCode = res.data;
                this.$forceUpdate();
                console.log(res.data);
                //根据物料编号查询计量单位
                this.getmaterialunit(item);
                if (item.reserveSubInventory != "") {
                  let obj = {
                    materialCode: item.materialCode,
                    inventory: this.purchaseobj.reserveInventory,
                    subInventory: item.reserveSubInventory
                  };
                  purchasegetInventory(obj).then(response => {
                    if (response.code === "0") {
                      console.log(response.data);
                      item.availableInventory = Number(response.data) < 0 ? 0 : response.data;
                      this.$forceUpdate();
                    }
                  });
                  this.$forceUpdate();
                }
              }
            }
          });
          break;

        default:
          break;
      }
    },
    async selectChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case "reserveSubInventory":
          // 预留库位
          console.log("预留库位值改变：", val, item, fieldItem);
          let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
          for (var j = 0; j < item.subinventoryList.length; j++) {
            var data = item.subinventoryList[j];
            if (item.subInventory == data.subInventory) {
              item.subInventoryName = data.subInventoryName;
            }
          }
          if (!item.materialCode || item.materialCode == undefined) {
            this.$message({
              message: "请先填写物料编号！",
              type: "error"
            });
            return false;
          }
          if (val) {
            let obj = {
              materialCode: item.materialCode,
              inventory: this.purchaseobj.reserveInventory,
              subInventory: item.reserveSubInventory
            };
            purchasegetInventory(obj).then(res => {
              if (res.code === "0") {
                console.log(res.data);
                for (var i = 0; i < editDataCopy.reserveItemList.length; i++) {
                  let data = editDataCopy.reserveItemList[i];
                  if (data.uuid == item.uuid) {
                    data.availableInventory = Number(res.data) < 0 ? 0 : res.data;
                  }
                }
                this.purchaseobj = editDataCopy;
                this.$forceUpdate();
              }
            });
          } else {
            item.availableInventory = 0;
          }
          break;

        default:
          break;
      }
    }
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

.decisionReserved {
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
  .popover_wrap {
    .el-popover__reference {
      background: none;
      border: none;
      border-radius: 0;
      padding: 5px;
      border-bottom: 1px solid #409eff;
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
  .edit_btn_wrap {
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
      white-space: normal;
    }
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}
i.el-icon-close {
  font-size: 20px;
  color: #409eff;
  cursor: pointer;
}
i.el-icon-thumb,
i.el-icon-edit,
i.el-icon-delete {
  margin-left: 0;
}
// popover弹出框
.el-popover {
  .title {
    padding: 10px 0;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
  }
  .el-checkbox {
    margin-bottom: 10px;
  }
}
.addcontent {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 15px;
  overflow: hidden;
  overflow-x: auto;
}
select.selectstatus {
  width: 190px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  /*cursor: pointer;*/
  font-size: 14px;
}

select.selectstatus > option {
  /*cursor: pointer;*/
  font-size: 14px;
}
select.selectstatus {
  background: #ffffff;
}
select.selectstatus.disactive {
  cursor: not-allowed;
}
.addcontent_content ul {
  height: 40px;
  background: #cecece;
  margin-top: 10px;
  border-radius: 4px;
  min-width: 1510px;
  li {
    padding: 10px 10px;
    font-size: 14px;
    color: #606266;
  }
}
form.el-form.demo-form-inline {
  display: flex;
}
form.el-form.demo-form-inline .el-form-item {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 0px;
}
// button.el-button.el-button--danger.is-circle {
//   padding: 3px;
//   margin-top: 10px;
// }
.formtable {
  ul.demo-form-inline {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 0px;
    display: flex;
    height: auto;
    text-align: center;
    li {
      width: auto;
      padding: 0 10px;
      font-size: 14px;
      color: #606266;
      .el-input-number--mini {
        width: 80px;
        height: 40px;
      }

      .el-input-number.is-controls-right .el-input__inner {
        padding-right: 0;
        height: 40px;
      }
      span {
        margin-left: 5px;
        margin-right: 10px;
      }
      select {
        width: 145px;
      }
      .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
        /*width: 160px;*/
        width: 148px;
      }
      .el-select {
        width: 145px;
      }
    }
    li:first-child {
      padding: 0px 0;
    }
    li:nth-child(3),
    li:nth-child(4) {
      padding: 0px 0;
    }
    li:nth-child(4) {
      cursor: not-allowed;
    }
    li:nth-child(3) {
      div {
        padding-left: 5px;
        margin-bottom: 5px;
      }
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}
</style>
<style>
/*.el-tabs__content{
	overflow-x: auto;
}
.el-tab-pane{
	min-width: 1200px;
}*/
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
/* .subnav_wrap .el-tabs__header {
  width: 90%;
} */
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
}

/* popover弹出框 */
.popover_table.el-table .el-table__header th,
.popover_table.el-table .el-table__header tr {
  height: 40px;
  background-color: #f5f7fa;
}
.el-date-editor.el-range-editor.el-input__inner.mr10.mb10.el-date-editor--daterange {
  width: 320px;
}
/* .decisionReserved button.el-button.el-button--danger.is-circle {
  padding: 7px;
} */
/* .decisionReserved .ending {
    text-align: left;
    margin-left: 20px;
} */
</style>