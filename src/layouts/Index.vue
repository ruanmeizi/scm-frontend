<template>
  <div class="app-wrapper">
    <!-- <router-view></router-view> -->
    <side-bar></side-bar>

    <div class="main-container" :class="{collapse:this.isCollapse==true}">
      <nav-bar />
      <!--<tags-view/>-->
      <app-main />
    </div>
  </div>
</template>
<script>

import AppMain from "./components/AppMain.vue";
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import TagsView from "./components/TagsView/Index.vue";
import ContentMain from "./components/ContentMain.vue";
import "../components/keycloak.js";
import bus from '../bus/eventBus.js';
export default {
  name: "layout",
  components: {
    NavBar,
    SideBar,
    AppMain,
    TagsView,
    ContentMain
  },
  data() {
    return {
      isCollapse:false
    };
  },
  created() {
    // obj.style.height=heights+'px';    
    //	  this.ssologin();
  },
  mounted() {
        bus.$on('ifisCollapse',(msg) => {
		      this.isCollapse = msg
		      console.log(this.isCollapse)
        });
        // console.log('设备型号：', navigator.userAgent);
	},
  methods: {
    ssologin() {
      keycloakssologin();
      //			 let access_token=localStorage.getItem("access_token")
      //			 console.log(access_token)
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width:1360px) and (max-width:1920px){
  background:red;
}
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow-x:scroll;
  font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "MicrosoftYaHei", "WenQuanYi Micro Hei", sans-serif;
}
.main-container {
  min-height: 100%;
  /*max-width: 1820px;*/
  max-width: 100%;
  /*min-width: 1560px;*/
  background: #ebeff2;
  padding-left: 220px;
}
.main-container.collapse{
	 /*width: 94%;*/
	 padding-left:110px;
}
</style>
