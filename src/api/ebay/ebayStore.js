import require from '@/plugin/axios'

export function getEbayStores (page, limit, where = {}) {
  return require.get('/api/ebay/ebayStores', {
    params: {
      page,
      limit,
      ...where,
    },
  })
}

export function loadData (id, dev_id) {
  return require.get('/api/ebay/ebayStores/loadData', {
    params: {
      id,
      dev_id
    },
  })
}

export function optGoodsType (type, id) {
  return require.post('/api/ebay/ebayStores/optGoodsType', {
    type: type,
    id: id
  })
}

export function qtyOrPriceEdit (id, dev_id, item_id, qty, Price) {
  return require.post('/api/ebay/ebayStores/qtyOrPriceEdit', {
    id,
    dev_id,
    item_id,
    qty,
    Price
  })
}

export function getStoreSelect () {
  return require.get('/api/ebay/ebayStores/select')
}
