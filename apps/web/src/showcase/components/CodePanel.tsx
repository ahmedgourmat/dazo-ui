import type { CSSProperties } from 'react'
import { useTheme } from 'dazo-ui'

type CodePanelProps = {
  title: string
  code: string
}

const preStyle: CSSProperties = {
  margin: 0,
  overflowX: 'auto',
  fontSize: 12,
  lineHeight: 1.6,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace',
  whiteSpace: 'pre',
}

export const CodePanel = ({ title, code }: CodePanelProps) => {
  const theme = useTheme()

  const wrapperStyle: CSSProperties = {
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.backgroundSunken,
    color: theme.colors.textPrimary,
    padding: theme.spacing.md,
    minHeight: 220,
  }

  const titleStyle: CSSProperties = {
    margin: '0 0 10px 0',
    fontSize: 12,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: theme.colors.primary,
  }

  return (
    <div style={wrapperStyle}>
      <p style={titleStyle}>{title}</p>
      <pre style={preStyle}>{code}</pre>
    </div>
  )
}
