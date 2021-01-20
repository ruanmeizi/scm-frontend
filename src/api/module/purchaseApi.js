import http from "../http";
import axios from "axios";


/**
 * 分页查询采购计划结果表
 */
export const purchasePlanList= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SALEPREDICT_URL + `salepredict/v1/readyPlanResults/searchByPage?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 获取采购计划展示列列表
 */
export const purchaseshowlist = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `plan/v1/readyPlanResults/columns`
  });
};


/**
 * 删除采购计划管理信息
 */
export const purchasedelete = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseplans/${id}`,
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
 * 新增采购计划管理信息
 */
export const purchaseadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaserequests`,
    data
  });
};

/**
 * 修改采购计划管理信息
 */
export const purchaseupdmessage = (id, data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseplans/${id}`,
    data
  });
};





/**
 * 修改采购请求子项展示的信息
 */
export const purchasechildshow = (purchaseRequestCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems/selectPrItemsByPrCode?purchaseRequestCode=${purchaseRequestCode}`
  });
};


/**
 * 添加采购请求子项的信息
 */
export const purchasechildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems`,
    data
  });
};


/**
 * 删除采购请求子项的信息
 */
export const purchasechilddel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems/${id}`
  });
};

/**
 * 执行采购——采购请求
 * 分页查询采购申请单(申请+采购项)
 */
export const purchaseRequestList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseRequestAndItems/searchItemByConditionForOrder?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——采购请求
 * 分页查询采购订单（订单 + 订单项）
 */
export const purchaseOrderList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorderAndItems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——采购请求
 * 根据id查询采购申请项
 */
export const searchPurchaseRequestItem = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems/${id}`
  });
};

/**
 * 执行采购——采购请求
 * 新增采购订单同时添加订单子项
 */
export const savePurchaseOrder = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorders/savePurchaseOrder`,
    data
  });
};

/**
 * 执行采购——采购请求
 * 根据id查询采购订单和订单项
 */
export const searchPurchaseOrderList = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorderanditems/${id}`
  });
};

/**
 * 执行采购——采购请求
 * 删除采购订单的一行
 */
export const deletePurchaseOrder = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorders/${id}`,
  });
};
/**
 * 删除一行
 */
export const deletePurchaseOrderItem = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/removeOrderItemsById/${id}`,
  });
};
/**
 * 执行采购——采购请求
 * 批量修改采购订单子项
 */
export const modifyPurchaseOrder = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/updatepoanditembetch`,
    data
  });
};

/**
 * 执行采购——货妥管理
 * 货妥列表
 */
export const cargoReadyList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchOrderWithPageForCargoReady?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——货妥管理
 * 根据订单id查询货妥清单
 */
export const purchaseGoodsList = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/queryReadyListByFactory?factoryConfirmUuid=${uuid}`
  });
};

/**
 * 执行采购——货妥管理
 * 添加货妥清单
 */
export const addPurchaseGoodsList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/saveReadList`,
    data
  });
};

/**
 * 执行采购——货妥管理
 * 根据货妥清单id逻辑删除货妥清单,并同步采购订单项的货妥信息
 */
export const deletePurchaseGoodsList = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/removeReadList/${id}`,
  });
};

/**
 * 执行采购——采购订单
 * 批量修改采购订单
 */
export const submitModifyPurchaseOrder = (data) => {
  return http({
    // method: "put",
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorders/batch`,
    data
  });
};

/**
 * 执行采购——采购订单
 * 查询价单名称
 */
export const getPriceOrderList = (supplierCode, currency, factorySeason) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/queryPriceListName?supplierCode=${supplierCode}&currency=${currency}&factorySeason=${factorySeason}`,
  });
};

/**
 * 执行采购——采购订单
 * 修改采购订单
 */
