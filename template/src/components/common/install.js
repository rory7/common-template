/**
 * Created by RoryHe on 2020/10/9.
 */
import Vue from 'vue'
//动态化组件，报错这里不要管，不要格式化！！！
const header =()=> import('./com-header.vue')




const commonView = {
  install: () => {
    Vue.component('com-header', header)
  }
}
export default commonView
