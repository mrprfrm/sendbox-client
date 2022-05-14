import { createApp } from 'vue';

import App from './views/app.vue';
import store from './store';
import router from './router';

createApp(App).use(store).use(router).mount('#app');
