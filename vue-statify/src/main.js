import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router';
import {routes} from './routes.js'
import {store} from './store/store'
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
