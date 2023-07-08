<template>
        <template v-for="(item, index) in menuList" ::key="item.path">
            <!-- 没有子路由    -->
            <el-menu-item v-if="!item.meta?.hidden && !item.children" :index="item.path">
                <el-icon>
                    <component :is="item.meta?.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.meta?.title }}</span>
                </template>
            </el-menu-item>
            <!-- 有子路由但是只有一个子路由 -->
            <el-menu-item v-if="item.children && item.children.length == 1 && !item.children[0].meta.hidden"
                :index="item.children[0].path">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <template #title>
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
            <!-- 有超过一个以上的子路由 -->
            <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.meta?.icon"></component>
                    </el-icon>
                    <span>{{ item.meta?.title }}</span>
                </template>
                <!-- 进行递归组件 -->
                <MyMenu :menuList="item.children"></MyMenu>
            </el-sub-menu>
        </template>
</template>

<script setup lang="ts">
defineProps(['menuList'])


</script>


<script lang="ts">
export default {
    name:'Menu'
}
</script>


<style scoped lang="scss" >
// 去掉多余边框
.el-menu {
    border-right: none;
}
</style>