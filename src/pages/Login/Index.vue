<template>
  <div class="user-login">
      <div class="login">
      <img style="position: absolute;top: 10px;" src="../../assets/image/touming_logo.png" />
			<div class="w100p">
					<h3>意厉维欢迎你</h3>
					<!--<form action="#" name="f" method="post">
						<div class="input_outer">
							<span class="u_user"></span>
							<input name="logname" class="text" style="color: #FFFFFF !important" type="text" placeholder="请输入账户">
						</div>
						<div class="input_outer">
							<span class="us_uer"></span>
							<input name="logpass" class="text" style="color:#FFFFFF !important; position:absolute; z-index:100;"value="" type="password" placeholder="请输入密码">
						</div>
						<div class="mb2"><a class="act-but submit" href="javascript:;" style="color: #FFFFFF">登录</a></div>
					</form>-->
					
					
					
					<div class="login-form-container">
		        <el-form ref="form" :model="user" :rules="rules">
		          <el-form-item prop="phone">
		            <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="user.phone"></el-input>
		          </el-form-item>
		
		          <el-form-item prop="password">
		            <el-input
		              prefix-icon="el-icon-lock"
		              type="password"
		              placeholder="请输入密码"
		              @keyup.enter.native="submit"
		              v-model="user.password"
		            ></el-input>
		          </el-form-item>
		
		          <!--<el-form-item v-if="false">
		            <el-col :span="10">
		              <el-form-item prop="imageVerifyCode">
		                <el-input v-model="user.imageVerifyCode" placeholder="验证码"></el-input>
		              </el-form-item>
		            </el-col>
		
		            <el-col :span="8" :offset="1">
		              <el-form-item>
		                <captcha @sendCaptchaInfo="getCaptchaInfo"></captcha>
		              </el-form-item>
		            </el-col>
		          </el-form-item>-->
		
		          <el-form-item>
		            <el-button type="primary" class="submit-btn" @click="submit" :loading="loginLoading">登录</el-button>
		          </el-form-item>
		        </el-form>
	      </div>
					
			</div>
			
			<vue-particles
	        color="#dedede"
	        :particleOpacity="0.7"
	        :particlesNumber="80"
	        shapeType="circle"
	        :particleSize="4"
	        linesColor="#dedede"
	        :linesWidth="1"
	        :lineLinked="true"
	        :lineOpacity="0.4"
	        :linesDistance="150"
	        :moveSpeed="3"
	        :hoverEffect="true"
	        hoverMode="grab"
	        :clickEffect="true"
	        clickMode="push"
	      > 
	     </vue-particles>
	  </div>
  </div>
</template>

