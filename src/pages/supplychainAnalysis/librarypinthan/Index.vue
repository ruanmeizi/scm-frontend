<template>
  <div class="container librarypinthan">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">起止时间：</span>
          <el-date-picker
            v-model="value1"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="开始日期"
            :picker-options="pickerOptions0"
            @focus="changeDate"
          ></el-date-picker>—
          <el-date-picker
            v-model="value2"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="结束日期"
            :picker-options="pickerOptions1"
            @focus="changeDate"
          ></el-date-picker>
        </div>
      </div>
      <div class="actions_btn_wrap down t_right">
        <el-button
          class="mr10"
          size="small"
          type="primary"
          icon="el-icon-search"
          circle
          title="搜索"
          @click="searchclick"
        ></el-button>
      </div>
    </div>

    <div class="container_table clearfix" style="margin-top:20px;">
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="零剪业务" name="first">
          <iframe
            width="600"
            height="400"
            seamless
            frameborder="0"
            scrolling="no"
            :src="ljzaikukuxiaobi"
          ></iframe>
          <iframe width="600" height="400" seamless frameborder="0" scrolling="no" :src="ljzongBhl"></iframe>
          <iframe width="600" height="400" seamless frameborder="0" scrolling="no" :src="ljTongbi"></iframe>
        </el-tab-pane>
        <el-tab-pane label="职业装业务" name="second">
          <iframe
            width="600"
            height="400"
            seamless
            frameborder="0"
            scrolling="no"
            :src="zyzzaikukuxiaobi"
          ></iframe>
          <iframe
            width="600"
            height="400"
            seamless
            frameborder="0"
            scrolling="no"
            :src="zyzKuxiaobiBhl"
          ></iframe>
          <iframe
            width="600"
            height="400"
            seamless
            frameborder="0"
            scrolling="no"
            :src="zyzTongbi"
          ></iframe>
        </el-tab-pane>
        <el-tab-pane label="库龄分析" name="third">库龄分析</el-tab-pane>
        <el-tab-pane label="备货总量库销比" name="fourth">
          <iframe width="600" height="400" seamless frameborder="0" scrolling="no" :src="zongBhl"></iframe>
          <iframe
            width="600"
            height="400"
            seamless
            frameborder="0"
            scrolling="no"
            :src="zongkuxiaobibhl"
          ></iframe>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {getLjZaiKuxiaobi, getLjZaiKuxiaobiBhl,
      getLjZongKuxiaobi, getLjZongKuxiaobiBhl,
      getZyzZaiKuxiaobi, getZyzZaiKuxiaobiBhl,
      getZyzZongKuxiaobi, getZyzZongKuxiaobiBhl,
      getZongKuxiaobi, getZongKuxiaobiBhl,
      getLjzongBhl,getZyzKuxiaobiBhl,
      getzongBhl,getLjTongbi,getZyzTongbi} from "@/api/module/supplyanalysis.js";
export default {
  name: "librarypinthan",
  data() {
    return {
      value1: "",
      value2: "",
			activeName: "first",
			ljzaikukuxiaobi: "",
      ljzaikukuxiaobibhl:"",
      ljzongkuxiaobi:"",
      ljzongkuxiaobibhl:"",

      zyzzaikukuxiaobi:"",
      zyzzaikukuxiaobibhl:"",
      zyzzongkuxiaobi:"",
      zyzzongkuxiaobibhl:"",
      zongkuxiaobi:"",
      zongkuxiaobibhl:"",
      ljzongBhl:'',
      zyzKuxiaobiBhl:'',
      zongBhl:'',
      pickerOptions0:'',
      ljTongbi:'',
      zyzTongbi:'',
    };
  },
  components: {},
  created() {
    this.getSrcLink();
  },
  mounted() {
  },
  watch: {},
  methods: {
    //搜索
		searchclick() {
			this.getSrcLink();
		},
    async getSrcLink(){
 			let res = await getLjZaiKuxiaobi(this.value1, this.value2,400);
      this.ljzaikukuxiaobi = res.data;
      res = await getLjzongBhl(this.value1, this.value2, "");
      this.ljzongBhl = res.data;
      res = await getLjTongbi(this.value1, this.value2, "");
      this.ljTongbi = res.data;
      
      
      res = await getZyzZaiKuxiaobi(this.value1, this.value2);
			this.zyzzaikukuxiaobi = res.data;
      res = await getZyzKuxiaobiBhl(this.value1, this.value2);
      this.zyzKuxiaobiBhl = res.data; 
      res = await getZyzTongbi(this.value1, this.value2);
      this.zyzTongbi = res.data; 
      
      
			res = await getZongKuxiaobiBhl(this.value1, this.value2);
      this.zongkuxiaobibhl = res.data;
      res = await getzongBhl(this.value1, this.value2);
      this.zongBhl = res.data;
       
    },
    changeDate() {
      let date1 = new Date(this.value1).getTime()
      let date2 = new Date(this.value2).getTime()
      this.pickerOptions0 = {
        disabledDate: (time) => {
          if (this.value2 != "") {
            return time.getTime() > Date.now() || time.getTime() > date2;
          } else {
            return time.getTime() > Date.now();
          }
        }
      }
      this.pickerOptions1={
        disabledDate: (time) => {
          return time.getTime() < date1 || time.getTime() > Date.now();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.librarypinthan {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.librarypinthan {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
</style>
<style>
div#pane-first {
  max-height: none;
}
div#pane-second {
  max-height: none;
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
/* .subnav_wrap .el-tabs__header {
  width: 90%;
} */
.subnav_wrap .el-tabs__content {
  overflow: visible;
  text-align: center;
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
.popover_table.el-table .el-table__header th,
.popover_table.el-table .el-table__header tr {
  height: 40px;
  background-color: #f5f7fa;
}
.el-date-editor.el-range-editor.el-input__inner.mr10.mb10.el-date-editor--daterange {
  width: 320px;
}
</style>