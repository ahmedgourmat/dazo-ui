import { Button, Container, Icon } from 'dazo'
import { ShowcaseSection } from '../components/ShowcaseSection'

const buttonCode = `import { Button, Icon } from 'dazo'

<Button label='Solid' onPress={() => {}} />
<Button variant='outline' label='Outline' onPress={() => {}} />
<Button variant='ghost' label='Ghost' onPress={() => {}} />
<Button size='sm' label='Small' onPress={() => {}} />
<Button size='md' label='Medium' onPress={() => {}} />
<Button size='lg' label='Large' onPress={() => {}} />
<Button disabled label='Disabled' onPress={() => {}} />
<Button loading label='Loading' onPress={() => {}} />
<Button fullWidth label='CTA' leftIcon={<Icon name='Rocket' />} onPress={() => {}} />`

export const ButtonsSection = () => {
  return (
    <ShowcaseSection
      title='Buttons'
      subtitle='Variants, states, and icon placements with spacing presets.'
      codeTitle='buttons.tsx'
      code={buttonCode}
    >
      <Container flexDirection='row' flexWrap='wrap' alignItems='center' justifyContent='center' gap='sm' >
        <Button label='Solid Button' leftIcon={<Icon name='Check' color='red' />} onPress={() => {}}  />
        <Button variant='outline' label='Outline Button' rightIcon={<Icon name='ArrowRight' />} onPress={() => {}} />
        <Button variant='ghost' label='Ghost Button' onPress={() => {}} />
        <Button size='sm' label='Small' onPress={() => {}} />
        <Button size='md' label='Medium' onPress={() => {}} />
        <Button size='lg' label='Large' onPress={() => {}} />
        <Button disabled label='Disabled' onPress={() => {}} />
        <Button loading label='Loading' onPress={() => {}} />
      </Container>

      <Button
        label='Full Width Call To Action'
        fullWidth
        marginTop='md'
        leftIcon={<Icon name='Rocket' />}
        onPress={() => {}}
      />
    </ShowcaseSection>
  )
}
