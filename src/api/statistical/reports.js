import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function getInfo (page, limit, where = {}) {
  return require.get('/api/statistical/reports/info')
}
