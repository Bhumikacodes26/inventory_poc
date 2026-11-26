import { Paper, Typography } from '@mui/material'

function StatCard({ label, value, hint, color = 'primary.main' }) {
  return (
    <Paper sx={{ p: 2.5, borderTop: '3px solid', borderColor: 'secondary.main' }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.2 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ color, fontWeight: 700 }}>
        {value}
      </Typography>
      {hint && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {hint}
        </Typography>
      )}
    </Paper>
  )
}

export default StatCard