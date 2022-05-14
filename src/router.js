import { createRouter, createWebHistory } from 'vue-router';

import {
  ChatPlaceholder, ChatRoom, SigninForm, SignupForm,
} from './views';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'placeholder',
      path: '/loading',
      component: ChatPlaceholder,
      beforeEnter: (to, from, next) => (
        !localStorage.getItem('refreshToken') ? next({ name: 'signin' }) : next()
      ),
    },
    {
      name: 'room',
      path: '/',
      component: ChatRoom,
      beforeEnter: (to, from, next) => (
        !localStorage.getItem('refreshToken') ? next({ name: 'signin' }) : next()
      ),
    },
    {
      name: 'signin',
      path: '/signin',
      component: SigninForm,
      beforeEnter: (to, from, next) => (
        localStorage.getItem('refreshToken') ? next({ name: 'room' }) : next()
      ),
    },
    {
      name: 'signup',
      path: '/signup',
      component: SignupForm,
      beforeEnter: (to, from, next) => (
        localStorage.getItem('refreshToken') ? next({ name: 'room' }) : next()
      ),
    },
  ],
});

export default router;
