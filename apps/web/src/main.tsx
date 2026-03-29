import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'dazo'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider colorScheme='dark' >
      <App />
    </ThemeProvider>
  </StrictMode>,
)
