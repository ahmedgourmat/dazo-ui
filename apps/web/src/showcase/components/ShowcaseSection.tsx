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
      borderRadius='lg'
      borderWidth={1}
      padding='lg'
      marginBottom='lg'
    >
      <Text variant='subtitle' marginBottom='xs'>
        {title}
      </Text>
      <Text variant='caption' marginBottom='md'>
        {subtitle}
      </Text>

      <Container flexDirection='row' flexWrap='wrap' gap='md'>
        <Container
          flex={1}
          minWidth={320}
          backgroundColor='backgroundSurface'
          borderRadius='md'
          borderWidth={1}
          borderColor='border'
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
