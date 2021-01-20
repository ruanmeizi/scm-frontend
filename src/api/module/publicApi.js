import http from "../http";
import axios from "axios";

/**
 * 获取UUID
 */
export const getUUID = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/getUUID`,
  });
};

/**
 * 获取图片路径（通用）
 */
export const getUserimg = (uuid, type) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `infrastructure/v1/attachments/search?uuid=${uuid}&type=${type}`
  });
};