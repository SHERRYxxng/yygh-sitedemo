<template>
<!-- header -->
    <div class="nav-container page-component">
        <!--左侧导航 #start -->
        <div class="nav left-nav">
            <div class="nav-item selected">
                <span class="v-link selected dark" 
                    :onclick="'javascript:window.location=\'/hospital/'+hospital.hoscode+'\''">预约挂号 </span>
            </div>
                <div class="nav-item ">
                    <span class="v-link clickable dark" :onclick="'javascript:window.location=\'/hospital/detail/'+hospital.hoscode+'\''"> 医院详情 </span>
                </div>
                <div class="nav-item">
                    <span class="v-link clickable dark" :onclick="'javascript:window.location=\'/hospital/notice/'+hospital.hoscode+'\''"> 预约须知 </span>
                </div>
                <div class="nav-item "><span
                    class="v-link clickable dark"> 停诊信息 </span>
                </div>
                <div class="nav-item "><span
                    class="v-link clickable dark"> 查询/取消 </span>
                </div>
        </div>
        <!-- 左侧导航 #end -->
        <!-- 右侧内容 #start -->
        <div class="page-container">
            <div class="hospital-home">
                <div class="common-header">
                    <div class="title-wrapper"><span
                        class="hospital-title">{{ hospital.hosname }}</span>
                        <div class="icon-wrapper">
                            <span class="iconfont"></span>{{ hospital.param.hostypeString }}
                        </div>
                    </div>
                </div>
                <div class="info-wrapper">
                    <img class="hospital-img" :src="'data:image/jpeg;base64,'+hospital.logoData" :alt="hospital.hosname">
                <div class="content-wrapper">
                <div> 挂号规则</div>
                    <div class="line">
                        <div><span class="label">预约周期：</span><span>{{ bookingRule.cycle }}天</span></div>
                        <div class="space"><span class="label">放号时间：</span><span>{{ bookingRule.releaseTime }}</span></div>
                        <div class="space"><span class="label">停挂时间：</span><span>{{ bookingRule.stopTime }}</span></div>
                    </div>
                    <div class="line"><span class="label">退号时间：</span>
                        <span v-if="bookingRule.quitDay == -1">就诊前一工作日{{ bookingRule.quitTime }}前取消</span>
                        <span v-if="bookingRule.quitDay == 0">就诊前当天{{ bookingRule.quitTime }}前取消</span>
                    </div>
                    <div style="margin-top:20px"> 医院预约规则</div>
                    <div class="rule-wrapper">
                        <ol>
                        <li v-for="item in bookingRule.rule" :key="item">{{ item }}</li>
                        </ol>
                    </div>
                </div>
                </div>
                <div class="title select-title"> 选择科室</div>
                <div class="select-dept-wrapper">
                    <div class="department-wrapper">
                    <div class="hospital-department">
                        <div class="dept-list-wrapper el-scrollbar" style="height: 100%;">
                            <div class="dept-list el-scrollbar__wrap" style="margin-bottom: -17px; margin-right: -17px;">
                                <div class="el-scrollbar__view">
                                    <div class="sub-item" v-for="(item,index) in departmentVoList" :key="item.id" :class="index == activeIndex ? 'selected' : ''" @click="move(index,item.depcode)"> 
                                        {{ item.depname }}  
                                        <!-- 显示大科室名称 -->
                                        </div>
                                </div>
                            </div>
                            <div class="el-scrollbar__bar is-horizontal">
                                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
                            </div>
                            <div class="el-scrollbar__bar is-vertical">
                                <div class="el-scrollbar__thumb" style="transform: translateY(0%); height: 91.4761%;"></div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="sub-dept-container">
                        <!-- 遍历大科室 -->
                        <div v-for="(item,index) in departmentVoList" :key="item.id" :class="index == 0 ? 'selected' : ''" class="sub-dept-wrapper" :id="item.depcode">
                            <div class="sub-title">
                                <div class="block selected"></div>{{ item.depname }}
                            </div>
                            <div class="sub-item-wrapper">
                                <!-- 对当前大科室的children小科室集合进行遍历 -->
                                <!-- 点击某小科室，调用schedule方法，参数：小科室编号 -->
                                <div v-for="it in item.children" :key="it.id" class="sub-item" 
                                @click="schedule(it.depcode)">
                                    <span class="v-link clickable">{{ it.depname }} </span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <!-- 右侧内容 #end -->
    </div>
    <!-- footer -->
</template>
<script>
import '~/assets/css/hospital_personal.css'
import '~/assets/css/hospital.css'
import hospitalApi from '@/api/yygh/hospital'

import cookie from 'js-cookie'
import userinfoApi from '@/api/yygh/userinfo'


export default {
  data() {
    return {
      hoscode: null,
      activeIndex: 0,
      hospital: {
        param: {}
      },
      bookingRule : {},
      departmentVoList : []
    }
  },
  created() {
    //获取路由参数（医院编号，路由参数名hoscode）
    this.hoscode = this.$route.params.hoscode
    this.init()
  },
  methods: {
    init() {
      //根据医院编号查询医院的基本信息和预约规则信息
      hospitalApi.show(this.hoscode).then(response => {
        this.hospital = response.data.hospital
        this.bookingRule = response.data.bookingRule
      })
      //查询科室列表（已实现）
      hospitalApi.findDepartment(this.hoscode).then(response => {
        this.departmentVoList = response.data.list
      })
    },
    schedule(depcode) {


      //1、判断当前用户是否登录
      //获取token或者name的cookie值
      let token = cookie.get('token')
      if(!token){
         console.log('当前用户未登录')
         //触发myheader.vue中的登录按钮的点击事件
         //触发全局事件
         loginEvent.$emit('loginDialogEvent')
         return
      }

      //2、用户已登录，继续判断用户的审核状态如果authStatus=0
      userinfoApi.getUserInfo().then(resp=>{
        if(resp.data.userInfo.authStatus==2){
            //跳转到该科室的排班页面
            window.location.href = '/hospital/schedule?hoscode=' + this.hoscode + "&depcode="+ depcode
        }else{
            //未认证成功，点击小科室，跳转到用户的认证中心页面
            window.location.href = '/user'
        }
      })


      
    }
  }
}
</script>