<template>
  <div class="container fabricMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">产品品牌：</span>
            <!-- <el-input class="input_single w200 mr10" v-model.trim="brand" placeholder="请输入"></el-input> -->
            <el-select class="select_single w200 mr10" v-model.trim="brand" @change="getPurchaseOrderList" placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option v-for="item in productCodetypelist" :key="item.dictItemValue" :value="item.dictItemValue" :label="item.dictItemName"></el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="productCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品特性：</span>
            <el-select  class="select_single w200 mr10"
              v-model="season"
              @change="getPurchaseOrderList"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in seasontypelist"
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
        </div>
        
        <!-- <el-input class="input_single w200 mr10 mb10" v-model.trim="brand" placeholder="产品品牌"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model.trim="productCode" placeholder="产品编号"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="物料编号"></el-input> -->
        <!-- <el-select v-model="season" placeholder="请选择产品特性">
        	<el-option key="" label="请选择产品特性" value=""></el-option>
				    <el-option
				      v-for="item in this.seasontypelist"
				      :key="item.index"
				      :label="item.name"
				      :value="item.index">
				    </el-option>
				</el-select> -->
        <div class="actions_btn_wrap down t_right">
          <el-button type="primary" class="mr10" @click="exportHandle" v-preventReClick :disabled="this.isLoadingExport">导出</el-button>
          <el-upload :headers="myHeaders" class="upload-demo inline_block mr10" :action="this.uploadurlProduct"  accept=".xlsx" 
            :before-upload="beforeupload" :show-file-list="showfilelist" :data="{'businessType':'Group'}" :on-success="UploadSuccess">
            <el-button type="primary" @click="importHandle" :disabled="this.isLoadingImport">导入</el-button>
          </el-upload>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            circle
            title="添加"
            @click="addHandle"
          ></el-button>
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" >

          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in orderList"
              :key="index">
              <li class="w9p">{{item.id}}</li>
              <li class="w9p" :title="item.interiorCode">{{item.interiorCode}}</li>
              <li class="w9p" :title="item.productCode">{{item.productCode}}</li>
              <li class="w9p" :title="item.productName">{{item.productName}}</li>
              <li class="w9p" :title="item.materialCode">{{item.materialCode}}</li>
              <li class="w9p" :title="item.brand">{{item.brand}}</li>
              <li class="w9p" :title="item.seasonname">{{item.seasonname}}</li>
              <li class="w9p" :title="item.productComposition">{{item.productComposition}}</li>
              <li class="w9p" :title="item.productClassname">{{item.productClassname}}</li>
              <li class="w5p" :title="item.productStatusname">{{item.productStatusname}}</li>
              <li class="w14p">
                <i type="primary" class="el-icon-edit" title="修改" @click="editHandle(item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(item)"></i>
                <i type="primary" class="el-icon-document-copy" title="克隆" @click="cloneHandle(item)"></i>
                <i type="primary" class="el-icon-document" title="查看" @click="checkHandle(item)"></i>
              </li>
            </ul>
          </div> -->
          <singleTable
          :tableList='orderList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteHandle'
          @editHandle='editHandle'
          @cloneHandle='cloneHandle'
          @checkHandle='checkHandle'
          ></singleTable>
        </el-tabs>
        <!-- <p v-if="this.orderList==''" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
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
    <div class="form_part clearfix" v-else>
      <div v-if="actionsType == 'check'">
        <fabricMaintainCheck :list="ruleForm" :uploadFileList="uploadFileList" @cancelHandle="resetForm"></fabricMaintainCheck>
      </div>
      <div v-else>
        <div class="base_wrap clearfix">
          <h2 class="title">产品基本信息</h2>
          <el-form :inline="true"  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-form-inline">
             <el-form-item label="产品编号">
                <!-- @change="hasRepeatProductClick(ruleForm)" prop="productCode" -->
              <el-input @change="hasRepeatProductClick(ruleForm)"  @keyup.native="onkeyupProductCode($event)"  v-model.trim="ruleForm.productCode"></el-input>
            </el-form-item> 
            <el-form-item label="系统编号">
              <span>{{ruleForm.interiorCode}}</span>
            </el-form-item>
            <el-form-item label="产品条形码">
              <!-- @change="hasRepeatProductBarcodeClick(ruleForm)  prop="productBarcode"" -->
              <el-input @change="hasRepeatProductBarcodeClick(ruleForm)" @keyup.native="onkeyupProductBarcode($event)"  v-model.trim="ruleForm.productBarcode"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model.trim="ruleForm.productName"></el-input>
            </el-form-item>
            <!-- :disabled="isEditor" -->
            <el-form-item label="物料编号" prop="materialCode"> 
               <!-- @change="hasRepeatMeterialClick(ruleForm)" -->
              <el-input @change="hasRepeatMeterialClick(ruleForm)" @keyup.native="onkeyupMaterialCode($event)" v-model.trim="ruleForm.materialCode"></el-input>
            </el-form-item>
            <el-form-item label="产品描述">
              <el-input v-model.trim="ruleForm.specification"></el-input>
            </el-form-item>
            <el-form-item label="业务分类" prop="businessType">
               <el-select  v-model.trim="ruleForm.businessType"  placeholder="请选择">
                  <el-option v-for="item in this.busiCategorytypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="产品品牌" prop="brand">
              <!-- <el-input v-model.trim="ruleForm.brand"></el-input> -->
              <el-select  v-model.trim="ruleForm.brand" placeholder="请选择">
                <el-option v-for="item in productCodetypelist" :key="item.dictItemValue" :value="item.dictItemValue" :label="item.dictItemName"></el-option>
              </el-select>
            </el-form-item>
           
            <el-form-item label="产品成分" prop="productComposition">
              <el-input v-model.trim="ruleForm.productComposition"></el-input>
            </el-form-item> 
             <el-form-item label="产品分类" prop="productClass">
              <el-select  v-model.trim="ruleForm.productClass"  placeholder="请选择">
                  <el-option v-for="item in this.ProductClasstypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>   
             <el-form-item label="产品系列">
              <el-input v-model.trim="ruleForm.productSeries"></el-input>
            </el-form-item>  
            <el-form-item label="品类" prop="category">
              <el-select  v-model.trim="ruleForm.category"  placeholder="请选择">
                  <el-option v-for="item in this.categorytypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>   
            <el-form-item label="产品特性"  prop="season">
              <el-select  v-model.trim="ruleForm.season"  placeholder="请选择">
                  <el-option v-for="item in this.seasontypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="产品区分">
              <el-select  v-model.trim="ruleForm.productDistinguish"  placeholder="请选择">
                  <el-option v-for="item in this.distinguishtypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="销售计量单位" prop="saleMeasurementUnit">
               <el-select  v-model.trim="ruleForm.saleMeasurementUnit"  placeholder="请选择">
                  <el-option v-for="item in this.SaleUnittypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="时尚度">          	
              <el-select  v-model.trim="ruleForm.fashion"  placeholder="请选择">
                  <el-option v-for="item in this.ProductFashionDegreetypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>  
            <el-form-item label="延米克重" required>
              <!-- <el-input v-model.trim="ruleForm.weightPerMeter"  @keyup.native="ruleForm.weightPerMeter=oninput(ruleForm.weightPerMeter)" @change="ruleForm.weightPerMeter=oninput(ruleForm.weightPerMeter)"></el-input>&nbsp;&nbsp;克 -->
              <el-form-item class="limit">
                   <el-input class="w85 unlimit" v-model.trim="ruleForm.weightPerMeterOne"  @keyup.native="ruleForm.weightPerMeterOne=oninput(ruleForm.weightPerMeterOne)" @change="ruleForm.weightPerMeterOne=oninput(ruleForm.weightPerMeterOne)"></el-input>
              </el-form-item>
              <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <el-form-item class="limit">
                  <el-input class="w85 unlimit" v-model.trim="ruleForm.weightPerMeterTwo"  @keyup.native="ruleForm.weightPerMeterTwo=oninput(ruleForm.weightPerMeterTwo)" @change="ruleForm.weightPerMeterTwo=oninput(ruleForm.weightPerMeterTwo)"></el-input>
              </el-form-item>
              &nbsp;&nbsp;克
               <span class="red note">注:区间值填写两个值,固定值任意填写一个文本框即可</span>
            </el-form-item>
            <el-form-item label="销售季" prop="saleSeasou">
              <el-select  v-model.trim="ruleForm.saleSeasou"  placeholder="请选择">
                  <el-option v-for="item in this.SaleSeasoutypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item> 
             <el-form-item label="每平米克重">
              <el-input v-model.trim="ruleForm.weightPerSquareMeter" maxlength="12"  @keyup.native="ruleForm.weightPerSquareMeter=oninput(ruleForm.weightPerSquareMeter)" @change="ruleForm.weightPerSquareMeter=oninput(ruleForm.weightPerSquareMeter)"></el-input>&nbsp;&nbsp;克
            </el-form-item>
            <el-form-item label="颜色">
              <el-select  v-model.trim="ruleForm.color"  placeholder="请选择">
                  <el-option v-for="item in this.colortypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>  
            <el-form-item label="每个销售单位的物料数量">
              <el-input v-model.trim="ruleForm.numbersPerMeasurementUnit" maxlength="12"  @keyup.native="ruleForm.numbersPerMeasurementUnit=oninput(ruleForm.numbersPerMeasurementUnit)" @change="ruleForm.numbersPerMeasurementUnit=oninput(ruleForm.numbersPerMeasurementUnit)"></el-input>&nbsp;&nbsp;
            </el-form-item>
            <el-form-item label="花型">
               <el-select  v-model.trim="ruleForm.pattern"  placeholder="请选择">
                  <el-option v-for="item in this.patterntypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="幅宽">
              <!-- <el-input v-model.trim="ruleForm.width"  @keyup.native="ruleForm.width=oninput(ruleForm.width)" @change="ruleForm.width=oninput(ruleForm.width)"></el-input>&nbsp;&nbsp; -->
              <el-form-item class="limit">
                   <el-input class="w85 unlimit" v-model.trim="ruleForm.widthStart"  @keyup.native="ruleForm.widthStart=oninput(ruleForm.widthStart)" @change="ruleForm.widthStart=oninput(ruleForm.widthStart)"></el-input>
              </el-form-item>
              <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
              <el-form-item class="limit">
                  <el-input class="w85 unlimit" v-model.trim="ruleForm.widthEnd"  @keyup.native="ruleForm.widthEnd=oninput(ruleForm.widthEnd)" @change="ruleForm.widthEnd=oninput(ruleForm.widthEnd)"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="产地" prop="placeOfProduction">
              <!-- placeProductiontypelist -->
              <el-select  v-model.trim="ruleForm.placeOfProduction"  placeholder="请选择">
                  <el-option v-for="item in this.placeProductiontypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
              <!-- <el-input v-model.trim="ruleForm.placeOfProduction"></el-input> -->
            </el-form-item>
            <el-form-item label="纱支" prop="yarnCount">
              <el-input v-model.trim="ruleForm.yarnCount"></el-input>
            </el-form-item>
            <el-form-item label="上市日期" prop="validDate">
               <el-date-picker
                    v-model.trim="ruleForm.validDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
             <el-form-item label="最小起订量">
              <el-input v-model.trim="ruleForm.minOrder" maxlength="11"  @keyup.native="ruleForm.minOrder=oninput(ruleForm.minOrder)" @change="ruleForm.minOrder=oninput(ruleForm.minOrder)"></el-input>&nbsp;&nbsp;米
            </el-form-item>  
            <el-form-item label="生命周期" prop="invalidDate">
               <el-date-picker
                    v-model.trim="ruleForm.invalidDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="替代品" prop="substitute">
              <el-input v-model.trim="ruleForm.substitute"></el-input>
            </el-form-item>
             <!-- <el-form-item label="推荐品" prop="suggestion">
               <el-select  v-model.trim="ruleForm.suggestion"  placeholder="">
                  <el-option v-for="i in this.ifStylelist"  :key="i.ifbatch" :value="i.ifbatch" :label="i.name"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="坯布编号" prop="rawFabricId">
              <el-input v-model.trim="ruleForm.rawFabricId"></el-input>
            </el-form-item>
            <el-form-item label="团购推荐指数">
              <el-select  v-model.trim="ruleForm.suggestIndex"  placeholder="请选择">
                  <el-option v-for="item in this.suggestIndexTypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
              </el-select>
            </el-form-item>      
 
            <el-form-item label="产品状态" prop="productStatus">
               <el-select  v-model.trim="ruleForm.productStatus"  placeholder="请选择">
                  <el-option v-for="item in this.statustypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
           

            <h2 class="title">面料产品图文信息</h2>
            <el-form-item label="缩略图" prop="thumbImg" class="photo">
              <el-upload
                :headers="headers"
                :action="uploadUrl + '/infrastructure/v1/attachments/upload'"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUploadUpload"
                list-type="picture-card"
                :limit="10"
                :on-exceed="handleExceed"
                :file-list="uploadFileList"
                :data="{uuid: ruleForm.uuid, type: fileType}"
                :auto-upload="true">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleUploadRemove(file,uploadFileList,index)">
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                  <div slot="tip" class="el-upload__tip">支持扩展名：jpg、png、gif、jpeg</div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="面料产品详细信息" prop="remarks" class="last">
              <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 4}"
                placeholder="多行输入"
                v-model="ruleForm.remarks"
                maxlength="1000"
                show-word-limit>
              </el-input>
            </el-form-item>
            
          </el-form>
        </div>
        <div class="mt20 fr">
          <el-button class="mr10" @click="resetForm()">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="this.loadingcommit" v-preventReClick>保存</el-button>
        </div>
      </div>
    </div>
    
    <!--删除-->
		<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
			<span>确定删除该条面料产品数据?</span>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogdelVisible = false">取 消</el-button>
		    <el-button type="primary"  @click="delVisibleclick()" v-preventReClick>确 定</el-button>
		  </span>
		</el-dialog>
    
  </div>
