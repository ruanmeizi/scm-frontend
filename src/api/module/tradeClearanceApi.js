import http from "../http";
import axios from "axios";

/**
 * 贸易通关——进口关税
 * 分页查询贸易通关和子项
 */
export const tradeTariffList = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `tradeTariff/v1/TradeTariff/list?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 删除成品生产申请单和申请项
 */
export const deleteTradeTariff = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `tradeTariff/v1/deleteTradeTariff/${id}`
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
 * 根据父项uuid查询子项
 */
export const searchTradeTariff = (uuid) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `tradeTariffItem/v1/tradeTariffItem/${uuid}`,
  });
};

/**
 * 提交贸易通关到BPM
 */
export const submitTradeTariff = (id) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `tradeTariff/v1/submitTradeTariffToBPM?id=${id}`,
  });
};

/**
 * 新增和修改贸易通关和子项
 */
export const editTradeTariff = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `tradeTariff/v1/tradeTariff/add`,
    data
  });
};

/**
 * 根据品类查询一条历史记录
 */
export const queryTradeTariff = (goodsClass) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `tradeTariffHistory/v1/tradeTariffHistory/${goodsClass}`,
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
 * 工厂发票号查重
 */
export const duplicateInvoiceCode = (invoiceNum) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `tradeTariffItem/v1/tradeTariffItem/selectInvoiceIsExits/${invoiceNum}`
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
 * 常量查询数据字典
 */
export const constDictList = (dictIndex) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
  });
};

/**
 * 根据实际供应商查询所有工厂发票号
 */
export const invoiceNumberInfo = (supplier) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_FINANCEADAPTER_URL + `financeadapter/selectInvoiceNumberBySupplierCode?supplier=${supplier}`
  });
};

/**
 * 根据发票号和供应商查询金额
 */
export const getCostInfo = (invoce, supplier) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_FINANCEADAPTER_URL + `financeadapter/selectCostByPrePareReceiptCode?invoce=${invoce}&supplier=${supplier}`
  });
};

