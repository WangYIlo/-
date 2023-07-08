<template>
    <div class='box'>
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">可预约总量<span>9999</span>人</p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <!-- echarts展示图形图标 -->
        <div class="charts" ref="charts">

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts';
//水球图拓展插件
import 'echarts-liquidfill'

let people = ref('216908人')
//获取节点
let charts = ref()
onMounted(() => {
    //获取echarts实例
    var myChart = echarts.init(charts.value);
    //设置实例配置项
    myChart.setOption({
        //标题组件
        title: {
            text: '水球图'
        },
        //x|y轴组件
        xAxis: {},
        yAxis: {},
        //系列:决定展示什么样的图形图标
        series: {
            type: 'liquidFill', //水球图
            data: [ 0.3,0.2,0.1], //数据
            radius: '100%',

            outline: { //外部线条
                show: true,
                borderDistance: 8,
                itemStyle: {
                    color: 'none',
                    borderColor: '#294D99',
                    borderWidth: 8,
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.25)'
                }
            },

            label: {
                show: true,
                color: '#294D99',
                insideColor: '#fff',
                fontSize: 30,
                fontWeight: 'bold',

                align: 'center',
                baseline: 'middle',
                position: 'inside',
                formatter:'预约量'
            },
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        }
    })

})

</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .top {
        margin-left: 20px;

        .title {
            color: white;
            font-size: 20px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 1005;
            margin-top: 10px;
        }

        .right {
            float: right;
            color: white;
            font-size: 20px;

            span {
                color: yellowgreen;
            }
        }
    }


    .number {
        margin-top: 30px;
        display: flex;
        padding: 20px;

        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
            font-weight: 900;
        }
    }

    .charts {
        width: 100%;
        height: 250px;
    }
}
</style>