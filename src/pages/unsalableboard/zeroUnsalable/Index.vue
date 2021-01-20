<template>
  <div class="container zeroUnsalable">
    <div class="commoncontent">
      <!--<p>非在库产品预售看板</p>-->
      <div class="actions_part clearfix">
        <div class="actions_wrap">
          <div class="inline_block mr10 mb10">
            <span class="tag">供应商：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="supplierCode"
              filterable
              placeholder="请选择"
              @change="searchclick">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in supplierList"
                :key="item.supplierId"
                :label="item.supplierCode"
                :value="item.supplierId">
              </el-option>
            </el-select>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">销售季：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="saleSeasou"
               @change="searchclick"
              placeholder="请选择销售季">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in SaleSeasoutypelist"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div>
          <!-- <div class="display_ib mr10 mb10">
            <span class="tag">物料属性：</span>
            <el-select
              class="select_single w200 mr10"
              v-model="materialAttribute"
               @change="searchclick"
              placeholder="请选择物料属性">
              <el-option key label="全部" value></el-option>
              <el-option
                v-for="item in MaterialPropertiestypelist"
                :key="item.index"
                :label="item.name"
                :value="item.index"
              ></el-option>
            </el-select>
          </div> -->
          <div class="display_ib mr10 mb10">
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model="materialCode" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">时间：</span>
            <el-date-picker
              v-model="value1"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchclick"
          ></el-button>
          <!--<el-button size="small" type="primary" icon="el-icon-download" circle title="下载"></el-button>-->
        </div>
      </div>
      <div class="container_table table_part clearfix mt20 w100p" style>
        <singleTable
          :tableList="notinthewareList"
          :tableLeaderFieldsList="leaderFieldsList"
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          :tableLoading="tableLoading"
        ></singleTable>
        <!--<table class="contenttab" cellpadding="0" cellspacing="0">
			    	<thead>
			    		<th>物料编号</th>
			    		<th>物料系统编号</th>
			    		<th>产品编号</th>
			    		<th>产品系统编号</th>
			    		<th>物料属性</th>
			    		<th>总滞销数量</th>
			    		<th>在库滞销</th>
			    		<th>在厂滞销</th>
			    		<th>销售季</th>
			    		<th>工厂快货</th>
			    		<th>产品生命周期</th>
			    		<th>剩余生命周期预测销量</th>
			    		<th>近一年销量</th>
			    		<th>备货总量</th>
			    		<th>在库</th>
			    		<th>在途</th>
			    		<th>在厂成品</th>
			    		<th>在厂在产</th>
			    	</thead>
			    	<tbody>
			    		<tr v-for="(item,index) in notinthewareList">			    			
			    			<td :title="item.materialCode">
			    				<span>{{item.materialCode}}</span>			    				
			    			</td>
			    			<td :title="item.insideCode">
			    				<span>{{item.insideCode}}</span>			    											
			    			</td>
			    			<td :title="item.productCode">			    				
			    				<span>{{item.productCode}}</span>
			    			</td>
			    			<td :title="item.interiorCode">
			    				<span>{{item.interiorCode}}</span>			    				
			    			</td>
			    			<td :title="item.materialPropertiesname">
			    				<span>{{item.materialPropertiesname}}</span>			    				
			    			</td>
			    			<td :title="item.totalQuantity">
			    				<span>{{item.totalQuantity}}</span>			    				
			    			</td>
			    			<td :title="item.unsalableQuantity">
			    				<span>{{item.unsalableQuantity}}</span>			    				
			    			</td>
			    			<td :title="item.factoryUnsalableQuantity">
			    				<span>{{item.factoryUnsalableQuantity}}</span>			    				
			    			</td>
			    			<td :title="item.saleSeasouname">
			    				<span>{{item.saleSeasouname}}</span>			    				
			    			</td>
			    			<td :title="item.mobileGoods">
			    				<span v-if="item.mobileGoods==null">{{item.mobileGoods}}</span>
			    				<span v-else>{{item.mobileGoods==true?'是':'否'}}</span>			    				
			    			</td>
			    			<td :title="item.productCycle">
			    				<span v-if="item.productCycle==null">{{item.productCycle}}</span>		
			    				<span v-else>{{item.productCycle}}天</span>
			    			</td>
			    			<td :title="item.remainingLifeCycle">
			    				<span>{{item.remainingLifeCycle}}</span>			    				
			    			</td>
			    			<td :title="item.annualSalesVolume">
			    				<span>{{item.annualSalesVolume}}</span>		    				
			    			</td>
			    			<td :title="item.totalStock">
			    				<span>{{item.totalStock}}</span>
			    			</td>
			    			<td :title="item.inStockInventory">
			    				<span>{{item.inStockInventory}}</span>	
			    			</td>
			    			<td :title="item.shippmentInventory">
			    				<span>{{item.shippmentInventory}}</span>	
			    			</td>
			    			<td :title="item.inFactoryInventory">
			    			    <span>{{item.inFactoryInventory}}</span>		    				
			    			</td>
			    			<td :title="item.inProduceInventory">
			    			    <span>{{item.inProduceInventory}}</span>	
			    			</td>
			    		</tr>
			    	</tbody>
        </table>-->

        <div class="paging" style="margin-top: 20px;float:right;height: 30px;">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10,50]"
              :page-size="pageSize"
              layout="sizes,total, prev, pager, next"
              :total="this.allpage"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { businessunsserch, fabrictypeMaterialproperties, fabrictypeSaleSeasou,supplierDictList} from "@/api/module/unsboardApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
