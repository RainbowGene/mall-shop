<template>
  <div class="scroll-wrapper" ref="wrapper">
    <div class="scroll-content">
      <slot />
    </div>
  </div>
</template>

<script>
import BScorll from "better-scroll";

export default {
  name: "Scroll",
  data() {
    return {
      scroll: null
    };
  },
  props: {
    probeType: {
      // 0和1不监听滚动事件,2监听但是不监听手指松开后的滑动距离,3全部监听
      type: Number,
      default() {
        return 0;
      }
    },
    pullUpLoad: {
      // 是否开启监听滚动到底部事件:用于底部加载更多
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  mounted() {
    this.scroll = new BScorll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    });

    //监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", position => {
        this.$emit("backTopScroll", position);
      });
    }

    //监听滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        // console.log("滚动到底部了");
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    //坐标跳转（1，x轴  2，y轴  3，完成时间）
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    //重新计算可滑动高度
    refresh() {
      this.scroll && this.scroll.refresh();
      //console.log('计算完成！')
    },
    //再次激活上拉加载按钮
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    // 获取滚动的纵向距离
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
    // 滚动到指定元素
    scrollToElement(el, time) {
      this.scroll.scrollToElement(el, time);
    }
  }
};
</script>

<style scoped>
</style>