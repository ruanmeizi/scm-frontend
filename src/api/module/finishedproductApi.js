import http from "../http";
import axios from "axios";

/**
 * 产品主数据——成品产品主数据维护
 * 分页查询产品信息
 */
export const finishedapiSearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_PRODUCT_URL + `finishedproduct/v1/productfinishedproducts/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 产品主数据——成品产品主数据维护
 * 新增
 */
export const finishedtypeadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_PRODUCT_URL + `finishedproduct/v1/productfinishedproducts`,
    data
  });
};



/**
 * 产品主数据——成品产品主数据维护
 * 删除
 */
export const finishedtypedel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_PRODUCT_URL+ `finishedproduct/v1/productfinishedproducts/${id}`
  });
};


/**
 * 产品主数据——成品产品主数据维护
 * 编辑查看
 */
export const finishedtypeview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `finishedproduct/v1/productfinishedproducts/${id}`
  });
};


/**
 * 产品主数据——成品产品主数据维护
 * 编辑提交
 */
export const finishedtypeupd = (data,id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_PRODUCT_URL+ `finishedproduct/v1/productfinishedproducts/${id}`,
    data
  });
};


/**
 * 新增采购计划管理信息获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL +`/infrastructure/v1/getUUID`,
  });
};

