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
}: ShowcaseSectionProps) => {
  return (
    <Container
      backgroundColor='#ffffff'
      borderRadius='lg'
      borderWidth={1}
      borderColor='#dbeafe'
      padding='lg'
      marginBottom='lg'
      shadowColor='#0f172a'
      shadowOpacity={0.1}
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 6 }}
    >
      <Text variant='subtitle' color='#0f172a' marginBottom='xs'>
        {title}
      </Text>
      <Text variant='caption' color='#475569' marginBottom='md'>
        {subtitle}
      </Text>

      <Container flexDirection='row' flexWrap='wrap' gap='md'>
        <Container
          flex={1}
          minWidth={320}
          backgroundColor='#f8fafc'
          borderRadius='md'
          borderWidth={1}
          borderColor='#e2e8f0'
          padding='md'
        >
          {children}
        </Container>

        <Container flex={1} minWidth={320}>
          <CodePanel title={codeTitle} code={code} />
        </Container>
      </Container>
    </Container>
  )
}
