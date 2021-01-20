<template>
  <div class="container fabricMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">产品品牌：</span>
            <el-input class="input_single w200 mr10" v-model.trim="brand" placeholder="请输入"></el-input>
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
            <el-select class="select_single w200 mr10"
             @change="getPurchaseOrderList"
              v-model="season"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in this.seasontypelist"
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
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="物料编号"></el-input>
        <el-select v-model="season" placeholder="请选择产品季">
        	<el-option key="" label="请选择产品季" value=""></el-option>
				    <el-option
				      v-for="item in this.seasontypelist"
				      :key="item.index"
				      :label="item.name"
				      :value="item.index">
				    </el-option>
				</el-select> -->
        <div class="actions_btn_wrap down t_right">
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
              <li class="w9p" :title="item.interiorCode">{{item.interiorCode}}</li>
              <li class="w9p" :title="item.productCode">
              	<span class="underline" @click="editHandle(item)">
              	 {{item.productCode}}
              	</span>
              </li>
              <li class="w9p" :title="item.productName">{{item.productName}}</li>
              <li class="w9p" :title="item.materialCode">{{item.materialCode}}</li>
              <li class="w9p" :title="item.brand">{{item.brand}}</li>
              <li class="w9p" :title="item.seasonname">{{item.seasonname}}</li>
              <li class="w9p" :title="item.productComposition">{{item.productComposition}}</li>
              <li class="w9p" :title="item.productClassname">{{item.productClassname}}</li>
              <li class="w9p" :title="item.productStatusname">{{item.productStatusname}}</li>
              <li class="w10p">
                <el-button type="text" @click="editHandle(item)">查看</el-button>
              </li>
            </ul>
          </div> -->
          <singleTable
          :tableList='orderList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @checkHandle='editHandle'
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
      <div class="base_wrap clearfix">
        <h2 class="title">产品基本信息</h2>
        <el-form :inline="true" :model="ruleForm"  ref="ruleForm" label-width="200px" class="demo-form-inline">
          <el-form-item label="产品编号">
            <span>{{ruleForm.productCode}}</span>
          </el-form-item>
           <el-form-item label="系统编号">
            <span>{{ruleForm.interiorCode}}</span>
          </el-form-item>
          <el-form-item label="产品条形码">
            <span>{{ruleForm.productBarcode}}</span>
          </el-form-item>
          <el-form-item label="产品名称">
            <span>{{ruleForm.productName}}</span>
          </el-form-item>
          <el-form-item label="物料编号">
            <span>{{ruleForm.materialCode}}</span>
          </el-form-item>
          <el-form-item label="产品描述">
            <span>{{ruleForm.specification ? ruleForm.specification : ''}}</span>
          </el-form-item>
          <el-form-item label="业务分类">
						<span>{{typeHandle(ruleForm.businessType,this.busiCategorytypelist)}}</span>
          </el-form-item>
          <el-form-item label="产品品牌">
            <span>{{ruleForm.brand}}</span>
          </el-form-item>
          <el-form-item label="产品成分">
            <span>{{ruleForm.productComposition}}</span>
          </el-form-item>  
          <el-form-item label="产品分类">
						<span>{{typeHandle(ruleForm.productClass,this.ProductClasstypelist)}}</span>
          </el-form-item>
          <el-form-item label="产品系列">
           <span>{{ruleForm.productSeries ? ruleForm.productSeries : ''}}</span>
          </el-form-item> 
          <el-form-item label="品类">
						<span>{{typeHandle(ruleForm.category,this.categorytypelist)}}</span>
          </el-form-item>
          <el-form-item label="产品特性">
            <span>{{typeHandle(ruleForm.season,this.seasontypelist)}}</span>          
          </el-form-item>
          <!-- <el-form-item label="产品编号">
            <span>{{ruleForm.productCode}}</span>
          </el-form-item>  -->
          <el-form-item label="产品区分">
						<span>{{typeHandle(ruleForm.productDistinguish,this.distinguishtypelist)}}</span>
          </el-form-item>
           <el-form-item label="销售计量单位">
						<span>{{typeHandle(ruleForm.saleMeasurementUnit,this.SaleUnittypelist)}}</span>
          </el-form-item>
          <el-form-item label="时尚度">          	
						<span>{{typeHandle(ruleForm.fashion,this.ProductFashionDegreetypelist)}}</span>
          </el-form-item>
          <el-form-item label="延米克重">
            <span>{{ruleForm.weightPerMeterShow}}&nbsp;&nbsp;克</span>
          </el-form-item>
          <el-form-item label="销售季">
						<span>{{ruleForm.saleSeasou}}</span>
          </el-form-item> 
           <el-form-item label="每平米克重">
            <span>{{ruleForm.weightPerSquareMeter}}&nbsp;&nbsp;克</span>
          </el-form-item>     
          <el-form-item label="颜色">
						<span>{{typeHandle(ruleForm.color,this.colortypelist)}}</span>
          </el-form-item>    
          <el-form-item label="每个销售单位的物料数量">
            <span>{{ruleForm.numbersPerMeasurementUnit}}&nbsp;&nbsp;</span>
          </el-form-item>
          <el-form-item label="花型">
						<span>{{typeHandle(ruleForm.pattern,this.patterntypelist)}}</span>
          </el-form-item>
          <el-form-item label="幅宽">
            <span>{{ruleForm.width}}&nbsp;&nbsp;</span>
          </el-form-item>
          <!-- <el-form-item label="产品类型">
						<span>{{typeHandle(ruleForm.productType,this.Producttypelist)}}</span>
          </el-form-item> -->
          <!-- <el-form-item label="规格">
            <span>{{ruleForm.specification}}</span>
          </el-form-item>   -->
          <el-form-item label="产地">
            <span>{{typeHandle(ruleForm.placeOfProduction,this.placeProductiontypelist)}}</span>
          </el-form-item>
           <el-form-item label="纱支">
            <span>{{ruleForm.yarnCount}}</span>
          </el-form-item>
           <el-form-item label="上市日期">
            <span>{{ruleForm.validDate}}</span>
          </el-form-item>
           <el-form-item label="最小起订量">
            <span>{{ruleForm.minOrder?ruleForm.minOrder:0}}&nbsp;&nbsp;米</span>
          </el-form-item>   
          <el-form-item label="生命周期">
            <span>{{ruleForm.invalidDate}}</span>
          </el-form-item>
         
          <el-form-item label="替代品">
            <span>{{ruleForm.substitute}}</span>
          </el-form-item>
           <el-form-item label="坯布编号">
            <span>{{ruleForm.rawFabricId}}</span>
          </el-form-item> 
           <el-form-item label="团购推荐指数">
            <!-- <el-rate disabled v-model.trim="ruleForm.suggestIndex"></el-rate> -->
            <span>{{ruleForm.suggestIndex}}</span>
          </el-form-item>    
          <el-form-item label="产品状态">
						<span>{{typeHandle(ruleForm.productStatus,this.statustypelist)}}</span>
          </el-form-item>
          <!-- <el-form-item label="物料组">
            <span>{{ruleForm.materialGroup}}</span>
          </el-form-item>
          -->

        
          <!-- <el-form-item label="物料编号">
            <span>{{ruleForm.materialCode}}</span>
          </el-form-item>
          <el-form-item label="海关编号">
            <span>{{ruleForm.hsCode}}</span>
          </el-form-item> -->
          
           <h2 class="title">面料产品图文信息</h2>
           <el-form-item label="缩略图" class="photo">
           	<ul>
           		<li class="imgclass" v-for="i in this.uploadFileList">
           	    <el-avatar shape="square" :size="100" :src="i.url"></el-avatar>
           		</li>
           	</ul>
          </el-form-item>
          <el-form-item label="面料产品详细信息" prop="remarks" class="last">
          	<span>{{ruleForm.remarks}}</span>
            <!--<el-input
              type="textarea"
              disabled
              :autosize="{ minRows: 8, maxRows: 4}"
              placeholder="多行输入"
              v-model="ruleForm.remarks"
              maxlength="1000"
              show-word-limit>
            </el-input>-->
          </el-form-item>
          
        </el-form>
      </div>
      

      <div class="mt20 fr">
        <el-button type="primary" class="mr10" @click="resetForm()">取消</el-button>
        <!--<el-button type="primary" @click="submitForm('ruleForm')" :loading="loadingcommit">保存</el-button>-->
      </div>
    </div>
    
  
  </div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { 
	productMasterDataList,
	purchasegetuuid,
	productmasterSearch,       
	fabrictypeadd,
	fabrictypedel,
	fabrictypeview,
	fabrictypeupd,	
  deleteUploadFile,
  searchUploadFile
} from "@/api/module/masterDataApi.js";
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
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "fabricMaintain",
  props: [],
  data() {
    return {
      // 上传字段
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileType: '001',
      uploadFileList: [],
      headers: '',
      uploadUrl: process.env.VUE_APP_INFRASTRUCTURE_URL,
      dateVal:'',
      beginTime:'',
      endTime:'',
      // 上传字段 end
      productCode:'',
      dialogdelVisible:false,
      isEdit: false,
      loadingcommit:false,
      tableLoading: true,
      delid:'',
      updid:'',
      edittag:'',
      businessCode:'',
      brand:'',
      materialCode:'',
      season:'',     
      // form
      value1: null,
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
        	weightPerMeter:'',
        	saleMeasurementUnit:'',
        	weightPerSquareMeter:'',
        	numbersPerMeasurementUnit:'',
        	materialCode:'',
        	hsCode:'',
        	rawFabricId:'',
        	validDate:'',
        	delistDate:'',
        	putawayDate:'',
        	invalidDate:'',
        	productBarcode:'',
        	category:'',
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
        	productStatus:'',
        	fashion:'',
        	uuid:'',
          businessType:'',
          remarks: ''
      },
      orderCode: '',
      beginTime: '',
      endTime: '',
      customerId: '',
      orderStatus: '',
      purchaseOrderId: '',
      uuid: '',
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
      suggestIndexTypelist:[],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      fieldList: [
        {
          name: '序号',
          class: 'w9p'
        },
        {
          name: '面料产品系统编号',
          class: 'w9p'
        },
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
          class: 'w9p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex'
          // width:'80'
        },
        // {
        //   name: '面料产品系统编号',
        //   field: 'interiorCode',
        //   //class: 'w50p',
        //   width: '140',
        //   //minWidth: '20%'
        // },
        {
          name:'产品编号',
          field:'productCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品名称',
          field:'productName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'物料编号',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品品牌',
          field:'brand',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name: '产品特性',
          field:'seasonname',
          //class: 'w50p',
          width: '120',
          //minWidth: '20%'
        },
        {
          name:'产品成分',
          field:'productComposition',
          //class: 'w50p',
          width: '120',
          //minWidth: '20%'
        },
        {
          name:'销售季',
          field:'saleSeasou',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'产品状态',
          field:'productStatusname',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '150',
          minWidth: '10%',
          isAction: true,
          hasCheck:true,
        },
      ]
    };
  },
  components: {
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
    // this.getPurchaseOrderList();
    this.getPlaceOfProduction();
    this.fun_date();
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
  	//获取状态名称
  	typeHandle(status,list) {
  		for(var i=0;i<list.length;i++){
      	let item=list[i];
      	if(item.index==status){
      		return item.name
      	}
      }
  	},
    // 上传
    handleUploadRemove(file) {
      // 删除缩略图
      console.log(file);
      if (!file.response) {
        deleteUploadFile(file.id).then(res => {
          if (res.code === '0') {
            this.uploadFileList = this.uploadFileList.filter(item => item.id != file.id);
          }
        });
      } else {
        deleteUploadFile(file.response.data.id).then(res => {
          if (res.code === '0') {
            this.uploadFileList = this.uploadFileList.filter(item => item.id != file.id);
          }
        });
      }
    },
    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功：', response, file, fileList);
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
  		fabrictypebusiCategory().then(response => {
				if(response.code === "0") {
					this.busiCategorytypelist = response.data;
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
  	//产品季
  	getProductSeason(){
  		fabrictypeProductSeason().then(response => {
				if(response.code === "0") {
					
					this.seasontypelist = response.data;
				}
			});
  	},
  	//销售季
  	getSaleSeasou(){
  		fabrictypeSaleSeasou().then(response => {
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
  		fabrictypeSaleUnit().then(response => {
				if(response.code === "0") {
					this.SaleUnittypelist = response.data;	
				}
			});
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
    //产地
  	getPlaceOfProduction(){
      fabrictypedictionaries('PlaceOfProduction').then(response => {
				if(response.code === "0") {					
					this.placeProductiontypelist = response.data;
				}
			});
    },
    // from
    submitForm(formName) {
    	 this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loadingcommit=true;
		    		if(this.edittag=='add'){
//		    			this.ruleForm.businessType="BusinessType";
		    			fabrictypeadd(this.ruleForm).then(response => {
								if(response.code === "0") {
									this.$message({
										message: '添加成功',
										type: 'success'
									});
									this.loadingcommit=false;
									this.isEdit = false;
									this.ruleForm= {};
									this.getPurchaseOrderList();
								}
								setTimeout(() => {
									this.loadingcommit=false;
								}, 3000);
							});
		    		}else{
//		    			this.ruleForm.businessType="BusinessType";
		    			fabrictypeupd(this.ruleForm, this.updid).then(response => {
								if(response.code === "0") {
									this.$message({
										message: '修改成功',
										type: 'success'
									});
									this.loadingcommit=false;
									this.isEdit = false;
									this.ruleForm= {};
									this.getPurchaseOrderList();
								}
								setTimeout(() => {
									this.loadingcommit=false;
								},3000);
							});
		    		} 
            
          } else {
            console.log('error submit!!');
            return false;
          }
       });
    	
    },
    //取消
    resetForm() {
    	this.isEdit = false;
    	this.uploadFileList=[];
    	this.ruleForm={};
    	console.log(this.isEdit)
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      if (this.dateVal) {
        this.beginTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.beginTime = '';
        this.endTime = '';
      }
      this.getPurchaseOrderList();
    },
    editHandle(index,item) {
      // 编辑项
      this.isEdit = true;
      this.edittag='updated';
      this.updid=item.id;
      fabrictypeview(item.id).then(response => {
					if(response.code === "0") {
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
        businessType:'',
        spotProduct:1
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
            if(this.currentPage!=1){
            item.idIndex=(this.currentPage-1)*this.pageSize+(index+1)
            }else{
            item.idIndex=index+1;
            }
          });
          for(var i=0;i<this.orderList.length;i++){
          	let item=this.orderList[i];
          	for(var j=0;j<this.seasontypelist.length;j++){
          		let data=this.seasontypelist[j];
          		if(item.season==data.index){
          			item.seasonname=data.name;
          		}
          	}
          	for(var a=0;a<this.ProductClasstypelist.length;a++){
          		let dataa=this.ProductClasstypelist[a];
          		if(item.productClass==dataa.index){
          			item.productClassname=dataa.name;
          		}
          	}
          	for(var b=0;b<this.statustypelist.length;b++){
          		let datab=this.statustypelist[b];
          		if(item.productStatus==datab.index){
          			item.productStatusname=datab.name;
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
li.imgclass{
	width: 148px;
	height: 148px;
	border-radius: 6px;
	border: 1px solid #c0ccda;
	background-color: #fff;
	overflow: hidden;
	display: inline-block;
	box-sizing: border-box;
	margin: 0 8px 8px 0;
}
.imgWidth{
	width: 100%;
	height: 100%;
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
li.imgclass .el-avatar.el-avatar--square{
	  height: 148px!important;
    width: 148px !important;
    line-height: 148px !important;
}
</style>