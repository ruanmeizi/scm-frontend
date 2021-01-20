<template>
  <div class="container popularGoods">
    <div class="actions_part clearfix" v-if="isShowEdit==false">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编号/系列：</span>
          <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select
            class="select_single w200 mr10"
            filterable
            @change="getMaterialRemarkList"
            v-model="supplierCode"
            placeholder="请选择"
          >
            <el-option key label="全部" value></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierCode"
              :value="item.supplierId"
            ></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">物料备注：</span>
          <el-input class="input_single w200 mr10" v-model.trim="materialRemark" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="actions_btn_wrap down t_right">
        <!-- <el-button type="primary" @click="excelDownload">导出Excel</el-button> -->
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
      <!-- :ifCheckbox="ifCheckbox" -->
      <singleTable
        :tableList="remarkList"
        :tableLeaderFieldsList="leaderFieldsList"
        :tableTailFieldsList="tailFieldsList"
        :tableFieldsList="fieldsList"
        @checkBoxHandle="checkBoxHandle"
        @popoverHandle="popoverHandle"
        @deleteHandle='deleteHandle'
        @editHandle='factoryupd'
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

   <div class="popularGoodsAdd" v-else>
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
        @numberInputChange="numberInputChange">
      </editTable>
      <div class="edit_btn_wrap mt10 fr">
        <el-button @click="cancelVisibleclick">取消</el-button>
        <el-button type="primary" @click="addVisibleclick">保存</el-button>
      </div>
    </div>
    </div>
    <!-- <popularGoodsAdd
        v-if="isShowEdit"
        :updtag="updtag"
        :supplierList="supplierList"
        :goodsTypeList="goodsTypeList"
        :showId="showId"
        :editRemarkData='editRemarkData'
        v-on:close="close"
    ></popularGoodsAdd> -->

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
  existMaterialCode,
  getMaterialSeries
  } from "@/api/module/materialRemarkApi.js";
