<template>
    <div class="box6">
        <div class="title">
            <p>热门景区排行</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <!-- 图形图标容器 -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
//获取DOM
let charts = ref()
onMounted(() => {
    let mychart = echarts.init(charts.value)
    mychart.setOption({
        title: {
            //主标题
            text: '景区排行',
            left: '50%',
            textStyle: {
                color: 'yellowgreen',
                fontSize: 20
            },
            //子标题
            subtext: '各大景区排行',
            //子标题样式

            subtextStyle: {
                color: 'yellowgreen',
                fontSize: 16
            }
        },
        //x |y 组件
        xAxis: {
            type: 'category' //代表图形图标均匀分布
        },
        yAxis: {},
        //布局组件
        grid: {
            left: 20,
            bottom: 20,
            right: 20
        },
        //系列
        series: [
            {
                type: 'bar',
                data: [10, 20, 30, 40, 50, 60, 70],
                label: {
                    show: true,
                    color: 'white',
                    position: 'top'
                },
                showBackground: true,
                backgroundStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'black' // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
                itemStyle:{
                    borderRadius:[10,10,0,0],
                    color:'cyan'
                }

            },
            {
                type:'line',
                data:[10,20,30,40,50,60,90],
                smooth:true
            }
        ],
        tooltip:{
            show:true
        }
    })
})

</script>

<style scoped lang="scss">
.box6 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 0px 20px;

    .title {
        margin-left: 5px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    }
}
</style>