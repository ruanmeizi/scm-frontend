<template>
  <div class="transferslip nav_tab_wrap">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="调拨" name="transferOrder">
        <transferOrder v-if="isTransferOrder"></transferOrder>
      </el-tab-pane>
      <!-- <el-tab-pane label="调拨旧版" name="factory">
        <factoryorder v-if="isFactory" @activeObj="getActiveData"></factoryorder>
      </el-tab-pane> -->
      <el-tab-pane label="移库" name="moveStorehouse">
        <moveStore v-if="isMoveStorehouse"></moveStore>
      </el-tab-pane>
      <el-tab-pane label="货妥记录" name="recording">
        <goodsRecording v-if="isRecording"></goodsRecording>
      </el-tab-pane>
      <!-- <el-tab-pane label="预收货清单" name="receipt">
        <advanceReceipt v-if="isReceipt"></advanceReceipt>
      </el-tab-pane>
      <el-tab-pane label="库内调拨" name="rolls">
        <rollsallocating v-if="isRolls" :subName="subName"></rollsallocating>
      </el-tab-pane>
      <el-tab-pane label="工厂本地调拨" name="localfactory">
        <localfactoryorder v-if="isLocalFactory"></localfactoryorder>
      </el-tab-pane>
      <el-tab-pane label="铺货调拨" name="shopgoods">  
        <shopgoodstransfers v-if="isShopgoods"></shopgoodstransfers>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
// import factoryorder from "./factoryorder/Index";
import transferOrder from "./transferOrder/Index";
import goodsRecording from "./goodsRecording/Index";
import rollsallocating from "./rollsallocating/Index";
import localfactoryorder from "./localfactoryorder/Index";
import shopgoodstransfers from "./shopgoodstransfers/Index";
import moveStore from './moveStore/Index'
// import advanceReceipt from "./advanceReceipt/Index";
export default {
  name: "transferslip",
  data() {
    return {
      activeName: 'transferOrder',
      subName: 'All',
      isFactory: false,
      isTransferOrder: true,
      isRecording: false,
      isRolls: false,
      isLocalFactory: false,
      isShopgoods: false,
      isMoveStorehouse:false,
      // isReceipt: false
    };
  },
  components: {
    // factoryorder,
    goodsRecording,
    rollsallocating,
    localfactoryorder,
    shopgoodstransfers,
    // advanceReceipt,
    transferOrder,
    moveStore
  },
  created() {
    
  },
  mounted() {
    
  },
  watch: {
    
  },
  methods: {
    handleClick(tab) {
      console.log(tab);
      switch (tab.name) {
        case 'factory':
          this.isFactory = true;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'transferOrder':
          this.isTransferOrder = true;
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'recording':
          this.isFactory = false;
          this.isRecording = true;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'rolls':
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = true;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'localfactory':
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = true;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'shopgoods':
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = true;
          this.isMoveStorehouse=false;
          // this.isReceipt = false;
          break;
        case 'receipt':
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=false;
          // this.isReceipt = true;
          break;
        case 'moveStorehouse':
          this.isFactory = false;
          this.isRecording = false;
          this.isRolls = false;
          this.isLocalFactory = false;
          this.isShopgoods = false;
          this.isMoveStorehouse=true;
          // this.isReceipt = true;
          break;
      
        default:
          break;
      }
    },
    getActiveData(obj) {
      this.subName = obj.subName;
      this.activeName = obj.name;
      this.isFactory = false;
      this.isRecording = false;
      this.isRolls = true;
      this.isLocalFactory = false;
      this.isShopgoods = false;
      // this.isReceipt = false;
    }
  }
};
</script>