import { useState } from 'react'
import { ThemeProvider } from 'dazo-ui'
import TestingButtons from './TestingButtons'

function ThemeWrappedApp() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')

  return (
    <ThemeProvider colorScheme={colorScheme} theme={{
      fontFamily: {
        regular: 'Open Sans',
        medium: 'Open Sans',
        bold: 'Open Sans',
      }
    }}>
      <div className="App" style={{ 
        backgroundColor: colorScheme === 'dark' ? '#0F0F0F' : '#FFFFFF',
        minHeight: '100vh',
      }}>
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
          <button 
            onClick={() => setColorScheme(s => s === 'light' ? 'dark' : 'light')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: '1px solid #ccc',
              background: colorScheme === 'dark' ? '#333' : '#fff',
              color: colorScheme === 'dark' ? '#fff' : '#000',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {colorScheme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        <TestingButtons />
      </div>
    </ThemeProvider>
  )
}

export default ThemeWrappedApp
