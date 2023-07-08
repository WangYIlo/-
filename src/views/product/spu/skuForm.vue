<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="重量(g)" type="number" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form inline="true">
                <el-form-item :label="item.attrName" v-for="item in attrArr" :key="item.id">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option :value="`${item.id}:${attrValue.id}`" v-for="attrValue in item.attrValueList" :key='attrValue.id' :label="attrValue.valueName"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form inline="true">
                <el-form-item :label="item.saleAttrName" v-for="item in saleArr " :key="item.id">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option :value="`${sale.id}:${item.id}`" :label="sale.saleAttrValueName" v-for="sale in item.spuSaleAttrValueList" :key="sale.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片">
                    <template #="{row,$index}">
                        <img :src="row.imgUrl" alt="" style="height: 100px; width: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="名称" prop="imgName"></el-table-column>
                <el-table-column label="操作">
                    <template #="{row,$index}">
                        <el-button type="primary" @click="handler(row)">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reqSpuImageList, reqSpuSaleAttr,reqAddSku } from '@/api/product/spu'
import {reqAttr} from '@/api/product/attr'
import type {SkuData} from '@/api/product/spu/type'
import {ref} from  'vue'
import { ElMessage } from 'element-plus';

let $emit = defineEmits(['changeScene'])
//平台属性
let attrArr=ref<any>([])
//销售属性
let saleArr=ref<any>([])
//照片墙数据
let imgArr=ref<any>([])
//获取table组件实例
let table=ref()

//收集SKU的参数
let skuParams=ref<SkuData>({
    //父组件传过来的数据
    category3Id:'',
    spuId:'',
    tmId:'',
    //v-model收集
    skuName:'',
    price:'',
    weight:'',
    skuDesc:'',

    skuAttrValueList:[],
    skuSaleAttrValueList:[],
    skuDefaultImg:''
})

//取消按钮回调
const cancel=()=>{
    console.log($emit);
    
  //切换场景
  $emit('changeScene', {num:1,params:''})
}

//当前子组件的方法对外保留
const initSkuData=async (c1Id:number|string,c2Id:number|string,spu:any)=>{

    //收集数据
    skuParams.value.category3Id=spu.category3Id
    skuParams.value.spuId=spu.id
    skuParams.value.tmId=spu.tmId


    //获取平台属性
   let result= await reqAttr(c1Id,c2Id,spu.category3Id)
   //获取销售属性
   let result1=await reqSpuSaleAttr(spu.id)
   //获取照片墙
   let result2=await reqSpuImageList(spu.id)

   
   //平台属性
   attrArr.value=result.data
   //销售属性
   saleArr.value=result1.data
   //照片墙属性
   imgArr.value=result2.data
    
}

//设置图片
const handler=(row:any)=>{
   skuParams.value.skuDefaultImg=row.imgUrl
   

   imgArr.value.forEach((item:any)=>{
    table.value.toggleRowSelection(item,false)
   })
     table.value.toggleRowSelection(row,true)
   
    
}

//保存按钮
const save =async()=>{
    //整理参数
   //平台属性
   skuParams.value.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':');
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParams.value.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
            prev.push({
                saleAttrId, saleAttrValueId
            })
        }
        return prev;
    }, []);

    //添加SKU请求
   let result:any= await reqAddSku(skuParams.value) 
   if(result.code==200){
        ElMessage.success('添加SKU成功')
        //切换场景
        $emit('changeScene', {num:1,params:''})
   }else{
        ElMessage.error('添加SKU失败')
   }
   
    

}



//对外暴露
defineExpose({initSkuData})

</script>

<style scoped>

</style>