<template>
  <div class="container compositeMaterials">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">组合物料分类：</span>
            <el-select class="select_single w200 mr10"
              v-model="materialClassification"
              @change="getMaterialsFabricList"
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in this.MaterialClasstypelist"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">组合物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
        </div>

        <!-- <el-select v-model.trim="materialClassification" placeholder="" class="selectfabc">
        	<el-option key="" label="请选择组合物料分类" value=""></el-option>
				    <el-option
				      v-for="item in this.MaterialClasstypelist"
				      :key="item.index"
				      :label="item.name"
				      :value="item.index">
				    </el-option>
			</el-select>     
        <el-input class="input_single w200 mr10 mb10" v-model.trim="materialCode" placeholder="组合物料编号"></el-input> -->
        <div class="actions_btn_wrap down t_right">
          <el-button type="primary" class="mr10" @click="exportHandle" v-preventReClick :disabled="this.isLoadingExport">导出</el-button>
          <el-upload :headers="myHeaders" class="upload-demo inline_block mr10" :action="this.uploadurl"  accept=".xlsx" 
            :before-upload="beforeupload" :show-file-list="showfilelist" :on-success="UploadSuccess">
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
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in fabricList"
              :key="index">
              <li class="w10p">{{item.id}}</li>
              <li class="w20p" :title="item.insideCode">{{item.insideCode}}</li>
              <li class="w15p" :title="item.materialCode">{{item.materialCode}}</li>
              <li class="w15p" :title="item.materialName">{{item.materialName}}</li>
              <li class="w12p" :title="typeHandle(item.materialClassification)">{{typeHandle(item.materialClassification)}}</li>
              <li class="w12p" :title="item.sale">{{item.sale==true?'可售':'停售'}}</li>             
              <li class="w10p">
                <i type="primary" class="el-icon-edit" title="修改" @click="editHandle(item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(item)"></i>
                <i type="primary" class="el-icon-document" title="查看" @click="checkHandle(item)"></i>
              </li>
            </ul>
          </div> -->
          <singleTable
          :tableList='fabricList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteHandle'
          @cloneHandle='cloneHandle'
          @editHandle='editHandle'
          @checkHandle='checkHandle'
          ></singleTable>
        </el-tabs>
        <!-- <p v-if="!this.fabricList.length&&!tableLoading" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
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
        <compositeMaterialsCheck :list="ruleForm" :uploadFileList="uploadFileList" @cancelHandle="resetForm"></compositeMaterialsCheck>
      </div>

      <div v-else>
        <div class="base_wrap clearfix finished">
          <h2 class="title">物料基本信息</h2>
          
          <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm"  label-width="200px" class="demo-form-inline">
            <el-form-item label="物料编号" prop="materialCode">
              <el-input :disabled="isEditor"  @change="hasRepeatMeterialClick(ruleForm)" @keyup.native="onkeyupMaterialCode($event)" v-model.trim="ruleForm.materialCode"></el-input>
            </el-form-item>          
            <el-form-item label="系统编号">
              <span>{{ruleForm.materialId}}</span>
              <!-- <el-input :disabled="true" v-model.trim="ruleForm.materialId"></el-input> -->
            </el-form-item>            
            <el-form-item label="物料名称">
              <el-input v-model.trim="ruleForm.materialName"></el-input>
            </el-form-item>
            <el-form-item label="生产商名称">
              <el-input v-model.trim="ruleForm.manufacturerName"></el-input>
            </el-form-item>
            <el-form-item label="物料分类">
              <el-select  v-model.trim="ruleForm.materialClassification" placeholder="请选择">
                <el-option v-for="item in MaterialClasstypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="供应商编号">
              <!-- <el-select
                class="w200"
                v-model.trim="ruleForm.supplierId"
                ref="select"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="supplierNameRemote"
                @change="selectSupplierclick(ruleForm)"
                @click.native="selectSupplierCondition(ruleForm)"
                :loading="loading">
                <el-option
                  v-for="item in supplierNameList"
                  :key="item.supplierId"
                  :label="item.supplierCode"
                  :value="item.supplierId">
                </el-option>
              </el-select> -->
              <el-select class="select_single w200 mr10"
                v-model="ruleForm.supplierId"
                @change="selectSupplierclick(ruleForm)"
                filterable
                placeholder="请选择">
                <el-option
                  v-for="item in supplierNameList"
                  :key="item.supplierId"
                  :label="item.supplierCode"
                  :value="item.supplierId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物料属性">
              <el-select  v-model.trim="ruleForm.materialProperties" placeholder="请选择">
                <el-option v-for="item in MaterialPropertiestypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商名称">
              <div :title="ruleForm.supplierName" class="ellipsis w200">{{ruleForm.supplierName?ruleForm.supplierName:''}}</div>
              <!-- <span :title="ruleForm.supplierName" class="ellipsis w200 inline_block">{{ruleForm.supplierName?ruleForm.supplierName:''}}</span> -->
            </el-form-item>
            
            <el-form-item label="产品特性">
              <el-select  v-model.trim="ruleForm.productSeason" placeholder="请选择">
                <el-option v-for="item in seasontypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="总页数">
              <el-input v-model.trim="ruleForm.pageCount" maxlength="6" @keyup.native="InputNumber('pageCount')" @change="InputNumber('pageCount')" autocomplete="off"></el-input>&nbsp;&nbsp;页
            </el-form-item>
            <el-form-item label="销售季" prop="saleSeason">
                <el-select  v-model.trim="ruleForm.saleSeason" placeholder="请选择">
                  <el-option v-for="item in SaleSeasoutypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="品牌">         	
              <el-select  v-model.trim="ruleForm.brand" placeholder="请选择">
                <el-option v-for="item in productCodetypelist" :key="item.dictItemValue" :value="item.dictItemValue" :label="item.dictItemName"></el-option>
              </el-select>
            </el-form-item>
             <!-- <el-form-item label="品牌">         	
              <el-select  v-model.trim="ruleForm.brand" placeholder="请选择">
                <el-option v-for="item in MaterialCodetypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="计量单位" prop="calculationUnit">
              <el-select  v-model.trim="ruleForm.calculationUnit" placeholder="请选择" @change='getunitGram(ruleForm)'>
                <el-option v-for="item in SaleUnittypelist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上市时间">
                    <el-date-picker
                    v-model.trim="ruleForm.validDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item>  
            <el-form-item label="单位重量">
              <el-input class="w200"  :disabled="true" v-model="ruleForm.unitGram" maxlength="6" @keyup.native="InputNumber('unitGram')" @change="InputNumber('unitGram')" ></el-input>&nbsp;&nbsp;克
            </el-form-item>
             <el-form-item label="报关品类">
              <el-select class="w200" v-model.trim="ruleForm.declarationCategory" @change="selectdeclarationCategory(ruleForm)" placeholder="请选择">
                <el-option v-for="item in materialDeclarationCategorylist" :key="item.index" :value="item.index" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="生命周期">
               <el-date-picker
                    v-model.trim="ruleForm.invalidDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    placeholder="选择日期">
                  </el-date-picker>
            </el-form-item> 
            <el-form-item label="海关编号">
              <span>{{ruleForm.hsCode}}</span>
            </el-form-item>
             <el-form-item label="杂费系数">
              <el-input class="w200" v-model.trim="ruleForm.miscChargesCoefficient" maxlength="10" @keyup.native="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)" @change="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)"></el-input>
              &nbsp;&nbsp;
            </el-form-item>
            <el-form-item label="海关关税系数">
                <span>{{ruleForm.customsTariffCoefficient}}</span>
            </el-form-item>
             <el-form-item label="增值税系数">
              <el-input class="w200" v-model.trim="ruleForm.valueAddedTaxCoefficient" maxlength="10" @keyup.native="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)" @change="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)"></el-input>
            </el-form-item>          
            <el-form-item class="whole" label="备注" prop="remarks">
              <el-input v-model.trim="ruleForm.remarks"></el-input>
            </el-form-item>
            
            <hr style="border: 0.5px solid #DCDFE6;" />
            <div class="childtit">
              <h2 class="title">组合物料组成信息</h2>
              <el-button
                size="small"
                type="primary"
                icon="el-icon-plus"
                circle
                title="添加"
                @click="addHandlechild"
            ></el-button>
            </div>         
            <div class="addcontent_content">
              <ul class="content_form" v-if="ifchildshow==true"  v-for="(item,index) in this.ruleForm.combinedMaterialMessagesList"
                :key="index">
                <li class="w17p">
                  <span class="red mt">*</span>
                    <!-- @click.native="getCombinedMaterialRemote(item)" -->
                  <div class="form_item">
                    <span>组成物料编号:</span>
                     <el-select
                      v-model.trim="item.combinedMaterialCode"
                      ref="select"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择"
                      :remote-method="combinedMaterialRemote"
                      @change="selectCombinedMaterialclick(item)"
                      :loading="loading">
                      <el-option
                        v-for="item in combinedMaterialCodeList"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </li>
                <li class="w10p">
                  <!-- <span class="red mt">*</span> -->
                  <div class="form_item">
                    <span>数量:</span>
                    <el-input  maxlength="6" @keyup.native="Inputquantity(item)" @change="Inputquantity(item)"  v-model.trim="item.quantity"></el-input>
                  </div>
                </li>        		
                <li class="w3p">
                  <div class="form_item">
                    <span>单位</span>
                  </div>
                </li>	
                <li class="w8p">
                  <div class="form_item">
                    <span>页码:</span>
                    <el-input maxlength="6" @keyup.native="InputpageNumber(item)" @change="InputpageNumber(item)" v-model.trim="item.pageNumber"></el-input>
                  </div>
                </li>  
                <li class="w9p">
                  <div class="form_item">
                    <span>位置:</span>
                    <el-select  v-model.trim="item.position"  placeholder="请选择">
                      <el-option v-for="i in item.positionlist" maxlength="6" :key="i.index" :value="i.index" :label="i.name">{{i.name}}</el-option>
                    </el-select>
                  </div>
                </li>         		
                <li class="w10p">
                  <div class="form_item">
                    <span>长:</span>
                    <el-input maxlength="6"  @keyup.native="Inputlength(item)" @change="Inputlength(item)" v-model.trim="item.length"></el-input>
                    <span>厘米</span>
                  </div>
                </li>
                <li class="w10p">
                  <div class="form_item">
                    <span>宽:</span>
                    <el-input maxlength="6"  @keyup.native="Inputwidth(item)" @change="Inputwidth(item)" v-model.trim="item.width"></el-input>
                    <span>厘米</span>
                  </div>
                </li>    
                <li class="w11p">
                  <!-- 判断组合物料分类为画册时拍照款为必填项 -->
                  <!-- <span class="red mt" v-if="ruleForm.materialClassification==2">*</span>  -->
                  <span class="red mt">*</span>
                  <div class="form_item">
                    <span>拍照款:</span>
                    <el-select  v-model.trim="item.photoStyle"  @change="selectsupclick(item)" placeholder="请选择">
                      <el-option v-for="i in item.photoStylelist" maxlength="6" :key="i.ifphoto" :value="i.ifphoto" :label="i.name"></el-option>
                    </el-select>
                  </div>
                </li>
                <li class="w9p">
                  <div class="form_item">
                    <span>备注:</span>
                     <el-select
                      v-model.trim="item.remarks"
                      ref="select"
                      filterable
                      remote
                      reserve-keyword
                      placeholder="请选择"
                      :remote-method="(query)=>{combinedProductRemote(query,item)}"
                      @change="selectCombinedProductclick(item)"
                      :loading="loading">
                      <el-option
                        v-for="i in item.combinedProductCodeList"
                        :key="i.productCode"
                        :label="i.productCode"
                        :value="i.productCode">
                      </el-option>
                    </el-select>
                    <!-- <el-input maxlength="235" v-model.trim="item.remarks"></el-input> -->
                  </div>
                </li>
                <li class="w3p">
                  <el-button
                    type="danger"
                    title="删除"
                    icon="el-icon-minus"
                    circle
                    @click="childdel(index,item)"
                  ></el-button>
                </li>
              </ul>
              <div class="formtable_null" style="text-align: center;margin-top: 15px;" v-if="ifchildshow==false">
                <img src="../../../assets/image/add.png" style="width:200px;height:100px;" />
                <p>信息空空如也去添加组成信息</p>
              </div>
            </div>
            
          
          </el-form>
        </div>
        <div class="mt20 fr">
          <el-button class="mr10" @click="resetForm('ruleForm')">取消</el-button>     
          <!-- :disabled="surecommit" :title="surecommittitle" -->
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="this.loadingcommit"  v-preventReClick>保存</el-button>
        </div>
      </div>
      
    </div>
    
    
    <!--删除-->
	<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
		<span>确定删除该条组合物料主数据?</span>
		<span slot="footer" class="dialog-footer">
	    <el-button @click="dialogdelVisible = false">取 消</el-button>
	    <el-button type="primary" :loading="removeloading" @click="delVisibleclick()">确 定</el-button>
	  </span>
	</el-dialog>
    
   
    
  </div>
