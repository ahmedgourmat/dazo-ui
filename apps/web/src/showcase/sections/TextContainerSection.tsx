import { Container, Text } from 'dazo'
import { ShowcaseSection } from '../components/ShowcaseSection'

const textContainerCode = `import { Container, Text } from 'dazo'

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
      <Text variant='title' marginBottom='xs'>
        Title Variant
      </Text>
      <Text variant='subtitle' color='#334155' marginBottom='xs'>
        Subtitle Variant
      </Text>
      <Text variant='default' marginBottom='xs'>
        Default text for body content and paragraph style.
      </Text>
      <Text variant='caption' color='#64748b' marginBottom='md'>
        Caption text for helper notes and hints.
      </Text>

      <Container flexDirection='row' flexWrap='wrap' gap='sm'>
        <Container backgroundColor='#eef2ff' padding='md' borderRadius='md' minWidth={150}>
          <Text variant='caption' color='#3730a3'>Analytics</Text>
          <Text variant='title' color='#1e1b4b'>1,284</Text>
        </Container>
        <Container backgroundColor='#ecfdf5' padding='md' borderRadius='md' minWidth={150}>
          <Text variant='caption' color='#065f46'>Revenue</Text>
          <Text variant='title' color='#064e3b'>$9.8k</Text>
        </Container>
        <Container backgroundColor='#fff7ed' padding='md' borderRadius='md' minWidth={150}>
          <Text variant='caption' color='#9a3412'>Tasks</Text>
          <Text variant='title' color='#7c2d12'>24</Text>
        </Container>
      </Container>
    </ShowcaseSection>
  )
}
