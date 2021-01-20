<template>
  <div class="container finalPaymentRequest">
    <!--<p>尾款申请</p>-->
    <div class="commoncontent" v-if="ifaddsure==false">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">采购订单编号：</span>
            <el-input class="input_single w200 mr10" v-model="purchaseOrderCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">供应商：</span>
            <!-- <el-input class="input_single w200 mr10" v-model="supplierName" placeholder="请输入"></el-input> -->
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
            <span class="tag">付款状态：</span>
            <el-select
              class="select_single w200 mr10"
               @change="searchHandle"
              v-model="paidStatus"
              placeholder="请选择">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in paymentList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">创建日期：</span>
            <el-date-picker
              v-model="creatTime"
              unlink-panels
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            class="mr"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
          <el-button
            v-if="this.isApplication==false"
            type="primary"
            class="mr"
            @click="createApplyFor"
          >生成付款申请</el-button>
        </div>
      </div>

      <!-- <div class="container_table table_part clearfix" style>
        <el-tabs class="subnav_wrap" v-model.trim="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in panelist"
            :key="item.index"
            :label="item.name"
            :name="item.index"
            v-loading="tableLoading">
            <div v-if="isApplication==false">
              <ul class="childlist center parent_header_wrap">
                <li class="w13p t_left">
                  <el-checkbox
                    class="checkbox mr10"
                    :checked="isCheckedAll"
                    v-model="checkAllFlag"
                    @change="handleCheckAllChange"
                  ></el-checkbox>
                  订单创建时间</li>
                <li class="w15p">订单编号</li>
                <li class="w8p">供应商</li>
                <li class="w6p">付款状态</li>
              </ul>
              <div class="allparentlist" v-for="(item, index) in requestList" :key="index">
                <ul class="parentlist" @click="showlist(index,item)">
                  <li class="w13p" :title="'订单创建时间：' + item.poCreateTime">
                    <el-checkbox-group v-model="checkArr" @change="handleChecked">
                      <el-checkbox
                        class="checkbox"
                        :title="item.poCreateTime"
                        :label="item"
                      >{{item.poCreateTime}}</el-checkbox>
                    </el-checkbox-group>
                  </li>
                  <li class="w15p t_center" :title="'订单编号：' + (item.poId ? item.poId : '')">
                    <i>
                      <em>{{item.poId}}</em>
                    </i>
                  </li>
                  <li class="w8p t_center" :title="'供应商：' + (item.supplierName ? item.supplierName : '')">
                    <i style>
                      <em>{{item.supplierName}}</em>
                    </i>
                  </li>
                  <li class="w6p t_center" :title="'付款状态：' + actionsTypeHandle(item.paidStatus)">
                    <i>
                      <em>{{actionsTypeHandle(item.paidStatus)}}</em>
                    </i>
                  </li>
                  <li
                    style="float: right; margin-right: 15px;"
                    class="w3p"
                    @click.stop="showlist(index,item)">
                    <i v-if="item.ifshowlist==true" class="el-icon-caret-top"></i>
                    <i v-else class="el-icon-caret-bottom"></i>
                  </li>
                  <li class="fr">
                    <i v-if="item.auditStatus=='Draft'||item.auditStatus=='Rejected'" type="primary" class="el-icon-thumb" title="提交审批" @click.stop="draftoutsave(item,index)"></i>
                    <i v-if="item.auditStatus!='Approved'&&item.auditStatus!='Approving'" type="primary" class="el-icon-delete" title="删除" @click="factorydel(item,index)"></i>
                  </li>
                </ul>

                <ul class="childlist center" v-show="item.ifshowlist==true">
                  <li class="w3p"></li>
                  <li class="w8p">物料编号</li>
                  <li class="w8p">供应商</li>
                  <li class="w7p">确认书号</li>
                  <li class="w15p">确认书数量</li>
                  <li class="w15p">货妥数量</li>
                  <li class="w15p">申请付款数量</li>
                  <li class="w8p">已付数量</li>
                  <li class="w8p">待付数量</li>
                  <li class="w8p">最终发货</li>
                  <li class="w5p"></li>
                </ul>

                <ul
                  class="childcontentlist"
                  v-for="(childItem, index) in item.finalPayments"
                  :key="index"
                  v-show="item.ifshowlist==true">
                  <li class="w3p"></li>
                  <li class="w8p" :title="childItem.materialCode">{{childItem.materialCode}}</li>
                  <li class="w8p" :title="childItem.supplierName">{{childItem.supplierName}}</li>
                  <li class="w7p" :title="childItem.confirmingCode">{{childItem.confirmingCode}}</li>
                  <li class="w15p">
                    <div
                      class="hiddenClass"
                      v-if="childItem.purchaseMeasurementUnit=='米'"
                      :title="childItem.confirmPackages +'包  '+childItem.packSpecification+'米/包  '+childItem.confirmQuantity +'米'"
                    >
                      {{childItem.confirmPackages==null?"0":childItem.confirmPackages}}&nbsp;包&nbsp;
                      {{childItem.packSpecification?childItem.packSpecification:"0"}}&nbsp;米/包&nbsp;
                      {{childItem.confirmQuantity?childItem.confirmQuantity:"0"}}&nbsp;米
                    </div>
                    <div class="hiddenClass" v-else :title="childItem.confirmQuantity +childItem.purchaseMeasurementUnit">
                      {{childItem.confirmQuantity?childItem.confirmQuantity:"0"}}
                      <span
                        v-if="childItem.purchaseMeasurementUnit!=null"
                      >&nbsp;{{childItem.purchaseMeasurementUnit}}</span>
                      <span v-else>条</span>
                    </div>
                  </li>
                  <li class="w15p">
                    <div class="hiddenClass"
                      v-if="childItem.purchaseMeasurementUnit=='米'"
                      :title="childItem.readyBagQuantity +'包  '+childItem.packSpecification+'米/包  '+childItem.readyMeter +'米'"
                    >
                      {{childItem.readyBagQuantity==null?"0":childItem.readyBagQuantity}}&nbsp;包&nbsp;
                      {{childItem.packSpecification?childItem.packSpecification:"0"}}&nbsp;米/包&nbsp;
                      {{childItem.readyMeter?childItem.readyMeter:"0"}}&nbsp;米
                    </div>
                    <div class="hiddenClass" v-else :title="childItem.readyMeter+childItem.purchaseMeasurementUnit">
                      {{childItem.readyMeter?childItem.readyMeter:"0"}}
                      <span
                        v-if="childItem.purchaseMeasurementUnit!=null"
                      >&nbsp;{{childItem.purchaseMeasurementUnit}}</span>
                      <span v-else>条</span>
                    </div>
                  </li>
                  <li class="w15p">
                    <div class="hiddenClass"
                      v-if="childItem.purchaseMeasurementUnit=='米'"
                      :title="childItem.applyPaidBagQuantity +'包  '+childItem.applyPaidBagMeter+'米/包  '+childItem.applyPaidMeter +'米'"
                    >
                      {{childItem.applyPaidBagQuantity==null?"0":childItem.applyPaidBagQuantity}}&nbsp;包&nbsp;
                      {{childItem.applyPaidBagMeter?childItem.applyPaidBagMeter:"0"}}&nbsp;米/包&nbsp;
                      {{childItem.applyPaidMeter?childItem.applyPaidMeter:"0"}}&nbsp;米
                    </div>
                    <div class="hiddenClass" v-else :title="childItem.applyPaidMeter +childItem.purchaseMeasurementUnit">
                      {{childItem.applyPaidMeter?childItem.applyPaidMeter:"0"}}
                      <span
                        v-if="childItem.purchaseMeasurementUnit!=null"
                      >&nbsp;{{childItem.purchaseMeasurementUnit}}</span>
                      <span v-else>条</span>
                    </div>
                  </li>
                  <li class="w8p">
                    <div class="hiddenClass"
                      v-if="childItem.purchaseMeasurementUnit=='米'"
                      :title="childItem.paidBagQuantity +'包  '+childItem.paidMeter +'米'"
                    >
                      {{childItem.paidBagQuantity==null?"0":childItem.paidBagQuantity}}&nbsp;包&nbsp;
                      {{childItem.paidMeter?childItem.paidMeter:"0"}}&nbsp;米
                    </div>
                    <div class="hiddenClass" v-else :title="childItem.paidMeter+childItem.purchaseMeasurementUnit">
                      {{childItem.paidMeter?childItem.paidMeter:"0"}}&nbsp;
                      <span
                        v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''"
                      >{{childItem.purchaseMeasurementUnit}}</span>
                      <span v-else>条</span>
                    </div>
                  </li>
                  <li class="w8p">
                    <div class="hiddenClass"
                      v-if="childItem.purchaseMeasurementUnit=='米'"
                      :title="childItem.waitPaidBagQuantity +'包  '+childItem.waitPaidMeter +'米'"
                    >
                      {{childItem.waitPaidBagQuantity==null?"0":childItem.waitPaidBagQuantity}}&nbsp;包&nbsp;
                      {{childItem.waitPaidMeter?childItem.waitPaidMeter:"0"}}&nbsp;米
                    </div>
                    <div class="hiddenClass" v-else :title="childItem.paidMeter+childItem.purchaseMeasurementUnit">
                      {{childItem.waitPaidMeter?childItem.waitPaidMeter:"0"}}&nbsp;
                      <span
                        v-if="childItem.purchaseMeasurementUnit!=null&&childItem.purchaseMeasurementUnit!=''"
                      >{{childItem.purchaseMeasurementUnit}}</span>
                      <span v-else>条</span>
                    </div>
                  </li>
                  <li class="w5p">
                    <i
                      class="el-icon-delete"
                      title="删除"
                      @click="factorychilddel(childItem,index)"
                    ></i>
                  </li>
                </ul>
              </div>
            </div>
            <div v-else>
              <Table
                :tableList="requestList"
                :parentData="parentData"
                :childData="childData"
                :tableFieldsList="orderFieldsList"
                :tableParentFieldsList="parentOrderFieldsList"
                :tableLoading="tableLoading"
                @editHandle="factoryupd"
                @submitHandle="draftoutsave"
                @deleteHandle="factorydel">
              </Table>
              <p v-if="!requestList.length && !tableLoading" class="empty_tip">暂无数据</p>
            </div>
             <p
              v-if="requestList=='' && !tableLoading"
              class="empty_tip"
            >暂无数据</p>
          </el-tab-pane>
        </el-tabs>
        <div class="paging" style="margin-top: 20px;text-align:right;height: 30px;">
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
      </div> -->



      <div class="table_part clearfix">
          <el-tabs class="subnav_wrap hidden" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in panelist"
              :key="item.index"
              :label="item.name"
              :name="item.index">
              <div v-if="item.index == '1'">
                <el-table
                  class="table_list"
                  ref="multipleTable"
                  v-loading="listLoading"
                  :data="requestList"
                  row-key="poId"
                  :expand-row-keys="expands"
                  @row-click="rowClick"
                  border
                  fit
                  stripe
                  @select="selectHandle"
                  @expand-change="expandChange"
                  @select-all="selectAllHandle">
                  <el-table-column type="selection" />
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        v-loading="childListLoading"
                        :data="scope.row.finalPayments"
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
                        <!-- <el-table-column label="供应商">
                          <template slot-scope="{ row }">
                            {{ row.supplierShortName }}
                          </template>
                        </el-table-column> -->
                        <el-table-column label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmingCode }}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.confirmPackages? row.confirmPackages: 0) + '包 ' + (row.packSpecification? row.packSpecification: 0) + '米/包 ' + (row.confirmQuantity ? row.confirmQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.confirmPackages ? row.confirmPackages : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="货妥数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.readyBagQuantity? row.readyBagQuantity: 0) + '包 ' + (row.packSpecification? row.packSpecification: 0) + '米/包 ' + (row.readyMeter ? row.readyMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.readyMeter ? row.readyMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="申请付款数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.applyPaidBagQuantity? row.applyPaidBagQuantity: 0) + '包 ' + (row.applyPaidBagMeter? row.applyPaidBagMeter: 0) + '米/包 ' + (row.applyPaidMeter ? row.applyPaidMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.applyPaidMeter ? row.applyPaidMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="已付数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.paidBagQuantity? row.paidBagQuantity: 0) + '包 ' + (row.paidMeter ? row.paidMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.paidMeter ? row.paidMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="待付数量" >
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.waitPaidBagQuantity? row.waitPaidBagQuantity: 0) + '包 ' + (row.waitPaidMeter? row.waitPaidMeter: 0) + '米' }}</span>
                            <span v-else>{{ (row.waitPaidMeter? row.waitPaidMeter: 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>   
                        <el-table-column label="最终发货" >
                          <template slot-scope="{ row }">
                            <i style v-if="row.isApplication==true">{{row.isFinalDelivery==true?"是":"否"}}</i>
                          </template>
                        </el-table-column> 
                        <el-table-column label="调拨单号">
                          <template slot-scope="{ row }">
                             <span>{{row.factoryAllocationCode}}</span>
                          </template>
                        </el-table-column>
                        <!-- <el-table-column label="操作" >
                          <template slot-scope="{ row }">
                            <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="factorychilddel(row,$index)"></el-button>
                          </template>
                        </el-table-column> -->
                      </el-table>
                    </template>
                  </el-table-column>
                 
                  <el-table-column label="订单编号">
                    <template slot-scope="{ row }">
                      {{ row.poId }}
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商">
                    <template slot-scope="{ row }">
                      {{ row.supplierShortName }}
                      <!-- {{ row.supplierName }} -->
                    </template>
                  </el-table-column>
                  <el-table-column label="付款状态">
                    <template slot-scope="{ row }">
                      {{actionsTypeHandle(row.paidStatus)}}
                    </template>
                  </el-table-column>
                   <el-table-column label="订单创建时间">
                    <template slot-scope="{ row }">
                      {{ row.poCreateTime }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="操作">
                    <template slot-scope="{ row, $index }">
                      <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="factorydel($index,row)"></el-button>
                    </template>
                  </el-table-column> -->
                </el-table>
              </div>

              <div v-else>
                <el-table
                  class="table_list"
                  :ref="multipleTable"
                  v-loading="listLoading"
                  :data="requestList"
                  row-key="finalPaymentCode"
                  :expand-row-keys="expands"
                  @row-click="rowClickApplyfor"
                  border
                  fit
                  stripe>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-table
                        class="table_list"
                        :ref="'childMultipleTable_' + scope.row.id"
                        v-loading="childListLoading"
                        :data="scope.row.finalPayments"
                        border
                        fit>
                        <el-table-column fixed label="行号">
                          <template slot-scope="{ row }">
                            {{ row.purchaseOrderSn }}
                          </template>
                        </el-table-column>
                        <el-table-column fixed label="订单编号">
                          <template slot-scope="{ row }">
                            {{ row.poId}}
                          </template>
                        </el-table-column>
                        <el-table-column label="物料编号">
                          <template slot-scope="{ row }">
                            {{ row.materialCode }}
                          </template>
                        </el-table-column>
                        <el-table-column  label="供应商">
                          <template slot-scope="{ row }">
                            {{ row.supplierShortName }}
                            <!-- {{ row.supplierName }} -->
                          </template>
                        </el-table-column>
                        <el-table-column  label="确认书号">
                          <template slot-scope="{ row }">
                            {{ row.confirmingCode}}
                          </template>
                        </el-table-column>
                        <el-table-column label="确认书数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.confirmPackages ? row.confirmPackages : 0) + '包 ' + (row.packSpecification ? row.packSpecification : 0) + '米/包 ' + (row.confirmQuantity ? row.confirmQuantity : 0) + '米' }}</span>
                            <span v-else>{{ (row.confirmQuantity ? row.confirmQuantity : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="货妥数量" >
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.readyBagQuantity ? row.readyBagQuantity : 0) + '包 ' + (row.packSpecification? row.packSpecification: 0) + '米/包 ' + (row.readyMeter ? row.readyMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.readyMeter ? row.readyMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="申请付款数量" >
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.applyPaidBagQuantity? row.applyPaidBagQuantity: 0) + '包 ' + (row.applyPaidBagMeter ? row.applyPaidBagMeter : 0) + '米/包 ' + (row.applyPaidMeter ? row.applyPaidMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.applyPaidMeter ? row.applyPaidMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column  label="已付数量">
                          <template slot-scope="{ row }">
                          <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.paidBagQuantity? row.paidBagQuantity: 0) + '包 ' + (row.paidMeter ? row.paidMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.paidMeter? row.paidMeter: 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column  label="待付数量">
                          <template slot-scope="{ row }">
                            <span v-if="row.purchaseMeasurementUnit == '米'">{{ (row.waitPaidBagQuantity? row.waitPaidBagQuantity: 0) + '包 ' + (row.waitPaidMeter ? row.waitPaidMeter : 0) + '米' }}</span>
                            <span v-else>{{ (row.waitPaidMeter ? row.waitPaidMeter : 0) + (row.purchaseMeasurementUnit ? row.purchaseMeasurementUnit : '条') }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column label="最终发货" >
                          <template slot-scope="{ row }">
                            <i style v-if="row.isApplication==true">{{row.isFinalDelivery==true?"是":"否"}}</i>
                          </template>
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                 
                  <el-table-column label="尾款付款单号">
                    <template slot-scope="{ row }">
                      {{ row.finalPaymentCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="形式发票号">
                    <template slot-scope="{ row }">
                      {{ row.proformaInvoiceNum}}
                    </template>
                  </el-table-column>
                  <el-table-column label="付款状态" >
                    <template slot-scope="{ row }">
                      {{ row.paidStatusName}}
                    </template>
                  </el-table-column>
                  <el-table-column label="申请付款时间">
                    <template slot-scope="{ row }">
                      {{ row.applicantTime}}
                    </template>
                  </el-table-column>
                  <el-table-column label="申请人" >
                    <template slot-scope="{ row }">
                      {{ row.applicantName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" >
                    <template slot-scope="{ row, $index }">
                      <div v-if="row.auditStatus == 'Draft' || row.auditStatus == 'Rejected'">
                        <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="factoryupd($index,row)"></el-button>
                        <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="draftoutsave($index,row)"></el-button>
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="factorydel($index, row)"></el-button>
                      </div>
                      <div v-if="row.auditStatus == 'Terminated'">
                        <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="factorydel($index,row)"></el-button>
                      </div>
                    </template>
                  </el-table-column>
                  
                </el-table>
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
              :total="total"
            ></el-pagination>
          </div>
        </div>

    </div>

    <div class="paymentRequest" v-if="ifaddsure==true">
      <!--<p>尾款付款申请请求</p>-->
      <finalPaymentadd :checkArr="checkArr" :operationTag="operationTag" v-on:cancel="cancel"></finalPaymentadd>
    </div>

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogdelVisible"
      width="30%"
    >
      <span>{{this.marked}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibleclick()" :loading="saveloading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { purchasegetuuid, finalPaymentSerch, finalPaymentchilddel, finalPaymentdel, finalDraftoutSave,finalUpddata} from "@/api/module/finalPaymentApi.js";
import { finalPaymentMethod } from "@/api/module/dictionariesApi.js";
import { supplierDictList } from "@/api/publicApi.js";
import { timeFormat, dateToStr, cutOutNum,getTimeRange} from "@/utils/index.js";
import { currencyTypeHandle } from '@/utils/public.js';
import Table from "@/layouts/components/common/Table.vue";
import finalPaymentadd from "../finalPaymentadd/Index";
export default {
  name: "finalPaymentRequest",
  components: { 
    finalPaymentadd,
    Table
  },
  data() {
    return {
       // NEW TBALE组件列表
      multipleSelection: [],
      childMultipleSelection: [],
      listLoading: false,
      childListLoading: false,
      selectUuidList: [],
      checkedIdList: [],
      checkedUuidList: [],
      expands:[],
      tableLoading: true,
      materialCode: "",
      purchaseOrderCode: "",
      supplierCode: "",
      supplierName: "",
      paidStatus: "",
      creatTime: "",
      starttime: "", //开始时间
      endtime: "", //结束时间
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: "1",
      finalPaymentStatus: "",
      deltag: "",
      marked: "",
      finalPaymentCode: "",
      operationTag: "",
      checkList: [],
      checkAllList: [],
      checkArr: [],
      CheckedAllArr: [],
      delData: [],
      saveloading:false,
      ifaddsure: false,
      checkAll: false,
      isIndeterminate: true,
      isCheckedAll: false, //全选判断标识
      checkAllFlag: false,
      dialogdelVisible: false,
      isApplication: false, //是否发起付款
      paymentList: [],
      supplierList: [],
      typeList: [
        {
          index: 0,
          name: "代付款"
        },
        {
          index: 1,
          name: "已付款"
        },
        {
          index: 2,
          name: "付款中"
        }
      ],
      panelist: [
        {
          index: "1",
          status: "",
          name: "尾款付款发起"
        },
        {
          index: "2",
          status: "",
          name: "全部尾款付款申请"
        },
        {
          index: "3",
          status: "Draft",
          name: "草稿"
        },
        {
          index: "4",
          status: "Approving",
          name: "审批中"
        },
        {
          index: "5",
          status: "Approved",
          name: "已通过"
        },
        {
          index: "6",
          status: "Rejected",
          name: "已驳回"
        },
        // {
        //   index: "7",
        //   status: "Terminated",
        //   name: "已终止"
        // }
      ],
      orderFieldsList: [
        {
          name: '订单编号',
          class: 'w8p',
        },
        {
          name: '物料编号',
          class: 'w8p',
        },
        {
          name: '供应商',
          class: 'w8p',
        },
        {
          name: '确认书号',
          class: 'w7p',
        },
        {
          name: '确认书数量',
          class: 'w15p',
        },
        {
          name: '货妥数量',
          class: 'w15p',
        },
        {
          name: '申请付款数量',
          class: 'w15p',
        },
        {
          name: '已付数量',
          class: 'w8p',
        },
        {
          name: '待付数量',
          class: 'w8p'
        },
        {
          name:'最终发货',
          field: '',
          class: 'w8p',
        }
      ],
      parentOrderFieldsList: [  // Table父列表表头
        {
          name: '申请付款时间',
          class: 'w8p'
        },
        {
          name: '申请人',
          class: 'w4p'
        },
        {
          name: '尾款付款单号',
          class: 'w12p'
        },
        {
          name: '形式发票号',
          class: 'w6p'
        },
        {
          name: '付款状态',
          class: 'w6p'
        },
        {
          name: '审批状态',
          class: 'w12p'
        }
      ],
      requestList: [],
      parentData: {
        status: '',
        data: [
          {
            name: '申请付款时间',
            field: 'applicantTime',
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
            name: '尾款付款单号',
            field: 'finalPaymentCode',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '形式发票号',
            field: 'proformaInvoiceNum',
            class: 'w6p',
            isShowTit: true
          },
          {
            name: '付款状态',
            field: 'paidStatusName',
            class: 'w6p',
            isShowTit: true
          },
          {
            name: '审批状态',
            field: '',
            class: 'w12p',
            isShowTit: false,
            isPane:true
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
      childData: {
        name: 'finalPayments',
        data: [
          {
            name: '',
            field: 'poId',
            class: 'w8p'
          },
          {
            name: '',
            field: 'materialCode',
            class: 'w8p'
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w8p'
          },
          {
            name: '',
            field: 'confirmingCode',
            class: 'w7p'
          },
          {
            name: '',
            field_1: 'confirmPackages',
            field_2: 'packSpecification',
            field_3: 'confirmQuantity',
            field: 'confirmQuantity',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field_1: 'readyBagQuantity',
            field_2: 'packSpecification',
            field_3: 'readyMeter',
            field: 'readyMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field_1: 'applyPaidBagQuantity',
            field_2: 'applyPaidBagMeter',
            field_3: 'applyPaidMeter',
            field: 'applyPaidMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w15p',
            isQuantityField: true
          },
          {
            name: '',
            field_1: 'paidBagQuantity',
            field_2: 'paidMeter',
            field: 'paidMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w8p',
            isPurchase: true
          },
          {
            name: '',
            field_1: 'waitPaidBagQuantity',
            field_2: 'waitPaidMeter',
            field: 'waitPaidMeter',
            field_unit: 'purchaseMeasurementUnit',
            class: 'w8p',
            isPurchase: true
          },
          {
            name: '',
            field: '',
            isApplication:true,
            class: 'w8p'
          },
        ]
      },
    };
  },
  mounted() {
    this.finalPaymentStatus = "";
    this.getSupplierDictList();
    // this.finalPaymentList();
    this.getPaymentstatus();
    this.fun_date();
  },
  methods: {
      //固定展示为两周前的时间范围
    fun_date(){
       console.log(getTimeRange(-14))//两周前的日期
      this.creatTime=getTimeRange(-14);
      this.searchHandle();
    },
    rowClick(row, event, column){
      //单击事件(尾款发起)
      console.log(row,event,column);
      Array.prototype.remove = function (val) {
        console.log(val)
          let index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      if (this.expands.indexOf(row.poId) < 0) {
          this.expands.push(row.poId);
      }else {
          this.expands.remove(row.poId);
      }
    },
    rowClickApplyfor(row, event, column){
       //单击事件
      console.log(row,event,column);
      Array.prototype.remove = function (val) {
        // console.log(val)
          let index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      if (this.expands.indexOf(row.finalPaymentCode) < 0) {
          this.expands.push(row.finalPaymentCode);
      }else {
          this.expands.remove(row.finalPaymentCode);
      }
    },
    selectAllHandle(selection) {
      // 父项全选事件
      console.log('触发全选事件：', selection);
       this.checkArr=selection;
      this.selectUuidList = [];
      this.childMultipleSelection = [];
      // this.multipleSelection = selection;
      // if (selection && selection.length) {
      //   for (let i = 0; i < selection.length; i++) {
      //     let item = selection[i];
      //     this.selectUuidList.push(item.uuid);
      //     for (let j = 0; j < item.finalPayments.length; j++) {
      //       let cItem = item.finalPayments[j];
      //       this.childMultipleSelection.push(cItem);
      //       this.$nextTick(() => {
      //         if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
      //           this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, true);
      //         }
      //       });
      //     }
      //   }
      // } else {
      //   for (let i = 0; i < this.requestList.length; i++) {
      //     let item = this.requestList[i];
      //     for (let j = 0; j < item.finalPayments.length; j++) {
      //       let cItem = item.finalPayments[j];
      //       this.$nextTick(() => {
      //         if (this.$refs['childMultipleTable_' + item.id] && this.$refs['childMultipleTable_' + item.id].length) {
      //           this.$refs['childMultipleTable_' + item.id][0].toggleRowSelection(cItem, false);
      //         }
      //       });
      //     }
      //   }
      // }
    },
    selectHandle(selection, row) {
      console.log('当用户手动勾选数据行的 Checkbox 时触发事件：', selection, row);
      
      let _this = this;
      let _row = row;
      this.selectUuidList = [];
      this.multipleSelection = selection;
      this.checkArr=selection;
      // if (selection && selection.length) {
      //   // await this.$nextTick();
      //   for (var i = 0; i < selection.length; i++) {
      //     let item = selection[i];
      //     this.selectUuidList.push(item.uuid);
      //   }
      //   if (this.selectUuidList.indexOf(_row.uuid) > -1) {
      //     // 当前项选中状态
      //     for (let i = 0; i < _row.finalPayments.length; i++) {
      //       let cItem = _row.finalPayments[i];
      //       this.$nextTick(() => {
      //         if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
      //           this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, true);
      //         }
      //       });
      //       this.childMultipleSelection.push(cItem);
      //     }
      //   } else {
      //     for (let i = 0; i < _row.finalPayments.length; i++) {
      //       let cItem = _row.finalPayments[i];
      //       this.$nextTick(() => {
      //         if (this.$refs['childMultipleTable_' + _row.id] && this.$refs['childMultipleTable_' + _row.id].length) {
      //           this.$refs['childMultipleTable_' + _row.id][0].toggleRowSelection(cItem, false);
      //         }
      //       });
      //       this.childMultipleSelection = this.childMultipleSelection.filter(cmsItem => {
      //         return cmsItem.uuid !== cItem.uuid;
      //       });
      //     }
      //   }
      // } else {
      //   // 未选中 需删除该父项下所有子项
      //   console.log(this.$refs['childMultipleTable_' + _row.id])
      //   this.$refs['childMultipleTable_' + _row.id][0].clearSelection();
      //   for (let i = 0; i < row.finalPayments.length; i++) {
      //     let item = row.finalPayments[i];
      //     if (this.arrContainObjHandle(this.childMultipleSelection, item) != -1) {
      //       let index = this.childMultipleSelection.findIndex(x => x.uuid == item.uuid);
      //       this.childMultipleSelection.splice(index, 1);
      //     }
      //   }
      // }

      console.log('子勾选项空间的：', this.childMultipleSelection);
    },
     expandChange(row, rowList) {
      console.log('树形展开项：', row, rowList);
      if (this.selectUuidList.indexOf(row.uuid) > -1) {
        // 父项被勾选
        // await this.$nextTick();
        for (let i = 0; i < row.finalPayments.length; i++) {
          let cItem = row.finalPayments[i];
          this.$nextTick(() => {
            if (this.$refs['childMultipleTable_' + row.id] && this.$refs['childMultipleTable_' + row.id].length) {
              this.$refs['childMultipleTable_' + row.id][0].toggleRowSelection(cItem, true);
            }
          });
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
      if (selection.length === parentRow.finalPayments.length) {
        // 子项选择个数与当前列表子项个数一致触发当前父项数据全选
        this.$nextTick(() => {
          if (this.$refs.multipleTable && this.$refs.multipleTable.length) {
            this.$refs.multipleTable[0].toggleRowSelection(parentRow, true);
          }
        });
      }
      this.$refs.multipleTable[0].toggleRowSelection(parentRow, false);

      console.log('345555555555子勾选项空间的：', this.childMultipleSelection);
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
        for (let i = 0; i < parentRow.finalPayments.length; i++) {
          let item = parentRow.finalPayments[i];
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
    //付款状态
    getPaymentstatus() {
      finalPaymentMethod().then(response => {
        if (response.code === "0") {
          this.paymentList = response.data;
        }
      });
    },
    //列表分页接口
    finalPaymentList() {
      let data = {
        materialCode: this.materialCode,
        auditStatus: this.finalPaymentStatus,
        endTime: this.endtime,
        isApplication: this.isApplication,
        paidStatus: this.paidStatus,
        poId: this.purchaseOrderCode,
        startTime: this.starttime,
        // supplierName: this.supplierName,
        supplierCode: this.supplierCode
      };
      finalPaymentSerch(this.currentPage, this.pageSize, data).then(res => {
        console.log('尾款申请列表：', res);
        if (res.code == "0") {
          this.tableLoading = false;
          this.total = res.data.total;
          this.requestList = res.data.records;

          this.requestList.forEach((item, index) => {
            item.paidStatusName = this.actionsTypeHandle(item.paidStatus);
            item.isApplication = this.isApplication;
            switch (item.auditStatus) {
              case 'Draft':
                item.actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Rejected':
                item.actions = {
                  hasEdit: true,
                  hasSubmit: true,
                  hasDelete: true
                };
                break;
              case 'Terminated':
                item.actions = {
                  hasDelete: true
                };
                break;
              default:
                item.actions = {};
                break;
            }
            if (item.poCreateTime != null) {
              item.poCreateTime = timeFormat(item.poCreateTime);
              item.poCreateTime = item.poCreateTime.substring(0, 10);
            }
            if (item.applicantTime != null) {
              item.applicantTime = timeFormat(item.applicantTime);
              item.applicantTime = item.applicantTime.substring(0, 10);
            }
            item.finalPayments.forEach((i, index) => {
              item.auditStatus = i.auditStatus;
            });
            if (item.isApplication == false) {
              item.auditStatus = "";
            }
            item.currency ? item.currencyName = currencyTypeHandle(item.currency) : item.currencyName = '';
          });
          setTimeout(() => {
            this.tableLoading = false;
          }, 10000);
        } else {
          this.tableLoading = false;
        }
      });
    },
    //付款状态
    actionsTypeHandle(status) {
      if (status != null) {
        for (var i = 0; i < this.paymentList.length; i++) {
          let item = this.paymentList[i];
          if (item.index == status) {
            return item.name;
          }
        }
      }
    },
    approveTypeHandle(status) {
      if (status != null) {
        for (var i = 0; i < this.panelist.length; i++) {
          let item = this.panelist[i];
          if (item.status == status) {
            return item.name;
          }
        }
      }
    },
    showlist(index, item) {
      item.ifshowlist = !item.ifshowlist;
      this.$forceUpdate();
    },
    createApplyFor() {
      //生成付款申请
      console.log(this.checkArr)
      console.log(this.checkArr.length);    
      if (this.checkArr.length == 0) {
        this.$message({
          message: "请选择要生成的尾款付款请求",
          type: "error"
        });
      }else{
      	console.log('进入判断else')
      	//判断供应商不同不能生成付款申请
      	if(this.checkArr.length==1){
      		this.operationTag = "add";
          this.ifaddsure = true;
      	}else{     		
      		for(var i=0;i<this.checkArr.length;i++){
		      	let item=this.checkArr[i];
		      	for(var j=i+1; j<this.checkArr.length; j++){
			      	 let jitem=this.checkArr[j];
			            if(item.supplierName!=jitem.supplierName){
			            	 this.$message({
								          message: "不同的供应商不能生成同一个付款申请单!!",
								          type: "error"
								        });
			              return false;
			            }else{
			            	console.log('elseelseelse')
			            	this.operationTag = "add";
	                  this.ifaddsure = true;
			            }
			      }       
		      }       		
      	}
	      
       
      }
    },
    searchHandle() {
      //搜索
      if (this.creatTime != null && this.creatTime != "") {
        this.starttime = this.creatTime[0];
        this.endtime = this.creatTime[1];
      } else {
        this.starttime = "";
        this.endtime = "";
      }
      this.finalPaymentList();
    },
    //全选
    handleCheckAllChange(event) {
      let arr = [];
      console.log(!event);
      if (!event) {
        arr = [];
      } else {
        arr = this.requestList;
      }
      this.checkArr = event ? arr : [];
      console.log(this.checkArr);
      console.log(this.isCheckedAll);
      console.log(this.checkAllFlag);
    },
    //数组去重
    unique(array) {
      var temp = []; //一个新的临时数组
      for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1) {
          temp.push(array[i]);
        }
      }
      return temp;
    },
    //单选
    handleChecked() {
      this.isCheckedAll = this.checkArr.length == this.requestList.length;
      this.checkAllFlag = this.checkArr.length == this.requestList.length;
      console.log(this.isCheckedAll);
      console.log(this.checkAllFlag);
      console.log(this.checkArr);
    },
    //取消
    cancel(submitType) {
      console.log(submitType);
      this.ifaddsure = false;
      this.checkAllFlag = false;
      this.isCheckedAll = false;
      this.checkArr = [];
      if (submitType == 1) {
        this.finalPaymentStatus = "Draft";
        this.isApplication = true;
        this.activeName = "3";
      } else if (submitType == 2) {
        this.finalPaymentStatus = "Approving";
        this.isApplication = true;
        this.activeName = "4";
      } else if (submitType == 3) {
        this.finalPaymentStatus = "Rejected";
        this.isApplication = true;
        this.activeName = "6";
      } else if (submitType == 4) {
        this.finalPaymentStatus = "Approving";
        this.isApplication = true;
        this.activeName = "4";
      }
      this.finalPaymentList();
    },
    //提交审批
    draftoutsave(item, index) {
      var item=index;
      var index=item;
      console.log(item);
      this.marked = "确定提交审批？";
      this.dialogdelVisible = true;
      this.deltag = "draftsave";
      this.finalPaymentCode = item.finalPaymentCode;
    },
    //子项删除
    factorychilddel(item, index) {
      this.marked = "确定删除？";
      this.dialogdelVisible = true;
      this.deltag = "childDel";
      this.delid = item.id;
    },
    //父项删除
    factorydel(index, item) {
      // var item=index;
      // var index=item;
      console.log(index,item);
      this.marked = "确定删除？";
      this.dialogdelVisible = true;
      this.deltag = "parentDel";
      let arr = [];
      item.finalPayments.forEach(i => {
        arr.push(i.id);
      });
      this.delData = arr;
      console.log(arr);
    },
    //弹框点击确认
    delVisibleclick() {
      console.log(this.deltag);
      if (this.deltag == "childDel") {
        console.log("子项删除");
        finalPaymentchilddel(this.delid).then(response => {
          if (response.code === "0") {
            this.dialogdelVisible = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.finalPaymentList();
          }
        });
      } else if (this.deltag == "parentDel") {
        finalPaymentdel(this.delData).then(response => {
          if (response.code === "0") {
            this.dialogdelVisible = false;
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.finalPaymentList();
          }
        });
      } else if (this.deltag == "draftsave") {
        this.saveloading=true;
        finalDraftoutSave(this.finalPaymentCode).then(response => {
          if (response.code === "0") {
            this.saveloading=false;
            this.dialogdelVisible = false;
            this.$message({
              message: "提交审批成功",
              type: "success"
            });
            this.finalPaymentList();
          }
        });
      }
    },
    //编辑
    factoryupd(item, index) {
      var item=index;
      var index=item;
      console.log(item)
      this.ifaddsure = true;
      // this.checkArr = [item];
      this.operationTag = "upd";
      console.log(item);
      finalUpddata(item.finalPaymentCode,item.auditStatus).then(response => {
        if (response.code === "0") {
          console.log(response.data)
          // for(var i=0;i<response.data.length;i++){
          //   let data=response.data[i];
          //   data.finalNameList=data.finalPayments;
          // }
          this.checkArr=response.data;
          console.log('先执行',this.checkArr)
        }
      });
    },
    handleClick(tab, event) {
      this.tableLoading = true;
      switch (tab.name) {
        case "1":
          this.finalPaymentStatus = "";
          this.isApplication = false;
          this.finalPaymentList();
          break;
        case "2":
          this.finalPaymentStatus = "";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        case "3":
          this.finalPaymentStatus = "Draft";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        case "4":
          this.finalPaymentStatus = "Approving";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        case "5":
          this.finalPaymentStatus = "Approved";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        case "6":
          this.finalPaymentStatus = "Rejected";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        case "7":
          this.finalPaymentStatus = "Terminated";
          this.isApplication = true;
          this.finalPaymentList();
          break;
        default:
          break;
      }
      console.log(this.finalPaymentStatus);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.finalPaymentList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.finalPaymentList();
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    }
  },
  filters: {
    numFilter(value) {
      cutOutNum(value);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.center {
  text-align: center;
}
.ml {
  margin-left: 10px;
}
.mr {
  margin-right: 10px;
}
.red {
  color: #f56c6c;
}
 .hiddenClass{
  	display: inline-block;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
.finalPaymentRequest {
  border-radius: 6px;
  padding: 10px 0px;
  background: #ffffff;
  padding-bottom: 100px;
}
ul.parentlist {
  width: 100%;
}
.container_table {
  .allparentlist {
    .childlist {
      width: 98%;
      margin-left: 2%;
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
}
</style>
<style>
.finalPaymentRequest .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #606266;
}
.finalPaymentRequest label.el-checkbox {
  width: auto !important;
}
.finalPaymentRequest .container_table .el-tabs .el-tab-pane {
  min-height: 536px;
}
</style>
