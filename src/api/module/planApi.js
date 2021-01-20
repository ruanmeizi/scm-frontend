import http from "../http";
import axios from "axios";

/**
 * 计划管理——供应链策略
 * 职业装权重保存
 */
export const editBAWeightsItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictweights`,
    data
  });
};

/**
 * 计划管理——供应链策略
 * 职业装剔除项保存
 */
export const editBACullItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictexcludequantitys/batch`,
    data
  });
};

/**
 * 计划管理——供应链策略
 * 职业装增长率保存
 */
export const editBAGrowItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictweights`,
    data
  });
};

/**
 * 计划管理——供应链策略
 * 零剪权重保存
 */
export const editZCWeightsItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictweights`,
    data
  });
};

/**
 * 计划管理——供应链策略
 * 零剪剔除项保存
 */
export const editZCCullItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictexcludequantitys/batch`,
    data
  });
};

/**
 * 计划管理——供应链策略
 * 获取销售预测权重或增长率
 */
export const weightsOrGrowList = (saleType) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictweights/${saleType}`
  });
};
/**
 * 计划管理——供应链策略
 * 查询历史销售季剔除标准
 */
export const getExcludeHistory = (businessType) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/getExcludeHistory/${businessType}`
  });
};

/**
 * 计划管理——供应链策略
 * 查询历史销售季权重增长率
 */
export const getWeightHistory = (businessType) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/getWeightHistory/${businessType}`
  });
};
/**
 * 计划管理——供应链策略
 * 获取销售季列表
 */
export const queryCurrent = (businessType) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/queryCurrent/${businessType}`
  });
};

/**
 * 计划管理——供应链策略
 * 获取销售预测剔除标准
 */
export const cullList = (saleType) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `strategy/v1/salepredictexcludequantitys/${saleType}`
  });
};

/**
 * 计划管理——销售预测
 * 分页查询销售预测结果
 */
export const predictResultsList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `salePredict/v1/queryPredictResultPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 计划管理——销售预测
 * 日期获取
 */
export const factorDateList = (factorType, unit) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/materialpredictresults/starttimes/${factorType}/${unit}`
  });
};