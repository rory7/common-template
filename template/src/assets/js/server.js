/**
 * Created by RoryHe on 2020/7/1.
 */
import axios from 'axios'
import * as api from './api'
import Vue from 'vue'
import {MessageBox, Message} from 'element-ui';

const request = (data, isShowLoading) => {

  if (!isShowLoading) isShowLoading = false
  if (isShowLoading) Vue.$loading.show({content: '加载中...'})


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
      if (isShowLoading) Vue.$loading.hide()
      if (data.responseType) {
        switch (data.responseType) {
          case 'arraybuffer':
            return resolve(res)
            break
          default:
            return resolve(res.data)
        }
      } else if (res.data) {
        return resolve(res.data)
      } else {
        return resolve(res)
      }
    }).catch((err) => {
      console.log('err', err)
      if (isShowLoading) Vue.$loading.hide()

      if (err && err.response && err.response.status && err.response.data) {
        if (err.response.status == 500 && err.response.data.data.gw_code == 401) {
          var url = unescape(api.BASE_REDIRECT_URL + '/api/v1/login?redirectUrl=' + window.encodeURIComponent(url))
          // console.log('url', url)
          window.location.href = url
        }

        if (err.response.status == 403) {
          Message.error("您没有对应的权限，请不要非法请求");
        }

        return Promise.reject(err.response.data)
      } else {
        return Promise.reject(err ? err : '')
      }

    })
  })
}


export const apiGET = (url, data, isShowLoading, paramsType, responseType) => {
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
