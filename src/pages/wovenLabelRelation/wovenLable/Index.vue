<template>
  <div class="container wovenLable">
    <div class="actions_part clearfix" v-if="isShowEdit==false">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">织标物料编号：</span>
          <el-input
            class="input_single w200 mr10"
            v-model.trim="wovenLableMaterialCode"
            placeholder="请输入"
          ></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">面料产品编号：</span>
          <el-input
            class="input_single w200 mr10"
            v-model.trim="FabricProductCode"
            placeholder="请输入"
          ></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">面料物料编号：</span>
          <el-input
            class="input_single w200 mr10"
            v-model.trim="FabricMaterialCode"
            placeholder="请输入"
          ></el-input>
        </div>
      </div>
      <div class="actions_btn_wrap down t_right">
        <el-button
          type="primary"
          class="mr10"
          @click="exportHandle"
          v-preventReClick
          :disabled="this.isLoadingExport"
        >导出</el-button>
        <el-upload
          :headers="myHeaders"
          class="upload-demo inline_block mr10"
          :action="this.uploadurl"
          accept=".xlsx"
          :before-upload="beforeupload"
          :show-file-list="showfilelist"
          :on-success="UploadSuccess"
        >
          <el-button type="primary" @click="importHandle" :disabled="this.isLoadingImport">导入</el-button>
        </el-upload>
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
      <div class="container_table table_part clearfix mt20 w100p" style>
        <singleTable
          :tableList="wovenLableList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          :ifCheckbox="ifCheckbox"
          @checkBoxHandle="checkBoxHandle"
          @popoverHandle="popoverHandle"
          @deleteHandle="deleteHandle"
          @editHandle="factoryupd"
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
              :total="this.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>

    <div class="wovenLableAdd" v-else>
      <div class="actions_part clearfix">
        <div class="down fr">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            @click="addChildHandle()"
          ></el-button>
          <!--<el-button size="small" type="primary">EXCEL模式</el-button>-->
        </div>
      </div>
      <div>
        <!-- 编辑组件 -->
        <editTable
          :tableList="editRemarkData"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="editTailFieldsList"
          :tableFieldsList="editFieldsList"
          @deleteHandle="delChildHandle"
          @inputChange="inputChange"
          @datePickerChange="datePickerChange"
          @numberInputChange="numberInputChange"
        ></editTable>
        <div class="edit_btn_wrap mt10 fr">
          <el-button @click="cancelVisibleclick">取消</el-button>
          <el-button type="primary" @click="addVisibleclick">保存</el-button>
        </div>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <div class="add_popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
      >
        <el-tabs>
          <p class="add_goods_btn">编辑产品织标关系信息</p>
          <div class="add_goods_warp">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in addInventorysFieldList" :key="index">
                <span class="red mr5" v-if="item.isRules">*</span>
                {{item.name}}
              </li>
            </ul>
            <div class="allparentlist">
              <ul class="childcontentlist">
                <li class="w35p t_center">
                  <el-input
                    class="w200"
                    size="small"
                    maxlength="16"
                    v-model="addSubInventoryData.productCode"
                    @input="inventoryCodeChange"
                    placeholder="单行输入"
                  ></el-input>
                </li>
                <li class="w35p t_center">
                  <el-input
                    class="w200"
                    size="small"
                    maxlength="16"
                    v-model="addSubInventoryData.labelCode"
                    @input="inventoryNameChange"
                    placeholder="单行输入"
                  ></el-input>
                </li>
              </ul>
            </div>
          </div>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-preventReClick @click="submitInventoryHandle()">提交</el-button>
        </div>
      </el-dialog>
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
  materialInventorySearch,
  removeMaterialRemark,
  materialRemarkList,
  supplierDictList,
  purchasegetuuid,
  batchQuery,
  getProductCodeByMC,
  getCheckSupplierName,
  getSupplierByMC,
  existMaterialCode
} from "@/api/module/materialRemarkApi.js";
import {postpermission,exportFileWoven} from "@/api/accessPermission.js";
import {
  wovenLableList,
  removeWovenLable,
  updateWovenById,
  wovenAddBatch
} from "@/api/module/wovenLableApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
import Table from "@/layouts/components/common/Table.vue";
import { timeFormat } from "@/utils/index.js";
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "wovenLable",
  props: [],
  components: { singleTable, editDoubleTable, editTable },
  data() {
    return {
      materialRemark: "",
      supplierName: "",
      supplierCode: "",
      isShowEdit: false,
      dialogdelVisible: false,
      loadingsave: false,
      tableLoading: true,
      updtag: "",
      showId: "",
      requestList: [],
      form: [],
      goodsTypeList: [],
      // 编辑数据
      editData: {},
      isEmptyData: true,
      isDisabledPull: false,
      isCustomerOrder: false,
      isDisabledSupplier: false,
      isFactoryAllocation: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      //我的
      materialCode: "",
      wovenLableList: [],
      ifCheckbox: true,
      supplierList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      deleteId: "",
      editRemarkData: [],
      idItems:[],
      //
      wovenLableMaterialCode: "",
      FabricProductCode: "",
      FabricMaterialCode: "",
      ifCheckbox: true,
      isLoadingExport: false,
      myHeaders: {
        Authorization: "bearer " + this.$keycloak.token
      },
      uploadurl: "",
      showfilelist: false,
      isLoadingImport: false,
      //弹框
      popupTitle: '',
      dialogFormVisible: false,
      addInventorysFieldList: [
        {
          name: '面料产品编号',
          class: 'w35p',
          isRules: true
        },
        {
          name: '织标物料编号',
          class: 'w35p',
          isRules: true
        }
      ],
      addSubInventoryData: {
      },
      //new
      leaderFieldsList: [],
      fieldsList: [
        {
          name: "序号",
          field: "idIndex"
        },
        {
          name: "面料产品编号",
          field: "productCode"
        },
        {
          name: "织标物料编号",
          field: "labelCode",
        },
        {
          name: "面料物料编号",
          field: "materialCode"
        }
      ],
      tailFieldsList: [
        {
          name: "操作",
          field: "",
          class: "",
          width: "200",
          minWidth: "10%",
          isAction: true,
          hasEdit: true,
          hasDelete: true
        }
      ],
      leaderFieldsList: [],
      editFieldsList: [
        {
          name: "* 面料产品编号",
          field: "productCode",
          class: "w10p",
          isRules: true
        },
        {
          name: "* 织标物料编号",
          field: "labelCode",
          class: "w16p"
        }
      ],
      editTailFieldsList: [
        {
          name: "操作",
          field: "",
          class: "",
          width: "200",
          isAction: true,
          hasDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        supplierCode: true
      },
      inputSet: {
        labelCode: {
          maxlength: "100",
          placeholder: ""
        },
        productCode: {
          maxlength: "100",
          placeholder: ""
        }
      },
      selectSet: {},
      numberInputSet: {},
      datePickerSet: {}
    };
  },
  created() {},
  mounted() {
    this.getWovenLableList();
    this.getSupplierDictList();
  },
  methods: {
    checkBoxHandle(val){
     console.log(val)
     let idList=[];
     this.idItems=[];
     for(var i=0;i<val.length;i++){
       let item=val[i];
       console.log(item)
       idList.push(item.id)
     }
     this.idItems=idList;
     console.log(idList)
    },
    getWovenLableList() {
      this.tableLoading = true;
      let obj = {
        materialCode: this.FabricMaterialCode,
        productCode: this.FabricProductCode,
        labelCode: this.wovenLableMaterialCode
      };
      wovenLableList(this.currentPage, this.pageSize, obj).then(response => {
        console.log("产品织标列表:", response);
        if (response.code === "0") {
          this.total = response.data.total;
          this.wovenLableList = response.data.records;
          this.tableLoading = false;
          for (var i = 0; i < this.wovenLableList.length; i++) {
            let item = this.wovenLableList[i];
            if (this.currentPage != 1) {
              item.idIndex = (this.currentPage - 1) * this.pageSize + (i + 1);
            } else {
              item.idIndex = i + 1;
            }
          }
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
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
    searchHandle() {
      // 搜索
      this.currentPage = 1;
      this.getWovenLableList();
    },
    deleteHandle(index, item) {
      // 删除项
      console.log(item.id);
      this.deleteId = item.id;
      this.dialogdelVisible = true;
    },
    //删除确定
    delVisibleclick() {
      removeWovenLable(this.deleteId).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.dialogdelVisible = false;
          this.getWovenLableList();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getWovenLableList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getWovenLableList();
    },
    //新增
    addHandle() {
      this.isShowEdit = true;
      this.editRemarkData = [];
    },
    addChildHandle(index, item) {
      console.log(index, item);
      var addobj = {
        materialCode: "",
        supplierName: "",
        remark: "",
        uuid: ""
      };
      this.updateEditModeSet("add", addobj);
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          addobj.uuid = response.data;
        }
      });
      this.editRemarkData.push(addobj);
      console.log(this.editRemarkData);
    },
    factoryupd(index, item) {
      console.log(index, item);
      this.popupTitle = '产品织标关系';
      this.dialogFormVisible = true;

      this.addSubInventoryData.id = item.id;
      this.addSubInventoryData.productCode = item.productCode;
      this.addSubInventoryData.labelCode = item.labelCode;

      // this.updtag = "upd";
      // this.isShowEdit = true;
      // item.supplierCode = this.getFabricSupplierHandle(item.supplierName);
      // this.$forceUpdate();
      // console.log(item);
      // this.showId = item.supplierCode;
      // this.editRemarkData = [];
      // this.updateEditModeSet("edit", item);
      // this.editRemarkData.push(item);
      // console.log("可就是看的风景：", this.editRemarkData);
    },
    inventoryCodeChange() {
      this.$forceUpdate();
    },
    inventoryNameChange() {
      this.$forceUpdate();
    },
    submitInventoryHandle(){
      if (!this.addSubInventoryData.productCode) {
        this.$message({
          type: 'error',
          message: '请填写面料产品编号！'
        });
        return false;
      }
      if (!this.addSubInventoryData.labelCode) {
        this.$message({
          type: 'error',
          message: '请填写织标物料编号！'
        });
        return false;
      }
      updateWovenById(this.addSubInventoryData).then(res=>{
        console.log(res);
        this.dialogFormVisible = false;
        this.getWovenLableList();
        if(res.code == "0"){
          this.$message({
            message: '提交成功！',
            type: 'success'
          });
        }
      })
    },
    getFabricSupplierHandle(status) {
      for (var i = 0; i < this.supplierList.length; i++) {
        let item = this.supplierList[i];
        if (item.supplierName == status) {
          return item.supplierCode;
        }
      }
    },
    cancelVisibleclick() {
      this.isShowEdit = false;
      this.getWovenLableList();
    },
    close(tag) {
      console.log(tag);
      this.isShowEdit = false;
      this.form = {
        factoryGoodsList: [],
        supplierCode: ""
        // supplierName: ""
      };
      if (tag == "submit") {
        this.getWovenLableList();
      }
      console.log(this.form);
    },
    inputChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editRemarkData));
      switch (fieldItem.field) {
        case "materialCode":
          console.log("物料编号改变：", val, item, fieldItem);
          if (!item.materialCode) {
            this.$message({
              type: "error",
              message: "请输入物料编号！"
            });
            return false;
          }
          existMaterialCode(item.materialCode).then(res => {
            console.log(res);
            if (res.data == null) {
              this.$message({
                type: "error",
                message: "该物料编号不存在！"
              });
              item.materialCode = "";
              return false;
            }
            if (res.data.supplierShortName == "") {
              this.$message({
                type: "error",
                message: "该物料编号无供应商！"
              });
              item.materialCode = "";
              return false;
            }
            item.supplierCode = res.data.supplierShortName;
            item.supplierName = res.data.supplierName;
            this.updateEditModeSet("add", item);
            console.log(item);
            console.log(this.editRemarkData);
            this.$forceUpdate();
          });
      }
    },
    inputBlur(val, item, fieldItem) {
      console.log("222");
    },
    selectVisibleChange(val, item, fieldItem) {
      console.log("333");
    },
    delChildHandle(index, item) {
      if (this.editRemarkData.length > 1) {
        this.editRemarkData.splice(index, 1);
      } else {
        this.editRemarkData = [];
      }
    },
    addVisibleclick() {
      if (this.submitCheck() == false) {
        console.log("error submit");
      } else {
        var obj=[]
        console.log(this.editRemarkData);
        for (var i = 0; i < this.editRemarkData.length; i++) {
          var data = this.editRemarkData[i];
          var single = {
            labelCode: data.labelCode,
            productCode: data.productCode,
            uuid: data.uuid
          };
          obj.push(single);
        }
        wovenAddBatch(obj).then(res => {
          if (res.code == "0") {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.loadingsave = false;
            this.isShowEdit = false;
            this.getWovenLableList();
          } else {
            this.loadingsave = false;
          }
        });
        this.getWovenLableList();
        this.$forceUpdate();
      }
    },
    submitCheck() {
      console.log(this.editRemarkData);
      for (var i = 0; i < this.editRemarkData.length; i++) {
        let item = this.editRemarkData[i];
        if (!item.productCode) {
          this.$message({
            message: "面料产品编号不能为空!",
            type: "error"
          });
          return false;
        } else if (!item.labelCode) {
          this.$message({
            message: "织标物料编号不能为空",
            type: "error"
          });
          return false;
        }
      }
    },
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let selectSet = JSON.parse(JSON.stringify(this.selectSet));
      if (type == "edit") {
        switch (status) {
          case "Draft":
            break;
          case "Approved":
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
    //导出
    exportHandle() {
      console.log(this.idItems);
      this.tableLoading = true;
      this.isLoadingExport = true;
      let item = true;
      if (this.idItems != "") {
        exportFileWoven(this.idItems).then(res => {
          console.log(res);
          this.tableLoading = false;
          this.isLoadingExport = false;
          var blob = new Blob([res]);
          var url = window.URL.createObjectURL(blob);
          var aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.download = "产品织标关系" + ".xlsx"; //下载后文件名
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择勾选项!"
        });
        this.tableLoading = false;
        this.isLoadingExport = false;
      }
    },
    beforeupload(file) {
      this.tableLoading = true;
      this.isLoadingImport = true;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const isLt2M = file.size / 1024 / 1024 < 10; //这里做文件大小限制
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过2MB!",
          type: "error"
        });
        this.tableLoading = false;
        this.isLoadingImport = false;
      }
      return isLt2M;
    },
    //订单导入成功之后
    UploadSuccess(response, file) {
      if (response.code == 0) {
        this.$message({
          message: "导入成功",
          type: "success"
        });
        this.tableLoading = false;
        this.isLoadingImport = false;
        //this.getPurchasePriceList();
      } else {
        this.$message({
          message: response.message,
          type: "error"
        });
        this.tableLoading = false;
        this.isLoadingImport = false;
      }
    },
    //导入
    importHandle() {
      console.log(this.idItems)
      if (this.idItems) this.uploadurl = process.env.VUE_APP_PRODUCT_URL + "productlabel/v1/importExcel";
      console.log(this.uploadurl);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.wovenLable {
  padding-bottom: 80px !important;
}
// button.el-button.el-button--danger.is-circle {
//   padding: 7px;
// }
</style>
<style>
</style>