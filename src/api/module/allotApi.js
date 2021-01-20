import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划管理查询
 */
export const purchaseSerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/transferPlanResults/searchByPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 分页查询采购计划管理查询
 */
export const allotscreen = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/transferPlanResults/columns`
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

/**
 * 可用备货总量详情
 */
export const periodInfo = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/transferPlanResults/periodDetails/${uuid}`,
  });
};

export const queryReadyPlanPage = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryTransferPage?currentPage=${currentPage}&pageSize=${pageSize}`,
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

