import { Session } from './session'
import { AppMenu, MenuGroup } from './menu/type'
import { RouteLocationNormalized, Router } from 'vue-router'
import { EventBus } from './EventBus'
import { FileInfo, FileListContext, SystemFeature } from '../model'

export interface RouteInfo {
  /**
   * 当前路由
   */
  curr?: RouteLocationNormalized,
  /**
   * 上一路由
   */
  prev?: RouteLocationNormalized,

  /**
   * 路由器
   */
  router?: Router
}

export interface ValidateErrorMessage {
  id: number,
  errorMessages: string
}

export interface ValidateResult {
  valid: boolean,
  errorMessages: ValidateErrorMessage[]
}

export interface AppFeature {
  enableRegCode: boolean,
  enableEmailReg: boolean,
  [otherKey: string]: any
}

export interface VisiableWindows {
  uploadList: boolean
  [otherKey: string]: boolean
}

/**
 * 文件打开处理器，也就是文件的打开方式
 */
export interface FileOpenHandler {
  /**
   * 标题 文件
   */
  title: string | (() => string)

  /**
   * 图标，可以是mdi图标或图片url
   */
  icon: string

  /**
   * 匹配器，返回true表示待打开的文件可以被该文件处理器处理
   */
  matcher: (ctx: FileListContext, files: FileInfo[]) => boolean

  /**
   * 排序，越小越靠前
   */
  sort: number

  /**
   * 唯一标识
   */
  id: string

  action: (ctx: FileListContext, files: FileInfo[]) => Promise<any> | void
}

/**
 * 全局上下文属性
 */
export interface AppContext {
  /**
   * 标题
   */
  appTitle: string,

  /**
   * 当前系统主题
   */
  theme: string,

  /**
   * 当前系统主题（原始，不受黑暗模式影响）
   */
  originTheme: string,

  /**
   * 菜单
   */
  menu: {
    /**
     * 用户界面主菜单
     */
    mainMenu: AppMenu,

    fileListMenu: MenuGroup<FileListContext>[]
  }

  /**
   * 默认头像src属性
   */
  defaultAvatar: string,

  /**
   * 用户会话属性
   */
  session: Session,

  /**
   * 事件总线
   */
  eventBus: EventBus,

  feature: SystemFeature,

  /**
   * 路由信息
   */
  routeInfo: RouteInfo,

  visiableWindows: VisiableWindows

  fileOpenHandler: FileOpenHandler[]
  [otherKey: string]: any
}
