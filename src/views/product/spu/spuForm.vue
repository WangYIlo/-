<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="SpuParams.tmId">
                <el-option v-for="item in AllTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请你输入描述" v-model="SpuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU照片">
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <el-select :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
                v-model="saleAtrrIdAndValueName">
                <el-option :value="`${attr.id}:${attr.name}`" v-for="attr in unSelectSaleAttr " :key="attr.id"
                    :label="attr.name"></el-option>
            </el-select>
            <el-button :disabled="!saleAtrrIdAndValueName" type="primary" icon="Plus" style="margin-left: 10px;"
                @click="addSaleAttr">添加销售属性</el-button>
            <el-table border style="margin: 10px 0;" :data="saleAttr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="属性名" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="属性值">
                    <template #="{ row, $index }">
                        <el-tag closable @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" style="margin: 0px 5px;">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input v-model="row.saleAttrValue" @blur="toLook(row)" v-if="row.flag" placeholder="请你输入属性值"
                            size="small" style="width: 100px;"></el-input>
                        <el-button @click="toEdit(row)" v-else icon="Plus" size="small" type="primary"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button icon="Delete" size="small" type="danger" @click='saleAttr.splice($index, 1)'></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save" :disabled="!saleAttr.length">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, Trademark, SpuImg, SaleAttr, HasSaleAttr } from '@/api/product/spu/type'
import { reqAllTradeMark, reqSpuImageList, reqSpuSaleAttr, reqAllSaleAttr, reqAddorUpdateSpu } from '@/api/product/spu'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus';
import { SaleAttrValue } from '@/api/product/spu/type';
let $emit = defineEmits(['changeScene'])

//点击取消按钮:通知父组件进行切换
const cancel = () => {
    $emit('changeScene', {num:1,params:'update'})
}

//存储已有的SPU品牌数据
let AllTradeMark = ref<Trademark[]>([])
//SPU对应商品图片
let imgList = ref<SpuImg[]>([])
//SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
//所有销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有SPU对象
let SpuParams = ref<SpuData>({
    category3Id: '', //三级分类id
    description: '', //描述
    spuName: '', //名字
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: []
})
//控制照片对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储预览图片地址
const dialogImageUrl = ref('')
//将来收集还未选择的销售属性的ID与属性名字
let saleAtrrIdAndValueName = ref('')


//更新一个新的SPU初始化
const initHasSpuData = async (spu: SpuData) => {
    //spu：即为父组件传递过来的已有spu对象
    //存储已有的spu对象
    SpuParams.value = spu

    //获取全部品牌数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取某一个品牌旗下售卖商品的图片
    let result1: SpuHasImg = await reqSpuImageList((spu.id as number))
    //获取SPU拥有多少销售属性
    let result2: SaleAttrResponseData = await reqSpuSaleAttr((spu.id as number))
    //获取整个项目全部的销售属性
    let result3: HasSaleAttrResponseData = await reqAllSaleAttr()

    //存储全部商品数据
    AllTradeMark.value = result.data
    //SPU对应商品图片
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    //SPU销售属性
    saleAttr.value = result2.data
    //所有销售属性
    allSaleAttr.value = result3.data
}

//添加一个新的SPU初始化
const initAddSpu = async (c3Id: number) => {
    //清空数据
    Object.assign(SpuParams.value, {
        category3Id: '', //三级分类id
        description: '', //描述
        spuName: '', //名字
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
    })
    imgList.value=[]
    saleAttr.value=[]
    saleAtrrIdAndValueName.value=''

    //存储三级分类id
    SpuParams.value.category3Id = c3Id

    //获取全部品牌数据
    let result: AllTradeMark = await reqAllTradeMark()
    //获取整个项目全部的销售属性
    let result2: HasSaleAttrResponseData = await reqAllSaleAttr()

    //存储全部商品数据
    AllTradeMark.value = result.data
    //所有销售属性
    allSaleAttr.value = result2.data


}

//照片墙点击预览按钮触发钩子
const handlePictureCardPreview = (file: any) => {
    //弹出对话框
    dialogVisible.value = true
    //展示图片
    dialogImageUrl.value = file.url
}
//照片墙删除文件的钩子
const handleRemove = () => {

}
//照片墙上传成功之前的钩子---约束文件大小与类型
const handlerUpload = (file: any) => {
    //约束上传文件的类型
    if (file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/jpeg') {
        ElMessage.success('上传成功')
        return true
    } else {
        ElMessage.error('上传文件类型需 PNEG,JPG,GIF')
        return false
    }
}

//计算当前SPU还未拥有的销售属性---记得尝试
let unSelectSaleAttr = computed(() => {
    return allSaleAttr.value.filter((item) => {
        return saleAttr.value.every((item1) => {
            return item.name != item1.saleAttrName
        })
    })
})

//添加销售属性
const addSaleAttr = () => {
    const [baseSaleAttrId, saleAttrName] = saleAtrrIdAndValueName.value.split(':')
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttr.value.push(newSaleAttr)
}

//属性值按钮点击事件--用于input和button切换
const toEdit = (row: SaleAttr) => {
    //切换模式
    row.flag = true
    //用于收集新增属性值|并重置新增属性值
    row.saleAttrValue = ''
}

//input失去焦点事件回调--用于input和button切换
const toLook = (row: SaleAttr) => {
    //整理收集的属性ID与属性值
    const { baseSaleAttrId, saleAttrValue } = row
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: (saleAttrValue as string)
    }

    //非法情况判断
    //1.不能为空或者空字符
    if (saleAttrValue?.trim() == '') {
        ElMessage.error('属性值不能为空')
        return
    }
    //2.不能重名
    let repeat = row.spuSaleAttrValueList.find((item) => {
        return item.saleAttrValueName == saleAttrValue
    })

    if (repeat) {
        ElMessage.error('属性值不能相同')
        return
    }

    //追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)

    //切换模式
    row.flag = false
}

//保存按钮回调
const save = async () => {
    //整理参数
    //1.照片墙数据
    SpuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    //2.销售属性数据
    SpuParams.value.spuSaleAttrList = saleAttr.value

    //发请求
    let result = await reqAddorUpdateSpu(SpuParams.value)
    if (result.code == 200) {
        ElMessage.success(SpuParams.value.id ? '更新成功' : '添加成功')
    } else {
        ElMessage.error(SpuParams.value.id ? '更新失败' : '添加失败')
    }
    //切换场景
    $emit('changeScene', {num:1,params:SpuParams.value.id?'update':'add'})

}

defineExpose({ initHasSpuData, initAddSpu })

</script>

<style scoped></style>

