//分类相关的数据ts类型
export interface ResponseDate{
    code:number,
    message:string,
    ok:boolean
}

//分类ts类型
export interface CategoryObj{
    id:number|string,
    name:string
    category1Id?:number,
    category2Id?:number
}


//分类接口返回数据
export interface CategoryResponseData extends ResponseDate{
    data:CategoryObj[]
}



//属性值对象ts类型
export interface AttrValue{
    id?:number,
    valueName:string,
    attrId?:number,
    flag?:boolean
}

//存储每一个属性值的数组类型
export type AttrValueList=AttrValue[]

//属性对象
export interface Attr{
    id?:number,
    attrName:string,
    categoryId:number|string,
    categoryLevel:number
    attrValueList:AttrValueList
}

//存储每一个属性对象的数组ts
export type AttrList=Attr[]


//属性接口返回数据ts类型
export interface AttrResponseData extends ResponseDate{
    data:Attr[]
}