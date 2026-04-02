import { Container, Icon, Text } from 'dazo'

export const HeroSection = (): React.JSX.Element => {
  return (
    <Container
      backgroundColor='#0f172a'
      borderRadius='lg'
      borderWidth={1}
      borderColor='#1d4ed8'
      padding='lg'
      marginBottom='lg'
    >
      <Container flexDirection='row' justifyContent='space-between' alignItems='center'>
        <Container flex={1} marginRight='sm'>
          <Text variant='title' color='#ffffff' marginBottom='xs'>
            Dazo Mobile Testing
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
