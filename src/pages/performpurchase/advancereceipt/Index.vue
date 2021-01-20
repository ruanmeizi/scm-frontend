<template>
  <div class="container advancereceipt">
    <div class="part" v-if="!isShowEdit">
      <div class="actions_part clearfix">
      	<div class="actions_wrap">
          <div v-if="activeName === 'Requisition'">
            <div class="display_ib mr10 mb10">
              <span class="tag">物料编号：</span>
              <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
            </div>
            <div class="display_ib mr10 mb10">
              <span class="tag">调拨单编号：</span>
              <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="请输入"></el-input>
            </div>
          </div>
          <div class="display_ib" v-else>
            <div class="display_ib mr10 mb10">
              <span class="tag">供应商：</span>
              <el-select
                class="select_single w200 mr10"
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
              <span class="tag">调拨单编号：</span>
              <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="请输入"></el-input>
            </div>
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
          <el-button
            v-if="activeName === 'Requisition'"
            size="small"
            type="primary"
            icon="el-icon-download"
            circle
            title="下载"
            @click="downloadHandle"
          ></el-button>
          <el-button v-if="activeName === 'Requisition'" class="create_btn" type="primary" @click="createAdvanceReceipt">创建预收货清单</el-button>
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
            <!-- 调拨单 -->
            <div v-if="item.value == 'Requisition'">
              <ul class="childlist">
                <li :class="item.class" v-for="(item, index) in requisitionFieldList" :key="index">{{item.name}}</li>
              </ul>
              <div class="allparentlist" v-for="(item, index) in requisitionList" :key="index">
                <ul class="parentlist" @click="showChildList(index, item)">
                  <li class="w12p" :title="item.createTime">
                    <el-checkbox
                      v-model="checkAllList"
                      :label="item.uuid"
                      :key="item.id"
                      :disabled="item.isCheckDisabled"
                      @change="checkAllChange($event, item)">
                      <span>{{item.createTime}}</span>
                    </el-checkbox>
                  </li>
                  <li class="w8p" :title="'申请人:' + (item.applicantName ? item.applicantName : '')">
                    <i>
                      申请人:
                      <em>{{item.applicantName}}</em>
                    </i>
                  </li>
                  <li class="w10p" :title="'调拨编号:' + (item.factoryAllocationCode ? item.factoryAllocationCode : '')">
                    <i>
                      调拨编号:
                      <em>{{item.factoryAllocationCode}}</em>
                    </i>
                  </li>
                  <li class="w10p" :title="'调拨类型:' + (item.allocationTypeName ? item.allocationTypeName : '')">
                    <i>
                      调拨类型:
                      <em>{{item.allocationTypeName}}</em>
                    </i>
                  </li>
                  <li v-if="item.allocationTypeNameTag == '客订'" class="w10p" :title="'销售订单编号:' + (item.saleOrderId ? item.saleOrderId : '')">
                    <i>
                      销售订单编号:
                      <em>{{item.saleOrderId}}</em>
                    </i>
                  </li>
                  <li v-if="item.allocationTypeNameTag == '客订'" class="w8p" :title="'客户名称:' + (item.customerName ? item.customerName : '')">
                    <i>
                      客户名称:
                      <em>{{item.customerName}}</em>
                    </i>
                  </li>
                  <li class="w8p" :title="'供应商:' + (item.supplierName ? item.supplierName : '')">
                    <i>
                      供应商:
                      <em>{{item.supplierName}}</em>
                    </i>
                  </li>
                  <li class="fr mr15" @click.stop="showChildList(index, item)">
                    <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                    <i v-else class="el-icon-caret-bottom"></i>
                  </li>
                </ul>
                <el-checkbox-group v-model="checkList" @change="checkOptionChange($event, item.uuid)">
                  <ul
                    class="childcontentlist"
                    v-for="(childItem, index) in item.faItemList"
                    :key="index"
                    v-show="item.isShowList">
                    <li class="w11p t_left" :title="childItem.materialCode ? childItem.materialCode : ''">
                      <el-checkbox
                        :label="childItem.id"
                        :key="childItem.id"
                        :disabled="childItem.isReceived === true"
                        >{{childItem.materialCode ? childItem.materialCode : ''}}</el-checkbox>
                    </li>
                    <!-- <li class="w9p" :title="childItem.materialId">{{childItem.materialId ? childItem.materialId : ''}}</li> -->
                    <li class="w11p" :title="childItem.confirmNumbers">{{childItem.confirmNumbers ? childItem.confirmNumbers : ''}}</li>
                    <li class="w12p" >
                    	<!--{{childItem.purchaseMeasurementUnit}}-->
                    	<div id="" v-if="childItem.purchaseMeasurementUnit=='米'" :title="(childItem.allocationPackages ? childItem.allocationPackages : '0') + '包 ' + (childItem.allocationQuantityPerPackage ? childItem.allocationQuantityPerPackage : '0') + '米/包 ' + (childItem.allocationQuantity ? childItem.allocationQuantity : '0') + '米'">
                    		  {{(childItem.allocationPackages ? childItem.allocationPackages : '0') + '包 '}}
		                    	{{(childItem.allocationQuantityPerPackage ? childItem.allocationQuantityPerPackage : '0') + '米/包 '}}
		                    	{{(childItem.allocationQuantity ? childItem.allocationQuantity : '0') + '米'}}
                    	</div>
                    	<div v-else :title="(childItem.allocationQuantity ? childItem.allocationQuantity : '0') + childItem.purchaseMeasurementUnit">
                    		 <span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">{{(childItem.allocationQuantity ? childItem.allocationQuantity : '0') +  childItem.purchaseMeasurementUnit}}</span>
                    	   <span v-else>{{(childItem.allocationQuantity ? childItem.allocationQuantity : '0') + '条'}}</span>
                    	</div>
                    </li>
                    <li class="w9p">
                    	<div :title="(childItem.realQuantity ? childItem.realQuantity : '0') + '米'" v-if="childItem.purchaseMeasurementUnit=='米'">
                    		{{(childItem.realQuantity ? childItem.realQuantity : '0') + '米'}}
                    	</div>
                      <div v-else>
                      	<span :title="(childItem.realQuantity ? childItem.realQuantity : '0') + childItem.purchaseMeasurementUnit" v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">{{(childItem.realQuantity ? childItem.realQuantity : '0') +childItem.purchaseMeasurementUnit}}</span>
                      	<span :title="(childItem.realQuantity ? childItem.realQuantity : '0') + '条'" v-else>{{(childItem.realQuantity ? childItem.realQuantity : '0') + '条'}}</span>
                      </div>
                    </li>
                    <li class="w9p" :title="childItem.receivedQuantity ? childItem.receivedQuantity : ''">
                    	<div v-if="childItem.purchaseMeasurementUnit=='米'">
                    		{{childItem.receivedQuantity ? childItem.receivedQuantity : '0'}}{{childItem.purchaseMeasurementUnit}}
                    	</div>
                    	<div v-else>
                    		{{childItem.receivedQuantity ? childItem.receivedQuantity : '0'}}
                    		<span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''">{{childItem.purchaseMeasurementUnit}}</span>
                    		<span v-else>条</span>
                    	</div>
                    </li>
                  </ul>
                </el-checkbox-group>
              </div>
              <p v-if="!requisitionList.length && !tableLoading" class="empty_tip">暂无数据</p>
            </div>
            
            <div v-else>
              <ul class="childlist">
                <li :class="item.class" v-for="(item, index) in generatedFieldList" :key="index">{{item.name}}</li>
              </ul>
              <div class="allparentlist" v-for="(item, index) in receiptList" :key="index">
                <ul class="parentlist" @click="showChildList(index, item)">
                  <li class="w10p" :title="item.createTime">
                    <span>{{item.createTime}}</span>
                  </li>
                  <li class="w8p" :title="'申请人:' + (item.applicantName ? item.applicantName : '')">
                    <i>
                      申请人:
                      <em>{{item.applicantName}}</em>
                    </i>
                  </li>
                  <li class="w10p" :title="'预收货清单编号:' + (item.prepareReceiptCode ? item.prepareReceiptCode : '')">
                    <i>
                      预收货清单编号:
                      <em>{{item.prepareReceiptCode}}</em>
                    </i>
                  </li>
                  <li class="w10p" :title="'供应商:' + (item.supplierName ? item.supplierName : '')">
                    <i>
                      供应商:
                      <em>{{item.supplierName}}</em>
                    </i>
                  </li>
                  <!-- <li class="w10p" :title="'已上传发票数量:' + (item.factoryInvoiceNum ? item.factoryInvoiceNum : '')">
                    <i>
                      已上传发票数量:
                      <em>{{item.factoryInvoiceNum}}</em>
                    </i>
                  </li> -->
                  <li class="w10p" :title="'已上传箱单数量:' + (item.packingListQuantity ? item.packingListQuantity : '')">
                    <i>
                      已上传箱单数量:
                      <em>{{item.packingListQuantity}}</em>
                    </i>
                  </li>
                  <li class="w8p" :title="'工厂发票号:' + (item.factoryInvoice ? item.factoryInvoice : '')">
                    <i>
                      工厂发票号:
                      <em>{{item.factoryInvoice}}</em>
                    </i>
                  </li>
                  <li class="w8p" :title="'币种:' + (item.currencyName ? item.currencyName : '')">
                    <i>
                      币种:
                      <em>{{item.currencyName}}</em>
                    </i>
                  </li>
                  <li>
                    <el-popover
                      placement="right"
                      width="300"
                      trigger="hover"
                      @show="checkApprovalProcess(item)">
                      <div>
                        <i class="display_b">
                          审批人:
                          <em>{{item.fullName}}</em>
                        </i>
                        <i class="display_b mt10 mb10">
                          审批时间:
                          <em>{{item.approvalTime}}</em>
                        </i>
                        <i class="display_b">
                          审批意见:
                          <em>{{item.content}}</em>
                        </i>
                      </div>
                      <button slot="reference" style="border: 0; border-bottom: 1px solid #409eff; color: #606266; cursor: pointer;">审批:{{actionsTypeHandle(item.auditStatus)}}</button>
                    </el-popover>
                  </li>
                  <li class="fr mr15" @click.stop="showChildList(index, item)">
                    <i v-if="item.isShowList" class="el-icon-caret-top"></i>
                    <i v-else class="el-icon-caret-bottom"></i>
                  </li>
                  <li class="fr" v-if="item.auditStatus == 'Draft' || item.auditStatus == 'Rejected'">
                    <i type="primary" class="el-icon-edit" title="修改" @click.stop="editHandle(index, item)"></i>
                    <i type="primary" class="el-icon-thumb" title="提交审批" @click.stop="submitHandle(index, item)"></i>
                    <i type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandle(index, item)"></i>
                  </li>
                  <li class="fr" v-if="item.auditStatus == 'Terminated'">
                    <i type="primary" class="el-icon-delete" title="删除" @click.stop="deleteHandle(index, item)"></i>
                  </li>
                </ul>
                <ul
                  class="childcontentlist"
                  v-for="(childItem, i) in item.preItemList"
                  :key="i"
                  v-show="item.isShowList">
                  <li class="w5p" :title="childItem.materialCode">{{childItem.materialCode ? childItem.materialCode : ''}}</li>
                  <!-- <li class="w5p" :title="childItem.materialId">{{childItem.materialId ? childItem.materialId : ''}}</li> -->
                  <li class="w5p" :title="childItem.factoryAllocationCode">{{childItem.factoryAllocationCode ? childItem.factoryAllocationCode : ''}}</li>
                  <li class="w10p" :title="childItem.confirmingCode">{{childItem.confirmingCode ? childItem.confirmingCode : ''}}</li>
                  <li class="w10p" :title="childItem.batchNumber">{{childItem.batchNumber ? childItem.batchNumber : ''}}</li>
                  <li class="w15p">
                  	<span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''" :title="(childItem.batchMeter ? childItem.batchMeter : '0') +childItem.purchaseMeasurementUnit">{{(childItem.batchMeter ? childItem.batchMeter : '0') + childItem.purchaseMeasurementUnit}}</span>
                    <span v-else :title="(childItem.batchMeter ? childItem.batchMeter : '0') + '条'">{{(childItem.batchMeter ? childItem.batchMeter : '0') + '条'}}</span>
                  </li>
                  <li class="w15p">
                  	<span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''" :title="(childItem.transferMeter ? childItem.transferMeter : '0') +childItem.purchaseMeasurementUnit">{{(childItem.transferMeter ? childItem.transferMeter : '0') + childItem.purchaseMeasurementUnit}}</span>
                  	<span v-else :title="(childItem.transferMeter ? childItem.transferMeter : '0') + '条'">{{(childItem.transferMeter ? childItem.transferMeter : '0') + '条'}}</span>
                  </li>
                  <li class="w5p" :title="childItem.money">{{childItem.money ? childItem.money : ''}}</li>
                  <li class="w5p" >
                  	<span v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''" :title="childItem.realityNumber ? childItem.realityNumber + childItem.purchaseMeasurementUnit : ''">{{childItem.realityNumber ? childItem.realityNumber +childItem.purchaseMeasurementUnit : ''}}</span>
                    <span v-else :title="childItem.realityNumber ? childItem.realityNumber + '条' : ''">
                    	{{childItem.realityNumber ? childItem.realityNumber + '条' : ''}}
                    </span>
                  </li>
                  <li class="w10p" :title="childItem.saleOrderId">{{childItem.saleOrderId ? childItem.saleOrderId : ''}}</li>
                  <li class="w10p" :title="childItem.updateTime">{{childItem.updateTime ? childItem.updateTime : ''}}</li>
                  <li class="w5p">
                    <i type="primary" class="el-icon-document" title="查看" @click="checkChildHandle(i, childItem)"></i>
                    <!-- <i type="primary" class="el-icon-document" title="查看" @click="checkChildHandle(i, childItem)"></i> -->
                  </li>
                </ul>
              </div>
              <p v-if="!receiptList.length && !tableLoading" class="empty_tip">暂无数据</p>
            </div>
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
            :total="this.total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑页 -->
    <div v-else>
      <div v-show="!isExcelMode">
        <div class="upload_wrap mb30">
          <div class="display_ib v_top" style="margin-right: 20px;">
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
              :file-list="uploadPackingList"
              :data="{uuid: editReceiptList.uuid, type: '1'}"
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
          <!-- Excel按钮 -->
          <!-- <el-button class="ml10 fr" type="primary" @click="switchEditMode">Excel模式</el-button> -->
          <!-- Excel按钮 end -->
        </div>
        <div class="clearfix mb10">
          <div class="display_ib mr20">
            <span style="font-size: 14px; color: #303133;">供应商：{{editReceiptList.supplierName ? editReceiptList.supplierName : ''}}</span>
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
            <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>到期日期：</span>
            <!-- <el-input class="input_single w200 mr10 mb10" v-model.trim="editReceiptList.paymentTerms" placeholder=""></el-input> -->
            <el-date-picker
              class="w200"
              size="middle"
              value-format="yyyy-MM-dd"
              v-model="editReceiptList.paymentTerms"
              @change="paymentTermsChange"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="display_ib mr20">
            <span style="font-size: 14px; color: #303133;"><span class="red mr5">*</span>贸易条款：</span>
            <el-select class="select_single w200 mr10 mb10"
              v-model="editReceiptList.tradeTerms"
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
        <div class="edit_wrap hidden">
          <!-- 编辑组件 -->
          <editTable
            :tableList="editReceiptList.receiptListItemLists"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="editFieldsList"
            @deleteHandle="deleteEditItemHandle"
            @inputBlur="inputBlur"
            @datePickerChange="datePickerChange"
            @numberInputChange="numberInputChange"
            @unitNumberInputChange="unitNumberInputChange"
            @numberInputBlur="numberInputBlur"
            @unitNumberInputBlur="unitNumberInputBlur">
          </editTable>

          <div class="edit_btn_wrap mt10 fr">
            <el-button @click="cancelEditHandle">取消</el-button>
            <el-button type="primary" :disabled="isSaveDisabled" @click="saveEditHandle">保存</el-button>
            <el-button type="primary" :disabled="isSubmitDisabled" @click="submitEditHandle">提交审批</el-button>
          </div>

        </div>
      </div>
    </div>

    <div v-show="isExcelMode" class="clearfix mt20 mb10">
      <el-button class="fr" type="primary" @click="switchFormMode">表单模式</el-button>
    </div>
    <Excel v-show="isExcelMode" @spread="getSpread"></Excel>

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
            <span class="mr15">调拨数量：
            	<div id="" class="inline_block" v-if="materialFullData.purchaseMeasurementUnit=='米'">
            		{{(materialFullData.transferBagQuantity ? materialFullData.transferBagQuantity : '0') + '包 '}}
	            	{{(materialFullData.packSpecification ? materialFullData.packSpecification : '0') + '米/包 '}}
	            	{{(materialFullData.transferMeter ? materialFullData.transferMeter : '0') + '米'}}
            	</div>
            	<div v-else class="inline_block">
            		<span v-if="materialFullData.purchaseMeasurementUnit!=null&&materialFullData.purchaseMeasurementUnit!=''">{{(materialFullData.transferMeter ? materialFullData.transferMeter : '0') + materialFullData.purchaseMeasurementUnit}}</span>
            		<span v-else>{{(materialFullData.transferMeter ? materialFullData.transferMeter : '0') + '条'}}</span>
            	</div>
            </span>
            <span class="mr15">批次发货数量：
            	<div class="inline_block" v-if="materialFullData.purchaseMeasurementUnit=='米'">
            		{{(materialFullData.batchQuantity ? materialFullData.batchQuantity : '0') + '包 '}}
	            	{{(materialFullData.packSpecification ? materialFullData.packSpecification : '0') + '米/包 '}}
	            	{{(materialFullData.batchMeter ? materialFullData.batchMeter : '0') + '米'}}
            	</div>
            	<div v-else class="inline_block">
            		<span v-if="materialFullData.purchaseMeasurementUnit!=null&&materialFullData.purchaseMeasurementUnit!=''">{{(materialFullData.batchMeter ? materialFullData.batchMeter : '0') +materialFullData.purchaseMeasurementUnit}}</span>
            		<span v-else>{{(materialFullData.batchMeter ? materialFullData.batchMeter : '0') + '条'}}</span>
            	</div>
            </span>
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
              	<div v-if="item.purchaseMeasurementUnit=='米'" :title="item.realityNumber ? item.realityNumber + '米' : ''">{{item.realityNumber ? item.realityNumber + '米' : ''}}</div>
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
              v-for="(item, index) in exportCheckList"
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
import { advanceReceiptList, editAdvanceReceipt, submitPrepareReceipt, batchNumberFallInfo, batchNumberList, searchRequisitionItem, deleteUploadFile, searchUploadFiles, updatePackingQuantity, deletePurchaseOrder, modifyPurchaseOrder, submitModifyPurchaseOrder, requisitionList, prepareReceiptList, purchasegetuuid, addRequisitionList, supplierDictList, deletePrepareReceipt, editPrepareReceipt, approvalProcessInfo, constDictList, exportExcel , factoryInvoice} from "@/api/module/purchaseApi.js";
// import { advanceReceiptList, editAdvanceReceipt, submitPrepareReceipt, batchNumberFallInfo, batchNumberList, searchRequisitionItem, deleteUploadFile, searchUploadFiles, updatePackingQuantity } from "@/api/module/purchaseApi.js";
import { getUUID } from "@/api/module/publicApi.js";
import { timeFormat } from '@/utils/index.js';
import { currencyTypeHandle } from '@/utils/public.js';
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "advanceReceipt",
  props: [],
  data() {
    return {
      // Excel编辑模式
      isExcelMode: false,
      excelSpread: null,
      excelIo: {},
      spread: {},
      spreadNS: null,
      sheet: null,
      spreadStyle: {
        width: "100%",
        height: "600px"
      },

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
      auditStatus: '',
      materialCode: '',
      isShowEdit: false,
      editReceiptList: {},
      curUuid: '',
      requisitionFieldList: [
        {
          name: '物料编号',
          class: 'w11p'
        },
        // {
        //   name: '物料系统编号',
        //   class: 'w9p'
        // },
        // {
        //   name: '供应商',
        //   class: 'w11p'
        // },
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
          name: '物料编号',
          class: 'w5p'
        },
        // {
        //   name: '物料系统编号',
        //   class: 'w5p'
        // },
        {
          name: '调拨单号',
          class: 'w5p'
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
          class: 'w15p'
        },
        {
          name: '调拨数量',
          class: 'w15p'
        },
        {
          name: '发票金额',
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
          name: '发票金额',
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
      popupFieldNameList: [
        {
          name: '物料编号',
          class: 'w10p'
        },
        // {
        //   name: '物料系统编号',
        //   class: 'w10p'
        // },
        {
          name: '供应商名称',
          class: 'w10p'
        },
        {
          name: '确认书号',
          class: 'w10p'
        },
        {
          name: '调拨数量',
          class: 'w10p'
        },
        {
          name: '调拨单号',
          class: 'w10p'
        },
        {
          name: '销售订单编号',
          class: 'w10p'
        }
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
        {
          label: '已终止',
          value: 'Terminated'
        }
      ],

      // 编辑组件数据
      editFieldsList: [
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '150'
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
          name: '批次发货数量',
          field: 'packSpecification',
          field_1: 'batchQuantity',
          field_2: 'packSpecification',
          field_3: 'packSpecification',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w15p',
          width: '200',
          isUnitSetText: true
        },
        {
          name: '* 实际发货数量',
          field: 'realityNumber',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w10p',
          width: '180'
        },
        {
          name: '* 发票金额',
          field: 'money',
          class: 'w10p',
          width: '180'
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
      tailFieldsList: [],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        materialCode: true,
        factoryAllocationCode: true,
        confirmingCode: true
      },
      inputSet: {
        batchNumber: true,
        money: true,
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
        batchQuantity: true // 批次发货数量 包数
      }

    };
  },
  components: {
    Excel,
    editTable
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.headers = { Authorization: `Bearer ${this.$keycloak.token}` };
    // this.getPurchaseOrderList();
    this.getRequisitionList();
    this.getPrepareReceiptList();
    this.getSupplierDictList();
    this.getTradeTermsList();
    this.getCurrencyList();
    // Excel
    this.spreadNS = GC.Spread.Sheets;
    this.spread = new this.spreadNS.Workbook(document.getElementById("excelView"), { sheetCount: 1 });
    this.spread.refresh();
    this.excelIo = new GC.Spread.Excel.IO();
    this.sheet = this.spread.getSheet(0); // 表单底部tab
    // this.initSpread(this.spread);
  },
  activated() {},
  watch: {},
  computed: {},
  methods: {
    // Excel编辑模式
    getSpread(val) {
      console.log('表格实例：', val);
      this.excelSpread = val;
    },
    switchEditMode() {
      // Excel编辑模式
      this.spread.refresh();
      this.initSpread(this.spread);
      this.isExcelMode = true;
      // this.$forceUpdate();
    },
    switchFormMode() {
      this.spread.refresh();
      // this.excelSpread.refresh();
      this.runExcelHandle();
      this.isExcelMode = false;
    },
    initSpread(spread) {
      spread.suspendPaint();
      var products = this.getProducts(100);
      var sheet = spread.getSheet(0);
      // let combo = new this.spreadNS.CellTypes.ComboBox();
      // combo.items(this.changeObjKey(list)).editorValueType(this.spreadNS.CellTypes.EditorValueType.value);
      sheet.autoGenerateColumns = false;
      sheet.setDataSource(products);
      var colInfos = [
        { name: "materialCode", displayName: "物料编号", size: 120 },
        { name: "factoryAllocationCode", displayName: "调拨单号", size: 120 },
        { name: "confirmingCode", displayName: "确认书号", size: 120 },
        { name: "batchNumber", displayName: "* 工厂批次号", size: 120 },
        { name: "batchQuantity", displayName: "批次发货数量包数", size: 120 },
        { name: "packSpecification", displayName: "批次发货数量规格", size: 120 },
        { name: "packSpecification", displayName: "批次发货数量米数（条数）", size: 120 },
        { name: "realityNumber", displayName: "* 实际发货数量", size: 120 },
        { name: "money", displayName: "* 发票金额", size: 120 },
        { name: "saleOrderId", displayName: "销售订单编号", size: 120 },
      ];
      sheet.bindColumns(colInfos);
      spread.resumePaint();
    },
    Product(data) {
      console.log(data);
      if (data) {
        this.uuid = data.uuid ? data.uuid : "";
        this.id = data.id ? data.id : "";
        this.balancePaymentStatus = data.balancePaymentStatus ? data.balancePaymentStatus : "";
        this.batchNumber = data.batchNumber ? data.batchNumber : "";
        this.batchQuantity = data.batchQuantity ? data.batchQuantity : "";
        this.confirmingCode = data.confirmingCode ? data.confirmingCode : "";
        this.createTime = data.createTime ? data.createTime : "";
        this.deleteStatus = data.deleteStatus ? data.deleteStatus : "";
        this.deliveryType = data.deliveryType ? data.deliveryType : "";
        this.factoryAllocationCode = data.factoryAllocationCode ? data.factoryAllocationCode : "";
        this.factoryAllocationItemUuid = data.factoryAllocationItemUuid ? data.factoryAllocationItemUuid : "";
        this.factoryInvoice = data.factoryInvoice ? data.factoryInvoice : "";
        this.inventory = data.inventory ? data.inventory : "";
        this.lineNum = data.lineNum ? data.lineNum : "";
        this.materialCode = data.materialCode ? data.materialCode : "";
        this.materialId = data.materialId ? data.materialId : "";
        this.materialName = data.materialName ? data.materialName : "";
        this.money = data.money ? data.money : "";
        this.packSpecification = data.packSpecification ? data.packSpecification : "";
        this.preItemUuid = data.preItemUuid ? data.preItemUuid : "";
        this.prepareReceiptCode = data.prepareReceiptCode ? data.prepareReceiptCode : "";
        this.productCode = data.productCode ? data.productCode : "";
        this.productId = data.productId ? data.productId : "";
        this.productName = data.productName ? data.productName : "";
        this.purchaseMeasurementUnit = data.purchaseMeasurementUnit ? data.purchaseMeasurementUnit : "";
        this.purchaseType = data.purchaseType ? data.purchaseType : "";
        this.realityNumber = data.realityNumber ? data.realityNumber : "";
        this.rev = data.rev ? data.rev : "";
        this.saleOrderId = data.saleOrderId ? data.saleOrderId : "";
        this.subInventory = data.subInventory ? data.subInventory : "";
        this.supplierCode = data.supplierCode ? data.supplierCode : "";
        this.supplierName = data.supplierName ? data.supplierName : "";
        this.transferBagQuantity = data.transferBagQuantity ? data.transferBagQuantity : "";
        this.transferMeter = data.transferMeter ? data.transferMeter : "";
        this.updateTime = data.updateTime ? data.updateTime : "";
        this.weightPerMeter = data.weightPerMeter ? data.weightPerMeter : "";
      }
    },
    getProducts(count) {
      var dataList = [];
      if (this.editReceiptList.receiptListItemLists) {
        for (var i = 0; i < count; i++) {
          if (i + 1 <= this.editReceiptList.receiptListItemLists.length) {
            dataList[i] = new this.Product(this.editReceiptList.receiptListItemLists[i]);
          } else {
            dataList[i] = new this.Product();
          }
        }
      }
      return dataList;
    },
    runExcelHandle() {
      // Excel保存/提交审核
      let list = JSON.parse(JSON.stringify(this.sheet.getDataSource()));
      console.log('Excel数据：', list);
      if (list.length) {
        this.ifchildshow = true;
      }
      list = list.filter(item => Object.keys(item).length != 0);
      list.forEach(item => {
        if (!item.uuid) {
          purchasegetuuid().then(res => {
            if (res.code === "0") {
              item.uuid = res.data;
            }
          });
        }
        // if (item.requiredPackages && item.requiredQuantityPerPackage && item.requiredQuantity) {
        //   item.purchaseMeasurementUnit = '米';
        // } else {
        //   item.purchaseMeasurementUnit = '';
        // }
        // if (item.requiredDate && item.requiredDate.indexOf('-') == -1) {
        //   let date = item.requiredDate.replace(/[^0-9]/ig, '');
        //   item.requiredDate = oaDateToDateTime(date);
        // }
        // if (!isCheckDate(item.requiredDate)) {
        //   item.requiredDate = '';
        // }
      });
      this.editReceiptList.receiptListItemLists = list;
      this.$forceUpdate();
      this.isExcelMode = false;
      console.log(this.editReceiptList.receiptListItemLists);
    },
    changeObjKey(list) {
      let keyList = ['value', 'text'];
      let resList = list.map((item, index, arr) => {
        let obj = {};
        let count = 0;
        for (let i in item) {
          obj[keyList[count]] = item[i];
          count++;
        }
        return obj;
      });
      return resList;
    },
    // Excel编辑模式 end

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
    cancelEditHandle() {
      this.isShowEdit = false;
    },
    saveEditHandle() {
      console.log('保存数据：', this.editReceiptList);
      let list = this.editReceiptList.receiptListItemLists;
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
      if (!this.verificationHandle(this.editReceiptList.factoryInvoice, '工厂发票号', 64)) {
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
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
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
        // if (!data.confirmingCode) {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入确认书号！'
        //   });
        //   return false;
        // }
        if (data.batchNumber == '' || data.batchNumber == null) {
          this.$message({
            type: 'error',
            message: '请输入工厂批次号！'
          });
          return false;
        }
        if (!this.verificationHandle(data.batchNumber, '工厂批次号', 200)) {
          return false;
        }
        if (data.realityNumber === '' || data.realityNumber === null) {
          this.$message({
            type: 'error',
            message: '请输入实际发货数量！'
          });
          return false;
        }
        // if (!parseFloat(data.realityNumber) || parseFloat(data.realityNumber) < 0) {
        //   this.$message({
        //     type: 'error',
        //     message: '实际发货数量不能为空，应为大于0的正整数！'
        //   });
        //   return false;
        // }
        if (!this.verificationHandle(data.realityNumber, '实际发货数量', 10)) {
          return false;
        }
        if (data.money === '' || data.money === null) {
          this.$message({
            type: 'error',
            message: '请输入发票金额！'
          });
          return false;
        }
        if (isNaN(parseFloat(data.money))) {
          this.$message({
            type: 'error',
            message: '发票金额格式错误！'
          });
          return false;
        }
        if (!this.verificationHandle(data.money, '发票金额', 8)) {
          return false;
        }
        // if (!data.saleOrderId) {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入销售订单编号！'
        //   });
        //   return false;
        // }
      }
      this.editReceiptList.packingListId = this.packingList ? this.packingList.join(',') : '';
      this.editReceiptList.factoryInvoiceId = this.factoryInvoice ? this.factoryInvoice.join(',') : '';
      this.editReceiptList.applicant = this.$store.state.userName;
      this.editReceiptList.applicantName = this.$store.state.realName;
      this.editReceiptList.applicantDepartment = this.$store.state.currentDepartment.id;
      this.editReceiptList.applicantDepartmentName = this.$store.state.currentDepartment.name;
      this.editReceiptList.submitType = '1';
      this.isSaveDisabled = true;
      editAdvanceReceipt(this.editReceiptList).then(res => {
        console.log('保存数据：', res);
        if (res.code === '0') {
          this.auditStatus = '';
          this.activeName = 'All';
          this.getPrepareReceiptList();
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.isShowEdit = false;
        }
        this.isSaveDisabled = false;
      });
    },
    submitEditHandle() {
      let list = this.editReceiptList.receiptListItemLists;
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
      if (!this.verificationHandle(this.editReceiptList.factoryInvoice, '工厂发票号', 64)) {
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
      for (var i = 0; i < list.length; i++) {
        let data = list[i];
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
        // if (!data.confirmingCode) {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入确认书号！'
        //   });
        //   return false;
        // }
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
        if (data.realityNumber === '' || data.realityNumber === null) {
          this.$message({
            type: 'error',
            message: '请输入实际发货数量！'
          });
          return false;
        }
        // if (!parseFloat(data.realityNumber) || parseFloat(data.realityNumber) < 0) {
        //   this.$message({
        //     type: 'error',
        //     message: '实际发货数量不能为空，应为大于0的正整数！'
        //   });
        //   return false;
        // }
        if (!this.verificationHandle(data.realityNumber, '实际发货数量', 10)) {
          return false;
        }
        if (data.money === '' || data.money === null) {
          this.$message({
            type: 'error',
            message: '请输入发票金额！'
          });
          return false;
        }
        if (isNaN(parseFloat(data.money))) {
          this.$message({
            type: 'error',
            message: '发票金额格式错误！'
          });
          return false;
        }
        if (!this.verificationHandle(data.money, '发票金额', 8)) {
          return false;
        }
        // if (!data.saleOrderId) {
        //   this.$message({
        //     type: 'error',
        //     message: '请输入销售订单编号！'
        //   });
        //   return false;
        // }
      }
      if (this.auditStatus == 'Rejected') {
        this.editReceiptList.submitType = '4';
      } else {
        this.editReceiptList.submitType = '2';
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
          this.getPrepareReceiptList();
          this.activeName = 'Approving';
          this.$message({
            type: 'success',
            message: '提交审批成功！'
          });
          this.isShowEdit = false;
        }
        this.isSubmitDisabled = false;
      });
    },
    deleteEditItemHandle(index) {
      let list = JSON.parse(JSON.stringify(this.editReceiptList));
      list.receiptListItemLists.splice(index, 1);
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
      batchNumberList(item.id).then(res => {
        console.log('批次号列表数据：', res);
        if (res.code === '0') {
          this.editReceiptList = res.data;
          for (var i = 0; i < this.editReceiptList.receiptListItemLists.length; i++) {
            let data = this.editReceiptList.receiptListItemLists[i];
            this.updateEditModeSet('edit', data);
          }
        }
      });
      this.getUploadFiles(item.uuid, '1');
      this.getUploadFiles(item.uuid, '2');
    },
    //拉取数据
    pullDataHandle() {
      console.log(this.editReceiptList.factoryInvoice);
      if (!this.editReceiptList.factoryInvoice) {
        this.$message({
          message: "请填写工厂发票号再拉取！",
          type: "error"
        });
        return false;
      }
      if (!this.verificationHandle(this.editReceiptList.factoryInvoice, '工厂发票号', 64)) {
        return false;
      }
      this.getFactoryInvoice();
    },
    //重新添加数据
    getFactoryInvoice(){
      factoryInvoice(this.editReceiptList.factoryInvoice).then(res=>{
        if (res.code === '0') {
          this.editData = res.data;
          console.log(res.data);
          console.log(this.editReceiptList)
          let editLen=this.editData.invoicePackingItemDtos.length
          let receiptLen=this.editReceiptList.receiptListItemLists.length
          if(this.editData.supplierCode!=this.editReceiptList.supplierName){
            this.$message({
              message: "箱单列表中物料编号与收货供应商不符!",
              type: "error"
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
              for (var i = 0; i < res.data.length; i++) {
                packingData.id = res.data[i].id;
                packingData.name = res.data[i].realname;
                packingData.url = process.env.VUE_APP_SCM_IMG_URL + res.data[i].filepath;
                this.uploadPackingList.push(packingData);
                packingData = {};
              }
              break;
            case '2':
              // 工厂发票
              for (var i = 0; i < res.data.length; i++) {
                invoiceData.id = res.data[i].id;
                invoiceData.name = res.data[i].realname;
                invoiceData.url = process.env.VUE_APP_SCM_IMG_URL + res.data[i].filepath;
                this.uploadInvoiceList.push(invoiceData);
                invoiceData = {};
              }
              break;
            default:
              break;
          }
        }
      });
    },
    submitHandle(index, item) {
      // 提交审批
      console.log(item);
      this.submitParamsData = {
        uuid: item.uuid,
        auditStatus: 'Approving',
        submitType: '',
        applicant: this.$store.state.userName,
        applicantName: this.$store.state.realName,
        applicantDepartment: this.$store.state.currentDepartment.id,
        applicantDepartmentName: this.$store.state.currentDepartment.name
      };
      if (this.auditStatus == 'Rejected') {
        // 已驳回提交
        this.submitParamsData.submitType = '4';
      } else {
        this.submitParamsData.submitType = '2';
      }
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
    checkApprovalProcess(item) {
      console.log('', item);
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
      // 工厂发票号change
    },
    factoryInvoiceTimeChange(val) {
      // 工厂发票时间
      console.log('工厂发票时间: ', val);
    },
    paymentTermsChange(val) {
      // 到期日期
      console.log('到期日期: ', val);
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
    changeSector(id) {

    },
    searchHandle() {
      // 搜索
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
      if (!this.checkList.length) {
        this.$message({
          type: 'error',
          message: '请选择需要导出的调拨单!'
        });
        return false;
      }
      this.exportDialogVisible = true;
    },
    confirmExportHandle() {
      // 确定导出
      this.exportDialogVisible = false;
      let uuidCheckStr = this.uuidCheckList.join(',');
      window.open(this.apiUrl + 'allocation/v1/exportPhpExcel?uuids=' + uuidCheckStr);
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    switchTabHandle(tab) {
      console.log('tab切换：', tab);
      this.tableLoading = true;
      this.currentPage = 1;
      this.requisitionList = [];
      this.receiptList = [];
      this.checkList = [];
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
    },
    createAdvanceReceipt() {
      // 创建预收货清单
      this.editType = 'create';
      if (!this.checkList.length) {
        this.$message({
          type: "error",
          message: '请选择要创建的调拨单！'
        });
        return;
      }
      this.packingList = [];
      this.factoryInvoice = [];
      this.uploadPackingList = [];
      this.uploadInvoiceList = [];

      // 查询调拨单列表
      searchRequisitionItem(this.checkList).then(res => {
        console.log('创建调拨单请求列表：', res);
        if (res.code === '0') {
          purchasegetuuid().then(uuidData => {
            console.log('新生成uuid：', uuidData);
            if (uuidData.code == '0') {
              let editListCopy = {};
              let editItemCopy = JSON.parse(JSON.stringify(this.editItemData));
              editListCopy.uuid = uuidData.data;
              if (res.data.length) {
                editListCopy.supplierCode = res.data[0].supplierCode;
                editListCopy.supplierName = res.data[0].supplierName;
              }
              editListCopy.receiptListItemLists = res.data;
              editListCopy.receiptListItemLists.forEach(item => {
                // item.purchaseType = item.allocationTypeName;
                item.uuid = item.factoryAllocationItemUuid;
                this.updateEditModeSet('edit', item);
              });
              this.editReceiptList = editListCopy;
              console.log(editListCopy);
              this.isShowEdit = true;
            }
          });
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
          console.log('删除上传箱单222：', res);
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
      switch (this.activeName) {
        case 'Requisition':
          this.getRequisitionList();
          break;
        default:
          this.getPrepareReceiptList();
          break;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      switch (this.activeName) {
        case 'Requisition':
          this.getRequisitionList();
          break;
        default:
          this.getPrepareReceiptList();
          break;
      }
    },
    getRequisitionList() {
      // 调拨单列表
      let data = {
        allocationStatus: this.allocationStatus,
        allocationType: this.allocationType,
        faDeleteStatus: this.faDeleteStatus,
        factoryAllocationCode: this.factoryAllocationCode,
        rev: this.rev,
        uuid: this.uuid,
        allocationStatus: 'Approved',
        supplierName: this.supplierName,
        startTime: this.startTime,
        endTime: this.endTime,
        materialCode: this.materialCode
      };
      requisitionList(this.currentPage, this.pageSize, data).then(res => {
        console.log('调拨单列表：', res);
        if (res.code === '0') {
          this.requisitionList = res.data.records;
          this.total = res.data.total;
          this.requisitionList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }

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
        supplierName: this.supplierName
      };
      advanceReceiptList(this.currentPage, this.pageSize, data).then(res => {
        console.log('已生成预收货列表：', res);
        if (res.code === '0') {
          this.receiptList = res.data.records;
          this.total = res.data.total;
          this.receiptList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = '空';
            }
            item.currencyName = item.currency ? currencyTypeHandle(item.currency) : '';
          });
          let list = this.receiptList;
          let childData = {};
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < list[i].preItemList.length; j++) {
              childData = list[i].preItemList[j];
              if (childData.updateTime) {
                childData.updateTime = timeFormat(childData.updateTime);
              } else {
                childData.updateTime = '';
              }
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
        // console.log('供应商列表：', res);
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
  i.el-icon-remove, i.el-icon-circle-plus {
    font-size: 28px;
    color: red;
    cursor: pointer;
  }
  i.el-icon-circle-plus {
    color: #409eff;
  }
}
.table_part, .edit_part {
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
/* .advancereceipt .table_part .el-checkbox {
  height: 40px;
  line-height: 40px;
} */
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