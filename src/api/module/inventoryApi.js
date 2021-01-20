import http from "../http";
import axios from "axios";

/**
 * 产品库存规则维护
 * 分页查询异常处理调拨单和子项
 */
export const inventoryRulesList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `productinventoryrule/v1/productinventoryrules/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 删除产品库存规则表的一行
 */
export const deleteInventoryItem = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_INVENTORY_URL + `productinventoryrule/v1/productinventoryrules/${id}`,
  });
};

/**
 * 根据id查询产品库存规则表
 */
export const searchInventoryItem = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL + `productinventoryrule/v1/productinventoryrules/${id}`,
  });
};

/**
 * 查询常量数据字典
 */
export const inventoryCountList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 规则公式
 */
export const searchRuleFormula = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL + `productinventoryrule/v1/ruleexpression/search?productCode=${productCode}`,
  });
};

/**
 * 新增产品库存规则表
 */
export const addInventoryRules = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL + `productinventoryrule/v1/productinventoryrules`,
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
 * 修改产品库存规则表
 */
export const modifyInventoryRules = (id, data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_INVENTORY_URL+ `productinventoryrule/v1/productinventoryrules/${id}`,
    data
  });
};

