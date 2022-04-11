import { createApp } from 'vue';
import { createStore } from 'vuex';

import App from './views/app.vue';
import store from './store';

const app = createApp(App);
const appStore = createStore(store);
app.use(appStore);
app.mount('#app');
