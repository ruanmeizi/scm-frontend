<template>
	<div class="addsuppliercontent">
		<!--供应商基本信息-->
		<div class="supplierbasic">
			<div class="comeback" style="margin:20px 0;">
				<i title="返回" class="el-icon-back" style="" @click="cancelclick()">返回</i>
			</div>
			<div class="supplierbasic_tit">
				<!-- <p>供应商基本信息</p> -->
				<h2 class="title">供应商基本信息</h2>
			</div>
			<div class="supplierbasic_form">
				<el-form :inline="true" :model="formInlinesupplier" :rules="rules" ref="ruleForm" class="demo-form-inline">
					<el-form-item label="供应商编号" prop="customerCode">
						<el-input v-model.trim="formInlinesupplier.customerCode" placeholder="供应商编号"></el-input>
					</el-form-item>
					<el-form-item label="供应商系统编号">
						<span>{{formInlinesupplier.customerId}}</span>
						<!-- <el-input v-model.trim="formInlinesupplier.customerId" placeholder="供应商系统编号"></el-input> -->
					</el-form-item>
					<el-form-item label="中文名称" prop="customerNameCh"> 
						<el-input v-model.trim="formInlinesupplier.customerNameCh" placeholder="中文名称"></el-input>
					</el-form-item>
					<el-form-item label="组织机构代码" prop="organizationCode">
						<el-input v-model.trim="formInlinesupplier.organizationCode" placeholder="组织机构代码"></el-input>
					</el-form-item>
					<el-form-item label="英文名称"  prop="customerNameEn">
						<el-input v-model="formInlinesupplier.customerNameEn" placeholder="英文名称"></el-input>
					</el-form-item>
					<el-form-item label="税务登记证号" prop="taxRegistrationCode">
						<el-input v-model.trim="formInlinesupplier.taxRegistrationCode" placeholder="税务登记证号"></el-input>
					</el-form-item>
					<el-form-item label="供应商状态">
						<el-select  v-model.trim="formInlinesupplier.customerStatus"   placeholder="供应商状态">
							<el-option v-for="item in this.supplierstatuslist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业执照号码" prop="businessLicenseOfLegalEntity">
						<el-input v-model.trim="formInlinesupplier.businessLicenseOfLegalEntity" placeholder="营业执照号码"></el-input>
					</el-form-item>
					<el-form-item label="供应商分类">
						<el-select  v-model.trim="formInlinesupplier.customerCategory"   placeholder="供应商分类">
							<el-option v-for="item in this.suppliertypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业执照有效起期">
						<el-date-picker v-model.trim="formInlinesupplier.startingDateOfBusinessLicens" :picker-options="pickerOptionsStart"  type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="法定代表人" prop="legalRepresentative">
						<el-input v-model.trim="formInlinesupplier.legalRepresentative" placeholder="法定代表人"></el-input>
					</el-form-item>
					<el-form-item label="营业执照有效止期">
						<el-date-picker v-model.trim="formInlinesupplier.expirationOfBusinessLicens" :picker-options="pickerOptionsEnd" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"  placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
						<el-input v-model.trim="formInlinesupplier.unifiedSocialCreditCode" placeholder="统一社会信用代码"></el-input>
					</el-form-item>
					<el-form-item label="企业成立日期">
						<el-date-picker v-model.trim="formInlinesupplier.dateOfEstablished" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					
					<!--<p class="title" style="font-weight: 600;color: #666769;">账户信息</p>
					<el-form-item label="币种分类">
						<select v-model.trim="formInlinesupplier.currency" placeholder="币种" class="selectstatus">
							<option v-for="item in this.accounttypelist" :key="item.index" :value="item.index" style="color: #606266;">{{item.name}}</option>
						</select>
					</el-form-item>-->
					
				</el-form>
				<div slot="footer" class="dialog-footer" style="text-align: right;margin-top:15px;">
					<el-button type="primary" v-preventReClick @click="draftsave('ruleForm','supplieradd')">保存</el-button>
				</div>
			</div>

		</div>
       
       
         
       
		<!--联系人信息-->
		<div class="linkmanmessage">
			<div class="supplierbasic_tit" style="display: flex;">
				<!-- <p>联系人信息</p> -->
				<h2 class="title">联系人信息</h2>
				<div class="button" style="flex: 1;text-align: right;">
					<el-button type="primary" @click="linkmanadd()">+新增联系人信息</el-button>
				</div>
			</div>
			<div class="supplierbasic_table">
                <!-- <el-table
				:data="tableDatalinkman"
				style="width: 100%"
				>
				 <el-table-column
					fixed
					prop="uuid"
					class="w12p"
					label="联系人编号">
					</el-table-column>
					<el-table-column
					prop="contactName"
					class="w12p"
					label="联系人姓名">
					</el-table-column>
					<el-table-column
					prop="contactTitle"
					class="w12p"
					label="联系人职位">
					</el-table-column>
					<el-table-column
					prop="contactTypename"
					class="w12p"
					label="联系人类型">
					</el-table-column>
					<el-table-column
					prop="mobilePhone"
					class="w8p"
					label="移动电话">
					</el-table-column>
					<el-table-column
					prop="communicateNum"
					class="w8p"
					label="社交软件号">
					</el-table-column>
					<el-table-column
					prop="officeTel"
					class="w8p"
					label="办公电话">
					</el-table-column>
					<el-table-column
					prop="fax"
					class="w8p"
					label="传真">
					</el-table-column>
					<el-table-column
					prop="email"
					class="w8p"
					label="邮箱">
					</el-table-column>
					<el-table-column
					prop="fixedLineTel"
					class="w8p"
					label="固定电话">
					</el-table-column>
					<el-table-column
					prop="addressUuid"
					class="w8p"
					label="地址编号">
					</el-table-column>
				   <el-table-column
					fixed="right"
					class="w8p"
					label="操作">
					<template slot-scope="scope">
						<el-button @click="dictionarylinkmanupd(scope.row)" type="text" size="small">修改</el-button>
						<el-button type="text" @click="dictionarylinkmandel(scope.row)" size="small">删除</el-button>
					</template>
					</el-table-column>
				</el-table> -->
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
						<th>操作</th>
					</thead>
					<tbody>
						<tr v-for="(item,index) in tableDatalinkman">
							<td :title="item.uuid" style="width: 80px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
								<span>{{item.uuid}}</span>
							</td>
							<td :title="item.contactName">
								<span >{{item.contactName}}</span>
							</td>
							<td :title="item.contactTitle">
								<span>{{item.contactTitle}}</span>
							</td>
							<td :title="item.contactTypename">
								<span>{{item.contactTypename}}</span>
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
							<td>
								<i type="primary" class="el-icon-edit" title="修改" @click="dictionarylinkmanupd(item)"></i>
								<i type="primary" class="el-icon-delete" title="删除" @click="dictionarylinkmandel(item)"></i>
							</td>
						</tr>
						<tr v-if="this.tableDatalinkman==''">
							<td colspan='12'>
								<p  class="noDataClass">暂无数据</p>
							</td>						
						</tr>
					</tbody>
				</table>
			</div>

			<div class="supplierbasic_form linkman" v-if="this.iflinkman==true">

				<el-form :inline="true" :model="formInlinelinkman" :rules="rules" ref="ruleFormlinkman" class="demo-form-inline">
					<el-form-item label="联系人类型">
						<el-select  v-model.trim="formInlinelinkman.contactType"   placeholder="联系人类型">
							<el-option v-for="item in this.linkmantypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="办公电话" prop="officeTel">
						<el-input v-model.trim="formInlinelinkman.officeTel" placeholder="办公电话"></el-input>
					</el-form-item>
					<el-form-item label="联系人职位" prop="contactTitle">
						<el-input v-model.trim="formInlinelinkman.contactTitle" placeholder="联系人职位"></el-input>
					</el-form-item>
					<el-form-item label="传真" prop="fax">
						<el-input v-model.trim="formInlinelinkman.fax" placeholder="传真"></el-input>
					</el-form-item>
					<el-form-item label="联系人姓名" prop="contactName">
						<el-input v-model.trim="formInlinelinkman.contactName" placeholder="联系人姓名"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email">
						<el-input v-model.trim="formInlinelinkman.email" placeholder="邮箱"></el-input>
					</el-form-item>
					<el-form-item label="移动电话" prop="mobilePhone">
						<el-input v-model.trim="formInlinelinkman.mobilePhone" placeholder="移动电话"></el-input>
					</el-form-item>
					<el-form-item label="固话电话" prop="fixedLineTel">
						<el-input v-model.trim="formInlinelinkman.fixedLineTel" placeholder="固话电话"></el-input>
					</el-form-item>
					<el-form-item label="社交软件号" prop="communicateNum">
						<el-input v-model.trim="formInlinelinkman.communicateNum" placeholder="社交软件号"></el-input>
					</el-form-item>
					<el-form-item label="地址信息" class="whole">
						<el-select  v-model.trim="formInlinelinkman.addressUuid" :disabled="titlefalselinkman" :title="this.titlefalse"  placeholder="址址信息">
							 <el-option
								v-for="item in this.addressmsgtypelist"
								:key="item.uuid"
								:label="(item.adddresname?item.adddresname:'')+'：'+(item.detailAddress?item.detailAddress:'')"
								:value="item.uuid">
								<span style="float: left">{{item.adddresname?item.adddresname:''}}：</span>
								<span style="color: #8492a6; font-size: 13px">{{ item.detailAddress?item.detailAddress:''}}</span>
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" style="text-align: right;margin-top:15px;">
					<el-button @click="cancelinkman">取消</el-button>
					<el-button type="primary" @click="draftsave('ruleFormlinkman','linkman')" v-preventReClick :disabled="ifformlinkman!=true" :title="title">保存</el-button>
				</div>
			</div>

		</div>

		<!--地址信息-->
		<div class="addressmessage">

			<div class="supplierbasic_tit" style="display: flex;">
				<!-- <p>地址信息</p> -->
				<h2 class="title">地址信息</h2>
				<div class="button" style="flex: 1;text-align: right;">
					<el-button type="primary" @click="addressadd()">+新增地址信息</el-button>
				</div>
			</div>

			<div class="supplierbasic_table">
				 <!-- <el-table
				:data="addressmsgtypelist"
				style="width: 100%"
				>
				 <el-table-column
					fixed
					prop="uuid"
					width="10%"
					label="地址编号">
					</el-table-column>
					<el-table-column
					prop="adddresname"
					class="w10p"
					label="地址类型">
					</el-table-column>
					<el-table-column
					prop="countryCode"
					class="w10p"
					label="地址所在国家代码">
					</el-table-column>
					<el-table-column
					prop="provinceCode"
					class="w10p"
					label="地址所在省代码">
					</el-table-column>
					<el-table-column
					prop="cityCode"
					class="w10p"
					label="地址所在市代码">
					</el-table-column>
					<el-table-column
					prop="countyCode"
					class="w10p"
					label="地址所在县代码">
					</el-table-column>
					<el-table-column
					prop="postCode"
					class="w10p"
					label="邮政编号">
					</el-table-column>
					<el-table-column
					prop="detailAddress"
					class="w10p"
					label="详细地址">
					</el-table-column>
				   <el-table-column
					fixed="right"
					class="w10p"
					label="操作">
					<template slot-scope="scope">
						<el-button @click="dictionaryupd(scope.row)" type="text" size="small">修改</el-button>
						<el-button type="text" @click="dictionarydel(scope.row)" size="small">删除</el-button>
					</template>
					</el-table-column>
				</el-table> -->
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
						<th>操作</th>
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
							<td>
								<i type="primary" class="el-icon-edit" title="修改" @click="dictionaryupd(item)"></i>
								<i type="primary" class="el-icon-delete" title="删除" @click="dictionarydel(item)"></i>
							</td>
						</tr>
						<tr v-if="this.addressmsgtypelist==''">
							<td colspan='9'>
								<p class="noDataClass" style="">暂无数据</p>
							</td>							
						</tr>
					</tbody>
				</table>
			</div>

			<div class="supplierbasic_form address" v-if="this.ifaddress==true">
				<el-form :inline="true" :model="formInlineaddress" :rules="rules" ref="ruleFormaddress" class="demo-form-inline">
					<el-form-item label="地址类型">
						<el-select  v-model.trim="formInlineaddress.addressType"   placeholder="地址类型">
							<el-option v-for="item in this.addresstypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="地址所在国家代码" prop="countryCode">
						<el-select  v-model.trim="formInlineaddress.countryCode"   placeholder="地址所在国家代码">
							<el-option v-for="item in this.addressstatetypelist"  :key="item.index" :value="item.index" :label="item.name"></el-option>
						</el-select>
						<!--<el-input v-model.trim="formInlineaddress.countryCode" placeholder="地址所在国家代码"></el-input>-->
					</el-form-item>
					<el-form-item label="地址所在省代码" prop="provinceCode">
						<el-input v-model.trim="formInlineaddress.provinceCode" placeholder="地址所在省代码"></el-input>
					</el-form-item>
					<el-form-item label="地址所在市代码">
						<el-input v-model.trim="formInlineaddress.cityCode" placeholder="地址所在市代码"></el-input>
					</el-form-item>
					<el-form-item label="地址所在县代码">
						<el-input v-model.trim="formInlineaddress.countyCode" placeholder="地址所在县代码"></el-input>
					</el-form-item>
					<el-form-item label="邮政编号">
						<el-input v-model.trim="formInlineaddress.postCode" placeholder="邮政编号"></el-input>
					</el-form-item>
					<el-form-item label="详细地址" class="adr" prop="detailAddress">
						<el-input v-model.trim="formInlineaddress.detailAddress" placeholder="详细地址"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer" style="text-align: right;margin-top:15px;">
					<el-button @click="canceaddress">取消</el-button>
					<el-button type="primary" @click="draftsave('ruleFormaddress','address')" v-preventReClick :disabled="ifformaddress!=true">保存</el-button>
				</div>
			</div>

		</div>

		<!--删除-->
		<el-dialog title="提示" v-dialogDrag :visible.sync="dialogdelVisible" :close-on-click-modal="false" width="30%">
			<span>确定删除该条{{this.deltag}}数据?</span>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="dialogdelVisible = false">取 消</el-button>
		    <el-button type="primary"  @click="delVisibleclick()" v-preventReClick>确 定</el-button>
		  </span>
		</el-dialog>

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
		linkmanapidel,
		addressapidel,
		getaddressstatetype,
		getaccountstatetype
	} from "@/api/module/supplierApi.js";
	export default {
		name: "addsuppliercontent",
		props: ['formInlinesupplier', 'tableDatalinkman', 'addressmsgtypelist', 'updatag'],
		data() {
			return {
				linkmanupd: '',
				deltag: '',
				delid: '',
				supplierName: '',
				supplierinnerCode: '',
				value1: '',
				title: '',
				titlefalse: '',
				titleaddress: '',
				zaichanglist: [],
				supplierstatuslist: [],
				suppliertypelist: [],
				linkmantypelist: [],
				addresstypelist: [],
				addressmsgtypelist: [],
				addressstatetypelist:[],
				accounttypelist:[],
				ifaddsure: false,
				iflinkman: false,
				ifaddress: false,
				ifformlinkman: false,
				ifformaddress: false,
				titlefalselinkman: true,
				dialogdelVisible: false,
				rules: {
		          customerNameCh: [
		            { min:1, max:128, message: '超长字符', trigger: 'blur' }
		          ],
		          customerCode:[
					{ required: true, message: '请输入供应商编号', trigger: 'blur' },
		            { min:1, max:128, message: '超长字符', trigger: 'blur' }
		          ],
		          legalRepresentative:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          organizationCode:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          taxRegistrationCode:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          customerNameEn:[
					{ min:1, max:128, message: '超长字符', trigger: 'blur' },
					{ validator:function(rule,value,callback){
						console.log(value)
		//              校验中文的正则：/^[\u4e00-\u9fa5]{0,}$/
		               console.log(/[\u4E00-\u9FA5]/g.test(value))
						// if(/^([A-Za-z]+\s?)*[A-Za-z]$/.test(value)== false){
						if(/[\u4E00-\u9FA5]/g.test(value)== true){
							callback(new Error("请输入正确的英文格式"));
						}else{
							//校验通过
							callback();
						}
						}, trigger: 'blur'
					}
		          ],
		          businessLicenseOfLegalEntity:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          unifiedSocialCreditCode:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          contactName: [
		            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          mobilePhone: [
		            { required: true, message: '请输入移动电话', trigger: 'blur' },
		            { min:1, max:11, message: '超长字符', trigger: 'blur' }
		          ],
		          officeTel:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          contactTitle:[
		            { min:1, max:32, message: '超长字符', trigger: 'blur' }
		          ],
		          fax:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],		          
		          email:[
                     { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
		          ],
		          fixedLineTel:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          communicateNum:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          addressType:[
		            { required: true, message: '请选择地址类型', trigger: 'change' }
		          ],
		          countryCode:[
		            { required: true, message: '请选择地址所在国家代码', trigger: 'change'}
		          ],
		          provinceCode:[
		            { min:1, max:64, message: '超长字符', trigger: 'blur' }
		          ],
		          detailAddress:[
		            { min:1, max:255, message: '超长字符', trigger: 'blur' }
		          ]
		       },
				formInlinesupplier: {
					customerCode: '',
					organizationCode: '',
					customerNameCh: '',
					taxRegistrationCode: '',
					customerNameEn: '',
					businessLicenseOfLegalEntity: '',
					customerStatus: '',
					startingDateOfBusinessLicens: '',
					customerCategory: '',
					expirationOfBusinessLicens: '',
					legalRepresentative: '',
					dateOfEstablished: '',
					unifiedSocialCreditCode: '',
					uuid: '',
				},
				formInlinelinkman: {
					contactTitle: '',
					officeTel: '',
					fax: '',
					contactName: '',
					email: '',
					mobilePhone: '',
					fixedLineTel: '',
					communicateNum: '',
					customerUuid: '',
					addressUuid: '',
					uuid: ''
				},
				formInlineaccount:{
					uuid:''
				},
				formInlineaddress: {
					addressType: '',
					countryCode: '',
					provinceCode: '',
					cityCode: '',
					countyCode: '',
					postCode: '',
					detailAddress: '',
					uuid: ''
				},
				tableDatalinkman: [],
				tableDataaddress: [],
				pickerOptions0:{
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.formInlinesupplier.expirationOfBusinessLicens;
						if (endDateVal) {
						return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.formInlinesupplier.startingDateOfBusinessLicens;
						if (beginDateVal) {
						return (
							time.getTime() <
							new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
						);
						}
					}
				},
			};
		},
		computed: {
//			rules(){
//			    var validatecustomerNameEn = (rule, value, callback) => {
//			        let reg = /^[A-Za-z]+$/
//			        if (!reg.test(value)) {
//			          callback(new Error('只能是英文格式'))
//			        } else {
//			          callback()
//			        }
//			    };
//				return {
//			        customerNameEn: [
//			          { validator: validateSurnmae, trigger: "blur" },
//			          { min: 1, max:64, message:'超长字符', trigger: "blur" }
//			        ],
//				}
//			}
		},
		components: {},
		created() {

		},
		mounted() {
			if(this.updatag == '新增') {
				this.title = "请先添加供应商基本信息"
				this.titleaddress = "请先添加供应商基本信息"
				this.titlefalse = "可先添加地址基本信息才可选择(非必选)";
			} else {
				this.ifformlinkman = true;
				this.ifformaddress = true;
				this.title = "保存"
				this.titleaddress = "保存"
				this.addressmessagetype();
			}
			console.log(localStorage.getItem("formInlinesupplieruuid"))
			this.formInlinesupplier = {};
			this.formInlinelinkman = {};
			this.formInlineaddress = {};
			this.tableDatalinkman = [];
			this.addressmsgtypelist = [];
			this.supplierstatus();
			this.suppliertype();
			this.addresstype();
			this.addressstatetype();
			this.accounttype();
			//this.supplierSearch();
		},
		watch: {

		},
		methods: {
			//币种分类
			accounttype(){
				getaccountstatetype().then(response => {
					if(response.code === "0") {
						this.accounttypelist = response.data;
					}
				});
			},
			//地址国家分类
			addressstatetype() {
				getaddressstatetype().then(response => {
					if(response.code === "0") {
						this.addressstatetypelist = response.data;
					}
				});
			},
			//供应商状态
			supplierstatus() {
				getsupplierstatus().then(response => {
					if(response.code === "0") {
						this.supplierstatuslist = response.data;
					}
				});
			},
			//供应商分类
			suppliertype() {
				getsuppliertype().then(response => {
					if(response.code === "0") {
						this.suppliertypelist = response.data;
					}
				});
			},
			//联系人类型
			linkmantype() {
				getlinkmantype().then(response => {
					if(response.code === "0") {
						this.linkmantypelist = response.data;
					}
				});
			},
			//地址信息列表及展示table表格
			addressmessagetype() {
				getaddressmessagetype(this.formInlinesupplier.uuid).then(response => {
					if(response.code === "0") {
						this.addressmsgtypelist = response.data;
						console.log(this.addressmsgtypelist);
						for(var i = 0; i < this.addressmsgtypelist.length; i++) {
							let item = this.addressmsgtypelist[i];
							for(var j = 0; j < this.addresstypelist.length; j++) {
								let data = this.addresstypelist[j];
								if(item.addressType == data.index) {
									item.adddresname = data.name;
								}
							}
						}
						this.titlefalselinkman = false;
						this.titlefalse = "";
						this.$forceUpdate()
					}
				});
			},
			//地址类型
			addresstype() {
				getaddresstype().then(response => {
					if(response.code === "0") {
						this.addresstypelist = response.data;
					}
				});
			},
			getuuid() {
				purchasegetuuid().then(response => {
					if(response.code === "0") {
						this.formInlinesupplier.uuid = response.data;
						this.$forceUpdate()
						console.log(this.formInlinesupplier.uuid)
					}
				});
			},
			supplierSearch() {
				let obj = {
					materialCode: this.materialCode,
					detailType: "material",
					validDate: this.value1
				}
				const loading = this.$loading({
					lock: true,
					text: 'Loading',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
				stocktotalserch(this.currentPage, this.pageSize, obj).then(response => {
					if(response.code === "0") {
						this.allpage = response.data.totalElements;
						this.stockupList = response.data.content;
						loading.close();
					} else {
						loading.close();
					}
				});
				setTimeout(() => {
					loading.close();
				}, 10000);
			},
			//供应商基本信息取消
			cancelclick() {
				this.$emit('close', 'addsupplier')
			},
			//供应商基本信息保存
			draftsave(formName,tag) {		
				
				this.title = "请先添加供应商基本信息"
				this.titleaddress = "请先添加供应商基本信息"
				console.log(this.updatag)
				if(this.updatag == '新增') {
					console.log(this.formInlinesupplier)
					console.log(this.formInlinesupplier.customerNameCh)
					
					this.$refs[formName].validate((valid) => {
			          if (valid) {
			            if(this.linkmanupd == '子项修改') {
							if(tag == 'linkman') {
								this.draftsavelinkman();
							}
							if(tag == 'address') {
								this.draftsaveaddress();
							}
						} else {
							purchasegetuuid().then(response => {
								if(response.code === "0") {
									if(tag == 'supplieradd') {
										localStorage.setItem("formInlinesupplieruuid",response.data);
										this.formInlinesupplier.uuid=localStorage.getItem("formInlinesupplieruuid");
										this.save();
									}
									if(tag == 'linkman') {
										this.formInlinesupplier.uuid
										this.formInlinelinkman.uuid = response.data;
										this.formInlinelinkman.customerUuid = this.formInlinesupplier.uuid;
										this.draftsavelinkman();
									}
									if(tag == 'address') {
										this.formInlineaddress.uuid = response.data;
										this.formInlineaddress.customerUuid = this.formInlinesupplier.uuid;
										this.draftsaveaddress();
									}
								}
							});
						}			                    
			          } else {
			            console.log('error submit!!');
			            return false;
			          }
			        });
			 } else {					
				    this.$refs[formName].validate((valid) => {
				        if (valid) {
				            if(tag == 'supplieradd') {
								this.save();
							} else {
								if(this.linkmanupd == '子项修改') {
									if(tag == 'linkman') {
										this.draftsavelinkman();
									}
									if(tag == 'address') {
										this.draftsaveaddress();
									}
								} else {
									purchasegetuuid().then(response => {
										if(response.code === "0") {
											if(tag == 'linkman') {
												this.formInlinesupplier.uuid
												this.formInlinelinkman.uuid = response.data;
												this.formInlinelinkman.customerUuid = this.formInlinesupplier.uuid;
												this.draftsavelinkman();
											}
											if(tag == 'address') {
												this.formInlineaddress.uuid = response.data;
												this.formInlineaddress.customerUuid = this.formInlinesupplier.uuid;
												this.draftsaveaddress();
											}
										}
									});
								}
							}
				            
				        } else {
				            console.log('error submit!!');
				            return false;
				        }
			        });				
					
				}
			},
			save() {
				console.log(this.formInlinesupplier.uuid)
				console.log(localStorage.getItem("formInlinesupplieruuid"))
				supplierapiadd(this.formInlinesupplier).then(response => {
					if(response.code === "0") {
						
						if(this.updatag == '新增') {
							this.ifformlinkman = true;
							this.ifformaddress = true;
							this.title = "保存"
							this.titleaddress = "保存"
							this.$message({
								message: '添加成功',
								type: 'success'
							});
						}else{
							this.$message({
								message: '修改成功',
								type: 'success'
							});
						}
						//						this.formInlinesupplier=[];
					}
				});

			},
			//联系人单条修改
			dictionarylinkmanupd(item) {
				console.log(item);
				this.iflinkman = true;
				this.linkmantype();
				linkmanapidetail(item.uuid).then(response => {
					if(response.code === "0") {
						this.formInlinelinkman = response.data;
						this.linkmanupd = '子项修改';
						console.log(this.tableDatalinkman)
					}
				});
			},
			//联系人单条删除
			dictionarylinkmandel(item) {
				this.deltag = '联系人';
				this.delid = item.uuid;
				this.dialogdelVisible = true;
			},
			//新增联系人信息
			linkmanadd() {
				console.log(localStorage.getItem("formInlinesupplieruuid"))
				this.iflinkman = true;
				this.formInlinelinkman = {};
				this.linkmanupd = '子项新增';
				this.linkmantype();
			},
			//联系人取消
			cancelinkman() {
				this.iflinkman = false;
			},
			//联系人展示列表
			linkmanlist() {
				console.log(this.formInlinesupplier.uuid)
				linkmanapishow(this.formInlinesupplier.uuid).then(response => {
					if(response.code === "0") {
						this.tableDatalinkman = response.data;
						for(var i=0;i<this.tableDatalinkman.length;i++){
							var item=this.tableDatalinkman[i];
							for(var j=0;j<this.linkmantypelist.length;j++){
								var data=this.linkmantypelist[j];
								if(item.contactType==data.index){
									item.contactTypename=data.name;
								}
							}
						}
						console.log(this.tableDatalinkman)
					}
				});
			},
			//联系人保存
			draftsavelinkman() {
				console.log(this.formInlinelinkman)
				console.log(this.formInlinelinkman.contactName)
				if(this.formInlinesupplier.uuid == '') {
					this.ifformlinkman = false;
					this.$message({
						message: '请先添加供应商基本信息！！',
						type: 'error'
					});
				}
				if(this.formInlinelinkman.contactName==''||this.formInlinelinkman.contactName == undefined|| this.formInlinelinkman.mobilePhone == ''||this.formInlinelinkman.mobilePhone==undefined){
					this.$message({
						message: '必填项不能为空！！',
						type: 'error'
					});
				}else{
					linkmanapiadd(this.formInlinelinkman).then(response => {
						if(response.code === "0") {
							this.$message({
								message: '添加成功',
								type: 'success'
							});
							this.iflinkman = false;
							this.formInlinelinkman = {};
							this.linkmanlist();
						}
					});
				}
			},
			//新增地址
			addressadd() {
				this.ifaddress = true;
				this.formInlineaddress = {};
				this.linkmanupd = '子项新增';
			},
			//地址取消
			canceaddress() {
				this.ifaddress = false;
			},
			//地址信息修改
			dictionaryupd(item) {
				console.log(item)
				addressapidetail(item.uuid).then(response => {
					if(response.code === "0") {
						this.formInlineaddress = response.data;
						this.ifaddress = true;
						this.linkmanupd = '子项修改';
					}
				});
			},
			//地址信息删除
			dictionarydel(item) {
				this.deltag = '地址';
				this.delid = item.uuid;
				this.dialogdelVisible = true;
			},
			//地址确认
			draftsaveaddress() {
				this.titleaddress = '保存'
				if(this.formInlinesupplier.uuid == '') {
					this.ifformaddress = false;
					this.$message({
						message: '请先添加供应商基本信息！！',
						type: 'error'
					});
				}
				if(this.formInlineaddress.countryCode == '' ||this.formInlineaddress.countryCode==undefined) {
					this.$message({
						message: '必填项不能为空！！',
						type: 'error'
					});
				} else {
					console.log(this.formInlineaddress)
					addressapiadd(this.formInlineaddress).then(response => {
						if(response.code === "0") {
							this.$message({
								message: '添加成功',
								type: 'success'
							});
							this.ifaddress = false;
							this.formInlineaddress = {};
							this.addressmessagetype();
						}
					});
				}
			},
			//确认删除
			delVisibleclick() {
				console.log('删除删除')
				console.log(this.deltag)
				if(this.deltag == '联系人') {
					console.log('联系人')
					linkmanapidel(this.delid).then(response => {
						if(response.code === "0") {
							this.$message({
								message: this.deltag + '删除成功！',
								type: 'success'
							});
							this.dialogdelVisible = false;
							this.linkmanlist();
						}
					});
				} else if(this.deltag == '地址') {
					console.log('地址')
					addressapidel(this.delid).then(response => {
						if(response.code === "0") {
							this.$message({
								message: this.deltag + '删除成功！',
								type: 'success'
							});
							// console.log(this.tableDatalinkman)
							// this.tableDatalinkman.forEach((item, index) => {
							// 	if(this.delid==item.addressUuid){
							// 		item.addressUuid='';
							// 	}
							// });
							this.dialogdelVisible = false;
							this.iflinkman = false;
							this.addressmessagetype();
						}
					});
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../../styles/index.scss";
	.title {
		// margin-bottom: 30px;
		padding: 0 20px;
		font-size: 17px;
		color: #606266;
	}
	.noDataClass{
		color: #909399;
		font-size: 14px;
	}
	.ml {
		margin-left: 10px;
	}
	
	.linkmanmessage,
	.addressmessage {
		margin-top: 20px;
	}
	
	i.el-icon-back {
		color: #409eff;
		font-size: 18px;
		cursor: pointer;
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
	
	i.el-icon-view {
		font-size: 20px;
		color: #409eff;
		margin-left: 10px;
		cursor: pointer;
	}
	
	.supplierbasic_form {
		margin-top: 10px;
	}
	
	.supplierbasic_tit {
		p {
			font-weight: 600;
			color: #666769;
		}
	}
	
	table.contenttab {
		span {
			width: 94px;
			display: inline-block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 14px!important;
            color: #606266!important;
		}
		/*th{
		width: 100px;
	}
	td{
		width: 100px;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}*/
	}
</style>
<style>
.supplierbasic_form.linkman form.el-form.demo-form-inline.el-form--inline .el-form-item:last-child .el-form-item__content .el-select{
	width:100%;
}
.supplierbasic_form.linkman form.el-form.demo-form-inline.el-form--inline .el-form-item:last-child .el-form-item__content .el-select .el-input.el-input--suffix{
	width:100%;
}
.supplierbasic_form.linkman form.el-form.demo-form-inline.el-form--inline .el-form-item:last-child .el-form-item__content .el-select .el-input.el-input--suffix input.el-input__inner{
    width: 100%;
}
</style>