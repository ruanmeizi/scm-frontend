import http from "../http";
import axios from "axios";


/**
 * 分页条查展示采购价单
 */
export const purchasePriceList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/pageQueryPriceList?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 保存采购价单
 */
export const editPurchasePrice = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/savePriceList`,
    data
  });
};

/**
 * 创建现货采购价单
 */
export const createPurchasePrice = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/saveSpotPriceList`,
    data
  });
};

/**
 * 根据采购价单名称查询价单列表
 */
export const searchPurchasePriceList = (priceListName) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/searchPriceListsByName?priceListName=${priceListName}`,
  });
};

/**
 * 根据价单编码查询现货采购价单子项
 */
// export const searchPurchasePriceList = (data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_SCM_URL + `purchasepricelistitem/v1/pageQueryPriceList?priceListId=${priceListId}`,
//     data
//   });
// };

/**
 * 删除采购价单
 */
export const deletePurchasePrice = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/removePriceListById?id=${id}`,
  });
};



/**
 * 编辑查看采购价单
 */
export const editPurchasePriceView = (id,materialSeries,currentPage,pageSize) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/searchPagePriceListById?id=${id}&materialSeries=${materialSeries}&currentPage=${currentPage}&pageSize=${pageSize}`,
  });
};



/**
 * 获取供应商列表字典
 */
export const supplierDictList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL + `supplier/v1/supplierCompanys/dict`
  });
};

/**
 * 供应商编号查询物料系列
 */
export const supplierToMaterialSeries = (supplierId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/materialseries?supplierId=${supplierId}`,
  });
};

/**
 * 验证提交数据中物料编码是否重复
 */
export const checkMaterialCode = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/existsMaterialCode`,
    data
  });
};

/**
 * 常量查询数据字典
 */
export const constDictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 获取uuid
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL +`/infrastructure/v1/getUUID`,
  });
};

/**
 * 采购价单列表页单行提交审批
 */
export const submitPurchasePrice = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/auditPriceList?id=${id}`,
  });
};