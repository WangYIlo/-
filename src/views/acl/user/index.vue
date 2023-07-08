<template>
    <el-card style="height: 80px;">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名:">
                <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!keyword" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0;">
        <el-button type="primary" @click="addUser">添加</el-button>
        <el-button type="danger" :disabled="!selectIdArr.length" @click="deleteSelectUser">批量删除</el-button>
        <!-- 表格展示用户信息 -->
        <el-table border style="margin: 10px 0;" :data="userArr"   @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column prop="id" label="ID" align="center"></el-table-column>
            <el-table-column prop="username" show-overflow-tooltip label="用户名字" align="center"></el-table-column>
            <el-table-column prop='name' show-overflow-tooltip label="用户名称" align="center"></el-table-column>
            <el-table-column prop="roleName" show-overflow-tooltip label="用户角色" align="center"></el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" align="center"></el-table-column>
            <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间" align="center"></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="primary" icon="User" size="small" @click="setRole(row)">分配角色</el-button>
                    <el-button type="primary" icon="Edit" size="small" @click="updateUser(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.username}`" width="260px" @confirm="deleteUser(row)">
                        <template #reference>
                            <el-button type="primary" icon="Delete" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>
    <!-- 抽屉结构:完成添加|更新用户 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉结构:账号的分配角色 -->
    <el-drawer v-model="drawer2">
        <template #header>
            <h4>分配角色(职位)</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input :disabled="true" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <el-checkbox @change="handleCheckAllChange" v-model="checkAll"
                        :indeterminate="isIndeterminate">全选</el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">{{
                            role.roleName
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer2 = false">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import {useLayoutSettingStore} from '@/store/modules/setting'
import { ref, onMounted, nextTick } from 'vue'
import { reqUserInfo, reqUpdateOrAddUserInfo, reqAllRole, reqSetRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user'
import type { Records, UserResponseData, User, AllRole, SetRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数据
let userArr = ref<Records>([])
//控制抽屉显示隐藏
let drawer = ref<boolean>(false)
let drawer2 = ref<boolean>(false)
//收集用户信息
let userParams = ref<User>({
    username: '',
    name: '',
    password: ''
})
//获取组件实例
let formRef = ref<any>()
//准备一个数组存储批量删除的用户ID
let selectIdArr=ref<any>([])
//收集用户输入进来的关键字
let keyword=ref<string>('')
//获取模板setting仓库
let settingStore=useLayoutSettingStore()

onMounted(() => {
    getHasUser()
})
//获取全部用户信息
const getHasUser = async (pager = 1) => {
    //收集当前页码
    pageNo.value = pager
    let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value,keyword.value)
    if (result.code == 200) {
        userArr.value = result.data.records
        total.value = result.data.total
    }

}
//分页器页数改变的回调
const handleSizeChange = (num: number) => {
    pageNo.value = num
    getHasUser()
}
//分页器页码改变的回调
const handleCurrentChange = (num: number) => {
    getHasUser(num)
}


//添加用户
const addUser = () => {
    //抽屉显示
    drawer.value = true
    //清空数据
    Object.assign(userParams.value, {
        id: 0,
        username: '',
        name: '',
        password: ''
    });
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    });
}
//更新用户
const updateUser = (row: User) => {
    //抽屉显示
    drawer.value = true
    //存储收集已有的账号信息
    Object.assign(userParams.value, row)
    //清除上一次的错误的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    });
}

//保存按钮回调
const confirmClick = async () => {

    await formRef.value.validate()

    //点击保存按钮：添加|更新
    let result: any = await reqUpdateOrAddUserInfo(userParams.value)
    if (result.code == 200) {
        //关闭抽屉
        drawer.value = false
        ElMessage.success(userParams.value.id ? '更新成功' : '添加成功')
        //获取用户信息
        getHasUser(userParams.value.id ? pageNo.value : 1)
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        //关闭抽屉
        drawer.value = false
        ElMessage.error(userParams.value.id ? '更新失败' : '添加失败')
    }


}
//取消按钮的回调
const cancelClick = () => {
    //抽屉关闭
    drawer.value = false
}


//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
//校验用户密码回调函数
const validatorPassword = (rule: any, value: any, callBack: any) => {
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
//表单校验的规则对象
const rules = {
    //用户名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}



//分配角色按钮的回调
const setRole = async (row: User) => {
    //存储已有的用户信息
    Object.assign(userParams.value, row)
    //发送请求获取职位具体信息
    let result = await reqAllRole((userParams.value.id as number))
    if (result.code == 200) {
        allRole.value = result.data.allRolesList
        userRole.value = result.data.assignRoles
        //显示抽屉
        drawer2.value = true
    }
}

//分配职位的确定按钮回调
const save = async () => {
    //收集参数
    let data: SetRoleData = {
        userId: (userParams.value.id as number),
        roleIdList: userRole.value.map((item) => {
            return (item.id as number)
        })
    }

    let result: any = await reqSetRole(data)
    if (result.code == 200) {
        //提示信息
        ElMessage.success('分配职位成功')
        drawer2.value = false
        //重新获取数据
        getHasUser(pageNo.value)
    }
}


//全选复选框收集数据:是否全选
let checkAll = ref<boolean>(false)
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
//设置不确定状态，负责样式
let isIndeterminate = ref<boolean>(true)
//全选复选框change事件
let handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

//删除某一个用户
const deleteUser=async (row:User)=>{
   let result:any=await reqRemoveUser((row.id as number))
   if(result.code==200){
     ElMessage.success('删除成功')
     getHasUser(userArr.value.length>0?pageNo.value:pageNo.value-1)
   }else{
    ElMessage.error('删除失败')
   }
}

//复选框勾选触发事件
const handleSelectionChange=(val:any)=>{
    selectIdArr.value=val
}

//批量删除
const deleteSelectUser=async()=>{
    //整理参数
    let idsList:any= selectIdArr.value.map((item:any)=>item.id)
    console.log(idsList);
    
    let result=await reqSelectUser(idsList)
    if(result.code==200){
     ElMessage.success('删除成功')
     getHasUser(userArr.value.length>0?pageNo.value:pageNo.value-1)
   }else{
    ElMessage.error('删除失败')
   }
}

//搜索按钮
const search=()=>{
    //根据关键字获取数据
    getHasUser()
    //清空关键字
    keyword.value=''
}
//重置
const reset=()=>{
    settingStore.refsh=!settingStore.refsh
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>