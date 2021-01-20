<template>
  <div class="container greyclothandyarnboard">
    <div class="commoncontent">
      <!--<p>坯布和纱线看板</p>-->
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号/开发号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">时间：</span>
            <el-date-picker
              v-model="value1"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
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
            @click="searchclick"
          ></el-button>
          <el-button size="small" type="primary" icon="el-icon-download" circle title="下载"></el-button>
        </div>
      </div>

      <div class="container_table table_part clearfix mt20 w100p">
         <singleTable
            :tableList="greyclothandyarnList"
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
import { greyclothandsearch, inFactorydetails } from "@/api/module/materialboardApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "greyclothandyarnboard",
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
      greyclothandyarnList: [],
      tailFieldsList: [],
      leaderFieldsList: [
        // {
        //   name: "物料编号",
        //   field: "materialCode",
        //   class: "w50p",
        //   width: "150"
        // }
      ],
      fieldsList: [
        {
          name: "物料编号",
          field: "materialCode",
          class: "w50p",
          width: "150"
        },
        {
          name: "种类",
          field: "materialType",
          width: "200"
        },
        {
          name: "供应商",
          field: "supplierName",
          width: "200"
        },
        {
          name: "在厂",
          field: "inFactoryInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tab_tail',
            width: '500',
            trigger: 'click',
            placement: 'right',
            parentName: '询单',
            parentField: 'inFactoryInventory',
            listName: '',
            tabs: [
              {
                name: '成品',
                value: 'first',
                listName: 'cargoList',
                total:'sumCargo',
                fields: [
                  {
                    name: '数量',
                    field: 'cargoQuantity',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'cargoTime',
                    width: '250'
                  }
                ]
              },
              {
                name: '在产',
                value: 'second',
                listName: 'productionList',
                total:'sumProduction',
                fields: [
                  {
                    name: '数量',
                    field: 'inProductionQuantity',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'cargoTime',
                    width: '250'
                  }
                ]
              }
            ]
          }
        },
        {
          name: "询单",
          field: "purchaseOrderItemDraft",
          width: "200"
        },
        {
          name: "备货总量",
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
  computed: {
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight -280)+ 'px';
    }
  },
  mounted() {
    this.greyclothandyarnSearch();
    var day = new Date();
    day.setTime(day.getTime());
    var s2 = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.value1 = s2;
  },
  watch: {},
  methods: {
    //搜索
    searchclick() {
      this.greyclothandyarnSearch();
    },
    //坯布和纱线列表
    greyclothandyarnSearch() {
      this.tableLoading=true;
      let obj = {
        materialCode: this.materialCode,
        detailType: "material",
        validDate: this.value1
      };
      greyclothandsearch(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          this.allpage = response.data.totalElements;
          this.greyclothandyarnList = response.data.content;
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
          case 'inFactoryInventory':
          //在厂
          let obj = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            dvanceSale: "notDvanceSale",
            detailType: "material",
            validDate: this.value1
          };
          inFactorydetails(obj).then(response => {
            if (response.code === "0") {
              for (var i = 0; i < response.data.cargoList.length; i++) {
                let data = response.data.cargoList[i];
                if (data.cargoTime != null && data.cargoTime != "") {
                  data.cargoTime = data.cargoTime.substring(0, 10);
                }
              }
              for (var j = 0; j < response.data.productionList.length; j++) {
                let data = response.data.productionList[j];
                if (data.cargoTime != null && data.cargoTime != "") {
                  data.cargoTime = data.cargoTime.substring(0, 10);
                }
              }
              var value = response.data;
              // var keyname = "inFactoryDetailList";
              // var keynameorder = "inProductionDetailList";
              // item[keynameorder] = value.inProductionDetailList;
              this.$store.dispatch('getPopoverTabData', value);
              // this.messageappend(item, value.inFactoryDetailList, keyname);
              this.$forceUpdate();
            }
          });
          break;
         
        default:
          break;
      }
    },
    //在厂
    inFactoryclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        dvanceSale: "notDvanceSale",
        detailType: "material",
        validDate: this.value1
      };
      inFactorydetails(obj).then(response => {
        if (response.code === "0") {
          for (var i = 0; i < response.data.inProductionDetailList.length; i++) {
            let data = response.data.inProductionDetailList[i];
            if (data.detailDate != null && data.detailDate != "") {
              data.detailDate = data.detailDate.substring(0, 10);
            }
          }
          for (var j = 0; j < response.data.inFactoryDetailList.length; j++) {
            let data = response.data.inFactoryDetailList[j];
            if (data.detailDate != null && data.detailDate != "") {
              data.detailDate = data.detailDate.substring(0, 10);
            }
          }
          var value = response.data;
          var keyname = "inFactoryDetailList";
          var keynameorder = "inProductionDetailList";
          item[keynameorder] = value.inProductionDetailList;
          this.messageappend(item, value.inFactoryDetailList, keyname);
          this.$forceUpdate();
        }
      });
    },
    messageappend(item, value, keyname) {
      item[keyname] = value;
      this.$forceUpdate();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.greyclothandyarnSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.greyclothandyarnSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.greyclothandyarnboard {
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}
table.tableclass {
  thead {
    background: #f5f7fa;
    color: #909399;
    height: 40px;
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
  tbody {
    tr {
      td {
        font-size: 14px;
        color: #606266;
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
