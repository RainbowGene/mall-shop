export default {
  tabBarShow: state => state.tabBarShow,
  cartList: state => state.cartList,
  //将getters传给自己,getters默认在第二个参数
  cartListLength: (state, getters) => getters.cartList.length
}

//都是 箭头函数的写法