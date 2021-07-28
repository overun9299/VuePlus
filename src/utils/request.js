// 引入axios
import axios from 'axios';
// 引入elementUI
import { Message } from 'element-ui';
// 引入路由
import router from '../router/index'

//环境切换 
if (process.env.NODE_ENV == 'development') {
  axios.defaults.baseURL = 'http://www.txjava.cn:9000';  //基础url + api.js中的 url
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = 'https://localhost:80'
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'https://http://47.105.48.220:80'
}
// 请求超时 请求头
axios.defaults.timeout = 10000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.transformRequest = [function (data) {
    let src = ''
    for (let item in data) {
        src += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
    }
    return src
}]

// 请求拦截器
axios.interceptors.request.use(
    config => {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
      config.headers.token = window.sessionStorage.getItem("token")
      return config;
    },
    error => {
      return Promise.error(error);
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
      if (response.status == 200) {
          if (response.data.success) {
              Message({
                  message: response.data.msg,
                  duration: 1000,
                  type: 'success'
              });
          } else {
              Message({
                  message: response.data.msg,
                  duration: 1000,
                  type: 'error'
              });
          }
          return Promise.resolve(response);
      }
    },
    // 服务器状态码不是200的情况    
    error => {
      if (error.response.status) {
        switch (error.response.status) {
            // 401: 未登录
          case 401:
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            });
            break;
          case 403:
              Message({
              message: '登录过期，请重新登录',
              duration: 1000,
              forbidClick: true
            });
            // 清除token
            localStorage.removeItem('token');
            store.commit('loginSuccess', null);
            setTimeout(() => {
              router.replace({
                path: '/login',// 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
                query: {
                  redirect: router.currentRoute.fullPath
                }
              });
            }, 1000);
            break;
            // 404请求不存在
          case 404:
            Message({
              message: '地址不存在',
              duration: 1500,
              forbidClick: true
            });
            break;
            // 其他错误，直接抛出错误提示
          default:
            Message({
              message: error.response.data.message,
              duration: 1500,
              forbidClick: true
            });
        }
        return Promise.reject(error.response);
      }
    }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params){
  return new Promise((resolve, reject) =>{
    axios.get(url, {
      params: params
    })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}
/**
 * 封装patch请求
 * @param url
 * @param params
 * @returns {Promise}
 */
export function patch(url,params){
  return new Promise((resolve,reject) => {
    axios.patch(url,params)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
  })
}

/**
 * put 请求
 * @param  url
 * @param  params
 */
export function put(url,params){
  return new Promise((resolve,reject) => {
    axios.put(url,params)
        .then(response => {
          resolve(response.data);
        },err => {
          reject(err)
        })
  })
}