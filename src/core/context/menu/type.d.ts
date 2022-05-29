import { ToRefs } from 'vue'
import { AppContext } from '../type'

/**
 * 菜单组
 */
export interface MenuGroup<T> {
  /**
   * 唯一标识
   */
  id: string | number,

  /**
   * 菜单组名称
   */
  name: string,

  /**
   * 菜单项列表
   */
  items: MenuItem<T>[],

  /**
   * 当函数返回true时才显示
   */
  renderOn?: (element: T) => boolean
}

/**
 * 菜单项
 */
export interface MenuItem<T> {
  /**
   * 唯一标识
   */
  id: string | number,

  /**
   * 菜单标题
   */
  title: string,

  /**
   * 菜单图标
   */
  icon?: string,

  /**
   * 菜单转跳路由
   */
  route?: string,

  /**
   * 当函数返回true时才显示
   */
  renderOn?: (ctx: T) => boolean,

  /**
   * 菜单点击动作
   */
  action?: (ctx: T) => any
  [otherKey: string]: any
}

export interface AppMenu {
  backgroundImg: string,
  group: MenuGroup<ToRefs<AppContext>>[]
}
