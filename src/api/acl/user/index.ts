//用户管理模块接口
import request from "@/utils/request";
import type { User, UserResponseData,AllRoleResponseData,SetRoleData  } from "./type";

//枚举地址
enum API{
    //获取全部已有用户账户的信息
    ALLUSER_URL='/admin/acl/user/',
    //添加用户
    ADDUSER_URL='/admin/acl/user/save',
    //更新用户
    UPDATEUSER_URL='/admin/acl/user/update',
    //获取全部角色(职位)以及当前账号拥有的职位
    ALIIROLE_URL='/admin/acl/user/toAssign/',
    //给已有的用户分配角色接口
    SETROLE_URL='/admin/acl/user/doAssignRole',
    //删除某一个账号
    DELETEUSER_URL='/admin/acl/user/remove/',
    //批量删除
    DELETEALL_URL='/admin/acl/user/batchRemove',
    
}

//获取用户账户信息
export const reqUserInfo=(page:number,limit:number,username:string)=>{
    return request<any,UserResponseData>({
        url:API.ALLUSER_URL+`${page}/${limit}/?username=${username}`,
    })
}

//添加或者更新用户
export const reqUpdateOrAddUserInfo=(data:User)=>{
    //携带参数有ID更新
    if(data.id){
        return request({
            method:'PUT',
            url:API.UPDATEUSER_URL,
            data
        })
    }else{
        return request({
            method:'POST',
            url:API.ADDUSER_URL,
            data
        })
    }
}

 //获取全部角色(职位)以及当前账号拥有的职位
 export const reqAllRole=(userId:number)=>{
    return request<any,AllRoleResponseData >({
        url:API.ALIIROLE_URL+`${userId}`
    })
 }

//分配职位
 export const reqSetRole=(data:SetRoleData)=>{
    return request<any,any>({
        url:API.SETROLE_URL,
        method:'POST',
        data
    })
 }

 //删除某一个账号的信息
 export const reqRemoveUser=(userId:number)=>{
    return request<any,any>({
        method:'DELETE',
        url:API.DELETEUSER_URL+`${userId}`
    })
 }

 //批量删除
 export const reqSelectUser=(idList:number[])=>{
    return request<any,any>({
        method:'DELETE',
        url:API.DELETEALL_URL,
        data:idList
    })
}