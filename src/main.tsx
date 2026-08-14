import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { MotionConfig } from 'motion/react'
import App from './App'
import { queryClient } from './lib/query-client'
import { theme } from './theme'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MotionConfig reducedMotion="user" transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
