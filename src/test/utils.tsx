import { act, fireEvent, render, type RenderResult } from '@testing-library/react'
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

/** Render inside a ThemeProvider forced to light mode, so results don't depend on the OS. */
export const renderWithTheme = (ui: ReactElement): RenderResult =>
  render(<ThemeProvider colorScheme='light'>{ui}</ThemeProvider>)
