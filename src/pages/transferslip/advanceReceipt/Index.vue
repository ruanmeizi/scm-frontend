<template>
  <div class="container advanceReceipt">
    <div class="actions_part clearfix">
      <!-- <el-select class="select_single w200 mr10"
        v-model="purchaseType"
        placeholder="请选择请求类型">
        <el-option key label="请选择请求类型" value></el-option>
        <el-option
          v-for="item in purchaseTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select> -->
      <el-input class="input_single w200 mr10" v-model="prepareReceiptCode" placeholder="预收货清单编号"></el-input>
      <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="调拨单号"></el-input>
      <div class="down fr">
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
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
        <el-tab-pane label="全部预收货清单" name="All">
          <ul class="childlist">
            <li
              :class="item.class"
              v-for="(item, index) in receiptFieldList"
              :key="index"
            >{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-for="(item, index) in receiptList" :key="index">
            <ul class="parentlist" @click="showChildList(index, item)">
              <li>
                <span>{{item.updateTime}}</span>
              </li>
              <li>
                <i>
                  预收货清单编号:
                  <em>{{item.prepareReceiptCode}}</em>
                </i>
              </li>
              <li style="float: right; margin-right: 15px;" @click.stop="showChildList(index, item)">
                <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                <i v-else class="el-icon-caret-bottom"></i>
              </li>
              <li style="float: right;">
                <i
                  type="primary"
                  class="el-icon-edit"
                  title="修改"
                  @click="editInfoHandle(index, item)"
                ></i>
              </li>
            </ul>
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in item.receiptListItemLists"
              :key="index"
              v-show="item.isShowList">
              <li class="w8p" :title="'childItem.materialCode'">{{childItem.materialCode ? childItem.materialCode : ''}}</li>
              <li class="w8p" :title="childItem.insideCode ? childItem.insideCode : ''">{{childItem.insideCode ? childItem.insideCode : ''}}</li>
              <li class="w8p" :title="childItem.productCode ? childItem.productCode : ''">{{childItem.productCode ? childItem.productCode : ''}}</li>
              <li class="w8p" :title="childItem.interiorCode ? childItem.interiorCode : ''">{{childItem.interiorCode ? childItem.interiorCode : ''}}</li>
              <li class="w8p" :title="childItem.supplierName ? childItem.supplierName : ''">{{childItem.supplierName ? childItem.supplierName : ''}}</li>
              <li class="w10p" :title="childItem.confirmingCode ? childItem.confirmingCode : ''">{{childItem.confirmingCode ? childItem.confirmingCode : ''}}</li>
              <li class="w15p">
	              <!--<div v-if="childItem.purchaseMeasurementUnit=='米'" :title="(childItem.transferBagQuantity ? childItem.transferBagQuantity : '0') + '包 ' + (childItem.packSpecification ? childItem.packSpecification : '0') + '米/包 ' + (childItem.transferMeter ? childItem.transferMeter : '0') + '米'">
	              	  {{(childItem.transferBagQuantity ? childItem.transferBagQuantity : '0') + '包 '}}
			              {{(childItem.packSpecification ? childItem.packSpecification : '0') + '米/包 '}}
			              {{(childItem.transferMeter ? childItem.transferMeter : '0') + '米'}}
	              </div>
                <div v-else>
                	<span :title="(childItem.transferMeter ? childItem.transferMeter : '0') + childItem.purchaseMeasurementUnit" v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">
                		{{(childItem.transferMeter ? childItem.transferMeter : '0') + childItem.purchaseMeasurementUnit}}
                	</span>
                	<span :title="(childItem.transferMeter ? childItem.transferMeter : '0') + '米'" v-else>{{(childItem.transferMeter ? childItem.transferMeter : '0') + '条'}}</span>
                </div>-->
              </li>
              <li class="w10p" :title="childItem.factoryAllocationCode ? childItem.factoryAllocationCode : ''">
              	{{childItem.factoryAllocationCode ? childItem.factoryAllocationCode : ''}}
              </li>
              <li class="w8p" :title="childItem.batchQuantity ? childItem.batchQuantity : '0'">{{childItem.batchQuantity ? childItem.batchQuantity : '0'}}</li>
              <li class="w8p" :title="childItem.batchNumber ? childItem.batchNumber : ''">{{childItem.batchNumber ? childItem.batchNumber : ''}}</li>
              <li class="w10p" :title="childItem.saleOrderId ? childItem.saleOrderId : ''">{{childItem.saleOrderId ? childItem.saleOrderId : ''}}</li>
            </ul>
          </div>
        </el-tab-pane>
      </el-tabs>

      <p v-if="!this.receiptList.length" class="empty_tip">暂无数据</p>
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

    <!-- 编辑预收货清单弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible"
        @close="dialogCloseHandle">
        <div class="popup_action clearfix">
          <div class="display_ib mr10">
            <el-button
              class="mr5"
              size="small"
              type="primary"
              icon="el-icon-download"
              circle
              title="下载"
              @click="downloadPackingHandle"
            ></el-button>
            <span>下载箱单</span>
          </div>
          <div class="display_ib">
            <el-button
              class="mr5"
              size="small"
              type="primary"
              icon="el-icon-download"
              circle
              title="下载"
              @click="downloadInvoiceHandle"
            ></el-button>
            <span>下载工厂发票</span>
          </div>
        </div>
        <el-tabs>
          <div class="btn_wrap">
            <span class="add_btn">预收货清单DIA0000001汇总信息</span>
          </div>
          <div class="add_warp">
            <ul class="childlist">
              <li
                :class="item.class"
                v-for="(item, index) in popupFieldNameList"
                :key="index"
              >{{item.name}}</li>
            </ul>
            <div class="allparentlist">
              <ul
                class="childcontentlist"
                v-for="(item, index) in confirmReceiptList"
                :key="index"
                v-show="item.batchNumber"
              >
                <li class="w10p" :title="item.materialCode">{{item.materialCode ? item.materialCode : ''}}</li>
                <li
                  class="w10p"
                  :title="item.confirmingCode"
                >{{item.confirmingCode ? item.confirmingCode : ''}}</li>
                <li
                  class="w15p"
                  :title="item.batchNumber"
                >{{item.batchNumber ? item.batchNumber : ''}}</li>
                <li
                  class="w15p"
                  :title="(item.batchQuantity ? item.batchQuantity : '0') + '包 ' + (item.packSpecification ? item.packSpecification : '0') + '米/包 ' + (item.batchMeter ? item.batchMeter : '0') + '米'"
                >{{(item.batchQuantity ? item.batchQuantity : '0') + '包 '}}{{(item.packSpecification ? item.packSpecification : '0') + '米/包 '}}{{(item.batchMeter ? item.batchMeter : '0') + '米'}}</li>
                <li
                  class="w15p"
                  :title="(item.transferBagQuantity ? item.transferBagQuantity : '0') + '包 ' + (item.packSpecification ? item.packSpecification : '0') + '米/包 ' + (item.transferMeter ? item.transferMeter : '0') + '米'"
                >{{(item.transferBagQuantity ? item.transferBagQuantity : '0') + '包 '}}{{(item.packSpecification ? item.packSpecification : '0') + '米/包 '}}{{(item.transferMeter ? item.transferMeter : '0') + '米'}}</li>
                <li class="w10p" :title="(item.realityNumber ? item.realityNumber : '0') + '米'">{{(item.realityNumber ? item.realityNumber : '0') + '米'}}</li>
                <li class="w15p" :title="item.saleOrderId ? item.saleOrderId : ''">{{item.saleOrderId ? item.saleOrderId : ''}}</li>
                <li class="w15p" :title="item.updateTime ? item.updateTime : ''">{{item.updateTime ? item.updateTime : ''}}</li>
                <!-- <li class="w6p fr">
                  <i v-if="!item.isEdit" type="primary" class="el-icon-edit mr10" title="修改" @click="editReceiptConfirmItem(index, item)"></i>
                  <el-button v-else size="mini" type="primary" @click="editConfirmItem(item.id)">确认</el-button>
                </li>-->
              </ul>
            </div>
          </div>
          <div class="btn_wrap" style="margin-top: 30px;">
            <span class="add_btn">新增预收货清单记录</span>
            <button class="edit_btn" :disabled="allAddDisabled" @click="batchEditHandle" style="border: none; background: #fff;">
              <i type="primary" class="el-icon-circle-plus" title="" style="margin-right: 10px; vertical-align: middle;"></i>批量编辑
            </button>
          </div>
          <div class="add_warp">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in editFieldNameList" :key="index">
                <span class="red mr5" v-if="item.isRules">*</span>
                {{item.name}}
              </li>
            </ul>
            <div class="allparentlist">
              <ul class="childcontentlist" v-for="(item, index) in editReceiptList" :key="index">
                <li class="w10p" :title="item.materialCode">{{item.materialCode ? item.materialCode : ''}}</li>
                <li class="w10p" :title="item.batchNumber">{{item.confirmingCode ? item.confirmingCode : ''}}</li>
                <li class="w15p">
                  <el-input
                    :ref="'batchNumInput' + item.id"
                    class="input_single"
                    placeholder="批次号"
                    v-model="item.batchNumber"
                  ></el-input>
                </li>
                <li
                  class="w15p"
                  :title="'1包 ' + (item.packSpecification ? item.packSpecification : '0') + '米/包 ' + (item.packSpecification ? item.packSpecification : '0') + '米'"
                >{{'1包 '}}{{(item.packSpecification ? item.packSpecification : '0') + '米/包 '}}{{(item.packSpecification ? item.packSpecification : '0') + '米'}}</li>
                <li class="w15p">
                  <el-input-number
                    class="w100"
                    size="medium"
                    v-model="item.realityNumber"
                    controls-position="right"
                    :min="0"></el-input-number>  米
                </li>
                <li class="w15p">
                  <el-input
                    class="input_single"
                    placeholder="销售订单编号"
                    v-model="item.saleOrderId"
                  ></el-input>
                </li>
                <li class="w20p fr">
                  <span @click="addItemEdit(index, item)" v-if="!item.isChildPack && isShowAdd">
                    <i
                      type="primary"
                      class="el-icon-circle-plus"
                      title
                      style="margin-right: 10px; vertical-align: middle;"
                    ></i>
                  </span>
                  <span v-else style="display: inline-block; width: 38px; height: 28px;"></span>
                  <el-button type="primary" :disabled="item.transferBagQuantity === 0" @click="submitHandle(index, item)">确认</el-button>
                </li>
              </ul>
            </div>
          </div>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  factorySerch,
  purchasegetuuid,
  factorychildadd,
  factorychildshow,
  purchaserequesttype,
  factorychilddel,
  gylPrepareReceiptList,
  searchPrepareReceiptItem,
  editPrepareReceiptItem,
  downloadInvoicePackingFile,
  warehousequesttype,
  subinventoryquesttype
} from "@/api/module/transfersApi.js";
import { timeFormat } from "@/utils/index.js";
//import receivingnote from "./receivingnote/Index";
export default {
  name: "advanceReceipt",
  components: {},
  data() {
    return {
      allAddDisabled: false,
      activeName: 'All',
      isShowList: false,
      total: 0,
      currentPage: 1, //页数
      pageSize: 10, //每页显示多少条

      typestatusid: "",
      purchaseType: '', //预收货清单请求类型
      orderOrRequestCode: '',
      isShowEdit: false,

      dialogFormVisible: false,
      prepareReceiptCode: '',
      receiptList: [],
      confirmReceiptList: [],
      editReceiptList: [],
      popupTitle: '',
      factoryAllocationCode: '',
      factoryInvoice: '',
      packingList: '',
      isShowAdd: true,
      batchEditDisabled: false,
      purchaseTypeList: [
        {
          value: 'BusinessAttire',
          label: '职业装'
        },
        {
          value: 'ZeroShear',
          label: '零剪'
        }
      ],
      receiptFieldList: [
        {
          name: "物料编号",
          class: "w8p"
        },
        {
          name: "物料系统编号",
          class: "w8p"
        },
        {
          name: "产品编号",
          class: "w8p"
        },
        {
          name: "产品系统编号",
          class: "w8p"
        },
        {
          name: "供应商名称",
          class: "w8p"
        },
        {
          name: "确认书号",
          class: "w10p"
        },
        {
          name: "调拨数量",
          class: "w15p"
        },
        {
          name: "调拨单号",
          class: "w10p"
        },
        {
          name: "批次发货数量",
          class: "w8p"
        },
        {
          name: "批次号",
          class: "w8p"
        },
        {
          name: "销售订单编号",
          class: "w10p"
        }
      ],
      popupFieldNameList: [
        {
          name: "物料编号",
          class: "w10p"
        },
        {
          name: "确认书号",
          class: "w10p"
        },
        {
          name: "批次号",
          class: "w15p"
        },
        {
          name: "批次发货数量",
          class: "w15p"
        },
        {
          name: "调拨数量",
          class: "w15p"
        },
        {
          name: "实际发货数量",
          class: "w10p"
        },
        {
          name: "销售订单编号",
          class: "w15p"
        },
        {
          name: "最新编辑时间",
          class: "w15p"
        }
      ],
      editFieldNameList: [
        {
          name: "物料编号",
          class: "w10p",
          isRules: false
        },
        {
          name: "确认书号",
          class: "w10p",
          isRules: false
        },
        {
          name: "批次号",
          class: "w15p",
          isRules: true
        },
        {
          name: "批次发货数量",
          class: "w15p"
        },
        {
          name: "实际发货数量",
          class: "w15p"
        },
        {
          name: "销售订单编号",
          class: "w15p"
        }
      ],

    };
  },
  created() {},
  mounted() {
    this.requestType();
    this.getPrepareReceiptList();
  },
  watch: {},
  methods: {
    switchTabHandle(tab) {
      // tab切换
      console.log('tab切换：', tab);
      this.currentPage = 1;
      this.receiptList = [];
      switch (tab.name) {
        case 'All':
          // 全部
          // this.stStatus = '';
          this.getPrepareReceiptList();
          break;
        default:
          // this.stStatus = '';
          this.getPrepareReceiptList();
          break;
      }
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    addItemHandle() {
      // 新增预收货清单记录
    },
    batchEditHandle() {
      // 批量编辑
      console.log('批量编辑数据：', this.confirmReceiptList);
      console.log('编辑列表：', this.editReceiptList);
      // return false;
      // let self = this;
      // for (var i = 0; i < this.editReceiptList.length; i++) {
      //   let $input = self.$refs['batchNumInput' + this.editReceiptList[i].id];
      //   for (var j = 0; j < $input.length; j++) {
      //     $input[j].$refs.input.focus();
      //   }
      // }
      this.editReceiptList = [];
      if (!this.batchEditDisabled) {
        for (var i = 0; i < this.confirmReceiptList.length; i++) {
          // if (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1 <= 0) {
          if (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity <= 0) {
            this.allAddDisabled = true;
            this.$message({
              message: "已超出编辑数量!",
              type: "error"
            });
            return false;
          }
          // let count = (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1) < 0 ? 0 : this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1;
          let count = (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity) < 0 ? 0 : this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity;
          for (var j = 0; j < count; j++) {
            console.log('j: ', j);
            let packItem = JSON.parse(JSON.stringify(this.confirmReceiptList[i]));
            console.log('批量packItem：', packItem);
            packItem.isChildPack = true;
            packItem.batchNumber = '';
            this.editReceiptList.splice(i + 1, 0, packItem);
            this.allAddDisabled = true;
            this.batchEditDisabled = true;
            this.isShowAdd = false;
          }
        }
      }
    },
    async editInfoHandle(index, item) {
      // 编辑预收货清单
      console.log(item);
      this.allAddDisabled = false;
      this.batchEditDisabled = false;
      this.isShowAdd = true;
      this.editReceiptList = [];
      this.factoryInvoice = item.factoryInvoices;
      this.packingList = item.packingLists;
      let searchData = {
        prepareReceiptCode: item.prepareReceiptCode,
        factoryAllocationCode: this.orderOrRequestCode,
        typestatusid: this.typestatusid
      };
      await searchPrepareReceiptItem(searchData).then(res => {
        console.log("查询预收货清单列表：", res);
        if (res.code === '0') {
          res.data.forEach(item => {
            item.addPackNum = 0;
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = '空';
            }
          });
          this.confirmReceiptList = res.data;
          
        }
      });
      this.editReceiptList = JSON.parse(JSON.stringify(this.confirmReceiptList));
      this.editReceiptList.forEach(item => {
        item.batchNumber = '';
      });
      // console.log('编辑数据：', this.editReceiptList);
      this.popupTitle = '编辑';
      this.dialogFormVisible = true;
    },
    addItemEdit(index, item) {
      // 添加编辑项
      console.log(index, item);
      if (item.addPackNum >= (item.transferBagQuantity - item.batchQuantity - 1)) {
        this.$message({
          message: "已超出编辑数量!",
          type: "error"
        });
        return false;
      }
      console.log(this.editReceiptList);
      let packItem = JSON.parse(JSON.stringify(item));
      packItem.isChildPack = true;
      this.editReceiptList.splice(index + 1, 0, packItem);
      this.isShowAdd = true;
      item.addPackNum++;
    },
    searchHandle() {
      // 预收货清单搜索
      this.receiptList = [];
      this.currentPage = 1;
      this.getPrepareReceiptList();
    },
    downloadPackingHandle() {
      // 下载发票和预收货清单
      // downloadInvoicePackingFile(Number(this.packingList)).then(res => {
      //   console.log(res);
      // });
      for (var i = 0; i < this.packingList.length; i++) {
        let id = Number(this.packingList[i]);
        window.open(process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/downloadById?id=${id}`);
      }
    },
    downloadInvoiceHandle() {
      // 下载发票和预收货清单
      // downloadInvoicePackingFile(Number(this.factoryInvoice)).then(res => {
      //   console.log(res);
      // });
      for (var i = 0; i < this.factoryInvoice.length; i++) {
        let id = Number(this.factoryInvoice[i]);
        window.open(process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/downloadById?id=${id}`);
      }
    },
    // editReceiptConfirmItem(index, item) {
    //   // 编辑完成项
    //   // 点击编辑如果编辑项有的话编辑输入框focus，如果没有数组最上方添加一条数据
    //   let self = this;
    //   this.editReceiptList.forEach(editItem => {
    //     if (item.id === editItem.id) {
    //       self.isFocus = true;
    //       item.isEdit = true;
    //     }
    //   });

    // },
    // editConfirmItem(id) {
    //   console.log(id);
    // },
    editBatchNumFocus() {},
    deleteConfirmItem(id) {
      // 删除编辑完成项
    },
    //请求类型
    requestType() {
      purchaserequesttype().then(response => {
        console.log('请求类型：', response);
        if (response.code === "0") {
          this.purchaseTypeList = response.data;
        }
      });
    },
    submitHandle(index, item) {
      // 确认
      console.log(item);
      if (!item.batchNumber) {
        this.$message({
          showClose: true,
          type: "error",
          message: "请填写批次号！"
        });
        return;
      }
      if (item.realityNumber) {
        if (!this.verificationHandle(item.realityNumber, '实际发货数量')) {
          item.realityNumber = 0;
          return false;
        }
      }
      let list = [];
      let searchData = {
        prepareReceiptCode: item.prepareReceiptCode,
        factoryAllocationCode: this.orderOrRequestCode,
        typestatusid: this.typestatusid
      };
      item.batchQuantity = item.transferBagQuantity;
      list.push(item);
      editPrepareReceiptItem(list).then(res => {
        console.log('确认编辑批次号完成：', res);
        if (res.code === '0') {
          this.getEditReceiptList(searchData);
          this.editReceiptList.splice(index, 1);
          console.log('editReceiptList后: ', this.editReceiptList);
        }
      });
    },
    verificationHandle(val, name) {
      // 数量值校验
      if (val.toString().indexOf('.') !== -1) {
        let arr = val.toString().split('.');
        if (arr[0].length > 8) {
          this.$message({
            message: `${name}仅支持整数位8位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
        if (arr[1].length > 2) {
          this.$message({
            message: `${name}仅支持小数位2位，请重新输入！`,
            type: 'error'
          });
          return false;
        }
      } else if (val.toString().length > 8) {
        this.$message({
          message: `${name}仅支持整数位8位，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    dialogCloseHandle() {
      this.getPrepareReceiptList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPrepareReceiptList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPrepareReceiptList();
    },
    getPrepareReceiptList() {
      // 已生成预收货清单列表
      let data = {
        prepareReceiptCode: this.prepareReceiptCode,
        factoryAllocationCode: this.factoryAllocationCode,
        purchaseType: this.purchaseType
      };
      gylPrepareReceiptList(this.currentPage, this.pageSize, data).then(res => {
        console.log('已生成预收货列表：', res);
        if (res.code === '0') {
          this.receiptList = res.data.records;
          this.total = res.data.total;
          this.receiptList.forEach((item, index) => {
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = '空';
            }
          });
        }
      });
    },
    getEditReceiptList(data) {
      // 查询预收货清单列表
      this.confirmReceiptList = [];
      searchPrepareReceiptItem(data).then(res => {
        console.log('查询预收货清单列表：', res);
        if (res.code === '0') {
          this.confirmReceiptList = res.data;
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

.advanceReceipt {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
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
}

.popup_part {
  .popup_action {
    text-align: right;
  }
  .add_btn {
    font-size: 16px;
    font-weight: bold;
  }
  .edit_btn {
    margin-left: 64%;
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
  .btn_wrap {
    margin-bottom: 15px;
  }
  .add_warp {
    .childcontentlist {
      line-height: 40px;
    }
  }
  i.el-icon-circle-plus {
    font-size: 28px;
    color: #409eff;
    cursor: pointer;
  }
  i.el-icon-edit,
  i.el-icon-remove {
    font-size: 28px;
    cursor: pointer;
  }
  i.el-icon-remove {
    color: red;
  }
  i.el-icon-edit {
    font-size: 20px;
    color: #409eff;
    margin-left: 10px;
  }
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
</style>
<style>
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.advanceReceipt .popup_part .el-dialog__body {
  padding: 10px 20px;
}
</style>