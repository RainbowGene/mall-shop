export default {
  setCateGoryData({ state, commit }, data) {
    let list = JSON.parse(localStorage.getItem("cartList")) || [];  //获取缓存中的购物车数据

    if (list) {
      state.cartList = list;  //更新购物车数据
      //find()返回第一个满足条件的元素
      let result = state.cartList.find(item => {
        return item.id === data.id;
      })

      if (result) { //已存在则数量+1
        commit("addCounter", result);
      } else {  //不存在新加入购物车
        commit("addToCart", data);
      }
    }
    else {
      commit("addCart", data)
    }
  }
}