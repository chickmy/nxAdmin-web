import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getdevProductInfos (page, limit, where = {}, sort = '') {
  return require.get('/api/dev/Product', {
    params: {
      page,
      limit,
      ...where,
      sort: sort
    },
  })
}

export function getDevProductInfo (id) {
  if (id) {
    return require.get(`/api/dev/Product/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveDevProductInfo (id, data) {
  if (id) {
    return require.put(`/api/dev/Product/${id}`, data)
  } else {
    return require.post('/api/dev/Product', data)
  }
}

export function deleteDevProductInfos (id) {
  return require.delete(`/api/dev/Product/${id}`)
}

export function importProductId (data) {
  return require.post('/api/dev/Product/import', data)
}

export function getProductExData (id = 0) {
  return require.get('/api/dev/Product/getProductExData', { params: { id: id } })
}

export function attention (id) {
  return require.get('/api/dev/Product/attention', { params: { id: id } })
}

export function getExData (page, limit, where = {}) {
  return require.get('/api/dev/Product/getExData', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}
