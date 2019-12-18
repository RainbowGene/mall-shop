<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">
        购物车(
        <span>{{ cartLength }}</span>
        )
      </div>
    </nav-bar>
    <!--购物车组件-->
    <cart-list class="ccart"></cart-list>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "./children/CartList";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList
  },
  computed: {
    cartLength() {
      return this.$store.getters.cartListLength;
    }
  }
};
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: white;
}

.ccart {
  background-color: var(--color-tint);
}
</style>