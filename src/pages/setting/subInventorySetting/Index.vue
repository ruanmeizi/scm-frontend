<template>
  <div class="container settinglocation">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">仓位名称：</span>
          <el-select class="select_single w200 mr10"
            v-model="addData.virtualInventoryName"
            @change="changeseach"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in inventoryList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
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
    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap" v-model="activeName" v-loading="tableLoading"  @tab-click="switchTabHandle">
        <!-- <el-tab-pane label="" name="All">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldNameList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in subInventoryList"
              :key="index">
              <li class="w9p" :title="item.virtualInventoryId">{{item.virtualInventoryId}}</li>
              <li class="w12p" :title="item.virtualInventoryName">{{item.virtualInventoryName}}</li>
              <li class="w9p" :title="item.subInventory">{{item.subInventory}}</li>
              <li class="w12p" :title="item.subInventoryName">{{item.subInventoryName}}</li>
              <li class="w10p fr">
                <i type="primary" class="el-icon-edit" title="修改" @click="editInventorysHandle(item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteInventorysHandle(index, item)"></i>
              </li>
            </ul>
          </div>
        </el-tab-pane> -->
        <singleTable
          :tableList='subInventoryList'         
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteInventorysHandle'
          @editHandle='editInventorysHandle'
          :tableHeight="scrollerHeight"
          >
        </singleTable>
      </el-tabs>
      
      <!-- <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="this.total">
        </el-pagination>
			</div> -->
    </div>

    <!-- 编辑弹窗 -->
    <div class="add_popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <p class="add_goods_btn">编辑库位信息</p>
          <div class="add_goods_warp">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in addInventorysFieldList" :key="index"><span class="red mr5" v-if="item.isRules">*</span>{{item.name}}</li>
            </ul>
            <div class="allparentlist">
              <ul class="childcontentlist">
                <li class="w25p t_center">
                  <el-select class="select_single w200 mr10"
                    size="small"
                    v-model="addSubInventoryData.virtualInventoryName"
                    @change="changeInventoryName"
                    placeholder="">
                    <el-option
                      v-for="item in inventoryList"
                      :key="item.index"
                      :label="item.name"
                      :value="item.index">
                    </el-option>
                  </el-select>
                </li>
                <li class="w25p t_center">
                  <el-input
                    class="w200"
                    size="small"
                    maxlength="16"
                    v-model="addSubInventoryData.subInventory"
                    @input="inventoryCodeChange"
                    placeholder="单行输入">
                  </el-input>
                </li>
                <li class="w25p t_center">
                  <el-input
                    class="w200"
                    size="small"
                    maxlength="16"
                    v-model="addSubInventoryData.subInventoryName"
                    @input="inventoryNameChange"
                    placeholder="单行输入">
                  </el-input>
                </li>
              </ul>
              <el-checkbox v-model="addSubInventoryData.wmsLogic">WMS虚拟库</el-checkbox>
            </div>
          </div>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-preventReClick @click="submitInventoryHandle(submitType)">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="deleteDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDeleteHandle" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { virtualInventorysList, deleteVirtualInventorys, searchVirtualInventorys, addVirtualInventorys, editVirtualInventorys, businessType, inventoryTypeList } from "@/api/module/settingApi.js";
