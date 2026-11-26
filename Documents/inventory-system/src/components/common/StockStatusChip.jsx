import { Chip } from '@mui/material'

const COLORS = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'error',
}

function StockStatusChip({ status }) {
  return <Chip label={status} color={COLORS[status] || 'default'} size="small" />
}

export default StockStatusChip