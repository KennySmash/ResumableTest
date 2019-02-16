import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import store from './store'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

Vue.use(VueSocketio, io('//localhost:5050'));

Vue.use(VueAxios, axios);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
