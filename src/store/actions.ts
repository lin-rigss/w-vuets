import { ActionTree } from 'vuex';
import jwt_decode from 'jwt-decode';
// 在action 中引入路由映射表
import { asyncRouterMap } from '../router';


const actions: ActionTree<any, any> = {
  // 异步的  设置用户信息  user是接收过来的token 
  async setUser({ state, commit }, user: any) {
    // 解析 token 
    const decoded: any = jwt_decode(user);
    // 触发 mutations 
    commit('SET_USER', decoded);
    const { key } = decoded;
    // 返回当前用户拥有权限的路由
    let accessedRouters = filterAsyncRouter(asyncRouterMap, key);
    // 将最新的权限路由 触发mutations  更新至 state 
    commit('SET_ROUTERS', accessedRouters);
  }
};

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap 所有路由表
 * @param roles 当前角色
 */

function filterAsyncRouter(asyncRouterMap: Array<any>, roles: string) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // console.log(route);
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });

  return accessedRouters;
}

/**
 * 判断是否有权限
 * @param roles 当前角色
 * @param route 当前路由对象
 * */
function hasPermission(roles: string, route: any) {
  if (route.meta && route.meta.roles) {
    // 如果meta.roles是否包含角色的key值,如果包含那么就是有权限,否则无权限
    return route.meta.roles.some((role: string) => role.indexOf(roles) >= 0);
  } else {
    // 默认不设置有权限
    return true;
  }
}

export default actions;
