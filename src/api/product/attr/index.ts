//书写属性相关的API文件
import request from '@/utils/request.ts'
import type { CategoryResponseData,AttrResponseData,Attr } from './type'

//属性管理接口地址
enum API{
    //获取一级分类接口地址
    C1_URL='/admin/product/getCategory1',
    //获取二级分类接口地址
    C2_URL='/admin/product/getCategory2/',
    //获取三级分类接口地址
    C3_URL='/admin/product/getCategory3/',
    //获取分类下已有的属性和属性值
    ATTR_URL='/admin/product/attrInfoList/',
    //添加或者修改已有属性
    ADDORUPDATEATTR_URL='/admin/product/saveAttrInfo',
    //删除某一个已有属性
    DELETEATTR_URL='/admin/product/deleteAttr/'
}


//获取一级分类接口方法
export const reqC1=()=>{
    return request<any,CategoryResponseData>({
        url:API.C1_URL
    })
}

//获取二级分类接口方法
export const reqC2=(category1Id:number|string)=>{
    return request<any,CategoryResponseData>({
        url:API.C2_URL+`${category1Id}`
    })
}

//获取三级分类接口方法
export const reqC3=(category2Id:number|string)=>{
    return request<any,CategoryResponseData>({
        url:API.C3_URL+`${category2Id}`
    })
}

//获取分类的属性值和属性
export const reqAttr=(category1Id:number|string,category2Id:number|string,category3Id:number|string)=>{
    return request<any,AttrResponseData>({
        url:API.ATTR_URL+`${category1Id}/${category2Id}/${category3Id}`
    })
}

//新增或者修改已有属性的接口
export const reqAddOrUppdate=(data:Attr)=>{
    return request<any,any>({
        method:'POST',
        url:API.ADDORUPDATEATTR_URL,
        data
    })
}

//删除属性
export const reqRemove=(attrId:number)=>{
    return request<any,any>({
        method:'DELETE',
        url:API.DELETEATTR_URL+`${attrId}`
    })
}
