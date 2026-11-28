// @vitest-environment node
// Runs like a real server: no DOM, so react-native-web only collects its CSS
// instead of inserting it into a page.
import type { ReactNode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Button, Checkbox, Container, Input, Text, ThemeProvider } from '../index'
import { getStyleElement, getStyleSheet } from './index'

// Next isn't installed here. This stands in for the App Router: it keeps the
// callback DazoStyles registers, like Next does, so the test can call it.
const inserted = vi.hoisted(() => ({ callbacks: [] as (() => ReactNode)[] }))
vi.mock('next/navigation', () => ({
  useServerInsertedHTML: (callback: () => ReactNode) => {
    inserted.callbacks.push(callback)
  },
}))

/** Every class react-native-web put in the HTML, e.g. "r-flexDirection-18u37iz". */
const classesIn = (html: string): string[] => [
  ...new Set([...html.matchAll(/class="([^"]*)"/g)].flatMap((match) => match[1].split(/\s+/)).filter(Boolean)),
]

const page = (
  <ThemeProvider>
    <Container padding='md' gap='sm' backgroundColor='surface'>
      <Text variant='title'>Sign in</Text>
      <Input placeholder='Email' />
      <Checkbox label='Remember me' />
      <Button label='Continue' />
    </Container>
  </ThemeProvider>
)

describe('dazo-ui/server (#77)', () => {
  it('has a rule for every class in the server-rendered HTML, so the page is styled before JavaScript loads', () => {
    const html = renderToString(page)
    const { textContent } = getStyleSheet()
    const classes = classesIn(html)

    expect(classes.length).toBeGreaterThan(10)
    const unstyled = classes.filter((name) => !textContent.includes(`.${name}`))
    expect(unstyled).toEqual([])
  })

  it('uses the id react-native-web looks for in the browser, so it takes over the tag', () => {
    renderToString(page)

    expect(getStyleSheet().id).toBe('react-native-stylesheet')
  })

  it('getStyleElement: a <style> tag with that CSS, and the CSP nonce', () => {
    renderToString(page)
    const { id, textContent } = getStyleSheet()

    const tag = renderToStaticMarkup(getStyleElement({ nonce: 'r4nd0m' }))

    expect(tag.startsWith(`<style id="${id}" nonce="r4nd0m">`)).toBe(true)
    expect(tag).toContain(textContent)
  })
})

describe('dazo-ui/next: DazoStyles (#77)', () => {
  beforeEach(() => {
    inserted.callbacks.length = 0
  })

  const renderWithDazoStyles = async (children: ReactNode) => {
    const { DazoStyles } = await import('./next')
    renderToString(
      <>
        <DazoStyles nonce='r4nd0m' />
        {children}
      </>,
    )
    expect(inserted.callbacks).toHaveLength(1)
    return inserted.callbacks[0]
  }

  it('sends the CSS when Next asks, then nothing until it changes', async () => {
    const flush = await renderWithDazoStyles(page)

    const first = renderToStaticMarkup(<>{flush()}</>)
    expect(first).toContain('<style id="react-native-stylesheet" nonce="r4nd0m">')
    expect(first).toContain(getStyleSheet().textContent)

    expect(flush()).toBeNull()

    // More of the page streams in with styles nobody has used yet.
    renderToString(<Container padding={37} />)
    expect(renderToStaticMarkup(<>{flush()}</>)).toContain(getStyleSheet().textContent)
  })
})
