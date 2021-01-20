import http from "../http";
import axios from "axios";


/**
 * 分页查询货妥清单
 */
export const goodsRecordingList= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/searchCargoReadyList?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 查询常量数据字典
 */
export const dictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 发起付款BPM流程
 */
export const createPayProcess = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/startAndReStartBpm`,
    data
  });
};


/**
 * 发起付款
 */
export const sponsorPayment = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `finalpayment/v1/createFinalPayments`,
    data
  });
};

/**
 * 新增付款计划单获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};