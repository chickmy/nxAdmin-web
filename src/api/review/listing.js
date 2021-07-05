import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getReviewListingS (page, limit, where = {}) {
  return require.get('/api/review/listing', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function pass (id) {
  return require.get('/api/review/listing/pass', {
    params: {
      id
    }
  })
}

export function reject (id, msg) {
  return require.post('/api/review/listing/reject', {
    id,
    msg
  })
}
