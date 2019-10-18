<template>
  <!-- 使用  ref获取元素   -->
  <div ref="mychart" class="chart" :style="{width:chartWidth,height:chartHeight}"></div>
</template>

<script lang="ts">
import { Component, Vue, Provide, Prop } from "vue-property-decorator";
import echarts from "echarts"; //  引入Echarts
@Component({
  components: {}
})
export default class Charts extends Vue {
  @Prop({ type: String, default: "line" }) readonly chartType!: string; // 图表类型 line/bar/pie
  @Prop(Object) chartData!: string | null;

  @Provide() chartWidth: string = "";
  @Provide() chartHeight: string = "";

  created() {
    this.generatorWidthAndHeight();
  }

  // 图表生成宽度和高度
  generatorWidthAndHeight() {
    this.chartWidth = `${document.body.offsetWidth * 0.8}px`;
    this.chartHeight = `${document.body.offsetHeight * 0.6}px`;
  }

  // 要在挂载完成的生命周期函数 mounted 中执行  绘制图表的方法。
  mounted() {
    this.drawChart();
  }

  // 绘制 图表
  drawChart() {
    // 1 实例echarts对象         ref获取的 mychart元素
    let chart = echarts.init((this as any).$refs.mychart as HTMLCanvasElement);
    if (chart == undefined) {
      console.log(`echarts init dom is failed`);
      return;
    }
    switch (this.chartType) {
      case "line":
        // 实例.setOption() 方法 来设置 图表的属性  是一个 对象 {}
        chart.setOption((this as any).generatorLineOption());
        break;
      case "bar":
        chart.setOption((this as any).generatorBarOption());
        break;
      case "pie":
        chart.setOption((this as any).generatorPieOption());
        break;
      // default:
      //   console.log(`chartType ${this.chartType} is invalid`);
      //   break;
    }
  }

  // 绘制折线图
  generatorLineOption() {
    return {
      // 要返回一个对象  ｛｝
      title: {
        text: "近一周学习量", // 大标题
        subtext: "test", // 副标题
        x: "center" // 位置
      },
      xAxis: {
        type: "category",
        data: (this as any).chartData.xAxisData
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: (this as any).chartData.yAxisData,
          type: "line",
          smooth: true // 平滑效果
        }
      ],
      // 提示工具
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      }
    };
  }

  generatorBarOption() {
    return {
      title: {
        text: "近一周学习量",
        subtext: "test",
        x: "center"
      },
      xAxis: {
        type: "category",
        data: (this as any).chartData.xAxisData
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: (this as any).chartData.yAxisData,
          type: "bar",
          barWidth: "20%" //   柱图的宽度
        }
      ],
      color: ["#3398DB"], // 颜色
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      // 布局大小   可以放大 缩小
      grid: {
        left: "3%",
        right: "4%",
        bottom: "5%"
      }
    };
  }

  /**
  *  chartData: any = {
    xAxisData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    yAxisData: [820, 932, 901, 934, 1290, 1330, 1320]
  };
  * 
  */

  //  饼图
  generatorPieOption() {
    // 处理数据 （饼图的数据 是需要 value 和 name 的 所以将数据进行遍历 将y数据存储为value,将x数据存储为name）
    let pieData = [];
    for (const index in (this as any).chartData.xAxisData) {
      pieData.push({
        value: (this as any).chartData.yAxisData[index],
        name: (this as any).chartData.xAxisData[index]
      });
    }

    return {
      title: {
        text: "近一周学习量",
        subtext: "test",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // 左侧展示数据的列表
      legend: {
        orient: "vertical",
        left: "left",
        data: (this as any).chartData.xAxisData
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: pieData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
  }
}
</script>

<style>
</style>
