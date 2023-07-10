import request from '@/utils/request'

const api_name = '/api/msm'

export default {

    sendCode(phone){
        return request({
            url:`${api_name}/sendCode/${phone}`,
            method:'get'
        })
    }

}