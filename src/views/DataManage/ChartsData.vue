<template>
  <div class="charts-data">
    <!-- 选项卡  -->
    <!-- v-model="tabPosition"   作用：默认选中项  为  line -->
    <el-tabs type="border-card" v-model="tabPosition">
      <el-tab-pane label="折线图" name="line">
        <Charts :chartData="chartData" chartType="line"></Charts>
        <!-- 使用封装的 echarts 组件 -->
      </el-tab-pane>
      <el-tab-pane label="柱状图" name="bar">
        <Charts :chartData="chartData" chartType="bar"></Charts>
        <!-- 使用封装的 echarts 组件 -->
      </el-tab-pane>
      <el-tab-pane label="饼图" name="pie">
        <Charts :chartData="chartData" chartType="pie"></Charts>
        <!-- 使用封装的 echarts 组件 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import Charts from "../../components/Charts.vue";
@Component({
  components: { Charts }
})
export default class ChartsData extends Vue {
  @Provide() tabPosition: string = "line";

  // 初始化 echarts 图表数据
  @Provide() chartData: any = {
    xAxisData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    yAxisData: [820, 932, 901, 934, 1290, 1330, 1320]
  };
}
</script>

<style>
</style>
