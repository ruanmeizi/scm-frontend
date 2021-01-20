<template>
	<div class="factoryGoods nav_tab_wrap">
		<div class="materials">
			<el-tabs class="nav_wrap" type="border-card" v-model="activeName" @tab-click="handleClick">
		      <el-tab-pane label="工厂快货" name="getpopularGoods">
		        <popularGoods v-if="isGoods"></popularGoods>
		      </el-tab-pane>
		    </el-tabs>
		</div>
	</div>
</template>

<script>
import popularGoods from "./popularGoods/Index";
export default {
  name: "factoryGoods",
  data() {
    return {
      activeName: 'getpopularGoods',
      isGoods: true
    };
  },
  components: {
    popularGoods
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    handleClick(tab) {
      switch (tab.name) {
        case 'getpopularGoods':
          this.isGoods = true;
          break;
        default:
          break;
      }
    }
  }
};
</script>