//商品分类小仓库

import { defineStore } from "pinia";
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from "@/api/product/attr/type";
import type { CategoryState } from "./type";

export const useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            //一级分类
            c1Arr: [],
            //一级分类Id
            c1Id: '',
            //二级分类
            c2Arr: [],
            //二级分类Id
            c2Id: '',
            //三级分类
            c3Arr: [],
            //三级分类Id
            c3Id: '',
        }
    },
    actions: {
        //获取一级列表数据
        async getC1() {
            let res: CategoryResponseData = await reqC1()
            if (res.code == 200) {
                this.c1Arr = res.data
            }
        },
        //获取二级分类数据
        async getC2() {
            let res: CategoryResponseData = await reqC2(this.c1Id)
            if (res.code == 200) {
                this.c2Arr = res.data
            }
        },
        //获取三级分类数据
        async getC3() {
            let res: CategoryResponseData = await reqC3(this.c2Id)
            if (res.code == 200) {
                this.c3Arr = res.data
            }
        },

    },
    getters: {

    }
})