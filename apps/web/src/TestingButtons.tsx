import { Container } from 'dazo'
import { ButtonsSection } from './showcase/sections/ButtonsSection'
import { FormSection } from './showcase/sections/FormSection'
import { HeroSection } from './showcase/sections/HeroSection'
import { TableSection } from './showcase/sections/TableSection'
import { TextContainerSection } from './showcase/sections/TextContainerSection'

const TestingButtons = () => {
  return (
    <Container
      scrollable
      padding='xl'
      backgroundColor='#e2e8f0'
      style={{
        backgroundImage: 'radial-gradient(circle at 15% 0%, rgba(59,130,246,0.14), transparent 40%), radial-gradient(circle at 85% 5%, rgba(14,165,233,0.16), transparent 35%)',
      } as any}
    >
      <Container maxWidth={1280} style={{ width: '100%', alignSelf: 'center' } as any}>
        <HeroSection />
        <ButtonsSection />
        <TextContainerSection />
        <FormSection />
        <TableSection />
      </Container>
    </Container>
  )
}

export default TestingButtons
