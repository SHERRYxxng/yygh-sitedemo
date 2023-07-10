import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/api/user/patient'

export default {

    findList(){
        return request({
            url:`${api_name}/findList`,
            method:'get'
        })
    },
    //添加
    save(patient){
        return request({
            url:`${api_name}/addPatient`,
            method:'post',
            data:patient
        })
    },
    //修改
    updateById(patient){
        return request({
            url:`${api_name}/updatePatient`,
            method:'post',
            data:patient
        })
    },
    //根据就诊人id查询
    getById(id){
        return request({
            url:`${api_name}/getPatient/${id}`,
            method:'get'
        })
    },
    removeById(id){
        return request({
            url:`${api_name}/deleteOne/${id}`,
            method:'delete'
        })
    }
    
}