// 服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}


//SPU数据的ts类型:需要修改
export interface SpuData {
    id?: number,
    spuName: string,
    description: string,
    category3Id: string | number,
    tmId: number|string,
    spuSaleAttrList: null | SaleAttr[],
    spuImageList: SpuImg[] | null
}

//数组:元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}


//品牌数据的TS类型
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string
}
//品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
    data: Trademark[]
}


//SPU下商品图片ts类型
export interface SpuImg {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?:string,
    url?:string
}

//已有SPU的照片墙接口数据
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}




//已有的销售属性值对象ts类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}

//存储已有的销售数值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

//销售属性对象ts类型
export interface SaleAttr {
    id?: number, 
    createTime?: null,
    updateTime?: null,
    spuId?:number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList:SpuSaleAttrValueList,
    flag?:boolean,
    saleAttrValue?:string
}

//SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData{
    data:SaleAttr[]
}


//已有的全部SPU的返回数据
export interface HasSaleAttr{
    id:number,
    name:string
}

export interface HasSaleAttrResponseData extends ResponseData{
    data:HasSaleAttr[]
}



export interface Attr{
        attrId:number | string,
        valueId:number | string
}

export interface SaleAttr{
    saleAttrId:number | string,
    saleAttrValueId:number | string
}


export interface SkuData{
    category3Id:string | number,
    spuId:string | number,
    tmId:string | number,
    skuName:string,
    price:string |number,
    weight:string |number,
    skuDesc:string,
    skuAttrValueList?:Attr[],
    skuSaleAttrValueList?:SaleAttr[],
    skuDefaultImg:string
}


//获取SKU数据接口的ts类型

export interface SkuInfoData extends ResponseData{
    data:SkuData[]
}