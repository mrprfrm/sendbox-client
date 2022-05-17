import { AUTH_URL } from '@/config';
import router from '@/router';

export default {
  state: () => ({
    errorText: '',
    usernameText: '',
    passwordText: '',
    accessToken: null,
    user: null,
  }),
  mutations: {
    RESET_ERROR_TEXT(state, text = '') {
      state.errorText = text;
    },
    RESET_USER(state, user = {}) {
      state.user = user;
    },
    RESET_ACCESS_TOKEN(state, token = null) {
      state.accessToken = token;
    },
    RESET_USERNAME_TEXT(state, text = '') {
      state.usernameText = text;
    },
    RESET_PASSWORD_TEXT(state, text = '') {
      state.passwordText = text;
    },
  },
  actions: {
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
        commit('RESET_USER', data.user);
        commit('RESET_ACCESS_TOKEN', data.accessToken);
        commit('RESET_USERNAME_TEXT');
        commit('RESET_PASSWORD_TEXT');
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
        commit('RESET_USERNAME_TEXT');
        commit('RESET_PASSWORD_TEXT');
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
        commit('RESET_USERNAME_TEXT');
        commit('RESET_PASSWORD_TEXT');
      }).catch(() => {
        localStorage.removeItem('refreshToken');
      });
    },
  },
};
