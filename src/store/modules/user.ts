//用户仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo,reqLogout } from '@/api/user/user'
//引入数据类型
import type { loginFrom, loginResponseData,userInfoReponseData } from '@/api/user/type'
//引入路由(常量路由)
import { constantRoute,asyncRoute,anyRoute } from '@/router/routes'

import { cloneDeep } from 'lodash'

import type { UserState } from './type'
import router from '@/router'


//用于过滤当前用户需要展示的异步路由---浅拷贝
function filterAsyncRoute(asyncRoute:any,routes:any){
      return asyncRoute.filter((item:any)=>{
            if(routes.includes(item.name)){
                if(item.children && item.children.length>0){
                    // 因为过滤完毕后会对原数据进行二次赋值---不能直接使用原数据---采用一个深拷贝的数据
                    item.children=filterAsyncRoute(item.children,routes)
                }
                return true
            }
       })
}


export const useUserStore = defineStore('User', {
    state: (): UserState => {
        return {
            token: '',
            menuRoutes: constantRoute, //仓库存储生成菜单需要数组
            userInfo: {
                username: '',
                avatar: ''
            }
        }
    },
    actions: {
        //用户登录
        async userLogin(data: loginFrom) {
            const res: loginResponseData = await reqLogin(data)
            console.log(res);
            
            if (res.code == 200) {
                this.token = res.data
                return '登录成功'
            } else {
                throw new Error(res.data)
            }

        },
        //获取用户信息
        async getUserInfo() {
            let result:userInfoReponseData = await reqUserInfo()

            if (result.code == 200) {
                this.userInfo.username = result.data.name
                this.userInfo.avatar = result.data.avatar
                //计算当前用户的异步路由
                let userAsyncRoute=filterAsyncRoute(cloneDeep(asyncRoute),result.data.routes)
                //菜单的数据
                this.menuRoutes=[...constantRoute,...userAsyncRoute,...anyRoute]
                //将计算完毕的路由进行动态追加
                let addRoute=[...userAsyncRoute,...anyRoute]
                addRoute.forEach((route)=>{
                    router.addRoute(route)
                })
            }

        },
        //退出登录
      async  userLogout() {
            let res:any=await reqLogout()
            if(res.code==200){
                console.log(2)
                //手动清空token
                this.token=''
                this.userInfo.username=''
                this.userInfo.avatar=''
                
                //清空数据
                localStorage.removeItem('User')
                return 'ok'
            }
        }

    },
    getters: {

    },
    persist: {
        paths: ['token']
    },
})