import http from "../http";
import axios from "axios";

/**
 * 异常处理
 * 分页查询异常处理调拨单和子项
 */
export const exceptionSolveList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/exceptionhandings/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 获取所有的异常类型名称
 */
// export const abnormalTypeList = () => {
//   return http({
//     method: "get",
//     url: process.env.VUE_APP_SCM_URL + `scm/v1/getexceptiontypeall`,
//   });
// };

export const abnormalTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `infrastructure/v1/constants/dicts?dictIndex=ArrivalDifferenceType`
  });
};