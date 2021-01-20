<template>
  <div class="container fabricMaterials">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
		        <span class="tag">供应商：</span>
            <el-select class="select_single w200 mr10"
              v-model="supplierId"
               @change="searchHandle"
              filterable
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierNameList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
		      </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
        </div>
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
          <singleTable
          :tableList='fabricList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteHandle'
          @editHandle='editHandle'
          @cloneHandle='cloneHandle'
          @checkHandle='checkHandle'
          ></singleTable>
        </el-tabs>
        <div class="pagination_wrap fr">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="this.total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑页 -->
    <div class="form_part clearfix" v-else>
      <div v-if="actionsType == 'check'">
        <fabricMaterialsCheck :list="ruleForm" :uploadFileList="uploadFileList" @cancelHandle="resetForm"></fabricMaterialsCheck>
      </div>

      <div v-else>
        <div class="base_wrap clearfix finished">
          <h2 class="title">物料基本信息</h2>
          <el-form
            :inline="true"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="200px"
            class="demo-form-inline"
          >
            <el-form-item label="物料编号" prop="materialCode">
              <el-input :disabled="isEditor"  @change="hasRepeatMeterialClick(ruleForm)"  @keyup.native="onkeyupMaterialCode($event)"  v-model.trim="ruleForm.materialCode"></el-input>
            </el-form-item>
            <el-form-item label="系统编号">
              <span>{{ruleForm.materialId}}</span>
            </el-form-item>
            <el-form-item label='开发号' prop="developCode">
              <el-input :disabled="isEditor"  @change="hasRepeatDevelopCodeClick(ruleForm)" @keyup.native="onkeyupDevelopCode($event)" v-model.trim="ruleForm.developCode"></el-input>
            </el-form-item>         
            <el-form-item label="物料名称">
              <el-input v-model.trim="ruleForm.materialName"></el-input>
            </el-form-item>
            <el-form-item label="供应商编号" prop="supplierId">
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
            <el-form-item label="供应商名称" prop="supplierName">
              <div :title="ruleForm.supplierName" class="ellipsis w200">{{ruleForm.supplierName?ruleForm.supplierName:''}}</div>
            </el-form-item>
            <el-form-item label="技术规格描述">
              <el-input :title="ruleForm.combination" v-model.trim="ruleForm.combination"></el-input>
            </el-form-item>
            <el-form-item label="系列" prop="materialSeries">
              <el-input :title="ruleForm.materialSeries" v-model.trim="ruleForm.materialSeries"></el-input>
            </el-form-item>
            <el-form-item label="物料成分">
              <el-input v-model.trim="ruleForm.materialComposition"></el-input>
            </el-form-item>
             <el-form-item label="工厂季">
              <el-select v-model.trim="ruleForm.factorySeason"  placeholder="请选择">
                <el-option  v-for="item in this.factorySeasontypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            
             <el-form-item label="品类" prop="category">
              <el-select  v-model.trim="ruleForm.category"  placeholder="请选择">
                <el-option  v-for="item in this.ProductCategorytypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item label="产品特性" prop="productSeason">
              <el-select v-model.trim="ruleForm.productSeason"  placeholder="请选择">
                <el-option  v-for="item in this.seasontypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="颜色">
              <el-select  v-model.trim="ruleForm.color"  placeholder="请选择">
                <el-option  v-for="item in this.colortypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采购计量单位" prop="purchaseMeasurementUnit">
              <el-select  v-model.trim="ruleForm.purchaseMeasurementUnit"  @change="selectUnitclick(ruleForm)"  placeholder="请选择">
                <el-option  v-for="item in this.SaleUnittypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="花型">
              <el-select  v-model.trim="ruleForm.pattern"  placeholder="请选择">
                <el-option  v-for="item in this.patterntypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="延米克重"  required>
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
            <el-form-item label="产地" prop="placeOfMaterialion">
              <el-select  v-model.trim="ruleForm.placeOfMaterialion"  placeholder="请选择产地">
                <el-option  v-for="item in this.placeProductiontypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
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
            <el-form-item label="物料类型" prop="materialType">
              <el-select  v-model.trim="ruleForm.materialType"  placeholder="请选择">
                <el-option  v-for="item in this.Materialtypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="纱支" prop="yarnCount">
              <el-input v-model.trim="ruleForm.yarnCount"></el-input>
            </el-form-item>
            <el-form-item label="物料属性">
              <el-select  v-model.trim="ruleForm.materialProperties"  placeholder="请选择">
                <el-option  v-for="item in this.MaterialPropertiestypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最小起订量">
              <el-input
                v-model.trim="ruleForm.minOrder"
                maxlength="6"
               @keyup.native="ruleForm.minOrder=oninput(ruleForm.minOrder)"
               @change="ruleForm.minOrder=oninput(ruleForm.minOrder)"
              ></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="零剪物料属性">
              <el-select  v-model.trim="ruleForm.retailMaterialProperties"  placeholder="请选择">
                <el-option  v-for="item in this.materialPropertiesTypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='经济批量' prop="economicBatch">
              <el-input v-model.trim="ruleForm.economicBatch"  @keyup.native="ruleForm.economicBatch=oninput(ruleForm.economicBatch)" @change="ruleForm.economicBatch=oninput(ruleForm.economicBatch)"></el-input>&nbsp;&nbsp;米
            </el-form-item>
            <el-form-item label="职业装物料属性">
              <el-select  v-model.trim="ruleForm.suitsMaterialProperties"  placeholder="请选择">
                <el-option  v-for="item in this.suitsMaterialPropertiesTypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='规格'>
              <el-input v-model.trim="ruleForm.specifications"  @keyup.native="InputNumber('specifications')" @change="InputNumber('specifications')"></el-input>&nbsp;&nbsp;米/包
            </el-form-item>
            <el-form-item label="上市日期">
              <el-date-picker
                 v-model.trim="ruleForm.appearDate"
                type="date"
                format="yyyy-MM-dd"
                 value-format="yyyy-MM-dd"
                 :picker-options="pickerOptionsStart"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="批次管理" prop="isBatchManagement">
               <el-select  v-model.trim="ruleForm.isBatchManagement"  placeholder="">
                  <el-option v-for="i in this.ifStylelist"  :key="i.ifbatch" :value="i.ifbatch" :label="i.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生命周期">
              <el-date-picker
                v-model.trim="ruleForm.disappearDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="EV产品" prop="belongToEv">
               <el-select  v-model.trim="ruleForm.belongToEv"  placeholder="">
                  <el-option v-for="i in this.ifStylelist"  :key="i.ifbatch" :value="i.ifbatch" :label="i.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="报关品类" prop="declarationCategory">
              <el-select  v-model.trim="ruleForm.declarationCategory"  @change="selectdeclarationCategory(ruleForm)" placeholder="请选择">
                <el-option  v-for="item in this.materialDeclarationCategorylist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快货" prop="mobileGoods">
               <el-select  v-model.trim="ruleForm.mobileGoods"  placeholder="">
                  <el-option v-for="i in this.ifStylelist"  :key="i.ifbatch" :value="i.ifbatch" :label="i.name"></el-option>
               </el-select>
            </el-form-item>
            <el-form-item label="海关编号" prop="hsCode">
               <span>{{ruleForm.hsCode}}</span>
            </el-form-item>
           <el-form-item label="是否可供">
              <el-select  v-model.trim="ruleForm.whetherSupply"  placeholder="请选择">
                <el-option  v-for="item in this.materialSupplyTypelist" :key="item.index"
			              :label="item.name"
			              :value="item.index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="海关关税系数">
               <span>{{ruleForm.customsTariffCoefficient}}</span>
            </el-form-item>
            <el-form-item label="替代品" prop="substitute">
              <el-input v-model.trim="ruleForm.substitute"></el-input>
            </el-form-item>
             <el-form-item label="增值税系数" prop="valueAddedTaxCoefficient">
              <el-input
                v-model.trim="ruleForm.valueAddedTaxCoefficient"
                maxlength="10"
                @keyup.native="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)"
                @change="ruleForm.valueAddedTaxCoefficient=oninput(ruleForm.valueAddedTaxCoefficient)"
              ></el-input>
            </el-form-item>
            <el-form-item label="坯布编号" prop="rawFabricId">
              <el-input v-model.trim="ruleForm.rawFabricId"></el-input>
            </el-form-item>
            <el-form-item label="杂费系数" prop="miscChargesCoefficient">
              <el-input
                v-model.trim="ruleForm.miscChargesCoefficient"
                maxlength="10"
                @keyup.native="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)"
                @change="ruleForm.miscChargesCoefficient=oninput(ruleForm.miscChargesCoefficient)"
              ></el-input>&nbsp;&nbsp;
              <!-- <span class="red" style="display:block;">注:采购货物价值的百分比</span> -->
            </el-form-item>
            <el-form-item class="whole" label="备注" prop="remarks">
              <el-input v-model.trim="ruleForm.remarks"></el-input>
            </el-form-item>

            <hr style="border: 0.5px solid #DCDFE6;" />
            <h2 class="title">交期信息（交期时间单位：天）</h2>
            <el-form-item
              label="工厂生产交期"
              class="message"
              prop="materialDeliveryDate.factoryDeliveryDate"
            >
              <el-input v-model.trim="ruleForm.materialDeliveryDate.factoryDeliveryDate"></el-input>
            </el-form-item>
            <el-form-item
              class="message"
              label="发货（空运+清关+入库操作）交期"
              prop="materialDeliveryDate.shippmentDate"
            >
              <el-input v-model.trim="ruleForm.materialDeliveryDate.shippmentDate"></el-input>
            </el-form-item>
            <el-form-item
              class="message"
              label="预付款交期"
              prop="materialDeliveryDate.advancePaymentDate"
            >
              <el-input v-model.trim="ruleForm.materialDeliveryDate.advancePaymentDate"></el-input>
            </el-form-item>
            <el-form-item
              class="message"
              label="新首工厂生产交期"
              prop="materialDeliveryDate.firstFactoryDeliveryDate"
            >
              <el-input v-model.trim="ruleForm.materialDeliveryDate.firstFactoryDeliveryDate"></el-input>
            </el-form-item>
            <el-form-item
              class="message"
              label="新首发货（空运+清关+入库操作）交期"
              prop="materialDeliveryDate.firstShippmentDate"
            >
              <el-input v-model.trim="ruleForm.materialDeliveryDate.firstShippmentDate"></el-input>
              <!--<el-input v-model="ruleForm.materialDeliveryDate.firstShippmentDate"></el-input>-->
            </el-form-item>
          </el-form>
        </div>
        <div class="mt20 fr">
          <el-button class="mr10" @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="this.loadingcommit"  v-preventReClick>保存</el-button>
        </div>
      </div>
    </div>

    <!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :visible.sync="dialogdelVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>确定删除该条面料物料主数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" :loading="removeloading" @click="delVisibleclick()" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {postpermission,exportFileMaterials} from "@/api/accessPermission.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { purchasegetuuid, materialsFabricList, fabrictypeadd, fabrictypeupd, fabrictypedel, fabrictypeview,getHsCode,getCheckDevelopCode,getCheckMaterialCode} from "@/api/module/materialsApi.js";
