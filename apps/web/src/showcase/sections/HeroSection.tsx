import { Container, Icon, Text } from 'dazo'

export const HeroSection = () => {
  return (
    <Container
      backgroundColor='#0f172a'
      borderRadius='lg'
      padding='xl'
      marginBottom='lg'
      borderWidth={1}
      borderColor='#1e3a8a'
    >
      <Container flexDirection='row' justifyContent='space-between' alignItems='center' gap='md'>
        <Container flex={1}>
          <Text variant='title' color='#ffffff' marginBottom='xs'>
            Dazo Web Testing Environment
          </Text>
          <Text color='#cbd5e1' marginBottom='sm'>
            A landing-style playground showing every library component with polished spacing, colors, and real prop demos.
          </Text>
          <Container flexDirection='row' gap='sm' flexWrap='wrap'>
            <Container backgroundColor='#1e293b' borderRadius='full' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption' color='#7dd3fc'>Buttons</Text>
            </Container>
            <Container backgroundColor='#1e293b' borderRadius='full' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption' color='#86efac'>Forms</Text>
            </Container>
            <Container backgroundColor='#1e293b' borderRadius='full' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption' color='#fcd34d'>Table</Text>
            </Container>
          </Container>
        </Container>

        <Container backgroundColor='#0b1120' borderRadius='full' padding='md'>
          <Icon name='Sparkles' color='#38bdf8' size={34} />
        </Container>
      </Container>
    </Container>
  )
}
