import { Container } from 'dazo-ui'
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
    >
      <Container style={{ width: '100%', alignSelf: 'center' } as any}>
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
