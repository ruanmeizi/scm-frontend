<template>
  <div class="container SCMStrategy" id="container">
    <div class="actions_part clearfix">

    </div>

    <div class="table_part clearfix">
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
        <el-tab-pane label="年权重" name="Weights">
          <singleTable :tableList="weightsOrGrowList" :tableLeaderFieldsList="leaderFieldsList" :tableTailFieldsList="tailFieldsList" :tableFieldsList="weightsFieldList" @editHandle="editWeightsHandle"></singleTable>
          <div class="space"></div>
          <singleTable :tableList="oldweightsOrGrowList" :tableLeaderFieldsList="leaderFieldsList"  :tableFieldsList="weightsFieldList" :tableTailFieldsList='oldtailFieldsList'></singleTable>
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in weightsFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist">
              <li class="w30p">{{weightsOrGrowList.weight1}}%</li>
              <li class="w30p">{{weightsOrGrowList.weight2}}%</li>
              <li class="w30p">{{weightsOrGrowList.weight3}}%</li>
              <li class="fr">
                <i type="primary" class="el-icon-edit" title="修改" @click="editWeightsHandle(weightsOrGrowList)"></i>
              </li>
            </ul>
          </div> -->
        </el-tab-pane>

        <el-tab-pane label="销售剔除项" name="Cull">
          <singleTable :tableList="cullList" :tableLeaderFieldsList="leaderFieldsList" :tableTailFieldsList="tailFieldsLists" :tableFieldsList="cullFieldList" @editHandle="editCullHandle"></singleTable>
          <div class="space"></div>
          <singleTable :tableList="oldcullList" :tableLeaderFieldsList="leaderFieldsList" :tableFieldsList="cullFieldList" :tableTailFieldsList="oldtailFieldsLists" ></singleTable>
          <!-- <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in cullFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist">
            <ul
              class="childcontentlist">
              <li class="w30p"
                v-for="(item, index) in cullList"
                :key="index">{{item.excludeQuantity}}&nbsp;&nbsp;&nbsp;米</li>
              <li class="fr">
                <i type="primary" class="el-icon-edit" title="修改" @click="editCullHandle(cullList)"></i>
              </li>
            </ul>
          </div> -->
        </el-tab-pane>
        
      </el-tabs>
      
    </div>

    <!-- 弹窗 -->
    <div class="popup_part">
      <el-dialog
        :title="popupTitle"
        v-dialogDrag
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogFormVisible">
        <el-tabs>
          <ul class="childlist">
            <li :class="item.class" v-for="(item, index) in popupFieldList" :key="index">{{item.name}}</li>
          </ul>
          <div class="allparentlist" v-if="activeName == 'Weights'">
            <ul
              class="childcontentlist">
              <li class="w25p">
                <el-select class="select_single w200 mr10"
                  v-model="saleSeason"
                  @change="changeTypeSector"
                  placeholder="请选择">
                  <!-- <el-option key="" label="请选择" value=""></el-option> -->
                  <el-option
                    v-for="item in dateTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </li>
              <li class="w25p">
                <el-input-number v-model="weight1" controls-position="right" @change="handleChange" :min="0"></el-input-number>&nbsp;&nbsp;&nbsp;%
              </li>
              <li class="w25p">
                <el-input-number v-model="weight2" controls-position="right" @change="handleChange" :min="0"></el-input-number>&nbsp;&nbsp;&nbsp;%
              </li>
              <li class="w25p">
                <el-input-number v-model="weight3" controls-position="right" @change="handleChange" :min="0"></el-input-number>&nbsp;&nbsp;&nbsp;%
              </li>
            </ul>
          </div>
          <div class="allparentlist" v-if="activeName == 'Cull'">
            <ul
              class="childcontentlist">
              <li class="w30p">
                <el-select class="select_single w200 mr10"
                  v-model="saleSeason"
                  @change="changeTypeSector"
                  placeholder="请选择">
                  <!-- <el-option key="" label="请选择" value=""></el-option> -->
                  <el-option
                    v-for="item in dateTypeList"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </li>
              <li class="w30p">
                <el-input-number v-model="excludeQuantity" @change="handleChange" :precision="2" :min="1" label="描述文字"></el-input-number>&nbsp;&nbsp;&nbsp;米
              </li>
            </ul>
          </div>
          
        </el-tabs>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogConfirmHandle">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    
  </div>
</template>

