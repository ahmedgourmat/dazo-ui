'use client'

import { useRef } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { getStyleSheet, type StyleElementProps } from './index'

export type DazoStylesProps = StyleElementProps

/**
 * Next.js App Router: sends dazo-ui's CSS with the server-rendered HTML, so
 * pages are styled before JavaScript loads. Render it once in the root layout.
 *
 * @example
 * // app/layout.tsx
 * import { DazoStyles } from 'dazo-ui/next'
 *
 * <body>
 *   <DazoStyles />
 *   {children}
 * </body>
 */
export const DazoStyles = ({ nonce }: DazoStylesProps): null => {
  // Next calls this each time it sends part of the page. The sheet only grows,
  // so a copy is sent only when it has changed since the last one.
  const sent = useRef('')
  useServerInsertedHTML(() => {
    const { id, textContent } = getStyleSheet()
    if (textContent === sent.current) return null
    sent.current = textContent
    return <style id={id} nonce={nonce} dangerouslySetInnerHTML={{ __html: textContent }} />
  })
  return null
}
