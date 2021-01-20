import http from "../http";

/**
 * 获取职业装在库库销比的链接
 * 
 */
export const getZyzZaiKuxiaobi = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/zaiku?fromDate=${from}&toDate=${to}`
  });  
};
// 查询职业装总备货量库销比
export const getZyzKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/bhl?fromDate=${from}&toDate=${to}`
  });  
};
/**
 * 获取职业装在库库销比变化率
 * 
 */
export const getZyzZaiKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/zaikubhl?fromDate=${from}&toDate=${to}`
  });  
};

/**
 * 获取职业装总库销比的链接
 * 
 */
export const getZyzZongKuxiaobi = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/zong?fromDate=${from}&toDate=${to}`
  });  
};

/**
 * 获取职业装总库销比变化率
 * 
 */
export const getZyzZongKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/zongbhl?fromDate=${from}&toDate=${to}`
  });  
};










/**
 * 获取零剪在库库销比的链接
 * 
 */
export const getLjZaiKuxiaobi = (from, to ,height) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/zaiku?fromDate=${from}&toDate=${to}&height=${height}`
  });  
};

/**
 * 获取零剪在库库销比变化率
 * 
 */
export const getLjZaiKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/zaikubhl?fromDate=${from}&toDate=${to}`
  });  
};

/**
 * 获取零剪总库销比的链接
 * 
 */
export const getLjZongKuxiaobi = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/zong?fromDate=${from}&toDate=${to}`
  });  
};

/**
 * 获取零剪总库销比变化率
 * 
 */
export const getLjZongKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/zongbhl?fromDate=${from}&toDate=${to}`
  });
};


/**
 * 获取总库销比的链接
 * 
 */
export const getZongKuxiaobi = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zong/zong?fromDate=${from}&toDate=${to}`
  });  
};

/**
 * 获取零剪总库销比变化率
 * 
 */
export const getZongKuxiaobiBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zong/bhl?fromDate=${from}&toDate=${to}`
  });
};

// 查询零剪总备货量库销比
export const getLjzongBhl = (from, to , height) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/bhl?fromDate=${from}&toDate=${to}&height=${height}`
  });
};

//查询总在库库销比
export const getzongBhl = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zong/zaika?fromDate=${from}&toDate=${to}`
  });
};
//断货率
export const getDuanhuolv = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/duanhuolv/lj?fromDate=${from}&toDate=${to}`
  });
};
//滞销库存
export const getZhixiaokucun = (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/zhixiaokucun?fromDate=${from}&toDate=${to}`
  });
};
//零剪在库库销比同比
export const getLjTongbi= (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/lj/tongbi?fromDate=${from}&toDate=${to}`
  });
}
//职业装在库库销比同比
export const getZyzTongbi= (from, to) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_SCM_URL + `supplyanalysis/v1/kuxiaobi/zyz/tongbi?fromDate=${from}&toDate=${to}`
  });
}