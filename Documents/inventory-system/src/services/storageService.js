import {
  OPENING_DATE,
  sampleCategories,
  sampleSuppliers,
  sampleProducts,
  sampleMovements,
} from '../data/sampleData'

export const STORAGE_KEYS = {
  products: 'inventory_products',
  categories: 'inventory_categories',
  suppliers: 'inventory_suppliers',
  transactions: 'inventory_transactions',
  settings: 'inventory_settings',
}

// Read a list from localStorage. It never crashes the app.
export function loadList(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return { status: 'missing', data: [] }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { status: 'corrupted', data: [] }
    return { status: 'ok', data: parsed }
  } catch {
    return { status: 'corrupted', data: [] }
  }
}

// Save a list. Returns true if it worked, false if it failed.
export function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

// Build the transaction list: one Opening entry per product, then the movements.
// balanceAfter is calculated by adding up changes in date order.
function buildSampleTransactions() {
  const openings = sampleProducts.map((product) => ({
    productId: product.id,
    type: 'Opening',
    quantityChange: product.openingStock,
    date: OPENING_DATE,
    remarks: 'Opening stock',
  }))

  const movements = [...sampleMovements].sort((a, b) => a.date.localeCompare(b.date))

  const balances = {}
  return [...openings, ...movements].map((transaction, index) => {
    const previous = balances[transaction.productId] || 0
    const balanceAfter = previous + transaction.quantityChange
    balances[transaction.productId] = balanceAfter

    return {
      id: `TXN-${String(index + 1).padStart(4, '0')}`,
      ...transaction,
      balanceAfter,
    }
  })
}

// Run once when the app starts. Loads sample data only if nothing is saved yet.
export function initializeData() {
  try {
    const dataKeys = [
      STORAGE_KEYS.products,
      STORAGE_KEYS.categories,
      STORAGE_KEYS.suppliers,
      STORAGE_KEYS.transactions,
    ]

    const alreadyHasData = dataKeys.some((key) => localStorage.getItem(key) !== null)
    if (alreadyHasData) {
      return { ok: true, seeded: false }
    }

    const saved =
      saveList(STORAGE_KEYS.categories, sampleCategories) &&
      saveList(STORAGE_KEYS.suppliers, sampleSuppliers) &&
      saveList(STORAGE_KEYS.products, sampleProducts) &&
      saveList(STORAGE_KEYS.transactions, buildSampleTransactions())

    if (!saved) return { ok: false, seeded: false }

    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ sampleDataLoaded: true }))
    return { ok: true, seeded: true }
  } catch {
    return { ok: false, seeded: false }
  }
}