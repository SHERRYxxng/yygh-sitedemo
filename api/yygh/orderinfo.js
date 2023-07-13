import request from '@/utils/request'

const api_name = '/api/order'

export default {
    getPageList(page,limit,searchObj){
        url:'${api_name}/getPageList/${page}/${limit}'
    },
    submitOrder(patientId,scheduleId){
        return request({
            url:`${api_name}/submitOrder/${patientId}/${scheduleId}`,
            method:'get'
        })
    },
    getOrder(orderId){
        return request({
            url:`${api_name}/getOrder/${orderId}`,
            method:'get'
        })
    }

}