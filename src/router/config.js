import Layout from "@/layouts/Index.vue";

const routerConfig = [{
    path: "/login",
    component: resolve => require(["@/pages/Login/Index.vue"], resolve)
  },
  {
    path: "/404",
    component: resolve => require(["@/pages/Error/NotFound.vue"], resolve)
  },
  {
    path: '/',
    component: resolve => require(["@/layouts/Index.vue"], resolve),
  },
  {
    path: '/homePage', //首页
    component: resolve => require(["@/layouts/Index.vue"], resolve),
  },
  {
    path: "/",
    component: Layout,
    children: [
      // {
      //   path: "/PR",
      //   component: resolve => require(["@/pages/decisionmaking/PR.vue"], resolve),
      //   name: "PR",
      //   meta: {
      //     title: "申请采购"
      //   }
      // },
      {
        path: "/PR",
        component: resolve => require(["@/pages/PR/Index.vue"], resolve),
        name: "PR",
        meta: {
          title: "申请采购"
        }
      },
      {
        path: "/SCMStrategy",
        component: resolve => require(["@/pages/SCMStrategy/Index.vue"], resolve),
        name: "SCMStrategy",
        meta: {
          title: "供应链策略"
        }
      },
      {
        path: "/purchasePlan",
        component: resolve => require(["@/pages/purchasePlan/Index.vue"], resolve),
        name: "purchasePlan",
        meta: {
          title: "备货计划"
        }
      },
      {
        path: "/appropriationplan",
        component: resolve => require(["@/pages/appropriationplan/Index.vue"], resolve),
        name: "appropriationplan",
        meta: {
          title: "调拨计划"
        }
      },
      {
        path: "/productMarketingPlan",
        component: resolve => require(["@/pages/productMarketingPlan/Index.vue"], resolve),
        name: "productMarketingPlan",
        meta: {
          title: "产品销售预测"
        }
      },
      {
        path: "/materielMarketingPlan",
        component: resolve => require(["@/pages/materielMarketingPlan/Index.vue"], resolve),
        name: "materielMarketingPlan",
        meta: {
          title: "物料销售预测"
        }
      },
      {
        path: "/performpurchase",
        component: resolve => require(["@/pages/performpurchase/Index.vue"], resolve),
        name: "performpurchase",
        meta: {
          title: "执行采购"
        }
      },
      {
        path: "/advanceReceiptManage",
        component: resolve => require(["@/pages/advanceReceiptManage/Index.vue"], resolve),
        name: "advanceReceiptManage",
        meta: {
          title: "预收货清单管理"
        }
      },
      {
        path: "/exceptionSolve",
        component: resolve => require(["@/pages/exceptionSolve/Index.vue"], resolve),
        name: "exceptionSolve",
        meta: {
          title: "异常处理"
        }
      },
      {
        path: "/goDownDifference",
        component: resolve => require(["@/pages/goDownDifference/Index.vue"], resolve),
        name: "goDownDifference",
        meta: {
          title: "入库差异"
        }
      },
      {
        path: "/transferslip",
        component: resolve => require(["@/pages/transferslip/Index.vue"], resolve),
        name: "transferslip",
        meta: {
          title: "调拨"
        }
      },
      {
        path: "/clothProduction",
        component: resolve => require(["@/pages/clothProduction/Index.vue"], resolve),
        name: "clothProduction",
        meta: {
          title: "面料生产"
        }
      },
      {
        path: "/toolProduction",
        component: resolve => require(["@/pages/toolProduction/Index.vue"], resolve),
        name: "toolProduction",
        meta: {
          title: "销售工具生产"
        }
      },
      {
        path: "/finishedProduction",
        component: resolve => require(["@/pages/finishedProduction/Index.vue"], resolve),
        name: "finishedProduction",
        meta: {
          title: "成品生产"
        }
      },
      {
        path: "/setting",
        component: resolve => require(["@/pages/setting/Index.vue"], resolve),
        name: "setting",
        meta: {
          title: "设置"
        }
      },
      {
        path: "/materialboard",
        component: resolve => require(["@/pages/materialboard/Index.vue"], resolve),
        name: "materialboard",
        meta: {
          title: "物料库存看板"
        }
      },
      {
        path: "/productboard",
        component: resolve => require(["@/pages/productboard/Index.vue"], resolve),
        name: "productboard",
        meta: {
          title: "产品库存看板"
        }
      },
      {
        path: "/unsalableboard",
        component: resolve => require(["@/pages/unsalableboard/Index.vue"], resolve),
        name: "unsalableboard",
        meta: {
          title: "滞销库存看版"
        }
      },
      {
        path: "/materialsRemark",
        component: resolve => require(["@/pages/materialsRemark/Index.vue"], resolve),
        name: "materialsRemark",
        meta: {
          title: "物料备注"
        }
      },
      {
        path: "/wovenLabelRelation",
        component: resolve => require(["@/pages/wovenLabelRelation/Index.vue"], resolve),
        name: "wovenLabelRelation",
        meta: {
          title: "产品织标关系"
        }
      },
      {
        path: "/messageSendManage",
        component: resolve => require(["@/pages/messageSendManage/Index.vue"], resolve),
        name: "messageSendManage",
        meta: {
          title: "消息发送管理"
        }
      },
      {
        path: "/messageProcessManage",
        component: resolve => require(["@/pages/messageProcessManage/Index.vue"], resolve),
        name: "messageProcessManage",
        meta: {
          title: "消息处理管理"
        }
      },
      {
        path: "/dictionaryset",
        component: resolve => require(["@/pages/dictionaryset/Index.vue"], resolve),
        name: "dictionaryset",
        meta: {
          title: "字典设置"
        }
      },
      {
        path: "/materialsMainData",
        component: resolve => require(["@/pages/materialsMainData/Index.vue"], resolve),
        name: "materialsMainData",
        meta: {
          title: "物料"
        }
      },
      {
        path: "/purchasePriceList",
        component: resolve => require(["@/pages/purchasePriceList/Index.vue"], resolve),
        name: "purchasePriceList",
        meta: {
          title: "物料采购价单"
        }
      },
      {
        path: "/spotProduct",
        component: resolve => require(["@/pages/spotProduct/Index.vue"], resolve),
        name: "spotProduct",
        meta: {
          title: "现货产品"
        }
      },
      {
        path: "/orderProducts",
        component: resolve => require(["@/pages/orderProducts/Index.vue"], resolve),
        name: "orderProducts",
        meta: {
          title: "订货产品"
        }
      },
      {
        path: "/groupProducts",
        component: resolve => require(["@/pages/groupProducts/Index.vue"], resolve),
        name: "groupProducts",
        meta: {
          title: "集团产品"
        }
      },
      {
        path: "/suppliermanage",
        component: resolve => require(["@/pages/suppliermanage/Index.vue"], resolve),
        name: "suppliermanage",
        meta: {
          title: "供应商管理"
        }
      },
      {
        path: "/productInventoryRules",
        component: resolve => require(["@/pages/productInventoryRules/Index.vue"], resolve),
        name: "productInventoryRules",
        meta: {
          title: "生产规则"
        }
      },
      {
        path: "/reserved",
        component: resolve => require(["@/pages/reserved/Index.vue"], resolve),
        name: "reserved",
        meta: {
          title: "预留"
        }
      },
      {
        path: "/planReserve",
        component: resolve => require(["@/pages/planReserve/Index.vue"], resolve),
        name: "planReserve",
        meta: {
          title: "计划预留"
        }
      },
      {
        path: "/supplychainAnalysis",
        component: resolve => require(["@/pages/supplychainAnalysis/Index.vue"], resolve),
        name: "supplychainAnalysis",
        meta: {
          title: "供应链分析"
        }
      },
      {
        path: "/tradeClearance",
        component: resolve => require(["@/pages/tradeClearance/Index.vue"], resolve),
        name: "tradeClearance",
        meta: {
          title: "贸易通关"
        }
      },
      {
        path: "/searchSpotProduct",
        component: resolve => require(["@/pages/searchSpotProduct/Index.vue"], resolve),
        name: "searchSpotProduct",
        meta: {
          title: "查询现货产品"
        }
      },
      {
        path: "/searchOrderProducts",
        component: resolve => require(["@/pages/searchOrderProducts/Index.vue"], resolve),
        name: "searchOrderProducts",
        meta: {
          title: "查询订货产品"
        }
      },
      {
        path: "/searchGroupProducts",
        component: resolve => require(["@/pages/searchGroupProducts/Index.vue"], resolve),
        name: "searchGroupProducts",
        meta: {
          title: "查询集团产品"
        }
      },
      {
        path: "/searchMaterialsMainData",
        component: resolve => require(["@/pages/searchMaterialsMainData/Index.vue"], resolve),
        name: "materialsMainData",
        meta: {
          title: "查询物料主数据"
        }
      },
      {
        path: "/materialQuery",
        component: resolve => require(["@/pages/materialQuery/Index.vue"], resolve),
        name: "materialQuery",
        meta: {
          title: "物料库存查询"
        }
      },
      {
        path: "/holidaySetting",
        component: resolve => require(["@/pages/holidaySetting/Index.vue"], resolve),
        name: "holidaySetting",
        meta: {
        	
          title: "节假日管理"
        }
      },
      {
        path: "/factoryGoods",
        component: resolve => require(["@/pages/factoryGoods/Index.vue"], resolve),
        name: "factoryGoods",
        meta: {
        	
          title: "工厂快货"
        }
      },
    ]
  },

  {
    path: "*",
    redirect: "/404"
  }
];

export default routerConfig;