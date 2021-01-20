<template>
  <el-dialog
    title="提示"
    v-dialogDrag
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :before-close="cancelHandle"
    width="30%">
    <span>{{dialogDesc}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click.stop="cancelHandle">取 消</el-button>
      <el-button type="primary" v-preventReClick @click.stop="confirmHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['dialogDesc', 'dialogVisible'],
  data() {
    return {

    };
  },
  mounted() {
    
  },
  watch: {
    
  },
  methods: {
    confirmHandle() {
      this.$emit('dialogConfirmHandle');
    },
    cancelHandle() {
      this.$emit('dialogCancelHandle');
    }
  }
};
</script>

<style lang="scss">
  
</style>