import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划管理查询
 */
export const factorySerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 分页查询采购计划管理查询
 */
export const purchasegetstockup = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+`allocation/v1/confirmingdodes`,
    data
  });
};


/**
 * 新增获取供应商下拉数据
 */
export const getsupplierName = (supplierId,supplierName) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SUPPLIER_URL+`supplier/v1/supplierCompanys/dict?supplierId=${supplierId}&supplierName=${supplierName}`
  });
};

/**
 * 新增采购计划管理信息获取uuid
 */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

/**
 * 编辑查看列表
 */
export const factorychildshow = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocationByThreeData/${id}`
  });
};
// export const factorychildshow = (id) => {
//   return http({
//     method: "get",
//     url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/${id}`
//   });
// };



/**
 * 删除子项展示table列表
 */
export const factorychilddel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/${id}`,
  });
};


/**
 * 新增子项form列表
 */
export const factorychildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `allocation/v1/allocation`,
    data
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
 * 新增父项form列表
 */
export const factoryparentadd = (id,confirmNumber,confirmTimeStr) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `scm/v1/factoryconfirmitems/batch2?id=${id}&confirmNumber=${confirmNumber}&confirmTimeStr=${confirmTimeStr}`
  });
};

/**
 * 分页条查展示预收货清单（供应链）
 */
export const gylPrepareReceiptList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/queryPrePageByGyl?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 根据id查询工厂调拨单与工厂调拨项
 */
export const searchPrepareReceiptItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlistitem/v1/searchPrepareReceiptListItem`,
    data
  });
};

/**
 * 编辑预收货清单项，添加批次号
 */
export const editPrepareReceiptItem = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlistitem/v1/updatePrepareReceiptListItem`,
    data
  });
};

/**
 * 根据id下载附件
 */
export const downloadInvoicePackingFile = (id) => {
  return http({
    method: "get",
    responseType: 'arraybuffer',
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/downloadById?id=${id}`
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
   * 库位类型调取(仅限库内调拨)
   */
export const subinventoryRollsType=(virtualInventoryId) => {
return http({
    method: "get",
    url: process.env.VUE_APP_VIRTUALINVENTORY_URL+ `virtualinventory/v1/virtualinventorys/queryWmsSubInventory/${virtualInventoryId}`
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
   * 调拨类型调取
   */
export const getallottype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=TransferType`
});
};

/**
 * 新增采购计划拉取客订数据管理信息
 */
export const purchasegetdata = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL+ `/saleorder/oms/saleorders/saleorderanditem`,
    data
  });
};

/**
 * 获取在库可用库存--类型工厂调拨
 */
export const purchasegetInventory = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+ `allocation/v1/availableinventory`,
    data
  });
};

/**
 * 获取在库可用库存--类型库内调拨
 */
export const purchasegetInventorylast = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL+ `recordinventory/v1/transactiondetails/availablestock`,
    data
  });
};


/**
 * 外侧提交审批
 */
export const factorychildoutsave = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL+ `allocation/v1/submitallocationstobpm?id=${id}`,
  });
};

/**
 * 新增调拨计划拉取备货数据管理信息
 */
export const purchasegetdatastok = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SALEPREDICT_URL+ `salepredict/v1/transferPlanResults/factoryTransfer`
  });
};

/**
 * 查询所有物料建议调拨数量
 */
export const pullCustomerOrderRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryAllTransfer`,
    data
  });
};

/**
 * 根据物料编号查询数据库是否存在此物料编号
 */
export const getmaterialCode = (materialCode) => {
  return http({
      method: "get",
      url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/querytMaterialAndFinishedProduct?materialCode=${materialCode}`
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
 *根据产品编号查询物料编号
  */
export const getproductCode=(productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/productbyproductcode/search?productCode=${productCode}`
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
 *根据物料编号查询确认书列表
 */
export const getConfirmNumbersByMC = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchConfirmNumberByMaterialCode?materialCode=${materialCode}`
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
 * 根据确认书号查询调拨数量
 */
export const getAllocationQuantityByCN = (materialCode, confirmNumber) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/queryAllocationQuantity?materialCode=${materialCode}&confirmNumber=${confirmNumber}`
  });
};

/**
 * 根据入库仓位查询建议调拨数量
 */
export const getTPQuantityByInventory = (materialCode, inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/queryTransferQuantity?materialCode=${materialCode}&inventory=${inventory}`
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
// export const existMaterialCode = (materialCode) => {
//   return http({
//     method: "get",
//     url: process.env.VUE_APP_MATERIAL_URL + `material/v1/materials/selectMaterialByMaterialCode?materialCode=${materialCode}`
//   });
// };

/**
 * 查询建议调拨数量
 */
export const searchTransferPlanQuantity = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/queryTransfer`,
    data
  });
};