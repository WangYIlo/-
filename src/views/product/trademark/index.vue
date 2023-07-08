<template>
    <el-card class="box-card">
        <!-- 卡片顶部添加品牌按钮 -->
        <el-button type="primary" icon="Plus" @click=addTrademark>添加品牌</el-button>
        <!-- 表格组件 -->
        <el-table style="margin: 10px 0;" border :data="trademarkArr">
            <el-table-column prop="id" label="序号" width="80px" />
            <el-table-column prop="tmName" label="品牌" />
            <el-table-column label="品牌LOGO">
                <template #default="{ row }">
                    <img :src="row.logoUrl" style="width: 100px; height: 100px;">
                </template>
            </el-table-column>
            <el-table-column label="品牌操作">
                <template #default="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)"> </el-button>
                    <el-popconfirm :title='`您确定要删除${row.tmName}`' icon="Delete" width='200px' @confirm="deleteTrademark(row)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete"> </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器组件 -->
        <div class="demo-pagination-block">
            <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                background=true layout="prev, pager, next, jumper,->,total, sizes" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-card>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogVisible" :title="trademarkParmas.id ? '修改品牌' : '添加品牌'">
        <el-form style="width:80%" :model="trademarkParmas" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" label-width="80px" prop='tmName'>
                <el-input placeholder="请你输入品牌名称" v-model="trademarkParmas.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌logo" label-width="80px" prop='logoUrl'>
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParmas.logoUrl" :src="trademarkParmas.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 具名插槽 -->
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click=confirm>确定</el-button>
                <el-button type="primary" @click=cancel>
                    取消
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark,reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponse, TradeMark } from '@/api/product/trademark/type'
//当前页面
let pageNo = ref<number>(1)
//每页展示的数据条数
let limit = ref<number>(3)

//存储已有品牌数据的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
//获取el-form组件实例
let formRef = ref()

let inputArr=ref<any>([])

//获取已有品牌接口封装为一个函数
const getHasTrademark = async (pager = 1) => {
    //当前页码
    pageNo.value = pager;
    let res: TradeMarkResponse = await reqHasTrademark(pageNo.value, limit.value)
    if (res.code == 200) {
        total.value = res.data.total
        trademarkArr.value = res.data.records
    }
}
//分页器组件size改变事件
const handleSizeChange = (value: number) => {
    limit.value = value
    pageNo.value = 1
    getHasTrademark()

}
//分页器组件当前pageNo改变事件
const handleCurrentChange = (value: number) => {
    getHasTrademark(value)
}

//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集新增品牌的数据
let trademarkParmas = ref<TradeMark>({
    tmName: '',
    logoUrl: ''
})

onMounted(() => {
    getHasTrademark()
})

//添加品牌按钮
const addTrademark = () => {
    //显示对话框
    dialogVisible.value = true
    //清空数据
    trademarkParmas.value.tmName = ''
    trademarkParmas.value.logoUrl = ''
    trademarkParmas.value.id = undefined
    //清空校验规则错误提示信息
    nextTick(() => {
        formRef.value.clearValidate('tmName');
        formRef.value.clearValidate('logoUrl');
    })
}
//修改品牌按钮
const updateTrademark = (row: TradeMark) => {
    trademarkParmas.value.tmName = row.tmName
    trademarkParmas.value.logoUrl = row.logoUrl
    trademarkParmas.value.id = row.id
    //显示对话框
    dialogVisible.value = true

}
//取消
const cancel = () => {
    dialogVisible.value = false
}
//确定--添加|修改 品牌
const confirm = async () => {
    //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
    await formRef.value.validate();

    let result = await reqAddOrUpdateTrademark(trademarkParmas.value)
    if (result.code == 200) {
        dialogVisible.value = false
        ElMessage.success(trademarkParmas.value.id ? '修改品牌成功' : '添加品牌成功')
        //再次发请求获取已有全部的品牌数据
        getHasTrademark(trademarkParmas.value.id ? pageNo.value : 1);
    } else {
        dialogVisible.value = false
        ElMessage.error(trademarkParmas.value.id ? '修改品牌失败' : '添加品牌失败')
    }

}
//上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //要求:上传文件格式 | 约束文件大小
    if (rawFile.type === 'image/jpg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
        ElMessage.error('图片格式务必是PNG|JPG|GIF')
        return false
    } else if (rawFile.size / 1024 / 1024 > 5) {
        ElMessage.error('图片最大不能超过5Mb')
        return false
    }
    return true
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    trademarkParmas.value.logoUrl = response.data
}
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
    //是当表单元素触发blur时候,会触发此方法
    //自定义校验规则
    if (value.trim().length >= 2) {
        callBack();
    } else {
        //校验未通过返回的错误的提示信息
        callBack(new Error('品牌名称位数大于等于两位'))
    }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    //如果图片上传
    if (value) {
        callBack();
    } else {
        callBack(new Error('LOGO图片务必上传'))
    }
}
//表单校验规则对象
const rules = {
    tmName: [
        //required:这个字段务必校验,表单项前面出来五角星
        //trigger:代表触发校验规则时机[blur、change]
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}

//删除品牌
const deleteTrademark = async (row:TradeMark) => {
    
   let result = await reqDeleteTrademark((row.id as number))
   if(result.code==200){
    ElMessage.success('删除成功')
    getHasTrademark(trademarkArr.value.length>1?pageNo.value:pageNo.value-1)
   }else{
    ElMessage.success('删除失败')
   }
}




</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>