<template>
    <el-card>
        <el-table border style="margin: 10px 0;" :data="skuArr">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label='名称' prop="skuName" show-overflow-tooltip width="150px"></el-table-column>
            <el-table-column label='描述' prop='skuDesc' show-overflow-tooltip width="150px"></el-table-column>
            <el-table-column label='图片' width='150px'>
                <template #="{ row, $index }">
                    <img :src="row.skuDefaultImg" alt="" style='width:100px;height=100px'>
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="100px"></el-table-column>
            <el-table-column prop="price" label="价格" width="100px"></el-table-column>
            <el-table-column label="操作">
                <template #="{ row, $index }">
                    <el-button type='primary' @click="updateSale(row)" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
                        size="small"></el-button>
                    <el-button type='warning' @click='updateSku' icon='Edit' size="small"></el-button>
                    <el-button type='info' @click="findSku(row)" icon='InfoFilled' size="small"></el-button>
                    <el-button type='danger' @click="deleteSku(row)" icon='Delete' size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
            :background=true layout=" prev, pager, next, jumper,->,total, sizes," :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        <!-- 抽屉组件 -->
        <el-drawer v-model="drawer" direction="rtl">
            <template #header>
                <h4>查看商品的详情</h4>
            </template>
            <template #default>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag style='margin: 5px 5px;' v-for="item in skuInfo.skuAttrValueList" :key="item.id">{{ item.valueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6" >销售属性</el-col>
                    <el-col :span="18">
                        <el-tag style='margin: 5px 5px;' v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id">{{ item.saleAttrValueName}}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuInfo.skuImageList " :key="item.id">
                                <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale,reqGetSkuInfo,reqDeleteSku } from '@/api/product/sku'
import type { SkuResponseData, SkuData,SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus';
import { resolveSoa } from 'dns';
//分页器当前页码
let pageNo = ref<number>(1)
//每一页条数
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
//控制抽屉显示与英=隐藏
let drawer = ref<boolean>(false)
//sku详细信息
let skuInfo=ref<any>({})

//组件挂载完毕
onMounted(() => {
    getHasSku()
})
//获取Sku数据
const getHasSku = async (pager = 1) => {
    //当前分页器的页码
    pageNo.value = pager

    let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
    console.log(result);
    if (result.code == 200) {
        total.value = result.data.total
        skuArr.value = result.data.records
    }
}

//页码发生变化的回调
const handleCurrentChange = (num: number) => {
    getHasSku(num)
}
//条数发生变化的回调
const handleSizeChange = (num: number) => {
    pageSize.value = num
    getHasSku()
}

//切换商品上下架状态
const updateSale = async (row: SkuData) => {
    //isSale==1 说明当前商品是上架状态
    if (row.isSale == 1) {
        await reqCancelSale((row.id as number))
        ElMessage.success('下架成功')
    } else {
        await reqSaleSku((row.id as number))
        ElMessage.success('上架成功')
    }
    //重新获取数据
    getHasSku(pageNo.value)
}

//更新已有的SKU
const updateSku = () => {
    ElMessage.warning('该功能正在开发阶段')
}

//查看商品详细按钮回调
const findSku = async(row:SkuData) => {
    //展示抽屉组件
    drawer.value = true
    //获取已有商品详细数据
   let result:SkuInfoData= await reqGetSkuInfo((row.id as number))
   if(result.code==200){
     skuInfo.value=result.data
   }
}

//删除商品按钮回调
const deleteSku=async(row:SkuData)=>{
   let result= await reqDeleteSku((row.id as number))
   if(result.code==200){
    ElMessage.success('删除成功')
    getHasSku(skuArr.value.length>0?pageNo.value:pageNo.value-1)
   }else{
    ElMessage.error('删除失败')
   }
}

</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>