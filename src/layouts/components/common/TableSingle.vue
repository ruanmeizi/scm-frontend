<template>
  <div class="singleTableList">
    <ul class="childlist">
      <li :class="item.class" v-for="(item, index) in fieldsList" :key="index">{{item.name}}</li>
    </ul>
    <div class="allparentlist">
      <ul
        class="childcontentlist"
        v-for="(item, index) in list"
        :key="index">
        <li :class="sItem.class" :title="item[sItem.field]" v-for="(sItem, i) in data.data" :key="i">
          <span v-if="sItem.isIndex">{{index + 1}}</span>
          <div v-else-if="sItem.isAction">
            <i v-if="item.actions.hasEdit" type="primary" class="el-icon-edit" title="编辑" @click="editHandle(item)"></i>
            <i v-if="item.actions.hasDelete" type="primary" class="el-icon-delete" title="删除" @click="deleteHandle(item)"></i>
          </div>
          <span v-else>{{item[sItem.field]}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['tableList', 'singleData', 'tableFieldsList'],
  data () {
    return {
      list: [],
      fieldsList: [],
      data: {},
    }
  },
  created() {
    
  },
  mounted() {
    this.fieldsList = this.tableFieldsList;
    this.list = this.tableList;
    this.data = this.singleData;
    console.log('数据列表： ', this.list);
  },
  computed: {

  },
  watch: {
    tableList(list) {
      this.list = list;
    },
    tableFieldsList(list) {
      this.fieldsList = list;
    },
    singleData(data) {
      this.data = data;
    }
  },
  methods: {
    editHandle(index, item) {
      this.$emit('editHandle', index, item);
    },
    submitHandle(index, item) {
      this.$emit('submitHandle', index, item);
    },
    removeHandle(index, item) {
      this.$emit('removeHandle', index, item);
    },
    deleteHandle(index, item) {
      this.$emit('deleteHandle', index, item);
    },
    removeItemHandle(index, item) {
      this.$emit('removeItemHandle', index, item);
    }

  }
}
</script>

<style lang="scss">
.singleTableList {
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
  .btn_popover {
    border: 0;
    border-bottom: 1px solid #409eff;
    color: #606266;
    cursor: pointer;
  }
}
</style>
