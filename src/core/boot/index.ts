import API from '@/api'
import SfcUtils from '@/utils/SfcUtils'
import { reactive } from 'vue'
import { context } from '../context'
import { ConditionFunction } from '../helper/ConditionFunction'
import { extensionManager } from '../serivce/Extension'
import { bootContext } from './BootCore'

let isValidSessionSuccess = false

bootContext
  .addProcessor({
    taskName: '获取服务器信息',
    async execute() {
      const data = (await SfcUtils.request(API.sys.getFeature())).data
      context.feature.value = reactive(data)
    }
  })
  .addProcessor({
    taskName: '验证登录状态',
    async execute() {
      const session = context.session.value
      session.loadToken()
      try {
        if (ConditionFunction.hasLogin(context)) {
          const userInfo = ( await SfcUtils.request(API.user.getUserInfo())).data.data
          session.setUserInfo(userInfo)
          isValidSessionSuccess = true
        }
      } catch (err) {
        console.log('登录已过期')
        context.session.value.setToken('')
        return false
      }
    },
    onFinish() {
      if (isValidSessionSuccess) {
        SfcUtils.snackbar(`欢迎回来，${context.session.value.user.name}`, 1500, { showClose: false, outClose: true })
      }
    }
  })
  .addProcessor({
    taskName: '加载插件',
    async execute() {
      return await extensionManager.mountAll()
    }
  })
  .addProcessor({
    taskName: '清理',
    onFinish(app, handler) {
      handler.getBootInfoElement().remove()
    }
  })



const bootApp = () => {
  bootContext.start()
}

export default bootApp