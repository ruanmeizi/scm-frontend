import vue from 'vue';
import { Message, Notification } from "ElementUI";
import {getNowTimetp} from '@/utils/index.js';
const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL
});

// 添加请求拦截器
http.interceptors.request.use(
  config => {
     config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
     return config;
  },
  error => {
    
  }
);

http.interceptors.response.use(
  response => {
    switch (response.data.code) {
      case "0":
        break;
      case "-5":
        break;
      case "1":
        break;
      default:
        Message.error({ title: "请求错误", message: response.data.message });
        break;
    }
    return response.data;
  },
  error => {
    console.log(error);
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          Notification({
            title: '提示',
            message: '登录已失效，请刷新后重试',
            type: 'error',
            duration: 0
          });
          break;
        default:
      //  case 400:
      //       showErrorMessage('请求出错');
      //       break;
      //   case 403:
      //       showErrorMessage('拒绝访问');
      //       break;
      //   case 404:
      //       showErrorMessage('资源不存在');
      //       break;
      //   case 405:
      //       showErrorMessage('请求方法未允许');
      //       break;
      //   case 500:
      //       showErrorMessage('服务器内部出错');
      //       break;
      //   case 503:
      //       showErrorMessage('访问服务器失败');
      //       break;
      //   default:
      //     showErrorMessage(message);
      }
    }
    return Promise.reject(error);
  }
);
export default http;
