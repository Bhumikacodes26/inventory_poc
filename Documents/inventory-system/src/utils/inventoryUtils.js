// Add up all changes for each product. Opening stock is also a transaction,
// so: Opening + Stock In - Stock Out + Adjustments is just the sum of changes.
export function buildStockMap(transactions) {
  const stockMap = {}
  transactions.forEach((transaction) => {
    stockMap[transaction.productId] =
      (stockMap[transaction.productId] || 0) + transaction.quantityChange
  })
  return stockMap
}

export function getStockStatus(availableStock, reorderLevel) {
  if (availableStock === 0) return 'Out of Stock'
  if (availableStock <= reorderLevel) return 'Low Stock'
  return 'In Stock'
}

export function getInventoryValue(availableStock, unitCost) {
  return availableStock * unitCost
}

export function getShortfall(reorderLevel, availableStock) {
  return Math.max(0, reorderLevel - availableStock)
}

// Give every product its calculated values.
export function buildProductsWithStock(products, transactions) {
  const stockMap = buildStockMap(transactions)

  return products.map((product) => {
    const availableStock = stockMap[product.id] || 0
    return {
      ...product,
      availableStock,
      stockStatus: getStockStatus(availableStock, product.reorderLevel),
      inventoryValue: getInventoryValue(availableStock, product.unitCost),
      shortfall: getShortfall(product.reorderLevel, availableStock),
    }
  })
}

// Make the next transaction id, for example TXN-0051.
export function generateTransactionId(transactions) {
  const highest = transactions.reduce((max, transaction) => {
    const number = parseInt(String(transaction.id).replace('TXN-', ''), 10)
    return Number.isNaN(number) ? max : Math.max(max, number)
  }, 0)
  return `TXN-${String(highest + 1).padStart(4, '0')}`
}