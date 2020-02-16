import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import Login from './components/Login.vue';


// Vue.prototype.$window
Vue.config.productionTip = false

Vue.use(VueResource);

Vue.component("login", Login);

Vue.http.interceptors.push((request, next)=> {
  next(response => {
    response.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
})

new Vue({
  render: h => h(App),
}).$mount('#app')