</template>

<script>
import {postpermission,exportProductFile} from "@/api/accessPermission.js";
import { 
	productMasterDataList,
	purchasegetuuid,
	productmasterSearch,       
	fabrictypeadd,
	fabrictypedel,
	fabrictypeview,
	fabrictypeupd,	
  deleteUploadFile,
  cancelUploadFile,
  searchUploadFile,
  getCheckProductCode,
  getCheckProductBarcode
} from "@/api/module/masterDataApi.js";
import { 
  getUserimg
} from "@/api/module/publicApi.js";
import {
  fabrictypeProductCategory,
  materialStatusList,
  fabrictypeProductSeason,
  fabrictypeSaleSeasou,
  fabrictypeProductType,
  fabrictypeSaleUnit,
  fabrictypeProductClass,
  fabrictypeProductFashionDegree,
  fabrictypebusiCategory,
  fabrictypeProductcolor,
  fabrictypeProductpattern,
  fabrictypeProductDistinguish,
  fabrictypedictionariesUncons,
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import { getCheckSupplierName} from "@/api/module/materialsApi.js";
import { timeFormat,getTimeRange} from '@/utils/index.js';
import fabricMaintainCheck from '../fabricMaintainCheck/Index.vue';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "fabricMaintain",
  props: [],
  data() {
    return {
      myHeaders: {
                Authorization:'bearer '+this.$keycloak.token
      },
      uploadurlProduct:'',
      showfilelist:false,
      actionsType: '',
      dateVal:'',
      startTime:'',
      endTime:'',
      // 上传字段
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      tableLoading: true,
      removeloading:false,
      errorProduct:true,
      errorMaterial:true,
      errorProductBarcode:true,
      isLoadingExport:false,
      isLoadingImport:false,
      fileType: '001',
      uploadFileList: [],
      headers: '',
      uploadUrl: process.env.VUE_APP_INFRASTRUCTURE_URL,
      // 上传字段 end
      productCode:'',
      dialogdelVisible:false,
      isEdit: false,
      loadingcommit:false,
      delid:'',
      updid:'',
      edittag:'',
      businessCode:'',
      brand:'',
      materialCode:'',
      season:'',     
      // form
      value1: null,
      suggestIndexTypelist:[
        {
          index:1,
          name:1
        },
         {
          index:2,
          name:2,
        },
        {
          index:3,
          name:3
        },
      ],
      ifStylelist:[
        {
          name:'是',
          index:'1',
          ifbatch:true
        },
        {
          name:'否',
          index:'2',
          ifbatch:false
        }
      ],
      rules: {
      	  productBarcode: [
            // { required: true, message: '请输入产品条形码', trigger: 'blur' },
            // { min:1, max:64, message: '超长字符', trigger: 'blur' },
            {
               validator:function(rule,value,callback){
                      console.log(value)
                  if(value!=''&&value!=null){
                     var str=encodeURIComponent(value);
                      getCheckProductBarcode(str).then(res => {
                        if (res.code === '0') {
                          if(res.data!=''&&res.data!=null){  
                              callback(new Error('该产品条形码在面料产品或成品产品数据中已存在'));
                            }else{
                              callback();
                            }
                        }
                      });
                  }else{
                     callback();
                  }
                }, trigger: 'blur'
            }
          ],
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min:1, max:128, message: '超长字符', trigger: 'blur' }
          ],
          productCode:[
            // { required: true, message: '请输入产品代码', trigger: 'blur' },
            // { min:1, max:20, message: '超长字符', trigger: 'blur' },
          ],
          materialCode:[
            { required: true, message: '请输入物料编号', trigger: 'blur' },
            { min:1, max:32, message: '超长字符', trigger: 'blur' }
          ],
          validDate:[
            { type: 'string',required: true, message: '请输入上市日期', trigger: 'change' }
          ],
          invalidDate:[
            { type: 'string',required: true, message: '请输入生命周期', trigger: 'change' }
          ],
          productComposition:[
            { required: true, message: '请输入产品成分', trigger: 'blur' },
            { min:1, max:128, message: '超长字符', trigger: 'blur' },
            //  {
            //   validator:function(rule,value,callback){
            //         console.log(value)
            //     }, trigger: 'blur'
            // }
          ],
          weightPerMeterShow:[
            { required: true, message: '请输入延米克重', trigger: 'blur' },
            { min:1, max:12, message: '超长字符', trigger: 'blur' }
          ],
          width:[
            { min:1, max:16, message: '超长字符', trigger: 'blur' }
          ],
          
          pattern:[
             { min:1, max:12, message: '超长字符', trigger: 'blur' }
          ],
          specification:[
            { min:1, max:32, message: '超长字符', trigger: 'blur' }
          ],
          yarnCount:[
            { min:1, max:128, message: '超长字符', trigger: 'blur' }
          ],         
          materialGroup:[
            { min:1, max:125, message: '超长字符', trigger: 'blur' }
          ],
          placeOfProduction:[
            { min:1, max:64, message: '超长字符', trigger: 'blur' }
          ],
          substitute:[
            { min:1, max:128, message: '超长字符', trigger: 'blur' }
          ],
          hsCode:[
            { min:1, max:64, message: '超长字符', trigger: 'blur' }
          ],
          rawFabricId:[
            { min:1, max:24, message: '超长字符', trigger: 'blur' }
          ],
          remarks: [
            { min: 1, max: 1000, message: '超长字符', trigger: 'blur' }
          ],
          category:[
             { required: true, message: '请选择品类', trigger: 'change' }
          ],
          businessType:[
             { required: true, message: '请选择业务分类', trigger: 'change' }
          ],
          season:[
             { required: true, message: '请选择产品特性', trigger: 'change' }
          ],
          productClass:[
             { required: true, message: '请选择产品分类', trigger: 'change' }
          ],
          brand:[
            { min:1, max:64, message: '超长字符', trigger: 'blur' },
            { required: true, message: '请选择产品品牌', trigger: 'change'}
          ],
          saleMeasurementUnit:[
            { required: true, message: '请选择销售计量单位', trigger: 'change'}
          ],
          saleSeasou:[
            { required: true, message: '请选择销售季', trigger: 'change'}
          ],
          productStatus:[
             { required: true, message: '请选择产品状态', trigger: 'change'}
          ],
          suggestion:[
             { required: true, message: '请选择推荐品', trigger: 'change'}
          ]
       },
      ruleForm:{
        	productCode:'',
        	productName:'',
        	businessCode:'',
        	specification:'',
        	saleSeasou:'',
        	materialGroup:'',
        	brand:'',
        	productClass:'',
        	minOrder:'',
        	productDistinguish:'',
          weightPerMeterShow:'',
          weightPerMeterOne:'',
          weightPerMeterTwo:'',
          widthShow:'',
          widthStart:'',
          widthEnd:'',
        	saleMeasurementUnit:'Meter',
        	weightPerSquareMeter:'',
          numbersPerMeasurementUnit:'',
          productSeries:'',
        	materialCode:'',
        	hsCode:'',
          rawFabricId:'',
        	validDate:'',
        	delistDate:'',
        	putawayDate:'',
        	invalidDate:'',
        	productBarcode:'',
        	category:'',
        	categoryName:'',
        	season:'',
          width:'',
        	color:'',
        	pattern:'',
        	yarnCount:'',
        	productComposition:'',
        	placeOfProduction:'',
        	substitute:'',
        	productType:'',
        	suggestion:false,
        	suggestIndex:'',
        	productStatus:'1',
        	fashion:'',
        	uuid:'',
          businessType:'',
          remarks: '',
          deleteAttachmentsIds:[]
      },
      orderCode: '',
      startTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      uuid: '',
      delteIndex:'',
      addItem:[],
      updItem:[],
      orderList: [],
      busiCategorytypelist:[],
      categorytypelist:[],
			statustypelist:[],
			seasontypelist:[],
			SaleSeasoutypelist:[],
			Producttypelist:[],
			SaleUnittypelist:[],
			ProductClasstypelist:[],
			ProductFashionDegreetypelist:[],
			colortypelist:[],
	    patterntypelist:[],
      distinguishtypelist:[],
      placeProductiontypelist:[],
      productCodetypelist:[],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      fieldList: [
        {
          name: '序号',
          class: 'w9p'
        },
        // {
        //   name: '面料产品系统编号',
        //   class: 'w9p'
        // },
        {
          name: '产品编号',
          class: 'w9p'
        },
        {
          name: '产品名称',
          class: 'w9p'
        },
        {
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '产品品牌',
          class: 'w9p'
        },
        {
          name: '产品特性',
          class: 'w9p'
        },
        {
          name: '产品成分',
          class: 'w9p'
        },
        {
          name: '产品分类',
          class: 'w9p'
        },
        {
          name: '产品状态',
          class: 'w5p'
        },
        {
          name: '操作',
          class: 'w14p'
        }
      ],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex',
          class: 'w50p',
          width: '150'
        },
        {
          name:'产品编号',
          field:'productCode',
          class: 'w50p',
          width: '150'
        },
        {
          name:'产品名称',
          field:'productName',
          class: 'w50p',
          width: '150'
        },
        {
          name:'物料编号',
          field:'materialCode',
          class: 'w50p',
          width: '150'
        },
        {
          name:'产品品牌',
          field:'brand',
          class: 'w50p',
          width: '150',
        },
        {
          name:'产品特性',
          field:'seasonname',
          class: 'w50p',
          width: '150'
        },
        {
          name:'产品成分',
          field:'productComposition',
          class: 'w50p',
          width: '150'
        },
        {
          name:'销售季',
          field:'saleSeasou',
          productSeason:'sellSeasonHandle',
          class: 'w10p',
           width: '150'
        },
        {
          name:'产品状态',
          field:'productStatus',
          proStatus:'proStatus',
          class: 'w50p',
          width: '150'
        },
        {
          name:'创建时间',
          field:'createTime',
          class: 'w10p',
          width: '180'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '200',
          minWidth: '10%',
          isAction: true,
          hasEdit: true,
          hasDelete: true,
          hasCopy:true,
          hasCheck:true,
        },
      ],
      pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.ruleForm.invalidDate;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
      },
      pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.ruleForm.validDate;
            if (beginDateVal) {
              return (
                time.getTime() <
                new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
              );
            }
          }
      },
    };
  },
  components: {
    fabricMaintainCheck,
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.orderStatus = '1';
	  this.getProductCategory();
	  this.getProductStatus();
	  this.getProductSeason();
	  this.getSaleSeasou();
	  this.getProductType();
	  this.getSaleUnit();
	  this.getProductClass();
	  this.getProductFashionDegree();	  
	  this.getbusiCategory();
	  this.getProductcolor();
    this.getProductpattern();
    this.getProductDistinguish();
    this.getPlaceOfProduction();
    this.getProductCode();
    this.fun_date();
    // this.getPurchaseOrderList();
    this.headers = { Authorization: `Bearer ${this.$keycloak.token}` };
  },
  activated() {

  },
  watch: {
  
  },
  computed: {

  },
  methods: {
    dateValChange(){
      console.log(this.dateVal)
    },
     //固定展示为半月前的时间范围
    fun_date(){
      this.dateVal=getTimeRange(-15);
      console.log(this.dateVal)
      this.searchHandle();
    },
    //导入
    importHandle(){
      this.uploadurlProduct=process.env.VUE_APP_PRODUCT_URL +'product/v1/importExcel'
      console.log(this.uploadurlProduct)
    },
    //导出
    exportHandle(){
      console.log(this.idItems)
       this.tableLoading = true;
       this.isLoadingExport=true;
      let item=true;
      if(this.brand!=''){
           let obj={
              productCode:this.productCode,
						  materialCode:this.materialCode,
              season:this.season,
              businessType:"Group",
              startTime: this.startTime,
              endTime: this.endTime,
						  brand:this.brand
          }
           exportProductFile(JSON.stringify(obj)).then(res => {
             console.log(res);
              this.tableLoading = false;
              this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '集团面料产品主数据'+'.xlsx'; //下载后文件名
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
           });
      }else{
        this.$message({
          message: '请选择产品品牌按条件导出!',
          type: 'error'
        });
         this.tableLoading = false;
         this.isLoadingExport=false;
      }
    },
    beforeupload(file) {
//				 console.log(file)
         this.tableLoading = true;
         this.isLoadingImport=true;
				 var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
				 const isLt2M = file.size / 1024 / 1024 < 5     //这里做文件大小限制
					if(!isLt2M) {
						this.$message({
							message: '上传文件大小不能超过5MB!',
							type: 'error'
            });
            this.tableLoading = false;
            this.isLoadingImport=false;
					}
					return isLt2M
			},
    //订单导入成功之后
		UploadSuccess(response, file) {
				if(response.code == 0) {
					this.$message({
						message: '导入成功',
						type: 'success'
          });
          this.tableLoading = false;
          this.isLoadingImport=false;
					this.getPurchaseOrderList();
				}else{
					this.$message({
						message:response.message,
						type: 'error'
          });
          this.tableLoading = false;
          this.isLoadingImport=false;
				}
			},
    onkeyupProductCode(event){
      console.log(event)
      if(event.keyCode != 13){//除回车键外
            //标记当前事件函数的时间戳
            this.lastTimeStamp = event.timeStamp;
            setTimeout(() => {
                //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                if(this.lastTimeStamp == event.timeStamp){
                  console.log(this.ruleForm.productCode)
                    var str=encodeURIComponent(this.ruleForm.productCode);
                    getCheckProductCode(str).then(res => {
                        if (res.code === '0') {
                            if(res.data!=''&&res.data!=null){
                              this.errorProduct=false;
                            }else{
                              this.errorProduct=true;
                            }
                          }
                     });
                }
            },800);
      }
    },
     //检验是否存在有重复的产品编码
    hasRepeatProductClick(item){
       getCheckProductCode(item.productCode).then(res => {
        if (res.code === '0') {
            if(res.data!=''&&res.data!=null){
              this.errorProduct=false;
              item.productCode='';
              this.$message({
                message: '该产品编号在面料产品或成品产品数据中已存在',
                type: 'error'
              });
              return false;
            }else{
              this.errorProduct=true;
            }
        }
      });
    },
    //检验是否存在有重复的产品条形码
    onkeyupProductBarcode(event){
       if(event.keyCode != 13){//除回车键外
            //标记当前事件函数的时间戳
            this.lastTimeStamp = event.timeStamp;
            setTimeout(() => {
                //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                if(this.lastTimeStamp == event.timeStamp){
                    var str=encodeURIComponent(this.ruleForm.productBarcode);
                    getCheckProductBarcode(str).then(res => {
                      if (res.code === '0') {
                        if(res.data!=''&&res.data!=null){
                            this.errorProductBarcode=false;

                          }else{
                            this.errorProductBarcode=true;
                          }
                      }
                    });
                }
            },800);
      }
    },
    //检验是否存在有重复的产品条形码
    hasRepeatProductBarcodeClick(item){
       getCheckProductBarcode(item.productBarcode).then(res => {
        if (res.code === '0') {
           if(res.data!=''&&res.data!=null){
              this.errorProductBarcode=false;
              item.productBarcode='';
              this.$message({
                message: '该产品条形码在面料产品或成品产品数据中已存在',
                type: 'error'
              });
              return false;
            }else{
              this.errorProductBarcode=true;
            }
        }
      });
    }, 
    
    //检验是否存在有重复的物料编码
     onkeyupMaterialCode(event){
      console.log(event)
      if(event.keyCode != 13){//除回车键外
            //标记当前事件函数的时间戳
            this.lastTimeStamp = event.timeStamp;
            setTimeout(() => {
                //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                if(this.lastTimeStamp == event.timeStamp){
                    var str=encodeURIComponent(this.ruleForm.materialCode);
                     getCheckSupplierName(str).then(res => {
                      if (res.code === '0') {
                        console.log(res.data);
                        if(res.data==null){
                          this.errorMaterial=false;
                        }else{
                            this.errorMaterial=true;
                        }
                      }
                    });
                }
            },800);
      }
    },
      //检验是否存在有重复的物料编码
    hasRepeatMeterialClick(item){
      getCheckSupplierName(item.materialCode).then(res => {
        if (res.code === '0') {
          if(res.data==null){
              this.errorMaterial=false;
              item.materialCode='';
            	this.$message({
                message: '该物料编号在面料物料数据中不存在',
                type: 'error'
              }); 
          }else{
            this.errorMaterial=true;
          }
        }
      });

    },
    
    // 上传
    handleUploadRemove(file,list,index) {
      // 删除缩略图
         console.log(file.uuid)
         if (!file.response) {
          if(this.isEditor==true){
            this.updItem.push(file.id);
            console.log(this.updItem)
          }
          this.uploadFileList = this.uploadFileList.filter(item => item.id != file.id);
          console.log(this.uploadFileList)
        } else {
          console.log('elseelseelse')
          console.log(this.uploadFileList)
          deleteUploadFile(file.response.data.id).then(res => {
            if (res.code === '0') {
              this.uploadFileList = this.uploadFileList.filter(item => item.uid != file.uid);
              console.log(this.uploadFileList)
            }
          });
        }
        console.log(this.uploadFileList)
      
    },
    // handlePictureCardPreview(file) {
    //   console.log('上传缩略图：', file);
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    // handleDownload(file) {
    //   console.log(file);
    // },

    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功：', response, file, fileList);
       this.uploadFileList=fileList;
       if(this.isEditor==true){
         this.addItem.push(file.response.data.id);
         console.log(this.addItem)
       }

    },
     handleExceed(files, fileList) {
        this.$message.error(`最多上传10张图片!`);
     },
    beforeUploadUpload(file) {
      let isType = false;
      let fileName = file.name;
      let regex = /(.jpg|.png|.gif|.jpeg)$/;
      if (regex.test(fileName.toLowerCase())) {
        isType = true;
      } else {
        this.$message.error('上传的图片只能是 JPG/PNG/GIF/JPEG/ 格式!');
      }
      return isType;
    },
    // 上传 end
    //产地
    getPlaceOfProduction(){
      fabrictypedictionaries('PlaceOfProduction').then(response => {
				if(response.code === "0") {					
					this.placeProductiontypelist = response.data;
				}
			});
    },
  	//颜色
  	getProductcolor(){ 		
  		fabrictypeProductcolor().then(response => {
				if(response.code === "0") {					
					this.colortypelist = response.data;
				}
			});
  	},
  	//花型
  	getProductpattern(){
  		fabrictypeProductpattern().then(response => {
				if(response.code === "0") {					
					this.patterntypelist = response.data;
				}
			});
    },
    //产品品牌
    getProductCode(){
  		fabrictypedictionariesUncons('productBrand').then(response => {
				if(response.code === "0") {
					this.productCodetypelist = response.data;	
				}
      });
      // this.productCodetypelist=[];
    },
  	//产品区分
  	getProductDistinguish(){
  		fabrictypeProductDistinguish().then(response => {
				if(response.code === "0") {					
					this.distinguishtypelist = response.data;
				}
			});
  	},
  	//业务分类
  	getbusiCategory(){
      fabrictypedictionaries('ProductBusinessType').then(response => {
				if(response.code === "0") {		
           if(response.data!=''){
            const arr1 = response.data.filter(item =>item.name=='集团')
            console.log(arr1)
            this.busiCategorytypelist=arr1;
          }						
					// this.busiCategorytypelist = response.data;
				}
			});
  	},
  	//产品品类
  	getProductCategory(){
  		fabrictypeProductCategory().then(response => {
				if(response.code === "0") {
					this.categorytypelist = response.data;
				}
			});
  	},
  	//产品状态
  	getProductStatus(){
  		materialStatusList().then(response => {
				if(response.code === "0") {					
					this.statustypelist = response.data;
				}
			});
  	},
  	//产品特性
  	getProductSeason(){
  		fabrictypeProductSeason().then(response => {
				if(response.code === "0") {
					
					this.seasontypelist = response.data;
				}
			});
  	},
  	//销售季
  	getSaleSeasou(){
      fabrictypedictionaries('SaleSeason').then(response => {
				if(response.code === "0") {					
					this.SaleSeasoutypelist = response.data;
				}
			});
  	},
  	//产品类型
  	getProductType(){
  		fabrictypeProductType().then(response => {
				if(response.code === "0") {
					this.Producttypelist = response.data;
				}
			});
  	},
  	//销售计量单位 
  	getSaleUnit(){
      let data=[
        {name: "米", index: "Meter"}
      ]
      this.SaleUnittypelist=data;
  	},
  	//产品分类
  	getProductClass(){
  		fabrictypeProductClass().then(response => {
				if(response.code === "0") {
					this.ProductClasstypelist = response.data;
				}
			});
  	},
  	//时尚度
  	getProductFashionDegree(){
  		fabrictypeProductFashionDegree().then(response => {
				if(response.code === "0") {
					this.ProductFashionDegreetypelist = response.data;
				}
			});
    },
    oninput(num) {
      console.log(num)
      if(num!=null){
        	var str = num
          var len1 = str.substr(0, 1)
          var len2 = str.substr(1, 1)
          var lenLast=str.substr(str.length-1)
          //如果第一位是0，第二位不是点，就用数字把点替换掉
          if (str.length > 1 && len1 == 0 && len2 != ".") {
            str = str.substr(1, 1)
          }
          //第一位不能是.
          if (len1 == ".") {
            str = ""
          }
          //最后一位不能是.
          if (str.length==8&&lenLast == ".") {
            str = ""
          }
          //限制只能输入一个小数点
          if (str.indexOf(".") != -1) {
            var str_ = str.substr(str.indexOf(".") + 1)
            if (str_.indexOf(".") != -1) {
              str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1)
            }
          }
          //正则替换
          str = str.replace(/[^\d^\.]+/g, '') // 保留数字和小数点
          str = str.replace(/\.\d\d\d\d\d\d$/,'') // 小数点后只能输两位
          return str
      }
		
		},
  	// 过滤输入的数字
    InputNumber(property) {
      this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property]);
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      console.log(val);
      if (val === 0 || val === "0" || val === "") {
        return "";
      } else {
        let value = null;
        // value = String(val).replace(/[^\d]/g, ""); // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        value = value.replace(/[^\d^\.]+/g, '') // 保留数字和小数点
		    value = value.replace(/\.\d\d\d$/,'') // 小数点后只能输两位
        value = value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        console.log(value);
        return Number(value);
      }
    },
    numbersContrast(){
           if(this.ruleForm.weightPerMeterOne==''&&this.ruleForm.weightPerMeterTwo==''){
              console.log('同时不存在weightPerMeterShow(kong)')
              this.ruleForm.weightPerMeterShow='';
              this.$forceUpdate();
              this.$message({
                  message: '请输入延米克重!',
                  type: 'error'
                });
                return false;
            }else if(this.ruleForm.weightPerMeterOne!=''&&this.ruleForm.weightPerMeterTwo!=''){
              console.log('同时存在weightPerMeterShow')
              if(Number(this.ruleForm.weightPerMeterOne)>Number(this.ruleForm.weightPerMeterTwo)){
                  this.$message({
                    message: '请输入正确的延米克重范围格式!',
                    type: 'error'
                  });
                  return false;
              }else{
                this.loadingcommit = true;
                this.ruleForm.weightPerMeterShow=this.ruleForm.weightPerMeterOne+'-'+this.ruleForm.weightPerMeterTwo;
              }
            }else{
              console.log('两者存在其一weightPerMeterShow')
              if(this.ruleForm.weightPerMeterOne!=''){
                 this.ruleForm.weightPerMeterShow=this.ruleForm.weightPerMeterOne;
              }
              if(this.ruleForm.weightPerMeterTwo!=''){
                 this.ruleForm.weightPerMeterShow=this.ruleForm.weightPerMeterTwo;
              }
            }

            if(this.ruleForm.widthStart==''&&this.ruleForm.widthEnd==''){
              console.log('同时不存在width(kong)')
               this.ruleForm.width='';
               this.$forceUpdate();
            }else if(this.ruleForm.widthStart!=''&&this.ruleForm.widthEnd!=''){
               console.log('同时存在width')
              if(Number(this.ruleForm.widthStart)>Number(this.ruleForm.widthEnd)){
                  this.$message({
                    message: '请输入正确的幅宽范围格式!',
                    type: 'error'
                  });
                  return false;
              }else{
                this.loadingcommit = true;
               this.ruleForm.width=this.ruleForm.widthStart+'-'+this.ruleForm.widthEnd;
              }
            }else{
              console.log('两者存在其一width')
              if(this.ruleForm.widthStart!=''){
                 this.ruleForm.width=this.ruleForm.widthStart;
              }
              if(this.ruleForm.widthEnd!=''){
                 this.ruleForm.width=this.ruleForm.widthEnd;
              }
            }        
    },
    // from
    submitForm(formName) {
    	 this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.loadingcommit=true;
            // console.log(this.numbersContrast());
            console.log(this.ruleForm)
            console.log('产品编码',this.errorProduct)
            if(this.numbersContrast()!=false){            
              if(this.errorProduct!=false&&this.errorMaterial!=false&&this.errorProductBarcode!=false){
                if(this.edittag=='add'){
                  console.log(this.ruleForm)
                  fabrictypeadd(this.ruleForm).then(response => {
                    if(response.code === "0") {
                      this.$message({
                        message: '添加成功',
                        type: 'success'
                      });
                      this.loadingcommit=false;
                      this.isEdit = false;
                      this.ruleForm= {
                        suggestion:false,
                        productStatus:'1',
                         weightPerMeterShow:'',
                        weightPerMeterOne:'',
                        weightPerMeterTwo:'',
                        width:'',
                        widthStart:'',
                        widthEnd:'',
                        deleteAttachmentsIds:[]
                      };
                      this.getPurchaseOrderList();
                    }else{
                       this.loadingcommit=false;
                    }
                    setTimeout(() => {
                      this.loadingcommit=false;
                    }, 3000);
                  });
                }else{
                  this.ruleForm.deleteAttachmentsIds=this.updItem;
                  fabrictypeupd(this.ruleForm, this.updid).then(response => {
                    if(response.code === "0") {
                      this.$message({
                        message: '修改成功',
                        type: 'success'
                      });
                      this.loadingcommit=false;
                      this.isEdit = false;
                      this.updItem=[];
                      this.addItem=[];
                      this.ruleForm= {
                        suggestion:false,
                        productStatus:'1',
                        weightPerMeterShow:'',
                        weightPerMeterOne:'',
                        weightPerMeterTwo:'',
                        width:'',
                        widthStart:'',
                        widthEnd:'',
                        deleteAttachmentsIds:[]
                      };
                      this.getPurchaseOrderList();
                    }else{
                       this.loadingcommit=false;
                    }
                    setTimeout(() => {
                      this.loadingcommit=false;
                    },3000);
                  });
                } 
              }

            }
            
          } else {
            console.log('error submit!!');
            return false;
          }
       });
    	
    },
    //取消
    resetForm() { 
      if(this.addItem!=''){
         cancelUploadFile(this.addItem).then(res => {
            if (res.code === '0') {
             this.addItem=[];
            }
          });
      }
    	this.isEdit = false;
      this.uploadFileList=[];
      this.updItem=[];
    	this.ruleForm={
         suggestion:false,
         productStatus:'1',
         weightPerMeterShow:'',
          weightPerMeterOne:'',
          weightPerMeterTwo:'',
          width:'',
          widthStart:'',
          widthEnd:'',
         deleteAttachmentsIds:[]
      };
    	console.log(this.isEdit)
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      if (this.dateVal) {
        this.startTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      this.getPurchaseOrderList();
    },
    addHandle() {
      // 添加
      this.isEdit = true;
      this.isEditor=false;
      this.actionsType = 'add';
      this.edittag='add';
      this.uploadFileList=[];
      this.ruleForm.width='';
      purchasegetuuid().then(response => {
				if(response.code === "0") {
					this.ruleForm.uuid = response.data;
				}
			});
    },
    editHandle(index,item) {
      // 编辑项
      this.isEdit = true;
      this.isEditor=true;
      this.actionsType = 'edit';
      this.edittag='updated';
      this.updid=item.id;
      fabrictypeview(item.id).then(response => {
        if(response.code === "0") {
           var data=response.data.weightPerMeterShow;
           var widthData=response.data.width;
           if(data!=''&&data!=null){
             console.log('zou weightPerMeterShow')
              if((data.indexOf("-") != -1)==true){
                var str = data.split('-');
                  if(str[0]!='undefined'){
                    response.data.weightPerMeterOne=str[0];
                  }else{
                    response.data.weightPerMeterOne='';
                  }
                  if(str[1]!='undefined'){
                    response.data.weightPerMeterTwo=str[1];
                  }else{
                    response.data.weightPerMeterTwo='';
                  }
              }else{
                response.data.weightPerMeterOne=response.data.weightPerMeterShow;
                response.data.weightPerMeterTwo='';
              }
           }else{
               response.data.weightPerMeterOne='';
               response.data.weightPerMeterTwo='';
           }
           if(widthData!=''&&widthData!=null){
              console.log('zou width')
              if((widthData.indexOf("-") != -1)==true){
                var str = widthData.split('-');
                  if(str[0]!='undefined'){
                    response.data.widthStart=str[0];
                  }else{
                    response.data.widthStart='';
                  }
                  if(str[1]!='undefined'){
                    response.data.widthEnd=str[1];
                  }else{
                    response.data.widthEnd='';
                  }
              }else{
                response.data.widthStart=response.data.width;
                response.data.widthEnd='';
              }
           }else{
              response.data.widthStart='';
              response.data.widthEnd='';
           }
          this.ruleForm=response.data;
          this.ruleForm.validDate = response.data.validDate ? timeFormat(response.data.validDate).split(' ')[0] : '';
          this.ruleForm.invalidDate= response.data.invalidDate ? timeFormat(response.data.invalidDate).split(' ')[0] : '';
        }
      });
      searchUploadFile(item.uuid, this.fileType).then(res => {
        console.log('文件列表：', res);
        if (res.code === '0') {
          this.uploadFileList = res.data;
          this.uploadFileList.forEach(item => {
            item.url = process.env.VUE_APP_SCM_IMG_URL + item.filepath;
          });
        }
      });
    },
    editScopeWidth(res,val,msg,start,end){
      console.log(res,val,msg,start,end)
       if((val.indexOf("-") != -1)==true){
          var str = val.split('-');
          console.log(str)
            if(str[0]!='undefined'){
              res.start=str[0];
            }else{
              res.start='';
            }
            if(str[1]!='undefined'){
              res.end=str[1];
            }else{
             res.end='';
            }
        }else{
          res.start=response.data.msg;
          res.end='';
        }
        console.log(res)
    },
    editScope(res,val,msg,start,end){
      console.log(res,val,msg,start,end)
       if((val.indexOf("-") != -1)==true){
          var str = val.split('-');
          console.log(str)
            if(str[0]!='undefined'){
              res.start=str[0];
            }else{
              res.start='';
            }
            if(str[1]!='undefined'){
              res.end=str[1];
            }else{
             res.end='';
            }
        }else{
          res.start=response.data.msg;
          res.end='';
        }
        console.log(res)
    },
    deleteHandle(index,item) {
      // 删除项
      this.delid=item.id;
      this.dialogdelVisible = true;
    },
    //删除确定
    delVisibleclick(){
      this.removeloading=true;
    	fabrictypedel(this.delid).then(response => {
					if(response.code === "0") {
						this.$message({
							message:'删除成功！',
							type: 'success'
            });
            this.removeloading=false;
						this.dialogdelVisible = false;
						this.getPurchaseOrderList();
					}
				});
    },
    cloneHandle(item) {
       this.isEdit = true;
       this.isEditor=false;
       this.actionsType = 'add';
    	 this.edittag='add';
      // 克隆
      fabrictypeview(item.id).then(response => {
        if(response.code === "0") {
           var data=response.data.weightPerMeterShow;
           var widthData=response.data.width;
           if(data!=''&&data!=null){
             console.log('zou weightPerMeterShow')
              if((data.indexOf("-") != -1)==true){
                var str = data.split('-');
                  if(str[0]!='undefined'){
                    response.data.weightPerMeterOne=str[0];
                  }else{
                    response.data.weightPerMeterOne='';
                  }
                  if(str[1]!='undefined'){
                    response.data.weightPerMeterTwo=str[1];
                  }else{
                    response.data.weightPerMeterTwo='';
                  }
              }else{
                response.data.weightPerMeterOne=response.data.weightPerMeterShow;
                response.data.weightPerMeterTwo='';
              }
           }else{
               response.data.weightPerMeterOne='';
               response.data.weightPerMeterTwo='';
           }
           if(widthData!=''&&widthData!=null){
              console.log('zou width')
              if((widthData.indexOf("-") != -1)==true){
                var str = widthData.split('-');
                  if(str[0]!='undefined'){
                    response.data.widthStart=str[0];
                  }else{
                    response.data.widthStart='';
                  }
                  if(str[1]!='undefined'){
                    response.data.widthEnd=str[1];
                  }else{
                    response.data.widthEnd='';
                  }
              }else{
                response.data.widthStart=response.data.width;
                response.data.widthEnd='';
              }
           }else{
              response.data.widthStart='';
              response.data.widthEnd='';
           }
          this.ruleForm=response.data;
          this.ruleForm.validDate = response.data.validDate ? timeFormat(response.data.validDate).split(' ')[0] : '';
          this.ruleForm.invalidDate= response.data.invalidDate ? timeFormat(response.data.invalidDate).split(' ')[0] : '';
          this.getuuid();
        }
      });
    },
    checkHandle(index,item) {
      // 查看详情
      console.log('查看详情模板：', item);
      this.actionsType = 'check';
      this.edittag = 'updated';
      this.isEdit = true;
      this.isEditor=false;
      // this.ruleForm = item;
      fabrictypeview(item.id).then(response => {
        if(response.code === "0") {
          this.ruleForm = response.data;
          this.ruleForm.validDate = response.data.validDate ? timeFormat(response.data.validDate).split(' ')[0] : '';
          this.ruleForm.invalidDate= response.data.invalidDate ? timeFormat(response.data.invalidDate).split(' ')[0] : '';
        }
      });
      searchUploadFile(item.uuid, this.fileType).then(res => {
        console.log('文件列表：', res);
        if (res.code === '0') {
          this.uploadFileList = res.data;
          this.uploadFileList.forEach(item => {
            item.url = process.env.VUE_APP_SCM_IMG_URL + item.filepath;
          });
        }
      });

    },
    getuuid(){
    	purchasegetuuid().then(response => {
			if(response.code === "0") {
				this.ruleForm.uuid = response.data;
			}
		});
     },
    getPurchaseOrderList() {
    	this.tableLoading = true;
      // 采购请求列表
      let data = {
              productCode:this.productCode,
						  materialCode:this.materialCode,
						  season:this.season,
              brand:this.brand,
              startTime: this.startTime,
              endTime: this.endTime,
              businessType:'Group'
      };
      productmasterSearch(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code == '0') {
        	this.tableLoading = false;
          this.orderList = res.data.records;
          this.total = res.data.total;
          this.orderList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }
          });
          for(var i=0;i<this.orderList.length;i++){
            let item=this.orderList[i];
            if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
            }else{
              item.idIndex=i+1;
            }
          	for(var j=0;j<this.seasontypelist.length;j++){
          		let data=this.seasontypelist[j];
          		if(item.season==data.index){
                item.seasonname=data.name;
                 this.$forceUpdate();
          		}
          	}
          	for(var a=0;a<this.ProductClasstypelist.length;a++){
          		let dataa=this.ProductClasstypelist[a];
          		if(item.productClass==dataa.index){
                item.productClassname=dataa.name;
                 this.$forceUpdate();
          		}
          	}
          	for(var b=0;b<this.statustypelist.length;b++){
          		let datab=this.statustypelist[b];
          		if(item.productStatus==datab.index){
                item.productStatusname=datab.name;
                 this.$forceUpdate();
          		}
            }
            
          }
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchaseOrderList();
    },
    

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.ml {
		margin-left: 10px;
	}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.fabricMaintain {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
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
  .submit_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
}
.edit_parent_list {
  ul {
    &.childcontentlist {
      height: 120px;
    }
  }
  .edit_btn_wrap{
    margin-top: 20px;
  }
}