<script>
import qs from 'qs';
import '../../components/keycloak.js'
export default {
  components: {
//  Captcha
  },
  data() {
    const validateVerifyCode = (rule, value, callback) => {
      if (value) {
        validCaptcha({
          encodeImageCode: this.captchaInfo.encodeImageCode,
          imageVerifyCode: this.user.imageVerifyCode
        }).then(response => {
          if (response.code === "0") {
            callback();
          } else {
            callback(new Error("验证码错误"));
          }
        });
      } else {
        callback(new Error("请输入验证码"));
      }
    };
    return {
      captchaInfo: {
        encodeImageCode: ""
      },
      user: {
        phone: "",
        password: "",
        imageVerifyCode: "",
        expireType: "1"
      },
      rules: {
        imageVerifyCode: [{ required: true, validator: validateVerifyCode, trigger: "blur" }],
        phone: [{ required: true, message: "手机号不能为空" }],
        password: [{ required: true, message: "密码不能为空" }]
      },

      loginLoading: false,
      token:'',
    };
  },
  created(){
//		this.ssologin();
		console.log(this.$store.state.access_token)
  },
  methods: {
  	ssologin(){
			 let keycloak = null;
	     keycloak = Keycloak({
	        url: 'http://192.168.80.2:8008/auth',
	        realm: 'demo',
	        clientId:'myapp'
	     });
	     
	     keycloak.init({onLoad: 'login-required'}).success(function (authenticated) {
        //alert(authenticated ? 'authenticated' : 'not authenticated');
        if (!authenticated) {
          alert('not authenticated')
        } else {
          keycloak.loadUserProfile().success(data => {
            console.info(data)
          })
        }
        console.info(keycloak)
      }).error(function () {
        alert('failed to initialize');
      });
	    
  	},
    getCaptchaInfo(data) {
      this.captchaInfo.encodeImageCode = data.encodeImageCode;
    },
    login() {
    	console.log(this.user.phone)
    	console.log(this.user.password)
      this.loginLoading = true;     
      let obj={
				grant_type:'password',
				client_id:'myapp',
				username:this.user.phone,
				password:this.user.password
			}
  		singleSignon(qs.stringify(obj)).then(response=>{
			  console.log(response);
			  if(response!=''){
			  	this.loginLoading = false;
			  	 this.token=response.data;
				  localStorage.setItem("access_token", this.token.access_token);
				  this.$store.state.access_token=this.token.access_token;
				  localStorage.setItem("refresh_token", this.token.refresh_token);
				  this.$store.state.refresh_token=this.token.refresh_token;
			  }
			 
  		})
//    login(this.user).then(response => {
//      if (response.code === "0") {
//        localStorage.navList = JSON.stringify(response.data.menu);
//        localStorage.realName = response.data.realName;
//        localStorage.token = response.data.token;
//        localStorage.refreshToken = response.data.refreshToken;
//        localStorage.id = response.data.id;
//
//        this.$router.push({ path: "/" });
//      }
//      this.loginLoading = false;
//    });
    },

    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.login();
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/component.css";

input.el-input__inner{
	color: #FFFFFF !important
}
.box{
	position: absolute;
	top: 50%;
	left: 50%;
	margin-left:-150px;
	margin-top: -220px;
	padding:20px 10px;
}
.box h3{
	text-align: center;
	height: 20px;
	font: 20px "microsoft yahei",Helvetica,Tahoma,Arial,"Microsoft jhengHei",sans-serif;
	color: #FFFFFF;
	height: 20px;
	line-height: 20px;
	/*padding:0 0 35px 0;*/ 
}
div#particles-js {
   width: 100%;
   height: 100%;
   min-height: 720px;
  background-image: url('../../assets/image/demo-1-bg.jpg');
  background-size: 100% 100%;
}
.user-login {
  height: 100%;
  /*background: url("../../assets/tuxedo-pack-1920.png") 100% no-repeat;*/
  background-size: cover;
  position: relative;
}

.welcome-text {
  color:#51b5e2;
  font-size: 22px;
  position: absolute;
  left: 100px;
  top: 100px;
}

.login-container {
  box-sizing: border-box;
  width: 400px;
  /*background-color: rgba(255, 255, 255, 0.8);*/
  background: #e1e1e1;
  border-radius: 6px;
  position: absolute;
  left: 75%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.login-title {
  text-align: center;
  color: #3b3b3c;
  font-size: 18px;
  height: 60px;
  line-height: 60px;
  /*background-color: rgba(255, 255, 255, 0.4);*/
  background: rgb(209, 209, 209);
  border-radius: 6px 6px 0 0;
  font-weight: 400;
}

.login-form-container {
  padding: 24px;

  .el-form-item {
    margin-bottom: 20px;

    .el-form-item__content {
      .el-input__inner {
        line-height: 50px;
        height: 50px;
        padding-left: 36px;
        border-color: #fff;
      }

      .el-input__prefix,
      .el-input__suffix {
        color: #FFFFFF;
        font-size: 20px;
        margin-left: 5px;
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 50px;
    font-size: 16px;
    background: #51b5e2;
    margin-top: 10px;
  }

  .link {
    color: #606266;
    font-size: 12px;
  }
}
</style>
