//将svg组件作为全局组件
import SvgIcon from '@/components/SvgIcon/index.vue';
//将MyMenu组件作为全局组件
import MyMenu from '@/layout/menu/index.vue'
//引入element-plus/icons图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//将Category组件作为全局组件
import Category from '@/components/Category/index.vue'

export default {
    install(app:any) {
        //注册SvgIcon为全局组件
        app.component('SvgIcon', SvgIcon)
        //注册Menu全局组件--方便递归
        app.component('MyMenu',MyMenu)
        //注册Category全局组件
        app.component('Category',Category)
        //将element-plus提供的图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
          }
    }
}