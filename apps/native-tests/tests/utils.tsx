import { render } from '@testing-library/react-native'
import { ThemeProvider } from 'dazo-ui'
import type { ReactElement } from 'react'
import { AccessibilityInfo, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import { jest } from '@jest/globals'

/** Renders inside a ThemeProvider, like every app does. */
export const renderWithTheme = (ui: ReactElement, colorScheme: 'light' | 'dark' = 'light') =>
  render(<ThemeProvider colorScheme={colorScheme}>{ui}</ThemeProvider>)

/** Turns the system "Reduce motion" setting on for the next render. */
export const reduceMotion = (): void => {
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true)
}

/** A host element's style, flattened the way React Native draws it. */
export const styleOf = (element: { props: { style?: unknown } }): ViewStyle =>
  StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>) ?? {}
