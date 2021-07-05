import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getGoodsS (page, limit, where = {}) {
  return require.get('/api/warehouse/goods', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getGoods (id) {
  if (id) {
    return require.get(`/api/warehouse/goods/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveGoods (id, data) {
  if (id) {
    return require.put(`/api/warehouse/goods/${id}`, data)
  } else {
    return require.post('/api/warehouse/goods', data)
  }
}

export function deleteGoods (id) {
  return require.delete(`/api/warehouse/goods/${id}`)
}

export function importGoods (data) {
  return require.post('/api/warehouse/goods/import', data)
}

export function importGoodsEbaySku (data) {
  return require.post('/api/warehouse/goods/importEbaySku', data)
}

export function getGoodsSelect () {
  return require.get('/api/warehouse/goods/select')
}

export function getStoreInfo (id) {
  return require.get('/api/warehouse/goods/getStoreInfo', {
    params: {
      id,
    },
  })
}

export function getEbaycollectionInfoEx (id) {
  return require.get('/api/warehouse/goods/getEbaycollectionInfoEx', {
    params: {
      id,
    },
  })
}

export function addEbaySku (id) {
  return require.get('/api/warehouse/goods/addEbaySku', {
    params: {
      id,
    },
  })
}
