//路由鉴权: 某个路由再什么台哦见下可以访问,什么条件下不能被访问
import router from '@/router'
//js插件--使用在ts会冒红
// @ts-ignore
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './store/modules/user'

//权限管理---1.未登录--不能访问其他路由
           //2.已登录--不能访问login   

//全局前置守卫
// router.beforeEach((to:any,from:any,next:any)=>{

//     let userStore=useUserStore()

//     //登录
//     if(userStore.token){
//         if(to.path=='/login'){
//             console.log(to.path);
//             next({path:'/'})
//         }else{
//             next()
//         }

        

//     }else{//未登录
//         if(to.path=='/login'){
//             next()
//         }else{
//             next({path:'/login',query:{redirect:to.path}})
//         }
//     }
//     nprogress.start()

// })


router.beforeEach(async (to: any, from: any, next: any) => {
    let userStore=useUserStore()
    //to:你将要访问那个路由
    //from:你从来个路由而来
    //next:路由的放行函数
    nprogress.start()
    //获取token,去判断用户登录、还是未登录
    const token = userStore.token
    //获取用户名字
    const username = userStore.userInfo.username
    //用户登录判断
    if (token) {
      //登录成功,访问login,不能访问,指向首页
      if (to.path == '/login') {
        next({ path: '/' })
      } else {
        //登录成功访问其余六个路由(登录排除)
        //有用户信息
        if (username) {
          //放行
          next()
        } else {
          //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
          try {
            //获取用户信息
            await userStore.getUserInfo()
            
            //放行
            //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
            next({ ...to })
          } catch (error) {
            //token过期:获取不到用户信息了
            //用户手动修改本地存储token
            //退出登录->用户相关的数据清空
            await userStore.userLogout()
            next({ path: '/login', query: { redirect: to.path } })
          }
        }
      }
    } else {
      //用户未登录判断
      if (to.path == '/login') {
        next()
      } else {
        next({ path: '/login', query: { redirect: to.path } })
      }
    }
  })



//全局后置守卫
router.afterEach((to:any, from:any) => {
    nprogress.done()
})