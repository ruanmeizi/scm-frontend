import http from "../http";
import axios from "axios";

/**
 * 设置——设置库位
 * 分页查询虚拟仓库
 */
export const virtualInventorysList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/inventorys`,
    data
  });
};

/**
 * 设置——设置库位
 * 删除虚拟仓库的一行
 */
export const deleteVirtualInventorys = (uuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/${uuid}`
  });
};

/**
 * 设置——设置库位
 * 根据id查询虚拟仓库
 */
export const searchVirtualInventorys = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/${uuid}`
  });
};

/**
 * 设置——设置库位
 * 新增虚拟仓库
 */
export const addVirtualInventorys = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys`,
    data
  });
};

/**
 * 业务类型查询
 */
export const businessType = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dicts?dictIndex=businessType`
  });
};

/**
 * 仓位类型调取
 */
export const inventoryTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
  });
};

/**
 * 修改虚拟仓库
 */
export const editVirtualInventorys = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys`,
    data
  });
};
/* 分页查询 */
export const orderSearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `orderTypeAndWarehouse/oms/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
}
/* 新增或修改*/
export const addOrUpdate = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `orderTypeAndWarehouse/oms/addOrUpdate`,
    data
  });
}
/* 删除 */
export const deleteOrder = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_OMS_URL + `orderTypeAndWarehouse/oms/delete/${uuid}`
  });
};
/* 订单类型 */
export const saleorderType = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=SaleOrderType`
  });
};
/**
 * 业务类型查询
 */
export const businessTypes = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=BusinessType`
  });
};
/**
   * 库位类型调取
   */
export const subinventoryquesttype = (virtualInventoryId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/subInventory/${virtualInventoryId}`
  });
};
// 仓位类型
export const inventoryTypeLists = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
  });
};

