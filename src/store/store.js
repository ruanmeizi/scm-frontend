import Vue from 'vue';
import Vuex from "vuex";
import tagsView from "./modules/tagsView";
import company from "./modules/company";

Vue.use(Vuex);

const state = {
  //save in the localstorage
  token: null,
  refreshToken: null,
  realName: "",
  phone: "",
  id: "",
  leftSideMenu: [],
  permission: [],
  userRoles: [],
  orderIds: 0,
  userName: "",
  access_token:'',
  refresh_token:'',
  departments: [],
  currentDepartment: {},
  popoverList: [],
  popoverTabData: {},
  planToPRList: [],
  PREditShow: false,
  planToTOList: [],
  TOEditShow: false,
}

export default new Vuex.Store({
	state,
	modules: {
    tagsView,
    company
  },
  getters: {
    getUserName: state => {return state.userName;},
    getdepartmentId: state => {return state.currentDepartment.id;}
  },
  mutations: {
    setUserName(state, userName){
      state.userName = userName;
    },
    setUserRealName(state, realName){
      state.realName = realName;
    },
    setDepartments(state, departments){
      state.departments = departments;
    },
    setCurrentDepartment(state, currentDepartment){
      state.currentDepartment = currentDepartment;
    },
    getPopoverList(state, popoverList) {
      state.popoverList = popoverList;
    },
    getPopoverTabData(state, popoverTabData) {
      state.popoverTabData = popoverTabData;
    },
    getPlanToPRList(state, planToPRList) {
      state.planToPRList = planToPRList;
    },
    getPREditShow(state) {
      state.PREditShow = !state.PREditShow;
    },
    getPlanToTOList(state, planToTOList) {
      state.planToTOList = planToTOList;
    },
    getTOEditShow(state) {
      state.TOEditShow = !state.TOEditShow;
    }
  },
  actions: {
    setUserName({commit}, userName){
      commit("setUserName", userName);
    },
    setUserRealName({commit}, realName){
      commit("setUserRealName", realName);
    },
    setDepartments({commit}, departments){
      commit("setDepartments", departments);
    },
    setCurrentDepartment({commit}, current){
      commit("setCurrentDepartment", current);
    },
    getPopoverList({commit}, popoverList) {
      commit("getPopoverList", popoverList);
    },
    getPopoverTabData({commit}, popoverTabData) {
      commit("getPopoverTabData", popoverTabData);
    },
    getPlanToPRList({commit}, planToPRList) {
      commit("getPlanToPRList", planToPRList);
    },
    getPlanToTOList({commit}, planToTOList) {
      commit("getPlanToTOList", planToTOList);
    }
  }
});
