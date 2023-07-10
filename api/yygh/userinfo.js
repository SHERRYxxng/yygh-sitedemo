import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/api/user'

export default {


    login(userinfo){
        return request({
            url:`${api_name}/login`,
            method:'post',
            data:userinfo
        })
    },
    getUserInfo(){
        return request({
            url:`${api_name}/getUserInfo`,
            method:'get'
        })
    },
    saveUserAuth(userauth){
        return request({
            url:`${api_name}/userAuth`,
            method:'post',
            data:userauth
        })
    }
    
}