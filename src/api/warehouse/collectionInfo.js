import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getEbayCollectionInfos (page, limit, where = {}) {
  return require.get('/api/warehouse/EbayCollectionInfo', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getEbayCollectionInfo (id) {
  if (id) {
    return require.get(`/api/warehouse/EbayCollectionInfo/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveEbayCollectionInfo (id, data) {
  if (id) {
    return require.put(`/api/warehouse/EbayCollectionInfo/${id}`, data)
  } else {
    return require.post('/api/warehouse/EbayCollectionInfo', data)
  }
}

export function deleteEbayCollectionInfos (id) {
  return require.delete(`/api/warehouse/EbayCollectionInfo/${id}`)
}
