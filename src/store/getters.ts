import { GetterTree } from 'vuex';

const getters: GetterTree<any, any> = {
  // 获取 state中的用户信息 
  user(state: any): any {
    return state.user;
  },
  // 获取 state 中的 路由映射表
  routers(state: any): any {
    return state.routers;
  }
};

export default getters;
