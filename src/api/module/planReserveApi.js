import http from "../http";
import axios from "axios";

/**
 * 计划预留——预售订单看板
 * 列表
 */
export const presaleOrderList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `saleorder/oms/saleorders/saleorderanditemList?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 获取所有的异常类型名称
 */
export const abnormalTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/getexceptiontypeall`,
  });
};

/**
 * 计划预留——计划预留
 */
export const planReserveList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `planreserve/v1/searchPlanReserve?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 预留类型
 */
export const reserveTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dicts?dictIndex=ReservedType`
  });
};

/**
 * 仓位类型调取
 */
export const inventoryTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
  });
};

/**
 * 库位类型调取
 */
export const subInventoryTypeList = (virtualInventoryId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
  });
};

/**
 * 编辑计划预留和计划预留项
 */
export const editPlanReserve = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `planreserve/v1/savePlanReserveAndItem`,
    data
  });
};

/**
 * 获取UUID
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL +`/infrastructure/v1/getUUID`,
  });
};

/**
 * 删除计划预留
 */
export const deletePlanReserve = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `planreserve/v1/removePlanReserve/${id}`,
  });
};

/**
 * 整单解除计划预留
 */
export const removePlanReserve = (id, data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `planreserve/v1/releasePlanReserve/${id}`,
    data
  });
};

/**
 * 解除计划预留项
 */
export const removePlanReserveItem = (id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `planreserveitem/v1/releasePlanReserveItem/${id}`
  });
};

/**
 * 更新计划预留审批信息
 */
// export const submitPlanReserve = (data) => {
//   return http({
//     method: "put",
//     url: process.env.VUE_APP_SCM_URL+ `planreserve/v1/auditPlanReserve`,
//     data
//   });
// };
export const submitPlanReserve = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL+ `planreserve/v1/submitPlanReserveToBPM?id=${id}`
  });
};

/**
 * 销售单号查询客户名
 */
export const searchUsername = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};

/**
 * 根据产品编号搜索物料编号
 */
export const searchMaterialCode = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL + `productmaterial/v1/productmaterial/getMaterialCodeByProductCode?productCode=${productCode}`,
  });
};

/**
 * 物料询单、在产、货妥、在途、在库数量
 */
export const reserveQuantitysList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `recordinventory/v1/transactiondetails/quantitys`,
    data
  });
};

/**
 * 审批流程调取
 */
export const approvalProcessInfo = (flowUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
  });
};

/**
 * 根据MO拉取销售工具生产单
 */
export const pullToolProduction = (productionOrderCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/SalesToolOrder/v1/queryByProductionOrderCode?productionOrderCode=${productionOrderCode}`
  });
};

/**
 * 根据MO拉取面料生产单
 */
export const pullClothProduction = (productOrderCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/productOrder/v1/queryByProductOrderCode?productOrderCode=${productOrderCode}`
  });
};

/**
 * 预售顶订单看板列表
 * 看板列表 表格
 */
export const querySaleOrderDashBoard = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `/materialbusinesssuits/v1/saleorder/querySaleOrderDashBoard?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 常量查询数据字典
 */
export const constDictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 产品编码浮层
 */
export const materialList = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL + `/materialbusinesssuits/v1/saleorder/searchProductCodeDetails?materialCode=${materialCode}`,
  });
};
/**
 * 询单，在产，货妥，在途浮层
 */
export const planReservedList= (productCode,saleOrderId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL + `/materialbusinesssuits/v1/saleorder/searchPlanReservedDetails?productCode=${productCode}&saleOrderId=${saleOrderId}`,
  });
};
/**
 * 库位类型调取
 */
export const subinventoryquesttype=(virtualInventoryId) => {
  return http({
      method: "get",
      url: process.env.VUE_APP_VIRTUALINVENTORY_URL+ `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
  });
};
/**
 * 非常规看板的分页
 */
export const querySaleOrderSearch= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `unconventionalstatiss/v1/fetchByPage/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


