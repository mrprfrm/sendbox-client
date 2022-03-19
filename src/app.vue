<script>
import { mapState } from 'vuex';
import ResizableTextarea from './components/ResizableTextarea.vue';
import { SendIcon } from './icons';

const TIME_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;

export default {
  name: 'App',
  components: { ResizableTextarea, SendIcon },
  computed: {
    ...mapState(['messages']),
  },
  methods: {
    preetifyDate(dateStr) {
      const publicatedTime = new Date(dateStr).getTime();
      const localPublicatedTime = new Date(publicatedTime - TIME_OFFSET);
      const publicationHours = `0${localPublicatedTime.getHours()}`.slice(-2);
      const publicationMinutes = `0${localPublicatedTime.getMinutes()}`.slice(-2);
      return `${publicationHours}:${publicationMinutes}`;
    },
  },
};
</script>

<template>
 <div class="main">
   <div class="messages">
     <div :key="message.id" v-for="message in messages" class="messages__item">
       <pre class="messages__item-text">{{ message.body }}</pre>
       <small class="messages__item-date">
         {{ preetifyDate(message.updatedAt || message.publicatedAt) }}
       </small>
     </div>
   </div>
   <form class="messenger-form">
     <ResizableTextarea class="messenger-form__input"></ResizableTextarea>
     <button class="messenger-form__button">
       <SendIcon></SendIcon>
     </button>
   </form>
 </div>
</template>

<style lang="scss">
@import "./styles/variables";

.main {
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
  background-image: url("./assets/background.svg");
}

.messages {
  display: flex;
  flex-flow: column nowrap;
  flex: 1 1 auto;
  justify-content: flex-end;
  padding: 1.5rem 1rem;

  &__item {
    display: flex;
    flex-flow: column nowrap;
    align-self: flex-start;
    padding: 1rem 0.75rem;
    background: $white;
    margin: 0 0 0.75rem;
    border-radius: 0.5rem 0.5rem 0.5rem 0;

    &:last-child {
      margin: 0;
    }

    &-text {
      font: $text-base;
      margin: 0 0 0.25rem;
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
    font: $text-sm;
    background: $white;
    border: 1px solid $gray-100;
    font-weight: 600;
    box-shadow: $shadow-sm;
    border-radius: 0.375rem;
  }
}
</style>
