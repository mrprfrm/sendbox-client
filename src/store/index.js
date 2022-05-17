import { createStore } from 'vuex';

import messages from './messages';
import auth from './auth';

export default createStore({
  modules: {
    messages,
    auth,
  },
});