export const submitPurchaseOrder = (id) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorders/${id}`,
    data
  });
};

/**
 * 执行采购——采购订单
 * 根据价单名称，物料编码和米数查出物料价格
 */
export const priceByMaterialCode = (priceListName, materialCode, meter) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/queryPriceByMaterialCode?priceListName=${priceListName}&materialCode=${materialCode}&meter=${meter}`,
  });
};


/**
 * 执行采购——预收货清单管理
 * 工厂调拨单列表
 */
// export const requisitionList = (currentPage, pageSize, data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_SCM_URL + `actoryAllocation/v1/factoryallocations/search?currentPage=${currentPage}&pageSize=${pageSize}`,
//     data
//   });
// };
export const requisitionList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/allocation/searchByPre?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——预收货清单管理
 * 预收获清单列表
 */
export const prepareReceiptList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/queryPrePageByCg?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——预收货清单管理
 * 根据id查询工厂调拨单与工厂调拨项
 */
// export const searchRequisitionItem = (idList) => {
//   return http({
//     method: "get",
//     url: process.env.VUE_APP_SCM_URL + `factoryAllocationItem/v1/faitems?list=${idList}`
//   });
// };

/**
 * 执行采购——预收货清单管理
 * 创建预收货清单并添加选中的清单子项
 */
export const addRequisitionList = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/savePrepareReceiptList`,
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

/**
 * 删除预收货清单
 */
export const deletePrepareReceipt = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/removePrepareReceiptList/${id}`,
  });
};

/**
 * 编辑预收货清单
 */
export const editPrepareReceipt = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/updatePrepareReceiptList`,
    data
  });
};

// 新增
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
 * 查询数据字典
 */
export const dictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 分页筛选展示预收货清单和清单项列表
 */
// export const advanceReceiptList = (currentPage, pageSize, data) => {
//   return http({
//     method: "post",
//     url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/queryPreAndItemList?currentPage=${currentPage}&pageSize=${pageSize}`,
//     data
//   });
// };
export const advanceReceiptList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/queryPreAndBatchs?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 保存或更新预收货清单以及子项
 */
export const editAdvanceReceipt = (data) => {
  return http({
    method: "post",
    // url: `http://192.168.6.149:8085/preparereceiptlist/v1/savePrepareReceiptList`,
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/savePrepareReceiptList`,
    data
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 更新预收货清单审批信息
 */
export const submitPrepareReceipt = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/submitPrepareReceiptList`,
    data
  });
};

/**
 * 执行采购——预收货清单管理
 * 展示预收货清单项的详细批次信息
 */
export const batchNumberFallInfo = (itemUuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlistitem/v1/queryPreItemBatch?itemUuid=${itemUuid}`
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 查询预收货清单父项和批次信息，根据清单id
 */
export const batchNumberList = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/queryPreById/${id}`
  });
};

/**
 * 执行采购——预收货清单管理
 * 选中调拨单子项，拆成单包数据组成预收货批次创建列表
 */
export const searchRequisitionItem = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/faItemConvertToPreBatch`,
    data
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 查询物料的供应商信息
 */
export const findmaterialCode = (materialCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `material/v1/materials/queryMaterialSupplier?materialCode=${materialCode}`
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 根据id删除一个附件
 */
export const deleteUploadFile = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/${id}`,
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 根据uuid和附件类型，查询所有的附件
 */
export const searchUploadFiles = (uuid, type) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/attachments/search?uuid=${uuid}&type=${type}`,
  });
};

/**
 * New
 * 执行采购——预收货清单管理
 * 更新预收货清单上传箱单数量
 */
export const updatePackingQuantity = (prepareReceiptCode, quantity) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_SCM_URL + `preparereceiptlist/v1/updatePackingListQuantity?prepareReceiptCode=${prepareReceiptCode}&quantity=${quantity}`,
  });
};

/**
 * 执行采购——首付款申请
 * 分页查询首付款申请单
 */
export const downPaymentList= (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/downpayments/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——首付款申请
 * 新增首付款申请单
 */
export const addDownPayment= (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/downpayments`,
    data
  });
};

