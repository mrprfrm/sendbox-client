import { API_URL } from './config';

export default {
  state: () => ({
    messages: [],
    has_next: false,
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
    RECEIVE_ACTION({ commit }, action) {
      commit('PUSH_MESSAGE', action.message);
    },
  },
};
