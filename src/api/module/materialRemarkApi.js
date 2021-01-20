import http from "../http";
import axios from "axios";

/**
 * 保存物料备注
 * 
 */
export const materialInventorySearch = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `materialremark/v1/saveMaterialRemark`,
    data
  });
};

/**
 * 删除物料备注根据行id
 * 
 */
export const removeMaterialRemark = (id) => {
    return http({
      method: "delete",
      url: process.env.VUE_APP_SCM_URL + `materialremark/v1/removeMaterialRemarkById/${id}`,
    });
};
/**
 * 分页展示物料备注列表
 * 
 */
export const materialRemarkList = (currentPage, pageSize, data) => {
    return http({
      method: "post",
      url: process.env.VUE_APP_SCM_URL + `materialremark/v1/searchPageMaterialRemark?currentPage=${currentPage}&pageSize=${pageSize}`,
      data
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
  export const purchasegetuuid = () => {
    return http({
      method: "get",
      url: process.env.VUE_APP_INFRASTRUCTURE_URL +`/infrastructure/v1/getUUID`,
    });
  };

export const batchQuery = (data) => {
    return http({
      method: "post",
      url: process.env.VUE_APP_MATERIAL_URL + `/material/v1/materials/querytMaterialAndFinishedProductFetch`,
      data
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
export const getCheckSupplierName = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`material/v1/materials/selectMaterialByMaterialCode?materialCode=${materialCode}`
  });
};
/**
 * 根据物料编号查询产品编号
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
 * 根据物料系列 查询面料物料
 */
export const getMaterialSeries = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/querytMaterialByMaterialSeries?materialSeries=${materialCode}`,
  });
};