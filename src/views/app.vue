<template>
  <div class="main">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import "../styles/app.scss";

.main {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  background-image: url("../assets/background.svg");
  height: 100vh;
}
</style>
