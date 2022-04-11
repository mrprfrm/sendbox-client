<script>
import { mapState } from 'vuex';
import { ResizableTextarea, ContextMenu } from '../components';
import { SendIcon } from '../icons';
import { connectToBrocker } from '../utils';
import { TIME_OFFSET, BROKER_URL } from '../config';

export default {
  name: 'App',
  data: () => ({
    messageText: '',
  }),
  components: { ResizableTextarea, ContextMenu, SendIcon },
  computed: {
    ...mapState(['messages', 'has_next', 'selectedMessageId', 'containerHeight']),
  },
  methods: {
    selectMessage(event, id) {
      const { top, bottom } = event.currentTarget.getBoundingClientRect();
      this.$store.dispatch('TOGGLE_SELECTION', { id, top, bottom });
    },
    preetifyDate(dateStr) {
      const publicatedTime = new Date(dateStr).getTime();
      const localPublicatedTime = new Date(publicatedTime - TIME_OFFSET);
      const publicationHours = `0${localPublicatedTime.getHours()}`.slice(-2);
      const publicationMinutes = `0${localPublicatedTime.getMinutes()}`.slice(-2);
      return `${publicationHours}:${publicationMinutes}`;
    },
    submitMessage(event) {
      event.preventDefault();
      if (this.messageText.trim()) {
        this.$store.dispatch('SEND_MESSAGE', this.messageText.trim());
        this.messageText = '';
      }
    },
  },
  mounted() {
    this.$store.dispatch('GET_LAST_MESSAGES');
    connectToBrocker(BROKER_URL, this.$store);
  },
  // updated() {
  //   const container = this.$refs.messagesContainer;
  //   const containerCoords = container.getBoundingClientRect();
  //   // container.scrollTo({ top: container.scrollHeight });
  //   if (this.containerHeight !== containerCoords.height) {
  //     this.$store.dispatch('CONTAINER_RESIZE', containerCoords.height);
  //   }
  // },
};
</script>

<template>
 <div class="main">
   <div
       ref="messagesContainer"
       class="content"
       v-bind:class="{content_fixed: this.selectedMessageId !== null}"
   >
     <button
         @click="$store.dispatch('GET_PREV_MESSAGES')"
         v-show="has_next"
         class="content__next-button"
     >
       Load more messages
     </button>
     <div class="messages">
       <div
           :key="message.id"
           @click="selectMessage($event, message.id)"
           v-for="message in messages"
           class="messages__item"
           v-bind:class="{messages__item_selected: this.selectedMessageId === message.id}"
       >
         <pre class="messages__item-text">{{ message.body }}</pre>
         <small class="messages__item-date">
           {{ preetifyDate(message.updatedAt || message.publicatedAt) }}
         </small>
       </div>
       <ContextMenu v-show="selectedMessageId !== null"></ContextMenu>
     </div>
   </div>
   <form @submit="submitMessage" class="messenger-form">
     <ResizableTextarea
         v-model="messageText"
         :submit-handler="submitMessage"
         class="messenger-form__input"
     ></ResizableTextarea>
     <button class="messenger-form__button">
       <SendIcon></SendIcon>
     </button>
   </form>
 </div>
</template>

<style lang="scss">
@import "../styles/variables";

.main {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  background-image: url("../assets/background.svg");
}

.content {
  display: flex;
  flex: 1 1 100%;
  flex-flow: column nowrap;
  overflow-y: scroll;
  padding: 1.5rem 1rem;
  scroll-behavior: smooth;

  &_fixed {
    overflow-y: hidden;
  }

  &__next-button {
    display: flex;
    padding: 0.5rem 0.75rem;
    font: $text-sm;
    color: $gray-500;
    background: $white;
    border: 1px solid $gray-100;
    box-shadow: $shadow-sm;
    border-radius: 0.375rem;
    align-self: center;
    margin: 0 0 1.5rem;
  }
}

.messages {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column-reverse nowrap;

  &__item {
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

    &-text {
      font: $text-base;
      margin: 0 0 0.25rem;
      white-space: pre-line;
      word-break: break-word;
    }

    &-date {
      font: $text-sm;
      color: $gray-300;
      text-align: right;
    }
  }
}

.messenger-form {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  background-color: $white;
  border-radius: 0.75rem 0.75rem  0 0;
  margin: 0;
  padding: 1.5rem 1rem 3rem;
  box-shadow: $shadow;

  &__input {
    display: flex;
    flex-basis: 100%;
    border: 1px solid $gray-100;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    resize: none;
    font: $text-sm;
    outline: none;
    box-shadow: $inner-shadow;
    max-height: 8rem;
    margin: 0 0.5rem 0;
  }

  &__button {
    display: flex;
    padding: 0.5rem;
    background: $white;
    border: 1px solid $gray-100;
    box-shadow: $shadow-sm;
    border-radius: 0.375rem;
  }
}
</style>
