import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Container, Text, ThemeProvider } from 'dazo'
import { ButtonTest } from './ButtonTest'

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider colorScheme='system'>
      <Container scrollable padding={20} paddingBottom={40}>
        <ButtonTest />
        <ButtonTest />
        <Text
          letters={80}
          marginBottom={20}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
          iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
          tristique tortor pretium ut. Curabitur elit justo, consequat id
          condimentum ac, volutpat ornare.
        </Text>
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