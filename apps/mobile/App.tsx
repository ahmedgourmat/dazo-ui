import { Container, ThemeProvider } from 'dazo-ui'
import { ButtonsSection } from './showcase/sections/ButtonsSection'
import { FormSection } from './showcase/sections/FormSection'
import { HeroSection } from './showcase/sections/HeroSection'
import { TableSection } from './showcase/sections/TableSection'
import { TextContainerSection } from './showcase/sections/TextContainerSection'

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider colorScheme='dark' theme={{
      fontFamily: {
        regular: 'Open Sans',
        medium: 'Open Sans',
        bold: 'Open Sans',
      }
    }}>
      <Container
        scrollable
        backgroundColor='background'
        padding='lg'
        paddingBottom='xxl'
      >
        <Container maxWidth={840} style={{ width: '100%', alignSelf: 'center' } as any}>
          <HeroSection />
          <ButtonsSection />
          <TextContainerSection />
          <FormSection />
          <TableSection />
        </Container>
      </Container>
    </ThemeProvider>
  )
}