import http from "../http";
import axios from "axios";

/**
 * 分页查询采购计划管理查询
 */
export const transferOrderList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 删除子项展示table列表
 */
export const deleteTransferOrder = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/${id}`,
  });
};

/**
 * 外侧提交审批
 */
export const submitTransferOrder = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/submitallocationstobpm?id=${id}`,
  });
};

/**
 * 外侧撤销调拨单
 */
export const revokeTransferOrder = (factoryAllocationCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/cancelAllocation?factoryAllocationCode=${factoryAllocationCode}`,
  });
};

/**
 * 编辑查看列表
 */
export const searchTransferOrder = (id,status) => {
 
  return http({
    method: "get",
   // url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocationByThreeData/${id}`
     url: process.env.VUE_APP_SCM_URL +(`${status}`=="fission"?`allocation/v1/queryNoAllocation/${id}`:`allocation/v1/allocationByThreeData/${id}`) 
  });
};

/**
 * 根据物料编号查询确认书列表
 */
export const getConfirmNumbersByMC = (materialCode, inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/confirmingdodes?materialCode=${materialCode}&inventory=${inventory}`
  });
};

/**
 * 根据确认书号查询调拨数量
 */
export const getAllocationQuantityByCN = (materialCode, confirmNumber, packSpecification) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/queryAllocationQuantity?materialCode=${materialCode}&confirmNumber=${confirmNumber}&packSpecification=${packSpecification}`
  });
};

/**
 * 新增采购计划拉取客订数据管理信息
 */
export const pullCustomerOrder = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `/saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};

/**
 * 查询所有物料建议调拨数量
 */
export const pullCustomerOrderRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryAllTransfer`,
    data
  });
};

/**
 * 根据入库仓位查询建议调拨数量
 */
export const getTPQuantityByInventory = (materialCode, inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/queryTransferQuantity?materialCode=${materialCode}&inventory=${inventory}`
  });
};

/**
 * 新增子项form列表
 */
export const updateTransferOrder = (data,status) => {
  return http({
    method: "post",
    //url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation`,
    url: process.env.VUE_APP_SCM_URL +(`${status}`=="fission"?`allocation/v1/saveAllocationFission`:`allocation/v1/allocation`) ,
    data
  });
};

/**
 * 库位类型调取(仅限库内调拨)
 */
export const subInventoryRollsList = (virtualInventoryId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
  });
};

/**
 * 获取在库可用库存--类型工厂调拨
 */
export const factoryAvailableInventory = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/availableinventory`,
    data
  });
};

/**
 * 获取在库可用库存--类型库内调拨
 */
export const cuneAvailableInventory = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `recordinventory/v1/transactiondetails/availablestock`,
    data
  });
};

/**
 * 查询建议调拨数量
 */
export const searchTransferPlanQuantity = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryTransfer`,
    data
  });
};
/**
 * 采购申请新增也调用：批量查询物料
 */
export const batchQuery = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `/material/v1/materials/querytMaterialAndFinishedProductFetch`,
    data
  });
};
/**
 * 物料可用库存
 */
export const availablestock = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `recordinventory/v1/transactiondetails/availablestock`,
    data
  });
};
/**
 * 查询所有内部批次号
 */
export const getBatchNoList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `inventory/v1/MaterialInventory/getBatchNoList`,
    data
  });
};
/**
 * 查询所有内部批次号
 */
export const searchDetail = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `inventory/v1/MaterialInventory/searchDetail`,
    data
  });
};

/**
 * 根据确认书和物料编码查出货妥规格集合
 */
export const getPaidMeterByCN = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/getAvailableinventoryAndSpecification`,
    data
  });
};

/**
 * 根据确认书和物料编码带出货妥记录的付款方式
 */
export const getPaymentMethodByCN = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/getPaymentMethod`,
    data
  });
};

