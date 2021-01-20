<template>
  <div class="container BAPurchasePlan">
    <div class="actions_part clearfix">
    	<div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">业务类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="businessType"
            @change="searchHandle"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in businessTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">订单类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="orderType"
            @change="searchHandle"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in dashBoardOrderList"
              :key="item.index"
              :label="item.index"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">物料属性：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="materialAttribute"
            @change="searchHandle"
            placeholder="请选择物料属性">
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in MaterialPropertiestypelist"
              :key="item.index"
              :label="item.name"
              :value="item.index"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">业务单号：</span>
          <el-input class="input_single w200 mr10" v-model="saleOrderId" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">客户名称：</span>
          <el-input class="input_single w200 mr10" v-model="customerName" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编码：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">时间：</span>
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
          class="mr10"
          circle
          title="搜索"
          @click="searchHandle"
        ></el-button>
        <el-dropdown @command="handleCommand">
          <div class="header-right">
             <el-button
              size="medium"
              class="mr10"
              slot="reference"
              type="primary"
              icon="el-icon-sort"
              circle
              @click="filterFieldHandle"
            ></el-button>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in dashBoardSortList" :key="item.index" :command='item.name' class="eldropdownitem">{{item.index}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" type="primary" icon="el-icon-download" circle title="下载"></el-button>
      </div>
    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap">
        <singleTable
          :tableList="tableOrderList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          @popoverHandle="popoverHandle"
          :tableFieldsList="fieldsList"
          :tableLoading="tableLoading"
          :tableHeight="scrollerHeight"
        ></singleTable>
      </el-tabs>
      
      <!-- <p v-if="this.orderList==''" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
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
</template>

