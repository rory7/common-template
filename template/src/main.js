{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'
import App from './App'
{{#router}}
import router from './router'
{{/router}}
import './assets/css/base.css'
import VueSessionStorage from 'vue-sessionstorage'

import loading from  './components/widget/loading'
import commonView from './components/common/install'

import * as utils from './assets/js/utils'
import * as constant from './assets/js/constant'
import * as validConst from './assets/js/validate'


Vue.config.productionTip = false

Vue.use(loading)
Vue.use(commonView)
Vue.use(VueSessionStorage)

Vue.prototype.$utils = utils
Vue.prototype.$constant = constant
Vue.prototype.$validConst = validConst

var bus = new Vue()
Vue.prototype.$bus = bus
/* eslint-disable no-new */
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
