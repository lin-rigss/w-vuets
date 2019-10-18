import { MutationTree } from 'vuex';
// TS  MutationTree  -  mutaions类型

const mutations: MutationTree<any> = {
  // 设置 state中的 用户信息
  SET_USER(state: any, user: any): void {
    state.user = user;
  },
  // 设置 state中的 路由映射表
  SET_ROUTERS(state: any, routers: any): void {
    state.routers = routers;
  }
};

export default mutations;
