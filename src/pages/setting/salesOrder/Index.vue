<template>
  <div class="container salesOrder">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">业务类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="addData.entityType"
            @change="entityType"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in this.businessTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">订单类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="addData.orderType"
            @change="orderType"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in this.saleorderTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">仓位名称：</span>
          <el-select class="select_single w200 mr10"
            v-model="addData.storehouseName"
            @change="inventoryName"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in this.inventoryList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">库位名称：</span>
          <el-select class="select_single w200 mr10"
            v-model="addData.warehouseName"
            @change="warehouseName"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in this.subinventoryList"
              :key="item.subInventoryName"
              :label="item.subInventoryName"
              :value="item.subInventoryName">
            </el-option>
          </el-select>
        </div>
      </div>

      <!-- <el-select v-model="addData.entityType" placeholder="请选择业务类型" @change="entityType">
        <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in this.businessTypeList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
      </el-select> -->
      <!-- <el-select v-model="addData.orderType" placeholder="请选择订单类型" @change="orderType">
        <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in this.saleorderTypeList"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
      </el-select> -->
      <!-- <el-select v-model="addData.storehouseName" placeholder="请选择仓位名称" @change="inventoryName">
        <el-option key="" label="全部" value=""></el-option>
          <el-option
            v-for="item in this.inventoryList"
            :key="item.index"
            :label="item.name"
            :value="item.index">
          </el-option>
      </el-select> -->
      <!-- <el-select v-model="addData.warehouseName" placeholder="请选择库位名称" @change="warehouseName">
          <el-option
            v-for="item in this.subinventoryList"
            :key="item.subInventoryName"
            :label="item.subInventoryName"
            :value="item.subInventoryName">
          </el-option>
      </el-select> -->
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
            <li
              :class="item.class"
              v-for="(item, index) in allFieldNameList"
              :key="index"
            >{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul class="childcontentlist" v-for="(item, index) in orderSearchList" :key="index">
              <li class="w9p" :title="item.entityType">{{item.entityType}}</li>
              <li class="w12p" :title="item.orderType">{{item.orderType}}</li>
              <li class="w9p" :title="item.storehouseCode">{{item.storehouseCode}}</li>
              <li class="w12p" :title="item.storehouseName">{{item.storehouseName}}</li>
              <li class="w9p" :title="item.warehouseCode">{{item.warehouseCode}}</li>
              <li class="w12p" :title="item.warehouseName">{{item.warehouseName}}</li>
              <li class="w10p fr">
                <i
                  type="primary"
                  class="el-icon-edit"
                  title="修改"
                  @click="editInventorysHandle(item)"
                ></i>
                <i
                  type="primary"
                  class="el-icon-delete"
                  title="删除"
                  @click="deleteInventorysHandle(index, item)"
                ></i>
              </li>
            </ul>
          </div>
        </el-tab-pane> -->
        <singleTable
          :tableList='orderSearchList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteInventorysHandle'
          @editHandle='editInventorysHandle'
        ></singleTable>
      </el-tabs>
      <!-- <p v-if="this.orderSearchList.length==0" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 添加弹框 -->
    <div class="add_popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
      >
        <el-tabs>
          <p class="add_goods_btn">编辑信息</p>
          <div class="add_goods_warp">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in addInventorysFieldList" :key="index">
                <span class="red mr5" v-if="item.isRules">*</span>
                {{item.name}}
              </li>
            </ul>
            <div class="allparentlist">
              <ul class="childcontentlist">
                <li class="w25p t_center">
                  <el-select
                    class="select_single w200 mr10"
                    size="small"
                    v-model="addSubInventoryData.entityType"
                    @change="changeEntityType"
                    placeholder
                  >
                    <el-option
                      v-for="item in businessTypeList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </li>
                <li class="w25p t_center">
                  <el-select
                    class="select_single w200 mr10"
                    size="small"
                    v-model="addSubInventoryData.orderType"
                    @change="changeOrderType"
                    placeholder
                  >
                    <el-option
                      v-for="item in saleorderTypeList"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </li>
                <li class="w25p t_center">
                  <el-select
                    class="select_single w200 mr10"
                    size="small"
                    v-model="addSubInventoryData.storehouseName"
                    @change="changeInventoryName"
                    placeholder
                  >
                    <el-option
                      v-for="item in inventoryList"
                      :key="item.index"
                      :label="item.name"
                      :value="item.index"
                    ></el-option>
                  </el-select>
                </li>
                <li class="w25p t_center">
                  <el-select
                    class="select_single w200 mr10"
                    size="small"
                    v-model="addSubInventoryData.warehouseName"
                    @change="changeWarehouseName"
                    placeholder
                  >
                    <el-option
                      v-for="item in subinventoryList"
                      :key="item.subInventoryName"
                      :label="item.subInventoryName"
                      :value="item.subInventoryName"
                    ></el-option>
                  </el-select>
                </li>
              </ul>
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
        <el-button type="primary" v-preventReClick @click="confirmDeleteHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { purchasegetuuid } from "@/api/module/purchaseApi.js";
import { orderSearch, inventoryTypeLists, addOrUpdate ,deleteOrder,businessTypes,saleorderType,subinventoryquesttype} from "@/api/module/settingApi.js";
export default {
  name: "salesOrder",
  data() {
    return {
      allFieldNameList: [
        {
          name: "业务类型",
          class: "w9p"
        },
        {
          name: "订单类型",
          class: "w12p"
        },
        {
          name: "仓位编号",
          class: "w9p"
        },
        {
          name: "仓位名称",
          class: "w12p"
        },
        {
          name: "库位编号",
          class: "w9p"
        },
        {
          name: "库位名称",
          class: "w12p"
        }
      ],
      addInventorysFieldList: [
        {
          name: "业务类型",
          class: "w25p",
          isRules: true
        },
        {
          name: "订单类型",
          class: "w25p",
          isRules: true
        },
        {
          name: "仓位名称",
          class: "w25p",
          isRules: true
        },
        {
          name: "库位名称",
          class: "w25p",
          isRules: true
        }
      ],
      activeName: "All",
      orderSearchList: [],
      popupTitle: "",
      dialogFormVisible: false,
      addSubInventoryData: {},
      inventoryList: [],
      deleteDialogVisible:false,
      tableLoading: true,
      businessTypeList: [],
      saleorderTypeList:[],
      subinventoryList:[],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      season:'',
      addData:{
        entityType:'',
        storehouseName:'',
        orderType:'',
        warehouseName:''
      },
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name:'序号',
          field:'idIndex',
          class:'w50p',
          minWidth:'20%'
        },
         {
          name: '业务类型',
          field: 'entityType',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'订单类型',
          field:'orderType',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'仓位编号',
          field:'storehouseCode',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'仓位名称',
          field:'storehouseName',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'库位编号',
          field:'warehouseCode',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
        {
          name:'库位名称',
          field:'warehouseName',
          class: 'w50p',
          // width: '150',
          minWidth: '20%'
        },
      ],
      tailFieldsList:[
        {
          name: '',
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
  mounted() {
    this.getOrderSearch();
    this.getInventoryList();
    this.getBusinessType();
    this.getSaleorderType();
  },
  components: {
    singleTable
  },
  methods: {
    getOrderSearch() {
    	this.tableLoading = true;
      let data=this.addData;
      orderSearch(this.currentPage, this.pageSize,data).then(res => {
        if (res.code == "0") {
        	this.tableLoading = false;
          this.orderSearchList = res.data.records;
          this.total=res.data.total;
          // if(this.orderSearchList.length==0 && this.total!=0){
          //   this.currentPage--
          //   this.getOrderSearch()
          // }
          for(var i=0;i<this.orderSearchList.length;i++){
            let item=this.orderSearchList[i];
            if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
            }else{
              item.idIndex=i+1;
            }
          }

        }
      });
    },
    getInventoryList() {
      // 仓位
      inventoryTypeLists().then(res => {
        console.log('仓位列表数据：', res);
        if (res.code === "0") {
          this.inventoryList = res.data;
        }
      });
    },
    //添加
    addHandle() {
      this.popupTitle = "销售订单管理";
      this.dialogFormVisible = true;
      this.addSubInventoryData.entityType = "";
      this.addSubInventoryData.orderType = "";
      this.addSubInventoryData.storehouseName = "";
      this.addSubInventoryData.warehouseName = "";
      purchasegetuuid().then(data => {
        if (data.code == '0') {
          this.addSubInventoryData.uuid = data.data;
        }
      });
    },
    editInventorysHandle(index,item) {
        console.log(item);
      this.popupTitle = '销售订单管理';
      this.dialogFormVisible = true;
    //   searchVirtualInventorys(item.uuid).then(res => {
    //     this.subInventoryData = res.data;
    //   });
      this.addSubInventoryData.uuid = item.uuid;
      this.addSubInventoryData.entityType = item.entityType;
      this.addSubInventoryData.orderType = item.orderType;
      this.addSubInventoryData.storehouseName = item.storehouseName;
      this.addSubInventoryData.warehouseName = item.warehouseName;
      this.addSubInventoryData.storehouseCode=item.storehouseCode;
      this.addSubInventoryData.warehouseCode=item.warehouseCode;
      this.addSubInventoryData.entityTypeCode=item.entityTypeCode;
      this.addSubInventoryData.orderTypeCode=item.orderTypeCode;
    },
    //提交
    submitInventoryHandle(type) {
      if (!this.addSubInventoryData.entityType) {
          this.$message({
          type: "error",
          message: "请填写业务类型！"
          });
          return false;
      }
      if (!this.addSubInventoryData.orderType) {
          this.$message({
          type: "error",
          message: "请填写订单类型！"
          });
          return false;
      }
      if (!this.addSubInventoryData.storehouseName) {
          this.$message({
          type: "error",
          message: "请填写仓位名称！"
          });
          return false;
      }
      if (!this.addSubInventoryData.warehouseName) {
          this.$message({
          type: "error",
          message: "请填写库位名称！"
          });
          return false;
      }
      console.log(this.addSubInventoryData)
      addOrUpdate(this.addSubInventoryData).then(res => {
        //console.log(res);
        if (res.code === "0") {
          this.dialogFormVisible = false;
          this.addData={
            warehouseName:'',
            entityType:'',
            storehouseName:'',
            orderType:''
          }
          this.getOrderSearch();
          this.$message({
            message: "提交成功！",
            type: "success"
          });
        }
      });
    },
    deleteInventorysHandle(index,item){
        console.log(item);
        this.deleteId = item.id;
        this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteOrder(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getOrderSearch();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    getBusinessType() {
      // 业务类型
      businessTypes().then(res => {
        if (res.code === '0') {
          this.businessTypeList = res.data;
        }
      });
    },
    getSaleorderType(){
      saleorderType().then(res => {
        if (res.code === '0') {
          this.saleorderTypeList = res.data;
          console.log(res.data);
        }
      });
    },
    changeEntityType(val){
      let data = this.businessTypeList.find(item => {
        return item.name == val;
      });
      this.addSubInventoryData.entityType=data.name;
      this.addSubInventoryData.entityTypeCode=data.index;
      this.$forceUpdate();
    },
    changeInventoryName(val) {
      console.log(val);
      let _this=this;
      let data = this.inventoryList.find(item => {
        return item.index == val;
      });
      this.addSubInventoryData.storehouseName = data.name;
      this.addSubInventoryData.storehouseCode = data.index;
      this.addSubInventoryData.warehouseName='';
      subinventoryquesttype(val).then(response => {
        if (response.code === "0") {
          this.subinventoryList = response.data;
          this.$forceUpdate();
        }
      });
      this.$forceUpdate();
    },
    changeOrderType(val){
      console.log(val)
      let data = this.saleorderTypeList.find(item => {
        return item.name == val;
      });
      this.addSubInventoryData.orderType=data.name;
      this.addSubInventoryData.orderTypeCode=data.index;
      this.$forceUpdate();
    },
    changeWarehouseName(val){
      let data = this.subinventoryList.find(item => {
        return item.subInventoryName == val;
      });
      this.addSubInventoryData.warehouseName=data.subInventoryName;
      this.addSubInventoryData.warehouseCode=data.subInventory;
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      // console.log(val)
      this.pageSize = val;
      this.getOrderSearch()
    },
    handleCurrentChange(val) {
      //  console.log(val)
      this.currentPage = val;
      this.getOrderSearch();
    },
    entityType(val){
       this.addData.entityType=val;
       this.getOrderSearch();
    },
    orderType(val){
      this.addData.orderType=val;
      this.getOrderSearch();
    },
    inventoryName(val){
      if(this.addData.storehouseName==''){
        this.addData.warehouseName='';
        this.subinventoryList=[];
        this.searchHandle();
      }else{
        let data = this.inventoryList.find(item => {
          return item.index == val;
        });
        val==''?this.addData.storehouseName = '':this.addData.storehouseName = data.name;
        this.addData.warehouseName=''
        subinventoryquesttype(val).then(response => {
          if (response.code === "0") {
            this.subinventoryList = response.data;
            this.$forceUpdate();
          }
        });
      }
      
    },
    warehouseName(val){
      this.addData.warehouseName=val;
      console.log(this.addData);
      this.getOrderSearch();
    },
    searchHandle(){
      console.log(this.addData);
      this.getOrderSearch()
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
.salesOrder {
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
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.pagination_wrap {
  margin-top: 20px;
}
</style>