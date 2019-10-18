// 动态路由    引入路由  从路由中获取路由映射表
// import { asyncRouterMap } from '../router'

const state: any = {
  user: null,  // 用户信息
  // routers: asyncRouterMap     因为要设置用户权限 所以不可以引入所有的路由映射表
  routers: []
};

export default state;
