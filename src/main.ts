import { createApp, reactive } from 'vue'
import API from './api'
import App from './App.vue'
import { context } from './core/context'
import { ConditionFunction } from './core/helper/ConditionFunction'
import axios from './plugins/axios'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
import SfcUtils from './utils/SfcUtils'
import '@/styles/common.scss'

context.routeInfo.value.router = router
async function validSession() {

  const session = context.session.value
  session.loadToken()
  try {
    if (ConditionFunction.hasLogin(context)) {
      const userInfo = (await axios(API.user.getUserInfo())).data.data
      session.setUserInfo(userInfo)
      return true
    } else {
      return false
    }
  } catch (err) {
    console.log('登录已过期')
    context.session.value.setToken('')
    return false
  }
}

async function getFeature() {
  const feature = (await axios(API.sys.getFeature())).data
  context.feature.value = reactive(feature)
  console.log(feature)
}

validSession()
  .then(e => {
    if (e) {
      SfcUtils.snackbar(`欢迎回来，${context.session.value.user.name}`, 1500, { showClose: false })
    }
  })
  .then(() => getFeature())
  .catch(err => {
    SfcUtils.snackbar(err.toString())
  })
  .finally(() => {
    const app = createApp(App)
    app.use(router)
      .use(vuetify)
      .mount('#app')
    createApp(App)
  })
