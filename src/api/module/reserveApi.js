import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划管理查询
 */
export const purchaseOrderList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `reserve/v1/reserves/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
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
 * 新增采购计划拉取客订数据管理信息
 */
export const purchasegetdata = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL+ `/saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};


/**
 * 新增预留管理信息
 */
export const purchasechildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `reserve/v1/reserves`,
    data
  });
};


/**
 * 外侧提交审批新增采购计划管理信息
 */
export const purchasechildoutadd = (id,data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `purchaserequest/v1/purchaserequests/${id}`,
    data
  });
};


/**
 * 修改预留管理信息
 */
export const purchasechildupd = (id,data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `reserve/v1/reserves/${id}`,
    data
  });
};

/**
 * 根据id查询预留管理信息
 */
export const purchasegetview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `reserve/v1/reserves/${id}`,
  });
};

/**
 * 删除预留管理信息
 */
export const purchasegetdel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `reserve/v1/reserves/${id}`,
  });
};


/**
   * 请求类型调取
   */
export const purchaserequesttype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=purchaseType`
});
};



/**
   * 仓位类型调取
   */
export const warehousequesttype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
});
};


/**
   * 库位类型调取
   */
export const subinventoryquesttype=(virtualInventoryId) => {
return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL+ `virtualinventory/v1/virtualinventorys/subInventory/${virtualInventoryId}`
});
};

/**
 * 预留类型
 */
export const getreservedtype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=ReservedType`
  });
};


/**
 * 获取在库可用库存
 */
export const purchasegetInventory = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL+ `recordinventory/v1/transactiondetails/availablestock`,
    data
  });
};

/**
   * 审批流程调取
   */
export const getapprovalOpinions=(flowUuid) => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
});
};