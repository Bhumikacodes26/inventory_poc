import { loadList, saveList, STORAGE_KEYS } from './storageService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function getSuppliers() {
  return loadList(STORAGE_KEYS.suppliers).data
}

export function validateSupplier(form, suppliers, editingId) {
  const errors = {}
  const code = form.code.trim()
  const name = form.name.trim()
  const email = form.email.trim()

  if (!code) {
    errors.code = 'Supplier code is required'
  } else if (
    suppliers.some((s) => s.id !== editingId && s.code.toLowerCase() === code.toLowerCase())
  ) {
    errors.code = 'This supplier code already exists'
  }

  if (!name) {
    errors.name = 'Supplier name is required'
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  return errors
}

export function saveSupplier(form, editingId) {
  const result = loadList(STORAGE_KEYS.suppliers)
  if (result.status === 'corrupted') {
    return { ok: false, message: 'Saved supplier data is unreadable. Nothing was changed.' }
  }

  const suppliers = result.data
  const errors = validateSupplier(form, suppliers, editingId)
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  const cleaned = {
    code: form.code.trim(),
    name: form.name.trim(),
    contactPerson: form.contactPerson.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
  }

  const updated = editingId
    ? suppliers.map((s) => (s.id === editingId ? { ...s, ...cleaned } : s))
    : [...suppliers, { id: `sup-${Date.now()}`, ...cleaned, status: 'Active' }]

  if (!saveList(STORAGE_KEYS.suppliers, updated)) {
    return { ok: false, message: 'Could not save to browser storage.' }
  }

  return { ok: true, message: editingId ? 'Supplier updated' : 'Supplier added' }
}

export function setSupplierStatus(supplierId, newStatus) {
  const result = loadList(STORAGE_KEYS.suppliers)
  if (result.status === 'corrupted') {
    return { ok: false, message: 'Saved supplier data is unreadable. Nothing was changed.' }
  }

  const updated = result.data.map((s) => (s.id === supplierId ? { ...s, status: newStatus } : s))

  if (!saveList(STORAGE_KEYS.suppliers, updated)) {
    return { ok: false, message: 'Could not save to browser storage.' }
  }

  return { ok: true, message: newStatus === 'Inactive' ? 'Supplier deactivated' : 'Supplier activated' }
}