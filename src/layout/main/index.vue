<template>
    <div>
        <!-- 路由组件出口的位置 -->
        <router-view v-slot="{ Component }">
            <transition name="fade">
                <!-- 渲染layout一级路由组件的子路由 -->
                <component :is="Component" v-if="flag" />
            </transition>
        </router-view>
    </div>
</template>

<script setup lang="ts">
import { useLayoutSettingStore } from '@/store/modules/setting';
import { watch,ref,nextTick } from 'vue';

let layoutSettingStore=useLayoutSettingStore()

//控制当前组件是否销毁重建
let flag=ref(true)

//监听refsh是否发生变化
watch(()=>layoutSettingStore.refsh,()=>{
    flag.value=false
    //利用nextTick实现真正刷新
    nextTick(()=>{
        flag.value=true
    })
})



</script>

<script lang="ts">
export default {
    name:'Main'
}
</script>

<style scoped lang="scss">

// 添加过渡动画
.fade-enter-from{
    opacity: 0;
}

.fade-enter-to{
    opacity: 1;
}

.fade-enter-active{
    transition: all 0.5s;
}

</style>