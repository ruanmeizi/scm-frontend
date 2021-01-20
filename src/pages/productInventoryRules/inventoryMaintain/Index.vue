<template>
  <div class="container fabricMaintain">
    <div v-if="!isEdit">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号组：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">产品编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="productCode" placeholder="请输入"></el-input>
          </div>
        </div>
        <!-- <el-input class="input_single w200 mr10 mb10" v-model="materialCode" placeholder="物料编号"></el-input>
        <el-input class="input_single w200 mr10 mb10" v-model="productCode" placeholder="产品编号"></el-input> -->
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
        <ul class="formula_wrap mb10">
          <li class="w10p" title="默认公式">默认公式</li>
          <li class="w30p">产品在库库存 = {{defaultRuleFormulaName ? defaultRuleFormulaName : '100% × 物料在库库存'}}</li>
          <li class="w40p" title="备注：如果不添加特殊公式，所有产品库存按照默认公式计算，以下列表展示的为特殊添加的产品规则列表">备注：如果不添加特殊公式，所有产品库存按照默认公式计算，以下列表展示的为特殊添加的产品规则列表</li>
          <li class="w20p blue" title="默认公式编辑" @click="formulaEditHandle">默认公式编辑</li>
        </ul>
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in inventoryList"
              :key="index">
              <li class="w9p" :title="index + 1">{{index + 1}}</li>
              <li class="w9p" :title="item.productCode">{{item.productCode ? item.productCode : '无'}}</li>
              <li class="w9p" :title="item.materialCode">{{item.materialCode ? item.materialCode : '无'}}</li>
              <li class="w20p" :title="item.ruleExpressionName">{{item.ruleExpressionName ? item.ruleExpressionName : '无'}}</li>
              <li class="w10p">
                <i type="primary" class="el-icon-edit" title="修改" @click="editHandle(index, item)"></i>
                <i type="primary" class="el-icon-document" title="查看" @click="checkHandle(index, item)"></i>
                <i type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(index, item)"></i>
              </li>
            </ul>
          </div> -->
          <singleTable
            :tableList='inventoryList' 
            :tableLeaderFieldsList='leaderFieldsList'
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="fieldsList"
            @deleteHandle='deleteHandle'
            @editHandle='editHandle'
            @checkHandle='checkHandle'
          ></singleTable>
        </el-tabs>
        
        <!-- <p v-if="!inventoryList.length&&!tableLoading" class="empty_tip">暂无数据</p> -->
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
      <div class="edit_wrap mt10">
        <div class="input_group group clearfix" v-if="isShowInputGroup">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="200px"
            class="demo-ruleForm fl">
            <el-form-item label="产品编号" prop="productCode">
              <!-- <span class="red mr5">*</span> -->
              <el-input @change="productCodeChange" v-model="ruleForm.productCode"></el-input>
            </el-form-item>
            <el-form-item label="物料编号" prop="materialCode">
              <!-- <span class="red mr5">*</span> -->
              <el-input v-model="ruleForm.materialCode"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="formula_group group clearfix">
          <el-form
            label-width="200px"
            class="demo-ruleForm fl">
            <el-form-item label="规则">
              <!-- 自定义公式 -->
              <!-- <span class="red mr5">*</span> -->
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="200px" v-if="isCustomizeFormula">
                <el-form-item class="display_ib" label="变量：Z（职业装仓所有库存）；A（本地仓所有库存）；L（零剪仓所有库存）；" prop="ruleFormula">
                  <el-input v-model="ruleForm.ruleFormula"></el-input>
                </el-form-item>
                <el-form-item class="display_ib ml10">
                  <el-button type="primary" @click="cancelCustomizeHandle">取消自定义</el-button>
                </el-form-item>
              </el-form>
              <!-- 规则公式 -->
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" label-width="50px" v-else>
                <el-form-item class="display_ib mb10" label="系数" prop="coefficient">
                  <el-input v-model="ruleForm.coefficient" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="40" ></el-input>
                </el-form-item>&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;
                <el-form-item class="display_ib mb10" label="物料库存数" prop="inventoryCount">
                  <el-select v-model="ruleForm.inventoryCount" placeholder="请选择物料库存数">
                    <el-option label="请选择物料库存数" value=""></el-option>
                    <el-option
                      v-for="item in inventoryRuleList"
                      :key="item.dictItemValue"
                      :label="item.dictItemName"
                      :value="item.dictItemValue"></el-option>
                  </el-select>
                </el-form-item>&nbsp;&nbsp;&nbsp;+&nbsp;&nbsp;&nbsp;
                <el-form-item class="display_ib mb10" label="常量" prop="constant">
                  <el-input v-model="ruleForm.constant" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" maxlength="40"></el-input>
                </el-form-item>
                <el-form-item class="display_ib ml10">
                  <el-button type="primary" @click="customizeHandle">自定义公式</el-button>
                </el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="mt20 fr">
        <el-button class="mr10" @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="saveHandle('ruleForm')">保存</el-button>
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
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in checkFieldsList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in checkInventoryList"
              :key="index">
              <li class="w9p" :title="index + 1">{{index + 1}}</li>
              <li class="w9p" :title="item.productCode">{{item.productCode ? item.productCode : '无'}}</li>
              <li class="w9p" :title="item.materialCode">{{item.materialCode ? item.materialCode : '无'}}</li>
              <li class="w20p" :title="item.ruleExpressionName">{{item.ruleExpressionName ? item.ruleExpressionName : '无'}}</li>
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
        <el-button type="primary" @click="confirmDeleteHandle">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { inventoryRulesList, deleteInventoryItem, searchInventoryItem, inventoryCountList, searchRuleFormula, addInventoryRules, searchMaterialCode, modifyInventoryRules } from "@/api/module/inventoryApi.js";
