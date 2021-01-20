<template>
  <div class="container goDown">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">入库单号：</span>
          <el-input class="input_single w200 mr10" v-model="goDownNumber" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">入库类型：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="goDownType"
            @change="searchHandle"
            placeholder="请选择入库类型"
          >
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in goDownTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">创建人：</span>
          <el-input class="input_single w200 mr10" v-model="founder" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">创建时间：</span>
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
          <span class="tag">物料号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="inline_block mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="supplierCode"
            placeholder="请选择"
            @change="searchHandle"
          >
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierCode"
              :label="item.supplierCode"
              :value="item.supplierCode"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">预收货清单编号：</span>
          <el-input
            class="input_single w200 mr10"
            v-model.trim="prepareReceiptCode"
            placeholder="请输入"
          ></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">发货时间：</span>
          <el-date-picker
            class="mr10"
            v-model="delivery"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="deliveryChange"
            @input="deliveryChange"
          ></el-date-picker>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">收货批次号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="receiveNumber" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">发票批次号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="invoiceNumber" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">状态：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="status"
            @change="searchHandle"
            placeholder="请选择入库类型"
          >
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in statusList"
              :key="item.index"
              :label="item.name"
              :value="item.index"
            ></el-option>
          </el-select>
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
        <el-tab-pane label="入库差异列表" name="All">
          <el-table
            class="table_list"
            ref="multipleTable"
            v-loading="tableLoading"
            :data="goDownList"
            element-loading-text="拼命加载中"
            row-key="id"
            :expand-row-keys="expands"
            @row-click="rowClick"
            border
            fit
            stripe
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  class="table_list"
                  :ref="'childMultipleTable_' + scope.row.id"
                  v-loading="childListLoading"
                  :data="scope.row.diffInItems"
                  element-loading-text="拼命加载中"
                  border
                  fit
                >
                  <el-table-column fixed label="行号">
                    <template slot-scope="{ row }">{{ row.lineNum }}</template>
                  </el-table-column>
                  <el-table-column label="物料编号">
                    <template slot-scope="{ row }">{{ row.materialCode }}</template>
                  </el-table-column>
                  <el-table-column label="收货批次号">
                    <template slot-scope="{ row }">{{ row.batchNo }}</template>
                  </el-table-column>
                  <el-table-column label="发票批次号">
                    <template slot-scope="{ row }">{{ row.factoryBatchNo }}</template>
                  </el-table-column>
                  <el-table-column label="收货数量">
                    <template slot-scope="{ row }">{{ row.receiveQuantity }}</template>
                  </el-table-column>
                  <el-table-column label="发票数量">
                    <template slot-scope="{ row }">{{ row.invoiceQuantity }}</template>
                  </el-table-column>
                  <el-table-column label="收货时间">
                    <template slot-scope="{ row }">{{ row.receiveTime }}</template>
                  </el-table-column>
                  <el-table-column label="收货仓位">
                    <template slot-scope="{ row }">{{ row.inventoryName }}</template>
                  </el-table-column>
                  <el-table-column label="收货库位">
                    <template slot-scope="{ row }">{{ row.subInventoryName }}</template>
                  </el-table-column>
                  <el-table-column label="预收货清单编号">
                    <template slot-scope="{ row }">{{ row.prepareReceiptCode }}</template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">{{ row.supplierCode }}</template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="{ row }">{{ row.disposeStatusName }}</template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right">
                    <template slot-scope="{ row, $index }">
                      <div v-if="row.disposeStatus === 'Undisposed'">
                        <el-button
                          class="el-icon-thumb"
                          type="primary"
                          circle
                          size="mini"
                          title="处理"
                          :disabled="row.purchaseOrderId || row.cancelStatus === true"
                          @click.stop="handle($index, row)"
                        ></el-button>
                      </div>
                      <!-- <el-button class="el-icon-document-delete" type="danger" circle size="mini" :title="row.purchaseOrderId ?  '不可取消' : (row.cancelStatus === true ? '已取消' : '取消')" :disabled="row.purchaseOrderId || row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button> -->
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="入库单号">
              <template slot-scope="{ row }">{{ row.diffCode}}</template>
            </el-table-column>
            <el-table-column label="入库类型">
              <template slot-scope="{ row }">{{ row.diffinTypeName }}</template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="{ row }">{{ row.createTime }}</template>
            </el-table-column>
            <el-table-column label="创建人">
              <template slot-scope="{ row }">{{ row.createUser }}</template>
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
</template>
<script>
import { goDownDifferenceList, fabrictypedictionaries, updateDiffInType, subinventoryquesttype } from "@/api/module/goDownDifference.js";
import { supplierDictList } from "@/api/publicApi.js";
import { warehousequesttype } from "@/api/module/dictionariesApi.js";
import { timeFormat, getTimeRange, excelDateFormatToDate, timeFormatGMT } from "@/utils/index.js";
export default {
  name: "goDownDifference",
  data() {
    return {
      goDownNumber: "",
      goDownTypeList: [],
      goDownType: "",
      founder: "",
      dateVal: "",
      supplierCode: "",
      supplierList: [],
      materialCode: "",
      prepareReceiptCode: "",
      deliveryTime: "",
      receiveNumber: "",
      invoiceNumber: "",

      isAll: "",
      activeName: "All",
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      //虚拟
      differenceType: "",
      supplierName: "",
      sourceMaterialCode: "",
      goDownList: [],
      //
      startCreateTime: "",
      endCreateTime: "",
      startReceiveTime: "",
      endReceiveTime: "",
      warehouseList: [],
      statusList: [],
      subinventoryList: [],
      tableLoading: true,
      expands:[],
    };
  },
  mounted() {
    //this.getDiffInType();
    this.fun_date();
  },
  created() {
    this.getSupplierDictList();
    this.getDisposeStatus();
    this.getDiffInType();
    this.getVirtualInventory();
  },
  methods: {
    getGoDownList() {
      let data = {
        diffCode: this.goDownNumber,
        diffinType: this.goDownType,
        createUser: this.founder,
        startCreateTime: this.startCreateTime,
        endCreateTime: this.endCreateTime,
        materialCode: this.materialCode,
        supplierCode: this.supplierCode,
        prepareReceiptCode: this.prepareReceiptCode,
        startReceiveTime: this.startReceiveTime,
        endReceiveTime: this.endReceiveTime,
        batchNo: this.receiveNumber,
        factoryBatchNo: this.invoiceNumber,
        disposeStatus: this.status
      };
      goDownDifferenceList(this.currentPage, this.pageSize, data).then(res => {
        console.log("入库差异列表：", res);
        if (res.code === "0") {
          this.goDownList = res.data.records;
          this.total = res.data.total;
          this.goDownList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }
            if (this.goDownTypeList.length == 0) {
              this.getDiffInType();
            }
            console.log(this.goDownTypeList);
            this.goDownTypeList.forEach((val, index) => {
              if (item.diffinType == val.index) {
                item.diffinTypeName = val.name;
              }
            });
            for (let j = 0; j < item.diffInItems.length; j++) {
              var childData = item.diffInItems[j];
              this.warehouseList.forEach((a, index) => {
                if (childData.inventory == a.index) {
                  childData.inventoryName = a.name;
                }
              });
              this.statusList.forEach((val, index) => {
                if (childData.disposeStatus == val.index) {
                  childData.disposeStatusName = val.name;
                }
              });
              subinventoryquesttype(childData.inventory).then(response => {
                if (response.code === "0") {
                  var subinventoryList = response.data;
                  subinventoryList.forEach((val, index) => {
                    if (item.diffInItems[j].subInventory == val.subInventory) {
                      item.diffInItems[j].subInventoryName = val.subInventoryName;
                    }
                  })
                }
              });
              childData.receiveTime ? (childData.receiveTime = timeFormat(childData.receiveTime)) : "";
            }
          });
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
        setTimeout(() => {
          this.tableLoading = false;
        }, 10000);
      });
    },
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
    // 固定展示为两周前的时间范围
    fun_date() {
      console.log(getTimeRange(-14)); //两周前的日期
      this.dateVal = getTimeRange(-14);
      this.delivery = getTimeRange(-14);
      this.searchHandle();
    },
    searchHandle() {
      this.goDownList=[];
      this.currentPage = 1;
      if (this.dateVal) {
        this.startCreateTime = this.dateVal[0];
        this.endCreateTime = this.dateVal[1];
      } else {
        this.startCreateTime = "";
        this.endCreateTime = "";
      }
      if (this.delivery) {
        this.startReceiveTime = this.delivery[0];
        this.endReceiveTime = this.delivery[1];
      } else {
        this.startReceiveTime = "";
        this.endReceiveTime = "";
      }
      this.getGoDownList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoDownList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoDownList();
    },
    dateValChange(){
      this.searchHandle()
    },
    deliveryChange(){
      this.searchHandle()
    },
    getSupplierDictList() {
      // 供应商列表
      supplierDictList().then(res => {
        console.log("供应商列表：", res);
        if (res.code === "0") {
          this.supplierList = res.data;
        }
      });
    },
    //点击处理
    handle(index, item) {
      console.log(item);
      updateDiffInType(item.id).then(res => {
        if (res.code === "0") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        }
        this.getGoDownList();
      });
    },
    //入库类型
    getDiffInType() {
      fabrictypedictionaries("DiffInType").then(response => {
        if (response.code === "0") {
          this.goDownTypeList = response.data;
        }
      });
    },
    //状态
    getDisposeStatus() {
      fabrictypedictionaries("DisposeStatus").then(response => {
        if (response.code === "0") {
          this.statusList = response.data;
        }
      });
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
    //库位
    getSubinventory(val) {
      subinventoryquesttype(val).then(response => {
        if (response.code === "0") {
          console.log("11111", response.data);
          this.subinventoryList = response.data;
        }
      });
    }
  }
};
</script>