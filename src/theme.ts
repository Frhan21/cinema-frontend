import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff5f62', contrastText: '#160304' },
    secondary: { main: '#65c9ff' },
    background: { default: '#0d0e0f', paper: '#17191b' },
    text: { primary: '#f6f2f1', secondary: '#b9b2b0' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontFamily: 'Montserrat, sans-serif', fontWeight: 800, letterSpacing: '-0.035em' },
    h3: { fontFamily: 'Montserrat, sans-serif', fontWeight: 750, letterSpacing: '-0.025em' },
    button: { fontFamily: 'Montserrat, sans-serif', fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 44, paddingInline: 20 },
        containedPrimary: { boxShadow: '0 10px 28px rgba(255,95,98,.22)' },
      },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,.075)' } },
    },
  },
})
