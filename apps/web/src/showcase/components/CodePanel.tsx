import type { CSSProperties } from 'react'

type CodePanelProps = {
  title: string
  code: string
}

const wrapperStyle: CSSProperties = {
  borderRadius: 14,
  border: '1px solid #1e293b',
  background: '#020617',
  color: '#e2e8f0',
  padding: 16,
  boxShadow: '0 12px 30px rgba(2, 6, 23, 0.25)',
  minHeight: 220,
}

const titleStyle: CSSProperties = {
  margin: '0 0 10px 0',
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#7dd3fc',
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
  return (
    <div style={wrapperStyle}>
      <p style={titleStyle}>{title}</p>
      <pre style={preStyle}>{code}</pre>
    </div>
  )
}
