<template>
        <!-- 顶部左侧静态 -->
        <el-icon style="margin-right: 10px;" @click="changeIcon">
            <Expand v-if="!layoutSettingStore.fold" />
            <Fold v-else/>
        </el-icon>
        <!-- 左侧面包屑 -->
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="(route,index) in $route.matched" :key="index" v-show="route.meta.title" :to="route.path">
                <el-icon style="margin: 0px 5px;">
                   <component :is="route.meta.icon"></component>
                </el-icon>
                <span>{{ route.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
</template>

<script setup lang="ts">
import { useLayoutSettingStore } from '@/store/modules/setting';

const layoutSettingStore=useLayoutSettingStore()
//点击图标的方法
const changeIcon=()=>{
    layoutSettingStore.fold=!layoutSettingStore.fold
}

</script>

<script lang="ts">
export default {
    name:'Bread'
}
</script>

<style scoped></style>