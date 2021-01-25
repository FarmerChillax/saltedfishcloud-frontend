// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './axios.config'
import VueAxios from 'vue-axios'
import 'mdui/dist/css/mdui.css'
import mdui from 'mdui'
import 'default-passive-events'
import Store from './Store'
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios
Vue.prototype.$mdui = mdui.$
Vue.prototype.$eventBus = new Vue()
/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  store: Store,
  router,
  components: { App },
  template: '<App/>'
})
