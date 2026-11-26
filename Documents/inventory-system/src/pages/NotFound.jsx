import { Link } from 'react-router-dom'
import { Alert, Button } from '@mui/material'

function NotFound() {
  return (
    <>
      <Alert severity="warning" sx={{ mb: 2 }}>
        Page not found. The address may be wrong, or this page is not built yet.
      </Alert>
      <Button component={Link} to="/" variant="contained">
        Go to Dashboard
      </Button>
    </>
  )
}

export default NotFound