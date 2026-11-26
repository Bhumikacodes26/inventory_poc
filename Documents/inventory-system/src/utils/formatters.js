export function formatMoney(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDateTime(isoString) {
  const date = new Date(isoString)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('en-IN')
}

// Each transaction type keeps its note in a different field.
export function getTransactionNote(transaction) {
  return transaction.remarks || transaction.reason || transaction.purpose || ''
}
// Turn a saved date into a local date like 2026-11-23, to compare with date filters.
export function toDateKey(isoString) {
  const date = new Date(isoString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}