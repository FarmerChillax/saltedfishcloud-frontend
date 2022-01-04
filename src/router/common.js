import PublicDisk from '../view/common/PublicDisk.vue'
import PrivateDisk from '../view/common/PrivateDisk'
import common from '../view/common'
import welcome from '../view/common/Welcome'

/**
 * @type {import('vue-router').RouteConfig}
 */
const routeOpt = {
    path: '/',
    component: common,
    children: [
        {
            path: '/',
            component: welcome
        },
        {
            path: 'public/*',
            name: 'PublicBrowser',
            component: PublicDisk
        },
        {
            path: 'public',
            name: 'PublicBrowser2',
            component: PublicDisk
        },
        {
            path: 'private',
            component: PrivateDisk,
            name: 'privateDisk'
        },
        {
            path: 'private/**',
            component: PrivateDisk,
            name: 'privateDisk2'
        },
        {
            path: 'login',
            component: require('../view/common/Login').default
        },
        {
            path: 'forgot',
            component: require('../view/common/Forgot').default
        },
        {
            path: 'my',
            component: require('../view/common/My').default,
            name: 'my'
        },
        {
            path: 'reg',
            component: require('../view/common/RegUser').default
        },
        {
            path: '/box',
            component: require('@/view/common/box').default
        },
        {
            path: '/box/collection',
            component: require('@/view/common/box/MyCollection').default
        },
        {
            path: '/box/share',
            component: require('@/view/common/box/MyShare').default
        }
    ]
}
export default routeOpt
