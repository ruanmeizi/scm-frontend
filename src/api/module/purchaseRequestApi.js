// 采购申请
import http from "../http";
import axios from "axios";

/**
 * 申请采购
 * 分页查询采购计划管理查询
 */
export const purchaseRequestList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseRequestAndItems/searchItemByCondition?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 草稿的分页查询采购计划管理查询
 */
export const purchaseRequestDraftList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseRequestAndItems/searchAllItem?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 列表提交审批新增采购计划管理信息
 */
export const submitPurchaseRequest = (id, data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/${id}`,
    data
  });
};

/**
 * 删除采购计划管理信息
 */
export const deletePurchaseRequest = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/${id}`,
  });
};
/**
 * 删除采购申请项的一行
 */
export const deletePurchaseRequestitems = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems/${id}`,
  });
};
/**
 * 撤销PR子项
 */
export const revokePurchaseRequestItem = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/cancelPurchaseRequestItem?uuid=${uuid}`,
  });
};

/**
 * 根据id查询采购计划管理信息
 */
export const searchPurchaseRequest = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequestanditems/${id}`,
  });
};

/**
 * 新增采购计划拉去以销定采数据管理信息
 */
export const pullPurchaseRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `/saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};

/**
 * 新增采购计划拉去备货计划数据管理信息
 */
// export const pullPlanPurchaseRequest = (virtualInventory) => {
//   return http({
//     method: "get",
//     url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/readyPlanResults/${virtualInventory}`
//   });
// };
export const pullPlanPurchaseRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryAllReady`,
    data
  });
};

/**
 * 修改采购计划管理信息
 */
export const updatePurchaseRequest = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/purchaseRequestAndItems`,
    data
  });
};

/**
 * 新增采购计划管理信息
 */
export const addPurchaseRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/purchaseRequestAndItems`,
    data
  });
};

/**
 * 查询建议采购数量
 */
export const searchSuggestQuantity = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryReady`,
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
 * 采购申请新增也调用：批量查询规格
 */
export const confirmationNoQuery = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchConfirmQuantityPerPackageByCodeFetch`,
    data
  });
};
