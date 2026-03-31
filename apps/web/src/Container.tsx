import { Button, Container, Text } from 'dazo'

const TestingContainer = () => {
  return (
    <Container
      paddingHorizontal="md"
      paddingVertical="lg"
      backgroundColor="#f0f0f0"
      borderRadius="md"
      borderWidth={1}
      borderColor="#ccc"

    >
      <Container>
        <Button label='hhhhh' />
      </Container>
      <Text
        color='black'
        variant="title"
        backgroundColor='white'
      >
        This is a test text to check the styling of the Container component. It should have padding, background color, border radius, and border as defined in the Container props.
      </Text>
      <Text
        color='black'
        variant="subtitle"
      >
        This is a test text to check the styling of the Container component. It should have padding, background color, border radius, and border as defined in the Container props.
      </Text>
      <Text
        color='black'
        variant="caption"
      >
        This is a test text to check the styling of the Container component. It should have padding, background color, border radius, and border as defined in the Container props.
      </Text>
    </Container>
  )
}

export default TestingContainer
