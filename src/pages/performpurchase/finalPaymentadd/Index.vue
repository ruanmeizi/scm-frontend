<template>
  <div class="finalPaymentadd">
    <p class="weight s18 textcolor">尾款付款申请请求</p>
    <div class="addcontent">
      <!-- <span class="red mr5">*</span> -->
      <span class="weight textcolor">形式发票</span>
      <el-upload
        class="upload-demo inline ml20"
        :action="AjaxUrl"
        :headers="myHeaders"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :data="{'type':'1',uuid:this.uuid}"
        :on-change="handleChange"
        :on-success="handleAvatarSuccess">
        <el-button slot="trigger" class="btnclasfour btnclasthree" size="small">
          <i class="el-icon-upload2"></i>
          上传文件
        </el-button>
      </el-upload>
      <span class="textcolor block mt10 s14">支持扩展名:doc .docx .pdf .jpg</span>
      <span class="textcolor block mt10 s14">
        已上传形式发票:
        {{this.fileListname.realname}}
      </span>
    </div>
    <div class="addcontent_content mt10">
      <div class="finalAddlist mt20" v-for="(item, index) in checkArr" :key="index">
        <ul class="weight textcolor s14 demo-form-inline">
          <li class="w15p">
            采购订单：
            <span class="w70p ellipsis" :title="item.poId">{{item.poId}}</span>
          </li>
          <li class="w15p">
            供应商：
            <span class="w70p ellipsis" :title="item.supplierShortName">{{item.supplierShortName}}</span>
            <!-- <span class="w70p ellipsis" :title="item.supplierName">{{item.supplierName}}</span> -->
          </li>
          <li class="w15p">
            调拨货值：
            <span class="w70p ellipsis" :title="item.allocationCargoValueTotal">{{item.allocationCargoValueTotal}}</span>
          </li>
          <li class="w15p">
            币种：
            <span class="w70p ellipsis" :title="item.currencyName">{{item.currencyName}}</span>
          </li>
          <li class="w20p">
            <span class="red mr5">*</span>
            <span>付款比例</span>
            <el-input
              class="ml w100p"
              maxlength="6"
              :max="100"
              v-model.trim="item.applyRatio"
              @keyup.native="InputNumber('applyRatio')"
              @change="InputNumber('applyRatio')"
            ></el-input>
            <span class="ml">%</span>
          </li>
          <li class="w20p">
            <!-- <span class="red mr5">*</span> -->
            <span>形式发票号</span>
            <el-input class="ml w100p" maxlength="63" @keyup.native="invoiceInputNumber(item)" v-model.trim="item.proformaInvoiceNum"></el-input>
          </li>
          <li class="w16p">
            <el-checkbox class="ml" v-model="item.isFinalDelivery">最终发货</el-checkbox>
          </li>
        </ul>

        <div class="hidden">
          <!-- 编辑组件 -->
          <editTable
            :tableList="item.finalPayments"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="editFieldsList"
            @deleteHandle="deleteEditItemHandle"
            @inputChange="inputChange"
            @datePickerChange="datePickerChange"
            @numberInputChange="numberInputChange">
          </editTable>
        </div>


        <!-- <table class="contenttab mt10" cellpadding="0" cellspacing="0">
          <thead>
            <th v-for="(list,index) in item.finalNameList">{{list.name}}</th>
          </thead>
          <tbody>
            <tr v-for="(i,index) in item.finalPayments">
              <td class="w8p" :title="i.materialCode">{{i.materialCode ? i.materialCode : ''}}</td>
              <td class="w6p" :title="i.confirmingCode">{{i.confirmingCode ? i.confirmingCode : ''}}</td>
              <td class="w10p">
                <div v-if="i.purchaseMeasurementUnit=='米'">
                  <span
                    :title="i.confirmPackages==null?'0':i.confirmPackages"
                  >{{i.confirmPackages==null?"0":i.confirmPackages}}&nbsp;包&nbsp;&nbsp;</span>
                  <span
                    :title="i.packSpecification?i.packSpecification:'0'"
                  >{{i.packSpecification?i.packSpecification:'0'}}&nbsp;米/包&nbsp;&nbsp;</span>
                  <span
                    class="result_length"
                    :title="i.confirmQuantity?i.confirmQuantity:'0'"
                  >{{i.confirmQuantity?i.confirmQuantity:'0'}}&nbsp;米</span>
                </div>
                <div v-else>
                  <span
                    v-if="i.purchaseMeasurementUnit!=null"
                    class="result_length"
                    :title="i.confirmQuantity?i.confirmQuantity:'0'"
                  >{{i.confirmQuantity?i.confirmQuantity:'0'}}&nbsp;{{i.purchaseMeasurementUnit}}</span>
                  <span
                    v-else
                    class="result_length"
                    :title="i.confirmQuantity?i.confirmQuantity:'0'"
                  >{{i.confirmQuantity?i.confirmQuantity:'0'}}&nbsp;条</span>
                </div>
              </td>
              <td class="w10p">
                <div v-if="i.purchaseMeasurementUnit=='米'">
                  <span
                    :title="i.readyBagQuantity==null?'0':i.readyBagQuantity"
                  >{{i.readyBagQuantity==null?'0':i.readyBagQuantity}}&nbsp;包&nbsp;&nbsp;</span>
                  <span
                    :title="i.packSpecification?i.packSpecification:'0'"
                  >{{i.packSpecification?i.packSpecification:'0'}}&nbsp;米/包&nbsp;&nbsp;</span>
                  <span
                    class="result_length"
                    :title="i.readyMeter?i.readyMeter:'0'"
                  >{{i.readyMeter?i.readyMeter:'0'}}&nbsp;米</span>
                </div>
                <div v-else>
                  <span
                    v-if="i.purchaseMeasurementUnit!=null"
                    class="result_length"
                    :title="i.readyMeter?i.readyMeter:'0'"
                  >{{i.readyMeter?i.readyMeter:'0'}}&nbsp;{{i.purchaseMeasurementUnit}}</span>
                  <span
                    v-else
                    class="result_length"
                    :title="i.readyMeter?i.readyMeter:'0'"
                  >{{i.readyMeter?i.readyMeter:'0'}}&nbsp;条</span>
                </div>
              </td>
              <td class="w20p">
                <div v-if="i.purchaseMeasurementUnit=='米'">
                  <div class="display_ib w30p">
                    <el-input-number
                      class="w80p"
                      size="small"
                      :disabled="true"
                      :title="i.applyPaidBagQuantity"
                      v-model.trim="i.applyPaidBagQuantity"
                      controls-position="right"
                      :precision="getPrecision(i)"
                      @keyup.native="InputNumber('applyPaidBagQuantity')"
                      @change="InputNumber('applyPaidBagQuantity')"
                      :min="0"
                      step-strictly
                    ></el-input-number>
                    <span class="display_ib" title="包">包</span>
                  </div>
                  <div class="display_ib w40p">
                    <el-input-number
                      class="w60p"
                      size="small"
                      :disabled="true"
                      :title="i.applyPaidBagMeter"
                      v-model.trim="i.applyPaidBagMeter"
                      :precision="2"
                      controls-position="right"
                      @keyup.native="InputNumber('applyPaidBagMeter')"
                      @change="InputNumberprecision('applyPaidBagMeter',i)"
                      :min="0"
                    ></el-input-number>
                    <span class="display_ib" title="米/包">米/包</span>
                  </div>
                  <div class="display_ib w15p">
                    <em
                      :title="i.applyPaidBagQuantity*i.applyPaidBagMeter?i.applyPaidBagQuantity*i.applyPaidBagMeter:0"
                      v-model.trim="i.applyPaidMeter=i.applyPaidBagQuantity*i.applyPaidBagMeter"
                    >
                      <i>{{i.applyPaidBagQuantity*i.applyPaidBagMeter?i.applyPaidBagQuantity*i.applyPaidBagMeter:0}}</i>
                    </em>
                    <span class="display_ib" style="margin-left: 0;" title="米">米</span>
                  </div>
                </div>
                <div v-else>
                  <span>{{i.applyPaidMeter}}</span>
                  <span
                    v-if="i.purchaseMeasurementUnit!=null"
                    class="display_ib"
                    style="margin-left: 0;"
                    title="米"
                  >米</span>
                  <span v-else class="display_ib" style="margin-left: 0;" title="条">条</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table> -->
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        style="float: right;margin-top:45px;margin-right: 20px;"
      >
        <el-button @click="back()">取消</el-button>
        <el-button type="primary" @click="draftsave('save')"   v-preventReClick>保存</el-button>
        <el-button type="primary" @click="draftsave('commit')"  v-preventReClick>提交审批</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { purchasegetuuid, getUserimg, finalPaymentsave } from "@/api/module/finalPaymentApi.js";
