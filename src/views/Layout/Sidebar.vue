<template>
  <!-- el-scrollbar  可滚动的菜单 -->
  <el-scrollbar class="el-scrollbar">
    <!-- router 注  el-menu菜单  要添加 router 可实现点击哪个路由就显示哪个路由 -->
    <!-- :default-active="$router.currentRoute.path"   当前激活菜单 等于 当前选中的路由  -->
    <el-menu class="el-menu-slide" :default-active="$router.currentRoute.path" router>
      <!-- 一级菜单容器   （因为v-for 和 v-if 一起使用所以会报红）-->
      <!-- v-if  是否渲染菜单的条件  -->
      <template
        v-for="item in getRouters"
        v-if="item.hidden&&item.children&&item.children.length>0"
      >
        <!-- 菜单的每一项  -->
        <!--  index 是 菜单的唯一标识   必须加key 不然会报红  -->
        <el-menu-item
          v-if="item.children.length==1"
          :index="item.children[0].path"
          :key="item.name"
        >
          <!-- 菜单 icon -->
          <i v-if="item.children[0].meta.icon" :class="item.children[0].meta.icon"></i>
          <!--  菜单 名称  span slot="title"  代表占位 -->
          <span slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>

        <!-- 多个子元素 -->
        <el-submenu v-else :index="item.children[0].path" :key="item.name">
          <!-- 多级菜单的标题 -->
          <template slot="title">
            <i v-if="item.meta.icon" :class="item.meta.icon"></i>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>
          <!-- 多级菜单的子级 -->
          <el-menu-item v-for="child in item.children" :index="child.path" :key="child.name">
            <i v-if="child.meta.icon" :class="child.meta.icon"></i>
            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
@Component({
  components: {}
})
export default class Sidebar extends Vue {
  @Getter("routers") getRouters: any;

  created() {
    // console.log(this.getRouters);
  }
}
</script>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
  border-right: 1px solid #e6e6e6;
  background: #fff;
  .el-menu-slide {
    border-right: none;
    i {
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }
  }
}
</style>