import { getUUID } from '@/api/publicApi.js';
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "settinglocation",
  props: ['subName'],
  data() {
    return {
      btVal: '',
      materialsCode: '',
      requestCode: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      uuid: '',
      subInventoryList: [],
      subInventoryData: [],
      addSubInventoryList: [],
      addSubInventoryData: {
        wmsLogic:false
      },
      addData:{
        virtualInventoryName:''
      },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: 'All',
      isShowDraftAll: true,
      checkPopupTitle: '',
      popupTitle: '',
      dialogFormVisible: false,
      tableLoading: true,
      businessTypeList: [],
      inventoryList: [],
      inventoryId: '',
      submitType: '',
      deleteId: '',
      deleteDialogVisible: false,
      changewmsLogic:false,
      allFieldNameList: [
        {
          name: '仓位编码',
          class: 'w9p'
        },
        {
          name: '仓位名称',
          class: 'w12p'
        },
        {
          name: '库位编码',
          class: 'w9p'
        },
        {
          name: '库位名称',
          class: 'w12p'
        }
      ],
      addInventorysFieldList: [
        {
          name: '仓位名称',
          class: 'w25p',
          isRules: true
        },
        {
          name: '库位编码',
          class: 'w25p',
          isRules: true
        },
        {
          name: '库位名称',
          class: 'w25p',
          isRules: true
        }
      ],
      dialogdelVisible: false,
      purchaseobj: {
        uuid: "",
        purchaseType: "",
        submitType: "",
        pricList: []
      },
      num: 1,
      orderStatus: "",
      searchResult:"",
      orderCode:"",
      leaderFieldsList: [],
      fieldsList:[
         {
          name: '仓位编码',
          field: 'virtualInventoryId',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'仓位名称',
          field:'virtualInventoryName',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'库位编码',
          field:'subInventory',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'库位名称',
          field:'subInventoryName',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'WMS虚拟库',
          field:'wmsLogicName',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          minWidth: '10%',
          isAction: true,
          hasEdit: true,
          hasDelete: true
        }
      ]
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
    this.getVirtualInventorysList();
    this.getBusinessType();
    this.getInventoryList();
  },
  activated() {

  },
  watch: {

  },
  computed: {
    checkFieldNameList() {
      return this.allFieldNameList.filter(item => item.name != '折扣备注');
    },
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight -210) + 'px';
    }
  },
  methods: {
    searchHandle() {
      // 搜索
    },
    addHandle() {
      // 添加
      this.popupTitle = '库位管理';
      this.dialogFormVisible = true;
      this.submitType = 'add';
      this.addSubInventoryData.subInventory = '';
      this.addSubInventoryData.subInventoryName = '';
      this.addSubInventoryData.virtualInventoryId = '';
      this.addSubInventoryData.virtualInventoryName = '';
      this.addSubInventoryData.wmsLogic=false;
      getUUID().then(data => {
        if (data.code === '0') {
          this.addSubInventoryData.uuid = data.data;
        }
      });
    },
    switchTabHandle(tab) {

    },
    inventoryCodeChange() {
      this.$forceUpdate();
    },
    inventoryNameChange() {
      this.$forceUpdate();
    },
    changeBusinessType() {
      this.$forceUpdate();
    },
    changeInventoryName(val) {
      let data = this.inventoryList.find(item => {
        return item.index == val;
      });
      this.addSubInventoryData.virtualInventoryName = data.name;
      this.addSubInventoryData.virtualInventoryId = val;
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getVirtualInventorysList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getVirtualInventorysList();
    },
    editInventorysHandle(index,item) {
      // 编辑
      // console.log('修改项值：', item);
      this.popupTitle = '库位管理';
      this.dialogFormVisible = true;
      this.submitType = 'edit';
      searchVirtualInventorys(item.uuid).then(res => {
        this.subInventoryData = res.data;
      });
      if(item.wmsLogic==null){
        item.wmsLogic=false;
      }
      this.addSubInventoryData.uuid = item.uuid;
      this.addSubInventoryData.subInventory = item.subInventory;
      this.addSubInventoryData.subInventoryName = item.subInventoryName;
      this.addSubInventoryData.virtualInventoryId = item.virtualInventoryId;
      this.addSubInventoryData.virtualInventoryName = item.virtualInventoryName;
      this.addSubInventoryData.wmsLogic=item.wmsLogic;
    },
    deleteInventorysHandle(index, item) {
      // 删除订单
      // console.log('删除库位：', item);
      this.deleteId = item.uuid;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteVirtualInventorys(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getVirtualInventorysList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    submitInventoryHandle(type) {
      if (!this.addSubInventoryData.virtualInventoryName) {
        this.$message({
          type: 'error',
          message: '请填写仓位名称！'
        });
        return false;
      }
      if (!this.addSubInventoryData.subInventory) {
        this.$message({
          type: 'error',
          message: '请填写库位编码！'
        });
        return false;
      }
      if (!this.addSubInventoryData.subInventoryName) {
        this.$message({
          type: 'error',
          message: '请填写库位名称！'
        });
        return false;
      }
      switch (type) {
        case 'add':
          console.log(this.addSubInventoryData);
          // this.addSubInventoryData.virtualInventoryId = this.inventoryId;
          addVirtualInventorys(this.addSubInventoryData).then(res => {
            // console.log('新增虚拟库位：', res);
            if (res.code === '0') {
              this.dialogFormVisible = false;
              this.getVirtualInventorysList();
              this.$message({
                message: '提交成功！',
                type: 'success'
              });
              
            }
          });
          break;
        case 'edit':
          editVirtualInventorys(this.addSubInventoryData).then(res => {
            // console.log('修改虚拟库位：', res);
            if (res.code === '0') {
              this.dialogFormVisible = false;
              this.getVirtualInventorysList();
              this.$message({
                message: '提交成功！',
                type: 'success'
              });
            }
          });
          break;
      
        default:
          break;
      }
      
    },
    getVirtualInventorysList() {
    	this.tableLoading = true;
      // 库位列表
      let data = {
        virtualInventoryName: this.searchResult
      };
      virtualInventorysList(data).then(res => {
        console.log('库位列表：', res);
        if (res.code === '0') {
        	this.tableLoading = false;
          this.subInventoryList = res.data;
          this.subInventoryList.forEach(item => {
            item.wmsLogic ? item.wmsLogicName = '是' : item.wmsLogicName = '否';
          });
        }
      });
    },
    getBusinessType() {
      // 业务类型
      businessType().then(res => {
        // console.log('业务类型：', res);
        if (res.code === '0') {
          this.businessTypeList = res.data;
        }
      });
    },
    getInventoryList() {
      // 仓位
      inventoryTypeList().then(res => {
        // console.log('仓位列表数据：', res);
        if (res.code === '0') {
          this.inventoryList = res.data;
        }
      });
    },
    searchHandle() {
      // 搜索
      this.searchResult = this.orderCode;
      this.getVirtualInventorysList();
    },
    changeseach(val){
      let data = this.inventoryList.find(item => {
      return item.index == val;
      });
      val!=''?this.orderCode=data.name:this.orderCode=''
      this.searchResult = this.orderCode;
      this.getVirtualInventorysList();
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

.settinglocation {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  ul {
    &.childcontentlist {
      height: 60px;
      li {
        line-height: 40px;
      }
    }
  }
}
.add_popup_part {
  ul {
    &.childcontentlist {
      height: 60px;
      border-bottom:none;
    }
  }
  .add_goods_btn {
    padding: 0 20px;
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .empty_wrap {
    text-align: center;
    margin-top: 15px;
    color: #909399;
    .empty_img {
      width: 200px;
      height: 100px;
    }
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



li.el-select-dropdown__item.hover {
  width: 100%;
}

ul.parentlist {
  li {
    i.el-icon-caret-bottom,
    i.el-icon-caret-top {
      font-size: 20px;
    }
    i.el-icon-edit,
    i.el-icon-delete,
    i.el-icon-thumb,
    i.el-icon-view {
      font-size: 20px;
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
i.el-icon-circle-plus {
  font-size: 30px;
  color: #409eff;
  cursor: pointer;
}
i.el-icon-remove {
  font-size: 28px;
  color: red;
  cursor: pointer;
}

ul.childcontentlist {
  li {
    i.el-icon-edit,
    i.el-icon-delete {
      font-size: 20px;
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}

.addcontent {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 15px;
}
.addcontent_content ul {
  height: 40px;
  background: #cecece;
  margin-top: 10px;
  border-radius: 4px;
  li {
    padding: 10px 10px;
    font-size: 14px;
    color: #606266;
  }
}
form.el-form.demo-form-inline {
  display: flex;
}
form.el-form.demo-form-inline .el-form-item {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 0px;
}
button.el-button.el-button--danger.is-circle {
  padding: 3px;
  margin-top: 10px;
}
.formtable {
  ul.demo-form-inline {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 10px;
    li {
      width: auto;
      padding: 0 10px;
      font-size: 14px;
      color: #606266;
      .el-input-number--mini {
        width: 80px;
        height: 40px;
      }

      .el-input-number.is-controls-right .el-input__inner {
        padding-right: 0;
        height: 40px;
      }
      span {
        margin-left: 5px;
        margin-right: 10px;
      }
      select {
        width: 145px;
      }
      .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
        width: 150px;
      }
      .el-select {
        width: 145px;
      }
    }
    li:first-child {
      padding: 0px 0;
    }
    li:nth-child(3),
    li:nth-child(4) {
      padding: 0px 0;
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}
select.selectstatus {
  width: 200px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  cursor: pointer;
  font-size: 14px;
}

select.selectstatus > option {
  cursor: pointer;
  font-size: 14px;
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
.add_popup_part .el-dialog__body {
  padding-top: 0;
}
</style>