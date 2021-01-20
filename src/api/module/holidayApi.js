import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划结果表
 */
export const holidaySerch= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `holiday/v1/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 新增信息获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

/**
 * 新增节假日
 */
export const holidayAdd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `holiday/v1/saveHoliday`,
    data
  });
};


/**
 * 编辑修改节假日
 */
export const holidayUpd = (data,id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `holiday/v1/updateHoliday/${id}`,
    data
  });
};

/**
 * 删除采购计划管理信息
 */
export const holidayDel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `holiday/v1/deleteById/${id}`,
  });
};