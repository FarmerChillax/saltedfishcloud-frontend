/**
 * 基础文件信息 
 * @typedef {Object} BaseFileInfo
 * @property {String}   name    -   文件名
 * @property {String}   type    -   文件类型 dir或file
 */
/**
 * @typedef {Object}    DropItemInfo
 * @property {FileList|DataTransferItemList}   files               -   文件对象列表
 * @property {String[]}   path              -   路径数组
 * @property {BaseFileInfo}   target        -   被拖动到的对象属性
 */

 /**
  * @typedef {Object} FileInfo
  * @property {String}   name    -   文件名
  * @property {String}   type    -   文件类型 dir或file
  * @property {String[]} path    -   文件所在路径
  */
module.exports = {}