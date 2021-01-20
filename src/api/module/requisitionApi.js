import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划管理查询
 */
export const purchaseSerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseRequestAndItems/searchItemByCondition?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 草稿的分页查询采购计划管理查询
 */
export const purchasedraftSerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `purchaserequest/v1/purchaseRequestAndItems/searchAllItem?currentPage=${currentPage}&pageSize=${pageSize}`,
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
 * 新增采购计划拉去以销定采数据管理信息
 */
export const purchasegetdata = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL+ `/saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};


/**
 * 新增采购计划管理信息
 */
export const purchasechildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `purchaserequest/v1/purchaserequests/purchaseRequestAndItems`,
    data
  });
};


/**
 * 外侧提交审批新增采购计划管理信息
 */
export const purchasechildoutadd = (id,data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `purchaserequest/v1/purchaserequests/${id}`,
    data
  });
};


/**
 * 修改采购计划管理信息
 */
export const purchasechildupd = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL+ `purchaserequest/v1/purchaserequests/purchaseRequestAndItems`,
    data
  });
};

/**
 * 根据id查询采购计划管理信息
 */
export const purchasegetview = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequestanditems/${id}`,
  });
};

/**
 * 删除采购计划管理信息
 */
export const purchasegetdel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/${id}`,
  });
};


/**
   * 请求类型调取
   */
export const purchaserequesttype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=purchaseType`
});
};



/**
   * 仓位类型调取
   */
export const warehousequesttype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
});
};


/**
   * 库位类型调取
   */
export const subinventoryquesttype=(virtualInventoryId) => {
return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL+ `virtualinventory/v1/virtualinventorys/subInventory/${virtualInventoryId}`
});
};


/**
   * 审批流程调取
   */
export const getapprovalOpinions=(flowUuid) => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/bpm/v1/approvalOpinions?flowUuid=${flowUuid}`
});
};


/**
 * 新增采购计划拉去备货计划数据管理信息
 */
export const purchasegetdatastok = (virtualInventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL+ `salepredict/v1/readyPlanResults/${virtualInventory}`
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
//根据产品编码查询物料和供应商信息
export const productcodeInfo = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests/info/productcode?productCode=${productCode}`
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


/**
   *根据物料编号查询供应商信息
   */
export const getmaterialCodeMaterial=(materialCode) => {
return http({
    method: "get",
    url: process.env.VUE_APP_MATERIAL_URL+ `material/v1/materials/queryMaterialSupplier?materialCode=${materialCode}`
});
};


/**
   *根据物料编号查询产品编码
      */
  export const getQueryProductCode=(materialCode,productName,productCode) => {
    return http({
        method: "get",
        url: process.env.VUE_APP_PRODUCT_URL+ `productmaterial/v1/productmaterial/dist?materialCode=${materialCode}&productName=${productName}&productCode=${productCode}`
    });
  };
    
