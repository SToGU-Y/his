// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI, { TabPane } from 'view-design'
import 'view-design/dist/styles/iview.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment'
import Print from 'vue-print-nb'
import VCharts from 'v-charts'
import * as echarts from 'echarts'

Vue.use(ViewUI,VueAxios,axios)
Vue.use(Print)
Vue.use(VCharts)

axios.defaults.baseURL = 'http://localhost:8081/'
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.moment = moment;

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (localStorage.getItem('TOKEN')) { // 判断本地是否存在access_token
      next()
    } else {
      // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
      next({path: '/'})
    }
  } else {
    if (localStorage.getItem('TOKEN')) { // 判断本地是否存在access_token
      if(to.path === '/patient/query' || to.path === '/patient/query/patientCostQuery'
       || to.path === '/patient/query/patientDepositQuery' || to.path === '/patient/query/patientMedicalRecordQuery' || to.path === '/patient/query/patientInpatientQuery'){
        next()
      }else{
        next({path: '/admin'})
      }   
    } else {
      // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
      next()
    }
    
  }
})

axios.interceptors.request.use(function (config) {
  if(localStorage.getItem('TOKEN')){
      config.headers.Authorization = 'Bearer ' +  JSON.parse(localStorage.getItem('TOKEN')).token
  }
  return config
},function (error) {
  return Promise.reject(error)
});

axios.interceptors.response.use(function (res) {
  return res
}, function (error) {
  if(error.response.status == 401 || error.response.status == 402){
      router.push('/')
      Vue.prototype.$toast.fail('请重新登录')
  }else if(error.response.status == 500){
    return response
  }
  return Promise.reject(error)
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
