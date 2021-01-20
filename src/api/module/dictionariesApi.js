import http from "../http";
import axios from "axios";
/**
 * 数据字典服务接口
 */
/**
 * 请求类型
 */
export const getrequesttype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=PurchaseOrderType`
  });
};



/**
* 仓位类型调取
*/
export const warehousequesttype = () => {
return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=VirtualInventory`
});
};


/**
 * 预留类型
 */
export const getreservedtype = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=ReservedType`
  });
};



/**
 * 产品品类
 */
export const fabrictypeProductCategory = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductCategory`
  });
};

/**
 * 产品季/产品特性
 */
export const fabrictypeProductSeason = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductSeason`
  });
};


/**
 * 采购计量单位
 */
export const fabrictypeSaleUnit = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=SaleUnit`
  });
};


/**
 * 物料类型
 */
export const fabrictypeMaterialType = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialType`
  });
};


/**
 * 颜色
 */
export const fabrictypeProductcolor = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=Color`
  });
};



/**
 * 花型
 */
export const fabrictypeProductpattern = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=FlowerPattern`
  });
};

/**
 * 物料组
 */
export const fabrictypeProductmaterialGroup = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialCode`
  });
};

/**
 * 物料ABC分类
 */
export const fabrictypeMaterialABCClass = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialABCClass`
  });
};

/**
 * 品牌
 */
export const fabrictypeMaterialCode= () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=Brand`
  });
};


/**
 * 物料系列
 */
export const fabrictypeMaterialSeries= () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialSeries`
  });
};

 
/**
 * 物料属性
 */
export const fabrictypeMaterialproperties= () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialProperties`
  });
};

/**
 * 物料分类
 */
export const fabrictypeMaterialClass = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialClass`
  });
};

/**
 * 组合物料分类
 */
export const fabricCompositeMaterial = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=CombinedMaterialClass`
  });
};

/**
 * 计量单位
 */
export const fabrictypeMaterialUnit = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=MaterialUnit`
  });
};

/**
 * 销售季
 */
export const fabrictypeSaleSeasou = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=SaleSeasou`
  });
};

//位置

export const fabrictypePosition = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=Position`
  });
};

/**
 * 物料状态
 */
export const materialStatusList = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductStatus`
  });
};

/**
 * 产品类型
 */
export const fabrictypeProductType = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductType`
  });
};

/**
 * 产品分类
 */
export const fabrictypeProductClass = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductClass`
  });
};

/**
 * 时尚度
 */
export const fabrictypeProductFashionDegree = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductFashionDegree`
  });
};

/**
 * 业务分类
 */
export const fabrictypebusiCategory = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=BusinessType`
  });
};


/**
 * 产品区分
 */
export const fabrictypeProductDistinguish = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=ProductDistinguish`
  });
};


/**
 * 付款状态
 */
export const paymentStatus = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=PaidStatus`
  });
};

/**
 * 货妥记录--付款方式
 */
export const fabricPaymentMethod = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=paymentMethod`
  });
};

/**
 * 尾款--付款状态
 */
export const finalPaymentMethod = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=PaymentStatus`
  });
};


/**
 * 节假日管理--节假日名称
 */
export const fabrictypeHoliday = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=holiday`
  });
};


/**
 * 是否可供
 */
export const materialSupplyType = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=MaterialSupplyType`
  });
};


/**
 * 主数据管理--字典提供
 */
export const fabrictypedictionaries = (index) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=${index}`
  });
};

/**
 * 主数据管理--字典提供
 */
export const fabrictypedictionariesUncons = (index) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/dicts?dictIndex=${index}`
  });
};