import { purchasegetuuid } from "@/api/module/purchaseApi.js";
export default {
  name: "fabricMaintain",
  props: [],
  data() {
    return {
      inventoryRuleList: [],
      defaultRuleFormula: '',
      // ruleFormula: '',
      // coefficient: '', //系数
      // constant: '', //常量
      // inventoryCount: '', //库存规则数值
      ruleExpression: '',
      ruleExpressionName: '',
      editId: '',
      uuid: '',
      isEdit: false,
      isAdd: true,
      isDefaultFormulaEdit: false,
      isShowInputGroup: false,
      isCustomizeFormula: false,
      tableLoading: true,
      inventoryList: [],
      checkInventoryList: [],
      materialCode: '',
      productCode: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      dialogFormVisible: false,
      popupTitle: '',
      deleteId: '',
      deleteDialogVisible: false,
      fieldList: [
        {
          name: '序号',
          class: 'w9p'
        },
        {
          name: '产品编号',
          class: 'w9p'
        },
        {
          name: '物料编号组',
          class: 'w9p'
        },
        {
          name: '规则',
          class: 'w20p'
        },
        {
          name: '操作',
          class: 'w10p'
        }
      ],
      checkFieldsList: [
        {
          name: '序号',
          class: 'w9p'
        },
        {
          name: '产品编号',
          class: 'w9p'
        },
        {
          name: '物料编号组',
          class: 'w9p'
        },
        {
          name: '规则',
          class: 'w20p'
        }
      ],
      ruleForm: {
        productCode: '', //产品编号
        materialCode: '', //物料编号
        ruleFormula: '', //自定义公式
        ruleFormulaName: '', //自定义公式中文版
        coefficient: '', //系数
        inventoryCount: '', //物料库存数
        constant: '', //常量
      },
      rules: {
        productCode: [
          { required: true, message: '请填写产品编号', trigger: 'blur' }
          // { min: 1, max: 20, message: '超长字符', trigger: 'blur' }
        ],
        materialCode: [
          { required: true, message: '请填写物料编号', trigger: 'blur' },
          { min: 1, max: 20, message: '超长字符', trigger: 'blur' }
        ],
        ruleFormula: [
          { required: true, message: '请填写自定义公式', trigger: 'blur' },
          { min: 1, max: 128, message: '超长字符', trigger: 'blur' }
        ],
        coefficient: [
          { required: true, message: '请填写系数', trigger: 'blur' }
          // { min: 1, max: 128, message: '超长字符', trigger: 'blur' }
        ],
        inventoryCount: [
          { required: true, message: '请选择物料库存数', trigger: 'change' }
        ],
        constant: [
          { required: true, message: '请填写常量', trigger: 'blur' }
          // { min: 1, max: 128, message: '超长字符', trigger: 'blur' }
        ],
      },
       leaderFieldsList: [
      ],
      fieldsList:[
        {
          name: '序号',
          field: 'idIndex',
          class: 'w50p',
          // isId:true
          // width: '150',
          //minWidth: '20%'
        },
        {
          name: '产品编号',
          field: 'productCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'物料编号组',
          field:'materialCode',
          //class: 'w50p',
          // width: '150',
          //minWidth: '20%'
        },
        {
          name:'规则',
          field:'ruleExpressionName',
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
          hasDelete:true,
          hasEdit:true,
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
    this.getRuleFormula(-1);
  },
  mounted() {
    this.getInventoryRulesList();
    this.getInventoryCountList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: {
    productCodeChange(val) {
      searchMaterialCode(val).then(res => {
        if (res.code === '0') {
          if (res.data!='') {
            this.ruleForm.materialCode = res.data;
            this.$forceUpdate();
          }else{
            this.ruleForm.materialCode=''
            this.$forceUpdate();
          }
        }
      });
    },
    customizeHandle() {
      // 自定义公式
      this.isCustomizeFormula = true;
    },
    cancelCustomizeHandle() {
      // 取消自定义公式
      this.isCustomizeFormula = false;
    },
    cancelHandle() {
      // 编辑取消操作
      this.isDefaultFormulaEdit = false;
      this.isEdit = false;
      this.ruleForm.productCode = '';
      this.ruleForm.materialCode = '';
    },
    // 过滤输入的数字
    InputNumber(property) {
      // if(property=='coefficient'){
      //   let title='系数';
      // }else if(property=='constant'){
      //   let title='常量'
      // }
      // let num=String(this.ruleForm[property])
      // console.log(num.length)
      // if(num.length>=128){
      //    this.$message({
      //       type: 'error',
      //       message: title+'超长字符'
      //     });
      // }
        // this.ruleForm[property] = this.limitInputPointNumber(this.ruleForm[property]);
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      console.log(val);
      if (val === "") {
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
    saveHandle(formName) {
      // 编辑保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            materialCode: this.ruleForm.materialCode,
            productCode: this.ruleForm.productCode,
            ruleExpression: this.ruleExpression,
            ruleExpressionName: this.ruleExpressionName,
            status: this.status,
            uuid: this.uuid
          };
          // 校验
          // if (this.isShowInputGroup) {
          //   // 是否有input
          //   if (!this.productCode) {
          //     this.$message({
          //       type: 'error',
          //       message: '请输入产品编号！'
          //     });
          //     return false;
          //   }
          //   if (!this.materialCode) {
          //     this.$message({
          //       type: 'error',
          //       message: '请输入物料编号！'
          //     });
          //     return false;
          //   }
          // } else {
          //   data.materialCode = -1;
          //   data.productCode = -1;
          // }
          // if (!this.isCustomizeFormula) {
          //   // 规则公式
          //   if (!this.coefficient) {
          //     this.$message({
          //       type: 'error',
          //       message: '请输入系数值！'
          //     });
          //     return false;
          //   }
          //   if (!this.inventoryCount) {
          //     this.$message({
          //       type: 'error',
          //       message: '请选择物料库存数！'
          //     });
          //     return false;
          //   }
          //   if (!this.constant) {
          //     this.$message({
          //       type: 'error',
          //       message: '请输入常量！'
          //     });
          //     return false;
          //   }
          //   data.ruleExpression = this.ruleForm.coefficient + '*' + this.ruleForm.inventoryCount + '+' + this.ruleForm.constant;
          // } else {
          //   // 自定义公式
          //   if (!this.ruleFormula) {
          //     this.$message({
          //       type: 'error',
          //       message: '请输入自定义公式！'
          //     });
          //     return false;
          //   }
          //   data.ruleExpression = this.ruleFormula;
          // }

          if (!this.isShowInputGroup) {
            // 是否有input
            data.materialCode = -1;
            data.productCode = -1;
          }
          if (!this.isCustomizeFormula) {
            // 规则公式
            let inventoryRuleData = this.inventoryRuleList.find(item => {
              return item.dictItemValue == this.ruleForm.inventoryCount;
            });
            data.ruleExpression = this.ruleForm.coefficient + '*' + this.ruleForm.inventoryCount + '+' + this.ruleForm.constant;
            data.ruleExpressionName = this.ruleForm.coefficient + '*' + inventoryRuleData.dictItemName + '+' + this.ruleForm.constant;
          } else {
            // 自定义公式
            data.ruleExpression = this.ruleForm.ruleFormula;
            let patt = /^\w+\*\w+\+\w*$/;
            if (patt.test(this.ruleForm.ruleFormula)) {
              let arr = this.ruleForm.ruleFormula.split('*');
              let coefficient = arr[0];
              let inventoryCount = arr[1].split('+')[0];
              let constant = arr[1].split('+')[1];
              let inventoryRuleData = this.inventoryRuleList.find(item => {
                return item.dictItemValue == inventoryCount;
              });
              data.ruleExpressionName = coefficient + '*' + inventoryRuleData.dictItemName + '+' + constant;
            } else {
              this.$message({
                type: 'error',
                message: '自定义公式格式错误！'
              });
              return false;
              let arr = this.ruleForm.ruleFormula.split('*');
              let coefficient = arr[0];
              let inventoryCount = arr[1];
              let inventoryRuleData = this.inventoryRuleList.find(item => {
                return item.dictItemValue == inventoryCount;
              });
              data.ruleExpressionName = coefficient + '*' + inventoryRuleData.dictItemName;
            }
          }
          if (this.isAdd) {
            // 新增
            if (this.uuid) {
              this.getAddInventoryRules(data);
            } else {
              purchasegetuuid().then(res => {
                console.log(res);
                if (res.code === '0') {
                  data.uuid = res.data;
                  this.getAddInventoryRules(data);
                }
              });
            }
          } else {
            // 编辑
            this.getModifyInventoryRules(this.editId, data);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getModifyInventoryRules(id, data) {
      modifyInventoryRules(id, data).then(res => {
        console.log('修改：', res);
        if (res.code === '0') {
          this.ruleForm.productCode = '';
          this.ruleForm.materialCode = '';
          this.ruleForm.ruleFormula = res.data.ruleExpression;
          this.ruleForm.ruleFormulaName = res.data.ruleExpressionName;
          // this.ruleForm.defaultRuleFormulaName = res.data.ruleExpressionName;
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.isEdit = false;
          this.getInventoryRulesList();
        }
      });
    },
    getAddInventoryRules(data) {
      addInventoryRules(data).then(res => {
        console.log('新增数据：', res);
        if (res.code === '0') {
          this.ruleForm.productCode = '';
          this.ruleForm.materialCode = '';
          this.ruleForm.ruleFormula = res.data.ruleExpression;
          if (this.isDefaultFormulaEdit) {
            this.defaultRuleFormula = res.data.ruleExpression;
            this.defaultRuleFormulaName = res.data.ruleExpressionName;
          }
          this.$message({
            type: 'success',
            message: '保存成功！'
          });
          this.isEdit = false;
          this.getInventoryRulesList();
        }
      });
    },
    searchHandle() {
      // 搜索
      this.currentPage = 1;
      this.getInventoryRulesList();
    },
    addHandle() {
      // 添加
      this.uuid = '';
      this.isEdit = true;
      this.isShowInputGroup = true;
      this.isCustomizeFormula = false;
      this.isAdd = true;
    },
    async formulaEditHandle() {
      await searchRuleFormula(-1).then(res => {
        console.log('规则共识：', res);
        if (res.code === '0') {
          if (res.data) {
            this.uuid = res.data.uuid;
            this.defaultRuleFormula = res.data.ruleExpression;
            this.ruleForm.ruleFormula = res.data.ruleExpression;
          }
        }
      });
      // this.defaultRuleFormula = this.ruleFormula;
      this.isAdd = true;
      this.isEdit = true;
      this.isDefaultFormulaEdit = true;
      this.isShowInputGroup = false;
      this.isCustomizeFormula = false;
      let patt = /^\w+\*\w+\+\w*$/;
      // this.ruleForm.ruleFormula = '1*a+10';
      console.log('默认公式：', this.defaultRuleFormula);
      if (this.defaultRuleFormula) {
        if (patt.test(this.defaultRuleFormula)) {
          let arr = this.defaultRuleFormula.split('*');
          this.ruleForm.coefficient = arr[0];
          this.ruleForm.inventoryCount = arr[1].split('+')[0];
          this.ruleForm.constant = arr[1].split('+')[1];
          console.log('系数：', this.ruleForm.coefficient, '常量：', this.ruleForm.constant);
        } else {
          this.isCustomizeFormula = true;
        }
      }
    },
    editHandle(index, item) {
      // 编辑项
      console.log('编辑项：', item);
      this.editId = item.id;
      this.isAdd = false;
      this.isEdit = true;
      this.isShowInputGroup = true;
      this.isCustomizeFormula = false;
      searchInventoryItem(item.id).then(res => {
        console.log('查询单项：', res);
        if (res.code === '0') {
          this.uuid = res.data.uuid;
          this.ruleForm.productCode = res.data.productCode;
          this.ruleForm.materialCode = res.data.materialCode;
          this.ruleForm.ruleFormula = res.data.ruleExpression;
          let patt = /^\w+\*\w+\+\w*$/;
          if (patt.test(res.data.ruleExpression)) {
            let arr = res.data.ruleExpression.split('*');
            this.ruleForm.coefficient = arr[0];
            this.ruleForm.inventoryCount = arr[1].split('+')[0];
            this.ruleForm.constant = arr[1].split('+')[1];
            console.log('系数：', this.ruleForm.coefficient, '常量：', this.ruleForm.constant);
          } else {
            this.isCustomizeFormula = true;
          }
        }
      });
    },
    deleteHandle(index, item) {
      // 删除项
      this.deleteId = item.id;
      this.deleteDialogVisible = true;
    },
    confirmDeleteHandle() {
      deleteInventoryItem(this.deleteId).then(res => {
        // console.log('删除数据：', res);
        if (res.code === '0') {
          this.deleteDialogVisible = false;
          this.getInventoryRulesList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
      });
    },
    checkHandle(index, item) {
      // 查看项
      this.checkInventoryList = [];
      this.getSearchInventory(item.id);
      this.dialogFormVisible = true;
      this.popupTitle = '产品库存规则维护';
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInventoryRulesList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInventoryRulesList();
    },
    getInventoryRulesList() {
      // 库存规则维护列表
      this.tableLoading = true;
      this.isDefaultFormulaEdit = false;
      let data = {
        materialCode: this.materialCode,
        productCode: this.productCode
      };
      inventoryRulesList(this.currentPage, this.pageSize, data).then(res => {
        console.log('库存规则维护列表：', res);
        if (res.code == '0') {
        	this.tableLoading = false;
          this.inventoryList = res.data.records;
          this.total = res.data.total;
          for(var i=0;i<this.inventoryList.length;i++){
						let item=this.inventoryList[i];
						if(this.currentPage!=1){
						item.idIndex=(this.currentPage-1)*this.pageSize+(i+1)
						}else{
						item.idIndex=i+1;
						}
					}
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    getSearchInventory(id) {
      searchInventoryItem(id).then(res => {
        // console.log('查询单项：', res);
        if (res.code === '0') {
          this.checkInventoryList.push(res.data);
        }
      });
    },
    getInventoryCountList() {
      inventoryCountList('MaterialInventoryType').then(res => {
        console.log('物料库存数：', res);
        if (res.code === '0') {
          this.inventoryRuleList = res.data;
        }
      });
    },
    getRuleFormula() {
      searchRuleFormula(-1).then(res => {
        console.log('规则共识：', res);
        if (res.code === '0') {
          if (res.data) {
            this.defaultRuleFormula = res.data.ruleExpression;
            this.defaultRuleFormulaName = res.data.ruleExpressionName;
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
  .formula_wrap {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border: 1px solid #EEEEEE;
    li {
      display: inline-block;
      padding: 0 10px;
      text-align: center;
      border-right: 1px solid #EEEEEE;
      font-size: 14px;
      color: #606266;
      &:last-child {
        border-right: none;
      }
      &.blue {
        color: #409eff;
        cursor: pointer;
      }
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

.popup_part {
  ul {
    &.childcontentlist {
      height: 80px;
    }
  }
}

ul {
  &.childcontentlist {
    li {
      white-space: normal;
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
  .group {
    width: 100%;
  }
  // .demo-ruleForm {
  //   width: 45%;
  // }
  .input_group {
    .el-form-item {
      position: relative;
      .red {
        position: absolute;
        left: -80px;
      }
    }
  }
}

ul {
  &.childcontentlist {
    li {
      white-space: nowrap;
    }
  }
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
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form-item {
  position: relative;
}
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form-item .red {
  position: absolute;
  left: -50px;
}
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form .el-form-item {
  text-align: center;
}
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form .el-form-item .el-form-item__label {
  width: auto !important;
  text-align: center;
}
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form .el-form-item .el-form-item__content {
  width: 100%;
}
.fabricMaintain .form_part .formula_group .demo-ruleForm .el-form .el-form-item .el-form-item__content .el-input {
  width: 100%;
}
.fabricMaintain .el-form-item {
  width: auto !important;
}
.fabricMaintain .el-form-item.display_ib.mb10.is-error.is-required{
  margin-bottom:20px;
}
</style>