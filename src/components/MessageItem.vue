<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { TIME_OFFSET } from '@/config';

export default {
  props: ['message'],

  setup(props) {
    const store = useStore();

    function selectMessage(event) {
      const { top, bottom } = event.currentTarget.getBoundingClientRect();
      store.dispatch('TOGGLE_SELECTION', { id: props.message.id, top, bottom });
    }

    return {
      selectMessage,
      selectedMessageId: computed(() => store.state.selectedMessageId),
      publicationDate: computed(() => {
        const dateStr = props.message.updatedAt || props.message.publicatedAt;
        const publicatedTime = new Date(dateStr).getTime();
        const localPublicatedTime = new Date(publicatedTime - TIME_OFFSET);
        const publicationHours = `0${localPublicatedTime.getHours()}`.slice(-2);
        const publicationMinutes = `0${localPublicatedTime.getMinutes()}`.slice(-2);
        return `${publicationHours}:${publicationMinutes}`;
      })
    };
  },
};
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/click-events-have-key-events -->
  <div
      @click="selectMessage($event, message.id)"
      class="message"
      v-bind:class="{messages__item_selected: selectedMessageId === message.id}"
  >
     <small class="message__username">{{ message.user.username }}</small>
     <pre class="message__text">{{ message.body }}</pre>
     <small class="message__date">
       {{ publicationDate }}
     </small>
   </div>
  <!-- eslint-enable -->
</template>

<style lang="scss">
@import "../styles/variables.scss";

.message {
  display: flex;
  flex-flow: column nowrap;
  align-self: flex-start;
  padding: 1rem 0.75rem;
  background: $white;
  margin: 0 1rem 0.75rem 0;
  border-radius: 0.5rem 0.5rem 0.5rem 0;
  cursor: pointer;
  user-select: none;

  &:first-child {
    margin: 0 1rem 0 0;
  }

  &_selected {
    z-index: 10;
  }

  &__text {
    font: $text-base;
    margin: 0 0 0.25rem;
    white-space: pre-line;
    word-break: break-word;
    color: $gray-800;
  }

  &__date {
    font: $text-sm;
    color: $gray-400;
    text-align: right;
  }

  &__username {
    font: $text-sm;
    margin: 0 0 0.25rem;
    color: $brand-alter-dark;
    font-weight: 600;
  }
}
</style>
