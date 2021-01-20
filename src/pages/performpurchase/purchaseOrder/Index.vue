<template>
  <div class="container purchaseOrder">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
      	<div class="actions_wrap">
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
		        <span class="tag">采购订单编号：</span>
		        <el-input class="input_single w200 mr10" v-model="purchaseOrderId" placeholder="请输入"></el-input>
		      </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
		        <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
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
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button style="margin: 0 0 20px 20px;" type="primary" @click="excelDownload">导出Excel</el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
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

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
          <el-tab-pane
            v-for="item in subNavList"
            :key="item.value"
            :label="item.label"
            :name="item.value"
            v-loading="tableLoading">
            <el-table
              class="table_list"
              ref="multipleTable"
              :data="orderList"
              row-key="id"
              :expand-row-keys="expands"
              @row-click="rowClick"
              border
              fit
              stripe>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <div class="actions_wrap mb20 clearfix">
                    <el-button class="fr" type="primary" @click="childExcelDownload(scope.row)">导出Excel</el-button>
                    <el-button class="fr mr10" type="primary" @click="mergeChildExcelDownload(scope.row)">合并导出Excel</el-button>
                    <el-button v-if="scope.row.orderStatus == '1' || scope.row.orderStatus == '5'" class="fr" type="primary" @click="editHandle(scope.$index, scope.row)">更新导入Excel</el-button>
                  </div>
                  <el-table
                    class="table_list"
                    :ref="'childMultipleTable_' + scope.row.id"
                    :data="scope.row.poiList"
                    max-height="1000"
                    border
                    fit>
                    <el-table-column fixed label="行号">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.purchaseOrderSn }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column fixed label="物料编号">
                      <template slot-scope="{ row }">
                       <p :class="{isThrough:row.cancelStatus}"> {{ row.materialCode }}</p>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column label="销售订单编号">
                      <template slot-scope="{ row }">
                        {{ row.saleOrderId }}
                      </template>
                    </el-table-column> -->
                    <el-table-column label="采购价格">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.offeredPrice }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="请求数量">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ (row.requiredQuantity ? row.requiredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="采购数量">
                      <template slot-scope="{ row }">
                        <span v-if="row.purchaseMeasurementUnit == '米'"> <p :class="{isThrough:row.cancelStatus}">{{ (row.offeredPackages ? row.offeredPackages : 0) + '包 ' + (row.offeredQuantityPerPackage ? row.offeredQuantityPerPackage : 0) + '米/包 ' + (row.offeredQuantity ? row.offeredQuantity : 0) + '米' }}</p></span>
                        <span v-else> <p :class="{isThrough:row.cancelStatus}">{{ (row.offeredQuantity ? row.offeredQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</p></span>
                      </template>
                    </el-table-column>
                    <el-table-column label="期望交期">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.requiredDate }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="工厂交期">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.offeredDate }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="物料工厂季" v-if="scope.row.orderStatus == '1'">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.materialFactorySeason }}</p>
                      </template>
                    </el-table-column>
                     <el-table-column label="快货">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.mobileGoods }}</p>
                      </template>
                    </el-table-column>
                     <el-table-column label="EV">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.belongToEv }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="采购备注">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.purchaseRemark }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="备注">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.remark }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="特殊要求">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.specialRequire }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="期望LT">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.offerLt }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="MTM">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.listOfCuttingLength }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="销售订单编号">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.saleOrderId }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="请求类型">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.prTypeName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="客户名称">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.customerName}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="原确认书编号">
                      <template slot-scope="{ row }">
                         <p :class="{isThrough:row.cancelStatus}">{{ row.originalConfirmNum }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作"  fixed="right" v-if="scope.row.orderStatus == '3'||scope.row.orderStatus == '4'||scope.row.orderStatus == '5'">
                      <template slot-scope="{ row, $index }">
                        <!-- <el-button class="el-icon-document-delete" type="danger" circle size="mini" :title="row.cancelStatus === true ? '已取消' : '取消'" :disabled="row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button> -->
                        <el-button class="el-icon-document-delete" type="danger" circle size="mini" title="撤销" :disabled="row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作"  fixed="right" v-if="scope.row.orderStatus == '1'" width="100">
                        <template slot-scope="{ row, $index }">
                          <div style="display:inline-flex;">
                             <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="editDeleteHandle($index, row)"></el-button>
                             <el-button class="el-icon-document-delete" type="danger" circle size="mini" title="撤销" :disabled="row.cancelStatus === true" @click.stop="revokeHandle($index, row)"></el-button>
                          </div>
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
              <el-table-column label="供应商">
                <template slot-scope="{ row }">
                  <!-- {{ row.supplierName }} -->
                  {{ row.supplierShortName }}
                </template>
              </el-table-column>
              <el-table-column label="贸易条款">
                <template slot-scope="{ row }">
                  {{ row.tradeTermsName }}
                </template>
              </el-table-column>
              <el-table-column label="币种">
                <template slot-scope="{ row }">
                  {{ row.currencyName }}
                </template>
              </el-table-column>
              <!-- <el-table-column label="客户名">
                <template slot-scope="{ row }">
                  <span v-if="row.poiList[0].prTypeName != '日常备货'">{{ row.customerName }}</span>
                  <span v-else></span>
                </template>
              </el-table-column> -->
              <el-table-column label="付款方式">
                <template slot-scope="{ row }">
                  {{ row.paymentMethodNames }}
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
                    <el-tag slot="reference" class="pointer" :type="row.orderStatus | statusFilter">{{ row.orderStatusName }}</el-tag>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="{ row, $index }">
                  <div v-if="row.orderStatus == '1' || row.orderStatus == '5'">
                    <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                    <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                    <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                  </div>
                  <div v-if="row.orderStatus == '2' || row.orderStatus == '3'">
                    <el-button class="el-icon-document" type="primary" circle size="mini" title="查看" @click.stop="checkHandle($index, row)"></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
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
      </div>
    </div>

    <!-- 编辑页 -->
    <div class="edit_part" v-else>
      <div class="clearfix mb10">
        <div class="display_ib mr10 mb10">
          <span class="tag"><span class="red mr5">*</span>采购订单类型：</span>
          <el-select class="select_single w200 mr10"
            v-model="editOrderData.purchaseOrderType"
            placeholder="请选择"
            @change="orderTypeChange($event, editOrderData)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in orderTypeList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label"><span class="red mr5">*</span>供应商：</span>
          <span class="label">{{editOrderData.supplierShortName}}</span>
          <!-- <span class="label">{{editOrderData.supplierName}}</span> -->
        </div>
        <div class="display_ib mr20">
            <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>贸易条款：</span>
            <el-select class="select_single w200 mr10 mb10"
              v-model="editOrderData.tradeTerms"
              @change="tradeTermsSelect"
              placeholder="请选择贸易条款">
              <el-option key="" label="请选择贸易条款" value=""></el-option>
              <el-option
                v-for="item in tradeTermsList"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label"><span class="red mr5">*</span>币种：</span>
          <el-select
            class="select_single w200"
            v-model="editOrderData.currencyName"
            placeholder="请选择"
            @change="currencyNameChange($event, editOrderData)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="item in currencyList"
              :key="item.index"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label">确认书工厂季：</span>
          <el-select class="w200" v-model.trim="editOrderData.factorySeason" placeholder="请选择" @change="factorySeasonChange($event, editOrderData)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option v-for="item in saleSeasonList" :key="item.index" :value="item.name" :label="item.name"></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label">采购价单：</span>
          <el-select class="w200" v-model.trim="editOrderData.priceListName" placeholder="请选择" @change="priceListNameChange($event, editOrderData)">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option v-for="item in priceOrderList" :key="item" :value="item" :label="item"></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="label"><span class="red mr5">*</span>付款方式：</span>
          <el-select class="w200" v-model.trim="editOrderData.paymentMethod" placeholder="请选择" @change="paymentMethodChange" :disabled="!isEmptyData">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option v-for="item in paymentMethodList" :key="item.dictItemValue" :value="item.dictItemValue" :label="item.dictItemName"></el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10" v-if="editOrderData.paymentMethod == 'downPayment'">
          <span class="label"><span class="red mr5">*</span>预付：</span>
          <el-select class="w200" v-model.trim="editOrderData.downPaymentOrPeriod" placeholder="请选择" @change="downPaymentChange($event, editOrderData)" v-if="!isDownPaymentInput">
            <el-option v-for="item in downPaymentList" :key="item.dictItemValue" :value="item.dictItemValue" :label="item.dictItemName"></el-option>
            <el-option key="" label="手动输入" value=""></el-option>
          </el-select>
          <span v-else class="w200">
            <el-input class="w200" v-model="editOrderData.downPaymentOrPeriod" placeholder="请输入" @change="downPaymentInputChange($event, editOrderData)" @input.native="downPaymentInputHandle"></el-input>
            <span class="label ml10 mr10">%</span>
            <el-button size="mini" round @click="downPaymentReselect">重新选择</el-button>
          </span>
        </div>
        
        <!-- Excel按钮 -->
        <!-- <el-button
          class="ml10 fr"
          type="primary"
          @click="switchEditMode"
        >Excel模式</el-button> -->
        <!-- Excel按钮 end -->
      </div>
      <div class="edit_wrap hidden">
        <upload-excel-component class="mb20" :on-success="importExcelSuccess" :before-upload="importExcelBeforeUpload" />
        <!-- 编辑组件 -->
        <editTable
          :tableList="editOrderData.poiList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="editFieldsList"
          @deleteHandle="deleteEditItemHandle"
          @inputBlur="inputBlur"
          @unitNumberInputChange="unitNumberInputChange"
          @unitNumberInputBlur="unitNumberInputBlur">
        </editTable>

        <div class="edit_btn_wrap mt20 fr">
          <el-button @click="cancelEditHandle">取消</el-button>
          <el-button type="primary" v-preventReClick @click="saveEditHandle">保存</el-button>
          <el-button type="primary" v-preventReClick @click="submitEditHandle">提交审批</el-button>
        </div>

      </div>
    </div>

    <!-- 子项详情弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <!-- <ul class="childlist" v-if="editOrderData.orderStatus == 2">
            <li :class="item.class" v-for="(item, index) in checkFieldList" :key="index">{{item.name}}</li>
          </ul> -->
          <!-- 审批中 -->
          <!-- <div class="allparentlist" v-if="editOrderData.orderStatus == 2">
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in editOrderData.poiList"
              :key="index">
              <li class="w10p" :title="childItem.materialCode ? childItem.materialCode : ''">{{childItem.materialCode ? childItem.materialCode : ''}}</li>
              <li class="w10p" :title="childItem.supplierName ? childItem.supplierName : ''">{{childItem.supplierName ? childItem.supplierName : ''}}</li>
              <li class="w10p" :title="childItem.offeredPrice ? childItem.offeredPrice : ''">{{childItem.offeredPrice ? childItem.offeredPrice : ''}}</li>
              <li class="w10p">
              	<span :title="(childItem.offeredQuantity ? childItem.offeredQuantity : '0') + childItem.purchaseMeasurementUnit" v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">
              		{{(childItem.offeredQuantity ? childItem.offeredQuantity : '0') + childItem.purchaseMeasurementUnit}}
              	</span>
              	<span v-else :title="(childItem.offeredQuantity ? childItem.offeredQuantity : '0') + '条'">{{(childItem.offeredQuantity ? childItem.offeredQuantity : '0') +'条'}}</span>
              </li>
              <li class="w10p" :title="childItem.offeredDate ? childItem.offeredDate : ''">{{childItem.offeredDate ? childItem.offeredDate : ''}}</li>
              <li class="w10p" :title="childItem.specialRequire ? childItem.specialRequire : ''">{{childItem.specialRequire ? childItem.specialRequire : ''}}</li>
              <li class="w10p" :title="childItem.auditOption ? childItem.auditOption : ''">{{childItem.auditOption ? childItem.auditOption : ''}}</li>
              <li class="w10p" :title="childItem.cargoReadyDateRecently ? childItem.cargoReadyDateRecently : ''">{{childItem.cargoReadyDateRecently ? childItem.cargoReadyDateRecently : ''}}</li>
            </ul>
          </div> -->
          <!-- 已通过 -->
          <ul class="childlist" v-if="editOrderData.orderStatus == 2 || editOrderData.orderStatus == 3">
            <li :class="item.class" v-for="(item, index) in checkApprovedFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-if="editOrderData.orderStatus == 2 || editOrderData.orderStatus == 3">
            <ul
              class="childcontentlist"
              v-for="(childItem, index) in editOrderData.poiList"
              :key="index">
              <li class="w10p" :title="childItem.materialCode ? childItem.materialCode : ''">{{childItem.materialCode ? childItem.materialCode : ''}}</li>
              <li class="w10p" :title="childItem.factorySeason ? childItem.factorySeason : ''">{{childItem.factorySeason ? childItem.factorySeason : ''}}</li>
              <li class="w10p" :title="childItem.supplierShortName ? childItem.supplierShortName : ''">{{childItem.supplierShortName ? childItem.supplierShortName : ''}}</li>
              <!-- <li class="w10p" :title="childItem.supplierName ? childItem.supplierName : ''">{{childItem.supplierName ? childItem.supplierName : ''}}</li> -->
              <li class="w10p" :title="childItem.currencyName ? childItem.currencyName : ''">{{childItem.currencyName ? childItem.currencyName : ''}}</li>
              <li class="w10p" :title="childItem.offeredPrice ? childItem.offeredPrice : '0'">{{childItem.offeredPrice ? childItem.offeredPrice : '0'}}</li>
              <li class="w10p" :title="childItem.offeredQuantity ? childItem.offeredQuantity : ''">
              	{{childItem.offeredQuantity ? childItem.offeredQuantity : ''}}
              	<span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">{{childItem.purchaseMeasurementUnit}}</span>
              	<span v-else>条</span>
              </li>
              <li class="w10p" :title="childItem.offeredDate ? childItem.offeredDate : ''">{{childItem.offeredDate ? childItem.offeredDate : ''}}</li>
              <li class="w10p" :title="childItem.confirmNumbers ? childItem.confirmNumbers : ''">{{childItem.confirmNumbers ? childItem.confirmNumbers : ''}}</li>
              <li class="w10p" :title="childItem.confirmTimeRecently ? childItem.confirmTimeRecently : ''">{{childItem.confirmTimeRecently ? childItem.confirmTimeRecently : ''}}</li>
              <li class="w10p" :title="childItem.cargoReadyDateRecently ? childItem.cargoReadyDateRecently : ''">{{childItem.cargoReadyDateRecently ? childItem.cargoReadyDateRecently : ''}}</li>
            </ul>
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
        <el-button type="primary" v-preventReClick @click="confirmDeleteHandle">确 定</el-button>
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
        <el-button type="primary" v-preventReClick @click="confirmSubmitHandle">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 撤销弹窗 -->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="revokeDialogVisible"
      :close-on-click-modal="false"
      :before-close="revokeCancel"
      width="30%">
      <div class="isremark">确定撤销？</div>
      <div class="display_ib mr10 mb10">
        <el-input class="input_single mr10" type="textarea" v-model="cancelRemark" placeholder="撤销原因" :rows="3"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="revokeCancel">取 消</el-button>
        <el-button type="textarea" @click="revokeDeleteHandle" :disabled="isDisabled">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import {
  purchaseOrderList,
  searchPurchaseOrderList,
  deletePurchaseOrder,
  deletePurchaseOrderItem,
  modifyPurchaseOrder,
  submitModifyPurchaseOrder,
  approvalProcessInfo,
  constDictList,
  dictList,
  supplierDictList,
  submitPurchaseOrder,
  getPriceOrderList,
  priceByMaterialCode,
  batchPriceByMaterialCode,
  revokePurchaseOrderItem
} from "@/api/module/purchaseApi.js";
import { purchasegetuuid } from "@/api/module/requisitionApi.js";
import { timeFormat, timeFormatGMT, verificationQuantity, excelDateFormatToDate, getTimeRange, trimStr} from '@/utils/index.js';
import { currencyTypeHandle } from '@/utils/public.js';
import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import Table from "@/layouts/components/common/Table.vue";
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "purchaseOrder",
  props: ['subName'],
  data() {
    return {
    	// Tab列表
      subNavList: [
        {
          label: '全部采购订单',
          value: ''
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
        }
        // {
        //   label: '已终止',
        //   value: 'Terminated'
        // }
      ],
      
       // Tabble组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      expands:[],
      
        // NEW TBALE
      selectUuidList: [],

      applicantName:'',
      tableLoading: true,
      type: '',
      orderCode: '',
      requestCode: '',
      dateVal: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      materialCode:'',
      supplierCode: '',
      purchaseOrderType: '',
      uuid: '',
      orderList: [],
      editOrderData: {},
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: 'All',
      popupTitle: '',
      dialogFormVisible: false,
      deleteDialogVisible: false,
      submitDialogVisible: false,
      revokeDialogVisible: false,
      submitParamsData: {},
      deleteId: '',
      revokeUuid: '',
      tradeTermsList:[],
      checkList: [],
      modifyOrderList: {},
      editOrderType:'',
      curEditItem: null,
      isEmptyData:true,
      isDisabled:false,
      parentData:{
        status: '',
        data: [
          {
            name: '',
            field: 'createTime',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '申请人',
            field: 'applicantName',
            class: 'w6p',
            isShowTit: true
          },
          {
            name: '订单编号',
            field: 'purchaseOrderId',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '请求类型',
            field: 'prTypeName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '供应商',
            // field: 'supplierName',
            field: 'supplierShortName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '币种',
            field: 'currencyName',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '销售订单编号',
            field: 'saleOrderId',
            class: 'w8p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '客户名称',
            field: 'customerName',
            class: 'w8p',
            isShowTit: true,
            isFilterField: true
          },
          {
            name: '付款方式',
            field: 'paymentMethodJoin',
            class: 'w8p',
            isShowTit: true
          },
          {
            name: '审批',
            field: '',
            class: '',
            isShowTit: false,
            isPopover: true
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
            isAction: true
          }
        ]
      },
      childData:{
        name: 'poiList',
        data: [
          {
            name: '',
            field: 'materialCode',
            class: 'w10p'
          },
          // {
          //   name: '',
          //   field: 'materialId',
          //   class: 'w10p'
          // },
          {
            name: '',
            field: 'offeredPrice',
            class: 'w5p'
          },
          {
            name: '',
            field: 'requiredQuantity',
            class: 'w5p'
          },
          {
            name: '调拨数量',
            field_1: 'offeredPackages',
            field_2: 'offeredQuantityPerPackage',
            field_3: 'offeredQuantity',
            field: 'offeredQuantity',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field: 'requiredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'offeredDate',
            class: 'w10p'
          },
          {
            name: '',
            field: 'specialRequire',
            class: 'w10p'
          },
          {
            name: '',
            field: 'offerLt',
            class: 'w10p'
          },
          {
            name: '',
            field: 'listOfCuttingLength',
            class: 'w10p'
          },
          {
            name: '',
            field: '',
            class: 'w10p pr',
            isAction: true
          }
        ]
      },
      allFieldNameList: [
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
          name: '采购价格',
          class: 'w9p'
        },
        {
          name: '采购数量',
          class: 'w12p'
        },
        {
          name: '工厂交期',
          class: 'w9p'
        },
        {
          name: '确认书号',
          class: 'w11p'
        },
        {
          name: '投产日期',
          class: 'w9p'
        },
        {
          name: '货妥日期',
          class: 'w9p'
        },
        {
          name: '折扣备注',
          class: 'w12p'
        }
      ],
      draftFieldNameList: [
        {
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '供应商',
          class: 'w11p'
        },
        {
          name: '采购价格',
          class: 'w9p'
        },
        {
          name: '请求数量',
          class: 'w12p'
        },
        {
          name: '采购数量',
          class: 'w12p'
        },
        {
          name: '期望交期',
          class: 'w9p'
        },
        {
          name: '工厂交期',
          class: 'w9p'
        },
        {
          name: '特殊要求',
          class: 'w12p'
        },
        // {
        //   name: 'VBCMTM',
        //   class: 'w11p'
        // },
        {
          name: '期望LT',
          class: 'w9p'
        }
      ],
      editDraftFieldNameList: [
        {
          name: '物料编号',
          class: 'w15p',
          isRules: false
        },
        {
          name: '供应商',
          class: 'w15p',
          isRules: false
        },
        {
          name: '采购价格',
          class: 'w15p',
          isRules: true
        },
        {
          name: '采购数量',
          class: 'w40p',
          isRules: true
        },
        {
          name: '工厂交期',
          class: 'w15p',
          isRules: true
        }
      ],
      approvingFieldNameList: [
        {
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '供应商',
          class: 'w11p'
        },
        {
          name: '采购价格',
          class: 'w9p'
        },
        {
          name: '采购数量',
          class: 'w12p'
        },
        {
          name: '工厂交期',
          class: 'w9p'
        },
        {
          name: '特殊要求',
          class: 'w12p'
        },
        {
          name: '审批状态',
          class: 'w9p'
        },
        {
          name: '审批意见',
          class: 'w11p'
        }
      ],
      
      offeredDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },

      isShowList: false,
      dialogdelVisible: false,
      isShowEdit: false,
      isSaveDisabled: false,
      isSubmitDisabled: false,
      priceListName: '',
      orderTypeList: [],
      supplierList: [],
      currencyList: [],
      saleSeasonList: [],
      priceOrderList: [],
      subNavList: [
        {
          label: '全部采购订单',
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
      fieldList: [
        {
          name: '物料编号',
          class: 'w10p'
        },
        // {
        //   name: '物料系统编号',
        //   class: 'w10p'
        // },
        // {
        //   name: '销售订单编号',
        //   class: 'w10p'
        // },
        {
          name: '采购价格',
          class: 'w10p'
        },
        {
          name: '请求数量',
          class: 'w10p'
        },
        {
          name: '采购数量',
          class: 'w15p'
        },
        {
          name: '期望交期',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '特殊要求',
          class: 'w10p'
        },
        {
          name: '期望LT',
          class: 'w5p'
        },
        {
          name: 'MTM',
          class: 'w5p'
        },
        // {
        //   name: '',
        //   class: 'w10p'
        // }
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '订单编号',
          class: 'w15p'
        },
        {
          name: '请求类型',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w8p'
        },
         {
          name: '贸易条款',
          class: 'w8p'
        },
        {
          name: '币种',
          class: 'w5p'
        },
        {
          name: '客户名',
          class: 'w8p'
        },
        {
          name: '付款方式',
          class: 'w8p'
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
          class: 'w10p'
        },
        {
          name: '采购数量',
          class: 'w30p'
        },
        {
          name: '价单价格',
          class: 'w10p'
        },
        {
          name: '采购价格',
          class: 'w15p'
        },
        {
          name: '系统折扣',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w15p'
        }
      ],
      checkFieldList: [
        {
          name: '物料编号',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '采购价格/欧元',
          class: 'w10p'
        },
        {
          name: '采购数量',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '特殊要求',
          class: 'w10p'
        },
        {
          name: '审批意见',
          class: 'w10p'
        },
        {
          name: '货妥日期',
          class: 'w10p'
        }
      ],
      checkApprovedFieldList: [
        {
          name: '物料编号',
          class: 'w10p'
        },
        {
          name: '确认书工厂季',
          class: 'w10p'
        },
        {
          name: '供应商',
          class: 'w10p'
        },
        {
          name: '币种',
          class: 'w10p'
        },
        {
          name: '采购价格',
          class: 'w10p'
        },
        {
          name: '采购数量',
          class: 'w10p'
        },
        {
          name: '工厂交期',
          class: 'w10p'
        },
        {
          name: '确认书号',
          class: 'w10p'
        },
        {
          name: '投产日期',
          class: 'w10p'
        },
        {
          name: '货妥日期',
          class: 'w10p'
        }
      ],

      inputData: '',
      cancelRemark:'',
      typeList:[
        {
          typeid:'BusinessAttire',
          typename:'职业装'
        },
        {
          typeid:'ZeroShear',
          typename:'零剪'
        }
      ],

      paymentMethodList: [],
      paymentMethodListClone: [],
      payMethod: '',
      periodList: [],
      period: '',
      isPeriodInput: false,
      isDownPaymentInput: false,
      downPayment: '',
      downPaymentList: [],
      showMethod: '',
      isEdit:false,
      editPartLoading: false,

      // 编辑组件数据
      editFieldsList: [],
      originalEditFieldsList: [
        {
          name: '采购数量',
          field: 'offeredQuantity',
          field_1: 'offeredPackages',
          field_2: 'offeredQuantityPerPackage',
          field_3: 'offeredQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w23p',
          width: '400'
        },
        {
          name: '价单价格',
          field: 'priceListPrice',
          // field_unit: 'purchaseMeasurementUnit',
          class: 'w16p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '采购价格',
          field: 'offeredPrice',
          class: 'w13p',
          width: '150'
        },
        {
          name: '系统折扣',
          field: 'systemDiscount',
          class: 'w13p',
          width: '150'
        },
        {
          name: '工厂交期',
          field: 'offeredDate',
          class: 'w18p',
          width: '180'
        },
        {
          name: '物料工厂季',
          field: 'materialFactorySeason',
          class: 'w13p',
          width: '150'
        },
        {
          name: '采购备注',
          field: 'purchaseRemark',
          class: 'w13p',
          width: '150'
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w13p',
          width: '150'
        },
        {
          name: '特殊要求',
          field: 'specialRequire',
          class: 'w13p',
          width: '150'
        },
        {
          name: '快货',
          field: 'mobileGoods',
          class: 'w13p',
          width: '150'
        },
        {
          name: '原确认书编号',
          field: 'originalConfirmNum',
          class: 'w13p',
          width: '150'
        },
        {
          name: 'EV产品',
          field: 'belongToEv',
          class: 'w13p',
          width: '150'
        },
        {
          name: 'MTM',
          field: 'listOfCuttingLength',
          class: 'w13p',
          width: '150',
          isQuantityField: true
        }
      ],
      standardEditFieldsList: [
        {
          name: '采购数量',
          field: 'offeredQuantity',
          field_1: 'offeredPackages',
          field_2: 'offeredQuantityPerPackage',
          field_3: 'offeredQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w23p',
          width: '400'
        },
        {
          name: '价单价格',
          field: 'priceListPrice',
          // field_unit: 'purchaseMeasurementUnit',
          class: 'w16p',
          width: '150',
          isQuantityField: true
        },
        {
          name: '采购价格',
          field: 'offeredPrice',
          class: 'w13p',
          width: '150'
        },
        {
          name: '系统折扣',
          field: 'systemDiscount',
          class: 'w13p',
          width: '150'
        },
        {
          name: '工厂交期',
          field: 'offeredDate',
          class: 'w18p',
          width: '180'
        },
        {
          name: '物料工厂季',
          field: 'materialFactorySeason',
          class: 'w13p',
          width: '150'
        },
        {
          name: '采购备注',
          field: 'purchaseRemark',
          class: 'w13p',
          width: '150'
        },
        {
          name: '备注',
          field: 'remark',
          class: 'w13p',
          width: '150'
        },
        {
          name: '特殊要求',
          field: 'specialRequire',
          class: 'w13p',
          width: '150'
        },
        {
          name: '快货',
          field: 'mobileGoods',
          class: 'w13p',
          width: '150'
        },
        {
          name: 'EV产品',
          field: 'belongToEv',
          class: 'w13p',
          width: '150'
        },
        {
          name: 'MTM',
          field: 'listOfCuttingLength',
          class: 'w13p',
          width: '150',
          isQuantityField: true
        }
      ],
      leaderFieldsList: [
        {
          name: '行号',
          field: 'purchaseOrderSn',
          class: 'w10p',
          width: '50'
        },
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '150',
          isText: true
        }
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
        purchaseOrderSn: true,
        materialCode: true,
        priceListPrice: true,
        systemDiscount: true,
        materialFactorySeason:true,
        specialRequire: true,
        purchaseRemark:true,
        // remark:true,
        mobileGoods: true,
        belongToEv: true,
        listOfCuttingLength: true,
        originalConfirmNum:true
      },
      inputSet: {
        // offeredPrice: {
        //   type: 'number'
        // },
        remark:true,
        offeredPrice: true,
        inputData: {
          maxlength: '8',
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
      datePickerSet: {
        offeredDate: true
      },
      unitSet: {
        offeredPackages: true
      },

      childHeaderList: ['Ref','PO编号', 'PO行号', '关联PR编号', '关联的PR行号', '物料编号', '采购备注', '请求数量', '请求规格', '采购数量包数', '采购数量规格', '采购数量', '采购价格', '期望交期', '工厂交期', '备注', '特殊要求', '期望LT', 'BUNCH','原确认书编号', 'EV', 'MTM', 'SCABAL工厂季', 'SCABAL织标数量'],
      childFieldsList: ['refCode', 'purchaseOrderId', 'purchaseOrderSn', 'prCode', 'priSn', 'materialCode', 'purchaseRemark', 'requiredQuantity', 'requiredQuantityPerPackage', 'offeredPackages', 'offeredQuantityPerPackage', 'offeredQuantity', 'offeredPrice', 'requiredDate', 'offeredDate', 'remark', 'specialRequire', 'offerLt', 'mobileGoods','originalConfirmNum', 'belongToEv', 'listOfCuttingLength', 'scabalSaleSeason', 'scabalWovenLabel'],

    };
  },
  components: {
    Table,
    editTable,
    UploadExcelComponent
  },
  beforeCreate() {

  },
  created() {
    this.activeName = this.subName ? this.subName : 'All';
    if (this.activeName == 'Draft') {
      this.orderStatus = 1;
      this.getPurchaseOrderList();
    }
  },
  mounted() {
    this.editFieldsList = this.standardEditFieldsList;
    // this.orderStatus = '1';
    this.getPurchaseOrderType();
    this.getSupplierDictList();
    this.getCurrencyList();
    this.getSaleSeasonList();
    // this.getPurchaseOrderList();
    this.fun_date();
    this.getPaymentMethodList();
    this.getPeriodList();
    this.getDownPaymentList();
    this.getTradeTermsList();
  },
  activated() {
    // this.activeName = this.subName;
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '',
        '2': 'warning',
        '3': 'success',
        '5': 'danger',
        '6': 'info',
      };
      return statusMap[status];
    }
  },
  watch: {
    subName(value, oldValue) {
      // console.log('subName: ', value, oldValue);
      this.activeName = value;
    }
  },
  computed: {
    checkFieldNameList() {
      switch (this.activeName) {
        case 'Draft':
          return this.draftFieldNameList;
          break;
        case 'Approving':
          return this.approvingFieldNameList;
          break;
        case 'Official':
          return this.allFieldNameList;
          // return this.allFieldNameList.filter(item => item.name != '折扣备注');
          break;
        default:
          break;
      }
    }
  },
  methods: {
    async importExcelSuccess({ results, header }) {
      // 上传Excel成功
      console.log('导入数据：', results, header, this.curEditItem);
      if (results && results.length) {
        let editList = [];
        for (let i = 0; i < results.length; i++) {
          let item = results[i];
          let editData = {};
          Object.keys(item).map((key) => {
            console.log('导入Excel表数据：', key, item[key]);  // key=>属性名  obj[key]=>属性值
            if (key == 'PO编号') {
              editData.purchaseOrderId = item[key];
            } else if (key == 'PO行号') {
              editData.purchaseOrderSn = item[key];
            } else if (key == '关联PR编号') {
              editData.prCode = item[key];
            } else if (key == '关联的PR行号') {
              editData.priSn = item[key];
            } else if (key == '物料编号') {
              editData.materialCode = item[key];
            } else if (key == '采购备注') {
              editData.purchaseRemark = item[key];
            } else if (key == '请求数量') {
              editData.requiredQuantity = item[key];
            } else if (key == '请求规格') {
              editData.requiredQuantityPerPackage = item[key] ? item[key] : 1;
            } else if (key == '采购数量包数') {
              editData.offeredPackages = item[key];
            } else if (key == '采购数量规格') {
              editData.offeredQuantityPerPackage = item[key];
            } else if (key == '采购数量') {
              editData.offeredQuantity = item[key];
            } else if (key == '采购价格') {
              editData.offeredPrice = item[key];
            } else if (key == '期望交期') {
              editData.requiredDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key == '工厂交期') {
              editData.offeredDate = item[key].toString().indexOf('-') !== -1 ? item[key] : excelDateFormatToDate(item[key]);
            } else if (key == '备注') {
              editData.remark = item[key];
            } else if (key == '期望LT') {
              editData.offerLt = item[key];
            } else if (key == 'BUNCH') {
              editData.mobileGoods = item[key];
            } else if(key='原确认书编号'){
              editData.originalConfirmNum=item[key];
            } else if (key == 'EV') {
              editData.belongToEv = item[key];
            } else if (key == 'MTM') {
              editData.listOfCuttingLength = item[key];
            } else if (key == 'SCABAL工厂季') {
              editData.scabalSaleSeason = item[key];
            } else if (key == 'SCABAL织标数量') {
              editData.scabalWovenLabel = item[key];
            }
          });
          editList.push(editData);
        }

        for (let i = 0; i < editList.length; i++) {
          let item = editList[i];
          for (let j = 0; j < this.curEditItem.poiList.length; j++) {
            let poiItem = this.curEditItem.poiList[j];
            if (item.purchaseOrderSn === poiItem.purchaseOrderSn) {
              poiItem = Object.assign(poiItem, item);
              if (poiItem.purchaseMeasurementUnit === '米') {
                poiItem.offeredQuantity = poiItem.offeredPackages * poiItem.offeredQuantityPerPackage;
              }
            }
          }
        }
        this.editOrderData.poiList = this.curEditItem.poiList;
      }
      
    },
    importExcelBeforeUpload(file) {
      // 上传Excel
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
    // 固定展示为两周前的时间范围
    fun_date() {
      this.dateVal = getTimeRange(-14);
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
    excelDownload() {
      let headerList = [];
      let fieldsList = ['purchaseOrderId', 'prTypeName', 'supplierShortName','tradeTermsName', 'currencyName', 'customerName', 'paymentMethodName', 'createTime', 'applicantName', 'orderStatusName'];
      this.parentFieldsList.forEach(hItem => {
        headerList.push(hItem.name);
      });
      import('@/vendor/Export2Excel').then(excel => {
        const list = this.orderList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: '采购订单',
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    childExcelDownload(item) {
      let headerList = this.childHeaderList;
      let fieldsList = this.childFieldsList;
      import('@/vendor/Export2Excel').then(excel => {
        for(let i in  item.poiList){
          let key=item.poiList[i];
          key.refCode=key.purchaseOrderId+'/'+key.purchaseOrderSn;
          this.$forceUpdate();
        }
        const list = item.poiList;
        const data = this.formatJson(fieldsList, list);
        excel.export_json_to_excel({
          header: headerList,
          data,
          filename: item.purchaseOrderId,
          autoWidth: true,
          bookType: 'xlsx'
        });
      });
    },
    mergeChildExcelDownload(item) {
      // 合并导出
      // console.log('合并导出：', item);
      let itemCopy = JSON.parse(JSON.stringify(item));
      let newPoiList = [];
      let temp = {};
      // for (let i in itemCopy.poiList) {
      for (let i = 0; i < itemCopy.poiList.length; i++) {
        let key = itemCopy.poiList[i].materialCode + itemCopy.poiList[i].offeredQuantityPerPackage + itemCopy.poiList[i].requiredDate;
        if (temp[key]) {
          // 存在当前物料编号 & (采购规格 & 期望交期相同)
          let ref=new Array(temp[key].purchaseOrderId,temp[key].purchaseOrderSn ? (temp[key].purchaseOrderSn + ',' + itemCopy.poiList[i].purchaseOrderSn) : temp[key].purchaseOrderSn);
          temp[key].refCode =ref.join("/");//Ref
          temp[key].purchaseOrderId = temp[key].purchaseOrderId;  // PO编号
          temp[key].purchaseOrderSn = temp[key].purchaseOrderSn ? (temp[key].purchaseOrderSn + ',' + itemCopy.poiList[i].purchaseOrderSn) : temp[key].purchaseOrderSn;  // PO行号
          temp[key].prCode = temp[key].prCode;  // 关联PR编号
          // temp[key].priSn = temp[key].priSn;  // 关联的PR行号
          temp[key].priSn = temp[key].priSn + ',' + itemCopy.poiList[i].priSn;  // 关联的PR行号
          temp[key].materialCode = temp[key].materialCode;  // 物料编号
          temp[key].purchaseRemark = temp[key].purchaseRemark ? (temp[key].purchaseRemark + '；' + itemCopy.poiList[i].purchaseRemark) : temp[key].purchaseRemark;  // 采购备注
          temp[key].requiredQuantity = temp[key].requiredQuantity + itemCopy.poiList[i].requiredQuantity;  // 请求数量
          temp[key].requiredQuantityPerPackage = temp[key].requiredQuantityPerPackage;  // 请求规格
          temp[key].offeredQuantity = temp[key].offeredQuantity + itemCopy.poiList[i].offeredQuantity;  // 采购数量
          temp[key].offeredPrice = temp[key].offeredPrice;  // 采购价格
          temp[key].requiredDate = temp[key].requiredDate;  // 期望交期
          temp[key].offeredDate = temp[key].offeredDate;  // 工厂交期
          temp[key].remark = temp[key].remark;  // 备注
          temp[key].offerLt = temp[key].offerLt;  // 期望LT
          temp[key].mobileGoods = temp[key].mobileGoods;  // BUNCH
          temp[key].belongToEv = temp[key].belongToEv;  // EV
          temp[key].originalConfirmNum=temp[key].originalConfirmNum;//原确认书编号
          temp[key].listOfCuttingLength = temp[key].listOfCuttingLength + itemCopy.poiList[i].listOfCuttingLength;  // MTM
          temp[key].scabalSaleSeason = temp[key].scabalSaleSeason;  // SCABAL工厂季（不是叫料订单不填）
          temp[key].scabalWovenLabel = temp[key].scabalWovenLabel;  // SCABAL织标数量（不是叫料订单不填）
          temp[key].offeredQuantityPerPackage = temp[key].offeredQuantityPerPackage;  // 采购规格
        } else {
          temp[key] = {};
          let ref=new Array(itemCopy.poiList[i].purchaseOrderId,itemCopy.poiList[i].purchaseOrderSn);
          temp[key].refCode =ref.join("/");//Ref
          temp[key].purchaseOrderId = itemCopy.poiList[i].purchaseOrderId;  // PO编号
          temp[key].purchaseOrderSn = itemCopy.poiList[i].purchaseOrderSn;  // PO行号
          temp[key].prCode = itemCopy.poiList[i].prCode;  // 关联PR编号
          temp[key].priSn = itemCopy.poiList[i].priSn;  // 关联的PR行号
          temp[key].materialCode = itemCopy.poiList[i].materialCode;  // 物料编号
          temp[key].purchaseRemark = itemCopy.poiList[i].purchaseRemark;  // 采购备注
          temp[key].requiredQuantity = itemCopy.poiList[i].requiredQuantity;  // 请求数量
          temp[key].requiredQuantityPerPackage = itemCopy.poiList[i].requiredQuantityPerPackage;  // 请求规格
          temp[key].offeredQuantity = itemCopy.poiList[i].offeredQuantity;  // 采购数量
          temp[key].offeredPrice = itemCopy.poiList[i].offeredPrice;  // 采购价格
          temp[key].requiredDate = itemCopy.poiList[i].requiredDate;  // 期望交期
          temp[key].offeredDate = itemCopy.poiList[i].offeredDate;  // 工厂交期
          temp[key].remark = itemCopy.poiList[i].remark;  // 备注
          temp[key].offerLt = itemCopy.poiList[i].offerLt;  // 期望LT
          temp[key].mobileGoods = itemCopy.poiList[i].mobileGoods;  // BUNCH
          temp[key].belongToEv = itemCopy.poiList[i].belongToEv;  // EV
          temp[key].originalConfirmNum=temp[key].originalConfirmNum;//原确认书编号
          temp[key].listOfCuttingLength = itemCopy.poiList[i].listOfCuttingLength;  // MTM
          temp[key].scabalSaleSeason = itemCopy.poiList[i].scabalSaleSeason;  // SCABAL工厂季
          temp[key].scabalWovenLabel = itemCopy.poiList[i].scabalWovenLabel;  // SCABAL织标数量
          temp[key].offeredQuantityPerPackage = itemCopy.poiList[i].offeredQuantityPerPackage;  // 请求规格
        }
      }
      for (let k in temp) {
        newPoiList.push(temp[k]);
      }
      itemCopy.poiList = newPoiList;
      this.childExcelDownload(itemCopy);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
  	checkApprovalProcess(item, index) {
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
          this.$set(this.orderList, index, item);
          this.$forceUpdate();
        }
      });
    },
    // periodInputHandle({ target }) {
    //   this.verificationVal = target.value = target.value.replace(/[^0-9]/g, '');
    // },
    downPaymentInputHandle({target}){
      target.value = target.value.replace(/[^0-9]/g, "");
      if(target.value>100){
        this.editOrderData.downPaymentOrPeriod=100
      }else if(target.value<1){
        this.editOrderData.downPaymentOrPeriod=''
      }
    },
    orderTypeChange(val, item) {
      console.log(val,item)
      let orderTypeData = this.orderTypeList.find(x => {
        return x.index === val;
      });
      item.purchaseOrderTypeName = orderTypeData ? orderTypeData.name : '';
       //差异单 原材料 付款方式无 不能选
      if(item.purchaseOrderTypeName.includes('差异单') || item.purchaseOrderTypeName.includes('原材料(坯布纱线)')){
        this.isEmptyData=false;
        item.paymentMethod='None';
        item.paymentMethodName='无';
      }else{
        this.isEmptyData=true;
      }
      //原材料
      if (item.purchaseOrderTypeName.includes('差异单')) {
        // 差异单
         for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          data.offeredPrice = 0.00;
        }
        this.editFieldsList = this.originalEditFieldsList;
        this.paymentMethodList = this.paymentMethodList.filter(x => x.dictItemName !== '预付');
      } else {
        this.editFieldsList = this.standardEditFieldsList;
        this.paymentMethodList = this.paymentMethodListClone;
      }
      this.$forceUpdate();
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
    currencyNameChange(val, item) {
      // console.log('币种转换：', val, item, this.currencyList);
      // this.editOrderData.currencyName = this.currencyTypeHandle(val);
      let currencyData = this.currencyList.find(cItem => {
        return cItem.name == val;
      });
      item.currency = currencyData.index;
      item.priceListName = '';
      this.getPriceOrderList();
      if (item.priceListName) {
        this.priceListHandle(item);
      } else {
        for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          data.priceListPrice = 0.00;
          data.offeredPrice = 0.00;
          data.systemDiscount = '100%';
        }
      }
    },
    factorySeasonChange(val, item) {
      // this.editOrderData.currencyName = this.currencyTypeHandle(val);
      // item.priceListName = '';
      this.getPriceOrderList('', '', val);
      if (item.priceListName) {
        this.priceListHandle(item);
      } else {
        for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          data.priceListPrice = 0.00;
          data.offeredPrice = 0.00;
          data.systemDiscount = '100%';
        }
      }
    },
    priceListNameChange(val, item) {
      if (val) {
        this.priceListHandle(item);
      } else {
        for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          data.priceListPrice = 0.00;
          data.offeredPrice = 0.00;
          data.systemDiscount = '100%';
        }
      }
    },
    // periodChange(val, item) {
    //   if (!val) {
    //     this.isPeriodInput = true;
    //   }
    //   this.editOrderData.downPaymentOrPeriod = val;
    // },
    // periodInputChange(val) {
    //   this.editOrderData.downPaymentOrPeriod = val;
    // },
    downPaymentChange(val, item) {
      // 预付下拉框更改
      if (!val) {
        this.isDownPaymentInput = true;
      }
      this.editOrderData.downPaymentOrPeriod = val;
    },
    downPaymentInputChange(val) {
      // 预付输入框更改
      this.editOrderData.downPaymentOrPeriod = val;
    },
    paymentMethodChange(val) {
      // 付款方式更改
      console.log('付款方式值更改：', val);
      this.editOrderData.downPaymentOrPeriod = null;
      let paymentMethodData = this.paymentMethodList.find(item => {
        return item.dictItemValue == val;
      });
      this.editOrderData.paymentMethodName = paymentMethodData ? paymentMethodData.dictItemName : '';
      this.isDownPaymentInput = false;
      this.isPeriodInput = false;
    },
    downPaymentReselect() {
      // 重新选择预付
      this.editOrderData.downPaymentOrPeriod = null;
      this.isDownPaymentInput = false;
    },
    // periodReselect() {
    //   // 重新选择账期
    //   this.editOrderData.downPaymentOrPeriod = null;
    //   this.isPeriodInput = false;
    // },
    async priceListHandle(item) {
      console.log('采购价单：', item.poiList);
      // let meters = '';
      let batchPriceList = [];
      let temp = {};
      // for (let i in item.poiList) {
      for (let i = 0; i < item.poiList.length; i++) {
        let key = item.poiList[i].materialCode;
        if (temp[key]) {
          temp[key].materialCode = temp[key].materialCode;
          temp[key].priceListName = temp[key].priceListName;
          temp[key].meter = temp[key].meter + item.poiList[i].offeredQuantity;
        } else {
          temp[key] = {};
          temp[key].materialCode = item.poiList[i].materialCode;
          temp[key].priceListName = item.priceListName;
          temp[key].meter = item.poiList[i].offeredQuantity;
        }
      }
      for (let k in temp) {
        batchPriceList.push(temp[k]);
      }
      batchPriceByMaterialCode(batchPriceList).then(res => {
        // console.log('采购价单批量获取价单价格：', res);
        if (res.code === '0') {
          let defaultCount = 0;
          res.data.map(x => {
            item.poiList.map(p => {
              if (p.materialCode === x.materialCode) {
                p.priceListPrice = x.price ? (parseFloat(x.price)).toFixed(2) : defaultCount.toFixed(2);
                p.offeredPrice = x.price ? (parseFloat(x.price)).toFixed(2) : defaultCount.toFixed(2);
                if (!parseFloat(p.priceListPrice) || !parseFloat(p.offeredPrice)) {
                  p.systemDiscount = '100%';
                } else {
                  p.systemDiscount = parseFloat((parseFloat(p.offeredPrice) / parseFloat(p.priceListPrice) * 100).toFixed(2)) + '%';
                }
                this.$forceUpdate();
              }
            });
          });
        }
      });
    },
    deleteHandle(index, item) {
      // 删除订单
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
      this.isEdit=false;
      // this.$confirm('确认删除此条订单?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   deletePurchaseOrder(item.id).then(res => {
      //     if (res.code === '0') {
      //       this.getPurchaseOrderList();
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功!'
      //       });
      //     }
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    editDeleteHandle(index,item){
      console.log(index,item)
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
      this.isEdit=true;
    },
    confirmDeleteHandle() {
      if(this.isEdit){
        deletePurchaseOrderItem(this.deleteId).then(res => {
          if (res.code === '0') {
            this.getPurchaseOrderList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.deleteDialogVisible = false;
        });
      }else{
        deletePurchaseOrder(this.deleteId).then(res => {
          if (res.code === '0') {
            this.getPurchaseOrderList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
          this.deleteDialogVisible = false;
        });
      }
    },
    async editHandle(index, item) {
      // 编辑订单
      console.log('编辑订单详情：', item);
      if (!item.currency || !item.currencyName) {
        let currencyData = this.currencyList.find(x => {
          return x.name === '欧元';
        });
        item.currency = currencyData ? currencyData.index : '';
        item.currencyName = currencyData ? currencyData.name : '';
      }
      this.curEditItem = JSON.parse(JSON.stringify(item));
      //点击编辑的时候给 如果paymentMethod有值 将他中英转化
      // if(this.editOrderData.paymentMethod!='' && this.editOrderData.paymentMethod!=null){
      //   this.editOrderData.paymentMethod=='downPayment'?this.editOrderData.paymentMethod='预付':this.editOrderData.paymentMethod='账期'
      // }
      this.getPriceOrderList(item.supplierCode ? item.supplierCode : '', item.currency ? item.currency : '', item.factorySeason ? item.factorySeason : '');
      this.isShowEdit = true;
      // this.getSearchOrderList(item.id);
      if (item.priceListName && item.currencyName) {
        // this.priceListHandle(item);
        // let meters = '';
        
        this.priceListHandle(item);

        // let temp = {};
        // for (let i in item.poiList) {
        //   let key = item.poiList[i].materialCode;
        //   if (temp[key]) {
        //     temp[key].materialCode = temp[key].materialCode;
        //     temp[key].meter = temp[key].meter + item.poiList[i].offeredQuantity;
        //   } else {
        //     temp[key] = {};
        //     temp[key].materialCode = item.poiList[i].materialCode;
        //     temp[key].meter = item.poiList[i].offeredQuantity;
        //   }
        // }
        // for (var i = 0; i < item.poiList.length; i++) {
        //   let data = item.poiList[i];
        //   // meters = parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) ? parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) : 0;
        //   await priceByMaterialCode(item.priceListName, data.materialCode, temp[data.materialCode].meter).then(res => {
        //     console.log('采购价单带出价单价格：', res);
        //     if (res.code === '0') {
        //       let defaultCount = 0;
        //       data.priceListPrice = res.data ? (parseFloat(res.data)).toFixed(2) : defaultCount.toFixed(2);
        //       // data.offeredPrice = res.data ? res.data : 0;
        //       if (!parseFloat(data.priceListPrice) || !parseFloat(data.offeredPrice)) {
        //         data.systemDiscount = '100%';
        //       } else {
        //         data.systemDiscount = parseFloat((parseFloat(data.offeredPrice) / parseFloat(data.priceListPrice) * 100).toFixed(2)) + '%';
        //       }
        //     }
        //   });
        // }
      } else {
        let defaultCount = 0;
        for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          data.priceListPrice = defaultCount.toFixed(2);
          // data.offeredPrice = 0;
          data.systemDiscount = '100%';
        }
      }
      //采购订单类型为差异单 原材料 付款方式无 不能选
      if(item.purchaseOrderTypeName.includes('差异单') || item.purchaseOrderTypeName.includes('原材料(坯布纱线)')){
        this.isEmptyData=false;
        item.paymentMethod='None';
        item.paymentMethodName='无';
      }else{
        this.isEmptyData=true;
      }
      if (item.prTypeName.includes('差异单')) {
        // 差异单
        this.editFieldsList = this.originalEditFieldsList;
        this.$forceUpdate();
      } else {
        this.editFieldsList = this.standardEditFieldsList;
        this.$forceUpdate();
      }
      // 差异单时允许采购数量为负数
      if (item.prTypeName.includes('差异单')) {
        for (var i = 0; i < item.poiList.length; i++) {
          let data = item.poiList[i];
          if(!data.offeredPrice){
             data.offeredPrice = 0.00;
          }
          data.editModeSet.unitSet.offeredPackages = {
            min: '-9999999999'
          };
        }
      }
      this.editOrderData = JSON.parse(JSON.stringify(item));
      console.log(this.editOrderData.poiList)
    },
    submitHandle(index, item) {
      console.log('列表提交数据：', item);
      this.modifyOrderList = item;
      this.submitParamsData = {
        uuid: item.uuid,
        orderStatus: 2,
        submitType: '',
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      if (item.orderStatus == 1) {
        this.submitParamsData.submitType = 2;
      }
      if (item.orderStatus == 5) {
        this.submitParamsData.submitType = 4;
      }
      this.submitDialogVisible = true;
    },
    confirmSubmitHandle() {
      // let list = [];
      let orderStatus = null;
      if (this.activeName === 'Draft') {
        orderStatus = 1;
      }
      if (this.activeName === 'Rejected') {
        orderStatus = 5;
      }

      // if (this.modifyOrderList.orderStatus == 1) {
      //   this.modifyOrderList.submitType = 2;
      // }
      // if (this.modifyOrderList.orderStatus == 5) {
      //   this.modifyOrderList.submitType = 4;
      // }
      // this.modifyOrderList.orderStatus = 2;
      // this.modifyOrderList.applicant = this.$store.state.userName;
      // this.modifyOrderList.applicantName = this.$store.state.realName;
      // this.modifyOrderList.applicantDepartment = this.$store.state.currentDepartment.id;
      // this.modifyOrderList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      // list.push(this.modifyOrderList);
      submitModifyPurchaseOrder(this.submitParamsData).then(res => {
        // console.log('提交审批：', res);
        if (res.code === '0') {
          this.orderStatus = 2;
          this.currentPage = 1;
          this.getPurchaseOrderList();
          this.activeName = 'Approving';
          this.$message({
            type: 'success',
            message: '提交成功!'
          });
        } else {
          this.orderStatus = orderStatus;
          this.getPurchaseOrderList();
        }
        this.submitDialogVisible = false;
      });
    },
    deleteEditItemHandle(index, item) {
      let editOrderDataCopy = JSON.parse(JSON.stringify(this.editOrderData));
      editOrderDataCopy.poiList.splice(index, 1);
      this.editOrderData = editOrderDataCopy;
    },
    cancelEditHandle() {
      this.isShowEdit = false;
    },
     dateValChange(val) {
      // 创建时间变化
      // this.beginTime = val[0];
      // this.endTime = val[1];
    },
    saveEditHandle() {
      // 编辑保存
      console.log('编辑保存数据：', this.editOrderData);
      let self = this;
      let reg = /^[\d|\.]*$/;
      let editList = this.editOrderData.poiList;
      if (!this.editOrderData.purchaseOrderType) {
        this.$message({
          type: 'error',
          message: '请选择采购订单类型！'
        });
        return false;
      }
      if (!this.editOrderData.tradeTerms) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editOrderData.currencyName) {
        this.$message({
          type: 'error',
          message: '请选择币种！'
        });
        return false;
      }
      if (!this.editOrderData.paymentMethod) {
        this.$message({
          type: 'error',
          message: '请选择付款方式！'
        });
        return false;
      }
      if (this.editOrderData.paymentMethod == 'downPayment' && !this.editOrderData.downPaymentOrPeriod) {
        this.$message({
          type: 'error',
          message: '请选择' + this.editOrderData.paymentMethodName + '！'
        });
        return false;
      }
      
      // if (reg.test(this.editOrderData.downPaymentOrPeriod)) {
      //   // 验证账期/预付格式
      //   self.editOrderData.paymentMethod=='预付'?self.editOrderData.downPaymentOrPeriod=self.editOrderData.downPaymentOrPeriod+"%":self.editOrderData.downPaymentOrPeriod+"天"
      // }
      // //self.editOrderData.paymentMethod=='预付'?self.editOrderData.paymentMethod="downPayment":self.editOrderData.paymentMethod="period"
      // var changeeditOrderData={...self.editOrderData}
      // changeeditOrderData.paymentMethod=='预付'?changeeditOrderData.paymentMethod="downPayment":changeeditOrderData.paymentMethod="period"

      for (var i = 0; i < editList.length; i++) {
        if (isNaN(parseInt(editList[i].offeredPrice))) {
          this.$message({
            type: 'error',
            message: '请输入采购价格！'
          });
          return false;
        }
        if (parseInt(editList[i].offeredPrice) <0) {
          this.$message({
            type: 'error',
            message: '采购价格不能小于0！'
          });
          return false;
        }
        if (!verificationQuantity(this, editList[i].offeredPrice, 6, 2, '采购价格')) {
          return false;
        }
        // if (!this.verificationHandle(editList[i].offeredPrice, '采购价格')) {
        //   editList[i].offeredPrice = 0;
        //   return false;
        // }
        if(editList[i].purchaseMeasurementUnit == '米'){
        	if (!editList[i].offeredPackages || !editList[i].offeredQuantityPerPackage) {
	          this.$message({
	            type: 'error',
	            message: '请输入采购数量！'
	          });
	          return false;
	        }
        }else{
        	if (!editList[i].offeredQuantity) {
	          this.$message({
	            type: 'error',
	            message: '请输入采购数量！'
	          });
	          return false;
	        }
        }
        if(editList[i].purchaseMeasurementUnit == '米'){
        	editList[i].offeredQuantity = parseFloat(editList[i].offeredPackages)*parseFloat(editList[i].offeredQuantityPerPackage);
        }
        if (editList[i].offeredQuantity.toString().indexOf('.') !== -1) {
          let arr = editList[i].offeredQuantity.toString().split('.');
          if (arr[0].length > 8) {
            this.$message({
              message: '采购数量米数仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (arr[1].length > 2) {
            this.$message({
              message: '采购数量米数仅支持小数位2位，请重新输入！',
              type: 'error'
            });
            return false;
          }
        } else if (editList[i].offeredQuantity.toString().length > 8) {
          this.$message({
            message: '采购数量米数仅支持整数位8位，请重新输入！',
            type: 'error'
          });
          return false;
        }
        if (!editList[i].offeredDate) {
          this.$message({
            type: 'error',
            message: '请输入工厂交期！'
          });
          return false;
        }
        if (!(editList[i].offeredDate).toString().includes('-')) {
          editList[i].offeredDate = timeFormatGMT(editList[i].offeredDate);
        }
        editList[i].priceListPrice = editList[i].priceListPrice ? editList[i].priceListPrice : 0;
      }
      if (this.editOrderData.orderStatus == 1) {
        self.editOrderData.submitType = 1;
      }
      if (this.editOrderData.orderStatus == 5) {
        self.editOrderData.submitType = 3;
      }
      self.editOrderData.applicant = this.$store.state.userName;
      self.editOrderData.applicantName = this.$store.state.realName;
      self.editOrderData.applicantDepartment = this.$store.state.currentDepartment.id;
      self.editOrderData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSaveDisabled = true;
      modifyPurchaseOrder(this.editOrderData).then(res => {
        // console.log('修改保存订单：', res);
        if (res.code === '0') {
          self.getPurchaseOrderList();
          self.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.isShowEdit = false;
          this.isDownPaymentInput=false;
          this.isPeriodInput=false;
        }
        this.isSaveDisabled = false;
      });
    },
    submitEditHandle() {
      let self = this;
      let editList = this.editOrderData.poiList;
      if (!this.editOrderData.purchaseOrderType) {
        this.$message({
          type: 'error',
          message: '请选择采购订单类型！'
        });
        return false;
      }
      if (!this.editOrderData.tradeTerms) {
        this.$message({
          type: 'error',
          message: '请选择贸易条款！'
        });
        return false;
      }
      if (!this.editOrderData.currencyName) {
        this.$message({
          type: 'error',
          message: '请选择币种！'
        });
        return false;
      }
      if (!this.editOrderData.paymentMethod) {
        this.$message({
          type: 'error',
          message: '请选择付款方式！'
        });
        return false;
      }
      if (this.editOrderData.paymentMethod == 'downPayment' && !this.editOrderData.downPaymentOrPeriod) {
        this.$message({
          type: 'error',
          message: '请选择' + this.editOrderData.paymentMethodName + '！'
        });
        return false;
      }
      for (var i = 0; i < editList.length; i++) {
        if (isNaN(parseInt(editList[i].offeredPrice))){
          this.$message({
            type: 'error',
            message: '请输入采购价格！'
          });
          return false;
        }
        if (parseInt(editList[i].offeredPrice) <0) {
          this.$message({
            type: 'error',
            message: '采购价格不能小于0！'
          });
          return false;
        }
        if (!verificationQuantity(this, editList[i].offeredPrice, 6, 2, '采购价格')) {
          return false;
        }
        // if (!this.verificationHandle(editList[i].offeredPrice, '采购价格')) {
        //   editList[i].offeredPrice = 0;
        //   return false;
        // }
        if(editList[i].purchaseMeasurementUnit=='米'){
        	if (!editList[i].offeredPackages || !editList[i].offeredQuantityPerPackage) {
	          this.$message({
	            type: 'error',
	            message: '请输入采购数量！'
	          });
	          return false;
	        }
        }else{
        	if (!editList[i].offeredQuantity) {
	          this.$message({
	            type: 'error',
	            message: '请输入采购数量！'
	          });
	          return false;
	        }
        }
        if(editList[i].purchaseMeasurementUnit=='米'){
        	editList[i].offeredQuantity = parseFloat(editList[i].offeredPackages)*parseFloat(editList[i].offeredQuantityPerPackage);
        }
        if (editList[i].offeredQuantity.toString().indexOf('.') !== -1) {
          let arr = editList[i].offeredQuantity.toString().split('.');
          if (arr[0].length > 8) {
            this.$message({
              message: '采购数量米数仅支持整数位8位，请重新输入！',
              type: 'error'
            });
            return false;
          }
          if (arr[1].length > 2) {
            this.$message({
              message: '采购数量米数仅支持小数位2位，请重新输入！',
              type: 'error'
            });
            return false;
          }
        } else if (editList[i].offeredQuantity.toString().length > 8) {
          this.$message({
            message: '采购数量米数仅支持整数位8位，请重新输入！',
            type: 'error'
          });
          return false;
        }
        if (!editList[i].offeredDate) {
          this.$message({
            type: 'error',
            message: '请输入工厂交期！'
          });
          return false;
        }
        if (!(editList[i].offeredDate).toString().includes('-')) {
          editList[i].offeredDate = timeFormatGMT(editList[i].offeredDate);
        }
        editList[i].priceListPrice = editList[i].priceListPrice ? editList[i].priceListPrice : 0;
      }
      if (this.editOrderData.orderStatus == 1) {
        self.editOrderData.submitType = 2;
      }
      if (this.editOrderData.orderStatus == 5) {
        self.editOrderData.submitType = 4;
        self.editOrderData.orderStatus = 2;
      }
      self.editOrderData.applicant = this.$store.state.userName;
      self.editOrderData.applicantName = this.$store.state.realName;
      self.editOrderData.applicantDepartment = this.$store.state.currentDepartment.id;
      self.editOrderData.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.isSubmitDisabled = true;
      // var reg = /^[\d|\.]*$/;
      // if(reg.test(self.editOrderData.downPaymentOrPeriod)){
      //   self.editOrderData.paymentMethod=='预付'?self.editOrderData.downPaymentOrPeriod=self.editOrderData.downPaymentOrPeriod+"%":self.editOrderData.downPaymentOrPeriod+"天"
      // }
      // //self.editOrderData.paymentMethod=='预付'?self.editOrderData.paymentMethod="downPayment":self.editOrderData.paymentMethod="period"
      // var changeeditOrderData={...self.editOrderData}
      // changeeditOrderData.paymentMethod=='预付'?changeeditOrderData.paymentMethod="downPayment":changeeditOrderData.paymentMethod="period"
      modifyPurchaseOrder(this.editOrderData).then(res => {
        // console.log('修改保存订单：', res);
        if (res.code === '0') {
          this.orderStatus = 2;
          this.currentPage = 1;
          self.getPurchaseOrderList();
          this.activeName = 'Approving';
          self.$message({
            type: 'success',
            message: '提交审批成功!'
          });
          this.isShowEdit = false;
          this.isDownPaymentInput=false;
          this.isPeriodInput=false;
        }
        this.isSubmitDisabled = false;
        this.showMethod='';
      });
    },
    actionsTypeHandle(orderStatus) {
      switch (orderStatus) {
        case 1:
          return '草稿';
          break;
        case 2:
          return '审批中';
          break;
        case 3:
          return '已通过';
          break;
        case 4:
          return '工厂确认';
          break;
        case 5:
          return '已驳回';
          break;
        case 6:
          return '已终止';
          break;
        default:
          break;
      }
    },
    searchHandle() {
      // 搜索
      this.currentPage = 1;
       if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.getPurchaseOrderList();
    },
    uploadHandle() {
      // 上传
    },
    downloadHandle() {
      // 下载
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    switchTabHandle(tab) {
      // tab切换
      console.log('tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.orderList = [];
      switch (tab.name) {
        case 'All':
          // 全部
          this.orderStatus = '';
          break;
        case 'Draft':
          // 草稿
          this.orderStatus = 1;
          break;
        case 'Approving':
          // 审批中
          this.orderStatus = 2;
          break;
        case 'Approved':
          // 已通过/已审批
          this.orderStatus = 3;
          break;
        case 'Rejected':
          // 已驳回
          this.orderStatus = 5;
          break;
        case 'Terminated':
          // 已终止
          this.orderStatus = 6;
          break;
        default:
          this.orderStatus = '';
          break;
      }
      this.getPurchaseOrderList();
    },
    async checkHandle(index, item) {
      // 查看订单
      this.editOrderData = item;
      this.popupTitle = '查看订单信息';
      this.dialogFormVisible = true;
    },
    revokeHandle(index, item) {
      // 列表撤销（已通过）
      this.revokeDialogVisible = true;
      this.revokeUuid = item.uuid;
    },
    revokeCancel(){
      this.revokeDialogVisible=false;
      this.cancelRemark='';
    },
    revokeDeleteHandle() {
      // 列表撤销确认
      this.isDisabled=true;
      revokePurchaseOrderItem(this.revokeUuid,this.cancelRemark).then(res => {
        // console.log('撤销项：', res);
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: '撤销成功！'
          });
          this.getPurchaseOrderList();
        }
        this.isDisabled=false;
        this.cancelRemark='';
        this.revokeDialogVisible = false;
      });
    },
    // priceResetHandle(val, item) {
    //   let editListCopy = JSON.parse(JSON.stringify(this.editOrderData.poiList));
    //   let temp = {};
    //   for (let i in editListCopy) {
    //     let key = editListCopy[i].materialCode;
    //     if (temp[key]) {
    //       temp[key].materialCode = temp[key].materialCode;
    //       temp[key].meter = temp[key].meter + editListCopy[i].offeredQuantity;
    //     } else {
    //       temp[key] = {};
    //       temp[key].materialCode = editListCopy[i].materialCode;
    //       temp[key].meter = editListCopy[i].offeredQuantity;
    //     }
    //   }

    //   for (var i = 0; i < editListCopy.length; i++) {
    //     let data = editListCopy[i];
    //     if (data.uuid == item.uuid) {
    //       if (val && val.toString().length > 9) {
    //         this.$message({
    //           message: '超长字符，请重新输入！',
    //           type: 'error'
    //         });
    //         data.offeredPackages = '0';
    //       }
    //       data.offeredQuantity = parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) ? parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) : 0;
    //       // let meters = parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) ? parseFloat(data.offeredPackages) * parseFloat(data.offeredQuantityPerPackage) : 0;
    //       if (this.editOrderData.priceListName) {
    //         priceByMaterialCode(this.editOrderData.priceListName, data.materialCode, temp[data.materialCode].meter).then(res => {
    //           console.log('根据采购数量带出价单价格：', res);
    //           if (res.code === '0') {
    //             let defaultCount = 0;
    //             data.priceListPrice = res.data ? (parseFloat(res.data)).toFixed(2) : defaultCount.toFixed(2);
    //             data.offeredPrice = res.data ? (parseFloat(res.data)).toFixed(2) : defaultCount.toFixed(2);
    //             if (!parseFloat(data.priceListPrice) || !parseFloat(data.offeredPrice)) {
    //               data.systemDiscount = '100%';
    //             } else {
    //               data.systemDiscount = parseFloat((parseFloat(data.offeredPrice) / parseFloat(data.priceListPrice) * 100).toFixed(2)) + '%';
    //             }
    //           }
    //         });
    //       }
    //     }
    //   }
    //   this.editOrderData.poiList = editListCopy;
    //   this.$forceUpdate();
    // },
    offeredDateChange() {

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
      // 采购订单列表
      let data = {
        beginTime: this.beginTime,
        endTime: this.endTime,
        customerId: this.customerId,
        orderStatus: this.orderStatus,
        purchaseOrderId: this.purchaseOrderId,
        materialCode:this.materialCode,
        uuid: this.uuid,
        sort: 'desc',
        purchaseOrderType: this.purchaseOrderType,
        supplierCode: this.supplierCode,
        applicantName:this.applicantName
      };
      purchaseOrderList(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code === '0') {
          // var reg = /^["|'](.*)["|']$/g;
          var reg = /\"(.*?)\"/;
          this.orderList = res.data.records;
          this.total = res.data.total;
          for (let i = 0; i < this.orderList.length; i++) {
            let item = this.orderList[i];
            this.orderTypeList.forEach(val=>{
              if(item.purchaseOrderType==val.index){
                item.purchaseOrderTypeName=val.name
              }
            })
            item.createTime = item.createTime ? timeFormat(item.createTime) : '';
            item.orderStatusName = this.actionsTypeHandle(item.orderStatus);
            // 预付值转换
            let downPaymentData = this.downPaymentList.find(dpItem => {
              return dpItem.dictItemValue == item.downPaymentOrPeriod;
            });
            item.downPaymentOrPeriodName = downPaymentData ? downPaymentData.dictItemName : '';

            //付款方式转化
            switch(item.paymentMethod){
              case 'downPayment':
                item.paymentMethodNames='预付';
              break ;
              case 'period':
                item.paymentMethodNames='账期';
               break ;
              case 'None':
                 item.paymentMethodNames='无';
              default:
                item.paymentMethodNames='无';
              break; 
            }

            item.prTypeName = item.poiList[0].prTypeName;

            for(var a=0;a<this.paymentMethodList.length;a++){
            	let adata=this.paymentMethodList[a];
            	if(item.paymentMethod==adata.dictItemValue){
            		item.paymentMethodName=adata.dictItemName;
            	}
            }
            for(var z=0;z<this.tradeTermsList.length;z++){
              let z_item=this.tradeTermsList[z];
              if(item.tradeTerms==z_item.index){
                item.tradeTermsName=z_item.name;
              }
            }
            // item.paymentMethodJoin=item.paymentMethodName+item.downPaymentOrPeriod
            // item.currencyName = item.currency ? this.currencyTypeHandle(item.currency) : '';
            
//           if(this.orderStatus==1){
//         	    item.actions = {
//                hasEdit: true,
//                hasSubmit: true,
//                hasDelete: true
//              };
//	           }else if(this.orderStatus==2||item.orderStatus == 3){
//	           	  item.actions = {
//	                  hasCheck: true
//	              };
//	           }else{
//	           	 item.actions = {};
//	           }
//	          item.isReserveNoCustom = (item.prTypeName!='日常备货'? true : false);
//           if (item.isReserveNoCustom) {
//             item.isHideFew = true;
//           }

            for (let j = 0; j < item.poiList.length; j++) {
              let data = item.poiList[j];
              // data.remarkZ = 'null织标数量:"1"';
              data.requiredQuantityPerPackage = data.requiredQuantityPerPackage ? data.requiredQuantityPerPackage : 1;  // 请求规格默认设置为1
              data.offeredDate = data.offeredDate ? data.offeredDate : data.requiredDate;
              data.offeredPackages = data.offeredPackages ? data.offeredPackages : data.requiredPackages; // 包
              data.offeredQuantityPerPackage = data.offeredQuantityPerPackage ? data.offeredQuantityPerPackage : data.requiredQuantityPerPackage;  // 规格
              data.offeredQuantity = data.offeredQuantity ? data.offeredQuantity : data.requiredQuantity;  // 米
              item.supplierShortName = item.poiList[0].supplierShortName ? item.poiList[0].supplierShortName : item.supplierShortName;  // 供应商简称
              // 系统折扣=采购价格/价单价格
              if (!parseFloat(data.offeredPrice) || !parseFloat(data.priceListPrice)) {
                data.systemDiscount = '100%';
              } else {
                data.systemDiscount = parseFloat((parseFloat(data.offeredPrice) / parseFloat(data.priceListPrice) * 100).toFixed(2)) + '%';
              }
              if (data.mobileGoods !== null) {
                data.mobileGoods == false ? data.mobileGoods = '否' : data.mobileGoods = '是';
              }
              if (data.belongToEv !== null) {
                data.belongToEv == false ? data.belongToEv = '否' : data.belongToEv = '是';
              }
              // if (data.remark && data.remark.indexOf('织标数量') !== -1) {
              //   if (data.remark.match(reg)) {
              //     data.scabalWovenLabel = Number(data.remark.match(reg)[1]);
              //   } else {
              //     data.scabalWovenLabel = data.remark.split(':')[1];
              //   }
              // } else {
              //   data.scabalWovenLabel = '';
              // }

             //织标数量截取备注中的织标数量
             if (data.remark && data.remark.indexOf('织标数量') !== -1) {
                var str=data.remark;
                var index=str.lastIndexOf("织标数量:");
                data.scabalWovenLabel=str.substring(index+5,str.length);
              }else{
                data.scabalWovenLabel = '';
              }
              data.scabalSaleSeason=data.materialFactorySeason;
              // 去除关联PR编号首尾空格
              data.prCode = data.prCode ? trimStr(data.prCode) : '';
              //data.purchaseRemark = '';
              // data.scabalSaleSeason = '';
              // data.scabalWovenLabel = data.remarkZ.match(reg) ? Number(data.remarkZ.match(reg)[1]) : '';
              this.updateEditModeSet('edit', data);
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
    async getSearchOrderList(id) {
      await searchPurchaseOrderList(id).then(res => {
        // console.log('当前操作订单：', res);
        if (res.code === '0') {
          res.data.isShowList = true;
          res.data.createTime = timeFormat(res.data.createTime);
          this.editOrderData = res.data;
          cosole.log(res.data);
          this.editOrderData.poiList.forEach(item => {
            // console.log('工厂交期数据：', item.offeredDate);
            if (item.offeredDate) {
              item.offeredDate = timeFormatGMT(item.offeredDate);
            } else {
              item.offeredDate = '';
            }
          });
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
    },
    getSupplierDictList() {
      // 供应商列表
      supplierDictList().then(res => {
        // console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
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
    getPaymentMethodList() {
      // 付款方式列表
      dictList('paymentMethod').then(res => {
        console.log('付款方式列表：', res);
        this.paymentMethodList = res.data;
        this.paymentMethodListClone = res.data;
      });
    },
    getPeriodList() {
      // 账期列表
      dictList('period').then(res => {
        // console.log('账期列表：', res);
        this.periodList = res.data;
      });
    },
    getDownPaymentList() {
      // 预付列表
      dictList('downPayment').then(res => {
        // console.log('预付列表：', res);
        this.downPaymentList = res.data;
      });
    },
    getSaleSeasonList() {
      // 工厂季列表
      constDictList('SaleSeasou').then(res => {
        // console.log('工厂季列表：', res);
        if (res.code === '0') {
          this.saleSeasonList = res.data;
        }
      });
    },
    getPriceOrderList(supplier, currency, season) {
      // 采购价单列表
      let supplierId = null;
      if (!supplier) {
        let supplierData = this.supplierList.find(item => {
          return item.supplierName == this.editOrderData.supplierName;
        });
        supplierId = supplierData ? supplierData.supplierId : '';
      } else {
        supplierId = supplier;
      }
      let currencyCode = currency ? currency : this.editOrderData.currency;
      // let factorySeason = season ? season : this.editOrderData.factorySeason;
      let factorySeason = '';
      getPriceOrderList(supplierId, currencyCode ? currencyCode : '', factorySeason ? factorySeason : '').then(res => {
        // console.log('采购价单列表：', res);
        if (res.code === '0') {
          this.priceOrderList = res.data;
        }
      });
    },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
      let inputSet = JSON.parse(JSON.stringify(this.inputSet));
      let datePickerSet = JSON.parse(JSON.stringify(this.datePickerSet));
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
      editModeSet.datePickerSet = datePickerSet;
      editModeSet.unitSet = unitSet;
      data.editModeSet = editModeSet;
    },
    numberInputChange(val, item, fieldItem) {
      switch (fieldItem.field) {
        case 'offeredQuantity':
          // 采购数量
          console.log('采购数量值改变：', val, item, fieldItem);
          // this.priceResetHandle(val, item);
          this.priceListHandle(this.editOrderData);
          break;
      
        default:
          break;
      }
    },
    unitNumberInputChange(val, item, fieldItem, step) {
      let field = '';
      if (step == 'first') {
        field = fieldItem.field_1;
      } else if (step == 'second') {
        field = fieldItem.field_2;
      }
      switch (field) {
        case 'offeredPackages':
          // 采购数量包数
          console.log('采购数量包数值改变：', val, item, fieldItem, step);
          item.offeredQuantity = val * item.offeredQuantityPerPackage;
          this.priceListHandle(this.editOrderData);
          this.$forceUpdate();
          break;
        case 'offeredQuantityPerPackage':
          // 采购数量规格
          console.log('采购数量规格值改变：', val, item, fieldItem, step);
          item.offeredQuantity = item.offeredPackages * val;
          this.priceListHandle(this.editOrderData);
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },
    inputBlur(event, item, fieldItem) {
      let val = event.target.value;
      switch (fieldItem.field) {
        case 'offeredPrice':
          // 采购价格
          console.log('采购价格值失焦：', event, item, fieldItem);
          let priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
          if (!priceReg.test(item.offeredPrice)) {
            this.$message({
              type: 'error',
              message: '采购价格仅支持最多保留两位小数数字格式！'
            });
            return false;
          }
          let defaultCount = 0;
          let offeredPrice = item.offeredPrice ? (parseFloat(item.offeredPrice)).toFixed(2) : defaultCount.toFixed(2);
          let priceListPrice = item.priceListPrice ? (parseFloat(item.priceListPrice)).toFixed(2) : defaultCount.toFixed(2);
          if (!parseFloat(priceListPrice) || !parseFloat(offeredPrice)) {
            item.systemDiscount = '100%';
          } else {
            item.systemDiscount = parseFloat((parseFloat(item.offeredPrice) / parseFloat(item.priceListPrice) * 100).toFixed(2)) + '%';
          }
          this.$forceUpdate();
          break;
      
        default:
          break;
      }
    },
    // unitNumberInputBlur(event, item, fieldItem, step) {
    //   let val = event.target.value;
    //   let field = '';
    //   if (step == 'frist') {
    //     field = fieldItem.field_1;
    //   } else if (step == 'second') {
    //     field = fieldItem.field_2;
    //   }
    //   switch (field) {
    //     case 'offeredPackages':
    //       // 采购数量包数
    //       console.log('采购数量包数值失焦：', event, item, fieldItem, step);
    //       // this.priceResetHandle(val, item);
    //       this.priceListHandle(item);
    //       break;
    //     case 'offeredQuantityPerPackage':
    //       // 采购数量规格
    //       console.log('采购数量规格值失焦：', event, item, fieldItem, step);
    //       // this.priceResetHandle(val, item);
    //       this.priceListHandle(item);
    //       break;
      
    //     default:
    //       break;
    //   }
    // },

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}

.purchaseOrder {
  .isremark{
    padding-bottom:10px;
  }
  .table_part {
    position: relative;
    // .childlist {
    //   width: 100%;
    // }
    .allparentlist {
      width: 100%;
    }
    ul {
      &.childcontentlist {
        height: 60px;
        li {
          line-height: 40px;
        }
      }
    }
    .submit_btn {
      position: absolute;
      top: -60px;
      right: 0;
    }
    .meters {
      width: 150px;
      height: 32px;
      line-height: 32px;
      text-align: left;
      vertical-align: top;
      .count {
        max-width: 130px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .edit_part {
    .label {
      font-size: 14px;
      color: #303133;
    }
  }
  .edit_parent_list {
    ul {
      &.childcontentlist {
        border-bottom: none;
      }
      li {
        line-height: 30px;
      }
    }
    .edit_btn_wrap{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
}

</style>
<style>
/* .subnav_wrap .el-tabs__item {
  height: 40px!important;
  line-height:40px!important;
  font-size:14px!important;
  vertical-align:baseline !important;
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
} */
.purchaseOrder .el-checkbox__label {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.purchaseOrder .table_part .el-checkbox__input {
  vertical-align: middle;
}
.purchaseOrder .table_part .el-checkbox__label {
  vertical-align: middle;
}
.purchaseOrder .table_part .el-tabs .el-tab-pane {
  min-height: 536px;
}
.purchaseOrder .isThrough{
  text-decoration:line-through;
}
</style>