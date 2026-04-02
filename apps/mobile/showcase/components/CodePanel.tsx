import { StyleSheet, Text, View } from 'react-native'

type CodePanelProps = {
  title: string
  code: string
}

export const CodePanel = ({ title, code }: CodePanelProps): React.JSX.Element => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.code}>{code}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#020617',
    padding: 14,
  },
  title: {
    color: '#7dd3fc',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontWeight: '700',
  },
  code: {
    color: '#e2e8f0',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
})
