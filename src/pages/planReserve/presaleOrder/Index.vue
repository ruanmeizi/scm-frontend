<template>
  <div class="container BAPurchasePlan">
    <div class="actions_part clearfix">
    	<div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">销售订单编号：</span>
          <el-input class="input_single w200 mr10" v-model="saleOrderId" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">产品编号：</span>
          <el-input class="input_single w200 mr10" v-model="productId" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">期望交期：</span>
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
      </div>
    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap">
        <singleTable
          :tableList="tableOrderList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          :tableLoading="tableLoading"
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
import { presaleOrderList } from "@/api/module/planReserveApi.js";
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
      productId: '',
      beginTime: '',
      endTime: '',
      uuid: '',
      orderList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
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
          name: '销售订单编号',
          field: 'saleOrderId',
          class: 'w10p',
          width: '150'
        },
        {
          name: '产品编号',
          field: 'productId',
          class: 'w7p',
          width: '150'
        },
        // {
        //   name: '产品系统编号',
        //   field: 'productSysCode',
        //   class: 'w7p',
        //   width: '150'
        // },
        // {
        //   name: '物料编号',
        //   field: 'materialCode',
        //   class: 'w8p',
        //   width: '150'
        // },
        // {
        //   name: '物料系统编号',
        //   field: 'materialSysCode',
        //   class: 'w8p',
        //   width: '150'
        // },
        {
          name: '期望交期',
          field: 'reserveExpectDate',
          class: 'w7p',
          width: '150'
        },
        {
          name: '预计实际交期',
          field: 'reserveRealDate',
          class: 'w7p',
          width: '150'
        },
        {
          name: '期望数量',
          field: 'quantity',
          class: 'w5p',
          width: '150'
        },
        {
          name: '实际数量',
          field: 'planReserveMeter',
          class: 'w5p',
          width: '150'
        },
        {
          name: '在库预留',
          field: 'reserveQuantity',
          class: 'w5p',
          width: '150'
        },
        {
          name: '在库调拨',
          field: 'testData',
          class: 'w5p',
          width: '150'
        },
        {
          name: '在途',
          field: 'shippmentMeter',
          class: 'w5p',
          width: '150'
        },
        {
          name: '在厂成品',
          field: 'producedMeter',
          class: 'w5p',
          width: '150'
        },
        {
          name: '在厂在产',
          field: 'producingMeter',
          class: 'w5p',
          width: '150'
        },
        {
          name: '询单',
          field: 'requestedMeter',
          class: 'w5p',
          width: '150'
        }
      ],
      leaderFieldsList: [
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w50p',
          width: '150'
        }
      ],
      tailFieldsList: [],

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
  },
  activated() {

  },
  watch: {

  },
  computed: {

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
        saleOrderId: this.saleOrderId,
        productId: this.productId,
        beginTime: this.beginTime,
        endTime: this.endTime
      };
      this.tableOrderList = [];
      presaleOrderList(this.currentPage, this.pageSize, data).then(res => {
        console.log('预售订单看板列表：', res);
        if (res.code === '0') {
          this.orderList = res.data.records;
          let list = this.orderList;
          for (var i = 0; i < list.length; i++) {
            if (list[i].createTime) {
              list[i].createTime = timeFormat(list[i].createTime);
            } else {
              list[i].createTime = '空';
            }
            // this.tableOrderList=[]
            for (var j = 0; j < list[i].advanceOrderItemSearchDtoList.length; j++) {
              let data = list[i].advanceOrderItemSearchDtoList[j];
              data.saleOrderId = list[i].saleOrderId;
              data.testData = '0';
              this.tableOrderList.push(data);
            }
            this.total = this.tableOrderList.length;
          }
          this.total = this.tableOrderList.length;
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
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