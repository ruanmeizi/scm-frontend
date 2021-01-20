import http from "../http";
import axios from "axios";

/**
 * 物料主数据——成品物料主数据维护
 * 分页查询产品信息
 */
export const productMaterialsList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 新增物料(成品)信息表
 */
export const addProductMaterials = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts`,
    data
  });
};

/**
 * 删除物料(成品)信息表的一行
 */
export const deleteProductMaterials = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts/${id}`
  });
};


/**
 * 根据id查询物料(成品)信息表
 */
export const searchProductMaterials = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts/${id}`
  });
};


/**
 * 修改物料(成品)信息表
 */
export const editProductMaterials = (id, data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts/${id}`,
    data
  });
};



/**
 * 获取uuid
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL +`/infrastructure/v1/getUUID`,
  });
};

/**
 * 获取供应商列表字典
 */
export const supplierNameData = (supplierId, supplierName,supplierCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL + `supplier/v1/supplierCompanys/dict?supplierId=${supplierId}&supplierName=${supplierName}&supplierCode=${supplierCode}`
  });
};


/**
 * 获取默认克重
 */
export const fabricGramWeight = (index) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `materialfinishedproduct/v1/materialfinishedproducts/unitgram?index=${index}`
  });
};
