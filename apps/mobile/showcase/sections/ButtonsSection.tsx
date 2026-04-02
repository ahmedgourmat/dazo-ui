import { Button, Container, Icon } from 'dazo'
import { ShowcaseSection } from '../components/ShowcaseSection'

const code = `import { Button, Icon } from 'dazo'

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
      subtitle='Variants, sizes, states, and icon placements.'
      codeTitle='buttons.tsx'
      code={code}
    >
      <Container flexDirection='row' flexWrap='wrap' gap='sm'>
        <Button label='Solid' leftIcon={<Icon name='Check' />} onPress={() => {}} />
        <Button variant='outline' label='Outline' rightIcon={<Icon name='ArrowRight' />} onPress={() => {}} />
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
        leftIcon={<Icon name='Rocket' />}
        onPress={() => {}}
      />
    </ShowcaseSection>
  )
}
