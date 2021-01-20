import http from "../http";
import axios from "axios";


/**
 * 分页查询字典项
 */
export const dictionarychildSerch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+`/infrastructure/v1/dictitems/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 父向展示table列表
 */
export const dictionarySerch = (currentPage, pageSize,data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dictindexs/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
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
 * 新增子项展示table列表
 */
export const dictionarychildadd = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dictitems`,
    data
  });
};


/**
 * 修改子项展示table列表
 */
export const factorychildupd = (id,data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `scm/v1/factoryconfirmitems/${id}`,
    data
  });
};


/**
 * 删除子项列表指定数据
 */
export const dictionarychilddel = (id) => {
  return http({
    method: "delete",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dictitems/${id}`,
  });
};