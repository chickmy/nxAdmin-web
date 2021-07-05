import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getEbayOreders (page, limit, where = {}) {
  return require.get('/api/ebay/ebayOrders', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function createShiping (id, location_id, value) {
  return require.post('/api/ebay/ebayOrders/createShiping', {
    params: {
      id_array: id,
      location_id: location_id,
      remarks: value,
    },
  })
}

export function loadOrder () {
  return require.get('/api/ebay/ebayOrders/loadOrder')
}

export function pushBlackList (data) {
  return require.post('/api/ebay/ebayOrders/pushBlackList', {
    params: {
      id_array: data,
    },
  })
}

export function getEbayOreder (id) {
  if (id) {
    return require.get(`/api/ebay/ebayOrders/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveEdit (id, data) {
  return require.post('/api/ebay/ebayOrders/saveOrderEx', data)
}

export function selectEx (id) {
  return require.get('/api/ebay/ebayOrders/select', {
    params: {
      id,
    },
  })
}

export function refund (data) {
  return require.post('/api/ebay/ebayOrders/refund', data)
}

export function ship (data) {
  return require.post('/api/ebay/ebayOrders/ship', data)
}
