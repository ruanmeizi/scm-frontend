import http from "../http";
import axios from "axios";


/**
 * 翻页查询客户管理关系信息查询
 */
export const customerorder = (currentPage,pageSize,data) => {
	return http({
		method: "post",
		url:process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/search?currentPage=${currentPage}&pageSize=${pageSize}`,
		data
	});
};

/**
 * 新增客户管理关系信息
 */
export const customeradd = (data) => {
	return http({
	    method: "post",
	    url:process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls`,
	    data
	});
};

/**
 * 修改客户管理关系信息
 */
export const customerupd = (id,data) => {
	return http({
	    method: "put",
	    url:process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/${id}`,
	    data
	});
};

/**
 * 删除客户管理关系信息
 */
export const customerdel = (id) => {
	return http({
	    method: "delete",
	    url: process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/${id}`,
	});
};


/**
 * 新客户查询
 */
export const clientlist = (currentPage,pageSize) => {
	return http({
	    method: "get",
	    url: process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/selectcustomerorder?currentPage=${currentPage}&pageSize=${pageSize}`,
	});
};

/**
 * 新客户修改更新信息
 */
export const updatedclientlist = (data) => {
	return http({
	    method: "post",
	    url: process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/addcustomerorder`,
	    data
	});
};

/**
 * 查看订单列表信息
 */
export const lookclientlist = (CardCode,U_MobilePhone) => {
	return http({
	    method: "get",
	    url: process.env.VUE_APP_CUSTOMERRL_URL+`factory/v1/customerrls/selectcustomerorders?CardCode=${CardCode}&U_MobilePhone=${U_MobilePhone}`
	});
};

/**
 * 根据客户编号查询客户名称
 */
export const searchKhName = (uCustomerCode) => {
	return http({
	    method: "get",
	    url: process.env.VUE_APP_CUSTOMERRL_URL+`factory/customerrls/searchcardnamebycustomercode?uCustomerCode=${uCustomerCode}`
	});
};

