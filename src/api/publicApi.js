import http from "./http";
import axios from "axios";

/**
 * UUID
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`
  });
};

/**
 * 查询数据字典
 * dictIndex值：
 *  ReservedType 预留类型
 */
export const dictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 常量数据字典
 */
export const constDictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 供应商列表字典
 */
export const supplierDictList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL + `supplier/v1/supplierCompanys/dict`
  });
};

/**
 * 获取供应商列表字典
 * 搜索下拉
 */
export const supplierSearchList = (supplierId, supplierName, supplierCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL + `supplier/v1/supplierCompanys/dict?supplierId=${supplierId}&supplierName=${supplierName}&supplierCode=${supplierCode}`
  });
};

/**
 * 库位类型
 */
export const subInventoryTypeList = (virtualInventoryId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/subInventory/${virtualInventoryId}`
  });
};

/**
 * 根据物料编号查询计量单位
 */
export const getMeasurementUnitByMC = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/purchasemeasurementunit?materialCode=${materialCode}`
  });
};

/**
 * 根据物料编号查询产品编号
 */
export const getProductCodeByMC = (materialCode, productName, productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL + `productmaterial/v1/productmaterial/dist?materialCode=${materialCode}&productName=${productName}&productCode=${productCode}`
  });
};

/**
 *根据物料编号查询供应商信息
 */
export const getSupplierByMC = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/queryMaterialSupplier?materialCode=${materialCode}`
  });
};

/**
 * 根据物料编号查询数据库是否存在此物料编号
 */
export const existMaterialCode = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/querytMaterialAndFinishedProduct?materialCode=${materialCode}`
  });
};

/**
 * 查询所有客户id和名称，公司 + 个人
 */
export const getCustomerList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_CUSTOMER_URL + `customer/v1/queryAll`
  });
};

/**
 * 审批流程调取
 */
export const approvalProcessInfo = (flowUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
  });
};