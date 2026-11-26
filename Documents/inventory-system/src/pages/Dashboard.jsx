
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
} from '@mui/material'

import {
  Inventory2Outlined,
  CategoryOutlined,
  WarningAmberOutlined,
  RemoveShoppingCartOutlined,
  CurrencyRupeeOutlined,
  TrendingUpOutlined,
  VisibilityOutlined,
  AddBoxOutlined,
  ShoppingCartOutlined,
  AssessmentOutlined,
} from '@mui/icons-material'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import { getProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getTransactions } from "../services/transactionService";

import { buildProductsWithStock } from "../utils/inventoryUtils";
import { formatMoney } from "../utils/formatters";

// Dashboard colors
const COLORS = {
  navy: '#171717',
  blue: '#404040',
  background: '#F5F5F5',
  text: '#171717',
  muted: '#737373',
  border: '#E5E5E5',
  green: '#525252',
  orange: '#737373',
  red: '#262626',
}

// Reusable dashboard statistic card
function StatCard({ title, value, subtitle, icon, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        border: `1px solid ${COLORS.border}`,
        borderRadius: 3,
        transition: '0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.07)',
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="text.secondary" fontSize={13} fontWeight={600}>
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight={800}
            sx={{ mt: 1, color: COLORS.text }}
          >
            {value}
          </Typography>

          <Typography fontSize={12} color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        </Box>

        <Avatar
          sx={{
            width: 50,
            height: 50,
            bgcolor: `${color}15`,
            color: color,
            borderRadius: 2.5,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  )
}

// Main Dashboard
export default function Dashboard() {
  const navigate = useNavigate()

  // Read application data
  const products = useMemo(() => getProducts() || [], [])
  const categories = useMemo(() => getCategories() || [], [])
  const transactions = useMemo(() => getTransactions() || [], [])

  // Calculate product stock
  const productsWithStock = useMemo(
    () => buildProductsWithStock(products, transactions),
    [products, transactions]
  )

  const activeProducts = products.filter(
    (product) => product.status !== 'Inactive'
  )

  const totalProducts = activeProducts.length

  const totalStock = productsWithStock.reduce(
    (total, product) => total + Number(product.availableStock || 0),
    0
  )

  const inventoryValue = productsWithStock.reduce(
    (total, product) =>
      total +
      Number(product.availableStock || 0) *
        Number(product.unitCost || 0),
    0
  )

  const lowStockProducts = productsWithStock.filter(
    (product) =>
      Number(product.availableStock || 0) > 0 &&
      Number(product.availableStock || 0) <=
        Number(product.reorderLevel || 0)
  )

  const outOfStockProducts = productsWithStock.filter(
    (product) => Number(product.availableStock || 0) <= 0
  )

  // Category-wise stock
  const categoryData = categories.map((category) => {
    const categoryProducts = productsWithStock.filter(
      (product) => product.categoryId === category.id
    )

    return {
      name: category.name,
      stock: categoryProducts.reduce(
        (total, product) =>
          total + Number(product.availableStock || 0),
        0
      ),
    }
  })

  // Recent transactions
  const recentTransactions = [...transactions]
    .filter((transaction) => transaction.type !== 'Opening')
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.date || 0) -
        new Date(a.createdAt || a.date || 0)
    )
    .slice(0, 5)

  const getStatus = (product) => {
    const stock = Number(product.availableStock || 0)

    if (stock <= 0) return 'Out of Stock'
    if (stock <= Number(product.reorderLevel || 0)) return 'Low Stock'

    return 'In Stock'
  }

  const statusColor = (status) => {
    if (status === 'Out of Stock') return 'error'
    if (status === 'Low Stock') return 'warning'
    return 'success'
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: COLORS.background,
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Page Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            color={COLORS.navy}
          >
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Welcome back! Here's your inventory overview.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<AssessmentOutlined />}
            onClick={() => navigate('/reports')}
            sx={{ borderRadius: 2 }}
          >
            Reports
          </Button>

          <Button
            variant="contained"
            startIcon={<AddBoxOutlined />}
            onClick={() => navigate('/products')}
            sx={{
              borderRadius: 2,
              bgcolor: COLORS.navy,
              '&:hover': { bgcolor: '#404040' },
            }}
          >
            Products
          </Button>
        </Stack>
      </Stack>

      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          borderRadius: 3,
          color: '#FFFFFF',
          background: 'linear-gradient(110deg, #111111, #404040)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Inventory Overview
            </Typography>

            <Typography sx={{ mt: 1, color: '#E5E5E5' }}>
              Monitor your products, stock levels and inventory value
              from one place.
            </Typography>
          </Box>

          <Inventory2Outlined sx={{ fontSize: 65, opacity: 0.85 }} />
        </Stack>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            subtitle="Active products"
            color={COLORS.blue}
            icon={<Inventory2Outlined />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Stock"
            value={totalStock.toLocaleString('en-IN')}
            subtitle="Available units"
            color={COLORS.green}
            icon={<ShoppingCartOutlined />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Low Stock Items"
            value={lowStockProducts.length}
            subtitle="Need replenishment"
            color={COLORS.orange}
            icon={<WarningAmberOutlined />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Out of Stock"
            value={outOfStockProducts.length}
            subtitle="Currently unavailable"
            color={COLORS.red}
            icon={<RemoveShoppingCartOutlined />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <StatCard
            title="Inventory Value"
            value={formatMoney(inventoryValue)}
            subtitle="Total available stock value"
            color={COLORS.green}
            icon={<CurrencyRupeeOutlined />}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <StatCard
            title="Total Categories"
            value={categories.length}
            subtitle="Product categories"
            color={COLORS.blue}
            icon={<CategoryOutlined />}
          />
        </Grid>
      </Grid>

      {/* Charts and Stock Alerts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={800} color={COLORS.navy}>
              Category-wise Stock
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Available stock across product categories
            </Typography>

            <Box sx={{ width: '100%', height: 300, mt: 2 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5EAF1"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="stock"
                      fill={COLORS.blue}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Stack
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography color="text.secondary">
                    No category data available
                  </Typography>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={800} color={COLORS.navy}>
                Stock Alerts
              </Typography>

              <Chip
                label={`${lowStockProducts.length + outOfStockProducts.length} Alerts`}
                color="warning"
                size="small"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            {productsWithStock
              .filter((product) => getStatus(product) !== 'In Stock')
              .slice(0, 5)
              .map((product) => (
                <Stack
                  key={product.id}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ py: 1.5 }}
                >
                  <Box>
                    <Typography fontWeight={700} fontSize={14}>
                      {product.name}
                    </Typography>

                    <Typography fontSize={12} color="text.secondary">
                      {product.code || product.productCode || 'No product code'}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography fontWeight={800} fontSize={14}>
                      {product.availableStock || 0} units
                    </Typography>

                    <Chip
                      size="small"
                      label={getStatus(product)}
                      color={statusColor(getStatus(product))}
                    />
                  </Box>
                </Stack>
              ))}

            {productsWithStock.filter(
              (product) => getStatus(product) !== 'In Stock'
            ).length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={5}>
                No stock alerts. All products are sufficiently stocked.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          p={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color={COLORS.navy}>
              Recent Transactions
            </Typography>

            <Typography color="text.secondary" fontSize={13}>
              Latest inventory stock movements
            </Typography>
          </Box>

          <Button
            size="small"
            endIcon={<VisibilityOutlined />}
            onClick={() => navigate('/transactions')}
          >
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {recentTransactions.map((transaction, index) => (
                <TableRow key={transaction.id || index} hover>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={14}>
                      {transaction.productName ||
                        transaction.product?.name ||
                        'Product'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={transaction.type || 'Transaction'}
                      color={
                        transaction.type === 'Stock In'
                          ? 'success'
                          : transaction.type === 'Stock Out'
                            ? 'error'
                            : 'default'
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {transaction.quantity ?? transaction.qty ?? '-'}
                  </TableCell>

                  <TableCell>
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString('en-IN')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}

              {recentTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No transactions available yet
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Footer */}
      <Typography
        textAlign="center"
        color="text.secondary"
        fontSize={12}
        sx={{ mt: 3 }}
      >
        Inventory Management System | Dashboard
      </Typography>
    </Box>
  )
}
