//品牌管理接口
import request from '@/utils/request.ts'
import type { TradeMark, TradeMarkResponse } from './type.ts'

//品牌管理模块接口地址
enum API {
    //获取已有品牌接口
    TRADEMARK_URL = '/admin/product/baseTrademark/',
    //添加品牌
    ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
    //修改
    UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
    //删除已有品牌
    DELETE_URL='/admin/product/baseTrademark/remove/'
}

//获取已有品牌接口的方法
//page:获取第几页---默认第一页
//limit:获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) => {
    return request<any, TradeMarkResponse>({
        url: API.TRADEMARK_URL + `${page}/${limit}`
    })
}


//添加与修改已有品牌的接口方法
export const reqAddOrUpdateTrademark = (data: TradeMark) => {
    //修改
    if (data.id) {
        return request<any, any>({
            method: 'PUT',
            url:API.UPDATETRADEMARK_URL,
            data
        })
    } else {
        //新增
        return request<any, any>({
            method: 'POST',
            url:API.ADDTRADEMARK_URL,
            data
        })

    }

}


//删除已有品牌
export const reqDeleteTrademark=(id:number)=>{
    return request<any,any>({
        method:'DELETE',
        url:API.DELETE_URL+`${id}`
    })
}