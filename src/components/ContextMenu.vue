<script>
import { useStore } from 'vuex';
import { computed } from 'vue';

export default {
  setup() {
    const store = useStore();

    return {
      menuCoordinates: computed(() => {
        const { top, bottom } = store.state.selectedMessageCoords;
        if (window.innerHeight / 1.5 > bottom) {
          return { top: bottom + 8 };
        }
        return { bottom: window.innerHeight - top + 8 };
      }),
      setEdited: () => store.dispatch('SET_EDITED_MESSAGE'),
      deselectMessage: () => store.commit('DESELECT'),
      deleteMessage: () => store.dispatch('DELETE_SELECTED_MESSAGE'),
    };
  },
};
</script>

<template>
  <div class="menu-wrapper">
    <!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
    <div class="fade" @click="deselectMessage"></div>
    <!-- eslint-enable -->
    <div class="menu" :style="menuCoordinates">
      <button
          @click="setEdited"
          class="menu__option"
      >Edit</button>
      <button
          @click="deleteMessage"
          class="menu__option"
      >Delete</button>
    </div>
  </div>
</template>

<style lang="scss">
@import "../styles/variables";

.menu-wrapper {
  position: absolute;
  padding: 0 1rem;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.fade {
  z-index: 1;
  position: absolute;
  backdrop-filter: blur(4px);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.menu {
  z-index: 10;
  position: absolute;
  display: inline-flex;
  flex-flow: column nowrap;
  padding: 0.5rem 0;
  border-radius: 0.5rem;
  background-color: $gray-100;
  align-self: flex-start;
  box-shadow: $shadow;

  &__option {
    padding: 0.25rem 0.75rem;
    font: $text-sm;
    border: none;
    text-align: left;
    color: $gray-700;
  }
}
</style>
