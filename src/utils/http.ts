
//  对 axios 进行封装  
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
// 引入的  AxiosResponse响应      AxiosRequestConfig请求
import { Message } from 'element-ui';  //  引入 ele中的 message组件
import router from '@/router';

/**
 * http请求工具类
 *
 * 请求拦截器 负责将客户端标识token值存储并放置在头部提交给服务端
 *
 * 响应拦截器 负责全局处理业务请求的网络或者业务错误
 */

// 创建axios的实例
const service = axios.create({
  timeout: 10000 // 超时时间
});

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 判断 本地存储中是否有token,
    if (localStorage.tsToken) {
      // 将token设置请求头
      config.headers.Authorization = localStorage.tsToken;
    }
    return config;
  },
  (err: any) => {
    Promise.reject(err);
  }
);

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  // 如果有错误 
  (err: any) => {
    let errMsg = '';
    if (err && err.response.status) {
      switch (err.response.status) {
        case 401:
          errMsg = '登录状态失效，请重新登录';
          // 401的时候  token 过期了  将token移出本地存储，并跳转到登录
          localStorage.removeItem('tsToken');
          router.push('/login');
          break;
        case 403:
          errMsg = '拒绝访问';
          break;

        case 408:
          errMsg = '请求超时';
          break;

        case 500:
          errMsg = '服务器内部错误';
          break;

        case 501:
          errMsg = '服务未实现';
          break;

        case 502:
          errMsg = '网关错误';
          break;

        case 503:
          errMsg = '服务不可用';
          break;

        case 504:
          errMsg = '网关超时';
          break;

        case 505:
          errMsg = 'HTTP版本不受支持';
          break;

        default:
          errMsg = err.response.data.msg;
          break;
      }
    } else {
      errMsg = err;
    }


    // 调用ele的 message组件 传入 错误信息 
    Message.error(errMsg);
    return Promise.reject(errMsg);
  }
);

export default service;
