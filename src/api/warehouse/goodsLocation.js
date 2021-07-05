import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getGoodsLocations (page, limit, where = {}) {
  return require.get('/api/warehouse/goodsLocations', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getGoodsLocation (id) {
  if (id) {
    return require.get(`/api/warehouse/goodsLocations/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveGoodsLocation (id, data) {
  if (id) {
    return require.put(`/api/warehouse/goodsLocations/${id}`, data)
  } else {
    return require.post('/api/warehouse/goodsLocations', data)
  }
}

export function deleteGoodsLocation (id) {
  return require.delete(`/api/warehouse/goodsLocations/${id}`)
}

export function getGoodsLocationSelect () {
  return require.get('/api/warehouse/goodsLocations/select')
}
