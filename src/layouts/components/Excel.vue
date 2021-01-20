<template>
  <!-- <div>
    <div class="clearfix mt20 mb10">
      <el-button class="fr" type="primary" @click="switchFormMode">表单模式</el-button>
    </div> -->
    <div class="mt20" ref="excelView" id="excelView" :style="spreadStyle"></div>
    <!-- <div
      slot="footer"
      class="dialog-footer fr"
      style="margin-top: 30px; margin-right: 20px;">
      <el-button type="primary" @click="runExcelHandle">保存</el-button>
    </div>
  </div> -->
</template>

<script>
import { changeObjKey, isCheckDate, oaDateToDateTime } from "@/utils/index.js";
export default {
  name: 'Excel',
  props: [],
  data () {
    return {
      excelFieldsList: [],
      excelList: [],
      excelProductList: [],
      excelSelectList: [],

      // Excel编辑模式
      isExcelMode: false,
      excelIo: {},
      spread: {},
      spreadNS: null,
      sheet: null,
      spreadStyle: {
        width: "100%",
        height: "600px"
      }

    }
  },
  created() {
    // document.querySelector('body').setAttribute('style', 'zoom: 100%;');

    // this.excelFieldsList = this.fieldsList;
    // this.excelList = this.list;
    // this.excelProductList = this.productList;
    // this.excelSelectList = this.selectList;
    // Excel 初始化
    // this.spreadNS = GC.Spread.Sheets;
    // this.spread = new this.spreadNS.Workbook(document.getElementById("excelView"), { sheetCount: 1 });
    // this.spread.refresh();
    // this.excelIo = new GC.Spread.Excel.IO();
    // this.sheet = this.spread.getSheet(0); // 表单底部tab
    // // this.initSpread(this.spread);
    // this.$emit('spread', this.spread);
  },
  mounted() {},
  beforeDestroy() {
    document.querySelector('body').setAttribute('style', 'zoom: 90%;');
  },
  computed: {},
  watch: {
    // fieldsList(list) {
    //   this.excelFieldsList = list;
    // },
    // list(list) {
    //   this.excelList = list;
    // },
    // productList(list) {
    //   this.excelProductList = list;
    // },
    // selectList(list) {
    //   this.excelSelectList = list;
    // }
  },
  methods: {
    // Excel编辑模式
    // switchEditMode() {
    //   // 切换编辑模式
    //   if (this.purchaseobj.virtualInventoryId == "") {
    //     this.$message({
    //       type: "error",
    //       message: "请先选择入库仓位！"
    //     });
    //     return false;
    //   }
    //   this.spread.refresh();
    //   this.isExcelMode = true;
    //   this.initSpread(this.spread);
    // },
    // switchFormMode() {
    //   this.spread.refresh();
    //   this.isExcelMode = false;
    // },

    // initSpread(spread) {
    //   console.log('初始化表格。。。');
    //   spread.suspendPaint();
    //   var products = this.getProducts(100);
    //   var sheet = spread.getSheet(0);
    //   if (this.excelSelectList && this.excelSelectList.length) {
    //     let combo = new this.spreadNS.CellTypes.ComboBox();
    //     combo.items(changeObjKey(this.excelSelectList)).editorValueType(this.spreadNS.CellTypes.EditorValueType.value);
    //     for (var i = 0; i < this.excelSelectList.length; i++) {
    //       this.excelSelectList[i].cellType = combo;
    //     }
    //   }
    //   sheet.autoGenerateColumns = false;
    //   sheet.setDataSource(products);
    //   // 绑定数据
    //   var colInfos = this.fieldsList;
    //   sheet.bindColumns(colInfos);
    //   spread.resumePaint();
    // },
    // Product(data, pList) {
    //   console.log('第三个附属鬼地方个', data, pList);
    //   console.log('款到发货个i', this);
    //   // let obj = {};

    //   if (data) {
    //     let obj = {};
    //     // for (var i = 0; i < pList.length; i++) {
    //     //   console.log('史蒂夫哦已v', data[pList[i]]);
    //     //   obj[pList[i]] = data[pList[i]];
    //     // }

    //     obj.uuid = data.uuid ? data.uuid : "";
    //     obj.id = data.id ? data.id : "";
    //     obj.subinventoryList = data.subinventoryList; // 库位列表
    //     obj.purchaseType = data.purchaseType ? data.purchaseType : "";
    //     obj.purchaseTypeName = data.purchaseTypeName ? data.purchaseTypeName : "";
    //     obj.virtualInventoryName = data.virtualInventoryName ? data.virtualInventoryName : "";

    //     obj.materialCode = data.materialCode;
    //     obj.productCode = data.productCode;
    //     obj.requiredDate = data.requiredDate;
    //     obj.requiredPackages = data.requiredPackages;
    //     obj.requiredQuantityPerPackage = data.requiredQuantityPerPackage;
    //     obj.requiredQuantity = data.requiredQuantity;
    //     obj.suggestQuantity = data.suggestQuantity;
    //     obj.subInventory = data.subInventory;
    //     obj.subInventoryName = data.subInventoryName;
    //     obj.specialRequire = data.specialRequire;
    //     obj.remark = data.remark;

    //     return obj;

    //   }
    //   // return obj;
    // },
    // getProducts(count) {
    //   var dataList = [];
    //   for (var i = 0; i < count; i++) {
    //     if (i + 1 <= this.excelList.length) {
    //       dataList[i] = this.Product(this.excelList[i], this.excelProductList);
    //       console.log('osiduosi ', dataList[i]);
    //     } else {
    //       dataList[i] = this.Product();
    //     }
    //   }
    //   return dataList;
    // },
    // runExcelHandle() {
    //   // Excel保存/提交审核
    //   this.$emit('excelData', this.sheet.getDataSource());
    // },
    // Excel编辑模式 end

  }
}
</script>

<style lang="scss">
</style>
