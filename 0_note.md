 # 一，项目目录划分
  1，文件创建
    src/common : 公共常量或者一些工具类
    src/network : 网络请求
    src/components/common : 公共组件
    src/components/content : 和业务有关系的组件内容
    src/router : 路由
    src/store : 状态管理
    src/views : 视图
    src/assets/css : css样式文件
    src/assets/img : 图片文件 
  
  2，引入初始化css文件：
    normalize.css : github 上的一个初始化样式文件
    base.css ： 我们自己定义的基本样式文件

  3，vue-config 和 editorconfig
    3.1 配置别名（vue-cli3）：
      1） 创建 vue.config.js 文件
    3.2 配置编辑器配置
      1） 创建 .editorconfig

  4，小图标修改
    index.html中 <%= BASE_URL %> ： 当前文件所在路径

  5, vant 组件
    npm i vant --save
      import Vue from 'vue';
      import Vant from 'vant';
      import 'vant/lib/index.css';

      Vue.use(Vant);
    这种方式会导入所有组件增加了代码包的体积

  6, public/js : flexible.js :
    flexible.js能根据<html>的font-size计算出元素的盒模型大小。这样就意味着我们只需要在根元素确定一个px字号，因此来算出各元素的宽高，从而实现屏幕的适配效果。

  7,axios 插件 ： npm i axios --save

  8, qs 插件 ： npm i qs --save  :qs 是一个增加了一些安全性的查询字符串解析和序列化字符串的库。
    qs.parse()是将URL解析成对象的形式
    qs.stringify()是将对象 序列化成URL的形式，以&进行拼接

 # 二，首页开发
  1，首页导航栏的封装和使用
    导航栏基本样式为 左中右（例：返回  标题  更多） 三个插槽
    在common写插槽组件，再home组件中调用，细节样式建议写在视图组件home中

  2，请求首页的多个数据
    npm install axios --save
    2.0 
      1）设计数据结构，用于保存数据
        goods:{
          pop:{page:1,list:[]},
          new:{page:1,list:[]},
          sell:{page:1,list:[]}
        }

      2) 发送数据请求
        在home.js 中封装所有 Home 组件需要的网络请求
          例： getHomeGoods(type,page)
          在home.vue中： methods : getHomeGoods(type)

    2.1 轮播图

 # 三，Batter-Scroll 的安装和使用
  1，作用：使滚动更加顺滑流利（移动端）
  2，安装：npm install better-scroll --save

  3，基本使用解析
    3.1 : 使用原生js： 内容在容器中滚动：
      css：
        .wrapper {
          height: 150px;
          background-color: red;

          overflow: hidden;
          overflow-y: scroll;
        }
      html:
        <div class="wrapper" ref="wp">
          <ul class="content">
            <li>分类列表1</li> * 100
          </ul>
        </div>
      缺陷:在移动端中卡顿，体验差
    
    3.2 : 使用 better-scroll
      html 同上：
        <div class="wrapper" ref="wp">
          <ul class="content">
            <li>分类列表1</li> * 100
          </ul>
        </div>
      css:
        .wrapper{
          height: 150px;  //需要固定高度
          overflow: hidden;
        }
      js:
        import BScroll from "better-scroll"; //导入
        mounted() { //组件渲染完成
            this.scorll = new BScroll(document.querySelector(".wrapper"), {
              //属性设置
            });
        }

      * 内容必须包装一个标签（div等），bs 实例对象中要传入这个标签作为它的作用范围
      * 实例对象要在组件渲染完成后创建并保存

    3.2 实时监听
      import BScroll from "better-scroll"; //导入
        mounted() { //组件渲染完成
            this.scorll = new BScroll(document.querySelector(".wrapper"), {
              //属性设置
              //侦测
              //probeType： 0 和 1 表示不侦测，2 表示 手指滚动过程侦测，后面的惯性不侦测
              //  3 只要是滚动 都侦测
              probeType : 3,

              //click : 默认为 false，在bs管理范围内的click事件默认都无法响应，定义 click：true 可以解决
              click:true,

              //pullUpLoad : 上拉加载更多
              //可以传 Boolean 或 Object
              pullUpLoad:true
            });
        }

        bscroll.on('scroll',(position)=>{ 监听
          console.log(position)
        })

        bscroll.on('pulllingUp',()=>{ 上拉加载更多内容
          console.log('已经到最底部了')
          //发送网络请求

          //数据请求完成并且展示新数据
          
          bscroll.finishPullUp(); //激活pulllingUp事件，不激活pulllingUp事件只能执行一次
        })

     3.3 开发上拉加载更多
      better-scroll 的 bug ： 计算高度是暂未计算图片在内，导致未到底就会触发上拉事件
      使用： this.$refs.scroll.scroll.refresh()  可以重新计算当前高度
       监听所有图片加载完毕后 调用上述方法 : 
        * 原生 js 监听： img.onload=function () {}
        * vue : @load="方法名"
        但是，我们要从 gooditem 组件1中找到 root 中的 scroll 对象，跨越层级太多；
        新概念：事件总线


     3.4 滚动区域的 bug 分析和解决
      刷新频繁的防抖函数处理：
        上拉刷新容易短时间内触发多次,同时refresh重新计算也会在每张图片加载时触发多次
        节流：(暂不需要)
        防抖：debounce
          封装一个函数（定时器）
            debounce(func, delay) {
              //函数，时间
              let timer = null;
              return function(...args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                  func.apply(this, args);
                }, delay);
              };
            },

     3.5 吸顶效果
      之前我们使用的属性被scroll包裹后已经无法产生效果，我们来用其他方案实现
        tab-control 之上的内容是多少？  offsetTop
        在Home中我们组件是没有 offsetTop 值得，我们要进 tab-control 中拿到该值
        所有组件都有一个 $el 用于获取组件中的所有元素
          1,    
            .fixed {
              position: fixed;
              left: 0;
              right: 0;
              top: 44px;
            }
          :class="{fixed:isTabFixed}"
          通过监听改变 isTabFixed 值
          * 这种办法达到不到我们想要的效果 ： pass

          2,
            使用两个 tabcontrol 交替显示实现
            * 注意两个 tabcontrol 监听相同的点击方法
              但是 ref="tabControl" 设置不同值
              因为 updated 后 要找第二个 tabControl 的上方高度
              同时在 点击事件中同步两个组件的状态:
                this.$refs.tabControl1.currentIndex = index;
                this.$refs.tabControl2.currentIndex = index;

      3.6 bug : 使用 keep-acive 包裹的组件状态往往只能保存几次，来回几次就跳回了顶端
        使用组件销毁前后保存坐标，并跳转

      3.7 监听图片导致频繁调用了 refresh 函数，我们使用防抖
          mounted() {
            //不混入直接使用
            //监听图片加载完成
            const refresh = this.debounce(this.$refs.scroll.refresh, 100); //防抖
            this.$bus.$on("imgLoad", () => {
              //事件总线
              refresh();
            });
          },
          methods: {
            debounce(func, delay) {
              //防抖
              let timer = null;
              return function(...args) {
                //可以传入多个参数
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                  func.apply(this, args);
                  console.log("图片加载完成!");
                }, delay);
              };
            },

        由于组件可能在多个地方重复使用，我们可以封装一个混入js文件minxis，专门存放用到的data或methods
                
  # 四，跳转详情页
      1，路由跳转传值：
        方法一： 路由中设置 "detail/:iid" 获取： this.$route.params.iid
        方法二： 动态路由 发送时 {path:'detail',query:{iid:this.goods.iid}} 获取: this.$route.query.iid

      2，轮播图展示
        创建新的组件，展示数据

      3，商品基本信息展示
        创建新的组件，展示数据

      4，店铺基本信息展示
        同3，使用构造函数来存储对象并发送数据到子组件中渲染

      5, 详情页不显示底部导航栏
    

    

   



    


 