'use strict'
//增加生产环境jenkisn打包配置
const HOST = process.argv[2] || 'prod';//prod生产，pre预发布
// 增加是否支持统计上报配置参数(1支持测试环境、2支持生产环境)
const reportMode = process.argv[3] ? process.argv[3] : '2'
console.log(HOST, reportMode)
module.exports = {
  NODE_ENV: '"production"',
  HOST: '"' + HOST + '"',
  R_MODE: '"' + reportMode + '"',//统计上报环境
}
