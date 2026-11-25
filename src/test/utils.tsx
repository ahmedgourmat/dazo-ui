import { act, fireEvent, render, type RenderResult } from '@testing-library/react'
import axe from 'axe-core'
import type { ReactElement } from 'react'
import { ThemeProvider } from '../providers'
import { changeSystemScheme, type Scheme } from './match-media'

/** Simulate the operating system switching between light and dark mode. */
export const setSystemColorScheme = (scheme: Scheme): void => {
  act(() => changeSystemScheme(scheme))
}

/**
 * react-native-web keeps an animated Modal on screen until its fade animation
 * ends, and jsdom never runs CSS animations. This ends them by firing
 * the end event on every ancestor of each modal: react-native-web only reacts
 * when the event targets its own animated wrapper, so the others ignore it.
 * jsdom has no AnimationEvent, so React listens for the prefixed
 * `webkitAnimationEnd` name there; both names are fired.
 */
export const finishModalAnimations = (): void => {
  document.querySelectorAll('[aria-modal="true"]').forEach((modal) => {
    for (let el = modal.parentElement; el && el !== document.body; el = el.parentElement) {
      fireEvent.animationEnd(el)
      fireEvent(el, new Event('webkitAnimationEnd', { bubbles: true }))
    }
  })
}

/**
 * Runs axe-core (the checker behind most browser accessibility tools) on the
 * page and returns one readable line per problem, so `expect(...).toEqual([])`
 * prints exactly what is wrong. Two rules are off because they can't work here:
 * color-contrast needs real layout and colors (jsdom has none), and region
 * expects page landmarks, which a single component on its own doesn't have.
 */
export const accessibilityProblems = async (root: Element = document.body): Promise<string[]> => {
  const result = await axe.run(root, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return result.violations.flatMap((violation) =>
    violation.nodes.map((node) => `${violation.id}: ${violation.help} → ${node.html.slice(0, 120)}`),
  )
}

/** '#9333EA' → 'rgb(147, 51, 234)', the form getComputedStyle reports colors in. */
export const hexToRgb = (hex: string): string => {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

/** True when an element is disabled for both pointer and assistive-technology users. */
export const isDisabled = (element: Element): boolean =>
  element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'

/** Render inside a ThemeProvider forced to light mode, so results don't depend on the OS. */
export const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(<ThemeProvider colorScheme='light'>{ui}</ThemeProvider>)
