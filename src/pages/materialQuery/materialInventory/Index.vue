<template>
  <div class="container fabricMaterials">
    <div>
      <div class="actions_part clearfix">
        <div class="actions_wrap">
            <div class="display_ib mr10 mb10">
            <span class="red">*</span>
		        <span class="tag">
              仓位：
            </span>
            <el-select class="select_single w200 mr10"
              v-model="inventory"
              @change="virtualInventoryChange"
              filterable
              placeholder="请选择">
              <!-- <el-option key="" label="全部" value=""></el-option> -->
              <el-option
                v-for="item in inventoryList"
                :key="item.index"
                :label="item.name"
                :value="item.index">
              </el-option>
            </el-select>
		      </div>
          <div class="display_ib mr10 mb10"> 
            <span class="red">*</span>
		        <span class="tag">库位：</span>
            <el-select class="select_single w200 mr10"
              v-model="subInventory"
              filterable
              placeholder="请选择">
              <el-option key="" label="全部" value=""></el-option>
              <el-option
                v-for="item in subInventoryList"
                :key="item.subInventory"
                :label="item.subInventoryName"
                :value="item.subInventory">
              </el-option>
            </el-select>
		      </div>
          <div class="display_ib mr10 mb10">
             <span class="red">*</span>
            <span class="tag">物料编号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="materialCode" placeholder="模糊输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">内部批次号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="batchNo" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">工厂批次号：</span>
            <el-input class="input_single w200 mr10" v-model.trim="factoryBatchNumber" placeholder="请输入"></el-input>
          </div>
          <div class="display_ib mr10 mb10">
            <span class="tag">长度：</span>
            <el-input class="input_single w100 mr10" onkeyup="this.value=this.value.replace(/\D|^/g,'')"  v-model.number="quantityStart" placeholder="请输入"></el-input>米
            <span class="mr10">—</span>
            <el-input class="input_single w100 mr10" onkeyup="this.value=this.value.replace(/\D|^/g,'')" v-model.number="quantityEnd" placeholder="请输入"></el-input>米
          </div>
          
        </div>
        <div class="actions_btn_wrap down t_right">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            circle
            title="搜索"
            @click="searchHandle"
          ></el-button>
        </div>
      </div>

      <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <singleTable
          :tableList='materialInventoryList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          ></singleTable>
        </el-tabs>
        <div class="pagination_wrap fr">
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="this.total">
          </el-pagination> -->
        </div>
      </div>
    </div>
    
   
    
  </div>
</template>

