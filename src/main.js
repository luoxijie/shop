import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios';
import './assets/css/global.css'

Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = "http://localhost:7000";
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  render: h => h(App),
  components: {
    App,
  }
}).$mount('#app')
