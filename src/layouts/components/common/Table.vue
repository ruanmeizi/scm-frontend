<template>
  <div class="tableList" v-loading="loading">
    <div>
      <ul class="childlist parent_header_wrap">
        <li :class="item.class" v-for="(item, index) in parentFieldsList" :key="index">{{item.name}}</li>
        <!-- <li class="fr">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            @click="addHandle"
          ></el-button>
        </li> -->
      </ul>
      <div class="allparentlist" v-for="(item, index) in list" :key="index">
        <ul class="parentlist" ref="parentList" @click.stop="showChildList(index, item)">
          <li :class="pItem.isFilterField && item['hide_' + pItem.field] ? pItem.class : pItem.class + ' t_center'" :title="pItem.isShowTit ? (pItem.name ? (pItem.name + '：' + (item[pItem.field] ? item[pItem.field] : '')) : item[pItem.field]) : ''" v-for="(pItem, i) in parents.data" :key="i">
          <!-- <li :class="pItem.isFilterField && item['hide_' + pItem.field] ? 'p0 w0' : pItem.class + ' t_left'" :title="pItem.isShowTit ? (pItem.name ? (pItem.name + '：' + (item[pItem.field] ? item[pItem.field] : '')) : item[pItem.field]) : ''" v-for="(pItem, i) in parents.data" :key="i"> -->
          <!-- <li :class="pItem.isFilterField && item.isHideFew || (item.lAllocationTypeName == '客订' && pItem.field == 'deliveryTypeName') || (item.tAllocationTypeName == '工厂调拨' && pItem.field == 'saleOrderId') || (item.tAllocationTypeName == '工厂调拨' && pItem.field == 'customerName') ? 'p0' : pItem.class + ' t_left'" :title="pItem.isShowTit ? (pItem.name ? (pItem.name + '：' + (item[pItem.field] ? item[pItem.field] : '')) : item[pItem.field]) : ''" v-for="(pItem, i) in parents.data" :key="i"> -->
            <!-- 审批 -->
            <div class="inline" v-if="pItem.isPopover">
              <el-popover
                placement="right"
                width="300"
                trigger="hover"
                @show="checkApprovalProcess(item)">
                <div>
                  <i class="block">
                    审批人：
                    <em>{{item.fullName}}</em>
                  </i>
                  <i class="block mt10 mb10">
                    审批时间：
                    <em>{{item.approvalTime}}</em>
                  </i>
                  <i class="block">
                    审批意见：
                    <em>{{item.content}}</em>
                  </i>
                </div>
                <button slot="reference" class="btn_popover">审批：{{actionsTypeHandle(item.status)}}</button>
              </el-popover>
            </div>
            <div v-else-if="pItem.isPane" class="">审批状态：<span>{{approveTypeHandle(item.auditStatus)}}</span></div>
            <div class="inline" v-else-if="pItem.isUpDown">
              <i v-if="item.isShowList" class="el-icon-caret-top"></i>
              <i v-else class="el-icon-caret-bottom"></i>
            </div>

            <div class="inline" v-else-if="pItem.isAction && item.actions">
              <i v-if="item.actions.hasEdit" type="primary" class="el-icon-edit" title="编辑" @click.stop="editHandle(index, item)"></i>
              <i v-if="item.actions.hasAdd" type="primary" class="el-icon-circle-plus-outline" title="添加" @click.stop="addHandle(index, item)"></i>
              <i v-if="item.actions.hasSubmit" type="primary" class="el-icon-thumb" title="提交审批" @click.stop="submitHandle(index, item)"></i>
              <i v-if="item.actions.hasRemove" type="primary" class="el-icon-close" title="整单解除" @click.stop="removeHandle(index, item)"></i>
              <i v-if="item.actions.hasDelete" type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandle(index, item)"></i>
              <i v-if="item.actions.hasCheck" type="primary" class="el-icon-document" title="查看" @click.stop="checkHandle(index, item)"></i>
              <i v-if="item.actions.hasRevoke" type="primary" class="el-icon-document-delete" title="撤销" @click.stop="revokeHandle(index, item)"></i>
              <img v-if="item.actions.hasPayment && item.payStatus == '未发起'" class="img_pay" src="../../../assets/image/icon_pay.png" title="发起付款" alt="付款" @click.stop="payHandle(index, item)">
            </div>

            <!-- 过滤字段 -->
            <div class="inline" v-else-if="pItem.isFilterField && item.isHideFew"></div>
            <!-- 过滤字段 end -->

            <!-- 调拨 -->
            <!-- <div class="inline" v-else-if="pItem.isFilterField && item.lAllocationTypeName == '客订' && pItem.field == 'deliveryTypeName'"></div>
            <div class="inline" v-else-if="pItem.isFilterField && item.tAllocationTypeName == '工厂调拨' && pItem.field == 'saleOrderId'"></div>
            <div class="inline" v-else-if="pItem.isFilterField && item.tAllocationTypeName == '工厂调拨' && pItem.field == 'customerName'"></div> -->
            <!-- 调拨 end -->

            <div class="inline" v-else>
              <span v-if="!pItem.name">{{item[pItem.field]}}</span>
              <i v-else>
                <!-- {{pItem.name}}： -->
                <em>{{item[pItem.field]}}</em>
              </i>
            </div>
            
          </li>

        </ul>

        <ul class="childlist" v-show="item.isShowList">
          <li :class="item.class" v-for="(item, index) in fieldsList" :key="index">{{item.name}}</li>
        </ul>

        <!-- 双层子列表 -->
        <div v-if="children.type == 'double'">
          <div
            class="list_group"
            v-for="(childItem, childIndex) in item[children.name]"
            :key="childIndex"
            v-show="item.isShowList">
            <ul
              class="childcontentlist"
              v-for="(gChildItem, gChildIndex) in childItem[children.childName]"
              :key="gChildIndex">
              <li :class="cItem.class" v-for="(cItem, i) in children.data" :key="i">
                <div v-if="cItem.isChildField" class="inline" :title="childItem[cItem.field]">
                  <div v-if="gChildIndex === 0" class="inline">
                    <div v-if="cItem.isAction">
                      <i v-if="childItem.actions && childItem.actions.hasAdd" type="primary" class="el-icon-circle-plus-outline" title="添加" @click.stop="addItemHandle(childIndex,childItem,item)"></i>
                    </div>
                    <!-- 数量值（计量单位） -->
                    <div v-else-if="cItem.isQuantityField" class="inline">
                      <span v-if="cItem.field_1 && childItem[cItem.field_unit] == '米'" :title="(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 ' + (childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 ' + (childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'">{{(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 '}}{{(childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 '}}{{(childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'}}</span>
                      <span v-else :title="(childItem[cItem.field] ? childItem[cItem.field] : '0') + childItem[cItem.field_unit]">{{(childItem[cItem.field] ? childItem[cItem.field] : '0') + childItem[cItem.field_unit]}}</span>
                    </div>
                    <span v-else-if="cItem.isTime">{{childItem[cItem.field_1]}}—{{childItem[cItem.field_2]}}</span>
                    <span v-else>{{childItem[cItem.field]}}</span>
                  </div>
                  <span v-else></span>
                </div>
                <div v-else class="inline" :title="gChildItem[cItem.field]">
                  <div v-if="cItem.isAction">
                    <i v-if="childItem.actions && childItem.actions.hasAdd" type="primary" class="el-icon-circle-plus-outline" title="添加" @click.stop="addItemHandle(childIndex, childItem,item)"></i>
                  </div>
                  <!-- 数量值（计量单位） -->
                  <div v-else-if="cItem.isQuantityField" class="inline">
                    <span v-if="cItem.field_1 && gChildItem[cItem.field_unit] == '米'" :title="(gChildItem[cItem.field_1] ? gChildItem[cItem.field_1] : '0') + '包 ' + (gChildItem[cItem.field_2] ? gChildItem[cItem.field_2] : '0') + '米/包 ' + (gChildItem[cItem.field_3] ? gChildItem[cItem.field_3] : '0') + '米'">{{(gChildItem[cItem.field_1] ? gChildItem[cItem.field_1] : '0') + '包 '}}{{(gChildItem[cItem.field_2] ? gChildItem[cItem.field_2] : '0') + '米/包 '}}{{(gChildItem[cItem.field_3] ? gChildItem[cItem.field_3] : '0') + '米'}}</span>
                    <span v-else :title="(gChildItem[cItem.field] ? gChildItem[cItem.field] : '0') + gChildItem[cItem.field_unit]">{{(gChildItem[cItem.field] ? gChildItem[cItem.field] : '0') + gChildItem[cItem.field_unit]}}</span>
                  </div>
                  <span v-else-if="cItem.isTime">{{gChildItem[cItem.field_1]}}—{{gChildItem[cItem.field_2]}}</span>
                  <span v-else>{{gChildItem[cItem.field]}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 单层子列表 -->
        <ul
          v-else
          class="childcontentlist"
          v-for="(childItem, childIndex) in item[children.name]"
          :key="childIndex"
          v-show="item.isShowList">
          <li :class="cItem.class" :title="childItem[cItem.field]" v-for="(cItem, i) in children.data" :key="i">
            <div v-if="cItem.isAction">
              <i v-if="childItem.reserveStatus == 'Reserve'" type="primary" class="el-icon-close" title="解除" @click.stop="removeItemHandle(childIndex, childItem)"></i>
              <i v-if="childItem.actions && childItem.actions.hasAdd" type="primary" class="el-icon-circle-plus-outline" title="添加" @click.stop="addItemHandle(childIndex, childItem,item)"></i>
            </div>
            <!-- 数量值（计量单位） -->
            <div v-else-if="cItem.isQuantityField" class="inline">
              <span v-if="cItem.field_1 && childItem[cItem.field_unit] == '米'" :title="(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 ' + (childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 ' + (childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'">{{(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 '}}{{(childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 '}}{{(childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'}}</span>
              <span v-else :title="(childItem[cItem.field] ? childItem[cItem.field] : '0') + childItem[cItem.field_unit]">{{(childItem[cItem.field] ? childItem[cItem.field] : '0') + childItem[cItem.field_unit]}}</span>
            </div>
            <div v-else-if="cItem.isOffered" class="inline">
                <span v-if="childItem.purchaseMeasurementUnit == '米'" :title="(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 ' + (childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 ' + (childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'">{{(childItem[cItem.field_1] ? childItem[cItem.field_1] : '0') + '包 '}}{{(childItem[cItem.field_2] ? childItem[cItem.field_2] : '0') + '米/包 '}}{{(childItem[cItem.field_3] ? childItem[cItem.field_3] : '0') + '米'}}</span>
                <span v-else :title="childItem[cItem.field_3]+childItem.purchaseMeasurementUnit"> {{childItem[cItem.field_3]?childItem[cItem.field_3]:"0"}}&nbsp;
                  <span v-if="childItem.purchaseMeasurementUnit!=null">{{childItem.purchaseMeasurementUnit}}</span>
                  <span v-else>条</span>
                </span>
            </div>
            <div v-else-if="cItem.isPurchase" class="inline">
              <span
                v-if="childItem.purchaseMeasurementUnit=='米'"
                :title="childItem[cItem.field_1] +'包  '+childItem[cItem.field_2] +'米'"
              >
                {{childItem[cItem.field_1]==null?"0":childItem[cItem.field_1]}}&nbsp;包&nbsp;
                {{childItem[cItem.field_2]?childItem[cItem.field_2]:"0"}}&nbsp;米
              </span>
              <span v-else :title="childItem[cItem.field_2]+childItem.purchaseMeasurementUnit">
                {{childItem[cItem.field_2]?childItem[cItem.field_2]:"0"}}&nbsp;
                <span
                  v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''"
                >{{childItem.purchaseMeasurementUnit}}</span>
                <span v-else>条</span>
              </span>
            </div>
            
            <div v-else-if="cItem.isReserve" class="inline">
              <div id="" v-if="item.auditStatus=='Approved'">
                <em title="预留" v-if="childItem.reserveStatus=='Reserve'">预留</em>
                <em title="解除" v-if="childItem.reserveStatus=='Release'">解除</em>
              </div>
            </div>
            <div v-else-if="cItem.isReserveBtn" class="inline">
                <div id="" v-if="item.auditStatus=='Approved'">
                  <el-button size="small" v-if="childItem.reserveStatus=='Reserve'" @click="factorychildupd(childItem,item)">
                      <em title="解除">解除</em>
                  </el-button>
                </div>
            </div>
            <div v-else-if="cItem.isApplication">
                 <i>{{childItem.isFinalDelivery==true?"是":"否"}}</i>
            </div>
            <span v-else-if="cItem.isTime" :title="childItem[cItem.field_1] + '—' + childItem[cItem.field_2]">{{childItem[cItem.field_1]}}—{{childItem[cItem.field_2]}}</span>
            <span v-else>{{childItem[cItem.field]}}</span>
          </li>
        </ul>
      </div>
    </div>
    <p v-if="!this.list.length && !loading" class="empty_tip">暂无数据</p>
  </div>
</template>

<script>
import { approvalProcessInfo } from "@/api/module/planReserveApi.js";
export default {
  name: 'Table',
  props: ['tableList', 'parentData', 'childData', 'tableFieldsList', 'tableParentFieldsList', 'tableLoading'],
  data () {
    return {
      list: [],
      fieldsList: [],
      parentFieldsList: [],
      parents: {},
      children: {},
      loading: true,
      panelist: [
        {
          index: "1",
          status: "",
          name: "尾款付款发起"
        },
        {
          index: "2",
          status: "",
          name: "全部尾款付款申请"
        },
        {
          index: "3",
          status: "Draft",
          name: "草稿"
        },
        {
          index: "4",
          status: "Approving",
          name: "审批中"
        },
        {
          index: "5",
          status: "Approved",
          name: "已通过"
        },
        {
          index: "6",
          status: "Rejected",
          name: "已驳回"
        },
        {
          index: "7",
          status: "Terminated",
          name: "已终止"
        }
      ],
    }
  },
  created() {},
  mounted() {
    this.loading = this.tableLoading;
    this.fieldsList = this.tableFieldsList;
    this.parentFieldsList = this.tableParentFieldsList;
    this.list = this.tableList;
    this.parents = this.parentData;
    this.children = this.childData;
  },
  computed: {
    list() {
      return this.tableList;
    }
  },
  watch: {
    tableLoading(val) {
      this.loading = val;
    },
    tableList(list) {
    	// console.log(list);
      this.list = list;
      this.$forceUpdate();
    },
    tableFieldsList(list) {
      this.fieldsList = list;
      this.$forceUpdate();
    },
    parentData(data) {
      this.parents = data;
      this.$forceUpdate();
    },
    childData(data) {
      this.children = data;
      this.$forceUpdate();
    }
  },
  methods: {
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    checkApprovalProcess(item) {
      approvalProcessInfo(item.uuid).then(res => {
        console.log('审批流程：', res);
        if (res.code === '0') {
          let data = res.data[res.data.length - 1];
          if (data == undefined) {
            item.fullName = '';
            item.approvalTime = '';
            item.content = '';
          } else {
            item.fullName = data.fullName;
            item.approvalTime = data.approvalTime;
            item.content = data.content;
          }
          this.$forceUpdate();
        }
      });
    },
    //尾款付款审批状态
    approveTypeHandle(status) {
      if (status != null) {
        for (var i = 0; i < this.panelist.length; i++) {
          let item = this.panelist[i];
          if (item.status == status) {
            return item.name;
          }
        }
      }
    },
    actionsTypeHandle(status) {
      // 审批
      switch (status) {
        case 'Draft':
          return '草稿';
          break;
        case 'Approving':
          return '审批中';
          break;
        case 'Approved':
          return '已通过';
          break;
        case 'Rejected':
          return '已驳回';
          break;
        case 'Terminated':
          return '已终止';
          break;
        default:
          break;
      }
    },
    editHandle(index, item) {
      this.$emit('editHandle', index, item);
    },
    addHandle(index, item) {
      this.$emit('addHandle', index, item);
    },
    submitHandle(index, item) {
      this.$emit('submitHandle', index, item);
    },
    removeHandle(index, item) {
      this.$emit('removeHandle', index, item);
    },
    deleteHandle(index, item) {
      this.$emit('deleteHandle', index, item);
    },
    checkHandle(index, item) {
      this.$emit('checkHandle', index, item);
    },
    revokeHandle(index, item) {
      this.$emit('revokeHandle', index, item);
    },
    removeItemHandle(index, item) {
      this.$emit('removeItemHandle', index, item);
    },
    addItemHandle(index, item,prItem) {
      this.$emit('addItemHandle', index, item,prItem);
    },
    payHandle(index, item) {
      this.$emit('payHandle', index, item);
    },
    addOrderItemHandle(item){
      this.$emit('addOrderItemHandle', item);
    },
    factorychildupd(childItem,item){
      this.$emit('factorychildupd', childItem, item);
    }
  }
}
</script>

<style lang="scss">
.tableList {
  min-height: 536px;

  .parent_header_wrap {
    // height: 60px;
    background-color: #486889;
    li {
      padding: 10px 10px;
      // line-height: 40px;
      color: #fff;
    }
  }

  .allparentlist {
    .parentlist {
      background-color: #F0F2F3;
    }
    .childlist {
      width: 98%;
      margin-left: 2%;
      margin-top: 8px;
      background-color: #E1E6EA;
    }
    .childcontentlist {
      width: 98%;
      margin-left: 2%;
    }
  }

  .list_group {
    border-bottom: 1px solid #EEEEEE;
    &:last-of-type {
      border-bottom: none;
    }
  }
  ul {
    li {
      outline: none;
    }
    &.childcontentlist {
      height: 60px;
      line-height: 40px;
      background-color: #F0F2F3;
      border-bottom: 1px solid #fff;
      &:hover {
        background-color: #f5f7fa;
      }
    }
    &.childlist {
      li {
        cursor: pointer;
      }
    }
  }
  .btn_popover {
    border: 0;
    border-bottom: 1px solid #409eff;
    color: #606266;
    cursor: pointer;
  }
  .img_pay {
    height: 20px;
  }
  .empty_tip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    margin: 20px 0px;
    font-size: 14px;
    color: #909399;
  }
}
</style>
