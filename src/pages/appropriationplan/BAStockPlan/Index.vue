<template>
  <div class="container BAPurchasePlan">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10">
          <span class="tag">计算维度：</span>
          <el-select class="select_single w200 mr10"
            v-model="unit"
            @change="changeTypeSector"
            placeholder="请选择">
            <el-option
              v-for="item in dateTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10">
          <span class="tag">计划时间：</span>
          <el-date-picker
            class="select_single w200 mr10"
            v-model="calTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择">
          </el-date-picker>
        </div>
        <div class="display_ib mr10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
        </div>
      </div>

      <!-- <el-select class="select_single w200 mr10"
        v-model="unit"
        @change="changeTypeSector()"
        placeholder="请选择">
        <el-option key="" label="请选择计算维度" value=""></el-option>
        <el-option
          v-for="item in dateTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        class="select_single w200 mr10"
        v-model="calTime"
        type="date"
        format="yyyy-MM-dd"
		    value-format="yyyy-MM-dd"
        placeholder="请选择计划时间">
      </el-date-picker>
      <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入物料编号"></el-input> -->
      <div class="actions_btn_wrap down t_right">
        <el-button
          class="mr10"
          size="small"
          type="primary"
          icon="el-icon-search"
          circle
          title="搜索"
          :disabled="isSearchDisabled"
          @click="searchHandle"
        ></el-button>
        <el-popover
          class="popover_filter_wrap"
          placement="bottom"
          width="500"
          trigger="click"
          @hide="filterFieldHide">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="checkedFields" @change="fieldCheckedGroupChange">
            <el-checkbox v-for="(item, index) in fieldList" :label="item.columnName" :key="index" @change="fieldCheckedChange($event, item, index)">{{item.columnName}}</el-checkbox>
          </el-checkbox-group>
          <el-button
            class="mr10"
            size="small"
            slot="reference"
            type="primary"
            icon="el-icon-set-up"
            circle
            title="筛选字段"
            @click="filterFieldHandle"
          ></el-button>
        </el-popover>
        <el-button type="primary" @click="createOrderHandle">创建调拨单</el-button>
        <!--<el-button
          size="small"
          type="primary"
          icon="el-icon-download"
          circle
          title="下载"
          @click="downloadHandle"
        ></el-button>-->
      </div>
    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap" :class="fieldListCopy.length > 10 ? 'auto' : ''" v-loading='tableLoading'>
        <!-- <ul v-if="fieldListCopy.length" class="childlist" :style="fieldListCopy.length > 10 ? ('width: ' + fieldListCopy.length * 10 + '%;') : 'width: 100%;'">
          <li class="w10p" v-for="(item, index) in fieldListCopy" :key="index">{{item.columnName}}</li>
        </ul>
        
        <div v-if="fieldListCopy.length" class="allparentlist" :style="fieldListCopy.length > 10 ? ('width: ' + fieldListCopy.length * 10 + '%;') : 'width: 100%;'">
          <ul
            class="childcontentlist"
            v-for="(item, index) in purchaseList"
            :key="index">
            <li class="w10p" v-for="(fieldItem, i) in fieldListCopy" :key="i">
              <span v-if="!fieldItem.isThereDetail" :title="item[fieldItem.columnCode]">{{item[fieldItem.columnCode]}}</span>
              <el-popover
                v-else
                class="popover_wrap"
                placement="right"
                width="400"
                trigger="click"
                @show="fieldInfoShow(fieldItem.columnCode, item.uuid)">
                
                <div v-if="fieldItem.columnCode == 'period'">
                  <div class="title" v-if="periodInfoData.length">周期起始日期：{{periodInfoData[0].startTime}} - {{periodInfoData[0].endTime}}</div>
                  <el-table class="popover_table" :data="periodInfoData">
                    <el-table-column width="150" property="inStorageDate" label="入库周期"></el-table-column>
                    <el-table-column width="150" property="shipmentDate" label="清关周期"></el-table-column>
                    <el-table-column width="150" property="advancePaymentDate" label="预付款周期"></el-table-column>
                  </el-table>
                </div>
                <el-button slot="reference" :title="item[fieldItem.columnCode]">{{item[fieldItem.columnCode]}}</el-button>
              </el-popover>
            </li>           
          </ul>
        </div> -->
        <el-checkbox-group v-model="checkList" @change="checkOptionChange">
          <singleTable
            :tableList="purchaseList"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="fieldsList"
            @checkAllChange='checkAllChange'
            :tableHeight="scrollerHeight"
          ></singleTable>
        </el-checkbox-group>
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
</template>

