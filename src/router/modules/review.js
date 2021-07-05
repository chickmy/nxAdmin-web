import layoutHeaderAside from '@/layout/header-aside'
import fa from 'element-ui-eoi/src/locale/lang/fa'

const _import = require('@/libs/util.import')

export default {
  path: '/review',
  // redirect: { name: 'AdminUsers' },
  component: layoutHeaderAside,
  children: [
    {
      path: 'reviewListing',
      name: 'review-listing-index',
      component: _import('review/review-listing-index'),
      meta: {
        title: '上架审核',
        cache: false,
        auth: 'review.listing',
      },
    },
  ],
}
