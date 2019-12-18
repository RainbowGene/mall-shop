<template>
  <div class="categroy">
    <nav-bar class="category-nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <slide-bar :slide-bar-list="categoryList" @slideBarItemClick="slideBarItemClick" />
    <scroll class="scroll-height">
      <subcategory :category-list="subcategoryList" />
      <tab-control :titles="titleList" @tabClick="tabClick" />
      <good-list :goods="categoryDetailList" />
    </scroll>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import SlideBar from "./children/SlideBar";
import Scroll from "@/components/common/scroll/Scroll";
import Subcategory from "./children/Subcategory";
import TabControl from "@/components/content/tabControl/TabControl";
import GoodList from "@/components/content/goods/GoodList";

import {
  getCategory,
  getCategoryDetail,
  getSubcategory
} from "@/network/category";

export default {
  name: "Categroy",
  components: {
    NavBar,
    SlideBar,
    Scroll,
    Subcategory,
    TabControl,
    GoodList
  },
  data() {
    return {
      categoryList: [], //侧边栏数据
      subcategoryList: [], //右侧类别栏
      categoryDetailList: [], //右下商品数据
      titleList: ["流行", "新款", "精选"],
      curMiniWallkey: "10062603", //默认的MiniWallkey值
      keyList: [], //用于保存 miniWallkey
      keyList2: [], //用于保存 maitKey
      dataList: [],
      curIndex: 0, //默认选中 “流行”
      curType: "pop", // 流行 key
      dataList2: [],
      list: []
    };
  },
  created() {
    //初始化数据
    this._getCategory();
  },
  methods: {
    /**网络请求相关 */
    //获取侧边栏数据、初始化商品数据
    _getCategory() {
      getCategory().then(res => {
        //console.log(res.data.category.list);
        this.categoryList = res.data.category.list;
        if (this.categoryList.length > 0) {
          this._getSubcategory(this.categoryList[0].maitKey, 0); //默认选中侧边栏第一项
          //加载默认第一项的所有详情商品
          this._getCategoryDetail(this.categoryList[0].miniWallkey, "pop", 0);
          this._getCategoryDetail(this.categoryList[0].miniWallkey, "new", 0);
          this._getCategoryDetail(this.categoryList[0].miniWallkey, "sell", 0);
          this.keyList.push(this.categoryList[0].miniWallkey); //证明这批信息已被加载过
          this.keyList2.push(this.categoryList[0].maitKey);
        }
      });
    },
    //获取侧边栏选中项的商品种类信息
    _getSubcategory(key, index) {
      getSubcategory(key).then(res => {
        //console.log(res.data.list);
        this.dataList[index] = res.data.list;
        if (this.dataList.length > 1) {
          //大于一条数据
          this.subcategoryList = this.dataList[index];
        } else {
          this.subcategoryList = this.dataList[0]; //否则只显示第一条
        }
      });
    },
    //获取详细商品数据
    _getCategoryDetail(key, type, index) {
      //console.log(key, type, index);
      this.list = [];
      getCategoryDetail(key, type).then(res => {
        console.log(res);
        this.list.push(res);
        this.dataList2[index] = this.list;
        if (this.dataList2.length > 1) {
          this.categoryDetailList = this.dataList2[index][index];
        } else {
          this.categoryDetailList = this.dataList2[0][0];
        }
      });
    },
    /**页面逻辑事件 */
    //侧边类别栏点击
    slideBarItemClick({ maitKey, miniWallkey, index }) {
      //console.log(maitKey, miniWallkey);
      this.curMiniWallkey = miniWallkey;
      this.curIndex = index;
      if (
        //判断信息是否被加载过
        this.keyList.includes(miniWallkey) &&
        this.keyList2.includes(maitKey)
      ) {
        //加载过直接绑定
        this.subcategoryList = this.dataList[index];
        this.categoryDetailList = this.dataList2[index][0];
      } else {
        //未加载再去请求相应数据
        this.keyList[index] = miniWallkey;
        this.keyList2[index] = maitKey;
        this._getCategoryDetail(miniWallkey, "pop", index);
        this._getCategoryDetail(miniWallkey, "new", index);
        this._getCategoryDetail(miniWallkey, "sell", index);
        this._getSubcategory(maitKey, index);
      }
    },
    //tabControl 点击刷新商品
    tabClick(index) {
      this.categoryDetailList = this.dataList2[this.curIndex][index];
    }
  }
};
</script>

<style scoped>
.category-nav-bar {
  background-color: var(--color-tint);
  color: white;
  font-weight: 600;
}

.scroll-height {
  position: fixed;
  left: 100px;
  right: 0;
  top: 44px;
  bottom: 49px;
  overflow: hidden;
}
</style>