import { StringUtils } from '@/utils/StringUtils'
// const file = require('./file')
// const resource = require('./resource')
import file from './file'
import sys from './sys'
import user from './user'
import resource from './resource'
import SfcUtils from '@/utils/SfcUtils'
// const admin = require('./admin')
import breakpoint from './breakpoint'
import task from './task'
import collection from './collection'
// const server = require('./server')
// const share = require('./share')

const API = {
  user,
  sys,
  file,
  resource,
  breakpoint,
  task,
  collection,
  /**
   * 获取API URL的完整前缀。
   * 因为封装的API对象中URL是缺少公共前缀的，如果需要绕开通用的请求方法单独使用URL，则需要这个方法来补全前缀
   * @returns API URL的完整前缀
   */
  getDefaultPrefix() {
    return StringUtils.appendPath(location.origin ,SfcUtils.axios.defaults.baseURL || '')
  }
//     file: file,
//     resource: resource,
//     admin: admin,
//     breakpoint: breakpoint,
//     task: task,
//     server: server.server,
//     proxyServer: server.proxyServer,
//     share: share,
//     sys: sys,
//     getServer: server.getServer,
//     collection: collection
}

export default API

