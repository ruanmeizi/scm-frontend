<template>
	<div class="showsuppliercontent">
		<div class="supplierbasic">
			<div class="comeback" style="margin:20px 0;">
				<i title="返回" class="el-icon-back" style="" @click="back()">返回</i>
			</div>
		   <div class="supplierbasic_tit" style="margin-top: 10px;">
		   	 <!-- <p>供应商基本信息</p> -->
			 <h2 class="title">供应商基本信息</h2>
		   </div>
		   <div class="supplierbasic_form">
				<el-form :inline="true" :model="formInlinesupplierlist" ref="ruleForm" class="demo-form-inline">
					<el-form-item label="供应商编号" prop="customerCode">
						<span>{{formInlinesupplierlist.customerCode}}</span>
					</el-form-item>
					<el-form-item label="供应商系统编号">
						<span>{{formInlinesupplierlist.customerId}}</span>
					</el-form-item>
					<el-form-item label="中文名称" prop="customerNameCh"> 
						<span>{{formInlinesupplierlist.customerNameCh}}</span>
					</el-form-item>
					<el-form-item label="组织机构代码" prop="organizationCode">
						<span>{{formInlinesupplierlist.organizationCode}}</span>
					</el-form-item>
					<el-form-item label="英文名称"  prop="customerNameEn">
						<span>{{formInlinesupplierlist.customerNameEn}}</span>
					</el-form-item>
					<el-form-item label="税务登记证号" prop="taxRegistrationCode">
						<span>{{formInlinesupplierlist.taxRegistrationCode}}</span>
					</el-form-item>
					<el-form-item label="供应商状态">
						<span>{{formInlinesupplierlist.customerStatusname}}</span>
					</el-form-item>
					<el-form-item label="营业执照号码" prop="businessLicenseOfLegalEntity">
						<span>{{formInlinesupplierlist.businessLicenseOfLegalEntity}}</span>
					</el-form-item>
					<el-form-item label="供应商分类">
						<span>{{formInlinesupplierlist.customerCategoryname}}</span>
					</el-form-item>
					<el-form-item label="营业执照有效起期">
						<span>{{formInlinesupplierlist.startingDateOfBusinessLicens}}</span>
					</el-form-item>
					<el-form-item label="法定代表人" prop="legalRepresentative">
						<span>{{formInlinesupplierlist.legalRepresentative}}</span>
					</el-form-item>
					<el-form-item label="营业执照有效止期">
						<span>{{formInlinesupplierlist.expirationOfBusinessLicens}}</span>
					</el-form-item>
					<el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
						<span>{{formInlinesupplierlist.unifiedSocialCreditCode}}</span>
					</el-form-item>
					<el-form-item label="企业成立日期">
						<span>{{formInlinesupplierlist.dateOfEstablished}}</span>
					</el-form-item>
					
				</el-form>
			   	
		   </div>
		   
		</div>
		
		<!--联系人信息--> 
		<div class="linkmanmessage">
		   <div class="supplierbasic_tit" style="display: flex;">
		   	 <!-- <p>联系人信息</p> -->
			 <h2 class="title">联系人信息</h2>
		   </div>
		   <div class="supplierbasic_table">
	    
		    <table class="contenttab" cellpadding="0" cellspacing="0">
				    	<thead>
				    		<th>联系人编号</th>
				    		<th>联系人姓名</th>
				    		<th>联系人职位</th>
				    		<th>联系人类型</th>
				    		<th>移动电话</th>
				    		<th>社交软件号</th>
				    		<th>办公电话</th>
				    		<th>传真</th>
				    		<th>邮箱</th>
				    		<th>固定电话</th>
				    		<th>地址编号</th>
				    	</thead>
				    	<tbody>
				    		<tr v-for="(item,index) in tableDatalinkman">			    			
				    			<td :title="item.uuid" style="width: 80px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
									<span>{{item.uuid}}</span>
				    			</td>
				    			<td :title="item.contactName">
									<span style="width:70px;">{{item.contactName}}</span>
				    			</td>
				    			<td :title="item.contactTitle">
				    				<span style="width:70px;">{{item.contactTitle}}</span>
				    			</td>
				    			<td :title="item.contactTypename">
				    				<span style="width:70px;">{{item.contactTypename}}</span>
				    			</td>
				    			<td :title="item.mobilePhone">
				    				<span>{{item.mobilePhone}}</span>									
				    			</td>
				    			<td :title="item.communicateNum">
				    				<span>{{item.communicateNum}}</span>									
				    			</td>
				    			<td :title="item.officeTel">
				    				<span>{{item.officeTel}}</span>								
				    			</td>
				    			<td :title="item.fax">
				    				<span>{{item.fax}}</span>									
				    			</td>
				    			<td :title="item.email">
				    				<span>{{item.email}}</span>									
				    			</td>
				    			<td :title="item.fixedLineTel">
				    				<span>{{item.fixedLineTel}}</span>									
				    			</td>
				    			<td :title="item.addressUuid">
				    				<span>{{item.addressUuid}}</span>									
				    			</td>
				    		</tr>
							<tr v-if="this.tableDatalinkman==''">
								<td colspan='11'>
									<p class="noDataClass" style="">暂无数据</p>
								</td>							
							</tr>
				    	</tbody>
				  </table>
		   </div> 
		   
		</div>
		
		<!--地址信息-->
		<div class="addressmessage">
			
		   <div class="supplierbasic_tit" style="display: flex;">
		   	 <!-- <p>地址信息</p> -->
			 <h2 class="title">地址信息</h2>
		   </div>
		  
		    <div class="supplierbasic_table">	    
			    <table class="contenttab" cellpadding="0" cellspacing="0">
			    	<thead>
			    		<th>地址编号</th>
			    		<th>地址类型</th>
			    		<th>地址所在国家代码</th>
			    		<th>地址所在省代码</th>
			    		<th>地址所在市代码</th>
			    		<th>地址所在县代码</th>
			    		<th>邮政编号</th>
			    		<th>详细地址</th>
			    	</thead>
			    	<tbody>
			    		<tr v-for="(item,index) in addressmsgtypelist">			    			
			    			<td :title="item.uuid">
			    				<span>{{item.uuid}}</span>								
			    			</td>
			    			<td :title="item.adddresname">
			    				<span>{{item.adddresname}}</span>
								
			    			</td>
			    			<td :title="item.countryCode">
			    				<span>{{item.countryCode}}</span>
			    			</td>
			    			<td :title="item.provinceCode">
			    				<span>{{item.provinceCode}}</span>
								
			    			</td>
			    			<td :title="item.cityCode">
			    				<span>{{item.cityCode}}</span>
								
			    			</td>
			    			<td :title="item.countyCode">
			    				<span>{{item.countyCode}}</span>
								
			    			</td>
			    			<td :title="item.postCode">
			    				<span>{{item.postCode}}</span>
								
			    			</td>
			    			<td :title="item.detailAddress">
			    				<span>{{item.detailAddress}}</span>
			    			</td>
			    		</tr>
						<tr v-if="this.addressmsgtypelist==''">
							<td colspan='8'>
								<p class="noDataClass" style="">暂无数据</p>
							</td>							
						</tr>
			    	</tbody>
			  </table>
		   </div> 
		</div>
		
		
	</div>
