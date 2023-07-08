<template>
    <div class="box1">
        <div class="title">
            <p>男女比例</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="sex">
            <div class="man">
                <img src="../../images/man.png" alt="">
            </div>
            <div class="woman">
                <img src="../../images/woman.png" alt="">
            </div>
        </div>
        <div class="rate">
                <p>男士58%</p>
                <p>女士42%</p>
        </div>
        <div class="charts" ref="charts"></div>
    </div>
 </template>
 
 <script setup lang="ts">
 import * as echarts from 'echarts';
 import { ref, onMounted } from 'vue'
  //获取节点
  let charts = ref()

  onMounted(()=>{
     //获取echarts实例
    let myChart=echarts.init(charts.value)
    myChart.setOption({
        title:{
            text:'男女比例',
            textStyle:{ //标题颜色
                color:'skyblue'
            },
            left:'40%'
        },
        //x|y
        xAxis:{
            show:false,
            min:0,
            max:100
        },
        yAxis:{
            show:false,
            type:'category'
        },
        //系列
        series:[
            {
                type:'bar',
                data:[58],
                barWidth:20,
                z:100,
                itemStyle:{
                    borderRadius: 20,
                    color:'skyblue'
                }
            },
            {
                type:'bar',
                data:[100],
                barWidth:20,
                //调整柱条位置
                barGap:'-100%',
                itemStyle:{
                    borderRadius: 20,
                    color:'pink'
                }
            }
        ],
        grid:{
            left:0,
            bottom:0,
            right:0,
            top:0
        }

    })
  })

 </script>

 
 <style scoped lang="scss">
 .box1{
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0;

    .title{
        margin-left: 20px;
        p{
            font-size: 20px;
            color: white;
        }
    }
    .sex {
        display: flex;
        justify-content: center;
         .man{
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url(../../images/man-bg.png);
            display: flex;
            justify-content: center;
            align-items: center;
         }

         .woman{
            margin: 20px;
            width: 111px;
            height: 115px;
            background: url(../../images/woman-bg.png);
            display: flex;
            justify-content: center;
            align-items: center;
         }
    }

    .rate{
        display: flex;
        justify-content: space-between;
        color: white;
    }

    .charts{
        height: 100px;
    }
 }
 
 </style>