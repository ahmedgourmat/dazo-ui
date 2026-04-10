import { Container, Icon, Text } from 'dazo-ui'

export const HeroSection = (): React.JSX.Element => {
  return (
    <Container
      borderRadius='lg'
      borderWidth={1}
      padding='lg'
      marginBottom='lg'
    >
      <Container flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Container flex={1} marginRight='sm'>
          <Text variant='title' color='#ffffff' marginBottom='xs'>
            dazo-ui Mobile Testing
          </Text>
          <Text color='#cbd5e1' marginBottom='sm'>
            Component playground for mobile with previews and code references.
          </Text>
        </Container>
        <Container backgroundColor='#111827' borderRadius='full' padding='sm'>
          <Icon name='Sparkles' color='#38bdf8' size={26} />
        </Container>
      </Container>
    </Container>
  )
}
