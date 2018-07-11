import '../assets/styles/main.scss';

import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueRouter from 'vue-router';
import Vuex from 'vuex';

import {routes} from "./router/routes";
import {storage} from './store/index'

import App from './App';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  routes
});
const store = new Vuex.Store(storage);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
