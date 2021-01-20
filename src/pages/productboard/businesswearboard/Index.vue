<template>
  <div class="container businesswearboard">
    <div class="commoncontent">
      <!--<p>职业装看板</p>-->
      <div class="actions_part clearfix" ref="wsearch">
      	<div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">样本画册编号：</span>
            <el-input class="input_single w200 mr10" v-model="pictureBookCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品编号：</span>
            <el-autocomplete
              placeholder="请输入"
              class="input_single w200 mr10"
              v-model.trim="materialCode"
              :fetch-suggestions="querySearchAsync"
              @select="handleSelect()"
            ></el-autocomplete>
          </div>
           <div class="display_ib mr10 mb10">
            <span class="tag">职业装属性：</span>
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
            <span class="tag">销售季：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="saleSeasou"
               @change="searchclick"
              placeholder="请选择销售季">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in SaleSeasoutypelist"
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
      <div class="container_table table_part clearfix mt20">
        <singleTable
          :tableList="businesswearList"
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
  businessserch,
  availabledetails,
  meterialdetails,
  subsequentdetails,
  scheduleddetails,
  onthewaydetails,
  inFactorydetails,
  productboardCode,
  fabrictypeSaleSeasou,
  searchReserveDetail
} from "@/api/module/materialboardApi.js";
import {
  fabrictypeProductClass,
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import {  fabrictypeMaterialproperties } from "@/api/module/unsboardApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "businesswearboard",
  data() {
    return {
      tableLoading: true,
      materialCode: "",
      value1: "",
      pageSize: 10, //每页显示多少条
      size: "",
      allpage: 0,
      currentPage: 1, //页数
      activeName: "first",
      activeNameagain: "first",
      inventory: "C0",
      businesswearList: [],
      materialAttribute:'',
      MaterialPropertiestypelist:[],
      saleSeasou: "",
      SaleSeasoutypelist: [],
      pictureBookCode:'',
      wrapHeight:0,
      navHeight:190,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },

      // New
      leaderFieldsList: [
       {
          name: "产品编号",
          field: "productCode",
          class: "w50p",
          width: "150"
        },
      ],
      fieldsList: [
         {
          name: "物料编号",
          field: "materialCode",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table',
            width: '500',
            trigger: 'click',
            placement: 'right', // 弹层显示位置
            parentName: '物料编号',
            parentField: 'materialCode',
            listName: 'materialDetailList',
            fields: [
              {
                name: '物料名称',
                field: "materialName",
                width: "100"
              },
              {
                name: '供应商名称',
                field: "supplierName",
                width: "100"
              },
              {
                name: '样本分类',
                field: "sampleMaterialCodes",
                width: "100"
              },
              {
                name: '工厂快货',
                field: "mobileGoods",
                width: "100"
              },
              {
                name: '经济批量',
                field: "economicBatch",
                width: "100"
              }
            ]
          }
        },
        {
          name: "职业装属性",
          field: "materialProperties",
          width: "150"
        },
        {
          name: "在库可用库存",
          field: "inStockInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table',
            width: '200',
            trigger: 'click',
            placement: 'right',
            parentName: '在库可用库存',
            parentField: 'inStockInventory',
            listName: '',
            fields: [
              {
                name: '01A库(批发库)',
                field: 'availQuantity1',
                width: '100'
              },
              {
                name: '02B库(批发零头库)',
                field: 'availQuantity2',
                width: '100'
              }
              // {
              //   name: '',
              //   field: '',
              //   width: '200',
              //   children: [
              //     {
              //       name: '01A库(批发库)',
              //       field: 'availQuantity1',
              //       width: '100'
              //     },
              //     {
              //       name: '02B库(零剪库)',
              //       field: 'availQuantity2',
              //       width: '100'
              //     }
              //   ]
              // },
              // {
              //   name: '预留库存',
              //   field: '',
              //   width: '300',
              //   children: [
              //     {
              //       name: '一类预留',
              //       field: 'quantity',
              //       width: '100'
              //     },
              //     {
              //       name: '超一类预留',
              //       field: 'quantity2',
              //       width: '100'
              //     },
              //     {
              //       name: '已承诺(已下销售订单但未发货)',
              //       field: 'quantityCount',
              //       width: '100'
              //     }
              //   ]
              // }
            ]
          }
        },
        {
          name: "后续备货总量（明细）",
          field: "subsequentReady",
          width: "200",
          hasPopover: true,
          popovers: {
            popType: 'table',
            width: '400',
            trigger: 'click',
            placement: 'right',
            parentName: '后续备货总量（明细）',
            parentField: 'subsequentReady',
            listName: '',
            fields: [
              {
                name: '后续备货明细',
                field: 'stockDetails',
                width: '100'
              },
              {
                name: '在途',
                field: 'shippmentInventory',
                width: '100'
              },
              {
                name: '在厂（在产+货妥）',
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
          name: "可用备货总量（含询单）",
          field: "availableReadyAll",
          width: "200"
        },
        {
          name:'可用备货总量(不含询单）',
          field:"subsequentReadyAll",
          width:"200"
        },
        {
          name: "后续备货总量(按月)",
          field: "scheduledReceipt",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tab_tail',
            width: '518',
            trigger: 'click',
            placement: 'right',
            parentName: '后续备货总量(按月)',
            parentField: 'scheduledReceipt',
            listName: '',
            // tail: 'scheduledReceiptTail',
            tabs: [
              {
                name: '含询单',
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
                name: '不含询单',
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
          name: "在途",
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
                name: '调拨日期',
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
          name: "在厂",
          field: "inFactoryInventory",
          width: "150"
        },
         {
          name:'在厂在产',
          field:'inProduceInventory',
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table_tail',
            width: '450',
            trigger: 'click',
            placement: 'right',
            parentName: '在厂在产',
            parentField: 'inProduceInventory',
            listName: '',
            tail: 'inFactoryInventoryTail',
            fields: [
              {
                name: '数量',
                field: 'inProductionQuantity',
                width: '150'
              },
              {
                name: '投产日期',
                field: 'confirmTime',
                width: '150'
              },
              {
                name: '货妥日期',
                field: 'cargoTime',
                width: '150'
              },
              // {
              //   name: '期望交期',
              //   field: 'requiredTime',
              //   width: '120'
              // },
              // {
              //   name: '工厂交期',
              //   field: 'factoryTime',
              //   width: '120'
              // }
            ]
          }
        },
        {
          name:'在厂货妥',
          field:'inStockMaterialInventory',
          width:'150'
        },
        {
          name: "询单",
          field: "purchaseOrderItemDraft",
          width: "150"
        },
        {
          name: "预留",
          field: "reservedInventory",
          width: "150",
          hasPopover: true,
          popovers: {
            popType: 'table',
            width: '600',
            trigger: 'click',
            placement: 'right',
            parentName: '预留',
            parentField: 'reservedInventory',
            listName: '',
            fields: [
              {
                name: '预留单号',
                field: 'reserveId',
                width: '120'
              },
              {
                name: '仓位',
                field: 'inventory',
                width: '120'
              },
              {
                name: '库位',
                field: 'subInventory',
                width: '120'
              },
              {
                name: '预留数量',
                field: 'number',
                width: '120'
              },
              {
                name:'预留时间',
                field: 'reserveTime',
                width: '120'
              }
            ]
          }
        }
      ],
      tailFieldsList: [],

    };
  },
  components: {
    singleTable
  },
  computed: {
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight - this.wrapHeight-this.navHeight) + 'px';
    }
  },
  created() {},
  mounted() {
    this.getRetailAndSuitsMaterialProperties();    
    this.businessWearSearch();
    this.getSaleSeasou();
    var day = new Date();
    day.setTime(day.getTime());
    var s2 = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.value1 = s2;
    this.wrapHeight=this.$refs.wsearch.clientHeight;
  },
  watch: {},
  methods: {
    querySearchAsync(queryString, cb) {
      console.log(queryString);
      productboardCode(queryString.replace("/", "")).then(response => {
        if (response.code === "0") {
          var restaurants = response.data;
          var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 500 * Math.random());
        }
      });
    },
    createStateFilter(queryString) {
      return combinedMaterialCode => {
        return combinedMaterialCode;
        //        return (combinedMaterialCode.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    //列表分页
    businessWearSearch() {
      this.tableLoading = true;
      let obj = {
        materialCode: this.materialCode,
        materialProperties: this.materialAttribute,
        inventory: "C0",
        saleSeason: this.saleSeasou,
        pictureBookCode:this.pictureBookCode,
        detailType: "product",
        validDate: this.value1
      };
      businessserch(this.currentPage, this.pageSize, obj).then(response => {
        console.log('职业装看板列表：', response);
        if (response.code === "0") {
          this.allpage = response.data.totalElements;
          this.businesswearList = response.data.content;
          this.businesswearList.forEach(item => {
            item.scheduledReceiptTail = '总计：' + item.scheduledReceipt;
            item.shippmentInventoryTail = '总计：' + item.shippmentInventory;
            item.inFactoryInventoryTail = '总计：' + item.inFactoryInventory;
          });
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    //物料编号详情
    meterialclick(item, index) {
      console.log(item);
      meterialdetails(item.materialCode, "product", this.value1, item.productCode).then(response => {
        if (response.code === "0") {
          var meterial = [response.data.data];
          item.meteriallist = meterial;
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
        inventory: item.inventory,
        inStockSaledInventory: item.inStockSaledInventory,
        detailType: "product",
        validDate: this.value1
      };
      availabledetails(obj).then(response => {
        if (response.code === "0") {
          var value = response.data;
          var keyname = "availablelist";
          this.messageappend(item, value, keyname);
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
        detailType: "product",
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
        detailType: "product",
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
    getSaleSeasou() {
      fabrictypeSaleSeasou().then(response => {
        if (response.code === "0") {
          this.SaleSeasoutypelist = response.data;
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
        detailType: "product",
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
        detailType: "product",
        validDate: this.value1
      };
      inFactorydetails(obj).then(response => {
          console.log('在厂数据列表：', response);
        if (response.code === "0") {
          for (var i = 0; i < response.data.cargoList.length; i++) {
            let data = response.data.cargoList[i];
            if (data.cargoTime != null && data.cargoTime != "") {
              data.cargoTime = data.cargoTime.substring(0, 10);
            }
          }
          for (var j = 0; j < response.data.productionList.length; j++) {
            let data = response.data.productionList[j];
            if (data.confirmTime != null && data.confirmTime != "") {
              data.confirmTime = data.confirmTime.substring(0, 10);
            }
            if (data.factoryTime != null && data.factoryTime != "") {
              data.factoryTime = data.factoryTime.substring(0, 10);
            }
            if (data.cargoTime != null && data.cargoTime != "") {
              data.cargoTime = data.cargoTime.substring(0, 10);
            }
          }
          var value = response.data;
          var keyname = "cargoList";
          var keynameorder = "productionList";
          this.$store.dispatch('getPopoverTabData', value);
          // item[keynameorder] = value.inProductionDetailList;
          // this.messageappend(item, value.inFactoryDetailList, keyname);
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
      this.businessWearSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.businessWearSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.businessWearSearch();
    },
    //产品分类
    //获取零剪和职业装物料属性
    getRetailAndSuitsMaterialProperties(){
       fabrictypedictionaries('RetailAndSuitsMaterialProperties').then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;  
          console.log('获取零剪和职业装物料属性',this.materialPropertiesTypelist);
        }
      });
    },
    popoverHandle(index, item, name, field) {
      console.log('弹层数据：', index, item, name, field);
      switch (field) {
        case 'materialCode':
          // 物料编码
          meterialdetails(item.materialCode, "product", this.value1, item.productCode).then(res => {
            if (res.code === "0") {
              var meterial = [res.data.data];
              for (var i = 0; i < meterial.length; i++) {
                let data = meterial[i];
                if(data.mobileGoods==true){
                  data.mobileGoods='是'
                }else if(data.mobileGoods==false){
                  data.mobileGoods='否'
                }
              }
              // item.materialDetailList = meterial;
              this.$store.dispatch('getPopoverList', meterial);
              // this.$emit();
              this.$forceUpdate();
            }
          });
          break;
        case 'inStockInventory':
          // 在库可用库存
          let obj = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            inStockSaledInventory: item.inStockSaledInventory,
            detailType: 'product',
            validDate: this.value1
          };
          availabledetails(obj).then(res => {
            console.log('在库可用库存弹层：', res);
            if (res.code === '0') {
              var value = res.data;
              var keyname = 'availablelist';
              this.$store.dispatch('getPopoverList', res.data);
              this.messageappend(item, value, keyname);
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
            dvanceSale: 'notDvanceSale',
            detailType: 'product',
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
            detailType: 'product',
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
            detailType: "product",
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
        case 'inProduceInventory':
          // 在厂
          let factoryData = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            dvanceSale: "notDvanceSale",
            detailType: "product",
            validDate: this.value1
          };
          inFactorydetails(factoryData).then(response => {
            console.log('在厂数据列表：', response);
            if (response.code === "0") {
              // for (var i = 0; i < response.data.cargoList.length; i++) {
              //   let data = response.data.cargoList[i];
              //   if (data.cargoTime != null && data.cargoTime != "") {
              //     data.cargoTime = data.cargoTime.substring(0, 10);
              //   }
              // }
              for (var j = 0; j < response.data.productionList.length; j++) {
                let data = response.data.productionList[j];
                if (data.confirmTime != null && data.confirmTime != "") {
                  data.confirmTime = data.confirmTime.substring(0, 10);
                }
                if (data.factoryTime != null && data.factoryTime != "") {
                  data.factoryTime = data.factoryTime.substring(0, 10);
                }
                if (data.cargoTime != null && data.cargoTime != "") {
                  data.cargoTime = data.cargoTime.substring(0, 10);
                }
                if (data.requiredTime != null && data.requiredTime != "") {
                  data.requiredTime = data.requiredTime.substring(0, 10);
                }
              }
              var value = response.data.productionList;
              this.businesswearList.forEach(item => {
                item.inFactoryInventoryTail = '总计：' + response.data.sumProduction
              });
              this.$store.dispatch('getPopoverList', value);
              // item[keynameorder] = value.inProductionDetailList;
              // this.messageappend(item, value.inFactoryDetailList, keyname);
            }
          });
          break;
        case 'reservedInventory':
           // 在厂
          let reservedData = {
            materialCode: item.materialCode,
            productCode: item.productCode,
            inventory: item.inventory,
            detailType: "material",
            validDate: this.value1
          };
          searchReserveDetail(reservedData).then(response => {
            console.log('预留详情列表', response);
            if (response.code === "0") {
              for (var i = 0; i < response.data.length; i++) {
                let data = response.data[i];
                if (data.reserveTime != null && data.reserveTime != "") {
                  data.reserveTime = data.reserveTime.substring(0, 10);
                }
              }
              var value = response.data;
              this.$store.dispatch('getPopoverList', value);
            }
          });
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
.businesswearboard {
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
// ul.formlist {
//   width: 100%;
//   height: 40px;
//   display: flex;
//   /*border-bottom: 1px solid #EBEEF5;*/
//   li {
//     /*border-bottom: 1px solid #C0C0C0;*/
//   }
//   li:last-child {
//     /*border-bottom: none;*/
//   }
// }

// table.tableclass {
//   thead {
//     background: #f5f7fa;
//     color: #909399;
//     height: 40px;
//     th {
//       padding: 10px 0;
//     }
//   }
//   tbody {
//     tr {
//       td {
//         padding: 10px 0;
//       }
//     }
//   }
// }
// table.contenttab {
//   tbody {
//     tr {
//       td {
//         font-size: 14px;
//         color: #606266;
//       }
//     }
//   }
// }
</style>
<style>
/* button.el-popover__reference {
  font-size: 14px;
  color: #606266;
} */
</style>