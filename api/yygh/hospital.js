import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/api/hosp'

export default {

    //根据排班id查询排班对象
    getSchedule(scheduleId){
        return request({
            url:`${api_name}/getSchedule/${scheduleId}`,
            method:'get'
        })
    },

    //根据点击的日期，查询排班列表
    findScheduleList(hoscode,depcode,workDate){
        return request({
            url:`${api_name}/getScheduleDetail/${hoscode}/${depcode}/${workDate}`,
            method:'get'
        })
    },

    //查询排班日期列表+总日期个数+baseMap
    getBookingScheduleRule(page, limit, hoscode,depcode){
        return request({
            url:`${api_name}/getScheduleBookingRule/${hoscode}/${depcode}/${page}/${limit}`,
            method:'get'
        })
    },

    //首页上医院列表
    getPageList(page,limit,searchObj){
        return request({
            url:`${api_name}/${page}/${limit}`,
            method:'get',
            params:searchObj
        })
    },
    //根据关键词模糊查询医院列表
    getByHosname(keyword){
        return request({
            url:`${api_name}/getByHosname/${keyword}`,
            method:'get'
        })
    },
    //根据医院编号查询hospital+bookingRule
    show(hoscode){
        return request({
            url:`${api_name}/show/${hoscode}`,
            method:'get'
        })
    },
    //查询科室列表
    findDepartment(hoscode){
        return request({
            url:`${api_name}/findDepartmentList/${hoscode}`,
            method:'get'
        })
    }
    
}