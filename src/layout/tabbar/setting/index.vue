<template>
    <div class="tabbar_right">
        <el-button icon="Refresh" circle @click="updateRefresh"></el-button>
        <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
        <el-popover placement="bottom" title="主题设置" :width="300" trigger="click">
            <template #reference>
                <el-button icon="Setting" circle></el-button>
            </template>
            <!-- 表单元素 -->
            <el-form>
                <el-form-item label="主题颜色">
                    <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />
                </el-form-item>
                <el-form-item label="暗黑模式">
                    <el-switch v-model="dark" size="default" inline-prompt active-icon="Moon" inactive-icon="Sunny"
                        @change="changeDark" />
                </el-form-item>
            </el-form>
        </el-popover>
        <img :src="userStore.userInfo.avatar" style="width: 30px; height: 30px; margin: 0 10px; border-radius: 50%;">
        <!-- 下拉菜单 -->
        <el-dropdown>
            <span class="el-dropdown-link">
                {{ userStore.userInfo.username }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup lang="ts">
import { useLayoutSettingStore } from '@/store/modules/setting';
//获取用户仓库
import { useUserStore } from '@/store/modules/user';

import { useRouter, useRoute } from 'vue-router'

import { onMounted, nextTick, ref } from 'vue'



let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()
let $router = useRouter()
let $route = useRoute()
//刷新按钮
const updateRefresh = () => {
    layoutSettingStore.refsh = !layoutSettingStore.refsh
}
//全屏按钮
const fullScreen = () => {
    //DOM对象属性--用于判断当前是否全屏
    let full = document.fullscreenElement

    if (!full) {
        //文档根节点方法requestFullscreen--变成全屏
        document.documentElement.requestFullscreen()
    } else {
        //退出全屏
        document.exitFullscreen()
    }

}
//退出登录
const logout = async () => {
    //先进行等待清空数据完成
    await userStore.userLogout()
    $router.push({ path: '/login', query: { redirect: $route.path } })

}

onMounted(() => {
    userStore.getUserInfo()
})


//颜色组件
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

//主题颜色设置
const setColor = () => {
    const el = document.documentElement
    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value)

}

//开关组件
const dark = ref(false)
//暗黑模式切换
const changeDark = () => {
    //获取html根节点
    const html = document.documentElement
    //判断html是否有dark类名
    dark.value ? html.className = 'dark' : html.className = '';
}

</script>


<script lang="ts">
export default {
    name: 'Setting'
}
</script>

<style scoped></style>