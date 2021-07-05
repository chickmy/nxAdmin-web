import layoutHeaderAside from '@/layout/header-aside'
import fa from 'element-ui-eoi/src/locale/lang/fa'

const _import = require('@/libs/util.import')

export default {
  path: '/client',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'clientIndex',
      name: 'client-index',
      component: _import('client/client-index'),
      meta: {
        title: '客户信息',
        cache: false,
        auth: 'client.index',
      },
    },
  ],
}
