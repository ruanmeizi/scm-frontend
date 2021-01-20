import http from "../http";

/**
 * 获取部门列表
 * 
 */
export const getUserinfo = (realm, username) => {
  let data = {};
  return http({
    method: "post",
    url: process.env.VUE_APP_UDB_URL + `user/queryUserByUsername?realmName=${realm}&username=${username}`,
    data
  });
};