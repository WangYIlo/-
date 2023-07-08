<template>
   <div class="login_container">
        <el-form class="login-form" :rules="rules"  :model="loginForm" ref="loginFormRef">
            <div class="title-container">
                <h3 class="title">Login Form</h3>
            </div>
            <el-form-item prop="username" >
                <el-input v-model="loginForm.username" placeholder="请输入用户名">
                    <template #prefix>
                        <SvgIcon name="people" color="#889aa4"></SvgIcon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" show-password>
                    <template #prefix>
                        <SvgIcon name="lock" color="#889aa4"></SvgIcon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading=loading style="width: 100%; margin-bottom:10px" @click="login">Login</el-button>
            </el-form-item>
            <div class="tip">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage,ElNotification } from 'element-plus'
import { useRouter,useRoute } from 'vue-router'
//获取当前时间
import {getTime} from '@/utils/time'

let useStore = useUserStore()
let router = useRouter()
let route = useRoute()

let loading = ref(false)

let loginForm = ref({
    username: '',
    password: ''
})




//loginform实例
const loginFormRef=ref()

//登录按钮回调
const login = async () => {
    //保证全部表单校验通过再发请求
   await loginFormRef.value.validate()
    
    //按钮加载效果
    loading.value = true
    try {
        const res = await useStore.userLogin(loginForm.value)
        loading.value=false
        if(route.query){
            router.push(`${route.query.redirect}`)
        }else{
            router.push('/')
        }
        ElNotification({
            type:'success',
            message:res,
            title:`HI,欢迎回来，${getTime()}好`
        })
    } catch (e) {
        loading.value=false
        ElMessage.error((e as Error).message)
    }
    resetForm()

}



//表单校验规则
const rules=ref({
    username:[{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    password:[{required:true,min:6,max:15,message:'密码长度6-10位',trigger:'change'}]
})
//重置表单
const resetForm=()=>{
    loginFormRef.value.resetFields()
}

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background-color: $bg;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .tip {
        color: white;
    }


}
</style>