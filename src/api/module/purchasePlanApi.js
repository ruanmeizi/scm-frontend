import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划结果表
 */
export const purchasePlanList= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/readyPlanResults/searchByPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 获取采购计划展示列列表
 */
export const purchasePlanFields = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/readyPlanResults/columns`,
  });
};

/**
 * 可用备货总量详情
 */
export const usableReadyTotalInfo = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/readyPlanResults/usableReadyDetails/${uuid}`,
  });
};

/**
 * 可用备货总量详情
 */
export const periodInfo = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/readyPlanResults/periodDetails/${uuid}`,
  });
};

export const queryReadyPlanPage = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryReadyPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};
/**
 * 查询批量物料的供应商是否一致
 */
export const queryIsTheSameSupplier = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/queryIsTheSameSupplier`,
    data
  });
};
/**
 * 查询采购计划或者调拨计划创建采购单和调拨单所需数据
 */
export const queryPrOrToData = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryPrOrToData`,
    data
  });
};
