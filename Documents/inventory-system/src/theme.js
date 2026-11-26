import { createTheme } from '@mui/material/styles'

const SANS = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
const headingStyle = { fontFamily: SANS, fontWeight: 700, letterSpacing: '-0.02em' }

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#171717', dark: '#080808', light: '#404040', contrastText: '#ffffff' },
    secondary: { main: '#525252', dark: '#262626', light: '#737373', contrastText: '#ffffff' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#171717', secondary: '#666666' },
    divider: '#e5e5e5',
    success: { main: '#404040' },
    warning: { main: '#737373' },
    error: { main: '#262626' },
    info: { main: '#525252' },
  },
  typography: {
    fontFamily: SANS,
    h1: headingStyle,
    h2: headingStyle,
    h3: headingStyle,
    h4: headingStyle,
    h5: headingStyle,
    h6: headingStyle,
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f5f5f5' },
        '*': { scrollbarColor: '#a3a3a3 #f5f5f5' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 7 },
        containedPrimary: { '&:hover': { backgroundColor: '#404040' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #e5e5e5', boxShadow: '0 2px 10px rgba(0,0,0,0.035)' },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: '#171717',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #d4d4d4',
        },
        root: { borderColor: '#e5e5e5' },
      },
    },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 7, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1 } },
      },
    },
  },
})

export default theme
