<script>
import { watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    watch(() => store.state.accessToken, (newValue) => {
      if (newValue) {
        router.push({ name: 'room' });
      } else {
        router.push({ name: 'signin' });
      }
    });

    return {};
  },
};
</script>

<template>
  <div class="placeholder"></div>
</template>
