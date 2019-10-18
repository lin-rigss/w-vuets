<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State, Getter, Mutation, Action } from "vuex-class";
@Component({
  components: {}
})
export default class App extends Vue {
  // 根组件中  就调用 action中的方法 ，来获取本地的token  存储用户信息
  @Action("setUser") setUser: any;
  created() {
    // 将本地存储中的token 传递给action方法
    this.setUser(localStorage.tsToken);
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