<script>
import { presaleOrderList,querySaleOrderDashBoard ,constDictList,materialList,planReservedList,querySaleOrderSearch} from "@/api/module/planReserveApi.js";
import {  fabrictypeMaterialproperties } from "@/api/module/unsboardApi.js";
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "BAPurchasePlan",
  props: [],
  data() {
    return {
      tableLoading: true,
      orderCode: '',
      dateVal: '',

      saleOrderId: '',
      customerName: '',
      beginTime: '',
      endTime: '',
      uuid: '',
      businessType: '',
      businessTypeList: [],
      materialAttribute:'',
      MaterialPropertiestypelist:[],
      materialCode:'',
      orderList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      dashBoardSortList:'',
      dashBoardOrderList:'',
      fieldList: [
        {
          name: '销售订单编号',
          class: 'w10p'
        },
        {
          name: '产品编号',
          class: 'w7p'
        },
        // {
        //   name: '产品系统编号',
        //   class: 'w7p'
        // },
        {
          name: '物料编号',
          class: 'w8p'
        },
        // {
        //   name: '物料系统编号',
        //   class: 'w8p'
        // },
        {
          name: '期望交期',
          class: 'w7p'
        },
        {
          name: '预计实际交期',
          class: 'w7p'
        },
        {
          name: '期望数量',
          class: 'w5p'
        },
        {
          name: '实际数量',
          class: 'w5p'
        },
        {
          name: '在库预留',
          class: 'w5p'
        },
        {
          name: '在库调拨',
          class: 'w5p'
        },
        {
          name: '在途',
          class: 'w5p'
        },
        {
          name: '在厂成品',
          class: 'w5p'
        },
        {
          name: '在厂在产',
          class: 'w5p'
        },
        {
          name: '询单',
          class: 'w5p'
        },
        // {
        //   name: '以销定采',
        //   class: 'w5p'
        // },
        // {
        //   name: '叫料',
        //   class: 'w5p'
        // },
        // {
        //   name: '生产',
        //   class: 'w5p'
        // }
      ],

      // SingleTable
      tableOrderList: [],
      fieldsList: [
        {
          name: '业务类型',
          field: 'businessType',
          class: 'w50p',
          width: '150'
        },
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '150'
        },
        {
          name: "产品编号",
          field: "productCode",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "300",
            trigger: "click",
            placement: "right",
            parentName: "产品编号",
            parentField: "productCode",
            listName: "",
            fields: [
              {
                name: "样品分类",
                field: "materialCode",
                width: "100"
              },
              {
                name: "供应商",
                field: "supplierName",
                width: "200"
              }
            ]
          }
        },
        {
          name: '物料属性',
          field: 'materialProperties',
          class: 'w7p',
          width: '150'
        },
        {
          name: '客户名称',
          field: 'customerName',
          class: 'w5p',
          width: '150'
        },
        {
          name: '最早客户交期',
          field: 'earliestDeliveryDate',
          class: 'w5p',
          width: '150'
        },
        {
          name: '最晚客户交期',
          field: 'latestDeliveryDate',
          class: 'w5p',
          width: '150'
        },
        {
          name: '订单数量',
          field: 'quantity',
          class: 'w5p',
          width: '150'
        },
        {
          name: '预留',
          field: 'reservedInventory',
          class: 'w5p',
          width: '150'
        },
        {
          name: '后续备货总量',
          field: 'subsequentReady',
          class: 'w5p',
          width: '150'
        },
        {
          name: '可用备货总量（含询单）',
          field: 'availableReadyAll',
          class: 'w5p',
          width: '150'
        },
        {
          name: '可用备货总量（不含询单）',
          field: 'availableReadyNotRequested',
          class: 'w5p',
          width: '150'
        },
        {
          name: "在途",
          field: "shippmentInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "250",
            trigger: "click",
            placement: "right",
            parentName: "在途",
            parentField: "shippmentInventory",
            listName: "",
            fields: [
              {
                name: "计划预留单号",
                field: "reserveId",
                width: "150"
              },
              {
                name: "确认书号",
                field: "shippmentConfirmNo",
                width: "100"
              }
            ]
          }
        },
        {
          name: '在厂',
          field: 'inFactoryInventory',
          class: 'w5p',
          width: '150'
        },
        // {
        //   name: '在厂货妥',
        //   field: 'producedInventory',
        //   class: 'w5p',
        //   width: '150'
        // },
        {
          name: "在厂货妥",
          field: "producedInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "250",
            trigger: "click",
            placement: "right",
            parentName: "在途",
            parentField: "producedInventory",
            listName: "",
            fields: [
              {
                name: "计划预留单号",
                field: "reserveId",
                width: "150"
              },
              {
                name: "确认书号",
                field: "producedConfirmNo",
                width: "100"
              }
            ]
          }
        },
        // {
        //   name: '在厂在产',
        //   field: 'producingInventory',
        //   class: 'w5p',
        //   width: '150'
        // },
        {
          name: "在厂在产",
          field: "producingInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "250",
            trigger: "click",
            placement: "right",
            parentName: "在途",
            parentField: "producingInventory",
            listName: "",
            fields: [
              {
                name: "计划预留单号",
                field: "reserveId",
                width: "150"
              },
              {
                name: "确认书号",
                field: "producingConfirmNo",
                width: "100"
              }
            ]
          }
        },
        // {
        //   name: '询单',
        //   field: 'requestedInventory',
        //   class: 'w5p',
        //   width: '150'
        // },
        {
          name: "询单",
          field: "requestedInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "250",
            trigger: "click",
            placement: "right",
            parentName: "在途",
            parentField: "requestedInventory",
            listName: "",
            fields: [
              {
                name: "计划预留单号",
                field: "reserveId",
                width: "150"
              },
              {
                name: "确认书号",
                field: "",
                width: "100"
              }
            ]
          }
        },
      ],
      leaderFieldsList: [
        {
          name: '业务单号',
          field: 'businessId',
          width: '200',
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "150",
            trigger: "click",
            placement: "right",
            parentName: "产品编号",
            parentField: "businessId",
            listName: "",
            fields: [
              {
                name: "销售助理",
                field: "saleOrder",
                width: "150"
              }
            ]
          }
        }
      ],
      tailFieldsList: [],
      sort:'',
      orderType:'',
    };
  },
  components: {
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getPresaleOrderList();
    this.getBusinessTypeList();
    this.getMaterialproperties();
    this.getDashBoardSortList();
    this.getDashBoardOrderList();
  },
  activated() {

  },
  watch: {

  },
  computed: {
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight -310) + 'px';
    }
  },
  methods: {
    dateValChange(val) {
      // console.log('选择日期：', val);
    },
    searchHandle() {
      // 搜索
      this.orderList = [];
      this.tableOrderList = [];
      this.currentPage = 1;
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.getPresaleOrderList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPresaleOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPresaleOrderList();
    },
    getPresaleOrderList() {
      // 采购请求列表
      let data = {
        businessType: this.businessType,
        materialProperties: this.materialAttribute,
        customerName: this.customerName,
        beginTime: this.beginTime,
        endTime: this.endTime,
        materialCode:this.materialCode,
        orderType:this.orderType,
        businessId:this.saleOrderId,
      };
      console.log(data);
      querySaleOrderSearch(this.currentPage, this.pageSize, data).then(res => {
        console.log('非常规看板', res);
        if (res.code === '0') {
          this.tableOrderList = res.data.records;
          for (var i = 0; i < this.tableOrderList.length; i++) {
            let data = this.tableOrderList[i];
            if (data.lastDeliveryDate != null && data.lastDeliveryDate != "") {
              data.lastDeliveryDate = data.lastDeliveryDate.substring(0, 10);
            }
          }
          console.log(this.tableOrderList);
          this.total = res.data.total;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    popoverHandle(index, item, name, field) {
      console.log("弹层数据：", index, item, name, field);
      switch (field) {
        case "productCode":
          // 产品编号
          materialList(item.materialCode).then(response => {
            console.log('产品编号列表：', response);
            if (response.code === "0") {
              var  material = [response.data];
              this.$store.dispatch("getPopoverList", material);
              this.$forceUpdate();
            }
          });
          break;
        case "shippmentInventory": case "producedInventory": case "producingInventory": case "requestedInventory":
          // 在途
          planReservedList(item.productCode, item.saleOrderId).then(response => {
            console.log("在途: ", response);
            if (response.code === "0") {
              var onpassage = [response.data];
              this.$store.dispatch("getPopoverList", onpassage);
              this.$forceUpdate();
            }
          });
          break;
        case "saleOrderId":
          // 业务单号
          var saleList = [{saleOrder:item.operateAgentId}];
          console.log(saleList);
          this.$store.dispatch("getPopoverList", saleList);
          this.$forceUpdate();
          break;
        default:
          break;
      }
    },
    getBusinessTypeList() {
      // 业务类型列表
      constDictList('BusinessType').then(res => {
        console.log('业务类型列表：', res);
        if (res.code === '0') {
          this.businessTypeList = res.data;
        }
      });
    },
    handleCommand(val){
      this.sort=val;
      this.getPresaleOrderList();
    },
    dashBoardOrderCommand(val){
      this.orderType=val;
      this.getPresaleOrderList();
    },
    getDashBoardSortList(){
      //排序规则
      constDictList('DashBoardSortCriteria').then(res => {
        console.log('排序规则列表：', res);
        if (res.code === '0') {
          this.dashBoardSortList = res.data;
        }
      });
    },
    //筛选下拉框
    getDashBoardOrderList(){
      constDictList('DashBoardOrderType').then(res => {
        console.log('排序规则列表：', res);
        if (res.code === '0') {
          this.dashBoardOrderList = res.data;
        }
      });
    },
    //物料属性
    getMaterialproperties() {
      fabrictypeMaterialproperties().then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;
        }
      });
    },
    getMaterialList(){
      materialList(this.materialCode).then(res => {
        console.log('业务类型列表：', res);
        if (res.code === '0') {
          this.businessTypeList = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
//@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.BAPurchasePlan {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
  .display_ib{
    margin-bottom:10px;
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
  .list_group {
    border-bottom: 1px solid #EEEEEE;
    &:last-of-type {
      border-bottom: none;
    }
  }
  .popover_wrap {
    .el-popover__reference {
      background: none;
      border: none;
      border-radius: 0;
      padding: 5px;
      border-bottom: 1px solid #409EFF;
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
  .edit_btn_wrap{
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

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
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



</style>
<style>
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
.popover_table.el-table .el-table__header th, .popover_table.el-table .el-table__header tr {
  height: 40px;
  background-color: #f5f7fa;
}
</style>