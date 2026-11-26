import { loadList, saveList, STORAGE_KEYS } from './storageService'
import { generateTransactionId } from '../utils/inventoryUtils'

const WHOLE_NUMBER = /^\d+$/

export function getProducts() {
  return loadList(STORAGE_KEYS.products).data
}

export function getProductById(productId) {
  return getProducts().find((product) => product.id === productId) || null
}

export function validateProduct(form, { products, categories, suppliers, editingId }) {
  const errors = {}
  const existing = editingId ? products.find((p) => p.id === editingId) : null

  // Product code: checked only when creating, because it cannot be edited later.
  if (!existing) {
    const code = form.code.trim()
    if (!code) {
      errors.code = 'Product code is required'
    } else if (code.length > 20) {
      errors.code = 'Product code can have at most 20 characters'
    } else if (products.some((p) => p.code.toLowerCase() === code.toLowerCase())) {
      errors.code = 'This product code already exists'
    }
  }

  const name = form.name.trim()
  if (!name) {
    errors.name = 'Product name is required'
  } else if (name.length < 3 || name.length > 100) {
    errors.name = 'Product name must be 3 to 100 characters'
  }

  if (!form.categoryId) {
    errors.categoryId = 'Select a category'
  } else {
    const category = categories.find((c) => c.id === form.categoryId)
    const changed = !existing || existing.categoryId !== form.categoryId
    if (!category) {
      errors.categoryId = 'Selected category does not exist'
    } else if (changed && category.status !== 'Active') {
      errors.categoryId = 'An inactive category cannot be selected'
    }
  }

  if (!form.supplierId) {
    errors.supplierId = 'Select a supplier'
  } else {
    const supplier = suppliers.find((s) => s.id === form.supplierId)
    const changed = !existing || existing.supplierId !== form.supplierId
    if (!supplier) {
      errors.supplierId = 'Selected supplier does not exist'
    } else if (changed && supplier.status !== 'Active') {
      errors.supplierId = 'An inactive supplier cannot be selected'
    }
  }

  if (form.description.trim().length > 500) {
    errors.description = 'Description can have at most 500 characters'
  }

  if (!form.unit) {
    errors.unit = 'Select a unit'
  }

  const unitCost = Number(form.unitCost)
  if (form.unitCost === '' || Number.isNaN(unitCost) || unitCost <= 0) {
    errors.unitCost = 'Unit cost must be greater than zero'
  }

  if (!existing && !WHOLE_NUMBER.test(String(form.openingStock).trim())) {
    errors.openingStock = 'Opening stock must be a whole number, 0 or more'
  }

  if (!WHOLE_NUMBER.test(String(form.reorderLevel).trim())) {
    errors.reorderLevel = 'Reorder level must be a whole number, 0 or more'
  }

  return errors
}

export function saveProduct(form, editingId) {
  const productsResult = loadList(STORAGE_KEYS.products)
  const transactionsResult = loadList(STORAGE_KEYS.transactions)
  if (productsResult.status === 'corrupted' || transactionsResult.status === 'corrupted') {
    return { ok: false, message: 'Saved data is unreadable. Nothing was changed.' }
  }

  const products = productsResult.data
  const transactions = transactionsResult.data
  const categories = loadList(STORAGE_KEYS.categories).data
  const suppliers = loadList(STORAGE_KEYS.suppliers).data

  const errors = validateProduct(form, { products, categories, suppliers, editingId })
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const details = {
    name: form.name.trim(),
    categoryId: form.categoryId,
    supplierId: form.supplierId,
    description: form.description.trim(),
    unit: form.unit,
    unitCost: Number(form.unitCost),
    reorderLevel: Number(form.reorderLevel),
    status: form.status,
  }

  const storageError = { ok: false, message: 'Could not save to browser storage.' }

  // Editing: code and opening stock stay as they were.
  if (editingId) {
    const updated = products.map((p) => (p.id === editingId ? { ...p, ...details } : p))
    if (!saveList(STORAGE_KEYS.products, updated)) return storageError
    return { ok: true, message: 'Product updated' }
  }

  // Creating: save the product AND its Opening transaction.
  const openingStock = Number(form.openingStock)
  const newProduct = {
    id: `prod-${Date.now()}`,
    code: form.code.trim(),
    ...details,
    openingStock,
  }
  const openingTransaction = {
    id: generateTransactionId(transactions),
    productId: newProduct.id,
    type: 'Opening',
    quantityChange: openingStock,
    balanceAfter: openingStock,
    date: new Date().toISOString(),
    remarks: 'Opening stock',
  }

  if (!saveList(STORAGE_KEYS.products, [...products, newProduct])) return storageError
  if (!saveList(STORAGE_KEYS.transactions, [...transactions, openingTransaction])) {
    saveList(STORAGE_KEYS.products, products) // undo the first save
    return storageError
  }

  return { ok: true, message: 'Product added' }
}

// Deactivating only changes the status. Transaction history is kept.
export function setProductStatus(productId, newStatus) {
  const result = loadList(STORAGE_KEYS.products)
  if (result.status === 'corrupted') {
    return { ok: false, message: 'Saved product data is unreadable. Nothing was changed.' }
  }

  const updated = result.data.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))

  if (!saveList(STORAGE_KEYS.products, updated)) {
    return { ok: false, message: 'Could not save to browser storage.' }
  }

  return { ok: true, message: newStatus === 'Inactive' ? 'Product deactivated' : 'Product activated' }
}