import http from "../http";
import axios from "axios";
/**
 * 常量数据字典
 */
export const constDictList = (dictIndex) => {
    return http({
        method: "get",
        url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${dictIndex}`,
    });
};
/**
 * 消息处理管理表格
 */
export const deadMessageSelect = (currentPage, pageSize, data) => {
    return http({
        method: "post",
        url: process.env.VUE_APP_SCM_URL + `deadMessage/rabbitMQ/v1/select?currentPage=${currentPage}&pageSize=${pageSize}`,
        data
    });
};

/**
 * 重新发送
 */
export const deadMessageSend= (id) => {
    return http({
      method: "get",
      url: process.env.VUE_APP_SCM_URL+`deadMessage/deadMessage/v1/send/${id}`,
    });
  };