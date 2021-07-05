import layoutHeaderAside from '@/layout/header-aside'
import admin from './modules/admin'
import ebay from './modules/ebay'
import warehoise from './modules/warehouse'
import statistical from './modules/statistical'
import collection from '@/router/modules/collection'
import client from '@/router/modules/client'
import review from '@/router/modules/review'
import dev from '@/router/modules/dev'

const _import = require('@/libs/util.import')

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true,
        },
        component: _import('system/index'),
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true,
        },
        component: _import('system/log'),
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh'),
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect'),
      },
    ],
  },
  admin,
  ebay,
  warehoise,
  statistical,
  collection,
  client,
  review,
  dev
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
