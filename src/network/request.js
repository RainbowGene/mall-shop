import Vue from 'vue'
import axios from 'axios'   //网络请求
import qs from 'qs'  //url 中参数处理的插件
import { Toast } from 'vant'

Vue.use(Toast)
Vue.prototype.$axios = axios
Vue.prototype.$qs = qs

const url = "http://106.54.54.237:8000/api/v1";
const url2 = "http://123.207.32.32:8000/api/vip";

// 导出封装好的axios
export function request(config) {
  //1,创建axios实例
  const instance = axios.create({
    baseURL: url || url2,
    timeout: 10000    //请求持续时间
  });

  //2,axios 请求拦截器:请求前的处理
  instance.interceptors.request.use(
    req => {
      Toast.loading({
        // loading 的时候禁止点击
        forbidClick: true,
        message: '加载中...'
      });
      return req;
    },
    err => {
      return Promise.reject(err);
    }
  )

  //3,axios 的响应拦截器：数据响应前的处理
  instance.interceptors.response.use(
    res => {
      //保证200ms的数据加载时间
      setTimeout(() => {
        Toast.clear();
      }, 200);
      return res.data;
    },
    err => {
      return Promise.reject(err);
    }
  )

  return instance(config);
}
