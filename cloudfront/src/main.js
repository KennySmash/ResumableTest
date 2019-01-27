import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import VueSocketIO from 'vue-socket-io'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueSocketIO, {
    debug: true,
    connection: 'https://linkstorm-res-test.herokuapp.com/socket',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
});

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
