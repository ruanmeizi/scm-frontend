<template>
  <div class="container finishedproduction">
    <div class="actions_part clearfix">
      <el-input class="input_single w200 mr10" v-model="orderCode" placeholder="采购订单编号"></el-input>
      <div class="down fr">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          circle
          title="搜索"
          @click="searchHandle"
        ></el-button>
        <el-button
          size="medium"
          type="primary"
          icon="el-icon-upload"
          circle
          title="上传"
          @click="uploadHandle"
        ></el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-download"
          circle
          title="下载"
          @click="downloadHandle"
        ></el-button>
      </div>
    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
        <el-tab-pane label="全部成品生产订单" name="All">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-for="(item,index) in orderList" :key="index">
            <ul class="parentlist" @click="showChildList(index, item)">
              <li>
                <span>{{item.createTime}}</span>
              </li>
              <li>
                <i>
                  订单编号:
                  <em>{{item.purchaseOrderId}}</em>
                </i>
              </li>
              <li>
                <i>
                  请求状态:
                  <em>{{item.orderStatus}}</em>
                </i>
              </li>
              <li style="float: right; margin-right: 15px;" @click.stop="showChildList(index, item)">
                <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </li>
            </ul>
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in item.poiList"
              :key="index"
              v-show="item.isShowList">
              <li class="w10p">原材料物料编号</li>
              <li class="w10p">成品物料号</li>
              <li class="w10p">供应商名称</li>
              <li class="w10p">成品采购价格</li>
              <li class="w12p">成品数量</li>
              <!-- <li class="w12p">{{childItem.offered_packages + '包 '}}{{childItem.offered_quantity_per_package + '米/包 '}}{{childItem.offeredQuantity + '米'}}</li> -->
              <li class="w8p">原材料消耗数量</li>
              <li class="w10p">工厂交期</li>
              <li class="w10p">原材料确认书号</li>
              <li class="w10p">原材料投产日期</li>
              <li class="w10p">原材料价格</li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="草稿" name="Draft">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-for="(item,index) in orderList" :key="index">
            <ul class="parentlist">
              <li>
                <span>{{item.createTime}}</span>
              </li>
              <li>
                <i>
                  订单编号:
                  <em>{{item.purchaseOrderId}}</em>
                </i>
              </li>
              <li>
                <i>
                  请求状态:
                  <em>{{item.orderStatus}}</em>
                </i>
              </li>
              <li style="float: right; margin-right: 15px;" @click="showChildList(index, item)">
                <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </li>
              <li class="fr">
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteOrderHandle(index, item)"></i>
                <i type="primary" class="el-icon-edit" title="修改" @click="editOrderHandle(index, item)"></i>
                <i type="primary" class="el-icon-view" title="查看" @click="checkOrderHandle(index, item)"></i>
              </li>
            </ul>
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in item.poiList"
              :key="index"
              v-show="item.isShowList">
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.factorySeason}}</li>
              <li class="w10p">{{childItem.supplierName}}</li>
              <li class="w10p">{{childItem.offeredPrice}}</li>
              <li class="w12p">{{childItem.offered_packages + '包 '}}{{childItem.offered_quantity_per_package + '米/包 '}}{{childItem.offeredQuantity + '米'}}</li>
              <li class="w8p">{{childItem.offeredDate}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.remarks}}</li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="审批中" name="Approving">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-for="(item,index) in orderList" :key="index">
            <ul class="parentlist">
              <li>
                <span>{{item.createTime}}</span>
              </li>
              <li>
                <i>
                  订单编号:
                  <em>{{item.purchaseOrderId}}</em>
                </i>
              </li>
              <li>
                <i>
                  请求状态:
                  <em>{{item.orderStatus}}</em>
                </i>
              </li>
              <li style="float: right; margin-right: 15px;" @click="showChildList(index, item)">
                <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </li>
              <li class="fr">
                <i type="primary" class="el-icon-view" title="查看" @click="checkOrderHandle(index, item)"></i>
              </li>
            </ul>
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in item.poiList"
              :key="index"
              v-show="item.isShowList">
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.factorySeason}}</li>
              <li class="w10p">{{childItem.supplierName}}</li>
              <li class="w10p">{{childItem.offeredPrice}}</li>
              <li class="w12p">{{childItem.offered_packages + '包 '}}{{childItem.offered_quantity_per_package + '米/包 '}}{{childItem.offeredQuantity + '米'}}</li>
              <li class="w8p">{{childItem.offeredDate}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.remarks}}</li>
            </ul>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已审批" name="Official">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in allFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-for="(item,index) in orderList" :key="index">
            <ul class="parentlist">
              <li>
                <span>{{item.createTime}}</span>
              </li>
              <li>
                <i>
                  订单编号:
                  <em>{{item.purchaseOrderId}}</em>
                </i>
              </li>
              <li>
                <i>
                  请求状态:
                  <em>{{item.orderStatus}}</em>
                </i>
              </li>
              <li style="float: right; margin-right: 15px;" @click="showChildList(index, item)">
                <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </li>
              <li class="fr">
                <i type="primary" class="el-icon-view" title="查看" @click="checkOrderHandle(index, item)"></i>
              </li>
            </ul>
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in item.poiList"
              :key="index"
              v-show="item.isShowList">
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.factorySeason}}</li>
              <li class="w10p">{{childItem.supplierName}}</li>
              <li class="w10p">{{childItem.offeredPrice}}</li>
              <li class="w12p">{{childItem.offered_packages + '包 '}}{{childItem.offered_quantity_per_package + '米/包 '}}{{childItem.offeredQuantity + '米'}}</li>
              <li class="w8p">{{childItem.offeredDate}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.materialCode}}</li>
              <li class="w10p">{{childItem.remarks}}</li>
            </ul>
          </div>
        </el-tab-pane>

      </el-tabs>
      
      <p v-if="this.orderList==''" class="empty_tip">暂无数据</p>
      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="this.total">
        </el-pagination>
			</div>
    </div>

    <!-- 子项详情弹窗 -->
    <div class="check_popup_part">
      
    </div>
    
  </div>
