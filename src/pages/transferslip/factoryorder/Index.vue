<template>
  <div class="factoryorder">
    <!-- <div v-show="!isExcelMode"> -->
      <div class="commoncontent container" v-if="ifaddsure==false">
        <div class="actions_part clearfix">
          <div class="actions_wrap">
            <div class="inline_block mr10 mb10">
              <span class="tag">调拨类型：</span>
              <el-select class="select_single w200 mr10"  @change="searchHandle"  v-model="typestatusid" placeholder="请选择">
                <el-option key label="全部" value></el-option>
                <el-option
                  v-for="item in typeList"
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
              <el-input class="input_single w200 mr10" v-model="orderOrRequestCode" placeholder="请输入"></el-input>
            </div>
            <div class="inline_block mr10 mb10">
              <span class="tag">出库仓位：</span>
              <el-select
                class="select_single w200 mr10"
                v-model="virtualInventoryId"
                @change="selectwarehouseclick('出库仓位')"
                placeholder="请选择">
                <el-option key label="全部" value></el-option>
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
                @change="selectwareoutclick('出库库位')"
                placeholder="请选择出库库位">
                <el-option key label="全部" value></el-option>
                <el-option
                  v-for="item in this.subinventoryList"
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
                @change="selectwarehouseclick('入库仓位')"
                placeholder="请选择入库仓位">
                <el-option key label="全部" value></el-option>
                <el-option
                  v-for="item in this.warehouseList"
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
                @change="selectwareoutclick('入库库位')"
                placeholder="请选择入库库位">
                <el-option key label="全部" value></el-option>
                <el-option
                  v-for="item in this.inputSubInventoryList"
                  :key="item.subInventory"
                  :label="item.subInventoryName"
                  :value="item.subInventory"
                ></el-option>
              </el-select>
            </div>
            <div class="inline_block mr10 mb10">
              <span class="tag">期望交期：</span>
              <el-date-picker
                v-model="value1"
                unlink-panels
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
            <!-- <el-button
              size="medium"
              type="primary"
              icon="el-icon-upload"
              circle
              title="上传"
              @click="uploadHandle"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-download"
              circle
              title="下载"
              @click="downloadHandle"
            ></el-button> -->
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              circle
              title="添加"
              @click="byallocating"
            ></el-button>
          </div>
        </div>

        <!-- 列表 -->
        <div class="table_part clearfix">
          <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
            <el-tab-pane
              v-for="item in subNavList"
              :key="item.value"
              :label="item.label"
              :name="item.value">
              <Table
                :tableList="requestList"
                :parentData="parentData"
                :childData="childData"
                :tableFieldsList="allFieldList"
                :tableLoading="tableLoading"
                @editHandle="editHandle"
                @submitHandle="submitHandle"
                @deleteHandle="deleteHandle"
              ></Table>
            </el-tab-pane>
            <!-- <p v-if="!this.requestList.length && !tableLoading" class="empty_tip">暂无数据</p> -->
          </el-tabs>
        </div>
      
        <div class="pagination_wrap fr mt10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="this.allpage"
          ></el-pagination>
        </div>
      </div>

      <!-- 编辑 -->
      <div class="addcontent container" v-if="this.ifaddsure==true">
        <div class="actions_part clearfix">
          <div class="actions_wrap fl">
            <div class="inline_block mr10">
              <span class="red mr5">*</span>
              <span class="tag">调拨类型：</span>
              <el-select
                class="select_single w200 mr10 mb10"
                v-model="allocationType"
                @change="selectclick"
                :disabled="this.ifpulldate!=true"
                placeholder="请选择">
                <el-option key label="请选择" value></el-option>
                <el-option
                  v-for="item in typeList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.index"
                ></el-option>
              </el-select>
            </div>
            <div class="inline_block mr10" v-if="this.purchasetagtype==true">
              <span class="tag">销售订单编号：</span>
              <el-input
                class="input_single w200 mr10"
                :disabled="this.ifpulldate!=true"
                v-model="saleOrderId"
                placeholder="请输入"
              ></el-input>
            </div>
            <div
              class="button inline_block mr10 mt10"
              v-if="this.notpulldata==true">
              <el-button
                size="small"
                type="primary"
                title="拉取数据"
                icon="el-icon-refresh-right"
                @click="pullDataHandle"
                circle
                :disabled="isDisabledPull"
              ></el-button>
            </div>
            <div class="inline_block mr10" v-if="this.purchasetagtype==true">
              <span class="tag">客户名称：{{this.customerName}}</span>
            </div>
            <div class="inline_block mr10">
              <span class="red mr5">*</span>
              <span class="tag">供应商：</span>
              <el-select
                class="select_single w200 mr10 mb10"
                v-model="supplierPulldata"
                filterable
                :disabled="this.ifsupplier!=true"
                :title="supplierPulldata"
                @change="selectsupclick"
                placeholder="请选择">
                <el-option key label="请选择" value></el-option>
                <el-option
                  v-for="item in supplierNamepulllist"
                  :key="item.supplierId"
                  :label="item.supplierCode"
                  :value="item.supplierId"
                ></el-option>
              </el-select>
            </div>
            <div class="inline_block mr10">
              <span class="red mr5">*</span>
              <span class="tag">预计到货日期：</span>
              <el-date-picker
                class="w60p"
                v-model.trim="expectedArrivalDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              ></el-date-picker>
            </div>
            <di class="inline_block mr10" v-if="this.purchaselastindex=='工厂调拨'">
              <span class="red mr5">*</span>
              <span class="tag">发运方式：</span>
              <el-select
                class="select_single w200 mr10 mb10"
                v-model="deliveryTypeName"
                @change="shippingTypeChange">
                <el-option
                  v-for="item in deliveryTypeList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.index"
                ></el-option>
              </el-select>
            </di>
          </div>
          <div class="button ml10 down fr inline_block">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              circle
              :title="childtitle"
              @click="addchildmsg"
            ></el-button>

            <!-- Excel模式 -->
            <!-- <el-button class="fr ml10" type="primary" @click="switchExcelMode">Excel模式</el-button> -->
          </div>
        </div>

        <div class="hidden">
          <editDoubleTable
            :tableList="this.purchaseobj.faItemList"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="editFieldsList"
            @inputChange="inputChange"
            @inputBlur="inputBlur"
            @selectChange="selectChange"
            @selectVisibleChange="selectVisibleChange"
            @unitNumberInputChange="unitNumberInputChange"
            @deleteChlidHandle="deleteEditItemHandle"
            @addHandle="addEditItemHandle">
          </editDoubleTable>

          <div
            slot="footer"
            class="dialog-footer fr mt10">
            <el-button @click="cancelEditHandle">取消</el-button>
            <el-button
              type="primary"
              @click="updateEditHandle('save')"
              :loading="loadingsave"
              :disabled="ifchildshow!=true"
            >保存</el-button>
            <el-button
              type="primary"
              @click="updateEditHandle('commit')"
              :loading="loadingcommit"
              :disabled="ifchildshow!=true"
            >提交审批</el-button>
          </div>
        </div>
      </div>
    <!-- </div> -->

    <!-- <div v-show="isExcelMode" class="clearfix mb10">
      <el-button class="fr" type="primary" @click="switchFormMode">表单模式</el-button>
      <el-button class="fr mr10" @click="backHandle">返回</el-button>
    </div>
    <Excel v-show="isExcelMode" @spread="getSpread"></Excel> -->

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogdelVisible"
      width="30%">
      <span>确定删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>

    <!--外侧提交审批-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogcommitVisible"
      width="30%">
      <span>是否确认提交审批?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogcommitVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibcmtclick()" :loading="loadingoutdave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUUID, getMeasurementUnitByMC, getProductCodeByMC } from "@/api/publicApi.js";
