<template>
    <div class="header-container">
        <div class="wrapper">
        <!-- logo -->
            <div class="left-wrapper v-link selected">
                <img style="width: 50px" width="50" height="50" src="~assets/images/logo.png">
                <span class="text">尚医通 预约挂号统一平台</span>
            </div>
        <!-- 右侧 -->
        <div class="right-wrapper">
          <span class="v-link clickable">帮助中心</span>

          <span v-if="name == ''" class="v-link clickable" @click="showLogin()" id="loginDialog">登录/注册</span>
          
          <el-dropdown v-if="name != ''" @command="loginMenu">
                <span class="el-dropdown-link">
                  {{ name }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
            <el-dropdown-menu class="user-name-wrapper" slot="dropdown">
              <el-dropdown-item command="/user">实名认证</el-dropdown-item>
              <el-dropdown-item command="/order">挂号订单</el-dropdown-item>
              <el-dropdown-item command="/patient">就诊人管理</el-dropdown-item>
              <el-dropdown-item command="/logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </div>
        </div>

        <!-- 登录弹出层 -->
        <el-dialog :visible.sync="dialogUserFormVisible" style="text-align: left;" top="50px" :append-to-body="true"  width="960px" @close="closeDialog()">
            <div class="container">
                <!-- 手机登录 #start -->
                <div class="operate-view" v-if="dialogAtrr.showLoginType === 'phone'">
                <div class="wrapper" style="width: 100%">
                    <div class="mobile-wrapper" style="position: static;width: 70%">
                      <!-- 默认显示手机号 -->
                    <span class="title">{{ dialogAtrr.labelTips }}</span>
                    <el-form>
                        <el-form-item>
                        <!-- 文本框输入的内容赋值给dialogAtrr.inputValue属性 -->
                        <el-input v-model="dialogAtrr.inputValue" 
                        :placeholder="dialogAtrr.placeholder" 
                        :maxlength="dialogAtrr.maxlength" class="input v-input">


                            <span slot="suffix" class="sendText v-link" v-if="dialogAtrr.second > 0">{{ dialogAtrr.second }}s </span>
                            <span slot="suffix" class="sendText v-link highlight clickable selected" v-if="dialogAtrr.second == 0" @click="getCodeFun()">重新发送 </span>
                        </el-input>
                        </el-form-item>
                    </el-form>
                    <!-- 按钮上的文字：获取验证码=>马上登录 -->
                    <div class="send-button v-button" @click="btnClick()"> {{ dialogAtrr.loginBtn }}</div>
                    </div>
                    <div class="bottom">
                    <div class="wechat-wrapper" @click="weixinLogin()"><span
                        class="iconfont icon"></span></div>
                    <span class="third-text"> 第三方账号登录 </span></div>
                </div>
                </div>


                <!-- 手机登录 #end -->
                <!-- 微信登录 #start -->
                <div class="operate-view"  v-if="dialogAtrr.showLoginType === 'weixin'" >
                <div class="wrapper wechat" style="height: 400px">
                    <div>
                      <!-- 显示二维码 -->
                    <div id="weixinLogin"></div>
                    </div>
                    <div class="bottom wechat" style="margin-top: -80px;">
                    <div class="phone-container">
                        <div class="phone-wrapper"  @click="phoneLogin()"><span
                        class="iconfont icon"></span></div>
                        <span class="third-text"> 手机短信验证码登录 </span></div>
                    </div>
                </div>
                </div>
                <!-- 微信登录 #end -->

                <!-- 右边显示的公众号的二维码 -->
                <div class="info-wrapper">
                <div class="code-wrapper">
                    <div><img src="//img.114yygh.com/static/web/code_login_wechat.png" class="code-img">
                    <div class="code-text"><span class="iconfont icon"></span>微信扫一扫关注
                    </div>
                    <div class="code-text"> “快速预约挂号”</div>
                    </div>
                    <div class="wechat-code-wrapper"><img
                    src="//img.114yygh.com/static/web/code_app.png"
                    class="code-img">
                    <div class="code-text"> 扫一扫下载</div>
                    <div class="code-text"> “预约挂号”APP</div>
                    </div>
                </div>
                <div class="slogan">
                    <div>xxxxxx官方指定平台</div>
                    <div>快速挂号 安全放心</div>
                </div>
                </div>
            </div>
        </el-dialog>


    </div>
</template>

<script>
//'js-cookie'  js中操作cookie
import cookie from 'js-cookie'
import Vue from 'vue'


import userInfoApi from '@/api/yygh/userinfo'
import smsApi from '@/api/yygh/msm'
import hospitalApi from '@/api/yygh/hospital'
import weixinApi from '@/api/yygh/wx'

    
const defaultDialogAtrr = {
  showLoginType: 'phone', // 控制手机登录与微信登录切换
  labelTips: '手机号码', // 输入框提示
  inputValue: '15671747957', // 输入框绑定对象
  placeholder: '请输入您的手机号', // 输入框placeholder
  maxlength: 11, // 输入框长度控制
  loginBtn: '获取验证码', // 登录按钮或获取验证码按钮文本
  sending: true,      // 是否可以发送验证码
  second: -1,        // 倒计时间  second>0 : 显示倒计时 second=0 ：重新发送 second=-1 ：什么都不显示
  clearSmsTime: null  // 倒计时定时任务引用 关闭登录层清除定时任务
}
export default {
  data() {
    return {
      userInfo: {
        phone: '',
        code: '',
        openid: ''
      },
      dialogUserFormVisible: false,
      // 弹出层相关属性
      dialogAtrr:defaultDialogAtrr,
      name: '' // 用户登录显示的名称
    }
  },
  created() {
    this.showInfo()
  },
  mounted() {
	//(1)myheader.vue上引入wxLogin.js
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
    document.body.appendChild(script)
    
    
    //(2)全局事件，医院详情页面点击某个小科室
    //用于判断用户是否有登录，如果没有登录调用全局事件，打开登录弹出框
    window.loginEvent = new Vue();
    loginEvent.$on('loginDialogEvent', function () {
      //登录按钮的id，调用js方法触发点击事件
        document.getElementById("loginDialog").click();
    })
    
	//(3)微信扫码后，回调接口中重定向到/weixin/callback.vue，moutend钩子方法中调用全局方法
    let self = this;
    window["loginCallback"] = (name,token, openid) => {
        self.loginCallback(name, token, openid);//调用当前myheader.vue的普通方法
    }
  },
  methods: {
    //callback.vue最终调用了该方法
    loginCallback(name, token, openid) {
        //后端接口：微信用户的phone为空，就传递openid；
        if(openid != '') {
            //phone为空，需要绑定手机号
            this.userInfo.openid = openid
            this.showLogin()//打开绑定手机号弹出框（和手机号登录的弹出框是一个）
        } else {
            //不需要绑定手机号
            this.setCookies(name, token)
        }
    },
    // 绑定登录或获取验证码按钮
    btnClick() {
      // 判断是获取验证码还是登录
      if(this.dialogAtrr.loginBtn == '获取验证码') {
        //输入的手机号赋值给了userInfo.phone属性
        this.userInfo.phone = this.dialogAtrr.inputValue //文本框绑定的属性
        // 获取验证码
        this.getCodeFun()
      } else {
        // 登录
        this.login()
      }
    },
    // 绑定登录，点击显示登录层
    showLogin() {
      this.dialogUserFormVisible = true //dialog弹窗打开
      // 初始化登录层相关参数  对象扩展运算符，复制对象
      //this.dialogAtrr 弹窗上使用的一些属性
      this.dialogAtrr = { ...defaultDialogAtrr }
      //labelTips默认：手机号码
      if(this.userInfo.openid){
        this.dialogAtrr.labelTips = '微信首次登录需绑定手机号'
      }
      
    },
    // 登录
    login() {
      //文本框中输入的内容（验证码） 赋值给userInfo对象的code属性
      this.userInfo.code = this.dialogAtrr.inputValue

      //防止按钮重复点击
      if(this.dialogAtrr.loginBtn == '正在提交...') {
        this.$message.error('重复提交')
        return;
      }
      if (this.userInfo.code == '') {
        this.$message.error('验证码必须输入')
        return;
      }
      //后端的验证码长度是4
      if (this.userInfo.code.length != 4) {
        this.$message.error('验证码格式不正确')
        return;
      }
      this.dialogAtrr.loginBtn = '正在提交...'

      // phone+code 
      userInfoApi.login(this.userInfo).then(response => {
        // console.log(response.data)
        // 登录成功 设置cookie
        //后端login接口的返回值
        this.setCookies(response.data.name, response.data.token)
      }).catch(e => {
        this.dialogAtrr.loginBtn = '马上登录'
      })

    },
    setCookies(name, token) {
      //将后端返回的name和token写入到浏览器的cookie中(必须先import引入js-cookie)
      cookie.set('token', token, { domain: 'localhost' })
      cookie.set('name', name, { domain: 'localhost' })
      window.location.reload() //F5 浏览器窗口重新加载
    },
    // 获取验证码
    getCodeFun() {
      if (!(/^1[34578]\d{9}$/.test(this.userInfo.phone))) {
        this.$message.error('手机号码不正确')
        return;
      }

      // 初始化验证码相关属性
      this.dialogAtrr.inputValue = '' //点击了按钮之后，文本框中的内容清空
      this.dialogAtrr.placeholder = '请输入验证码' //文本框的背景文字修改
      this.dialogAtrr.maxlength = 6 //文本框文字长度（验证码的最大长度）
      this.dialogAtrr.loginBtn = '马上登录'//按钮上的文字发生变化


      // 控制重复发送
      if (!this.dialogAtrr.sending) return;
      
      // 发送短信验证码
      this.timeDown();
      this.dialogAtrr.sending = false;

      //调用短信服务，发送验证码
      smsApi.sendCode(this.userInfo.phone).then(response => {
        this.timeDown();//后端的短信验证码发送成功，开始倒计时
      }).catch(e => {
        this.$message.error('发送失败，重新发送')
        // 发送失败，回到重新获取验证码界面
        this.showLogin()
      })

    },
    // 倒计时
    timeDown() {
      if(this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
      this.dialogAtrr.second = 60;
      this.dialogAtrr.labelTips = '验证码已发送至' + this.userInfo.phone
      this.clearSmsTime = setInterval(() => {
        --this.dialogAtrr.second;
        if (this.dialogAtrr.second < 1) {
          clearInterval(this.clearSmsTime);
          this.dialogAtrr.sending = true;
          this.dialogAtrr.second = 0;
        }
      }, 1000);
    },
    // 关闭登录层
    closeDialog() {
      if(this.clearSmsTime) {
        clearInterval(this.clearSmsTime);
      }
    },
    showInfo() {
      //页面加载后，执行该方法，从cookie中获取值
      //根据cookie名称获取cookie的值
      let token = cookie.get('token')
      if (token) {
        //token有值之后，将name取值
        this.name = cookie.get('name')
        console.log(this.name)
      }
    },
    loginMenu(command) {
      //点击了退出登录
      if('/logout' == command) {
        //name和token清空了，销毁了
        cookie.set('name', '', {domain: 'localhost'})
        cookie.set('token', '', {domain: 'localhost'})
        //跳转页面
        window.location.href = '/' //中间部分显示pages/index.vue
        // window.location.reload() //f5
      } else {
        window.location.href = command
        // /user =>  user/index.vue
      }
    },
    handleSelect(item) {
      window.location.href = '/hospital/' + item.hoscode
    },
    //显示微信登录二维码
    weixinLogin() {
      //弹窗上显示第二个div
      this.dialogAtrr.showLoginType = 'weixin'

      weixinApi.getLoginParam().then(resp=>{

        //获取到参数之后，开始创建WxLogin对象
        var obj = new WxLogin({
          self_redirect:resp.data.self_redirect,//二维码如果在弹出框上，该值设置true；
          id:resp.data.id, //div
          appid: resp.data.appid, 
          scope: resp.data.scope,  
          redirect_uri: resp.data.redirect_uri
        });

      })
    },
    phoneLogin() {
      this.dialogAtrr.showLoginType = 'phone'
      this.showLogin()
    }
  }
}
</script>