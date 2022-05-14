<script>
export default {
  name: 'App',
  beforeMount() {
    if (localStorage.getItem('refreshToken')) {
      this.$store.dispatch('REFRESH');
    }
  },
};
</script>

<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
.main {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  background-image: url("../assets/background.svg");
}
</style>
