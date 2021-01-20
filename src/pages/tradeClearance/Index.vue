<template>
  <div class="tradeClearance">
    <el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="进口关税" name="importTariffs">
        <importTariffs v-if="isIT"></importTariffs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import importTariffs from "./importTariffs/Index";
export default {
  name: "tradeClearance",
  data() {
    return {
      activeName: 'importTariffs',
      isIT: true
    };
  },
  components: {
    importTariffs
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'importTariffs':
          this.isIT = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/index.scss";
.tradeClearance {
  width: 100%;
}
.nav_part {
  height: 30px;
  background: #FFFFFF;
  padding: 20px 15px;
  line-height: 30px;
  border-radius: 6px;
  .nav {
    float: left;
    line-height: 30px;
    font-size: 18px;
    font-weight: 700;
    color: #605F5F;
    cursor: pointer;
    &:first-child {
      span {
        border-left: none;
      }
    }
    &.active {
      color: #409EFF;
    }
    span {
      display: inline-block;
      padding: 0 20px;
      line-height: 15px;
      border-left: 2px solid #CECECE;
      vertical-align: middle;
    }
  }
}
</style>
<style>
.tradeClearance .nav_wrap.el-tabs--border-card {
  background: #ebeff2;
  border: none;
  box-shadow: none;
}
.tradeClearance .nav_wrap.el-tabs--border-card>.el-tabs__header {
  height: 30px;
  background-color: #FFFFFF;
  margin-bottom: 10px;
  padding: 20px 15px;
  line-height: 30px;
  border-radius: 6px;
  border: none;
  overflow: hidden;
}
.tradeClearance .nav_wrap.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  border: none;
  border-right: 1px solid #DCDFE6;
}
.tradeClearance .nav_wrap.el-tabs--border-card>.el-tabs__header .el-tabs__item:last-child {
  border-right: none;
}
.tradeClearance .nav_wrap.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  background-color: transparent;
}
.tradeClearance .nav_wrap .el-tabs__item {
  height: 15px;
  line-height: 15px;
  font-size: 18px;
  vertical-align: middle;
  font-weight: 600;
  outline: none;
}
</style>
