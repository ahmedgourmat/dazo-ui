import { Container, ThemeProvider } from 'dazo'
import { ButtonsSection } from './showcase/sections/ButtonsSection'
import { FormSection } from './showcase/sections/FormSection'
import { HeroSection } from './showcase/sections/HeroSection'
import { TableSection } from './showcase/sections/TableSection'
import { TextContainerSection } from './showcase/sections/TextContainerSection'

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider colorScheme='system'>
      <Container
        scrollable
        backgroundColor='#e2e8f0'
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