//SKU模块接口管理
import request from "@/utils/request";
import type { SkuResponseData,SkuInfoData } from "./type";

//枚举地址
enum API{
    //获取已有的商品数据-SKU
    SKU_URL='/admin/product/list/',
    //商品下架
    CANCEL_URL='/admin/product/cancelSale/',
    //商品上架
    SALE_URL='/admin/product/onSale/',
    //得到商品的具体信息
    SKUINFO_URL='/admin/product/getSkuInfo/',
    //删除已有的商品
    DELETE_URL='/admin/product/deleteSku/'
}

//获取商品SKU的接口
export const reqSkuList=(page:number,limit:number)=>{
    return request<any,SkuResponseData>({
        url:API.SKU_URL+`${page}/${limit}`
    })
}
//已有商品上架的请求
export const reqSaleSku=(skuId:number)=>{
    return request<any,any>({
        url:API.SALE_URL+`${skuId}`
    })
}
//已有商品下架的请求
export const reqCancelSale=(skuId:number)=>{
    return request<any,any>({
        url:API.CANCEL_URL+`${skuId}`
    })
}
//获取商品的具体信息
export const reqGetSkuInfo=(skuId:number)=>{
    return request<any,SkuInfoData>({
        url:API.SKUINFO_URL+`${skuId}`
    })
}
//删除商品
export const reqDeleteSku=(skuId:number)=>{
    return request<any,any>({
        method:'DELETE',
        url:API.DELETE_URL+`${skuId}`
    })
}