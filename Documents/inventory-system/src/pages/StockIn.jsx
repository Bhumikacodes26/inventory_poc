import { useState } from 'react'
import { Alert, Box, Button, MenuItem, Paper, Snackbar, TextField } from '@mui/material'
import { getProducts } from '../services/productService'
import { getSuppliers } from '../services/supplierService'
import { getTransactions, recordStockIn } from '../services/transactionService'
import { buildStockMap, generateTransactionId } from '../utils/inventoryUtils'
import { formatDateTime } from '../utils/formatters'

const EMPTY_FORM = {
  productId: '',
  supplierId: '',
  quantity: '',
  unitCost: '',
  referenceNumber: '',
  remarks: '',
}

function StockIn() {
  // Only active products and active suppliers can be chosen.
  const [products] = useState(() => getProducts().filter((p) => p.status === 'Active'))
  const [suppliers] = useState(() => getSuppliers().filter((s) => s.status === 'Active'))
  const [transactions, setTransactions] = useState(() => getTransactions())
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const stockMap = buildStockMap(transactions)
  const currentStock = form.productId ? stockMap[form.productId] || 0 : null

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // When a product is chosen, fill in its default supplier and unit cost.
  function handleProductChange(event) {
    const product = products.find((p) => p.id === event.target.value)
    const supplierIsActive = product && suppliers.some((s) => s.id === product.supplierId)
    setForm({
      ...form,
      productId: event.target.value,
      supplierId: supplierIsActive ? product.supplierId : '',
      unitCost: product ? String(product.unitCost) : '',
    })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const result = recordStockIn(form)

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
            onChange={handleProductChange}
            error={Boolean(errors.productId)}
            helperText={
              errors.productId || (currentStock !== null ? `Current stock: ${currentStock}` : '')
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
            select
            name="supplierId"
            label="Supplier"
            value={form.supplierId}
            onChange={handleChange}
            error={Boolean(errors.supplierId)}
            helperText={errors.supplierId}
            required
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="quantity"
            label="Quantity Received"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity}
            required
          />
          <TextField
            name="unitCost"
            label="Unit Cost"
            type="number"
            value={form.unitCost}
            onChange={handleChange}
            error={Boolean(errors.unitCost)}
            helperText={errors.unitCost}
            required
          />
          <TextField
            name="referenceNumber"
            label="Reference Number (optional)"
            value={form.referenceNumber}
            onChange={handleChange}
          />
          <TextField
            name="remarks"
            label="Remarks (optional)"
            value={form.remarks}
            onChange={handleChange}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained">
            Receive Stock
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

export default StockIn