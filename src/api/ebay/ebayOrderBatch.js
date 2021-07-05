import require from '@/plugin/axios'

export function getBatchs (page, limit, where = {}) {
  return require.get('/api/ebay/ebayOrderBatchS', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function getCompleteOrders (page, limit, where = {}) {
  return require.get('/api/ebay/ebayOrderBatchS/getCompleteOrder', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function printLabel (batch_id) {
  return require.get('/api/ebay/ebayOrderBatchS/printLabel', {
    params: {
      batch_id
    },
  })
}

export function viewlabel (shipment_id) {
  return require.get('/api/ebay/ebayOrderBatchS/viewlabel', {
    params: {
      shipment_id
    },
  })
}

export function refund (shipment_id) {
  return require.get('/api/ebay/ebayOrderBatchS/refund', {
    params: {
      shipment_id
    },
  })
}

export function payBatch (batch_id) {
  return require.get('/api/ebay/ebayOrderBatchS/buy', {
    params: {
      batch_id
    },
  })
}

export function lunxun (batch_id) {
  return require.get('/api/ebay/ebayOrderBatchS/lunxun', {
    params: {
      batch_id
    },
  })
}

