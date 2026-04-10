import { Container, Text } from 'dazo-ui'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Container, Text } from 'dazo-ui'

<Text variant='title'>Title</Text>
<Text variant='subtitle'>Subtitle</Text>
<Text variant='caption'>Caption</Text>

<Container backgroundColor='#EEF2FF' padding='md' borderRadius='md'>
  <Text variant='caption'>Analytics</Text>
  <Text variant='title'>1,284</Text>
</Container>`

export const TextContainerSection = (): React.JSX.Element => {
  return (
    <ShowcaseSection
      title='Text + Containers'
      subtitle='Typography and card layouts with spacing utilities.'
      codeTitle='text-container.tsx'
      code={code}
    >
      <Text variant='title' marginBottom='xs'>Title Variant</Text>
      <Text variant='subtitle' color='#334155' marginBottom='xs'>Subtitle Variant</Text>
      <Text marginBottom='xs'>Default body text for regular content.</Text>
      <Text variant='caption' color='#64748b' marginBottom='md'>Caption helper text.</Text>

      <Container flexDirection='row' flexWrap='wrap' gap='sm'>
        <Container backgroundColor='#eef2ff' padding='md' borderRadius='md' minWidth={150}>
          <Text variant='caption' color='#3730a3'>Analytics</Text>
          <Text variant='title' color='#1e1b4b'>1,284</Text>
        </Container>
        <Container backgroundColor='#ecfdf5' padding='md' borderRadius='md' minWidth={150}>
          <Text variant='caption' color='#065f46'>Revenue</Text>
          <Text variant='title' color='#064e3b'>$9.8k</Text>
        </Container>
      </Container>
    </ShowcaseSection>
  )
}
