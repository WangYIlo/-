<template>
     <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.c1Id" @change="handle()" :disabled="!flag">
                    <el-option v-for="c1 in categoryStore.c1Arr" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="categoryStore.c2Id" @change="handle1()"  :disabled="!flag">
                    <el-option v-for="c2 in categoryStore.c2Arr" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="categoryStore.c3Id"  :disabled="!flag" >
                    <el-option v-for="c3 in categoryStore.c3Arr" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import {onMounted} from 'vue'
import {useCategoryStore} from '@/store/modules/category'

let categoryStore=useCategoryStore()

onMounted(()=>{
    categoryStore.getC1()
})

//一级分类下拉菜单change事件
const handle=()=>{
    //二级，三级分类数据需要清空
    categoryStore.c2Arr=[]
    categoryStore.c2Id=''
    categoryStore.c3Arr=[]
    categoryStore.c3Id=''
    categoryStore.getC2()
}

const handle1=()=>{
    //三级分类数据需要清空
    categoryStore.c3Arr=[]
    categoryStore.c3Id=''
    categoryStore.getC3()
}

//接收父组件
defineProps(['flag'])







</script>

<style scoped>

</style>