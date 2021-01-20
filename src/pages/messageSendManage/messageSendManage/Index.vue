<template>
  <div class="container messageSend">
    <div class="commoncontent">
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="display_ib mr10 mb10">
            <span class="tag">消息内容：</span>
            <el-input class="input_single w200 mr10" v-model.trim="messageInfo" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">发送状态：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="messageState"
              @change="searchclick"
              placeholder="请选择发送状态"
            >
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in messageSendStatusList"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchclick"
          ></el-button>
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <singleTable
            :tableList="tableData"
            :tableLeaderFieldsList="leaderFieldsList"
            :tableTailFieldsList="tailFieldsList"
            :tableFieldsList="fieldsList"
            @popoverHandle="popoverHandle"
            @resendHandle="resendHandle"
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
            :total="this.allpage"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { constDictList, rabbitMQSelect,rabbitMQSend } from "@/api/module/messageSendApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { timeFormat,getTimeRange} from '@/utils/index.js';
export default {
  name: "messageSend",
  data() {
    return {
      //
      messageState: "",
      messageInfo: "",
      messageSendStatusList: [],
      tableData: [],

      pageSize: 10, //每页显示多少条
      size: "",
      allpage: 0,
      allpagechild: 0,
      currentPage: 1, //页数
      pageSizechild: 10, //每页显示多少条
      currentPagechild: 1, //页数
      //分页
      leaderFieldsList: [],
      tailFieldsList: [
        {
          name: "操作",
          field: "",
          class: "",
          minWidth: '10%',
          width: "150",
          isAction: true,
        }
      ],
      fieldsList: [
        {
          name: "序号",
          field: "idIndex",
          class: "w30p"
        },
        {
          name: "主题",
          field: "routingKey",
          class: "w30p"
        },
        {
          name: "内容",
          field: "message",
          class: "w30p",
          width:"250",
          hasPopover: true,
          popovers: {
            popType: "table_json",
            width: "300",
            trigger: "click",
            placement: "right",
            parentName: "详情",
            parentField: "message",
            listName: "",
            fields: [
              {
                name: "内容详情",
                field: "saleOrder",
                width: "300"
              }
            ]
          }
        },
        {
          name: "状态",
          field: "showStatus",
          class: "w30p"
        },
        {
          name: "创建时间",
          field: "createTime",
          class: "w30p"
        },
        {
          name: "修改时间",
          field: "updateTime",
          class: "w30p"
        }
      ],
    };
  },
  components: {
    singleTable
  },
  created() {},
  mounted() {
    this.rabbitMQSelectList();
    this.getMessageSendStatus();
  },
  watch: {},
  methods: {
    getMessageSendStatus() {
      // 贸易条款列表
      constDictList("RabbitMQType").then(res => {
        console.log("发送状态数据：", res);
        if (res.code === "0") {
          this.messageSendStatusList = res.data;
        }
      });
    },
    popoverHandle(index, item, name, field) {
       switch (field) {
          case "message":
          var data=JSON.parse(item.message);
          var saleList = [{saleOrder:data}];
          console.log(saleList);
          this.$store.dispatch("getPopoverList", saleList);
          this.$forceUpdate();
          break;
        default:
        break;
       }
    },
    rabbitMQSelectList() {
      this.tableLoading = true;
      let obj = {
        message: this.messageInfo,
        status: this.messageState
      };
      rabbitMQSelect(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          console.log('消息处理管理',response)
          this.tableLoading = false;
          this.allpage = response.data.total;
          this.tableData = response.data.records;
          for (var i = 0; i < this.tableData.length; i++) {
            let item = this.tableData[i];
            if (this.currentPage != 1) {
              item.idIndex = (this.currentPage - 1) * this.pageSize + (i + 1);
            } else {
              item.idIndex = i + 1;
            }
            for(let b=0;b<this.messageSendStatusList.length;b++){
                var data=this.messageSendStatusList[b]
                if(item.status==data.index){
                    item.showStatus=data.name;
                    this.$forceUpdate();
                }
            }
          }
          this.tableData.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = "空";
            }
            if (item.updateTime) {
              item.updateTime = timeFormat(item.updateTime);
            } else {
              item.updateTime = "空";
            }
            if(item.status=='Send' || item.status=='Abnormal'){
              item.actions={
                hasResend:true
              }
            }
          });
          this.$forceUpdate();
          console.log(this.tableData);
        } else {
          this.tableLoading = false;
        }
      });
      setTimeout(() => {
        this.tableLoading = false;
      }, 10000);
    },
    resendHandle(index,item){
      console.log(index,item);
      rabbitMQSend(item.id).then(res=>{
        if(res.code==='0'){
          var val,type;
          if(res.data.success){
            val='操作成功'
            type='success'
          }else{
            val='操作失败'
            type='error'
          }
          this.$message({
            message:val,
            type: type
          });
          this.rabbitMQSelectList();
        }
      })
    },
    //搜索接口
    searchclick() {
      this.rabbitMQSelectList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.rabbitMQSelectList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.rabbitMQSelectList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
</style>