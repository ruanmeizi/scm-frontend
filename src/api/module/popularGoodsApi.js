import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划结果表
 */
export const popularGoodsSerch= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `factorygoods/v1/searchFactoryGoods?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 新增信息获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

/**
 * 新增工厂快货
 */
export const popularGoodsAdd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `factorygoods/v1/saveFactoryGoods`,
    data
  });
};


/**
 * 查看工厂快货
 */
export const getUpdShow = (supplierCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL+ `factorygoods/v1/searchBySupplierCode?supplierCode=${supplierCode}`
  });
};

/**
 * 删除工厂快货信息
 */
export const popularGoodsDel = (supplierCode) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `factorygoods/v1/removeBySupplierCode?supplierCode=${supplierCode}`,
  });
};

/**
 * 获取供应商列表字典
 */
export const supplierDictList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL + `supplier/v1/supplierCompanys/dict`
  });
};


/**
 * 获取快货类型
 */
export const goodsTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=FactoryGoodsType`
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