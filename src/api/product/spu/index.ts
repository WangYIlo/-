//SPU管理模块接口
import request from '@/utils/request.ts'
import type { SkuData,SpuData,HasSpuResponseData,AllTradeMark,SpuHasImg,SaleAttrResponseData,HasSaleAttrResponseData, SkuInfoData } from './type'

enum API {
    //获取已有的SPU的数据
    HASSPU_URL='/admin/product/',
    //获取全部品牌数据
    ALLTRADEMARK_URL='/admin/product/baseTrademark/getTrademarkList',
    //获取某一个SPU下全部的售卖照片
    IMAGE_URL='/admin/product/spuImageList/',
    //获取某一个SPU下已有的销售属性
    SPUHASSALEATTR_URL='/admin/product/spuSaleAttrList/',
    //获取整个项目全部的销售属性
    ALLSALEATTR_URL='/admin/product/baseSaleAttrList',
    //追加一个新的SPU
    ADDSPU_URL='/admin/product/saveSpuInfo',
    //更新已有的SPU
    UPDATESPU_URL='/admin/product/updateSpuInfo',
    //追加一个新增的SKU
    ADDSKU_URL='/admin/product/saveSkuInfo',
    //查看某一个已有的SPU全部售卖的商品(SKU)
    SKUINFO_URL='/admin/product/findBySpuId/',
    //删除已有的SPU
    REMOVESPU_URL='/admin/product/deleteSpu/'
}

//获取某一个三级分类已有的SPU数据
export const reqHasSpu=(page:number,limit:number,category3Id:string|number)=>{
    return request<any,HasSpuResponseData>({
        url:API.HASSPU_URL+`${page}/${limit}?category3Id=${category3Id}`
    })
}

//获取全部品牌数据
export const reqAllTradeMark=()=>{
    return request<any,AllTradeMark>({
        url:API.ALLTRADEMARK_URL
    })
}

//获取某一个SPU下全部的售卖照片
export const reqSpuImageList=(spuId:number)=>{
    return request<any,SpuHasImg>({
        url:API.IMAGE_URL+`${spuId}`
    })
}

//获取某一个已有的SPU拥有多少销售属性
export const reqSpuSaleAttr=(spuId:number)=>{
    return request<any,SaleAttrResponseData>({
        url:API.SPUHASSALEATTR_URL+`${spuId}`
    })
}

//获取整个项目全部的销售属性
export const reqAllSaleAttr=()=>{
    return request<any,HasSaleAttrResponseData>({
        url:API.ALLSALEATTR_URL
    })
}

//添加一个新的SPU
//更新已有的SPU接口
export const reqAddorUpdateSpu=(data:SpuData)=>{
    //如果SPU拥有ID,更新已有的SPU
    if(data.id){
        return request<any,any>({
            method:'POST',
            url:API.UPDATESPU_URL,
            data
        })
    }else{
        return request<any,any>({
            method:'POST',
            url:API.ADDSPU_URL,
            data
        })
    }

}



//添加一个SKU
export const reqAddSku=(data:SkuData)=>{
    return request<any,any>({
        method:"POST",
        url:API.ADDSKU_URL,
        data
    })
}

//查看某一个已有的SPU全部售卖的商品
export const reqSkuList=(spuId:number|string)=>{
    return request<any,SkuInfoData>({
        url:API.SKUINFO_URL+`${spuId}`
    })
}

//删除SPU
export const  reqRemoveSpu=(spuId:number|string)=>{
    return request<any,any>({
        method:'DELETE',
        url:API.REMOVESPU_URL+`${spuId}`
    })
}
