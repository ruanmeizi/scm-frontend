/***
 * 下载excel权限设置
 ***/
// import http from "./http";
import vue from 'vue';
import { Message, Notification } from "ElementUI";
// Axios拦截请求并实现下载
import axios from 'axios'

// axios.defaults.timeout =  60000;

const http = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	timeout:5000*60
  });

// 添加请求拦截器
http.interceptors.request.use(
	config => {	
	   config.headers.Authorization = `Bearer ${Vue.prototype.$keycloak.token}`;
	   return config;
	},
	error => {
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	response => {
	  return response.data;
	},
	error => {
	  console.log(error)
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
			break;
		}
	  }
	  return Promise.reject(error);
	}
  );

function ssopermission(urlpath,title){
	var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.open('get',urlpath); 
    xhr.setRequestHeader("Authorization",'bearer '+localStorage.getItem("access_token")); 
    xhr.responseType = 'blob';		
	xhr.onload = function (e) {
        let blob = new Blob([xhr.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
		let downloadElement = document.createElement('a');
		let href = window.URL.createObjectURL(blob); //创建下载的链接
		downloadElement.href = href;
		downloadElement.download = title+'.xlsx'; //下载后文件名
		document.body.appendChild(downloadElement);
		downloadElement.click(); //点击下载
		document.body.removeChild(downloadElement); //下载完成移除元素
		window.URL.revokeObjectURL(href); //释放掉blob对象                     
    };
    xhr.send(formData);
}

function postpermission(urlpath,title,excdata){
	var xhr = new XMLHttpRequest();
	console.log(excdata)
	var formData = new FormData();
	console.log(xhr)
	// sessionStorage.setItem("loading",true);
	xhr.open('post',urlpath); 
	console.log(xhr.setRequestHeader)
	xhr.setRequestHeader("Content-Type","application/json"); 
	xhr.setRequestHeader("Authorization",'bearer '+`${Vue.prototype.$keycloak.token}`);   
    xhr.responseType = 'blob';		
	xhr.onload = function (e) {
		console.log(e);
		console.log(xhr.response)
        let blob = new Blob([xhr.response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
		let downloadElement = document.createElement('a');
		let href = window.URL.createObjectURL(blob); //创建下载的链接
		downloadElement.href = href;
		downloadElement.download = title+'.xlsx'; //下载后文件名
		document.body.appendChild(downloadElement);
		downloadElement.click(); //点击下载
		document.body.removeChild(downloadElement); //下载完成移除元素
		window.URL.revokeObjectURL(href); //释放掉blob对象   
		console.log(downloadElement.download)
		if(xhr.response!=''){
			window.setTimeout(function () {
				sessionStorage.setItem("loading",downloadElement.download);
			}, 1000);
		}                  
	};
	xhr.send(excdata);
}


//采购价单导出
export const exportFile = (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCM_URL + `purchaseDownload/v1/PurchasePriceListExcel`,
	  data
	});
};
//产品织标关系导出
export const exportFileWoven = (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_PRODUCT_URL + `productlabel/v1/productlabel/exportExcel`,
	  data
	});
};

//物料主数据导出
export const exportFileMaterials = (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCMREPORT_URL + `reportservice/v1/downloadMaterial`,
	  data
	});
};

//成品物料主数据导出
export const exportFileFinishedMaterials = (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCMREPORT_URL + `reportservice/v1/downloadMaterialFinishedProduct`,
	  data
	});
};

//组合物料主数据导出
export const exportFileCompositeMaterials = (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCMREPORT_URL + `reportservice/v1/downloadCombinedMaterial`,
	  data
	});
};

//面料产品主数据导出
export const exportProductFile= (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCMREPORT_URL + `reportservice/v1/downloadProduct`,
	  data
	});
};

//成品产品主数据导出
export const exportFinishedProductFile= (data) => {
	return http({
	  method: "post",
	  headers: {
	     'Content-Type':'application/json',
	  },
	  responseType: 'blob',
	  url: process.env.VUE_APP_SCMREPORT_URL + `reportservice/v1/downloadFinishedProduct`,                                 
	  data
	});
};

export {
	ssopermission,
	postpermission
}