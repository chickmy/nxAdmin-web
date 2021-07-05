import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/dev',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'productIndex',
      name: 'product-index',
      component: _import('dev/product-index'),
      meta: {
        title: '产品开发',
        cache: true,
        // auth: 'product.index',
      },
    },
    {
      path: 'storeIndex',
      name: 'store-index',
      component: _import('dev/store-index'),
      meta: {
        title: '店铺开发',
        cache: false,
        // auth: 'store.index',
      },
    },
    {
      path: 'productHistory',
      name: 'product-history',
      component: _import('dev/product-history'),
      meta: {
        title: '历史记录',
        cache: false,
        // auth: 'store.index',
      },
    },
  ],
}
