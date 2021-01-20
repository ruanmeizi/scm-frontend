import http from "../http";
import axios from "axios";

/**
 * 分页展示产品织标关系列表
 * 
 */
export const wovenLableList = (currentPage, pageSize, data) => {
    return http({
      method: "post",
      url: process.env.VUE_APP_PRODUCT_URL + `productlabel/v1/productlabel/search?currentPage=${currentPage}&pageSize=${pageSize}`,
      data
    });
};

/**
 * 删除产品织标根据行id
 * 
 */
export const removeWovenLable = (id) => {
    return http({
      method: "delete",
      url: process.env.VUE_APP_PRODUCT_URL + `productlabel/v1/productlabel/${id}`,
    });
};

/**
 * 编辑提交
 */
export const updateWovenById = (data) => {
  return http({
    method: "put",
    url: process.env.VUE_APP_PRODUCT_URL+ `productlabel/v1/productlabel/updateById`,
    data
  });
};

/**
 * 保存产品织标
 * 
 */
export const wovenAddBatch = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_PRODUCT_URL + `productlabel/v1/productlabel/addBatch`,
    data
  });
};