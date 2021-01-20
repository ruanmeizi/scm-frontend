<template>
  <div class="container factoryconfirm">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
         <div class="display_ib mr10 mb10">
		        <span class="tag">供应商：</span>
            <el-select class="select_single w200 mr10"
              @change="searchHandle"
              v-model="supplierCode"
              filterable
              placeholder="请选择">
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
          <span class="tag">订单编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialsCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">确认状态：</span>
          <el-select class="select_single w200 mr10"
            @change="searchHandle"
            v-model="orderConfirmCode"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in orderConfirmStatuslist"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">创建日期：</span>
          <el-date-picker
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
          <span class="tag">申请人：</span>
          <el-input class="input_single w200 mr10" v-model="applicantName" placeholder="请输入"></el-input>
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
        <a class="link inline_block lh36 ml10 mr10" type="primary" @click="exportExcelTemplate">货妥分析导入模板</a>
        <el-button type="success" @click="cargoReadyAnalyzeExcel">货妥分析</el-button>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          v-model="productcode"
          circle
          title="搜索"
          @click="searchHandle"
        ></el-button>
        <!-- <el-button
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
        ></el-button> -->
      </div>
    </div>

    <!--<div class="table_part clearfix">
      <el-tabs v-model="activeName">
        <Table
          :tableList="requestList"
          :parentData="parentData"
          :childData="childData"
          :tableFieldsList="fieldNameList"
          :tableParentFieldsList="parentFieldsList"
          :tableLoading="tableLoading"
          @addItemHandle="addHandle"
          @addHandle="addfactirycode"
        ></Table>
      </el-tabs>
      <div class="paging" style="margin-top: 20px;float:right;height: 30px;">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10,50]"
            :page-size="pageSize"
            layout="sizes,total, prev, pager, next"
            :total="this.allpage"
          ></el-pagination>
        </div>
      </div>
    </div>-->
    
    
    <div class="table_part clearfix">
              <el-table
                class="table_list"
                ref="multipleTable"
                v-loading="listLoading"
                :data="requestList"
                row-key="id"
                :expand-row-keys="expands"
                @row-click="rowClick"
                border
                fit
                stripe>
                <!-- <el-table-column type="selection" /> -->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-table
                      class="table_list"
                     :ref="'childMultipleTable_' + scope.row.id"
                      v-loading="childListLoading"
                      :data="scope.row.poiList"
                      element-loading-text="拼命加载中"
                      border
                      fit>
                      <!-- <el-table-column fixed type="selection" /> -->
                      <el-table-column fixed label="PO行号">
                        <template slot-scope="{ row }">
                          {{ row.purchaseOrderSn }}
                        </template>
                      </el-table-column>
                      <el-table-column fixed label="物料编号">
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
                       <el-table-column  label="工厂确认数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.confirmPackages? row.confirmPackages: 0) + '包 ' + (row.confirmQuantityPerPackage? row.confirmQuantityPerPackage: 0) + '米/包 ' + (row.confirmQuantity ? row.confirmQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.confirmQuantity ? row.confirmQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                       <el-table-column  label="确认书号">
                        <template slot-scope="{ row }">
                          {{ row.confirmNumber }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购订单数量">
                        <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.offeredPackages? row.offeredPackages : 0) + '包 ' + (row.offeredQuantityPerPackage ? row.offeredQuantityPerPackage : 0) + '米/包 ' + (row.offeredQuantity ? row.offeredQuantity : 0) + '米' }}</span>
                          <span v-else>{{ (row.offeredQuantity ? row.offeredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="工厂交期">
                        <template slot-scope="{ row }">
                          {{ row.offeredDate }}
                        </template>
                      </el-table-column>
                     <el-table-column label="投产日期">
                        <template slot-scope="{ row }">
                          {{ row.confirmTime }}
                        </template>
                      </el-table-column>
                      <el-table-column label="折扣信息">
                        <template slot-scope="{ row }">
                          {{ row.discountInfo }}
                        </template>
                      </el-table-column>
                      <el-table-column label="采购备注">
                        <template slot-scope="{ row }">
                          {{ row.purchaseRemark }}
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="100" fixed="right">
                        <template slot-scope="{ row }">
                           <el-button class="el-icon-plus" type="primary" circle size="mini" title="新增子项" @click.stop="addHandle($index, row,scope.row)"></el-button>
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
                <el-table-column label="确认状态">
                  <template slot-scope="{ row }">
                    {{ row.confirmStatusShow }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="{ row, $index }">
                    <!-- <div v-if="row.ifShowBatchInsertButton == true"> -->
                    <div>
                      <el-button type="primary" size="mini" title="新增" @click.stop="addfactirycode($index, row)">整单确认</el-button>
                    </div>
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
              :total="allpage"
            ></el-pagination>
          </div>
          
        </div>
    
    

    <!-- 查看弹出框 -->
    <el-dialog
      title="确认书内容添加"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="83%"
    >
      <div class="dialogtable" v-show="ifshow">
        <table class="contenttab" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <!-- <th>物料ID</th> -->
            <th>物料编号</th>
            <th>供应商</th>
            <th>确认书编号</th>
            <th>工厂确认数量</th>
            <th>投产日期</th>
            <th>工厂季</th>
            <th>折扣信息</th>
            <th>工厂交期</th>
            <th></th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tablelist" :key="index">
              <!-- <td>
		  					<span>{{item.materialId}}</span>		  					
              </td>-->
              <td>
                <span>{{item.materialCode}}</span>
              </td>
              <td>{{item.supplierShortName}}</td>
              <!-- <td>{{item.supplierName}}</td> -->
              <td>
                <input
                  class="sure"
                  v-model="item.confirmNumber"
                  v-if="item.flag==false"
                  type="text"
                />
                <span v-else>{{item.confirmNumber}}</span>
              </td>
              <td>
                <div class="inputtext" v-if="item.flag==false">
                  <div id>
                    <el-input-number
                      v-model.trim="item.confirmPackages"
                      size="mini"
                      controls-position="right"
                      :min="1"
                      :max="100"
                    ></el-input-number>
                    <span>包</span>
                  </div>
                  <div>
                    <el-input-number
                      v-model.trim="item.confirmQuantityPerPackage"
                      size="mini"
                      :precision="2"
                      controls-position="right"
                      :min="1"
                      :max="100"
                    ></el-input-number>
                    <span>米/包</span>
                  </div>
                  <div>
                    <el-input-number
                      v-model.trim="item.confirmQuantity"
                      size="mini"
                      :precision="2"
                      controls-position="right"
                      :min="1"
                      :max="100"
                    ></el-input-number>
                    <span>米</span>
                  </div>
                </div>
                <span v-else>
                  <div id v-if="item.purchaseMeasurementUnit=='米'">
                    {{item.confirmPackages?item.confirmPackages:"0"}}包
                    {{item.confirmQuantityPerPackage?item.confirmQuantityPerPackage:"0"}}米/包
                    {{item.confirmQuantity?item.confirmQuantity:"0"}}米
                  </div>
                  <div v-else>
                    <span
                      v-if="item.purchaseMeasurementUnit!=null"
                    >{{item.confirmQuantity?item.confirmQuantity:"0"}}{{item.purchaseMeasurementUnit}}</span>
                    <span v-else>{{item.confirmQuantity?item.confirmQuantity:"0"}}条</span>
                  </div>
                </span>
              </td>
              <td>
                <div class="time" v-if="item.flag==false">
                  <el-date-picker
                    unlink-panels
                    :title="item.confirmTime"
                    v-model="item.confirmTime"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    :picker-options="pickerOptions0"
                  ></el-date-picker>
                </div>
                <span v-else>{{item.confirmTime}}</span>
              </td>
              <td>{{item.factorySeason}}</td>
              <td>{{item.discountInfo}}</td>
              <td>{{item.offeredDate}}</td>
              <td>
                <!--<el-button v-if="item.flag==false" size="mini" type="primary" @click="sureupd(item,index)">确认</el-button>
                <i v-else type="primary" class="el-icon-edit"  title="修改" @click="tableupd(item,index)"></i>-->
                <i type="primary" class="el-icon-delete" title="删除" @click="tabledel(item,index)"></i>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="this.tablelist==''" class style="color: #909399;text-align:center;">暂无数据</p>
      </div>

      <div class="dialogadd">
        <div class="dialog_title">
          <div class="button">
            <el-button
              size="small"
              v-show="ifshow"
              type="primary"
              icon="el-icon-plus"
              circle
              title="添加子项"
              @click="addchildmsg()"
            ></el-button>
          </div>
          <span>新增确认书内容</span>
        </div>

        <div class="dialog_content">
          <table class="contenttab" border="0" cellspacing="0" cellpadding="0">
            <thead>
              <th v-show="ifshow">工厂确认数量</th>
              <th>投产日期</th>
              <th>工厂交期</th>
              <!-- <th v-show="ifshow">工厂交期</th> -->
              <th>确认书编号</th>
              <th>工厂季</th>
              <th>折扣信息</th>
              <th v-show="ifshow">操作</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form" :key="index">
                <td v-show="ifshow">
                  <div class="inputtext" v-if="item.purchaseMeasurementUnit=='米'">
                    <div id>
                      <el-input-number
                        v-model.trim="item.confirmPackages"
                        size="mini"
                        controls-position="right"
                        @change="handleChange"
                        :min="1"
                        step-strictly
                      ></el-input-number>
                      <span>包</span>
                    </div>
                    <div>
                      <el-input-number
                        v-model.trim="item.confirmQuantityPerPackage"
                        size="mini"
                        :precision="2"
                        controls-position="right"
                        @change="handleChange"
                        :min="1"
                      ></el-input-number>
                      <span>米/包</span>
                    </div>
                    <div>
                      <span
                        style="display: inline-block;margin-top: 5px;"
                        :title="item.confirmPackages*item.confirmQuantityPerPackage?item.confirmPackages*item.confirmQuantityPerPackage:0"
                        v-model.trim="item.confirmQuantity=item.confirmPackages*item.confirmQuantityPerPackage"
                      >{{item.confirmPackages*item.confirmQuantityPerPackage?item.confirmPackages*item.confirmQuantityPerPackage:0}}米</span>
                      <!--<el-input-number  v-model.trim="item.confirmQuantity"  size="mini" :precision="2"  controls-position="right"  :min="1" ></el-input-number>
                      <span>米</span>-->
                    </div>
                  </div>
                  <div class="inputtext" v-else>
                    <el-input-number
                      v-model.trim="item.confirmQuantity"
                      size="mini"
                      :precision="(item.purchaseMeasurementUnit == '米' || item.purchaseMeasurementUnit == '公斤') ? 2 : 0"
                      controls-position="right"
                      @change="handleChange"
                      :min="1"
                    ></el-input-number>
                    <span
                      class="pt10 inline"
                      v-if="item.purchaseMeasurementUnit!=null"
                    >{{item.purchaseMeasurementUnit}}</span>
                    <span class="pt10 inline" v-else>条</span>
                  </div>
                </td>
                <td>
                  <div class="time">
                    <el-date-picker
                      unlink-panels
                      :title="item.confirmTime"
                      v-model="item.confirmTime"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择投产日期"
                    ></el-date-picker>
                  </div>
                </td>
                <!-- <td v-show="ifshow"> -->
                <td>
                  <div class="time">
                    <el-date-picker
                      unlink-panels
                      :title="item.offeredDate"
                      v-model="item.offeredDate"
                      type="date"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择工厂交期"
                      :picker-options="pickerOptions0"
                    ></el-date-picker>
                  </div>
                </td>
                <td>
                  <input
                    class="sure"
                    v-model="item.confirmNumber"
                    maxlength="31"
                    placeholder="请输入确认书号"
                    type="text"
                  />
                </td>
                <td>
                  <el-select class="select_single w150 mr10"
                    v-model.trim="item.factorySeason"
                    :disabled="item.ifFactorySeason"
                    filterable
                    placeholder="请选择请求类型">
                    <el-option
                      v-for="i in factorySeasonList"
                      :key="i.typeid"
                      :value="i.typeid"
                      :label="i.typename"
                    ></el-option>
                  </el-select>
                </td>
                <td>
                  <input
                    class="sure"
                    v-model="item.discountInfo"
                    maxlength="60"
                    placeholder="请输入折扣信息"
                    type="text"
                  />
                </td>
                <td v-show="ifshow">
                  <!--<el-button type="danger" title="删除" icon="el-icon-minus" circle @click="childdel(index,item)"></el-button>-->
                  <el-button
                    type="danger"
                    title="删除"
                    icon="el-icon-minus"
                    circle
                    @click="childdel(index,item)"
                  ></el-button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="formtable_null"
          style="text-align: center;margin-top: 15px;"
          v-if="this.form.length<1"
        >
          <img src="../../../assets/image/add.png" style="width:200px;height:100px;" />
          <p>信息空空如也去添加</p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :title="this.submittxt"
          :loading="loading"
          :disabled="this.form==''"
          v-preventReClick
          @click="draftsave()"
        >提交</el-button>
      </span>
    </el-dialog>

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="dialogdelVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>确定删除该条确认书内容?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" v-preventReClick @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 货妥前修改弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="bulkChange"
      :close-on-click-modal="false"
      width="30%">
      <span>该采购订单已经存在工厂确认信息，是否继续批量修改？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bulkChange = false">取 消</el-button>
        <el-button type="primary" @click="confirmBulkChange()">确 定</el-button>
      </span>
    </el-dialog>

    <div class="import_popup_part">
      <el-dialog
        title="导入货妥"
        v-loading="editPartLoading"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="importDialogFormVisible">
        <upload-excel-component :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />

        <el-table
          class="table_list mt20"
          ref="multipleTable"
          :data="cargoReadyTableData"
          border
          fit
          stripe>
          <el-table-column v-for="item of cargoReadyTableHeader" :key="item" :prop="item" :label="item">
            <template slot-scope="{ row }">
              {{ row[item] }}
            </template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button type="success" v-preventReClick :disabled="exportCargoReadyDisabled" @click.stop="cargoReadyExcelExport">导出分析货妥</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import {
  factorySerch,
  purchasegetuuid,
  factorychildshow,
  factorychildupd,
  factorychilddel,
  factorychildadd,
  factoryparentadd,
  searchWithPage,
  getFactorySeason
} from "@/api/module/factoryApi.js";
import {
  supplierDictList,
  searchPOCodeByConfirmNumber,
  searchPOInfoByPOAndCN,
  searchCargoReadyByPO,
  constDictList
} from "@/api/module/purchaseApi.js";
import { getrequesttype ,fabrictypedictionaries} from "@/api/module/dictionariesApi.js";
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import { timeFormat, excelDateFormatToDate, getTimeRange } from "@/utils/index.js";
export default {
  name: "factoryconfirm",
  data() {
    return {
    	 // Tabble组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: true,
      selectUuidList: [],

      // 导入货妥
      editPartLoading: false,
      importDialogFormVisible: false,
      exportCargoReadyDisabled: false,
      
      applicantName:'',
      tableLoading: true,
      supplierCode:'',
      type: "",
      beginTime: '',
      endTime: '',
      materialsCode: "",
      materialCode: "",
      loading: false,
      requestCode: "",
      requestList: [],
      expands:[],
      ifshowlist: false,
      ifaddsure: false,
      ifchildshow: false,
      ifshowview: false,
      nullboolean: true,
      dialogdelVisible: false,
      dialogVisible: false,
      ifshow: false,
      ifsure: true,
      ifFactorySeason:false,
      factorySeasonData:'',
      activeName: "1",
      pageSize: 10, //每页显示多少条
      size: "",
      purchaseMeasurementUnit: "",
      allpage: 0,
      currentPage: 1, //页数
      typestatusid: "",
      productcode: "",
      prStatus: "",
      submittxt: "",
      dateVal:'',
      applicantName: "",
      supplierList:[],
      form: [],
      requestListitem: "",
      tagtier: "",
      materialId: "",
      requestIndex: "",
      index: "",
      tablelist: [],
      requistionlist: [],
      requestFirListitem: {},
      typeList: [],
      orderConfirmStatuslist: [],
      orderConfirmCode: '',
      bulkChange: false,
      confirmItem: '',
      purchaseOrderType: '',
      orderTypeList: [],
      factorySeasonList: [
        {
          typeid: "S20",
          typename: "S20"
        },
        {
          typeid: "W20/21",
          typename: "W20/21"
        },
        {
          typeid: "S21",
          typename: "S21"
        }
      ],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      parentData: {
        status: "",
        data: [
          {
            name: "创建时间",
            field: "createTime",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "申请人",
            field: "applicantName",
            class: "w4p",
            isShowTit: true
          },
          {
            name: "订单编号",
            field: "purchaseOrderId",
            class: "w12p",
            isShowTit: true
          },
          {
            name: "请求类型",
            field: "purchaseOrderTypeName",
            class: "w8p",
            isShowTit: true
          },
          {
            name: "",
            field: "",
            class: "fr mr15",
            isShowTit: false,
            isUpDown: true
          },
          {
            name: "",
            field: "",
            class: "fr",
            isAction: true
          }
        ]
      },
      childData: {
        name: "poiList",
        data: [
          {
            name: "",
            field: "materialCode",
            class: "w13p"
          },
          {
            name: "",
            field: "factorySeason",
            class: "w13p"
          },
          {
            name: "",
            field: "supplierName",
            class: "w13p"
          },
          {
            name: "",
            field_1: "confirmPackages",
            field_2: "confirmQuantityPerPackage",
            field_3: "confirmQuantity",
            class: "w18p",
            isOffered: true
          },
          {
            name: "",
            field: "confirmNumber",
            class: "w13p"
          },
          {
            name: "",
            field_1: "offeredPackages",
            field_2: "offeredQuantityPerPackage",
            field_3: "offeredQuantity",
            class: "w18p",
            isOffered: true
          },
          {
            name: "",
            field: "offeredDate",
            class: "w13p"
          },
          // {
          //   name: "",
          //   field: "purchaseOrderId",
          //   class: "w13p"
          // },
          {
            name: "",
            field: "confirmTime",
            class: "w13p"
          },
          {
            name: "",
            field: "discountInfo",
            class: "w13p"
          },
          {
            name: "",
            class: "w13p",
            isAction: true
          }
        ]
      },
      fieldNameList: [
        {
          name: "物料编号",
          class: "w13p"
        },
        {
          name: "工厂季",
          class: "w13p"
        },
        {
          name: "供应商",
          class: "w13p"
        },
        {
          name: "工厂确认数量",
          class: "w18p"
        },
        {
          name: "确认书号",
          class: "w13p"
        },
        {
          name: "采购订单数量",
          class: "w18p"
        },
        {
          name: "工厂交期",
          class: "w13p"
        },
        // {
        //   name: "采购订单号码",
        //   class: "w13p"
        // },
        {
          name: "投产日期",
          class: "w13p"
        },
        {
          name: "折扣信息",
          class: "w13p"
        },
        {
          name: "",
          class: "w13p"
        }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '创建时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        },
        {
          name: '订单编号',
          class: 'w12p'
        },
        {
          name: '请求类型',
          class: 'w8p'
        }
      ],

      // 导入导出
      importCRHeaderList: [],
      exportCRHeaderList: ['PO单号', 'PO行号', '新增', '已妥总量']


    };
  },
  components: {
    Table,
    UploadExcelComponent
  },
  created() {},
  mounted() {
    this.requestType();
    this.getSupplierDictList();
    // this.getfactoryRequestList();
    this.fun_date();
    this.getFactoryStatus();
    this.getPurchaseOrderType();
  },
  watch: {},
  methods: {
    // 固定展示为两周前的时间范围
    fun_date(){
       console.log(getTimeRange(-14))//两周前的日期
      this.dateVal=getTimeRange(-14);
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
      if (this.expands.indexOf(row.id) < 0) {
          this.expands.push(row.id);
      }else {
          this.expands.remove(row.id);
      }
    },
    exportExcelTemplate() {
      // 导出货妥分析Excel模板
      const headerList = ['Customer', '物料编号', '确认书号', '工厂交期', '货妥时间', '货妥数量包数', '货妥数量规格', '货妥数量', '最新货妥时间', '是否可发运', 'PO单号', 'PO行号', '新增', '已妥总量', 'Your Quality'];
      const data = [['JILIN', 'ZDFH-MLWL01', 'nn123123111', '2020/11/20', '2020/10/27', '1', '50', '50', 'Pronta/Ready', '是', '', '', '', '', '1000080']];
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: headerList, //Header Required
          data, //Specific data Required
          filename: '货妥分析导入模板', //Optional
          autoWidth: true, //Optional
          bookType: 'xlsx' //Optional
        })
      });
    },
    cargoReadyAnalyzeExcel() {
      // 货妥分析
      this.importDialogFormVisible = true;
      this.cargoReadyTableData = [];
      this.cargoReadyTableHeader = [];
      this.exportCargoReadyDisabled = true;
    },
    cargoReadyExcelExport() {
      // 导出分析货妥
      let headerList = this.cargoReadyTableHeader;
      let fieldsList = this.cargoReadyTableHeader;
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.cargoReadyTableData;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '货妥分析',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
      this.importDialogFormVisible = false;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    dateValChange(val) {
      // 创建时间变化
      // this.beginTime = val[0];
      // this.endTime = val[1];
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
      console.log('导入货妥分析数据：', results, header);
      let confirmNumberList = [];
      let importList = [];
      // this.importCRHeaderList = JSON.parse(JSON.stringify(header));
      // header = header.concat(this.exportCRHeaderList);
      // this.exportCRHeaderList = header.concat(this.exportCRHeaderList);  // 导出分析货妥头字段
      if (results && results.length) {
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
            customer: '',
            pieces: '',
            mt: '',
            newReadyDate: '',
            quality: '',
            vol: ''
          };
          Object.keys(item).map((key) => {
            // console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '确认书号') {
              confirmNumberList.push(item[key]);
              rData.confirmNumber = item[key];
            } else if (key === '物料编号') {
              rData.materialCode = item[key];
            } else if (key === '工厂交期') {
              rData.offeredDate = excelDateFormatToDate(item[key]);
            } else if (key === '货妥时间') {
              rData.readyDate = excelDateFormatToDate(item[key]);
            } else if (key === '货妥数量包数') {
              rData.readyBagQuantity = item[key];
            } else if (key === '货妥数量规格') {
              rData.confirmQuantityPerPackage = item[key];
            } else if (key === '货妥数量') {
              rData.readyMeter = item[key];
            } else if (key === '是否可发运') {
              rData.ableShipments = item[key] === '是' ? true : false;
            } else if (key === 'Customer') {
              rData.customer = item[key];
            } else if (key === 'Pieces') {
              rData.pieces = item[key];
            } else if (key === 'Mt') {
              rData.mt = item[key];
            } else if (key === '最新货妥时间') {
              rData.newReadyDate = (item[key] === 'Pronta/Ready' ? item[key] : (item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key])));
            } else if (key === 'Your Quality') {
              rData.quality = item[key];
            } else if (key === 'VOL') {
              rData.vol = item[key];
            }
          });
          importList.push(rData);
        }
        
        for (let i = 0; i < importList.length; i++) {
          let iItem = importList[i];
          console.log('货妥分析导入Excel列表项：', iItem);
          // iItem.isAdd = 'Y';
          iItem.purchaseOrderIdList = [];
          iItem.snList = [];
          let params = {
            materialCode: iItem.materialCode,
            confirmNumber: iItem.confirmNumber,
            offeredDate: iItem.offeredDate
          };
          await searchPOInfoByPOAndCN(params).then(res => {
            console.log('根据确认书号和物料号查询PO单号和PO行号：', res);
            if (res.code === '0') {
              if (res.data && res.data.length) {
                for (let m = 0; m < res.data.length; m++) {
                  let rItem = res.data[m];
                  // let crParams = {
                  //   purchaseOrderId: rItem.purchaseOrderId
                  // };
                  iItem.purchaseOrderIdList.push(rItem.purchaseOrderId);
                  iItem.snList.push(rItem.rev);
                  iItem.cargoReadyQuantityTotal = rItem.cargoReadyQuantityTotal;

                  this.getCargoReadyListByPO(rItem, iItem);

                  // searchCargoReadyByPO(crParams).then(crRes => {
                  //   console.log('查出采购订单和订单下所有货妥清单：', crRes);
                  //   if (res.code === '0') {
                  //     if (res.data && res.data.poiList && res.data.poiList.length) {
                        
                  //     }
                  //   }
                  // });
                }
                
              }
              
            }
          });
        }

        setTimeout(() => {
          for (let i = 0; i < importList.length; i++) {
            let item = importList[i];
            Object.keys(item).map((key) => {
              // console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
              if (key == 'customer') {
                item['Customer'] = item[key];
                delete item['customer'];
              } else if (key == 'materialCode') {
                item['物料编号'] = item[key];
                delete item['materialCode'];
              } else if (key == 'offeredDate') {
                item['工厂交期'] = item[key];
                delete item['offeredDate'];
              } else if (key == 'readyBagQuantity') {
                item['货妥数量包数'] = item[key];
                delete item['readyBagQuantity'];
              } else if (key == 'confirmQuantityPerPackage') {
                item['货妥数量规格'] = item[key];
                delete item['confirmQuantityPerPackage'];
              } else if (key == 'readyMeter') {
                item['货妥数量'] = item[key];
                delete item['readyMeter'];
              } else if (key == 'pieces') {
                item['Pieces'] = item[key];
                delete item['pieces'];
              } else if (key == 'mt') {
                item['Mt'] = item[key];
                delete item['mt'];
              } else if (key == 'readyDate') {
                item['货妥时间'] = item[key];
                delete item['readyDate'];
              } else if (key == 'newReadyDate') {
                item['最新货妥时间'] = item[key];
                delete item['newReadyDate'];
              } else if (key == 'quality') {
                item['Your Quality'] = item[key];
                delete item['quality'];
              } else if (key == 'vol') {
                item['VOL'] = item[key];
                delete item['vol'];
              } else if (key == 'confirmNumber') {
                item['确认书号'] = item[key];
                delete item['confirmNumber'];
              } else if (key == 'ableShipments') {
                item['是否可发运'] = item[key] ? '是' : '否';
                delete item['ableShipments'];
              } else if (key == 'purchaseOrderIdList') {
                item['PO单号'] = item[key].join(',');
                delete item['purchaseOrderIdList'];
              } else if (key == 'snList') {
                item['PO行号'] = item[key].join(',');
                delete item['snList'];
              } else if (key == 'isAdd') {
                item['新增'] = item[key];
                delete item['isAdd'];
              } else if (key == 'cargoReadyQuantityTotal') {
                item['已妥总量'] = item[key];
                delete item['cargoReadyQuantityTotal'];
              }
            });
          }

          this.cargoReadyTableHeader = header;
          this.cargoReadyTableData = importList;
          // this.cargoReadyTableHeader = this.importCRHeaderList.concat(this.exportCRHeaderList);
          // this.cargoReadyTableHeader = ['customer', 'materialCode', 'confirmNumber', 'readyDate', 'readyBagQuantity', 'confirmQuantityPerPackage', 'readyMeter', 'newReadyDate', 'ableShipments', 'purchaseOrderIdList', 'snList', 'isAdd', 'cargoReadyQuantityTotal', 'quality'];
          this.exportCargoReadyDisabled = false;
          this.$forceUpdate();
        }, 1000);

        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },
    async getCargoReadyListByPO(item, excelItem) {
      let params = {
        purchaseOrderId: item.purchaseOrderId
      };
      await searchCargoReadyByPO(params).then(res => {
        console.log('查出采购订单和订单下所有货妥清单：', res);
        if (res.code === '0') {
          if (res.data && res.data.poiList && res.data.poiList.length) {
            for (let i = 0; i < res.data.poiList.length; i++) {
              let poiItem = res.data.poiList[i];
              if (poiItem.purchaseOrderId == item.purchaseOrderId && poiItem.purchaseOrderSn == item.rev && excelItem.materialCode == poiItem.materialCode) {
                // 定位到当前POI下
                for (let j = 0; j < poiItem.confirmList.length; j++) {
                  let confirmItem = poiItem.confirmList[j];
                  if (confirmItem.readyList && confirmItem.readyList.length) {
                    for (let m = 0; m < confirmItem.readyList.length; m++) {
                      let crItem = confirmItem.readyList[m];
                      if (crItem.purchaseMeasurementUnit == '米') {
                        if (excelItem.confirmNumber == crItem.confirmingCode && excelItem.readyDate == crItem.readyDate && excelItem.readyBagQuantity == crItem.readyBagQuantity && excelItem.confirmQuantityPerPackage == crItem.packSpecification && excelItem.readyMeter == crItem.readyMeter) {
                          // 修改
                          excelItem.isAdd = 'N';
                        } else {
                          // 新增
                          excelItem.isAdd = 'Y';
                        }
                      } else {
                        if (excelItem.confirmNumber == crItem.confirmingCode && excelItem.readyDate == crItem.readyDate && excelItem.readyMeter == crItem.readyMeter) {
                          // 修改
                          excelItem.isAdd = 'N';
                        } else {
                          // 新增
                          excelItem.isAdd = 'Y';
                        }
                      }
                      
                    }
                  } else {
                    // 新增
                    excelItem.isAdd = 'Y';
                  }

                }
                
              }

            }
          }
          this.$forceUpdate();
        }
      });
      this.$forceUpdate();
    },
    // queryCompareHandle(list, element) {
    //   for (let i = 0; i < list.length; i++) {
    //     let current = list[i];
    //     let flag = true;
        
    //   }
    // },

    getSupplierDictList() {
      // 供应商列表
      supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    selectAllHandle(selection) {
      // 全选事件
//    this.checkList=e;
      console.log('触发全选事件：', selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          console.log(item)
          this.selectUuidList.push(item.uuid);
          console.log(this.selectUuidList)
          console.log(this.$refs['childMultipleTable_' + item.id])
          for (let j = 0; j < item.poiList.length; j++) {
            let cItem = item.poiList[j];
            this.childMultipleSelection.push(cItem);
//          console.log([this.$refs['childMultipleTable_' + item.id]])
            this.$nextTick(() => {
              if ([this.$refs['childMultipleTable_' + item.id]] && [this.$refs['childMultipleTable_' + item.id]].length) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
      	console.log(this.$refs['childMultipleTable_' + item.id])
        for (let i = 0; i < this.requestList.length; i++) {
          let item = this.requestList[i];
          console.log(item)
          for (let j = 0; j < item.poiList.length; j++) {
            let cItem = item.poiList[j];
            this.$nextTick(() => {
              if ([this.$refs['childMultipleTable_' + item.id]] && [this.$refs['childMultipleTable_' + item.id]].length) {
                this.$refs['childMultipleTable_' + item.id].toggleRowSelection(cItem, false);
              }
            });
          }
        }
      }
    },
  	async selectHandle(selection, row) {
      /**
       * selection 选中数据组
       * row 当前选中数据
       */
      
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
        console.log( _row.id)
        console.log(this.$refs['childMultipleTable_' + _row.id])
        if (this.selectUuidList.indexOf(_row.uuid) > -1) {
//           当前项选中状态         
          for (let i = 0; i < _row.poiList.length; i++) {
            let cItem = _row.poiList[i];
            console.log([this.$refs['childMultipleTable_' + _row.id]],[this.$refs['childMultipleTable_' + _row.id]].length)
            this.$nextTick(() => {
              if ([this.$refs['childMultipleTable_' + _row.id]] && [this.$refs['childMultipleTable_' + _row.id]].length) {
              	 console.log('进入')
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.poiList.length; i++) {
            let cItem = _row.poiList[i];
            this.$nextTick(() => {
              if ([this.$refs['childMultipleTable_' + _row.id]] && [this.$refs['childMultipleTable_' + _row.id]].length) {
                this.$refs['childMultipleTable_' + _row.id].toggleRowSelection(cItem, false);
              }
            });
            this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
              return cmsItem.uuid !== cItem.uuid;
            });
          }
        }
      } else {
        if (this.childMultipleSelection) {
          this.childMultipleSelection = [];
          console.log(this.$refs['childMultipleTable_' + _row.id])
          this.$refs['childMultipleTable_' + _row.id].clearSelection();
        }
      }
    },
    expandChange(row, rowList) {
      console.log('树形展开项：', row, rowList);
      console.log(this.selectUuidList.indexOf(row.uuid))
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.poiList.length; i++) {
          let cItem = row.poiList[i];
          console.log(this.$refs['childMultipleTable_' + row.id])
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id].length) {
              this.$refs['childMultipleTable_' + row.id][0].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    async childSelectHandle(selection, row, parentRow) {
      // 选择子项
         console.log('选择子项：', selection, row, parentRow);
         console.log(selection.length)
         console.log(this.$refs.multipleTable)
      await this.$nextTick();
      // this.childMultipleSelection = selection;
      if (selection.length === parentRow.poiList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleRowSelection(parentRow, true);
        });
      }
      this.$refs.multipleTable.toggleRowSelection(parentRow, false);
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
         console.log('子项全选操作：', selection, parentRow);
      await this.$nextTick();
      if (selection && selection.length) {
        this.$nextTick(() => {
          this.$refs.multipleTable.toggleRowSelection(parentRow, true);
        });
      }
      this.$refs.multipleTable.toggleRowSelection(parentRow, false);
    },
    toggleChildSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //获取当前年月日的时间YYYY-MM-dd格式
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear(); //年
      var month = date.getMonth() + 1; //月
      var strDate = date.getDate(); //日
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //请求类型
    requestType() {
      getrequesttype().then(response => {
        if (response.code === "0") {
          this.typeList = response.data;
        }
      });
    },
    //获取请求类型名称
    factoryTypeHandle(status) {
      //		console.log(status)
      for (var i = 0; i < this.typeList.length; i++) {
        let item = this.typeList[i];
        if (item.index == status) {
          return item.name;
        }
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
      this.getfactoryRequestList();
    },
    uploadHandle() {
      // 上传
    },
    downloadHandle() {
      // 下载
    },
    //关闭弹窗触发
    closeDialog() {
      this.loading = false;
      // this.getfactoryRequestList();
    },
    //展示列表
    getfactoryRequestList() {
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        purchaseOrderId: this.materialsCode,
        materialCode: this.materialCode,
        orderStatus: 3,
        supplierCode:this.supplierCode,
        orderConfirmStatus:this.orderConfirmCode,
        applicantName:this.applicantName,
        purchaseOrderType: this.purchaseOrderType
      };
      factorySerch(this.currentPage, this.pageSize, data).then(res => {
        console.log('工厂确认列表：', res);
        if (res.code == "0") {
          this.allpage = res.data.total;
          this.requestList = res.data.records;
          // let list = this.orderList[index].fciList
          // for (var i = 0; i < list.length; i++) {
          //   list[i].actions = {
          //     hasAdd: true
          //   };
          // }
          this.requestList.forEach((item, index) => {
            let list = item.poiList;
            item.purchaseOrderTypeName = this.factoryTypeHandle(item.purchaseOrderType);
            if(item.confirmStatus=='NotReady'){
              item.confirmStatusShow="待确认"
            }else if(item.confirmStatus=='PartiallyReady'){
              item.confirmStatusShow="部分确认"
            }else if(item.confirmStatus=='AllReady'){
              item.confirmStatusShow="已确认"
            }
            for (var i = 0; i < list.length; i++) {
              list[i].actions = {
                hasAdd: true
              };
            }
            if (item.ifShowBatchInsertButton == true) {
              item.actions = {
                hasAdd: true
              };
            }
            if (item.createTime) {
              //            item.updateTime = item.updateTime.substring(0, 10);
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }

            item.poiList.forEach((i, index) => {
              console.log(i);
              if (i.confirmPackages == null || i.confirmPackages == undefined) {
                i.confirmPackages = 0;
              }
              if (i.confirmQuantityPerPackage == null || i.confirmQuantityPerPackage == undefined) {
                i.confirmQuantityPerPackage = 0;
              }
              if (i.confirmQuantity == null || i.confirmQuantity == undefined) {
                i.confirmQuantity = 0;
              }
              if (i.offeredPackages == null || i.offeredPackages == undefined) {
                i.offeredPackages = 0;
              }
              if (i.offeredQuantityPerPackage == null || i.offeredQuantityPerPackage == undefined) {
                i.offeredQuantityPerPackage = 0;
              }
              if (i.offeredQuantity == null || i.offeredQuantity == undefined) {
                i.offeredQuantity = 0;
              }
            });
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
    showlist(index, item) {
      item.ifshowlist = !item.ifshowlist;
      this.$forceUpdate();
    },
    //子项添加addHandle
    addHandle(index, item, data) {
      console.log(item);
      console.log(index);
      this.index = index;
      console.log(data);
      this.purchaseMeasurementUnit = item.purchaseMeasurementUnit;
      this.materialId = item.materialId;
      if (data != undefined) {
        this.applicantName = data.applicantName;
        this.purchaseOrderType = data.purchaseOrderType;
      }
      this.tagtier = "child";
      this.form = [];
      this.requestListitem = item;
      this.requestFirListitem = data;
      this.requestIndex = index;
      this.dialogVisible = true;
      this.ifshow = true;
      if (this.form == "") {
        this.submittxt = "新增确认书内容才能提交!";
      } else {
        this.submittxt = "提交";
      }
      if(data.purchaseOrderTypeName=='订货采购'&&item.saleOrderId!=''){
         getFactorySeason(item.saleOrderId).then(res => {
            if (res.code === "0") {
             console.log('销售订单工厂季',res.data);
             if(res.data!=''){
               this.ifFactorySeason=true;
               this.factorySeasonData=res.data;
             }else{
               this.ifFactorySeason=false;
               this.factorySeasonData='';
             }
            }
          });
      }else{
        this.ifFactorySeason=false;
        this.factorySeasonData='';
      }
      console.log(this.form);
      let obj = {
        purchaseOrderId: item.purchaseOrderId,
        poiUuid: item.uuid
      };
      factorychildshow(obj).then(res => {
        if (res.code === "0") {
          this.tablelist = res.data;
          for (var i = 0; i < this.tablelist.length; i++) {
            let data = this.tablelist[i];
            data.purchaseMeasurementUnit = this.purchaseMeasurementUnit;
          }
        }
      });
    },
    //点击确认
    confirmBulkChange(){
      this.bulkChange=false;
      this.addfactiryconfirm(this.index, this.confirmItem);
    },
    addfactiryconfirm(index,item,data){
      this.confirmItem=item;
      this.index = index;
      this.purchaseMeasurementUnit = item.purchaseMeasurementUnit;
      if (data != undefined) {
          this.applicantName = data.applicantName;
          this.purchaseOrderType = data.purchaseOrderType;
        }
        //this.tagtier=tag;
        this.tagtier = "parent";
        this.form = [];
        this.requestListitem = item;
        this.dialogVisible = true;
        this.ifshow = false;
        this.submittxt = "提交";
        this.form = [
          {
            confirmNumber: "",
            confirmTime: "",
            offeredDate: "",
            factorySeason: "",
            discountInfo: "",
            applicantName: item.applicantName,
            uuid: ""
          }
        ];
    },
    //父向添加确认书号
   async addfactirycode(index, item, data) {
      console.log(item);
      console.log(data);
      console.log(index);
      this.confirmItem=item;
      this.index = index;
      this.purchaseMeasurementUnit = item.purchaseMeasurementUnit;
      //如果是部分确认 待确认 已确认
      if(item.confirmStatus=='PartiallyReady' || item.confirmStatus=='AllReady'){
        //判断是否货妥
        var isConfirm=false;
        for (let j = 0; j < item.poiList.length; j++) {
          let cItem = item.poiList[j];
          console.log(cItem.confirmStatus);
          if(cItem.cargoReadyStatus=='AllReady' || cItem.cargoReadyStatus=='PartiallyReady'){
            isConfirm=true;
          }
        }
        if(isConfirm){
          this.$message({
            message: "货妥信息已存在，不可批量修改",
            type: "error"
          });
        }else{
          this.bulkChange=true;
          return false;
        } 
      }else{
        if (data != undefined) {
          this.applicantName = data.applicantName;
          this.purchaseOrderType = data.purchaseOrderType;
        }
        if(item.purchaseOrderTypeName=='订货采购'&&item.saleOrderId!=''){
         await getFactorySeason(item.saleOrderId).then(res => {
              if (res.code === "0") {
              console.log('销售订单工厂季',res.data);
              if(res.data!=''){
                this.ifFactorySeason=true;
                this.factorySeasonData=res.data;
              }else{
                this.ifFactorySeason=false;
                this.factorySeasonData='';
              }
              }
            });
        }else{
          this.ifFactorySeason=false;
          this.factorySeasonData='';
        }
        this.tagtier = "parent";
        this.form = [];
        this.requestListitem = item;
        this.dialogVisible = true;
        this.ifshow = false;
        this.submittxt = "提交";
        this.form = [
          {
            confirmNumber: "",
            confirmTime: "",
            offeredDate: "",
            factorySeason:this.ifFactorySeason==true?this.factorySeasonData:"",
            ifFactorySeason:this.ifFactorySeason,//订货内贸工厂确认的工厂季默认销售订单的工厂季(下拉框禁止点击)
            discountInfo: "",
            applicantName: item.applicantName,
            uuid: ""
          }
        ];
        console.log(this.form);
      }
      
    },
    //弹框编辑
    tableupd(item, index) {
      item.flag = false;
      this.$forceUpdate();
    },
    //子项确认修改
    sureupd(item, index) {
      factorychildupd(item.id, item).then(res => {
        if (res.code == "0") {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.addfactirycode(this.requestIndex, this.requestListitem, this.requestFirListitem);
        }
      });
    },
    //弹框删除
    tabledel(item, index) {
      this.delid = item.id;
      this.dialogdelVisible = true;
    },
    //删除确定
    delVisibleclick() {
      console.log(this.delid);
      console.log(this.requestIndex, this.requestListitem, this.requestFirListitem);
      factorychilddel(this.delid).then(res => {
        if (res.code == "0") {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.dialogdelVisible = false;
          this.addHandle(this.requestIndex, this.requestListitem, this.requestFirListitem);
          this.getfactoryRequestList();
        }
      });
    },
    //新增子项信息
    addchildmsg() {
      this.ifchildshow = true;
      var currentTime = this.getNowFormatDate();  
      var addobj = {
        confirmNumber: "",
        confirmPackages: "",
        confirmQuantityPerPackage: "",
        confirmQuantity: "",
        confirmTime: currentTime,
        factorySeason:this.ifFactorySeason==true?this.factorySeasonData:"",
        discountInfo: "",
        ifFactorySeason:this.ifFactorySeason,//订货内贸工厂确认的工厂季默认销售订单的工厂季(下拉框禁止点击)
        offeredDate: this.requestListitem.offeredDate,
        purchaseMeasurementUnit: this.purchaseMeasurementUnit,
        uuid: "",
        materialCode: this.requestListitem.materialCode,
        materialName: this.requestListitem.materialName,
        poiUuid: this.requestListitem.uuid,
        priUuid: this.requestListitem.priUuid,
        purchaseOrderId: this.requestListitem.purchaseOrderId,
        requiredPackages: this.requestListitem.requiredPackages,
        requiredQuantity: this.requestListitem.requiredQuantity,
        requiredQuantityPerPackage: this.requestListitem.requiredQuantityPerPackage,
        supplierCode: this.requestListitem.supplierCode,
        supplierName: this.requestListitem.supplierName,
        orderCreateTime: this.requestListitem.createTime,
        offeredPackages: this.requestListitem.offeredPackages,
        offeredQuantityPerPackage: this.requestListitem.offeredQuantityPerPackage,
        offeredQuantity: this.requestListitem.offeredQuantity,
        purchaseOrderSn:this.requestListitem.purchaseOrderSn,
        // offeredDate:this.requestListitem.offeredDate,
        subInventory: this.requestListitem.subInventory,
        subInventoryName: this.requestListitem.subInventoryName,
        virtualInventoryId: this.requestListitem.virtualInventoryId,
        virtualInventoryName: this.requestListitem.virtualInventoryName,
        applicantName: this.applicantName,
        purchaseOrderType: this.purchaseOrderType,
        materialId: this.materialId,
        supplierShortName: this.requestListitem.supplierShortName,
        purchaseRemark: this.requestListitem.purchaseRemark
      };
      console.log(addobj.factorySeason)
      purchasegetuuid().then(res => {
        if (res.code === "0") {
          addobj.uuid = res.data;
        }
      });
      this.form.push(addobj);
      if (this.form != "") {
        this.submittxt = "提交";
      } else {
        this.submittxt = "新增确认书内容才能提交!";
      }
      this.$forceUpdate();
    },
    //删除
    childdel(index, item) {
      this.form.splice(index, 1);
      if (this.form != "") {
        this.submittxt = "提交";
      } else {
        this.submittxt = "新增确认书内容才能提交!";
      }
      this.$forceUpdate();
    },
    //新增提交
    draftsave() {
      console.log(this.form);
      if (this.tagtier == "child") {
        this.loading = true;
        for (var i = 0; i < this.form.length; i++) {
          var item = this.form[i];
          if (item.purchaseMeasurementUnit == "米") {
            if (
              item.confirmPackages == "" ||
              item.confirmQuantityPerPackage == "" ||
              item.confirmQuantity == "" ||
              item.confirmTime == "" ||
              item.offeredDate == "" ||
              item.confirmNumber == "" ||
              item.factorySeason == "" ||
              item.uuid == ""
            ) {
              this.ifsure = false;
            } else {
              this.ifsure = true;
            }
          } else {
            if (
              item.confirmQuantity == "" ||
              item.confirmTime == "" ||
              item.offeredDate == "" ||
              item.confirmNumber == "" ||
              item.factorySeason == "" ||
              item.uuid == ""
            ) {
              this.ifsure = false;
            } else {
              this.ifsure = true;
            }
          }
        }
        if (this.ifsure == false) {
          this.$message({
            message: "除折扣信息其他填写项均不能为空!!",
            type: "error"
          });
          this.loading = false;
        } else {
          factorychildadd(this.form).then(res => {
            if (res.code == "0") {
              this.dialogVisible = false;
              this.loading = false;
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.currentPage=1;
              this.getfactoryRequestList();
            } else {
              this.loading = false;
            }
            setTimeout(() => {
              this.loading = false;
            }, 10000);
          });
        }
      } else {
        this.loading = true;
        if (
          this.requestListitem.id == "" ||
          this.form[0].confirmNumber == "" ||
          this.form[0].confirmTime == "" ||
          this.form[0].confirmTime == null ||
          this.form[0].offeredDate == "" ||
          this.form[0].offeredDate == null ||
          this.form[0].factorySeason == ""
        ) {
          this.$message({
            message: "除折扣信息其他填写项均不能为空!!",
            type: "error"
          });
          this.loading = false;
        } else {
          // this.requestListitem.applicantName
          factoryparentadd(
            this.requestListitem.id,
            this.form[0].confirmNumber,
            this.form[0].confirmTime,
            this.form[0].offeredDate,
            this.form[0].factorySeason,
            this.form[0].discountInfo
          ).then(res => {
            if (res.code == "0") {
              this.dialogVisible = false;
              this.loading = false;
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.currentPage=1;
              this.getfactoryRequestList();
            } else {
              this.loading = false;
            }
            setTimeout(() => {
              this.loading = false;
            }, 10000);
          });
        }
      }
    },
    //加减输入框触发
    handleChange(value) {
      console.log(value);
      if (!value) {
        this.$message({
          message: "数值不能为空,请重新输入！！！",
          type: "error"
        });
      } else {
        for (var i = 0; i < this.form.length; i++) {
          let data = this.form[i];
          console.log(data.confirmPackages.toString().length);
          if (data.confirmPackages.toString().length > 9) {
            this.$message({
              message: "超长字符,请重新输入！",
              type: "error"
            });
            data.confirmPackages = "";
          } else if (data.confirmQuantityPerPackage.toString().length > 9) {
            this.$message({
              message: "超长字符,请重新输入！",
              type: "error"
            });
            data.confirmQuantityPerPackage = "";
          }
        }
      }
    },
    handleSizeChange(val) {
      this.listLoading = true;
      this.pageSize = val;
      this.getfactoryRequestList();
    },
    handleCurrentChange(val) {
      this.listLoading = true;
      this.currentPage = val;
      this.getfactoryRequestList();
    },
    //订单工厂确认状态OrderConfirmStatus
    getFactoryStatus() {
      fabrictypedictionaries('ConfirmStatus').then(response => {
        if(response.code === "0") {
          this.orderConfirmStatuslist = response.data;
        }
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
ul.parentlist li:nth-child(4) {
  /*padding:8px;*/
}

.inputtext {
  display: inline-flex;
  div {
    margin-right: 5px;
  }
  div:last-child {
    margin-right: 0;
  }
}
.inputtext .el-input-number--mini {
  width: 80px;
  line-height: 27px;
}
input.sure {
  width: 150px;
  height: 40px;
  border-radius: 3px;
  border: 1px solid #ccc;
  text-indent: 2em;
  color: #606266;
  border: 1px solid #dcdfe6;
}
.sure::-webkit-input-placeholder {
  color: #c1c5cd;
}
.sure:-moz-placeholder {
  color: #c1c5cd;
}
.sure:-ms-input-placeholder {
  color: #c1c5cd;
}

.dialogadd {
  margin-top: 15px;
}
.dialogadd .dialog_title {
  display: flex;
  span {
    margin-top: 8px;
    margin: 8px 8px;
    font-weight: bold;
    font-size: 15px;
  }
}
.dialog_content {
  margin-top: 10px;
}

.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.factoryconfirm {
  .actions_part {
    margin: 10px 0;
  }
}

table.contenttab td button {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

li.el-select-dropdown__item.hover {
  width: 100%;
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
ul.parentlist {
  cursor: pointer;
}
form.el-form.demo-form-inline {
  display: flex;
}
form.el-form.demo-form-inline .el-form-item {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 0px;
}
// button.el-button.el-button--danger.is-circle {
//   padding: 3px;
//   margin-top: 10px;
// }
.formtable {
  ul.demo-form-inline {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 10px;
    li {
      width: auto;
      padding: 0 10px;
      font-size: 14px;
      color: #606266;
      .el-input-number--mini {
        width: 80px;
        height: 40px;
      }

      .el-input-number.is-controls-right .el-input__inner {
        padding-right: 0;
        height: 40px;
      }
      span {
        margin-left: 5px;
        margin-right: 10px;
      }
      select {
        width: 145px;
      }
      .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
        width: 150px;
      }
      .el-select {
        width: 145px;
      }
    }
    li:first-child {
      padding: 0px 0;
    }
    li:nth-child(3),
    li:nth-child(4) {
      padding: 0px 0;
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}
select.selectstatus {
  width: 150px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  cursor: pointer;
  font-size: 14px;
}

select.selectstatus > option {
  cursor: pointer;
  font-size: 14px;
}
</style>
<style>
.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.el-dialog {
  overflow-y: auto;
}
</style>