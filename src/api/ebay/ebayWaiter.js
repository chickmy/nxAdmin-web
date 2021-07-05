import require from '@/plugin/axios'

export function getMessages (page, limit, where = {}) {
  return require.get('/api/ebay/ebayWaiters', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getUserMsg (message_id) {
  return require.post('/api/ebay/ebayWaiters/getUserMsg', {
    params: {
      message_id,
    },
  })
}

export function replyMsg (message_id, body) {
  return require.post('/api/ebay/ebayWaiters/replyMsg', {
    params: {
      message_id,
      body
    },
  })
}
