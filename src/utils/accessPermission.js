import VueKeycloakJs from '@dsb-norge/vue-keycloak-js'
import Vue from 'vue';
import axios from "axios";
/***
 * 下载excel权限设置
 ***/
function ssopermission(urlpath,title){
	var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.open('get',urlpath); 
    xhr.setRequestHeader("Authorization",'bearer '+`${Vue.prototype.$keycloak.token}`); 
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

export {
	ssopermission
}