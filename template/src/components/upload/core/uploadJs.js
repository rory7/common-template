/**
 * Created by RoryHe on 2021/2/22.
 * 通用上传JS模块，使用XMLHttpRequest处理上传任务,后续会支持多个版本
 * 1.目前支持版本:
 *   1)putObject
 *   2)postObject
 * 2.支持上传平台:
 *  1）阿里云OSS
 * 3.注意事项:
 *
 */
import * as constant from './uploadConstant'
import axios from 'axios'

class JiuLawUpload {

  constructor(op) {
    if (!op) {
      op = {}
    }
    /**
     * 上传平台，当前只支持阿里云，所以默认不需要定义
     * aliyun: 阿里云OSS对象上传平台
     */
    this.platform_ = op.platform && op.platform != '' ? op.platform : constant.plat_aliyun
    this.serverName_ = op.serverName && op.serverName != '' ? op.serverName : 'ept-service-file'
    this.urlVersion_ = op.urlVersion && op.urlVersion != '' ? op.urlVersion : '/api/v1'
    this.preUrl_ = op.preUrl && op.preUrl != '' ? op.preUrl : constant.BASE_URL + '/' + this.serverName_ + this.urlVersion_ + constant.GET_UPLOAD_PARAMS
    this.preTimeOut_ = op.preTimeOut && op.preTimeOut != 0 ? op.preTimeOut : 10 * 1000
    this.timeout_ = op.timeout && op.timeout != 0 ? op.timeout : 5 * 60 * 1000
    this.constant_ = constant
    this.reqSource_ = axios.CancelToken.source()

    //上传队列相关处理
    this.uploadFileQuene = []
    this.waitFielQuene = []
  }


  /**
   * 直传
   * @param uploadType
   * @param params
   * @param callback
   * @param callProgress
   */
  upload(uploadType, params, callback, callProgress) {
    switch (this.platform_) {
      case constant.plat_aliyun:
        //paserParams
        this.upload_aliyun(uploadType, params, callback, callProgress)
        break
      default://阿里云

        break
    }
  }

  /**
   *
   * @param uploadType
   * @param params={
   *    classType: params.classType,
      fileName: params.fileName,
      rootPath: params.rootPath,
      file:params.file
   * }
   * @param callback
   */
  upload_aliyun(uploadType, params, callback, progressCall) {
    let key = 'upload-' + getGuid()
    let data = {
      classType: params.classType,
      fileName: params.fileName,
      rootPath: params.rootPath,
    }

    let requestInstance = {
      key,
      uploadType,
      params,
      callback,
      progressCall,
      data,
    }

    let transData = {
      fileId: '',
      storageId: '',
      storageName: '',
      fileName: data.fileName,
      key: key,
    }

    console.log('transData', params.transData)
    // if (params.transData) {
    //   Object.keys(params.transData).forEach((key) => {
    //     transData[key] = params.transData[key]
    //   })
    // }

    megreJson(params.transData, transData)

    createCallProgress(progressCall, 0, transData)
    if (this.uploadFileQuene.length < 5) {
      this.uploadFileQuene.push(requestInstance)
      this.uploadPre(
        data,
        transData,
        params,
        progressCall,
        callback,
        (key) => {
          //处理队列
          for (var instanceIdx = 0; instanceIdx < this.uploadFileQuene.length; instanceIdx++) {
            let reqInstance = this.uploadFileQuene[instanceIdx]
            if (reqInstance.key == key) {
              console.log('quene', key, reqInstance.key, instanceIdx, this.uploadFileQuene)
              this.uploadFileQuene.splice(instanceIdx, 1)
              if (this.waitFielQuene.length > 0) {
                let waitInstance = this.waitFielQuene[0]
                this.upload_aliyun(
                  waitInstance.uploadType,
                  waitInstance.params,
                  waitInstance.callback,
                  waitInstance.progressCall)
                this.waitFielQuene.splice(0, 1)
              }
              break
            }
          }
        }, key);
    } else {
      this.waitFielQuene.push(requestInstance)
    }
  }

