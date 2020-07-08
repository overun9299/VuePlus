import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 按需导入element
// import './plugins/element.js'

// 全局导入全部element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';//样式文件一定要引入

// 导入全局样式
import './assets/css/global.css'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 引入全局axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// 配置请求的跟路径
axios.defaults.baseURL = 'http://www.overun.top/'
// axios.defaults.baseURL = 'http://www.zhangpy.com/'
Vue.prototype.$http = axios

// 设置axios全局拦截器
axios.interceptors.request.use(config =>{
  config.headers.token = window.sessionStorage.getItem("token")
  return config
})

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
