import { NavLink } from 'react-router-dom'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import navItems from '../../data/navItems'

const DRAWER_WIDTH = 260

function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'primary.dark',
          color: '#dbe4f0',
          border: 'none',
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 3,
          textAlign: 'center',
          borderBottom: '3px solid',
          borderColor: 'secondary.main',
        }}
      >
        <Inventory2Icon sx={{ fontSize: 38, color: 'secondary.main' }} />
        <Typography variant="h6" sx={{ color: '#ffffff', lineHeight: 1.25, mt: 1 }}>
          Inventory Management System
        </Typography>
        <Typography
          variant="caption"
          sx={{ letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}
        >
          Stock Control
        </Typography>
      </Box>

      <List sx={{ py: 2 }}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              end={item.path === '/'}
              sx={{
                mx: 1.5,
                mb: 0.5,
                borderRadius: 1,
                color: '#dbe4f0',
                '& .MuiListItemIcon-root': { color: 'rgba(255,255,255,0.65)', minWidth: 40 },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                '&.active': {
                  bgcolor: 'rgba(255,255,255,0.14)',
                  color: '#ffffff',
                  boxShadow: (theme) => `inset 4px 0 0 ${theme.palette.secondary.main}`,
                },
                '&.active .MuiListItemIcon-root': { color: 'secondary.main' },
                '&.active .MuiListItemText-primary': { fontWeight: 700 },
              }}
            >
              <ListItemIcon>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Proof of Concept
        </Typography>
      </Box>
    </Drawer>
  )
}

export default Sidebar