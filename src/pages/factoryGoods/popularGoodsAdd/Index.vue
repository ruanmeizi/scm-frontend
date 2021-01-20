<template>
  <div class="popularGoodsAdd">
    <div class="actions_part clearfix" v-if="dialogaddVisible==false">
      <div class="actions_wrap fl">
        <div class="display_ib mr10 mb10">
          <span class="red mr5">*</span>
          <span class="tag">供应商：</span>
          <el-select
            class="select_single w200 mr10"
            :title="supplierCode"
            v-model="supplierCode"
            filterable
            @change="getselectHandle"
            placeholder="请选择">
            <el-option key label="请选择" value></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierCode"
              :label="item.supplierCode"
              :value="item.supplierCode"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="down fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          circle
          title="添加"
          @click="addChildHandle"
        ></el-button>
        <!--<el-button size="small" type="primary">EXCEL模式</el-button>-->
      </div>
    </div>
    <upload-excel-component class="mb20" :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />
    <div>
      <!-- 编辑组件 -->
      <editTable
        :tableList="form.factoryGoodsList"
        :tableLeaderFieldsList="leaderFieldsList"
        :tableTailFieldsList="tailFieldsList"
        :tableFieldsList="editFieldsList"
        @deleteHandle="delChildHandle">
      </editTable>

      <div class="edit_btn_wrap mt10 fr">
        <el-button @click="cancelVisibleclick">取消</el-button>
        <el-button type="primary" @click="addVisibleclick">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { purchasegetuuid, popularGoodsAdd, supplierDictList, goodsTypeList, getUpdShow, getmaterialCodeUnit } from "@/api/module/popularGoodsApi.js";
