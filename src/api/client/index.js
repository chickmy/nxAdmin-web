import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getClientEbayAccounts (page, limit, where = {}) {
  return require.get('/api/client/index', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getClientEbayAccount (id) {
  if (id) {
    return require.get(`/api/client/index/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveClientEbayAccount (id, data) {
  if (id) {
    return require.put(`/api/client/index/${id}`, data)
  } else {
    return require.post('/api/client/index', data)
  }
}
