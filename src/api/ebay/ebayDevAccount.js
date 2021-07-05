import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getEbayDevAccounts (page, limit, where = {}) {
  return require.get('/api/ebay/ebayDevAccounts', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getEbayDevAccount (id) {
  if (id) {
    return require.get(`/api/ebay/ebayDevAccounts/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveEbayDevAccount (id, data) {
  if (id) {
    return require.put(`/api/ebay/ebayDevAccounts/${id}`, data)
  } else {
    return require.post('/api/ebay/ebayDevAccounts', data)
  }
}

export function deleteebayDevAccount (id) {
  return require.delete(`/api/ebay/ebayDevAccounts/${id}`)
}

export function createAuthUrl (id) {
  return require.get('/api/ebay/ebayDevAccounts/createAuthUrl', {
    params: {
      id
    },
  })
}
