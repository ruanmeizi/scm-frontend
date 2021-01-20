import http from "../http";
import axios from "axios";

/**
 * 物料主数据——面料物料主数据维护
 * 分页查询产品信息
 */
export const materialsFabricList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `/material/v1/materials/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 物料主数据——面料物料主数据维护
 * 新增
 */
			
export const fabrictypeadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials`,
    data
  });
};



/**
 * 物料主数据——面料物料主数据维护
 * 删除
 */
export const fabrictypedel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_MATERIAL_URL+ `/material/v1/materials/${id}`
  });
};


/**
 * 物料主数据——面料物料主数据维护
 * 编辑查看
 */
export const fabrictypeview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL+ `material/v1/materials/${id}`
  });
};


/**
 * 物料主数据——面料物料主数据维护
 * 编辑提交
 */
export const fabrictypeupd = (data,id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_MATERIAL_URL+ `material/v1/materials/${id}`,
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
 * 报关品类带出海关编号和系数
 */
export const getHsCode = (index) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`material/v1/materials/getHsCodeAndCustomsTariffCoefficient?index=${index}`
  });
};


/**
 * 检测物料号是否存在入库
 */
export const getCheckMaterialCode = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`material/v1/materials/checkMaterialCodeUniqueness?materialCode=${materialCode}`
  });
};

/**
 * 检测开发号是否存在
 */
export const getCheckDevelopCode = (developCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`material/v1/materials/checkDevelopCodeUniqueness?developCode=${developCode}`
  });
};



/**
 * 成品产品检测物料号是否存在
 */
export const getCheckProductMaterialCode = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`materialfinishedproduct/v1/materialfinishedproducts/check?materialCode=${materialCode}`
  });
};

/**
 * 面料产品检测物料号是否存在
 */
export const getCheckSupplierName = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL +`material/v1/materials/selectMaterialByMaterialCode?materialCode=${materialCode}`
  });
};
