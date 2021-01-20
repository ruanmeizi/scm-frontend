import http from "../http";
import axios from "axios";

/**
 * 生产管理——面料生产
 * 分页查询成品生产申请项
 */
export const fabricProduceList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchproductorderRequestAndItems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 分页查询面料生产订单申请单以及订单子项-草稿页面
 */
export const fabricProduceDraftList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchproductorderRequestAndItems/draft?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 删除成品生产申请单和申请项
 */
export const deleteFabricProduce = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestsdeletebyId/${id}`
  });
};

/**
 * 修改面料生产订单申请单
 */
export const editProduceList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestupdate`,
    data
  });
};

/**
 * 根据id查询成品生产申请单
 */
export const searchFabricProduce = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/peoductorderrequestanditems/${id}`
  });
};

/**
 * 删除面料生产订单申请项以及所有原材料集合
 */
export const deleteProduceRequest = (sampleUuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestitemsdeletebysampleuuid/${sampleUuid}`
  });
};

/**
 * 删除成品生产申请项
 */
export const deleteProduceRequestItem = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestitemsdelete/${id}`
  });
};

/**
 * 新增面料生产订单申请单及子项
 */
export const submitProduceList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestsadd`,
    data
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
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/subInventory/${virtualInventoryId}`
  });
};

/**
 * 生产类型
 */
export const productionTypeList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dictitems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
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
 * 审批流程调取
 */
export const approvalProcessInfo = (flowUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
  });
};

/**
 * 物料可用库存
 */
// export const availableStockData = (data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_INVENTORY_URL + `recordinventory/v1/transactiondetails/availablestock`,
//     data
//   });
// };
export const availableStockData = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `recordinventory/v1/transactiondetails/queryProducedQuantity`,
    data
  });
};

/**
 *根据物料编号查询计量单位
 */
export const getmaterialCodeUnit=(materialCode) => {
  return http({
      method: "get",
      url: process.env.VUE_APP_MATERIAL_URL+ `material/v1/materials/purchasemeasurementunit?materialCode=${materialCode}`
  });
};