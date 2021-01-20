<template>
	<div class="container holidayManagement">
		<div class="actions_part clearfix">
      <div class="actions_wrap">
        <div class="display_ib mr10 mb10">
          <span class="tag">节假日：</span>
          <el-select class="select_single w200 mr10"
            v-model="holidayName"
			@change="getHolidayFabricList"
            placeholder="请选择">
            <el-option key="" label="全部" value=""></el-option>
            <el-option
              v-for="item in fabrictypeHolidaylist"
              :key="item.dictItemValue"
              :label="item.dictItemName"
              :value="item.dictItemValue">
            </el-option>
          </el-select>
        </div>
        <div class="display_ib mr10 mb10">
          <span class="tag">年份：</span>
          <el-input class="input_single w200 mr10" v-model.trim="year" placeholder="请输入"></el-input>
        </div>
        <!--<div class="display_ib mr10 mb10">
          <span class="tag">期望交期：</span>
          <el-date-picker class="mr10 mb10"
            v-model="startData"
            unlink-panels
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateValChange"
          ></el-date-picker>
        </div>-->
        
      </div>
	        <!-- <el-select class="mr10" v-model="holidayName" style="width:146px;" placeholder="请选择节假日">
	          <el-option key label="请选择节假日" value></el-option>
	          <el-option
	            v-for="item in fabrictypeHolidaylist"
	            :key="item.dictItemValue"
	            :label="item.dictItemName"
	            :value="item.dictItemValue"
	          ></el-option>
	        </el-select>	 
	        <el-input class="input_single w200 mr10 mb10" v-model.trim="year" placeholder="年份"></el-input> 
		     <el-date-picker
	          v-model="startData"
	          style="margin-top: 10px;"
	          unlink-panels
	          type="daterange"
	          format="yyyy-MM-dd"
	          value-format="yyyy-MM-dd"
	          range-separator="至"
	          start-placeholder="期望交期开始"
	          end-placeholder="期望交期结束"
	          :picker-options="pickerOptions0"
	        ></el-date-picker> -->
	        <div class="actions_btn_wrap down t_right">
	          <el-button
	            size="small"
	            type="primary"
	            icon="el-icon-search"
	            circle
	            title="搜索"
	            @click="searchHandle"
	          ></el-button>
	          <el-button
	            size="small"
	            type="primary"
	            icon="el-icon-plus"
	            circle
	            title="添加"
	            @click="addHandle"
	          ></el-button>
        </div>
      </div>
	 
	  <div class="table_part clearfix">
        <el-tabs class="subnav_wrap" v-loading="tableLoading" style="min-height: 536px;">
          <singleTable
          :tableList='fabricList' 
          :tableLeaderFieldsList='leaderFieldsList'
          :tableTailFieldsList="tailFieldsList"
          :tableFieldsList="fieldsList"
          @deleteHandle='deleteHandle'
          @editHandle='editHandle'
          ></singleTable>
        </el-tabs>
        <div class="pagination_wrap fr">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 50]"
            :page-size="pageSize"
            layout="sizes, total, prev, pager, next"
            :total="this.total"
          ></el-pagination>
        </div>
      </div>
	  
	  <!--删除-->
    <el-dialog
      :title="title"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      :visible.sync="dialogaddVisible"
      width="70%"
    >
      <ul class="childlist">
        <li v-if="item.name!='操作'" :class="item.class" v-for="(item, index) in fieldList" :key="index">{{item.name}}</li>
      </ul>
      <div class="allparentlist">
        <ul
          class="childcontentlist">
          <li class="w15p">
          	<el-select  v-model="form.holidayType"  placeholder="请选择节假日">
	          <!-- <el-option key label="请选择节假日" value></el-option> -->
	          <el-option
	            v-for="item in fabrictypeHolidaylist"
	            :key="item.dictItemValue"
	            :label="item.dictItemName"
	            :value="item.dictItemValue"
	          ></el-option>
	        </el-select>	
          </li>
          <li class="w15p" :title="form.particularYear">
          	<span class="line" v-model="form.particularYear">{{form.particularYear}}</span>
          </li>
          <li class="w18p" :title="form.startDate">
          	<el-date-picker
		      v-model="form.startDate"
		      type="date"
		      format="yyyy-MM-dd"
	          value-format="yyyy-MM-dd"
	          @change="timeChange"
	          :picker-options="pickerOptionsStart"
		      placeholder="起始日期">
		    </el-date-picker>
          </li>
          <li class="w18p" :title="form.endDate">
          	<el-date-picker
		      v-model="form.endDate"
		      type="date"
		      format="yyyy-MM-dd"
	          value-format="yyyy-MM-dd"
	          @change="timeChange"
	          :picker-options="pickerOptionsEnd"
		      placeholder="结束日期">
		    </el-date-picker>
          </li>
          <li class="w15p">
            
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingsave" @click="addVisibleclick()">提交</el-button>
      </span>
    </el-dialog>
	
	
	<!--删除-->
    <el-dialog
      title="提示"
      v-dialogDrag
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogdelVisible"
      width="30%"
    >
      <span>确定删除该条数据?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdelVisible = false">取 消</el-button>
        <el-button type="primary" @click="delVisibleclick()">确 定</el-button>
      </span>
    </el-dialog>
	
	
	</div>
