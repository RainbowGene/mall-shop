import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入 axios 网络请求的封装文件
import "./network/request";
//引入 vant 组件
import Vant from 'vant';
import "vant/lib/index.css";
require("./assets/js/flexible")

//引入路由懒加载
import VueLazyLoad from 'vue-lazyload'

//挂载
Vue.use(VueLazyLoad, {
  //未加载的占位图片
  loading: require("@/assets/img/common/placeholder.png")
})
Vue.use(Vant);

//全局实例化事件总线
Vue.prototype.$bus = new Vue();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
