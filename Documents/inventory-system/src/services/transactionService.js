import { loadList, saveList, STORAGE_KEYS } from './storageService'
import { buildStockMap, generateTransactionId } from '../utils/inventoryUtils'

const POSITIVE_INTEGER = /^[1-9]\d*$/
const WHOLE_NUMBER = /^\d+$/
const STORAGE_ERROR = 'Could not save to browser storage.'

export function getTransactions() {
  return loadList(STORAGE_KEYS.transactions).data
}

// Load everything a stock transaction needs. Stops if saved data is unreadable.
function loadData() {
  const products = loadList(STORAGE_KEYS.products)
  const suppliers = loadList(STORAGE_KEYS.suppliers)
  const transactions = loadList(STORAGE_KEYS.transactions)

  if ([products, suppliers, transactions].some((result) => result.status === 'corrupted')) {
    return { error: 'Saved data is unreadable. Nothing was changed.' }
  }

  return {
    products: products.data,
    suppliers: suppliers.data,
    transactions: transactions.data,
  }
}

function checkProduct(productId, products) {
  if (!productId) return { error: 'Select a product' }
  const product = products.find((p) => p.id === productId)
  if (!product) return { error: 'Selected product does not exist' }
  if (product.status !== 'Active') {
    return { error: 'An inactive product cannot be used in new transactions' }
  }
  return { product }
}

function saveTransaction(transactions, transaction, message) {
  if (!saveList(STORAGE_KEYS.transactions, [...transactions, transaction])) {
    return { ok: false, message: STORAGE_ERROR }
  }
  return { ok: true, message: `${message} (${transaction.id})` }
}

export function recordStockIn(form) {
  const data = loadData()
  if (data.error) return { ok: false, message: data.error }
  const { products, suppliers, transactions } = data

  const errors = {}
  const productCheck = checkProduct(form.productId, products)
  if (productCheck.error) errors.productId = productCheck.error

  if (!form.supplierId) {
    errors.supplierId = 'Select a supplier'
  } else {
    const supplier = suppliers.find((s) => s.id === form.supplierId)
    if (!supplier) {
      errors.supplierId = 'Selected supplier does not exist'
    } else if (supplier.status !== 'Active') {
      errors.supplierId = 'An inactive supplier cannot be used for a new receipt'
    }
  }

  const quantityText = String(form.quantity).trim()
  if (!POSITIVE_INTEGER.test(quantityText)) {
    errors.quantity = 'Quantity must be a whole number greater than zero'
  }

  const unitCostText = String(form.unitCost).trim()
  const unitCost = Number(unitCostText)
  if (unitCostText === '' || Number.isNaN(unitCost) || unitCost <= 0) {
    errors.unitCost = 'Unit cost must be greater than zero'
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const quantity = Number(quantityText)
  const currentStock = buildStockMap(transactions)[productCheck.product.id] || 0

  const transaction = {
    id: generateTransactionId(transactions),
    productId: productCheck.product.id,
    type: 'Stock In',
    quantityChange: quantity,
    balanceAfter: currentStock + quantity,
    date: new Date().toISOString(),
    supplierId: form.supplierId,
    unitCost,
    referenceNumber: form.referenceNumber.trim(),
    remarks: form.remarks.trim(),
  }

  return saveTransaction(transactions, transaction, 'Stock received')
}

export function recordStockOut(form) {
  const data = loadData()
  if (data.error) return { ok: false, message: data.error }
  const { products, transactions } = data

  const errors = {}
  const productCheck = checkProduct(form.productId, products)
  if (productCheck.error) errors.productId = productCheck.error

  const quantityText = String(form.quantity).trim()
  if (!POSITIVE_INTEGER.test(quantityText)) {
    errors.quantity = 'Quantity must be a whole number greater than zero'
  }

  if (!form.issuedTo.trim()) errors.issuedTo = 'Issued To is required'
  if (!form.department.trim()) errors.department = 'Department is required'
  if (!form.purpose.trim()) errors.purpose = 'Purpose is required'

  // You cannot issue more than the available stock.
  let currentStock = 0
  if (productCheck.product) {
    currentStock = buildStockMap(transactions)[productCheck.product.id] || 0
    if (!errors.quantity && Number(quantityText) > currentStock) {
      errors.quantity = `Only ${currentStock} units are available. You cannot issue ${quantityText}.`
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const quantity = Number(quantityText)
  const transaction = {
    id: generateTransactionId(transactions),
    productId: productCheck.product.id,
    type: 'Stock Out',
    quantityChange: -quantity,
    balanceAfter: currentStock - quantity,
    date: new Date().toISOString(),
    issuedTo: form.issuedTo.trim(),
    department: form.department.trim(),
    purpose: form.purpose.trim(),
    remarks: '',
  }

  return saveTransaction(transactions, transaction, 'Stock issued')
}

export function recordAdjustment(form) {
  const data = loadData()
  if (data.error) return { ok: false, message: data.error }
  const { products, transactions } = data

  const errors = {}
  const productCheck = checkProduct(form.productId, products)
  if (productCheck.error) errors.productId = productCheck.error

  const actualText = String(form.actualStock).trim()
  if (!WHOLE_NUMBER.test(actualText)) {
    errors.actualStock = 'Actual stock must be a whole number, 0 or more'
  }

  if (!form.reason.trim()) errors.reason = 'Reason is required'

  if (Object.keys(errors).length > 0) return { ok: false, errors }

  const actualStock = Number(actualText)
  const systemStock = buildStockMap(transactions)[productCheck.product.id] || 0
  const difference = actualStock - systemStock

  if (difference === 0) {
    return {
      ok: false,
      errors: { actualStock: 'Actual stock is the same as system stock. No adjustment is needed.' },
    }
  }

  const transaction = {
    id: generateTransactionId(transactions),
    productId: productCheck.product.id,
    type: 'Adjustment',
    quantityChange: difference,
    balanceAfter: actualStock,
    date: new Date().toISOString(),
    systemStock,
    actualStock,
    reason: form.reason.trim(),
    remarks: '',
  }

  return saveTransaction(transactions, transaction, 'Stock adjusted')
}