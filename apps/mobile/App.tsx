import { View, StyleSheet } from 'react-native'
import { ThemeProvider } from 'dazo'
import { ButtonTest } from './ButtonTest'

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider colorScheme='system'>
      <View style={styles.container}>
        <ButtonTest />
      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
  },
})