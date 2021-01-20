import http from "../http";
import axios from "axios";

/**
 * 查询——物料库存查询
 * 
 */
export const materialInventorySearch = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_SCM_URL + `inventory/v1/MaterialInventory/searchDetail`,
    data
  });
};
