import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { getSuppliers, saveSupplier, setSupplierStatus } from '../services/supplierService'

const EMPTY_FORM = { code: '', name: '', contactPerson: '', email: '', phone: '' }

function Suppliers() {
  const [suppliers, setSuppliers] = useState(() => getSuppliers())
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  function openAddForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setFormOpen(true)
  }

  function openEditForm(supplier) {
    setEditingId(supplier.id)
    setForm({
      code: supplier.code,
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    })
    setErrors({})
    setFormOpen(true)
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSave() {
    const result = saveSupplier(form, editingId)
    if (!result.ok) {
      if (result.errors) {
        setErrors(result.errors)
      } else {
        showMessage(result.message, 'error')
      }
      return
    }
    setSuppliers(getSuppliers())
    setFormOpen(false)
    showMessage(result.message)
  }

  function handleConfirmDeactivate() {
    const result = setSupplierStatus(confirmTarget.id, 'Inactive')
    setConfirmTarget(null)
    if (result.ok) setSuppliers(getSuppliers())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  function handleActivate(supplier) {
    const result = setSupplierStatus(supplier.id, 'Active')
    if (result.ok) setSuppliers(getSuppliers())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={openAddForm}>
          Add Supplier
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No suppliers found
                </TableCell>
              </TableRow>
            )}
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.code}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={supplier.status}
                    color={supplier.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditForm(supplier)}>
                    Edit
                  </Button>
                  {supplier.status === 'Active' ? (
                    <Button size="small" color="error" onClick={() => setConfirmTarget(supplier)}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button size="small" onClick={() => handleActivate(supplier)}>
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            name="code"
            label="Supplier Code"
            value={form.code}
            onChange={handleChange}
            error={Boolean(errors.code)}
            helperText={errors.code}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            name="name"
            label="Supplier Name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            name="contactPerson"
            label="Contact Person"
            value={form.contactPerson}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            fullWidth
            margin="dense"
          />
          <TextField
            name="phone"
            label="Phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Deactivate supplier?"
        message={confirmTarget ? `Do you want to deactivate "${confirmTarget.name}"?` : ''}
        confirmText="Deactivate"
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setConfirmTarget(null)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Suppliers