import * as api from './api'

/**
 * 复杂对象的深度比较，可用于数组
 * @param {*} x
 * @param {*} y
 */
export function deepCompare(x, y) {
  var i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof(x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}


/**
 * ajax二进制读取
 */
export function readBuffer(res) {

  if (!res.headers['content-disposition']) {
    console.error("headers['content-disposition'] 不存在")
    alert('下载失败，请重试')
    return false
  }
  const fileName = getHeadersFName(res.headers['content-disposition'].split(';'))
  const blob = new Blob([res.data]);
  // 兼容ie createObjectURL
  if ('msSaveOrOpenBlob' in navigator) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
    return true
  }
  const a = document.createElement('a')
  const bUrl = window.URL.createObjectURL(blob)
  a.download = fileName
  a.href = bUrl
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a);

  // 获取文件名
  function getHeadersFName(conDspAttrs) {
    let fileName = '';
    conDspAttrs.forEach((item, index) => {
      let temp = item.split('=')
      if (temp.length > 1 && temp[0] === 'filename') {
        fileName = decodeURI(temp[1])
      }
    });
    return fileName
  }

  return true
}

/**
 * arrayBuffer 转 json
 */
export function arrayBufferToJson(arrayBuffer) {
  let data = arrayBuffer
  if (arrayBuffer.toString() == "[object ArrayBuffer]") {
    var uint8_msg = new Uint8Array(arrayBuffer);
    // 解码成字符串
    var decodedString = String.fromCharCode.apply(null, uint8_msg);
    // parse,转成json数据
    try {
      data = JSON.parse(decodedString);
    } catch (e) {
      data = decodedString
    }

  }
  return data
}

/**
 * cookie 失效拦截
 */
export function cookieInvalid(err, cb) {
  if (err && err.response && err.response.data) {
    var data = arrayBufferToJson(err.response.data)
    if (data.toString() === "[object Object]" && data.status == 500 && data.data && data.data.gw_code == 401) { // cookie 失效需要重新登录
      if (cb) {
        cb()
      }
      sessionStorage.clear()
      var url = process.env.R_HOST == 'pre' ? api.BASE_URL + '/_stage' : api.BASE_URL
      url = unescape(api.BASE_REDIRECT_URL + '/api/v1/login?redirectUrl=' + window.encodeURIComponent(url) + '&loginParam=brt');
      window.location.href = url
    }
  } else {
    console.log('-------cookieInvalid--------')
  }
}

// URl里面取得对应的key值
function getUrlKey(name, url) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null

}