</template>

<script>
import { 
	purchasegetuuid,
	supplierapiadd,
	linkmanapiadd,
	addressapiadd,
	getsupplierstatus,
	getsuppliertype,
	getlinkmantype,
	getaddresstype,
	getaddressmessagetype,
	linkmanapishow,
	linkmanapidetail,
	addressapidetail,
} from "@/api/module/supplierApi.js";
	export default {
	  name: "showsuppliercontent",
	  props:['formInlinesupplierlist','tableDatalinkman','addressmsgtypelist'],
	  data() {
	    return {
	       supplierstatuslist:[],
	  	   suppliertypelist:[],
	       pickerOptions0: {
		      disabledDate(time) {
		        return time.getTime() < Date.now() - 8.64e7;
		      }
		    }
	    };
	  },
	  components: {},
	  created() {
	    
	  },
	  mounted() {
	  	console.log(this.supplierviewlist)
	  	this.supplierstatus();
	  	this.suppliertype();
	  	this.showlist();
	  },
	  watch: {
	    
	    
	  },  
	  methods: {
	  	//供应商状态
	  	supplierstatus(){
	  		getsupplierstatus().then(response => {
				if(response.code === "0") {
					this.supplierstatuslist = response.data;
				}
			});
	  	},
	  	//供应商分类
	  	suppliertype(){
	  		getsuppliertype().then(response => {
				if(response.code === "0") {
					this.suppliertypelist = response.data;
				}
			});
	  	},
	  	showlist(){
	  		
	  	},
	  	back(){
	  		this.$emit('close','show')
	  	}
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../styles/index.scss";
.title {
	font-size: 17px;
	color: #606266;
}
.noDataClass{
	color: #909399;
	font-size: 14px;
}
ul.showsupplist{
	width: 100%;
	height:380px;
	margin-top: 20px;
	li{
		width:50%;
		height:50px;
		border-bottom: 1px solid #CCCCCC;
		span{
			// display: inline-block;
			padding:15px 0;
			font-size: 14px;
			color: #606266;
			line-height: 50px;
			font-weight: normal;
		}
	}
	li:last-child{
		// border-bottom: none;
	}
}
.supplierbasic_form{
	/*height: auto;*/
}
.ml{
	margin-left: 10px;
}
.linkmanmessage,.addressmessage{
	margin-top: 20px;
}

select.selectstatus {
	width: 200px;
	height:40px;
	border-radius: 5px;
	border: 1px solid #DCDFE6;
	text-indent: 1em;
	color: #606266;
	line-height: 20px;
	/*cursor: pointer;*/
	font-size: 14px;
}

select.selectstatus>option {
	/*cursor: pointer;*/
	font-size: 14px;
}
select.selectstatus{
background: #FFFFFF;   
}
i.el-icon-view{
	font-size: 20px;
    color: #409eff;
    margin-left: 10px;
    cursor: pointer;
}
.supplierbasic_form{
	margin-top:10px;
}
.supplierbasic_tit{
	p{
		font-weight:600;
		color:#666769;
	}
}
table.contenttab{
	span{
		width:94px;
		display: inline-block;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		font-size: 14px!important;
        color: #606266!important;
	}
}
i.el-icon-back{
	color:#409eff;
	font-size:18px;
	cursor: pointer;
}
</style>