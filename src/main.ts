import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';

// 引入 ele UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


// 要主入口文件中，需要 引入封装好的 axios 
import axios from './utils/http';

Vue.use(ElementUI);

Vue.config.productionTip = false;

// 将axios 挂载到vue原型上
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
