import { Container } from 'dazo-ui'
import { ButtonsSection } from './showcase/sections/ButtonsSection'
import { FeedbackSection } from './showcase/sections/FeedbackSection'
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
      <Container width='100%' alignSelf='center'>
        <HeroSection />
        <ButtonsSection />
        <TextContainerSection />
        <FormSection />
        <FeedbackSection />
        <TableSection />
      </Container>
    </Container>
  )
}

export default TestingButtons
