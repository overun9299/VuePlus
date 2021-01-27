import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import BaseMenu from '../components/base/BaseMenu.vue'
import BasePriority from '../components/base/BasePriority.vue'
import User from '../components/human/User.vue'
import Person from '../components/human/Person.vue'
import Auth from '../components/system/Auth.vue'
import Other from '../components/system/Other.vue'
import Export from '../components/system/Export.vue'
import GoodsReptile from '../components/business/goodsReptile.vue'
import goodsList from '../components/business/goodsList.vue'

Vue.use(VueRouter)

  const routes = [
      {path: '/', redirect: '/login'},
      {path: '/login', component: Login },
      {path: '/home', component: Home, redirect: '/welcome', children:[
          {path: '/welcome', component: Welcome},
          {path: '/menu', component: BaseMenu},
          {path: '/priority', component: BasePriority},
          {path: '/user', component: User},
          {path: '/permiss', component: Auth},
          {path: '/other', component: Other},
          {path: '/person', component: Person},
          {path: '/export', component: Export},
          {path: '/goodsReptile', component: GoodsReptile},
          {path: '/goodsList', component: goodsList},
              ]},
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    const routers = sessionStorage.getItem('routers');

    // 添加非自身权限跳转
    if (to.path != '/welcome' && to.path != '/login' && routers.split(',').indexOf(to.path) == -1) {
        next('/welcome')
    }

    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    if (to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router
