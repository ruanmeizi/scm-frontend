<template>
  <div class="container goodsmanagement">
    <div class="actions_part clearfix">
    	<div class="actions_wrap">
    		<div class="display_ib mr10 mb10">
          <span class="tag">工厂交期：</span>
          <el-date-picker class="mr10"
            v-model="dateVal"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
		    </div>
         <div class="display_ib mr10 mb10">
          <span class="tag">货妥日期：</span>
          <el-date-picker class="mr10"
            v-model="dateValGoodsDuly"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
		    </div>
		    <div class="display_ib mr10 mb10">
          <span class="tag">确认书号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="confirmNumber" placeholder="请输入"></el-input>
		    </div>
		    <div class="display_ib mr10 mb10">
          <span class="tag">物料号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
		    </div>
		    <div class="display_ib mr10 mb10">
          <span class="tag">订单号：</span>
          <el-input class="input_single w200 mr10" v-model.trim="purchaseOrderId" placeholder="请输入"></el-input>
		    </div>
        <div class="inline_block mr10 mb10">
          <span class="tag">供应商：</span>
          <el-select
            class="select_single w200 mr10"
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
          <span class="tag">申请人：</span>
          <el-input class="input_single w200 mr10" v-model.trim="applicantName" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">采购订单类型：</span>
          <el-select class="select_single w200 mr10"
            @change="searchHandle"
            v-model="purchaseOrderType"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in orderTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="actions_btn_wrap down t_right">
        <a class="link inline_block lh36 ml10 mr10" type="primary" @click="exportExcelTemplate">货妥导入模板</a>
        <el-button type="success" @click="VBCExcelImport">导入货妥（VBC版本）</el-button>
        <el-button type="primary" @click="excelDownload">导出Excel</el-button>
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

    <!--<div class="table_part clearfix">
      <el-tabs>
        <Table
          :tableList="orderList"
          :parentData="parentData"
          :childData="childData"
          :tableFieldsList="fieldsList"
          :tableParentFieldsList="parentFieldsList"
          :tableLoading="tableLoading"
          @addItemHandle="addHandle">
        </Table>
      </el-tabs>

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
    </div>-->
    
    <div class="table_part clearfix">
      <el-table
        class="table_list"
        ref="multipleTable"
        v-loading="listLoading"
        :data="orderList"
         row-key="purchaseOrderId"
        :expand-row-keys="expands"
        @row-click="rowClick"
        border
        fit
        stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="actions_wrap mb20 clearfix">
              <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
              <el-button class="fr mr10" type="primary" @click="excelImport">导入货妥（非VBC版本）</el-button>
              <el-button class="fr" type="primary" @click="childBatchDeletion(scope.row)">货妥批量删除</el-button>
            </div>
            <el-table
              class="table_list"
              :ref="'childMultipleTable_' + scope.row.id"
              :data="scope.row.fciList"
              row-key="id"
              @expand-change="expandChange"
              border
              fit
              stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-table
                    class="table_list"
                    :data="scope.row.goodsList"
                    border
                    fit>
                    <el-table-column label="货妥数量">
                      <template slot-scope="{ row }">
                        <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.readyBagQuantity ? row.readyBagQuantity : 0) + '包 ' + (row.packSpecification ? row.packSpecification : 0) + '米/包 ' + (row.readyMeter ? row.readyMeter : 0) + '米' }}</span>
                        <span v-else>{{ (row.readyMeter ? row.readyMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="货妥时间">
                      <template slot-scope="{ row }">
                        {{ row.readyDate }}
                      </template>
                    </el-table-column>
                    <el-table-column label="是否可发运">
                      <template slot-scope="{ row }">
                        {{ row.ableShipments ? '是' : '否' }}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="PO行号">
                <template slot-scope="{ row }">
                  {{ row.purchaseOrderSn }}
                </template>
              </el-table-column>
              <el-table-column label="物料编号">
                <template slot-scope="{ row }">
                  {{ row.materialCode }}
                </template>
              </el-table-column>
              <el-table-column  label="工厂季">
                <template slot-scope="{ row }">
                  {{ row.factorySeason }}
                </template>
              </el-table-column>
              <el-table-column  label="供应商">
                <template slot-scope="{ row }">
                  <!-- {{ row.supplierName }} -->
                  {{ row.supplierShortName }}
                </template>
              </el-table-column>
              <el-table-column  label="确认书号">
                <template slot-scope="{ row }">
                  {{ row.confirmNumber }}
                </template>
              </el-table-column>
                <el-table-column  label="已确认订单数量">
                <template slot-scope="{ row }">
                  <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.confirmPackages?row.confirmPackages  : 0) + '包 ' + (row.confirmQuantityPerPackage? row.confirmQuantityPerPackage: 0) + '米/包 ' + (row.confirmQuantity ? row.confirmQuantity : 0) + '米' }}</span>
                  <span v-else>{{ (row.confirmQuantity ? row.confirmQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="货妥总量">
                <template slot-scope="{ row }">
                  <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.cargoReadyPackagesTotal ? row.cargoReadyPackagesTotal : 0) + '包 ' + (row.cargoReadyQuantityPerPackage ? row.cargoReadyQuantityPerPackage: 0) + '米/包 ' + (row.cargoReadyQuantityTotal ? row.cargoReadyQuantityTotal : 0) + '米' }}</span>
                  <span v-else>{{ (row.cargoReadyQuantityTotal ? row.cargoReadyQuantityTotal : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="工厂交期">
                <template slot-scope="{ row }">
                  {{ row.offeredDate }}
                </template>
              </el-table-column>
              <el-table-column label="首次货妥时间">
                <template slot-scope="{ row }">
                  {{ row.cargoReadyDateRecently }}
                </template>
              </el-table-column>
              <el-table-column label="采购备注">
                <template slot-scope="{ row }">
                  {{ row.purchaseRemark }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{ row, $index }">
                  <el-button class="el-icon-plus" type="primary" circle size="mini" title="新增子项" @click.stop="addHandle($index, row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="订单编号">
          <template slot-scope="{ row }">
            {{ row.purchaseOrderId }}
          </template>
        </el-table-column>
        <el-table-column label="采购订单类型">
          <template slot-scope="{ row }">
            {{ row.purchaseOrderTypeName }}
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
      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    
    <!-- 弹窗 -->
    <div class="add_popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in goodFieldNameList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in goodsList"
              :key="index">
              <li class="w13p" :title="item.materialCode">{{item.materialCode ? item.materialCode : ''}}</li>
              <li class="w14p" :title="item.supplierShortName">{{item.supplierShortName ? item.supplierShortName : ''}}</li>
              <!-- <li class="w14p" :title="item.supplierName">{{item.supplierName ? item.supplierName : ''}}</li> -->
              <li class="w14p" :title="item.offeredDate">{{item.offeredDate ? item.offeredDate : ''}}</li>
              <li class="w14p" :title="item.readyDate">{{item.readyDate ? item.readyDate : ''}}</li>
              <li class="w18p">
              	<div v-if="item.purchaseMeasurementUnit === '米'" :title="(item.readyBagQuantity ? item.readyBagQuantity : '0') + '包 ' + (item.packSpecification ? item.packSpecification : '0') + '米/包 ' + (item.readyMeter ? item.readyMeter : '0') + '米'">
              		{{(item.readyBagQuantity ? item.readyBagQuantity : '0') + '包 '}}
	              	{{(item.packSpecification ? item.packSpecification : '0') + '米/包 '}}
	              	{{(item.readyMeter ? item.readyMeter : '0') + '米'}}
              	</div>
              	<div v-else>
              		<span :title="(item.readyMeter ? item.readyMeter : '0') + item.purchaseMeasurementUnit" v-if="item.purchaseMeasurementUnit!=null&&item.purchaseMeasurementUnit!=''">{{(item.readyMeter ? item.readyMeter : '0') + item.purchaseMeasurementUnit}}</span>
              		<span :title="(item.readyMeter ? item.readyMeter : '0') + '条'" v-else>{{(item.readyMeter ? item.readyMeter : '0') + '条'}}</span>
              	</div>
              </li>
              <li class="w19p">
                <el-checkbox v-model="item.ableShipments"></el-checkbox>
              </li>
              <li class="w6p fr">
                <i class="el-icon-delete" type="primary" title="删除" @click="deleteItem(item.id)"></i>
              </li>
            </ul>
          </div>
          <p class="add_goods_btn" @click="addGoodsItemHandle">
            <i type="primary" class="el-icon-circle-plus" title="添加货妥" style="margin-right: 10px; vertical-align: middle;"></i>添加货妥
          </p>
          <div class="add_goods_warp">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in addGoodFieldNameList" :key="index">
                <span class="red mr5" v-if="item.isRules">*</span>
                {{item.name}}
              </li>
            </ul>
            <div class="allparentlist" v-if="allAddData.cargoReadyListDtoList.length">
              <ul
                class="childcontentlist"
                v-for="(item, index) in allAddData.cargoReadyListDtoList"
                :key="index">
                <li class="w50p t_center">
                	<div v-if="item.purchaseMeasurementUnit == '米'">
                		<el-input-number
	                    class="w100"
	                    size="small"
                      precision="2"
	                    v-model="item.readyBagQuantity"
	                    controls-position="right"
	                    @change="packagesChange"></el-input-number>
	                  <span class="w40 display_ib">包</span>
	                  <span class="display_ib">{{item.confirmQuantityPerPackage}}米/包</span>&nbsp;
	                  <span class="meters display_ib" :title="parseFloat(item.readyBagQuantity) * parseFloat(item.confirmQuantityPerPackage) ? parseFloat(item.readyBagQuantity) * parseFloat(item.confirmQuantityPerPackage) : 0">{{ parseFloat(item.readyBagQuantity) * parseFloat(item.confirmQuantityPerPackage) ? parseFloat(item.readyBagQuantity) * parseFloat(item.confirmQuantityPerPackage) : 0 }}</span>米
                	</div>
                  <div v-else>
                  	<el-input-number
	                    class="w100"
	                    size="small"
                      :precision="item.purchaseMeasurementUnit == '公斤' ? 2 : 0"
	                    v-model="item.readyMeter"
	                    controls-position="right"
	                    @change="packagesChange"
	                    :min="0"></el-input-number>
	                  <span class="w40 display_ib">{{item.purchaseMeasurementUnit ? item.purchaseMeasurementUnit : '条'}}</span>
                  </div>
                </li>
                <li class="w20p t_center">
                  <el-date-picker
                    class="w200"
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="item.readyDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </li>
                <li class="w20p">
                  <el-checkbox v-model="item.ableShipments"></el-checkbox>
                </li>
                <li class="w10p fr" @click="deleteGoodItem(item.uuid)">
                  <i class="el-icon-remove v_middle mr10" type="primary" title=""></i>
                </li>
              </ul>
            </div>
            <div class="empty_wrap" v-else>
              <img class="empty_img" src="../../../assets/image/add.png" />
              <p>信息空空如也去添加</p>
            </div>
          </div>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" v-preventReClick @click="submitAddHandle('submit')">提交货妥</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="import_popup_part">
      <el-dialog
        title="导入货妥"
        v-loading="editPartLoading"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="importDialogFormVisible">
        <upload-excel-component :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />

        <div class="table_block clearfix mt30 mb30" v-for="(item, index) in importCargoReadyList" :key="index">
          <span class="tag inline_block blod mb10">订单编号：{{ item.purchaseOrderId }}</span>
          <!-- <span class="tag inline_block blod mb10 ml20">订单行号：{{ item.sn }}</span> -->
          <el-table
            class="table_list"
            ref="multipleTable"
            :data="item.poiList"
            border
            fit>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  :data="scope.row.readyList"
                  border
                  fit
                  :row-class-name="tableRowClassName">
                  <el-table-column label="确认书号">
                    <template slot-scope="{ row }">
                      {{ row.confirmNumber }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="物料编号">
                    <template slot-scope="{ row }">
                      {{ row.materialCode }}
                    </template>
                  </el-table-column> -->
                  <el-table-column label="货妥数量">
                    <template slot-scope="{ row }">
                      <span v-if="row.purchaseMeasurementUnit === '米'">{{ (row.readyBagQuantity ? row.readyBagQuantity : '0') + '包 ' + (row.confirmQuantityPerPackage ? row.confirmQuantityPerPackage : '0') + '米/包 ' + (parseFloat(row.readyBagQuantity) * parseFloat(row.confirmQuantityPerPackage) ? parseFloat(row.readyBagQuantity) * parseFloat(row.confirmQuantityPerPackage) : '0') + '米' }}</span>
                      <span v-else>{{ (row.readyMeter ? row.readyMeter : '0') + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="货妥时间">
                    <template slot-scope="{ row }">
                      {{ row.readyDate }}
                    </template>
                  </el-table-column>
                  <el-table-column label="是否可发运">
                    <template slot-scope="{ row }">
                      {{ row.ableShipments ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="{ row }">
                      {{ row.isAdd == 'Y' ? '计划新增' : '已有' }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="PO行号">
              <template slot-scope="{ row }">
                {{ row.purchaseOrderSn }}
              </template>
            </el-table-column>
            <el-table-column label="物料编号">
              <template slot-scope="{ row }">
                {{ row.materialCode }}
              </template>
            </el-table-column>
            <el-table-column label="工厂交期">
              <template slot-scope="{ row }">
                {{ row.offeredDate }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <el-button class="el-icon-plus" type="success" circle size="mini" title="新增货妥" @click.stop="submitAddHandle('import', $index, row)"></el-button>
                <!-- <el-button class="el-icon-plus" type="success" circle size="mini" title="新增货妥" @click.stop="importItemSubmitHandle($index, row)"></el-button> -->
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-button class="fr mt10" type="primary" v-preventReClick @click.stop="importItemSubmitHandle(item)">提交货妥</el-button> -->
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="success" v-preventReClick :disabled="importSubmitDisabled" @click.stop="importSubmitHandle">批量新增货妥</el-button>
        </div>
      </el-dialog>
    </div>
    

    <!--批量删除货妥-->
		<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
			<span>确定删除该批货妥记录 ?</span>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogdelVisible = false">取 消</el-button>
		    <el-button type="primary"  @click="delVisibleclick()" v-preventReClick>确 定</el-button>
		  </span>
		</el-dialog>
    
  </div>
</template>

<script>
import {
  supplierDictList
} from "@/api/publicApi.js";
import {
  purchaseOrderList,
  searchPurchaseRequestItem,
  purchasegetuuid,
  searchPurchaseOrderList,
  purchaseGoodsList,
  addPurchaseGoodsList,
  cargoReadyList,
  deletePurchaseGoodsList,
  constDictList,
  searchPOCodeByConfirmNumber,
  searchPOItemByPOAndMaterial,
  searchCargoReadyByPO,
  searchFCUUIDByPOCN,
  getBatchDeletion
} from "@/api/module/purchaseApi.js";
import { timeFormat, timeFormatGMT, excelDateFormatToDate, getTimeRange} from '@/utils/index.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
export default {
  name: "goodsmanagement",
  data() {
    return {
    	 // Tabble组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: true,
      selectUuidList: [],
      factoryDelivery:'',
      applicantName:'',
      batchDeletionId:'',//货妥批量删除id
      tableLoading: true,
      type: '',
      dateVal: '',
      dateValGoodsDuly:'',
      confirmNumber: '',
      materialCode: '',
      requestCode: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      supplierCode: '',
      supplierList: [],
      uuid: '',
      productCode: '',
      purchaseType: '',
      prStatus: '',
      purchaseRequestCode: '',
      purchaseRequestName: '',
      orderList: [],
      editOrderData: {},
      generateRequestList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      checkList: [],
      popupTitle: '',
      checkPopupTitle: '',
      dialogFormVisible: false,
      importDialogFormVisible: false,
      dialogdelVisible:false,
      addPackages: '',
      addPerPackage: '',
      addQuantity: '',
      addData: {},
      isSubmitDisabled: false,
      purchaseOrderType: '',
      orderTypeList: [],
      allAddData: {
        cargoReadyListDtoList: []
      },
      goodsList: [],
      goodsItem: {},
      expands:[],
      // isVerifyCont: false,
      // isVerifyDate: false,

      // 导入
      editPartLoading: false,
      importCargoReadyList: [],
      importSubmitDisabled: true,

      fieldsList: [
        {
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '工厂季',
          class: 'w9p'
        },
        {
          name: '供应商',
          class: 'w11p'
        },
        {
          name: '确认书号',
          class: 'w11p'
        },
        {
          name: '已确认订单数量',
          class: 'w12p'
        },
        {
          name: '货妥数量',
          class: 'w9p'
        },
        {
          name: '工厂交期',
          class: 'w9p'
        },
        {
          name: '货妥时间',
          class: 'w9p'
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '订单编号',
          class: 'w12p'
        },
        {
          name: '请求类型',
          class: 'w8p'
        },
        {
          name: '创建时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        }
      ],
      goodFieldNameList: [
        {
          name: '物料编号',
          class: 'w13p'
        },
        {
          name: '供应商',
          class: 'w14p'
        },
        {
          name: '工厂交期',
          class: 'w14p'
        },
        {
          name: '货妥时间',
          class: 'w14p'
        },
        {
          name: '货妥数量',
          class: 'w18p'
        },
        {
          name: '是否可发运',
          class: 'w19p'
        }
      ],
      addGoodFieldNameList: [
        {
          name: '货妥数量',
          class: 'w50p',
          isRules: true
        },
        {
          name: '货妥时间',
          class: 'w20p',
          isRules: true
        },
        {
          name: '是否可发运',
          class: 'w20p'
        }
      ],
      parentData: {
        status: '',
        data: [
          {
            name: '创建时间',
            field: 'createTime',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '申请人',
            field: 'applicantName',
            class: 'w4p',
            isShowTit: true
          },
          {
            name: '订单编号',
            field: 'purchaseOrderId',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '请求类型',
            field: 'purchaseOrderTypeName',
            class: 'w8p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '',
            field: '',
            class: 'fr mr15',
            isShowTit: false,
            isUpDown: true
          },
          {
            name: '',
            field: '',
            class: 'fr',
            isShowTit: false,
          }
        ]
      },
      childData: {
        name: 'fciList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w9p'
          },
          {
            name: '',
            field: 'factorySeason',
            class: 'w9p'
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w11p'
          },
          {
            name: '',
            field: 'confirmNumber',
            class: 'w11p'
          },
          {
            name: '',
            field_1: 'confirmPackages',
            field_2: 'confirmQuantityPerPackage',
            field_3: 'confirmQuantity',
            field: 'confirmQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w12p',
            isQuantityField: true
          },
          {
            name: '',
            field_1: 'cargoReadyPackagesTotal',
            field_2: 'cargoReadyQuantityPerPackage',
            field_3: 'cargoReadyQuantityTotal',
            field: 'cargoReadyQuantityTotal',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w9p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'offeredDate',
            class: 'w9p'
          },
          {
            name: '',
            field: 'cargoReadyDateRecently',
            class: 'w9p'
          },
          {
            name: '',
            class: 'w8p',
            isAction: true
          },
         
        ]
      },
    };
  },
  components: {
    Table,
    UploadExcelComponent
  },
  created() {},
  mounted() {
    this.getSupplierDictList();
    this.getPurchaseOrderType();
    // this.getPurchaseOrderList();
    this.fun_date();
  },
  watch: {},
  methods: {
    async expandChange(row, expandedRows) {
      let fIndex = null;
      let cIndex = null;
      // this.goodsList = [];
      // this.getGoodsList(row.uuid);
      this.orderList.forEach((item, i) => {
        item.fciList.forEach((cItem, cI) => {
          if (cItem.uuid === row.uuid) {
            fIndex = i;
            cIndex = cI;
          }
        });
      });
      // 货妥列表
      await purchaseGoodsList(row.uuid).then(res => {
        console.log('货妥列表：', res);
        if (res.code === '0') {
          row.goodsList = res.data;
          this.$set(this.orderList[fIndex].fciList[cIndex], cIndex, row);
        }
      });
    },
    // 固定展示为两周后的时间范围
    fun_date(){
      this.dateVal=getTimeRange(14);
      this.dateValGoodsDuly=getTimeRange(14);
      this.searchHandle();
    },
    rowClick(row, event, column){
      //单击事件
      console.log(row,event,column);
      Array.prototype.remove = function (val) {
        console.log(val)
          let index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      if (this.expands.indexOf(row.purchaseOrderId) < 0) {
          this.expands.push(row.purchaseOrderId);
      }else {
          this.expands.remove(row.purchaseOrderId);
      }
    },
    exportExcelTemplate() {
      // 导出货妥Excel模板
      const headerList = ['Customer', '物料编号', '确认书号', '货妥时间', '货妥数量包数', '货妥数量规格', '货妥数量', '最新货妥时间', '是否可发运', 'PO单号', 'PO行号', '新增', '已妥总量', 'Your Quality'];
      const data = [['JILIN', 'ZDFH-MLWL01', 'nn123123111', '2020/10/27', '1', '50', '50', 'Pronta/Ready', '是', 'PO2020101000013', '1', 'N', '50', '1000080']];
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headerList, //Header Required
          data, //Specific data Required
          filename: '货妥导入模板', //Optional
          autoWidth: true, //Optional
          bookType: 'xlsx' //Optional
        })
      });
    },
    VBCExcelImport() {
      // VBC导入货妥
      this.importCargoReadyList = [];
      this.importDialogFormVisible = true;
      this.importSubmitDisabled = true;
    },
    excelImport() {
      // 非VBC导入货妥
      this.importCargoReadyList = [];
      this.importDialogFormVisible = true;
      this.importSubmitDisabled = true;
    },
    tableRowClassName({row, rowIndex}) {
      // 表格内容 highlight
      if (row.isAdd === 'N') {
        return 'warning-row';
      }
      return '';
    },
    // Upload Edit
    importExcelBeforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        this.editPartLoading = true;
        return true;
      };
      this.$message({
        message: '请不要上传大于1m的文件！',
        type: 'error'
      });
      return false;
    },
    async importExcelSuccess({ results, header }) {
      console.log('导入货妥数据：', results, header);
      let importList = [];
      let poList = [];
      let confirmNumberList = [];  // 确认书号列表
      // let purchaseOrderIdList = [];  // PO单号列表
      let poSnList = [];  // PO单号列表
      for (let i = 0; i < results.length; i++) {
        let item = results[i];
        let rData = {
          confirmNumber: '',
          materialCode: '',
          readyBagQuantity: '',  // 货妥数量包数
          confirmQuantityPerPackage: '',  // 货妥数量规格
          readyMeter: '',  // 货妥数量总量
          readyDate: '',  // 货妥时间
          ableShipments: '',  // 是否可发运
          purchaseOrderId: '',  // PO单号
          sn: '',  // PO行号
          isAdd: '',  // 新增
          cargoReadyQuantityTotal: '',  // 已妥总量
        };
        Object.keys(item).map((key) => {
          console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
          if (key == '确认书号') {
            confirmNumberList.push(item[key]);
            rData.confirmNumber = item[key];
          } else if (key == '物料编号') {
            rData.materialCode = item[key];
          } else if (key == '货妥数量包数') {
            rData.readyBagQuantity = item[key];
          } else if (key == '货妥数量规格') {
            rData.confirmQuantityPerPackage = item[key];
          } else if (key == '货妥数量') {
            rData.readyMeter = item[key];
          } else if (key == '货妥时间') {
            rData.readyDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
          } else if (key == '最新货妥时间') {
            rData.newReadyDate = item[key];
          } else if (key == '是否可发运') {
            rData.ableShipments = item[key] == '是' ? true : false;
          } else if (key == 'PO单号') {
            rData.purchaseOrderId = item[key];
            // purchaseOrderIdList.push(item[key]);
          } else if (key == 'PO行号') {
            rData.sn = item[key];
            poSnList.push(item[key]);
          } else if (key == '新增') {
            rData.isAdd = item[key];
          } else if (key == '已妥总量') {
            rData.cargoReadyQuantityTotal = item[key];
          } else if (key == 'Your Quality') {
            rData.quality = item[key];
          }
        });
        importList.push(rData);
      }

      // purchaseOrderIdList = [...new Set(purchaseOrderIdList)];
      for (let i = 0; i < importList.length; i++) {
        let item = importList[i];
        if (!item.purchaseOrderId) {
          this.$message({
            message: `${item.confirmNumber}` + '确认书号无关联的PO单号！',
            type: 'error'
          });
        }
        let fcParams = {
          confirmNum: item.confirmNumber,
          poId: item.purchaseOrderId,
          sn: item.sn
        };
        await searchFCUUIDByPOCN(fcParams).then(res => {
          // console.log('货妥确认书号UUID：', res);
          if (res.code === '0') {
            if (res.data) {
              item.factoryConfirmUuid = res.data.uuid;
              item.factorySeasonal = res.data.factorySeason;
              item.orderBagQuantity = res.data.offeredPackages;
              item.orderMeter = res.data.offeredQuantity;
              item.packSpecification = res.data.offeredQuantityPerPackage;
              item.confirmingCode = res.data.confirmNumber;
              item.inventory = res.data.virtualInventoryId;
              purchasegetuuid().then(uuidData => {
                if (uuidData.code == '0') {
                  item.uuid = uuidData.data;
                }
              });
              // item.confirmNumber = res.data.confirmNumber;
              // item.offeredDate = res.data.offeredDate;
              item = Object.assign(item, res.data);
               console.log(item)
            } else {
              item.factoryConfirmUuid = '';
            }
          }
        });
        
        if (item.purchaseOrderId) {
          let params = {
            purchaseOrderId: item.purchaseOrderId
          };
          await searchCargoReadyByPO(params).then(res => {
            console.log('查出采购订单和订单下所有货妥清单：', res);
            if (res.code === '0' && res.data) {
              if (res.data.poiList && res.data.poiList.length) {
                if (this.clearDuplicateVal(poList, item.purchaseOrderId, 'purchaseOrderId') == -1) {
                  // 货妥列表中不存在当前键值（订单编号），新增此订单编号及子项数据
                  let poData = {
                    purchaseOrderId: '',
                    poiList: []
                  };
                  let poiData = {
                    materialCode: '',
                    purchaseOrderId: '',
                    purchaseOrderSn: '',
                    offeredDate: '',
                    readyList: []
                  };
                  poData.purchaseOrderId = item.purchaseOrderId;
                  poiData.purchaseOrderId = item.purchaseOrderId;
                  poiData.materialCode = item.materialCode;
                  poiData.purchaseOrderSn = item.sn;
                  poiData.offeredDate = item.offeredDate;
                  poiData.readyList.push(item);
                  for (let m = 0; m < res.data.poiList.length; m++) {
                    if (res.data.poiList[m].purchaseOrderId == item.purchaseOrderId && res.data.poiList[m].purchaseOrderSn == item.sn && res.data.poiList[m].materialCode == item.materialCode) {
                      // 定位到PO项
                      for (let n = 0; n < res.data.poiList[m].confirmList.length; n++) {
                        let confirmItem = res.data.poiList[m].confirmList[n];
                        if (confirmItem.readyList || confirmItem.readyList.length) {
                          for (let k = 0; k < confirmItem.readyList.length; k++) {
                            let crItem = confirmItem.readyList[k];
                            crItem.isAdd = 'N';
                            crItem.confirmNumber = crItem.confirmingCode;
                            crItem.confirmQuantityPerPackage = confirmItem.confirmQuantityPerPackage;
                            poiData.readyList.push(crItem);
                          }
                        }
                      }
                    }
                  }
                  poData.poiList.push(poiData);
                  poList.push(poData);
                } else {
                  // 存在当前订单编号
                  poList.forEach(poItem => {
                    console.log('存在当前订单编号：', poItem);
                    if (poItem.purchaseOrderId == item.purchaseOrderId) {
                      for (let j = 0; j < poItem.poiList.length; j++) {
                        let poiItem = poItem.poiList[j];
                        if (poiItem.purchaseOrderSn == item.sn && poiItem.materialCode == item.materialCode) {
                          // 匹配到行号和物料编号
                          poiItem.readyList.push(item);
                        } else {
                          let poiData = {
                            materialCode: '',
                            purchaseOrderId: '',
                            purchaseOrderSn: '',
                            offeredDate: '',
                            readyList: []
                          };
                          poiData.purchaseOrderId = item.purchaseOrderId;
                          poiData.materialCode = item.materialCode;
                          poiData.purchaseOrderSn = item.sn;
                          poiData.offeredDate = item.offeredDate;
                          poiData.readyList.push(item);
                          poItem.poiList.push(poiData);
                        }
                      }
                    }
                  });
                }
                
              }
            }
          });
        }
      }
      this.importCargoReadyList = poList;
      this.importSubmitDisabled = false;
      this.editPartLoading = false;
      setTimeout(() => {
        this.editPartLoading = false;
      }, 10000);
    },

    // NEW IMPORT
    // async importExcelSuccess({ results, header }) {
    //   console.log('导入货妥数据：', results, header);
    //   let importList = [];
    //   let poList = [];
    //   let confirmNumberList = [];  // 确认书号列表
    //   // let purchaseOrderIdList = [];  // PO单号列表
    //   for (let i = 0; i < results.length; i++) {
    //     let item = results[i];
    //     let rData = {
    //       confirmNumber: '',
    //       materialCode: '',
    //       readyBagQuantity: '',  // 货妥数量包数
    //       confirmQuantityPerPackage: '',  // 货妥数量规格
    //       readyMeter: '',  // 货妥数量总量
    //       readyDate: '',  // 货妥时间
    //       ableShipments: '',  // 是否可发运
    //       purchaseOrderId: '',  // PO单号
    //       sn: '',  // PO行号
    //       isAdd: '',  // 新增
    //       cargoReadyQuantityTotal: '',  // 已妥总量
    //     };
    //     Object.keys(item).map((key) => {
    //       console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
    //       if (key === '确认书号') {
    //         confirmNumberList.push(item[key]);
    //         rData.confirmNumber = item[key];
    //       } else if (key === '物料编号') {
    //         rData.materialCode = item[key];
    //       } else if (key === '货妥数量包数') {
    //         rData.readyBagQuantity = item[key];
    //       } else if (key === '货妥数量规格') {
    //         rData.confirmQuantityPerPackage = item[key];
    //       } else if (key === '货妥数量') {
    //         rData.readyMeter = item[key];
    //       } else if (key === '货妥时间') {
    //         rData.readyDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
    //       } else if (key === '最新货妥时间') {
    //         rData.newReadyDate = item[key];
    //       } else if (key === '是否可发运') {
    //         rData.ableShipments = item[key] === '是' ? true : false;
    //       } else if (key === 'PO单号') {
    //         rData.purchaseOrderId = item[key];
    //         // purchaseOrderIdList.push(item[key]);
    //       } else if (key === 'PO行号') {
    //         rData.sn = item[key];
    //       } else if (key === '新增') {
    //         rData.isAdd = item[key];
    //       } else if (key === '已妥总量') {
    //         rData.cargoReadyQuantityTotal = item[key];
    //       } else if (key === 'Your Quality') {
    //         rData.quality = item[key];
    //       }
    //     });
    //     importList.push(rData);
    //   }

    //   console.log('导入数据集合：', importList);
    //   // purchaseOrderIdList = [...new Set(purchaseOrderIdList)];

    //   for (let i = 0; i < importList.length; i++) {
    //     let item = importList[i];
    //     if (!item.purchaseOrderId) {
    //       this.$message({
    //         message: `${item.confirmNumber}` + '确认书号无关联的PO单号！',
    //         type: 'error'
    //       });
    //     }
    //     let fcParams = {
    //       confirmNum: item.confirmNumber,
    //       poId: item.purchaseOrderId,
    //       sn: item.sn
    //     };
    //     await searchFCUUIDByPOCN(fcParams).then(res => {
    //       // console.log('货妥确认书号UUID：', res);
    //       if (res.code === '0') {
    //         if (res.data) {
    //           item.factoryConfirmUuid = res.data.uuid;
    //           item.factorySeasonal = res.data.factorySeason;
    //           item.orderBagQuantity = res.data.offeredPackages;
    //           item.orderMeter = res.data.offeredQuantity;
    //           item.packSpecification = res.data.offeredQuantityPerPackage;
    //           item.confirmingCode = res.data.confirmNumber;
    //           item.inventory = res.data.virtualInventoryId;
    //           purchasegetuuid().then(uuidData => {
    //             if (uuidData.code == '0') {
    //               item.uuid = uuidData.data;
    //             }
    //           });
    //           // item.confirmNumber = res.data.confirmNumber;
    //           // item.offeredDate = res.data.offeredDate;
    //           item = Object.assign(item, res.data);
    //         } else {
    //           item.factoryConfirmUuid = '';
    //         }
    //       }
    //     });
        
    //     if (item.purchaseOrderId) {
    //       let params = {
    //         purchaseOrderId: item.purchaseOrderId
    //       };
    //       await searchCargoReadyByPO(params).then(res => {
    //         console.log('查出采购订单和订单下所有货妥清单：', res);
    //         if (res.code === '0' && res.data) {
    //           if (res.data.poiList && res.data.poiList.length) {
    //             if (this.clearDuplicateVal(poList, item.purchaseOrderId, 'purchaseOrderId') == -1) {
    //               // 货妥列表中不存在当前键值（订单编号），新增此订单编号及子项数据
    //               console.log('货妥列表中不存在当前键值（订单编号），新增此订单编号及子项数据');
    //               let poData = {
    //                 purchaseOrderId: '',
    //                 poiList: []
    //               };
    //               let poiData = {
    //                 materialCode: '',
    //                 purchaseOrderId: '',
    //                 purchaseOrderSn: '',
    //                 offeredDate: '',
    //                 readyList: []
    //               };
    //               poData.purchaseOrderId = item.purchaseOrderId;
    //               poiData.purchaseOrderId = item.purchaseOrderId;
    //               poiData.materialCode = item.materialCode;
    //               poiData.purchaseOrderSn = item.sn;
    //               poiData.offeredDate = item.offeredDate;
    //               poiData.readyList.push(item);
    //               for (let m = 0; m < res.data.poiList.length; m++) {
    //                 if (res.data.poiList[m].purchaseOrderId == item.purchaseOrderId && res.data.poiList[m].purchaseOrderSn == item.sn && res.data.poiList[m].materialCode == item.materialCode) {
    //                   // 定位到PO项
    //                   for (let n = 0; n < res.data.poiList[m].confirmList.length; n++) {
    //                     let confirmItem = res.data.poiList[m].confirmList[n];
    //                     if (confirmItem.readyList || confirmItem.readyList.length) {
    //                       for (let k = 0; k < confirmItem.readyList.length; k++) {
    //                         let crItem = confirmItem.readyList[k];
    //                         crItem.isAdd = 'N';
    //                         crItem.confirmNumber = crItem.confirmingCode;
    //                         crItem.confirmQuantityPerPackage = confirmItem.confirmQuantityPerPackage;
    //                         poiData.readyList.push(crItem);
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //               poData.poiList.push(poiData);
    //               poList.push(poData);
    //               console.log('poList列表：', poList);
    //               return false;
    //             } else {
    //               // 存在当前订单编号
    //               console.log('存在当前订单编号');
    //               poList.forEach(poItem => {
    //                 console.log('存在当前订单编号：', poItem);
    //                 if (poItem.purchaseOrderId == item.purchaseOrderId) {
    //                   for (let j = 0; j < poItem.poiList.length; j++) {
    //                     let poiItem = poItem.poiList[j];
    //                     if (poiItem.purchaseOrderSn == item.sn && poiItem.materialCode == item.materialCode) {
    //                       // 匹配到行号和物料编号
    //                       poiItem.readyList.push(item);
    //                     } else {
    //                       let poiData = {
    //                         materialCode: '',
    //                         purchaseOrderId: '',
    //                         purchaseOrderSn: '',
    //                         offeredDate: '',
    //                         readyList: []
    //                       };
    //                       poiData.purchaseOrderId = item.purchaseOrderId;
    //                       poiData.materialCode = item.materialCode;
    //                       poiData.purchaseOrderSn = item.sn;
    //                       poiData.offeredDate = item.offeredDate;
    //                       poiData.readyList.push(item);
    //                       // poItem.poiList.push(poiData);
    //                     }
    //                   }
    //                 }
    //               });
    //               // console.log('存在当前订单编号poList列表：', poList);
    //             }
    //           }
    //         }
    //       });
    //     }
    //   }
    //   this.importCargoReadyList = poList;
    //   this.importSubmitDisabled = false;
    //   this.editPartLoading = false;
    //   setTimeout(() => {
    //     this.editPartLoading = false;
    //   }, 10000);
    // },
    // NEW IMPORT END

    clearDuplicateVal(array, val, field) {
      var index = array.findIndex(item => item[field] == val);
      return index;  // -1 说明array中不存在id为val的对象
    },
    // async importItemSubmitHandle(index, item) {
    //   // 提交导入项货妥数据
    //   console.log('货妥导入单向数据：', item);
    //   this.allAddData.cargoReadyListDtoList = item.readyList;
    //   this.allAddData.applicant = this.$store.state.userName;
    //   this.allAddData.applicantName = this.$store.state.realName;
    //   this.allAddData.applicantDepartment = this.$store.state.currentDepartment.id;
    //   this.allAddData.applicantDepartmentName = this.$store.state.currentDepartment.name;
    //   this.importSubmitDisabled = true;
    //   await addPurchaseGoodsList(this.allAddData).then(res => {
    //     console.log('提交新增货妥列表：', res);
    //     if (res.code === '0') {
    //       this.importSubmitDisabled = false;
    //       this.$message({
    //         type: 'success',
    //         message: '添加货妥成功！'
    //       });
    //       this.getPurchaseOrderList();
    //     }
    //     this.importSubmitDisabled = false;
    //   });
    // },
    async importSubmitHandle() {
      // 批量提交货妥
      console.log('批量提交货妥列表：', this.importCargoReadyList);
      for (let i = 0; i < this.importCargoReadyList.length; i++) {
        let icrItem = this.importCargoReadyList[i];
        for (let j = 0; j < icrItem.poiList.length; j++) {
          let poiItem = icrItem.poiList[j];
          let list = poiItem.readyList || poiItem.readyList.length ? JSON.parse(JSON.stringify(poiItem.readyList)) : [];
          list = list || list.length ? list.filter(x => { return x.isAdd == 'Y' }) : [];
          for (let m = 0; m < list.length; m++) {
            let item = list[m];
            if(item.purchaseMeasurementUnit == '米'){
              if (!item.readyBagQuantity || !item.confirmQuantityPerPackage) {
                this.$message({
                  type: 'error',
                  message: '请完善货妥数量！'
                });
                return false;
              }
            }else{
              if (!item.readyMeter) {
                this.$message({
                  type: 'error',
                  message: '请完善货妥数量！'
                });
                return false;
              }
            }
            if(item.purchaseMeasurementUnit == '米'){
              item.readyMeter = parseFloat(item.readyBagQuantity) * parseFloat(item.confirmQuantityPerPackage);
            }
            if (item.readyMeter.toString().indexOf('.') !== -1) {
              let arr = item.readyMeter.toString().split('.');
              if (arr[0].length > 8) {
                this.$message({
                  message: '货妥数量米数仅支持整数位8位，请重新输入！',
                  type: 'error'
                });
                return false;
              }
              if (arr[1].length > 2) {
                this.$message({
                  message: '货妥数量米数仅支持小数位2位，请重新输入！',
                  type: 'error'
                });
                return false;
              }
            } else if (item.readyMeter.toString().length > 8) {
              this.$message({
                message: '货妥数量米数仅支持整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (!item.readyDate) {
              this.$message({
                type: 'error',
                message: '请输入货妥日期！'
              });
              return false;
            }
            item.packSpecification = item.confirmQuantityPerPackage;
            // if (item.readyDate.toString().indexOf('-') == -1) {
            //   item.readyDate = timeFormatGMT(item.readyDate);
            // }
          }
          this.allAddData.cargoReadyListDtoList = list;
          this.allAddData.applicant = this.$store.state.userName;
          this.allAddData.applicantName = this.$store.state.realName;
          this.allAddData.applicantDepartment = this.$store.state.currentDepartment.id;
          this.allAddData.applicantDepartmentName = this.$store.state.currentDepartment.name;
          this.importSubmitDisabled = true;
          await addPurchaseGoodsList(this.allAddData).then(res => {
            console.log('提交新增货妥列表：', res);
            if (res.code === '0') {
              this.importSubmitDisabled = false;
              this.$message({
                type: 'success',
                message: '添加货妥成功！'
              });
              this.getPurchaseOrderList();
            }
            this.importSubmitDisabled = false;
            this.importDialogFormVisible = false;
          });
        }
      }
    },

    excelDownload() {
      let headerList = [];
      let fieldsList = ['purchaseOrderId', 'purchaseOrderTypeName', 'createTime', 'applicantName'];
      this.parentFieldsList.forEach(hItem => {
        headerList.push(hItem.name);
      });
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.orderList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '货妥管理',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelDownload(item) {
      let headerList = ['PO单号', 'PO行号', '物料编号', '确认书号', '货妥时间', '货妥数量包数', '货妥数量规格', '货妥数量', '是否可发运', '供应商', '已确认订单数量', '工厂交期', '采购备注', '新增'];
      let fieldList = ['purchaseOrderId', 'purchaseOrderSn', 'materialCode', 'confirmNumber', 'cargoReadyDateRecently', 'cargoReadyPackagesTotal', 'cargoReadyQuantityPerPackage', 'cargoReadyQuantityTotal', 'ableShipmentsName', 'supplierShortName', 'confirmQuantity', 'offeredDate', 'purchaseRemark', 'isImportAdd'];
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.fciList;
        const data = this.formatJson(fieldList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.purchaseOrderId,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    childBatchDeletion(item){
      //货妥批量删除
     console.log(item);
     this.batchDeletionId=item.purchaseOrderId;
     this.dialogdelVisible=true;
    },
    delVisibleclick(){
      console.log("确认");
     //货妥确认删除
      getBatchDeletion(this.batchDeletionId).then(res => {
        if (res.code == '0') {
          this.$message({
            type: 'success',
            message: '已完成删除操作！'
          });
          this.dialogdelVisible=false;
          this.getPurchaseOrderList();
        }
      });
    },
    purchaseTypeHandle(purchaseType) {
      switch (purchaseType) {
        case 'BusinessAttire':
          return '职业装';
        case 'ZeroShear':
          return '零剪';
        default:
          break;
      }
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
      if (this.dateValGoodsDuly) {
        this.cargoReadyBeginTime = this.dateValGoodsDuly[0];
        this.cargoReadyEndTime = this.dateValGoodsDuly[1];
      } else {
        this.cargoReadyBeginTime = '';
        this.cargoReadyEndTime = '';
      }
      this.currentPage = 1;
      this.getPurchaseOrderList();
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    addHandle(index, item) {
      // 增加采购订单子项
      // this.getSearchOrderList(item.id);
      console.log(item);
      if (item[index]) {
        delete item[index];
      }
      this.goodsItem = item;
      this.isSubmitDisabled = true;
      this.allAddData.cargoReadyListDtoList = [];
      // let uuidData = purchasegetuuid();
      // if (uuidData.code == '0') {
      //   this.addData.uuid = uuidData.data;
      // }
      // purchasegetuuid().then(uuidData => {
      //   if (uuidData.code == '0') {
      //     this.addData.uuid = uuidData.data;
      //   }
      // });
      
      this.addData = item;
      this.addData.ableShipments = true;
      this.addData.poiId = item.id;
      this.addData.factorySeasonal = item.factorySeason ? item.factorySeason : '';
      this.addData.orderBagQuantity = item.offeredPackages ? item.offeredPackages : '0';
      this.addData.orderMeter = item.offeredQuantity ? item.offeredQuantity : '0';
      this.addData.packSpecification = item.cargoReadyQuantityPerPackage ? item.cargoReadyQuantityPerPackage : 0;
      this.addData.readyBagQuantity = '';
      this.addData.readyMeter = '';
      this.addData.confirmingCode = item.confirmNumber ? item.confirmNumber : '';
      this.addData.confirmingNumMeter = item.confirmQuantityTotal ? item.confirmQuantityTotal : '';
      this.addData.inventory = item.virtualInventoryId ? item.virtualInventoryId : '';
      this.addData.readyDate = item.offeredDate ? item.offeredDate : '';  // 进来默认工厂交期
      this.addData.factoryConfirmUuid = item.uuid;
      this.getGoodsList(item.uuid);
      this.popupTitle = '货妥历史记录';
      this.dialogFormVisible = true;
    },
    addGoodsItemHandle() {
      console.log('新增货妥记录：', this.addData);
      let addDataCopy = JSON.parse(JSON.stringify(this.addData));
      // let uuidData = purchasegetuuid();
      // console.log('addData: ', this.addData);
      // console.log('addDataCopy: ', addDataCopy);
      // if (uuidData.code == '0') {
      //   addDataCopy.uuid = uuidData.data;
      //   this.allAddData.cargoReadyListDtoList.push(addDataCopy);
      //   console.log(this.allAddData.cargoReadyListDtoList);
      // }
      purchasegetuuid().then(uuidData => {
        if (uuidData.code == '0') {
          addDataCopy.uuid = uuidData.data;
          this.allAddData.cargoReadyListDtoList.push(addDataCopy);
          console.log(this.allAddData.cargoReadyListDtoList);
          this.isSubmitDisabled = false;
        }
      });
    },
    deleteItem(id) {
      this.$confirm('确认删除此条订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePurchaseGoodsList(id).then(res => {
          console.log('删除货妥项：', res);
          if (res.code === '0') {
            this.goodsList = this.goodsList.filter(item => item.id !== id);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPurchaseOrderList();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });

    },
    deleteGoodItem(id) {
      // console.log('删除货妥数据：', id);
      this.allAddData.cargoReadyListDtoList = this.allAddData.cargoReadyListDtoList.filter(item => item.uuid !== id);
      if (!this.allAddData.cargoReadyListDtoList.length) {
        this.isSubmitDisabled = true;
      }
    },
    packagesChange() {
      // 包数调整
    },
    perPackageChange() {
      // 每包米数调整
    },
    quantityChange() {
      // 米数
    },
    async submitAddHandle(type, index, item) {
      // 提交添加货妥
      // this.isVerifyCont = false;
      // this.isVerifyDate = false;
      let time = null;
      let list = [];
      switch (type) {
        case 'submit':
          // list = this.allAddData.cargoReadyListDtoList;
          list = JSON.parse(JSON.stringify(this.allAddData.cargoReadyListDtoList));
          break;
        case 'import':
          list = item ? JSON.parse(JSON.stringify(item.readyList)) : [];
          list = list || list.length ? list.filter(x => { return x.isAdd == 'Y' }) : [];
          break;
      
        default:
          break;
      }
      for (var i = 0; i < list.length; i++) {
      	if(list[i].purchaseMeasurementUnit == '米'){
      		if (!list[i].readyBagQuantity || !list[i].confirmQuantityPerPackage) {
	          this.$message({
	            type: 'error',
	            message: '请完善货妥数量！'
	          });
	          return false;
	        }
      	}else{
      		if (!list[i].readyMeter) {
	          this.$message({
	            type: 'error',
	            message: '请完善货妥数量！'
	          });
	          return false;
	        }
      	}
      	if(list[i].purchaseMeasurementUnit == '米'){
      		 list[i].readyMeter = parseFloat(list[i].readyBagQuantity) * parseFloat(list[i].confirmQuantityPerPackage);
      	}
        if (list[i].readyMeter.toString().indexOf('.') !== -1) {
          let arr = list[i].readyMeter.toString().split('.');
          if (arr[0].length > 8) {
            this.$message({
              message: '货妥数量米数仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (arr[1].length > 2) {
            this.$message({
              message: '货妥数量米数仅支持小数位2位，请重新输入！',
              type: 'error'
            });
            return false;
          }
        } else if (list[i].readyMeter.toString().length > 8) {
          this.$message({
            message: '货妥数量米数仅支持整数位8位，请重新输入！',
            type: 'error'
          });
          return false;
        }
        if (!list[i].readyDate) {
          this.$message({
            type: 'error',
            message: '请输入货妥日期！'
          });
          return false;
        }
        // this.isSubmitDisabled = true;
        list[i].packSpecification = list[i].confirmQuantityPerPackage;
        // if (list[i].readyDate.toString().indexOf('-') == -1) {
        //   list[i].readyDate = timeFormatGMT(list[i].readyDate);
        // }
      }
      this.allAddData.applicant = this.$store.state.userName;
      this.allAddData.applicantName = this.$store.state.realName;
      this.allAddData.applicantDepartment = this.$store.state.currentDepartment.id;
      this.allAddData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.allAddData.cargoReadyListDtoList = list;
      if (type === 'submit') {
        this.isSubmitDisabled = true;
      } else if (type === 'import') {
        this.importSubmitDisabled = true;
      }
      await addPurchaseGoodsList(this.allAddData).then(res => {
        console.log('提交新增货妥列表：', res);
        if (res.code === '0') {
          if (type === 'submit') {
            this.dialogFormVisible = false;
          }
          this.$message({
            type: 'success',
            message: '添加货妥成功！'
          });
          this.getPurchaseOrderList();
        }
        if (type === 'submit') {
          this.isSubmitDisabled = false;
        } else if (type === 'import') {
          this.importSubmitDisabled = false;
        }
      });

      // this.allAddData.cargoReadyListDtoList.forEach(item => {
      //   console.log(item);
      //   if (!item.readyBagQuantity || !item.packSpecification) {
      //     if (!this.isVerifyCont) {
      //       this.isVerifyCont = true;
      //       this.$message({
      //         type: 'error',
      //         message: '请完善货妥数量！'
      //       });
      //     }
      //     return false;
      //   }
      //   item.readyMeter = parseFloat(item.readyBagQuantity) * parseFloat(item.packSpecification);
      //   if (item.readyMeter.toString().indexOf('.') !== -1) {
      //     let arr = item.readyMeter.toString().split('.');
      //     if (arr[0].length > 8) {
      //       this.$message({
      //         message: '货妥数量米数仅支持整数位8位，请重新输入！',
      //         type: 'error'
      //       });
      //       return false;
      //     }
      //     if (arr[1].length > 2) {
      //       this.$message({
      //         message: '货妥数量米数仅支持小数位2位，请重新输入！',
      //         type: 'error'
      //       });
      //       return false;
      //     }
      //   } else if (item.readyMeter.toString().length > 8) {
      //     this.$message({
      //       message: '货妥数量米数仅支持整数位8位，请重新输入！',
      //       type: 'error'
      //     });
      //     return false;
      //   }
      //   if (!item.readyDate) {
      //     if (!this.isVerifyDate) {
      //       this.isVerifyDate = true;
      //       this.$message({
      //         type: 'error',
      //         message: '请输入货妥日期！'
      //       });
      //     }
      //     return false;
      //   }
      //   if (this.isVerifyCont || this.isVerifyDate) {
      //     this.isVerifyCont = false;
      //     this.isVerifyDate = false;
      //     return false;
      //   }
      //   this.isSubmitDisabled = true;
      //   if (item.readyDate.toString().indexOf('-') == -1) {
      //     item.readyDate = timeFormatGMT(item.readyDate);
      //   }
        
      //   clearTimeout(time);
      //   time = setTimeout(() => {
      //     addPurchaseGoodsList(this.allAddData).then(res => {
      //       // console.log('提交新增货妥列表：', res);
      //       if (res.code == '0') {
      //         this.dialogFormVisible = false;
      //         this.$message({
      //           type: 'success',
      //           message: '添加货妥成功!'
      //         });
      //         this.getPurchaseOrderList();
      //       }
      //       this.isSubmitDisabled = false;
      //     });
      //   },100);
      // });
      
    },

    async saveOrderConfirm() {
      // 生成采购订单对话框确认
      let data = {};
      let uuidData = await purchasegetuuid();
      if (uuidData.code == '0') {
        data.uuid = uuidData.data;
      }
      data.poiList = this.generateRequestList;
      // console.log(data);
      savePurchaseOrder(data).then(res => {
        // console.log('生成采购订单：', res);
        if (res.code == '0') {
          this.dialogFormVisible = false;
          this.$emit('activeObj', {name: 'order', subName: 'Draft'});
        }
      });
    },
    handleSizeChange(val) {
      this.listLoading = true;
      this.pageSize = val;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.listLoading = true;
      this.currentPage = val;
      this.getPurchaseOrderList();
    },
    getPurchaseOrderList() {
      // 货妥列表
      let data = {
        confirmNumber: this.confirmNumber,
        beginTime: this.beginTime,
        endTime: this.endTime,
        cargoReadyBeginTime: this.cargoReadyBeginTime,
        cargoReadyEndTime: this.cargoReadyEndTime,
        materialCode: this.materialCode,
        purchaseOrderId: this.purchaseOrderId,
        supplierCode: this.supplierCode,
        applicantName:this.applicantName,
        purchaseOrderType: this.purchaseOrderType
      };
      cargoReadyList(this.currentPage, this.pageSize, data).then(res => {
        console.log('货妥列表：', res);
        if (res.code === '0') {
          this.orderList = res.data.records;
          this.total = res.data.total;
          this.orderList.forEach((item, index) => {
            let list = item.fciList;
            for (var i = 0; i < list.length; i++) {
              let cItem = list[i];
              cItem.isImportAdd = 'Y';
              cItem.ableShipmentsName = cItem.ableShipments === false ? '否' : '是';
              cItem.actions = {
                hasAdd: true
              };
              // 货妥详情列表
              purchaseGoodsList(cItem.uuid).then(res => {
                if (res.code === '0') {
                  res.data.forEach(x => {
                    x.ableShipmentsName = x.ableShipments === false ? '否' : '是';
                  });
                  cItem.goodsList = res.data;
                }
              });
            }
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            let requestTypeData = this.orderTypeList.filter(typeItem => {
              return typeItem.index == item.purchaseOrderType;
            });
            if (requestTypeData.length) {
              item.purchaseOrderTypeName = requestTypeData[0].name;
            }
          });
          this.listLoading = false;
          //this.tableLoading = false;
        } else {
          this.listLoading = false;
          //this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.listLoading = false;
        //this.tableLoading = false;
      }, 10000);
    },
    getGoodsList(uuid) {
      // 货妥列表
      purchaseGoodsList(uuid).then(res => {
        console.log('货妥列表：', res);
        if (res.code === '0') {
          this.goodsList = res.data;
        }
      });
    },
    getSupplierDictList() {
      // 供应商列表
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    async getSearchOrderList(id) {
      await searchPurchaseOrderList(id).then(res => {
        // console.log('当前操作订单：', res);
        if (res.code == '0') {
          res.data.isShowList = true;
          res.data.updateTime = timeFormat(res.data.updateTime);
          this.editOrderData = res.data;
        }
      });
    },
    getGenerateRequestList() {
      // 生成采购订单列表
      this.generateRequestList = [];
      this.checkList.forEach(id => {
        searchPurchaseRequestItem(id).then(res => {
          // console.log('生成采购请求列表：', res);
          if (res.code == '0') {
            res.data.priUuid = res.data.uuid;
            res.data.prCode = res.data.purchaseRequestCode;
            res.data.prType = res.data.purchaseType;
            res.data.priSn = res.data.sn;
            this.generateRequestList.push(res.data);
          }
        });
      });
    },
    getPurchaseOrderType() {
      // 采购订单类型列表
      constDictList('PurchaseOrderType').then(res => {
        console.log('采购订单类型：', res);
        if (res.code === '0') {
          this.orderTypeList = res.data;
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

.goodsmanagement {
  .actions_part {
    margin: 10px 0;
  }

  .table_part {
    .pagination_wrap {
      margin-top: 20px;
    }
  }
  
}

.add_popup_part {
  .childcontentlist {
    height: 60px;
    border-bottom: 1px solid #EEEEEE;
    li {
      line-height: 40px;
    }
    &:last-child {
      border-bottom: 1px solid #EEEEEE;
    }
  }
  .add_goods_warp {
    .meters {
      vertical-align: middle;
      max-width: 130px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

ul.parentlist {
  li {
    i.el-icon-caret-bottom,
    i.el-icon-caret-top {
      font-size: 20px;
    }
    i.el-icon-edit,
    i.el-icon-delete,
    i.el-icon-thumb {
      font-size: 20px;
      color: #409eff;
      margin-left: 10px;
    }
  }
}
ul.childcontentlist {
  li {
    i.el-icon-circle-plus-outline {
      font-size: 28px;
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

.el-dialog {
  width: 80%;
}

</style>
<style>
.goodsmanagement .el-table .warning-row {
  background: #e1e1e1;
}
.goodsmanagement .el-table .warning-row:hover>td {
  background-color: #e1e1e1 !important;
}
.goodsmanagement .el-table .success-row {
  background: #f0f9eb;
}

.goodsmanagement .el-tabs--border-card>.el-tabs__content {
  padding: 0;
}
.goodsmanagement .el-checkbox-group {
  text-align: left;
}
  
</style>