import { loadList, saveList, STORAGE_KEYS } from './storageService'

export function getCategories() {
  return loadList(STORAGE_KEYS.categories).data
}

export function validateCategory(form, categories, editingId) {
  const errors = {}
  const code = form.code.trim()
  const name = form.name.trim()

  if (!code) {
    errors.code = 'Category code is required'
  } else if (
    categories.some((c) => c.id !== editingId && c.code.toLowerCase() === code.toLowerCase())
  ) {
    errors.code = 'This category code already exists'
  }

  if (!name) {
    errors.name = 'Category name is required'
  } else if (
    categories.some((c) => c.id !== editingId && c.name.toLowerCase() === name.toLowerCase())
  ) {
    errors.name = 'This category name already exists'
  }

  return errors
}

export function saveCategory(form, editingId) {
  const result = loadList(STORAGE_KEYS.categories)
  if (result.status === 'corrupted') {
    return { ok: false, message: 'Saved category data is unreadable. Nothing was changed.' }
  }

  const categories = result.data
  const errors = validateCategory(form, categories, editingId)
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const cleaned = {
    code: form.code.trim(),
    name: form.name.trim(),
    description: form.description.trim(),
  }

  const updated = editingId
    ? categories.map((c) => (c.id === editingId ? { ...c, ...cleaned } : c))
    : [...categories, { id: `cat-${Date.now()}`, ...cleaned, status: 'Active' }]

  if (!saveList(STORAGE_KEYS.categories, updated)) {
    return { ok: false, message: 'Could not save to browser storage.' }
  }

  return { ok: true, message: editingId ? 'Category updated' : 'Category added' }
}

export function setCategoryStatus(categoryId, newStatus) {
  const result = loadList(STORAGE_KEYS.categories)
  if (result.status === 'corrupted') {
    return { ok: false, message: 'Saved category data is unreadable. Nothing was changed.' }
  }

  if (newStatus === 'Inactive') {
    const products = loadList(STORAGE_KEYS.products).data
    const inUse = products.some((p) => p.categoryId === categoryId && p.status === 'Active')
    if (inUse) {
      return {
        ok: false,
        message: 'This category is used by active products, so it cannot be deactivated.',
      }
    }
  }

  const updated = result.data.map((c) => (c.id === categoryId ? { ...c, status: newStatus } : c))

  if (!saveList(STORAGE_KEYS.categories, updated)) {
    return { ok: false, message: 'Could not save to browser storage.' }
  }

  return { ok: true, message: newStatus === 'Inactive' ? 'Category deactivated' : 'Category activated' }
}