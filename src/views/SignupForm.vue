<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import LogoIcon from '../icons/LogoIcon.vue';

export default {
  components: { LogoIcon },

  setup() {
    const store = useStore();

    const username = computed({
      get() {
        return store.state.username;
      },
      set(value) {
        store.commit('SET_USERNAME', value);
      },
    });

    const password = computed({
      get() {
        return store.state.password;
      },
      set(value) {
        store.commit('SET_PASSWORD', value);
      },
    });

    function signUp(event) {
      event.preventDefault();
      this.$store.dispatch('SIGN_UP');
    }

    return {
      username, password, signUp,
    };
  },
};
</script>

<template>
  <div class="signup-page">
    <div class="container">
      <div class="title">
        <h1 class="title__text">Sign up</h1>
        <LogoIcon></LogoIcon>
      </div>
      <form class="signup-form" @submit="signUp">
        <!-- eslint-disable vuejs-accessibility/label-has-for -->
        <div class="signup-form__field">
          <label class="signup-form__field-label" for="username">Username</label>
          <input
              id="username"
              v-model="username"
              name="username" type="text"
              class="text-input signup-form__field-input"
              placeholder="Username"
              autocomplete="username"
          >
        </div>
        <div class="signup-form__field">
          <label class="signup-form__field-label" for="password">Password</label>
          <input
              id="password"
              v-model="password"
              name="password"
              class="text-input signup-form__field-input"
              type="password"
              placeholder="Password"
              autocomplete="new-password"
          >
        </div>
        <input class="btn-primary" value="Sign up" type="submit">
        <!-- eslint-enable -->
      </form>
      <router-link
          :to="{ name: 'signin'}"
          v-slot="{href, navigate}"
          custom
      >
        <a class="link" :href="href" @click="navigate">Sign in</a>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@import "../styles/variables";
@import "../styles/components";

.signup-page {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  justify-content: center;
  padding: 0 1rem;
  color: $gray-800;
}

.container {
  display: flex;
  flex-flow: column nowrap;
  background-color: $white;
  padding: 2rem 1rem 4rem;
}

.title {
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  margin: 2rem;

  &__text {
    font: $text-2xl;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }
}

.signup-form {
  display: flex;
  flex-flow: column nowrap;
  margin: 0 0 3rem;

  &__field {
    display: flex;
    flex-flow: column nowrap;
    margin: 0 0 0.75rem;

    &:last-of-type {
      margin: 0 0 1.5rem;
    }

    &-label {
      font: $text-sm;
      margin: 0 0 0.5rem;
      color: $gray-800;
    }

    &-input {
      margin: 0 0.5rem 0 0;
    }
  }
}
</style>
