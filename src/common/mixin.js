import { debounce } from "./utils";

//混入的代码块，可以解决组件在多个地方使用时频繁调用问题

export const imgListenerMixin = {
  data() {
    return {
      // 监听图片
      imgListener: null
    };
  },
  mounted() {
    // 给防抖函数赋值一个新的函数
    const refresh = debounce(this.$refs.scroll.refresh, 50);

    // 接收发射的事件总线,并用监听图片变量保存
    this.imgListener = () => {
      refresh();
    };
    this.$bus.$on("imgLoad", this.imgListener); //启动监听
  }
};
