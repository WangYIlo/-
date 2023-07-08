import request from '@/utils/request.ts'
import type { loginFrom,loginResponseData,userInfoReponseData } from './type'

enum API{
    LOGIN_URL = '/admin/acl/index/login',
    USERINFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
}

//登录接口
export const reqLogin=(data:loginFrom)=>{
    return request<any,loginResponseData>({
        url:API.LOGIN_URL,
        method:'post',
        data
    })
}

//获取用户信息接口
export const reqUserInfo=()=>{
    return request<any,userInfoReponseData>({
        url:API.USERINFO_URL,
        method:'get',
    })

}
//退出登录
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)