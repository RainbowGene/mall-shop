<template>
  <div class="cart-list">
    <!--滑动不需要监听-->
    <scroll class="scroll-height" ref="scroll">
      <div :key="index" class="shop-item" v-for="(item, index) in cartList">
        <div class="item-selector">
          <van-checkbox @change="itemChange" v-model="item.checked" />
        </div>
        <div class="item-img">
          <img :src="item.image" alt="商品图片" />
        </div>
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-desc">商品描述: {{ item.desc }}</div>
          <div class="info-bottom">
            <div class="item-price left">¥{{ item.price }}</div>
            <div class="item-count right">x{{ item.count }}</div>
          </div>
        </div>
      </div>
    </scroll>
    <!-- 底部订单栏 -->
    <van-submit-bar
      class="ccart"
      :button-text="`提交订单(${checkedLength})`"
      :price="totalPrice * 100"
      @submit="onSubmit"
    >
      <van-checkbox @click="checkedAllClick" class="checked-all" v-model="checkedAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll";
import { mapGetters, mapMutations } from "vuex";

//mapGetters, mapMutations 为辅助函数
// 1)
// 2)mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性

export default {
  name: "CartList",
  components: { Scroll },
  data() {
    return {
      checkedAll: false //全选
    };
  },
  computed: {
    //使用对象展开运算符将 getter 混入到 计算属性 中
    ...mapGetters(["cartList", "cartListLength"]),
    //购物车总价
    totalPrice() {
      return this.cartList
        .filter(item => {
          return item.checked === true; //找出被选中的项
        })
        .reduce((prev, item) => {
          return prev + item.price * item.count; //遍历计算出总价格
        }, 0); //prev 初始值为0
    },
    //选中的商品数
    checkedLength() {
      return this.cartList.filter(item => item.checked === true).length;
    }
  },
  created() {
    //获取本地存储的购物车数据
    let list = JSON.parse(localStorage.getItem("cartList")) || [];
    if (list) {
      this.setCartList(list);
    }

    console.log(this.totalPrice);
  },
  mounted() {
    //刷新高度
    this.$refs.scroll.refresh();
  },
  methods: {
    //1，mapMutations辅助函数将组件中的 methods 映射为 store.commit 调用(需要在根节点注入 store)
    ...mapMutations([
      "clearCartList", //将 this.clearCartList 映射为 this.$store.commit("clearCartList") 清除购物车
      "setCartList" //将 this.setCartList(data) 映射为 this.$store.commit("setCartList",data) 添加商品到本地数据
    ]),
    /**页面逻辑事件 */
    //全选
    checkedAllClick() {
      this.cartList.forEach(item => (item.checked = !this.checkedAll));
    },
    //按钮选中事件
    itemChange() {
      //1,找出选中的项
      let result = this.cartList.filter(item => item.checked === true);
      //2,对选中的项
      this.checkedAll =
        result.length > 0 && result.length === this.cartList.length;
    },
    //提交订单
    onSubmit() {
      if (this.checkedLength === 0) {
        this.$toast({
          type: "fail",
          message: "您还没有选中商品哦",
          forbidClick: true, //延迟时间内禁用按钮
          duration: 1500 //延迟时间
        });
      } else {
        this.$dialog
          .confirm({
            title: "温馨提示",
            message: "您确定要提交订单吗？"
          })
          .then(() => {
            this.$toast({
              type: "success",
              message: `提交 ${this.checkedLength} 条数据成功`,
              forbidClick: true,
              duration: 1500
            });
            //提交完成清除对应购物车数据
            setTimeout(() => {
              this.clearCartList();
              this.checkedAll = false;
            }, 1500);
          })
          .catch(err => {
            return false;
          });
      }
    }
  }
};
</script>

<style scoped>
.cart-list {
  width: 100%;
  height: 100%;
}

/**为底部导航栏留出位置 */
.ccart {
  bottom: 49px;
}

.scroll-height {
  position: absolute;
  top: 44px;
  bottom: 99px;
  right: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  background-color: #ffffff;
}

.shop-item {
  width: 100%;
  display: flex;
  font-size: 0;
  padding: 5px;
  border-bottom: 1px solid #cccccc;
}

.shop-item:last-child {
  border-bottom: 0;
}

.item-selector {
  width: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.item-title,
.item-desc {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item-img {
  padding: 5px;
}

.item-img img {
  width: 80px;
  height: 100px;
  display: block;
  border-radius: 5px;
}

.item-info {
  font-size: 17px;
  color: #333333;
  padding: 5px 10px;
  position: relative;
  overflow: hidden;
  width: 88%;
}

.item-info .item-desc {
  font-size: 14px;
  color: #666666;
  margin-top: 15px;
}

.info-bottom {
  margin-top: 10px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
}

.info-bottom .item-price {
  color: orangered;
}

.checked-all {
  margin-left: 10px;
}
</style>