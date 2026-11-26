import { IconButton, Tooltip } from '@mui/material'

function ActionIcon({ title, icon: Icon, color = 'default', onClick }) {
  return (
    <Tooltip title={title}>
      <IconButton size="small" color={color} aria-label={title} onClick={onClick}>
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}

export default ActionIcon