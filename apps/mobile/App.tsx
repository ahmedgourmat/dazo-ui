import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Container, ThemeProvider } from 'dazo'
import { ButtonTest } from './ButtonTest'

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider colorScheme='system'>
      <Container>
        <ButtonTest />
      </Container>
      <Container>
        <Button label='hhhhh' />
      </Container>
      <Container scrollable>
        <ButtonTest />
        <ButtonTest />
      </Container>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})