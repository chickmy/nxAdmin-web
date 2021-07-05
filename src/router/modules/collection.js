import layoutHeaderAside from '@/layout/header-aside'

const _import = require('@/libs/util.import')

export default {
  path: '/collection',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'collectionIndex',
      name: 'collection-index',
      component: _import('collection/collection-index'),
      meta: {
        title: '商品采集',
        cache: true,
        auth: 'collection.index',
      },
    },
    {
      path: 'collectionBox',
      name: 'collection-box-index',
      component: _import('collection/collection-box-index'),
      meta: {
        title: '采集箱',
        cache: false,
        auth: 'collection.box',
      },
    },
  ],
}
