<template>
  <div class="login">
    <LoginHeader>
      <!-- 以下内容就是slot  组件中的插槽中的内容  注el-form表单中的slot 要与 组件的slot name相同
      el-form 表单 需要设置的行内属性
        表单验证必写  :rules="rules"    
          1. 在el-form-item 标签 行内也要添加 prop="username"
      -->
      <el-form
        slot="container"
        :rules="rules"
        :model="ruleForm"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
      >
        <div class="title">
          <h3>账号密码登录</h3>
        </div>

        <!-- username -->
        <el-form-item prop="username">
          <el-input type="text" v-model="ruleForm.username" auto-complete="off" placeholder="账号">
            <!-- 使用 slot 将icon 插入到input框中   prefix 代表插入 输入框头部  -->
            <i slot="prefix" class="fa fa-user-o"></i>
          </el-input>
        </el-form-item>

        <!-- password -->
        <el-form-item prop="pwd">
          <el-input type="password" v-model="ruleForm.pwd" auto-complete="off" placeholder="密码">
            <i slot="prefix" class="fa fa-lock"></i>
          </el-input>
        </el-form-item>

        <!-- 登录button   @click.native.prevent  取消默认事件  -->
        <el-form-item>
          <el-button
            :loading="isLogin"
            @click.native.prevent="handleSubmit"
            type="primary"
            style="width:100%;"
          >登录</el-button>
        </el-form-item>

        <!-- 7天登录和忘记密码 -->
        <el-form-item>
          <el-checkbox v-model="ruleForm.autoLogin" :checked="ruleForm.autoLogin">7天内自动登录</el-checkbox>
          <el-button @click="$router.push('/password')" type="text" class="forget">忘记密码？</el-button>
        </el-form-item>
      </el-form>
    </LoginHeader>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
// TS 中引入 vuex 的方式  使用 vuex-class 模块
import { State, Getter, Mutation, Action } from "vuex-class";
import LoginHeader from "./LoginHeader.vue";

@Component({
  components: { LoginHeader }
})
export default class Login extends Vue {
  // 存储用户信息   是将 用户信息存储到 vuex中，调用的是action中的方法 并设置类型
  @Action("setUser") setUser: any;

  // 使用装饰器 初始化 isLogin标记  相当于在 data中初始化
  @Provide() isLogin: boolean = false;

  // 使用装饰器  来设置 表单元素的 初始化数据，及定义数据类型  ruleForm  是表单的 :model
  @Provide() ruleForm: {
    username: String;
    pwd: String;
    autoLogin: boolean;
  } = {
    username: "",
    pwd: "",
    autoLogin: true // 是否自动登录
  };
  /**
   *  相当于  
   * data(){
   *   return {
   *     users:{
   *        username: "",
            pwd: "",
            autoLogin: true
   *      }
   *   }
   * } 
   */

  // 使用装饰器 进行表单验证  通过 rules 属性传入约定的验证规则
  @Provide() rules = {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
  };

  // 登录方法
  handleSubmit(): void {
    // (this.$refs["ruleForm"] as any) 是TS给获取的元素定义类型
    // 使用 ref获取的元素 调用 .validate方法 （此方法 ele的）
    (this.$refs["ruleForm"] as any).validate((valid: boolean) => {
      if (valid) {
        // console.log("校验通过");
        this.isLogin = true;

        // (this as any)  TS 的语法   相当于 this.$axios  是校验this的类型
        (this as any).$axios
          .post("/api/users/login", this.ruleForm)
          .then((res: any) => {
            this.isLogin = false;
            // console.log(res.data);

            // 1. 从后台返回的数据中获取token 然后存储token到本地
            localStorage.setItem("tsToken", res.data.token);
            // 2. 再存储到vuex中  setUser是action中的方法
            this.setUser(res.data.token);

            // 登录成功 跳转 /
            this.$router.push("/");
          })
          .catch(() => {
            this.isLogin = false;
          });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

i {
  font-size: 14px;
  margin-left: 8px;
}
.forget {
  float: right;
}
</style>

