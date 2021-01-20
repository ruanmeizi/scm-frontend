<template>
  <div class="container businessattire">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <!-- <div class="display_ib mr10 mb10">
          <span class="tag">产品编号：</span>
          <el-input class="input_single w200 mr10" v-model="productCode" placeholder="请输入"></el-input>
        </div> -->
        <div class="display_ib mr10 mb10">
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
        </div>
        <el-select class="select_single w200 mr10 mb10"
          v-model="unit"
          @change="changeTypeSector()"
          placeholder="请选择">
          <el-option
            v-for="item in dateTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-select class="select_single w200 mr10"
          v-model="startTime"
          @change="changeTimeSector()"
          placeholder="请选择">
          <el-option
            v-for="item in dateList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select> -->
        <div class="display_ib mr10 mb10">
          <el-date-picker class="mr10"
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
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
        <!-- <el-tab-pane class="clearfix" :class="isMonth ? '' : 'not_new_pane'" label="" name="NotNew"> -->
          <singleTable :tableList="notNewResultsList" :tableLeaderFieldsList="notNewFixedFieldList" :tableTailFieldsList="tailFieldsList" :tableFieldsList="notNewTimeFieldList" :tableLoading="tableLoading" :tableHeight="scrollerHeight"></singleTable>

          <!-- <div class="fixed_wrap fl">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in notNewFixedFieldList" :key="index">
                <span>{{item.name}}</span>
              </li>
            </ul>

            <div class="allparentlist">
              <ul
                class="childcontentlist"
                v-for="(item, index) in notNewResultsList"
                :key="index">
                <li class="w50p" :title="item.materialCode ? item.materialCode : ''">{{item.materialCode ? item.materialCode : ''}}</li>
                <li class="w50p" :title="item.productCode ? item.productCode : ''">{{item.productCode ? item.productCode : ''}}</li>
              </ul>
            </div>

          </div>

          <div class="scroll_wrap fl">
            <ul class="childlist">
              <li :class="item.class" v-for="(item, index) in notNewTimeFieldList" :key="index">
                <span>{{item.name}}</span>
              </li>
            </ul>

            <div class="allparentlist">
              <ul
                class="childcontentlist"
                v-for="item in notNewResultsList"
                :key="item.id">
                <li class="w6p" v-for="monthItem in item.list" :key="monthItem.id" :title="monthItem.predictQuantity">{{monthItem.predictQuantity}}</li>
                <li class="w10p" :title="item.totalQuantity">{{item.totalQuantity}}</li>
              </ul>
            </div>
          </div>

          <p v-if="!notNewResultsList.length" style="text-align: center;margin:20px 0;">~~暂无数据~~</p> -->
        <!-- </el-tab-pane> -->

        <!-- <el-tab-pane label="新品" name="New">
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in newFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist"
              v-for="(item, index) in orderList"
              :key="index">
              <li class="w8p">产品编号</li>
              <li class="w8p">物料编号</li>
              <li class="w6p">物料属性</li>
              <li class="w6p">7月</li>
              <li class="w6p">8月</li>
              <li class="w6p">9月</li>
              <li class="w6p">10月</li>
              <li class="w6p">11月</li>
              <li class="w6p">12月</li>
              <li class="w6p">总计</li>
            </ul>
          </div>
          <p v-if="!orderList.length" style="text-align: center;margin:20px 0;">~~暂无数据~~</p>
        </el-tab-pane> -->
      </el-tabs>

      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total">
        </el-pagination>
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

        </el-tabs>
      </el-dialog>
    </div>
    
  </div>
</template>

