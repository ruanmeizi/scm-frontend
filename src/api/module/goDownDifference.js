import http from "../http";
import axios from "axios";

/**
 * 异常处理
 * 分页查询异常处理调拨单和子项
 */
export const goDownDifferenceList = (currentPage, pageSize, data) => {
    return http({
        method: "post",
        url: process.env.VUE_APP_SCM_URL + `scm/v1/diffins/search?currentPage=${currentPage}&pageSize=${pageSize}`,
        data
    });
};

/**
 * 主数据管理--字典提供
 */
export const fabrictypedictionaries = (index) => {
    return http({
        method: "get",
        url: process.env.VUE_APP_INFRASTRUCTURE_URL + `/infrastructure/v1/constants/dicts?dictIndex=${index}`
    });
};

export const updateDiffInType = (id) => {
    return http({
        method: "post",
        url: process.env.VUE_APP_SCM_URL + `scm/v1/diffinitems/updateDiffInType/${id}`
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