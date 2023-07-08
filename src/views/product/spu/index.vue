<template>
    <!-- 三级分类 -->
    <Category :flag="flag" />
    <el-card style="margin: 10px 0;">
        <!-- 首页展示三级分类数据 -->
        <div v-show="flag == 1">
            <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addSpu">添加SPU</el-button>
            <el-table style="margin: 10px 0;" border :data="records">
                <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
                <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
                <el-table-column label="SPU操作">
                    <template #="{ row, $index }">
                        <el-button type="primary" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
                        <el-button type="warning" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
                        <el-button type="info" icon="View" title="查看SKU列表" @click="findeSku(row)"></el-button>
                        <el-popconfirm :title="`你确定要删除${row.spuName}嘛`" width="200px"  @confirm='deleteSku(row)'>
                            <template #reference>
                                <el-button type="danger" icon="Delete" title="删除SKU">
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                background="true" layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
                @current-change='getHasSpu' @size-change="changeSize" />
        </div>
        <!-- 添加以及修改Spu组件 -->
        <SpuForm ref="SpuFormCv" v-show="flag == 2" @changeScene="changeScene"></SpuForm>
        <!-- 添加以及修改Sku组件 -->
        <SkuForm ref="SkuFormCv" v-show="flag == 3" @changeScene="changeScene"></SkuForm>
        <!--  dialog对话框-->
        <el-dialog v-model="show" title="SKU列表">
            <el-table border :data="skuArr">
                <el-table-column label='SKU名字' prop="skuName" show-overflow-tooltip=true></el-table-column>
                <el-table-column label='SKU价格' prop="price"></el-table-column>
                <el-table-column label='SKU重量' prop="weight"></el-table-column>
                <el-table-column label="SKU图片">
                    <template #="{ row, $index }">
                        <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import { ref, watch,onBeforeUnmount } from 'vue'
import { useCategoryStore } from '@/store/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type { HasSpuResponseData, Records, SpuData, SkuData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus';

let categoryStore = useCategoryStore()
// 控制三级分类使用|禁用--以及组件切换
let flag = ref<number>(1)
//分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(3)
//存储SPU数据
let records = ref<Records>([])
//存储已有的总个数
let total = ref<number>(1)
//获取子组件实例SpuForm
let SpuFormCv = ref<any>()
//获取子组件实例SkuForm
let SkuFormCv = ref<any>()
//存储全部sku信息
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

//监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
    if (!categoryStore.c3Id) {
        return
    }
    //务必保证有三级分类id
    getHasSpu()
})

//获取三级分类下的Spu数据
const getHasSpu = async (pager = 1) => {
    //修改当前页码
    pageNo.value = pager
    let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
    if (result.code == 200) {
        records.value = result.data.records
        total.value = result.data.total
    }
}
//分页器页码事件
const changeSize = () => {
    getHasSpu()
}

//添加新的SPU
const addSpu = () => {
    //切换Spu组件
    flag.value = 2
    SpuFormCv.value.initAddSpu(categoryStore.c3Id)
}

//修改SPU
const updateSpu = (row: SpuData) => {
    //切换Spu组件
    flag.value = 2

    SpuFormCv.value.initHasSpuData(row)

}

//子组件SpuForm绑定自定义事件--用于切换场景
const changeScene = (obj: any) => {
    //子组件点击取消变为场景0
    flag.value = obj.num
    if (obj.params == 'update') {
        //更新留在当前页
        //再次获取数据
        getHasSpu(pageNo.value)
    } else {
        //添加留在第一页
        getHasSpu()
    }
}

//添加SKU按钮回调
const addSku = (row: SpuData) => {
    //切换Sku组件
    flag.value = 3
    //调用子组件方法进行初始化
    SkuFormCv.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}


//查找spu中的sku全部信息
const findeSku = async (row: SpuData) => {
    let res = await reqSkuList((row.id as number))
    if (res.code == 200) {
        skuArr.value = res.data
        show.value = true
    }
}

//删除spu
const deleteSku=async(row:SpuData)=>{
   let result=await reqRemoveSpu((row.id as number))
   if(result.code==200){
    ElMessage.success('删除成功')
    //重新获取剩余数据
    getHasSpu(records.value.length>1?pageNo.value:pageNo.value-1)
   }else{
    ElMessage.error('删除失败')
   }
}

//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(()=>{
    categoryStore.$reset()
})

</script>

<style scoped></style>