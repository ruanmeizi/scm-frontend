<template>
  <div class="container difference">
    <div class="actions_part clearfix">
    	<div class="actions_wrap">
    		<div class="display_ib mr10 mb10">
          <span class="tag">差异类型：</span>
          <el-select
            class="select_single w200 mr10"
            v-model="differenceType"
            @change="abnormalTypeSector"
            placeholder="请选择差异类型">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in abnormalList"
              :key="item.index"
              :label="item.name"
              :value="item.index">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">预收货编号：</span>
          <el-input class="input_single w200 mr10" v-model="prepareReceiptCode" placeholder="请输入"></el-input>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">供应商：</span>
          <!-- <el-input class="input_single w200 mr10" v-model="supplierCode" placeholder="请输入"></el-input> -->
          <el-select class="select_single w200 mr10"
            v-model="supplierCode"
            filterable
            @change="searchHandle"
            placeholder="请选择">
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
          <span class="tag">物料编号：</span>
          <el-input class="input_single w200 mr10" v-model="sourceMaterialCode" placeholder="请输入"></el-input>
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
      <el-tabs class="subnav_wrap" v-model="activeName" @tab-click="switchTabHandle">
        <el-tab-pane label="到货差异明细" name="All">
           <!-- <Table
            :tableList="exceptionList"
            :parentData="parentData"
            :childData="childData"
            :tableFieldsList="fieldsList"
            :tableParentFieldsList="parentFieldsList">
          </Table> -->
          
          <el-table
            class="table_list"
            ref="multipleTable"
            v-loading="listLoading"
            :data="exceptionList"
            element-loading-text="拼命加载中"
            row-key="id"
            :expand-row-keys="expands"
            @row-click="rowClick"
            border
            fit
            stripe>
            <!-- <el-table-column type="selection" /> -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-table
                  class="table_list"
                  :ref="'childMultipleTable_' + scope.row.id"
                  v-loading="childListLoading"
                  :data="scope.row.ehiList"
                  element-loading-text="拼命加载中"
                  border
                  fit>
                  <!-- <el-table-column fixed type="selection" /> -->
                  <el-table-column fixed label="行号">
                    <template slot-scope="{ row }">
                      {{ row.sn }}
                    </template>
                  </el-table-column>
                  <el-table-column label="供应商名称">
                    <template slot-scope="{ row }">
                      {{ row.supplierName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="物料编号">
                    <template slot-scope="{ row }">
                      {{ row.sourceMaterialCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="产品编号">
                    <template slot-scope="{ row }">
                      {{ row.productMaterialCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="确认书编号">
                    <template slot-scope="{ row }">
                      {{ row.confirmNumbers }}
                    </template>
                  </el-table-column>
                  <el-table-column label="差异类型">
                    <template slot-scope="{ row }">
                      {{ row.differenceType }}
                    </template>
                  </el-table-column>
                  <el-table-column label="工厂批次号">
                    <template slot-scope="{ row }">
                      {{ row.factoryBatchNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="发票数量">
                    <template slot-scope="{ row }">
                      {{ row.batchInvoiceNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库差异单号">
                    <template slot-scope="{ row }">
                      {{ row.inStockExCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库物料编号">
                    <template slot-scope="{ row }">
                      {{ row.inStockMaterialCode }}
                    </template>
                  </el-table-column>
                  <el-table-column label="实际工厂批次号">
                    <template slot-scope="{ row }">
                      {{ row.factoryBatchNumber }}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库数量">
                    <template slot-scope="{ row }">
                      {{ row.inStockQuantity }}
                    </template>
                  </el-table-column>
                  <el-table-column label="差异入库时间">
                    <template slot-scope="{ row }">
                      {{ row.inStockTime }}
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="预收货清单编号">
              <template slot-scope="{ row }">
                {{ row.prepareReceiptCode }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="操作">
              <template slot-scope="{ row, $index }">
                <div v-if="row.prStatus == 'Draft' || row.prStatus == 'Rejected'">
                  <el-button class="el-icon-edit" type="primary" circle size="mini" title="编辑" @click.stop="editHandle($index, row)"></el-button>
                  <el-button class="el-icon-check" type="success" circle size="mini" title="提交审批" @click.stop="submitHandle($index, row)"></el-button>
                  <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                </div>
                <div v-if="row.prStatus == 'Terminated'">
                  <el-button class="el-icon-delete" type="danger" circle size="mini" title="删除" @click.stop="deleteHandle($index, row)"></el-button>
                </div>
              </template>
            </el-table-column> -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="pagination_wrap fr">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 50]"
          :page-size="pageSize"
          layout="sizes, total, prev, pager, next"
          :total="total">
        </el-pagination>
			</div>
    </div>
    
  </div>
</template>

<script>
import { purchasegetuuid } from "@/api/module/purchaseApi.js";
import { exceptionSolveList, abnormalTypeList } from "@/api/module/exceptionApi.js";
import { supplierDictList } from '@/api/publicApi.js';
import { timeFormat } from '@/utils/index.js';
import Table from "@/layouts/components/common/Table.vue";
export default {
  name: "difference",
  props: ['subName'],
  data() {
    return {
      differenceType: '',
      prepareReceiptCode: '',
      supplierCode: '',
      supplierName: '',
      uuid: '',
      sourceMaterialCode: '',
      isAll: '',
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      exceptionList: [],
      abnormalList: [],
      supplierList: [],
      expands:[],
      activeName: 'All',
      //loading
      listLoading: false,
      childListLoading: false,
      fieldsList: [
        {
          name: '行号',
          class: 'w5p'
        },
        {
          name: '供应商名称',
          class: 'w10p'
        },
        {
          name: '物料编号',
          class: 'w9p'
        },
        {
          name: '产品编号',
          class: 'w9p'
        },
        {
          name: '确认书编号',
          class: 'w9p'
        },
        {
          name: '差异类型',
          class: 'w9p'
        },
        {
          name: '工厂批次号',
          class: 'w9p'
        },
        {
          name: '发票数量',
          class: 'w9p'
        },
        {
          name: '入库差异单号',
          class: 'w9p'
        },
        {
          name: '入库物料编号',
          class: 'w9p'
        },
        {
          name: '实际工厂批次号',
          class: 'w9p'
        },
        {
          name: '入库数量',
          class: 'w9p'
        },
        {
          name: '差异入库时间',
          class: 'w9p'
        },
      ],
      parentFieldsList: [  // Table父列表表头
        {
          name: '预收货清单编号',
          class: 'w12p'
        }
      ],
      parentData: {
        status: '',
        data: [
          {
            name: '预收货清单编号',
            field: 'prepareReceiptCode',
            class: 'w12p',
            isShowTit: true
          },
          {
            name: '',
            field: '',
            class: 'fr mr15',
            isShowTit: false,
            isUpDown: true
          },
          {
            name: '',
            field: '',
            class: 'fr',
            isShowTit: false,
            isAction: true
          }
        ]
      },
      childData: {
        name: 'ehiList',
        data: [
          {
            name: '',
            field: 'sn',
            class: 'w5p'
          },
          {
            name: '',
            field: 'supplierName',
            class: 'w10p'
          },
          {
            name: '',
            field: 'sourceMaterialCode',
            class: 'w9p'
          },
          {
            name: '',
            field: 'productMaterialCode',
            class: 'w9p'
          },
          {
            name: '',
            field: 'confirmNumbers',
            class: 'w9p'
          },
          {
            name: '',
            field: 'differenceType',
            class: 'w9p',
          },
          {
            name: '',
            field: 'factoryBatchNumber',
            class: 'w9p'
          },
          {
            name: '',
            field: 'batchInvoiceNumber',
            class: 'w9p'
          },
          {
            name: '',
            field: 'inStockExCode',
            class: 'w9p'
          },
          {
            name: '',
            field: 'inStockMaterialCode',
            class: 'w9p'
          },
          {
            name: '',
            field: 'factoryBatchNumber',
            class: 'w9p'
          },
          {
            name: '',
            field: 'inStockQuantity',
            class: 'w9p'
          },
          {
            name: '',
            field: 'inStockTime',
            class: 'w9p'
          }
        ]
      },
    };
  },
  components: {Table},
  beforeCreate() {

  },
  created() {

  },
  mounted() {
    this.getSupplierDictList();
    this.getExceptionList();
    this.getAbnormalTypeList();
  },
  activated() {

  },
  watch: {

  },
  computed: {
    
  },
  methods: {
      rowClick(row, event, column){
      //单击事件
      console.log(row,event, column);
      Array.prototype.remove = function (val) {
        console.log(val)
          let index = this.indexOf(val);
          if (index > -1) {
              this.splice(index, 1);
          }
      };
      if (this.expands.indexOf(row.id) < 0) {
          this.expands.push(row.id);
      }else {
          this.expands.remove(row.id);
      }
    },
    abnormalTypeSector() {
      this.searchHandle();
    },
    searchHandle() {
      // 搜索
      this.exceptionList = [];
      this.getExceptionList();
    },
    switchTabHandle(tab) {
      
    },
    showChildList(index, item) {
      item.isShowList = !item.isShowList;
      this.$forceUpdate();
    },
    changeBusinessType() {
      this.$forceUpdate();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getExceptionList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getExceptionList();
    },
    getExceptionList() {
      let data = {
        differenceType: this.differenceType,
        prepareReceiptCode: this.prepareReceiptCode,
        supplierCode: this.supplierCode,
        supplierName: this.supplierName,
        uuid: this.uuid,
        sourceMaterialCode: this.sourceMaterialCode
      };
      exceptionSolveList(this.currentPage, this.pageSize, data).then(res => {
        console.log('异常处理列表：', res);
        if (res.code === '0') {
          this.exceptionList = res.data.records;
          this.total = res.data.total;
          this.exceptionList.forEach((item, index) => {
            if (item.createTime) {
              item.createTime = timeFormat(item.createTime);
            } else {
              item.createTime = '空';
            }
          });
        }
      });
    },
    getAbnormalTypeList() {
      abnormalTypeList().then(res => {
        console.log('差异类型：', res);
        if (res.code === '0') {
          this.abnormalList = res.data;
        }
      });
    },
    getSupplierDictList() {
      supplierDictList().then(res => {
        console.log('供应商列表：', res);
        if (res.code === '0') {
          this.supplierList = res.data;
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
.container {
  background-color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}

.difference {
  padding: 10px 15px;
  .actions_part {
    margin: 10px 0;
  }
}
.table_part {
  ul {
    &.childcontentlist {
      height: 60px;
      li {
        line-height: 40px;
      }
    }
  }
}
.add_popup_part {
  ul {
    &.childcontentlist {
      height: 60px;
    }
  }
  .add_goods_btn {
    padding: 0 20px;
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    cursor: pointer;
  }
  .empty_wrap {
    text-align: center;
    margin-top: 15px;
    color: #909399;
    .empty_img {
      width: 200px;
      height: 100px;
    }
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



li.el-select-dropdown__item.hover {
  width: 100%;
}

ul.parentlist {
  li {
    i.el-icon-caret-bottom,
    i.el-icon-caret-top {
      font-size: 20px;
    }
    i.el-icon-edit,
    i.el-icon-delete,
    i.el-icon-thumb,
    i.el-icon-view {
      font-size: 20px;
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
i.el-icon-circle-plus {
  font-size: 30px;
  color: #409eff;
  cursor: pointer;
}
i.el-icon-remove {
  font-size: 28px;
  color: red;
  cursor: pointer;
}

ul.childcontentlist {
  li {
    i.el-icon-edit,
    i.el-icon-delete {
      font-size: 20px;
      color: #409eff;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}

.addcontent {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 15px;
}
.addcontent_content ul {
  height: 40px;
  background: #cecece;
  margin-top: 10px;
  border-radius: 4px;
  li {
    padding: 10px 10px;
    font-size: 14px;
    color: #606266;
  }
}
form.el-form.demo-form-inline {
  display: flex;
}
form.el-form.demo-form-inline .el-form-item {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 0px;
}
// button.el-button.el-button--danger.is-circle {
//   padding: 3px;
//   margin-top: 10px;
// }
.formtable {
  ul.demo-form-inline {
    background: #ffffff;
    border-bottom: 1px solid #eeeeee;
    padding: 10px 10px;
    li {
      width: auto;
      padding: 0 10px;
      font-size: 14px;
      color: #606266;
      .el-input-number--mini {
        width: 80px;
        height: 40px;
      }

      .el-input-number.is-controls-right .el-input__inner {
        padding-right: 0;
        height: 40px;
      }
      span {
        margin-left: 5px;
        margin-right: 10px;
      }
      select {
        width: 145px;
      }
      .el-date-editor.el-input.el-input--prefix.el-input--suffix.el-date-editor--date {
        width: 150px;
      }
      .el-select {
        width: 145px;
      }
    }
    li:first-child {
      padding: 0px 0;
    }
    li:nth-child(3),
    li:nth-child(4) {
      padding: 0px 0;
    }
  }
  ul.demo-form-inline:last-child {
    border-bottom: none;
  }
}
select.selectstatus {
  width: 200px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #dcdfe6;
  text-indent: 1em;
  color: #606266;
  line-height: 20px;
  cursor: pointer;
  font-size: 14px;
}

select.selectstatus > option {
  cursor: pointer;
  font-size: 14px;
}
</style>
<style>
.subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.subnav_wrap.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0;
}
</style>