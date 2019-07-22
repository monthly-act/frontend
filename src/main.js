import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import axios from 'axios';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueClipboard);

router.beforeEach((to, from, next) => {
  if (to.matched.some(routeInfo => routeInfo.meta.authRequired)) {
    if (!store.state.loginUser) {
      router.push('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => response, (error) => {
  // Do something with response error
  if (error.response.status === 401) {
    console.log('unauthorized, logging out ...');
    store.dispatch('logout');
    router.replace('/');
  }
  return Promise.reject(error.response);
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