</template>

<script>
import singleTable from "@/layouts/components/common/SingleTable.vue";
import {
  purchasegetuuid,
  holidaySerch,
  holidayAdd,
  holidayUpd,
  holidayDel
} from "@/api/module/holidayApi.js";
import {
  fabrictypeHoliday
} from "@/api/module/dictionariesApi.js";
import { timeFormat } from '@/utils/index.js';
export default {
  name: "holidayManagement",
  props: [],
  components:{
	  singleTable
  },
  data() {
    return {
      total: 0,
      pageSize: 10, //每页显示条数
      currentPage: 1, //页数
      holidayName:'',
      year:'',
      startData:'',
      activeName: '1',
      dialogaddVisible:false,
      dialogdelVisible:false,
      loadingsave:false,
      tableLoading: true,
      holidayStatus:'',
      title:'',
      delId:'',
      updId:'',
      starttime:'',
      endtime:'',
      onceData:{},
      fabrictypeHolidaylist:[],
      form:{
      	holidayType:'',
      	particularYear:'',
      	startDate:'',
      	endDate:'',
      	uuid:''
      },
      panelist: [
        {
          index: "1",
          status:'',
          name: "全部节假日"
        }
	  ],
      fieldList: [
        {
          name: '节假日名称',
          class: 'w15p'
        },
        {
          name: '年份',
          class: 'w15p'
        },
        {
          name: '起始日期',
          class: 'w18p'
        },
        {
          name: '结束日期',
          class: 'w18p'
        },
        {
          name: '操作',
          class: 'w15p'
        }
	  ],
	   leaderFieldsList: [
      ],
      fieldsList:[
		{
		  name:'序号',
		  field:'idIndex'
		},
        {
          name: '节假日名称',
		  field: 'holidayType',
		  fabricHolidayType:'fabricHolidayType'
        },
        {
          name:'年份',
          field:'particularYear',
        },
        {
          name:'起始日期',
          field:'startDate',
        },
        {
          name:'结束日期',
          field:'endDate',
        },
      ],
      tailFieldsList:[
        {
          name: '操作',
          field: '',
          class: '',
          width: '150',
		  minWidth: '10%',
		  isAction: true,
          hasEdit: true,
          hasDelete: true,
        },
      ],
      fabricList:[],
      pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.form.endDate;
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
      },
	  pickerOptionsEnd: {
	      disabledDate: time => {
	        let beginDateVal = this.form.startDate;
	        if (beginDateVal) {
	          return (
	            time.getTime() <
	            new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
	          );
	        }
	      }
	   },
    }
  },
  created() {

  },
  mounted() {
  	this.getFabrictypeHoliday();
  	this.getHolidayFabricList();
  },
  methods: {
  	substrHandle(val){
  		if(val!=undefined&&val!=''){
  			return val.substring(val.length-5);
  		}
  	},
  	holidayHandle(status){
  		for(var i=0;i<this.fabrictypeHolidaylist.length;i++){
	      	let item=this.fabrictypeHolidaylist[i];
	      	if(item.dictItemValue==status){
	      		return item.dictItemName
	      	}
	     }
  	},
  	//节假日名称
  	getFabrictypeHoliday(){
  		fabrictypeHoliday().then(response => {
			if(response.code === "0") {
				this.fabrictypeHolidaylist =response.data;	
			}
		});
  	},
  	//节假日列表
  	getHolidayFabricList(){
  	  this.tableLoading = true;
  	  let data = {
        holidayType:this.holidayName,
        particularYear:this.year,
		startDate:this.starttime,
		endDate:this.endtime
     };
     
	  holidaySerch(this.currentPage,this.pageSize, data).then(res => {
	        if (res.code=="0") {
	          this.tableLoading = false;
	          this.total = res.data.total;
			  this.fabricList= res.data.records;
			  this.$nextTick(function(){
				this.fabricList.forEach((item, index) => {
					item.startDate=this.substrHandle(item.startDate);
					item.endDate=this.substrHandle(item.endDate);
					if(this.currentPage!=1){
					item.idIndex=(this.currentPage-1)*this.pageSize+(index+1)
					}else{
					item.idIndex=index+1;
					}
					this.$forceUpdate();
				});
			  })	  
	        }else{
	        	this.tableLoading = false;
	        }
	  });
  	},
  	//新增
  	addHandle(){
  		this.title='添加节假日信息';
  		this.dialogaddVisible=true;
		purchasegetuuid().then(response => {
	        if (response.code === "0") {
	          this.form.uuid = response.data;
	        }
	    });
  	},
  	editHandle(index,item){
		console.log(item,index)
		
		this.form.startDate=item.particularYear+'-'+item.startDate;
		this.form.endDate=item.particularYear+'-'+item.endDate;
  		this.title='编辑节假日信息';
  		this.dialogaddVisible=true;
		this.updId=item.id;
		this.form={
	      	holidayType:item.holidayType,
	      	particularYear:item.particularYear,
	      	startDate:item.particularYear+'-'+item.startDate,
	      	endDate:item.particularYear+'-'+item.endDate,
	      	uuid:item.uuid
	    },
		console.log(this.form)
  	},
  	deleteHandle(index,item){
		  console.log(item,index)
  		this.delId=item.id;
  		this.dialogdelVisible=true;
  	},
  	//删除确定
  	delVisibleclick(){	
  		holidayDel(this.delId).then(response => {
	        if (response.code === "0") {
        	  this.$message({
	            message:'删除成功!',
	            type: "success"
	          });
	          this.dialogdelVisible=false;
	          this.getHolidayFabricList();
	        }
	    });
  	},
  	//弹框关闭
  	handleClose(){
  		console.log('关闭关闭')
  		this.form={};
  		this.dialogaddVisible=false;
  	},
  	timeChange(){
  	  if(this.form.startDate!=null&&this.form.startDate!=''){
  	  	this.form.particularYear=this.form.startDate.substring(0,4);
  	  }else{
  	  	this.form.particularYear='';
  	  }
  	},
  	//提交
  	addVisibleclick(){
  		console.log(this.form)
  		if(this.form.holidayType!=''&&this.form.startDate!=''&&this.form.startDate!=null&&this.form.endDate!=''&&this.form.endDate!=null){
  			if(this.title=='添加节假日信息'){
	  		  this.loadingsave=true;
	  		  holidayAdd(this.form).then(res => {
			        if (res.code == "0") {
			          this.$message({
			            message:'提交成功',
			            type: "success"
			          });
			          this.loadingsave=false;
			          this.dialogaddVisible=false;
			          this.form={};
			          this.getHolidayFabricList();
			        }else{
			          this.loadingsave=false;
			        }
			  });
	  		}else{
	  		  this.loadingsave=true;
	  		  holidayUpd(this.form,this.updId).then(res => {
			        if (res.code == "0") {
			         this.$message({
			            message:'提交成功',
			            type: "success"
			          });
			          this.dialogaddVisible=false;
			          this.loadingsave=false;
			          this.form={};
			          this.getHolidayFabricList();
			        }else{
			          this.loadingsave=false;
			        }
			  });
	  		}
  		}else{
  			 this.$message({
	            message:'填写项不能为空',
	            type: "error"
	          });
  		}
  		
  	},
  	
  	handleClick(tab, event) {
        console.log(tab, event);
        switch (tab.name) {
	      	case '1':
	          this.holidayStatus = "";
	          this.getHolidayFabricList();
	          break; 
	        default:
	          break;
	    }
    },
  	searchHandle(){
	    if (this.startData != null && this.startData != "") {
	        this.starttime = this.startData[0];
	        this.endtime = this.startData[1];
	    }else {
	        this.starttime = "";
	        this.endtime = "";
	    }
	    this.currentPage=1;
		this.getHolidayFabricList();
  	},
  	handleSizeChange(val) {
      this.pageSize = val;
      this.getHolidayFabricList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getHolidayFabricList();
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.line{
	display: inline-block;
}
</style>
<style>
.holidayManagement .subnav_wrap .el-tabs__item {
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  vertical-align: baseline !important;
}
.holidayManagement .el-date-editor.el-input{
	width: auto!important;
}
.holidayManagement ul.childcontentlist li{
	line-height: 40px;
}
.holidayManagement button.el-button.el-button--text{
	font-size: 12px;
}
</style>