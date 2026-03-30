import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from 'dazo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider colorScheme='dark' >
      <App />
    </ThemeProvider>
  </StrictMode>,
)
