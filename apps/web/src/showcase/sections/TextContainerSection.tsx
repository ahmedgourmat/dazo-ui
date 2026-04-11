import { Container, Text } from 'dazo-ui'
import { ShowcaseSection } from '../components/ShowcaseSection'

const textContainerCode = `import { Container, Text } from 'dazo-ui'

<Text variant='title'>Title Variant</Text>
<Text variant='subtitle'>Subtitle Variant</Text>
<Text variant='default'>Body content</Text>
<Text variant='caption'>Caption note</Text>

<Container backgroundColor='#EEF2FF' padding='md' borderRadius='md'>
  <Text variant='caption'>Analytics Card</Text>
  <Text variant='title'>1,284</Text>
</Container>`

export const TextContainerSection = () => {
  return (
    <ShowcaseSection
      title='Text + Containers'
      subtitle='Typography hierarchy and card-style layouts using spacing and background props.'
      codeTitle='text-container.tsx'
      code={textContainerCode}
    >
      <Text fontSize={22} variant='title' marginBottom='xs'>
        Title Variant
      </Text>
      <Text variant='subtitle' marginBottom='xs'>
        Subtitle Variant
      </Text>
      <Text variant='default' marginBottom='xs'>
        Default text for body content and paragraph style.
      </Text>
      <Text variant='caption' marginBottom='md'>
        Caption text for helper notes and hints.
      </Text>

      <Container flexDirection='row' flexWrap='wrap' gap='sm'>
        <Container backgroundColor='backgroundSurface' padding='md' borderRadius='md' minWidth={150} borderWidth={1} borderColor='border'>
          <Text variant='caption'>Analytics</Text>
          <Text variant='title'>1,284</Text>
        </Container>
        <Container backgroundColor='backgroundSurface' padding='md' borderRadius='md' minWidth={150} borderWidth={1} borderColor='border'>
          <Text variant='caption'>Revenue</Text>
          <Text variant='title'>$9.8k</Text>
        </Container>
        <Container backgroundColor='backgroundSurface' padding='md' borderRadius='md' minWidth={150} borderWidth={1} borderColor='border'>
          <Text variant='caption'>Tasks</Text>
          <Text variant='title'>24</Text>
        </Container>
      </Container>
    </ShowcaseSection>
  )
}
