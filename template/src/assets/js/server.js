/**
 * Created by RoryHe on 2020/7/1.
 */
import axios from 'axios'
import * as api from './api'
import Vue from 'vue'
import {MessageBox, Message} from 'element-ui';

const request = (data, isShowLoading) => {

  if (!isShowLoading) isShowLoading = false
  if (isShowLoading) Vue.$loading.show({content:'加载中...'})


  axios.defaults.withCredentials = true
  return new Promise((resolve, reject) => {
    if (!data.data) {
      data.data = {}
    }
    var method = data.method
    var axiosInstance;
    switch (method) {
      case 'POST':
        axiosInstance = axios.post(data.url, data.data, {
          headers: {
            "Accept": "application/json, text/html, */*; charset=utf-8",
            "Content-Type": "application/json",
            "content-type": "application/json"
          },
          timeOut: data.timeout,
          withCredentials: true,
          validateStatus: (status) => {
            return status == 200
          },
          responseType: data.responseType ? data.responseType : "json",
        })
        break
      case 'GET':
        var timeOut = data.timeout
        var responseType = data.responseType ? data.responseType : "json"
        if (data.paramsType == 'JSON') {
          axios.defaults.headers.post['Content-Type'] = 'application/json'
          axios.defaults.headers.post['content-type'] = 'application/json'
        }
        axios.defaults.headers.post['Accept'] = 'application/json, text/html, */*; charset=utf-8'
        var axiosConfig = {
          url: data.url,
          method: method,
          responseType: responseType,
          timeout: timeOut,
          withCredentials: true,
          validateStatus: (status) => {
            return status == 200
          },
          data: data.paramsType == 'JSON' ? data.data : null,
          params: data.paramsType == 'urlParams' ? data.data : null
        }
        axiosInstance = axios.request(axiosConfig)
        break
    }

    //构造请求
    axiosInstance.then(res => {
      // console.log('axiosInstance res', res)
      if (isShowLoading) Vue.$loading.hide()
      // Vue.prototype.$bus.$emit('update-uploadIngCount', 1)
      //根据responseType来处理返回数据的实体对象范围
      if(!res.config.url.indexOf('disk')) {
        if(res.data.status && res.data.status != 200) {
          Message.info(res.data.data.msg)
        }
        if(res.data.code && res.data.code != 200) {
          Message.info(res.data.msg)
        }
      }
      if (data.responseType ) {
        switch (data.responseType) {
          case 'arraybuffer':
            return resolve(res)
            break
          default:
            return resolve(res.data)
        }
      } else if(res.data){
        return resolve(res.data)
      }else {
        return resolve(res)
      }
    }).catch((err) => {
      console.log('err', err)
      if (isShowLoading) Vue.$loading.hide()

      if (err && err.response && err.response.status && err.response.data) {
        if (err.response.status == 500 && err.response.data.data.gw_code == 401) {
          // console.log('err.response', err.response.data.data)
          // var url = window.location.href
          var url = '/'
          if(sessionStorage.getItem('channel') == 1) {
            // url = '/disk'
            let href = unescape(window.location.href)
            let index = href.lastIndexOf('/')
            href = href.substr(index+1)
            let index2 = href.lastIndexOf('?') == -1?href.length:href.lastIndexOf('?')
            href = href.substr(0, index2)
            let dialog = document.querySelector('.logout-message-box__wrapper')
            if (!dialog) { // http://172.18.19.132/index
              let text = '为了保护您的账号安全，请重新从<a href="//lspt.court.gov.cn/">人民法院律师服务平台</a>首页进入网盘'
              if(href == 'addToCase' ) {
                text = '登录失效，请重新打开弹窗进行授权'
              }

              MessageBox.confirm(text, {showClose:false, closeOnClickModal: false, beforeClose: function(action, instance, done) {}, showCancelButton: false, showConfirmButton: false, dangerouslyUseHTMLString: true, customClass: 'loginExpire', center: true, customClass:'logout-message-box__wrapper'})
                Vue.prototype.$bus.$emit('clear-uploadIngCount', 0)
                // window.location.href = '/signIn'

              // sessionStorage.removeItem('channel')
            }
          }else{

            url = unescape(api.BASE_REDIRECT_URL + '/api/v1/login?redirectUrl=' + window.encodeURIComponent(url) + '&loginParam=czt&ut=1');
            console.log('url', url)
            window.location.href = url
            // sessionStorage.removeItem('channel')
          }


        }
        if (err.response.status == 403) {
          Message.error("您没有对应的权限，请不要非法请求");
        }
        if(err.response.status == 400) {
          Message.info(err.response.data.msg);
        }
        if(!err.response.config.url.indexOf('disk')) {
          if(err.response.data.status && err.response.data.status != 200) {
            Message.info(err.response.data.data.msg)
          }
          if(err.response.data.code && err.response.data.code != 200) {
            Message.info(err.response.data.msg)
          }
        }
        return Promise.reject(err.response.data)
      } else {
        return Promise.reject(err ? err : '')
      }

    })
  })
}


export const apiGET = (url, data, isShowLoading, paramsType,responseType) => {
  return request({
    method: 'GET',
    url,
    data,
    paramsType: paramsType ? paramsType : 'urlParams',
    responseType: responseType,
    timeout: '10000',
  }, isShowLoading)
}

export const downLoadGET = (url, data, isShowLoading, paramsType, responseType, timeOut) => {
  return request({
    method: 'GET',
    url,
    data,
    paramsType: paramsType ? paramsType : 'urlParams',
    responseType: responseType,
    timeout: timeOut ? timeOut : '10000',
  }, isShowLoading)
}

export const apiPOST = (url, data, isShowLoading, paramsType) => {
  return request({
    method: 'POST',
    url,
    data,
    paramsType: paramsType ? paramsType : 'JSON',
    timeout: '10000',
  }, isShowLoading)
}
