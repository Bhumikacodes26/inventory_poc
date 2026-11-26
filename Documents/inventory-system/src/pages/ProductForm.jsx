import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Box, Button, MenuItem, Paper, TextField } from '@mui/material'
import { UNITS } from '../data/constants'
import { getProductById, saveProduct } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getSuppliers } from '../services/supplierService'

const EMPTY_FORM = {
  code: '',
  name: '',
  categoryId: '',
  supplierId: '',
  description: '',
  unit: '',
  unitCost: '',
  openingStock: '0',
  reorderLevel: '',
  status: 'Active',
}

function productToForm(product) {
  return {
    code: product.code,
    name: product.name,
    categoryId: product.categoryId,
    supplierId: product.supplierId,
    description: product.description || '',
    unit: product.unit,
    unitCost: String(product.unitCost),
    openingStock: String(product.openingStock),
    reorderLevel: String(product.reorderLevel),
    status: product.status,
  }
}

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [existing] = useState(() => (id ? getProductById(id) : null))
  const [categories] = useState(() => getCategories())
  const [suppliers] = useState(() => getSuppliers())
  const [form, setForm] = useState(() => (existing ? productToForm(existing) : EMPTY_FORM))
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [saving, setSaving] = useState(false)

  if (isEditing && !existing) {
    return (
      <>
        <Alert severity="error" sx={{ mb: 2 }}>
          Product not found. It may not exist, or the address is wrong.
        </Alert>
        <Button component={Link} to="/products" variant="contained">
          Back to Products
        </Button>
      </>
    )
  }

  // Inactive categories/suppliers are hidden, unless the product already uses them.
  const categoryOptions = categories.filter((c) => c.status === 'Active' || c.id === form.categoryId)
  const supplierOptions = suppliers.filter((s) => s.status === 'Active' || s.id === form.supplierId)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setServerError('')

    const result = saveProduct(form, id)
    if (!result.ok) {
      if (result.errors) {
        setErrors(result.errors)
      } else {
        setServerError(result.message)
      }
      setSaving(false)
      return
    }

    navigate('/products', { state: { message: result.message } })
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <TextField
            name="code"
            label="Product Code"
            value={form.code}
            onChange={handleChange}
            error={Boolean(errors.code)}
            helperText={errors.code || (isEditing ? 'Cannot be changed after creation' : '')}
            disabled={isEditing}
            required
          />
          <TextField
            name="name"
            label="Product Name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            required
          />
          <TextField
            select
            name="categoryId"
            label="Category"
            value={form.categoryId}
            onChange={handleChange}
            error={Boolean(errors.categoryId)}
            helperText={errors.categoryId}
            required
          >
            {categoryOptions.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
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
            {supplierOptions.map((supplier) => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name="unit"
            label="Unit of Measure"
            value={form.unit}
            onChange={handleChange}
            error={Boolean(errors.unit)}
            helperText={errors.unit}
            required
          >
            {UNITS.map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </TextField>
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
            name="openingStock"
            label="Opening Stock"
            type="number"
            value={form.openingStock}
            onChange={handleChange}
            error={Boolean(errors.openingStock)}
            helperText={errors.openingStock || (isEditing ? 'Cannot be changed after creation' : '')}
            disabled={isEditing}
          />
          <TextField
            name="reorderLevel"
            label="Reorder Level"
            type="number"
            value={form.reorderLevel}
            onChange={handleChange}
            error={Boolean(errors.reorderLevel)}
            helperText={errors.reorderLevel}
            required
          />
          <TextField
            select
            name="status"
            label="Status"
            value={form.status}
            onChange={handleChange}
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            error={Boolean(errors.description)}
            helperText={errors.description || `${form.description.length}/500`}
            multiline
            rows={3}
            sx={{ gridColumn: { md: '1 / -1' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {isEditing ? 'Update Product' : 'Save Product'}
          </Button>
          <Button onClick={() => navigate('/products')}>Cancel</Button>
        </Box>
      </Box>
    </Paper>
  )
}

export default ProductForm