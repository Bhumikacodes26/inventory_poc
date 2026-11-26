import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StockStatusChip from '../components/common/StockStatusChip'
import { getProductById } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getSuppliers } from '../services/supplierService'
import { getTransactions } from '../services/transactionService'
import { buildProductsWithStock } from '../utils/inventoryUtils'
import { formatDateTime, formatMoney, getTransactionNote } from '../utils/formatters'

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value || '-'}</Typography>
    </Box>
  )
}

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)

  if (!product) {
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

  const transactions = getTransactions()
  const category = getCategories().find((c) => c.id === product.categoryId)
  const supplier = getSuppliers().find((s) => s.id === product.supplierId)
  const withStock = buildProductsWithStock([product], transactions)[0]

  const latest = transactions
    .filter((t) => t.productId === product.id)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 10)

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Button onClick={() => navigate('/products')}>Back</Button>
        <Button variant="outlined" onClick={() => navigate(`/products/${product.id}/edit`)}>
          Edit
        </Button>
        <Button variant="contained" onClick={() => navigate(`/transactions?productId=${product.id}`)}>
          View all transactions
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {product.name}
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          <InfoItem label="Product Code" value={product.code} />
          <InfoItem label="Category" value={category ? category.name : 'Unknown'} />
          <InfoItem label="Supplier" value={supplier ? supplier.name : 'Unknown'} />
          <InfoItem label="Unit" value={product.unit} />
          <InfoItem label="Unit Cost" value={formatMoney(product.unitCost)} />
          <InfoItem label="Opening Stock" value={String(product.openingStock)} />
          <InfoItem label="Reorder Level" value={String(product.reorderLevel)} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Box>
              <Chip
                label={product.status}
                color={product.status === 'Active' ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <InfoItem label="Description" value={product.description} />
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          <InfoItem label="Available Stock" value={String(withStock.availableStock)} />
          <InfoItem label="Inventory Value" value={formatMoney(withStock.inventoryValue)} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Stock Status
            </Typography>
            <Box>
              <StockStatusChip status={withStock.stockStatus} />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Latest 10 transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Change</TableCell>
              <TableCell align="right">Balance After</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latest.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transactions yet
                </TableCell>
              </TableRow>
            )}
            {latest.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{formatDateTime(t.date)}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell align="right">
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
    </>
  )
}

export default ProductDetails