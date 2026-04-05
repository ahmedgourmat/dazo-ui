import { Container, Text } from 'dazo'
import type { ReactNode } from 'react'
import { CodePanel } from './CodePanel'

type ShowcaseSectionProps = {
  title: string
  subtitle: string
  codeTitle: string
  code: string
  children: ReactNode
}

export const ShowcaseSection = ({
  title,
  subtitle,
  codeTitle,
  code,
  children,
}: ShowcaseSectionProps): React.JSX.Element => {
  return (
    <Container
      borderRadius='lg'
      borderWidth={1}
      padding='lg'
      marginBottom='lg'
    >
      <Text variant='subtitle' color='#0f172a' marginBottom='xs'>
        {title}
      </Text>
      <Text variant='caption' color='#475569' marginBottom='md'>
        {subtitle}
      </Text>

      <Container
        borderRadius='md'
        borderWidth={1}
        padding='md'
        marginBottom='md'
      >
        {children}
      </Container>

      <CodePanel title={codeTitle} code={code} />
    </Container>
  )
}