// import popularGoodsAdd from "../popularGoodsAdd/Index.vue";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import editDoubleTable from "@/layouts/components/common/EditDoubleTableList.vue";
import Table from "@/layouts/components/common/Table.vue";
import { timeFormat } from "@/utils/index.js";
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "popularGoods",
  props: [],
  components: { singleTable, editDoubleTable,editTable},
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
      remarkList: [],
      ifCheckbox: true,
      supplierList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      deleteId:"",
      editRemarkData: [],
      //new
      leaderFieldsList: [],
      fieldsList: [
        {
          name: "序号",
          field: "idIndex"
        },
        {
          name: "物料编号/系列",
          field: "materialCode"
        },
        {
          name: "供应商",
          field: "supplierName",
          // field:"supplierCode",
          fabricSupplierName:'fabricSupplierName'
        },
        {
          name: "物料备注",
          field: "remark"
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
          hasEdit:true,
          hasDelete:true
        }
      ],
      leaderFieldsList: [
        
      ],
      editFieldsList: [
        {
          name: '* 物料编号/系列',
          field: 'materialCode',
          class: 'w10p',
          width: '300',
          isRules: true
        },
        {
          name: '* 供应商',
          field: 'supplierCode',
          class: 'w16p',
          width: '300'
        },
        {
          name: '* 物料备注',
          field: 'remark',
          class: 'w16p',
          width: '300'
        },
      ],
      editTailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '200',
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
        materialCode: {
          maxlength: '64',
          placeholder: ''
        },
        remark:{
          maxlength: '8',
          placeholder: ''
        }
      },
      selectSet: {},
      numberInputSet: {},
      datePickerSet: {}
    };
  },
  created() {},
  mounted() {
    this.getMaterialRemarkList();
    this.getSupplierDictList();
  },
  methods: {
    getMaterialRemarkList() {
      this.tableLoading = true;
      let obj = {
        materialCode: this.materialCode,
        remark: this.materialRemark,
        supplierId: this.supplierCode
      };
      materialRemarkList(this.currentPage, this.pageSize, obj).then(response => {
        console.log("物料备注列表:", response);
        if (response.code === "0") {
          this.total = response.data.total;
          this.remarkList = response.data.records;
          this.tableLoading = false;
          for(var i=0;i<this.remarkList.length;i++){
						let item=this.remarkList[i];
						if(this.currentPage!=1){
						item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
						}else{
						item.idIndex=i+1;
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
      this.getMaterialRemarkList();
    },
    deleteHandle(index,item) {
      // 删除项
      console.log(item.id);
      this.deleteId = item.id;
      this.dialogdelVisible = true;
    },
     //删除确定
    delVisibleclick() {
      removeMaterialRemark(this.deleteId).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.dialogdelVisible = false;
          this.getMaterialRemarkList();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMaterialRemarkList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMaterialRemarkList();
    },
    //新增
    addHandle() {
      this.isShowEdit = true;
       this.editRemarkData=[];
    },
    addChildHandle(index, item){
      console.log(index, item);
      var addobj=
        {
        materialCode: "",
        supplierName: "",
        remark:'',
        uuid: ""
        }
      this.updateEditModeSet('add', addobj)
      purchasegetuuid().then(response => {
        if (response.code === "0") {
            addobj.uuid= response.data;
        }
      });
      this.editRemarkData.push(addobj);
      console.log(this.editRemarkData);                                                                                                                                                                                                                                                                                                                                                       
    },
    factoryupd(index, item) {
      console.log(index, item);
      this.updtag = "upd";
      this.isShowEdit = true;
      item.supplierCode=this.getFabricSupplierHandle(item.supplierName);
      this.$forceUpdate();
      console.log(item)
      this.showId =  item.supplierCode;
      this.editRemarkData = [];
      this.updateEditModeSet('edit', item);
      this.editRemarkData.push(item);
      console.log('可就是看的风景：', this.editRemarkData);
    },
    getFabricSupplierHandle(status){
      for(var i=0;i<this.supplierList.length;i++){
          let item=this.supplierList[i];
           if(item.supplierName==status){
             return item.supplierCode
           }
      }
    },
    cancelVisibleclick(){
        this.isShowEdit = false;
        this.getMaterialRemarkList();
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
        this.getMaterialRemarkList();
      }
      console.log(this.form);
    },
    inputChange(val, item, fieldItem) {
        let editListCopy = JSON.parse(JSON.stringify(this.editRemarkData));
        switch (fieldItem.field) {
            case 'materialCode':
                console.log('物料编号改变：', val, item, fieldItem);
                 item.supplierShortName='';
                 item.supplierCode='';
                 item.supplierId='';
                 item.supplierName='';
                if (!item.materialCode) {
                this.$message({
                    type: 'error',
                    message: '请输入物料编号/系列！'
                    });
                    return false;
                }
                Promise.all([
                  new Promise((resolve,reject)=>{
                    getMaterialSeries(item.materialCode).then(res=>{
                      resolve(res)
                    })
                  }),
                  new Promise((resolve,reject)=>{
                     existMaterialCode(item.materialCode).then(res => {
                       resolve(res)
                     })
                  }),
                ]).then(result=>{
                  console.log('物料编号/系统数据',result);
                  for(var i=0;i<result.length;i++){
                    if(result[0].data==null && result[1].data==null){
                      this.$message({
                        type: 'error',
                        message: '该物料编号/系列 不存在！'
                      });
                      item.materialCode='';
                      return false;
                    }
                    //物料系统
                    if(result[1].data==null){
                      if(result[0].data.supplierShortName==''){
                        this.$message({
                          type: 'error',
                          message: '该物料系统无供应商！'
                        });
                        item.materialCode='';
                        return false;
                      }
                      item.supplierCode=result[0].data.supplierShortName;
                      item.supplierName=result[0].data.supplierName;
                      item.supplierShortName=result[0].data.supplierShortName;
                      item.supplierId=result[0].data.supplierId;
                      this.updateEditModeSet('add', item)
                      this.$forceUpdate();
                    }
                   //物料编号
                    if(result[1].data!=null){
                      if(result[1].data.supplierShortName==''){
                        this.$message({
                          type: 'error',
                          message: '该物料编号无供应商！'
                          });
                          item.materialCode='';
                          return false;
                        }
                        item.supplierCode=result[1].data.supplierShortName;
                        item.supplierName=result[1].data.supplierName;
                        item.supplierShortName=result[1].data.supplierShortName;
                        item.supplierId=result[1].data.supplierId;
                        this.updateEditModeSet('add', item)
                        this.$forceUpdate();
                    }
                  }
                })
                // getMaterialSeries(item.materialCode).then(res=>{
                //   console.log('nihao',res);
                // })

                // existMaterialCode(item.materialCode).then(res => {
                //     console.log(res);
                //     if(res.data==null){
                //         this.$message({
                //         type: 'error',
                //         message: '该物料编号不存在！'
                //         });
                //         item.materialCode='';
                //         return false;
                //     }
                //     if(res.data.supplierShortName==''){
                //       this.$message({
                //         type: 'error',
                //         message: '该物料编号无供应商！'
                //         });
                //         item.materialCode='';
                //         return false;
                //     }
                //     item.supplierCode=res.data.supplierShortName;
                //     item.supplierName=res.data.supplierName;
                //     this.updateEditModeSet('add', item)
                //     console.log(item)
                //     console.log(this.editRemarkData);
                //     this.$forceUpdate();
                // })
        }
    },
    inputBlur(val, item, fieldItem) {
        console.log('222');
    },
    selectVisibleChange(val, item, fieldItem) {
        console.log('333');
    },
    delChildHandle(index, item) {
      if (this.editRemarkData.length > 1) {
        this.editRemarkData.splice(index, 1);
      } else {
        this.editRemarkData = []
      }
    },
    addVisibleclick() {
        
      if (this.submitCheck() == false) {
        console.log("error submit");
      } else {
        var obj={
            createDtoList:[],
        }
        console.log(this.editRemarkData)
        for(var i=0;i<this.editRemarkData.length;i++){
            var data=this.editRemarkData[i]
            var single = {
                materialCode: data.materialCode,
                remark: data.remark,
                uuid:data.uuid,
                supplierId:data.supplierId,
                supplierName:data.supplierName,
                supplierShortName:data.supplierShortName,
                supplierCode:data.supplierCode,
            }
            obj.createDtoList.push(single);
        }
        console.log(obj);
        materialInventorySearch(obj).then(res => {
          if (res.code == "0") {
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.loadingsave = false;
            this.isShowEdit=false;
            this.getMaterialRemarkList();
          } else {
            this.loadingsave = false;
          }
        });
        this.getMaterialRemarkList();
        this.$forceUpdate();
      }
    },
    submitCheck() {
     console.log(this.editRemarkData);
      for (var i = 0; i < this.editRemarkData.length; i++) {
        let item = this.editRemarkData[i];
        if (!item.materialCode) {
          this.$message({
            message: "物料编号/系列不能为空!",
            type: "error"
          });
          return false;
        } else if (!item.remark) {
          this.$message({
            message: "物料备注不能为空",
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

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.popularGoods {
  padding-bottom: 80px !important;
}
// button.el-button.el-button--danger.is-circle {
//   padding: 7px;
// }
</style>
<style>
</style>