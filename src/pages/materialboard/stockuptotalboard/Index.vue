<template>
  <div class="container stockuptotalboard">
    <div class="commoncontent">
      <!--<p>备货总量看板</p>-->
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
               @change="searchclick"
              v-model="materialAttribute"
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
          :tableList="stockupList"
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
import {
  stocktotalserch,
  inthefactorydetails,
  onpassagedetails,
  availablestockdetails,
  onlineorderdetails,
  backorderdetails,
  queryAvailableReadyAll
} from "@/api/module/stockuptotalApi.js";
import {  fabrictypeMaterialproperties } from "@/api/module/unsboardApi.js";
import { cutOutNum } from "@/utils/index.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "stockuptotalboard",
  data() {
    return {
      tableLoading: true,
      materialCode: "",
      value1: "",
      pageSize: 10, //每页显示多少条
      size: "",
      allpage: 0,
      currentPage: 1, //页数
      zaichanglist: [],
      stockupList: [],
      tailFieldsList: [],
      materialAttribute:'',
      MaterialPropertiestypelist:[],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
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
          width: "150"
        },
        {
          name: "物料属性",
          field: "materialProperties",
          width: "150"
        },
        {
          name: "在库可用库存",
          field: "inStockInventory",
          width: "150"
        },
        {
          name: "在厂（货妥+在产）",
          field: "inFactoryInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "200",
            trigger: "click",
            placement: "right",
            parentName: "在厂（货妥+在产）",
            parentField: "inFactoryInventory",
            listName: "",
            fields: [
              {
                name: "职业装",
                field: "businessSuitsNumber",
                width: "100"
              },
              {
                name: "零剪",
                field: "splitNumber",
                width: "100"
              }
            ]
          }
        },
        {
          name: "在途",
          field: "shippmentInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "200",
            trigger: "click",
            placement: "right",
            parentName: "在途",
            parentField: "shippmentInventory",
            listName: "",
            fields: [
              {
                name: "职业装",
                field: "businessSuitsNumber",
                width: "100"
              },
              {
                name: "零剪",
                field: "splitNumber",
                width: "100"
              }
            ]
          }
        },
        {
          name: "可用备货总量（不含询单）",
          field: "subsequentReadyAll",
          width: "300",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "200",
            trigger: "click",
            placement: "right",
            parentName: "可用备货总量（不含询单）",
            parentField: "subsequentReadyAll",
            listName: "",
            fields: [
              {
                name: "职业装",
                field: "businessSuitsNumber",
                width: "100"
              },
              {
                name: "零剪",
                field: "splitNumber",
                width: "100"
              }
            ]
          }
        },
        {
          name: "可用备货总量（含询单）",
          field: "availableReadyAll",
          width: "200",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "200",
            trigger: "click",
            placement: "right",
            parentName: "可用备货总量（含询单）",
            parentField: "availableReadyAll",
            listName: "",
            fields: [
              {
                name: "职业装",
                field: "businessSuitsNumber",
                width: "100"
              },
              {
                name: "零剪",
                field: "splitNumber",
                width: "100"
              }
            ]
          }
        },
        {
          name: "询单",
          field: "purchaseRequestOrder",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: "table",
            width: "200",
            trigger: "click",
            placement: "right",
            parentName: "询单",
            parentField: "purchaseRequestOrder",
            listName: "",
            fields: [
              {
                name: "职业装",
                field: "businessSuitsNumber",
                width: "100"
              },
              {
                name: "零剪",
                field: "splitNumber",
                width: "100"
              }
            ]
          }
        },
        // {
        //   name: "预留",
        //   field: "reservedInventory",
        //   width: "150"
        // },
        // {
        //   name: "延期交货",
        //   field: "delayInDelivery",
        //   width: "150",
        //   hasPopover: true,
        //   popovers: {
        //     popType: "table",
        //     width: "600",
        //     trigger: "click",
        //     placement: "right",
        //     parentName: "询单",
        //     parentField: "delayInDelivery",
        //     listName: "",
        //     fields: [
        //       {
        //         name: "在途",
        //         field: "shippmentInventory",
        //         width: "100"
        //       },
        //       {
        //         name: "在厂（成品+在产）",
        //         field: "cargoQuantity",
        //         width: "100"
        //       },
        //       {
        //         name: "询单",
        //         field: "purchaseOrderItemDraft",
        //         width: "100"
        //       },
        //       {
        //         name: "非在库预售差异",
        //         field: "subsequentReady",
        //         width: "200"
        //       },
        //       {
        //         name: "后续备货总量",
        //         field: "subsequentStockRuantity",
        //         width: "100"
        //       }
        //     ]
        //   }
        // }
      ]
    };
  },
  components: { singleTable },
  created() {},
  mounted() {
    this.stockupTotalSearch();
    this.getMaterialproperties();
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
    popoverHandle(index, item, name, field) {
      console.log("弹层数据：", index, item, name, field);
      switch (field) {
        case "inFactoryInventory":
          // 在厂(成品+在产)
          inthefactorydetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
            console.log("在厂(成品+在产): ", response);
            if (response.code === "0") {
              var inthefactory = [response.data];
              this.$store.dispatch("getPopoverList", inthefactory);
              this.$forceUpdate();
            }
          });
          break;
        case "shippmentInventory":
          // 在途
          onpassagedetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
            console.log("在途: ", response);
            if (response.code === "0") {
              var onpassage = [response.data];
              this.$store.dispatch("getPopoverList", onpassage);
              this.$forceUpdate();
            }
          });
          break;
        case "subsequentReadyAll":
          // 可用备货总量（不含询单）
          availablestockdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
            console.log("可用备货总量（不含询单）: ", response);
            if (response.code === "0") {
              response.data.splitNumber = cutOutNum(response.data.splitNumber, 2);
              var availablestock = [response.data];
              this.$store.dispatch("getPopoverList", availablestock);
              this.$forceUpdate();
              console.log(item);
            }
          });
          break;
        case "purchaseRequestOrder":
          // 询单
          onlineorderdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
            console.log("询单: ", response);
            if (response.code === "0") {
              var onlineorder = [response.data];
              this.$store.dispatch("getPopoverList", onlineorder);
              this.$forceUpdate();
              console.log(item);
            }
          });
          break;
        case "delayInDelivery":
          // 延期交货
          backorderdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
            if (response.code === "0") {
              response.data.subsequentReady = cutOutNum(response.data.subsequentReady, 2);
              var backorder = [response.data];
              this.$store.dispatch("getPopoverList", backorder);
              this.$forceUpdate();
            }
          });
          break;
        case 'availableReadyAll':
          //含询单
          queryAvailableReadyAll(item.materialCode, "material", this.value1, item.productCode).then(response => {
            console.log('含询单: ', response);
            if (response.code === "0") {
              var available = [response.data];
              this.$store.dispatch('getPopoverList', available);
              // item.onpassagelist = onpassage;
              this.$forceUpdate();
            }
          });
          break;
        default:
          break;
      }
    },
    stockupTotalSearch() {
      this.tableLoading=true;
      let obj = {
        materialCode: this.materialCode,
        materialProperties: this.materialAttribute,
        detailType: "material",
        validDate: this.value1
      };
      stocktotalserch(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          this.allpage = response.data.totalElements;
          this.stockupList = response.data.content;
          this.tableLoading=false;
        } else {
          this.tableLoading=false;
        }
      });
      setTimeout(() => {
        this.tableLoading=false;
      }, 10000);
    },
    //搜索
    searchclick() {
      this.stockupTotalSearch();
    },
    //在厂（成品+生产）
    inthefactoryclick(item, index) {
      inthefactorydetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var inthefactory = [response.data];
          item.inthefactorylist = inthefactory;
          this.$forceUpdate();
        }
      });
    },

    //在途
    onpassageclick(item, index) {
      onpassagedetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var onpassage = [response.data];
          item.onpassagelist = onpassage;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //可用备货总量
    availablestockclick(item, index) {
      availablestockdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var availablestock = [response.data];
          item.availablestocklist = availablestock;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //询单
    onlineorderclick(item, index) {
      onlineorderdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var onlineorder = [response.data];
          item.onlineorderlist = onlineorder;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //延期交货
    backorderclick(item, index) {
      backorderdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          response.data.subsequentReady = cutOutNum(response.data.subsequentReady, 2);
          var backorder = [response.data];
          item.backorderlist = backorder;
          this.$forceUpdate();
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
    zaichangclick(item, index) {
      console.log(item, index);
      var zaichanglist = {};
      var value = [
        {
          zhiyezhuang: 20,
          lingjian: 22
        }
      ];
      var keyname = "zaichanglist";
      item[keyname] = value;
      console.log(item);
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.stockupTotalSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.stockupTotalSearch();
    }
  },
  filters: {
    numFilter(value) {
      cutOutNum(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.stockuptotalboard {
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}

</style>
<style>
button.el-popover__reference {
  font-size: 14px;
  color: #606266;
}
</style>