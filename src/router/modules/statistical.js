import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/statistical',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'ebayGoodsAnalyze',
      name: 'ebay-goods-analyze',
      component: _import('statistical/ebay-goods-analyze'),
      meta: {
        title: '商品分析',
        cache: false,
        auth: 'statistical.ebaygoodsanalyze',
      },
    }, {
      path: 'reportsIndex',
      name: 'reports-index',
      component: _import('statistical/reports-index'),
      meta: {
        title: '报告',
        cache: false,
        auth: 'statistical.reports',
      }
    },
  ],
}