/**
 * 执行采购——首付款申请
 * 删除首付款申请单的一行
 */
export const deleteDownPayment = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/downpayments/${id}`,
  });
};

/**
 * 执行采购——首付款申请
 * 提交首付款单到BPM
 */
export const submitDownPayment = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/submitdownpaymenttobpm?id=${id}`
  });
};

/**
 * 执行采购——首付款申请
 * 是否可以发起首付款
 */
export const initDownPayment = (purchaseOrderId) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/submitornot?purchaseOrderId=${purchaseOrderId}`
  });
};

/**
 * 获取uuid
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

/**
 * 执行采购——首付款申请
 * 根据id查询首付款申请单
 */
export const searchDownPayment = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `downpayment/v1/downpayments/${id}`
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
 * 执行采购——预收货清单
 * 根据uuid集合下载选中调拨单项
 */
export const exportExcel = (uuids) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `allocation/v1/exportPhpExcel?uuids=${uuids}`
  });
};
/**
 * 执行采购——预收货清单
 * 根据发票号查询发票详情和箱单列表
 */
export const factoryInvoice = (factoryInvoice) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `factoryInvoice/v1/queryInvoiceAndPackingList/${factoryInvoice}`
  });
};

/**
 * NEW
 * 执行采购——采购请求
 * 根据uuid查询采购申请项
 */
export const searchPurchaseRequest = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchaserequestitem/v1/purchaserequestitems/getPrisByUuids`,
    data
  });
};

/**
 * 执行采购——货妥管理
 * 根据工厂确认书号查询采购订单号批量
 */
export const searchPOCodeByConfirmNumber = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchPONumberByCodeFetch`,
    data
  });
};

/**
 * 执行采购——货妥管理
 * 根据PO号和物料集合查询明细
 */
export const searchPOItemByPOAndMaterial = (poId, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorderitem/v1/searchPOItemByPOAndMaterial?poId=${poId}`,
    data
  });
};

/**
 * 执行采购——工厂确认
 * 根据确认书号和物料号查询PO单号和PO行号
 */
export const searchPOInfoByPOAndCN = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/searchConfirmNumberByPoAndConfirm`,
    data
  });
};

/**
 * 执行采购——工厂确认
 * 查出采购订单和订单下所有货妥清单
 */
export const searchCargoReadyByPO = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/queryOrderCargoReadyList`,
    data
  });
};

/**
 * 执行采购——工厂确认
 * 批量货妥查询专用
 */
export const searchFCUUIDByPOCN = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `scm/v1/factoryconfirmitems/selectByConfirmPOLineNum`,
    data
  });
};

/**
 * 撤销采购订单子项
 */
export const revokePurchaseOrderItem = (uuid,cancelRemark) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/cancelPurchaseOrderItem?uuid=${uuid}&cancelRemark=${cancelRemark}`,
  });
};

/**
 * 执行采购——首付款申请
 * 首付款发起
 */
export const purchaseOrderConfirmList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_OMS_URL + `purchaseorder/v1/purchaseorderAndItems/searchsearchForFactoryConfirm?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 执行采购——采购请求
 * 采购删除审批通过PR子项（方便采购人员查看）
 */
export const purchaseDeletePri = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `purchaserequest/v1/purchaseDeletePri?uuid=${uuid}`
  });
};

/**
 * 执行采购——采购订单
 * 批量查询价单价格
 */
export const batchPriceByMaterialCode = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `purchasepricelist/v1/batchQueryPrice`,
    data
  });
};
/**
 * 新增或修改
 */
export const addOrUpdate = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `preCourier/v1/addOrUpdate`,
    data
  });
};

/**
 * 货妥批量删除
 */
export const getBatchDeletion = (purchaseOrderId) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL + `cargoreadylist/v1/removeReadylistByPoid?purchaseOrderId=${purchaseOrderId}`
  });
};
