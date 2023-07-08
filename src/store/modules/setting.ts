// 关于layout相关配置

import { defineStore } from "pinia";

export const useLayoutSettingStore=defineStore('SettingStore',{
    state:()=>{
        return {
            fold:false, //用于控制菜单折叠或收起
            refsh:false,//用于控制刷新效果
        }
    }
})