<template>
  <div class="login">
    <nav-bar class="login-nav">
      <div slot="left" @click="backPage" class="back-img">
        <img alt src="@/assets/img/common/back.svg" />
      </div>
      <div slot="center">登录</div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";

export default {
  name: "Login",
  components: {
    NavBar
  },
  data() {
    return {};
  },
  methods: {
    backPage() {
      //返回上页
      this.$router.go(-1);
    }
  },
  mounted() {
    this.$store.commit("setTabBarShow", false);
  },
  beforeRouteLeave(to, from, next) {
    //路由离开时恢复tabbar
    this.$store.commit("setTabBarShow", true);
    next();
  }
};
</script>

<style scoped>
.login-nav {
  color: var(--color-high-text);
}

.back-img {
  text-align: center;
}
.back-img img {
  width: 22px;
  margin-top: 11px;
}
</style>