import {
  factorySerch,
  purchasegetuuid,
  factorychildadd,
  factorychildshow,
  factorychilddel,
  warehousequesttype,
  subinventoryquesttype,
  subinventoryRollsType,
  getallottype,
  purchasegetdata,
  purchasegetInventory,
  purchasegetInventorylast,
  factorychildoutsave,
  purchasegetdatastok,
  getmaterialCode,
  getmaterialCodeUnit,
  getproductCode,
  getapprovalOpinions,
  purchasegetstockup,
  getsupplierName,
  getConfirmNumbersByMC,
  getAllocationQuantityByCN,
  getTPQuantityByInventory,
  existMaterialCode,
  searchTransferPlanQuantity,
  pullCustomerOrderRequest
} from "@/api/module/transfersApi.js";
import { fabrictypeSaleUnit } from "@/api/module/dictionariesApi.js";
import { getNowDate, timeFormat, dateToStr } from "@/utils/index.js";
import Table from "@/layouts/components/common/Table.vue";
// import editTable from "@/layouts/components/common/EditTableList.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
// import Excel from "@/layouts/components/Excel.vue";
export default {
  name: "factoryorder",
  components: {
    Table,
    // editTable,
    editDoubleTable,
    // Excel
  },
  data() {
    return {
      tableLoading: true,
      loadingsave: false,
      loadingcommit: false,
      loadingoutdave: false,
      subinventoryList: [],
      inputSubInventoryList: [],
      supplierNamepulllist: [],
      supplierselectlist: [],
      virtualInventoryId: "",
      subInventory: "",
      subInventoryName: "",
      inputSubInventoryName: "",
      inputInventoryId: "",
      inputSubInventory: "",
      materialCode: "",
      canpulldatatitle: "",
      supplierPulldata: "", //供应商下拉
      supplierNamepullname: "", //供应商名称
      size: "",
      childtitle: "",
      committag: "",
      allpage: 0,
      currentPage: 1, //页数
      pageSize: 10, //每页显示多少条
      activeName: "All",
      typestatusid: "",
      purchaseType: "", //预收货清单请求类型
      orderOrRequestCode: "",
      ifaddsure: false, //跳到添加页
      ifchildshow: false, //判断有无数据的时候展示提示添加图
      ifpulldate: false, //拉取过后
      dialogdelVisible: false,
      dialogcommitVisible: false,
      purchasetagtype: false, //判断是否是客订来展示销售编号
      notpulldata: true, //点击拉取后不能在拉取
      canPulldata: true, //是否可以拉取
      greaterthan: true,
      notallot: true, //是否可调拨
      ifsupplier: true,
      isShowAdd: true,
      batchEditDisabled: false,
      dialogFormVisible: false,
      disableadd: false,
      prohibit: true, //禁止不同供应商添加
      delid: "",
      saleOrderId: "",
      customerName: "",
      allocationStatus: "",
      purchasetypeid: "",
      suppliertypeid: "",
      allocationType: "",
      value1: "",
      starttime: "",
      endtime: "",
      prStatus: "",
      requestList: [],
      pricList: [],
      endTime: "",
      prepareReceiptCode: "",
      startTime: "",
      supplierCode: "",
      supplierName: "",
      uuid: "",
      receiptList: [],
      confirmReceiptList: [],
      editReceiptList: [],
      popupTitle: "",
      tagid: "",
      commitsaveid: "",
      factoryAllocationCode: "",
      factoryInvoice: "",
      packingList: "",
      warehouseList: [],
      allottypeList: [],
      approvallist: [],
      purchasetypeidname: "",
      purchaselastindex: "",
      expectedArrivalDate: "",
      deliveryType: "1",
      typeList: [],
      isDisabledPull: false,
      isDisabledSupplier: false,
      deliveryTypeList: [
        {
          index: "1",
          name: "空运"
        },
        {
          index: "5",
          name: "海运"
        }
      ],
      subNavList: [
        {
          label: "全部调拨单",
          value: "All"
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
        {
          label: "已终止",
          value: "Terminated"
        }
      ],
      // New
      parentData: {
        status: "",
        data: [
          {
            name: "",
            field: "createTime",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "申请人",
            field: "applicantName",
            class: "w6p",
            isShowTit: true
          },
          {
            name: "调拨单编号",
            field: "factoryAllocationCode",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "调拨类型",
            field: "allocationTypeName",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "销售订单编号",
            field: "saleOrderId",
            class: "w8p",
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
            name: "预计到货日期",
            field: "expectedArrivalDate",
            class: "w9p",
            isShowTit: true
          },
          {
            name: "发运方式",
            field: "deliveryTypeName",
            class: "w8p",
            isShowTit: true,
            isFilterField: true
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
        name: "faItemList",
        data: [
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
            field: "confirmNumbers",
            class: "w13p"
          },
          {
            name: "调拨数量",
            field_1: "allocationPackages",
            field_2: "allocationQuantityPerPackage",
            field_3: "allocationQuantity",
            field: "allocationQuantity",
            field_unit: 'purchaseMeasurementUnit',
            class: "w15p",
            isQuantityField: true
          },
          {
            name: "",
            field: "virtualInventoryName",
            class: "w13p"
          },
          {
            name: "",
            field: "subInventoryName",
            class: "w13p"
          },
          {
            name: "",
            field: "inputInventoryName",
            class: "w13p"
          },
          {
            name: "",
            field: "inputSubInventoryName",
            class: "w13p"
          },
          {
            name: "",
            field: "receivedQuantityName",
            class: "w13p"
          },
          {
            name: "",
            field: "validDate",
            class: "w13p"
          },
          {
            name: "",
            field: "remark",
            class: "w13p"
          },
          {
            name: "",
            field: "",
            class: "w10p pr",
            isAction: true
          }
        ]
      },
      allFieldList: [
        {
          name: "物料编号",
          class: "w13p"
        },
        // {
        //   name: "物料系统编号",
        //   class: "w13p"
        // },
        {
          name: "产品编号",
          class: "w13p"
        },
        // {
        //   name: "产品系统编号",
        //   class: "w13p"
        // },
        {
          name: "确认书号",
          class: "w13p"
        },
        {
          name: "调拨数量",
          class: "w15p"
        },
        {
          name: "出库仓位",
          class: "w13p"
        },
        {
          name: "出库库位",
          class: "w13p"
        },
        {
          name: "入库仓位",
          class: "w13p"
        },
        {
          name: "入库库位",
          class: "w13p"
        },
        {
          name: "已入库数",
          class: "w13p"
        },
        {
          name: "期望交期",
          class: "w13p"
        },
        {
          name: "备注",
          class: "w13p"
        },
        {
          name: "",
          class: "w10p"
        }
      ],
      purchaseobj: {
        uuid: "",
        allocationType: "",
        submitType: "",
        saleOrderId: "",
        customerName: "",
        allocationTypeName: "",
        supplierName: "",
        supplierCode: "",
        expectedArrivalDate: "",
        deliveryType: "",
        deliveryTypeName: "",
        applicant: this.$store.getters.getUserName,
        applicantDepartment: this.$store.getters.getdepartmentId,
        applicantName: this.$store.state.realName,
        applicantDepartmentName: "",
        faItemList: []
      },
      // 编辑组件数据
      editFieldsList: [
        {
          name: "* 产品编号",
          field: "productCode",
          class: "w16p",
          width: "150",
          isRules: true,
          isSingleField: true,
          chlidListName: 'allocationList'
        },
        {
          name: "供应商",
          field: "supplierName",
          class: "w16p",
          width: "150",
          isSingleField: true
        },
        {
          name: "* 出库仓位",
          field: "virtualInventoryId",
          class: "w18p",
          width: "150",
          isRules: true,
          isSingleField: true
        },
        {
          name: "* 出库库位",
          field: "subInventoryName",
          class: "w18p",
          width: "150",
          isRules: true,
          isSingleField: true
        },
        {
          name: "* 入库仓位",
          field: "inputInventoryId",
          class: "w18p",
          width: "150",
          isRules: true,
          isSingleField: true
        },
        {
          name: "* 入库库位",
          field: "inputSubInventoryName",
          class: "w18p",
          width: "150",
          isRules: true,
          isSingleField: true
        },
        {
          name: "* 期望交期",
          field: "validDate",
          class: "w16p",
          width: "180",
          isRules: true,
          isSingleField: true
        },
        {
          name: "备注",
          field: "remark",
          class: "w16p",
          width: "150",
          isSingleField: true
        },
        {
          name: "建议调拨数量（周）",
          field: "transferPlanQuantity",
          field_unit: "purchaseMeasurementUnit",
          class: "w13p",
          width: "180",
          isSingleField: true,
          isQuantityField: true
        },
        {
          name: "* 调出库可用库存",
          field: "availableInventory",
          field_unit: "purchaseMeasurementUnit",
          class: "w13p",
          width: "150",
          isRules: true,
          isSingleField: true,
          isQuantityField: true
        },
        {
          name: "* 确认书号",
          field: "confirmNumbers",
          class: "w16p",
          width: "150",
          isRules: true
        },
        {
          name: "* 调拨数量",
          field_1: "allocationPackages",
          field_2: "allocationQuantityPerPackage",
          field_3: "allocationQuantity",
          field: "allocationQuantity",
          field_unit: "purchaseMeasurementUnit",
          class: "w13p",
          width: "400",
          isRules: true
        }
      ],
      leaderFieldsList: [
        {
          name: "* 物料编号",
          field: "materialCode",
          class: "w10p",
          width: "180",
          isRules: true,
          isSingleField: true
        }
      ],
      tailFieldsList: [
        {
          name: "操作",
          field: "",
          class: "",
          width: "100",
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
        productCode: true,
        supplierName: true,
        transferPlanQuantity: true,
        availableInventory: true
      },
      inputSet: {
        materialCode: {
          maxlength: '',
          placeholder: ''
        },
        remark: {
          maxlength: '',
          placeholder: ''
        },
        inputData: {
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
          selectListName: 'subinventoryList',
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
        }
      },
      numberInputSet: {},
      datePickerSet: {
        validDate: true
      },
      unitSet: {
        allocationPackages: true
      },
      addItemData: {
        allocationPackages: 0,
        allocationQuantity: 0,
        allocationQuantityPerPackage: 0,
        confirmNumbers: '',
        materialCode: '',
        purchaseMeasurementUnit: '米',
        uuid: ''
      },

      uuidcode: "",
      subInvlist: [],
      SaleUnittypelist: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      // // Excel编辑模式
      // isExcelMode: false,
      // excelSpread: null,
      // excelIo: {},
      // spread: {},
      // spreadNS: null,
      // sheet: null,
      // excelEditDataCopy: {}

    };
  },
  computed: {
    userRealName() {
      return this.$store.state.realName;
    },
    departments() {
      return this.$store.state.departments;
    }
  },
  created() {},
  mounted() {
    this.getSaleUnit();
    this.factoryorderlist();
    this.allotType();
    this.warehouseType();

    if (this.$store.state.TOEditShow) {
      // 调拨计划携带编辑数据
      this.purchaseobj = {};
      this.isDisabledPull = true;

      // this.isDisabledPull = false;  // 允许拉取
      this.ifsupplier = false;
      this.disableadd = true;
      this.ifchildshow = true;
      this.purchasetagtype = false;
      this.ifpulldate = true;
      // this.ifsupplier = true;
      this.warehouseType();
      this.allotType();
      this.getsupplierNamepull();

      // this.isDisabledSupplier = true;
      let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
      let list = this.$store.state.planToTOList;
      getUUID().then(res => {
        if (res.code === '0') {
          editDataCopy.uuid = res.data;
        }
      });
      editDataCopy.faItemList = list;
      editDataCopy.supplierName = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierName : '';
      editDataCopy.supplierId = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierId : '';
      this.supplierPulldata = editDataCopy.faItemList.length ? editDataCopy.faItemList[0].supplierId : '';
      for (var i = 0; i < editDataCopy.faItemList.length; i++) {
        let data = editDataCopy.faItemList[i];
        getUUID().then(res => {
          if (res.code === '0') {
            data.uuid = res.data;
          }
        });
        data.transferPlanQuantity = data.adviceQuantity;
        data.warehouseList = this.warehouseList;
        this.updateEditModeSet('add', data);
        this.strongItemInfoHandle(data);
        this.$forceUpdate();
      }
      this.purchaseobj = editDataCopy;
      this.$store.commit('getTOEditShow');
      this.ifaddsure = true;
      this.$forceUpdate();
    }

    // // Excel
    // this.spreadNS = GC.Spread.Sheets;
    // this.spread = new this.spreadNS.Workbook(document.getElementById("excelView"), { sheetCount: 1 });
    // this.spread.refresh();
    // this.excelIo = new GC.Spread.Excel.IO();
    // this.sheet = this.spread.getSheet(0);  // 表单底部tab
    // // this.initSpread(this.spread);
  },
  watch: {},
  methods: {
    // // Excel模式
    // switchExcelMode() {
    //   // 切换到Excel编辑模式
    //   console.log('Excel首都航空', this.excelSpread);
    //   if (!this.supplierPulldata) {
    //     this.$message({
    //       type: 'error',
    //       message: '请先选择供应商！'
    //     });
    //     return false;
    //   }
    //   this.excelEditDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
    //   this.spread.refresh();
    //   this.initSpread(this.spread);
    //   this.isExcelMode = true;
    // },
    // switchFormMode() {
    //   // 切换到表单模式
    //   this.spread.refresh();
    //   this.runExcelHandle();  // 校验必填项
    // },
    // backHandle() {
    //   // Excel模式返回
    //   this.purchaseobj = this.excelEditDataCopy;
    //   this.isExcelMode = false;
    // },
    // getSpread(val) {
    //   console.log('表格实例：', val);
    //   this.excelSpread = val;
    // },
    // initSpread(spread) {
    //   // 库位列表数据
    //   console.log('表格数据库位列表：', this.subInventoryList);
    //   let subInventoryList = this.subInventoryList;
    //   let list = [];
    //   let data = {};
    //   for (var i = 0; i < subInventoryList.length; i++) {
    //     data.subInventory = subInventoryList[i].subInventory;
    //     data.subInventoryName = subInventoryList[i].subInventoryName;
    //     list.push(data);
    //     data = {};
    //   }
    //   // 库位列表数据 end
      
    //   spread.suspendPaint();
    //   var products = this.getProducts(100);
    //   var sheet = spread.getSheet(0);
    //   let combo = new this.spreadNS.CellTypes.ComboBox();
    //   combo.items(this.objKeyChange(list)).editorValueType(this.spreadNS.CellTypes.EditorValueType.value);
    //   sheet.autoGenerateColumns = false;
    //   sheet.setDataSource(products);

    //   // 表单保护 不可编辑状态
    //   var sheet = spread.getActiveSheet();
    //   var style = new GC.Spread.Sheets.Style();
    //   style.backColor = "#eee";
    //   // sheet.setStyle(1, -1, style);
    //   sheet.setStyle(-1, 2, style);
    //   sheet.setStyle(-1, 7, style);
    //   spread.bind(GC.Spread.Sheets.Events.EditStarting, function (s, e) {
    //     var row = e.row;
    //     var col = e.col;
    //     // if(row === 1 || col === 2){
    //     //   e.cancel = true;
    //     // }
    //     if(col === 2 || col === 7){
    //       e.cancel = true;
    //     }
    //   });

    //   var colInfos = [
    //     { name: "materialCode", displayName: "* 物料编号", size: 120 },
    //     { name: "productCode", displayName: "* 产品编号", size: 120 },
    //     { name: "supplierName", displayName: "供应商", size: 200 },
    //     { name: "requiredDate", displayName: "* 期望交期", formatter: "yyyy-MM-dd", size: 150 },
    //     { name: "requiredPackages", displayName: "请求数量包数", size: 100 },
    //     { name: "requiredQuantityPerPackage", displayName: "请求数量规格", size: 100 },
    //     { name: "requiredQuantity", displayName: "请求数量（米/条/本）", size: 100 },
    //     { name: "suggestQuantity", displayName: "建议采购米数", size: 100 },
    //     { name: "subInventory", displayName: "* 库位", cellType: combo, size: 150 },
    //     { name: "specialRequire", displayName: "特殊要求", formatter: "0.00", size: 160 },
    //     { name: "remark", displayName: "备注", size: 160 }
    //   ];
      
    //   sheet.bindColumns(colInfos);
    //   spread.resumePaint();
    // },
    
    // // Excel模式 end


    inputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'materialCode':
          console.log('物料编号值改变：', val, item, fieldItem);
          console.log('编辑列表数据：', this.purchaseobj.faItemList);
          let editListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
          for (var m = 0; m < editListCopy.length; m++) {
            if (editListCopy[m].uuid == item.uuid) {
              let data = editListCopy[m];
              existMaterialCode(data.materialCode).then(eRes => {
                console.log('查询就偶是对：', eRes);
                if (eRes.code === '0') {
                  let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
                  data.virtualInventoryId = '';
                  data.subInventoryName = '';
                  data.inputInventoryId = '';
                  data.inputSubInventoryName = '';
                  data.validDate = '';
                  data.remark = '';
                  data.transferPlanQuantity = '';
                  data.availableInventory = '';
                  data.confirmNumbers = '';
                  data.allocationPackages = '';
                  data.allocationQuantityPerPackage = '';
                  data.allocationQuantity = '';
                  data.subinventoryList = [];
                  data.inputSubInventoryList = [];
                  data.allocationList = [];
                  getUUID().then(res => {
                    if (res.code === '0') {
                      addItemDataCopy.uuid = res.data;
                    }
                  });
                  this.updateEditModeSet('add', addItemDataCopy);
                  data.allocationList.push(addItemDataCopy);

                  if (!eRes.data) {
                    this.$message({
                      type: 'error',
                      message: '查无此物料编号！'
                    });
                    data.materialCode = '';
                    data.productCode = '';
                    return false;
                  }
                  data.supplierName = eRes.data.supplierName;
                  data.supplierId = eRes.data.supplierId;
                  data.supplierCode = eRes.data.supplierId;

                  // 计量单位
                  this.getMeasurementUnit(data);

                  // 根据物料编号查询产品编号
                  getProductCodeByMC(data.materialCode, '', data.productCode).then(res => {
                    console.log('根据物料编号查询产品编号：', res);
                    if (res.code === '0') {
                      let pcArr = [];
                      for (var i = 0; i < res.data.length; i++) {
                        pcArr.push(res.data[i].productCode);
                      }
                      data.productCode = pcArr.join(',');
                      this.$forceUpdate();
                    }
                  });

                  for (var n = 0; n < data.allocationList.length; n++) {
                    let aData = data.allocationList[n];
                    aData.materialCode = data.materialCode;
                    // 计量单位
                    this.getMeasurementUnit(aData);
                    // 确认书列表
                    this.confirmNumbersByMCHandle(aData);
                  }
                  this.$forceUpdate();
                }
              });

            }
          }
          this.purchaseobj.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        default:
          break;
      }
    },
    inputBlur(val, item, fieldItem) {
      let time = null;
      let _this = this;
      switch (fieldItem.field) {
        case 'materialCode':
          console.log('物料编号值失焦：', val, item, fieldItem);
          time = setTimeout(function() {
            if (!item.productCode) {
              let editListCopy = JSON.parse(JSON.stringify(_this.purchaseobj.faItemList));
              for (var m = 0; m < editListCopy.length; m++) {
                if (editListCopy[m].uuid == item.uuid) {
                  let data = editListCopy[m];
                  existMaterialCode(data.materialCode).then(eRes => {
                    if (eRes.code === '0') {
                      let addItemDataCopy = JSON.parse(JSON.stringify(_this.addItemData));
                      data.virtualInventoryId = '';
                      data.subInventoryName = '';
                      data.inputInventoryId = '';
                      data.inputSubInventoryName = '';
                      data.validDate = '';
                      data.remark = '';
                      data.transferPlanQuantity = '';
                      data.availableInventory = '';
                      data.confirmNumbers = '';
                      data.allocationPackages = '';
                      data.allocationQuantityPerPackage = '';
                      data.allocationQuantity = '';
                      data.subinventoryList = [];
                      data.inputSubInventoryList = [];
                      data.allocationList = [];
                      getUUID().then(res => {
                        if (res.code === '0') {
                          addItemDataCopy.uuid = res.data;
                        }
                      });
                      _this.updateEditModeSet('add', addItemDataCopy);
                      data.allocationList.push(addItemDataCopy);

                      if (!eRes.data) {
                        _this.$message({
                          type: 'error',
                          message: '查无此物料编号！'
                        });
                        data.materialCode = '';
                        data.productCode = '';
                        return false;
                      }
                      data.supplierName = eRes.data.supplierName;
                      data.supplierId = eRes.data.supplierId;
                      data.supplierCode = eRes.data.supplierId;

                      // 计量单位
                      _this.getMeasurementUnit(data);

                      // 根据物料编号查询产品编号
                      getProductCodeByMC(data.materialCode, '', data.productCode).then(res => {
                        console.log('根据物料编号查询产品编号：', res);
                        if (res.code === '0') {
                          let pcArr = [];
                          for (var i = 0; i < res.data.length; i++) {
                            pcArr.push(res.data[i].productCode);
                          }
                          data.productCode = pcArr.join(',');
                          _this.$forceUpdate();
                        }
                      });
                      for (var n = 0; n < data.allocationList.length; n++) {
                        let aData = data.allocationList[n];
                        aData.materialCode = data.materialCode;
                        // 计量单位
                        _this.getMeasurementUnit(aData);
                        // 确认书列表
                        _this.confirmNumbersByMCHandle(aData);
                      }
                      _this.$forceUpdate();
                    }
                  });

                }
              }
              _this.purchaseobj.faItemList = editListCopy;
              _this.$forceUpdate();
            }
            clearTimeout(time);
          }, 1000);
          
          break;
        default:
          break;
      }
    },
    selectChange(val, item, fieldItem) {
      let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
      let editListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
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
          let businessType = '';
          // item.subInventory = '';  // 出库库位
          // item.subInventoryName = '';  // 出库库位名称
          item.subinventoryList = [];  // 出库库位列表
          this.subInvlist = [];
          if (allocationTypeArr[1] == '工厂调拨') {
            // 库位列表
            subinventoryquesttype(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < res.data.length; i++) {
                  let data = res.data[i];
                  if (data.subInventoryName.indexOf('工厂库') != -1) {
                    this.subInvlist.push(data);
                  }
                }
                this.$forceUpdate();
              }
            });
          } else {
            subinventoryRollsType(val).then(res => {
              if (res.code === '0') {
                this.subInvlist = res.data;
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
            console.log('查询建议调拨数量：', res);
            if (res.code === '0' && res.data) {
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                if (data.uuid == item.uuid) {
                  data.transferPlanQuantity = res.data.readyPlanQuantity;
                }
              }
              this.purchaseobj.faItemList = editListCopy;
              this.$forceUpdate();
            }
          });

          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid == item.uuid) {
              let viData = this.warehouseList.find(viItem => {
                return viItem.index == val;
              });
              data.virtualInventoryName = viData.name;  // 出库仓位名称
              data.subinventoryList = this.subInvlist;
              data.subInventory = '';  // 出库库位
              data.subInventoryName = '';  // 出库库位名称
            }
          }
          this.purchaseobj.faItemList = editListCopy;
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
          let params = {
            materialCode: item.materialCode,
            inventory: item.virtualInventoryId,
            subInventory: val
          };
          if (allocationTypeArr[1] == '工厂调拨') {
            purchasegetInventory(params).then(res => {
              // 调出库可用库存
              // console.log('工厂调拨——调出库可用库存：', res);
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    data.subInventory = val;
                    data.availableInventory = res.data;
                    for (var j = 0; j < data.subinventoryList.length; j++) {
                      let cData = data.subinventoryList[j];
                      if (cData.subInventory == val) {
                        data.subInventoryName = cData.subInventoryName;
                      }
                    }
                  }
                }
                this.purchaseobj.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          } else if (allocationTypeArr[1] == '库内调拨') {
            purchasegetInventorylast(params).then(res => {
              // 调出库可用库存
              // console.log('库内调拨——调出库可用库存：', res);
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    data.subInventory = val;
                    data.availableInventory = res.data;
                    for (var j = 0; j < data.subinventoryList.length; j++) {
                      let cData = data.subinventoryList[j];
                      if (cData.subInventory == val) {
                        data.subInventoryName = cData.subInventoryName;
                      }
                    }
                  }
                }
                this.purchaseobj.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          }
          break;
        case 'inputInventoryId':
          //入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          // item.inputSubInventory = '';  // 入库库位
          // item.inputSubInventoryName = '';  // 入库库位名称
          item.inputSubInventoryList = [];
          // 查询建议调拨数量
          getTPQuantityByInventory(item.materialCode, val).then(res => {
            // console.log('查询建议调拨数量：', res);
            if (res.code === '0') {
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                if (data.uuid == item.uuid) {
                  data.transferPlanQuantity = res.data ? res.data.transferPlanQuantity : 0;
                }
              }
              this.purchaseobj.faItemList = editListCopy;
              this.$forceUpdate();
            }
          });
          if (allocationTypeArr[1] == '工厂调拨') {
            subinventoryquesttype(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    let viData = this.warehouseList.find(viItem => {
                      return viItem.index == val;
                    });
                    data.inputInventoryName = viData.name;
                    data.inputSubInventoryList = res.data;
                    data.inputSubInventory = '';  // 入库库位
                    data.inputSubInventoryName = '';  // 入库库位名称
                  }
                }
                this.purchaseobj.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          } else {
            subinventoryRollsType(val).then(res => {
              if (res.code === '0') {
                for (var i = 0; i < editListCopy.length; i++) {
                  let data = editListCopy[i];
                  if (data.uuid == item.uuid) {
                    let viData = this.warehouseList.find(viItem => {
                      return viItem.index == val;
                    });
                    data.inputInventoryName = viData.name;
                    data.inputSubInventoryList = res.data;
                  }
                }
                this.purchaseobj.faItemList = editListCopy;
                this.$forceUpdate();
              }
            });
          }
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
          this.purchaseobj.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        case 'confirmNumbers':
          console.log('确认书号值改变：', val, item, fieldItem);
          getAllocationQuantityByCN(item.materialCode, item.confirmNumbers).then(res => {
            // console.log('根据确认书号查询调拨数量：', res);
            if (res.code === '0') {
              for (var i = 0; i < editListCopy.length; i++) {
                let data = editListCopy[i];
                for (var j = 0; j < data.allocationList.length; j++) {
                  if (data.allocationList[j].uuid == item.uuid) {
                    data.allocationList[j].allocationPackages = res.data.allocationPackages;
                    data.allocationList[j].allocationQuantity = res.data.allocationQuantity;
                    data.allocationList[j].allocationQuantityPerPackage = res.data.allocationQuantityPerPackage;
                  }
                }
              }
              this.purchaseobj.faItemList = editListCopy;
              this.$forceUpdate();
            }
          });
          break;
        default:
          break;
      }
    },
    selectVisibleChange(val, item, fieldItem) {
      let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
      let editListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
      // let allocationTypeArr = editDataCopy.allocationTypeName.split('-');  // 调拨类型
      switch (fieldItem.field) {
        case 'virtualInventoryId':
          // 出库仓位
          console.log('出库仓位值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid == item.uuid) {
              data.warehouseList = this.warehouseList;
            }
          }
          this.purchaseobj.faItemList = editListCopy;
          this.$forceUpdate();
          break;
        case 'subInventoryName':
          //出库库位
          console.log('出库库位值改变：', val, item, fieldItem);
          
          break;
        case 'inputInventoryId':
          //入库仓位
          console.log('入库仓位值改变：', val, item, fieldItem);
          for (var i = 0; i < editListCopy.length; i++) {
            let data = editListCopy[i];
            if (data.uuid == item.uuid) {
              data.warehouseList = this.warehouseList;
            }
          }
          this.purchaseobj.faItemList = editListCopy;
          this.$forceUpdate();
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
                this.confirmNumbersByMCHandle(aData);
              }
            }
          }
          this.purchaseobj.faItemList = editListCopy;
          break;
        default:
          break;
      }
    },
    unitNumberInputChange(val, item, fieldItem, step){
      switch (fieldItem.field) {
        case 'allocationQuantity':
          // 调拨数量
          console.log('调拨数量值更新：', val, item, fieldItem, step);
          if (step) {
            item.allocationQuantity = item.allocationPackages * item.allocationQuantityPerPackage;
            this.$forceUpdate();
          }
          break;
      
        default:
          break;
      }

      // if (step) {
      //   // 三个计量单位值 米
      //   switch (step) {
      //     case 'first':
            
      //       break;
      //     case 'second':
            
      //       break;
        
      //     default:
      //       break;
      //   }
      // }
    },

    //数组去重
    unique(array) {
      console.log(array)
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    addEditItemHandle(index, data) {
      // 添加三层数据 确认书号、调拨数量
      console.log('三层数据添加：', index, data);
      let faItemListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      addItemDataCopy.materialCode = faItemListCopy[index].materialCode;
      this.confirmNumbersByMCHandle(addItemDataCopy);
      this.updateEditModeSet('add', faItemListCopy[index]);
      this.updateEditModeSet('add', addItemDataCopy);
      purchasegetuuid().then(res => {
        if (res.code === '0') {
          addItemDataCopy.uuid = res.data;
        }
      });
      faItemListCopy[index].allocationList.push(addItemDataCopy);
      this.purchaseobj.faItemList = faItemListCopy;
    },
    deleteEditItemHandle(pi, ci, cItem) {
      // 删除三层数据
      console.log('子项删除：', pi, ci, cItem);
      if (ci === 0 && this.purchaseobj.faItemList[pi].allocationList.length <= 1) {
        // console.log('删除第一层数据极客时间');
        let editListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
        editListCopy.splice(pi, 1);
        this.purchaseobj.faItemList = editListCopy;
        this.$forceUpdate();
      } else {
        // console.log('删除子项数据看');
        let editListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
        editListCopy[pi].allocationList.splice(ci, 1);
        this.purchaseobj.faItemList = editListCopy;
        this.$forceUpdate();
      }
    },
    // deleteEditItemHandle(index, item) {
    //   console.log(index, item);
    //   console.log(this.purchaseobj.faItemList);
    //   let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
    //   editDataCopy.faItemList.splice(index, 1);
    //   this.purchaseobj = editDataCopy;
    // },
    //采购计量单位
    getSaleUnit() {
      fabrictypeSaleUnit().then(response => {
        if (response.code === "0") {
          this.SaleUnittypelist = response.data;
        }
      });
    },
    //新增时获取供应商列表数据
    getsupplierNamepull() {
      getsupplierName("", "").then(response => {
        console.log('供应商列表：', response);
        if (response.code === "0") {
          this.supplierNamepulllist = response.data;
        }
      });
    },
    shippingTypeChange(val) {
      // 发运方式改变
      console.log(val);
    },
    //审批流程
    lookauditPerson(item) {
      getapprovalOpinions(item.uuid).then(response => {
        if (response.code === "0") {
          this.approvallist = response.data[response.data.length - 1];
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
    allotType() {
      getallottype().then(response => {
        if (response.code === "0") {
          this.typeList = response.data;
        }
      });
    },
    searchHandle() {
      // 搜索
      if (this.value1 != null && this.value1 != "") {
        this.starttime = this.value1[0];
        this.endtime = this.value1[1];
      } else {
        this.starttime = "";
        this.endtime = "";
      }
      this.factoryorderlist();
    },
    // 仓位
    async warehouseType() {
      await warehousequesttype().then(response => {
        console.log('仓位列表：', response);
        if (response.code === "0") {
          this.warehouseList = response.data;
        }
      });
    },
    selectwarehouseclick(tag) {
      console.log(tag);
      for (var j = 0; j < this.warehouseList.length; j++) {
        var data = this.warehouseList[j];
        if (tag == "出库仓位") {
          this.tagid = this.virtualInventoryId;
          this.subInventory='';
          this.subinventoryList = [];
        } else {
          this.tagid = this.inputInventoryId;
          this.inputSubInventory='';
          this.inputSubInventoryList = [];
        }
      }
      if(this.subInventory==''&&this.inputSubInventory==''){
        this.searchHandle();
      }
      console.log(this.tagid);
      subinventoryquesttype(this.tagid).then(response => {
        if (response.code === "0") {
          if (tag == "出库仓位") {
            this.subinventoryList = response.data;
            console.log(this.subinventoryList);
          } else {
            this.inputSubInventoryList = response.data;
          }
          this.$forceUpdate();
        }
      });
    },
    selectwareoutclick(tag) {
      console.log(tag);
      if (tag == "出库库位") {
        for (var i = 0; i < this.subinventoryList.length; i++) {
          let item = this.subinventoryList[i];
          if (this.subInventory == item.subInventory) {
            this.subInventoryName = item.subInventoryName;
          }
        }
        this.searchHandle();
      } else if (tag == "入库库位") {
        for (var j = 0; j < this.inputSubInventoryList.length; j++) {
          let data = this.inputSubInventoryList[j];
          if (this.inputSubInventory == data.subInventory) {
            this.inputSubInventoryName = data.subInventoryName;
          }
        }
        this.searchHandle();
      }
    },
    //库位
    selectwearclick(item, tag) {
      console.log(item, tag);
      console.log(this.warehouseList);
      console.log(item.virtualInventoryId);
      console.log(item.inputInventoryId);
      for (var j = 0; j < this.warehouseList.length; j++) {
        var data = this.warehouseList[j];
        if (tag == "出库仓位") {
          item.subInventory = "";
          item.availableInventory = "";
          if (item.virtualInventoryId == data.index) {
            item.virtualInventoryName = data.name;
          }
          this.tagid = item.virtualInventoryId;
        } else {
          if (item.inputInventoryId == data.index) {
            item.inputInventoryName = data.name;
          }
          this.tagid = item.inputInventoryId;
        }
      }
      if (this.purchaselastindex == "工厂调拨") {
        subinventoryquesttype(this.tagid).then(response => {
          if (response.code === "0") {
            console.log(response.data);
            if (tag == "出库仓位") {
              item.subInventory = "";
              this.subInvlist = [];
              for (var a = 0; a < response.data.length; a++) {
                let aitem = response.data[a];
                var str = aitem.subInventoryName;
                var indextaga = str.substring(str.length - 3);
                var indextagb = str.substring(str.length - 5);
                if (indextaga == "工厂库" || indextagb == "(工厂库)") {
                  this.subInvlist.push(aitem);
                  this.$forceUpdate();
                }
              }
              item.subinventoryList = this.subInvlist;
            } else {
              item.inputSubInventory = "";
              item.ifinputSubInventory = true;
              item.inputSubInventoryList = response.data;
            }
            this.$forceUpdate();
          }
        });
      } else {
        subinventoryRollsType(this.tagid).then(response => {
          if (response.code === "0") {
            console.log(response.data);
            if (tag == "出库仓位") {
              item.subInventory = "";
              this.subInvlist = [];
              item.subinventoryList = response.data;
            } else {
              item.inputSubInventory = "";
              item.ifinputSubInventory = true;
              item.inputSubInventoryList = response.data;
            }
            this.$forceUpdate();
          }
        });
      }
    },
    subinventoryclick(item, tag) {
      if (item.subInventory != undefined) {
        if (tag == "出库库位") {
          for (var j = 0; j < item.subinventoryList.length; j++) {
            var data = item.subinventoryList[j];
            if (item.subInventory == data.subInventory) {
              item.subInventoryName = data.subInventoryName;
            }
          }
          if (item.materialCode == "" || item.materialCode == undefined) {
            this.$message({
              message: "请先填写物料编号！",
              type: "error"
            });
          } else {
            let obj = {
              materialCode: item.materialCode,
              inventory: item.virtualInventoryId,
              subInventory: item.subInventory
            };
            if (this.purchaselastindex == "工厂调拨") {
              purchasegetInventory(obj).then(response => {
                if (response.code === "0") {
                  item.availableInventory = response.data;
                  this.$forceUpdate();
                }
              });
            } else if (this.purchaselastindex == "库内调拨") {
              purchasegetInventorylast(obj).then(response => {
                if (response.code === "0") {
                  item.availableInventory = response.data;
                  this.$forceUpdate();
                }
              });
            }
          }
        } else {
          for (var j = 0; j < item.inputSubInventoryList.length; j++) {
            var data = item.inputSubInventoryList[j];
            if (item.inputSubInventory == data.subInventory) {
              item.inputSubInventoryName = data.subInventoryName;
            }
          }
        }
      } else if (item.inputSubInventory != undefined) {
        if (tag == "出库库位") {
          for (var j = 0; j < item.subinventoryList.length; j++) {
            var data = item.subinventoryList[j];
            if (item.subInventory == data.subInventory) {
              item.subInventoryName = data.subInventoryName;
            }
          }
          if (item.materialCode == "" || item.materialCode == undefined) {
            this.$message({
              message: "请先填写物料编号！",
              type: "error"
            });
          } else {
            let obj = {
              materialCode: item.materialCode,
              inventory: item.virtualInventoryId,
              subInventory: item.subInventory
            };
            if (this.purchaselastindex == "工厂调拨") {
              purchasegetInventory(obj).then(response => {
                if (response.code === "0") {
                  item.availableInventory = response.data;
                  this.$forceUpdate();
                }
              });
            } else if (this.purchaselastindex == "库内调拨") {
              purchasegetInventorylast(obj).then(response => {
                if (response.code === "0") {
                  item.availableInventory = response.data;
                  this.$forceUpdate();
                }
              });
            }
          }
        } else {
          for (var j = 0; j < item.inputSubInventoryList.length; j++) {
            var data = item.inputSubInventoryList[j];
            if (item.inputSubInventory == data.subInventory) {
              item.inputSubInventoryName = data.subInventoryName;
            }
          }
        }
      }
    },
    //订单列表展示
    factoryorderlist() {
      let data = {
        materialCode: this.materialCode,
        allocationStatus: this.allocationStatus,
        factoryAllocationCode: this.orderOrRequestCode,
        allocationType: this.typestatusid,
        startTime: this.starttime,
        endTime: this.endtime,
        virtualInventoryId: this.virtualInventoryId,
        subInventory: this.subInventory,
        inputInventoryId: this.inputInventoryId,
        inputSubInventory: this.inputSubInventory
      };
      factorySerch(this.currentPage, this.pageSize, data).then(res => {
        console.log('调拨单列表：', res);
        if (res.code == "0") {
          this.allpage = res.data.total;
          this.requestList = res.data.records;
          for(var i = 0; i < this.requestList.length; i++){
            let item=this.requestList[i];
            item.createTime=timeFormat(item.createTime);
            item.expectedArrivalDate=timeFormat(item.expectedArrivalDate);
            item.expectedArrivalDate=item.expectedArrivalDate.substring(0, 10);
            // 调拨类型分割
            let allocationTypeArr = item.allocationTypeName.split('-');
            item.lAllocationTypeName = allocationTypeArr[0];
            item.tAllocationTypeName = allocationTypeArr[1];

            this.deliveryTypeList.forEach((c, index) => {
              if (item.deliveryType != null) {
                if (item.deliveryType == c.index) {
                  item.deliveryTypeName = c.name;
                }
              } else {
                item.deliveryTypeName = "";
              }
            });
            this.requestList[i].status = this.requestList[i].allocationStatus;
            switch (this.requestList[i].allocationStatus) {
              case "Draft":
                this.requestList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case "Rejected":
                this.requestList[i].actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case "Terminated":
                this.requestList[i].actions = {
                  hasDelete: true
                };
                break;
              default:
                this.requestList[i].actions = {};
                break;
            }
            item.faItemList.forEach((i, index) => {
              if (i.updateTime) {
                i.createTime = i.createTime.substring(0, 10);
              } else {
                i.createTime = "空";
              }
              if (i.validDate) {
                i.validDate = timeFormat(i.validDate);
                i.validDate = i.validDate.substring(0, 10);
              } else {
                i.validDate = "空";
              }
              if (i.purchaseMeasurementUnit != null && i.purchaseMeasurementUnit != "") {
                i.receivedQuantityName = i.receivedQuantity + i.purchaseMeasurementUnit;
              } else {
                i.receivedQuantityName = i.receivedQuantity + "条";
              }
            });
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
    // 供应商点击下拉
    selectsupclick(val) {
      console.log('供应商更新：', val, this.purchaseobj);
      for (var i = 0; i < this.supplierNamepulllist.length; i++) {
        let item = this.supplierNamepulllist[i];
        if (this.supplierPulldata == item.supplierId) {
          this.purchaseobj.supplierCode = item.supplierId;
          this.purchaseobj.supplierName = item.supplierName;
        }
      }
      if (this.allocationType != "" && this.supplierPulldata != "") {
        this.disableadd = false; //是否可以添加和拉取
        this.childtitle = "添加子项";
        this.canpulldatatitle = "拉取数据";
      }
      // this.supplierselectlist = JSON.parse(localStorage.getItem("temp"));
      this.supplierselectlist = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
      // console.log(JSON.parse(localStorage.getItem("temp")));
      if (this.supplierselectlist != null && this.supplierselectlist != "") {
        var supplierselect = [];
        for (var j = 0; j < this.supplierselectlist.length; j++) {
          var data = this.supplierselectlist[j];
          if (this.purchasetypeidname == "客订") {
            // 获取确认书下拉字段
            var obj = {
              saleOrderId: this.saleOrderId,
              saleOrderType: ""
            };
            this.getConfirmation(data, obj);
          }

          if (this.supplierPulldata == data.supplierId) {
            supplierselect.push(data);
          }
        }
        for (var m = 0; m < supplierselect.length; m++) {
          for (var n = 0; n < supplierselect[m].allocationList.length; n++) {
            this.confirmNumbersByMCHandle(supplierselect[m].allocationList[n]);
          }
        }
        this.purchaseobj.faItemList = supplierselect;
        
      }
    },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      console.log("编辑字段呈现方式集合Set");
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let numberInputSet = JSON.parse(JSON.stringify(this.numberInputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      let unitSet = JSON.parse(JSON.stringify(this.unitSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));
      console.log(JSON.parse(JSON.stringify(this.selectSet)));
      console.log(editModeSet);
      if(type == 'pull'){
        //下拉数据
        inputSet.confirmNumbers = false;
        inputSet.materialCode = false;
        inputSet.productCode = false;
        textSet.productCode = true;
        textSet.materialCode = true;
        // selectSet.confirmNumbers={
        //   selectListName: "stockupCodeList",
        //   value: "confirmingCode",
        //   label: "confirmingCode"
        // }
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.selectSet = selectSet;
      editModeSet.unitSet = unitSet;
      editModeSet.datePickerSet = datePickerSet;
      data.editModeSet = editModeSet;
      console.log(editModeSet);
    },
    selectclick(val) {
      console.log('调拨类型更改：', val, this.purchaseobj);
      if (this.allocationType != "") {
        this.disableadd = false; //是否可以添加和拉取
        this.childtitle = "添加子项";
        this.canpulldatatitle = "拉取数据";
      }
      for (var j = 0; j < this.typeList.length; j++) {
        var data = this.typeList[j];
        if (this.allocationType == data.index) {
          var tagName = data.name;
          this.purchaseobj.allocationTypeName = data.name;
          this.purchasetypeidname = tagName.slice(0, 2);
          var index = tagName.lastIndexOf("-");
          this.purchaselastindex = tagName.substring(index + 1, tagName.length);
          console.log(this.purchaselastindex);
          if (this.purchasetypeidname == "客订") {
            this.purchasetagtype = true; //是否展示以销定采
          } else {
            this.purchasetagtype = false;
          }
          for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
            var item = this.purchaseobj.faItemList[i];
            item.allocationTypeName = data.name;
            item.purchasetagtype = this.purchasetagtype;
            (item.virtualInventoryId = ""), (item.inputInventoryId = ""), (item.subInventory = "");
            item.inputSubInventory = "";
            item.subinventoryList = [];
            item.inputSubInventoryList = [];
            if (item.materialCode != undefined && item.materialCode != "") {
              this.getConfirmation(item);
            }
          }
        }
      }
    },
    //添加
    byallocating() {
      localStorage.removeItem("temp");
      this.isDisabledPull = false;  // 允许拉取
      this.disableadd = true;
      this.childtitle = "请先选择调拨类型";
      //    this.canpulldatatitle='请先选择调拨类型'
      this.allocationType = "";
      this.suppliertypeid = "";
      this.purchasetypeid = "";
      this.customerName = "";
      this.saleOrderId = "";
      this.supplierPulldata = "";
      this.tagid = "";
      this.expectedArrivalDate = "";
      this.purchaseobj.faItemList = [];
      this.ifaddsure = true;
      //    this.notpulldata=true;
      this.ifchildshow = false;
      this.purchasetagtype = false;
      this.ifpulldate = true;
      this.ifsupplier = true;
      this.warehouseType();
      this.allotType();
      this.getsupplierNamepull();
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          this.purchaseobj.uuid = response.data;
        }
      });
    },
    //新增子项信息
    addchildmsg() {
      if (this.supplierPulldata == "") {
        this.$message({
          message: "请先选择供应商!",
          type: "error"
        });
      } else {
        this.disableadd = false;
        this.childtitle = "添加子项";
        this.ifchildshow = true;
        var addobj = {
          productCode: "",
          remark: "",
          uuid: "",
          allocationPackages: "",
          allocationQuantityPerPackage: "",
          allocationQuantity: "",
          validDate: "",
          supplierName: "",
          supplierCode: "",
          supplierId: "",
          iftext: false,
          confirmNumbers: "",
          subinventoryList: [],
          stockupCodeList: [],
          inputSubInventoryList: [],
          virtualInventoryId: "",
          virtualInventoryName: "",
          subInventory: "",
          subInventoryName: "",
          inputInventoryId: "",
          inputInventoryName: "",
          inputSubInventory: "",
          inputSubInventoryName: "",
          purchaseMeasurementUnit: "米",
          purchasetagtype: this.purchasetagtype,
          warehouseList: this.warehouseList,
          allocationList: [],
          transferPlanQuantity: '', // 建议调拨数量
          availableInventory: '', // 调出库可用库存
        };
        let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
        this.updateEditModeSet('add', addobj);
        addobj.allocationList.push(addItemDataCopy);
        purchasegetuuid().then(response => {
          if (response.code === '0') {
            addobj.uuid = response.data;
          }
        });
        addobj.allocationList.forEach(item => {
          this.updateEditModeSet('add', item);
          purchasegetuuid().then(res => {
            if (res.code === '0') {
              item.uuid = res.data;
            }
          });
        });
        // addobj.allocationQuantity=addobj.allocationPackages*addobj.allocationQuantityPerPackage;
        addobj.supplierId = this.supplierPulldata;
        this.purchaseobj.faItemList.push(addobj);
        this.$forceUpdate();
        localStorage.setItem("temp", JSON.stringify(this.purchaseobj.faItemList));
        console.log(this.purchaseobj.faItemList);
      }

    },
    deleteHandle(index, item) {
      // 列表删除
      this.dialogdelVisible = true;
      this.delid = item.id;
    },
    delVisibleclick() {
      factorychilddel(this.delid).then(response => {
        if (response.code === "0") {
          this.dialogdelVisible = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.factoryorderlist();
        }
      });
    },
    //删除
    childdel(index, item) {
      if (this.purchaseobj.faItemList.length > 1) {
        this.purchaseobj.faItemList.splice(index, 1);
      } else {
        this.ifchildshow = false;
        this.purchaseobj.faItemList = [];
      }
    },
    submitHandle(index, item) {
      // 列表提交审批
      this.dialogcommitVisible = true;
      this.commitsaveid = item.id;
    },
    //外侧提交审批确定
    delVisibcmtclick() {
      this.loadingoutdave = true;
      factorychildoutsave(this.commitsaveid).then(response => {
        if (response.code === "0") {
          this.$message({
            message: response.data,
            type: "success"
          });
          this.loadingoutdave = false;
          this.dialogcommitVisible = false;
          this.allocationStatus = "Approving";
          this.orderOrRequestCode = "";
          this.activeName = "Approving";
          this.factoryorderlist();
        }
      });
    },
    // 编辑
    async editHandle(index, item) {
      console.log('编辑项：', item);

      // 确认书列表
      // this.confirmNumbersByMCHandle(aData);

      var tagName = item.allocationTypeName;
      var index = tagName.lastIndexOf("-");
      this.purchaselastindex = tagName.substring(index + 1, tagName.length);
      if (item.allocationTypeName.slice(0, 2) == "客订") {
        this.purchasetagtype = true;
      } else {
        this.purchasetagtype = false;
      }
      this.getsupplierNamepull();
      await factorychildshow(item.id).then(response => {
        if (response.code === "0") {
          // 供应商值
          let supplierData = this.supplierNamepulllist.find(item => {
            return item.supplierName == response.data.supplierName;
          });
          if(response.data.deliveryType!=null){
             this.deliveryType = response.data.deliveryType;
          }else{
             this.deliveryType ='1';
          }
          if (response.data.deliveryType) {
            this.deliveryTypeList.forEach(item => {
              if (response.data.deliveryType == item.index) {
                response.data.deliveryTypeName = item.name;
              }
            });
          } else {
            response.data.deliveryTypeName = '';
          }
          this.ifaddsure = true;
          this.ifchildshow = true;
          this.ifpulldate = false;
          this.notpulldata = false;
          this.ifsupplier = false;
          this.allocationType = response.data.allocationType;
          // this.supplierPulldata = response.data.supplierName;
          this.supplierPulldata = supplierData ? supplierData.supplierId : this.supplierPulldata;
          this.customerName = response.data.customerName;
          this.saleOrderId = response.data.saleOrderId;
          this.deliveryTypeName = response.data.deliveryTypeName;
          
          this.expectedArrivalDate = timeFormat(response.data.expectedArrivalDate);
          this.purchaseobj.uuid = response.data.uuid;
          this.purchaseobj.allocationType=response.data.allocationType;
          this.purchaseobj.allocationTypeName=response.data.allocationTypeName;
          this.purchaseobj.deliveryType=response.data.deliveryType;
          this.purchaseobj.deliveryTypeName = response.data.deliveryTypeName;
          this.purchaseobj.supplierName=response.data.supplierName;
          this.purchaseobj.supplierId = supplierData ? supplierData.supplierId : this.purchaseobj.supplierId;
          this.purchaseobj.supplierCode = supplierData ? supplierData.supplierId : this.purchaseobj.supplierId;
          this.purchaseobj.customerName=response.data.customerName;
          this.purchaseobj.saleOrderId=response.data.saleOrderId;
          let arrUpdList=[];
          arrUpdList=response.data.faItemList;
          for (var i = 0; i < arrUpdList.length; i++) {
            let idata = arrUpdList[i];
            idata.validDate = timeFormat(idata.validDate);
            idata.expectedArrivalDate = timeFormat(idata.expectedArrivalDate);
            idata.purchasetagtype = this.purchasetagtype;
            idata.warehouseList=this.warehouseList;
            this.updateEditModeSet('edit', idata);
            // 第三层数据
            for (var j = 0; j < idata.allocationList.length; j++) {
              let aData = idata.allocationList[j];
              this.updateEditModeSet('edit', aData);
              // 获取确认书列表
              this.confirmNumbersByMCHandle(aData);
            }

            //编辑时获取每条确认书下拉数据
            // this.getConfirmation(idata);
           
            // New
            if (this.purchaselastindex == "工厂调拨") {
              subinventoryquesttype(idata.virtualInventoryId).then(response => {
                if (response.code === "0") {
                  idata.subinventoryList = response.data;
                  this.subInvlist = [];
                  for (var a = 0; a < response.data.length; a++) {
                    let aitem = response.data[a];
                    var str = aitem.subInventoryName;
                    var aa = str.substring(str.length - 3);
                    if (aa == "工厂库") {
                      this.subInvlist.push(aitem);
                    }
                  }
                  idata.subinventoryList = this.subInvlist;
                  console.log(this.subInvlist)
                }
              });
            }
          }
          this.purchaseobj=response.data;
          this.$forceUpdate();
          console.log(this.purchaseobj);
        }
      });
    },

    cancelEditHandle() {
      // 取消编辑
      this.ifaddsure = false;
      this.notpulldata = true;
      this.savetype = "";
      this.customerName = "";
      this.committype = "";
      this.purchaselastindex = "";
      localStorage.removeItem("temp");
    },
    pullDataHandle() {
      // 拉取数据
      this.isDisabledPull = true;
      if (this.allocationType == "") {
        this.isDisabledPull = false;
        this.$message({
          message: "请选择调拨类型再拉取！",
          type: "error"
        });
      } else {
        if (this.purchasetypeidname == "客订") {
          this.purchasetagtype = true;  // 是否展示客户名称和销售订单编码
          var obj = {
            saleOrderId: this.saleOrderId,
            saleOrderType: ""
          };
          this.theguestbook(obj); //客订
        } else {
          this.purchasetagtype = false;
          this.nottheguestbook(); //非客订
        }
      }
    },
    // 客订
    theguestbook(obj) {
      this.tableLoading = true;
      purchasegetdata(obj).then(response => {
        console.log('客订拉取数据：', response);
        if (response.code === '0') {
          if (!response.data) {
            this.$message({
              type: 'error',
              message: '无拉取数据！'
            });
            this.tableLoading = false;
            return false;
          }

          this.notpulldata = false; //点击拉取后不能在拉取
          this.ifpulldate = false; //请求类型和仓位不能再选
          this.ifchildshow = true; //判断有无数据的时候展示提示添加图
          this.customerName = response.data.customerName;
          this.saleOrderId = response.data.saleOrderId;
          this.pricList = response.data.saleOrderItemList;  // this.purchaseobj.faItemList 二级数据

          let editListCopy = JSON.parse(JSON.stringify(this.pricList));
          // let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));  // 三级数据
          for (var i = 0; i < editListCopy.length; i++) {
            let item = editListCopy[i];
            let confirmNumberList = [];
            let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));  // 三级数据
            this.updateEditModeSet('pull', item);
            //给拉取的每条数据添加uuid
            purchasegetuuid().then(response => {
              if (response.code === "0") {
                item.uuid = response.data;
                this.$forceUpdate();
              }
            });
            //获取确认书下拉字段
            // this.getConfirmation(item, obj);
            // 获取确认书列表
            getConfirmNumbersByMC(item.materialCode).then(res => {
              console.log('根据物料编码获取确认书列表：', res);
              if (res.code === '0') {
                addItemDataCopy.confirmNumberList = res.data;
              }
            });
            purchasegetuuid().then(res => {
              if (res.code === '0') {
                addItemDataCopy.uuid = res.data;
              }
            });
            addItemDataCopy.materialCode = item.materialCode;
            item.childifpulldate = true;
            item.iftext = true; //判断拉取数据显示是否可以填写
            item.ifstock = false; //是否展示产品下拉
            item.productCode = item.productCode;
            item.materialCode = item.materialCode;
            item.suggestQuantity = item.quantity;
            item.warehouseList=this.warehouseList
            item.validDate = timeFormat(response.data.lastDeliveryDate);  // 期望交期
            item.expectedArrivalDate = timeFormat(response.data.lastDeliveryDate);
            item.allocationPackages='';
            item.allocationQuantityPerPackage='';
            item.allocationQuantity='';
            item.virtualInventoryId='';
            item.subInventory='';
            item.availableInventory='';
            item.inputInventoryId='';
            item.inputSubInventory='';
            item.allocationList = [];
            this.updateEditModeSet('pull', addItemDataCopy);
            item.allocationList.push(addItemDataCopy);  // 第三层列表
            this.updateEditModeSet('pull', item);
            // for (var m = 0; m < item.allocationList.length; m++) {
            //   let data = item.allocationList[m];
            //   this.updateEditModeSet('pull', data);
            //   data.materialCode = item.materialCode;
            //   data.confirmNumberList = confirmNumberList;
              
            //   // 获取确认书列表
            //   // this.confirmNumbersByMCHandle(data);
            // }
            
            this.purchaseobj.faItemList.push(item);
            localStorage.setItem("temp", JSON.stringify(this.purchaseobj.faItemList));
            console.log('拉取填充后数据：', this.purchaseobj);
          }
          this.$forceUpdate();
        } else {
          this.notpulldata = true; //取消点击拉取后不能在拉取
          this.ifpulldate = true; //请求类型和仓位不能再选
          this.tableLoading = false;
        }
        this.isDisabledPull = false;
      });



      // purchasegetdata(obj).then(response => {
      //   console.log('客订拉取数据：', response);
      //   if (response.code === "0") {
      //     if (response.data == null) {
      //       this.$message({
      //         message: "无数据可拉取！",
      //         type: "error"
      //       });
      //       this.tableLoading = false;
      //     } else {
      //       this.tableLoading = false;
      //       this.notpulldata = false; //点击拉取后不能在拉取
      //       this.ifpulldate = false; //请求类型和仓位不能再选
      //       this.ifchildshow = true; //判断有无数据的时候展示提示添加图
      //       this.customerName = response.data.customerName;
      //       this.saleOrderId = response.data.saleOrderId;
      //       this.pricList = response.data.saleOrderItemList;
         
      //       let editListCopy = JSON.parse(JSON.stringify(this.pricList));
      //       let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      //       console.log('拉区间谨慎地素：', this.pricList);
      //       for (var i = 0; i < editListCopy.length; i++) {
      //         let item = editListCopy[i];
      //         this.updateEditModeSet('pull', item);
      //         //给拉取的每条数据添加uuid
      //         purchasegetuuid().then(response => {
      //           if (response.code === "0") {
      //             item.uuid = response.data;
      //             this.$forceUpdate();
      //           }
      //         });
      //         //获取确认书下拉字段
      //         // this.getConfirmation(item, obj);
      //         addItemDataCopy.materialCode = item.materialCode;
      //         purchasegetuuid().then(response => {
      //           if (response.code === "0") {
      //             addItemDataCopy.uuid = response.data;
      //           }
      //         });
      //         // 获取确认书列表
      //         this.confirmNumbersByMCHandle(addItemDataCopy);
      //         item.childifpulldate = true;
      //         item.iftext = true; //判断拉取数据显示是否可以填写
      //         item.ifstock = false; //是否展示产品下拉
      //         item.productCode = item.productCode;
      //         item.materialCode = item.materialCode;
      //         item.suggestQuantity = item.quantity;
      //         item.warehouseList=this.warehouseList
      //         item.validDate = timeFormat(response.data.orderUpdateTime);  // 期望交期
      //         item.expectedArrivalDate = timeFormat(response.data.orderUpdateTime);
      //         item.allocationPackages='';
      //         item.allocationQuantityPerPackage='';
      //         item.allocationQuantity='';
      //         item.virtualInventoryId='';
      //         item.subInventory='';
      //         item.availableInventory='';
      //         item.inputInventoryId='';
      //         item.inputSubInventory='';
      //         item.allocationList = [];
      //         this.updateEditModeSet('pull', addItemDataCopy);
      //         item.allocationList.push(addItemDataCopy);  // 第三层列表
      //         this.updateEditModeSet('pull', item);
      //         this.purchaseobj.faItemList.push(item);
      //         // localStorage.setItem("temp", JSON.stringify(this.purchaseobj.faItemList));
      //         console.log('拉取填充后数据：', this.purchaseobj);
      //         // let faItemListCopy = JSON.parse(JSON.stringify(this.purchaseobj.faItemList));
      //         // for (var m = 0; m < faItemListCopy.length; m++) {
      //         //   for (var n = 0; n < faItemListCopy[m].allocationList.length; n++) {
      //         //     let data = faItemListCopy[m].allocationList[n];
      //         //     data = addItemDataCopy;
      //         //     data.materialCode = faItemListCopy[m].materialCode;
      //         //     this.updateEditModeSet('pull', data);
      //         //     // 获取确认书列表
      //         //     this.confirmNumbersByMCHandle(data);
      //         //   }
      //         // }
      //         // this.purchaseobj.faItemList = faItemListCopy;
      //       }
      //       this.$forceUpdate();
      //     }
      //   } else {
      //     this.notpulldata = true; //取消点击拉取后不能在拉取
      //     this.ifpulldate = true; //请求类型和仓位不能再选
      //     this.tableLoading = false;
      //   }
      // });
    },
    //非客订
    nottheguestbook() {
      this.tableLoading = true;
      let params = {
        businessType: '',
        unit: 'W',
        startTime: getNowDate()
      };
      pullCustomerOrderRequest(params).then(res => {
        console.log('非客订数据：', res);
        if (res.code === '0') {
          let editDataCopy = JSON.parse(JSON.stringify(this.purchaseobj));
          let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
          this.notpulldata = false; //点击拉取后不能在拉取
          this.ifpulldate = false; //请求类型和仓位不能再选
          this.ifchildshow = true; //判断有无数据的时候展示提示添加图
          if (!res.data || !res.data.length) {
            this.$message({
              type: 'error',
              message: '无数据可拉取！'
            });
            return false;
          }

          // for (var i = 0; i < res.data.length; i++) {
          //   let pData = res.data[i];
          //   getUUID().then(res => {
          //     if (res.code === '0') {
          //       pData.uuid = res.data;
          //     }
          //   });
          //   this.updateEditModeSet('pull', pData);
          //   pData.transferPlanQuantity = pData.readyPlanQuantity;
          //   pData.subInventoryList = this.subInventoryList;
          //   pData.allocationList = [];
          //   pData.allocationList.push(addItemDataCopy);
          //   pData.allocationList.forEach(item => {
          //     this.updateEditModeSet('pull', item);
          //     purchasegetuuid().then(res => {
          //       if (res.code === '0') {
          //         item.uuid = res.data;
          //       }
          //     });
          //   });
          //   // this.getProductCode(pData);
          //   this.strongItemInfoHandle(pData);
          //   editDataCopy.faItemList.push(pData);
          //   this.$forceUpdate();
          // }
          // this.purchaseobj = editDataCopy;
          // this.$forceUpdate();


          for (var i = 0; i < res.data.length; i++) {
            let pData = res.data[i];
            getUUID().then(res => {
              if (res.code === '0') {
                pData.uuid = res.data;
              }
            });
            pData.warehouseList = this.warehouseList;
            pData.transferPlanQuantity = pData.adviceQuantity;
            // pData.purchaseMeasurementUnit = '';
            this.updateEditModeSet('pull', pData);
            this.strongItemInfoHandle(pData);
            editDataCopy.faItemList.push(pData);
            this.$forceUpdate();
          }
          this.purchaseobj = editDataCopy;
          this.$forceUpdate();
        } else {
          this.notpulldata = true; //取消点击拉取后不能在拉取
          this.ifpulldate = true; //请求类型和仓位不能再选
          this.tableLoading = false;
        }
        this.isDisabledPull = false;
      });


      // purchasegetdatastok().then(response => {
      //   console.log('非客订拉取数据：', response);
      //   if (response.code === "0") {
      //     if (response.data == null || response.data == "") {
      //       this.$message({
      //         message: "无数据可拉取！",
      //         type: "error"
      //       });
      //       this.tableLoading = false;
      //     } else {
      //       this.notpulldata = false; //点击拉取后不能在拉取
      //       this.ifchildshow = true; //判断有无数据的时候展示提示添加图
      //       this.ifpulldate = false; //请求类型和仓位不能再选
      //       this.pricList = response.data;
      //       console.log(this.pricList);
      //       let editListCopy = JSON.parse(JSON.stringify(this.pricList));
      //       for (var i = 0; i < editListCopy.length; i++) {
      //         let item = editListCopy[i];
      //         this.updateEditModeSet("add", item,pulldata);
      //         purchasegetuuid().then(response => {
      //           if (response.code === "0") {
      //             item.uuid = response.data;
      //           }
      //         });
      //         item.allocationPackages = item.transferPlanPackages;
      //         item.allocationQuantityPerPackage = item.defaultQuantityPerPackage;
      //         item.validDate = dateToStr(item.predictTime);
      //         item.inputInventoryId = item.inventory;
      //         item.productCode = "";
      //         item.materialCode = item.materialCode;
      //         item.productCodeList = item.productCodeList;
      //         item.purchasetagtype = this.purchasetagtype;
      //         item.childifpulldate = true;
      //         item.iftext = true; //判断拉取数据显示是否可以填写
      //         item.ifstock = true;
      //         //获取确认书下拉字段
      //         this.getConfirmation(item);
      //         // this.selectwearclick(item, "入库仓位");
      //         this.updateEditModeSet("add", item,pulldata);
      //         this.purchaseobj.faItemList.push(item);
      //         localStorage.setItem("temp", JSON.stringify(this.purchaseobj.faItemList));
      //         this.tableLoading = false;
      //       }
      //     }
      //   } else {
      //     this.tableLoading = false;
      //   }
      // });
    },

    strongItemInfoHandle(data) {
      let addItemDataCopy = JSON.parse(JSON.stringify(this.addItemData));
      // data.virtualInventoryId = '';
      // data.subInventoryName = '';
      // data.inputInventoryId = '';
      // data.inputSubInventoryName = '';
      // data.validDate = '';
      // data.remark = '';
      // data.transferPlanQuantity = '';
      // data.availableInventory = '';
      // data.confirmNumbers = '';
      // data.allocationPackages = '';
      // data.allocationQuantityPerPackage = '';
      // data.allocationQuantity = '';
      // data.subinventoryList = [];
      // data.inputSubInventoryList = [];
      data.allocationList = [];
      addItemDataCopy.materialCode = data.materialCode;
      // 计量单位
      this.getMeasurementUnit(addItemDataCopy);
      // 确认书列表
      this.confirmNumbersByMCHandle(addItemDataCopy);
      getUUID().then(res => {
        if (res.code === '0') {
          addItemDataCopy.uuid = res.data;
        }
      });
      this.updateEditModeSet('pull', addItemDataCopy);
      data.allocationList.push(addItemDataCopy);
      this.$forceUpdate();
    },

    //获取确认书下拉接口
    getConfirmation(item) {
      let obj = {
        materialCode: item.materialCode,
        supplierName: item.supplierName
      };
      purchasegetstockup(obj).then(response => {
        if (response.code === "0") {
          item.stockupCodeList = response.data;
          this.$forceUpdate();
        }
      });
    },
    //去重
    unique(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    updateEditHandle(tag) {
      // 保存/提交审批
      this.purchaseobj.allocationType = this.allocationType;
      this.purchaseobj.saleOrderId = this.saleOrderId;
      this.purchaseobj.customerName = this.customerName;
      // this.purchaseobj.supplierName = this.supplierPulldata;
      this.purchaseobj.supplierId = this.supplierPulldata;
      this.purchaseobj.applicant = this.$store.getters.getUserName;
      this.purchaseobj.applicantDepartment = this.$store.getters.getdepartmentId;
      this.purchaseobj.applicantName = this.$store.state.realName;
      this.purchaseobj.applicantDepartmentName = this.$store.state.departments[0].name;
      this.purchaseobj.expectedArrivalDate = this.expectedArrivalDate;
      this.purchaseobj.deliveryType = this.deliveryType;
      this.submitCheck();  // 校验是否通过
      // if (this.nullboolean == false || this.purchaseobj.allocationType == "" || this.purchaseobj.supplierName == "") {
      //   this.$message({
      //     message: "必填项和调拨类型、供应商不能为空!!",
      //     type: "error"
      //   });
      //   return false;
      // }

      // 重构
      if (this.purchaseobj.allocationType == '') {
        this.$message({
          message: "请选择调拨类型！",
          type: "error"
        });
        return false;
      }
      if (this.purchaseobj.supplierId == '') {
        this.$message({
          message: "请选择供应商！",
          type: "error"
        });
        return false;
      }
      // 重构 end
      
      if (this.expectedArrivalDate == "") {
        this.$message({
          message: "预计到货日期不能为空!!",
          type: "error"
        });
        return false;
      }
      // if (this.greaterthan == false) {
      //   this.$message({
      //     message: "调拨数量不能大于调出库可用库存!!",
      //     type: "error"
      //   });
      //   return false;
      // }
      if (this.notallot == false) {
        this.$message({
          message: "出库仓位+库位 与 入库仓位 + 库位相同不能进行调拨!!",
          type: "error"
        });
        return false;
      }
      if (this.prohibit == false) {
        this.$message({
          message: "每条数据的供应商必须是同一个!!",
          type: "error"
        });
        return false;
      }
      if(this.purchaseobj.faItemList==''){
        this.$message({
          message: "请添加子项数据!!",
          type: "error"
        });
        return false;
      }
      for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
        let fData = this.purchaseobj.faItemList[i];
        if (!fData.materialCode) {
          this.$message({
            message: "请输入物料编号！",
            type: "error"
          });
          return false;
        }
        if (!fData.productCode) {
          this.$message({
            message: "产品编号不能为空！",
            type: "error"
          });
          return false;
        }
        if (!fData.virtualInventoryId) {
          this.$message({
            message: "请选择出库仓位！",
            type: "error"
          });
          return false;
        }
        if (!fData.subInventoryName) {
          this.$message({
            message: "请选择出库库位！",
            type: "error"
          });
          return false;
        }
        if (!fData.inputInventoryId) {
          this.$message({
            message: "请选择入库仓位！",
            type: "error"
          });
          return false;
        }
        if (!fData.inputSubInventoryName) {
          this.$message({
            message: "请选择入库库位！",
            type: "error"
          });
          return false;
        }
        if (!fData.validDate) {
          this.$message({
            message: "请选择期望交期！",
            type: "error"
          });
          return false;
        }
        if (!fData.availableInventory) {
          this.$message({
            message: "调出库可用库存不能为空！",
            type: "error"
          });
          return false;
        }
        for (var j = 0; j < this.purchaseobj.faItemList[i].allocationList.length; j++) {
          let data = this.purchaseobj.faItemList[i].allocationList[j];
          if (!data.confirmNumbers) {
            this.$message({
              message: "请选择确认书号！",
              type: "error"
            });
            return false;
          }
          if (this.purchaseobj.faItemList[i].purchaseMeasurementUnit == '米') {
            if (!data.allocationPackages || !data.allocationQuantityPerPackage || !data.allocationQuantity) {
              this.$message({
                message: "请输入调拨数量！",
                type: "error"
              });
              return false;
            }
            // if (!data.allocationQuantityPerPackage) {
            //   this.$message({
            //     message: "请输入调拨数量！",
            //     type: "error"
            //   });
            //   return false;
            // }
            // if (!data.allocationQuantity) {
            //   this.$message({
            //     message: "请输入调拨数量！",
            //     type: "error"
            //   });
            //   return false;
            // }
          } else {
            if (!data.allocationQuantity) {
              this.$message({
                message: "请输入调拨数量！",
                type: "error"
              });
              return false;
            }
          }
          if (data.allocationQuantity > fData.availableInventory) {
            this.$message({
              message: "调拨数量不能大于调出库可用库存！",
              type: "error"
            });
            return false;
          }
          
        }
      }
      if (tag == "save") {
        this.loadingsave = true;
        this.committag = "保存";
        this.purchaseobj.submitType = 1;
        this.orderOrRequestCode = "";
        this.allocationStatus = "Draft";
        this.activeName = "Draft";
      } else {
        this.loadingcommit = true;
        this.committag = "提交";
        this.purchaseobj.submitType = 2;
        this.orderOrRequestCode = "";
        this.allocationStatus = "Approving";
        this.activeName = "Approving";
      }
      console.log(this.purchaseobj);
      factorychildadd(this.purchaseobj).then(response => {
        if (response.code === "0") {
          this.$message({
            message: this.committag + "成功",
            type: "success"
          });
          localStorage.removeItem("temp");
          this.ifaddsure = false;
          this.loadingsave = false;
          this.loadingcommit = false;
          this.factoryorderlist();
        } else {
          this.loadingsave = false;
          this.loadingcommit = false;
        }
        setTimeout(() => {
          this.loadingsave = false;
          this.loadingcommit = false;
        }, 10000);
      });
    },
    //提交校验
    submitCheck() {
      for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
        var item = this.purchaseobj.faItemList[i];
        if (item.purchaseMeasurementUnit == "米") {
          console.log('进入米的判断类型')
          if (
            item.productCode == "" ||
            item.materialCode == "" ||
            // item.allocationPackages == "" ||
            // item.allocationQuantityPerPackage == "" ||
            // item.allocationQuantityPerPackage == undefined ||
            item.virtualInventoryId == "" ||
            item.subInventory == "" ||
            item.inputInventoryId == "" ||
            item.inputSubInventory == "" ||
            item.validDate == "" ||
            item.validDate == null
          ) {
            this.nullboolean = false;
            break;
          } else {
            this.nullboolean = true;
          }
        } else {
          console.log('进入非米的判断类型')
          if (
            item.productCode == "" ||
            item.materialCode == "" ||
            item.virtualInventoryId == "" ||
            item.subInventory == "" ||
            item.inputInventoryId == "" ||
            item.inputSubInventory == "" ||
            item.validDate == "" ||
            item.validDate == null
          ) {
            this.nullboolean = false;
            break;
          } else {
            this.nullboolean = true;
          }
        }

        if (item.allocationQuantity > item.availableInventory) {
          this.greaterthan = false;
          break;
        } else {
          this.greaterthan = true;
        }
        if (item.virtualInventoryId == item.inputInventoryId && item.subInventory == item.inputSubInventory) {
          this.notallot = false;
          break;
        } else {
          this.notallot = true;
        }

        for (var j = i + 1; j < this.purchaseobj.faItemList.length; j++) {
          let jitem = this.purchaseobj.faItemList[j];
          if (item.supplierName != jitem.supplierName) {
            this.prohibit = false;
            return false;
          } else {
            this.prohibit = true;
          }
        }
        console.log(this.nullboolean);
      }
    },
    switchTabHandle(tab) {
      // tab切换
      this.tableLoading = true;
      this.currentPage = 1;
      this.requestList = [];
      switch (tab.name) {
        case "All":
          this.allocationStatus = "";
          this.factoryorderlist();
          break;
        case "Draft":
          this.allocationStatus = "Draft";
          this.factoryorderlist();
          break;
        case "Approving":
          this.allocationStatus = "Approving";
          this.factoryorderlist();
          break;
        case "Approved":
          this.allocationStatus = "Approved";
          this.factoryorderlist();
          break;
        case "Rejected":
          this.allocationStatus = "Rejected";
          this.factoryorderlist();
          break;
        case "Terminated":
          this.allocationStatus = "Terminated";
          this.factoryorderlist();
          break;
        default:
          break;
      }
    },
    //加减输入框触发
    handleChange(value) {
      if (value == undefined) {
        this.$message({
          message: "数值不能为空,请重新输入！！！",
          type: "error"
        });
      } else {
        for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
          let data = this.purchaseobj.faItemList[i];
          if (data.allocationPackages.toString().length > 9) {
            this.$message({
              message: "超长字符,请重新输入！",
              type: "error"
            });
            data.allocationPackages = "";
          } else if (data.allocationQuantityPerPackage.toString().length > 9) {
            this.$message({
              message: "超长字符,请重新输入！",
              type: "error"
            });
            data.allocationQuantityPerPackage = "";
          }
        }
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.factoryorderlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.factoryorderlist();
    },
    async confirmNumbersByMCHandle(item) {
      // 根据物料编码获取确认书列表
      await getConfirmNumbersByMC(item.materialCode).then(res => {
        console.log('根据物料编码获取确认书列表：', res);
        if (res.code === '0') {
          item.confirmNumberList = res.data;
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
            
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/index.scss";

.center {
  text-align: center;
}
.factoryorder {
  border-radius: 6px;
  padding: 10px 0px;
  background: #ffffff;
  // padding-bottom: 50px;
}
.container_title {
  height: auto;
  margin: 10px 0;
}
ul.parentlist {
  cursor: pointer;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}

</style>
<style>
.el-tabs__content {
  text-align: start;
}
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
</style>