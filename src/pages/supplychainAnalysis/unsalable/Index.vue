<template>
  <div class="container librarypinthan">
    <div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">起止时间：</span>
          <el-date-picker v-model="value1" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="开始日期" :picker-options="pickerOptions0"
          @focus="changeDate"> </el-date-picker>
        —
        <el-date-picker v-model="value2" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="结束日期" :picker-options="pickerOptions1"
          @focus="changeDate"> </el-date-picker>
        </div>
      </div>

      <!-- <el-date-picker v-model="value1" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="开始日期" :picker-options="pickerOptions0"
        @focus="changeDate"> </el-date-picker>
      —
      <el-date-picker v-model="value2" type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="结束日期" :picker-options="pickerOptions1"
        @focus="changeDate"> </el-date-picker> -->

      <div class="actions_btn_wrap down t_right">
        <el-button class="mr10" size="small" type="primary" icon="el-icon-search" circle title="搜索" @click="searchclick"></el-button>
      </div>
    </div>

    <div class="container_table clearfix" style="margin-top:20px;">
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="" name="first">
           <iframe
            width="600"
            height="400"
            seamless
            frameBorder="0"
            scrolling="no"
						:src = "zhixiaokucun"
          >
          </iframe> 
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {getZhixiaokucun} from "@/api/module/supplyanalysis.js";
export default {
  name: "librarypinthan",
  data() {
    return {
      value1: "",
      value2: "",
			activeName: "first",
      zhixiaokucun:'',
      pickerOptions0:''
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
		async searchclick() {
			this.getSrcLink();
		},
    async getSrcLink(){
      let res = await getZhixiaokucun(this.value1, this.value2);
      this.zhixiaokucun = res.data;
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