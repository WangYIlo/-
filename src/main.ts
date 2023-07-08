import { createApp } from 'vue'
// 引入element-plus 插件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus国际化(没有ts类型--会有提示)
//使用@ts-ignore进行忽略当前文件ts类型的检测否则有红色提示(
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入路由
import router from './router'
//引入仓库
import pinia from './store'

//svg插件需要的配置
import 'virtual:svg-icons-register'

import App from '@/App.vue'



const app = createApp(App)

app.use(ElementPlus, {
    locale: zhCn
})

//引入自定义插件
import globalComponets from '@/components/index.ts'
//安装自定义插件
app.use(globalComponets)
//注册仓库
app.use(pinia)
//注册路由
app.use(router)
// 引入全局样式
import '@/styles/index.scss'
//引入路由鉴权文件
import './permisstion'
//引入暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

app.mount('#app')



