import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用箭头函数import引入,可以实现路由懒加载
const Home = () => import("../views/home/Home")

Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
