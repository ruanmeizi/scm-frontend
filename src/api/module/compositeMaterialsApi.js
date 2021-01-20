import http from "../http";
import axios from "axios";

/**
 * 组合物料主数据——面料组合物料主数据维护
 * 分页查询产品信息
 */
export const materialsFabricList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `/combinedmaterial/v1/combinedmaterials/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 组合物料主数据——面料组合物料主数据维护
 * 新增
 */
			
export const fabrictypeadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_MATERIAL_URL + `combinedmaterial/v1/combinedmaterials`,
    data
  });
};



/**
 * 组合物料主数据——面料组合物料主数据维护
 * 删除
 */
export const fabrictypedel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_MATERIAL_URL+ `combinedmaterial/v1/combinedmaterials/${id}`
  });
};


/**
 * 组合物料主数据——面料组合物料主数据维护
 * 编辑查看
 */
export const fabrictypeview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL+ `combinedmaterial/v1/combinedmaterials/getById/${id}`
  });
};


/**
 * 组合物料主数据——面料组合物料主数据维护
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
 * 组合物料主数据——面料组合物料主数据维护
 * 新增组成物料编号过滤式
 */
export const purchasegetmaterialCode = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL+ `material/v1/materials/materialcodes?materialCode=${materialCode}`
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

