import http from "../http";
import axios from "axios";


/**
 * 职业装/零剪-分页查询滞销库存看板
 */
// export const businessunsserch = (currentPage, pageSize, data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_INVENTORY_URL +`unsalable/v1/unsalabledashboard/search?currentPage=${currentPage}&pageSize=${pageSize}`,
//     data
//   });
// };

 
/**
 * 物料属性
 */
export const fabrictypeMaterialproperties= () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialProperties`
  });
};

/**
 * 工厂季
 */
export const fabrictypeSaleSeasou = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=SaleSeasou`
  });
};

/**
 * 分页查询滞销看板
 */
export const businessunsserch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL +`unsalaMaterial/v1/queryUnsalebleMaterialPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
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