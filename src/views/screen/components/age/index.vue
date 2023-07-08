<template>
    <div class="box2">
        <div class="title">
            <p>年龄比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <!-- 图形图标容器 -->
        <div class="charts" ref="charts">
        </div>
    </div>
</template>
 
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue'
//获取节点
let charts = ref()

onMounted(() => {
    //获取echarts实例
    let myChart = echarts.init(charts.value)
    let option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '40px',
            right:'30px',
            orient:'vertical',
            textStyle:{
                color:'white',
                fontSize:'14px'
            }
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'inside',
                    color:'white'
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1048, name: '军事' },
                    { value: 735, name: '新闻' },
                    { value: 580, name: '娱乐' },
                    { value: 484, name: '财经' },
                    { value: 300, name: '体育' }
                ]
            }
        ],
        grid:{
            left:0,
            top:0,
            right:0,
            bottom:0
        }
    };
    //设置配置项
    myChart.setOption(option)
})
</script>
 
<style scoped lang="scss">
.box2 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 20px;

        p {
            font-size: 20px;
            color: white;
        }
    }

    .charts {
        height: 260px
    }
}
</style>