/**
 * Created by RoryHe on 2020/7/10.
 */
const validConst = {
  phone: (value) => {
    return /^1[3456789]\d{9}$/.test(value)
  },
  email: (value) => {
    return /.*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{0,9}([\.][a-z]{0,9})?$/.test(value)
  },
  idCard: (value) => { // 11010 832 05 01 492
    let reg15 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
    let reg18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$/;
    // return /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(value)
    return reg15.test(value) || reg18.test(value)
  },
  isEmpty: (value) => {
    if (value == null || value == "" || value == undefined) {
      return false
    }
    else {
      return true
    }
  },

  legalStrValid: /[`\\\*<>?:："？\|\t\v\n\s+]/g,
  /**
   * 合法字符串校验，目前用于上传文件名、表单文本填写
   * @param value
   */
  legalStr: (value) => {
    if (value == null || value == "" || value == undefined) {
      return false
    }
    if (validConst.legalStrValid.test(value)) {
      console.log(value, false)
      validConst.legalStrValid.lastIndex = 0
      return false
    } else {
      console.log(value, true)
      return true
    }
  },

}
export default validConst
