import { useState } from 'react'
import { Alert, Box, Button, MenuItem, Paper, Snackbar, TextField } from '@mui/material'
import { getProducts } from '../services/productService'
import { getTransactions, recordStockOut } from '../services/transactionService'
import { buildStockMap, generateTransactionId } from '../utils/inventoryUtils'
import { formatDateTime } from '../utils/formatters'

const EMPTY_FORM = { productId: '', quantity: '', issuedTo: '', department: '', purpose: '' }

function StockOut() {
  const [products] = useState(() => getProducts().filter((p) => p.status === 'Active'))
  const [transactions, setTransactions] = useState(() => getTransactions())
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const stockMap = buildStockMap(transactions)
  const availableStock = form.productId ? stockMap[form.productId] || 0 : null

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = recordStockOut(form)

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
            label="Transaction Reference"
            value={generateTransactionId(transactions)}
            disabled
          />
          <TextField
            label="Transaction Date"
            value={formatDateTime(new Date().toISOString())}
            disabled
          />
          <TextField
            select
            name="productId"
            label="Product"
            value={form.productId}
            onChange={handleChange}
            error={Boolean(errors.productId)}
            helperText={
              errors.productId || (availableStock !== null ? `Available stock: ${availableStock}` : '')
            }
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.code} - {product.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="quantity"
            label="Quantity Issued"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            required
          />
          <TextField
            name="issuedTo"
            label="Issued To"
            value={form.issuedTo}
            onChange={handleChange}
            error={Boolean(errors.issuedTo)}
            helperText={errors.issuedTo}
            required
          />
          <TextField
            name="department"
            label="Department"
            value={form.department}
            onChange={handleChange}
            error={Boolean(errors.department)}
            helperText={errors.department}
            required
          />
          <TextField
            name="purpose"
            label="Purpose"
            value={form.purpose}
            onChange={handleChange}
            error={Boolean(errors.purpose)}
            helperText={errors.purpose}
            required
            sx={{ gridColumn: { md: '1 / -1' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained">
            Issue Stock
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

export default StockOut