<template>
  <el-container class="layout-content">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <slot name="left"></slot>
    </el-aside>

    <!-- 右侧页面 -->
    <el-main>
      <!-- 面包屑 -->
      <div class="top">
        <i class="fa fa-reorder"></i>
        <!-- separator 分割符  -->
        <el-breadcrumb class="breadcrumb" separator="/">
          <!-- ele   to 可以进行路由跳转 -->
          <el-breadcrumb-item
            v-for="(item,index) in breadCrumbItems"
            :key="index"
            :to="{path:item.path}"
          >{{item.title}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 右下：页面主体内容 -->
      <div class="content">
        <slot name="content"></slot>
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
// Provide 初始化数据    Watch 监听数据
import { Component, Vue, Provide, Watch } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Content extends Vue {
  @Provide() breadCrumbItems: any; // 初始化 面包屑的数据 数组

  //  监听route 路由，然后将最新的路由传入  初始化面包屑方法
  @Watch("$route") handleRouteChange(to: any) {
    // console.log("to", to); //  to 就是点击当前最新的路由
    this.initBreadCrumbItems(to);
  }

  created() {
    // 执行面包屑方法 将this.$route 传入
    this.initBreadCrumbItems(this.$route);
    // console.log(this.$route); // 当前路由
  }

  // 初始化面包屑方法
  initBreadCrumbItems(router: any) {
    // console.log(router);

    // 面包屑的根路由title   是一个数组  0：根路由
    let breadCrumbItems: any = [{ path: "/", title: "后台管理系统" }];

    // 遍历父级到当前子路由的页面的title和path 存储到数组里
    // 遍历 router.matched 这个数组 存储的是 当前点击有路由以及上级路由
    for (const index in router.matched) {
      if (router.matched[index].meta && router.matched[index].meta.title) {
        breadCrumbItems.push({
          path: router.matched[index].path ? router.matched[index].path : "/",
          title: router.matched[index].meta.title
        });
      }
    }
    // 将创建 的breadCrumbItems 数组  赋值给 初始化 面包屑的数据 数组
    this.breadCrumbItems = breadCrumbItems;
    // console.log(this.breadCrumbItems);
  }
}
</script>

<style lang="scss" scoped>
.layout-content {
  width: 100%;
  height: 100%;
  .el-main {
    padding: 0;
    .top {
      background: #fff;
      height: 54px;
      border-right: none;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      i {
        font-size: 20px;
        cursor: pointer;
        padding-left: 16px;
      }
      .breadcrumb {
        padding-left: 16px;
      }
    }
    .content {
      padding: 10px;
      height: calc(100% - 54px);
      box-sizing: border-box;
    }
  }
}
</style>