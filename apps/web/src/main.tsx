import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from 'dazo'
import './global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider colorScheme='dark' theme={{
      fontFamily: {
        regular: 'Open Sans',
        medium: 'Open Sans',
        bold: 'Open Sans',
      }
    }}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
