import require from '@/plugin/axios'
import { promiseResolveFalse } from '@/libs/util.common'

export function getBoxs (page, limit, where) {
  return require.get('/api/collection/boxs', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getBox (id) {
  if (id) {
    return require.get(`/api/collection/boxs/${id}`)
  } else {
    return promiseResolveFalse()
  }
}

export function saveBox (id, data) {
  return require.put(`/api/collection/boxs/${id}`, data)
}

export function deleteBox (id) {
  return require.delete(`/api/collection/boxs/${id}`)
}

export function createltem (id, store_id, location_id, isFree, handle_time, shipPrice, shipService, ret_time) {
  return require.post('/api/collection/boxs/createltem', {
    id,
    store_id,
    location_id,
    isFree,
    handle_time,
    shipPrice,
    shipService,
    ret_time
  })
}

export function getLtemHistory (id) {
  return require.get('/api/collection/boxs/getLtemHistory', {
    params: {
      id
    }
  })
}
