<template>
  <div class="container purchaserequest">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">请求编号：</span>
          <el-input class="input_single w200 mr10" v-model="purchaseRequestCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select class="select_single w200 mr10"
            v-model="supplierCode"
            filterable
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in supplierList"
              :key="item.supplierId"
              :label="item.supplierCode"
              :value="item.supplierId">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">请求类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="purchaseType"
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in purchaseTypeList"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemValue">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">规格：</span>
          <el-select class="select_single w200 mr10"
            v-model="specificationsType"
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in specificationsList"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">创建日期：</span>
          <el-date-picker class="mr10"
            v-model="dateVal"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateValChange"
          ></el-date-picker>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">快货：</span>
          <el-select class="select_single w200 mr10"
            v-model="belongToEv"
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in ifYesOrNoList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">EV产品：</span>
          <el-select class="select_single w200 mr10"
            v-model="mobileGoods"
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in ifYesOrNoList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">特殊要求：</span>
          <el-input class="input_single w200 mr10" v-model="specialRequire" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">采购删除：</span>
          <el-select class="select_single w200 mr10"
            v-model="purchaseDeleteStatus"
            placeholder="请选择"
            @change="searchHandle">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in ifYesOrNoList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">销售订单编号：</span>
          <el-input class="input_single w200 mr10" v-model="saleOrderId" placeholder="请输入"></el-input>
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
        <el-button type="primary" @click="createOrderHandle">生成采购订单</el-button>
      </div>
    </div>
    
    <div class="table_part clearfix">
      <!-- <el-tabs class="hidden" v-loading="tableLoading"> -->
        <el-table
          class="table_list"
          ref="multipleTable"
          v-loading="listLoading"
          :data="requestList"
          row-key="id"
          border
          fit
          stripe
          @expand-change="expandChange"
          @select="selectHandle"
          @select-all="selectAllHandle"
          :expand-row-keys="expands"
          @row-click="rowClick">
          <el-table-column type="selection" />
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table
                class="table_list"
                :ref="'childMultipleTable_' + scope.row.id"
                v-loading="childListLoading"
                :data="scope.row.priList"
                border
                fit
                @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }">
                <el-table-column fixed type="selection" />
                <el-table-column fixed label="行号">
                  <template slot-scope="{ row }">
                    {{ row.sn }}
                  </template>
                </el-table-column>
                <el-table-column fixed label="物料编号">
                  <template slot-scope="{ row }">
                    {{ row.materialCode }}
                  </template>
                </el-table-column>
                <el-table-column label="客户名称">
                  <template slot-scope="{ row }">
                    {{ row.customerName }}
                  </template>
                </el-table-column>
                <el-table-column label="供应商">
                  <template slot-scope="{ row }">
                    <!-- {{ row.supplierName }} -->
                    {{ row.supplierShortName }}
                  </template>
                </el-table-column>
                <el-table-column label="期望交期">
                  <template slot-scope="{ row }">
                    {{ row.requiredDate }}
                  </template>
                </el-table-column>
                <el-table-column label="请求数量">
                  <template slot-scope="{ row }">
                    <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.requiredPackages ? row.requiredPackages : 0) + '包 ' + (row.requiredQuantityPerPackage ? row.requiredQuantityPerPackage : 0) + '米/包 ' + (row.requiredQuantity ? row.requiredQuantity : 0) + '米' }}</span>
                    <span v-else>{{ (row.requiredQuantity ? row.requiredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="销售订单编号">
                  <template slot-scope="{ row }">
                    {{ row.saleOrderId }}
                  </template>
                </el-table-column>
                <el-table-column label="物料工厂季">
                  <template slot-scope="{ row }">
                    {{ row.materialFactorySeason }}
                  </template>
                </el-table-column>
                <el-table-column label="特殊要求">
                  <template slot-scope="{ row }">
                    {{ row.specialRequire }}
                  </template>
                </el-table-column>
                <el-table-column label="原确认书编号">
                  <template slot-scope="{ row }">
                    {{ row.originalConfirmNum }}
                  </template>
                </el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="{ row }">
                    {{ row.remark }}
                  </template>
                </el-table-column>
                <el-table-column label="快货">
                  <template slot-scope="{ row }">
                    {{ row.belongToEv === true ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="EV产品">
                  <template slot-scope="{ row }">
                    {{ row.mobileGoods === true ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column label="采购删除">
                  <template slot-scope="{ row }">
                    {{ row.purchaseDeleteStatus === true ? '是' : '否' }}
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="请求编号">
            <template slot-scope="{ row }">
              {{ row.purchaseRequestCode }}
            </template>
          </el-table-column>
          <el-table-column label="请求类型">
            <template slot-scope="{ row }">
              {{ row.purchaseTypeName }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="{ row }">
              {{ row.createTime }}
            </template>
          </el-table-column>
          <el-table-column label="申请人">
            <template slot-scope="{ row }">
              {{ row.applicantName }}
            </template>
          </el-table-column>
        </el-table>
      <!-- </el-tabs> -->

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
    
    <!-- 查看弹窗 -->
    <div class="popup_part popup">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <!-- <div v-for="(item, index) in generateRequestList" :key="index">
          <el-table
            class="table_list mb20"
            ref="multipleTable"
            v-loading="dialogLoading"
            :data="item"
            border
            fit
            stripe>
            <el-table-column label="物料编号">
              <template slot-scope="{ row }">
                {{ row.materialCode }}
              </template>
            </el-table-column>
            <el-table-column label="客户名称">
              <template slot-scope="{ row }">
                {{ row.customerName }}
              </template>
            </el-table-column>
            <el-table-column label="供应商">
              <template slot-scope="{ row }">
                {{ row.supplierShortName }}
              </template>
            </el-table-column>
            <el-table-column label="期望交期">
              <template slot-scope="{ row }">
                {{ row.requiredDate }}
              </template>
            </el-table-column>
            <el-table-column label="请求数量">
              <template slot-scope="{ row }">
                <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.requiredPackages ? row.requiredPackages : 0) + '包 ' + (row.requiredQuantityPerPackage ? row.requiredQuantityPerPackage : 0) + '米/包 ' + (row.requiredQuantity ? row.requiredQuantity : 0) + '米' }}</span>
                <span v-else>{{ (row.requiredQuantity ? row.requiredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="物料工厂季">
              <template slot-scope="{ row }">
                {{ row.materialFactorySeason }}
              </template>
            </el-table-column>
            <el-table-column label="特殊要求">
              <template slot-scope="{ row }">
                {{ row.specialRequire }}
              </template>
            </el-table-column>
            <el-table-column label="原确认书编号">
              <template slot-scope="{ row }">
                {{ row.originalConfirmNum }}
              </template>
            </el-table-column>
            <el-table-column label="备注">
              <template slot-scope="{ row }">
                {{ row.remark }}
              </template>
            </el-table-column>
          </el-table>
        </div> -->

        <el-tabs v-loading="dialogLoading">
          <div v-for="(item, index) in generateRequestList" :key="index">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in generateFieldNameList" :key="index">{{item.name}}</li>
            </ul>
            <div class="allparentlist">
              <ul
                class="childcontentlist"
                v-for="(cItem, cIndex) in item"
                :key="cIndex">
                <li class="w13p" :title="cItem.materialCode ? cItem.materialCode : ''">{{cItem.materialCode ? cItem.materialCode : ''}}</li>
                <li class="w17p" :title="cItem.customerName ? cItem.customerName : ''">{{cItem.customerName ? cItem.customerName : ''}}</li>
                <li class="w14p" :title="cItem.supplierShortName ? cItem.supplierShortName : ''">{{cItem.supplierShortName ? cItem.supplierShortName : ''}}</li>
                <li class="w13p" :title="cItem.requiredDate ? cItem.requiredDate : ''">{{cItem.requiredDate ? cItem.requiredDate : ''}}</li>
                <li class="w17p">
                  <span v-if="cItem.purchaseMeasurementUnit == '米'" :title="(cItem.requiredPackages ? cItem.requiredPackages : '0') + '包 ' + (cItem.requiredQuantityPerPackage ? cItem.requiredQuantityPerPackage : '0') + '米/包 ' + (cItem.requiredQuantity ? cItem.requiredQuantity : '0') + '米'">
                    {{(cItem.requiredPackages ? cItem.requiredPackages : '0') + '包 '}}
                    {{(cItem.requiredQuantityPerPackage ? cItem.requiredQuantityPerPackage : '0') + '米/包 '}}
                    {{(cItem.requiredQuantity ? cItem.requiredQuantity : '0') + cItem.purchaseMeasurementUnit}}
                  </span>
                  <span v-else :title="(cItem.requiredQuantity ? cItem.requiredQuantity : '0') + (cItem.purchaseMeasurementUnit ? cItem.purchaseMeasurementUnit : '条')">{{(cItem.requiredQuantity ? cItem.requiredQuantity : '0') + (cItem.purchaseMeasurementUnit ? cItem.purchaseMeasurementUnit : '条')}}</span>
                </li>
                <li class="w13p" :title="cItem.materialFactorySeason ? cItem.materialFactorySeason : ''">{{cItem.materialFactorySeason ? cItem.materialFactorySeason : ''}}</li>
                <li class="w13p" :title="cItem.specialRequire ? cItem.specialRequire : ''">{{cItem.specialRequire ? cItem.specialRequire : ''}}</li>
                <li class="w13p" :title="cItem.originalConfirmNum ? cItem.originalConfirmNum : ''">{{cItem.originalConfirmNum ? cItem.originalConfirmNum : ''}}</li>
                <li class="w13p" :title="cItem.remark ? cItem.remark : ''">{{cItem.remark ? cItem.remark : ''}}</li>
              </ul>
            </div>
          </div>
        </el-tabs>

        <p>确认要生成这个订单吗？</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" v-preventReClick @click="saveOrderConfirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
</template>

<script>
import axios from "axios";
import {
  getUUID,
  supplierDictList,
  supplierSearchList,
  approvalProcessInfo,
} from "@/api/publicApi.js";
import {
  purchaseRequestList,
  searchPurchaseRequest,
  savePurchaseOrder,
  getmaterialCodeUnit,
  purchaseDeletePri
} from "@/api/module/purchaseApi.js";
import { purchaserequesttype } from "@/api/module/requisitionApi.js";
import { timeFormat,getTimeRange} from '@/utils/index.js';
export default {
  name: "purchaserequest",
  props: ['subName'],
  data() {
    return {
      // tableLoading: true,
      specificationsType: '',
      belongToEv: '',
      mobileGoods: '',
      materialCode: '',
      requestCode: '',
      dateVal: '',
      beginTime: '',
      endTime: '',
      supplierCode: '',
      supplierName: '',
      productCode: '',
      purchaseType: '',
      prStatus: '3',
      purchaseRequestCode: '',
      purchaseRequestName: '',
      saleOrderId: '',
      requestList: [],
      generateRequestList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      isCheckedAll: false,
      checkAllFlag: false,
      checkList: [],
      checkAllList: [],
      checkAll: false,
      popupTitle: '',
      checkPopupTitle: '',
      dialogFormVisible: false,
      dialogLoading: false,
      checkDialogFormVisible: false,
      uuid: '',
      deleteUuid: '',
      specialRequire: '',
      purchaseDeleteStatus: '',
      isConfirmDisabled: false,
      purchaseTypeList: [],
      supplierList: [],
      createPurchaseData: [],
      expands: [],

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: true,
      childListLoading: false,
      selectUuidList: [],
      checkedUuidList: [],
      
      ifYesOrNoList:[
        {
          index:true,
          name:'是'
        },
        {
          index:false,
          name:'否'
        }
      ],
      fieldNameList: [
        {
          name: '物料编号',
          class: 'w12p'
        },
        {
          name: '客户名称',
          class: 'w12p'
        },
        {
          name: '供应商',
          class: 'w11p'
        },
        {
          name: '期望交期',
          class: 'w9p'
        },
        {
          name: '请求数量',
          class: 'w12p'
        },
        {
          name: '特殊要求',
          class: 'w9p'
        }
      ],
      parentFieldsList: [  // Table父列表表头
        // {
        //   name: '创建时间',
        //   class: 'w10p'
        // },
        {
          name: '申请人',
          class: 'w6p'
        },
        {
          name: '请求编号',
          class: 'w15p'
        },
        {
          name: '请求类型',
          class: 'w10p'
        }
      ],
      generateFieldNameList: [
        {
          name: '物料编号',
          class: 'w13p'
        },
        {
          name: '客户名称',
          class: 'w17p'
        },
        {
          name: '供应商',
          class: 'w14p'
        },
        {
          name: '期望交期',
          class: 'w13p'
        },
        {
          name: '请求数量',
          class: 'w17p'
        },
        {
          name: '物料工厂季',
          class: 'w13p'
        },
        {
          name: '特殊要求',
          class: 'w13p'
        },
        {
          name:'原确认书编号',
          class: 'w13p'
        },
        {
          name: '备注',
          class: 'w13p'
        }
      ],
      specificationsList: [
        {
          value: '35',
          name: '35米/包'
        },
        {
          value: '60',
          name: '60米/包'
        },
        {
          value: '70',
          name: '70米/包'
        }
      ]
    };
  },
  components: {},
  created() {
    this.getPurchaseType();
    this.getSupplierDictList();
    // this.$emit('activeObj', {name: 'request', subName: ''});
  },
  mounted() {
    // this.prStatus = 'Approved';
    // this.getPurchaseRequestList();
    this.fun_date();
  },
  watch: {},
  methods: {
    // 固定展示为两周前的时间范围
    fun_date() {
      this.dateVal = getTimeRange(-14);
      this.searchHandle();
    },
    rowClick(row, event, column) {
      // 单击行
      Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (this.expands.indexOf(row.id) < 0) {
        this.expands.push(row.id);
      } else {
        this.expands.remove(row.id);
      }
    },
    selectAllHandle(selection) {
      // 父项全选事件
      console.log('触发全选事件：', selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      this.multipleSelection = selection;
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
          for (let j = 0; j < item.priList.length; j++) {
            let cItem = item.priList[j];
            this.childMultipleSelection.push(cItem);
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && !Array.isArray(this.$refs['childMultipleTable_' + item.id])) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
        for (let i = 0; i < this.requestList.length; i++) {
          let item = this.requestList[i];
          for (let j = 0; j < item.priList.length; j++) {
            let cItem = item.priList[j];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && !Array.isArray(this.$refs['childMultipleTable_' + item.id])) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, false);
              }
            });
          }
        }
      }
    },
    expandChange(row, rowList) {
      console.log('树形展开项：', row, rowList);
      console.log('勾选父子项：', this.multipleSelection, this.childMultipleSelection);
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.priList.length; i++) {
          let cItem = row.priList[i];
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id] && !Array.isArray(this.$refs['childMultipleTable_' + row.id])) {
              this.$refs['childMultipleTable_' + row.id].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    selectHandle(selection, row) {
      console.log('当用户手动勾选数据行的 Checkbox 时触发事件：', selection, row);
      let _this = this;
      let _row = row;
      this.selectUuidList = [];
      this.multipleSelection = selection;
      if (selection && selection.length) {
        // await this.$nextTick();
        for (var i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
        }
        if (this.selectUuidList.indexOf(_row.uuid) > -1) {
          // 当前项选中状态
          for (let i = 0; i < _row.priList.length; i++) {
            let cItem = _row.priList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && !Array.isArray(this.$refs['childMultipleTable_' + _row.id])) {
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.priList.length; i++) {
            let cItem = _row.priList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && !Array.isArray(this.$refs['childMultipleTable_' + _row.id])) {
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, false);
              }
            });
            this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
              return cmsItem.uuid !== cItem.uuid;
            });
          }
        }
      } else {
        // 未选中 需删除该父项下所有子项
        if (this.$refs['childMultipleTable_' + _row.id]) {
          this.$refs['childMultipleTable_' + _row.id].clearSelection();
        }
        for (let i = 0; i < row.priList.length; i++) {
          let item = row.priList[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
            let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
            this.childMultipleSelection.splice(index, 1);
          }
        }
      }
    },
    async childSelectHandle(selection, row, parentRow) {
      // 选择子项
      console.log('选择子项：', selection, row, parentRow);
      let uuidList = [];
      for (var i = 0; i < selection.length; i++) {
        let item = selection[i];
        uuidList.push(item.uuid);
      }
      if (uuidList.indexOf(row.uuid) > -1) {
        // 当前项选中状态
        if (this.arrContainObjHandle(this.childMultipleSelection, row) === -1) {
          this.childMultipleSelection.push(row);
        }
      } else {
        // 取消选中
        if (this.arrContainObjHandle(this.childMultipleSelection, row) != -1) {
          let index = this.childMultipleSelection.findIndex(x => x.uuid == row.uuid);
          this.childMultipleSelection.splice(index, 1);
        }
      }
      await this.$nextTick();
      if (selection.length === parentRow.priList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          if (this.$refs.multipleTable && !Array.isArray(this.$refs.multipleTable)) {
            this.$refs.multipleTable.toggleRowSelection(parentRow, true);
          }
        });
      }
      if (!Array.isArray(this.$refs.multipleTable)) {
        this.$refs.multipleTable.toggleRowSelection(parentRow, false);
      }
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
      console.log('子项全选操作：', selection, parentRow);
      await this.$nextTick();
      if (selection && selection.length) {
        this.$nextTick(() => {
          if (this.$refs.multipleTable && !Array.isArray(this.$refs.multipleTable)) {
            this.$refs.multipleTable.toggleRowSelection(parentRow, true);
          }
        });
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) === -1) {
            this.childMultipleSelection.push(item);
          }
        }
      } else {
        for (let i = 0; i < parentRow.priList.length; i++) {
          let item = parentRow.priList[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
            let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
            this.childMultipleSelection.splice(index, 1);
          }
        }
        if (!Array.isArray(this.$refs.multipleTable)) {
          this.$refs.multipleTable.toggleRowSelection(parentRow, false);
        }
      }
    },
    arrContainObjHandle(arr, obj) {
      var index = arr.findIndex(item => item.uuid == obj.uuid);
      return index;
    },
    unique(arr) {
      // 去重
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    },
  	
    checkOptionChange(val, uuid) {
      let checkArr = [];
      let requestListCopy = JSON.parse(JSON.stringify(this.requestList));
      for (var i = 0; i < requestListCopy.length; i++) {
        if (requestListCopy[i].uuid == uuid) {
          for (var j = 0; j < requestListCopy[i].priList.length; j++) {
            checkArr.push(requestListCopy[i].priList[j].uuid);
          }
        }
      }
      if (this.checkArr(this.checkList, checkArr)) {
        this.checkAllList.push(uuid);
      } else {
        this.checkAllList = this.checkAllList.filter(item => {
          return item !== uuid;
        });
      }
    },
    checkAllItemChange(val, uuid) {
      let requestListCopy = JSON.parse(JSON.stringify(this.requestList));
      for (var i = 0; i < requestListCopy.length; i++) {
        if (requestListCopy[i].uuid == uuid) {
          for (var j = 0; j < requestListCopy[i].priList.length; j++) {
            if (!val) {
              this.checkList = this.checkList.filter(item => {
                return item !== requestListCopy[i].priList[j].uuid;
              });
            } else {
              this.checkList.push(requestListCopy[i].priList[j].uuid);
            }
          }
        }
      }
    },
    checkAllListChange(val) {
      if (val) {
        for (let i = 0; i < this.requestList.length; i++) {
          let item = this.requestList[i];
          // if (item.purchaseTypeName.indexOf('以销定采') == -1) {
            this.checkAllList.push(item.uuid);
            for (let j = 0; j < item.priList.length; j++) {
              let cItem = item.priList[j];
              this.checkList.push(cItem.uuid);
            }
          // }
        }
      } else {
        this.checkAllList = [];
        this.checkList = [];
      }
    },
    checkArr(originArr, checkArr) {
      let newArr = [];
      for(var i = 0; i < checkArr.length; i++) {
        if(originArr.indexOf(checkArr[i]) > -1){
          newArr.push(checkArr[i]);
        }
      }
      if(newArr.length == checkArr.length) {
        return true;
      }else {
        return false;
      }
    },
    dateValChange(val) {
      // this.beginTime = val[0];
      // this.endTime = val[1];
    },
    searchHandle() {
      // 搜索
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.selectUuidList = [];
      this.multipleSelection = [];  // 勾选项清除
      this.childMultipleSelection = [];  // 勾选子项清除
      this.currentPage = 1;
      this.getPurchaseRequestList();
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    createOrderHandle() {
      // 生成采购订单
      console.log(this.childMultipleSelection);
      this.checkedUuidList = [];
      if (!this.childMultipleSelection.length) {
        this.$message({
          type: "error",
          message: '请选择要生成的采购请求！'
        });
        return;
      }
      for (let i = 0; i < this.childMultipleSelection.length; i++) {
        let item = this.childMultipleSelection[i];
        this.checkedUuidList.push(item.uuid);
      }
      this.getGenerateRequestList();
      this.dialogFormVisible = true;
      this.dialogLoading = true;
      this.popupTitle = '生成采购订单';
      this.isConfirmDisabled = false;
    },
    async saveOrderConfirm() {
      // 生成采购订单对话框确认
      let data = {
        submitType: '1'
      };
      data.paymentMethod = 'period';
      // data.poiList = this.generateRequestList;
      data.saleOrderId = '';
      // data.saleOrderId = this.createPurchaseData.saleOrderId;
      data.applicant = this.$store.state.userName;
      data.applicantName = this.$store.state.realName;
      data.applicantDepartment = this.$store.state.currentDepartment.id;
      data.applicantDepartmentName = this.$store.state.currentDepartment.name;
      data.operateAgentId = this.$store.state.userName;
      data.ownedAgentId = this.$store.state.userName;
      // data.priUuidList = this.checkList;
      this.isConfirmDisabled = true;
      // for (let i = 0; i < this.generateRequestList.length; i++) {
      //   let item = this.generateRequestList[i];
      //   data.poiList = item;
      //   console.log('生成采购订单对话框确认：', data);
      //   setTimeout(this.savePurchaseOrderHandle(data), 500);
      // }
      
      // for (let i in this.generateRequestList) {
      for (let i = 0; i < this.generateRequestList.length; i++) {
        let item = this.generateRequestList[i];
        let priUuidList = [];
        let uuidData = await getUUID();
        if (uuidData.code === '0') {
          data.uuid = uuidData.data;
        }
        data.poiList = this.generateRequestList[i];
        // for (let j in this.generateRequestList[i]) {
        for (let j = 0; j < this.generateRequestList[i].length; j++) {
          let cItem = this.generateRequestList[i][j];
          priUuidList.push(cItem.priUuid);
        }
        data.priUuidList = priUuidList;
        
        if (data.poiList.length >=  1 && data.priUuidList.length >= 1) {
          let promiseRes = await this.savePurchaseOrderHandle(data);
          if (promiseRes.code !== '0') {
            return false;
          } else if (i == this.generateRequestList.length - 1 && promiseRes.code === '0') {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: '操作成功！'
            });
            this.$emit('activeObj', {name: 'order', subName: 'Draft'});
            this.isConfirmDisabled = false;
          }
        }
      }
      this.isConfirmDisabled = false;
    },
    savePurchaseOrderHandle(data) {
      return new Promise(resolve => {
        savePurchaseOrder(data).then(res => {
          // console.log('生成采购订单：', res);
          resolve(res);
          // if (res.code === '0') {
          //   this.dialogFormVisible = false;
          //   this.$message({
          //     type: "success",
          //     message: '操作成功！'
          //   });
          //   this.$emit('activeObj', {name: 'order', subName: 'Draft'});
          //   this.isConfirmDisabled = false;
          // }
        });
      });
    },
    handleSizeChange(val) {
      this.listLoading = true;
      this.pageSize = val;
      this.getPurchaseRequestList();
    },
    handleCurrentChange(val) {
      this.multipleSelection = [];  // 勾选项清除
      this.childMultipleSelection = [];  // 勾选子项清除
      
      this.listLoading = true;
      this.checkAllFlag = false;
      this.checkAllList = [];
      this.checkList = [];
      this.currentPage = val;
      this.getPurchaseRequestList();
    },
    getPurchaseRequestList() {
      // 采购请求列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        materialCode: this.materialCode,
        purchaseType: this.purchaseType,
        prStatus: this.prStatus,
        purchaseRequestCode: this.purchaseRequestCode,
        // supplierName: this.supplierName,
        supplierCode: this.supplierCode,
        requiredQuantityPerPackage: this.specificationsType,
        belongToEv:this.belongToEv,
        mobileGoods:this.mobileGoods,
        sort: 'desc',
        purchaseDeleteStatus: this.purchaseDeleteStatus,
        specialRequire: this.specialRequire,
        saleOrderId: this.saleOrderId
      };
      purchaseRequestList(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购请求列表：', res);
        if (res.code === '0') {
          this.requestList = res.data.records;
          this.total = res.data.total;
          this.requestList.forEach((item, index) => {
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            item.isDisabledPt = (item.purchaseTypeName.indexOf('以销定采') != -1 ? true : false);
          });
          console.log('hahahah',this.requestList);
          this.listLoading = false;
          // this.tableLoading = false;
        } else {
          this.listLoading = false;
          // this.tableLoading = false;
        }
      });
      setTimeout(() => {
        // this.tableLoading = false;
        this.listLoading = false;
      }, 10000);
    },
    getGenerateRequestList() {
      // 生成采购订单列表
      this.generateRequestList = [];
      // searchPurchaseRequest(this.checkList).then(res => {
      searchPurchaseRequest(this.checkedUuidList).then(res => {
        console.log('生成采购请求列表：', res);
        if (res.code === '0') {
          for (var i = 0; i < res.data.length; i++) {
            for (var j = 0; j < res.data[i].length; j++) {
              let data = res.data[i][j];
              getUUID().then(uuidData => {
                if (uuidData.code === '0') {
                  data.uuid = uuidData.data;
                }
              });
              data.priUuid = data.uuid;
              data.prCode = data.purchaseRequestCode;
              data.prType = data.purchaseType;
              data.priSn = data.sn;
              data.prTypeName = data.purchaseTypeName ? data.purchaseTypeName : '';
              data.saleOrderId = data.saleOrderId ? data.saleOrderId : '';
            }
          }
          this.generateRequestList = res.data;
        }
        this.dialogLoading = false;
      });
    },
    getPurchaseType() {
    	purchaserequesttype().then(res => {
        console.log('零剪大货类型：', res);
        if(res.code === '0') {
          this.purchaseTypeList = res.data;
        }
      });
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
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

.purchaserequest {
  .table_part {
    .pagination_wrap {
      margin-top: 20px;
    }
    ul {
      &.childcontentlist {
        height: 60px;
        li {
          line-height: 40px;
          .el-checkbox {
            .el-checkbox__label {
              max-width: 75%;
              vertical-align: middle;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}

</style>
<style>
.purchaserequest .el-tabs--border-card>.el-tabs__content {
  padding: 0;
}
.purchaserequest .el-checkbox-group {
  text-align: left;
}
.purchaserequest .table_part .el-checkbox__input {
  vertical-align: middle;
}
.purchaserequest .table_part .el-checkbox__input.is-disabled+span.el-checkbox__label {
  color: #606266;
}
.purchaserequest .table_part .el-tabs__header {
  margin: 0;
}
.purchaserequest .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #606266;
}
.purchaserequest .table_part .el-tabs .el-tabs__content {
  min-height: 536px;
}
.purchaserequest .el-checkbox .el-checkbox__label {
  max-width: 75%;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.purchaserequest .popup_part .el-dialog__wrapper .el-tabs__content {
  border-bottom: 1px solid #EEEEEE;
}
/* .purchaserequest .popup_part .el-dialog__wrapper .el-dialog__body {
  height: 350px;
} */
.purchaserequest .popup_part .el-dialog__wrapper .el-dialog__body .el-tabs {
  min-height: 300px;
}
</style>