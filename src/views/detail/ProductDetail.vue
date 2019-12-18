<template>
  <div class="product-detail">
    <!--导航栏-->
    <detail-nav-bar @titleItemClick="titleItemClick" ref="detailNavBar" />
    <scroll class="scroll-height" ref="scroll" :probe-type="3" @backTopScroll="detailScroll">
      <!--轮播图-->
      <detail-swiper :swiper-list="topImages" class="detail-set-scroll" @load.native="swiperLoad" />
      <!--商品、店铺信息-->
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shops" />
      <!--买家评论-->
      <detail-comment-info :comment-info="commentInfo" class="detail-set-scroll" />
      <!--参数信息-->
      <detail-param-info :param-info="paramsInfo" class="detail-set-scroll" />
      <!--图片展示-->
      <detail-images-info :images-info="detailsInfo" @imgLoad="imgLoad" />
      <!--推荐商品:混入vue文件 防抖处理refresh()方法-->
      <goods-list :goods="recommendList" :is-recommend="true" class="detail-set-scroll" />
    </scroll>

    <transition name="scroll">
      <back-top @click.native="backTop" v-show="isShow" />
    </transition>

    <detail-bottom-bar @addToCart="addToCart" />
  </div>
</template>

<script>
import DetailNavBar from "./children/DetailNavBar";
import Scroll from "@/components/common/scroll/Scroll";
import DetailSwiper from "./children/DetailSwiper";
import DetailBaseInfo from "./children/DetailBaseInfo";
import DetailShopInfo from "./children/DetailShopInfo";
import DetailImagesInfo from "./children/DetailImagesInfo";
import DetailParamInfo from "./children/DetailParamInfo";
import DetailCommentInfo from "./children/DetailCommentInfo";
import GoodsList from "@/components/content/goods/GoodList";
import BackTop from "@/components/content/backTop/BackTop";
import DetailBottomBar from "./children/DetailBottomBar";

import {
  getProductDetail,
  getRecommend,
  Goods,
  GoodsParams,
  Shop
} from "@/network/productDetail";
import { imgListenerMixin } from "@/common/mixin";

export default {
  name: "ProductDetail",
  components: {
    DetailNavBar,
    DetailSwiper,
    Scroll,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImagesInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    BackTop,
    DetailBottomBar
  },
  data() {
    return {
      detailId: "",
      topImages: [],
      goods: {},
      shops: {},
      detailsInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommendList: [],
      detailClassList: [],
      detailIndex: 0,
      isShow: false //backClick 显示
    };
  },
  mixins: [imgListenerMixin],
  beforeCreate() {
    //进入详情页隐藏tabbar
    this.$store.commit("setTabBarShow", false);
  },
  created() {
    //1,获取页面传来的id
    this.detailId = this.$route.params.id;

    //2,获取数据
    this._getProductDetail();
    this._getRecommend();
  },
  //路由离开时显示tabbar
  beforeRouteLeave(to, from, next) {
    this.$store.commit("setTabBarShow", true);
    next();
  },
  destroyed() {
    // 取消detail组件事件总线的监听
    this.$bus.$off("imgLoad", this.imgListener);
  },
  methods: {
    /**网络请求数据 */
    _getProductDetail() {
      getProductDetail(this.detailId).then(res => {
        const data = res.result;
        // 1,获取轮播图数据
        this.topImages = data.itemInfo.topImages;

        // 获取商品数据,调用封装的ES6的class
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );

        // 2,获取店铺数据
        this.shops = new Shop(data.shopInfo);

        // 3,获取下面的图片展示数据
        this.detailsInfo = data.detailInfo;

        // 4,获取尺寸数据
        this.paramsInfo = new GoodsParams(
          data.itemParams.info,
          data.itemParams.rule
        );

        // 5,获取评论数据
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
    },
    _getRecommend() {
      //推荐商品数据
      getRecommend().then(res => {
        this.recommendList = res.data.list;
      });
    },
    /**逻辑事件 */
    //图片加载完成
    imgLoad() {
      //有混入的代码发送图片加载事件
      //console.log("img加载完成");
      //1, 重新获取可滑动高度
      this.$refs.scroll.refresh();
      //2，图片加载完获取classList
      this.getClassList(); //这行不写滑动时不会切换标题栏
    },
    //轮播图载完成后：获取 滑动 list
    swiperLoad() {
      //2, 获取 classList
      this.getClassList();
    },
    //获取 classList
    getClassList() {
      // Array.from() 将伪数组转换成纯数组
      this.detailClassList = []; //初始化数组
      this.detailClassList = Array.from(
        document.getElementsByClassName("detail-set-scroll")
      ); //数组中的对象是class为detail-set-scroll的组件对象
      let maxValue = 1000000; //最大可滑动高度
      this.detailClassList.push({ offsetTop: maxValue });
      console.log(detailClassList);
    },
    //滚动监听
    detailScroll(position) {
      //1,判断是否显示 backClick
      this.isShow = -position.y > 600;

      //2,标题导航
      let detailPosition = position ? -position.y : 0;
      //console.log(detailPosition);
      for (let i = 0; i < this.detailClassList.length - 1; i++) {
        if (
          detailPosition >= this.detailClassList[i].offsetTop &&
          detailPosition < this.detailClassList[i + 1].offsetTop
        ) {
          if (this.detailIndex !== i) {
            this.detailIndex = i;
            this.$refs.detailNavBar.currentIndex = this.detailIndex;
          }
          break;
        }
      }
    },
    //标题栏点击事件
    titleItemClick(index) {
      // 根据数组下标滚动到对应的元素内容位置
      let setScroll = Array.from(
        document.getElementsByClassName("detail-set-scroll")
      );
      let el = setScroll[index];
      this.$refs.scroll.scrollToElement(el, 300);
    },
    //跳转顶部
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    //添加到购物车
    addToCart() {
      //1,获取需要展示到购物车的商品信息
      const obj = {
        image: this.topImages[0],
        titile: this.goods.titile,
        desc: this.goods.desc,
        price: this.goods.lowNowPrice,
        id: this.detailId
      };

      //2,将商品数据保存到购物车
      this.$store.dispatch("setCateGoryData", obj); //发送到actions
    }
  }
};
</script>

<style scoped>
.product-detail {
  width: 100%;
  height: 100%;
}

/* BScroll固定高度和区域 */
.scroll-height {
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  background-color: #ffffff;
}

/* vue的淡入淡出动画 */
.scroll-enter-active,
.scroll-leave-active {
  transition: all 0.3s;
}

.scroll-enter,
.scroll-leave-to {
  opacity: 0;
}

.scroll-enter-to,
.scroll-leave {
  opacity: 1;
}
</style>