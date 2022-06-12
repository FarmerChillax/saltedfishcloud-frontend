
import { ApiRequest } from '@/core/model'
// import selectFile from './file/fileSelector'
// import previewImage from './preview/previewImage'
import { snackbar } from './common/SnackBar'
import axios from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import * as dialog from './common/Dialog'
const SfcUtils = {
  snackbar,
  /**
   * 原始默认预设配置的axios对象
   */
  axios,

  batchInvokeFunction(funcs: Function[] | Function,...params: any[]): any[] {
    
    const ret = []
    if (funcs instanceof Function) {
      try {
        ret.push(funcs(...params))
      } catch(err) {
        console.log(err)
        ret.push(undefined)
      }
      
    } else {
      funcs.forEach(fun => {
        try {
          ret.push(fun(...params))
        } catch(err) {
          console.log(err)
          ret.push(undefined)
        }
      })
    }
    return ret
  },
  
  /**
   * 发起API请求
   * @param request API请求参数
   * @returns Axios响应对象
   */
  async request <T>(request: ApiRequest<T>): Promise<AxiosResponse<T, any>> {
    
    return await axios(request)
  },
  ...dialog
}

export default SfcUtils
export {
  SfcUtils
}