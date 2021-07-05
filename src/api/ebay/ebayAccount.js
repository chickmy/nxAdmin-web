import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getEbayAccounts (page, limit, where = {}) {
  return require.get('/api/ebay/ebayAccounts', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getEbayAccount (id) {
  if (id) {
    return require.get(`/api/ebay/ebayAccounts/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveEbayAccount (id, data) {
  if (id) {
    return require.put(`/api/ebay/ebayAccounts/${id}`, data)
  } else {
    return require.post('/api/ebay/ebayAccounts', data)
  }
}

export function deleteEbayAccount (id) {
  return require.delete(`/api/ebay/ebayAccounts/${id}`)
}

export function getAdminUserSelect () {
  return require.get('/api/admin/users/select')
}

export function getClientSelect (id, type) {
  return require.get('/api/ebay/ebayAccounts/clientSelect', {
    params: {
      id,
      type
    }
  })
}

export function saveClientSelect (id, data, type, checked) {
  return require.post('/api/ebay/ebayAccounts/saveClientSelect', {
    params: {
      client_id: id,
      ebay_ids: data,
      type: type,
      checked: checked,
    }
  })
}