  uploadPre(data, transData, params, progressCall, callback, nextCall, key) {
//获取直传参数
    axios.post(this.preUrl_, data, {
      headers: {
        "Accept": "application/json, text/html, */*; charset=utf-8",
        "Content-Type": "application/json",
        "content-type": "application/json"
      },
      timeOut: this.preTimeOut_,
      withCredentials: true,
      cancelToken: this.reqSource_ ? this.reqSource_.token : null,
      validateStatus: (status) => {
        return status == 200
      },
      responseType: data.responseType ? data.responseType : "json",
    }).then(response => {
      let res = response.data
      let code = res && res.code ? res.code : res.status //兼容brt项目相关出现的code场景
      console.log('pre', res)
      if (code == 200 && res.data) {
        let data = res.data
        let preData = {
          formFields: data.formFields,
          uploadUrl: data.uploadUrl,
        }

        transData.fileId = data.fileId
        transData.storageId = data.storageId
        transData.storageName = data.storageName
        console.log('params', preData, transData)
        //开启oss直传
        this.baseUpload(
          preData.formFields,
          transData,
          params.file,
          preData.uploadUrl,
          progressCall,
          callback,
          nextCall,
          key
        )
      } else {
        let resData = {
          req: res ? res.data : null,
          msg: res && res.msg ? res.msg : '预上传失败',
        }
        megreJson(transData, resData)
        if (nextCall) nextCall(key)
        createCallBack(callback, constant.RepCode_FAIL, '创建上传资源失败1', resData)
        console.log('JiuLawUpload::upload_aliyun::RepCode_NOT_SUPPORT::xmlRequest=null',
          'UA=\n' + navigator.userAgent.toLowerCase(), resData)
      }
    }).catch((err) => {
      let resp = err.response
      let msg = resp && resp.data && resp.data.msg ? resp.data.msg : '预上传发生错误'
      let resData = {
        err: err ? err : null,
        msg: msg
      }
      megreJson(transData, resData)
      if (nextCall) nextCall(key)
      createCallBack(callback, constant.RepCode_FAIL, '创建上传资源失败2', resData)
      console.log('JiuLawUpload::upload_aliyun::RepCode_NOT_SUPPORT::xmlRequest=null',
        'UA=\n' + navigator.userAgent.toLowerCase(), resData)
    })
  }


  /**
   * 取消队列内的上传请求
   */
  abort() {
    if (this.reqSource_ != null) {
      this.reqSource_.cancel('取消请求')
    }
  }

  /**
   * 获取当前页面上传队列的状态
   * @return boolean true:正在执行上传／false:已经完成所有上传
   */
  status() {
    if (this.uploadFileQuene && this.waitFielQuene) {
      return this.uploadFileQuene + this.waitFielQuene == 0
    } else {
      return true
    }
  }

  /**
   *
   * @param classType
   * @param rootPath
   * @param file 文件
   * @param errCall  错误回调
   * @param transData 透传参数，以key=value方式返回（不是transData.key=value）
   * @return {*}
   */
  createUploadParams(classType, file, errCall, transData,rootPath) {
    if (file == null) {
      errCall ? errCall() : null
      return {}
    } else {
      let params = {
        classType,
        rootPath,
        file,
        fileName: file && file.name ? file.name : '',
        transData: transData,
      }
      return params
    }
  }

  /**
   * 真实上传请求
   */
  baseUpload(uploadFromData, transParams, file, uploadUrl, progress, compelete, nextCall, key) {
    // console.log(uploadFromData, transParams, file, uploadUrl, progress, compelete)

    let params = new FormData()
    let resData = {}
    // if (transParams) {
    //   Object.keys(transParams).forEach((key) => {
    //     resData[key] = transParams[key]
    //   })
    // }

    megreJson(transParams, resData)

    if (uploadFromData && uploadUrl) {
      let headerData = {'Content-Type': 'multipart/form-data'}
      Object.keys(uploadFromData).forEach((key) => {
        params.append(key, uploadFromData[key])
      })
      params.append('file', file)

      console.log('headerData', headerData)

      axios.defaults.withCredentials = true;
      let config = {
        cancelToken: this.reqSource_ ? this.reqSource_.token : null,
        headers: headerData,
        timeout: this.timeout_,
        onUploadProgress: progressEvent => {
          var loading = (progressEvent.loaded / progressEvent.total * 100 | 0)
          createCallProgress(progress, loading, transParams)
          console.log('onUploadProgress', loading, file.name)
        },
        withCredentials: true,
      }

      console.log('baseUpload-config', config)
      axios.post(uploadUrl, params, config).then(response => {
        console.log('baseUpload', response)
        if (nextCall) nextCall(key)
        let res = response.data
        let code = res && res.code ? res.code : res.status //兼容brt项目相关出现的code场景
        if (code == 200 && res.data) {
          // let data = res.data.data
          //扩充resData
          createCallBack(compelete, constant.RepCode_SUCCESS, '上传成功', resData)
        } else {
          createCallBack(compelete, constant.RepCode_FAIL, '上传失败', resData)
        }
      }).catch((err) => {
        if (nextCall) nextCall(key)
        resData.err = err
        createCallBack(compelete, constant.RepCode_FAIL, '上传失败', resData)
      })
    } else {
      if (nextCall) nextCall(key)
      //返回参数不对
      createCallBack(compelete, constant.RepCode_FAIL, '上传失败', resData)
    }

  }
}
export default JiuLawUpload

let createCallBack = (callBack, code, msg, data) => {
  if (callBack) {
    let residualCount = getResidualCount()
    callBack({
      code,
      msg,
      data,
      residualCount,
    })
  }
}

let createCallProgress = (progress, rate, data) => {
  if (progress) {
    let residualCount = getResidualCount()
    progress({
      rate,
      data,
      residualCount,
    })
  }
}

let getResidualCount = (uploadQuene, waitQuene) => {
  try {
    return Number(uploadQuene) + Number(waitQuene)
  } catch (err) {
    console.error('getResidualCount', err)
    return 0
  }
}


let getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let megreJson = (obj, megreObj) => {
  if (obj) {
    Object.keys(obj).forEach((key) => {
      megreObj[key] = obj[key]
    })
  }
}