</template>

<script>
import {postpermission,exportFileCompositeMaterials} from "@/api/accessPermission.js";
import { 
	purchasegetuuid,
	materialsFabricList,
	fabrictypeadd,
  fabrictypeupd,
  fabrictypedel,
  fabrictypeview,
	purchasegetmaterialCode,
} from "@/api/module/compositeMaterialsApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
import {getCheckMaterialCode,getHsCode} from "@/api/module/materialsApi.js";
import {getProductCodeByMC} from "@/api/publicApi.js";
import {
  fabrictypeProductSeason,
  fabrictypeSaleUnit,
  fabrictypeMaterialCode,
  fabrictypeMaterialproperties,
  fabricCompositeMaterial,
  fabrictypeMaterialUnit,
  fabrictypeSaleSeasou,
  fabrictypePosition,
  fabrictypedictionariesUncons,
  fabrictypedictionaries
} from "@/api/module/dictionariesApi.js";
import { timeFormat } from '@/utils/index.js';
import compositeMaterialsCheck from '../compositeMaterialsCheck/Index.vue';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "compositeMaterials",
  props: [],
  data() {
    return {
      myHeaders: {
                Authorization:'bearer '+this.$keycloak.token
      },
      uploadurl:'',
      showfilelist:false,
      actionsType: '',
    	surecommittitle:'',
      inputData: '',
      fabricList: [],
      combinedMaterialCodeList:[],
      isEdit: false,
      loadingcommit:false,
       removeloading:false,
      dialogdelVisible:false,
      ifchildshow: false,
      nullboolean: true,
      sameboolean:true,
      surecommit:true,
      tableLoading: true,
      isEditor:false,
      errorMaterial:true,
      delid:'',
      updid:'',
      edittag:'',
      brand:'',
      supplierName:'',
      materialCode:'',
      materialClassification:'',
      SaleUnittypelist:[],
		  ProductTypetypelist:[],
		  seasontypelist:[],
		  MaterialCodetypelist:[],
		  MaterialPropertiestypelist:[],
		  MaterialClasstypelist:[],
		  MaterialUnittypelist:[],	 
      SaleSeasoutypelist:[],
      materialSupplyTypelist:[],
      materialDeclarationCategorylist:[],
      combinedProductCodeList:[],
      productCodetypelist:[],
      supplierNameList:[],
	  rules: {         
          materialBarcode:[
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          supplierId:[
            { required: true, message: '请选择供应商编号', trigger: 'change' }
          ],
          pageCount:[
            { type: 'number',message: '总页数必须为数字值', trigger: 'change' }
          ],
          manufacturerName:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          remarks:[
            { min:0, max:255, message: '超长字符', trigger: 'blur' }
          ],
          validDate:[
            { type: 'string',required: true, message:'请输入上市时间', trigger: 'change'}
          ],
          invalidDate:[
            { type: 'string',required: true, message:'请输入生命周期', trigger: 'change'}
          ],
          materialClassification:[
            { required: true, message: '请选择组合物料分类', trigger: 'change' }
          ],        
          calculationUnit:[
            { required: true, message: '请选择计量单位', trigger: 'change' }
          ],
          declarationCategory:[
            { required: true, message: '请选择报关品类', trigger: 'change' }
          ],
          brand:[
            { required: true, message: '请选择品牌', trigger: 'change' }
          ],
          productSeason:[
            { required: true, message: '请选择产品特性', trigger: 'change' }
          ],
          saleSeason:[
            { required: true, message: '请选择销售季', trigger: 'change' }
          ],
          miscChargesCoefficient: [
            { required: true, message: '请输入杂费系数', trigger: 'blur' }
          ],
          valueAddedTaxCoefficient: [
            { required: true, message: '请输入增值税系数', trigger: 'blur' }
          ],
          materialCode: [
            { required: true, message: '请输入组合物料编号', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
            // { validator:function(rule,value,callback){
            //               //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
            //               if(/^[A-Za-z0-9-_]+$/.test(value) == false){
            //                   callback(new Error("只能输入数字、字母、下划线、横杠"));
            //               }else{
            //                   //校验通过
            //                   callback();
            //               }
            //             }, trigger: 'blur'
            //  }
          ],
          materialName:[
            { required: true, message: '请输入组合物料名称', trigger: 'blur' },
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
            // { validator:function(rule,value,callback){
            //               //校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
            //               if(/^[\u0391-\uFFE5A-Za-z]+$/.test(value) == false){
            //                   callback(new Error("请输入汉字和英文"));
            //               }else{
            //                   //校验通过
            //                   callback();
            //               }
            //             }, trigger: 'blur'
            //  }
           ],
          
          
       },
      // form
      ruleForm:{
        	materialCode:'',
          insideCode:'',
          materialName:'',
          materialProperties:'',
          materialClassification:'',
          pageCount:'',
          brand:'',
          manufacturerName:'',
          supplierName:'',
          supplierId:'',
          validDate:'',
          productSeason:'',
          invalidDate:'',
          saleSeason:'',
          sale:false,
          oceanFreightCoefficient:'',
		      airFreightCoefficient:'',
		      agentChargeCoefficient:'',
		      miscChargesCoefficient:'',
		      valueAddedTaxCoefficient:'',
          customsTariffCoefficient:'',
          whetherSupply:'',
          unitGram:'450',
          calculationUnit:'Book',
          miscChargesCoefficient: "0.0012",
          valueAddedTaxCoefficient: "0.13",
          declarationCategory:'1',
          customsTariffCoefficient: "0.086",
          hsCode: "51121100",
          remarks:'',
          uuid:'',
		      combinedMaterialMessagesList:[],
      },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      positionlist:[],
      timeout:  null,
      restaurants: [],
      list:[
       {
       	value:'1112'
       },
       {
       	value:'1122'
       },
       {
       	value:'1123'
       }
      ],
      photoStylelist:[
        {
          name:'是',
          index:'1',
          ifphoto:true
        },
        {
          name:'否',
          index:'2',
          ifphoto:false
        }
      ],
      fieldList: [
        {
          name: '序号',
          class: 'w10p'
        },
        // {
        //   name: '组合物料系统编号',
        //   class: 'w20p'
        // },
        {
          name: '组合物料编号',
          class: 'w15p'
        },
        {
          name: '组合物料名称',
          class: 'w15p'
        },
        {
          name: '物料分类',
          class: 'w12p'
        },
        {
          name: '品牌',
          class: 'w12p'
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
          field: 'idIndex',
        },
        // {
        //   name: '组合物料系统编号',
        //   field: 'materialId',
        //   //class: 'w50p',
        //   width: '150',
        //   //minWidth: '20%'
        // },
        {
          name:'组合物料编号',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'组合物料名称',
          field:'materialName',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        
        {
          name:'物料分类',
          field:'',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
          materialHandle:'materialHandle'
        },
        {
          name:'品牌',
          field:'brand',
          //class: 'w10p',
          // width: '150',
          //minWidth: '10%'
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
    compositeMaterialsCheck,
    singleTable
  },
  beforeCreate() {

  },
  created() {
  },
  mounted() {
  	this.getMaterialClass();
    this.getSaleUnit();
    this.getProductSeason();
    this.getMaterialCode();
    this.getProductmaterialproperties();
    this.getSaleSeasou();
    this.getSalePosition(); 
    this.getMaterialSupplyType();
    this.getMaterialDeclarationCategory();
    this.getProductCode();
    this.getSupplierNameList();
    this.getMaterialsFabricList();
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
      this.uploadurl=process.env.VUE_APP_SCMREPORT_URL + 'reportservice/v1/importExcelCombinedMaterial';
      console.log(this.uploadurl)
    },
    //导出
    exportHandle(){
         this.tableLoading = true;
         this.isLoadingExport=true;
           let obj={
            materialClassification:this.materialClassification,
            materialCode:this.materialCode
          }
           exportFileCompositeMaterials(JSON.stringify(obj)).then(res => {
             console.log(res);
              this.tableLoading = false;
              this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '组合物料主数据'+'.xlsx'; //下载后文件名
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
           });
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
          this.tableLoading = false;
          this.isLoadingImport=false;
					this.$message({
						message: '导入成功',
						type: 'success'
					});
					this.getMaterialsFabricList();
				}else{
					this.$message({
						message:response.message,
						type: 'error'
          });
          this.tableLoading = false;
          this.isLoadingImport=false;
				}
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
                     getCheckMaterialCode(str).then(res => {
                      if (res.code === '0') {
                        console.log(res.data);
                        if(res.data!=null){
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
     //物料编号重复校验
    hasRepeatMeterialClick(item){
      var str=encodeURIComponent(this.ruleForm.materialCode);
      getCheckMaterialCode(str).then(res => {
        if (res.code === '0') {
          if(res.data!=null){
              this.errorMaterial=false;
             item.materialCode='';
             this.$message({
                message: '该物料编号在组合物料数据中已存在',
                type: 'error'
             }); 
          }else{
             this.errorMaterial=true;
          }
        }else{
          item.materialCode='';
        }
      });
    },
  	//获取状态名称
  	typeHandle(status) {
		  for(var i=0;i<this.MaterialClasstypelist.length;i++){
      	let item=this.MaterialClasstypelist[i];
      	if(item.index==status){
      		return item.name
      	}
      }
    },
   
     //报关品类带出海关系数和编号
    selectdeclarationCategory(item){
      console.log(item)
      let obj={
        index:item.declarationCategory
      }
      getHsCode(item.declarationCategory).then(res => {
        if (res.code === '0') {
          item.hsCode=res.data.hsCode;
          item.customsTariffCoefficient=res.data.customsTariffCoefficient;
        }
      });
    },
    oninput(num) {
  		console.log(num)
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
		},
  	 // 过滤输入的数字
    InputNumber(property) {
    	console.log(property)
       this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
     },
      // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
    	console.log(val)
      if (val === 0 || val === '0' || val === '') {
        return ''
      }else {
        let value = null
        value = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        console.log(value)
        return Number(value)
      }
     },
  	//位置
  	getSalePosition(){
  		fabrictypePosition().then(response => {
				if(response.code === "0") {
					this.positionlist = response.data;	
				}
			});
    },
     //产品品牌
    getProductCode(){
  		fabrictypedictionariesUncons('combinedMaterialBrand').then(response => {
				if(response.code === "0") {
					this.productCodetypelist = response.data;	
				}
      });
    },
  	//销售季
  	getSaleSeasou(){
      fabrictypedictionaries('CombinedMaterialSaleSeason').then(response => {
        if (response.code === "0") {
          this.SaleSeasoutypelist = response.data;
        }
      });
  	},
  	//物料分类
  	getMaterialClass(){
  		fabricCompositeMaterial().then(response => {
				if(response.code === "0") {
					this.MaterialClasstypelist = response.data;	
				}
			});
  	},
  	//物料属性
  	getProductmaterialproperties(){
  		// fabrictypeMaterialproperties().then(response => {
			// 	if(response.code === "0") {
			// 		this.MaterialPropertiestypelist = response.data;	
			// 	}
      // });
      fabrictypedictionaries('CombinedMaterialProperties').then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;
        }
      });
  	},
  	//物料品牌
  	getMaterialCode(){
  		// fabrictypeMaterialCode().then(response => {
			// 	if(response.code === "0") {
			// 		this.MaterialCodetypelist = response.data;	
			// 	}
      // });
      this.MaterialCodetypelist=[];
    },
      //获取是否可供
    getMaterialSupplyType(){
       fabrictypedictionaries('MaterialSupplyType').then(response => {
        if (response.code === "0") {
          this.materialSupplyTypelist = response.data;
        }
      });
    },
     //报关品类
    getMaterialDeclarationCategory(){
      fabrictypedictionaries('MaterialDeclarationCategory').then(response => {
				if(response.code === "0") {					
					this.materialDeclarationCategorylist = response.data;
				}
			});
    },
    
  	//采购计量单位
  	getSaleUnit(){
      fabrictypedictionaries('CombinedMaterialUnit').then(response => {
				if(response.code === "0") {					
					this.SaleUnittypelist = response.data;
				}
			});
  	},
  	//产品特性
  	getProductSeason(){ 		
  		fabrictypeProductSeason().then(response => {
				if(response.code === "0") {					
					this.seasontypelist = response.data;
					for(var i=0;i<this.ruleForm.combinedMaterialMessagesList;i++){
						let item=this.ruleForm.combinedMaterialMessagesList[i];
						item.seasontypelist=response.data;
					}
					
				}
			});
    },
    //供应商
    getSupplierNameList() {
      supplierNameData('', '','').then(res => {
        console.log('供应商名称：', res);
        if (res.code === '0') {
          this.supplierNameList = res.data;
        }
      });
    },
  	changeCode() {
  		console.log(this.ruleForm)
		},
		// 过滤输入的数字
    InputNumber (property) {
      this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property])
    },
    InputpageNumber(item){
    	  let val= item.pageNumber;
    	  console.log(val)
    	  item.pageNumber = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.pageNumber = item.pageNumber.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.pageNumber = item.pageNumber.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputlength(item){
    	  let val= item.length;
    	  console.log(val)
    	  item.length = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.length = item.length.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.length = item.length.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputwidth(item){
    	 let val= item.width;
    	  console.log(val)
    	  item.width = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.width = item.width.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.width = item.width.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    Inputquantity(item){
    	 let val= item.quantity;
    	  console.log(val)
    	  item.quantity = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        item.quantity = item.quantity.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        item.quantity = item.quantity.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber (val) {
      if (val === 0 || val === '0' || val === '') {
        return ''
      } else {
        let value = null
        value = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
        value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        return Number(value)
      }
    },
    supplierNameRemote(query) {
      console.log('query: ', query);
      console.log(this.ruleForm.supplierName)
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          supplierNameData('','',query).then(res => {
            if (res.code === '0') {
              this.supplierNameList = res.data.filter(item => {
                return item.supplierCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
              });
            }
          });
        }, 500);
      } else {
        this.supplierNameList = [];
      }
     
    },
    selectSupplierCondition(val){
      if(val.supplierName==''){
        this.getSupplierNameList();
      }
    },
    supplierNameChange(val) {
      console.log('史蒂夫后市', val);
    },
    selectsupclick(item){
      console.log(item.photoStyletag);
    },
     //供应商下拉选项触发
    selectSupplierclick(item){
      // console.log(this.ruleForm.supplierName)
      console.log(item)
      for(var i=0;i<this.supplierNameList.length;i++){
        let data=this.supplierNameList[i];
        if(item.supplierId==data.supplierId){
          item.supplierName=data.supplierName;
        }
      }
    },
    // from
    submitForm(formName) {    	
    	  this.$refs[formName].validate((valid) => {
          if (valid) {       
            console.log(this.ruleForm)    
            if(this.ruleForm.combinedMaterialMessagesList.length>0){
               for(var i=0;i<this.ruleForm.combinedMaterialMessagesList.length;i++){
                  let item=this.ruleForm.combinedMaterialMessagesList[i];
                  // if(this.ruleForm.materialClassification=='2'){
                    //判断是否拍照款
                    if(item.combinedMaterialCode==''){
                      this.nullboolean = false;
                      break;
                    }else{
                      this.nullboolean=true;           			
                    }
                  //判断两条数据不能相同
                  for(var j=i+1; j<this.ruleForm.combinedMaterialMessagesList.length; j++){
                      let jitem=this.ruleForm.combinedMaterialMessagesList[j];
                        if(item.position==jitem.position&&item.pageNumber==jitem.pageNumber){
                          this.$message({
                              message: "组合物料组成信息两条数据的页码和位置不能都相同!!",
                              type: "error"
                            });
                          return false;
                        }
                  }             
                }
            }else{
               this.nullboolean=true;
            }     
            if(this.nullboolean==false){
            		this.$message({
					          message: "组合物料组成信息必填项不能为空!!",
					          type: "error"
					        });
            }else if(this.errorMaterial==false){
              return false;
            }else{
                this.loadingcommit=true;
                // console.log(this.ruleForm)
            		fabrictypeadd(this.ruleForm).then(response => {
									if(response.code === "0") {
										this.$message({
											message:this.edittag+'成功',
											type: 'success'
										});
										this.loadingcommit=false;
										this.isEdit = false;
										this.surecommittitle='';
										this.surecommit=true;
										this.ruleForm= {
                      calculationUnit:'Book',
                      miscChargesCoefficient: "0.0012",
                      valueAddedTaxCoefficient: "0.13",
                      declarationCategory:'1',
                       unitGram:'450',
                      customsTariffCoefficient: "0.086",
                      hsCode: "51121100",
											combinedMaterialMessagesList:[]
										};
										this.getMaterialsFabricList();
									}else{
                    this.nullboolean=false;
                    this.loadingcommit=false;
									}
									setTimeout(() => {
										this.loadingcommit=false;
									},3000);
								});
            	}
		    		console.log('nullboolean&&'+this.nullboolean)	
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    	
    },
    getunitGram(ruleForm){
      console.log(ruleForm)
    },
    resetForm() {
       this.isEdit = false;
       this.ruleForm= {
          calculationUnit:'Book',
          miscChargesCoefficient: "0.0012",
          valueAddedTaxCoefficient: "0.13",
          declarationCategory:'1',
           unitGram:'450',
          customsTariffCoefficient: "0.086",
          hsCode: "51121100",
					combinedMaterialMessagesList:[]
			 };
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getMaterialsFabricList();
    },
    addHandle() {
      // 添加
      this.actionsType = 'add';
      this.edittag='添加';
      this.isEdit = true;
      this.ifchildshow = false;
      // this.isEditor=false;
      this.surecommittitle='请添加物料组成信息'
      this.surecommit=true;
      purchasegetuuid().then(response => {
				if(response.code === "0") {
					this.ruleForm.uuid = response.data;
				}
		  });
    },
    addHandlechild(){
    	console.log(this.ruleForm)
    	this.ifchildshow = true;
    	this.surecommit=false;
    	//子项添加
    	var addobj = {
        positionlist:this.positionlist,   
        photoStylelist:this.photoStylelist,
  			combinedMaterialCode:'',
	  		quantity:'',
	  		pageNumber:'',
	  		position:'',
	  		length:'',
	  		width:'',
        photoStyle:false,
	  		remarks:'',
	  		uuid:'',
      };
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          addobj.uuid = response.data;
        }
      });
      this.ruleForm.combinedMaterialMessagesList.push(addobj);
      console.log(this.ruleForm)
    },    
    combinedMaterialRemote(query,item) {
      console.log('query: ', query);
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          purchasegetmaterialCode(query).then(res => {
            if (res.code === "0") {
                  this.combinedMaterialCodeList = res.data.filter(item => {
                    return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1;
                  });   
            }
          });
        }, 500);
      } else {
        this.combinedMaterialCodeList = [];
      }
    },
    getCombinedMaterialRemote(val) {
       purchasegetmaterialCode(val.combinedMaterialCode).then(res => {
          if (res.code === "0") {
                this.combinedMaterialCodeList = res.data.filter(item => {
                  return item.value.toLowerCase().indexOf(val.combinedMaterialCode.toLowerCase()) > -1;
                });   
          }
        });
    },
    //输入组合物料编号带出产品编号
    combinedProductRemote(query,item){
       console.log('query: ', query);
       console.log(item)
        if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          getProductCodeByMC(item.combinedMaterialCode,'',query).then(res => {
            if (res.code === "0") {
                  this.combinedProductCodeList = res.data.filter(item => {
                    return item.productCode.toLowerCase().indexOf(query.toLowerCase()) > -1;
                  });   
            }
          });
        }, 500);
      } else {
        this.combinedProductCodeList = [];
      }
    },
    selectCombinedMaterialclick(item){
      console.log(item.combinedMaterialCode)
       getProductCodeByMC(item.combinedMaterialCode,'','').then(res => {
            if (res.code === "0") {
              item.combinedProductCodeList = res.data;
              this.$forceUpdate();
                  // this.combinedProductCodeList = res.data.filter(item => {
                  //   return item.productCode.toLowerCase().indexOf(item.combinedMaterialCode.toLowerCase()) > -1;
                  // });   
            }
       });
    },
    selectCombinedProductclick(item){
      console.log(item)
    },
    childdel(index,item){
    	if (this.ruleForm.combinedMaterialMessagesList.length > 1) {
        this.ruleForm.combinedMaterialMessagesList.splice(index, 1);
        this.surecommit=false;
        this.sameboolean=true;
      }else {
        this.ifchildshow = false;
        this.sameboolean=true;
        this.surecommit=true;
        this.surecommittitle='请添加物料组成信息'
        this.ruleForm.combinedMaterialMessagesList = [];
      }
    },
    editHandle(index,item) {
      // 编辑项
      this.actionsType = 'edit';
      this.editType = 'edit';
      this.isEdit = true;
      this.ifchildshow = true;
      this.edittag='修改';
      this.updid=item.id;
      this.surecommittitle=''
      // this.isEditor=true;
      this.surecommit=false;
      fabrictypeview(item.id).then(response => {
			if(response.code === "0") {
        if(response.data.unitGram==null){
          response.data.unitGram='450';
        }
        this.ruleForm=response.data;
        this.ruleForm.validDate = response.data.validDate ? timeFormat(response.data.validDate).split(' ')[0] : '';
        this.ruleForm.invalidDate= response.data.invalidDate ? timeFormat(response.data.invalidDate).split(' ')[0] : '';
				for(var i=0;i<this.ruleForm.combinedMaterialMessagesList.length;i++){
          let item=this.ruleForm.combinedMaterialMessagesList[i];
          item.positionlist=this.positionlist;
          item.photoStylelist=this.photoStylelist;
          if(item.combinedMaterialCode!=''){
            this.selectCombinedMaterialclick(item);
          }
				}
				console.log(this.ruleForm)
			}
	  });
    },
    cloneHandle(item) {
      this.actionsType = 'add';
      this.edittag='添加';
      this.isEdit = true;
      this.ifchildshow = true;
      this.surecommittitle=''
      // this.surecommittitle='请添加物料组成信息'
      this.surecommit=false;
      fabrictypeview(item.id).then(response => {
        if(response.code === "0") {
          if(response.data.unitGram==null){
            response.data.unitGram='450';
          }
          this.ruleForm=response.data;
          purchasegetuuid().then(response => {
            if(response.code === "0") {
              this.ruleForm.uuid = response.data;
            }
          });
          this.ruleForm.validDate = response.data.validDate ? timeFormat(response.data.validDate).split(' ')[0] : '';
          this.ruleForm.invalidDate= response.data.invalidDate ? timeFormat(response.data.invalidDate).split(' ')[0] : '';
          for(var i=0;i<this.ruleForm.combinedMaterialMessagesList.length;i++){
            let item=this.ruleForm.combinedMaterialMessagesList[i];
            item.positionlist=this.positionlist;
            item.photoStylelist=this.photoStylelist;
            purchasegetuuid().then(response => {
              if(response.code === "0") {
               item.uuid = response.data;
              }
            });
          }
          console.log(this.ruleForm)
        }
      });
    },
    deleteHandle(index,item) {
      // 删除项
      this.delid=item.id;
      this.dialogdelVisible = true;
    },
    checkHandle(index,item) {
      // 查看详情
      console.log('查看详情模板：', item);
      this.actionsType = 'check';
      this.edittag = '查看';
      this.ifchildshow = true;
      this.updid=item.id;
      this.isEdit = true;
      fabrictypeview(item.id).then(response => {
        if(response.code === "0") {
          this.ruleForm = response.data;
          for(var i=0;i<this.ruleForm.combinedMaterialMessagesList.length;i++){
            let item=this.ruleForm.combinedMaterialMessagesList[i];
            item.positionlist=this.positionlist;
          }
          if(this.ruleForm.validDate!=null&&this.ruleForm.validDate!=''){
            let date = timeFormat(response.data.validDate);
            this.ruleForm.validDate = date.split(' ')[0];
          }
          if(this.ruleForm.invalidDate!=null&&this.ruleForm.invalidDate!=''){
            let date = timeFormat(response.data.invalidDate);
            this.ruleForm.invalidDate = date.split(' ')[0];
          }
        }
      });
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
				this.getMaterialsFabricList();
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
      this.getMaterialsFabricList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getMaterialsFabricList();
    },
    getMaterialsFabricList() {
    	this.tableLoading = true;
      let data = {
        materialClassification: this.materialClassification,
        materialCode:this.materialCode
      };
      materialsFabricList(this.currentPage, this.pageSize, data).then(res => {
	       console.log('面料物料主数据列表：', res);
	       if (res.code === '0') {
	        	this.tableLoading = false;
	          this.fabricList = res.data.records;
            this.total = res.data.total;
           
            this.fabricList.forEach((item, index) => {       
              if(this.currentPage!=1){
                item.idIndex=(this.currentPage-1)*this.pageSize+(index+1)
              }else{
                item.idIndex=index+1;  
              }
              for (var a = 0; a < this.MaterialClasstypelist.length; a++) {
                var a_item = this.MaterialClasstypelist[a];
                if (item.materialClassification == a_item.index) {
                  item.materialClassificationName = a_item.name;
                  this.$forceUpdate();
                }
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
.mt{
	margin-top: 12px;
}
.w21p {
    width: 21% !important;
}
.w9p {
    width:9% !important;
}
.w2p {
    width:2% !important;
}
.ml {
	margin-left: 10px;
}
.red{
	color: #F56C6C;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.compositeMaterials {
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
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
    display: inline-block;
  }
  // button.el-button.el-button--primary.el-button--small.is-circle{
  // 	margin:5px 0;
  // 	float: right;
  // }
  .demo-ruleForm {
    width: 45%;
  }
}
.addcontent_content{
	margin: 10px 0;
}
select.selectstatus {
	width: 200px;
	height: 40px;
	border-radius: 5px;
	border: 1px solid #DCDFE6;
	text-indent: 1em;
	color: #606266;
	line-height: 20px;
	font-size: 14px;
}

select.selectstatus>option {
	font-size: 14px;
}

select.selectstatus {
	background: #FFFFFF;
}
.el-select.selectfabc {
    margin-right: 10px;
}
ul.content_form{
	width: 100%;
	height: 55px;
	li{
		float: left;
		
		/*width: 13%;*/
		font-size: 14px;
    color: #606266;
    margin: 0 0.5%;
    display: flex;
    .form_item{
    	display: flex;
    	width:100%;
    	span{
    		margin-top: 12px;
    	}
    	select.selectstatus{
    		width:100%;
    	}
    	/*span{
    		width: 50px;
	    	word-wrap:break-word; word-break:break-all;overflow: hidden;
	    }*/
    }    
    .el-input{
    	/*width: 100px;*/
    }
    select.selectstatus{
    	/*width:70px;*/
    }
    label.el-checkbox{
    	margin-top: 12px;
    }
	}
	li:first-child{
			 .el-input{
		    	/*width: 120px;*/
		    }
	}
	li:nth-child(8){
		.el-input{
	    	/*width:90px;*/
	   }
	}
	li:nth-child(2),li:nth-child(4),li:nth-child(5),li:nth-child(6),li:nth-child(7){
		.el-input{
	    	/*width:60px;*/
	    	/*margin-right: 5px;*/
	   }
	}
}
</style>
<style>
/* label.el-checkbox{
	width: 200px;
} */
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

.compositeMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.compositeMaterials .el-form-item__content {
  width: auto;
}
.compositeMaterials .el-input {
  width: auto;
}
.compositeMaterials .whole_long .el-form-item__content {
  width: 68%;
}
.compositeMaterials .whole_long .el-input {
  width: 100%;
}
form.el-form.demo-ruleForm.fl.tag{
	width: 80%;
	.el-form-item {
	    width: 63%!important;
	}
}
.form_part .demo-ruleForm{
    width: 80%;
}
/* button.el-button.el-button--danger.is-circle {
  padding: 3px;
  margin-top: 10px;
} */
.el-autocomplete-suggestion li{
	padding:0 0px;
	text-align: center;
}
</style>