.pagination_wrap {
  margin-top: 20px;
}

.check_popup_part {
  ul {
    &.childcontentlist {
      height: 80px;
    }
  }
}

ul {
  &.childcontentlist {
    li {
      /*white-space: normal;*/
      overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.form_part {
  .title {
    margin-bottom: 30px;
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
  }
  .demo-ruleForm {
    width: 45%;
  }
}
select.selectstatus {
		width: 200px;
		height: 40px;
		border-radius: 5px;
		border: 1px solid #DCDFE6;
		text-indent: 1em;
		color: #606266;
		line-height: 20px;
		/*cursor: pointer;*/
		font-size: 14px;
	}
	
	select.selectstatus>option {
		/*cursor: pointer;*/
		font-size: 14px;
	}
	
	select.selectstatus {
		background: #FFFFFF;
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
.subnav_wrap ul.el-dropdown-menu li.el-dropdown-menu__item {
  padding: 0 10px;
}

.fabricMaintain .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.fabricMaintain .el-form-item__content {
  width: auto;
}
.fabricMaintain .el-input {
  width: auto;
}
.fabricMaintain .whole_long .el-form-item__content {
  width: 65%;
}
.fabricMaintain .whole_long .el-input {
  width: 100%;
}
.fabricMaintain .el-rate {
  height: 40px;
  line-height: 40px;
  vertical-align: top;
}
.fabricMaintain .el-rate__item {
  vertical-align: baseline;
}
.el-form-item {
  width: 43%;
}
.fabricMaintain .graphic_wrap .el-form-item {
  width: 100%;
}
.fabricMaintain .graphic_wrap .el-form-item__content {
  width: 60% !important;
}
.fabricMaintain  .el-form-item__content .el-upload-list__item > div {
  height: 100%;
}
.fabricMaintain  .el-form-item__content .el-upload-list__item .el-upload-list__item-thumbnail {
  width: auto;
  height: 100%;
}
.fabricMaintain .el-upload--picture-card i.el-icon-plus {
  font-size: 30px !important;
}
.fabricMaintain i.el-icon-download {
  font-size: 20px !important;
}
.fabricMaintain .el-form-item i.el-icon-delete {
  margin-left: 0;
  color: #fff;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.fabricMaintain .el-form-item.last {
    width: 94%!important;
}
.fabricMaintain .el-form-item.photo{
	width: 94%!important;
}
.fabricMaintain .el-form-item.photo .el-form-item__content{
	width:66%;
}
.fabricMaintain .el-form-item.last .el-form-item__content{
	width:66%;
}
.fabricMaintain .el-form-item.limit{
  width: auto;
  margin-right: 0px;
}
.fabricMaintain form.el-form.demo-form-inline .el-form-item .el-form-item__content .unlimit.el-input input.el-input__inner{
  width:100%!important;
}
</style>