import { useState } from 'react'
import { Box, Button, MenuItem, Paper, Tab, Tabs, TextField, Typography } from '@mui/material'
import ReportTable from '../components/common/ReportTable'
import StockStatusChip from '../components/common/StockStatusChip'
import { STOCK_STATUSES, TRANSACTION_TYPES } from '../data/constants'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getTransactions } from '../services/transactionService'
import { buildProductsWithStock } from '../utils/inventoryUtils'
import { downloadCsv } from '../utils/csvUtils'
import { formatDateTime, formatMoney, toDateKey } from '../utils/formatters'

const CURRENT_STOCK_COLUMNS = [
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'availableStock', label: 'Available Quantity', numeric: true },
  { key: 'unitCost', label: 'Unit Cost', numeric: true, format: formatMoney },
  { key: 'inventoryValue', label: 'Inventory Value', numeric: true, format: formatMoney },
  {
    key: 'stockStatus',
    label: 'Stock Status',
    render: (row) => <StockStatusChip status={row.stockStatus} />,
  },
]

const MOVEMENT_COLUMNS = [
  { key: 'product', label: 'Product' },
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Transaction Type' },
  {
    key: 'quantityChange',
    label: 'Quantity Change',
    numeric: true,
    format: (value) => (value > 0 ? `+${value}` : value),
  },
  { key: 'balanceAfter', label: 'Balance After', numeric: true },
]

const LOW_STOCK_COLUMNS = [
  { key: 'product', label: 'Product' },
  { key: 'availableStock', label: 'Available Quantity', numeric: true },
  { key: 'reorderLevel', label: 'Reorder Level', numeric: true },
  { key: 'shortfall', label: 'Shortfall', numeric: true },
]

const FILTER_BAR_STYLE = { display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }

function CurrentStockReport({ products, categories, transactions }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [productStatus, setProductStatus] = useState('Active')

  const categoryNames = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  const searchText = search.trim().toLowerCase()

  const rows = buildProductsWithStock(products, transactions)
    .filter((p) => productStatus === 'all' || p.status === productStatus)
    .filter((p) => categoryFilter === 'all' || p.categoryId === categoryFilter)
    .filter((p) => stockFilter === 'all' || p.stockStatus === stockFilter)
    .filter(
      (p) =>
        !searchText ||
        p.code.toLowerCase().includes(searchText) ||
        p.name.toLowerCase().includes(searchText),
    )
    .map((p) => ({
      rowId: p.id,
      product: `${p.code} - ${p.name}`,
      category: categoryNames[p.categoryId] || 'Unknown',
      availableStock: p.availableStock,
      unitCost: p.unitCost,
      inventoryValue: p.inventoryValue,
      stockStatus: p.stockStatus,
    }))

  const totalValue = rows.reduce((sum, row) => sum + row.inventoryValue, 0)

  function clearFilters() {
    setSearch('')
    setCategoryFilter('all')
    setStockFilter('all')
    setProductStatus('Active')
  }

  return (
    <>
      <Box sx={FILTER_BAR_STYLE}>
        <TextField
          label="Search product"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <TextField
          select
          label="Category"
          size="small"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          sx={{ minWidth: 170 }}
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
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All statuses</MenuItem>
          {STOCK_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Product Status"
          size="small"
          value={productStatus}
          onChange={(event) => setProductStatus(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </TextField>
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={rows.length === 0}
          onClick={() => downloadCsv('current-stock-report.csv', CURRENT_STOCK_COLUMNS, rows)}
        >
          Export CSV
        </Button>
      </Box>
      <Typography sx={{ mb: 1 }}>
        {rows.length} products | Total inventory value: <strong>{formatMoney(totalValue)}</strong>
      </Typography>
      <ReportTable columns={CURRENT_STOCK_COLUMNS} rows={rows} />
    </>
  )
}

function MovementReport({ products, transactions }) {
  const [productFilter, setProductFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const productLabels = Object.fromEntries(products.map((p) => [p.id, `${p.code} - ${p.name}`]))

  const rows = [...transactions]
    .filter((t) => productFilter === 'all' || t.productId === productFilter)
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => !fromDate || toDateKey(t.date) >= fromDate)
    .filter((t) => !toDate || toDateKey(t.date) <= toDate)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .map((t) => ({
      rowId: t.id,
      product: productLabels[t.productId] || 'Unknown product',
      date: formatDateTime(t.date),
      type: t.type,
      quantityChange: t.quantityChange,
      balanceAfter: t.balanceAfter,
    }))

  function clearFilters() {
    setProductFilter('all')
    setTypeFilter('all')
    setFromDate('')
    setToDate('')
  }

  return (
    <>
      <Box sx={FILTER_BAR_STYLE}>
        <TextField
          select
          label="Product"
          size="small"
          value={productFilter}
          onChange={(event) => setProductFilter(event.target.value)}
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
          onChange={(event) => setTypeFilter(event.target.value)}
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
          onChange={(event) => setFromDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="To date"
          type="date"
          size="small"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={rows.length === 0}
          onClick={() => downloadCsv('stock-movement-report.csv', MOVEMENT_COLUMNS, rows)}
        >
          Export CSV
        </Button>
      </Box>
      <Typography sx={{ mb: 1 }}>{rows.length} movements</Typography>
      <ReportTable columns={MOVEMENT_COLUMNS} rows={rows} />
    </>
  )
}

function LowStockReport({ products, categories, transactions }) {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  // Only active products that are Low Stock or Out of Stock.
  const rows = buildProductsWithStock(products, transactions)
    .filter((p) => p.status === 'Active' && p.stockStatus !== 'In Stock')
    .filter((p) => categoryFilter === 'all' || p.categoryId === categoryFilter)
    .filter((p) => stockFilter === 'all' || p.stockStatus === stockFilter)
    .sort((a, b) => b.shortfall - a.shortfall)
    .map((p) => ({
      rowId: p.id,
      product: `${p.code} - ${p.name}`,
      availableStock: p.availableStock,
      reorderLevel: p.reorderLevel,
      shortfall: p.shortfall,
    }))

  function clearFilters() {
    setCategoryFilter('all')
    setStockFilter('all')
  }

  return (
    <>
      <Box sx={FILTER_BAR_STYLE}>
        <TextField
          select
          label="Category"
          size="small"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          sx={{ minWidth: 170 }}
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
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Low and Out of Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
        </TextField>
        <Button onClick={clearFilters}>Clear Filters</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          disabled={rows.length === 0}
          onClick={() => downloadCsv('low-stock-report.csv', LOW_STOCK_COLUMNS, rows)}
        >
          Export CSV
        </Button>
      </Box>
      <Typography sx={{ mb: 1 }}>{rows.length} products need replenishment</Typography>
      <ReportTable columns={LOW_STOCK_COLUMNS} rows={rows} />
    </>
  )
}

function Reports() {
  const [tab, setTab] = useState(0)
  const [products] = useState(() => getProducts())
  const [categories] = useState(() => getCategories())
  const [transactions] = useState(() => getTransactions())

  return (
    <>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(event, newTab) => setTab(newTab)}>
          <Tab label="Current Stock" />
          <Tab label="Stock Movement" />
          <Tab label="Low Stock" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <CurrentStockReport
          products={products}
          categories={categories}
          transactions={transactions}
        />
      )}
      {tab === 1 && <MovementReport products={products} transactions={transactions} />}
      {tab === 2 && (
        <LowStockReport products={products} categories={categories} transactions={transactions} />
      )}
    </>
  )
}

export default Reports