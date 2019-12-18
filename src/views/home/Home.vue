<template>
  <div class="home">
    <!-- 标题栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      :titles="tabControlTitles"
      @tabClick="tabClick"
      class="home-tab-control"
      ref="tabControl"
      v-show="isShow"
    />
    <!--scroll 包裹可滚动区域-->
    <scroll
      :probe-type="3"
      :pull-up-load="true"
      @backTopScroll="backTopScroll"
      @pullingUp="loadMore"
      class="scroll-height"
      ref="scroll"
    >
      <!--轮播图-->
      <swiper :swiper-list="banners" @swiperLoad="swiperLoad"></swiper>
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        :titles="tabControlTitles"
        @tabClick="tabClick"
        class="home-tab-control"
        ref="tabControl2"
        v-show="!isShow"
      />
      <!--商品展示-->
      <good-list :goods="goods[curType].list" />
    </scroll>
    <!--使用 transition 可以在css中设置 进入/离开 的动画效果-->
    <transition name="scroll">
      <!--使用native修饰符才能监听组件的原生事件-->
      <back-top @click.native="backTop" v-show="isShow" />
    </transition>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import TabControl from "@/components/content/tabControl/TabControl";
import Scroll from "@/components/common/scroll/Scroll";
import Swiper from "@/components/common/swiper/MySwiper";
import FeatureView from "./children/FeatureView";
import RecommendView from "./children/RecommendView";
import GoodList from "@/components/content/goods/GoodList";
import BackTop from "@/components/content/backTop/BackTop";

import { getHomeGoodsData, getHomeMultiData } from "@/network/home";
//导入vue混入代码
import { imgListenerMixin } from "../../common/mixin";

export default {
  name: "Home",
  components: {
    NavBar,
    TabControl,
    Scroll,
    Swiper,
    FeatureView,
    RecommendView,
    GoodList,
    BackTop
  },
  data() {
    return {
      tabControlTitles: ["流行", "新款", "精选"],
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      curType: "pop", //默认选中 "流行"
      // 当前吸顶的位置
      tabOffsetTop: 0,
      isShow: false
    };
  },
  created() {
    this.getHomeMultiData();
    this.getHomeGoodsData("pop");
    this.getHomeGoodsData("new");
    this.getHomeGoodsData("sell");
  },
  // keep-alive 进来时的生命周期
  activated() {
    // 同时刷新 scroll 防止不能滚动
    this.$refs.scroll.refresh();
  },
  // keep-alive 离开时的生命周期
  deactivated() {
    // 取消home组件事件总线的监听
    // 不这样处理的话依然不能回到我们上次浏览到的地方
    this.$bus.$off("imgLoad", this.imgListener);  
  },
  mixins: [imgListenerMixin], //混入代码对refresh()事件进行防抖处理,对对象要用[]
  methods: {
    /*网络请求事件 */
    //请求多个数据
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    //请求商品数据
    getHomeGoodsData(type) {
      const page = this.goods[type].page + 1;
      getHomeGoodsData(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        //再次激活上拉加载事件
        this.$refs.scroll.finishPullUp();
      });
    },
    /*一般事件 */
    //tabcontrol点击事件
    tabClick(index) {
      switch (index) {
        case 0:
          this.curType = "pop";
          break;
        case 1:
          this.curType = "new";
          break;
        case 2:
          this.curType = "sell";
          break;
      }

      //同步两个 tabControl
      this.$refs.tabControl.curIndex = index;
      this.$refs.tabControl2.curIndex = index;
    },
    //获取滚动的位置
    backTopScroll(position) {
      //判断tabcontrol和backTop的显示与否
      this.isShow = -position.y > this.tabOffsetTop;
    },
    //上拉加载更多
    loadMore() {
      this.getHomeGoodsData(this.curType);
    },
    //监听轮播图加载完成
    swiperLoad() {
      //console.log("轮播图已加载！");
      //获取tabControl的位置,这个也可以在 mounted 周期函数中获取
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    //返回顶部按钮
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    }
  }
};
</script>

<style scoped>
.home {
  position: relative;
  height: 100%;
}

.home .home-nav {
  background-color: var(--color-tint);
  color: white;
}

/* 导航吸顶 */
.home-tab-control {
  position: relative;
  background-color: white;
  z-index: 3;
}

/* BScroll固定高度和区域 */
.scroll-height {
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
  overflow: hidden;
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