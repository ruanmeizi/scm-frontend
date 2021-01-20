import http from "../http";
import axios from "axios";


/**
 * 分页-初始列表展示列表
 */
export const supplierSearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SUPPLIER_URL+`/supplier/v1/supplierCompanys/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 供应商查看展示列表
 */
export const getsupplierview = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierCompanys/${uuid}`
  });
};


/**
 * 供应商删除单条数据
 */
export const getsupplierdel = (uuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierCompanys/${uuid}`
  });
};



/**
 * 新增供应商form列表
 */
export const supplierapiadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierCompanys`,
    data
  });
};



/**
 * 新增联系人form列表
 */
export const linkmanapiadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/contacts`,
    data
  });
};


/**
 * 新增地址form列表
 */
export const addressapiadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierAddress`,
    data
  });
};


/**
 * 联系人table列表
 */
export const linkmanapishow = (customerUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/contacts/list/${customerUuid}`
  });
};

/**
 * 联系人单条点击详情
 */
export const linkmanapidetail = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/contacts/${uuid}`
  });
};

/**
 * 地址单条点击详情
 */
export const addressapidetail = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierAddress/${uuid}`
  });
};


/**
 * 联系人单条点击删除
 */
export const linkmanapidel = (uuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/contacts/${uuid}`
  });
};

/**
 * 地址单条点击删除
 */
export const addressapidel = (uuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierAddress/${uuid}`
  });
};


/**
 * 供应商状态列表
 */
export const getsupplierstatus = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTUREINFRASTRUCTURE_URL+ `/v1/constants/dicts?dictIndex=CustomerStatus`
  });
};

/**
 * 供应商类型列表
 */
export const getsuppliertype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTUREINFRASTRUCTURE_URL+ `/v1/constants/dicts?dictIndex=SupplierCategory`
  });
};

/**
 * 联系人列表
 */
export const getlinkmantype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTUREINFRASTRUCTURE_URL+ `/v1/constants/dicts?dictIndex=ContactType`
  });
};

/**
 * 地址信息列表
 */
export const getaddressmessagetype = (customerUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+ `/supplier/v1/supplierAddress/list/${customerUuid}`
  });
};



/**
 * 地址国家列表
 */
export const getaddressstatetype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTUREINFRASTRUCTURE_URL+ `/v1/constants/dicts?dictIndex=Country`
  });
};


/**
 * 地址类型列表
 */
export const getaddresstype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTUREINFRASTRUCTURE_URL+ `/v1/constants/dicts?dictIndex=AddressType`
  });
};


/**
 * 币种分类
 */
export const getaccountstatetype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=Currency`
  });
};



/**
 * 新增采购计划管理信息获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