import { constDictList } from '@/api/publicApi.js';
import { timeFormat, dateToStr } from "@/utils/index.js";
import editTable from "@/layouts/components/common/EditTableList.vue";
export default {
  name: "finalPaymentRequest",
  props: ["checkArr", "operationTag"],
  components: {
    editTable
  },
  data() {
    return {
      tableLoading: true,
      applyRatio: "",
      proformaInvoiceNum: "",
      AjaxUrl: "",
      fileList: [],
      currencyList:[],
      uuid: "",
      errorTag: "",
      submitType: "",
      auditPerson: "",
      fileListname: {},
      isFinalDelivery: false,
      loadingsave: false,
      loadingcommit: false,
      submitError: false,
      finalNameList: [
        {
          name: "物料编号",
          class: "w8p"
        },
        {
          name: "确认书号",
          class: "w6p"
        },
        {
          name: "确认书数量",
          class: "w10p"
        },
        {
          name: "货妥数量",
          class: "w10p"
        },
        {
          name: "申请付款数量",
          class: "w20p"
        }
      ],
      // 编辑组件数据
      editFieldsList: [
        {
          name: '确认书号',
          field: 'confirmingCode',
          class: 'w16p',
          width: '150'
        },
        {
          name: '确认书数量',
          field: 'confirmQuantity',
          field_1: 'confirmPackages',
          field_2: 'packSpecification',
          field_3: 'confirmQuantity',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '200',
          isUnitSetText: true
        },
        {
          name: '货妥数量',
          field: 'readyMeter',
          field_1: 'readyBagQuantity',
          field_2: 'packSpecification',
          field_3: 'readyMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w13p',
          width: '200',
          isUnitSetText: true
        },
        {
          name: '申请付款数量',
          field: 'applyPaidMeter',
          field_1: 'applyPaidBagQuantity',
          field_2: 'applyPaidBagMeter',
          field_3: 'applyPaidMeter',
          field_unit: 'purchaseMeasurementUnit',
          class: 'w18p',
          width: '200',
          isUnitSetText: true
        }
      ],
      leaderFieldsList: [
        {
          name: '物料编号',
          field: 'materialCode',
          class: 'w10p',
          width: '150'
        }
      ],
      tailFieldsList: [
        // {
        //   name: '操作',
        //   field: '',
        //   class: '',
        //   width: '100',
        //   isAction: true
        // }
      ],
      // 编辑字段呈现方式集合（默认添加模式）
      editModeSet: {},
      textSet: {
        materialCode: true,
        confirmingCode: true
      },
      unitSet: {
        confirmPackages: true,
        readyBagQuantity: true,
        applyPaidBagQuantity: true
      }

    };
  },
  watch:{
    checkArr:{
      deep:true,
      handler:function(){
        console.log('跟着后执行',this.checkArr)
        this.fileListname = "";
        this.getImg();        
        this.uuid=sessionStorage.getItem("uuid");
        console.log(this.uuid)
        this.checkArr.forEach(item => {
          item.finalNameList = this.finalNameList;
        });
        for (var i = 0; i < this.checkArr.length; i++) {
           let i_item=this.checkArr[i];
          for(var z=0;z<this.currencyList.length;z++){
            let z_item=this.currencyList[z];
            if(i_item.currency==z_item.index){
              i_item.currencyName=z_item.name;
            }
          }
          for (var j = 0; j < i_item.finalPayments.length; j++) {
            let data =i_item.finalPayments[j];
            this.updateEditModeSet('edit', data);
          }
        }
      }
    }
  },
  mounted() {
    console.log('列表数据：后执行', this.checkArr);
    console.log(this.operationTag);
    this.getuuid();
    this.getCurrencyList();
    if(this.operationTag=='add'){
      this.fileListname = "";
        this.checkArr.forEach(item => {
          item.finalNameList = this.finalNameList;
        });
        for (var i = 0; i < this.checkArr.length; i++) {
          for (var j = 0; j < this.checkArr[i].finalPayments.length; j++) {
            let data = this.checkArr[i].finalPayments[j];
            this.updateEditModeSet('edit', data);
          }
        }
    }
    this.AjaxUrl = process.env.VUE_APP_INFRASTRUCTURE_URL + "infrastructure/v1/attachments/upload";
    this.myHeaders = { Authorization: `Bearer ${this.$keycloak.token}` };
  },
  methods: {
    getuuid() {
      purchasegetuuid().then(response => {
        if (response.code === "0") {
          this.uuid = response.data;
          window.sessionStorage.setItem("uuid",this.uuid); 
        }
      });
    },
    //获取币种
    getCurrencyList() {
      constDictList('Currency').then(res => {
        console.log('币种列表：', res);
        if (res.code === '0') {
          this.currencyList = res.data;
        }
      });
    },
    //形式发票号要一致
    invoiceInputNumber(item){
      if(this.checkArr.length>1){
        for (var i = 0; i < this.checkArr.length; i++) {
          let data=this.checkArr[i];
          data.proformaInvoiceNum=item.proformaInvoiceNum;
        }
      }      
    },
    getImg() {
      this.checkArr.forEach(item => {
        this.uuid = item.proformaInvoiceUuid;
      });
      if (this.uuid != null && this.uuid != "") {
        getUserimg(this.uuid, 1).then(res => {
          if (res.code === "0") {
            if (res.data != "") {
              this.fileList = res.data;
              for (var i = 0; i < this.fileList.length; i++) {
                let item = this.fileList[i];
                item.name = item.realname;
              }
              console.log(this.fileList[this.fileList.length - 1]);
              this.fileListname = this.fileList[this.fileList.length - 1];
              // this.auditPerson = this.fileList[this.fileList.length - 1].filepath;
              this.auditPerson = this.fileList[this.fileList.length - 1].id;
              for (var j = 0; j < this.checkArr.length; j++) {
                let data = this.checkArr[j];
                data.auditPerson = this.auditPerson;
              }
            }
          }
        });
      }
    },
    //保存
    draftsave(tag) {
      if (tag == "save") {
        this.loadingsave = true;
        console.log(this.checkArr)
        console.log(this.checkArr[0].auditStatus)
        this.toExamine("loadingsave");
        
        if (this.checkArr[0].auditStatus == "Rejected") {
          this.submitType = 3;
        } else {
          this.submitType = 1;
        }
        console.log(this.submitError)
        if (this.submitError != false) {
          this.save("loadingsave");
        }
      } else {
        this.loadingcommit = true;
        this.toExamine("loadingcommit");
        if (this.checkArr[0].auditStatus == "Rejected") {
          this.submitType = 4;
        } else {
          this.submitType = 2;
        }
        console.log(this.submitError)
        if (this.submitError!= false) {
          console.log('通过')
          this.save("loadingcommit");
        }
      }
    },
    beforeAvatarUpload(file) {
      let isType = false;
      let fileName = file.name;
      let fileType = fileName.substr(fileName.lastIndexOf(".") + 1);
      console.log(fileType);
      const isJPG = file.type === "image/jpeg";
      const isDOC = fileType === "doc";
      const isDOCX = fileType === "docx";
      const isPDF = fileType === "pdf";
      if (!isJPG && !isDOC && !isDOCX && !isPDF) {
        this.$message.error("上传发票文件只能是 DOC/DOCX/PDF/JPG/ 格式!");
      }
      if (isJPG || isDOC || isDOCX || isPDF) {
        isType = true;
      }
      return isType;
    },
    save(tag) {
      console.log('尾款保存：', this.checkArr)
       if (tag == "loadingsave") {
        this.loadingsave = true;
      } else {
        this.loadingcommit = true;
      }
      finalPaymentsave(this.submitType, this.checkArr).then(response => {
        if (response.code === "0") {
          if (tag == "loadingsave") {
            this.loadingsave = false;
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.loadingcommit = false;
            this.$message({
              message: "提交成功",
              type: "success"
            });
          }
          window.sessionStorage.removeItem("uuid");
          this.$emit("cancel", this.submitType);
        } else {
          if (tag == "loadingsave") {
            this.loadingsave = false;
          } else {
            this.loadingcommit = false;
          }
        }
      });
    },
    toExamine(tag) {
      console.log(tag)
      this.checkArr.forEach((item, index) => {
        item.applicant = this.$store.getters.getUserName;
        item.applicantDepartment = this.$store.getters.getdepartmentId;
        item.applicantName = this.$store.state.realName;
        item.applicantDepartmentName = this.$store.state.departments[0].name;
        console.log(item.applyRatio);
        if(item.applyRatio == ""||item.applyRatio == null) {
          console.log('进入applyRatio')
          this.errorTag = 2;
          this.submitError = false;
        } else {
          this.errorTag = 4;
          this.submitError = true;
        }
        if (item.isFinalDelivery == null) {
          item.isFinalDelivery = false;
        }
      });
      console.log(this.errorTag)
      if (this.errorTag == 1) {
        this.$message({
          message: "请上传形式发票！",
          type: "error"
        });
        if (tag == "loadingsave") {
          this.loadingsave = false;
        } else {
          this.loadingcommit = false;
        }
      } else if (this.errorTag == 2) {
        this.$message({
          message: "付款比例不能为空！",
          type: "error"
        });
        if (tag == "loadingsave") {
          this.loadingsave = false;
        } else {
          this.loadingcommit = false;
        }

      }else{
        // if (tag == "loadingsave") {
        //   this.loadingsave = false;
        // } else {
        //   this.loadingcommit = false;
        // }
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.$message({
        message: "上传成功",
        type: "success"
      });
      console.log(this.uuid)
      this.checkArr.forEach(item => {
        item.proformaInvoiceUuid = this.uuid;
      });
      this.getImg();
    },
    handleChange(file, fileList) {},
    getPrecision(item) {
      var a = item.applyPaidBagQuantity.toString();
      if (a.length > 6) {
        item.applyPaidBagQuantity = a.slice(0, 6);
        this.$forceUpdate();
      }
    },
    getPrecisionMeter(item) {
      var a = item.applyPaidBagMeter.toString();
      if (a.length > 6) {
        item.applyPaidBagMeter = a.slice(0, 6);
        this.$forceUpdate();
      }
    },
    InputNumberprecision(property, item) {
      var a = item.applyPaidBagMeter.toString();
      if (a.length > 6) {
        item.applyPaidBagMeter = a.slice(0, 6);
        this.$forceUpdate();
      }
      this.checkArr.forEach((item, index) => {
        if (property == "applyRatio") {
          item[property] = this.limitInputPointNumber(item[property]);
        } else {
          item.finalPayments.forEach((i, index) => {
            i[property] = this.limitInputPointNumber(i[property]);
          });
        }
      });
    },
    InputNumber(property) {
      this.checkArr.forEach((item, index) => {
        if (property == "applyRatio") {
          console.log(item[property])
          if(item[property]>100){
             item[property]='';
              this.$message({
                message: "付款比例不能大于100!",
                type: "error"
              });
          }else{
            item[property] = this.limitInputPointNumber(item[property]);
          }
        } else {
          item.finalPayments.forEach((i, index) => {
            i[property] = this.limitInputPointNumber(i[property]);
          });
        }
      });
    },
    // 限制只能输入数字(可以输入两位小数)
    limitInputPointNumber(val) {
      console.log(val)
      if (val === 0 || val === "0" || val === "") {
        return "";
      } else {
        let value = null;
        value = String(val).replace(/[^\d]/g, ""); // 清除“数字”以外的字符
        value = value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
        value = value
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".");
        return Number(value);
      }
    },
    back() {
       window.sessionStorage.removeItem("uuid");
      this.$emit("cancel");
    },
    // 编辑组件函数
    updateEditModeSet(type, data, status) {
      // 编辑字段呈现方式集合
      let editModeSet = JSON.parse(JSON.stringify(this.editModeSet));
      let textSet = JSON.parse(JSON.stringify(this.textSet));
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
      editModeSet.unitSet = unitSet;
      data.editModeSet = editModeSet;
    },

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.ml {
  margin-left: 10px;
}
.mr {
  margin-right: 10px;
}
.weight {
  font-weight: bold;
}
.s18 {
  font-size: 18px;
}
.s14 {
  font-size: 14px;
}
.fl {
  float: left;
}
.textcolor {
  color: #606266;
}
.inline {
  display: inline-block;
}
.block {
  display: block;
}
.finalPaymentadd {
  padding: 10px;
}
.finalAddlist ul {
  width: 100%;
  // height: 50px;
  height: 120px;
  li {
    float: left;
    line-height: 50px;
    height: 50px;
    display: flex;
    margin: 0 10px;
  }
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
table.contenttab td {
  font-size: 14px;
  color: #606266;
  padding: 0 5px;
  height: 50px;
  line-height: 50px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  span {
    display: inline-block;
  }
}
.display_ib {
  em {
    display: inline-flex;
    i {
      width: 60px !important;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
<style>
</style>