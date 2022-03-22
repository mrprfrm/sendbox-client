import { API_URL } from './config';

export default {
  state: () => ({
    messages: [],
  }),
  mutations: {
    SET_LAST_MESSAGES(state, messages) {
      state.messages.push(...messages);
    },
    PUSH_MESSAGE(state, message) {
      state.messages.unshift(message);
    },
  },
  actions: {
    GET_LAST_MESSAGES({ commit }) {
      fetch(API_URL).then((response) => (
        response.json()
      )).then((data) => {
        commit('SET_LAST_MESSAGES', data.messages);
      });
    },
    SEND_MESSAGE(context, text) {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
    },
    RECEIVE_ACTION({ commit }, action) {
      commit('PUSH_MESSAGE', action.message);
    },
  },
};
