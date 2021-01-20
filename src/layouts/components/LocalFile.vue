<template>
  <div class="version">{{ jsonData }}</div>
</template>

<script>
import versionJson from '../../../version';
export default {
  name: 'LocalFile',
  data() {
    return {
      jsonData: ''
    };
  },
  created() {
    this.jsonData = versionJson.text;
  },
  methods: {}
};
</script>

<style lang="scss">
  .version {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background-color: #004980;
    padding: 10px 15px;
    line-height: 20px;
    text-align: center;
    font-size: 13px;
    // color: #999999;
    box-sizing: border-box;
    span {
      width: 100%;
    }
  }
</style>