import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, bgcolor: 'background.default' }}>
        <Header />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout