import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//注册router页面规则
/***
 * 1.除首页和三方调用页面外，其他页面均以动态注册的方式注册，
 * 如const A=()=>import('@/...')
 * 或
   children: [
   {
       path: '',
       name: '',
       component: (resolve) => require(['@/..'], resolve)
   },]
 *
 * 2.routes的元素，必须以模块为单位，其内部页面为模块的children[]
 * 3.尽量不要定义参数在routers,除非外部调用或者需要路由直接使用
 ****/
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
