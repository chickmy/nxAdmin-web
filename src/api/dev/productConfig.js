import require from '@/plugin/axios'
import { promiseResolveFalse } from "@/libs/util.common"

export function addConfig (data) {
  return require.post('/api/dev/ProductConfig/addConfig', data)
}

export function getConfig (data) {
  return require.get('/api/dev/ProductConfig/getConfig', data)
}