export default {
  name: "zeroUnsalable",
  data() {
    return {
      tableLoading:true,
      materialCode: "",
      value1: "",
      pageSize: 10, //每页显示多少条
      size: "",
      allpage: 0,
      currentPage: 1, //页数
      activeName: "first",
      activeNameagain: "first",
      saleSeasou: "",
      materialAttribute: "",
      notinthewareList: [],
      notinthewareList: [],
      supplierCode:'',
      // New
      leaderFieldsList: [
        {
          name: "物料编号",
          field: "materialCode",
          class: "w50p",
          width: "150"
        }
      ],
      fieldsList: [
        {
          name: "供应商",
          field: "supplierName",
          width: "150"
        },
        {
          name: "产品编码",
          field: "productCode",
          width: "150"
        },
        // {
        //   name: "产品系统编码",
        //   field: "interiorCode",
        //   width: "150"
        // },
        // {
        //   name: "物料属性",
        //   field: "materialPropertiesname",
        //   width: "150"
        // },
        {
          name: "总滞销数量",
          field: "unsalableTotalQuantity",
          width: "150"
        },
        {
          name: "在库滞销",
          field: "unsalableAvailableQuantity",
          width: "150"
        },
        {
          name: "在厂滞销",
          field: "unsalebleInfactoryQuantity",
          width: "150"
        },
        {
          name: "销售季",
          field: "saleSeason",
          width: "150"
        },
        {
          name: "工厂季",
          field: "factorySeason",
          width: "150"
        },
        {
          name: "工厂快货",
          field: "isQuickGoods",
          width: "150"
        },
        {
          name: "生命周期",
          field: "lifeCycle",
          width: "150"
        },
        {
          name: "剩余生命周期预测销量",
          field: "remainTimePredictQuantity",
          width: "200"
        },
        {
          name: "近一年销量",
          field: "pastYearQuantity",
          width: "150"
        },
        {
          name: "备货总量",
          field: "stockUpTotal",
          width: "150"
        },
        {
          name: "在库",
          field: "availableQuantity",
          width: "150"
        },
        {
          name: "在途",
          field: "shipmentQuantity",
          width: "150"
        },
        {
          name: "在厂成品",
          field: "finishedQuantity",
          width: "150"
        },
        {
          name: "在厂在产",
          field: "inproduceQuantity",
          width: "150"
        }
      ],
      SaleSeasoutypelist: [],
      MaterialPropertiestypelist: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      supplierList: [],
    };
  },
  components: { singleTable },
  created() {},
  mounted() {
    var day = new Date();
    day.setTime(day.getTime());
    var s2 = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
    this.value1 = s2;
    this.getMaterialproperties();
    this.getSaleSeasou();
    this.notintheWareHouseSearch();
    this.getSupplierDictList();
  },
  watch: {},
  methods: {
    //列表分页
    notintheWareHouseSearch() {
      this.tableLoading=true;
      var time=this.value1.split('-');
      if(time[1]<10){
        time[1]=0+time[1];
      }
      var saleSeason=time[0]+'-'+time[1]
      let obj = {
        materialCode: this.materialCode,
        supplierId:this.supplierCode,
        saleSeason: this.saleSeasou,                    
        materialAttribute: this.materialAttribute,
        monthNum: saleSeason,
        businessType:'2'
      };
      businessunsserch(this.currentPage, this.pageSize, obj).then(response => {
        if (response.code === "0") {
          this.allpage = response.data.total;
          this.notinthewareList = response.data.records;
          // for (var i = 0; i < this.notinthewareList.length; i++) {
          //   let item = this.notinthewareList[i];
          //   if (item.mobileGoods == true) {
          //     item.mobileGoods = "是";
          //   } else {
          //     item.mobileGoods = "否";
          //   }
          //   if (item.productCycle != null && item.productCycle != "") {
          //     item.productCycle = item.productCycle + "天";
          //   }
          //   if (item.saleSeasouList.length != 0) {
          //     var a = [];
          //     for (var s = 0; s < item.saleSeasouList.length; s++) {
          //       let sitem = item.saleSeasouList[s];
          //       for (var j = 0; j < this.SaleSeasoutypelist.length; j++) {
          //         let aitem = this.SaleSeasoutypelist[j];
          //         if (sitem == aitem.index) {
          //           a.push(aitem.name);
          //         }
          //       }
          //     }
          //     item.saleSeasouname = a.join(",");
          //   }
          //   if (item.materialProperties != null) {
          //     for (var b = 0; b < this.MaterialPropertiestypelist.length; b++) {
          //       let bitem = this.MaterialPropertiestypelist[b];
          //       if (item.materialProperties == bitem.index) {
          //         item.materialPropertiesname = bitem.name;
          //       }
          //     }
          //   }
          // }
          this.tableLoading=false;
        } else {
          this.tableLoading=false;
        }
      });
      setTimeout(() => {
        this.tableLoading=false;
      }, 10000);
    },
    getMaterialproperties() {
      fabrictypeMaterialproperties().then(response => {
        if (response.code === "0") {
          this.MaterialPropertiestypelist = response.data;
        }
      });
    },
    getSaleSeasou() {
      fabrictypeSaleSeasou().then(response => {
        if (response.code === "0") {
          this.SaleSeasoutypelist = response.data;
        }
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },

    //搜索
    searchclick() {
      this.notintheWareHouseSearch();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.notintheWareHouseSearch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.notintheWareHouseSearch();
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.mr {
  margin-right: 10px;
}
.zeroUnsalable {
  border-radius: 6px;
  /*padding: 10px 15px;*/
  background: #ffffff;
}
.calendar-day {
  text-align: center;
  color: #202535;
  line-height: 20px;
  font-size: 12px;
}
.is-selected {
  color: #f8a535;
  font-size: 10px;
  margin-top: 5px;
}
#calendar .el-button-group > .el-button:not(:first-child):not(:last-child):after {
  content: "当月";
}
ul.formlist {
  width: 100%;
  height: 40px;
  display: flex;
  /*border-bottom: 1px solid #EBEEF5;*/
  li {
    /*border-bottom: 1px solid #C0C0C0;*/
  }
  li:last-child {
    /*border-bottom: none;*/
  }
}
table.contenttab th {
  padding: 10px 3px;
}
table.contenttab {
  tbody {
    tr {
      td {
        font-size: 14px;
        color: #606266;
        span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 50px;
          display: inline-block;
        }
      }
      td:nth-child(1) {
        span {
          width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
      }
      td:nth-child(2),
      td:nth-child(3) {
        span {
          width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
      }
    }
  }
}
</style>
<style>
button.el-popover__reference {
  font-size: 14px;
  color: #606266;
}
</style>