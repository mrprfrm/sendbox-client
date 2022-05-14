import { createStore } from 'vuex';
import { API_URL, AUTH_URL } from './config';

import router from './router';

export default createStore({
  state: () => ({
    messages: [],
    hasNext: false,
    isEditing: false,
    messageText: '',
    relatedMessageId: null,
    selectedMessageId: null,
    selectedMessageCoords: { top: 0, bottom: 0 },
    count: 0,
    username: '',
    password: '',
    accessToken: '',
    user: {
      username: '',
    },
  }),
  /* eslint no-param-reassign: "error" */
  mutations: {
    RESET_HAS_NEXT(state, hasNext = false) {
      state.hasNext = hasNext;
    },
    RESET_COUNT(state, count = 0) {
      state.count = count;
    },
    RESET_MESSAGES(state, messages = []) {
      state.messages = messages;
    },
    PUSH_MESSAGES(state, messages) {
      state.messages.push(...messages);
    },
    PUSH_MESSAGE(state, message) {
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
    SET_USERNAME(state, username) {
      state.username = username;
    },
    SET_PASSWORD(state, password) {
      state.password = password;
    },
    SET_TOKEN(state, token) {
      state.accessToken = token;
    },
    SET_USER(state, user) {
      state.user = user;
    },
  },
  /* eslint-enable */
  actions: {
    GET_LAST_MESSAGES({ commit }) {
      fetch(API_URL).then((response) => (
        response.json()
      )).then((data) => {
        commit('RESET_MESSAGES', data.messages);
        commit('RESET_HAS_NEXT', data.hasNext);
        commit('RESET_COUNT', data.count);
      }).catch(() => {
        // TODO refresh token is 401 and retry
      });
    },
    GET_PREV_MESSAGES({ commit, state }) {
      fetch(`${API_URL}?offset=${state.count}`).then((response) => (
        response.json()
      )).then((data) => {
        commit('PUSH_MESSAGES', data);
      }).catch(() => {
        // TODO refresh token is 401 and retry
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
    SIGH_IN({ commit, state }) {
      fetch(`${AUTH_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
        }),
      }).then((response) => (
        response.json()
      )).then((data) => {
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        router.push({ name: 'room' });
      }).catch(() => {
        // TODO set error message.
      });
    },
    SIGN_UP({ commit, state }) {
      fetch(`${AUTH_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: state.username,
          password: state.password,
        }),
      }).then((response) => (
        response.json()
      )).then((data) => {
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        router.push({ name: 'room' });
      }).catch(() => {
        // TODO set error message.
      });
    },
    REFRESH({ commit }) {
      const token = localStorage.getItem('refreshToken');
      fetch(`${AUTH_URL}/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response) => (
        response.json()
      )).then((data) => {
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.accessToken);
      }).catch(() => {
        localStorage.removeItem('refreshToken');
      });
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
});
