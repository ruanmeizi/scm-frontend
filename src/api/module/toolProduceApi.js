import http from "../http";
import axios from "axios";

/**
 * 生产管理——面料生产
 * 分页查询成品生产申请项
 */
export const fabricProduceList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchproductorderRequestAndItems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 分页查询面料生产订单申请单以及订单子项-草稿页面
 */
export const fabricProduceDraftList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchproductorderRequestAndItems/draft?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 删除成品生产申请单和申请项
 */
export const deleteFabricProduce = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/salestoolorderrequestsbyid/${id}`
  });
};

/**
 * 修改面料生产订单申请单
 */
export const editProduceList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/salestoolorderrequests/submitApproval`,
    data
  });
};
// export const editProduceList = (data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_SCM_URL + `scm/v1/salestoolorderrequestupdate`,
//     data
//   });
// };

/**
 * 根据id查询成品生产申请单
 */
export const searchFabricProduce = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/salestoolorderrequestanditems/${id}`
  });
};

/**
 * 删除面料生产订单申请项以及所有原材料集合
 */
export const deleteProduceRequest = (sampleUuid) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestitemsdeletebysampleuuid/${sampleUuid}`
  });
};

/**
 * 删除成品生产申请项
 */
export const deleteProduceRequestItem = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/productorderrequestitemsdelete/${id}`
  });
};

/**
 * 新增面料生产订单申请单及子项
 */
export const submitProduceList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/salestoolorderrequests`,
    data
  });
};

/**
 * 仓位类型调取
 */
export const inventoryTypeList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
  });
};

/**
 * 库位类型调取
 */
export const subInventoryTypeList = (virtualInventoryId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL + `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
  });
};

/**
 * 生产管理——销售工具生产
 * 分页查询销售工具生产订单申请以及申请项-非草稿页面
 */
export const toolProduceList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchsalestoolorderrequestAndItems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 分页查询销售工具生产订单申请以及申请项-草稿页面
 */
export const toolProduceDraftList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/fetchsalestoolorderrequestAndItems/draft?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 物料分类
 */
export const materialClassList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=MaterialClass`
  });
};

/**
 * 销售季
 */
export const salesSeasonList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=SaleSeasou`
  });
};

/**
 * 审批流程调取
 */
export const approvalProcessInfo = (flowUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
  });
};

/**
 * 常量查询数据字典
 */
export const constDictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 根据物料编号查询计量单位
 */
export const getmaterialCodeUnit=(materialCode) => {
  return http({
      method: "get",
      url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/purchasemeasurementunit?materialCode=${materialCode}`
  });
};

/**
 * 根据生产物料编号查询原材料产品编号、原材料物料编号
 */
export const getOriginCodeByMC = (materialCode) => {
  return http({
      method: "get",
      url: process.env.VUE_APP_MATERIAL_URL + `combinedmessage/v1/combinedmaterialmessages/queryByMaterialCode?materialCode=${materialCode}`
  });
};