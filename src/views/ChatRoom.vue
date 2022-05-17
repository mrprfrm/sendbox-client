<script>
import { computed, onMounted } from 'vue';
// import { computed, onMounted, onBeforeMount } from 'vue';
import { useStore } from 'vuex';
// import { useRouter } from 'vue-router';
import {
  ResizableTextarea, ContextMenu, EditMessagePanel, MessageItem,
} from '@/components';
import { SendIcon, UserIcon } from '@/icons';
import { connectToBrocker } from '@/utils';
import { BROKER_URL } from '@/config';

export default {
  components: {
    ResizableTextarea, ContextMenu, SendIcon, EditMessagePanel, MessageItem, UserIcon,
  },

  setup() {
    const store = useStore();
    // const router = useRouter();

    const messageText = computed({
      get() {
        return store.state.messages.messageText;
      },
      set(value) {
        store.commit('SET_MESSAGE_TEXT', value);
      },
    });

    onMounted(() => {
      store.dispatch('GET_LAST_MESSAGES');
      connectToBrocker(BROKER_URL, store);
    });

    // TODO push if not authenticated
    // or do nothing and let store to resolve case
    // if 401 or 403 was received
    // onBeforeMount(() => {
    //   if (!store.state.accessToken) {
    //     router.push({ name: 'placeholder' });
    //   }
    // });

    const submitMessage = (event) => {
      event.preventDefault();
      store.dispatch('SEND_MESSAGE');
    };

    const getPrevMessages = () => store.dispatch('GET_PREV_MESSAGES');

    return {
      messageText,
      submitMessage,
      getPrevMessages,
      messages: computed(() => store.state.messages.messages),
      hasNext: computed(() => store.state.messages.hasNext),
      selectedMessageId: computed(() => store.state.messages.selectedMessageId),
      editedMessageId: computed(() => store.state.messages.editedMessageId),
      user: computed(() => store.state.auth.user),
    };
  },
};
</script>

<template>
 <div class="room">
   <div class="header-wrapper">
     <div class="header">
       <span class="header__title">{{ user ? user.username : 'Anon' }}</span>
       <button class="header__usermenu-btn">
         <UserIcon></UserIcon>
       </button>
     </div>
   </div>
   <div
       ref="messagesContainer"
       class="content"
       v-bind:class="{content_fixed: this.selectedMessageId !== null}"
   >
     <button
         v-show="hasNext"
         class="content__next-button"
         @click="getPrevMessages"
     >
       Load more messages
     </button>
     <div class="messages">
       <MessageItem :key="message.id" :message="message" v-for="message in messages" ></MessageItem>
       <ContextMenu v-show="selectedMessageId !== null"></ContextMenu>
     </div>
   </div>
   <div class="controls">
     <div v-show="editedMessageId" class="related-message">
       <EditMessagePanel></EditMessagePanel>
     </div>
     <form @submit="submitMessage" class="messenger-form">
       <ResizableTextarea
           v-model="messageText"
           :submit-handler="submitMessage"
           class="messenger-form__input"
           placeholder="Enter text"
       ></ResizableTextarea>
       <button class="messenger-form__submit">
         <SendIcon class="message-form__submit-icon"></SendIcon>
       </button>
     </form>
   </div>
 </div>
</template>

<style lang="scss">
@import "../styles/variables";

.room {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  overflow: hidden;
}

.header-wrapper {
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem 1rem 0;
  margin: 0 0 1rem;

  &::after {
    content: '';
    align-self: center;
    width: 5rem;
    border-image: $main-gradient;
    border-image-slice: 1;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }
}

.header {
  display: grid;
  grid-template-columns: 2rem auto 2rem;
  margin: 0 0 0.25rem;

  &__title {
    grid-column: 2 / 3;
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
    font: $text-sm;
    color: $gray-800;
  }

  &__usermenu-btn {
    grid-column: 3 / 3;
    border: none;
    background: none;
    padding: 0.25rem;
  }
}

.content {
  display: flex;
  flex: 1 1 100%;
  flex-flow: column nowrap;
  overflow-y: scroll;
  padding: 1rem 1rem 1.5rem;
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
}

.controls {
  display: flex;
  flex-direction: column;
  background-color: $white;
  border-radius: 0.75rem 0.75rem  0 0;
  margin: 0;
  padding: 1rem 1rem 3rem;
  box-shadow: $shadow;
}

.related-message {
  margin: 0 0 1rem 0;
}

.messenger-form {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  margin: 0;

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
    margin: 0 0.5rem 0 0;

    &::placeholder {
      color: $gray-300;
    }
  }

  &__submit {
    display: flex;
    padding: 0.5rem;
    background: $white;
    border: 1px solid $gray-100;
    box-shadow: $shadow-sm;
    border-radius: 0.375rem;
    cursor: pointer;
  }
}
</style>
