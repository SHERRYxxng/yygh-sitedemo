import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/api/hosp'

export default {

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