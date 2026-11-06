import { Button, Container } from 'dazo-ui'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Button } from 'dazo-ui'

<Button label='Solid' onPress={() => {}} />
<Button variant='outline' label='Outline' onPress={() => {}} />
<Button variant='ghost' label='Ghost' onPress={() => {}} />
<Button size='sm' label='Small' onPress={() => {}} />
<Button size='lg' label='Large' onPress={() => {}} />
<Button disabled label='Disabled' onPress={() => {}} />
<Button loading label='Loading' onPress={() => {}} />`

export const ButtonsSection = (): React.JSX.Element => {
  return (
    <ShowcaseSection
      title='Buttons'
      subtitle='Variants, sizes, and states.'
      codeTitle='buttons.tsx'
      code={code}
    >
      <Container flexDirection='column' flexWrap='wrap' gap='sm'>
        <Button label='Solid' onPress={() => {}} />
        <Button variant='outline' label='Outline' onPress={() => {}} />
        <Button variant='ghost' label='Ghost' onPress={() => {}} />
        <Button size='sm' label='Small' onPress={() => {}} />
        <Button size='md' label='Medium' onPress={() => {}} />
        <Button size='lg' label='Large' onPress={() => {}} />
        <Button disabled label='Disabled' onPress={() => {}} />
        <Button loading label='Loading' onPress={() => {}} />
      </Container>
      <Button
        label='Full Width Action'
        fullWidth
        marginTop='md'
        onPress={() => {}}
      />
    </ShowcaseSection>
  )
}
