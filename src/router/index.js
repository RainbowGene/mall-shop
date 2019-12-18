import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用箭头函数import引入,可以实现路由懒加载
const Home = () => import("../views/home/Home")
const Category = () => import("../views/category/Category")
const Cart = () => import("../views/cart/Cart")
const Profile = () => import("../views/profile/Profile")
const ProductDetail = () => import("../views/detail/ProductDetail")
const Register = () => import("../views/register/Register")
const Login = () => import("../views/login/Login")


Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/category", component: Category },
  { path: "/cart", component: Cart },
  { path: "/profile", component: Profile },
  { path: "/detail/:id", component: ProductDetail },
  { path: "/register", component: Register },
  { path: "/login", component: Login }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
