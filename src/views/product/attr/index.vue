<template>
    <!-- 三级分类全局组件 -->
    <Category :flag="flag" />
    <el-card style="margin: 10px 0;">
        <div v-if="flag">
            <el-button type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true"
                @click='addAtrr'>添加平台属性</el-button>
            <el-table border style="margin: 10px 0;" :data="attrArr">
                <el-table-column label="序号" type="index" width="80px" align="center" />
                <el-table-column label="属性名称" width="120px" prop="attrName" />
                <el-table-column label="属性值名称">
                    <template #default="{ row }">
                        <el-tag style="margin: 5px;" v-for="item in row.attrValueList" :key="item.id">{{
                            item.valueName }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" icon="Edit" @click="updateAtrr(row)"> </el-button>
                        <el-popconfirm :title="`确定要删除${row.attrName}?`" width="200px"  @confirm="deleteAtrr(row.id)">
                            <template #reference >
                                <el-button type="danger" size="small" icon="Delete"> </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else>
            <!-- 添加|修改属性结构 -->
            <el-form :inline="true">
                <el-form-item label='属性名称'>
                    <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="Plus" :disabled="attrParams.attrName ? false : true"
                @click="addAttrValue">添加属性值</el-button>
            <el-button @click="cancel">取消</el-button>
            <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                <el-table-column label="属性值名称">
                    <template #default="{ row, $index }">
                        <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" placeholder="请你输入属性值名称"
                            v-model="row.valueName" @blur="toLook(row, $index)"></el-input>
                        <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="属性值操作">
                    <template #default="{ row, $index }">
                        <el-button type="danger" icon="Delete"
                            @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="save"
                :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import { useCategoryStore } from '@/store/modules/category'
import { watch, ref, nextTick,onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUppdate, reqRemove } from '@/api/product/attr'
import type { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
//存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
//定义卡片组件切换
let flag = ref<boolean>(true)

//路由组件销毁时
onBeforeUnmount(()=>{
    //情况仓库数据
   categoryStore.$reset()
})


//监听仓库三级分类id变化
watch(() => categoryStore.c3Id, () => {

    //清空上一次查询的数据
    attrArr.value = []

    //保证三级分类有
    if (categoryStore.c3Id) {
        getAttr()
    }
})
//获取已有的属性和属性值方法
const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
        attrArr.value = result.data
    }
    console.log(result);

}
//添加属性按钮
const addAtrr = () => {
    //先清空数据(初始化数据)
    Object.assign(attrParams.value, {
        attrName: '',
        attrValueList: [],
        categoryId: categoryStore.c3Id,  //添加新增属性的三级分类的ID
        categoryLevel: 3
    })

    //切换为添加|修改属性的结构
    flag.value = false

}
//修改已有属性按钮
const updateAtrr = (row: Attr) => {
    //切换为添加|修改属性的结构
    flag.value = false
    //将已有的属性对象赋值给attrParams进行页面渲染
    //Object.assign(浅拷贝)进行合并---要先深拷贝一个对象--再利用浅拷贝
    Object.assign(attrParams.value, JSON.parse(JSON.stringify(row)))
}

//新增属性数据
let attrParams = ref<Attr>({
    attrName: '', //新增的属性名
    attrValueList: [],//新增属性的属性值数组
    categoryId: '',  //三级分类的ID
    categoryLevel: 3 //三级分类
})

//添加属性值
const addAttrValue = () => {
    //点击一次--追加一个属性值对象
    attrParams.value.attrValueList.push({
        valueName: '',
        flag: true //控制每一个属性值的编辑模式
    })
    nextTick(() => {
        inputArr.value[inputArr.value.length - 1].focus()
    })
}

//取消按钮
const cancel = () => {
    flag.value = true
}

//保存按钮
const save = async () => {
    //发请求
    let result = await reqAddOrUppdate(attrParams.value)
    if (result.code == 200) {
        //切换场景
        flag.value = true
        ElMessage.success(attrParams.value.id ? '修改成功' : '添加成功')
        //重新获取数据
        getAttr()
    } else {
        ElMessage.success(attrParams.value.id ? '修改失败' : '添加失败')
    }

}

//属性值表单元素失去焦点
const toLook = (row: AttrValue, $index: number) => {
    //非法情况判断
    //1.属性值不能为空或者空串
    if (row.valueName.trim() == '') {
        //删除对应属性值为空的元素--防止空串
        attrParams.value.attrValueList.splice($index, 1)
        ElMessage.error('属性值不能为空')
        return
    }
    //2.属性值不能相同
    let repeat = attrParams.value.attrValueList.find((item) => {
        //切记把当前对象扣除
        if (item != row) {
            return item.valueName === row.valueName
        }
    })
    if (repeat) {
        //删除重复值
        attrParams.value.attrValueList.splice($index, 1)
        ElMessage.error('属性值不能重复')
        return
    }

    row.flag = false
}
//属性表单元素得到焦点
const toEdit = (row: AttrValue, $index: number) => {
    row.flag = true
    nextTick(() => {
        inputArr.value[$index].focus()
    })
}

//input聚焦业务

//el-input组件实例
let inputArr = ref<any>([])


//删除某一个已有属性
const deleteAtrr = async (attrId: number) => {
    let res = await reqRemove(attrId)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        //重新获取数据
        getAttr()
    } else {
        ElMessage.error('删除失败')
    }
}

</script>

<style scoped></style>