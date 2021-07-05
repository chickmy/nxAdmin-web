import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getGoodsClassS (page, limit, where = {}) {
  return require.get('/api/warehouse/goodsClassS', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getGoodsClass (id) {
  if (id) {
    return require.get(`/api/warehouse/goodsClassS/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveGoodsClass (id, data) {
  if (id) {
    return require.put(`/api/warehouse/goodsClassS/${id}`, data)
  } else {
    return require.post('/api/warehouse/goodsClassS', data)
  }
}

export function deleteGoodsClass (id) {
  return require.delete(`/api/warehouse/goodsClassS/${id}`)
}

export function getGoodsClassSelect () {
  return require.get('/api/warehouse/goodsClassS/select')
}
