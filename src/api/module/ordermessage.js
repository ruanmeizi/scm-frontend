import http from "../http";
import axios from "axios";
/**
 * 城市
 */

//export const citymanagement = () => {
//return http({
//  method: "post",
//  url: `/region/v1/queryProvince`
//});
//};

/**
 * 翻页查询订单包信息(订单查询)
 */
export const ordermanagement = (currentPage,pageSize,data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_ORDERLIST_URL+`order/v1/order/getOrderList?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 根据订单ID， 查询所有订单列表（订单查询子项信息）
 */
export const orderlistdetails = (docEntry) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_ORDERLIST_URL+`order/v1/order/getOrderRow?docEntry=${docEntry}`,
  });
};

/**
 * 翻页查询订单包信息（被代采订单查询）
 */
export const generationmining = (currentPage,pageSize,data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_ORDERLIST_URL+`order/v1/order/getAgentOrderList?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};

/**
 * 根据订单ID， 查询所有订单列表（被代采订单子项查询）
 */
export const generationdetails = (docEntry,cardCode) => {
return http({
    method: "get",
    url: process.env.VUE_APP_ORDERLIST_URL+`order/v1/order/getAgentOrderRow?docEntry=${docEntry}&cardCode=${cardCode}`,
});
};


/**
 * 订单管理导出订单
 */
export const exportorders = (startDate,endDate,codebars,type) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_ORDERLIST_URL+`order/getOrderExcel/?startDate=${startDate}&endDate=${endDate}&codebars=${codebars}&type=${type}`
  });
};