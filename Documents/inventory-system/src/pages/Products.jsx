import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
} from '@mui/material'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import BlockOutlined from '@mui/icons-material/BlockOutlined'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import ActionIcon from '../components/common/ActionIcon'
import ConfirmDialog from '../components/common/ConfirmDialog'
import StockStatusChip from '../components/common/StockStatusChip'
import { STOCK_STATUSES } from '../data/constants'
import { getProducts, setProductStatus } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getSuppliers } from '../services/supplierService'
import { getTransactions } from '../services/transactionService'
import { buildProductsWithStock } from '../utils/inventoryUtils'
import { formatMoney } from '../utils/formatters'

const COLUMNS = [
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'Name' },
  { id: 'categoryName', label: 'Category' },
  { id: 'supplierName', label: 'Supplier' },
  { id: 'unit', label: 'Unit' },
  { id: 'unitCost', label: 'Unit Cost', numeric: true },
  { id: 'availableStock', label: 'Stock', numeric: true },
  { id: 'reorderLevel', label: 'Reorder Level', numeric: true },
  { id: 'stockStatus', label: 'Stock Status' },
  { id: 'status', label: 'Status' },
]

// Keeps the Actions column visible on the right while the table scrolls sideways.
const STICKY_ACTIONS = { position: 'sticky', right: 0, bgcolor: 'background.paper' }

function Products() {
  const navigate = useNavigate()
  const location = useLocation()

  const [products, setProducts] = useState(() => getProducts())
  const [categories] = useState(() => getCategories())
  const [suppliers] = useState(() => getSuppliers())
  const [transactions] = useState(() => getTransactions())

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('code')
  const [sortDirection, setSortDirection] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: Boolean(location.state?.message),
    message: location.state?.message || '',
    severity: 'success',
  })

  // Remove the saved message from the browser history so it does not show again on refresh.
  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const supplierNames = Object.fromEntries(suppliers.map((s) => [s.id, s.name]))

  const rows = buildProductsWithStock(products, transactions).map((product) => ({
    ...product,
    categoryName: categoryNames[product.categoryId] || 'Unknown',
    supplierName: supplierNames[product.supplierId] || 'Unknown',
  }))

  const searchText = search.trim().toLowerCase()
  const filteredRows = rows
    .filter(
      (p) =>
        !searchText ||
        p.code.toLowerCase().includes(searchText) ||
        p.name.toLowerCase().includes(searchText),
    )
    .filter((p) => categoryFilter === 'all' || p.categoryId === categoryFilter)
    .filter((p) => statusFilter === 'all' || p.stockStatus === statusFilter)

  const sortedRows = [...filteredRows].sort((a, b) => {
    const first = a[sortBy]
    const second = b[sortBy]
    const result =
      typeof first === 'number' ? first - second : String(first).localeCompare(String(second))
    return sortDirection === 'asc' ? result : -result
  })

  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  function showMessage(message, severity = 'success') {
    setSnackbar({ open: true, message, severity })
  }

  function handleSort(columnId) {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnId)
      setSortDirection('asc')
    }
  }

  function clearFilters() {
    setSearch('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setPage(0)
  }

  function handleConfirmDeactivate() {
    const result = setProductStatus(confirmTarget.id, 'Inactive')
    setConfirmTarget(null)
    if (result.ok) setProducts(getProducts())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  function handleActivate(product) {
    const result = setProductStatus(product.id, 'Active')
    if (result.ok) setProducts(getProducts())
    showMessage(result.message, result.ok ? 'success' : 'error')
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search code or name"
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          select
          label="Category"
          size="small"
          value={categoryFilter}
          onChange={(event) => {
            setCategoryFilter(event.target.value)
            setPage(0)
          }}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="all">All categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Stock Status"
          size="small"
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value)
            setPage(0)
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          {STOCK_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.numeric ? 'right' : 'left'}
                    sortDirection={sortBy === column.id ? sortDirection : false}
                  >
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="right" sx={STICKY_ACTIONS}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 1} align="center">
                    No products match the filters
                  </TableCell>
                </TableRow>
              )}
              {visibleRows.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell>{product.supplierName}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell align="right">{formatMoney(product.unitCost)}</TableCell>
                  <TableCell align="right">{product.availableStock}</TableCell>
                  <TableCell align="right">{product.reorderLevel}</TableCell>
                  <TableCell>
                    <StockStatusChip status={product.stockStatus} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.status}
                      color={product.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap', ...STICKY_ACTIONS }}>
                    <ActionIcon
                      title="View"
                      icon={VisibilityOutlined}
                      color="primary"
                      onClick={() => navigate(`/products/${product.id}`)}
                    />
                    <ActionIcon
                      title="Edit"
                      icon={EditOutlined}
                      color="primary"
                      onClick={() => navigate(`/products/${product.id}/edit`)}
                    />
                    {product.status === 'Active' ? (
                      <ActionIcon
                        title="Deactivate"
                        icon={BlockOutlined}
                        color="error"
                        onClick={() => setConfirmTarget(product)}
                      />
                    ) : (
                      <ActionIcon
                        title="Activate"
                        icon={CheckCircleOutline}
                        color="success"
                        onClick={() => handleActivate(product)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={sortedRows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10))
            setPage(0)
          }}
        />
      </Paper>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title="Deactivate product?"
        message={
          confirmTarget
            ? `Deactivate "${confirmTarget.name}"? Its transaction history will be kept, but no new transactions can be recorded.`
            : ''
        }
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

export default Products