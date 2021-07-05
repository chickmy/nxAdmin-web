import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/ebay',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'ebayDevAccount',
      name: 'ebay-dev-account-index',
      component: _import('ebay/ebay-dev-account-index'),
      meta: {
        title: 'Ebay开发者管理',
        cache: true,
        auth: 'ebay.ebayDevAccount',
      },
    }, {
      path: 'ebayAccount',
      name: 'ebay-account-index',
      component: _import('ebay/ebay-account-index'),
      meta: {
        title: 'ebay账号管理',
        cache: true,
        auth: 'ebay.ebayAccount',
      },
    },
    {
      path: 'ebayStore',
      name: 'ebay-store-index',
      component: _import('ebay/ebay-store-index'),
      meta: {
        title: '商店管理',
        cache: false,
        auth: 'ebay.ebayStore',
      },
    },
    {
      path: 'ebayWaiter',
      name: 'ebay-waiter-index',
      component: _import('ebay/ebay-waiter-index'),
      meta: {
        title: '客务服务',
        cache: false,
        auth: 'ebay.ebayWaiter',
      }
    },
    {
      path: 'ebayOrder',
      name: 'ebay-order-index',
      component: _import('ebay/ebay-order-index'),
      meta: {
        title: '订单管理',
        cache: false,
        auth: 'ebay.ebayOrder',
      }
    },
    {
      path: 'ebayOrderBatch',
      name: 'ebay-order-index',
      component: _import('ebay/ebay-order-batch-index'),
      meta: {
        title: '发货批次',
        cache: false,
        auth: 'ebay.ebayOrderBatch',
      }
    },
    {
      path: 'ebayCompleteOrder',
      name: 'ebay-complete-order',
      component: _import('ebay/ebay-complete-order'),
      meta: {
        title: '完成订单',
        cache: false,
        auth: 'ebay.ebayOrderBatch',
      }
    },
  ],
}
