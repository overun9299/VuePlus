import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 引入全局axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:9100/ms/user/'
Vue.prototype.$http = axios

// 设置axios全局拦截器
axios.interceptors.request.use(config =>{
  config.headers.token = window.sessionStorage.getItem("token")
  return config
})

Vue.config.productionTip = false
Vue.use(VueAxios,axios);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
