<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="职位搜索:">
                <el-input placeholder="请输入搜索职位关键字" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!keyword.length" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" icon="Plus" @click="addRule">添加职位</el-button>
        <el-table border style="margin: 10px 0" :data="allRole">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column prop="id" align="center" label="ID"></el-table-column>
            <el-table-column prop="roleName" show-overflow-tooltip align="center" label="角色名称"></el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip align="center" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" show-overflow-tooltip align="center" label="更新时间"></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="User" size="small" @click="setPermission(row)">分配权限</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateRole(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.roleName}?`" width="260px" @confirm="deleteRole(row.id)">
                        <template #reference>
                            <el-button type="primary" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background="true" layout="prev, pager, next, jumper,->,total, sizes, " :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- 添加职位与更新已有的职位 -->
    <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
        <el-form :model="RoleParams" :rules="rules" ref="form">
            <el-form-item label="职位名称" prop="roleName">
                <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button type="primary" @click="save">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
        </template>
    </el-dialog>
    <!-- 抽屉组件:分配职位菜单权限 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配菜单与按钮权限</h4>
        </template>
        <template #default>
                <!-- 树型控件 -->
                <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr"
                    :props="defaultProps" />
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确认</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { useLayoutSettingStore } from '@/store/modules/setting'
import { ref, onMounted, nextTick } from 'vue'
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList,reqSetPermisstion,reqRemoveRole } from '@/api/acl/role'
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type'
import { ElMessage } from 'element-plus';
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
//搜索职位关键字
let keyword = ref<string>('')
//存储已有的全部职位
let allRole = ref<Records>([])
//职位总数
let total = ref<number>()
//获取模板setting仓库
let settingStore = useLayoutSettingStore()
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集新增岗位数据
let RoleParams = ref<RoleData>({
    roleName: ''
})
//获取form组件实例
let form = ref()
//控制抽屉显示与隐藏
let drawer = ref<boolean>(false)

onMounted(() => {
    getHasRole()
})


//获取职位
const getHasRole = async (pager = 1) => {
    pageNo.value = pager
    let result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }
}


//一页数据改变的回调
const handleSizeChange = () => {
    getHasRole()
}
//页码改变的回调
const handleCurrentChange = (num: number) => {
    getHasRole(num)
}

//搜索按钮
const search = () => {
    //再次发送请求
    getHasRole()
    keyword.value = ''
}
//重置
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}

//添加职位回调
const addRule = () => {
    //显示对话框
    dialogVisible.value = true
    //清空数据
    Object.assign(RoleParams.value, {
        roleName: '',
        id: 0
    })
    //清空校验结果
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
//更新已有的职位按钮回调
const updateRole = (row: RoleData) => {
    //显示对话框
    dialogVisible.value = true
    //存储已有的职位--带有id
    Object.assign(RoleParams.value, row)
    //清空校验结果
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}

//自定义校验规则的回调
const validatorRoleName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
        callBack();
    } else {
        callBack(new Error('职位名称至少两位'))
    }
}
//职位校验规则
const rules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName }
    ]
}

//确定按钮回调
const save = async () => {
    //表单校验结果
    await form.value.validate()
    //添加|更新职位
    let result = await reqAddOrUpdateRole(RoleParams.value)
    console.log(result);
    if (result.code == 200) {
        ElMessage.success(RoleParams.value.id ? '更新成功' : '添加成功')
        dialogVisible.value = false
        getHasRole()
    } else {
        ElMessage.success(RoleParams.value.id ? '更新失败' : '添加失败')
        dialogVisible.value = false
    }

}

//树型控件数据
//定义数组存储用户权限的数据
//获取树型控件组件实例
let tree=ref()
let menuArr = ref<MenuList>([])
const defaultProps = {
    children: 'children',
    label: 'name',
}
//准备一个数组:存储勾选节点的id(四级--最后)
let selectArr=ref<any>([])

//分配权限按钮回调
const setPermission = async (row: RoleData) => {
    //显示抽屉
    drawer.value = true
    //清空数据
    selectArr.value=[]

    //收集当前要分配权限的职位的树
    Object.assign(RoleParams.value, row)
    //根据职位获取权限数据
    let result: MenuResponseData = await reqAllMenuList((RoleParams.value.id as number))
    if (result.code == 200) {
        menuArr.value = result.data
        selectArr.value=filterSelectArr(menuArr.value,[])
    }

}

//过滤去最末级数据
const filterSelectArr=(allData:any,initArr:any)=>{
    allData.forEach((item:any)=>{
        if(item.children&&item.children.length>0){
            filterSelectArr(item.children,initArr)
        }else{
            if(item.select){
                initArr.push(item.id)
            }
        }
    })

    return initArr
}

//抽屉确定按钮回调
const confirmClick=async ()=>{
    //职位ID
    const roleId =(RoleParams.value.id as number)
    //选中节点的ID
    let arr = tree.value.getCheckedKeys();
    //半选的ID
    let arr1=tree.value.getHalfCheckedKeys()
    let permissionId=[...arr,...arr1]
    
    let result:any=await reqSetPermisstion(roleId,permissionId)
    if (result.code == 200) {
        //抽屉关闭
        drawer.value = false;
        //提示信息
        ElMessage({ type: 'success', message: '分配权限成功' });
        //页面刷新
        nextTick(()=>{
            window.location.reload();
        })
    }
    
}

//删除角色
const deleteRole=async(id:number)=>{
    let result: any = await reqRemoveRole(id);
    if (result.code == 200) {
        //提示信息
        ElMessage({ type: 'success', message: '删除成功' });
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
    }
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>