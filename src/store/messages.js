import { API_URL } from '@/config';

export default {
  state: () => ({
    count: 0,
    hasNext: false,
    messageText: '',
    selectedMessageId: null,
    editedMessageId: false,
    messages: [],
  }),
  mutations: {
    // MESSAGES READING
    RESET_MESSAGE_TEXT(state, text = '') {
      state.messageText = text;
    },
    RESET_MESSAGES(state, messages = []) {
      state.messages = messages;
    },
    RESET_HAS_NEXT(state, hasNext = false) {
      state.hasNext = hasNext;
    },
    RESET_COUNT(state, count = 0) {
      state.count = count;
    },
    ADD_PREV_MESSAGES(state, messages) {
      state.messages.push(...messages);
    },
    // MESSAGES SELECTION
    RESET_SELECTED_MESSAGE(state, id = null) {
      state.selectedMessageId = id;
    },
    RESET_EDITED_MESSAGE(state, id = null) {
      state.editedMessageId = id;
      state.selectedMessageId = null;
    },
    // MESSAGES UPDATING
    ADD_NEW_MESSAGE(state, message) {
      state.messages.unshift(message);
      state.count += 1;
    },
    UPDATE_MESSAGE(state, message) {
      const updatedIndex = state.messages.findIndex(
        (itm) => itm.id === message.id,
      );
      state.messages[updatedIndex] = message;
    },
    REMOVE_MESSAGE(state, messageId) {
      const removeIndex = state.messages.findIndex(
        (itm) => itm.id === messageId,
      );
      state.messages.splice(removeIndex, 1);
      state.count -= 1;
    },
  },
  actions: {
    // MESSAGES READING
    GET_LAST_MESSAGES({ commit }) {
      fetch(API_URL).then((response) => (
        response.json()
      )).then((data) => {
        commit('RESET_MESSAGES', data.messages);
        commit('RESET_HAS_NEXT', data.hasNext);
        commit('RESET_COUNT', data.count);
      }).catch(() => {
        // TODO refresh token if 401 and retry
      });
    },
    GET_PREV_MESSAGES({ commit, state }) {
      fetch(`${API_URL}?offset=${state.count}`).then((response) => (
        response.json()
      )).then((data) => {
        commit('ADD_PREV_MESSAGES', data);
        commit('RESET_HAS_NEXT', data.hasNext);
      }).catch(() => {
        // TODO refresh token is 401 and retry
      });
    },
    // MESSAGES UPDATING
    SEND_MESSAGE({ commit, state }) {
      if (state.messageText.trim()) {
        let requestUrl = API_URL;
        let requestMethod = 'POST';
        if (state.editedMessageId) {
          requestUrl = `${API_URL}/${state.editedMessageId}`;
          requestMethod = 'PATCH';
        }
        fetch(requestUrl, {
          method: requestMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: state.messageText.trim() }),
        }).then(
          commit('RESET_EDITED_MESSAGE'),
          commit('RESET_MESSAGE_TEXT'),
        ).catch(() => {
          // TODO refresh token is 401 and retry
        });
      }
    },
    DELETE_SELECTED_MESSAGE({ commit, state }) {
      fetch(`${API_URL}/${state.selectedMessageId}`, {
        method: 'DELETE',
      }).then(
        commit('DESELECT'),
      );
    },
    // MESSAGES RECEIVING
    RECEIVE_ACTION({ commit }, action) {
      switch (action.action_type) {
        case 0:
          commit('ADD_NEW_MESSAGE', action.message);
          break;
        case 1:
          commit('UPDATE_MESSAGE', action.message);
          break;
        case 2:
          commit('REMOVE_MESSAGE', action.message.id);
          break;
        default:
          console.warn('Unexpected action');
          console.warn(action);
      }
    },
  },
  getters: {
    editedMessage(state) {
      const editedIndex = state.messages.findIndex(
        (itm) => itm.id === state.editedMessageId,
      );
      return state.messages[editedIndex] || {};
    },
  },
};
