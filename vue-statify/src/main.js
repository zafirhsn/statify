import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource'
// import Login from './components/Login.vue';
// import Dashboard from './components/Dashboard.vue';
import VueRouter from 'vue-router';
import {routes} from './routes.js'


// Vue.prototype.$window
Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
})



// Vue.component("login", Login);
// Vue.component("dashboard", Dashboard);


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