<script>
import {constDictList,subInventoryTypeList} from "@/api/publicApi.js";
import singleTable from "@/layouts/components/common/SingleTable.vue";
import { 
	materialInventorySearch
} from "@/api/module/materialInventoryApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "materialInventory",
  props: [],
  data() {
    return {
      inventory:'职业装仓',
      subInventory:'',
      materialCode:'',
      batchNo:'',
      factoryBatchNumber:'',
      quantityStart:0,
      quantityEnd:100,
      inventoryList:[],
      subInventoryList:[],
      materialInventoryList:[],
      leaderFieldsList: [
      ],
      fieldsList:[
         {
          name:'仓位',
          field:'inventoryName',
          // fabrictype:'fabrictype'
        },
         {
          name:'库位',
          field:'subInventoryName',
          // fabrictype:'fabrictype'
        },
        {
          name:'物料编号',
          field:'materialCode',
        },
         {
          name:'工厂批次号',
          field:'factoryBatchNumber',
        },
        {
          name:'内部批次号',
          field:'batchNo',
        },
         {
          name:'长度',
          field:'quantity',
        },
         {
          name:'可用长度',
          field:'availQuantity',
        },
        {
          name:'单位',
          field:'unit'
        },
      ],
      tailFieldsList:[],
      tableLoading: false
    };
  },
  components: {
    singleTable
  },
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getInventoryList();
    this.virtualInventoryChange('C0');
    // this.getMaterialInventoryList();
  },
  activated() {

  },
  watch: {

  },
  computed: {

  },
  methods: { 	
    getInventoryList() {
      // 仓位
      constDictList('VirtualInventory').then(res => {
        // console.log('仓位列表数据：', res);
        if (res.code === '0') {
          this.inventoryList = res.data;
        }
      });
    },
    async virtualInventoryChange(val) {
      // 仓位更改
      console.log('仓位更改：', val);
      await subInventoryTypeList(val).then(res => {
        console.log('库位列表：', res);
        let outList = [];  // 库位列表数据
        if (res.code === '0') {
          for(var i=0;i<res.data.length;i++){
              let osiData = res.data[i];
              if (!osiData.subInventoryName.includes('工厂库')) {
                outList.push(osiData);
              }
          }
          console.log(outList);
          this.subInventoryList = outList;
          this.$forceUpdate();
        }
      });
    },
  	//获取状态名称
  	typeHandle(status,list) {
  		for(var i=0;i<list.length;i++){
      	let item=list[i];
      	if(item.index==status){
      		return item.name
      	}
      }
    },
    searchHandle() {
      // 搜索
      this.getMaterialInventoryList();
    },
    getMaterialInventoryList() {
    	this.tableLoading = true;
      let data = {
        inventory: this.inventory,
        subInventory:this.subInventory,
        materialCode: this.materialCode,
        batchNo:this.batchNo,
        factoryBatchNumber:this.factoryBatchNumber,
        quantityStart: this.quantityStart,
        quantityEnd: this.quantityEnd
      };
      materialInventorySearch(data).then(res => {
	       console.log('面料物料主数据列表：', res);
	       if (res.code === '0') {
              this.tableLoading = false;
              this.materialInventoryList=res.data;
	       }else{
           this.tableLoading = false;
         }
      });
    }

  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
* {
  box-sizing: border-box;
}
.overflow{
	overflow: hidden;
	text-overflow:ellipsis;
	white-space: nowrap;
}
.red{
	color: #F56C6C;
}
.ml {
	margin-left: 10px;
}
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.fabricMaterials {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  position: relative;
  ul {
    li {
      outline: none;
    }
    &.childcontentlist {
      height: 60px;
      line-height: 40px;
    }
    &.childlist {
      li {
        cursor: pointer;
      }
    }
  }
  .submit_btn {
    position: absolute;
    top: -60px;
    right: 0;
  }
}
.edit_parent_list {
  ul {
    &.childcontentlist {
      height: 120px;
    }
  }
  .edit_btn_wrap{
    margin-top: 20px;
  }
}

.pagination_wrap {
  margin-top: 20px;
}

.check_popup_part {
  ul {
    &.childcontentlist {
      height: 80px;
    }
  }
}

ul {
  &.childcontentlist {
    li {
      /*white-space: normal;*/
     overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }
  }
}

i.el-icon-view {
  font-size: 20px;
  color: #409eff;
  margin-left: 10px;
  cursor: pointer;
}

.form_part {
  .title {
    margin-bottom: 30px;
    padding: 0 20px;
    font-size: 17px;
    color: #606266;
  }
  .demo-ruleForm {
    width: 45%;
  }
}
select.selectstatus {
	width: 200px;
	height: 40px;
	border-radius: 5px;
	border: 1px solid #DCDFE6;
	text-indent: 1em;
	color: #606266;
	line-height: 20px;
	font-size: 14px;
}

select.selectstatus>option {
	font-size: 14px;
}

select.selectstatus {
	background: #FFFFFF;
}
.el-select.selectfabc {
    margin-right: 10px;
}
</style>
<style>
.fabricMaterials label.el-checkbox{
	width: 200px;
}
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
.subnav_wrap .el-tabs__content {
  overflow: visible;
}
.subnav_wrap .checkbox_list .el-checkbox__label {
  width: 100%;
  padding-left: 0;
  color: #606266;
}
.subnav_wrap .checkbox_list .el-checkbox {
  width: 100%;
}
.subnav_wrap .checkbox_list .el-checkbox__input {
  margin-right: 10px;
}
.subnav_wrap ul.el-dropdown-menu li.el-dropdown-menu__item {
  padding: 0 10px;
}

.fabricMaterials .el-form-item__label {
  font-size: 14px;
  color: #606266;
  font-weight: normal;
}
.fabricMaterials .el-form-item__content {
 width: 60%!important;
}
.fabricMaterials .el-input {
  width: auto;
}
.fabricMaterials .whole_long .el-form-item__content {
  width: 65%;
}
.fabricMaterials .whole_long .el-input {
  width: 100%;
}
form.el-form.demo-ruleForm.fl.tag{
	width: 80%;
	.el-form-item {
	    width: 63%!important;
	}
}
.form_part .demo-ruleForm{
    width: 80%;
}


</style>