import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getdevStoreInfos (page, limit, where = {}) {
  return require.get('/api/dev/Store', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function deleteDevStoreInfos (id) {
  return require.delete(`/api/dev/Store/${id}`)
}
