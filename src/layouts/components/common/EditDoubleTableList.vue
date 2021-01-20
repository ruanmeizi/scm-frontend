<template>
  <el-table
    class="editTable double"
    :data="list"
    :key="key"
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
        <el-input
          v-if="scope.row.editModeSet.inputSet && scope.row.editModeSet.inputSet[item.field]"
          class="w100p"
          size="small"
          :type="scope.row.editModeSet.inputSet[item.field].type ? scope.row.editModeSet.inputSet[item.field].type : ''"
          :disabled="scope.row.editModeSet.inputSet[item.field].disabled || disabledbo"
          v-model="scope.row[item.field]"
          @change="fixedInputChange($event, scope.row, item)"
          @blur="fixedInputBlur($event, scope.row, item)"
          @focus="fixedInputFocus($event, scope.row, item)"
          :maxlength="scope.row.editModeSet.inputSet[item.field].maxlength ? scope.row.editModeSet.inputSet[item.field].maxlength : ''"
          :placeholder="scope.row.editModeSet.inputSet[item.field].placeholder ? scope.row.editModeSet.inputSet[item.field].placeholder : ''">
        </el-input>
        <el-select
          v-if="scope.row.editModeSet.selectSet && scope.row.editModeSet.selectSet[item.field]"
          class="select_single w100p"
          size="small"
          :disabled="disabledbo"
          v-model="scope.row[item.field]"
          @change="fixedSelectChange($event, scope.row, item)"
          placeholder="请选择">
          <el-option key="" label="请选择" value=""></el-option>
          <el-option
            v-for="selectItem in scope.row[scope.row.editModeSet.selectSet[item.field].selectListName]"
            :key="scope.row.editModeSet.selectSet[item.field].value ? selectItem[scope.row.editModeSet.selectSet[item.field].value] : selectItem"
            :label="scope.row.editModeSet.selectSet[item.field].label ? selectItem[scope.row.editModeSet.selectSet[item.field].label] : selectItem"
            :value="scope.row.editModeSet.selectSet[item.field].value ? selectItem[scope.row.editModeSet.selectSet[item.field].value] : selectItem">
          </el-option>
        </el-select>
        <div v-if="scope.row.editModeSet.numberInputSet && scope.row.editModeSet.numberInputSet[item.field]" class="w100p display_ib">
          <el-input-number
            class="w80p"
            size="small"
            :precision="item.field_unit ? ((scope.row[item.field_unit] == '米' || scope.row[item.field_unit] == '公斤') ? 2 : 0) : ''"
            v-model="scope.row[item.field]"
            controls-position="right"
            @change="fixedNumberInputChange($event, scope.row, item)"
            :min="0"
            >
          </el-input-number>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
        </div>
        <el-date-picker
          v-if="scope.row.editModeSet.datePickerSet && scope.row.editModeSet.datePickerSet[item.field]"
          class="w100p"
          size="small"
          :disabled="disabledbo"
          value-format="yyyy-MM-dd"
          v-model="scope.row[item.field]"
          @change="fixedDatePickerChange($event, scope.row, item)"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <span v-if="scope.row.editModeSet.textSet && scope.row.editModeSet.textSet[item.field]" class="text" :title="scope.row[item.field]">{{scope.row[item.field]}}{{item.field_unit ? ' ' + scope.row[item.field_unit] : ''}}</span>
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
        <!-- 子级数据 -->
        <div v-if="item.isSingleField" class="s_column">
          <el-input
            v-if="scope.row.editModeSet.inputSet && scope.row.editModeSet.inputSet[item.field]"
            class="w100p"
            size="small"
            :type="scope.row.editModeSet.inputSet[item.field].type ? scope.row.editModeSet.inputSet[item.field].type : ''"
            v-model="scope.row[item.field]"
            @change="cInputChange($event, scope.row, item)"
            :disabled="scope.row.editModeSet.inputSet[item.field].disabled || disabledbo"
            :minlength="scope.row.editModeSet.inputSet[item.field].minlength ? scope.row.editModeSet.inputSet[item.field].minlength : ''"
            :maxlength="scope.row.editModeSet.inputSet[item.field].maxlength ? scope.row.editModeSet.inputSet[item.field].maxlength : ''"
            :placeholder="scope.row.editModeSet.inputSet[item.field].placeholder ? scope.row.editModeSet.inputSet[item.field].placeholder : ''">
          </el-input>
          <el-select
            v-if="scope.row.editModeSet.selectSet && scope.row.editModeSet.selectSet[item.field]"
            :disabled="disabledbo"
            class="select_single w100p"
            size="small"
            v-model="scope.row[item.field]"
            @change="cSelectChange($event, scope.row, item)"
            @visible-change="cSelectVisibleChange($event, scope.row, item)"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="selectItem in scope.row[scope.row.editModeSet.selectSet[item.field].selectListName]"
              :key="scope.row.editModeSet.selectSet[item.field].value ? selectItem[scope.row.editModeSet.selectSet[item.field].value] : selectItem"
              :label="scope.row.editModeSet.selectSet[item.field].label ? selectItem[scope.row.editModeSet.selectSet[item.field].label] : selectItem"
              :value="scope.row.editModeSet.selectSet[item.field].value ? selectItem[scope.row.editModeSet.selectSet[item.field].value] : selectItem">
            </el-option>
          </el-select>
          <div v-if="scope.row.editModeSet.numberInputSet && scope.row.editModeSet.numberInputSet[item.field]" class="w100p display_ib">
            <el-input-number
            :disabled="disabledbo"
              class="w80p"
              size="small"
              :precision="item.field_unit ? ((scope.row[item.field_unit] == '米' || scope.row[item.field_unit] == '公斤') ? 2 : 0) : '2'"
              v-model="scope.row[item.field]"
              controls-position="right"
              @change="cNumberInputChange($event, scope.row, item)"
              :min="0">
            </el-input-number>&nbsp;{{item.field_unit ? scope.row[item.field_unit] : ''}}
          </div>
          <el-date-picker
            v-if="scope.row.editModeSet.datePickerSet && scope.row.editModeSet.datePickerSet[item.field]"
            :disabled="disabledbo"
            class="w100p"
            size="small"
            value-format="yyyy-MM-dd"
            v-model="scope.row[item.field]"
            @change="cDatePickerChange($event, scope.row, item)"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <div v-if="scope.row.editModeSet.unitSet && scope.row.editModeSet.unitSet[item.field_1]" class="display_ib" style="height: 32px;">
            <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
              <el-input-number
                class="w60p"
                size="small"
                precision="0"
                v-model="scope.row[item.field_1]"
                @change="cfUnitNumberInputChange($event, scope.row, item, 'first')"
                controls-position="right"
                :min="0"
                >
              </el-input-number>&nbsp;
              <span class="display_ib">包</span>
            </div>
            <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
              <el-input-number
                class="w60p"
                size="small"
                precision="2"
                v-model="scope.row[item.field_2]"
                @change="csUnitNumberInputChange($event, scope.row, item, 'second')"
                controls-position="right"
                :min="0">
              </el-input-number>&nbsp;
              <span class="display_ib">米/包</span>
            </div>
            <div class="meters display_ib w20p">
              <span class="count display_ib" :title="scope.row[item.field_3]">{{scope.row[item.field_3]}}</span>
              <span class="display_ib v_top">米</span>
            </div>
          </div>
          <span v-if="scope.row.editModeSet.textSet && scope.row.editModeSet.textSet[item.field]" class="text" :title="scope.row[item.field]">{{scope.row[item.field] ? scope.row[item.field] : (item.isQuantityField ? 0 : '')}}{{item.field_unit ? ' ' + scope.row[item.field_unit] : ''}}</span>
        </div>
        <!-- 三级数据 -->
        <div v-else class="t_column" v-for="(cItem, cIndex) in scope.row[fieldsList[0].chlidListName]" :key="cIndex">
          <el-input
            v-if="cItem.editModeSet.inputSet && cItem.editModeSet.inputSet[item.field]"
            class="w100p"
            size="small"
            :type="cItem.editModeSet.inputSet[item.field].type ? cItem.editModeSet.inputSet[item.field].type : ''"
            v-model="cItem[item.field]"
            @change="inputChange($event, cItem, item)"
            @blur="inputBlur($event, cItem, item)"
            :disabled="cItem.editModeSet.inputSet[item.field].disabled || disabledbo"
            :maxlength="cItem.editModeSet.inputSet[item.field].maxlength ? cItem.editModeSet.inputSet[item.field].maxlength : ''"
            :placeholder="cItem.editModeSet.inputSet[item.field].placeholder ? cItem.editModeSet.inputSet[item.field].placeholder : ''">
          </el-input>
          <div v-if="cItem.editModeSet.inputDoubleSet && cItem.editModeSet.inputDoubleSet[item.field_1]">
            <el-input
              class="w40p"
              size="small"
              v-model="cItem[item.field_1]"
              @change="sDoubleInputChange($event, cItem, item)"
              :disabled="cItem.editModeSet.inputSet[item.field_1].disabled || disabledbo"
              :maxlength="cItem.editModeSet.inputSet[item.field_1].maxlength ? cItem.editModeSet.inputSet[item.field_1].maxlength : ''"
              :placeholder="cItem.editModeSet.inputSet[item.field_1].placeholder ? cItem.editModeSet.inputSet[item.field_1].placeholder : ''">
            </el-input> — 
            <el-input
              class="w40p"
              size="small"
             
              v-model="cItem[item.field_2]"
              @change="eDoubleInputChange($event, cItem, item)"
              :disabled="cItem.editModeSet.inputSet[item.field_2].disabled || disabledbo"
              :maxlength="cItem.editModeSet.inputSet[item.field_2].maxlength ? cItem.editModeSet.inputSet[item.field_2].maxlength : ''"
              :placeholder="cItem.editModeSet.inputSet[item.field_2].placeholder ? cItem.editModeSet.inputSet[item.field_2].placeholder : ''">
            </el-input>&nbsp;{{item.field_unit ? cItem[item.field_unit] : ''}}
          </div>
          <el-select
            v-if="cItem.editModeSet.selectSet && cItem.editModeSet.selectSet[item.field]"
            class="select_single w100p"
            :disabled="disabledbo"
            size="small"
            v-model="cItem[item.field]"
            @change="selectChange($event, cItem, item)"
            @visible-change="selectVisibleChange($event, cItem, item)"
            placeholder="请选择">
            <el-option key="" label="请选择" value=""></el-option>
            <el-option
              v-for="selectItem in cItem[cItem.editModeSet.selectSet[item.field].selectListName]"
              :key="cItem.editModeSet.selectSet[item.field].value ? selectItem[cItem.editModeSet.selectSet[item.field].value] : selectItem"
              :label="cItem.editModeSet.selectSet[item.field].label ? selectItem[cItem.editModeSet.selectSet[item.field].label] : selectItem"
              :value="cItem.editModeSet.selectSet[item.field].value ? selectItem[cItem.editModeSet.selectSet[item.field].value] : selectItem">
            </el-option>
          </el-select>
          <div v-if="cItem.editModeSet.numberInputSet && cItem.editModeSet.numberInputSet[item.field]" class="w100p display_ib">
            <el-input-number
              class="w80p"
              size="small"
              :precision="item.field_unit ? ((cItem[item.field_unit] == '米' || cItem[item.field_unit] == '公斤') ? 2 : 0) : '2'"
              v-model="cItem[item.field]"
              controls-position="right"
              @change="numberInputChange($event, cItem, item)"
              :min="0">
            </el-input-number>&nbsp;{{item.field_unit ? cItem[item.field_unit] : ''}}
          </div>
          <el-date-picker
            v-if="cItem.editModeSet.datePickerSet && cItem.editModeSet.datePickerSet[item.field]"
            class="w100p"
            size="small"
            :disabled="disabledbo"
            value-format="yyyy-MM-dd"
            v-model="cItem[item.field]"
            @change="datePickerChange($event, cItem, item)"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <div v-if="cItem.editModeSet.unitSet && cItem.editModeSet.unitSet[item.field_1]" style="height: 32px;">
            <div v-if="cItem[item.field_unit] == '米'" class="display_ib">
              <div v-if="item.isUnitSetText" class="display_ib" :title="(cItem[item.field_1] ? cItem[item.field_1] : '0') + '包 ' + (cItem[item.field_2] ? cItem[item.field_2] : '0') + '米/包 ' + (cItem[item.field_3] ? cItem[item.field_3] : '0') + '米'">{{(cItem[item.field_1] ? cItem[item.field_1] : '0') + '包 ' + (cItem[item.field_2] ? cItem[item.field_2] : '0') + '米/包 ' + (cItem[item.field_3] ? cItem[item.field_3] : '0') + '米'}}</div>
              <div class="display_ib" v-else>
                <div v-if="disabledbo" class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-input-number
                    class="w60p"
                    size="small"
                    precision="0"
                    v-model="cItem[item.field_1]"
                    controls-position="right"
                    @change="ftUnitNumberInputChange($event, cItem, item, 'first')"
                    :min="0"
                    :max="cItem._allocationPackages"
                    >
                  </el-input-number>&nbsp;
                  <span class="display_ib">包</span>
                </div>
                <div v-else class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-input-number
                    class="w60p"
                    size="small"
                    precision="0"
                    v-model="cItem[item.field_1]"
                    controls-position="right"
                    @change="ftUnitNumberInputChange($event, cItem, item, 'first')"
                    :min="0"
                    >
                  </el-input-number>&nbsp;
                  <span class="display_ib">包</span>
                </div>
                <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-select
                    :disabled="disabledbo"
                    v-if="cItem.editModeSet.unitSet[item.field_1].type === 'select' ? true : false"
                    class="select_single w60p"
                    size="small"
                    v-model="cItem[item.field_2]"
                    @change="unitSetSelectChange($event, cItem, item)"
                    @visible-change="unitSetSelectVisibleChange($event, cItem, item)"
                    placeholder="请选择">
                    <el-option key="" label="请选择" value=""></el-option>
                    <el-option
                      v-for="selectItem in cItem[cItem.editModeSet.selectSet[item.field_2].selectListName]"
                      :key="cItem.editModeSet.selectSet[item.field_2].value ? selectItem[cItem.editModeSet.selectSet[item.field_2].value] : selectItem"
                      :label="cItem.editModeSet.selectSet[item.field_2].label ? selectItem[cItem.editModeSet.selectSet[item.field_2].label] : selectItem"
                      :value="cItem.editModeSet.selectSet[item.field_2].value ? selectItem[cItem.editModeSet.selectSet[item.field_2].value] : selectItem">
                    </el-option>
                  </el-select>
                  <el-input-number
                    v-else
                    class="w60p"
                    size="small"
                    precision="2"
                    v-model="cItem[item.field_2]"
                    controls-position="right"
                    @change="stUnitNumberInputChange($event, cItem, item, 'second')"
                    :min="0">
                  </el-input-number>&nbsp;
                  <span class="display_ib">米/包</span>
                </div>
                <div class="meters display_ib w20p">
                  <span class="count display_ib" :title="cItem[item.field_3]">{{cItem[item.field_3]}}</span>
                  <span class="display_ib v_top">米</span>
                </div>
              </div>
            </div>
            <div  class="display_ib" v-else>
              <div v-if="disabledbo">
              <span v-if="item.isUnitSetText" :title="cItem[item.field] ? cItem[item.field] : '0'">{{cItem[item.field] ? cItem[item.field] : '0'}}</span>
             
              <el-input-number
                v-else
                class="w100"
                size="small"
                :precision="(cItem[item.field_unit] == '米' || cItem[item.field_unit] == '公斤') ? 2 : 0"
                v-model="cItem[item.field]"
                @change="unitNumberInputChange($event, cItem, item)"
                controls-position="right"
                :min="cItem.editModeSet.unitSet[item.field_1].min ? cItem.editModeSet.unitSet[item.field_1].min : 0"
                :max="cItem._allocationQuantity">
              </el-input-number>&nbsp;
              <!-- <span class="display_ib">{{cItem.editModeSet.unitSet[item.field_unit] ? cItem.editModeSet.unitSet[item.field_unit] : '条'}}</span> -->
              <span class="display_ib">{{cItem[item.field_unit] ? cItem[item.field_unit] : '条'}}</span>
            </div>
            <div v-else>
              <span v-if="item.isUnitSetText" :title="cItem[item.field] ? cItem[item.field] : '0'">{{cItem[item.field] ? cItem[item.field] : '0'}}</span>
             
              <el-input-number
                v-else
                class="w100"
                size="small"
                :precision="(cItem[item.field_unit] == '米' || cItem[item.field_unit] == '公斤') ? 2 : 0"
                v-model="cItem[item.field]"
                @change="unitNumberInputChange($event, cItem, item)"
                controls-position="right"
                :min="cItem.editModeSet.unitSet[item.field_1].min ? cItem.editModeSet.unitSet[item.field_1].min : 0">
              </el-input-number>&nbsp;
              <!-- <span class="display_ib">{{cItem.editModeSet.unitSet[item.field_unit] ? cItem.editModeSet.unitSet[item.field_unit] : '条'}}</span> -->
              <span class="display_ib">{{cItem[item.field_unit] ? cItem[item.field_unit] : '条'}}</span>
            </div>
            </div>
            
          </div>
          <div v-if="cItem.editModeSet.unitSet && cItem.editModeSet.unitSet[item.fields]" style="height: 32px;">
            <div v-if="cItem[item.field_unit] == '米'" class="display_ib">
              <div v-if="item.isUnitSetText" class="display_ib" :title=" (cItem[item.fields] ? cItem[item.fields] : '0') + '米'">{{ (cItem[item.fields] ? cItem[item.fields] : '0') + '米'}}</div>
              <div class="display_ib" v-else>
                <div class="display_ib w40p" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden; word-break: break-all;">
                  <el-input-number
                    class="w100p"
                    size="small"
                    precision="0"
                    v-model="cItem[item.fields]"
                    controls-position="right"
                    :min="0">
                  </el-input-number>&nbsp;
                  <span class="display_ib">米</span>
                </div>
              </div>
            </div>
            <div class="display_ib" v-else>
              <span v-if="item.isUnitSetText" :title="cItem[item.field] ? cItem[item.field] : '0'">{{cItem[item.field] ? cItem[item.field] : '0'}}</span>
              <el-input-number
                v-else
                class="w100"
                size="small"
                :precision="(cItem[item.field_unit] == '米' || cItem[item.field_unit] == '公斤') ? 2 : 0"
                v-model="cItem[item.field]"
                @change="unitNumberInputChange($event, cItem, item)"
                controls-position="right"
                :min="cItem.editModeSet.unitSet[item.fields].min ? cItem.editModeSet.unitSet[item.fields].min : 0">
              </el-input-number>&nbsp;
              <!-- <span class="display_ib">{{cItem.editModeSet.unitSet[item.field_unit] ? cItem.editModeSet.unitSet[item.field_unit] : '条'}}</span> -->
              <span class="display_ib">{{cItem[item.field_unit] ? cItem[item.field_unit] : '条'}}</span>
            </div>
          </div>
          <span v-if="cItem.editModeSet.textSet && cItem.editModeSet.textSet[item.field]" class="text" :title="cItem[item.field]">{{cItem[item.field] ? cItem[item.field] : (item.isQuantityField ? 0 : '')}}{{item.field_unit ? ' ' + cItem[item.field_unit] : ''}}</span>
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
        <div v-if="item.isChlidAction" class="action_wrap inline_block mr10">
          <div v-for="(cItem, cIndex) in scope.row[fieldsList[0].chlidListName]" :key="cIndex" class="action block">
            <el-button  v-if="item.hasChildDelete" @click.stop="deleteChlidHandle(scope.$index,scope.$event, cIndex, cItem)" type="text" size="small">删除</el-button>
            <el-button  v-if="item.hasChildAdd" @click.stop="addChlidHandle(scope.$index, cIndex, cItem)" type="text" size="small">添加</el-button>
          </div>
        </div>
        <el-button v-if="item.hasCheck" @click.stop="checkHandle(scope.$index, scope.row)" type="text" size="small">查看</el-button>
        <el-button v-if="item.hasAdd" @click.stop="addHandle(scope.$index, scope.row)" type="text" :disabled="disabledbo" size="small">添加</el-button>
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
    name: 'EditDoubleTableList',
    props: ['tableList', 'tableFieldsList', 'tableLeaderFieldsList', 'tableTailFieldsList','disabledbo'],
   
    data() {
      return {
        list: [], // 数据列表
        fieldsList: [], // 字段列表
        leaderFieldsList: [], // 首部字段列表
        tailFieldsList: [], // 尾部字段列表
      }
    },
    mounted() {
      
      this.list = this.tableList;
      this.fieldsList = this.tableFieldsList;
      this.leaderFieldsList = this.tableLeaderFieldsList;
      this.tailFieldsList = this.tableTailFieldsList;
    },
    computed: {},
    watch: {
      tableList: {
        handler(newList, oldList) {
          // for (let i = 0; i < newList.length; i++) {
          //   if (oldList[i] != newList[i]) {
          //     this.list = newList;
          //   }
          // }
          this.list = newList;
        },
        deep: true
      },
      // tableList(list) {
      //   this.list = list;
      //   this.$forceUpdate();
      // },
      tableFieldsList(list) {
        this.fieldsList = list;
        this.$forceUpdate();
      },
      tableLeaderFieldsList(list) {
        this.leaderFieldsList = list;
        this.$forceUpdate();
      },
      tableTailFieldsList(list) {
        this.tailFieldsList = list;
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
      addChlidHandle(pIndex, cIndex, cItem) {
        console.log('添加子项：', pIndex, cIndex, cItem);
        this.$emit('addChlidHandle', pIndex, cIndex, cItem);
      },
      deleteChlidHandle(pIndex, rowl,cIndex, cItem) {
        
        console.log('删除子项：', pIndex, cIndex, cItem);
        this.$emit('deleteChlidHandle', pIndex, cIndex, cItem);
      },
      inputChange(val, item, fieldItem) {
        console.log('input切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      inputBlur(val, item, fieldItem) {
        console.log('input失焦：', val, item, fieldItem);
        this.$emit('inputBlur', val, item, fieldItem);
      },
      inputFocus(val, item, fieldItem) {
        console.log('input触焦：', val, item, fieldItem);
        this.$emit('inputFocus', val, item, fieldItem);
      },
      sDoubleInputChange(val, item, fieldItem) {
        console.log('sDoubleInput切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      eDoubleInputChange(val, item, fieldItem) {
        console.log('eDoubleInput切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      selectChange(val, item, fieldItem) {
        console.log('select切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
      },
      unitSetSelectChange(val, item, fieldItem) {
        console.log('unitSetSelect切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
        // this.$emit('unitSetSelectChange', val, item, fieldItem);
      },
      selectVisibleChange(val, item, fieldItem) {
        console.log('select显隐：', val, item, fieldItem);
        this.$emit('selectVisibleChange', val, item, fieldItem);
      },
      cSelectVisibleChange(val, item, fieldItem) {
        console.log('cSelect显隐：', val, item, fieldItem);
        this.$emit('selectVisibleChange', val, item, fieldItem);
      },
      unitSetSelectVisibleChange(val, item, fieldItem) {
        console.log('unitSetSelect显隐：', val, item, fieldItem);
        this.$emit('selectVisibleChange', val, item, fieldItem);
      },
      numberInputChange(val, item, fieldItem) {
        console.log('numberInput切换：', val, item, fieldItem);
        this.$emit('numberInputChange', val, item, fieldItem);
      },
      unitNumberInputChange(val, item, fieldItem, step) {
        console.log('unitNumberInput切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      cfUnitNumberInputChange(val, item, fieldItem, step) {
        // 子级三个计量单位（例：包、米/包、米）中第一个值改变
        console.log('cfUnitNumberInput子级单位一切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      csUnitNumberInputChange(val, item, fieldItem, step) {
        // 子级三个计量单位（例：包、米/包、米）中第二个值改变
        console.log('csUnitNumberInput子级单位二切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      ftUnitNumberInputChange(val, item, fieldItem, step) {
        // 三级三个计量单位（例：包、米/包、米）中第一个值改变
        // val：更改值 item：父项数据 fieldItem：字段项数据 step：区分值
        console.log('ftUnitNumberInput三级单位一切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);

        
      },
      stUnitNumberInputChange(val, item, fieldItem, step) {
        // 三级三个计量单位（例：包、米/包、米）中第二个值改变
        console.log('stUnitNumberInput三级单位二切换：', val, item, fieldItem, step);
        this.$emit('unitNumberInputChange', val, item, fieldItem, step);
      },
      datePickerChange(val, item, fieldItem) {
        console.log('datePicker切换：', val);
        this.$emit('datePickerChange', val, item, fieldItem);
      },
      cInputChange(val, item, fieldItem) {
        console.log('cInput切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      cSelectChange(val, item, fieldItem) {
        console.log('cSelect切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
      },
      cNumberInputChange(val, item, fieldItem) {
        console.log('cNumberInput切换：', val, item, fieldItem);
        this.$emit('numberInputChange', val, item, fieldItem);
      },
      cDatePickerChange(val, item, fieldItem) {
        console.log('cDatePicker切换：', val);
        this.$emit('datePickerChange', val, item, fieldItem);
      },
      fixedInputChange(val, item, fieldItem) {
        console.log('fixed input切换：', val, item, fieldItem);
        this.$emit('inputChange', val, item, fieldItem);
      },
      fixedInputBlur(val, item, fieldItem) {
        console.log('fixed input失焦：', val, item, fieldItem);
        this.$emit('inputBlur', val, item, fieldItem);
      },
      fixedInputFocus(val, item, fieldItem) {
        console.log('fixed input触焦：', val, item, fieldItem);
        this.$emit('inputFocus', val, item, fieldItem);
      },
      fixedSelectChange(val, item, fieldItem) {
        console.log('fixed select切换：', val, item, fieldItem);
        this.$emit('selectChange', val, item, fieldItem);
      },
      fixedNumberInputChange(val, item, fieldItem) {
        console.log('fixed numberInput切换：', val, item, fieldItem);
        this.$emit('numberInputChange', val, item, fieldItem);
      },
      fixedDatePickerChange(val, item, fieldItem) {
        console.log('fixed datePicker切换：', val, item, fieldItem);
        this.$emit('datePickerChange', val, item, fieldItem);
      }
    }
  }
</script>

<style lang="scss">
.editTable {
  &.double {
    &.el-table {
      .el-table__body {
        td {
          .cell {
            .s_column, .t_column {
              min-height: 32px !important;
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
      .el-table__fixed-right {
        .el-table__fixed-body-wrapper {
          .el-table__row {
            td {
              .cell {
                .action_wrap {
                  .action {
                    margin-top: 10px;
                    &:first-child {
                      margin-top: 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>