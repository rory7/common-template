/**
 * 请求进度条
 * Created by RoryHe on 2020/6/18.
 */
import Vue from 'vue'
import loading from './loading-dialog.vue'

const loadingConstructor = Vue.extend(loading);
let instance = new loadingConstructor({
  el: document.createElement('div')
})


const newLoading = {
  show(op){
    // console.log(instance.count, '++', op.url)
    if (instance.count == 0) {
      instance.visibile = true
      if (op) {
        instance.content = op.content
      }
      document.body.appendChild(instance.$el)
    }
    instance.count = instance.count + 1


  },
  isShow(){
    return instance.visibile
  },
  hide(op){
    // console.log(instance.count, '--', op.url)
    if (instance.count <= 0) {
      return
    }
    instance.count = instance.count - 1
    if (instance.count == 0) {
      instance.visibile = false
    }
  },
}

const install = function () {
  if (!Vue.$loading) {
    Vue.$loading = newLoading
  }
  Vue.mixin({
    created(){
      this.$loading = Vue.$loading
    }
  })
}

export default install
