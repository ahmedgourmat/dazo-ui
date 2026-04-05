import { Container, Icon, Text } from 'dazo'

export const HeroSection = () => {
  return (
    <Container
      backgroundColor='backgroundSurface'
      borderRadius='md'
      padding='xl'
      marginBottom='lg'
      borderWidth={1}
      borderColor='border'
    >
      <Container flexDirection='row' justifyContent='space-between' alignItems='center' gap='md'>
        <Container flex={1}>
          <Text variant='title' marginBottom='xs'>
            Dazo Web Testing Environment
          </Text>
          <Text variant='default' marginBottom='sm'>
            A landing-style playground showing every library component with polished spacing, colors, and real prop demos.
          </Text>
          <Container flexDirection='row' gap='sm' flexWrap='wrap'>
            <Container backgroundColor='backgroundSunken' borderRadius='md' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption'>Buttons</Text>
            </Container>
            <Container backgroundColor='backgroundSunken' borderRadius='md' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption'>Forms</Text>
            </Container>
            <Container backgroundColor='backgroundSunken' borderRadius='md' paddingHorizontal='sm' paddingVertical='xs'>
              <Text variant='caption'>Table</Text>
            </Container>
          </Container>
        </Container>

        <Container backgroundColor='backgroundSunken' borderRadius='full' padding='md'>
          <Icon name='Sparkles' color='primary' size={34} />
        </Container>
      </Container>
    </Container>
  )
}
