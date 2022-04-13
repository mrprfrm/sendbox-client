import { API_URL } from './config';

export default {
  state: () => ({
    messages: [],
    hasNext: false,
    isEditing: false,
    messageText: '',
    relatedMessageId: null,
    selectedMessageId: null,
    selectedMessageCoords: { top: 0, bottom: 0 },
    count: 0,
  }),
  mutations: {
    SET_LAST_MESSAGES(state, data) {
      state.hasNext = data.hasNext;
      state.count = data.messages.length;
      state.messages.push(...data.messages);
    },
    PUSH_MESSAGES(state, data) {
      state.hasNext = data.hasNext;
      state.count += data.messages.length;
      state.messages.push(...data.messages);
    },
    PUSH_MESSAGE(state, message) {
      state.count += 1;
      state.messages.unshift(message);
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
    },
    SELECT_MESSAGE(state, { id, top, bottom }) {
      state.selectedMessageId = id;
      state.selectedMessageCoords = { top, bottom };
    },
    SET_MESSAGE_TEXT(state, text) {
      state.messageText = text;
    },
    SET_EDITING(state, isEditing) {
      state.isEditing = isEditing;
    },
    SET_RELATED_MESSAGE(state, messageId) {
      state.relatedMessageId = messageId;
    },
    DESELECT(state) {
      state.selectedMessageId = null;
    },
  },
  actions: {
    GET_LAST_MESSAGES({ commit }) {
      fetch(API_URL).then((response) => (
        response.json()
      )).then((data) => {
        commit('SET_LAST_MESSAGES', data);
      });
    },
    GET_PREV_MESSAGES({ commit, state }) {
      fetch(`${API_URL}?offset=${state.count}`).then((response) => (
        response.json()
      )).then((data) => {
        commit('PUSH_MESSAGES', data);
      });
    },
    SEND_MESSAGE({ commit, state }) {
      if (state.messageText.trim()) {
        let requestUrl = API_URL;
        let requestMethod = 'POST';
        if (state.isEditing) {
          requestUrl = `${API_URL}/${state.relatedMessageId}`;
          requestMethod = 'PATCH';
        }
        fetch(requestUrl, {
          method: requestMethod,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: state.messageText.trim() }),
        }).then(
          commit('SET_RELATED_MESSAGE', null),
          commit('SET_MESSAGE_TEXT', ''),
          commit('SET_EDITING', false),
        );
      }
    },
    DELETE_SELECTED_MESSAGE({ commit, state }) {
      fetch(`${API_URL}/${state.selectedMessageId}`, {
        method: 'DELETE',
      }).then(
        commit('DESELECT'),
      );
    },
    RECEIVE_ACTION({ commit }, action) {
      switch (action.action_type) {
        case 0:
          commit('PUSH_MESSAGE', action.message);
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
    SET_MESSAGE_TEXT({ commit }, text) {
      commit('SET_MESSAGE_TEXT', text);
    },
    SET_EDITED_MESSAGE({ commit, state, getters }) {
      commit('SET_RELATED_MESSAGE', state.selectedMessageId);
      commit('SET_MESSAGE_TEXT', getters.relatedMessage.body);
      commit('SET_EDITING', true);
      commit('DESELECT');
    },
    RESET_EDITED_MESSAGE({ commit }) {
      commit('SET_RELATED_MESSAGE', null);
      commit('SET_MESSAGE_TEXT', '');
      commit('SET_EDITING', false);
    },
    RESET_RELATED_MESSAGE({ commit }) {
      commit('SET_RELATED_MESSAGE', null);
      commit('SET_EDITING', false);
    },
    TOGGLE_SELECTION({ commit, state }, payload) {
      const { id } = payload;
      if (state.selectedMessageId !== id) {
        commit('SELECT_MESSAGE', payload);
      } else {
        commit('DESELECT');
      }
    },
    DESELECT({ commit }) {
      commit('DESELECT');
    },
  },
  getters: {
    relatedMessage(state) {
      const relatedIndex = state.messages.findIndex(
        (itm) => itm.id === state.relatedMessageId,
      );
      return state.messages[relatedIndex];
    },
  },
};
