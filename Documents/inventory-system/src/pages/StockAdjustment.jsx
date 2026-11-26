import { useState } from 'react'
import { Alert, Box, Button, MenuItem, Paper, Snackbar, TextField } from '@mui/material'
import { getProducts } from '../services/productService'
import { getTransactions, recordAdjustment } from '../services/transactionService'
import { buildStockMap } from '../utils/inventoryUtils'
import { formatDateTime } from '../utils/formatters'

const EMPTY_FORM = { productId: '', actualStock: '', reason: '' }

function StockAdjustment() {
  const [products] = useState(() => getProducts().filter((p) => p.status === 'Active'))
  const [transactions, setTransactions] = useState(() => getTransactions())
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const stockMap = buildStockMap(transactions)
  const currentStock = form.productId ? stockMap[form.productId] || 0 : ''

  // Show the difference while the user types, for example "Adjustment: -3".
  const actualText = form.actualStock.trim()
  const difference =
    form.productId && /^\d+$/.test(actualText) ? Number(actualText) - currentStock : null

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = recordAdjustment(form)

    if (!result.ok) {
      if (result.errors) {
        setErrors(result.errors)
      } else {
        showMessage(result.message, 'error')
      }
      return
    }

    setTransactions(getTransactions())
    setForm(EMPTY_FORM)
    setErrors({})
    showMessage(result.message)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            select
            name="productId"
            label="Product"
            value={form.productId}
            onChange={handleChange}
            error={Boolean(errors.productId)}
            helperText={errors.productId}
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.code} - {product.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Current Stock (system)" value={currentStock} disabled />
          <TextField
            name="actualStock"
            label="Actual Stock (physical count)"
            type="number"
            value={form.actualStock}
            onChange={handleChange}
            error={Boolean(errors.actualStock)}
            helperText={
              errors.actualStock ||
              (difference === null ? '' : `Adjustment: ${difference > 0 ? '+' : ''}${difference}`)
            }
            required
          />
          <TextField
            label="Adjustment Date"
            value={formatDateTime(new Date().toISOString())}
            disabled
          />
          <TextField
            name="reason"
            label="Reason"
            value={form.reason}
            onChange={handleChange}
            error={Boolean(errors.reason)}
            helperText={errors.reason}
            multiline
            rows={2}
            required
            sx={{ gridColumn: { md: '1 / -1' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained">
            Save Adjustment
          </Button>
          <Button
            onClick={() => {
              setForm(EMPTY_FORM)
              setErrors({})
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  )
}

export default StockAdjustment