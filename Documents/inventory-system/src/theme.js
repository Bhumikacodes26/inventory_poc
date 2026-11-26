import { createTheme } from '@mui/material/styles'

const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const headingStyle = { fontFamily: SERIF, fontWeight: 700 }

const theme = createTheme({
  palette: {
    primary: { main: '#1f3a5f', dark: '#14243b', light: '#4a6891' },
    secondary: { main: '#b8892b' },
    background: { default: '#f3f1ec', paper: '#ffffff' },
    text: { primary: '#1c2733', secondary: '#5a6675' },
  },
  typography: {
    fontFamily: SANS,
    h1: headingStyle,
    h2: headingStyle,
    h3: headingStyle,
    h4: headingStyle,
    h5: headingStyle,
    h6: headingStyle,
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#14243b',
          borderBottom: '2px solid #b8892b',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
})

export default theme