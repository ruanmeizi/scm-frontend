import http from "../http";
import axios from "axios";


/**
 * 备货总量-分页查询
 */
export const stocktotalserch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchtotalmaterialquantity/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 备货总量-在厂（成品+生产）
 */
export const inthefactorydetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/queryinfactoryinventorynumber/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};


/**
 * 备货总量-在途
 */
export const onpassagedetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/queryshippmentnumber/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};


/**
 * 备货总量-可用备货总量
 */
export const availablestockdetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/querymaterialtotalnumber/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};



/**
 * 备货总量-询单
 */
export const onlineorderdetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/querypurchaserequestnumber/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};


/**
 * 备货总量-延期交货
 */
export const backorderdetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/querynumberofdelaytimes/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};


/**
 * 产品库存看板
 * 新增组成产品编号过滤式
 */
export const productboardCode = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/products/productcodes?productCode=${productCode}`
  });
};

/**
 * 销售季
 */
export const fabrictypeSaleSeasou = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=FactorySeason`
  });
};

/**
 *物料/产品-备货总量看板
 *可用备货总量（含询单）详情
 */
export const queryAvailableReadyAll = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`/materialbusinesssuits/v1/queryAvailableReadyAll?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};
