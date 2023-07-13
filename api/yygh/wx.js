import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/api/user/wx'

export default {


    getLoginParam(){
        return request({
            url:`${api_name}/getLoginParam`,
            method:'get'
        })
    }
    
}