import http from "../http";

/**
 * 获取菜单列表
 * 
 */
export const getMenus = (system, roles) => {
  let data = {system: system, roles : roles};
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/menus/searchbyroles`,
    data
  });
};