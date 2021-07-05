import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getAnlyzeData (page, limit, where = {}) {
  return require.get('/api/statistical/EbayGoodsAnalyze', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function sendFuturePrice (goods_id, price) {
  return require.post('/api/statistical/EbayGoodsAnalyze/sendFuturePrice', {
    goods_id,
    price
  })
}
