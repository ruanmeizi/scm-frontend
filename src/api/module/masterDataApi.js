import http from "../http";
import axios from "axios";

/**
 * 产品主数据——面料产品主数据维护
 * 分页查询产品信息
 */
export const productmasterSearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_PRODUCT_URL + `product/v1/pageSearchProductproducts?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 产品主数据——面料产品主数据维护
 * 新增
 */
export const fabrictypeadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_PRODUCT_URL + `product/v1/saveProductproducts`,
    data
  });
};



/**
 * 产品主数据——面料产品主数据维护
 * 删除
 */
export const fabrictypedel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/removeProductproductsById/${id}`
  });
};


/**
 * 产品主数据——面料产品主数据维护
 * 编辑查看
 */
export const fabrictypeview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/queryProductproductsById/${id}`
  });
};


/**
 * 产品主数据——面料产品主数据维护
 * 编辑提交
 */
export const fabrictypeupd = (data,id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/updateProductproductsById/${id}`,
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
 * 根据id删除一个附件
 */
export const deleteUploadFile = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/${id}`,
  });
};

/**
 * 取消时根据id删除新增的文件
 */
export const cancelUploadFile = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/deleteByIds`,
    data
  });
};


/**
 * 根据uuid和附件类型，查询所有的附件
 */
export const searchUploadFile = (uuid, type) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/search?uuid=${uuid}&type=${type}`,
  });
};


/**
 * 检测产品号是否存在入库
 */
export const getCheckProductCode = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL +`product/v1/product/checkProductCodeUniqueness?productCode=${productCode}`
  });
};

/**
 * 检测产品条形码是否存在入库
 */
export const getCheckProductBarcode = (productBarcode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL +`product/v1/product/checkProductBarcodeUniqueness?productBarcode=${productBarcode}`
  });
};