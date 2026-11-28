import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Container, ThemeProvider } from 'dazo-ui'
import { Fixtures } from './Fixtures'

// ?scheme=dark renders the dark theme. The font is bundled rather than taken
// from the system, so the screenshots don't change with the machine's fonts.
const scheme = new URLSearchParams(location.search).get('scheme') === 'dark' ? 'dark' : 'light'
const font = 'Inter, sans-serif'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider colorScheme={scheme} theme={{ fontFamily: { regular: font, medium: font, bold: font } }}>
      {/* react-native-web passes CSS units through; React Native's types only know numbers. */}
      <Container backgroundColor='background' padding='lg' style={{ minHeight: '100vh' as unknown as number }}>
        <Fixtures />
      </Container>
    </ThemeProvider>
  </StrictMode>,
)
