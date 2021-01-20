<template>
  <div class="container zeronotinthewarehouseboard">
    <div class="commoncontent">
      <!--<p>零剪非在库产品预售看板</p>-->
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号/开发号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料属性：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="materialAttribute"
              @change="searchclick"
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
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchclick"
          ></el-button>
        </div>
      </div>
      <div class="container_table table_part clearfix mt20 w100p">
        <singleTable
          :tableList="notinthewareList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @popoverHandle="popoverHandle"
          :tableLoading="tableLoading"
          :tableHeight="scrollerHeight"
        ></singleTable>
        <div class="paging" style="margin-top: 20px;float:right;height: 30px;">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10,50]"
              :page-size="pageSize"
              layout="sizes,total, prev, pager, next"
              :total="this.allpage"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {  fabrictypeMaterialproperties } from "@/api/module/unsboardApi.js";
import { nothingboardsearch, numberdetails, nothingonethewaydetails } from "@/api/module/materialboardApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "zeronotinthewarehouseboard",
  data() {
    return {
      tableLoading:true,
      materialCode: "",
      value1: "",
      pageSize: 10, //每页显示多少条
      size: "",
      allpage: 0,
      currentPage: 1, //页数
      activeName: "first",
      activeNameagain: "first",
      notinthewareList: [],
      materialAttribute:'',
      MaterialPropertiestypelist:[],
      tailFieldsList: [],
      leaderFieldsList: [
        {
          name: "物料编号",
          field: "materialCode",
          class: "w50p",
          width: "150"
        }
      ],
      fieldsList: [
        {
          name: "产品编号",
          field: "productCode",
          width: "200"
        },
         {
          name: "物料属性",
          field: "materialProperties",
          width: "150"
        },
        {
          name: "客订预留",
          field: "number",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '客订预留',
            parentField: 'number',
            listName: '',
            fields: [
              {
                name: '预留单号',
                field: 'reserveId',
                width: '150'
              },
              {
                name: '业务单号',
                field: 'saleOrderId',
                width: '150'
              },
              {
                name: '预留',
                field: 'number',
                width: '150'
              }
            ]
          }
        },
         {
          name: "在途",
          field: "shippmentMeter",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '在途',
            parentField: 'shippmentMeter',
            listName: '',
            fields: [
              {
                name: '计划预留单号',
                field: 'planReserveId',
                width: '150'
              },
              {
                name: '业务单号',
                field: 'saleOrderId',
                width: '150'
              },
              {
                name: '在途',
                field: 'shippmentMeter',
                width: '150'
              }
            ]
          }
        },
         {
          name: "在厂货妥",
          field: "producedMeter",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '在厂货妥',
            parentField: 'producedMeter',
            listName: '',
            fields: [
              {
                name: '计划预留单号',
                field: 'planReserveId',
                width: '150'
              },
              {
                name: '业务单号',
                field: 'saleOrderId',
                width: '150'
              },
              {
                name: '成品',
                field: 'producedMeter',
                width: '150'
              }
            ]
          }
        },
         {
          name: "在厂在产",
          field: "producingMeter",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '在厂在产',
            parentField: 'producingMeter',
            listName: '',
            fields: [
              {
                name: '计划预留单号',
                field: 'planReserveId',
                width: '150'
              },
              {
                name: '业务单号',
                field: 'saleOrderId',
                width: '150'
              },
              {
                name: '在产',
                field: 'producingMeter',
                width: '150'
              }
            ]
          }
        },
         {
          name: "询单",
          field: "requestedMeter",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '询单',
            parentField: 'requestedMeter',
            listName: '',
            fields: [
              {
                name: '计划预留单号',
                field: 'planReserveId',
                width: '150'
              },
              {
                name: '业务单号',
                field: 'saleOrderId',
                width: '150'
              },
              {
                name: '询单',
                field: 'requestedMeter',
                width: '150'
              }
            ]
          }
        },
        {
          name: "后续备货总量",
          field: "subsequentReady",
          width: "200"
        },
         {
          name: "可用备货总量(含询单)",
          field: "subsequentReadyAll",
          width: "200"
        }
      ],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  components: {singleTable},
  created() {},
  mounted() {
    this.getMaterialproperties();
    this.notintheWareHouseSearch();
    var day = new Date();
    day.setTime(day.getTime());
    var s2 = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.value1 = s2;
  },
  watch: {},
  computed: {
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight -280) + 'px';
    }
  },
  methods: {
    //列表分页
    notintheWareHouseSearch() {
      this.tableLoading=true;
      let obj = {
        materialCode: this.materialCode,
        materialProperties: this.materialAttribute,
        inventory: "B0"
      };
      nothingboardsearch(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          this.allpage = response.data.total;
          this.notinthewareList = response.data.records;
          this.tableLoading=false;
        }
      });
      setTimeout(() => {
        this.tableLoading=false;
      }, 10000);
    },
     popoverHandle(index, item, name, field) {
      console.log("弹层数据：", index, item, name, field);
      switch (field) {
          case 'number':
          //客订预留
           numberdetails(item.materialCode, "B0").then(response => {
              if (response.code === "0") {
                var value = response.data;
                var keyname = "numberlist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
              }
           });
          break;
          case 'shippmentMeter':
          // 在途
          nothingonethewaydetails(item.materialCode, "B0").then(response => {
              if (response.code === "0") {
                console.log(response.data);
                var value = response.data;
                var keyname = "shippmentlist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
              }
          });
          break;
          case 'producedMeter':
          // 在厂成品
          nothingonethewaydetails(item.materialCode, "B0").then(response => {
              if (response.code === "0") {
                console.log(response.data);
                var value = response.data;
                var keyname = "shippmentlist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
              }
          });
          break;
           case 'producingMeter':
          // 在厂在产
          nothingonethewaydetails(item.materialCode, "B0").then(response => {
              if (response.code === "0") {
                console.log(response.data);
                var value = response.data;
                var keyname = "shippmentlist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
              }
          });
          break;
          case 'requestedMeter':
          // 询单
          nothingonethewaydetails(item.materialCode, "B0").then(response => {
              if (response.code === "0") {
                console.log(response.data);
                var value = response.data;
                var keyname = "shippmentlist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
              }
          });
          break;

        default:
          break;
      }
    },
    //物料属性
    getMaterialproperties() {
      fabrictypeMaterialproperties().then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;
        }
      });
    },
    //客订预留
    numberclick(item, index) {
      numberdetails(item.materialCode, "B0").then(response => {
        if (response.code === "0") {
          var value = response.data;
          var keyname = "numberlist";
          this.messageappend(item, value, keyname);
        }
      });
    },
    //在途，在产，成品，询单
    shippmentclick(item, index) {
      nothingonethewaydetails(item.materialCode, "B0").then(response => {
        if (response.code === "0") {
          console.log(response.data);
          var value = response.data;
          var keyname = "shippmentlist";
          this.messageappend(item, value, keyname);
        }
      });
    },

    handleClick(tab, event) {
      console.log(tab, event);
    },
    messageappend(item, value, keyname) {
      item[keyname] = value;
      this.$forceUpdate();
    },
    //搜索
    searchclick() {
      this.notintheWareHouseSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.notintheWareHouseSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.notintheWareHouseSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.zeronotinthewarehouseboard {
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}
.calendar-day {
  text-align: center;
  color: #202535;
  line-height: 20px;
  font-size: 12px;
}
.is-selected {
  color: #f8a535;
  font-size: 10px;
  margin-top: 5px;
}
#calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
  content: "当月";
}
ul.formlist {
  width: 100%;
  height: 40px;
  display: flex;
  /*border-bottom: 1px solid #EBEEF5;*/
  li {
    /*border-bottom: 1px solid #C0C0C0;*/
  }
  li:last-child {
    /*border-bottom: none;*/
  }
}
table.prod {
  thead {
    position: absolute;
    th:nth-child(9) {
      width: 70px;
    }
    th:nth-child(10) {
      width: 70px;
    }
    th:nth-child(12) {
      width: 70px;
    }
    th {
      width: 50px;
    }
  }
  tbody {
    tr {
      clear: both;
      td {
        width: 50px;
      }
      td:nth-child(9) {
        width: 70px;
      }
      td:nth-child(10) {
        width: 70px;
      }
      td:nth-child(12) {
        width: 70px;
      }
    }
    tr:first-child {
      td {
        padding-top: 65px;
      }
    }
  }
}
table.tableclass {
  thead {
    background: #f5f7fa;
    color: #909399;
    th {
      padding: 12px 0;
    }
  }
  tbody {
    tr {
      td {
        padding: 10px 0;
      }
    }
  }
}
table.contenttab {
  thead {
    background: #f5f7fa;
    color: #909399;
    th {
      padding: 12px 0;
    }
  }
  tbody {
    tr {
      td {
        font-size: 14px;
        color: #606266;
        width: 150px;
        span {
          display: inline-block;
        }
      }
      td:nth-child(2),
      td:nth-child(3),
      td:nth-child(4) {
        span {
          display: inline-block;
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
<style>
button.el-popover__reference {
  font-size: 14px;
  color: #606266;
}
</style>