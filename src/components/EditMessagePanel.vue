<script>
import { mapGetters } from 'vuex';
import { EditIcon, XCircleIcon } from '../icons';

export default {
  name: 'EditMessagePanel',
  components: { EditIcon, XCircleIcon },
  computed: {
    ...mapGetters(['relatedMessage']),
  },
};
</script>

<template>
  <div class="edited-message">
    <div>
      <EditIcon></EditIcon>
    </div>
    <span class="edited-message__text">
      {{ relatedMessage ? relatedMessage.body : '' }}
    </span>
    <button @click="$store.dispatch('RESET_EDITED_MESSAGE')" class="edited-message__reset">
      <XCircleIcon></XCircleIcon>
    </button>
  </div>
</template>

<style lang="scss">
@import "../styles/variables";

.edited-message {
  display: flex;
  align-items: center;

  &__text {
    display: flex;
    flex: 1 1 100%;
    font: $text-sm;
    margin: 0 1rem 0;
    color: $gray-300;
  }

  &__reset {
    display: flex;
    padding: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: $gray-300;
  }
}
</style>
