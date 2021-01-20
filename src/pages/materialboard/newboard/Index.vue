<template>
  <div class="container newboard">
    <div class="commoncontent">
      <!--<p>新品看板</p>-->
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
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

      <div class="container_table table_part clearfix mt20 w100p" style>
        <singleTable
          :tableList="newboardList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @popoverHandle="popoverHandle"
          :tableLoading="tableLoading"
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
  newboardsearch,
  newavailabledetails,
  meterialdetails,
  productcodedetails,
  subsequentdetails,
  scheduleddetails,
  onthewaydetails,
  inFactorydetails
} from "@/api/module/materialboardApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "newboard",
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
      newboardList: [],
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
          width: "150",
          hasPopover:true,
          popovers: {
            popType: 'table',
            width: '800',
            trigger: 'click',
            placement: 'right', // 弹层显示位置
            parentName: '产品编号',
            parentField: 'productCode',
            listName: 'materialDetailList',
            fields: [
              {
                name: '供应商',
                field: "supplierName",
                width: "100"
              },
              {
                name: '工厂季',
                field: "factorySeasonal",
                width: "100"
              },
              {
                name: '新品订单频次',
                field: "purchaseRequestCode",
                width: "100"
              },
              {
                name: '采购请求号',
                field: "purchaseRequestCode",
                width: "100"
              },
              {
                name: '确认书号',
                field: "confirmNumbers",
                width: "100"
              },
              {
                name: '开发号',
                field: "width",
                width: "100"
              },
              {
                name: '是否取消',
                field: "requiredQuantityPerPackage",
                width: "100"
              },
              {
                name: '包装规格(米/包)',
                field: "productCode",
                width: "100"
              }
            ]
          }
        },
        {
          name: "在库可用库存",
          field: "inStockInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_double',
            width: '200',
            trigger: 'click',
            placement: 'right',
            parentName: '在库可用库存',
            parentField: 'inStockInventory',
            listName: '',
            fields: [
              {
                name: '实际在库可用库存',
                field: '',
                width: '200',
                children: [
                  {
                    name: '51库(零剪延期交货)',
                    field: 'availQuantity1',
                    width: '100'
                  },
                  {
                    name: '02B库(批发零头库)',
                    field: 'availQuantity2',
                    width: '100'
                  }
                ]
              }
            ]
          }
        },
        {
          name: "后续备货总量(非在库)",
          field: "subsequentReady",
          width: "200",
          hasPopover: true,
          popovers: {
            popType: 'table',
            width: '420',
            trigger: 'click',
            placement: 'right',
            parentName: '后续备货总量（非在库）',
            parentField: 'subsequentReady',
            listName: '',
            fields: [
              {
                name: '后续备货明细',
                field: 'stockDetails',
                width: '100'
              },
              {
                name: '空运在途',
                field: 'shippmentInventory',
                width: '100'
              },
              {
                name: '在厂（在产+成品）',
                field: 'inFactory',
                field_1: 'inProductionNumber',
                field_2: 'cargoQuantity',
                width: '100'
              },
              {
                name: '询单',
                field: 'purchaseOrderItemDraft',
                width: '100'
              }
              
            ]

          }
        },
        {
          name: "可用备货总量(含询单)",
          field: "subsequentReadyAll",
          width: "200"
        },
        {
          name: "预计入库量",
          field: "scheduledReceipt",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tab_tail',
            width: '500',
            trigger: 'click',
            placement: 'right',
            parentName: '预计入库量',
            parentField: 'scheduledReceipt',
            listName: '',
            //tail: 'scheduledReceiptTail',
            tabs: [
              {
                name: '询单',
                value: 'first',
                listName: 'isOrder',
                total: 'sumIsOrder',
                fields: [
                  {
                    name: '数量',
                    field: 'number',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'orderDateTime',
                    width: '250'
                  }
                ]
              },
              {
                name: '非询单',
                value: 'second',
                listName: 'notOrder',
                total: 'sumNotOrder',
                fields: [
                  {
                    name: '数量',
                    field: 'number',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'orderDateTime',
                    width: '250'
                  }
                ]
              }
            ]
          }
        },
        {
          name: "空运在途",
          field: "shippmentInventory",
          width: "150",
          hasPopover: true,
           popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '在途',
            parentField: 'shippmentInventory',
            listName: '',
            tail: 'shippmentInventoryTail',
            fields: [
              {
                name: '数量',
                field: 'number',
                width: '150'
              },
              {
                name: '日期',
                field: 'detailDate',
                width: '150'
              },
              {
                name: '预计到库日期',
                field: 'expectedDate',
                width: '150'
              }
            ]
          }
        },
        {
          name: "后续在厂",
          field: "inFactoryInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tab_tail',
            width: '500',
            trigger: 'click',
            placement: 'right',
            parentName: '后续在厂',
            parentField: 'inFactoryInventory',
            listName: '',
            tail: 'inFactoryInventoryTail',
            tabs: [
              {
                name: '货妥',
                value: 'first',
                listName: 'inFactoryDetailList',
                fields: [
                  {
                    name: '数量',
                    field: 'cargoQuantity',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'detailDate',
                    width: '250'
                  }
                ]
              },
              {
                name: '在产',
                value: 'second',
                listName: 'inProductionDetailList',
                fields: [
                  {
                    name: '数量',
                    field: 'cargoQuantity',
                    width: '250'
                  },
                  {
                    name: '日期',
                    field: 'detailDate',
                    width: '250'
                  }
                ]
              }
            ]
          }
        },
        {
          name: "S20",
          field: "numbers",
          width: "150"
        },
        
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
    this.newboardpageSearch();
    var day = new Date();
    day.setTime(day.getTime());
    var s2 = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.value1 = s2;
  },
  watch: {},
  methods: {
    //搜索
    searchclick() {
      this.newboardpageSearch();
    },
    //新品看板列表
    newboardpageSearch(){
      this.tableLoading=true;
      let obj = {
        materialCode: this.materialCode,
        detailType: "material",
        validDate: this.value1
      };
      newboardsearch(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          this.allpage = response.data.totalElements;
          this.newboardList = response.data.content;
          this.newboardList.forEach(item => {
            item.scheduledReceiptTail = '总计：' + item.scheduledReceipt;
            item.shippmentInventoryTail = '总计：' + item.shippmentInventory;
            item.inFactoryInventoryTail = '总计：' + item.inFactoryInventory;
          });
          this.tableLoading=false;
        } else {
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
         case 'productCode':
          // 产品编码
          productcodedetails(item.productCode, "material", this.value1).then(response => {
            if (response.code === "0") {
              var meterial = response.data;
              item.productcodelist = meterial;
              this.$store.dispatch('getPopoverList', res.data);
              this.$forceUpdate();
              console.log(item);
            }
          });
          break;
          case 'inStockInventory':
          // 在库可用库存
           let obj = {
              materialCode: item.materialCode,
              productCode: item.productCode,
              detailType: "material",
              validDate: this.value1
            };
            newavailabledetails(obj).then(response => {
              if (response.code === "0") {
                var value = response.data;
                var keyname = "availablelist";
                this.$store.dispatch('getPopoverList',value);
                this.messageappend(item, value, keyname);
                this.$forceUpdate();
                console.log(item);
              }
            });
          break;
         case 'subsequentReady':
          // 后续备货总量(非在库)
          let data = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            shippmentInventory: item.shippmentInventory,
            shippmentInventory2: item.shippmentInventory2,
            inProduceInventory: item.inProduceInventory,
            inFactoryInventory: item.inStockMaterialInventory,
            purchaseOrderItemDraft: item.purchaseOrderItemDraft,
            dvanceSale: "notDvanceSale",
            detailType: "material",
            validDate: this.value1
          };
          subsequentdetails(data).then(res => {
            console.log('后续备货总量(非在库)弹层：', res);
            if (res.code === '0') {
              res.data.inFactory = res.data.inProductionNumber + res.data.cargoQuantity + '(' + res.data.inProductionNumber + '+' + res.data.cargoQuantity + ')';
              var available = [res.data];
              item.availablelist = available;
              this.$store.dispatch('getPopoverList', available);
              this.$forceUpdate();
            }
          });
         
          break;
        case 'scheduledReceipt':
          // 预计入库量
          let receiptData = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            dvanceSale: 'notDvanceSale',
            detailType: 'material',
            validDate: this.value1
          };
          scheduleddetails(receiptData).then(res => {
            console.log('预计入库量：', res);
            if (res.code === '0') {
              for (var i = 0; i < res.data.isOrder.length; i++) {
                let data = res.data.isOrder[i];
                if (data.orderDateTime != null && data.orderDateTime != "") {
                  data.orderDateTime = data.orderDateTime.substring(0, 7);
                }
              }
              for (var j = 0; j < res.data.notOrder.length; j++) {
                let data = res.data.notOrder[j];
                if (data.orderDateTime != null && data.orderDateTime != "") {
                  data.orderDateTime = data.orderDateTime.substring(0, 7);
                }
              }
              var value = res.data;
              // var keyname = "isscheduledlist";
              // var keynameorder = "notscheduledlist";
              // item[keynameorder] = value.notOrder;
              this.$store.dispatch('getPopoverTabData', value);
              // this.messageappend(item, value.isOrder, keyname);
            }
          });

          break;
        case 'shippmentInventory':
          // 在途
          let inventoryData = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            dvanceSale: "notDvanceSale",
            detailType: "material",
            validDate: this.value1
          };
          onthewaydetails(inventoryData).then(res => {
            console.log('在途数据列表：', res);
            if (res.code === "0") {
              console.log(res.data);
              for (var i = 0; i < res.data.length; i++) {
                let data = res.data[i];
                if (data.detailDate != null && data.detailDate != "") {
                  data.detailDate = data.detailDate.substring(0, 10);
                }
                if (data.expectedDate != null && data.expectedDate != "") {
                  data.expectedDate = data.expectedDate.substring(0, 10);
                }
              }
              var value = res.data;
              this.$store.dispatch('getPopoverList', value);
              // var keyname = "shippmentlist";
              // this.messageappend(item, value, keyname);
            }
          });
          break;
        case 'inFactoryInventory':
          // 在厂
          let factoryData = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            dvanceSale: "notDvanceSale",
            detailType: "material",
            validDate: this.value1
          };
          inFactorydetails(factoryData).then(response => {
            console.log('在厂数据列表：', response);
            if (response.code === "0") {
              for (var i = 0; i < response.data.inFactoryDetailList.length; i++) {
                let data = response.data.inFactoryDetailList[i];
                if (data.detailDate != null && data.detailDate != "") {
                  data.detailDate = data.detailDate.substring(0, 10);
                }
              }
              for (var j = 0; j < response.data.inProductionDetailList.length; j++) {
                let data = response.data.inProductionDetailList[j];
                if (data.detailDate != null && data.detailDate != "") {
                  data.detailDate = data.detailDate.substring(0, 10);
                }
              }
              var value = response.data;
              var keyname = "inFactoryDetailList";
              var keynameorder = "inProductionDetailList";
              this.$store.dispatch('getPopoverTabData', value);
              // item[keynameorder] = value.inProductionDetailList;
              // this.messageappend(item, value.inFactoryDetailList, keyname);
            }
          });
          break;

        default:
          break;
      }
    },
    //物料编号详情
    meterialclick(item, index) {
      meterialdetails(item.materialCode, "material", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var meterial = [response.data.data];
          item.meteriallist = meterial;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //产品编号
    productCodeclick(item, index) {
      productcodedetails(item.productCode, "material", this.value1).then(response => {
        if (response.code === "0") {
          var meterial = response.data;
          item.productcodelist = meterial;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //再库可用库存详情
    availableclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        detailType: "material",
        validDate: this.value1
      };
      newavailabledetails(obj).then(response => {
        if (response.code === "0") {
          var value = response.data;
          var keyname = "availablelist";
          this.messageappend(item, value, keyname);
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //后续备货总量（非在库）
    subsequentclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        inventory: item.inventory,
        shippmentInventory: item.shippmentInventory,
        shippmentInventory2: item.shippmentInventory2,
        inProduceInventory: item.inProduceInventory,
        inFactoryInventory: item.inStockMaterialInventory,
        purchaseOrderItemDraft: item.purchaseOrderItemDraft,
        dvanceSale: "notDvanceSale",
        detailType: "material",
        validDate: this.value1
      };
      subsequentdetails(obj).then(response => {
        if (response.code === "0") {
          var available = [response.data];
          item.availablelist = available;
          this.$forceUpdate();
          console.log(item);
        }
      });
    },
    //预计入库量
    scheduledclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        inventory: item.inventory,
        dvanceSale: "notDvanceSale",
        detailType: "material",
        validDate: this.value1
      };
      scheduleddetails(obj).then(response => {
        if (response.code === "0") {
          for (var i = 0; i < response.data.isOrder.length; i++) {
            let data = response.data.isOrder[i];
            if (data.orderDateTime != null && data.orderDateTime != "") {
              data.orderDateTime = data.orderDateTime.substring(0, 10);
            }
          }
          for (var j = 0; j < response.data.notOrder.length; j++) {
            let data = response.data.notOrder[j];
            if (data.orderDateTime != null && data.orderDateTime != "") {
              data.orderDateTime = data.orderDateTime.substring(0, 10);
            }
          }
          var value = response.data;
          var keyname = "isscheduledlist";
          var keynameorder = "notscheduledlist";
          item[keynameorder] = value.notOrder;
          this.messageappend(item, value.isOrder, keyname);
          console.log(item);
          console.log(item.isscheduledlist.length);
        }
      });
    },
    //在途
    shippmentclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        inventory: item.inventory,
        dvanceSale: "notDvanceSale",
        detailType: "material",
        validDate: this.value1
      };
      onthewaydetails(obj).then(response => {
        if (response.code === "0") {
          console.log(response.data);
          for (var i = 0; i < response.data.length; i++) {
            let data = response.data[i];
            if (data.detailDate != null && data.detailDate != "") {
              data.detailDate = data.detailDate.substring(0, 10);
            }
            if (data.expectedDate != null && data.expectedDate != "") {
              data.expectedDate = data.expectedDate.substring(0, 10);
            }
          }
          var value = response.data;
          var keyname = "shippmentlist";
          this.messageappend(item, value, keyname);
        }
      });
    },
    //在厂
    inFactoryclick(item, index) {
      let obj = {
        materialCode: item.materialCode,
        productCode: item.productCode,
        inventory: item.inventory,
        dvanceSale: "notDvanceSale",
        detailType: "material",
        validDate: this.value1
      };
      inFactorydetails(obj).then(response => {
        if (response.code === "0") {
          for (var i = 0; i < response.data.inFactoryDetailList.length; i++) {
            let data = response.data.inFactoryDetailList[i];
            if (data.detailDate != null && data.detailDate != "") {
              data.detailDate = data.detailDate.substring(0, 10);
            }
          }
          for (var j = 0; j < response.data.inProductionDetailList.length; j++) {
            let data = response.data.inProductionDetailList[j];
            if (data.detailDate != null && data.detailDate != "") {
              data.detailDate = data.detailDate.substring(0, 10);
            }
          }
          var value = response.data;
          var keyname = "inFactoryDetailList";
          var keynameorder = "inProductionDetailList";
          item[keynameorder] = value.inProductionDetailList;
          this.messageappend(item, value.inFactoryDetailList, keyname);
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
      this.newboardpageSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.newboardpageSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.newboard {
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}
table.prod {
  thead {
    position: absolute;
    th:first-child {
      width: 140px;
    }
    th:nth-child(3) {
      width: 140px;
    }
    th {
      width: 100px;
    }
  }
  tbody {
    tr {
      td:first-child {
        width: 140px;
      }
      td:nth-child(3) {
        width: 140px;
      }
      td {
        width: 100px;
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
    tr:hover {
      background: #f5f7fa;
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