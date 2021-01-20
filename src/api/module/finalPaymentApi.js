import http from "../http";
import axios from "axios";

/**
 * 尾款付款申请接口API调用
 */

/**
   * @description 获取uuid
   */
export const purchasegetuuid = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};


/**
 * 获取图片信息
 */
export const getUserimg = (uuid, type) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `infrastructure/v1/attachments/search?uuid=${uuid}&type=${type}`
  });
};

/**
   * @description 分页查询尾款列表
   * @param data 需要存的值
   * @param currentPage 展示页码
   * @param pageSize 展示条数
   */
export const finalPaymentSerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/searchFinalPayments?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
   * @description 保存和提交审批
   * @param data 需要存的值
   * @param submitType提交类型（1 草稿 2 审批中）
   */
export const finalPaymentsave = (submitType,data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/saveRequestFinalPayments?submitType=${submitType}`,
    data
  });
};


/**
   * @description 尾款付款发起子项删除
   * @param id 删除的id值
   */
export const finalPaymentchilddel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/removeFinalPaymentsById/${id}`
  });
};


/**
   * @description 尾款付款发起父项删除
   * @param finalPaymentCode 申请尾款单编码
   */
export const finalPaymentdel = (data) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/removeFinalPaymentsByIds`,
    data
  });
};


/**
   * @description 尾款付款发起父项外侧提交审批
   * @param data 子项id拼接数组
   */
export const finalDraftoutSave = (finalPaymentCode) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/submitApproval?finalPaymentCode=${finalPaymentCode}`
  });
};



/**
   * @description 尾款付款草稿编辑调取接口
   * @param data 子项id拼接数组
   */
  export const finalUpddata = (finalPaymentCode,auditStatus) => {
    return http({
      method: "post",
      url: process.env.VUE_APP_SCM_URL+`finalpayment/v1/queryFinalPayment?finalPaymentCode=${finalPaymentCode}&auditStatus=${auditStatus}`
    });
  };
  
