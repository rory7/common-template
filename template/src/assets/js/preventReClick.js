/**
 * Created by RoryHe on 2020/3/5.
 */
import Vue from 'vue'
//防止多次点击
const preventReClick = Vue.directive('preventReClick', {
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000)
      }
    })
  }
});
export {preventReClick}
