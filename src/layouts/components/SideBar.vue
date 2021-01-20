<template>
  <div class="sidebar-container">
    <div class="wrap" id="wrap">
      <div class="logo-container">
        <a href="#/">
          <h3
            v-if="this.isCollapse == false"
            style="display: inline;margin-left: 10px;margin-top: 20px;"
          >
            <img :src="logoSrc" :alt="altText" />
          </h3>
          <h3
            v-if="this.isCollapse == true"
            style="display: inline;margin-left: 10px;margin-top: 20px;margin-right: 20px;"
          >
            <img src="../../assets/image/logosimple.png" />
          </h3>
        </a>
      </div>

      <el-menu
        default-active="0"
        class="elmenuclass"
        @open="handleOpen"
        @close="handleClose"
        background-color="#004980"
        text-color="#fff"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/homePage">
          <i>
            <img style="width:25px;margin-right:3px;" src="@/assets/image/homepage.png" />
          </i>
          <span v-if="this.isCollapse == false" slot="title">首页</span>
        </el-menu-item>
      </el-menu>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#004980"
        text-color="#fff"
        :collapse="isCollapse"
        active-text-color="#409eff"
        :unique-opened="uniqueOpened"
        style="height: 100%;"
        router
      >
        <el-submenu :index="index + ''" v-for="(menu, index) in menus" :key="index">
          <template slot="title">
            <i>
              <img style="width:24px;margin-right: 5px;" :src="getIcon(menu.icon)" />
            </i>
            <span>{{ menu.name }}</span>
          </template>
          <el-menu-item-group v-for="(subMenu, index2) in menu.subMenus" :key="index2">
            <el-menu-item :index="subMenu.path">
              <span>{{ subMenu.name }}</span>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>

      <LocalFile></LocalFile>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus/eventBus.js";
/* 需要提前加载图标，否则不显示，一定要以@来表示路径 */
import planmanager from "@/assets/image/planmanager.png";
import databoard from "@/assets/image/databoard.png";
import random from "@/assets/image/random.png";
import design from "@/assets/image/design.png";
import waring from "@/assets/image/waring.png";
import set from "@/assets/image/set.png";
import searchSetting from "@/assets/image/searchSetting.png";
import logoVitality from "@/assets/image/logo.png";
import logoVmb from "@/assets/image/logo_vmb.png";
import operations from "@/assets/image/operations.png";
import LocalFile from "../components/LocalFile.vue";  // 读取本地文件

export default {
  name: "SideBar",
  components: {
    LocalFile
  },
  data() {
    return {
      current: 0,
      currentactive: 0,
      currentindex: 0,
      openeds: ["1"],
      uniqueOpened: true,
      isCollapse: false,
      ifcos: true,
      slidelist: "",
      menudata: "",
      vueAppType: '',  // 环境变量类型
    };
  },
  computed: {
    menus() {
      return this.menudata == "" ? this.$keycloak.menus : this.menudata;
    },
    logoSrc() {
      switch (this.vueAppType) {
        case 'vitality':
          // 意厉维
          return logoVitality;
          break;
        case 'vmb':
          // 维泰
          return logoVmb;
          break;
        default:
          return logoVitality;
          break;
      }
    },
    altText() {
      switch (this.vueAppType) {
        case 'vitality':
          // 意厉维
          return '意厉维';
          break;
        case 'vmb':
          // 维泰
          return '维泰';
          break;
        default:
          return '意厉维';
          break;
      }
    }
  },
  created() {
    // 维泰判断显示
    this.vueAppType = process.env.VUE_APP_TYPE;
  },
  mounted() {
    Bus.$off("menusReady");
    Bus.$on("menusReady", () => {
      this.menudata = this.$keycloak.menus;
    });
    console.log(this.menudata);
    Bus.$on("ifisCollapse", msg => {
      this.isCollapse = msg;
    });
    //动态获取sideBar高度
    var heights = document.documentElement.clientHeight+80;
    var obj = document.getElementById("wrap");
    obj.style.maxHeight=heights+'px';    
  },
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    getIcon: function(iconName) {
      if (iconName == "planmanager") return planmanager;
      if (iconName == "databoard") return databoard;
      if (iconName == "random") return random;
      if (iconName == "design") return design;
      if (iconName == "waring") return waring;
      if (iconName == "set") return set;
      if (iconName == "search") return searchSetting;
      if (iconName == "operations") return operations;
    }
  }
};
</script>
<style lang="scss">
.el-submenu__title.home:hover {
  background-color: rgb(0, 58, 102) !important;
}
i.el-icon-s-home {
  color: #ffffff;
}
.slideactive {
  .el-submenu__title {
    i.el-submenu__icon-arrow.el-icon-arrow-down {
      display: none;
    }
  }
}
.el-submenu__title i {
  font-size: 18px;
}
.sidebar-container {
  max-width: 220px;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background: #004980;
  overflow: hidden;
  z-index: 99;
  .logo-container {
    height: 70px;
    a {
      display: inline-block;
      width: 100%;
      color: #fff;
      margin-top: 20px;
    }
    .logo {
      font-size: 28px;
      vertical-align: middle;
      margin-right: 10px;
    }
    .logo-text {
      font-size: 16px;
      display: inline-block;
      height: 70px;
      line-height: 70px;
    }
  }
  .el-scrollbar {
    height: calc(100% - 70px);
  }
  .scrollbar-wrapper {
    height: 100%;
  }
  .el-menu {
    height: 100%;
    border: none;
    .iconfont {
      margin-right: 10px;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 45px;
      line-height: 45px;
      border-left: 5px solid transparent;
    }
    .el-submenu.is-active.is-opened {
      .el-submenu__title {
        border-left: 5px solid #409eff !important;
      }
    }
    .el-menu-item.is-active {
      border-left: 5px solid #409eff !important;
    }
  }
}

li.el-menu-item.select {
  border-left: 5px solid #409eff !important;
}

.sidebar-container .el-menu .el-submenu.is-active.is-opened .el-submenu__title {
  border-left: none !important;
}

ul.el-menu-vertical-demo.el-menu li.el-submenu.is-opened.slideactive {
  color: rgb(64, 158, 255);
  border-left: 5px solid #409eff !important;
}

ul.el-menu-vertical-demo.el-menu {
  /*margin-top: 20px;*/
}

.el-menu-item-group__title {
  padding: 0;
}

.el-submenu__title i {
  color: #fff;
}
ul.elmenuclass.el-menu {
  height: 45px;
}
.sidebar-container ::-webkit-scrollbar {
  width: 10px;
  /*对垂直流动条有效*/
  height: 10px;
  background: #004980;
  /*对水平流动条有效*/
}
/*定义滚动条的轨道颜色、内阴影及圆角*/
.sidebar-container ::-webkit-scrollbar-track {
  //  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
   background-color:#004980;
   border-radius: 3px;
}

/*定义滑块颜色、内阴影及圆角*/
.sidebar-container ::-webkit-scrollbar-thumb {
   border-radius: 7px;
   background-color:#004980;
}

/*定义右下角汇合处的样式*/
.sidebar-container ::-webkit-scrollbar-corner {
      background-color: #004980;
  }
</style>