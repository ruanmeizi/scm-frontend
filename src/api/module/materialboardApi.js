import http from "../http";
import axios from "axios";


/**
 * 职业装/零剪-分页查询职业装
 */
export const businessserch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/materialinventorys/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 非在库产品预售-分页查询
 */
export const notinthewareserch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchadvancesalesbypage/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};



/**
 * 坯布和纱线-分页查询
 */
export const greyclothandsearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchgreyclothandyarn/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};



/**
 * 新品看板-分页查询
 */
export const newboardsearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchnewproductsbypage/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 职业装非在库-分页查询
 */
export const nothingboardsearch = (currentPage, pageSize, data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/reservedashboard/search?currentPage=${currentPage}&pageSize=${pageSize}`,
    data
  });
};


/**
 * 职业装非在库-客订预留详情
 */
export const numberdetails = (materialCode,inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/reservedetail/bymaterialcode?materialCode=${materialCode}&inventory=${inventory}`
  });
};



/**
 * 职业装非在库-成品，在途，在产，询单
 */
export const nothingonethewaydetails = (materialCode,inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/planreserveitems?materialCode=${materialCode}&inventory=${inventory}`
  });
};

/**
 * 职业装非在库-可用备货总量
 */
export const nothsubsequentdetails = (materialCode,inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/subsequentreadyall?materialCode=${materialCode}&inventory=${inventory}`
  });
};


/**
 * 零剪非在库-物料编码
 */
export const nothmaterialdetails = (materialCode,inventory) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/reservedetail/materialcodedetail?materialCode=${materialCode}&inventory=${inventory}`
  });
};




/**
 * 备货总量看板-延期交货
 */
export const backorderdetails = (materialCode,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/querynumberofdelaytimes/search?materialCode=${materialCode}&productCode=${productCode}`
  });
};



/**
 * 职业装/零剪-在库可用库存详情
 */
export const availabledetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchmaterialavailablestock/search`,
    data
  });
};


/**
 * 新品看板-在库可用库存详情
 */
export const newavailabledetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchnewproductavailablestock/search`,
    data
  });
};


/**
 * 非在库产品预售-在库可用库存详情
 */
export const instockdetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachnotavailableinstock/search`,
    data
  });
};


/**
 * 职业装-物料编号详情
 */
export const meterialdetails = (materialCode,detailType,validDate,productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachmaterialbymaterialcode/search?materialCode=${materialCode}&detailType=${detailType}&validDate=${validDate}&productCode=${productCode}`
  });
};


/**
 * 非在库产品预售看板-产品编号详情
 */
export const productdetails = (productCode,detailType,validDate) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachnonlibraryproduct/search?productCode=${productCode}&detailType=${detailType}&validDate=${validDate}`
  });
};


/**
 * 新品看板-产品编号详情
 */
export const productcodedetails = (productCode,detailType,validDate) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/fetchproductcode/search?productCode=${productCode}&detailType=${detailType}&validDate=${validDate}`
  });
};


/**
 * 职业装-后续备货总量
 */
export const subsequentdetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachsubsequentready/search`,
    data
  });
};



/**
 * 职业装-预计入库量
 */
export const scheduleddetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachscheduledreceipt/search`,
    data
  });
};



/**
 * 职业装-在途
 */
export const onthewaydetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachesontheway/search`,
    data
  });
};

/**
 * 职业装-在厂
 */
export const inFactorydetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachinproduceinventory/search`,
    data
  });
};


/**
 * 非在库产品预售看板-确认书
 */

export const confirmnumbersdetails = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/feachconfirmnumbers/search`,
    data
  });
};

/**
 * 产品库存看板
 * 新增组成产品编号过滤式
 */
export const productboardCode = (productCode) => {
  return http({
    method: "get",
    url: process.env.VUE_APP_PRODUCT_URL+ `product/v1/products/productcodes?productCode=${productCode}`
  });
};

/**
 * 销售季
 */
export const fabrictypeSaleSeasou = () => {
  return http({
    method: "get",
    url: process.env.VUE_APP_INFRASTRUCTURE_URL+ `/infrastructure/v1/constants/dicts?dictIndex=FactorySeason`
  });
};

/**
 * 物料/产品 -职业装/零剪常规看板：预留详情
 */
export const searchReserveDetail = (data) => {
  return http({
    method: "post",
    url: process.env.VUE_APP_INVENTORY_URL +`materialbusinesssuits/v1/searchReserveDetail`,
    data
  });
};
