<template>
  <div class="navbar">
    <i class="el-icon-s-grid" style="float: left;margin-left:20px;font-size:20px;margin-top: 20px;color: #409EFF;" @click="clickifshow"></i>

    <div class="right-menu mr15">
      <el-dropdown trigger="click" @command="departmentChange">
        <span>
          {{ currentDepartmentName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in departments" 
          :key="item.id" 
          :command="item">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click" style="margin-left:20px">
        <span>
          <i class="el-icon-s-custom"></i>
          {{ userRealName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>

        <el-dropdown-menu class="user" width="auto" slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="$keycloak.accountManagement">个人信息管理</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;" @click="$keycloak.logoutFn">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import bus from "../../bus/eventBus.js";
import { getUserinfo } from "@/api/module/udb.js";
export default {
  components: {},
  data() {
    return {
      username: "",
      isCollapse: false
    };
  },
  computed: {
    userRealName() {
      return this.$store.state.realName;
    },
    departments(){
      return this.$store.state.departments;
    },
    currentDepartmentName() {
      let department = this.$store.state.currentDepartment;
      return (department == null || Object.keys(department).length === 0) ? '所属部门': department.name;
    }
  },
  created() {
    this.username = this.$store.state.username;
    this.getUserInfo();
  },
  methods: {
    logout() {
      localStorage.clear();
      outkeycloak();
    },
    clickifshow() {
      this.isCollapse = !this.isCollapse;
      bus.$emit("ifisCollapse", this.isCollapse);
    },
    async getUserInfo() {
      let res = await getUserinfo(process.env.VUE_APP_REALM, this.$keycloak.userName);
      if (
        res.data == null ||
        res.data == undefined ||
        res.data == "" ||
        res.data.groupsList == null ||
        res.data.groupsList == undefined ||
        res.data.groupsList.length == 0
      ) {
        this.$store.dispatch("setCurrentDepartment", "所属部门");
      }
      console.log(res);
      this.$store.dispatch("setUserRealName", res.data.lastName + res.data.firstName);
      this.$store.dispatch("setUserName", res.data.username);
      this.$store.dispatch("setDepartments", res.data.groupsList);
      this.$store.dispatch("setCurrentDepartment", res.data.groupsList[0]);
    },
    departmentChange(department){
      if(department.name != this.currentDepartmentName){
        this.$store.dispatch("setCurrentDepartment", department);
      }
    },
  }
};
</script>

<style lang="scss" >
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  /*background-color: #1f2b35;*/
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  text-align: right;
  .breadcrumb-container {
    float: left;
    margin-left: 26px;
    line-height: 50px;
  }

  .right-menu {
    /*float: right;*/
    line-height: 70px;
    height: 100%;
    display: inline-block;
    .right-menu-item {
      cursor: pointer;
      float: left;
      margin-right: 26px;
      height: 100%;
      font-size: 12px;
      /*color: #fff;*/
      color: #605f5f;
    }
    span.el-dropdown-selfdefine:hover {
      cursor: pointer;
    }
  }
  .setting {
    line-height: 70px;
    margin: 0 20px;
    display: inline-block;
    i {
      margin: 0 10px;
      font-size: 18px;
    }
    i:hover {
      cursor: pointer;
    }
  }
}
.navbar .el-icon-s-custom {
  font-size: 18px;
}
.el-dropdown-menu {
  width: auto;
}
ul.el-dropdown-menu li.el-dropdown-menu__item {
  float: none;
}
</style>
