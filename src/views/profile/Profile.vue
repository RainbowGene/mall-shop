<template>
  <div class="profile">
    <nav-bar>
      <div slot="center">购物街商城</div>
    </nav-bar>
    <scroll class="scroll-heigth">
      <log-res-item
        :cur-login="isLogin"
        :phone="phone"
        :username="username"
        @goLogin="goLogin"
        ref="login"
      />
      <money />
      <div class="line"></div>
      <profile-list />
    </scroll>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import Scroll from "@/components/common/scroll/Scroll";
import Money from "./children/Money";
import profileList from "./children/profileList";
import LogResItem from "./children/LogResItem";

export default {
  name: "Profile",
  components: {
    NavBar,
    Scroll,
    Money,
    profileList,
    LogResItem
  },
  data() {
    return {
      isLogin: false, //登录状态
      username: "", //用户名
      phone: ""
    };
  },
  methods: {
    //跳转到登录页
    goLogin() {
      this.$router.push("/login");
    }
  },
  activated() {
    let shop_login = localStorage.getItem("shop_login");
    let user_pic = localStorage.getItem("user_pic");
    if (shop_login) {
      let login = JSON.parse(shop_login);
      this.username = login.username;
      this.phone = login.phone;
      this.isLogin = true;
    }
    if (user_pic) {
      this.$refs.login.defaultPic = JSON.parse(user_pic);
    }
  }
};
</script>

<style scoped>
.profile {
  width: 100%;
  height: 100%;
}

.nav-bar {
  background-color: var(--color-tint);
  color: white;
  font-weight: 600;
}

.line {
  width: 100%;
  height: 10px;
  background-color: #eeeeee;
}

.scroll-height {
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
  overflow: hidden;
}
</style>