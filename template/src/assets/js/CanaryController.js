/**
 * Created by RoryHe on 2021/5/26.
 * 灰度控制单元(当前写死到客户端本地处理灰度策略)
 */
class CanaryController {
  get isInit() {
    return this._isInit;
  }

  set isInit(value) {
    this._isInit = value;
  }

  set tagId(value) {
    this._tagId = value;
  }

  set isCanary(value) {
    this._isCanary = value;
  }

  get isCanary() {
    return this._isCanary;
  }

  get tagId() {
    return this._tagId;
  }

  constructor(funcRule, tagId) {
    this._isCanary = false
    this._isInit = false
    this._tagId = tagId ? tagId : ''
    this.init(funcRule, tagId)
  }

  getCanary() {
    return this._isInit ? this._isCanary : ''
  }

  /**
   *
   * @param funcRule  灰度策略控制方法(需要return一个bool来控制灰度策略)
   */
  init(funcRule, tag) {
    if (funcRule) {
      this._isCanary = funcRule()
      this._isInit = true
      console.log('CanaryController', this._isCanary)
    }

    if (tag) {
      this._tagId = tag
    }
  }

}

export default  CanaryController

