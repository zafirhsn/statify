import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import SharedData from './components/Shared.vue';


export const routes = [
  { path: '/', name: 'login', component: Login },
  { path: '/user/:id', name: 'sharedData', component: SharedData },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '*', component: Login }
]