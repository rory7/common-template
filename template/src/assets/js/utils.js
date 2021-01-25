/**
 * Created by RoryHe on 2020/7/7.
 * 工具类
 */

/**
 * 获取字符串的哈希值
 * @param {String} str
 * @param {Boolean} caseSensitive
 * @return {Number} hashCode
 */
export const hash = (str, caseSensitive) => {
  if (!caseSensitive) {
    str = str.toLowerCase();
  }
  // 1315423911=b'1001110011001111100011010100111'
  var hash = 1315423911, i, ch;
  for (i = str.length - 1; i >= 0; i--) {
    ch = str.charCodeAt(i);
    hash ^= ((hash << 5) + ch + (hash >> 2));
  }
  return (hash & 0x7FFFFFFF);
}
/**
 * get-guid
 **/
export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//金额格式化展示
export const amount_format_show = (str) => {
  if (!str || str == '') str = '0.00'
  if (str.indexOf('.') != -1) {
    var spStr = str.split('.')
    if (spStr.length == 2 && spStr[1].length > 2) {
      str = spStr[0] + '.' + spStr[1].substring(0, 2)
    }
  }
  return money_format(str)
}


//取消下方对应金额格式化
export const re_money_format = (number) => {
  number = String(number)
  return parseFloat(number.replace(/[^\d\.-]/g, "")).toFixed(2)
}

//小数变分数（元-》分）
export const value_to_points = (number) => {
  var m = String(number)
  if (m.indexOf('.') != -1) {
    var r = m.split('.')[0] + m.split('.')[1]
    return Number(r)
  } else {
    return Number(m)
  }
}

//金额格式化
export const money_format = (number) => {
  return number_format(number, 2, '.', ',')
}

//通用格式化
/*
 　　 * 参数说明：
 　　 * number：要格式化的数字
 　　 * decimals：保留几位小数
 　　 * dec_point：小数点符号
 　　 * thousands_sep：千分位符号
 　　 * */
export const number_format = (number, decimals, kdec_point, thousands_sep) => {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k;
      k = n.toFixed(prec)
      return k + '';
      // var k = Math.pow(10, prec);
      // // var k = prec
      // return '' + Math.ceil(n * k) / k;
    };

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}


/**
 * 比较对象是否一样（包括value）
 */
export const objDefEquire = (a, b) => {
  if (a && b) {
    for (var key in a) {
      if (b.hasOwnProperty(key)) {
        if (b[key] != a[key] && key != 'dftId') {
          return {key: key, result: false}
        }
      } else {
        return {key: key, result: false}
      }
    }
    return {key: '', result: true}
  } else {
    console.log('throw-error', '')
    return {key: 'throw-error', result: false}
  }
}

/**
 * 禁用Backspace网页退回
 */
export const disabledBackSpace = () => {
  return (function () {
    window.history.forward(1);
    history.pushState(null, null, document.URL);
    if (window.history && window.history.pushState) {
      $(window).on('popstate', function () {
        // window.history.pushState('forward', null, '');
        window.history.forward(1);
      });
    }
    //
    // window.history.pushState('forward', null, '');
    window.history.forward(1);
  })()
}


/**
 * 根据value获取key
 * @param obj
 * @param value
 * @param compare
 * @return {*}
 */
export const findObjKey = (obj, value, compare = (a, b) => a === b) => {
  return Object.keys(obj).find(k => compare(obj[k], value))
}


/**
 * 判断空
 * @param {*} str
 */
export function isEmpty(str) {
  return str ? str : ""
}


export const fileDateFormat = (date) => {
  if (!date)return '-'
  if (date == '-' || date == '')return '-'
  var dateTime = new Date()
  dateTime.setTime(date)
  var Y = dateTime.getFullYear();
  var M = dateTime.getMonth() + 1;
  M = M < 10 ? '0' + M : M;// 不够两位补充0
  var D = dateTime.getDate();
  D = D < 10 ? '0' + D : D;
  var H = dateTime.getHours();
  H = H < 10 ? '0' + H : H;
  var Mi = dateTime.getMinutes();
  Mi = Mi < 10 ? '0' + Mi : Mi;
  // var S = Date.getSeconds();
  // S = S < 10 ? '0' + S : S;
  return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi;
}
