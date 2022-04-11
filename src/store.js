import { API_URL } from './config';

export default {
  state: () => ({
    messages: [],
    has_next: false,
    selectedMessageId: null,
    selectedMessageCoords: { top: 0, bottom: 0 },
    count: 0,
  }),
  mutations: {
    SET_LAST_MESSAGES(state, data) {
      state.has_next = data.has_next;
      state.count = data.messages.length;
      state.messages.push(...data.messages);
    },
    PUSH_MESSAGES(state, data) {
      state.has_next = data.has_next;
      state.count += data.messages.length;
      state.messages.push(...data.messages);
    },
    PUSH_MESSAGE(state, message) {
      state.count += 1;
      state.messages.unshift(message);
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
    SEND_MESSAGE(context, text) {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
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
        case 1:
          commit('PUSH_MESSAGE', action.message);
          break;
        case 2:
          commit('REMOVE_MESSAGE', action.message.id);
          break;
        default:
          console.warn('Unexpected action');
          console.warn(action);
      }
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
};
