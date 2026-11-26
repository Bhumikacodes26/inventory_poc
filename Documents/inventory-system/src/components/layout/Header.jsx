import { useLocation } from 'react-router-dom'
import { AppBar, Toolbar, Typography } from '@mui/material'
import navItems from '../../data/navItems'

function Header() {
  const { pathname } = useLocation()

  // Sub-pages like /products/new still show the title of their menu item.
  const current = navItems.find(
    (item) => pathname === item.path || (item.path !== '/' && pathname.startsWith(`${item.path}/`)),
  )
  const title = current ? current.label : 'Inventory Management System'

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        color: 'primary.main',
        borderBottom: '3px solid',
        borderColor: 'secondary.main',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 72 }}>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {today}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header