<script>
import {purchaseSerch,allotscreen,periodInfo,queryReadyPlanPage,queryIsTheSameSupplier,queryPrOrToData} from '@/api/module/allotApi.js'
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "BAPurchasePlan",
  props: [],
  data() {
    return {
      tableLoading:true,
      calTime:this.getNowTime(),
      materialCode: '',
      predictTime: '',
      unit:'W',
      purchaseList: [],
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      checkList: [],
      dateList: [],
      // 字段筛选
      checkAll: true,
      isSearchDisabled: false,
      fieldList: [], //表头字段
      fieldListCopy: [], //表头字段和表单数据
      allFieldListCopy: [], //表头字段和表单数据
      checkedFields: [],
      checkedFieldsList: [],
      dateTypeList: [
        {
          value: 'M',
          label: '按月'
        },
        {
          value: 'W',
          label: '按周'
        }
      ],
      gridData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      usableReadyTotalData: [],
      periodInfoData:[],
      leaderFieldsList: [],
      fieldsList: [],
      tailFieldsList: [],
      ruleForm:[],
    };
  },
  components: {
    singleTable
  },
  beforeCreate() {

  },
  created() { 
    this.getPurchasePlanFields();
    //this.getPurchasePlanList();
  },
  mounted() {
    this.getPurchasePlanList();
    var day=new Date();
    day.setTime(day.getTime());
    console.log(day.getMonth);
    var s2 = day.getFullYear()+"-" + (day.getMonth()+1) + "-" + day.getDate();
    this.value1=s2;
  },
  activated() {

  },
  watch: {

  },
  computed: {
    scrollerHeight: function() {
      return (window.innerHeight -260) + 'px';
    }
  },
  methods: {
  	getNowTime() {
      let now = new Date();
      let year = now.getFullYear(); //得到年份
      let month = now.getMonth(); //得到月份
      let date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      let defaultDate = `${year}-${month}-${date}`;
      return defaultDate;
      // this.$set(this.info, 'stockDate', defaultDate);
    },
  	fieldInfoShow(field, uuid) {
      // 字段数据详情
      console.log('弹窗字段：', field, '数据：', uuid);
      switch (field) {
        case 'period':  //交货周期
          this.getPeriodInfo(uuid);
          console.log('periodInfoData: ', this.periodInfoData);
          break;
        case 'usableReadyTotal':  //可用备货总量
          this.getUsableReadyTotalInfo(uuid);
          break;
      
        default:
          break;
      }
    },
    getUsableReadyTotalInfo(uuid) {
      // 可用备货总量
      this.usableReadyTotalData = [];
      usableReadyTotalInfo(uuid).then(res => {
        console.log('可用备货总量详情：', res);
        if (res.code === '0') {
          this.usableReadyTotalData.push(res.data);
        }
      });
    },
    getPeriodInfo(uuid) {
      // 交货周期
      this.periodInfoData = [];
      periodInfo(uuid).then(res => {
        console.log('交货周期详情：', res);
        if (res.code === '0') {
        	console.log(res.data)
          this.periodInfoData.push(res.data);
          this.$forceUpdate();
        }
      });
    },
    checkAllChange(item) {
      console.log(item);
    },
    checkOptionChange(val){
      console.log(val);
      this.ruleForm=val;
    },
    createOrderHandle() {
      // 创建采购申请单
      if (!this.ruleForm.length) {
        this.$message({
          type: "error",
          message: '请选择要创建的采购请求！'
        });
        return;
      }
      this.getQueryIsTheSameSupplier()
    },
    getQueryIsTheSameSupplier(){
      var that=this;
      queryIsTheSameSupplier(this.ruleForm).then(response => {
        if(response.code === "0") {
          if(response.data==1){
            this.getQueryPrOrToData();
          }else{
            this.$message({
              type: "error",
              message: '所选择的物料供应商不一致！'
            });
          }
        }
      });
    },
    changeTypeSector(val) {
       this.searchHandle();
    },
    changeTimeSector() {

    },
    dateValChange(val) {
      console.log('选择日期：', val);
      console.log('dateVal: ', this.dateVal);
    },
    searchHandle() {
      // 搜索
      this.currentPage = 1;
      this.getPurchasePlanList('search');
    },
//  filterFieldHandle() {
//    // 显示筛选框
//    console.log('checkedFields: ', this.checkedFields);
//    console.log('fieldList: ', this.fieldList);
//    
//  },
    filterFieldHandle() {
      // 显示筛选框
      console.log('checkedFields: ', this.checkedFields);
      console.log('fieldList: ', this.fieldList);
      this.isSearchDisabled = true;
      this.checkAll = this.checkedFields.length === this.fieldList.length;
    },
    filterFieldHide() {
      // 关闭筛选框
      console.log('选中值：', this.checkedFields);
      this.isSearchDisabled=false;
      let checkedFields = this.checkedFields;
      let localFieldListCopy = JSON.parse(JSON.stringify(this.fieldListCopy));
      let localAllFieldListCopy = JSON.parse(JSON.stringify(this.allFieldListCopy));
      let list = [];
      let checkList = [];
      for (var i = 0; i < checkedFields.length; i++) {
        localAllFieldListCopy.forEach((item, index) => {
          if (item.columnName == checkedFields[i]) {
            list.push(item);
          }
        });
       
      }
      localFieldListCopy = list;
      this.fieldListCopy = localFieldListCopy;
      var checked={
        columnCode: "",
        columnName: "物料编号",
        isCheckbox:true
      }
      this.fieldListCopy.unshift(checked);
      console.log(this.fieldListCopy)
      this.fieldsList=this.fieldListCopy.map(el => {
        return {
            name: el.columnName,
            field: el.columnCode,
            isCheckbox:el.isCheckbox,
            width:180
        }
      })
    },
    handleCheckAllChange(val) {
      // 字段筛选框全选
      console.log(val);
      let list = [];
      this.fieldList.forEach(item => {
        list.push(item.columnName);
      });
      this.checkedFields = val ? list : [];
    },
    fieldCheckedChange(val, item, index) {
      console.log('子选项：', val, item, index);
    },
    fieldCheckedGroupChange(val) {
      // 是否全选
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.fieldList.length;
    },
    downloadHandle() {
      // 下载
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPurchasePlanList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPurchasePlanList();
    },
    getQueryPrOrToData(){
      var data=[];
      for(var j=0;j<this.purchaseList.length;j++){
        for(var i=0;i< this.ruleForm.length;i++){
          if(this.ruleForm[i]==this.purchaseList[j].materialCode){
            data.push({
              adviceQuantity:this.purchaseList[j].transferPlanQuantity,
              materialCode:this.purchaseList[j].materialCode
            })
          }
        }
      }
      console.log(data);
      queryPrOrToData(data).then(res => {
        console.log(res.data);
        this.$store.dispatch('getPlanToTOList', res.data);
        this.$store.commit('getTOEditShow');
        this.$router.push("/transferslip");
        this.$forceUpdate();
      })
    },
    getPurchasePlanList(type) {
    	console.log(this.calTime)
      this.tableLoading=true;
      let data = {
        unit: this.unit,
        startTime: this.calTime,
        materialCode: this.materialCode,
        businessType:1,
        planType:2,
      };
      queryReadyPlanPage(this.currentPage, this.pageSize, data).then(res => {
        console.log('采购计划列表：', res);
        if (res.code === '0') {
          res.data.records.forEach((num, index) => {
            switch(num.unit) {
                case "W":
                    num.unit="周"
                    break;
                case "M":
                    num.unit="月"
                    break;
                default:
                    num.unit=""
            } 
          });
          this.purchaseList = res.data.records;
          this.total = res.data.total;
          let list = this.purchaseList;
          let localFieldListCopy = JSON.parse(JSON.stringify(this.fieldListCopy));
          let checkList = [];
          for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < localFieldListCopy.length; j++) {
              let columnCode = localFieldListCopy[j].columnCode;
              localFieldListCopy[j].fieldValue = list[i][columnCode];
              // if (columnCode == 'period' || columnCode == 'periodTotalQuantity' || columnCode == 'monthQuantity' || columnCode == 'usableReadyTotal' || columnCode == 'lastReadyTotal') {
              if (columnCode == 'period' || columnCode == 'usableReadyTotal') {
                localFieldListCopy[j].isThereDetail = true;
              }
            }
          }
//        this.allFieldListCopy = localFieldListCopy;
          if (type == 'search') {
            this.fieldListCopy = localFieldListCopy;
            console.log(this.fieldListCopy)
            // var checked={
            //   columnCode: "",
            //   columnName: "物料编号",
            //   isCheckbox:true
            // }
            // this.fieldListCopy.unshift(checked);
            this.fieldsList=this.fieldListCopy.map(el => {
              return {
                  name: el.columnName,
                  field: el.columnCode,
                  isCheckbox:el.isCheckbox,
                  width:180
              }
            })
          } else {
          	for (var m = 0; m < localFieldListCopy.length; m++) {
	            let data = localFieldListCopy[m];
	            if (data.columnCode == 'materialCode' || data.columnCode == "materialId" || data.columnCode == 'productCode' || data.columnCode == 'unit' || data.columnCode == 'transferPlanQuantity' || data.columnCode == 'transferPlanPackages' || data.columnCode == 'monthQuantity' || data.columnCode == 'readyTotal' || data.columnCode == 'lastReadyTotal' || data.columnCode == 'inInventoryAndTransfer') {
	              checkList.push(data);
	            }
	          }
            this.fieldListCopy = checkList;
            var checked={
              columnCode: "",
              columnName: "物料编号",
              isCheckbox:true
            }
            this.fieldListCopy.unshift(checked);
            this.fieldsList=this.fieldListCopy.map(el => {
              return {
                  name: el.columnName,
                  field: el.columnCode,
                  isCheckbox:el.isCheckbox,
                  width:150
              }
            })
	          let checkFieldslist = [];
	          for (var i = 0; i < this.fieldList.length; i++) {
	            let data = this.fieldList[i];
	            if (data.columnCode == 'materialCode' || data.columnCode == "materialId" || data.columnCode == 'productCode' || data.columnCode == 'unit' || data.columnCode == 'transferPlanQuantity' || data.columnCode == 'transferPlanPackages' || data.columnCode == 'monthQuantity' || data.columnCode == 'readyTotal' || data.columnCode == 'lastReadyTotal' || data.columnCode == 'inInventoryAndTransfer') {
	              checkFieldslist.push(data.columnName);
	            }
	          }
	          this.checkedFields = checkFieldslist;         	
          } 
          this.$forceUpdate();
          this.tableLoading=false;
        }else{
          this.tableLoading=false;
        }
      });
      setTimeout(() => {
        this.tableLoading=false;
      }, 20000);
    },
    async getPurchasePlanFields() {
      await allotscreen().then(res => {
      console.log('字段列表：', res);
        if (res.code === '0') {
          this.fieldList = res.data;
          this.fieldListCopy = JSON.parse(JSON.stringify(this.fieldList));
          this.allFieldListCopy = JSON.parse(JSON.stringify(this.fieldList));
          this.checkedFields = [];
          this.fieldList.forEach(item => {
//          console.log('字段名称：', item);
            this.checkedFields.push(item.columnName);
          });
        }
      });
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

.BAPurchasePlan {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
ul.childcontentlist{
	li{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap!important;
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
  .popover_wrap {
    .el-popover__reference {
      background: none;
      border: none;
      border-radius: 0;
      padding: 5px;
      border-bottom: 1px solid #409EFF;
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

// popover弹出框
.el-popover {
  .title {
    padding: 10px 0;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
  }
  .el-checkbox {
    margin-bottom: 10px;
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
/* .subnav_wrap .el-tabs__header {
  width: 90%;
} */
.subnav_wrap .el-tabs__content {
  overflow: auto!important;
}

.subnav_wrap.auto .el-tabs__content {
  overflow: auto;
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

/* popover弹出框 */
.popover_table.el-table .el-table__header th, .popover_table.el-table .el-table__header tr {
  height: 40px;
  background-color: #f5f7fa;
}

</style>