<template>
  <div class="container virtualMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">业务编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="inputData" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <el-input class="input_single w200 mr10" v-model.trim="supplierCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品季：</span>
            <el-input class="input_single w200 mr10" v-model.trim="season" placeholder="请输入"></el-input>
          </div>
        </div>


        <!-- <el-input class="input_single w200 mr10 mb10" v-model="inputData" placeholder="业务编码"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="supplierCode" placeholder="供应商"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="season" placeholder="产品季"></el-input> -->
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
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
              <li class="w9p">虚拟产品系统编号</li>
              <li class="w9p">业务编号</li>
              <li class="w9p">产品名称</li>
              <li class="w9p">产品品牌</li>
              <li class="w9p">产品季</li>
              <li class="w9p">产品成分</li>
              <li class="w9p">产品分类</li>
              <li class="w9p">产品状态</li>
              <li class="w10p">
                <el-button type="text" @click="editHandle(item)">查看</el-button>
              </li>
            </ul>
          </div>
          <!-- <singleTable
          :tableList='orderList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @checkHandle='editHandle'
          ></singleTable> -->
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
    	<!--<h1 class="notice">敬请期待</h1>-->
      <div class="base_wrap clearfix">
        <h2 class="title">产品基本信息</h2>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm fl">
          <el-form-item label="产品编号">
            <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="产品名称">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="产品代码">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="产品品牌">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="制造商编号">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="产品分类">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="采购计量单位">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="上市日期" required>
            <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="生命周期" required>
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="备注" class="whole_long">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
        </el-form>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm fl">
           <el-form-item label="产品条形码">
            <span>{{ruleForm.aaaa}}</span>
          </el-form-item>
          <el-form-item label="产品季">
             <span>{{ruleForm.region}}</span>
          </el-form-item>
          <el-form-item label="页数">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="产地">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="替代品">
             <span>{{ruleForm.name}}</span>
          </el-form-item>
          <el-form-item label="推荐品">
            <el-checkbox disabled class="w300" label="" name="type"></el-checkbox>
          </el-form-item>
          <el-form-item label="团购推荐指数">
            <el-rate disabled class="w300" v-model="value1"></el-rate>
          </el-form-item>
          <el-form-item label="时尚度">
             <span>{{ruleForm.region}}</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="mt20 fr">
        <el-button class="mr10" @click="resetForm('ruleForm')">取消</el-button>
      </div>
    </div>
    
  </div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { purchaseOrderList, searchPurchaseOrderList, deletePurchaseOrder, modifyPurchaseOrder, submitModifyPurchaseOrder } from "@/api/module/purchaseApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "virtualMaintain",
  props: [],
  data() {
    return {
      inputData: '',
      supplierCode:'',
      season:'',
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
          name: '虚拟产品系统编号',
          class: 'w9p'
        },
        {
          name: '业务编号',
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
          name: '产品季',
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
      ],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'id',
          width:'80'
          // width: '150',
          //minWidth: '20%'
        },
        {
          name: '虚拟产品系统编号',
          field: 'interiorCode',
          //class: 'w50p',
          width: '140',
          //minWidth: '20%'
        },
        {
          name:'业务编号',
          field:'productCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品名称',
          field:'productName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品品牌',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品季',
          field:'brand',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name: '产品成分',
          field:'seasonname',
          //class: 'w50p',
          width: '120',
          //minWidth: '20%'
        },
        {
          name:'产品分类',
          field:'productComposition',
          //class: 'w50p',
          width: '120',
          //minWidth: '20%'
        },
        {
          name:'产品状态',
          field:'productStatusname',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '150',
          minWidth: '10%',
          isAction: true,
          hasCheck:true,
        },
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
//        alert('submit!');
          this.isEdit = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isEdit = false;
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

.virtualMaintain {
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
/*.form_part {
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
}*/
.form_part {
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
.notice {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    letter-spacing: 10px;
    font-size: 60px;
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

.virtualMaintain .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.virtualMaintain .el-form-item__content {
  width: auto;
}
.virtualMaintain .el-input {
  width: auto;
}
.virtualMaintain .whole_long .el-form-item__content {
  width: 65%;
}
.virtualMaintain .whole_long .el-input {
  width: 100%;
}
.virtualMaintain .el-rate {
  height: 40px;
  line-height: 40px;
  vertical-align: top;
}
.virtualMaintain .el-rate__item {
  vertical-align: baseline;
}
</style>