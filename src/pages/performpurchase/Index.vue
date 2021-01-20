<template>
  <div class="performpurchase nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="采购请求" name="request">
        <purchaseRequest v-if="isRequest" @activeObj="getActiveData"></purchaseRequest>
      </el-tab-pane>
      <el-tab-pane label="采购订单" name="order">
        <purchaseOrder v-if="isOrder" :subName="subName"></purchaseOrder>
      </el-tab-pane>
      <el-tab-pane label="工厂确认" name="confirm">
        <factoryconfirm v-if="isFactory"></factoryconfirm>
      </el-tab-pane>
      <el-tab-pane label="货妥管理" name="management">
        <goodsmanagement v-if="isGoods"></goodsmanagement>
      </el-tab-pane>
      <!-- <el-tab-pane label="预收货清单管理" name="receipt">
        <advancereceipt v-if="isReceipt"></advancereceipt>
      </el-tab-pane> -->
      <el-tab-pane label="首付款申请" name="downPayment">
        <downPaymentApply v-if="isDownPayment"></downPaymentApply>
      </el-tab-pane>
      <el-tab-pane label="尾款付款申请" name="finalPayment">
        <finalPaymentRequest v-if="isFinalPayment"></finalPaymentRequest>
      </el-tab-pane>
      <el-tab-pane label="调拨" name="advanceReceipt">
        <advanceReceipt :disabledbo="disabledbo" v-if="isAdvanceReceipt"></advanceReceipt>
      </el-tab-pane>
      <!-- <el-tab-pane label="成品生产" name="produce">
        <finishedproduction v-if="isProduce"></finishedproduction>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import purchaseRequest from "./purchaseRequest/Index";
import purchaseOrder from "./purchaseOrder/Index";
import factoryconfirm from "./factoryconfirm/Index";
import goodsmanagement from "./goodsmanagement/Index";
import advancereceipt from "./advancereceipt/Index";
import finishedproduction from "./finishedproduction/Index";
import downPaymentApply from "./downPaymentApply/Index";
import finalPaymentRequest from "./finalPaymentRequest/Index";
import advanceReceipt from "../advanceReceiptManage/advanceReceipt/Index";
export default {
  name: "performpurchase",
  data() {
    return {
      activeName: 'request',
      subName: 'Draft',
      disabledbo:true,
      isRequest: true,
      isOrder: false,
      isFactory: false,
      isGoods: false,
      isReceipt: false,
      isProduce: false,
      isDownPayment: false,
      isFinalPayment: false,
      isAdvanceReceipt:false
    };
  },
  components: {
    purchaseRequest,
    purchaseOrder,
    factoryconfirm,
    goodsmanagement,
    advancereceipt,
    finishedproduction,
    downPaymentApply,
    finalPaymentRequest,
    advanceReceipt
  },
  created() {
    // this.$route.query.name ? this.activeName = this.$route.query.name : this.activeName = 'request';
    // this.$route.query.subName ? this.subName = this.$route.query.subName : this.subName = 'All';
  },
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'request':
          this.isRequest = true;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'order':
          this.subName = 'All';
          this.isRequest = false;
          this.isOrder = true;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'confirm':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = true;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'gmTest':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'management':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = true;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'receipt':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = true;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;
        case 'produce':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = true;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          break;         
        case 'downPayment':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=true;
          this.isFinalPayment=false;
          break;
         case 'finalPayment':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=true;
          break;
          case 'advanceReceipt':
          this.isRequest = false;
          this.isOrder = false;
          this.isFactory = false;
          this.isGoods = false;
          this.isGoodsTest = false;
          this.isReceipt = false;
          this.isProduce = false;
          this.isDownPayment=false;
          this.isFinalPayment=false;
          this.isAdvanceReceipt=true;
          break;
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.isRequest = false;
      this.isOrder = true;
      this.isFactory = false;
      this.isGoods = false;
      this.isReceipt = false;
      this.isProduce = false;
      this.isDownPayment=false;
      this.isFinalPayment=false;
    }
  }
};
</script>