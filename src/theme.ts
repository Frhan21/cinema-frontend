import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#E50914', contrastText: '#FFFFFF' },
    secondary: { main: '#F5F3EF', contrastText: '#070707' },
    background: { default: '#070707', paper: '#141414' },
    text: { primary: '#F5F3EF', secondary: '#B3B3B3' },
    error: { main: '#FF4D57' },
  },
  typography: {
    fontFamily: 'Manrope, sans-serif',
    h1: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 800, letterSpacing: '-0.04em' },
    h2: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 750, letterSpacing: '-0.035em' },
    h3: { fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 700, letterSpacing: '-0.025em' },
    button: { fontFamily: 'Manrope, sans-serif', fontWeight: 800, textTransform: 'none' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { minHeight: 44, paddingInline: 22, borderRadius: 4, transition: 'transform 180ms cubic-bezier(.16,1,.3,1), background-color 180ms ease' },
        containedPrimary: { boxShadow: '0 12px 34px rgba(229,9,20,.24)' },
      },
    },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none', border: '1px solid rgba(255,255,255,.08)' } } },
    MuiDialog: { styleOverrides: { paper: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
  },
})
