<template>
  <div class="factoryorder">
    <div class="commoncontent" v-if="ifaddsure==false">
      <div class="container_title clearfix" v-if="activeName === '5'">
        <el-select class="select_single w200 mr10"
          v-model="purchaseType"
          placeholder="请选择请求类型">
          <el-option key label="请选择请求类型" value></el-option>
          <el-option
            v-for="item in typeList"
            :key="item.dictItemValue"
            :label="item.dictItemName"
            :value="item.dictItemValue"
          ></el-option>
        </el-select>
        <el-input class="input_single w200 mr10" v-model="factoryAllocationCode" placeholder="调拨单号"></el-input>
        <div class="down fr">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="receiptSearchHandle"
          ></el-button>
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-upload"
            circle
            title="上传"
            @click="receiptUploadHandle"
          ></el-button>
        </div>
      </div>

      <div class="container_title clearfix" v-else>
        <el-select v-model="typestatusid" placeholder="请选择请求类型">
          <el-option key label="全部" value></el-option>
          <el-option
            v-for="item in typeList"
            :key="item.dictItemValue"
            :label="item.dictItemName"
            :value="item.dictItemValue"
          ></el-option>
        </el-select>
        <el-input
          class="input_single w150 ml10 mr10"
          v-model="orderOrRequestCode"
          placeholder="调拨单编号"
        ></el-input>
        <el-date-picker
          v-model="value1"
          unlink-panels
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <div class="down fr">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
          <el-button
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
          ></el-button>
          <!--<el-button type="primary" :plain="true" @click="byallocating">发起调拨</el-button>-->
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            @click="byallocating"
          ></el-button>
        </div>
      </div>

      <div class="container_table clearfix" style>
        <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in panelist"
            :key="item.index"
            :label="item.name"
            :name="item.index"
          >
            <ul class="childlist">
              <li class="w13p">产品编号</li>
              <li class="w13p">物料编号</li>
              <li class="w13p">预计到货日期</li>
              <li class="w18p">调拨数量</li>
              <li class="w13p">仓位</li>
              <li class="w18p">库位</li>
              <!--<li class="w13p">确认书编号</li>-->
              <li class="w13p">销售订单编号</li>
              <li class="w13p">备注</li>
              <!--<li class="w13p"></li>-->
            </ul>

            <div class="allparentlist" v-for="(item, index) in requestList" :key="index">
              <ul class="parentlist" @click="showlist(index,item)">
                <li>
                  <span>{{item.createTime}}</span>
                </li>
                <li>
                  <i>
                    调拨单编号:
                    <em>{{item.factoryAllocationCode}}</em>
                  </i>
                </li>
                <li>
                  <i>
                    调拨类型:
                    <em>{{item.allocationTypeName}}</em>
                  </i>
                </li>
                <li>
                  <i>
                    调拨状态:
                    <em title="草稿" v-if="item.allocationStatus=='Draft'">草稿</em>
                    <em title="审批中" v-if="item.allocationStatus=='Approving'">审批中</em>
                    <em title="已完成" v-if="item.allocationStatus=='Approved'">已完成</em>
                  </i>
                </li>
                <li style="float: right; margin-right: 15px;" @click.stop="showlist(index,item)">
                  <i v-if="item.ifshowlist==true" class="el-icon-caret-top"></i>
                  <i v-else class="el-icon-caret-bottom"></i>
                </li>
                <li v-if="item.allocationStatus=='Draft'" style="float: right;">
                  <i class="el-icon-thumb" title="提交审批" @click="draftoutsave(item)"></i>
                </li>
                <li v-if="item.allocationStatus=='Draft'" style="float: right;">
                  <i class="el-icon-delete" title="删除" @click="factorydel(item)"></i>
                </li>
                <li v-if="item.allocationStatus=='Draft'" style="float: right;">
                  <i class="el-icon-edit" title="编辑" @click="factoryupd(item)"></i>
                </li>
              </ul>
              <ul
                class="childcontentlist"
                v-for="(childItem, index) in item.faItemList"
                :key="index"
                v-show="item.ifshowlist==true"
              >
                <li class="w13p" :title="childItem.productCode">{{childItem.productCode}}</li>
                <li class="w13p" :title="childItem.materialCode">{{childItem.materialCode }}</li>
                <li class="w13p" :title="childItem.offeredDate">{{childItem.expectedArrivalDate}}</li>
                <li
                  class="w18p"
                  :title="childItem.allocationPackages +'包  '+childItem.allocationQuantityPerPackage+'米/包  '+childItem.allocationQuantity +'米'"
                >
                  {{childItem.allocationPackages==null?"0":childItem.allocationPackages}}&nbsp;包&nbsp;&nbsp;
                  {{childItem.allocationQuantityPerPackage?childItem.allocationQuantityPerPackage:"0"}}&nbsp;米/包&nbsp;&nbsp;
                  {{childItem.allocationQuantity?childItem.allocationQuantity:"0"}}&nbsp;米
                </li>
                <li class="w13p">{{childItem.virtualInventoryName}}</li>
                <li class="w18p">{{childItem.subInventoryName}}</li>
                <!--<li class="w13p">{{childItem.confirmNumbers}}</li>-->
                <li class="w13p">{{childItem.saleOrderId}}</li>
                <li class="w13p" :title="childItem.remark">{{childItem.remark}}</li>
                <!--<li class="w13p">
						          	<i class="el-icon-delete" title="删除" @click="factorydel(childItem)"></i>
                </li>-->
              </ul>
            </div>
            <p v-if="requestList==''" class="empty_tip">暂无数据</p>
          </el-tab-pane>

          <!--Listgoods received in advance-->
          <el-tab-pane label="预收货清单" name="5">
            <ul class="childlist">
              <li
                :class="item.class"
                v-for="(item, index) in receiptFieldList"
                :key="index"
              >{{item.name}}</li>
            </ul>
            <div class="allparentlist" v-for="(item, index) in receiptList" :key="index">
              <ul class="parentlist" @click="showlist(index, item)">
                <li>
                  <span>{{item.updateTime}}</span>
                </li>
                <li>
                  <i>
                    预收货清单编号:
                    <em>{{item.prepareReceiptCode}}</em>
                  </i>
                </li>
                <li style="float: right; margin-right: 15px;" @click.stop="showlist(index, item)">
                  <i v-if="item.ifshowlist==true" class="el-icon-caret-top"></i>
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
                v-show="item.ifshowlist==true"
              >
                <li class="w13p" :title="childItem.productCode">{{childItem.productCode ? childItem.productCode : '无'}}</li>
                <li
                  class="w13p"
                  :title="childItem.materialCode"
                >{{childItem.materialCode ? childItem.materialCode : '无'}}</li>
                <li
                  class="w13p"
                  :title="childItem.supplierName"
                >{{childItem.supplierName ? childItem.supplierName : '无'}}</li>
                <li class="w13p" :title="childItem.confirmingCode">{{childItem.confirmingCode ? childItem.confirmingCode : '无'}}</li>
                <li class="w13p">{{childItem.factoryAllocationCreateTime ? childItem.factoryAllocationCreateTime : '无'}}</li>
                <li
                  class="w18p"
                  :title="(childItem.transferBagQuantity ? childItem.transferBagQuantity : '0') + '包 ' + (childItem.packSpecification ? childItem.packSpecification : '0') + '米/包 ' + (childItem.transferMeter ? childItem.transferMeter : '0') + '米'"
                >{{(childItem.transferBagQuantity ? childItem.transferBagQuantity : '0') + '包 '}}{{(childItem.packSpecification ? childItem.packSpecification : '0') + '米/包 '}}{{(childItem.transferMeter ? childItem.transferMeter : '0') + '米'}}</li>
                <li class="w13p" :title="childItem.subInventory">{{childItem.subInventory}}</li>
                <li
                  class="w13p"
                  :title="childItem.batchQuantity"
                >{{childItem.batchQuantity ? childItem.batchQuantity : 0}}</li>
                <li
                  class="w13p"
                  :title="childItem.batchNumber"
                >{{childItem.batchNumber ? childItem.batchNumber : '无'}}</li>
              </ul>
            </div>
            <p v-if="!this.receiptList.length" class="empty_tip">暂无数据</p>
          </el-tab-pane>
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
      </div>
    </div>

    <!--新增-->
    <div class="addcontent" v-if="this.ifaddsure==true">
      <div class="addcontent_title" style="display: flex;">
        <i title="返回" class="el-icon-back" style @click="back()">返回</i>
        <div class="type" style="display:inline-block;width: 350px;">
          <span class="red mr5">*</span>
          <span style="margin-right: 10px;">需求来源:</span>
          <select
            v-model.trim="allocationType"
            :class="{disactive:this.ifpulldate!=true}"
            @change="selectclick()"
            :disabled="this.ifpulldate!=true"
            class="selectstatus"
          >
            <option value>--请选择需求来源--</option>
            <option
              v-for="item in typeList"
              :key="item.dictItemValue"
              :value="item.dictItemValue"
              style="color: #606266;"
            >{{item.dictItemName}}</option>
          </select>
          <!--<select style="margin:0 10px;" v-model.trim="suppliertypeid" placeholder="请选择请求类型" class="selectstatus">
					    <option value="">--请选择供应商分类--</option>
					   <option v-for="item in supplierList" :key="item.typeid" :value="item.typeid" style="color: #606266;">{{item.typename}}</option>
          </select>-->
        </div>
        <div class="button" s style="margin:0 10px;">
          <el-button
            size="small"
            type="primary"
            title="拉取数据"
            icon="el-icon-refresh-right"
            @click="pulldata"
            circle
          ></el-button>
          <!--<el-button type="primary" @click="pulldata">拉取数据</el-button>-->
        </div>
        <div class="button" style>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加子项"
            @click="addchildmsg"
          ></el-button>
        </div>
      </div>
      <div class="addcontent_content">
        <ul class="content_form" style="text-align: center;padding:0px 10px;">
          <li style="width: 98px;">
            <span class="red mr5">*</span>产品编号
          </li>
          <li style="width: 145px;">
            <span class="red mr5">*</span>预计到货时间
          </li>
          <li style="width: 345px;">
            <span class="red mr5">*</span>调拨数量
          </li>
          <li style="width: 170px;">需求来源</li>
          <li style="width: 85px;">
            <span class="red mr5">*</span>仓位
          </li>
          <li style="width: 135px;">
            <span class="red mr5">*</span>库位
          </li>
          <li style="width: 115px;">
            <span class="red mr5">*</span>特殊要求
          </li>
          <li style="width:140px;">备注</li>
          <li style="width:70px;">是否可发运</li>
          <li style="width: 42px;">操作</li>
        </ul>
        <div class="formtable" v-if="ifchildshow==true">
          <ul
            v-for="(item,index) in this.purchaseobj.faItemList"
            :key="index"
            class="demo-form-inline"
          >
            <li style="width: 120px;">
              <span v-if="item.iftext==true" :title="item.productCode">{{item.productCode}}</span>
              <el-input
                v-else
                :title="item.productCode"
                onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
                maxlength="10"
                v-model.trim="item.productCode"
                autocomplete="off"
              ></el-input>
            </li>
            <li style="width: 148px;">
              <span
                v-if="item.iftext==true"
                :title="item.expectedArrivalDate"
              >{{item.expectedArrivalDate}}</span>
              <el-date-picker
                v-else
                :title="item.expectedArrivalDate"
                v-model.trim="item.expectedArrivalDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
                :picker-options="pickerOptions0"
              ></el-date-picker>
            </li>

            <li style="width: 365px;">
              <span v-if="item.iftext==true">
                {{item.allocationPackages?item.allocationPackages:"0"}}&nbsp;包&nbsp;&nbsp;
                {{item.allocationQuantityPerPackage?item.allocationQuantityPerPackage:"0"}}&nbsp;米/包&nbsp;&nbsp;
                {{item.allocationQuantity?item.allocationQuantity:"0"}}&nbsp;米
              </span>
              <div id v-else>
                <!--<div id="">-->
                <el-input-number
                  size="mini"
                  :title="item.allocationPackages"
                  v-model.trim="item.allocationPackages"
                  controls-position="right"
                  @change="handleChange"
                  :min="0"
                  step-strictly
                ></el-input-number>
                <span>包</span>
                <!--</div>-->
                <!--<div>-->
                <el-input-number
                  size="mini"
                  :precision="2"
                  :title="item.allocationQuantityPerPackage"
                  v-model.trim="item.allocationQuantityPerPackage"
                  controls-position="right"
                  @change="handleChange"
                  :min="0"
                ></el-input-number>
                <span>米/包</span>
                <!--</div>-->
                <!--<div>-->
                	<em 
                		style="display: inline-flex;" 
                		:title="item.allocationPackages*item.allocationQuantityPerPackage?item.allocationPackages*item.allocationQuantityPerPackage:0" 
                	v-model.trim="item.allocationQuantity=item.allocationPackages*item.allocationQuantityPerPackage"
                		>
                		<i style="max-width: 80px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
                			{{item.allocationPackages*item.allocationQuantityPerPackage?item.allocationPackages*item.allocationQuantityPerPackage:0}}
                		</i>
                	</em>
                
                <!--<el-input-number
                  size="mini"
                  :precision="2"
                  :title="item.allocationQuantity"
                  v-model.trim="item.allocationQuantity "
                  controls-position="right"
                  @change="handleChange"
                  :min="0"
                ></el-input-number>-->
                <span style="margin-left: 0;">米</span>
                <!--</div>-->
              </div>
            </li>
            <li style="width:190px;">{{item.allocationTypeName}}</li>
            <li style="width:85px;">
              <span v-if="item.iftext==true">{{item.virtualInventoryName}}</span>
              <select
                v-else
                style="width:85px;"
                v-model.trim="item.virtualInventoryId"
                placeholder="请选择仓位"
                @change="selectwearclick(item)"
                class="selectstatus"
              >
                <option
                  v-for="i in warehouseList"
                  :key="i.index"
                  :value="i.index"
                  style="color: #606266;"
                >{{i.name}}</option>
              </select>
            </li>
            <li style="width: 135px;">
              <span v-if="item.iftext==true">{{item.subInventoryName}}</span>

              <div id v-else>
                <select
                  v-if="item.ifsubInventory==true"
                  style="width: 135px;"
                  v-model.trim="item.subInventory"
                  placeholder="请选择库位"
                  @change="subinventoryclick(item)"
                  class="selectstatus"
                >
                  <option
                    v-for="item in item.subinventoryList"
                    :key="item.subInventory"
                    :value="item.subInventory"
                    style="color: #606266;"
                  >{{item.subInventoryName}}</option>
                </select>
                <span v-else>{{item.subInventoryName}}</span>
              </div>
            </li>
            <li style="width:115px;">
              <span v-if="item.iftext==true">{{item.specialRequire}}</span>
              <el-input
                v-else
                :title="item.specialRequire"
                v-model.trim="item.specialRequire"
                maxlength="63"
                autocomplete="off"
              ></el-input>
            </li>
            <li style="width:140px;">
              <span v-if="item.iftext==true" :title="item.remark">{{item.remark}}</span>
              <el-input
                v-else
                :title="item.remark"
                v-model.trim="item.remark"
                maxlength="127"
                placeholder="请输入备注"
                autocomplete="off"
              ></el-input>
            </li>
            <li style="width:70px;">
              <span v-if="item.iftext==true">{{item.isTransport==true?"是":"否"}}</span>
              <el-switch
                v-else
                v-model.trim="item.isTransport"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </li>
            <li style="width:42px;">
              <el-button
                type="danger"
                title="删除"
                icon="el-icon-minus"
                circle
                @click="childdel(index,item)"
              ></el-button>
            </li>
          </ul>
        </div>
        <div class="formtable_null" style="text-align: center;margin-top: 15px;" v-else>
          <img src="../../../assets/image/add.png" style="width:200px;height:100px;" />
          <p>
            信息
            空空如也去选择需求来源
          </p>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="float: right;margin-top:45px;margin-right: 20px;"
      >
        <el-button @click="draftsave('save')" :loading="loadingsave" :disabled="ifchildshow!=true">保存为草稿</el-button>
        <el-button type="primary" @click="draftsave('commit')" :loading="loadingcommit" :disabled="ifchildshow!=true">提交审批</el-button>        
    </div>
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
      <span>确定删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>

    <!--外侧提交审批-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogcommitVisible"
      width="30%"
    >
      <span>是否确认提交审批?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogcommitVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibcmtclick()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑预收货清单弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible"
      >
        <div class="display_ib mr10">
          <el-button
            class="mr10"
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
            class="mr10"
            size="small"
            type="primary"
            icon="el-icon-download"
            circle
            title="下载"
            @click="downloadInvoiceHandle"
          ></el-button>
          <span>下载工厂发票</span>
        </div>
        <el-tabs>
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
              <li class="w13p" :title="item.productCode">{{item.productCode ? item.productCode : '无'}}</li>
              <li
                class="w13p"
                :title="item.confirmingCode"
              >{{item.confirmingCode ? item.confirmingCode : '无'}}</li>
              <li
                class="w14p"
                :title="item.batchNumber"
              >{{item.batchNumber ? item.batchNumber : '无'}}</li>
              <li class="w16p" :title="item.transferBagQuantity ? item.transferBagQuantity : 0">{{item.transferBagQuantity ? item.transferBagQuantity : 0}}</li>
              <li
                class="w16p"
                :title="(item.transferBagQuantity ? item.transferBagQuantity : '0') + '包 ' + (item.packSpecification ? item.packSpecification : '0') + '米/包 ' + (item.transferMeter ? item.transferMeter : '0') + '米'"
              >{{(item.transferBagQuantity ? item.transferBagQuantity : '0') + '包 '}}{{(item.packSpecification ? item.packSpecification : '0') + '米/包 '}}{{(item.transferMeter ? item.transferMeter : '0') + '米'}}</li>
              <li class="w16p">{{item.updateTime}}</li>
              <!-- <li class="w6p fr">
                <i v-if="!item.isEdit" type="primary" class="el-icon-edit mr10" title="修改" @click="editReceiptConfirmItem(index, item)"></i>
                <el-button v-else size="mini" type="primary" @click="editConfirmItem(item.id)">确认</el-button>
              </li>-->
            </ul>
          </div>
          <div class="btn_wrap">
            <span class="add_btn">新增预收货清单记录</span>
            <span class="edit_btn" @click="batchEditHandle">
              <i type="primary" class="el-icon-circle-plus" title="" style="margin-right: 10px; vertical-align: middle;"></i>批量编辑
            </span>
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
                <li class="w15p" :title="item.productCode">{{item.productCode ? item.productCode : '无'}}</li>
                <li class="w15p" :title="item.batchNumber">{{item.confirmingCode ? item.confirmingCode : '无'}}</li>
                <li class="w16p">
                  <el-input
                    :ref="'batchNumInput' + item.id"
                    class="input_single"
                    placeholder="批次号"
                    v-model="item.batchNumber"
                  ></el-input>
                </li>
                <!-- <li class="w18p">{{item.transferBagQuantity}}</li> -->
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
  name: "factoryorder",
  components: {
    //	receivingnote
  },
  data() {
    return {
    	loadingsave:false,
      loadingcommit:false,
      size: "",
      allpage: 0,
      currentPage: 1, //页数
      pageSize: 10, //每页显示多少条
      activeName: "1",
      typestatusid: "",
      purchaseType: '', //预收货清单请求类型
      orderOrRequestCode: "",
      ifaddsure: false,
      ifchildshow: false,
      ifpulldate: false,
      dialogdelVisible: false,
      dialogcommitVisible: false,
      delid: "",
      allocationStatus: "",
      purchasetypeid: "",
      suppliertypeid: "",
      allocationType: "",
      value1: "",
      starttime: "",
      endtime: "",
      prStatus: "",
      purchasetypeid: "",
      suppliertypeid: "",
      allocationType: "",
      requestList: [],
      dialogFormVisible: false,
      endTime: "",
      prepareReceiptCode: "",
      startTime: "",
      supplierCode: "",
      supplierName: "",
      uuid: "",
      receiptList: [],
      confirmReceiptList: [],
      editReceiptList: [],
      popupTitle: "",
      factoryAllocationCode: "",
      factoryInvoice: "",
      packingList: "",
      warehouseList: [],
      isShowAdd: true,
      batchEditDisabled: false,
      typeList: [
        {
          typeid: "BusinessAttire",
          typename: "职业装"
        },
        {
          typeid: "ZeroShear",
          typename: "零剪"
        }
      ],
      supplierList: [
        {
          typeid: "1",
          typename: "供应商"
        },
        {
          typeid: "2",
          typename: "SVBC"
        },
        {
          typeid: "3",
          typename: "ETHOMAS"
        }
      ],
      typelocation: [
        {
          typeid: "1",
          typename: "零剪现货库"
        },
        {
          typeid: "2",
          typename: "职业装现货库"
        },
        {
          typeid: "3",
          typename: "零剪非现货库"
        },
        {
          typeid: "4",
          typename: "以销定采库"
        }
      ],
      panelist: [
        {
          index: "1",
          name: "订单列表"
        },
        {
          index: "2",
          name: "草稿"
        },
        {
          index: "3",
          name: "审批中"
        },
        {
          index: "4",
          name: "已审批"
        }
      ],
      receiptFieldList: [
        {
          name: "产品编号",
          class: "w13p"
        },
        {
          name: "物料编号",
          class: "w13p"
        },
        {
          name: "供应商名称",
          class: "w13p"
        },
        {
          name: "确认书号",
          class: "w13p"
        },
        {
          name: "调拨时间",
          class: "w13p"
        },
        {
          name: "调拨数量",
          class: "w18p"
        },
        {
          name: "库位",
          class: "w13p"
        },
        {
          name: "批次发货数量",
          class: "w13p"
        },
        {
          name: "批次号",
          class: "w13p"
        }
      ],
      popupFieldNameList: [
        {
          name: "产品编号",
          class: "w13p"
        },
        {
          name: "确认书号",
          class: "w13p"
        },
        {
          name: "批次号",
          class: "w14p"
        },
        {
          name: "包数",
          class: "w16p"
        },
        {
          name: "调拨数量",
          class: "w16p"
        },
        {
          name: "编辑时间",
          class: "w16p"
        }
      ],
      editFieldNameList: [
        {
          name: "产品编号",
          class: "w15p",
          isRules: false
        },
        {
          name: "确认书号",
          class: "w15p",
          isRules: false
        },
        {
          name: "批次号",
          class: "w16p",
          isRules: true
        },
        // {
        //   name: "批次发货数量",
        //   class: "w18p",
        //   isRules: false
        // }
      ],
      purchaseobj: {
        uuid: "",
        allocationType: "",
        submitType: "",
        allocationTypeName: "",
        faItemList: []
      },
      faItemList: [
        {
          allocationPackages: 10,
          allocationQuantity: 20,
          allocationQuantityPerPackage: 11,
          expectedArrivalDate: "2019-12-24",
          productCode: "1010034",
          remark: "这是测试数据啊",
          requiredPackages: 10,
          requiredQuantity: 20,
          requiredQuantityPerPackage: 11,
          sosourceOfDemand: 6,
          allocationTypeName: "备货采购-工装-纱线",
          specialRequire: "adasdsaff",
          isTransport: true,
          subInventory: "3",
          supplierName: "2",
          uuid: "913494406706320799201912190122506701000011"
        },
        {
          allocationPackages: 22,
          allocationQuantity: 13,
          allocationQuantityPerPackage: 11,
          expectedArrivalDate: "2019-12-30",
          productCode: "1010036",
          remark: "这是测试数据啊",
          requiredPackages: 22,
          requiredQuantity: 13,
          requiredQuantityPerPackage: 11,
          sourceOfDemand: 6,
          allocationTypeName: "备货采购-工装-纱线",
          specialRequire: "发多少",
          isTransport: false,
          subInventory: "3",
          supplierName: "2",
          uuid: "913494437349790143201912190127031731000013"
        }
      ],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    };
  },
  created() {},
  mounted() {
    this.factoryorderlist();
    this.requestType();
    this.getPrepareReceiptList();
    this.warehouseType();
  },
  watch: {},
  methods: {
    addItemHandle() {
      // 新增预收货清单记录
    },
    batchEditHandle() {
      // 批量编辑
      console.log('批量编辑数据：', this.confirmReceiptList);
      // let self = this;
      // for (var i = 0; i < this.editReceiptList.length; i++) {
      //   let $input = self.$refs['batchNumInput' + this.editReceiptList[i].id];
      //   for (var j = 0; j < $input.length; j++) {
      //     $input[j].$refs.input.focus();
      //   }
      // }
      if (!this.batchEditDisabled) {
        for (var i = 0; i < this.confirmReceiptList.length; i++) {
          if (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1 <= 0) {
            this.$message({
              message: "已超出编辑数量!",
              type: "error"
            });
            return false;
          }
          let count = (this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1) < 0 ? 0 : this.confirmReceiptList[i].transferBagQuantity - this.confirmReceiptList[i].batchQuantity - 1;
          for (var j = 0; j < count; j++) {
            console.log('j: ', j);
            let packItem = JSON.parse(JSON.stringify(this.confirmReceiptList[i]));
            console.log('批量packItem：', packItem);
            packItem.isChildPack = true;
            packItem.batchNumber = '';
            this.editReceiptList.splice(i + 1, 0, packItem);
            this.batchEditDisabled = true;
            this.isShowAdd = false;
          }
        }
      }
    },
    async editInfoHandle(index, item) {
      // 编辑预收货清单
      console.log(item);
      this.batchEditDisabled = false;
      this.isShowAdd = true;
      this.editReceiptList = [];
      this.factoryInvoice = item.factoryInvoice;
      this.packingList = item.packingList;
      let searchData = {
        prepareReceiptCode: item.prepareReceiptCode,
        factoryAllocationCode: this.orderOrRequestCode,
        typestatusid: this.typestatusid
      };
      await searchPrepareReceiptItem(searchData).then(res => {
        console.log("查询预收货清单列表：", res);
        if (res.code == "0") {
          res.data.forEach(item => {
            item.addPackNum = 0;
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = "空";
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
      this.popupTitle = "预收货清单DIA0000001汇总信息";
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
      // 搜索
      if (this.value1 != null && this.value1 != "") {
        this.starttime = this.value1[0];
        this.endtime = this.value1[1];
      } else {
        this.starttime = "";
        this.endtime = "";
      }
      this.factoryorderlist();
    },
    receiptSearchHandle() {
      // 预收货清单搜索
      console.log(this.factoryAllocationCode);
      this.getPrepareReceiptList();
    },
    uploadHandle() {
      // 上传
    },
    receiptUploadHandle() {
      // 预收货清单上传
    },
    downloadHandle() {
      // 下载
    },
    downloadPackingHandle() {
      // 下载发票和预收货清单
      // downloadInvoicePackingFile(Number(this.packingList)).then(res => {
      //   console.log(res);
      // });
      let id = Number(this.packingList);
      window.open(process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/downloadById?id=${id}`);
    },
    downloadInvoiceHandle() {
      // 下载发票和预收货清单
      // downloadInvoicePackingFile(Number(this.factoryInvoice)).then(res => {
      //   console.log(res);
      // });
      let id = Number(this.factoryInvoice);
      window.open(process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/downloadById?id=${id}`);
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
          this.typeList = response.data;
        }
      });
    },
    //发起调拨
    byallocating() {},
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
      let list = [];
      let searchData = {
        prepareReceiptCode: item.prepareReceiptCode,
        factoryAllocationCode: this.orderOrRequestCode,
        typestatusid: this.typestatusid
      };
      item.batchQuantity = item.transferBagQuantity;
      list.push(item);
      console.log('结合结合或或或：', list);
      editPrepareReceiptItem(list).then(res => {
        console.log("确认编辑批次号完成：", res);
        if (res.code == "0") {
          this.getEditReceiptList(searchData);
          this.editReceiptList.splice(index, 1);
          console.log("editReceiptList后: ", this.editReceiptList);
        }
      });
    },
    //仓位
    warehouseType() {
      warehousequesttype().then(response => {
        if (response.code === "0") {
          this.warehouseList = response.data;
        }
      });
    },
    //库位
    selectwearclick(item) {
      console.log(item);
      for (var j = 0; j < this.warehouseList.length; j++) {
        var data = this.warehouseList[j];
        if (item.virtualInventoryId == data.index) {
          item.virtualInventoryName = data.name;
        }
      }
      subinventoryquesttype(item.virtualInventoryId).then(response => {
        if (response.code === "0") {
          item.subinventoryList = response.data;
          item.subInventory='';
          item.ifsubInventory = true;
          console.log(item);
          this.$forceUpdate();
        }
      });
    },
    subinventoryclick(item) {
      console.log(item);
      for (var j = 0; j < item.subinventoryList.length; j++) {
        var data = item.subinventoryList[j];
        if (item.subInventory == data.subInventory) {
          item.subInventoryName = data.subInventoryName;
        }
      }
    },
    //订单列表展示
    factoryorderlist() {
      let data = {
        // poIdOrPrCode: this.orderOrRequestCode,
        // orderStatus: 3,
        allocationStatus: this.allocationStatus,
        factoryAllocationCode: this.orderOrRequestCode,
        allocationType: this.typestatusid,
        startTime: this.starttime,
        endTime: this.endtime
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      factorySerch(this.currentPage,this.pageSize, data).then(res => {
        if (res.code == "0") {
          this.allpage = res.data.total;
          this.requestList = res.data.records;
          this.requestList.forEach((item, index) => {
//          item.updateTime = item.updateTime.substring(0, 10);
            item.createTime=timeFormat(item.createTime);
            item.faItemList.forEach((i, index) => {
              if (i.updateTime) {
                i.createTime = i.createTime.substring(0, 10);
              } else {
                i.createTime = "空";
              }
            });
          });
          loading.close();
        } else {
          loading.close();
        }
      });
      setTimeout(() => {
        loading.close();
      }, 10000);
    },
    showlist(index, item) {
      item.ifshowlist = !item.ifshowlist;
      this.$forceUpdate();
    },
    selectclick() {
      console.log(this.purchaseobj.faItemList);
      for (var j = 0; j < this.typeList.length; j++) {
        var data = this.typeList[j];
        if (this.allocationType == data.dictItemValue) {
          for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
            var item = this.purchaseobj.faItemList[i];
            item.allocationTypeName = data.dictItemName;
          }
        }
      }
    },
    //添加
    byallocating() {
      console.log("发起调拨添加");
      this.allocationType = "";
      this.suppliertypeid = "";
      this.purchasetypeid = "";
      this.purchaseobj.faItemList = [];
      this.ifaddsure = true;
      this.ifchildshow = false;
      this.ifpulldate = true;
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          this.purchaseobj.uuid = response.data;
        }
      });
    },
    //新增子项信息
    addchildmsg() {
      console.log(this.allocationType);
      this.ifchildshow = true;
      var addobj = {
        productCode: "",
        remark: "",
        uuid: "",
        allocationPackages: "",
        allocationQuantityPerPackage: "",
        allocationQuantity: "",
        expectedArrivalDate: "",
        subInventory: "",
        sourceOfDemand: "",
        supplierName: "",
        iftext: false,
        allocationTypeName: "",
        isTransport: false,
        ifsubInventory: false,
        specialRequire: "",
        subinventoryList: [],
        virtualInventoryId: "",
        virtualInventoryName: "",
        subInventoryName: ""
      };
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          addobj.uuid = response.data;
        }
      });
      this.purchaseobj.faItemList.push(addobj);
      for (var j = 0; j < this.typeList.length; j++) {
        var data = this.typeList[j];
        if (this.allocationType == data.dictItemValue) {
          for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
            var item = this.purchaseobj.faItemList[i];
            item.allocationTypeName = data.dictItemName;
          }
        }
      }
    },
    //删除
    factorydel(item) {
      this.dialogdelVisible = true;
      this.delid = item.id;
    },
    delVisibleclick() {
      factorychilddel(this.delid).then(response => {
        if (response.code === "0") {
          this.dialogdelVisible = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.factoryorderlist();
        }
      });
    },
    //删除
    childdel(index, item) {
      if (this.purchaseobj.faItemList.length > 1) {
        this.purchaseobj.faItemList.splice(index, 1);
      } else {
        this.ifchildshow = false;
        this.purchaseobj.faItemList = [];
      }
    },
    //外侧提交审批
    draftoutsave(item) {
      this.dialogcommitVisible = true;
      factorychildshow(item.id).then(response => {
        if (response.code === "0") {
          this.purchaseobj.faItemList = response.data.faItemList;
          this.purchaseobj.allocationType = response.data.allocationType;
          this.purchaseobj.allocationTypeName = response.data.allocationTypeName;
          this.purchaseobj.submitType = 2;
          this.purchaseobj.uuid = response.data.uuid;
          console.log(this.purchaseobj);
        }
      });
    },
    //外侧提交审批确定
    delVisibcmtclick() {
      console.log(this.purchaseobj);
      factorychildadd(this.purchaseobj).then(response => {
        if (response.code === "0") {
          this.dialogcommitVisible = false;
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.allocationStatus = "Approving";
          this.orderOrRequestCode = "";
          this.activeName = "3";
          this.factoryorderlist();
        }
      });
    },
    //编辑
    factoryupd(item) {
      console.log(item);
      factorychildshow(item.id).then(response => {
        if (response.code === "0") {
          this.ifaddsure = true;
          this.ifchildshow = true;
          this.ifpulldate = false;
          this.purchaseobj.faItemList = response.data.faItemList;
          this.allocationType = response.data.allocationType;
          console.log(this.allocationType);
          this.purchaseobj.uuid = response.data.uuid;
        }
      });
    },
    back() {
      this.ifaddsure = false;
    },
    //点击下拉框拉取数据
    pulldata() {
      if (this.allocationType != "") {
        if (this.faItemList.length > 1) {
          this.ifchildshow = true;
          for (var i = 0; i < this.faItemList.length; i++) {
            let item = this.faItemList[i];
            item.iftext = true;
            console.log(this.faItemList.length);
            this.purchaseobj.faItemList.push(item);
          }
        }
        var uniquelist = this.unique(this.purchaseobj.faItemList);
        console.log(uniquelist);
        this.purchaseobj.faItemList = uniquelist;
        this.$forceUpdate();
      } else {
        this.$message({
          message: "请选择请求类型再拉取！！",
          type: "error"
        });
      }
    },
    //去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    //修改保存（生成草稿）
    draftsave(tag) {
      console.log(this.purchaseobj);
      this.purchaseobj.allocationType = this.allocationType;
      for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
        var item = this.purchaseobj.faItemList[i];
        if (
          item.productCode == "" ||
          isNaN(item.productCode) == true ||
          item.expectedArrivalDate == "" ||
          item.expectedArrivalDate == null ||
          item.allocationPackages == "" ||
          item.allocationPackages == undefined ||
          item.allocationQuantityPerPackage == "" ||
          item.allocationQuantityPerPackage == undefined ||
          item.allocationQuantity == "" ||
          item.allocationQuantity == undefined ||
          item.virtualInventoryId == "" ||
          item.subInventory == "" ||
          item.specialRequire == ""
        ) {
          this.nullboolean = false;
          break;
        } else {
          this.nullboolean = true;
        }
      }

      for (var j = 0; j < this.typeList.length; j++) {
        var data = this.typeList[j];
        if (this.purchaseobj.allocationType == data.dictItemValue) {
          this.purchaseobj.allocationTypeName = data.dictItemName;
        }
      }
      if (this.nullboolean == false || this.purchaseobj.allocationType == "") {
        this.$message({
          message: "必填项和需求来源不能为空!!",
          type: "error"
        });
      } else {
        if (tag == "save") {
        	this.loadingsave=true;
          this.purchaseobj.submitType = 1;
          this.orderOrRequestCode = "";
          this.allocationStatus = "Draft";
          this.activeName = "2";
        } else {
        	this.loadingcommit=true;
          this.purchaseobj.submitType = 2;
          this.orderOrRequestCode = "";
          this.allocationStatus = "Approving";
          this.activeName = "3";
        }
        factorychildadd(this.purchaseobj).then(response => {
          if (response.code === "0") {
            this.ifaddsure = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
            this.loadingsave=false;
					  this.loadingcommit=false;
            this.factoryorderlist();
          }
          setTimeout(() => {
						this.loadingsave=false;
						this.loadingcommit=false;
					}, 10000);
        });
      }
    },
    handleClick(tab, event) {
      console.log(tab);
      switch (tab.name) {
        case '1':
          this.allocationStatus = "";
          this.factoryorderlist();
          break;
        case '2':
          this.allocationStatus = "Draft";
          this.factoryorderlist();
          break;
        case '3':
          this.allocationStatus = "Approving";
          this.factoryorderlist();
          break;
        case '4':
          this.allocationStatus = "Approved";
          this.factoryorderlist();
          break;
        case '5':
          this.getPrepareReceiptList();
          break;
        default:
          break;
      }
    },
    //加减输入框触发
    handleChange(value) {
      console.log(this.purchaseobj.faItemList);
      if(value==undefined){
    		this.$message({
	          message: '数值不能为空,请重新输入！！！',
	          type: 'error'
	        });
    	}else{
	      for (var i = 0; i < this.purchaseobj.faItemList.length; i++) {
	        let data = this.purchaseobj.faItemList[i];
	        if (data.allocationPackages.toString().length > 9) {
	          this.$message({
	            message: "超长字符,请重新输入！",
	            type: "error"
	          });
	          data.allocationPackages = "";
	        } else if (data.allocationQuantityPerPackage.toString().length >9) {
	          this.$message({
	            message: "超长字符,请重新输入！",
	            type: "error"
	          });
	          data.allocationQuantityPerPackage = "";
	        } 
	      }
	    }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      switch (this.activeName) {
        case '5':
          this.getPrepareReceiptList();
          break;
        default:
          this.factoryorderlist();
          break;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      switch (this.activeName) {
        case '5':
          this.getPrepareReceiptList();
          break;
        default:
          this.factoryorderlist();
          break;
      }
    },
    getPrepareReceiptList() {
      // 已生成预收货清单列表
      let data = {
        factoryAllocationCode: this.factoryAllocationCode,
        purchaseType: this.purchaseType
      };
      gylPrepareReceiptList(this.currentPage, this.pageSize, data).then(res => {
        console.log("已生成预收货列表：", res);
        if (res.code == "0") {
          this.receiptList = res.data.records;
          this.allpage = res.data.total;
          this.receiptList.forEach((item, index) => {
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = "空";
            }
          });
        }
      });
    },
    getEditReceiptList(data) {
      // 查询预收货清单列表
      this.confirmReceiptList = [];
      searchPrepareReceiptItem(data).then(res => {
        console.log("查询预收货清单列表：", res);
        if (res.code == "0") {
          this.confirmReceiptList = res.data;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.factoryorder {
  border-radius: 6px;
  padding: 10px 0px;
  background: #ffffff;
}
.container_title {
  height: 40px;
  margin: 10px 0;
}
ul.parentlist{
	cursor: pointer;
}
.popup_part {
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
    margin-top: 30px;
    margin-bottom: 15px;
  }
  .add_warp {
    .childcontentlist {
      line-height: 40px;
    }
  }
  i.el-icon-circle-plus {
    font-size: 28px;
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
.addcontent {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 15px;
  overflow: hidden;
  overflow-x: auto;
}
.addcontent_title {
  i.el-icon-back {
    font-size: 16px;
    margin: 10px 20px 0 0;
    cursor: pointer;
    color: #409eff;
    font-weight: bold;
  }
}
.addcontent_content ul {
  height: 40px;
  min-width: 1560px;
  background: #cecece;
  margin-top: 10px;
  border-radius: 4px;
  li {
    padding: 10px 10px;
    font-size: 14px;
    color: #606266;
  }
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
    display: flex;
    height: auto;
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
        /*width: 160px;*/
        width: 148px;
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
    li:nth-child(3) {
      min-width: 135px;

      div {
        padding-left: 5px;
        margin-bottom: 5px;
      }
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}
select.selectstatus {
  width: 200px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  cursor: pointer;
  font-size: 14px;
}
.formtable {
  ul.demo-form-inline {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 10px;
    display: flex;
    height: auto;
    text-align: center;
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
        /*width: 160px;*/
        width: 148px;
      }
      .el-select {
        width: 145px;
      }
      .el-switch {
        padding-top: 10px;
      }
    }
    li:first-child {
      padding: 0px 0;
    }
    li:nth-child(3),
    li:nth-child(4) {
      padding: 0px 0;
    }
    li:nth-child(4) {
      cursor: not-allowed;
    }
    li:nth-child(3) {
      min-width: 135px;

      div {
        padding-left: 5px;
        margin-bottom: 5px;
      }
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}

select.selectstatus > option {
  cursor: pointer;
  font-size: 14px;
}
select.selectstatus {
  background: #ffffff;
}

i.el-icon-circle-plus {
  font-size: 30px;
  color: #409eff;
  cursor: pointer;
}
select.selectstatus.disactive {
  cursor: not-allowed;
}
</style>
<style>
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
</style>