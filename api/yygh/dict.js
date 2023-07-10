import request from '@/utils/request' //这里的@表示项目根目录

const api_name = '/admin/cmn'

export default {

    //根据dictCode查询数据字典列表
    //首页上查询医院等级列表和区列表
    //认证中心页面查询证件类型列表
    findByDictCode(dictCode){
        return request({
            url:`${api_name}/findByDictCode/${dictCode}`,
            method:'get'
        })
    },
    //根据id查询下级数据字典列表
    findByParentId(id){
        return request({
            url:`${api_name}/findChildData/${id}`,
            method:'get'
        })
    }
    
}