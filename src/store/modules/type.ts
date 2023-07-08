//定义小仓库数据state类型

import type { RouteRecordRaw } from "vue-router";
import type { CategoryObj } from "@/api/product/attr/type";

export interface UserState{
    token:string|null;
    menuRoutes:RouteRecordRaw[]
    userInfo:UserInfo
}

interface UserInfo{
    username:string
    avatar:string
}


//定义Category的state对象ts类型
export interface CategoryState{
    c1Arr:CategoryObj[],
    c1Id:string|number,
    c2Arr:CategoryObj[],
    c2Id:string|number,
    c3Arr:CategoryObj[],
    c3Id:string|number,
}