</template>

<script>
import { produceRequestList } from "@/api/module/produceApi.js";
import { timeFormat, timeFormatGMT } from '@/utils/index.js';
export default {
  name: "finishedproduction",
  props: ['subName'],
  data() {
    return {
      type: '',
      orderCode: '',
      requestCode: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      uuid: '',
      orderList: [],
      editOrderData: {},
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: 'All',
      checkPopupTitle: '',
      checkDialogFormVisible: false,
      checkList: [],
      modifyOrderList: [],

      allFieldList: [
        {
          name: '原材料物料编号',
          class: 'w10p'
        },
        {
          name: '成品物料号',
          class: 'w10p'
        },
        {
          name: '供应商名称',
          class: 'w10p'
        },
        {
          name: '成品采购价格',
          class: 'w10p'
        },
        {
          name: '成品数量',
          class: 'w12p'
        },
        {
          name: '原材料消耗数量',
          class: 'w8p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '原材料确认书号',
          class: 'w10p'
        },
        {
          name: '原材料投产日期',
          class: 'w10p'
        },
        {
          name: '原材料价格',
          class: 'w10p'
        }
      ],

      isShowList: false,
      dialogdelVisible: false,
      purchaseobj: {
        uuid: "",
        purchaseType: "",
        submitType: "",
        pricList: []
      },
      num: 1

    };
  },
  components: {},
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getProduceList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: {
    searchHandle() {
      // 搜索
      this.currentPage = 1;
    },
    uploadHandle() {
      // 上传
    },
    downloadHandle() {
      // 下载
    },
    switchTabHandle(tab) {
      // console.log(tab.name);
      switch (tab.name) {
        case 'All':
          break;
        case 'Draft':

          break;
        case 'Approving':

          break;
        case 'Official':

          break;
        default:

          break;
      }

    },
    handleSizeChange(val) {
      this.pageSize = val;

    },
    handleCurrentChange(val) {
      this.currentPage = val;

    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    deleteOrderHandle(index, item) {
      // 草稿 删除订单
    },
    editOrderHandle(index, item) {
      // 草稿 编辑订单
    },
    checkOrderHandle(index, item) {
      // 草稿 查看订单详情
    },
    getPurchaseOrderList() {
      // 采购请求列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        customerId: this.customerId,
        orderStatus: this.orderStatus,
        purchaseOrderId: this.purchaseOrderId,
        uuid: this.uuid,
        sort: 'desc'
      };
      purchaseOrderList(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code == '0') {
          this.orderList = res.data.records;
          this.total = res.data.total;
          this.orderList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }
          });
        }
      });
    },
    async getSearchOrderList(id) {
      await searchPurchaseOrderList(id).then(res => {
        console.log('当前操作订单：', res);
        if (res.code == '0') {
          res.data.isShowList = true;
          res.data.createTime = timeFormat(res.data.createTime);
          this.editOrderData = res.data;
          this.editOrderData.poiList.forEach(item => {
            console.log('工厂交期数据：', item.offeredDate);
            if (item.offeredDate) {
              item.offeredDate = timeFormatGMT(item.offeredDate);
            } else {
              item.offeredDate = '';
            }
          });
        }
      });
    },

    // getProduceList() {
    //   // 成品生产订单列表
    //   let data = {
    //     uuid: this.uuid,
    //     ppUuid: this.ppUuid,
    //     sn: this.sn,
    //     sourceMaterialCode: this.sourceMaterialCode,
    //     sourceMaterialName: this.sourceMaterialName,
    //     productMaterialCode: this.productMaterialCode,
    //     productMaterialName: this.productMaterialName,
    //     supplierCode: this.supplierCode,
    //     supplierName: this.supplierName,
    //     sourceQuantity: this.sourceQuantity,
    //     ppItemDeleteStatus: this.ppItemDeleteStatus,
    //     rev: this.rev,
    //     productMaterialCode: this.productMaterialCode,
    //     productMaterialName: this.productMaterialName
    //   };
    //   produceRequestList(this.currentPage, this.pageSize, data).then(res => {
    //     console.log('成品生产列表：', res);
    //   });
    // }



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

.finishedproduction {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
    &.childcontentlist {
      height: 60px;
    }
  }
  .submit_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
}
.edit_parent_list {
  ul {
    &.childcontentlist {
      height: 120px;
    }
  }
  .edit_btn_wrap{
    margin-top: 20px;
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

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.subnav_wrap .el-checkbox {
  white-space: nowrap;
}




</style>
<style>
.finishedproduction .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.finishedproduction .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.finishedproduction .subnav_wrap .el-tabs__content {
  overflow: visible;
}
.finishedproduction .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.finishedproduction .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.finishedproduction .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
</style>