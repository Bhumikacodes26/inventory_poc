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
import { getCategories, saveCategory, setCategoryStatus } from '../services/categoryService'

const EMPTY_FORM = { code: '', name: '', description: '' }

function Categories() {
  const [categories, setCategories] = useState(() => getCategories())
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

  function openEditForm(category) {
    setEditingId(category.id)
    setForm({
      code: category.code,
      name: category.name,
      description: category.description || '',
    })
    setErrors({})
    setFormOpen(true)
  }

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSave() {
    const result = saveCategory(form, editingId)
    if (!result.ok) {
      if (result.errors) {
        setErrors(result.errors)
      } else {
        showMessage(result.message, 'error')
      }
      return
    }
    setCategories(getCategories())
    setFormOpen(false)
    showMessage(result.message)
  }

  function handleConfirmDeactivate() {
    const result = setCategoryStatus(confirmTarget.id, 'Inactive')
    setConfirmTarget(null)
    if (result.ok) setCategories(getCategories())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  function handleActivate(category) {
    const result = setCategoryStatus(category.id, 'Active')
    if (result.ok) setCategories(getCategories())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={openAddForm}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.code}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Chip
                    label={category.status}
                    color={category.status === 'Active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => openEditForm(category)}>
                    Edit
                  </Button>
                  {category.status === 'Active' ? (
                    <Button size="small" color="error" onClick={() => setConfirmTarget(category)}>
                      Deactivate
                    </Button>
                  ) : (
                    <Button size="small" onClick={() => handleActivate(category)}>
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
        <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            name="code"
            label="Category Code"
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
            label="Category Name"
            value={form.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
            fullWidth
            required
            margin="dense"
          />
          <TextField
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
        title="Deactivate category?"
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

export default Categories