import {
  fabrictypeProductCategory,
  fabrictypeProductSeason,
  fabrictypeSaleUnit,
  fabrictypeMaterialType,
  fabrictypeProductcolor,
  fabrictypeProductpattern,
  fabrictypeProductmaterialGroup,
  fabrictypeMaterialABCClass,
  fabrictypeMaterialCode,
  fabrictypeMaterialSeries,
  fabrictypeMaterialproperties,
  fabrictypedictionaries,
} from "@/api/module/dictionariesApi.js";
import {
  supplierNameData
} from "@/api/module/materialfinishedApi.js";
import { timeFormat } from "@/utils/index.js";
import fabricMaterialsCheck from '../fabricMaterialsCheck/Index.vue';
export default {
  name: "fabricMaterials",
  props: [],
  data() {
    return {
       myHeaders: {
                Authorization:'bearer '+this.$keycloak.token
      },
      uploadurl:'',
      showfilelist:false,
      actionsType: '',
      inputData: "",
      supplierId:'',
      fabricList: [],
      isEdit: false,
      loadingcommit:false,
      removeloading:false,
      dialogdelVisible:false,
      tableLoading: true,
      isEditor:false,
      errorMaterial:true,
      errorDevelopCode:true,
      isLoadingExport:false,
      isLoadingImport:false,
      delid:'',
      updid:'',
      edittag:'',
      brand:'',
      supplierName:'',
      materialCode:'',
      SaleUnittypelist:[],
		  ProductCategorytypelist:[],
		  ProductTypetypelist:[],
		  seasontypelist:[],
		  Materialtypelist:[],
		  MaterialCodetypelist:[],
		  MaterialSeriestypelist:[],
		  colortypelist:[],
		  patterntypelist:[],
		  materialGrouptypelist:[],
      MaterialPropertiestypelist:[],
      supplierNameList:[],
      materialSupplyTypelist:[],
      placeProductiontypelist:[],
      factorySeasontypelist:[],
      materialDeclarationCategorylist:[],
      suitsMaterialPropertiesTypelist:[],
      materialPropertiesTypelist:[],
      // form
      ruleForm: {
        materialCode: "",
        materialBarcode: "",
        developCode:"",
        economicBatch:'',
        materialName: "",
        materialSeries: "",
        brand: "",
        category: "8",
        producerCode: "",
        specification:'',
        productSeason: "other",
        supplierId: "",
        width: "",
        supplierName: "",
        color: "",
        minOrder: "",
        pattern: "",
        combination:'',
        weightPerMeterShow: "",
        weightPerSquareMeter: "",
        weightPerMeterOne:'',
        weightPerMeterTwo:'',
        widthShow:'',
        widthStart:'',
        widthEnd:'',
        yarnCount: "",
        placeOfMaterialion: "",
        purchaseMeasurementUnit: "Meter",
        hsCode: "51121100",
        numbersPerMeasurementUnit: "",
        materialProperties: "",
        mobileGoods: false,
        materialGroup: "",
        isBatchManagement:true,
        belongToEv:false,
        materialType: "Fabric",
        appearDate: "",
        rawFabricId: "",
        disappearDate: "",
        retailMaterialProperties:"",
        suitsMaterialProperties:"",
        substitute: "",
        materialComposition: "",
        oceanFreightCoefficient: "",
        airFreightCoefficient: "",
        agentChargeCoefficient: "",
        miscChargesCoefficient: "0.0012",
        valueAddedTaxCoefficient: "0.13",
        customsTariffCoefficient: "0.086",
        remarks: "",
        whetherSupply:'',
        factorySeason:'',
        declarationCategory:'1',
        specifications:'70',
        safetyLocalStock:'0',
        safetyFactoryStock:'0',
        uuid: "",
        materialDeliveryDate: {
          factoryDeliveryDate: "60",
          shippmentDate: "7",
          advancePaymentDate: "3",
          firstFactoryDeliveryDate: "60",
          firstShippmentDate: "7",
          uuid: ""
        }
      },
	    rules: {
          materialBarcode:[
            { required: true, message: '请输入物料条形码', trigger: 'blur' },
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          developCode:[
            { required:false, message: '请输入开发号', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          economicBatch:[
            { required:false, message: '请输入经济批量', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          materialCode:[
            { required: true, message: '请输入物料编号', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          materialName:[
            { required: true, message: '请输入物料名称', trigger: 'blur' },
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
          ],
          safetyLocalStock:[
            { required: true, message: '请输入在库安全库存', trigger: 'blur' },
          ],
          safetyFactoryStock:[
            { required: true, message: '请输入在厂安全库存', trigger: 'blur' },
          ],
          appearDate:[
             { type: 'string',required: true, message: '请输入上市日期', trigger: 'change' }
          ],
          disappearDate:[
             { type: 'string',required: true, message: '请输入生命周期', trigger: 'change' }
          ],
          miscChargesCoefficient:[
             { required: true, message: '请输入杂费系数', trigger: 'blur' }
          ],
          valueAddedTaxCoefficient:[
            { required: true, message: '请输入增值税系数', trigger: 'blur' }
          ],
          'materialDeliveryDate.factoryDeliveryDate':[
            { required: true, message: '请输入工厂生产交期', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          'materialDeliveryDate.shippmentDate':[
            { required: true, message: '请输入发货（空运+清关+入库操作）交期', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          'materialDeliveryDate.advancePaymentDate':[
            { required: true, message: '请输入预付款交期', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          'materialDeliveryDate.firstFactoryDeliveryDate':[
            { required: true, message: '请输入新首工厂生产交期', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          'materialDeliveryDate.firstShippmentDate':[
            { required: true, message: '请输入新首发货（空运+清关+入库操作）交期', trigger: 'blur' },
            { min:0, max:20, message: '超长字符', trigger: 'blur' }
          ],
          isBatchManagement: [
            { required: true,message: '请选择是否是批次管理'}
          ],
          belongToEv:[
           { required: true,message: '请选择是否是EV产品'}
          ],
          mobileGoods:[
           { required: true, message: '请选择是否快货'}
          ],
          materialSeries:[
             { required: true, message: '请输入系列',trigger: 'blur' }
          ],
          purchaseMeasurementUnit:[
             { required: true, message: '请选择采购计量单位', trigger: 'change' }
          ],
          declarationCategory:[
             { required: true, message: '请选择报关品类', trigger: 'change' }
          ],
          materialType:[
             { required: true, message: '请选择物料类型',trigger: 'change' }
          ],
          supplierId:[
            { required: true, message: '请选择供应商编号',trigger: 'change' }
          ],
          factorySeason:[
             { required: true, message: '请选择工厂季',trigger: 'change' }
          ],
          productSeason:[
            { required: true, message: '请选择产品特性',trigger: 'change' }
          ],
          category:[
            { required: true, message: '请选择品类',trigger: 'change' }
          ],
          producerCode:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          width:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          supplierName:[
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
          ],
          weightPerMeterOne:[
            { required:true, message: '请输入延米克重', trigger: 'blur'}
          ],
          weightPerMeterTwo:[
            { required:true, message: '请输入延米克重', trigger: 'blur'},
            { validator:function(rule,value,callback){
            	             console.log(rule,value,callback)
                          if(value == false){
                              callback(new Error("请选择是否批次管理"));
                          }else{
                              //校验通过
                              callback();
                          }
                        }, trigger: 'blur'
             }
          ],
          yarnCount:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          placeOfMaterialion:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          hsCode:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          numbersPerMeasurementUnit:[
            { min:0, max:4, message: '超长字符', trigger: 'blur' }
          ],         
          rawFabricId:[
            { min:0, max:24, message: '超长字符', trigger: 'blur' }
          ],
          substitute:[
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
          ],
          materialComposition:[
            { required: true, message: '请输入物料成分', trigger: 'blur' },
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
          ],
          remarks:[
            { min:0, max:255, message: '超长字符', trigger: 'blur' }
          ],
          width:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          height:[
            { min:0, max:24, message: '超长字符', trigger: 'blur' }
          ],
          specifications:[
            { min:0, max:64, message: '超长字符', trigger: 'blur' }
          ],
          supplierName:[
            { min:0, max:128, message: '超长字符', trigger: 'blur' }
          ],         
          remarks:[
            { min:0, max:255, message: '超长字符', trigger: 'blur' }
          ]
          
       },
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
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
      fieldList: [
        {
          name: "物料编号",
          class: "w10p"
        },
        {
          name: "物料名称",
          class: "w10p"
        },
        {
          name: "供应商编号",
          class: "w10p"
        },
        {
          name: "物料类型",
          class: "w5p"
        },
        {
          name: "工厂季",
          class: "w5p"
        },
        {
          name: "物料ABC分类",
          class: "w10p"
        },
        {
          name: "是否是新品",
          class: "w10p"
        },
        {
          name: "操作",
          class: "w10p"
        }
      ],
      leaderFieldsList: [
      ],
      fieldsList:[
        {
          name:'序号',
          field:'idIndex'
        },
        {
          name:'物料编号',
          field:'materialCode',
        },
         {
          name:'技术规格描述',
          field:'combination',
        },
        {
          name:'供应商编号',
          field:'supplierId',
          fabricSupplier:'fabricSupplier'
        },
        {
          name:'物料类型',
          field:'materialType',
          fabricMaterial:'fabricMaterial'
        },
        {
          name:'工厂季',
          field:'factorySeason',
          productSeason:'fabricfactorySeason'
        }
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '180',
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
            let endDateVal = this.ruleForm.disappearDate;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
      },
      pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.ruleForm.appearDate;
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
    fabricMaterialsCheck,
    singleTable
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.getSaleUnit();
    this.getProductCategory();
    this.getProductSeason();
    this.getMaterialType();
    this.getMaterialCode();
    this.getMaterialSeries();
    this.getProductcolor();
    this.getProductpattern();
    this.getSupplierNameList();
    this.getProductmaterialGroup();
    this.getProductmaterialproperties();
    this.getPlaceOfProduction();//产地
    this.getMaterialSupplyType();//是否可供
    this.getFactorySeason();//工厂季
    this.getMaterialDeclarationCategory();//报关品类
    this.getRetailAndSuitsMaterialProperties();//零剪物料属性
    this.getRetailSuitsMaterialProperties();//职业装物料属性
    this.getMaterialsFabricList();
  },
  activated() {},
  watch: {},
  computed: {
    updataList:function(){
      var required=false;
      if((this.ruleForm.developCode!=''&& this.ruleForm.developCode!=undefined)|| (this.ruleForm.materialCode!='' && this.ruleForm.materialCode!=undefined)){
        required=false;
      }else{
        required=true;
      }
      this.rules.developCode[0].required=required;
      this.rules.materialCode[0].required=required
      return this.rules;
    }
  },
  methods: {
     //导入
    importHandle(){
      this.uploadurl=process.env.VUE_APP_SCMREPORT_URL + 'reportservice/v1/importExcelMaterial';
      console.log(this.uploadurl)
    },
    //导出
    exportHandle(){
      if(this.supplierId!=''){
         this.tableLoading = true;
         this.isLoadingExport=true;
           let obj={
            supplierId:this.supplierId
          }
           exportFileMaterials(JSON.stringify(obj)).then(res => {
             console.log(res);
              this.tableLoading = false;
              this.isLoadingExport=false;
              var blob = new Blob([res]);
              var url = window.URL.createObjectURL(blob);
              var aLink = document.createElement("a");
              aLink.style.display = "none";
              aLink.href = url;
              aLink.download = '面料物料主数据'+'.xlsx'; //下载后文件名
              document.body.appendChild(aLink);
              aLink.click();
              document.body.removeChild(aLink); //下载完成移除元素
              window.URL.revokeObjectURL(url); //释放掉blob对象
           })
      }else{
        	this.$message({
            message: '请选择供应商条件导出!',
            type: 'error'
          });
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
    //检验是否存在有重复的开发号
    onkeyupDevelopCode(event){
       if(event.keyCode != 13){//除回车键外
            //标记当前事件函数的时间戳
            this.lastTimeStamp = event.timeStamp;
            setTimeout(() => {
                //1s后比较二者是否还相同（因为只要还有事件触发，lastTimeStamp就会被改写，不再是当前事件函数的时间戳）
                if(this.lastTimeStamp == event.timeStamp){
                    var str=encodeURIComponent(this.ruleForm.materialCode);
                      getCheckDevelopCode(str).then(res => {
                        if (res.code === '0') {
                          if(res.data!=''&&res.data!=null){
                            this.errorDevelopCode=false;
                          }else{
                            this.errorDevelopCode=true;
                          }
                        }
                      });
                }
            },800);
      }
    },
    //获取状态名称
    materialTypeHandle(status) {
      for (var i = 0; i < this.MaterialPropertiestypelist.length; i++) {
        let item = this.MaterialPropertiestypelist[i];
        if (item.index == status) {
          return item.name;
        }
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
                message: '该物料编号在面料物料数据中已存在',
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
    //开发号重复校验
    hasRepeatDevelopCodeClick(item){
      var str=encodeURIComponent(this.ruleForm.developCode);
      getCheckDevelopCode(str).then(res => {
        if (res.code === '0') {
          if(res.data!=''&&res.data!=null){
             this.errorDevelopCode=false;
             this.$message({
                message: '该开发号在面料物料数据中已存在',
                type: 'error'
             });
          }else{
             this.errorDevelopCode=true;
          }
        }else{
          item.developCode='';
        }
      });
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
    //触发采购计量单位
    selectUnitclick(item){
      console.log(item)
      console.log(item.purchaseMeasurementUnit);
    },
    //校验正整数
    Inputquantity(val){ 
      val = String(val).replace(/[^\d]/g, '') // 清除“数字”以外的字符
      val= val.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      return val
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
        this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property]);
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      console.log(val);
      if (val === 0 || val === "0" || val === "") {
        return "";
      } else {
        let value = null;
        value = String(val).replace(/[^\d]/g, ""); // 清除“数字”以外的字符
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
    //获取供应商列表
     getSupplierNameList() {
      supplierNameData('', '','').then(res => {
        console.log('供应商名称：', res);
        if (res.code === '0') {
          this.supplierNameList = res.data;
        }
      });
    },
    //获取零剪和职业装物料属性
    getRetailAndSuitsMaterialProperties(){
       fabrictypedictionaries('RetailMaterialProperties').then(response => {
        if (response.code === "0") {
          this.materialPropertiesTypelist = response.data;
        }
      });
    },
    //获取职业装物料属性
    getRetailSuitsMaterialProperties(){
       fabrictypedictionaries('SuitsMaterialProperties').then(response => {
        if (response.code === "0") {
          this.suitsMaterialPropertiesTypelist = response.data;
        }
      });
    },
      //获取是否可供
    getMaterialSupplyType(){
       fabrictypedictionaries('MaterialSupplyType').then(response => {
        if (response.code === "0") {
          this.materialSupplyTypelist = response.data;
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
    //工厂季
    getFactorySeason(){
      fabrictypedictionaries('FactorySeason').then(response => {
				if(response.code === "0") {					
					this.factorySeasontypelist = response.data;
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
    //物料属性
    getProductmaterialproperties() {
      fabrictypeMaterialproperties().then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;
        }
      });
    },
    //物料系列
    getMaterialSeries() {
      fabrictypeMaterialSeries().then(response => {
        if (response.code === "0") {
          this.MaterialSeriestypelist = response.data;
        }
      });
    },
    //物料品牌
    getMaterialCode() {
      fabrictypeMaterialCode().then(response => {
        if (response.code === "0") {
          this.MaterialCodetypelist = response.data;
        }
      });
    },
    //采购计量单位
    getSaleUnit() {
      fabrictypedictionaries('MaterialUnit').then(response => {
				if(response.code === "0") {					
					this.SaleUnittypelist = response.data;
				}
			});
    },
    //品类
    getProductCategory() {
      fabrictypedictionaries('MaterialClass').then(response => {
				if(response.code === "0") {					
					this.ProductCategorytypelist = response.data;
				}
			});
    },
    //产品特性
    getProductSeason() {
      fabrictypeProductSeason().then(response => {
        if (response.code === "0") {
          this.seasontypelist = response.data;
        }
      });
    },
    //颜色
    getProductcolor() {
      fabrictypeProductcolor().then(response => {
        if (response.code === "0") {
          this.colortypelist = response.data;
        }
      });
    },
    //花型
    getProductpattern() {
      fabrictypeProductpattern().then(response => {
        if (response.code === "0") {
          this.patterntypelist = response.data;
        }
      });
    },
    //物料组
    getProductmaterialGroup() {
      fabrictypeProductmaterialGroup().then(response => {
        if (response.code === "0") {
          this.materialGrouptypelist = response.data;
        }
      });
    },
    //面料物料类型
    getMaterialType() {
      fabrictypeMaterialType().then(response => {
        if (response.code === "0") {
          this.Materialtypelist = response.data;
        }
      });
    },
    changeCode() {
      console.log(this.ruleForm);
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
              console.log('同时不存在width(undefined)')
               this.ruleForm.widthShow='';
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
               this.ruleForm.widthShow=this.ruleForm.widthStart+'-'+this.ruleForm.widthEnd;
              }
            }else{
              console.log('两者存在其一width')
              if(this.ruleForm.widthStart!=''){
                 this.ruleForm.widthShow=this.ruleForm.widthStart;
              }
              if(this.ruleForm.widthEnd!=''){
                 this.ruleForm.widthShow=this.ruleForm.widthEnd;
              }
            }        
    },
    // from
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          console.log(this.ruleForm.weightPerMeterOne,this.ruleForm.weightPerMeterTwo)
          console.log(this.ruleForm.widthStart,this.ruleForm.widthEnd)
            if(this.ruleForm.specifications!=null){
              var num=this.ruleForm.specifications;
              if(num.toString().length>64){
                  this.$message({
                    message: '规格仅支持整数位64位，请重新输入！',
                    type: 'error'
                  });
                  return false;
              }
            }
           if(this.numbersContrast()!=false){            
              if(this.errorMaterial!=false&&this.errorDevelopCode!=false){
                  if (this.edittag == "add") {
                    fabrictypeadd(this.ruleForm).then(response => {
                      if (response.code === "0") {
                        this.$message({
                          message: "添加成功",
                          type: "success"
                        });
                        this.loadingcommit = false;
                        this.isEdit = false;
                        this.ruleForm = {
                          productSeason: "other",
                          category: "8",
                          purchaseMeasurementUnit: "Meter",
                          materialType: "Fabric",
                          mobileGoods: false,
                          isBatchManagement:true,
                          belongToEv:false,
                          miscChargesCoefficient: "0.0012",
                          valueAddedTaxCoefficient: "0.13",
                          specifications:'70',
                          declarationCategory:'1',
                          hsCode: "51121100",
                          weightPerMeterShow:'',
                          weightPerMeterOne:'',
                          weightPerMeterTwo:'',
                          widthShow:'',
                          widthStart:'',
                          widthEnd:'',
                          customsTariffCoefficient: "0.086",
                          materialDeliveryDate: {
                            factoryDeliveryDate: "60",
                            shippmentDate: "7",
                            advancePaymentDate: "3",
                            firstFactoryDeliveryDate: "60",
                            firstShippmentDate: "7",
                            uuid: ""
                          }
                        };
                        this.getMaterialsFabricList();
                      }else{
                        this.loadingcommit = false;
                      }
                      setTimeout(() => {
                        // this.loadingcommit = false;
                      }, 3000);
                    });
                  } else {
                    fabrictypeupd(this.ruleForm, this.updid).then(response => {
                      if (response.code === "0") {
                        this.$message({
                          message: "修改成功",
                          type: "success"
                        });
                        this.loadingcommit = false;
                        this.isEdit = false;
                        this.ruleForm = {
                          productSeason: "other",
                          purchaseMeasurementUnit: "Meter",
                          materialType: "Fabric",
                          category: "8",
                          mobileGoods: false,
                          isBatchManagement:true,
                          belongToEv:false,
                          miscChargesCoefficient: "0.0012",
                          valueAddedTaxCoefficient: "0.13",
                          specifications:'70',
                          declarationCategory:'1',
                          hsCode: "51121100",
                          weightPerMeterShow:'',
                          weightPerMeterOne:'',
                          weightPerMeterTwo:'',
                          widthShow:'',
                          widthStart:'',
                          widthEnd:'',
                          customsTariffCoefficient: "0.086",
                          materialDeliveryDate: {
                            factoryDeliveryDate: "60",
                            shippmentDate: "7",
                            advancePaymentDate: "3",
                            firstFactoryDeliveryDate: "60",
                            firstShippmentDate: "7",
                            uuid: ""
                          }
                        };
                        this.getMaterialsFabricList();
                      }else{
                        // this.loadingcommit = false;
                      }
                      setTimeout(() => {
                        this.loadingcommit = false;
                      }, 3000);
                    });
                  }
              }
           }
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.isEdit = false;
      this.ruleForm = {
        productSeason: "other",
        purchaseMeasurementUnit: "Meter",
        materialType: "Fabric",
        category: "8",
        mobileGoods: false,
        isBatchManagement:true,
        belongToEv:false,
        miscChargesCoefficient: "0.0012",
        valueAddedTaxCoefficient: "0.13",
        specifications:'70',
        declarationCategory:'1',
        hsCode: "51121100",
        weightPerMeterShow:'',
        weightPerMeterOne:'',
        weightPerMeterTwo:'',
        widthShow:'',
        widthStart:'',
        widthEnd:'',
        customsTariffCoefficient: "0.086",
        materialDeliveryDate: {
          factoryDeliveryDate: "60",
          shippmentDate: "7",
          advancePaymentDate: "3",
          firstFactoryDeliveryDate: "60",
          firstShippmentDate: "7",
          uuid: ""
        }
      };
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
    //供应商下拉选项触发
    selectSupplierclick(item){
      console.log(item)
      for(var i=0;i<this.supplierNameList.length;i++){
        let data=this.supplierNameList[i];
        if(item.supplierId==data.supplierId){
          item.supplierName=data.supplierName;
        }
      }
    },
    selectSupplierCondition(val){
      if(val.supplierName==''){
        this.getSupplierNameList();
      }
    },
    searchHandle() {
      // 搜索
      this.purchaseOrderId = this.orderCode;
      this.getMaterialsFabricList();
    },
    addHandle() {
      // 添加
      this.actionsType = "add";
      this.edittag = "add";
      this.isEdit = true;
      // this.isEditor=false;
      console.log(this.ruleForm);
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          this.ruleForm.uuid = response.data;
        }
      });
    },
    editHandle(index,item) {
      console.log(item)
      // 编辑项
      this.isEdit = true;
      this.actionsType = "edit";
      this.edittag = "updated";
      // this.isEditor=true;
      this.updid = item.id;
      fabrictypeview(item.id).then(response => {
        if (response.code === "0") {
          var data=response.data.weightPerMeterShow;
          var widthData=response.data.widthShow;
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
                response.data.widthStart=response.data.widthShow;
                response.data.widthEnd='';
              }
           }else{
              response.data.widthStart='';
              response.data.widthEnd='';
           }
          this.ruleForm = response.data;
          console.log(this.ruleForm)
          console.log(response.data.category)
          if(response.data.category!=null&&response.data.category!=''){
            console.log('guoguoguo')
             this.ruleForm.category=response.data.category.toString();
             this.$forceUpdate();
          }
          if(response.data.color!=null&&response.data.color!=''){
            console.log('guoguoguo')
             this.ruleForm.color=response.data.color.toString();
             this.$forceUpdate();
          }
          if(response.data.pattern!=null&&response.data.pattern!=''){
            console.log('guoguoguo')
             this.ruleForm.pattern=response.data.pattern.toString();
             this.$forceUpdate();
          }
          if(this.ruleForm.appearDate!=null&&this.ruleForm.appearDate!=''){
            let date = timeFormat(response.data.appearDate);
            this.ruleForm.appearDate = date.split(' ')[0];
          }
          if(this.ruleForm.disappearDate!=null&&this.ruleForm.disappearDate!=''){
            let date = timeFormat(response.data.disappearDate);
            this.ruleForm.disappearDate = date.split(' ')[0];
          }
          console.log(this.ruleForm);
          console.log(this.ruleForm.materialDeliveryDate);
          console.log(this.ruleForm.materialDeliveryDate.factoryDeliveryDate);
        }
      });
    },
    cloneHandle(item) {
        // 编辑项
      this.isEdit = true;
       this.actionsType = "add";
      this.edittag = "add";
      // this.isEditor=true;
      this.updid = item.id;
      fabrictypeview(item.id).then(response => {
        if (response.code === "0") {
          var data=response.data.weightPerMeterShow;
          var widthData=response.data.widthShow;
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
                response.data.widthStart=response.data.widthShow;
                response.data.widthEnd='';
              }
           }else{
              response.data.widthStart='';
              response.data.widthEnd='';
           }
          this.ruleForm = response.data;
          console.log(this.ruleForm)
          console.log(response.data.category)
          if(response.data.category!=null&&response.data.category!=''){
            console.log('guoguoguo')
             this.ruleForm.category=response.data.category.toString();
             this.$forceUpdate();
          }
          if(response.data.color!=null&&response.data.color!=''){
            console.log('guoguoguo')
             this.ruleForm.color=response.data.color.toString();
             this.$forceUpdate();
          }
          if(response.data.pattern!=null&&response.data.pattern!=''){
            console.log('guoguoguo')
             this.ruleForm.pattern=response.data.pattern.toString();
             this.$forceUpdate();
          }
          if(this.ruleForm.appearDate!=null&&this.ruleForm.appearDate!=''){
            let date = timeFormat(response.data.appearDate);
            this.ruleForm.appearDate = date.split(' ')[0];
          }
          if(this.ruleForm.disappearDate!=null&&this.ruleForm.disappearDate!=''){
            let date = timeFormat(response.data.disappearDate);
            this.ruleForm.disappearDate = date.split(' ')[0];
          }
          console.log(this.ruleForm);
          this.getuuid();
        }
      });
    },
    deleteHandle(index,item) {
      // 删除项
      this.delid = item.id;
      this.dialogdelVisible = true;
    },
    checkHandle(index,item) {
      // 查看详情
      console.log("查看详情模板：", item);
      this.actionsType = "check";
      this.edittag = "updated";
      this.isEdit = true;
      // this.ruleForm = item;
      fabrictypeview(item.id).then(response => {
        if (response.code === "0") {
          this.ruleForm = response.data;
          if(this.ruleForm.appearDate!=null&&this.ruleForm.appearDate!=''){
            let date = timeFormat(response.data.appearDate);
            this.ruleForm.appearDate = date.split(' ')[0];
          }
          if(this.ruleForm.disappearDate!=null&&this.ruleForm.disappearDate!=''){
            let date = timeFormat(response.data.disappearDate);
            this.ruleForm.disappearDate = date.split(' ')[0];
          }
        }
      });
    },
    //删除确定
    delVisibleclick() {
      this.removeloading=true;
      fabrictypedel(this.delid).then(response => {
        if (response.code === "0") {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          this.removeloading=false;
          this.dialogdelVisible = false;
          this.getMaterialsFabricList();
        }
      });
    },
    getuuid() {
      purchasegetuuid().then(response => {
        if (response.code === "0") {
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
        brand: this.brand,
        materialCode: this.materialCode,
        supplierId: this.supplierId
      };
      materialsFabricList(this.currentPage, this.pageSize, data).then(res => {
        console.log("面料物料主数据列表：", res);
        if (res.code === "0") {
        	this.tableLoading = false;
          this.fabricList = res.data.records;
          this.total = res.data.total;
          for (var i = 0; i < this.fabricList.length; i++) {
            var item = this.fabricList[i];
            if(this.currentPage!=1){
              item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
            }else{
              item.idIndex=i+1;
            }
            if(item.developCode!=null&&item.developCode!=''){
              item.ifNewProduct='是'
            }else{
              item.ifNewProduct='否'
            }
            for (var b = 0; b < this.MaterialPropertiestypelist.length; b++) {
              var bitem = this.MaterialPropertiestypelist[b];
              if (item.materialProperties != null) {
                if (item.materialProperties == bitem.index) {
                  item.materialPropertiesname = bitem.name;
                  this.$forceUpdate();
                }
              } else {
                item.materialPropertiesname = "";
              }
            }
            //物料类型
            // for (var c = 0; c < this.Materialtypelist.length; c++) {
            //   var citem = this.Materialtypelist[c];
            //   if (item.materialType!= null) {
            //     if (item.materialType== citem.index) {
            //       item.materialTypename = citem.name;
            //       this.$forceUpdate();
            //     }
            //   } else {
            //     item.materialPropertiesname = "";
            //   }
            // }
            //工厂季
            for (var d = 0; d < this.factorySeasontypelist.length; d++) {
              var ditem = this.factorySeasontypelist[d];
              if (item.factorySeason!= null) {
                if (item.factorySeason== ditem.index) {
                  item.factorySeasonName =ditem.name;
                  this.$forceUpdate();
                }
              } else {
                item.factorySeasonName = "";
              }
            }


          }
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
.red {
  color: #f56c6c;
}
.ml {
  margin-left: 10px;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.fabricMaterials {
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
  .edit_btn_wrap {
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
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  font-size: 14px;
}

select.selectstatus > option {
  font-size: 14px;
}

select.selectstatus {
  background: #ffffff;
}
.el-select.selectfabc {
  margin-right: 10px;
}
</style>
<style>
.fabricMaterials label.el-checkbox {
  width: 200px;
}
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

.fabricMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.fabricMaterials .el-form-item__content {
  width: auto;
}
.fabricMaterials .el-input {
  width: auto;
}
.fabricMaterials .whole_long .el-form-item__content {
  width: 65%;
}
.fabricMaterials .whole_long .el-input {
  width: 100%;
}
form.el-form.demo-ruleForm.pull-left.tag {
  width: 80%;
  .el-form-item {
    width: 63% !important;
  }
}
.form_part .demo-ruleForm {
  width: 80%;
}
.fabricMaterials form.el-form.demo-form-inline .el-form-item .el-form-item__content .unlimit.el-input input.el-input__inner{
  width:100%!important;
}
.fabricMaterials .base_wrap.clearfix.finished form.el-form.demo-form-inline.el-form--inline .el-form-item.limit{
  width: auto!important;
  margin-right: 0;
}
</style>
　　
