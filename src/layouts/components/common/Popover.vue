<template>
  <el-popover
    v-if="data"
    class="popover_wrap"
    :ref="data[popovers.parentField]"
    :placement="popovers.placement"
    :width="popovers.width"
    :trigger="popovers.trigger">
    <!-- 表格 -->
    <template v-if="popovers.popType == 'table' || popovers.popType == 'table_tail'">
      <el-table class="popover_table" :data="popoverList">
        <el-table-column
          v-for="(item, index) in popovers.fields"
          :key="index"
          :width="item.width"
          :prop="item.field"
          :label="item.name">
        </el-table-column>
      </el-table>
      <div class="mt10" v-if="popovers.popType == 'table_tail'">{{data[popovers.tail]}}</div>
      <el-button slot="reference" :title="data[popovers.parentField]" @click="popoverHandle(curIndex, data, popovers.parentName, popovers.parentField)">{{data[popovers.parentField]}}</el-button>
    </template>
    <template v-if="popovers.popType == 'table_json'">
      <el-table class="popover_table" :data="popoverList">
        <el-table-column
          v-for="(item, index) in popovers.fields"
          :key="index"
          :width="item.width"
          :prop="item.field"
          :label="item.name">
          <template slot-scope="scope">
            <json-viewer :value="scope.row.saleOrder"></json-viewer>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" :title="data[popovers.parentField]" @click="popoverHandle(curIndex, data, popovers.parentName, popovers.parentField)">{{data[popovers.parentField]}}</el-button>
    </template>

    <!-- 双重表格 -->
    <template v-if="popovers.popType == 'table_double'">
      <el-table
        :data="popoverList"
        style="width: 100%">
        <el-table-column
          v-for="(item, index) in popovers.fields"
          :key="index"
          :label="item.name">
          <el-table-column
            v-for="(cItem, cIndex) in item.children"
            :key="cIndex"
            :width="cItem.width"
            :prop="cItem.field"
            :label="cItem.name">
          </el-table-column>
        </el-table-column>
      </el-table>
      <el-button slot="reference" :title="data[popovers.parentField]" @click="popoverHandle(curIndex, data, popovers.parentName, popovers.parentField)">{{data[popovers.parentField]}}</el-button>
    </template>

    <!-- 标签页表格 -->
    <template v-if="popovers.popType == 'table_tab_tail'">
      <el-tabs v-model="activeName" @tab-click="switchTabHandle">
        <el-tab-pane v-for="(item, index) in popovers.tabs" :key="index" :label="item.name" :name="item.value">
          <el-table class="popover_table" :data="popoverTabData[item.listName]">
            <el-table-column
              v-for="(fItem, fIndex) in item.fields"
              :key="fIndex"
              :width="fItem.width"
              :prop="fItem.field"
              :label="fItem.name">
            </el-table-column>
          </el-table>
          <div v-if="popovers.popType == 'table_tab_tail'" class="mt10">
            <span v-if="item.total">总计：{{popoverTabData[item.total]==undefined?0:popoverTabData[item.total]}}</span>
            <span v-else>{{data[popovers.tail]}}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <div v-if="popovers.popType == 'table_tab_tail'" class="mt10">{{data[popovers.tail]}}</div> -->
      <el-button slot="reference" :title="data[popovers.parentField]" @click="popoverHandle(curIndex, data, popovers.parentName, popovers.parentField)">{{data[popovers.parentField]}}</el-button>
    </template>
  </el-popover>
</template>

<script>
export default {
  name: 'Popover',
  props: ['popSet', 'popData', 'curIndex'],
  data() {
    return {
      popovers: {},
      list: [],
      data: null,
      popoverList: [],
      popoverTabData: {},
      activeName: 'first'
    };
  },
  mounted() {
    this.popovers = this.popSet;
    this.list.push(this.popData);
    this.data = this.popData;
    this.popoverList = this.$store.state.popoverList;
    this.popoverTabData = this.$store.state.popoverTabData;
  },
  watch: {
    '$store.state.popoverList'(list) {
      this.popoverList = list;
      this.$forceUpdate();
    },
    '$store.state.popoverTabData'(data) {
      this.popoverTabData = data;
      this.$forceUpdate();
    },
    popSet(data) {
      this.popovers = data;
      this.$forceUpdate();
    },
    popData(data) {
      this.data = data;
      this.$forceUpdate();
    },
    curIndex(data) {
      this.curIndex = data;
      this.$forceUpdate();
    },
  },
  methods: {
    switchTabHandle(val) {
      console.log(val);
      switch (val.name) {
        case 'first':
          
          break;
        case 'second':

          break;
        default:

          break;
      }
    },
    popoverHandle(index, item, name, field) {
      console.log(index, item, name, field);
      this.$emit('popoverHandle', index, item, name, field);
    }
  }
};
</script>

<style lang="scss">
  .popover_wrap {
    .el-button--default {
      background: none;
      border: none;
      border-radius: 0;
      padding: 5px;
      border-bottom: 1px solid #409EFF;
      max-width:250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-popover__reference{
      max-width:250px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .popover_table{
    max-height: 400px;
    overflow: auto;
  }
  .popover_table {
    &.el-table {
      .el-table__header {
        th, tr {
          height: 40px;
          background-color: #f5f7fa;
        }
      }
    }
    .jv-node{
      text-align: left;
    }
  }
  .el-table__body-wrapper.is-scrolling-none{
    z-index:1;
  }
</style>