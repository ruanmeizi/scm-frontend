<template>
  <div class="container finishedMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">产品编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="productCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
        </div>

        <!-- <el-input class="input_single w200 mr10 mb10" v-model.trim="productCode" placeholder="产品编号"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="物料编号"></el-input> -->
        <div class="actions_btn_wrap down t_right">
          <!-- <el-button type="primary" class="mr10" @click="exportHandle" v-preventReClick :disabled="this.isLoadingExport">导出</el-button>
          <el-upload :headers="myHeaders" class="upload-demo inline_block mr10" :action="this.uploadurlProduct"  accept=".xlsx" 
            :before-upload="beforeupload" :show-file-list="showfilelist" :data="{'businessType':'Retail,Suits'}"  :on-success="UploadSuccess">
            <el-button type="primary" @click="importHandle" :disabled="this.isLoadingImport">导入</el-button>
          </el-upload> -->
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
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in orderList"
              :key="index">
              <li class="w9p">{{item.id}}</li>
              <li class="w9p" :title="item.insideCode">{{item.insideCode}}</li>
              <li class="w9p" :title="item.productCode">{{item.productCode}}</li>
              <li class="w9p" :title="item.productName">{{item.productName}}</li>
              <li class="w9p" :title="item.materialCode">{{item.materialCode}}</li>
              <li class="w9p" :title="productTypeHandle(item.productClassification)">{{productTypeHandle(item.productClassification)}}</li>
              <li class="w9p" :title="productStatusHandle(item.productStatus)">{{productStatusHandle(item.productStatus)}}</li>
              <li class="w15p">
                <i type="primary" class="el-icon-edit" title="修改" @click="editHandle(item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(item)"></i>
                <i type="primary" class="el-icon-document-copy" title="克隆" @click="cloneHandle(item)"></i>
                <i type="primary" class="el-icon-document"  title="查看" @click="checkHandle(item)"></i>
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
        <!-- <p v-if="!this.orderList.length&&!tableLoading" class="empty_tip">暂无数据</p> -->
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
        <finishedMaintainCheck :list="ruleForm" :uploadFileList="uploadFileList" @cancelHandle="resetForm"></finishedMaintainCheck>
      </div>

      <div v-else>
        <div class="base_wrap clearfix finished">
          <h2 class="title">产品基本信息</h2>       
          <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="200px" class="demo-form-inline">
            <!-- :disabled="isEditor" -->
            <el-form-item label="产品编号">
              <!-- @change="hasRepeatProductClick(ruleForm)" -->
              <el-input @change="hasRepeatProductClick(ruleForm)"  @keyup.native="onkeyupProductCode($event)"  v-model.trim="ruleForm.productCode"></el-input>
            </el-form-item>
            <el-form-item label="系统编号">
              <span>{{ruleForm.insideCode}}</span>
              <!-- <el-input :disabled="true" v-model.trim="ruleForm.insideCode"></el-input> -->
            </el-form-item>
            <el-form-item label="产品条形码">
              <!-- @change="hasRepeatProductBarcodeClick(ruleForm)" -->
              <el-input @change="hasRepeatProductBarcodeClick(ruleForm)" @keyup.native="onkeyupProductBarcode($event)"  v-model.trim="ruleForm.productBarcode"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model.trim="ruleForm.productName"></el-input>
            </el-form-item>
            <el-form-item label="物料编号" prop="materialCode">
              <el-input @change="getSupplierNameClick(ruleForm)"  @keyup.native="onkeyupMaterialCode($event)"  v-model.trim="ruleForm.materialCode"></el-input>
            </el-form-item>        
            <el-form-item label="供应商名称" prop="supplierName">
              <span :title="ruleForm.supplierName">{{ruleForm.supplierName}}</span>
              <!-- <el-input v-model.trim="ruleForm.supplierName"></el-input> -->
            </el-form-item>
             <el-form-item label="业务分类" prop="businessType">
               <el-select  v-model.trim="ruleForm.businessType"  placeholder="请选择">
                  <el-option v-for="item in this.busiCategorytypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="产品分类" prop="productClassification" ref="typerules">
              <el-select  v-model.trim="ruleForm.productClassification" @change="departChange"  placeholder="请选择">
                  <el-option v-for="item in this.ProductClasstypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
             <el-form-item label="产品系列">
              <el-input v-model.trim="ruleForm.productSeries"></el-input>
            </el-form-item>  
            <el-form-item label="产品特性" prop="productSeason">
               <el-select  v-model.trim="ruleForm.productSeason"   placeholder="请选择">
                  <el-option v-for="item in this.seasontypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="销售季" prop="sellSeason">
               <el-select  v-model.trim="ruleForm.sellSeason"   placeholder="请选择">
                  <el-option v-for="item in this.SaleSeasoutypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="产品区分">
               <el-select  v-model.trim="ruleForm.productDistinguish"   placeholder="请选择">
                  <el-option v-for="item in this.distinguishtypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="销售计量单位" prop="measurementUnit">            
              <el-select  v-model.trim="ruleForm.measurementUnit"   placeholder="请选择">
                  <el-option v-for="item in this.SaleUnittypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="颜色" prop="color">
              <el-select  v-model.trim="ruleForm.color"   placeholder="请选择">
                  <el-option v-for="item in this.colortypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select>
            </el-form-item>
             <el-form-item label="上市日期" prop="listingDate">
              <el-date-picker
                    v-model.trim="ruleForm.listingDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="长" prop="length">
              <el-input v-model.trim="ruleForm.length"></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="生命周期" prop="lifeCycle">
                <el-date-picker
                    v-model.trim="ruleForm.lifeCycle"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>
            <el-form-item label="宽" prop="width">
              <el-input v-model.trim="ruleForm.width"></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="产品状态" prop="productStatus">
              <el-select  v-model.trim="ruleForm.productStatus"   placeholder="请选择">
                  <el-option v-for="item in this.statustypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
               </el-select> 
            </el-form-item>           
            <el-form-item label="高" prop="height">
              <el-input v-model.trim="ruleForm.height"></el-input>&nbsp;&nbsp;米
            </el-form-item>
            
             <!-- <el-form-item class="whole" label="备注" prop="remarks">
              <el-input v-model.trim="ruleForm.remarks"></el-input>
            </el-form-item> -->
           
            <h2 class="title">成品产品图文信息</h2>
            
            <el-form-item label="缩略图" prop="thumbImg" class="photo">
              <el-upload
                :headers="headers"
                :action="uploadUrl + '/infrastructure/v1/attachments/upload'"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUploadUpload"
                :limit="10"
                :on-exceed="handleExceed"
                list-type="picture-card"
                :file-list="uploadFileList"
                :data="{uuid: ruleForm.uuid, type: fileType}"
                :auto-upload="true">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url" alt="">
                    <span class="el-upload-list__item-actions">
                      <!-- 查看图片 -->
                      <!-- <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                      </span> -->
                      <!-- 下载图片 -->
                      <!-- <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)">
                        <i class="el-icon-download"></i>
                      </span> -->
                      <!-- 删除图片 -->
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleUploadRemove(file)">
                        <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                  <div slot="tip" class="el-upload__tip">支持扩展名：jpg、png、gif、jpeg</div>
              </el-upload>
              <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog> -->
            </el-form-item>
            <el-form-item label="成品产品详细信息" prop="remarks" class="last">
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
          <el-button class="mr10" @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="this.loadingcommit" v-preventReClick>保存</el-button>
        </div>
      </div>
    </div>
    
    <!--删除-->
		<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
			<span>确定删除该条成品产品数据?</span>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogdelVisible = false">取 消</el-button>
		    <el-button type="primary"  @click="delVisibleclick()" v-preventReClick>确 定</el-button>
		  </span>
		</el-dialog>
    
  </div>