<script>
import { editZCWeightsItem, editZCCullItem, weightsOrGrowList, cullList, getExcludeHistory, getWeightHistory,queryCurrent} from '@/api/module/planApi.js';
import { timeFormat } from '@/utils/index.js';
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "SCMStrategy",
  props: [],
  data() {
    return {
      dateVal: '',
      orderCode: '',
      dateVal: '',
      saleType: '2',
      weight1: '',
      weight2: '',
      weight3: '',
      activeName: 'Weights',
      dialogFormVisible: false,
      popupTitle: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      isShowList: false,
      dialogdelVisible: false,
      n1WeightsNum: '',
      n2WeightsNum: '',
      n3WeightsNum: '',
      singleNum: '',
      excludeQuantity: '',
      growNum: '',
      cullList: [],
      weightsOrGrowList: [],
      popupFieldList: [],
      weightsFieldList: [
        {
          name:'销售季',
          field:'saleSeason',
          class:'w30p',
          minWidth:'20%'
        },
        {
          name: '前1年',
          field: 'weight1',
          class: 'w30p',
          minWidth: '20%'
        },
        {
          name: '前2年',
          field: 'weight2',
          class: 'w30p',
          minWidth: '20%'
        },
        {
          name: '前3年',
          field: 'weight3',
          class: 'w30p',
          minWidth: '20%'
        }
      ],
      cullFieldList: [
        {
          name:'销售季',
          field:'saleSeason',
          class:'w30p',
          minWidth:'33%'
        },
        {
          name: '单笔销售订单数量>',
          field: 'excludeQuantity',
          class: 'w30p',
          minWidth: '33%'
        }
      ],

      // New
      leaderFieldsList: [],
      tailFieldsList: [
        {
          name: '操作',
          field: '',
          class: '',
          width: '100',
          minWidth: '10%',
          isAction: true,
          hasEdit: true
        }
      ],
      tailFieldsLists: [
        {
          name: '操作',
          field: '',
          class: '',
          //width: '100',
          minWidth: '33%',
          isAction: true,
          hasEdit: true
        }
      ],
      oldtailFieldsList:[
        {
          name: '',
          field: '',
          class: '',
          width: '100',
          minWidth: '10%',
        }
      ],
      oldtailFieldsLists:[
        {
          name: '',
          field: '',
          class: '',
          // width: '100',
          minWidth: '33%',
        }
      ],
      oldweightsOrGrowList:[],
      oldcullList:[],
      dateTypeList:'',
      saleSeason:'',
      id:'',
    };
  },
  components: {
    singleTable
  },
  beforeCreate() {

  },
  created() {
    this.getWeightsOrGrowList();
    this.getCullList();
    this.getWeightHistoryList();
    this.getExcludeHistoryList();
    this.getqueryCurrent();
    this.popupFieldList = this.weightsFieldList;
  },
  mounted() {

  },
  activated() {

  },
  watch: {},
  computed: {

  },
  methods: {
    searchHandle() {

    },
    switchTabHandle(val) {
      // console.log(val);
      switch (val.name) {
        case 'Weights':
          this.popupFieldList = this.weightsFieldList;
          break;
        case 'Cull':
          this.popupFieldList = this.cullFieldList;
          break;
        default:
          this.popupFieldList = this.weightsFieldList;
          break;
      }
    },
    editWeightsHandle(index, item) {
      console.log('编辑年权重：', index, item);
      this.weight1 = item.weight1 && item.weight1.indexOf('%') != '-1' ? item.weight1.split('%')[0] : item.weight1;
      this.weight2 = item.weight2 && item.weight2.indexOf('%') != '-1' ? item.weight2.split('%')[0] : item.weight2;
      this.weight3 = item.weight3 && item.weight3.indexOf('%') != '-1' ? item.weight3.split('%')[0] : item.weight3;
      this.saleSeason=item.saleSeason;
      this.id=item.id;
      this.popupTitle = '编辑';
      this.dialogFormVisible = true;
    },
    editCullHandle(index, item) {
      this.excludeQuantity = item.excludeQuantity && item.excludeQuantity.indexOf('米') != '-1' ? (item.excludeQuantity + '').split(' ')[0] : item.excludeQuantity;
      this.saleSeason=item.saleSeason;
      this.id=item.id;
      this.popupTitle = '编辑';
      this.dialogFormVisible = true;
    },
    dialogConfirmHandle() {
      switch (this.activeName) {
        case 'Weights':
          if (!this.verificationHandle(this.weight1, true)) {
            this.weight1 = 0;
            return false;
          }
          if (!this.verificationHandle(this.weight2, true)) {
            this.weight2 = 0;
            return false;
          }
          if (!this.verificationHandle(this.weight3, true)) {
            this.weight3 = 0;
            return false;
          }
          if ((this.weight1 + this.weight2 + this.weight3) !== 100) {
            this.$message({
              message: '权重总和应该为100，请重新输入！',
              type: 'error'
            });
            return false;
          }
          let weightsData = {
            businessType: this.saleType,
            weight1: this.weight1,
            weight2: this.weight2,
            weight3: this.weight3,
            saleSeason:this.saleSeason,
            id:this.id
          };
          editZCWeightsItem(weightsData).then(res => {
            console.log('权重值：', res);
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: '年权重编辑成功！'
              });
              this.getWeightsOrGrowList();
              this.dialogFormVisible = false;
            }
          });
          break;
        case 'Cull':
          if (!this.verificationHandle(this.excludeQuantity)) {
            this.excludeQuantity = 1.00;
            return false;
          }
          let cullList = [
            {
              excludeQuantity: this.excludeQuantity,
              businessType: this.saleType,
              saleSeason:this.saleSeason,
              id:this.id
            }
          ];
          editZCCullItem(cullList).then(res => {
            console.log('销售剔除项：', res);
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: '销售剔除项编辑成功！'
              });
              this.getCullList();
              this.dialogFormVisible = false;
            }
          });
          break;
      
        default:
          break;
      }
    },
    verificationHandle(val, isInt) {
      if (val) {
        if (val.toString().indexOf('.') !== -1) {
          let arr = val.toString().split('.');
          console.log(arr);
          if (isInt) {
            this.$message({
              message: '仅支持整数，请重新输入！',
              type: 'error'
            });
            return false;
          } else {
            if (arr[0].length > 8) {
              this.$message({
                message: '超长字符，最多输入整数位8位，请重新输入！',
                type: 'error'
              });
              return false;
            }
            if (arr[1].length > 2) {
              this.$message({
                message: '超长字符，最多输入整数位8位，小数位2位，请重新输入！',
                type: 'error'
              });
              return false;
            }
          }
        } else if (val.toString().length > 8) {
          this.$message({
            message: '超长字符，最多输入整数位8位，请重新输入！',
            type: 'error'
          });
          return false;
        }
        return true;
      } else {
        this.$message({
          message: '值不能为空，请完善信息！',
          type: 'error'
        });
        return false;
      }
    },
    handleChange() {

    },
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    getWeightsOrGrowList() {
      weightsOrGrowList(this.saleType).then(res => {
        console.log('权重、增长率列表：', res);
        if (res.code === '0') {
          //let list = [];
          for(var i=0;i<res.data.length;i++){
            res.data[i].weight1 = res.data[i].weight1 + '%';
            res.data[i].weight2 = res.data[i].weight2 + '%';
            res.data[i].weight3 = res.data[i].weight3 + '%';
          }
          //list.push(res.data);
          this.weightsOrGrowList = res.data;
        }
      });
    },
    getWeightHistoryList() {
      getWeightHistory(this.saleType).then(res => {
        console.log('历史权重、增长率列表：', res);
        if (res.code === '0') {
          //let list = [];
          for(var i=0;i<res.data.length;i++){
            res.data[i].weight1 = res.data[i].weight1 + '%';
            res.data[i].weight2 = res.data[i].weight2 + '%';
            res.data[i].weight3 = res.data[i].weight3 + '%'; 
          }
          //list.push(res.data);
          this.oldweightsOrGrowList = res.data;
        }
      });
    },
    getCullList() {
      cullList(this.saleType).then(res => {
        console.log('剔除标准列表：', res);
        if (res.code === '0') {
          for(var i=0;i<res.data.length;i++){
            res.data[i].excludeQuantity = res.data[i].excludeQuantity + ' 米';
          }
          this.cullList = res.data;
        }
      });
    },
    getExcludeHistoryList(){
      getExcludeHistory(this.saleType).then(res => {
        console.log('历史剔除标准列表：', res);
        if (res.code === '0') {
          for(var i=0;i<res.data.length;i++){
            res.data[i].excludeQuantity = res.data[i].excludeQuantity + ' 米';
          }
          this.oldcullList = res.data;
        }
      });
    },
    getqueryCurrent(){
      queryCurrent(this.saleType).then(res => {
        console.log('获取销售季列表', res);
        this.dateTypeList=res.data;
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

.SCMStrategy {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
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
.space{
  width:100%;
  height:250px;
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
</style>