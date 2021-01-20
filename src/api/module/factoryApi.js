import http from "../http";
import axios from "axios";

/**
 * 分页查询采购计划管理查询
 */
export const factorySerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchOrderAndNumbersWithPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
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

/**
 * 新增子项展示table列表
 */
export const factorychildshow = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/search`,
    data
  });
};

/**
 * 修改子项展示table列表
 */
export const factorychildupd = (id,data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `scm/v1/factoryconfirmitems/${id}`,
    data
  });
};

/**
 * 删除子项展示table列表
 */
export const factorychilddel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL+ `scm/v1/factoryconfirmitems/${id}`,
  });
};

/**
 * 新增子项form列表
 */
export const factorychildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `scm/v1/factoryconfirmitems/batch`,
    data
  });
};

/**
 * 新增父项form列表
 */
export const factoryparentadd = (id, confirmNumber, confirmTimeStr, offeredDateStr, factorySeason, discountInfo) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/batch2?id=${id}&confirmNumber=${confirmNumber}&confirmTimeStr=${confirmTimeStr}&offeredDateStr=${offeredDateStr}&factorySeason=${factorySeason}&discountInfo=${discountInfo}`
  });
};

/**
 * 订货采购po单下获取销售订单工厂季
 */
export const getFactorySeason = (saleOrderId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_OMS_URL+ `saleorder/oms/saleorders/getFactorySeasonBySaleOrderId?saleOrderId=${saleOrderId}`
  });
};

