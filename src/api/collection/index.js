import require from '@/plugin/axios'

export function add (data) {
  return require.post('/api.collection.index/add', {
    data
  })
}
