import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'   //同步操作放入mutations
import getters from './getters'      //类似于计算属性
import actions from './actions'   //异步操作或复杂操作放入actions

Vue.use(Vuex)

const state = {
  tabBarShow: true,  //底部菜单显示
  cartList: [],  //购物车数据
}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions
})
