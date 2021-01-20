<template>
  <div class="container popularGoods">
    <div class="actions_part clearfix" v-if="dialogaddVisible==false">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select class="select_single w200 mr10" filterable @change="getPopularGoodsList" v-model="supplierCode" placeholder="请选择">
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierCode"
              :value="item.supplierId"
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

    <!--组件应用-->
    <div id v-if="dialogaddVisible==false">
      <div class="table_part clearfix" v-loading="tableLoading">
        <!-- <Table
          :tableList="requestList"
          :parentData="parentData"
          :childData="childData"
          :tableFieldsList="allFieldList"
          :tableParentFieldsList="parentFieldsList"
          @editHandle="factoryupd"
          @deleteHandle="factorydel"
        ></Table> -->
        <el-table
          class="table_list"
          ref="multipleTable"
          v-loading="listLoading"
          :data="requestList"
           row-key="supplierCode"
          :expand-row-keys="expands"
          @row-click="rowClick"
          border
          fit
          stripe>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="actions_wrap mb20 clearfix">
                <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
              </div>
              <el-table
                class="table_list"
                :ref="'childMultipleTable_' + scope.row.id"
                v-loading="childListLoading"
                :data="scope.row.factoryGoodsList"
                border
                fit>
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
                <el-table-column label="快货类型">
                  <template slot-scope="{ row }">
                    {{ row.goodsTypeName }}
                  </template>
                </el-table-column>
                <el-table-column label="现货">
                  <template slot-scope="{ row }">
                    {{ row.spotGoodsQuantity }}
                  </template>
                </el-table-column>
                <el-table-column label="15天快货">
                  <template slot-scope="{ row }">
                    {{ row.halfMonthQuantity }}
                  </template>
                </el-table-column>
                <el-table-column label="30-45天快货">
                  <template slot-scope="{ row }">
                    {{ row.afterMonthQuantity }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="序号">
            <template slot-scope="{ row }">
              {{ row.idIndex }}
            </template>
          </el-table-column>
          <el-table-column label="供应商">
            <template slot-scope="{ row }">
              {{ row.supplierCode }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间">
            <template slot-scope="{ row }">
              {{ row.updateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <div v-if="row.actions.hasEdit || row.actions.hasDelete">
                <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="factoryupd($index, row)"></el-button>
                <el-button class="el-icon-delete
                " type="danger" circle size="mini" title="删除" @click.stop="factorydel($index, row)"></el-button>
             </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div class="pagination_wrap fr mt10">
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
    <div>
      <popularGoodsAdd
        v-if="dialogaddVisible"
        :updtag="updtag"
        :supplierList="supplierList"
        :goodsTypeList="goodsTypeList"
        :showId="showId"
        v-on:close="close"
      ></popularGoodsAdd>
    </div>

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogdelVisible"
      width="30%"
    >
      <span>确定删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  purchasegetuuid,
  popularGoodsSerch,
  holidayAdd,
  holidayUpd,
  popularGoodsDel,
  supplierDictList,
  goodsTypeList
} from "@/api/module/popularGoodsApi.js";
import popularGoodsAdd from "../popularGoodsAdd/Index.vue";
import Table from "@/layouts/components/common/Table.vue";
import { timeFormat } from "@/utils/index.js";
export default {
  name: "popularGoods",
  props: [],
  components: { Table, popularGoodsAdd },
  data() {
    return {
      supplierName: "",
      supplierCode: "",
      materialCode: "",
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      dialogaddVisible: false,
      dialogdelVisible: false,
      loadingsave: false,
      tableLoading: true,
      updtag: "",
      delId: "",
      showId: "",
      requestList: [],
      supplierList: [],
      form: [],
      goodsTypeList: [],
      expands:[],
      dataList: {
        total: 2,
        size: 10,
        current: 1,
        pages: 1,
        records: [
          {
            id: 514,
            createTime: "2020-06-16T04:09:05.394+0000",
            updateTime: "2020-06-16T04:10:46.857+0000",
            uuid: "990126556567915025202006160408043481000365",
            supplierName: "CARGO COMPASS SPA",
            faItemList: [
              {
                id: 384,
                createTime: "2020-06-16T04:09:05.410+0000",
                updateTime: "2020-06-16T04:13:28.165+0000",
                uuid: "990126505417578745202006160408239671000366",
                factoryAllocationCode: "FA2020061600448",
                faUuid: "990126556567915025202006160408043481000365",
                materialCode: "V895.601/4249",
                popularGoodsType: 1,
                spotGoods: "18395",
                fifteenDyas: 12,
                thirtyDays: 2
              },
              {
                id: 385,
                createTime: "2020-06-16T04:09:05.410+0000",
                updateTime: "2020-06-16T04:13:28.165+0000",
                uuid: "990126505417578745202006160408239671000366",
                factoryAllocationCode: "FA2020061600448",
                faUuid: "990126556567915025202006160408043481000365",
                materialCode: "V895.602/4249",
                popularGoodsType: 2,
                spotGoods: "18396",
                fifteenDyas: 2,
                thirtyDays: 0
              }
            ]
          },
          {
            id: 515,
            createTime: "2020-06-16T04:09:05.394+0000",
            updateTime: "2020-06-16T04:10:46.857+0000",
            uuid: "990126556567915025202006160408043481000365",
            supplierName: "VBC",
            faItemList: [
              {
                id: 386,
                createTime: "2020-06-16T04:09:05.410+0000",
                updateTime: "2020-06-16T04:13:28.165+0000",
                uuid: "990126505417578745202006160408239671000366",
                factoryAllocationCode: "FA2020061600448",
                faUuid: "990126556567915025202006160408043481000365",
                materialCode: "V895.601/39",
                popularGoodsType: 2,
                spotGoods: "18397",
                fifteenDyas: 10,
                thirtyDays: 6
              }
            ]
          }
        ]
      },
      // New
      parentData: {
        status: "",
        data: [
          {
            name: "",
            field: "updateTime",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "供应商",
            field: "supplierCodeName",
            class: "w10p",
            isShowTit: true
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
        name: "factoryGoodsList",
        data: [
          {
            name: "",
            field: "materialCode",
            class: "w13p"
          },
          {
            name: "",
            field: "goodsTypeName",
            class: "w13p"
          },
          {
            name: "",
            field: "spotGoodsQuantity",
            class: "w13p"
          },
          {
            name: "",
            field: "halfMonthQuantity",
            class: "w13p"
          },
          {
            name: "",
            field: "afterMonthQuantity",
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
        {
          name: "快货类型",
          class: "w13p"
        },
        {
          name: "现货",
          class: "w13p"
        },
        {
          name: "15天快货",
          class: "w13p"
        },
        {
          name: "30-45天快货",
          class: "w13p"
        },
        {
          name: "",
          class: "w10p"
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '更新时间',
          class: 'w8p'
        },
        {
          name: '供应商',
          class: 'w10p'
        }
      ],

      childHeaderList: ['行号', '物料编号', '快货类型', '现货', '15天快货', '30-45天快货'],
      childFieldsList: ['sn', 'materialCode', 'goodsTypeName', 'spotGoodsQuantity', 'halfMonthQuantity', 'afterMonthQuantity'],

    };
  },
  created() {},
  mounted() {
    this.getSupplierDictList();
    //	this.getGoodsType();
  },
  methods: {
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
      if (this.expands.indexOf(row.supplierCode) < 0) {
          this.expands.push(row.supplierCode);
      }else {
          this.expands.remove(row.supplierCode);
      }
    },
    excelDownload() {
      let headerList = ['序号', '供应商', '更新时间'];
      let fieldsList = ['idIndex', 'supplierCode', 'updateTime'];
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.requestList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '工厂快货',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.factoryGoodsList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    getGoodsType() {
      goodsTypeList().then(res => {
        console.log("快货类型列表：", res);
        if (res.code === "0") {
          this.goodsTypeList = res.data;
          this.getPopularGoodsList();
        }
      });
    },
    substrHandle(val) {
      if (val != undefined && val != "") {
        return val.substring(val.length - 5);
      }
    },
    holidayHandle(status) {
      for (var i = 0; i < this.fabrictypeHolidaylist.length; i++) {
        let item = this.fabrictypeHolidaylist[i];
        if (item.dictItemValue == status) {
          return item.dictItemName;
        }
      }
    },
    getSupplierDictList() {
      // 供应商列表
      console.log("供应商");
      supplierDictList().then(res => {
        console.log("供应商列表：", res);
        if (res.code === "0") {
          this.supplierList = res.data;
          this.getGoodsType();
        }
      });
    },
    //快货列表
    getPopularGoodsList() {
      this.tableLoading = true;
      let data = {
        materialCode: this.materialCode,
        supplierCode: this.supplierCode
      };

      popularGoodsSerch(this.currentPage, this.pageSize, data).then(res => {
        if (res.code == "0") {
          this.tableLoading = false;
          console.log("工厂快货类型列表：", res);
          this.total = res.data.total;
          this.requestList = res.data.records;
          for (var i = 0; i < this.requestList.length; i++) {
            let item = this.requestList[i];
            item.updateTime = timeFormat(item.updateTime);
            item.actions = {
              hasEdit: true,
              hasDelete: true
            };
            if(this.currentPage!=1){
            item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
            }else{
            item.idIndex=i+1;
            }
            console.log(this.supplierList);
            for (var j = 0; j < this.supplierList.length; j++) {
              let data = this.supplierList[j];
              if (item.supplierCode == data.supplierId) {
                item.supplierCodeName = data.supplierName;
                this.$forceUpdate();
              }
            }
            for (var a = 0; a < item.factoryGoodsList.length; a++) {
              let aitem = item.factoryGoodsList[a];
              for (var b = 0; b < this.goodsTypeList.length; b++) {
                let bitem = this.goodsTypeList[b];
                if (aitem.goodsType == bitem.index) {
                  aitem.goodsTypeName = bitem.name;
                  this.$forceUpdate();
                }
              }
            }
          }
          setTimeout(() => {
            this.tableLoading = false;
          }, 10000);
        } else {
          this.tableLoading = false;
        }
      });
    },
    //新增
    addHandle() {
      this.dialogaddVisible = true;
      this.updtag = "add";
    },
    close(tag) {
      console.log(tag);
      this.dialogaddVisible = false;
      this.form = {
        factoryGoodsList: [],
        supplierCode: "",
        supplierName: ""
      };
      if (tag == "submit") {
        this.getPopularGoodsList();
      }
      console.log(this.form);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      switch (tab.name) {
        case "1":
          this.holidayStatus = "";
          this.getHolidayFabricList();
          break;
        default:
          break;
      }
    },
    searchHandle() {
      this.currentPage = 1;
      this.getPopularGoodsList();
    },
    //编辑
    factoryupd(index, item) {
      console.log('编辑数据：', index, item);
      this.updtag = "upd";
      this.dialogaddVisible = true;
      this.showId = item.supplierCode;
    },
    //删除
    factorydel(index, item) {
      console.log(item, index);
      this.delId = item.supplierCode;
      this.dialogdelVisible = true;
    },
    //删除确定
    delVisibleclick() {
      popularGoodsDel(this.delId).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.dialogdelVisible = false;
          this.getPopularGoodsList();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPopularGoodsList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPopularGoodsList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.popularGoods {
  padding-bottom: 80px !important;
}
// button.el-button.el-button--danger.is-circle{
//   padding: 7px;
// }
</style>
<style>
</style>