<script>
import { predictResultsList, factorDateList } from '@/api/module/planApi.js';
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "businessattire",
  props: [],
  data() {
    return {
      // New
      tableLoading:true,
      business: '1',
      predictType:'1',
      type: '',
      productCode: '',
      dateVal: '',
      factorType: 'zyz',
      materialCode: '',
      startTime: '',
      unit: 'M',
      notNewResultsList: [],
      dateList: [],
      factorUnitList: [],
      isMonth: true,
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      activeName: 'NotNew',
      popupTitle: '',
      dialogFormVisible: false,
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
      notNewTimeFieldList: [],
      notNewFixedFieldList: [],
      newFieldList: [
        {
          name: '产品编号',
          class: 'w8p'
        },
        {
          name: '物料编号',
          class: 'w8p'
        },
        // {
        //   name: '物料属性',
        //   class: 'w6p'
        // },
        {
          name: '7月',
          class: 'w6p'
        },
        {
          name: '8月',
          class: 'w6p'
        },
        {
          name: '9月',
          class: 'w6p'
        },
        {
          name: '10月',
          class: 'w6p'
        },
        {
          name: '11月',
          class: 'w6p'
        },
        {
          name: '12月',
          class: 'w6p'
        },
        {
          name: '总计（米）',
          class: 'w10p'
        }
      ],

      // New
      tailFieldsList: [],

    };
  },
  components: {
    singleTable
  },
  beforeCreate() {},
  created() {},
  mounted() {
    this.getFactorDateList();
    // this.getPredictResultsList();
  },
  activated() {},
  watch: {},
  computed: {
    scrollerHeight: function() {
      console.log(window.innerHeight)
      return (window.innerHeight -260) + 'px';
    }
  },
  methods: {
    changeTypeSector(val) {
       this.searchHandle();
    },
    dateValChange() {

    },
    changeTimeSector() {

    },
    searchHandle() {
      // 搜索
      this.currentPage = 1;
      this.notNewResultsList = [];
      this.notNewFixedFieldList = [];
      this.notNewTimeFieldList = [];
      if (this.unit === 'W') {
        this.isMonth = true;
      }
      if (this.unit === 'M') {
        this.isMonth = false;
      }
      if (this.dateVal) {
        this.startTime = this.dateVal[0];
        this.endTime = this.dateVal[1];
      } else {
        this.startTime = '';
        this.endTime = '';
      }
      this.getPredictResultsList();
    },
    switchTabHandle(tab) {
      // console.log(tab.name);
      switch (tab.name) {
        case 'notNew':

          break;
        case 'New':

          break;
        default:
          break;
      }
    },
    handleSizeChange(val) {
      this.notNewResultsList = [];
      this.notNewFixedFieldList = [];
      this.notNewTimeFieldList = [];
      this.pageSize = val;
      this.getPredictResultsList();
    },
    handleCurrentChange(val) {
      this.notNewResultsList = [];
      this.notNewFixedFieldList = [];
      this.notNewTimeFieldList = [];
      this.currentPage = val;
      this.getPredictResultsList();
    },
    getPredictResultsList() {
      // 非新品列表
      this.tableLoading=true;
      let data = {
        materialCode: this.materialCode,
        productCode: this.productCode,
        businessType: this.business,
        startTime: this.startTime,
        endTime: this.endTime,
        unit: this.unit,
        predictType:this.predictType,
        isNewProduct:'0',
      };
      predictResultsList(this.currentPage, this.pageSize, data).then(res => {
        console.log('销售预测非新品列表：', res);
        if (res.code === '0' && res.data && res.data.result.length) {
          this.notNewFixedFieldList = [
            {
              name: '物料编号',
              field: 'materialCode',
              class: 'w50p',
              width: '150'
            },
            {
              name: '产品编号',
              field: 'productCode',
              class: 'w50p',
              width: '150'
            }
          ];
          let totalFieldData = {
            name: '总计（米）',
            field: 'totalQuantity',
            class: 'w10p',
            width: '100',
            isEdit: false
          };
          let resultInfo=[
            {
              name: '组成物料编码',
              field: 'combinedMaterialCode',
              class: 'w10p',
              width: '150',
            },
            {
              name: '供应商编码',
              field: 'supplierId',
              class: 'w10p',
              width: '100',
            },
            {
              name: '品类',
              field: 'category',
              class: 'w10p',
              width: '100',
            },
            {
              name: '是否是快货',
              field: 'mobileGoods',
              class: 'w10p',
              width: '100',
              isMobileGoods:true
            },
            {
              name: '物料ABC分类',
              field: 'materialClassification',
              class: 'w10p',
              width: '150',
            },
            {
              name: '物料属性',
              field: 'materialProperties',
              class: 'w10p',
              width: '100',
            }
          ]
          this.notNewResultsList = res.data.result;
          this.total = res.data.total;
          let resultsList = this.notNewResultsList[0].list;
          for (var i = 0; i < resultsList.length; i++) {
            if (this.unit === 'M') {
              this.notNewTimeFieldList.push({
                name: resultsList[i].monthOrWeek + '月',
                field: 'list[' + i + ']' + '.predictQuantity',
                index: i,
                isSalesPlan: true,
                class: 'w6p',
                width: '100'
              });
            }
            if (this.unit === 'W') {
              this.notNewTimeFieldList.push({
                name: resultsList[i].monthOrWeek + '周',
                field: 'list[' + i + ']' + '.predictQuantity',
                index: i,
                isSalesPlan: true,
                class: 'w6p',
                width: '100'
              });
            }
          }
          this.notNewTimeFieldList.push(totalFieldData);
          this.notNewTimeFieldList.unshift(...resultInfo);
          this.tableLoading=false;
        } else {
          this.tableLoading=false;
        }
      });
      setTimeout(() => {
        this.tableLoading=false;
      }, 10000);
    },
    addDate() {
        var nowDate = new Date();
        let date = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            date: nowDate.getDate(),
        }
        console.log(date);
        if(date.date<10){
            date.date = '0'+ date.date;  //补齐
        }
        if(date.month<10){
            date.date = '0'+ date.date;  //补齐
        }
        this.startTime = date.year + '-'+ date.month + '-'  + date.date;
        console.log(this.startTime);
    },
    getFactorDateList() {
      this.addDate()
      this.dateVal=[this.startTime, '2021-06-01']
      this.endTime='2021-06-01'
      this.getPredictResultsList();
      // factorDateList(this.factorType, this.unit).then(res => {
      //   this.dateList = res.data;
      //   this.startTime = res.data[0];
      //   this.getPredictResultsList();
      // });
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

.businessattire {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
    &.childlist {
      li {
        cursor: pointer;
      }
    }
    &.childcontentlist {
      height: 60px;
      line-height: 40px;
    }
  }
  .submit_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
  .not_new_pane {
    .fixed_wrap {
      width: 16%;
      box-shadow: 0 0 10px rgba(0,0,0,.12);
      ul {
        &.childlist {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
      }
    }
    .scroll_wrap {
      width: 84%;
      overflow: auto;
      ul {
        &.childlist {
          width: 300%;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        &.childcontentlist {
          width: 300%;
        }
      }
    }
  }
  .fixed_wrap {
    width: 16%;
    ul {
      &.childlist {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
  .scroll_wrap {
    width: 84%;
    ul {
      &.childlist {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
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

</style>
<style>
.businessattire .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.businessattire .subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.businessattire .subnav_wrap .el-tabs__content {
  width: 100%;
  overflow: auto;
}
.businessattire .subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.businessattire .subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.businessattire .subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
.businessattire .subnav_wrap ul.el-dropdown-menu li.el-dropdown-menu__item {
  padding: 0 10px;
}

.businessattire .el-dropdown-menu {
  width: 80px;
  text-align: center;
}
</style>