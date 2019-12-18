import { Toast } from "vant"
import { stringify } from "qs";

export default {
  //设置tabbar的显示和隐藏
  setTabBarShow(state, bol) {
    state.tabBarShow = bol;
  },
  //已有商品数量+1
  addCounter(state, result) {
    result++;
    Toast({
      type: 'success',
      message: `当前商品数量为${result.count}`,
      forbidClick: true, //弹框时禁止点击
      duration: 1500  //延迟时间？
    });
    //添加(更新)到本地存储
    localStorage.setItem("cartList", JSON, stringify(state.cartList))
  },
  //往购物车加入新商品
  addToCart(state, data) {
    data.count = 1;
    data.checked = false,
      state.cartList.push(data),
      Toast({
        type: 'success',
        message: '添加商品成功',
        forbidClick: true,
        duration: 1500
      });
    localStorage.setItem("cartList", JSON.stringify(state.cartList));
  },
  //清除商品
  clearCartList(state) {
    // 过滤器返回哪些商品被选中
    let result = state.cartList.filter(item => item.checked !== true);  //未被选中的项
    if (result.length === 0) {  //全部被选中,删除所有商品
      localStorage.removeItem("cartList");  //清除本地记录
      state.cartList = [];  //清除状态管理中的购物车
    }
    else { //删除选中的部分商品
      state.cartList = result;  //更新本地
      localStorage.setItem("cartList", JSON.stringify(state.cartList));
    }
  },
  //初始化时：给购物车赋值本地存储
  setCartList(state, data) {
    state.cartList = data;
  }
}