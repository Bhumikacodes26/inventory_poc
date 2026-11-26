import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  MenuItem,
  Paper,
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
import { TRANSACTION_TYPES } from '../data/constants'
import { getProducts } from '../services/productService'
import { getTransactions } from '../services/transactionService'
import { formatDateTime, getTransactionNote, toDateKey } from '../utils/formatters'

const COLUMNS = [
  { id: 'id', label: 'Transaction ID' },
  { id: 'date', label: 'Date' },
  { id: 'productLabel', label: 'Product' },
  { id: 'type', label: 'Type' },
  { id: 'quantityChange', label: 'Quantity Change', numeric: true },
  { id: 'balanceAfter', label: 'Balance After', numeric: true },
]

function Transactions() {
  const [searchParams] = useSearchParams()
  const [products] = useState(() => getProducts())
  const [transactions] = useState(() => getTransactions())

  const [productFilter, setProductFilter] = useState(searchParams.get('productId') || 'all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const productLabels = Object.fromEntries(products.map((p) => [p.id, `${p.code} - ${p.name}`]))

  const rows = transactions.map((t) => ({
    ...t,
    productLabel: productLabels[t.productId] || 'Unknown product',
  }))

  const filteredRows = rows
    .filter((t) => productFilter === 'all' || t.productId === productFilter)
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => !fromDate || toDateKey(t.date) >= fromDate)
    .filter((t) => !toDate || toDateKey(t.date) <= toDate)

  const sortedRows = [...filteredRows].sort((a, b) => {
    const first = a[sortBy]
    const second = b[sortBy]
    let result =
      typeof first === 'number' ? first - second : String(first).localeCompare(String(second))
    if (result === 0) result = a.id.localeCompare(b.id)
    return sortDirection === 'asc' ? result : -result
  })

  const visibleRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  function handleSort(columnId) {
    if (sortBy === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(columnId)
      setSortDirection('asc')
    }
  }

  function clearFilters() {
    setProductFilter('all')
    setTypeFilter('all')
    setFromDate('')
    setToDate('')
    setPage(0)
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          select
          label="Product"
          size="small"
          value={productFilter}
          onChange={(event) => {
            setProductFilter(event.target.value)
            setPage(0)
          }}
          sx={{ minWidth: 260 }}
        >
          <MenuItem value="all">All products</MenuItem>
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.code} - {product.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Type"
          size="small"
          value={typeFilter}
          onChange={(event) => {
            setTypeFilter(event.target.value)
            setPage(0)
          }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All types</MenuItem>
          {TRANSACTION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="From date"
          type="date"
          size="small"
          value={fromDate}
          onChange={(event) => {
            setFromDate(event.target.value)
            setPage(0)
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="To date"
          type="date"
          size="small"
          value={toDate}
          onChange={(event) => {
            setToDate(event.target.value)
            setPage(0)
          }}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button onClick={clearFilters}>Clear Filters</Button>
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
                <TableCell>Reference</TableCell>
                <TableCell>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length + 2} align="center">
                    No transactions match the filters
                  </TableCell>
                </TableRow>
              )}
              {visibleRows.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{formatDateTime(t.date)}</TableCell>
                  <TableCell>{t.productLabel}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: t.quantityChange < 0 ? 'error.main' : 'success.main' }}
                  >
                    {t.quantityChange > 0 ? `+${t.quantityChange}` : t.quantityChange}
                  </TableCell>
                  <TableCell align="right">{t.balanceAfter}</TableCell>
                  <TableCell>{t.referenceNumber || '-'}</TableCell>
                  <TableCell>{getTransactionNote(t)}</TableCell>
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
    </>
  )
}

export default Transactions