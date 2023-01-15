import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource'
import VueRouter from 'vue-router';
import {routes} from './routes.js'
import {store} from './store/store'
import vuetify from './plugins/vuetify';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginVue from '@bugsnag/plugin-vue';

Bugsnag.start({
  apiKey: process.env.VUE_APP_BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginVue()]
})

const bugsnagVue = Bugsnag.getPlugin('vue');
bugsnagVue.installVueErrorHandler(Vue);
window.Bugsnag = Bugsnag;

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
