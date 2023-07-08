<template>
    <el-table style="width: 100%; margin-bottom: 20px" row-key="id" :data="PermisstionArr" border>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="权限值" prop="code"></el-table-column>
        <el-table-column label="修改时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作">
            <template #="{ row, $index }">
                <el-button type="primary" size="small" :disabled="row.level === 4" @click="addPermisstion(row)">{{
                    row.level === 3 ? '添加功能' : '添加菜单' }}</el-button>
                <el-button type="primary" size="small" :disabled="row.level === 1"
                    @click="updatePermisstion(row)">编辑</el-button>
                <el-button  @click="removePermisstion(row)" type="primary" size="small" :disabled="row.level === 1">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- 对话框组件:添加或者更新已有的菜单的数据结构 -->
    <el-dialog v-model="dialogVisible" title="添加菜单">
        <!-- 表单组件:收集新增或已有的菜单数据 -->
        <el-form label-width="70px">
            <el-form-item label="名称">
                <el-input placeholder="请你输入菜单的名称" v-model="menuData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限制">
                <el-input placeholder="请你输入权限的数值" v-model="menuData.code"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqAllPermisstion, reqAddOrUpdateMenu,reqRemoveMenu } from '@/api/acl/menu'
import type { PermisstionResponseData, PermisstionList, Permisstion, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus';


//存储菜单的数据
let PermisstionArr = ref<PermisstionList>([])
//控制对抗框显示与隐藏
let dialogVisible = ref<boolean>(false)
//携带参数
let menuData = ref<MenuParams>({
    code: '',
    level: 0,
    name: '',
    pid: 0
})

//组件挂载完毕
onMounted(() => {
    getHasPermisstion()
})
//获取菜单数据的方法
const getHasPermisstion = async () => {
    let result: PermisstionResponseData = await reqAllPermisstion()
    if (result.code == 200) {
        PermisstionArr.value = result.data
    }
}
//添加菜单
const addPermisstion = (row: Permisstion) => {
    //清空数据
    Object.assign(menuData.value, {
        code: '',
        level: 0,
        name: '',
        pid: 0
    })
    //显示对话框
    dialogVisible.value = true
    //收集数据
    menuData.value.pid = (row.id as number)
    menuData.value.level = row.level + 1
}
//修改菜单
const updatePermisstion = (row: Permisstion) => {
    //显示对话框
    dialogVisible.value = true
    //收集数据
    Object.assign(menuData.value,row)
}

//确定按钮
const save = async () => {
    //发请求
    let result = await reqAddOrUpdateMenu(menuData.value)
    if (result.code == 200) {
        //对话框隐藏
        dialogVisible.value = false
        ElMessage.success(menuData.value.id ? '更新成功' : '添加成功')
        //重新获取数据
        getHasPermisstion()
    }
}


//删除按钮
const removePermisstion=async (row:Permisstion)=>{
    let result=await reqRemoveMenu((row.id as number))
    if(result.code==200){
        ElMessage.success('删除成功')
        getHasPermisstion()
    }
}

</script>

<style scoped></style>