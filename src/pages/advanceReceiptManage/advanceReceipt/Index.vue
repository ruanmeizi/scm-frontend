<template>
  <div class="container advancereceipt">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
      	<div class="actions_wrap">
          <div v-if="activeName === 'Requisition'" class="inline_block mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="inline_block mr10 mb10">
            <span class="tag">调拨单编号：</span>
            <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="请输入"></el-input>
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
          <div class="inline_block mr10 mb10" v-if="this.activeName=='Requisition'">
            <span class="tag">调拨类型：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="allocationType"
              placeholder="请选择"
              @change="searchHandle">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in transferTypeList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
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
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button  v-if="disabledbo!=true" type="primary" @click="excelDownload">导出Excel</el-button>
       <el-button  v-if="activeName === 'Requisition' && disabledbo!=true" class="create_btn" type="primary" @click="createAdvanceReceipt">创建预收货清单</el-button>
          <el-button v-if="disabledbo" type="primary" @click="downloadHandle">导出Excel</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
          <el-button
            v-if="activeName === 'Requisition' && disabledbo!=true"
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
        <div v-if="disabledbo">
          <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
            <el-tab-pane
              v-for="item in subNavLists"
              :key="item.value"
              :label="item.label"
              :name="item.value"
              v-loading="tableLoading">
              <!-- 调拨单 -->
              <div v-if="item.value == 'Requisition'">
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  :data="requisitionList"
                  row-key="id"
                  :expand-row-keys="expands"
                  @row-click="rowClick"
                  border
                  fit
                  stripe
                  @expand-change="expandChange"
                  @select="selectHandle"
                  @select-all="selectAllHandle">
                  <el-table-column type="selection" />
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div class="actions_wrap mb20 clearfix">
                        <el-button class="fr" type="primary" v-if="disabledbo!=true" @click="childRequisitionExcelDownload(scope.row)">导出Excel</el-button>
                      </div>
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        :data="scope.row.faItemList"
                        border
                        fit
                        @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                        @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }"
                      >
                        <el-table-column fixed type="selection" />
                        <el-table-column fixed label="行号">
                          <template slot-scope="{ row }">
                            {{ row.lineNum }}
                          </template>
                        </el-table-column>
                        <el-table-column fixed label="物料编号">
                          <template slot-scope="{ row }">
                            {{ row.materialCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmNumbers }}
                          </template>
                        </el-table-column>
                        <el-table-column label="销售订单编号">
                          <template slot-scope="{ row }">
                            {{ row.saleOrderId }}
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨单总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.allocationPackages ? row.allocationPackages : 0) + '包 ' + (row.allocationQuantityPerPackage ? row.allocationQuantityPerPackage : 0) + '米/包 ' + (row.allocationQuantity ? row.allocationQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.allocationQuantity ? row.allocationQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="已调拨总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.realBagQuantity ? row.realBagQuantity : 0) + '包 ' + (row.realQuantity ? row.realQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.realQuantity ? row.realQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="已入库总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.receivedBagQuantity ? row.receivedBagQuantity : 0) + '包 ' + (row.receivedQuantity ? row.receivedQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.receivedQuantity ? row.receivedQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="实际发票数量">
                          <template slot-scope="{ row }">
                            {{ (row.realQuantity ? row.realQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                        <!-- <el-table-column label="实际发货包数">
                          <template slot-scope="{ row }">
                            {{ (row.realBagQuantity ? row.realBagQuantity : 0) + '包' }}
                          </template>
                        </el-table-column> -->
                        <!-- <el-table-column label="已入库数">
                          <template slot-scope="{ row }">
                            {{ (row.receivedQuantity ? row.receivedQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨编号">
                    <template slot-scope="{ row }">
                      {{ row.factoryAllocationCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨类型">
                    <template slot-scope="{ row }">
                      {{ row.allocationTypeName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="销售订单编号">
                    <template slot-scope="{ row }">
                      <span v-if="row.allocationTypeNameTag == '客订'">{{ row.saleOrderId }}</span>
                      <span v-else></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="客户名称">
                    <template slot-scope="{ row }">
                      <span v-if="row.allocationTypeNameTag == '客订'">{{ row.customerName }}</span>
                      <span v-else></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">
                      <!-- {{ row.supplierName }} -->
                      {{ row.supplierShortName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨单创建时间">
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
              </div>
              
              <div v-else>
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  v-loading="listLoading"
                  :data="receiptList"
                  row-key="id"
                  :expand-row-keys="expands"
                  @row-click="rowClick"
                  border
                  fit
                  stripe>
                  <!-- <el-table-column type="selection" /> -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div class="actions_wrap mb20 clearfix">
                        <el-button class="fr mr10" type="primary" @click="childReceiptExcelDownload(scope.row)">导出Excel</el-button>
                        <el-button v-if="scope.row.auditStatus == 'Draft' || scope.row.auditStatus == 'Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                      </div>
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        v-loading="childListLoading"
                        :data="scope.row.receiptListItemLists"
                        border
                        fit>
                        <!-- <el-table-column fixed type="selection" /> -->
                        <el-table-column fixed label="行号">
                          <template slot-scope="{ row }">
                            {{ row.lineNum }}
                          </template>
                        </el-table-column>
                        <el-table-column fixed label="物料编号">
                          <template slot-scope="{ row }">
                            {{ row.materialCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨单号">
                          <template slot-scope="{ row }">
                            {{ row.factoryAllocationCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmingCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="批次号">
                          <template slot-scope="{ row }">
                            {{ row.batchNumber }}
                          </template>
                        </el-table-column>
                        <el-table-column label="发票数量">
                          <template slot-scope="{ row }">
                            {{ (row.realityNumber ? row.realityNumber : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                            <!-- {{ (row.batchMeter ? row.batchMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                            {{ (row.packSpecification ? row.packSpecification : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }} -->
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨数量">
                          <template slot-scope="{ row }">
                            {{ (row.transferMeter ? row.transferMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column>
                        <el-table-column label="行金额">
                          <template slot-scope="{ row }">
                            {{ row.money }}
                          </template>
                        </el-table-column>
                        <el-table-column label="修改后行金额" v-if="scope.row.auditStatus == 'Approved'">
                          <template slot-scope="{ row }">
                            {{ row.revisedMoney }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="采购金额"> -->
                        <el-table-column label="采购单价">
                          <template slot-scope="{ row }">
                            {{ row.offeredPrice }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="实际发货数量">
                          <template slot-scope="{ row }">
                            {{ (row.realityNumber ? row.realityNumber : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                        <el-table-column label="实际收货数量">
                          <template slot-scope="{ row }">
                            {{ (row.realReceiveQuantity ? row.realReceiveQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column>
                        <el-table-column label="销售订单编号">
                          <template slot-scope="{ row }">
                            {{ row.saleOrderId }}
                          </template>
                        </el-table-column>
                        <el-table-column label="最新编辑时间">
                          <template slot-scope="{ row }">
                            {{ row.updateTime }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作">
                          <template slot-scope="{ row, $index }">
                            <el-button class="el-icon-document" type="primary" circle size="mini" title="查看" @click.stop="checkChildHandle($index, row)"></el-button>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column label="预收货清单编号">
                    <template slot-scope="{ row }">
                      {{ row.prepareReceiptCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">
                      <!-- {{ row.supplierName }} -->
                      {{ row.supplierShortName }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="已上传发票数量">
                    <template slot-scope="{ row }">
                      {{ row.factoryInvoiceNum }}
                    </template>
                  </el-table-column> -->
                  <el-table-column label="已上传箱单数量">
                    <template slot-scope="{ row }">
                      {{ row.packingListQuantity }}
                    </template>
                  </el-table-column>
                  <el-table-column label="工厂发票号">
                    <template slot-scope="{ row }">
                      {{ row.factoryInvoice }}
                    </template>
                  </el-table-column>
                  <el-table-column label="币种">
                    <template slot-scope="{ row }">
                      {{ row.currencyName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="快递单号">
                    <template slot-scope="{ row }">
                      {{ row.courierNo }}
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
                  <el-table-column label="审批">
                    <template slot-scope="{ row, $index }">
                      <el-popover
                        placement="right"
                        width="300"
                        trigger="hover"
                        @show="checkApprovalProcess(row, $index)">
                        <div>
                          <i class="block">
                            审批人：
                            <em>{{ row.fullName }}</em>
                          </i>
                          <i class="block mt10 mb10">
                            审批时间：
                            <em>{{ row.approvalTime }}</em>
                          </i>
                          <i class="block">
                            审批意见：
                            <em>{{ row.content }}</em>
                          </i>
                        </div>
                        <el-tag slot="reference" class="pointer" :type="row.auditStatus | statusFilter">{{ row.auditStatusName }}</el-tag>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="170px">
                    <template slot-scope="{ row, $index }">
                      <div v-if="row.auditStatus == 'Approving' || row.auditStatus == 'Approved'">
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                      </div>
                      <div v-if="row.auditStatus == 'Draft' || row.auditStatus == 'Rejected'">
                        <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                        <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                      </div>
                      <div v-if="row.auditStatus == 'Terminated'">
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            
          </el-tabs>
        </div>
        <div v-else>
          <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
            <el-tab-pane
              v-for="item in subNavList"
              :key="item.value"
              :label="item.label"
              :name="item.value"
              v-loading="tableLoading">
              <!-- 调拨单 -->
              <div v-if="item.value == 'Requisition'">
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  :data="requisitionList"
                  row-key="id"
                  :expand-row-keys="expands"
                  @row-click="rowClick"
                  border
                  fit
                  stripe
                  @expand-change="expandChange"
                  @select="selectHandle"
                  @select-all="selectAllHandle">
                  <el-table-column type="selection" />
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div class="actions_wrap mb20 clearfix">
                        <el-button class="fr" type="primary" @click="childRequisitionExcelDownload(scope.row)">导出Excel</el-button>
                      </div>
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        :data="scope.row.faItemList"
                        border
                        fit
                        @select="(selection, row) => { childSelectHandle(selection, row, scope.row) }"
                        @select-all="(selection) => { childSelectAllHandle(selection, scope.row) }">
                        <el-table-column fixed type="selection" />
                        <el-table-column fixed label="行号">
                          <template slot-scope="{ row }">
                            {{ row.lineNum }}
                          </template>
                        </el-table-column>
                        <el-table-column fixed label="物料编号">
                          <template slot-scope="{ row }">
                            {{ row.materialCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmNumbers }}
                          </template>
                        </el-table-column>
                        <el-table-column label="销售订单编号">
                          <template slot-scope="{ row }">
                            {{ row.saleOrderId }}
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨单总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.allocationPackages ? row.allocationPackages : 0) + '包 ' + (row.allocationQuantityPerPackage ? row.allocationQuantityPerPackage : 0) + '米/包 ' + (row.allocationQuantity ? row.allocationQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.allocationQuantity ? row.allocationQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="已调拨总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.realBagQuantity ? row.realBagQuantity : 0) + '包 ' + (row.realQuantity ? row.realQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.realQuantity ? row.realQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="已入库总数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.receivedBagQuantity ? row.receivedBagQuantity : 0) + '包 ' + (row.receivedQuantity ? row.receivedQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.receivedQuantity ? row.receivedQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="实际发票数量">
                          <template slot-scope="{ row }">
                            {{ (row.realQuantity ? row.realQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                        <!-- <el-table-column label="实际发货包数">
                          <template slot-scope="{ row }">
                            {{ (row.realBagQuantity ? row.realBagQuantity : 0) + '包' }}
                          </template>
                        </el-table-column> -->
                        <!-- <el-table-column label="已入库数">
                          <template slot-scope="{ row }">
                            {{ (row.receivedQuantity ? row.receivedQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨编号">
                    <template slot-scope="{ row }">
                      {{ row.factoryAllocationCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨类型">
                    <template slot-scope="{ row }">
                      {{ row.allocationTypeName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="销售订单编号">
                    <template slot-scope="{ row }">
                      <span v-if="row.allocationTypeNameTag == '客订'">{{ row.saleOrderId }}</span>
                      <span v-else></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="客户名称">
                    <template slot-scope="{ row }">
                      <span v-if="row.allocationTypeNameTag == '客订'">{{ row.customerName }}</span>
                      <span v-else></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">
                      <!-- {{ row.supplierName }} -->
                      {{ row.supplierShortName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨单创建时间">
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
              </div>
              
              <div v-else>
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  v-loading="listLoading"
                  :data="receiptList"
                  row-key="id"
                  :expand-row-keys="expands"
                  @row-click="rowClick"
                  border
                  fit
                  stripe>
                  <!-- <el-table-column type="selection" /> -->
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <div class="actions_wrap mb20 clearfix">
                        <el-button class="fr mr10" type="primary" @click="childReceiptExcelDownload(scope.row)">导出Excel</el-button>
                        <el-button v-if="scope.row.auditStatus == 'Draft' || scope.row.auditStatus == 'Rejected'" class="fr mr10" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                      </div>
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        v-loading="childListLoading"
                        :data="scope.row.receiptListItemLists"
                        border
                        fit>
                        <!-- <el-table-column fixed type="selection" /> -->
                        <el-table-column fixed label="行号">
                          <template slot-scope="{ row }">
                            {{ row.lineNum }}
                          </template>
                        </el-table-column>
                        <el-table-column fixed label="物料编号">
                          <template slot-scope="{ row }">
                            {{ row.materialCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨单号">
                          <template slot-scope="{ row }">
                            {{ row.factoryAllocationCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmingCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="批次号">
                          <template slot-scope="{ row }">
                            {{ row.batchNumber }}
                          </template>
                        </el-table-column>
                        <el-table-column label="发票数量">
                          <template slot-scope="{ row }">
                            {{ (row.realityNumber ? row.realityNumber : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                            <!-- {{ (row.batchMeter ? row.batchMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                            {{ (row.packSpecification ? row.packSpecification : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }} -->
                          </template>
                        </el-table-column>
                        <el-table-column label="调拨数量">
                          <template slot-scope="{ row }">
                            {{ (row.transferMeter ? row.transferMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column>
                        <el-table-column label="行金额">
                          <template slot-scope="{ row }">
                            {{ row.money }}
                          </template>
                        </el-table-column>
                        <el-table-column label="修改后行金额" v-if="scope.row.auditStatus == 'Approved'">
                          <template slot-scope="{ row }">
                            {{ row.revisedMoney }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="采购金额"> -->
                        <el-table-column label="采购单价">
                          <template slot-scope="{ row }">
                            {{ row.offeredPrice }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="实际发货数量">
                          <template slot-scope="{ row }">
                            {{ (row.realityNumber ? row.realityNumber : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column> -->
                        <el-table-column label="实际收货数量">
                          <template slot-scope="{ row }">
                            {{ (row.realReceiveQuantity ? row.realReceiveQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}
                          </template>
                        </el-table-column>
                        <el-table-column label="销售订单编号">
                          <template slot-scope="{ row }">
                            {{ row.saleOrderId }}
                          </template>
                        </el-table-column>
                        <el-table-column label="最新编辑时间">
                          <template slot-scope="{ row }">
                            {{ row.updateTime }}
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作">
                          <template slot-scope="{ row, $index }">
                            <el-button class="el-icon-document" type="primary" circle size="mini" title="查看" @click.stop="checkChildHandle($index, row)"></el-button>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column label="预收货清单编号">
                    <template slot-scope="{ row }">
                      {{ row.prepareReceiptCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">
                      <!-- {{ row.supplierName }} -->
                      {{ row.supplierShortName }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="已上传发票数量">
                    <template slot-scope="{ row }">
                      {{ row.factoryInvoiceNum }}
                    </template>
                  </el-table-column> -->
                  <el-table-column label="已上传箱单数量">
                    <template slot-scope="{ row }">
                      {{ row.packingListQuantity }}
                    </template>
                  </el-table-column>
                  <el-table-column label="工厂发票号">
                    <template slot-scope="{ row }">
                      {{ row.factoryInvoice }}
                    </template>
                  </el-table-column>
                  <el-table-column label="币种">
                    <template slot-scope="{ row }">
                      {{ row.currencyName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="快递单号">
                    <template slot-scope="{ row }">
                      {{ row.courierNo }}
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
                  <el-table-column label="审批">
                    <template slot-scope="{ row, $index }">
                      <el-popover
                        placement="right"
                        width="300"
                        trigger="hover"
                        @show="checkApprovalProcess(row, $index)">
                        <div>
                          <i class="block">
                            审批人：
                            <em>{{ row.fullName }}</em>
                          </i>
                          <i class="block mt10 mb10">
                            审批时间：
                            <em>{{ row.approvalTime }}</em>
                          </i>
                          <i class="block">
                            审批意见：
                            <em>{{ row.content }}</em>
                          </i>
                        </div>
                        <el-tag slot="reference" class="pointer" :type="row.auditStatus | statusFilter">{{ row.auditStatusName }}</el-tag>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="170px">
                    <template slot-scope="{ row, $index }">
                      <div v-if="row.auditStatus == 'Approving' || row.auditStatus == 'Approved'">
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                      </div>
                      <div v-if="row.auditStatus == 'Draft' || row.auditStatus == 'Rejected'">
                        <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                        <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                      </div>
                      <div v-if="row.auditStatus == 'Terminated'">
                        <el-button class="el-icon-truck" type="primary" circle size="mini" title="关联快递单号" @click.stop="editCourierNo($index, row)"></el-button>
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
            
          </el-tabs>
        </div>
        <div class="pagination_wrap fr">
          <el-pagination
            v-if="activeName === 'Requisition'"
            @size-change="rHandleSizeChange"
            @current-change="rHandleCurrentChange"
            :current-page.sync="rCurrentPage"
            :page-sizes="[10, 50]"
            :page-size="rPageSize"
            layout="sizes, total, prev, pager, next"
            :total="rTotal">
          </el-pagination>
          <el-pagination
            v-else
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
    </div>

    <!-- 编辑页 -->
    <div v-else v-loading="editPartLoading">
      <div class="upload_wrap mb30">
        <div class="display_ib v_top mr20">
          <p class="upload_tit display_ib v_top"><span class="red mr5">*</span>上传箱单</p>
          <el-upload
            class="upload-demo ml10 display_ib"
            :headers="headers"
            :action="uploadUrl + '/infrastructure/v1/attachments/upload'"
            multiple
            :before-upload="beforeUploadPackList"
            :on-exceed="handleExceedPackList"
            :on-success="handleSuccessPackList"
            :on-remove="handleRemovePackList"
            :data="{uuid: editReceiptList.uuid, type: '1'}"
            :file-list="uploadPackingList"
            :show-file-list="true">
            <el-button size="small" type="primary">上传文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名：doc、docx、pdf、jpg</div>
          </el-upload>
        </div>
        <div class="display_ib v_top">
          <p class="upload_tit display_ib v_top"><span class="red mr5">*</span>上传工厂发票</p>
          <el-upload
            class="upload-demo ml10 display_ib"
            :headers="headers"
            :action="uploadUrl + '/infrastructure/v1/attachments/upload'"
            multiple
            :before-upload="beforeUploadInvoiceList"
            :on-exceed="handleExceedInvoiceList"
            :on-success="handleSuccessInvoiceList"
            :on-remove="handleRemoveInvoiceList"
            :data="{uuid: editReceiptList.uuid, type: '2'}"
            :file-list="uploadInvoiceList"
            :show-file-list="true"
            :limit="1">
            <el-button size="small" type="primary">上传文件</el-button>
            <div slot="tip" class="el-upload__tip">支持扩展名：doc、docx、pdf、jpg</div>
          </el-upload>
        </div>
      </div>
      <div class="clearfix mb10">
        <div class="display_ib mr20">
          <!-- <span style="font-size: 14px; color: #303133;">供应商：{{editReceiptList.supplierName ? editReceiptList.supplierName : ''}}</span> -->
          <span style="font-size: 14px; color: #303133;">供应商：{{editReceiptList.supplierShortName ? editReceiptList.supplierShortName : ''}}</span>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;">上传箱单数量：{{editReceiptList.packingListQuantity ? editReceiptList.packingListQuantity : '0'}}</span>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>工厂发票号：</span>
          <el-input class="input_single w200 mr10 mb10" v-model.trim="editReceiptList.factoryInvoice" placeholder="" @change="factoryInvoiceChange"></el-input>
        </div>
        <div
          class="button inline_block mr10 mt10"
          style="margin:10 10px;"
          >
          <el-button
            size="small"
            type="primary"
            title="拉取数据"
            icon="el-icon-refresh-right"
            @click="pullDataHandle"
            circle
          ></el-button>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>工厂发票时间：</span>
          <el-date-picker
            class="w200"
            size="middle"
            value-format="yyyy-MM-dd"
            v-model="editReceiptList.factoryInvoiceTime"
            @change="factoryInvoiceTimeChange"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;">付款条件：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="paymentCondition"
            @change="paymentConditionChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in paymentConditionList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>到期日期：</span>
          <el-date-picker
            class="w200"
            size="middle"
            value-format="yyyy-MM-dd"
            v-model="editReceiptList.paymentTerms"
            @input="paymentTermsChange"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>贸易条款：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editReceiptList.tradeTerms"
            @change="tradeTermsSelect"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in tradeTermsList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>币种：</span>
          <el-select class="select_single w200 mr10 mb10"
            v-model="editReceiptList.currency"
            @change="currencyChange"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in currencyList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;">发票数量总计：{{editReceiptList.invoiceTotalQuantity ? editReceiptList.invoiceTotalQuantity : 0}}</span>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>发票总金额：</span>
          <el-input class="input_single w200 mr10 mb10" v-model.trim="editReceiptList.invoiceTotalMoney" placeholder="" @input.native="invoiceTotalMoneyInput"></el-input>
        </div>
        <div class="display_ib mr20">
          <span style="font-size: 14px; color: #303133;">差额：{{editReceiptList.invoiceTotalMoneyDifference ? editReceiptList.invoiceTotalMoneyDifference : 0}}</span>
        </div>
        <!-- <el-button
          class="fr"
          size="small"
          type="primary"
          icon="el-icon-plus"
          circle
          title="添加"
          @click="addEditHandle"
        ></el-button> -->
      </div>
      <upload-excel-component v-if="editType === 'edit'" class="mb20" :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />
      <div class="edit_wrap hidden">
        <!-- 编辑组件 -->
        <editTable
          :tableList="editReceiptList.receiptListItemLists"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          @deleteHandle="deleteEditItemHandle"
          @inputChange="inputChange"
          @numberInputChange="numberInputChange">
        </editTable>

        <div class="edit_btn_wrap mt20 fr">
          <el-button type="success" @click.stop="createBatchNumberHandle">生成工厂批次号</el-button>
          <el-button @click="cancelEditHandle">取消/关闭</el-button>
          <!-- <el-button type="primary" v-preventReClick @click.stop="saveEditHandle">保存</el-button>
          <el-button type="primary" v-preventReClick @click.stop="submitEditHandle">提交审批</el-button> -->
          <el-button type="primary" :disabled="isSaveDisabled" @click="saveEditHandle">保存</el-button>
          <el-button type="primary" :disabled="isSubmitDisabled" @click="submitEditHandle">提交审批</el-button>
        </div>
      </div>
    </div>

    <!-- 查看弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="checkpopupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="checkDialogVisible">
        <el-tabs>
          <div class="mb20">
            <span class="mr15">物料编号：{{materialFullData.materialCode}}</span>
          </div>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in checkFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in materialFullData.preBatchList"
              :key="index">
              <li class="w20p" :title="item.confirmingCode ? item.confirmingCode : ''">{{item.confirmingCode ? item.confirmingCode : ''}}</li>
              <li class="w20p" :title="item.batchNumber ? item.batchNumber : ''">{{item.batchNumber ? item.batchNumber : ''}}</li>
              <li class="w15p" >
              	<div v-if="item.purchaseMeasurementUnit == '米'" :title="item.realityNumber ? item.realityNumber + '米' : ''">{{item.realityNumber ? item.realityNumber + '米' : ''}}</div>
              	<div v-else>
              		<span :title="item.realityNumber ? item.realityNumber +item.purchaseMeasurementUnit : ''" v-if="item.purchaseMeasurementUnit!=null&&item.purchaseMeasurementUnit!=''">{{item.realityNumber ? item.realityNumber + item.purchaseMeasurementUnit : ''}}</span>
              	  <span :title="item.realityNumber ? item.realityNumber + '条' : ''"  v-else>{{item.realityNumber ? item.realityNumber + '条' : ''}}</span>
              	</div>
              </li>
              <li class="w20p" :title="item.saleOrderId ? item.saleOrderId : ''">{{item.saleOrderId ? item.saleOrderId : ''}}</li>
              <li class="w25p" :title="item.updateTime ? item.updateTime : ''">{{item.updateTime ? item.updateTime : ''}}</li>
            </ul>
          </div>
        </el-tabs>
      </el-dialog>
    </div>
    <!-- 编辑快递单号弹框 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in popupFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist">
              <li class="w35p">
                <span>{{addEdit.prepareReceiptCode}}</span>
              </li>
              <li class="w35p">
                <el-input
                  class="w200"
                  size="small"
                  maxlength="100"
                  v-model="addEdit.courierNo"
                  @input="courierNoChange"
                  placeholder="单行输入"
              ></el-input>
              </li>
            </ul>
          </div>
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="dialogConfirmHandle">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    
    <!-- 导出弹窗 -->
    <div class="popup_part">
      <el-dialog
        title="导出"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="exportDialogVisible">
        <el-tabs>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in exportFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in childMultipleSelection"
              :key="index">
              <li class="w10p" :title="index + 1">{{index + 1}}</li>
              <li class="w30p" :title="item.factoryAllocationCode ? item.factoryAllocationCode : ''">{{item.factoryAllocationCode ? item.factoryAllocationCode : ''}}</li>
              <li class="w30p" :title="item.supplierName ? item.supplierName : ''">{{item.supplierName ? item.supplierName : ''}}</li>
              <li class="w30p" :title="item.allocationTypeName ? item.allocationTypeName : ''">{{item.allocationTypeName ? item.allocationTypeName : ''}}</li>
            </ul>
          </div>
          <div class="edit_btn_wrap mt10 fr">
            <el-button @click="exportDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmExportHandle">确定</el-button>
          </div>
        </el-tabs>
      </el-dialog>
    </div>

    <!-- 删除弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="deleteDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isDeleteDisabled" @click="confirmDeleteHandle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 提交审批弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="submitDialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>确定提交审批？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSubmitHandle">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import Excel from "@/layouts/components/Excel.vue";
import { getUUID, approvalProcessInfo } from "@/api/publicApi.js";
import {
  advanceReceiptList,
  editAdvanceReceipt,
  submitPrepareReceipt,
  batchNumberFallInfo,
  batchNumberList,
  searchRequisitionItem,
  deleteUploadFile,
  searchUploadFiles,
  updatePackingQuantity,
  deletePurchaseOrder,
  modifyPurchaseOrder,
  submitModifyPurchaseOrder,
  requisitionList,
  prepareReceiptList,
  purchasegetuuid,
  addRequisitionList,
  supplierDictList,
  deletePrepareReceipt,
  editPrepareReceipt,
  constDictList,
  exportExcel,
  factoryInvoice,
  addOrUpdate
} from "@/api/module/purchaseApi.js";
import { timeFormat, ssoPermission, verificationQuantity, excelDateFormatToDate, getTimeRange, addDate } from '@/utils/index.js';
import { currencyTypeHandle, statusTypeHandle} from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "advanceReceipt",
  props: {
  disabledbo: Boolean
    },
  data() {
    return {
      tableLoading: true,
      headers: '',
      apiUrl: process.env.VUE_APP_SCM_URL,
      uploadUrl: process.env.VUE_APP_INFRASTRUCTURE_URL,
      type: '',
      dateVal: '',
      requisitionCode: '',
      requestCode: '',
      startTime: '',
      endTime: '',
      prepareReceiptCode: '',
      supplierCode: '',
      supplierName: '',
      customerId: '',
      purchaseOrderId: '',
      uuid: '',
      allocationStatus: '',
      allocationType: '',
      faDeleteStatus: '',
      factoryAllocationCode: '',
      rev: '',
      orderList: [],
      editOrderData: {},
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      rTotal: 0,
      rPageSize: 10, //每页显示条数
      rCurrentPage: 1, //页数
      activeName: 'Requisition',
      popupTitle: '',
      deleteId: '',
      dialogFormVisible: false,
      checkDialogVisible: false,
      exportDialogVisible: false,
      deleteDialogVisible: false,
      submitDialogVisible: false,
      isSubmitDisabled: false,
      checkList: [],
      submitParamsData: {},
      fileList: [],
      uploadPackingList: [],
      uploadInvoiceList: [],
      requisitionList: [],
      receiptList: [],
      checkRequisitionList: [],
      factoryInvoice: [],
      packingList: [],
      packFileType: '',
      invoiceFileType: '',
      isShowList: false,
      dialogdelVisible: false,
      supplierList: [],
      tradeTermsList: [],
      currencyList: [],
      transferTypeList:[],
      auditStatus: '',
      materialCode: '',
      isShowEdit: false,
      paymentCondition: '',
      editReceiptList: {},
      curUuid: '',
      expands: [],

      // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: false,
      childListLoading: false,
      selectUuidList: [],
      checkedIdList: [],
      checkedUuidList: [],
      editPartLoading: false,

      paymentConditionList: [
        {
          name: '发票日+0天',
          index: '0'
        },
        {
          name: '发票日+10天',
          index: '10'
        },
        {
          name: '发票日+30天',
          index: '30'
        },
        {
          name: '发票日+60天',
          index: '60'
        },
        {
          name: '发票日+90天',
          index: '90'
        },
        {
          name: '发票日+120天',
          index: '120'
        }
      ],
      requisitionFieldList: [
        {
          name: '物料编号',
          class: 'w11p'
        },
        {
          name: '确认书编号',
          class: 'w11p'
        },
        {
          name: '调拨数量',
          class: 'w12p'
        },
        {
          name: '实际发货数量',
          class: 'w9p'
        },
        {
          name: '已入库数',
          class: 'w9p'
        }
      ],
      generatedFieldList: [
        {
          name: '行号',
          class: 'w10p'
        },
        {
          name: '物料编号',
          class: 'w10p'
        },
        {
          name: '调拨单号',
          class: 'w10p'
        },
        {
          name: '确认书号',
          class: 'w10p'
        },
        {
          name: '批次号',
          class: 'w10p'
        },
        {
          name: '批次发货数量',
          class: 'w10p'
        },
        {
          name: '调拨数量',
          class: 'w10p'
        },
        {
          name: '行金额',
          class: 'w5p'
        },
        {
          name: '采购单价',
          class: 'w5p'
        },
        {
          name: '实际发货数量',
          class: 'w5p'
        },
        {
          name: '销售订单编号',
          class: 'w10p'
        },
        {
          name: '最新编辑时间',
          class: 'w10p'
        },
        {
          name: '',
          class: 'w5p'
        }
      ],
      generatedParentFieldsList: [  // Table父列表表头
        {
          name: '预收货清单编号',
          class: 'w15p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '已上传箱单数量',
          class: 'w8p'
        },
        {
          name: '工厂发票号',
          class: 'w8p'
        },
        {
          name: '币种',
          class: 'w5p'
        },
        {
          name: '创建时间',
          class: 'w10p'
        },
        {
          name: '申请人',
          class: 'w6p'
        },
        {
          name: '审批',
          class: ''
        }
      ],
      editFieldList: [
        {
          name: '物料编号',
          class: 'w8p'
        },
        {
          name: '调拨单号',
          class: 'w8p'
        },
        {
          name: '确认书号',
          class: 'w10p'
        },
        {
          name: '工厂批次号',
          class: 'w10p',
          isRules: true
        },
        {
          name: '批次发货数量',
          class: 'w15p'
        },
        {
          name: '实际发货数量',
          class: 'w10p',
          isRules: true
        },
        {
          name: '行金额',
          class: 'w10p',
          isRules: true
        },
        // {
        //   name: '发票号',
        //   class: 'w10p'
        // },
        {
          name: '销售订单编号',
          class: 'w10p'
        },
        {
          name: '',
          class: 'w9p'
        }
      ],
      requisitionParentFieldList: [  // Table父列表表头
        {
          name: '调拨编号',
          class: 'w15p'
        },
        {
          name: '调拨类型',
          class: 'w10p'
        },
        {
          name: '销售订单编号',
          class: 'w15p'
        },
        {
          name: '客户名称',
          class: 'w8p'
        },
        {
          name: '供应商',
          class: 'w8p'
        },
        {
          name: '调拨单创建时间',
          class: 'w13p'
        },
        {
          name: '申请人',
          class: 'w6p'
        },
      ],
      
      // NEW
      checkAllList: [],
      uuidCheckList: [],
      exportCheckList: [],
      editType: '',
      materialFullData: {},
      mcLoading: false,
      isSaveDisabled: false,
      isDeleteDisabled: false,
      editItemData:  {
        isAdd: true,
        uuid: '',
        materialCode: '',
        factoryAllocationCode: '',
        confirmingCode: '',
        batchNumber: '',
        batchQuantity: '',
        realityNumber: '',
        money: '',
        factoryInvoice: '',
        saleOrderId: '',
        allocationPackages: 0,
        allocationQuantityPerPackage: 0,
        allocationQuantity: 0
      },

      checkFieldList: [
        {
          name: '确认书号',
          class: 'w20p'
        },
        {
          name: '批次号',
          class: 'w20p'
        },
        {
          name: '实际发货数量',
          class: 'w15p'
        },
        {
          name: '销售订单编号',
          class: 'w20p'
        },
        {
          name: '编辑时间',
          class: 'w25p'
        }
      ],
      exportFieldList: [
        {
          name: '序列号',
          class: 'w10p'
        },
        {
          name: '调拨单号',
          class: 'w30p'
        },
        {
          name: '供应商',
          class: 'w30p'
        },
        {
          name: '调拨类型',
          class: 'w30p'
        }
      ],
       subNavLists:[
      {
          label: '调拨单列表',
          value: 'Requisition'
        },
      ],
      subNavList: [
        {
          label: '调拨单列表',
          value: 'Requisition'
        },
        {
          label: '全部预收货清单',
          value: 'All'
        },
        {
          label: '草稿',
          value: 'Draft'
        },
        {
          label: '审批中',
          value: 'Approving'
        },
        {
          label: '已通过',
          value: 'Approved'
        },
        {
          label: '已驳回',
          value: 'Rejected'
        },
        // {
        //   label: '已终止',
        //   value: 'Terminated'
        // }
      ],

      // 编辑组件数据
      editFieldsList: [
        {
          name: '行号',
          field: 'lineNum',
          class: 'w10p',
          width: '50'
        },
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '180'
        },
        {
          name: '调拨单号',
          field: 'factoryAllocationCode',
          class: 'w16p',
          width: '150'
        },
        {
          name: '确认书号',
          field: 'confirmingCode',
          class: 'w13p',
          width: '150'
        },
        {
          name: '* 工厂批次号',
          field: 'batchNumber',
          class: 'w13p',
          width: '150'
        },
        {
          name: '调拨数量',
          field: 'transferMeter',
          field_1: 'transferBagQuantity',
          field_2: 'transferMeter',
          field_3: 'transferMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w15p',
          width: '200',
          isUnitSetText: true
        },
        {
          name: '* 发票数量',
          field: 'realityNumber',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w10p',
          width: '180'
        },
        {
          name: '行金额',
          // name: '* 行金额',
          field: 'money',
          class: 'w10p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '采购单价',
          field: 'offeredPrice',
          class: 'w10p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '销售订单编号',
          field: 'saleOrderId',
          class: 'w10p',
          width: '180'
        },
      ],
      leaderFieldsList: [
        // {
        //   name: '物料编号',
        //   field: 'materialCode',
        //   class: 'w10p',
        //   width: '150'
        // }
      ],
      tailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          isAction: true,
          hasDelete: true
        }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        lineNum: true,
        materialCode: true,
        factoryAllocationCode: true,
        confirmingCode: true,
        money: true,
        offeredPrice: true
      },
      inputSet: {
        batchNumber: true,
        // money: true,
        // money: {
        //   type: 'number'
        // },
        saleOrderId: true,
        // realityNumber: true,
        inputData: {
          maxlength: '',
          placeholder: ''
        }
      },
      selectSet: {
        selectData: {
          selectListName: '',
          value: '',
          label: ''
        }
      },
      numberInputSet: {
        realityNumber: true
      },
      datePickerSet: {},
      unitSet: {
        batchQuantity: true, // 批次发货数量 包数
        transferBagQuantity: true
      },

      requisitionChildHeaderList: ['调拨编号', '行号', '物料编号', '确认书号', '调拨单总数量', '已调拨总数量', '已入库总数量'],
      requisitionChildFieldsList: ['factoryAllocationCode', 'lineNum', 'materialCode', 'confirmNumbers', 'allocationQuantity', 'realQuantity', 'receivedQuantity'],

      receiptChildHeaderList: ['预收货清单编号', '行号', '物料编号', '调拨单号', '确认书号', '批次号', '发票数量', '总调拨数量', '行金额', '采购单价', '实际收货数量', '销售订单编号', '最新编辑时间'],
      receiptChildFieldsList: ['prepareReceiptCode', 'lineNum', 'materialCode', 'factoryAllocationCode', 'confirmingCode', 'batchNumber', 'realityNumberExp', 'transferMeter', 'money', 'offeredPrice', 'realReceiveQuantity', 'saleOrderId', 'updateTime'],
      headerListchecked : [],
      fieldsListchecked : [],
      //编辑快递单号弹框
      popupFieldList:[
        {
          name: '预收货清单编号',
          class: 'w35p',
          isRules: true
        },
        {
          name: '快递单号',
          class: 'w35p',
          isRules: true
        }
      ],
      addEdit:{}
    };
  },
  components: {
    Excel,
    editTable,
    UploadExcelComponent
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.headers = { Authorization: `Bearer ${this.$keycloak.token}` };
    // this.getRequisitionList();
    // this.getPrepareReceiptList();
    this.getSupplierDictList();
    this.getTradeTermsList();
    this.getCurrencyList();
    this.transferTypeListHandle();
    this.fun_date();
  },
  activated() {},
  filters: {
    statusFilter(status) {
      const statusMap = {
        Draft: '',
        Approving: 'warning',
        Approved: 'success',
        Rejected: 'danger',
        Terminated: 'info',
      };
      return statusMap[status];
    }
  },
  watch: {},
  computed: {},
  methods: {
    checkSelectable(row) {
      return !this.disabledbo;
    },
    rowClick(row, event, column) {
      // 单击项
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
    // Upload Excel Edit
    importExcelBeforeUpload(file) {
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      const isXLSX = fileType === 'xlsx';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message({
          message: '请不要上传大于1M的文件！',
          type: 'error'
        });
        return false;
      };
      if (!isXLSX) {
        this.$message.error('仅支持上传.xlsx后缀文件！');
      }
      if (isXLSX) {
        this.editPartLoading = true;
        isType = true;
      }
      return isType;
    },
    async importExcelSuccess({ results, header }) {
      console.log('导入数据：', results, header);
      if (results && results.length) {
        let editList = [];
        let editReceiptListCopy = JSON.parse(JSON.stringify(this.editReceiptList));
        this.editPartLoading = true;
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let editData = {};
          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key === '预收货清单编号') {
              editData.prepareReceiptCode = item[key];
            } else if (key === '行号') {
              editData.lineNum = item[key];
            } else if (key === '物料编号') {
              editData.materialCode = item[key];
            } else if (key === '调拨单号') {
              editData.factoryAllocationCode = item[key];
            } else if (key === '确认书号') {
              editData.confirmingCode = item[key];
            } else if (key === '批次号') {
              editData.batchNumber = item[key];
            } else if (key === '发票数量') {
              // editData.packSpecification = item[key];
              editData.realityNumber = item[key];
            } else if (key === '调拨数量') {
              editData.transferMeter = item[key];
            } else if (key === '行金额') {
              editData.money = item[key];
            } else if (key === '采购单价') {
              editData.offeredPrice = item[key];
            } else if (key === '实际发货数量') {
              // editData.realityNumber = item[key];
            } else if (key === '实际收货数量') {
              editData.realReceiveQuantity = item[key];
            } else if (key === '销售订单编号') {
              editData.saleOrderId = item[key];
            } else if (key === '最新编辑时间') {
              editData.updateTime = item[key];
              // editData.updateTime = excelDateFormatToDate(item[key]);
            }
          });
          editList.push(editData);
        }

        let moneyTotal = 0;
        for (let i = 0; i < editList.length; i++) {
          let item = editList[i];
          for (let j = 0; j < editReceiptListCopy.receiptListItemLists.length; j++) {
            let riItem = editReceiptListCopy.receiptListItemLists[j];
            if (item.lineNum === riItem.lineNum) {
              riItem = Object.assign(riItem, item);
              // if (riItem.purchaseMeasurementUnit === '米') {
              //   riItem.offeredQuantity = riItem.offeredPackages * riItem.offeredQuantityPerPackage;
              // }
            }
            riItem.money = (parseFloat(riItem.realityNumber) * parseFloat(riItem.offeredPrice)).toFixed(2);
            moneyTotal += parseFloat(riItem.money);
          }
        }
        this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
        this.editReceiptList.receiptListItemLists = editReceiptListCopy.receiptListItemLists;

        this.editPartLoading = false;
        setTimeout(() => {
          this.editPartLoading = false;
        }, 10000);
      }
    },

    // 固定展示为两周前的时间范围
    fun_date() {
      this.dateVal = getTimeRange(-14);
      this.searchHandle();
    },
    // Excel 导入导出
    excelDownload() {
      if (this.activeName === 'Requisition') {
        // 调拨单导出
        let headerList = [];
        let fieldsList = ['factoryAllocationCode', 'allocationTypeName', 'saleOrderId', 'customerName', 'supplierName', 'createTime', 'applicantName'];
        this.requisitionParentFieldList.forEach(hItem => {
          headerList.push(hItem.name);
        });
        import('@/vendor/Export2Excel').then(excel => {
          const list = this.requisitionList;
          const data = this.formatJson(fieldsList, list);
          excel.export_json_to_excel({
            header: headerList,
            data,
            filename: '调拨单',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
      } else {
        // 预收货清单导出
        let headerList = [];
        let fieldsList = ['prepareReceiptCode', 'supplierName', 'packingListQuantity', 'factoryInvoice', 'currencyName', 'createTime', 'applicantName', 'auditStatusName'];
        this.generatedParentFieldsList.forEach(hItem => {
          headerList.push(hItem.name);
        });
        import('@/vendor/Export2Excel').then(excel => {
          const list = this.receiptList;
          const data = this.formatJson(fieldsList, list);
          excel.export_json_to_excel({
            header: headerList,
            data,
            filename: '预收货清单',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
      }
    },
    childRequisitionExcelDownload(item) {
     
      // 调拨单项导出
      let headerList = this.requisitionChildHeaderList;
      let fieldsList = this.requisitionChildFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.faItemList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.factoryAllocationCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childReceiptExcelDownload(item) {
      let headerList = this.receiptChildHeaderList;
      let fieldsList = this.receiptChildFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        const list = item.receiptListItemLists;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.prepareReceiptCode,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    selectAllHandle(selection) {
      // 父项全选事件
      // console.log('触发全选事件：', selection);
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      this.multipleSelection = selection;
      if (selection && selection.length) {
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          this.selectUuidList.push(item.uuid);
          for (let j = 0; j < item.faItemList.length; j++) {
            let cItem = item.faItemList[j];
            this.childMultipleSelection.push(cItem);
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, true);
              }
            });
          }
        }
      } else {
        for (let i = 0; i < this.requisitionList.length; i++) {
          let item = this.requisitionList[i];
          for (let j = 0; j < item.faItemList.length; j++) {
            let cItem = item.faItemList[j];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
                this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, false);
              }
            });
          }
        }
      }
    },
    expandChange(row, rowList) {
      // console.log('树形展开项：', row, rowList);
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.faItemList.length; i++) {
          let cItem = row.faItemList[i];
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id] && this.$refs['childMultipleTable_' + row.id].length) {
              this.$refs['childMultipleTable_' + row.id][0].toggleRowSelection(cItem, true);
            }
          });
        }
      }
    },
    selectHandle(selection, row) {
      // console.log('当用户手动勾选数据行的 Checkbox 时触发事件：', selection, row);
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
          for (let i = 0; i < _row.faItemList.length; i++) {
            let cItem = _row.faItemList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, true);
              }
            });
            this.childMultipleSelection.push(cItem);
          }
        } else {
          for (let i = 0; i < _row.faItemList.length; i++) {
            let cItem = _row.faItemList[i];
            this.$nextTick(() => {
              if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
                this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, false);
              }
            });
            this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
              return cmsItem.uuid !== cItem.uuid;
            });
          }
        }
      } else {
        // 未选中 需删除该父项下所有子项
        if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
          this.$refs['childMultipleTable_' + _row.id][0].clearSelection();
        }
        for (let i = 0; i < row.faItemList.length; i++) {
          let item = row.faItemList[i];
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
      if (selection.length === parentRow.faItemList.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          if (this.$refs.multipleTable && this.$refs.multipleTable.length) {
            this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
          }
        });
      }
      this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);
    },
    async childSelectAllHandle(selection, parentRow) {
      // 子项全选
      console.log('子项全选操作：', selection, parentRow);
      await this.$nextTick();
      if (selection && selection.length) {
        this.$nextTick(() => {
          if (this.$refs.multipleTable && this.$refs.multipleTable.length) {
            this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
          }
        });
        for (let i = 0; i < selection.length; i++) {
          let item = selection[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) === -1) {
            this.childMultipleSelection.push(item);
          }
        }
      } else {
        for (let i = 0; i < parentRow.faItemList.length; i++) {
          let item = parentRow.faItemList[i];
          if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
            let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
            this.childMultipleSelection.splice(index, 1);
          }
        }
        this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);
      }
    },
    arrContainObjHandle(arr, obj) {
      var index = arr.findIndex(item => item.uuid == obj.uuid);
      return index;
    },

    checkOptionChange(val, uuid) {
      let checkArr = [];
      let requisitionListCopy = JSON.parse(JSON.stringify(this.requisitionList));
      for (var i = 0; i < requisitionListCopy.length; i++) {
        if (requisitionListCopy[i].uuid == uuid) {
          for (var j = 0; j < requisitionListCopy[i].faItemList.length; j++) {
            checkArr.push(requisitionListCopy[i].faItemList[j].id);
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
    checkAllChange(val, item) {
      let requisitionListCopy = JSON.parse(JSON.stringify(this.requisitionList));
      for (var i = 0; i < requisitionListCopy.length; i++) {
        if (requisitionListCopy[i].uuid == item.uuid) {
          for (var j = 0; j < requisitionListCopy[i].faItemList.length; j++) {
            let data = requisitionListCopy[i].faItemList[j];
            data.allocationType = requisitionListCopy[i].allocationType;
            if (!val) {
              this.checkList = this.checkList.filter(cItem => {
                return cItem !== data.id;
              });
              this.uuidCheckList = this.uuidCheckList.filter(ucItem => {
                return ucItem !== data.uuid;
              });
              if (this.exportCheckList.length) {
                this.exportCheckList = this.exportCheckList.filter(eItem => {
                  return eItem.uuid !== data.uuid;
                });
              }
            } else {
              this.checkList.push(data.id);
              this.uuidCheckList.push(data.uuid);
              this.exportCheckList.push(data);
            }
          }
        }
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
    verificationHandle(val, name, intCount) {
      // 数量值校验
      if (val.toString().indexOf('+') !== -1) {
        this.$message({
          message: `${name}类型错误，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      if (val.toString().indexOf('e') !== -1) {
        this.$message({
          message: `${name}类型错误，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      if (val.toString().indexOf('.') !== -1) {
        let arr = val.toString().split('.');
        if (arr[0].length > intCount) {
          this.$message({
            message: `${name}仅支持整数位${intCount}位，请重新输入！`,
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
      } else if (val.toString().length > intCount) {
        this.$message({
          message: `${name}仅支持整数位${intCount}位，请重新输入！`,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    createBatchNumberHandle() {
      // 生成工厂批次号
      if (!this.editReceiptList.factoryInvoice) {
        this.$message({
          type: 'error',
          message: '请输入工厂发票号！'
        });
        return false;
      }
      this.editReceiptList.receiptListItemLists.forEach(item => {
        item.batchNumber = this.editReceiptList.factoryInvoice + '-' + item.lineNum;
      });
    },
    cancelEditHandle() {
      this.selectUuidList = [];
      this.multipleSelection = [];
      this.childMultipleSelection = [];
      this.isShowEdit = false;
      console.log(this.activeName);
      if(this.activeName=='Requisition'){
        this.getRequisitionList();
      }else{
        this.getPrepareReceiptList();
      }
    },
    async getUpdateBatchList(item) {
      await batchNumberList(item.id).then(res => {
        console.log('批次号列表数据：', res);
        if (res.code === '0') {
          this.editReceiptList = res.data;
          this.editReceiptList.removeList = [];
          for (var i = 0; i < this.editReceiptList.receiptListItemLists.length; i++) {
            let data = this.editReceiptList.receiptListItemLists[i];
            this.updateEditModeSet('edit', data);
          }
        }
      });
      this.$forceUpdate();
    },
    saveEditHandle() {
      let patrn = /^[0-9]*$/;
      let list = JSON.parse(JSON.stringify(this.editReceiptList.receiptListItemLists));
      // let list = this.editReceiptList.receiptListItemLists;
      let invoiceTotal = 0;
      let moneyTotal = 0;
      // if (!this.uploadPackingList.length) {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传箱单！'
      //   });
      //   return false;
      // }
      // if (!this.uploadInvoiceList.length) {
      //   this.$message({
      //     type: 'error',
      //     message: '请上传工厂发票！'
      //   });
      //   return false;
      // }
      // if (!this.editReceiptList.factoryInvoice) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入工厂发票号！'
      //   });
      //   return false;
      // }
      // // if (!patrn.exec(this.editReceiptList.factoryInvoice)) {
      // //   this.$message({
      // //     type: 'error',
      // //     message: '工厂发票号类型错误，请重新输入！'
      // //   });
      // //   return false;
      // // }
      // if (!verificationQuantity(this, this.editReceiptList.factoryInvoice, 64, 0, '工厂发票号')) {
      //   return false;
      // }
      // if (!this.editReceiptList.factoryInvoiceTime) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择工厂发票时间！'
      //   });
      //   return false;
      // }
      // if (!this.editReceiptList.paymentTerms) {
      //   this.$message({
      //     type: 'error',
      //     message: '请输入到期日期！'
      //   });
      //   return false;
      // }
      // if (!this.editReceiptList.tradeTerms) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择贸易条款！'
      //   });
      //   return false;
      // }
      // if (!this.editReceiptList.currency) {
      //   this.$message({
      //     type: 'error',
      //     message: '请选择币种！'
      //   });
      //   return false;
      // }
      // if (!verificationQuantity(this, this.editReceiptList.invoiceTotalMoney, 8, 2, '发票总金额')) {
      //   return false;
      // }
      // for (var i = 0; i < list.length; i++) {
      //   let data = list[i];
      //   if (!data.materialCode) {
      //     this.$message({
      //       type: 'error',
      //       message: '请输入物料编号！'
      //     });
      //     return false;
      //   }
      //   if (!data.factoryAllocationCode) {
      //     this.$message({
      //       type: 'error',
      //       message: '请输入调拨单号！'
      //     });
      //     return false;
      //   }
      //   // if (data.batchNumber == '' || data.batchNumber == null) {
      //   //   this.$message({
      //   //     type: 'error',
      //   //     message: '请输入工厂批次号！'
      //   //   });
      //   //   return false;
      //   // }
      //   // if (!this.verificationHandle(data.batchNumber, '工厂批次号', 200)) {
      //   //   return false;
      //   // }
      //   // if (this.editType === 'edit') {
      //   //   // if (data.realityNumber === '' || data.realityNumber === null) {
      //   //   if (!data.realityNumber) {
      //   //     this.$message({
      //   //       type: 'error',
      //   //       message: '请输入发票数量！'
      //   //     });
      //   //     return false;
      //   //   }
      //   //   // if (!parseFloat(data.realityNumber) || parseFloat(data.realityNumber) < 0) {
      //   //   //   this.$message({
      //   //   //     type: 'error',
      //   //   //     message: '发票数量不能为空，应为大于0的正整数！'
      //   //   //   });
      //   //   //   return false;
      //   //   // }
      //   //   if (!this.verificationHandle(data.realityNumber, '发票数量', 10)) {
      //   //     return false;
      //   //   }
      //   //   if (data.money === '' || data.money === null) {
      //   //     this.$message({
      //   //       type: 'error',
      //   //       message: '请输入行金额！'
      //   //     });
      //   //     return false;
      //   //   }
      //   //   if (data.money < 0) {
      //   //     this.$message({
      //   //       type: 'error',
      //   //       message: '行金额不能小于0！'
      //   //     });
      //   //     return false;
      //   //   }
      //   //   if (isNaN(parseFloat(data.money))) {
      //   //     this.$message({
      //   //       type: 'error',
      //   //       message: '行金额格式错误！'
      //   //     });
      //   //     return false;
      //   //   }
      //   //   if (!this.verificationHandle(data.money, '行金额', 8)) {
      //   //     return false;
      //   //   }
      //   // }
      // }

      // NEW
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        invoiceTotal += parseFloat(data.realityNumber);
        moneyTotal += parseFloat(data.money);
        // 发票数量为0删除当前行
        // if (!Number(data.realityNumber)) {
        //   list.splice(i, 1);
        // }
      }
      // this.editReceiptList.receiptListItemLists = list;
      this.editReceiptList.invoiceTotalQuantity = invoiceTotal;  // 发票数量总计
      if (this.editReceiptList.invoiceTotalMoney) {
        this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
      } else {
        this.editReceiptList.invoiceTotalMoneyDifference = 0;
      }
      this.editReceiptList.packingListId = this.packingList ? this.packingList.join(',') : '';
      this.editReceiptList.factoryInvoiceId = this.factoryInvoice ? this.factoryInvoice.join(',') : '';
      this.editReceiptList.applicant = this.$store.state.userName;
      this.editReceiptList.applicantName = this.$store.state.realName;
      this.editReceiptList.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editReceiptList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.editReceiptList.submitType = '1';
      this.isSaveDisabled = true;
      this.$forceUpdate();
      editAdvanceReceipt(this.editReceiptList).then(res => {
        console.log('保存数据：', res);
        if (res.code === '0') {
          // console.log(this.editReceiptList)
           if(this.activeName!='Requisition'){
            this.getUpdateBatchList(this.editReceiptList);
          }
          // if (this.editType == 'create') {
          //   this.auditStatus = 'Draft';
          //   this.activeName = 'Draft';
          // }
          // this.getPrepareReceiptList();
          console.log(this.editType)
          console.log(this.activeName)
         
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          // this.isShowEdit = false;
        }
        this.isSaveDisabled = false;
      });
    },
    submitEditHandle() {
      let patrn = /^[0-9]*$/;
      let list = this.editReceiptList.receiptListItemLists;
      let invoiceTotal = 0;
      let moneyTotal = 0;
      if (!this.uploadPackingList.length) {
        this.$message({
          type: 'error',
          message: '请上传箱单！'
        });
        return false;
      }
      if (!this.uploadInvoiceList.length) {
        this.$message({
          type: 'error',
          message: '请上传工厂发票！'
        });
        return false;
      }
      if (!this.editReceiptList.factoryInvoice) {
        this.$message({
          type: 'error',
          message: '请输入工厂发票号！'
        });
        return false;
      }
      // if (!patrn.exec(this.editReceiptList.factoryInvoice)) {
      //   this.$message({
      //     type: 'error',
      //     message: '工厂发票号类型错误，请重新输入！'
      //   });
      //   return false;
      // }
      if (!verificationQuantity(this, this.editReceiptList.factoryInvoice, 64, 0, '工厂发票号')) {
        return false;
      }
      if (!this.editReceiptList.factoryInvoiceTime) {
        this.$message({
          type: 'error',
          message: '请选择工厂发票时间！'
        });
        return false;
      }
      if (!this.editReceiptList.paymentTerms) {
        this.$message({
          type: 'error',
          message: '请输入到期日期！'
        });
        return false;
      }
      if (!this.editReceiptList.tradeTerms) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editReceiptList.currency) {
        this.$message({
          type: 'error',
          message: '请选择币种！'
        });
        return false;
      }
      if (!this.editReceiptList.invoiceTotalMoney) {
        this.$message({
          type: 'error',
          message: '请输入发票总金额！'
        });
        return false;
      }
      if (!verificationQuantity(this, this.editReceiptList.invoiceTotalMoney, 8, 2, '发票总金额')) {
        return false;
      }
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
        invoiceTotal += parseFloat(data.realityNumber);
        moneyTotal += parseFloat(data.money);
        // // 发票数量为0删除当前行
        // if (!Number(data.realityNumber)) {
        //   list.splice(i, 1);
        // }
        if (!data.materialCode) {
          this.$message({
            type: 'error',
            message: '请输入物料编号！'
          });
          return false;
        }
        if (!data.factoryAllocationCode) {
          this.$message({
            type: 'error',
            message: '请输入调拨单号！'
          });
          return false;
        }
        if (data.batchNumber === '' || data.batchNumber === null) {
          this.$message({
            type: 'error',
            message: '请输入工厂批次号！'
          });
          return false;
        }
        if (!this.verificationHandle(data.batchNumber, '工厂批次号', 200)) {
          return false;
        }
        if (!data.realityNumber) {
          this.$message({
            type: 'error',
            message: '请输入发票数量！'
          });
          return false;
        }
        // if (!parseFloat(data.realityNumber) || parseFloat(data.realityNumber) < 0) {
        //   this.$message({
        //     type: 'error',
        //     message: '发票数量不能为空，应为大于0的正整数！'
        //   });
        //   return false;
        // }
        if (!this.verificationHandle(data.realityNumber, '发票数量', 10)) {
          return false;
        }
        if (data.money === '' || data.money === null) {
          this.$message({
            type: 'error',
            message: '请输入行金额！'
          });
          return false;
        }
        if (data.money < 0) {
          this.$message({
            type: 'error',
            message: '行金额不能小于0！'
          });
          return false;
        }
        if (isNaN(parseFloat(data.money))) {
          this.$message({
            type: 'error',
            message: '行金额格式错误！'
          });
          return false;
        }
        if (!this.verificationHandle(data.money, '行金额', 8)) {
          return false;
        }
      }
      if (this.auditStatus == 'Rejected') {
        this.editReceiptList.submitType = '4';
      } else {
        this.editReceiptList.submitType = '2';
      }
      this.editReceiptList.invoiceTotalQuantity = invoiceTotal;  // 发票数量总计
      if (this.editReceiptList.invoiceTotalMoney) {
        this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
      } else {
        this.editReceiptList.invoiceTotalMoneyDifference = 0;
      }
      this.editReceiptList.packingListId = this.packingList ? this.packingList.join(',') : '';
      this.editReceiptList.factoryInvoiceId = this.factoryInvoice ? this.factoryInvoice.join(',') : '';
      this.editReceiptList.applicant = this.$store.state.userName;
      this.editReceiptList.applicantName = this.$store.state.realName;
      this.editReceiptList.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editReceiptList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      editAdvanceReceipt(this.editReceiptList).then(res => {
        console.log('提交数据：', res);
        if (res.code === '0') {
          this.auditStatus = 'Approving';
          this.activeName = 'Approving';
          this.getPrepareReceiptList();
          this.$message({
            type: 'success',
            message: '提交审批成功！'
          });
          this.isShowEdit = false;
        }
        this.isSubmitDisabled = false;
      });
    },
    deleteEditItemHandle(index, item) {
      console.log('删除子项：', index, item);
      let list = JSON.parse(JSON.stringify(this.editReceiptList));
      list.receiptListItemLists.splice(index, 1);
      if (item.id) {
        list.removeList.push(item.id);
      }
      this.editReceiptList = list;
    },
    deleteHandle(index, item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      this.isDeleteDisabled = true;
      deletePrepareReceipt(this.deleteId).then(res => {
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getPrepareReceiptList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
        this.isDeleteDisabled = false;
      });
    },
    checkChildHandle(index, item) {
      // 查看子项列表数据
      console.log('查看项数据：', item);
      this.checkpopupTitle = '预收货清单物料详细信息';
      this.checkDialogVisible = true;
      batchNumberFallInfo(item.uuid).then(res => {
        console.log('批次数据：', res);
        if (res.code === '0') {
          this.materialFullData = res.data;
          this.materialFullData.preBatchList.forEach((item, index) => {
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = '';
            }
          });
        }
      });
    },
    
    editHandle(index, item) {
      console.log('编辑数据：', item);
      this.editType = 'edit';
      this.isShowEdit = true;
      this.curUuid = item.uuid;
      this.editReceiptList = {};
      this.uploadPackingList = [];
      this.uploadInvoiceList = [];
      this.getUpdateBatchList(item);
      // batchNumberList(item.id).then(res => {
      //   // console.log('批次号列表数据：', res);
      //   if (res.code === '0') {
      //     this.editReceiptList = res.data;
      //     this.editReceiptList.removeList = [];
      //     for (var i = 0; i < this.editReceiptList.receiptListItemLists.length; i++) {
      //       let data = this.editReceiptList.receiptListItemLists[i];
      //       this.updateEditModeSet('edit', data);
      //     }
      //   }
      // });
      this.getUploadFiles(item.uuid, '1');
      this.getUploadFiles(item.uuid, '2');
    },
    //编辑快递单号
    editCourierNo(index,item){
      console.log(index,item);
      this.popupTitle = '编辑快递单号';
      this.dialogFormVisible = true;
      this.addEdit.prepareReceiptCode=item.prepareReceiptCode
      this.addEdit.courierNo=item.courierNo
    },
    cancel(){
      this.dialogFormVisible = false;
    },
    dialogConfirmHandle(){
      if (this.addEdit.courierNo==null) {
        this.$message({
          type: 'error',
          message: '请填写快递单号！'
        });
        return false;
      }
      addOrUpdate(this.addEdit).then(res=>{
        this.dialogFormVisible = false;
        this.getPrepareReceiptList();
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
      })
    },
    courierNoChange() {
      this.$forceUpdate();
    },
    //拉取数据
    pullDataHandle() {
      let patrn = /^[0-9]*$/;
      if (!this.editReceiptList.factoryInvoice) {
        this.$message({
          type: 'error',
          message: '请输入工厂发票号再拉取！'
        });
        return false;
      }
      if (!patrn.exec(this.editReceiptList.factoryInvoice)) {
        this.$message({
          type: 'error',
          message: '工厂发票号不存在！'
        });
        return false;
      }
      this.getFactoryInvoice();
    },
    //重新添加数据
    getFactoryInvoice(){
      factoryInvoice(this.editReceiptList.factoryInvoice).then(res=>{
        if (res.code === '0') {
          this.editData = res.data;
          let editLen=this.editData.invoicePackingItemDtos.length
          let receiptLen=this.editReceiptList.receiptListItemLists.length
          if(this.editData.supplierCode!=this.editReceiptList.supplierName){
            this.$message({
              type: 'error',
              message: '箱单列表中物料编号与收货供应商不符！'
            });
            return;
          }
          if(editLen==receiptLen){
              this.editReceiptList.factoryInvoiceTime=this.editData.factoryInvoiceTime;
              this.editReceiptList.tradeTerms=this.editData.tradeTerms;
              this.editReceiptList.currency=this.editData.currency;
              this.$forceUpdate();
              //返回的是一样物料编号
              var arr=[];
              for(var i=0;i<this.editData.invoicePackingItemDtos.length;i++){
                var newdata=this.editData.invoicePackingItemDtos[i]; 
                arr.push(newdata.materialCode);
              }
              if(new Set(arr).size !== this.editData.invoicePackingItemDtos.length){
                console.log("一样的");
              }else{
                console.log('不一样');
              }
              this.editData.invoicePackingItemDtos.map((item,index)=>{                
                var data = this.editReceiptList.receiptListItemLists[index];
                var newdata=this.editData.invoicePackingItemDtos[index]; 
                
                if(newdata.materialCode=data.materialCode){
                  data.batchNumber=newdata.batchNumber;
                  data.realityNumber=newdata.realQuantity;
                  data.money=newdata.money;
                }else{
                  this.$message({
                    message: "箱单列表中物料编号与收货物料编号不符!",
                    type: "error"
                  });
                }
              });
          }else{
            this.$message({
              message: "箱单列表与收货时的条数不符!",
              type: "error"
            });
          }
        }
      })
    },
    getUploadFiles(uuid, type) {
      searchUploadFiles(uuid, type).then(res => {
        console.log('上传文件列表：', res);
        if (res.code === '0' && res.data.length) {
          let packingData = {};
          let invoiceData = {};
          switch (type) {
            case '1':
              // 箱单
              this.uploadPackingList=[];
              this.packingList=[];
              for (var i = 0; i < res.data.length; i++) {
                packingData.id = res.data[i].id;
                packingData.name = res.data[i].realname;
                packingData.url = process.env.VUE_APP_SCM_IMG_URL + res.data[i].filepath;
                this.uploadPackingList.push(packingData);
                this.packingList.push(packingData.id)
                packingData = {};
              }
              break;
            case '2':
              // 工厂发票
              this.uploadInvoiceList=[];
              this.factoryInvoice=[];
              for (var i = 0; i < res.data.length; i++) {
                invoiceData.id = res.data[i].id;
                invoiceData.name = res.data[i].realname;
                invoiceData.url = process.env.VUE_APP_SCM_IMG_URL + res.data[i].filepath;
                this.uploadInvoiceList.push(invoiceData);
                this.factoryInvoice.push(invoiceData.id)
                invoiceData = {};
              }
              break;
            default:
              break;
          }
        }
        // console.log(this.uploadInvoiceList)
        // console.log(this.uploadPackingList)
        // console.log(this.packingList)
        // console.log(this.factoryInvoice)
      });
    },
    submitHandle(index, item) {
      // 提交审批
      console.log(item);
      this.submitParamsData = {
        uuid: item.uuid,
        // auditStatus: 'Approving',
        // submitType: '',
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      // if (this.auditStatus == 'Rejected') {
      //   // 已驳回提交
      //   this.submitParamsData.submitType = '4';
      // } else {
      //   this.submitParamsData.submitType = '2';
      // }
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      submitPrepareReceipt(this.submitParamsData).then(res => {
        // console.log('提交数据：', res);
        if (res.code === '0') {
          this.submitDialogVisible = false;
          this.auditStatus = 'Approving';
          this.activeName = 'Approving';
          this.getPrepareReceiptList();
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        }
      });
    },
    checkApprovalProcess(item, index) {
      approvalProcessInfo(item.uuid).then(res => {
        // console.log('审批流程：', res);
        if (res.code === '0' && res.data) {
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
          this.$set(this.receiptList, index, item);
          this.$forceUpdate();
        }
      });
    },
    actionsTypeHandle(status) {
      // 审批状态
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
    factoryInvoiceChange() {
      // 工厂发票号更新
    },
    // invoiceTotalMoneyChange(val) {
    //   // 发票总金额更新  差额 = 发票总金额 - 所有行金额合计
    //   let list = JSON.parse(JSON.stringify(this.editReceiptList.receiptListItemLists));
    //   let moneyTotal = 0;
    //   list.forEach(item => {
    //     moneyTotal += parseFloat(item.money);
    //   });
    //   this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
    //   this.$forceUpdate();
    // },
    invoiceTotalMoneyInput({ target }) {
      // 发票总金额更新
      // target.value = target.value.replace(/[^\d.]/g, '');
      target.value = target.value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '');
      let list = JSON.parse(JSON.stringify(this.editReceiptList.receiptListItemLists));
      let moneyTotal = 0;
      list.forEach(item => {
        moneyTotal += parseFloat(item.money);
      });
      this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
      this.$forceUpdate();
    },
    factoryInvoiceTimeChange(val) {
      // 工厂发票时间
      console.log('工厂发票时间：', val);
    },
    paymentConditionChange(val) {
      // 付款条件
      console.log('付款条件: ', val);
      if (!this.editReceiptList.factoryInvoiceTime) {
        this.paymentCondition = '';
        this.$message({
          type: 'error',
          message: '请先选择工厂发票时间！'
        });
        return false;
      }
      val = Number(val);
      if (val === 0) {
        this.editReceiptList.paymentTerms = this.editReceiptList.factoryInvoiceTime;
      } else {
        this.editReceiptList.paymentTerms = addDate(this.editReceiptList.factoryInvoiceTime, val);
      }
    },
    paymentTermsChange(val) {
      // 到期日期
      console.log('到期日期：', val);
      this.editReceiptList.paymentTerms = val;
      this.$forceUpdate();
    },
    tradeTermsSelect() {
      // 贸易条款
    },
    currencyChange() {
      // 币种
    },
    async addEditHandle() {
      if (!this.editReceiptList.receiptListItemLists) {
        this.editReceiptList.receiptListItemLists = [];
      }
      let editListCopy = JSON.parse(JSON.stringify(this.editReceiptList));
      let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
      if (editListCopy.receiptListItemLists.length >= 1) {
        editItemCopy.batchQuantity = editListCopy.receiptListItemLists[0].batchQuantity;
        editItemCopy.packSpecification = editListCopy.receiptListItemLists[0].packSpecification;
      }
      await getUUID().then(res => {
        if (res.code === '0') {
          editItemCopy.uuid = res.data;
        }
      });
      editListCopy.receiptListItemLists.push(editItemCopy);
      this.editReceiptList = editListCopy;
    },
    searchHandle() {
      // 搜索
      this.selectUuidList = [];
      this.multipleSelection = [];  // 勾选项清除
      this.childMultipleSelection = [];  // 勾选子项清除
      this.purchaseOrderId = this.orderCode;
      this.currentPage = 1;
      this.requisitionList = [];
      this.receiptList = [];
      if (this.dateVal) {
        this.startTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      console.log(this.activeName)
      switch (this.activeName) {
        case 'Requisition':
          this.getRequisitionList();
          break;
        default:
          this.getPrepareReceiptList();
          break;
      }
    },
    // uploadHandle() {
    //   // 上传
    // },
    downloadHandle() {
      // 下载/导出调拨单
      if (!this.childMultipleSelection.length) {
        this.$message({
          type: 'error',
          message: '请选择需要导出的调拨单！'
        });
        return false;
      }
      this.checkedUuidList=[];
      this.peiRate(this.childMultipleSelection,this.multipleSelection);
      for (let i = 0; i < this.childMultipleSelection.length; i++) {
        let item = this.childMultipleSelection[i];
        this.checkedUuidList.push(item.uuid);
        item.updateTime = item.updateTime ? timeFormat(item.updateTime) : '';
        if(item.purchaseMeasurementUnit=='米'){
          this.headerListchecked = ['调拨编号','调拨类型','销售订单编号','客户名称','供应商','调拨单创建时间','申请人','行号', '物料编号', '确认书号', '调拨单总数量包数',  '调拨单总数量规格',  '调拨单总数量', '已调拨总数量包数','已调拨总数量', '已入库总数量包数','已入库总数量'];
          this.fieldsListchecked = ['factoryAllocationCode','allocationTypeName','saleOrderId','customerName','supplierShortName','updateTime','applicantName',  'lineNum', 'materialCode', 'confirmNumbers', 'allocationPackages','allocationQuantityPerPackage','allocationQuantity', 'realBagQuantity','realQuantity','receivedBagQuantity', 'receivedQuantity'];
        item.realBagQuantity = item.realBagQuantity ? item.realBagQuantity : 0;
          item.receivedBagQuantity = item.receivedBagQuantity ? item.receivedBagQuantity : 0;
        }else{
          this.headerListchecked =['调拨编号','调拨类型','销售订单编号','客户名称','供应商','调拨单创建时间','申请人','行号', '物料编号', '确认书号','调拨单总数量', '已调拨总数量', '已入库总数量'];
          this.fieldsListchecked = ['factoryAllocationCode','allocationTypeName','saleOrderId','customerName','supplierShortName','updateTime', 'applicantName', 'lineNum', 'materialCode', 'confirmNumbers','allocationQuantity', 'realQuantity', 'receivedQuantity'];
        }
      }
      if(!this.disabledbo){
      this.exportDialogVisible = true;
    }else{
      this.confirmExportHandle()
    }
    },
    peiRate(retas,domains) {
      for (let i = 0; i < retas.length; i++) {
        for (let k = 0; k < domains.length; k++) {
          if (domains[k].factoryAllocationCode == retas[i].factoryAllocationCode) {
            retas[i].customerName=domains[k].customerName ;
            retas[i].applicantName=domains[k].applicantName ;
          }
        }
      }
    },



    confirmExportHandle() {
      if(!this.disabledbo){
       // 确定导出
       this.exportDialogVisible = false;
      let uuidCheckStr = this.checkedUuidList.join(',');
      // console.log('下载链接：', this.apiUrl + 'allocation/v1/exportPhpExcel?uuids=' + uuidCheckStr);
      // window.open(this.apiUrl + 'allocation/v1/exportPhpExcel?uuids=' + uuidCheckStr);
      ssoPermission(this.apiUrl + 'allocation/v1/downloadAllocationsExcel?uuids=' + uuidCheckStr, '调拨单', this.$keycloak.token);
    }else{
  // 调拨单导出
        let headerList = this.headerListchecked
        let fieldsList = this.fieldsListchecked;
        import('@/vendor/Export2Excel').then(excel => {
          const list = this.childMultipleSelection;
          const data = this.formatJson(fieldsList, list);
          excel.export_json_to_excel({
            header: headerList,
            data,
            filename: '调拨单',
            autoWidth: true,
            bookType: 'xlsx'
          });
        });
    }
    
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    switchTabHandle(tab) {
      console.log('tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.multipleSelection = [];  // 勾选项清除
      this.childMultipleSelection = [];  // 勾选子项清除
      this.selectUuidList = [];  // 勾选项清空
      this.requisitionList = [];
      this.receiptList = [];
      // this.checkList = [];
      this.checkedIdList = [];
      switch (tab.name) {
        case 'Requisition':
          this.getRequisitionList();
          break;
        case 'All':
          this.auditStatus = '';
          this.getPrepareReceiptList();
          break;
        case 'Draft':
          // 草稿
          this.auditStatus = 'Draft';
          this.getPrepareReceiptList();
          break;
        case 'Approving':
          // 审批中
          this.auditStatus = 'Approving';
          this.getPrepareReceiptList();
          break;
        case 'Approved':
          // 已通过
          this.auditStatus = 'Approved';
          this.getPrepareReceiptList();
          break;
        case 'Rejected':
          // 已驳回
          this.auditStatus = 'Rejected';
          this.getPrepareReceiptList();
          break;
        case 'Terminated':
          // 已终止
          this.auditStatus = 'Terminated';
          this.getPrepareReceiptList();
          break;
        default:
          break;
      }
      console.log(this.activeName)
    },
    async createAdvanceReceipt() {
      // 创建预收货清单
      console.log('创建预收货清单编辑：', this.editReceiptList);
      this.editType = 'create';
      this.checkedIdList = [];
      if (!this.childMultipleSelection.length) {
        this.$message({
          type: "error",
          message: '请选择要创建的调拨单！'
        });
        return;
      }
      for (let i = 0; i < this.childMultipleSelection.length; i++) {
        let item = this.childMultipleSelection[i];
        this.checkedIdList.push(item.id);
      }
      this.packingList = [];
      this.factoryInvoice = [];
      this.uploadPackingList = [];
      this.uploadInvoiceList = [];
      this.paymentCondition='';

      // 查询调拨单列表
      await searchRequisitionItem(this.checkedIdList).then(res => {
        console.log('创建调拨单请求列表：', res);
        if (res.code === '0') {
          let editListCopy = {};
          let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
          purchasegetuuid().then(uuidData => {
            if (uuidData.code === '0') {
              this.curUuid = uuidData.data;
              editListCopy.uuid = uuidData.data;
            }
          });
          if (res.data.length) {
            editListCopy.supplierCode = res.data[0].supplierCode;
            editListCopy.supplierName = res.data[0].supplierName;
          }
          editListCopy.receiptListItemLists = res.data;
          editListCopy.receiptListItemLists.forEach(item => {
            // item.purchaseType = item.allocationTypeName;
            // item.uuid = item.factoryAllocationItemUuid;
            item.uuid = item.uuid;
            item.money = (parseFloat(item.realityNumber) * parseFloat(item.offeredPrice)).toFixed(2);
            this.updateEditModeSet('edit', item);
          });
          editListCopy.supplierShortName = editListCopy.receiptListItemLists[editListCopy.receiptListItemLists.length - 1].supplierShortName;
          this.editReceiptList = editListCopy;
          this.$forceUpdate();
          console.log(this.editReceiptList)
          setTimeout(() => {
            this.isShowEdit = true;
          }, 500);
        }
      });

    },
    // async submitDataHandle() {
    //   // 提交新建预收货清单
    //   console.log('创建预收货清单');
    //   let data = {};
    //   let uuidData = await purchasegetuuid();
    //   // console.log(uuidData);
    //   this.isSubmitDisabled = true;
    //   if (uuidData.code == '0') {
    //     data.uuid = uuidData.data;
    //   }
    //   data.factoryInvoice = this.factoryInvoice ? this.factoryInvoice.join(',') : '';
    //   data.packingList = this.packingList ? this.packingList.join(',') : '';
    //   // data.prepareReceiptCode = '';
    //   // data.recordDate = '';
    //   data.supplierCode = this.supplierCode;
    //   data.supplierName = this.supplierName;
    //   data.receiptListItemLists = this.checkRequisitionList;
    //   data.applicant = this.$store.state.userName;
    //   data.applicantName = this.$store.state.realName;
    //   data.applicantDepartment = this.$store.state.currentDepartment.id;
    //   data.applicantDepartmentName = this.$store.state.currentDepartment.name;
    //   data.submitType = '1';
    //   console.log(data);
    //   addRequisitionList(data).then(res => {
    //     console.log('生成预收获清单：', res);
    //     if (res.code == '0') {
    //       this.dialogFormVisible = false;
    //       this.activeName = 'All';
    //       this.getPrepareReceiptList();
    //     }
    //     this.isSubmitDisabled = false;
    //   });
    // },
    beforeUploadPackList(file) {
      console.log('箱单上传前：', file);
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      this.packFileType = fileType;
      const isJPG = file.type === 'image/jpeg';
      const isDOC = fileType === 'doc';
      const isDOCX = fileType === 'docx';
      const isPDF = fileType === 'pdf';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isDOC && !isDOCX && !isPDF) {
        this.$message.error('上传箱单文件只能是 DOC/DOCX/PDF/JPG/ 格式!');
      }
      if (isJPG || isDOC || isDOCX || isPDF) {
        isType = true;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传箱单文件大小不能超过 2MB!');
      // }
      return isType;
    },
    handleExceedPackList() {
      
    },
    handleSuccessPackList(response, file, fileList) {
      console.log(response, file, fileList);
      this.uploadPackingList = [];
      if (response.code === '0') {
        this.editReceiptList.packingListQuantity = response.data.attachmentNum;
        if (this.editType == 'edit') {
          this.updatePackingList(this.editReceiptList.prepareReceiptCode ? this.editReceiptList.prepareReceiptCode : '', response.data.attachmentNum);
        }
        this.$forceUpdate();
      }
      this.packingList.push(response.data.id);
      console.log(this.packingList)
      this.getUploadFiles(response.data.uuid, '1');
    },
    handleRemovePackList(file, fileList) {
      console.log(file, fileList);
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
      this.uploadPackingList = [];
      if (file.status == 'ready') {
        return false;
      }
      if (file.response) {
        deleteUploadFile(file.response.data.id).then(res => {
          console.log('删除上传箱单：', res);
          let count = parseInt(this.editReceiptList.packingListQuantity);
          this.editReceiptList.packingListQuantity = count - 1;
          this.$forceUpdate();
          if (res.code === '0') {
            if (this.editType == 'edit') {
              this.updatePackingList(this.editReceiptList.prepareReceiptCode ? this.editReceiptList.prepareReceiptCode : '', this.editReceiptList.packingListQuantity);
            }
            this.getUploadFiles(this.curUuid, '1');
            this.$message({
              type: 'success',
              message: '上传箱单文件删除成功!'
            });
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        });
      } else {
        deleteUploadFile(file.id).then(res => {
          let count = parseInt(this.editReceiptList.packingListQuantity);
          this.editReceiptList.packingListQuantity = count - 1;
          this.$forceUpdate();
          if (res.code === '0') {
            if (this.editType == 'edit') {
              this.updatePackingList(this.editReceiptList.prepareReceiptCode ? this.editReceiptList.prepareReceiptCode : '', this.editReceiptList.packingListQuantity);
            }
            this.getUploadFiles(this.curUuid, '1');
            this.$message({
              type: 'success',
              message: '上传箱单文件删除成功!'
            });
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        });
      }
    },
    handleRemoveInvoiceList(file, fileList) {
      console.log(file, fileList);
      this.isSaveDisabled = true;
      this.isSubmitDisabled = true;
      this.uploadInvoiceList = [];
      if (file.status == 'ready') {
        return false;
      }
      if (file.response) {
        deleteUploadFile(file.response.data.id).then(res => {
          // console.log('删除上传工厂发票：', res);
          if (res.code === '0') {
            // this.getUploadFiles(this.curUuid, '2');
            this.$message({
              type: 'success',
              message: '上传工厂发票文件删除成功!'
            });
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        });
      } else {
        deleteUploadFile(file.id).then(res => {
          // console.log('删除上传工厂发票：', res);
          if (res.code === '0') {
            // this.getUploadFiles(this.curUuid, '2');
            this.$message({
              type: 'success',
              message: '上传工厂发票文件删除成功!'
            });
          }
          this.isSaveDisabled = false;
          this.isSubmitDisabled = false;
        });
      }
    },
    updatePackingList(code, quantity) {
      updatePackingQuantity(code, quantity).then(res => {
        // console.log('更新上传箱单数量：', res);
      });
    },
    beforeUploadInvoiceList(file) {
      console.log('上传发票文件：', file);
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf('.') + 1);
      this.invoiceFileType = fileType;
      const isJPG = file.type === 'image/jpeg';
      const isDOC = fileType === 'doc';
      const isDOCX = fileType === 'docx';
      const isPDF = fileType === 'pdf';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isDOC && !isDOCX && !isPDF) {
        this.$message.error('上传发票文件只能是 DOC/DOCX/PDF/JPG/ 格式!');
      }
      if (isJPG || isDOC || isDOCX || isPDF) {
        isType = true;
      }
      // if (!isLt2M) {
      //   this.$message.error('上传发票文件大小不能超过 2MB!');
      // }
      return isType;
    },
    handleExceedInvoiceList() {
      this.$message({
        message: '最大允许上传1个文件！',
        type: 'error'
      });
    },
    handleSuccessInvoiceList(response, file, fileList) {
      console.log(response, file, fileList);
      this.uploadInvoiceList = [];
      this.factoryInvoice.push(response.data.id);
      console.log(this.factoryInvoice)
      this.getUploadFiles(response.data.uuid, '2');
    },
    deleteOrderHandle(index, item) {
      // 删除订单
      let self = this;
      this.$confirm('确认删除此条订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePurchaseOrder(item.id).then(res => {
          if (res.code == '0') {
            this.getRequisitionList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPrepareReceiptList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPrepareReceiptList();
    },
    rHandleSizeChange(val) {
      this.rPageSize = val;
      this.getRequisitionList();
    },
    rHandleCurrentChange(val) {
      this.multipleSelection = [];  // 勾选项清除
      this.childMultipleSelection = [];  // 勾选子项清除
      this.selectUuidList = [];  // 勾选项清空
      this.rCurrentPage = val;
      this.getRequisitionList();
    },
    getRequisitionList() {
      // 调拨单列表
      let data = {
        // allocationStatus: this.allocationStatus,
        allocationType: this.allocationType,
        faDeleteStatus: this.faDeleteStatus,
        factoryAllocationCode: this.factoryAllocationCode,
        rev: this.rev,
        uuid: this.uuid,
        allocationStatus: 'Approved',
        supplierCode: this.supplierCode,
        // supplierName: this.supplierName,
        startTime: this.startTime,
        endTime: this.endTime,
        materialCode: this.materialCode
      };
      requisitionList(this.rCurrentPage, this.rPageSize, data).then(res => {
        console.log('调拨单列表：', res);
        if (res.code === '0') {
          this.requisitionList = res.data.records;
          this.rTotal = res.data.total;
          this.requisitionList.forEach((item, index) => {
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            if (item.allocationTypeName.slice(0, 2) == '客订') {
              item.allocationTypeNameTag = '客订';
            } else {
              item.allocationTypeNameTag = '';
            }
            this.updateEditModeSet('edit', item);
          });

          for (var i = 0; i < this.requisitionList.length; i++) {
            for (var j = 0; j < this.requisitionList[i].faItemList.length; j++) {
              let data = this.requisitionList[i].faItemList[j];
              if (data.isReceived) {
                this.requisitionList[i].isCheckDisabled = true;
              }
            }
          }
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    getPrepareReceiptList() {
      // 已生成预收货清单列表
      let data = {
        auditStatus: this.auditStatus,
        factoryAllocationCode: this.factoryAllocationCode,
        prepareReceiptCode: this.prepareReceiptCode,
        supplierCode: this.supplierCode,
        supplierName: this.supplierName,
        startTime: this.startTime,
        endTime: this.endTime
      };
      advanceReceiptList(this.currentPage, this.pageSize, data).then(res => {
        console.log('已生成预收货列表：', res);
        if (res.code === '0') {
          this.receiptList = res.data.records;
          this.total = res.data.total;
          let list = this.receiptList;
          let childData = {};
          for (var i = 0; i < list.length; i++) {
            list[i].status = list[i].auditStatus;
            list[i].auditStatusName = statusTypeHandle(list[i].auditStatus);
            list[i].createTime = list[i].createTime ? timeFormat(list[i].createTime) : '';
            list[i].currencyName = list[i].currency ? currencyTypeHandle(list[i].currency) : '';
            for (var j = 0; j < list[i].receiptListItemLists.length; j++) {
              childData = list[i].receiptListItemLists[j];
              // childData.offeredPrice = childData.offeredPrice * childData.batchMeter;  // 采购单价
              // childData.offeredPrice = parseFloat(childData.offeredPrice * childData.packSpecification).toFixed(2);  // 采购单价
              childData.updateTime = childData.updateTime ? timeFormat(childData.updateTime) : '';
              childData.money = childData.money ? parseFloat(childData.money).toFixed(2) : 0;
              childData.realityNumberExp = 0;
              this.updateEditModeSet('edit', childData);
            }
          }
          this.tableLoading = false;
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
    getTradeTermsList() {
      // 贸易条款列表
      constDictList('TradeTerms').then(res => {
        console.log('贸易条款列表数据：', res);
        if (res.code === '0') {
          this.tradeTermsList = res.data;
        }
      });
    },
    getCurrencyList() {
      // 币种列表
      constDictList('Currency').then(res => {
        console.log('币种列表：', res);
        if (res.code === '0') {
          this.currencyList = res.data;
        }
      });
    },
    transferTypeListHandle() {
      // 调拨类型列表
      constDictList('TransferType').then(res => {
        console.log('调拨类型列表：', res);
        if (res.code === '0') {
          this.transferTypeList = res.data;
        }
      });
    },

    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let numberInputSet = JSON.parse(JSON.stringify(this.numberInputSet));
      let unitSet = JSON.parse(JSON.stringify(this.unitSet));
      if (type == 'edit') {
        switch (status) {
          case 'Draft':

            break;
          case 'Approved':

            break;
          default:
            break;
        }
      }
      editModeSet.textSet = textSet;
      editModeSet.inputSet = inputSet;
      editModeSet.numberInputSet = numberInputSet;
      editModeSet.unitSet = unitSet;
      data.editModeSet = editModeSet;
    },
    async inputChange(val, item, fieldItem) {
      let editListCopy = JSON.parse(JSON.stringify(this.editReceiptList.receiptListItemLists));
      switch (fieldItem.field) {
        case 'money':
          // 行金额
          console.log('行金额改变：', val, item, fieldItem);
          let priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
          if (!priceReg.test(val)) {
            this.$message({
              type: 'error',
              message: '行金额仅支持最多保留两位小数数字格式！'
            });
            return false;
          }
          break;
        case 'batchNumber':
          var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
          if(reg.test(val)){
            this.$message({
              type: 'error',
              message: '不能含有汉字！'
            });
            return false;
          }  
          break; 
        default:
          break;
      }
    },
    numberInputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'realityNumber':
          // 发票数量
          console.log('发票数量改变：', val, item, fieldItem);
          if (!val) {
            item.realityNumber = 0;
          }
          item.money = (parseFloat(item.realityNumber) * parseFloat(item.offeredPrice)).toFixed(2);
          // 计算差额
          let list = JSON.parse(JSON.stringify(this.editReceiptList.receiptListItemLists));
          let moneyTotal = 0;
          let invoiceTotal = 0;
          list.forEach(item => {
            moneyTotal += parseFloat(item.money);
            invoiceTotal += parseFloat(item.realityNumber);
          });
          this.editReceiptList.invoiceTotalMoneyDifference = parseFloat(this.editReceiptList.invoiceTotalMoney - moneyTotal).toFixed(2);
          this.editReceiptList.invoiceTotalQuantity = invoiceTotal;
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },

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
.advancereceipt {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
  .edit_wrap {
    overflow: auto;
    .edit_parent_list {
      ul {
        &.childcontentlist {
          line-height: 32px;
        }
      }
      .edit_btn_wrap {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
.table_part, .edit_part {
  position: relative;
  .allparentlist {
    .childlist {
      width: 98%;
      margin-left: 2%;
      // background-color: #9cb9d6 !important;
      // li {
      //   color: #fff;
      // }
    }
    .childcontentlist {
      width: 98%;
      margin-left: 2%;
    }
  }
  .parent_header_wrap {
    li {
      padding: 12px 10px;
    }
  }
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
  .create_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
  .el-checkbox {
    white-space: inherit;
  }
}

.pagination_wrap {
  margin-top: 20px;
}

.popup_part {
  ul {
    &.childcontentlist {
      height: 60px;
      li {
        line-height: 40px;
      }
    }
  }

}

.upload_wrap {
  &>div {
    max-width: 40%;
  }
  .upload_tit {
    margin: 0;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  .upload-demo {
    max-width: 70%;
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
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
.advancereceipt .el-checkbox__label {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.advancereceipt .table_part .el-checkbox__input {
  vertical-align: middle;
}
.advancereceipt .table_part .el-checkbox__label span {
  color: #606266;
}
.advancereceipt .table_part .el-checkbox__label {
  vertical-align: middle;
}
.advancereceipt .upload_wrap .el-upload-list__item .el-icon-upload-success, .advancereceipt .upload_wrap .el-upload-list__item .el-icon-close {
  vertical-align: middle;
  line-height: 36px;
}
.advancereceipt .table_part .el-tabs .el-tab-pane {
  min-height: 536px;
}
.advancereceipt .el-checkbox__input.is-checked+.el-checkbox__label {
  /* 父项选中文字颜色 */
  color: #606266;
}
</style>