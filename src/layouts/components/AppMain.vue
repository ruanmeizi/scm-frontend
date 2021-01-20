<template>
  <!--<section
    class="app-main"
    v-loading="!visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >-->
  <section class="app-main">
    <router-view></router-view>
    <homePage v-if="this.$route.path=='/homePage'"></homePage>
  </section>
</template>


<script>
import Bus from "@/utils/bus";
import homePage from "@/pages/home/homePage.vue";

//import materialboard from "@/pages/materialboard/Index" //备货总量看板


//import { getCurrentEmergency } from "@/api/module/emergency";
export default {
  name: "AppMain",
  data() {
    return {
      visible: false,
      timer: null,
      typeid:''
    };
  },
  components:{
    homePage
  },
  computed: {
    companyId() {
      return this.$store.state.company.id;
    }
  },
  updated() {
     //动态获取sideBar高度
    var heights = document.documentElement.clientHeight-90;//90即tab和头部高度
    var obj = document.getElementById("container");
    if(obj!=null){
      obj.style.height=heights+'px';    
    }
  },
  mounted() {
     this.$router.push({path:'/homePage'})
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.app-main {
  // height: calc(100vh - 100px);
  /*height: 100vh;*/
  /*margin: 12px 12px 0px 12px;*/
  padding: 10px 10px;
  position: relative;
  /*overflow-y: scroll;*/
  box-sizing: border-box;
  border-radius: 6px;
  min-width: 1060px;
  /*background: #fff;*/
}
</style>
