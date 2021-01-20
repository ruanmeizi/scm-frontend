<template>
  <div class="container groupMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap fl">
          <div class="display_ib mr10 mb10">
            <span class="tag">业务编码：</span>
            <el-input class="input_single w200 mr10" v-model.trim="inputData" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <el-input class="input_single w200 mr10" v-model.trim="inputData" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品特性：</span>
            <el-input class="input_single w200 mr10" v-model.trim="inputData" placeholder="请输入"></el-input>
          </div>
        </div>

        <!-- <el-input class="input_single w200 mr10 mb10" v-model="inputData" placeholder="业务编码"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="inputData" placeholder="供应商"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="inputData" placeholder="产品特性"></el-input> -->
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
        <el-tabs class="subnav_wrap">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in orderList"
              :key="index">
              <li class="w9p">序号</li>
              <li class="w9p">组合产品系统编码</li>
              <li class="w9p">业务编码</li>
              <li class="w9p">产品名称</li>
              <li class="w9p">产品品牌</li>
              <li class="w9p">产品特性</li>
              <li class="w9p">产品成分</li>
              <li class="w9p">产品分类</li>
              <li class="w9p">产品状态</li>
              <li class="w10p">
                <!-- <i type="primary" class="el-icon-edit" title="修改" @click="editHandle()"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle()"></i> -->
                <el-button @click.stop="editHandle()" type="text" size="small">编辑</el-button>
                <el-button @click.stop="deleteHandle()" type="text" size="small">删除</el-button>
              </li>
            </ul>
          </div>
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
    </div>

    <!-- 编辑页 -->
    <div class="form_part clearfix" v-else>
      <h1 class="notice">敬请期待</h1>
    </div>
    
  </div>
</template>

<script>
import { purchaseOrderList, searchPurchaseOrderList, deletePurchaseOrder, modifyPurchaseOrder, submitModifyPurchaseOrder } from "@/api/module/purchaseApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "groupMaintain",
  props: [],
  data() {
    return {
      inputData: '',

      isEdit: false,
      // form
      value1: null,
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },

      orderCode: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      uuid: '',
      orderList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      fieldList: [
        {
          name: '序号',
          class: 'w9p'
        },
        {
          name: '组合产品系统编码',
          class: 'w9p'
        },
        {
          name: '业务编码',
          class: 'w9p'
        },
        {
          name: '产品名称',
          class: 'w9p'
        },
        {
          name: '产品品牌',
          class: 'w9p'
        },
        {
          name: '产品特性',
          class: 'w9p'
        },
        {
          name: '产品成分',
          class: 'w9p'
        },
        {
          name: '产品分类',
          class: 'w9p'
        },
        {
          name: '产品状态',
          class: 'w9p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ]

    };
  },
  components: {},
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.orderStatus = '1';
    this.getPurchaseOrderList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: {
    // from
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getPurchaseOrderList();
    },
    addHandle() {
      // 添加
    },
    editHandle() {
      // 编辑项
      this.isEdit = true;
    },
    deleteHandle() {
      // 删除项
    },
    cloneHandle() {
      // 克隆
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchaseOrderList();
    },
    getPurchaseOrderList() {
      // 采购请求列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        customerId: this.customerId,
        orderStatus: this.orderStatus,
        purchaseOrderId: this.purchaseOrderId,
        uuid: this.uuid
      };
      purchaseOrderList(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code == '0') {
          this.orderList = res.data.records;
          this.total = res.data.total;
          this.orderList.forEach((item, index) => {
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = "空";
            }
          });
        }
      });
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

.groupMaintain {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
    li {
      outline: none;
    }
    &.childcontentlist {
      height: 60px;
      line-height: 40px;
    }
    &.childlist {
      li {
        cursor: pointer;
      }
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

ul {
  &.childcontentlist {
    li {
      white-space: normal;
    }
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.form_part {
  position: relative;
  height: 100vh;
  .notice {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 10px;
    font-size: 60px;
  }
  .title {
    margin-bottom: 30px;
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
  }
  .demo-ruleForm {
    width: 45%;
  }
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
.subnav_wrap .el-tabs__content {
  overflow: visible;
}
.subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
.subnav_wrap ul.el-dropdown-menu li.el-dropdown-menu__item {
  padding: 0 10px;
}

.groupMaintain .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.groupMaintain .el-form-item__content {
  width: auto;
}
.groupMaintain .el-input {
  width: auto;
}
.groupMaintain .whole_long .el-form-item__content {
  width: 65%;
}
.groupMaintain .whole_long .el-input {
  width: 100%;
}
.groupMaintain .el-rate {
  height: 40px;
  line-height: 40px;
  vertical-align: top;
}
.groupMaintain .el-rate__item {
  vertical-align: baseline;
}
</style>