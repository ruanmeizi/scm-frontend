<template>
  <el-table
    class="editTable"
    :data="list"
    border
    style="width: 100%">
    <!-- 左侧固定 -->
    <el-table-column
      v-for="(item, index) in leaderFieldsList"
      :key="index"
      fixed
      :prop="item.field"
      :label="item.name"
      :width="item.width">
      <template slot-scope="scope">
        <div v-if="scope.row.editModeSet.inputSet && scope.row.editModeSet.inputSet[item.field]" class="w100p display_ib">
          <el-input
            :class="scope.row.editModeSet.inputSet[item.field].class ? scope.row.editModeSet.inputSet[item.field].class : 'input_single w80p'"
            size="small"
            title=""
            v-model.trim="scope.row[item.field]"
            @change="fixedInputChange($event, scope.row, item)"
            @blur="fixedInputBlur($event, scope.row, item)"
            :maxlength="scope.row.editModeSet.inputSet[item.field].maxlength ? scope.row.editModeSet.inputSet[item.field].maxlength : ''"
            :placeholder="scope.row.editModeSet.inputSet[item.field].placeholder ? scope.row.editModeSet.inputSet[item.field].placeholder : ''">
          </el-input>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
        </div>
        <el-select
          v-if="scope.row.editModeSet.selectSet && scope.row.editModeSet.selectSet[item.field]"
          class="select_single w100p"
          size="small"
          v-model="scope.row[item.field]"
          @change="fixedSelectChange($event, scope.row, item)"
          @visible-change="fixedSelectVisibleChange($event, scope.row, item)"
          placeholder="请选择">
          <el-option key="" label="请选择" value=""></el-option>
          <el-option
            v-for="selectItem in scope.row[scope.row.editModeSet.selectSet[item.field].selectListName]"
            :key="selectItem[scope.row.editModeSet.selectSet[item.field].value]"
            :label="selectItem[scope.row.editModeSet.selectSet[item.field].label]"
            :value="selectItem[scope.row.editModeSet.selectSet[item.field].value]">
          </el-option>
        </el-select>
        <div v-if="scope.row.editModeSet.numberInputSet && scope.row.editModeSet.numberInputSet[item.field]" class="w100p display_ib">
          <el-input-number
            class="w75p"
            size="small"
            :precision="item.field_unit ? ((scope.row[item.field_unit] == '米' || scope.row[item.field_unit] == '公斤') ? 2 : 0) : ''"
            v-model="scope.row[item.field]"
            controls-position="right"
            @change="fixedNumberInputChange($event, scope.row, item)"
            :min="0">
          </el-input-number>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
        </div>
        <el-date-picker
          v-if="scope.row.editModeSet.datePickerSet && scope.row.editModeSet.datePickerSet[item.field]"
          class="w100p"
          size="small"
          value-format="yyyy-MM-dd"
          v-model="scope.row[item.field]"
          @change="fixedDatePickerChange($event, scope.row, item)"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span v-if="scope.row.editModeSet.textSet && scope.row.editModeSet.textSet[item.field]" :title="scope.row[item.field]">{{scope.row[item.field] ? scope.row[item.field] : (item.isQuantityField ? 0 : '')}}&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}</span>
      </template>
    </el-table-column>

    <!-- 中部滚动 -->
    <el-table-column
      v-for="(item, index) in fieldsList"
      :key="index"
      :prop="item.field"
      :label="item.name"
      :width="item.width">
      <template slot-scope="scope">
        <div class="s_column">
          <div v-if="scope.row.editModeSet.inputSet && scope.row.editModeSet.inputSet[item.field]" class="w100p display_ib">
            <el-input
              class="w80p"
              size="small"
              :type="scope.row.editModeSet.inputSet[item.field].type ? scope.row.editModeSet.inputSet[item.field].type : ''"
              title=""
              v-model.trim="scope.row[item.field]"
              @change="inputChange($event, scope.row, item)"
              @blur="inputBlur($event, scope.row, item)"
              :maxlength="scope.row.editModeSet.inputSet[item.field].maxlength ? scope.row.editModeSet.inputSet[item.field].maxlength : ''"
              :placeholder="scope.row.editModeSet.inputSet[item.field].placeholder ? scope.row.editModeSet.inputSet[item.field].placeholder : ''">
            </el-input>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
          </div>
          <el-select
            v-if="scope.row.editModeSet.selectSet && scope.row.editModeSet.selectSet[item.field]"
            class="select_single w100p"
            size="small"
            v-model="scope.row[item.field]"
            @change="selectChange($event, scope.row, item)"
            @visible-change="selectVisibleChange($event, scope.row, item)"
            placeholder="请选择"
            :filterable="scope.row.editModeSet.selectSet[item.field].filterable ? scope.row.editModeSet.selectSet[item.field].filterable : false">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="selectItem in scope.row[scope.row.editModeSet.selectSet[item.field].selectListName]"
              :key="selectItem[scope.row.editModeSet.selectSet[item.field].value]"
              :label="selectItem[scope.row.editModeSet.selectSet[item.field].label]"
              :value="selectItem[scope.row.editModeSet.selectSet[item.field].value]">
            </el-option>
          </el-select>
          <!-- 远程搜索下拉框 -->
          <el-select
            v-if="scope.row.editModeSet.selectRemoteSet && scope.row.editModeSet.selectRemoteSet[item.field]"
            v-model.trim="scope.row[item.field]"
            size="small"
            ref="select"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="(query) => { selectRemoteMethod(query, scope.row, item) }"
            @change="selectRemoteChange($event, scope.row, item)"
            @click.native="selectRemoteClick($event, scope.row, item)"
            :loading="selectRemoteLoading">
            <el-option
              v-for="selectRemoteItem in scope.row[scope.row.editModeSet.selectRemoteSet[item.field].selectListName]"
              :key="selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].value] ? selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].value] : selectRemoteItem"
              :label="selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].label] ? selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].label] : selectRemoteItem"
              :value="selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].value] ? selectRemoteItem[scope.row.editModeSet.selectRemoteSet[item.field].value] : selectRemoteItem">
            </el-option>
          </el-select>
          <div v-if="scope.row.editModeSet.numberInputSet && scope.row.editModeSet.numberInputSet[item.field]" class="w100p display_ib">
            <el-input-number
              class="w75p"
              size="small"
              :precision="item.field_unit ? ((scope.row[item.field_unit] == '米' || scope.row[item.field_unit] == '公斤') ? 2 : 0) : ''"
              v-model="scope.row[item.field]"
              @change="numberInputChange($event, scope.row, item)"
              controls-position="right"
              :min="0">
            </el-input-number>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
          </div>
          <el-date-picker
            v-if="scope.row.editModeSet.datePickerSet && scope.row.editModeSet.datePickerSet[item.field]"
            class="w100p"
            size="small"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="scope.row[item.field]"
            @change="datePickerChange($event, scope.row, item)"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <div v-if="scope.row.editModeSet.datePickerDoubleSet && scope.row.editModeSet.datePickerDoubleSet[item.field_1]">
            <el-date-picker
              class="w40p"
              v-model="scope.row[item.field_1]"
              type="date"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              :picker-options="scope.row[item.startPickerOptions]"
              :disabled="item.field_1_disabled"
            ></el-date-picker> — 
            <el-date-picker
              class="w40p"
              v-model="scope.row[item.field_2]"
              type="date"
              size="small"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              :picker-options="scope.row[item.endPickerOptions]"
              :disabled="item.field_2_disabled"
            ></el-date-picker>
          </div>
          <div v-if="scope.row.editModeSet.unitSet && scope.row.editModeSet.unitSet[item.field_1]" class="display_ib" style="height: 32px; line-height: 32px;">
            <div v-if="scope.row[item.field_unit] == '米'" class="display_ib">
              <div v-if="item.isUnitSetText" class="display_ib" :title="(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 ' + (scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 ' + (scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'">{{(scope.row[item.field_1] ? scope.row[item.field_1] : '0') + '包 ' + (scope.row[item.field_2] ? scope.row[item.field_2] : '0') + '米/包 ' + (scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'}}</div>
              <div class="display_ib" v-else>
                <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-input-number
                    class="w60p"
                    size="small"
                    precision="0"
                    v-model="scope.row[item.field_1]"
                    @change="fUnitNumberInputChange($event, scope.row, item, 'first')"
                    @blur="fUnitNumberInputBlur($event, scope.row, item, 'first')"
                    controls-position="right"
                    :min="scope.row.editModeSet.unitSet[item.field_1].min ? scope.row.editModeSet.unitSet[item.field_1].min : 0">
                  </el-input-number>&nbsp;
                  <span class="display_ib">包</span>
                </div>
                <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-input-number
                    class="w60p"
                    size="small"
                    precision="2"
                    v-model="scope.row[item.field_2]"
                    :disabled="scope.row.editModeSet.unitSet[item.field_2] ? scope.row.editModeSet.unitSet[item.field_2].disabled : false"
                    @change="sUnitNumberInputChange($event, scope.row, item, 'second')"
                    @blur="sUnitNumberInputBlur($event, scope.row, item, 'second')"
                    controls-position="right"
                    :min="scope.row.editModeSet.unitSet[item.field_1].min ? scope.row.editModeSet.unitSet[item.field_1].min : 0">
                  </el-input-number>&nbsp;
                  <span class="display_ib">米/包</span>
                </div>
                <div class="meters display_ib w20p">
                  <span class="count display_b" :title="(scope.row[item.field_3] ? scope.row[item.field_3] : '0') + '米'">{{scope.row[item.field_3] ? scope.row[item.field_3] : '0'}}米</span>
                  <!-- <span class="display_ib v_top">米</span> -->
                </div>
              </div>
            </div>

            <div class="display_ib" v-else>
              <span v-if="item.isUnitSetText" :title="scope.row[item.field] ? scope.row[item.field] : '0'">{{scope.row[item.field] ? scope.row[item.field] : '0'}}</span>
              <el-input-number
                v-else
                class="w100"
                size="small"
                :precision="(scope.row[item.field_unit] == '米' || scope.row[item.field_unit] == '公斤') ? 2 : 0"
                v-model="scope.row[item.field]"
                @change="unitNumberInputChange($event, scope.row, item)"
                @blur="unitNumberInputBlur($event, scope.row, item)"
                controls-position="right"
                :min="scope.row.editModeSet.unitSet[item.field_1].min ? scope.row.editModeSet.unitSet[item.field_1].min : 0">
              </el-input-number>&nbsp;
              <!-- <span class="display_ib">{{scope.row.editModeSet.unitSet[item.field_unit] ? scope.row.editModeSet.unitSet[item.field_unit] : '条'}}</span> -->
              <span class="display_ib">{{scope.row[item.field_unit] ? scope.row[item.field_unit] : '条'}}</span>
            </div>
          </div>
          <span v-if="scope.row.editModeSet.textSet && scope.row.editModeSet.textSet[item.field]" class="text" :title="scope.row[item.field]">{{scope.row[item.field] ? scope.row[item.field] : (item.isQuantityField ? 0 : '')}}{{item.field_unit ? (scope.row[item.field_unit] ? ' ' + scope.row[item.field_unit] : '') : ''}}</span>
        </div>
      </template>
    </el-table-column>

    <!-- 右侧固定 -->
    <el-table-column
      v-for="(item, index) in tailFieldsList"
      :key="index"
      fixed="right"
      :label="item.name"
      :width="item.width">
      <!-- 操作 -->
      <template v-if="item.isAction" slot-scope="scope">
        <el-button v-if="item.hasCheck" @click.stop="checkHandle(scope.$index, scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="item.hasAdd" @click.stop="addHandle(scope.$index, scope.row)" type="text" size="small">添加</el-button>
        <el-button v-if="item.hasEdit" @click.stop="editHandle(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
        <el-button v-if="item.hasSubmit" @click.stop="submitHandle(scope.$index, scope.row)" type="text" size="small">提交审批</el-button>
        <el-button v-if="item.hasRemove" @click.stop="removeHandle(scope.$index, scope.row)" type="text" size="small">整单解除</el-button>
        <el-button v-if="item.hasPay" @click.stop="payHandle(scope.$index, scope.row)" type="text" size="small">发起付款</el-button>
        <el-button v-if="item.hasDelete" @click.stop="deleteHandle(scope.$index, scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  export default {
    name: 'EditTableList',
    props: ['tableList', 'tableFieldsList', 'tableLeaderFieldsList', 'tableTailFieldsList', 'selectRemoteLoading'],
    data() {
      return {
        list: [], // 数据列表
        fieldsList: [], // 字段列表
        leaderFieldsList: [], // 首部字段列表
        tailFieldsList: [], // 尾部字段列表
        startPickerOptions: {},
        endPickerOptions: {},
      }
    },
    mounted() {
      this.list = this.tableList;
      this.fieldsList = this.tableFieldsList;
      this.leaderFieldsList = this.tableLeaderFieldsList;
      this.tailFieldsList = this.tableTailFieldsList;
    },
    watch: {
      tableList(list, oldList) {
        this.list = list;
        // console.log('新list：', list, '旧数据：', oldList);
        this.$forceUpdate();
      },
      tableFieldsList(list, oldList) {
        this.fieldsList = list;
        // console.log('表头新list：', list, '表头旧数据：', oldList);
        this.$forceUpdate();
      },
      tableLeaderFieldsList(list) {
        this.leaderFieldsList = list;
        this.$forceUpdate();
      },
      tableTailFieldsList(list) {
        this.tailFieldsList = list;
        this.$forceUpdate();
      },
      startPickerOptions(data) {
        this.startPickerOptions = data;
        this.$forceUpdate();
      },
      endPickerOptions(data) {
        this.endPickerOptions = data;
        this.$forceUpdate();
      }
    },
    methods: {
      checkHandle(index, item) {
        console.log('查看：', index, item);
        this.$emit('checkHandle', index, item);
      },
      addHandle(index, item) {
        console.log('添加：', index, item);
        this.$emit('addHandle', index, item);
      },
      editHandle(index, item) {
        console.log('编辑：', index, item);
        this.$emit('editHandle', index, item);
      },
      submitHandle(index, item) {
        console.log('提交：', index, item);
        this.$emit('submitHandle', index, item);
      },
      removeHandle(index, item) {
        console.log('解除：', index, item);
        this.$emit('removeHandle', index, item);
      },
      payHandle(index, item) {
        console.log('申请付款：', index, item);
        this.$emit('payHandle', index, item);
      },
      deleteHandle(index, item) {
        console.log('删除：', index, item);
        this.$emit('deleteHandle', index, item);
      },
      // Change
      datePickerChange(val, item, fieldItem) {
        console.log('datePicker切换：', val);
        this.$emit('datePickerChange', val, item, fieldItem);
      },
      inputChange(val, item, fieldItem) {
        console.log('input切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      numberInputChange(val, item, fieldItem) {
        console.log('numberInput切换：', val, item, fieldItem);
        this.$emit('numberInputChange', val, item, fieldItem);
      },
      selectChange(val, item, fieldItem) {
        console.log('select切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
      },
      selectRemoteChange(val, item, fieldItem) {
        console.log('selectRemote切换：', val, item, fieldItem);
        this.$emit('selectRemoteChange', val, item, fieldItem);
      },
      unitNumberInputChange(val, item, fieldItem) {
        console.log('unitNumberInput切换：', val, item, fieldItem);
        this.$emit('unitNumberInputChange', val, item, fieldItem);
      },
      fUnitNumberInputChange(val, item, fieldItem, step) {
        // 三个计量单位（例：包、米/包、米）中第一个值改变
        console.log('fUnitNumberInput切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      sUnitNumberInputChange(val, item, fieldItem, step) {
        // 三个计量单位（例：包、米/包、米）中第二个值改变
        console.log('sUnitNumberInput切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      fixedDatePickerChange(val, item, fieldItem) {
        console.log('fixed datePicker切换：', val, item, fieldItem);
        this.$emit('datePickerChange', val, item, fieldItem);
      },
      fixedNumberInputChange(val, item, fieldItem) {
        console.log('fixed numberInput切换：', val, item, fieldItem);
        this.$emit('numberInputChange', val, item, fieldItem);
      },
      fixedInputChange(val, item, fieldItem) {
        console.log('fixed input切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      fixedSelectChange(val, item, fieldItem) {
        console.log('fixed select切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
      },
      selectVisibleChange(val, item, fieldItem) {
        console.log('select显隐：', val, item, fieldItem);
        this.$emit('selectVisibleChange', val, item, fieldItem);
      },
      fixedSelectVisibleChange(val, item, fieldItem) {
        console.log('fixedSelect显隐：', val, item, fieldItem);
        this.$emit('selectVisibleChange', val, item, fieldItem);
      },
      // Blur
      inputBlur(event, item, fieldItem) {
        console.log('input失焦：', event, item, fieldItem);
        this.$emit('inputBlur', event, item, fieldItem);
      },
      fixedInputBlur(event, item, fieldItem) {
        console.log('fixedInput失焦：', event, item, fieldItem);
        this.$emit('inputBlur', event, item, fieldItem);
      },
      fUnitNumberInputBlur(event, item, fieldItem, step) {
        console.log('fUnitNumberInput失焦：', event, item, fieldItem, step);
        this.$emit('unitNumberInputBlur', event, item, fieldItem, step);
      },
      sUnitNumberInputBlur(event, item, fieldItem, step) {
        console.log('sUnitNumberInput失焦：', event, item, fieldItem, step);
        this.$emit('unitNumberInputBlur', event, item, fieldItem, step);
      },
      unitNumberInputBlur(event, item, fieldItem) {
        console.log('unitNumberInput失焦：', event, item, fieldItem);
        this.$emit('unitNumberInputBlur', event, item, fieldItem);
      },
      // Click
      selectRemoteClick(val, item, fieldItem) {
        console.log('selectRemote点击：', val, item, fieldItem);
        this.$emit('selectRemoteClick', val, item, fieldItem);
      },
      // Paste
      inputPaste(event, item, fieldItem) {
        console.log('input粘贴：', event, item, fieldItem);
        this.$emit('inputPaste', event, item, fieldItem);
      },
      fixedInputPaste(event, item, fieldItem) {
        console.log('fixedInput粘贴：', event, item, fieldItem);
        this.$emit('inputPaste', event, item, fieldItem);
      },
      // RemoteMethod
      selectRemoteMethod(query, item, fieldItem) {
        console.log('selectRemote远程搜索：', query, item, fieldItem);
        this.$emit('selectRemoteMethod', query, item, fieldItem);
      }
    }
  }
</script>

<style lang="scss">
.editTable {
  &.el-table {
    .el-table__body {
      td {
        .cell {
          .s_column {
            height: 32px !important;
            margin-top: 10px;
            line-height: 32px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &:first-child {
              margin-top: 0;
            }
          }
        }
      }
    }
  }
}
</style>