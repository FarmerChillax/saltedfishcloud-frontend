import { AppContext } from './type'
import defaultMainMenu from './menu'
import { reactive, toRefs, ToRefs } from 'vue'
import { emptySession } from './session'
import { DefaultEventBus } from './EventBus'
import { SystemFeature } from '../model'

const defaultFeature: SystemFeature = {
  enableEmailReg: false,
  enableRegCode: false,
  extractArchiveType: ['zip'],
  archiveEncoding: 'gbk',
  archiveType: ['zip'],
  version: 'unknown',
  thumbType: ['jpg', 'bmp', 'gif', 'png', 'jpeg', 'webp'],
  breakpointUrl: '/api/breakpoint'
}

const context: ToRefs<AppContext> = toRefs(reactive({
  appTitle: '咸鱼云网盘',
  theme: 'default',
  originTheme: 'default',
  menu: {
    mainMenu: defaultMainMenu
  },
  defaultAvatar: '/api/static/defaultAvatar.png',
  session: emptySession,
  routeInfo: {},
  eventBus: new DefaultEventBus(),
  feature: defaultFeature
}))


export {
  context
}

export * from './menu/type'
export * from './type'