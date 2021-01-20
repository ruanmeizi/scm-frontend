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
 * 外侧提交预留新增采购计划管理信息
 */
export const purchasechildoutadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `reserve/v1/reserves/auditstatus`,
    data
  });
};

/**
 * 外侧整单解除管理信息
 */
export const purchasegetalldel = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `reserve/v1/taskplans/updateplantypes`,
    data
  });
};

/**
 * 子级整单解除管理信息
 */
export const purchasegetallchilddel = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `reserve/v1/taskplans/oneplantype`,
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
   * 库位类型调取
   */
export const subinventoryquesttype=(virtualInventoryId) => {
return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL+ `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
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

/**
   *根据产品编号查询物料编号
   */
export const getmaterialCode=(productCode) => {
return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `productmaterial/v1/productmaterial/getMaterialCodeByProductCode?productCode=${productCode}`
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

/**
 * 根据MO拉取销售工具生产单
 */
export const pullToolProductionList = (productionOrderCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/SalesToolOrder/v1/queryByProductionOrderCode?productionOrderCode=${productionOrderCode}`
  });
};

/**
 * 根据MO拉取面料生产单
 */
export const pullClothProductionList = (productOrderCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/productOrder/v1/queryByProductOrderCode?productOrderCode=${productOrderCode}`
  });
};

