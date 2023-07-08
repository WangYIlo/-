<template>
    <div class="box4" ref="map">
        地图组件
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图JSON数据
import chinaJson from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJson as any);
onMounted(() => {
    let mychart = echarts.init(map.value)
    mychart.setOption({
        //地图组件
        geo: [{
            map: 'china',//中国地图
            roam: true,//开启鼠标缩放
            //地图位置调试
            left: 50,
            top: 100,
            right: 50,
            botoom: 0,
            //地图上的文字显示
            label: {
                show: true,
                color: 'white',
                fontSize: 14
            },
            //多边形图形样式
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0, color: 'skyblue' // 0% 处的颜色
                    }, {
                        offset: 1, color: 'blue' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                },
                opacity: .8
            },
            //地图高亮效果
            emphasis: {
                itemStyle: {
                    color: 'red'
                },
                label: {
                    fontSize: 40
                }
            }

        }],
        series: [
            {
                type: 'lines',
                data: [
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [119.306239, 26.075302]   // 终点
                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'orange',
                            width: 5
                        }
                    },
                    {
                        coords: [
                            [116.405285, 39.904989],  // 起点
                            [114.298572, 30.584355]   // 终点

                        ],
                        // 统一的样式设置
                        lineStyle: {
                            color: 'yellow',
                            width: 5
                        }
                    }
                ],
                //开启动画特效
                effect:{
                    show:true,
                    symbol: 'arrow',
                    color: 'white',
                    symbolSize: 10
                }
            }
        ]
    })
})
</script>

<style scoped></style>