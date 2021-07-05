import layoutHeaderAside from '@/layout/header-aside'
import fa from 'element-ui-eoi/src/locale/lang/fa'

const _import = require('@/libs/util.import')

export default {
  path: '/warehouse',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'goods',
      name: 'goods-index',
      component: _import('warehouse/goods-index'),
      meta: {
        title: '本地库存',
        cache: true,
        auth: 'warehouse.goods',
      },
    },
    {
      path: 'goodsClass',
      name: 'goods-class-index',
      component: _import('warehouse/goods-class-index'),
      meta: {
        title: '产品分类',
        cache: true,
        auth: 'warehouse.goodsclass',
      },
    },
    {
      path: 'goodsLocation',
      name: 'goods-location-index',
      component: _import('warehouse/goods-location-index'),
      meta: {
        title: '仓库位置',
        cache: true,
        auth: 'warehouse.goodslocation',
      },
    },
    {
      path: 'collectionInfoIndex',
      name: 'collection-info-index',
      component: _import('warehouse/collection-info-index'),
      meta: {
        title: '采集比价',
        cache: false,
        // auth: 'warehouse.collectionInfoIndex',
      },
    },

  ],
}
