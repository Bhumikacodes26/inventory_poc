import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined'
import MoveToInboxOutlined from '@mui/icons-material/MoveToInboxOutlined'
import OutboxOutlined from '@mui/icons-material/OutboxOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined'
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined'

const navItems = [
  { label: 'Dashboard', path: '/', icon: DashboardOutlined },
  { label: 'Products', path: '/products', icon: Inventory2Outlined },
  { label: 'Categories', path: '/categories', icon: CategoryOutlined },
  { label: 'Suppliers', path: '/suppliers', icon: LocalShippingOutlined },
  { label: 'Stock In', path: '/stock-in', icon: MoveToInboxOutlined },
  { label: 'Stock Out', path: '/stock-out', icon: OutboxOutlined },
  { label: 'Stock Adjustment', path: '/stock-adjustment', icon: TuneOutlined },
  { label: 'Transactions', path: '/transactions', icon: ReceiptLongOutlined },
  { label: 'Reports', path: '/reports', icon: AssessmentOutlined },
]

export default navItems