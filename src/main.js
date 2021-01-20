import vue from 'vue';
import ElementUI from 'ElementUI';
import axios from 'axios';
import JsonViewer from 'vue-json-viewer';
import "babel-polyfill";
// import { mapKeys } from 'lodash';
import mapKeys from 'lodash/mapKeys';
import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'
import "normalize.css/normalize.css";
import Pagination from "@/components/Pagination";

import "./styles/index.scss";
import "./styles/public.scss";
import "./styles/table.scss";
import "./styles/font.scss";
import "./styles/detail.scss";
import "./styles/dialog.scss";

import store from "./store/store";
import App from "../App.vue";
import router from "./router/index.js";

import './assets/js/directives.js';

import { DataTablesServer } from "vue-data-tables";
//提前加载菜单
import { getMenus } from "@/api/module/menu.js";
import Bus from "@/bus/eventBus.js";

import preventReClick from './utils/preventReClick.js';  // 防多次点击，重复提交

// import文件判断
async function importHandle() {
  const vmbStyle = process.env.VUE_APP_TYPE == 'vmb' ? await import('./styles/public_vmb.scss') : '';
}
importHandle();

async function getAllMenus(keycloak) {
  let data = {system: "scm", roles: keycloak.resourceAccess.scm.roles};
  let res = await getMenus(data.system, data.roles);
  Vue.prototype.$keycloak.menus = res.data;
  Bus.$emit("menusReady");
};

vue.use(ElementUI);
Vue.use(JsonViewer)
vue.use(DataTablesServer);
vue.component('Pagination',Pagination)
vue.config.productionTip = false;

vue.use(VueKeycloakJs, {
  init: {
    onLoad: "login-required",
    checkLoginIframe: false
  },
  config: {
    url: process.env.VUE_APP_SSO_URL,
    realm: process.env.VUE_APP_REALM,
    clientId: process.env.VUE_APP_CLIENTID
  },
  onReady: keycloak => {
    getAllMenus(keycloak);
    new vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});