import { timeFormat } from "@/utils/index.js";
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "popularGoodsAdd",
  props: ["updtag", "supplierList", "goodsTypeList", "showId"],
  components: {
    editTable,
    UploadExcelComponent
  },
  data() {
    return {
      supplierName: "",
      supplierCode: "",
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      dialogaddVisible: false,
      dialogdelVisible: false,
      loadingsave: false,
      ifchildshow: false,
      requestList: [],
      form: {
        factoryGoodsList: [],
        supplierCode: "",
        supplierName: "",
        supplierCode:"",
        parentUuid: ""
      },
      fieldList: [
        {
          name: "物料编号",
          index: 1,
          class: "w15p"
        },
        {
          name: "快货类型",
          index: 2,
          class: "w15p"
        },
        {
          name: "现货",
          index: 3,
          class: "w18p"
        },
        {
          name: "15天快货",
          index: 4,
          class: "w18p"
        },
        {
          name: "30-45天快货",
          index: 5,
          class: "w15p"
        },
        {
          name: "",
          index: 6,
          class: "w15p"
        }
      ],

      // 编辑组件数据
      editFieldsList: [
        {
          name: '* 快货类型',
          field: 'goodsType',
          class: 'w16p',
          // width: '150',
          isRules: true
        },
        {
          name: '现货',
          field: 'spotGoodsQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          // width: '150'
        },
        {
          name: '15天快货',
          field: 'halfMonthQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          // width: '150'
        },
        {
          name: '30-45天快货',
          field: 'afterMonthQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w18p',
          // width: '150'
        }
      ],
      leaderFieldsList: [
        {
          name: '行号',
          field: 'sn',
          class: 'w16p',
          // width: '150'
        },
        {
          name: '* 物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '200',
          isRules: true
        }
      ],
      tailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          isAction: true,
          hasDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        sn: true
      },
      inputSet: {
        materialCode: {
          maxlength: '64',
          placeholder: ''
        },
        spotGoodsQuantity: {
          maxlength: '8',
          placeholder: ''
        },
        halfMonthQuantity: {
          maxlength: '8',
          placeholder: ''
        },
        afterMonthQuantity: {
          maxlength: '8',
          placeholder: ''
        }
      },
      selectSet: {
        goodsType: {
          selectListName: 'goodsTypeList',
          value: 'index',
          label: 'name'
        }
      },
      numberInputSet: {},
      datePickerSet: {}

    };
  },
  created() {},
  mounted() {
    console.log(this.updtag);
    if (this.updtag == "add") {
      console.log("addChild");
      this.ifchildshow = false;
      this.form = {
        factoryGoodsList: [],
        supplierCode: this.supplierCode,
        supplierName: "",
        parentUuid: ""
      };
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          this.form.parentUuid = response.data;
        }
      });
    } else {
      this.updShow();
    }
  },
  methods: {
    // Upload Excel Edit
    importExcelBeforeUpload(file) {
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      const isXLSX = fileType === 'xlsx';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message({
          message: '请不要上传大于1M的文件！',
          type: 'error'
        });
        return false;
      };
      if (!isXLSX) {
        this.$message.error('仅支持上传.xlsx后缀文件！');
      }
      if (isXLSX) {
        this.editPartLoading = true;
        isType = true;
      }
      return isType;
    },
    async importExcelSuccess({ results, header }) {
      // console.log('导入数据：', results, header);
      if (results && results.length) {
        let editData = {};
        if (this.updtag == 'add') {
          editData = {
            supplierCode: '',
            supplierName: '',
            parentUuid: '',
            factoryGoodsList: []
          };
          editData = Object.assign(editData, this.form);
          if (!editData.parentUuid) {
            await purchasegetuuid().then(res => {
              if (res.code === '0') {
                editData.parentUuid = res.data;
              }
            });
          }
          this.updateEditModeSet('add', editData);
        } else {
          editData = JSON.parse(JSON.stringify(this.form));
          editData.factoryGoodsList = [];
        }

        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let editItemData = {
            materialCode: '',
            goodsType: '',
            spotGoodsQuantity: '',
            halfMonthQuantity: '',
            afterMonthQuantity: '',
            purchaseMeasurementUnit: '米',
            uuid: ''
          };
          await purchasegetuuid().then(res => {
            if (res.code === '0') {
              editItemData.uuid = res.data;
            }
          });
          editItemData.goodsTypeList = this.goodsTypeList;
          this.updateEditModeSet('add', editItemData);
          Object.keys(item).map((key) => {
            // console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '行号') {
              editItemData.sn = item[key];
            } else if (key === '物料编号') {
              editItemData.materialCode = item[key];
            } else if (key === '快货类型') {
              let goodsTypeData = this.goodsTypeList.find(x => {
                return x.name === item[key];
              });
              editItemData.goodsType = goodsTypeData ? goodsTypeData.index : '';
              editItemData.goodsTypeName = item[key];
            } else if (key === '现货') {
              editItemData.spotGoodsQuantity = item[key];
            } else if (key === '15天快货') {
              editItemData.halfMonthQuantity = item[key];
            } else if (key === '30-45天快货') {
              editItemData.afterMonthQuantity = item[key];
            }
          });
          editData.factoryGoodsList.push(editItemData);
        }

        for (let i = 0; i < editData.factoryGoodsList.length; i++) {
          let item = editData.factoryGoodsList[i];
          for (let j = 0; j < this.form.factoryGoodsList.length; j++) {
            let oItem = this.form.factoryGoodsList[j];
            if (oItem.sn === item.sn && oItem.materialCode === item.materialCode) {
              item = Object.assign(item, oItem);
              this.$forceUpdate();
            }
          }
        }
        console.log('公筷导入完成：', editData);
        this.form = editData;
        this.$forceUpdate();
        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },

    updShow() {
      getUpdShow(this.showId).then(response => {
        if (response.code === "0") {
          this.form = response.data;
          if (this.form.factoryGoodsList.length > 0) {
            this.ifchildshow = true;
            for (var i = 0; i < this.form.factoryGoodsList.length; i++) {
              let item = this.form.factoryGoodsList[i];
              this.supplierCode = this.form.supplierCode;
              this.supplierName = this.form.supplierName;
              item.goodsTypeList = this.goodsTypeList;
              this.updateEditModeSet('edit', item);
            }
          } else {
            this.ifchildshow = false;
          }

          console.log('编辑列表数据：', this.form.factoryGoodsList);
        }
      });
    },
    oninput(num) {
      console.log(num);
      var str = num;
      var len1 = str.substr(0, 1);
      var len2 = str.substr(1, 1);
      var lenLast = str.substr(str.length - 1);
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      //第一位不能是.
      if (len1 == ".") {
        str = "";
      }
      //最后一位不能是.
      if (str.length == 8 && lenLast == ".") {
        str = "";
      }
      //限制只能输入一个小数点
      if (str.indexOf(".") != -1) {
        var str_ = str.substr(str.indexOf(".") + 1);
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      //正则替换
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/\.\d\d\d$/, ""); // 小数点后只能输两位
      return str;
    },
    handlerPageNo(item) {
      getmaterialCodeUnit(item.materialCode).then(response => {
        if (response.code === "0") {
          item.purchaseMeasurementUnit = response.data;
          this.$forceUpdate();
        }
      });
    },
    getSupplierDictList() {
      // 供应商列表
      console.log("供应商");
      supplierDictList().then(res => {
        console.log("供应商列表：", res);
        if (res.code === "0") {
          this.supplierList = res.data;
        }
      });
    },
    getGoodsType() {
      goodsTypeList().then(res => {
        console.log("快货类型列表：", res);
        if (res.code === "0") {
          this.goodsTypeList = res.data;
        }
      });
    },
    getselectHandle(e) {
      console.log(e)
      this.form.supplierCode =e;
      // this.form.supplierName = this.popularHandle(e,'supplierName');
      // this.supplierName = this.popularHandle(e);
      for (var i = 0; i < this.supplierList.length; i++) {
        let item = this.supplierList[i];
          if (e == item.supplierCode) {
            // return item.supplierName;
            this.form.supplierName=item.supplierName;
            this.supplierName=item.supplierName
            this.form.supplierId=item.supplierId;
            this.$forceUpdate();
          }
      }
    },
    slectSuppliertHandle(status) {
      for (var i = 0; i < this.supplierList.length; i++) {
        let item = this.supplierList[i];
        if (status == item.supplierName) {
          return item.supplierId;
        }
      }
    },
    popularHandle(status,tag) {
      for (var i = 0; i < this.supplierList.length; i++) {
        let item = this.supplierList[i];
        if(tag=='supplierName'){
          if (status == item.supplierId) {
            return item.supplierName;
          }
        }else{
          if(status == item.supplierId){
            return item.supplierCode;
          }
        }
       
      }
    },
    //子项添加
    addChildHandle(index, item) {
      console.log(this.form);
      //  	console.log(this.ifchildshow)
      this.ifchildshow = true;
      //  	this.$forceUpdate();
      var addobj = {
        materialCode: "",
        goodsType: "",
        spotGoodsQuantity: "",
        halfMonthQuantity: "",
        afterMonthQuantity: "",
        purchaseMeasurementUnit: "米",
        uuid: ""
      };
      addobj.goodsTypeList = this.goodsTypeList;
      this.updateEditModeSet('add', addobj);
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          addobj.uuid = response.data;
        }
      });
      this.form.factoryGoodsList.push(addobj);
    },
    //删除子项数据
    delChildHandle(index, item) {
      if (this.form.factoryGoodsList.length > 1) {
        this.form.factoryGoodsList.splice(index, 1);
      } else {
        this.ifchildshow = false;
        this.form.factoryGoodsList = [];
      }
    },
    //取消
    cancelVisibleclick() {
      this.$emit("close", "cancel");
    },
    //提交
    addVisibleclick() {
      console.log(this.form);
      if (this.submitCheck() == false) {
        console.log("error submit");
      } else {
        popularGoodsAdd(this.form).then(res => {
          if (res.code == "0") {
            this.$message({
              message: "提交成功",
              type: "success"
            });
            this.loadingsave = false;
            this.$emit("close", "submit");
          } else {
            this.loadingsave = false;
          }
        });
      }
    },
    submitCheck() {
      console.log(this.supplierName)
      console.log(this.form)
      if (this.form.supplierCode == "") {
        this.$message({
          message: "供应商不能为空!",
          type: "error"
        });
        return false;
      }else if(this.form.factoryGoodsList==''){
         this.$message({
          message: "请添加工厂快货!",
          type: "error"
        });
        return false;
      }
      for (var i = 0; i < this.form.factoryGoodsList.length; i++) {
        let item = this.form.factoryGoodsList[i];
        if (item.materialCode == "") {
          this.$message({
            message: "物料编号不能为空!",
            type: "error"
          });
          return false;
        } else if (item.goodsType == "") {
          this.$message({
            message: "快货类型不能为空!",
            type: "error"
          });
          return false;
        }
        if(item.spotGoodsQuantity){
            var numVal=item.spotGoodsQuantity;
            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
            if (numVal != "") { 
              console.log(reg.test(numVal))
              if (!reg.test(numVal)) { 
                  this.$message({
                    type: 'error',
                    message: '现货中请输入正确的数字!'
                  });
                // 返回，不往下执行
                return false;
              }
            }
          }
          if(item.halfMonthQuantity){
            var numVal=item.halfMonthQuantity;
            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
            if (numVal != "") { 
              if (!reg.test(numVal)) { 
                  this.$message({
                    type: 'error',
                    message: '15天快货中请输入正确的数字!'
                  });
                // 返回，不往下执行
                return false;
              } 
            }
          }
          if(item.afterMonthQuantity){
            var numVal=item.afterMonthQuantity;
            var reg = /^\d+(?=\.{0,1}\d+$|$)/;
            if (numVal != "") { 
              if (!reg.test(numVal)) { 
                  this.$message({
                    type: 'error',
                    message: '30-45天快货中请输入正确的数字!'
                  });
                // 返回，不往下执行
                return false;
              } 
            }
          }
      }
    },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      if (type == 'edit') {
        switch (status) {
          case 'Draft':
            
            break;
          case 'Approved':
            
            break;
          default:
            break;
        }
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.selectSet = selectSet;
      data.editModeSet = editModeSet;
    },

  }
};
</script>

<style>
/* button.el-button.el-button--danger.is-circle {
  padding: 3px;
  margin-top: 10px;
} */
</style>