</template>

<script>
import {postpermission,exportFinishedProductFile} from "@/api/accessPermission.js";
import { 
	purchasegetuuid,
	finishedapiSearch,
  finishedtypeadd,
  finishedtypedel,
  finishedtypeview,
  finishedtypeupd
} from "@/api/module/finishedproductApi.js";
import { 
  deleteUploadFile,
  cancelUploadFile,
  searchUploadFile,
  getCheckProductCode,
  getCheckProductBarcode
} from "@/api/module/masterDataApi.js";
import { 
  getCheckProductMaterialCode,
  getCheckSupplierName
} from "@/api/module/materialsApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
import{
	materialStatusList,
	fabrictypeProductSeason,
	fabrictypeSaleSeasou,
	fabrictypeProductDistinguish,
	fabrictypeSaleUnit,
	fabrictypeProductClass,
  fabrictypeProductcolor,
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import { timeFormat } from '@/utils/index.js';
import finishedMaintainCheck from '../finishedMaintainCheck/Index.vue';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "finishedMaintain",
  props: [],
  data() {
    return {
      myHeaders: {
                Authorization:'bearer '+this.$keycloak.token
      },
      uploadurlProduct:'',
      showfilelist:false,
      isLoadingExport:false,
      isLoadingImport:false,
      actionsType: '',
      // 上传字段
      // dialogImageUrl: '',
      // dialogVisible: false,
      disabled: false,
      tableLoading: true,
      removeloading:false,
      ifExisting:true,
      errorProduct:true,
      errorMaterial:true,
      errorProductBarcode:true,
      fileType: '001',
      uploadFileList: [],
      headers:{ Authorization: `Bearer ${this.$keycloak.token}` },
      uploadUrl: process.env.VUE_APP_INFRASTRUCTURE_URL,
      // 上传字段 end
      materialCode:'',
      productCode:'',
      code:'',
      dialogdelVisible:false,
      isEdit: false,
      loadingcommit:false,
      delid:'',
      updid:'',
      edittag:'',
      // form
      value1: null,
      rules:{
      	  productClassification: [
            {required: true, message: '请选择产品分类', trigger:'change' }
          ], 
          productStatus: [
            {required: true, message: '请选择产品状态', trigger:'change' }
          ],
           measurementUnit : [
            {required: true, message: '请选择销售计量单位', trigger:'change' }
          ],
          sellSeason: [
            {required: true, message: '请选择销售季', trigger:'change' }
          ],
          productSeason : [
            {required: true, message: '请选择产品特性', trigger:'change' }
          ],
          productBarcode: [
            // { required: true, message: '请输入产品条形码', trigger: 'blur' },
            // { min:1, max:64, message: '超长字符', trigger: 'blur' }
          ],
          productName: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min:1, max:128, message: '超长字符', trigger: 'blur' }
          ],
          productCode:[
            // { required: true, message: '请输入产品编号',trigger: 'blur' },
            // { min:1, max:20, message: '超长字符', trigger: 'blur' }
          ],
           businessType:[
             { required: true, message: '请选择业务分类', trigger: 'change' }
          ],
          materialCode:[
            { required: true, message: '请输入物料编号', trigger: 'blur' },
            { min:1, max:20, message: '超长字符', trigger: 'blur' },
            {
              validator:function(rule,value,callback){
                    console.log(value)
                    if(value!=''&&value!=null){
                        var str=encodeURIComponent(value);
                        getCheckProductMaterialCode(str).then(res => {
                          if (res.code === '0') {
                            console.log(res.data);
                            if(res.data==null){
                              callback(new Error('该物料编号在成品物料数据中不存在'));
                            }else{
                              callback();
                            }
                          }

                        });

                    }
                  }, trigger: 'blur'
            }
          ],
          listingDate:[
            { type: 'string',required: true, message: '请输入上市时间', trigger: 'change' }
          ],
          lifeCycle :[
            { type: 'string',required: true, message: '请输入生命周期', trigger: 'change' }
          ], 
          length:[
            { min:1, max:24, message: '超长字符', trigger: 'blur' }
          ],
          width:[
            { min:1, max:64, message: '超长字符', trigger: 'blur' }
          ],
          height:[
            { min:1, max:24, message: '超长字符', trigger: 'blur' }
          ],
          supplierName:[
            { min:1, max:128, message: '超长字符', trigger: 'blur' }
          ],
          remarks:[
            { min:1, max:1000, message: '超长字符', trigger: 'blur' }
          ],
          
       },
      ruleForm:{
        	productCode:'',
        	materialCode:'',
        	productName:'',
        	length:'',
        	productClassification:'',
        	width:'',
        	measurementUnit:'',
        	height:'',
        	supplierName:'',
        	appearDate:'',
          color:'',
          productSeries:'',
        	productDistinguish:'',
        	listingDate:'',
        	lifeCycle:'',
        	productSeason:'',
        	productStatus:'1',
        	sellSeason:'',
        	remarks:'',
          uuid:'',
          businessType:'',
          errortag:true,
          deleteAttachmentsIds:[]
     },
      addItem:[],
      updItem:[],
      SaleUnittypelist:[],
			ProductClasstypelist:[],
			statustypelist:[],
			seasontypelist:[],
			SaleSeasoutypelist:[],
      orderList: [],
      colortypelist:[],
      distinguishtypelist:[],
      busiCategorytypelist:[],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      fieldList: [
        {
          name: '序号',
          class: 'w9p'
        },
        // {
        //   name: '成品产品系统编码',
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
          name: '产品分类',
          class: 'w9p'
        },
        {
          name: '产品状态',
          class: 'w9p'
        },
        {
          name: '操作',
          class: 'w15p'
        }
      ],
      leaderFieldsList: [
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
        }
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex'
        },
        // {
        //   name: '成品产品系统编码',
        //   field: 'insideCode',
        //   //class: 'w10p',
        //   width: '150',
        //   //minWidth: '10%'
        // },
        {
          name:'产品编号',
          field:'productCode',
          //class: 'w10p',
          // width: '150',
          //minWidth: '10%'
        },
        {
          name:'产品名称',
          field:'productName',
          //class: 'w10p',
          // width: '150',
          //minWidth: '10%'
        },
        {
          name:'物料编号',
          field:'materialCode',
          //class: 'w10p',
          // width: '150',
          //minWidth: '10%'
        },
        {
          name:'销售季',
          field:'sellSeason',
         // class: 'w10p',
          //minWidth: '10%',
          productSeason:'sellSeasonHandle'
        },
        {
          name:'产品状态',
          field:'productStatus',
          //class: 'w10p',
          // width: '150',
          //minWidth: '10%',
          proStatus:'proStatus'
        },
      ],
       pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.ruleForm.lifeCycle;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
      },
      pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.ruleForm.listingDate;
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
    finishedMaintainCheck,
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.orderStatus = '1';
    this.getSaleUnit();
    this.getProductClass();
    this.getProductStatus();
    this.getProductSeason();
    this.getSaleSeasou();
    this.getProductcolor();
    this.getPlaceOfProduction();
    this.getProductDistinguish();
    this.getbusiCategory();
    this.getPurchaseOrderList();
  },
  activated() {

  },
  watch: {
    
  },
  computed: {

  },
  methods: {
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
              businessType:"Agency"
          }
           exportFinishedProductFile(JSON.stringify(obj)).then(res => {
             console.log(res);
              this.tableLoading = false;
              this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '订货成品产品主数据'+'.xlsx'; //下载后文件名
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
     //检验是否存在有重复的产品编码
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
      var str=encodeURIComponent(item.productCode);
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
        }else{
         
        }
      });
      console.log(this.ruleForm.errortag)
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
       var str=encodeURIComponent(item.productBarcode);
       getCheckProductBarcode(str).then(res => {
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
        }else{
          item.productBarcode='';
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
                     getCheckProductMaterialCode(str).then(res => {
                      if (res.code === '0') {
                        console.log(res.data);
                        if(res.data==null){
                          this.errorMaterial=false;
                        }else{
                            this.errorMaterial=true;
                            this.ruleForm.supplierName=res.data.supplierName;
                        }
                      }
                    });
                }
            },800);
      }
    },
     //根据物料编号获取供应商名称
    getSupplierNameClick(item){
      var str=encodeURIComponent(item.materialCode);
      getCheckProductMaterialCode(str).then(res => {
        if (res.code === '0') {
          console.log(res.data);
          if(res.data==null){
            // item.materialCode='';
            item.supplierName='';
            this.errorMaterial=false;
            this.$message({
              message: '该物料编号在成品物料数据中不存在',
              type: 'error'
            }); 
          }else{
            this.errorMaterial=true;
            item.supplierName=res.data.supplierName;
          }
        }else{
          // item.materialCode='';
          item.supplierName='';
        }

      });
    },
    
    
   
  	//获取产品分类名称
  	productTypeHandle(status) {
		  for(var i=0;i<this.ProductClasstypelist.length;i++){
      	let item=this.ProductClasstypelist[i];
      	if(item.index==status){
      		return item.name
      	}
      }
  	}, 	
  	//获取产品状态名称
  	productStatusHandle(status) {
		  for(var i=0;i<this.statustypelist.length;i++){
      	let item=this.statustypelist[i];
      	if(item.index==status){
      		return item.name
      	}
      }
    },
    	//业务分类
  	getbusiCategory(){
      fabrictypedictionaries('ProductBusinessType').then(response => {
				if(response.code === "0") {			
           if(response.data!=''){
            const arr1 = response.data.filter(item =>item.name=='订货')
            console.log(arr1)
            this.busiCategorytypelist=arr1;
          }					
					// this.busiCategorytypelist = response.data;
				}
			});
  	},
    // 上传
    handleUploadRemove(file) {
      // 删除缩略图
      console.log(file);
      if (!file.response) {
        // deleteUploadFile(file.id).then(res => {
        //   if (res.code === '0') {
        //     this.uploadFileList = this.uploadFileList.filter(item => item.id != file.id);
        //   }
        // });
         if(this.isEditor==true){
            this.updItem.push(file.id);
            console.log(this.updItem)
          }
          this.uploadFileList = this.uploadFileList.filter(item => item.id != file.id);
          console.log(this.uploadFileList)
      } else {
        deleteUploadFile(file.response.data.id).then(res => {
          if (res.code === '0') {
            this.uploadFileList = this.uploadFileList.filter(item => item.uid != file.uid);
          }
        });
      }
    },

    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功：', response, file, fileList);
       this.uploadFileList=fileList;
       if(this.isEditor==true){
         this.addItem.push(file.response.data.id);
         console.log(this.addItem)
       }
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
    handleExceed(files, fileList) {
        this.$message.error(`最多上传10张图片!`);
     },
    // 上传 end

  	//颜色
  	getProductcolor(){ 		
  		fabrictypeProductcolor().then(response => {
				if(response.code === "0") {					
					this.colortypelist = response.data;
				}
			});
  	},
  		//计量单位
  	getSaleUnit(){
       fabrictypedictionaries('MaterialFinishedProductUnit').then(response => {
				if(response.code === "0") {					
					this.SaleUnittypelist = response.data;
				}
			});
    },
      //产地
    getPlaceOfProduction(){
      fabrictypedictionaries('PlaceOfProduction').then(response => {
				if(response.code === "0") {					
					this.placeProductiontypelist = response.data;
				}
			});
    },
  	//产品区分
  	getProductDistinguish(){
  		fabrictypeProductDistinguish().then(response => {
				if(response.code === "0") {					
					this.distinguishtypelist = response.data;
				}
			});
  	},
  	//产品分类
  	getProductClass(){
      fabrictypedictionaries('ProductFinishedClass').then(response => {
				if(response.code === "0") {					
					this.ProductClasstypelist = response.data;
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
      fabrictypedictionaries('FactorySeason').then(response => {
				if(response.code === "0") {					
					this.SaleSeasoutypelist = response.data;
				}
			});
  	},
  	departChange(val) {
      console.log(val)    
      this.$refs['typerules'].clearValidate()
//    this.$refs[typerules].clearValidate();
    },
    async existingJudge(item){
      if(item.productCode!=''){
         return getCheckProductCode(item.productCode).then(res => {
          if (res.code === '0') {
            
          }else{
            item.productCode='';
            return false;
          }
        });
      }
      if(item.productBarcode!=''){
        console.log('item.productBarcode')
        return getCheckProductBarcode(item.productBarcode).then(res => {
          if (res.code === '0') {
            
          }else{
            item.productBarcode='';
             return false;
          }
        });
      }
      if(item.materialCode!=''){
         console.log('item.materialCode')
        return getCheckProductMaterialCode(item.materialCode).then(res => {
            if (res.code === '0') {
              console.log(res.data);
              if(res.data!=''&&res.data!=null){
                item.supplierName=res.data.supplierName;
              }else{
                  this.$message({
                    message: '该物料编号在成品物料数据中不存在!',
                    type: 'error'
                  });
                  item.materialCode='';
                  item.supplierName='';
                  return false;
              }
            }else{
              item.materialCode='';
              item.supplierName='';
              return false;
            }
        });
      }
      
    },
    productFinishedAdd(){
      finishedtypeadd(this.ruleForm).then(response => {
        if(response.code === "0") {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.loadingcommit=false;
          this.isEdit = false;
          this.ruleForm= {
              productStatus:'1',
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
    },
    productFinishedUpd(){
      this.ruleForm.deleteAttachmentsIds=this.updItem;
        finishedtypeupd(this.ruleForm,this.updid).then(response => {
        	if(response.code === "0") {
        		this.$message({
        			message: '修改成功',
        			type: 'success'
        		});
        		this.loadingcommit=false;
            this.isEdit = false;
            this.updItem=[];
        		this.ruleForm= {
                productStatus:'1',
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
    },
    // from
    submitForm(formName) {
  	   this.$refs[formName].validate((valid) => {
          console.log(this.ruleForm)
          if (valid) {
            // console.log(this.existingJudge(this.ruleForm))
            // this.existingJudge(this.ruleForm).then(res=>{
              
            // })
            // this.hasRepeatProductClick(this.ruleForm);
             if(this.errorProduct!=false&&this.errorMaterial!=false&&this.errorProductBarcode!=false){
               if(this.edittag=='add'){
                  this.productFinishedAdd();
                }else{
                  console.log('走走')
                  this.productFinishedUpd();
                }  
             }
		    		 		           
          } else {
            console.log('error submit!!');
            return false;
          }
       });
  	 
    },
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
            productStatus:'1',
            deleteAttachmentsIds:[]
        };
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getPurchaseOrderList();
    },
    addHandle() {
      // 添加
      this.actionsType = 'add';
      this.edittag='add';
      this.isEdit = true;
      this.isEditor=false;
      this.uploadFileList=[];
      purchasegetuuid().then(response => {
				if(response.code === "0") {
					this.ruleForm.uuid = response.data;
				}
			});
    },
    editHandle(index,item) {
      // 编辑项
      this.actionsType = 'edit';
      this.edittag='updated';
      this.isEdit = true;
      this.isEditor=true;
      this.updid=item.id;
      finishedtypeview(item.id).then(response => {
					if(response.code === "0") {
            this.ruleForm=response.data;
            this.ruleForm.listingDate = response.data.listingDate ? timeFormat(response.data.listingDate).split(' ')[0] : '';
            this.ruleForm.lifeCycle= response.data.lifeCycle ? timeFormat(response.data.lifeCycle).split(' ')[0] : '';
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
    deleteHandle(index,item) {
      // 删除项
      this.delid=item.id;
      this.dialogdelVisible = true;
    },
     //删除确定
    delVisibleclick(){
      this.removeloading=true;
    	finishedtypedel(this.delid).then(response => {
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
      // 克隆
      this.isEdit = true;
      this.edittag='add';
      this.actionsType = 'add';
      this.isEditor=false;
      finishedtypeview(item.id).then(response => {
					if(response.code === "0") {
            this.ruleForm=response.data;
            this.ruleForm.listingDate = response.data.listingDate ? timeFormat(response.data.listingDate).split(' ')[0] : '';
            this.ruleForm.lifeCycle= response.data.lifeCycle ? timeFormat(response.data.lifeCycle).split(' ')[0] : '';
						this.getuuid();
					}
			});
			console.log(this.ruleForm);
    },
    checkHandle(index,item) {
      // 查看详情
      console.log('查看详情模板：', item);
      this.actionsType = 'check';
      this.edittag = 'updated';
      this.isEdit = true;
      finishedtypeview(item.id).then(response => {
        if(response.code === "0") {
          this.ruleForm=response.data;
          if(this.ruleForm.listingDate!=null&&this.ruleForm.listingDate!=''){
            let date = timeFormat(response.data.listingDate);
            this.ruleForm.listingDate = date.split(' ')[0];
          }
          if(this.ruleForm.lifeCycle!=null&&this.ruleForm.listingDate!=''){
            let date = timeFormat(response.data.lifeCycle);
            this.ruleForm.lifeCycle = date.split(' ')[0];
          }
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchaseOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchaseOrderList();
    },
    getPurchaseOrderList() {
    	this.tableLoading = true;
      // 采购请求列表
      let data = {
        productCode:this.productCode,
        materialCode: this.materialCode,
        businessType:'Agency'
      };
      finishedapiSearch(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购订单列表：', res);
        if (res.code == '0') {
        	this.tableLoading = false;
          this.orderList = res.data.records;
          this.total = res.data.total;
          this.orderList.forEach((item, index) => {
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = "空";
            }
            if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(index+1)
            }else{
              item.idIndex=index+1;
            }
          });
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
.ml {
		margin-left: 10px;
	}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.finishedMaintain {
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

.finishedMaintain .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.finishedMaintain .el-form-item__content {
  width: auto;
}
.finishedMaintain .el-input {
  width: auto;
}
.finishedMaintain .whole_long .el-form-item__content {
  width: 65%;
}
.finishedMaintain .whole_long .el-input {
  width: 100%;
}
.finishedMaintain .el-rate {
  height: 40px;
  line-height: 40px;
  vertical-align: top;
}
.finishedMaintain .el-rate__item {
  vertical-align: baseline;
}
/*.finishedMaintain .graphic_wrap .el-form-item {
  width: 100%;
}
.finishedMaintain   .el-form-item__content {
  width: 60% !important;
}*/
.finishedMaintain  .el-form-item__content .el-upload-list__item > div {
  height: 100%;
}
.finishedMaintain  .el-form-item__content .el-upload-list__item .el-upload-list__item-thumbnail {
  width: auto;
  height: 100%;
}
.finishedMaintain .el-upload--picture-card i.el-icon-plus {
  font-size: 30px !important;
}
.finishedMaintain i.el-icon-download {
  font-size: 20px !important;
}
.finishedMaintain .graphic_wrap i.el-icon-delete {
  margin-left: 0;
  color: #fff;
}
.finishedMaintain .el-form-item.last {
    width: 94%!important;
}
.finishedMaintain .el-form-item.photo{
	width: 94%!important;
}
.finishedMaintain .el-form-item.photo .el-form-item__content{
	width:66%;
}
.finishedMaintain .el-form-item.last .el-form-item__content{
	width:66%;
}
</style>”