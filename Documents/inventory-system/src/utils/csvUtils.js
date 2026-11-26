// Make one safe CSV cell.
function escapeCell(value) {
  let text = value === null || value === undefined ? '' : String(value)

  // Text starting with = + - @ can run as a formula in Excel. A leading ' makes it plain text.
  if (typeof value === 'string' && /^[=+\-@]/.test(text)) {
    text = `'${text}`
  }

  // Cells with commas, quotes or new lines must be wrapped in quotes.
  if (/[",\n\r]/.test(text)) {
    text = `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function buildCsv(columns, rows) {
  const header = columns.map((column) => escapeCell(column.label)).join(',')
  const lines = rows.map((row) => columns.map((column) => escapeCell(row[column.key])).join(','))
  return [header, ...lines].join('\r\n')
}

// Create the file in the browser and start the download. No server is used.
export function downloadCsv(filename, columns, rows) {
  const content = `\uFEFF${buildCsv(columns, rows)}`
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}